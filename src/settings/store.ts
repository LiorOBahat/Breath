import { useEffect, useState } from 'react';

export const VOICES = [
  { id: 'sarah', label: 'שרה (אישה)' },
  { id: 'lily', label: 'לילי (אישה)' },
  { id: 'brian', label: 'בריאן (גבר)' },
  { id: 'george', label: 'ג׳ורג׳ (גבר)' },
] as const;

export type VoiceChoice = (typeof VOICES)[number]['id'] | 'off';

export interface GeneralSettings {
  voice: VoiceChoice;
  encouragement: boolean;
  counting: boolean;
  haptics: boolean;
  keepAwake: boolean;
}

const KEY = 'breath.settings.v1';
const defaults: GeneralSettings = { voice: 'sarah', encouragement: true, counting: true, haptics: true, keepAwake: true };

function load(): GeneralSettings {
  try {
    const saved = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
    // Settings saved before the ElevenLabs packs used 'woman' / 'man'.
    const legacy: Record<string, VoiceChoice> = { woman: 'sarah', man: 'brian' };
    saved.voice = legacy[saved.voice] ?? saved.voice;
    if (saved.voice !== 'off' && !VOICES.some((v) => v.id === saved.voice)) saved.voice = defaults.voice;
    return saved;
  } catch {
    return defaults;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<GeneralSettings>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* storage unavailable */ }
  }, [settings]);
  return [settings, setSettings] as const;
}
