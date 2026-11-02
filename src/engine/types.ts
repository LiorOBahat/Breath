export type PhaseKind = 'inhale' | 'hold' | 'exhale' | 'rest';

/** One timed step of a session. `cue` is the voice-line id played at its start. */
export interface Phase {
  kind: PhaseKind;
  seconds: number;
  cue?: string;
  /** Short label shown on screen (Hebrew). */
  label: string;
  /** Cycle/round number (1-based) this phase belongs to. */
  cycle?: number;
}

export interface Technique<S> {
  id: string;
  name: string;
  summary: string;
  defaults: S;
  buildPlan(settings: S): Phase[];
}
