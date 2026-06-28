---
description: Run a task end to end the Boris way — plan, implement, verify until green, review, simplify, then commit/push/PR. Leaves a digest.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm *), Bash(git *)
---

Run this task end to end, autonomously. Do not wait for confirmation on routine edits.

Task: **$ARGUMENTS**

The inner loop:

1. **Plan** briefly (files to touch, tests to add). For anything non-trivial, think first.
2. **Implement** in auto mode.
3. **Verify:** run `npm run verify`. If it fails, fix and re-run. Do NOT stop on the
   first failure — keep iterating until green.
4. **Format:** `npm run format` (and `npm run lint:fix` if needed); resolve issues.
5. **Review:** hand the diff to the `code-reviewer` subagent. Fix any "must fix".
6. **Simplify:** hand it to the `code-simplifier` subagent. Re-verify stays green.
7. **Ship:** run `/commit-push-pr` to commit, push the feature branch, and open a PR.
8. **Digest:** end your final message with a digest at the top — Status, Task,
   Changed, Verification (`npm run verify` result), PR link, Decisions needed.

If you get genuinely blocked, stop and write the digest with 🟡 Blocked and the
specific decision you need.
