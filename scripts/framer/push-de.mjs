// German update of the Samsung scope (authorised by Jonny, 3 Nov 2026; rules in docs/11 and docs/15).
// 1. Models Z20/V8/R20/V7: DE values from content/de/products/*.md (description, 10 spec rows, highlights, why, 4 FAQs, meta).
// 2. Probes: DE from content/de/products/samsung-transducers.md (description, 5 spec rows, why, meta).
// 3. V4/V5/V6, FAQ rows, articles, legacy news: rule-based term fixes on the existing DE text (ss, Spital, Offerte, Occasion, Ultraschallgerät …).
// 4. Hub: new DE description, hero text, meta title/description; small SEO-intro fixes. 5. Three "Wer ist Meditron?" answers still in English.
// Usage: node scripts/framer/push-de.mjs [--dry] [--publish]
import { readFileSync, writeFileSync } from "node:fs";
import { withFramer } from "./lib.mjs";
const DRY = process.argv.includes("--dry"), PUBLISH = process.argv.includes("--publish");
// --only=faq,news limits the writes to those steps (reads and logging still run for all); output file gets the suffix.
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7); const run = (step) => !ONLY || ONLY.split(",").includes(step);
const DE = "C9aJRu34X", OUT = "/tmp/claude-0/-home-user-meditron/194500fc-8658-52aa-ad35-f2d2c33b33d5/scratchpad/de-changes" + (ONLY ? "-" + ONLY.replace(/,/g, "+") : "") + ".json";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const p = (s) => `<p dir="auto">${esc(s)}</p>`;
const F = { description: "VKK1rLOkt", highlights: "htnpvAE7_", why: "T6CfH6qEg", metaTitle: "yNO0L700R", metaDesc: "Fw8KRORIm", name: "krFC3FLEV",
  keys: ["a8Dv7KCyw","FE3Bghuvu","PjsWoh2zd","Q9AMtoLDz","aOyuBf41h","vhVilYGav","SbdX5INdb","wQ5pZVQVr","QHMw6KQYg","ECh9wGmzt"],
  vals: ["Tbj_vy63h","qzdeoLiMo","IQZRo2Wt4","VQvL6dl_G","CRACdCSo6","BzceDkif5","v9F_AjhtU","ofQLZrlVl","itkpMi72Z","P_90IpRTk"],
  q: ["DgtWCAqSG","rLcE_AA5B","YzTVKn3Aa","dFHEcNCRv"], a: ["R4BTWDCVh","JnvQbqY0v","zbg3y_eFj","wNA8ZUOAA"] };
const set = (type, value, en) => ({ type, ...(en !== undefined ? { value: en } : {}), valueByLocale: { [DE]: { action: "set", value } } });
const deOf = (fd, f) => fd[f]?.valueByLocale?.[DE]?.value ?? null;
// The API validator requires `value` (default locale) on every field we touch; keep the current EN value.
const complete = (updates, list) => { const byId = Object.fromEntries(list.map((i) => [i.id, i])); for (const u of updates) for (const [f, v] of Object.entries(u.fieldData)) if (v.value === undefined) { const cur = byId[u.id]?.fieldData[f]?.value; v.value = cur ?? (v.type === "formattedText" ? "<p></p>" : v.type === "string" ? "" : cur); } return updates; };

// ---- rule-based fixes for existing German (order matters) ----
const RULES = [
  [/ß/g, "ss"],
  [/Krankenhäusern/g, "Spitälern"], [/Krankenhäuser/g, "Spitäler"], [/Krankenhauses/g, "Spitals"], [/Krankenhaus/g, "Spital"],
  [/Klinikern/g, "Ärztinnen und Ärzten"], [/Kliniker\b/g, "Ärztinnen und Ärzte"],
  [/für die Frauengesundheit/g, "für Gynäkologie und Geburtshilfe"], [/Frauengesundheit/g, "Gynäkologie und Geburtshilfe"],
  [/Gesundheitsdienstleistern/g, "Praxen und Spitälern"], [/Gesundheitsdienstleister/g, "Praxen und Spitäler"],
  // Angebot → Offerte with gender/case agreement
  [/\b([Ee])in ((?:[A-Za-zÄÖÜäöü-]+es )+)Angebot\b/g, (m, e, adjs) => `${e}ine ${adjs.replace(/es /g, "e ")}Offerte`], [/\b([Ee])in Schweizer Angebot\b/g, "$1ine Schweizer Offerte"], [/\b([Ee])in Angebot\b/g, "$1ine Offerte"],
  [/\b([Kk])ein Angebot\b/g, "$1eine Offerte"], [/\b([Dd])as Angebot\b/g, "$1ie Offerte"], [/\b([Dd])ieses Angebot\b/g, "$1iese Offerte"], [/\b([Jj])edes Angebot\b/g, "$1ede Offerte"],
  [/\b([Uu])nser Angebot\b/g, "$1nsere Offerte"], [/\b([Ii])hr Angebot\b/g, "$1hre Offerte"], [/\b([Uu])nserem Angebot\b/g, "$1nserer Offerte"], [/\b([Ii])hrem Angebot\b/g, "$1hrer Offerte"],
  [/\bim Angebot\b/g, "in der Offerte"], [/\bzum Angebot\b/g, "zur Offerte"], [/\bvom Angebot\b/g, "von der Offerte"], [/\bdem Angebot\b/g, "der Offerte"], [/\bdes Angebots\b/g, "der Offerte"], [/\beinem Angebot\b/g, "einer Offerte"], [/\beines Angebots\b/g, "einer Offerte"],
  [/\bAngeboten\b/g, "Offerten"], [/\bAngebote\b/g, "Offerten"], [/\bAngebots?\b/g, "Offerte"],
  // gebraucht → Occasion
  [/Gebrauchtgerät/g, "Occasionsgerät"],
  [/\b([Gg])ebrauchte(?:s|n|r|m)?\s+(Samsung[- ])?Ultraschall(?:gerät|system)(e|en|s)?\b/g, (m, g, sam, pl) => `${sam ? "Samsung " : ""}Occasionsgerät${pl ?? ""}`],
  [/\b([Gg])ebrauchte(?:s|n|r|m)?\s+System(e|en|s)?\b/g, (m, g, pl) => `Occasionsgerät${pl ?? ""}`], [/gebraucht kaufen/g, "als Occasion kaufen"],
  [/Neu, gebraucht oder Leasing/g, "Neu, Occasion oder Leasing"], [/Neu oder gebraucht\b/g, "Neu oder Occasion"], [/Gebrauchtmarkt/g, "Occasionsmarkt"],
  [/\b([Gg])ebrauchte(?:s|n|r|m)?\s+Samsung-System(e|en|s)?\b/g, (m, g, pl) => `Samsung Occasionsgerät${pl ?? ""}`], [/Ende des Supports/g, "Ende der Software-Updates"],
  [/Ultraschallsystemen/g, "Ultraschallgeräten"], [/Ultraschallsysteme/g, "Ultraschallgeräte"], [/Ultraschallsystems/g, "Ultraschallgeräts"], [/Ultraschallsystem/g, "Ultraschallgerät"],
  [/Workflow-Tools/g, "Assistenzfunktionen"], [/Workflow-Effizienz/g, "Effizienz im Praxisalltag"], [/Workflows/g, "Arbeitsabläufe"], [/Workflow/g, "Arbeitsablauf"],
  [/\b1\.000\b/g, "1'000"], [/\b1000 installierten\b/g, "1'000 installierten"],
  [/Service und Support/g, "Service und Betreuung"], [/Support (?:&amp;|&|und) Service/g, "Service und Betreuung"], [/Software-Support/g, "Software-Updates"], [/lokalen Support/g, "Service vor Ort"], [/Wartungssupport/g, "Wartung und Service"], [/\bSupport\b/g, "Service"],
];
const HITS = [];
const fix = (s, where = "") => { if (!s) return s; let t = s; for (const [re, rep] of RULES) { t = t.replace(re, (...m) => { const i = m[m.length - 2], src = m[m.length - 1]; const out = typeof rep === "function" ? rep(...m) : m[0].replace(re, rep); HITS.push(`${where}: …${src.slice(Math.max(0, i - 45), i)}[${m[0]} → ${out}]${src.slice(i + m[0].length, i + m[0].length + 35)}…`); return out; }); } return t; };

// ---- parsers (same shape as push-product.mjs) ----
function parseModel(slug) {
  const md = readFileSync(new URL(`../../content/de/products/${slug}.md`, import.meta.url), "utf8");
  const section = (h) => { const m = md.match(new RegExp(`\\n## ${h}\\n([\\s\\S]*?)(?=\\n## |$)`)); return m ? m[1].trim() : ""; };
  const fm = (k) => (md.match(new RegExp(`^${k}: "?([^"\\n]*?)"?\\s*$`, "m")) || [])[1]?.trim();
  const rows = section("Technical data").split("\n").filter((l) => l.startsWith("|") && !/^\|\s*(Key|---)/.test(l)).map((l) => l.split("|").slice(1, -1).map((s) => s.trim()));
  const faq = [...section("FAQ").matchAll(/### (.+)\n([\s\S]*?)(?=\n### |$)/g)].map((m) => [m[1].trim(), m[2].trim()]);
  return { id: fm("framer_id"), description: section("Description"), rows, faq, metaTitle: fm("meta_title"), metaDesc: fm("meta_description"),
    highlights: `<ul>${section("Highlights").split("\n").filter((l) => l.startsWith("- ")).map((l) => `<li>${esc(l.slice(2))}</li>`).join("")}</ul>`,
    why: section("Why work with Meditron").split("\n\n").map(p).join("") };
}
function parseProbes() {
  const md = readFileSync(new URL(`../../content/de/products/samsung-transducers.md`, import.meta.url), "utf8");
  const cols = ["slug","name","type","technology","frequency","applications","volume","description"];
  const rows = md.split("\n").filter((l) => l.startsWith("| samsung-")).map((l) => Object.fromEntries(l.split("|").slice(1, -1).map((s, i) => [cols[i], s.trim()])));
  const why = (md.match(/### Why work with Meditron\n\n([\s\S]*?)\n\n###/) || [])[1].trim();
  const metaT = (md.match(/meta_title: "([^"]+)"/) || [])[1], metaD = (md.match(/meta_description: "([^"]+)"/) || [])[1];
  return { rows, why: p(why), metaT, metaD, keys: ["Typ","Technologie","Nominaler Frequenzbereich","Anwendungen","3D/4D-Volumenbildgebung"] };
}

const changes = []; const log = (where, field, before, after) => { if ((before ?? "") !== (after ?? "")) changes.push({ where, field, before: (before ?? "").toString().slice(0, 160), after: (after ?? "").toString().slice(0, 160) }); };

await withFramer(async (framer) => {
  const products = await framer.getCollection("IGaxjVLL3"); const items = await products.getItems(); const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
  const updates = [];
  // 1. models
  for (const slug of ["samsung-hera-z20","samsung-v8","samsung-r20","samsung-v7"]) {
    const c = parseModel(slug), it = bySlug[slug], fd = {};
    fd[F.description] = set("string", c.description); fd[F.highlights] = set("formattedText", c.highlights); fd[F.why] = set("formattedText", c.why);
    fd[F.metaTitle] = set("string", c.metaTitle); fd[F.metaDesc] = set("string", c.metaDesc);
    F.keys.forEach((k, i) => { fd[k] = set("string", c.rows[i]?.[0] || ""); fd[F.vals[i]] = set("string", c.rows[i]?.[1] || ""); });
    c.faq.slice(0, 4).forEach(([q, a], i) => { fd[F.q[i]] = set("string", q); fd[F.a[i]] = set("formattedText", p(a)); });
    for (const [f, v] of Object.entries(fd)) log(slug, f, deOf(it.fieldData, f), v.valueByLocale[DE].value);
    updates.push({ id: it.id, fieldData: fd }); console.log(`${slug}: ${c.rows.length} spec rows, ${c.faq.length} FAQs, ${c.highlights.split("<li>").length - 1} highlights`);
  }
  // 2. probes
  const pr = parseProbes(); const sysName = (s) => bySlug[s]?.fieldData[F.name]?.value ?? s;
  for (const r of pr.rows) {
    const it = bySlug[r.slug]; if (!it) { console.warn("probe missing", r.slug); continue; }
    const systems = (it.fieldData.SWiYaC7ST?.value ?? []).map((id) => items.find((x) => x.id === id)?.fieldData[F.name]?.value).filter(Boolean).join(" und ") || "HERA Z20";
    const fd = { [F.description]: set("string", r.description), [F.why]: set("formattedText", pr.why),
      [F.metaTitle]: set("string", pr.metaT.replace("{name}", r.name)), [F.metaDesc]: set("string", pr.metaD.replace("{name}", r.name).replace("{type}", r.type.split(" ")[0]).replace("{systems_names}", systems)) };
    [r.type, r.technology, r.frequency, r.applications, r.volume].forEach((v, i) => { fd[F.keys[i]] = set("string", pr.keys[i]); fd[F.vals[i]] = set("string", v); });
    for (const [f, v] of Object.entries(fd)) log(r.slug, f, deOf(it.fieldData, f), v.valueByLocale[DE].value);
    updates.push({ id: it.id, fieldData: fd });
  }
  // 3. V4/V5/V6 term fixes
  for (const slug of ["samsung-v6","samsung-v5","samsung-v4"]) {
    const it = bySlug[slug], fd = {};
    for (const f of [F.description, F.metaTitle, F.metaDesc, ...F.keys.slice(0, 4), ...F.vals.slice(0, 4), ...F.q]) { const o = deOf(it.fieldData, f); const n = fix(o, slug); if (o && n !== o) { fd[f] = set("string", n); log(slug, f, o, n); } }
    for (const f of [F.why, ...F.a]) { const o = deOf(it.fieldData, f); const n = fix(o, slug); if (o && n !== o) { fd[f] = set("formattedText", n); log(slug, f, o, n); } }
    if (Object.keys(fd).length) updates.push({ id: it.id, fieldData: fd });
  }
  console.log("product updates:", updates.length, "| changes so far:", changes.length);
  if (!DRY && run("products")) await products.addItems(complete(updates, items)).catch((e) => console.warn("products addItems threw (known):", e.message));

  // 4. hub
  const sol = await framer.getCollection((await framer.getCollections()).find((c) => c.name === "Solutions").id);
  const hub = (await sol.getItems()).find((i) => i.slug === "ultrasound");
  const HUB = { Do36N6H8Z: "Ihr Partner für Ultraschall in der Schweiz: Samsung Ultraschallgeräte für Praxis und Spital, kabellose Clarius Handhelds und Esaote Lösungen für die Veterinärmedizin. Beratung, Installation, Schulung und Service aus Rolle und Frauenfeld.",
    rlfRq5S5x: "Samsung Healthcare baut Ultraschallgeräte für Gynäkologie und Geburtshilfe, Radiologie und die allgemeine Bildgebung. Automatisierte Messungen und klare Bilder helfen Ärztinnen und Ärzten, schneller und sicherer zu befunden.",
    fM1J_4KGB: "Samsung Ultraschallgeräte Schweiz: Geräte, Beratung, Service | Meditron",
    YuxfDRp5D: "Samsung Ultraschallgeräte für Praxen, Kliniken und Spitäler in der Schweiz. Offizieller Distributor seit 2012, über 1'000 installierte Geräte, Beratung und Service in Ihrer Sprache." };
  const hfd = {}; for (const [f, v] of Object.entries(HUB)) { log("hub", f, deOf(hub.fieldData, f), v); hfd[f] = set("string", v); }
  const intro = deOf(hub.fieldData, "yv1RziKgE"); const intro2 = fix(intro, "hub intro").replace("für Routine und mehrere Fachrichtungen", "für die Routine und gemischte Praxen");
  if (intro2 !== intro) { log("hub", "yv1RziKgE", intro, intro2); hfd.yv1RziKgE = set("formattedText", intro2); }
  for (const f of ["BdZsbyW1A","g_ripwYUa"]) { const o = deOf(hub.fieldData, f), n = fix(o, "hub " + f); if (o && n !== o) { log("hub", f, o, n); hfd[f] = set("string", n); } }
  if (!DRY && run("hub")) await sol.addItems(complete([{ id: hub.id, fieldData: hfd }], [hub])).catch((e) => console.warn("hub addItems threw (known):", e.message));

  // 5. FAQ rows (the answer field hF3or4UG4 is a plain string in this collection, not formattedText)
  const faq = await framer.getCollection("Y7o7IM_3D"); const rows = await faq.getItems(); const fu = [];
  const WER = "Meditron SA ist seit 2012 der offizielle Distributor von Samsung Healthcare Ultraschall in der Schweiz, mit über 1'000 installierten Samsung Ultraschallgeräten und Standorten in Rolle (VD) und Frauenfeld (TG).";
  for (const r of rows) {
    const q = deOf(r.fieldData, "vkOdkDocK"), a = deOf(r.fieldData, "hF3or4UG4"); let nq = fix(q, "faq " + r.slug), na = fix(a, "faq " + r.slug);
    if (r.slug === "ultrasound-1") nq = nq.replace("Händler", "Distributor");
    if (/^Wer ist Meditron\?/.test(q || "") && /Meditron SA is the official/.test(a || "")) na = WER;
    const fd = {}; if (nq !== q) { fd.vkOdkDocK = set("string", nq); log("faq " + r.slug, "q", q, nq); } if (na !== a) { fd.hF3or4UG4 = set("string", na); log("faq " + r.slug, "a", a, na); }
    if (Object.keys(fd).length) fu.push({ id: r.id, fieldData: fd });
  }
  console.log("faq updates:", fu.length);
  if (!DRY && run("faq") && fu.length) await faq.addItems(complete(fu, rows)).catch((e) => console.warn("faq addItems threw (known):", e.message));

  // 6. articles and legacy news
  const news = await framer.getCollection("WUGvbtwAI"); const arts = await news.getItems(); const nu = [];
  const TITLES = { "which-samsung-ultrasound-system-for-my-practice": "Welches Samsung Ultraschallgerät passt zu meiner Praxis?", "samsung-ultrasound-price-switzerland": "Was kostet ein Samsung Ultraschallgerät in der Schweiz?", "new-or-pre-owned-ultrasound-system": "Ultraschallgerät neu oder Occasion: Was Sie vor dem Kauf prüfen sollten" };
  for (const a of arts) {
    const t = deOf(a.fieldData, "xusWsRBZC"), i = deOf(a.fieldData, "Rzh74yeS0"), b = deOf(a.fieldData, "u4L7POZvL");
    let nt = TITLES[a.slug] ?? fix(t, "news " + a.slug + " title"), ni = fix(i, "news " + a.slug + " intro"), nb = fix(b, "news " + a.slug + " body");
    if (a.slug === "samsung-ultrasound-price-switzerland") { ni = (ni || "").replace("Es gibt nicht wirklich einen festgelegten Listenpreis.", "Einen Listenpreis gibt es nicht."); nb = (nb || "").replace("Es gibt nicht wirklich einen festgelegten Listenpreis.", "Einen Listenpreis gibt es nicht."); }
    const fd = {}; if (t && nt !== t) { fd.xusWsRBZC = set("string", nt); log("news " + a.slug, "title", t, nt); } if (i && ni !== i) { fd.Rzh74yeS0 = set("string", ni); log("news " + a.slug, "intro", i, ni); }
    if (b && nb !== b) { fd.u4L7POZvL = set("formattedText", nb); log("news " + a.slug, "body", `${(b.match(/Angebot|Gebraucht|Ultraschallsystem|Workflow|ß|Krankenh|1\.000|Kliniker/g) || []).length} pattern hits`, "rewritten"); }
    if (Object.keys(fd).length) nu.push({ id: a.id, fieldData: fd });
  }
  console.log("news updates:", nu.length);
  if (!DRY && run("news") && nu.length) await news.addItems(complete(nu, arts)).catch((e) => console.warn("news addItems threw (known):", e.message));

  writeFileSync(OUT, JSON.stringify(changes, null, 1)); writeFileSync(OUT.replace("changes","hits"), HITS.join("\n")); console.log(`${DRY ? "DRY RUN, nothing written" : "written"}: ${changes.length} field changes logged to ${OUT}`);
  if (!DRY && PUBLISH) { const pv = await framer.agent.publish({ action: "preview" }); console.log("preview:", pv.status, pv.publishTarget, "errors:", JSON.stringify(pv.errors));
    if (pv.publishTarget === "staging" && !pv.errors?.length) { const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: pv.confirmationHash }); console.log("staging:", c.status, c.message); } }
});
