import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { normalizePhone, readChatSettings } from "@/lib/chat-settings";
import { firestore } from "@/lib/firestore";
import type { ChatCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return NextResponse.json(await readChatSettings());
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = (await request.json().catch(() => null)) as {
      directPhone?: unknown;
      categories?: unknown;
    } | null;
    const directPhone = normalizePhone(typeof body?.directPhone === "string" ? body.directPhone : "");
    if (!/^\d{7,15}$/.test(directPhone)) {
      throw new HttpError(400, "Enter a valid direct-message WhatsApp number with its country code.");
    }
    if (!Array.isArray(body?.categories) || body.categories.length === 0) {
      throw new HttpError(400, "Add at least one chat category.");
    }

    const categories: ChatCategory[] = body.categories.map((value, index) => {
      if (!value || typeof value !== "object") throw new HttpError(400, `Category ${index + 1} is invalid.`);
      const item = value as Partial<ChatCategory>;
      const label = typeof item.label === "string" ? item.label.trim() : "";
      const phone = normalizePhone(typeof item.phone === "string" ? item.phone : "");
      if (!label || label.length > 80) throw new HttpError(400, `Category ${index + 1} needs a name under 80 characters.`);
      if (!/^\d{7,15}$/.test(phone)) throw new HttpError(400, `Category ${index + 1} needs a valid WhatsApp number.`);
      const id = typeof item.id === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(item.id)
        ? item.id
        : `category-${Date.now()}-${index}`;
      return { id, label, phone };
    });

    const settings = { directPhone, categories };
    await firestore().collection("settings").doc("chat").set({
      ...settings,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json(settings);
  } catch (error) {
    return errorResponse(error);
  }
}
