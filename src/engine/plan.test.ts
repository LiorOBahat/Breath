import { describe, expect, it } from 'vitest';
import { positionAt, totalSeconds } from './plan';
import { fourSevenEight } from '../techniques/fourSevenEight';

describe('4-7-8 plan', () => {
  const plan = fourSevenEight.buildPlan({ cycles: 2 });

  it('has inhale 4, hold 7, exhale 8 per cycle', () => {
    expect(plan.map((p) => [p.kind, p.seconds])).toEqual([
      ['rest', 6],
      ['inhale', 4], ['hold', 7], ['exhale', 8],
      ['inhale', 4], ['hold', 7], ['exhale', 8],
    ]);
    expect(totalSeconds(plan)).toBe(44);
  });

  it('finds the active phase', () => {
    expect(positionAt(plan, 0)?.phase.kind).toBe('rest');
    expect(positionAt(plan, 6)?.phase.kind).toBe('inhale');
    expect(positionAt(plan, 10)?.phase.kind).toBe('hold');
    expect(positionAt(plan, 17)?.phase.kind).toBe('exhale');
    expect(positionAt(plan, 25)?.phase.cycle).toBe(2);
    expect(positionAt(plan, 18.5)?.remaining).toBeCloseTo(6.5);
  });

  it('returns null once finished', () => {
    expect(positionAt(plan, 44)).toBeNull();
  });
});
