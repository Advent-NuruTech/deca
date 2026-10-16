import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "";
export const R2_ENDPOINT =
  process.env.R2_ENDPOINT ??
  (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");

let cachedClient: S3Client | null = null;

export function r2Client(): S3Client {
  if (!R2_ENDPOINT || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env.local.",
    );
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return cachedClient;
}

function sanitizeName(name: string): string {
  return name
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function buildObjectKey(
  folder: string,
  originalName: string,
  prefix?: string,
): string {
  const clean = sanitizeName(originalName);
  const stamp = `${Date.now()}_${prefix ? `${prefix}_` : ""}${clean}`;
  return `${folder.replace(/\/+$/, "")}/${stamp}`;
}

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | ReadableStream,
  contentType?: string,
  options: { contentDisposition?: string; metadata?: Record<string, string> } = {},
): Promise<{ key: string; url: string }> {
  await r2Client().send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body as never,
      ContentType: contentType,
      ContentDisposition: options.contentDisposition,
      Metadata: options.metadata,
    }),
  );
  return { key, url: publicUrl(key) };
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2Client().send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }),
  );
}

export async function getR2Object(key: string) {
  return r2Client().send(
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
  );
}

export function publicUrl(key: string): string {
  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;
}

export async function presignUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    r2Client(),
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn },
  );
}
