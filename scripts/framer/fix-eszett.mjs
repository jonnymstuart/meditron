// Swiss German uses "ss", never "ß" (CLAUDE.md, docs/glossary.md). Replaces ß with ss in the DE values of every
// Products text field. Other locales untouched. Usage: node scripts/framer/fix-eszett.mjs [--dry]
import { withFramer } from "./lib.mjs";
const DE = "C9aJRu34X";
await withFramer(async (f) => {
  const c = await f.getCollection("IGaxjVLL3");
  const fields = (await c.getFields()).filter(x => ["string", "formattedText"].includes(x.type));
  const upd = []; let n = 0; const sample = [];
  for (const i of await c.getItems()) {
    const fd = {};
    for (const fl of fields) {
      const v = i.fieldData[fl.id]; const de = v?.valueByLocale?.[DE]?.value;
      if (typeof de !== "string" || !de.includes("ß")) continue;
      const fixed = de.replace(/ß/g, "ss"); n++;
      if (sample.length < 4) sample.push(`${i.slug} / ${fl.name}: …${de.slice(Math.max(0, de.indexOf("ß") - 20), de.indexOf("ß") + 15)}…`);
      fd[fl.id] = { type: fl.type, value: v.value ?? "", valueByLocale: { [DE]: { action: "set", value: fixed } } };
    }
    if (Object.keys(fd).length) upd.push({ id: i.id, fieldData: fd });
  }
  console.log("DE values with ß:", n, "in", upd.length, "products"); sample.forEach(s => console.log(" ", s));
  if (process.argv.includes("--dry")) return;
  for (let k = 0; k < upd.length; k += 40) await c.addItems(upd.slice(k, k + 40));
  let left = 0; for (const i of await c.getItems()) for (const fl of fields) if (String(i.fieldData[fl.id]?.valueByLocale?.[DE]?.value ?? "").includes("ß")) left++;
  console.log("read-back: DE values still with ß:", left);
});
