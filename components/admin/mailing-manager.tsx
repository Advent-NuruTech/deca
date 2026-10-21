"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, History, Mail, Pause, Play, Plus, RefreshCw, Send, Trash2, Users } from "lucide-react";
import { api } from "@/lib/api";
import RichTextEditor from "@/components/admin/rich-text-editor";

type MailKind = "newsletter" | "meeting";
type AudienceMode = "all" | "selected" | "new";
type Recipient = { id: string; email: string; name?: string; status: string; createdAt?: unknown };
type Schedule = Campaign & { id: string; repeat: string; startsAt: string; endsAt?: string; timeZone?: string; status?: string; active?: boolean; nextSendAt?: unknown; lastError?: string };
type HistoryItem = { id: string; kind: MailKind; subject: string; headline?: string; sent?: number; failed?: number; sentAt?: unknown };
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

  const recipients = campaign.kind === "newsletter" ? data.subscribers.filter((item) => item.status === "active") : data.members.filter((item) => item.status === "verified");
  const expectedCount = useMemo(() => audienceMode === "selected" ? selectedIds.length : recipients.length, [audienceMode, recipients.length, selectedIds.length]);

  async function load() {
    setLoading(true); setError("");
    try { setData(await api.get<MailingData>("/api/mailing")); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load the mailing workspace."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);
  useEffect(() => { setSelectedIds([]); }, [campaign.kind]);

  function update<K extends keyof Campaign>(key: K, value: Campaign[K]) { setCampaign((current) => ({ ...current, [key]: value })); }

  async function submit(action: "send" | "schedule") {
    const confirmation = action === "send" ? window.confirm(`Send this email to ${expectedCount} recipient${expectedCount === 1 ? "" : "s"} now?`) : true;
    if (!confirmation) return;
    setWorking(true); setError(""); setNotice("");
    try {
      const result = await api.post<{ sent?: number; failed?: number; id?: string }>("/api/mailing", {
        ...campaign, action, audienceMode, recipientIds: selectedIds,
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

  async function uploadImage(file: File) {
    const form = new FormData(); form.set("image", file);
    return (await api.upload<{ imageUrl: string }>("/api/mailing/image", form)).imageUrl;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[.18em] text-brand-dark">Remsam Homestead</p><h1 className="mt-1 text-3xl font-bold text-brand-ink md:text-4xl">Email studio</h1><p className="mt-2 max-w-2xl text-brand-muted">Write, schedule, and review every community email from one calm workspace.</p></div>
        <button onClick={() => void load()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 font-semibold text-brand-dark hover:bg-brand-soft disabled:opacity-60"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </header>

      {(error || notice) && <p role={error ? "alert" : "status"} className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${error ? "border-red-200 bg-red-50 text-red-700" : "border-brand-border bg-brand-soft text-brand-dark"}`}>{error || notice}</p>}

      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Users} label="Newsletter readers" value={data.counts.active} detail={`${data.counts.totalSubscribers} total subscribers`} />
        <Stat icon={CheckCircle2} label="Meeting members" value={data.counts.verified} detail={`${data.counts.pending} awaiting review`} />
        <Stat icon={CalendarClock} label="Active schedules" value={data.schedules.filter((item) => item.active).length} detail={`${data.schedules.length} total`} />
        <Stat icon={Send} label="Emails delivered" value={data.counts.emailsSent} detail="Recorded deliveries" />
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
        <section className="rounded-2xl border border-brand-border bg-white shadow-sm">
          <div className="border-b border-brand-border p-5 md:p-7"><h2 className="text-xl font-bold text-brand-ink">Compose a campaign</h2><p className="mt-1 text-sm text-brand-muted">Email styling and Remsam branding are applied automatically.</p></div>
          <div className="space-y-5 p-5 md:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mailing list"><select value={campaign.kind} onChange={(event) => update("kind", event.target.value as MailKind)} className="input-field mt-1.5"><option value="newsletter">Remsam newsletter</option><option value="meeting">Online meeting members</option></select></Field>
              <Field label="Subject"><input required maxLength={180} value={campaign.subject} onChange={(event) => update("subject", event.target.value)} className="input-field mt-1.5" /></Field>
              <Field label="Email label"><input required maxLength={140} value={campaign.letterTitle} onChange={(event) => update("letterTitle", event.target.value)} className="input-field mt-1.5" /></Field>
              <Field label="Headline"><input required maxLength={180} value={campaign.headline} onChange={(event) => update("headline", event.target.value)} className="input-field mt-1.5" /></Field>
              <Field label="Inbox preview" wide><input maxLength={180} value={campaign.preheader} onChange={(event) => update("preheader", event.target.value)} className="input-field mt-1.5" placeholder="A short preview shown beside the subject" /></Field>
            </div>
            <div><RichTextEditor label="Message" placeholder="Write the Remsam Homestead message…" value={campaign.body} maxTextLength={12000} allowImages onUploadImage={uploadImage} onChange={(value) => update("body", value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Button label"><input value={campaign.buttonLabel} onChange={(event) => update("buttonLabel", event.target.value)} className="input-field mt-1.5" /></Field><Field label={campaign.kind === "meeting" ? "Meeting link" : "Button link"}><input required={campaign.kind === "meeting"} type="url" value={campaign.buttonUrl} onChange={(event) => update("buttonUrl", event.target.value)} className="input-field mt-1.5" placeholder="https://" /></Field></div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm md:p-6"><h2 className="font-bold text-brand-ink">Recipients</h2><div className="mt-4 space-y-3">{(["all", "selected", "new"] as AudienceMode[]).map((mode) => <label key={mode} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${audienceMode === mode ? "border-brand bg-brand-soft" : "border-brand-border"}`}><input type="radio" name="audience" value={mode} checked={audienceMode === mode} onChange={() => setAudienceMode(mode)} className="accent-brand" /><span><b className="block capitalize text-brand-ink">{mode === "all" ? "All eligible" : mode}</b><span className="text-xs text-brand-muted">{mode === "all" ? `${recipients.length} available recipients` : mode === "selected" ? "Choose individual people below" : "People added after a date"}</span></span></label>)}</div>
            {audienceMode === "new" && <input type="datetime-local" value={audienceSince} onChange={(event) => setAudienceSince(event.target.value)} className="input-field mt-4" />}
            {audienceMode === "selected" && <div className="mt-4 max-h-52 space-y-1 overflow-auto rounded-xl border border-brand-border p-2">{recipients.map((person) => <label key={person.id} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-brand-soft"><input type="checkbox" checked={selectedIds.includes(person.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, person.id] : current.filter((id) => id !== person.id))} className="accent-brand" /><span className="min-w-0"><b className="block truncate">{person.name || person.email}</b>{person.name && <span className="block truncate text-xs text-brand-muted">{person.email}</span>}</span></label>)}</div>}
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm md:p-6"><h2 className="font-bold text-brand-ink">Delivery</h2><label className="mt-4 block text-sm font-semibold text-gray-700">First send<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="input-field mt-1.5" /></label><label className="mt-3 block text-sm font-semibold text-gray-700">Repeat<select value={repeat} onChange={(event) => setRepeat(event.target.value)} className="input-field mt-1.5"><option value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>{repeat !== "once" && <label className="mt-3 block text-sm font-semibold text-gray-700">End repeating<input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="input-field mt-1.5" /></label>}
            <button type="button" onClick={() => void submit("send")} disabled={working || expectedCount === 0} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-50"><Send size={17} /> Send now to {expectedCount}</button>
            <button type="button" onClick={() => void submit("schedule")} disabled={working || expectedCount === 0 || !startsAt} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-brand px-4 py-3 font-bold text-brand-dark hover:bg-brand-soft disabled:opacity-50"><Clock3 size={17} /> Schedule email</button>
          </section>
        </aside>
      </div>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <Panel title="Scheduled campaigns" icon={CalendarClock}>{data.schedules.length ? data.schedules.map((item) => <Row key={item.id} title={item.subject} detail={`${item.repeat} · next ${dateLabel(item.nextSendAt)}`} badge={item.status || (item.active ? "scheduled" : "inactive")} action={item.active ? <button disabled={working} onClick={() => void updateRecord({ collection: "schedules", id: item.id, status: "cancelled" })} className="text-sm font-semibold text-red-600 hover:underline">Cancel</button> : undefined} />) : <Empty text="No campaigns are scheduled." />}</Panel>
        <Panel title="Delivery history" icon={History}>{data.history.length ? data.history.map((item) => <Row key={item.id} title={item.subject} detail={`${dateLabel(item.sentAt)} · ${item.sent ?? 0} sent${item.failed ? ` · ${item.failed} failed` : ""}`} badge={item.kind} action={<button disabled={working} onClick={() => void updateRecord({ collection: "history", id: item.id, status: "delete" })} aria-label={`Delete ${item.subject}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>} />) : <Empty text="Sent campaigns will appear here." />}</Panel>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
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
          {data.subscribers.map((subscriber) => <div key={subscriber.id} className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-6">
            <div className="min-w-0 flex-[1_1_220px]"><p className="truncate font-semibold text-brand-ink">{subscriber.name || "Newsletter reader"}</p><p className="truncate text-sm text-brand-muted">{subscriber.email}</p><p className="mt-1 text-xs text-brand-muted">Joined {dateLabel(subscriber.createdAt)}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${subscriber.status === "active" ? "bg-brand-soft text-brand-dark" : subscriber.status === "paused" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{subscriber.status}</span>
            {subscriber.status === "active" ? <button disabled={working} onClick={() => void updateRecord({ collection: "subscribers", id: subscriber.id, status: "paused" }, `${subscriber.email} is paused.`)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"><Pause size={15} /> Pause</button> : subscriber.status === "paused" ? <button disabled={working} onClick={() => void updateRecord({ collection: "subscribers", id: subscriber.id, status: "active" }, `${subscriber.email} is active again.`)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-soft disabled:opacity-50"><Play size={15} /> Resume</button> : null}
            <button disabled={working} onClick={() => { if (window.confirm(`Permanently delete ${subscriber.email} from the subscriber list? They can subscribe again later.`)) void updateRecord({ collection: "subscribers", id: subscriber.id, status: "delete" }, `${subscriber.email} was deleted.`); }} aria-label={`Delete ${subscriber.email}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} /></button>
          </div>)}
          {!data.subscribers.length && <Empty text="No newsletter subscribers yet." />}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border p-5 md:p-6"><div><h2 className="text-xl font-bold text-brand-ink">Online meeting list</h2><p className="text-sm text-brand-muted">Verify requests or add a trusted member directly.</p></div><form onSubmit={addMember} className="flex flex-wrap gap-2"><input value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="First name" className="input-field w-auto min-w-36" /><input required type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="Email address" className="input-field w-auto min-w-56" /><button disabled={working} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white"><Plus size={17} /> Add</button></form></div><div className="divide-y divide-brand-border">{data.members.map((member) => <div key={member.id} className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-6"><div className="min-w-0 flex-1"><p className="truncate font-semibold text-brand-ink">{member.name || "Unnamed member"}</p><p className="truncate text-sm text-brand-muted">{member.email}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${member.status === "verified" ? "bg-brand-soft text-brand-dark" : "bg-amber-50 text-amber-700"}`}>{member.status}</span>{member.status === "pending" && <button disabled={working} onClick={() => void updateRecord({ collection: "members", id: member.id, status: "verified" })} className="text-sm font-semibold text-brand-dark hover:underline">Verify</button>}<button disabled={working} onClick={() => void updateRecord({ collection: "members", id: member.id, status: "delete" })} aria-label={`Delete ${member.email}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div>)}{!data.members.length && <Empty text="No meeting members yet." />}</div></section>
    </main>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`block text-sm font-semibold text-gray-700 ${wide ? "sm:col-span-2" : ""}`}>{label}{children}</label>; }
function Stat({ icon: Icon, label, value, detail }: { icon: typeof Mail; label: string; value: number; detail: string }) { return <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-brand-muted">{label}</p><p className="mt-1 text-3xl font-bold text-brand-ink">{value.toLocaleString()}</p></div><span className="rounded-xl bg-brand-soft p-2.5 text-brand-dark"><Icon size={20} /></span></div><p className="mt-3 text-xs text-brand-muted">{detail}</p></div>; }
function SubscriberCount({ label, value }: { label: string; value: number }) { return <div className="min-w-20 rounded-xl bg-brand-soft px-3 py-2"><strong className="block text-base text-brand-ink">{value.toLocaleString()}</strong><span className="text-brand-muted">{label}</span></div>; }
function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Mail; children: React.ReactNode }) { return <section className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm"><div className="flex items-center gap-2 border-b border-brand-border px-5 py-4"><Icon size={19} className="text-brand-dark" /><h2 className="font-bold text-brand-ink">{title}</h2></div><div className="divide-y divide-brand-border">{children}</div></section>; }
function Row({ title, detail, badge, action }: { title: string; detail: string; badge: string; action?: React.ReactNode }) { return <div className="flex items-center gap-3 px-5 py-4"><div className="min-w-0 flex-1"><p className="truncate font-semibold text-brand-ink">{title}</p><p className="mt-1 truncate text-xs text-brand-muted">{detail}</p></div><span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold capitalize text-brand-dark">{badge}</span>{action}</div>; }
function Empty({ text }: { text: string }) { return <p className="p-6 text-sm text-brand-muted">{text}</p>; }
