"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, History, Mail, Pause, Play, Plus, RefreshCw, Send, Trash2, Users } from "lucide-react";
import { api } from "@/lib/api";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { automaticPreviewText, inlineVideoLinks, sanitizeRichText } from "@/lib/rich-text";

type MailKind = "newsletter" | "meeting";
type AudienceMode = "all" | "selected" | "new";
type Recipient = { id: string; email: string; name?: string; status: string; createdAt?: unknown };
type Schedule = Campaign & { id: string; repeat: string; startsAt: string; endsAt?: string; timeZone?: string; status?: string; active?: boolean; nextSendAt?: unknown; lastError?: string };
type HistoryItem = { id: string; kind: MailKind; subject: string; headline?: string; sent?: number; failed?: number; sentAt?: unknown; campaign?: Campaign; parentHistoryId?: string; deliveryNumber?: number; audienceMode?: AudienceMode };
type Campaign = { kind: MailKind; subject: string; letterTitle: string; headline: string; preheader: string; body: string; buttonLabel: string; buttonUrl: string; videoUrl: string };
type MailingData = {
  members: Recipient[]; subscribers: Recipient[]; schedules: Schedule[]; history: HistoryItem[];
  counts: { verified: number; pending: number; active: number; paused: number; unsubscribed: number; totalMembers: number; totalSubscribers: number; emailsSent: number };
};

const emptyData: MailingData = { members: [], subscribers: [], schedules: [], history: [], counts: { verified: 0, pending: 0, active: 0, paused: 0, unsubscribed: 0, totalMembers: 0, totalSubscribers: 0, emailsSent: 0 } };
const initialCampaign: Campaign = {
  kind: "newsletter",
  subject: "A new letter from Remsam Homestead",
  letterTitle: "From the homestead",
  headline: "Faith, family, and farming",
  preheader: "A thoughtful update from Remsam Homestead.",
  body: "<p>Share the latest story, resource, or update from Remsam Homestead here.</p>",
  buttonLabel: "Visit Remsam Homestead",
  buttonUrl: "https://remsamhomestead.com",
  videoUrl: "",
};

const INBOX_PREVIEW_MAX_LENGTH = 90;

function generateInboxPreview(campaign: Campaign) {
  return automaticPreviewText(campaign.body, INBOX_PREVIEW_MAX_LENGTH)
    || automaticPreviewText(campaign.headline, INBOX_PREVIEW_MAX_LENGTH)
    || automaticPreviewText(campaign.subject, INBOX_PREVIEW_MAX_LENGTH);
}

const PAGE_SIZE = 10;

function timestampMillis(value: unknown): number {
  if (typeof value === "string") return new Date(value).getTime();
  if (typeof value === "object" && value !== null) {
    if ("_seconds" in value) return Number(value._seconds) * 1000 + ("_nanoseconds" in value ? Number(value._nanoseconds) / 1e6 : 0);
    if ("seconds" in value) return Number(value.seconds) * 1000 + ("nanoseconds" in value ? Number(value.nanoseconds) / 1e6 : 0);
  }
  return NaN;
}

function dateLabel(value: unknown) {
  if (!value) return "—";
  let date: Date;
  if (typeof value === "string") date = new Date(value);
  else if (typeof value === "object" && value !== null && "_seconds" in value) date = new Date(Number(value._seconds) * 1000);
  else if (typeof value === "object" && value !== null && "seconds" in value) date = new Date(Number(value.seconds) * 1000);
  else return "—";
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
}

export default function MailingManager() {
  const [data, setData] = useState(emptyData);
  const [campaign, setCampaign] = useState(initialCampaign);
  const [inboxPreviewIsAutomatic, setInboxPreviewIsAutomatic] = useState(true);
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [audienceSince, setAudienceSince] = useState("");
  const [repeat, setRepeat] = useState("once");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [sourceHistory, setSourceHistory] = useState<HistoryItem | null>(null);
  const [subscriberPage, setSubscriberPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const recipients = campaign.kind === "newsletter" ? data.subscribers.filter((item) => item.status === "active") : data.members.filter((item) => item.status === "verified");
  const sinceMillis = sourceHistory ? timestampMillis(sourceHistory.sentAt) : (audienceSince ? new Date(audienceSince).getTime() : NaN);
  const expectedCount = useMemo(() => recipients.filter((item) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) return false;
    if (audienceMode === "selected") return selectedIds.includes(item.id);
    if (audienceMode === "new") return Number.isFinite(sinceMillis) && timestampMillis(item.createdAt) > sinceMillis;
    return true;
  }).length, [audienceMode, recipients, selectedIds, sinceMillis]);
  const subscriberCurrentPage = Math.min(subscriberPage, Math.max(1, Math.ceil(data.subscribers.length / PAGE_SIZE)));
  const historyCurrentPage = Math.min(historyPage, Math.max(1, Math.ceil(data.history.length / PAGE_SIZE)));

  function editHistory(item: HistoryItem) {
    if (!item.campaign) return;
    setCampaign({ ...initialCampaign, ...item.campaign, kind: item.kind });
    setInboxPreviewIsAutomatic(false);
    setSourceHistory(item);
    setAudienceMode("all");
    setSelectedIds([]);
    setAudienceSince("");
    setStartsAt(""); setEndsAt(""); setRepeat("once");
    setNotice("Email loaded into the composer. Edit it, choose recipients, then send or schedule it.");
    document.getElementById("compose-campaign")?.scrollIntoView({ behavior: "smooth" });
  }

  async function load() {
    setLoading(true); setError("");
    try { setData(await api.get<MailingData>("/api/mailing")); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load the mailing workspace."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);
  useEffect(() => { setSelectedIds([]); }, [campaign.kind]);

  function update<K extends keyof Campaign>(key: K, value: Campaign[K]) {
    setCampaign((current) => {
      const next = { ...current, [key]: value };
      return inboxPreviewIsAutomatic && key !== "preheader"
        ? { ...next, preheader: generateInboxPreview(next) }
        : next;
    });
  }

  function editInboxPreview(value: string) {
    setInboxPreviewIsAutomatic(false);
    update("preheader", value);
  }

  function regenerateInboxPreview() {
    setInboxPreviewIsAutomatic(true);
    setCampaign((current) => ({ ...current, preheader: generateInboxPreview(current) }));
  }

  async function submit(action: "send" | "schedule") {
    const confirmation = action === "send" ? window.confirm(`Send this email to ${expectedCount} recipient${expectedCount === 1 ? "" : "s"} now?`) : true;
    if (!confirmation) return;
    setWorking(true); setError(""); setNotice("");
    try {
      const result = await api.post<{ sent?: number; failed?: number; id?: string }>("/api/mailing", {
        ...campaign, action, audienceMode, recipientIds: selectedIds, ...(sourceHistory ? { historyId: sourceHistory.id } : {}),
        audienceSince: audienceMode === "new" && audienceSince ? new Date(audienceSince).toISOString() : "",
        repeat, startsAt: startsAt ? new Date(startsAt).toISOString() : "", endsAt: endsAt ? new Date(endsAt).toISOString() : "",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setNotice(action === "send" ? `Sent ${result.sent ?? 0} email${result.sent === 1 ? "" : "s"}${result.failed ? `; ${result.failed} failed` : ""}.` : "Campaign scheduled successfully.");
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The email operation failed."); }
    finally { setWorking(false); }
  }

  async function addMember(event: React.FormEvent) {
    event.preventDefault(); setWorking(true); setError("");
    try {
      await api.post("/api/mailing", { action: "add-member", email: memberEmail, name: memberName });
      setMemberEmail(""); setMemberName(""); setNotice("Meeting-list member added and verified."); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add the member."); }
    finally { setWorking(false); }
  }

  async function updateRecord(payload: Record<string, string>, successMessage = "Mailing record updated.") {
    setWorking(true); setError("");
    try { await api.patch("/api/mailing", payload); setNotice(successMessage); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update the record."); }
    finally { setWorking(false); }
  }


  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[.18em] text-brand-dark">Remsam Homestead</p><h1 className="mt-1 text-3xl font-bold text-brand-ink md:text-4xl">Email studio</h1><p className="mt-2 max-w-2xl text-brand-muted">Write, schedule, and review every community email from one calm workspace.</p></div>
        <button onClick={() => void load()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 font-semibold text-brand-dark hover:bg-brand-soft disabled:opacity-60"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </header>

      {(error || notice) && <p role={error ? "alert" : "status"} className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-brand-border bg-brand-soft text-brand-dark"}`}>{error || notice}</p>}

      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat href="#newsletter-subscribers" icon={Users} label="Newsletter readers" value={data.counts.active} detail={`${data.counts.totalSubscribers} total subscribers`} />
        <Stat href="#meeting-members" icon={CheckCircle2} label="Meeting members" value={data.counts.verified} detail={`${data.counts.pending} awaiting review`} />
        <Stat href="#scheduled-campaigns" icon={CalendarClock} label="Active schedules" value={data.schedules.filter((item) => item.active).length} detail={`${data.schedules.length} total`} />
        <Stat href="#delivery-history" icon={Send} label="Emails delivered" value={data.counts.emailsSent} detail="Recorded deliveries" />
      </section>

      <div className="mt-8 space-y-6">
        <section id="compose-campaign" className="scroll-mt-6">
          <div><h2 className="text-xl font-bold text-brand-ink">Compose a campaign</h2><p className="mt-1 text-sm text-brand-muted">Email styling is applied automatically. Pasted YouTube links become thumbnail previews.</p></div>
          {sourceHistory && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border bg-brand-soft px-4 py-3 text-sm text-brand-dark"><span>Editing a follow-up to <strong>{sourceHistory.subject}</strong>, sent {dateLabel(sourceHistory.sentAt)}. The original record remains in history.</span><button type="button" onClick={() => { setSourceHistory(null); setCampaign(initialCampaign); setAudienceMode("all"); }} className="font-bold underline">Start a new email</button></div>}
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mailing list"><select value={campaign.kind} onChange={(event) => update("kind", event.target.value as MailKind)} disabled={!!sourceHistory} className="input-field mt-1.5"><option value="newsletter">Remsam newsletter</option><option value="meeting">Online meeting members</option></select></Field>
              <Field label="Subject"><input required maxLength={180} value={campaign.subject} onChange={(event) => update("subject", event.target.value)} className="input-field mt-1.5" /></Field>
              <Field label="Email label"><input required maxLength={140} value={campaign.letterTitle} onChange={(event) => update("letterTitle", event.target.value)} className="input-field mt-1.5" /></Field>
              <Field label="Headline"><input required maxLength={180} value={campaign.headline} onChange={(event) => update("headline", event.target.value)} className="input-field mt-1.5" /></Field>
              <Field label="Inbox preview" wide>
                <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                  <input maxLength={INBOX_PREVIEW_MAX_LENGTH} value={campaign.preheader} onChange={(event) => editInboxPreview(event.target.value)} className="input-field" placeholder="A short preview shown beside the subject" aria-describedby="inbox-preview-help" />
                  <button type="button" onClick={regenerateInboxPreview} className="shrink-0 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-bold text-brand-dark transition hover:border-brand hover:bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand">Generate preview</button>
                </div>
                <span id="inbox-preview-help" className="mt-1.5 flex justify-between gap-3 text-xs font-normal text-brand-muted"><span>{inboxPreviewIsAutomatic ? "Updates automatically from your message. Edit it anytime." : "Custom preview. Select Generate preview to refresh it from the message."}</span><span aria-label={`${campaign.preheader.length} of ${INBOX_PREVIEW_MAX_LENGTH} characters`}>{campaign.preheader.length}/{INBOX_PREVIEW_MAX_LENGTH}</span></span>
              </Field>
            </div>
            <div><RichTextEditor label="Message" placeholder="Write the Remsam Homestead message…" value={campaign.body} maxTextLength={12000} allowImages onChange={(value) => update("body", value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Button label"><input value={campaign.buttonLabel} onChange={(event) => update("buttonLabel", event.target.value)} className="input-field mt-1.5" /></Field><Field label={campaign.kind === "meeting" ? "Meeting link" : "Button link"}><input required={campaign.kind === "meeting"} type="url" value={campaign.buttonUrl} onChange={(event) => update("buttonUrl", event.target.value)} className="input-field mt-1.5" placeholder="https://" /></Field></div>
          </div>
        </section>

        <aside className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm md:p-6"><h2 className="font-bold text-brand-ink">Recipients</h2><div className="mt-4 space-y-3">{(["all", "selected", "new"] as AudienceMode[]).map((mode) => <label key={mode} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${audienceMode === mode ? "border-brand bg-brand-soft" : "border-brand-border"}`}><input type="radio" name="audience" value={mode} checked={audienceMode === mode} onChange={() => setAudienceMode(mode)} className="accent-brand" /><span><b className="block capitalize text-brand-ink">{mode === "all" ? "All eligible" : mode}</b><span className="text-xs text-brand-muted">{mode === "all" ? `${recipients.length} available recipients` : mode === "selected" ? "Choose individual people below" : "People added after a date"}</span></span></label>)}</div>
            {audienceMode === "new" && (sourceHistory ? <p className="mt-4 text-sm text-brand-muted">Recipients who joined after {dateLabel(sourceHistory.sentAt)}.</p> : <label className="mt-4 block text-sm text-brand-muted">Joined after<input type="datetime-local" value={audienceSince} onChange={(event) => setAudienceSince(event.target.value)} className="input-field mt-1.5" /></label>)}
            {audienceMode === "selected" && <div className="mt-4 max-h-52 space-y-1 overflow-auto rounded-xl border border-brand-border p-2">{recipients.map((person) => <label key={person.id} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-brand-soft"><input type="checkbox" checked={selectedIds.includes(person.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, person.id] : current.filter((id) => id !== person.id))} className="accent-brand" /><span className="min-w-0"><b className="block truncate">{person.name || person.email}</b>{person.name && <span className="block truncate text-xs text-brand-muted">{person.email}</span>}</span></label>)}</div>}
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm md:p-6"><h2 className="font-bold text-brand-ink">Delivery</h2><label className="mt-4 block text-sm font-semibold text-gray-700">First send<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="input-field mt-1.5" /></label><label className="mt-3 block text-sm font-semibold text-gray-700">Repeat<select value={repeat} onChange={(event) => setRepeat(event.target.value)} className="input-field mt-1.5"><option value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>{repeat !== "once" && <label className="mt-3 block text-sm font-semibold text-gray-700">End repeating<input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="input-field mt-1.5" /></label>}
            <button type="button" onClick={() => void submit("send")} disabled={working || expectedCount === 0} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-50"><Send size={17} /> Send now to {expectedCount}</button>
            <button type="button" onClick={() => void submit("schedule")} disabled={working || (expectedCount === 0 && audienceMode !== "new") || (audienceMode === "new" && !Number.isFinite(sinceMillis)) || !startsAt} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-brand px-4 py-3 font-bold text-brand-dark hover:bg-brand-soft disabled:opacity-50"><Clock3 size={17} /> Schedule email</button>
          </section>
        </aside>
      </div>

      <EmailPreview campaign={campaign} />

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <Panel title="Scheduled campaigns" icon={CalendarClock}>{data.schedules.length ? data.schedules.map((item) => <Row key={item.id} title={item.subject} detail={`${item.repeat} · next ${dateLabel(item.nextSendAt)}`} badge={item.status || (item.active ? "scheduled" : "inactive")} action={item.active ? <button disabled={working} onClick={() => void updateRecord({ collection: "schedules", id: item.id, status: "cancelled" })} className="text-sm font-semibold text-red-600 hover:underline">Cancel</button> : undefined} />) : <Empty text="No campaigns are scheduled." />}</Panel>
        <Panel title="Delivery history" icon={History}>{data.history.length ? <>
          {data.history.slice((historyCurrentPage - 1) * PAGE_SIZE, historyCurrentPage * PAGE_SIZE).map((item, index) => <div key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <span className="text-sm font-semibold text-brand-muted">{(historyCurrentPage - 1) * PAGE_SIZE + index + 1}.</span>
            <div className="min-w-0 flex-1"><p className="break-words font-semibold text-brand-ink">{item.subject}</p><p className="mt-1 text-xs text-brand-muted">{dateLabel(item.sentAt)} | {item.sent ?? 0} sent | {item.failed ?? 0} failed | {item.kind}{item.parentHistoryId ? ` | Send ${item.deliveryNumber || 2}` : ""}{item.audienceMode ? ` | ${item.audienceMode} recipients` : ""}</p></div>
            <button type="button" disabled={!item.campaign || working} onClick={() => editHistory(item)} title={!item.campaign ? "Message content is unavailable for this older record" : undefined} className="rounded-lg border border-brand-border px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50">Edit & resend</button>
            <button disabled={working} onClick={() => { if (window.confirm("Delete this history record? Delivery totals will remain unchanged.")) void updateRecord({ collection: "history", id: item.id, status: "delete" }); }} aria-label={`Delete ${item.subject}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
          </div>)}
          <Pagination label="History" page={historyCurrentPage} total={data.history.length} onPage={setHistoryPage} />
        </> : <Empty text="Sent campaigns will appear here." />}</Panel>
      </section>

      <section id="newsletter-subscribers" className="mt-8 scroll-mt-6 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-border p-5 md:p-6">
          <div><h2 className="text-xl font-bold text-brand-ink">Newsletter subscribers</h2><p className="mt-1 text-sm text-brand-muted">Review everyone who has subscribed, including paused and unsubscribed readers.</p></div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
            <SubscriberCount label="Total" value={data.counts.totalSubscribers} />
            <SubscriberCount label="Active" value={data.counts.active} />
            <SubscriberCount label="Paused" value={data.counts.paused} />
            <SubscriberCount label="Unsubscribed" value={data.counts.unsubscribed} />
          </div>
        </div>
        <div className="divide-y divide-brand-border">
          {data.subscribers.slice((subscriberCurrentPage - 1) * PAGE_SIZE, subscriberCurrentPage * PAGE_SIZE).map((subscriber, index) => <div key={subscriber.id} className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-6">
            <span className="text-sm font-semibold text-brand-muted">{(subscriberCurrentPage - 1) * PAGE_SIZE + index + 1}.</span>
            <div className="min-w-0 flex-[1_1_220px]"><p className="truncate font-semibold text-brand-ink">{subscriber.name || "Newsletter reader"}</p><p className="truncate text-sm text-brand-muted">{subscriber.email}</p><p className="mt-1 text-xs text-brand-muted">Joined {dateLabel(subscriber.createdAt)}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${subscriber.status === "active" ? "bg-brand-soft text-brand-dark" : subscriber.status === "paused" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{subscriber.status}</span>
            {subscriber.status === "active" ? <button disabled={working} onClick={() => void updateRecord({ collection: "subscribers", id: subscriber.id, status: "paused" }, `${subscriber.email} is paused.`)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"><Pause size={15} /> Pause</button> : subscriber.status === "paused" ? <button disabled={working} onClick={() => void updateRecord({ collection: "subscribers", id: subscriber.id, status: "active" }, `${subscriber.email} is active again.`)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-soft disabled:opacity-50"><Play size={15} /> Resume</button> : null}
            <button disabled={working} onClick={() => { if (window.confirm(`Permanently delete ${subscriber.email} from the subscriber list? They can subscribe again later.`)) void updateRecord({ collection: "subscribers", id: subscriber.id, status: "delete" }, `${subscriber.email} was deleted.`); }} aria-label={`Delete ${subscriber.email}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} /></button>
          </div>)}
          {!data.subscribers.length && <Empty text="No newsletter subscribers yet." />}
          {data.subscribers.length > 0 && <Pagination label="Subscribers" page={subscriberCurrentPage} total={data.subscribers.length} onPage={setSubscriberPage} />}
          <span id="meeting-members" className="scroll-mt-6" aria-hidden="true" />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border p-5 md:p-6"><div><h2 className="text-xl font-bold text-brand-ink">Online meeting list</h2><p className="text-sm text-brand-muted">Verify requests or add a trusted member directly.</p></div><form onSubmit={addMember} className="flex flex-wrap gap-2"><input value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="First name" className="input-field w-auto min-w-36" /><input required type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="Email address" className="input-field w-auto min-w-56" /><button disabled={working} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white"><Plus size={17} /> Add</button></form></div><div className="divide-y divide-brand-border">{data.members.map((member) => <div key={member.id} className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-6"><div className="min-w-0 flex-1"><p className="truncate font-semibold text-brand-ink">{member.name || "Unnamed member"}</p><p className="truncate text-sm text-brand-muted">{member.email}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${member.status === "verified" ? "bg-brand-soft text-brand-dark" : "bg-amber-50 text-amber-700"}`}>{member.status}</span>{member.status === "pending" && <button disabled={working} onClick={() => void updateRecord({ collection: "members", id: member.id, status: "verified" })} className="text-sm font-semibold text-brand-dark hover:underline">Verify</button>}<button disabled={working} onClick={() => void updateRecord({ collection: "members", id: member.id, status: "delete" })} aria-label={`Delete ${member.email}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div>)}{!data.members.length && <Empty text="No meeting members yet." />}</div></section>
    </main>
  );
}

function EmailPreview({ campaign }: { campaign: Campaign }) {
  const body = inlineVideoLinks(sanitizeRichText(campaign.body));
  const safeButtonUrl = campaign.buttonUrl.startsWith("https://") ? campaign.buttonUrl : "";
  return <section className="mt-8" aria-labelledby="email-preview-heading">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 id="email-preview-heading" className="text-xl font-bold text-brand-ink">Email preview</h2><p className="text-sm text-brand-muted">A live approximation of what readers will receive.</p></div><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-dark">{campaign.subject || "No subject"}</span></div>
    <div className="max-h-[75vh] overflow-y-auto rounded-2xl border border-brand-border bg-[#f8faf9] p-2 shadow-inner sm:p-5">
      <article className="mx-auto max-w-[720px] overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
        <header className="bg-brand-deep px-5 py-7 text-center text-white sm:px-8"><img src="/assets/logo-white.png" alt="Remsam Homestead" className="mx-auto mb-3 h-[72px] w-[72px] object-contain" /><p className="text-xs font-extrabold tracking-[.22em] text-amber-300">REMSAM HOMESTEAD</p><div className="mx-auto my-3 h-px w-16 bg-amber-400" /><p className="text-base italic">{campaign.letterTitle || "From the homestead"}</p></header>
        <div className="px-5 py-7 sm:px-9"><div className="mb-5 h-1 w-11 bg-amber-500" /><p className="mb-4 text-base text-brand-ink">Hello,</p><h3 className="mb-6 font-serif text-3xl font-bold leading-tight text-brand-ink">{campaign.headline || "Your email headline"}</h3><div className="prose prose-emerald max-w-none text-brand-ink [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl" dangerouslySetInnerHTML={{ __html: body }} />{safeButtonUrl && campaign.buttonLabel && <a href={safeButtonUrl} target="_blank" rel="noreferrer" className="mt-7 inline-block rounded-xl bg-brand px-6 py-3 font-bold text-white no-underline">{campaign.buttonLabel}</a>}</div>
        <footer className="border-t border-brand-border bg-brand-soft px-5 py-6 text-center text-xs leading-6 text-brand-muted"><strong className="tracking-widest text-brand-dark">REMSAM HOMESTEAD</strong><br />Faith, Family, Farming<br />About Us · Contact Us · Study Library{campaign.kind === "newsletter" ? " · Unsubscribe" : ""}</footer>
      </article>
    </div>
  </section>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`block text-sm font-semibold text-gray-700 ${wide ? "sm:col-span-2" : ""}`}>{label}{children}</label>; }
function Stat({ href, icon: Icon, label, value, detail }: { href: string; icon: typeof Mail; label: string; value: number; detail: string }) { return <a href={href} className="group rounded-2xl border border-brand-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand sm:p-5"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-medium text-brand-muted sm:text-sm">{label}</p><p className="mt-1 text-2xl font-bold text-brand-ink sm:text-3xl">{value.toLocaleString()}</p></div><span className="rounded-xl bg-brand-soft p-2 text-brand-dark transition group-hover:bg-brand group-hover:text-white sm:p-2.5"><Icon size={20} /></span></div><p className="mt-3 text-xs text-brand-muted">{detail}</p></a>; }
function SubscriberCount({ label, value }: { label: string; value: number }) { return <div className="min-w-20 rounded-xl bg-brand-soft px-3 py-2"><strong className="block text-base text-brand-ink">{value.toLocaleString()}</strong><span className="text-brand-muted">{label}</span></div>; }
function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Mail; children: React.ReactNode }) { const id = title === "Scheduled campaigns" ? "scheduled-campaigns" : title === "Delivery history" ? "delivery-history" : undefined; return <section id={id} className="scroll-mt-6 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm"><div className="flex items-center gap-2 border-b border-brand-border px-5 py-4"><Icon size={19} className="text-brand-dark" /><h2 className="font-bold text-brand-ink">{title}</h2></div><div className="divide-y divide-brand-border">{children}</div></section>; }
function Row({ title, detail, badge, action }: { title: string; detail: string; badge: string; action?: React.ReactNode }) { return <div className="flex items-center gap-3 px-5 py-4"><div className="min-w-0 flex-1"><p className="truncate font-semibold text-brand-ink">{title}</p><p className="mt-1 truncate text-xs text-brand-muted">{detail}</p></div><span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold capitalize text-brand-dark">{badge}</span>{action}</div>; }
function Empty({ text }: { text: string }) { return <p className="p-6 text-sm text-brand-muted">{text}</p>; }

function Pagination({ label, page, total, onPage }: { label: string; page: number; total: number; onPage: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <nav aria-label={`${label} pages`} className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-5 py-4 text-sm text-brand-muted">
    <span>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}</span>
    <div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-lg border border-brand-border bg-white px-3 py-2 font-semibold text-brand-dark disabled:opacity-40">Previous</button><span className="sr-only" aria-live="polite">Page {page} of {pages}</span>{Array.from({ length: Math.min(5, pages) }, (_, index) => Math.max(1, Math.min(page - 2, pages - 4)) + index).map((number) => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === page ? "page" : undefined} onClick={() => onPage(number)} className={`hidden rounded-lg px-3 py-2 font-semibold sm:inline-flex ${number === page ? "bg-brand text-white" : "border border-brand-border bg-white text-brand-dark hover:bg-brand-soft"}`}>{number}</button>)}<span className="sm:hidden">{page} / {pages}</span><button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded-lg border border-brand-border bg-white px-3 py-2 font-semibold text-brand-dark disabled:opacity-40">Next</button></div>
  </nav>;
}
