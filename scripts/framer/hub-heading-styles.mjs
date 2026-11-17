// Text styles for the hub columns: "Heading 2 Hub" (look of Heading 4, tag h2), "Heading 3 Hub" (look of Heading 5, tag h3) and "Heading 4 Hub" (look of Heading 6, tag h4).
// Then applies them to the hub section's rich-text nodes on the open branch (pass its title).
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const KEYS = ["font", "boldFont", "italicFont", "boldItalicFont", "color", "transform", "alignment", "decoration", "balance", "breakpoints", "fontSize", "letterSpacing", "lineHeight", "paragraphSpacing", "minWidth"];
const NODES = ["p46MkBSTV", "y3OIg9Pa2", "PEdr_UFjp", "GbFL3gdrS", "feGiqGAC2", "ifKTAxMDd", "Gt9w8ySHt"];
await withFramer(async (f) => {
  const styles = await f.getTextStyles();
  for (const [path, from, tag] of [["/Text Styles/Headings/Heading 2 Hub", "/Text Styles/Headings/Heading 4", "h2"], ["/Text Styles/Headings/Heading 3 Hub", "/Text Styles/Headings/Heading 5", "h3"], ["/Text Styles/Headings/Heading 4 Hub", "/Text Styles/Headings/Heading 6", "h4"]]) {
    if (styles.some(s => s.path === path)) continue;
    const src = styles.find(s => s.path === from); const a = { path, tag }; for (const k of KEYS) if (src[k] !== undefined) a[k] = src[k];
    const s = await f.createTextStyle(a); console.log("created", s.path, s.tag, s.fontSize);
  }
  const br = (await f.getBranches()).find(x => x.title === process.argv[2]); await br.switch(); console.log("on branch", br.title);
  const LINK = `+LinkStylePresetNode hubLink name="Link Styles/Hub Link"; SET hubLink link.textDecoration="underline" link.textDecorationThickness="1px" link.textDecorationOffset="3px" link.textDecorationColor="rgba(16, 42, 72, 0.35)" link.hover.textDecoration="underline" link.hover.textDecorationColor="rgba(16, 42, 72, 1)";`;
  const hasLink = (await f.agent.getNodesOfTypes({ types: ["LinkStylePresetNode"] })).some(n => n.name === "Link Styles/Hub Link");
  console.log(JSON.stringify(await f.agent.applyChanges((hasLink ? "" : LINK) + ` SET p46MkBSTV stylePresetHeading2="Text Styles/Headings/Heading 2 Hub";` + NODES.map(n => ` SET ${n} linkStylePreset="Link Styles/Hub Link";`).join(""), PP)).slice(0, 600));
  const r = await f.agent.applyChanges(NODES.map(n => `SET ${n} stylePresetHeading3="Text Styles/Headings/Heading 3 Hub"${n === "p46MkBSTV" || n === "y3OIg9Pa2" ? "" : ` stylePresetHeading4="Text Styles/Headings/Heading 4 Hub"`};`).join(" "), PP);
  console.log(JSON.stringify(r).slice(0, 800));
  for (const n of await f.agent.serializeNodes({ ids: NODES, depth: 0 }, PP)) console.log(n.id, n.attributes.stylePresetHeading2 ?? "", n.attributes.stylePresetHeading3, n.attributes.stylePresetHeading4 ?? "", n.attributes.linkStylePreset ?? "");
  console.log("active:", (await f.agent.getActiveBranch())?.title);
});
