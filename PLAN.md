# Breath – plan

PWA for guided breathing techniques (Hebrew, RTL). For personal/friends use. Hosted on GitHub Pages first; `base: './'` keeps it portable to any web server later.

## Stack
Vite + React + TypeScript, vite-plugin-pwa (offline + installable), Vitest, localStorage for settings.

## Architecture
- `src/engine/` – pure TS: a technique compiles to a list of timed `Phase`s; `positionAt(plan, elapsed)` finds the active phase. Unit-tested.
- `src/techniques/` – one file per technique (definition + `buildPlan`).
- `src/screens/` – Home (technique list + general settings), per-technique setup, Session.
- `src/audio.ts` – plays `public/voices/<woman|man>/<cue>.mp3`; missing files are skipped silently. Also haptics + wake lock.
- `src/settings/` – persisted general settings (voice woman/man/off, encouragement, haptics, keep awake).

## Voices
Pre-recorded, soft Hebrew, woman and man packs. Cue ids: `inhale`, `hold`, `exhale`, `rest`, round announcements, encouragement lines, chant instructions. Compare Hebrew TTS options (or record) before generating packs.

## Techniques
- 4-7-8 – cycles. **Done (v0.1).**
- Ta-Sa-Na-Ma (Kirtan Kriya, full) – 12 min: aloud 2 / whisper 2 / silent 4 / whisper 2 / aloud 2, syllable + finger (thumb to index, middle, ring, little) display. Settings: tempo, total length.
- Wim Hof – rounds, breaths per round, pace, retention (tap to end), 15 s recovery hold. Needs a safety warning.

## Milestones
1. Scaffold + engine + 4-7-8 + Pages deploy workflow ✅
2. Voice packs + cue manifest, encouragement scheduler
3. Wim Hof
4. Ta-Sa-Na-Ma
5. Polish: onboarding/safety, dim screen mode, icons (PNG for iOS), accessibility
6. Later: history/streaks, English, move to own server

## Known PWA limits
Audio may pause if the phone locks (mitigated by Wake Lock); no haptics on iOS.
