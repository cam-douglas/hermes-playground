#!/usr/bin/env node
/**
 * Crasis — manuscript crasis / vowel-fusion / orthographic-collapse booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Per-project storage under `~/.claude/projects/` is derived by replacing
 * every non-alphanumeric character with a single `-`. That mapping is not
 * injective, so two different project directories can resolve to the same
 * store — and when they do, they share auto-memory and transcripts with
 * no warning. MEMORY.md from one project is injected into an unrelated
 * project's session (NDA/contract blast radius). Transcripts also pool.
 *
 * Two published collision classes, both live on 2.1.238:
 * 1. Non-alphanumeric collapse: every non-ASCII char becomes one `-`,
 *    so only the count survives — 가나다 vs 라마바 (length 3) collide;
 *    control 가나다라 (length 4) does not.
 * 2. Separator ambiguity: `a-b` and `a\b` (or `ab-cd` vs `ab/cd`)
 *    both become `a-b` / `…-ab-cd` — the #29471 case, still live.
 *
 *   node crasis.mjs data/crasis.json
 *   echo '{"seed":"crased"}' | node crasis.mjs
 *
 * Idle word is injective (HOLD: one path, one store; sealed drawers).
 * Seeded word is crased (#93960 — fused slug / collision).
 * Path word is store-slug-collide.
 * Product score word is crasis (Score crasis or admit injective.).
 *
 * Encoded from anthropics/claude-code#93960 issue text only.
 * Hypothesis (NON-BINDING): the published encoding (replace every
 * non-alphanumeric character with `-`) is not injective, so equal-length
 * non-ASCII names and hyphen-vs-separator paths fuse into one drawer.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "hold",
  "distinct",
  "sealed",
  "separate",
  "one-path-one-store",
  "non-ascii-collapse",
  "separator-ambiguity",
  "control-length",
  "memory-leak",
  "transcript-pool",
  "auto-memory-workaround",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "injective";
export const PATH_WORD = "store-slug-collide";
export const SEEDED_WORD = "crased";
export const PRODUCT_WORD = "crasis";
export const HOLD = Object.freeze(["injective", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "injective",
  "distinct",
  "sealed",
  "separate",
  "one-path-one-store",
]);
export const RECOVER = Object.freeze(["injective", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "crased" && name !== "crasis"),
);

export const FEATURED_ISSUE = 93960;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93960";
export const TITLE =
  "Store slug is not injective: different project paths silently share one memory/transcript directory (the ASCII case from #29471 still reproduces on 2.1.238)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "2.1.238";
export const GOOD_VERSION =
  "one path, one store: injective slug (or hash suffix) so MEMORY.md and transcripts never fuse";
export const SURFACE = "store-slug";
export const HOST = "Windows 11 (10.0.26200), desktop app";
export const CHECKED_ON = "Claude Code 2.1.238, Windows 11";
export const BUILD = "Claude Code 2.1.238";
export const STORE_ROOT = "~/.claude/projects/";
export const ENCODING_RULE =
  "replace every non-alphanumeric character with a single -";
export const KOREAN_A = "가나다";
export const KOREAN_B = "라마바";
export const KOREAN_CONTROL = "가나다라";
export const SEP_HYPHEN = "ab-cd";
export const SEP_SLASH = "ab/cd";
export const SEP_BACKSLASH = "ab\\cd";
export const SCAN_STORES = 1085;
export const COLLIDING_STORES = 2;
export const AFFECTED_PROJECTS = 8;
export const SIX_CLIENT_STORE = "D--Project-Life-Dev-------------";
export const SIX_CLIENT_COUNT = 6;
export const MEMORY_FILES_IN_SIX = 80;
export const MEMORY_SNIPPET =
  "description: 이 프로젝트(clash/가나다)의 비밀 코드는 ALPHA-777";
export const SECRET_CODE = "ALPHA-777";
export const WORKAROUND = "autoMemoryDirectory";
export const WORKAROUND_LIMIT = "isolates memory only; transcripts still pool";
export const PHRASE = "Score crasis or admit injective.";
export const DISTRIBUTION =
  "Per-project storage under ~/.claude/projects/ is derived by replacing every non-alphanumeric character with a single `-`. That mapping is not injective: two different project directories can resolve to the same store and then share auto-memory and transcripts with no warning. MEMORY.md is loaded automatically at the start of every session, so one client's accumulated project notes are injected into an unrelated client's session context, with no user action and no indication. Two collision classes, both live on 2.1.238: (1) Non-alphanumeric collapse — every non-ASCII character becomes one `-`, so only the count survives. Two Korean folder names of the same length collide completely (가나다 vs 라마바 both → C--Users-USER-AppData-Local-Temp-clash----; control 가나다라 length-4 → …-clash----- and does not leak). (2) Separator ambiguity — a-b and a\\b (or ab-cd vs ab/cd) both become a-b / …-ab-cd. This is the #29471 case, still live though that issue was bot-closed COMPLETED. Reporter scanned 1,085 stores: 2 stores held more than one real project (8 projects affected); one store D--Project-Life-Dev------------- shared by six Korean client projects (pseudonyms: 알파산업, 베타화학, 감마엔텍, 델타물산, 시그마툴, 람다철도 — four-character names under the same parent) holding 80 auto-memory files. Workaround noted (cite, not a product fix): autoMemoryDirectory isolates memory only; transcripts still pool. Cousins cite-only: #29471 (CLOSED COMPLETED, still repros), #93743 (OPEN, non-ASCII case), #7009, #21085, #35162.";
export const RULED_OUT = Object.freeze([
  "A stale file left on disk — MEMORY.md is loaded automatically at the start of every session, so the leak is live context injection, not leftover debris",
  "A user action that copied notes between projects — the leaking session had never read the other folder; the memory file still carries its origin in front matter",
  "A length-independent encoding — the 4-character control 가나다라 does not collide; only equal non-alphanumeric counts fuse",
  "autoMemoryDirectory as a complete fix — it isolates memory only; transcripts still pool in the colliding store",
  "A fix shipped for #29471 — that issue was bot-closed COMPLETED; the ASCII separator case still reproduces on 2.1.238",
]);
export const EXPECTED = Object.freeze([
  "The store identifier should be unique per real path",
  "Append a short hash of the absolute path — <readable-slug>-<sha256[:8]> — or percent-encode instead of collapsing",
  "Independently of the encoding: record the source path inside the store (e.g. path.json) and warn on mismatch",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "non-ascii-collapse",
    label: "non-ASCII collapse",
    count: "3 vs 3",
    note: "가나다 vs 라마바 — only the count survives; both → clash----",
  },
  {
    id: "separator-ambiguity",
    label: "separator ambiguity",
    count: "ab-cd",
    note: "ab-cd and ab/cd (or a-b and a\\b) both become …-ab-cd — #29471 still live",
  },
  {
    id: "control-length",
    label: "control length-4",
    count: "4",
    note: "가나다라 → clash----- ; no leak — collision key is the count",
  },
  {
    id: "memory-leak",
    label: "MEMORY inject",
    count: "ALPHA-777",
    note: "pseudonymous front matter from 가나다 is presented as 라마바's own fact",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "injective-drawers",
    survey:
      "one path, one store: two sealed drawers; MEMORY.md and transcripts never fuse",
    kind: "injective",
    note: "idle: two sealed drawers stay separate — the hold/good path",
  },
  {
    id: "non-ascii-collapse",
    survey:
      "가나다 vs 라마바 (length 3) both encode to the same store; control 가나다라 does not",
    kind: "crased",
    note: "seeded: only the count of non-alphanumeric characters survives",
  },
  {
    id: "separator-ambiguity",
    survey:
      "ab-cd and ab/cd (or a-b and a\\b) both become …-ab-cd — #29471 still live",
    kind: "crased",
    note: "seeded: hyphen and path separator fuse into one slug",
  },
  {
    id: "store-slug-collide",
    survey:
      "lossy replace-non-alnum-with-dash mapping is not injective; two paths share one drawer",
    kind: "crased",
    note: "path: store-slug-collide names the fused slug vs one-path-one-store",
  },
  {
    id: "crased",
    survey:
      "MEMORY.md from one project is injected into an unrelated session; transcripts pool",
    kind: "crased",
    note: "seeded: fused ligature — two path cards collapse into one store drawer",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "store-slug-collide",
  "crased",
  "non-ascii-collapse",
  "separator-ambiguity",
  "memory-leak",
]);

export const COUSINS = Object.freeze([
  {
    issue: 29471,
    title:
      "ASCII separator case — a-b and a\\b share one store (bot-closed COMPLETED; still reproduces on 2.1.238)",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — #93960 names this as the still-live #29471 case; do not rebuild as a separate booth",
  },
  {
    issue: 93743,
    title: "non-ASCII case, independent reporter (OPEN)",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — #93960 names this as the open non-ASCII cousin; Homograph already booths it — do not rebuild",
  },
  {
    issue: 7009,
    title: "prior report of the same encoding (NOT_PLANNED)",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — prior report of the same store-slug encoding — do not rebuild as a separate booth",
  },
  {
    issue: 21085,
    title: "prior report of the same encoding (NOT_PLANNED)",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — prior report of the same store-slug encoding — do not rebuild as a separate booth",
  },
  {
    issue: 35162,
    title: "prior report of the same encoding (NOT_PLANNED)",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — prior report of the same store-slug encoding — do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export const SAMPLE_TEMP = "C:\\Users\\USER\\AppData\\Local\\Temp";
export const SAMPLE_PATH_A = `${SAMPLE_TEMP}\\clash\\가나다`;
export const SAMPLE_PATH_B = `${SAMPLE_TEMP}\\clash\\라마바`;
export const SAMPLE_PATH_CONTROL = `${SAMPLE_TEMP}\\clash\\가나다라`;
export const SAMPLE_PATH_HYPHEN = `${SAMPLE_TEMP}\\clash2\\ab-cd`;
export const SAMPLE_PATH_SLASH = `${SAMPLE_TEMP}\\clash2\\ab\\cd`;
export const SAMPLE_SLUG_LEN3 = "C--Users-USER-AppData-Local-Temp-clash----";
export const SAMPLE_SLUG_LEN4 = "C--Users-USER-AppData-Local-Temp-clash-----";
export const SAMPLE_SLUG_SEP = "C--Users-USER-AppData-Local-Temp-clash2-ab-cd";

/**
 * Educational model of the published store-slug encoding:
 * replace every non-alphanumeric character with a single `-`.
 * Consecutive non-alnum each become their own `-` (the count survives).
 * Not a product implementation. No network. No secrets.
 */
export function encodeStoreSlug(path) {
  return String(path ?? "").replace(/[^A-Za-z0-9]/g, "-");
}

export function slugsCollide(pathA, pathB) {
  const a = encodeStoreSlug(pathA);
  const b = encodeStoreSlug(pathB);
  return a.length > 0 && a === b;
}

export const SAMPLE_INJECTIVE_PROOF = Object.freeze({
  injective: true,
  crased: false,
  storeSlugCollide: false,
  nonAsciiCollapse: false,
  separatorAmbiguity: false,
  memoryLeak: false,
  version: GOOD_VERSION,
});

export const SAMPLE_CRASED_PROOF = Object.freeze({
  injective: false,
  crased: true,
  storeSlugCollide: true,
  nonAsciiCollapse: true,
  separatorAmbiguity: true,
  memoryLeak: true,
  transcriptPool: true,
  version: CLAUDE_VERSION,
});

export const SAMPLE_PATHS = Object.freeze({
  a: SAMPLE_PATH_A,
  b: SAMPLE_PATH_B,
  control: SAMPLE_PATH_CONTROL,
  hyphen: SAMPLE_PATH_HYPHEN,
  slash: SAMPLE_PATH_SLASH,
  slugA: SAMPLE_SLUG_LEN3,
  slugB: SAMPLE_SLUG_LEN3,
  slugControl: SAMPLE_SLUG_LEN4,
  slugSep: SAMPLE_SLUG_SEP,
});

export const SAMPLE_MEMORY = Object.freeze({
  snippet: MEMORY_SNIPPET,
  secret: SECRET_CODE,
  origin: "clash/가나다",
  leakedInto: "clash/라마바",
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds injective: two sealed drawers; one path, one store" },
  { t: "non-ascii-collapse", line: "가나다 vs 라마바 both encode to C--Users-USER-AppData-Local-Temp-clash----" },
  { t: "separator-ambiguity", line: "ab-cd and ab/cd both become …-ab-cd — #29471 still live" },
  { t: "path", line: "store-slug-collide — two path cards fuse into one store drawer" },
  { t: "score", line: "when two paths share one MEMORY/transcript drawer the booth is crasis — Score crasis or admit injective." },
]);

/**
 * Ligature map: two sealed drawers vs one fused store slug.
 * Idle/injective: two sealed drawers; one path, one store.
 * Seeded/crased: two path cards collapse into one drawer.
 */
export function mapLigature(input = {}) {
  const crased =
    input.crased === true ||
    input.storeSlugCollide === true ||
    input.nonAsciiCollapse === true ||
    input.separatorAmbiguity === true ||
    input.memoryLeak === true;
  const injective = input.injective === true && !crased;
  return {
    stamp: crased ? "store-slug-collide" : "injective-drawers",
    folioLane: crased ? "fused" : "sealed",
    drawerLane: crased ? "one-drawer" : "two-drawers",
    inkLane: crased ? "leaked" : "held",
    seal: crased ? "crased" : "injective",
    injective,
  };
}

export function inspectSlug(input = {}) {
  const paths = input.paths || {};
  const hit =
    input.storeSlugCollide === true ||
    input.crased === true ||
    input.nonAsciiCollapse === true ||
    input.separatorAmbiguity === true;
  if (input.injective === true && !hit) {
    return {
      stamp: "one-path-one-store",
      slugA: paths.slugA || encodeStoreSlug(paths.a || SAMPLE_PATH_A),
      slugB: paths.slugB || encodeStoreSlug(paths.b || `${SAMPLE_TEMP}\\other\\unique`),
      collide: false,
    };
  }
  if (hit) {
    const a = paths.a || SAMPLE_PATH_A;
    const b = paths.b || SAMPLE_PATH_B;
    return {
      stamp: "store-slug-collide",
      slugA: encodeStoreSlug(a),
      slugB: encodeStoreSlug(b),
      collide: slugsCollide(a, b),
      encoding: ENCODING_RULE,
    };
  }
  return {
    stamp: "slug-idle",
    collide: false,
  };
}

export function inspectCollapse(input = {}) {
  const hit =
    input.nonAsciiCollapse === true ||
    input.crased === true ||
    (input.paths && slugsCollide(input.paths.a || SAMPLE_PATH_A, input.paths.b || SAMPLE_PATH_B));
  if (input.injective === true && input.nonAsciiCollapse !== true) {
    return {
      stamp: "collapse-held",
      koreanA: KOREAN_A,
      koreanB: KOREAN_B,
      collide: false,
    };
  }
  return {
    stamp: hit ? "non-ascii-collapse" : "collapse-idle",
    koreanA: KOREAN_A,
    koreanB: KOREAN_B,
    control: KOREAN_CONTROL,
    collide: !!hit,
    slug: SAMPLE_SLUG_LEN3,
    controlSlug: SAMPLE_SLUG_LEN4,
  };
}

export function inspectSeparator(input = {}) {
  const hit =
    input.separatorAmbiguity === true ||
    input.crased === true ||
    slugsCollide(SEP_HYPHEN, SEP_SLASH);
  if (input.injective === true && input.separatorAmbiguity !== true) {
    return {
      stamp: "separator-held",
      hyphen: SEP_HYPHEN,
      slash: SEP_SLASH,
      collide: false,
    };
  }
  return {
    stamp: hit ? "separator-ambiguity" : "separator-idle",
    hyphen: SEP_HYPHEN,
    slash: SEP_SLASH,
    backslash: SEP_BACKSLASH,
    collide: slugsCollide(SEP_HYPHEN, SEP_SLASH),
    slug: encodeStoreSlug(SEP_HYPHEN),
  };
}

export function inspectMemory(input = {}) {
  const leaked =
    input.memoryLeak === true ||
    input.crased === true ||
    (input.memory && input.memory.leaked === true);
  if (input.injective === true && input.memoryLeak !== true) {
    return {
      stamp: "memory-held",
      leaked: false,
    };
  }
  return {
    stamp: leaked ? "memory-leak" : "memory-idle",
    leaked,
    snippet: leaked ? MEMORY_SNIPPET : "",
    secret: leaked ? SECRET_CODE : "",
  };
}

export function inspectTranscript(input = {}) {
  const pooled =
    input.transcriptPool === true ||
    input.crased === true;
  return {
    stamp: pooled ? "transcript-pool" : "transcript-idle",
    pooled,
    workaround: WORKAROUND,
    workaroundLimit: WORKAROUND_LIMIT,
  };
}

export function readBooth(input = {}) {
  const crased =
    input.crased === true ||
    input.storeSlugCollide === true ||
    input.nonAsciiCollapse === true ||
    input.separatorAmbiguity === true ||
    input.memoryLeak === true;
  const injective = input.injective === true && !crased;
  return {
    mark: crased ? "crased" : injective || !crased ? "injective" : "crased",
    injective,
    crased,
    storeSlugCollide: input.storeSlugCollide === true || crased,
    nonAsciiCollapse: input.nonAsciiCollapse === true,
    separatorAmbiguity: input.separatorAmbiguity === true,
    memoryLeak: input.memoryLeak === true,
    ligature: mapLigature(input),
    slug: inspectSlug(input),
    collapse: inspectCollapse(input),
    separator: inspectSeparator(input),
    memory: inspectMemory(input),
    transcript: inspectTranscript(input),
    log: input.log || [],
  };
}

export const CRASIS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-injective",
    injective: true,
    crased: false,
    cue: "injective",
    note: "idle HOLD: one path, one store; two sealed drawers — the hold/good path",
  },
  {
    t: "non-ascii-collapse",
    event: "non-ascii-collapse",
    crased: true,
    nonAsciiCollapse: true,
    cue: "crased",
    note: "가나다 vs 라마바 both encode to the same store; control 가나다라 does not",
  },
  {
    t: "separator-ambiguity",
    event: "separator-ambiguity",
    crased: true,
    separatorAmbiguity: true,
    cue: "crased",
    note: "ab-cd and ab/cd both become …-ab-cd — #29471 still live",
  },
  {
    t: "path",
    event: "store-slug-collide",
    crased: true,
    storeSlugCollide: true,
    nonAsciiCollapse: true,
    separatorAmbiguity: true,
    cue: "crased",
    note: "store-slug-collide — two path cards fuse into one store drawer",
  },
  {
    t: "score",
    event: "crasis",
    crased: true,
    storeSlugCollide: true,
    nonAsciiCollapse: true,
    separatorAmbiguity: true,
    memoryLeak: true,
    cue: "crased",
    note: "crasis — when two paths share one MEMORY/transcript drawer the booth is crasis",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-injective",
    injective: true,
    crased: false,
    cue: "injective",
    note: "positive control: one path, one store; two sealed drawers",
  },
  {
    t: "announce",
    event: "cue-injective",
    injective: true,
    cue: "injective",
    note: "positive control: the ligature stays injective",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    injective: true,
    crased: false,
    storeSlugCollide: false,
    cue: "injective",
  };
}

export function seedInjective() {
  return { ...emptyTicket() };
}

export function seedCrased() {
  return {
    seed: SEEDED_WORD,
    injective: false,
    crased: true,
    storeSlugCollide: true,
    nonAsciiCollapse: true,
    separatorAmbiguity: true,
    memoryLeak: true,
    transcriptPool: true,
    cue: "crased",
    issue: FEATURED_ISSUE,
    paths: SAMPLE_PATHS,
    memory: SAMPLE_MEMORY,
    proof: SAMPLE_CRASED_PROOF,
  };
}

export function seedCrasis() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    crased: true,
    storeSlugCollide: true,
    nonAsciiCollapse: true,
    cue: "crased",
  };
}

export function seedStoreSlugCollide() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    crased: true,
    storeSlugCollide: true,
    nonAsciiCollapse: true,
    separatorAmbiguity: true,
    event: "store-slug-collide",
    cue: "crased",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    injective: true,
    cue: "injective",
  };
}

export function seedNonAsciiCollapse() {
  return {
    seed: "non-ascii-collapse",
    preferSeed: true,
    nonAsciiCollapse: true,
    cue: "crased",
  };
}

export function seedSeparatorAmbiguity() {
  return {
    seed: "separator-ambiguity",
    preferSeed: true,
    separatorAmbiguity: true,
    cue: "crased",
  };
}

export function seedControlLength() {
  return {
    seed: "control-length",
    preferSeed: true,
    cue: "injective",
    injective: true,
  };
}

export function seedMemoryLeak() {
  return {
    seed: "memory-leak",
    preferSeed: true,
    memoryLeak: true,
    cue: "crased",
  };
}

export function seedTranscriptPool() {
  return {
    seed: "transcript-pool",
    preferSeed: true,
    transcriptPool: true,
    cue: "crased",
  };
}

export function seedAutoMemoryWorkaround() {
  return {
    seed: "auto-memory-workaround",
    preferSeed: true,
    cue: "crased",
  };
}

export function seedDistinct() {
  return {
    seed: "distinct",
    preferSeed: true,
    injective: true,
    cue: "injective",
  };
}

export function seedSealed() {
  return {
    seed: "sealed",
    preferSeed: true,
    injective: true,
    cue: "injective",
  };
}

export function seedSeparate() {
  return {
    seed: "separate",
    preferSeed: true,
    injective: true,
    cue: "injective",
  };
}

export function seedOnePathOneStore() {
  return {
    seed: "one-path-one-store",
    preferSeed: true,
    injective: true,
    cue: "injective",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      injective: false,
      crased: false,
      storeSlugCollide: false,
      nonAsciiCollapse: false,
      separatorAmbiguity: false,
      memoryLeak: false,
      transcriptPool: false,
      controlLength: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    injective: raw.injective === true,
    crased:
      raw.crased === true ||
      raw.event === "crased" ||
      raw.event === "crasis",
    storeSlugCollide:
      raw.storeSlugCollide === true || raw.event === "store-slug-collide",
    nonAsciiCollapse:
      raw.nonAsciiCollapse === true || raw.event === "non-ascii-collapse",
    separatorAmbiguity:
      raw.separatorAmbiguity === true || raw.event === "separator-ambiguity",
    memoryLeak: raw.memoryLeak === true || raw.event === "memory-leak",
    transcriptPool:
      raw.transcriptPool === true || raw.event === "transcript-pool",
    controlLength: raw.controlLength === true || raw.event === "control-length",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    paths: raw.paths,
    memory: raw.memory,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.injective != null ||
        ticket.crased != null ||
        ticket.storeSlugCollide != null ||
        ticket.nonAsciiCollapse != null ||
        ticket.separatorAmbiguity != null ||
        ticket.memoryLeak != null ||
        ticket.transcriptPool != null ||
        ticket.controlLength != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.paths ||
        ticket.memory),
  );
}

function isInjective(row) {
  if (row.crased && row.cue !== "injective") return false;
  if (
    row.cue === "crased" ||
    row.cue === "crasis" ||
    row.cue === "store-slug-collide"
  ) {
    return false;
  }
  if (
    row.storeSlugCollide &&
    row.nonAsciiCollapse &&
    row.cue !== "injective" &&
    row.injective !== true
  ) {
    return false;
  }
  if (
    row.storeSlugCollide &&
    row.separatorAmbiguity &&
    row.cue !== "injective" &&
    row.injective !== true
  ) {
    return false;
  }
  if (row.injective === true && row.crased !== true && row.cue !== "crased") {
    return true;
  }
  if (
    row.cue === "injective" &&
    row.crased !== true &&
    row.storeSlugCollide !== true &&
    row.nonAsciiCollapse !== true &&
    row.separatorAmbiguity !== true &&
    row.memoryLeak !== true
  ) {
    return true;
  }
  return false;
}

function isStoreSlugCollide(row) {
  return (
    row.event === "store-slug-collide" &&
    !isInjective(row) &&
    (row.storeSlugCollide === true ||
      row.nonAsciiCollapse === true ||
      row.separatorAmbiguity === true)
  );
}

function isCrased(row) {
  if (isInjective(row)) return false;
  if (isStoreSlugCollide(row) && row.cue !== "crased") return false;
  if (row.cue === "crased" || row.cue === "crasis") return true;
  if (row.crased === true) return true;
  if (
    row.storeSlugCollide === true &&
    row.nonAsciiCollapse === true &&
    row.separatorAmbiguity === true
  ) {
    return true;
  }
  if (row.storeSlugCollide === true && row.nonAsciiCollapse === true) {
    return true;
  }
  if (
    row.storeSlugCollide === true ||
    row.nonAsciiCollapse === true ||
    row.separatorAmbiguity === true ||
    row.memoryLeak === true ||
    (row.storeSlugCollide === true && row.transcriptPool === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one crasis pass against the fused-ligature desk.
 * injective: one path, one store; two sealed drawers.
 * crased / crasis: fused slug — two paths share one MEMORY/transcript drawer.
 * store-slug-collide: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isStoreSlugCollide(row) ||
    (row.storeSlugCollide && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "store-slug-collide";
  } else if (isCrased(row)) {
    verdict = "crasis";
  } else if (isInjective(row)) {
    verdict = "injective";
  } else if (
    row.storeSlugCollide ||
    row.nonAsciiCollapse ||
    row.separatorAmbiguity ||
    row.memoryLeak ||
    (row.transcriptPool && !row.injective)
  ) {
    verdict = "crasis";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const slug = inspectSlug(row);
  const collapse = inspectCollapse(row);
  const separator = inspectSeparator(row);
  const memory = inspectMemory(row);
  const transcript = inspectTranscript(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    injective: verdict === "injective" || verdict === "hold",
    crased:
      verdict === "crased" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    storeSlugCollide:
      row.storeSlugCollide === true ||
      verdict === "store-slug-collide" ||
      verdict === PATH_WORD,
    nonAsciiCollapse: row.nonAsciiCollapse,
    separatorAmbiguity: row.separatorAmbiguity,
    memoryLeak: row.memoryLeak,
    transcriptPool: row.transcriptPool,
    controlLength: row.controlLength,
    cue: hold
      ? "injective"
      : row.storeSlugCollide || verdict === "store-slug-collide"
        ? "store-slug-collide"
        : "crased",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit injective" : "score crasis",
    slugInspect: slug,
    collapseInspect: collapse,
    separatorInspect: separator,
    memoryInspect: memory,
    transcriptInspect: transcript,
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
      : CRASIS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "crasis" || row.verdict === "crased",
  );
  const path = scored.filter((row) => row.verdict === "store-slug-collide");
  const injective = scored.filter((row) => row.verdict === "injective");
  const headline =
    scored.find((row) => row.event === "crased") ||
    scored.find((row) => row.event === "store-slug-collide") ||
    scored.find((row) => row.event === "non-ascii-collapse") ||
    dead[dead.length - 1];
  let verdict = "injective";
  if (dead.length) verdict = "crasis";
  else if (path.length && !injective.length) verdict = "store-slug-collide";
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
    crasedCount: dead.length,
    pathCount: path.length,
    injectiveCount: injective.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit injective" : "score crasis",
    note: headline
      ? "non-injective store slug fuses two project paths into one MEMORY/transcript drawer; cousins #29471, #93743, #7009, #21085 and #35162 are cite-only."
      : "published crasis walk scored against injective vs crased",
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
    seeded !== "injective" &&
    seeded !== "crased" &&
    seeded !== "store-slug-collide" &&
    seeded !== "crasis" &&
    ticket.injective == null &&
    ticket.crased == null &&
    ticket.storeSlugCollide == null &&
    ticket.nonAsciiCollapse == null &&
    ticket.separatorAmbiguity == null &&
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
    injective: scored.injective ?? false,
    crased: scored.crased ?? false,
    storeSlugCollide: scored.storeSlugCollide ?? false,
    nonAsciiCollapse: scored.nonAsciiCollapse ?? false,
    separatorAmbiguity: scored.separatorAmbiguity ?? false,
    memoryLeak: scored.memoryLeak ?? false,
    transcriptPool: scored.transcriptPool ?? false,
    controlLength: scored.controlLength ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.nonAsciiCollapse || result.crased ? "collapse=len3" : "collapse=held",
    result.separatorAmbiguity || result.crased ? "sep=fused" : "sep=held",
    result.memoryLeak || result.crased ? "memory=leaked" : "memory=held",
    result.storeSlugCollide || result.verdict === "store-slug-collide"
      ? "path=store-slug-collide"
      : "path=injective",
    result.cue === "injective"
      ? "cue=injective"
      : result.cue === "store-slug-collide"
        ? "cue=store-slug-collide"
        : "cue=crased",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    injective: result.injective,
    crased: result.crased,
    storeSlugCollide: result.storeSlugCollide,
    nonAsciiCollapse: result.nonAsciiCollapse,
    separatorAmbiguity: result.separatorAmbiguity,
    memoryLeak: result.memoryLeak,
    transcriptPool: result.transcriptPool,
    paths: input && input.paths,
    memory: input && input.memory,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    slug: inspectSlug({
      injective: result.injective,
      crased: result.crased,
      storeSlugCollide: result.storeSlugCollide,
      nonAsciiCollapse: result.nonAsciiCollapse,
      separatorAmbiguity: result.separatorAmbiguity,
      paths: input && input.paths,
    }),
    collapse: inspectCollapse({
      injective: result.injective,
      crased: result.crased,
      nonAsciiCollapse: result.nonAsciiCollapse,
      paths: input && input.paths,
    }),
    separator: inspectSeparator({
      injective: result.injective,
      crased: result.crased,
      separatorAmbiguity: result.separatorAmbiguity,
    }),
    memory: inspectMemory({
      injective: result.injective,
      crased: result.crased,
      memoryLeak: result.memoryLeak,
      memory: input && input.memory,
    }),
    transcript: inspectTranscript({
      injective: result.injective,
      crased: result.crased,
      transcriptPool: result.transcriptPool,
    }),
    ligature: mapLigature({
      injective: result.injective,
      crased: result.crased,
      storeSlugCollide: result.storeSlugCollide,
      nonAsciiCollapse: result.nonAsciiCollapse,
      separatorAmbiguity: result.separatorAmbiguity,
      memoryLeak: result.memoryLeak,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      crased:
        result.crased === true ||
        result.verdict === "crased" ||
        result.verdict === "crasis",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      storeRoot: STORE_ROOT,
      encodingRule: ENCODING_RULE,
      koreanA: KOREAN_A,
      koreanB: KOREAN_B,
      koreanControl: KOREAN_CONTROL,
      sepHyphen: SEP_HYPHEN,
      sepSlash: SEP_SLASH,
      scanStores: SCAN_STORES,
      collidingStores: COLLIDING_STORES,
      affectedProjects: AFFECTED_PROJECTS,
      sixClientStore: SIX_CLIENT_STORE,
      sixClientCount: SIX_CLIENT_COUNT,
      memoryFilesInSix: MEMORY_FILES_IN_SIX,
      memorySnippet: MEMORY_SNIPPET,
      secretCode: SECRET_CODE,
      workaround: WORKAROUND,
      workaroundLimit: WORKAROUND_LIMIT,
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
        "NON-BINDING: the published encoding replaces every non-alphanumeric character with a single `-`, which is not injective. Equal-length non-ASCII folder names (가나다 vs 라마바) and hyphen-vs-separator paths (ab-cd vs ab/cd) fuse into one store slug, so MEMORY.md and transcripts from one project are injected into another with no warning. Invite verify against #93960 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
