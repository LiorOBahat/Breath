#!/usr/bin/env python3
"""Generate Hebrew voice cues into public/voices/<woman|man>/<cue>.mp3.

Usage (on your laptop, needs internet):
    pip install edge-tts
    python scripts/generate_voices.py

Edit scripts/voice_lines.json to change the wording, or the VOICES table to
change voice / softness (slower rate, lower pitch = softer).
"""
import asyncio, json, pathlib
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINES = json.loads((ROOT / "scripts" / "voice_lines.json").read_text(encoding="utf-8"))

VOICES = {
    "woman": dict(voice="he-IL-HilaNeural", rate="-15%", pitch="-4Hz"),
    "man": dict(voice="he-IL-AvriNeural", rate="-15%", pitch="-6Hz"),
}

async def main():
    for pack, cfg in VOICES.items():
        out = ROOT / "public" / "voices" / pack
        out.mkdir(parents=True, exist_ok=True)
        for cue, text in LINES.items():
            path = out / f"{cue}.mp3"
            await edge_tts.Communicate(text, **cfg).save(str(path))
            print("wrote", path.relative_to(ROOT))

asyncio.run(main())
