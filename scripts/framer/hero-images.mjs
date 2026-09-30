import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
const arts = [
 ["a1","Which Samsung ultrasound system is right for my practice?","Specialty · exam volume · probes · space & budget","HERA Z20 · R20 · V8 · V7 · V6 · V5 · V4"],
 ["a2","How much does a Samsung ultrasound system cost in Switzerland?","Model · probes · software · service · financing","Purchase · leasing · certified pre-owned"],
 ["a3","New or pre-owned ultrasound system: what to check before buying","A nine-point checklist for Swiss practices","Probes · service history · warranty · Swissmedic"],
];
const grads = [
 "radial-gradient(120% 140% at 85% 20%, #ffb3a7 0%, #f6d5b5 30%, #cfe7d9 62%, #eef0ea 100%)",
 "radial-gradient(120% 140% at 15% 85%, #b9dcd0 0%, #e6e9dc 35%, #f7cbb7 70%, #f4d9c4 100%)",
 "radial-gradient(120% 140% at 80% 80%, #f5c7b8 0%, #efe3d3 35%, #c9e2d6 70%, #e8f0ea 100%)",
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
for (const [i,[id,title,sub,kicker]] of arts.entries()) {
  await page.setContent(`<html><body style="margin:0"><div style="width:1600px;height:900px;background:${grads[i]};font-family:Inter,'Helvetica Neue',Arial,sans-serif;color:#15294a;position:relative;overflow:hidden">
  <svg width="1600" height="900" style="position:absolute;inset:0;opacity:.55" viewBox="0 0 1600 900" fill="none" stroke="#15294a" stroke-width="2">
   ${[...Array(9)].map((_,k)=>`<path d="M ${1180+k*6} 900 A ${420-k*38} ${420-k*38} 0 0 1 ${1180+k*6} ${60+k*76+ (k*k)}" opacity="${0.9-k*0.09}"/>`).join("")}
  </svg>
  <div style="position:absolute;left:96px;top:88px;font-size:22px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;opacity:.8">Insights · Meditron</div>
  <div style="position:absolute;left:96px;top:250px;width:1000px;font-size:74px;line-height:1.05;font-weight:700;letter-spacing:-.02em">${title}</div>
  <div style="position:absolute;left:96px;top:660px;font-size:30px;font-weight:500;opacity:.85">${sub}</div>
  <div style="position:absolute;left:96px;top:720px;font-size:24px;opacity:.7">${kicker}</div>
  <div style="position:absolute;right:96px;bottom:72px;font-size:22px;font-weight:600;opacity:.8">Official Samsung Healthcare distributor in Switzerland</div>
  </div></body></html>`);
  await page.screenshot({ path: `${id}.jpg`, type: "jpeg", quality: 88 });
  console.log("wrote", id);
}
await browser.close();
