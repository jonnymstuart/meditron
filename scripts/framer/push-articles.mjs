// Push Insights articles built by build-articles.py (.cache/aN.json) into the News & Events collection:
// EN as the default value, DE/FR/IT via valueByLocale and slugByLocale, FAQ rows in the FAQ collection, hero tile.
// Then publishes to staging. Production deploy is a separate step (publish.mjs or --production).
// German: these are first drafts of NEW articles (allowed); existing German is never touched.
// Usage: node push-articles.mjs 7 8 9 [--draft] [--production]
import fs from "node:fs";
import { withFramer } from "./lib.mjs";

const nums = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number);
const asDraft = process.argv.includes("--draft"), toProd = process.argv.includes("--production");
if (!nums.length) throw new Error("give article numbers");
const LOC = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const AUTHOR = { "Nikita Müller": "zHjlWWk21", "Dr. Henri Hagenmüller": "ahNvWcqPB", "Christelle Sam-Hine": "gctjF4you" };
const byLoc = (a, key) => Object.fromEntries(Object.entries(LOC).filter(([l]) => a.langs[l]).map(([l, id]) => [id, { action: "set", value: key(a.langs[l], l) }]));

await withFramer(async (framer) => {
  const news = await framer.getCollection("WUGvbtwAI"), faq = await framer.getCollection("Y7o7IM_3D");
  const existing = new Map((await news.getItems()).map((i) => [i.slug, i.id]));
  const items = [], arts = [];
  for (const n of nums) {
    const a = JSON.parse(fs.readFileSync(new URL(`./.cache/a${n}.json`, import.meta.url), "utf8")); arts.push(a);
    const bytes = new Uint8Array(fs.readFileSync(`/home/user/meditron/content/images/${a.image}`));
    const img = await framer.uploadImage({ image: { bytes, mimeType: "image/jpeg" }, name: `insights-${a.slug.en}.jpg`, altText: a.langs.en.title });
    items.push({ ...(existing.has(a.slug.en) ? { id: existing.get(a.slug.en) } : {}), slug: a.slug.en, draft: asDraft,
      slugByLocale: Object.fromEntries(Object.entries(LOC).filter(([l]) => a.slug[l]).map(([l, id]) => [id, { action: "set", value: a.slug[l] }])),
      fieldData: {
        xusWsRBZC: { type: "string", value: a.langs.en.title, valueByLocale: byLoc(a, (x) => x.title) },
        EYfJm_pqU: { type: "enum", value: "VbiNulsKs" },
        dyaYO3k6o: { type: "image", value: img.url, alt: a.langs.en.title },
        Rzh74yeS0: { type: "string", value: a.langs.en.intro, valueByLocale: byLoc(a, (x) => x.intro) },
        u4L7POZvL: { type: "formattedText", value: a.langs.en.body, valueByLocale: byLoc(a, (x) => x.body) },
        QGmLkzs2Z: { type: "collectionReference", value: AUTHOR[a.author] },
        VGodevXNq: { type: "date", value: a.date },
      } });
  }
  await news.addItems(items).catch((e) => console.warn("addItems threw after writing (known):", e.message));
  const now = await news.getItems(); const ids = {};
  for (const a of arts) { const it = now.find((i) => i.slug === a.slug.en); ids[a.n] = it.id;
    console.log(`#${a.n} ${it.id} ${it.slug} draft=${it.draft} date=${it.fieldData.VGodevXNq?.value} de-slug=${it.slugByLocale?.[LOC.de]?.value} it-title=${it.fieldData.xusWsRBZC?.valueByLocale?.[LOC.it]?.status} img=${!!it.fieldData.dyaYO3k6o?.value}`); }
  const have = new Set((await faq.getItems()).map((r) => r.slug)); const rows = [];
  for (const a of arts) a.langs.en.faq.forEach(([q, ans], i) => { const slug = `${a.slug.en}-${i + 1}`.slice(0, 80); if (have.has(slug)) return;
    rows.push({ slug, fieldData: { vkOdkDocK: { type: "string", value: q, valueByLocale: byLoc(a, (x) => x.faq[i][0]) }, hF3or4UG4: { type: "string", value: ans, valueByLocale: byLoc(a, (x) => x.faq[i][1]) },
      l059MJo6U: { type: "collectionReference", value: ids[a.n] }, BJHsF4nA7: { type: "number", value: i + 1 } } }); });
  if (rows.length) await faq.addItems(rows).catch((e) => console.warn("faq addItems threw after writing (known):", e.message));
  console.log("faq rows added:", rows.length);
  const p = await framer.agent.publish({ action: "preview" });
  console.log("preview:", p.status, "target:", p.publishTarget, "errors:", JSON.stringify(p.errors), "changes:", p.changesCount);
  if (p.publishTarget !== "staging" || p.errors?.length) return;
  const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: p.confirmationHash });
  console.log("staging:", c.status, c.message);
  if (toProd) { const d = await framer.agent.publish({ action: "deploy_to_production" }); console.log("production:", JSON.stringify(d).slice(0, 300)); }
});
