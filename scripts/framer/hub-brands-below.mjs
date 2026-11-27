// Critique 19 Nov, P1 "Samsung first" (27 Nov). On the hub template the 4 brand cards (Partners HoyguMDmG) sat in the
// hero, so the Samsung hub opened with Clarius / Esaote cards before any Samsung content. Now the hero holds only the
// H1 and description; the cards move into a new section "Our brands" after the SEO Intro (intro, comparison, guide,
// offer rows) and before Products. Same template for all 5 hubs. Heading styled like the Products header (Heading 2,
// max width 1200), localized DE/FR/IT. Heights auto. Usage: node scripts/framer/hub-brands-below.mjs
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const T = { en: "Our brands", C9aJRu34X: "Unsere Marken", rRxiWhpq8: "Nos marques", D9HoCmqY1: "I nostri marchi" };
await withFramer(async (f) => {
  const dsl = `
    +FrameNode brands parent="tKorZ1lpI" index="2" name="Brands" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="48px" width="1fr" maxWidth="100%" height="auto";
    +FrameNode brandsHead parent="brands" name="Header" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="center" gap="27px" width="1fr" maxWidth="1200px" height="auto";
    +RichTextNode brandsTitle parent="brandsHead" text="${T.en}" textStylePreset="Text Styles/Headings/Heading 2" textAlignment="left" width="auto" height="auto";
    MOVE HoyguMDmG parent="brands" index="1";
    SET HoyguMDmG maxWidth="1200px";`;
  const r = await f.agent.applyChanges(dsl, PP);
  console.log(JSON.stringify(r).slice(0, 500));
  console.log("branch:", (await f.agent.getActiveBranch())?.title);
  const ids = r.renamedIds || {};
  // Localize the heading.
  const g = (await f.getLocalizationGroups({ type: "page" })).find(x => x.name === "Solutions Detail");
  const src = g?.sources.find(s => String(s.value).replace(/<[^>]+>/g, "").trim() === T.en);
  if (src) {
    const wrap = v => String(src.value).replace(T.en, v);
    await f.setLocalizationData({ valuesBySource: { [src.id]: Object.fromEntries(["C9aJRu34X", "rRxiWhpq8", "D9HoCmqY1"].map(l => [l, { action: "set", value: wrap(T[l]) }])) } });
    console.log("heading localized in group", g.name);
  } else console.log("heading source not found; groups:", (await f.getLocalizationGroups({ type: "page" })).map(x => x.name).join(", "));
  // Read back: order of Main Content, px heights on the new section and its parents.
  const [m] = await f.agent.serializeNodes({ ids: ["tKorZ1lpI"], depth: 1 }, PP);
  console.log("order:", m.children.map(c => c.name).join(" > "));
  for (const id of [ids.brands, "HoyguMDmG", "tKorZ1lpI", "TZGVBroX1"].filter(Boolean)) for (const bp of ["", "p9v3nmiEl", "RAIzK0lVL"]) {
    const [n] = await f.agent.serializeNodes({ ids: [bp + id], depth: 0 }, PP).catch(() => [null]);
    if (n && /px$/.test(n.attributes?.height ?? "")) console.log("  px height:", n.id, n.attributes.height);
  }
});
