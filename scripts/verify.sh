#!/usr/bin/env bash
# The verification gate. Exit non-zero if anything is not green.
# Mirrors `npm run verify` but usable directly from hooks/CI.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== typecheck ==="
npm run typecheck

echo "=== lint ==="
npm run lint

echo "=== format check ==="
npm run format:check

echo "=== test ==="
npm test

echo "✅ all green"
