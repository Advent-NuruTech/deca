import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const docs = await firestore().collection("users").doc(user.uid).collection("addresses").get();
    return NextResponse.json({ addresses: docs.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const fields = ["street", "city", "county", "postalCode", "phone"] as const;
    if (fields.some((key) => typeof body[key] !== "string" || body[key].length > 240) || fields.slice(0, 3).some((key) => !body[key].trim()) || !body.phone.trim() || !/^[0-9+\-\s()]+$/.test(body.phone)) throw new HttpError(400, "Enter a valid address and phone number");
    if (body.id !== undefined && (typeof body.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(body.id))) throw new HttpError(400, "Invalid address");
    const collection = firestore().collection("users").doc(user.uid).collection("addresses");
    const ref = body.id ? collection.doc(body.id) : collection.doc();
    if (body.id && !(await ref.get()).exists) throw new HttpError(404, "Address not found");
    const data = Object.fromEntries(fields.map((key) => [key, body[key].trim()]));
    await ref.set(data);
    return NextResponse.json({ id: ref.id, ...data });
  } catch (error) { return errorResponse(error); }
}
