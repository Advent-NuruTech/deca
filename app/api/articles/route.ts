import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { saveArticleContent } from "@/lib/article-content";
import {
  articleSlug,
  assertUniqueArticleSlug,
  createArticleMetadata,
  serializeArticle,
  timestamp,
  validateArticleBody,
} from "@/lib/articles";
import { firestore } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("scope") === "admin";
    if (adminView) await requireAdmin(request);
    const category = request.nextUrl.searchParams.get("category")?.trim().toLowerCase() ?? "";
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const downloadable = request.nextUrl.searchParams.get("isDownloadable");
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 12));

    const snapshot = await firestore().collection("articles").get();
    const matching = snapshot.docs
      .filter((document) => adminView || document.data().published === true)
      .filter((document) => {
        if (!category) return true;
        const data = document.data();
        const articleCategory = String(data.category ?? "").toLowerCase();
        const studyCategory = String(data.studyCategory ?? "").toLowerCase();
        return articleCategory === category || (data.isDownloadable === true && studyCategory === category);
      })
      .filter((document) => {
        if (downloadable === null) return true;
        return Boolean(document.data().isDownloadable) === (downloadable === "true");
      })
      .filter((document) => {
        if (!search) return true;
        const data = document.data();
        return `${data.title ?? ""} ${data.excerpt ?? ""} ${(data.tags ?? []).toString()}`
          .toLowerCase()
          .includes(search);
      })
      .sort(
        (left, right) =>
          timestamp(right.data().publishedAt ?? right.data().createdAt) -
          timestamp(left.data().publishedAt ?? left.data().createdAt),
      );

    const total = matching.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const articles = matching
      .slice((currentPage - 1) * limit, currentPage * limit)
      .map((document) => serializeArticle(document));

    return NextResponse.json({ articles, total, totalPages, currentPage });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A valid JSON article body is required");
    }

    const { content, metadata } = validateArticleBody(body);
    const slug = articleSlug(metadata.title as string);
    await assertUniqueArticleSlug(slug);

    const reference = firestore().collection("articles").doc();
    const author = { uid: admin.uid, name: admin.name, email: admin.email };
    await reference.set(createArticleMetadata({ ...metadata, slug, author }));

    try {
      await saveArticleContent(reference.id, content!);
    } catch (error) {
      try {
        await reference.delete();
      } catch (rollbackError) {
        throw new Error(
          `Article content write failed and Firestore rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : "unknown rollback error"}`,
          { cause: error },
        );
      }
      throw error;
    }

    const created = await reference.get();
    return NextResponse.json(serializeArticle(created, content), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
