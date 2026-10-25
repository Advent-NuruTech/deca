"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Hammer, HeartHandshake, Lightbulb, Send } from "lucide-react";
import { api } from "@/lib/api";
import { defaultLifeSkillsSettings, lifeSkillPathGuidance, type LifeSkillPathId, type LifeSkillsSettings } from "@/lib/life-skills";

const icons = [Lightbulb, Hammer, BriefcaseBusiness, HeartHandshake];
type FormValues = { name: string; email: string; phone: string; path: LifeSkillPathId; skillArea: string; role: string; message: string };
const initialForm: FormValues = { name: "", email: "", phone: "", path: "calling", skillArea: "", role: "", message: "" };

export default function PracticalChristianityPage() {
  const [settings, setSettings] = useState<LifeSkillsSettings>(defaultLifeSkillsSettings);
  const [form, setForm] = useState<FormValues>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const selectedPath = settings.pathways.find((path) => path.id === form.path) ?? settings.pathways[0];

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("path");
    if (requested && defaultLifeSkillsSettings.pathways.some((path) => path.id === requested)) {
      setForm((current) => ({ ...current, path: requested as LifeSkillPathId }));
    }
    api.get<{ settings?: LifeSkillsSettings }>("/api/life-skills")
      .then((data) => { if (data?.settings?.pathways?.length) setSettings(data.settings); })
      .catch(() => undefined);
  }, []);

  function choosePath(path: LifeSkillPathId) {
    setSuccess(false);
    setForm((current) => ({ ...current, path }));
  }

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSuccess(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");
    try {
      await api.post("/api/life-skills-interest", form);
      setSuccess(true);
      setForm((current) => ({ ...initialForm, path: current.path }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not send your interest. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-stone-50 text-slate-900">
      <section id="pathways" className="relative scroll-mt-20 overflow-hidden bg-emerald-950 pb-14 pt-32 text-white sm:pb-20 sm:pt-40" aria-labelledby="pathways-heading">
        <motion.div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(52,211,153,0.22),transparent_27%),radial-gradient(circle_at_88%_70%,rgba(245,158,11,0.16),transparent_25%)]" animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Practical Christianity</p>
            <h1 id="pathways-heading" className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Transforming lives through faith &amp; action</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-emerald-50/85 sm:text-lg">Use your skills to serve people, strengthen families, and share Christ&apos;s hope.</p>
            <h2 className="mt-10 text-3xl font-bold tracking-tight sm:text-4xl">Choose your next step</h2>
            <p className="mx-auto mt-3 max-w-2xl text-emerald-50/85">Choose the pathway that fits where you are now. Selecting any card takes you straight to the enquiry form with that pathway already chosen.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {settings.pathways.map((path, index) => {
              const Icon = icons[index];
              const selected = form.path === path.id;
              return (
                <article key={path.id} className={`rounded-2xl border transition ${selected ? "border-amber-300 bg-white/20 text-white shadow-lg" : "border-white/15 bg-white/10 text-white backdrop-blur-sm hover:-translate-y-1 hover:bg-white/15"}`}>
                  <a href="#get-involved" onClick={() => choosePath(path.id)} aria-label={`${path.action}: choose ${path.title} and continue to the enquiry form`} className="flex min-h-96 h-full flex-col rounded-2xl p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
                    <div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[0.16em] text-amber-300">{path.number}</span><Icon aria-hidden="true" className="text-emerald-200" size={24} /></div>
                    <h3 className="mt-7 text-xl font-bold">{path.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/85">{path.summary}</p>
                    <p className="mt-4 border-l-2 border-amber-300/80 pl-3 text-sm leading-6 text-emerald-50/90"><span className="font-bold text-amber-200">What it&apos;s for:</span> {lifeSkillPathGuidance[path.id].for}</p>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/90"><span className="font-bold text-amber-200">Potential impact:</span> {lifeSkillPathGuidance[path.id].impact}</p>
                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-bold text-amber-200 underline-offset-4">{path.action}<ArrowRight aria-hidden="true" size={16} /></span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="get-involved" className="scroll-mt-20 bg-slate-900 py-14 text-white sm:py-20" aria-labelledby="interest-heading">
        <div className="container mx-auto px-4">
          <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Next step</p>
              <h2 id="interest-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Tell us how you want to help or grow.</h2>
              <p className="mt-4 leading-7 text-slate-300">Your chosen pathway is ready below. Pick a skill area and tell us what support or opportunity you&apos;re looking for.</p>
              <p className="mt-7 text-sm text-slate-400">For a general question, <Link href="/contact" className="font-bold text-emerald-300 underline underline-offset-4 hover:text-white">contact us</Link>.</p>
            </div>
            <form onSubmit={submit} className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl sm:p-8">
              <p role="status" className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><span className="font-bold">Selected pathway: {selectedPath.title}.</span> {lifeSkillPathGuidance[selectedPath.id].for}</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" required><input name="name" value={form.name} onChange={update} required maxLength={120} autoComplete="name" className="input-field" /></Field>
                <Field label="Email" required><input name="email" type="email" value={form.email} onChange={update} required maxLength={254} autoComplete="email" className="input-field" /></Field>
                <Field label="Phone"><input name="phone" value={form.phone} onChange={update} maxLength={40} autoComplete="tel" className="input-field" /></Field>
                <Field label="Pathway" required><select name="path" value={form.path} onChange={update} className="input-field">{settings.pathways.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}</select></Field>
                <Field label="Skill area" required><select name="skillArea" value={form.skillArea} onChange={update} required className="input-field"><option value="" disabled>Choose one</option>{settings.skillAreas.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                <Field label="I would like to" required><select name="role" value={form.role} onChange={update} required className="input-field"><option value="" disabled>Choose one</option>{settings.interestRoles.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
              </div>
              <Field label="Message"><textarea name="message" value={form.message} onChange={update} maxLength={2000} rows={3} className="input-field resize-y" placeholder="Briefly tell us what you need." /></Field>
              {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {success && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 aria-hidden="true" className="mr-2 inline h-5 w-5 text-emerald-700" /><strong>Thank you.</strong> Your interest has been received.</p>}
              <button disabled={submitting} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending…" : "Send my interest"}<Send aria-hidden="true" size={17} /></button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-800"><span className="mb-2 block">{label}{required && <span aria-hidden="true" className="text-emerald-700"> *</span>}</span>{children}</label>;
}
