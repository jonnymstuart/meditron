# Briefing: retiring the old website legacy.meditron.ch

**From:** Rise · **For:** Meditron SA · **Date:** 16 November 2026
**Rise contact for technical questions:** Gabe, who will coordinate directly with your IT team or hosting provider.

## Summary
Your old website is still online at legacy.meditron.ch. We ask that it be redirected permanently to the new website, www.meditron.ch. It is a small technical change on your side (about 15 minutes) and nothing changes on the new website.

## What we are asking for
A permanent redirect (HTTP 301) of every address on **legacy.meditron.ch**, http and https, to the same path on **https://www.meditron.ch**.

The new website already forwards each old page to its correct new page. For example, the old ultrasound section will land on the new Samsung ultrasound page.

## Why it matters
- **Old links count again.** Some other websites still link to pages on the old site. Today that value is lost; after the redirect Google passes it to the new website.
- **Visitors land in the right place.** People with old bookmarks or links currently see outdated products and information. After the redirect they see the current pages.
- **Google focuses on the new site.** Google still reads the old site's pages, including old error pages it once indexed. Search Console lists about 24,000 pages it has read but not indexed, most likely from the old site.
- **Cleaner reporting.** The "not indexed" figure in Search Console will fall over a few weeks, so any real issue on the new site is easier to see.

## What to expect
This is housekeeping: it removes a drag rather than lifting rankings on its own. The old site does not appear in the 20 Google searches we track. The ranking work continues on the new website.

## Who does what
| | |
|---|---|
| **Meditron** | Tell us who manages the old website or the meditron.ch domain (internal IT or hosting company), and introduce Gabe. |
| **Your IT / hosting provider** | Set up the redirect (instructions below). |
| **Rise (Gabe)** | Answers technical questions, checks the result, and confirms the old addresses land on the right new pages. |

## Technical instructions (for your IT or hosting provider)
Choose one:

**Option A – on the old web server (Joomla, Apache).** At the top of `.htaccess` in the site root:
```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^legacy\.meditron\.ch$ [NC]
RewriteRule ^(.*)$ https://www.meditron.ch/$1 [R=301,L]
```

**Option B – at the domain / DNS provider.** Create a permanent (301) forwarding for legacy.meditron.ch to `https://www.meditron.ch`, with "keep path" (or "forward path") enabled.

Either option must cover both http and https.

## How to check it worked
Open https://legacy.meditron.ch/ultrasound/ in a browser. It should land on the new Samsung ultrasound page at www.meditron.ch. If the old website still appears, the redirect is not active yet. Gabe will run a full check of the old addresses once your team confirms.
