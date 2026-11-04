import { useEffect, useState } from 'react';
import { COUNT_TEMPO, positionAt, totalSeconds } from '../engine/plan';
import type { Phase } from '../engine/types';
import type { GeneralSettings } from '../settings/store';
import { playCue, preloadVoice, requestWakeLock, vibrate } from '../audio';

interface Props { plan: Phase[]; settings: GeneralSettings; onExit: () => void }

export function Session({ plan, settings, onExit }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = totalSeconds(plan);
  const pos = positionAt(plan, elapsed);

  // Clock: accumulates real time, so pausing and tab throttling don't drift the plan.
  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      setElapsed((e) => e + ((now - last) / 1000) * COUNT_TEMPO);
      last = now;
    }, 100);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => { preloadVoice(settings.voice); }, [settings.voice]);

  // Closing line when the plan finishes.
  useEffect(() => { if (!pos) playCue(settings.voice, 'done'); }, [!pos]); // eslint-disable-line react-hooks/exhaustive-deps

  // Voice: the phase word at its start, then the count (2, 3, ...) each second.
  const tick = pos ? `${pos.index}:${Math.floor(pos.into)}` : 'end';
  useEffect(() => {
    if (!pos) return;
    const sec = Math.floor(pos.into);
    if (sec === 0) {
      playCue(settings.voice, pos.phase.cue);
      vibrate(settings.haptics);
    } else if (settings.counting && pos.phase.kind !== 'rest') {
      playCue(settings.voice, `n${sec + 1}`);
    }
  }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Circle grows on inhale, shrinks on exhale; a hold keeps the size it had (full after inhale, empty after exhale).
  const f = pos.into / pos.phase.seconds;
  const scale = pos.phase.kind === 'inhale' ? 0.5 + 0.5 * f
    : pos.phase.kind === 'exhale' ? 1 - 0.5 * f
    : pos.phase.kind === 'hold' ? (plan[pos.index - 1]?.kind === 'exhale' ? 0.5 : 1) : 0.5;

  return (
    <main className="session">
      <div className="circle" style={{ transform: `scale(${scale})` }} />
      <div className="label">{pos.phase.label}</div>
      <div className="count">{Math.floor(pos.into) + 1}</div>
      <div className="meta">מחזור {pos.phase.cycle} · {Math.max(0, Math.ceil((total - elapsed) / COUNT_TEMPO))} שנ׳ נותרו</div>
      <div className="row">
        <button onClick={() => setPaused((p) => !p)}>{paused ? 'המשך' : 'השהה'}</button>
        <button onClick={onExit}>סיום</button>
      </div>
    </main>
  );
}
