// Hub comparison table: own rich-text field + node with a smaller paragraph style and a light table style, no bold.
// 1) branch: field "Comparison" on Solutions, table style preset, duplicated intro node bound to the field; merge.
// 2) CMS: move the <h3> + <table> out of the SEO intro into the new field (4 locales), stripping <strong>/<b>.
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
await withFramer(async (f) => {
  let fld = (await (await f.getCollection("gZyqCZdng")).getFields()).find(x => x.name === "Comparison");
  if (!fld) {
    let r = await f.agent.applyChanges(`+Variable cmpField name="Comparison" type="richtext" scope="gZyqCZdng"; +TableStylePresetNode cmpTable name="Table/Comparison";`, PP);
    console.log("field+preset:", JSON.stringify(r).slice(0, 300));
    const b = await f.agent.getActiveBranch(); await (await f.getBranches()).find(x => x.id === b.id).switch();
    fld = (await (await f.getCollection("gZyqCZdng")).getFields()).find(x => x.name === "Comparison");
    console.log("branch:", b.title, b.id, "| field:", fld?.id);
    r = await f.agent.applyChanges(`DUPE p46MkBSTV newId="cmpNode" parent="KCdlK26rR" index="1";`, PP);
    const nid = r.renamedIds?.cmpNode; console.log("dupe:", JSON.stringify(r).slice(0, 200));
    const presets = await f.agent.serializeNodes({ ids: ["cmpTable"], depth: 0 }, PP).catch(() => []);
    r = await f.agent.applyChanges(
      `SET ${nid} text="var(--variable-${fld.id})" stylePresetParagraph="Text Styles/Body/Body MD-Regular" stylePresetHeading3="Text Styles/Headings/Heading 3" tableStylePreset="Table/Comparison" visible.from="var(--variable-${fld.id})" visible.transforms.0.name="isSet" height="auto";` +
      ` SET p46MkBSTV height="auto";`, PP);
    console.log("bind:", JSON.stringify(r).slice(0, 400));
    const tsId = (await f.agent.serializeNodes({ ids: [nid], depth: 0 }, PP))[0]?.attributes?.tableStylePreset; console.log("node table preset:", tsId);
    const [k] = await f.agent.serializeNodes({ ids: ["KCdlK26rR"], depth: 1 }, PP); console.log("intro parent children:", k.children.map(c => c.id).join(", "), "| parent height:", k.attributes.height);
    await (await f.getBranches()).find(x => x.id === b.id).merge(); console.log("merged; branches:", (await f.getBranches()).map(x => x.title).join(","));
  }
  console.log("Comparison field on main:", fld?.id);
});
