// Fills FAQs where none exist: 4 rows per Solutions hub without FAQ rows (FAQ collection) and FAQ Question/Answer 1–4
// on visible ultrasound products without FAQs. Content: content/faq/faq-2026-11-10.json. Skips anything that already has FAQs.
// Also sets the DE/FR/IT product Name to the English model name for these products (machine translation had mangled some).
// Usage: node scripts/framer/faq-fill.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const dry = process.argv.includes("--dry");
const C = JSON.parse(readFileSync(new URL("../../content/faq/faq-2026-11-10.json", import.meta.url)));
const LOC = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const PQ = ["DgtWCAqSG", "rLcE_AA5B", "YzTVKn3Aa", "dFHEcNCRv"], PA = ["R4BTWDCVh", "JnvQbqY0v", "zbg3y_eFj", "wNA8ZUOAA"];
const fill = (o, name) => Object.fromEntries(Object.entries(o).map(([l, s]) => [l, s.replaceAll("{name}", name)]));
const val = (type, t, rich) => { const wrap = (s) => rich ? `<p dir="auto">${s}</p>` : s; return { type, value: wrap(t.en), valueByLocale: Object.fromEntries(Object.entries(LOC).map(([l, id]) => [id, { action: "set", value: wrap(t[l]) }])) }; };
await withFramer(async (f) => {
  // Products
  const pc = await f.getCollection("IGaxjVLL3"); const pf = Object.fromEntries((await pc.getFields()).map(x => [x.id, x.type]));
  const items = (await pc.getItems()).filter(i => i.fieldData.nFDEePImP?.value === "ultrasound" && i.fieldData.HvB4OLS27?.value);
  const pUpd = [];
  for (const i of items) {
    if (PQ.some(q => (i.fieldData[q]?.value || "").trim())) continue;
    const what = C.productWhat[i.slug]; if (!what) { console.log("no content for", i.slug); continue; }
    const name = i.fieldData.krFC3FLEV.value.trim(); const phantom = i.slug.startsWith("pro-us");
    const qa = [[C.productQ.what, what], [C.productQ.who, C.productA.who], phantom ? [C.productQ.advice, C.productA.advice] : [C.productQ.demo, C.productA.demo], [C.productQ.price, C.productA.price]];
    const fd = { krFC3FLEV: { type: "string", value: name, valueByLocale: Object.fromEntries(Object.values(LOC).map(id => [id, { action: "set", value: name }])) } };
    qa.forEach(([q, a], k) => { fd[PQ[k]] = val(pf[PQ[k]], fill(q, name), pf[PQ[k]] === "formattedText"); fd[PA[k]] = val(pf[PA[k]], fill(a, name), pf[PA[k]] === "formattedText"); });
    pUpd.push({ id: i.id, fieldData: fd });
  }
  console.log("products to fill:", pUpd.length, "| field types:", pf[PQ[0]], pf[PA[0]]);
  // Hubs
  const fc = await f.getCollection("Y7o7IM_3D"); const existing = await fc.getItems();
  const hubs = await (await f.getCollection("gZyqCZdng")).getItems();
  const refSample = existing.find(e => e.fieldData.yKY34FXOp?.value)?.fieldData.yKY34FXOp.value;
  const hNew = [];
  for (const h of hubs) {
    const rows = C.hubs[h.slug]; if (!rows) continue;
    if (existing.some(e => [h.id, h.slug].includes(e.fieldData.yKY34FXOp?.value))) { console.log("hub has FAQs, skip:", h.slug); continue; }
    rows.forEach((r, k) => {
      const q = r === "support" ? C.common.q_support : r === "offer" ? C.common.q_offer : r.q;
      const a = r === "support" ? C.common.a_support : r === "offer" ? C.common.a_offer : r.a;
      hNew.push({ slug: `${h.slug}-${k + 1}`, fieldData: { vkOdkDocK: val("string", q), hF3or4UG4: val("string", a), yKY34FXOp: { type: "collectionReference", value: h.id }, BJHsF4nA7: { type: "number", value: k + 1 } } });
    });
  }
  console.log("hub rows to add:", hNew.length, "| existing reference value form:", refSample);
  if (dry) { console.log(JSON.stringify(pUpd[0]).slice(0, 700)); console.log(JSON.stringify(hNew[0]).slice(0, 500)); return; }
  for (let k = 0; k < pUpd.length; k += 20) await pc.addItems(pUpd.slice(k, k + 20));
  if (hNew.length) await fc.addItems(hNew);
  // Read-back
  const back = (await pc.getItems()).filter(i => pUpd.some(u => u.id === i.id));
  const filled = back.filter(i => PQ.every(q => (i.fieldData[q]?.value || "").trim() && Object.values(LOC).every(id => (i.fieldData[q]?.valueByLocale?.[id]?.value || "").trim()))).length;
  const fb = await fc.getItems();
  console.log("products filled in 4 languages:", filled, "of", pUpd.length);
  for (const h of hubs) console.log("hub", h.slug, "FAQ rows:", fb.filter(e => [h.id, h.slug].includes(e.fieldData.yKY34FXOp?.value)).length);
});
