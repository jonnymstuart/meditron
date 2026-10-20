// One-off schema fix on the Products collection (IGaxjVLL3), 20 Oct 2026:
//  - rename the typo'd "Compactible Products" field (SWiYaC7ST) and its divider (ZHUv7vlox) to "Compatible Products"
//  - add a "Related Products" divider + multi-reference field pointing back at Products
// Idempotent: re-running changes nothing once the names exist. Prints the Related field id for push-probes.mjs.
import { withFramer, dryRun } from "./lib.mjs";

const PRODUCTS = "IGaxjVLL3";

await withFramer(async (framer) => {
  const products = (await framer.getCollections()).find((c) => c.id === PRODUCTS);
  const fields = await products.getFields();
  const byId = Object.fromEntries(fields.map((f) => [f.id, f]));

  for (const id of ["SWiYaC7ST", "ZHUv7vlox"]) {
    const f = byId[id];
    if (!f) throw new Error(`field ${id} missing`);
    if (f.name === "Compatible Products") { console.log(`${id} already named "Compatible Products"`); continue; }
    console.log(`${id}: "${f.name}" -> "Compatible Products"`);
    if (!dryRun) await f.setAttributes({ name: "Compatible Products" });
  }

  const existing = fields.find((f) => f.type === "multiCollectionReference" && f.name === "Related Products");
  if (existing) {
    console.log("Related Products field exists:", existing.id, "->", existing.collectionId);
  } else if (dryRun) {
    console.log("would add divider + multiCollectionReference 'Related Products' -> Products");
  } else {
    const created = await products.addFields([
      { type: "divider", name: "Related Products" },
      { type: "multiCollectionReference", name: "Related Products", collectionId: PRODUCTS },
    ]);
    for (const f of created) console.log("created", f.type, f.name, f.id);
  }

  const after = await products.getFields();
  console.log("\nProducts fields now:", after.filter((f) => /Compat|Related|Variants/.test(f.name)).map((f) => `${f.id} ${f.type} "${f.name}"`).join(" | "));
});
