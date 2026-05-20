import Banner from "../models/Banner.js";

export async function listBanners(req, res) { const now = new Date(); const banners = await Banner.find({ isActive: true, $or: [{ startsAt: null }, { startsAt: { $lte: now } }] }).sort({ createdAt: -1 }); res.json({ banners }); }
export async function adminCreateBanner(req, res) { const banner = await Banner.create(req.body); res.status(201).json({ banner }); }
export async function adminListBanners(req, res) { const banners = await Banner.find().sort({ createdAt: -1 }); res.json({ banners }); }
export async function adminUpdateBanner(req, res) { const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ banner }); }
export async function adminDeleteBanner(req, res) { await Banner.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); }