import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadProductImages } from "../controllers/uploadController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const r = Router();
r.post("/product-images", authRequired, adminRequired, upload.array("images", 8), uploadProductImages);

export default r;