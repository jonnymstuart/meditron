// Site-wide CSS for rich-text tables (headEnd): no bold in tables, full width, and on phones the table
// scrolls sideways with a minimum cell width instead of breaking words. Product thumbnails (24px files) sit in
// their own first column; that column is exempt from the phone minimum width. Keeps any other headEnd code.
import { withFramer } from "./lib.mjs";
const CSS = `<style id="mtr-table">.framer-text table th, .framer-text table th *, .framer-text table strong, .framer-text table b { font-weight: 400 !important; } .framer-text table { width: 100%; } .framer-text table td img { width: 24px !important; height: 24px !important; max-width: none !important; margin: 0 !important; } .framer-text table:has(img) tr > :first-child { width: 32px; min-width: 32px !important; padding-right: 0; } @media (max-width: 809px) { .framer-text table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; } .framer-text table th, .framer-text table td { min-width: 150px; } }</style>`;
await withFramer(async (f) => {
  const cur = (await f.getCustomCode())?.headEnd?.html ?? "";
  const next = cur.includes('id="mtr-table"') ? cur.replace(/<style id="mtr-table">[\s\S]*?<\/style>/, CSS) : (cur + "\n" + CSS).trim();
  console.log("before:", cur.slice(0, 400));
  if (process.argv.includes("--dry")) return;
  await f.setCustomCode({ html: next, location: "headEnd" });
  console.log("after:", (await f.getCustomCode())?.headEnd?.html);
});
