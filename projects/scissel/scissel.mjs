#!/usr/bin/env node
/**
 * Scissel — mint / coin-press / punch-and-scissel booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * On Windows the Bash tool transports the whole command through argv
 * to MSYS2 `bash -c`. Two failures:
 * 1. Commands over ~8,203 chars are silently truncated; bash reports a
 *    bogus syntax error pointing at an apostrophe mid-payload
 *    (`unexpected EOF while looking for matching '\''`). Line number
 *    is constant across sizes → fixed-offset cut. 30/31 failing
 *    commands pass `bash -n` when re-fed intact.
 * 2. Doubled backslashes (`\\`) silently collapse to a single `\` at
 *    ANY size (reproduced at 295 bytes). No error. Files written
 *    wrong (e.g. Python `r'\\d+'` becomes `r'\d+'`).
 *
 * Both disappear when the identical command is passed on bash stdin
 * (`bash -s`) instead of `-c` (byte-identical up to 259 KB).
 *
 *   node scissel.mjs data/scisselled.json
 *   echo '{"seed":"scisselled"}' | node scissel.mjs
 *
 * Idle word is plenary (HOLD: full command arrives via stdin /
 * non-argv path; heredocs and `\\` survive).
 * Seeded word is scisselled (#93915 — argv `-c` path truncates at
 * ~8203 and/or collapses `\\`).
 * Path word is argv-trunc.
 * Product score word is scissel (Score scissel or admit plenary.).
 *
 * Encoded from anthropics/claude-code#93915 issue text only.
 * Symptom 1 root cause is documented in msys2-runtime#178
 * (build_argv / glob 8192-character stack buffer). Symptom 2 is
 * measured; the argv-escaping hypothesis is reporter inference —
 * treat as unconfirmed. Do NOT implement a fix in Claude Code.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "hold",
  "bash-s",
  "stdin-full",
  "slash-kept",
  "trunc-8203",
  "stack-8192",
  "slash-collapse",
  "winerror-206",
  "eval-wrapper",
  "quote-expand",
  "bash-c",
  "msys-glob",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "plenary";
export const PATH_WORD = "argv-trunc";
export const SEEDED_WORD = "scisselled";
export const PRODUCT_WORD = "scissel";
export const HOLD = Object.freeze(["plenary", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "plenary",
  "bash-s",
  "stdin-full",
  "slash-kept",
]);
export const RECOVER = Object.freeze(["plenary", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  FORBIDDEN_IDLE.filter((name) => name !== "scisselled" && name !== "scissel"),
);

export const FEATURED_ISSUE = 93915;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93915";
export const TITLE =
  "[BUG] Windows: Bash commands >8KB silently truncated, backslash pairs silently collapsed (argv transport to MSYS2 bash)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:bash",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "Claude Code Bash tool (Windows argv → MSYS2 bash -c)";
export const GOOD_VERSION =
  "full command arrives via bash stdin (bash -s) or temp file; heredocs and doubled backslashes survive; byte-identical up to 259 KB";
export const SURFACE = "bash-c-argv";
export const HOST = "Windows 11 Pro 10.0.26200";
export const GIT_BASH = "5.3.15(1)-release";
export const MSYS_RUNTIME = "MINGW64_NT-10.0-26200 3.6.9";
export const PROCESS_CHAIN = "claude.exe → bash.exe";
export const CMD_INVOLVED = false;
export const BASH_C_LIMIT = 8203;
export const STACK_BUFFER = 8192;
export const SLASH_COLLAPSE_BYTES = 295;
export const STDIN_CONTROL_BYTES = 259000;
export const WINERROR_206 = 206;
export const ECHO_INTACT = 20000;
export const PYTHON_INTACT = 32000;
export const CREATEPROCESS_DOC = 32767;
export const WRAPPER_OVERHEAD = 1024;
export const QUOTE_EXPAND = 5;
export const NOGLOB_LIMIT = 32731;
export const BASH_N_PASS = "30/31";
export const SYNTAX_ERROR =
  "unexpected EOF while looking for matching `''";
export const PHRASE = "Score scissel or admit plenary.";
export const DISTRIBUTION =
  "On Windows the Bash tool transports the whole command through argv to MSYS2 bash -c. Commands over ~8,203 chars are silently truncated; bash reports a bogus syntax error pointing at an apostrophe mid-payload (unexpected EOF while looking for matching '\\''). Line number is constant across sizes → fixed-offset cut. 30/31 failing commands pass bash -n when re-fed intact. Doubled backslashes (\\\\) silently collapse to a single \\ at ANY size (reproduced at 295 bytes). No error. Files written wrong (e.g. Python r'\\\\d+' becomes r'\\d+'). Both disappear when the identical command is passed on bash stdin (bash -s) instead of -c (byte-identical up to 259 KB). Process chain claude.exe → bash.exe — no cmd.exe, so the classic 8191 cmd limit is NOT the explanation. Measured: bash.exe -c 8,203; MSYS echo.exe 20,000 intact; native python.exe 32,000; Windows CreateProcess 32,767 documented. Symptom 1 documented: msys2-runtime build_argv() / glob() uses a fixed 8192-character stack buffer during Unicode conversion of the pattern (msys2/msys2-runtime#178). Trigger set includes ?*[\"'(){} so ordinary quoted one-liners hit it. Symptom 2 measured; argv-escaping cause is reporter inference — unconfirmed. Claude wraps roughly bash -c \"source … && eval '<USER COMMAND>' && pwd -P …\" (~1 KB wrapper) and every ' expands to 5 chars ('\"'\"'), so practical failures start ~8 KB of user command. MSYS=noglob raises the limit to 32731 but breaks quote reconstruction with the eval wrapper. Chunking fixes trunc not backslash. Base64 makes argv larger. Cousins cite-only: openai/codex#15003 (same argv class / WinError 206); msys2/msys2-runtime#178; zetaloop/msys2-argv-fix.";
export const RULED_OUT = Object.freeze([
  "Classic 8191-character cmd.exe limit — process chain is claude.exe → bash.exe; no cmd.exe involved",
  "A bug in bash itself — bash is OS-agnostic; 30/31 truncated payloads pass bash -n when re-fed intact",
  "A Windows CreateProcess ceiling — documented 32,767; native python.exe received 32,000 intact; MSYS echo.exe received 20,000",
  "A content-dependent syntax error — reported line number is constant across sizes from 8 KB through 24 KB (fixed-offset cut)",
  "MSYS=noglob as a fix — raises -c limit to 32731 but breaks quote reconstruction with the eval wrapper",
  "Chunking the payload as a complete fix — addresses truncation only; backslash collapse reproduces at 295 bytes",
  "Base64-encoding the payload — still argv, now ~33% larger",
]);
export const EXPECTED = Object.freeze([
  "Pass the command on bash stdin (bash -s) instead of as the -c argument so the payload never traverses argv",
  "Or write the command to a temp file and run bash <file>",
  "Heredocs and doubled backslashes (\\\\) survive; output byte-identical up to 259 KB",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "trunc-8203", label: "trunc 8203", count: "8,203", note: "bash.exe -c (Git for Windows) silently cuts at 8,203 chars" },
  { id: "stack-8192", label: "stack 8192", count: "8,192", note: "msys2-runtime glob() fixed 8192-character stack buffer (msys2-runtime#178)" },
  { id: "slash-collapse", label: "slash collapse", count: "295 B", note: "\\\\ silently becomes \\ at any size; reproduced at 295 bytes" },
  { id: "bash-s", label: "bash -s", count: "259 KB", note: "stdin positive control: byte-identical up to 259 KB" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "plenary-hopper",
    survey: "full command arrives via bash stdin (bash -s) or temp file; heredocs and \\\\ survive",
    kind: "plenary",
    note: "idle: the mint hopper feeds the planchet without an argv punch — the hold/good path",
  },
  {
    id: "trunc-8203",
    survey: "bash.exe -c silently truncates at 8,203 chars; bogus unexpected EOF at a mid-payload apostrophe",
    kind: "scisselled",
    note: "seeded: the die clips the planchet at a fixed offset",
  },
  {
    id: "stack-8192",
    survey: "msys2-runtime build_argv() / glob() uses a fixed 8192-character stack buffer during Unicode conversion",
    kind: "scisselled",
    note: "seeded: documented mechanism for symptom 1 (msys2-runtime#178)",
  },
  {
    id: "slash-collapse",
    survey: "doubled backslashes collapse at ANY size (295 B); Python r'\\\\d+' becomes r'\\d+'",
    kind: "scisselled",
    note: "seeded: measured; argv-escaping cause is unconfirmed inference",
  },
  {
    id: "argv-trunc",
    survey: "argv -c transport punches the command; bash -s hopper leaves it plenary",
    kind: "scisselled",
    note: "path: argv-trunc names the argv -c punch vs stdin hopper",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "argv-trunc",
  "scisselled",
  "trunc-8203",
  "stack-8192",
  "slash-collapse",
  "winerror-206",
]);

export const COUSINS = Object.freeze([
  {
    issue: 15003,
    repo: "openai/codex",
    title: "same argv class / WinError 206 — complete failure before execution, not a partial cut",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — same argv class / WinError 206 in another tool; do not rebuild as a separate booth",
  },
  {
    issue: 178,
    repo: "msys2/msys2-runtime",
    title: "build_argv() / glob() 8192-character stack buffer during Unicode conversion of the pattern",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — documented mechanism for symptom 1; do not rebuild as a separate booth",
  },
  {
    issue: "msys2-argv-fix",
    repo: "zetaloop/msys2-argv-fix",
    title: "independent description plus LD_PRELOAD workaround that rebuilds argv from GetCommandLineW",
    state: "cite-only",
    citeOnly: true,
    why: "cite only — workaround description; do not rebuild as a separate booth",
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
  { issue: 93848, title: "backup #93848", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export const SAMPLE_PLENARY_BLANK = Object.freeze({
  transport: "bash-s",
  argvC: false,
  truncated: false,
  slashCollapsed: false,
  bytesOut: STDIN_CONTROL_BYTES,
  version: GOOD_VERSION,
});

export const SAMPLE_SCISSELLED_BLANK = Object.freeze({
  transport: "bash-c",
  argvC: true,
  truncated: true,
  slashCollapsed: true,
  cutAt: BASH_C_LIMIT,
  stackBuffer: STACK_BUFFER,
  slashAt: SLASH_COLLAPSE_BYTES,
  version: HOST,
});

export const SAMPLE_TRUNC = Object.freeze({
  limit: BASH_C_LIMIT,
  truncated: true,
  syntaxError: SYNTAX_ERROR,
  lineConstant: true,
  bashNPass: BASH_N_PASS,
});

export const SAMPLE_PLENARY_TRUNC = Object.freeze({
  limit: BASH_C_LIMIT,
  truncated: false,
  syntaxError: "",
  lineConstant: false,
  bashNPass: "n/a",
});

export const SAMPLE_STACK = Object.freeze({
  buffer: STACK_BUFFER,
  routine: "build_argv() / glob()",
  source: "msys2/msys2-runtime#178",
  trigger: "?*[\"'(){}",
});

export const SAMPLE_SLASH = Object.freeze({
  bytes: SLASH_COLLAPSE_BYTES,
  collapsed: true,
  example: "r'\\\\d+' → r'\\d+'",
  isolatedSurvives: true,
  hypothesis: "unconfirmed — Windows escaping in argv rebuild",
});

export const SAMPLE_PLENARY_SLASH = Object.freeze({
  bytes: SLASH_COLLAPSE_BYTES,
  collapsed: false,
  example: "r'\\\\d+' stays r'\\\\d+'",
  isolatedSurvives: true,
});

export const SAMPLE_STDIN = Object.freeze({
  mode: "bash-s",
  identicalTo: STDIN_CONTROL_BYTES,
  winerror: false,
});

export const SAMPLE_WRAPPER = Object.freeze({
  form: "bash -c \"source … && eval '<USER COMMAND>' && pwd -P …\"",
  overhead: WRAPPER_OVERHEAD,
  quoteExpand: QUOTE_EXPAND,
  escape: "'\"'\"'",
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds plenary: full command arrives via bash stdin; heredocs and \\\\ survive" },
  { t: "trunc-8203", line: "bash.exe -c silently cuts at 8,203 chars; unexpected EOF at a mid-payload apostrophe" },
  { t: "stack-8192", line: "msys2-runtime glob() 8192-character stack buffer (msys2-runtime#178)" },
  { t: "slash-collapse", line: "\\\\ collapses at 295 B; r'\\\\d+' becomes r'\\d+'" },
  { t: "path", line: "argv-trunc — argv -c punch clips the planchet; bash -s hopper stays plenary" },
  { t: "score", line: "when the argv punch clips or collapses the blank the booth is scissel — Score scissel or admit plenary." },
]);

/**
 * Press map: argv -c die punch vs bash -s hopper.
 * Idle/plenary: hopper feeds the planchet; no clip, no slash collapse.
 * Seeded/scisselled: die punches at 8203 / collapses \\\\ at 295 B.
 */
export function mapPress(input = {}) {
  const punched =
    input.scisselled === true ||
    input.trunc8203 === true ||
    input.slashCollapse === true ||
    input.argvTrunc === true;
  const plenary = input.plenary === true && !punched;
  return {
    stamp: punched ? "argv-trunc" : "plenary-hopper",
    dieLane: punched ? "punched" : "idle",
    hopperLane: plenary || !punched ? "open" : "bypassed",
    scrap: punched ? "scissel" : "none",
    seal: punched ? "scisselled" : "plenary",
  };
}

export function inspectTrunc(input = {}) {
  const trunc = input.trunc || {};
  const punched =
    input.trunc8203 === true ||
    trunc.truncated === true ||
    input.scisselled === true;
  if (input.plenary === true && !punched) {
    return {
      stamp: "trunc-ok",
      limit: BASH_C_LIMIT,
      truncated: false,
      syntaxError: "",
    };
  }
  if (punched) {
    return {
      stamp: "trunc-8203",
      limit: trunc.limit || BASH_C_LIMIT,
      truncated: true,
      syntaxError: trunc.syntaxError || SYNTAX_ERROR,
      lineConstant: trunc.lineConstant !== false,
      bashNPass: trunc.bashNPass || BASH_N_PASS,
    };
  }
  return {
    stamp: "trunc-idle",
    limit: BASH_C_LIMIT,
    truncated: false,
  };
}

export function inspectStack(input = {}) {
  const stack = input.stack || {};
  const hit =
    input.stack8192 === true ||
    input.scisselled === true ||
    stack.buffer === STACK_BUFFER;
  return {
    stamp: hit ? "stack-8192" : "stack-idle",
    buffer: stack.buffer || STACK_BUFFER,
    routine: stack.routine || "build_argv() / glob()",
    source: stack.source || "msys2/msys2-runtime#178",
  };
}

export function inspectSlash(input = {}) {
  const slash = input.slash || {};
  const collapsed =
    input.slashCollapse === true ||
    slash.collapsed === true ||
    (input.scisselled === true && input.plenary !== true);
  if (input.plenary === true && input.slashCollapse !== true) {
    return {
      stamp: "slash-kept",
      bytes: SLASH_COLLAPSE_BYTES,
      collapsed: false,
    };
  }
  return {
    stamp: collapsed ? "slash-collapse" : "slash-idle",
    bytes: slash.bytes || SLASH_COLLAPSE_BYTES,
    collapsed,
    example: slash.example || (collapsed ? "r'\\\\d+' → r'\\d+'" : ""),
    hypothesis: "unconfirmed — Windows escaping in argv rebuild",
  };
}

export function inspectStdin(input = {}) {
  const stdin = input.stdin || {};
  const viaStdin =
    input.bashS === true ||
    stdin.mode === "bash-s" ||
    (input.plenary === true && input.argvC !== true);
  return {
    stamp: viaStdin ? "bash-s" : "argv-c",
    mode: viaStdin ? "bash-s" : "bash-c",
    identicalTo: STDIN_CONTROL_BYTES,
    winerror: viaStdin ? false : input.winerror206 === true,
  };
}

export function inspectWrapper(input = {}) {
  const wrap = input.wrapper || SAMPLE_WRAPPER;
  return {
    stamp: input.evalWrapper === true || input.scisselled === true ? "eval-wrapper" : "wrapper-idle",
    form: wrap.form || SAMPLE_WRAPPER.form,
    overhead: wrap.overhead || WRAPPER_OVERHEAD,
    quoteExpand: wrap.quoteExpand || QUOTE_EXPAND,
  };
}

export function readBooth(input = {}) {
  const punched =
    input.scisselled === true ||
    input.trunc8203 === true ||
    input.slashCollapse === true ||
    input.argvTrunc === true;
  const plenary = input.plenary === true && !punched;
  return {
    mark: punched ? "scisselled" : plenary || !punched ? "plenary" : "scisselled",
    plenary,
    scisselled: punched,
    argvTrunc: input.argvTrunc === true || punched,
    trunc8203: input.trunc8203 === true,
    stack8192: input.stack8192 === true,
    slashCollapse: input.slashCollapse === true,
    press: mapPress(input),
    trunc: inspectTrunc(input),
    stack: inspectStack(input),
    slash: inspectSlash(input),
    stdin: inspectStdin(input),
    wrapper: inspectWrapper(input),
    log: input.log || [],
  };
}

export const SCISSEL_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-plenary",
    plenary: true,
    scisselled: false,
    cue: "plenary",
    note: "idle HOLD: full command arrives via bash stdin; heredocs and \\\\ survive — the hold/good path",
  },
  {
    t: "trunc-8203",
    event: "trunc-8203",
    scisselled: true,
    trunc8203: true,
    cue: "scisselled",
    note: "bash.exe -c silently cuts at 8,203 chars; unexpected EOF at a mid-payload apostrophe",
  },
  {
    t: "stack-8192",
    event: "stack-8192",
    scisselled: true,
    stack8192: true,
    cue: "scisselled",
    note: "msys2-runtime glob() 8192-character stack buffer (msys2-runtime#178)",
  },
  {
    t: "slash-collapse",
    event: "slash-collapse",
    scisselled: true,
    slashCollapse: true,
    cue: "scisselled",
    note: "\\\\ collapses at 295 B; r'\\\\d+' becomes r'\\d+'",
  },
  {
    t: "path",
    event: "argv-trunc",
    scisselled: true,
    argvTrunc: true,
    trunc8203: true,
    slashCollapse: true,
    cue: "scisselled",
    note: "argv-trunc — argv -c punch clips the planchet; bash -s hopper stays plenary",
  },
  {
    t: "score",
    event: "scissel",
    scisselled: true,
    argvTrunc: true,
    trunc8203: true,
    stack8192: true,
    slashCollapse: true,
    cue: "scisselled",
    note: "scissel — when the argv punch clips or collapses the blank the booth is scissel",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-plenary",
    plenary: true,
    scisselled: false,
    cue: "plenary",
    note: "positive control: bash -s hopper; byte-identical up to 259 KB",
  },
  {
    t: "announce",
    event: "cue-plenary",
    plenary: true,
    cue: "plenary",
    note: "positive control: the planchet stays plenary",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    plenary: true,
    scisselled: false,
    argvTrunc: false,
    cue: "plenary",
  };
}

export function seedPlenary() {
  return { ...emptyTicket() };
}

export function seedScisselled() {
  return {
    seed: SEEDED_WORD,
    plenary: false,
    scisselled: true,
    argvTrunc: true,
    trunc8203: true,
    stack8192: true,
    slashCollapse: true,
    winerror206: true,
    evalWrapper: true,
    quoteExpand: true,
    bashC: true,
    msysGlob: true,
    cue: "scisselled",
    issue: FEATURED_ISSUE,
    trunc: SAMPLE_TRUNC,
    stack: SAMPLE_STACK,
    slash: SAMPLE_SLASH,
    stdin: { mode: "bash-c" },
    wrapper: SAMPLE_WRAPPER,
    blank: SAMPLE_SCISSELLED_BLANK,
  };
}

export function seedScissel() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    scisselled: true,
    argvTrunc: true,
    trunc8203: true,
    slashCollapse: true,
    cue: "scisselled",
  };
}

export function seedArgvTrunc() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scisselled: true,
    argvTrunc: true,
    trunc8203: true,
    slashCollapse: true,
    event: "argv-trunc",
    cue: "scisselled",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    plenary: true,
    cue: "plenary",
  };
}

export function seedTrunc8203() {
  return {
    seed: "trunc-8203",
    preferSeed: true,
    trunc8203: true,
    cue: "scisselled",
  };
}

export function seedStack8192() {
  return {
    seed: "stack-8192",
    preferSeed: true,
    stack8192: true,
    cue: "scisselled",
  };
}

export function seedSlashCollapse() {
  return {
    seed: "slash-collapse",
    preferSeed: true,
    slashCollapse: true,
    cue: "scisselled",
  };
}

export function seedWinerror206() {
  return {
    seed: "winerror-206",
    preferSeed: true,
    winerror206: true,
    cue: "scisselled",
  };
}

export function seedBashS() {
  return {
    seed: "bash-s",
    preferSeed: true,
    plenary: true,
    cue: "plenary",
  };
}

export function seedStdinFull() {
  return {
    seed: "stdin-full",
    preferSeed: true,
    plenary: true,
    cue: "plenary",
  };
}

export function seedSlashKept() {
  return {
    seed: "slash-kept",
    preferSeed: true,
    plenary: true,
    cue: "plenary",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      plenary: false,
      scisselled: false,
      argvTrunc: false,
      trunc8203: false,
      stack8192: false,
      slashCollapse: false,
      winerror206: false,
      evalWrapper: false,
      quoteExpand: false,
      bashC: false,
      msysGlob: false,
      bashS: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    plenary: raw.plenary === true,
    scisselled:
      raw.scisselled === true ||
      raw.event === "scisselled" ||
      raw.event === "scissel",
    argvTrunc: raw.argvTrunc === true || raw.event === "argv-trunc",
    trunc8203: raw.trunc8203 === true || raw.event === "trunc-8203",
    stack8192: raw.stack8192 === true || raw.event === "stack-8192",
    slashCollapse: raw.slashCollapse === true || raw.event === "slash-collapse",
    winerror206: raw.winerror206 === true || raw.event === "winerror-206",
    evalWrapper: raw.evalWrapper === true || raw.event === "eval-wrapper",
    quoteExpand: raw.quoteExpand === true || raw.event === "quote-expand",
    bashC: raw.bashC === true || raw.event === "bash-c",
    msysGlob: raw.msysGlob === true || raw.event === "msys-glob",
    bashS: raw.bashS === true || raw.event === "bash-s",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    trunc: raw.trunc,
    stack: raw.stack,
    slash: raw.slash,
    stdin: raw.stdin,
    wrapper: raw.wrapper,
    blank: raw.blank,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.plenary != null ||
        ticket.scisselled != null ||
        ticket.argvTrunc != null ||
        ticket.trunc8203 != null ||
        ticket.stack8192 != null ||
        ticket.slashCollapse != null ||
        ticket.winerror206 != null ||
        ticket.evalWrapper != null ||
        ticket.quoteExpand != null ||
        ticket.bashC != null ||
        ticket.msysGlob != null ||
        ticket.bashS != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.trunc ||
        ticket.stack ||
        ticket.slash ||
        ticket.stdin),
  );
}

function isPlenary(row) {
  if (row.scisselled && row.cue !== "plenary") return false;
  if (
    row.cue === "scisselled" ||
    row.cue === "scissel" ||
    row.cue === "argv-trunc"
  ) {
    return false;
  }
  if (
    row.argvTrunc &&
    row.trunc8203 &&
    row.cue !== "plenary" &&
    row.plenary !== true
  ) {
    return false;
  }
  if (
    row.argvTrunc &&
    row.slashCollapse &&
    row.cue !== "plenary" &&
    row.plenary !== true
  ) {
    return false;
  }
  if (row.plenary === true && row.scisselled !== true && row.cue !== "scisselled") {
    return true;
  }
  if (
    row.cue === "plenary" &&
    row.scisselled !== true &&
    row.argvTrunc !== true &&
    row.trunc8203 !== true &&
    row.slashCollapse !== true
  ) {
    return true;
  }
  return false;
}

function isArgvTruncPath(row) {
  return (
    row.event === "argv-trunc" &&
    !isPlenary(row) &&
    (row.argvTrunc === true ||
      row.trunc8203 === true ||
      row.slashCollapse === true)
  );
}

function isScisselled(row) {
  if (isPlenary(row)) return false;
  if (isArgvTruncPath(row) && row.cue !== "scisselled") return false;
  if (row.cue === "scisselled" || row.cue === "scissel") return true;
  if (row.scisselled === true) return true;
  if (
    row.argvTrunc === true &&
    row.trunc8203 === true &&
    row.slashCollapse === true
  ) {
    return true;
  }
  if (row.argvTrunc === true && row.trunc8203 === true) {
    return true;
  }
  if (
    row.trunc8203 === true ||
    row.slashCollapse === true ||
    row.stack8192 === true ||
    (row.argvTrunc === true && row.slashCollapse === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one scissel pass against the mint floor.
 * plenary: full command via stdin; heredocs and \\\\ survive.
 * scisselled / scissel: argv -c truncates at ~8203 and/or collapses \\\\.
 * argv-trunc: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isArgvTruncPath(row) ||
    (row.argvTrunc && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "argv-trunc";
  } else if (isScisselled(row)) {
    verdict = "scissel";
  } else if (isPlenary(row)) {
    verdict = "plenary";
  } else if (
    row.argvTrunc ||
    row.trunc8203 ||
    row.slashCollapse ||
    (row.stack8192 && !row.plenary)
  ) {
    verdict = "scissel";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const trunc = inspectTrunc(row);
  const stack = inspectStack(row);
  const slash = inspectSlash(row);
  const stdin = inspectStdin(row);
  const wrapper = inspectWrapper(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    plenary: verdict === "plenary" || verdict === "hold",
    scisselled:
      verdict === "scisselled" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    argvTrunc:
      row.argvTrunc === true ||
      verdict === "argv-trunc" ||
      verdict === PATH_WORD,
    trunc8203: row.trunc8203,
    stack8192: row.stack8192,
    slashCollapse: row.slashCollapse,
    winerror206: row.winerror206,
    evalWrapper: row.evalWrapper,
    quoteExpand: row.quoteExpand,
    bashC: row.bashC,
    msysGlob: row.msysGlob,
    bashS: row.bashS,
    cue: hold
      ? "plenary"
      : row.argvTrunc || verdict === "argv-trunc"
        ? "argv-trunc"
        : "scisselled",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit plenary" : "score scissel",
    truncInspect: trunc,
    stackInspect: stack,
    slashInspect: slash,
    stdinInspect: stdin,
    wrapperInspect: wrapper,
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
      : SCISSEL_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "scissel" || row.verdict === "scisselled",
  );
  const path = scored.filter((row) => row.verdict === "argv-trunc");
  const plenary = scored.filter((row) => row.verdict === "plenary");
  const headline =
    scored.find((row) => row.event === "scisselled") ||
    scored.find((row) => row.event === "argv-trunc") ||
    scored.find((row) => row.event === "trunc-8203") ||
    dead[dead.length - 1];
  let verdict = "plenary";
  if (dead.length) verdict = "scissel";
  else if (path.length && !plenary.length) verdict = "argv-trunc";
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
    scisselledCount: dead.length,
    pathCount: path.length,
    plenaryCount: plenary.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit plenary" : "score scissel",
    note: headline
      ? "argv -c punch clips at ~8203 and/or collapses \\\\ at 295 B; bash -s hopper stays plenary. Cousins openai/codex#15003, msys2-runtime#178, zetaloop/msys2-argv-fix are cite-only."
      : "published scissel walk scored against plenary vs scisselled",
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
    seeded !== "plenary" &&
    seeded !== "scisselled" &&
    seeded !== "argv-trunc" &&
    seeded !== "scissel" &&
    ticket.plenary == null &&
    ticket.scisselled == null &&
    ticket.argvTrunc == null &&
    ticket.trunc8203 == null &&
    ticket.slashCollapse == null &&
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
    plenary: scored.plenary ?? false,
    scisselled: scored.scisselled ?? false,
    argvTrunc: scored.argvTrunc ?? false,
    trunc8203: scored.trunc8203 ?? false,
    stack8192: scored.stack8192 ?? false,
    slashCollapse: scored.slashCollapse ?? false,
    winerror206: scored.winerror206 ?? false,
    evalWrapper: scored.evalWrapper ?? false,
    quoteExpand: scored.quoteExpand ?? false,
    bashC: scored.bashC ?? false,
    msysGlob: scored.msysGlob ?? false,
    bashS: scored.bashS ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.trunc8203 || result.scisselled ? "trunc=8203" : "trunc=ok",
    result.stack8192 || result.scisselled ? "stack=8192" : "stack=idle",
    result.slashCollapse || result.scisselled ? "slash=295" : "slash=kept",
    result.winerror206 || result.scisselled ? "winerror=206" : "winerror=none",
    result.argvTrunc || result.verdict === "argv-trunc"
      ? "path=argv-trunc"
      : "path=plenary",
    result.cue === "plenary"
      ? "cue=plenary"
      : result.cue === "argv-trunc"
        ? "cue=argv-trunc"
        : "cue=scisselled",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    plenary: result.plenary,
    scisselled: result.scisselled,
    argvTrunc: result.argvTrunc,
    trunc8203: result.trunc8203,
    stack8192: result.stack8192,
    slashCollapse: result.slashCollapse,
    winerror206: result.winerror206,
    evalWrapper: result.evalWrapper,
    quoteExpand: result.quoteExpand,
    bashC: result.bashC,
    bashS: result.bashS,
    trunc: input && input.trunc,
    stack: input && input.stack,
    slash: input && input.slash,
    stdin: input && input.stdin,
    wrapper: input && input.wrapper,
    blank: input && input.blank,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    trunc: inspectTrunc({
      plenary: result.plenary,
      scisselled: result.scisselled,
      trunc8203: result.trunc8203,
      trunc: input && input.trunc,
    }),
    stack: inspectStack({
      plenary: result.plenary,
      scisselled: result.scisselled,
      stack8192: result.stack8192,
      stack: input && input.stack,
    }),
    slash: inspectSlash({
      plenary: result.plenary,
      scisselled: result.scisselled,
      slashCollapse: result.slashCollapse,
      slash: input && input.slash,
    }),
    stdin: inspectStdin({
      plenary: result.plenary,
      scisselled: result.scisselled,
      bashS: result.bashS,
      winerror206: result.winerror206,
      stdin: input && input.stdin,
    }),
    wrapper: inspectWrapper({
      plenary: result.plenary,
      scisselled: result.scisselled,
      evalWrapper: result.evalWrapper,
      wrapper: input && input.wrapper,
    }),
    press: mapPress({
      plenary: result.plenary,
      scisselled: result.scisselled,
      trunc8203: result.trunc8203,
      slashCollapse: result.slashCollapse,
      argvTrunc: result.argvTrunc,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      scisselled:
        result.scisselled === true ||
        result.verdict === "scisselled" ||
        result.verdict === "scissel",
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
      gitBash: GIT_BASH,
      msysRuntime: MSYS_RUNTIME,
      processChain: PROCESS_CHAIN,
      cmdInvolved: CMD_INVOLVED,
      bashCLimit: BASH_C_LIMIT,
      stackBuffer: STACK_BUFFER,
      slashCollapseBytes: SLASH_COLLAPSE_BYTES,
      stdinControlBytes: STDIN_CONTROL_BYTES,
      winerror206: WINERROR_206,
      wrapperOverhead: WRAPPER_OVERHEAD,
      quoteExpand: QUOTE_EXPAND,
      syntaxError: SYNTAX_ERROR,
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
        "NON-BINDING: Symptom 1 documented in msys2/msys2-runtime#178 — build_argv() / glob() uses a fixed 8192-character stack buffer during Unicode conversion of the pattern; trigger set includes ?*[\"'(){} so ordinary quoted one-liners hit it. Symptom 2 is measured (\\\\ collapse at 295 B); the reporter's inference that Windows escaping in the argv rebuild is the cause is unconfirmed. Invite verify against #93915 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
