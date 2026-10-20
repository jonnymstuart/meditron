// Shared "To discuss" state for the Meditron visibility dashboard.
// GET  -> { items: { [key]: { done, note, by, at } }, url }
// POST { key, done, note, by } with header x-pass = REPORT_PASS -> merged state
// Storage: one JSON file in the project's Vercel Blob store (BLOB_READ_WRITE_TOKEN), no SDK.
const BLOB_API = "https://blob.vercel-storage.com";
const NAME = "discuss.json";
// Same hash as the dashboard gate (sha256 of the passcode); REPORT_PASS env var overrides when set.
const PASS_HASH = "6c6dab33994f8b98bb9db20ef4ed62d66b5f267cbcfc575b582e317fe2d58c62";
async function passOk(pass) {
  if (process.env.REPORT_PASS) return pass === process.env.REPORT_PASS;
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(String(pass || "")).digest("hex") === PASS_HASH;
}

function storeHost() {
  const tok = process.env.BLOB_READ_WRITE_TOKEN || "";
  const m = tok.match(/^vercel_blob_rw_([A-Za-z0-9]+)_/);
  return m ? `https://${m[1].toLowerCase()}.public.blob.vercel-storage.com` : null;
}

async function readState() {
  const host = storeHost();
  if (!host) return { items: {}, url: null, connected: false };
  const url = `${host}/${NAME}`;
  const r = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
  if (r.status === 404) return { items: {}, url, connected: true };
  if (!r.ok) throw new Error(`blob read ${r.status}`);
  const j = await r.json().catch(() => ({}));
  return { items: j.items || {}, url, connected: true };
}

async function writeState(items) {
  const r = await fetch(`${BLOB_API}/${NAME}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      "x-api-version": "7",
      "x-add-random-suffix": "0",
      "x-allow-overwrite": "1",
      "x-content-type": "application/json",
      "x-cache-control-max-age": "60",
    },
    body: JSON.stringify({ items, updated: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`blob write ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  try {
    if (req.method === "GET") return res.status(200).json(await readState());
    if (req.method !== "POST") return res.status(405).json({ error: "method" });
    if (!(await passOk(req.headers["x-pass"]))) return res.status(401).json({ error: "passcode" });
    if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: "storage not connected" });
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const key = String(body.key || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
    if (!key) return res.status(400).json({ error: "key" });
    const note = String(body.note || "").slice(0, 1000).trim();
    const by = String(body.by || "").slice(0, 60).trim();
    const done = !!body.done;
    const state = await readState();
    const prev = state.items[key] || {};
    state.items[key] = { done, note, by: by || prev.by || "", at: new Date().toISOString(), doneAt: done ? (prev.done ? prev.doneAt || new Date().toISOString() : new Date().toISOString()) : null };
    const w = await writeState(state.items);
    return res.status(200).json({ items: state.items, url: w.url || state.url });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
