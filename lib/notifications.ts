import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "@/lib/firestore";

export type NotificationInput = {
  title: string;
  body: string;
  href?: string;
  kind?: "account" | "order" | "payment" | "contact" | "donation" | "interest" | "system";
};

function clean(value: string, maximum: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, maximum);
}

/**
 * Notifications live below their recipient's profile, so an API can always
 * authorize access from the authenticated user's uid without exposing a global
 * activity feed.
 */
export async function notifyUser(uid: string, input: NotificationInput) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(uid)) return;
  const title = clean(input.title, 160);
  const body = clean(input.body, 500);
  if (!title || !body) return;

  await firestore().collection("users").doc(uid).collection("notifications").doc().set({
    title,
    body,
    href: typeof input.href === "string" && input.href.startsWith("/") ? input.href : "",
    kind: input.kind ?? "system",
    readAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function notifyAdmins(input: NotificationInput) {
  const administrators = await firestore().collection("users").where("role", "==", "admin").get();
  await Promise.all(administrators.docs.map((administrator) => notifyUser(administrator.id, input)));
}

/** Notifications must never make a completed customer transaction fail. */
export function notifySafely(task: Promise<unknown>, context: string) {
  void task.catch((error) => console.error(`Notification delivery failed (${context})`, error));
}
