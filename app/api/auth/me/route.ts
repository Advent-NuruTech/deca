import { NextResponse, type NextRequest } from "next/server";
import { errorResponse, requireAuth } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { firestore } from "@/lib/firestore";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const profile = await requireAuth(request);
    const account = await adminAuth().getUser(profile.uid);
    if (account.email && account.email !== profile.email) {
      await firestore().collection("users").doc(profile.uid).update({ email: account.email, updatedAt: FieldValue.serverTimestamp() });
      profile.email = account.email;
    }
    return NextResponse.json(profile);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const profile = await requireAuth(request);
    const body: unknown = await request.json().catch(() => null);
    const name = typeof body === "object" && body !== null && "name" in body && typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 120) return NextResponse.json({ message: "Enter a name of up to 120 characters." }, { status: 400 });
    await firestore().collection("users").doc(profile.uid).update({ name, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ...profile, name });
  } catch (error) { return errorResponse(error); }
}
