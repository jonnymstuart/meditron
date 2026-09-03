#!/usr/bin/env bash
# One-time environment setup for the Meditron AISEO repo.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Node deps for Framer scripts"
(cd scripts/framer && npm install --no-audit --no-fund)

echo "→ claude-seo plugin (audits, hreflang, schema, GSC)"
cat <<'MSG'
Run inside Claude Code:
  /plugin marketplace add AgriciDaniel/claude-seo
  /plugin install claude-seo@agricidaniel-claude-seo
  /seo setup          # point it at GSC service account + PSI key
Optional (schema/serp helpers):  npx openclaudia install schema-markup serp-analyzer
MSG

echo "→ .env"
[ -f .env ] || cp .env.example .env && echo "fill in .env (FRAMER_API_KEY, FRAMER_PROJECT_URL, GSC_*)"

echo "→ smoke test (needs .env)"
echo "  (cd scripts/framer && npm run info)"
