#!/usr/bin/env bash
# Vendor coreyhaines31/marketingskills (MIT) into .claude/skills/. Its seo-audit clashes with claude-seo's
# seo-audit, so it goes to marketing-seo-audit (name rewritten). Keeps our .agents/product-marketing.md.
# Usage: scripts/vendor-marketingskills.sh <path to a marketingskills clone>
set -euo pipefail
SRC="${1:?path to marketingskills clone}"; DST=".claude/skills"
for d in "$SRC"/skills/*/; do n=$(basename "$d"); t="$n"; [[ "$n" == "seo-audit" ]] && t="marketing-seo-audit"
  rm -rf "$DST/$t"; mkdir -p "$DST/$t"; cp -r "$d". "$DST/$t/"
  [[ "$t" != "$n" ]] && sed -i "0,/^name: $n\$/s//name: $t/" "$DST/$t/SKILL.md"
done
echo "vendored marketingskills $(git -C "$SRC" describe --tags 2>/dev/null || git -C "$SRC" log -1 --format=%h)"
