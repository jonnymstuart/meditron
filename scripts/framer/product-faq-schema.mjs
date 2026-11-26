// One FAQPage per product page (26 Nov, German audit A1 follow-up). The product template's 6 FAQItem rows each
// emitted their own FAQPage block (Google flags duplicate FAQPage). Now SchemaJsonLd (NTJ97bOp9) receives the six
// questions and answer texts and emits one FAQPage; the rows' own blocks are switched off (FAQItem emitSchema=false).
// Hub FAQ rows come from the FAQ collection (one CMS item per row), so they keep per-row blocks.
// Control keys come from the control titles ("FAQ Q1" → $control__fAQQ1, "FAQ schema" → $control__fAQSchema), not the prop names.
// Usage: node scripts/framer/product-faq-schema.mjs
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/products/:Products" };
const Q = ["DgtWCAqSG", "rLcE_AA5B", "YzTVKn3Aa", "dFHEcNCRv", "rn1j_Ulg0", "M8hgbvNb6"];
const A = ["NLA9rfXHq", "JXW61ChTO", "JpYVT2T5Q", "CaUnY6FvZ", "Jobv4lasS", "XzkDy5p5C"]; // "FAQ Answer n Text", shown on page
const ROWS = ["UWrfHsUPj", "y8JfLYyUK", "xjpiHLQM5", "XQPWDR4qy", "NlD21wi7Z", "zUq3i1w8o"];
const SCHEMA = "NTJ97bOp9";
await withFramer(async (f) => {
  const dsl = [
    `SET ${SCHEMA} ${Q.map((q, i) => `$control__fAQQ${i + 1}="var(--variable-${q})" $control__fAQA${i + 1}="var(--variable-${A[i]})"`).join(" ")};`,
    ...ROWS.map(r => `SET ${r} $control__fAQSchema="false";`),
  ].join(" ");
  const r = await f.agent.applyChanges(dsl, PP);
  console.log(JSON.stringify(r).slice(0, 500));
  console.log("branch:", (await f.agent.getActiveBranch())?.title);
  for (const n of await f.agent.serializeNodes({ ids: [SCHEMA, ...ROWS], depth: 0 }, PP)) {
    const a = n.attributes;
    console.log(n.id, n.id === SCHEMA ? Object.entries(a).filter(([k]) => /fAQ/.test(k)).map(([k, v]) => `${k.replace("$control__", "")}=${v}`).join(" ") : `fAQSchema=${a.$control__fAQSchema}`);
  }
});
