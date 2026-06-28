import { describe, expect, it } from 'vitest';
import { buildDigest, deriveStatus, type DigestInput } from './digest.js';

const base: DigestInput = {
  task: 'Set up the autonomous workflow',
  changes: ['package.json', 'CLAUDE.md'],
  steps: [
    { name: 'typecheck', status: 'passed' },
    { name: 'test', status: 'passed', details: '12 passed' },
  ],
};

describe('deriveStatus', () => {
  it('is green when every step passed and no decisions are open', () => {
    expect(deriveStatus(base)).toBe('green');
  });

  it('is red when any step failed, even with open decisions', () => {
    const input: DigestInput = {
      ...base,
      steps: [{ name: 'test', status: 'failed' }],
      decisions: ['which db?'],
    };
    expect(deriveStatus(input)).toBe('red');
  });

  it('is blocked when nothing failed but decisions are open', () => {
    expect(deriveStatus({ ...base, decisions: ['pick a stack'] })).toBe('blocked');
  });

  it('treats skipped steps as non-failing', () => {
    const input: DigestInput = {
      ...base,
      steps: [{ name: 'lint', status: 'skipped' }],
    };
    expect(deriveStatus(input)).toBe('green');
  });
});

describe('buildDigest', () => {
  it('renders task, changes, and verification with status icons', () => {
    const out = buildDigest(base);
    expect(out).toContain('## Digest: 🟢 Done — all checks green');
    expect(out).toContain('**Task:** Set up the autonomous workflow');
    expect(out).toContain('- package.json');
    expect(out).toContain('- ✅ test — 12 passed');
  });

  it('omits the decisions section when there are none', () => {
    expect(buildDigest(base)).not.toContain('Decisions needed');
  });

  it('includes the decisions section when present', () => {
    const out = buildDigest({ ...base, decisions: ['pick a stack'] });
    expect(out).toContain('**Decisions needed:**');
    expect(out).toContain('- pick a stack');
    expect(out).toContain('🟡 Blocked');
  });

  it('shows the red headline when a step failed', () => {
    const out = buildDigest({ ...base, steps: [{ name: 'test', status: 'failed' }] });
    expect(out).toContain('🔴 Failing');
    expect(out).toContain('- ❌ test');
  });

  it('throws when the task is empty', () => {
    expect(() => buildDigest({ ...base, task: '   ' })).toThrow(/task/);
  });

  it('throws when there are no changes', () => {
    expect(() => buildDigest({ ...base, changes: [] })).toThrow(/changes/);
  });

  it('throws when there are no verification steps', () => {
    expect(() => buildDigest({ ...base, steps: [] })).toThrow(/steps/);
  });
});
