#!/usr/bin/env node
/**
 * Proscription — Roman outlaw list / wax-tablet forum /
 * iron stylus / marble lintel / torch-lit senate chamber.
 *
 * Educational diagnostic model for a published Claude Code
 * subagent defect: a custom subagent in ~/.claude/agents/*.md
 * with a frontmatter `disallowedTools` list still receives and
 * can call every tool on that list. Docs say tools in
 * disallowedTools should be removed from the subagent.
 *
 * Encoded from anthropics/claude-code#94202 issue text only.
 * Hypothesis (NON-BINDING): frontmatter disallowedTools is
 * parsed/stored but never applied when building the subagent's
 * tool set / ToolSearch surface; auto classifier is a separate
 * gate. Invite verify against issue text only.
 * Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude.
 *
 *   node proscription.mjs data/proscription.json
 *   echo '{"seed":"proscription"}' | node proscription.mjs
 *
 * Idle word is barred (HOLD: deny list actually strips tools).
 * HOLD aliases: barred, denied, struck, excised, absent, stripped.
 * Seeded word is proscription (#94202 — the deny-list-hollow path).
 * Path word is deny-list-hollow.
 * Product score word is proscription (Score proscription or admit barred.).
 *
 * NOT Thimblerig/#94174. NOT Fetchling/#94065. NOT Souffleur/#94031.
 * NOT Epitome/#94032. NOT Diabolica/#94040. NOT Sallyport/#94082.
 * NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052.
 * NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus.
 * NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage/#92596.
 * NOT Phosphene. NOT Scotoma. NOT Scrim. NOT Aphonia/#92409.
 * NOT Sourdine/#93531. NOT Anarthria/#93782.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #78063 — parent agent's disallowedTools not inherited by
 * subagents it spawns. Proscription is specifically the
 * subagent's OWN template disallowedTools not applying to
 * that subagent.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "barred",
  "proscription",
  "deny-list-hollow",
  "hold",
  "denied",
  "struck",
  "excised",
  "absent",
  "stripped",
  "bash-still-loaded",
  "websearch-executes",
  "mcp-full-name-executes",
  "classifier-only-denial",
  "four-spawns",
  "template-read-at-spawn",
  "prefix-glob-no-effect",
  "deny-probe",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "barred";
export const PATH_WORD = "deny-list-hollow";
export const SEEDED_WORD = "proscription";
export const PRODUCT_WORD = "proscription";
export const HOLD = Object.freeze(["barred", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "barred",
  "denied",
  "struck",
  "excised",
  "absent",
  "stripped",
]);
export const RECOVER = Object.freeze(["barred", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "sealed",
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "latent",
  "flushed",
  "articulate",
  "limber",
  "primed",
  "lit",
  "voiced",
  "mute",
  "rostered",
  "quieted",
  "unrung",
  "demesned",
  "diagrammed",
  "traced",
  "damped",
  "mounted",
  "warm",
  "honest",
  "afloat",
  "concordant",
  "routed",
  "bound",
  "preserved",
  "raised",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "skill-row-carve",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "skill-row-carve",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
]);

export const FEATURED_ISSUE = 94202;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94202";
export const TITLE =
  "[BUG] Subagent frontmatter disallowedTools is not enforced: Bash, WebSearch and MCP tools listed there still load and run";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:tools",
  "area:agents",
  "area:permissions",
]);
export const PLATFORM = "macos";
export const SURFACE = "deny-list-hollow";
export const HOST =
  "Claude Code custom subagent ~/.claude/agents/*.md frontmatter disallowedTools";
export const CHECKED_ON =
  "Claude Code 2.1.268 (macOS). Changelog 2.1.269/2.1.270 do not mention this area.";
export const BUILD = "Claude Code 2.1.268 (macOS)";
export const SELECTED_MODEL = "claude-opus-5";
export const OS = "macOS";
export const PHRASE = "Score proscription or admit barred.";
export const DOCS_URL =
  "https://code.claude.com/docs/en/sub-agents#available-tools";
export const DISTRIBUTION =
  "A custom subagent in ~/.claude/agents/*.md with a disallowedTools list still receives and can call every tool on that list. Bash on the list → still in loaded function definitions (Agent, Bash, Edit, Read, Skill, ToolSearch, Write) and executes. WebSearch on the list → ToolSearch returns its definition; call runs with real search results. MCP tool listed by full name (mcp__ai-team-os__ecosystem_deep_review_list) → ToolSearch finds it; call runs with real API response. Only denial observed: mcp__ai-team-os__project_delete blocked by auto mode classifier (\"Irreversible Deletion\"), NOT by the deny list. Four independent spawns reproduced (two with 27-entry deny list, two with minimal template). Template body is read at spawn (not a stale registry). Prefix globs (mcp__ai-team-os__ecosystem_*) also had no effect; report is about documented full names. Docs: tools in disallowedTools should be removed from the subagent. Minimal repro: save ~/.claude/agents/deny-probe.md with frontmatter disallowedTools: Bash, WebSearch, (optional MCP full names); spawn via Agent tool with subagent_type deny-probe; ask it to list loaded functions + ToolSearch+call WebSearch/MCP; report found/executed.";

export const RULED_OUT = Object.freeze([
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre/#94055 bash-nul-poison — Bash NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed",
  "Titulus — resume-stale-title; different plaque",
  "Derelict — session-kill-orphan; different hulk",
  "Vestry — mount-refcount-race; different sacristy",
  "Mondegreen — substring-scan; different lyric ear",
  "Afterimage/#92596 — Windows text paint latency (CRT phosphor)",
  "Phosphene — layer-tree-walk; vision flash",
  "Scotoma — /goal lived only in command-args; vision gap",
  "Scrim — runtime DLP redaction; different product",
  "Aphonia/#92409 — missing SendMessage; ENT roster",
  "Sourdine/#93531 — mid-narration mute; concert mute",
  "Anarthria/#93782 — dictation paste drop; laryngology",
]);
export const EXPECTED = Object.freeze([
  "Tools in disallowedTools should be removed from the subagent",
  "Bash on the deny list should not appear in loaded function definitions and should not execute",
  "WebSearch on the deny list should not be returned by ToolSearch and should not run",
  "An MCP tool listed by documented full name should not be found by ToolSearch and should not run",
  "Denial should come from the deny list, not only from the auto mode classifier",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "bash-still-loaded",
    label: "Bash still loaded",
    count: "Agent, Bash, Edit, Read, Skill, ToolSearch, Write",
    note: "Bash on the list still in loaded function definitions and executes",
  },
  {
    id: "websearch-executes",
    label: "WebSearch executes",
    count: "ToolSearch + real search results",
    note: "WebSearch on the list; ToolSearch returns its definition; call runs",
  },
  {
    id: "mcp-full-name-executes",
    label: "MCP full name executes",
    count: "mcp__ai-team-os__ecosystem_deep_review_list",
    note: "ToolSearch finds the documented full name; call runs with real API response",
  },
  {
    id: "classifier-only-denial",
    label: "classifier-only denial",
    count: "Irreversible Deletion",
    note: "mcp__ai-team-os__project_delete blocked by auto mode classifier, NOT by the deny list",
  },
  {
    id: "four-spawns",
    label: "four independent spawns",
    count: "2×27-entry + 2×minimal",
    note: "Four independent spawns reproduced; template body read at spawn (not a stale registry)",
  },
  {
    id: "deny-list-hollow",
    label: "deny-list-hollow",
    count: "disallowedTools unused",
    note: "Frontmatter deny list does not strip the subagent's own tools",
  },
]);

export const TABLET_NAMES = Object.freeze([
  {
    id: "bash-still-loaded",
    lost: "Bash chalked on the tablet still walks the forum and executes",
    control: "Bash on disallowedTools is struck from loaded functions",
    story: "the stylus chalks Bash; the outlaw still walks",
  },
  {
    id: "websearch-executes",
    lost: "WebSearch chalked; ToolSearch still finds it; call runs with real results",
    control: "WebSearch on the list is absent from ToolSearch",
    story: "the chalked name still answers the herald",
  },
  {
    id: "mcp-full-name-executes",
    lost: "mcp__ai-team-os__ecosystem_deep_review_list found and executed",
    control: "documented full MCP name is excised from ToolSearch",
    story: "the full name on the wax still draws a real reply",
  },
  {
    id: "classifier-only-denial",
    lost: "project_delete denied by Irreversible Deletion classifier, not the tablet",
    control: "the deny list itself strikes the name",
    story: "a different gate, not the tablet, turns one name back",
  },
  {
    id: "four-spawns",
    lost: "four independent spawns; two 27-entry lists; two minimal templates",
    control: "each spawn reads the tablet and actually bars the names",
    story: "four readings of the same wax; the names still walk",
  },
  {
    id: "deny-list-hollow",
    lost: "disallowedTools listed but never applied to the subagent tool set",
    control: "the tablet strips every chalked name from the forum",
    story: "the lintel reads PROSCRIPTIO; the forum is still full",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "barred-tablet",
    survey:
      "marble lintel; wax tablet; iron stylus; chalked names actually struck from the forum",
    kind: "barred",
    note: "idle: barred — the hold/good path",
  },
  {
    id: "bash-still-loaded",
    survey:
      "Bash chalked on disallowedTools still in loaded functions and executes",
    kind: "proscription",
    note: "seeded: Bash still walks",
  },
  {
    id: "deny-list-hollow",
    survey:
      "frontmatter disallowedTools is listed but not applied to the subagent tool set / ToolSearch",
    kind: "proscription",
    note: "path: deny-list-hollow names the hollow tablet",
  },
  {
    id: "classifier-only-denial",
    survey:
      "only project_delete is denied, and that by auto mode classifier Irreversible Deletion",
    kind: "proscription",
    note: "seeded: the tablet did not strike that name",
  },
  {
    id: "proscription",
    survey:
      "the booth is proscription — chalked outlaw names still walk the forum",
    kind: "proscription",
    note: "seeded: proscription — Score proscription or admit barred.",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "deny-list-hollow",
  "proscription",
  "bash-still-loaded",
  "websearch-executes",
  "mcp-full-name-executes",
  "classifier-only-denial",
  "four-spawns",
  "template-read-at-spawn",
  "prefix-glob-no-effect",
  "deny-probe",
]);

export const COUSINS = Object.freeze([
  {
    issue: 78063,
    title:
      "parent agent's disallowedTools not inherited by subagents it spawns",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — parent inheritance, not the #94202 subagent's OWN template disallowedTools failing to apply. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059 bg tasks stale Running / ssh stdin hang", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
]);

export const SAMPLE_KIND_IDLE = "absent";
export const SAMPLE_KIND_SEEDED = "deny-list-hollow";
export const SAMPLE_HOLDING_IDLE = "struck";
export const SAMPLE_HOLDING_SEEDED = "still-loaded";

export const SAMPLE_BARRED_PROOF = Object.freeze({
  barred: true,
  proscription: false,
  denyListHollow: false,
  bashStillLoaded: false,
  websearchExecutes: false,
  mcpFullNameExecutes: false,
  classifierOnlyDenial: false,
  fourSpawns: false,
  templateReadAtSpawn: false,
  prefixGlobNoEffect: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_PROSCRIPTION_PROOF = Object.freeze({
  barred: false,
  proscription: true,
  denyListHollow: true,
  bashStillLoaded: true,
  websearchExecutes: true,
  mcpFullNameExecutes: true,
  classifierOnlyDenial: true,
  fourSpawns: true,
  templateReadAtSpawn: true,
  prefixGlobNoEffect: true,
  kind: SAMPLE_KIND_SEEDED,
  names: TABLET_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds barred: deny list actually strips tools; chalked names absent from the forum" },
  { t: "spawn", line: "deny-probe.md frontmatter disallowedTools: Bash, WebSearch, MCP full names" },
  { t: "load", line: "Bash still in loaded functions; WebSearch ToolSearch-found; MCP full name executes" },
  { t: "path", line: "deny-list-hollow — the tablet lists names that still walk" },
  { t: "score", line: "when chalked outlaw names still walk the forum the booth is proscription — Score proscription or admit barred." },
]);

const FORCE_FLAGS = [
  "denyListHollow",
  "bashStillLoaded",
  "websearchExecutes",
  "mcpFullNameExecutes",
  "classifierOnlyDenial",
  "fourSpawns",
  "templateReadAtSpawn",
  "prefixGlobNoEffect",
];

/**
 * Forum map: barred tablet vs hollow proscription.
 * Idle/barred: deny list actually strips tools.
 * Seeded/proscription: chalked names still walk the forum.
 */
export function mapForum(input = {}) {
  const proscription = isProscriptionInput(input);
  const barred = input.barred === true && !proscription;
  return {
    stamp: proscription ? "deny-list-hollow" : "barred-tablet",
    holdingLane: proscription ? "still-loaded" : "struck",
    kindLane: proscription ? "deny-list-hollow" : "absent",
    bindLane: proscription ? "bash-still-loaded" : "stripped",
    ribbon: proscription ? "proscription" : "barred",
    barred,
  };
}

export function inspectTablet(input = {}) {
  const hollow = isProscriptionInput(input);
  if (input.barred === true && !hollow) {
    return {
      stamp: "tablet-struck",
      hollow: false,
      note: "wax tablet holds barred — chalked names are struck",
    };
  }
  return {
    stamp: hollow ? "tablet-hollow" : "tablet-idle",
    hollow,
    note: hollow
      ? "wax tablet lists the names; the stylus never takes them off the forum"
      : "",
  };
}

export function inspectForum(input = {}) {
  const walking = isProscriptionInput(input);
  if (input.barred === true && !walking) {
    return {
      stamp: "forum-absent",
      walking: false,
      edge: "struck",
    };
  }
  return {
    stamp: walking ? "forum-walking" : "forum-idle",
    walking,
    edge: walking ? "still-loaded" : "struck",
    note: walking
      ? "chalked outlaw names still walk the marble forum"
      : "",
  };
}

export function inspectStylus(input = {}) {
  const unused =
    input.denyListHollow === true ||
    input.proscription === true ||
    isProscriptionInput(input);
  if (input.barred === true && !unused) {
    return {
      stamp: "stylus-strikes",
      unused: false,
    };
  }
  return {
    stamp: unused ? "stylus-idle-hollow" : "stylus-idle",
    unused,
    note: unused
      ? "iron stylus chalks the names but does not excise them from the tool set"
      : "",
  };
}

export function inspectLintel(input = {}) {
  const hollow =
    input.denyListHollow === true ||
    input.proscription === true ||
    isProscriptionInput(input);
  if (input.barred === true && !hollow) {
    return {
      stamp: "lintel-barred",
      hollow: false,
    };
  }
  return {
    stamp: hollow ? "lintel-hollow" : "lintel-idle",
    hollow,
    note: hollow
      ? "marble lintel reads PROSCRIPTIO; the chamber still admits every chalked name"
      : "",
  };
}

export function inspectChamber(input = {}) {
  const torch =
    input.proscription === true ||
    isProscriptionInput(input);
  if (input.barred === true && !torch) {
    return {
      stamp: "chamber-barred",
      torch: false,
    };
  }
  return {
    stamp: torch ? "chamber-walking" : "chamber-idle",
    torch,
    note: torch
      ? "torch-lit senate: four independent readings; names still walk"
      : "",
  };
}

export function inspectRoster(input = {}) {
  const loaded =
    input.bashStillLoaded === true ||
    input.proscription === true ||
    isProscriptionInput(input);
  if (input.barred === true && !loaded) {
    return {
      stamp: "roster-stripped",
      loaded: false,
    };
  }
  return {
    stamp: loaded ? "roster-loaded" : "roster-idle",
    loaded,
    note: loaded
      ? "loaded functions still include Bash (Agent, Bash, Edit, Read, Skill, ToolSearch, Write)"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "bash-still-loaded": input.bashStillLoaded,
    "websearch-executes": input.websearchExecutes,
    "mcp-full-name-executes": input.mcpFullNameExecutes,
    "classifier-only-denial": input.classifierOnlyDenial,
    "four-spawns": input.fourSpawns,
    "deny-list-hollow": input.denyListHollow,
  };
  return (
    map[id] === true ||
    input.denyListHollow === true ||
    input.proscription === true
  );
}

function isProscriptionInput(input = {}) {
  return (
    input.proscription === true ||
    input.denyListHollow === true ||
    input.bashStillLoaded === true ||
    input.websearchExecutes === true ||
    input.mcpFullNameExecutes === true ||
    input.classifierOnlyDenial === true ||
    input.fourSpawns === true ||
    input.templateReadAtSpawn === true ||
    input.prefixGlobNoEffect === true
  );
}

export function readBooth(input = {}) {
  const proscription = isProscriptionInput(input);
  const barred = input.barred === true && !proscription;
  return {
    mark: proscription ? "proscription" : "barred",
    barred,
    proscription,
    denyListHollow: input.denyListHollow === true || proscription,
    bashStillLoaded: input.bashStillLoaded === true,
    websearchExecutes: input.websearchExecutes === true,
    mcpFullNameExecutes: input.mcpFullNameExecutes === true,
    classifierOnlyDenial: input.classifierOnlyDenial === true,
    fourSpawns: input.fourSpawns === true,
    templateReadAtSpawn: input.templateReadAtSpawn === true,
    prefixGlobNoEffect: input.prefixGlobNoEffect === true,
    scope: mapForum(input),
    tablet: inspectTablet(input),
    forum: inspectForum(input),
    stylus: inspectStylus(input),
    lintel: inspectLintel(input),
    chamber: inspectChamber(input),
    roster: inspectRoster(input),
    names: TABLET_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const PROSCRIPTION_WALK = Object.freeze([
  {
    t: "idle",
    event: "tablet-barred",
    barred: true,
    proscription: false,
    cue: "barred",
    note: "idle HOLD: deny list actually strips tools; chalked names absent from the forum — the hold/good path",
  },
  {
    t: "spawn",
    event: "deny-probe-spawn",
    proscription: true,
    denyListHollow: true,
    cue: "proscription",
    note: "deny-probe.md frontmatter disallowedTools: Bash, WebSearch, optional MCP full names",
  },
  {
    t: "load",
    event: "bash-still-loaded",
    proscription: true,
    bashStillLoaded: true,
    websearchExecutes: true,
    mcpFullNameExecutes: true,
    cue: "proscription",
    note: "Bash still loaded and executes; WebSearch ToolSearch-found; MCP full name executes",
  },
  {
    t: "path",
    event: "deny-list-hollow",
    proscription: true,
    denyListHollow: true,
    classifierOnlyDenial: true,
    fourSpawns: true,
    templateReadAtSpawn: true,
    prefixGlobNoEffect: true,
    cue: "proscription",
    note: "deny-list-hollow — the tablet lists names that still walk; classifier is a separate gate",
  },
  {
    t: "score",
    event: "proscription",
    proscription: true,
    denyListHollow: true,
    bashStillLoaded: true,
    websearchExecutes: true,
    mcpFullNameExecutes: true,
    classifierOnlyDenial: true,
    fourSpawns: true,
    templateReadAtSpawn: true,
    prefixGlobNoEffect: true,
    cue: "proscription",
    note: "proscription — when chalked outlaw names still walk the forum the booth is proscription",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "tablet-barred",
    barred: true,
    proscription: false,
    cue: "barred",
    note: "positive control: deny list strips tools; names absent; the tablet is barred",
  },
  {
    t: "admit",
    event: "tablet-barred",
    barred: true,
    cue: "barred",
    note: "positive control: the tablet admits barred",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    barred: true,
    proscription: false,
    denyListHollow: false,
    cue: "barred",
  };
}

export function seedBarred() {
  return { ...emptyTicket() };
}

export function seedProscription() {
  return {
    seed: SEEDED_WORD,
    barred: false,
    proscription: true,
    denyListHollow: true,
    bashStillLoaded: true,
    websearchExecutes: true,
    mcpFullNameExecutes: true,
    classifierOnlyDenial: true,
    fourSpawns: true,
    templateReadAtSpawn: true,
    prefixGlobNoEffect: true,
    cue: "proscription",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_PROSCRIPTION_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    proscription: true,
    denyListHollow: true,
    bashStillLoaded: true,
    cue: "proscription",
  };
}

export function seedDenyListHollow() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    proscription: true,
    denyListHollow: true,
    event: "deny-list-hollow",
    cue: "proscription",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    barred: true,
    cue: "barred",
  };
}

export function seedDenied() {
  return {
    seed: "denied",
    preferSeed: true,
    barred: true,
    cue: "barred",
  };
}

export function seedStruck() {
  return {
    seed: "struck",
    preferSeed: true,
    barred: true,
    cue: "barred",
  };
}

export function seedExcised() {
  return {
    seed: "excised",
    preferSeed: true,
    barred: true,
    cue: "barred",
  };
}

export function seedAbsent() {
  return {
    seed: "absent",
    preferSeed: true,
    barred: true,
    cue: "barred",
  };
}

export function seedStripped() {
  return {
    seed: "stripped",
    preferSeed: true,
    barred: true,
    cue: "barred",
  };
}

export function seedBashStillLoaded() {
  return {
    seed: "bash-still-loaded",
    preferSeed: true,
    bashStillLoaded: true,
    cue: "proscription",
  };
}

export function seedWebsearchExecutes() {
  return {
    seed: "websearch-executes",
    preferSeed: true,
    websearchExecutes: true,
    cue: "proscription",
  };
}

export function seedMcpFullNameExecutes() {
  return {
    seed: "mcp-full-name-executes",
    preferSeed: true,
    mcpFullNameExecutes: true,
    cue: "proscription",
  };
}

export function seedClassifierOnlyDenial() {
  return {
    seed: "classifier-only-denial",
    preferSeed: true,
    classifierOnlyDenial: true,
    cue: "proscription",
  };
}

export function seedFourSpawns() {
  return {
    seed: "four-spawns",
    preferSeed: true,
    fourSpawns: true,
    cue: "proscription",
  };
}

export function seedTemplateReadAtSpawn() {
  return {
    seed: "template-read-at-spawn",
    preferSeed: true,
    templateReadAtSpawn: true,
    cue: "proscription",
  };
}

export function seedPrefixGlobNoEffect() {
  return {
    seed: "prefix-glob-no-effect",
    preferSeed: true,
    prefixGlobNoEffect: true,
    cue: "proscription",
  };
}

export function seedDenyProbe() {
  return {
    seed: "deny-probe",
    preferSeed: true,
    cue: "proscription",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      barred: false,
      proscription: false,
      denyListHollow: false,
      bashStillLoaded: false,
      websearchExecutes: false,
      mcpFullNameExecutes: false,
      classifierOnlyDenial: false,
      fourSpawns: false,
      templateReadAtSpawn: false,
      prefixGlobNoEffect: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    barred: raw.barred === true,
    proscription: raw.proscription === true || raw.event === "proscription",
    denyListHollow:
      raw.denyListHollow === true || raw.event === "deny-list-hollow",
    bashStillLoaded:
      raw.bashStillLoaded === true || raw.event === "bash-still-loaded",
    websearchExecutes:
      raw.websearchExecutes === true || raw.event === "websearch-executes",
    mcpFullNameExecutes:
      raw.mcpFullNameExecutes === true ||
      raw.event === "mcp-full-name-executes",
    classifierOnlyDenial:
      raw.classifierOnlyDenial === true ||
      raw.event === "classifier-only-denial",
    fourSpawns: raw.fourSpawns === true || raw.event === "four-spawns",
    templateReadAtSpawn:
      raw.templateReadAtSpawn === true ||
      raw.event === "template-read-at-spawn",
    prefixGlobNoEffect:
      raw.prefixGlobNoEffect === true ||
      raw.event === "prefix-glob-no-effect",
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
      (ticket.barred != null ||
        ticket.proscription != null ||
        ticket.denyListHollow != null ||
        ticket.bashStillLoaded != null ||
        ticket.websearchExecutes != null ||
        ticket.mcpFullNameExecutes != null ||
        ticket.classifierOnlyDenial != null ||
        ticket.fourSpawns != null ||
        ticket.templateReadAtSpawn != null ||
        ticket.prefixGlobNoEffect != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isBarred(row) {
  if (row.proscription && row.cue !== "barred") return false;
  if (row.cue === "proscription" || row.cue === "deny-list-hollow") {
    return false;
  }
  if (
    row.denyListHollow &&
    row.bashStillLoaded &&
    row.cue !== "barred" &&
    row.barred !== true
  ) {
    return false;
  }
  if (
    row.barred === true &&
    row.proscription !== true &&
    row.cue !== "proscription"
  ) {
    return true;
  }
  if (
    row.cue === "barred" &&
    row.proscription !== true &&
    row.denyListHollow !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isDenyListHollow(row) {
  return (
    row.event === "deny-list-hollow" &&
    !isBarred(row) &&
    (row.denyListHollow === true ||
      row.bashStillLoaded === true ||
      row.proscription === true)
  );
}

function isProscriptionRow(row) {
  if (isBarred(row)) return false;
  if (isDenyListHollow(row) && row.cue !== "proscription") return false;
  if (row.cue === "proscription") return true;
  if (row.proscription === true) return true;
  if (row.denyListHollow === true && row.bashStillLoaded === true) {
    return true;
  }
  if (
    row.denyListHollow === true ||
    row.bashStillLoaded === true ||
    row.websearchExecutes === true ||
    row.mcpFullNameExecutes === true ||
    row.classifierOnlyDenial === true ||
    row.fourSpawns === true ||
    row.templateReadAtSpawn === true ||
    row.prefixGlobNoEffect === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one proscription pass against the tablet.
 * barred: deny list actually strips tools.
 * proscription: chalked outlaw names still walk the forum.
 * deny-list-hollow: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isDenyListHollow(row) ||
    (row.denyListHollow &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "deny-list-hollow";
  } else if (isProscriptionRow(row)) {
    verdict = "proscription";
  } else if (isBarred(row)) {
    verdict = "barred";
  } else if (
    row.denyListHollow ||
    row.bashStillLoaded ||
    row.websearchExecutes ||
    row.mcpFullNameExecutes ||
    row.classifierOnlyDenial ||
    row.fourSpawns ||
    row.templateReadAtSpawn ||
    row.prefixGlobNoEffect
  ) {
    verdict = "proscription";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const tablet = inspectTablet(row);
  const forum = inspectForum(row);
  const stylus = inspectStylus(row);
  const lintel = inspectLintel(row);
  const chamber = inspectChamber(row);
  const roster = inspectRoster(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    barred: verdict === "barred" || verdict === "hold",
    proscription: verdict === "proscription" || verdict === SEEDED_WORD,
    denyListHollow:
      row.denyListHollow === true ||
      verdict === "deny-list-hollow" ||
      verdict === PATH_WORD,
    bashStillLoaded: row.bashStillLoaded,
    websearchExecutes: row.websearchExecutes,
    mcpFullNameExecutes: row.mcpFullNameExecutes,
    classifierOnlyDenial: row.classifierOnlyDenial,
    fourSpawns: row.fourSpawns,
    templateReadAtSpawn: row.templateReadAtSpawn,
    prefixGlobNoEffect: row.prefixGlobNoEffect,
    cue: hold
      ? "barred"
      : row.denyListHollow || verdict === "deny-list-hollow"
        ? "deny-list-hollow"
        : "proscription",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit barred" : "score proscription",
    tabletInspect: tablet,
    forumInspect: forum,
    stylusInspect: stylus,
    lintelInspect: lintel,
    chamberInspect: chamber,
    rosterInspect: roster,
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
      : PROSCRIPTION_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "proscription");
  const path = scored.filter((row) => row.verdict === "deny-list-hollow");
  const barred = scored.filter((row) => row.verdict === "barred");
  const headline =
    scored.find((row) => row.event === "proscription") ||
    scored.find((row) => row.event === "deny-list-hollow") ||
    scored.find((row) => row.event === "bash-still-loaded") ||
    charged[charged.length - 1];
  let verdict = "barred";
  if (charged.length) verdict = "proscription";
  else if (path.length && !barred.length) {
    verdict = "deny-list-hollow";
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
    proscriptionCount: charged.length,
    pathCount: path.length,
    barredCount: barred.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit barred" : "score proscription",
    note: headline
      ? "Frontmatter disallowedTools does not strip the subagent's tools. Cousins cite-only: #78063 — do not rebuild, do not conflate."
      : "published proscription walk scored against barred vs proscription",
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
    seeded !== "barred" &&
    seeded !== "proscription" &&
    seeded !== "deny-list-hollow" &&
    ticket.barred == null &&
    ticket.proscription == null &&
    ticket.denyListHollow == null &&
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
    barred: scored.barred ?? false,
    proscription: scored.proscription ?? false,
    denyListHollow: scored.denyListHollow ?? false,
    bashStillLoaded: scored.bashStillLoaded ?? false,
    websearchExecutes: scored.websearchExecutes ?? false,
    mcpFullNameExecutes: scored.mcpFullNameExecutes ?? false,
    classifierOnlyDenial: scored.classifierOnlyDenial ?? false,
    fourSpawns: scored.fourSpawns ?? false,
    templateReadAtSpawn: scored.templateReadAtSpawn ?? false,
    prefixGlobNoEffect: scored.prefixGlobNoEffect ?? false,
  };
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
    result.bashStillLoaded || result.proscription
      ? "kind=deny-list-hollow"
      : "kind=absent",
    result.fourSpawns || result.proscription ? "ref=still-loaded" : "ref=struck",
    result.denyListHollow || result.verdict === "deny-list-hollow"
      ? "path=deny-list-hollow"
      : "path=barred",
    result.cue === "barred"
      ? "cue=barred"
      : result.cue === "deny-list-hollow"
        ? "cue=deny-list-hollow"
        : "cue=proscription",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    barred: result.barred,
    proscription: result.proscription,
    denyListHollow: result.denyListHollow,
    bashStillLoaded: result.bashStillLoaded,
    websearchExecutes: result.websearchExecutes,
    mcpFullNameExecutes: result.mcpFullNameExecutes,
    classifierOnlyDenial: result.classifierOnlyDenial,
    fourSpawns: result.fourSpawns,
    templateReadAtSpawn: result.templateReadAtSpawn,
    prefixGlobNoEffect: result.prefixGlobNoEffect,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    tablet: inspectTablet({
      barred: result.barred,
      proscription: result.proscription,
      denyListHollow: result.denyListHollow,
    }),
    forum: inspectForum({
      barred: result.barred,
      proscription: result.proscription,
      denyListHollow: result.denyListHollow,
    }),
    stylus: inspectStylus({
      barred: result.barred,
      proscription: result.proscription,
      denyListHollow: result.denyListHollow,
    }),
    lintel: inspectLintel({
      barred: result.barred,
      proscription: result.proscription,
      denyListHollow: result.denyListHollow,
    }),
    chamber: inspectChamber({
      barred: result.barred,
      proscription: result.proscription,
    }),
    roster: inspectRoster({
      barred: result.barred,
      proscription: result.proscription,
      bashStillLoaded: result.bashStillLoaded,
    }),
    scope: mapForum({
      barred: result.barred,
      proscription: result.proscription,
      denyListHollow: result.denyListHollow,
      bashStillLoaded: result.bashStillLoaded,
      websearchExecutes: result.websearchExecutes,
      mcpFullNameExecutes: result.mcpFullNameExecutes,
      classifierOnlyDenial: result.classifierOnlyDenial,
      fourSpawns: result.fourSpawns,
      templateReadAtSpawn: result.templateReadAtSpawn,
      prefixGlobNoEffect: result.prefixGlobNoEffect,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      proscription: result.proscription === true || result.verdict === "proscription",
    })),
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
      names: TABLET_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      docs: DOCS_URL,
      hypothesis:
        "NON-BINDING: frontmatter disallowedTools parsed/stored but never applied when building the subagent's tool set / ToolSearch surface; auto classifier is a separate gate. Invite verify against #94202 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
