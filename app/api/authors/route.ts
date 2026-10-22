import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { errorResponse, requireAdmin } from "@/lib/auth";
import { listAuthors, validateAuthor } from "@/lib/authors";
import { PUBLIC_ARTICLES_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
export async function GET(request: NextRequest) {
  try { await requireAdmin(request); return NextResponse.json(await listAuthors()); } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = validateAuthor(await request.json());
    const ref = firestore().collection("authors").doc();
    await ref.set({ ...data, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json({ id: ref.id, ...data }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
