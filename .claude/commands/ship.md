---
description: Run a task end to end — plan, implement in auto mode, verify until green, format, and leave a digest. No PR/push.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm *), Bash(git status), Bash(git diff *), Bash(git add *)
---

Run this task end to end, autonomously. Do not wait for confirmation on routine edits.

Task: **$ARGUMENTS**

Loop:

1. **Plan** briefly (files to touch, tests to add). For anything non-trivial, think first.
2. **Implement** the change in auto mode.
3. **Verify:** run `npm run verify`. If it fails, fix and re-run. Do NOT stop on the
   first failure — keep iterating until it is green.
4. **Format:** run `npm run format` (and `npm run lint:fix` if needed); resolve issues.
5. **Stage:** `git add` the work. Do NOT open a PR or push.
6. **Digest:** end your final message with a digest at the top — Status, Task,
   Changed, Verification (the `npm run verify` result), Decisions needed.

If you get genuinely blocked, stop and write the digest with 🟡 Blocked and the
specific decision you need.
