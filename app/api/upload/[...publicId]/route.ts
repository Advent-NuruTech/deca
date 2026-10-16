import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { deleteImage, validateManagedPublicId } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string[] }> },
) {
  try {
    await requireAdmin(request);
    const { publicId } = await params;
    let managedPublicId: string;
    try {
      managedPublicId = validateManagedPublicId(publicId.join("/"));
    } catch (error) {
      throw new HttpError(400, error instanceof Error ? error.message : "Invalid publicId");
    }
    await deleteImage(managedPublicId);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
