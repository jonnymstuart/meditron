// Fill empty Meta Title / Meta Description on products (all locales) so the template can bind to them.
// Pattern per locale mirrors today's template title; description = first sentences of the localized description, max 155 chars.
// Usage: node scripts/framer/fill-meta.mjs [--dry] [--publish]
import { writeFileSync } from "node:fs";
import { withFramer } from "./lib.mjs";
const DRY = process.argv.includes("--dry"), PUBLISH = process.argv.includes("--publish");
const L = { en: null, de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const SUFFIX = { en: "Meditron Switzerland", de: "Meditron Schweiz", fr: "Meditron Suisse", it: "Meditron Svizzera" };
const DASH = { en: " – ", de: " – ", fr: " – ", it: " – " };
const T = "yNO0L700R", D = "Fw8KRORIm", NAME = "krFC3FLEV", DESC = "VKK1rLOkt", SOL = "nFDEePImP";
const strip = (s) => (s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const trimDesc = (s, max = 155) => { s = strip(s); if (s.length <= max) return s; const sents = s.match(/[^.!?]+[.!?]+/g) || [s]; let out = ""; for (const x of sents) { if ((out + x).trim().length > max) break; out += x; } out = out.trim(); if (!out) { out = s.slice(0, max); out = out.slice(0, out.lastIndexOf(" ")) + "…"; } return out; };
const val = (fd, f, loc) => loc ? fd[f]?.valueByLocale?.[loc]?.value : fd[f]?.value;
await withFramer(async (framer) => {
  const cols = await framer.getCollections(); const sol = await framer.getCollection(cols.find((c) => c.name === "Solutions").id); const sols = await sol.getItems();
  const solTitle = Object.fromEntries(sols.map((s) => [s.id, Object.fromEntries(Object.entries(L).map(([l, loc]) => [l, val(s.fieldData, "dRiLvudx6", loc) || val(s.fieldData, "dRiLvudx6", null)]))]));
  const products = await framer.getCollection("IGaxjVLL3"); const items = await products.getItems(); const updates = []; const log = [];
  for (const it of items) { if (it.draft) continue; const fd = {}; const solId = it.fieldData[SOL]?.value; const name = val(it.fieldData, NAME, null);
    for (const [l, loc] of Object.entries(L)) {
      const curT = val(it.fieldData, T, loc), curD = val(it.fieldData, D, loc);
      const st = solTitle[solId]?.[l] || ""; const title = `${name}${st ? DASH[l] + st : ""} | ${SUFFIX[l]}`;
      const desc = trimDesc(val(it.fieldData, DESC, loc) || val(it.fieldData, DESC, null) || "") || title;
      const put = (f, v) => { fd[f] = fd[f] || { type: "string", value: it.fieldData[f]?.value ?? "", valueByLocale: {} }; if (loc) fd[f].valueByLocale[loc] = { action: "set", value: v }; else fd[f].value = v; };
      if (!(curT || "").trim()) { put(T, title); log.push([it.slug, l, "title", title]); }
      if (!(curD || "").trim()) { put(D, desc); log.push([it.slug, l, "desc", desc]); }
    }
    for (const f of Object.keys(fd)) { if (!Object.keys(fd[f].valueByLocale).length) delete fd[f].valueByLocale; }
    if (Object.keys(fd).length) updates.push({ id: it.id, fieldData: fd });
  }
  console.log("items to update:", updates.length, "| field values:", log.length); for (const x of log.filter((r) => r[1] === "en").slice(0, 3).concat(log.filter((r) => r[1] === "it").slice(0, 3))) console.log("  ", x.join(" · ").slice(0, 200));
  writeFileSync("/tmp/claude-0/-home-user-meditron/194500fc-8658-52aa-ad35-f2d2c33b33d5/scratchpad/p7/fill-meta-log.json", JSON.stringify(log, null, 1));
  if (DRY) { console.log("DRY RUN"); return; }
  for (let i = 0; i < updates.length; i += 50) { await products.addItems(updates.slice(i, i + 50)).catch((e) => console.warn("batch", i, "threw:", e.message)); console.log("batch", i, "sent"); }
  if (PUBLISH) { const pv = await framer.agent.publish({ action: "preview" }); if (pv.publishTarget === "staging" && !pv.errors?.length) { const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: pv.confirmationHash }); console.log("staging:", c.status, c.message); } else console.log("preview:", JSON.stringify(pv).slice(0, 300)); }
});
