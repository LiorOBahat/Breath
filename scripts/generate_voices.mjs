// Generates Hebrew voice cues into public/voices/<pack>/<cue>.mp3 with ElevenLabs.
//
// Usage (key is read from .env.local):
//   node --env-file=.env.local scripts/generate_voices.mjs            # all packs
//   node --env-file=.env.local scripts/generate_voices.mjs lily sarah # only these packs
//
// Edit scripts/voice_lines.json to change the wording, or PACKS to change voices/softness.
// Keep the pack ids in sync with VoiceChoice in src/settings/store.ts.
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream, mkdirSync, readFileSync } from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LINES = JSON.parse(readFileSync(join(ROOT, "scripts", "voice_lines.json"), "utf-8"));

const V4 = { modelId: "eleven_v4", languageCode: "he", voiceSettings: { stability: 0.85, similarityBoost: 0.6 } };

// Delivery tag: calm and gentle, not a whisper.
const TAG = "[gentle, soothing, calm voice]";

const PACKS = {
  lily: { voiceId: "pFZP5JQG7iQjIQuC4Bku", ...V4 },
  sarah: { voiceId: "EXAVITQu4vr4xnSDxMaL", ...V4 },
  brian: { voiceId: "nPczCjzI2devNBz1zQrb", ...V4 },
  george: { voiceId: "JBFqnCBsd6RMkjVDRZzb", ...V4 },
};

const only = process.argv.slice(2);
const client = new ElevenLabsClient();
for (const [pack, { voiceId, ...opts }] of Object.entries(PACKS)) {
  if (only.length && !only.includes(pack)) continue;
  const dir = join(ROOT, "public", "voices", pack);
  mkdirSync(dir, { recursive: true });
  for (const [cue, text] of Object.entries(LINES)) {
    const audio = await client.textToSpeech.convert(voiceId, { text: `${TAG} ${text}`, ...opts });
    const file = join(dir, `${cue}.mp3`);
    await finished(Readable.fromWeb(audio).pipe(createWriteStream(file)));
    console.log("wrote", `public/voices/${pack}/${cue}.mp3`);
  }
}
