import "server-only";

import { firestore, firestoreConfigured } from "@/lib/firestore";
import type { ChatCategory, ChatSettings } from "@/lib/types";
import { DEFAULT_CHAT_SETTINGS } from "@/lib/chat-defaults";

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function isChatCategory(value: unknown): value is ChatCategory {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ChatCategory>;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.phone === "string" &&
    item.label.trim().length > 0 &&
    /^\d{7,15}$/.test(normalizePhone(item.phone))
  );
}

export function sanitizeChatSettings(value: unknown): ChatSettings {
  if (!value || typeof value !== "object") return DEFAULT_CHAT_SETTINGS;
  const candidate = value as Partial<ChatSettings>;
  const directPhone = normalizePhone(typeof candidate.directPhone === "string" ? candidate.directPhone : "");
  const categories = Array.isArray(candidate.categories)
    ? candidate.categories.filter(isChatCategory).map((item) => ({
        id: item.id,
        label: item.label.trim(),
        phone: normalizePhone(item.phone),
      }))
    : [];

  if (!/^\d{7,15}$/.test(directPhone) || categories.length === 0) {
    return DEFAULT_CHAT_SETTINGS;
  }
  return { directPhone, categories };
}

export async function readChatSettings(): Promise<ChatSettings> {
  if (!firestoreConfigured()) return DEFAULT_CHAT_SETTINGS;
  const document = await firestore().collection("settings").doc("chat").get();
  return document.exists ? sanitizeChatSettings(document.data()) : DEFAULT_CHAT_SETTINGS;
}

