import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, requireAdmin } from "@/lib/auth";
import { validateUpdate } from "@/lib/admin-updates";
import { d1All, d1Run } from "@/lib/d1";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const updates = await d1All("SELECT id, title, content, created_at AS createdAt, updated_at AS updatedAt FROM admin_updates ORDER BY created_at DESC, id DESC LIMIT 200");
    return NextResponse.json({ updates }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { title, content } = validateUpdate(await request.json());
    const id = randomUUID();
    await d1Run("INSERT INTO admin_updates (id, title, content) VALUES (?, ?, ?)", [id, title, content]);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
