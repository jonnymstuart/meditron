// Pushes Italian title, intro, body, slug and FAQ rows for articles 1-6 (from .cache/it.json), then publishes to staging.
import { withFramer } from "./lib.mjs";
import fs from "node:fs";
const D = JSON.parse(fs.readFileSync(new URL("./.cache/it.json", import.meta.url), "utf8"));
const IT = "D9HoCmqY1";
const set = v => ({ [IT]: { action: "set", value: v } });
await withFramer(async (framer) => {
  const news = await framer.getCollection("WUGvbtwAI");
  const items = await news.getItems();
  const updates = [];
  for (const a of Object.values(D)) {
    const it = items.find(i => i.slug === a.en_slug); if (!it) { console.log("missing", a.en_slug); continue; }
    updates.push({ id: it.id, slug: it.slug, draft: it.draft, slugByLocale: set(a.it_slug), fieldData: {
      xusWsRBZC: { type: "string", value: it.fieldData.xusWsRBZC.value, valueByLocale: set(a.title) },
      Rzh74yeS0: { type: "string", value: it.fieldData.Rzh74yeS0.value, valueByLocale: set(a.intro) },
      u4L7POZvL: { type: "formattedText", value: it.fieldData.u4L7POZvL.value, valueByLocale: set(a.body) } } });
  }
  await news.addItems(updates);
  for (const it of await news.getItems()) if (Object.values(D).some(a => a.en_slug === it.slug))
    console.log(it.slug, "draft=", it.draft, "it-slug=", it.slugByLocale[IT]?.value, "it-title=", it.fieldData.xusWsRBZC.valueByLocale?.[IT]?.status, "it-body=", it.fieldData.u4L7POZvL.valueByLocale?.[IT]?.status);
  const faq = await framer.getCollection("Y7o7IM_3D");
  const rows = await faq.getItems();
  const fu = [];
  for (const a of Object.values(D)) a.faq.forEach(([q, ans], i) => { const r = rows.find(x => x.slug === `${a.en_slug}-${i + 1}`); if (!r) { console.log("no faq row", a.en_slug, i + 1); return; }
    fu.push({ id: r.id, slug: r.slug, fieldData: { vkOdkDocK: { type: "string", value: r.fieldData.vkOdkDocK.value, valueByLocale: set(q) }, hF3or4UG4: { type: "string", value: r.fieldData.hF3or4UG4.value, valueByLocale: set(ans) } } }); });
  await faq.addItems(fu);
  console.log("faq rows updated", fu.length, "it-status sample:", (await faq.getItems()).find(x => x.slug === "new-or-pre-owned-ultrasound-system-1")?.fieldData.vkOdkDocK.valueByLocale?.[IT]?.status);
  const p = await framer.agent.publish({ action: "preview" });
  console.log("preview:", p.status, JSON.stringify(p.errors), "changes:", p.changes?.length);
  const c = await framer.agent.publish({ action: "confirm_publish", confirmationHash: p.confirmationHash });
  console.log("staging:", c.status, c.versions?.[0]?.id);
});
