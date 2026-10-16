import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { deleteFromR2, getR2Object } from "@/lib/r2";
import { attachmentHeader, validateStudyMaterialKey } from "@/lib/study-materials";

export const runtime = "nodejs";

function filenameFromObject(key: string, metadata?: Record<string, string>): string {
  const encoded = metadata?.["original-name"];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      // Fall back to the managed object name.
    }
  }
  return key.split("/").pop()?.replace(/^\d+_/, "") || "study-material";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key: segments } = await params;
    const key = validateStudyMaterialKey(segments.join("/"));
    let object;
    try {
      object = await getR2Object(key);
    } catch (error) {
      const name = error && typeof error === "object" && "name" in error ? String(error.name) : "";
      if (name === "NoSuchKey" || name === "NotFound") throw new HttpError(404, "Document not found");
      throw error;
    }
    if (!object.Body) throw new HttpError(404, "Document not found");

    const headers = new Headers({
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Content-Disposition": attachmentHeader(filenameFromObject(key, object.Metadata)),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (object.ContentLength !== undefined) headers.set("Content-Length", String(object.ContentLength));
    return new Response(object.Body.transformToWebStream(), { status: 200, headers });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    await requireAdmin(request);
    const { key: segments } = await params;
    const key = validateStudyMaterialKey(segments.join("/"));
    await deleteFromR2(key);
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
