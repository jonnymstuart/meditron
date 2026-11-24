// 24 Nov client call: product descriptions need tidying. Whitespace only, all four languages, visible products:
// trim leading/trailing spaces, remove spaces before line breaks, collapse double spaces, and collapse three or
// more line breaks to one blank line. Wording, capitals and deliberate line breaks stay. Writes a report of the
// cases that need a human (long capitals runs) to reports/data/description-review-<date>.json.
// Usage: node scripts/framer/clean-descriptions.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { writeFileSync } from "node:fs";
const DESC = "VKK1rLOkt", L = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const clean = s => s.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/ {2,}/g, " ").trim();
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const c = await f.getCollection("IGaxjVLL3");
  const items = (await c.getItems()).filter(i => i.fieldData.HvB4OLS27?.value !== false);
  const updates = [], review = []; let n = 0;
  for (const i of items) {
    const fd = i.fieldData[DESC]; if (!fd) continue;
    const en = String(fd.value ?? ""), enC = clean(en);
    const vbl = {};
    for (const [l, id] of Object.entries(L)) { const v = fd.valueByLocale?.[id]?.value; if (v == null) continue; const vc = clean(String(v)); if (vc !== v) { vbl[id] = { action: "set", value: vc }; n++; }
      if (/[A-ZÄÖÜ]{3,}(\s+[A-ZÄÖÜ]{3,}){2,}/.test(vc)) review.push({ slug: i.slug, lang: l, text: vc.match(/[A-ZÄÖÜ]{3,}(\s+[A-ZÄÖÜ]{3,}){2,}/)[0] }); }
    if (/[A-Z]{3,}(\s+[A-Z]{3,}){2,}/.test(enC)) review.push({ slug: i.slug, lang: "en", text: enC.match(/[A-Z]{3,}(\s+[A-Z]{3,}){2,}/)[0] });
    if (enC !== en) n++;
    if (enC !== en || Object.keys(vbl).length) updates.push({ id: i.id, slug: i.slug, fieldData: { [DESC]: { type: "string", value: enC, ...(Object.keys(vbl).length ? { valueByLocale: vbl } : {}) } } });
  }
  console.log(`${items.length} products, ${updates.length} need cleaning (${n} values); ${review.length} capitals runs for review`);
  console.log("examples:", updates.slice(0, 4).map(u => u.slug).join(", "));
  writeFileSync(new URL(`../../reports/data/description-review-${new Date().toISOString().slice(0, 10)}.json`, import.meta.url), JSON.stringify(review, null, 1));
  if (dry || !updates.length) return;
  for (let k = 0; k < updates.length; k += 50) await c.addItems(updates.slice(k, k + 50).map(({ id, fieldData }) => ({ id, fieldData })));
  const back = await c.getItems(); const left = back.filter(i => i.fieldData.HvB4OLS27?.value !== false && /^\s|\s$|  /.test(String(i.fieldData[DESC]?.value ?? ""))).length;
  console.log("done; EN values still with edge or double spaces:", left);
});
