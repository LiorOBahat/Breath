import type { VoiceChoice } from './settings/store';
import voiceLines from '../scripts/voice_lines.json';

// Plays pre-recorded cues from public/voices/<pack>/<cue>.mp3.
// Missing files are skipped silently so the app works before recordings exist.
const cache = new Map<string, HTMLAudioElement>();

function cueAudio(voice: string, cue: string): HTMLAudioElement {
  const url = `${import.meta.env.BASE_URL}voices/${voice}/${cue}.mp3`;
  let audio = cache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = 'auto';
    cache.set(url, audio);
  }
  return audio;
}

/** Loads every cue of a voice up front so a cue never starts late because its file was still loading. */
export function preloadVoice(voice: VoiceChoice) {
  if (voice === 'off') return;
  for (const cue of Object.keys(voiceLines)) cueAudio(voice, cue).load();
}

export function playCue(voice: VoiceChoice, cue: string | undefined) {
  if (voice === 'off' || !cue) return;
  const audio = cueAudio(voice, cue);
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
