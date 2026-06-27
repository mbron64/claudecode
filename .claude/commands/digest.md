---
description: Write the end-of-run digest summarizing what changed, what passed, and what needs a decision.
allowed-tools: Read, Bash(git status), Bash(git diff *)
---

Write a digest of this session's work. Put it at the top of your message, in the
shape produced by `buildDigest()` in `src/digest.ts`:

- **Status:** 🟢 green / 🔴 failing / 🟡 blocked (failing wins over blocked).
- **Task:** one line.
- **Changed:** each file touched, one line each (use `git status` / `git diff --stat`).
- **Verification:** what you ran and the result (e.g. `npm run verify` → 12 passed).
- **Decisions needed:** anything requiring a human call. Omit the section if none.

Be concise and accurate. Do not claim green unless `npm run verify` actually passed.
