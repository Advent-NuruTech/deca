import { NextResponse, type NextRequest } from "next/server";
import { errorResponse, requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await requireAuth(request));
  } catch (error) {
    return errorResponse(error);
  }
}
