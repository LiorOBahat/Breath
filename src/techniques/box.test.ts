import { describe, expect, it } from 'vitest';
import { box } from './box';
import { totalSeconds } from '../engine/plan';

describe('box plan', () => {
  it('is inhale, hold, exhale, hold of equal length per cycle', () => {
    const plan = box.buildPlan({ cycles: 2, side: 4 });
    expect(plan.map((p) => [p.kind, p.seconds])).toEqual([
      ['rest', 6],
      ['inhale', 4], ['hold', 4], ['exhale', 4], ['hold', 4],
      ['inhale', 4], ['hold', 4], ['exhale', 4], ['hold', 4],
    ]);
    expect(totalSeconds(plan)).toBe(6 + 2 * 16);
  });

  it('respects the side length', () => {
    const plan = box.buildPlan({ cycles: 1, side: 5 });
    expect(totalSeconds(plan)).toBe(6 + 20);
  });
});
