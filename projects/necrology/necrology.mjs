#!/usr/bin/env node
/**
 * Necrology — parish necrology / death-register / sexton-desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * while switching an image-generation pipeline to a newly released
 * provider model (released 3 days prior), Claude Code (claude-fable-5)
 * fetched the provider's public /models listing once — the first
 * attempt returned non-JSON and was retried — did not find the model
 * id, and then told the user the model "does not exist on this
 * provider" inside a blocking multiple-choice question, offering three
 * older models as the only options. The user had to disprove it with a
 * screenshot of the provider's own model page; a follow-up
 * authenticated request to the provider's per-model endpoint resolved
 * the id immediately.
 *
 *   node necrology.mjs data/necrologized.json
 *   echo '{"seed":"necrologized"}' | node necrology.mjs
 *
 * Idle word is attested (HOLD: model presence confirmed / cross-checked
 * before any non-existence claim).
 * Seeded word is necrologized (#93774 — declared dead / "does not
 * exist" after one incomplete listing).
 * Path word is incomplete-listing.
 * Product score word is necrology (Score necrology or admit attested.).
 *
 * Encoded from anthropics/claude-code#93774 issue text only.
 * Hypothesis (NON-BINDING): after a malformed or incomplete /models
 * listing, refuse to assert non-existence until an authenticated
 * per-model check (or user confirmation) runs — especially for models
 * released in the last few days. Verify against #93774 text only. Do
 * NOT claim a root cause in Claude Code source you have not seen. Do
 * NOT implement a fix. No network. No exploits. No live Claude. No
 * secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "hold",
  "malformed-then-retry",
  "blocking-choice",
  "three-older",
  "recent-release",
  "screenshot-disprove",
  "per-model-resolve",
  "cross-check",
  "absent-not-dead",
  "non-json-first",
  "does-not-exist",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "attested";
export const PATH_WORD = "incomplete-listing";
export const SEEDED_WORD = "necrologized";
export const PRODUCT_WORD = "necrology";
export const HOLD = Object.freeze(["attested", "hold"]);
export const RECOVER = Object.freeze(["attested", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "intact",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "necrologized" && name !== "necrology"),
);

export const FEATURED_ISSUE = 93774;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93774";
export const TITLE =
  'Model asserts a provider model "does not exist" after one incomplete API listing instead of cross-checking';
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "area:model", "area:providers"]);
export const PLATFORM = "cli";
export const CLAUDE_VERSION = "claude-fable-5";
export const SURFACE = "Claude Code CLI";
export const LISTING_ENDPOINT = "/models";
export const FIRST_ATTEMPT = "non-JSON";
export const ASSERTION = "does not exist on this provider";
export const OLDER_OPTIONS = 3;
export const RELEASE_LAG_DAYS = 3;
export const PIPELINE = "image-generation";
export const DISPROOF = "screenshot of the provider's own model page";
export const RESOLVE_PATH = "authenticated per-model endpoint";
export const PHRASE = "Score necrology or admit attested.";
export const DISTRIBUTION =
  "While switching an image-generation pipeline to a newly released provider model (released 3 days prior), Claude Code (claude-fable-5) fetched the provider's public /models listing once — the first attempt returned non-JSON and was retried — did not find the model id, and then told the user the model \"does not exist on this provider\" inside a blocking multiple-choice question, offering three older models as the only options. The user had to disprove it with a screenshot of the provider's own model page; a follow-up authenticated request to the provider's per-model endpoint resolved the id immediately. Expected: treat \"absent from one listing response\" as \"not found via this endpoint\" and cross-check (authenticated/per-model endpoint, web search, or ask the user what they saw) before asserting non-existence — especially for very recent releases, and especially when the same endpoint had just returned a malformed response in the same session.";
export const SESSION_KIND =
  "Claude Code CLI, model claude-fable-5. Public /models listing fetched once; first attempt non-JSON then retried; model id absent; blocking multiple-choice asserts non-existence and offers three older models. Authenticated per-model endpoint later resolves the id.";
export const RULED_OUT = Object.freeze([
  "hardcoded /v1/models discovery path (#91161)",
  "offline discoverable model-list fallback (#84159)",
  "gateway capability discovery / stale selection (#88345)",
  "gateway model-discovery pricing ignored by /usage (#88659)",
  "invalid model name for Fable (#90591)",
]);
export const EXPECTED = Object.freeze([
  'treat "absent from one listing response" as "not found via this endpoint"',
  "cross-check (authenticated/per-model endpoint, web search, or ask the user what they saw) before asserting non-existence",
  "especially for very recent releases",
  "especially when the same endpoint had just returned a malformed response in the same session",
]);

export const NECROLOGY_FOLIOS = Object.freeze([
  { id: "census", label: "living census", count: "incomplete", note: "one /models listing" },
  { id: "register", label: "death register", count: "entered", note: "declared does not exist" },
  { id: "visitation", label: "parish visitation", count: "unrun", note: "per-model not tried first" },
  { id: "question", label: "sexton question", count: "blocking", note: "three older models only" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "census-folio",
    survey: "read the public /models census of the living",
    kind: "census",
    note: "seeded: one listing; first attempt returned non-JSON and was retried",
  },
  {
    id: "death-register",
    survey: "open the parish necrology / death register",
    kind: "register",
    note: "seeded: still-living model entered as does not exist",
  },
  {
    id: "sexton-question",
    survey: "face the blocking multiple-choice",
    kind: "question",
    note: "seeded: three older models as the only options",
  },
  {
    id: "visitation-ribbon",
    survey: "walk the authenticated per-model visitation",
    kind: "visitation",
    note: "seeded: visitation was not run before the death entry",
  },
  {
    id: "cross-check-folio",
    survey: "demand a second witness before the roll is sealed",
    kind: "cross-check",
    note: "seeded: screenshot and per-model resolve came only after the user was blocked",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "incomplete-listing",
  "necrologized",
  "malformed-then-retry",
  "blocking-choice",
  "three-older",
  "recent-release",
  "screenshot-disprove",
  "per-model-resolve",
  "cross-check",
  "absent-not-dead",
  "does-not-exist",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91161,
    title: "configurable model-discovery endpoint (hardcoded /v1/models)",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91161 third-party inference hardcoded /v1/models discovery. Related provider listing noise, not incomplete-listing→false non-existence. Do not rebuild",
  },
  {
    issue: 84159,
    title: "discoverable model list with offline fallback",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #84159 discoverable model list / offline fallback. Related model enumeration, not one incomplete listing asserted as death. Do not rebuild",
  },
  {
    issue: 88345,
    title: "gateway capability discovery / stale model selection",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #88345 gateway capability discovery and stale selection. Related provider discovery, not the death-roll assertion. Do not rebuild",
  },
  {
    issue: 88659,
    title: "gateway model discovery pricing ignored by /usage",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #88659 gateway model-discovery pricing ignored by /usage. Related discovery, different surface. Do not rebuild",
  },
  {
    issue: 90591,
    title: "Invalid Model Name for Fable",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #90591 invalid model name for Fable. Related model-name noise, not incomplete-listing→does not exist. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93766,
    title: "OneDrive musl/glibc false error",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93764,
    title: "DECSTBM blank rows",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93754,
    title: "remoteControlAtStartup toggle",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93751,
    title: "phantom Chrome",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93744,
    title: "/goal Stop evaluator blind",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93772,
    title: "diagram→section poster",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93770,
    title: "TUI copy padding artifacts",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "palimpsest",
  "oubliette",
  "ephemera",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
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
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "homonym",
]);

export const SAMPLE_LISTING = Object.freeze({
  endpoint: LISTING_ENDPOINT,
  attempts: 2,
  firstAttempt: FIRST_ATTEMPT,
  retried: true,
  found: false,
  complete: false,
});

export const SAMPLE_ATTESTED_LISTING = Object.freeze({
  endpoint: LISTING_ENDPOINT,
  attempts: 1,
  firstAttempt: "json",
  retried: false,
  found: true,
  complete: true,
});

export const SAMPLE_REGISTER = Object.freeze({
  entered: true,
  assertion: ASSERTION,
  living: true,
});

export const SAMPLE_ATTESTED_REGISTER = Object.freeze({
  entered: false,
  assertion: null,
  living: true,
});

export const SAMPLE_QUESTION = Object.freeze({
  blocking: true,
  options: OLDER_OPTIONS,
  olderOnly: true,
});

export const SAMPLE_ATTESTED_QUESTION = Object.freeze({
  blocking: false,
  options: 0,
  olderOnly: false,
});

export const SAMPLE_VISITATION = Object.freeze({
  run: false,
  resolved: false,
  path: RESOLVE_PATH,
});

export const SAMPLE_ATTESTED_VISITATION = Object.freeze({
  run: true,
  resolved: true,
  path: RESOLVE_PATH,
});

export const SAMPLE_CROSS = Object.freeze({
  done: false,
  screenshot: false,
  perModel: false,
});

export const SAMPLE_ATTESTED_CROSS = Object.freeze({
  done: true,
  screenshot: false,
  perModel: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "sexton holds the roll until presence is attested; no death entry without a second witness" },
  { t: "malformed-then-retry", line: "public /models census returns non-JSON on the first attempt and is retried" },
  { t: "incomplete-listing", line: "retried listing still does not find the model id — one incomplete census" },
  { t: "recent-release", line: "the model was released 3 days prior — a very recent living name" },
  { t: "does-not-exist", line: "the sexton writes does not exist on this provider onto the death register" },
  { t: "blocking-choice", line: "a blocking multiple-choice question locks the desk" },
  { t: "three-older", line: "three older models are offered as the only options" },
  { t: "screenshot-disprove", line: "the user disproves the death entry with a screenshot of the provider's own model page" },
  { t: "per-model-resolve", line: "an authenticated per-model visitation resolves the id immediately" },
  { t: "cross-check", line: "cross-check (per-model, web search, or ask the user) was required before the assertion" },
  { t: "absent-not-dead", line: "absent from one listing is not found via this endpoint — not a death" },
  { t: "path", line: "incomplete-listing — one torn census page became the whole roll" },
  { t: "score", line: "when the living are entered dead the booth is necrology — Score necrology or admit attested." },
]);

export function inspectListing(input = {}) {
  const listing =
    input.listing && typeof input.listing === "object"
      ? input.listing
      : input.attested === true && input.necrologized !== true
        ? SAMPLE_ATTESTED_LISTING
        : SAMPLE_LISTING;
  const forcedIncomplete =
    input.incompleteListing === true ||
    input.event === "incomplete-listing" ||
    input.event === "necrologized" ||
    input.event === "necrology" ||
    input.event === "malformed-then-retry" ||
    input.event === "non-json-first";
  const complete = forcedIncomplete ? false : listing.complete === true && input.necrologized !== true;
  return {
    endpoint: LISTING_ENDPOINT,
    attempts: complete ? 1 : listing.attempts || 2,
    firstAttempt: complete ? "json" : listing.firstAttempt || FIRST_ATTEMPT,
    retried: !complete,
    found: complete,
    complete,
    stamp: complete ? "census-complete" : "census-incomplete",
    note: complete
      ? "public /models census is complete and the living name is on it"
      : "one incomplete /models census — first attempt non-JSON, retried, id still absent",
  };
}

export function inspectRegister(input = {}) {
  const register =
    input.register && typeof input.register === "object"
      ? input.register
      : input.attested === true && input.necrologized !== true
        ? SAMPLE_ATTESTED_REGISTER
        : SAMPLE_REGISTER;
  const forcedDead =
    input.necrologized === true ||
    input.doesNotExist === true ||
    input.event === "necrologized" ||
    input.event === "necrology" ||
    input.event === "does-not-exist";
  const entered = forcedDead ? true : register.entered === true && input.attested !== true;
  return {
    entered,
    assertion: entered ? ASSERTION : null,
    living: true,
    stamp: entered ? "register-entered" : "register-clear",
    note: entered
      ? "still-living model entered on the death register as does not exist"
      : "death register stays clear until presence is attested",
  };
}

export function inspectQuestion(input = {}) {
  const question =
    input.question && typeof input.question === "object"
      ? input.question
      : input.attested === true && input.necrologized !== true
        ? SAMPLE_ATTESTED_QUESTION
        : SAMPLE_QUESTION;
  const forcedBlock =
    input.blockingChoice === true ||
    input.event === "blocking-choice" ||
    input.event === "three-older" ||
    (input.necrologized === true && input.attested !== true);
  const blocking = forcedBlock ? true : question.blocking === true;
  return {
    blocking,
    options: blocking ? OLDER_OPTIONS : 0,
    olderOnly: blocking,
    stamp: blocking ? "question-blocking" : "question-open",
    note: blocking
      ? "blocking multiple-choice offers three older models as the only options"
      : "no blocking question — the living name may still be named",
  };
}

export function inspectVisitation(input = {}) {
  const visitation =
    input.visitation && typeof input.visitation === "object"
      ? input.visitation
      : input.attested === true && input.necrologized !== true
        ? SAMPLE_ATTESTED_VISITATION
        : SAMPLE_VISITATION;
  const forcedUnrun =
    input.perModelResolve === true ||
    input.event === "per-model-resolve" ||
    input.event === "incomplete-listing" ||
    (input.necrologized === true && input.attested !== true);
  const run = forcedUnrun ? false : visitation.run === true;
  return {
    run,
    resolved: run,
    path: RESOLVE_PATH,
    stamp: run ? "visitation-run" : "visitation-unrun",
    note: run
      ? "authenticated per-model visitation resolved the id before any death claim"
      : "parish visitation was not walked before the death entry",
  };
}

export function inspectCross(input = {}) {
  const cross =
    input.cross && typeof input.cross === "object"
      ? input.cross
      : input.attested === true && input.necrologized !== true
        ? SAMPLE_ATTESTED_CROSS
        : SAMPLE_CROSS;
  const forcedSkip =
    input.crossCheck === true ||
    input.event === "cross-check" ||
    input.event === "screenshot-disprove" ||
    (input.necrologized === true && input.attested !== true);
  const done = forcedSkip ? false : cross.done === true;
  return {
    done,
    screenshot: done ? cross.screenshot === true : false,
    perModel: done,
    stamp: done ? "cross-done" : "cross-skipped",
    note: done
      ? "second witness taken before any non-existence claim"
      : "no cross-check — screenshot and per-model resolve came only after the block",
  };
}

export function readBooth(input = {}) {
  const listing = inspectListing(input);
  const register = inspectRegister(input);
  const question = inspectQuestion(input);
  const visitation = inspectVisitation(input);
  const cross = inspectCross(input);
  const necrologized =
    input.attested !== true &&
    ((register.entered && !listing.complete) ||
      (question.blocking && !cross.done) ||
      input.necrologized === true);
  const attested = input.attested === true && necrologized !== true && listing.complete;
  const path =
    !listing.complete &&
    (input.event === "incomplete-listing" || input.incompleteListing === true);
  return {
    listing,
    register,
    question,
    visitation,
    cross,
    folios: NECROLOGY_FOLIOS,
    stations: BOOTH_STATIONS,
    necrologized: necrologized && !attested && !path,
    attested:
      attested ||
      (listing.complete &&
        !register.entered &&
        input.necrologized !== true &&
        input.incompleteListing !== true),
    incompleteListing: path && !attested,
    mark:
      path && !attested
        ? "incomplete-listing"
        : necrologized && !attested
          ? "necrologized"
          : "attested",
  };
}

/**
 * Published necrology walk from #93774 only. Facts from the issue text.
 * An attested booth cross-checks before any non-existence claim.
 * A necrologized booth enters a still-living model on the death roll
 * after one incomplete listing.
 * An incomplete-listing booth names the torn-census path.
 */
export const NECROLOGY_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-attested",
    attested: true,
    necrologized: false,
    cue: "attested",
    note: "idle HOLD: model presence confirmed / cross-checked before any non-existence claim",
  },
  {
    t: "malformed-then-retry",
    event: "malformed-then-retry",
    necrologized: true,
    malformedThenRetry: true,
    cue: "necrologized",
    note: "public /models listing — first attempt returned non-JSON and was retried",
  },
  {
    t: "non-json-first",
    event: "non-json-first",
    necrologized: true,
    nonJsonFirst: true,
    cue: "necrologized",
    note: "first attempt returned non-JSON",
  },
  {
    t: "path",
    event: "incomplete-listing",
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    cue: "necrologized",
    note: "one incomplete listing — id not found after the retry",
  },
  {
    t: "recent-release",
    event: "recent-release",
    necrologized: true,
    recentRelease: true,
    cue: "necrologized",
    note: "newly released provider model (released 3 days prior)",
  },
  {
    t: "does-not-exist",
    event: "does-not-exist",
    necrologized: true,
    doesNotExist: true,
    cue: "necrologized",
    note: "told the user the model does not exist on this provider",
  },
  {
    t: "blocking-choice",
    event: "blocking-choice",
    necrologized: true,
    blockingChoice: true,
    cue: "necrologized",
    note: "assertion inside a blocking multiple-choice question",
  },
  {
    t: "three-older",
    event: "three-older",
    necrologized: true,
    threeOlder: true,
    cue: "necrologized",
    note: "three older models as the only options",
  },
  {
    t: "screenshot-disprove",
    event: "screenshot-disprove",
    necrologized: true,
    screenshotDisprove: true,
    cue: "necrologized",
    note: "user disproved it with a screenshot of the provider's own model page",
  },
  {
    t: "per-model-resolve",
    event: "per-model-resolve",
    necrologized: true,
    perModelResolve: true,
    cue: "necrologized",
    note: "authenticated per-model endpoint resolved the id immediately",
  },
  {
    t: "cross-check",
    event: "cross-check",
    necrologized: true,
    crossCheck: true,
    cue: "necrologized",
    note: "cross-check was required before asserting non-existence",
  },
  {
    t: "path",
    event: "incomplete-listing",
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    doesNotExist: true,
    cue: "necrologized",
    note: "incomplete-listing — one torn census page became the whole roll",
  },
  {
    t: "score",
    event: "necrology",
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    blockingChoice: true,
    threeOlder: true,
    recentRelease: true,
    screenshotDisprove: true,
    perModelResolve: true,
    crossCheck: true,
    absentNotDead: true,
    nonJsonFirst: true,
    doesNotExist: true,
    cue: "necrologized",
    note: "necrology — when the living are entered dead the booth never stays attested",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cross-check",
    attested: true,
    crossCheck: false,
    cue: "attested",
    note: "positive control: treat absent from one listing as not found via this endpoint and cross-check",
  },
  {
    t: "announce",
    event: "cue-attested",
    attested: true,
    cue: "attested",
    note: "positive control: authenticated per-model visitation attests the living name",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    attested: true,
    necrologized: false,
    crossCheck: true,
    cue: "attested",
  };
}

export function seedAttested() {
  return { ...emptyTicket() };
}

export function seedNecrologized() {
  return {
    seed: SEEDED_WORD,
    attested: false,
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    blockingChoice: true,
    threeOlder: true,
    recentRelease: true,
    screenshotDisprove: true,
    perModelResolve: true,
    crossCheck: true,
    absentNotDead: true,
    nonJsonFirst: true,
    doesNotExist: true,
    cue: "necrologized",
    issue: FEATURED_ISSUE,
    listing: SAMPLE_LISTING,
    register: SAMPLE_REGISTER,
    question: SAMPLE_QUESTION,
    visitation: SAMPLE_VISITATION,
    cross: SAMPLE_CROSS,
  };
}

export function seedNecrology() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    blockingChoice: true,
    threeOlder: true,
    recentRelease: true,
    screenshotDisprove: true,
    perModelResolve: true,
    crossCheck: true,
    absentNotDead: true,
    nonJsonFirst: true,
    doesNotExist: true,
    cue: "necrologized",
  };
}

export function seedIncompleteListing() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    event: "incomplete-listing",
    cue: "necrologized",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    attested: true,
    cue: "attested",
  };
}

export function seedMalformedThenRetry() {
  return {
    seed: "malformed-then-retry",
    preferSeed: true,
    malformedThenRetry: true,
    cue: "necrologized",
  };
}

export function seedBlockingChoice() {
  return {
    seed: "blocking-choice",
    preferSeed: true,
    blockingChoice: true,
    cue: "necrologized",
  };
}

export function seedThreeOlder() {
  return {
    seed: "three-older",
    preferSeed: true,
    threeOlder: true,
    cue: "necrologized",
  };
}

export function seedRecentRelease() {
  return {
    seed: "recent-release",
    preferSeed: true,
    recentRelease: true,
    cue: "necrologized",
  };
}

export function seedScreenshotDisprove() {
  return {
    seed: "screenshot-disprove",
    preferSeed: true,
    screenshotDisprove: true,
    cue: "necrologized",
  };
}

export function seedPerModelResolve() {
  return {
    seed: "per-model-resolve",
    preferSeed: true,
    perModelResolve: true,
    cue: "necrologized",
  };
}

export function seedCrossCheck() {
  return {
    seed: "cross-check",
    preferSeed: true,
    crossCheck: true,
    cue: "necrologized",
  };
}

export function seedAbsentNotDead() {
  return {
    seed: "absent-not-dead",
    preferSeed: true,
    absentNotDead: true,
    cue: "necrologized",
  };
}

export function seedNonJsonFirst() {
  return {
    seed: "non-json-first",
    preferSeed: true,
    nonJsonFirst: true,
    cue: "necrologized",
  };
}

export function seedDoesNotExist() {
  return {
    seed: "does-not-exist",
    preferSeed: true,
    doesNotExist: true,
    cue: "necrologized",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      attested: false,
      necrologized: false,
      incompleteListing: false,
      malformedThenRetry: false,
      blockingChoice: false,
      threeOlder: false,
      recentRelease: false,
      screenshotDisprove: false,
      perModelResolve: false,
      crossCheck: false,
      absentNotDead: false,
      nonJsonFirst: false,
      doesNotExist: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    attested: raw.attested === true,
    necrologized:
      raw.necrologized === true ||
      raw.event === "necrologized" ||
      raw.event === "necrology",
    incompleteListing:
      raw.incompleteListing === true || raw.event === "incomplete-listing",
    malformedThenRetry:
      raw.malformedThenRetry === true || raw.event === "malformed-then-retry",
    blockingChoice:
      raw.blockingChoice === true || raw.event === "blocking-choice",
    threeOlder: raw.threeOlder === true || raw.event === "three-older",
    recentRelease: raw.recentRelease === true || raw.event === "recent-release",
    screenshotDisprove:
      raw.screenshotDisprove === true || raw.event === "screenshot-disprove",
    perModelResolve:
      raw.perModelResolve === true || raw.event === "per-model-resolve",
    crossCheck: raw.crossCheck === true || raw.event === "cross-check",
    absentNotDead: raw.absentNotDead === true || raw.event === "absent-not-dead",
    nonJsonFirst: raw.nonJsonFirst === true || raw.event === "non-json-first",
    doesNotExist: raw.doesNotExist === true || raw.event === "does-not-exist",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    listing: raw.listing,
    register: raw.register,
    question: raw.question,
    visitation: raw.visitation,
    cross: raw.cross,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.attested != null ||
        ticket.necrologized != null ||
        ticket.incompleteListing != null ||
        ticket.malformedThenRetry != null ||
        ticket.doesNotExist != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.listing ||
        ticket.register ||
        ticket.question),
  );
}

function isAttested(row) {
  if (row.necrologized && row.cue !== "attested") return false;
  if (
    row.cue === "necrologized" ||
    row.cue === "necrology" ||
    row.cue === "incomplete-listing"
  ) {
    return false;
  }
  if (
    row.incompleteListing &&
    row.doesNotExist &&
    row.cue !== "attested" &&
    row.attested !== true
  ) {
    return false;
  }
  if (
    row.incompleteListing &&
    row.malformedThenRetry &&
    row.cue !== "attested" &&
    row.attested !== true
  ) {
    return false;
  }
  if (row.attested === true && row.necrologized !== true && row.cue !== "necrologized") {
    return true;
  }
  if (
    row.cue === "attested" &&
    row.necrologized !== true &&
    row.incompleteListing !== true &&
    row.doesNotExist !== true
  ) {
    return true;
  }
  return false;
}

function isIncompleteListingPath(row) {
  return (
    row.event === "incomplete-listing" &&
    !isAttested(row) &&
    (row.incompleteListing === true ||
      row.malformedThenRetry === true ||
      row.nonJsonFirst === true)
  );
}

function isNecrologized(row) {
  if (isAttested(row)) return false;
  if (isIncompleteListingPath(row) && row.cue !== "necrologized") return false;
  if (row.cue === "necrologized" || row.cue === "necrology") return true;
  if (row.necrologized === true) return true;
  if (
    row.incompleteListing === true &&
    row.doesNotExist === true &&
    row.blockingChoice === true
  ) {
    return true;
  }
  if (row.incompleteListing === true && row.doesNotExist === true) {
    return true;
  }
  if (
    row.malformedThenRetry === true ||
    row.blockingChoice === true ||
    row.threeOlder === true ||
    (row.incompleteListing === true && row.nonJsonFirst === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one necrology pass against the sexton desk.
 * attested: presence confirmed / cross-checked before any death claim.
 * necrologized / necrology: declared dead after one incomplete listing.
 * incomplete-listing: one torn census page treated as the whole roll.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isIncompleteListingPath(row) ||
    (row.incompleteListing && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "incomplete-listing";
  } else if (isNecrologized(row)) {
    verdict = "necrology";
  } else if (isAttested(row)) {
    verdict = "attested";
  } else if (
    row.incompleteListing ||
    row.malformedThenRetry ||
    row.doesNotExist ||
    (row.blockingChoice && !row.attested)
  ) {
    verdict = "necrology";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const listing = inspectListing(row);
  const register = inspectRegister(row);
  const question = inspectQuestion(row);
  const visitation = inspectVisitation(row);
  const cross = inspectCross(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    attested: verdict === "attested" || verdict === "hold",
    necrologized:
      verdict === "necrologized" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    incompleteListing:
      row.incompleteListing === true ||
      verdict === "incomplete-listing" ||
      verdict === PATH_WORD,
    malformedThenRetry: row.malformedThenRetry,
    blockingChoice: row.blockingChoice,
    threeOlder: row.threeOlder,
    recentRelease: row.recentRelease,
    screenshotDisprove: row.screenshotDisprove,
    perModelResolve: row.perModelResolve,
    crossCheck: row.crossCheck,
    absentNotDead: row.absentNotDead,
    nonJsonFirst: row.nonJsonFirst,
    doesNotExist: row.doesNotExist,
    cue: hold
      ? "attested"
      : row.incompleteListing || verdict === "incomplete-listing"
        ? "incomplete-listing"
        : "necrologized",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit attested" : "score necrology",
    listingInspect: listing,
    registerInspect: register,
    questionInspect: question,
    visitationInspect: visitation,
    crossInspect: cross,
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
      : NECROLOGY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "necrology" || row.verdict === "necrologized",
  );
  const path = scored.filter((row) => row.verdict === "incomplete-listing");
  const attested = scored.filter((row) => row.verdict === "attested");
  const headline =
    scored.find((row) => row.event === "necrologized") ||
    scored.find((row) => row.event === "incomplete-listing") ||
    scored.find((row) => row.event === "does-not-exist") ||
    dead[dead.length - 1];
  let verdict = "attested";
  if (dead.length) verdict = "necrology";
  else if (path.length && !attested.length) verdict = "incomplete-listing";
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
    necrologizedCount: dead.length,
    pathCount: path.length,
    attestedCount: attested.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit attested" : "score necrology",
    note: headline
      ? "One incomplete /models listing was treated as a death; the still-living model was entered on the necrology."
      : "published necrology walk scored against attested vs necrologized",
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
    seeded !== "attested" &&
    seeded !== "necrologized" &&
    seeded !== "incomplete-listing" &&
    seeded !== "necrology" &&
    ticket.attested == null &&
    ticket.necrologized == null &&
    ticket.incompleteListing == null &&
    ticket.doesNotExist == null &&
    ticket.malformedThenRetry == null &&
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
    attested: scored.attested ?? false,
    necrologized: scored.necrologized ?? false,
    incompleteListing: scored.incompleteListing ?? false,
    malformedThenRetry: scored.malformedThenRetry ?? false,
    blockingChoice: scored.blockingChoice ?? false,
    threeOlder: scored.threeOlder ?? false,
    recentRelease: scored.recentRelease ?? false,
    screenshotDisprove: scored.screenshotDisprove ?? false,
    perModelResolve: scored.perModelResolve ?? false,
    crossCheck: scored.crossCheck ?? false,
    absentNotDead: scored.absentNotDead ?? false,
    nonJsonFirst: scored.nonJsonFirst ?? false,
    doesNotExist: scored.doesNotExist ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.attested && !result.necrologized ? "register=clear" : "register=entered",
    result.incompleteListing || result.necrologized ? "census=incomplete" : "census=complete",
    result.malformedThenRetry || result.necrologized ? "first=non-json" : "first=json",
    result.blockingChoice || result.necrologized ? "question=blocking" : "question=open",
    result.incompleteListing || result.verdict === "incomplete-listing"
      ? "path=incomplete-listing"
      : "path=attested",
    result.cue === "attested"
      ? "cue=attested"
      : result.cue === "incomplete-listing"
        ? "cue=incomplete-listing"
        : "cue=necrologized",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    attested: result.attested,
    necrologized: result.necrologized,
    incompleteListing: result.incompleteListing,
    malformedThenRetry: result.malformedThenRetry,
    blockingChoice: result.blockingChoice,
    threeOlder: result.threeOlder,
    recentRelease: result.recentRelease,
    screenshotDisprove: result.screenshotDisprove,
    perModelResolve: result.perModelResolve,
    crossCheck: result.crossCheck,
    absentNotDead: result.absentNotDead,
    nonJsonFirst: result.nonJsonFirst,
    doesNotExist: result.doesNotExist,
    listing: input && input.listing,
    register: input && input.register,
    question: input && input.question,
    visitation: input && input.visitation,
    cross: input && input.cross,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    listing: inspectListing({
      attested: result.attested,
      necrologized: result.necrologized,
      incompleteListing: result.incompleteListing,
      listing: input && input.listing,
    }),
    register: inspectRegister({
      attested: result.attested,
      necrologized: result.necrologized,
      doesNotExist: result.doesNotExist,
      register: input && input.register,
    }),
    question: inspectQuestion({
      attested: result.attested,
      necrologized: result.necrologized,
      blockingChoice: result.blockingChoice,
      question: input && input.question,
    }),
    visitation: inspectVisitation({
      attested: result.attested,
      necrologized: result.necrologized,
      perModelResolve: result.perModelResolve,
      incompleteListing: result.incompleteListing,
      visitation: input && input.visitation,
    }),
    cross: inspectCross({
      attested: result.attested,
      necrologized: result.necrologized,
      crossCheck: result.crossCheck,
      screenshotDisprove: result.screenshotDisprove,
      cross: input && input.cross,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      necrologized:
        result.necrologized === true ||
        result.verdict === "necrologized" ||
        result.verdict === "necrology",
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
      listingEndpoint: LISTING_ENDPOINT,
      firstAttempt: FIRST_ATTEMPT,
      assertion: ASSERTION,
      olderOptions: OLDER_OPTIONS,
      releaseLagDays: RELEASE_LAG_DAYS,
      pipeline: PIPELINE,
      disproof: DISPROOF,
      resolvePath: RESOLVE_PATH,
      folios: NECROLOGY_FOLIOS,
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
        "NON-BINDING: after a malformed or incomplete /models listing, refuse to assert non-existence until an authenticated per-model check (or user confirmation) runs — especially for models released in the last few days. Invite verify against #93774 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
