// Pushes data/redirects.csv (from,to,status,reason,added) to Framer. Idempotent.
// Day-1 facts (2026-09-08): Framer serves every redirect as 308; `*` wildcards are supported in `from`
// (captured as :1, :2 in `to`); order matters, so explicit rows are pushed and ordered before wildcard rows.
import { readFileSync } from "node:fs";
import { withFramer, dryRun } from "./lib.mjs";

const rows = readFileSync(new URL("../../data/redirects.csv", import.meta.url), "utf8")
  .trim().split("\n").slice(1)
  .filter((l) => l.trim() && !l.startsWith("#"))
  .map((l) => { const [from, to, status] = l.split(","); return { from: from.trim(), to: to.trim(), status: Number(status || 301) }; })
  .filter((r) => r.status === 301 || r.status === 308); // 200 = already live, 410 = Framer can't (stays 404)

const ordered = [...rows.filter((r) => !r.from.includes("*")), ...rows.filter((r) => r.from.includes("*"))];

await withFramer(async (framer) => {
  const existing = await framer.getRedirects();
  const have = new Set(existing.map((r) => r.from));
  const missing = ordered.filter((r) => !have.has(r.from));
  console.log(`csv=${rows.length} existing=${existing.length} toAdd=${missing.length}`);
  if (dryRun) return;
  for (const r of missing) {
    // one at a time so a single bad row (e.g. non-ASCII) doesn't abort the batch
    try { await framer.addRedirects([{ from: r.from, to: r.to, expandToAllLocales: false }]); }
    catch (e) { console.error("FAILED", r.from, e.message); }
  }
  const all = await framer.getRedirects();
  const ids = ordered.map((r) => all.find((x) => x.from === r.from)?.id).filter(Boolean);
  await framer.setRedirectOrder(ids);
  console.log("added", missing.length, "ordered", ids.length);
});
