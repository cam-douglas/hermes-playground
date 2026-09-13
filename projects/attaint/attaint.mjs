#!/usr/bin/env node
/**
 * Attaint — medieval legal attainder / court-roll / corruption-of-blood booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Cyber safeguard false-positives on closed-source release engineering
 * silently reroute Fable 5.1 to Opus 4.8. One flag contaminates the
 * whole session. Re-selecting `/model fable` does not clear it.
 * Turning off "Switch models when a message is flagged" hard-stops
 * the conversation. There is no path to continue on Fable 5.1.
 *
 *   node attaint.mjs data/attaint.json
 *   echo '{"seed":"attaint"}' | node attaint.mjs
 *
 * Idle word is unattainted (HOLD: Fable 5.1 held; lineage clean; no flag).
 * Seeded word is attaint (#93821 — one flag stains the session blood).
 * Path word is session-attainder.
 * Product score word is attaint (Score attaint or admit unattainted.).
 *
 * Encoded from anthropics/claude-code#93821 issue text only.
 * Hypothesis (NON-BINDING): the classifier keys on surface vocabulary
 * shared between legitimate own-software release engineering and
 * malware evasion; a single flag persists on the session so
 * `/model fable` cannot restore Fable 5.1. Do NOT claim a root cause
 * in Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 *
 * NOT Attainder/#93529 (parked-permission user-rejected stamp).
 * NOT Fomite/#93423 (gitignore epidemiology / .env hitchhike).
 * NOT Oriel/#93809 (plan-window no-reflow).
 * NOT Anarthria/#93782 (dictation paste drop).
 * NOT Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel,
 * Feoffee, Apograph, Airlock, Scotoma.
 * Attaint is specifically a court-roll attainder: one cyber-safeguard
 * flag contaminates the whole session so Fable 5.1 cannot be restored.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "unattainted",
  "attaint",
  "session-attainder",
  "hold",
  "blood-clear",
  "lineage-open",
  "fable-held",
  "writ-clean",
  "roll-open",
  "opus-reroute",
  "flag-contaminates",
  "own-release-eng",
  "symbol-strip",
  "model-fable-fails",
  "cyber-false-positive",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "unattainted";
export const PATH_WORD = "session-attainder";
export const SEEDED_WORD = "attaint";
export const PRODUCT_WORD = "attaint";
export const HOLD = Object.freeze(["unattainted", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "unattainted",
  "blood-clear",
  "lineage-open",
  "fable-held",
  "writ-clean",
  "roll-open",
]);
export const RECOVER = Object.freeze(["unattainted", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "vested",
  "unseised",
  "preview-eperm",
  "feoffee",
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
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "interdict",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "spanned",
  "sashed",
  "bayed",
  "projected",
  "fenestrated",
  "width-fit",
  "phonated",
  "received",
  "larynx-open",
  "clipboard-heard",
  "as-penned",
  "unlocked",
  "responsive",
  "async-notif",
  "free-main",
  "unclenched",
  "letters-patent",
  "demesne-open",
  "getcwd-eperm",
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
  "rubric",
  "quoin",
  "casement",
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
  "bonded",
  "registered",
  "warded",
  "parented",
  "silted",
  "drained",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "attaint"),
);

export const FEATURED_ISSUE = 93821;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93821";
export const TITLE =
  "[MODEL] Cyber safeguard false-positives on closed-source release engineering: Fable 5.1 silently rerouted to Opus 4.8, and one flag contaminates the session";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:model",
  "area:security",
]);
export const PLATFORM = "macos";
export const SURFACE = "session-attainder-cyber-safeguard";
export const HOST = "Claude Code CLI on macOS";
export const CHECKED_ON =
  "Claude Code 2.1.269, macOS 26.2, Claude Max, Fable 5.1 effort xhigh";
export const BUILD = "2.1.269";
export const SELECTED_MODEL = "Fable 5.1 (claude-fable-5-1)";
export const REROUTED_TO = "Opus 4.8";
export const OS = "macOS 26.2 (Darwin 25.2.0)";
export const PLAN = "Claude Max";
export const EFFORT = "xhigh";
export const PERMISSION_MODE = "Accept Edits ON";
export const PHRASE = "Score attaint or admit unattainted.";
export const DISTRIBUTION =
  "A Claude Max user with Fable 5.1 selected had the cyber safeguard flag ordinary benign messages — including the tool output of reading their own local project markdown — and silently reroute the session to Opus 4.8. Re-selecting Fable 5.1 with /model fable did not help; the next message rerouted again, consistent with one flag contaminating the whole session. Turning off \"Switch models when a message is flagged\" stops the silent downgrade, but then a flagged message halts the conversation outright. There is no configuration in which closed-source release engineering (strip symbols, minify, rename identifiers, leak-check own build) proceeds on Fable 5.1. Same class as #63751, open since 2026-05-29.";

export const RULED_OUT = Object.freeze([
  "Offensive cybersecurity (exploits, malware, attack tooling) — reporter is hardening distribution of their own product; defensive IP protection",
  "Dual-use biology — not applicable",
  "Distillation attacks — not applicable",
  "Frontier LLM development — not applicable",
  "Attainder/#93529 parked-permission user-rejected stamp — different defect; a false court seal on tool denial, not a model-reroute attainder",
  "Fomite/#93423 gitignore epidemiology — different defect; .env hitchhike on plugin install, not session-flag contamination",
  "Oriel/#93809 plan-window no-reflow — different defect; a fixed manuscript column, not a cyber-safeguard stain",
  "Anarthria/#93782 dictation-paste-drop — different defect; mute larynx on Wispr Ctrl+V, not a model reroute",
  "Trismus/#93823 UNUserNotification XPC lockjaw — macOS Desktop freeze, not a session flag",
  "Foundling/#93889 subagent Bash orphaning — child-agent lifecycle, not a model-switch contamination",
]);
export const EXPECTED = Object.freeze([
  "Stripping symbols, minifying, renaming identifiers, removing log strings, and leak-checking one's own build output should not trip the offensive-cyber safeguard",
  "The session should stay on Fable 5.1",
  "Re-selecting /model fable should restore Fable 5.1; one flag must not contaminate the whole session",
  "A flagged-but-legitimate request should have a path forward that is neither a silent Opus 4.8 downgrade nor a hard stop",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "own-release-eng",
    label: "own release-eng",
    count: "own-build",
    note: "strip symbols, minify, rename identifiers, leak-check own build — every line is the reporter's",
  },
  {
    id: "cyber-false-positive",
    label: "cyber FP",
    count: "vocabulary",
    note: "classifier keys on obfuscate / strip symbols / leak / protect / no readable strings in own-build context",
  },
  {
    id: "opus-reroute",
    label: "Opus reroute",
    count: "silent",
    note: "Fable 5.1 silently rerouted to Opus 4.8 mid-turn, including on tool output of own markdown",
  },
  {
    id: "flag-contaminates",
    label: "flag stain",
    count: "session",
    note: "one flag contaminates the whole session; later turns stay on Opus 4.8",
  },
  {
    id: "model-fable-fails",
    label: "/model fable",
    count: "no-restore",
    note: "re-selecting /model fable does not clear the attainder; next message reroutes again",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "unattainted-roll",
    survey:
      "Fable 5.1 held; court roll unstained; lineage of turns stays clean",
    kind: "unattainted",
    note: "idle: blood-clear — the hold/good path",
  },
  {
    id: "own-release-eng",
    survey:
      "own closed-source release engineering: strip symbols, minify, rename identifiers, leak-check own build",
    kind: "attaint",
    note: "seeded: legitimate packaging vocabulary on the reporter's own binary",
  },
  {
    id: "cyber-false-positive",
    survey:
      "cyber safeguard flags ordinary benign messages and own local markdown tool output",
    kind: "attaint",
    note: "seeded: false-positive on release-engineering vocabulary",
  },
  {
    id: "session-attainder",
    survey:
      "one flag contaminates the session; /model fable cannot restore Fable 5.1",
    kind: "attaint",
    note: "path: session-attainder names the corruption-of-blood vs an unattainted roll",
  },
  {
    id: "attaint",
    survey:
      "the court roll is attainted — Fable 5.1→Opus 4.8; every later turn stays stained",
    kind: "attaint",
    note: "seeded: attaint — no path to continue on Fable 5.1",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "session-attainder",
  "attaint",
  "opus-reroute",
  "flag-contaminates",
  "own-release-eng",
  "symbol-strip",
]);

export const COUSINS = Object.freeze([
  {
    issue: 63751,
    repo: "anthropics/claude-code",
    title:
      "same class of cyber-safeguard false positive and session-contamination; open since 2026-05-29",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — same class, open since 2026-05-29; do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "attainder",
  "fomite",
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
  "deadkey",
  "rasure",
  "ashpan",
  "outrider",
  "simplex",
  "rubric",
  "galley",
]);

export const SAMPLE_MODEL_IDLE = "fable-5-1";
export const SAMPLE_MODEL_SEEDED = "opus-4-8";
export const SAMPLE_BLOOD_IDLE = "clear";
export const SAMPLE_BLOOD_SEEDED = "stained";

export const SAMPLE_UNATTAINTED_PROOF = Object.freeze({
  unattainted: true,
  attaint: false,
  sessionAttainder: false,
  opusReroute: false,
  flagContaminates: false,
  ownReleaseEng: false,
  symbolStrip: false,
  modelFableFails: false,
  cyberFalsePositive: false,
  model: SAMPLE_MODEL_IDLE,
});

export const SAMPLE_ATTAINT_PROOF = Object.freeze({
  unattainted: false,
  attaint: true,
  sessionAttainder: true,
  opusReroute: true,
  flagContaminates: true,
  ownReleaseEng: true,
  symbolStrip: true,
  modelFableFails: true,
  cyberFalsePositive: true,
  model: SAMPLE_MODEL_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds unattainted: Fable 5.1 held; court roll unstained; lineage clean" },
  { t: "own-release-eng", line: "strip symbols, minify, rename identifiers, leak-check own build — every line is the reporter's" },
  { t: "cyber-false-positive", line: "safeguard flags own markdown tool output; session silently reroutes Fable 5.1→Opus 4.8" },
  { t: "path", line: "session-attainder — one flag contaminates the session; /model fable cannot restore Fable 5.1" },
  { t: "score", line: "when one flag stains the whole lineage the booth is attaint — Score attaint or admit unattainted." },
]);

/**
 * Scope map: clean court roll vs attainted blood-line.
 * Idle/unattainted: Fable held; lineage clean.
 * Seeded/attaint: one flag stains every later turn.
 */
export function mapScope(input = {}) {
  const attaint =
    input.attaint === true ||
    input.sessionAttainder === true ||
    input.opusReroute === true ||
    input.flagContaminates === true ||
    input.cyberFalsePositive === true ||
    input.modelFableFails === true;
  const unattainted = input.unattainted === true && !attaint;
  return {
    stamp: attaint ? "session-attainder" : "unattainted-roll",
    bloodLane: attaint ? "stained" : "clear",
    modelLane: attaint ? "opus-4-8" : "fable-5-1",
    flagLane: attaint ? "contaminates" : "clear",
    ribbon: attaint ? "attaint" : "unattainted",
    unattainted,
  };
}

export function inspectLineage(input = {}) {
  const stained =
    input.sessionAttainder === true ||
    input.attaint === true ||
    input.flagContaminates === true;
  if (input.unattainted === true && !stained) {
    return {
      stamp: "lineage-open",
      blood: SAMPLE_BLOOD_IDLE,
      stained: false,
    };
  }
  return {
    stamp: stained ? "lineage-attainted" : "lineage-idle",
    blood: stained ? SAMPLE_BLOOD_SEEDED : SAMPLE_BLOOD_IDLE,
    stained,
  };
}

export function inspectFlag(input = {}) {
  const hit =
    input.flagContaminates === true ||
    input.attaint === true ||
    input.cyberFalsePositive === true;
  if (input.unattainted === true && !hit) {
    return {
      stamp: "flag-clear",
      contaminates: false,
    };
  }
  return {
    stamp: hit ? "flag-contaminates" : "flag-idle",
    contaminates: hit,
    note: hit
      ? "one flag contaminates the whole session; later turns stay stained"
      : "",
  };
}

export function inspectModel(input = {}) {
  const reroute =
    input.opusReroute === true ||
    input.attaint === true ||
    input.modelFableFails === true;
  if (input.unattainted === true && !reroute) {
    return {
      stamp: "fable-held",
      model: SAMPLE_MODEL_IDLE,
      rerouted: false,
    };
  }
  return {
    stamp: reroute ? "opus-reroute" : "model-idle",
    model: reroute ? SAMPLE_MODEL_SEEDED : "",
    selected: SELECTED_MODEL,
    rerouted: reroute,
    restoreFails: input.modelFableFails === true || reroute,
  };
}

export function inspectRelease(input = {}) {
  const own =
    input.ownReleaseEng === true ||
    input.symbolStrip === true ||
    input.attaint === true;
  if (input.unattainted === true && !own) {
    return {
      stamp: "release-idle",
      own: false,
    };
  }
  return {
    stamp: own ? "own-release-eng" : "release-idle",
    own,
    symbolStrip: input.symbolStrip === true || own,
    note: own
      ? "strip symbols, minify, rename identifiers, leak-check own build"
      : "",
  };
}

export function inspectBlood(input = {}) {
  const stained =
    input.attaint === true ||
    input.sessionAttainder === true ||
    input.flagContaminates === true;
  if (input.unattainted === true && !stained) {
    return {
      stamp: "blood-clear",
      stained: false,
    };
  }
  return {
    stamp: stained ? "corruption-of-blood" : "blood-idle",
    stained,
    note: stained
      ? "one attainder stains the whole lineage — every later turn stays on Opus 4.8"
      : "",
  };
}

export function readBooth(input = {}) {
  const attaint =
    input.attaint === true ||
    input.sessionAttainder === true ||
    input.opusReroute === true ||
    input.flagContaminates === true ||
    input.cyberFalsePositive === true ||
    input.modelFableFails === true;
  const unattainted = input.unattainted === true && !attaint;
  return {
    mark: attaint ? "attaint" : unattainted || !attaint ? "unattainted" : "attaint",
    unattainted,
    attaint,
    sessionAttainder: input.sessionAttainder === true || attaint,
    opusReroute: input.opusReroute === true,
    flagContaminates: input.flagContaminates === true,
    ownReleaseEng: input.ownReleaseEng === true,
    symbolStrip: input.symbolStrip === true,
    modelFableFails: input.modelFableFails === true,
    cyberFalsePositive: input.cyberFalsePositive === true,
    scope: mapScope(input),
    lineage: inspectLineage(input),
    flag: inspectFlag(input),
    model: inspectModel(input),
    release: inspectRelease(input),
    blood: inspectBlood(input),
    log: input.log || [],
  };
}

export const ATTAINT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-unattainted",
    unattainted: true,
    attaint: false,
    cue: "unattainted",
    note: "idle HOLD: Fable 5.1 held; court roll unstained; lineage clean — the hold/good path",
  },
  {
    t: "own-release-eng",
    event: "own-release-eng",
    attaint: true,
    ownReleaseEng: true,
    symbolStrip: true,
    cue: "attaint",
    note: "own closed-source release engineering: strip symbols, minify, rename identifiers, leak-check own build",
  },
  {
    t: "cyber-false-positive",
    event: "cyber-false-positive",
    attaint: true,
    cyberFalsePositive: true,
    opusReroute: true,
    cue: "attaint",
    note: "safeguard flags own markdown tool output; session silently reroutes Fable 5.1→Opus 4.8",
  },
  {
    t: "path",
    event: "session-attainder",
    attaint: true,
    sessionAttainder: true,
    flagContaminates: true,
    modelFableFails: true,
    cue: "attaint",
    note: "session-attainder — one flag contaminates the session; /model fable cannot restore",
  },
  {
    t: "score",
    event: "attaint",
    attaint: true,
    sessionAttainder: true,
    flagContaminates: true,
    opusReroute: true,
    cue: "attaint",
    note: "attaint — when one flag stains the whole lineage the booth is attaint",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-unattainted",
    unattainted: true,
    attaint: false,
    cue: "unattainted",
    note: "positive control: Fable 5.1 held; lineage clean",
  },
  {
    t: "announce",
    event: "cue-unattainted",
    unattainted: true,
    cue: "unattainted",
    note: "positive control: the court roll stays unattainted",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    unattainted: true,
    attaint: false,
    sessionAttainder: false,
    cue: "unattainted",
  };
}

export function seedUnattainted() {
  return { ...emptyTicket() };
}

export function seedAttaint() {
  return {
    seed: SEEDED_WORD,
    unattainted: false,
    attaint: true,
    sessionAttainder: true,
    opusReroute: true,
    flagContaminates: true,
    ownReleaseEng: true,
    symbolStrip: true,
    modelFableFails: true,
    cyberFalsePositive: true,
    cue: "attaint",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ATTAINT_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    attaint: true,
    sessionAttainder: true,
    flagContaminates: true,
    cue: "attaint",
  };
}

export function seedSessionAttainder() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    attaint: true,
    sessionAttainder: true,
    flagContaminates: true,
    event: "session-attainder",
    cue: "attaint",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    unattainted: true,
    cue: "unattainted",
  };
}

export function seedOpusReroute() {
  return {
    seed: "opus-reroute",
    preferSeed: true,
    opusReroute: true,
    cue: "attaint",
  };
}

export function seedFlagContaminates() {
  return {
    seed: "flag-contaminates",
    preferSeed: true,
    flagContaminates: true,
    cue: "attaint",
  };
}

export function seedOwnReleaseEng() {
  return {
    seed: "own-release-eng",
    preferSeed: true,
    ownReleaseEng: true,
    cue: "attaint",
  };
}

export function seedSymbolStrip() {
  return {
    seed: "symbol-strip",
    preferSeed: true,
    symbolStrip: true,
    cue: "attaint",
  };
}

export function seedModelFableFails() {
  return {
    seed: "model-fable-fails",
    preferSeed: true,
    modelFableFails: true,
    cue: "attaint",
  };
}

export function seedCyberFalsePositive() {
  return {
    seed: "cyber-false-positive",
    preferSeed: true,
    cyberFalsePositive: true,
    cue: "attaint",
  };
}

export function seedBloodClear() {
  return {
    seed: "blood-clear",
    preferSeed: true,
    unattainted: true,
    cue: "unattainted",
  };
}

export function seedLineageOpen() {
  return {
    seed: "lineage-open",
    preferSeed: true,
    unattainted: true,
    cue: "unattainted",
  };
}

export function seedFableHeld() {
  return {
    seed: "fable-held",
    preferSeed: true,
    unattainted: true,
    cue: "unattainted",
  };
}

export function seedWritClean() {
  return {
    seed: "writ-clean",
    preferSeed: true,
    unattainted: true,
    cue: "unattainted",
  };
}

export function seedRollOpen() {
  return {
    seed: "roll-open",
    preferSeed: true,
    unattainted: true,
    cue: "unattainted",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      unattainted: false,
      attaint: false,
      sessionAttainder: false,
      opusReroute: false,
      flagContaminates: false,
      ownReleaseEng: false,
      symbolStrip: false,
      modelFableFails: false,
      cyberFalsePositive: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    unattainted: raw.unattainted === true,
    attaint: raw.attaint === true || raw.event === "attaint",
    sessionAttainder:
      raw.sessionAttainder === true || raw.event === "session-attainder",
    opusReroute: raw.opusReroute === true || raw.event === "opus-reroute",
    flagContaminates:
      raw.flagContaminates === true || raw.event === "flag-contaminates",
    ownReleaseEng:
      raw.ownReleaseEng === true || raw.event === "own-release-eng",
    symbolStrip: raw.symbolStrip === true || raw.event === "symbol-strip",
    modelFableFails:
      raw.modelFableFails === true || raw.event === "model-fable-fails",
    cyberFalsePositive:
      raw.cyberFalsePositive === true || raw.event === "cyber-false-positive",
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
      (ticket.unattainted != null ||
        ticket.attaint != null ||
        ticket.sessionAttainder != null ||
        ticket.opusReroute != null ||
        ticket.flagContaminates != null ||
        ticket.ownReleaseEng != null ||
        ticket.symbolStrip != null ||
        ticket.modelFableFails != null ||
        ticket.cyberFalsePositive != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isUnattainted(row) {
  if (row.attaint && row.cue !== "unattainted") return false;
  if (row.cue === "attaint" || row.cue === "session-attainder") {
    return false;
  }
  if (
    row.sessionAttainder &&
    row.flagContaminates &&
    row.cue !== "unattainted" &&
    row.unattainted !== true
  ) {
    return false;
  }
  if (row.unattainted === true && row.attaint !== true && row.cue !== "attaint") {
    return true;
  }
  if (
    row.cue === "unattainted" &&
    row.attaint !== true &&
    row.sessionAttainder !== true &&
    row.flagContaminates !== true &&
    row.opusReroute !== true &&
    row.cyberFalsePositive !== true &&
    row.modelFableFails !== true
  ) {
    return true;
  }
  return false;
}

function isSessionAttainder(row) {
  return (
    row.event === "session-attainder" &&
    !isUnattainted(row) &&
    (row.sessionAttainder === true ||
      row.flagContaminates === true ||
      row.modelFableFails === true)
  );
}

function isAttaintRow(row) {
  if (isUnattainted(row)) return false;
  if (isSessionAttainder(row) && row.cue !== "attaint") return false;
  if (row.cue === "attaint") return true;
  if (row.attaint === true) return true;
  if (row.sessionAttainder === true && row.flagContaminates === true) {
    return true;
  }
  if (
    row.sessionAttainder === true ||
    row.flagContaminates === true ||
    row.opusReroute === true ||
    row.cyberFalsePositive === true ||
    row.modelFableFails === true ||
    row.ownReleaseEng === true ||
    row.symbolStrip === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one attaint pass against the court roll.
 * unattainted: Fable 5.1 held; lineage clean.
 * attaint: one cyber-safeguard flag stains the session blood.
 * session-attainder: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSessionAttainder(row) ||
    (row.sessionAttainder && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "session-attainder";
  } else if (isAttaintRow(row)) {
    verdict = "attaint";
  } else if (isUnattainted(row)) {
    verdict = "unattainted";
  } else if (
    row.sessionAttainder ||
    row.flagContaminates ||
    row.opusReroute ||
    row.cyberFalsePositive ||
    row.modelFableFails ||
    row.ownReleaseEng ||
    row.symbolStrip
  ) {
    verdict = "attaint";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const lineage = inspectLineage(row);
  const flag = inspectFlag(row);
  const model = inspectModel(row);
  const release = inspectRelease(row);
  const blood = inspectBlood(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    unattainted: verdict === "unattainted" || verdict === "hold",
    attaint: verdict === "attaint" || verdict === SEEDED_WORD,
    sessionAttainder:
      row.sessionAttainder === true ||
      verdict === "session-attainder" ||
      verdict === PATH_WORD,
    opusReroute: row.opusReroute,
    flagContaminates: row.flagContaminates,
    ownReleaseEng: row.ownReleaseEng,
    symbolStrip: row.symbolStrip,
    modelFableFails: row.modelFableFails,
    cyberFalsePositive: row.cyberFalsePositive,
    cue: hold
      ? "unattainted"
      : row.sessionAttainder || verdict === "session-attainder"
        ? "session-attainder"
        : "attaint",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit unattainted" : "score attaint",
    lineageInspect: lineage,
    flagInspect: flag,
    modelInspect: model,
    releaseInspect: release,
    bloodInspect: blood,
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
      : ATTAINT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "attaint");
  const path = scored.filter((row) => row.verdict === "session-attainder");
  const unattainted = scored.filter((row) => row.verdict === "unattainted");
  const headline =
    scored.find((row) => row.event === "attaint") ||
    scored.find((row) => row.event === "session-attainder") ||
    scored.find((row) => row.event === "opus-reroute") ||
    dead[dead.length - 1];
  let verdict = "unattainted";
  if (dead.length) verdict = "attaint";
  else if (path.length && !unattainted.length) verdict = "session-attainder";
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
    attaintCount: dead.length,
    pathCount: path.length,
    unattaintedCount: unattainted.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit unattainted" : "score attaint",
    note: headline
      ? "Cyber safeguard false-positives on own release-engineering vocabulary silently reroute Fable 5.1→Opus 4.8; one flag contaminates the session so /model fable cannot restore it. Cousin #63751 is cite-only."
      : "published attaint walk scored against unattainted vs attaint",
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
    seeded !== "unattainted" &&
    seeded !== "attaint" &&
    seeded !== "session-attainder" &&
    ticket.unattainted == null &&
    ticket.attaint == null &&
    ticket.sessionAttainder == null &&
    ticket.flagContaminates == null &&
    ticket.opusReroute == null &&
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
    unattainted: scored.unattainted ?? false,
    attaint: scored.attaint ?? false,
    sessionAttainder: scored.sessionAttainder ?? false,
    opusReroute: scored.opusReroute ?? false,
    flagContaminates: scored.flagContaminates ?? false,
    ownReleaseEng: scored.ownReleaseEng ?? false,
    symbolStrip: scored.symbolStrip ?? false,
    modelFableFails: scored.modelFableFails ?? false,
    cyberFalsePositive: scored.cyberFalsePositive ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.opusReroute || result.attaint ? "model=opus-4-8" : "model=fable-5-1",
    result.flagContaminates || result.attaint ? "flag=stain" : "flag=clear",
    result.sessionAttainder || result.verdict === "session-attainder"
      ? "path=session-attainder"
      : "path=unattainted",
    result.cue === "unattainted"
      ? "cue=unattainted"
      : result.cue === "session-attainder"
        ? "cue=session-attainder"
        : "cue=attaint",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    unattainted: result.unattainted,
    attaint: result.attaint,
    sessionAttainder: result.sessionAttainder,
    opusReroute: result.opusReroute,
    flagContaminates: result.flagContaminates,
    ownReleaseEng: result.ownReleaseEng,
    symbolStrip: result.symbolStrip,
    modelFableFails: result.modelFableFails,
    cyberFalsePositive: result.cyberFalsePositive,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    lineage: inspectLineage({
      unattainted: result.unattainted,
      attaint: result.attaint,
      sessionAttainder: result.sessionAttainder,
      flagContaminates: result.flagContaminates,
    }),
    flag: inspectFlag({
      unattainted: result.unattainted,
      attaint: result.attaint,
      flagContaminates: result.flagContaminates,
      cyberFalsePositive: result.cyberFalsePositive,
    }),
    model: inspectModel({
      unattainted: result.unattainted,
      attaint: result.attaint,
      opusReroute: result.opusReroute,
      modelFableFails: result.modelFableFails,
    }),
    release: inspectRelease({
      unattainted: result.unattainted,
      attaint: result.attaint,
      ownReleaseEng: result.ownReleaseEng,
      symbolStrip: result.symbolStrip,
    }),
    blood: inspectBlood({
      unattainted: result.unattainted,
      attaint: result.attaint,
      sessionAttainder: result.sessionAttainder,
      flagContaminates: result.flagContaminates,
    }),
    scope: mapScope({
      unattainted: result.unattainted,
      attaint: result.attaint,
      sessionAttainder: result.sessionAttainder,
      opusReroute: result.opusReroute,
      flagContaminates: result.flagContaminates,
      cyberFalsePositive: result.cyberFalsePositive,
      modelFableFails: result.modelFableFails,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      attaint:
        result.attaint === true ||
        result.verdict === "attaint",
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
      reroutedTo: REROUTED_TO,
      os: OS,
      plan: PLAN,
      effort: EFFORT,
      permissionMode: PERMISSION_MODE,
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
        "NON-BINDING: the classifier keys on surface vocabulary shared between legitimate own-software release engineering and malware evasion; a single flag persists on the session so /model fable cannot restore Fable 5.1. Invite verify against #93821 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
