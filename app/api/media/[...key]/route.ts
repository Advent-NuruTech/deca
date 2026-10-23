import { errorResponse, HttpError } from "@/lib/auth";
import { isManagedImageKey } from "@/lib/managed-images";
import { getR2Object } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  try {
    const key = (await params).key.join("/");
    if (!isManagedImageKey(key)) throw new HttpError(404, "Image not found");
    let object;
    try {
      object = await getR2Object(key);
    } catch (error) {
      const name = error && typeof error === "object" && "name" in error ? String(error.name) : "";
      if (name === "NoSuchKey" || name === "NotFound") throw new HttpError(404, "Image not found");
      throw error;
    }
    if (!object.Body) throw new HttpError(404, "Image not found");
    const types: Record<string, string> = { jpg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" };
    const headers = new Headers({
      "Content-Type": types[key.split(".").pop()!] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    if (object.ContentLength !== undefined) headers.set("Content-Length", String(object.ContentLength));
    return new Response(object.Body.transformToWebStream(), { headers });
  } catch (error) {
    return errorResponse(error);
  }
}
