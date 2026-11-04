import { useState } from 'react';
import { Home, type TechniqueCard } from './screens/Home';
import { FourSevenEightSetup } from './screens/FourSevenEightSetup';
import { BoxSetup } from './screens/BoxSetup';
import { Session } from './screens/Session';
import { useSettings } from './settings/store';
import { fourSevenEight } from './techniques/fourSevenEight';
import { box } from './techniques/box';
import type { Phase } from './engine/types';

const techniques: TechniqueCard[] = [
  { id: fourSevenEight.id, name: fourSevenEight.name, summary: fourSevenEight.summary, ready: true },
  { id: box.id, name: box.name, summary: box.summary, ready: true },
  { id: 'wimhof', name: 'וים הוף', summary: '', ready: false },
  { id: 'tasanama', name: 'טה-סה-נה-מה', summary: '', ready: false },
];

export function App() {
  const [settings, setSettings] = useSettings();
  const [screen, setScreen] = useState<string>('home');
  const [plan, setPlan] = useState<Phase[] | null>(null);

  const version = <div className="version">{import.meta.env.DEV ? 'dev' : __APP_VERSION__}</div>;

  if (plan) return <Session plan={plan} settings={settings} onExit={() => setPlan(null)} />;
  if (screen === fourSevenEight.id) {
    return <><FourSevenEightSetup onBack={() => setScreen('home')} onStart={setPlan} />{version}</>;
  }
  if (screen === box.id) {
    return <><BoxSetup onBack={() => setScreen('home')} onStart={setPlan} />{version}</>;
  }
  return <><Home techniques={techniques} settings={settings} onChange={setSettings} onSelect={setScreen} />{version}</>;
}
