// Generates Hebrew voice cues into public/voices/<pack>/<cue>.mp3 with ElevenLabs.
//
// Usage (key is read from .env.local):
//   node --env-file=.env.local scripts/generate_voices.mjs            # all packs
//   node --env-file=.env.local scripts/generate_voices.mjs lily sarah # only these packs
//   node --env-file=.env.local scripts/generate_voices.mjs --cue=start # only these cues (repeatable)
//   node scripts/generate_voices.mjs --trim-only                       # re-trim existing files, no API calls
//
// Every clip has its leading/trailing silence trimmed so cues land on time and
// consecutive counts don't overlap.
//
// Edit scripts/voice_lines.json to change the wording, or PACKS to change voices/softness.
// Keep the pack ids in sync with VoiceChoice in src/settings/store.ts.
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream, mkdirSync, readFileSync, readdirSync, renameSync, rmSync } from "fs";
import { execFileSync } from "child_process";
import ffmpeg from "ffmpeg-static";
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

const args = process.argv.slice(2);
const trimOnly = args.includes("--trim-only");
const onlyCues = args.filter((a) => a.startsWith("--cue=")).map((a) => a.slice(6));
const onlyPacks = args.filter((a) => !a.startsWith("--"));

const TRIM = "silenceremove=start_periods=1:start_threshold=-40dB";
function trim(file) {
  const tmp = `${file}.tmp.mp3`;
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", file, "-af", `${TRIM},areverse,${TRIM},areverse`, "-map_metadata", "-1", "-q:a", "3", tmp]);
  rmSync(file);
  renameSync(tmp, file);
}

const client = trimOnly ? null : new ElevenLabsClient();
for (const [pack, { voiceId, ...opts }] of Object.entries(PACKS)) {
  if (onlyPacks.length && !onlyPacks.includes(pack)) continue;
  const dir = join(ROOT, "public", "voices", pack);
  mkdirSync(dir, { recursive: true });
  if (trimOnly) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".mp3"))) trim(join(dir, f));
    console.log("trimmed", pack);
    continue;
  }
  for (const [cue, text] of Object.entries(LINES)) {
    if (onlyCues.length && !onlyCues.includes(cue)) continue;
    const audio = await client.textToSpeech.convert(voiceId, { text: `${TAG} ${text}`, ...opts });
    const file = join(dir, `${cue}.mp3`);
    await finished(Readable.fromWeb(audio).pipe(createWriteStream(file)));
    trim(file);
    console.log("wrote", `public/voices/${pack}/${cue}.mp3`);
  }
}
