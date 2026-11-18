// Site-wide CSS for rich-text tables (headEnd): no bold in tables, full width, and on phones the table
// scrolls sideways with a minimum cell width instead of breaking words. Thumbnail cells are exempt from the phone
// minimum width. Tile size comes from the files (Framer shows rich-text images at half
// their pixel size, so 68px files = 34px). The thumbnail column shrinks to the tile + 15px cell padding (width: 1px);
// the "Model" header text may overflow into the next column. The editor ignores this CSS and shows a wider gap. Keeps any other headEnd code.
import { withFramer } from "./lib.mjs";
const CSS = `<style id="mtr-table">.framer-text table th, .framer-text table th *, .framer-text table strong, .framer-text table b { font-weight: 400 !important; } .framer-text table { width: 100%; } .framer-text table:has(img) tr > :first-child { width: 1px; min-width: 0 !important; } .framer-text table:has(img) th:first-child p { width: 0; overflow: visible; white-space: nowrap; } @media (max-width: 809px) { .framer-text table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; } .framer-text table th, .framer-text table td { min-width: 150px; } .framer-text table:has(img) tr > :first-child { min-width: 0 !important; } }</style>`;
await withFramer(async (f) => {
  const cur = (await f.getCustomCode())?.headEnd?.html ?? "";
  const next = cur.includes('id="mtr-table"') ? cur.replace(/<style id="mtr-table">[\s\S]*?<\/style>/, CSS) : (cur + "\n" + CSS).trim();
  console.log("before:", cur.slice(0, 400));
  if (process.argv.includes("--dry")) return;
  await f.setCustomCode({ html: next, location: "headEnd" });
  console.log("after:", (await f.getCustomCode())?.headEnd?.html);
});
