// Titles <= 60, descriptions <= 155 and H1 for hubs and all products, 4 locales.
// Hand-written values: content/seo/meta-2026-11-12.json (Samsung hub + seven Samsung models). Everything else by rule.
// Usage: node scripts/framer/optimise-meta.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/meta-2026-11-12.json", import.meta.url)));
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const get = (v, l) => ((L[l] ? v?.valueByLocale?.[L[l]]?.value : v?.value) ?? "").trim();
const put = (o) => ({ type: "string", value: o.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: o[l] }])) });
const cutDesc = (s) => { s = s.replace(/\s+/g, " ").trim(); if (s.length <= 155) return s;
  const m = s.slice(0, 155).match(/^.*[.!?](?=\s|$)/); if (m && m[0].length >= 80) return m[0];
  return s.slice(0, 152).replace(/\s+\S*$/, "").replace(/[,;:–-]$/, "") + "…"; };
const fitTitle = (cur, name, l) => { if (cur && cur.length <= 60 && !(l === "it" && cur.includes("Meditron Switzerland"))) return cur;
  for (const t of [`${name} | ${C.suffix[l]}`, `${name} | Meditron`]) if (t.length <= 60) return t; return name.slice(0, 60); };
const H1F = "qFsZD3PuD";
await withFramer(async (f) => {
  const changes = { hubs: 0, titles: 0, descriptions: 0, h1: 0 };
  // Hubs
  const hc = await f.getCollection("gZyqCZdng"); const hubUpd = [];
  for (const h of await hc.getItems()) {
    const fd = h.fieldData, H = C.hubs[h.slug] || {}; const t = {}, d = {};
    for (const l of Object.keys(L)) { t[l] = H.title?.[l] ?? get(fd.fM1J_4KGB, l); d[l] = H.description?.[l] ?? cutDesc(get(fd.YuxfDRp5D, l)); if (t[l].length > 60) t[l] = t[l].replace(/ \| Meditron$/, "").slice(0, 49) + " | Meditron"; }
    hubUpd.push({ id: h.id, fieldData: { fM1J_4KGB: put(t), YuxfDRp5D: put(d) } }); changes.hubs++;
  }
  // Products
  const pc = await f.getCollection("IGaxjVLL3"); const upd = []; const items = await pc.getItems();
  for (const i of items) {
    const fd = i.fieldData, M = C.models[i.slug]; const t = {}, d = {}, h1 = {};
    for (const l of Object.keys(L)) {
      const name = get(fd.krFC3FLEV, l) || get(fd.krFC3FLEV, "en");
      if (M) { t[l] = C.modelTitle[l].replace("{m}", M.name); d[l] = M.description[l]; h1[l] = C.modelH1[l].replace("{m}", M.name); }
      else { t[l] = fitTitle(get(fd.yNO0L700R, l), name, l); d[l] = cutDesc(get(fd.Fw8KRORIm, l) || get(fd.VKK1rLOkt, l).split(/(?<=[.!?])\s/)[0] || ""); h1[l] = name; }
      if (t[l] !== get(fd.yNO0L700R, l)) changes.titles++; if (d[l] !== get(fd.Fw8KRORIm, l)) changes.descriptions++; if (h1[l] !== get(fd[H1F], l)) changes.h1++;
    }
    upd.push({ id: i.id, fieldData: { yNO0L700R: put(t), Fw8KRORIm: put(d), [H1F]: put(h1) } });
  }
  console.log("hubs:", changes.hubs, "| products:", upd.length, "| title values changed:", changes.titles, "| description values changed:", changes.descriptions, "| H1 values set:", changes.h1);
  const v8id = items.find(x => x.slug === "samsung-v8").id; const v8 = upd.find(u => u.id === v8id); console.log("V8 sample:", JSON.stringify(v8.fieldData.yNO0L700R).slice(0, 300));
  if (process.argv.includes("--dry")) return;
  await hc.addItems(hubUpd);
  for (let k = 0; k < upd.length; k += 40) await pc.addItems(upd.slice(k, k + 40));
  const back = await pc.getItems(); let emptyH1 = 0, longT = 0, longD = 0;
  for (const i of back) for (const l of Object.keys(L)) { if (!get(i.fieldData[H1F], l)) emptyH1++; if (get(i.fieldData.yNO0L700R, l).length > 60) longT++; if (get(i.fieldData.Fw8KRORIm, l).length > 160) longD++; }
  console.log("read-back: empty H1 values", emptyH1, "| titles > 60", longT, "| descriptions > 160", longD);
});
