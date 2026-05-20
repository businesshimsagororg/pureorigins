import fs from "fs";
import { cloudinaryReady, uploadToCloudinary } from "../services/cloudinaryService.js";

export async function uploadProductImages(req, res) {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  if (cloudinaryReady()) {
    const uploads = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file.path);
      uploads.push(result.secure_url);
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
    return res.status(201).json({ urls: uploads, storage: "cloudinary" });
  }

  const urls = files.map(f => `/uploads/${f.filename}`);
  return res.status(201).json({ urls, storage: "local", note: "Cloudinary credentials missing, saved locally" });
}