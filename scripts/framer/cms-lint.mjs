// Products CMS check: every visible product, EN/DE/FR/IT, against the SEO rules editors must follow.
// Writes reports/cms-lint-<date>.md and prints a summary. Read-only: it never changes the CMS.
// Usage: node scripts/framer/cms-lint.mjs   (run before every publish and in the Monday report)
import { withFramer } from "./lib.mjs";
import { writeFileSync } from "node:fs";
import { LIMITS, FAQ_Q, FAQ_A } from "./cms-fields.mjs";

const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const raw = (v, l) => String((L[l] ? v?.valueByLocale?.[L[l]]?.value : v?.value) ?? "");
const txt = (v, l) => raw(v, l).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const NAME = "krFC3FLEV", H1 = "qFsZD3PuD", DESC = "VKK1rLOkt", MT = "yNO0L700R", MD = "Fw8KRORIm";
const KEYS = ["a8Dv7KCyw", "FE3Bghuvu", "PjsWoh2zd", "Q9AMtoLDz", "aOyuBf41h", "vhVilYGav", "SbdX5INdb", "wQ5pZVQVr", "QHMw6KQYg", "ECh9wGmzt"];
const VALS = ["Tbj_vy63h", "qzdeoLiMo", "IQZRo2Wt4", "VQvL6dl_G", "CRACdCSo6", "BzceDkif5", "v9F_AjhtU", "ofQLZrlVl", "itkpMi72Z", "P_90IpRTk"];
const RICH = { htnpvAE7_: "Benefits", T6CfH6qEg: "Why Work With Meditron" };
const IMAGES = { Dh60jX8lX: "Thumbnail", G8s0uckMp: "Main Image" };
const ERR = "error", WARN = "warning";

await withFramer(async (f) => {
  const c = await f.getCollection("IGaxjVLL3");
  const names = Object.fromEntries((await c.getFields()).map(x => [x.id, x.name]));
  const items = (await c.getItems()).filter(i => i.fieldData.HvB4OLS27?.value !== false);
  const issues = [];
  const add = (sev, rule, item, l, field, detail) => issues.push({ sev, rule, slug: item.slug, l, field: names[field] ?? field, detail });
  const seenTitle = {};
  for (const i of items) {
    const fd = i.fieldData;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.slug)) add(WARN, "URL slug not lowercase-with-hyphens (change only with a redirect)", i, "all", "slug", i.slug);
    for (const [id, n] of Object.entries(IMAGES)) if (!fd[id]?.value) add(ERR, "Image missing", i, "all", id, n);
    for (const l of Object.keys(L)) {
      // Required SEO fields
      for (const id of [NAME, H1, DESC, MT, MD]) if (!txt(fd[id], l)) add(ERR, "Required field empty", i, l, id, "");
      // Length limits from the field names
      for (const [id, [, min, max]] of Object.entries(LIMITS)) {
        const s = txt(fd[id], l); if (!s) continue;
        if (s.length > max) add([MT, MD, H1].includes(id) && s.length > max + 5 ? ERR : WARN, "Too long", i, l, id, `${s.length} > ${max}: ${s.slice(0, 70)}…`);
        else if (s.length < min && [MT, MD, DESC].includes(id)) add(WARN, "Too short", i, l, id, `${s.length} < ${min}: ${s}`);
      }
      const t = txt(fd[MT], l), d = txt(fd[MD], l), h = txt(fd[H1], l);
      if (/(…|\.\.\.)$/.test(d)) add(WARN, "Meta Description cut off (ends in …)", i, l, MD, d.slice(-60));
      if (t && !/Meditron/.test(t)) add(WARN, "Meta Title without 'Meditron'", i, l, MT, t);
      if (t) { const k = l + "|" + t.toLowerCase(); if (seenTitle[k]) add(ERR, "Duplicate Meta Title", i, l, MT, `same as ${seenTitle[k]}`); else seenTitle[k] = i.slug; }
      if (h.length > 5 && h === h.toUpperCase() && /[A-Z]{4}/.test(h)) add(WARN, "H1 in capitals", i, l, H1, h);
      if (l !== "en") for (const id of [MT, MD, DESC]) { const s = txt(fd[id], l); if (s && s === txt(fd[id], "en") && s.length > 40) add(WARN, "Not translated (same as EN)", i, l, id, s.slice(0, 60)); }
      // Swiss conventions
      const all = [NAME, H1, DESC, MT, MD, ...KEYS, ...VALS, ...FAQ_Q, ...FAQ_A, ...Object.keys(RICH)].map(id => [id, txt(fd[id], l)]);
      for (const [id, s] of all) {
        if (l === "de" && s.includes("ß")) add(ERR, "ß instead of ss (Swiss German)", i, l, id, s.slice(Math.max(0, s.indexOf("ß") - 30), s.indexOf("ß") + 30));
        if (l === "it" && /Meditron Switzerland/.test(s)) add(ERR, "IT text says 'Switzerland'", i, l, id, s.slice(0, 60));
        if (/(CHF|Fr\.)\s?\d|\d['’.,]?\d*\s?(CHF|Franken|francs)\b|\d+\.[-–]/.test(s)) add(ERR, "Price in copy (no pricing rule)", i, l, id, s.slice(0, 80));
      }
      // No bold in content we write
      for (const id of [...Object.keys(RICH), DESC]) if (/<(strong|b)[\s>]/i.test(raw(fd[id], l))) add(WARN, "Bold text (house style: no bold)", i, l, id, "");
      // Pairs that must come together
      KEYS.forEach((k, n) => { const a = txt(fd[k], l), b = txt(fd[VALS[n]], l); if (!!a !== !!b) add(ERR, "Technical Data row half filled", i, l, a ? k : VALS[n], a || b); });
      FAQ_Q.forEach((q, n) => { const a = txt(fd[q], l), b = txt(fd[FAQ_A[n]], l); if (a && !b) add(ERR, "FAQ question without answer", i, l, q, a); if (!a && b) add(ERR, "FAQ answer without question", i, l, FAQ_A[n], b.slice(0, 60)); });
    }
  }
  // Report
  const date = new Date().toISOString().slice(0, 10);
  const byRule = {}; for (const x of issues) (byRule[x.sev + "|" + x.rule] ??= []).push(x);
  const errs = issues.filter(x => x.sev === ERR).length, warns = issues.length - errs;
  let md = `# Products CMS check (${date})\n\nSource: Framer CMS, collection Products, ${items.length} visible products × 4 languages. Script: \`scripts/framer/cms-lint.mjs\`.\n\n`;
  md += `Errors: ${errs}. Warnings: ${warns}. Errors should be fixed before publishing; warnings when the product is next edited.\n\n| Severity | Rule | Count |\n|---|---|---|\n`;
  const keys = Object.keys(byRule).sort();
  for (const k of keys) { const [sev, rule] = k.split("|"); md += `| ${sev} | ${rule} | ${byRule[k].length} |\n`; }
  for (const k of keys) {
    const [sev, rule] = k.split("|"); md += `\n## ${rule} (${sev}, ${byRule[k].length})\n\n| Product | Lang | Field | Detail |\n|---|---|---|---|\n`;
    for (const x of byRule[k]) md += `| ${x.slug} | ${x.l} | ${x.field} | ${String(x.detail).replace(/\|/g, "/").replace(/\n/g, " ")} |\n`;
  }
  const out = new URL(`../../reports/cms-lint-${date}.md`, import.meta.url);
  writeFileSync(out, md);
  writeFileSync(new URL(`../../reports/data/cms-lint-${date}.json`, import.meta.url), JSON.stringify(issues, null, 1));
  console.log(`products ${items.length} | errors ${errs} | warnings ${warns} | report ${out.pathname}`);
  for (const k of keys) console.log(" ", k.replace("|", ": "), byRule[k].length);
});
