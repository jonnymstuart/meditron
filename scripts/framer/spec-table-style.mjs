// Product "Technical Data" list (component "Details", FAhkF1oDm, used on the product template):
// values left-aligned and wider (max 600px ≈ 9–12 words per line at 16px), labels in a fixed column,
// rows top-aligned. Heights stay auto. Component scope (no pagePath); merges the auto-branch into main.
import { withFramer } from "./lib.mjs";
const COMP = "FAhkF1oDm";
await withFramer(async (f) => {
  const [c] = await f.agent.serializeNodes({ ids: [COMP], depth: 6 });
  const rows = c.children[0].children.filter(r => r.name === "Detail");
  const dsl = [];
  for (const r of rows) {
    const [k, v] = r.children;
    dsl.push(`SET ${r.id} stackDistribution="start" stackAlignment="start" gap="40px";`);
    dsl.push(`SET ${k.id} width="1fr" maxWidth="360px";`);
    dsl.push(`SET ${v.id} width="2fr" maxWidth="600px" textAlignment="start";`);
  }
  console.log("rows:", rows.length);
  const res = await f.agent.applyChanges(dsl.join(" "));
  console.log("apply:", JSON.stringify(res).slice(0, 300));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  const check = async (label) => {
    const [c2] = await f.agent.serializeNodes({ ids: [COMP], depth: 6 });
    for (const r of c2.children[0].children.filter(x => x.name === "Detail")) {
      const [k, v] = r.children;
      console.log(label, r.id, r.attributes.stackAlignment, r.attributes.height, "| key", k.attributes.width, k.attributes.maxWidth, "| value", v.attributes.width, v.attributes.maxWidth, v.attributes.textAlignment, v.attributes.textStylePreset);
    }
  };
  await check("branch");
  if (b?.id && b.id !== "main") { await (await f.getBranches()).find(x => x.id === b.id).merge(); console.log("merged; branches:", (await f.getBranches()).map(x => x.title).join(",")); }
  await check("main");
});
