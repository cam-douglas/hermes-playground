#!/usr/bin/env node
/**
 * Educational subst-nest note for Matryoshka / #94350.
 * Does NOT patch Claude Code. Does NOT install a hook.
 * Shows published nested-pipe / nested-semicolon shapes
 * against the HOLD recurse path.
 */
import { UNHANDLED_SEMI, walkPermission } from "../matryoshka.mjs";

const pipe = 'echo "x: $(cat file.txt | wc -l)"';
const semi = 'echo "x: $(echo a; echo b)"';
const simple = 'echo "x: $(pwd)"';

console.log(JSON.stringify({
  note: "Educational only. Not a Claude Code fix. Invite verify against #94350 text only.",
  simple: walkPermission(simple),
  nestedPipe: walkPermission(pipe),
  nestedSemicolon: walkPermission(semi),
  unpackedPipe: walkPermission(pipe, { unpacked: true }),
  unpackedSemi: walkPermission(semi, { unpacked: true }),
  leak: UNHANDLED_SEMI,
}, null, 2));
