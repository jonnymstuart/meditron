// Seven Samsung model pages: FAQ 5-6 (plain text fields) and a "Further reading" block with two guide links appended to
// "Why Work With Meditron" (T6CfH6qEg), 4 locales, localized article slugs. Content: content/seo/models-extra-2026-11-12.json
// Usage: node scripts/framer/model-extras.mjs [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const C = JSON.parse(readFileSync(new URL("../../content/seo/models-extra-2026-11-12.json", import.meta.url)));
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const F = { q5: "rn1j_Ulg0", q6: "M8hgbvNb6", a5: "Jobv4lasS", a6: "XzkDy5p5C", why: "T6CfH6qEg" };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const put = (o, type = "string") => ({ type, value: o.en, valueByLocale: Object.fromEntries(["de", "fr", "it"].map(l => [L[l], { action: "set", value: o[l] }])) });
const per = (t, m) => Object.fromEntries(Object.keys(L).map(l => [l, t[l].replaceAll("{m}", m)]));
await withFramer(async (f) => {
  const news = Object.fromEntries((await (await f.getCollection("WUGvbtwAI")).getItems()).map(n => [n.slug, n]));
  const pc = await f.getCollection("IGaxjVLL3"); const upd = [];
  for (const i of await pc.getItems()) {
    const m = C.models[i.slug]; if (!m) continue;
    const why = {};
    for (const [l, id] of Object.entries(L)) {
      const cur = (id ? i.fieldData[F.why]?.valueByLocale?.[id]?.value : i.fieldData[F.why]?.value) || "";
      const links = C.guides[i.slug].map(s => { const n = news[s]; const slug = (id && n.slugByLocale?.[id]?.value) || s; const title = (id ? n.fieldData.xusWsRBZC.valueByLocale?.[id]?.value : n.fieldData.xusWsRBZC.value) || n.fieldData.xusWsRBZC.value;
        return `<li data-preset-tag="p"><p><a href="${l === "en" ? "" : "/" + l}/news-events/${slug}">${esc(title)}</a></p></li>`; }).join("");
      const head = `<h3 dir="auto">${C.readHeading[l]}</h3>`; const base = cur.includes(head) ? cur.slice(0, cur.indexOf(head)) : cur;
      why[l] = `${base}${head}<ul dir="auto">${links}</ul>`;
    }
    upd.push({ id: i.id, slug: i.slug, fieldData: { [F.q5]: put(per(C.q5, m)), [F.a5]: put(per(C.a5, m)), [F.q6]: put(per(C.q6, m)), [F.a6]: put(per(C.a6, m)), [F.why]: put(why, "formattedText") } });
  }
  console.log("models:", upd.length); console.log("DE V8 links:", upd.find(u => u.slug === "samsung-v8").fieldData[F.why].valueByLocale.C9aJRu34X.value.match(/<h3[^>]*>Weiterlesen[\s\S]*$/)?.[0]);
  if (process.argv.includes("--dry")) return;
  await pc.addItems(upd.map(({ id, fieldData }) => ({ id, fieldData })));
  const back = (await pc.getItems()).filter(i => C.models[i.slug]); let ok = 0;
  for (const b of back) if ([F.q5, F.a5, F.q6, F.a6].every(k => b.fieldData[k]?.value && Object.values(L).filter(Boolean).every(id => b.fieldData[k]?.valueByLocale?.[id]?.value)) && Object.values(L).every(id => ((id ? b.fieldData[F.why]?.valueByLocale?.[id]?.value : b.fieldData[F.why]?.value) || "").includes("/news-events/"))) ok++;
  console.log("read-back complete (FAQ 5-6 + links, 4 locales):", ok, "of", back.length);
});
