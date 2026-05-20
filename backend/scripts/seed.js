import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required before running the seed script.");
}

await mongoose.connect(process.env.MONGODB_URI);

await Category.deleteMany({});
await Product.deleteMany({});

const categories = await Category.insertMany([
  { nameBn: "সিডস", nameEn: "Seeds", slug: "seeds", description: "প্রাকৃতিক বীজজাত পণ্য" },
  { nameBn: "পাউডার", nameEn: "Powders", slug: "powders", description: "প্রাকৃতিক সুপারফুড পাউডার" },
  { nameBn: "মধু", nameEn: "Honey", slug: "honey", description: "খাঁটি প্রাকৃতিক মধু" }
]);

const categoryBySlug = Object.fromEntries(categories.map(category => [category.slug, category._id]));

const productSeeds = [
  {
    nameBn: "কালোজিরা",
    nameEn: "Black Seeds (Kalonjira)",
    slug: "black-seeds-kalonjira",
    category: categoryBySlug.seeds,
    price: 180,
    oldPrice: 220,
    badge: "বেস্ট সেলার",
    stockQuantity: 120,
    tags: ["কালোজিরা", "black seed", "nigella", "ইমিউনিটি"],
    shortDescription: "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে সহায়ক",
    description: "প্রিমিয়াম মানের কালোজিরা, প্রতিদিনের স্বাস্থ্যকর রুটিনে সহজে ব্যবহারযোগ্য।",
    benefits: ["ইমিউন সাপোর্ট", "হজমে সহায়তা", "প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট"],
    ingredients: ["১০০% খাঁটি কালোজিরা"],
    usageInstructions: ["প্রতিদিন ১ চা চামচ পানি, মধু বা খাবারের সাথে গ্রহণ করুন।"]
  },
  {
    nameBn: "চিয়া সিড",
    nameEn: "Chia Seeds",
    slug: "chia-seeds",
    category: categoryBySlug.seeds,
    price: 280,
    oldPrice: 350,
    badge: "নতুন",
    stockQuantity: 90,
    tags: ["চিয়া", "chia", "omega", "fiber"],
    shortDescription: "ওমেগা-৩ ও ফাইবার সমৃদ্ধ সুপারফুড",
    description: "চিয়া সিড স্মুদি, ওটস, দই বা পানীয়তে সহজে মিশিয়ে খাওয়া যায়।",
    benefits: ["ওমেগা-৩ সাপোর্ট", "ফাইবার সমৃদ্ধ", "দীর্ঘক্ষণ পেট ভরা রাখতে সহায়ক"],
    ingredients: ["১০০% চিয়া সিড"],
    usageInstructions: ["১-২ চা চামচ চিয়া সিড পানিতে ভিজিয়ে বা খাবারের সাথে মিশিয়ে খান।"]
  },
  {
    nameBn: "ফ্ল্যাক্স সিড",
    nameEn: "Flax Seeds",
    slug: "flax-seeds",
    category: categoryBySlug.seeds,
    price: 220,
    oldPrice: 260,
    badge: "ফাইবার রিচ",
    stockQuantity: 80,
    tags: ["ফ্ল্যাক্স", "flax", "fiber", "omega"],
    shortDescription: "ফাইবার ও স্বাস্থ্যকর ফ্যাটের প্রাকৃতিক উৎস",
    description: "ফ্ল্যাক্স সিড সালাদ, স্মুদি বা রুটির সাথে ব্যবহার করা যায়।",
    benefits: ["হার্ট সাপোর্ট", "ফাইবার সমৃদ্ধ", "ওমেগা ফ্যাটি অ্যাসিড"],
    ingredients: ["১০০% ফ্ল্যাক্স সিড"],
    usageInstructions: ["ভালো ফলের জন্য হালকা গুঁড়া করে খাবারের সাথে গ্রহণ করুন।"]
  },
  {
    nameBn: "পাম্পকিন সিড",
    nameEn: "Pumpkin Seeds",
    slug: "pumpkin-seeds",
    category: categoryBySlug.seeds,
    price: 320,
    oldPrice: 380,
    badge: "প্রোটিন",
    stockQuantity: 70,
    tags: ["পাম্পকিন", "pumpkin", "protein", "zinc"],
    shortDescription: "প্রোটিন ও মিনারেল সমৃদ্ধ স্বাস্থ্যকর স্ন্যাক",
    description: "পাম্পকিন সিড সরাসরি স্ন্যাক হিসেবে বা সালাদে ব্যবহার করা যায়।",
    benefits: ["প্রোটিন সাপোর্ট", "জিঙ্ক সমৃদ্ধ", "এনার্জি সাপোর্ট"],
    ingredients: ["১০০% পাম্পকিন সিড"],
    usageInstructions: ["প্রতিদিন পরিমাণমতো স্ন্যাক হিসেবে অথবা খাবারের সাথে খান।"]
  },
  {
    nameBn: "সানফ্লাওয়ার সিড",
    nameEn: "Sunflower Seeds",
    slug: "sunflower-seeds",
    category: categoryBySlug.seeds,
    price: 200,
    oldPrice: 240,
    badge: "ভিটামিন ই",
    stockQuantity: 75,
    tags: ["সানফ্লাওয়ার", "sunflower", "vitamin e"],
    shortDescription: "ভিটামিন ই ও স্বাস্থ্যকর ফ্যাটের উৎস",
    description: "সানফ্লাওয়ার সিড হালকা স্ন্যাক বা খাবারের টপিং হিসেবে চমৎকার।",
    benefits: ["ভিটামিন ই", "স্কিন সাপোর্ট", "হেলদি স্ন্যাক"],
    ingredients: ["১০০% সানফ্লাওয়ার সিড"],
    usageInstructions: ["সরাসরি অথবা সালাদ, ওটস ও স্মুদির সাথে ব্যবহার করুন।"]
  },
  {
    nameBn: "বিটরুট পাউডার",
    nameEn: "Beetroot Powder",
    slug: "beetroot-powder",
    category: categoryBySlug.powders,
    price: 350,
    oldPrice: 420,
    badge: "ন্যাচারাল",
    stockQuantity: 55,
    tags: ["বিটরুট", "beetroot", "powder", "iron"],
    shortDescription: "প্রাকৃতিক রঙ, পুষ্টি ও এনার্জির উৎস",
    description: "বিটরুট পাউডার জুস, স্মুদি বা রেসিপিতে সহজে ব্যবহারযোগ্য।",
    benefits: ["এনার্জি সাপোর্ট", "প্রাকৃতিক রঙ", "মাইক্রোনিউট্রিয়েন্ট সমৃদ্ধ"],
    ingredients: ["১০০% বিটরুট পাউডার"],
    usageInstructions: ["১ চা চামচ পানি, জুস বা স্মুদির সাথে মিশিয়ে পান করুন।"]
  },
  {
    nameBn: "মরিঙ্গা পাউডার",
    nameEn: "Moringa Powder",
    slug: "moringa-powder",
    category: categoryBySlug.powders,
    price: 380,
    oldPrice: 460,
    badge: "সুপারফুড",
    stockQuantity: 50,
    tags: ["মরিঙ্গা", "moringa", "powder", "superfood"],
    shortDescription: "মাল্টিভিটামিন ও মিনারেলের সুপারফুড",
    description: "মরিঙ্গা পাউডার প্রতিদিনের পুষ্টি সাপোর্টে জনপ্রিয় প্রাকৃতিক পণ্য।",
    benefits: ["ভিটামিন সাপোর্ট", "মিনারেল সমৃদ্ধ", "ইমিউন সাপোর্ট"],
    ingredients: ["১০০% মরিঙ্গা পাতা পাউডার"],
    usageInstructions: ["১ চা চামচ পানি, জুস বা খাবারের সাথে মিশিয়ে গ্রহণ করুন।"]
  },
  {
    nameBn: "খাঁটি মধু",
    nameEn: "Pure Honey",
    slug: "pure-honey",
    category: categoryBySlug.honey,
    price: 450,
    oldPrice: 540,
    badge: "খাঁটি",
    stockQuantity: 65,
    tags: ["মধু", "honey", "natural"],
    shortDescription: "প্রাকৃতিক মিষ্টি ও অ্যান্টিব্যাকটেরিয়াল গুণসম্পন্ন",
    description: "খাঁটি প্রাকৃতিক মধু, চা, দুধ, রুটি বা স্বাস্থ্যকর রেসিপির জন্য উপযোগী।",
    benefits: ["প্রাকৃতিক মিষ্টি", "এনার্জি সাপোর্ট", "দৈনন্দিন ব্যবহারের জন্য নিরাপদ"],
    ingredients: ["১০০% খাঁটি মধু"],
    usageInstructions: ["প্রতিদিন ১-২ চা চামচ সরাসরি বা খাবারের সাথে গ্রহণ করুন।"]
  }
];

const products = productSeeds.map(product => {
  const discountPercent = Math.max(0, Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100));
  return {
    ...product,
    discountPercent,
    lowStockThreshold: 15,
    isActive: true,
    ratingAvg: 4.8,
    reviewsCount: 24,
    images: [],
    variants: [
      {
        weight: "১০০গ্রাম",
        unitPrice: product.price,
        stockQuantity: Math.floor(product.stockQuantity * 0.5),
        sku: `${product.slug.toUpperCase()}-100`
      },
      {
        weight: "২৫০গ্রাম",
        unitPrice: product.price * 2,
        stockQuantity: Math.floor(product.stockQuantity * 0.3),
        sku: `${product.slug.toUpperCase()}-250`
      },
      {
        weight: "৫০০গ্রাম",
        unitPrice: product.price * 4,
        stockQuantity: Math.floor(product.stockQuantity * 0.2),
        sku: `${product.slug.toUpperCase()}-500`
      }
    ]
  };
});

await Product.insertMany(products);

console.log(`Seed complete: ${categories.length} categories and ${products.length} products inserted.`);
await mongoose.disconnect();
