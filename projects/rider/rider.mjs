#!/usr/bin/env node
/**
 * Rider — parliamentary clerk desk / bill-rider booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A planning directive is appended to essentially every tool result as a
 * type=attachment entry. It is not in any user configuration. It caused
 * planning narration before nearly every tool call. The user corrected
 * five times; the behavior regenerated because the instruction was
 * re-injected on the next tool call. Evidence from one transcript:
 * 195 type=attachment injections, 138 assistant reproductions, 5 user
 * corrections; first injection at the session's first tool call.
 * Ruled out: ~/.claude/CLAUDE.md, UserPromptSubmit/PostToolUse hooks
 * (timestamp only), settings.json, output-styles, project configs.
 * No documented opt-out. Silently outranks explicit user instruction.
 * Also teaches the wrong trust boundary (genuine instruction in the
 * tool-result channel).
 *
 *   node rider.mjs data/ridden.json
 *   echo '{"seed":"ridden"}' | node rider.mjs
 *
 * Idle word is plain (HOLD: tool results carry only their payload;
 * user instruction prevails; no rider).
 * Seeded word is ridden (#93683 — attachment rider re-injected every
 * tool result).
 * Path word is attachment-rider.
 * Product score word is rider (Score rider or admit plain.).
 *
 * Encoded from anthropics/claude-code#93683 issue text only.
 * Hypothesis (NON-BINDING): harness may be appending a planning
 * directive as type=attachment on tool results outside user-configurable
 * surfaces, so user corrections cannot stick. Verify against #93683
 * text only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits. No live
 * Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "plain",
  "ridden",
  "rider",
  "attachment-rider",
  "hold",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "plain";
export const PATH_WORD = "attachment-rider";
export const SEEDED_WORD = "ridden";
export const PRODUCT_WORD = "rider";
export const HOLD = Object.freeze(["plain", "hold"]);
export const RECOVER = Object.freeze(["plain", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "ridden" && name !== "rider"),
);

export const FEATURED_ISSUE = 93683;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93683";
export const TITLE =
  "Instruction injected into every tool result overrides explicit user instruction and has no opt-out";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const PLATFORM = "macos";
export const CODE_VERSION = "2.1.268";
export const OS_NAME = "macOS darwin 25.6.0";
export const MODEL_NAME = "Opus 4.5 (1M)";
export const INJECTION_COUNT = 195;
export const REPRODUCTION_COUNT = 138;
export const CORRECTION_COUNT = 5;
export const ATTACHMENT_TYPE = "attachment";
export const DIRECTIVE =
  "First privately list what you need next; then request every item that doesn't depend on another's result in this one response.";
export const NARRATION_PREFIX = "Privately, what I need next:";
export const PHRASE = "Score rider or admit plain.";
export const DISTRIBUTION =
  "Claude Code 2.1.268 · macOS darwin 25.6.0 · Model Opus 4.5 (1M). A directive is appended to essentially every tool result as a type=attachment entry. It is not in any user configuration. Planning narration (\"Privately, what I need next: 1. …\") appeared before nearly every tool call across days/sessions/repos. User corrected five times; behavior regenerated each time because the instruction was re-injected on the next tool call. One transcript: 195 type=attachment injections, 138 assistant reproductions, 5 user corrections; first injection at the session's first tool call. Ruled out: ~/.claude/CLAUDE.md, UserPromptSubmit/PostToolUse hooks (timestamp only), settings.json, output-styles, project configs. No documented opt-out. Silently outranks explicit user instruction. Teaches the wrong trust boundary (genuine instruction in the tool-result channel).";
export const SESSION_KIND =
  "macOS Claude Code 2.1.268 session. First tool call of the session already carries a type=attachment rider. Subsequent tool results re-staple the same planning directive. Five explicit user corrections do not stick. Transcript tally: 195 injections / 138 reproductions / 5 corrections.";
export const RULED_OUT = Object.freeze([
  "~/.claude/CLAUDE.md",
  "UserPromptSubmit hook (timestamp only)",
  "PostToolUse hook (timestamp only)",
  "settings.json",
  "output-styles",
  "project configs",
]);
export const EXPECTED = Object.freeze([
  "user-configurable / settings or CLAUDE.md override",
  "OR delivered via a system channel not tool output",
  "OR explicit user instruction takes precedence",
]);

export const DOCKET_PLAQUES = Object.freeze([
  { id: "injections", label: "injections", count: 195, note: "type=attachment" },
  { id: "reproductions", label: "reproductions", count: 138, note: "assistant replay" },
  { id: "corrections", label: "corrections", count: 5, note: "user did not stick" },
  { id: "first-call", label: "first tool call", count: 1, note: "already ridden" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "blotter",
    survey: "read the clerk blotter (a tool result should carry only its payload)",
    kind: "blotter",
    note: "seeded: blotter is ridden — type=attachment rider rides past the payload",
  },
  {
    id: "house-order",
    survey: "read the house instruction (explicit user instruction should prevail)",
    kind: "house-order",
    note: "seeded: house instruction is outranked — five corrections do not stick",
  },
  {
    id: "staple",
    survey: "check the staple (no rider clause should be clipped onto the docket)",
    kind: "staple",
    note: "seeded: staple is on — planning directive clipped as type=attachment",
  },
  {
    id: "wax-well",
    survey: "check the wax well (there should be a documented kill switch)",
    kind: "wax-well",
    note: "seeded: wax well empty — no documented opt-out",
  },
  {
    id: "channel",
    survey: "read the trust channel (instruction belongs on a system channel, not tool output)",
    kind: "channel",
    note: "seeded: genuine instruction arrives in the tool-result channel",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "attachment-rider",
  "ridden",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84070,
    title: "injected system prompt lines override user CLAUDE.md/memory",
    state: "CLOSED",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — related class; different injection surface (system prompt vs tool-result attachment). Do not rebuild",
  },
  {
    issue: 64539,
    title: "harness-injected control text and tool-result content share one untagged channel",
    state: "CLOSED",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — related class; shared untagged channel. Do not rebuild",
  },
  {
    issue: 93673,
    title: "/btw appends \"Never consult the advisor tool.\" to the user message",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93673 /btw appends Never consult the advisor tool. to the user message (different path). Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
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
    issue: 93722,
    title: "worktree connector disable-list (umbilical-candidate)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export const SAMPLE_BLOTTER = Object.freeze({
  payloadOnly: false,
  ridden: true,
});

export const SAMPLE_PLAIN_BLOTTER = Object.freeze({
  payloadOnly: true,
  ridden: false,
});

export const SAMPLE_HOUSE_ORDER = Object.freeze({
  prevails: false,
  outranked: true,
  corrections: 5,
});

export const SAMPLE_PLAIN_HOUSE_ORDER = Object.freeze({
  prevails: true,
  outranked: false,
  corrections: 0,
});

export const SAMPLE_STAPLE = Object.freeze({
  on: true,
  attachmentType: "attachment",
});

export const SAMPLE_PLAIN_STAPLE = Object.freeze({
  on: false,
  attachmentType: null,
});

export const SAMPLE_WAX = Object.freeze({
  optOut: false,
  empty: true,
});

export const SAMPLE_PLAIN_WAX = Object.freeze({
  optOut: true,
  empty: false,
});

export const SAMPLE_CHANNEL = Object.freeze({
  toolResult: true,
  systemChannel: false,
});

export const SAMPLE_PLAIN_CHANNEL = Object.freeze({
  toolResult: false,
  systemChannel: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "tool results carry only their payload; user instruction prevails; no rider" },
  { t: "payload", line: "clerk blotter shows the tool payload alone" },
  { t: "first", line: "session's first tool call already carries a type=attachment rider" },
  { t: "staple", line: "planning directive clipped onto the docket: First privately list what you need next…" },
  { t: "narrate", line: "assistant reproduces: Privately, what I need next: 1. …" },
  { t: "correct", line: "user corrects — five times across the session" },
  { t: "reinject", line: "next tool result re-staples the same rider; correction does not stick" },
  { t: "tally", line: "195 type=attachment injections · 138 assistant reproductions · 5 corrections" },
  { t: "opt", line: "no documented kill switch in settings, CLAUDE.md, hooks, or output-styles" },
  { t: "channel", line: "genuine instruction arrives in the tool-result channel — wrong trust boundary" },
  { t: "path", line: "attachment-rider — rider clause rides past the user's instruction with no opt-out" },
  { t: "score", line: "when the rider is stapled onto every tool result the booth is a rider — Score rider or admit plain." },
]);

export function inspectBlotter(input = {}) {
  const blotter =
    input.blotter && typeof input.blotter === "object"
      ? input.blotter
      : input.plain === true && input.ridden !== true
        ? SAMPLE_PLAIN_BLOTTER
        : SAMPLE_BLOTTER;
  const forcedRidden =
    input.ridden === true ||
    input.staple === true ||
    input.event === "ridden" ||
    input.event === "rider" ||
    input.event === "staple" ||
    input.attachmentRider === true;
  const ridden = forcedRidden ? true : blotter.ridden === true && input.plain !== true;
  return {
    payloadOnly: !ridden,
    ridden,
    stamp: ridden ? "ridden" : "payload",
    note: ridden
      ? "clerk blotter is ridden — type=attachment rider rides past the payload"
      : "clerk blotter shows the tool payload alone",
  };
}

export function inspectHouseOrder(input = {}) {
  const order =
    input.houseOrder && typeof input.houseOrder === "object"
      ? input.houseOrder
      : input.plain === true && input.ridden !== true
        ? SAMPLE_PLAIN_HOUSE_ORDER
        : SAMPLE_HOUSE_ORDER;
  const forcedOutranked =
    input.correction === true ||
    input.event === "correction" ||
    input.attachmentRider === true ||
    (input.ridden === true && input.plain !== true);
  const outranked = forcedOutranked ? true : order.outranked === true;
  return {
    prevails: !outranked,
    outranked,
    corrections: outranked ? order.corrections || CORRECTION_COUNT : 0,
    stamp: outranked ? "outranked" : "prevails",
    note: outranked
      ? "house instruction outranked — five corrections do not stick"
      : "house instruction prevails — tool results do not override the user",
  };
}

export function inspectStaple(input = {}) {
  const staple =
    input.stapleClip && typeof input.stapleClip === "object"
      ? input.stapleClip
      : input.plain === true && input.ridden !== true
        ? SAMPLE_PLAIN_STAPLE
        : SAMPLE_STAPLE;
  const forcedOn =
    input.injection === true ||
    input.event === "injection" ||
    input.staple === true ||
    input.event === "staple" ||
    (input.ridden === true && input.plain !== true);
  const on = forcedOn ? true : staple.on === true;
  return {
    on,
    attachmentType: on ? ATTACHMENT_TYPE : null,
    stamp: on ? "on" : "off",
    note: on
      ? "staple is on — planning directive clipped as type=attachment"
      : "staple is off — no rider clause on the docket",
  };
}

export function inspectWaxWell(input = {}) {
  const wax =
    input.waxWell && typeof input.waxWell === "object"
      ? input.waxWell
      : input.plain === true && input.ridden !== true
        ? SAMPLE_PLAIN_WAX
        : SAMPLE_WAX;
  const forcedEmpty =
    input.noOptOut === true ||
    input.event === "no-opt-out" ||
    input.attachmentRider === true ||
    (input.ridden === true && input.plain !== true);
  const empty = forcedEmpty ? true : wax.empty === true;
  return {
    optOut: !empty,
    empty,
    stamp: empty ? "absent" : "present",
    note: empty
      ? "wax well empty — no documented opt-out"
      : "wax well present — settings or CLAUDE.md can refuse the rider",
  };
}

export function inspectChannel(input = {}) {
  const channel =
    input.channel && typeof input.channel === "object"
      ? input.channel
      : input.plain === true && input.ridden !== true
        ? SAMPLE_PLAIN_CHANNEL
        : SAMPLE_CHANNEL;
  const forcedTool =
    input.trustBoundary === true ||
    input.event === "trust-boundary" ||
    input.event === "attachment-rider" ||
    input.attachmentRider === true ||
    (input.ridden === true && input.plain !== true);
  const toolResult = forcedTool ? true : channel.toolResult === true;
  return {
    toolResult,
    systemChannel: !toolResult,
    stamp: toolResult ? "tool-result" : "system",
    note: toolResult
      ? "genuine instruction arrives in the tool-result channel — wrong trust boundary"
      : "instruction stays on a system channel, not tool output",
  };
}

export function readBooth(input = {}) {
  const blotter = inspectBlotter(input);
  const houseOrder = inspectHouseOrder(input);
  const staple = inspectStaple(input);
  const waxWell = inspectWaxWell(input);
  const channel = inspectChannel(input);
  const ridden =
    input.plain !== true &&
    ((blotter.ridden && staple.on) ||
      (houseOrder.outranked && waxWell.empty) ||
      input.ridden === true);
  const plain = input.plain === true && ridden !== true && !blotter.ridden;
  const path =
    staple.on &&
    (input.event === "attachment-rider" || input.attachmentRider === true);
  return {
    blotter,
    houseOrder,
    staple,
    waxWell,
    channel,
    plaques: DOCKET_PLAQUES,
    stations: BOOTH_STATIONS,
    ridden: ridden && !plain && !path,
    plain:
      plain ||
      (!blotter.ridden &&
        !houseOrder.outranked &&
        input.ridden !== true &&
        input.attachmentRider !== true),
    attachmentRider: path && !plain,
    mark:
      path && !plain
        ? "attachment-rider"
        : ridden && !plain
          ? "ridden"
          : "plain",
  };
}

/**
 * Published rider walk from #93683 only. Facts from the issue text.
 * A plain booth keeps tool results payload-only; user instruction prevails.
 * A ridden booth re-staples a planning directive on every tool result.
 * An attachment-rider booth names the tool-result attachment as the path.
 */
export const RIDER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-plain",
    plain: true,
    ridden: false,
    cue: "plain",
    note: "idle HOLD: tool results carry only their payload; user instruction prevails; no rider",
  },
  {
    t: "payload",
    event: "payload-only",
    plain: true,
    payloadOnly: true,
    cue: "plain",
    note: "clerk blotter shows the tool payload alone",
  },
  {
    t: "first",
    event: "injection",
    ridden: true,
    injection: true,
    cue: "ridden",
    note: "session's first tool call already carries a type=attachment rider",
  },
  {
    t: "staple",
    event: "staple",
    ridden: true,
    staple: true,
    cue: "ridden",
    note: "planning directive clipped onto the docket",
  },
  {
    t: "narrate",
    event: "planning-narration",
    ridden: true,
    planningNarration: true,
    cue: "ridden",
    note: "assistant reproduces: Privately, what I need next: 1. …",
  },
  {
    t: "correct",
    event: "correction",
    ridden: true,
    correction: true,
    cue: "ridden",
    note: "user corrects — five times; behavior regenerates on the next tool call",
  },
  {
    t: "tally",
    event: "injection",
    ridden: true,
    injection: true,
    cue: "ridden",
    note: "195 type=attachment injections · 138 assistant reproductions · 5 corrections",
  },
  {
    t: "opt",
    event: "no-opt-out",
    ridden: true,
    noOptOut: true,
    cue: "ridden",
    note: "no documented kill switch in settings, CLAUDE.md, hooks, or output-styles",
  },
  {
    t: "channel",
    event: "trust-boundary",
    ridden: true,
    trustBoundary: true,
    cue: "ridden",
    note: "genuine instruction arrives in the tool-result channel",
  },
  {
    t: "path",
    event: "attachment-rider",
    ridden: true,
    attachmentRider: true,
    staple: true,
    injection: true,
    cue: "ridden",
    note: "attachment-rider — rider clause rides past the user's instruction with no opt-out",
  },
  {
    t: "score",
    event: "rider",
    ridden: true,
    staple: true,
    injection: true,
    correction: true,
    noOptOut: true,
    planningNarration: true,
    trustBoundary: true,
    attachmentRider: true,
    cue: "ridden",
    note: "rider — when the rider is stapled onto every tool result the booth never stays plain",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "payload-only",
    plain: true,
    payloadOnly: true,
    cue: "plain",
    note: "positive control: tool results carry only their payload",
  },
  {
    t: "order",
    event: "cue-plain",
    plain: true,
    cue: "plain",
    note: "positive control: explicit user instruction prevails; no attachment rider",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    plain: true,
    ridden: false,
    payloadOnly: true,
    cue: "plain",
  };
}

export function seedPlain() {
  return { ...emptyTicket() };
}

export function seedRidden() {
  return {
    seed: SEEDED_WORD,
    plain: false,
    ridden: true,
    staple: true,
    injection: true,
    correction: true,
    noOptOut: true,
    planningNarration: true,
    trustBoundary: true,
    attachmentRider: true,
    cue: "ridden",
    issue: FEATURED_ISSUE,
    blotter: SAMPLE_BLOTTER,
    houseOrder: SAMPLE_HOUSE_ORDER,
    stapleClip: SAMPLE_STAPLE,
    waxWell: SAMPLE_WAX,
    channel: SAMPLE_CHANNEL,
  };
}

export function seedRider() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    ridden: true,
    staple: true,
    injection: true,
    correction: true,
    noOptOut: true,
    planningNarration: true,
    trustBoundary: true,
    attachmentRider: true,
    cue: "ridden",
  };
}

export function seedAttachmentRider() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    ridden: true,
    attachmentRider: true,
    staple: true,
    injection: true,
    event: "attachment-rider",
    cue: "ridden",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    plain: true,
    cue: "plain",
  };
}

export function seedStaple() {
  return {
    seed: "staple",
    preferSeed: true,
    staple: true,
    cue: "ridden",
  };
}

export function seedInjection() {
  return {
    seed: "injection",
    preferSeed: true,
    injection: true,
    cue: "ridden",
  };
}

export function seedCorrection() {
  return {
    seed: "correction",
    preferSeed: true,
    correction: true,
    cue: "ridden",
  };
}

export function seedNoOptOut() {
  return {
    seed: "no-opt-out",
    preferSeed: true,
    noOptOut: true,
    cue: "ridden",
  };
}

export function seedPlanningNarration() {
  return {
    seed: "planning-narration",
    preferSeed: true,
    planningNarration: true,
    cue: "ridden",
  };
}

export function seedTrustBoundary() {
  return {
    seed: "trust-boundary",
    preferSeed: true,
    trustBoundary: true,
    cue: "ridden",
  };
}

export function seedPayloadOnly() {
  return {
    seed: "payload-only",
    preferSeed: true,
    payloadOnly: true,
    cue: "plain",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      plain: false,
      ridden: false,
      attachmentRider: false,
      staple: false,
      injection: false,
      correction: false,
      noOptOut: false,
      planningNarration: false,
      trustBoundary: false,
      payloadOnly: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    plain: raw.plain === true,
    ridden:
      raw.ridden === true ||
      raw.event === "ridden" ||
      raw.event === "rider",
    attachmentRider:
      raw.attachmentRider === true || raw.event === "attachment-rider",
    staple: raw.staple === true || raw.event === "staple",
    injection: raw.injection === true || raw.event === "injection",
    correction: raw.correction === true || raw.event === "correction",
    noOptOut: raw.noOptOut === true || raw.event === "no-opt-out",
    planningNarration:
      raw.planningNarration === true || raw.event === "planning-narration",
    trustBoundary:
      raw.trustBoundary === true || raw.event === "trust-boundary",
    payloadOnly:
      raw.payloadOnly === true || raw.event === "payload-only",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    blotter: raw.blotter,
    houseOrder: raw.houseOrder,
    stapleClip: raw.stapleClip,
    waxWell: raw.waxWell,
    channel: raw.channel,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.plain != null ||
        ticket.ridden != null ||
        ticket.attachmentRider != null ||
        ticket.staple != null ||
        ticket.injection != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.blotter ||
        ticket.houseOrder ||
        ticket.stapleClip),
  );
}

function isPlain(row) {
  if (row.ridden && row.cue !== "plain") return false;
  if (
    row.cue === "ridden" ||
    row.cue === "rider" ||
    row.cue === "attachment-rider"
  ) {
    return false;
  }
  if (
    row.staple &&
    row.injection &&
    row.cue !== "plain" &&
    row.plain !== true
  ) {
    return false;
  }
  if (
    row.attachmentRider &&
    row.staple &&
    row.cue !== "plain" &&
    row.plain !== true
  ) {
    return false;
  }
  if (row.plain === true && row.ridden !== true && row.cue !== "ridden") {
    return true;
  }
  if (
    row.cue === "plain" &&
    row.ridden !== true &&
    row.staple !== true &&
    row.attachmentRider !== true
  ) {
    return true;
  }
  if (
    row.payloadOnly === true &&
    row.ridden !== true &&
    row.staple !== true &&
    row.injection !== true &&
    row.attachmentRider !== true
  ) {
    return true;
  }
  return false;
}

function isAttachmentRiderPath(row) {
  return (
    row.event === "attachment-rider" &&
    !isPlain(row) &&
    (row.attachmentRider === true ||
      row.staple === true ||
      row.injection === true)
  );
}

function isRidden(row) {
  if (isPlain(row)) return false;
  if (isAttachmentRiderPath(row) && row.cue !== "ridden") return false;
  if (row.cue === "ridden" || row.cue === "rider") return true;
  if (row.ridden === true) return true;
  if (
    row.staple === true &&
    row.injection === true &&
    row.noOptOut === true
  ) {
    return true;
  }
  if (row.staple === true && row.injection === true) {
    return true;
  }
  if (
    row.staple === true ||
    row.injection === true ||
    row.correction === true ||
    row.planningNarration === true ||
    row.noOptOut === true ||
    (row.attachmentRider === true && row.trustBoundary === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one rider pass against the clerk desk.
 * plain: tool results carry only their payload; user instruction prevails; no rider.
 * ridden / rider: attachment rider re-injected every tool result.
 * attachment-rider: rider clause rides past the user's instruction with no opt-out.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isAttachmentRiderPath(row) ||
    (row.attachmentRider && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "attachment-rider";
  } else if (isRidden(row)) {
    verdict = "rider";
  } else if (isPlain(row)) {
    verdict = "plain";
  } else if (
    row.staple ||
    row.injection ||
    row.correction ||
    (row.attachmentRider && !row.payloadOnly)
  ) {
    verdict = "rider";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const blotter = inspectBlotter(row);
  const houseOrder = inspectHouseOrder(row);
  const staple = inspectStaple(row);
  const waxWell = inspectWaxWell(row);
  const channel = inspectChannel(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    plain: verdict === "plain" || verdict === "hold",
    ridden:
      verdict === "ridden" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    attachmentRider:
      row.attachmentRider === true ||
      verdict === "attachment-rider" ||
      verdict === PATH_WORD,
    staple: row.staple,
    injection: row.injection,
    correction: row.correction,
    noOptOut: row.noOptOut,
    planningNarration: row.planningNarration,
    trustBoundary: row.trustBoundary,
    payloadOnly: row.payloadOnly,
    cue: hold
      ? "plain"
      : row.attachmentRider || verdict === "attachment-rider"
        ? "attachment-rider"
        : "ridden",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit plain" : "score rider",
    blotterInspect: blotter,
    houseOrderInspect: houseOrder,
    stapleInspect: staple,
    waxInspect: waxWell,
    channelInspect: channel,
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
      : RIDER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const ridden = scored.filter(
    (row) => row.verdict === "rider" || row.verdict === "ridden",
  );
  const path = scored.filter((row) => row.verdict === "attachment-rider");
  const plain = scored.filter((row) => row.verdict === "plain");
  const headline =
    scored.find((row) => row.event === "ridden") ||
    scored.find((row) => row.event === "attachment-rider") ||
    scored.find((row) => row.event === "staple") ||
    ridden[ridden.length - 1];
  let verdict = "plain";
  if (ridden.length) verdict = "rider";
  else if (path.length && !plain.length) verdict = "attachment-rider";
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
    riddenCount: ridden.length,
    pathCount: path.length,
    plainCount: plain.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit plain" : "score rider",
    note: headline
      ? "type=attachment rider on every tool result; 195 injections / 138 reproductions / 5 corrections; no opt-out; user instruction outranked."
      : "published rider walk scored against plain vs ridden",
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
    seeded !== "plain" &&
    seeded !== "ridden" &&
    seeded !== "attachment-rider" &&
    seeded !== "rider" &&
    ticket.plain == null &&
    ticket.ridden == null &&
    ticket.staple == null &&
    ticket.attachmentRider == null &&
    ticket.injection == null &&
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
    plain: scored.plain ?? false,
    ridden: scored.ridden ?? false,
    attachmentRider: scored.attachmentRider ?? false,
    staple: scored.staple ?? false,
    injection: scored.injection ?? false,
    correction: scored.correction ?? false,
    noOptOut: scored.noOptOut ?? false,
    planningNarration: scored.planningNarration ?? false,
    trustBoundary: scored.trustBoundary ?? false,
    payloadOnly: scored.payloadOnly ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.plain && !result.ridden ? "blotter=payload" : "blotter=ridden",
    result.correction || result.ridden ? "order=outranked" : "order=prevails",
    result.staple || result.ridden ? "staple=on" : "staple=off",
    result.noOptOut || result.ridden ? "wax=absent" : "wax=present",
    result.trustBoundary || result.ridden
      ? "channel=tool-result"
      : "channel=system",
    result.attachmentRider || result.verdict === "attachment-rider"
      ? "path=attachment-rider"
      : "path=plain",
    result.cue === "plain"
      ? "cue=plain"
      : result.cue === "attachment-rider"
        ? "cue=attachment-rider"
        : "cue=ridden",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    plain: result.plain,
    ridden: result.ridden,
    attachmentRider: result.attachmentRider,
    staple: result.staple,
    injection: result.injection,
    correction: result.correction,
    noOptOut: result.noOptOut,
    planningNarration: result.planningNarration,
    trustBoundary: result.trustBoundary,
    payloadOnly: result.payloadOnly,
    blotter: input && input.blotter,
    houseOrder: input && input.houseOrder,
    stapleClip: input && input.stapleClip,
    waxWell: input && input.waxWell,
    channel: input && input.channel,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    blotter: inspectBlotter({
      plain: result.plain,
      ridden: result.ridden,
      staple: result.staple,
      attachmentRider: result.attachmentRider,
      blotter: input && input.blotter,
    }),
    houseOrder: inspectHouseOrder({
      plain: result.plain,
      ridden: result.ridden,
      correction: result.correction,
      attachmentRider: result.attachmentRider,
      houseOrder: input && input.houseOrder,
    }),
    stapleClip: inspectStaple({
      plain: result.plain,
      ridden: result.ridden,
      injection: result.injection,
      staple: result.staple,
      stapleClip: input && input.stapleClip,
    }),
    waxWell: inspectWaxWell({
      plain: result.plain,
      ridden: result.ridden,
      noOptOut: result.noOptOut,
      attachmentRider: result.attachmentRider,
      waxWell: input && input.waxWell,
    }),
    channel: inspectChannel({
      plain: result.plain,
      ridden: result.ridden,
      trustBoundary: result.trustBoundary,
      attachmentRider: result.attachmentRider,
      channel: input && input.channel,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      ridden:
        result.ridden === true ||
        result.verdict === "ridden" ||
        result.verdict === "rider",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      codeVersion: CODE_VERSION,
      osName: OS_NAME,
      modelName: MODEL_NAME,
      injectionCount: INJECTION_COUNT,
      reproductionCount: REPRODUCTION_COUNT,
      correctionCount: CORRECTION_COUNT,
      attachmentType: ATTACHMENT_TYPE,
      directive: DIRECTIVE,
      narrationPrefix: NARRATION_PREFIX,
      plaques: DOCKET_PLAQUES,
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
        "NON-BINDING: harness may be appending a planning directive as type=attachment on tool results outside user-configurable surfaces, so user corrections cannot stick. Verify against #93683 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
