// Shared by the upload API and admin editors. R2 keys are stable across category changes.
const IMAGE_KEY = /^images\/(products|resources)\/[a-f0-9-]{36}\.(jpg|png|gif|webp)$/;
const IMAGE_URL_PREFIX = "/api/media/";

export function isManagedImageKey(value: string): boolean {
  return IMAGE_KEY.test(value);
}

export function managedImageUrl(key: string): string {
  if (!isManagedImageKey(key)) throw new Error("Invalid managed image key");
  return `${IMAGE_URL_PREFIX}${key}`;
}

export function managedImageIdFromUrl(value: string): string | null {
  if (value.startsWith(IMAGE_URL_PREFIX)) {
    const key = value.slice(IMAGE_URL_PREFIX.length);
    return isManagedImageKey(key) ? key : null;
  }
  try {
    const parsed = new URL(value);
    if (parsed.hostname !== "res.cloudinary.com") return null;
    const marker = "/upload/";
    const start = parsed.pathname.indexOf(marker);
    if (start < 0) return null;
    const parts = parsed.pathname.slice(start + marker.length).split("/").filter(Boolean);
    if (/^v\d+$/.test(parts[0] ?? "")) parts.shift();
    const id = decodeURIComponent(parts.join("/")).replace(/\.[^.]+$/, "");
    return id.startsWith("remsam-Kenya/") && !id.includes("..") ? id : null;
  } catch {
    return null;
  }
}
