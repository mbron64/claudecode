---
description: Commit the working tree, push to the feature branch, and (only if asked) open a PR. Pre-computes git state inline so it runs in one shot.
allowed-tools: Bash(git status), Bash(git diff *), Bash(git log *), Bash(git add *), Bash(git commit *), Bash(git push *), Bash(git branch *)
---

## Context (pre-computed, no back-and-forth)

- Branch: !`git branch --show-current`
- Status: !`git status --short`
- Staged diff: !`git diff --cached --stat`
- Unstaged diff: !`git diff --stat`
- Recent commits: !`git log --oneline -5`

## Task

1. Stage everything: `git add -A`.
2. Write a clear, conventional commit message based on the diff above (a concise
   subject line + a short body listing what changed and why).
3. Commit, then push to the current feature branch with `git push -u origin HEAD`.
   Retry on transient network failures (2s, 4s, 8s, 16s backoff). Never push to `main`.
4. **Open a PR** against the default branch (this is the Boris inner loop — it ends
   in a PR). Use the GitHub MCP tools. Mirror `.github/pull_request_template.md` in
   the body and fill it from the diff. Title = the commit subject. Extra instructions: $ARGUMENTS

Report the commit hash, the pushed branch, and the PR URL.
