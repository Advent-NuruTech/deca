export type CatalogueTier = { min: number; max: number | null; price: number };
export type CatalogueBook = { id: string; title: string; tiers: CatalogueTier[] };
export type Catalogue = { year: string; grades: string; delivery: string; phone: string; whatsapp: string; books: CatalogueBook[] };

export const defaultCatalogue: Catalogue = {
  year: "2027", grades: "Combined Grade 7, 8 & 9", delivery: "Parcel delivery charges inclusive. We deliver countrywide.", phone: "0113 048 435", whatsapp: "0701 836 849",
  books: [
    { id: "social-studies", title: "Social Studies", tiers: [{ min: 1, max: 2, price: 1050 }, { min: 3, max: 10, price: 750 }, { min: 11, max: 20, price: 650 }, { min: 21, max: 50, price: 550 }, { min: 51, max: null, price: 450 }] },
    { id: "integrated-science", title: "Integrated Science Paper 1", tiers: [{ min: 1, max: 5, price: 850 }, { min: 6, max: 15, price: 650 }, { min: 16, max: 50, price: 500 }, { min: 51, max: null, price: 450 }] },
    { id: "mathematics", title: "Mathematics", tiers: [{ min: 1, max: 5, price: 1300 }, { min: 6, max: 10, price: 1000 }, { min: 11, max: 30, price: 800 }, { min: 31, max: 50, price: 650 }, { min: 51, max: 100, price: 550 }] },
  ],
};

export function validateCatalogue(value: unknown): Catalogue | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const validText = (x: unknown, max: number): x is string => typeof x === "string" && !!x.trim() && x.trim().length <= max;
  if (!validText(v.year, 30) || !validText(v.grades, 100) || !validText(v.delivery, 250) || !validText(v.phone, 30) || !validText(v.whatsapp, 30) || !/^\+?[\d ()-]+$/.test(v.phone) || !/^\+?[\d ()-]+$/.test(v.whatsapp) || v.phone.replace(/\D/g, "").length < 9 || v.whatsapp.replace(/\D/g, "").length < 9 || !Array.isArray(v.books) || v.books.length < 1 || v.books.length > 50) return null;
  const books: CatalogueBook[] = [];
  for (const item of v.books) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const book = item as Record<string, unknown>;
    if (!validText(book.id, 100) || !/^[a-zA-Z0-9_-]+$/.test(book.id) || books.some((b) => b.id === book.id) || !validText(book.title, 150) || !Array.isArray(book.tiers) || !book.tiers.length || book.tiers.length > 30) return null;
    const tiers: CatalogueTier[] = [];
    for (const item of book.tiers) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const tier = item as Record<string, unknown>;
      if (!Number.isSafeInteger(tier.min) || (tier.min as number) !== (tiers.length ? (tiers[tiers.length - 1].max ?? -1) + 1 : 1) || !(tier.max === null || (Number.isSafeInteger(tier.max) && (tier.max as number) >= (tier.min as number) && (tier.max as number) <= 1000000)) || typeof tier.price !== "number" || !Number.isFinite(tier.price) || tier.price <= 0 || tier.price > 10000000) return null;
      tiers.push({ min: tier.min as number, max: tier.max as number | null, price: tier.price });
    }
    books.push({ id: book.id, title: book.title.trim(), tiers });
  }
  return { year: v.year.trim(), grades: v.grades.trim(), delivery: v.delivery.trim(), phone: v.phone.trim(), whatsapp: v.whatsapp.trim(), books };
}

export function tierLabel(tier: CatalogueTier) { return tier.max === null ? `${tier.min}+ copies` : tier.min === tier.max ? `${tier.min} copy` : `${tier.min}–${tier.max} copies`; }
export function whatsappNumber(phone: string) { const digits = phone.replace(/\D/g, ""); return digits.startsWith("0") ? `254${digits.slice(1)}` : digits; }
