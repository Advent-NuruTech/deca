"use client";

import type { ChatSettings, ResourceTaxonomy } from "@/lib/types";

let taxonomyRequest: Promise<ResourceTaxonomy> | undefined;
let chatSettingsRequest: Promise<ChatSettings> | undefined;

function fetchJson<T>(path: string): Promise<T> {
  return fetch(path).then((response) => {
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return response.json() as Promise<T>;
  });
}

export function getPublicTaxonomy() {
  taxonomyRequest ??= fetchJson<ResourceTaxonomy>("/api/resource-categories")
    .catch((error) => {
      taxonomyRequest = undefined;
      throw error;
    });
  return taxonomyRequest;
}

export function getPublicChatSettings() {
  chatSettingsRequest ??= fetchJson<ChatSettings>("/api/chat")
    .catch((error) => {
      chatSettingsRequest = undefined;
      throw error;
    });
  return chatSettingsRequest;
}
