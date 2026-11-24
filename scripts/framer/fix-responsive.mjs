// Critique 19 Nov, P0: phone/tablet layout.
//  - Product hero: the text column VTHjiidtx kept width 3fr when the hero stacks vertically on Tablet/Phone,
//    rendering 2,190px (810) / 1,130px (390) wide and clipped. Now 100% there.
//  - Hub Guides grid: 3 columns at every width, and the phone section kept 80px side padding (190px left).
//    Now Tablet 2 columns, Phone 1 column with 20px side padding.
//  - Product Related / Compatible / Variants grids: Tablet 2, Phone 1, phone side padding 20px.
// Breakpoint override id = breakpoint id + node id. Heights untouched (all auto).
// Usage: node scripts/framer/fix-responsive.mjs [merge]
import { withFramer } from "./lib.mjs";
const HUB = { pagePath: "/solutions/:Solutions" }, PRD = { pagePath: "/products/:Products" };
const HT = "p9v3nmiEl", HP = "RAIzK0lVL", PT = "UzFPRFU4a", PPh = "KhqcnzXi1";
const PHONE_PAD = `padding="40px 20px 40px 20px"`;
const show = (r) => console.log(JSON.stringify(r).slice(0, 600));
await withFramer(async (f) => {
  const hub = [
    `SET ${HT}HmqhYKvP0 gridColumnCount="2";`,
    `SET ${HP}HmqhYKvP0 gridColumnCount="1";`,
    `SET ${HP}gde_9XYrn ${PHONE_PAD};`,
  ].join(" ");
  show(await f.agent.applyChanges(hub, HUB));
  const grids = ["RvhFovIzn", "VzwF2H6c_", "kLcJtHzFj"], sections = ["EZjeXKieJ", "zY8WHkAsF", "uMXT_dsFN"];
  const prd = [
    `SET ${PT}VTHjiidtx width="100%";`, `SET ${PPh}VTHjiidtx width="100%";`, `SET ${PPh}UjeAXo6gw width="100%";`,
    ...grids.map(g => `SET ${PT}${g} gridColumnCount="2";`),
    ...grids.map(g => `SET ${PPh}${g} gridColumnCount="1";`),
    ...sections.map(s => `SET ${PPh}${s} ${PHONE_PAD};`),
  ].join(" ");
  show(await f.agent.applyChanges(prd, PRD));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  // Read back + px-height check on the changed nodes and their parents
  const K = ["width", "height", "padding", "gridColumnCount"];
  const rb = async (pp, ids) => { for (const n of await f.agent.serializeNodes({ ids, depth: 0 }, pp)) { const a = n.attributes || {}; console.log(n.id, K.map(k => `${k}=${a[k]}`).join(" "), /px$/.test(a.height ?? "") ? "  <-- px height" : ""); } };
  await rb(HUB, [`${HT}HmqhYKvP0`, `${HP}HmqhYKvP0`, `${HP}gde_9XYrn`]);
  await rb(PRD, [`${PT}VTHjiidtx`, `${PPh}VTHjiidtx`, `${PPh}UjeAXo6gw`, `${PT}xAc3HiZGZ`, `${PPh}xAc3HiZGZ`, ...grids.flatMap(g => [PT + g, PPh + g]), ...sections.map(s => PPh + s)]);
});
