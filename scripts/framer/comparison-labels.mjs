// Hub comparison header labels as localized Solutions fields ("Comparison Label 1–4"), bound to the header text nodes,
// so every hub can name its own columns in EN/DE/FR/IT. Ultrasound labels from hub-ultrasound-2026-11-17.json.
// Usage: node scripts/framer/comparison-labels.mjs
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/hub-ultrasound-2026-11-17.json", import.meta.url)));
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const HEAD = ["XEttoxz0X", "VdulICsJ7", "v5UjxV7Te", "mxINZfsHc"];
const PP = { pagePath: "/solutions/:Solutions" };
await withFramer(async (f) => {
  const sol = await f.getCollection("gZyqCZdng"); let fields = await sol.getFields();
  const names = [1, 2, 3, 4].map(n => `Comparison Label ${n}`);
  const miss = names.filter(n => !fields.some(x => x.name === n));
  if (miss.length) { await sol.addFields(miss.map(name => ({ type: "string", name }))); fields = await sol.getFields(); }
  const ids = names.map(n => fields.find(x => x.name === n).id); console.log("label fields:", ids.join(", "));
  const hub = (await sol.getItems()).find(i => i.slug === "ultrasound");
  const fd = Object.fromEntries(ids.map((id, k) => [id, { type: "string", value: C.table.cols.en[k], valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: C.table.cols[l][k] }])) }]));
  await sol.addItems([{ id: hub.id, fieldData: fd }]);
  const r = await f.agent.applyChanges(HEAD.map((n, k) => `SET ${n} text="var(--variable-${ids[k]})";`).join(" "), PP); console.log(JSON.stringify(r).slice(0, 300));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title);
  if (b?.id && b.id !== "main") { await (await f.getBranches()).find(x => x.id === b.id).merge(); console.log("merged"); }
  for (const n of await f.agent.serializeNodes({ ids: HEAD, depth: 0 }, PP)) console.log(n.id, n.attributes.text);
});
