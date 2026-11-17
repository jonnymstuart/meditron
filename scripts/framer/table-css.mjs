// Site-wide CSS for rich-text tables (headEnd): no bold in tables, full width, and on phones the table
// scrolls sideways with a minimum cell width instead of breaking words. Keeps any other headEnd code.
import { withFramer } from "./lib.mjs";
const CSS = `<style id="mtr-table">.framer-text table th, .framer-text table th *, .framer-text table strong, .framer-text table b { font-weight: 400 !important; } .framer-text table { width: 100%; } @media (max-width: 809px) { .framer-text table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; } .framer-text table th, .framer-text table td { min-width: 150px; } }</style>`;
await withFramer(async (f) => {
  const cur = (await f.getCustomCode())?.headEnd?.html ?? "";
  const next = cur.includes('id="mtr-table"') ? cur.replace(/<style id="mtr-table">[\s\S]*?<\/style>/, CSS) : (cur + "\n" + CSS).trim();
  console.log("before:", cur.slice(0, 400));
  if (process.argv.includes("--dry")) return;
  await f.setCustomCode({ html: next, location: "headEnd" });
  console.log("after:", (await f.getCustomCode())?.headEnd?.html);
});
