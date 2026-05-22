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
    shortDescription: "প্রিমিয়াম মানের সতেজ ও পরিষ্কার কালোজিরা",
    description: "Hadith-এ কালোজিরার বিশেষ মর্যাদার কথা এসেছে। PureOrigins-এর কালোজিরা সরাসরি বাছাইকৃত কৃষক ও বিশ্বস্ত সরবরাহকারীদের কাছ থেকে সংগ্রহ করা হয় এবং সম্পূর্ণ হাইজিনিক পরিবেশে ধুলাবালি মুক্ত করে প্যাকেটজাত করা হয়। প্রতিটি দানায় আছে প্রাকৃতিক পুষ্টিগুণ, সুগন্ধ ও দৈনন্দিন খাদ্যাভ্যাসে ব্যবহারযোগ্যতা।",
    benefits: ["শরীরের স্বাভাবিক রোগ প্রতিরোধ ক্ষমতাকে সহায়তা করতে পারে", "হজমের স্বাভাবিক কার্যক্রমে সহায়ক", "প্রাকৃতিক অ্যান্টিঅক্সিডেন্টের উৎস", "ত্বক ও চুলের যত্নের ঘরোয়া রুটিনে ব্যবহারযোগ্য"],
    ingredients: ["১০০% খাঁটি কালোজিরা"],
    usageInstructions: ["প্রতিদিন সকালে অল্প পরিমাণ কালোজিরা চিবিয়ে খেতে পারেন অথবা মধুর সাথে মিশিয়ে সেবন করতে পারেন। গর্ভাবস্থা, দীর্ঘমেয়াদি রোগ বা নিয়মিত ওষুধ চললে চিকিৎসকের পরামর্শ নিন।"]
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
    shortDescription: "প্রিমিয়াম অর্গানিক চিয়া সিড - আপনার প্রতিদিনের হেলথ পার্টনার",
    description: "ওজন ব্যবস্থাপনা, হাইড্রেশন এবং দৈনন্দিন পুষ্টির জন্য চিয়া সিড বর্তমান সময়ের জনপ্রিয় সুপারফুড। PureOrigins আপনাদের জন্য নিয়ে এসেছে প্রিমিয়াম কোয়ালিটির পরিষ্কার চিয়া সিড, যা ফাইবার, ওমেগা-৩ ফ্যাটি এসিড, উদ্ভিজ্জ প্রোটিন এবং অ্যান্টিঅক্সিডেন্টে সমৃদ্ধ।",
    benefits: ["উচ্চ ফাইবার দীর্ঘক্ষণ পেট ভরা রাখতে সহায়ক", "ওমেগা-৩ ফ্যাটি এসিড হার্ট-ফ্রেন্ডলি খাদ্যাভ্যাসে সহায়তা করে", "দৈনন্দিন এনার্জি ও সতেজতা বজায় রাখতে সহায়ক", "ক্যালসিয়াম ও মিনারেলের উৎস"],
    ingredients: ["১০০% চিয়া সিড"],
    usageInstructions: ["১ গ্লাস পানিতে ১-২ চা চামচ চিয়া সিড ৩০ মিনিট ভিজিয়ে রেখে পান করুন। চাইলে লেবুর রস, মধু বা ফলের জুসের সাথে মিশিয়ে নিতে পারেন।"]
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
    shortDescription: "পুষ্টিগুণে ভরপুর প্রিমিয়াম ফ্ল্যাক্স সিড বা তিসির বীজ",
    description: "হৃদয়-স্বাস্থ্যকর খাদ্যাভ্যাস, ফাইবার সাপোর্ট এবং ব্যালান্সড লাইফস্টাইলের জন্য ফ্ল্যাক্স সিড বা তিসির বীজ একটি চমৎকার প্রাকৃতিক উপাদান। PureOrigins-এর ফ্ল্যাক্স সিড সম্পূর্ণ প্রাকৃতিকভাবে সংগ্রহ করা এবং পরিষ্কারভাবে প্যাকেজ করা। এতে রয়েছে ডায়েটারি ফাইবার, ওমেগা-৩ ফ্যাটি এসিড এবং লিগনান।",
    benefits: ["উচ্চ ফাইবার হজমের স্বাভাবিক কার্যক্রমে সহায়ক", "হার্ট-ফ্রেন্ডলি খাদ্যাভ্যাসে সহায়ক", "ওমেগা-৩ ফ্যাটি এসিডের উদ্ভিজ্জ উৎস", "ত্বকের স্বাভাবিক আর্দ্রতা ও পুষ্টিতে সহায়তা করতে পারে"],
    ingredients: ["১০০% ফ্ল্যাক্স সিড"],
    usageInstructions: ["ফ্ল্যাক্স সিড হালকা ভেজে গুঁড়ো করে সালাদ, দই, স্মুদি বা ওটসের সাথে মিশিয়ে খেতে পারেন। পর্যাপ্ত পানি পান করুন।"]
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
    shortDescription: "শতভাগ প্রাকৃতিক ও সতেজ মরিঙ্গা পাউডার",
    description: "সজিনা পাতাকে অনেকেই পুষ্টিগুণের জন্য 'মিরাকেল ট্রি' নামে চেনেন। PureOrigins-এর মরিঙ্গা পাউডার কচি ও সতেজ সজিনা পাতা ছায়ায় শুকিয়ে স্বাস্থ্যসম্মত উপায়ে গুঁড়ো করা হয়, যাতে প্রাকৃতিক রং, গন্ধ ও পুষ্টিগুণ ভালোভাবে বজায় থাকে।",
    benefits: ["প্রাকৃতিক ভিটামিন ও মিনারেলের উৎস", "দৈনন্দিন ক্লান্তি কমিয়ে সতেজ খাদ্যাভ্যাসে সহায়তা করতে পারে", "অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ", "সুষম খাদ্যতালিকায় সবুজ পুষ্টি যোগ করে"],
    ingredients: ["১০০% মরিঙ্গা পাতা পাউডার"],
    usageInstructions: ["১ গ্লাস কুসুম গরম পানি, জুস বা স্মুদিতে ১ চা চামচ মরিঙ্গা পাউডার মিশিয়ে পান করতে পারেন। স্বাদের জন্য সামান্য মধু যোগ করা যায়।"]
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
