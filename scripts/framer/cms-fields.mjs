// Products CMS: put the length limit into each field name (the only hint editors see in the Framer CMS),
// make the SEO essentials required, and the optional FAQ slots not required.
// Field IDs never change, so page bindings and scripts that use IDs keep working.
// Usage: node scripts/framer/cms-fields.mjs [--dry]
import { withFramer } from "./lib.mjs";
export const LIMITS = { // id: [new name, min, max]  (also used by cms-lint.mjs)
  krFC3FLEV: ["Name (max 60)", 1, 60],
  qFsZD3PuD: ["H1 (max 70)", 1, 70],
  VKK1rLOkt: ["Description (300–600 characters)", 150, 600],
  yNO0L700R: ["Meta Title (max 60)", 20, 60],
  Fw8KRORIm: ["Meta Description (120–155)", 120, 155],
};
const KEYS = ["a8Dv7KCyw", "FE3Bghuvu", "PjsWoh2zd", "Q9AMtoLDz", "aOyuBf41h", "vhVilYGav", "SbdX5INdb", "wQ5pZVQVr", "QHMw6KQYg", "ECh9wGmzt"];
const VALS = ["Tbj_vy63h", "qzdeoLiMo", "IQZRo2Wt4", "VQvL6dl_G", "CRACdCSo6", "BzceDkif5", "v9F_AjhtU", "ofQLZrlVl", "itkpMi72Z", "P_90IpRTk"];
KEYS.forEach((id, n) => LIMITS[id] = [`Key ${n + 1} (max 30)`, 1, 30]);
VALS.forEach((id, n) => LIMITS[id] = [`Value ${n + 1} (max 150)`, 1, 150]);
export const FAQ_Q = ["DgtWCAqSG", "rLcE_AA5B", "YzTVKn3Aa", "dFHEcNCRv", "rn1j_Ulg0", "M8hgbvNb6"];
export const FAQ_A = ["NLA9rfXHq", "JXW61ChTO", "JpYVT2T5Q", "CaUnY6FvZ", "Jobv4lasS", "XzkDy5p5C"];
FAQ_Q.forEach((id, n) => LIMITS[id] = [`FAQ Question ${n + 1} (max 90)`, 10, 90]);
FAQ_A.forEach((id, n) => LIMITS[id] = [`FAQ Answer ${n + 1} Text (max 350, shown on page)`, 40, 350]);
// Old rich-text answers: the page shows the Text field when it is filled, so editing these alone changes nothing.
const OLD_RICH = { R4BTWDCVh: "FAQ Answer 1 (old, not shown: edit the Text field)", JnvQbqY0v: "FAQ Answer 2 (old, not shown: edit the Text field)",
  zbg3y_eFj: "FAQ Answer 3 (old, not shown: edit the Text field)", wNA8ZUOAA: "FAQ Answer 4 (old, not shown: edit the Text field)" };
const REQUIRED = new Set(["krFC3FLEV", "qFsZD3PuD", "yNO0L700R", "Fw8KRORIm", "VKK1rLOkt"]);
const OPTIONAL = new Set([...FAQ_Q, ...FAQ_A, ...KEYS, ...VALS]);
if (process.argv[1].endsWith("cms-fields.mjs")) await withFramer(async (f) => {
  const dry = process.argv.includes("--dry");
  const c = await f.getCollection("IGaxjVLL3");
  for (const fl of await c.getFields()) {
    const attrs = { type: fl.type };
    const name = LIMITS[fl.id]?.[0] ?? OLD_RICH[fl.id];
    if (name && name !== fl.name) attrs.name = name;
    if (REQUIRED.has(fl.id) && fl.required === false) attrs.required = true;
    if (OPTIONAL.has(fl.id) && fl.required === true) attrs.required = false;
    if (Object.keys(attrs).length === 1) continue;
    console.log(fl.id, JSON.stringify(fl.name), "→", JSON.stringify(attrs));
    if (!dry) await fl.setAttributes(attrs);
  }
  if (!dry) for (const fl of await c.getFields()) if (LIMITS[fl.id] || OLD_RICH[fl.id]) console.log("now:", fl.id, fl.name, "required:", fl.required);
});
