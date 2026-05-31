import express from "express";
import HeroItem from "../models/HeroItem.js";

const router = express.Router();

// Public: Get all active hero items, sorted by sortOrder
router.get("/hero", async (req, res) => {
  try {
    const items = await HeroItem.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all hero items
router.get("/admin/hero", async (req, res) => {
  try {
    const items = await HeroItem.find().sort({ sortOrder: 1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create hero item
router.post("/admin/hero", async (req, res) => {
  try {
    const item = new HeroItem(req.body);
    await item.save();
    res.status(201).json({ item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Update hero item
router.put("/admin/hero/:id", async (req, res) => {
  try {
    const item = await HeroItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Delete hero item
router.delete("/admin/hero/:id", async (req, res) => {
  try {
    const item = await HeroItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
