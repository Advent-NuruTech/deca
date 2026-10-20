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
import { getResourceTaxonomy, resolveArticleAssignment, validateResourceAssignment } from "@/lib/resource-taxonomy";

export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("scope") === "admin";
    if (adminView) await requireAdmin(request);
    const category = request.nextUrl.searchParams.get("category")?.trim().toLowerCase() ?? "";
    const requestedMajor = request.nextUrl.searchParams.get("majorCategoryId")?.trim() ?? request.nextUrl.searchParams.get("major")?.trim() ?? "";
    const requestedSubcategory = request.nextUrl.searchParams.get("subcategoryId")?.trim() ?? "";
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const downloadable = request.nextUrl.searchParams.get("isDownloadable");
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 12));

    const db = firestore();
    const [snapshot, resourceCategories] = await Promise.all([
      db.collection("articles").get(),
      getResourceTaxonomy({ initialize: adminView, includeDrafts: adminView }),
    ]);
    const visibleDocuments = snapshot.docs.filter(
      (document) => adminView || document.data().published === true,
    );

    const legacySubcategory = resourceCategories.subcategories.find((item) => item.id === category || item.slug === category || item.name.toLowerCase() === category);
    const legacyMajor = resourceCategories.majors.find((item) => item.id === category || item.slug === category || item.name.toLowerCase() === category);

    const matching = visibleDocuments
      .filter((document) => {
        const data = document.data();
        const assignment = resolveArticleAssignment(data, resourceCategories);
        if (requestedMajor && assignment.majorCategoryId !== requestedMajor) return false;
        if (requestedSubcategory && assignment.subcategoryId !== requestedSubcategory) return false;
        if (!category) return true;
        if (legacySubcategory) return assignment.subcategoryId === legacySubcategory.id;
        if (legacyMajor) return assignment.majorCategoryId === legacyMajor.id;
        return String(data.category ?? "").toLowerCase() === category || String(data.studyCategory ?? "").toLowerCase() === category;
      })
      .filter((document) => {
        if (downloadable === null) return true;
        return Boolean(document.data().isDownloadable) === (downloadable === "true");
      })
      .filter((document) => {
        if (!search) return true;
        const data = document.data();
        return `${data.title ?? ""} ${data.description ?? ""} ${data.excerpt ?? ""} ${(data.tags ?? []).toString()}`
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
      .map((document) => ({ ...serializeArticle(document), ...resolveArticleAssignment(document.data(), resourceCategories) }));

    const studyCategories = resourceCategories.subcategories
      .filter((item) => item.parentId === "study-library")
      .map((item) => ({ id: item.id, name: item.name, slug: item.slug, count: item.count }));

    return NextResponse.json({ articles, total, totalPages, currentPage, studyCategories, resourceCategories });
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
    await validateResourceAssignment(metadata);
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
