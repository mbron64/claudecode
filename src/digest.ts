/**
 * Build the end-of-run "digest" that the autonomous workflow leaves behind.
 *
 * This is intentionally a small, well-branched module so the
 * test -> lint -> format loop has something real to exercise.
 */

export type StepStatus = 'passed' | 'failed' | 'skipped';

export interface RunStep {
  /** Human label, e.g. "typecheck", "test", "lint". */
  name: string;
  status: StepStatus;
  /** Optional one-line detail, e.g. "142 passed, 0 failed". */
  details?: string;
}

export interface DigestInput {
  /** The task that was run, end to end. */
  task: string;
  /** What changed: file paths or short descriptions. */
  changes: string[];
  /** Verification steps that were run and their outcomes. */
  steps: RunStep[];
  /** Open decisions the human needs to make. Empty means "none". */
  decisions?: string[];
}

/** Overall run status, derived from the individual steps. */
export type OverallStatus = 'green' | 'red' | 'blocked';

const STATUS_ICON: Record<StepStatus, string> = {
  passed: '✅',
  failed: '❌',
  skipped: '⏭️',
};

/**
 * Derive the headline status:
 *  - "red"     if any step failed
 *  - "blocked" if there are open decisions (and nothing failed)
 *  - "green"   otherwise
 */
export function deriveStatus(input: DigestInput): OverallStatus {
  if (input.steps.some((s) => s.status === 'failed')) {
    return 'red';
  }
  if ((input.decisions?.length ?? 0) > 0) {
    return 'blocked';
  }
  return 'green';
}

function assertValid(input: DigestInput): void {
  if (input.task.trim() === '') {
    throw new Error('digest: `task` must not be empty');
  }
  if (input.changes.length === 0) {
    throw new Error('digest: `changes` must list at least one change');
  }
  if (input.steps.length === 0) {
    throw new Error('digest: `steps` must list at least one verification step');
  }
}

/**
 * Render a Markdown digest suitable for pasting at the top of a summary.
 * Throws if the input is incomplete — a digest with no task, no changes,
 * or no verification steps is not a digest worth leaving.
 */
export function buildDigest(input: DigestInput): string {
  assertValid(input);

  const status = deriveStatus(input);
  const headline: Record<OverallStatus, string> = {
    green: '🟢 Done — all checks green',
    red: '🔴 Failing — verification did not pass',
    blocked: '🟡 Blocked — needs your decision',
  };

  const lines: string[] = [];
  lines.push(`## Digest: ${headline[status]}`);
  lines.push('');
  lines.push(`**Task:** ${input.task.trim()}`);
  lines.push('');

  lines.push('**Changed:**');
  for (const change of input.changes) {
    lines.push(`- ${change}`);
  }
  lines.push('');

  lines.push('**Verification:**');
  for (const step of input.steps) {
    const detail = step.details ? ` — ${step.details}` : '';
    lines.push(`- ${STATUS_ICON[step.status]} ${step.name}${detail}`);
  }

  const decisions = input.decisions ?? [];
  if (decisions.length > 0) {
    lines.push('');
    lines.push('**Decisions needed:**');
    for (const decision of decisions) {
      lines.push(`- ${decision}`);
    }
  }

  return lines.join('\n');
}
