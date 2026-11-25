// Image alt text (25 Nov, German audit A2). Image nodes carried altText="var(--variable-<field>)". Framer stores that
// as plain text, not a CMS binding, so the live HTML said alt="var(--variable-krFC3FLEV)" on 233 of 262 DE pages
// (and the same in EN/FR/IT). Removing the override lets each image use the alt text stored with the CMS image itself,
// which is localized (e.g. "SAMSUNG V8 Ultraschallsystem – Meditron, …").
// Input: the scan written by the read-only scan (list of {scope,id}); scope is a pagePath or "component:<id>:<name>".
// Usage: node scripts/framer/alt-unbind.mjs <scan.json> [--dry]
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
const scan = JSON.parse(readFileSync(process.argv[2], "utf8"));
const dry = process.argv.includes("--dry");
const groups = {};
for (const o of scan) (groups[o.scope.startsWith("component:") ? "component" : o.scope] ??= []).push(o.id);
await withFramer(async (f) => {
  for (const [scope, ids] of Object.entries(groups)) {
    const pp = scope === "component" ? undefined : { pagePath: scope };
    console.log(scope, ids.length);
    if (dry) continue;
    const r = await f.agent.applyChanges(ids.map(id => `SET ${id} altText=null;`).join(" "), pp);
    if (r.errors) console.log("  ERRORS", JSON.stringify(r.errors).slice(0, 400));
    console.log("  branch:", (await f.agent.getActiveBranch())?.title);
  }
  if (dry) return;
  let left = 0;
  for (const [scope, ids] of Object.entries(groups)) {
    const pp = scope === "component" ? undefined : { pagePath: scope };
    for (const n of await f.agent.serializeNodes({ ids, depth: 0 }, pp)) if (String(n.attributes?.altText ?? "").includes("var(")) { left++; console.log("  still set:", n.id, n.attributes.altText); }
  }
  console.log("overrides left:", left);
});
