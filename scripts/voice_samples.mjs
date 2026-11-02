// Generates short Hebrew samples for candidate ElevenLabs voices so you can pick one.
// Usage: node --env-file=.env.local scripts/voice_samples.mjs <out-dir>
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream, mkdirSync } from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { join } from "path";

const out = process.argv[2];
if (!out) throw new Error("usage: voice_samples.mjs <out-dir>");
mkdirSync(out, { recursive: true });

const CANDIDATES = {
  woman: { sarah: "EXAVITQu4vr4xnSDxMaL", lily: "pFZP5JQG7iQjIQuC4Bku" },
  man: { brian: "nPczCjzI2devNBz1zQrb", george: "JBFqnCBsd6RMkjVDRZzb" },
};

const TEXT = "מתחילים. שבו בנוחות, וסגרו את העיניים. שאיפה... החזקה... נשיפה...";
const V4 = { modelId: "eleven_v4", languageCode: "he", voiceSettings: { stability: 0.85, similarityBoost: 0.6 } };
const V3 = { modelId: "eleven_v3", languageCode: "he", voiceSettings: { stability: 0.5 } };
const VARIANTS = {
  "v4-calm": { text: `[calm] ${TEXT}`, ...V4 },
  "v4-gentle-soothing": { text: `[gentle, soothing, calm voice] ${TEXT}`, ...V4 },
  "v3-calm": { text: `[calm] ${TEXT}`, ...V3 },
};

const client = new ElevenLabsClient();
for (const [pack, voices] of Object.entries(CANDIDATES)) {
  for (const [name, id] of Object.entries(voices)) {
    for (const [variant, opts] of Object.entries(VARIANTS)) {
      const audio = await client.textToSpeech.convert(id, opts);
      const file = join(out, `${pack}-${name}-${variant}.mp3`);
      await finished(Readable.fromWeb(audio).pipe(createWriteStream(file)));
      console.log("wrote", file);
    }
  }
}
