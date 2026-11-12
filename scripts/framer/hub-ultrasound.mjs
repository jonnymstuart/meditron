// Samsung hub: replaces the range list in the SEO intro with a comparison table and adds FAQ rows 6-10, 4 locales.
// Content: content/seo/hub-ultrasound-2026-11-12.json. Usage: node scripts/framer/hub-ultrasound.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/hub-ultrasound-2026-11-12.json", import.meta.url)));
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const table = (l) => `<h3 dir="auto">${esc(C.table.heading[l])}</h3><table><thead><tr>${C.table.cols[l].map(c => `<th><p>${esc(c)}</p></th>`).join("")}</tr></thead><tbody>${C.table.rows.map(([m, u, h]) => `<tr><td><p><strong>Samsung ${m}</strong></p></td><td><p>${esc(u[l])}</p></td><td><p>${esc(h[l])}</p></td></tr>`).join("")}</tbody></table>`;
await withFramer(async (f) => {
  const hc = await f.getCollection("gZyqCZdng"); const hub = (await hc.getItems()).find(h => h.slug === "ultrasound");
  const v = hub.fieldData.yv1RziKgE; const intro = {};
  for (const [l, id] of Object.entries(L)) {
    const cur = id ? v.valueByLocale?.[id]?.value : v.value;
    // The first <h3> + <ul> after the opening paragraph is the range list.
    const m = cur.match(/<h3[^>]*>[^<]*<\/h3><ul[^>]*>[\s\S]*?<\/ul>/);
    if (!m) throw new Error("range list not found in " + l);
    intro[l] = cur.includes("<table") ? cur : cur.replace(m[0], table(l));
  }
  const faq = await f.getCollection("Y7o7IM_3D"); const rows = (await faq.getItems()).filter(r => [hub.id, hub.slug].includes(r.fieldData.yKY34FXOp?.value));
  const put = (o) => ({ type: "string", value: o.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: o[l] }])) });
  const add = rows.length >= 10 ? [] : C.faq.map((r, k) => ({ slug: `ultrasound-${k + 6}`, fieldData: { vkOdkDocK: put(r.q), hF3or4UG4: put(r.a), yKY34FXOp: { type: "collectionReference", value: hub.id }, BJHsF4nA7: { type: "number", value: k + 6 } } }));
  console.log("existing hub FAQ rows:", rows.length, "| adding:", add.length, "| EN intro chars:", v.value.length, "->", intro.en.length);
  if (process.argv.includes("--dry")) { console.log(table("de").slice(0, 400)); return; }
  await hc.addItems([{ id: hub.id, fieldData: { yv1RziKgE: { type: "formattedText", value: intro.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: intro[l] }])) } } }]);
  if (add.length) await faq.addItems(add);
  const back = (await hc.getItems()).find(h => h.slug === "ultrasound").fieldData.yv1RziKgE;
  console.log("table kept after write:", Object.entries(L).map(([l, id]) => l + ":" + ((id ? back.valueByLocale?.[id]?.value : back.value) || "").includes("<table")).join(" "));
  console.log("hub FAQ rows now:", (await faq.getItems()).filter(r => [hub.id, hub.slug].includes(r.fieldData.yKY34FXOp?.value)).length);
  console.log("EN table as stored:", back.value.match(/<table[\s\S]{0,300}/)?.[0]);
});
