#!/usr/bin/env node
/**
 * Rescript — imperial chancery / wax-seal / scrolled-rescript booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Accepting "saved as your default for new sessions" from `/model`
 * rewrites the ENTIRE user `~/.claude/settings.json` from an in-session
 * snapshot rather than merging into the file on disk. A long-lived or
 * resumed session reverts settings to whatever that session last loaded
 * and discards everything added since. Incident: 19 local hook entries;
 * 5 PreToolUse/PostToolUse security/verification hooks vanished;
 * disarmed ~3 days across every session; looked normal.
 *
 *   node rescript.mjs data/scraped.json
 *   echo '{"seed":"scraped"}' | node rescript.mjs
 *
 * Idle word is intact (HOLD: disk charter merged; hooks remain; no
 * snapshot scrape).
 * Seeded word is scraped (#93742 — entire settings.json rewritten from
 * a stale in-session scroll).
 * Path word is snapshot-write.
 * Product score word is rescript (Score rescript or admit intact.).
 *
 * Encoded from anthropics/claude-code#93742 issue text only.
 * Hypothesis (NON-BINDING): save-as-default may serialize an in-memory
 * settings snapshot taken at session load and write it whole, applying
 * only the new model key on top. Verify against #93742 text only. Do
 * NOT claim a root cause in Claude Code source you have not seen. Do
 * NOT implement a fix. No network. No exploits. No live Claude. No
 * secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "intact",
  "scraped",
  "rescript",
  "snapshot-write",
  "hold",
  "merge-to-disk",
  "stale-scroll",
  "forward-model",
  "backward-hooks",
  "serializer-fingerprint",
  "nineteen-hooks",
  "five-vanished",
  "three-days",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "intact";
export const PATH_WORD = "snapshot-write";
export const SEEDED_WORD = "scraped";
export const PRODUCT_WORD = "rescript";
export const HOLD = Object.freeze(["intact", "hold"]);
export const RECOVER = Object.freeze(["intact", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "lit",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "scraped" && name !== "rescript"),
);

export const FEATURED_ISSUE = 93742;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93742";
export const TITLE =
  "/model save-as-default rewrites all of settings.json from a stale session snapshot, silently reverting hooks";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:core",
  "area:hooks",
  "data-loss",
]);
export const PLATFORM = "linux";
export const CODE_VERSION = "2.1.269";
export const ALSO_VERSIONS = Object.freeze(["2.1.267", "2.1.268"]);
export const OS_NAME = "Linux Ubuntu 26.04 bash";
export const HOOK_COUNT = 19;
export const VANISHED_COUNT = 5;
export const DISARM_DAYS = 3;
export const MODEL_SAVE_LINE =
  "Set model to Fable 5.1 and saved as your default for new sessions";
export const SETTINGS_PATH = "~/.claude/settings.json";
export const HOOK_WINDOW_START = "2026-09-07 22:16";
export const HOOK_WINDOW_END = "2026-09-08 00:18";
export const SURVIVOR_CUTOFF = "2026-08-27";
export const HOOKS_ADDED = "2026-09-08 04:16–06:18";
export const SESSION_STARTED = "2026-08-13";
export const SESSION_RESUMED = "2026-09-08 15:17";
export const MODEL_SAVE_AT = "2026-09-10 14:30:46";
export const NOTICED_AT = "2026-09-11";
export const PHRASE = "Score rescript or admit intact.";
export const DISTRIBUTION =
  "Claude Code v2.1.269 (also 2.1.267/2.1.268) · Linux Ubuntu 26.04 bash. Accepting \"saved as your default for new sessions\" from /model rewrites the ENTIRE user ~/.claude/settings.json from an in-session snapshot rather than merging into the file on disk. Long-lived/resumed session reverts settings to whatever that session last loaded; discards everything added since. Incident: 19 local hook entries; 5 PreToolUse/PostToolUse security/verification hooks vanished; disarmed ~3 days across every session; looked normal. Bisect by add-date: vanished hooks first seen 2026-09-07 22:16 → 2026-09-08 00:18; survivors 2026-08-27 and earlier. No exceptions either direction → coherent older snapshot, not truncation/corruption. Three signals: (1) point-in-time content split, (2) serializer fingerprint — every \\uXXXX escape became literal UTF-8 (Node JSON.stringify; intentional CLI complete save), (3) forward model key + backward hooks = current change on stale base (snapshot-write, not read-modify-write). No agent Write/Edit/Bash touched the path in transcripts. Timeline UTC: hooks added 2026-09-08 04:16–06:18; session originally started 2026-08-13 resumed 2026-09-08 15:17; /model save 2026-09-10 14:30:46; missing hooks noticed 2026-09-11. settings.json symlink into git-tracked dotfiles. Repro: hooks in settings → long-lived/resumed session → add new hook on disk from elsewhere → /model save-as-default in old session → new entry gone, model updated. Fresh session save does NOT reproduce. Impact: hook absence undetectable at runtime; anything protecting settings.json from inside settings.json is removed by the same write.";
export const SESSION_KIND =
  "Linux Ubuntu 26.04 bash Claude Code v2.1.269 session. Session originally started 2026-08-13, resumed 2026-09-08 15:17. /model save-as-default at 2026-09-10 14:30:46 wrote the whole ~/.claude/settings.json from the in-session scroll. 5 of 19 local hooks vanished; disarmed ~3 days.";
export const RULED_OUT = Object.freeze([
  "agent Write/Edit/Bash on the settings path (none in transcripts)",
  "truncation or corruption (no exceptions either direction of the add-date bisect)",
  "fresh-session /model save (does NOT reproduce)",
  "read-modify-write of the on-disk charter (forward model + backward hooks = snapshot-write)",
]);
export const EXPECTED = Object.freeze([
  "merge the new model key into the file on disk",
  "keep hooks added since the session last loaded",
  "do not rewrite the entire ~/.claude/settings.json from an in-session snapshot",
]);

export const CHANCERY_PLAQUES = Object.freeze([
  { id: "hooks", label: "local hooks", count: 19, note: "entries on the quire" },
  { id: "vanished", label: "vanished", count: 5, note: "PreToolUse/PostToolUse" },
  { id: "days", label: "disarmed", count: 3, note: "days across every session" },
  { id: "save", label: "/model save", count: "14:30:46", note: "2026-09-10 UTC" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "disk-charter",
    survey: "read the disk charter (save-as-default should merge into the file on disk)",
    kind: "disk-charter",
    note: "seeded: charter scraped — entire parchment rewritten from the session scroll",
  },
  {
    id: "session-scroll",
    survey: "unfurl the session scroll (in-session snapshot taken when the session last loaded)",
    kind: "session-scroll",
    note: "seeded: scroll is older than the disk charter — resumed from 2026-08-13",
  },
  {
    id: "wax-press",
    survey: "check the wax press (/model save-as-default should not scrape the whole parchment)",
    kind: "wax-press",
    note: "seeded: press issued a rescript — complete write, not merge-to-disk",
  },
  {
    id: "hook-quire",
    survey: "count the hook quire (19 local entries should remain after a model save)",
    kind: "hook-quire",
    note: "seeded: 5 PreToolUse/PostToolUse security/verification hooks vanished",
  },
  {
    id: "ink-fingerprint",
    survey: "read the ink fingerprint (\\uXXXX escapes vs literal UTF-8 tell a complete serializer save)",
    kind: "ink-fingerprint",
    note: "seeded: every \\uXXXX escape became literal UTF-8 — Node JSON.stringify complete save",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "snapshot-write",
  "scraped",
  "stale-scroll",
  "forward-model",
  "backward-hooks",
  "serializer-fingerprint",
  "nineteen-hooks",
  "five-vanished",
]);

export const COUSINS = Object.freeze([
  {
    issue: 76749,
    title: "settings.json overwritten with {\"env\":{}} stale in-memory around /model",
    state: "CLOSED",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #76749 closed; settings.json overwritten with {\"env\":{}} from stale in-memory around /model. Different defect. Do not rebuild",
  },
  {
    issue: 93469,
    title: "~/.claude reset; settings reduced to {\"model\":\"opus[1m]\"}",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93469 ~/.claude reset; settings reduced to {\"model\":\"opus[1m]\"}. Different defect. Do not rebuild",
  },
  {
    issue: 79403,
    title: "VS Code /model toggle intermittently corrupts settings.json (malformed JSON)",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #79403 VS Code /model toggle intermittently corrupts settings.json (malformed JSON). Different defect. Do not rebuild",
  },
  {
    issue: 89215,
    title: "Web: repo .claude/settings.json silently ignored so hooks never run",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #89215 Web repo .claude/settings.json silently ignored so hooks never run. Different defect. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93722,
    title: "worktree connector disable-list (umbilical-candidate)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93743,
    title: "non-ASCII path slug memory collision",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93745,
    title: "Stop hook bills while background agent mid-write",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93672,
    title: "idle_prompt while background subagents still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity silent session substitution",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93680,
    title: "Bash mkdir via /proc/self/fd",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93694,
    title: "WSL Open-in paths",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palimpsest",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "cachet",
]);

export const SAMPLE_CHARTER = Object.freeze({
  merged: false,
  scraped: true,
});

export const SAMPLE_INTACT_CHARTER = Object.freeze({
  merged: true,
  scraped: false,
});

export const SAMPLE_SCROLL = Object.freeze({
  current: false,
  older: true,
  started: SESSION_STARTED,
  resumed: SESSION_RESUMED,
});

export const SAMPLE_INTACT_SCROLL = Object.freeze({
  current: true,
  older: false,
  started: null,
  resumed: null,
});

export const SAMPLE_PRESS = Object.freeze({
  wholeFile: true,
  mergeToDisk: false,
});

export const SAMPLE_INTACT_PRESS = Object.freeze({
  wholeFile: false,
  mergeToDisk: true,
});

export const SAMPLE_QUIRE = Object.freeze({
  hooks: 19,
  vanished: 5,
  days: 3,
});

export const SAMPLE_INTACT_QUIRE = Object.freeze({
  hooks: 19,
  vanished: 0,
  days: 0,
});

export const SAMPLE_INK = Object.freeze({
  unicodeEscapes: false,
  literalUtf8: true,
});

export const SAMPLE_INTACT_INK = Object.freeze({
  unicodeEscapes: true,
  literalUtf8: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "disk charter merged; hooks remain; no snapshot scrape" },
  { t: "charter", line: "chancery lectern holds ~/.claude/settings.json as the living charter" },
  { t: "merge", line: "save-as-default should merge the new model key into the file on disk" },
  { t: "resume", line: "session originally started 2026-08-13, resumed 2026-09-08 15:17" },
  { t: "hooks", line: "hooks added on disk 2026-09-08 04:16–06:18 — 19 local entries" },
  { t: "scroll", line: "session still holds the scroll it loaded — older than the disk charter" },
  { t: "press", line: "/model save 2026-09-10 14:30:46 Set model to Fable 5.1 and saved as your default for new sessions" },
  { t: "scrape", line: "entire parchment rewritten from the in-session scroll, not merged" },
  { t: "split", line: "forward model key + backward hooks — current change on an older base" },
  { t: "ink", line: "every \\uXXXX escape became literal UTF-8 — Node JSON.stringify complete save" },
  { t: "quire", line: "5 PreToolUse/PostToolUse security/verification hooks vanished; disarmed ~3 days" },
  { t: "path", line: "snapshot-write — complete scrape of the session scroll onto the disk charter" },
  { t: "score", line: "when the press issues a rescript from the older scroll the booth is a rescript — Score rescript or admit intact." },
]);

export function inspectCharter(input = {}) {
  const charter =
    input.charter && typeof input.charter === "object"
      ? input.charter
      : input.intact === true && input.scraped !== true
        ? SAMPLE_INTACT_CHARTER
        : SAMPLE_CHARTER;
  const forcedScraped =
    input.scraped === true ||
    input.snapshotWrite === true ||
    input.event === "scraped" ||
    input.event === "rescript" ||
    input.event === "snapshot-write";
  const scraped = forcedScraped ? true : charter.scraped === true && input.intact !== true;
  return {
    merged: !scraped,
    scraped,
    stamp: scraped ? "scraped" : "merged",
    note: scraped
      ? "disk charter scraped — entire parchment rewritten from the session scroll"
      : "disk charter merged — new model key written into the file on disk",
  };
}

export function inspectScroll(input = {}) {
  const scroll =
    input.scroll && typeof input.scroll === "object"
      ? input.scroll
      : input.intact === true && input.scraped !== true
        ? SAMPLE_INTACT_SCROLL
        : SAMPLE_SCROLL;
  const forcedOlder =
    input.staleScroll === true ||
    input.event === "stale-scroll" ||
    input.snapshotWrite === true ||
    (input.scraped === true && input.intact !== true);
  const older = forcedOlder ? true : scroll.older === true;
  return {
    current: !older,
    older,
    started: older ? SESSION_STARTED : null,
    resumed: older ? SESSION_RESUMED : null,
    stamp: older ? "older-scroll" : "current-scroll",
    note: older
      ? "session scroll is older than the disk charter — resumed from 2026-08-13"
      : "session scroll matches the disk charter",
  };
}

export function inspectPress(input = {}) {
  const press =
    input.press && typeof input.press === "object"
      ? input.press
      : input.intact === true && input.scraped !== true
        ? SAMPLE_INTACT_PRESS
        : SAMPLE_PRESS;
  const forcedWhole =
    input.forwardModel === true ||
    input.event === "forward-model" ||
    input.event === "snapshot-write" ||
    input.snapshotWrite === true ||
    (input.scraped === true && input.intact !== true);
  const wholeFile = forcedWhole ? true : press.wholeFile === true;
  return {
    wholeFile,
    mergeToDisk: !wholeFile,
    stamp: wholeFile ? "rescript-issued" : "merged",
    note: wholeFile
      ? "wax press issued a rescript — complete write, not merge-to-disk"
      : "wax press merged the model key into the disk charter",
  };
}

export function inspectQuire(input = {}) {
  const quire =
    input.quire && typeof input.quire === "object"
      ? input.quire
      : input.intact === true && input.scraped !== true
        ? SAMPLE_INTACT_QUIRE
        : SAMPLE_QUIRE;
  const forcedVanished =
    input.fiveVanished === true ||
    input.nineteenHooks === true ||
    input.event === "five-vanished" ||
    input.event === "nineteen-hooks" ||
    input.backwardHooks === true ||
    (input.scraped === true && input.intact !== true);
  const vanished = forcedVanished ? VANISHED_COUNT : quire.vanished || 0;
  return {
    hooks: HOOK_COUNT,
    vanished,
    days: vanished ? DISARM_DAYS : 0,
    stamp: vanished ? "five-vanished" : "quire-full",
    note: vanished
      ? "5 PreToolUse/PostToolUse security/verification hooks vanished; disarmed ~3 days"
      : "hook quire intact — 19 local entries remain after the model save",
  };
}

export function inspectInk(input = {}) {
  const ink =
    input.ink && typeof input.ink === "object"
      ? input.ink
      : input.intact === true && input.scraped !== true
        ? SAMPLE_INTACT_INK
        : SAMPLE_INK;
  const forcedLiteral =
    input.serializerFingerprint === true ||
    input.event === "serializer-fingerprint" ||
    input.event === "snapshot-write" ||
    input.snapshotWrite === true ||
    (input.scraped === true && input.intact !== true);
  const literalUtf8 = forcedLiteral ? true : ink.literalUtf8 === true;
  return {
    unicodeEscapes: !literalUtf8,
    literalUtf8,
    stamp: literalUtf8 ? "literal-utf8" : "escapes-kept",
    note: literalUtf8
      ? "every \\uXXXX escape became literal UTF-8 — Node JSON.stringify complete save"
      : "ink still carries \\uXXXX escapes — not a complete serializer scrape",
  };
}

export function readBooth(input = {}) {
  const charter = inspectCharter(input);
  const scroll = inspectScroll(input);
  const press = inspectPress(input);
  const quire = inspectQuire(input);
  const ink = inspectInk(input);
  const scraped =
    input.intact !== true &&
    ((charter.scraped && press.wholeFile) ||
      (scroll.older && quire.vanished) ||
      input.scraped === true);
  const intact = input.intact === true && scraped !== true && !charter.scraped;
  const path =
    press.wholeFile &&
    (input.event === "snapshot-write" || input.snapshotWrite === true);
  return {
    charter,
    scroll,
    press,
    quire,
    ink,
    plaques: CHANCERY_PLAQUES,
    stations: BOOTH_STATIONS,
    scraped: scraped && !intact && !path,
    intact:
      intact ||
      (!charter.scraped &&
        !press.wholeFile &&
        input.scraped !== true &&
        input.snapshotWrite !== true),
    snapshotWrite: path && !intact,
    mark:
      path && !intact
        ? "snapshot-write"
        : scraped && !intact
          ? "scraped"
          : "intact",
  };
}

/**
 * Published rescript walk from #93742 only. Facts from the issue text.
 * An intact booth merges the model key into the disk charter.
 * A scraped booth rewrites the whole parchment from the session scroll.
 * A snapshot-write booth names the complete in-session scrape as the path.
 */
export const RESCRIPT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-intact",
    intact: true,
    scraped: false,
    cue: "intact",
    note: "idle HOLD: disk charter merged; hooks remain; no snapshot scrape",
  },
  {
    t: "charter",
    event: "merge-to-disk",
    intact: true,
    mergeToDisk: true,
    cue: "intact",
    note: "save-as-default should merge the new model key into the file on disk",
  },
  {
    t: "resume",
    event: "stale-scroll",
    scraped: true,
    staleScroll: true,
    cue: "scraped",
    note: "session originally started 2026-08-13, resumed 2026-09-08 15:17",
  },
  {
    t: "hooks",
    event: "nineteen-hooks",
    scraped: true,
    nineteenHooks: true,
    cue: "scraped",
    note: "hooks added on disk 2026-09-08 04:16–06:18 — 19 local entries",
  },
  {
    t: "press",
    event: "forward-model",
    scraped: true,
    forwardModel: true,
    cue: "scraped",
    note: "/model save 2026-09-10 14:30:46 Set model to Fable 5.1 and saved as your default",
  },
  {
    t: "split",
    event: "backward-hooks",
    scraped: true,
    backwardHooks: true,
    cue: "scraped",
    note: "forward model key + backward hooks — current change on an older base",
  },
  {
    t: "ink",
    event: "serializer-fingerprint",
    scraped: true,
    serializerFingerprint: true,
    cue: "scraped",
    note: "every \\uXXXX escape became literal UTF-8 — Node JSON.stringify complete save",
  },
  {
    t: "quire",
    event: "five-vanished",
    scraped: true,
    fiveVanished: true,
    cue: "scraped",
    note: "5 PreToolUse/PostToolUse security/verification hooks vanished",
  },
  {
    t: "days",
    event: "three-days",
    scraped: true,
    threeDays: true,
    cue: "scraped",
    note: "disarmed ~3 days across every session; looked normal",
  },
  {
    t: "path",
    event: "snapshot-write",
    scraped: true,
    snapshotWrite: true,
    staleScroll: true,
    forwardModel: true,
    cue: "scraped",
    note: "snapshot-write — complete scrape of the session scroll onto the disk charter",
  },
  {
    t: "score",
    event: "rescript",
    scraped: true,
    snapshotWrite: true,
    staleScroll: true,
    forwardModel: true,
    backwardHooks: true,
    serializerFingerprint: true,
    nineteenHooks: true,
    fiveVanished: true,
    threeDays: true,
    cue: "scraped",
    note: "rescript — when the press issues a rescript from the older scroll the booth never stays intact",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "merge-to-disk",
    intact: true,
    mergeToDisk: true,
    cue: "intact",
    note: "positive control: save-as-default merges the model key into the file on disk",
  },
  {
    t: "quire",
    event: "cue-intact",
    intact: true,
    cue: "intact",
    note: "positive control: 19 local hooks remain; no snapshot scrape",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    intact: true,
    scraped: false,
    mergeToDisk: true,
    cue: "intact",
  };
}

export function seedIntact() {
  return { ...emptyTicket() };
}

export function seedScraped() {
  return {
    seed: SEEDED_WORD,
    intact: false,
    scraped: true,
    staleScroll: true,
    forwardModel: true,
    backwardHooks: true,
    serializerFingerprint: true,
    nineteenHooks: true,
    fiveVanished: true,
    threeDays: true,
    snapshotWrite: true,
    cue: "scraped",
    issue: FEATURED_ISSUE,
    charter: SAMPLE_CHARTER,
    scroll: SAMPLE_SCROLL,
    press: SAMPLE_PRESS,
    quire: SAMPLE_QUIRE,
    ink: SAMPLE_INK,
  };
}

export function seedRescript() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    scraped: true,
    staleScroll: true,
    forwardModel: true,
    backwardHooks: true,
    serializerFingerprint: true,
    nineteenHooks: true,
    fiveVanished: true,
    threeDays: true,
    snapshotWrite: true,
    cue: "scraped",
  };
}

export function seedSnapshotWrite() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scraped: true,
    snapshotWrite: true,
    staleScroll: true,
    forwardModel: true,
    event: "snapshot-write",
    cue: "scraped",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    intact: true,
    cue: "intact",
  };
}

export function seedMergeToDisk() {
  return {
    seed: "merge-to-disk",
    preferSeed: true,
    mergeToDisk: true,
    cue: "intact",
  };
}

export function seedStaleScroll() {
  return {
    seed: "stale-scroll",
    preferSeed: true,
    staleScroll: true,
    cue: "scraped",
  };
}

export function seedForwardModel() {
  return {
    seed: "forward-model",
    preferSeed: true,
    forwardModel: true,
    cue: "scraped",
  };
}

export function seedBackwardHooks() {
  return {
    seed: "backward-hooks",
    preferSeed: true,
    backwardHooks: true,
    cue: "scraped",
  };
}

export function seedSerializerFingerprint() {
  return {
    seed: "serializer-fingerprint",
    preferSeed: true,
    serializerFingerprint: true,
    cue: "scraped",
  };
}

export function seedNineteenHooks() {
  return {
    seed: "nineteen-hooks",
    preferSeed: true,
    nineteenHooks: true,
    cue: "scraped",
  };
}

export function seedFiveVanished() {
  return {
    seed: "five-vanished",
    preferSeed: true,
    fiveVanished: true,
    cue: "scraped",
  };
}

export function seedThreeDays() {
  return {
    seed: "three-days",
    preferSeed: true,
    threeDays: true,
    cue: "scraped",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      intact: false,
      scraped: false,
      snapshotWrite: false,
      mergeToDisk: false,
      staleScroll: false,
      forwardModel: false,
      backwardHooks: false,
      serializerFingerprint: false,
      nineteenHooks: false,
      fiveVanished: false,
      threeDays: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    intact: raw.intact === true,
    scraped:
      raw.scraped === true ||
      raw.event === "scraped" ||
      raw.event === "rescript",
    snapshotWrite:
      raw.snapshotWrite === true || raw.event === "snapshot-write",
    mergeToDisk: raw.mergeToDisk === true || raw.event === "merge-to-disk",
    staleScroll: raw.staleScroll === true || raw.event === "stale-scroll",
    forwardModel: raw.forwardModel === true || raw.event === "forward-model",
    backwardHooks:
      raw.backwardHooks === true || raw.event === "backward-hooks",
    serializerFingerprint:
      raw.serializerFingerprint === true ||
      raw.event === "serializer-fingerprint",
    nineteenHooks:
      raw.nineteenHooks === true || raw.event === "nineteen-hooks",
    fiveVanished: raw.fiveVanished === true || raw.event === "five-vanished",
    threeDays: raw.threeDays === true || raw.event === "three-days",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    charter: raw.charter,
    scroll: raw.scroll,
    press: raw.press,
    quire: raw.quire,
    ink: raw.ink,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.intact != null ||
        ticket.scraped != null ||
        ticket.snapshotWrite != null ||
        ticket.staleScroll != null ||
        ticket.forwardModel != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.charter ||
        ticket.scroll ||
        ticket.press),
  );
}

function isIntact(row) {
  if (row.scraped && row.cue !== "intact") return false;
  if (
    row.cue === "scraped" ||
    row.cue === "rescript" ||
    row.cue === "snapshot-write"
  ) {
    return false;
  }
  if (
    row.staleScroll &&
    row.forwardModel &&
    row.cue !== "intact" &&
    row.intact !== true
  ) {
    return false;
  }
  if (
    row.snapshotWrite &&
    row.staleScroll &&
    row.cue !== "intact" &&
    row.intact !== true
  ) {
    return false;
  }
  if (row.intact === true && row.scraped !== true && row.cue !== "scraped") {
    return true;
  }
  if (
    row.cue === "intact" &&
    row.scraped !== true &&
    row.staleScroll !== true &&
    row.snapshotWrite !== true
  ) {
    return true;
  }
  if (
    row.mergeToDisk === true &&
    row.scraped !== true &&
    row.staleScroll !== true &&
    row.forwardModel !== true &&
    row.snapshotWrite !== true
  ) {
    return true;
  }
  return false;
}

function isSnapshotWritePath(row) {
  return (
    row.event === "snapshot-write" &&
    !isIntact(row) &&
    (row.snapshotWrite === true ||
      row.staleScroll === true ||
      row.forwardModel === true)
  );
}

function isScraped(row) {
  if (isIntact(row)) return false;
  if (isSnapshotWritePath(row) && row.cue !== "scraped") return false;
  if (row.cue === "scraped" || row.cue === "rescript") return true;
  if (row.scraped === true) return true;
  if (
    row.staleScroll === true &&
    row.forwardModel === true &&
    row.backwardHooks === true
  ) {
    return true;
  }
  if (row.staleScroll === true && row.forwardModel === true) {
    return true;
  }
  if (
    row.staleScroll === true ||
    row.forwardModel === true ||
    row.backwardHooks === true ||
    row.fiveVanished === true ||
    row.serializerFingerprint === true ||
    (row.snapshotWrite === true && row.nineteenHooks === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one rescript pass against the chancery lectern.
 * intact: disk charter merged; hooks remain; no snapshot scrape.
 * scraped / rescript: entire settings.json rewritten from an in-session scroll.
 * snapshot-write: complete scrape of the session scroll onto the disk charter.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSnapshotWritePath(row) ||
    (row.snapshotWrite && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "snapshot-write";
  } else if (isScraped(row)) {
    verdict = "rescript";
  } else if (isIntact(row)) {
    verdict = "intact";
  } else if (
    row.staleScroll ||
    row.forwardModel ||
    row.fiveVanished ||
    (row.snapshotWrite && !row.mergeToDisk)
  ) {
    verdict = "rescript";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const charter = inspectCharter(row);
  const scroll = inspectScroll(row);
  const press = inspectPress(row);
  const quire = inspectQuire(row);
  const ink = inspectInk(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    intact: verdict === "intact" || verdict === "hold",
    scraped:
      verdict === "scraped" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    snapshotWrite:
      row.snapshotWrite === true ||
      verdict === "snapshot-write" ||
      verdict === PATH_WORD,
    mergeToDisk: row.mergeToDisk,
    staleScroll: row.staleScroll,
    forwardModel: row.forwardModel,
    backwardHooks: row.backwardHooks,
    serializerFingerprint: row.serializerFingerprint,
    nineteenHooks: row.nineteenHooks,
    fiveVanished: row.fiveVanished,
    threeDays: row.threeDays,
    cue: hold
      ? "intact"
      : row.snapshotWrite || verdict === "snapshot-write"
        ? "snapshot-write"
        : "scraped",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit intact" : "score rescript",
    charterInspect: charter,
    scrollInspect: scroll,
    pressInspect: press,
    quireInspect: quire,
    inkInspect: ink,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk) &&
        ticket.walk.length &&
        typeof ticket.walk[0] === "object"
      ? ticket.walk
      : RESCRIPT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const scraped = scored.filter(
    (row) => row.verdict === "rescript" || row.verdict === "scraped",
  );
  const path = scored.filter((row) => row.verdict === "snapshot-write");
  const intact = scored.filter((row) => row.verdict === "intact");
  const headline =
    scored.find((row) => row.event === "scraped") ||
    scored.find((row) => row.event === "snapshot-write") ||
    scored.find((row) => row.event === "stale-scroll") ||
    scraped[scraped.length - 1];
  let verdict = "intact";
  if (scraped.length) verdict = "rescript";
  else if (path.length && !intact.length) verdict = "snapshot-write";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    scrapedCount: scraped.length,
    pathCount: path.length,
    intactCount: intact.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit intact" : "score rescript",
    note: headline
      ? "/model save-as-default rewrote the entire settings.json from an in-session scroll; 5 of 19 hooks vanished; forward model + backward hooks; serializer fingerprint."
      : "published rescript walk scored against intact vs scraped",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "intact" &&
    seeded !== "scraped" &&
    seeded !== "snapshot-write" &&
    seeded !== "rescript" &&
    ticket.intact == null &&
    ticket.scraped == null &&
    ticket.staleScroll == null &&
    ticket.snapshotWrite == null &&
    ticket.forwardModel == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object")
  ) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi =
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object");
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    backups: BACKUPS.map((row) => row.issue),
    intact: scored.intact ?? false,
    scraped: scored.scraped ?? false,
    snapshotWrite: scored.snapshotWrite ?? false,
    mergeToDisk: scored.mergeToDisk ?? false,
    staleScroll: scored.staleScroll ?? false,
    forwardModel: scored.forwardModel ?? false,
    backwardHooks: scored.backwardHooks ?? false,
    serializerFingerprint: scored.serializerFingerprint ?? false,
    nineteenHooks: scored.nineteenHooks ?? false,
    fiveVanished: scored.fiveVanished ?? false,
    threeDays: scored.threeDays ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.intact && !result.scraped ? "charter=merged" : "charter=scraped",
    result.staleScroll || result.scraped ? "scroll=older" : "scroll=current",
    result.forwardModel || result.scraped ? "press=rescript" : "press=merged",
    result.fiveVanished || result.scraped ? "quire=five-vanished" : "quire=full",
    result.serializerFingerprint || result.scraped
      ? "ink=literal-utf8"
      : "ink=escapes-kept",
    result.snapshotWrite || result.verdict === "snapshot-write"
      ? "path=snapshot-write"
      : "path=intact",
    result.cue === "intact"
      ? "cue=intact"
      : result.cue === "snapshot-write"
        ? "cue=snapshot-write"
        : "cue=scraped",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    intact: result.intact,
    scraped: result.scraped,
    snapshotWrite: result.snapshotWrite,
    mergeToDisk: result.mergeToDisk,
    staleScroll: result.staleScroll,
    forwardModel: result.forwardModel,
    backwardHooks: result.backwardHooks,
    serializerFingerprint: result.serializerFingerprint,
    nineteenHooks: result.nineteenHooks,
    fiveVanished: result.fiveVanished,
    threeDays: result.threeDays,
    charter: input && input.charter,
    scroll: input && input.scroll,
    press: input && input.press,
    quire: input && input.quire,
    ink: input && input.ink,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    charter: inspectCharter({
      intact: result.intact,
      scraped: result.scraped,
      snapshotWrite: result.snapshotWrite,
      charter: input && input.charter,
    }),
    scroll: inspectScroll({
      intact: result.intact,
      scraped: result.scraped,
      staleScroll: result.staleScroll,
      snapshotWrite: result.snapshotWrite,
      scroll: input && input.scroll,
    }),
    press: inspectPress({
      intact: result.intact,
      scraped: result.scraped,
      forwardModel: result.forwardModel,
      snapshotWrite: result.snapshotWrite,
      press: input && input.press,
    }),
    quire: inspectQuire({
      intact: result.intact,
      scraped: result.scraped,
      fiveVanished: result.fiveVanished,
      nineteenHooks: result.nineteenHooks,
      backwardHooks: result.backwardHooks,
      quire: input && input.quire,
    }),
    ink: inspectInk({
      intact: result.intact,
      scraped: result.scraped,
      serializerFingerprint: result.serializerFingerprint,
      snapshotWrite: result.snapshotWrite,
      ink: input && input.ink,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      scraped:
        result.scraped === true ||
        result.verdict === "scraped" ||
        result.verdict === "rescript",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      codeVersion: CODE_VERSION,
      alsoVersions: [...ALSO_VERSIONS],
      osName: OS_NAME,
      hookCount: HOOK_COUNT,
      vanishedCount: VANISHED_COUNT,
      disarmDays: DISARM_DAYS,
      modelSaveLine: MODEL_SAVE_LINE,
      settingsPath: SETTINGS_PATH,
      hookWindowStart: HOOK_WINDOW_START,
      hookWindowEnd: HOOK_WINDOW_END,
      survivorCutoff: SURVIVOR_CUTOFF,
      hooksAdded: HOOKS_ADDED,
      sessionStarted: SESSION_STARTED,
      sessionResumed: SESSION_RESUMED,
      modelSaveAt: MODEL_SAVE_AT,
      noticedAt: NOTICED_AT,
      plaques: CHANCERY_PLAQUES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: save-as-default may serialize an in-memory settings snapshot taken at session load and write it whole, applying only the new model key on top. Verify against #93742 text only. Do not claim a root cause in Claude Code source you have not seen.",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
