#!/usr/bin/env node
/**
 * Cachet — diplomatic / notarial wax-cachet seal desk.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * --resume on Fable 5.1 replays the session-start context message
 * (SessionStart hook output + # Environment) as a plain string
 * instead of the content-block array + cache_control seal it was
 * sent with. The prompt-cache prefix stops matching at messages[1]
 * and the rest of the folio is rewritten. Opus --resume still hits.
 *
 *   node cachet.mjs data/flattened.json
 *   echo '{"seed":"flattened"}' | node cachet.mjs
 *
 * Idle word is hit (HOLD: fresh+resume keep block carrier +
 * cache_control; prefix matches; cache_read past floor).
 * Seeded word is flattened (#93490: Fable resume stringifies
 * messages[1], drops cache_control).
 * Path word is string-carrier.
 * Product score word is cachet (score cachet or admit hit).
 *
 * Encoded from anthropics/claude-code#93490 issue text only.
 * Hypothesis (NON-BINDING): Fable 5.1 resume may flatten
 * messages[1] from ARRAY+cache_control to a plain string, so the
 * prompt-cache prefix stops matching and the folio is rewritten.
 * Opus --resume still hits. Two fresh launches 30s apart hit each
 * others cache completely, so this is not TTL/settings/hooks.
 * Verify against #93490 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "hit",
  "flattened",
  "cachet",
  "string-carrier",
  "hold",
  "fable-miss",
  "opus-hit",
  "resume",
  "fresh-start",
  "array-carrier",
  "plain-string",
  "cache-control",
  "prefix-bust",
  "rewrite",
  "session-start",
  "environment",
  "background-fork",
  "probe",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "hit";
export const PATH_WORD = "string-carrier";
export const SEEDED_WORD = "flattened";
export const PRODUCT_WORD = "cachet";
export const HOLD = Object.freeze(["hit", "hold"]);
export const RECOVER = Object.freeze(["hit", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "flushed",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "flattened" && name !== "cachet",
  ),
);

export const FEATURED_ISSUE = 93490;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93490";
export const TITLE =
  "[BUG] --resume never hits the prompt cache past the static prefix on Fable 5.1 (opus hits): session-start context message is replayed as a plain string instead of the content blocks it was sent with";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:cost",
  "area:core",
  "performance",
]);
export const AUTHOR = "vvasic";
export const FILED = "2026-09-10T22:38:34Z";
export const CLAUDE_CODE_VERSION = "2.1.268";
export const MODEL_FABLE = "fable 5.1";
export const MODEL_OPUS = "opus";
export const SESSION_KIND = "headless and interactive";
export const PLATFORM = "macos";
export const TERMINAL = "iTerm2, zsh";
export const MESSAGE_INDEX = 1;
export const MESSAGE_ROLE = "system";
export const SESSION_START = "SessionStart hook output + # Environment";
export const CONTENT_LENGTH = 26285;
export const CACHE_CONTROL = Object.freeze({ type: "ephemeral", ttl: "1h" });
export const FRESH_CARRIER = "ARRAY";
export const RESUME_CARRIER = "STRING";
export const PROBE_TOKENS = "18-25k";
export const REAL_REWRITE_READ = 27000;
export const REAL_REWRITE_WRITE = 385000;
export const CROSS_HIT_READ = 231238;
export const CROSS_HIT_WRITE = 0;
export const FABLE_DOCS =
  "Editing earlier turns invalidates thinking blocks";
export const PHRASE =
  "when --resume on Fable 5.1 replays the session-start context as a plain string instead of sealed content blocks and busts the prompt-cache prefix, score cachet or admit hit.";

export const DESK_STATIONS = Object.freeze([
  {
    id: "press",
    survey: "seat the wax-cachet press",
    kind: "carrier",
    note: "fresh start: messages[1] content is ARRAY with one text block",
  },
  {
    id: "ribbon",
    survey: "affix the ephemeral cachet ribbon",
    kind: "cache-control",
    note: "fresh start: cache_control {type: ephemeral, ttl: 1h}",
  },
  {
    id: "folio",
    survey: "read the session-start folio",
    kind: "session-start",
    note: "messages[1] role:system carries SessionStart hook output + # Environment",
  },
  {
    id: "meter",
    survey: "watch the cache-read meter past the tools+system floor",
    kind: "meters",
    note: "idle hit: cache_read past floor; flattened: cache_read stuck at floor, cache_creation is the rest",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "string-carrier",
  "fable-miss",
  "opus-hit",
  "prefix-bust",
  "session-start",
  "cache-control",
  "plain-string",
  "background-fork",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91971,
    title:
      "chained -p --resume never hits the prompt cache past the static prefix (symptom without cause)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same symptom without a cause; do not rebuild",
  },
  {
    issue: 83913,
    title:
      "PreToolUse/PostToolUse context replayed as a plain string instead of content blocks (same mechanism, different message)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same mechanism, different message; do not rebuild",
  },
  {
    issue: 44045,
    title:
      "messages[0] carrier / deferred-tools listing (closed; covered messages[0])",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed; covered messages[0]; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93485,
    title: "Cowork hardlink upload cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93458,
    title: "SessionStart hook additionalContext silently dropped when source=fork",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93439,
    title:
      "Read tool never triggers PreToolUse hooks for binary files (Desktop App, \"Code\" tab)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93475,
    title:
      "[BUG] Effort selector (Alt+P / plan mode) requires very tall terminal to display; unusable at standard terminal heights",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93438,
    title:
      '[Bug] Agent dispatch with isolation:"worktree" causes cwd state bleed into parent session',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93466,
    title:
      "[BUG] Desktop Directory → Plugins: duplicate cards, cards shown under the wrong marketplace, and no working uninstall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export function inspectCarrier(input = {}) {
  const stringCarrier =
    input.stringCarrier === true ||
    input.plainString === true ||
    input.carrier === "STRING" ||
    input.contentShape === "STRING" ||
    (input.resume === true &&
      input.arrayCarrier !== true &&
      input.hit !== true);
  const arrayCarrier =
    input.arrayCarrier === true ||
    input.carrier === "ARRAY" ||
    input.contentShape === "ARRAY" ||
    (input.hit === true && !stringCarrier);
  const flattened =
    stringCarrier &&
    input.hit !== true &&
    (input.resume === true ||
      input.fable === true ||
      input.flattened === true ||
      input.plainString === true);
  return {
    array: arrayCarrier && !flattened,
    string: flattened || (stringCarrier && input.hit !== true),
    stamp: flattened ? "flattened" : "hit",
    shape: flattened ? RESUME_CARRIER : FRESH_CARRIER,
    length: CONTENT_LENGTH,
    note: flattened
      ? "resume: content is a PLAIN STRING, same text/length (26285 chars)"
      : "fresh start: content is ARRAY with one text block",
  };
}

export function inspectCacheControl(input = {}) {
  const present =
    input.cacheControl === true ||
    input.cacheControlPresent === true ||
    (input.hit === true && input.cacheControlDropped !== true);
  const dropped =
    input.cacheControlDropped === true ||
    input.noCacheControl === true ||
    (input.stringCarrier === true && input.hit !== true) ||
    (input.plainString === true && input.hit !== true);
  const missing = dropped && input.hit !== true;
  return {
    present: present && !missing,
    dropped: missing,
    stamp: missing ? "flattened" : "hit",
    value: missing ? null : { ...CACHE_CONTROL },
    note: missing
      ? "resume: NO cache_control"
      : "fresh start: cache_control {type: ephemeral, ttl: 1h}",
  };
}

export function inspectPrefix(input = {}) {
  const bust =
    input.prefixBust === true ||
    input.prefixMiss === true ||
    ((input.stringCarrier === true || input.plainString === true) &&
      input.hit !== true);
  return {
    matches: !bust || input.hit === true,
    bust: bust && input.hit !== true,
    stamp: bust && input.hit !== true ? "flattened" : "hit",
    note:
      bust && input.hit !== true
        ? "prefix stops matching at messages[1]; everything behind rewritten"
        : "tools identical, system blocks identical, messages[0] identical; prefix matches",
  };
}

export function inspectModel(input = {}) {
  const opus =
    input.opus === true ||
    input.model === "opus" ||
    input.model === MODEL_OPUS;
  const fable =
    input.fable === true ||
    input.model === "fable" ||
    input.model === MODEL_FABLE ||
    input.model === "fable 5.1" ||
    (!opus && (input.resume === true || input.flattened === true));
  const miss =
    fable &&
    input.opus !== true &&
    input.hit !== true &&
    (input.resume === true ||
      input.flattened === true ||
      input.fableMiss === true ||
      input.stringCarrier === true);
  const opusHit =
    opus &&
    (input.opusHit === true ||
      input.resume === true ||
      input.hit === true ||
      input.opus === true);
  return {
    fable: fable && !opus,
    opus: opus,
    miss: miss && !opus,
    opusHit: opus && (opusHit || input.hit === true),
    stamp: miss && !opus ? "flattened" : "hit",
    note:
      miss && !opus
        ? "fable 5.1 --model fable resumes MISS every time (write≈fresh write, read stuck at floor)"
        : opus
          ? "opus --model opus resumes HIT (write tiny / read full)"
          : "fresh+resume keep block carrier + cache_control; prefix matches",
  };
}

export function inspectMeters(input = {}) {
  const floorStuck =
    input.floorStuck === true ||
    input.cacheReadFloor === true ||
    ((input.flattened === true || input.stringCarrier === true) &&
      input.hit !== true);
  const rewrite =
    input.rewrite === true ||
    input.cacheCreationRest === true ||
    (floorStuck && input.hit !== true);
  const pastFloor =
    input.hit === true ||
    input.cacheReadPastFloor === true ||
    input.opusHit === true ||
    (!floorStuck && input.flattened !== true);
  return {
    cacheReadPastFloor: pastFloor && !rewrite,
    floorStuck: rewrite && input.hit !== true,
    rewrite: rewrite && input.hit !== true,
    stamp: rewrite && input.hit !== true ? "flattened" : "hit",
    probe: PROBE_TOKENS,
    realRead: rewrite && input.hit !== true ? REAL_REWRITE_READ : CROSS_HIT_READ,
    realWrite: rewrite && input.hit !== true ? REAL_REWRITE_WRITE : CROSS_HIT_WRITE,
    note:
      rewrite && input.hit !== true
        ? "cache_read stays at tools+system floor; cache_creation is the rest (probe ~18-25k; real session 385k rewrite, background fork read 27k / wrote 385k)"
        : "cache_read past floor; two fresh launches 30s apart hit each others cache completely (231238 read, 0 written)",
  };
}

export function readFolio(input = {}) {
  const carrier = inspectCarrier(input);
  const cacheControl = inspectCacheControl(input);
  const prefix = inspectPrefix(input);
  const model = inspectModel(input);
  const meters = inspectMeters(input);
  const flattened =
    carrier.stamp === "flattened" ||
    cacheControl.stamp === "flattened" ||
    prefix.stamp === "flattened" ||
    model.stamp === "flattened" ||
    meters.stamp === "flattened" ||
    input.flattened === true;
  const hit =
    input.hit === true &&
    flattened !== true &&
    carrier.stamp === "hit";
  return {
    carrier,
    cacheControl,
    prefix,
    model,
    meters,
    stations: DESK_STATIONS,
    flattened: flattened && !hit,
    hit:
      hit ||
      (carrier.stamp === "hit" &&
        cacheControl.stamp === "hit" &&
        prefix.stamp === "hit" &&
        model.stamp === "hit" &&
        meters.stamp === "hit" &&
        input.flattened !== true),
    mark: flattened && !hit ? "flattened" : "hit",
  };
}

/**
 * Published cachet walk from #93490 only. Facts from the issue text.
 * A hit booth keeps the ARRAY carrier + cache_control seal so the
 * prompt-cache prefix matches past the tools+system floor. A
 * flattened booth is Fable --resume stringifying messages[1].
 */
export const CACHET_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-hit",
    hit: true,
    flattened: false,
    resume: false,
    arrayCarrier: true,
    cacheControl: true,
    prefixBust: false,
    fable: false,
    cue: "hit",
    note: "idle HOLD: fresh+resume keep block carrier + cache_control; prefix matches; cache_read past floor",
  },
  {
    t: "fresh",
    event: "fresh-start",
    hit: true,
    arrayCarrier: true,
    cacheControl: true,
    contentShape: "ARRAY",
    cue: "hit",
    note: "fresh start: messages[1] content is ARRAY with one text block + cache_control {type: ephemeral, ttl: 1h}",
  },
  {
    t: "cross",
    event: "cross-hit",
    hit: true,
    cacheReadPastFloor: true,
    cue: "hit",
    note: "two fresh launches 30s apart hit each others cache completely (231238 read, 0 written) — not TTL/settings/hooks",
  },
  {
    t: "proxy",
    event: "prefix-identical",
    hit: true,
    toolsIdentical: true,
    systemIdentical: true,
    messages0Identical: true,
    cue: "hit",
    note: "proxy capture: tools identical, system blocks identical, messages[0] identical byte-for-byte",
  },
  {
    t: "folio",
    event: "session-start",
    resume: true,
    fable: true,
    messageIndex: 1,
    messageRole: "system",
    sessionStart: true,
    flattened: true,
    cue: "flattened",
    note: "first difference is messages[1] role:system (SessionStart hook output + # Environment)",
  },
  {
    t: "flatten",
    event: "plain-string",
    resume: true,
    fable: true,
    stringCarrier: true,
    plainString: true,
    contentShape: "STRING",
    contentLength: 26285,
    cacheControlDropped: true,
    flattened: true,
    cue: "flattened",
    note: "resume: content is a PLAIN STRING, same text/length (26285 chars), NO cache_control",
  },
  {
    t: "bust",
    event: "prefix-bust",
    resume: true,
    fable: true,
    prefixBust: true,
    stringCarrier: true,
    flattened: true,
    cue: "flattened",
    note: "prefix stops matching there; everything behind rewritten. Small probe ~18-25k tokens; real session 385k rewrite (background fork: read 27k, wrote 385k)",
  },
  {
    t: "opus",
    event: "opus-hit",
    opus: true,
    resume: true,
    opusHit: true,
    hit: true,
    cue: "hit",
    note: "opus --model opus resumes HIT (write tiny / read full)",
  },
  {
    t: "fable",
    event: "fable-miss",
    fable: true,
    resume: true,
    fableMiss: true,
    flattened: true,
    stringCarrier: true,
    cue: "flattened",
    note: "fable 5.1 --model fable resumes MISS every time (write≈fresh write, read stuck at floor)",
  },
  {
    t: "path",
    event: "string-carrier",
    flattened: true,
    stringCarrier: true,
    resume: true,
    fable: true,
    cue: "flattened",
    note: "string-carrier — Fable resume replays the session-start context as a plain string instead of content blocks",
  },
  {
    t: "score",
    event: "cachet",
    flattened: true,
    stringCarrier: true,
    cue: "flattened",
    note: "cachet — score the wax-cachet that failed to re-affix on Fable --resume",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    hit: true,
    flattened: false,
    resume: false,
    arrayCarrier: true,
    cacheControl: true,
    prefixBust: false,
    cue: "hit",
  };
}

export function seedHit() {
  return { ...emptyTicket() };
}

export function seedFlattened() {
  return {
    seed: SEEDED_WORD,
    hit: false,
    flattened: true,
    resume: true,
    fable: true,
    stringCarrier: true,
    plainString: true,
    contentShape: "STRING",
    contentLength: CONTENT_LENGTH,
    cacheControlDropped: true,
    prefixBust: true,
    floorStuck: true,
    rewrite: true,
    cue: "flattened",
    issue: FEATURED_ISSUE,
  };
}

export function seedCachet() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    flattened: true,
    stringCarrier: true,
    cue: "flattened",
  };
}

export function seedStringCarrier() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    flattened: true,
    stringCarrier: true,
    resume: true,
    fable: true,
    cue: "flattened",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    hit: true,
    cue: "hit",
  };
}

export function seedFableMiss() {
  return {
    seed: "fable-miss",
    preferSeed: true,
    fable: true,
    resume: true,
    cue: "flattened",
  };
}

export function seedOpusHit() {
  return {
    seed: "opus-hit",
    preferSeed: true,
    opus: true,
    resume: true,
    cue: "hit",
  };
}

export function seedResume() {
  return {
    seed: "resume",
    preferSeed: true,
    resume: true,
    cue: "flattened",
  };
}

export function seedFreshStart() {
  return {
    seed: "fresh-start",
    preferSeed: true,
    hit: true,
    cue: "hit",
  };
}

export function seedArrayCarrier() {
  return {
    seed: "array-carrier",
    preferSeed: true,
    arrayCarrier: true,
    cue: "hit",
  };
}

export function seedPlainString() {
  return {
    seed: "plain-string",
    preferSeed: true,
    plainString: true,
    cue: "flattened",
  };
}

export function seedCacheControl() {
  return {
    seed: "cache-control",
    preferSeed: true,
    cacheControl: true,
    cue: "hit",
  };
}

export function seedPrefixBust() {
  return {
    seed: "prefix-bust",
    preferSeed: true,
    prefixBust: true,
    cue: "flattened",
  };
}

export function seedRewrite() {
  return {
    seed: "rewrite",
    preferSeed: true,
    rewrite: true,
    cue: "flattened",
  };
}

export function seedSessionStart() {
  return {
    seed: "session-start",
    preferSeed: true,
    sessionStart: true,
    cue: "flattened",
  };
}

export function seedEnvironment() {
  return {
    seed: "environment",
    preferSeed: true,
    environment: true,
    cue: "flattened",
  };
}

export function seedBackgroundFork() {
  return {
    seed: "background-fork",
    preferSeed: true,
    backgroundFork: true,
    cue: "flattened",
  };
}

export function seedProbe() {
  return {
    seed: "probe",
    preferSeed: true,
    probe: true,
    cue: "flattened",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      hit: false,
      flattened: false,
      stringCarrier: false,
      resume: false,
      fable: false,
      opus: false,
      arrayCarrier: false,
      plainString: false,
      cacheControl: false,
      cacheControlDropped: false,
      prefixBust: false,
      floorStuck: false,
      rewrite: false,
      sessionStart: false,
      environment: false,
      backgroundFork: false,
      probe: false,
      opusHit: false,
      fableMiss: false,
      contentShape: null,
      contentLength: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    hit: raw.hit === true,
    flattened: raw.flattened === true,
    stringCarrier:
      raw.stringCarrier === true ||
      raw.plainString === true ||
      raw.carrier === "STRING" ||
      raw.contentShape === "STRING" ||
      raw.event === "string-carrier",
    resume: raw.resume === true,
    fable:
      raw.fable === true ||
      raw.model === "fable" ||
      raw.model === MODEL_FABLE ||
      raw.model === "fable 5.1",
    opus: raw.opus === true || raw.model === "opus",
    arrayCarrier:
      raw.arrayCarrier === true ||
      raw.carrier === "ARRAY" ||
      raw.contentShape === "ARRAY",
    plainString: raw.plainString === true || raw.contentShape === "STRING",
    cacheControl: raw.cacheControl === true || raw.cacheControlPresent === true,
    cacheControlDropped:
      raw.cacheControlDropped === true || raw.noCacheControl === true,
    prefixBust: raw.prefixBust === true || raw.prefixMiss === true,
    floorStuck: raw.floorStuck === true || raw.cacheReadFloor === true,
    rewrite: raw.rewrite === true || raw.cacheCreationRest === true,
    sessionStart: raw.sessionStart === true,
    environment: raw.environment === true,
    backgroundFork: raw.backgroundFork === true,
    probe: raw.probe === true,
    opusHit: raw.opusHit === true,
    fableMiss: raw.fableMiss === true,
    contentShape: raw.contentShape == null ? null : raw.contentShape,
    contentLength: raw.contentLength == null ? null : raw.contentLength,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.hit != null ||
        ticket.flattened != null ||
        ticket.stringCarrier != null ||
        ticket.resume != null ||
        ticket.fable != null ||
        ticket.opus != null ||
        ticket.arrayCarrier != null ||
        ticket.plainString != null ||
        ticket.cacheControl != null ||
        ticket.cacheControlDropped != null ||
        ticket.prefixBust != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isHit(row) {
  if (row.flattened && row.cue !== "hit") return false;
  if (
    row.cue === "flattened" ||
    row.cue === "cachet" ||
    row.cue === "string-carrier"
  ) {
    return false;
  }
  if (row.stringCarrier && row.cue !== "hit" && row.opus !== true) return false;
  if (row.plainString && row.cue !== "hit" && row.opus !== true) return false;
  if (row.prefixBust && row.cue !== "hit" && row.opus !== true) return false;
  if (row.opus === true || row.opusHit === true) return true;
  if (
    row.hit === true &&
    row.flattened !== true &&
    row.cue !== "flattened"
  ) {
    return true;
  }
  if (
    row.cue === "hit" &&
    row.flattened !== true &&
    row.stringCarrier !== true &&
    row.plainString !== true &&
    row.prefixBust !== true
  ) {
    return true;
  }
  if (
    row.arrayCarrier === true &&
    row.cacheControl === true &&
    row.flattened !== true &&
    row.stringCarrier !== true
  ) {
    return true;
  }
  return false;
}

function isFlattened(row) {
  if (isHit(row)) return false;
  if (row.cue === "flattened" || row.cue === "cachet") return true;
  if (row.flattened === true) return true;
  if (
    row.stringCarrier === true ||
    row.plainString === true ||
    row.prefixBust === true ||
    (row.resume === true && row.fable === true && row.opus !== true)
  ) {
    return true;
  }
  if (
    row.fable &&
    row.resume &&
    (row.cacheControlDropped || row.floorStuck || row.rewrite || row.fableMiss)
  ) {
    return true;
  }
  return false;
}

function isStringCarrierPath(row) {
  return (
    row.event === "string-carrier" &&
    !isHit(row) &&
    (row.flattened === true ||
      row.stringCarrier === true ||
      row.plainString === true)
  );
}

/**
 * Score one blotter-desk pass against the cachet booth.
 * hit: fresh+resume keep block carrier + cache_control; prefix matches.
 * flattened: Fable resume stringifies messages[1], drops cache_control.
 * string-carrier: named path — resume replays session-start as a plain string.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isStringCarrierPath(row) ||
    (row.stringCarrier && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "string-carrier";
  } else if (isFlattened(row)) {
    verdict = "flattened";
  } else if (isHit(row)) {
    verdict = "hit";
  } else if (
    row.stringCarrier ||
    row.plainString ||
    row.prefixBust ||
    row.cacheControlDropped ||
    (row.resume && row.fable)
  ) {
    verdict = "flattened";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const carrier = inspectCarrier(row);
  const cacheControl = inspectCacheControl(row);
  const prefix = inspectPrefix(row);
  const model = inspectModel(row);
  const meters = inspectMeters(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    hit: verdict === "hit" || verdict === "hold",
    flattened:
      verdict === "flattened" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    stringCarrier:
      row.stringCarrier === true ||
      verdict === "string-carrier" ||
      verdict === PATH_WORD,
    resume: row.resume,
    fable: row.fable,
    opus: row.opus,
    arrayCarrier: row.arrayCarrier,
    plainString: row.plainString,
    cacheControl: row.cacheControl,
    cacheControlDropped: row.cacheControlDropped,
    prefixBust: row.prefixBust,
    floorStuck: row.floorStuck,
    rewrite: row.rewrite,
    sessionStart: row.sessionStart,
    environment: row.environment,
    backgroundFork: row.backgroundFork,
    probe: row.probe,
    opusHit: row.opusHit,
    fableMiss: row.fableMiss,
    contentShape: row.contentShape,
    contentLength: row.contentLength,
    cue: hold ? "hit" : "flattened",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit hit" : "score cachet",
    carrier,
    cacheControlInspect: cacheControl,
    prefix,
    model,
    meters,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : CACHET_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const flattened = scored.filter((row) => row.verdict === "flattened");
  const path = scored.filter((row) => row.verdict === "string-carrier");
  const hit = scored.filter((row) => row.verdict === "hit");
  const headline =
    scored.find((row) => row.event === "plain-string") ||
    scored.find((row) => row.event === "prefix-bust") ||
    scored.find((row) => row.event === "string-carrier") ||
    flattened[flattened.length - 1];
  let verdict = "hit";
  if (flattened.length) verdict = "flattened";
  else if (path.length && !hit.length) verdict = "string-carrier";
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
    flattenedCount: flattened.length,
    pathCount: path.length,
    hitCount: hit.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit hit" : "score cachet",
    note: headline
      ? "Claude Code 2.1.268 Fable 5.1; every --resume (headless and interactive) re-writes the conversation; messages[1] is ARRAY+cache_control on fresh start and a PLAIN STRING on resume; opus --resume still hits."
      : "published cachet walk scored against hit vs flattened",
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
    seeded !== "hit" &&
    seeded !== "flattened" &&
    seeded !== "string-carrier" &&
    seeded !== "cachet" &&
    ticket.hit == null &&
    ticket.flattened == null &&
    ticket.stringCarrier == null &&
    ticket.resume == null &&
    ticket.plainString == null &&
    ticket.prefixBust == null &&
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
    hit: scored.hit ?? false,
    flattened: scored.flattened ?? false,
    stringCarrier: scored.stringCarrier ?? false,
    resume: scored.resume ?? false,
    fable: scored.fable ?? false,
    opus: scored.opus ?? false,
    arrayCarrier: scored.arrayCarrier ?? false,
    plainString: scored.plainString ?? false,
    cacheControl: scored.cacheControl ?? false,
    cacheControlDropped: scored.cacheControlDropped ?? false,
    prefixBust: scored.prefixBust ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.resume ? "path=resume" : "path=fresh",
    result.stringCarrier || result.plainString
      ? "carrier=STRING"
      : "carrier=ARRAY",
    result.cacheControlDropped ? "cache_control=dropped" : "cache_control=ephemeral",
    result.prefixBust ? "prefix=bust" : "prefix=match",
    result.fable && !result.opus ? "model=fable" : result.opus ? "model=opus" : "model=idle",
    result.cue === "hit" ? "cue=hit" : "cue=flattened",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const folio = readFolio({
    hit: result.hit,
    flattened: result.flattened,
    stringCarrier: result.stringCarrier,
    resume: result.resume,
    fable: result.fable,
    opus: result.opus,
    arrayCarrier: result.arrayCarrier,
    plainString: result.plainString,
    cacheControl: result.cacheControl,
    cacheControlDropped: result.cacheControlDropped,
    prefixBust: result.prefixBust,
    floorStuck: result.floorStuck,
    rewrite: result.rewrite,
    opusHit: result.opusHit,
    fableMiss: result.fableMiss,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    folio,
    carrier: inspectCarrier({
      hit: result.hit,
      flattened: result.flattened,
      stringCarrier: result.stringCarrier,
      resume: result.resume,
      arrayCarrier: result.arrayCarrier,
      plainString: result.plainString,
      fable: result.fable,
    }),
    cacheControl: inspectCacheControl({
      hit: result.hit,
      cacheControl: result.cacheControl,
      cacheControlDropped: result.cacheControlDropped,
      stringCarrier: result.stringCarrier,
      plainString: result.plainString,
    }),
    prefix: inspectPrefix({
      hit: result.hit,
      prefixBust: result.prefixBust,
      stringCarrier: result.stringCarrier,
      plainString: result.plainString,
    }),
    model: inspectModel({
      hit: result.hit,
      flattened: result.flattened,
      resume: result.resume,
      fable: result.fable,
      opus: result.opus,
      opusHit: result.opusHit,
      fableMiss: result.fableMiss,
      stringCarrier: result.stringCarrier,
    }),
    meters: inspectMeters({
      hit: result.hit,
      flattened: result.flattened,
      stringCarrier: result.stringCarrier,
      floorStuck: result.floorStuck,
      rewrite: result.rewrite,
      opusHit: result.opusHit,
    }),
    stations: DESK_STATIONS.map((row) => ({
      ...row,
      flattened: result.flattened === true || result.verdict === "flattened",
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
      modelFable: MODEL_FABLE,
      modelOpus: MODEL_OPUS,
      sessionKind: SESSION_KIND,
      platform: PLATFORM,
      terminal: TERMINAL,
      messageIndex: MESSAGE_INDEX,
      messageRole: MESSAGE_ROLE,
      sessionStart: SESSION_START,
      contentLength: CONTENT_LENGTH,
      cacheControl: { ...CACHE_CONTROL },
      freshCarrier: FRESH_CARRIER,
      resumeCarrier: RESUME_CARRIER,
      probeTokens: PROBE_TOKENS,
      realRewriteRead: REAL_REWRITE_READ,
      realRewriteWrite: REAL_REWRITE_WRITE,
      crossHitRead: CROSS_HIT_READ,
      crossHitWrite: CROSS_HIT_WRITE,
      fableDocs: FABLE_DOCS,
      stations: DESK_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "a rebuilt history reproduces the request that was already sent, byte for byte, same carrier, same block shape, same cache_control",
        "Fable --resume keeps messages[1] as ARRAY with one text block + cache_control {type: ephemeral, ttl: 1h}",
        "cache_read on --resume moves past the tools+system floor the way opus --resume already does",
        "the prompt-cache prefix keeps matching after the session-start context message",
      ],
      hypothesis:
        "NON-BINDING: Fable 5.1 resume may flatten messages[1] from ARRAY+cache_control to a plain string, so the prompt-cache prefix stops matching and the folio is rewritten. Opus --resume still hits. Two fresh launches 30s apart hit each others cache completely, so this is not TTL/settings/hooks. Fable 5.1 docs note editing earlier turns invalidates thinking blocks — related platform constraint, cite only. Verify against #93490 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
