// Article card images match the blog page (/news-events, image EuCgXuDmA): width 1fr, aspect ratio 1.5 (3:2), radius
// 16px, on every breakpoint. Applies to the hub Guides cards (WTIwe0LI6, was 180px fixed) and the home page News
// cards (RyKprnRpt, was 1.18). Jonny, 18 Nov: "same dimensions as the main blog page, throughout the site".
import { withFramer } from "./lib.mjs";
const T = [{ id: "WTIwe0LI6", pp: "/solutions/:Solutions" }, { id: "RyKprnRpt", pp: "/" }];
const BP = { "/solutions/:Solutions": ["", "p9v3nmiEl", "RAIzK0lVL", "FhYCsAOGV"] };
await withFramer(async (f) => {
  for (const { id, pp } of T) {
    let prefixes = BP[pp];
    if (!prefixes) { const [pg] = await f.agent.serializeNodes({ ids: [(await f.getNodesWithType("WebPageNode")).find(p => p.path === pp).id], depth: 1 }, { pagePath: pp }); prefixes = ["", ...pg.children.slice(1).map(c => c.id)]; }
    const ids = prefixes.map(p => p + id);
    const r = await f.agent.applyChanges(ids.map(n => `SET ${n} width="1fr" height="283px" aspectRatio="1.5" radius="16px";`).join(" "), { pagePath: pp });
    console.log(pp, JSON.stringify(r).slice(0, 300));
    for (const n of await f.agent.serializeNodes({ ids, depth: 0 }, { pagePath: pp })) console.log("  ", n.id, n.attributes.width, n.attributes.height, n.attributes.aspectRatio, n.attributes.radius);
  }
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title);
  if (b?.id && b.id !== "main") { await (await f.getBranches()).find(x => x.id === b.id).merge(); console.log("merged"); }
  const why = (await (await f.getCollection("gZyqCZdng")).getItems()).find(i => i.slug === "radiotherapy").fieldData.l62iTQw4b.value; console.log("radiotherapy why:", why.slice(0, 160));
});
