// DE/FR/IT CMS rich text linking to English pages (25 Nov, German audit A4). Framer doesn't localize plain hrefs in
// CMS rich text, so "/products/samsung-v8" in a German article goes to the English page, and
// "/news-events/<slug>" without the locale is a 404 when the article has a localized slug.
// Rewrites every unprefixed internal href in the DE/FR/IT values of Solutions, Products and News & Events items:
//   /news-events/<any locale's slug>  → https://www.meditron.ch/<l>/news-events/<that item's slug in l>
//   /products/<slug>, /solutions/<slug> → same, via the Products / Solutions collections
//   anything else internal (/contact, /products?brand=…, /) → /<l> + path
// Navigation and footer components are left alone (rewritten client-side; site-wide risk).
// Usage: node scripts/framer/localize-links.mjs [--dry]
import { withFramer } from "./lib.mjs";
const LOC = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const SCOPES = ["Solutions", "Products", "News & Events"];
const SITE = "https://www.meditron.ch";
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const cols = await f.getCollections();
  const maps = {}; // section → { anySlug → { en, de, fr, it } }
  for (const [sec, name] of [["news-events", "News & Events"], ["products", "Products"], ["solutions", "Solutions"]]) {
    const m = (maps[sec] = {});
    for (const it of await cols.find(c => c.name === name).getItems()) {
      const s = { en: it.slug };
      for (const [l, id] of Object.entries(LOC)) s[l] = it.slugByLocale?.[id]?.value || it.slug;
      for (const v of Object.values(s)) m[v] = s;
    }
  }
  const fix = (href, l) => {
    const m = /^(?:https:\/\/www\.meditron\.ch)?(\/[^?#]*)?([?#].*)?$/.exec(href); if (!m) return null;
    const path = m[1] || "/", rest = m[2] || "";
    if (new RegExp(`^/(de|fr|it)(/|$)`).test(path)) return null; // already localized (any locale)
    const p = /^\/(news-events|products|solutions)\/([^/]+)\/?$/.exec(path);
    // Absolute URLs: Framer turns a relative "/de/products/x" into an internal page link and drops the locale on save
    // (the write "succeeds" but reads back as "/products/x"); full https URLs are kept as written.
    if (p) { const s = maps[p[1]][decodeURIComponent(p[2])]; return { href: `${SITE}/${l}/${p[1]}/${s ? s[l] : p[2]}${rest}`, known: !!s }; }
    return { href: `${SITE}/${l}${path === "/" ? "" : path}${rest}`, known: true };
  };
  // CMS rich text is written through the collection API (setLocalizationData accepts but ignores CMS text fields).
  const upd = {}; let n = 0, unknown = 0; const sample = [];
  for (const name of SCOPES) {
    const col = cols.find(c => c.name === name);
    for (const it of await col.getItems()) for (const [fid, fv] of Object.entries(it.fieldData)) {
      if (fv?.type !== "formattedText" && fv?.type !== "string") continue;
      for (const [l, id] of Object.entries(LOC)) {
        const v = fv.valueByLocale?.[id]?.value; if (!v || !v.includes("href=")) continue;
        let changed = false;
        const nv = v.replace(/href="([^"]+)"/g, (all, h) => {
          if (!/^(\/|https:\/\/www\.meditron\.ch)/.test(h)) return all;
          const r = fix(h, l); if (!r || r.href === h) return all;
          changed = true; n++; if (!r.known) unknown++; if (sample.length < 12) sample.push(`${l} ${h} → ${r.href}${r.known ? "" : "  (slug not found)"}`);
          return `href="${r.href}"`;
        });
        if (changed) { const u = (upd[`${col.id}|${it.id}`] ??= { col, id: it.id, fieldData: {} }); (u.fieldData[fid] ??= { type: fv.type, value: fv.value, valueByLocale: {} }).valueByLocale[id] = { action: "set", value: nv }; }
      }
    }
  }
  sample.forEach(x => console.log(" ", x));
  console.log("links rewritten:", n, "| unknown slugs:", unknown, "| items:", Object.keys(upd).length);
  if (dry || !n) return;
  const byCol = {}; for (const u of Object.values(upd)) (byCol[u.col.id] ??= { col: u.col, rows: [] }).rows.push({ id: u.id, fieldData: u.fieldData });
  for (const { col, rows } of Object.values(byCol)) { await col.addItems(rows); console.log("written", col.name, rows.length); }
  let left = 0;
  for (const { col, rows } of Object.values(byCol)) { const items = await col.getItems(); for (const r of rows) { const it = items.find(i => i.id === r.id); for (const [fid, fv] of Object.entries(r.fieldData)) for (const [id, w] of Object.entries(fv.valueByLocale)) if ((it.fieldData[fid]?.valueByLocale?.[id]?.value || "") !== w.value) left++; } }
  console.log("read back mismatches:", left);
});
