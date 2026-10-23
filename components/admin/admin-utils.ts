export function formatDate(value: unknown) {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-KE", { dateStyle: "medium" });
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
