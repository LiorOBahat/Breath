import { useState } from 'react';
import { box } from '../techniques/box';
import { COUNT_TEMPO, totalSeconds } from '../engine/plan';
import type { Phase } from '../engine/types';

interface Props { onBack: () => void; onStart: (plan: Phase[]) => void }

export function BoxSetup({ onBack, onStart }: Props) {
  const [cycles, setCycles] = useState(box.defaults.cycles);
  const [side, setSide] = useState(box.defaults.side);
  const plan = box.buildPlan({ cycles, side });
  const mins = Math.max(1, Math.round(totalSeconds(plan) / COUNT_TEMPO / 60));
  return (
    <main className="setup">
      <button className="link" onClick={onBack}>← חזרה</button>
      <div className="setup-head">
        <h1 className="bubble ready"><strong>{box.name}</strong></h1>
        <div className="setup-text">
          <p>{box.summary}</p>
          <p>כל מחזור נמשך {side * 4} שניות, בארבעה שלבים של {side} שניות:</p>
          <ol>
            <li>שואפים לאט דרך האף.</li>
            <li>מחזיקים את הנשימה, כשהריאות מלאות.</li>
            <li>נושפים לאט דרך האף או הפה.</li>
            <li>מחזיקים, כשהריאות ריקות, לפני שנושמים שוב.</li>
          </ol>
        </div>
      </div>
      <label>
        אורך כל שלב: {side} שניות
        <input type="range" min={3} max={6} value={side} onChange={(e) => setSide(Number(e.target.value))} />
      </label>
      <label>
        מספר מחזורים: {cycles} (כ-{mins} דקות)
        <input type="range" min={1} max={15} value={cycles} onChange={(e) => setCycles(Number(e.target.value))} />
      </label>
      <button className="primary" onClick={() => onStart(plan)}>התחל</button>
    </main>
  );
}
