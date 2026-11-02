import { useEffect, useState } from 'react';

export type VoiceChoice = 'woman' | 'man' | 'off';

export interface GeneralSettings {
  voice: VoiceChoice;
  encouragement: boolean;
  haptics: boolean;
  keepAwake: boolean;
}

const KEY = 'breath.settings.v1';
const defaults: GeneralSettings = { voice: 'woman', encouragement: true, haptics: true, keepAwake: true };

function load(): GeneralSettings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
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
