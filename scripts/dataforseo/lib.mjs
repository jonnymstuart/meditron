import "dotenv/config";
const BASE = "https://api.dataforseo.com/v3";
const auth = () => {
  const l = process.env.DATAFORSEO_LOGIN, p = process.env.DATAFORSEO_PASSWORD;
  if (!l || !p) throw new Error("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing (.env)");
  return "Basic " + Buffer.from(`${l}:${p}`).toString("base64");
};
export async function dfs(path, body, attempt = 1) {
  try {
    const r = await fetch(`${BASE}/${path}`, { method: body ? "POST" : "GET", headers: { Authorization: auth(), "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json();
    if (j.status_code !== 20000) throw new Error(`${path}: ${j.status_code} ${j.status_message}`);
    return j.tasks;
  } catch (e) {
    // Network drops (ECONNRESET, fetch failed) happen on long runs; retry three times with backoff.
    if (attempt < 4 && /fetch failed|ECONNRESET|ETIMEDOUT|socket/i.test(String(e.message) + String(e.cause?.code ?? ""))) {
      await new Promise(res => setTimeout(res, 2000 * attempt));
      return dfs(path, body, attempt + 1);
    }
    throw e;
  }
}
// Switzerland; Google location code 2756
export const CH = 2756;
export const LANG = { en: "en", de: "de", fr: "fr", it: "it" };
export const today = () => new Date().toISOString().slice(0, 10);
