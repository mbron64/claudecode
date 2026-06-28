---
description: Run a scoped, sourced investigation and return findings + a recommendation. No code changes.
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch, Bash(git log *)
---

Research mode — investigate, don't edit.

Question: **$ARGUMENTS**

1. Restate the question and scope. If it's underspecified, state the assumptions
   you're making rather than stalling.
2. Gather evidence — search the codebase and/or the web. For anything about LLMs,
   the Claude API, pricing, or models, verify against a current source; don't
   answer from memory. For a deep, multi-source report, use the `deep-research` skill.
3. Cross-check key claims against a second source.
4. Return a digest:
   - **Answer / recommendation** up top.
   - **Findings** as bullets, each with its source.
   - **Confidence** and what would change the answer.
   - **Open questions** if any.
