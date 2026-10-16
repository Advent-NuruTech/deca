import "server-only";

import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDER = "remsam-Kenya";

function cloudName(): string | undefined {
  return (
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
}

export function cloudinaryConfigured(): boolean {
  return Boolean(
    cloudName() &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function client() {
  if (!cloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({
    cloud_name: cloudName(),
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export async function uploadImage(dataUri: string, folder = CLOUDINARY_FOLDER) {
  const result = await client().uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await client().uploader.destroy(publicId, { resource_type: "image" });
}

export function validateManagedPublicId(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("A Cloudinary publicId is required");
  }
  const publicId = value.trim();
  if (!publicId.startsWith(`${CLOUDINARY_FOLDER}/`) || publicId.includes("..")) {
    throw new Error("The image is outside the managed Cloudinary folder");
  }
  return publicId;
}
