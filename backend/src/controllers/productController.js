import slugify from "slugify";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

function serializeProduct(product) {
  const value = product.toObject ? product.toObject() : product;
  const variants = Array.isArray(value.variants) ? value.variants : [];
  return {
    ...value,
    variantPrices: Object.fromEntries(
      variants
        .filter(variant => variant.weight && variant.unitPrice != null)
        .map(variant => [variant.weight, Number(variant.unitPrice)])
    )
  };
}

export async function listProducts(req, res) {
  const { q, category, minPrice, maxPrice, inStock, sort } = req.query;
  const filter = { isActive: true };
  if (q) filter.$or = [
    { nameBn: { $regex: q, $options: "i" } },
    { nameEn: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } },
    { tags: { $in: [new RegExp(q, "i")] } }
  ];
  if (category) {
    const c = await Category.findOne({ slug: category });
    filter.category = c?._id;
  }
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  if (inStock === "true") filter.stockQuantity = { $gt: 0 };

  let query = Product.find(filter).populate("category", "nameBn nameEn slug");
  if (sort === "priceAsc") query = query.sort({ price: 1 });
  else if (sort === "priceDesc") query = query.sort({ price: -1 });
  else if (sort === "rating") query = query.sort({ ratingAvg: -1 });
  else query = query.sort({ createdAt: -1 });

  const products = await query;
  res.json({ products: products.map(serializeProduct) });
}

export async function adminListProducts(req, res) {
  const { q, status } = req.query;
  const filter = {};
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;
  if (q) filter.$or = [
    { nameBn: { $regex: q, $options: "i" } },
    { nameEn: { $regex: q, $options: "i" } },
    { slug: { $regex: q, $options: "i" } },
    { tags: { $in: [new RegExp(q, "i")] } }
  ];

  const products = await Product.find(filter).populate("category", "nameBn nameEn slug").sort({ createdAt: -1 });
  res.json({ products: products.map(serializeProduct) });
}

export async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate("category", "nameBn nameEn slug");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product: serializeProduct(product) });
}

export async function createProduct(req, res) {
  const body = req.body;
  body.slug = body.slug || slugify(body.nameEn || body.nameBn, { lower: true, strict: true });
  const p = await Product.create(body);
  res.status(201).json({ product: p });
}

export async function updateProduct(req, res) {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json({ product: p });
}

export async function deleteProduct(req, res) {
  const p = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product archived" });
}
