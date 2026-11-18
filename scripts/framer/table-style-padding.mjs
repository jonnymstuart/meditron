// Table/Comparison style (YANQCd4iU): cell padding right 16 → 15px, so the gap between the thumbnail and the model
// name equals the space above the thumbnail (12px cell padding + 3px offset in the file). Jonny, 18 Nov.
import { withFramer } from "./lib.mjs";
await withFramer(async (f) => {
  console.log(JSON.stringify(await f.agent.applyChanges(`SET YANQCd4iU padding="12px 15px 12px 0px";`)).slice(0, 300));
  const [n] = await f.agent.serializeNodes({ ids: ["YANQCd4iU"], depth: 0 }); console.log(n.attributes.padding, "| branch:", (await f.agent.getActiveBranch())?.title ?? "main");
});
