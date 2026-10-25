import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { defaultLifeSkillsSettings, validateLifeSkillsSettings } from "@/lib/life-skills";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const snapshot = await firestore().collection("siteSettings").doc("lifeSkills").get();
    return NextResponse.json({ settings: validateLifeSkillsSettings(snapshot.data()) ?? defaultLifeSkillsSettings }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const settings = validateLifeSkillsSettings(await request.json());
    if (!settings) throw new HttpError(400, "Enter four complete pathways and at least one item in each list.");
    await firestore().collection("siteSettings").doc("lifeSkills").set({ ...settings, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ settings });
  } catch (error) { return errorResponse(error); }
}
