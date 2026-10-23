import type { ReactNode } from "react";

type Action = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  pressed?: boolean;
};

const colors = [
  "bg-emerald-600 hover:bg-emerald-700",
  "bg-blue-600 hover:bg-blue-700",
  "bg-orange-500 hover:bg-orange-600",
  "bg-green-600 hover:bg-green-700",
];

export default function PageQuickActions({ actions }: { actions: Action[] }) {
  return (
    <section aria-label="Quick actions" className="mb-8 mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
      <div className={`grid grid-cols-2 gap-2 sm:gap-3 ${actions.length === 3 ? "lg:grid-cols-3" : actions.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"}`}>
        {actions.map((action, index) => {
          const className = `flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-center text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-row sm:gap-2 ${action.pressed ? "ring-2 ring-slate-700 ring-offset-2" : ""} ${colors[index % colors.length]}`;
          return action.href ? (
            <a key={action.label} href={action.href} className={className}>{action.icon}<span>{action.label}</span></a>
          ) : (
            <button key={action.label} type="button" aria-pressed={action.pressed} onClick={action.onClick} disabled={action.disabled} className={className}>{action.icon}<span>{action.label}</span></button>
          );
        })}
      </div>
    </section>
  );
}
