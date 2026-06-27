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

## Repo etiquette

- Branch: develop on the assigned feature branch; never push to `main`.
- Commit with clear messages; commit/push only when asked.
- Don't add dependencies casually — prefer the standard library and what's here.

## Gotchas

- This is ESM + `verbatimModuleSyntax`: import types with `import type`.
- `noUncheckedIndexedAccess` is on — array/object index access can be `undefined`.
- Keep this file under ~150 lines. If a rule isn't earning its place, delete it.
