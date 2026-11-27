# How to connect to a Framer project from Claude Code

Written 27 Nov 2026 from the Meditron project, for another Claude chat that works on a different Framer site. It explains how we connect, what works, and what caught us out. It contains no Meditron IDs, keys or URLs: use your own project's values.

---

## 1. What it is

We don't use the old Framer MCP plugin. We use Framer's official **Server API**, through the npm package `framer-api` (we use 0.1.30). A Node script opens a WebSocket to `api.framer.com`, authenticates with a project API key, and then has two layers:

| Layer | What it's for | Examples |
|---|---|---|
| Plain API (`framer.*`) | Data: CMS, translations, code files, branches, publishing | `getCollections()`, `addItems()`, `setLocalizationData()`, `getCodeFiles()`, `getBranches()`, `publish()` |
| Agent API (`framer.agent.*`) | The canvas: pages, frames, text, components, layout | `applyChanges(dsl, { pagePath })`, `serializeNodes()`, `readProject()` screenshots, `readComponentControls()` |

There's also an optional `/framer` skill (`npx @framer/agent@latest setup`) that installs Framer's own agent instructions. It runs on the same API. We do almost everything through small scripts in the repo instead, because they can be re-run, reviewed and kept in git.

---

## 2. Setup, step by step

1. **Get the API key and project URL.**
   - In Framer, open the project, then Site Settings → General → API Keys (the exact menu may move), and create a key.
   - The project URL is the editor URL, e.g. `https://framer.com/projects/<Name>--<id>`.
2. **Store them as secrets, never in chat or git.**
   - Cloud session: add `FRAMER_API_KEY` and `FRAMER_PROJECT_URL` as environment variables in the cloud environment's settings. Ask the user to do it there, or use the secure credential form if the session offers one.
   - Local: put them in a `.env` file that is in `.gitignore`.
3. **Allow the network hosts** (cloud environment → network access):
   - `api.framer.com` (HTTPS and WebSocket) is required. Without it you get `CONNECT 403`.
   - `framer.com` and `www.framer.com` (project URL resolution).
   - `framerusercontent.com` (to download screenshots and images the API returns).
   - Your own live domain, to check pages after publishing.
4. **Install** (Node 22 or newer, ESM):
   ```bash
   mkdir -p scripts/framer && cd scripts/framer
   npm init -y && npm pkg set type=module
   npm i framer-api dotenv
   ```
5. **Add the connection helper**, `scripts/framer/lib.mjs`:
   ```js
   import "dotenv/config";
   import { connect } from "framer-api";

   export async function withFramer(fn) {
     const url = process.env.FRAMER_PROJECT_URL;
     if (!url) throw new Error("FRAMER_PROJECT_URL missing");
     const framer = await connect(url, process.env.FRAMER_API_KEY);
     try { return await fn(framer); } finally { await framer.disconnect(); }
   }
   ```
6. **Run the smoke test**, `scripts/framer/info.mjs`:
   ```js
   import { withFramer } from "./lib.mjs";
   await withFramer(async (f) => {
     console.log(await f.getProjectInfo());
     console.log(await f.getLocales(), await f.getDefaultLocale());
     for (const c of await f.getCollections()) console.log(c.id, c.name, (await c.getFields()).map(x => `${x.id}:${x.name}:${x.type}`));
     console.log(await f.getPublishInfo());
   });
   ```
   Run it with `NODE_USE_ENV_PROXY=1 node scripts/framer/info.mjs`. In a cloud session, Node needs `NODE_USE_ENV_PROXY=1` to go through the session's proxy. Use it on every run.
7. **Save the canvas manual.** The agent API ships its own manual for the change language (the "DSL"). Save it once and read it before editing the canvas:
   ```js
   await withFramer(async f => { (await import("node:fs")).writeFileSync("framer-dsl.md", await f.agent.getSystemPrompt()); });
   ```
   It documents `+FrameNode`, `+RichTextNode`, `+ComponentInstanceNode`, `+WebPageNode`, `SET`, `MOVE`, `DUPE`, `DEL`, `CREATE_VARIANT`, and every attribute.

---

## 3. Recipes

All of these run inside `await withFramer(async (f) => { ... })`.

**Read the CMS**
```js
const col = (await f.getCollections()).find(c => c.name === "Products");
const fields = await col.getFields();            // note the field IDs; use IDs in scripts, never names
const items = await col.getItems();              // item.slug, item.slugByLocale, item.fieldData[fieldId]
```

**Write the CMS, including translations**
```js
await col.addItems([{ id: item.id, fieldData: {
  [fieldId]: { type: "string", value: "English text",
    valueByLocale: { [deLocaleId]: { action: "set", value: "Deutscher Text" } } }
}}]);
```
- Existing item ids update; items without an id are created.
- Always include `value`, the default-locale text, even when you only change a translation. Rich-text fields fail without it.
- Reference fields need the target item's id on write, even though they read back as slugs.
- Hide an item with `item.setAttributes({ draft: true })`.

**Page and component text translations** (static text on the canvas, not CMS)
```js
const groups = await f.getLocalizationGroups({ type: "page" });   // also "component", "collection-item", "settings"
const g = groups.find(x => x.name === "Products Detail");         // CMS detail templates are named "<Collection> Detail"
await f.setLocalizationData({ valuesBySource: { [sourceId]: { [deLocaleId]: { action: "set", value: "<h2 dir=\"auto\">Spezifikationen</h2>" } } } });
```
Keep the same HTML wrapper as the source value.

**Change the canvas** (this auto-creates a branch)
```js
const PP = { pagePath: "/products/:Products" };      // CMS templates use :CollectionName
const r = await f.agent.applyChanges(`SET <nodeId> gap="20px" height="auto";`, PP);
console.log(r.message, r.errors, r.renamedIds);       // renamedIds maps your temporary ids to real ones
const [n] = await f.agent.serializeNodes({ ids: ["<nodeId>"], depth: 2 }, PP);   // read back, always
```
- Leave out `pagePath` to edit inside a component.
- `serializeNodes` on a page id with a large `depth` gives the whole tree, including breakpoints (`$breakpoints`) and variants.

**Screenshots** (they show the editor canvas; good for layout checks)
```js
const s = await f.agent.readProject([{ type: "screenshot", id: "<nodeId>" }], PP);
console.log(s.results[0].image_url);   // download it, crop it, look at it at 1:1
```

**Branches**
```js
const branches = await f.getBranches();                         // [{ id, title }]
await branches.find(b => b.title === "sheer-grove").switch();   // work on an existing branch
await branches.find(b => b.title === "sheer-grove").merge();    // merge into main
console.log(await f.agent.getActiveBranch());
```

**Code components**
```js
const cf = (await f.getCodeFiles()).find(x => x.name === "MyComponent.tsx");
const errors = await f.typecheckCode(cf.name, newCode);   // compare with the errors the live file already has
await cf.setFileContent(newCode);                          // goes live on the next publish
```
Keep the source in the repo. Before pushing, check that the live file still equals your last committed version, so you never overwrite a change made in Framer.

**Publish and check**
```js
await f.publish();                  // staging (and production if the plan allows it; see house rules)
console.log(await f.getPublishInfo());   // { production: { deploymentTime }, staging: { … } }
```
The agent layer also has `f.agent.publish({ action: "preview" })` then `{ action: "confirm_publish", confirmationHash }`. Check `publishTarget` and refuse if it says production.

---

## 4. Gotchas (each one cost us time)

- **`applyChanges` creates a branch** on the first change of a session. A new script run may start another branch. Switch to the branch you want first, and merge when done. Delete empty branches.
- **"Applied cleanly" doesn't mean it worked.** A `SET` with an unknown attribute or key can report success and store nothing. Always serialize and read back.
- **Component controls are keyed by their titles,** camel-cased, not the code's prop names. A control titled "FAQ Q1" is `$control__fAQQ1`; one titled "Open" is `$control__open`. Look them up first:
  ```js
  await f.agent.readComponentControls({ componentIds: ["codeFile/<fileId>:default"] });
  ```
- **Breakpoints:** a node's override on the Tablet or Phone breakpoint has the id `<breakpointId><nodeId>`. Set it there to change only that breakpoint.
- **Some values are stored as plain text, not bindings:**
  - `altText="var(--variable-…)"` ends up literally in the HTML. Leave `altText` unset so the CMS image's own alt text is used.
  - `SET text="<h2>…</h2>"` stores the tags as text and drops the style. Use plain text plus `textStylePreset`.
- **`setLocalizationData` doesn't work for CMS text fields.** It returns no error but changes nothing. Use `collection.addItems` with `valueByLocale`. It does work for page and component text and for image alt text.
- **Links in rich text:** a relative link like `/de/products/x` is turned into an internal page link and loses the `/de`. Use absolute URLs (`https://www.example.com/de/products/x`) when the language matters.
- **The default locale's slug is ""**, and the others are e.g. `de`, `fr`, `it`. In code components, `useLocaleInfo()` gives the active locale.
- **Some things the API can't set:**
  - form input names bound to a variable
  - a collection-list filter tied to a component's variable
  - renaming a locale

  Find a workaround or ask the user to do it in the editor.
- **Previews and staging need a Framer login,** so a headless browser can't see them. Check layout with canvas screenshots and the real result on the live site after production is published.
- **Canvas screenshots don't show the site's custom CSS** (head code). Don't use them to check CSS changes.
- **The lint in `applyChanges` replies is useful.** It flags px heights, missing background fills and component variants that don't match the breakpoint. Fix what it reports.
- **Framer renders a copy of the page per breakpoint group,** so a code component (e.g. JSON-LD) can appear twice in the HTML. That's harmless if the copies are identical.
- **Old content keeps old mistakes.** When you fix something in the default language, check the translations of the same text too.

---

## 5. House rules we kept

- Every change goes through a script in the repo, on a branch, and is read back before we say it's done.
- The agent publishes to staging only. A human publishes production, then the agent checks the live pages.
- Refer to fields and nodes by ID, never by name. Names change; IDs don't.
- No fixed px heights on frames that hold CMS lists or bound text. Use `height="auto"` up to the section.
- Run a content lint before every publish: field lengths, empty required fields.
- Log what was changed, and the IDs touched, in a technical checklist doc.
- Never put the API key in chat, in git, or in a script.

---

## 6. Files worth copying from the Meditron repo

All in `scripts/framer/`, and all generic or easy to adapt:
- `lib.mjs`: the connection helper above.
- `info.mjs`: the smoke test.
- `publish.mjs`: checks deployment issues, then publishes.
- `push-code.mjs`: pushes a code component only if the live file equals the given commit, and blocks new type errors.
- `branch-preview.mjs`: publishes a branch preview and refuses if the target is production.
- `hub-redesign-layout.mjs`: its `merge <branch title>` mode is the merge helper.
- `cms-lint.mjs` and `cms-fields.mjs`: the pattern for field-length limits and a pre-publish check. Field IDs must be replaced with your own.
