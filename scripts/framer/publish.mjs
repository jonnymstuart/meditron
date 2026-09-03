import { withFramer, dryRun } from "./lib.mjs";

await withFramer(async (framer) => {
  const issues = await framer.getDeploymentIssues();
  if (issues?.length) { console.error("deployment issues:", issues); process.exit(1); }
  const pending = await framer.getUnpublishedPageChanges();
  console.log("unpublished page changes:", pending?.length ?? pending);
  if (dryRun) return;
  const result = await framer.publish();
  console.log("published:", result);
});
