import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/auth";
import { getCachedChatSettings } from "@/lib/chat-settings";

export async function GET() {
  try {
    return NextResponse.json(await getCachedChatSettings(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
