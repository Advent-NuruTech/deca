"use client";

import { firebaseAuth } from "@/lib/firebase/client";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // This helper deliberately never forwards a Firebase token off-origin.
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("api only supports same-origin paths");
  }
  const user = firebaseAuth().currentUser;
  const token = user ? await user.getIdToken() : null;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  // Let the browser add multipart/form-data and its required boundary for
  // FormData uploads. JSON requests are serialized to strings by this helper.
  if (typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...init, headers, credentials: "same-origin" });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Request failed";
    throw new ApiError(response.status, message);
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "DELETE", body: body === undefined ? undefined : JSON.stringify(body) }),
  upload: <T>(path: string, body: FormData) => request<T>(path, { method: "POST", body }),
};
