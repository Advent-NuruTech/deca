import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.R2_BUCKET_NAME;
const Key = `_smoke/healthcheck_${Date.now()}.txt`;
const body = Buffer.from("samrem2 phase1 r2 smoke test");

try {
  await client.send(new PutObjectCommand({ Bucket, Key, Body: body, ContentType: "text/plain" }));
  console.log("R2 PUT ok:", Key);
  await client.send(new DeleteObjectCommand({ Bucket, Key }));
  console.log("R2 DELETE ok");
  console.log("R2 bucket reachable:", Bucket);
} catch (err) {
  console.error("R2 smoke test FAILED:", err?.name, err?.message);
  process.exit(1);
}
