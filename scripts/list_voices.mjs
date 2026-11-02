// Lists ElevenLabs voices available to this account.
// Usage: node --env-file=.env.local scripts/list_voices.mjs
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient();
const res = await client.voices.getAll();
for (const v of res.voices) {
  const l = v.labels ?? {};
  console.log(
    [v.voiceId, v.name, v.category, l.gender, l.age, l.descriptive ?? l.description, l.use_case].join(" | "),
  );
}
