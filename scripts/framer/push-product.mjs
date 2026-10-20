// Push one model page from content/en/products/<slug>.md (Z20 format) into the Products collection.
// Fields: description, up to 10 spec rows, highlights (Benefits), why-Meditron, 4 FAQs, meta, Related Products.
// Compatible Products are set only when `compatible:` lists slugs (probes live in samsung-transducers.md).
// EN only; German is never written. Usage: node push-product.mjs samsung-v8 [samsung-r20 ...] [--dry-run]
import { readFileSync } from "node:fs";
import { withFramer, dryRun } from "./lib.mjs";

const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!slugs.length) throw new Error("give at least one slug");
const F = { description: "VKK1rLOkt", highlights: "htnpvAE7_", why: "T6CfH6qEg", metaTitle: "yNO0L700R", metaDesc: "Fw8KRORIm", related: "ZW57wAQ93", compatible: "SWiYaC7ST",
  keys: ["a8Dv7KCyw", "FE3Bghuvu", "PjsWoh2zd", "Q9AMtoLDz", "aOyuBf41h", "vhVilYGav", "SbdX5INdb", "wQ5pZVQVr", "QHMw6KQYg", "ECh9wGmzt"],
  vals: ["Tbj_vy63h", "qzdeoLiMo", "IQZRo2Wt4", "VQvL6dl_G", "CRACdCSo6", "BzceDkif5", "v9F_AjhtU", "ofQLZrlVl", "itkpMi72Z", "P_90IpRTk"],
  q: ["DgtWCAqSG", "rLcE_AA5B", "YzTVKn3Aa", "dFHEcNCRv"], a: ["R4BTWDCVh", "JnvQbqY0v", "zbg3y_eFj", "wNA8ZUOAA"] };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const p = (s) => `<p dir="auto">${esc(s)}</p>`;

function parse(slug) {
  const md = readFileSync(new URL(`../../content/en/products/${slug}.md`, import.meta.url), "utf8");
  const section = (h) => { const m = md.match(new RegExp(`\\n## ${h}\\n([\\s\\S]*?)(?=\\n## |$)`)); return m ? m[1].trim() : ""; };
  const fm = (k) => (md.match(new RegExp(`^${k}: "?([^"#\\n]*?)"?\\s*(#.*)?$`, "m")) || [])[1]?.trim();
  const list = (k) => (fm(k) || "").replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
  const rows = section("Technical data").split("\n").filter((l) => l.startsWith("|") && !/^\|\s*(Key|---)/.test(l)).map((l) => l.split("|").slice(1, -1).map((s) => s.trim()));
  const faq = [...section("FAQ").matchAll(/### (.+)\n([\s\S]*?)(?=\n### |$)/g)].map((m) => [m[1].trim(), m[2].trim()]);
  return { id: fm("framer_id"), description: section("Description"), rows, faq, metaTitle: fm("meta_title"), metaDesc: fm("meta_description"), related: list("related"), compatible: list("compatible"),
    highlights: `<ul>${section("Highlights").split("\n").filter((l) => l.startsWith("- ")).map((l) => `<li>${esc(l.slice(2))}</li>`).join("")}</ul>`,
    why: section("Why work with Meditron").split("\n\n").map(p).join("") };
}

await withFramer(async (framer) => {
  const products = (await framer.getCollections()).find((c) => c.id === "IGaxjVLL3");
  const bySlug = Object.fromEntries((await products.getItems()).map((i) => [i.slug, i.id]));
  const items = slugs.map((slug) => {
    const c = parse(slug); if (!c.id || bySlug[slug] !== c.id) throw new Error(`${slug}: framer_id ${c.id} does not match CMS ${bySlug[slug]}`);
    const fd = { [F.description]: { type: "string", value: c.description }, [F.highlights]: { type: "formattedText", value: c.highlights }, [F.why]: { type: "formattedText", value: c.why },
      [F.metaTitle]: { type: "string", value: c.metaTitle }, [F.metaDesc]: { type: "string", value: c.metaDesc },
      [F.related]: { type: "multiCollectionReference", value: c.related.map((s) => bySlug[s]).filter(Boolean) } };
    if (c.compatible.length) fd[F.compatible] = { type: "multiCollectionReference", value: c.compatible.map((s) => bySlug[s]).filter(Boolean) };
    F.keys.forEach((k, i) => { fd[k] = { type: "string", value: c.rows[i]?.[0] || "" }; fd[F.vals[i]] = { type: "string", value: c.rows[i]?.[1] || "" }; });
    c.faq.slice(0, 4).forEach(([q, a], i) => { fd[F.q[i]] = { type: "string", value: q }; fd[F.a[i]] = { type: "formattedText", value: p(a) }; });
    console.log(`${slug}: ${c.rows.length} spec rows, ${c.faq.length} FAQs, related ${c.related.join(",")}, compatible ${c.compatible.join(",") || "(unchanged)"}`);
    return { id: c.id, fieldData: fd };
  });
  if (dryRun) return;
  await products.addItems(items).catch((e) => console.warn("addItems threw after writing (known):", e.message));
  const now = await products.getItems();
  for (const it of items) { const z = now.find((i) => i.id === it.id); console.log(z.slug, "spec rows:", F.keys.filter((k) => z.fieldData[k]?.value).length, "| related:", z.fieldData[F.related]?.value?.length, "| faq1:", z.fieldData[F.q[0]]?.value); }
});
