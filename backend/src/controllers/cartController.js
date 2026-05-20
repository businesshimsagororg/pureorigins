import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export async function getCart(req, res) {
  let cart = await Cart.findOne({ user: req.auth.sub }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: req.auth.sub, items: [] });
  res.json({ cart });
}

export async function addCartItem(req, res) {
  const { productId, variantWeight, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) return res.status(404).json({ message: "Product not found" });
  const cart = await Cart.findOneAndUpdate({ user: req.auth.sub }, {}, { upsert: true, new: true });
  const idx = cart.items.findIndex(i => i.product.toString() === productId && i.variantWeight === variantWeight);
  if (idx >= 0) cart.items[idx].quantity += Number(quantity || 1);
  else cart.items.push({ product: productId, variantWeight, quantity: Number(quantity || 1) });
  await cart.save();
  res.status(201).json({ cart });
}

export async function updateCartItem(req, res) {
  const cart = await Cart.findOne({ user: req.auth.sub });
  const item = cart?.items.id(req.params.id);
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  item.quantity = Math.max(1, Number(req.body.quantity || 1));
  await cart.save();
  res.json({ cart });
}

export async function deleteCartItem(req, res) {
  const cart = await Cart.findOne({ user: req.auth.sub });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items.pull(req.params.id);
  await cart.save();
  res.json({ cart });
}