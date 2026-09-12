#!/usr/bin/env node
/**
 * Galley — printer’s galley / wet-proof / unbound-signature booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * The dirty-tree Stop hook fires when the working tree has
 * uncommitted/untracked files at the moment the MAIN agent’s turn
 * ends. With background subagents, a dirty tree at turn-end is the
 * normal correct state (the subagent writes for minutes and commits
 * last). The hook cannot tell in-progress-by-design from abandoned
 * mid-edit, so it fires every main turn for the whole subagent run.
 * Stop exit 2 injects a synthetic user turn and re-invokes the model
 * against the entire conversation. Acting on the message (commit
 * mid-write) would race the subagent. Measured one session: 4 firings,
 * $3.25, ~5.5M billable tokens; ~85% cache reads. The hook never fires
 * for the subagents themselves — the tax hits the main session (largest
 * context) which is NOT writing.
 *
 *   node galley.mjs data/billed.json
 *   echo '{"seed":"billed"}' | node galley.mjs
 *
 * Idle word is dry (HOLD: no false Stop billing; tree mid-write
 * respected).
 * Seeded word is billed (#93745 — Stop dirty-tree blocks + full-turn
 * bill while background agent mid-write).
 * Path word is stop-dirty.
 * Product score word is galley (Score galley or admit dry.).
 *
 * Encoded from anthropics/claude-code#93745 issue text only.
 * Hypothesis (NON-BINDING): harness could consult live background_tasks
 * / agent status before blocking Stop. Verify against #93745 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude. No
 * secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "dry",
  "billed",
  "galley",
  "stop-dirty",
  "hold",
  "skip-live",
  "advisory-once",
  "wet-proof",
  "composing-stick",
  "unbound-signature",
  "four-firings",
  "cache-read",
  "main-session-tax",
  "background-exempt",
  "unpushed-cousin",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "dry";
export const PATH_WORD = "stop-dirty";
export const SEEDED_WORD = "billed";
export const PRODUCT_WORD = "galley";
export const HOLD = Object.freeze(["dry", "hold"]);
export const RECOVER = Object.freeze(["dry", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "intact",
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
  FORBIDDEN_IDLE.filter((name) => name !== "billed" && name !== "galley"),
);

export const FEATURED_ISSUE = 93745;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93745";
export const TITLE =
  "Stop hook blocks and bills a full turn when a background agent is mid-write; no way to distinguish in-progress work from abandoned work";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "area:cost",
  "area:hooks",
  "area:agents",
  "area:claude-code-web",
  "platform:web",
]);
export const PLATFORM = "web";
export const FIRING_COUNT = 4;
export const SESSION_COST = 3.25;
export const BILLABLE_TOKENS = 5525683;
export const CACHE_READ_PCT = 85;
export const MODEL_CALLS = 17;
export const SUBAGENT_FIRINGS = 0;
export const STOP_EXIT = 2;
export const PHRASE = "Score galley or admit dry.";
export const DISTRIBUTION =
  "Dirty-tree Stop hook fires when the working tree has uncommitted/untracked files at the moment the MAIN agent’s turn ends. With background subagents, a dirty tree at turn-end is the normal correct state (subagent writes for minutes, commits last). Hook cannot tell in-progress-by-design from abandoned mid-edit, so it fires every main turn for the whole subagent run. Stop hook exit 2 injects a synthetic user turn and re-invokes the model against the entire conversation (full context re-read). Acting on the message (commit mid-write) would race the subagent and produce broken intermediate commits. Measured one session: 4 firings, $3.25, ~5.5M billable tokens; ~85% cache reads; one firing produced multiple model calls via tool rounds. Hook never fires for the subagents themselves — tax hits the main session (largest context) which is NOT writing. Stop payload already knows about background work elsewhere (related: idle_prompt/#93672 has background_tasks); this Stop dirty-tree path does not skip when agents are live. Ask: skip/block-downgrade while background agents occupy the tree; make advisory after first firing; related #83924 unpushed false positive.";
export const SESSION_KIND =
  "Web Claude Code session. Main agent dispatches background subagents that write for minutes and commit last. Dirty tree at main turn-end is the correct state. Stop dirty-tree still fires. 4 firings, $3.25, 5,525,683 billable tokens, 85% cache reads, 17 model calls. Subagent transcripts: 0 firings.";
export const RULED_OUT = Object.freeze([
  "a dirty tree as a warning sign when a background agent is still writing (it is the normal correct state)",
  "acting on the Stop message by committing mid-write (races the subagent; broken intermediate commits)",
  "the tax multiplying per subagent (four subagent transcripts each recorded 0 firings)",
  "the hook being wrong in general (in an ephemeral container, uncommitted usually does mean at-risk — the defect is that it cannot distinguish abandoned from in-progress-by-design)",
]);
export const EXPECTED = Object.freeze([
  "do not block while a background agent occupies the tree — skip the dirty-tree check or downgrade to non-blocking",
  "make the Stop dirty-tree path advisory rather than blocking after the first firing",
  "apply the #83924 fix (git rev-list HEAD --not --remotes) to the unpushed check",
]);

export const GALLEY_PLAQUES = Object.freeze([
  { id: "firings", label: "firings", count: 4, note: "wet-proof pulls" },
  { id: "cost", label: "billed", count: "$3.25", note: "one session" },
  { id: "tokens", label: "billable", count: "5.5M", note: "~85% cache reads" },
  { id: "calls", label: "model calls", count: 17, note: "four firings, tool rounds" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "composing-stick",
    survey: "set the composing stick (main agent’s turn ends while type is still loose)",
    kind: "composing-stick",
    note: "seeded: main turn-end with a dirty tree is treated as abandoned type",
  },
  {
    id: "wet-sheet",
    survey: "feel the wet sheet (background subagent writes for minutes and commits last)",
    kind: "wet-sheet",
    note: "seeded: ink-wet unbound signature is the normal correct state, not a warning",
  },
  {
    id: "pull-press",
    survey: "watch the pull press (Stop hook exit 2 injects a synthetic user turn)",
    kind: "pull-press",
    note: "seeded: each pull re-invokes the model against the entire conversation",
  },
  {
    id: "type-bill",
    survey: "read the type bill (4 firings, $3.25, ~5.5M billable tokens, 85% cache reads)",
    kind: "type-bill",
    note: "seeded: tax hits the main session — largest context — which is not writing",
  },
  {
    id: "live-forme",
    survey: "consult the live forme (Stop payload already knows background_tasks elsewhere)",
    kind: "live-forme",
    note: "seeded: this Stop dirty-tree path does not skip when agents are live",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "stop-dirty",
  "billed",
  "wet-proof",
  "four-firings",
  "cache-read",
  "main-session-tax",
  "background-exempt",
  "composing-stick",
]);

export const COUSINS = Object.freeze([
  {
    issue: 83924,
    title: "same script, unpushed-commit false positive",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #83924 same dirty-tree script, unpushed-commit false positive. Related ask, different trigger. Do not rebuild",
  },
  {
    issue: 85787,
    title: "exit-time uncommitted warning, path exclusion",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #85787 exit-time uncommitted warning; non-blocking TUI. Different surface. Do not rebuild",
  },
  {
    issue: 69586,
    title: "same script, signature/Unverified check on branch divergence",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #69586 same script, signature/Unverified on branch divergence. Different defect. Do not rebuild",
  },
  {
    issue: 40442,
    title: "a different infinite Stop-hook loop (plugin cache dir)",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #40442 different infinite Stop-hook loop (plugin cache dir). Different defect. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93743,
    title: "non-ASCII slug collision / ligature-candidate",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93722,
    title: "worktree connector disable-list / umbilical",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93746,
    title: "enableArtifact false kills scratchpad",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93744,
    title: "/goal stop evaluator blind",
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
  {
    issue: 93735,
    title: "effortLevel",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93733,
    title: "identical rejected re-submit",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "rescript",
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
]);

export const SAMPLE_STICK = Object.freeze({
  mainTurnEnded: true,
  typeLoose: true,
});

export const SAMPLE_DRY_STICK = Object.freeze({
  mainTurnEnded: false,
  typeLoose: false,
});

export const SAMPLE_SHEET = Object.freeze({
  wet: true,
  backgroundWriting: true,
  committed: false,
});

export const SAMPLE_DRY_SHEET = Object.freeze({
  wet: false,
  backgroundWriting: false,
  committed: true,
});

export const SAMPLE_PRESS = Object.freeze({
  stopExit: 2,
  syntheticTurn: true,
  skipLive: false,
});

export const SAMPLE_DRY_PRESS = Object.freeze({
  stopExit: 0,
  syntheticTurn: false,
  skipLive: true,
});

export const SAMPLE_BILL = Object.freeze({
  firings: 4,
  cost: 3.25,
  tokens: 5525683,
  cachePct: 85,
  modelCalls: 17,
});

export const SAMPLE_DRY_BILL = Object.freeze({
  firings: 0,
  cost: 0,
  tokens: 0,
  cachePct: 0,
  modelCalls: 0,
});

export const SAMPLE_FORME = Object.freeze({
  agentsLive: true,
  backgroundTasksKnown: true,
  dirtyTreeSkipped: false,
});

export const SAMPLE_DRY_FORME = Object.freeze({
  agentsLive: false,
  backgroundTasksKnown: true,
  dirtyTreeSkipped: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "no false Stop billing; tree mid-write respected" },
  { t: "stick", line: "composing stick still loose — main agent ended its turn" },
  { t: "sheet", line: "background subagent writes ink-wet sheets for minutes and commits last" },
  { t: "dirty", line: "dirty tree at turn-end is the normal correct state, not a warning" },
  { t: "press", line: "Stop dirty-tree fires; exit 2 injects a synthetic user turn" },
  { t: "reread", line: "model re-invoked against the entire conversation — full context re-read" },
  { t: "race", line: "committing the wet proof would race the subagent’s own merge / commit" },
  { t: "bill", line: "4 firings · $3.25 · 5,525,683 billable tokens · 85% cache reads · 17 model calls" },
  { t: "tax", line: "hook never fires for the subagents — tax hits the main session, which is not writing" },
  { t: "forme", line: "Stop payload already knows background_tasks elsewhere; this path does not skip" },
  { t: "path", line: "stop-dirty — dirty-tree Stop blocks while a live agent occupies the tree" },
  { t: "score", line: "when the press bills a wet proof as abandoned type the booth is a galley — Score galley or admit dry." },
]);

export function inspectStick(input = {}) {
  const stick =
    input.stick && typeof input.stick === "object"
      ? input.stick
      : input.dry === true && input.billed !== true
        ? SAMPLE_DRY_STICK
        : SAMPLE_STICK;
  const forcedLoose =
    input.billed === true ||
    input.stopDirty === true ||
    input.event === "billed" ||
    input.event === "galley" ||
    input.event === "stop-dirty" ||
    input.event === "composing-stick";
  const typeLoose = forcedLoose ? true : stick.typeLoose === true && input.dry !== true;
  return {
    mainTurnEnded: typeLoose,
    typeLoose,
    stamp: typeLoose ? "type-loose" : "type-set",
    note: typeLoose
      ? "composing stick still loose — main turn ended on unbound type"
      : "composing stick set — no false Stop on a mid-write tree",
  };
}

export function inspectSheet(input = {}) {
  const sheet =
    input.sheet && typeof input.sheet === "object"
      ? input.sheet
      : input.dry === true && input.billed !== true
        ? SAMPLE_DRY_SHEET
        : SAMPLE_SHEET;
  const forcedWet =
    input.wetProof === true ||
    input.event === "wet-proof" ||
    input.stopDirty === true ||
    (input.billed === true && input.dry !== true);
  const wet = forcedWet ? true : sheet.wet === true;
  return {
    wet,
    backgroundWriting: wet,
    committed: !wet,
    stamp: wet ? "ink-wet" : "sheet-dry",
    note: wet
      ? "ink-wet unbound signature — background agent still writing; commit is last"
      : "sheets dry — no mid-write tree for the Stop hook to misread",
  };
}

export function inspectPress(input = {}) {
  const press =
    input.press && typeof input.press === "object"
      ? input.press
      : input.dry === true && input.billed !== true
        ? SAMPLE_DRY_PRESS
        : SAMPLE_PRESS;
  const forcedPull =
    input.stopFired === true ||
    input.event === "stop-dirty" ||
    input.event === "four-firings" ||
    input.stopDirty === true ||
    (input.billed === true && input.dry !== true);
  const stopExit = forcedPull ? STOP_EXIT : press.stopExit || 0;
  return {
    stopExit,
    syntheticTurn: stopExit === STOP_EXIT,
    skipLive: stopExit !== STOP_EXIT,
    stamp: stopExit === STOP_EXIT ? "wet-pull" : "press-idle",
    note:
      stopExit === STOP_EXIT
        ? "pull press fired Stop exit 2 — synthetic user turn, full context re-read"
        : "pull press idle — dirty-tree skipped or advisory while agents occupy the tree",
  };
}

export function inspectBill(input = {}) {
  const bill =
    input.bill && typeof input.bill === "object"
      ? input.bill
      : input.dry === true && input.billed !== true
        ? SAMPLE_DRY_BILL
        : SAMPLE_BILL;
  const forcedBill =
    input.fourFirings === true ||
    input.cacheRead === true ||
    input.event === "four-firings" ||
    input.event === "cache-read" ||
    input.event === "main-session-tax" ||
    (input.billed === true && input.dry !== true);
  const firings = forcedBill ? FIRING_COUNT : bill.firings || 0;
  return {
    firings,
    cost: firings ? SESSION_COST : 0,
    tokens: firings ? BILLABLE_TOKENS : 0,
    cachePct: firings ? CACHE_READ_PCT : 0,
    modelCalls: firings ? MODEL_CALLS : 0,
    stamp: firings ? "billed" : "unbilled",
    note: firings
      ? "4 firings · $3.25 · 5,525,683 billable tokens · 85% cache reads · 17 model calls"
      : "type bill empty — no false Stop billing",
  };
}

export function inspectForme(input = {}) {
  const forme =
    input.forme && typeof input.forme === "object"
      ? input.forme
      : input.dry === true && input.billed !== true
        ? SAMPLE_DRY_FORME
        : SAMPLE_FORME;
  const forcedLive =
    input.backgroundLive === true ||
    input.event === "background-exempt" ||
    input.event === "stop-dirty" ||
    input.stopDirty === true ||
    (input.billed === true && input.dry !== true);
  const agentsLive = forcedLive ? true : forme.agentsLive === true;
  return {
    agentsLive,
    backgroundTasksKnown: true,
    dirtyTreeSkipped: !agentsLive,
    stamp: agentsLive ? "agents-live" : "forme-quiet",
    note: agentsLive
      ? "live forme occupied — Stop dirty-tree path does not skip when agents are live"
      : "live forme quiet — no background agent occupying the tree",
  };
}

export function readBooth(input = {}) {
  const stick = inspectStick(input);
  const sheet = inspectSheet(input);
  const press = inspectPress(input);
  const bill = inspectBill(input);
  const forme = inspectForme(input);
  const billed =
    input.dry !== true &&
    ((sheet.wet && press.syntheticTurn) ||
      (forme.agentsLive && bill.firings > 0) ||
      input.billed === true);
  const dry = input.dry === true && billed !== true && !sheet.wet;
  const path =
    press.syntheticTurn &&
    (input.event === "stop-dirty" || input.stopDirty === true);
  return {
    stick,
    sheet,
    press,
    bill,
    forme,
    plaques: GALLEY_PLAQUES,
    stations: BOOTH_STATIONS,
    billed: billed && !dry && !path,
    dry:
      dry ||
      (!sheet.wet &&
        !press.syntheticTurn &&
        input.billed !== true &&
        input.stopDirty !== true),
    stopDirty: path && !dry,
    mark:
      path && !dry
        ? "stop-dirty"
        : billed && !dry
          ? "billed"
          : "dry",
  };
}

/**
 * Published galley walk from #93745 only. Facts from the issue text.
 * A dry booth respects a mid-write tree and does not bill a false Stop.
 * A billed booth pulls a wet proof as if the type were abandoned.
 * A stop-dirty booth names the dirty-tree Stop path.
 */
export const GALLEY_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-dry",
    dry: true,
    billed: false,
    cue: "dry",
    note: "idle HOLD: no false Stop billing; tree mid-write respected",
  },
  {
    t: "stick",
    event: "composing-stick",
    dry: true,
    skipLive: true,
    cue: "dry",
    note: "main agent ends its turn; composing stick should wait on live type",
  },
  {
    t: "sheet",
    event: "wet-proof",
    billed: true,
    wetProof: true,
    cue: "billed",
    note: "background subagent writes ink-wet sheets for minutes and commits last",
  },
  {
    t: "dirty",
    event: "unbound-signature",
    billed: true,
    dirtyTree: true,
    cue: "billed",
    note: "dirty tree at turn-end is the normal correct state, not a warning",
  },
  {
    t: "press",
    event: "stop-dirty",
    billed: true,
    stopDirty: true,
    stopFired: true,
    cue: "billed",
    note: "Stop dirty-tree fires; exit 2 injects a synthetic user turn",
  },
  {
    t: "bill",
    event: "four-firings",
    billed: true,
    fourFirings: true,
    cue: "billed",
    note: "4 firings · $3.25 · 5,525,683 billable tokens · 85% cache reads",
  },
  {
    t: "cache",
    event: "cache-read",
    billed: true,
    cacheRead: true,
    cue: "billed",
    note: "~85% of the cost is cache reads — re-reading the conversation",
  },
  {
    t: "tax",
    event: "main-session-tax",
    billed: true,
    mainSessionTax: true,
    cue: "billed",
    note: "tax hits the main session (largest context) which is not writing",
  },
  {
    t: "exempt",
    event: "background-exempt",
    billed: true,
    backgroundLive: true,
    cue: "billed",
    note: "hook never fires for the subagents themselves — 0 firings on four transcripts",
  },
  {
    t: "path",
    event: "stop-dirty",
    billed: true,
    stopDirty: true,
    dirtyTree: true,
    backgroundLive: true,
    cue: "billed",
    note: "stop-dirty — dirty-tree Stop blocks while a live agent occupies the tree",
  },
  {
    t: "score",
    event: "galley",
    billed: true,
    stopDirty: true,
    wetProof: true,
    fourFirings: true,
    cacheRead: true,
    mainSessionTax: true,
    backgroundLive: true,
    cue: "billed",
    note: "galley — when the press bills a wet proof as abandoned type the booth never stays dry",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "skip-live",
    dry: true,
    skipLive: true,
    cue: "dry",
    note: "positive control: dirty-tree skipped while a background agent occupies the tree",
  },
  {
    t: "sheet",
    event: "cue-dry",
    dry: true,
    cue: "dry",
    note: "positive control: wet sheet respected; no false Stop billing",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    dry: true,
    billed: false,
    skipLive: true,
    cue: "dry",
  };
}

export function seedDry() {
  return { ...emptyTicket() };
}

export function seedBilled() {
  return {
    seed: SEEDED_WORD,
    dry: false,
    billed: true,
    wetProof: true,
    dirtyTree: true,
    stopFired: true,
    fourFirings: true,
    cacheRead: true,
    mainSessionTax: true,
    backgroundLive: true,
    stopDirty: true,
    cue: "billed",
    issue: FEATURED_ISSUE,
    stick: SAMPLE_STICK,
    sheet: SAMPLE_SHEET,
    press: SAMPLE_PRESS,
    bill: SAMPLE_BILL,
    forme: SAMPLE_FORME,
  };
}

export function seedGalley() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    billed: true,
    wetProof: true,
    dirtyTree: true,
    stopFired: true,
    fourFirings: true,
    cacheRead: true,
    mainSessionTax: true,
    backgroundLive: true,
    stopDirty: true,
    cue: "billed",
  };
}

export function seedStopDirty() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    billed: true,
    stopDirty: true,
    dirtyTree: true,
    backgroundLive: true,
    event: "stop-dirty",
    cue: "billed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    dry: true,
    cue: "dry",
  };
}

export function seedSkipLive() {
  return {
    seed: "skip-live",
    preferSeed: true,
    skipLive: true,
    cue: "dry",
  };
}

export function seedAdvisoryOnce() {
  return {
    seed: "advisory-once",
    preferSeed: true,
    cue: "billed",
  };
}

export function seedWetProof() {
  return {
    seed: "wet-proof",
    preferSeed: true,
    wetProof: true,
    cue: "billed",
  };
}

export function seedComposingStick() {
  return {
    seed: "composing-stick",
    preferSeed: true,
    cue: "billed",
  };
}

export function seedUnboundSignature() {
  return {
    seed: "unbound-signature",
    preferSeed: true,
    dirtyTree: true,
    cue: "billed",
  };
}

export function seedFourFirings() {
  return {
    seed: "four-firings",
    preferSeed: true,
    fourFirings: true,
    cue: "billed",
  };
}

export function seedCacheRead() {
  return {
    seed: "cache-read",
    preferSeed: true,
    cacheRead: true,
    cue: "billed",
  };
}

export function seedMainSessionTax() {
  return {
    seed: "main-session-tax",
    preferSeed: true,
    mainSessionTax: true,
    cue: "billed",
  };
}

export function seedBackgroundExempt() {
  return {
    seed: "background-exempt",
    preferSeed: true,
    backgroundLive: true,
    cue: "billed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      dry: false,
      billed: false,
      stopDirty: false,
      skipLive: false,
      wetProof: false,
      dirtyTree: false,
      stopFired: false,
      fourFirings: false,
      cacheRead: false,
      mainSessionTax: false,
      backgroundLive: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    dry: raw.dry === true,
    billed:
      raw.billed === true ||
      raw.event === "billed" ||
      raw.event === "galley",
    stopDirty: raw.stopDirty === true || raw.event === "stop-dirty",
    skipLive: raw.skipLive === true || raw.event === "skip-live",
    wetProof: raw.wetProof === true || raw.event === "wet-proof",
    dirtyTree:
      raw.dirtyTree === true || raw.event === "unbound-signature",
    stopFired: raw.stopFired === true,
    fourFirings: raw.fourFirings === true || raw.event === "four-firings",
    cacheRead: raw.cacheRead === true || raw.event === "cache-read",
    mainSessionTax:
      raw.mainSessionTax === true || raw.event === "main-session-tax",
    backgroundLive:
      raw.backgroundLive === true || raw.event === "background-exempt",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    stick: raw.stick,
    sheet: raw.sheet,
    press: raw.press,
    bill: raw.bill,
    forme: raw.forme,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.dry != null ||
        ticket.billed != null ||
        ticket.stopDirty != null ||
        ticket.wetProof != null ||
        ticket.dirtyTree != null ||
        ticket.backgroundLive != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.stick ||
        ticket.sheet ||
        ticket.press),
  );
}

function isDry(row) {
  if (row.billed && row.cue !== "dry") return false;
  if (
    row.cue === "billed" ||
    row.cue === "galley" ||
    row.cue === "stop-dirty"
  ) {
    return false;
  }
  if (
    row.dirtyTree &&
    row.backgroundLive &&
    row.cue !== "dry" &&
    row.dry !== true
  ) {
    return false;
  }
  if (
    row.stopDirty &&
    row.dirtyTree &&
    row.cue !== "dry" &&
    row.dry !== true
  ) {
    return false;
  }
  if (row.dry === true && row.billed !== true && row.cue !== "billed") {
    return true;
  }
  if (
    row.cue === "dry" &&
    row.billed !== true &&
    row.dirtyTree !== true &&
    row.stopDirty !== true
  ) {
    return true;
  }
  if (
    row.skipLive === true &&
    row.billed !== true &&
    row.dirtyTree !== true &&
    row.backgroundLive !== true &&
    row.stopDirty !== true
  ) {
    return true;
  }
  return false;
}

function isStopDirtyPath(row) {
  return (
    row.event === "stop-dirty" &&
    !isDry(row) &&
    (row.stopDirty === true ||
      row.dirtyTree === true ||
      row.backgroundLive === true)
  );
}

function isBilled(row) {
  if (isDry(row)) return false;
  if (isStopDirtyPath(row) && row.cue !== "billed") return false;
  if (row.cue === "billed" || row.cue === "galley") return true;
  if (row.billed === true) return true;
  if (
    row.dirtyTree === true &&
    row.backgroundLive === true &&
    row.stopFired === true
  ) {
    return true;
  }
  if (row.dirtyTree === true && row.backgroundLive === true) {
    return true;
  }
  if (
    row.wetProof === true ||
    row.fourFirings === true ||
    row.cacheRead === true ||
    row.mainSessionTax === true ||
    (row.stopDirty === true && row.backgroundLive === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one galley pass against the wet-proof press.
 * dry: no false Stop billing; tree mid-write respected.
 * billed / galley: Stop dirty-tree blocks + full-turn bill while a
 *   background agent is mid-write.
 * stop-dirty: dirty-tree Stop fires at main turn-end on live type.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isStopDirtyPath(row) ||
    (row.stopDirty && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "stop-dirty";
  } else if (isBilled(row)) {
    verdict = "galley";
  } else if (isDry(row)) {
    verdict = "dry";
  } else if (
    row.dirtyTree ||
    row.backgroundLive ||
    row.fourFirings ||
    (row.stopDirty && !row.skipLive)
  ) {
    verdict = "galley";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const stick = inspectStick(row);
  const sheet = inspectSheet(row);
  const press = inspectPress(row);
  const bill = inspectBill(row);
  const forme = inspectForme(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    dry: verdict === "dry" || verdict === "hold",
    billed:
      verdict === "billed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    stopDirty:
      row.stopDirty === true ||
      verdict === "stop-dirty" ||
      verdict === PATH_WORD,
    skipLive: row.skipLive,
    wetProof: row.wetProof,
    dirtyTree: row.dirtyTree,
    stopFired: row.stopFired,
    fourFirings: row.fourFirings,
    cacheRead: row.cacheRead,
    mainSessionTax: row.mainSessionTax,
    backgroundLive: row.backgroundLive,
    cue: hold
      ? "dry"
      : row.stopDirty || verdict === "stop-dirty"
        ? "stop-dirty"
        : "billed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit dry" : "score galley",
    stickInspect: stick,
    sheetInspect: sheet,
    pressInspect: press,
    billInspect: bill,
    formeInspect: forme,
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
      : GALLEY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const billed = scored.filter(
    (row) => row.verdict === "galley" || row.verdict === "billed",
  );
  const path = scored.filter((row) => row.verdict === "stop-dirty");
  const dry = scored.filter((row) => row.verdict === "dry");
  const headline =
    scored.find((row) => row.event === "billed") ||
    scored.find((row) => row.event === "stop-dirty") ||
    scored.find((row) => row.event === "wet-proof") ||
    billed[billed.length - 1];
  let verdict = "dry";
  if (billed.length) verdict = "galley";
  else if (path.length && !dry.length) verdict = "stop-dirty";
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
    billedCount: billed.length,
    pathCount: path.length,
    dryCount: dry.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit dry" : "score galley",
    note: headline
      ? "Stop dirty-tree blocked and billed a full turn while a background agent was mid-write; 4 firings, $3.25, ~5.5M tokens; tax hits the main session."
      : "published galley walk scored against dry vs billed",
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
    seeded !== "dry" &&
    seeded !== "billed" &&
    seeded !== "stop-dirty" &&
    seeded !== "galley" &&
    ticket.dry == null &&
    ticket.billed == null &&
    ticket.dirtyTree == null &&
    ticket.stopDirty == null &&
    ticket.backgroundLive == null &&
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
    dry: scored.dry ?? false,
    billed: scored.billed ?? false,
    stopDirty: scored.stopDirty ?? false,
    skipLive: scored.skipLive ?? false,
    wetProof: scored.wetProof ?? false,
    dirtyTree: scored.dirtyTree ?? false,
    stopFired: scored.stopFired ?? false,
    fourFirings: scored.fourFirings ?? false,
    cacheRead: scored.cacheRead ?? false,
    mainSessionTax: scored.mainSessionTax ?? false,
    backgroundLive: scored.backgroundLive ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.dry && !result.billed ? "sheet=dry" : "sheet=wet",
    result.backgroundLive || result.billed ? "forme=live" : "forme=quiet",
    result.stopFired || result.billed ? "press=wet-pull" : "press=idle",
    result.fourFirings || result.billed ? "bill=four-firings" : "bill=empty",
    result.cacheRead || result.billed ? "cache=85" : "cache=none",
    result.stopDirty || result.verdict === "stop-dirty"
      ? "path=stop-dirty"
      : "path=dry",
    result.cue === "dry"
      ? "cue=dry"
      : result.cue === "stop-dirty"
        ? "cue=stop-dirty"
        : "cue=billed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    dry: result.dry,
    billed: result.billed,
    stopDirty: result.stopDirty,
    skipLive: result.skipLive,
    wetProof: result.wetProof,
    dirtyTree: result.dirtyTree,
    stopFired: result.stopFired,
    fourFirings: result.fourFirings,
    cacheRead: result.cacheRead,
    mainSessionTax: result.mainSessionTax,
    backgroundLive: result.backgroundLive,
    stick: input && input.stick,
    sheet: input && input.sheet,
    press: input && input.press,
    bill: input && input.bill,
    forme: input && input.forme,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    stick: inspectStick({
      dry: result.dry,
      billed: result.billed,
      stopDirty: result.stopDirty,
      stick: input && input.stick,
    }),
    sheet: inspectSheet({
      dry: result.dry,
      billed: result.billed,
      wetProof: result.wetProof,
      stopDirty: result.stopDirty,
      sheet: input && input.sheet,
    }),
    press: inspectPress({
      dry: result.dry,
      billed: result.billed,
      stopFired: result.stopFired,
      stopDirty: result.stopDirty,
      press: input && input.press,
    }),
    bill: inspectBill({
      dry: result.dry,
      billed: result.billed,
      fourFirings: result.fourFirings,
      cacheRead: result.cacheRead,
      bill: input && input.bill,
    }),
    forme: inspectForme({
      dry: result.dry,
      billed: result.billed,
      backgroundLive: result.backgroundLive,
      stopDirty: result.stopDirty,
      forme: input && input.forme,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      billed:
        result.billed === true ||
        result.verdict === "billed" ||
        result.verdict === "galley",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      firingCount: FIRING_COUNT,
      sessionCost: SESSION_COST,
      billableTokens: BILLABLE_TOKENS,
      cacheReadPct: CACHE_READ_PCT,
      modelCalls: MODEL_CALLS,
      subagentFirings: SUBAGENT_FIRINGS,
      stopExit: STOP_EXIT,
      plaques: GALLEY_PLAQUES,
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
        "NON-BINDING: harness could consult live background_tasks / agent status before blocking Stop. Verify against #93745 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
