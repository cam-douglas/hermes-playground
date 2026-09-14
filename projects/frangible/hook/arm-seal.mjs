#!/usr/bin/env node
/**
 * Educational chmod-failopen note for Frangible / #94362.
 * Does NOT patch Claude Code. Does NOT install a hook.
 * Shows published chmod 644 fail-open vs chmod 755 deny
 * against the HOLD armed path.
 */
import {
  DENIED_BY_GUARD,
  PERMISSION_DENIED,
  REPRO_MARKER,
  scoreChmodFailopen,
  spawnGuard,
} from "../frangible.mjs";

const snapped = spawnGuard({
  executable: false,
  mode: "644",
});
const control = spawnGuard({
  executable: true,
  mode: "755",
});
const hold = spawnGuard({
  executable: false,
  mode: "644",
  armed: true,
});

console.log(JSON.stringify({
  note: "Educational only. Not a Claude Code fix. Invite verify against #94362 text only.",
  snapped,
  control,
  hold,
  scoredFailopen: scoreChmodFailopen({
    mode: "644",
    frangible: true,
    chmodFailopen: true,
  }),
  leak: PERMISSION_DENIED,
  marker: REPRO_MARKER,
  denied: DENIED_BY_GUARD,
}, null, 2));
