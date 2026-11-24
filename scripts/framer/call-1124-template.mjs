// 24 Nov client call, template changes (one Framer branch):
//  1. Product page heading "Technical Data" -> "Specifications" (EJXUjydEk; DE/FR/IT via localization).
//  2. Brochure row pvEMxSp6j moved out of the Technical Data section (visible only with specs) into its own
//     "Brochure" section before the FAQ, visible whenever the File field pv6jonALh is set.
//  3. Variant cards (bFmgOZq2l, Product - Variants list) link to the product page set in the Variants field
//     "Product Page" (created here if missing).
//  4. Hub template /solutions/:slug gets a branded social preview image instead of the home hero.
// Usage: node scripts/framer/call-1124-template.mjs
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const PRD = { pagePath: "/products/:Products" }, HUB = { pagePath: "/solutions/:Solutions" };
const show = (r) => console.log(JSON.stringify(r).slice(0, 700));
await withFramer(async (f) => {
  // Variants field
  const vc = await f.getCollection("PXCEKQuTk");
  let vf = (await vc.getFields()).find(x => x.name === "Product Page");
  if (!vf) { await vc.addFields([{ type: "collectionReference", name: "Product Page", collectionId: "IGaxjVLL3" }]); vf = (await vc.getFields()).find(x => x.name === "Product Page"); }
  console.log("variants field:", vf.id, vf.type);
  // Social image
  const img = await f.uploadImage({ image: { bytes: new Uint8Array(readFileSync(new URL("./assets/meditron-social-1200x630.png", import.meta.url))), mimeType: "image/png" }, name: "meditron-social-1200x630.png" });
  console.log("image:", img.url);
  // Product template
  const prd = [
    `SET EJXUjydEk text="Specifications" textStylePreset="Text Styles/Headings/Heading 2";`, // plain text: HTML here is stored literally and drops the style
    `+FrameNode brSec parent="G29Fe2khR" index="7"; SET brSec name="Brochure" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="40px" padding="40px 80px 40px 80px" width="1fr" maxWidth="100%" height="auto" visible.from="var(--variable-pv6jonALh)" visible.transforms.0.name="isSet";`,
    `+FrameNode brIn parent="brSec" index="0"; SET brIn name="Brochure Inner" layout="stack" stackDirection="vertical" stackAlignment="center" gap="10px" width="1fr" maxWidth="1200px" height="auto";`,
    `MOVE pvEMxSp6j parent="brIn" index="0";`,
    `SET bFmgOZq2l link.href="/products/:slug" link.collectionItem="var(--variable-${vf.id})";`,
  ].join(" ");
  const r = await f.agent.applyChanges(prd, PRD); show(r);
  const ids = r.renamedIds ?? {}; const sec = ids.brSec ?? "brSec";
  show(await f.agent.applyChanges(`SET UzFPRFU4a${sec} padding="40px"; SET KhqcnzXi1${sec} padding="40px 20px 40px 20px";`, PRD));
  // Hub template social image
  show(await f.agent.applyChanges(`SET NORySkPkj metadata.socialImage="${img.url}";`, HUB));
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  // Read back
  const K = ["name", "text", "visible", "height", "padding", "link", "metadata"];
  for (const [pp, list] of [[PRD, ["EJXUjydEk", sec, "pvEMxSp6j", "bFmgOZq2l", "RQYJpFfJh"]], [HUB, ["NORySkPkj"]]])
    for (const n of await f.agent.serializeNodes({ ids: list, depth: 1 }, pp)) console.log(n.id, JSON.stringify(Object.fromEntries(K.filter(k => n.attributes?.[k] !== undefined).map(k => [k, n.attributes[k]]))).slice(0, 400), "| children:", (n.children || []).map(c => c.id).join(","));
});
