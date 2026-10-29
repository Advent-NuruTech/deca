import "server-only";

import { unstable_cache } from "next/cache";
import { CHAT_SETTINGS_TAG } from "@/lib/cache-tags";
import { firestore, firestoreConfigured } from "@/lib/firestore";
import type { ChatCategory, ChatSettings } from "@/lib/types";
import { DEFAULT_CHAT_SETTINGS } from "@/lib/chat-defaults";

const legacyIds = ["study-materials", "it-field", "photocopiers", "computers", "homeschooling", "agriculture", "seeds", "health-products"];
const legacyLabels = ["Study Materials", "IT Field", "Photocopiers", "Computers", "Homeschooling", "Agriculture", "Seeds", "Health Products"];

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
  // Replace the untouched settings from the previous business while preserving edits.
  if (candidate.directPhone === "254721627977" && Array.isArray(candidate.categories) &&
      candidate.categories.length === legacyIds.length && candidate.categories.every((item, index) =>
        item?.id === legacyIds[index] && item.label === legacyLabels[index] && item.phone === (index < 4 ? "254721627977" : "254746840322"))) {
    return DEFAULT_CHAT_SETTINGS;
  }
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

export const getCachedChatSettings = unstable_cache(
  readChatSettings,
  ["public-chat-settings-v2"],
  { revalidate: 3600, tags: [CHAT_SETTINGS_TAG] },
);
