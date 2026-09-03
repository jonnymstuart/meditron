#!/usr/bin/env bash
# One-time environment setup for the Meditron AISEO repo.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Node deps for Framer scripts"
(cd scripts/framer && npm install --no-audit --no-fund)

echo "→ claude-seo (vendored in .claude/skills/seo*, v2.2.5 MIT) — Python deps"
python3 -m pip install -q -r .claude/skills/seo/requirements.txt || echo "  pip install failed; rerun manually: pip install -r .claude/skills/seo/requirements.txt"
echo "  then in any Claude Code session here: /seo setup   (GSC service account + PageSpeed key)"
echo "  update later: re-run this copy from https://github.com/AgriciDaniel/claude-seo (see docs/02-tech-stack.md)"

echo "→ .env"
[ -f .env ] || cp .env.example .env && echo "fill in .env (FRAMER_API_KEY, FRAMER_PROJECT_URL, GSC_*)"

echo "→ smoke test (needs .env)"
echo "  (cd scripts/framer && npm run info)"
