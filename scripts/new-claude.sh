#!/usr/bin/env bash
# Spin up a parallel Claude Code workspace, Boris-style.
#
# Boris runs ~5 Claudes at once, each in its own checkout of the repo so they
# never step on each other. This creates an isolated git worktree + branch and
# installs deps so you can `cd` in and start a fresh session.
#
# Usage: scripts/new-claude.sh <branch-suffix>
#   e.g. scripts/new-claude.sh fix-validation  ->  ../claudecode-fix-validation
set -euo pipefail

cd "$(dirname "$0")/.."

suffix="${1:?usage: new-claude.sh <branch-suffix>}"
branch="claude/${suffix}"
dir="../$(basename "$PWD")-${suffix}"

if [ -d "$dir" ]; then
  echo "Worktree already exists: $dir"
else
  git worktree add -b "$branch" "$dir"
  echo "Created worktree $dir on branch $branch"
fi

( cd "$dir" && [ -f package.json ] && (npm ci || npm install) >/dev/null 2>&1 || true )

echo
echo "Ready. Start a parallel session with:"
echo "  cd $dir && claude"
