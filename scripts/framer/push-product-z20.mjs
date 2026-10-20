// Model-page content for the Samsung HERA Z20 (n_rmLkxZU): description, 10 spec rows, highlights,
// why-Meditron, 4 FAQs, meta. EN only (DE hands-off).
// Probes (Compatible Products) and related models (Related Products) are owned by push-probes.mjs since 20 Oct;
// this script no longer touches those fields or the "Product - Variants" collection.
import { readFileSync } from "node:fs";
import { withFramer } from "./lib.mjs";

const md = readFileSync(new URL("../../content/en/products/samsung-hera-z20.md", import.meta.url), "utf8");
const section = (h) => { const m = md.match(new RegExp(`\\n## ${h}\\n([\\s\\S]*?)(?=\\n## |$)`)); return m ? m[1].trim() : ""; };
const fm = (k) => (md.match(new RegExp(`^${k}: "?(.*?)"?$`, "m")) || [])[1];
const rows = (txt) => txt.split("\n").filter(l => l.startsWith("|") && !/^\|\s*(Key|slug|---)/.test(l)).map(l => l.split("|").slice(1, -1).map(s => s.trim()));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const p = (s) => `<p dir="auto">${esc(s)}</p>`;

const description = section("Description").replace(/\n\n/g, "\n\n");
const spec = rows(section("Technical data"));
const highlights = `<ul>${section("Highlights").split("\n").filter(l => l.startsWith("- ")).map(l => `<li>${esc(l.slice(2))}</li>`).join("")}</ul>`;
const why = section("Why work with Meditron").split("\n\n").map(p).join("");
const faq = [...section("FAQ").matchAll(/### (.+)\n([\s\S]*?)(?=\n### |$)/g)].map(m => [m[1].trim(), m[2].trim()]);
await withFramer(async (framer) => {
  const cols = await framer.getCollections();
  const products = cols.find(c => c.id === "IGaxjVLL3");

  const fd = {
    VKK1rLOkt: { type: "string", value: description },
    htnpvAE7_: { type: "formattedText", value: highlights },
    T6CfH6qEg: { type: "formattedText", value: why },
    yNO0L700R: { type: "string", value: fm("meta_title") },
    Fw8KRORIm: { type: "string", value: fm("meta_description") },
  };
  const keyIds = ["a8Dv7KCyw","FE3Bghuvu","PjsWoh2zd","Q9AMtoLDz","aOyuBf41h","vhVilYGav","SbdX5INdb","wQ5pZVQVr","QHMw6KQYg","ECh9wGmzt"];
  const valIds = ["Tbj_vy63h","qzdeoLiMo","IQZRo2Wt4","VQvL6dl_G","CRACdCSo6","BzceDkif5","v9F_AjhtU","ofQLZrlVl","itkpMi72Z","P_90IpRTk"];
  spec.slice(0, 10).forEach(([k, v], i) => { fd[keyIds[i]] = { type: "string", value: k }; fd[valIds[i]] = { type: "string", value: v }; });
  const qIds = ["DgtWCAqSG","rLcE_AA5B","YzTVKn3Aa","dFHEcNCRv"], aIds = ["R4BTWDCVh","JnvQbqY0v","zbg3y_eFj","wNA8ZUOAA"];
  faq.slice(0, 4).forEach(([q, a], i) => { fd[qIds[i]] = { type: "string", value: q }; fd[aIds[i]] = { type: "formattedText", value: p(a) }; });
  await products.addItems([{ id: "n_rmLkxZU", fieldData: fd }]);
  const z = (await products.getItems()).find(i => i.id === "n_rmLkxZU");
  console.log("Z20 spec rows:", keyIds.filter(k => z.fieldData[k]?.value).length, "| compatible:", z.fieldData.SWiYaC7ST?.value?.length, "| related:", z.fieldData.ZW57wAQ93?.value?.length, "| faq1:", z.fieldData.DgtWCAqSG?.value);
});
