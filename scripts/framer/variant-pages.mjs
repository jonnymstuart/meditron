// Variants as product pages (24 Nov client call): for each variant of a product, create a Products item with
// the variant's slug, name, image and description, the parent's brand / solution / advisor, Related Products =
// parent + sibling variants, Visible = false (kept out of the listing and hub comparison; the page still exists),
// and point the Variants field "Product Page" (E5WqvoET_) at it so the variant card links there. Specs stay
// empty, so the Specifications section stays hidden until Meditron adds them. Existing products are reused.
// Usage: node scripts/framer/variant-pages.mjs --product mako [--dry]
import { withFramer } from "./lib.mjs";
const P = { name: "krFC3FLEV", h1: "qFsZD3PuD", desc: "VKK1rLOkt", mt: "yNO0L700R", md: "Fw8KRORIm", thumb: "Dh60jX8lX", main: "G8s0uckMp",
  visible: "HvB4OLS27", solution: "nFDEePImP", brand: "Vtnnf3hIg", advisor: "q4q5eySK4", related: "ZW57wAQ93", variants: "jr6x3yFRX" };
const V = { name: "rz8ENSQqW", image: "DYbs5F_54", desc: "c63j_Zwqq", page: "E5WqvoET_" };
const L = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const SUFFIX = { en: "Meditron", de: "Meditron Schweiz", fr: "Meditron Suisse", it: "Meditron Svizzera" };
// Hand-written meta descriptions (120–155 characters, manufacturer facts only). Variants without one get the generic line.
const META = {
  "mako-r-f": "Mako R/F kit for X-ray QA in radiography, fluoroscopy, CT and dental, with ±1.5 % kV accuracy. Supplied and supported in Switzerland by Meditron.",
  "mako-mammo": "Mako MAMMO kit for mammography QA: the full 18–49 kV range without changing probes, ±1.5 % accuracy. Supplied and supported in Switzerland by Meditron.",
  "mako-dental": "Mako DENTAL kit for intraoral, panoramic and CBCT X-ray QA, with ±1.5 % kV accuracy and a 0.9 mm detector. Supplied in Switzerland by Meditron.",
  "mako-r-f-and-mammo": "Mako R/F and MAMMO kit: X-ray QA for radiography, fluoroscopy, CT, mammography and dental in one kit. Supplied and supported in Switzerland by Meditron.",
  "mako-premium": "Mako PREMIUM: the full Mako kit for radiography, fluoroscopy, CT, mammography and dental QA. Supplied and supported in Switzerland by Meditron.",
};
// Description: whole paragraphs (line-separated) up to 600 characters, the Products field limit.
const fit = (text, max = 600) => { const paras = clean(text).split(/\n+/); let out = ""; for (const p of paras) { const next = out ? out + "\n" + p : p; if (next.length > max) break; out = next; } return out || clean(text).slice(0, max); };
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const dry = process.argv.includes("--dry"), parentSlug = arg("--product");
const clean = s => String(s ?? "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/ {2,}/g, " ").trim();
const metaDesc = (text, name) => { const sents = clean(text).replace(/\n+/g, " ").match(/[^.!?]+[.!?]+/g) || [clean(text)]; let out = "";
  for (const s of sents) { if ((out + s).trim().length > 155) break; out = (out + s).trim(); }
  if (out.length < 120) out = (out ? out + " " : "") + `${name}, supplied and supported in Switzerland by Meditron.`;
  return out.length > 155 ? out.slice(0, 152).replace(/\s+\S*$/, "") + "." : out; };
await withFramer(async (f) => {
  const pc = await f.getCollection("IGaxjVLL3"), vc = await f.getCollection("PXCEKQuTk");
  const products = await pc.getItems(), variants = await vc.getItems();
  const parent = products.find(i => i.slug === parentSlug); if (!parent) throw new Error("no product " + parentSlug);
  const vIds = parent.fieldData[P.variants]?.value || [];
  const vs = vIds.map(id => variants.find(v => v.id === id || v.slug === id)).filter(Boolean);
  console.log(`${parentSlug}: ${vs.length} variants`);
  const bySlug = new Map(products.map(i => [i.slug, i]));
  // Reference values read back as slugs; writes need item ids.
  const refId = async (colId, v) => { if (!v) return v; const it = (await (await f.getCollection(colId)).getItems()).find(i => i.slug === v || i.id === v); return it?.id ?? v; };
  const refs = { solution: await refId("gZyqCZdng", parent.fieldData[P.solution]?.value), brand: await refId("iOhhsbixZ", parent.fieldData[P.brand]?.value), advisor: await refId("tsHmvz0zO", parent.fieldData[P.advisor]?.value) };
  console.log("refs:", JSON.stringify(refs));
  const plan = vs.map(v => { const name = clean(v.fieldData[V.name]?.value); const d = fit(v.fieldData[V.desc]?.value);
    const dl = Object.fromEntries(Object.values(L).map(id => [id, fit(v.fieldData[V.desc]?.valueByLocale?.[id]?.value || "")]).filter(([, t]) => t));
    const md = META[v.slug] || metaDesc(d, name); if (md.length > 155 || md.length < 120) throw new Error(`meta length ${md.length} for ${v.slug}`);
    return { v, name, d, dl, md, existing: bySlug.get(v.slug), img: v.fieldData[V.image]?.value?.url }; });
  for (const x of plan) console.log(`- ${x.v.slug} | "${x.name}" | ${x.existing ? "EXISTS as product, reuse" : "new"} | desc ${x.d.length} chars (${Object.values(x.dl).map(t => t.length).join("/")}) | img ${x.img ? "yes" : "NO"} | meta ${x.md.length}: ${x.md}`);
  if (dry) return;
  const fresh = plan.filter(x => !x.existing);
  if (fresh.length) await pc.addItems(fresh.map(x => ({ slug: x.v.slug, fieldData: {
    [P.name]: { type: "string", value: x.name },
    [P.h1]: { type: "string", value: x.name, valueByLocale: Object.fromEntries(Object.values(L).map(id => [id, { action: "set", value: x.name }])) },
    [P.desc]: { type: "string", value: x.d, valueByLocale: Object.fromEntries(Object.entries(x.dl).map(([id, t]) => [id, { action: "set", value: t }])) },
    [P.mt]: { type: "string", value: `${x.name} | ${SUFFIX.en}`, valueByLocale: Object.fromEntries(Object.entries(L).map(([l, id]) => [id, { action: "set", value: `${x.name} | ${SUFFIX[l]}` }])) },
    [P.md]: { type: "string", value: x.md },
    [P.thumb]: { type: "image", value: x.img }, [P.main]: { type: "image", value: x.img },
    [P.visible]: { type: "boolean", value: false },
    [P.solution]: { type: "collectionReference", value: refs.solution },
    [P.brand]: { type: "collectionReference", value: refs.brand },
    [P.advisor]: { type: "collectionReference", value: refs.advisor },
  } })));
  const after = new Map((await pc.getItems()).map(i => [i.slug, i]));
  const pageIds = plan.map(x => after.get(x.v.slug)?.id).filter(Boolean);
  // Related: parent + siblings (only on the pages we created)
  await pc.addItems(fresh.map(x => { const me = after.get(x.v.slug); return { id: me.id, fieldData: { [P.related]: { type: "multiCollectionReference", value: [parent.id, ...pageIds.filter(id => id !== me.id)] } } }; }));
  // Variant -> page link
  await vc.addItems(plan.map(x => ({ id: x.v.id, fieldData: { [V.page]: { type: "collectionReference", value: after.get(x.v.slug).id } } })));
  const vb = await vc.getItems();
  for (const x of plan) { const p = after.get(x.v.slug); console.log("ok", x.v.slug, "-> product", p.id, "visible", p.fieldData[P.visible]?.value, "| variant page ref", vb.find(v => v.id === x.v.id)?.fieldData[V.page]?.value); }
});
