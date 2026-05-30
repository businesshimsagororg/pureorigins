import fs from "fs";
import { env } from "../config/env.js";
import { cloudinaryReady, uploadToCloudinary } from "../services/cloudinaryService.js";
import { resolvePublicMediaUrl } from "../utils/mediaUrl.js";

function cleanupFiles(files = []) {
  for (const file of files) {
    if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }
}

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

  if (env.nodeEnv === "production") {
    cleanupFiles(files);
    return res.status(503).json({
      message:
        "Render cannot store uploaded files permanently. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Render, redeploy, then upload again. You can also paste a public image URL (https://...) in the product form.",
      storage: "unavailable"
    });
  }

  const urls = files.map(f => resolvePublicMediaUrl(`/uploads/${f.filename}`));
  return res.status(201).json({
    urls,
    storage: "local",
    note: "Saved for local development only. Use Cloudinary in production."
  });
}
