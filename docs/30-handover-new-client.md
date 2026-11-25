# Handover: starting a new client project from the Meditron kit

Written 25 Nov 2026 for the first new client after Meditron: Almased, a large e-commerce company whose old site is being rebuilt. It works for any client after that too.

Who reads this: the Claude session in the new client's repo, and Jonny. The new session should follow it step by step.

There is no Meditron client data in this file: no figures, contacts, passcodes or project IDs. Don't copy any of that into the new repo.

---

## 1. Set up the new project

1. **One repo per client.** Create a new private GitHub repo, for example `jonnymstuart/almacet-seo`. Don't work in the Meditron repo. Separate repos keep client data, rules and budgets apart, and keep each chat short.
2. **Start a new Claude Code session** on the new repo.
3. **Attach the Meditron repo read-only** so the new session can copy the kit. Ask Claude: "add the repo jonnymstuart/meditron with read access". Copy files across. Never push to Meditron from the new session.
4. **Copy the kit** listed in section 2 (one commit: "Copy the SEO kit from the Meditron project").
5. **Write `CLAUDE.md`** from the template in section 7. Fill in the client facts as you learn them.
6. **Environment:**
   - DataForSEO: ask with the secure credential form (`request_credential`, host `api.dataforseo.com`, type basic). Or put `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` in a local `.env`, which is gitignored. Never paste them into the chat and never commit them.
   - Network: the session proxy blocks hosts that aren't on the environment's list. If a call is refused, add that exact host to the new environment, not to the Meditron one.
   - Semrush connector (optional): it's one sign-in for the whole account. It may need re-authorising in claude.ai connector settings.
   - Vercel connector: also one sign-in for all chats and projects. Reconnecting it in one chat changes it for every chat. Always pass the team ID explicitly.
7. **Runtime for the SEO skills:** run `.claude/skills/seo/bin/claude-seo setup --skip-browser` once. It creates a Python `.venv` inside the skill folder, which is gitignored.

---

## 2. The reusable kit: copy as is

| What | From the Meditron repo | Notes |
|---|---|---|
| SEO skill pack (claude-seo v2.6.2) | `.claude/skills/seo*`, `.claude/agents/`, `scripts/vendor-claude-seo.sh` | For e-commerce, remove `seo-shopify` from the `SKIP=` line in the vendor script and re-run it if the new site is on Shopify. |
| Marketing skills (marketingskills v2.14.28) | the marketingskills folders in `.claude/skills/` (licence in `.claude/skills/product-marketing/LICENSE-marketingskills`), `scripts/vendor-marketingskills.sh` | The SEO audit lives as `marketing-seo-audit` to avoid a name clash. |
| GEO skills | `.claude/skills/geo-citability`, `geo-brand-mentions`, `geo-platform-optimizer` | AI citation scoring, brand mentions, per-engine tactics. |
| Design review | `.claude/skills/impeccable` | `/impeccable critique` and `audit` on screenshots before a client sees a design. Its engine binary may be blocked; if so, read its reference files directly. |
| DataForSEO scripts | `scripts/dataforseo/lib.mjs`, `baseline.mjs`, `ai-prompts.mjs`, `kw-ideas.mjs`, `report-fill.mjs` | Needs `npm i dotenv` in that folder. Run with `NODE_USE_ENV_PROXY=1`. Change the domain check (`seeMeditron`), the country code (`CH = 2756`) and the languages. `kw-ideas.mjs` has an absolute import path and Meditron seed words: fix both. |
| Tracking list | `data/tracking-list.csv` (format only) | Columns: `group,lang,google_keyword,ai_prompt`. Write new rows for the client. |
| Dashboard | `report/index.html`, `report/api/discuss.js`, the shape of `report/data.json` | See section 3. |
| Weekly report skill | `.claude/skills/weekly-report` | Change the client names and sources inside it. |
| Content brief and localise skills | `.claude/skills/content-brief`, `.claude/skills/localize` | Swiss language rules are inside; keep them if the client sells in Switzerland. |
| `.gitignore` | `.gitignore` | Keeps `.env`, the claude-seo `.venv`, `__pycache__` and caches out of git. |

**Don't copy** (Meditron-specific; use only as patterns):
- `scripts/framer/*`: Framer IDs and Meditron templates. The patterns carry over to any platform: changes go on a branch, there's a lint check before publish, fields are referenced by ID not name, and every write is read back.
- `content/`, `docs/` (except this file), `reports/`, `data/keywords/`, `data/redirects.csv`, `docs/glossary.md`.
- `report/data.json` content, the passcode hash in `report/index.html` and `discuss.js`, and the Vercel project and team IDs.

---

## 3. The client dashboard

What it is: one static page (`index.html`) that reads `data.json`, behind a passcode, plus a small Vercel function (`api/discuss.js`) that saves the "To discuss" ticks in a Vercel Blob store.

**Reset it for the new client:**
1. Pick a new passcode and send it to the client yourself. Put only its SHA-256 hash in the file: `printf '%s' 'the-passcode' | sha256sum`. Replace `HASH` in `index.html` and `PASS_HASH` in `api/discuss.js`.
2. Change the brand: the name, the logo SVG path, the colours in `:root`, and the page title.
3. Write a new `data.json` with the same top-level keys: `brand`, `updated`, `goal`, `method`, `kpis`, `months`, `articles`, `discuss`, `glossary`, `programme`. Drop `productModel`, which is Meditron-only, or reuse it for the new site's template plan.
   - Each month has `id`, `label`, `values` (one per KPI), `google`, `aiPrompts`, `status`, `done`, `next`, `gaps`, `focus`, plus the optional `highlights` tiles and `hideTiles`.
   - Start with one month: the baseline.
4. `scripts/dataforseo/report-fill.mjs` turns the latest `reports/data/google-*.json` and `ai-*.json` into a month in `data.json`. Same formulas every month, so months stay comparable.

**Deploy (Vercel, Git route, no file pasting):**
1. Create a new Vercel project for the client, in the right team. Ask Jonny which team. Don't reuse the Meditron project.
2. Commit and push `report/`.
3. Call `create_deployment` with the `teamId`, the new `project` ID, `target: production`, `gitSource` {type github, org, repo, ref: the branch}, and `projectSettings.rootDirectory: "report"` (framework, build and output null).
4. Check the result with `web_fetch_vercel_url` on the deployment URL: `data.json` shows the new `updated` date. The container itself often can't reach `*.vercel.app`.
5. For the discuss ticks: create a Blob store in Vercel → Storage, connect it to the project, then redeploy. Until then the page says saving is off.

---

## 4. Lessons from Meditron

**Measuring rankings**
- Live Google results vary from one call to the next. `baseline.mjs` samples each search 3 times. Report the typical position (the median), not the best of the three. We once told a client "position 3" when he saw 16. `report-fill.mjs` still takes the best (`Math.min`); change it to the median in the new repo.
- Positions swing for 2–4 weeks after a big site change. One weekly reading isn't a trend; say so in the report.
- Since late Oct 2026 Google wraps many results in a `google.com/goto` link. The real domain is in the breadcrumb, and `baseline.mjs` already handles this. Keep that code.
- Always name the source and the date next to every number.
- Location and language change results. DataForSEO asks as a desktop user in the country, in the page's language. The client's own browser adds personal history, the city and the browser language. Explain this before they compare screenshots.

**Analytics**
- Built-in site analytics (Framer's, in our case) can be mostly bot traffic. Meditron's showed one month where almost all "visitors" came from one country on desktop. Check the country split before showing traffic to a client.
- Search Console is the source of truth for Google. Ask the client for access (Full user, domain property) in week 1. It's the slowest thing to get.

**Search Console work**
- URL inspection allows about 10 "Request indexing" clicks a day per property. Make a prioritised list (key pages × languages) and give it to one person to do daily.
- After fixing a structured-data error, run "Test live URL" first, then press "Validate fix" in the report. For product errors that's under Shopping → Product snippets / Merchant listings.
- A domain property counts every subdomain. Large "Crawled – not indexed" numbers are often an old subdomain still online.

**Old site and redirects come first**
- For Meditron, the old site was still online on a subdomain months later and kept competing with the new one. For a rebuild like Almased's this matters even more:
  - Crawl the old site before launch and keep the crawl.
  - Build the full redirect map (old URL → best new URL, 301, no chains).
  - Keep URLs where possible, and launch with the redirects live.
  - Re-crawl after launch and watch the Search Console 404 report for 6 weeks.
- Find out early who controls the domain and hosting. It's never the person you're talking to.

**Process**
- Plan → client or Jonny approves → do it → read it back → report. Every write is read back through the API before saying "done".
- Verify on the live site after each production publish. Staging and branch previews sit behind a login, so live is the real test.
- Editor or canvas screenshots don't show the site's custom CSS. Don't trust them for CSS fixes.
- Jonny publishes production. Claude publishes to staging only.
- Keep client-facing documents (plain, short, no internals) apart from internal notes.
- Don't hide figures that went down. If a client insists, hide them with a visible note and say what still shows the drop.
- Every week: one commit in `reports/` and one email. If a step failed, the report says so.

**Content rules that worked**
- Plain, short English. No bold in content. Lines of 14 words or fewer.
- No claims the client can't back up. The client proofreads every language before publish.
- In-context photos for articles, never a cut-out on white. No photo repeated on neighbouring articles.

**CMS editors**
- The client's team will overfill every field. Put the limit in the field name ("Meta Title (max 60)") and run a lint script before every publish. Framer had no hard length limit; check what the new platform offers.

**Tools**
- Vendor skill packs as files in the repo (with a vendor script and the version in `CLAUDE.md`), so every session has the same versions.
- Our own rules in `CLAUDE.md` win over the skill packs' suggestions. Say so in `CLAUDE.md`.

---

## 5. What's different for an e-commerce client

Unlike Meditron:
- **Prices are allowed** (check with the client). So Product schema with `Offer` (price, currency, availability) is in scope, as are free Merchant Center listings and the Shopping strip.
- **Category pages are the main SEO unit,** not single product pages. Google answers most generic searches with category pages.
- **Faceted navigation and crawl budget:** filter and sort URLs can create millions of pages. Decide early which facets get indexable URLs, and set canonical, noindex or robots rules for the rest.
- **Product variants:** one URL per product, variants as parameters or on the same page, unless a variant has its own search demand.
- **Out-of-stock and discontinued products:** keep the page live (in stock later), or 301 to the closest product or category. Never a 404 wave.
- **Migration checklist for the rebuild:**
  - crawl the old site
  - URL map and 301s
  - canonicals and hreflang (if more than one country or language)
  - XML sitemaps
  - structured data parity
  - analytics and Search Console on the new site before launch
  - a launch-day crawl
  - a 6-week watch

Skills that cover this: `seo-ecommerce`, `seo-technical`, `seo-sitemap`, `seo-hreflang`, `seo-schema`, `schema`, `marketing-seo-audit` (migration section), `site-architecture`, `programmatic-seo`, and `seo-shopify` if it's Shopify.

---

## 6. First week for Almased

1. **Facts:** the domain(s), countries and languages, the new platform and launch date, who controls the domain and hosting, and Search Console and analytics access.
2. **Baseline crawl of the old site:** every URL, status, title, canonical and inbound internal links. Save it in `reports/data/`. It's the source for the redirect map.
3. **DataForSEO baseline:**
   - Keyword ideas for the main categories (`kw-ideas.mjs` with new seeds).
   - A tracking list of 20–40 searches × languages, plus AI prompts.
   - `baseline.mjs` and `ai-prompts.mjs` for the first reading.
4. **Competitors:** who holds the top 3 for the main category searches, and what their category pages do.
5. **Dashboard:** reset (section 3), with the baseline month only, deployed to a new Vercel project, passcode sent by Jonny.
6. **Redirect map draft** from the crawl, for the developers of the new site.
7. **First data pack for the client:** the baseline, the biggest risks of the rebuild, and three quick wins. Plain English, sources and dates named.

---

## 7. `CLAUDE.md` template for the new repo

```markdown
# Project context: <Client> SEO

Client: <name> (<domain>), <what they sell>, <countries / languages>.
Programme: <dates>, budget <amount>. Weekly report every <day>.
Goal: <the searches and markets that matter>. Priority 1: the redirect map for the site rebuild.

## Rules of the road
- Site platform: <platform>. Changes go through <API / agent>, on a branch, published only when Jonny says.
- Jonny publishes production. Claude publishes to staging only.
- Keyword and ranking data: DataForSEO (location <code>, languages <list>). Report the median of 3 samples, with source and date.
- Search Console is the source of truth for Google traffic.
- The client proofreads every language before publish. No claims the client can't back up.
- Pricing: <allowed / not allowed>. Schema: <Product + Offer / other>.
- Content: plain short English, no bold, lines ≤14 words.
- Backlinks: no paid links, no PBNs, no automated directory blasts.
- Skill packs vendored in .claude/skills (claude-seo, marketingskills, geo-*, impeccable). Our rules win over theirs.
- Every week: a commit in reports/ and an email to the client. If a step fails, the report says so.
- Commit messages in English, imperative. No secrets in git (.env is ignored).
```

---

## 8. Step by step: what Jonny does, and what to paste into the new chat

Do these in order. "You do" steps are done in a browser. "Paste" steps are messages for the new chat. Wait for each one to finish before the next.

### Before the chat (you do, about 10 minutes)

1. **Create the repo on GitHub:** github.com → New repository → name `almased-seo`, Private, tick "Add a README" so it has a main branch.
2. **Give Claude access to it:** if the Claude GitHub app is installed for selected repos only, go to GitHub → Settings → Applications → Claude → Configure → add `almased-seo`.
3. **Start the chat:** claude.ai/code → new session → pick the repo `almased-seo`.

### Prompt 1: set up the repo and copy the kit

> New client project: Almased, a large e-commerce company whose old website is being rebuilt. Add the repo jonnymstuart/meditron with read access only. Read `docs/30-handover-new-client.md` there and follow it. First: copy the kit from section 2 into this repo, write CLAUDE.md from the template in section 7 (leave the client facts as placeholders), and update `.gitignore`. Don't copy any Meditron client data. Commit and push, then tell me what you copied.

### Prompt 2: cloud environment and DataForSEO

> Set up a personal cloud environment for this repo called "almased-seo". Then ask me for the DataForSEO login with the secure credential form (host api.dataforseo.com, username and password). Never ask me to paste it in the chat. Check it works with one free call (the account balance endpoint, appendix/user_data) and tell me the balance. If the scripts need DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD set, use dummy values; the proxy adds the real login.

(You type the DataForSEO login and password into the form that pops up, not into the chat.)

### Prompt 3: skill runtime

> Run the claude-seo setup (`.claude/skills/seo/bin/claude-seo setup --skip-browser`) and check the SEO skills load. If Almased's new site is on Shopify, re-run the vendor script without skipping seo-shopify.

### Prompt 4: the client facts (you answer)

> Here are the facts for CLAUDE.md: domain(s) ___; countries and languages ___; old platform ___, new platform ___, launch date ___; who controls the domain and hosting ___; prices allowed in schema: yes / no; budget and dates ___; weekly report day ___. Fill these into CLAUDE.md and commit.

### Prompt 5: access request email

> Write me a short email to Almased asking for: Full user access to Google Search Console (domain property) for my Google account, Viewer access to their analytics, read access to the new site's staging, the old site's URL list or sitemap if they have one, and the contact who controls the domain and hosting. Plain English, short.

(You send it yourself. Search Console access is the slowest thing to get.)

### Prompt 6: crawl the old site

> Crawl the old site (start from its sitemap and the homepage). Save every URL with status code, title, canonical, meta description, H1, and inbound internal links to `reports/data/`. Summarise: page count by type (category, product, content, other), errors, duplicates, and the biggest technical risks for the rebuild.

### Prompt 7: keyword research and tracking list

> Use DataForSEO for the main markets and languages. Find the main category and brand searches (keyword ideas from 10–15 seed terms I'll confirm), with volumes. Then propose a tracking list of 30–40 searches plus 10 AI prompts in `data/tracking-list.csv`. Show me the list before running the baseline. Tell me the expected DataForSEO cost first.

### Prompt 8: first baseline reading

> Run the baseline: `baseline.mjs` (3 samples per search, report the median position) and `ai-prompts.mjs`. Change `report-fill.mjs` to use the median, not the best of 3. List who holds the top 3 for the main category searches and what their category pages do.

### Prompt 9: the dashboard

> Set up the client dashboard from section 3 of the handover: Almased branding, a new random passcode (show it to me once; only its hash goes in the files), and the baseline month in `data.json`. Then deploy it to a new Vercel project. Ask me which Vercel team first, and don't touch any other Vercel project. Check the live `data.json` after the deploy and send me the link.

(Then, if you want the "To discuss" ticks: Vercel → Storage → create a Blob store and connect it to the new project, and tell the chat to redeploy.)

### Prompt 10: redirect map draft

> From the old-site crawl, draft the redirect map for the developers: old URL → best new URL (301, no chains). Mark which ones need a decision from Almased. Save it as `data/redirects.csv` plus a short brief in `docs/` explaining the rules (keep URLs where possible, out-of-stock products, faceted URLs).

### Prompt 11: first data pack for the client

> Write the first data pack for Almased: the baseline (rankings, AI answers), the three biggest risks of the rebuild, and three quick wins. Plain English, sources and dates named. Make it a Google Doc and give me the link.

### Prompt 12 (optional): weekly routine

> Set up a scheduled task every Monday morning that runs the baseline and AI prompts, updates `report/data.json`, redeploys the dashboard, commits a report in `reports/`, and drafts the client email for me to send.

### Connectors to check (you do, once)

- **Vercel:** already connected for all projects. Don't reconnect it in a way that drops the Meditron project.
- **Semrush (optional):** claude.ai → Settings → Connectors → Semrush → reconnect if it asks.
- **Google Drive:** already connected; it's used for the Google Docs.
