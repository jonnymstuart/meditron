// Adds or updates a month in report/data.json from the latest reports/data/google-*.json and ai-*.json.
// Same formulas every month so the months stay comparable. Usage: node scripts/dataforseo/report-fill.mjs [YYYY-MM]
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const latest = prefix => readdirSync("reports/data").filter(f => f.startsWith(prefix)).sort().at(-1);
const g = JSON.parse(readFileSync(`reports/data/${latest("google-")}`, "utf8"));
const a = JSON.parse(readFileSync(`reports/data/${latest("ai-")}`, "utf8"));
const d = JSON.parse(readFileSync("report/data.json", "utf8"));
const id = process.argv[2] || g.date.slice(0, 7);
const label = new Date(id + "-01T00:00:00Z").toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

const rows = g.results.map(r => { const seen = (r.positions_seen ?? [r.position]).filter(p => p != null); const n = (r.positions_seen ?? [r.position]).length;
  return { lang: r.lang, keyword: r.keyword, volume: r.volume, position: seen.length ? Math.min(...seen) : null, seen: `${seen.length}/${n}`, top3: r.top3, ai_overview: r.ai_overview, ai_overview_cites_meditron: r.ai_overview_cites_meditron }; });
const ranking = rows.map(r => r.position).filter(Boolean);
const page1 = ranking.filter(p => p <= 10).length, top20 = ranking.filter(p => p <= 20).length;
const avgpos = ranking.length ? Math.round(ranking.reduce((s, p) => s + p, 0) / ranking.length * 10) / 10 : null;
const aioN = rows.filter(r => r.ai_overview).length, aioCite = rows.filter(r => r.ai_overview_cites_meditron).length;

const byPrompt = {};
for (const r of a.results) { const k = `${r.lang}|${r.prompt}`; byPrompt[k] ??= { lang: r.lang, prompt: r.prompt, firsts: [] };
  byPrompt[k][r.engine] = r.ok ? { named: r.meditron_named, cited: r.meditron_cited } : null; if (r.first_named) byPrompt[k].firsts.push(r.first_named); }
const prows = Object.values(byPrompt).map(p => { const c = {}; p.firsts.forEach(f => c[f] = (c[f] || 0) + 1); const first = Object.entries(c).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null; delete p.firsts; return { ...p, first_named: first }; });
const okA = a.results.filter(r => r.ok), named = okA.filter(r => r.meditron_named).length, cited = okA.filter(r => r.meditron_cited).length;
const first = prows.filter(p => p.first_named === "Meditron").length;
const articles = d.articles.filter(x => x.status === "live").length;

let m = d.months.find(x => x.id === id);
if (!m) { m = { id, label, short: label.slice(0, 3), baseline: false, done: [], log: [] }; d.months.push(m); d.months.sort((x, y) => x.id.localeCompare(y.id)); }
const prevVals = m.values || {};
m.values = { page1, top20, avgpos, aio: `${aioCite} / ${aioN}`, named, cited, first, articles, clicks: prevVals.clicks ?? null, impressions: prevVals.impressions ?? null };
m.source = `DataForSEO, Switzerland, ${g.date}. Google: 3 live queries per term. AI: ChatGPT gpt-5.5, Gemini 3.5 Flash, Perplexity sonar-pro, web search on.`;
m.google = { source: `${g.source}, ${g.date}`, rows };
m.aiPrompts = { source: `${a.source}, ${a.date}`, rows: prows };
m.status ??= `Meditron is on page 1 for ${page1} of 20 tracked Swiss searches and is named in ${named} of 60 AI answers.`;
d.updated = g.date;
writeFileSync("report/data.json", JSON.stringify(d, null, 2) + "\n");
console.log(id, m.values);
