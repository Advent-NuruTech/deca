"use client";

import { api } from "@/lib/api";

type QueryValue = string | number | boolean | null | undefined;

type GetOptions = {
  params?: Record<string, QueryValue>;
};

/** Compatibility wrapper for the public pages while preserving the Phase 2 fetch/auth boundary. */
const publicApi = {
  async get<T = unknown>(path: string, options: GetOptions = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params ?? {})) {
      if (value !== null && value !== undefined && value !== "") query.set(key, String(value));
    }
    const apiPath = path.startsWith("/api/") ? path : `/api${path}`;
    const data = await api.get<T>(`${apiPath}${query.size ? `?${query}` : ""}`);
    return { data };
  },
};

export default publicApi;
