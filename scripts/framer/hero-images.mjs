// Flat-colour placeholder images for Insights articles: brand colour + Meditron mark, 3:2, no text.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { readFileSync } from "node:fs";
const COLOURS = ["D9E7D1","EFDCDF","F8F6EA","FDD682","ECDBDB","EFE8D1","D8C8C8"];
const NAVY = "#12304B";
const mark = readFileSync(new URL("../../content/images/meditron-mark.svg", import.meta.url), "utf8").replace(/fill="[^"]*"/g, `fill="${NAVY}"`).replace(/width="48" height="30"/, 'width="420" height="262"');
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
for (const [i, c] of COLOURS.entries()) {
  await page.setContent(`<body style="margin:0"><div style="width:1500px;height:1000px;background:#${c};display:grid;place-items:center">${mark}</div></body>`);
  await page.screenshot({ path: `flat-${i+1}-${c}.jpg`, type: "jpeg", quality: 90 });
}
await browser.close(); console.log("done");
