import fs from "fs";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { ensureAdminSeed } from "./controllers/authController.js";
import { startAbandonedCartJob } from "./jobs/abandonedCartJob.js";

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

await connectDB(env.mongodbUri);
await ensureAdminSeed();
startAbandonedCartJob();

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});