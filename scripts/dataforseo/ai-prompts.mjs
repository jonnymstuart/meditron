// Runs the AI prompts in data/tracking-list.csv through ChatGPT, Gemini and Perplexity (DataForSEO
// AI Optimization API) and records whether Meditron is named, whether meditron.ch is cited, and which
// domains are cited. Writes reports/data/ai-<date>.json. Usage: NODE_USE_ENV_PROXY=1 node scripts/dataforseo/ai-prompts.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dfs, today } from "./lib.mjs";
const rows = readFileSync(new URL("../../data/tracking-list.csv", import.meta.url), "utf8").trim().split("\n").slice(1)
  .map(l => { const m = l.match(/^([^,]*),([^,]*),([^,]*),(.*)$/); return { group: m[1], lang: m[2], keyword: m[3], prompt: m[4].replace(/^"|"$/g, "") }; });
const ENGINES = [
  { name: "chatgpt", path: "ai_optimization/chat_gpt/llm_responses/live", model: "gpt-5.5" },
  { name: "gemini", path: "ai_optimization/gemini/llm_responses/live", model: "gemini-3.5-flash" },
  { name: "perplexity", path: "ai_optimization/perplexity/llm_responses/live", model: "sonar-pro" },
];
const KNOWN = { "smdmedical.ch": "SMD Medical", "artmedicalsuisse.ch": "Art Medical Suisse", "mhzsa.ch": "MHZ", "codeo-medical.com": "Codeo", "lysis.cc": "Lysis", "mides.com": "Mides", "neurolite.ch": "Neurolite", "roentgen-service.ch": "Röntgen Service", "samsung.com": "Samsung", "samsunghealthcare.com": "Samsung" };
const dom = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } };
const out = [];
let spent = 0;
for (const r of rows) for (const e of ENGINES) {
  let rec = { ...r, engine: e.name, model: e.model, date: today(), ok: false };
  try {
    const tasks = await dfs(e.path, [{ user_prompt: r.prompt, model_name: e.model, web_search: true }]);
    const t = tasks[0]; spent += t.cost || 0;
    const res = t.result?.[0];
    const sections = (res?.items ?? []).flatMap(i => i.sections ?? []);
    const text = sections.map(s => s.text || "").join("\n");
    const cited = [...new Set(sections.flatMap(s => (s.annotations ?? []).map(a => dom(a.url)).filter(Boolean)))];
    const named = /meditron/i.test(text);
    const competitors = [...new Set([...Object.entries(KNOWN).filter(([d]) => cited.some(c => c.endsWith(d))).map(([, n]) => n), ...Object.values(KNOWN).filter(n => new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text))])].filter(n => n !== "Samsung");
    const firstMention = [["Meditron", text.search(/meditron/i)], ...competitors.map(n => [n, text.search(new RegExp(n, "i"))])].filter(([, i]) => i >= 0).sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
    rec = { ...rec, ok: true, meditron_named: named, meditron_cited: cited.some(c => c.endsWith("meditron.ch")), first_named: firstMention, competitors_named: competitors, cited_domains: cited.slice(0, 10), excerpt: text.replace(/\s+/g, " ").slice(0, 300), cost: t.cost };
  } catch (err) { rec.error = String(err.message).slice(0, 200); }
  out.push(rec);
  console.log(`${r.lang} ${e.name.padEnd(10)} ${rec.ok ? (rec.meditron_named ? "NAMED" : "-----") + (rec.meditron_cited ? "+cited" : "      ") : "ERR"} first=${rec.first_named ?? "-"} | ${r.prompt.slice(0, 50)} ${rec.error ?? ""}`);
}
const file = `reports/data/ai-${today()}.json`;
writeFileSync(file, JSON.stringify({ source: "DataForSEO AI Optimization API (ChatGPT gpt-5.5, Gemini 3.5 Flash, Perplexity sonar-pro), web search on", date: today(), results: out }, null, 1));
const ok = out.filter(r => r.ok);
console.log(`wrote ${file} · ${ok.length}/${out.length} ok · named ${ok.filter(r => r.meditron_named).length} · cited ${ok.filter(r => r.meditron_cited).length} · spent $${spent.toFixed(2)}`);
