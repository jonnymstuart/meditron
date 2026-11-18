// Other four hubs (radiotherapy, radiology, biomedical-testing, industrial-solutions), 18 Nov: same structure as the
// Samsung hub. Writes hub fields (intro, Why Meditron, comparison heading + labels, offer row + button label) and the
// per-product comparison fields + Hub Order, from content/seo/hubs-other-2026-11-18.json. Usage: node hubs-other.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/hubs-other-2026-11-18.json", import.meta.url))).hubs;
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const H = { intro: "yv1RziKgE", why: "l62iTQw4b", priceIntro: "hBI23SnEq", price: "nvwQEIXsz", heading: "Lwudih0L8", priceLabel: "Y6rRUN3BW", labels: ["ti83vplsI", "AxCN6hF7l", "ErotJgDLk", "cyCRpODai"] };
const P = { model: "VtLBeQb6s", best: "yxKEtShab", format: "XLxfdKqCR", hi: "lSLwpuk7K", order: "ryKGzFopm" };
const put = (type, o) => ({ type, value: o.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: o[l] }])) });
const same = s => ({ en: s, de: s, fr: s, it: s });
await withFramer(async (f) => {
  const sol = await f.getCollection("gZyqCZdng"), prod = await f.getCollection("IGaxjVLL3");
  const hubs = await sol.getItems(), items = await prod.getItems();
  const hubUpd = [], prodUpd = [];
  for (const [slug, h] of Object.entries(C)) {
    const hub = hubs.find(x => x.slug === slug); if (!hub) throw new Error("no hub " + slug);
    const fd = { [H.intro]: put("formattedText", h.intro), [H.why]: put("formattedText", h.why), [H.priceIntro]: put("formattedText", h.priceIntro), [H.price]: put("formattedText", h.price),
      [H.heading]: put("formattedText", Object.fromEntries(Object.entries(h.heading).map(([l, t]) => [l, `<h3>${t}</h3>`]))), [H.priceLabel]: put("string", h.priceLabel) };
    h.labels.forEach((lab, k) => fd[H.labels[k]] = put("string", lab));
    hubUpd.push({ id: hub.id, fieldData: fd });
    h.rows.forEach(([pslug, name, best, type, hi], n) => {
      const it = items.find(i => i.slug === pslug); if (!it) throw new Error("no product " + pslug);
      if (it.fieldData.nFDEePImP?.value !== slug) console.log("WARN", pslug, "is in", it.fieldData.nFDEePImP?.value);
      prodUpd.push({ id: it.id, fieldData: { [P.model]: put("string", same(name)), [P.best]: put("string", best), [P.format]: put("string", type), [P.hi]: put("string", hi), [P.order]: { type: "number", value: n + 1 } } });
    });
  }
  console.log("hubs:", hubUpd.length, "products:", prodUpd.length);
  if (process.argv.includes("--dry")) return;
  await sol.addItems(hubUpd); await prod.addItems(prodUpd);
  const back = await prod.getItems();
  for (const [slug, h] of Object.entries(C)) console.log(slug, h.rows.map(([p]) => { const it = back.find(i => i.slug === p); return `${it.fieldData[P.order]?.value}:${it.fieldData[P.model]?.value}`; }).join(" | "));
});
