// Hub Order (Products field ryKGzFopm) for the hub "Popular" strip (25 Nov).
// The strip sits in the component "Related Products" and sorts by Hub Order ascending, limit 7. The Framer API can't add
// a Hub Order filter there (its Solution filter is bound to a component variable the DSL can't address), so every
// product without a Hub Order gets 999 and sorts after the curated 1–7. The comparison list filters Hub Order 1–99.
// Rule for editors (docs/20): 1–7 = shown on the hub in that order; 999 = not shown.
// Usage: node scripts/framer/hub-order-fill.mjs [--dry]
import { withFramer } from "./lib.mjs";
const HO = "ryKGzFopm", REST = 999;
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const c = await f.getCollection("IGaxjVLL3");
  const items = await c.getItems();
  const todo = items.filter(i => !(Number(i.fieldData?.[HO]?.value) > 0));
  console.log("products:", items.length, "with Hub Order:", items.length - todo.length, "to set", REST + ":", todo.length);
  if (dry) return;
  for (let n = 0; n < todo.length; n += 50)
    await c.addItems(todo.slice(n, n + 50).map(i => ({ id: i.id, fieldData: { [HO]: { type: "number", value: REST } } })));
  const after = await c.getItems();
  const empty = after.filter(i => !(Number(i.fieldData?.[HO]?.value) > 0)).length;
  const curated = after.filter(i => { const v = Number(i.fieldData?.[HO]?.value); return v > 0 && v < 100; }).length;
  console.log("read back: empty", empty, "| curated 1–99:", curated, "| 999:", after.filter(i => i.fieldData?.[HO]?.value === REST).length);
});
