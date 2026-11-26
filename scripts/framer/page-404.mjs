// German audit A3 (25–26 Nov): DE/FR/IT visitors who hit a missing URL got Framer's default English 404
// ("Page Not Found | Framer", <html lang="en">). This builds a /404 page in the site's design: navigation, a centred
// heading section (same presets as /privacy-policy's heading), two buttons (home, products), footer. Desktop 1200,
// Tablet 810, Phone 350 like the other pages; all heights auto. Text in EN, localized to DE/FR/IT for the client's
// proofreading. Runs on the branch that holds the empty /404 page (BRANCH env), or a new auto-branch.
// Usage: BRANCH=<title> node scripts/framer/page-404.mjs
import { withFramer } from "./lib.mjs";
const T = {
  h1: { en: "Page not found", de: "Seite nicht gefunden", fr: "Page introuvable", it: "Pagina non trovata" },
  p: { en: "The page you are looking for has moved or no longer exists.", de: "Die gesuchte Seite wurde verschoben oder existiert nicht mehr.", fr: "La page que vous cherchez a été déplacée ou n'existe plus.", it: "La pagina che cerca è stata spostata o non esiste più." },
  home: { en: "Go to the homepage", de: "Zur Startseite", fr: "Retour à l'accueil", it: "Torna alla home" },
  prod: { en: "View products", de: "Produkte ansehen", fr: "Voir les produits", it: "Vedi i prodotti" },
};
const LOC = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
await withFramer(async (f) => {
  const br = (await f.getBranches()).find(x => x.title === process.env.BRANCH); if (br) await br.switch();
  let page = (await f.getNodesWithType("WebPageNode")).find(p => p.path === "/404");
  if (!page) { await f.agent.applyChanges(`+WebPageNode p404 name="404" path="/404";`); page = (await f.getNodesWithType("WebPageNode")).find(p => p.path === "/404"); }
  const PP = { pagePath: "/404" };
  const [pg] = await f.agent.serializeNodes({ ids: [page.id], depth: 1 }, PP);
  const D = pg.children.find(c => c.name === "Desktop").id;
  if (pg.children.length > 1 || (pg.children[0].children || []).length) { console.log("page already has content; stopping"); return; }
  const dsl = `
    SET ${D} layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="hidden" height="auto" fill="null";
    +ComponentInstanceNode nav component="BupcK2J61" parent="${D}" $control__variant="Desktop w/Button Floating" position="relative" width="100%" height="auto" zIndex="10";
    +FrameNode sec parent="${D}" name="Not found" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="24px" padding="160px 40px 160px 40px" width="1fr" maxWidth="1200px" height="auto";
    +RichTextNode h1 parent="sec" text="${T.h1.en}" textStylePreset="Text Styles/Headings/Heading 1" textAlignment="center" width="1fr" maxWidth="934px" height="auto";
    +RichTextNode lead parent="sec" text="${T.p.en}" textStylePreset="Text Styles/Body/Body MD-Regular" textAlignment="center" width="1fr" maxWidth="560px" height="auto";
    +FrameNode btns parent="sec" layout="stack" stackDirection="horizontal" stackDistribution="center" stackAlignment="center" stackWrapEnabled="true" gap="12px" width="auto" height="auto";
    +ComponentInstanceNode bhome component="zjjuSC7eB" parent="btns" $control__variant="Primary" $control__staticText="${T.home.en}" $control__dynamicText1On="false" $control__dynamicText2On="false" $control__link="/" width="auto" height="auto";
    +ComponentInstanceNode bprod component="zjjuSC7eB" parent="btns" $control__variant="Secondary" $control__staticText="${T.prod.en}" $control__dynamicText1On="false" $control__dynamicText2On="false" $control__link="/products" width="auto" height="auto";
    +ComponentInstanceNode foot component="oY3QwAzZI" parent="${D}" $control__variant="Desktop" $control__padding="160px 80px 100px 80px" width="100%" height="auto";
    CREATE_VARIANT tab from="${D}"; SET tab name="Tablet" width="810px" left="1300px" top="0px";
    CREATE_VARIANT ph from="${D}"; SET ph name="Phone" width="350px" left="2210px" top="0px";`;
  const r = await f.agent.applyChanges(dsl, PP);
  console.log(JSON.stringify(r).slice(0, 700));
  const ids = r.renamedIds || {};
  const tab = ids.tab, ph = ids.ph, nav = ids.nav, foot = ids.foot, sec = ids.sec;
  if (ph) {
    const r2 = await f.agent.applyChanges(`SET ${ph}${nav} $control__variant="Phone w/Button Floating"; SET ${ph}${foot} $control__variant="Phone" $control__padding="80px 20px 60px 20px"; SET ${ph}${sec} padding="120px 20px 100px 20px"; SET ${tab}${sec} padding="140px 40px 140px 40px";`, PP);
    console.log("breakpoints:", JSON.stringify(r2).slice(0, 300));
  }
  console.log("branch:", (await f.agent.getActiveBranch())?.title);
  // Localize the four strings (text nodes and button labels) via the page's localization group.
  const g = (await f.getLocalizationGroups({ type: "page" })).find(x => x.name === "404" || x.name === "/404");
  const valuesBySource = {};
  for (const s of g?.sources || []) {
    const v = String(s.value || "").replace(/<[^>]+>/g, "").trim();
    const key = Object.keys(T).find(k => T[k].en === v); if (!key) continue;
    valuesBySource[s.id] = Object.fromEntries(Object.entries(LOC).map(([l, id]) => [id, { action: "set", value: String(s.value).includes("<") ? String(s.value).replace(T[key].en, T[key][l]) : T[key][l] }]));
  }
  console.log("localized sources:", Object.keys(valuesBySource).length, g ? "" : "(no localization group found)");
  if (Object.keys(valuesBySource).length) console.log(JSON.stringify(await f.setLocalizationData({ valuesBySource })).slice(0, 200));
  // Rules check: no px heights in the new nodes.
  const [after] = await f.agent.serializeNodes({ ids: [page.id], depth: 6 }, PP);
  const px = []; const walk = n => { if (/px$/.test(n.attributes?.height ?? "")) px.push(`${n.id} ${n.name} ${n.attributes.height}`); (n.children || []).forEach(walk); }; walk(after);
  console.log("px heights:", px.length ? px.join(", ") : "none");
});
