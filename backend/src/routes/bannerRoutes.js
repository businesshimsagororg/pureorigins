import { Router } from "express";
import { adminCreateBanner, adminDeleteBanner, adminListBanners, adminUpdateBanner, listBanners } from "../controllers/bannerController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/", listBanners);
r.get("/admin/banners", authRequired, adminRequired, adminListBanners);
r.post("/admin/banners", authRequired, adminRequired, adminCreateBanner);
r.put("/admin/banners/:id", authRequired, adminRequired, adminUpdateBanner);
r.delete("/admin/banners/:id", authRequired, adminRequired, adminDeleteBanner);

export default r;