#!/usr/bin/env node
/**
 * Sourdine — concert-hall practice-mute / brass-mute booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * MessageDisplay no longer fires for text between tool calls. Mid-turn
 * prose is replaced server-side by summarized thinking blocks tagged
 * block_kind: narration and shown with a "(summarized)" label. Only
 * the first message of a turn and the final answer still reach the hook.
 * Original prose is not stored. CLAUDE_CODE_ENABLE_NARRATION=0 does not
 * restore MessageDisplay for these blocks.
 *
 *   node sourdine.mjs data/muted.json
 *   echo '{"seed":"muted"}' | node sourdine.mjs
 *
 * Idle word is voiced (HOLD: MessageDisplay fires for opening text +
 * final answer as expected).
 * Seeded word is muted (#93531: narration/summarized mid-turn updates
 * never call MessageDisplay).
 * Path word is mid-narration (block_kind narration between tool calls).
 * Product score word is sourdine (score sourdine or admit voiced).
 *
 * Encoded from anthropics/claude-code#93531 issue text only.
 * Hypothesis (NON-BINDING): server-side narration replacement may
 * bypass the MessageDisplay hook pipeline while still rendering
 * summarized text in the UI. The env var appears to control the
 * spinner status line (querySource: "narration"), not this path.
 * Verify against #93531 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "hold",
  "first-fires",
  "mid-summarized",
  "hook-silent",
  "final-fires",
  "narration",
  "summarized",
  "block-kind",
  "tts-silent",
  "redaction-miss",
  "env-no-effect",
  "trivial-no-repro",
  "multi-step",
  "http-hook",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "voiced";
export const PATH_WORD = "mid-narration";
export const SEEDED_WORD = "muted";
export const PRODUCT_WORD = "sourdine";
export const HOLD = Object.freeze(["voiced", "hold"]);
export const RECOVER = Object.freeze(["voiced", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "lodged",
  "dropped",
  "forksink",
  "source-fork",
  "kindled",
  "painted",
  "foxfire",
  "never-turns",
  "flushed",
  "lagged",
  "one-behind",
  "pentimento",
  "solitary",
  "twinlinked",
  "bridge-refuse",
  "vinculum",
  "hit",
  "flattened",
  "string-carrier",
  "cachet",
  "steady",
  "strobing",
  "off-label",
  "strobe",
  "matched",
  "skewed",
  "headers-hash",
  "counterfoil",
  "traced",
  "pathless",
  "image-cache",
  "lucida",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "damped",
  "spinning",
  "mux",
  "snubber",
  "mounted",
  "fossed",
  "plan9",
  "fosse",
  "warm",
  "paged-out",
  "majflt",
  "hibernacle",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "sterling",
  "debased",
  "hallmark",
  "remanent",
  "collimated",
  "diopter",
  "hysteresis",
  "banked",
  "ephemera",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "slipped",
  "sprung",
  "springe",
  "afloat",
  "washed",
  "pontoon",
  "concordant",
  "concordat",
  "reaped",
  "revenant",
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
  "oubliette",
  "voided",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "defaulted",
  "literal",
  "stale",
  "phantom",
  "vernier",
  "slider",
  "latent",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
  "culled",
  "intact",
  "procrustes",
  "drained",
  "gated",
  "sump",
  "spillway",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "muted" && name !== "sourdine",
  ),
);

export const FEATURED_ISSUE = 93531;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93531";
export const TITLE =
  "[BUG] MessageDisplay no longer fires for text between tool calls (regression)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "platform:vscode",
  "area:hooks",
  "regression",
]);
export const AUTHOR = "Liv3wir3d";
export const FILED = "2026-09-11T03:51:12Z";
export const CLAUDE_CODE_VERSION = "2.1.267";
export const LAST_WORKING_VERSION = "2.1.266";
export const OS = "Windows";
export const CLIENT = "Claude Code VS Code extension";
export const SHELL = "VS Code integrated terminal";
export const MODEL = "Opus (claude-opus-5)";
export const PLATFORM = "Anthropic API";
export const SESSION_KIND =
  "VS Code extension; http MessageDisplay hook; multi-step turn with prose between tool calls";
export const FEEDBACK_ID = "043a59d5-4228-4590-a7cc-c6903546840f";
export const FIRST_BROKEN_AT = "2026-09-10 22:49 UTC";
export const HOOK_URL = "http://localhost:8765/hooks/message";
export const ENV_FLAG = "CLAUDE_CODE_ENABLE_NARRATION=0";
export const BLOCK_KIND = "narration";
export const DISPLAY_LABEL = "(summarized)";
export const FIRST_TEXT_AT = "03:14:03";
export const FIRST_TEXT =
  "I'll start by locating the folder…";
export const FINAL_TEXT_AT = "03:14:35";
export const NARRATION_ROWS = Object.freeze([
  {
    t: "03:14:08",
    displayed: "The invoice shows a $600.00 subtotal…",
    blockType: "narration",
    hookFired: false,
  },
  {
    t: "03:14:11",
    displayed: "The order has 4 SKUs…",
    blockType: "narration",
    hookFired: false,
  },
  {
    t: "03:14:16",
    displayed: "The subtotal only hits $600.00 if B200…",
    blockType: "narration",
    hookFired: false,
  },
  {
    t: "03:14:23",
    displayed: "I found two issues…",
    blockType: "narration",
    hookFired: false,
  },
]);
export const PHRASE =
  "when mid-turn prose is replaced by summarized narration that the hall still hears while MessageDisplay stays silent, score sourdine or admit voiced.";

export const HALL_STATIONS = Object.freeze([
  {
    id: "attack",
    survey: "seat the attack (first text of the turn)",
    kind: "attack",
    note: "seeded: opening text still fires MessageDisplay — the attack still speaks through the mute",
  },
  {
    id: "phrase",
    survey: "watch the mid-phrase (block_kind narration)",
    kind: "phrase",
    note: "seeded: (summarized) narration rows between tool calls never call MessageDisplay",
  },
  {
    id: "cadence",
    survey: "hear the cadence (final answer)",
    kind: "cadence",
    note: "seeded: final answer still fires MessageDisplay — the cadence still speaks",
  },
  {
    id: "mute",
    survey: "sound the sourdine (hook pipe vs hall)",
    kind: "mute",
    note: "seeded: audience hears summarized narration on stage; the hook pipe is muted",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mid-narration",
  "muted",
  "first-fires",
  "hook-silent",
  "final-fires",
  "block-kind",
  "tts-silent",
  "env-no-effect",
]);

export const COUSINS = Object.freeze([
  {
    issue: 88646,
    title:
      "MessageDisplay: two non-overlapping hooks sometimes both render, sometimes only one does",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — MessageDisplay dual-hook race; composition, not narration mute; do not rebuild",
  },
  {
    issue: 82001,
    title:
      "[FEATURE] UserInputChange hook — expose the prompt input buffer to hooks, mirroring MessageDisplay",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — input-side feature mirroring MessageDisplay; not a display-pipeline mute; do not rebuild",
  },
  {
    issue: 85773,
    title:
      "Interactive TUI drops MessageDisplay displayContent (honored in --print)",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed: TUI drops displayContent; hook fires but paint is dropped; do not rebuild",
  },
  {
    issue: 88338,
    title:
      "PostToolUse rewrite collisions are last-registered-wins, and a clobbered redaction is silent",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — PostToolUse rewrite collisions; different hook surface; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93475,
    title: "Effort selector needs a very tall terminal",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93439,
    title: "Binary Read skips PreToolUse",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93438,
    title: "Worktree cwd bleed",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93466,
    title: "Directory Plugins duplicate cards",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93495,
    title: "Desktop UNUserNotificationCenter deadlock",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93529,
    title:
      "Parked-permission retirement always stamps toolDenialKind: user-rejected",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93508,
    title: "Documents preview_start TCC getcwd deny",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "scapegoat",
  "cartulary",
  "paraph",
  "hallmark",
  "diopter",
  "hysteresis",
  "ephemera",
  "flashpan",
  "mirage",
  "glowplug",
  "deadlight",
  "ukase",
  "almanac",
  "stroboscope",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "graft",
  "springe",
  "afterimage",
  "diplopia",
  "espagnolette",
  "trompe",
  "shibboleth",
  "ward",
  "latchkey",
  "bitting",
  "escutcheon",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
  "procrustes",
  "sump",
  "spillway",
  "quietus",
  "rubric",
  "recension",
]);

export function inspectAttack(input = {}) {
  const fired =
    input.firstFired === true ||
    input.event === "first-fires" ||
    (input.voiced === true &&
      input.muted !== true &&
      input.hookSilent !== true);
  return {
    fired,
    stamp: fired ? "voiced" : "quiet",
    note: fired
      ? "attack still speaks — first text of the turn fires MessageDisplay"
      : "no opening MessageDisplay fire on this stand",
  };
}

export function inspectPhrase(input = {}) {
  const muted =
    input.hookSilent === true ||
    input.narrationShown === true ||
    input.blockKindNarration === true ||
    input.event === "mid-summarized" ||
    input.event === "hook-silent" ||
    input.event === "mid-narration" ||
    (input.muted === true && input.voiced !== true);
  return {
    muted,
    stamp: muted ? "muted" : "voiced",
    note: muted
      ? "mid-phrase is muted from the hook — (summarized) narration never calls MessageDisplay"
      : "mid-phrase still reaches MessageDisplay",
  };
}

export function inspectCadence(input = {}) {
  const fired =
    input.finalFired === true ||
    input.event === "final-fires" ||
    (input.voiced === true &&
      input.muted !== true &&
      input.hookSilent !== true);
  return {
    fired,
    stamp: fired ? "voiced" : "quiet",
    note: fired
      ? "cadence still speaks — final answer fires MessageDisplay"
      : "no final MessageDisplay fire on this stand",
  };
}

export function inspectHall(input = {}) {
  const heard =
    input.narrationShown === true ||
    input.event === "mid-summarized" ||
    input.blockKindNarration === true ||
    (input.muted === true && input.voiced !== true);
  return {
    heard,
    stamp: heard ? "on-stage" : "dark",
    note: heard
      ? "the hall still hears summarized narration on stage"
      : "no summarized narration painted for the audience",
  };
}

export function inspectMute(input = {}) {
  const engaged =
    input.hookSilent === true ||
    input.ttsSilent === true ||
    input.redactionMiss === true ||
    input.event === "hook-silent" ||
    (input.muted === true && input.voiced !== true);
  return {
    engaged,
    stamp: engaged ? "muted" : "open",
    note: engaged
      ? "sourdine is in — hook pipe silent while the hall still hears the phrase"
      : "mute is open — MessageDisplay hears the same phrase the hall hears",
  };
}

export function readHall(input = {}) {
  const attack = inspectAttack(input);
  const phrase = inspectPhrase(input);
  const cadence = inspectCadence(input);
  const hall = inspectHall(input);
  const mute = inspectMute(input);
  const muted =
    phrase.stamp === "muted" ||
    mute.stamp === "muted" ||
    input.muted === true;
  const voiced =
    input.voiced === true &&
    muted !== true &&
    phrase.stamp === "voiced" &&
    mute.stamp === "open";
  return {
    attack,
    phrase,
    cadence,
    hall,
    mute,
    stations: HALL_STATIONS,
    muted: muted && !voiced,
    voiced:
      voiced ||
      (attack.stamp === "voiced" &&
        cadence.stamp === "voiced" &&
        phrase.stamp === "voiced" &&
        mute.stamp === "open" &&
        input.muted !== true),
    mark: muted && !voiced ? "muted" : "voiced",
  };
}

/**
 * Published sourdine walk from #93531 only. Facts from the issue text.
 * A voiced booth fires MessageDisplay for opening text + final answer.
 * A muted booth shows (summarized) narration between tool calls and
 * never calls MessageDisplay for those updates.
 */
export const SOURDINE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-voiced",
    voiced: true,
    muted: false,
    firstFired: true,
    finalFired: true,
    hookSilent: false,
    narrationShown: false,
    cue: "voiced",
    note: "idle HOLD: MessageDisplay fires for opening text + final answer as expected",
  },
  {
    t: FIRST_TEXT_AT,
    event: "first-fires",
    voiced: true,
    firstFired: true,
    displayed: FIRST_TEXT,
    blockType: "text",
    hookFired: true,
    cue: "voiced",
    note: "03:14:03 first text fires MessageDisplay — I'll start by locating the folder…",
  },
  {
    t: "03:14:08",
    event: "mid-summarized",
    muted: true,
    narrationShown: true,
    blockKindNarration: true,
    midTurn: true,
    displayed: NARRATION_ROWS[0].displayed,
    blockType: "narration",
    hookFired: false,
    cue: "muted",
    note: "(summarized) The invoice shows a $600.00 subtotal… — narration, hook silent",
  },
  {
    t: "phrase",
    event: "hook-silent",
    muted: true,
    hookSilent: true,
    narrationShown: true,
    ttsSilent: true,
    redactionMiss: true,
    originalLost: true,
    cue: "muted",
    note: "several (summarized) narration rows with no hook; original prose is not stored",
  },
  {
    t: FINAL_TEXT_AT,
    event: "final-fires",
    voiced: true,
    finalFired: true,
    displayed: "Final answer",
    blockType: "text",
    hookFired: true,
    cue: "voiced",
    note: "03:14:35 final answer fires MessageDisplay",
  },
  {
    t: "path",
    event: "mid-narration",
    muted: true,
    blockKindNarration: true,
    midTurn: true,
    hookSilent: true,
    narrationShown: true,
    originalLost: true,
    cue: "muted",
    note: "mid-narration — block_kind: narration between tool calls; schema calls them server summaries, not the model's own reasoning",
  },
  {
    t: "score",
    event: "sourdine",
    muted: true,
    firstFired: true,
    finalFired: true,
    hookSilent: true,
    narrationShown: true,
    blockKindNarration: true,
    envNoEffect: true,
    ttsSilent: true,
    redactionMiss: true,
    cue: "muted",
    note: "sourdine — attack and cadence still speak through MessageDisplay; the mid-phrase is muted from hooks while the hall hears summarized narration",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "attack",
    event: "first-fires",
    voiced: true,
    firstFired: true,
    hookFired: true,
    cue: "voiced",
    note: "positive control: first message of a turn still reaches MessageDisplay",
  },
  {
    t: "cadence",
    event: "final-fires",
    voiced: true,
    finalFired: true,
    hookFired: true,
    cue: "voiced",
    note: "positive control: final answer still reaches MessageDisplay",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    voiced: true,
    muted: false,
    firstFired: true,
    finalFired: true,
    hookSilent: false,
    narrationShown: false,
    cue: "voiced",
  };
}

export function seedVoiced() {
  return { ...emptyTicket() };
}

export function seedMuted() {
  return {
    seed: SEEDED_WORD,
    voiced: false,
    muted: true,
    firstFired: true,
    finalFired: true,
    hookSilent: true,
    narrationShown: true,
    blockKindNarration: true,
    midTurn: true,
    originalLost: true,
    envNoEffect: true,
    ttsSilent: true,
    redactionMiss: true,
    multiStep: true,
    httpHook: true,
    cue: "muted",
    issue: FEATURED_ISSUE,
  };
}

export function seedSourdine() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    muted: true,
    firstFired: true,
    finalFired: true,
    hookSilent: true,
    narrationShown: true,
    blockKindNarration: true,
    envNoEffect: true,
    cue: "muted",
  };
}

export function seedMidNarration() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    muted: true,
    blockKindNarration: true,
    midTurn: true,
    hookSilent: true,
    narrationShown: true,
    originalLost: true,
    cue: "muted",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    voiced: true,
    cue: "voiced",
  };
}

export function seedFirstFires() {
  return {
    seed: "first-fires",
    preferSeed: true,
    firstFired: true,
    cue: "voiced",
  };
}

export function seedMidSummarized() {
  return {
    seed: "mid-summarized",
    preferSeed: true,
    narrationShown: true,
    blockKindNarration: true,
    cue: "muted",
  };
}

export function seedHookSilent() {
  return {
    seed: "hook-silent",
    preferSeed: true,
    hookSilent: true,
    cue: "muted",
  };
}

export function seedFinalFires() {
  return {
    seed: "final-fires",
    preferSeed: true,
    finalFired: true,
    cue: "voiced",
  };
}

export function seedNarration() {
  return {
    seed: "narration",
    preferSeed: true,
    blockKindNarration: true,
    cue: "muted",
  };
}

export function seedSummarized() {
  return {
    seed: "summarized",
    preferSeed: true,
    narrationShown: true,
    cue: "muted",
  };
}

export function seedBlockKind() {
  return {
    seed: "block-kind",
    preferSeed: true,
    blockKindNarration: true,
    cue: "muted",
  };
}

export function seedTtsSilent() {
  return {
    seed: "tts-silent",
    preferSeed: true,
    ttsSilent: true,
    cue: "muted",
  };
}

export function seedRedactionMiss() {
  return {
    seed: "redaction-miss",
    preferSeed: true,
    redactionMiss: true,
    cue: "muted",
  };
}

export function seedEnvNoEffect() {
  return {
    seed: "env-no-effect",
    preferSeed: true,
    envNoEffect: true,
    cue: "muted",
  };
}

export function seedTrivialNoRepro() {
  return {
    seed: "trivial-no-repro",
    preferSeed: true,
    trivialNoRepro: true,
    cue: "muted",
  };
}

export function seedMultiStep() {
  return {
    seed: "multi-step",
    preferSeed: true,
    multiStep: true,
    cue: "muted",
  };
}

export function seedHttpHook() {
  return {
    seed: "http-hook",
    preferSeed: true,
    httpHook: true,
    cue: "muted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      voiced: false,
      muted: false,
      firstFired: false,
      finalFired: false,
      hookSilent: false,
      narrationShown: false,
      blockKindNarration: false,
      midTurn: false,
      originalLost: false,
      envNoEffect: false,
      ttsSilent: false,
      redactionMiss: false,
      multiStep: false,
      trivialNoRepro: false,
      httpHook: false,
      hookFired: null,
      displayed: null,
      blockType: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    voiced: raw.voiced === true,
    muted: raw.muted === true,
    firstFired:
      raw.firstFired === true ||
      raw.event === "first-fires" ||
      raw.hookFired === true && raw.blockType === "text" && raw.event !== "final-fires",
    finalFired:
      raw.finalFired === true || raw.event === "final-fires",
    hookSilent:
      raw.hookSilent === true ||
      raw.hookFired === false ||
      raw.event === "hook-silent",
    narrationShown:
      raw.narrationShown === true ||
      raw.event === "mid-summarized" ||
      raw.blockType === "narration",
    blockKindNarration:
      raw.blockKindNarration === true ||
      raw.blockKind === BLOCK_KIND ||
      raw.blockType === "narration" ||
      raw.event === "mid-narration" ||
      raw.event === "block-kind" ||
      raw.event === "narration",
    midTurn:
      raw.midTurn === true ||
      raw.event === "mid-narration" ||
      raw.event === "mid-summarized",
    originalLost: raw.originalLost === true,
    envNoEffect:
      raw.envNoEffect === true || raw.event === "env-no-effect",
    ttsSilent: raw.ttsSilent === true || raw.event === "tts-silent",
    redactionMiss:
      raw.redactionMiss === true || raw.event === "redaction-miss",
    multiStep: raw.multiStep === true || raw.event === "multi-step",
    trivialNoRepro:
      raw.trivialNoRepro === true || raw.event === "trivial-no-repro",
    httpHook: raw.httpHook === true || raw.event === "http-hook",
    hookFired: raw.hookFired == null ? null : raw.hookFired === true,
    displayed: raw.displayed == null ? null : raw.displayed,
    blockType: raw.blockType == null ? raw.blockKind || null : raw.blockType,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.voiced != null ||
        ticket.muted != null ||
        ticket.firstFired != null ||
        ticket.finalFired != null ||
        ticket.hookSilent != null ||
        ticket.narrationShown != null ||
        ticket.blockKindNarration != null ||
        ticket.midTurn != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isVoiced(row) {
  if (row.muted && row.cue !== "voiced") return false;
  if (
    row.cue === "muted" ||
    row.cue === "sourdine" ||
    row.cue === "mid-narration"
  ) {
    return false;
  }
  if (
    row.hookSilent &&
    row.cue !== "voiced" &&
    row.voiced !== true &&
    row.firstFired !== true &&
    row.finalFired !== true
  ) {
    return false;
  }
  if (
    row.blockKindNarration &&
    row.cue !== "voiced" &&
    row.voiced !== true &&
    row.muted === true
  ) {
    return false;
  }
  if (
    row.voiced === true &&
    row.muted !== true &&
    row.cue !== "muted"
  ) {
    return true;
  }
  if (
    row.cue === "voiced" &&
    row.muted !== true &&
    row.hookSilent !== true
  ) {
    return true;
  }
  if (
    (row.firstFired === true || row.finalFired === true) &&
    row.muted !== true &&
    row.hookSilent !== true &&
    row.blockKindNarration !== true
  ) {
    return true;
  }
  return false;
}

function isMuted(row) {
  if (isVoiced(row)) return false;
  if (row.cue === "muted" || row.cue === "sourdine") return true;
  if (row.muted === true) return true;
  if (
    row.hookSilent === true ||
    row.narrationShown === true ||
    row.blockKindNarration === true ||
    row.ttsSilent === true ||
    row.redactionMiss === true
  ) {
    return true;
  }
  return false;
}

function isMidNarrationPath(row) {
  return (
    row.event === "mid-narration" &&
    !isVoiced(row) &&
    (row.muted === true ||
      row.blockKindNarration === true ||
      row.hookSilent === true)
  );
}

/**
 * Score one hall pass against the sourdine booth.
 * voiced: MessageDisplay fires for opening text + final answer.
 * muted: narration/summarized mid-turn updates never call MessageDisplay.
 * mid-narration: named path — block_kind narration between tool calls.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMidNarrationPath(row) ||
    (row.blockKindNarration && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mid-narration";
  } else if (isMuted(row)) {
    verdict = "muted";
  } else if (isVoiced(row)) {
    verdict = "voiced";
  } else if (
    row.hookSilent ||
    row.narrationShown ||
    row.blockKindNarration ||
    row.ttsSilent
  ) {
    verdict = "muted";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const attack = inspectAttack(row);
  const phrase = inspectPhrase(row);
  const cadence = inspectCadence(row);
  const hall = inspectHall(row);
  const mute = inspectMute(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    voiced: verdict === "voiced" || verdict === "hold",
    muted:
      verdict === "muted" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    midNarration:
      row.blockKindNarration === true ||
      verdict === "mid-narration" ||
      verdict === PATH_WORD,
    firstFired: row.firstFired,
    finalFired: row.finalFired,
    hookSilent: row.hookSilent,
    narrationShown: row.narrationShown,
    blockKindNarration: row.blockKindNarration,
    midTurn: row.midTurn,
    originalLost: row.originalLost,
    envNoEffect: row.envNoEffect,
    ttsSilent: row.ttsSilent,
    redactionMiss: row.redactionMiss,
    multiStep: row.multiStep,
    trivialNoRepro: row.trivialNoRepro,
    httpHook: row.httpHook,
    hookFired: row.hookFired,
    displayed: row.displayed,
    blockType: row.blockType,
    cue: hold ? "voiced" : "muted",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit voiced" : "score sourdine",
    attackInspect: attack,
    phraseInspect: phrase,
    cadenceInspect: cadence,
    hallInspect: hall,
    muteInspect: mute,
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
      : SOURDINE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const muted = scored.filter((row) => row.verdict === "muted");
  const path = scored.filter((row) => row.verdict === "mid-narration");
  const voiced = scored.filter((row) => row.verdict === "voiced");
  const headline =
    scored.find((row) => row.event === "hook-silent") ||
    scored.find((row) => row.event === "mid-narration") ||
    scored.find((row) => row.event === "mid-summarized") ||
    muted[muted.length - 1];
  let verdict = "voiced";
  if (muted.length) verdict = "muted";
  else if (path.length && !voiced.length) verdict = "mid-narration";
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
    mutedCount: muted.length,
    pathCount: path.length,
    voicedCount: voiced.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit voiced" : "score sourdine",
    note: headline
      ? "Claude Code 2.1.267 VS Code extension; Windows; http MessageDisplay hook; first text fires at 03:14:03; four (summarized) narration rows with no hook; final fires at 03:14:35. CLAUDE_CODE_ENABLE_NARRATION=0 does not restore MessageDisplay."
      : "published sourdine walk scored against voiced vs muted",
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
    seeded !== "voiced" &&
    seeded !== "muted" &&
    seeded !== "mid-narration" &&
    seeded !== "sourdine" &&
    ticket.voiced == null &&
    ticket.muted == null &&
    ticket.firstFired == null &&
    ticket.hookSilent == null &&
    ticket.narrationShown == null &&
    ticket.blockKindNarration == null &&
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
    voiced: scored.voiced ?? false,
    muted: scored.muted ?? false,
    midNarration: scored.midNarration ?? false,
    firstFired: scored.firstFired ?? false,
    finalFired: scored.finalFired ?? false,
    hookSilent: scored.hookSilent ?? false,
    narrationShown: scored.narrationShown ?? false,
    blockKindNarration: scored.blockKindNarration ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.firstFired ? "attack=voiced" : "attack=quiet",
    result.hookSilent || result.narrationShown || result.muted
      ? "phrase=muted"
      : "phrase=voiced",
    result.finalFired ? "cadence=voiced" : "cadence=quiet",
    result.narrationShown || result.blockKindNarration
      ? "hall=on-stage"
      : "hall=dark",
    result.hookSilent || result.muted ? "mute=in" : "mute=open",
    result.midNarration || result.verdict === "mid-narration"
      ? "path=mid-narration"
      : "path=voiced",
    result.cue === "voiced" ? "cue=voiced" : "cue=muted",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const hall = readHall({
    voiced: result.voiced,
    muted: result.muted,
    firstFired: result.firstFired,
    finalFired: result.finalFired,
    hookSilent: result.hookSilent,
    narrationShown: result.narrationShown,
    blockKindNarration: result.blockKindNarration,
    midTurn: result.midTurn,
    ttsSilent: result.ttsSilent,
    redactionMiss: result.redactionMiss,
    envNoEffect: result.envNoEffect,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    hall,
    attack: inspectAttack({
      voiced: result.voiced,
      muted: result.muted,
      firstFired: result.firstFired,
      hookSilent: result.hookSilent,
    }),
    phrase: inspectPhrase({
      voiced: result.voiced,
      muted: result.muted,
      hookSilent: result.hookSilent,
      narrationShown: result.narrationShown,
      blockKindNarration: result.blockKindNarration,
    }),
    cadence: inspectCadence({
      voiced: result.voiced,
      muted: result.muted,
      finalFired: result.finalFired,
      hookSilent: result.hookSilent,
    }),
    stage: inspectHall({
      voiced: result.voiced,
      muted: result.muted,
      narrationShown: result.narrationShown,
      blockKindNarration: result.blockKindNarration,
    }),
    mute: inspectMute({
      voiced: result.voiced,
      muted: result.muted,
      hookSilent: result.hookSilent,
      ttsSilent: result.ttsSilent,
      redactionMiss: result.redactionMiss,
    }),
    stations: HALL_STATIONS.map((row) => ({
      ...row,
      muted: result.muted === true || result.verdict === "muted",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      lastWorkingVersion: LAST_WORKING_VERSION,
      os: OS,
      client: CLIENT,
      shell: SHELL,
      model: MODEL,
      platform: PLATFORM,
      sessionKind: SESSION_KIND,
      feedbackId: FEEDBACK_ID,
      firstBrokenAt: FIRST_BROKEN_AT,
      hookUrl: HOOK_URL,
      envFlag: ENV_FLAG,
      blockKind: BLOCK_KIND,
      displayLabel: DISPLAY_LABEL,
      firstTextAt: FIRST_TEXT_AT,
      firstText: FIRST_TEXT,
      finalTextAt: FINAL_TEXT_AT,
      narrationRows: NARRATION_ROWS,
      stations: HALL_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "MessageDisplay fires for every update shown on screen, including narration blocks — ideally with a field marking them as narration",
        "or a setting turns server-side narration off so updates between tool calls arrive as normal text again",
        "CLAUDE_CODE_ENABLE_NARRATION=0 currently does not restore MessageDisplay for these blocks",
        "TTS/read-aloud hooks stay silent mid-turn; redaction hooks cannot catch narration the user still sees",
      ],
      hypothesis:
        "NON-BINDING: server-side narration replacement (block_kind: narration) may bypass the MessageDisplay hook pipeline while still rendering summarized text in the UI. The env var appears to control the spinner status line (querySource: \"narration\"), not this path. Original prose is not stored. Verify against #93531 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
