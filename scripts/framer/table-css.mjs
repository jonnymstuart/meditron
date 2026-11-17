// Site-wide CSS for rich-text tables (headEnd): no bold in tables, full width, and on phones the table
// scrolls sideways with a minimum cell width instead of breaking words. Product thumbnails in table cells
// show at 48px, left of the model name. Keeps any other headEnd code.
import { withFramer } from "./lib.mjs";
const CSS = `<style id="mtr-table">.framer-text table th, .framer-text table th *, .framer-text table strong, .framer-text table b { font-weight: 400 !important; } .framer-text table { width: 100%; } .framer-text table td img { width: 48px !important; height: 48px !important; max-width: none !important; object-fit: contain; margin: 0 !important; display: inline-block; vertical-align: middle; } .framer-text table td:has(img) > * { display: inline-block !important; vertical-align: middle; margin-top: 0 !important; margin-bottom: 0 !important; } .framer-text table td:has(img) > p { margin-left: 12px !important; max-width: calc(100% - 64px); } @media (max-width: 809px) { .framer-text table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; } .framer-text table th, .framer-text table td { min-width: 150px; } }</style>`;
await withFramer(async (f) => {
  const cur = (await f.getCustomCode())?.headEnd?.html ?? "";
  const next = cur.includes('id="mtr-table"') ? cur.replace(/<style id="mtr-table">[\s\S]*?<\/style>/, CSS) : (cur + "\n" + CSS).trim();
  console.log("before:", cur.slice(0, 400));
  if (process.argv.includes("--dry")) return;
  await f.setCustomCode({ html: next, location: "headEnd" });
  console.log("after:", (await f.getCustomCode())?.headEnd?.html);
});
