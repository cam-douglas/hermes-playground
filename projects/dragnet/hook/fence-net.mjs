#!/usr/bin/env node
/**
 * Educational walk-root note for Dragnet / #94064.
 * Does NOT patch Claude Code. Does NOT install a hook.
 * Does NOT walk the live filesystem.
 * Shows a synthetic find rooted at / against a project cwd.
 */
import { scoreWalkRoot } from "../dragnet.mjs";

const cwd = "/Users/me/open-case";
const rooted = scoreWalkRoot({ walkRoot: "/", cwd });
const fenced = scoreWalkRoot({ walkRoot: cwd, cwd });

console.log(JSON.stringify({
  note: "Educational only. Not a Claude Code fix. Invite verify against #94064 text only. No live filesystem walk.",
  findBinary: "/usr/bin/find",
  rooted,
  fenced,
}, null, 2));
