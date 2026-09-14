#!/usr/bin/env node
/**
 * Educational path-script note for Allograph / #94256.
 * Does NOT patch Claude Code. Does NOT install a hook.
 * Shows that D:\proj\file and /d/proj/file unify to one grapheme.
 */
import { unifyScript, scriptsWouldEquate, naivePrefixAllows } from "../allograph.mjs";

const punch = "D:\\Dropbox\\project\\doc.tex";
const matrix = "/d/Dropbox/project";
const settings = "D:\\Dropbox\\project\\.claude\\settings.json";
const scratch = "C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude\\scratch.md";

console.log(JSON.stringify({
  note: "Educational only. Not a Claude Code fix. Invite verify against #94256 text only.",
  punch,
  matrix,
  unifiedPunch: unifyScript(punch),
  unifiedMatrix: unifyScript(matrix),
  naivePrefix: naivePrefixAllows(punch, [matrix, `${matrix}/*`]),
  wouldEquate: scriptsWouldEquate(punch, matrix),
  settingsWouldEquate: scriptsWouldEquate(settings, matrix),
  scratchWouldEquate: scriptsWouldEquate(scratch, "/tmp/claude"),
}, null, 2));
