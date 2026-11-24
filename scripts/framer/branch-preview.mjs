// Publish a Framer branch preview (not staging, not production) and print its URL.
// Usage: node scripts/framer/branch-preview.mjs <branch title>
import { withFramer } from "./lib.mjs";
await withFramer(async (f) => {
  const b = (await f.getBranches()).find(x => x.title === process.argv[2]);
  if (!b) throw new Error("branch not found: " + process.argv[2]);
  await b.switch?.();
  const pv = await f.agent.publish({ action: "preview" });
  console.log("target:", pv.publishTarget, "errors:", JSON.stringify(pv.errors ?? []).slice(0, 300));
  if (pv.publishTarget === "production") throw new Error("refusing: preview targets production");
  const c = await f.agent.publish({ action: "confirm_publish", confirmationHash: pv.confirmationHash });
  console.log(JSON.stringify(c).slice(0, 600));
});
