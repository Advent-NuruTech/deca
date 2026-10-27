import { NextRequest, NextResponse } from "next/server";
import { errorResponse, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const snapshot = await firestore().collection("programmeInvitations").orderBy("createdAt", "desc").limit(100).get();
    const invitations = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
    return NextResponse.json({ invitations }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
