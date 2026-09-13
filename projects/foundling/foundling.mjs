#!/usr/bin/env node
/**
 * Foundling — foundling-hospital / orphanage / foundling-wheel / parish-ward booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * When a subagent (Agent tool, `run_in_background: true`) starts Bash with
 * `run_in_background: true` and then finishes or is told to stop, those
 * Bash tasks keep running. Polling loops (`until ... sleep`, `while ps | grep`)
 * run 45–60+ minutes after the agent reported completion, appear in the
 * user's Background tasks panel, and can only be killed via `ps`/`kill`.
 * The parent has TaskStop for its own tasks, not a child agent's. Some
 * loops match their own cmdline and never exit.
 *
 *   node foundling.mjs data/foundling.json
 *   echo '{"seed":"foundling"}' | node foundling.mjs
 *
 * Idle word is filiated (HOLD: parent subagent still on the ward register;
 * background Bash bonded to a living agent).
 * Seeded word is foundling (#93889 — subagent finished; background Bash
 * left at the hatch with no owner).
 * Path word is subagent-bash-outlive.
 * Product score word is foundling (Score foundling or admit filiated.).
 *
 * Encoded from anthropics/claude-code#93889 issue text only.
 * Hypothesis (NON-BINDING): background Bash tasks are session-scoped
 * rather than agent-scoped, so subagent completion does not cascade a
 * reap/hand-off; TaskStop is keyed to the parent session's own task ids.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Gleaner/#93794 (unreaped `&` jobs reparented to PID 1).
 * Foundling is a different defect: subagent lifecycle does not reap or
 * hand off its `run_in_background` Bash tasks; parent cannot TaskStop them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "hold",
  "bonded",
  "registered",
  "warded",
  "acknowledged",
  "parented",
  "polling-loop",
  "taskstop-gap",
  "background-panel",
  "cmdline-self-match",
  "agent-finished",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "filiated";
export const PATH_WORD = "subagent-bash-outlive";
export const SEEDED_WORD = "foundling";
export const PRODUCT_WORD = "foundling";
export const HOLD = Object.freeze(["filiated", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "filiated",
  "bonded",
  "registered",
  "warded",
  "acknowledged",
  "parented",
]);
export const RECOVER = Object.freeze(["filiated", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
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
  "ppid-one",
  "yes-wall",
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
  "sheltered",
  "waif",
  "jetsam",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "foundling"),
);

export const FEATURED_ISSUE = 93889;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93889";
export const TITLE =
  "Subagents' background Bash tasks outlive the subagent; orphaned polling loops run for an hour with no way for the parent to stop them";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:macos",
  "area:bash",
  "area:agents",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.260";
export const DESKTOP_APP = "1.52386.3";
export const GOOD_VERSION =
  "subagent background Bash terminates or hands ids to parent when the subagent turn ends";
export const SURFACE = "subagent-background-bash";
export const HOST = "macOS, Claude Desktop Code tab";
export const CHECKED_ON = "Claude Code 2.1.260, Claude Desktop 1.52386.3, macOS";
export const BUILD = "Claude Code 2.1.260";
export const POLL_LOOP = "until false; do sleep 3; done";
export const GREP_LOOP = "while ps ... | grep ...; do sleep 15; done";
export const RUNTIME_MIN = 45;
export const RUNTIME_MAX = 60;
export const TASKSTOP_SCOPE = "parent session own tasks only";
export const KILL_PATH = "ps / kill";
export const TSC_WAITER = "tsc-waiter";
export const AGENT_TOOL = "Agent tool, run_in_background: true";
export const BASH_FLAG = "run_in_background: true";
export const PANEL = "Background tasks panel";
export const STOP_ALL = "stop all from finished agents";
export const RELATED_CITE = 93880;
export const PHRASE = "Score foundling or admit filiated.";
export const DISTRIBUTION =
  "When a subagent (Agent tool, run_in_background: true) starts a Bash command with run_in_background: true and then finishes or is told to stop, those Bash tasks keep running. Published loops: until ... do sleep 3; done and while ps ... | grep ...; do sleep 15; done. They ran 45 to 60 minutes after their agents had reported completion, showed in the user's Background tasks panel, and could only be found and killed by the orchestrator via ps and kill. Some of the loops matched their own command line and could never exit on their own. The user sees a growing list of hour-old tasks they did not start; the loops consume shells and, in the tsc-waiter case, block the very typecheck they wait for; the orchestrating session has no tool to enumerate or stop a subagent's background tasks (TaskStop covers its own tasks, not a child agent's). Environment: Claude Code 2.1.260 in Claude Desktop (macOS, Code tab), desktop app 1.52386.3. Related cite-only: #93880. Repro: spawn a background agent whose brief makes it run `until false; do sleep 3; done` with run_in_background: true and then return a report — the loop outlives the agent indefinitely and appears in the Background tasks panel with no owner. NOT Gleaner/#93794 (unreaped `&` jobs reparented to PID 1). Cousins cite-only: #93794, #93126, #88702, #92583, #91523, #81462, #93880, #93387.";
export const RULED_OUT = Object.freeze([
  "Gleaner/#93794 unreaped `&` jobs reparented to PID 1 — that is leftover harvest at Bash-call end; Foundling is subagent lifecycle: run_in_background Bash is not reaped or handed off when the child agent ends",
  "A parent TaskStop that already covers child-agent tasks — the issue says TaskStop covers the orchestrating session's own tasks, not a child agent's",
  "A Background tasks panel that names the owner agent — the repro loop appears with no owner",
  "A loop that would exit on its own — some loops match their own cmdline (while ps | grep) and never exit",
  "A session that already cascades reap on subagent completion — loops ran 45 to 60 minutes after agents reported completion",
]);
export const EXPECTED = Object.freeze([
  "A subagent's background Bash tasks are terminated (or at least surfaced to the parent with their ids) when the subagent's turn ends, unless it explicitly hands them off",
  "The parent session can list and stop background tasks started by its subagents",
  "The Background tasks panel offers a \"stop all from finished agents\" action",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "polling-loop",
    label: "polling loop",
    count: "sleep 3",
    note: "until false; do sleep 3; done — left at the hatch after the parent departs",
  },
  {
    id: "taskstop-gap",
    label: "TaskStop gap",
    count: "parent-only",
    note: "TaskStop covers the orchestrating session's own tasks, not a child agent's",
  },
  {
    id: "background-panel",
    label: "background panel",
    count: "no owner",
    note: "hour-old tasks the user did not start; no owner on the register",
  },
  {
    id: "cmdline-self-match",
    label: "cmdline self-match",
    count: "grep self",
    note: "while ps | grep matches its own cmdline and never exits",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "filiated-ward",
    survey:
      "parent subagent still on the ward register; background Bash bonded to a living agent",
    kind: "filiated",
    note: "idle: brass token still names a living parent — the hold/good path",
  },
  {
    id: "agent-finished",
    survey:
      "subagent reports completion or is told to stop; the parent name leaves the register",
    kind: "foundling",
    note: "seeded: the ward clerk strikes the parent; the cradle stays at the hatch",
  },
  {
    id: "polling-loop",
    survey: "until false; do sleep 3; done still turns after the parent departs",
    kind: "foundling",
    note: "seeded: polling loop as a foundling with no ward on the register",
  },
  {
    id: "subagent-bash-outlive",
    survey:
      "subagent lifecycle does not reap or hand off run_in_background Bash; parent cannot TaskStop",
    kind: "foundling",
    note: "path: subagent-bash-outlive names the abandoned hatch vs a filiated ward",
  },
  {
    id: "foundling",
    survey:
      "background Bash left at the hatch with no owner; 45–60+ minutes; panel lists a nameless task",
    kind: "foundling",
    note: "seeded: linen wrap at the wheel — the parent has departed",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "subagent-bash-outlive",
  "foundling",
  "polling-loop",
  "taskstop-gap",
  "agent-finished",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93794,
    title:
      "Background `&` jobs in a Bash tool call are orphaned, not reaped (Gleaner already shipped)",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — Gleaner already booths unreaped `&` / PPID 1 leftover harvest; Foundling is subagent-lifecycle run_in_background, not Bash-call `&`",
  },
  {
    issue: 93126,
    title: "cousin #93126",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — do not rebuild as a separate booth",
  },
  {
    issue: 88702,
    title: "cousin #88702",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — do not rebuild as a separate booth",
  },
  {
    issue: 92583,
    title: "cousin #92583",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — do not rebuild as a separate booth",
  },
  {
    issue: 91523,
    title: "cousin #91523",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — do not rebuild as a separate booth",
  },
  {
    issue: 81462,
    title: "cousin #81462",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — do not rebuild as a separate booth",
  },
  {
    issue: 93880,
    title: "related cite-only #93880",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — #93889 names this as related; do not rebuild as a separate booth",
  },
  {
    issue: 93387,
    title: "cousin #93387",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772 diagram→section poster", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782 dictation paste WSL", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821 cyber safeguard false-positive", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954 Latin-1 byte corruption — encoding-adjacent to Mojibake, cite only", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "crasis",
  "tessera",
  "mojibake",
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
  "jetsam",
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

export const SAMPLE_POLL = POLL_LOOP;
export const SAMPLE_GREP = GREP_LOOP;
export const SAMPLE_OWNER_IDLE = "subagent-living";
export const SAMPLE_OWNER_SEEDED = "none";

export const SAMPLE_FILIATED_PROOF = Object.freeze({
  filiated: true,
  foundling: false,
  subagentBashOutlive: false,
  agentFinished: false,
  pollingLoop: false,
  taskstopGap: false,
  backgroundPanel: false,
  cmdlineSelfMatch: false,
  version: GOOD_VERSION,
});

export const SAMPLE_FOUNDLING_PROOF = Object.freeze({
  filiated: false,
  foundling: true,
  subagentBashOutlive: true,
  agentFinished: true,
  pollingLoop: true,
  taskstopGap: true,
  backgroundPanel: true,
  cmdlineSelfMatch: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds filiated: parent on the ward register; Bash bonded to a living agent" },
  { t: "agent-finished", line: "subagent reports completion; parent name leaves the register" },
  { t: "polling-loop", line: "until false; do sleep 3; done still turns at the hatch" },
  { t: "path", line: "subagent-bash-outlive — background Bash left at the hatch with no owner" },
  { t: "score", line: "when the parent departs and the loop stays the booth is foundling — Score foundling or admit filiated." },
]);

/**
 * Ward map: living parent on the register vs linen wrap left at the hatch.
 * Idle/filiated: brass token names a living parent; cradle stays in the ward.
 * Seeded/foundling: parent departed; polling loop left at the foundling wheel.
 */
export function mapWard(input = {}) {
  const foundling =
    input.foundling === true ||
    input.subagentBashOutlive === true ||
    input.agentFinished === true ||
    input.pollingLoop === true ||
    input.taskstopGap === true;
  const filiated = input.filiated === true && !foundling;
  return {
    stamp: foundling ? "subagent-bash-outlive" : "filiated-ward",
    registerLane: foundling ? "departed" : "warded",
    hatchLane: foundling ? "cradle-at-hatch" : "cradle-in-ward",
    tokenLane: foundling ? "nameless" : "brass-named",
    ribbon: foundling ? "foundling" : "filiated",
    filiated,
  };
}

export function inspectRegister(input = {}) {
  const hit =
    input.subagentBashOutlive === true ||
    input.foundling === true ||
    input.agentFinished === true;
  if (input.filiated === true && !hit) {
    return {
      stamp: "parent-on-register",
      owner: SAMPLE_OWNER_IDLE,
      listed: true,
    };
  }
  if (hit) {
    return {
      stamp: "parent-departed",
      owner: SAMPLE_OWNER_SEEDED,
      listed: false,
      agentTool: AGENT_TOOL,
    };
  }
  return {
    stamp: "register-idle",
    listed: true,
  };
}

export function inspectHatch(input = {}) {
  const hit =
    input.foundling === true ||
    input.subagentBashOutlive === true ||
    input.pollingLoop === true;
  if (input.filiated === true && input.foundling !== true) {
    return {
      stamp: "hatch-held",
      cradle: "in-ward",
      loop: "",
    };
  }
  return {
    stamp: hit ? "cradle-at-hatch" : "hatch-idle",
    cradle: hit ? "at-hatch" : "in-ward",
    loop: hit ? POLL_LOOP : "",
    minutes: hit ? RUNTIME_MIN : 0,
  };
}

export function inspectTaskStop(input = {}) {
  const gap =
    input.taskstopGap === true ||
    input.foundling === true ||
    input.subagentBashOutlive === true;
  if (input.filiated === true && input.taskstopGap !== true) {
    return {
      stamp: "taskstop-held",
      gap: false,
      scope: "bonded parent can stop its own bonded Bash",
    };
  }
  return {
    stamp: gap ? "taskstop-gap" : "taskstop-idle",
    gap,
    scope: TASKSTOP_SCOPE,
    killPath: gap ? KILL_PATH : "",
  };
}

export function inspectPolling(input = {}) {
  const spinning =
    input.pollingLoop === true ||
    input.foundling === true ||
    (input.loop && input.loop.spinning === true);
  if (input.filiated === true && input.pollingLoop !== true) {
    return {
      stamp: "polling-held",
      spinning: false,
    };
  }
  return {
    stamp: spinning ? "polling-loop" : "polling-idle",
    spinning,
    until: spinning ? POLL_LOOP : "",
    grep: spinning ? GREP_LOOP : "",
  };
}

export function inspectPanel(input = {}) {
  const nameless =
    input.backgroundPanel === true ||
    input.foundling === true;
  return {
    stamp: nameless ? "background-panel" : "panel-idle",
    nameless,
    owner: nameless ? SAMPLE_OWNER_SEEDED : SAMPLE_OWNER_IDLE,
    stopAll: STOP_ALL,
  };
}

export function inspectCmdline(input = {}) {
  const selfMatch =
    input.cmdlineSelfMatch === true ||
    input.foundling === true;
  if (input.filiated === true && input.cmdlineSelfMatch !== true) {
    return {
      stamp: "cmdline-held",
      selfMatch: false,
    };
  }
  return {
    stamp: selfMatch ? "cmdline-self-match" : "cmdline-idle",
    selfMatch,
    note: selfMatch
      ? "while ps | grep matches its own cmdline and never exits"
      : "",
  };
}

export function readBooth(input = {}) {
  const foundling =
    input.foundling === true ||
    input.subagentBashOutlive === true ||
    input.agentFinished === true ||
    input.pollingLoop === true ||
    input.taskstopGap === true;
  const filiated = input.filiated === true && !foundling;
  return {
    mark: foundling ? "foundling" : filiated || !foundling ? "filiated" : "foundling",
    filiated,
    foundling,
    subagentBashOutlive: input.subagentBashOutlive === true || foundling,
    agentFinished: input.agentFinished === true,
    pollingLoop: input.pollingLoop === true,
    taskstopGap: input.taskstopGap === true,
    backgroundPanel: input.backgroundPanel === true,
    cmdlineSelfMatch: input.cmdlineSelfMatch === true,
    ward: mapWard(input),
    register: inspectRegister(input),
    hatch: inspectHatch(input),
    taskstop: inspectTaskStop(input),
    polling: inspectPolling(input),
    panel: inspectPanel(input),
    cmdline: inspectCmdline(input),
    log: input.log || [],
  };
}

export const FOUNDLING_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-filiated",
    filiated: true,
    foundling: false,
    cue: "filiated",
    note: "idle HOLD: parent on the ward register; Bash bonded to a living agent — the hold/good path",
  },
  {
    t: "agent-finished",
    event: "agent-finished",
    foundling: true,
    agentFinished: true,
    cue: "foundling",
    note: "subagent reports completion; parent name leaves the register",
  },
  {
    t: "polling-loop",
    event: "polling-loop",
    foundling: true,
    pollingLoop: true,
    cue: "foundling",
    note: "until false; do sleep 3; done still turns at the hatch",
  },
  {
    t: "path",
    event: "subagent-bash-outlive",
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
    cue: "foundling",
    note: "subagent-bash-outlive — background Bash left at the hatch with no owner",
  },
  {
    t: "score",
    event: "foundling",
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
    pollingLoop: true,
    taskstopGap: true,
    cue: "foundling",
    note: "foundling — when the parent departs and the loop stays the booth is foundling",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-filiated",
    filiated: true,
    foundling: false,
    cue: "filiated",
    note: "positive control: parent still on the ward register; Bash bonded",
  },
  {
    t: "announce",
    event: "cue-filiated",
    filiated: true,
    cue: "filiated",
    note: "positive control: the ward stays filiated",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    filiated: true,
    foundling: false,
    subagentBashOutlive: false,
    cue: "filiated",
  };
}

export function seedFiliated() {
  return { ...emptyTicket() };
}

export function seedFoundling() {
  return {
    seed: SEEDED_WORD,
    filiated: false,
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
    pollingLoop: true,
    taskstopGap: true,
    backgroundPanel: true,
    cmdlineSelfMatch: true,
    cue: "foundling",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_FOUNDLING_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
    cue: "foundling",
  };
}

export function seedSubagentBashOutlive() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    foundling: true,
    subagentBashOutlive: true,
    agentFinished: true,
    event: "subagent-bash-outlive",
    cue: "foundling",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    filiated: true,
    cue: "filiated",
  };
}

export function seedPollingLoop() {
  return {
    seed: "polling-loop",
    preferSeed: true,
    pollingLoop: true,
    cue: "foundling",
  };
}

export function seedTaskstopGap() {
  return {
    seed: "taskstop-gap",
    preferSeed: true,
    taskstopGap: true,
    cue: "foundling",
  };
}

export function seedBackgroundPanel() {
  return {
    seed: "background-panel",
    preferSeed: true,
    backgroundPanel: true,
    cue: "foundling",
  };
}

export function seedCmdlineSelfMatch() {
  return {
    seed: "cmdline-self-match",
    preferSeed: true,
    cmdlineSelfMatch: true,
    cue: "foundling",
  };
}

export function seedAgentFinished() {
  return {
    seed: "agent-finished",
    preferSeed: true,
    agentFinished: true,
    cue: "foundling",
  };
}

export function seedBonded() {
  return {
    seed: "bonded",
    preferSeed: true,
    filiated: true,
    cue: "filiated",
  };
}

export function seedRegistered() {
  return {
    seed: "registered",
    preferSeed: true,
    filiated: true,
    cue: "filiated",
  };
}

export function seedWarded() {
  return {
    seed: "warded",
    preferSeed: true,
    filiated: true,
    cue: "filiated",
  };
}

export function seedAcknowledged() {
  return {
    seed: "acknowledged",
    preferSeed: true,
    filiated: true,
    cue: "filiated",
  };
}

export function seedParented() {
  return {
    seed: "parented",
    preferSeed: true,
    filiated: true,
    cue: "filiated",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      filiated: false,
      foundling: false,
      subagentBashOutlive: false,
      agentFinished: false,
      pollingLoop: false,
      taskstopGap: false,
      backgroundPanel: false,
      cmdlineSelfMatch: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    filiated: raw.filiated === true,
    foundling:
      raw.foundling === true ||
      raw.event === "foundling",
    subagentBashOutlive:
      raw.subagentBashOutlive === true || raw.event === "subagent-bash-outlive",
    agentFinished: raw.agentFinished === true || raw.event === "agent-finished",
    pollingLoop: raw.pollingLoop === true || raw.event === "polling-loop",
    taskstopGap: raw.taskstopGap === true || raw.event === "taskstop-gap",
    backgroundPanel:
      raw.backgroundPanel === true || raw.event === "background-panel",
    cmdlineSelfMatch:
      raw.cmdlineSelfMatch === true || raw.event === "cmdline-self-match",
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
      (ticket.filiated != null ||
        ticket.foundling != null ||
        ticket.subagentBashOutlive != null ||
        ticket.agentFinished != null ||
        ticket.pollingLoop != null ||
        ticket.taskstopGap != null ||
        ticket.backgroundPanel != null ||
        ticket.cmdlineSelfMatch != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isFiliated(row) {
  if (row.foundling && row.cue !== "filiated") return false;
  if (
    row.cue === "foundling" ||
    row.cue === "subagent-bash-outlive"
  ) {
    return false;
  }
  if (
    row.subagentBashOutlive &&
    row.agentFinished &&
    row.cue !== "filiated" &&
    row.filiated !== true
  ) {
    return false;
  }
  if (row.filiated === true && row.foundling !== true && row.cue !== "foundling") {
    return true;
  }
  if (
    row.cue === "filiated" &&
    row.foundling !== true &&
    row.subagentBashOutlive !== true &&
    row.agentFinished !== true &&
    row.pollingLoop !== true &&
    row.taskstopGap !== true
  ) {
    return true;
  }
  return false;
}

function isSubagentBashOutlive(row) {
  return (
    row.event === "subagent-bash-outlive" &&
    !isFiliated(row) &&
    (row.subagentBashOutlive === true ||
      row.agentFinished === true ||
      row.pollingLoop === true)
  );
}

function isFoundlingRow(row) {
  if (isFiliated(row)) return false;
  if (isSubagentBashOutlive(row) && row.cue !== "foundling") return false;
  if (row.cue === "foundling") return true;
  if (row.foundling === true) return true;
  if (row.subagentBashOutlive === true && row.agentFinished === true) {
    return true;
  }
  if (
    row.subagentBashOutlive === true ||
    row.agentFinished === true ||
    row.pollingLoop === true ||
    row.taskstopGap === true ||
    row.backgroundPanel === true ||
    row.cmdlineSelfMatch === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one foundling pass against the parish ward.
 * filiated: parent on the register; Bash bonded to a living agent.
 * foundling: subagent finished; background Bash left at the hatch.
 * subagent-bash-outlive: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSubagentBashOutlive(row) ||
    (row.subagentBashOutlive && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "subagent-bash-outlive";
  } else if (isFoundlingRow(row)) {
    verdict = "foundling";
  } else if (isFiliated(row)) {
    verdict = "filiated";
  } else if (
    row.subagentBashOutlive ||
    row.agentFinished ||
    row.pollingLoop ||
    row.taskstopGap ||
    row.backgroundPanel ||
    row.cmdlineSelfMatch
  ) {
    verdict = "foundling";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const register = inspectRegister(row);
  const hatch = inspectHatch(row);
  const taskstop = inspectTaskStop(row);
  const polling = inspectPolling(row);
  const panel = inspectPanel(row);
  const cmdline = inspectCmdline(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    filiated: verdict === "filiated" || verdict === "hold",
    foundling: verdict === "foundling" || verdict === SEEDED_WORD,
    subagentBashOutlive:
      row.subagentBashOutlive === true ||
      verdict === "subagent-bash-outlive" ||
      verdict === PATH_WORD,
    agentFinished: row.agentFinished,
    pollingLoop: row.pollingLoop,
    taskstopGap: row.taskstopGap,
    backgroundPanel: row.backgroundPanel,
    cmdlineSelfMatch: row.cmdlineSelfMatch,
    cue: hold
      ? "filiated"
      : row.subagentBashOutlive || verdict === "subagent-bash-outlive"
        ? "subagent-bash-outlive"
        : "foundling",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit filiated" : "score foundling",
    registerInspect: register,
    hatchInspect: hatch,
    taskstopInspect: taskstop,
    pollingInspect: polling,
    panelInspect: panel,
    cmdlineInspect: cmdline,
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
      : FOUNDLING_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "foundling");
  const path = scored.filter((row) => row.verdict === "subagent-bash-outlive");
  const filiated = scored.filter((row) => row.verdict === "filiated");
  const headline =
    scored.find((row) => row.event === "foundling") ||
    scored.find((row) => row.event === "subagent-bash-outlive") ||
    scored.find((row) => row.event === "agent-finished") ||
    dead[dead.length - 1];
  let verdict = "filiated";
  if (dead.length) verdict = "foundling";
  else if (path.length && !filiated.length) verdict = "subagent-bash-outlive";
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
    foundlingCount: dead.length,
    pathCount: path.length,
    filiatedCount: filiated.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit filiated" : "score foundling",
    note: headline
      ? "subagent finished; background Bash left at the hatch with no owner; cousins #93794, #93126, #88702, #92583, #91523, #81462, #93880 and #93387 are cite-only."
      : "published foundling walk scored against filiated vs foundling",
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
    seeded !== "filiated" &&
    seeded !== "foundling" &&
    seeded !== "subagent-bash-outlive" &&
    ticket.filiated == null &&
    ticket.foundling == null &&
    ticket.subagentBashOutlive == null &&
    ticket.agentFinished == null &&
    ticket.pollingLoop == null &&
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
    filiated: scored.filiated ?? false,
    foundling: scored.foundling ?? false,
    subagentBashOutlive: scored.subagentBashOutlive ?? false,
    agentFinished: scored.agentFinished ?? false,
    pollingLoop: scored.pollingLoop ?? false,
    taskstopGap: scored.taskstopGap ?? false,
    backgroundPanel: scored.backgroundPanel ?? false,
    cmdlineSelfMatch: scored.cmdlineSelfMatch ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.agentFinished || result.foundling ? "parent=departed" : "parent=warded",
    result.pollingLoop || result.foundling ? "loop=until-sleep" : "loop=held",
    result.taskstopGap || result.foundling ? "taskstop=gap" : "taskstop=held",
    result.subagentBashOutlive || result.verdict === "subagent-bash-outlive"
      ? "path=subagent-bash-outlive"
      : "path=filiated",
    result.cue === "filiated"
      ? "cue=filiated"
      : result.cue === "subagent-bash-outlive"
        ? "cue=subagent-bash-outlive"
        : "cue=foundling",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    filiated: result.filiated,
    foundling: result.foundling,
    subagentBashOutlive: result.subagentBashOutlive,
    agentFinished: result.agentFinished,
    pollingLoop: result.pollingLoop,
    taskstopGap: result.taskstopGap,
    backgroundPanel: result.backgroundPanel,
    cmdlineSelfMatch: result.cmdlineSelfMatch,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    register: inspectRegister({
      filiated: result.filiated,
      foundling: result.foundling,
      subagentBashOutlive: result.subagentBashOutlive,
      agentFinished: result.agentFinished,
    }),
    hatch: inspectHatch({
      filiated: result.filiated,
      foundling: result.foundling,
      subagentBashOutlive: result.subagentBashOutlive,
      pollingLoop: result.pollingLoop,
    }),
    taskstop: inspectTaskStop({
      filiated: result.filiated,
      foundling: result.foundling,
      subagentBashOutlive: result.subagentBashOutlive,
      taskstopGap: result.taskstopGap,
    }),
    polling: inspectPolling({
      filiated: result.filiated,
      foundling: result.foundling,
      pollingLoop: result.pollingLoop,
    }),
    panel: inspectPanel({
      filiated: result.filiated,
      foundling: result.foundling,
      backgroundPanel: result.backgroundPanel,
    }),
    cmdline: inspectCmdline({
      filiated: result.filiated,
      foundling: result.foundling,
      cmdlineSelfMatch: result.cmdlineSelfMatch,
    }),
    ward: mapWard({
      filiated: result.filiated,
      foundling: result.foundling,
      subagentBashOutlive: result.subagentBashOutlive,
      agentFinished: result.agentFinished,
      pollingLoop: result.pollingLoop,
      taskstopGap: result.taskstopGap,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      foundling:
        result.foundling === true ||
        result.verdict === "foundling",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      desktopApp: DESKTOP_APP,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      pollLoop: POLL_LOOP,
      grepLoop: GREP_LOOP,
      runtimeMin: RUNTIME_MIN,
      runtimeMax: RUNTIME_MAX,
      taskstopScope: TASKSTOP_SCOPE,
      killPath: KILL_PATH,
      tscWaiter: TSC_WAITER,
      agentTool: AGENT_TOOL,
      bashFlag: BASH_FLAG,
      panel: PANEL,
      stopAll: STOP_ALL,
      relatedCite: RELATED_CITE,
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
        "NON-BINDING: background Bash tasks are session-scoped rather than agent-scoped, so subagent completion does not cascade a reap/hand-off; TaskStop is keyed to the parent session's own task ids. Invite verify against #93889 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
