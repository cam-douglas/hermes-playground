#!/usr/bin/env node
/**
 * Parablepsis — paleography / collation-desk / apparatus-criticus booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Edit/Write that reads a file as UTF-8 text and writes it back silently
 * replaces every undecodable Latin-1/Windows-1252 byte with the Unicode
 * replacement character. PHP/legacy web files store ¢ ½ • ü and smart
 * quotes/dashes as raw single-byte Latin-1/Windows-1252 (matching
 * charset=iso-8859-1; browsers render 0x80–0x9F as Windows-1252 per
 * WHATWG). A raw byte like 0xA2 (¢) is not valid UTF-8 alone. Corruption
 * hits every other special character elsewhere in the file, not just the
 * edited line. Confirmed 2026-09-12: 162 characters across 11 files
 * between 2026-05-25 and 2026-09-11; several introducing commits
 * Claude-Code-authored; a live Edit meant to fix one line wiped every
 * other correctly-restored byte.
 *
 *   node parablepsis.mjs data/parablepsis.json
 *   echo '{"seed":"parablepsis"}' | node parablepsis.mjs
 *
 * Idle word is diplomatic (HOLD: byte-exact / preserve original).
 * Seeded word is parablepsis (#93954 — the Latin-1 Edit/Write wipe).
 * Path word is latin1-edit-wipe.
 * Product score word is parablepsis (Score parablepsis or admit diplomatic.).
 *
 * Encoded from anthropics/claude-code#93954 issue text only.
 * Hypothesis (NON-BINDING): Edit/Write decode-as-UTF-8 then re-encode.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Mojibake/#93848 (intermittent U+FFFD of multibyte Korean in
 * CLAUDE.md reaching the API / prompt-cache — read-path, not Edit/Write
 * of Latin-1 PHP). Cite-only cousin.
 * NOT Crasis/#93960 (non-injective store slug).
 * NOT Apograph/#93859 (Desktop reopen-fork transcript copy).
 * NOT Demesne/#93989, Cartouche/#93772, Attaint/#93821, Oriel/#93809,
 * Anarthria/#93782, Trismus/#93823, Foundling/#93889, Tessera,
 * Scissel/#93915, Feoffee/#93863, Airlock/#93862, Scotoma, Aneroid.
 * Skip Foundling-adjacent #93996 (orphaned bash).
 * Parablepsis is specifically Edit/Write UTF-8-decode of Latin-1/
 * Windows-1252 PHP that silently wipes non-ASCII bytes across the file.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "diplomatic",
  "parablepsis",
  "latin1-edit-wipe",
  "hold",
  "byte-exact",
  "latin1-preserved",
  "charset-safe",
  "no-rewrite",
  "replacement-char",
  "whole-file-wipe",
  "latin1-byte",
  "windows-1252",
  "iso-8859-1",
  "edit-write-decode",
  "php-legacy",
  "confirmed-162",
  "live-edit-wipe",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "diplomatic";
export const PATH_WORD = "latin1-edit-wipe";
export const SEEDED_WORD = "parablepsis";
export const PRODUCT_WORD = "parablepsis";
export const HOLD = Object.freeze(["diplomatic", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "diplomatic",
  "byte-exact",
  "latin1-preserved",
  "charset-safe",
  "no-rewrite",
]);
export const RECOVER = Object.freeze(["diplomatic", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "calibrated",
  "aneroided",
  "tethered",
  "engaged",
  "flush",
  "candid",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "parablepsis"),
);

export const FEATURED_ISSUE = 93954;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93954";
export const TITLE =
  "[BUG] Byte corruption of Latin-1/Windows-1252 single-byte characters";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:tools",
]);
export const PLATFORM = "macos";
export const SURFACE = "latin1-edit-wipe";
export const HOST = "Claude Code CLI";
export const CHECKED_ON =
  "Claude Code CLI v2.1.269, macOS, Terminal.app, Sonnet (default)";
export const BUILD = "2.1.269";
export const SELECTED_MODEL = "Sonnet (default)";
export const OS = "macos";
export const PHRASE = "Score parablepsis or admit diplomatic.";
export const DISTRIBUTION =
  "PHP/legacy web files store special characters (¢, ½, •, ü, smart quotes/dashes) as raw single-byte Latin-1/Windows-1252, matching charset=iso-8859-1 (browsers render 0x80–0x9F as Windows-1252 per WHATWG). A raw byte like 0xA2 (¢) is not valid UTF-8 alone. Claude Code Edit/Write that reads the file as UTF-8 text and writes it back silently replaces every undecodable byte with the Unicode replacement character — corruption hits EVERY other special character elsewhere in the file, not just the edited line. Confirmed 2026-09-12: 162 characters across 11 files corrupted between 2026-05-25 and 2026-09-11; several introducing commits Claude-Code-authored; live Edit meant to fix one line wiped every other correctly-restored byte. Repro: create PHP with <meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\" /> and ¢/½ strings; ask Claude to edit (add a comment); view saved file — special chars corrupted.";

export const RULED_OUT = Object.freeze([
  "Mojibake/#93848 Windows CLAUDE.md U+FFFD — read-path Korean multibyte reaching the API / prompt-cache, not Edit/Write of Latin-1 PHP",
  "Crasis/#93960 non-injective store slug — memory drawer collision, not a Latin-1 wipe",
  "Apograph/#93859 Desktop reopen-fork — transcript copy, not an Edit/Write charset wipe",
  "Demesne/#93989 bwrap /home bind — manor overreach, not a collation wipe",
  "Cartouche/#93772 wrong-diagram-type section-poster — temple name-oval, not Latin-1",
  "Attaint/#93821 session-attainder cyber-safeguard — court-roll stain, not a byte wipe",
  "Oriel/#93809 plan-window no-reflow — Gothic bay, not a collation desk",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not Latin-1 Edit/Write",
  "Trismus/#93823 UNUserNotification XPC lockjaw — macOS Desktop freeze, not charset",
  "Foundling/#93889 subagent Bash orphaning — child-agent lifecycle, not a file rewrite",
  "Tessera/#93776-family version-path TCC — privacy-pane rows, not Latin-1 PHP",
  "Scissel/#93915 Windows Bash argv truncation — mint scrap, not Edit/Write decode",
  "Feoffee/#93863 preview_start getcwd EPERM / FDA inheritance — seisin miss, not charset",
  "Airlock/#93862 sandbox socat race — readiness before first network call, not Latin-1",
  "Scotoma/#93744 command-args-blind — Stop evaluator, not a byte wipe",
  "Aneroid/#93901 wrong-window-ring — context meter, not Latin-1 Edit/Write",
]);
export const EXPECTED = Object.freeze([
  "Preserve Latin-1/Windows-1252 bytes byte-exact (diplomatic transcription) when Edit/Write touches the file",
  "Or refuse to edit a non-UTF-8 file with a clear warning instead of silently rewriting",
  "Do not silently substitute U+FFFD for undecodable single-byte characters (¢ ½ • ü)",
  "An Edit meant to change one line must not wipe every other special character elsewhere in the file",
  "Legacy PHP/web files declaring charset=iso-8859-1 should survive Edit/Write without whole-file corruption",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "replacement-char",
    label: "replacement char",
    count: "U+FFFD",
    note: "undecodable Latin-1 bytes silently become the Unicode replacement character",
  },
  {
    id: "whole-file-wipe",
    label: "whole-file wipe",
    count: "162 / 11",
    note: "corruption hits every other special character elsewhere in the file, not just the edited line",
  },
  {
    id: "latin1-byte",
    label: "latin-1 byte",
    count: "0xA2 ¢",
    note: "a raw byte like 0xA2 (¢) is not valid UTF-8 on its own",
  },
  {
    id: "iso-8859-1",
    label: "iso-8859-1",
    count: "charset=iso-8859-1",
    note: "PHP/legacy web files match charset=iso-8859-1; browsers render 0x80–0x9F as Windows-1252",
  },
  {
    id: "live-edit-wipe",
    label: "live edit wipe",
    count: "one-line Edit",
    note: "live Edit meant to fix one line wiped every other correctly-restored byte",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "diplomatic-folio",
    survey:
      "diplomatic transcription: byte-exact Latin-1 preserved; the exemplar is not rewritten",
    kind: "diplomatic",
    note: "idle: diplomatic — the hold/good path",
  },
  {
    id: "replacement-char",
    survey:
      "Edit/Write UTF-8-decodes Latin-1 and substitutes U+FFFD for every undecodable byte",
    kind: "parablepsis",
    note: "seeded: replacement-char of the lemma",
  },
  {
    id: "whole-file-wipe",
    survey:
      "corruption hits every other special character elsewhere in the file, not just the edited line",
    kind: "parablepsis",
    note: "seeded: whole-file-wipe of the exemplar",
  },
  {
    id: "latin1-edit-wipe",
    survey:
      "collator's eye skips: Latin-1 bytes are seen as invalid UTF-8 and the folio is mangled",
    kind: "parablepsis",
    note: "path: latin1-edit-wipe names the Edit/Write decode-then-rewrite",
  },
  {
    id: "parablepsis",
    survey:
      "the folio is parablepsis — 162 chars / 11 files; one-line Edit wiped restored bytes",
    kind: "parablepsis",
    note: "seeded: parablepsis — Score parablepsis or admit diplomatic.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "latin1-edit-wipe",
  "parablepsis",
  "replacement-char",
  "whole-file-wipe",
  "latin1-byte",
  "iso-8859-1",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93848,
    title: "Windows CLAUDE.md U+FFFD (Mojibake)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — intermittent U+FFFD of multibyte Korean in CLAUDE.md reaching the API / prompt-cache. Read-path, not Edit/Write of Latin-1 PHP. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 reload-skills", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "aneroid",
]);

export const SAMPLE_KIND_IDLE = "byte-exact";
export const SAMPLE_KIND_SEEDED = "latin1-edit-wipe";
export const SAMPLE_HOLDING_IDLE = "diplomatic";
export const SAMPLE_HOLDING_SEEDED = "wiped";

export const SAMPLE_DIPLOMATIC_PROOF = Object.freeze({
  diplomatic: true,
  parablepsis: false,
  latin1EditWipe: false,
  replacementChar: false,
  wholeFileWipe: false,
  latin1Byte: false,
  windows1252: false,
  iso88591: false,
  editWriteDecode: false,
  phpLegacy: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_PARABLEPSIS_PROOF = Object.freeze({
  diplomatic: false,
  parablepsis: true,
  latin1EditWipe: true,
  replacementChar: true,
  wholeFileWipe: true,
  latin1Byte: true,
  windows1252: true,
  iso88591: true,
  editWriteDecode: true,
  phpLegacy: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds diplomatic: byte-exact Latin-1 preserved; the exemplar is not rewritten" },
  { t: "replacement-char", line: "Edit/Write UTF-8-decodes Latin-1 and substitutes U+FFFD for every undecodable byte" },
  { t: "whole-file-wipe", line: "corruption hits every other special character elsewhere in the file, not just the edited line" },
  { t: "path", line: "latin1-edit-wipe — collator's eye skips; Latin-1 bytes seen as invalid UTF-8; the folio is mangled" },
  { t: "score", line: "when Edit/Write wipes the exemplar the booth is parablepsis — Score parablepsis or admit diplomatic." },
]);

/**
 * Collation map: diplomatic folio vs parablepsis wipe.
 * Idle/diplomatic: byte-exact Latin-1 preserved.
 * Seeded/parablepsis: Edit/Write UTF-8-decodes and wipes.
 */
export function mapCollation(input = {}) {
  const parablepsis =
    input.parablepsis === true ||
    input.latin1EditWipe === true ||
    input.replacementChar === true ||
    input.wholeFileWipe === true ||
    input.latin1Byte === true ||
    input.windows1252 === true ||
    input.iso88591 === true ||
    input.editWriteDecode === true ||
    input.phpLegacy === true;
  const diplomatic = input.diplomatic === true && !parablepsis;
  return {
    stamp: parablepsis ? "latin1-edit-wipe" : "diplomatic-folio",
    holdingLane: parablepsis ? "wiped" : "diplomatic",
    kindLane: parablepsis ? "latin1-edit-wipe" : "byte-exact",
    bindLane: parablepsis ? "utf8-decode" : "byte-exact",
    ribbon: parablepsis ? "parablepsis" : "diplomatic",
    diplomatic,
  };
}

export function inspectWitness(input = {}) {
  const wiped =
    input.parablepsis === true ||
    input.latin1EditWipe === true ||
    input.replacementChar === true;
  if (input.diplomatic === true && !wiped) {
    return {
      stamp: "witness-diplomatic",
      wiped: false,
    };
  }
  return {
    stamp: wiped ? "witness-wiped" : "witness-idle",
    wiped,
    note: wiped
      ? "collator's eye skips; the exemplar is mangled with U+FFFD"
      : "",
  };
}

export function inspectDecode(input = {}) {
  const hit =
    input.latin1EditWipe === true ||
    input.editWriteDecode === true ||
    input.parablepsis === true;
  if (input.diplomatic === true && !hit) {
    return {
      stamp: "decode-byte-exact",
      target: "latin-1",
    };
  }
  return {
    stamp: hit ? "edit-write-decode" : "decode-idle",
    target: hit ? "utf-8" : "latin-1",
    note: hit
      ? "Edit/Write reads as UTF-8 text and writes it back"
      : "",
  };
}

export function inspectWipe(input = {}) {
  const denied =
    input.wholeFileWipe === true ||
    input.replacementChar === true ||
    input.parablepsis === true;
  if (input.diplomatic === true && !denied) {
    return {
      stamp: "wipe-held",
      denied: false,
    };
  }
  return {
    stamp: denied ? "whole-file-wipe" : "wipe-idle",
    denied,
    note: denied
      ? "U+FFFD substitution hits every other special character elsewhere in the file"
      : "",
  };
}

export function inspectCharset(input = {}) {
  const commons =
    input.iso88591 === true ||
    input.windows1252 === true ||
    input.latin1Byte === true ||
    input.parablepsis === true;
  if (input.diplomatic === true && !commons) {
    return {
      stamp: "charset-safe",
      rootOwned: false,
    };
  }
  return {
    stamp: commons ? "iso-8859-1" : "charset-idle",
    rootOwned: commons,
    note: commons
      ? "charset=iso-8859-1; 0xA2 ¢ is not valid UTF-8; 0x80–0x9F render as Windows-1252"
      : "",
  };
}

export function inspectTrigger(input = {}) {
  const triggered =
    input.phpLegacy === true ||
    input.editWriteDecode === true ||
    input.parablepsis === true;
  if (input.diplomatic === true && !triggered) {
    return {
      stamp: "trigger-idle",
      scrub: false,
    };
  }
  return {
    stamp: triggered ? "php-legacy" : "trigger-idle",
    scrub: triggered,
    note: triggered
      ? "PHP/legacy web files; Edit to add a comment; live one-line Edit wiped restored bytes"
      : "",
  };
}

export function readBooth(input = {}) {
  const parablepsis =
    input.parablepsis === true ||
    input.latin1EditWipe === true ||
    input.replacementChar === true ||
    input.wholeFileWipe === true ||
    input.latin1Byte === true ||
    input.windows1252 === true ||
    input.iso88591 === true ||
    input.editWriteDecode === true ||
    input.phpLegacy === true;
  const diplomatic = input.diplomatic === true && !parablepsis;
  return {
    mark: parablepsis ? "parablepsis" : diplomatic || !parablepsis ? "diplomatic" : "parablepsis",
    diplomatic,
    parablepsis,
    latin1EditWipe: input.latin1EditWipe === true || parablepsis,
    replacementChar: input.replacementChar === true,
    wholeFileWipe: input.wholeFileWipe === true,
    latin1Byte: input.latin1Byte === true,
    windows1252: input.windows1252 === true,
    iso88591: input.iso88591 === true,
    editWriteDecode: input.editWriteDecode === true,
    phpLegacy: input.phpLegacy === true,
    scope: mapCollation(input),
    holding: inspectWitness(input),
    bind: inspectDecode(input),
    write: inspectWipe(input),
    commons: inspectCharset(input),
    trigger: inspectTrigger(input),
    log: input.log || [],
  };
}

export const PARABLEPSIS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-diplomatic",
    diplomatic: true,
    parablepsis: false,
    cue: "diplomatic",
    note: "idle HOLD: byte-exact Latin-1 preserved — the hold/good path",
  },
  {
    t: "replacement-char",
    event: "replacement-char",
    parablepsis: true,
    replacementChar: true,
    cue: "parablepsis",
    note: "Edit/Write UTF-8-decodes Latin-1 and substitutes U+FFFD",
  },
  {
    t: "whole-file-wipe",
    event: "whole-file-wipe",
    parablepsis: true,
    wholeFileWipe: true,
    latin1Byte: true,
    cue: "parablepsis",
    note: "corruption hits every other special character elsewhere in the file",
  },
  {
    t: "path",
    event: "latin1-edit-wipe",
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
    iso88591: true,
    cue: "parablepsis",
    note: "latin1-edit-wipe — collator's eye skips; the folio is mangled",
  },
  {
    t: "score",
    event: "parablepsis",
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
    wholeFileWipe: true,
    latin1Byte: true,
    windows1252: true,
    iso88591: true,
    editWriteDecode: true,
    phpLegacy: true,
    cue: "parablepsis",
    note: "parablepsis — when Edit/Write wipes the exemplar the booth is parablepsis",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-diplomatic",
    diplomatic: true,
    parablepsis: false,
    cue: "diplomatic",
    note: "positive control: byte-exact Latin-1 preserved",
  },
  {
    t: "announce",
    event: "cue-diplomatic",
    diplomatic: true,
    cue: "diplomatic",
    note: "positive control: the folio stays diplomatic",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    diplomatic: true,
    parablepsis: false,
    latin1EditWipe: false,
    cue: "diplomatic",
  };
}

export function seedDiplomatic() {
  return { ...emptyTicket() };
}

export function seedParablepsis() {
  return {
    seed: SEEDED_WORD,
    diplomatic: false,
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
    wholeFileWipe: true,
    latin1Byte: true,
    windows1252: true,
    iso88591: true,
    editWriteDecode: true,
    phpLegacy: true,
    cue: "parablepsis",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_PARABLEPSIS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
    cue: "parablepsis",
  };
}

export function seedLatin1EditWipe() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    parablepsis: true,
    latin1EditWipe: true,
    replacementChar: true,
    event: "latin1-edit-wipe",
    cue: "parablepsis",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    diplomatic: true,
    cue: "diplomatic",
  };
}

export function seedReplacementChar() {
  return {
    seed: "replacement-char",
    preferSeed: true,
    replacementChar: true,
    cue: "parablepsis",
  };
}

export function seedWholeFileWipe() {
  return {
    seed: "whole-file-wipe",
    preferSeed: true,
    wholeFileWipe: true,
    cue: "parablepsis",
  };
}

export function seedLatin1Byte() {
  return {
    seed: "latin1-byte",
    preferSeed: true,
    latin1Byte: true,
    cue: "parablepsis",
  };
}

export function seedWindows1252() {
  return {
    seed: "windows-1252",
    preferSeed: true,
    windows1252: true,
    cue: "parablepsis",
  };
}

export function seedIso88591() {
  return {
    seed: "iso-8859-1",
    preferSeed: true,
    iso88591: true,
    cue: "parablepsis",
  };
}

export function seedEditWriteDecode() {
  return {
    seed: "edit-write-decode",
    preferSeed: true,
    editWriteDecode: true,
    cue: "parablepsis",
  };
}

export function seedPhpLegacy() {
  return {
    seed: "php-legacy",
    preferSeed: true,
    phpLegacy: true,
    cue: "parablepsis",
  };
}

export function seedByteExact() {
  return {
    seed: "byte-exact",
    preferSeed: true,
    diplomatic: true,
    cue: "diplomatic",
  };
}

export function seedLatin1Preserved() {
  return {
    seed: "latin1-preserved",
    preferSeed: true,
    diplomatic: true,
    cue: "diplomatic",
  };
}

export function seedCharsetSafe() {
  return {
    seed: "charset-safe",
    preferSeed: true,
    diplomatic: true,
    cue: "diplomatic",
  };
}

export function seedNoRewrite() {
  return {
    seed: "no-rewrite",
    preferSeed: true,
    diplomatic: true,
    cue: "diplomatic",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      diplomatic: false,
      parablepsis: false,
      latin1EditWipe: false,
      replacementChar: false,
      wholeFileWipe: false,
      latin1Byte: false,
      windows1252: false,
      iso88591: false,
      editWriteDecode: false,
      phpLegacy: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    diplomatic: raw.diplomatic === true,
    parablepsis: raw.parablepsis === true || raw.event === "parablepsis",
    latin1EditWipe:
      raw.latin1EditWipe === true || raw.event === "latin1-edit-wipe",
    replacementChar:
      raw.replacementChar === true || raw.event === "replacement-char",
    wholeFileWipe:
      raw.wholeFileWipe === true || raw.event === "whole-file-wipe",
    latin1Byte:
      raw.latin1Byte === true || raw.event === "latin1-byte",
    windows1252:
      raw.windows1252 === true || raw.event === "windows-1252",
    iso88591:
      raw.iso88591 === true || raw.event === "iso-8859-1",
    editWriteDecode:
      raw.editWriteDecode === true || raw.event === "edit-write-decode",
    phpLegacy:
      raw.phpLegacy === true || raw.event === "php-legacy",
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
      (ticket.diplomatic != null ||
        ticket.parablepsis != null ||
        ticket.latin1EditWipe != null ||
        ticket.replacementChar != null ||
        ticket.wholeFileWipe != null ||
        ticket.latin1Byte != null ||
        ticket.windows1252 != null ||
        ticket.iso88591 != null ||
        ticket.editWriteDecode != null ||
        ticket.phpLegacy != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isDiplomatic(row) {
  if (row.parablepsis && row.cue !== "diplomatic") return false;
  if (row.cue === "parablepsis" || row.cue === "latin1-edit-wipe") {
    return false;
  }
  if (
    row.latin1EditWipe &&
    row.replacementChar &&
    row.cue !== "diplomatic" &&
    row.diplomatic !== true
  ) {
    return false;
  }
  if (row.diplomatic === true && row.parablepsis !== true && row.cue !== "parablepsis") {
    return true;
  }
  if (
    row.cue === "diplomatic" &&
    row.parablepsis !== true &&
    row.latin1EditWipe !== true &&
    row.replacementChar !== true &&
    row.wholeFileWipe !== true &&
    row.latin1Byte !== true &&
    row.windows1252 !== true &&
    row.iso88591 !== true &&
    row.editWriteDecode !== true &&
    row.phpLegacy !== true
  ) {
    return true;
  }
  return false;
}

function isLatin1EditWipe(row) {
  return (
    row.event === "latin1-edit-wipe" &&
    !isDiplomatic(row) &&
    (row.latin1EditWipe === true ||
      row.replacementChar === true ||
      row.iso88591 === true)
  );
}

function isParablepsisRow(row) {
  if (isDiplomatic(row)) return false;
  if (isLatin1EditWipe(row) && row.cue !== "parablepsis") return false;
  if (row.cue === "parablepsis") return true;
  if (row.parablepsis === true) return true;
  if (row.latin1EditWipe === true && row.replacementChar === true) {
    return true;
  }
  if (
    row.latin1EditWipe === true ||
    row.replacementChar === true ||
    row.wholeFileWipe === true ||
    row.latin1Byte === true ||
    row.windows1252 === true ||
    row.iso88591 === true ||
    row.editWriteDecode === true ||
    row.phpLegacy === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one parablepsis pass against the collation desk.
 * diplomatic: byte-exact Latin-1 preserved.
 * parablepsis: Edit/Write UTF-8-decode wipe.
 * latin1-edit-wipe: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isLatin1EditWipe(row) ||
    (row.latin1EditWipe && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "latin1-edit-wipe";
  } else if (isParablepsisRow(row)) {
    verdict = "parablepsis";
  } else if (isDiplomatic(row)) {
    verdict = "diplomatic";
  } else if (
    row.latin1EditWipe ||
    row.replacementChar ||
    row.wholeFileWipe ||
    row.latin1Byte ||
    row.windows1252 ||
    row.iso88591 ||
    row.editWriteDecode ||
    row.phpLegacy
  ) {
    verdict = "parablepsis";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const holding = inspectWitness(row);
  const bind = inspectDecode(row);
  const write = inspectWipe(row);
  const commons = inspectCharset(row);
  const trigger = inspectTrigger(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    diplomatic: verdict === "diplomatic" || verdict === "hold",
    parablepsis: verdict === "parablepsis" || verdict === SEEDED_WORD,
    latin1EditWipe:
      row.latin1EditWipe === true ||
      verdict === "latin1-edit-wipe" ||
      verdict === PATH_WORD,
    replacementChar: row.replacementChar,
    wholeFileWipe: row.wholeFileWipe,
    latin1Byte: row.latin1Byte,
    windows1252: row.windows1252,
    iso88591: row.iso88591,
    editWriteDecode: row.editWriteDecode,
    phpLegacy: row.phpLegacy,
    cue: hold
      ? "diplomatic"
      : row.latin1EditWipe || verdict === "latin1-edit-wipe"
        ? "latin1-edit-wipe"
        : "parablepsis",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit diplomatic" : "score parablepsis",
    holdingInspect: holding,
    bindInspect: bind,
    writeInspect: write,
    commonsInspect: commons,
    triggerInspect: trigger,
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
      : PARABLEPSIS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "parablepsis");
  const path = scored.filter((row) => row.verdict === "latin1-edit-wipe");
  const diplomatic = scored.filter((row) => row.verdict === "diplomatic");
  const headline =
    scored.find((row) => row.event === "parablepsis") ||
    scored.find((row) => row.event === "latin1-edit-wipe") ||
    scored.find((row) => row.event === "replacement-char") ||
    dead[dead.length - 1];
  let verdict = "diplomatic";
  if (dead.length) verdict = "parablepsis";
  else if (path.length && !diplomatic.length) verdict = "latin1-edit-wipe";
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
    parablepsisCount: dead.length,
    pathCount: path.length,
    diplomaticCount: diplomatic.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit diplomatic" : "score parablepsis",
    note: headline
      ? "Edit/Write UTF-8-decodes Latin-1/Windows-1252 PHP and silently wipes non-ASCII bytes (¢ ½ • ü) across the whole file — 162 chars / 11 files confirmed. Cousin cite-only: #93848 Mojibake U+FFFD read-path — different defect."
      : "published parablepsis walk scored against diplomatic vs parablepsis",
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
    seeded !== "diplomatic" &&
    seeded !== "parablepsis" &&
    seeded !== "latin1-edit-wipe" &&
    ticket.diplomatic == null &&
    ticket.parablepsis == null &&
    ticket.latin1EditWipe == null &&
    ticket.replacementChar == null &&
    ticket.wholeFileWipe == null &&
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
    diplomatic: scored.diplomatic ?? false,
    parablepsis: scored.parablepsis ?? false,
    latin1EditWipe: scored.latin1EditWipe ?? false,
    replacementChar: scored.replacementChar ?? false,
    wholeFileWipe: scored.wholeFileWipe ?? false,
    latin1Byte: scored.latin1Byte ?? false,
    windows1252: scored.windows1252 ?? false,
    iso88591: scored.iso88591 ?? false,
    editWriteDecode: scored.editWriteDecode ?? false,
    phpLegacy: scored.phpLegacy ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.replacementChar || result.parablepsis ? "kind=latin1-edit-wipe" : "kind=byte-exact",
    result.wholeFileWipe || result.parablepsis ? "write=wiped" : "write=diplomatic",
    result.latin1EditWipe || result.verdict === "latin1-edit-wipe"
      ? "path=latin1-edit-wipe"
      : "path=diplomatic",
    result.cue === "diplomatic"
      ? "cue=diplomatic"
      : result.cue === "latin1-edit-wipe"
        ? "cue=latin1-edit-wipe"
        : "cue=parablepsis",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    diplomatic: result.diplomatic,
    parablepsis: result.parablepsis,
    latin1EditWipe: result.latin1EditWipe,
    replacementChar: result.replacementChar,
    wholeFileWipe: result.wholeFileWipe,
    latin1Byte: result.latin1Byte,
    windows1252: result.windows1252,
    iso88591: result.iso88591,
    editWriteDecode: result.editWriteDecode,
    phpLegacy: result.phpLegacy,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    holding: inspectWitness({
      diplomatic: result.diplomatic,
      parablepsis: result.parablepsis,
      latin1EditWipe: result.latin1EditWipe,
      replacementChar: result.replacementChar,
    }),
    bind: inspectDecode({
      diplomatic: result.diplomatic,
      parablepsis: result.parablepsis,
      latin1EditWipe: result.latin1EditWipe,
      replacementChar: result.replacementChar,
      editWriteDecode: result.editWriteDecode,
    }),
    write: inspectWipe({
      diplomatic: result.diplomatic,
      parablepsis: result.parablepsis,
      wholeFileWipe: result.wholeFileWipe,
      replacementChar: result.replacementChar,
    }),
    commons: inspectCharset({
      diplomatic: result.diplomatic,
      parablepsis: result.parablepsis,
      iso88591: result.iso88591,
      windows1252: result.windows1252,
      latin1Byte: result.latin1Byte,
    }),
    trigger: inspectTrigger({
      diplomatic: result.diplomatic,
      parablepsis: result.parablepsis,
      phpLegacy: result.phpLegacy,
      editWriteDecode: result.editWriteDecode,
    }),
    scope: mapCollation({
      diplomatic: result.diplomatic,
      parablepsis: result.parablepsis,
      latin1EditWipe: result.latin1EditWipe,
      replacementChar: result.replacementChar,
      wholeFileWipe: result.wholeFileWipe,
      latin1Byte: result.latin1Byte,
      windows1252: result.windows1252,
      iso88591: result.iso88591,
      editWriteDecode: result.editWriteDecode,
      phpLegacy: result.phpLegacy,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      parablepsis:
        result.parablepsis === true ||
        result.verdict === "parablepsis",
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
        "NON-BINDING: Edit/Write decode-as-UTF-8 then re-encode, silently substituting U+FFFD for Latin-1/Windows-1252 bytes. Invite verify against #93954 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
