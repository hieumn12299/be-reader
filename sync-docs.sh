#!/bin/bash
# Sync docs từ be-reader/.document → push submodule → sync fe-reader
# Usage: ./sync-docs.sh
#        ./sync-docs.sh "docs: add API reference"

MSG="${1:-docs: update}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
FE="$(dirname "$ROOT")/fe-reader"

ok()   { echo -e "  \033[32m✅ $1\033[0m"; }
step() { echo -e "  \033[33m→ $1\033[0m"; }
fail() { echo -e "  \033[31m❌ $1\033[0m"; exit 1; }

echo -e "\n\033[36m📚 Sync docs từ be-reader\033[0m"

# 1. Commit & push submodule
step "Commit & push .document submodule..."
cd "$ROOT/.document"
git add -A
if [ -n "$(git status --porcelain)" ]; then
  git commit -m "$MSG"
  git pull --rebase || fail "Pull rebase thất bại"
  git push || fail "Push thất bại"
  ok "Submodule pushed"
else
  ok "Không có thay đổi"
  exit 0
fi

# 2. Update ref trong be-reader
step "Update submodule ref trong be-reader..."
cd "$ROOT"
git add .document
git commit -m "chore: update docs submodule"
ok "be-reader ref updated"

# 3. Sync fe-reader
step "Sync fe-reader/.document..."
cd "$FE"
git submodule update --remote --force .document || fail "Submodule update thất bại"
if [ -n "$(git status --porcelain .document)" ]; then
  git add .document
  git commit -m "chore: update docs submodule"
  ok "fe-reader synced"
else
  ok "fe-reader đã up-to-date"
fi

echo -e "\n\033[32m🎉 Done!\033[0m\n"
