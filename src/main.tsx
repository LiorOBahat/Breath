import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource/playpen-sans-hebrew/hebrew-400.css';
import '@fontsource/playpen-sans-hebrew/latin-400.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
