// Weekly Google baseline for data/tracking-list.csv: Swiss search volume, meditron.ch position,
// top 3 competitors, AI Overview presence and citations. Writes reports/data/google-<date>.json
// and updates report/data.json tiles. Usage: node scripts/dataforseo/baseline.mjs [--dry-run]
import { readFileSync, writeFileSync } from "node:fs";
import { dfs, CH, LANG, today } from "./lib.mjs";
const dry = process.argv.includes("--dry-run");
const rows = readFileSync(new URL("../../data/tracking-list.csv", import.meta.url), "utf8").trim().split("\n").slice(1)
  .map(l => { const m = l.match(/^([^,]*),([^,]*),([^,]*),(.*)$/); return { group: m[1], lang: m[2], keyword: m[3], prompt: m[4].replace(/^"|"$/g, "") }; });
console.log(rows.length, "rows");
if (dry) process.exit(0);

// 1. Search volume (Google Ads, Switzerland), one call per language
const volume = {};
for (const lang of Object.keys(LANG)) {
  const kws = rows.filter(r => r.lang === lang).map(r => r.keyword);
  const tasks = await dfs("keywords_data/google_ads/search_volume/live", [{ keywords: kws, location_code: CH, language_code: LANG[lang] }]);
  for (const item of tasks[0]?.result ?? []) volume[`${lang}|${item.keyword.toLowerCase()}`] = item.search_volume;
}

// 2. Live SERP per keyword, sampled SAMPLES times (live Google results vary between calls);
//    position = median of samples (missing = 101), AI Overview = seen in any sample, top3 from the first sample.
const SAMPLES = Number(process.env.SAMPLES || 3);
const results = [];
const seeMeditron = s => /(^|\.)meditron\.ch$/.test(s || "") || /meditron\.ch/.test(s || "");
for (const r of rows) {
  const samples = [];
  for (let n = 0; n < SAMPLES; n++) {
    const tasks = await dfs("serp/google/organic/live/advanced", [{ keyword: r.keyword, location_code: CH, language_code: LANG[r.lang], device: "desktop", depth: 50, load_async_ai_overview: true }]);
    const items = tasks[0]?.result?.[0]?.items ?? [];
    const organic = items.filter(i => i.type === "organic");
    const mine = organic.find(i => seeMeditron(i.domain) || seeMeditron(i.url));
    const aio = items.find(i => i.type === "ai_overview");
    const refs = (aio?.references ?? aio?.items?.flatMap(x => x.references ?? []) ?? []).map(x => x.domain || x.url).filter(Boolean);
    samples.push({ pos: mine ? mine.rank_absolute : null, url: mine?.url ?? null, top3: organic.slice(0, 3).map(i => i.domain), aio: !!aio, refs });
  }
  const poss = samples.map(s => s.pos ?? 101).sort((a, b) => a - b);
  const med = poss[Math.floor(poss.length / 2)];
  const position = med > 100 ? null : med;
  const refs = [...new Set(samples.flatMap(s => s.refs))];
  results.push({ ...r, date: today(), volume: volume[`${r.lang}|${r.keyword.toLowerCase()}`] ?? null,
    position, positions_seen: samples.map(s => s.pos), url: samples.find(s => s.url)?.url ?? null,
    top3: samples[0].top3, ai_overview: samples.some(s => s.aio), ai_overview_cites_meditron: refs.some(seeMeditron), ai_overview_sources: refs.slice(0, 8) });
  const last = results.at(-1);
  console.log(r.lang, r.keyword, "| vol", last.volume, "| pos", last.position ?? "-", JSON.stringify(last.positions_seen), "| AIO", last.ai_overview ? (last.ai_overview_cites_meditron ? "cites us" : "yes") : "no");
}
const out = `reports/data/google-${today()}.json`;
writeFileSync(out, JSON.stringify({ source: "DataForSEO SERP + Google Ads volume, Switzerland", date: today(), results }, null, 1));
console.log("wrote", out);

// 3. Tiles on the report page
const top50 = results.filter(r => r.position && r.position <= 50).length;
const page12 = results.filter(r => r.position && r.position <= 20).length;
const aioN = results.filter(r => r.ai_overview).length, aioCite = results.filter(r => r.ai_overview_cites_meditron).length;
const p = "report/data.json", d = JSON.parse(readFileSync(p, "utf8"));
d.headline.tiles[1] = { label: "Tracked terms where meditron.ch ranks (top 50, CH)", value: String(top50), note: `of ${results.length} · DataForSEO ${today()}` };
d.headline.tiles[2] = { label: "Tracked terms on page 1–2", value: String(page12), note: `of ${results.length} · target: 10+ by January` };
d.headline.tiles[3] = { label: "AI Overviews citing Meditron", value: `${aioCite} / ${aioN}`, note: `AI Overview shown on ${aioN} of ${results.length} terms · ${today()}` };
writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
console.log("tiles:", top50, page12, `${aioCite}/${aioN}`);
