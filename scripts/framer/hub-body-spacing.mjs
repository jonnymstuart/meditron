// Hub body text (Body LG-Regular Hub): paragraph spacing 10px, so a column heading sits closer to its sentence
// (Framer puts each block's own spacing above it). Jonny, 17 Nov: halve the heading-to-text gap.
import { withFramer } from "./lib.mjs";
await withFramer(async (f) => {
  const s = (await f.getTextStyles()).find(x => x.path === "/Text Styles/Body/Body LG-Regular Hub");
  await s.setAttributes({ paragraphSpacing: 10, breakpoints: s.breakpoints.map(b => ({ ...b, paragraphSpacing: 10 })) });
  const n = (await f.getTextStyles()).find(x => x.path === s.path); console.log(n.path, n.paragraphSpacing, JSON.stringify(n.breakpoints.map(b => [b.minWidth, b.paragraphSpacing])));
});
