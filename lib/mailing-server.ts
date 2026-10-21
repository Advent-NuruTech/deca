import "server-only";

import { createHmac } from "node:crypto";
import { getStorage } from "firebase-admin/storage";
import { FieldValue, Timestamp, type Firestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase/admin";
import { firestore } from "@/lib/firestore";
import { requireAdmin } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { automaticPreviewText, inlineVideoLinks, personalizedGreeting, richTextToPlainText, sanitizeRichText } from "@/lib/rich-text";

export { FieldValue, Timestamp };

export type Campaign = {
  kind: "meeting" | "newsletter";
  subject: string;
  headline: string;
  letterTitle: string;
  preheader: string;
  body: string;
  buttonLabel: string;
  buttonUrl: string;
  videoUrl: string;
};

export type CampaignAudience = {
  mode: "all" | "selected" | "new";
  recipientIds: string[];
  since: string;
};

type Recipient = { id: string; email: string; name?: string };
type DeliveryFailure = { id: string; email: string; error: string; retryable: boolean };
type DeliveryResult = { sent: number; failures: DeliveryFailure[] };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

function safeSiteUrl(value: string) {
  const fallback = "https://remsamhomestead.com";
  try {
    const url = new URL(value || fallback);
    return url.protocol === "https:" ? url.origin : fallback;
  } catch {
    return fallback;
  }
}

function unsubscribeUrl(recipientId: string, baseUrl: string) {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
  if (!secret) return "";
  const signature = createHmac("sha256", secret).update(recipientId).digest("hex");
  return `${safeSiteUrl(baseUrl)}/api/mailing/unsubscribe?id=${recipientId}&sig=${signature}`;
}

function emailDocument(campaign: Campaign, recipient: Recipient, baseUrl: string) {
  const greeting = personalizedGreeting(recipient.name);
  const preview = campaign.preheader || automaticPreviewText(campaign.body);
  const body = inlineVideoLinks(sanitizeRichText(campaign.body));
  const unsubscribe = campaign.kind === "newsletter" ? unsubscribeUrl(recipient.id, baseUrl) : "";
  const button = campaign.buttonUrl && campaign.buttonLabel
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0"><tr><td style="border-radius:10px;background:${brand.colors.primary}"><a href="${escapeHtml(campaign.buttonUrl)}" style="display:inline-block;padding:14px 24px;color:#fff;text-decoration:none;font:700 15px Arial,sans-serif">${escapeHtml(campaign.buttonLabel)}</a></td></tr></table>`
    : "";
  const footer = unsubscribe
    ? `You are receiving this because you subscribed to Remsam Homestead. <a href="${escapeHtml(unsubscribe)}" style="color:${brand.colors.primaryDark}">Unsubscribe</a>`
    : "You are receiving this message from Remsam Homestead.";
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(campaign.subject)}</title></head><body style="margin:0;background:${brand.colors.canvas};color:${brand.colors.ink};font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preview)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand.colors.canvas};padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:${brand.colors.surface};border:1px solid ${brand.colors.border};border-radius:18px;overflow:hidden"><tr><td style="height:7px;background:${brand.colors.primary}"></td></tr><tr><td style="padding:34px 38px 16px"><p style="margin:0;color:${brand.colors.primaryDark};font-size:12px;font-weight:800;letter-spacing:2px">REMSAM HOMESTEAD</p><p style="margin:9px 0 0;color:${brand.colors.muted};font-size:13px">Faith · Family · Farming</p></td></tr><tr><td style="padding:12px 38px 36px"><p style="margin:0 0 18px;color:${brand.colors.muted};font-size:13px;font-weight:700;text-transform:uppercase">${escapeHtml(campaign.letterTitle)}</p><h1 style="margin:0 0 24px;color:${brand.colors.ink};font:700 32px/1.2 Georgia,serif">${escapeHtml(campaign.headline)}</h1><p style="margin:0 0 18px;font-size:17px;line-height:1.7">${escapeHtml(greeting)}</p><div style="font-size:17px;line-height:1.75;color:${brand.colors.ink}">${body}</div>${button}</td></tr><tr><td style="padding:24px 38px;background:${brand.colors.soft};border-top:1px solid ${brand.colors.border}"><p style="margin:0 0 7px;color:${brand.colors.primaryDark};font-size:13px;font-weight:800">Remsam Homestead</p><p style="margin:0;color:${brand.colors.muted};font-size:12px;line-height:1.6">${footer}</p></td></tr></table></td></tr></table></body></html>`;
}

export function getMailDb() { return firestore(); }
export function getMailStorageBucket() { return getStorage(adminApp()).bucket(); }

export async function requireMailAdmin(request: Request) {
  try { return (await requireAdmin(request as Parameters<typeof requireAdmin>[0])).uid; }
  catch { return ""; }
}

export function parseCampaignAudience(mode: unknown, recipientIds: unknown, since: unknown): CampaignAudience | string {
  if (mode !== "all" && mode !== "selected" && mode !== "new") return "Choose who should receive this email.";
  const ids = Array.isArray(recipientIds)
    ? [...new Set(recipientIds.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 150))].slice(0, 500)
    : [];
  if (mode === "selected" && ids.length === 0) return "Select at least one recipient.";
  const date = typeof since === "string" && since ? new Date(since) : null;
  if (mode === "new" && (!date || Number.isNaN(date.getTime()))) return "Choose the date used to identify new recipients.";
  return { mode, recipientIds: ids, since: date?.toISOString() ?? "" };
}

export async function getCampaignRecipients(mailDb: Firestore, campaign: Campaign, audience: CampaignAudience): Promise<Recipient[]> {
  const collection = campaign.kind === "meeting" ? "onlineMeetingMembers" : "newsletterSubscribers";
  const status = campaign.kind === "meeting" ? "verified" : "active";
  const snapshot = await mailDb.collection(collection).where("status", "==", status).limit(500).get();
  const selected = new Set(audience.recipientIds);
  const since = audience.since ? new Date(audience.since).getTime() : 0;
  return snapshot.docs.flatMap((document) => {
    const data = document.data();
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    if (!emailPattern.test(email)) return [];
    if (audience.mode === "selected" && !selected.has(document.id)) return [];
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0;
    if (audience.mode === "new" && createdAt <= since) return [];
    return [{ id: document.id, email, ...(typeof data.name === "string" && data.name.trim() ? { name: data.name.trim() } : {}) }];
  });
}

export async function getEmailsSentCount(mailDb: Firestore) {
  const summary = await mailDb.collection("mailingStats").doc("summary").get();
  const value = summary.get("emailsSent");
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function sendWithResend(campaign: Campaign, recipient: Recipient, baseUrl: string, key: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email delivery is not configured.");
  const unsubscribe = campaign.kind === "newsletter" ? unsubscribeUrl(recipient.id, baseUrl) : "";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `${key}:${recipient.id}`.slice(0, 256) },
    body: JSON.stringify({
      from, to: [recipient.email], subject: campaign.subject,
      html: emailDocument(campaign, recipient, baseUrl),
      text: `${personalizedGreeting(recipient.name)}\n\n${campaign.headline}\n\n${richTextToPlainText(campaign.body)}${campaign.buttonUrl ? `\n\n${campaign.buttonLabel}: ${campaign.buttonUrl}` : ""}${unsubscribe ? `\n\nUnsubscribe: ${unsubscribe}` : ""}`,
      ...(unsubscribe ? { headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}),
    }),
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    const error = new Error(`Resend rejected the email (HTTP ${response.status})${details ? `: ${details.slice(0, 240)}` : "."}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
}

export async function deliverCampaign(campaign: Campaign, recipients: Recipient[], baseUrl: string, key: string): Promise<DeliveryResult> {
  const failures: DeliveryFailure[] = [];
  let sent = 0;
  for (let index = 0; index < recipients.length; index += 8) {
    await Promise.all(recipients.slice(index, index + 8).map(async (recipient) => {
      try { await sendWithResend(campaign, recipient, baseUrl, key); sent += 1; }
      catch (reason) {
        const status = typeof reason === "object" && reason !== null && "status" in reason ? Number(reason.status) : 0;
        failures.push({ id: recipient.id, email: recipient.email, error: reason instanceof Error ? reason.message : "Unknown delivery error", retryable: status === 0 || status === 429 || status >= 500 });
      }
    }));
  }
  return { sent, failures };
}

export async function sendNewsletterWelcome(recipient: Recipient, baseUrl: string) {
  return deliverCampaign({
    kind: "newsletter", subject: "Welcome to Remsam Homestead", letterTitle: "Welcome to the homestead",
    headline: "Faith, family, and farming—delivered with care", preheader: "You’re now part of the Remsam Homestead community.",
    body: "<p>Thank you for joining us. You’ll receive thoughtful stories, practical homestead ideas, faith-filled encouragement, and news from our farm in Kenya.</p><p>We’re grateful to have you here.</p>",
    buttonLabel: "Visit Remsam Homestead", buttonUrl: safeSiteUrl(baseUrl), videoUrl: "",
  }, [recipient], baseUrl, `newsletter-welcome:${recipient.id}`);
}

export async function sendMeetingRequestWelcome(recipient: Recipient, baseUrl: string) {
  return deliverCampaign({
    kind: "meeting", subject: "We received your Remsam Homestead meeting request", letterTitle: "Meeting request received",
    headline: "Thank you for reaching out", preheader: "The Remsam Homestead team will follow up with your meeting details.",
    body: "<p>Your request is safely with our team. We’ll review it and send the online meeting link as soon as it is ready.</p><p>We look forward to connecting with you.</p>",
    buttonLabel: "Visit Remsam Homestead", buttonUrl: safeSiteUrl(baseUrl), videoUrl: "",
  }, [recipient], baseUrl, `meeting-request:${recipient.id}:${Date.now()}`);
}
