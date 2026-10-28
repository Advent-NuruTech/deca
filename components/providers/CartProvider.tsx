"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, PublicProduct, ProductVariant } from "@/lib/types";

const CART_STORAGE_KEY = "cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: PublicProduct, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export function cartItemKey(item: Pick<CartItem, "_id" | "variantId">) { return JSON.stringify([item._id, item.variantId ?? null]); }

const CartContext = createContext<CartContextValue | null>(null);

function storedCartItem(value: unknown): CartItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const valid =
    typeof item._id === "string" &&
    typeof item.name === "string" &&
    typeof item.slug === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0;
  if (!valid) return null;
  const saleType = item.saleType === "wholesale" ? "wholesale" : "retail";
  const minimumOrderQuantity = saleType === "wholesale" && Number.isInteger(item.minimumOrderQuantity) && Number(item.minimumOrderQuantity) >= 2 ? Number(item.minimumOrderQuantity) : 1;
  return {
    ...(item as unknown as CartItem),
    id: typeof item.id === "string" ? item.id : item._id as string,
    saleType,
    minimumOrderQuantity,
    quantity: Math.max(minimumOrderQuantity, item.quantity as number),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        setItems(parsed.map(storedCartItem).filter((item): item is CartItem => item !== null));
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((product: PublicProduct, quantity = 1, variant?: ProductVariant) => {
    if (product.variants?.length && !variant) return;
    const minimumQuantity = product.saleType === "wholesale" ? Math.max(2, product.minimumOrderQuantity ?? 2) : 1;
    const stock = variant?.stockQuantity ?? product.stockQuantity;
    if (stock < minimumQuantity) return;
    const safeQuantity = Math.min(stock, Math.max(minimumQuantity, Math.floor(quantity)));
    setItems((current) => {
      const existing = current.find((item) => item._id === product._id && item.variantId === variant?.id);
      if (!existing) return [...current, { ...product, ...(variant ? { variantId: variant.id, variantName: variant.name, price: variant.price, stockQuantity: variant.stockQuantity, images: variant.image ? [variant.image] : product.images } : {}), quantity: safeQuantity }];
      return current.map((item) =>
        item._id === product._id && item.variantId === variant?.id
          ? { ...item, ...product, ...(variant ? { variantId: variant.id, variantName: variant.name, price: variant.price, stockQuantity: variant.stockQuantity, images: variant.image ? [variant.image] : product.images } : {}), quantity: Math.min(stock, item.quantity < minimumQuantity ? safeQuantity : item.quantity + safeQuantity) }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => cartItemKey(item) !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        cartItemKey(item) === productId ? { ...item, quantity: Math.max(item.saleType === "wholesale" ? Math.max(2, item.minimumOrderQuantity ?? 2) : 1, Math.floor(quantity)) } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  );
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const value = useMemo(
    () => ({ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }),
    [items, itemCount, total, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
