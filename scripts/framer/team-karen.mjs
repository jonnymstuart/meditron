// 24 Nov client call: Dr. Karen Niemand ("Karim" in the call notes) has retired. Her Team item is set to draft
// (hidden from /team, kept in the CMS) and her article(s) get Nikita Müller as author.
// Usage: node scripts/framer/team-karen.mjs [--dry]
import { withFramer } from "./lib.mjs";
const KAREN = "ZaPXz5XrG", NIKITA = "zHjlWWk21", AUTHOR = "QGmLkzs2Z";
await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const news = await f.getCollection("WUGvbtwAI");
  const mine = (await news.getItems()).filter(i => [KAREN, "karen"].includes(i.fieldData[AUTHOR]?.value));
  console.log("articles by Karen:", mine.map(i => i.slug).join(", ") || "none");
  const team = await f.getCollection("tsHmvz0zO");
  const karen = (await team.getItems()).find(i => i.id === KAREN);
  console.log("Karen:", karen?.slug, "draft:", karen?.draft);
  if (dry) return;
  if (mine.length) await news.addItems(mine.map(i => ({ id: i.id, fieldData: { [AUTHOR]: { type: "collectionReference", value: NIKITA } } })));
  if (karen && !karen.draft) await karen.setAttributes({ draft: true });
  const n2 = await news.getItems(), t2 = await team.getItems();
  for (const i of mine) console.log("article", i.slug, "author now", n2.find(x => x.id === i.id)?.fieldData[AUTHOR]?.value);
  console.log("Karen draft now:", t2.find(i => i.id === KAREN)?.draft);
});
