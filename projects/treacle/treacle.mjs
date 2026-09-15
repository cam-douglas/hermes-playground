#!/usr/bin/env node
/**
 * Treacle — Victorian confectionery / copper jam kettle / treacle-well /
 * sticky-ladle / wax-paper twist / enamel kitchen scale / molasses pour booth.
 * Treacle is British dark syrup; a treacle well is a sticky blessing that
 * should ladle briskly. Instead a Windows PowerShell first pour clings
 * ~150s before the kettle tips.
 * Cream / copper / burnt-sugar / brass / treacle-brown.
 * NOT Somnus night-nursery/moon-watch. NOT Cresset night-wall/iron-basket.
 * NOT Dictabelt wax-belt/stenotype. NOT Lemure lararium. NOT Cancellans
 * binder. NOT Arras tapestry. NOT Frangible / Nameplate / Matryoshka /
 * Dragnet.
 *
 * Educational diagnostic model for a published Claude Desktop (Code tab)
 * Windows PowerShell stall: every NEW PowerShell tool call in a session
 * waits ~153–160s (median 154.1s across 1244 calls) from tool_use until
 * the command starts. Bash on the same machine is ~2.7s median.
 * Permission dialog appears only AFTER the wait. Same command repeated
 * verbatim returns in 2–3s (cached). Logs show "Streaming stall
 * detected: 150.0s gap between events" and permissionDecisionMs≈150717.
 * Same as #57960 (closed stale). Present 2.1.220–2.1.270. Before the
 * wait, an EncodedCommand AST parser powershell.exe runs (~1s); then
 * ~150s silence; then the real command. Probe proves the wait is
 * before command start.
 *
 * Encoded from anthropics/claude-code#94344 issue text only.
 * Hypothesis (NON-BINDING — issue text): a Windows PowerShell
 * permission/AST/streaming path stalls ~150s on first unique command
 * shape; Bash path skips it. Invite verify against #94344 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node treacle.mjs data/treacle.json
 *   echo '{"seed":"treacle"}' | node treacle.mjs
 *
 * Idle word is brisk (HOLD: PowerShell should start promptly like Bash).
 * HOLD aliases: snap, ready, instant, bash-fast.
 * Seeded word is treacle (#94344 path).
 * Path word is streaming-stall.
 * Product score word is treacle (Score treacle or admit brisk.).
 *
 * NOT #57960 (same bug, closed stale — cite only, do not rebuild).
 * NOT #94392 (headless -p exits with Tasks still running — DIFFERENT).
 * Cite-only — do NOT rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "brisk",
  "treacle",
  "streaming-stall",
  "snap",
  "ready",
  "instant",
  "bash-fast",
  "ast-parser",
  "first-call",
  "repeat-cached",
  "permission-dialog-late",
  "stall-gap",
  "permission-ms",
  "encoded-command",
  "probe-before-start",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "brisk";
export const PATH_WORD = "streaming-stall";
export const SEEDED_WORD = "treacle";
export const PRODUCT_WORD = "treacle";
export const HOLD = Object.freeze(["brisk"]);
export const HOLD_ALIASES = Object.freeze([
  "snap",
  "ready",
  "instant",
  "bash-fast",
]);
export const RECOVER = Object.freeze(["brisk"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "cadence",
  "released",
  "verbatim",
  "quiet",
  "intact",
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "suspend-ready",
  "cleared",
  "affixed",
  "unpacked",
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "armed",
  "bound",
  "listed",
  "scheduled",
  "muster-ok",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "somnus",
  "continuous",
  "joined",
  "seamless",
  "fluent",
  "batch-ok",
  "rostered",
  "lararium",
  "stilled",
  "removable",
  "mirrored",
  "folio-match",
  "prefix-hot",
  "tools-restored",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "sealed",
  "latched",
  "guarded",
  "executable",
  "bit-set",
  "+x",
  "engraved",
  "plated",
  "labeled",
  "titled",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "device-absent",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "orphan-tick",
  "deferred-delta",
  "hold-leak",
  "segment-drop",
  "device-absent",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94344;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94344";
export const TITLE =
  "[BUG] Desktop app on Windows: every new PowerShell tool call waits ~154 s before the command starts (dialog, permissions and host IPC ruled out); Bash is instant (same as #57960, closed stale; still present on 2.1.270)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tools",
  "area:permissions",
  "area:desktop",
]);
export const PLATFORM = "windows";
export const SURFACE = "streaming-stall";
export const HOST =
  "Claude Desktop (Code tab) Windows Store 1.52386.6.0; Claude Code 2.1.270; Windows 11 Pro 10.0.26200";
export const CHECKED_ON =
  "Published report: every NEW PowerShell tool call waits ~153–160s (median 154.1s / 1244 calls) from tool_use until command start; Bash median 2.7s; permission dialog after the wait; repeats 2–3s; Streaming stall 150.0s; permissionDecisionMs≈150717";
export const BUILD =
  "Claude Code 2.1.270 bundled in Claude Desktop 1.52386.6.0 (Windows Store Claude_1.52386.6.0_x64__pzs8sxrjxfjjc)";
export const SELECTED_MODEL =
  "Windows Desktop PowerShell first-call streaming stall — not a model defect";
export const OS =
  "Windows 11 Pro 10.0.26200; platform:windows / area:tools / area:permissions / area:desktop";
export const PHRASE = "Score treacle or admit brisk.";
export const DISTRIBUTION =
  "On Claude Desktop (Code tab) on Windows, every NEW PowerShell tool call in a session waits ~153–160s (median 154.1s across 1244 calls) from tool_use until the command starts. Bash on the same machine is ~2.7s median (10827 calls). Permission dialog appears only AFTER the wait and is confirmed within seconds. Same command repeated verbatim returns in 2–3s (cached). Logs show \"Streaming stall detected: 150.0s gap between events\" and permissionDecisionMs≈150717. Same as #57960 (closed stale). Present 2.1.220–2.1.270. Before the wait, an EncodedCommand AST parser powershell.exe runs (~1s); then ~150s silence; then the real command. Probe: tool call issued 17:21:54, command started 17:24:30.453 and finished 17:24:30.572 (119 ms) — the entire wait is before command start. 851 of 1244 PowerShell calls (68%) took longer than 60s; those add 37.8 hours over 121 sessions. Env: Windows 11 Pro 10.0.26200; Windows PowerShell 5.1.26100.9444; pwsh not installed; Git Bash works; workspace trust accepted; one PreToolUse hook matcher Bash|PowerShell (timeout 10s) applies to both tools so is not the cause. Reproduces in auto and manual mode, with and without sandbox, with and without permissions.allow rules. Expected: a PowerShell tool call should start within a few seconds, like Bash on the same machine, and any permission dialog should appear immediately rather than after ~150s.";

export const DESKTOP_BUILD = "1.52386.6.0";
export const CODE_BUILD = "2.1.270";
export const POWERSHELL_CALLS = 1244;
export const POWERSHELL_MEDIAN_S = 154.1;
export const POWERSHELL_P90_S = 168.4;
export const BASH_CALLS = 10827;
export const BASH_MEDIAN_S = 2.7;
export const STALL_GAP_S = 150.0;
export const PERMISSION_DECISION_MS = 150717;
export const AST_PARSER_S = 1.07;
export const PROBE_TOOL_USE = "17:21:54";
export const PROBE_CMD_START = "17:24:30.453";
export const PROBE_CMD_END = "17:24:30.572";
export const PROBE_CMD_MS = 119;
export const BUILD_RANGE = "2.1.220–2.1.270";
export const WINDOWS_BUILD = "10.0.26200";
export const POWERSHELL_VERSION = "5.1.26100.9444";

/**
 * Synthetic example-data — reconstructs published timing shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_BRISK = Object.freeze({
  tool: "PowerShell",
  waitMs: 2700,
  dialogAt: "immediate",
  note: "first unique command starts promptly like Bash",
  synthetic: true,
});
export const SYNTHETIC_FIRST_CALL = Object.freeze({
  tool: "PowerShell",
  command: "Get-Date",
  waitS: 153.2,
  dialogAt: "after-wait",
  note: "first unique shape stalls ~154s before start",
  synthetic: true,
});
export const SYNTHETIC_STALL = Object.freeze({
  streamingStallGapS: STALL_GAP_S,
  permissionDecisionMs: PERMISSION_DECISION_MS,
  astParserS: AST_PARSER_S,
  probe: {
    toolUse: PROBE_TOOL_USE,
    commandStart: PROBE_CMD_START,
    commandEnd: PROBE_CMD_END,
    commandMs: PROBE_CMD_MS,
  },
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "copper-kettle",
    lost: "Copper kettle — first unique PowerShell pour should tip in seconds",
    control: "Bash on the same hob is a 2.7s median pour",
    story: "the copper is hot; the ladle will not lift",
  },
  {
    id: "treacle-well",
    lost: "Treacle well — a new command shape sticks ~154s before it blesses",
    control: "The same ladle, second dip, returns in 2–3s",
    story: "the well is full; the first cup is treacle",
  },
  {
    id: "sticky-ladle",
    lost: "Sticky ladle — EncodedCommand AST parser finishes in ~1s, then silence",
    control: "AST parser run manually with Get-Date is valid in 1.07s",
    story: "the ladle drips, then hangs for 150s",
  },
  {
    id: "wax-paper-twist",
    lost: "Wax-paper twist — permission dialog is wrapped only after the wait",
    control: "Dialog should appear immediately, then confirm in seconds",
    story: "the twist is tied after the molasses has already set",
  },
  {
    id: "enamel-scale",
    lost: "Enamel scale — 1244 PowerShell calls median 154.1s; 40.1 hours",
    control: "10827 Bash calls median 2.7s; 16.4 hours",
    story: "the scale reads 15:50 of treacle against a brisk bash",
  },
  {
    id: "molasses-pour",
    lost: "Molasses pour — Streaming stall 150.0s; permissionDecisionMs≈150717",
    control: "Probe: command itself is 119ms; the wait is before start",
    story: "the pour is silent until the kettle finally tips",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "copper-kettle",
    survey: "ordinary brisk: first unique PowerShell starts in a few seconds like Bash",
    kind: "brisk",
    note: "idle/control: PowerShell should start promptly like Bash",
  },
  {
    id: "treacle-well",
    survey: "new command shape waits 153–160s from tool_use until start",
    kind: "treacle",
    note: "seeded: first unique pour is treacle",
  },
  {
    id: "sticky-ladle",
    survey: "EncodedCommand AST parser ~1s then ~150s silence",
    kind: "treacle",
    note: "seeded: AST parser is not the 154s",
  },
  {
    id: "wax-paper-twist",
    survey: "permission dialog appears only after the wait",
    kind: "treacle",
    note: "seeded: late twist, not a slow confirm",
  },
  {
    id: "enamel-scale",
    survey: "median 154.1s across 1244 PowerShell vs 2.7s Bash",
    kind: "treacle",
    note: "seeded: enamel scale names the pour",
  },
  {
    id: "molasses-pour",
    survey: "streaming-stall — 150.0s gap; permissionDecisionMs≈150717",
    kind: "treacle",
    note: "path: streaming-stall names the pour with no brisk ladle",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "ast-parser",
    label: "ast-parser",
    count: "~1s",
    note: "EncodedCommand AST parser powershell.exe runs before the silence",
  },
  {
    id: "first-call",
    label: "first-call",
    count: "153–160s",
    note: "Every NEW PowerShell shape waits until the command starts",
  },
  {
    id: "repeat-cached",
    label: "repeat-cached",
    count: "2–3s",
    note: "Same command repeated verbatim returns in 2–3s",
  },
  {
    id: "bash-fast",
    label: "bash-fast",
    count: "2.7s",
    note: "Bash on the same machine is a 2.7s median",
  },
  {
    id: "permission-dialog-late",
    label: "permission-dialog-late",
    count: "after wait",
    note: "Permission dialog appears only after the ~150s silence",
  },
  {
    id: "stall-gap",
    label: "stall-gap",
    count: "150.0s",
    note: "Streaming stall detected: 150.0s gap; permissionDecisionMs≈150717",
  },
]);

export const RULED_OUT = Object.freeze([
  "#57960 — Claude Desktop on Windows: PowerShell permission prompt delayed ~2m35s — SAME bug, closed stale; cite only, do not rebuild",
  "#94392 — headless -p exits with Tasks still running — CLI process exit vs PowerShell first-call stall; DIFFERENT",
  "#69647 — PowerShell tool takes ~3 minutes to spawn in VS Code extension on Windows — same symptom, different host; cite only",
  "#45099 — PowerShell prompt freezing (referenced by #57960) — cite only",
  "#73587 — Desktop app ignores permissions.allow rules — rule matching, not the 154s stall; DIFFERENT",
  "#82523 — PowerShell allow rules do not prevent the prompt — DIFFERENT",
  "#59454 — PowerShell pre-validation intermittently fails or times out — DIFFERENT",
  "Somnus/#94415 — Cowork cloud schedule device_absent; DIFFERENT",
  "Cresset/#94420 — keep-awake hold never released; DIFFERENT",
  "Dictabelt/#94406 — desktop voice-dictation segment-drop; DIFFERENT",
  "Lemure/#94410 — leftover ScheduledTasks dispatcher ticks; DIFFERENT",
  "Cancellans/#94400 — deferred-delta binder folio; DIFFERENT",
  "Arras/#94348 — phantom-prompt theater tapestry; DIFFERENT",
  "Frangible/#94362 — chmod-failopen wax-seal; DIFFERENT",
  "Nameplate/#94349 — header-rename brass plate; DIFFERENT",
  "Matryoshka/#94350 — subst-nest nesting-doll; DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "A PowerShell tool call should start within a few seconds, like the Bash tool does on the same machine",
  "Any permission dialog should appear immediately rather than after ~150s",
  "First unique command shapes should not wait 153–160s before the command starts",
  "The EncodedCommand AST parser finishing in ~1s should not be followed by 150s of silence",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "streaming-stall",
  "treacle",
  "first-call",
  "permission-dialog-late",
  "ast-parser",
]);

export const COUSINS = Object.freeze([
  {
    issue: 57960,
    title: "Claude Desktop on Windows: PowerShell tool call permission prompt delayed ~2m35s before appearing",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — same bug, closed stale. Do not rebuild. Do not conflate as a new defect.",
  },
  {
    issue: 94392,
    title: "headless -p exits with Tasks still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — CLI process exit vs PowerShell first-call stall. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94398, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94397, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94396, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94393, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94392, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "copper-kettle";
export const SAMPLE_KIND_SEEDED = "streaming-stall";
export const SAMPLE_HOLDING_IDLE = "bash-fast";
export const SAMPLE_HOLDING_SEEDED = "sticky-ladle";

export const SAMPLE_BRISK_PROOF = Object.freeze({
  brisk: true,
  treacle: false,
  streamingStall: false,
  firstCall: false,
  permissionDialogLate: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_TREACLE_PROOF = Object.freeze({
  brisk: false,
  treacle: true,
  streamingStall: true,
  firstCall: true,
  astParser: true,
  permissionDialogLate: true,
  stallGap: true,
  permissionMs: true,
  encodedCommand: true,
  probeBeforeStart: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  briskCase: { ...SYNTHETIC_BRISK },
  first: { ...SYNTHETIC_FIRST_CALL },
  stall: { ...SYNTHETIC_STALL },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds brisk: PowerShell should start promptly like Bash" },
  { t: "first-call", line: "new PowerShell shape; EncodedCommand AST parser ~1s then ~150s silence" },
  { t: "permission-dialog-late", line: "dialog appears only after the wait; confirm is seconds" },
  { t: "path", line: "streaming-stall — 150.0s gap; permissionDecisionMs≈150717; probe wait is before start" },
  { t: "score", line: "when the first unique pour clings ~154s the booth is treacle — Score treacle or admit brisk." },
]);

const FORCE_FLAGS = [
  "streamingStall",
  "firstCall",
  "astParser",
  "permissionDialogLate",
  "stallGap",
  "permissionMs",
];

const ISSUE_CUE_RE =
  /94344|permissionDecisionMs|streaming stall|EncodedCommand|154\.1|150717|2\.1\.270|Get-Date/i;

/**
 * Educational pour evaluation. Not a Claude Code patch.
 * Encodes only the published #94344 shapes.
 * brisk=true is the HOLD / prompt-start path.
 *
 * Brisk/HOLD when: PowerShell starts in a few seconds like Bash.
 * Treacle / streaming-stall when: first unique PowerShell waits ~154s
 * before the command starts.
 */
export function evaluateStall({
  brisk = false,
  firstUnique = false,
  cached = false,
  bash = false,
} = {}) {
  if (brisk === true && !firstUnique) {
    return {
      stalled: false,
      waitMs: 2700,
      dialogAt: "immediate",
      phrase: "admit brisk",
      synthetic: true,
    };
  }
  if (cached === true || bash === true) {
    return {
      stalled: false,
      waitMs: cached ? 2600 : 2700,
      dialogAt: "immediate",
      phrase: "admit brisk",
      synthetic: true,
    };
  }
  const stalled = firstUnique === true;
  return {
    stalled,
    waitMs: stalled ? 154100 : 0,
    dialogAt: stalled ? "after-wait" : "immediate",
    phrase: stalled ? "score treacle" : "admit brisk",
    synthetic: true,
  };
}

export function scoreStreamingStall(input = {}) {
  const briskHold = input.brisk === true && input.treacle !== true;
  const pour = evaluateStall({
    brisk: briskHold,
    firstUnique:
      input.firstCall === true ||
      input.streamingStall === true ||
      input.treacle === true,
    cached: input.repeatCached === true,
    bash: input.bashFast === true && input.treacle !== true,
  });
  const treacle =
    !briskHold &&
    (pour.stalled === true ||
      input.treacle === true ||
      input.streamingStall === true ||
      input.firstCall === true);
  return {
    brisk: !treacle,
    treacle,
    streamingStall: treacle,
    pour,
    phrase: treacle ? "score treacle" : "admit brisk",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94344") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapTreacle(input = {}) {
  const treacle = isTreacleInput(input);
  const brisk = input.brisk === true && !treacle;
  return {
    stamp: treacle ? "streaming-stall" : "bash-fast",
    holdingLane: treacle ? "sticky-ladle" : "bash-fast",
    kindLane: treacle ? "streaming-stall" : "copper-kettle",
    bindLane: treacle ? "molasses-pour" : "instant",
    ribbon: treacle ? "treacle" : "brisk",
    brisk,
  };
}

export function inspectFirstCall(input = {}) {
  const first =
    input.firstCall === true ||
    input.treacle === true ||
    input.streamingStall === true ||
    isTreacleInput(input);
  if (input.brisk === true && !first) {
    return { stamp: "prompt-start", first: false, note: "first unique command starts promptly" };
  }
  return {
    stamp: first ? "first-call" : "first-idle",
    first,
    note: first
      ? "first-call — every NEW PowerShell shape waits 153–160s before start"
      : "",
  };
}

export function inspectAstParser(input = {}) {
  const parser =
    input.astParser === true ||
    input.encodedCommand === true ||
    input.treacle === true ||
    isTreacleInput(input);
  if (input.brisk === true && !parser) {
    return { stamp: "parser-idle", parser: false };
  }
  return {
    stamp: parser ? "ast-parser" : "parser-idle",
    parser,
    note: parser
      ? "ast-parser — EncodedCommand AST parser ~1s, then ~150s silence"
      : "",
  };
}

export function inspectPermissionDialogLate(input = {}) {
  const late =
    input.permissionDialogLate === true ||
    input.treacle === true ||
    input.streamingStall === true ||
    isTreacleInput(input);
  if (input.brisk === true && !late) {
    return { stamp: "dialog-immediate", late: false };
  }
  return {
    stamp: late ? "permission-dialog-late" : "dialog-idle",
    late,
    note: late
      ? "permission-dialog-late — dialog appears only after the wait"
      : "",
  };
}

export function inspectStallGap(input = {}) {
  const gap =
    input.stallGap === true ||
    input.permissionMs === true ||
    input.treacle === true ||
    input.streamingStall === true ||
    isTreacleInput(input);
  if (input.brisk === true && !gap) {
    return { stamp: "no-gap", gap: false };
  }
  return {
    stamp: gap ? "stall-gap" : "gap-idle",
    gap,
    note: gap
      ? "stall-gap — Streaming stall detected: 150.0s; permissionDecisionMs≈150717"
      : "",
  };
}

export function inspectProbeBeforeStart(input = {}) {
  const before =
    input.probeBeforeStart === true ||
    input.treacle === true ||
    isTreacleInput(input);
  if (input.brisk === true && !before) {
    return { stamp: "starts-now", before: false };
  }
  return {
    stamp: before ? "probe-before-start" : "probe-idle",
    before,
    note: before
      ? "probe-before-start — command itself is 119ms; the wait is before start"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "copper-kettle": input.treacle || input.streamingStall,
    "treacle-well": input.treacle || input.firstCall,
    "sticky-ladle": input.astParser || input.encodedCommand || input.treacle,
    "wax-paper-twist": input.permissionDialogLate || input.treacle,
    "enamel-scale": input.permissionMs || input.stallGap,
    "molasses-pour": input.streamingStall || input.probeBeforeStart,
  };
  return (
    map[id] === true ||
    input.streamingStall === true ||
    input.treacle === true
  );
}

function isTreacleInput(input = {}) {
  return (
    input.treacle === true ||
    input.streamingStall === true ||
    input.firstCall === true ||
    input.astParser === true ||
    input.permissionDialogLate === true ||
    input.stallGap === true ||
    input.permissionMs === true ||
    input.encodedCommand === true ||
    input.probeBeforeStart === true
  );
}

export function readBooth(input = {}) {
  const treacle = isTreacleInput(input);
  const brisk = input.brisk === true && !treacle;
  return {
    mark: treacle ? "treacle" : "brisk",
    brisk,
    treacle,
    streamingStall: input.streamingStall === true || treacle,
    firstCall: input.firstCall === true,
    astParser: input.astParser === true,
    permissionDialogLate: input.permissionDialogLate === true,
    stallGap: input.stallGap === true,
    permissionMs: input.permissionMs === true,
    encodedCommand: input.encodedCommand === true,
    probeBeforeStart: input.probeBeforeStart === true,
    repeatCached: input.repeatCached === true,
    bashFast: input.bashFast === true,
    clinic: mapTreacle(input),
    first: inspectFirstCall(input),
    parser: inspectAstParser(input),
    dialog: inspectPermissionDialogLate(input),
    gap: inspectStallGap(input),
    probe: inspectProbeBeforeStart(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const TREACLE_WALK = Object.freeze([
  {
    t: "idle",
    event: "bash-fast",
    brisk: true,
    treacle: false,
    cue: "brisk",
    note: "idle HOLD: PowerShell should start promptly like Bash",
  },
  {
    t: "first-call",
    event: "streaming-stall",
    treacle: true,
    streamingStall: true,
    firstCall: true,
    cue: "treacle",
    note: "new PowerShell shape; EncodedCommand AST parser ~1s then ~150s silence",
  },
  {
    t: "permission-dialog-late",
    event: "permission-dialog-late",
    treacle: true,
    permissionDialogLate: true,
    cue: "treacle",
    note: "dialog appears only after the wait; confirm is seconds",
  },
  {
    t: "path",
    event: "streaming-stall",
    treacle: true,
    streamingStall: true,
    firstCall: true,
    astParser: true,
    permissionDialogLate: true,
    stallGap: true,
    permissionMs: true,
    encodedCommand: true,
    probeBeforeStart: true,
    cue: "treacle",
    note: "streaming-stall — 150.0s gap; permissionDecisionMs≈150717; probe wait is before start",
  },
  {
    t: "score",
    event: "treacle",
    treacle: true,
    streamingStall: true,
    firstCall: true,
    astParser: true,
    permissionDialogLate: true,
    stallGap: true,
    permissionMs: true,
    encodedCommand: true,
    probeBeforeStart: true,
    cue: "treacle",
    note: "treacle — first unique PowerShell pour clings ~154s before start",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "bash-fast",
    brisk: true,
    treacle: false,
    cue: "brisk",
    note: "positive control: first unique PowerShell starts promptly like Bash",
  },
  {
    t: "admit",
    event: "bash-fast",
    brisk: true,
    cue: "brisk",
    note: "positive control: the booth admits brisk",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    brisk: true,
    treacle: false,
    streamingStall: false,
    cue: "brisk",
  };
}

export function seedBrisk() {
  return { ...emptyTicket() };
}

export function seedTreacle() {
  return {
    seed: SEEDED_WORD,
    brisk: false,
    treacle: true,
    streamingStall: true,
    firstCall: true,
    astParser: true,
    permissionDialogLate: true,
    stallGap: true,
    permissionMs: true,
    encodedCommand: true,
    probeBeforeStart: true,
    cue: "treacle",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_TREACLE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    treacle: true,
    streamingStall: true,
    cue: "treacle",
  };
}

export function seedStreamingStall() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    treacle: true,
    streamingStall: true,
    event: "streaming-stall",
    cue: "treacle",
  };
}

export function seedSnap() {
  return { seed: "snap", preferSeed: true, brisk: true, cue: "brisk" };
}

export function seedReady() {
  return { seed: "ready", preferSeed: true, brisk: true, cue: "brisk" };
}

export function seedInstant() {
  return { seed: "instant", preferSeed: true, brisk: true, cue: "brisk" };
}

export function seedBashFast() {
  return { seed: "bash-fast", preferSeed: true, brisk: true, cue: "brisk" };
}

export function seedFirstCall() {
  return {
    seed: "first-call",
    preferSeed: true,
    firstCall: true,
    cue: "treacle",
  };
}

export function seedAstParser() {
  return {
    seed: "ast-parser",
    preferSeed: true,
    astParser: true,
    cue: "treacle",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      brisk: false,
      treacle: false,
      streamingStall: false,
      firstCall: false,
      astParser: false,
      permissionDialogLate: false,
      stallGap: false,
      permissionMs: false,
      encodedCommand: false,
      probeBeforeStart: false,
      repeatCached: false,
      bashFast: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    brisk: raw.brisk === true,
    treacle: raw.treacle === true || raw.event === "treacle",
    streamingStall:
      raw.streamingStall === true || raw.event === "streaming-stall",
    firstCall:
      raw.firstCall === true || raw.event === "first-call",
    astParser:
      raw.astParser === true || raw.event === "ast-parser",
    permissionDialogLate:
      raw.permissionDialogLate === true ||
      raw.event === "permission-dialog-late",
    stallGap:
      raw.stallGap === true || raw.event === "stall-gap",
    permissionMs:
      raw.permissionMs === true || raw.event === "permission-ms",
    encodedCommand:
      raw.encodedCommand === true || raw.event === "encoded-command",
    probeBeforeStart:
      raw.probeBeforeStart === true || raw.event === "probe-before-start",
    repeatCached:
      raw.repeatCached === true || raw.event === "repeat-cached",
    bashFast: raw.bashFast === true || raw.event === "bash-fast",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.brisk != null ||
        ticket.treacle != null ||
        ticket.streamingStall != null ||
        ticket.firstCall != null ||
        ticket.astParser != null ||
        ticket.permissionDialogLate != null ||
        ticket.stallGap != null ||
        ticket.permissionMs != null ||
        ticket.encodedCommand != null ||
        ticket.probeBeforeStart != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isBrisk(row) {
  if (row.treacle && row.cue !== "brisk") return false;
  if (row.cue === "treacle" || row.cue === "streaming-stall") return false;
  if (
    row.streamingStall &&
    row.firstCall &&
    row.cue !== "brisk" &&
    row.brisk !== true
  ) {
    return false;
  }
  if (
    row.brisk === true &&
    row.treacle !== true &&
    row.cue !== "treacle"
  ) {
    return true;
  }
  if (
    row.cue === "brisk" &&
    row.treacle !== true &&
    row.streamingStall !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isStreamingStall(row) {
  return (
    row.event === "streaming-stall" &&
    !isBrisk(row) &&
    (row.streamingStall === true ||
      row.firstCall === true ||
      row.treacle === true)
  );
}

function isTreacleRow(row) {
  if (isBrisk(row)) return false;
  if (isStreamingStall(row) && row.cue !== "treacle") return false;
  if (row.cue === "treacle") return true;
  if (row.treacle === true) return true;
  if (row.streamingStall === true && row.firstCall === true) return true;
  if (
    row.streamingStall === true ||
    row.firstCall === true ||
    row.astParser === true ||
    row.permissionDialogLate === true ||
    row.stallGap === true ||
    row.permissionMs === true ||
    row.encodedCommand === true ||
    row.probeBeforeStart === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one treacle pass against the copper kettle.
 * brisk: PowerShell starts promptly like Bash.
 * treacle: first unique PowerShell waits ~154s before start.
 * streaming-stall: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isStreamingStall(row) ||
    (row.streamingStall && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "streaming-stall";
  } else if (isTreacleRow(row)) {
    verdict = "treacle";
  } else if (isBrisk(row)) {
    verdict = "brisk";
  } else if (
    row.streamingStall ||
    row.firstCall ||
    row.astParser ||
    row.permissionDialogLate ||
    row.stallGap ||
    row.permissionMs ||
    row.encodedCommand ||
    row.probeBeforeStart
  ) {
    verdict = "treacle";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "treacle";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    brisk: verdict === "brisk",
    treacle: verdict === "treacle" || verdict === SEEDED_WORD,
    streamingStall:
      row.streamingStall === true ||
      verdict === "streaming-stall" ||
      verdict === PATH_WORD,
    firstCall: row.firstCall,
    astParser: row.astParser,
    permissionDialogLate: row.permissionDialogLate,
    stallGap: row.stallGap,
    permissionMs: row.permissionMs,
    encodedCommand: row.encodedCommand,
    probeBeforeStart: row.probeBeforeStart,
    cue: hold
      ? "brisk"
      : row.streamingStall || verdict === "streaming-stall"
        ? "streaming-stall"
        : "treacle",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit brisk" : "score treacle",
    firstInspect: inspectFirstCall(row),
    parserInspect: inspectAstParser(row),
    dialogInspect: inspectPermissionDialogLate(row),
    gapInspect: inspectStallGap(row),
    probeInspect: inspectProbeBeforeStart(row),
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
      : TREACLE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "treacle");
  const path = scored.filter((row) => row.verdict === "streaming-stall");
  const brisk = scored.filter((row) => row.verdict === "brisk");
  const headline =
    scored.find((row) => row.event === "treacle") ||
    scored.find((row) => row.event === "streaming-stall") ||
    scored.find((row) => row.event === "permission-dialog-late") ||
    charged[charged.length - 1];
  let verdict = "brisk";
  if (charged.length) verdict = "treacle";
  else if (path.length && !brisk.length) {
    verdict = "streaming-stall";
  }
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
    treacleCount: charged.length,
    pathCount: path.length,
    briskCount: brisk.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit brisk" : "score treacle",
    note: headline
      ? "Desktop app on Windows: every new PowerShell tool call waits ~154s before the command starts. Desktop 1.52386.6.0; Claude Code 2.1.270; median 154.1s / 1244 calls; Bash 2.7s. Cite-only cousins #57960 #94392."
      : "published treacle walk scored against brisk vs treacle",
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
    seeded !== "brisk" &&
    seeded !== "treacle" &&
    seeded !== "streaming-stall" &&
    ticket.brisk == null &&
    ticket.treacle == null &&
    ticket.streamingStall == null &&
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
    brisk: scored.brisk ?? false,
    treacle: scored.treacle ?? false,
    streamingStall: scored.streamingStall ?? false,
    firstCall: scored.firstCall ?? false,
    astParser: scored.astParser ?? false,
    permissionDialogLate: scored.permissionDialogLate ?? false,
    stallGap: scored.stallGap ?? false,
    permissionMs: scored.permissionMs ?? false,
    encodedCommand: scored.encodedCommand ?? false,
    probeBeforeStart: scored.probeBeforeStart ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.streamingStall || result.treacle
      ? "kind=streaming-stall"
      : "kind=copper-kettle",
    result.firstCall || result.treacle
      ? "ref=first-call"
      : "ref=bash-fast",
    result.streamingStall || result.verdict === "streaming-stall"
      ? "path=streaming-stall"
      : "path=brisk",
    result.cue === "brisk"
      ? "cue=brisk"
      : result.cue === "streaming-stall"
        ? "cue=streaming-stall"
        : "cue=treacle",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    brisk: result.brisk,
    treacle: result.treacle,
    streamingStall: result.streamingStall,
    firstCall: result.firstCall,
    astParser: result.astParser,
    permissionDialogLate: result.permissionDialogLate,
    stallGap: result.stallGap,
    permissionMs: result.permissionMs,
    encodedCommand: result.encodedCommand,
    probeBeforeStart: result.probeBeforeStart,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    first: inspectFirstCall({
      brisk: result.brisk,
      treacle: result.treacle,
      firstCall: result.firstCall,
    }),
    parser: inspectAstParser({
      brisk: result.brisk,
      treacle: result.treacle,
      astParser: result.astParser,
    }),
    dialog: inspectPermissionDialogLate({
      brisk: result.brisk,
      treacle: result.treacle,
      permissionDialogLate: result.permissionDialogLate,
    }),
    gap: inspectStallGap({
      brisk: result.brisk,
      treacle: result.treacle,
      stallGap: result.stallGap,
    }),
    probe: inspectProbeBeforeStart({
      brisk: result.brisk,
      treacle: result.treacle,
      probeBeforeStart: result.probeBeforeStart,
    }),
    clinic: mapTreacle({
      brisk: result.brisk,
      treacle: result.treacle,
      streamingStall: result.streamingStall,
      firstCall: result.firstCall,
      astParser: result.astParser,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      treacle: result.treacle === true || result.verdict === "treacle",
    })),
    leakPath: scoreStreamingStall({
      brisk: result.brisk === true && !result.treacle,
      treacle: result.treacle,
      streamingStall: result.streamingStall,
      firstCall: result.firstCall,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): a Windows PowerShell permission/AST/streaming path stalls ~150s on first unique command shape; Bash path skips it. Invite verify against #94344 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
