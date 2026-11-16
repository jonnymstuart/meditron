// Moves the comparison table (its <h3> heading + <table>) from the Samsung hub SEO intro into the "Comparison"
// rich-text field (Lwudih0L8), 4 locales, and strips all bold (<strong>/<b>) from the table. Idempotent.
import { withFramer } from "./lib.mjs";
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const INTRO = "yv1RziKgE", CMP = "Lwudih0L8";
const unbold = (s) => s.replace(/<\/?(strong|b)>/g, "");
await withFramer(async (f) => {
  const c = await f.getCollection("gZyqCZdng"); const hub = (await c.getItems()).find(h => h.slug === "ultrasound");
  const intro = {}, cmp = {};
  for (const [l, id] of Object.entries(L)) {
    const cur = (id ? hub.fieldData[INTRO].valueByLocale?.[id]?.value : hub.fieldData[INTRO].value) || "";
    const existing = (id ? hub.fieldData[CMP]?.valueByLocale?.[id]?.value : hub.fieldData[CMP]?.value) || "";
    const m = cur.match(/<h3[^>]*>[^<]*<\/h3>\s*(?:<figure[^>]*>\s*)?<table[\s\S]*?<\/table>(?:\s*<\/figure>)?/);
    if (m) { intro[l] = cur.replace(m[0], ""); cmp[l] = unbold(m[0]); }
    else { intro[l] = cur; cmp[l] = unbold(existing); }
    if (!cmp[l].includes("<table")) throw new Error("no table found for " + l);
  }
  const put = (o) => ({ type: "formattedText", value: o.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: o[l] }])) });
  await c.addItems([{ id: hub.id, fieldData: { [INTRO]: put(intro), [CMP]: put(cmp) } }]);
  // Other hubs: clear the field's default empty paragraph so the comparison block stays hidden there.
  const others = (await c.getItems()).filter(h => h.slug !== "ultrasound").map(h => ({ id: h.id, fieldData: { [CMP]: { type: "formattedText", value: "", valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: "" }])) } } }));
  await c.addItems(others);
  for (const h of (await c.getItems()).filter(h => h.slug !== "ultrasound")) console.log("other hub", h.slug, "comparison:", JSON.stringify(h.fieldData[CMP]?.value ?? null));
  const b = (await c.getItems()).find(h => h.slug === "ultrasound").fieldData;
  for (const [l, id] of Object.entries(L)) {
    const i = (id ? b[INTRO].valueByLocale?.[id]?.value : b[INTRO].value) || "", t = (id ? b[CMP].valueByLocale?.[id]?.value : b[CMP].value) || "";
    console.log(l, "| intro has table:", i.includes("<table"), "| comparison has table:", t.includes("<table"), "| bold in table:", /<(strong|b)>/.test(t), "| heading:", (t.match(/<h3[^>]*>([^<]*)/) || [])[1]);
  }
});
