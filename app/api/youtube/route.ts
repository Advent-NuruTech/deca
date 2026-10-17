import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/auth";
import { getChannels, listVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  try {
    const slot = Number(request.nextUrl.searchParams.get("channel") || "1");
    if (slot !== 1 && slot !== 2) throw new HttpError(400, "Invalid channel.");
    const token = request.nextUrl.searchParams.get("pageToken") || "";
    if (token.length > 256 || (token && !/^[A-Za-z0-9_=-]+$/.test(token))) throw new HttpError(400, "Invalid page token.");
    const limit = request.nextUrl.searchParams.get("preview") === "1" ? 4 : 24;
    const channel = (await getChannels())[slot - 1];
    if (!channel) return NextResponse.json({ channel: null, videos: [], nextPageToken: null, prevPageToken: null });
    const data = await listVideos(channel, slot, token, limit);
    return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=300" } });
  } catch (error) { return errorResponse(error); }
}
