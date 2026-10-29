import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/auth";
import { readChatSettings } from "@/lib/chat-settings";

export async function GET() {
  try {
    return NextResponse.json(await readChatSettings(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
