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

export function cloudinaryPublicId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("cloudinary.com")) return null;
    const marker = "/upload/";
    const start = parsed.pathname.indexOf(marker);
    if (start < 0) return null;
    const parts = parsed.pathname.slice(start + marker.length).split("/").filter(Boolean);
    if (/^v\d+$/.test(parts[0] ?? "")) parts.shift();
    const publicId = decodeURIComponent(parts.join("/")).replace(/\.[^.]+$/, "");
    return publicId.startsWith("remsam-Kenya/") ? publicId : null;
  } catch {
    return null;
  }
}

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
