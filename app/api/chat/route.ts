import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/auth";
import { PUBLIC_CACHE_CONTROL } from "@/lib/cache-tags";
import { getCachedChatSettings } from "@/lib/chat-settings";

export async function GET() {
  try {
    return NextResponse.json(await getCachedChatSettings(), {
      headers: { "Cache-Control": PUBLIC_CACHE_CONTROL },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
