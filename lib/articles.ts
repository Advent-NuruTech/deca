import "server-only";

import slugify from "slugify";
import { FieldValue, type DocumentData, type DocumentSnapshot } from "firebase-admin/firestore";
import { HttpError } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { keyFromStudyMaterialUrl, studyMaterialUrl, validateStudyMaterialKey } from "@/lib/study-materials";
import type { PublicArticle } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringField(
  input: Record<string, unknown>,
  key: string,
  options: { required?: boolean; max?: number; allowEmpty?: boolean } = {},
): string | undefined {
  const value = input[key];
  if (value === undefined) {
    if (options.required) throw new HttpError(400, `${key} is required`);
    return undefined;
  }
  if (typeof value !== "string") throw new HttpError(400, `${key} must be a string`);
  const trimmed = value.trim();
  if (!trimmed && !options.allowEmpty) throw new HttpError(400, `${key} must be a non-empty string`);
  if (trimmed.length > (options.max ?? 5000)) throw new HttpError(400, `${key} is too long`);
  return trimmed;
}

function optionalString(input: Record<string, unknown>, key: string, max = 500): string | undefined {
  const value = input[key];
  if (value === undefined || value === null || value === "") return undefined;
  return stringField(input, key, { max });
}

function booleanField(input: Record<string, unknown>, key: string): boolean | undefined {
  const value = input[key];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new HttpError(400, `${key} must be a boolean`);
  return value;
}

function stringArrayField(input: Record<string, unknown>, key: string): string[] | undefined {
  const value = input[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 30 || value.some((item) => typeof item !== "string")) {
    throw new HttpError(400, `${key} must be an array of strings`);
  }
  return value.map((item) => (item as string).trim()).filter(Boolean);
}

export type ValidatedArticleBody = {
  content?: string;
  metadata: Record<string, unknown>;
};

export function validateArticleBody(value: unknown, partial = false): ValidatedArticleBody {
  if (!isRecord(value)) throw new HttpError(400, "A JSON article body is required");

  const title = stringField(value, "title", { required: !partial, max: 180 });
  const content = stringField(value, "content", { required: !partial, max: 1_000_000 });
  const excerpt = stringField(value, "excerpt", { required: !partial, max: 1000 });
  const category = value.category;
  if (category !== undefined && typeof category !== "string") throw new HttpError(400, "category must be a string");

  const metadata: Record<string, unknown> = {};
  const assign = (key: string, next: unknown) => {
    if (next !== undefined) metadata[key] = next;
  };

  assign("title", title);
  assign("excerpt", excerpt);
  assign("featuredImage", optionalString(value, "featuredImage", 2000));
  assign("category", typeof category === "string" ? category.trim().toLowerCase() : undefined);
  assign("studyCategory", optionalString(value, "studyCategory", 120));
  assign("majorCategoryId", optionalString(value, "majorCategoryId", 120));
  assign("subcategoryId", optionalString(value, "subcategoryId", 120));
  assign("tags", stringArrayField(value, "tags"));
  assign("seoTitle", optionalString(value, "seoTitle", 180));
  assign("seoDescription", optionalString(value, "seoDescription", 500));
  assign("seoKeywords", stringArrayField(value, "seoKeywords"));
  assign("published", booleanField(value, "published"));
  assign("isDownloadable", booleanField(value, "isDownloadable"));
  assign("fileName", optionalString(value, "fileName", 180));
  assign("fileType", optionalString(value, "fileType", 160));

  let fileKey: string | undefined;
  if (value.fileKey !== undefined && value.fileKey !== null && value.fileKey !== "") {
    fileKey = validateStudyMaterialKey(value.fileKey);
  } else if (typeof value.fileUrl === "string" && value.fileUrl.trim()) {
    fileKey = keyFromStudyMaterialUrl(value.fileUrl.trim()) ?? undefined;
    if (!fileKey) throw new HttpError(400, "fileUrl must be a managed R2 study-material URL");
  }
  assign("fileKey", fileKey);

  if (partial && content === undefined && Object.keys(metadata).length === 0) {
    throw new HttpError(400, "No supported article fields were provided");
  }

  if (!partial) {
    metadata.category ??= "faith";
    metadata.tags ??= [];
    metadata.seoKeywords ??= [];
    metadata.published ??= false;
    metadata.isDownloadable ??= false;
    metadata.views = 0;
    metadata.seoTitle ??= title;
    metadata.seoDescription ??= excerpt?.slice(0, 160);
  }

  const isDownloadable = metadata.isDownloadable;
  if (isDownloadable === true && !fileKey && !partial) {
    throw new HttpError(400, "fileKey is required for a downloadable article");
  }
  if (isDownloadable === false) {
    delete metadata.fileKey;
    delete metadata.fileName;
    delete metadata.fileType;
  }

  return { content, metadata };
}

export function articleSlug(title: string): string {
  const slug = slugify(title, { lower: true, strict: true });
  if (!slug) throw new HttpError(400, "title must contain letters or numbers");
  return slug;
}

export async function assertUniqueArticleSlug(slug: string, excludingId?: string) {
  const snapshot = await firestore().collection("articles").where("slug", "==", slug).limit(2).get();
  if (snapshot.docs.some((document) => document.id !== excludingId)) {
    throw new HttpError(409, "An article with this title already exists");
  }
}

export function serializeValue(value: unknown): unknown {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeValue(item)]));
  }
  return value;
}

export function serializeArticle(
  document: DocumentSnapshot<DocumentData>,
  content?: string | null,
): PublicArticle {
  const data = document.data() ?? {};
  const fileKey = typeof data.fileKey === "string" ? data.fileKey : undefined;
  const article = {
    _id: document.id,
    id: document.id,
    ...data,
    ...(content !== undefined ? { content: content ?? "" } : {}),
    ...(fileKey ? { fileUrl: studyMaterialUrl(fileKey) } : {}),
  };
  return serializeValue(article) as PublicArticle;
}

export function createArticleMetadata(data: Record<string, unknown>) {
  const published = data.published === true;
  return {
    ...data,
    publishedAt: published ? FieldValue.serverTimestamp() : null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

export function updateArticleMetadata(data: Record<string, unknown>, wasPublished: boolean) {
  const next: Record<string, unknown> = { ...data, updatedAt: FieldValue.serverTimestamp() };
  if (data.published === true && !wasPublished) next.publishedAt = FieldValue.serverTimestamp();
  return next;
}

export function timestamp(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }
  const parsed = typeof value === "string" ? Date.parse(value) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}
