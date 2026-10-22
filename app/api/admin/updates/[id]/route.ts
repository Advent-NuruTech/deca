import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { validateUpdate, validateUpdateId } from "@/lib/admin-updates";
import { d1First, d1Run } from "@/lib/d1";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const id = validateUpdateId((await params).id);
    const { title, content } = validateUpdate(await request.json());
    const result = await d1Run("UPDATE admin_updates SET title = ?, content = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?", [title, content, id]);
    if (Number(result.meta?.changes ?? 0) === 0) throw new HttpError(404, "Update not found.");
    return NextResponse.json({ id, title, content });
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const id = validateUpdateId((await params).id);
    if (!(await d1First("SELECT id FROM admin_updates WHERE id = ?", [id]))) throw new HttpError(404, "Update not found.");
    await d1Run("DELETE FROM admin_updates WHERE id = ?", [id]);
    return NextResponse.json({ message: "Update deleted." });
  } catch (error) { return errorResponse(error); }
}
