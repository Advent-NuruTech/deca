import "server-only";

import { HttpError } from "@/lib/auth";

export const STUDY_MATERIAL_FOLDER = "study-materials";
export const MAX_STUDY_MATERIAL_BYTES = 20 * 1024 * 1024;

const DOCUMENT_TYPES = new Map<string, string>([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".ppt", "application/vnd.ms-powerpoint"],
  [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
]);

export function safeDocumentName(value: string): string {
  const name = value.replace(/\\/g, "/").split("/").pop()?.trim() ?? "";
  const safe = name.replace(/[\r\n\0"]/g, "_").replace(/[^a-zA-Z0-9._ -]/g, "_");
  if (!safe || safe === "." || safe === "..") throw new HttpError(400, "Invalid document filename");
  return safe.slice(0, 180);
}

export function validateStudyDocument(file: File): { name: string; contentType: string } {
  const name = safeDocumentName(file.name);
  const extension = name.includes(".") ? `.${name.split(".").pop()!.toLowerCase()}` : "";
  const contentType = DOCUMENT_TYPES.get(extension);
  if (!contentType || file.type !== contentType) {
    throw new HttpError(415, "Only PDF, DOC, DOCX, PPT and PPTX documents are allowed");
  }
  if (file.size === 0) throw new HttpError(400, "The document is empty");
  if (file.size > MAX_STUDY_MATERIAL_BYTES) {
    throw new HttpError(413, "Documents must be 20 MB or smaller");
  }
  return { name, contentType };
}

export function validateStudyMaterialKey(value: unknown): string {
  if (typeof value !== "string") throw new HttpError(400, "A document key is required");
  const key = value.trim().replace(/^\/+/, "");
  if (
    !key.startsWith(`${STUDY_MATERIAL_FOLDER}/`) ||
    key.length > 500 ||
    key.includes("\\") ||
    key.includes("..") ||
    /[\r\n\0]/.test(key)
  ) {
    throw new HttpError(400, "Invalid study-material document key");
  }
  return key;
}

export function studyMaterialUrl(key: string): string {
  const managedKey = validateStudyMaterialKey(key);
  return `/api/study-materials/${managedKey.split("/").map(encodeURIComponent).join("/")}`;
}

export function keyFromStudyMaterialUrl(value: string): string | null {
  const prefix = "/api/study-materials/";
  if (!value.startsWith(prefix)) return null;
  try {
    return validateStudyMaterialKey(
      value
        .slice(prefix.length)
        .split("/")
        .map(decodeURIComponent)
        .join("/"),
    );
  } catch {
    return null;
  }
}

export function attachmentHeader(filename: string): string {
  const safe = safeDocumentName(filename);
  const ascii = safe.replace(/[^\x20-\x7E]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(safe)}`;
}
