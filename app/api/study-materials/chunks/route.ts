import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { buildObjectKey, deleteFromR2, getR2Object, uploadToR2 } from "@/lib/r2";
import { attachmentHeader, MAX_STUDY_MATERIAL_BYTES, STUDY_MATERIAL_FOLDER, studyMaterialUrl, validateStudyDocument } from "@/lib/study-materials";
export const runtime = "nodejs";
export const maxDuration = 60;
const CHUNK_SIZE = 1024 * 1024;
function prefix(uid: string, id: unknown) {
  if (typeof id !== "string" || !/^[a-f0-9-]{36}$/i.test(id)) throw new HttpError(400, "Invalid upload session");
  return `study-upload-parts/${encodeURIComponent(uid)}/${id}/`;
}
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    const form = await request.formData();
    const base = prefix(user.uid, form.get("id"));
    const index = Number(form.get("index"));
    const chunk = form.get("chunk");
    if (!Number.isInteger(index) || index < 0 || index >= 20 || !(chunk instanceof File) || chunk.size < 1 || chunk.size > CHUNK_SIZE) throw new HttpError(400, "Invalid upload chunk");
    await uploadToR2(`${base}${index}`, Buffer.from(await chunk.arrayBuffer()), "application/octet-stream");
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    const { id, name, size, type } = await request.json();
    const base = prefix(user.uid, id);
    if (typeof name !== "string" || typeof type !== "string" || !Number.isInteger(size) || size <= 0 || size > MAX_STUDY_MATERIAL_BYTES) throw new HttpError(400, "Invalid document details");
    const { name: safeName, contentType } = validateStudyDocument({ name, type, size } as File);
    const count = Math.ceil(size / CHUNK_SIZE);
    const chunks = await Promise.all(Array.from({ length: count }, async (_, index) => {
      const object = await getR2Object(`${base}${index}`);
      const bytes = object.Body && await object.Body.transformToByteArray();
      const expected = index === count - 1 ? size - index * CHUNK_SIZE : CHUNK_SIZE;
      if (!bytes || bytes.length !== expected) throw new HttpError(400, "An upload part is missing or incomplete. Please try again.");
      return bytes;
    }));
    const key = buildObjectKey(STUDY_MATERIAL_FOLDER, safeName, id);
    await uploadToR2(key, Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))), contentType, { contentDisposition: attachmentHeader(safeName), metadata: { "original-name": encodeURIComponent(safeName) } });
    await Promise.allSettled(chunks.map((_, index) => deleteFromR2(`${base}${index}`)));
    return NextResponse.json({ fileKey: key, fileName: safeName, fileType: contentType, fileUrl: studyMaterialUrl(key) }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    const { id } = await request.json();
    const base = prefix(user.uid, id);
    await Promise.allSettled(Array.from({ length: 20 }, (_, index) => deleteFromR2(`${base}${index}`)));
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
