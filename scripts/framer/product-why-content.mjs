// Product pages, "Why work with Meditron" in the hub's two-column design (18 Nov). For every product with the Why
// field (T6CfH6qEg, the seven Samsung models): T6CfH6qEg keeps only the intro paragraph; new Products fields
// "Why Side" (three H4 + sentence items, model name inserted), "Reading Intro" (H3 + one line) and "Reading"
// (each guide as a linked H4 + one sentence from the article's Introduction field; links go to the article in the
// page's language). EN/DE/FR/IT. Only products whose Why field has real text.
// Usage: node scripts/framer/product-why-content.mjs [--dry]
import { withFramer } from "./lib.mjs";
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const PFX = { en: "", de: "/de", fr: "/fr", it: "/it" };
const NEW = { side: "Why Side", readIntro: "Reading Intro", reading: "Reading" };
const art = m => ({ de: "das", fr: "le", it: /^[AEIOUH]/i.test(m.replace(/^Samsung /, "")) ? "l'" : "il" });
const SIDE = {
  en: m => `<h4>Official Samsung distributor since 2012</h4><p>Original systems and original warranty, with a direct line to Samsung Healthcare.</p><h4>Installation and training</h4><p>Our application specialists install the ${m} and train your team on site.</p><h4>Service in your language</h4><p>Service and repair in Switzerland, in German, French and Italian.</p>`,
  de: m => `<h4>Offizieller Samsung-Distributor seit 2012</h4><p>Original-Geräte und Original-Garantie, mit direktem Draht zu Samsung Healthcare.</p><h4>Installation und Schulung</h4><p>Unsere Applikationsspezialisten installieren das ${m} und schulen Ihr Team vor Ort.</p><h4>Service in Ihrer Sprache</h4><p>Service und Reparatur in der Schweiz, auf Deutsch, Französisch und Italienisch.</p>`,
  fr: m => `<h4>Distributeur officiel Samsung depuis 2012</h4><p>Systèmes et garantie d'origine, avec un lien direct avec Samsung Healthcare.</p><h4>Installation et formation</h4><p>Nos spécialistes d'application installent le ${m} et forment votre équipe sur place.</p><h4>Un service dans votre langue</h4><p>Service et réparation en Suisse, en français, allemand et italien.</p>`,
  it: m => `<h4>Distributore ufficiale Samsung dal 2012</h4><p>Sistemi e garanzia originali, con un contatto diretto con Samsung Healthcare.</p><h4>Installazione e formazione</h4><p>I nostri specialisti applicativi installano ${art(m).it === "l'" ? "l'" : "il "}${m} e formano il vostro team in sede.</p><h4>Assistenza nella vostra lingua</h4><p>Assistenza e riparazione in Svizzera, in italiano, tedesco e francese.</p>`,
};
const SYSTEMS = ["samsung-hera-z20", "samsung-r20", "samsung-v8", "samsung-v7", "samsung-v6", "samsung-v5", "samsung-v4"];
const PROBE2 = { // probes: second item without "install the <model>"
  en: ["Installation and training", "Set-up and training", "Our application specialists set up the probe on your Samsung system and train your team on site."],
  de: ["Installation und Schulung", "Einrichtung und Schulung", "Unsere Applikationsspezialisten richten den Schallkopf an Ihrem Samsung Gerät ein und schulen Ihr Team vor Ort."],
  fr: ["Installation et formation", "Mise en service et formation", "Nos spécialistes d'application configurent la sonde sur votre échographe Samsung et forment votre équipe sur place."],
  it: ["Installazione e formazione", "Configurazione e formazione", "I nostri specialisti applicativi configurano la sonda sul vostro ecografo Samsung e formano il vostro team in sede."] };
const sideFor = (l, slug, model) => { let h = SIDE[l](model); if (!SYSTEMS.includes(slug)) { const [a, b, c] = PROBE2[l]; h = h.replace(new RegExp(`<h4>${a}</h4><p>[^<]*</p>`), `<h4>${b}</h4><p>${c}</p>`); } return h; };
const LEAD = { en: "Guides from our team to help you compare and choose.", de: "Ratgeber unseres Teams, die Ihnen beim Vergleichen und Auswählen helfen.", fr: "Les guides de notre équipe pour vous aider à comparer et à choisir.", it: "Le guide del nostro team per aiutarvi a confrontare e scegliere." };
const sentence = s => { const parts = String(s ?? "").replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/); let out = ""; for (const p of parts) { if (out && (out + " " + p).length > 220) break; out = out ? out + " " + p : p; if (out.length >= 70) break; } return out; };
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const prod = await f.getCollection("IGaxjVLL3"); let fields = await prod.getFields();
  const miss = Object.values(NEW).filter(n => !fields.some(x => x.name === n));
  if (miss.length && !dry) { await prod.addFields(miss.map(name => ({ type: "formattedText", name }))); fields = await prod.getFields(); }
  const id = Object.fromEntries(Object.entries(NEW).map(([k, n]) => [k, fields.find(x => x.name === n)?.id ?? `(new:${n})`]));
  console.log("fields:", JSON.stringify(id));
  const news = await (await f.getCollection("WUGvbtwAI")).getItems();
  const findArt = href => { const s = href.split("/").pop(); return news.find(n => n.slug === s || Object.values(L).some(l => l && n.slugByLocale?.[l]?.value === s)); };
  const upd = [];
  for (const it of (await prod.getItems()).filter(i => String(i.fieldData.T6CfH6qEg?.value ?? "").replace(/<[^>]+>/g, "").trim())) {
    const model = it.fieldData.VtLBeQb6s?.value || it.fieldData.krFC3FLEV?.value; const fd = { T6CfH6qEg: { valueByLocale: {} }, [id.side]: { valueByLocale: {} }, [id.readIntro]: { valueByLocale: {} }, [id.reading]: { valueByLocale: {} } };
    for (const l of Object.keys(L)) {
      const cur = String((L[l] ? it.fieldData.T6CfH6qEg.valueByLocale?.[L[l]]?.value : it.fieldData.T6CfH6qEg.value) ?? "");
      const lead = cur.match(/<p[^>]*>[\s\S]*?<\/p>/)?.[0] ?? "";
      const h3 = cur.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? { en: "Further reading", de: "Weiterlesen", fr: "À lire aussi", it: "Approfondimenti" }[l];
      const links = [...cur.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => ({ href: m[1], title: m[2] }));
      const reading = links.map(({ href, title }) => { const a = findArt(href); if (a) href = `${PFX[l]}/news-events/${l === "en" ? a.slug : (a.slugByLocale?.[L[l]]?.value || a.slug)}`; const intro = a ? (L[l] ? a.fieldData.Rzh74yeS0?.valueByLocale?.[L[l]]?.value : a.fieldData.Rzh74yeS0?.value) : ""; return `<h4><a href="${href}">${title}</a></h4>${intro ? `<p>${esc(sentence(intro))}</p>` : ""}`; }).join("");
      const vals = { T6CfH6qEg: lead, [id.side]: sideFor(l, it.slug, model), [id.readIntro]: links.length ? `<h3>${h3}</h3><p>${LEAD[l]}</p>` : "", [id.reading]: reading };
      for (const [k, v] of Object.entries(vals)) { if (l === "en") fd[k].value = v; else fd[k].valueByLocale[L[l]] = { action: "set", value: v }; }
    }
    for (const k of Object.keys(fd)) fd[k].type = "formattedText";
    upd.push({ id: it.id, slug: it.slug, fieldData: fd });
  }
  console.log("products:", upd.map(u => u.slug).join(", "));
  const pr = upd.find(u => u.slug === "samsung-ca1-7sv2"); if (pr) console.log("PROBE FR side:", pr.fieldData[id.side].valueByLocale?.[L.fr]?.value?.slice(0, 420));
  const v5 = upd.find(u => u.slug === "samsung-v5"); if (v5) { console.log("V5 IT side:", v5.fieldData[id.side].valueByLocale?.[L.it]?.value?.slice(150, 330)); console.log("V5 DE reading:", (v5.fieldData[id.reading].valueByLocale?.[L.de]?.value ?? "").slice(0, 500)); }
  if (/<(strong|b)[\s>]/.test(JSON.stringify(upd))) throw new Error("bold found");
  if (dry) return;
  await prod.addItems(upd.map(({ id, fieldData }) => ({ id, fieldData })));
  console.log("written");
});
