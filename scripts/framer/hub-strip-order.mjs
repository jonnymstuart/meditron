// "Popular" product strip on all five hubs (25 Nov). The strip list SxjSFyWxp sorted by Name descending, so each hub
// showed whatever came last in the alphabet (e.g. thyroid protection and scatter probes on radiology).
// Now: products of the current hub with Hub Order > 0 (ryKGzFopm, set 1–7 per hub for the comparison block), visible,
// sorted by Hub Order ascending, limit 7. Same rule as the comparison list B2FzLf_op, so strip and comparison agree.
// The list lives inside the component "Related Products" (Au_dqsYXU, used only on the hub template), so the change is
// applied in component scope (no pagePath); its Solution filter reads the component variable ZO1Joc0jm.
// Usage: node scripts/framer/hub-strip-order.mjs
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const esc = (o) => JSON.stringify(o).replace(/"/g, "\\\"");
const filters = [
  { variableId: "ryKGzFopm", transforms: [{ name: "greaterThan", value: 0 }] },
  { variableId: "HvB4OLS27", transforms: [{ name: "equals", value: true }] },
  { variableId: "nFDEePImP", transforms: [{ name: "equals", value: "var(--variable-ZO1Joc0jm)" }] }, // the component's Solution variable
];
const sorting = [{ variable: "ryKGzFopm", direction: "asc" }];
await withFramer(async (f) => {
  const br = (await f.getBranches()).find(x => x.title === process.env.BRANCH); if (br) await br.switch();
  const show = async () => { for (const [id, pp] of [["SxjSFyWxp", undefined], ["B2FzLf_op", PP]]) for (const n of await f.agent.serializeNodes({ ids: [id], depth: 0 }, pp)) { const c = n.attributes.collectionList || {}; console.log(n.id, "limit", c.limit, "sort", JSON.stringify(c.sorting), "filters", JSON.stringify(c.filters), /px$/.test(n.attributes.height ?? "") ? "<-- px height" : ""); } };
  console.log("before:"); await show();
  // Full arrays: the index form leaves stale entries (the strip had a duplicated sort).
  const dsl = `SET SxjSFyWxp collectionList.sorting="${esc(sorting)}" collectionList.filters="${esc(filters)}" collectionList.limit="7";`;
  const r = await f.agent.applyChanges(dsl); if (r.errors) console.log("ERRORS", JSON.stringify(r.errors)); console.log(JSON.stringify(r).slice(0, 400));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  console.log("after:"); await show();
});
