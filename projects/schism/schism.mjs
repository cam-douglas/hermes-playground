#!/usr/bin/env node
/**
 * Schism — ecclesiastical schism / twin-authority glass booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * SendMessage to a LIVE Workflow agent resumes a second copy from its
 * transcript ("Resuming agent") while the original keeps running inside
 * the workflow. Two writers then work the same task and the same files.
 *
 *   node schism.mjs data/schismed.json
 *   echo '{"seed":"schismed"}' | node schism.mjs
 *
 * Idle word is live (HOLD: one in-process workflow agent; singular writer;
 * addressable — the good path).
 * Seeded word is schismed (#93797 dual-writer resume).
 * Path word is resume-while-live.
 * Product score word is schism (Score schism or admit live.).
 *
 * Encoded from anthropics/claude-code#93797 issue text only.
 * Hypothesis (NON-BINDING): resume path consults task registry only,
 * misses in-process workflow agents that lack their own task_started,
 * takes resume-from-transcript. Verify against #93797 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "live",
  "schismed",
  "schism",
  "resume-while-live",
  "hold",
  "dual-writer",
  "resuming-banner",
  "local-agent-copy",
  "workflow-progress-only",
  "four-lane-dup",
  "conflicting-edits",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "live";
export const PATH_WORD = "resume-while-live";
export const SEEDED_WORD = "schismed";
export const PRODUCT_WORD = "schism";
export const HOLD = Object.freeze(["live", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "live",
  "singular",
  "in-process",
  "addressable",
]);
export const RECOVER = Object.freeze(["live", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "swept",
  "ashpanned",
  "ashpan",
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
  "blank",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "schismed" && name !== "schism"),
);

export const FEATURED_ISSUE = 93797;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93797";
export const TITLE =
  "SendMessage to a LIVE Workflow agent resumes a second copy from its transcript (\"Resuming agent\") while the original keeps running inside the workflow";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:agents",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.269";
export const SURFACE =
  "Claude Code 2.1.269 (macOS arm64), --output-format stream-json --verbose; also -p mode";
export const AGENT_ID = "a55b7012793deae02";
export const RESUME_BANNER = "Resuming agent a55b701";
export const WORKFLOW_NAME = "dup-probe";
export const AGENT_LABEL = "slowpoke";
export const TASK_TYPE_COPY = "local_agent";
export const TASK_TYPE_WORKFLOW = "local_workflow";
export const SLEEP_SECONDS = 60;
export const LANE_COUNT = 4;
export const PHRASE = "Score schism or admit live.";
export const DISTRIBUTION =
  "Agents spawned by the Workflow tool (dynamic workflows, agent() in the script) are not addressable while they run. If such an agent sends SendMessage to main and the main thread replies with SendMessage {to: that agent id}, the tool result says Resuming agent <id> and a second, independent copy of that agent is started from its persisted transcript (system/task_started with task_type: local_agent and task_id equal to the agent id) while the original copy is still executing inside the workflow. From then on two writers work on the same task and the same files. Repro: workflow agent pings main with its id, then sleeps 60s; main SendMessages pong → second copy; original sleep gets stopped; duplicate completes separately. Observed: system/task_started task_type=local_workflow workflow_name=dup-probe; system/task_started task_type=local_bash owned_by_subagent=true description=\"Sleep for 60 seconds\" (the workflow agent is live and running its sleep); assistant tool_use SendMessage {\"to\":\"a55b7012793deae02\",\"message\":\"pong\"}; system/task_started task_type=local_agent task_id=a55b7012793deae02 description=\"slowpoke\" subagent_type=general-purpose prompt=\"pong\" (SECOND copy); user tool_result {\"success\":true,\"message\":\"Resuming agent a55b701\",\"resumedAgentId\":\"a55b7012793deae02\"}; original sleep gets stopped; duplicate completes separately. Note: the workflow agent never emitted a task_started of its own; its only trace is the workflow_agent entry in task_progress.workflow_progress. Resume logic apparently only consults the task registry, does not find a live task for that id, and takes the agent-stopped → resume from transcript branch. Impact: four parallel lane agents each got a duplicate writer; conflicting Kotlin/Rust/TS edits; duplicates kept editing after the workflow phase had finished. Expected: refuse/queue like in_process live subagents, OR register workflow agents as live tasks.";
export const RULED_OUT = Object.freeze([
  "Duplicate background-agent execution on same target (Agent tool + SendMessage resume after stalled completion) (#91353)",
]);
export const EXPECTED = Object.freeze([
  "SendMessage to an agent currently running inside a Workflow is refused (or queued for that agent's next tool round, like the in_process branch does for ordinary live subagents)",
  "or the workflow's agents are registered as live tasks so the existing already-waking / message-queued path applies",
]);

export const NAVE_PANELS = Object.freeze([
  { id: "choir", label: "live choir", count: "singular", note: "in-process workflow agent still executing" },
  { id: "ghost", label: "resumed ghost", count: "twin", note: "local_agent copy from persisted transcript" },
  { id: "score", label: "shared score", count: "task_id", note: "same agent id claimed by both pulpits" },
  { id: "lanes", label: "four naves", count: "4", note: "four parallel lane agents each duplicated" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "live-pulpit",
    survey: "watch the in-process workflow agent stay on the live choir",
    kind: "live",
    note: "seeded: workflow agent is live and running its sleep; never emitted its own task_started",
  },
  {
    id: "resume-pulpit",
    survey: "read the Resuming agent banner on the ghost twin",
    kind: "resume",
    note: "seeded: tool result says Resuming agent a55b701; resumedAgentId=a55b7012793deae02",
  },
  {
    id: "registry-gap",
    survey: "check task registry vs workflow_progress-only",
    kind: "registry",
    note: "seeded: only workflow_agent entry in task_progress.workflow_progress; no own task_started",
  },
  {
    id: "copy-pulpit",
    survey: "badge the second local_agent copy",
    kind: "copy",
    note: "seeded: system/task_started task_type=local_agent task_id=a55b7012793deae02 description=slowpoke",
  },
  {
    id: "collision-nave",
    survey: "count dual writers and four-lane duplicates",
    kind: "collision",
    note: "seeded: two writers on the same task and files; four lane agents each got a duplicate",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "resume-while-live",
  "schismed",
  "dual-writer",
  "resuming-banner",
  "local-agent-copy",
  "workflow-progress-only",
  "four-lane-dup",
  "conflicting-edits",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91353,
    title: "Duplicate background-agent execution on same target (Agent tool + SendMessage resume after stalled completion)",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91353 Duplicate background-agent execution on same target (Agent tool + SendMessage resume after stalled completion). Different mechanism: here the original has not stalled or completed; it is an in-process workflow agent and the resume path does not see it as live. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93794, title: "orphaned Bash & jobs", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93788, title: "ESC keys dead 2.1.269", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93766, title: "OneDrive musl/glibc", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "DECSTBM blank rows", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "eidolon",
  "followspot",
  "calends",
  "weir",
  "rescript",
  "monadnock",
  "rider",
  "irons",
  "cathead",
  "anachronism",
  "reliquary",
  "cenotaph",
  "wraith",
  "afterimage",
  "midden",
  "oubliette",
  "quench",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "scrim",
  "knock",
  "palimpsest",
  "ephemera",
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
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "homonym",
]);

export const SAMPLE_LIVE_AGENT = Object.freeze({
  agentId: AGENT_ID,
  inProcess: true,
  addressable: true,
  ownTaskStarted: true,
  writers: 1,
});

export const SAMPLE_SCHISMED_AGENT = Object.freeze({
  agentId: AGENT_ID,
  inProcess: true,
  addressable: false,
  ownTaskStarted: false,
  writers: 2,
});

export const SAMPLE_RESUME = Object.freeze({
  banner: RESUME_BANNER,
  resumedAgentId: AGENT_ID,
  success: true,
  fromTranscript: true,
});

export const SAMPLE_LIVE_RESUME = Object.freeze({
  banner: null,
  resumedAgentId: null,
  success: false,
  fromTranscript: false,
});

export const SAMPLE_COPY = Object.freeze({
  taskType: TASK_TYPE_COPY,
  taskId: AGENT_ID,
  label: AGENT_LABEL,
  prompt: "pong",
  started: true,
});

export const SAMPLE_LIVE_COPY = Object.freeze({
  taskType: null,
  taskId: AGENT_ID,
  label: AGENT_LABEL,
  prompt: null,
  started: false,
});

export const SAMPLE_PROGRESS = Object.freeze({
  workflowName: WORKFLOW_NAME,
  workflowProgressOnly: true,
  ownTaskStarted: false,
  registryHit: false,
});

export const SAMPLE_LIVE_PROGRESS = Object.freeze({
  workflowName: WORKFLOW_NAME,
  workflowProgressOnly: false,
  ownTaskStarted: true,
  registryHit: true,
});

export const SAMPLE_COLLISION = Object.freeze({
  writers: 2,
  lanes: LANE_COUNT,
  duplicates: LANE_COUNT,
  kotlin: true,
  rust: true,
  typescript: true,
});

export const SAMPLE_LIVE_COLLISION = Object.freeze({
  writers: 1,
  lanes: LANE_COUNT,
  duplicates: 0,
  kotlin: false,
  rust: false,
  typescript: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "nave holds: one in-process workflow agent; singular writer; addressable" },
  { t: "workflow-progress-only", line: "workflow agent never emitted its own task_started; only workflow_agent entry in task_progress.workflow_progress" },
  { t: "resuming-banner", line: "SendMessage pong → tool result Resuming agent a55b701; resumedAgentId=a55b7012793deae02" },
  { t: "local-agent-copy", line: "system/task_started task_type=local_agent task_id=a55b7012793deae02 description=slowpoke prompt=pong — SECOND copy" },
  { t: "dual-writer", line: "two writers work the same task and the same files; original sleep gets stopped" },
  { t: "four-lane-dup", line: "four parallel lane agents each got a duplicate writer" },
  { t: "conflicting-edits", line: "conflicting Kotlin/Rust/TS edits; duplicates kept editing after the phase finished" },
  { t: "path", line: "resume-while-live — resume path does not see the in-process workflow agent as live" },
  { t: "score", line: "when the ghost twin writes the same score the booth is schism — Score schism or admit live." },
]);

export function inspectLiveAgent(input = {}) {
  const agent =
    input.agent && typeof input.agent === "object"
      ? input.agent
      : input.live === true && input.schismed !== true
        ? SAMPLE_LIVE_AGENT
        : SAMPLE_SCHISMED_AGENT;
  const forcedTwin =
    input.schismed === true ||
    input.event === "schismed" ||
    input.event === "schism" ||
    input.event === "resume-while-live" ||
    input.event === "dual-writer";
  const addressable = forcedTwin ? false : agent.addressable === true;
  const writers = forcedTwin ? 2 : agent.writers || 1;
  return {
    agentId: agent.agentId || AGENT_ID,
    inProcess: true,
    addressable,
    ownTaskStarted: addressable,
    writers,
    stamp: addressable ? "singular-choir" : "twin-pulpit",
    note: addressable
      ? "one in-process workflow agent; singular writer; addressable"
      : "workflow agent not addressable while it runs — ghost twin claims the same id",
  };
}

export function inspectResume(input = {}) {
  const resume =
    input.resume && typeof input.resume === "object"
      ? input.resume
      : input.live === true && input.schismed !== true
        ? SAMPLE_LIVE_RESUME
        : SAMPLE_RESUME;
  const forcedBanner =
    input.resumingBanner === true ||
    input.event === "resuming-banner" ||
    input.event === "schismed" ||
    input.event === "schism" ||
    input.event === "resume-while-live";
  const banner = forcedBanner
    ? RESUME_BANNER
    : resume.banner || (input.live === true && input.schismed !== true ? null : RESUME_BANNER);
  return {
    banner,
    resumedAgentId: banner ? AGENT_ID : null,
    success: Boolean(banner),
    fromTranscript: Boolean(banner),
    stamp: banner ? "resuming-agent" : "no-resume",
    note: banner
      ? "tool result says Resuming agent a55b701; second copy starts from persisted transcript"
      : "SendMessage refused or queued — no resume-from-transcript",
  };
}

export function inspectCopy(input = {}) {
  const copy =
    input.copy && typeof input.copy === "object"
      ? input.copy
      : input.live === true && input.schismed !== true
        ? SAMPLE_LIVE_COPY
        : SAMPLE_COPY;
  const forcedCopy =
    input.localAgentCopy === true ||
    input.event === "local-agent-copy" ||
    input.event === "schismed" ||
    input.event === "schism" ||
    input.event === "resume-while-live";
  const started = forcedCopy ? true : copy.started === true && input.live !== true;
  return {
    taskType: started ? TASK_TYPE_COPY : null,
    taskId: AGENT_ID,
    label: AGENT_LABEL,
    prompt: started ? "pong" : null,
    started,
    stamp: started ? "local-agent-copy" : "no-copy",
    note: started
      ? "system/task_started task_type=local_agent task_id=a55b7012793deae02 — SECOND copy"
      : "no second local_agent copy from transcript",
  };
}

export function inspectProgress(input = {}) {
  const progress =
    input.progress && typeof input.progress === "object"
      ? input.progress
      : input.live === true && input.schismed !== true
        ? SAMPLE_LIVE_PROGRESS
        : SAMPLE_PROGRESS;
  const forcedGap =
    input.workflowProgressOnly === true ||
    input.event === "workflow-progress-only" ||
    input.event === "schismed" ||
    input.event === "schism" ||
    input.event === "resume-while-live";
  const workflowProgressOnly = forcedGap ? true : progress.workflowProgressOnly === true;
  return {
    workflowName: WORKFLOW_NAME,
    workflowProgressOnly,
    ownTaskStarted: !workflowProgressOnly,
    registryHit: !workflowProgressOnly,
    stamp: workflowProgressOnly ? "progress-only" : "registered-live",
    note: workflowProgressOnly
      ? "no own task_started; only workflow_agent entry in task_progress.workflow_progress"
      : "workflow agent registered as a live task",
  };
}

export function inspectCollision(input = {}) {
  const collision =
    input.collision && typeof input.collision === "object"
      ? input.collision
      : input.live === true && input.schismed !== true
        ? SAMPLE_LIVE_COLLISION
        : SAMPLE_COLLISION;
  const forcedDup =
    input.fourLaneDup === true ||
    input.conflictingEdits === true ||
    input.event === "four-lane-dup" ||
    input.event === "conflicting-edits" ||
    input.event === "schismed" ||
    input.event === "schism";
  const duplicates = forcedDup ? LANE_COUNT : collision.duplicates || 0;
  const writers = forcedDup || duplicates > 0 ? 2 : collision.writers || 1;
  return {
    writers,
    lanes: LANE_COUNT,
    duplicates,
    kotlin: duplicates > 0,
    rust: duplicates > 0,
    typescript: duplicates > 0,
    stamp: duplicates > 0 ? "four-lane-dup" : "singular-nave",
    note: duplicates > 0
      ? "four parallel lane agents each got a duplicate writer; conflicting Kotlin/Rust/TS edits"
      : "singular writer per lane — no conflicting edits",
  };
}

export function readBooth(input = {}) {
  const agent = inspectLiveAgent(input);
  const resume = inspectResume(input);
  const copy = inspectCopy(input);
  const progress = inspectProgress(input);
  const collision = inspectCollision(input);
  const schismed =
    input.live !== true &&
    ((agent.writers > 1 && resume.fromTranscript) ||
      (copy.started && progress.workflowProgressOnly) ||
      input.schismed === true);
  const live =
    input.live === true && schismed !== true && agent.writers === 1;
  const path =
    resume.fromTranscript &&
    (input.event === "resume-while-live" || input.resumeWhileLive === true);
  return {
    agent,
    resume,
    copy,
    progress,
    collision,
    panels: NAVE_PANELS,
    stations: BOOTH_STATIONS,
    schismed: schismed && !live && !path,
    live: live || (!schismed && !path && input.schismed !== true && input.resumeWhileLive !== true && agent.writers === 1 && !copy.started),
    resumeWhileLive: path && !live,
    mark:
      path && !live
        ? "resume-while-live"
        : schismed && !live
          ? "schismed"
          : "live",
  };
}

/**
 * Published schism walk from #93797 only. Facts from the issue text.
 * A live booth keeps one in-process workflow agent addressable.
 * A schismed booth resumes a second copy while the original still runs.
 * A resume-while-live booth names the dual-writer resume path.
 */
export const SCHISM_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-live",
    live: true,
    schismed: false,
    cue: "live",
    note: "idle HOLD: one in-process workflow agent; singular writer; addressable — the hold/good path",
  },
  {
    t: "workflow-progress-only",
    event: "workflow-progress-only",
    schismed: true,
    workflowProgressOnly: true,
    cue: "schismed",
    note: "workflow agent never emitted its own task_started; only workflow_agent entry in task_progress",
  },
  {
    t: "resuming-banner",
    event: "resuming-banner",
    schismed: true,
    resumingBanner: true,
    cue: "schismed",
    note: "tool result says Resuming agent a55b701; resumedAgentId=a55b7012793deae02",
  },
  {
    t: "local-agent-copy",
    event: "local-agent-copy",
    schismed: true,
    localAgentCopy: true,
    cue: "schismed",
    note: "system/task_started task_type=local_agent task_id=a55b7012793deae02 — SECOND copy",
  },
  {
    t: "dual-writer",
    event: "dual-writer",
    schismed: true,
    dualWriter: true,
    cue: "schismed",
    note: "two writers work the same task and the same files",
  },
  {
    t: "four-lane-dup",
    event: "four-lane-dup",
    schismed: true,
    fourLaneDup: true,
    cue: "schismed",
    note: "four parallel lane agents each got a duplicate writer",
  },
  {
    t: "conflicting-edits",
    event: "conflicting-edits",
    schismed: true,
    conflictingEdits: true,
    cue: "schismed",
    note: "conflicting Kotlin/Rust/TS edits; duplicates kept editing after the phase finished",
  },
  {
    t: "path",
    event: "resume-while-live",
    schismed: true,
    resumeWhileLive: true,
    resumingBanner: true,
    localAgentCopy: true,
    cue: "schismed",
    note: "resume-while-live — resume path does not see the in-process workflow agent as live",
  },
  {
    t: "score",
    event: "schism",
    schismed: true,
    resumeWhileLive: true,
    workflowProgressOnly: true,
    resumingBanner: true,
    localAgentCopy: true,
    dualWriter: true,
    fourLaneDup: true,
    conflictingEdits: true,
    cue: "schismed",
    note: "schism — when the ghost twin writes the same score the booth never stays live",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-live",
    live: true,
    schismed: false,
    cue: "live",
    note: "positive control: refuse or queue SendMessage like in_process live subagents",
  },
  {
    t: "announce",
    event: "cue-live",
    live: true,
    cue: "live",
    note: "positive control: workflow agents registered as live tasks — singular writer",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    live: true,
    schismed: false,
    resumeWhileLive: false,
    cue: "live",
  };
}

export function seedLive() {
  return { ...emptyTicket() };
}

export function seedSchismed() {
  return {
    seed: SEEDED_WORD,
    live: false,
    schismed: true,
    resumeWhileLive: true,
    workflowProgressOnly: true,
    resumingBanner: true,
    localAgentCopy: true,
    dualWriter: true,
    fourLaneDup: true,
    conflictingEdits: true,
    cue: "schismed",
    issue: FEATURED_ISSUE,
    agent: SAMPLE_SCHISMED_AGENT,
    resume: SAMPLE_RESUME,
    copy: SAMPLE_COPY,
    progress: SAMPLE_PROGRESS,
    collision: SAMPLE_COLLISION,
  };
}

export function seedSchism() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    schismed: true,
    resumeWhileLive: true,
    workflowProgressOnly: true,
    resumingBanner: true,
    localAgentCopy: true,
    dualWriter: true,
    fourLaneDup: true,
    conflictingEdits: true,
    cue: "schismed",
  };
}

export function seedResumeWhileLive() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    schismed: true,
    resumeWhileLive: true,
    resumingBanner: true,
    localAgentCopy: true,
    event: "resume-while-live",
    cue: "schismed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    live: true,
    cue: "live",
  };
}

export function seedDualWriter() {
  return {
    seed: "dual-writer",
    preferSeed: true,
    dualWriter: true,
    cue: "schismed",
  };
}

export function seedResumingBanner() {
  return {
    seed: "resuming-banner",
    preferSeed: true,
    resumingBanner: true,
    cue: "schismed",
  };
}

export function seedLocalAgentCopy() {
  return {
    seed: "local-agent-copy",
    preferSeed: true,
    localAgentCopy: true,
    cue: "schismed",
  };
}

export function seedWorkflowProgressOnly() {
  return {
    seed: "workflow-progress-only",
    preferSeed: true,
    workflowProgressOnly: true,
    cue: "schismed",
  };
}

export function seedFourLaneDup() {
  return {
    seed: "four-lane-dup",
    preferSeed: true,
    fourLaneDup: true,
    cue: "schismed",
  };
}

export function seedConflictingEdits() {
  return {
    seed: "conflicting-edits",
    preferSeed: true,
    conflictingEdits: true,
    cue: "schismed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      live: false,
      schismed: false,
      resumeWhileLive: false,
      workflowProgressOnly: false,
      resumingBanner: false,
      localAgentCopy: false,
      dualWriter: false,
      fourLaneDup: false,
      conflictingEdits: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    live: raw.live === true,
    schismed:
      raw.schismed === true ||
      raw.event === "schismed" ||
      raw.event === "schism",
    resumeWhileLive:
      raw.resumeWhileLive === true || raw.event === "resume-while-live",
    workflowProgressOnly:
      raw.workflowProgressOnly === true ||
      raw.event === "workflow-progress-only",
    resumingBanner:
      raw.resumingBanner === true || raw.event === "resuming-banner",
    localAgentCopy:
      raw.localAgentCopy === true || raw.event === "local-agent-copy",
    dualWriter: raw.dualWriter === true || raw.event === "dual-writer",
    fourLaneDup: raw.fourLaneDup === true || raw.event === "four-lane-dup",
    conflictingEdits:
      raw.conflictingEdits === true || raw.event === "conflicting-edits",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    agent: raw.agent,
    resume: raw.resume,
    copy: raw.copy,
    progress: raw.progress,
    collision: raw.collision,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.live != null ||
        ticket.schismed != null ||
        ticket.resumeWhileLive != null ||
        ticket.workflowProgressOnly != null ||
        ticket.resumingBanner != null ||
        ticket.localAgentCopy != null ||
        ticket.dualWriter != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.agent ||
        ticket.resume ||
        ticket.copy),
  );
}

function isLive(row) {
  if (row.schismed && row.cue !== "live") return false;
  if (
    row.cue === "schismed" ||
    row.cue === "schism" ||
    row.cue === "resume-while-live"
  ) {
    return false;
  }
  if (
    row.resumeWhileLive &&
    row.resumingBanner &&
    row.cue !== "live" &&
    row.live !== true
  ) {
    return false;
  }
  if (
    row.resumeWhileLive &&
    row.localAgentCopy &&
    row.cue !== "live" &&
    row.live !== true
  ) {
    return false;
  }
  if (row.live === true && row.schismed !== true && row.cue !== "schismed") {
    return true;
  }
  if (
    row.cue === "live" &&
    row.schismed !== true &&
    row.resumeWhileLive !== true &&
    row.resumingBanner !== true &&
    row.localAgentCopy !== true
  ) {
    return true;
  }
  return false;
}

function isResumeWhileLivePath(row) {
  return (
    row.event === "resume-while-live" &&
    !isLive(row) &&
    (row.resumeWhileLive === true ||
      row.resumingBanner === true ||
      row.localAgentCopy === true)
  );
}

function isSchismed(row) {
  if (isLive(row)) return false;
  if (isResumeWhileLivePath(row) && row.cue !== "schismed") return false;
  if (row.cue === "schismed" || row.cue === "schism") return true;
  if (row.schismed === true) return true;
  if (
    row.resumeWhileLive === true &&
    row.resumingBanner === true &&
    row.workflowProgressOnly === true
  ) {
    return true;
  }
  if (row.resumeWhileLive === true && row.resumingBanner === true) {
    return true;
  }
  if (
    row.localAgentCopy === true ||
    row.resumingBanner === true ||
    row.workflowProgressOnly === true ||
    row.dualWriter === true ||
    row.fourLaneDup === true ||
    row.conflictingEdits === true ||
    (row.resumeWhileLive === true && row.localAgentCopy === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one schism pass against the twin pulpits.
 * live: one in-process workflow agent; singular writer; addressable.
 * schismed / schism: dual-writer resume while the original still runs.
 * resume-while-live: resume path does not see the in-process agent as live.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isResumeWhileLivePath(row) ||
    (row.resumeWhileLive && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "resume-while-live";
  } else if (isSchismed(row)) {
    verdict = "schism";
  } else if (isLive(row)) {
    verdict = "live";
  } else if (
    row.resumeWhileLive ||
    row.localAgentCopy ||
    row.resumingBanner ||
    (row.workflowProgressOnly && !row.live)
  ) {
    verdict = "schism";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const agent = inspectLiveAgent(row);
  const resume = inspectResume(row);
  const copy = inspectCopy(row);
  const progress = inspectProgress(row);
  const collision = inspectCollision(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    live: verdict === "live" || verdict === "hold",
    schismed:
      verdict === "schismed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    resumeWhileLive:
      row.resumeWhileLive === true ||
      verdict === "resume-while-live" ||
      verdict === PATH_WORD,
    workflowProgressOnly: row.workflowProgressOnly,
    resumingBanner: row.resumingBanner,
    localAgentCopy: row.localAgentCopy,
    dualWriter: row.dualWriter,
    fourLaneDup: row.fourLaneDup,
    conflictingEdits: row.conflictingEdits,
    cue: hold
      ? "live"
      : row.resumeWhileLive || verdict === "resume-while-live"
        ? "resume-while-live"
        : "schismed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit live" : "score schism",
    agentInspect: agent,
    resumeInspect: resume,
    copyInspect: copy,
    progressInspect: progress,
    collisionInspect: collision,
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
      : SCHISM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "schism" || row.verdict === "schismed",
  );
  const path = scored.filter((row) => row.verdict === "resume-while-live");
  const live = scored.filter((row) => row.verdict === "live");
  const headline =
    scored.find((row) => row.event === "schismed") ||
    scored.find((row) => row.event === "resume-while-live") ||
    scored.find((row) => row.event === "local-agent-copy") ||
    dead[dead.length - 1];
  let verdict = "live";
  if (dead.length) verdict = "schism";
  else if (path.length && !live.length) verdict = "resume-while-live";
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
    schismedCount: dead.length,
    pathCount: path.length,
    liveCount: live.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit live" : "score schism",
    note: headline
      ? "Resuming agent banner; second local_agent copy from transcript; original still in-process; four-lane duplicates."
      : "published schism walk scored against live vs schismed",
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
    seeded !== "live" &&
    seeded !== "schismed" &&
    seeded !== "resume-while-live" &&
    seeded !== "schism" &&
    ticket.live == null &&
    ticket.schismed == null &&
    ticket.resumeWhileLive == null &&
    ticket.resumingBanner == null &&
    ticket.localAgentCopy == null &&
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
    live: scored.live ?? false,
    schismed: scored.schismed ?? false,
    resumeWhileLive: scored.resumeWhileLive ?? false,
    workflowProgressOnly: scored.workflowProgressOnly ?? false,
    resumingBanner: scored.resumingBanner ?? false,
    localAgentCopy: scored.localAgentCopy ?? false,
    dualWriter: scored.dualWriter ?? false,
    fourLaneDup: scored.fourLaneDup ?? false,
    conflictingEdits: scored.conflictingEdits ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.live && !result.schismed ? "writers=singular" : "writers=dual",
    result.resumeWhileLive || result.schismed ? "resume=while-live" : "resume=refused",
    result.localAgentCopy || result.schismed ? "copy=local_agent" : "copy=none",
    result.workflowProgressOnly || result.schismed
      ? "registry=miss"
      : "registry=live",
    result.resumeWhileLive || result.verdict === "resume-while-live"
      ? "path=resume-while-live"
      : "path=live",
    result.cue === "live"
      ? "cue=live"
      : result.cue === "resume-while-live"
        ? "cue=resume-while-live"
        : "cue=schismed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    live: result.live,
    schismed: result.schismed,
    resumeWhileLive: result.resumeWhileLive,
    workflowProgressOnly: result.workflowProgressOnly,
    resumingBanner: result.resumingBanner,
    localAgentCopy: result.localAgentCopy,
    dualWriter: result.dualWriter,
    fourLaneDup: result.fourLaneDup,
    conflictingEdits: result.conflictingEdits,
    agent: input && input.agent,
    resume: input && input.resume,
    copy: input && input.copy,
    progress: input && input.progress,
    collision: input && input.collision,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    agent: inspectLiveAgent({
      live: result.live,
      schismed: result.schismed,
      agent: input && input.agent,
    }),
    resume: inspectResume({
      live: result.live,
      schismed: result.schismed,
      resumeWhileLive: result.resumeWhileLive,
      resumingBanner: result.resumingBanner,
      resume: input && input.resume,
    }),
    copy: inspectCopy({
      live: result.live,
      schismed: result.schismed,
      localAgentCopy: result.localAgentCopy,
      copy: input && input.copy,
    }),
    progress: inspectProgress({
      live: result.live,
      schismed: result.schismed,
      workflowProgressOnly: result.workflowProgressOnly,
      progress: input && input.progress,
    }),
    collision: inspectCollision({
      live: result.live,
      schismed: result.schismed,
      fourLaneDup: result.fourLaneDup,
      conflictingEdits: result.conflictingEdits,
      collision: input && input.collision,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      schismed:
        result.schismed === true ||
        result.verdict === "schismed" ||
        result.verdict === "schism",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      surface: SURFACE,
      agentId: AGENT_ID,
      resumeBanner: RESUME_BANNER,
      workflowName: WORKFLOW_NAME,
      agentLabel: AGENT_LABEL,
      taskTypeCopy: TASK_TYPE_COPY,
      taskTypeWorkflow: TASK_TYPE_WORKFLOW,
      sleepSeconds: SLEEP_SECONDS,
      laneCount: LANE_COUNT,
      panels: NAVE_PANELS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: resume path consults task registry only, misses in-process workflow agents that lack their own task_started, takes resume-from-transcript. Invite verify against #93797 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
