export const PUBLIC_ARTICLES_TAG = "public-articles";
export const PUBLIC_PRODUCTS_TAG = "public-products";
export const PRODUCT_CATEGORIES_TAG = "product-categories";
export const RESOURCE_TAXONOMY_TAG = "resource-taxonomy";
export const CHAT_SETTINGS_TAG = "chat-settings";

export const PUBLIC_CACHE_CONTROL =
  "public, max-age=60, s-maxage=300, stale-while-revalidate=3600";

// Product availability, prices and images are edited from the admin area and must
// reflect those changes immediately. The underlying D1 read model remains cached
// and is invalidated by product mutations, but a CDN response must never mask it.
export const PUBLIC_PRODUCTS_CACHE_CONTROL = "no-store";
