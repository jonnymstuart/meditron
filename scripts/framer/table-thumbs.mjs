// 24 × 24 px square thumbnails of the seven Samsung models for the hub comparison table (rich-text images render at
// their natural size, so the file itself must be small). Source: Products field Thumbnail (Dh60jX8lX); ImageMagick trims
// the transparent margin, fits the product into a square with transparent padding and resizes. Uploads to Framer and
// writes the URLs to content/seo/table-thumbs.json. Usage: node scripts/framer/table-thumbs.mjs
import { withFramer } from "./lib.mjs";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
const SIZE = 24, MODELS = ["samsung-hera-z20", "samsung-r20", "samsung-v8", "samsung-v7", "samsung-v6", "samsung-v5", "samsung-v4"];
const dir = mkdtempSync(tmpdir() + "/thumbs-");
await withFramer(async (f) => {
  const items = await (await f.getCollection("IGaxjVLL3")).getItems(); const out = {};
  for (const slug of MODELS) {
    const v = items.find(i => i.slug === slug)?.fieldData.Dh60jX8lX?.value; const src = (v?.url ?? v).split("?")[0];
    const raw = `${dir}/${slug}-src`, png = `${dir}/${slug}-${SIZE}.png`;
    writeFileSync(raw, Buffer.from(await (await fetch(src)).arrayBuffer()));
    execFileSync("convert", [raw, "-trim", "+repage", "-resize", `${SIZE}x${SIZE}`, "-background", "none", "-gravity", "center", "-extent", `${SIZE}x${SIZE}`, png]);
    const img = await f.uploadImage({ image: { bytes: new Uint8Array(readFileSync(png)), mimeType: "image/png" }, name: `${slug}-thumb-${SIZE}.png`, altText: slug });
    out[slug] = img.url.split("?")[0];
    console.log(slug, execFileSync("identify", ["-format", "%wx%h", png]).toString(), out[slug]);
  }
  writeFileSync(new URL("../../content/seo/table-thumbs.json", import.meta.url), JSON.stringify(out, null, 1));
});
