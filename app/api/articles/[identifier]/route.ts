import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { deleteArticleContent, getArticleContent, saveArticleContent } from "@/lib/article-content";
import {
  articleSlug,
  assertUniqueArticleSlug,
  serializeArticle,
  updateArticleMetadata,
  validateArticleBody,
} from "@/lib/articles";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PUBLIC_ARTICLES_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
import { getCachedPublishedArticleBySlug } from "@/lib/public-content";
import { deleteImage, publicIdFromManagedUrl } from "@/lib/cloudinary";
import { deleteFromR2 } from "@/lib/r2";
import { getResourceTaxonomy, resolveArticleAssignment, validateResourceAssignment } from "@/lib/resource-taxonomy";
import { validateStudyMaterialKey } from "@/lib/study-materials";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    const { identifier } = await params;
    const adminView = request.nextUrl.searchParams.get("scope") === "admin";
    if (!adminView) {
      const article = await getCachedPublishedArticleBySlug(identifier);
      if (!article) throw new HttpError(404, "Article not found");
      const content = await getArticleContent(article.id);
      if (content === null) throw new HttpError(404, "Article content not found");
      await firestore().collection("articles").doc(article.id).update({ views: FieldValue.increment(1) });
      return NextResponse.json(
        { ...article, content },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }

    await requireAdmin(request);
    const collection = firestore().collection("articles");
    const directDocument = await collection.doc(identifier).get();
    const snapshot = directDocument?.exists
      ? null
      : await collection.where("slug", "==", identifier).limit(1).get();
    const document = directDocument?.exists ? directDocument : snapshot?.docs[0];
    if (!document) {
      throw new HttpError(404, "Article not found");
    }

    const content = await getArticleContent(document.id);
    if (content === null) throw new HttpError(404, "Article content not found");
    const taxonomy = await getResourceTaxonomy({ initialize: true, includeDrafts: true });
    const serializeWithAssignment = (value: typeof document, body: string) => ({
      ...serializeArticle(value, body),
      ...resolveArticleAssignment(value.data() ?? {}, taxonomy),
    });
    return NextResponse.json(serializeWithAssignment(document, content));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    await requireAdmin(request);
    const { identifier } = await params;
    const reference = firestore().collection("articles").doc(identifier);
    const existing = await reference.get();
    if (!existing.exists) throw new HttpError(404, "Article not found");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A valid JSON article body is required");
    }
    const { content, metadata } = validateArticleBody(body, true);
    const input = body as Record<string, unknown>;
    for (const key of ["featuredImage", "studyCategory", "seoTitle", "seoDescription"] as const) {
      if (key in input && (input[key] === "" || input[key] === null)) metadata[key] = FieldValue.delete();
    }
    const existingData = existing.data() ?? {};
    await validateResourceAssignment(metadata, existingData);
    if (metadata.isDownloadable === true && !metadata.fileKey && !existingData.fileKey) {
      throw new HttpError(400, "fileKey is required for a downloadable article");
    }
    if (metadata.isDownloadable === false) {
      metadata.fileKey = FieldValue.delete();
      metadata.fileName = FieldValue.delete();
      metadata.fileType = FieldValue.delete();
    }
    if (typeof metadata.title === "string") {
      const slug = articleSlug(metadata.title);
      await assertUniqueArticleSlug(slug, identifier);
      metadata.slug = slug;
    }

    const oldContent = content === undefined ? undefined : await getArticleContent(identifier);
    if (content !== undefined) await saveArticleContent(identifier, content);

    try {
      await reference.update(updateArticleMetadata(metadata, existingData.published === true));
    } catch (error) {
      if (content !== undefined) {
        try {
          if (oldContent === null) await deleteArticleContent(identifier);
          else if (typeof oldContent === "string") await saveArticleContent(identifier, oldContent);
        } catch (rollbackError) {
          throw new Error(
            `Firestore update failed and D1 rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : "unknown rollback error"}`,
            { cause: error },
          );
        }
      }
      throw error;
    }

    const updated = await reference.get();
    const nextContent = content ?? (await getArticleContent(identifier));
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json(serializeArticle(updated, nextContent));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    await requireAdmin(request);
    const { identifier } = await params;
    const reference = firestore().collection("articles").doc(identifier);
    const existing = await reference.get();
    if (!existing.exists) throw new HttpError(404, "Article not found");

    const oldContent = await getArticleContent(identifier);
    const existingData = existing.data() ?? {};
    const fileKey = typeof existingData.fileKey === "string" ? validateStudyMaterialKey(existingData.fileKey) : "";
    const imagePublicId = typeof existingData.featuredImage === "string" ? publicIdFromManagedUrl(existingData.featuredImage) : null;
    await Promise.all([
      ...(fileKey ? [deleteFromR2(fileKey)] : []),
      ...(imagePublicId ? [deleteImage(imagePublicId)] : []),
    ]);
    await deleteArticleContent(identifier);
    try {
      await reference.delete();
    } catch (error) {
      if (oldContent !== null) {
        try {
          await saveArticleContent(identifier, oldContent);
        } catch (rollbackError) {
          throw new Error(
            `Firestore delete failed and D1 rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : "unknown rollback error"}`,
            { cause: error },
          );
        }
      }
      throw error;
    }

    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
