import { applyProductCopy, type HowToSection } from "@/lib/productCopy";

export type VariantPrices = Record<string, number>;

export type Product = {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  category: "seeds" | "powders" | "honey" | "combos";
  description: string;
  shortDescription: string;
  displayTitle?: string;
  tagline?: string;
  benefits?: string[];
  howToUse?: HowToSection[];
  disclaimer?: string;
  adHook?: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  imageIcon: string;
  imageUrl?: string;
  variantPrices: VariantPrices;
};

const fallbackCatalog = [
  {
    id: "black-seeds-kalonjira",
    slug: "black-seeds-kalonjira",
    nameBn: "কালোজিরা",
    nameEn: "Black Seeds",
    category: "seeds",
    description: "",
    shortDescription: "",
    price: 180,
    oldPrice: 240,
    badge: "বেস্ট সেলার",
    imageIcon: "🌿",
    variantPrices: { "100g": 180, "250g": 420, "500g": 780 }
  },
  {
    id: "chia-seeds",
    slug: "chia-seeds",
    nameBn: "চিয়া সিড",
    nameEn: "Chia Seeds",
    category: "seeds",
    description: "",
    shortDescription: "",
    price: 280,
    oldPrice: 350,
    badge: "নতুন",
    imageIcon: "🌱",
    variantPrices: { "100g": 280, "250g": 650, "500g": 1200 }
  },
  {
    id: "flax-seeds",
    slug: "flax-seeds",
    nameBn: "ফ্ল্যাক্স সিড",
    nameEn: "Flax Seeds",
    category: "seeds",
    description: "",
    shortDescription: "",
    price: 220,
    oldPrice: 280,
    badge: "ফাইবার রিচ",
    imageIcon: "🌻",
    variantPrices: { "100g": 220, "250g": 520, "500g": 960 }
  },
  {
    id: "pumpkin-seeds",
    slug: "pumpkin-seeds",
    nameBn: "পাম্পকিন সিড",
    nameEn: "Pumpkin Seeds",
    category: "seeds",
    description: "",
    shortDescription: "",
    price: 320,
    oldPrice: 380,
    badge: "প্রোটিন",
    imageIcon: "🎃",
    variantPrices: { "100g": 320, "250g": 720 }
  },
  {
    id: "sunflower-seeds",
    slug: "sunflower-seeds",
    nameBn: "সানফ্লাওয়ার সিড",
    nameEn: "Sunflower Seeds",
    category: "seeds",
    description: "",
    shortDescription: "",
    price: 200,
    oldPrice: 240,
    badge: "ভিটামিন E",
    imageIcon: "🌼",
    variantPrices: { "100g": 200, "250g": 460, "500g": 880 }
  },
  {
    id: "beetroot-powder",
    slug: "beetroot-powder",
    nameBn: "বিটরুট পাউডার",
    nameEn: "Beetroot Powder",
    category: "powders",
    description: "",
    shortDescription: "",
    price: 350,
    oldPrice: 420,
    badge: "ন্যাচারাল",
    imageIcon: "🫐",
    variantPrices: { "100g": 350, "250g": 820 }
  },
  {
    id: "moringa-powder",
    slug: "moringa-powder",
    nameBn: "মরিঙ্গা পাউডার",
    nameEn: "Moringa Powder",
    category: "powders",
    description: "",
    shortDescription: "",
    price: 380,
    oldPrice: 460,
    badge: "সুপারফুড",
    imageIcon: "🍃",
    variantPrices: { "100g": 380, "250g": 890 }
  },
  {
    id: "pure-honey",
    slug: "pure-honey",
    nameBn: "খাঁটি মধু",
    nameEn: "Pure Honey",
    category: "honey",
    description: "",
    shortDescription: "",
    price: 520,
    oldPrice: 540,
    badge: "খাঁটি",
    imageIcon: "🍯",
    variantPrices: { "250g": 520, "500g": 980, "1kg": 1850 }
  },
  {
    id: "tukma-seeds",
    slug: "tukma-seeds",
    nameBn: "তোকমা দানা",
    nameEn: "Tukma / Basil Seeds",
    category: "seeds",
    description: "",
    shortDescription: "",
    price: 190,
    oldPrice: 240,
    badge: "ফাইবার রিচ",
    imageIcon: "💧",
    variantPrices: { "100g": 190, "250g": 440, "500g": 820 }
  },
  {
    id: "isabgol-bhusi",
    slug: "isabgol-bhusi",
    nameBn: "ইসবগুল ভুসি",
    nameEn: "Psyllium Husk",
    category: "powders",
    description: "",
    shortDescription: "",
    price: 300,
    oldPrice: 360,
    badge: "ফাইবার",
    imageIcon: "🌾",
    variantPrices: { "100g": 300, "250g": 700 }
  },
  {
    id: "starter-health-pack",
    slug: "starter-health-pack",
    nameBn: "স্টার্টার হেলথ প্যাক",
    nameEn: "Starter Health Pack",
    category: "combos",
    description: "",
    shortDescription: "",
    price: 580,
    oldPrice: 760,
    badge: "কম্বো",
    imageIcon: "💚",
    variantPrices: { combo: 580 }
  },
  {
    id: "fitness-power-pack",
    slug: "fitness-power-pack",
    nameBn: "ফিটনেস পাওয়ার প্যাক",
    nameEn: "Fitness Power Pack",
    category: "combos",
    description: "",
    shortDescription: "",
    price: 980,
    oldPrice: 1280,
    badge: "কম্বো",
    imageIcon: "⚡",
    variantPrices: { combo: 980 }
  },
  {
    id: "family-wellness-combo",
    slug: "family-wellness-combo",
    nameBn: "ফ্যামিলি ওয়েলনেস কম্বো",
    nameEn: "Family Wellness Combo",
    category: "combos",
    description: "",
    shortDescription: "",
    price: 1280,
    oldPrice: 1650,
    badge: "কম্বো",
    imageIcon: "👨‍👩‍👧‍👦",
    variantPrices: { combo: 1280 }
  }
] as Product[];

const fallbackProducts = fallbackCatalog.map((product) => applyProductCopy(product));

function normalizeCategory(category: unknown): Product["category"] {
  const slug =
    typeof category === "object" && category && "slug" in category
      ? String((category as { slug?: string }).slug)
      : String(category || "");
  if (slug.includes("powder")) return "powders";
  if (slug.includes("honey")) return "honey";
  if (slug.includes("combo")) return "combos";
  return "seeds";
}

function normalizeProduct(raw: any): Product {
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const variantPrices =
    raw.variantPrices && typeof raw.variantPrices === "object"
      ? raw.variantPrices
      : Object.fromEntries(
          variants
            .filter((variant: any) => variant?.weight && variant?.unitPrice != null)
            .map((variant: any) => [String(variant.weight), Number(variant.unitPrice)])
        );

  const product: Product = {
    id: String(raw._id || raw.id || raw.slug),
    slug: String(raw.slug || raw.id),
    nameBn: String(raw.nameBn || raw.name || raw.nameEn || "PureOrigins product"),
    nameEn: String(raw.nameEn || raw.name || raw.nameBn || "PureOrigins product"),
    category: normalizeCategory(raw.category),
    description: String(raw.description || raw.shortDescription || ""),
    shortDescription: String(raw.shortDescription || raw.description || ""),
    benefits: Array.isArray(raw.benefits) ? raw.benefits.map(String) : undefined,
    howToUse: Array.isArray(raw.usageInstructions)
      ? raw.usageInstructions.map((text: string) => ({ title: "ব্যবহারবিধি", body: String(text) }))
      : undefined,
    disclaimer: raw.disclaimer ? String(raw.disclaimer) : undefined,
    price: Number(raw.price || Object.values(variantPrices)[0] || 0),
    oldPrice: raw.oldPrice ? Number(raw.oldPrice) : undefined,
    badge: raw.badge,
    imageIcon: raw.imageIcon || "🌿",
    imageUrl: raw.imageUrl || (Array.isArray(raw.images) ? raw.images[0] : undefined),
    variantPrices
  };

  return applyProductCopy(product);
}

export async function getProducts(): Promise<Product[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  if (!apiBase) return fallbackProducts;

  try {
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/products`, {
      cache: "no-store"
    });
    if (!response.ok) return fallbackProducts;
    const data = await response.json();
    const products = Array.isArray(data.products) ? data.products.map(normalizeProduct) : [];
    return products.length ? products : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export function firstVariant(product: Product) {
  return Object.keys(product.variantPrices)[0] || "";
}

export function variantPrice(product: Product, weight: string) {
  return Number(product.variantPrices[weight] ?? 0);
}

export const categories = [
  { label: "সব", href: "/shop" },
  { label: "সিডস", href: "/shop?category=seeds" },
  { label: "পাউডার", href: "/shop?category=powders" },
  { label: "মধু", href: "/shop?category=honey" },
  { label: "কম্বো", href: "/combos" }
];
