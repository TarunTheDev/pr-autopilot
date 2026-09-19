import { describe, it, expect } from 'vitest';
import { VerdictSchema, RequirementSchema } from '../../services/aiSchema';

describe('RequirementSchema', () => {
  it('accepts a well-formed requirement', () => {
    const ok = RequirementSchema.safeParse({
      id: 1,
      text: 'User can log in',
      verdict: 'Pass',
      confidence: 90,
      evidence: 'src/auth.ts:23',
      test: 'test("logs in", () => {})',
    });
    expect(ok.success).toBe(true);
  });

  it('rejects invalid verdict values', () => {
    const bad = RequirementSchema.safeParse({
      id: 1,
      text: 'criterion',
      verdict: 'Maybe',
      confidence: 50,
      evidence: '...',
      test: '...',
    });
    expect(bad.success).toBe(false);
  });

  it('rejects out-of-range confidence', () => {
    const low = RequirementSchema.safeParse({
      id: 1, text: 'c', verdict: 'Pass', confidence: -1, evidence: '', test: '',
    });
    const high = RequirementSchema.safeParse({
      id: 1, text: 'c', verdict: 'Pass', confidence: 101, evidence: '', test: '',
    });
    expect(low.success).toBe(false);
    expect(high.success).toBe(false);
  });

  it('requires a positive integer id', () => {
    const zero = RequirementSchema.safeParse({
      id: 0, text: 'c', verdict: 'Pass', confidence: 50, evidence: '', test: '',
    });
    const neg = RequirementSchema.safeParse({
      id: -1, text: 'c', verdict: 'Pass', confidence: 50, evidence: '', test: '',
    });
    const float = RequirementSchema.safeParse({
      id: 1.5, text: 'c', verdict: 'Pass', confidence: 50, evidence: '', test: '',
    });
    expect(zero.success).toBe(false);
    expect(neg.success).toBe(false);
    expect(float.success).toBe(false);
  });
});

describe('VerdictSchema', () => {
  it('accepts a complete verdict with at least one requirement', () => {
    const ok = VerdictSchema.safeParse({
      overall_verdict: 'Pass',
      confidence: 92,
      summary: 'All good',
      requirements: [
        { id: 1, text: 'c1', verdict: 'Pass', confidence: 92, evidence: '', test: '' },
      ],
    });
    expect(ok.success).toBe(true);
  });

  it('rejects verdicts with no requirements', () => {
    const empty = VerdictSchema.safeParse({
      overall_verdict: 'Pass',
      confidence: 50,
      summary: 'none',
      requirements: [],
    });
    expect(empty.success).toBe(false);
  });

  it('rejects unknown overall_verdict values', () => {
    const bad = VerdictSchema.safeParse({
      overall_verdict: 'Pending',
      confidence: 50,
      summary: '',
      requirements: [
        { id: 1, text: 'c', verdict: 'Pass', confidence: 50, evidence: '', test: '' },
      ],
    });
    expect(bad.success).toBe(false);
  });
});
