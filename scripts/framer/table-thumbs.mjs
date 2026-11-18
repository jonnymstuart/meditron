// Square white thumbnails of the seven Samsung models for the hub comparison table. Rich-text images render at their
// natural size (the editor ignores site CSS), so the file itself carries the geometry, measured on a 1:1 canvas crop
// (18 Nov): the model name's ink runs from 3px below the cell top (cap line of line 1) to the baseline of line 2,
// 34px in total. File = transparent band of OFFSET px, then a SIZE × SIZE white square with the product (cut-out from
// Products field Thumbnail Dh60jX8lX) trimmed and centred with ~12% padding, corners rounded (--radius, default 2px). With --2x the file is drawn at double
// resolution and named @2x (Framer then shows it at half size). Writes content/seo/table-thumbs.json.
// --cms also writes the tiles to the Products image field "Comparison Thumbnail" (used by comparison-layout.mjs; run with --offset 0).
// Usage: node scripts/framer/table-thumbs.mjs [--size 34] [--offset 3] [--radius 2] [--2x] [--cms] [--slugs a,b,c]
import { withFramer } from "./lib.mjs";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const X = process.argv.includes("--2x") ? 2 : 1, SIZE = arg("--size", 34) * X, OFFSET = arg("--offset", 3) * X, RADIUS = arg("--radius", 2) * X, INNER = Math.round(SIZE * 0.76);
const slugArg = process.argv.indexOf("--slugs");
const MODELS = slugArg > 0 ? process.argv[slugArg + 1].split(",") : ["samsung-hera-z20", "samsung-r20", "samsung-v8", "samsung-v7", "samsung-v6", "samsung-v5", "samsung-v4"];
const dir = mkdtempSync(tmpdir() + "/thumbs-");
await withFramer(async (f) => {
  const items = await (await f.getCollection("IGaxjVLL3")).getItems(); const out = {};
  for (const slug of MODELS) {
    const v = items.find(i => i.slug === slug)?.fieldData.Dh60jX8lX?.value; const src = (v?.url ?? v).split("?")[0];
    const raw = `${dir}/${slug}-src`, png = `${dir}/${slug}.png`;
    writeFileSync(raw, Buffer.from(await (await fetch(src)).arrayBuffer()));
    execFileSync("convert", [raw, "-trim", "+repage", "-resize", `${INNER}x${INNER}`,
      "-background", "white", "-gravity", "center", "-extent", `${SIZE}x${SIZE}`, "-flatten",
      "(", "-size", `${SIZE}x${SIZE}`, "xc:none", "-fill", "white", "-draw", `roundrectangle 0,0,${SIZE - 1},${SIZE - 1},${RADIUS},${RADIUS}`, ")",
      "-compose", "DstIn", "-composite", "-compose", "Over",
      "-background", "none", "-gravity", "south", "-extent", `${SIZE}x${SIZE + OFFSET}`, png]);
    const name = `${slug}-table-${SIZE / X}${X === 2 ? "@2x" : ""}.png`;
    const img = await f.uploadImage({ image: { bytes: new Uint8Array(readFileSync(png)), mimeType: "image/png" }, name, altText: slug });
    out[slug] = img.url.split("?")[0];
    console.log(slug, execFileSync("identify", ["-format", "%wx%h", png]).toString(), name, out[slug]);
  }
  if (slugArg < 0) writeFileSync(new URL("../../content/seo/table-thumbs.json", import.meta.url), JSON.stringify(out, null, 1));
  if (process.argv.includes("--cms")) { // store the tiles in the Products image field "Comparison Thumbnail" (hub comparison layout)
    const c = await f.getCollection("IGaxjVLL3"); let fl = (await c.getFields()).find(x => x.name === "Comparison Thumbnail");
    if (!fl) { await c.addFields([{ type: "image", name: "Comparison Thumbnail" }]); fl = (await c.getFields()).find(x => x.name === "Comparison Thumbnail"); }
    await c.addItems(MODELS.map(slug => ({ id: items.find(i => i.slug === slug).id, fieldData: { [fl.id]: { type: "image", value: out[slug], alt: "" } } })));
    console.log("Comparison Thumbnail field:", fl.id);
  }
});
