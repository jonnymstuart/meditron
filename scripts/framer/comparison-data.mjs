// Samsung comparison block on the hub (18 Nov): per-model facts as localized Products fields, so the block is a Framer
// layout (collection list) instead of a rich-text table (Framer forces table cells to min-width 16ch).
// Source: content/seo/hub-ultrasound-2026-11-17.json table.rows (model name in normal case, e.g. "Samsung HERA Z20"). Also sets Hub Order (ryKGzFopm) 1–7 in table order.
// Usage: node scripts/framer/comparison-data.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/hub-ultrasound-2026-11-17.json", import.meta.url)));
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
export const CMP = { model: "Comparison Model", best: "Comparison Best For", format: "Comparison Format", hi: "Comparison Highlights" };
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const c = await f.getCollection("IGaxjVLL3");
  let fields = await c.getFields();
  const missing = Object.values(CMP).filter(n => !fields.some(x => x.name === n));
  if (missing.length && !dry) { await c.addFields(missing.map(name => ({ type: "string", name }))); fields = await c.getFields(); }
  const id = Object.fromEntries(Object.entries(CMP).map(([k, n]) => [k, fields.find(x => x.name === n)?.id]));
  console.log("field ids:", JSON.stringify(id));
  const put = (o) => ({ type: "string", value: o.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: o[l] }])) });
  const items = await c.getItems(); const upd = [];
  C.table.rows.forEach(([slug, name, best, format, hi], n) => {
    const it = items.find(i => i.slug === slug); if (!it) throw new Error("no product " + slug);
    upd.push({ id: it.id, fieldData: { [id.model]: put({ en: name, de: name, fr: name, it: name }), [id.best]: put(best), [id.format]: put(format), [id.hi]: put(hi), ryKGzFopm: { type: "number", value: n + 1 } } });
  });
  console.log("rows:", upd.length);
  if (dry) return;
  await c.addItems(upd);
  for (const it of (await c.getItems()).filter(i => C.table.rows.some(r => r[0] === i.slug)).sort((a, b) => a.fieldData.ryKGzFopm.value - b.fieldData.ryKGzFopm.value))
    console.log(it.fieldData.ryKGzFopm.value, it.slug, "|", it.fieldData[id.best]?.value, "|", it.fieldData[id.best]?.valueByLocale?.[L.de]?.value);
});
