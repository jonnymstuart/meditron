import { withFramer } from "/home/user/meditron/scripts/framer/lib.mjs";
import fs from "node:fs";
const S = "./.cache";
const D = JSON.parse(fs.readFileSync(`${S}/a456.json`, "utf8"));
const DE = "C9aJRu34X", FR = "rRxiWhpq8";
const IMG = { 4: "flat-3-F8F6EA.jpg", 5: "flat-5-ECDBDB.jpg", 6: "flat-6-EFE8D1.jpg" };
const DATE = { 4: "2026-10-05", 5: "2026-10-07", 6: "2026-10-09" };
const AUTHOR = { "Nikita Müller": "zHjlWWk21", "Dr. Henri Hagenmüller": "ahNvWcqPB", "Christelle Sam-Hine": "gctjF4you" };
const set = (de, fr) => ({ [DE]: { action: "set", value: de }, [FR]: { action: "set", value: fr } });
await withFramer(async (framer) => {
  console.log("branch:", (await framer.agent.getActiveBranch()).id);
  const news = await framer.getCollection("WUGvbtwAI");
  const faq = await framer.getCollection("Y7o7IM_3D");
  const existing = new Map((await news.getItems()).map(i => [i.slug, i.id]));
  const items = [];
  for (const n of [4, 5, 6]) {
    const a = D[n], L = a.langs;
    const bytes = new Uint8Array(fs.readFileSync(`/home/user/meditron/content/images/${IMG[n]}`));
    const img = await framer.uploadImage({ image: { bytes, mimeType: "image/jpeg" }, name: `insights-${a.slug.en}.jpg`, altText: L.en.title });
    console.log("image", n, img.url);
    items.push({ ...(existing.has(a.slug.en) ? { id: existing.get(a.slug.en) } : {}), slug: a.slug.en, draft: false,
      slugByLocale: set(a.slug.de, a.slug.fr),
      fieldData: {
        xusWsRBZC: { type: "string", value: L.en.title, valueByLocale: set(L.de.title, L.fr.title) },
        Hf8x83x3T: { type: "collectionReference", value: "BV_nqtp0t" },
        EYfJm_pqU: { type: "enum", value: "VbiNulsKs" },
        dyaYO3k6o: { type: "image", value: img.url, alt: L.en.title },
        Rzh74yeS0: { type: "string", value: a.intro.en, valueByLocale: set(a.intro.de, a.intro.fr) },
        u4L7POZvL: { type: "formattedText", value: L.en.body, valueByLocale: set(L.de.body, L.fr.body) },
        QGmLkzs2Z: { type: "collectionReference", value: AUTHOR[a.author] },
        VGodevXNq: { type: "date", value: DATE[n] },
      } });
  }
  await news.addItems(items);
  const now = await news.getItems();
  const ids = {};
  for (const n of [4, 5, 6]) { const it = now.find(i => i.slug === D[n].slug.en); ids[n] = it.id;
    console.log("item", n, it.id, it.slug, "draft=", it.draft, "de-slug=", it.slugByLocale[DE]?.value, "date=", it.fieldData.VGodevXNq?.value, "de-title=", it.fieldData.xusWsRBZC?.valueByLocale?.[DE]?.status, "img=", !!it.fieldData.dyaYO3k6o?.value); }
  const haveFaq = new Set((await faq.getItems()).map(r => r.slug));
  const rows = [];
  for (const n of [4, 5, 6]) D[n].langs.en.faq.forEach(([q, a], i) => {
    const slug = `${D[n].slug.en}-${i + 1}`.slice(0, 80); if (haveFaq.has(slug)) return;
    const dq = D[n].langs.de.faq[i], fq = D[n].langs.fr.faq[i];
    rows.push({ slug, fieldData: {
      vkOdkDocK: { type: "string", value: q, valueByLocale: set(dq[0], fq[0]) },
      hF3or4UG4: { type: "string", value: a, valueByLocale: set(dq[1], fq[1]) },
      l059MJo6U: { type: "collectionReference", value: ids[n] },
      BJHsF4nA7: { type: "number", value: i + 1 } } });
  });
  if (rows.length) await faq.addItems(rows);
  const check = (await faq.getItems()).filter(r => /^(samsung-hera-z20-or-v8|mobile-or-stationary|first-90-days)/.test(r.slug));
  console.log("faq rows added", rows.length, "now", check.length, "sample de:", check[0]?.fieldData.vkOdkDocK?.valueByLocale?.[DE]?.value);
  const p = await framer.agent.publish({ action: "preview" });
  console.log("preview:", p.status, "errors:", JSON.stringify(p.errors), "warnings:", JSON.stringify(p.warnings).slice(0, 300), "changes:", p.changes?.length);
  if (!p.confirmationHash || p.errors?.length) return;
  const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: p.confirmationHash });
  console.log("staging:", c.status, c.message, c.urls?.staging);
});
