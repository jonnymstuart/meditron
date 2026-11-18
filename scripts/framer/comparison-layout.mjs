// Samsung hub comparison as a Framer layout (18 Nov), replacing the rich-text table (Framer forces table cells to
// min-width 16ch, so the thumbnail gap could not close in the editor). In the SEO Intro section (KCdlK26rR):
//   Comparison (only on the ultrasound hub) > H3 (rich text y3OIg9Pa2, field Lwudih0L8) + table frame:
//   header row (Model / Best for / Format / Highlights, 14px at 70% opacity) + collection list of Products
//   (Hub Order > 0, visible, sorted by Hub Order). Row: [34px white tile, radius 2, 3px top offset | 15px | name link]
//   | best for | format | highlights. Columns 4fr / 5fr / 4fr / 6fr, gap 15px, 12px row padding, 1px lines.
// Tablet/phone: rows stack, header hidden. Usage: node scripts/framer/comparison-layout.mjs  (then merge the branch)
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const F = { model: "VtLBeQb6s", best: "yxKEtShab", format: "XLxfdKqCR", hi: "lSLwpuk7K", thumb: "Dh60jX8lX", order: "ryKGzFopm", visible: "HvB4OLS27", slug: "oI2eeUwC2" };
const LINE = `borderStyle="solid" borderColor="rgba(16, 44, 71, 0.15)" borderBottom="1px"`;
const BODY = "Text Styles/Body/Body MD-Regular", SMALL = "Text Styles/Body/Body SM-Regular";
const W = ["4fr", "5fr", "4fr", "6fr"];
await withFramer(async (f) => {
  const dsl = [
    `+FrameNode cmpBlock parent="KCdlK26rR" index="1";`,
    `SET cmpBlock name="Comparison" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="24px" width="1fr" maxWidth="1200px" height="auto" visible.from="var(--variable-gZyqCZdng-id)" visible.transforms.0.name="equals" visible.transforms.0.value="FUy2BxjOq";`,
    `MOVE y3OIg9Pa2 parent="cmpBlock" index="0";`, `SET y3OIg9Pa2 width="100%" maxWidth="1200px";`,
    `+FrameNode cmpTable parent="cmpBlock" index="1";`,
    `SET cmpTable name="Comparison Table" layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="100%" height="auto";`,
    `+FrameNode cmpHead parent="cmpTable" index="0";`,
    `SET cmpHead name="Comparison Header" layout="stack" stackDirection="horizontal" stackAlignment="start" gap="15px" padding="12px 0px 12px 0px" width="100%" height="auto" ${LINE};`,
    ...[["hModel", "Model"], ["hBest", "Best for"], ["hFormat", "Format"], ["hHi", "Highlights"]].map(([id, t], i) =>
      `+RichTextNode ${id} parent="cmpHead" index="${i}"; SET ${id} name="Header ${t}" text="${t}" textStylePreset="${SMALL}" opacity="0.7" width="${W[i]}" height="auto";`),
    `+FrameNode cmpList parent="cmpTable" index="1";`,
    `SET cmpList name="Comparison Rows" layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="100%" height="auto";`,
    `+FrameNode cmpRow parent="cmpList" index="0";`,
    `SET cmpRow name="Comparison Row" layout="stack" stackDirection="horizontal" stackAlignment="start" gap="15px" padding="12px 0px 12px 0px" width="100%" height="auto" ${LINE};`,
    `SET cmpList collectionList.collection="Products" collectionList.repeatedDescendantId="cmpRow" collectionList.limit="7" collectionList.sorting.0.variable="${F.order}" collectionList.sorting.0.direction="asc" collectionList.filters.0.variableId="${F.order}" collectionList.filters.0.transforms.0.name="greaterThan" collectionList.filters.0.transforms.0.value="0" collectionList.filters.1.variableId="${F.visible}" collectionList.filters.1.transforms.0.name="equals" collectionList.filters.1.transforms.0.value="true";`,
    `+FrameNode cmpModel parent="cmpRow" index="0";`,
    `SET cmpModel name="Model" layout="stack" stackDirection="horizontal" stackAlignment="start" gap="15px" width="${W[0]}" height="auto";`,
    `+FrameNode cmpTileWrap parent="cmpModel" index="0";`,
    `SET cmpTileWrap name="Thumbnail Offset" layout="stack" stackDirection="vertical" padding="3px 0px 0px 0px" width="auto" height="auto";`,
    `+FrameNode cmpTile parent="cmpTileWrap" index="0";`,
    `SET cmpTile name="Thumbnail" fill="rgb(255, 255, 255)" radius="2px" overflow="clip" layout="stack" stackDirection="horizontal" stackDistribution="center" stackAlignment="center" padding="4px" width="34px" height="34px";`,
    `+FrameNode cmpImg parent="cmpTile" index="0";`,
    `SET cmpImg name="Product Image" fill="var(--variable-${F.thumb})" altText="var(--variable-${F.model})" width="fit-image" height="100%";`,
    `+RichTextNode cmpName parent="cmpModel" index="1";`,
    `SET cmpName name="Model Name" text="var(--variable-${F.model})" textStylePreset="${BODY}" linkStylePreset="Link Styles/Hub Link" link.href="/products/:slug" link.collectionItem="var(--variable-${F.slug})" width="1fr" height="auto";`,
    ...[["cBest", F.best, 1], ["cFormat", F.format, 2], ["cHi", F.hi, 3]].map(([id, fid, i]) =>
      `+RichTextNode ${id} parent="cmpRow" index="${i}"; SET ${id} name="${["", "Best For", "Format", "Highlights"][i]}" text="var(--variable-${fid})" textStylePreset="${BODY}" width="${W[i]}" height="auto";`),
  ].join(" ");
  const r = await f.agent.applyChanges(dsl, PP); console.log(JSON.stringify(r).slice(0, 2500));
  const ids = r.renamedIds ?? {};
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  // Tablet + phone: stack the row, full-width columns, hide header
  const o = [];
  for (const bp of ["p9v3nmiEl", "RAIzK0lVL"]) {
    o.push(`SET ${bp}${ids.cmpHead} visible="false";`, `SET ${bp}${ids.cmpRow} stackDirection="vertical" gap="6px";`);
    for (const k of ["cmpModel", "cBest", "cFormat", "cHi"]) o.push(`SET ${bp}${ids[k]} width="100%";`);
  }
  const r2 = await f.agent.applyChanges(o.join(" "), PP); console.log("overrides:", JSON.stringify(r2).slice(0, 800));
  const [blk] = await f.agent.serializeNodes({ ids: [ids.cmpBlock], depth: 6 }, PP);
  const show = (n, d = 0) => { const a = n.attributes || {}; console.log(" ".repeat(d * 2) + n.id, n.name ?? "", ["width", "height", "gap", "padding", "text", "fill", "visible"].map(k => a[k] !== undefined ? `${k}=${JSON.stringify(a[k]).slice(0, 60)}` : "").filter(Boolean).join(" "), a.collectionList ? "LIST " + JSON.stringify(a.collectionList).slice(0, 300) : ""); (n.children || []).forEach(c => show(c, d + 1)); };
  show(blk);
});
