#!/usr/bin/env node
/**
 * Apograph — scriptorium / manuscript apograph booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code 2.1.269; Claude Desktop 1.52386.3; macOS 26.6.2
 * (Darwin 25.6.0). Reopening a conversation from the Desktop app
 * sidebar creates a new session ID and a full copy of the transcript
 * every time, instead of appending to the existing session. After a
 * day of use, one conversation with a user-set custom title exists
 * as 7 separate `.jsonl` files in `~/.claude/projects/<project>/`,
 * and `/resume` in the terminal shows 5+ rows with the same title
 * and different sizes. Docs (sessions.md) say a plain resume reuses
 * the session ID and only `--fork-session` / `/branch` create a new
 * one. The Desktop app does not follow that.
 *
 *   node apograph.mjs data/apographed.json
 *   echo '{"seed":"apographed"}' | node apograph.mjs
 *
 * Idle word is singular (HOLD: one conversation = one leaf; CLI
 * appends in place; session-ID wax seal intact).
 * Seeded word is apographed (#93859 — Desktop reopen forks a full
 * transcript copy).
 * Path word is reopen-fork.
 * Product score word is apograph (Score apograph or admit singular.).
 *
 * Encoded from anthropics/claude-code#93859 issue text only.
 * Hypothesis (NON-BINDING): Desktop sidebar reopen creates a new
 * session ID and copies the full transcript instead of appending
 * to the existing session, contrary to docs that say plain resume
 * reuses the session ID. Confirming the exact Desktop reopen path
 * is inferred from the published evidence (7 jsonl supersets,
 * birth times seconds after the previous last write, all
 * entrypoint claude-desktop) — not verified from source. Verify
 * against #93859 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "singular",
  "apographed",
  "apograph",
  "reopen-fork",
  "hold",
  "cli-append",
  "one-leaf",
  "seal-intact",
  "desktop-fork",
  "session-id",
  "transcript-superset",
  "custom-title",
  "resume-rows",
  "entrypoint-desktop",
  "no-fork-flag",
  "mb-chain",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "singular";
export const PATH_WORD = "reopen-fork";
export const SEEDED_WORD = "apographed";
export const PRODUCT_WORD = "apograph";
export const HOLD = Object.freeze(["singular", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "singular",
  "cli-append",
  "one-leaf",
  "seal-intact",
]);
export const RECOVER = Object.freeze(["singular", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "airlock",
  "equalized",
  "blown",
  "socat-race",
  "scotoma",
  "legible",
  "scotomized",
  "command-args-blind",
  "aneroid",
  "calibrated",
  "aneroided",
  "wrong-window-ring",
  "simulacrum",
  "tethered",
  "hollow",
  "phantom-navigate",
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "armed",
  "coil-pulled",
  "toggle-fidelity",
  "first-message-arm",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd-mislabel",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "sighted",
  "blindsided",
  "compare-ref-unreachable",
  "interdict",
  "scoped",
  "interdicted",
  "chrome-prohibit-bleed",
  "pontoon",
  "washed",
  "afloat",
  "bridge-loss",
  "simplex",
  "duplex",
  "simplexed",
  "mobile-uplink-silent",
  "deadkey",
  "keyed",
  "deadkeyed",
  "esc-csi-dead",
  "gleaner",
  "gleaned",
  "orphaned",
  "unreaped-ampersand",
  "schism",
  "live",
  "schismed",
  "resume-while-live",
  "rasure",
  "intact",
  "rasured",
  "creation-time-flip",
  "ashpan",
  "swept",
  "ashpanned",
  "orphan-jsonl",
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "innominate",
  "icon-only",
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
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
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
  "released",
  "frozen",
  "sostenuto",
  "tabula",
  "ukase",
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
  "warm",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "apographed" && name !== "apograph"),
);

export const FEATURED_ISSUE = 93859;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93859";
export const TITLE =
  "[BUG] Desktop app forks a new session ID (full transcript copy) on every reopen; /resume shows many rows with the same title";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "Claude Code 2.1.269";
export const DESKTOP_VERSION = "Claude Desktop 1.52386.3";
export const GOOD_VERSION =
  "Desktop sidebar reopen resumes the existing session ID, exactly like claude --resume; one conversation = one transcript file = one /resume row";
export const SURFACE = "desktop-sidebar-reopen";
export const HOST = "macos-26.6.2";
export const INSTALL_PATH = "~/.claude/projects/<project>/";
export const COMMAND = "/resume";
export const PHRASE = "Score apograph or admit singular.";
export const FILE_COUNT = 7;
export const RESUME_ROWS = 5;
export const CLI_RESUMES = 32;
export const FIRST_TS = "2026-09-12T10:15:44Z";
export const SIZE_CHAIN_MB = Object.freeze([1.5, 1.6, 2.2, 2.3, 3.1, 3.1, 4.6]);
export const BIRTH_LAG_S = 15;
export const ENTRYPOINT = "claude-desktop";
export const DISTRIBUTION =
  "Claude Code 2.1.269; Claude Desktop 1.52386.3; macOS 26.6.2 (Darwin 25.6.0). Reopening a conversation from the Desktop app sidebar creates a new session ID and a full copy of the transcript every time, instead of appending to the existing session. After a day of use, one conversation with a user-set custom title exists as 7 separate .jsonl files in ~/.claude/projects/<project>/, and /resume in the terminal shows 5+ rows with the same title and different sizes. Docs (sessions.md) say a plain resume reuses the session ID and only --fork-session / /branch create a new one. The Desktop app does not follow that. Evidence: 7 files share the same customTitle, the same first user message, and the same first timestamp (2026-09-12T10:15:44Z). Each later file contains nearly all message UUIDs of the previous one plus new ones (superset chain). Sizes: 1.5 MB → 1.6 → 2.2 → 2.3 → 3.1 → 3.1 → 4.6 MB. Each file's birth time is seconds after the previous file's last write (e.g. previous last write 14:34:02, next file created 14:34:17). Every record in all 7 files carries entrypoint: claude-desktop. The same conversation, once resumed from the CLI instead, was resumed ~32 times (32 permission-mode header blocks in the last file) with no further fork. Desktop sidebar shows the title with a (2) suffix for one of the copies. No --fork-session was used. No .superseded-* / .orphaned-* files exist. Cousin #93797 (Schism: SendMessage resumes a second LIVE workflow agent) is cite-only — live dual-writer, not Desktop sidebar reopen fork.";
export const RULED_OUT = Object.freeze([
  "Documented --fork-session / /branch — no --fork-session was used; docs say only those create a new session ID",
  "Documented set-aside — no .superseded-* / .orphaned-* files exist",
  "#93797 Schism — SendMessage resumes a second copy from transcript while the original LIVE workflow still runs; different mechanism: live dual-writer vs Desktop sidebar reopen fork",
  "A CLI resume fork — the same conversation resumed from the CLI ~32 times with no further fork",
  "Unrelated titles colliding in /resume — 7 files share the same customTitle, first user message, and first timestamp",
]);
export const EXPECTED = Object.freeze([
  "Reopening a session from Desktop should resume the existing session ID, exactly like claude --resume in the terminal",
  "One conversation = one transcript file = one row in /resume",
  "A custom-titled conversation should not appear as 7 .jsonl files after a day of Desktop reopens",
  "Desktop should follow sessions.md: plain resume reuses the session ID; only --fork-session / /branch create a new one",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "seven-leaves", label: "7 jsonl", count: "7", note: "one custom-titled conversation exists as 7 separate .jsonl files after a day of Desktop reopens" },
  { id: "superset", label: "superset", count: "1.5→4.6", note: "each later file contains nearly all message UUIDs of the previous plus new ones; sizes 1.5→4.6 MB" },
  { id: "birth-lag", label: "birth", count: "15s", note: "each file's birth time is seconds after the previous last write (14:34:02 → 14:34:17)" },
  { id: "cli-hold", label: "CLI ×32", count: "32", note: "same conversation resumed from CLI ~32 times with no further fork" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "singular-gate",
    survey: "one conversation = one leaf; CLI appends in place; session-ID wax seal intact",
    kind: "singular",
    note: "idle: the scriptorium keeps a single folio — the hold/good path",
  },
  {
    id: "desktop-fork",
    survey: "Desktop sidebar reopen creates a new session ID and a full transcript copy",
    kind: "apographed",
    note: "seeded: each reopen presses a new leaf instead of writing on the last",
  },
  {
    id: "transcript-superset",
    survey: "7 files share customTitle, first user message, first timestamp; each later file is a superset",
    kind: "apographed",
    note: "seeded: the MB chain 1.5→4.6 and birth times seconds apart",
  },
  {
    id: "cli-append",
    survey: "same conversation resumed from CLI ~32 times with no further fork",
    kind: "apographed",
    note: "seeded: CLI lane stays one leaf; Desktop lane stacks copies",
  },
  {
    id: "reopen-fork",
    survey: "docs say plain resume reuses session ID; Desktop does not follow that",
    kind: "apographed",
    note: "path: reopen-fork names the Desktop sidebar copy vs CLI append-in-place",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "reopen-fork",
  "apographed",
  "desktop-fork",
  "session-id",
  "transcript-superset",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93797,
    title: "[BUG] SendMessage to a LIVE Workflow agent resumes a second copy from its transcript while the original keeps running",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — Schism live dual-writer / resume-while-live; different mechanism from Desktop sidebar reopen fork — do not treat as the product, do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93863, title: "backup #93863", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93848, title: "backup #93848", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "airlock",
  "scotoma",
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
  "cachet",
  "ukase",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
  "flashpan",
  "guillotine",
  "parergon",
  "followspot",
  "calends",
  "alidade",
  "diopter",
  "sluice",
]);

export const SAMPLE_SINGULAR_QUIRE = Object.freeze({
  fileCount: 1,
  sessionIds: 1,
  resumeRows: 1,
  cliAppends: CLI_RESUMES,
  desktopForks: 0,
  sizesMb: [4.6],
  entrypoint: ENTRYPOINT,
  forkFlag: false,
  superseded: false,
  version: GOOD_VERSION,
});

export const SAMPLE_APOGRAPHED_QUIRE = Object.freeze({
  fileCount: FILE_COUNT,
  sessionIds: FILE_COUNT,
  resumeRows: RESUME_ROWS,
  cliAppends: CLI_RESUMES,
  desktopForks: FILE_COUNT - 1,
  sizesMb: [...SIZE_CHAIN_MB],
  entrypoint: ENTRYPOINT,
  forkFlag: false,
  superseded: false,
  version: CLAUDE_VERSION,
});

export const SAMPLE_DESKTOP_FORK = Object.freeze({
  surface: "desktop-sidebar",
  newSessionId: true,
  fullTranscriptCopy: true,
  appendInPlace: false,
  titleSuffix: "(2)",
});

export const SAMPLE_CLI_APPEND = Object.freeze({
  surface: "cli",
  newSessionId: false,
  fullTranscriptCopy: false,
  appendInPlace: true,
  permissionModeBlocks: CLI_RESUMES,
});

export const SAMPLE_SESSION_IDS = Object.freeze({
  sharedCustomTitle: true,
  sharedFirstUserMessage: true,
  sharedFirstTimestamp: FIRST_TS,
  distinctSessionIds: FILE_COUNT,
  reusedSessionId: false,
});

export const SAMPLE_SUPERSET_CHAIN = Object.freeze({
  files: FILE_COUNT,
  sizesMb: [...SIZE_CHAIN_MB],
  eachLaterIsSuperset: true,
  birthLagS: BIRTH_LAG_S,
  lastWrite: "14:34:02",
  nextBirth: "14:34:17",
});

export const SAMPLE_MB_CHAIN = Object.freeze({
  sizesMb: [...SIZE_CHAIN_MB],
  startMb: 1.5,
  endMb: 4.6,
  chain: true,
});

export const SAMPLE_RESUME_ROWS = Object.freeze({
  rows: RESUME_ROWS,
  sameTitle: true,
  differentSizes: true,
  currentUnclear: true,
});

export const SAMPLE_NO_FORK_FLAG = Object.freeze({
  forkSessionFlag: false,
  branchCommand: false,
  supersededFiles: false,
  orphanedFiles: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds singular: one conversation = one leaf; CLI appends in place; session-ID wax seal intact" },
  { t: "desktop-fork", line: "Desktop sidebar reopen creates a new session ID and a full transcript copy" },
  { t: "transcript-superset", line: "7 files share customTitle, first user message, first timestamp 2026-09-12T10:15:44Z; sizes 1.5→4.6 MB" },
  { t: "cli-append", line: "same conversation resumed from CLI ~32 times with no further fork" },
  { t: "path", line: "reopen-fork — docs say plain resume reuses session ID; Desktop does not follow that" },
  { t: "score", line: "when Desktop reopens press a new leaf the booth is apograph — Score apograph or admit singular." },
]);

/**
 * Leaf map: CLI one folio vs Desktop stacked copies.
 * Idle/singular: one leaf, session ID reused.
 * Seeded/apographed: 7 leaves, new session ID each Desktop reopen.
 */
export function mapLeaves(input = {}) {
  const singular = input.singular === true && input.apographed !== true;
  const files = singular ? 1 : Number(input.fileCount ?? FILE_COUNT);
  const stacked = !singular && files > 1;
  return {
    fileCount: files,
    sessionIds: singular ? 1 : files,
    resumeRows: singular ? 1 : Number(input.resumeRows ?? RESUME_ROWS),
    sizesMb: singular ? [4.6] : [...SIZE_CHAIN_MB],
    cliLane: singular ? "append" : "append",
    desktopLane: stacked ? "fork-stack" : "one-leaf",
    seal: stacked ? "split" : "intact",
    stamp: stacked ? "reopen-fork" : "seal-intact",
    note: stacked
      ? "Desktop reopen stacked 7 parchment leaves; session-ID wax seals split"
      : "one conversation = one leaf; session-ID wax seal intact",
  };
}

export function inspectDesktop(input = {}) {
  const desk =
    input.desktop && typeof input.desktop === "object"
      ? input.desktop
      : input.singular === true && input.apographed !== true
        ? { ...SAMPLE_DESKTOP_FORK, newSessionId: false, fullTranscriptCopy: false, appendInPlace: true }
        : SAMPLE_DESKTOP_FORK;
  const forced =
    input.desktopFork === true ||
    input.event === "desktop-fork" ||
    input.event === "apographed" ||
    input.event === "apograph" ||
    input.apographed === true;
  const forked = forced ? true : desk.newSessionId === true && input.singular !== true;
  return {
    surface: "desktop-sidebar",
    newSessionId: forked,
    fullTranscriptCopy: forked,
    appendInPlace: !forked,
    stamp: forked ? "desktop-fork" : "cli-append",
    note: forked
      ? "Desktop sidebar reopen creates a new session ID and a full transcript copy"
      : "Desktop reopen resumes the existing session ID like claude --resume",
  };
}

export function inspectCli(input = {}) {
  const cli =
    input.cli && typeof input.cli === "object"
      ? input.cli
      : SAMPLE_CLI_APPEND;
  const forced =
    input.cliAppend === true ||
    input.event === "cli-append" ||
    input.singular === true;
  const appends = forced || cli.appendInPlace === true || input.apographed === true;
  return {
    surface: "cli",
    appendInPlace: true,
    permissionModeBlocks: CLI_RESUMES,
    furtherFork: false,
    stamp: appends ? "cli-append" : "cli-fork",
    note: "same conversation resumed from CLI ~32 times with no further fork",
  };
}

export function inspectSessionId(input = {}) {
  const ids =
    input.session && typeof input.session === "object"
      ? input.session
      : input.singular === true && input.apographed !== true
        ? { ...SAMPLE_SESSION_IDS, distinctSessionIds: 1, reusedSessionId: true }
        : SAMPLE_SESSION_IDS;
  const forced =
    input.newSessionId === true ||
    input.event === "session-id" ||
    input.event === "apographed" ||
    input.event === "apograph" ||
    input.apographed === true;
  const split = forced ? true : ids.reusedSessionId !== true && input.singular !== true;
  return {
    sharedCustomTitle: true,
    sharedFirstUserMessage: true,
    sharedFirstTimestamp: FIRST_TS,
    distinctSessionIds: split ? FILE_COUNT : 1,
    reusedSessionId: !split,
    stamp: split ? "session-id" : "seal-intact",
    note: split
      ? "each Desktop reopen mints a new session ID; docs say plain resume reuses it"
      : "plain resume reuses the session ID — one wax seal",
  };
}

export function inspectSuperset(input = {}) {
  const chain =
    input.superset && typeof input.superset === "object"
      ? input.superset
      : SAMPLE_SUPERSET_CHAIN;
  const forced =
    input.transcriptSuperset === true ||
    input.event === "transcript-superset" ||
    input.event === "apographed" ||
    input.event === "apograph" ||
    input.apographed === true;
  const stacked = forced ? true : chain.eachLaterIsSuperset === true && input.singular !== true;
  return {
    files: stacked ? FILE_COUNT : 1,
    sizesMb: stacked ? [...SIZE_CHAIN_MB] : [4.6],
    eachLaterIsSuperset: stacked,
    birthLagS: stacked ? BIRTH_LAG_S : 0,
    stamp: stacked ? "transcript-superset" : "one-leaf",
    note: stacked
      ? "each later file is a superset; birth times seconds after previous last write"
      : "one transcript file; no stacked copies",
  };
}

export function inspectMbChain(input = {}) {
  const chain =
    input.mb && typeof input.mb === "object"
      ? input.mb
      : SAMPLE_MB_CHAIN;
  const forced =
    input.mbChain === true ||
    input.event === "mb-chain" ||
    input.event === "apographed" ||
    input.event === "apograph" ||
    input.apographed === true;
  const racing = forced ? true : chain.chain === true && input.singular !== true;
  return {
    sizesMb: racing ? [...SIZE_CHAIN_MB] : [4.6],
    startMb: racing ? 1.5 : 4.6,
    endMb: 4.6,
    chain: racing,
    stamp: racing ? "mb-chain" : "one-leaf",
    note: racing
      ? "sizes 1.5 → 1.6 → 2.2 → 2.3 → 3.1 → 3.1 → 4.6 MB"
      : "single leaf size; no MB chain",
  };
}

export function readBooth(input = {}) {
  const desktop = inspectDesktop(input);
  const cli = inspectCli(input);
  const session = inspectSessionId(input);
  const superset = inspectSuperset(input);
  const mb = inspectMbChain(input);
  const apographed =
    input.singular !== true &&
    ((desktop.newSessionId === true && superset.eachLaterIsSuperset === true) ||
      input.apographed === true);
  const singular =
    input.singular === true && apographed !== true && desktop.newSessionId !== true;
  const path =
    (input.event === "reopen-fork" || input.reopenFork === true) &&
    (desktop.newSessionId === true || input.apographed === true);
  return {
    desktop,
    cli,
    session,
    superset,
    mb,
    leaves: mapLeaves(input),
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    apographed: apographed && !singular && !path,
    singular:
      singular ||
      (!apographed &&
        !path &&
        input.apographed !== true &&
        input.reopenFork !== true &&
        desktop.newSessionId !== true),
    reopenFork: path && !singular,
    mark:
      path && !singular
        ? "reopen-fork"
        : apographed && !singular
          ? "apographed"
          : "singular",
  };
}

/**
 * Published apograph walk from #93859 only. Facts from the issue text.
 * A singular booth reuses one session ID (CLI append, one leaf).
 * An apographed booth stacks full-transcript copies on Desktop reopen.
 * A reopen-fork booth names that path.
 */
export const APOGRAPH_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-singular",
    singular: true,
    apographed: false,
    cue: "singular",
    note: "idle HOLD: one conversation = one leaf; CLI appends in place; session-ID wax seal intact — the hold/good path",
  },
  {
    t: "desktop-fork",
    event: "desktop-fork",
    apographed: true,
    desktopFork: true,
    cue: "apographed",
    note: "Desktop sidebar reopen creates a new session ID and a full transcript copy",
  },
  {
    t: "transcript-superset",
    event: "transcript-superset",
    apographed: true,
    transcriptSuperset: true,
    cue: "apographed",
    note: "7 files share customTitle, first user message, first timestamp; each later file is a superset",
  },
  {
    t: "cli-append",
    event: "cli-append",
    apographed: true,
    cliAppend: true,
    cue: "apographed",
    note: "same conversation resumed from CLI ~32 times with no further fork",
  },
  {
    t: "path",
    event: "reopen-fork",
    apographed: true,
    reopenFork: true,
    desktopFork: true,
    newSessionId: true,
    cue: "apographed",
    note: "reopen-fork — docs say plain resume reuses session ID; Desktop does not follow that",
  },
  {
    t: "score",
    event: "apograph",
    apographed: true,
    reopenFork: true,
    desktopFork: true,
    newSessionId: true,
    transcriptSuperset: true,
    mbChain: true,
    cue: "apographed",
    note: "apograph — when Desktop reopens press a new leaf the booth is apograph",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-singular",
    singular: true,
    apographed: false,
    cue: "singular",
    note: "positive control: Desktop reopen reuses the session ID; one leaf",
  },
  {
    t: "announce",
    event: "cue-singular",
    singular: true,
    cue: "singular",
    note: "positive control: the quire stays singular",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    singular: true,
    apographed: false,
    reopenFork: false,
    cue: "singular",
  };
}

export function seedSingular() {
  return { ...emptyTicket() };
}

export function seedApographed() {
  return {
    seed: SEEDED_WORD,
    singular: false,
    apographed: true,
    reopenFork: true,
    desktopFork: true,
    newSessionId: true,
    transcriptSuperset: true,
    customTitle: true,
    resumeRows: true,
    entrypointDesktop: true,
    noForkFlag: true,
    mbChain: true,
    cliAppend: true,
    singularSurface: false,
    cue: "apographed",
    issue: FEATURED_ISSUE,
    desktop: SAMPLE_DESKTOP_FORK,
    cli: SAMPLE_CLI_APPEND,
    session: SAMPLE_SESSION_IDS,
    superset: SAMPLE_SUPERSET_CHAIN,
    mb: SAMPLE_MB_CHAIN,
  };
}

export function seedApograph() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    apographed: true,
    reopenFork: true,
    desktopFork: true,
    newSessionId: true,
    cue: "apographed",
  };
}

export function seedReopenFork() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    apographed: true,
    reopenFork: true,
    desktopFork: true,
    newSessionId: true,
    event: "reopen-fork",
    cue: "apographed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    singular: true,
    cue: "singular",
  };
}

export function seedDesktopFork() {
  return {
    seed: "desktop-fork",
    preferSeed: true,
    desktopFork: true,
    cue: "apographed",
  };
}

export function seedSessionId() {
  return {
    seed: "session-id",
    preferSeed: true,
    newSessionId: true,
    cue: "apographed",
  };
}

export function seedTranscriptSuperset() {
  return {
    seed: "transcript-superset",
    preferSeed: true,
    transcriptSuperset: true,
    cue: "apographed",
  };
}

export function seedCustomTitle() {
  return {
    seed: "custom-title",
    preferSeed: true,
    customTitle: true,
    cue: "apographed",
  };
}

export function seedResumeRows() {
  return {
    seed: "resume-rows",
    preferSeed: true,
    resumeRows: true,
    cue: "apographed",
  };
}

export function seedEntrypointDesktop() {
  return {
    seed: "entrypoint-desktop",
    preferSeed: true,
    entrypointDesktop: true,
    cue: "apographed",
  };
}

export function seedNoForkFlag() {
  return {
    seed: "no-fork-flag",
    preferSeed: true,
    noForkFlag: true,
    cue: "apographed",
  };
}

export function seedMbChain() {
  return {
    seed: "mb-chain",
    preferSeed: true,
    mbChain: true,
    cue: "apographed",
  };
}

export function seedCliAppend() {
  return {
    seed: "cli-append",
    preferSeed: true,
    singular: true,
    cue: "singular",
  };
}

export function seedOneLeaf() {
  return {
    seed: "one-leaf",
    preferSeed: true,
    singular: true,
    cue: "singular",
  };
}

export function seedSealIntact() {
  return {
    seed: "seal-intact",
    preferSeed: true,
    singular: true,
    cue: "singular",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      singular: false,
      apographed: false,
      reopenFork: false,
      desktopFork: false,
      newSessionId: false,
      transcriptSuperset: false,
      customTitle: false,
      resumeRows: false,
      entrypointDesktop: false,
      noForkFlag: false,
      mbChain: false,
      cliAppend: false,
      singularSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    singular: raw.singular === true,
    apographed:
      raw.apographed === true ||
      raw.event === "apographed" ||
      raw.event === "apograph",
    reopenFork: raw.reopenFork === true || raw.event === "reopen-fork",
    desktopFork: raw.desktopFork === true || raw.event === "desktop-fork",
    newSessionId: raw.newSessionId === true || raw.event === "session-id",
    transcriptSuperset:
      raw.transcriptSuperset === true || raw.event === "transcript-superset",
    customTitle: raw.customTitle === true || raw.event === "custom-title",
    resumeRows: raw.resumeRows === true || raw.event === "resume-rows",
    entrypointDesktop:
      raw.entrypointDesktop === true || raw.event === "entrypoint-desktop",
    noForkFlag: raw.noForkFlag === true || raw.event === "no-fork-flag",
    mbChain: raw.mbChain === true || raw.event === "mb-chain",
    cliAppend: raw.cliAppend === true || raw.event === "cli-append",
    singularSurface: raw.singularSurface === true || raw.event === "one-leaf",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    desktop: raw.desktop,
    cli: raw.cli,
    session: raw.session,
    superset: raw.superset,
    mb: raw.mb,
    quire: raw.quire,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.singular != null ||
        ticket.apographed != null ||
        ticket.reopenFork != null ||
        ticket.desktopFork != null ||
        ticket.newSessionId != null ||
        ticket.transcriptSuperset != null ||
        ticket.customTitle != null ||
        ticket.resumeRows != null ||
        ticket.entrypointDesktop != null ||
        ticket.noForkFlag != null ||
        ticket.mbChain != null ||
        ticket.cliAppend != null ||
        ticket.singularSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.desktop ||
        ticket.cli ||
        ticket.session ||
        ticket.superset ||
        ticket.mb),
  );
}

function isSingular(row) {
  if (row.apographed && row.cue !== "singular") return false;
  if (row.cue === "apographed" || row.cue === "apograph" || row.cue === "reopen-fork") {
    return false;
  }
  if (
    row.reopenFork &&
    row.desktopFork &&
    row.cue !== "singular" &&
    row.singular !== true
  ) {
    return false;
  }
  if (
    row.reopenFork &&
    row.newSessionId &&
    row.cue !== "singular" &&
    row.singular !== true
  ) {
    return false;
  }
  if (row.singular === true && row.apographed !== true && row.cue !== "apographed") {
    return true;
  }
  if (
    row.cue === "singular" &&
    row.apographed !== true &&
    row.reopenFork !== true &&
    row.desktopFork !== true &&
    row.newSessionId !== true
  ) {
    return true;
  }
  return false;
}

function isReopenForkPath(row) {
  return (
    row.event === "reopen-fork" &&
    !isSingular(row) &&
    (row.reopenFork === true ||
      row.desktopFork === true ||
      row.newSessionId === true)
  );
}

function isApographed(row) {
  if (isSingular(row)) return false;
  if (isReopenForkPath(row) && row.cue !== "apographed") return false;
  if (row.cue === "apographed" || row.cue === "apograph") return true;
  if (row.apographed === true) return true;
  if (
    row.reopenFork === true &&
    row.desktopFork === true &&
    row.newSessionId === true
  ) {
    return true;
  }
  if (row.reopenFork === true && row.desktopFork === true) {
    return true;
  }
  if (
    row.desktopFork === true ||
    row.newSessionId === true ||
    row.transcriptSuperset === true ||
    (row.reopenFork === true && row.newSessionId === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one apograph pass against the scriptorium quire.
 * singular: one conversation = one leaf; CLI appends.
 * apographed / apograph: Desktop reopen forks a full transcript copy.
 * reopen-fork: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isReopenForkPath(row) ||
    (row.reopenFork && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "reopen-fork";
  } else if (isApographed(row)) {
    verdict = "apograph";
  } else if (isSingular(row)) {
    verdict = "singular";
  } else if (
    row.reopenFork ||
    row.desktopFork ||
    row.newSessionId ||
    (row.transcriptSuperset && !row.singular)
  ) {
    verdict = "apograph";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const desktop = inspectDesktop(row);
  const cli = inspectCli(row);
  const session = inspectSessionId(row);
  const superset = inspectSuperset(row);
  const mb = inspectMbChain(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    singular: verdict === "singular" || verdict === "hold",
    apographed:
      verdict === "apographed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    reopenFork:
      row.reopenFork === true ||
      verdict === "reopen-fork" ||
      verdict === PATH_WORD,
    desktopFork: row.desktopFork,
    newSessionId: row.newSessionId,
    transcriptSuperset: row.transcriptSuperset,
    customTitle: row.customTitle,
    resumeRows: row.resumeRows,
    entrypointDesktop: row.entrypointDesktop,
    noForkFlag: row.noForkFlag,
    mbChain: row.mbChain,
    cliAppend: row.cliAppend,
    singularSurface: row.singularSurface,
    cue: hold
      ? "singular"
      : row.reopenFork || verdict === "reopen-fork"
        ? "reopen-fork"
        : "apographed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit singular" : "score apograph",
    desktopInspect: desktop,
    cliInspect: cli,
    sessionInspect: session,
    supersetInspect: superset,
    mbInspect: mb,
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
      : APOGRAPH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "apograph" || row.verdict === "apographed",
  );
  const path = scored.filter((row) => row.verdict === "reopen-fork");
  const singular = scored.filter((row) => row.verdict === "singular");
  const headline =
    scored.find((row) => row.event === "apographed") ||
    scored.find((row) => row.event === "reopen-fork") ||
    scored.find((row) => row.event === "desktop-fork") ||
    dead[dead.length - 1];
  let verdict = "singular";
  if (dead.length) verdict = "apograph";
  else if (path.length && !singular.length) verdict = "reopen-fork";
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
    apographedCount: dead.length,
    pathCount: path.length,
    singularCount: singular.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit singular" : "score apograph",
    note: headline
      ? "Desktop sidebar reopen forks a new session ID and a full transcript copy; 7 jsonl supersets 1.5→4.6 MB; CLI resume ×32 does not fork. Cousin #93797 is cite-only."
      : "published apograph walk scored against singular vs apographed",
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
    seeded !== "singular" &&
    seeded !== "apographed" &&
    seeded !== "reopen-fork" &&
    seeded !== "apograph" &&
    ticket.singular == null &&
    ticket.apographed == null &&
    ticket.reopenFork == null &&
    ticket.desktopFork == null &&
    ticket.newSessionId == null &&
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
    singular: scored.singular ?? false,
    apographed: scored.apographed ?? false,
    reopenFork: scored.reopenFork ?? false,
    desktopFork: scored.desktopFork ?? false,
    newSessionId: scored.newSessionId ?? false,
    transcriptSuperset: scored.transcriptSuperset ?? false,
    customTitle: scored.customTitle ?? false,
    resumeRows: scored.resumeRows ?? false,
    entrypointDesktop: scored.entrypointDesktop ?? false,
    noForkFlag: scored.noForkFlag ?? false,
    mbChain: scored.mbChain ?? false,
    cliAppend: scored.cliAppend ?? false,
    singularSurface: scored.singularSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.desktopFork || result.apographed ? "desk=fork" : "desk=resume",
    result.newSessionId || result.apographed ? "sid=new" : "sid=reuse",
    result.transcriptSuperset || result.apographed ? "leaves=7" : "leaves=1",
    result.reopenFork || result.verdict === "reopen-fork"
      ? "path=reopen-fork"
      : "path=singular",
    result.cue === "singular"
      ? "cue=singular"
      : result.cue === "reopen-fork"
        ? "cue=reopen-fork"
        : "cue=apographed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    singular: result.singular,
    apographed: result.apographed,
    reopenFork: result.reopenFork,
    desktopFork: result.desktopFork,
    newSessionId: result.newSessionId,
    transcriptSuperset: result.transcriptSuperset,
    customTitle: result.customTitle,
    resumeRows: result.resumeRows,
    entrypointDesktop: result.entrypointDesktop,
    noForkFlag: result.noForkFlag,
    mbChain: result.mbChain,
    cliAppend: result.cliAppend,
    singularSurface: result.singularSurface,
    desktop: input && input.desktop,
    cli: input && input.cli,
    session: input && input.session,
    superset: input && input.superset,
    mb: input && input.mb,
    quire: input && input.quire,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    desktop: inspectDesktop({
      singular: result.singular,
      apographed: result.apographed,
      desktopFork: result.desktopFork,
      desktop: input && input.desktop,
    }),
    cli: inspectCli({
      singular: result.singular,
      apographed: result.apographed,
      cliAppend: result.cliAppend,
      cli: input && input.cli,
    }),
    session: inspectSessionId({
      singular: result.singular,
      apographed: result.apographed,
      newSessionId: result.newSessionId,
      session: input && input.session,
    }),
    superset: inspectSuperset({
      singular: result.singular,
      apographed: result.apographed,
      transcriptSuperset: result.transcriptSuperset,
      superset: input && input.superset,
    }),
    mb: inspectMbChain({
      singular: result.singular,
      apographed: result.apographed,
      mbChain: result.mbChain,
      mb: input && input.mb,
    }),
    leaves: mapLeaves({
      singular: result.singular,
      apographed: result.apographed,
      fileCount: result.apographed ? FILE_COUNT : 1,
      resumeRows: result.resumeRows ? RESUME_ROWS : 1,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      apographed:
        result.apographed === true ||
        result.verdict === "apographed" ||
        result.verdict === "apograph",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      desktopVersion: DESKTOP_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      installPath: INSTALL_PATH,
      command: COMMAND,
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      fileCount: FILE_COUNT,
      sizeChainMb: [...SIZE_CHAIN_MB],
      firstTimestamp: FIRST_TS,
      hypothesis:
        "NON-BINDING: Desktop sidebar reopen creates a new session ID and copies the full transcript instead of appending to the existing session, contrary to docs that say plain resume reuses the session ID. Confirming the exact Desktop reopen path is inferred from the published evidence (7 jsonl supersets, birth times seconds after the previous last write, all entrypoint claude-desktop) — not verified from source. Invite verify against #93859 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
