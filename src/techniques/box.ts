import type { Phase, Technique } from '../engine/types';

export interface BoxSettings {
  cycles: number;
  /** Length of each of the four sides, in seconds. */
  side: number;
}

export const box: Technique<BoxSettings> = {
  id: 'box',
  name: 'נשימת קופסא',
  summary: 'נשימת קופסא היא טכניקה פשוטה של ארבעה שלבים שווים, המסייעת להרגעה, להפחתת מתח ולריכוז.',
  defaults: { cycles: 6, side: 4 },
  buildPlan({ cycles, side }) {
    const plan: Phase[] = [{ kind: 'rest', seconds: 6, cue: 'start', label: 'התכוננו' }];
    for (let c = 1; c <= cycles; c++) {
      plan.push(
        { kind: 'inhale', seconds: side, cue: 'inhale', label: 'שאיפה', cycle: c },
        { kind: 'hold', seconds: side, cue: 'hold', label: 'החזקה', cycle: c },
        { kind: 'exhale', seconds: side, cue: 'exhale', label: 'נשיפה', cycle: c },
        { kind: 'hold', seconds: side, cue: 'hold', label: 'החזקה', cycle: c },
      );
    }
    return plan;
  },
};
