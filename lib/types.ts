export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProductSpecifications {
  [key: string]: string;
}

export interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  features?: string;
  category: "seeds" | "produce" | "other";
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  specifications?: ProductSpecifications;
  brand?: string;
  model?: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status: "active" | "inactive" | "draft";
  organicCertified?: boolean;
  harvestDate?: unknown;
  seedType?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type PublicProduct = Product & {
  id: string;
  _id: string;
};

export type CartItem = PublicProduct & {
  quantity: number;
};

export interface ArticleAuthor {
  uid: string;
  name: string;
  email: string;
}

export interface StudyCategoryOption {
  name: string;
  slug: string;
  count: number;
}

export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: "faith" | "recipe" | "agriculture" | "homeschooling" | "study";
  studyCategory?: string;
  tags: string[];
  author: ArticleAuthor;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  published: boolean;
  publishedAt?: unknown;
  views: number;
  isDownloadable: boolean;
  fileKey?: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type PublicArticle = Article & {
  id: string;
  _id: string;
};

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    county?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface Order {
  id?: string;
  _id?: string;
  userId: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "mpesa" | "bank_transfer" | "cash_on_delivery" | "card";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  shippingMethod: "standard" | "express" | "pickup";
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type PublicOrder = Order & {
  id: string;
  _id: string;
};

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt?: unknown;
}

export interface Donation {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  amount: number;
  currency: "USD";
  status: "pending" | "succeeded" | "failed" | "refunded";
  paymentMethod: "manual";
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type PublicDonation = Donation & {
  id: string;
  _id: string;
};
