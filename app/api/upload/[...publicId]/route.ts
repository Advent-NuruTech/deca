import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { deleteImage, publicIdFromManagedUrl, validateManagedPublicId } from "@/lib/cloudinary";
import { firestore } from "@/lib/firestore";

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
    const articles = await firestore().collection("articles").get();
    if (articles.docs.some((article) => typeof article.data().featuredImage === "string" && publicIdFromManagedUrl(article.data().featuredImage) === managedPublicId)) {
      throw new HttpError(409, "This image is still attached to a resource");
    }
    await deleteImage(managedPublicId);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
