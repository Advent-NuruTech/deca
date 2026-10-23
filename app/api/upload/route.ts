import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { deleteImage, publicIdFromManagedUrl, uploadImage, validateManagedPublicId } from "@/lib/cloudinary";
import { firestore } from "@/lib/firestore";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new HttpError(400, "A multipart image upload is required");
    }
    const image = form.get("image");
    if (!(image instanceof File)) throw new HttpError(400, "No image file was provided");
    if (!IMAGE_TYPES.has(image.type)) {
      throw new HttpError(415, "Only JPEG, PNG, GIF and WebP images are allowed");
    }
    if (image.size === 0) throw new HttpError(400, "The image file is empty");
    if (image.size > MAX_IMAGE_BYTES) throw new HttpError(413, "Images must be 5 MB or smaller");

    const bytes = Buffer.from(await image.arrayBuffer());
    const dataUri = `data:${image.type};base64,${bytes.toString("base64")}`;
    const uploaded = await uploadImage(dataUri);
    return NextResponse.json({
      message: "File uploaded successfully",
      filename: uploaded.publicId,
      path: uploaded.url,
      url: uploaded.url,
      public_id: uploaded.publicId,
      secure_url: uploaded.url,
    });
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
      throw new HttpError(400, "A JSON body containing publicId is required");
    }
    const publicId =
      body && typeof body === "object" && "publicId" in body
        ? (body as { publicId: unknown }).publicId
        : undefined;
    let managedPublicId: string;
    try {
      managedPublicId = validateManagedPublicId(publicId);
    } catch (error) {
      throw new HttpError(400, error instanceof Error ? error.message : "Invalid publicId");
    }
    const articles = await firestore().collection("articles").get();
    if (articles.docs.some((article) => typeof article.data().featuredImage === "string" && publicIdFromManagedUrl(article.data().featuredImage) === managedPublicId)) {
      throw new HttpError(409, "This image is still attached to a resource");
    }
    const products = await firestore().collection("products").get();
    if (products.docs.some((product) => {
      const data = product.data();
      const images = Array.isArray(data.images) ? data.images : [];
      const variants = Array.isArray(data.variants) ? data.variants : [];
      return [...images, ...variants.map((variant: { image?: unknown }) => variant?.image)]
        .some((image) => typeof image === "string" && publicIdFromManagedUrl(image) === managedPublicId);
    })) {
      throw new HttpError(409, "This image is still attached to a product");
    }
    await deleteImage(managedPublicId);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
