import fs from "fs";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { ensureAdminSeed } from "./controllers/authController.js";
import { startAbandonedCartJob } from "./jobs/abandonedCartJob.js";
import { upsertNewProducts } from "../scripts/upsert-new-products.js";

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

await connectDB(env.mongodbUri);
await ensureAdminSeed();
await upsertNewProducts().catch((error) => console.warn("Product upsert skipped:", error.message));
startAbandonedCartJob();

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
