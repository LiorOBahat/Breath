import { useEffect, useRef, useState } from 'react';
import { positionAt, totalSeconds } from '../engine/plan';
import type { Phase } from '../engine/types';
import type { GeneralSettings } from '../settings/store';
import { playCue, requestWakeLock, vibrate } from '../audio';

interface Props { plan: Phase[]; settings: GeneralSettings; onExit: () => void }

export function Session({ plan, settings, onExit }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastIndex = useRef(-1);
  const total = totalSeconds(plan);
  const pos = positionAt(plan, elapsed);

  // Clock: accumulates real time, so pausing and tab throttling don't drift the plan.
  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      setElapsed((e) => e + (now - last) / 1000);
      last = now;
    }, 100);
    return () => clearInterval(id);
  }, [paused]);

  // Cue on each new phase.
  useEffect(() => {
    if (pos && pos.index !== lastIndex.current) {
      lastIndex.current = pos.index;
      playCue(settings.voice, pos.phase.cue);
      vibrate(settings.haptics);
    }
  }, [pos?.index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!settings.keepAwake) return;
    let lock: WakeLockSentinel | null = null;
    requestWakeLock().then((l) => (lock = l));
    return () => { lock?.release(); };
  }, [settings.keepAwake]);

  if (!pos) {
    return (
      <main className="session">
        <h1>סיימת 🌿</h1>
        <p>כל הכבוד. קח רגע להרגיש את הגוף.</p>
        <button className="primary" onClick={onExit}>חזרה</button>
      </main>
    );
  }

  // Circle grows on inhale, shrinks on exhale, holds size otherwise.
  const f = pos.into / pos.phase.seconds;
  const scale = pos.phase.kind === 'inhale' ? 0.5 + 0.5 * f
    : pos.phase.kind === 'exhale' ? 1 - 0.5 * f
    : pos.phase.kind === 'hold' ? 1 : 0.5;

  return (
    <main className="session">
      <div className="circle" style={{ transform: `scale(${scale})` }} />
      <div className="label">{pos.phase.label}</div>
      <div className="count">{Math.ceil(pos.remaining)}</div>
      <div className="meta">מחזור {pos.phase.cycle} · {Math.max(0, Math.ceil(total - elapsed))} שנ׳ נותרו</div>
      <div className="row">
        <button onClick={() => setPaused((p) => !p)}>{paused ? 'המשך' : 'השהה'}</button>
        <button onClick={onExit}>סיום</button>
      </div>
    </main>
  );
}
