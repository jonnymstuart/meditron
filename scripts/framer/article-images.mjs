// Put real Samsung product photos (Products Main Image, already in the project library) on every other Insights article.
// Usage: node scripts/framer/article-images.mjs [--dry] [--publish]
import { withFramer } from "./lib.mjs";
const DRY = process.argv.includes("--dry"), PUBLISH = process.argv.includes("--publish");
const MAP = { "which-samsung-ultrasound-system-for-my-practice": "samsung-v8", "new-or-pre-owned-ultrasound-system": "samsung-v6", "mobile-or-stationary-ultrasound-system": "samsung-v5",
  "samsung-ultrasound-service-training-warranty-switzerland": "samsung-r20", "buying-an-ultrasound-machine-checklist-gp-practice": "samsung-v7", "ultrasound-probes-gynaecology-practice": "samsung-hera-z20" };
await withFramer(async (framer) => {
  const products = await framer.getCollection("IGaxjVLL3"); const pItems = await products.getItems(); const img = Object.fromEntries(pItems.map((p) => [p.slug, p.fieldData.G8s0uckMp?.value]));
  const news = await framer.getCollection("WUGvbtwAI"); const items = await news.getItems(); const updates = [];
  for (const [slug, prod] of Object.entries(MAP)) { const it = items.find((i) => i.slug === slug); const src = img[prod]; if (!it || !src?.url) { console.warn("skip", slug, !!it, !!src?.url); continue; }
    const title = it.fieldData.xusWsRBZC?.value || slug; console.log(`${slug}: ${it.fieldData.dyaYO3k6o?.value?.url?.split("/").pop()} → ${prod} ${src.url.split("/").pop()}`);
    updates.push({ id: it.id, fieldData: { dyaYO3k6o: { type: "image", value: src.url, alt: title } } }); }
  if (DRY) { console.log("DRY RUN,", updates.length, "updates"); return; }
  await news.addItems(updates); const after = await news.getItems(); for (const u of updates) { const it = after.find((i) => i.id === u.id); console.log("now:", it.slug.slice(0, 40), it.fieldData.dyaYO3k6o?.value?.url?.split("/").pop(), "alt:", (it.fieldData.dyaYO3k6o?.value?.alt || "").slice(0, 40)); }
  if (PUBLISH) { const pv = await framer.agent.publish({ action: "preview" }); if (pv.publishTarget === "staging" && !pv.errors?.length) { const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: pv.confirmationHash }); console.log("staging:", c.message); } else console.log("preview:", JSON.stringify(pv).slice(0, 400)); }
});
