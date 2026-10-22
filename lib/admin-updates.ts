import "server-only";
import { HttpError } from "@/lib/auth";
import { sanitizeRichText, richTextToPlainText } from "@/lib/rich-text";

export function validateUpdate(input: unknown) {
  if (!input || typeof input !== "object") throw new HttpError(400, "Enter the update details.");
  const { title, content } = input as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim() || title.trim().length > 120) throw new HttpError(400, "Enter a title of up to 120 characters.");
  if (typeof content !== "string" || content.length > 20000) throw new HttpError(400, "The update is too long.");
  const safe = sanitizeRichText(content);
  const text = richTextToPlainText(safe);
  if (!text.trim() || text.length > 5000) throw new HttpError(400, "Enter an update of up to 5,000 characters.");
  return { title: title.trim(), content: safe };
}
export function validateUpdateId(id: string) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) throw new HttpError(400, "Invalid update.");
  return id;
}
