#!/usr/bin/env node
/**
 * Vizard — masquerade / Elizabethan vizard atelier booth.
 *
 * Educational diagnostic model for a published Claude Code
 * Desktop slash-command defect: the atelier should stay unmasked
 * (CLI-style precedence — project `/plan` wins; description shows
 * `(project)`; command runs with $ARGUMENTS). Instead Desktop
 * Remote Control wears the built-in `/plan` as a vizard — client-side
 * intercept enters built-in plan mode; `/plan` is stripped; args
 * left unsent; no round trip; server-side CLI resolution never runs.
 *
 *   node vizard.mjs data/vizard.json
 *   echo '{"seed":"vizard"}' | node vizard.mjs
 *
 * Idle word is unmasked (HOLD: CLI-style precedence — project
 * `/plan` wins; description shows `(project)`; command runs with
 * $ARGUMENTS).
 * Seeded word is vizard (#93190: Desktop client-side intercept —
 * built-in plan mode; `/plan` stripped; args left unsent; no
 * round trip).
 * Path word is precedence (project commands must outrank built-ins
 * on every surface).
 *
 * Encoded from anthropics/claude-code#93190 issue body only.
 * Hypothesis (NON-BINDING): Desktop composer does its own slash
 * handling and hard-binds `/plan` to built-in plan mode before
 * submission, so project-command precedence that the CLI applies
 * never gets a chance. Verify against #93190 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "unmasked",
  "vizard",
  "precedence",
  "hold",
  "project-command",
  "built-in-plan-mode",
  "client-side-intercept",
  "remote-control-desktop",
  "arguments-unsent",
  "no-round-trip",
  "read-only-wrong-mode",
  "companion-work",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "unmasked";
export const PATH_WORD = "precedence";
export const SEEDED_WORD = "vizard";
export const HOLD = Object.freeze(["unmasked", "project-command", "hold"]);
export const RECOVER = Object.freeze(["unmasked", "project-command", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "carrier",
  "deadair",
  "squelch",
  "moored",
  "scuttled",
  "scuttle",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "fresh",
  "stamped",
  "cleared",
  "mounded",
  "distinct",
  "conflated",
  "held",
  "steered",
  "raised",
  "fallen",
  "sterling",
  "primed",
  "flashed",
  "lodged",
  "bypassed",
  "greenroomed",
  "scaffold",
  "diplopic",
  "freewheeling",
  "doubled",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "collated",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "vizard"),
);

export const FEATURED_ISSUE = 93190;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93190";
export const TITLE =
  "[BUG] Desktop app resolves /plan to built-in plan mode; CLI correctly resolves it to the project's /plan command";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:skills",
  "area:desktop",
]);
export const CLI = "Claude Code CLI 2.1.266";
export const DESKTOP = "Claude Desktop Windows 1.49585.0 (41ad1d)";
export const DESKTOP_BUILT = "2026-09-08";
export const OS = "Windows 11 Pro 23H2 22631.3155";
export const SHELL = "PowerShell";
export const COMMAND_FILE = ".claude/commands/plan.md";
export const PLANNING_SKILL = "planning";
export const PLAN_OUTPUT = ".claude/plans/<slug>/PLAN.md";
export const COMPANION_WORK = "/work <slug>";
export const REMOTE_SPAWN = "claude --remote-control --spawn worktree";
export const ARGUMENTS_EXAMPLE = "foo bar";
export const PROJECT_MARK = "(project)";
export const REGRESSION = true;
export const INTERCEPT_SURFACE = "client-side in Desktop";
export const PHRASE =
  "when Desktop wears the built-in /plan as a vizard over the project's command, precedence never runs — score vizard or admit unmasked.";

export const FINGERPRINT_LINES = Object.freeze([
  ".claude/commands/plan.md",
  "(project)",
  "built-in plan mode",
  "/plan stripped",
  "foo bar left unsent",
  "no round trip",
  "claude --remote-control --spawn worktree",
  "2.1.266",
  "1.49585.0 (41ad1d)",
]);

export const COUSINS = Object.freeze([
  {
    issue: 82676,
    title: "Desktop SSH slash palette omits remote custom skills — lazy CLI spawn",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Desktop SSH slash palette omits remote custom skills; not a /plan built-in intercept over a project command; cite only; do not clone",
  },
  {
    issue: 89398,
    title: "Desktop slash picker only opens when / is first character",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "slash picker gating on first character; not Desktop resolving /plan to built-in plan mode; cite only; do not clone",
  },
  {
    issue: 85654,
    title: "slash inside collapsed pasted-text never dispatched",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "slash inside collapsed pasted-text never dispatched; not client-side /plan intercept; cite only; do not clone",
  },
  {
    issue: 68252,
    title: "built-ins typed in Remote Control routed as plain text",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "opposite failure: built-ins typed in Remote Control routed as plain text; cite only; do not clone",
  },
  {
    issue: 68102,
    title: "built-ins typed in Remote Control routed as plain text",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "opposite failure: built-ins typed in Remote Control routed as plain text; cite only; do not clone",
  },
  {
    issue: 29156,
    title: "built-ins typed in Remote Control routed as plain text",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "opposite failure: built-ins typed in Remote Control routed as plain text; cite only; do not clone",
  },
  {
    issue: 28379,
    title: "built-ins typed in Remote Control routed as plain text",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "opposite failure: built-ins typed in Remote Control routed as plain text; cite only; do not clone",
  },
  {
    issue: 92138,
    title: "two built-ins share /design",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "two built-ins share /design; not Desktop /plan vizard over a project planning command; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "understudy",
  "mirage",
  "trompe",
  "homonym",
  "shibboleth",
  "procrustes",
  "interlock",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "clepsydra",
  "fusee",
  "reed",
  "quench",
  "wildcat",
  "snatch",
  "deadman",
]);

/**
 * Published vizard walk from #93190 only. Facts from the issue body.
 * An unmasked atelier keeps CLI-style precedence: project /plan wins.
 * A vizard is Desktop wearing built-in plan mode over the project command.
 */
export const VIZARD_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-unmasked",
    projectCommandWins: true,
    descriptionShowsProject: true,
    argumentsRun: true,
    builtInPlanMode: false,
    slashStripped: false,
    argumentsUnsent: false,
    noRoundTrip: false,
    clientSideIntercept: false,
    remoteControlDesktop: false,
    planModeReadOnly: false,
    cue: "unmasked",
    note: "idle HOLD: CLI-style precedence — project /plan wins; description shows (project); command runs with $ARGUMENTS",
  },
  {
    t: "file",
    event: "project-command",
    projectCommandWins: true,
    commandFile: COMMAND_FILE,
    planningSkill: PLANNING_SKILL,
    descriptionShowsProject: true,
    cue: "unmasked",
    note: "project-level /plan command at .claude/commands/plan.md invokes a project planning skill",
  },
  {
    t: "cli",
    event: "cli-project",
    projectCommandWins: true,
    descriptionShowsProject: true,
    argumentsRun: true,
    argumentsExample: ARGUMENTS_EXAMPLE,
    cue: "unmasked",
    note: "CLI: /plan foo bar runs the project command with $ARGUMENTS; description shows (project)",
  },
  {
    t: "rc",
    event: "remote-control-desktop",
    remoteControlDesktop: true,
    remoteSpawn: REMOTE_SPAWN,
    cue: "vizard",
    note: "Start Remote Control claude --remote-control --spawn worktree; connect from Desktop",
  },
  {
    t: "intercept",
    event: "client-side-intercept",
    clientSideIntercept: true,
    remoteControlDesktop: true,
    noRoundTrip: true,
    cue: "vizard",
    note: "Desktop composer intercepts /plan locally; intercept appears entirely client-side in Desktop",
  },
  {
    t: "mode",
    event: "built-in-plan-mode",
    builtInPlanMode: true,
    planModeReadOnly: true,
    clientSideIntercept: true,
    cue: "vizard",
    note: "permission mode flips to Plan; built-in plan mode takes the argument string as the plan description",
  },
  {
    t: "strip",
    event: "slash-stripped",
    slashStripped: true,
    builtInPlanMode: true,
    cue: "vizard",
    note: "/plan stripped from the composer",
  },
  {
    t: "args",
    event: "arguments-unsent",
    argumentsUnsent: true,
    argumentsExample: ARGUMENTS_EXAMPLE,
    slashStripped: true,
    cue: "vizard",
    note: "foo bar left unsent in composer",
  },
  {
    t: "trip",
    event: "no-round-trip",
    noRoundTrip: true,
    clientSideIntercept: true,
    cue: "vizard",
    note: "No round trip; server-side CLI resolution never runs",
  },
  {
    t: "mode-wrong",
    event: "read-only-wrong-mode",
    planModeReadOnly: true,
    builtInPlanMode: true,
    projectWrites: true,
    cue: "vizard",
    note: "Plan mode is a read-only permission mode. The project's /plan is a workflow that may write/run tests, commit and land on origin/main. Read-only is wrong for it.",
  },
  {
    t: "work",
    event: "companion-work",
    companionWork: true,
    companion: COMPANION_WORK,
    cue: "vizard",
    note: "Companion /work <slug> executes a plan",
  },
  {
    t: "mask",
    event: "vizard",
    projectCommandWins: false,
    descriptionShowsProject: false,
    argumentsRun: false,
    builtInPlanMode: true,
    slashStripped: true,
    argumentsUnsent: true,
    noRoundTrip: true,
    clientSideIntercept: true,
    remoteControlDesktop: true,
    planModeReadOnly: true,
    companionWork: true,
    cue: "vizard",
    note: "Desktop wears the built-in /plan as a vizard over the project's command; score vizard",
  },
  {
    t: "path",
    event: "precedence",
    precedence: true,
    cue: "vizard",
    note: "when Desktop wears the built-in /plan as a vizard over the project's command, precedence never runs",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    projectCommandWins: true,
    descriptionShowsProject: true,
    argumentsRun: true,
    builtInPlanMode: false,
    slashStripped: false,
    argumentsUnsent: false,
    noRoundTrip: false,
    clientSideIntercept: false,
    remoteControlDesktop: false,
    planModeReadOnly: false,
    companionWork: false,
    precedence: false,
    cue: "unmasked",
  };
}

export function seedUnmasked() {
  return { ...emptyTicket() };
}

export function seedVizard() {
  return {
    seed: SEEDED_WORD,
    projectCommandWins: false,
    descriptionShowsProject: false,
    argumentsRun: false,
    builtInPlanMode: true,
    slashStripped: true,
    argumentsUnsent: true,
    noRoundTrip: true,
    clientSideIntercept: true,
    remoteControlDesktop: true,
    planModeReadOnly: true,
    companionWork: true,
    argumentsExample: ARGUMENTS_EXAMPLE,
    cue: "vizard",
    issue: FEATURED_ISSUE,
  };
}

export function seedPrecedence() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    precedence: true,
    cue: "vizard",
  };
}

export function seedProjectCommand() {
  return {
    seed: "project-command",
    preferSeed: true,
    projectCommandWins: true,
    descriptionShowsProject: true,
    commandFile: COMMAND_FILE,
    planningSkill: PLANNING_SKILL,
    cue: "unmasked",
  };
}

export function seedBuiltInPlanMode() {
  return {
    seed: "built-in-plan-mode",
    builtInPlanMode: true,
    planModeReadOnly: true,
    cue: "vizard",
  };
}

export function seedClientSideIntercept() {
  return {
    seed: "client-side-intercept",
    clientSideIntercept: true,
    noRoundTrip: true,
    remoteControlDesktop: true,
    cue: "vizard",
  };
}

export function seedRemoteControlDesktop() {
  return {
    seed: "remote-control-desktop",
    remoteControlDesktop: true,
    remoteSpawn: REMOTE_SPAWN,
    cue: "vizard",
  };
}

export function seedArgumentsUnsent() {
  return {
    seed: "arguments-unsent",
    argumentsUnsent: true,
    argumentsExample: ARGUMENTS_EXAMPLE,
    slashStripped: true,
    cue: "vizard",
  };
}

export function seedNoRoundTrip() {
  return {
    seed: "no-round-trip",
    noRoundTrip: true,
    clientSideIntercept: true,
    cue: "vizard",
  };
}

export function seedReadOnlyWrongMode() {
  return {
    seed: "read-only-wrong-mode",
    planModeReadOnly: true,
    builtInPlanMode: true,
    projectWrites: true,
    cue: "vizard",
  };
}

export function seedCompanionWork() {
  return {
    seed: "companion-work",
    companionWork: true,
    companion: COMPANION_WORK,
    cue: "vizard",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      projectCommandWins: false,
      descriptionShowsProject: false,
      argumentsRun: false,
      builtInPlanMode: false,
      slashStripped: false,
      argumentsUnsent: false,
      noRoundTrip: false,
      clientSideIntercept: false,
      remoteControlDesktop: false,
      planModeReadOnly: false,
      companionWork: false,
      projectWrites: false,
      precedence: false,
      commandFile: null,
      planningSkill: null,
      argumentsExample: null,
      remoteSpawn: null,
      companion: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    projectCommandWins: raw.projectCommandWins === true,
    descriptionShowsProject: raw.descriptionShowsProject === true,
    argumentsRun: raw.argumentsRun === true,
    builtInPlanMode: raw.builtInPlanMode === true,
    slashStripped: raw.slashStripped === true,
    argumentsUnsent: raw.argumentsUnsent === true,
    noRoundTrip: raw.noRoundTrip === true,
    clientSideIntercept: raw.clientSideIntercept === true,
    remoteControlDesktop: raw.remoteControlDesktop === true,
    planModeReadOnly: raw.planModeReadOnly === true,
    companionWork: raw.companionWork === true,
    projectWrites: raw.projectWrites === true,
    precedence: raw.precedence === true,
    commandFile: raw.commandFile || null,
    planningSkill: raw.planningSkill || null,
    argumentsExample: raw.argumentsExample || null,
    remoteSpawn: raw.remoteSpawn || null,
    companion: raw.companion || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.projectCommandWins != null ||
        ticket.descriptionShowsProject != null ||
        ticket.argumentsRun != null ||
        ticket.builtInPlanMode != null ||
        ticket.slashStripped != null ||
        ticket.argumentsUnsent != null ||
        ticket.noRoundTrip != null ||
        ticket.clientSideIntercept != null ||
        ticket.remoteControlDesktop != null ||
        ticket.planModeReadOnly != null ||
        ticket.companionWork != null ||
        ticket.precedence != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isUnmasked(row) {
  if (row.precedence) return false;
  if (row.cue === "vizard") return false;
  if (
    row.builtInPlanMode &&
    row.slashStripped &&
    row.argumentsUnsent &&
    row.noRoundTrip
  ) {
    return false;
  }
  if (
    row.clientSideIntercept &&
    row.noRoundTrip &&
    row.remoteControlDesktop
  ) {
    return false;
  }
  if (
    row.projectCommandWins === true &&
    row.descriptionShowsProject === true &&
    row.builtInPlanMode !== true &&
    row.slashStripped !== true &&
    row.cue !== "vizard"
  ) {
    return true;
  }
  if (
    row.cue === "unmasked" &&
    row.builtInPlanMode !== true &&
    row.slashStripped !== true
  ) {
    return true;
  }
  return false;
}

function isVizard(row) {
  if (row.precedence && row.cue !== "unmasked") return false;
  if (row.cue === "vizard") return true;
  if (
    row.builtInPlanMode &&
    row.slashStripped &&
    row.argumentsUnsent
  ) {
    return true;
  }
  if (
    row.clientSideIntercept &&
    row.noRoundTrip &&
    row.remoteControlDesktop
  ) {
    return true;
  }
  if (row.planModeReadOnly && row.builtInPlanMode) return true;
  return false;
}

function isPrecedencePath(row) {
  return row.precedence === true && !isUnmasked(row);
}

/**
 * Score one slash-command pass against the vizard booth.
 * unmasked: CLI-style precedence; project /plan wins; (project); $ARGUMENTS run.
 * vizard: Desktop client-side intercept; built-in plan mode; /plan stripped.
 * precedence: named path — project commands must outrank built-ins on every surface.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isPrecedencePath(row)) {
    verdict = "precedence";
  } else if (isVizard(row)) {
    verdict = "vizard";
  } else if (isUnmasked(row)) {
    verdict = "unmasked";
  } else if (
    row.builtInPlanMode ||
    row.slashStripped ||
    row.argumentsUnsent ||
    row.noRoundTrip ||
    row.clientSideIntercept ||
    (row.remoteControlDesktop && row.builtInPlanMode)
  ) {
    verdict = "vizard";
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
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    unmasked: verdict === "unmasked",
    vizard: verdict === "vizard" || verdict === SEEDED_WORD,
    precedence: verdict === "precedence" || verdict === PATH_WORD,
    projectCommandWins: row.projectCommandWins,
    descriptionShowsProject: row.descriptionShowsProject,
    argumentsRun: row.argumentsRun,
    builtInPlanMode: row.builtInPlanMode,
    slashStripped: row.slashStripped,
    argumentsUnsent: row.argumentsUnsent,
    noRoundTrip: row.noRoundTrip,
    clientSideIntercept: row.clientSideIntercept,
    remoteControlDesktop: row.remoteControlDesktop,
    planModeReadOnly: row.planModeReadOnly,
    companionWork: row.companionWork,
    projectWrites: row.projectWrites,
    commandFile: row.commandFile,
    planningSkill: row.planningSkill,
    argumentsExample: row.argumentsExample,
    remoteSpawn: row.remoteSpawn,
    companion: row.companion,
    cue: hold ? "unmasked" : "vizard",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit unmasked" : "score vizard",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : VIZARD_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const vizard = scored.filter((row) => row.verdict === "vizard");
  const precedence = scored.filter((row) => row.verdict === "precedence");
  const unmasked = scored.filter((row) => row.verdict === "unmasked");
  const headline =
    scored.find((row) => row.event === "vizard") ||
    scored.find((row) => row.event === "client-side-intercept") ||
    scored.find((row) => row.event === "built-in-plan-mode") ||
    scored.find((row) => row.event === "precedence") ||
    vizard[vizard.length - 1];
  let verdict = "unmasked";
  if (vizard.length) verdict = "vizard";
  else if (precedence.length && !unmasked.length) verdict = "precedence";
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
    vizardCount: vizard.length,
    precedenceCount: precedence.length,
    unmaskedCount: unmasked.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit unmasked" : "score vizard",
    note: headline
      ? "Desktop wears the built-in /plan as a vizard; /plan stripped; args unsent; no round trip."
      : "published vizard walk scored against unmasked vs vizard",
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
    seeded !== "unmasked" &&
    seeded !== "vizard" &&
    seeded !== "precedence" &&
    ticket.projectCommandWins == null &&
    ticket.builtInPlanMode == null &&
    ticket.slashStripped == null &&
    ticket.argumentsUnsent == null &&
    ticket.noRoundTrip == null &&
    ticket.clientSideIntercept == null &&
    ticket.precedence == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
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
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
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
    projectCommandWins: scored.projectCommandWins ?? false,
    descriptionShowsProject: scored.descriptionShowsProject ?? false,
    argumentsRun: scored.argumentsRun ?? false,
    builtInPlanMode: scored.builtInPlanMode ?? false,
    slashStripped: scored.slashStripped ?? false,
    argumentsUnsent: scored.argumentsUnsent ?? false,
    noRoundTrip: scored.noRoundTrip ?? false,
    clientSideIntercept: scored.clientSideIntercept ?? false,
    remoteControlDesktop: scored.remoteControlDesktop ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.projectCommandWins ? "project=wins" : "project=lost",
    result.builtInPlanMode ? "mode=plan" : "mode=none",
    result.slashStripped ? "slash=stripped" : "slash=kept",
    result.argumentsUnsent ? "args=unsent" : "args=run",
    result.noRoundTrip ? "trip=none" : "trip=cli",
    result.cue === "unmasked" ? "cue=unmasked" : "cue=vizard",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      cli: CLI,
      desktop: DESKTOP,
      desktopBuilt: DESKTOP_BUILT,
      os: OS,
      shell: SHELL,
      commandFile: COMMAND_FILE,
      planningSkill: PLANNING_SKILL,
      planOutput: PLAN_OUTPUT,
      companionWork: COMPANION_WORK,
      remoteSpawn: REMOTE_SPAWN,
      argumentsExample: ARGUMENTS_EXAMPLE,
      projectMark: PROJECT_MARK,
      regression: REGRESSION,
      interceptSurface: INTERCEPT_SURFACE,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "CLI-style precedence: project /plan wins over the built-in",
        "description shows (project); command runs with $ARGUMENTS",
        "Desktop Remote Control should match CLI — project command reachable",
        "read-only plan mode is wrong for a write workflow that drafts PLAN.md",
      ],
      hypothesis:
        "NON-BINDING: Desktop composer does its own slash handling and hard-binds /plan to built-in plan mode before submission, so project-command precedence that the CLI applies never gets a chance",
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
