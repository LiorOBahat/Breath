import type { Phase } from './types';

/** Playback speed: a plan "second" (one spoken count) lasts 1 / COUNT_TEMPO real seconds. */
export const COUNT_TEMPO = 1.1;

export function totalSeconds(plan: Phase[]): number {
  return plan.reduce((sum, p) => sum + p.seconds, 0);
}

export interface Position {
  index: number;
  phase: Phase;
  /** Seconds elapsed inside the current phase. */
  into: number;
  /** Seconds left in the current phase. */
  remaining: number;
}

/** Pure lookup: which phase is active `elapsed` seconds into the plan. Null when finished. */
export function positionAt(plan: Phase[], elapsed: number): Position | null {
  let start = 0;
  for (let index = 0; index < plan.length; index++) {
    const phase = plan[index];
    if (elapsed < start + phase.seconds) {
      const into = elapsed - start;
      return { index, phase, into, remaining: phase.seconds - into };
    }
    start += phase.seconds;
  }
  return null;
}
