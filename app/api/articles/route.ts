import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { deleteArticleContent, saveArticleContent } from "@/lib/article-content";
import {
  articleSlug,
  assertUniqueArticleSlug,
  createArticleMetadata,
  serializeArticle,
  timestamp,
  validateArticleBody,
} from "@/lib/articles";
import { firestore } from "@/lib/firestore";
import { PUBLIC_ARTICLES_TAG, PUBLIC_CACHE_CONTROL } from "@/lib/cache-tags";
import {
  beginD1ReadModelUpdate,
  deleteD1Article,
  markD1ReadModelReady,
  syncD1ArticleDocument,
} from "@/lib/d1-public-store";
import { getCachedPublishedArticles } from "@/lib/public-content";
import { getResourceTaxonomy, resolveArticleAssignment, validateResourceAssignment } from "@/lib/resource-taxonomy";
import type { PublicArticle, ResourceTaxonomy } from "@/lib/types";

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
    const allAdmin = adminView && request.nextUrl.searchParams.get("all") === "true";
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 12));

    let availableArticles: PublicArticle[];
    let resourceCategories: ResourceTaxonomy;
    if (adminView) {
      const snapshot = await firestore().collection("articles").get();
      resourceCategories = await getResourceTaxonomy({
        initialize: true,
        includeDrafts: true,
        articleDocuments: snapshot.docs,
      });
      availableArticles = snapshot.docs.map((document) => ({
        ...serializeArticle(document),
        ...resolveArticleAssignment(document.data(), resourceCategories),
      }));
    } else {
      const dataset = await getCachedPublishedArticles();
      availableArticles = dataset.articles;
      resourceCategories = dataset.resourceCategories;
    }

    const legacySubcategory = resourceCategories.subcategories.find((item) => item.id === category || item.slug === category || item.name.toLowerCase() === category);
    const legacyMajor = resourceCategories.majors.find((item) => item.id === category || item.slug === category || item.name.toLowerCase() === category);

    const matching = availableArticles
      .filter((article) => {
        if (requestedMajor && article.majorCategoryId !== requestedMajor) return false;
        if (requestedSubcategory && article.subcategoryId !== requestedSubcategory) return false;
        if (!category) return true;
        if (legacySubcategory) return article.subcategoryId === legacySubcategory.id;
        if (legacyMajor) return article.majorCategoryId === legacyMajor.id;
        return String(article.category ?? "").toLowerCase() === category || String(article.studyCategory ?? "").toLowerCase() === category;
      })
      .filter((article) => {
        if (downloadable === null) return true;
        return Boolean(article.isDownloadable) === (downloadable === "true");
      })
      .filter((article) => {
        if (!search) return true;
        return `${article.title ?? ""} ${article.excerpt ?? ""} ${(article.tags ?? []).toString()}`
          .toLowerCase()
          .includes(search);
      })
      .sort(
        (left, right) =>
          timestamp(right.publishedAt ?? right.createdAt) -
          timestamp(left.publishedAt ?? left.createdAt),
      );

    const total = matching.length;
    const totalPages = allAdmin ? 1 : Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const articles = allAdmin ? matching : matching.slice((currentPage - 1) * limit, currentPage * limit);

    const studyCategories = resourceCategories.subcategories
      .filter((item) => item.parentId === "study-library")
      .map((item) => ({ id: item.id, name: item.name, slug: item.slug, count: item.count }));

    return NextResponse.json(
      { articles, total, totalPages, currentPage, studyCategories, resourceCategories },
      adminView ? undefined : { headers: { "Cache-Control": PUBLIC_CACHE_CONTROL } },
    );
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
    const syncD1 = await beginD1ReadModelUpdate("articles");

    const reference = firestore().collection("articles").doc();
    const author = { uid: admin.uid, name: admin.name, email: admin.email };

    try {
      await reference.set(createArticleMetadata({ ...metadata, slug, author }));
      await saveArticleContent(reference.id, content ?? "");
      const created = await reference.get();
      if (syncD1) {
        await syncD1ArticleDocument(created);
        await markD1ReadModelReady("articles");
      }
    } catch (error) {
      const rollback = await Promise.allSettled([
        deleteArticleContent(reference.id),
        reference.delete(),
        ...(syncD1 ? [deleteD1Article(reference.id)] : []),
      ]);
      const criticalFailure = rollback.slice(0, 2).find((result) => result.status === "rejected");
      if (syncD1 && rollback[2]?.status === "fulfilled") {
        await markD1ReadModelReady("articles").catch(() => undefined);
      }
      if (criticalFailure?.status === "rejected") {
        throw new Error(
          `Article creation failed and rollback also failed: ${criticalFailure.reason instanceof Error ? criticalFailure.reason.message : "unknown rollback error"}`,
          { cause: error },
        );
      }
      throw error;
    }

    const created = await reference.get();
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json(serializeArticle(created, content), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
