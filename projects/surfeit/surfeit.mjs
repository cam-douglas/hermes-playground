#!/usr/bin/env node
/**
 * Surfeit — banquet / cellar / excess booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * a workflow keeps spawning agents after a terminal session-limit
 * error; resumeFromRunId re-runs the dead ones into a second
 * exhaustion; both runs report status: completed. The kitchen keeps
 * plating courses after the cellar is empty.
 *
 *   node surfeit.mjs data/surfeit.json
 *   echo '{"seed":"surfeit"}' | node surfeit.mjs
 *
 * Idle word is tempered (HOLD: solvent / frugal / circuit-held / no-spawn).
 * Seeded word is surfeit (#94012 — the quota-spawn cascade).
 * Path word is quota-spawn-cascade.
 * Product score word is surfeit (Score surfeit or admit tempered.).
 *
 * Encoded from anthropics/claude-code#94012 issue text only.
 * Hypothesis (NON-BINDING): orchestrator lacks a run-terminal circuit
 * breaker on session-limit errors and treats them as per-agent failures.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Phosphene/#94003 (layer-tree-walk). NOT Parablepsis/#93954
 * (latin1-edit-wipe). NOT Demesne/#93989 (home-bind-overreach).
 * NOT Foundling/#93889 (subagent-bash-outlive — child Bash outlives
 * subagent; Surfeit is orchestrator ignoring terminal session-limit).
 * Cousins cite-only: #91449 (in-flight subagent checkpoint after
 * usage-limit), #92631 (Ultracode overrides workflow size), #91942
 * (Ultracode reported ON; 160 subagents). Do not conflate.
 * Surfeit is specifically the harness continuing after being told
 * 34 times it was out of budget.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "tempered",
  "surfeit",
  "quota-spawn-cascade",
  "hold",
  "solvent",
  "frugal",
  "circuit-held",
  "no-spawn",
  "session-limit",
  "resume-amplify",
  "status-completed-lie",
  "agents-108",
  "killed-34",
  "killed-42",
  "after-first-133",
  "tokens-16m",
  "journal-424",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "tempered";
export const PATH_WORD = "quota-spawn-cascade";
export const SEEDED_WORD = "surfeit";
export const PRODUCT_WORD = "surfeit";
export const HOLD = Object.freeze(["tempered", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "tempered",
  "solvent",
  "frugal",
  "circuit-held",
  "no-spawn",
]);
export const RECOVER = Object.freeze(["tempered", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "quiescent",
  "phosphene",
  "layer-tree-walk",
  "diplomatic",
  "parablepsis",
  "latin1-edit-wipe",
  "demesned",
  "demesne",
  "home-bind-overreach",
  "diagrammed",
  "cartouche",
  "section-poster",
  "unattainted",
  "attaint",
  "session-attainder",
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
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
  "latin1-edit-wipe",
  "home-bind-overreach",
  "latent",
  "afterimage",
  "legible",
  "scotomized",
  "scotoma",
  "command-args-blind",
  "followspot",
  "thrash",
  "scrim",
  "relict",
  "pentimento",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "gleaner",
  "unreaped",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "surfeit"),
);

export const FEATURED_ISSUE = 94012;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94012";
export const TITLE =
  "[BUG] Workflow keeps spawning agents after a terminal \"session limit\" error, and resumeFromRunId re-runs them into a second exhaustion — both report status: completed";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:cost",
  "area:agents",
]);
export const PLATFORM = "macos";
export const SURFACE = "quota-spawn-cascade";
export const HOST = "Claude Code workflow";
export const CHECKED_ON =
  "two runs of one workflow (same runId; second with resumeFromRunId)";
export const BUILD = "unspecified";
export const SELECTED_MODEL = "unspecified";
export const OS = "macos";
export const PHRASE = "Score surfeit or admit tempered.";
export const DISTRIBUTION =
  "Measured across two runs of one workflow (same runId, second with resumeFromRunId): run 1: 108 agents, 8,527,469 subagent tokens, 34 killed by quota, 51 min wall, status completed. run 2 (resume): 108 agents, 8,052,689 subagent tokens, 42 killed by quota, 56 min wall, status completed. Shared journal.jsonl (424 records): after the FIRST agent failure, 133 more agents were started, 75 of which failed. 16.6M subagent tokens across two full session windows.";

export const RULED_OUT = Object.freeze([
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash, not quota spawn",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe, not session-limit cascade",
  "Demesne/#93989 home-bind-overreach — bwrap /home bind, not orchestrator quota",
  "Cartouche/#93772 section-poster — wrong diagram type, not spawn after empty cellar",
  "Attaint/#93821 session-attainder — cyber-safeguard stain, not session-limit",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout, not agent spawn cascade",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not quota circuit",
  "Trismus/#93823 UNUserNotification XPC lockjaw — freeze, not spawn-after-limit",
  "Foundling/#93889 subagent-bash-outlive — child Bash outlives subagent; Surfeit is orchestrator ignoring terminal session-limit",
  "Crasis/#93960 store-slug-collide — memory drawer, not quota spawn",
  "Tessera/#93929 version-path-tcc — privacy-pane rows, not session-limit",
  "Mojibake/#93848 fffd-spall — encoding, not agent cascade",
  "Scissel / Feoffee / Apograph / Airlock — different catalog defects",
  "Scotoma/#93744 command-args-blind — Humphrey Stop evaluator, not quota",
  "Afterimage — CRT phosphor residual, not banquet cellar",
  "Thrash — different catalog thrash booth, not quota-spawn-cascade",
  "Gleaner — unreaped leftovers, not kitchen plating after an empty cellar",
]);
export const EXPECTED = Object.freeze([
  "A terminal session-limit error should trip a run-wide circuit breaker — no further agents after the cellar is empty",
  "resumeFromRunId should protect spent work, not replay cached research and re-run failed verifiers into a second reset window",
  "A run that lost ~39% of agents should not headline status: completed",
  "The orchestrator should not treat a window-terminal quota death as a per-agent failure and keep feeding the queue",
  "After the first \"You've hit your session limit · resets <time>\", 133 more agents should not start",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "agents-108",
    label: "agents 108",
    count: "108 agents",
    note: "both runs spawned 108 agents; run 1 wall 51 min; run 2 wall 56 min",
  },
  {
    id: "killed-34",
    label: "killed 34 / 42",
    count: "34 then 42",
    note: "run 1: 34 killed by quota; run 2 resume: 42 killed by quota",
  },
  {
    id: "after-first-133",
    label: "after first 133",
    count: "133 more",
    note: "after the FIRST agent failure, 133 more agents were started, 75 of which failed",
  },
  {
    id: "tokens-16m",
    label: "tokens 16.6M",
    count: "16.6M",
    note: "16.6M subagent tokens, two full session windows, user's Fable quota for the day",
  },
  {
    id: "status-completed-lie",
    label: "status completed",
    count: "status: completed",
    note: "neither run aborts; both report status: completed after losing ~39% of agents",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "tempered-cellar",
    survey:
      "cellar still solvent; circuit held; kitchen plates no course after quota is gone",
    kind: "tempered",
    note: "idle: tempered — the hold/good path",
  },
  {
    id: "session-limit",
    survey:
      "first agent dies with You've hit your session limit · resets <time> — terminal for the whole window",
    kind: "surfeit",
    note: "seeded: session-limit of the window",
  },
  {
    id: "quota-spawn-cascade",
    survey:
      "orchestrator treats the terminal error as a per-agent failure and keeps feeding the queue — 133 more after first death",
    kind: "surfeit",
    note: "path: quota-spawn-cascade names the kitchen plating after an empty cellar",
  },
  {
    id: "resume-amplify",
    survey:
      "resumeFromRunId replays cached research then re-runs failed verifiers into a different reset window, doubling spend",
    kind: "surfeit",
    note: "seeded: resume-amplify of the dead courses",
  },
  {
    id: "surfeit",
    survey:
      "the banquet is surfeit — 108 agents twice; 34 then 42 killed; 16.6M tokens; both status: completed",
    kind: "surfeit",
    note: "seeded: surfeit — Score surfeit or admit tempered.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "quota-spawn-cascade",
  "surfeit",
  "session-limit",
  "resume-amplify",
  "status-completed-lie",
  "agents-108",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91449,
    title: "in-flight subagent checkpoint after usage-limit (inside-agent resume)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — inside-agent resume after usage-limit. Different defect from orchestrator spawn-after-terminal-quota. Do not conflate.",
  },
  {
    issue: 92631,
    title: "Ultracode overrides workflow size guideline / no agent ceiling",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — sizing / no agent ceiling. Sizing half of the spend; this booth is the harness continuing after being told 34 times it was out of budget.",
  },
  {
    issue: 91942,
    title: "Ultracode reported ON without enabling; 160 subagents exhaust session",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Ultracode reported ON; 160 subagents. Different enablement defect. Do not conflate with no circuit breaker on session-limit.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925 desktop blackout", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967 OAuth profile scope Windows", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957 stuck after interrupt / No response requested", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93996, title: "backup #93996 orphaned Bash tsc/vitest after session stop", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "afterimage",
  "thrash",
  "gleaner",
]);

export const SAMPLE_KIND_IDLE = "frugal";
export const SAMPLE_KIND_SEEDED = "quota-spawn-cascade";
export const SAMPLE_HOLDING_IDLE = "solvent";
export const SAMPLE_HOLDING_SEEDED = "surplus";

export const SAMPLE_TEMPERED_PROOF = Object.freeze({
  tempered: true,
  surfeit: false,
  quotaSpawnCascade: false,
  sessionLimit: false,
  resumeAmplify: false,
  statusCompletedLie: false,
  agents108: false,
  killed34: false,
  killed42: false,
  afterFirst133: false,
  tokens16m: false,
  journal424: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SURFEIT_PROOF = Object.freeze({
  tempered: false,
  surfeit: true,
  quotaSpawnCascade: true,
  sessionLimit: true,
  resumeAmplify: true,
  statusCompletedLie: true,
  agents108: true,
  killed34: true,
  killed42: true,
  afterFirst133: true,
  tokens16m: true,
  journal424: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds tempered: cellar solvent; circuit held; no spawn after quota" },
  { t: "session-limit", line: "first agent dies with You've hit your session limit · resets <time>" },
  { t: "quota-spawn-cascade", line: "133 more agents started after the first failure; 75 of them failed" },
  { t: "path", line: "quota-spawn-cascade — kitchen keeps plating after the cellar is empty" },
  { t: "score", line: "when the harness keeps spawning the booth is surfeit — Score surfeit or admit tempered." },
]);

/**
 * Cellar map: solvent stock vs surplus plating.
 * Idle/tempered: circuit held; no spawn after empty cellar.
 * Seeded/surfeit: session-limit then 133 more courses.
 */
export function mapBanquet(input = {}) {
  const surfeit =
    input.surfeit === true ||
    input.quotaSpawnCascade === true ||
    input.sessionLimit === true ||
    input.resumeAmplify === true ||
    input.statusCompletedLie === true ||
    input.agents108 === true ||
    input.killed34 === true ||
    input.killed42 === true ||
    input.afterFirst133 === true ||
    input.tokens16m === true ||
    input.journal424 === true;
  const tempered = input.tempered === true && !surfeit;
  return {
    stamp: surfeit ? "quota-spawn-cascade" : "tempered-cellar",
    holdingLane: surfeit ? "surplus" : "solvent",
    kindLane: surfeit ? "quota-spawn-cascade" : "frugal",
    bindLane: surfeit ? "session-limit" : "no-spawn",
    ribbon: surfeit ? "surfeit" : "tempered",
    tempered,
  };
}

export function inspectCellar(input = {}) {
  const empty =
    input.surfeit === true ||
    input.quotaSpawnCascade === true ||
    input.sessionLimit === true;
  if (input.tempered === true && !empty) {
    return {
      stamp: "cellar-solvent",
      empty: false,
    };
  }
  return {
    stamp: empty ? "cellar-empty" : "cellar-idle",
    empty,
    note: empty
      ? "cellar empty: You've hit your session limit — terminal for the whole window"
      : "",
  };
}

export function inspectQueue(input = {}) {
  const hit =
    input.quotaSpawnCascade === true ||
    input.afterFirst133 === true ||
    input.surfeit === true;
  if (input.tempered === true && !hit) {
    return {
      stamp: "queue-held",
      extra: 0,
    };
  }
  return {
    stamp: hit ? "quota-spawn-cascade" : "queue-idle",
    extra: hit ? 133 : 0,
    note: hit
      ? "after the FIRST agent failure, 133 more agents were started, 75 of which failed"
      : "",
  };
}

export function inspectResume(input = {}) {
  const doubled =
    input.resumeAmplify === true ||
    input.killed42 === true ||
    input.surfeit === true;
  if (input.tempered === true && !doubled) {
    return {
      stamp: "resume-protect",
      doubled: false,
    };
  }
  return {
    stamp: doubled ? "resume-amplify" : "resume-idle",
    doubled,
    note: doubled
      ? "resumeFromRunId replayed cached research then re-ran failed verifiers into a different reset window"
      : "",
  };
}

export function inspectHeadline(input = {}) {
  const lied =
    input.statusCompletedLie === true ||
    input.surfeit === true;
  if (input.tempered === true && !lied) {
    return {
      stamp: "headline-honest",
      completed: false,
    };
  }
  return {
    stamp: lied ? "status-completed-lie" : "headline-idle",
    completed: lied,
    note: lied
      ? "both runs report status: completed after losing ~39% of agents; 8 of 52 verifier claims had zero votes"
      : "",
  };
}

export function inspectJournal(input = {}) {
  const recorded =
    input.journal424 === true ||
    input.afterFirst133 === true ||
    input.surfeit === true;
  if (input.tempered === true && input.surfeit !== true) {
    return {
      stamp: "journal-idle",
      records: 0,
    };
  }
  return {
    stamp: recorded ? "journal-424" : "journal-idle",
    records: recorded && input.surfeit === true ? 424 : recorded ? 424 : 0,
    note: recorded && input.surfeit === true
      ? "shared journal.jsonl 424 records; 133 more after first failure"
      : "",
  };
}

export function readBooth(input = {}) {
  const surfeit =
    input.surfeit === true ||
    input.quotaSpawnCascade === true ||
    input.sessionLimit === true ||
    input.resumeAmplify === true ||
    input.statusCompletedLie === true ||
    input.agents108 === true ||
    input.killed34 === true ||
    input.killed42 === true ||
    input.afterFirst133 === true ||
    input.tokens16m === true ||
    input.journal424 === true;
  const tempered = input.tempered === true && !surfeit;
  return {
    mark: surfeit ? "surfeit" : tempered || !surfeit ? "tempered" : "surfeit",
    tempered,
    surfeit,
    quotaSpawnCascade: input.quotaSpawnCascade === true || surfeit,
    sessionLimit: input.sessionLimit === true,
    resumeAmplify: input.resumeAmplify === true,
    statusCompletedLie: input.statusCompletedLie === true,
    agents108: input.agents108 === true,
    killed34: input.killed34 === true,
    killed42: input.killed42 === true,
    afterFirst133: input.afterFirst133 === true,
    tokens16m: input.tokens16m === true,
    journal424: input.journal424 === true,
    scope: mapBanquet(input),
    cellar: inspectCellar(input),
    queue: inspectQueue(input),
    resume: inspectResume(input),
    headline: inspectHeadline(input),
    journal: inspectJournal(input),
    log: input.log || [],
  };
}

export const SURFEIT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-tempered",
    tempered: true,
    surfeit: false,
    cue: "tempered",
    note: "idle HOLD: cellar solvent; circuit held — the hold/good path",
  },
  {
    t: "session-limit",
    event: "session-limit",
    surfeit: true,
    sessionLimit: true,
    cue: "surfeit",
    note: "You've hit your session limit · resets <time> — terminal for the whole window",
  },
  {
    t: "quota-spawn-cascade",
    event: "quota-spawn-cascade",
    surfeit: true,
    afterFirst133: true,
    agents108: true,
    cue: "surfeit",
    note: "133 more agents started after the first failure; 75 of them failed",
  },
  {
    t: "path",
    event: "quota-spawn-cascade",
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
    afterFirst133: true,
    cue: "surfeit",
    note: "quota-spawn-cascade — kitchen keeps plating after the cellar is empty",
  },
  {
    t: "score",
    event: "surfeit",
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
    resumeAmplify: true,
    statusCompletedLie: true,
    agents108: true,
    killed34: true,
    killed42: true,
    afterFirst133: true,
    tokens16m: true,
    journal424: true,
    cue: "surfeit",
    note: "surfeit — when the harness keeps spawning the booth is surfeit",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-tempered",
    tempered: true,
    surfeit: false,
    cue: "tempered",
    note: "positive control: cellar solvent; no spawn after quota",
  },
  {
    t: "announce",
    event: "cue-tempered",
    tempered: true,
    cue: "tempered",
    note: "positive control: the banquet stays tempered",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    tempered: true,
    surfeit: false,
    quotaSpawnCascade: false,
    cue: "tempered",
  };
}

export function seedTempered() {
  return { ...emptyTicket() };
}

export function seedSurfeit() {
  return {
    seed: SEEDED_WORD,
    tempered: false,
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
    resumeAmplify: true,
    statusCompletedLie: true,
    agents108: true,
    killed34: true,
    killed42: true,
    afterFirst133: true,
    tokens16m: true,
    journal424: true,
    cue: "surfeit",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SURFEIT_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
    cue: "surfeit",
  };
}

export function seedQuotaSpawnCascade() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
    event: "quota-spawn-cascade",
    cue: "surfeit",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    tempered: true,
    cue: "tempered",
  };
}

export function seedSessionLimit() {
  return {
    seed: "session-limit",
    preferSeed: true,
    sessionLimit: true,
    cue: "surfeit",
  };
}

export function seedResumeAmplify() {
  return {
    seed: "resume-amplify",
    preferSeed: true,
    resumeAmplify: true,
    cue: "surfeit",
  };
}

export function seedStatusCompletedLie() {
  return {
    seed: "status-completed-lie",
    preferSeed: true,
    statusCompletedLie: true,
    cue: "surfeit",
  };
}

export function seedAgents108() {
  return {
    seed: "agents-108",
    preferSeed: true,
    agents108: true,
    cue: "surfeit",
  };
}

export function seedKilled34() {
  return {
    seed: "killed-34",
    preferSeed: true,
    killed34: true,
    cue: "surfeit",
  };
}

export function seedKilled42() {
  return {
    seed: "killed-42",
    preferSeed: true,
    killed42: true,
    cue: "surfeit",
  };
}

export function seedAfterFirst133() {
  return {
    seed: "after-first-133",
    preferSeed: true,
    afterFirst133: true,
    cue: "surfeit",
  };
}

export function seedTokens16m() {
  return {
    seed: "tokens-16m",
    preferSeed: true,
    tokens16m: true,
    cue: "surfeit",
  };
}

export function seedJournal424() {
  return {
    seed: "journal-424",
    preferSeed: true,
    journal424: true,
    cue: "surfeit",
  };
}

export function seedSolvent() {
  return {
    seed: "solvent",
    preferSeed: true,
    tempered: true,
    cue: "tempered",
  };
}

export function seedFrugal() {
  return {
    seed: "frugal",
    preferSeed: true,
    tempered: true,
    cue: "tempered",
  };
}

export function seedCircuitHeld() {
  return {
    seed: "circuit-held",
    preferSeed: true,
    tempered: true,
    cue: "tempered",
  };
}

export function seedNoSpawn() {
  return {
    seed: "no-spawn",
    preferSeed: true,
    tempered: true,
    cue: "tempered",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      tempered: false,
      surfeit: false,
      quotaSpawnCascade: false,
      sessionLimit: false,
      resumeAmplify: false,
      statusCompletedLie: false,
      agents108: false,
      killed34: false,
      killed42: false,
      afterFirst133: false,
      tokens16m: false,
      journal424: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    tempered: raw.tempered === true,
    surfeit: raw.surfeit === true || raw.event === "surfeit",
    quotaSpawnCascade:
      raw.quotaSpawnCascade === true || raw.event === "quota-spawn-cascade",
    sessionLimit: raw.sessionLimit === true || raw.event === "session-limit",
    resumeAmplify: raw.resumeAmplify === true || raw.event === "resume-amplify",
    statusCompletedLie:
      raw.statusCompletedLie === true || raw.event === "status-completed-lie",
    agents108: raw.agents108 === true || raw.event === "agents-108",
    killed34: raw.killed34 === true || raw.event === "killed-34",
    killed42: raw.killed42 === true || raw.event === "killed-42",
    afterFirst133:
      raw.afterFirst133 === true || raw.event === "after-first-133",
    tokens16m: raw.tokens16m === true || raw.event === "tokens-16m",
    journal424: raw.journal424 === true || raw.event === "journal-424",
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
      (ticket.tempered != null ||
        ticket.surfeit != null ||
        ticket.quotaSpawnCascade != null ||
        ticket.sessionLimit != null ||
        ticket.resumeAmplify != null ||
        ticket.statusCompletedLie != null ||
        ticket.agents108 != null ||
        ticket.killed34 != null ||
        ticket.killed42 != null ||
        ticket.afterFirst133 != null ||
        ticket.tokens16m != null ||
        ticket.journal424 != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isTempered(row) {
  if (row.surfeit && row.cue !== "tempered") return false;
  if (row.cue === "surfeit" || row.cue === "quota-spawn-cascade") {
    return false;
  }
  if (
    row.quotaSpawnCascade &&
    row.sessionLimit &&
    row.cue !== "tempered" &&
    row.tempered !== true
  ) {
    return false;
  }
  if (row.tempered === true && row.surfeit !== true && row.cue !== "surfeit") {
    return true;
  }
  if (
    row.cue === "tempered" &&
    row.surfeit !== true &&
    row.quotaSpawnCascade !== true &&
    row.sessionLimit !== true &&
    row.resumeAmplify !== true &&
    row.statusCompletedLie !== true &&
    row.agents108 !== true &&
    row.killed34 !== true &&
    row.killed42 !== true &&
    row.afterFirst133 !== true &&
    row.tokens16m !== true &&
    row.journal424 !== true
  ) {
    return true;
  }
  return false;
}

function isQuotaSpawnCascade(row) {
  return (
    row.event === "quota-spawn-cascade" &&
    !isTempered(row) &&
    (row.quotaSpawnCascade === true ||
      row.sessionLimit === true ||
      row.afterFirst133 === true)
  );
}

function isSurfeitRow(row) {
  if (isTempered(row)) return false;
  if (isQuotaSpawnCascade(row) && row.cue !== "surfeit") return false;
  if (row.cue === "surfeit") return true;
  if (row.surfeit === true) return true;
  if (row.quotaSpawnCascade === true && row.sessionLimit === true) {
    return true;
  }
  if (
    row.quotaSpawnCascade === true ||
    row.sessionLimit === true ||
    row.resumeAmplify === true ||
    row.statusCompletedLie === true ||
    row.agents108 === true ||
    row.killed34 === true ||
    row.killed42 === true ||
    row.afterFirst133 === true ||
    row.tokens16m === true ||
    row.journal424 === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one surfeit pass against the banquet cellar.
 * tempered: circuit held; no spawn after empty cellar.
 * surfeit: harness keeps plating after terminal session-limit.
 * quota-spawn-cascade: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isQuotaSpawnCascade(row) ||
    (row.quotaSpawnCascade && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "quota-spawn-cascade";
  } else if (isSurfeitRow(row)) {
    verdict = "surfeit";
  } else if (isTempered(row)) {
    verdict = "tempered";
  } else if (
    row.quotaSpawnCascade ||
    row.sessionLimit ||
    row.resumeAmplify ||
    row.statusCompletedLie ||
    row.agents108 ||
    row.killed34 ||
    row.killed42 ||
    row.afterFirst133 ||
    row.tokens16m ||
    row.journal424
  ) {
    verdict = "surfeit";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const cellar = inspectCellar(row);
  const queue = inspectQueue(row);
  const resume = inspectResume(row);
  const headline = inspectHeadline(row);
  const journal = inspectJournal(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    tempered: verdict === "tempered" || verdict === "hold",
    surfeit: verdict === "surfeit" || verdict === SEEDED_WORD,
    quotaSpawnCascade:
      row.quotaSpawnCascade === true ||
      verdict === "quota-spawn-cascade" ||
      verdict === PATH_WORD,
    sessionLimit: row.sessionLimit,
    resumeAmplify: row.resumeAmplify,
    statusCompletedLie: row.statusCompletedLie,
    agents108: row.agents108,
    killed34: row.killed34,
    killed42: row.killed42,
    afterFirst133: row.afterFirst133,
    tokens16m: row.tokens16m,
    journal424: row.journal424,
    cue: hold
      ? "tempered"
      : row.quotaSpawnCascade || verdict === "quota-spawn-cascade"
        ? "quota-spawn-cascade"
        : "surfeit",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit tempered" : "score surfeit",
    cellarInspect: cellar,
    queueInspect: queue,
    resumeInspect: resume,
    headlineInspect: headline,
    journalInspect: journal,
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
      : SURFEIT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "surfeit");
  const path = scored.filter((row) => row.verdict === "quota-spawn-cascade");
  const tempered = scored.filter((row) => row.verdict === "tempered");
  const headline =
    scored.find((row) => row.event === "surfeit") ||
    scored.find((row) => row.event === "quota-spawn-cascade") ||
    scored.find((row) => row.event === "session-limit") ||
    dead[dead.length - 1];
  let verdict = "tempered";
  if (dead.length) verdict = "surfeit";
  else if (path.length && !tempered.length) verdict = "quota-spawn-cascade";
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
    surfeitCount: dead.length,
    pathCount: path.length,
    temperedCount: tempered.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit tempered" : "score surfeit",
    note: headline
      ? "Workflow keeps spawning after terminal session-limit; resumeFromRunId doubles the bleed; both runs report status: completed. Cousins cite-only: #91449 #92631 #91942."
      : "published surfeit walk scored against tempered vs surfeit",
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
    seeded !== "tempered" &&
    seeded !== "surfeit" &&
    seeded !== "quota-spawn-cascade" &&
    ticket.tempered == null &&
    ticket.surfeit == null &&
    ticket.quotaSpawnCascade == null &&
    ticket.sessionLimit == null &&
    ticket.resumeAmplify == null &&
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
    tempered: scored.tempered ?? false,
    surfeit: scored.surfeit ?? false,
    quotaSpawnCascade: scored.quotaSpawnCascade ?? false,
    sessionLimit: scored.sessionLimit ?? false,
    resumeAmplify: scored.resumeAmplify ?? false,
    statusCompletedLie: scored.statusCompletedLie ?? false,
    agents108: scored.agents108 ?? false,
    killed34: scored.killed34 ?? false,
    killed42: scored.killed42 ?? false,
    afterFirst133: scored.afterFirst133 ?? false,
    tokens16m: scored.tokens16m ?? false,
    journal424: scored.journal424 ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.sessionLimit || result.surfeit ? "kind=quota-spawn-cascade" : "kind=frugal",
    result.killed34 || result.surfeit ? "killed=34" : "killed=none",
    result.quotaSpawnCascade || result.verdict === "quota-spawn-cascade"
      ? "path=quota-spawn-cascade"
      : "path=tempered",
    result.cue === "tempered"
      ? "cue=tempered"
      : result.cue === "quota-spawn-cascade"
        ? "cue=quota-spawn-cascade"
        : "cue=surfeit",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    tempered: result.tempered,
    surfeit: result.surfeit,
    quotaSpawnCascade: result.quotaSpawnCascade,
    sessionLimit: result.sessionLimit,
    resumeAmplify: result.resumeAmplify,
    statusCompletedLie: result.statusCompletedLie,
    agents108: result.agents108,
    killed34: result.killed34,
    killed42: result.killed42,
    afterFirst133: result.afterFirst133,
    tokens16m: result.tokens16m,
    journal424: result.journal424,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    cellar: inspectCellar({
      tempered: result.tempered,
      surfeit: result.surfeit,
      quotaSpawnCascade: result.quotaSpawnCascade,
      sessionLimit: result.sessionLimit,
    }),
    queue: inspectQueue({
      tempered: result.tempered,
      surfeit: result.surfeit,
      quotaSpawnCascade: result.quotaSpawnCascade,
      afterFirst133: result.afterFirst133,
    }),
    resume: inspectResume({
      tempered: result.tempered,
      surfeit: result.surfeit,
      resumeAmplify: result.resumeAmplify,
      killed42: result.killed42,
    }),
    headline: inspectHeadline({
      tempered: result.tempered,
      surfeit: result.surfeit,
      statusCompletedLie: result.statusCompletedLie,
    }),
    journal: inspectJournal({
      tempered: result.tempered,
      surfeit: result.surfeit,
      journal424: result.journal424,
      afterFirst133: result.afterFirst133,
    }),
    scope: mapBanquet({
      tempered: result.tempered,
      surfeit: result.surfeit,
      quotaSpawnCascade: result.quotaSpawnCascade,
      sessionLimit: result.sessionLimit,
      resumeAmplify: result.resumeAmplify,
      statusCompletedLie: result.statusCompletedLie,
      agents108: result.agents108,
      killed34: result.killed34,
      killed42: result.killed42,
      afterFirst133: result.afterFirst133,
      tokens16m: result.tokens16m,
      journal424: result.journal424,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      surfeit:
        result.surfeit === true ||
        result.verdict === "surfeit",
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: orchestrator lacks a run-terminal circuit breaker on session-limit errors and treats them as per-agent failures. Invite verify against #94012 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
