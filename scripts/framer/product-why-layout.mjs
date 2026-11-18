// Product template (/products/:Products), section "Why Work With Meditron" (fkmNQJHXN), in the hub's two-column design:
//   Why Row:     [Title "Why work with Meditron" (Heading 2 Hub) + intro (T6CfH6qEg)] | [Why Side QIolXlLNu: H4 items]
//   Reading Row: [Reading Intro G2TvZEqos: H3 + one line]                          | [Reading frZ7K4sHO: linked H4 + sentence]
// Columns 1fr, max 760px, gap 64px; H4 = FAQ question look; body Body LG-Regular Hub; stacked on tablet/phone.
import { withFramer } from "./lib.mjs";
const PP = { pagePath: "/products/:Products" };
const H2 = "Text Styles/Headings/Heading 2 Hub", H3 = "Text Styles/Headings/Heading 3 Hub", H4 = "Text Styles/Headings/Heading 4 Hub", BODY = "Text Styles/Body/Body LG-Regular Hub", LINK = "Link Styles/Hub Link";
const vis = id => `visible.from="var(--variable-${id})" visible.transforms.0.name="isSet"`;
const row = (id, name, index, v) => `+FrameNode ${id} parent="fkmNQJHXN" index="${index}"; SET ${id} name="${name}" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="start" stackWrapEnabled="false" gap="64px" width="1fr" maxWidth="1200px" height="auto" ${v ? vis(v) : ""};`;
const rt = (id, parent, index, field, extra) => `DUPE ORTiKtCRn newId="${id}" parent="${parent}" index="${index}"; SET ${id} text="var(--variable-${field})" width="1fr" maxWidth="760px" height="auto" ${vis(field)} ${extra};`;
await withFramer(async (f) => {
  const dsl = [
    `SET fkmNQJHXN gap="96px";`,
    row("pwRow", "Why Row", 0),
    `+FrameNode pwLeft parent="pwRow" index="0"; SET pwLeft name="Why Intro Column" layout="stack" stackDirection="vertical" stackAlignment="start" gap="24px" width="1fr" maxWidth="760px" height="auto";`,
    `MOVE x_miIDJlW parent="pwLeft" index="0"; SET x_miIDJlW textStylePreset="${H2}" width="100%" maxWidth="760px";`,
    `MOVE ORTiKtCRn parent="pwLeft" index="1"; SET ORTiKtCRn width="100%" maxWidth="760px" stylePresetParagraph="${BODY}" stylePresetHeading3="${H3}" stylePresetHeading4="${H4}" linkStylePreset="${LINK}";`,
    rt("pwSide", "pwRow", 1, "QIolXlLNu", ""),
    row("prRow", "Reading Row", 1, "G2TvZEqos"),
    rt("prIntro", "prRow", 0, "G2TvZEqos", ""),
    rt("prList", "prRow", 1, "frZ7K4sHO", ""),
  ].join(" ");
  const r = await f.agent.applyChanges(dsl, PP); console.log(JSON.stringify(r).slice(0, 900));
  const ids = r.renamedIds ?? {};
  const b = await f.agent.getActiveBranch(); console.log("branch:", b?.title);
  const [page] = await f.agent.serializeNodes({ ids: ["Ey6hLkhEt"], depth: 1 }, PP);
  const small = page.children.filter(c => parseInt(c.attributes?.width) < 1000).map(c => c.id); console.log("breakpoints:", page.children.map(c => `${c.id}:${c.name ?? ""}:${c.attributes?.width}`).join(" "), "| stacking on", small.join(","));
  const o = small.flatMap(bp => [ids.pwRow, ids.prRow].map(rid => `SET ${bp}${rid} stackDirection="vertical" gap="24px";`)).concat(small.map(bp => `SET ${bp}fkmNQJHXN gap="56px";`));
  if (o.length) console.log("overrides:", JSON.stringify(await f.agent.applyChanges(o.join(" "), PP)).slice(0, 300));
  const [s] = await f.agent.serializeNodes({ ids: ["fkmNQJHXN"], depth: 3 }, PP);
  const show = (n, d = 0) => { const a = n.attributes || {}; if (n.type === "TextBlock" || n.type === "TextRun") return; console.log(" ".repeat(d * 2) + n.id, n.name ?? "", ["stackDirection", "width", "maxWidth", "height", "text", "textStylePreset", "stylePresetHeading4", "stylePresetParagraph"].map(k => a[k] !== undefined ? `${k}=${String(a[k]).slice(0, 40)}` : "").filter(Boolean).join(" ")); (n.children || []).forEach(c => show(c, d + 1)); };
  show(s);
  const sh = await f.agent.readProject([{ type: "screenshot", id: "fkmNQJHXN" }], PP); console.log("SHOT", sh.results[0].image_url);
});
