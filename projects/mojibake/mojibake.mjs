#!/usr/bin/env node
/**
 * Mojibake — compositor / foul-proof / geta-tofu print shop booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On native Windows, the text of the user's global CLAUDE.md that
 * Claude Code embeds in the first user message
 * (`messages[0].content[0].text`, inside the <system-reminder>
 * "Codebase and user instructions are shown below") intermittently
 * arrives at the API with one multibyte character replaced by three
 * U+FFFD replacement characters. The file on disk is valid UTF-8 and
 * never changes. In the affected requests the prompt prefix therefore
 * differs from the other requests of the same session, so every such
 * request is a full prompt-cache miss for the whole conversation.
 *
 *   node mojibake.mjs data/mojibaked.json
 *   echo '{"seed":"mojibaked"}' | node mojibake.mjs
 *
 * Idle word is verbatim (HOLD: CLAUDE.md UTF-8 reaches the API
 * intact; prompt-cache prefix stable every request).
 * Seeded word is mojibaked (#93848 — Windows embedded CLAUDE.md
 * UTF-8 codepoint → three U+FFFD intermittently).
 * Path word is fffd-spall.
 * Product score word is mojibake (Score mojibake or admit verbatim.).
 *
 * Encoded from anthropics/claude-code#93848 issue text only.
 * Hypothesis (NON-BINDING): an encoding-boundary or Windows wchar
 * round-trip on the embed path may substitute three U+FFFD for one
 * Hangul syllable. The reporter could not find the pattern that
 * decides which request is corrupted. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "hold",
  "intact-utf8",
  "cache-hit",
  "prefix-stable",
  "hangul-kept",
  "clean-variant",
  "corrupted-variant",
  "cache-miss",
  "hangul-불",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "verbatim";
export const PATH_WORD = "fffd-spall";
export const SEEDED_WORD = "mojibaked";
export const PRODUCT_WORD = "mojibake";
export const HOLD = Object.freeze(["verbatim", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "verbatim",
  "intact-utf8",
  "cache-hit",
  "prefix-stable",
  "hangul-kept",
]);
export const RECOVER = Object.freeze(["verbatim", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "vested",
  "unseised",
  "preview-eperm",
  "feoffee",
  "letters-patent",
  "demesne-open",
  "getcwd-eperm",
  "singular",
  "apographed",
  "apograph",
  "reopen-fork",
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
  "onedrive-cwd",
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
  "inherited",
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
  FORBIDDEN_IDLE.filter((name) => name !== "mojibaked" && name !== "mojibake"),
);

export const FEATURED_ISSUE = 93848;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93848";
export const TITLE =
  "[BUG] Embedded CLAUDE.md intermittently reaches the API with one multibyte character replaced by three U+FFFD, changing the prompt prefix mid-session and defeating prompt caching (2.1.258, Windows)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "2.1.258";
export const GOOD_VERSION =
  "CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request";
export const SURFACE = "embedded-claude-md";
export const HOST = "Windows 11 22H2 (10.0.22621)";
export const POWERSHELL = "PowerShell 7";
export const BUILD = "native Windows";
export const CLAUDE_MD_PATH = "%USERPROFILE%\\.claude\\CLAUDE.md";
export const FILE_BYTES = 19597;
export const FILE_ENCODING = "UTF-8 without BOM";
export const FILE_PROSE = "Korean prose";
export const FILE_DECODE_OK = "bytes.decode('utf-8') strict OK";
export const SESSION_FORM = "claude -p workers";
export const PROXY = "ANTHROPIC_BASE_URL local proxy recording system + messages[0]";
export const BLOCK_CHARS = 19136;
export const CHAR_INDEX = 3615;
export const UTF8_OFFSET_BLOCK = 7982;
export const UTF8_OFFSET_FILE = 7665;
export const HANGUL = "불";
export const HANGUL_UTF8 = "EB B6 88";
export const REPLACEMENT = "U+FFFD × 3";
export const CLEAN_SNIPPET = "바람이 불어 창문이 흔들리는 탓에 …";
export const CORRUPT_SNIPPET = "바람이 ���어 창문이 흔들리는 탓에 …";
export const DIFFLIB_OPCODE = "('replace', 3615, 3616, 3615, 3618)";
export const CLEAN_SID = "600ce64a";
export const CORRUPT_SID = "8fdae59a";
export const CLEAN_OF_17 = 14;
export const CORRUPT_OF_17 = 3;
export const SESSION_COUNT = 4;
export const CACHE_WITH_CORRUPT = "75-76%";
export const CACHE_WITH_WORKAROUND = "91.6%";
export const UNCACHE_WITH_CORRUPT = "300k";
export const UNCACHE_WITH_WORKAROUND = "93k";
export const PHRASE = "Score mojibake or admit verbatim.";
export const DISTRIBUTION =
  "In headless sessions (claude -p) on Windows, the text of the user's global CLAUDE.md that Claude Code embeds in the first user message (messages[0].content[0].text, inside the <system-reminder> \"Codebase and user instructions are shown below\") intermittently arrives at the API with one multibyte character replaced by three U+FFFD replacement characters. The file on disk is valid UTF-8 and never changes. Environment: Claude Code 2.1.258 native Windows; Windows 11 22H2 (10.0.22621); PowerShell 7; global %USERPROFILE%\\.claude\\CLAUDE.md 19,597 bytes UTF-8 without BOM, Korean prose; bytes.decode('utf-8') in strict mode succeeds. Session form: claude -p child sessions with --allowedTools (used as workers); API traffic observed through a local proxy set with ANTHROPIC_BASE_URL that records system, messages[0] and the tool names of every outgoing request. Over one 20-turn session, messages[0].content[0].text came in two variants differing in exactly one place: clean (14 of 17) '바람이 불어 창문이 흔들리는 탓에 …'; corrupted (3 of 17) '바람이 ���어 창문이 흔들리는 탓에 …'. difflib opcodes [('replace', 3615, 3616, 3615, 3618)] — the single character 불 (UTF-8 EB B6 88) became three replacement characters. Character index 3615 of the 19,136-character block; UTF-8 byte offset 7,982 inside the block; byte offset 7,665 inside the file. Neither offset is a 4 KiB / 8 KiB / 16 KiB boundary. The position is identical in every corrupted request across four separate sessions; only whether a given request is corrupted varies. Clean and corrupted interleave; the file was not modified. Per-request sid = first 8 hex chars of sha256(system + messages[0]): clean 600ce64a; corrupted 8fdae59a (full miss). With corruption on about a fifth of the requests, sessions read 75-76% of input from cache; with a proxy substituting the clean text, the same task reads 91.6% from cache and uncached token volume drops from about 300k to 93k. Cousins cite-only: #40396 (closed; Korean U+FFFD in responses on macOS — request-side vs response-side); #88836 (AskUserQuestion option descriptions: newlines replaced with U+FFFD since 2.1.235).";
export const RULED_OUT = Object.freeze([
  "A 4 KiB / 8 KiB / 16 KiB boundary cut — character index 3615; UTF-8 byte offset 7,982 in the block; 7,665 in the file; neither offset is a 4/8/16 KiB boundary",
  "A modified file on disk — the file was not modified during any session; bytes.decode('utf-8') strict succeeds; 19,597 bytes UTF-8 without BOM",
  "A content-dependent rewrite of the whole block — nothing else in the block, the system array, or the tool list differs",
  "A one-shot first-request-only glitch — the corrupted variant appeared both as the very first request of a session and in later requests (for example requests 2, 11 and 32 of one session; 15, 24 and 26 of another), with the clean variant in between",
]);
export const EXPECTED = Object.freeze([
  "Stable UTF-8 embed of CLAUDE.md so the prompt prefix is identical every request",
  "No intermittent U+FFFD substitution of a Hangul syllable",
  "Prompt-cache prefix remains cache-hit across the whole conversation",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "hangul-불", label: "hangul 불", count: "EB B6 88", note: "single character 불 (UTF-8 EB B6 88) at char index 3615" },
  { id: "fffd-spall", label: "fffd-spall", count: "U+FFFD × 3", note: "불 becomes three replacement characters; difflib replace 3615,3616 → 3615,3618" },
  { id: "cache-miss", label: "cache miss", count: "sid 8fdae59a", note: "corrupted prefix → full prompt-cache miss for the whole conversation" },
  { id: "offset", label: "offsets", count: "7982 / 7665", note: "UTF-8 byte offset 7,982 in the block; 7,665 in the file — not a 4/8/16 KiB boundary" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "verbatim-chase",
    survey: "CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request",
    kind: "verbatim",
    note: "idle: the compositor keeps Hangul sorts in the chase — the hold/good path",
  },
  {
    id: "hangul-불",
    survey: "clean variant 14 of 17: '바람이 불어 창문이 흔들리는 탓에 …' — 불 stays 불",
    kind: "verbatim",
    note: "idle/hold: Hangul syllable 불 (UTF-8 EB B6 88) stays in the type case",
  },
  {
    id: "fffd-spall",
    survey: "corrupted variant 3 of 17: 불 → three U+FFFD at the same chase cell",
    kind: "mojibaked",
    note: "path: fffd-spall names the tofu-tile substitution vs hangul-kept sort",
  },
  {
    id: "cache-miss",
    survey: "sid 8fdae59a vs 600ce64a; corrupted prefix is a full prompt-cache miss",
    kind: "mojibaked",
    note: "seeded: the job ticket changes mid-session and the cache cannot hit",
  },
  {
    id: "mojibaked",
    survey: "Windows embedded CLAUDE.md UTF-8 codepoint → three U+FFFD intermittently",
    kind: "mojibaked",
    note: "seeded: geta-tofu tiles in the chase; foul-proof stamp fails",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "fffd-spall",
  "mojibaked",
  "cache-miss",
  "hangul-불",
  "corrupted-variant",
]);

export const COUSINS = Object.freeze([
  {
    issue: 40396,
    title: "Korean (CJK) characters corrupted to U+FFFD in Claude Code responses on macOS + VSCode",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — #93848 names this as U+FFFD for Korean characters in responses on macOS; this report is about the request side and the embedded instructions file, on Windows — do not rebuild as a separate booth",
  },
  {
    issue: 88836,
    title: "AskUserQuestion option descriptions: newlines replaced with U+FFFD since 2.1.235 (regression, last good 2.1.234)",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — #93848 names this as U+FFFD in AskUserQuestion since 2.1.235; possibly the same decoding path, different surface — do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93929, title: "backup #93929", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "scissel",
  "feoffee",
  "apograph",
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
  "schism",
  "gleaner",
  "waif",
  "ashpan",
  "snatch",
  "disseisin",
  "rescript",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "rasure",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
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

export const SAMPLE_VERBATIM_PROOF = Object.freeze({
  hangulKept: true,
  fffdSpall: false,
  cacheMiss: false,
  prefixStable: true,
  fileUnchanged: true,
  version: GOOD_VERSION,
});

export const SAMPLE_MOJIBAKED_PROOF = Object.freeze({
  hangulKept: false,
  fffdSpall: true,
  cacheMiss: true,
  prefixStable: false,
  fileUnchanged: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_CLEAN = Object.freeze({
  text: CLEAN_SNIPPET,
  hangul: HANGUL,
  utf8: HANGUL_UTF8,
  sid: CLEAN_SID,
  of17: CLEAN_OF_17,
});

export const SAMPLE_CORRUPT = Object.freeze({
  text: CORRUPT_SNIPPET,
  hangul: "���",
  utf8: "EF BF BD EF BF BD EF BF BD",
  sid: CORRUPT_SID,
  of17: CORRUPT_OF_17,
  opcode: DIFFLIB_OPCODE,
});

export const SAMPLE_SPALL = Object.freeze({
  charIndex: CHAR_INDEX,
  blockChars: BLOCK_CHARS,
  utf8Block: UTF8_OFFSET_BLOCK,
  utf8File: UTF8_OFFSET_FILE,
  kibBoundary: false,
  replacements: 3,
});

export const SAMPLE_CACHE = Object.freeze({
  cleanSid: CLEAN_SID,
  corruptSid: CORRUPT_SID,
  withCorrupt: CACHE_WITH_CORRUPT,
  withWorkaround: CACHE_WITH_WORKAROUND,
  uncacheCorrupt: UNCACHE_WITH_CORRUPT,
  uncacheWorkaround: UNCACHE_WITH_WORKAROUND,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds verbatim: CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request" },
  { t: "fffd-spall", line: "불 (UTF-8 EB B6 88) at char index 3615 becomes three U+FFFD; offsets 7,982 / 7,665 — not a 4/8/16 KiB boundary" },
  { t: "cache-miss", line: "sid 8fdae59a vs 600ce64a; corrupted prefix is a full prompt-cache miss" },
  { t: "path", line: "fffd-spall — tofu tiles in the chase; hangul-kept sorts stay on the verbatim forme" },
  { t: "score", line: "when the chase sheds geta-tofu the booth is mojibake — Score mojibake or admit verbatim." },
]);

/**
 * Chase map: hangul-kept sorts vs tofu-tile spall.
 * Idle/verbatim: Hangul stays in the chase; cache prefix stable.
 * Seeded/mojibaked: three U+FFFD replace 불; cache miss.
 */
export function mapChase(input = {}) {
  const spalled =
    input.mojibaked === true ||
    input.fffdSpall === true ||
    input.cacheMiss === true ||
    input.corruptedVariant === true;
  const verbatim = input.verbatim === true && !spalled;
  return {
    stamp: spalled ? "fffd-spall" : "verbatim-chase",
    sortLane: spalled ? "tofu" : "hangul-kept",
    proofLane: verbatim || !spalled ? "foul-proof" : "geta",
    cacheLane: spalled ? "miss" : "hit",
    seal: spalled ? "mojibaked" : "verbatim",
  };
}

export function inspectSpall(input = {}) {
  const spall = input.spall || {};
  const hit =
    input.fffdSpall === true ||
    input.mojibaked === true ||
    input.corruptedVariant === true ||
    spall.replacements === 3;
  if (input.verbatim === true && !hit) {
    return {
      stamp: "hangul-kept",
      charIndex: CHAR_INDEX,
      replacements: 0,
      hangul: HANGUL,
    };
  }
  if (hit) {
    return {
      stamp: "fffd-spall",
      charIndex: spall.charIndex || CHAR_INDEX,
      replacements: 3,
      hangul: "���",
      utf8Block: UTF8_OFFSET_BLOCK,
      utf8File: UTF8_OFFSET_FILE,
      kibBoundary: false,
    };
  }
  return {
    stamp: "spall-idle",
    charIndex: CHAR_INDEX,
    replacements: 0,
  };
}

export function inspectCache(input = {}) {
  const cache = input.cache || {};
  const miss =
    input.cacheMiss === true ||
    input.mojibaked === true ||
    cache.corruptSid === CORRUPT_SID;
  if (input.verbatim === true && input.cacheMiss !== true) {
    return {
      stamp: "cache-hit",
      sid: CLEAN_SID,
      miss: false,
    };
  }
  return {
    stamp: miss ? "cache-miss" : "cache-idle",
    sid: miss ? CORRUPT_SID : CLEAN_SID,
    miss,
    withCorrupt: CACHE_WITH_CORRUPT,
    withWorkaround: CACHE_WITH_WORKAROUND,
  };
}

export function inspectHangul(input = {}) {
  const hangul = input.hangul || {};
  const kept =
    input.verbatim === true ||
    input.hangulKept === true ||
    hangul.kept === true;
  const spalled =
    input.mojibaked === true ||
    input.fffdSpall === true ||
    hangul.kept === false;
  if (kept && !spalled) {
    return {
      stamp: "hangul-불",
      glyph: HANGUL,
      utf8: HANGUL_UTF8,
      kept: true,
    };
  }
  return {
    stamp: spalled ? "hangul-tofu" : "hangul-idle",
    glyph: spalled ? "���" : HANGUL,
    utf8: spalled ? "EF BF BD × 3" : HANGUL_UTF8,
    kept: !spalled,
  };
}

export function inspectPrefix(input = {}) {
  const stable =
    input.verbatim === true &&
    input.mojibaked !== true &&
    input.fffdSpall !== true;
  return {
    stamp: stable ? "prefix-stable" : input.mojibaked || input.fffdSpall ? "prefix-changed" : "prefix-idle",
    stable,
    cleanSid: CLEAN_SID,
    corruptSid: CORRUPT_SID,
  };
}

export function readBooth(input = {}) {
  const spalled =
    input.mojibaked === true ||
    input.fffdSpall === true ||
    input.cacheMiss === true ||
    input.corruptedVariant === true;
  const verbatim = input.verbatim === true && !spalled;
  return {
    mark: spalled ? "mojibaked" : verbatim || !spalled ? "verbatim" : "mojibaked",
    verbatim,
    mojibaked: spalled,
    fffdSpall: input.fffdSpall === true || spalled,
    cacheMiss: input.cacheMiss === true,
    hangulKept: input.hangulKept === true,
    chase: mapChase(input),
    spall: inspectSpall(input),
    cache: inspectCache(input),
    hangul: inspectHangul(input),
    prefix: inspectPrefix(input),
    log: input.log || [],
  };
}

export const MOJIBAKE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-verbatim",
    verbatim: true,
    mojibaked: false,
    cue: "verbatim",
    note: "idle HOLD: CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request — the hold/good path",
  },
  {
    t: "fffd-spall",
    event: "fffd-spall",
    mojibaked: true,
    fffdSpall: true,
    cue: "mojibaked",
    note: "불 (UTF-8 EB B6 88) at char index 3615 becomes three U+FFFD; offsets 7,982 / 7,665 — not a 4/8/16 KiB boundary",
  },
  {
    t: "cache-miss",
    event: "cache-miss",
    mojibaked: true,
    cacheMiss: true,
    cue: "mojibaked",
    note: "sid 8fdae59a vs 600ce64a; corrupted prefix is a full prompt-cache miss",
  },
  {
    t: "path",
    event: "fffd-spall",
    mojibaked: true,
    fffdSpall: true,
    cacheMiss: true,
    cue: "mojibaked",
    note: "fffd-spall — tofu tiles in the chase; hangul-kept sorts stay on the verbatim forme",
  },
  {
    t: "score",
    event: "mojibake",
    mojibaked: true,
    fffdSpall: true,
    cacheMiss: true,
    corruptedVariant: true,
    cue: "mojibaked",
    note: "mojibake — when the chase sheds geta-tofu the booth is mojibake",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-verbatim",
    verbatim: true,
    mojibaked: false,
    cue: "verbatim",
    note: "positive control: CLAUDE.md UTF-8 reaches the API intact; prefix stable",
  },
  {
    t: "announce",
    event: "cue-verbatim",
    verbatim: true,
    cue: "verbatim",
    note: "positive control: the chase stays verbatim",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    verbatim: true,
    mojibaked: false,
    fffdSpall: false,
    cue: "verbatim",
  };
}

export function seedVerbatim() {
  return { ...emptyTicket() };
}

export function seedMojibaked() {
  return {
    seed: SEEDED_WORD,
    verbatim: false,
    mojibaked: true,
    fffdSpall: true,
    cacheMiss: true,
    corruptedVariant: true,
    hangulSpall: true,
    cue: "mojibaked",
    issue: FEATURED_ISSUE,
    spall: SAMPLE_SPALL,
    cache: SAMPLE_CACHE,
    hangul: { kept: false },
    proof: SAMPLE_MOJIBAKED_PROOF,
  };
}

export function seedMojibake() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    mojibaked: true,
    fffdSpall: true,
    cacheMiss: true,
    cue: "mojibaked",
  };
}

export function seedFffdSpall() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    mojibaked: true,
    fffdSpall: true,
    cacheMiss: true,
    event: "fffd-spall",
    cue: "mojibaked",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedCacheMiss() {
  return {
    seed: "cache-miss",
    preferSeed: true,
    cacheMiss: true,
    cue: "mojibaked",
  };
}

export function seedCorruptedVariant() {
  return {
    seed: "corrupted-variant",
    preferSeed: true,
    corruptedVariant: true,
    cue: "mojibaked",
  };
}

export function seedCleanVariant() {
  return {
    seed: "clean-variant",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedIntactUtf8() {
  return {
    seed: "intact-utf8",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedCacheHit() {
  return {
    seed: "cache-hit",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedPrefixStable() {
  return {
    seed: "prefix-stable",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedHangulKept() {
  return {
    seed: "hangul-kept",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedHangulBul() {
  return {
    seed: "hangul-불",
    preferSeed: true,
    hangulKept: true,
    cue: "verbatim",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      verbatim: false,
      mojibaked: false,
      fffdSpall: false,
      cacheMiss: false,
      hangulKept: false,
      corruptedVariant: false,
      cleanVariant: false,
      hangulSpall: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    verbatim: raw.verbatim === true,
    mojibaked:
      raw.mojibaked === true ||
      raw.event === "mojibaked" ||
      raw.event === "mojibake",
    fffdSpall: raw.fffdSpall === true || raw.event === "fffd-spall",
    cacheMiss: raw.cacheMiss === true || raw.event === "cache-miss",
    hangulKept: raw.hangulKept === true || raw.event === "hangul-불",
    corruptedVariant:
      raw.corruptedVariant === true || raw.event === "corrupted-variant",
    cleanVariant: raw.cleanVariant === true || raw.event === "clean-variant",
    hangulSpall: raw.hangulSpall === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    spall: raw.spall,
    cache: raw.cache,
    hangul: raw.hangul,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.verbatim != null ||
        ticket.mojibaked != null ||
        ticket.fffdSpall != null ||
        ticket.cacheMiss != null ||
        ticket.hangulKept != null ||
        ticket.corruptedVariant != null ||
        ticket.cleanVariant != null ||
        ticket.hangulSpall != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.spall ||
        ticket.cache ||
        ticket.hangul),
  );
}

function isVerbatim(row) {
  if (row.mojibaked && row.cue !== "verbatim") return false;
  if (
    row.cue === "mojibaked" ||
    row.cue === "mojibake" ||
    row.cue === "fffd-spall"
  ) {
    return false;
  }
  if (
    row.fffdSpall &&
    row.cacheMiss &&
    row.cue !== "verbatim" &&
    row.verbatim !== true
  ) {
    return false;
  }
  if (
    row.fffdSpall &&
    row.corruptedVariant &&
    row.cue !== "verbatim" &&
    row.verbatim !== true
  ) {
    return false;
  }
  if (row.verbatim === true && row.mojibaked !== true && row.cue !== "mojibaked") {
    return true;
  }
  if (
    row.cue === "verbatim" &&
    row.mojibaked !== true &&
    row.fffdSpall !== true &&
    row.cacheMiss !== true &&
    row.corruptedVariant !== true
  ) {
    return true;
  }
  return false;
}

function isFffdSpallPath(row) {
  return (
    row.event === "fffd-spall" &&
    !isVerbatim(row) &&
    (row.fffdSpall === true ||
      row.cacheMiss === true ||
      row.corruptedVariant === true)
  );
}

function isMojibaked(row) {
  if (isVerbatim(row)) return false;
  if (isFffdSpallPath(row) && row.cue !== "mojibaked") return false;
  if (row.cue === "mojibaked" || row.cue === "mojibake") return true;
  if (row.mojibaked === true) return true;
  if (
    row.fffdSpall === true &&
    row.cacheMiss === true &&
    row.corruptedVariant === true
  ) {
    return true;
  }
  if (row.fffdSpall === true && row.cacheMiss === true) {
    return true;
  }
  if (
    row.fffdSpall === true ||
    row.cacheMiss === true ||
    row.corruptedVariant === true ||
    (row.fffdSpall === true && row.hangulSpall === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one mojibake pass against the compositor chase.
 * verbatim: CLAUDE.md UTF-8 reaches the API intact; prefix stable.
 * mojibaked / mojibake: one Hangul codepoint → three U+FFFD.
 * fffd-spall: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isFffdSpallPath(row) ||
    (row.fffdSpall && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "fffd-spall";
  } else if (isMojibaked(row)) {
    verdict = "mojibake";
  } else if (isVerbatim(row)) {
    verdict = "verbatim";
  } else if (
    row.fffdSpall ||
    row.cacheMiss ||
    row.corruptedVariant ||
    (row.hangulSpall && !row.verbatim)
  ) {
    verdict = "mojibake";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const spall = inspectSpall(row);
  const cache = inspectCache(row);
  const hangul = inspectHangul(row);
  const prefix = inspectPrefix(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    verbatim: verdict === "verbatim" || verdict === "hold",
    mojibaked:
      verdict === "mojibaked" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    fffdSpall:
      row.fffdSpall === true ||
      verdict === "fffd-spall" ||
      verdict === PATH_WORD,
    cacheMiss: row.cacheMiss,
    hangulKept: row.hangulKept,
    corruptedVariant: row.corruptedVariant,
    cleanVariant: row.cleanVariant,
    hangulSpall: row.hangulSpall,
    cue: hold
      ? "verbatim"
      : row.fffdSpall || verdict === "fffd-spall"
        ? "fffd-spall"
        : "mojibaked",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit verbatim" : "score mojibake",
    spallInspect: spall,
    cacheInspect: cache,
    hangulInspect: hangul,
    prefixInspect: prefix,
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
      : MOJIBAKE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "mojibake" || row.verdict === "mojibaked",
  );
  const path = scored.filter((row) => row.verdict === "fffd-spall");
  const verbatim = scored.filter((row) => row.verdict === "verbatim");
  const headline =
    scored.find((row) => row.event === "mojibaked") ||
    scored.find((row) => row.event === "fffd-spall") ||
    scored.find((row) => row.event === "cache-miss") ||
    dead[dead.length - 1];
  let verdict = "verbatim";
  if (dead.length) verdict = "mojibake";
  else if (path.length && !verbatim.length) verdict = "fffd-spall";
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
    mojibakedCount: dead.length,
    pathCount: path.length,
    verbatimCount: verbatim.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit verbatim" : "score mojibake",
    note: headline
      ? "embedded CLAUDE.md UTF-8 codepoint → three U+FFFD at char index 3615; prompt-cache prefix changes; cousins #40396 and #88836 are cite-only."
      : "published mojibake walk scored against verbatim vs mojibaked",
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
    seeded !== "verbatim" &&
    seeded !== "mojibaked" &&
    seeded !== "fffd-spall" &&
    seeded !== "mojibake" &&
    ticket.verbatim == null &&
    ticket.mojibaked == null &&
    ticket.fffdSpall == null &&
    ticket.cacheMiss == null &&
    ticket.corruptedVariant == null &&
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
    verbatim: scored.verbatim ?? false,
    mojibaked: scored.mojibaked ?? false,
    fffdSpall: scored.fffdSpall ?? false,
    cacheMiss: scored.cacheMiss ?? false,
    hangulKept: scored.hangulKept ?? false,
    corruptedVariant: scored.corruptedVariant ?? false,
    cleanVariant: scored.cleanVariant ?? false,
    hangulSpall: scored.hangulSpall ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.fffdSpall || result.mojibaked ? "hangul=fffd" : "hangul=kept",
    result.cacheMiss || result.mojibaked ? "cache=miss" : "cache=hit",
    result.fffdSpall || result.verdict === "fffd-spall"
      ? "path=fffd-spall"
      : "path=verbatim",
    result.cue === "verbatim"
      ? "cue=verbatim"
      : result.cue === "fffd-spall"
        ? "cue=fffd-spall"
        : "cue=mojibaked",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    verbatim: result.verbatim,
    mojibaked: result.mojibaked,
    fffdSpall: result.fffdSpall,
    cacheMiss: result.cacheMiss,
    hangulKept: result.hangulKept,
    corruptedVariant: result.corruptedVariant,
    cleanVariant: result.cleanVariant,
    hangulSpall: result.hangulSpall,
    spall: input && input.spall,
    cache: input && input.cache,
    hangul: input && input.hangul,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    spall: inspectSpall({
      verbatim: result.verbatim,
      mojibaked: result.mojibaked,
      fffdSpall: result.fffdSpall,
      corruptedVariant: result.corruptedVariant,
      spall: input && input.spall,
    }),
    cache: inspectCache({
      verbatim: result.verbatim,
      mojibaked: result.mojibaked,
      cacheMiss: result.cacheMiss,
      cache: input && input.cache,
    }),
    hangul: inspectHangul({
      verbatim: result.verbatim,
      mojibaked: result.mojibaked,
      fffdSpall: result.fffdSpall,
      hangulKept: result.hangulKept,
      hangul: input && input.hangul,
    }),
    prefix: inspectPrefix({
      verbatim: result.verbatim,
      mojibaked: result.mojibaked,
      fffdSpall: result.fffdSpall,
    }),
    chase: mapChase({
      verbatim: result.verbatim,
      mojibaked: result.mojibaked,
      fffdSpall: result.fffdSpall,
      cacheMiss: result.cacheMiss,
      corruptedVariant: result.corruptedVariant,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      mojibaked:
        result.mojibaked === true ||
        result.verdict === "mojibaked" ||
        result.verdict === "mojibake",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      powershell: POWERSHELL,
      build: BUILD,
      claudeMdPath: CLAUDE_MD_PATH,
      fileBytes: FILE_BYTES,
      fileEncoding: FILE_ENCODING,
      fileProse: FILE_PROSE,
      fileDecodeOk: FILE_DECODE_OK,
      sessionForm: SESSION_FORM,
      proxy: PROXY,
      charIndex: CHAR_INDEX,
      blockChars: BLOCK_CHARS,
      utf8OffsetBlock: UTF8_OFFSET_BLOCK,
      utf8OffsetFile: UTF8_OFFSET_FILE,
      hangul: HANGUL,
      hangulUtf8: HANGUL_UTF8,
      replacement: REPLACEMENT,
      cleanSnippet: CLEAN_SNIPPET,
      corruptSnippet: CORRUPT_SNIPPET,
      difflibOpcode: DIFFLIB_OPCODE,
      cleanSid: CLEAN_SID,
      corruptSid: CORRUPT_SID,
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: an encoding-boundary or Windows wchar round-trip on the embed path may substitute three U+FFFD for one Hangul syllable (불, UTF-8 EB B6 88) at a fixed chase cell that is not a 4/8/16 KiB boundary. The reporter could not find the pattern that decides which request is corrupted. Invite verify against #93848 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
