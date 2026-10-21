import Link from "next/link";

export default function EmailPreferencesPage() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-brand-canvas px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm md:p-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-dark">Remsam Homestead</p>
        <h1 className="mt-4 text-3xl font-bold text-brand-ink">Email preferences</h1>
        <p className="mt-4 leading-7 text-brand-muted">Use the personal unsubscribe link at the bottom of any Remsam Homestead newsletter to stop future messages safely.</p>
        <Link href="/" className="mt-7 inline-flex rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">Return home</Link>
      </section>
    </main>
  );
}
