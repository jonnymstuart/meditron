// Syncs content/<lang>/*.md (front-matter + body) into the Framer CMS.
// Collection and field ids are resolved by name; run info.mjs first to see them.
import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import { withFramer, dryRun } from "./lib.mjs";

const LANGS = ["en", "de", "fr", "it"];
const root = new URL("../../content/", import.meta.url);

function load(lang) {
  const dir = new URL(`${lang}/`, root);
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith(".md")); } catch { return []; }
  return files.map((f) => ({ lang, file: f, ...matter(readFileSync(new URL(f, dir), "utf8")) }))
    .filter((d) => d.lang === "en" || d.data.review === "approved");
}

const docs = LANGS.flatMap(load);
console.log(`ready: ${docs.length} docs`, Object.fromEntries(LANGS.map((l) => [l, docs.filter((d) => d.lang === l).length])));
if (dryRun) process.exit(0);

await withFramer(async (framer) => {
  const collections = await framer.getCollections();
  const locales = await framer.getLocales();
  // TODO(day-1): map front-matter `collection:` → collection id, fields → field ids,
  // addItems for EN masters, then setLocalizationData for de/fr/it values (title, slug, body, meta),
  // and setCustomCode for JSON-LD from front-matter `schema:`.
  console.log("collections", collections.map((c) => c.name), "locales", locales.map((l) => l.slug));
});
