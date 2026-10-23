import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { deleteManagedImage, imageIsReferenced, validateManagedImageId } from "@/lib/managed-images-server";

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
      managedPublicId = validateManagedImageId(publicId.join("/"));
    } catch (error) {
      throw new HttpError(400, error instanceof Error ? error.message : "Invalid publicId");
    }
    if (await imageIsReferenced(managedPublicId)) throw new HttpError(409, "This image is still attached to a resource or product");
    await deleteManagedImage(managedPublicId);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
