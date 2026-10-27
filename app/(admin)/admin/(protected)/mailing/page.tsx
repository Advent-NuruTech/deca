import { ArrowUpRight, Mail } from "lucide-react";

export default function MailingPage() {
  const message = "hey advent nurutech gilead please configure our email system";
  const applyUrl = `https://wa.me/254142225233?text=${encodeURIComponent(message)}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[#079326] px-6 py-8 text-white sm:px-8">
          <Mail className="h-8 w-8" aria-hidden="true" />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-white">Mailing system</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Apply for mailing system</h1>
        </div>

        <div className="p-6 sm:p-8">
          <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
            Mailing is not active yet. You will be charged a one-time fee of <strong className="text-slate-950">KES 1,250</strong> for this service.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Select Apply to send Advent Nurutech a pre-filled request to configure the email system for Gilead.
          </p>

          <a
            href={applyUrl}
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#008EFE] px-5 py-3 font-semibold text-white transition hover:bg-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"
          >
            Apply for mailing system
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
