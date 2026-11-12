// Snapshot of SEO fields for the before/after report: hubs and visible products, 4 locales.
// Usage: node scripts/framer/snapshot-seo.mjs <out.json>
import { withFramer } from "./lib.mjs";
import { writeFileSync } from "node:fs";
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const loc = (v) => Object.fromEntries(Object.entries(L).map(([k, id]) => [k, (id ? v?.valueByLocale?.[id]?.value : v?.value) ?? ""]));
await withFramer(async (f) => {
  const out = { date: new Date().toISOString(), hubs: {}, products: {} };
  const faq = await (await f.getCollection("Y7o7IM_3D")).getItems();
  for (const h of await (await f.getCollection("gZyqCZdng")).getItems()) {
    const fd = h.fieldData;
    out.hubs[h.slug] = { title: loc(fd.fM1J_4KGB), description: loc(fd.YuxfDRp5D), h1: loc(fd.MZ6ahxHsM), introChars: loc(fd.yv1RziKgE).en.length, faqRows: faq.filter(r => [h.id, h.slug].includes(r.fieldData.yKY34FXOp?.value)).length };
  }
  const pc = await f.getCollection("IGaxjVLL3"); const fields = await pc.getFields();
  const h1f = fields.find(x => x.name === "H1" || x.name === "H 1")?.id;
  const PQ = ["DgtWCAqSG", "rLcE_AA5B", "YzTVKn3Aa", "dFHEcNCRv", "rn1j_Ulg0", "M8hgbvNb6"];
  for (const i of await pc.getItems()) {
    if (!i.fieldData.HvB4OLS27?.value) continue; const fd = i.fieldData;
    out.products[i.slug] = { solution: fd.nFDEePImP?.value, name: loc(fd.krFC3FLEV), title: loc(fd.yNO0L700R), description: loc(fd.Fw8KRORIm), h1: h1f ? loc(fd[h1f]) : loc(fd.krFC3FLEV), faq: PQ.filter(q => (fd[q]?.value || "").trim()).length };
  }
  writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
  const ps = Object.values(out.products); const len = (a, n) => ps.reduce((s, p) => s + Object.values(p[a]).filter(x => x.length > n).length, 0);
  console.log("hubs", Object.keys(out.hubs).length, "| products", ps.length, "| titles > 60:", len("title", 60), "| descriptions > 160:", len("description", 160), "| IT 'Meditron Switzerland':", ps.filter(p => p.title.it.includes("Meditron Switzerland")).length);
});
