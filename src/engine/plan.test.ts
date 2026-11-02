import { describe, expect, it } from 'vitest';
import { positionAt, totalSeconds } from './plan';
import { fourSevenEight } from '../techniques/fourSevenEight';

describe('4-7-8 plan', () => {
  const plan = fourSevenEight.buildPlan({ cycles: 2 });

  it('has inhale 4, hold 7, exhale 8 per cycle', () => {
    expect(plan.map((p) => [p.kind, p.seconds])).toEqual([
      ['inhale', 4], ['hold', 7], ['exhale', 8],
      ['inhale', 4], ['hold', 7], ['exhale', 8],
    ]);
    expect(totalSeconds(plan)).toBe(38);
  });

  it('finds the active phase', () => {
    expect(positionAt(plan, 0)?.phase.kind).toBe('inhale');
    expect(positionAt(plan, 4)?.phase.kind).toBe('hold');
    expect(positionAt(plan, 11)?.phase.kind).toBe('exhale');
    expect(positionAt(plan, 19)?.phase.cycle).toBe(2);
    expect(positionAt(plan, 12.5)?.remaining).toBeCloseTo(6.5);
  });

  it('returns null once finished', () => {
    expect(positionAt(plan, 38)).toBeNull();
  });
});
