# Tech stack & automation

## Decision summary
| Layer | Choice | Why |
|---|---|---|
| Source of truth | this GitHub repo (Markdown content, CSV keywords, reports) | versioned, agent‑friendly, reviewable |
| Site write access | **Framer Server API** (`framer-api` npm, official) via `scripts/framer` | headless, scriptable, covers CMS + locales + redirects + custom code + publish; Framer MCP plugin is flaky and needs the Designer open |
| Keyword/rank/backlink data | **Semrush MCP** (already connected): `keyword_research`, `position_tracking`, `backlinks_research`, `organic_research`, `site_audit` | no API plan needed (Semrush API = Business tier); MCP works from Claude Code |
| Search performance | **Google Search Console API** (service account) — via claude‑seo's `/seo google` or a small script | ground truth per locale folder |
| Audits | **claude-seo plugin** (AgriciDaniel) — `/seo audit, technical, hreflang, schema, content-brief, cluster, backlinks, plan` | 16k★, MIT, PSI/CrUX/GSC native, hreflang checker |
| Content ops board | **Airtable** (connected): Content Calendar + Outreach CRM bases | assistant works there; Claude reads/writes via MCP |
| Reporting delivery | `reports/*.html` → Google Drive (connected) + Gmail (connected) to client | zero manual steps |
| Scheduling | **Claude Code Routines** (cron triggers in this cloud environment) for Mon/Tue/Fri jobs | runs without a laptop open |
| Crawling | claude‑seo (Lighthouse/PSI) + Semrush Site Audit; optional Firecrawl | sandbox can't fetch meditron.ch directly — audits run through Semrush/PSI or on the owner's machine |
| Optional later | Searchable (AI visibility), Ahrefs Lite (if backlink index gaps), DataForSEO (bulk SERP) | month 4+ only if the report needs it |

## Setup script
`scripts/setup.sh` installs the claude‑seo plugin, `framer-api`, and the Node deps for `scripts/framer`.

## Secrets
`.env` (git‑ignored): `FRAMER_API_KEY`, `FRAMER_PROJECT_URL`, `GSC_SERVICE_ACCOUNT_JSON`, `CLIENT_REPORT_TO`. In the cloud environment set them as environment variables on the Claude Code environment, not in the repo.

## Framer Server API — capabilities we rely on (verified from `framer-api@0.1.30` types)
`getCollections/getCollection → getItems/addItems/removeItems/setFields` · `getLocales/createLocale/setLocalizationData/listLocalizationGroups` · `getRedirects/addRedirects/removeRedirects` · `createWebPage` · `getCustomCode/setCustomCode` · `getPublishInfo/publish/getDeploymentIssues` · `createBranch` (use a branch for bulk changes, then merge/publish).
Unknowns to confirm on day 1: rate limits, whether `publish()` is allowed on the plan, whether localisation values for CMS fields are settable per locale through `setLocalizationData` (docs indicate yes via localization groups).
