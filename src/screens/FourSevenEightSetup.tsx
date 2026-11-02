import { useState } from 'react';
import { fourSevenEight } from '../techniques/fourSevenEight';
import { COUNT_TEMPO, totalSeconds } from '../engine/plan';
import type { Phase } from '../engine/types';

interface Props { onBack: () => void; onStart: (plan: Phase[]) => void }

export function FourSevenEightSetup({ onBack, onStart }: Props) {
  const [cycles, setCycles] = useState(fourSevenEight.defaults.cycles);
  const plan = fourSevenEight.buildPlan({ cycles });
  const mins = Math.ceil(totalSeconds(plan) / COUNT_TEMPO / 60);
  return (
    <main className="setup">
      <button className="link" onClick={onBack}>← חזרה</button>
      <div className="setup-head">
        <p>{fourSevenEight.summary}</p>
        <h1 className="bubble ready"><strong>{fourSevenEight.name}</strong></h1>
      </div>
      <label>
        מספר מחזורים: {cycles} (כ-{mins} דקות)
        <input type="range" min={1} max={12} value={cycles} onChange={(e) => setCycles(Number(e.target.value))} />
      </label>
      <button className="primary" onClick={() => onStart(plan)}>התחל</button>
    </main>
  );
}
