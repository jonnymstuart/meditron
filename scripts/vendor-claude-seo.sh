#!/usr/bin/env bash
# Vendor claude-seo (AgriciDaniel, MIT) into .claude/ the same way as the 3 Sep install:
# skills -> .claude/skills/, agents -> .claude/agents/, scripts/schema/data/hooks -> .claude/skills/seo/,
# the launcher -> .claude/skills/seo/bin/claude-seo, ${CLAUDE_PLUGIN_ROOT} paths rewritten to repo paths.
# Extensions: dataforseo and banana only (the ones we use). Skipped: seo-shopify, seo-posthog (not our stack).
# Hooks are copied but not registered. Usage: scripts/vendor-claude-seo.sh <path to a claude-seo clone>
set -euo pipefail
SRC="${1:?path to claude-seo clone}"; DST=".claude"
SKIP="seo-shopify seo-posthog"
for d in "$SRC"/skills/*/; do n=$(basename "$d"); [[ " $SKIP " == *" $n "* ]] && continue
  mkdir -p "$DST/skills/$n"; cp -r "$d". "$DST/skills/$n/"; done
for e in dataforseo banana; do
  for d in "$SRC"/extensions/$e/skills/*/; do n=$(basename "$d"); mkdir -p "$DST/skills/$n"; cp -r "$d". "$DST/skills/$n/"; done
  cp "$SRC"/extensions/$e/agents/*.md "$DST/agents/" 2>/dev/null || true
done
for a in "$SRC"/agents/*.md; do n=$(basename "$a" .md); [[ " $SKIP " == *" $n "* ]] && continue; cp "$a" "$DST/agents/"; done
mkdir -p "$DST/skills/seo/bin" "$DST/skills/seo/scripts" "$DST/skills/seo/schema" "$DST/skills/seo/data" "$DST/skills/seo/hooks"
cp -r "$SRC"/scripts/. "$DST/skills/seo/scripts/"; chmod +x "$DST/skills/seo/scripts/claude-seo"
# Since v2.6 the launcher expects runtime.py beside it, so bin/claude-seo only forwards to scripts/claude-seo.
printf '#!/usr/bin/env bash\nexec "$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../scripts/claude-seo" "$@"\n' > "$DST/skills/seo/bin/claude-seo"; chmod +x "$DST/skills/seo/bin/claude-seo"
cp -r "$SRC"/schema/. "$DST/skills/seo/schema/"; cp -r "$SRC"/data/. "$DST/skills/seo/data/"; cp -r "$SRC"/hooks/. "$DST/skills/seo/hooks/"
cp "$SRC/requirements.txt" "$DST/skills/seo/requirements.txt"; cp "$SRC/LICENSE" "$DST/skills/seo/LICENSE"
# Path rewrite in everything we copied that is text
grep -rlI 'CLAUDE_PLUGIN_ROOT' "$DST/skills" "$DST/agents" | while read -r f; do
  sed -i -e 's|"\${CLAUDE_PLUGIN_ROOT}/scripts/claude-seo"|.claude/skills/seo/bin/claude-seo|g' \
         -e 's|\${CLAUDE_PLUGIN_ROOT}/scripts/claude-seo|.claude/skills/seo/bin/claude-seo|g' \
         -e 's|\${CLAUDE_PLUGIN_ROOT}/skills/|.claude/skills/|g' \
         -e 's|\${CLAUDE_PLUGIN_ROOT}/schema/|.claude/skills/seo/schema/|g' \
         -e 's|\${CLAUDE_PLUGIN_ROOT}/data/|.claude/skills/seo/data/|g' "$f"; done
echo "vendored claude-seo $(git -C "$SRC" describe --tags 2>/dev/null || git -C "$SRC" log -1 --format=%h)"
