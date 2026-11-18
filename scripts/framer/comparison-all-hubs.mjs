// Make the hub comparison block work on every hub (18 Nov): show it when the hub has column labels, show the H3 when
// the Comparison field is set, and list only products of the current hub. Usage: node comparison-all-hubs.mjs
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
await withFramer(async (f) => {
  const dsl = [
    `SET b3nVYw7dU visible.from="var(--variable-ti83vplsI)" visible.transforms.0.name="isSet";`,
    `SET y3OIg9Pa2 visible.from="var(--variable-Lwudih0L8)" visible.transforms.0.name="isSet";`,
    `SET B2FzLf_op collectionList.filters="${JSON.stringify([{ variableId: "ryKGzFopm", transforms: [{ name: "greaterThan", value: 0 }] }, { variableId: "HvB4OLS27", transforms: [{ name: "equals", value: true }] }, { variableId: "nFDEePImP", transforms: [{ name: "equals", value: "var(--variable-gZyqCZdng-id)" }] }]).replace(/"/g, "\\\"")}";`, // full array: the index form wipes the other filters
  ].join(" ");
  const r = await f.agent.applyChanges(dsl, PP); console.log(JSON.stringify(r).slice(0, 800));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title);
  for (const n of await f.agent.serializeNodes({ ids: ["b3nVYw7dU", "y3OIg9Pa2", "B2FzLf_op", "SxjSFyWxp"], depth: 0 }, PP)) console.log(n.id, JSON.stringify(n.attributes.visible ?? ""), JSON.stringify(n.attributes.collectionList?.filters ?? ""));
  const s = await f.agent.readProject([{ type: "screenshot", id: "b3nVYw7dU" }], PP); console.log("SHOT", s.results[0].image_url);
});
