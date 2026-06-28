# claudecode

A repo wired for an **autonomous Claude Code workflow**: plan → implement in auto
mode → run the full test suite until green → lint/format → leave a digest.
Treat this file as a production prompt — keep it short, explicit, and current.

## Stack & commands

TypeScript (ESM, strict) · Vitest · ESLint (flat config) · Prettier.

| Task           | Command              |
| -------------- | -------------------- |
| Install        | `npm install`        |
| Test (once)    | `npm test`           |
| Test (watch)   | `npm run test:watch` |
| Typecheck      | `npm run typecheck`  |
| Lint           | `npm run lint`       |
| Lint + autofix | `npm run lint:fix`   |
| Format         | `npm run format`     |
| **Full gate**  | `npm run verify`     |

`npm run verify` runs typecheck → lint → format check → tests. It is the single
source of truth for "is this green?". The autonomous loop must end on a clean
`npm run verify`.

## The autonomous loop (how to work here)

1. **Plan first.** For anything non-trivial, use plan mode or `/plan`. State the
   files you'll touch and the tests you'll add before editing.
2. **Implement in auto mode.** Don't ask for confirmation on routine edits.
3. **Verify after every change.** Run `npm run verify`. If anything fails, fix it
   and re-run — do not stop on the first failure. Keep going until green.
4. **Format last.** `npm run format` (or `lint:fix`) and resolve what it surfaces.
5. **Digest, don't disappear.** End with a digest (see below). Stage the work.
   Do not open a PR or push unless explicitly asked.

## Research lane

Not every task is code. When the task is "understand X", "compare Y", or "find
out Z," research is first-class:

- Use `/research` for a scoped investigation, or the `deep-research` skill for a
  multi-source, fact-checked report.
- Read before you plan; plan before you edit.
- Verify claims against a second source — don't answer LLM/API questions from
  memory.
- End research tasks with a digest too: findings, sources, and the decision or
  recommendation.

## Code style

- ES modules only (`import`/`export`), no `require`.
- `.js` extensions on relative imports (NodeNext/Bundler ESM resolution).
- 2-space indent, single quotes, trailing commas, 100-col width (Prettier owns this).
- Prefer small pure functions; validate inputs and throw on bad state.
- Co-locate tests as `src/<name>.test.ts`. Cover both happy path and error branches.

## Digest discipline

Every run ends with a digest at the **top** of your final message:

- **Status:** 🟢 green / 🔴 failing / 🟡 blocked
- **Task:** one line.
- **Changed:** files touched, one line each.
- **Verification:** what you ran and the result (e.g. `npm run verify` → 12 passed).
- **Decisions needed:** anything that needs a human call. Omit if none.

The `buildDigest()` helper in `src/digest.ts` is the canonical shape for this.

## Working like Boris (the source this repo copies)

From howborisusesclaudecode.com — keep it **vanilla**; the defaults are good.

- **Verification is rule #1:** "Give Claude a way to verify its work — it 2–3×'s
  the quality." That's why `npm run verify` anchors the whole loop.
- **Plan first, then let it run:** iterate in plan mode until the plan is solid,
  then switch to auto-accept and let it execute in one go.
- **Opus + thinking** for every task — steering it less beats a faster small model.
- **Permissions:** Boris's own setup avoids bypass (allowlist + auto-accept). This
  repo deliberately deviates: `.claude/settings.json` ships `defaultMode:
bypassPermissions` so every session — including phone/web — is fully hands-off
  without a per-machine local file. Tradeoff: anyone who opens this repo runs with
  guardrails off, so keep it private. A pre-approved allowlist is also present as a
  fallback if you dial the mode back to `acceptEdits`.
- **Slash commands for inner-loop work** (`.claude/commands/`); use inline `!bash`
  to pre-compute context (see `/commit-push-pr`) so commands run in one shot.
- **Subagents** (`.claude/agents/`) automate the recurring bits: `code-reviewer`
  for a second opinion, `code-simplifier` after green.
- **Multi-claude:** sessions are cheap and parallel. Keep CLAUDE.md the shared
  source of truth — when Claude gets something wrong, add a line here so it doesn't recur.

## Repo etiquette

- Branch: develop on the assigned feature branch; never push to `main`.
- Commit with clear messages; commit/push only when asked (or via `/commit-push-pr`).
- Don't add dependencies casually — prefer the standard library and what's here.

## Gotchas

- This is ESM + `verbatimModuleSyntax`: import types with `import type`.
- `noUncheckedIndexedAccess` is on — array/object index access can be `undefined`.
- Keep this file under ~150 lines. If a rule isn't earning its place, delete it.
