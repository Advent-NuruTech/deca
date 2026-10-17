import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { readChannels, resolveChannel, YOUTUBE_SETTINGS_TAG } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  try { await requireAdmin(request); return NextResponse.json({ channels: await readChannels() }); }
  catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => null) as { links?: unknown } | null;
    if (!Array.isArray(body?.links) || body.links.length !== 2 || body.links.some((link: unknown) => typeof link !== "string" || link.length > 500)) throw new HttpError(400, "Provide two channel links.");
    const channels = await Promise.all(body.links.map((link: string, index: number) => link.trim() ? resolveChannel(link, index + 1) : Promise.resolve(null)));
    await firestore().collection("settings").doc("youtube").set({ channels });
    revalidateTag(YOUTUBE_SETTINGS_TAG, { expire: 0 });
    return NextResponse.json({ channels });
  } catch (error) { return errorResponse(error); }
}
