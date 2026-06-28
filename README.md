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
`/commit-push-pr` commits + pushes the feature branch (pre-computes git state inline).

## What's in here

| Path                               | Purpose                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `CLAUDE.md`                        | The "production prompt": stack, loop, code style, digest rules                       |
| `.claude/settings.json`            | Permissions allowlist (`acceptEdits`) + SessionStart/format/notify hooks             |
| `.claude/hooks/session-start.sh`   | SessionStart hook — installs deps so web/CI sessions can run                         |
| `.claude/commands/*.md`            | Slash commands: `/plan` `/ship` `/test-loop` `/research` `/digest` `/commit-push-pr` |
| `.claude/agents/*.md`              | Subagents: `code-reviewer` (second opinion), `code-simplifier` (after green)         |
| `scripts/verify.sh`                | The verification gate, callable from hooks/CI                                        |
| `scripts/new-claude.sh`            | Spin up a parallel worktree + branch for multi-clauding (Boris's 5-checkouts)        |
| `scripts/notify.sh`                | Best-effort desktop notification, driven by the Notification hook                    |
| `.github/pull_request_template.md` | PR template the `/ship` loop fills in                                                |
| `src/digest.ts`                    | Sample module: builds the end-of-run digest (real branches → real tests)             |
| `src/digest.test.ts`               | Vitest suite covering happy paths and every error branch                             |

## Toolchain

TypeScript (ESM, strict) · Vitest · ESLint (flat config) · Prettier · Node ≥ 20.

| Command             | Does                       |
| ------------------- | -------------------------- |
| `npm test`          | Run the test suite once    |
| `npm run typecheck` | `tsc --noEmit`             |
| `npm run lint`      | ESLint                     |
| `npm run format`    | Prettier write             |
| `npm run verify`    | All of the above, in order |

## Driving it autonomously (the Boris way)

Boris's hands-off-ness comes from an **allowlist + auto-accept**, _not_ from
disabling guardrails — he explicitly avoids `--dangerously-skip-permissions`.
This repo's `.claude/settings.json` pre-approves the safe inner-loop commands and
defaults to `acceptEdits`, so the loop runs without prompts on the things it needs.

- Interactive: start in **plan mode** (Shift+Tab twice), iterate on the plan, then
  Shift+Tab to **auto-accept** and let it run.
- Headless:

  ```bash
  claude -p "/ship Add input validation to <module> and cover the new branches" \
    --permission-mode acceptEdits
  ```

- Add more pre-approved commands with `/permissions` as you hit them.

### Multi-clauding (parallel sessions)

Boris runs ~5 Claudes at once, each in its own checkout so they don't collide,
plus 5–10 web sessions — ~20–30 PRs/day. Spin up an isolated worktree per task:

```bash
scripts/new-claude.sh fix-validation   # -> ../claudecode-fix-validation on claude/fix-validation
cd ../claudecode-fix-validation && claude
```

The Notification hook pings you (best-effort desktop notification) when any
session needs input. `/ship` runs the whole loop to a PR; fan out and let them run.

Personal, machine-local notes go in `CLAUDE.local.md` (gitignored).

> Source: [howborisusesclaudecode.com](https://howborisusesclaudecode.com/) — and the
> guiding rule, _"give Claude a way to verify its work and it 2–3×'s the quality."_
