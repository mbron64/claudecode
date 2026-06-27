#!/usr/bin/env bash
# SessionStart hook: make sure a fresh web/CI session can actually run the
# test + lint loop. Idempotent and safe to run on every session start.
set -uo pipefail

cd "$(dirname "$0")/../.." || exit 0

# Install deps only if they're missing, so warm sessions stay fast.
if [ ! -d node_modules ] || [ ! -e node_modules/.package-lock.json ]; then
  echo "[session-start] installing dependencies..."
  if [ -f package-lock.json ]; then
    npm ci || npm install
  else
    npm install
  fi
else
  echo "[session-start] dependencies present, skipping install."
fi

echo "[session-start] ready. Run 'npm run verify' for the full gate."
exit 0
