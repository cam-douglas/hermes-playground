#!/usr/bin/env node
/**
 * Sepulchre — stone sepulchre / burial vault / sealed tomb /
 * ossuary niche / limestone lintel / extinguished lamp.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * If a Bash tool result contains NUL characters (U+0000), the next
 * API request is sent with a truncated body. The server cannot parse
 * it and returns 400 invalid_request_error / The request body is not
 * valid JSON: unexpected end of data. The session never recovers.
 * Every following turn rebuilds the same poisoned body. Automatic
 * model fallback retries the same body against a second model and
 * cannot help — the request is rejected before any model sees it.
 * Reading any binary as text is enough. Reproduced 10/10 on Claude
 * Code 2.1.270 with a two-step prompt: Bash greps 80-byte windows
 * near .lsp.json from a renamed release binary (poison), then a
 * follow-up turn fails. First turn completes; second and all later
 * requests fail. Truncation column ranged ~87869–88442 across runs.
 *
 *   node sepulchre.mjs data/sepulchre.json
 *   echo '{"seed":"sepulchre"}' | node sepulchre.mjs
 *
 * Idle word is living (HOLD: unsealed / breathing / open-vault / intact).
 * Seeded word is sepulchre (#94055 — the bash-nul-poison path).
 * Path word is bash-nul-poison.
 * Product score word is sepulchre (Score sepulchre or admit living.).
 *
 * Encoded from anthropics/claude-code#94055 issue text only.
 * Hypothesis (NON-BINDING): NUL bytes from a Bash tool result are
 * stored verbatim in the session transcript and reach the next request
 * body, which is truncated at the first NUL; every following turn
 * rebuilds the same poisoned body so the session stays dead; model
 * fallback retries the same body. Invite verify against #94055 text
 * only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Sneck/#94052 (chip dismiss ephemeral).
 * NOT Drawbridge/#94049 (RC bridge auto-update drop).
 * NOT Chirograph/#94045 (worktree branch rename stale).
 * NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008.
 * NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis/#93954.
 * NOT Demesne/#93989. NOT Nullarbor/#93595 (empty-expand path).
 * NOT Sigil (hollow thinking seal). NOT Cartouche/#93772.
 * Cousins cite-only: #91003 (JSON Parse Unexpected EOF discards
 * turns mid-stream), #85842 (Edit tool silently corrupts pre-existing
 * non-UTF-8 bytes), #92562 (Large Bash tool-call payloads not shown
 * in UI).
 * Sepulchre is specifically: Bash result with NUL bytes → next
 * request body truncated → permanent 400 unexpected end of data →
 * session dead forever.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "living",
  "sepulchre",
  "bash-nul-poison",
  "hold",
  "unsealed",
  "breathing",
  "open-vault",
  "intact",
  "nul-bytes",
  "truncated-body",
  "unexpected-end",
  "session-dead",
  "model-fallback-useless",
  "binary-as-text",
  "two-step-prompt",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "living";
export const PATH_WORD = "bash-nul-poison";
export const SEEDED_WORD = "sepulchre";
export const PRODUCT_WORD = "sepulchre";
export const HOLD = Object.freeze(["living", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "living",
  "unsealed",
  "breathing",
  "open-vault",
  "intact",
]);
export const RECOVER = Object.freeze(["living", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "tempered",
  "quiescent",
  "diplomatic",
  "demesned",
  "diagrammed",
  "unattainted",
  "reflowed",
  "articulate",
  "limber",
  "filiated",
  "injective",
  "unitary",
  "verbatim",
  "plenary",
  "vested",
  "singular",
  "equalized",
  "legible",
  "calibrated",
  "tethered",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "lit",
  "primed",
  "raised",
  "preserved",
  "tokenized",
  "sprung",
  "unpinned",
  "latched",
  "sealed",
  "liveried",
  "stamped",
  "emptied",
  "warm",
  "mounted",
  "traced",
  "damped",
  "afloat",
  "concordant",
  "routed",
  "bound",
  "honest",
  "fossed",
  "scapegoated",
  "accreted",
  "mismatched",
  "inherited",
  "washed",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "nullarbor",
  "sigil",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "quota-spawn-cascade",
  "layer-tree-walk",
  "latin1-edit-wipe",
  "home-bind-overreach",
  "undone",
  "open-latch",
  "stayed-off",
  "withheld",
  "open-span",
  "linked",
  "moored",
  "joined",
  "bipartite",
  "moiety",
  "indenture",
  "current",
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
  "fibula",
  "cockade",
  "hasp",
  "snib",
  "bulla",
  "livery",
  "mondegreen",
  "diplopia",
  "fulcrum",
  "followspot",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "sepulchre"),
);

export const FEATURED_ISSUE = 94055;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94055";
export const TITLE =
  "Session dies permanently with `400 ... unexpected end of data` after a Bash result containing NUL bytes";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:linux",
  "area:bash",
]);
export const PLATFORM = "linux";
export const SURFACE = "bash-nul-poison";
export const HOST = "Claude Code CLI Bash tool result";
export const CHECKED_ON =
  "Claude Code 2.1.270 (also seen on 2.1.266 and 2.1.218); Linux aarch64; CLI directly; empty directory; --strict-mcp-config";
export const BUILD = "2.1.270";
export const SELECTED_MODEL = "haiku (also Sonnet and Opus)";
export const OS = "linux";
export const PHRASE = "Score sepulchre or admit living.";
export const DISTRIBUTION =
  "If a Bash tool result contains NUL characters (U+0000), the next API request is sent with a truncated body. Server returns 400 invalid_request_error / The request body is not valid JSON: unexpected end of data. The session never recovers — every following turn rebuilds the same poisoned body. Automatic model fallback retries the same body against a second model and cannot help (rejected before any model sees it). Reading any binary as text is enough. Reproduced 10/10 on Claude Code 2.1.270 with a two-step prompt: Bash greps 80-byte windows near .lsp.json from a renamed release binary (poison), then a follow-up turn fails. First turn completes; second and all later requests fail. Truncation column ranged ~87869–88442 across runs. The grep succeeds and returns 80 byte windows of the file's string table, which contain NUL padding (37 NUL bytes sit within 80 bytes of the .lsp.json string). The two-step prompt matters only because a second request is needed to carry the poisoned tool result. Any follow-up turn fails. The cut point tracks the position of the NUL, not the size of the body. Shortest form: head -c 300 /bin/bash (ELF header, 225 of them NUL). Bash already rejects control characters in the command; Read tool detects a binary and never emits raw bytes; Bash tool output has no equivalent check. A 4 KB result containing 76 NUL characters is accepted with is_error: false. Not a context window problem. Not payload size. Not the model. Sessions cannot be rescued from inside the product; resuming replays the stored transcript.";

export const RULED_OUT = Object.freeze([
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss, not NUL truncation",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span after auto-update",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed after git branch -m",
  "Titulus/#94025 resume-stale-title — iOS rename vs desktop sidebar title cache",
  "Derelict/#93996 session-kill-orphan — Bash-tool subprocesses survive session stop",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`",
  "Nullarbor/#93595 empty-expand path — different defect",
  "Sigil — hollow thinking seal; different paradigm",
  "Cartouche/#93772 section-poster — wrong diagram type",
]);
export const EXPECTED = Object.freeze([
  "Control characters that cannot survive the request path are stripped or escaped before the body is built",
  "Or the tool result is rejected at capture time with a clear error",
  "Bash tool output should have an equivalent check to the Read tool binary detection",
  "A 4 KB result containing NUL characters must not be accepted with is_error: false",
  "Sessions must be recoverable; sanitise where the request body is built so replayed transcripts resume",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "nul-bytes",
    label: "NUL bytes",
    count: "U+0000 in Bash result",
    note: "37 NUL bytes sit within 80 bytes of the .lsp.json string; 225 of first 300 /bin/bash bytes are NUL",
  },
  {
    id: "truncated-body",
    label: "truncated body",
    count: "col ~87869–88442",
    note: "Next API request is sent with a truncated body; cut point tracks the NUL, not body size",
  },
  {
    id: "unexpected-end",
    label: "unexpected end of data",
    count: "400 invalid_request_error",
    note: "The request body is not valid JSON: unexpected end of data",
  },
  {
    id: "session-dead",
    label: "session dead",
    count: "every later turn",
    note: "First turn completes; second and all later requests fail; resume replays the same transcript",
  },
  {
    id: "model-fallback-useless",
    label: "model fallback useless",
    count: "same body",
    note: "Automatic model fallback retries the same body against a second model; rejected before any model sees it",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "living-vault",
    survey:
      "vault stays living; lamp still burns; JSON stream intact; Bash result carries no NUL into the next request",
    kind: "living",
    note: "idle: living — the hold/good path",
  },
  {
    id: "nul-bytes",
    survey:
      "Bash greps 80-byte windows near .lsp.json from a renamed release binary (poison); NUL padding lands in the tool result",
    kind: "sepulchre",
    note: "seeded: nul-bytes of the published repro",
  },
  {
    id: "bash-nul-poison",
    survey:
      "next request body is truncated at the first NUL; server returns 400 unexpected end of data",
    kind: "sepulchre",
    note: "path: bash-nul-poison names the cut stream",
  },
  {
    id: "session-dead",
    survey:
      "every following turn rebuilds the same poisoned body; model fallback cannot help; session never recovers",
    kind: "sepulchre",
    note: "seeded: session-dead of the permanent 400",
  },
  {
    id: "sepulchre",
    survey:
      "the booth is sepulchre — the session is permanently entombed after NUL poison cuts the JSON stream",
    kind: "sepulchre",
    note: "seeded: sepulchre — Score sepulchre or admit living.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "bash-nul-poison",
  "sepulchre",
  "nul-bytes",
  "truncated-body",
  "unexpected-end",
  "session-dead",
  "model-fallback-useless",
  "binary-as-text",
  "two-step-prompt",
]);

export const COUSINS = Object.freeze([
  {
    issue: 91003,
    title: "JSON Parse Unexpected EOF discards turns mid-stream",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — JSON Parse Unexpected EOF discards turns mid-stream. Different defect. Do not conflate with Bash NUL truncation of the next request body.",
  },
  {
    issue: 85842,
    title: "Edit tool silently corrupts pre-existing non-UTF-8 bytes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Edit tool silently corrupts pre-existing non-UTF-8 bytes. Different defect. Do not conflate with Bash result NUL poison.",
  },
  {
    issue: 92562,
    title: "Large Bash tool-call payloads not shown in UI",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Large Bash tool-call payloads not shown in UI. Display gap, not truncated request body / permanent 400.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94059, title: "backup #94059", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94041, title: "backup #94041", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94032, title: "backup #94032", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94031, title: "backup #94031", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "nullarbor",
  "sigil",
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
]);

export const SAMPLE_KIND_IDLE = "open-vault";
export const SAMPLE_KIND_SEEDED = "bash-nul-poison";
export const SAMPLE_HOLDING_IDLE = "intact";
export const SAMPLE_HOLDING_SEEDED = "entombed";

export const SAMPLE_LIVING_PROOF = Object.freeze({
  living: true,
  sepulchre: false,
  bashNulPoison: false,
  nulBytes: false,
  truncatedBody: false,
  unexpectedEnd: false,
  sessionDead: false,
  modelFallbackUseless: false,
  binaryAsText: false,
  twoStepPrompt: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SEPULCHRE_PROOF = Object.freeze({
  living: false,
  sepulchre: true,
  bashNulPoison: true,
  nulBytes: true,
  truncatedBody: true,
  unexpectedEnd: true,
  sessionDead: true,
  modelFallbackUseless: true,
  binaryAsText: true,
  twoStepPrompt: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds living: vault unsealed; lamp still burns; JSON stream intact" },
  { t: "nul-bytes", line: "Bash greps 80-byte windows near .lsp.json from poison; NUL padding lands in the tool result" },
  { t: "two-step-prompt", line: "first turn completes; follow-up turn carries the poisoned result" },
  { t: "path", line: "bash-nul-poison — next request body truncated at the first NUL; 400 unexpected end of data" },
  { t: "score", line: "when the lamp is extinguished the booth is sepulchre — Score sepulchre or admit living." },
]);

/**
 * Vault map: living open-vault vs entombed sepulchre.
 * Idle/living: lamp burns; JSON stream intact; no NUL in the next request.
 * Seeded/sepulchre: NUL cuts the body; session entombed forever.
 */
export function mapVault(input = {}) {
  const sepulchre = isSepulchreInput(input);
  const living = input.living === true && !sepulchre;
  return {
    stamp: sepulchre ? "bash-nul-poison" : "living-vault",
    holdingLane: sepulchre ? "entombed" : "intact",
    kindLane: sepulchre ? "bash-nul-poison" : "open-vault",
    bindLane: sepulchre ? "truncated-body" : "breathing",
    ribbon: sepulchre ? "sepulchre" : "living",
    living,
  };
}

export function inspectVault(input = {}) {
  const entombed = isSepulchreInput(input);
  if (input.living === true && !entombed) {
    return {
      stamp: "vault-unsealed",
      entombed: false,
    };
  }
  return {
    stamp: entombed ? "vault-entombed" : "vault-idle",
    entombed,
    note: entombed
      ? "the stone sepulchre is a burial vault — NUL poison cuts the JSON stream and the session is permanently entombed"
      : "",
  };
}

export function inspectNul(input = {}) {
  const present =
    input.nulBytes === true ||
    input.binaryAsText === true ||
    input.sepulchre === true;
  if (input.living === true && !present) {
    return {
      stamp: "nul-absent",
      present: false,
    };
  }
  return {
    stamp: present ? "nul-bytes" : "nul-idle",
    present,
    note: present
      ? "Bash result contains NUL characters (U+0000); 37 NUL bytes sit within 80 bytes of .lsp.json; reading any binary as text is enough"
      : "",
  };
}

export function inspectStream(input = {}) {
  const cut =
    input.truncatedBody === true ||
    input.unexpectedEnd === true ||
    input.bashNulPoison === true ||
    input.sepulchre === true;
  if (input.living === true && !cut) {
    return {
      stamp: "stream-intact",
      cut: false,
    };
  }
  return {
    stamp: cut ? "truncated-body" : "stream-idle",
    cut,
    note: cut
      ? "next API request is sent with a truncated body; 400 invalid_request_error / unexpected end of data; column ~87869–88442"
      : "",
  };
}

export function inspectFallback(input = {}) {
  const useless =
    input.modelFallbackUseless === true ||
    input.sessionDead === true ||
    input.sepulchre === true;
  if (input.living === true && !useless) {
    return {
      stamp: "fallback-helpful",
      useless: false,
    };
  }
  return {
    stamp: useless ? "model-fallback-useless" : "fallback-idle",
    useless,
    note: useless
      ? "automatic model fallback retries the same poisoned body against a second model; rejected before any model sees it"
      : "",
  };
}

export function inspectBinary(input = {}) {
  const read =
    input.binaryAsText === true ||
    input.twoStepPrompt === true ||
    input.sepulchre === true;
  if (input.living === true && !read) {
    return {
      stamp: "binary-held",
      read: false,
    };
  }
  return {
    stamp: read ? "binary-as-text" : "binary-idle",
    read,
    note: read
      ? "two-step prompt: Bash greps 80-byte windows from poison, then a follow-up turn fails; first turn completes"
      : "",
  };
}

function isSepulchreInput(input = {}) {
  return (
    input.sepulchre === true ||
    input.bashNulPoison === true ||
    input.nulBytes === true ||
    input.truncatedBody === true ||
    input.unexpectedEnd === true ||
    input.sessionDead === true ||
    input.modelFallbackUseless === true ||
    input.binaryAsText === true ||
    input.twoStepPrompt === true
  );
}

export function readBooth(input = {}) {
  const sepulchre = isSepulchreInput(input);
  const living = input.living === true && !sepulchre;
  return {
    mark: sepulchre ? "sepulchre" : living || !sepulchre ? "living" : "sepulchre",
    living,
    sepulchre,
    bashNulPoison: input.bashNulPoison === true || sepulchre,
    nulBytes: input.nulBytes === true,
    truncatedBody: input.truncatedBody === true,
    unexpectedEnd: input.unexpectedEnd === true,
    sessionDead: input.sessionDead === true,
    modelFallbackUseless: input.modelFallbackUseless === true,
    binaryAsText: input.binaryAsText === true,
    twoStepPrompt: input.twoStepPrompt === true,
    scope: mapVault(input),
    vault: inspectVault(input),
    nul: inspectNul(input),
    stream: inspectStream(input),
    fallback: inspectFallback(input),
    binary: inspectBinary(input),
    log: input.log || [],
  };
}

export const SEPULCHRE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-living",
    living: true,
    sepulchre: false,
    cue: "living",
    note: "idle HOLD: vault stays living; lamp still burns; JSON stream intact — the hold/good path",
  },
  {
    t: "nul-bytes",
    event: "nul-bytes",
    sepulchre: true,
    nulBytes: true,
    binaryAsText: true,
    cue: "sepulchre",
    note: "Bash greps 80-byte windows near .lsp.json from poison; NUL padding lands in the tool result",
  },
  {
    t: "two-step-prompt",
    event: "two-step-prompt",
    sepulchre: true,
    twoStepPrompt: true,
    sessionDead: true,
    cue: "sepulchre",
    note: "first turn completes; follow-up turn carries the poisoned result and fails",
  },
  {
    t: "path",
    event: "bash-nul-poison",
    sepulchre: true,
    bashNulPoison: true,
    truncatedBody: true,
    unexpectedEnd: true,
    cue: "sepulchre",
    note: "bash-nul-poison — next request body truncated at the first NUL; 400 unexpected end of data",
  },
  {
    t: "score",
    event: "sepulchre",
    sepulchre: true,
    bashNulPoison: true,
    nulBytes: true,
    truncatedBody: true,
    unexpectedEnd: true,
    sessionDead: true,
    modelFallbackUseless: true,
    binaryAsText: true,
    twoStepPrompt: true,
    cue: "sepulchre",
    note: "sepulchre — when the lamp is extinguished the booth is sepulchre",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-living",
    living: true,
    sepulchre: false,
    cue: "living",
    note: "positive control: lamp still burns; JSON stream intact",
  },
  {
    t: "announce",
    event: "cue-living",
    living: true,
    cue: "living",
    note: "positive control: the vault stays living",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    living: true,
    sepulchre: false,
    bashNulPoison: false,
    cue: "living",
  };
}

export function seedLiving() {
  return { ...emptyTicket() };
}

export function seedSepulchre() {
  return {
    seed: SEEDED_WORD,
    living: false,
    sepulchre: true,
    bashNulPoison: true,
    nulBytes: true,
    truncatedBody: true,
    unexpectedEnd: true,
    sessionDead: true,
    modelFallbackUseless: true,
    binaryAsText: true,
    twoStepPrompt: true,
    cue: "sepulchre",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SEPULCHRE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    sepulchre: true,
    bashNulPoison: true,
    nulBytes: true,
    cue: "sepulchre",
  };
}

export function seedBashNulPoison() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    sepulchre: true,
    bashNulPoison: true,
    truncatedBody: true,
    event: "bash-nul-poison",
    cue: "sepulchre",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    living: true,
    cue: "living",
  };
}

export function seedUnsealed() {
  return {
    seed: "unsealed",
    preferSeed: true,
    living: true,
    cue: "living",
  };
}

export function seedBreathing() {
  return {
    seed: "breathing",
    preferSeed: true,
    living: true,
    cue: "living",
  };
}

export function seedOpenVault() {
  return {
    seed: "open-vault",
    preferSeed: true,
    living: true,
    cue: "living",
  };
}

export function seedIntact() {
  return {
    seed: "intact",
    preferSeed: true,
    living: true,
    cue: "living",
  };
}

export function seedNulBytes() {
  return {
    seed: "nul-bytes",
    preferSeed: true,
    nulBytes: true,
    cue: "sepulchre",
  };
}

export function seedTruncatedBody() {
  return {
    seed: "truncated-body",
    preferSeed: true,
    truncatedBody: true,
    cue: "sepulchre",
  };
}

export function seedUnexpectedEnd() {
  return {
    seed: "unexpected-end",
    preferSeed: true,
    unexpectedEnd: true,
    cue: "sepulchre",
  };
}

export function seedSessionDead() {
  return {
    seed: "session-dead",
    preferSeed: true,
    sessionDead: true,
    cue: "sepulchre",
  };
}

export function seedModelFallbackUseless() {
  return {
    seed: "model-fallback-useless",
    preferSeed: true,
    modelFallbackUseless: true,
    cue: "sepulchre",
  };
}

export function seedBinaryAsText() {
  return {
    seed: "binary-as-text",
    preferSeed: true,
    binaryAsText: true,
    cue: "sepulchre",
  };
}

export function seedTwoStepPrompt() {
  return {
    seed: "two-step-prompt",
    preferSeed: true,
    twoStepPrompt: true,
    cue: "sepulchre",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      living: false,
      sepulchre: false,
      bashNulPoison: false,
      nulBytes: false,
      truncatedBody: false,
      unexpectedEnd: false,
      sessionDead: false,
      modelFallbackUseless: false,
      binaryAsText: false,
      twoStepPrompt: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    living: raw.living === true,
    sepulchre: raw.sepulchre === true || raw.event === "sepulchre",
    bashNulPoison:
      raw.bashNulPoison === true || raw.event === "bash-nul-poison",
    nulBytes: raw.nulBytes === true || raw.event === "nul-bytes",
    truncatedBody:
      raw.truncatedBody === true || raw.event === "truncated-body",
    unexpectedEnd:
      raw.unexpectedEnd === true || raw.event === "unexpected-end",
    sessionDead: raw.sessionDead === true || raw.event === "session-dead",
    modelFallbackUseless:
      raw.modelFallbackUseless === true ||
      raw.event === "model-fallback-useless",
    binaryAsText:
      raw.binaryAsText === true || raw.event === "binary-as-text",
    twoStepPrompt:
      raw.twoStepPrompt === true || raw.event === "two-step-prompt",
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
      (ticket.living != null ||
        ticket.sepulchre != null ||
        ticket.bashNulPoison != null ||
        ticket.nulBytes != null ||
        ticket.truncatedBody != null ||
        ticket.unexpectedEnd != null ||
        ticket.sessionDead != null ||
        ticket.modelFallbackUseless != null ||
        ticket.binaryAsText != null ||
        ticket.twoStepPrompt != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isLiving(row) {
  if (row.sepulchre && row.cue !== "living") return false;
  if (row.cue === "sepulchre" || row.cue === "bash-nul-poison") {
    return false;
  }
  if (
    row.bashNulPoison &&
    row.truncatedBody &&
    row.cue !== "living" &&
    row.living !== true
  ) {
    return false;
  }
  if (row.living === true && row.sepulchre !== true && row.cue !== "sepulchre") {
    return true;
  }
  if (
    row.cue === "living" &&
    row.sepulchre !== true &&
    row.bashNulPoison !== true &&
    row.nulBytes !== true &&
    row.truncatedBody !== true &&
    row.unexpectedEnd !== true &&
    row.sessionDead !== true &&
    row.modelFallbackUseless !== true &&
    row.binaryAsText !== true &&
    row.twoStepPrompt !== true
  ) {
    return true;
  }
  return false;
}

function isBashNulPoison(row) {
  return (
    row.event === "bash-nul-poison" &&
    !isLiving(row) &&
    (row.bashNulPoison === true ||
      row.truncatedBody === true ||
      row.unexpectedEnd === true)
  );
}

function isSepulchreRow(row) {
  if (isLiving(row)) return false;
  if (isBashNulPoison(row) && row.cue !== "sepulchre") return false;
  if (row.cue === "sepulchre") return true;
  if (row.sepulchre === true) return true;
  if (row.bashNulPoison === true && row.truncatedBody === true) {
    return true;
  }
  if (
    row.bashNulPoison === true ||
    row.nulBytes === true ||
    row.truncatedBody === true ||
    row.unexpectedEnd === true ||
    row.sessionDead === true ||
    row.modelFallbackUseless === true ||
    row.binaryAsText === true ||
    row.twoStepPrompt === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one sepulchre pass against the burial vault.
 * living: lamp burns; JSON stream intact; no NUL in the next request.
 * sepulchre: NUL cuts the body; session entombed forever.
 * bash-nul-poison: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isBashNulPoison(row) ||
    (row.bashNulPoison && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "bash-nul-poison";
  } else if (isSepulchreRow(row)) {
    verdict = "sepulchre";
  } else if (isLiving(row)) {
    verdict = "living";
  } else if (
    row.bashNulPoison ||
    row.nulBytes ||
    row.truncatedBody ||
    row.unexpectedEnd ||
    row.sessionDead ||
    row.modelFallbackUseless ||
    row.binaryAsText ||
    row.twoStepPrompt
  ) {
    verdict = "sepulchre";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const vault = inspectVault(row);
  const nul = inspectNul(row);
  const stream = inspectStream(row);
  const fallback = inspectFallback(row);
  const binary = inspectBinary(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    living: verdict === "living" || verdict === "hold",
    sepulchre: verdict === "sepulchre" || verdict === SEEDED_WORD,
    bashNulPoison:
      row.bashNulPoison === true ||
      verdict === "bash-nul-poison" ||
      verdict === PATH_WORD,
    nulBytes: row.nulBytes,
    truncatedBody: row.truncatedBody,
    unexpectedEnd: row.unexpectedEnd,
    sessionDead: row.sessionDead,
    modelFallbackUseless: row.modelFallbackUseless,
    binaryAsText: row.binaryAsText,
    twoStepPrompt: row.twoStepPrompt,
    cue: hold
      ? "living"
      : row.bashNulPoison || verdict === "bash-nul-poison"
        ? "bash-nul-poison"
        : "sepulchre",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit living" : "score sepulchre",
    vaultInspect: vault,
    nulInspect: nul,
    streamInspect: stream,
    fallbackInspect: fallback,
    binaryInspect: binary,
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
      : SEPULCHRE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "sepulchre");
  const path = scored.filter((row) => row.verdict === "bash-nul-poison");
  const living = scored.filter((row) => row.verdict === "living");
  const headline =
    scored.find((row) => row.event === "sepulchre") ||
    scored.find((row) => row.event === "bash-nul-poison") ||
    scored.find((row) => row.event === "two-step-prompt") ||
    dead[dead.length - 1];
  let verdict = "living";
  if (dead.length) verdict = "sepulchre";
  else if (path.length && !living.length) verdict = "bash-nul-poison";
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
    sepulchreCount: dead.length,
    pathCount: path.length,
    livingCount: living.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit living" : "score sepulchre",
    note: headline
      ? "Bash result with NUL bytes → next request body truncated → permanent 400 unexpected end of data → session dead forever. Cousins cite-only: #91003 #85842 #92562."
      : "published sepulchre walk scored against living vs sepulchre",
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
    seeded !== "living" &&
    seeded !== "sepulchre" &&
    seeded !== "bash-nul-poison" &&
    ticket.living == null &&
    ticket.sepulchre == null &&
    ticket.bashNulPoison == null &&
    ticket.truncatedBody == null &&
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
    living: scored.living ?? false,
    sepulchre: scored.sepulchre ?? false,
    bashNulPoison: scored.bashNulPoison ?? false,
    nulBytes: scored.nulBytes ?? false,
    truncatedBody: scored.truncatedBody ?? false,
    unexpectedEnd: scored.unexpectedEnd ?? false,
    sessionDead: scored.sessionDead ?? false,
    modelFallbackUseless: scored.modelFallbackUseless ?? false,
    binaryAsText: scored.binaryAsText ?? false,
    twoStepPrompt: scored.twoStepPrompt ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.truncatedBody || result.sepulchre
      ? "kind=bash-nul-poison"
      : "kind=open-vault",
    result.nulBytes || result.sepulchre ? "ref=nul" : "ref=intact",
    result.bashNulPoison || result.verdict === "bash-nul-poison"
      ? "path=bash-nul-poison"
      : "path=living",
    result.cue === "living"
      ? "cue=living"
      : result.cue === "bash-nul-poison"
        ? "cue=bash-nul-poison"
        : "cue=sepulchre",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    living: result.living,
    sepulchre: result.sepulchre,
    bashNulPoison: result.bashNulPoison,
    nulBytes: result.nulBytes,
    truncatedBody: result.truncatedBody,
    unexpectedEnd: result.unexpectedEnd,
    sessionDead: result.sessionDead,
    modelFallbackUseless: result.modelFallbackUseless,
    binaryAsText: result.binaryAsText,
    twoStepPrompt: result.twoStepPrompt,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    vault: inspectVault({
      living: result.living,
      sepulchre: result.sepulchre,
      bashNulPoison: result.bashNulPoison,
    }),
    nul: inspectNul({
      living: result.living,
      sepulchre: result.sepulchre,
      nulBytes: result.nulBytes,
      binaryAsText: result.binaryAsText,
    }),
    stream: inspectStream({
      living: result.living,
      sepulchre: result.sepulchre,
      truncatedBody: result.truncatedBody,
      unexpectedEnd: result.unexpectedEnd,
      bashNulPoison: result.bashNulPoison,
    }),
    fallback: inspectFallback({
      living: result.living,
      sepulchre: result.sepulchre,
      modelFallbackUseless: result.modelFallbackUseless,
      sessionDead: result.sessionDead,
    }),
    binary: inspectBinary({
      living: result.living,
      sepulchre: result.sepulchre,
      binaryAsText: result.binaryAsText,
      twoStepPrompt: result.twoStepPrompt,
    }),
    scope: mapVault({
      living: result.living,
      sepulchre: result.sepulchre,
      bashNulPoison: result.bashNulPoison,
      nulBytes: result.nulBytes,
      truncatedBody: result.truncatedBody,
      unexpectedEnd: result.unexpectedEnd,
      sessionDead: result.sessionDead,
      modelFallbackUseless: result.modelFallbackUseless,
      binaryAsText: result.binaryAsText,
      twoStepPrompt: result.twoStepPrompt,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      sepulchre: result.sepulchre === true || result.verdict === "sepulchre",
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
        "NON-BINDING: NUL bytes from a Bash tool result are stored verbatim in the session transcript and reach the next request body, which is truncated at the first NUL; every following turn rebuilds the same poisoned body so the session stays dead; model fallback retries the same body. Invite verify against #94055 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
