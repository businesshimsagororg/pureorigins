import dotenv from "dotenv";
import mongoose from "mongoose";
import { pathToFileURL } from "url";
import Category from "../src/models/Category.js";
import Coupon from "../src/models/Coupon.js";
import Product from "../src/models/Product.js";

dotenv.config();

const categorySeeds = [
  {
    nameBn: "সিডস",
    nameEn: "Seeds",
    slug: "seeds",
    description: "প্রাকৃতিক বীজজাত পণ্য",
    isActive: true
  },
  {
    nameBn: "পাউডার",
    nameEn: "Powders",
    slug: "powders",
    description: "প্রাকৃতিক সুপারফুড পাউডার",
    isActive: true
  }
];

const buildProducts = (categoryBySlug) => [
  {
    nameBn: "তোকমা দানা",
    nameEn: "Tukma / Basil Seeds",
    slug: "tukma-seeds",
    description: "তোকমা দানা শরবত, ফালুদা, দুধ বা পানীয়তে ভিজিয়ে খাওয়ার জন্য জনপ্রিয় একটি ফাইবারসমৃদ্ধ প্রাকৃতিক উপাদান। PureOrigins-এর তোকমা দানা পরিষ্কারভাবে বাছাই করা, ধুলাবালি মুক্ত এবং দৈনন্দিন স্বাস্থ্যকর রুটিনে সহজে ব্যবহারযোগ্য।",
    shortDescription: "শরবত, ফালুদা ও পানীয়তে ফাইবারসমৃদ্ধ শীতল দানা",
    benefits: [
      "ফাইবারসমৃদ্ধ হওয়ায় পেট ভরা রাখতে সহায়ক",
      "গরমের দিনে শরবত ও পানীয়তে আরামদায়ক সংযোজন",
      "দৈনন্দিন স্বাস্থ্যকর রুটিনে সহজে ব্যবহারযোগ্য",
      "ফালুদা, দুধ ও স্মুদিতে সুন্দর টেক্সচার যোগ করে"
    ],
    ingredients: ["১০০% পরিষ্কার তোকমা দানা (Basil Seeds)"],
    usageInstructions: [
      "১-২ চা চামচ তোকমা দানা ১৫-২০ মিনিট পানিতে ভিজিয়ে নিন।",
      "শরবত, দুধ, ফালুদা বা স্মুদির সাথে মিশিয়ে পরিবেশন করুন।"
    ],
    price: 190,
    oldPrice: 240,
    discountPercent: 21,
    category: categoryBySlug.seeds,
    tags: ["তোকমা", "tukma", "basil seeds", "fiber", "falooda", "শরবত"],
    badge: "ফাইবার রিচ",
    stockQuantity: 85,
    lowStockThreshold: 15,
    isActive: true,
    ratingAvg: 4.7,
    reviewsCount: 54,
    variants: [
      { weight: "১০০গ্রাম", unitPrice: 190, stockQuantity: 43, sku: "TUKMA-SEEDS-100" },
      { weight: "২৫০গ্রাম", unitPrice: 380, stockQuantity: 26, sku: "TUKMA-SEEDS-250" },
      { weight: "৫০০গ্রাম", unitPrice: 760, stockQuantity: 17, sku: "TUKMA-SEEDS-500" }
    ]
  },
  {
    nameBn: "ইসবগুল ভুসি",
    nameEn: "Psyllium Husk (Isabgol Bhusi)",
    slug: "isabgol-bhusi",
    description: "ইসবগুল ভুসি একটি পরিচিত প্রাকৃতিক ফাইবার সাপোর্ট, যা পানি, দুধ বা জুসের সাথে সহজে মিশিয়ে খাওয়া যায়। PureOrigins-এর ইসবগুল ভুসি হালকা, পরিষ্কার এবং দৈনন্দিন রুটিনে ব্যবহারযোগ্যভাবে প্যাক করা হয়।",
    shortDescription: "প্রাকৃতিক ফাইবার সাপোর্ট, হালকা ও সহজে মিশে যায়",
    benefits: [
      "প্রাকৃতিক ফাইবারের সহজ উৎস",
      "দৈনন্দিন রুটিনে হালকা ও ব্যবহারবান্ধব",
      "পানি, দুধ বা জুসের সাথে দ্রুত মিশে যায়",
      "স্বাস্থ্যকর খাদ্যাভ্যাসে সহায়ক সংযোজন"
    ],
    ingredients: ["১০০% ইসবগুল ভুসি (Psyllium Husk)"],
    usageInstructions: [
      "১-২ চা চামচ ইসবগুল ভুসি এক গ্লাস পানিতে মিশিয়ে দ্রুত পান করুন।",
      "ব্যবহারের পর পর্যাপ্ত পানি পান করা ভালো।"
    ],
    price: 300,
    oldPrice: 360,
    discountPercent: 17,
    category: categoryBySlug.powders,
    tags: ["ইসবগুল", "ইসুবগুল", "isabgol", "psyllium husk", "fiber", "ভুসি"],
    badge: "ফাইবার",
    stockQuantity: 70,
    lowStockThreshold: 15,
    isActive: true,
    ratingAvg: 4.8,
    reviewsCount: 61,
    variants: [
      { weight: "১০০গ্রাম", unitPrice: 300, stockQuantity: 35, sku: "ISABGOL-BHUSI-100" },
      { weight: "২৫০গ্রাম", unitPrice: 600, stockQuantity: 21, sku: "ISABGOL-BHUSI-250" },
      { weight: "৫০০গ্রাম", unitPrice: 1200, stockQuantity: 14, sku: "ISABGOL-BHUSI-500" }
    ]
  }
];

export async function upsertNewProducts() {
  await Coupon.findOneAndUpdate(
    { code: "PURE15" },
    {
      $set: {
        code: "PURE15",
        type: "percent",
        value: 15,
        expiryDate: new Date("2030-12-31T23:59:59.999Z"),
        usageLimit: 0,
        perUserUsageLimit: 1,
        minimumOrderAmount: 0,
        isActive: true
      }
    },
    { upsert: true, new: true, runValidators: true }
  );

  for (const category of categorySeeds) {
    await Category.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true, new: true, runValidators: true }
    );
  }

  const categories = await Category.find({ slug: { $in: categorySeeds.map((category) => category.slug) } });
  const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category._id]));

  for (const product of buildProducts(categoryBySlug)) {
    const result = await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        $set: product,
        $setOnInsert: { images: [] }
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`Upserted ${result.nameBn} (${result.slug})`);
  }
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await upsertNewProducts();

  await mongoose.disconnect();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
}
