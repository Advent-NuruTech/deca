import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { randomUUID } from "node:crypto";
import { managedImageUrl } from "@/lib/managed-images";
import { deleteManagedImage, imageIsReferenced, validateManagedImageId } from "@/lib/managed-images-server";
import { uploadToR2 } from "@/lib/r2";

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

    const purpose = form.get("purpose");
    if (purpose !== "products" && purpose !== "resources") throw new HttpError(400, "An image purpose is required");
    const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp" };
    const bytes = Buffer.from(await image.arrayBuffer());
    const valid = image.type === "image/jpeg" ? bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
      : image.type === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      : image.type === "image/gif" ? ["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"))
      : bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    if (!valid) throw new HttpError(415, "The image contents do not match its file type");
    const key = `images/${purpose}/${randomUUID()}.${extensions[image.type]}`;
    await uploadToR2(key, bytes, image.type);
    const uploaded = { publicId: key, url: managedImageUrl(key) };
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
      managedPublicId = validateManagedImageId(publicId);
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
