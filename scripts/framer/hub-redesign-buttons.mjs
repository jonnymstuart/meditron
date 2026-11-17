// Samsung hub, round 2 (17 Nov, Jonny's review): one heading look for H2/H3 in the columns, one body style for all
// columns (Body LG-Regular Hub, paragraph spacing 20), and the two standalone links as the site's pill button
// ("Components/Button" zjjuSC7eB, as "See all"), placed under the left column of the Guide and Price rows.
// Labels come from the localized Solutions fields; links are internal page links, so Framer localizes them.
// Usage: node scripts/framer/hub-redesign-buttons.mjs   (prints the branch; merge with hub-redesign-layout.mjs merge <title>)
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const LABEL = { guide: "PlwIMfYVx", price: "Y6rRUN3BW" };
const BODY = "Text Styles/Body/Body LG-Regular Hub";
await withFramer(async (f) => {
  // Styles (project level)
  const st = await f.getTextStyles();
  const h3 = st.find(s => s.path === "/Text Styles/Headings/Heading 3 Hub"), h2 = st.find(s => s.path === "/Text Styles/Headings/Heading 2 Hub");
  await h2.setAttributes({ font: h3.font, fontSize: h3.fontSize, lineHeight: h3.lineHeight, letterSpacing: h3.letterSpacing, breakpoints: h3.breakpoints, paragraphSpacing: h3.paragraphSpacing });
  const body = st.find(s => s.path === "/" + BODY); await body.setAttributes({ paragraphSpacing: 20, breakpoints: body.breakpoints.map(b => ({ ...b, paragraphSpacing: 20 })) });
  // Unused link fields (link fields keep one value for all languages)
  const sol = await f.getCollection("gZyqCZdng");
  for (const fl of await sol.getFields()) if (["Guide Button Link", "Price Button Link"].includes(fl.name)) { await fl.remove(); console.log("removed field", fl.name); }
  const btn = (id, col, label, link) => `+ComponentInstanceNode ${id} component="zjjuSC7eB" parent="${col}" index="1"; SET ${id} name="${id === "guideBtn" ? "Guide Button" : "Offer Button"}" $control__variant="Primary" $control__staticTextOn="true" $control__staticText="var(--variable-${label})" $control__dynamicText1On="false" $control__dynamicText2On="false" ${link} visible.from="var(--variable-${label})" visible.transforms.0.name="isSet";`;
  const col = (id, name, row, text) => `+FrameNode ${id} parent="${row}" index="0"; SET ${id} name="${name}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" stackWrapEnabled="false" gap="32px" width="1fr" maxWidth="760px" height="auto"; MOVE ${text} parent="${id}" index="0"; SET ${text} width="100%" maxWidth="760px";`;
  const dsl = [
    ...["PEdr_UFjp", "feGiqGAC2", "Gt9w8ySHt"].map(n => `SET ${n} stylePresetParagraph="${BODY}";`),
    col("guideCol", "Guide Intro Column", "uUDL21jUL", "GbFL3gdrS"),
    btn("guideBtn", "guideCol", LABEL.guide, `$control__link="/news-events/:slug" $control__link.collectionItem="which-samsung-ultrasound-system-for-my-practice"`),
    col("priceCol", "Price Intro Column", "aN2fyGbg1", "ifKTAxMDd"),
    btn("offerBtn", "priceCol", LABEL.price, `$control__link="/contact"`),
  ].join(" ");
  const r = await f.agent.applyChanges(dsl, PP); console.log(JSON.stringify(r).slice(0, 1500));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  const ids = Object.values(r.renamedIds ?? {});
  for (const n of await f.agent.serializeNodes({ ids: ["uUDL21jUL", "aN2fyGbg1", ...ids], depth: 1 }, PP)) console.log(n.id, n.name ?? "", JSON.stringify(Object.fromEntries(Object.entries(n.attributes || {}).filter(([k]) => /control__(static|link|variant)|width|height|visible|stackDirection/.test(k)))).slice(0, 400), (n.children || []).map(c => c.id).join(","));
});
