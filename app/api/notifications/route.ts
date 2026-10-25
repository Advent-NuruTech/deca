import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAuth } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import { serializeValue } from "@/lib/products";

const CACHE_CONTROL = { "Cache-Control": "private, no-store" };
const notificationId = /^[A-Za-z0-9_-]{1,128}$/;

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const collection = firestore().collection("users").doc(user.uid).collection("notifications");
    const [notifications, unread] = await Promise.all([
      collection.orderBy("createdAt", "desc").limit(50).get(),
      collection.where("readAt", "==", null).count().get(),
    ]);
    return NextResponse.json({
      notifications: notifications.docs.map((document) => serializeValue({ id: document.id, ...document.data() })),
      unreadCount: unread.data().count,
    }, { headers: CACHE_CONTROL });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "Invalid notification update");
    const ids = (body as { ids?: unknown }).ids;
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 50 || ids.some((id) => typeof id !== "string" || !notificationId.test(id))) {
      throw new HttpError(400, "Choose one or more valid notifications");
    }
    const notificationIds = ids as string[];
    const batch = firestore().batch();
    const collection = firestore().collection("users").doc(user.uid).collection("notifications");
    for (const id of new Set(notificationIds)) batch.update(collection.doc(id), { readAt: FieldValue.serverTimestamp() });
    await batch.commit();
    return NextResponse.json({ success: true }, { headers: CACHE_CONTROL });
  } catch (error) {
    return errorResponse(error);
  }
}
