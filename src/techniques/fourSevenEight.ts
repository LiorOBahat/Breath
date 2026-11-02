import type { Phase, Technique } from '../engine/types';

export interface FourSevenEightSettings {
  cycles: number;
}

export const fourSevenEight: Technique<FourSevenEightSettings> = {
  id: '478',
  name: '4-7-8',
  summary: 'שאיפה 4, החזקה 7, נשיפה 8 – להרגעה ולהירדמות',
  defaults: { cycles: 4 },
  buildPlan({ cycles }) {
    const plan: Phase[] = [{ kind: 'rest', seconds: 6, cue: 'start', label: 'התכוננו' }];
    for (let c = 1; c <= cycles; c++) {
      plan.push(
        { kind: 'inhale' as const, seconds: 4, cue: 'inhale', label: 'שאיפה', cycle: c },
        { kind: 'hold' as const, seconds: 7, cue: 'hold', label: 'החזקה', cycle: c },
        { kind: 'exhale' as const, seconds: 8, cue: 'exhale', label: 'נשיפה', cycle: c },
      );
    }
    return plan;
  },
};
