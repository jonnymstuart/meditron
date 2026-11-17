// Hub column headings (H4, "Heading 4 Hub") take the FAQ question look: Graphik Trial Medium, 20px, line height 1.4em,
// same at every breakpoint (FAQItem questionFont on the hub template, node TpeyAixr2).
import { withFramer } from "./lib.mjs";
await withFramer(async (f) => {
  const styles = await f.getTextStyles();
  const h4 = styles.find(s => s.path === "/Text Styles/Headings/Heading 4 Hub");
  const medium = styles.find(s => s.path === "/Text Styles/Body/Body LG-Medium");
  console.log("medium font:", medium.font?.selector ?? JSON.stringify(medium.font)?.slice(0, 120));
  const out = await h4.setAttributes({ font: medium.font, fontSize: "20px", lineHeight: "1.4em", letterSpacing: "0em", breakpoints: [] });
  const s = (await f.getTextStyles()).find(x => x.path === "/Text Styles/Headings/Heading 4 Hub");
  console.log("now:", s.tag, s.font?.selector ?? s.font?.family, s.fontSize, s.lineHeight, JSON.stringify(s.breakpoints));
});
