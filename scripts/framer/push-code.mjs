// Push a code component from scripts/framer/code/ to Framer. Refuses unless the live file equals the version at
// <base-commit>, so a change made in Framer is never overwritten. Typechecks first, reads back after.
// Usage: node scripts/framer/push-code.mjs SchemaJsonLd.tsx <base-commit>
import { withFramer } from "./lib.mjs";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
const [name, base] = process.argv.slice(2);
if (!name || !base) { console.error("usage: push-code.mjs <file> <base-commit>"); process.exit(1); }
const local = readFileSync(new URL(`./code/${name}`, import.meta.url), "utf8");
const expected = execSync(`git show ${base}:scripts/framer/code/${name}`, { encoding: "utf8" });
await withFramer(async (f) => {
  const cf = (await f.getCodeFiles()).find(x => x.name === name);
  if (!cf) throw new Error("no code file " + name);
  if (cf.content === local) { console.log("already live"); return; }
  if (cf.content !== expected) throw new Error(`live ${name} differs from ${base}; pull it before pushing`);
  // Block only new type errors: errors the live file already has (e.g. FAQItem's font defaults) don't stop a push.
  const key = e => String(e.message ?? JSON.stringify(e)).split("\n")[0];
  const before = new Set(((await f.typecheckCode(name, cf.content)) || []).map(key));
  const added = ((await f.typecheckCode(name, local)) || []).filter(e => !before.has(key(e)));
  if (added.length) { console.log("new type errors:", JSON.stringify(added).slice(0, 800)); process.exit(1); }
  await cf.setFileContent(local);
  const back = (await f.getCodeFiles()).find(x => x.name === name).content;
  console.log("pushed", name, "| read back equals local:", back === local);
});
