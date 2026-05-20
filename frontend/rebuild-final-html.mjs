import fs from "node:fs";
import path from "node:path";

const indexPath = path.resolve("index.html");

function countBangla(text) {
  return (text.match(/[\u0980-\u09FF]/g) || []).length;
}

function countMojibake(text) {
  return (text.match(/\?\?\?\?|Ã|Â|ðŸ|âœ|â€|ï»¿/g) || []).length;
}

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing active storefront: ${indexPath}`);
}

const html = fs.readFileSync(indexPath, "utf8").replace(/^\uFEFF/, "");
const checks = {
  banglaChars: countBangla(html),
  mojibakeMarkers: countMojibake(html),
  hasApiBase: html.includes("const API_BASE ="),
  hasDynamicProductLoad: html.includes("loadProductsFromApi"),
  hasRealOrderPost: html.includes("apiRequest('/orders'"),
  hasClickableHeroCards: html.includes("navigateHeroProduct"),
  hasPureOriginsBrand: html.includes("PureOrigins")
};

const failed = Object.entries(checks).filter(([key, value]) => {
  if (key === "banglaChars") return value < 500;
  if (key === "mojibakeMarkers") return value > 0;
  return value !== true;
});

if (failed.length) {
  console.error(JSON.stringify(checks, null, 2));
  throw new Error(`Active storefront validation failed: ${failed.map(([key]) => key).join(", ")}`);
}

console.log(JSON.stringify(checks, null, 2));
console.log("Active storefront is final. This script validates only and will not overwrite index.html.");
