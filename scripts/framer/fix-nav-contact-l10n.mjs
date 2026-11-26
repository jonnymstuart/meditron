// Phone menu "Contact" in DE/FR/IT (26 Nov). The 24 Nov fix (call-1124-components.mjs) pointed the EN text to /contact,
// but the DE/FR/IT values of the two New Navigation sources still linked only the first letter to /old-home
// ("<a href="/old-home">K</a>ontakt"). Now the whole word links to /contact (Framer renders it in the page's language).
// Usage: node scripts/framer/fix-nav-contact-l10n.mjs
import { withFramer } from "./lib.mjs";
const LOC = { de: ["C9aJRu34X", "Kontakt"], fr: ["rRxiWhpq8", "Contact"], it: ["D9HoCmqY1", "Contatti"] };
const SOURCES = ["1jnfP6eUPs98KRvnPtDqzy", "2Y12w6eeeBVU3fkyOqs19t"];
await withFramer(async (f) => {
  const value = w => `<p dir="auto"><a href="/contact">${w}</a></p>`;
  const valuesBySource = Object.fromEntries(SOURCES.map(s => [s, Object.fromEntries(Object.values(LOC).map(([id, w]) => [id, { action: "set", value: value(w) }]))]));
  console.log(JSON.stringify(await f.setLocalizationData({ valuesBySource })).slice(0, 200));
  const g = (await f.getLocalizationGroups({ type: "component" })).find(x => x.name === "New Navigation");
  for (const s of g.sources.filter(x => SOURCES.includes(x.id))) for (const [l, [id]] of Object.entries(LOC)) console.log(s.id.slice(0, 6), l, s.valueByLocale?.[id]?.value);
});
