import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { authorId, validateAuthor } from "@/lib/authors";
import { PUBLIC_ARTICLES_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const id = authorId((await params).id);
    const data = validateAuthor(await request.json());
    const ref = firestore().collection("authors").doc(id);
    if (!(await ref.get()).exists) throw new HttpError(404, "Author not found.");
    await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json({ id, ...data });
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const id = authorId((await params).id);
    const ref = firestore().collection("authors").doc(id);
    await firestore().runTransaction(async (transaction) => {
      const profile = await transaction.get(ref);
      if (!profile.exists) throw new HttpError(404, "Author not found.");
      const references = await transaction.get(firestore().collection("articles").where("author.uid", "==", id));
      if (references.docs.some((doc) => doc.data().author?.managed === true)) throw new HttpError(409, "This author is assigned to a resource. Choose another author for those resources before deleting.");
      transaction.delete(ref);
    });
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json({ message: "Author deleted." });
  } catch (error) { return errorResponse(error); }
}
