// Product page static labels in DE/FR/IT (24 Nov): "Specifications" heading (was Technical Data), and the
// labels that were still English everywhere: "Related models", "Brochure", "Download PDF". Drafts for the
// client's proofreading. Usage: node scripts/framer/localize-product-labels.mjs
import { withFramer } from "./lib.mjs";
const DE = "C9aJRu34X", FR = "rRxiWhpq8", IT = "D9HoCmqY1";
const T = {
  "40FKcngImOqflNf1bXIN8Z": ["h2", { [DE]: "Spezifikationen", [FR]: "Caractéristiques", [IT]: "Specifiche" }],
  "6g5rviUj0lCSgSA7GOHMGR": ["h2", { [DE]: "Ähnliche Modelle", [FR]: "Modèles similaires", [IT]: "Modelli simili" }],
  "4q8U7DRDBo2Npx5ytttwn5": ["p", { [DE]: "Broschüre", [FR]: "Brochure", [IT]: "Brochure" }],
  "0MvssNh8NZ01dHa7W8SXkW": ["p", { [DE]: "PDF herunterladen", [FR]: "Télécharger le PDF", [IT]: "Scarica il PDF" }],
};
await withFramer(async (f) => {
  const valuesBySource = Object.fromEntries(Object.entries(T).map(([id, [tag, v]]) => [id, Object.fromEntries(Object.entries(v).map(([l, t]) => [l, { action: "set", value: `<${tag} dir="auto">${t}</${tag}>` }]))]));
  console.log(JSON.stringify(await f.setLocalizationData({ valuesBySource })).slice(0, 300));
  const g = (await f.getLocalizationGroups({ type: "page" })).find(x => x.name === "Products Detail");
  for (const id of Object.keys(T)) { const s = g.sources.find(x => x.id === id); console.log(s.value.replace(/<[^>]+>/g, ""), "→", [DE, FR, IT].map(l => (s.valueByLocale[l]?.value || "").replace(/<[^>]+>/g, "")).join(" | ")); }
});
