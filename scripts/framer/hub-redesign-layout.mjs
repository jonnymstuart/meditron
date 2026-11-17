// Samsung hub redesign (17 Nov), hub template /solutions/:Solutions, section "SEO Intro" (KCdlK26rR).
// Rows of two equal columns (max ~14 words per line), stacked on tablet and phone:
//   1 Intro row:  SEO Intro (H2 + paragraph)          | Intro Side (Why Meditron)
//   2 Comparison table (full width, existing node y3OIg9Pa2)
//   3 Guide row:  Guide Intro (H3 + lead + guide link) | Guide (4 specialities)
//   4 Price row:  Price Intro (H3 + lead)              | Price Options (3 options + offer link)
// Rows and columns hide themselves when their field is empty (other hubs). Heights stay auto.
// Usage: node scripts/framer/hub-redesign-layout.mjs build   (then: merge <branch title>)
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/solutions/:Solutions" };
const F = { intro: "yv1RziKgE", why: "l62iTQw4b", guideIntro: "wqlDT7xtm", guide: "Xbhx4ez0s", priceIntro: "hBI23SnEq", price: "nvwQEIXsz" };
const H3 = "Text Styles/Headings/Heading 5", H4 = "Text Styles/Headings/Heading 6";
const LEAD = "Text Styles/Body/Body LG-Regular Hub", BODY = "Text Styles/Body/Body MD-Regular";
const vis = (fid) => `visible.from="var(--variable-${fid})" visible.transforms.0.name="isSet"`;
const row = (id, name, index, fid) => `+FrameNode ${id} parent="KCdlK26rR" index="${index}"; SET ${id} name="${name}" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="start" stackWrapEnabled="false" gap="64px" width="1fr" maxWidth="1200px" height="auto" ${fid ? vis(fid) : ""};`;
const col = (id, rowId, index, fid, p, extra = "") => `DUPE p46MkBSTV newId="${id}" parent="${rowId}" index="${index}"; SET ${id} text="var(--variable-${fid})" width="1fr" maxWidth="760px" height="auto" stylePresetParagraph="${p}" stylePresetHeading3="${H3}" stylePresetHeading4="${H4}" ${vis(fid)} ${extra};`;
const mode = process.argv[2];
const show = (r) => console.log(JSON.stringify(r).slice(0, 1500));
await withFramer(async (f) => {
  if (mode === "build") {
    const dsl = [
      `SET KCdlK26rR gap="96px" stackAlignment="center";`,
      row("rowIntro", "Intro Row", 0),
      `MOVE p46MkBSTV parent="rowIntro" index="0";`,
      `SET p46MkBSTV width="1fr" maxWidth="760px" height="auto" stylePresetHeading3="${H3}";`,
      col("colWhy", "rowIntro", 1, F.why, BODY),
      `SET y3OIg9Pa2 stylePresetHeading3="${H3}";`,
      row("rowGuide", "Guide Row", 2, F.guideIntro),
      col("colGuideIntro", "rowGuide", 0, F.guideIntro, LEAD),
      col("colGuide", "rowGuide", 1, F.guide, BODY),
      row("rowPrice", "Price Row", 3, F.priceIntro),
      col("colPriceIntro", "rowPrice", 0, F.priceIntro, LEAD),
      col("colPrice", "rowPrice", 1, F.price, BODY),
    ].join(" ");
    show(await f.agent.applyChanges(dsl, PP));
    const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title, b?.id);
  }
  if (mode === "overrides" || mode === "build") {
    const [s] = await f.agent.serializeNodes({ ids: ["KCdlK26rR"], depth: 2 }, PP);
    const rows = s.children.filter(c => /Row$/.test(c.name ?? c.attributes?.name ?? ""));
    console.log("section children:", s.children.map(c => `${c.id}:${c.name ?? c.attributes?.name}`).join(", "));
    const dsl = [];
    for (const bp of ["p9v3nmiEl", "RAIzK0lVL"]) { // Tablet, Phone
      dsl.push(`SET ${bp}KCdlK26rR gap="56px";`);
      for (const r of rows) dsl.push(`SET ${bp}${r.id} stackDirection="vertical" gap="24px";`);
    }
    show(await f.agent.applyChanges(dsl.join(" "), PP));
    const ids = [s.id, ...s.children.map(c => c.id), ...rows.flatMap(r => (r.children || []).map(c => c.id))];
    for (const n of await f.agent.serializeNodes({ ids, depth: 0 }, PP)) {
      const a = n.attributes; console.log(n.id, n.name ?? a.name ?? "", "|", a.stackDirection ?? "", a.width ?? "", a.maxWidth ?? "", "h:", a.height, "|", a.text ?? "", a.stylePresetHeading3 ?? "", a.stylePresetParagraph ?? "");
    }
    for (const bp of ["p9v3nmiEl", "RAIzK0lVL"]) for (const n of await f.agent.serializeNodes({ ids: rows.map(r => bp + r.id), depth: 0 }, PP)) console.log(bp, n.id, n.attributes.stackDirection);
  }
  if (mode === "merge") {
    const b = (await f.getBranches()).find(x => x.title === process.argv[3]);
    if (!b) throw new Error("branch not found: " + process.argv[3]);
    await b.merge(); console.log("merged", b.title);
    console.log("branches:", (await f.getBranches()).map(x => x.title).join(", "));
  }
});
