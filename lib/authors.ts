import "server-only";
import { HttpError } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { sanitizeRichText, richTextToPlainText } from "@/lib/rich-text";
import type { AppUser, ArticleAuthor, AuthorProfile, PublicArticle } from "@/lib/types";

export function validateAuthor(value: unknown): { name: string; bio: string } {
  if (!value || typeof value !== "object") throw new HttpError(400, "Author details are required.");
  const input = value as Record<string, unknown>;
  if (typeof input.name !== "string" || !input.name.trim() || input.name.trim().length > 120) throw new HttpError(400, "Enter an author name of up to 120 characters.");
  if (typeof input.bio !== "string" || input.bio.length > 20000) throw new HttpError(400, "Author biography is too long.");
  const bio = sanitizeRichText(input.bio);
  if (richTextToPlainText(bio).length > 5000) throw new HttpError(400, "Author biography must be 5,000 characters or less.");
  return { name: input.name.trim(), bio };
}
export function authorId(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw new HttpError(400, "Invalid author.");
  return value;
}
export async function listAuthors(): Promise<AuthorProfile[]> {
  const snapshot = await firestore().collection("authors").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, name: String(doc.data().name || ""), bio: String(doc.data().bio || "") })).sort((a, b) => a.name.localeCompare(b.name));
}
export async function selectedAuthor(value: unknown, admin: AppUser): Promise<ArticleAuthor> {
  if (value === undefined || value === "") return { uid: admin.uid, name: admin.name, email: admin.email };
  const id = authorId(value);
  const doc = await firestore().collection("authors").doc(id).get();
  if (!doc.exists) throw new HttpError(400, "The selected author no longer exists. Choose another author.");
  return { uid: id, name: String(doc.data()?.name || ""), bio: String(doc.data()?.bio || ""), managed: true };
}
export function resolveAuthors(articles: PublicArticle[], authors: AuthorProfile[]): PublicArticle[] {
  const byId = new Map(authors.map((author) => [author.id, author]));
  return articles.map((article) => {
    const profile = article.author?.managed ? byId.get(article.author.uid) : undefined;
    return profile ? { ...article, author: { ...article.author, name: profile.name, bio: profile.bio } } : article;
  });
}
