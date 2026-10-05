import { dfs, CH } from "/home/user/meditron/scripts/dataforseo/lib.mjs";
const seeds = { de: ["ultraschallgerät", "ultraschall gerät praxis", "sonographie gerät", "samsung ultraschall"], fr: ["échographe", "appareil échographie", "échographe samsung"], it: ["ecografo", "ecografo samsung"], en: ["ultrasound machine", "samsung ultrasound"] };
const out = {};
for (const [lang, kws] of Object.entries(seeds)) {
  const t = await dfs("keywords_data/google_ads/keywords_for_keywords/live", [{ keywords: kws, location_code: CH, language_code: lang, sort_by: "search_volume" }]);
  const rows = (t[0].result || []).filter(r => r.search_volume >= 20).map(r => ({ k: r.keyword, v: r.search_volume, cpc: r.cpc, comp: r.competition })).slice(0, 40);
  out[lang] = rows;
  console.log("\n== " + lang); for (const r of rows) console.log(String(r.v).padStart(6), r.k, r.cpc ? "cpc " + r.cpc : "");
}
import fs from "fs"; fs.writeFileSync("/home/user/meditron/reports/data/keyword-ideas-2026-10-05.json", JSON.stringify(out, null, 2));
