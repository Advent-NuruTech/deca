import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { buildObjectKey, deleteFromR2, uploadToR2 } from "@/lib/r2";
import {
  attachmentHeader,
  STUDY_MATERIAL_FOLDER,
  studyMaterialUrl,
  validateStudyDocument,
  validateStudyMaterialKey,
} from "@/lib/study-materials";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new HttpError(400, "A multipart document upload is required");
    }
    const document = form.get("file") ?? form.get("document");
    if (!(document instanceof File)) throw new HttpError(400, "No document file was provided");
    const { name, contentType } = validateStudyDocument(document);
    const key = buildObjectKey(STUDY_MATERIAL_FOLDER, name);
    await uploadToR2(key, Buffer.from(await document.arrayBuffer()), contentType, {
      contentDisposition: attachmentHeader(name),
      metadata: { "original-name": encodeURIComponent(name) },
    });
    return NextResponse.json(
      {
        message: "Document uploaded successfully",
        key,
        fileKey: key,
        fileName: name,
        fileType: contentType,
        fileUrl: studyMaterialUrl(key),
        url: studyMaterialUrl(key),
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A JSON body containing key is required");
    }
    const key = validateStudyMaterialKey(
      body && typeof body === "object" && "key" in body ? (body as { key: unknown }).key : undefined,
    );
    await deleteFromR2(key);
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
