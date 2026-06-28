---
description: Run the test suite and fix failures, repeating until everything is green.
allowed-tools: Read, Grep, Glob, Edit, Bash(npm *)
---

Run `npm run verify`. Then:

1. If everything passes, report 🟢 and stop.
2. Otherwise, for each failure:
   - Read the failing test and the source it covers.
   - Make the minimal correct fix (fix the code, not the test — unless the test is wrong).
   - Re-run `npm run verify`.
3. Repeat until green. Do not stop on the first failure, and do not weaken a test
   just to make it pass. If a test encodes the wrong expectation, fix the test and
   say so.

Report what failed, what you changed, and the final `npm run verify` result.
