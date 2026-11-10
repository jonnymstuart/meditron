// Copies the product FAQ answers (formattedText, R4BTWDCVh…) into the plain-text fields "FAQ Answer 1–4 Text"
// that the product template's FAQ rows bind to, in EN/DE/FR/IT. Rerun after editing product FAQ answers.
// Usage: node scripts/framer/faq-plain.mjs [--dry]
import { withFramer } from "./lib.mjs";
const LOC = ["C9aJRu34X", "rRxiWhpq8", "D9HoCmqY1"];
const RICH = ["R4BTWDCVh", "JnvQbqY0v", "zbg3y_eFj", "wNA8ZUOAA"];
const strip = (h) => (h || "").replace(/<\/p>\s*<p[^>]*>/g, "\n\n").replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/[ \t]+/g, " ").trim();
await withFramer(async (f) => {
  const col = await f.getCollection("IGaxjVLL3");
  const T = Object.fromEntries((await col.getFields()).filter(x => /^FAQ Answer \d Text$/.test(x.name)).map(x => [Number(x.name[11]) - 1, x.id]));
  if (Object.keys(T).length !== 4) throw new Error("plain FAQ fields missing on this branch: " + JSON.stringify(T));
  const upd = [];
  for (const i of await col.getItems()) {
    const fd = {};
    RICH.forEach((r, k) => { const v = i.fieldData[r]; const en = strip(v?.value); if (!en) return;
      fd[T[k]] = { type: "string", value: en, valueByLocale: Object.fromEntries(LOC.map(l => [l, { action: "set", value: strip(v.valueByLocale?.[l]?.value) || en }])) }; });
    if (Object.keys(fd).length) upd.push({ id: i.id, slug: i.slug, fieldData: fd });
  }
  console.log("products with FAQ answers:", upd.length, "| sample:", upd.find(u => u.slug === "samsung-v8")?.fieldData[T[0]].value.slice(0, 90));
  if (process.argv.includes("--dry")) return;
  for (let k = 0; k < upd.length; k += 20) await col.addItems(upd.slice(k, k + 20).map(({ id, fieldData }) => ({ id, fieldData })));
  const back = await col.getItems(); let ok = 0;
  for (const u of upd) { const b = back.find(x => x.id === u.id); if (Object.keys(u.fieldData).every(fid => (b.fieldData[fid]?.value || "").trim() && LOC.every(l => (b.fieldData[fid]?.valueByLocale?.[l]?.value || "").trim()))) ok++; }
  console.log("read-back complete in 4 languages:", ok, "of", upd.length);
});
