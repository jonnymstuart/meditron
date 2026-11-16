# Request: switch off the old website (legacy.meditron.ch)

**Who should do this:** whoever looks after Meditron's old website or the meditron.ch domain. That is usually your IT person or your web hosting company. If you are not sure, forward this email to the company that sends the invoice for the old website or the domain.

**What we need, in one sentence:**
Please set up a permanent (301) redirect so that every page on **legacy.meditron.ch** goes to **https://www.meditron.ch**, keeping the rest of the address.

**Why it matters:**
- **Old links count again.** A few other websites still link to pages on the old site. Today those links lead to an outdated site, so their value is lost. With the redirect, Google passes that value to the new website.
- **Visitors land in the right place.** Anyone with an old bookmark or old link currently sees the old website, with outdated products and information. After the redirect they land on the current page.
- **Google stops spending time on the old site.** Google keeps reading the old site's pages (Search Console lists about 24,000 pages it read but did not index, most likely the old site's), including old error pages it once indexed. After the redirect it focuses on the new site.
- **Cleaner Search Console reports.** The "not indexed" figure will fall over a few weeks, so real problems on the new site become visible.

**What it will not do:** it will not jump the new website up the rankings on its own. The old site does not appear in the 20 Google searches we track, so it is not competing with the new pages there. It is housekeeping that removes a drag; the ranking work happens on the new site.

**Steps for the technical person (pick one):**

Option A – on the old web server (the Joomla site, Apache):
1. Open the file called `.htaccess` in the main folder of the old website.
2. Paste these three lines at the very top and save:
```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^legacy\.meditron\.ch$ [NC]
RewriteRule ^(.*)$ https://www.meditron.ch/$1 [R=301,L]
```

Option B – at the domain company (DNS):
1. Log in where the meditron.ch domain is managed.
2. Find "legacy.meditron.ch" and create a "permanent redirect / 301 forwarding" to `https://www.meditron.ch`, with "keep path" (or "forward path") switched on.

**How to check it worked (anyone can do this):**
Open https://legacy.meditron.ch/ultrasound/ in a browser. It should jump to the new website and show the Samsung ultrasound page. If you still see the old website, it is not done yet.

**Time needed:** about 15 minutes. Nothing changes on the new website.
