import "server-only";
import { deleteImage, validateManagedPublicId } from "@/lib/cloudinary";
import { firestore } from "@/lib/firestore";
import { isManagedImageKey, managedImageIdFromUrl } from "@/lib/managed-images";
import { deleteFromR2 } from "@/lib/r2";

export function validateManagedImageId(value: unknown): string {
  if (typeof value !== "string") throw new Error("An image ID is required");
  if (isManagedImageKey(value)) return value;
  return validateManagedPublicId(value);
}

export async function imageIsReferenced(id: string, excludeArticleId?: string, excludeProductId?: string): Promise<boolean> {
  const [articles, products] = await Promise.all([
    firestore().collection("articles").get(),
    firestore().collection("products").get(),
  ]);
  if (articles.docs.some((article) => article.id !== excludeArticleId && typeof article.data().featuredImage === "string" && managedImageIdFromUrl(article.data().featuredImage) === id)) return true;
  return products.docs.some((product) => {
    if (product.id === excludeProductId) return false;
    const data = product.data();
    const images = Array.isArray(data.images) ? data.images : [];
    const variants = Array.isArray(data.variants) ? data.variants : [];
    return [...images, ...variants.map((variant: { image?: unknown }) => variant?.image)]
      .some((image) => typeof image === "string" && managedImageIdFromUrl(image) === id);
  });
}

export async function deleteManagedImage(id: string): Promise<void> {
  const valid = validateManagedImageId(id);
  if (isManagedImageKey(valid)) await deleteFromR2(valid);
  else await deleteImage(valid);
}
