// English text left on DE/FR/IT pages (25 Nov, German audit A3).
// 1. Article image alt text: News & Events images whose DE/FR/IT alt is empty fall back to the English alt. Fill each
//    empty locale with that article's own title in the same locale (the string source whose EN value equals the alt).
// 2. Contact page "See All" (source 3RWHGqjh6hfZsnz0vjb7Cw): DE "Alle ansehen", FR "Voir tout", IT "Vedi tutto",
//    matching the Home page's existing DE translation.
// Only empty values are written. Usage: node scripts/framer/localize-leftovers.mjs [--dry]
import { withFramer } from "./lib.mjs";
const LOC = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const strip = s => String(s || "").replace(/<[^>]+>/g, "").trim();
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const valuesBySource = {};
  const groups = await f.getLocalizationGroups();
  for (const g of groups.filter(g => g.type === "collection-item" && g.name.startsWith("News & Events"))) {
    for (const a of g.sources.filter(s => s.type === "altText")) {
      const title = g.sources.find(s => s.type === "string" && strip(s.value) === strip(a.value));
      if (!title) continue;
      for (const [l, id] of Object.entries(LOC)) {
        const cur = strip(a.valueByLocale?.[id]?.value), t = strip(title.valueByLocale?.[id]?.value);
        if (!cur && t && t !== strip(a.value)) { (valuesBySource[a.id] ??= {})[id] = { action: "set", value: t }; console.log(l, "|", g.name.slice(16, 70), "→", t.slice(0, 70)); }
      }
    }
  }
  const contact = groups.find(g => g.type === "page" && g.name === "Contact")?.sources.find(s => s.id === "3RWHGqjh6hfZsnz0vjb7Cw");
  const SEE = { de: "Alle ansehen", fr: "Voir tout", it: "Vedi tutto" };
  if (contact) for (const [l, id] of Object.entries(LOC)) if (!strip(contact.valueByLocale?.[id]?.value)) { (valuesBySource[contact.id] ??= {})[id] = { action: "set", value: SEE[l] }; console.log(l, "| Contact See All →", SEE[l]); }
  console.log("sources to write:", Object.keys(valuesBySource).length);
  if (dry || !Object.keys(valuesBySource).length) return;
  console.log(JSON.stringify(await f.setLocalizationData({ valuesBySource })).slice(0, 300));
  const after = await f.getLocalizationGroups(); let ok = 0, miss = 0;
  for (const g of after) for (const s of g.sources || []) if (valuesBySource[s.id]) for (const id of Object.keys(valuesBySource[s.id])) (strip(s.valueByLocale?.[id]?.value) === valuesBySource[s.id][id].value ? ok++ : miss++);
  console.log("read back: ok", ok, "missing", miss);
});
