// Samsung hub redesign (17 Nov): adds five Solutions rich-text fields for the two-column rows and fills the
// ultrasound hub in EN/DE/FR/IT from content/seo/hub-ultrasound-2026-11-17.json. Links are localized
// (locale prefix + the article's localized slug). Also rewrites the comparison table with model links and
// a Format column, and trims the SEO intro to H2 + paragraph (Why / Price move to their own fields).
// Usage: node scripts/framer/hub-redesign-content.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/hub-ultrasound-2026-11-17.json", import.meta.url)));
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const PFX = { en: "", de: "/de", fr: "/fr", it: "/it" };
export const NEW = { why: "Intro Side", guideIntro: "Guide Intro", guide: "Guide", priceIntro: "Price Intro", price: "Price Options" };
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  // Localized article slugs
  const news = await f.getCollection("WUGvbtwAI"); const slug = {};
  for (const i of await news.getItems()) for (const l of Object.keys(L)) slug[`${l}|${i.slug}`] = l === "en" ? i.slug : (i.slugByLocale?.[L[l]]?.value || i.slug);
  const fill = (html, l) => html.replace(/\{p\}/g, PFX[l]).replace(/\{a:([^}]+)\}/g, (_, s) => { const v = slug[`${l}|${s}`]; if (!v) throw new Error(`no article ${s}`); return v; });
  const table = l => `<h3>${esc(C.table.heading[l])}</h3><table><thead><tr>${C.table.cols[l].map(c => `<th><p>${esc(c)}</p></th>`).join("")}</tr></thead><tbody>${
    C.table.rows.map(([s, name, best, fmt, hi]) => `<tr><td><p><a href="${PFX[l]}/products/${s}">${esc(name)}</a></p></td><td><p>${esc(best[l])}</p></td><td><p>${esc(fmt[l])}</p></td><td><p>${esc(hi[l])}</p></td></tr>`).join("")}</tbody></table>`;
  // Fields
  const sol = await f.getCollection("gZyqCZdng");
  let fields = await sol.getFields();
  const missing = Object.values(NEW).filter(n => !fields.some(x => x.name === n));
  if (missing.length && !dry) { await sol.addFields(missing.map(name => ({ type: "formattedText", name }))); fields = await sol.getFields(); }
  const id = Object.fromEntries(Object.entries(NEW).map(([k, n]) => [k, fields.find(x => x.name === n)?.id ?? `(new:${n})`]));
  console.log("field ids:", JSON.stringify(id));
  const put = (get) => ({ type: "formattedText", value: get("en"), valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: get(l) }])) });
  const fd = {
    yv1RziKgE: put(l => C.intro[l]),
    Lwudih0L8: put(l => table(l)),
    [id.why]: put(l => C.why[l]),
    [id.guideIntro]: put(l => fill(C.guideIntro[l], l)),
    [id.guide]: put(l => fill(C.guide[l], l)),
    [id.priceIntro]: put(l => C.priceIntro[l]),
    [id.price]: put(l => fill(C.price[l], l)),
  };
  if (/<(strong|b)[\s>]/.test(JSON.stringify(fd))) throw new Error("bold found");
  console.log("DE guide sample:", fd[id.guide].valueByLocale[L.de].value.slice(0, 300));
  console.log("FR table sample:", fd.Lwudih0L8.valueByLocale[L.fr].value.slice(0, 300));
  if (dry) return;
  const hub = (await sol.getItems()).find(i => i.slug === "ultrasound");
  await sol.addItems([{ id: hub.id, fieldData: fd }]);
  const back = (await sol.getItems()).find(i => i.slug === "ultrasound").fieldData;
  for (const [k, fid] of Object.entries({ intro: "yv1RziKgE", table: "Lwudih0L8", ...id }))
    console.log(k.padEnd(10), Object.keys(L).map(l => `${l}:${String((L[l] ? back[fid]?.valueByLocale?.[L[l]]?.value : back[fid]?.value) ?? "").length}`).join(" "));
});
