import { NextResponse } from "next/server";
import { firestore } from "@/lib/firestore";
import { defaultLifeSkillsSettings, validateLifeSkillsSettings } from "@/lib/life-skills";

export async function GET() {
  try {
    const snapshot = await firestore().collection("siteSettings").doc("lifeSkills").get();
    const settings = validateLifeSkillsSettings(snapshot.data()) ?? defaultLifeSkillsSettings;
    return NextResponse.json({ settings }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
  } catch {
    return NextResponse.json({ settings: defaultLifeSkillsSettings });
  }
}
