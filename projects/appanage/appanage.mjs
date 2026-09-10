#!/usr/bin/env node
/**
 * Appanage — royal-grant / heraldic inheritance desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * the bundled `code-review` skill runs as a forked agent on the parent
 * session's model, then dispatches finder and verifier children via the
 * Agent tool with no `model` set. Every child inherits the parent tier.
 * In a `claude-fable-5-1` session, one model-initiated `/code-review`
 * (the user never typed the slash command) produced 10 fable agents
 * (the fork plus 9 children) and burned ~1.5M cache-creation + ~13.7M
 * cache-read tokens in ~13 minutes with no report.
 *
 * Three stacked failures from the issue body: (1) children are not
 * model-routed, (2) no consent/cost gate on model-initiated skill
 * invoke, (3) user SessionStart/orchestration policy cannot reach
 * children inside the fork.
 *
 *   node appanage.mjs data/appanage.json
 *   echo '{"seed":"inherited"}' | node appanage.mjs
 *
 * Idle word is routed (HOLD: children carry an explicit cheaper model;
 * cost gate shown; policy reaches children).
 * Seeded word is inherited (#93307: Agent calls omit model → parent
 * tier cascade).
 * Path word is cascade (cost/model inheritance cascade).
 * Product score word is appanage (score appanage or admit routed).
 *
 * Encoded from anthropics/claude-code#93307 issue body only.
 * Hypothesis (NON-BINDING): unset `model` on Agent calls defaults to
 * the parent tier; the Skill tool has no model param; a fork inherits
 * the conversation but the skill prompt wins over policy.
 * Verify against #93307 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "routed",
  "inherited",
  "appanage",
  "cascade",
  "hold",
  "model-absent",
  "cost-gate-missing",
  "self-invoke",
  "fork-policy-blind",
  "finder-on-fable",
  "verifier-on-fable",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "routed";
export const PATH_WORD = "cascade";
export const SEEDED_WORD = "inherited";
export const PRODUCT_WORD = "appanage";
export const HOLD = Object.freeze(["routed", "hold"]);
export const RECOVER = Object.freeze(["routed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "afloat",
  "washed",
  "bridge-loss",
  "pontoon",
  "concordant",
  "mismatched",
  "header-mismatch",
  "concordat",
  "reaped",
  "revenant",
  "wedged",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "exchanged",
  "parsed",
  "precedence",
  "carrier",
  "moored",
  "scuttled",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "cleared",
  "mounded",
  "distinct",
  "held",
  "raised",
  "fallen",
  "primed",
  "flashed",
  "greenroomed",
  "scaffold",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "quieted",
  "unrung",
  "latent",
  "flushed",
  "collated",
  "stereotyped",
  "deadair",
  "squelch",
  "scuttle",
  "fresh",
  "stamped",
  "conflated",
  "steered",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "inherited" && name !== "appanage"),
);

export const FEATURED_ISSUE = 93307;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93307";
export const TITLE =
  "code-review skill: forked children inherit the parent model with no routing, no cost gate on model-initiated invocation, user policy cannot reach them";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:cost",
  "area:agents",
  "area:skills",
]);
export const AUTHOR = "elaye-canopy";
export const FILED = "2026-09-10T09:21:02Z";
export const CLAUDE_VERSION = "2.1.267";
export const OS = "macOS (darwin 24.6.0)";
export const PARENT_MODEL = "claude-fable-5-1";
export const PARENT_MODEL_SETTING = "claude-fable-5-1[1m]";
export const SKILL = "code-review";
export const SKILL_ARGS = "223 high";
export const USER_PROMPT = "do a review (no changes)";
export const FORK_COUNT = 1;
export const CHILD_COUNT = 9;
export const AGENT_COUNT = 10;
export const FINDER_ANGLES = 8;
export const VERIFIER_COUNT = 1;
export const SUBAGENT_TYPE = "general-purpose";
export const CACHE_CREATE = 1533907;
export const CACHE_READ = 13651479;
export const OUTPUT_TOKENS = 11939;
export const WINDOW = "08:14 to 08:31 UTC";
export const COST_BAND = "$15-25";
export const EFFORT = "high";
export const DEFAULT_MODE = "auto";
export const HAND_ROUTED_CACHE_CREATE = 562745;
export const HAND_ROUTED_CACHE_READ = 14062548;
export const HAND_ROUTED_OUTPUT = 4596;
export const HAND_ROUTED_MODELS = Object.freeze(["opus", "opus", "sonnet"]);
export const PHRASE =
  "when a model-initiated code-review fork lets children inherit the parent fable tier with no model, no cost gate, and no policy reach, score appanage or admit routed.";

export const GRANT_STATIONS = Object.freeze([
  {
    id: "crown",
    rite: "read the letters patent",
    kind: "parent",
    note: "parent session sits on claude-fable-5-1; the skill fork wears the same crown",
  },
  {
    id: "grant",
    rite: "sound the child appanage",
    kind: "children",
    note: "finder and verifier Agent calls omit model and inherit the parent tier",
  },
  {
    id: "seal",
    rite: "check the cost seal",
    kind: "consent",
    note: "model-initiated Skill invoke has no consent or cost gate; Skill tool has no model param",
  },
  {
    id: "policy",
    rite: "ask whether the grant reaches the cadets",
    kind: "policy",
    note: "SessionStart orchestration policy is present in the fork but the skill prompt wins",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "skill: code-review",
  "args: 223 high",
  "model-initiated invoke; user never typed /code-review",
  "parent model: claude-fable-5-1",
  "fork + 9 children = 10 fable agents",
  "Agent tool_use: model absent",
  "subagent_type: general-purpose",
  "8 finder angles + 1 verifier",
  "cache-creation: 1,533,907",
  "cache-read: 13,651,479",
  "no report; killed by hand 08:14–08:31 UTC",
  "SessionStart policy: never leave model= default; never run subagents on fable",
]);

export const COUSINS = Object.freeze([
  {
    issue: 73323,
    title: "model selector for code-review",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — asks for a model selector; do not rebuild",
  },
  {
    issue: 88003,
    title: "usage limits exhausted in 10 minutes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — usage limits; do not rebuild",
  },
  {
    issue: 90902,
    title: "fork chain token consumption",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — fork chain tokens; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93279,
    title: "HTTP MCP ~25s stall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93270,
    title: "Workflow kill leaks agents blocking archive",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93269,
    title: "archive_session live-work names four causes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93265,
    title: "ShipIt non-ASCII env double-encode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93280,
    title: "dame-moji registry",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93257,
    title: "agents auto-update relaunch drops flags",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93219,
    title: "Vernier millimeter-slider leftover — do not ship",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — leftover woodworking; forbidden as primary",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "pontoon",
  "concordat",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "flashpan",
  "clepsydra",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "ephemera",
  "oubliette",
  "buoy",
  "bollard",
  "bitts",
  "hawser",
  "vernier",
  "scion",
  "commutator",
  "heddle",
  "guillotine",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Sound the child grant — explicit cheaper model, or inherited crown.
 */
export function inspectGrant(input = {}) {
  const childrenRouted = input.childrenRouted === true;
  const modelAbsent =
    input.modelAbsent === true ||
    input.inherited === true ||
    (input.agents === AGENT_COUNT && input.modelSet !== true);
  const inherited =
    input.inherited === true ||
    (modelAbsent &&
      (input.parentFable === true ||
        input.selfInvoke === true ||
        input.finderOnFable === true));
  const routed =
    childrenRouted &&
    input.costGate === true &&
    input.policyReaches === true &&
    inherited !== true &&
    modelAbsent !== true &&
    input.inherited !== true;
  return {
    childrenRouted,
    modelAbsent,
    inherited: inherited && !routed,
    routed,
    stamp: routed ? "routed" : "inherited",
  };
}

/**
 * Read the cadency marks — finder/verifier on fable vs explicit lower tier.
 */
export function readCadency(input = {}) {
  const grant = inspectGrant(input);
  const onFable =
    input.finderOnFable === true ||
    input.verifierOnFable === true ||
    input.parentFable === true ||
    input.agents === AGENT_COUNT;
  return {
    onFable,
    stamp: onFable && !grant.routed ? "inherited" : "routed",
    agents: input.agents ?? (onFable ? AGENT_COUNT : 0),
    finderOnFable: input.finderOnFable === true,
    verifierOnFable: input.verifierOnFable === true,
  };
}

/**
 * Read the cost seal — consent/cost gate present, or missing on self-invoke.
 */
export function readSeal(input = {}) {
  const missing =
    input.costGate !== true ||
    input.costGateMissing === true ||
    input.selfInvoke === true;
  return {
    costGate: input.costGate === true,
    missing: missing && input.costGate !== true,
    stamp: input.costGate === true && input.selfInvoke !== true ? "routed" : "inherited",
    selfInvoke: input.selfInvoke === true,
  };
}

export function readGrant(input = {}) {
  const span = inspectGrant(input);
  const cadency = readCadency(input);
  const seal = readSeal(input);
  const inherited = span.inherited === true || cadency.stamp === "inherited";
  return {
    span,
    cadency,
    seal,
    stations: GRANT_STATIONS,
    inherited,
    routed: span.routed === true && !inherited,
    cue: inherited ? "inherited" : "routed",
  };
}

/**
 * Published appanage walk from #93307 only. Facts from the issue body.
 * A routed grant gives each cadet an explicit cheaper model, shows the
 * cost seal, and lets SessionStart policy reach the children.
 * An inherited grant lets every child wear the parent's fable crown.
 */
export const APPANAGE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-routed",
    routed: true,
    childrenRouted: true,
    costGate: true,
    policyReaches: true,
    inherited: false,
    modelAbsent: false,
    cue: "routed",
    note: "idle HOLD: children carry an explicit cheaper model; cost gate shown; policy reaches children",
  },
  {
    t: "crown",
    event: "parent-fable",
    parentFable: true,
    parentModel: PARENT_MODEL,
    cue: "inherited",
    note: "parent session model is claude-fable-5-1[1m]",
  },
  {
    t: "invoke",
    event: "self-invoke",
    selfInvoke: true,
    skill: SKILL,
    skillArgs: SKILL_ARGS,
    userTypedSlash: false,
    cue: "inherited",
    note: "assistant invoked code-review on its own after \"do a review (no changes)\"; user never typed /code-review",
  },
  {
    t: "seal",
    event: "cost-gate-missing",
    costGate: false,
    costGateMissing: true,
    selfInvoke: true,
    skillHasModelParam: false,
    cue: "inherited",
    note: "no consent or cost gate; Skill tool has no model parameter; docs put average cost at $15-25",
  },
  {
    t: "fork",
    event: "fork-on-parent",
    forkOnParent: true,
    parentFable: true,
    forkCount: FORK_COUNT,
    cue: "inherited",
    note: "skill runs as a forked agent on the parent session's model",
  },
  {
    t: "absent",
    event: "model-absent",
    modelAbsent: true,
    modelSet: false,
    childCount: CHILD_COUNT,
    subagentType: SUBAGENT_TYPE,
    cue: "inherited",
    note: "9 Agent tool calls, all subagent_type general-purpose, all with model absent",
  },
  {
    t: "finder",
    event: "finder-on-fable",
    finderOnFable: true,
    finderAngles: FINDER_ANGLES,
    parentFable: true,
    modelAbsent: true,
    cue: "inherited",
    note: "8 independent finder angles ran on the most expensive tier",
  },
  {
    t: "verifier",
    event: "verifier-on-fable",
    verifierOnFable: true,
    verifierCount: VERIFIER_COUNT,
    parentFable: true,
    modelAbsent: true,
    cue: "inherited",
    note: "one verifier via the Agent tool also inherited fable",
  },
  {
    t: "policy",
    event: "fork-policy-blind",
    forkPolicyBlind: true,
    policyPresent: true,
    policyReaches: false,
    skillPromptWins: true,
    cue: "inherited",
    note: "SessionStart policy never leave model= default; never run subagents on fable — present, but skill prompt wins",
  },
  {
    t: "cut",
    event: "inherited",
    routed: false,
    inherited: true,
    parentFable: true,
    selfInvoke: true,
    costGate: false,
    costGateMissing: true,
    modelAbsent: true,
    finderOnFable: true,
    verifierOnFable: true,
    forkPolicyBlind: true,
    policyReaches: false,
    agents: AGENT_COUNT,
    childCount: CHILD_COUNT,
    cacheCreate: CACHE_CREATE,
    cacheRead: CACHE_READ,
    outputTokens: OUTPUT_TOKENS,
    report: false,
    cue: "inherited",
    note: "10 fable agents; 1,533,907 cache-creation; 13,651,479 cache-read; no report; killed by hand",
  },
  {
    t: "path",
    event: "cascade",
    inherited: true,
    modelAbsent: true,
    cue: "inherited",
    note: "cascade — cost/model inheritance from parent crown to every cadet",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    routed: true,
    childrenRouted: true,
    costGate: true,
    policyReaches: true,
    inherited: false,
    modelAbsent: false,
    parentFable: false,
    selfInvoke: false,
    finderOnFable: false,
    verifierOnFable: false,
    forkPolicyBlind: false,
    cue: "routed",
  };
}

export function seedRouted() {
  return { ...emptyTicket() };
}

export function seedInherited() {
  return {
    seed: SEEDED_WORD,
    routed: false,
    inherited: true,
    parentFable: true,
    parentModel: PARENT_MODEL,
    selfInvoke: true,
    costGate: false,
    costGateMissing: true,
    modelAbsent: true,
    modelSet: false,
    finderOnFable: true,
    verifierOnFable: true,
    forkPolicyBlind: true,
    policyReaches: false,
    skillPromptWins: true,
    agents: AGENT_COUNT,
    forkCount: FORK_COUNT,
    childCount: CHILD_COUNT,
    cacheCreate: CACHE_CREATE,
    cacheRead: CACHE_READ,
    outputTokens: OUTPUT_TOKENS,
    report: false,
    cue: "inherited",
    issue: FEATURED_ISSUE,
  };
}

export function seedAppanage() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    inherited: true,
    modelAbsent: true,
    parentFable: true,
    cue: "inherited",
  };
}

export function seedCascade() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    inherited: true,
    modelAbsent: true,
    cue: "inherited",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    routed: true,
    cue: "routed",
  };
}

export function seedModelAbsent() {
  return {
    seed: "model-absent",
    preferSeed: true,
    modelAbsent: true,
    cue: "inherited",
  };
}

export function seedCostGateMissing() {
  return {
    seed: "cost-gate-missing",
    preferSeed: true,
    costGateMissing: true,
    cue: "inherited",
  };
}

export function seedSelfInvoke() {
  return {
    seed: "self-invoke",
    preferSeed: true,
    selfInvoke: true,
    cue: "inherited",
  };
}

export function seedForkPolicyBlind() {
  return {
    seed: "fork-policy-blind",
    preferSeed: true,
    forkPolicyBlind: true,
    policyReaches: false,
    cue: "inherited",
  };
}

export function seedFinderOnFable() {
  return {
    seed: "finder-on-fable",
    preferSeed: true,
    finderOnFable: true,
    cue: "inherited",
  };
}

export function seedVerifierOnFable() {
  return {
    seed: "verifier-on-fable",
    preferSeed: true,
    verifierOnFable: true,
    cue: "inherited",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      routed: false,
      inherited: false,
      childrenRouted: false,
      costGate: false,
      costGateMissing: false,
      policyReaches: false,
      modelAbsent: false,
      modelSet: false,
      parentFable: false,
      selfInvoke: false,
      finderOnFable: false,
      verifierOnFable: false,
      forkPolicyBlind: false,
      skillPromptWins: false,
      agents: null,
      childCount: null,
      cacheCreate: null,
      cacheRead: null,
      report: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    routed: raw.routed === true,
    inherited: raw.inherited === true,
    childrenRouted: raw.childrenRouted === true,
    costGate: raw.costGate === true,
    costGateMissing: raw.costGateMissing === true,
    policyReaches: raw.policyReaches === true,
    modelAbsent: raw.modelAbsent === true,
    modelSet: raw.modelSet === true,
    parentFable: raw.parentFable === true,
    selfInvoke: raw.selfInvoke === true,
    finderOnFable: raw.finderOnFable === true,
    verifierOnFable: raw.verifierOnFable === true,
    forkPolicyBlind: raw.forkPolicyBlind === true,
    skillPromptWins: raw.skillPromptWins === true,
    agents: raw.agents == null ? null : raw.agents,
    childCount: raw.childCount == null ? null : raw.childCount,
    cacheCreate: raw.cacheCreate == null ? null : raw.cacheCreate,
    cacheRead: raw.cacheRead == null ? null : raw.cacheRead,
    report: raw.report == null ? null : raw.report,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.routed != null ||
        ticket.inherited != null ||
        ticket.childrenRouted != null ||
        ticket.costGate != null ||
        ticket.costGateMissing != null ||
        ticket.policyReaches != null ||
        ticket.modelAbsent != null ||
        ticket.parentFable != null ||
        ticket.selfInvoke != null ||
        ticket.finderOnFable != null ||
        ticket.verifierOnFable != null ||
        ticket.forkPolicyBlind != null ||
        ticket.agents != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isRouted(row) {
  if (row.inherited && row.cue !== "routed") return false;
  if (row.cue === "inherited" || row.cue === "appanage" || row.cue === "cascade") {
    return false;
  }
  if (row.modelAbsent && row.cue !== "routed") return false;
  if (
    row.routed === true &&
    row.inherited !== true &&
    row.cue !== "inherited"
  ) {
    return true;
  }
  if (
    row.cue === "routed" &&
    row.inherited !== true &&
    row.modelAbsent !== true
  ) {
    return true;
  }
  if (
    row.childrenRouted === true &&
    row.costGate === true &&
    row.policyReaches === true &&
    row.inherited !== true &&
    row.modelAbsent !== true
  ) {
    return true;
  }
  return false;
}

function isInherited(row) {
  if (isRouted(row)) return false;
  if (row.cue === "inherited" || row.cue === "appanage") return true;
  if (row.inherited === true) return true;
  if (
    row.modelAbsent === true &&
    (row.parentFable || row.selfInvoke || row.forkPolicyBlind)
  ) {
    return true;
  }
  if (row.finderOnFable && row.verifierOnFable) return true;
  if (row.agents === AGENT_COUNT && row.modelAbsent) return true;
  return false;
}

function isCascadePath(row) {
  return (
    row.event === "cascade" &&
    !isRouted(row) &&
    (row.inherited === true || row.modelAbsent === true)
  );
}

/**
 * Score one grant pass against the appanage booth.
 * routed: children carry an explicit cheaper model; cost gate shown; policy reaches.
 * inherited: Agent calls omit model; parent fable cascade; no report.
 * cascade: named path — cost/model inheritance from crown to cadets.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCascadePath(row) ||
    (row.inherited && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "cascade";
  } else if (isInherited(row)) {
    verdict = "inherited";
  } else if (isRouted(row)) {
    verdict = "routed";
  } else if (
    row.inherited ||
    row.modelAbsent ||
    row.parentFable ||
    row.selfInvoke ||
    row.finderOnFable ||
    row.verifierOnFable ||
    row.forkPolicyBlind ||
    row.costGateMissing
  ) {
    verdict = "inherited";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const span = inspectGrant(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    routed: verdict === "routed" || verdict === "hold",
    inherited:
      verdict === "inherited" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    cascade:
      verdict === "cascade" ||
      verdict === PATH_WORD ||
      (span.inherited && row.event === "cascade"),
    childrenRouted: row.childrenRouted,
    costGate: row.costGate,
    costGateMissing: row.costGateMissing,
    policyReaches: row.policyReaches,
    modelAbsent: row.modelAbsent,
    modelSet: row.modelSet,
    parentFable: row.parentFable,
    selfInvoke: row.selfInvoke,
    finderOnFable: row.finderOnFable,
    verifierOnFable: row.verifierOnFable,
    forkPolicyBlind: row.forkPolicyBlind,
    skillPromptWins: row.skillPromptWins,
    agents: row.agents,
    childCount: row.childCount,
    cacheCreate: row.cacheCreate,
    cacheRead: row.cacheRead,
    report: row.report,
    cue: hold ? "routed" : "inherited",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit routed" : "score appanage",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : APPANAGE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const inherited = scored.filter((row) => row.verdict === "inherited");
  const path = scored.filter((row) => row.verdict === "cascade");
  const routed = scored.filter((row) => row.verdict === "routed");
  const headline =
    scored.find((row) => row.event === "inherited") ||
    scored.find((row) => row.event === "model-absent") ||
    scored.find((row) => row.event === "cascade") ||
    inherited[inherited.length - 1];
  let verdict = "routed";
  if (inherited.length) verdict = "inherited";
  else if (path.length && !routed.length) verdict = "cascade";
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
    inheritedCount: inherited.length,
    pathCount: path.length,
    routedCount: routed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit routed" : "score appanage",
    note: headline
      ? "Model-initiated code-review fork; Agent calls omit model; 10 fable agents; huge cache tokens; no report; policy cannot reach children."
      : "published appanage walk scored against routed vs inherited",
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
    seeded !== "routed" &&
    seeded !== "inherited" &&
    seeded !== "cascade" &&
    seeded !== "appanage" &&
    ticket.routed == null &&
    ticket.inherited == null &&
    ticket.modelAbsent == null &&
    ticket.childrenRouted == null &&
    ticket.parentFable == null &&
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
    backups: BACKUPS.map((row) => row.issue),
    routed: scored.routed ?? false,
    inherited: scored.inherited ?? false,
    modelAbsent: scored.modelAbsent ?? false,
    costGate: scored.costGate ?? false,
    policyReaches: scored.policyReaches ?? false,
    parentFable: scored.parentFable ?? false,
    selfInvoke: scored.selfInvoke ?? false,
    finderOnFable: scored.finderOnFable ?? false,
    verifierOnFable: scored.verifierOnFable ?? false,
    forkPolicyBlind: scored.forkPolicyBlind ?? false,
    agents: scored.agents ?? null,
    cacheCreate: scored.cacheCreate ?? null,
    cacheRead: scored.cacheRead ?? null,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.modelAbsent ? "model=absent" : "model=set",
    result.costGate ? "gate=shown" : "gate=missing",
    result.policyReaches ? "policy=reaches" : "policy=blind",
    result.parentFable ? "parent=fable" : "parent=other",
    result.cue === "routed" ? "cue=routed" : "cue=inherited",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const grant = readGrant({
    routed: result.routed,
    inherited: result.inherited,
    childrenRouted: result.childrenRouted,
    costGate: result.costGate,
    costGateMissing: result.costGateMissing,
    policyReaches: result.policyReaches,
    modelAbsent: result.modelAbsent,
    parentFable: result.parentFable,
    selfInvoke: result.selfInvoke,
    finderOnFable: result.finderOnFable,
    verifierOnFable: result.verifierOnFable,
    forkPolicyBlind: result.forkPolicyBlind,
    agents: result.agents,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    grant,
    span: inspectGrant({
      childrenRouted: result.childrenRouted,
      costGate: result.costGate,
      policyReaches: result.policyReaches,
      inherited: result.inherited,
      modelAbsent: result.modelAbsent,
      parentFable: result.parentFable,
      selfInvoke: result.selfInvoke,
      finderOnFable: result.finderOnFable,
      agents: result.agents,
    }),
    cadency: readCadency({
      finderOnFable: result.finderOnFable,
      verifierOnFable: result.verifierOnFable,
      parentFable: result.parentFable,
      agents: result.agents,
      inherited: result.inherited,
      childrenRouted: result.childrenRouted,
      costGate: result.costGate,
      policyReaches: result.policyReaches,
    }),
    seal: readSeal({
      costGate: result.costGate,
      costGateMissing: result.costGateMissing,
      selfInvoke: result.selfInvoke,
    }),
    stations: GRANT_STATIONS.map((row) => ({
      ...row,
      inherited: result.inherited === true || result.verdict === "inherited",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeVersion: CLAUDE_VERSION,
      os: OS,
      parentModel: PARENT_MODEL,
      parentModelSetting: PARENT_MODEL_SETTING,
      skill: SKILL,
      skillArgs: SKILL_ARGS,
      userPrompt: USER_PROMPT,
      forkCount: FORK_COUNT,
      childCount: CHILD_COUNT,
      agentCount: AGENT_COUNT,
      finderAngles: FINDER_ANGLES,
      verifierCount: VERIFIER_COUNT,
      subagentType: SUBAGENT_TYPE,
      cacheCreate: CACHE_CREATE,
      cacheRead: CACHE_READ,
      outputTokens: OUTPUT_TOKENS,
      window: WINDOW,
      costBand: COST_BAND,
      effort: EFFORT,
      defaultMode: DEFAULT_MODE,
      handRoutedCacheCreate: HAND_ROUTED_CACHE_CREATE,
      handRoutedCacheRead: HAND_ROUTED_CACHE_READ,
      handRoutedOutput: HAND_ROUTED_OUTPUT,
      handRoutedModels: [...HAND_ROUTED_MODELS],
      stations: GRANT_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "finder and verifier agents spawned by bundled skills should carry an explicit model, defaulting to a lower tier than the parent",
        "a model-initiated invocation of a skill that forks and fans out should require user confirmation, or at least print the documented cost band",
        "a hook point should let a user block sub-agent dispatch on a named model tier, and it should apply inside forks",
        "the per-skill disable switch should be documented",
      ],
      hypothesis:
        "NON-BINDING: unset model on Agent calls defaults to the parent tier; the Skill tool has no model param; a fork inherits the conversation but the skill prompt wins over policy. Verify against #93307 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
