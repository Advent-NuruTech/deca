import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { BSON, ObjectId } from "bson";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const MIGRATION_VERSION = 1;
const SOURCE_NAME = "legacy-mongodb-bson";
const APPLY = process.argv.includes("--apply");
const SOURCE_DIRECTORY = resolve(
  process.argv.find((argument) => argument.startsWith("--source="))?.slice(9) ??
    "app/migrated-data/test",
);
const REPORT_DIRECTORY = resolve("app/migrated-data/reports");
const RUN_STARTED_AT = new Date();
const RUN_ID = RUN_STARTED_AT.toISOString().replace(/[:.]/g, "-");

const REQUIRED_COLLECTIONS = ["articles", "categories", "orders", "products", "users"];
const COLLECTION_ORDER = ["users", "categories", "products", "orders", "articles"];

function fail(message) {
  throw new Error(message);
}

function requireEnvironment(name, fallbackName) {
  const value = process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) fail(`Missing required environment variable: ${name}`);
  return value;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableValue(value) {
  if (value instanceof Date) return { $date: value.toISOString() };
  if (value instanceof ObjectId) return { $oid: value.toHexString() };
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  }
  return value;
}

function recordChecksum(value) {
  return sha256(JSON.stringify(stableValue(value)));
}

function readBsonCollection(name) {
  const path = join(SOURCE_DIRECTORY, `${name}.bson`);
  if (!existsSync(path)) fail(`Missing BSON source: ${path}`);
  const buffer = readFileSync(path);
  const documents = [];
  let offset = 0;

  while (offset < buffer.length) {
    if (buffer.length - offset < 4) fail(`${name}.bson has a truncated document header`);
    const length = buffer.readInt32LE(offset);
    if (length < 5 || offset + length > buffer.length) {
      fail(`${name}.bson has an invalid document length at byte ${offset}`);
    }
    documents.push(BSON.deserialize(buffer.subarray(offset, offset + length)));
    offset += length;
  }

  if (offset !== buffer.length) fail(`${name}.bson was not read completely`);
  return { buffer, documents };
}

function objectId(value, context) {
  if (value instanceof ObjectId) return value.toHexString();
  const text = String(value ?? "");
  if (!/^[a-f0-9]{24}$/i.test(text)) fail(`${context} is not a valid MongoDB ObjectId`);
  return text.toLowerCase();
}

function nonEmptyString(value, context) {
  if (typeof value !== "string" || !value.trim()) fail(`${context} must be a non-empty string`);
  return value.trim();
}

function finiteNumber(value, context) {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(`${context} must be a number`);
  return value;
}

function sourceDate(value, context, optional = false) {
  if (optional && (value === undefined || value === null)) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) fail(`${context} must be a valid date`);
  return date;
}

function timestamp(value, context, optional = false) {
  const date = sourceDate(value, context, optional);
  return date ? Timestamp.fromDate(date) : null;
}

function cleanUndefined(value) {
  if (Array.isArray(value)) return value.map(cleanUndefined);
  if (value && typeof value === "object" && !(value instanceof Timestamp)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, cleanUndefined(item)]),
    );
  }
  return value;
}

function safeFilename(value) {
  const cleaned = value
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/[\r\n\0"]/g, "_")
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .trim();
  return (cleaned || "document").slice(0, 170);
}

function attachmentHeader(filename) {
  const safe = safeFilename(filename);
  const ascii = safe.replace(/[^\x20-\x7E]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(safe)}`;
}

function migrationMetadata(collection, id, checksum) {
  return {
    source: SOURCE_NAME,
    sourceCollection: collection,
    sourceId: id,
    sourceChecksum: checksum,
    version: MIGRATION_VERSION,
    migratedAt: Timestamp.fromDate(RUN_STARTED_AT),
  };
}

function categoryForArticle(article) {
  if (article.isDownloadable) return "study";
  const mappings = {
    "cookery-and-recipes": "recipe",
    "country-living-and-agriculture": "agriculture",
    "education-and-homeschooling": "homeschooling",
  };
  return mappings[article.category] ?? "faith";
}

function firebaseCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch {
      fail("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON");
    }
  }
  return {
    projectId: requireEnvironment("FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    clientEmail: requireEnvironment("FIREBASE_CLIENT_EMAIL"),
    privateKey: requireEnvironment("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  };
}

function createClients() {
  const serviceAccount = firebaseCredential();
  const firebaseApp =
    getApps()[0] ??
    initializeApp({
      credential: cert(serviceAccount),
      projectId:
        process.env.FIREBASE_PROJECT_ID ??
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
        serviceAccount.projectId,
    });
  const r2Endpoint =
    process.env.R2_ENDPOINT ??
    `https://${requireEnvironment("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`;
  const r2 = new S3Client({
    region: "auto",
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: requireEnvironment("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnvironment("R2_SECRET_ACCESS_KEY"),
    },
  });

  return {
    auth: getAuth(firebaseApp),
    db: getFirestore(firebaseApp),
    r2,
    r2Bucket: requireEnvironment("R2_BUCKET_NAME"),
    d1: {
      accountId: requireEnvironment("CF_ACCOUNT_ID", "R2_ACCOUNT_ID"),
      databaseId: requireEnvironment("D1_DATABASE_ID"),
      apiToken: requireEnvironment("CF_API_TOKEN", "R2_API_TOKEN"),
    },
  };
}

async function d1Batch(config, statements) {
  if (!statements.length) return [];
  const results = [];
  for (const statement of statements) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statement),
      },
    );
    const json = await response.json();
    if (!response.ok || !json.success) {
      const message = json.errors?.map((error) => error.message).join("; ") || response.statusText;
      fail(`D1 request failed: ${message}`);
    }
    results.push(...(json.result ?? []));
  }
  return results;
}

async function d1Query(config, sql, params = []) {
  const result = await d1Batch(config, [{ sql, params }]);
  return result[0]?.results ?? [];
}

async function inChunks(values, size, callback) {
  const results = [];
  for (let index = 0; index < values.length; index += size) {
    results.push(await callback(values.slice(index, index + size), index / size));
  }
  return results;
}

async function mapConcurrent(values, concurrency, callback) {
  const output = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (cursor < values.length) {
      const index = cursor++;
      output[index] = await callback(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return output;
}

async function downloadLegacyPdf(article) {
  const response = await fetch(article.fileUrl, { redirect: "follow" });
  if (!response.ok) fail(`Could not download ${article.slug}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0 || buffer.length > 20 * 1024 * 1024) {
    fail(`${article.slug} has an invalid document size (${buffer.length} bytes)`);
  }
  if (buffer.subarray(0, 4).toString("ascii") !== "%PDF") {
    fail(`${article.slug} is marked downloadable but is not a PDF`);
  }
  return {
    buffer,
    bytes: buffer.length,
    sha256: sha256(buffer),
  };
}

async function checkImage(url, context) {
  const response = await fetch(url, { method: "HEAD", redirect: "follow" });
  if (!response.ok) fail(`${context} image is unavailable: HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) fail(`${context} URL did not return an image`);
  return Number(response.headers.get("content-length") ?? 0);
}

function transformSources(sources, pdfs) {
  const usersById = new Map();
  const usersByEmail = new Map();
  const records = new Map(COLLECTION_ORDER.map((name) => [name, []]));

  for (const source of sources.users.documents) {
    const id = objectId(source._id, "users._id");
    const email = nonEmptyString(source.email, `users/${id}.email`).toLowerCase();
    const name = nonEmptyString(source.name, `users/${id}.name`);
    if (!['admin', 'user'].includes(source.role)) fail(`users/${id}.role is invalid`);
    if (usersByEmail.has(email)) fail(`Duplicate legacy user email: ${email}`);
    const checksum = recordChecksum(source);
    const data = {
      uid: id,
      name,
      email,
      role: source.role,
      createdAt: timestamp(source.createdAt, `users/${id}.createdAt`),
      updatedAt: timestamp(source.updatedAt, `users/${id}.updatedAt`),
      migration: migrationMetadata("users", id, checksum),
    };
    const record = { id, checksum, data, source };
    usersById.set(id, record);
    usersByEmail.set(email, record);
    records.get("users").push(record);
  }

  for (const source of sources.categories.documents) {
    const id = objectId(source._id, "categories._id");
    const checksum = recordChecksum(source);
    records.get("categories").push({
      id,
      checksum,
      source,
      data: {
        name: nonEmptyString(source.name, `categories/${id}.name`),
        slug: nonEmptyString(source.slug, `categories/${id}.slug`),
        order: finiteNumber(source.order, `categories/${id}.order`),
        createdAt: timestamp(source.createdAt, `categories/${id}.createdAt`),
        updatedAt: timestamp(source.updatedAt, `categories/${id}.updatedAt`),
        migration: migrationMetadata("categories", id, checksum),
      },
    });
  }

  const productIds = new Set();
  for (const source of sources.products.documents) {
    const id = objectId(source._id, "products._id");
    productIds.add(id);
    const checksum = recordChecksum(source);
    const data = cleanUndefined({
      name: nonEmptyString(source.name, `products/${id}.name`),
      slug: nonEmptyString(source.slug, `products/${id}.slug`),
      description: nonEmptyString(source.description, `products/${id}.description`),
      category: source.category,
      price: finiteNumber(source.price, `products/${id}.price`),
      originalPrice: source.originalPrice,
      images: Array.isArray(source.images) ? source.images.map(String) : [],
      inStock: Boolean(source.inStock),
      stockQuantity: finiteNumber(source.stockQuantity, `products/${id}.stockQuantity`),
      specifications: source.specifications ?? {},
      brand: source.brand,
      model: source.model,
      featured: Boolean(source.featured),
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      seoKeywords: Array.isArray(source.seoKeywords) ? source.seoKeywords.map(String) : [],
      status: source.status,
      organicCertified: Boolean(source.organicCertified),
      harvestDate: source.harvestDate
        ? timestamp(source.harvestDate, `products/${id}.harvestDate`)
        : undefined,
      seedType: source.seedType,
      createdAt: timestamp(source.createdAt, `products/${id}.createdAt`),
      updatedAt: timestamp(source.updatedAt, `products/${id}.updatedAt`),
      migration: migrationMetadata("products", id, checksum),
    });
    if (!['seeds', 'produce', 'other'].includes(data.category)) {
      fail(`products/${id}.category is invalid`);
    }
    if (!['active', 'inactive', 'draft'].includes(data.status)) {
      fail(`products/${id}.status is invalid`);
    }
    records.get("products").push({ id, checksum, data, source });
  }

  for (const source of sources.orders.documents) {
    const id = objectId(source._id, "orders._id");
    const checksum = recordChecksum(source);
    const customerEmail = nonEmptyString(source.customer?.email, `orders/${id}.customer.email`).toLowerCase();
    const matchedUser = usersByEmail.get(customerEmail);
    const items = (source.items ?? []).map((item, index) => {
      const product = objectId(item.product, `orders/${id}.items[${index}].product`);
      return cleanUndefined({
        product,
        name: nonEmptyString(item.name, `orders/${id}.items[${index}].name`),
        price: finiteNumber(item.price, `orders/${id}.items[${index}].price`),
        quantity: finiteNumber(item.quantity, `orders/${id}.items[${index}].quantity`),
        image: item.image,
        legacyProductMissing: !productIds.has(product),
      });
    });
    if (!items.length) fail(`orders/${id} has no items`);
    const legacyGuestId = `legacy-guest:${sha256(customerEmail).slice(0, 24)}`;
    records.get("orders").push({
      id,
      checksum,
      source,
      data: cleanUndefined({
        userId: matchedUser?.id ?? legacyGuestId,
        orderNumber: nonEmptyString(source.orderNumber, `orders/${id}.orderNumber`),
        customer: source.customer,
        items,
        subtotal: finiteNumber(source.subtotal, `orders/${id}.subtotal`),
        shipping: finiteNumber(source.shipping, `orders/${id}.shipping`),
        total: finiteNumber(source.total, `orders/${id}.total`),
        paymentMethod: source.paymentMethod,
        paymentStatus: source.paymentStatus,
        orderStatus: source.orderStatus,
        notes: source.notes,
        shippingMethod: source.shippingMethod,
        legacyGuest: !matchedUser,
        createdAt: timestamp(source.createdAt, `orders/${id}.createdAt`),
        updatedAt: timestamp(source.updatedAt, `orders/${id}.updatedAt`),
        migration: migrationMetadata("orders", id, checksum),
      }),
    });
  }

  for (const source of sources.articles.documents) {
    const id = objectId(source._id, "articles._id");
    const authorId = objectId(source.author, `articles/${id}.author`);
    const authorRecord = usersById.get(authorId);
    if (!authorRecord) fail(`articles/${id} refers to missing author ${authorId}`);
    const checksum = recordChecksum(source);
    const pdf = pdfs.get(id);
    if (Boolean(source.isDownloadable) !== Boolean(pdf)) {
      fail(`articles/${id} downloadable file validation did not match its metadata`);
    }
    const fileName = pdf ? `${safeFilename(source.title)}.pdf` : undefined;
    const fileKey = pdf ? `study-materials/legacy/${id}/${source.slug}.pdf` : undefined;
    records.get("articles").push({
      id,
      checksum,
      source,
      pdf,
      data: cleanUndefined({
        title: nonEmptyString(source.title, `articles/${id}.title`),
        slug: nonEmptyString(source.slug, `articles/${id}.slug`),
        excerpt: nonEmptyString(source.excerpt, `articles/${id}.excerpt`),
        featuredImage: source.featuredImage,
        category: categoryForArticle(source),
        studyCategory: source.isDownloadable ? source.category : undefined,
        legacyCategory: source.category,
        tags: Array.isArray(source.tags) ? source.tags.map(String) : [],
        author: {
          uid: authorRecord.id,
          name: authorRecord.data.name,
          email: authorRecord.data.email,
        },
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
        seoKeywords: Array.isArray(source.seoKeywords) ? source.seoKeywords.map(String) : [],
        published: Boolean(source.published),
        publishedAt: timestamp(source.publishedAt, `articles/${id}.publishedAt`, true),
        views: finiteNumber(source.views ?? 0, `articles/${id}.views`),
        isDownloadable: Boolean(source.isDownloadable),
        fileKey,
        fileName,
        fileType: pdf ? "application/pdf" : undefined,
        createdAt: timestamp(source.createdAt, `articles/${id}.createdAt`),
        updatedAt: timestamp(source.updatedAt, `articles/${id}.updatedAt`),
        migration: migrationMetadata("articles", id, checksum),
      }),
    });
  }

  return { records, usersByEmail };
}

async function inspectFirestore(db, records) {
  const missing = [];
  const matched = [];
  const conflicts = [];
  const existingBackup = [];

  for (const collection of COLLECTION_ORDER) {
    const collectionRecords = records.get(collection);
    if (!collectionRecords.length) continue;
    const refs = collectionRecords.map((record) => db.collection(collection).doc(record.id));
    const snapshots = await db.getAll(...refs);
    snapshots.forEach((snapshot, index) => {
      const record = collectionRecords[index];
      if (!snapshot.exists) {
        missing.push({ collection, record });
        return;
      }
      const data = snapshot.data();
      existingBackup.push({ collection, id: record.id, data });
      if (
        data?.migration?.source === SOURCE_NAME &&
        data?.migration?.sourceChecksum === record.checksum
      ) {
        matched.push({ collection, record });
      } else {
        conflicts.push({ collection, id: record.id });
      }
    });
  }

  return { missing, matched, conflicts, existingBackup };
}

async function inspectD1(d1, articleRecords) {
  const existing = new Map();
  await inChunks(articleRecords, 75, async (chunk) => {
    const placeholders = chunk.map(() => "?").join(",");
    const rows = await d1Query(
      d1,
      `SELECT article_id, content, created_at, updated_at FROM article_content WHERE article_id IN (${placeholders})`,
      chunk.map((record) => record.id),
    );
    for (const row of rows) existing.set(row.article_id, row);
  });

  const missing = [];
  const matched = [];
  const conflicts = [];
  for (const record of articleRecords) {
    const row = existing.get(record.id);
    if (!row) missing.push(record);
    else if (row.content === record.source.content) matched.push(record);
    else conflicts.push(record.id);
  }
  return { existing, missing, matched, conflicts };
}

async function inspectAuth(auth, userRecords) {
  const missing = [];
  const matched = [];
  const conflicts = [];

  for (const record of userRecords) {
    let byUid = null;
    let byEmail = null;
    try {
      byUid = await auth.getUser(record.id);
    } catch (error) {
      if (error.code !== "auth/user-not-found") throw error;
    }
    try {
      byEmail = await auth.getUserByEmail(record.data.email);
    } catch (error) {
      if (error.code !== "auth/user-not-found") throw error;
    }
    if (!byUid && !byEmail) missing.push(record);
    else if (byUid?.uid === byEmail?.uid && byUid.uid === record.id) matched.push(record);
    else conflicts.push({ id: record.id, reason: "UID or email belongs to a different Firebase Auth user" });
  }
  return { missing, matched, conflicts };
}

async function inspectR2(r2, bucket, articleRecords) {
  const downloadable = articleRecords.filter((record) => record.pdf);
  const results = await mapConcurrent(downloadable, 8, async (record) => {
    try {
      const head = await r2.send(
        new HeadObjectCommand({ Bucket: bucket, Key: record.data.fileKey }),
      );
      const expectedHash = record.pdf.sha256;
      const actualHash = head.Metadata?.sha256;
      if (head.ContentLength === record.pdf.bytes && actualHash === expectedHash) {
        return { state: "matched", record };
      }
      return { state: "conflict", id: record.id, key: record.data.fileKey };
    } catch (error) {
      const status = error.$metadata?.httpStatusCode;
      if (status === 404 || error.name === "NotFound" || error.Code === "NoSuchKey") {
        return { state: "missing", record };
      }
      throw error;
    }
  });
  return {
    missing: results.filter((item) => item.state === "missing").map((item) => item.record),
    matched: results.filter((item) => item.state === "matched").map((item) => item.record),
    conflicts: results.filter((item) => item.state === "conflict"),
  };
}

function serializable(value) {
  if (value instanceof Timestamp) return { $timestamp: value.toDate().toISOString() };
  if (Array.isArray(value)) return value.map(serializable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializable(item)]));
  }
  return value;
}

function comparableFirestoreData(value) {
  const comparable = serializable(value);
  if (comparable?.migration) delete comparable.migration.migratedAt;
  return JSON.stringify(stableValue(comparable));
}

async function verifyFirestoreContent(db, records) {
  const mismatches = [];
  for (const collection of COLLECTION_ORDER) {
    const collectionRecords = records.get(collection);
    if (!collectionRecords.length) continue;
    const refs = collectionRecords.map((record) => db.collection(collection).doc(record.id));
    const snapshots = await db.getAll(...refs);
    snapshots.forEach((snapshot, index) => {
      const record = collectionRecords[index];
      if (
        !snapshot.exists ||
        comparableFirestoreData(snapshot.data()) !== comparableFirestoreData(record.data)
      ) {
        mismatches.push(`${collection}/${record.id}`);
      }
    });
  }
  return mismatches;
}

function writePrivateJson(path, value) {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, `${JSON.stringify(serializable(value), null, 2)}\n`, { mode: 0o600 });
  try {
    chmodSync(path, 0o600);
  } catch {
    // Best effort on filesystems without POSIX permission support.
  }
}

async function uploadR2Documents(r2, bucket, records) {
  const uploaded = [];
  try {
    await mapConcurrent(records, 5, async (record) => {
      await r2.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: record.data.fileKey,
          Body: record.pdf.buffer,
          ContentLength: record.pdf.bytes,
          ContentType: "application/pdf",
          ContentDisposition: attachmentHeader(record.data.fileName),
          Metadata: {
            sha256: record.pdf.sha256,
            "source-id": record.id,
            "migration-version": String(MIGRATION_VERSION),
          },
        }),
      );
      uploaded.push(record);
    });
    return uploaded;
  } catch (error) {
    await deleteR2Documents(r2, bucket, uploaded);
    throw error;
  }
}

async function deleteR2Documents(r2, bucket, records) {
  await mapConcurrent(records, 5, (record) =>
    r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: record.data.fileKey })),
  );
}

async function writeD1Articles(d1, records) {
  const written = [];
  try {
    for (const record of records) {
      await d1Batch(d1, [{
        sql: `INSERT INTO article_content (article_id, content, created_at, updated_at)
              VALUES (?, ?, ?, ?)
              ON CONFLICT(article_id) DO UPDATE SET
                content = excluded.content,
                updated_at = excluded.updated_at`,
        params: [
          record.id,
          record.source.content,
          sourceDate(record.source.createdAt, `articles/${record.id}.createdAt`).toISOString(),
          sourceDate(record.source.updatedAt, `articles/${record.id}.updatedAt`).toISOString(),
        ],
      }]);
      written.push(record);
    }
    return written;
  } catch (error) {
    await deleteD1Articles(d1, written);
    throw error;
  }
}

async function deleteD1Articles(d1, records) {
  await inChunks(records, 25, (chunk) =>
    d1Batch(
      d1,
      chunk.map((record) => ({
        sql: "DELETE FROM article_content WHERE article_id = ?",
        params: [record.id],
      })),
    ),
  );
}

async function importAuthUsers(auth, records) {
  if (!records.length) return [];
  const result = await auth.importUsers(
    records.map((record) => ({
      uid: record.id,
      email: record.data.email,
      displayName: record.data.name,
      disabled: false,
      emailVerified: false,
      passwordHash: Buffer.from(nonEmptyString(record.source.password, `users/${record.id}.password`)),
      customClaims: { role: record.data.role },
      metadata: {
        creationTime: record.data.createdAt.toDate().toUTCString(),
      },
    })),
    { hash: { algorithm: "BCRYPT" } },
  );
  if (result.failureCount) {
    const failedIndexes = new Set(result.errors.map((item) => item.index));
    const imported = records.filter((_, index) => !failedIndexes.has(index));
    if (imported.length) await auth.deleteUsers(imported.map((record) => record.id));
    const details = result.errors.map((item) => `${item.index}: ${item.error.message}`).join("; ");
    fail(`Firebase Auth import failed: ${details}`);
  }
  return records;
}

async function deleteAuthUsers(auth, records) {
  if (records.length) await auth.deleteUsers(records.map((record) => record.id));
}

async function writeFirestore(db, missing) {
  if (!missing.length) return;
  const batch = db.batch();
  for (const { collection, record } of missing) {
    batch.create(db.collection(collection).doc(record.id), record.data);
  }
  await batch.commit();
}

async function deleteFirestore(db, missing) {
  if (!missing.length) return;
  const batch = db.batch();
  for (const { collection, record } of missing) {
    batch.delete(db.collection(collection).doc(record.id));
  }
  await batch.commit();
}

async function verifyAll(clients, transformed) {
  const firestore = await inspectFirestore(clients.db, transformed.records);
  const firestoreContentMismatches = await verifyFirestoreContent(
    clients.db,
    transformed.records,
  );
  const d1 = await inspectD1(clients.d1, transformed.records.get("articles"));
  const auth = await inspectAuth(clients.auth, transformed.records.get("users"));
  const r2 = await inspectR2(
    clients.r2,
    clients.r2Bucket,
    transformed.records.get("articles"),
  );
  const failures = [
    ...firestore.missing.map((item) => `Firestore missing ${item.collection}/${item.record.id}`),
    ...firestore.conflicts.map((item) => `Firestore conflict ${item.collection}/${item.id}`),
    ...firestoreContentMismatches.map((path) => `Firestore content mismatch ${path}`),
    ...d1.missing.map((item) => `D1 missing article ${item.id}`),
    ...d1.conflicts.map((id) => `D1 content mismatch ${id}`),
    ...auth.missing.map((item) => `Firebase Auth missing ${item.id}`),
    ...auth.conflicts.map((item) => `Firebase Auth conflict ${item.id}`),
    ...r2.missing.map((item) => `R2 missing ${item.data.fileKey}`),
    ...r2.conflicts.map((item) => `R2 conflict ${item.key}`),
  ];
  if (failures.length) fail(`Post-migration verification failed:\n${failures.join("\n")}`);
  return {
    firestore: firestore.matched.length,
    d1: d1.matched.length,
    auth: auth.matched.length,
    r2: r2.matched.length,
  };
}

async function main() {
  for (const collection of REQUIRED_COLLECTIONS) {
    if (!existsSync(join(SOURCE_DIRECTORY, `${collection}.metadata.json`))) {
      fail(`Missing metadata file for ${collection}`);
    }
  }

  const sources = Object.fromEntries(
    REQUIRED_COLLECTIONS.map((name) => [name, readBsonCollection(name)]),
  );
  const duplicateIds = [];
  for (const [name, source] of Object.entries(sources)) {
    const ids = source.documents.map((document) => objectId(document._id, `${name}._id`));
    if (new Set(ids).size !== ids.length) duplicateIds.push(name);
  }
  if (duplicateIds.length) fail(`Duplicate source IDs in: ${duplicateIds.join(", ")}`);

  const downloadableArticles = sources.articles.documents.filter(
    (article) => article.isDownloadable === true,
  );
  const pdfResults = await mapConcurrent(downloadableArticles, 8, downloadLegacyPdf);
  const pdfs = new Map(
    downloadableArticles.map((article, index) => [
      objectId(article._id, "articles._id"),
      pdfResults[index],
    ]),
  );

  const imageChecks = [];
  for (const article of sources.articles.documents) {
    if (article.featuredImage) {
      imageChecks.push({
        url: article.featuredImage,
        context: `articles/${objectId(article._id, "articles._id")}`,
      });
    }
  }
  for (const product of sources.products.documents) {
    for (const url of product.images ?? []) {
      imageChecks.push({
        url,
        context: `products/${objectId(product._id, "products._id")}`,
      });
    }
  }
  const imageSizes = await mapConcurrent(imageChecks, 10, ({ url, context }) =>
    checkImage(url, context),
  );

  const transformed = transformSources(sources, pdfs);
  const clients = createClients();
  const firestore = await inspectFirestore(clients.db, transformed.records);
  const d1 = await inspectD1(clients.d1, transformed.records.get("articles"));
  const auth = await inspectAuth(clients.auth, transformed.records.get("users"));
  const r2 = await inspectR2(
    clients.r2,
    clients.r2Bucket,
    transformed.records.get("articles"),
  );

  const conflicts = [
    ...firestore.conflicts.map((item) => `Firestore ${item.collection}/${item.id}`),
    ...d1.conflicts.map((id) => `D1 article_content/${id}`),
    ...auth.conflicts.map((item) => `Firebase Auth ${item.id}: ${item.reason}`),
    ...r2.conflicts.map((item) => `R2 ${item.key}`),
  ];
  if (conflicts.length) {
    fail(`Migration stopped because destination data would be overwritten:\n${conflicts.join("\n")}`);
  }

  const report = {
    runId: RUN_ID,
    mode: APPLY ? "apply" : "dry-run",
    migrationVersion: MIGRATION_VERSION,
    sourceDirectory: SOURCE_DIRECTORY,
    startedAt: RUN_STARTED_AT.toISOString(),
    source: {
      files: Object.fromEntries(
        Object.entries(sources).map(([name, source]) => [name, {
          records: source.documents.length,
          bytes: source.buffer.length,
          sha256: sha256(source.buffer),
        }]),
      ),
      downloadablePdfs: {
        records: pdfs.size,
        bytes: [...pdfs.values()].reduce((total, pdf) => total + pdf.bytes, 0),
      },
      referencedImages: {
        records: imageChecks.length,
        bytes: imageSizes.reduce((total, size) => total + size, 0),
      },
    },
    plan: {
      firestoreCreate: firestore.missing.length,
      firestoreAlreadyMigrated: firestore.matched.length,
      d1Create: d1.missing.length,
      d1AlreadyMigrated: d1.matched.length,
      authCreate: auth.missing.length,
      authAlreadyMigrated: auth.matched.length,
      r2Create: r2.missing.length,
      r2AlreadyMigrated: r2.matched.length,
    },
    transformations: {
      stableIds: "MongoDB ObjectIds are retained as Firebase Auth UIDs and destination record IDs.",
      articleBodies: "Moved to D1 article_content; metadata remains in Firestore.",
      downloadableFiles: "Copied from legacy Cloudinary raw URLs to private R2 PDF objects.",
      articleCategories: "Downloadable articles map to category=study and retain the old category in studyCategory and legacyCategory.",
      guestOrders: `${transformed.records.get("orders").filter((item) => item.data.legacyGuest).length} order(s) use a non-login legacy-guest identifier because the source had no registered user relation.`,
      orphanedOrderItems: `${transformed.records.get("orders").flatMap((item) => item.data.items).filter((item) => item.legacyProductMissing).length} historical order item(s) reference products deleted before the export; their snapshots and original product IDs are preserved.`,
      passwordHashes: "Imported to Firebase Auth as bcrypt hashes; plaintext passwords were never read or written.",
    },
  };

  mkdirSync(REPORT_DIRECTORY, { recursive: true });
  const reportPath = join(REPORT_DIRECTORY, `${RUN_ID}-${report.mode}.json`);
  writePrivateJson(reportPath, report);

  console.log(`Legacy migration ${APPLY ? "apply" : "dry-run"} preflight passed.`);
  console.log(`Source: ${Object.values(sources).reduce((sum, item) => sum + item.documents.length, 0)} records; ${pdfs.size} PDFs; ${imageChecks.length} images.`);
  console.log(`Plan: ${JSON.stringify(report.plan)}`);
  console.log(`Private report: ${reportPath}`);

  if (!APPLY) {
    console.log("No destination data was changed. Re-run with --apply after reviewing this plan.");
    return;
  }

  const backupPath = join(REPORT_DIRECTORY, `${RUN_ID}-destination-backup.json`);
  writePrivateJson(backupPath, {
    note: "Pre-existing target records only. This run refuses conflicts and does not overwrite them.",
    firestore: firestore.existingBackup,
    d1: [...d1.existing.values()],
    authMatchedUids: auth.matched.map((record) => record.id),
    r2MatchedKeys: r2.matched.map((record) => record.data.fileKey),
  });

  let uploadedR2 = [];
  let writtenD1 = [];
  let importedAuth = [];
  let writtenFirestore = [];
  try {
    uploadedR2 = await uploadR2Documents(clients.r2, clients.r2Bucket, r2.missing);
    writtenD1 = await writeD1Articles(clients.d1, d1.missing);
    importedAuth = await importAuthUsers(clients.auth, auth.missing);
    await writeFirestore(clients.db, firestore.missing);
    writtenFirestore = firestore.missing;

    const verification = await verifyAll(clients, transformed);
    report.completedAt = new Date().toISOString();
    report.status = "completed";
    report.applied = {
      firestore: writtenFirestore.length,
      d1: writtenD1.length,
      auth: importedAuth.length,
      r2: uploadedR2.length,
    };
    report.verified = verification;
    report.backupPath = backupPath;
    writePrivateJson(reportPath, report);
    console.log(`Migration completed and verified: ${JSON.stringify(report.applied)}`);
  } catch (error) {
    const rollbackErrors = [];
    for (const rollback of [
      () => deleteFirestore(clients.db, writtenFirestore),
      () => deleteAuthUsers(clients.auth, importedAuth),
      () => deleteD1Articles(clients.d1, writtenD1),
      () => deleteR2Documents(clients.r2, clients.r2Bucket, uploadedR2),
    ]) {
      try {
        await rollback();
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError instanceof Error ? rollbackError.message : String(rollbackError));
      }
    }
    report.completedAt = new Date().toISOString();
    report.status = rollbackErrors.length ? "failed-rollback-incomplete" : "failed-rolled-back";
    report.error = error instanceof Error ? error.message : String(error);
    report.rollbackErrors = rollbackErrors;
    writePrivateJson(reportPath, report);
    if (rollbackErrors.length) {
      fail(`${report.error}\nRollback also failed: ${rollbackErrors.join("; ")}`);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
