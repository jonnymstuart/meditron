// Publish the three scheduled draft articles now (Jonny, 18 Nov): remove bold from the body (house rule), set the
// published date to today, draft off. Usage: node scripts/framer/publish-articles-1118.mjs [--dry]
import { withFramer } from "./lib.mjs";
const L = { de: "C9aJRu34X", fr: "rRxiWhpq8", it: "D9HoCmqY1" };
const S = ["handheld-ultrasound-clarius-scanner", "veterinary-ultrasound-switzerland-esaote-system", "samsung-ultrasound-probes-guide"];
const unbold = s => String(s ?? "").replace(/<\/?(strong|b)(\s[^>]*)?>/g, "");
await withFramer(async (f) => {
  const c = await f.getCollection("WUGvbtwAI"); const upd = [];
  for (const i of (await c.getItems()).filter(i => S.includes(i.slug))) {
    const b = i.fieldData.u4L7POZvL;
    upd.push({ id: i.id, draft: false, fieldData: {
      u4L7POZvL: { type: "formattedText", value: unbold(b.value), valueByLocale: Object.fromEntries(Object.values(L).map(id => [id, { action: "set", value: unbold(b.valueByLocale?.[id]?.value) }])) },
      VGodevXNq: { type: "date", value: "2026-11-18T00:00:00.000Z" } } });
  }
  console.log("articles:", upd.length);
  if (process.argv.includes("--dry")) return;
  await c.addItems(upd);
  for (const i of (await c.getItems()).filter(i => S.includes(i.slug))) console.log(i.slug, "| draft:", i.draft, "| date:", i.fieldData.VGodevXNq?.value, "| bold left:", /<(strong|b)[\s>]/.test(JSON.stringify(i.fieldData.u4L7POZvL)));
});
