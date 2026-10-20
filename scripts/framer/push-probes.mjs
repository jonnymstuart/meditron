// Create the Samsung probe products from content/en/products/samsung-transducers.md and link them
// from their systems' "Compatible Products" field. Also moves the HERA Z20 off the old shape
// (probes in Variants, models in Compatible) onto the new one (probes in Compatible, models in Related).
// EN only. German locale is never written. Usage: node push-probes.mjs [--dry-run]
import { readFileSync } from "node:fs";
import { withFramer, dryRun } from "./lib.mjs";

const PRODUCTS = "IGaxjVLL3", VARIANTS = "PXCEKQuTk";
const F = {
  name: "krFC3FLEV", solution: "nFDEePImP", brand: "Vtnnf3hIg", description: "VKK1rLOkt", visible: "HvB4OLS27",
  advisor: "q4q5eySK4", thumb: "Dh60jX8lX", main: "G8s0uckMp", why: "T6CfH6qEg", metaTitle: "yNO0L700R", metaDesc: "Fw8KRORIm",
  variants: "jr6x3yFRX", compatible: "SWiYaC7ST", related: "ZW57wAQ93", specialities: "fvUOHQClB",
  keys: ["a8Dv7KCyw", "FE3Bghuvu", "PjsWoh2zd", "Q9AMtoLDz", "aOyuBf41h"],
  vals: ["Tbj_vy63h", "qzdeoLiMo", "IQZRo2Wt4", "VQvL6dl_G", "CRACdCSo6"],
};
// Z20: related models (V8, R20, V6) and the seven probe rows created in Product - Variants on 8 Oct, to be removed.
const Z20 = "n_rmLkxZU";
const Z20_RELATED = ["YgeuaIqCV", "CY1gnfLXw", "qCWgxMmsJ"];
const OLD_VARIANT_ROWS = ["fmHobV_S6", "D9P3c_hld", "IwQJ2Lbqg", "VqZJKxCl0", "vs8VE4wVb", "jZ36sMsoC", "cHUSVp_Ze"];

const md = readFileSync(new URL("../../content/en/products/samsung-transducers.md", import.meta.url), "utf8");
const fm = (k) => (md.match(new RegExp(`^${k}: "?([^"#\\n]*?)"?\\s*(#.*)?$`, "m")) || [])[1]?.trim();
const section = (h) => { const m = md.match(new RegExp(`\\n#{2,3} ${h}\\n([\\s\\S]*?)(?=\\n#{2,3} |$)`)); return m ? m[1].trim() : ""; };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const p = (s) => `<p dir="auto">${esc(s)}</p>`;
const cols = ["slug", "name", "type", "technology", "frequency", "applications", "volume", "systems", "description"];
const probes = section("Probes").split("\n").filter((l) => l.startsWith("|") && !/^\|\s*(slug|---)/.test(l))
  .map((l) => Object.fromEntries(l.split("|").slice(1, -1).map((s, i) => [cols[i], s.trim()])));
const why = section("Why work with Meditron").split("\n\n").map(p).join("");
const metaT = (section("Meta").match(/meta_title: "(.*)"/) || [])[1];
const metaD = (section("Meta").match(/meta_description: "(.*)"/) || [])[1];
const specialityFor = (apps) => {
  const a = apps.toLowerCase(), out = new Set();
  if (/gynae|obstet|pregnan|fetal/.test(a)) out.add("obstetrics-gynecology");
  if (/musculo/.test(a)) out.add("msk-orthopedics");
  if (/abdomen|breast|thyroid|small parts|vascular|paediat|thoracic|urology/.test(a)) out.add("general-imaging");
  return [...out];
};
console.log(`${probes.length} probes in the content file; visible=${fm("visible")}; dry-run=${dryRun}`);

await withFramer(async (framer) => {
  const all = await framer.getCollections();
  const products = all.find((c) => c.id === PRODUCTS), variants = all.find((c) => c.id === VARIANTS);
  const items = await products.getItems();
  const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
  // Reference fields read back as slugs but are written with item ids: build slug -> id maps.
  const idMap = async (cid) => Object.fromEntries((await all.find((c) => c.id === cid).getItems()).map((i) => [i.slug, i.id]));
  const [brandId, solutionId, teamId, specialityId] = await Promise.all(["iOhhsbixZ", "gZyqCZdng", "tsHmvz0zO", "dAXHr8_JI"].map(idMap));
  const systemName = (slug) => bySlug[slug]?.fieldData[F.name]?.value ?? slug;

  // Pass 1: text fields (addItems on this project throws after creating rows when images are included).
  const pass1 = probes.map((r) => {
    const systems = r.systems.split(",").map((s) => s.trim()).filter(Boolean);
    const sysNames = systems.map(systemName).join(" and ");
    const fd = {
      [F.name]: { type: "string", value: r.name },
      [F.solution]: { type: "collectionReference", value: solutionId[fm("solution")] },
      [F.brand]: { type: "collectionReference", value: brandId[fm("brand")] },
      [F.advisor]: { type: "collectionReference", value: teamId[fm("advisor")] },
      [F.visible]: { type: "boolean", value: fm("visible") === "true" },
      [F.description]: { type: "string", value: r.description },
      [F.why]: { type: "formattedText", value: why },
      [F.metaTitle]: { type: "string", value: metaT.replace("{name}", r.name) },
      [F.metaDesc]: { type: "string", value: metaD.replace("{name}", r.name).replace("{type}", r.type.toLowerCase()).replace("{systems_names}", sysNames) },
      [F.specialities]: { type: "multiCollectionReference", value: specialityFor(r.applications).map((s) => specialityId[s]).filter(Boolean) },
      [F.compatible]: { type: "multiCollectionReference", value: systems.map((s) => bySlug[s]?.id).filter(Boolean) },
      [F.variants]: { type: "multiCollectionReference", value: [] },
      [F.related]: { type: "multiCollectionReference", value: [] },
    };
    [["Type", r.type], ["Technology", r.technology], ["Nominal frequency range", r.frequency], ["Applications", r.applications], ["3D/4D volume imaging", r.volume]]
      .forEach(([k, v], i) => { fd[F.keys[i]] = { type: "string", value: k }; fd[F.vals[i]] = { type: "string", value: v }; });
    const prev = bySlug[r.slug];
    return { ...(prev ? { id: prev.id } : { slug: r.slug }), draft: false, fieldData: fd };
  });
  for (const k of ["brand", "solution", "advisor"]) if (!pass1[0].fieldData[F[k]].value) throw new Error(`${k} "${fm(k)}" not found`);

  if (dryRun) { console.log(JSON.stringify(pass1[0], null, 1).slice(0, 1500)); return; }
  await products.addItems(pass1);
  const now = await products.getItems();
  const probeIds = Object.fromEntries(probes.map((r) => [r.slug, now.find((i) => i.slug === r.slug)?.id]));
  console.log("probe products:", JSON.stringify(probeIds));

  // Pass 2: images (placeholder tiles; image field value must be the uploaded url).
  const pass2 = [];
  for (const r of probes) {
    const bytes = readFileSync(new URL(`../../content/images/probes/${r.slug.replace(/^samsung-/, "")}.jpg`, import.meta.url));
    const img = await framer.uploadImage({ image: { bytes, mimeType: "image/jpeg" }, name: `${r.slug}.jpg`, altText: `${r.name} ultrasound transducer` });
    pass2.push({ id: probeIds[r.slug], fieldData: { [F.thumb]: { type: "image", value: img.url }, [F.main]: { type: "image", value: img.url } } });
  }
  await products.addItems(pass2).catch((e) => console.warn("addItems(images) threw after writing (known):", e.message));

  // Systems: Compatible = their probes; Z20 also gets Related models and an empty Variants field.
  const systemProbes = {};
  for (const r of probes) for (const s of r.systems.split(",").map((x) => x.trim())) (systemProbes[s] ||= []).push(probeIds[r.slug]);
  const sysUpdates = Object.entries(systemProbes).map(([slug, ids]) => ({
    id: bySlug[slug].id,
    fieldData: {
      [F.compatible]: { type: "multiCollectionReference", value: ids },
      ...(bySlug[slug].id === Z20 ? { [F.related]: { type: "multiCollectionReference", value: Z20_RELATED }, [F.variants]: { type: "multiCollectionReference", value: [] } } : {}),
    },
  }));
  await products.addItems(sysUpdates).catch((e) => console.warn("addItems(systems) threw after writing (known):", e.message));

  // Cleanup: the seven probe cards created in Product - Variants on 8 Oct, only once nothing references them.
  const after = await products.getItems();
  const stillRef = after.filter((i) => (i.fieldData[F.variants]?.value || []).some((v) => OLD_VARIANT_ROWS.includes(v) || /^(ca1-7sv2|ca3-10a|cv1-8a|ea2-11ar|ea2-11av|ev2-12|lm2-18)$/.test(v)));
  if (stillRef.length) console.warn("variant rows still referenced by", stillRef.map((i) => i.slug), "- not removed");
  else { await variants.removeItems(OLD_VARIANT_ROWS); console.log("removed 7 probe rows from Product - Variants; now", (await variants.getItems()).length, "items"); }

  const z = after.find((i) => i.id === Z20);
  console.log("Z20 compatible:", z.fieldData[F.compatible]?.value?.length, "| related:", z.fieldData[F.related]?.value?.length, "| variants:", z.fieldData[F.variants]?.value?.length);
  const sample = after.find((i) => i.slug === probes[0].slug);
  console.log(`${sample.slug}: thumb=${!!sample.fieldData[F.thumb]?.value} compatible=${JSON.stringify(sample.fieldData[F.compatible]?.value)} spec1=${sample.fieldData[F.keys[0]]?.value}=${sample.fieldData[F.vals[0]]?.value}`);
});
