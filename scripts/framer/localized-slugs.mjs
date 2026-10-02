// Set per-language slugs on the Insights articles.
// Requires "Translate Page Paths" to be ON in Framer (Localization view → Settings).
// Usage: node localized-slugs.mjs [--dry-run]
import { withFramer, dryRun } from "./lib.mjs";

const DE = "C9aJRu34X", FR = "rRxiWhpq8", IT = "D9HoCmqY1";
const COLLECTION = "WUGvbtwAI";

export const SLUGS = {
  SjIM3r3PY: { en: "which-samsung-ultrasound-system-for-my-practice",
    [DE]: "welches-samsung-ultraschallgeraet-fuer-meine-praxis",
    [FR]: "quel-echographe-samsung-pour-mon-cabinet" },
  Mlm7TYpkh: { en: "samsung-ultrasound-price-switzerland",
    [DE]: "samsung-ultraschallgeraet-preis-schweiz",
    [FR]: "prix-echographe-samsung-suisse" },
  l2qkNy6T8: { en: "new-or-pre-owned-ultrasound-system",
    [DE]: "ultraschallgeraet-neu-oder-occasion",
    [FR]: "echographe-neuf-ou-occasion" },
};
// IT slugs are added when the Italian articles exist (IT currently falls back to English copy).

await withFramer(async (framer) => {
  const col = await framer.getCollection(COLLECTION);
  const items = await col.getItems();
  const updates = [];
  for (const [id, s] of Object.entries(SLUGS)) {
    const item = items.find((i) => i.id === id);
    if (!item) { console.log("missing", id); continue; }
    const slugByLocale = {};
    for (const loc of [DE, FR, IT]) if (s[loc]) slugByLocale[loc] = { action: "set", value: s[loc] };
    console.log(id, item.slug, "→", JSON.stringify(slugByLocale));
    updates.push({ id, slug: item.slug, slugByLocale });
  }
  if (dryRun) return;
  await col.addItems(updates);
  for (const it of await col.getItems()) if (SLUGS[it.id]) console.log("now:", it.id, JSON.stringify(it.slugByLocale));
});
