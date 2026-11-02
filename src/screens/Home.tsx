import { useState } from 'react';
import { VOICES, type GeneralSettings } from '../settings/store';

export interface TechniqueCard { id: string; name: string; summary: string; ready: boolean }

interface Props {
  techniques: TechniqueCard[];
  settings: GeneralSettings;
  onChange: (s: GeneralSettings) => void;
  onSelect: (id: string) => void;
}

export function Home({ techniques, settings, onChange, onSelect }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const set = <K extends keyof GeneralSettings>(k: K, v: GeneralSettings[K]) => onChange({ ...settings, [k]: v });
  return (
    <main className="home">
      <h1 className="brand">Breath</h1>
      <nav className="bubbles" aria-label="טכניקות">
        {techniques.map((t) => (
          <button key={t.id} className={`bubble${t.ready ? ' ready' : ''}`} disabled={!t.ready} onClick={() => onSelect(t.id)}>
            <strong>{t.name}</strong>
            {!t.ready && <span>בקרוב</span>}
          </button>
        ))}
      </nav>
      <button className="settings-btn" onClick={() => setSettingsOpen(true)}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
        הגדרות
      </button>

      {settingsOpen && (
        <div className="sheet-backdrop" onClick={() => setSettingsOpen(false)}>
          <section className="sheet" role="dialog" aria-modal="true" aria-label="הגדרות כלליות" onClick={(e) => e.stopPropagation()}>
            <h2>הגדרות כלליות</h2>
            <label>
              קול מנחה
              <select value={settings.voice} onChange={(e) => set('voice', e.target.value as GeneralSettings['voice'])}>
                {VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                <option value="off">ללא קול</option>
              </select>
            </label>
            <label><input type="checkbox" checked={settings.counting} onChange={(e) => set('counting', e.target.checked)} /> ספירה בקול</label>
            <label><input type="checkbox" checked={settings.encouragement} onChange={(e) => set('encouragement', e.target.checked)} /> משפטי עידוד</label>
            <label><input type="checkbox" checked={settings.haptics} onChange={(e) => set('haptics', e.target.checked)} /> רטט (אנדרואיד)</label>
            <label><input type="checkbox" checked={settings.keepAwake} onChange={(e) => set('keepAwake', e.target.checked)} /> השאר מסך דלוק</label>
            <button className="primary" onClick={() => setSettingsOpen(false)}>סגור</button>
          </section>
        </div>
      )}
    </main>
  );
}
