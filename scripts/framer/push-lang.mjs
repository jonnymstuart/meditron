// French / Italian update of the Samsung scope (authorised by Jonny, 3 Nov 2026; rules in docs/15). Sister of push-de.mjs.
// 1. Models Z20/V8/R20/V7: values from content/<lang>/products/*.md (description, 10 spec rows, highlights, why, 4 FAQs, meta).
// 2. Probes: from content/<lang>/products/samsung-transducers.md (description, 5 spec rows, why, meta).
// 3. V4/V5/V6, FAQ rows, articles, legacy news: rule-based term fixes on the existing text (Swiss quote word, no "support", no "women's health", FR punctuation …).
// 4. Hub: new description, hero text, meta (FR); description and hero (IT); small SEO-intro fixes. 5. Any still-English "Who is Meditron?" answer.
// Usage: node scripts/framer/push-lang.mjs --lang=fr|it [--dry] [--only=products,hub,faq,news] [--publish]
import { readFileSync, writeFileSync } from "node:fs";
import { withFramer } from "./lib.mjs";
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").slice(k.length + 3);
const LANG = arg("lang"), DRY = process.argv.includes("--dry"), PUBLISH = process.argv.includes("--publish"), ONLY = arg("only");
if (!["fr", "it"].includes(LANG)) { console.error("--lang=fr|it required"); process.exit(1); }
const run = (step) => !ONLY || ONLY.split(",").includes(step);
const SCRATCH = "/tmp/claude-0/-home-user-meditron/194500fc-8658-52aa-ad35-f2d2c33b33d5/scratchpad";
const OUT = `${SCRATCH}/${LANG}-changes${ONLY ? "-" + ONLY.replace(/,/g, "+") : ""}.json`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const p = (s) => `<p dir="auto">${esc(s)}</p>`;
const F = { description: "VKK1rLOkt", highlights: "htnpvAE7_", why: "T6CfH6qEg", metaTitle: "yNO0L700R", metaDesc: "Fw8KRORIm", name: "krFC3FLEV",
  keys: ["a8Dv7KCyw","FE3Bghuvu","PjsWoh2zd","Q9AMtoLDz","aOyuBf41h","vhVilYGav","SbdX5INdb","wQ5pZVQVr","QHMw6KQYg","ECh9wGmzt"],
  vals: ["Tbj_vy63h","qzdeoLiMo","IQZRo2Wt4","VQvL6dl_G","CRACdCSo6","BzceDkif5","v9F_AjhtU","ofQLZrlVl","itkpMi72Z","P_90IpRTk"],
  q: ["DgtWCAqSG","rLcE_AA5B","YzTVKn3Aa","dFHEcNCRv"], a: ["R4BTWDCVh","JnvQbqY0v","zbg3y_eFj","wNA8ZUOAA"] };

// ---- per-language configuration ----
const CFG = {
  fr: {
    locale: "rRxiWhpq8", join: " et ",
    who: "Meditron SA est le distributeur officiel de Samsung Healthcare Ultrasound en Suisse depuis 2012, avec plus de 1 000 échographes Samsung installés et des sites à Rolle (VD) et Frauenfeld (TG).",
    hub: { Do36N6H8Z: "Votre partenaire échographie en Suisse : échographes Samsung pour cabinets et hôpitaux, appareils sans fil Clarius et systèmes Esaote pour la médecine vétérinaire. Conseil, installation, formation et service depuis Rolle et Frauenfeld.",
      rlfRq5S5x: "Samsung Healthcare construit des échographes pour la gynécologie-obstétrique, la radiologie et l'imagerie générale. Les mesures automatisées et la qualité d'image aident les médecins à conclure plus vite et plus sûrement.",
      fM1J_4KGB: "Échographes Samsung en Suisse : distributeur officiel | Meditron",
      YuxfDRp5D: "Échographes Samsung pour cabinets, cliniques et hôpitaux en Suisse. Distributeur officiel depuis 2012, plus de 1 000 systèmes installés, conseil et service après-vente en français." },
    introPre: [["devis personnalisés plutôt que des tarifs fixes", "une offre pour chaque configuration plutôt qu'un tarif"]],
    faqPre: { "ultrasound-1": [["La société Meditron est-elle", "Meditron est-elle"]] },
    whoRe: /Meditron SA (is|est) (the|le) (official|distributeur)/,
    rules: [
      // Swiss punctuation: no space before ? ! ; (space before : stays)
      [/(?:[   ]|&nbsp;)+([?!;])/g, "$1"],
      // quote word
      [/devis personnalisés/g, "offres personnalisées"], [/devis gratuit/g, "offre gratuite"], [/\b([Uu])n devis\b/g, "$1ne offre"], [/\b([Ll])e devis\b/g, "$1'offre"], [/\b([Cc])e devis\b/g, "$1ette offre"], [/\bdes devis\b/g, "des offres"], [/\bdevis\b/g, "offre"], [/\bDevis\b/g, "Offre"],
      // the machine is an échographe
      [/systèmes d['’]échographie/g, "échographes"], [/\b([Ll])e système d['’]échographie/g, "$1'échographe"], [/\bdu système d['’]échographie/g, "de l'échographe"], [/\bau système d['’]échographie/g, "à l'échographe"], [/\b([Cc])e système d['’]échographie/g, "$1et échographe"], [/\b([Uu])n système d['’]échographie/g, "$1n échographe"], [/système d['’]échographie/g, "échographe"],
      [/haut de gamme \(premium\)/g, "haut de gamme"],
      // model article: no elision before the brand name
      [/\bL['’]HERA\b/g, "Le HERA"], [/\bde l['’]HERA\b/g, "du HERA"], [/\bà l['’]HERA\b/g, "au HERA"], [/\bl['’]HERA\b/g, "le HERA"],
      // specialty and audience
      [/santé des femmes|santé de la femme|santé féminine/g, "gynécologie-obstétrique"], [/\b([Cc])liniciens\b/g, (m, c) => c === "C" ? "Médecins" : "médecins"], [/professionnels de (?:la )?santé/g, "médecins et hôpitaux"], [/prestataires de soins/g, "médecins et hôpitaux"],
      // no "support"
      [/support de maintenance/g, "service de maintenance"], [/support local/g, "service en Suisse"], [/support après[- ]vente/g, "service après-vente"], [/support technique/g, "assistance technique"], [/support logiciel/g, "mises à jour logicielles"], [/fin du support/g, "fin des mises à jour"],
      [/le meilleur service et support/g, "le meilleur service et la meilleure assistance"], [/\b([Uu])n support\b/g, "$1ne assistance"], [/\b([Ll])e support\b/g, "$1'assistance"], [/\bdu support\b/g, "de l'assistance"], [/\bau support\b/g, "à l'assistance"], [/\bde support\b/g, "d'assistance"], [/\bsupport\b/g, "assistance"], [/\bSupport\b/g, "Assistance"],
      // no "workflow": protocole(s) d'examen keeps gender and number
      [/outils de flux de travail intelligents/g, "assistants intelligents"], [/[Ff]lux de travail hépatique centralisé/g, "Bilan hépatique sur un seul appareil"], [/\b(des|les|ses|aux)[  ]flux de travail\b/g, "$1 protocoles d'examen"], [/Flux de travail/g, "Protocoles d'examen"], [/flux de travail/g, "protocole d'examen"],
      [/échographe médicale/g, "échographe médical"], [/assistance diagnostique avancé(?!e)/g, "assistance diagnostique avancée"], [/échographes vétérinaire\b/g, "échographes vétérinaires"], [/formation applicative/g, "formation d'application"],
      [/Suisse Romande/g, "Suisse romande"],
    ],
  },
  it: {
    locale: "D9HoCmqY1", join: " e ",
    who: "Meditron SA è dal 2012 il distributore ufficiale di Samsung Healthcare Ultrasound in Svizzera, con oltre 1'000 ecografi Samsung installati e sedi a Rolle (VD) e Frauenfeld (TG).",
    hub: { Do36N6H8Z: "Il vostro partner per l'ecografia in Svizzera: ecografi Samsung per studi medici e ospedali, sistemi wireless Clarius e soluzioni Esaote per la medicina veterinaria. Consulenza, installazione, formazione e assistenza da Rolle e Frauenfeld.",
      rlfRq5S5x: "Samsung Healthcare costruisce ecografi per ginecologia e ostetricia, radiologia e imaging generale. Misure automatiche e qualità d'immagine aiutano i medici a refertare più in fretta e con più sicurezza." },
    introPre: [],
    faqPre: {},
    whoRe: /Meditron SA (is|è) (the|il) (official|distributore)/,
    rules: [
      [/un preventivo/g, "un'offerta"], [/\bpreventivi\b/g, "offerte"], [/\bpreventivo\b/g, "offerta"],
      // supporto → assistenza with gender agreement; doubled "assistenza e assistenza" avoided by the specific rules first
      [/attività di supporto e assistenza/g, "attività di assistenza"], [/servizi di assistenza e supporto/g, "servizi di assistenza"], [/assistenza e supporto continui/g, "assistenza continua"], [/il miglior supporto e servizio/g, "la migliore assistenza e il miglior servizio"], [/il miglior servizio e supporto possibile/g, "il miglior servizio e la migliore assistenza possibile"],
      [/un supporto diagnostico avanzato/g, "un'assistenza diagnostica avanzata"], [/supporto diagnostico/g, "assistenza diagnostica"], [/un supporto affidabile/g, "un'assistenza affidabile"], [/supporto continuo/g, "assistenza continua"], [/supporto di manutenzione/g, "servizio di manutenzione"],
      [/supporto completo/g, "assistenza completa"], [/supporto locale/g, "assistenza in Svizzera"], [/supporto post[- ]vendita/g, "assistenza post-vendita"], [/supporto tecnico/g, "assistenza tecnica"], [/supporto software/g, "aggiornamenti software"], [/fine del supporto/g, "fine degli aggiornamenti software"], [/strumenti di workflow/g, "strumenti di assistenza all'esame"],
      [/\bun supporto\b/g, "un'assistenza"], [/assistenza diagnostica avanzata basato/g, "assistenza diagnostica avanzata basata"], [/\b([Ii])l supporto\b/g, (m, i) => i === "I" ? "L'assistenza" : "l'assistenza"], [/\bdel supporto\b/g, "dell'assistenza"], [/\bal supporto\b/g, "all'assistenza"], [/\bsupporto\b/g, "assistenza"], [/\bSupporto\b/g, "Assistenza"],
      [/per la salute della donna/g, "per ginecologia e ostetricia"], [/nella salute della donna/g, "in ginecologia e ostetricia"], [/della salute della donna/g, "di ginecologia e ostetricia"], [/salute della donna/g, "ginecologia e ostetricia"],
      [/\b(ai|i|per i|dei|agli) clinici\b/g, "$1 medici"], [/operatori sanitari|professionisti sanitari/g, "medici e ospedali"],
      [/\b([Ff])lussi di lavoro\b/g, (m, f) => f === "F" ? "Percorsi d'esame" : "percorsi d'esame"], [/\b([Ff])lusso di lavoro\b/g, (m, f) => f === "F" ? "Percorso d'esame" : "percorso d'esame"], [/\bworkflow\b/g, "percorso d'esame"],
      [/\bin SUI\b/g, "in Svizzera"], [/Meditron Switzerland/g, "Meditron Svizzera"], [/nella sua lingua/g, "nella vostra lingua"], [/Sfogliate/g, "Scoprite"],
      [/agli assicuratori malattia/g, "alla cassa malati"], [/assicuratori malattia/g, "cassa malati"], [/\b1\.000\b/g, "1'000"],
    ],
  },
}[LANG];
const LOC = CFG.locale;
const set = (type, value) => ({ type, valueByLocale: { [LOC]: { action: "set", value } } });
const locOf = (fd, f) => fd[f]?.valueByLocale?.[LOC]?.value ?? null;
// The API validator requires `value` (default locale) on every field we touch; keep the current EN value.
const complete = (updates, list) => { const byId = Object.fromEntries(list.map((i) => [i.id, i])); for (const u of updates) for (const [f, v] of Object.entries(u.fieldData)) if (v.value === undefined) { const cur = byId[u.id]?.fieldData[f]?.value; v.value = cur ?? (v.type === "formattedText" ? "<p></p>" : v.type === "string" ? "" : cur); } return updates; };
const HITS = [];
const fix = (s, where = "") => { if (!s) return s; let t = s; for (const [re, rep] of CFG.rules) { t = t.replace(re, (...m) => { const i = m[m.length - 2], src = m[m.length - 1]; const out = typeof rep === "function" ? rep(...m) : m[0].replace(re, rep); HITS.push(`${where}: …${src.slice(Math.max(0, i - 45), i)}[${m[0]} → ${out}]${src.slice(i + m[0].length, i + m[0].length + 35)}…`); return out; }); } return t; };

// ---- parsers (same shape as push-de.mjs) ----
function parseModel(slug) {
  const md = readFileSync(new URL(`../../content/${LANG}/products/${slug}.md`, import.meta.url), "utf8");
  const section = (h) => { const m = md.match(new RegExp(`\\n## ${h}\\n([\\s\\S]*?)(?=\\n## |$)`)); return m ? m[1].trim() : ""; };
  const fm = (k) => (md.match(new RegExp(`^${k}: "?([^"\\n]*?)"?\\s*$`, "m")) || [])[1]?.trim();
  const rows = section("Technical data").split("\n").filter((l) => l.startsWith("|") && !/^\|\s*(Key|---)/.test(l)).map((l) => l.split("|").slice(1, -1).map((s) => s.trim()));
  const faq = [...section("FAQ").matchAll(/### (.+)\n([\s\S]*?)(?=\n### |$)/g)].map((m) => [m[1].trim(), m[2].trim()]);
  return { id: fm("framer_id"), description: section("Description"), rows, faq, metaTitle: fm("meta_title"), metaDesc: fm("meta_description"),
    highlights: `<ul>${section("Highlights").split("\n").filter((l) => l.startsWith("- ")).map((l) => `<li>${esc(l.slice(2))}</li>`).join("")}</ul>`,
    why: section("Why work with Meditron").split("\n\n").map(p).join("") };
}
function parseProbes() {
  const md = readFileSync(new URL(`../../content/${LANG}/products/samsung-transducers.md`, import.meta.url), "utf8");
  const cols = ["slug","name","type","technology","frequency","applications","volume","description"];
  const rows = md.split("\n").filter((l) => l.startsWith("| samsung-")).map((l) => Object.fromEntries(l.split("|").slice(1, -1).map((s, i) => [cols[i], s.trim()])));
  const why = (md.match(/### Why work with Meditron\n\n([\s\S]*?)\n\n###/) || [])[1].trim();
  const metaT = (md.match(/meta_title: "([^"]+)"/) || [])[1], metaD = (md.match(/meta_description: "([^"]+)"/) || [])[1];
  const keys = [...md.matchAll(/^\d\. (.+)$/gm)].map((m) => m[1].trim());
  return { rows, why: p(why), metaT, metaD, keys };
}

const changes = []; const log = (where, field, before, after) => { if ((before ?? "") !== (after ?? "")) changes.push({ where, field, before: (before ?? "").toString().slice(0, 160), after: (after ?? "").toString().slice(0, 160) }); };

await withFramer(async (framer) => {
  const products = await framer.getCollection("IGaxjVLL3"); const items = await products.getItems(); const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
  const updates = [];
  // 1. models
  for (const slug of ["samsung-hera-z20","samsung-v8","samsung-r20","samsung-v7"]) {
    const c = parseModel(slug), it = bySlug[slug], fd = {};
    if (it.id !== c.id) throw new Error(`${slug}: framer_id mismatch ${it.id} vs ${c.id}`);
    fd[F.description] = set("string", c.description); fd[F.highlights] = set("formattedText", c.highlights); fd[F.why] = set("formattedText", c.why);
    fd[F.metaTitle] = set("string", c.metaTitle); fd[F.metaDesc] = set("string", c.metaDesc);
    F.keys.forEach((k, i) => { fd[k] = set("string", c.rows[i]?.[0] || ""); fd[F.vals[i]] = set("string", c.rows[i]?.[1] || ""); });
    c.faq.slice(0, 4).forEach(([q, a], i) => { fd[F.q[i]] = set("string", q); fd[F.a[i]] = set("formattedText", p(a)); });
    for (const [f, v] of Object.entries(fd)) log(slug, f, locOf(it.fieldData, f), v.valueByLocale[LOC].value);
    updates.push({ id: it.id, fieldData: fd }); console.log(`${slug}: ${c.rows.length} spec rows, ${c.faq.length} FAQs, ${c.highlights.split("<li>").length - 1} highlights`);
  }
  // 2. probes
  const pr = parseProbes(); if (pr.keys.length !== 5) throw new Error("probe spec keys: " + pr.keys.join("|"));
  for (const r of pr.rows) {
    const it = bySlug[r.slug]; if (!it) { console.warn("probe missing", r.slug); continue; }
    const systems = (it.fieldData.SWiYaC7ST?.value ?? []).map((id) => items.find((x) => x.id === id)?.fieldData[F.name]?.value).filter(Boolean).join(CFG.join) || "HERA Z20";
    const typeWord = r.type.split(" ")[0].toLowerCase();
    const fd = { [F.description]: set("string", r.description), [F.why]: set("formattedText", pr.why),
      [F.metaTitle]: set("string", pr.metaT.replace("{name}", r.name)), [F.metaDesc]: set("string", pr.metaD.replace("{name}", r.name).replace("{type}", typeWord).replace("{systems_names}", systems)) };
    [r.type, r.technology, r.frequency, r.applications, r.volume].forEach((v, i) => { fd[F.keys[i]] = set("string", pr.keys[i]); fd[F.vals[i]] = set("string", v); });
    for (const [f, v] of Object.entries(fd)) log(r.slug, f, locOf(it.fieldData, f), v.valueByLocale[LOC].value);
    updates.push({ id: it.id, fieldData: fd });
  }
  // 3. V4/V5/V6 term fixes
  for (const slug of ["samsung-v6","samsung-v5","samsung-v4"]) {
    const it = bySlug[slug], fd = {};
    for (const f of [F.description, F.metaTitle, F.metaDesc, ...F.keys.slice(0, 4), ...F.vals.slice(0, 4), ...F.q]) { const o = locOf(it.fieldData, f); const n = fix(o, slug); if (o && n !== o) { fd[f] = set("string", n); log(slug, f, o, n); } }
    for (const f of [F.why, ...F.a]) { const o = locOf(it.fieldData, f); const n = fix(o, slug); if (o && n !== o) { fd[f] = set("formattedText", n); log(slug, f, o, n); } }
    if (Object.keys(fd).length) updates.push({ id: it.id, fieldData: fd });
  }
  console.log("product updates:", updates.length, "| changes so far:", changes.length);
  if (!DRY && run("products")) await products.addItems(complete(updates, items)).catch((e) => console.warn("products addItems threw:", e.message));

  // 4. hub
  const sol = await framer.getCollection((await framer.getCollections()).find((c) => c.name === "Solutions").id);
  const hub = (await sol.getItems()).find((i) => i.slug === "ultrasound");
  const hfd = {}; for (const [f, v] of Object.entries(CFG.hub)) { log("hub", f, locOf(hub.fieldData, f), v); hfd[f] = set("string", v); }
  for (const f of ["fM1J_4KGB","YuxfDRp5D","BdZsbyW1A","g_ripwYUa","MZ6ahxHsM"]) { if (hfd[f]) continue; const o = locOf(hub.fieldData, f); const n = fix(o, "hub " + f); if (o && n !== o) { hfd[f] = set("string", n); log("hub", f, o, n); } }
  let intro = locOf(hub.fieldData, "yv1RziKgE"), intro2 = intro || ""; for (const [a, b] of CFG.introPre) intro2 = intro2.replace(a, b); intro2 = fix(intro2, "hub intro");
  if (intro && intro2 !== intro) { log("hub", "yv1RziKgE", intro, intro2); hfd.yv1RziKgE = set("formattedText", intro2); }
  if (!DRY && run("hub") && Object.keys(hfd).length) await sol.addItems(complete([{ id: hub.id, fieldData: hfd }], [hub])).catch((e) => console.warn("hub addItems threw:", e.message));

  // 5. FAQ rows (both fields are plain strings in this collection)
  const faq = await framer.getCollection("Y7o7IM_3D"); const rows = await faq.getItems(); const fu = [];
  for (const r of rows) {
    const q = locOf(r.fieldData, "vkOdkDocK"), a = locOf(r.fieldData, "hF3or4UG4"); let nq = q || "", na = a || "";
    for (const [x, y] of CFG.faqPre[r.slug] || []) nq = nq.replace(x, y);
    nq = fix(nq, "faq " + r.slug); na = fix(na, "faq " + r.slug);
    if (CFG.whoRe.test(a || "") && /\bis the official\b/.test(a || "")) na = CFG.who;
    const fd = {}; if (q && nq !== q) { fd.vkOdkDocK = set("string", nq); log("faq " + r.slug, "q", q, nq); } if (a && na !== a) { fd.hF3or4UG4 = set("string", na); log("faq " + r.slug, "a", a, na); }
    if (Object.keys(fd).length) fu.push({ id: r.id, fieldData: fd });
  }
  console.log("faq updates:", fu.length);
  if (!DRY && run("faq") && fu.length) await faq.addItems(complete(fu, rows)).catch((e) => console.warn("faq addItems threw:", e.message));

  // 6. articles and legacy news
  const news = await framer.getCollection("WUGvbtwAI"); const arts = await news.getItems(); const nu = [];
  for (const a of arts) {
    const t = locOf(a.fieldData, "xusWsRBZC"), i = locOf(a.fieldData, "Rzh74yeS0"), b = locOf(a.fieldData, "u4L7POZvL");
    const nt = fix(t, "news " + a.slug + " title"), ni = fix(i, "news " + a.slug + " intro"), nb = fix(b, "news " + a.slug + " body");
    const fd = {}; if (t && nt !== t) { fd.xusWsRBZC = set("string", nt); log("news " + a.slug, "title", t, nt); } if (i && ni !== i) { fd.Rzh74yeS0 = set("string", ni); log("news " + a.slug, "intro", i, ni); }
    if (b && nb !== b) { fd.u4L7POZvL = set("formattedText", nb); log("news " + a.slug, "body", "see hits", "rewritten"); }
    if (Object.keys(fd).length) nu.push({ id: a.id, fieldData: fd });
  }
  console.log("news updates:", nu.length);
  if (!DRY && run("news") && nu.length) await news.addItems(complete(nu, arts)).catch((e) => console.warn("news addItems threw:", e.message));

  writeFileSync(OUT, JSON.stringify(changes, null, 1)); writeFileSync(OUT.replace("changes", "hits"), HITS.join("\n")); console.log(`${DRY ? "DRY RUN, nothing written" : "written"}: ${changes.length} field changes logged to ${OUT}; ${HITS.length} rule hits`);
  if (!DRY && PUBLISH) { const pv = await framer.agent.publish({ action: "preview" }); console.log("preview:", pv.status, pv.publishTarget, "errors:", JSON.stringify(pv.errors));
    if (pv.publishTarget === "staging" && !pv.errors?.length) { const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: pv.confirmationHash }); console.log("staging:", c.status, c.message); } }
});
