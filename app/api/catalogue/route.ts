import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { defaultCatalogue, validateCatalogue } from "@/lib/catalogue";

export async function GET() {
  try {
    const snapshot = await firestore().collection("siteSettings").doc("catalogue").get();
    const catalogue = snapshot.exists ? validateCatalogue(snapshot.data()) : defaultCatalogue;
    if (!catalogue) throw new HttpError(500, "Catalogue data is invalid.");
    return NextResponse.json({ catalogue }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const catalogue = validateCatalogue(await request.json());
    if (!catalogue) throw new HttpError(400, "Check all fields and ensure price ranges start at 1 and follow consecutively without gaps or overlaps.");
    await firestore().collection("siteSettings").doc("catalogue").set({ ...catalogue, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ catalogue }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}
