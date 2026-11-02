import { VOICES, type GeneralSettings } from '../settings/store';

export interface TechniqueCard { id: string; name: string; summary: string; ready: boolean }

interface Props {
  techniques: TechniqueCard[];
  settings: GeneralSettings;
  onChange: (s: GeneralSettings) => void;
  onSelect: (id: string) => void;
}

export function Home({ techniques, settings, onChange, onSelect }: Props) {
  const set = <K extends keyof GeneralSettings>(k: K, v: GeneralSettings[K]) => onChange({ ...settings, [k]: v });
  return (
    <main>
      <h1>נשימה</h1>
      <section>
        <h2>טכניקות</h2>
        {techniques.map((t) => (
          <button key={t.id} className="card" disabled={!t.ready} onClick={() => onSelect(t.id)}>
            <strong>{t.name}</strong>
            <span>{t.ready ? t.summary : 'בקרוב'}</span>
          </button>
        ))}
      </section>
      <section>
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
      </section>
    </main>
  );
}
