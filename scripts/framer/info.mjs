// Day-1 smoke test: confirms the API key works and prints what the project exposes.
import { withFramer } from "./lib.mjs";

await withFramer(async (framer) => {
  console.log("project:", await framer.getProjectInfo());
  console.log("locales:", await framer.getLocales());
  const collections = await framer.getCollections();
  for (const c of collections) console.log("collection:", c.id, c.name, (await c.getFields()).map((f) => `${f.name}:${f.type}`));
  console.log("redirects:", (await framer.getRedirects()).length);
  console.log("publish:", await framer.getPublishInfo());
});
