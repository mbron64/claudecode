# claudecode

A repository wired for an **autonomous Claude Code workflow** — the
plan → implement → test-until-green → lint → digest loop, with research as a
first-class lane. Drop your own code in `src/`; the workflow scaffolding carries over.

## Quick start

```bash
npm install        # or let the SessionStart hook do it
npm run verify     # typecheck + lint + format check + tests  (the "is it green?" gate)
```

## The loop

1. **Plan** — `/plan <task>` (or plan mode): explore, list files + tests, no edits yet.
2. **Implement** — auto-accept mode (`acceptEdits`); no confirmation on routine edits.
3. **Verify** — `npm run verify`; fix and re-run until green. Never stop on first failure.
4. **Format** — `npm run format` / `npm run lint:fix`.
5. **Digest** — end with a status digest; stage the work (no PR/push unless asked).

`/ship <task>` runs that whole loop end to end. `/test-loop` does step 3 in isolation.
`/research <question>` runs the research lane. `/digest` writes the closing summary.

## What's in here

| Path                              | Purpose                                                                  |
| --------------------------------- | ------------------------------------------------------------------------ |
| `CLAUDE.md`                       | The "production prompt": stack, loop, code style, digest rules           |
| `.claude/settings.json`           | Permissions allowlist (`acceptEdits`) + hooks                            |
| `.claude/hooks/session-start.sh`  | SessionStart hook — installs deps so web/CI sessions can run             |
| `.claude/commands/*.md`           | Slash commands: `/plan` `/ship` `/test-loop` `/research` `/digest`       |
| `.claude/agents/code-reviewer.md` | Independent reviewer subagent for a second opinion                       |
| `scripts/verify.sh`               | The verification gate, callable from hooks/CI                            |
| `src/digest.ts`                   | Sample module: builds the end-of-run digest (real branches → real tests) |
| `src/digest.test.ts`              | Vitest suite covering happy paths and every error branch                 |

## Toolchain

TypeScript (ESM, strict) · Vitest · ESLint (flat config) · Prettier · Node ≥ 20.

| Command             | Does                       |
| ------------------- | -------------------------- |
| `npm test`          | Run the test suite once    |
| `npm run typecheck` | `tsc --noEmit`             |
| `npm run lint`      | ESLint                     |
| `npm run format`    | Prettier write             |
| `npm run verify`    | All of the above, in order |

## Driving it autonomously (headless)

```bash
claude -p "/ship Add input validation to <module> and cover the new branches" \
  --permission-mode acceptEdits
```

Personal, machine-local notes go in `CLAUDE.local.md` (gitignored).
