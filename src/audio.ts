import type { VoiceChoice } from './settings/store';

// Plays pre-recorded cues from public/voices/<pack>/<cue>.mp3.
// Missing files are skipped silently so the app works before recordings exist.
const cache = new Map<string, HTMLAudioElement>();

export function playCue(voice: VoiceChoice, cue: string | undefined) {
  if (voice === 'off' || !cue) return;
  const url = `${import.meta.env.BASE_URL}voices/${voice}/${cue}.mp3`;
  let audio = cache.get(url);
  if (!audio) {
    audio = new Audio(url);
    cache.set(url, audio);
  }
  audio.currentTime = 0;
  audio.play().catch(() => { /* file missing or blocked */ });
}

export function vibrate(on: boolean, ms = 40) {
  if (on && 'vibrate' in navigator) navigator.vibrate(ms);
}

export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  try {
    return (await navigator.wakeLock?.request('screen')) ?? null;
  } catch {
    return null;
  }
}
