// 24 Nov call + 19 Nov critique, shared components (same branch as call-1124-template.mjs):
//  1. Components/Input (p0XjNFoYQ): every variant's form input was named "Name", so the Let's Talk form sent
//     Name, Organization, Email (active state) and Message under one key. formInputName cannot follow the Label
//     variable (Framer keeps it static), so each variant gets a fixed name: text = Name, textbox = Message,
//     email = Email. Organization shares the text variant and still submits as "Name" (needs its own variant).
//  2. New Navigation (Q6QxmZWoF): in "Contact" only the "C" was a link, to /old-home; both text runs now link to
//     /contact in every variant. The 46px icon that linked to /old-home now links to /.
// Usage: node scripts/framer/call-1124-components.mjs [branch title]
import { withFramer } from "./lib.mjs";
await withFramer(async (f) => {
  const title = process.argv[2]; if (title) { const b = (await f.getBranches()).find(x => x.title === title); await b?.switch?.(); }
  // 1. Input names
  const NAMES = { xMmgPnJt6: "Name", uhVNyNwcvxMmgPnJt6: "Name", DODG0PnvvxMmgPnJt6: "Message", e4M_sR1llxMmgPnJt6: "Message", vllqE41C7xMmgPnJt6: "Email", TP5tYXiO8xMmgPnJt6: "Email" };
  console.log(JSON.stringify(await f.agent.applyChanges(Object.entries(NAMES).map(([id, v]) => `SET ${id} formInputName="${v}";`).join(" "))).slice(0, 300));
  // 2. Navigation links
  const [nav] = await f.agent.serializeNodes({ ids: ["Q6QxmZWoF"], depth: 14 });
  const runs = [], svgs = []; const w2 = n => { const a = n.attributes || {};
    if (n.type === "RichTextNode" && JSON.stringify(n.children || []).includes("/old-home")) for (const blk of n.children || []) for (const r of blk.children || []) runs.push(r.id);
    if (n.type !== "TextRun" && a.link?.href === "/old-home") svgs.push(n.id); (n.children || []).forEach(w2); }; w2(nav);
  console.log("contact runs:", runs.length, "icons:", svgs.length);
  const dsl = [...runs.map(id => `SET ${id} link.href="/contact";`), ...svgs.map(id => `SET ${id} link.href="/";`)].join(" ");
  console.log(JSON.stringify(await f.agent.applyChanges(dsl)).slice(0, 400));
  console.log("branch:", (await f.agent.getActiveBranch())?.title);
  // Read back
  const [inp2] = await f.agent.serializeNodes({ ids: ["p0XjNFoYQ"], depth: 3 }); const names = []; const w3 = n => { if (n.type === "FormPlainTextInputNode") names.push(n.attributes.formInputName); (n.children || []).forEach(w3); }; w3(inp2);
  console.log("input names now:", [...new Set(names)].join(", "));
  const [nav2] = await f.agent.serializeNodes({ ids: ["Q6QxmZWoF"], depth: 14 }); const s = JSON.stringify(nav2);
  console.log("old-home left in nav:", (s.match(/\/old-home/g) || []).length, "| /contact links:", (s.match(/"href":"\/contact"/g) || []).length);
});
