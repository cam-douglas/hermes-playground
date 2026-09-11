#!/usr/bin/env node
/**
 * Followspot — theatrical followspot / stage booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop (Linux) spawn_task chip sessions start without the user's
 * claude_desktop_config.json MCP servers. Chip-spawn first turn sees
 * only app-internal MCP (mcp_count 8–9). Configured servers attach
 * (LocalSessions.replaceEnabledMcpTools + reconcileServers) only when
 * the spawned session is focused (LocalSessions.setFocusedSession).
 * Even after attach, the model gets deferred_tools_delta only at the
 * next queued user turn — a message steered into the running turn
 * does not carry it. ToolSearch returns "No matching deferred tools
 * found" until that next queued cue. Normal sessions start at
 * mcp_count 15–16. MCP servers themselves stay healthy.
 *
 *   node followspot.mjs data/dark.json
 *   echo '{"seed":"dark"}' | node followspot.mjs
 *
 * Idle word is lit (HOLD: user MCP belt armed at spawn, same as
 * normally started sessions).
 * Seeded word is dark (#93714 — chip-spawn starts internal-only;
 * user MCP absent until focus + next queued turn).
 * Path word is spawn-mcp-focus.
 * Product score word is followspot (Score followspot or admit lit.).
 *
 * Encoded from anthropics/claude-code#93714 issue text only.
 * Hypothesis (NON-BINDING): chip-spawn path may skip the MCP attach
 * that normal session start runs, deferring replaceEnabledMcpTools
 * until setFocusedSession, and deferred_tools_delta may only attach
 * on queued user turns not mid-turn steers. Verify against #93714
 * text only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits. No live
 * Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "lit",
  "dark",
  "followspot",
  "spawn-mcp-focus",
  "hold",
  "chip-spawn",
  "internal-only",
  "focus-attach",
  "mid-turn-steer",
  "next-queued-cue",
  "toolsearch-empty",
  "healthy-servers",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "lit";
export const PATH_WORD = "spawn-mcp-focus";
export const SEEDED_WORD = "dark";
export const PRODUCT_WORD = "followspot";
export const HOLD = Object.freeze(["lit", "hold"]);
export const RECOVER = Object.freeze(["lit", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "dark" && name !== "followspot"),
);

export const FEATURED_ISSUE = 93714;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93714";
export const TITLE =
  "[BUG] Desktop (Linux): spawn_task sessions still start without claude_desktop_config.json MCP servers; attach happens on UI focus, tools reach the model only on the next queued turn (re: #67432)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:mcp",
  "area:agents",
  "area:desktop",
]);
export const PLATFORM = "Linux";
export const DESKTOP_VERSION = "1.49585.0";
export const CODE_VERSION = "2.1.260";
export const OS_NAME = "Ubuntu";
export const LOCAL_SERVER_COUNT = 7;
export const NORMAL_MCP_MIN = 15;
export const NORMAL_MCP_MAX = 16;
export const CHIP_MCP_COUNTS = Object.freeze([9, 9, 8]);
export const INTERNAL_SERVERS = Object.freeze([
  "ccd_directory",
  "ccd_session_mgmt",
  "mcp-registry",
  "scheduled-tasks",
]);
export const TOOL_COUNT_AFTER_ATTACH = 243;
export const TOTAL_AFTER_RECONCILE = 15;
export const CONFIG_PATH = "~/.config/Claude/claude_desktop_config.json";
export const PHRASE = "Score followspot or admit lit.";
export const DISTRIBUTION =
  "Claude Desktop 1.49585.0 Linux; Claude Code 2.1.260; Ubuntu. Seven local stdio MCP servers in ~/.config/Claude/claude_desktop_config.json. Sessions started from a spawn_task chip begin the first turn with only app-internal MCP servers. ToolSearch for configured servers returns \"No matching deferred tools found\". CCD start-timing: chip-spawn mcp_count=8/9 (internal only); normal sessions mcp_count=15/16. Configured servers attach (LocalSessions.replaceEnabledMcpTools + reconcileServers) only when the spawned session is focused (LocalSessions.setFocusedSession), not at start. Even after attach, the model gets deferred_tools_delta only at the next queued user turn. A message steered into the running turn does not carry it.";
export const SESSION_KIND =
  "Desktop spawn_task chip session. Session C UTC: 20:18:49 spawned-task started mcp_count=8; 20:18:50 first-turn deferred_tools_delta internal only (ccd_directory, ccd_session_mgmt, mcp-registry, scheduled-tasks, …); 20:19:26 setFocusedSession → replaceEnabledMcpTools toolCount=243 → reconcileServers created=[7 local servers] total=15; 20:19:45 ToolSearch no match; 20:20:10 steered message into running turn → NO deferred_tools_delta; ~20:20:27 ToolSearch still no match; 20:28:29 next queued user message → deferred_tools_delta adds all 7 local servers. MCP servers healthy since 20:07; tools/list ~200ms.";

export const CHIP_PLAQUES = Object.freeze([
  { id: "normal", label: "normal ×5", mcpCount: "15–16", firstReplace: "same second to +2s" },
  { id: "chip-a", label: "chip A", mcpCount: "9", firstReplace: "+2m6s" },
  { id: "chip-b", label: "chip B", mcpCount: "9", firstReplace: "+2s" },
  { id: "chip-c", label: "chip C", mcpCount: "8", firstReplace: "+37s (same second as setFocusedSession)" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "beam",
    survey: "strike the followspot (the beam should light the full user MCP belt when the chip opens)",
    kind: "beam",
    note: "seeded: beam stays dark — chip-spawn house is internal-only mcp_count 8–9",
  },
  {
    id: "house",
    survey: "read the house (dark theatre until the operator focuses the spawned session)",
    kind: "house",
    note: "seeded: house stays dark until setFocusedSession; first-turn delta is internal only",
  },
  {
    id: "iris",
    survey: "open the operator iris (focus should not be required to arm the belt)",
    kind: "iris",
    note: "seeded: replaceEnabledMcpTools + reconcileServers wait for setFocusedSession",
  },
  {
    id: "cue",
    survey: "read the prompt book (deferred_tools_delta should ride the next steered message)",
    kind: "cue",
    note: "seeded: mid-turn steer carries no delta; next queued cue finally adds the 7 local servers",
  },
  {
    id: "props",
    survey: "check the prop belt (7 local stdio MCP servers should be armed at spawn)",
    kind: "props",
    note: "seeded: props arrive late — ToolSearch finds nothing until the next queued cue",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "spawn-mcp-focus",
  "dark",
  "chip-spawn",
  "internal-only",
  "focus-attach",
  "mid-turn-steer",
  "toolsearch-empty",
  "next-queued-cue",
]);

export const COUSINS = Object.freeze([
  {
    issue: 67432,
    title: "spawn_task chips start without external MCP until first user message",
    state: "CLOSED",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — same class; closed by inactivity bot; still reproduces per #93714. Do not rebuild",
  },
  {
    issue: 90061,
    title: "Desktop replaceRemoteMcpServers never applied to in-flight turn; first turn of fresh sessions lacks connector tools",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — related but different surface (connectors push / in-flight turn). Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93683,
    title: "tool-result instruction injection / Rider",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93703,
    title: "Monadnock (submodule worktree local main)",
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
    title: "Windows/Git Bash ~8175 truncation + backslash",
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
  "sluice",
  "spillway",
  "leat",
  "portcullis",
  "postern",
  "embrasure",
  "wicket",
  "gnomon",
  "almanac",
  "clepsydra",
]);

export const SAMPLE_BEAM = Object.freeze({
  armed: false,
  dark: true,
});

export const SAMPLE_LIT_BEAM = Object.freeze({
  armed: true,
  dark: false,
});

export const SAMPLE_HOUSE = Object.freeze({
  internalOnly: true,
  mcpCount: 8,
});

export const SAMPLE_LIT_HOUSE = Object.freeze({
  internalOnly: false,
  mcpCount: 15,
});

export const SAMPLE_IRIS = Object.freeze({
  focusRequired: true,
});

export const SAMPLE_LIT_IRIS = Object.freeze({
  focusRequired: false,
});

export const SAMPLE_CUE = Object.freeze({
  midTurnSteer: true,
  queuedDelta: true,
});

export const SAMPLE_LIT_CUE = Object.freeze({
  midTurnSteer: false,
  queuedDelta: false,
});

export const SAMPLE_PROPS = Object.freeze({
  late: true,
  toolsearchEmpty: true,
});

export const SAMPLE_LIT_PROPS = Object.freeze({
  late: false,
  toolsearchEmpty: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "user MCP belt armed at spawn, same as normally started sessions" },
  { t: "chip", line: "Code-tab session: Claude calls spawn_task; operator clicks the chip" },
  { t: "spawn", line: "20:18:49 spawned-task started; mcp_count=8 (internal only)" },
  { t: "delta", line: "20:18:50 first-turn deferred_tools_delta: ccd_directory, ccd_session_mgmt, mcp-registry, scheduled-tasks" },
  { t: "focus", line: "20:19:26 setFocusedSession → replaceEnabledMcpTools toolCount=243 → reconcileServers created=7 total=15" },
  { t: "search", line: "20:19:45 ToolSearch → no matching deferred tools found" },
  { t: "steer", line: "20:20:10 steered message into running turn → NO deferred_tools_delta" },
  { t: "still", line: "~20:20:27 ToolSearch still no matching deferred tools found" },
  { t: "queue", line: "20:28:29 next queued user message → deferred_tools_delta adds all 7 local servers" },
  { t: "health", line: "MCP servers connected since 20:07; tools/list ~200ms — props themselves are healthy" },
  { t: "path", line: "spawn-mcp-focus — attach waits for UI focus; model sees the belt only on the next queued cue" },
  { t: "score", line: "when the beam stays dark until focus the house is a followspot — Score followspot or admit lit." },
]);

export function inspectBeam(input = {}) {
  const beam =
    input.beam && typeof input.beam === "object"
      ? input.beam
      : input.lit === true && input.dark !== true
        ? SAMPLE_LIT_BEAM
        : SAMPLE_BEAM;
  const forcedDark =
    input.dark === true ||
    input.chipSpawn === true ||
    input.event === "dark" ||
    input.event === "followspot" ||
    input.event === "chip-spawn" ||
    input.spawnMcpFocus === true;
  const dark = forcedDark ? true : beam.dark === true && input.lit !== true;
  return {
    armed: !dark,
    dark,
    stamp: dark ? "dark" : "lit",
    note: dark
      ? "followspot beam stays dark — chip-spawn house is internal-only mcp_count 8–9"
      : "followspot beam lights the full user MCP belt at spawn",
  };
}

export function inspectHouse(input = {}) {
  const house =
    input.house && typeof input.house === "object"
      ? input.house
      : input.lit === true && input.dark !== true
        ? SAMPLE_LIT_HOUSE
        : SAMPLE_HOUSE;
  const forcedInternal =
    input.internalOnly === true ||
    input.event === "internal-only" ||
    input.spawnMcpFocus === true ||
    (input.dark === true && input.lit !== true);
  const internalOnly = forcedInternal
    ? true
    : house.internalOnly === true && house.mcpCount < NORMAL_MCP_MIN;
  return {
    internalOnly,
    mcpCount: internalOnly ? house.mcpCount || 8 : house.mcpCount || 15,
    stamp: internalOnly ? "internal-only" : "full-belt",
    note: internalOnly
      ? "house dark — chip-spawn mcp_count 8–9 (internal only); normal sessions 15–16"
      : "house lit — user MCP belt armed at spawn (mcp_count 15–16)",
  };
}

export function inspectIris(input = {}) {
  const iris =
    input.iris && typeof input.iris === "object"
      ? input.iris
      : input.lit === true && input.dark !== true
        ? SAMPLE_LIT_IRIS
        : SAMPLE_IRIS;
  const forcedFocus =
    input.focusAttach === true ||
    input.event === "focus-attach" ||
    input.chipSpawn === true ||
    (input.dark === true && input.lit !== true);
  const focusRequired = forcedFocus ? true : iris.focusRequired === true;
  return {
    focusRequired,
    stamp: focusRequired ? "focus-attach" : "spawn-attach",
    note: focusRequired
      ? "operator iris closed — replaceEnabledMcpTools waits for setFocusedSession"
      : "operator iris open — MCP attach runs at session start, not on focus",
  };
}

export function inspectCue(input = {}) {
  const cueBook =
    input.cueBook && typeof input.cueBook === "object"
      ? input.cueBook
      : input.lit === true && input.dark !== true
        ? SAMPLE_LIT_CUE
        : SAMPLE_CUE;
  const forcedSteer =
    input.event === "next-queued-cue" && input.lit !== true
      ? true
      : input.spawnMcpFocus === true ||
        input.dark === true ||
        input.event === "followspot" ||
        input.midTurnSteer === true;
  const midTurnSteer = forcedSteer ? true : cueBook.midTurnSteer === true;
  return {
    midTurnSteer,
    queuedDelta: midTurnSteer || cueBook.queuedDelta === true,
    stamp: midTurnSteer ? "queued-late" : "steer-carries",
    note: midTurnSteer
      ? "mid-turn steer carries no deferred_tools_delta; next queued cue finally adds the 7 local servers"
      : "deferred_tools_delta rides the next steered message or tool result",
  };
}

export function inspectProps(input = {}) {
  const props =
    input.props && typeof input.props === "object"
      ? input.props
      : input.lit === true && input.dark !== true
        ? SAMPLE_LIT_PROPS
        : SAMPLE_PROPS;
  const forcedLate =
    input.toolsearchEmpty === true ||
    input.event === "toolsearch-empty" ||
    input.nextQueuedCue === true ||
    input.event === "next-queued-cue" ||
    (input.dark === true && input.lit !== true);
  const late = forcedLate ? true : props.late === true;
  return {
    late,
    toolsearchEmpty: late || props.toolsearchEmpty === true,
    stamp: late ? "late" : "armed",
    note: late
      ? "prop belt late — ToolSearch finds nothing until the next queued cue"
      : "prop belt armed at spawn — 7 local stdio servers reachable on the first turn",
  };
}

export function readBooth(input = {}) {
  const beam = inspectBeam(input);
  const house = inspectHouse(input);
  const iris = inspectIris(input);
  const cueBook = inspectCue(input);
  const props = inspectProps(input);
  const dark =
    input.lit !== true &&
    ((beam.dark && house.internalOnly) ||
      (iris.focusRequired && props.late) ||
      input.dark === true);
  const lit = input.lit === true && dark !== true && !beam.dark;
  const path =
    iris.focusRequired &&
    (input.event === "spawn-mcp-focus" || input.spawnMcpFocus === true);
  return {
    beam,
    house,
    iris,
    cue: cueBook,
    props,
    plaques: CHIP_PLAQUES,
    stations: BOOTH_STATIONS,
    dark: dark && !lit && !path,
    lit:
      lit ||
      (!beam.dark &&
        !house.internalOnly &&
        input.dark !== true &&
        input.spawnMcpFocus !== true),
    spawnMcpFocus: path && !lit,
    mark:
      path && !lit
        ? "spawn-mcp-focus"
        : dark && !lit
          ? "dark"
          : "lit",
  };
}

/**
 * Published followspot walk from #93714 only. Facts from the issue text.
 * A lit booth arms the user MCP belt at spawn.
 * A dark booth starts chip-spawn internal-only until focus + next queued cue.
 * A spawn-mcp-focus booth names the focus-gated attach as the path.
 */
export const FOLLOWSPOT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-lit",
    lit: true,
    dark: false,
    cue: "lit",
    note: "idle HOLD: user MCP belt armed at spawn, same as normally started sessions",
  },
  {
    t: "health",
    event: "healthy-servers",
    lit: true,
    healthyServers: true,
    cue: "lit",
    note: "MCP servers connected since 20:07; tools/list ~200ms — props themselves are healthy",
  },
  {
    t: "chip",
    event: "chip-spawn",
    dark: true,
    chipSpawn: true,
    cue: "dark",
    note: "Code-tab session: Claude calls spawn_task; operator clicks the chip",
  },
  {
    t: "spawn",
    event: "internal-only",
    dark: true,
    internalOnly: true,
    cue: "dark",
    note: "20:18:49 spawned-task started; mcp_count=8 (internal only)",
  },
  {
    t: "delta",
    event: "internal-only",
    dark: true,
    internalOnly: true,
    cue: "dark",
    note: "20:18:50 first-turn deferred_tools_delta: only internal servers",
  },
  {
    t: "focus",
    event: "focus-attach",
    dark: true,
    focusAttach: true,
    cue: "dark",
    note: "20:19:26 setFocusedSession → replaceEnabledMcpTools toolCount=243 → reconcileServers created=7 total=15",
  },
  {
    t: "search",
    event: "toolsearch-empty",
    dark: true,
    toolsearchEmpty: true,
    cue: "dark",
    note: "20:19:45 ToolSearch → no matching deferred tools found",
  },
  {
    t: "steer",
    event: "mid-turn-steer",
    dark: true,
    midTurnSteer: true,
    cue: "dark",
    note: "20:20:10 steered message into running turn → NO deferred_tools_delta",
  },
  {
    t: "still",
    event: "toolsearch-empty",
    dark: true,
    toolsearchEmpty: true,
    cue: "dark",
    note: "~20:20:27 ToolSearch still no matching deferred tools found",
  },
  {
    t: "queue",
    event: "next-queued-cue",
    dark: true,
    nextQueuedCue: true,
    cue: "dark",
    note: "20:28:29 next queued user message → deferred_tools_delta adds all 7 local servers",
  },
  {
    t: "path",
    event: "spawn-mcp-focus",
    dark: true,
    spawnMcpFocus: true,
    focusAttach: true,
    chipSpawn: true,
    cue: "dark",
    note: "spawn-mcp-focus — attach waits for UI focus; model sees the belt only on the next queued cue",
  },
  {
    t: "score",
    event: "followspot",
    dark: true,
    chipSpawn: true,
    internalOnly: true,
    focusAttach: true,
    midTurnSteer: true,
    nextQueuedCue: true,
    toolsearchEmpty: true,
    spawnMcpFocus: true,
    cue: "dark",
    note: "followspot — when the beam stays dark until focus the house never lights the belt at spawn",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "healthy-servers",
    lit: true,
    healthyServers: true,
    cue: "lit",
    note: "positive control: MCP servers healthy; attach at spawn like a normal session",
  },
  {
    t: "normal",
    event: "cue-lit",
    lit: true,
    cue: "lit",
    note: "positive control: normal session mcp_count 15–16; replaceEnabledMcpTools same second to +2s",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    lit: true,
    dark: false,
    healthyServers: true,
    cue: "lit",
  };
}

export function seedLit() {
  return { ...emptyTicket() };
}

export function seedDark() {
  return {
    seed: SEEDED_WORD,
    lit: false,
    dark: true,
    chipSpawn: true,
    internalOnly: true,
    focusAttach: true,
    midTurnSteer: true,
    nextQueuedCue: true,
    toolsearchEmpty: true,
    spawnMcpFocus: true,
    cue: "dark",
    issue: FEATURED_ISSUE,
    beam: SAMPLE_BEAM,
    house: SAMPLE_HOUSE,
    iris: SAMPLE_IRIS,
    cueBook: SAMPLE_CUE,
    props: SAMPLE_PROPS,
  };
}

export function seedFollowspot() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    dark: true,
    chipSpawn: true,
    internalOnly: true,
    focusAttach: true,
    midTurnSteer: true,
    nextQueuedCue: true,
    toolsearchEmpty: true,
    spawnMcpFocus: true,
    cue: "dark",
  };
}

export function seedSpawnMcpFocus() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    dark: true,
    spawnMcpFocus: true,
    focusAttach: true,
    chipSpawn: true,
    event: "spawn-mcp-focus",
    cue: "dark",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    lit: true,
    cue: "lit",
  };
}

export function seedChipSpawn() {
  return {
    seed: "chip-spawn",
    preferSeed: true,
    chipSpawn: true,
    cue: "dark",
  };
}

export function seedInternalOnly() {
  return {
    seed: "internal-only",
    preferSeed: true,
    internalOnly: true,
    cue: "dark",
  };
}

export function seedFocusAttach() {
  return {
    seed: "focus-attach",
    preferSeed: true,
    focusAttach: true,
    cue: "dark",
  };
}

export function seedMidTurnSteer() {
  return {
    seed: "mid-turn-steer",
    preferSeed: true,
    midTurnSteer: true,
    cue: "dark",
  };
}

export function seedNextQueuedCue() {
  return {
    seed: "next-queued-cue",
    preferSeed: true,
    nextQueuedCue: true,
    cue: "dark",
  };
}

export function seedToolsearchEmpty() {
  return {
    seed: "toolsearch-empty",
    preferSeed: true,
    toolsearchEmpty: true,
    cue: "dark",
  };
}

export function seedHealthyServers() {
  return {
    seed: "healthy-servers",
    preferSeed: true,
    healthyServers: true,
    cue: "lit",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      lit: false,
      dark: false,
      spawnMcpFocus: false,
      chipSpawn: false,
      internalOnly: false,
      focusAttach: false,
      midTurnSteer: false,
      nextQueuedCue: false,
      toolsearchEmpty: false,
      healthyServers: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    lit: raw.lit === true,
    dark:
      raw.dark === true ||
      raw.event === "dark" ||
      raw.event === "followspot",
    spawnMcpFocus: raw.spawnMcpFocus === true || raw.event === "spawn-mcp-focus",
    chipSpawn: raw.chipSpawn === true || raw.event === "chip-spawn",
    internalOnly: raw.internalOnly === true || raw.event === "internal-only",
    focusAttach: raw.focusAttach === true || raw.event === "focus-attach",
    midTurnSteer: raw.midTurnSteer === true || raw.event === "mid-turn-steer",
    nextQueuedCue:
      raw.nextQueuedCue === true || raw.event === "next-queued-cue",
    toolsearchEmpty:
      raw.toolsearchEmpty === true || raw.event === "toolsearch-empty",
    healthyServers:
      raw.healthyServers === true || raw.event === "healthy-servers",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    beam: raw.beam,
    house: raw.house,
    iris: raw.iris,
    cueBook: raw.cueBook,
    props: raw.props,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.lit != null ||
        ticket.dark != null ||
        ticket.spawnMcpFocus != null ||
        ticket.chipSpawn != null ||
        ticket.internalOnly != null ||
        ticket.focusAttach != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.beam ||
        ticket.house ||
        ticket.iris),
  );
}

function isLit(row) {
  if (row.dark && row.cue !== "lit") return false;
  if (
    row.cue === "dark" ||
    row.cue === "followspot" ||
    row.cue === "spawn-mcp-focus"
  ) {
    return false;
  }
  if (
    row.chipSpawn &&
    row.internalOnly &&
    row.cue !== "lit" &&
    row.lit !== true
  ) {
    return false;
  }
  if (
    row.spawnMcpFocus &&
    row.focusAttach &&
    row.cue !== "lit" &&
    row.lit !== true
  ) {
    return false;
  }
  if (row.lit === true && row.dark !== true && row.cue !== "dark") {
    return true;
  }
  if (
    row.cue === "lit" &&
    row.dark !== true &&
    row.chipSpawn !== true &&
    row.spawnMcpFocus !== true
  ) {
    return true;
  }
  if (
    row.healthyServers === true &&
    row.dark !== true &&
    row.chipSpawn !== true &&
    row.internalOnly !== true &&
    row.spawnMcpFocus !== true
  ) {
    return true;
  }
  return false;
}

function isSpawnMcpFocusPath(row) {
  return (
    row.event === "spawn-mcp-focus" &&
    !isLit(row) &&
    (row.spawnMcpFocus === true ||
      row.focusAttach === true ||
      row.chipSpawn === true)
  );
}

function isDark(row) {
  if (isLit(row)) return false;
  if (isSpawnMcpFocusPath(row) && row.cue !== "dark") return false;
  if (row.cue === "dark" || row.cue === "followspot") return true;
  if (row.dark === true) return true;
  if (
    row.chipSpawn === true &&
    row.internalOnly === true &&
    row.toolsearchEmpty === true
  ) {
    return true;
  }
  if (row.chipSpawn === true && row.internalOnly === true) {
    return true;
  }
  if (
    row.chipSpawn === true ||
    row.internalOnly === true ||
    row.focusAttach === true ||
    row.midTurnSteer === true ||
    row.toolsearchEmpty === true ||
    (row.spawnMcpFocus === true && row.nextQueuedCue === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one followspot pass against the stage booth.
 * lit: user MCP belt armed at spawn, same as normally started sessions.
 * dark / followspot: chip-spawn starts internal-only; user MCP absent until focus + next queued turn.
 * spawn-mcp-focus: attach waits for UI focus; model sees the belt only on the next queued cue.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSpawnMcpFocusPath(row) ||
    (row.spawnMcpFocus && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "spawn-mcp-focus";
  } else if (isDark(row)) {
    verdict = "followspot";
  } else if (isLit(row)) {
    verdict = "lit";
  } else if (
    row.chipSpawn ||
    row.internalOnly ||
    row.focusAttach ||
    (row.spawnMcpFocus && !row.healthyServers)
  ) {
    verdict = "followspot";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const beam = inspectBeam(row);
  const house = inspectHouse(row);
  const iris = inspectIris(row);
  const cueBook = inspectCue(row);
  const props = inspectProps(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    lit: verdict === "lit" || verdict === "hold",
    dark:
      verdict === "dark" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    spawnMcpFocus:
      row.spawnMcpFocus === true ||
      verdict === "spawn-mcp-focus" ||
      verdict === PATH_WORD,
    chipSpawn: row.chipSpawn,
    internalOnly: row.internalOnly,
    focusAttach: row.focusAttach,
    midTurnSteer: row.midTurnSteer,
    nextQueuedCue: row.nextQueuedCue,
    toolsearchEmpty: row.toolsearchEmpty,
    healthyServers: row.healthyServers,
    cue: hold
      ? "lit"
      : row.spawnMcpFocus || verdict === "spawn-mcp-focus"
        ? "spawn-mcp-focus"
        : "dark",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit lit" : "score followspot",
    beamInspect: beam,
    houseInspect: house,
    irisInspect: iris,
    cueInspect: cueBook,
    propsInspect: props,
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
      : FOLLOWSPOT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dark = scored.filter(
    (row) => row.verdict === "followspot" || row.verdict === "dark",
  );
  const path = scored.filter((row) => row.verdict === "spawn-mcp-focus");
  const lit = scored.filter((row) => row.verdict === "lit");
  const headline =
    scored.find((row) => row.event === "dark") ||
    scored.find((row) => row.event === "spawn-mcp-focus") ||
    scored.find((row) => row.event === "chip-spawn") ||
    dark[dark.length - 1];
  let verdict = "lit";
  if (dark.length) verdict = "followspot";
  else if (path.length && !lit.length) verdict = "spawn-mcp-focus";
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
    darkCount: dark.length,
    pathCount: path.length,
    litCount: lit.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit lit" : "score followspot",
    note: headline
      ? "Desktop Linux spawn_task chip; first turn internal-only mcp_count 8–9; attach on setFocusedSession; deferred_tools_delta only on the next queued turn."
      : "published followspot walk scored against lit vs dark",
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
    seeded !== "lit" &&
    seeded !== "dark" &&
    seeded !== "spawn-mcp-focus" &&
    seeded !== "followspot" &&
    ticket.lit == null &&
    ticket.dark == null &&
    ticket.chipSpawn == null &&
    ticket.spawnMcpFocus == null &&
    ticket.internalOnly == null &&
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
    lit: scored.lit ?? false,
    dark: scored.dark ?? false,
    spawnMcpFocus: scored.spawnMcpFocus ?? false,
    chipSpawn: scored.chipSpawn ?? false,
    internalOnly: scored.internalOnly ?? false,
    focusAttach: scored.focusAttach ?? false,
    midTurnSteer: scored.midTurnSteer ?? false,
    nextQueuedCue: scored.nextQueuedCue ?? false,
    toolsearchEmpty: scored.toolsearchEmpty ?? false,
    healthyServers: scored.healthyServers ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.lit && !result.dark ? "beam=lit" : "beam=dark",
    result.internalOnly || result.dark ? "house=internal-only" : "house=full-belt",
    result.focusAttach || result.dark ? "iris=focus-attach" : "iris=spawn-attach",
    result.spawnMcpFocus || result.dark ? "cue=queued-late" : "cue=steer-carries",
    result.toolsearchEmpty || result.dark ? "props=late" : "props=armed",
    result.spawnMcpFocus || result.verdict === "spawn-mcp-focus"
      ? "path=spawn-mcp-focus"
      : "path=lit",
    result.cue === "lit"
      ? "cue=lit"
      : result.cue === "spawn-mcp-focus"
        ? "cue=spawn-mcp-focus"
        : "cue=dark",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    lit: result.lit,
    dark: result.dark,
    spawnMcpFocus: result.spawnMcpFocus,
    chipSpawn: result.chipSpawn,
    internalOnly: result.internalOnly,
    focusAttach: result.focusAttach,
    midTurnSteer: result.midTurnSteer,
    nextQueuedCue: result.nextQueuedCue,
    toolsearchEmpty: result.toolsearchEmpty,
    healthyServers: result.healthyServers,
    beam: input && input.beam,
    house: input && input.house,
    iris: input && input.iris,
    cueBook: input && input.cueBook,
    props: input && input.props,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    beam: inspectBeam({
      lit: result.lit,
      dark: result.dark,
      chipSpawn: result.chipSpawn,
      spawnMcpFocus: result.spawnMcpFocus,
      beam: input && input.beam,
    }),
    house: inspectHouse({
      lit: result.lit,
      dark: result.dark,
      internalOnly: result.internalOnly,
      spawnMcpFocus: result.spawnMcpFocus,
      house: input && input.house,
    }),
    iris: inspectIris({
      lit: result.lit,
      dark: result.dark,
      focusAttach: result.focusAttach,
      chipSpawn: result.chipSpawn,
      iris: input && input.iris,
    }),
    cueBook: inspectCue({
      lit: result.lit,
      dark: result.dark,
      spawnMcpFocus: result.spawnMcpFocus,
      midTurnSteer: result.midTurnSteer,
      cueBook: input && input.cueBook,
    }),
    props: inspectProps({
      lit: result.lit,
      dark: result.dark,
      toolsearchEmpty: result.toolsearchEmpty,
      nextQueuedCue: result.nextQueuedCue,
      props: input && input.props,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      dark:
        result.dark === true ||
        result.verdict === "dark" ||
        result.verdict === "followspot",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      desktopVersion: DESKTOP_VERSION,
      codeVersion: CODE_VERSION,
      osName: OS_NAME,
      localServerCount: LOCAL_SERVER_COUNT,
      normalMcpMin: NORMAL_MCP_MIN,
      normalMcpMax: NORMAL_MCP_MAX,
      chipMcpCounts: [...CHIP_MCP_COUNTS],
      internalServers: [...INTERNAL_SERVERS],
      toolCountAfterAttach: TOOL_COUNT_AFTER_ATTACH,
      totalAfterReconcile: TOTAL_AFTER_RECONCILE,
      configPath: CONFIG_PATH,
      plaques: CHIP_PLAQUES,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "Chip-spawned sessions should attach the same MCP at start as normal/scheduled sessions; mid-turn delta should deliver with the next steered message or tool result.",
      ],
      hypothesis:
        "NON-BINDING: chip-spawn path may skip the MCP attach that normal session start runs, deferring replaceEnabledMcpTools until setFocusedSession, and deferred_tools_delta may only attach on queued user turns not mid-turn steers. Verify against #93714 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
