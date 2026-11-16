// Restores the product page heading after the 12 Nov H1 binding stripped its style: creates "Heading 3 H1"
// (same look as Heading 3, tag h1) and applies it to the product name node t3JY1QUrX and its breakpoint copies.
// Also points the DE/FR/IT product page title/description at the CMS Meta fields (they still used the old pattern).
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/products/:Products" };
const NODES = ["t3JY1QUrX", "UzFPRFU4at3JY1QUrX", "KhqcnzXi1t3JY1QUrX", "L0YBy1U6Tt3JY1QUrX"];
const L = ["C9aJRu34X", "rRxiWhpq8", "D9HoCmqY1"];
await withFramer(async (f) => {
  const styles = await f.getTextStyles();
  let st = styles.find(x => x.path === "/Text Styles/Headings/Heading 3 H1");
  if (!st) {
    const h3 = styles.find(x => x.path === "/Text Styles/Headings/Heading 3");
    const keys = ["font", "boldFont", "italicFont", "boldItalicFont", "color", "transform", "alignment", "decoration", "balance", "breakpoints", "fontSize", "letterSpacing", "lineHeight", "paragraphSpacing", "minWidth"];
    const attrs = { path: "/Text Styles/Headings/Heading 3 H1", tag: "h1" };
    for (const k of keys) if (h3[k] !== undefined) attrs[k] = h3[k];
    st = await f.createTextStyle(attrs);
  }
  console.log("style:", st.path, st.tag);
  const r = await f.agent.applyChanges(NODES.map(n => `SET ${n} textStylePreset="Text Styles/Headings/Heading 3 H1";`).join(" "), PP);
  console.log("apply:", JSON.stringify(r).slice(0, 300));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  const ns = await f.agent.serializeNodes({ ids: NODES, depth: 0 }, PP);
  for (const n of ns) console.log(n.id, n.attributes.textStylePreset, n.attributes.fontSize ?? "", n.attributes.text);
  if (b?.id && b.id !== "main") { await (await f.getBranches()).find(x => x.id === b.id).merge(); console.log("merged; branches:", (await f.getBranches()).map(x => x.title).join(",")); }
  const [m] = await f.agent.serializeNodes({ ids: ["t3JY1QUrX"], depth: 0 }, PP); console.log("main:", m.attributes.textStylePreset);
  // Localized metadata
  const g = (await f.getLocalizationGroups({ type: "page" })).find(x => x.name === "Products Detail");
  const set = (val) => Object.fromEntries(L.map(id => [id, { action: "set", value: val }]));
  const res = await f.setLocalizationData({ valuesBySource: { "05XjctfrGDBYaC7zNOC6dG": set("{{yNO0L700R}}"), "57KB6ms4mdXuDb3viXlFhq": set("{{Fw8KRORIm}}") } });
  console.log("localization:", JSON.stringify(res));
  const g2 = (await f.getLocalizationGroups({ type: "page" })).find(x => x.name === "Products Detail");
  for (const id of ["05XjctfrGDBYaC7zNOC6dG", "57KB6ms4mdXuDb3viXlFhq"]) { const s = g2.sources.find(x => x.id === id); console.log(s.value, L.map(l => s.valueByLocale[l]?.value).join(" | ")); }
});
