# Brief: redirect the old website legacy.meditron.ch

**For:** whoever manages Meditron's old web hosting or the meditron.ch domain (DNS). Meditron IT or their hosting provider.

**What:** send every address on legacy.meditron.ch, http and https, permanently (301) to the same path on https://www.meditron.ch.
Example: legacy.meditron.ch/ultrasound/ → www.meditron.ch/ultrasound/. The new site already forwards each old path to the right new page.

**Why:** the old site is still online, and Google still crawls about 24,000 of its pages. This holds back the new site in search.

**How (one of these):**
1. On the old server (Apache), at the top of `.htaccess`:
   ```
   RewriteEngine On
   RewriteCond %{HTTP_HOST} ^legacy\.meditron\.ch$ [NC]
   RewriteRule ^(.*)$ https://www.meditron.ch/$1 [R=301,L]
   ```
2. Or at the domain/DNS provider: set a permanent (301) forwarding for legacy.meditron.ch to https://www.meditron.ch, keeping the path.

**Done when:** opening https://legacy.meditron.ch/ultrasound/ lands on the new Samsung ultrasound page on www.meditron.ch. About 15 minutes of work.
