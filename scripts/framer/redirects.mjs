// Pushes data/redirects.csv (from,to,status,reason,added) to Framer. Idempotent.
import { readFileSync } from "node:fs";
import { withFramer, dryRun } from "./lib.mjs";

const rows = readFileSync(new URL("../../data/redirects.csv", import.meta.url), "utf8")
  .trim().split("\n").slice(1).filter(Boolean)
  .map((l) => { const [from, to, status] = l.split(","); return { from: from.trim(), to: to.trim(), status: Number(status || 301) }; });

await withFramer(async (framer) => {
  const existing = await framer.getRedirects();
  const have = new Set(existing.map((r) => r.from));
  const missing = rows.filter((r) => !have.has(r.from));
  console.log(`csv=${rows.length} existing=${existing.length} toAdd=${missing.length}`);
  if (dryRun || missing.length === 0) return;
  // Field names follow RedirectAttributes in framer-api types; adjust after the day-1 info run.
  await framer.addRedirects(missing.map((r) => ({ from: r.from, to: r.to, expandToAllLocales: true })));
  console.log("added", missing.length);
});
