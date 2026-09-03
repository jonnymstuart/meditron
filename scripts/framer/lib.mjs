import "dotenv/config";
import { connect } from "framer-api";

export async function withFramer(fn) {
  const url = process.env.FRAMER_PROJECT_URL;
  if (!url) throw new Error("FRAMER_PROJECT_URL missing (.env)");
  const framer = await connect(url, process.env.FRAMER_API_KEY);
  try {
    return await fn(framer);
  } finally {
    await framer.disconnect();
  }
}

export const dryRun = process.argv.includes("--dry-run");
