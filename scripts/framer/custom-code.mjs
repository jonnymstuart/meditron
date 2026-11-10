// Install the Google tag (GTM-M7KR9V2P) at the start of <head> on every page via Site Settings → Custom Code.
import { withFramer } from "./lib.mjs";
const HTML = `<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-M7KR9V2P"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>`;
await withFramer(async (framer) => {
  const before = await framer.getCustomCode();
  console.log("before:", JSON.stringify(before, null, 1));
  if (process.argv.includes("--dry")) return;
  await framer.setCustomCode({ html: HTML, location: "headStart" });
  console.log("after:", JSON.stringify(await framer.getCustomCode(), null, 1));
});
