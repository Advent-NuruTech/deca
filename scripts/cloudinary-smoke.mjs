import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ??
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    "Missing Cloudinary config. Need a cloud name, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const publicId = `remsam-Kenya/_smoke/phase8-${Date.now()}`;
const transparentPixel =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

let uploaded = false;

try {
  const result = await cloudinary.uploader.upload(transparentPixel, {
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });
  uploaded = Boolean(result.public_id);
  console.log("Cloudinary upload ok");

  const deletion = await cloudinary.uploader.destroy(result.public_id, {
    resource_type: "image",
  });
  uploaded = false;

  if (deletion.result !== "ok") {
    throw new Error(`unexpected delete result: ${deletion.result}`);
  }

  console.log("Cloudinary delete ok");
} catch (error) {
  console.error(
    "Cloudinary smoke test FAILED:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  if (uploaded) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      console.log("Cloudinary cleanup ok");
    } catch {
      console.error("Cloudinary cleanup FAILED for the temporary smoke image");
      process.exitCode = 1;
    }
  }
}
