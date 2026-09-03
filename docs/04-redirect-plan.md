# Redirect plan — priority 1 (week 1)

## Why first
Meditron has 154 referring domains. The Framer relaunch dropped every old Joomla URL, so links now land on "Page Not Found | Framer" (404) and the authority is wasted. Restoring them is a script run, not a content project, and it lifts every page we build afterwards.

## What we know (Semrush Backlink Analytics, 2026‑09‑03)
| Legacy area | Example | Status now | External links |
|---|---|---|---|
| Root (`/`, http/https, www/non‑www) | | 308 → 200 ✔︎ | 119 domains — fine |
| `/ultrasound/…` (Joomla) | `/ultrasound/index.php/application/handheld` | 404 / on `legacy.` 429 | 1–2 domains each |
| `/ultrasound-imaging/…` | `/ultrasound-imaging/index.php/imaging-field/general-imaging`, catalogue PDF | 404, still in Google's index | — |
| `/medical-physics/index.php/…` | `…/phantoms/product/481-bf-1500` | 404 | 1 |
| `/quality-assurance/index.php/…` | `…/425-radeye-sprd…` | 404 | 1 domain, 4 links |
| `/++INDUSTRIAL++/…` | ~thousands of product/contact URLs | 200/308/404 mixed | 1 (fetal‑neonatal tester) |
| `/index.php/home-2/management` | | 404 | 1 |
| `legacy.meditron.ch` | whole old Joomla site, incl. error‑dump pages Google indexed | 200 / 429 | 1 |

Live Framer pages confirmed via Google: `/`, `/medical-imaging/`, `/medical-physics/`, `/jobs/*`, `/privacy-policy`. The ultrasound hub does **not** exist yet at `/ultrasound/` — so all ultrasound legacy URLs point at `/medical-imaging/` for now (the `to` column is re‑pointed with one edit when `/ultrasound/` and `/services/training/` go live in month 1–2).

## The map
`data/redirects.csv` — two blocks:
1. **Explicit rows** for every legacy URL with a known backlink (highest value, exact targets).
2. **Section catch‑alls** (`/ultrasound/*`, `/ultrasound-imaging/*`, `/medical-physics/index.php/*`, `/quality-assurance/*`, `/++INDUSTRIAL++/*`, `/index.php/*`) so the long tail of Joomla URLs never 404s again. Explicit rows must be ordered before the catch‑alls (Framer evaluates in order; `setRedirectOrder` exists in the API).

Rules: 301 to the closest live topic page, never blanket‑to‑homepage; `410` for the Joomla admin/cache path linked by spam (or leave it 404); no redirect chains (http→https→www is already handled by Framer).

## Gaps only you can close (≈20 min)
1. **GSC → Pages → "Not found (404)" export** and **Crawl stats**: gives the real list Google is still hitting. Drop the CSV in `data/gsc-404s.csv` and run `/redirect-audit`; it merges new rows.
2. **Legacy sitemap / crawl**: the sandbox is blocked from `meditron.ch`, `legacy.meditron.ch` and archive.org. On your laptop: `curl -s https://legacy.meditron.ch/sitemap.xml` (or a Screaming Frog crawl) → save as `data/legacy-urls.txt`. Same for the Wayback snapshot of the old nav.
3. **`legacy.meditron.ch`**: either 301 host‑wide to `www.meditron.ch` at the DNS/host level, or `noindex` it and block in robots. Google has indexed its Joomla error dumps.
4. **Semrush API units are at zero** — top up (or wait for the monthly reset) before the Friday `/redirect-audit` and Monday `/weekly-report` runs; both depend on the MCP.

## Run
```bash
cp .env.example .env            # add FRAMER_API_KEY + FRAMER_PROJECT_URL
cd scripts/framer && npm install
npm run info                    # day‑1 smoke test: prints existing redirects + confirms the RedirectAttributes field names
node redirects.mjs --dry-run    # shows what would be added
node redirects.mjs              # pushes; idempotent
node publish.mjs --dry-run && node publish.mjs
```
Day‑1 check inside `info.mjs` output: confirm the wildcard syntax Framer expects (`/ultrasound/*` vs `/ultrasound/:path*`) and adjust the catch‑all rows before pushing.

## Verify (after publish)
- From your laptop: `curl -sI https://www.meditron.ch/ultrasound/index.php/application/handheld | head -3` → `301` → `/medical-imaging/`.
- GSC → URL inspection on the 5 highest‑value legacy URLs.
- Next Monday's report: "404s with backlinks" count should be 0; referring domains should hold or rise.
