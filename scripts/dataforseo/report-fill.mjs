// Puts the latest reports/data/google-*.json and ai-*.json into report/data.json (tables + tiles).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const latest = prefix => readdirSync("reports/data").filter(f => f.startsWith(prefix)).sort().at(-1);
const g = JSON.parse(readFileSync(`reports/data/${latest("google-")}`, "utf8"));
const a = JSON.parse(readFileSync(`reports/data/${latest("ai-")}`, "utf8"));
const d = JSON.parse(readFileSync("report/data.json", "utf8"));

// Google: best position seen across samples + how many samples saw it
const rows = g.results.map(r => { const seen = (r.positions_seen ?? [r.position]).filter(p => p != null); const n = (r.positions_seen ?? [r.position]).length;
  return { lang: r.lang, keyword: r.keyword, volume: r.volume, position: seen.length ? Math.min(...seen) : null, seen: `${seen.length}/${n}`, top3: r.top3, ai_overview: r.ai_overview, ai_overview_cites_meditron: r.ai_overview_cites_meditron }; });
d.google = { source: `${g.source}, ${g.date}`, rows };
const top50 = rows.filter(r => r.position && r.position <= 50).length, page12 = rows.filter(r => r.position && r.position <= 20).length, page1 = rows.filter(r => r.position && r.position <= 10).length;
const aioN = rows.filter(r => r.ai_overview).length, aioCite = rows.filter(r => r.ai_overview_cites_meditron).length;

// AI prompts: one row per prompt, one cell per engine
const byPrompt = {};
for (const r of a.results) { const k = `${r.lang}|${r.prompt}`; byPrompt[k] ??= { lang: r.lang, prompt: r.prompt, firsts: [] };
  byPrompt[k][r.engine] = r.ok ? { named: r.meditron_named, cited: r.meditron_cited } : null; if (r.first_named) byPrompt[k].firsts.push(r.first_named); }
const prows = Object.values(byPrompt).map(p => { const c = {}; p.firsts.forEach(f => c[f] = (c[f] || 0) + 1); const first = Object.entries(c).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null; delete p.firsts; return { ...p, first_named: first }; });
d.aiPrompts = { source: `${a.source}, ${a.date}`, rows: prows };
const okA = a.results.filter(r => r.ok), named = okA.filter(r => r.meditron_named).length, cited = okA.filter(r => r.meditron_cited).length;

d.headline.tiles = [
  d.headline.tiles[0],
  { label: "Tracked terms on page 1 (CH)", value: String(page1), note: `of ${rows.length} · ${page12} on pages 1–2 · DataForSEO ${g.date}` },
  { label: "AI answers naming Meditron", value: `${named} / ${okA.length}`, note: `${cited} cite meditron.ch · 20 prompts × ChatGPT, Gemini, Perplexity · ${a.date}` },
  { label: "AI Overviews citing Meditron", value: `${aioCite} / ${aioN}`, note: `AI Overview shown on ${aioN} of ${rows.length} terms · ${g.date}` },
];
d.headline.status = `First real rankings measured on ${g.date}: Meditron is on page 1 for ${page1} of ${rows.length} tracked Swiss searches and is named in ${named} of ${okA.length} AI answers. Three articles live, three on staging.`;
d.baseline.caveat = "Semrush snapshot of 29 Sep, kept as the starting point. From 5 Oct the tracked terms are measured directly in Swiss Google and the AI engines via DataForSEO; see the two tables below.";
writeFileSync("report/data.json", JSON.stringify(d, null, 2) + "\n");
console.log({ top50, page12, page1, aioN, aioCite, named, cited, prompts: prows.length });
