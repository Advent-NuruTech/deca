import "server-only";

import { createHmac } from "node:crypto";
import { getStorage } from "firebase-admin/storage";
import { FieldValue, Timestamp, type Firestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase/admin";
import { firestore } from "@/lib/firestore";
import { requireAdmin } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { automaticPreviewText, inlineVideoLinks, personalizedGreeting, richTextToPlainText, sanitizeRichText } from "@/lib/rich-text";
import { getCachedPublishedArticles } from "@/lib/public-content";
import { timestamp } from "@/lib/articles";
import { STUDY_MAJOR_ID } from "@/lib/resource-taxonomy";
import { getChannels, listVideos, type Video } from "@/lib/youtube";

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
type DeliveryOptions = { contentAfterBody?: string; textSuffix?: string };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

function safeSiteUrl(value: string) {
  const fallback = "https://gileadmedicare.co.ke";
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

function legacyEmailDocument(campaign: Campaign, recipient: Recipient, baseUrl: string, options: DeliveryOptions = {}) {
  const greeting = personalizedGreeting(recipient.name);
  const preview = campaign.preheader || automaticPreviewText(campaign.body);
  const body = inlineVideoLinks(sanitizeRichText(campaign.body));
  const unsubscribe = campaign.kind === "newsletter" ? unsubscribeUrl(recipient.id, baseUrl) : "";
  const button = campaign.buttonUrl && campaign.buttonLabel
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0"><tr><td style="border-radius:10px;background:${brand.colors.primary}"><a href="${escapeHtml(campaign.buttonUrl)}" style="display:inline-block;padding:14px 24px;color:#fff;text-decoration:none;font:700 15px Arial,sans-serif">${escapeHtml(campaign.buttonLabel)}</a></td></tr></table>`
    : "";
  const siteUrl = safeSiteUrl(baseUrl);
  const footerLinks = [
    `<a href="${siteUrl}/about" style="color:${brand.colors.primaryDark};text-decoration:underline">About Us</a>`,
    `<a href="${siteUrl}/contact" style="color:${brand.colors.primaryDark};text-decoration:underline">Contact Us</a>`,
    `<a href="${siteUrl}/study-materials" style="color:${brand.colors.primaryDark};text-decoration:underline">Study Library</a>`,
    ...(unsubscribe ? [`<a href="${escapeHtml(unsubscribe)}" style="color:${brand.colors.primaryDark};text-decoration:underline">Unsubscribe</a>`] : []),
  ].join(` <span style="color:${brand.colors.muted}">·</span> `);
  const logoUrl = `${siteUrl}/assets/logo-white.png`;
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(campaign.subject)}</title><style>@media only screen and (max-width:600px){.email-outer{padding:6px!important}.email-card{width:100%!important;border-radius:8px!important}.email-brand{padding:22px 12px!important}.email-content{padding:22px 18px 28px!important}.email-headline{font-size:30px!important;line-height:1.16!important}.email-footer{padding:20px 12px!important}.content-card{padding:12px!important}.content-copy{padding-left:12px!important}.content-thumb{width:104px!important}}</style></head><body style="margin:0;background:${brand.colors.canvas};color:${brand.colors.ink};font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preview)}</div><table role="presentation" class="email-outer" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${brand.colors.canvas};padding:18px 8px"><tr><td align="center"><table role="presentation" class="email-card" width="720" cellspacing="0" cellpadding="0" style="width:100%;max-width:720px;background:${brand.colors.surface};border:1px solid ${brand.colors.border};border-radius:12px;overflow:hidden"><tr><td class="email-brand" align="center" style="padding:28px 24px;background:${brand.colors.primaryDeep};background-image:linear-gradient(145deg,${brand.colors.primaryDark},${brand.colors.primaryDeep});color:#fff"><img src="${logoUrl}" alt="Remsam Homestead" width="78" height="78" style="display:block;width:78px;height:78px;object-fit:contain;margin:0 auto 12px;border:0"><div style="font-size:12px;letter-spacing:3px;font-weight:800;color:#fde68a">REMSAM HOMESTEAD</div><div style="height:1px;width:64px;background:${brand.colors.accent};margin:15px auto 11px"></div><div style="font-size:17px;line-height:1.4;font-style:italic;color:#fff">${escapeHtml(campaign.letterTitle)}</div></td></tr><tr><td class="email-content" style="padding:34px 38px 38px"><div style="height:3px;width:42px;background:${brand.colors.accent};margin:0 0 20px"></div><p style="margin:0 0 16px;color:${brand.colors.ink};font-size:17px;line-height:1.5">${escapeHtml(greeting)}</p><h1 class="email-headline" style="font-size:34px;line-height:1.18;letter-spacing:-.5px;margin:0 0 24px;color:${brand.colors.ink};font-family:Georgia,serif">${escapeHtml(campaign.headline)}</h1><div style="font-size:17px;line-height:1.7;color:${brand.colors.ink}">${body}</div>${options.contentAfterBody ?? ""}${button}</td></tr><tr><td class="email-footer" style="padding:22px 24px;background:${brand.colors.soft};border-top:1px solid ${brand.colors.border};color:${brand.colors.muted};font-size:13px;line-height:1.8;text-align:center"><strong style="color:${brand.colors.primaryDark};letter-spacing:1.5px">REMSAM HOMESTEAD</strong><br>Faith, Family, Farming<br>${footerLinks}<br><a href="${siteUrl}" style="color:${brand.colors.primaryDark};text-decoration:underline">Visit Remsam Homestead</a><br><span style="font-size:11px;color:${brand.colors.muted}">© Remsam Homestead</span></td></tr></table></td></tr></table></body></html>`;
}

function emailDocument(campaign: Campaign, recipient: Recipient, baseUrl: string, options: DeliveryOptions = {}) {
  const greeting = personalizedGreeting(recipient.name);
  const preview = campaign.preheader || automaticPreviewText(campaign.body);
  const body = inlineVideoLinks(sanitizeRichText(campaign.body));
  const unsubscribe = campaign.kind === "newsletter" ? unsubscribeUrl(recipient.id, baseUrl) : "";
  const button = campaign.buttonUrl && campaign.buttonLabel ? `<p style="margin:28px 0"><a href="${escapeHtml(campaign.buttonUrl)}" style="display:inline-block;padding:14px 24px;border-radius:10px;background:${brand.colors.primaryDeep};color:#fff;text-decoration:none;font:700 15px Arial,sans-serif">${escapeHtml(campaign.buttonLabel)}</a></p>` : "";
  const siteUrl = safeSiteUrl(baseUrl);
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(campaign.subject)}</title></head><body style="margin:0;background:${brand.colors.canvas};color:${brand.colors.ink};font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${brand.colors.canvas};padding:18px 8px"><tr><td align="center"><table role="presentation" width="720" cellspacing="0" cellpadding="0" style="width:100%;max-width:720px;background:${brand.colors.surface};border:1px solid ${brand.colors.border};border-radius:12px;overflow:hidden"><tr><td align="center" style="padding:28px 24px;background:${brand.colors.primaryDeep};color:#fff"><img src="${siteUrl}/assets/logo.jpeg" alt="Gilead Medicare" width="78" height="78" style="display:block;width:78px;height:78px;object-fit:cover;border-radius:16px;margin:0 auto 12px;border:0"><div style="font-size:12px;letter-spacing:3px;font-weight:800">GILEAD MEDICARE</div><div style="height:1px;width:64px;background:${brand.colors.primary};margin:15px auto 11px"></div><div style="font-size:17px;line-height:1.4;font-style:italic">${escapeHtml(campaign.letterTitle)}</div></td></tr><tr><td style="padding:34px 38px 38px"><p style="margin:0 0 16px;font-size:17px;line-height:1.5">${escapeHtml(greeting)}</p><h1 style="font-size:34px;line-height:1.18;letter-spacing:-.5px;margin:0 0 24px;color:${brand.colors.ink};font-family:Georgia,serif">${escapeHtml(campaign.headline)}</h1><div style="font-size:17px;line-height:1.7;color:${brand.colors.ink}">${body}</div>${options.contentAfterBody ?? ""}${button}</td></tr><tr><td style="padding:22px 24px;background:${brand.colors.soft};border-top:1px solid ${brand.colors.border};color:${brand.colors.muted};font-size:13px;line-height:1.8;text-align:center"><strong style="color:${brand.colors.primaryDeep};letter-spacing:1.5px">GILEAD MEDICARE</strong><br>Health education · wellness · community care<br><a href="${siteUrl}" style="color:${brand.colors.primaryDeep};text-decoration:underline">Visit Gilead Medicare</a>${unsubscribe ? `<br><a href="${escapeHtml(unsubscribe)}" style="color:${brand.colors.primaryDeep};text-decoration:underline">Unsubscribe</a>` : ""}</td></tr></table></td></tr></table></body></html>`;
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
    ? [...new Set(recipientIds.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 150))]
    : [];
  if (mode === "selected" && ids.length === 0) return "Select at least one recipient.";
  const date = typeof since === "string" && since ? new Date(since) : null;
  if (mode === "new" && (!date || Number.isNaN(date.getTime()))) return "Choose the date used to identify new recipients.";
  return { mode, recipientIds: ids, since: date?.toISOString() ?? "" };
}

export async function getCampaignRecipients(mailDb: Firestore, campaign: Campaign, audience: CampaignAudience): Promise<Recipient[]> {
  const collection = campaign.kind === "meeting" ? "onlineMeetingMembers" : "newsletterSubscribers";
  const status = campaign.kind === "meeting" ? "verified" : "active";
  const snapshot = await mailDb.collection(collection).where("status", "==", status).get();
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

export async function saveDeliveryHistory(
  mailDb: Firestore,
  data: FirebaseFirestore.DocumentData,
  sent: number,
  rootHistoryId?: string,
  baseline = 1,
) {
  const historyRef = mailDb.collection("mailingHistory").doc();
  await mailDb.runTransaction(async (transaction) => {
    let deliveryNumber = 1;
    if (rootHistoryId) {
      const counterRef = mailDb.collection("mailingDeliveryCounters").doc(rootHistoryId);
      const counter = await transaction.get(counterRef);
      deliveryNumber = Math.max(Number(counter.get("count")) || 1, baseline) + 1;
      transaction.set(counterRef, { count: deliveryNumber });
    }
    transaction.set(historyRef, { ...data, rootHistoryId: rootHistoryId || historyRef.id, deliveryNumber });
    transaction.set(mailDb.collection("mailingStats").doc("summary"), { emailsSent: FieldValue.increment(sent) }, { merge: true });
  });
}

export async function getEmailsSentCount(mailDb: Firestore) {
  const summary = await mailDb.collection("mailingStats").doc("summary").get();
  const value = summary.get("emailsSent");
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function sendWithResend(campaign: Campaign, recipient: Recipient, baseUrl: string, key: string, options: DeliveryOptions = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email delivery is not configured.");
  const unsubscribe = campaign.kind === "newsletter" ? unsubscribeUrl(recipient.id, baseUrl) : "";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `${key}:${recipient.id}`.slice(0, 256) },
    body: JSON.stringify({
      from, to: [recipient.email], subject: campaign.subject,
      html: emailDocument(campaign, recipient, baseUrl, options),
      text: `${personalizedGreeting(recipient.name)}\n\n${campaign.headline}\n\n${richTextToPlainText(campaign.body)}${options.textSuffix ? `\n\n${options.textSuffix}` : ""}${campaign.buttonUrl ? `\n\n${campaign.buttonLabel}: ${campaign.buttonUrl}` : ""}${unsubscribe ? `\n\nUnsubscribe: ${unsubscribe}` : ""}`,
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

export async function deliverCampaign(campaign: Campaign, recipients: Recipient[], baseUrl: string, key: string, options: DeliveryOptions = {}): Promise<DeliveryResult> {
  const failures: DeliveryFailure[] = [];
  let sent = 0;
  for (let index = 0; index < recipients.length; index += 8) {
    await Promise.all(recipients.slice(index, index + 8).map(async (recipient) => {
      try { await sendWithResend(campaign, recipient, baseUrl, key, options); sent += 1; }
      catch (reason) {
        const status = typeof reason === "object" && reason !== null && "status" in reason ? Number(reason.status) : 0;
        failures.push({ id: recipient.id, email: recipient.email, error: reason instanceof Error ? reason.message : "Unknown delivery error", retryable: status === 0 || status === 429 || status >= 500 });
      }
    }));
  }
  return { sent, failures };
}

type WelcomeItem = { eyebrow: string; title: string; description: string; url: string; image: string };

function absolutePublicUrl(value: string | undefined, baseUrl: string) {
  if (!value) return "";
  try {
    const url = new URL(value, `${safeSiteUrl(baseUrl)}/`);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

async function latestVideo(): Promise<Video | null> {
  try {
    const channels = await getChannels();
    const requests = channels.flatMap((channel, index) => channel ? [listVideos(channel, index + 1, "", 1)] : []);
    const results = await Promise.allSettled(requests);
    return results.flatMap((result) => result.status === "fulfilled" ? result.value.videos : [])
      .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))[0] ?? null;
  } catch {
    return null;
  }
}

async function latestWelcomeItems(baseUrl: string): Promise<WelcomeItem[]> {
  const [video, articleResult] = await Promise.all([
    latestVideo(),
    getCachedPublishedArticles().catch(() => null),
  ]);
  const articles = articleResult
    ? [...articleResult.articles].sort((left, right) => timestamp(right.publishedAt ?? right.createdAt) - timestamp(left.publishedAt ?? left.createdAt))
    : [];
  const article = articles.find((item) => item.majorCategoryId !== STUDY_MAJOR_ID);
  const study = articles.find((item) => item.majorCategoryId === STUDY_MAJOR_ID);
  return [
    video ? {
      eyebrow: "Latest video",
      title: video.title,
      description: "Watch the newest story from Gilead Medicare.",
      url: `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`,
      image: absolutePublicUrl(video.thumbnail, baseUrl),
    } : {
      eyebrow: "Latest video",
      title: "Watch the latest from Gilead Medicare",
      description: "Visit our video library for the newest story and update.",
      url: absolutePublicUrl("/videos", baseUrl),
      image: "",
    },
    article ? {
      eyebrow: "Latest article",
      title: article.title,
      description: article.excerpt || "Read the newest article from Gilead Medicare.",
      url: absolutePublicUrl(`/articles/${encodeURIComponent(article.slug)}`, baseUrl),
      image: absolutePublicUrl(article.featuredImage, baseUrl),
    } : {
      eyebrow: "Latest article",
      title: "Read our newest article",
      description: "Explore recent stories about faith, family, and farming.",
      url: absolutePublicUrl("/articles", baseUrl),
      image: "",
    },
    study ? {
      eyebrow: "From the study library",
      title: study.title,
      description: study.excerpt || "Explore the newest resource in the Gilead study library.",
      url: absolutePublicUrl(`/articles/${encodeURIComponent(study.slug)}`, baseUrl),
      image: absolutePublicUrl(study.featuredImage, baseUrl),
    } : {
      eyebrow: "From the study library",
      title: "Explore the Gilead study library",
      description: "Find the latest learning resource and downloadable material.",
      url: absolutePublicUrl("/study-materials", baseUrl),
      image: "",
    },
  ];
}

function welcomeItemsHtml(items: WelcomeItem[]) {
  if (!items.length) return "";
  return `<style>@media only screen and (max-width:600px){.email-outer{padding:0!important}.email-card{border-left:0!important;border-right:0!important;border-radius:0!important}.email-content{padding:18px 10px 24px!important}.welcome-section{margin-top:24px!important}.content-card{padding:0!important;margin-bottom:18px!important;border-radius:10px!important;overflow:hidden!important}.content-row,.content-thumb,.content-copy{display:block!important;width:100%!important}.content-thumb a{display:block!important;width:100%!important}.content-image{display:block!important;width:100%!important;height:auto!important;max-height:none!important;border-radius:0!important}.content-placeholder{display:block!important;width:100%!important;height:112px!important;border-radius:0!important;font-size:38px!important;line-height:112px!important}.content-copy{box-sizing:border-box!important;padding:18px 16px 20px!important}.content-label{font-size:12px!important}.content-title{font-size:23px!important;line-height:1.28!important}.content-description{font-size:16px!important;line-height:1.55!important}}</style><div class="welcome-section" style="margin:30px 0 4px"><p style="margin:0 0 14px;color:${brand.colors.primaryDark};font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase">Start exploring</p>${items.map((item) => {
    const thumbnail = item.image
      ? `<td class="content-thumb" style="display:block;width:100%!important"><a href="${escapeHtml(item.url)}" style="display:block;width:100%"><img class="content-image" src="${escapeHtml(item.image)}" alt="" width="640" style="display:block;width:100%!important;height:auto;max-height:360px;object-fit:cover;border:0;border-radius:10px 10px 0 0"></a></td>`
      : `<td class="content-thumb" style="display:block;width:100%!important"><a class="content-placeholder" href="${escapeHtml(item.url)}" style="display:block;width:100%!important;height:132px;border-radius:10px 10px 0 0;background:${brand.colors.primary};color:#fff;text-align:center;text-decoration:none;font:700 42px/132px Georgia,serif">R</a></td>`;
    return `<table role="presentation" class="content-card" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin:0 0 16px;padding:0!important;border:1px solid ${brand.colors.border};border-radius:12px;background:${brand.colors.surface};overflow:hidden"><tr class="content-row" style="display:block;width:100%">${thumbnail}</tr><tr class="content-row" style="display:block;width:100%"><td class="content-copy" style="display:block;width:100%;box-sizing:border-box;padding:20px 20px 22px;vertical-align:middle"><p class="content-label" style="margin:0 0 9px;color:${brand.colors.primaryDark};font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase">${escapeHtml(item.eyebrow)}</p><a class="content-title" href="${escapeHtml(item.url)}" style="display:block;color:${brand.colors.ink};font:700 24px/1.3 Georgia,serif;text-decoration:none">${escapeHtml(item.title)}</a><p class="content-description" style="margin:11px 0 0;color:${brand.colors.muted};font-size:16px;line-height:1.55">${escapeHtml(item.description.slice(0, 190))}</p></td></tr></table>`;
  }).join("")}</div>`;
}

function welcomeItemsText(items: WelcomeItem[]) {
  return items.map((item) => `${item.eyebrow}: ${item.title}\n${item.url}`).join("\n\n");
}

export async function sendNewsletterWelcome(recipient: Recipient, baseUrl: string, subscriptionCycleId = recipient.id) {
  const items = await latestWelcomeItems(baseUrl);
  return deliverCampaign({
    kind: "newsletter", subject: "Welcome to Gilead Medicare", letterTitle: "Welcome to Gilead",
    headline: "Wellness updates—delivered with care", preheader: "You’re now part of the Gilead Medicare community.",
    body: "<p>Thank you for joining us. You’ll receive health education, practical wellness ideas, and community-care updates.</p><p>Here are three places to begin: our newest video, latest article, and newest study-library resource.</p>",
    buttonLabel: "Visit Gilead Medicare", buttonUrl: safeSiteUrl(baseUrl), videoUrl: "",
  }, [recipient], baseUrl, `newsletter-welcome:${subscriptionCycleId}`, {
    contentAfterBody: welcomeItemsHtml(items),
    textSuffix: welcomeItemsText(items),
  });
}

export async function sendMeetingRequestWelcome(recipient: Recipient, baseUrl: string) {
  return deliverCampaign({
    kind: "meeting", subject: "We received your Gilead Medicare meeting request", letterTitle: "Meeting request received",
    headline: "Thank you for reaching out", preheader: "The Gilead Medicare team will follow up with your meeting details.",
    body: "<p>Your request is safely with our team. We’ll review it and send the online meeting link as soon as it is ready.</p><p>We look forward to connecting with you.</p>",
    buttonLabel: "Visit Gilead Medicare", buttonUrl: safeSiteUrl(baseUrl), videoUrl: "",
  }, [recipient], baseUrl, `meeting-request:${recipient.id}:${Date.now()}`);
}
