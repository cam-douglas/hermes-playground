#!/usr/bin/env node
/**
 * Epitome — classical scriptorium / abridger's desk / folio-compress /
 * quill-knife / binding-press / gold-rule booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop & Mobile inject --thinking-display summarized into every
 * CLI spawn via a hardcoded feature flag (summarizedThinking, ID
 * 3531779070). Thinking blocks arrive with empty content
 * ("thinking": "") while the signature remains. thinking_tokens in
 * usage is non-zero — the model IS thinking; the folio body is
 * stripped. User pref showThinkingSummaries only toggles summarized
 * (empty content) vs omitted (no thinking blocks). Neither restores
 * full chains. No user-facing setting, env var, or CLI flag opts out
 * on desktop/mobile.
 *
 *   node epitome.mjs data/epitome.json
 *   echo '{"seed":"epitome"}' | node epitome.mjs
 *
 * Idle word is unabridged (HOLD: full-chain / verbatim / open-folio /
 * intact-thinking / chain-open).
 * Seeded word is epitome (#94032 — the summarized-thinking-force path).
 * Path word is summarized-thinking-force.
 * Product score word is epitome (Score epitome or admit unabridged.).
 *
 * Encoded from anthropics/claude-code#94032 issue text only.
 * Hypothesis (NON-BINDING): desktop/mobile hardcodes summarizedThinking
 * so buildBaseExtraArgs always sets --thinking-display summarized;
 * preference cannot request full; continuation CLI spawn bypasses
 * injection. Invite verify against #94032 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 *
 * NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041.
 * NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049.
 * NOT Chirograph/#94045. NOT Titulus. NOT Derelict. NOT Vestry.
 * NOT Mondegreen. NOT Afterimage/#92596. NOT Phosphene. NOT Scotoma.
 * NOT Scrim (runtime DLP redaction — different product).
 * Cousins cite-only: #49268, #77460, #31326.
 * Epitome is specifically: forced abridgement of thinking content by
 * a hardcoded feature flag — the folio keeps its signature/spine
 * while the thinking text is gone.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "unabridged",
  "epitome",
  "summarized-thinking-force",
  "hold",
  "full-chain",
  "verbatim",
  "open-folio",
  "intact-thinking",
  "chain-open",
  "empty-thinking",
  "signature-only",
  "thinking-tokens-nonzero",
  "show-summaries-toggle",
  "omitted-vs-summarized",
  "continuation-full",
  "desktop-inject",
  "flag-3531779070",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "unabridged";
export const PATH_WORD = "summarized-thinking-force";
export const SEEDED_WORD = "epitome";
export const PRODUCT_WORD = "epitome";
export const HOLD = Object.freeze(["unabridged", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "unabridged",
  "full-chain",
  "verbatim",
  "open-folio",
  "intact-thinking",
  "chain-open",
]);
export const RECOVER = Object.freeze(["unabridged", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "innocent",
  "sealed",
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "latent",
  "flushed",
  "waved",
  "passable",
  "tokenized",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "layer-tree-walk",
  "substring-scan",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "epitome"),
);

export const FEATURED_ISSUE = 94032;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94032";
export const TITLE =
  "[BUG] Desktop & Mobile: summarizedThinking feature flag (3531779070) forces --thinking-display summarized on all models with no user opt-out — full thinking chains completely inaccessible";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "platform:ios",
  "area:desktop",
]);
export const PLATFORM = "macos+ios";
export const SURFACE = "summarized-thinking-force";
export const HOST =
  "Claude Code desktop & mobile (summarizedThinking 3531779070)";
export const CHECKED_ON =
  "Claude Code 2.1.247; macOS desktop + iOS mobile; Pro subscription";
export const BUILD = "Claude Code 2.1.247";
export const SELECTED_MODEL =
  "claude-opus-4-6/4-7/4-8, claude-sonnet-5/4-6, claude-haiku-4-5";
export const OS = "macos + ios";
export const PHRASE = "Score epitome or admit unabridged.";
export const DISTRIBUTION =
  "Desktop and mobile apps inject --thinking-display summarized into every CLI spawn via hardcoded feature flag summarizedThinking (ID 3531779070). Thinking blocks arrive with empty content: \"thinking\": \"\" (signature present). thinking_tokens in usage is non-zero — the model IS thinking; content is stripped. User pref showThinkingSummaries only toggles between summarized (empty content) and omitted (no thinking blocks) — neither restores full chains. No user-facing setting, env var, or CLI flag to opt out on desktop/mobile. Confirmed across models: claude-opus-4-6/4-7/4-8, claude-sonnet-5/4-6, claude-haiku-4-5 on macOS desktop and iOS mobile. Pro subscription. Logs: [CCD] thinking display → summarized (view_open) in ~/Library/Logs/Claude/main1.log. Continuation sessions (CLI on context overflow) return FULL thinking — API supports it; desktop/mobile layer strips it. Workarounds that work: Terminal CLI; continuation sessions (CLI self-spawn bypasses desktop buildBaseExtraArgs()). Reverse-engineered note in issue: flag hardcoded true via WC(true); both branches of buildBaseExtraArgs set a thinking-display value; no path leaves it unset for full thinking. Regression; last working unknown; ~before 2026-08-25. Claude Code Version 2.1.247.";

export const RULED_OUT = Object.freeze([
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre/#94055 bash-nul-poison — Bash NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed",
  "Titulus — resume-stale-title; different plaque",
  "Derelict — session-kill-orphan; different hulk",
  "Vestry — mount-refcount-race; different sacristy",
  "Mondegreen — substring-scan; different lyric ear",
  "Afterimage/#92596 — Windows text paint latency (CRT phosphor)",
  "Phosphene — layer-tree-walk; vision flash",
  "Scotoma — /goal lived only in command-args; vision gap",
  "Scrim — runtime DLP redaction; different product",
]);
export const EXPECTED = Object.freeze([
  "Users should be able to see full thinking chains (complete thinking content in thinking blocks), not empty strings",
  "There should be a way to opt out of the summarizedThinking feature flag",
  "A thinkingDisplay: \"full\" setting in settings.json, an environment variable, or a CLI flag",
  "showThinkingSummaries must not be the only control (summarized ↔ omitted leaves no full-chain path)",
  "Desktop/mobile must not hard-force --thinking-display summarized on every CLI spawn",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "empty-thinking",
    label: "empty thinking",
    count: '"thinking": ""',
    note: "Thinking blocks arrive with empty content; signature present",
  },
  {
    id: "signature-only",
    label: "signature only",
    count: "signature EuYBCk…",
    note: "Spine/signature remains; folio body is gone",
  },
  {
    id: "thinking-tokens-nonzero",
    label: "tokens nonzero",
    count: "thinking_tokens > 0",
    note: "Usage thinking_tokens is non-zero — the model IS thinking; content is stripped",
  },
  {
    id: "show-summaries-toggle",
    label: "summaries toggle",
    count: "showThinkingSummaries",
    note: "User pref only toggles summarized (empty) ↔ omitted (no blocks)",
  },
  {
    id: "desktop-inject",
    label: "desktop inject",
    count: "--thinking-display summarized",
    note: "Desktop/mobile inject the flag into every CLI spawn via buildBaseExtraArgs()",
  },
  {
    id: "flag-3531779070",
    label: "flag 3531779070",
    count: "summarizedThinking WC(true)",
    note: "Feature flag hardcoded true; both branches set a thinking-display value",
  },
]);

export const ABRIDGEMENT_SHAPES = Object.freeze([
  {
    id: "empty-thinking",
    forced: '{"type":"thinking","thinking":"","signature":"EuYBCk..."}',
    control: "full thinking content in the thinking block",
    story: "folio body emptied; signature/spine remains",
  },
  {
    id: "signature-only",
    forced: "signature present; thinking text gone",
    control: "signature plus complete thinking text",
    story: "the epitome keeps the spine and cuts the body",
  },
  {
    id: "thinking-tokens-nonzero",
    forced: "thinking_tokens non-zero with empty content",
    control: "tokens match visible thinking text",
    story: "the model thinks; the abridger discards the text",
  },
  {
    id: "show-summaries-toggle",
    forced: "summarized ↔ omitted only",
    control: "full / verbatim / thinkingDisplay: full",
    story: "no user path leaves thinking-display unset",
  },
  {
    id: "desktop-inject",
    forced: "--thinking-display summarized on every CLI spawn",
    control: "Terminal CLI; continuation CLI self-spawn",
    story: "desktop/mobile layer injects; CLI bypasses buildBaseExtraArgs()",
  },
  {
    id: "flag-3531779070",
    forced: "summarizedThinking (3531779070) hardcoded WC(true)",
    control: "flag off or unset thinking-display for full chains",
    story: "both branches of buildBaseExtraArgs set a thinking-display value",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "unabridged-folio",
    survey:
      "desk stays oak-dark; folio stays open; gold-rule holds the full chain; knife sheathed; press idle",
    kind: "unabridged",
    note: "idle: unabridged — the hold/good path",
  },
  {
    id: "empty-thinking",
    survey:
      "thinking blocks arrive with empty content; signature present; tokens nonzero",
    kind: "epitome",
    note: "seeded: empty folio body",
  },
  {
    id: "summarized-thinking-force",
    survey:
      "desktop/mobile hard-force --thinking-display summarized; no full-chain opt-out",
    kind: "epitome",
    note: "path: summarized-thinking-force names the abridgement",
  },
  {
    id: "flag-3531779070",
    survey:
      "summarizedThinking (3531779070) hardcoded true; both branches set a display value",
    kind: "epitome",
    note: "seeded: published flag",
  },
  {
    id: "epitome",
    survey:
      "the booth is epitome — a condensed abridgement whose body is gone",
    kind: "epitome",
    note: "seeded: epitome — Score epitome or admit unabridged.",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "summarized-thinking-force",
  "epitome",
  "empty-thinking",
  "signature-only",
  "thinking-tokens-nonzero",
  "show-summaries-toggle",
  "omitted-vs-summarized",
  "continuation-full",
  "desktop-inject",
  "flag-3531779070",
]);

export const COUSINS = Object.freeze([
  {
    issue: 49268,
    title:
      'Opus 4.7 display omitted default — different mechanism, same symptom',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Opus 4.7 display omitted default. Different mechanism, same empty-thinking symptom. Do not rebuild. Do not conflate.",
  },
  {
    issue: 77460,
    title:
      "Desktop ignores showThinkingSummaries on 4.7+/Fable 5",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — closed, partial fix. Desktop ignored showThinkingSummaries on 4.7+/Fable 5. Adjacent family, not the hardcoded summarizedThinking force.",
  },
  {
    issue: 31326,
    title: "Terminal analog",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Terminal analog. Different surface. Do not rebuild.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94031, title: "backup #94031 VoiceOver typing echo", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059 bg tasks stale Running / ssh stdin hang", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
]);

export const SAMPLE_KIND_IDLE = "open-folio";
export const SAMPLE_KIND_SEEDED = "summarized-thinking-force";
export const SAMPLE_HOLDING_IDLE = "verbatim";
export const SAMPLE_HOLDING_SEEDED = "abridged";

export const SAMPLE_UNABRIDGED_PROOF = Object.freeze({
  unabridged: true,
  epitome: false,
  summarizedThinkingForce: false,
  emptyThinking: false,
  signatureOnly: false,
  thinkingTokensNonzero: false,
  showSummariesToggle: false,
  omittedVsSummarized: false,
  continuationFull: false,
  desktopInject: false,
  flag3531779070: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_EPITOME_PROOF = Object.freeze({
  unabridged: false,
  epitome: true,
  summarizedThinkingForce: true,
  emptyThinking: true,
  signatureOnly: true,
  thinkingTokensNonzero: true,
  showSummariesToggle: true,
  omittedVsSummarized: true,
  continuationFull: true,
  desktopInject: true,
  flag3531779070: true,
  kind: SAMPLE_KIND_SEEDED,
  shapes: ABRIDGEMENT_SHAPES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds unabridged: folio open; gold-rule; knife sheathed; press idle" },
  { t: "empty", line: "thinking blocks arrive with thinking: \"\"; signature present; tokens nonzero" },
  { t: "flag", line: "summarizedThinking 3531779070 hardcoded; --thinking-display summarized injected" },
  { t: "path", line: "summarized-thinking-force — no full-chain opt-out on desktop/mobile" },
  { t: "score", line: "when the abridger empties the folio the booth is epitome — Score epitome or admit unabridged." },
]);

const FORCE_FLAGS = [
  "summarizedThinkingForce",
  "emptyThinking",
  "signatureOnly",
  "thinkingTokensNonzero",
  "showSummariesToggle",
  "omittedVsSummarized",
  "continuationFull",
  "desktopInject",
  "flag3531779070",
];

/**
 * Desk map: open folio vs compressed epitome.
 * Idle/unabridged: folio open; knife sheathed; press idle.
 * Seeded/epitome: folio abridged; knife cuts; press compresses.
 */
export function mapDesk(input = {}) {
  const epitome = isEpitomeInput(input);
  const unabridged = input.unabridged === true && !epitome;
  return {
    stamp: epitome ? "summarized-thinking-force" : "unabridged-folio",
    holdingLane: epitome ? "abridged" : "verbatim",
    kindLane: epitome ? "summarized-thinking-force" : "open-folio",
    bindLane: epitome ? "empty-thinking" : "full-chain",
    ribbon: epitome ? "epitome" : "unabridged",
    unabridged,
  };
}

export function inspectFolio(input = {}) {
  const abridged = isEpitomeInput(input);
  if (input.unabridged === true && !abridged) {
    return {
      stamp: "folio-open",
      abridged: false,
      note: "the folio stays open — full thinking chains on the vellum",
    };
  }
  return {
    stamp: abridged ? "folio-abridged" : "folio-idle",
    abridged,
    note: abridged
      ? "the folio is an epitome — signature/spine remains, thinking text gone"
      : "",
  };
}

export function inspectKnife(input = {}) {
  const cutting = isEpitomeInput(input);
  if (input.unabridged === true && !cutting) {
    return {
      stamp: "knife-sheathed",
      cutting: false,
      edge: "sheathed",
    };
  }
  return {
    stamp: cutting ? "knife-cutting" : "knife-idle",
    cutting,
    edge: cutting ? "quill-knife" : "sheathed",
    note: cutting
      ? "quill-knife cuts the thinking body; gold-rule spine is left"
      : "",
  };
}

export function inspectPress(input = {}) {
  const compressed = isEpitomeInput(input);
  if (input.unabridged === true && !compressed) {
    return {
      stamp: "press-idle",
      compressed: false,
    };
  }
  return {
    stamp: compressed ? "press-compressed" : "press-idle",
    compressed,
    note: compressed
      ? "binding-press compresses the folio to an epitome with an empty body"
      : "",
  };
}

export function inspectSignature(input = {}) {
  const only =
    input.signatureOnly === true ||
    input.emptyThinking === true ||
    input.epitome === true ||
    isEpitomeInput(input);
  if (input.unabridged === true && !only) {
    return {
      stamp: "signature-with-body",
      only: false,
    };
  }
  return {
    stamp: only ? "signature-only" : "signature-idle",
    only,
    note: only
      ? "signature present; thinking: \"\" — tokens nonzero, body stripped"
      : "",
  };
}

export function inspectFlag(input = {}) {
  const forced =
    input.flag3531779070 === true ||
    input.desktopInject === true ||
    input.summarizedThinkingForce === true ||
    input.epitome === true ||
    isEpitomeInput(input);
  if (input.unabridged === true && !forced) {
    return {
      stamp: "flag-idle",
      forced: false,
    };
  }
  return {
    stamp: forced ? "flag-forced" : "flag-idle",
    forced,
    note: forced
      ? "summarizedThinking 3531779070 hardcoded WC(true); buildBaseExtraArgs always sets --thinking-display summarized"
      : "",
  };
}

function shapeOpen(input, id) {
  const map = {
    "empty-thinking": input.emptyThinking,
    "signature-only": input.signatureOnly,
    "thinking-tokens-nonzero": input.thinkingTokensNonzero,
    "show-summaries-toggle": input.showSummariesToggle,
    "desktop-inject": input.desktopInject,
    "flag-3531779070": input.flag3531779070,
  };
  return (
    map[id] === true ||
    input.summarizedThinkingForce === true ||
    input.epitome === true
  );
}

function isEpitomeInput(input = {}) {
  return (
    input.epitome === true ||
    input.summarizedThinkingForce === true ||
    input.emptyThinking === true ||
    input.signatureOnly === true ||
    input.thinkingTokensNonzero === true ||
    input.showSummariesToggle === true ||
    input.omittedVsSummarized === true ||
    input.continuationFull === true ||
    input.desktopInject === true ||
    input.flag3531779070 === true
  );
}

export function readBooth(input = {}) {
  const epitome = isEpitomeInput(input);
  const unabridged = input.unabridged === true && !epitome;
  return {
    mark: epitome ? "epitome" : "unabridged",
    unabridged,
    epitome,
    summarizedThinkingForce:
      input.summarizedThinkingForce === true || epitome,
    emptyThinking: input.emptyThinking === true,
    signatureOnly: input.signatureOnly === true,
    thinkingTokensNonzero: input.thinkingTokensNonzero === true,
    showSummariesToggle: input.showSummariesToggle === true,
    omittedVsSummarized: input.omittedVsSummarized === true,
    continuationFull: input.continuationFull === true,
    desktopInject: input.desktopInject === true,
    flag3531779070: input.flag3531779070 === true,
    scope: mapDesk(input),
    folio: inspectFolio(input),
    knife: inspectKnife(input),
    press: inspectPress(input),
    signature: inspectSignature(input),
    flag: inspectFlag(input),
    shapes: ABRIDGEMENT_SHAPES.filter((row) => shapeOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const EPITOME_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-unabridged",
    unabridged: true,
    epitome: false,
    cue: "unabridged",
    note: "idle HOLD: folio open; gold-rule; knife sheathed; press idle — the hold/good path",
  },
  {
    t: "empty",
    event: "empty-thinking",
    epitome: true,
    emptyThinking: true,
    signatureOnly: true,
    thinkingTokensNonzero: true,
    cue: "epitome",
    note: 'thinking blocks arrive with thinking: ""; signature present; tokens nonzero',
  },
  {
    t: "flag",
    event: "flag-3531779070",
    epitome: true,
    flag3531779070: true,
    desktopInject: true,
    cue: "epitome",
    note: "summarizedThinking 3531779070 hardcoded; --thinking-display summarized injected",
  },
  {
    t: "path",
    event: "summarized-thinking-force",
    epitome: true,
    summarizedThinkingForce: true,
    emptyThinking: true,
    cue: "epitome",
    note: "summarized-thinking-force — no full-chain opt-out on desktop/mobile",
  },
  {
    t: "score",
    event: "epitome",
    epitome: true,
    summarizedThinkingForce: true,
    emptyThinking: true,
    signatureOnly: true,
    thinkingTokensNonzero: true,
    showSummariesToggle: true,
    omittedVsSummarized: true,
    continuationFull: true,
    desktopInject: true,
    flag3531779070: true,
    cue: "epitome",
    note: "epitome — when the abridger empties the folio the booth is epitome",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-unabridged",
    unabridged: true,
    epitome: false,
    cue: "unabridged",
    note: "positive control: Terminal CLI / continuation full chain — the folio is unabridged",
  },
  {
    t: "announce",
    event: "cue-unabridged",
    unabridged: true,
    cue: "unabridged",
    note: "positive control: the desk admits unabridged",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    unabridged: true,
    epitome: false,
    summarizedThinkingForce: false,
    cue: "unabridged",
  };
}

export function seedUnabridged() {
  return { ...emptyTicket() };
}

export function seedEpitome() {
  return {
    seed: SEEDED_WORD,
    unabridged: false,
    epitome: true,
    summarizedThinkingForce: true,
    emptyThinking: true,
    signatureOnly: true,
    thinkingTokensNonzero: true,
    showSummariesToggle: true,
    omittedVsSummarized: true,
    continuationFull: true,
    desktopInject: true,
    flag3531779070: true,
    cue: "epitome",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_EPITOME_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    epitome: true,
    summarizedThinkingForce: true,
    emptyThinking: true,
    cue: "epitome",
  };
}

export function seedSummarizedThinkingForce() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    epitome: true,
    summarizedThinkingForce: true,
    event: "summarized-thinking-force",
    cue: "epitome",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    unabridged: true,
    cue: "unabridged",
  };
}

export function seedFullChain() {
  return {
    seed: "full-chain",
    preferSeed: true,
    unabridged: true,
    cue: "unabridged",
  };
}

export function seedVerbatim() {
  return {
    seed: "verbatim",
    preferSeed: true,
    unabridged: true,
    cue: "unabridged",
  };
}

export function seedOpenFolio() {
  return {
    seed: "open-folio",
    preferSeed: true,
    unabridged: true,
    cue: "unabridged",
  };
}

export function seedIntactThinking() {
  return {
    seed: "intact-thinking",
    preferSeed: true,
    unabridged: true,
    cue: "unabridged",
  };
}

export function seedChainOpen() {
  return {
    seed: "chain-open",
    preferSeed: true,
    unabridged: true,
    cue: "unabridged",
  };
}

export function seedEmptyThinking() {
  return {
    seed: "empty-thinking",
    preferSeed: true,
    emptyThinking: true,
    cue: "epitome",
  };
}

export function seedSignatureOnly() {
  return {
    seed: "signature-only",
    preferSeed: true,
    signatureOnly: true,
    cue: "epitome",
  };
}

export function seedThinkingTokensNonzero() {
  return {
    seed: "thinking-tokens-nonzero",
    preferSeed: true,
    thinkingTokensNonzero: true,
    cue: "epitome",
  };
}

export function seedShowSummariesToggle() {
  return {
    seed: "show-summaries-toggle",
    preferSeed: true,
    showSummariesToggle: true,
    cue: "epitome",
  };
}

export function seedOmittedVsSummarized() {
  return {
    seed: "omitted-vs-summarized",
    preferSeed: true,
    omittedVsSummarized: true,
    cue: "epitome",
  };
}

export function seedContinuationFull() {
  return {
    seed: "continuation-full",
    preferSeed: true,
    continuationFull: true,
    cue: "epitome",
  };
}

export function seedDesktopInject() {
  return {
    seed: "desktop-inject",
    preferSeed: true,
    desktopInject: true,
    cue: "epitome",
  };
}

export function seedFlag3531779070() {
  return {
    seed: "flag-3531779070",
    preferSeed: true,
    flag3531779070: true,
    cue: "epitome",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      unabridged: false,
      epitome: false,
      summarizedThinkingForce: false,
      emptyThinking: false,
      signatureOnly: false,
      thinkingTokensNonzero: false,
      showSummariesToggle: false,
      omittedVsSummarized: false,
      continuationFull: false,
      desktopInject: false,
      flag3531779070: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    unabridged: raw.unabridged === true,
    epitome: raw.epitome === true || raw.event === "epitome",
    summarizedThinkingForce:
      raw.summarizedThinkingForce === true ||
      raw.event === "summarized-thinking-force",
    emptyThinking:
      raw.emptyThinking === true || raw.event === "empty-thinking",
    signatureOnly:
      raw.signatureOnly === true || raw.event === "signature-only",
    thinkingTokensNonzero:
      raw.thinkingTokensNonzero === true ||
      raw.event === "thinking-tokens-nonzero",
    showSummariesToggle:
      raw.showSummariesToggle === true ||
      raw.event === "show-summaries-toggle",
    omittedVsSummarized:
      raw.omittedVsSummarized === true ||
      raw.event === "omitted-vs-summarized",
    continuationFull:
      raw.continuationFull === true || raw.event === "continuation-full",
    desktopInject:
      raw.desktopInject === true || raw.event === "desktop-inject",
    flag3531779070:
      raw.flag3531779070 === true || raw.event === "flag-3531779070",
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
      (ticket.unabridged != null ||
        ticket.epitome != null ||
        ticket.summarizedThinkingForce != null ||
        ticket.emptyThinking != null ||
        ticket.signatureOnly != null ||
        ticket.thinkingTokensNonzero != null ||
        ticket.showSummariesToggle != null ||
        ticket.omittedVsSummarized != null ||
        ticket.continuationFull != null ||
        ticket.desktopInject != null ||
        ticket.flag3531779070 != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isUnabridged(row) {
  if (row.epitome && row.cue !== "unabridged") return false;
  if (row.cue === "epitome" || row.cue === "summarized-thinking-force") {
    return false;
  }
  if (
    row.summarizedThinkingForce &&
    row.emptyThinking &&
    row.cue !== "unabridged" &&
    row.unabridged !== true
  ) {
    return false;
  }
  if (
    row.unabridged === true &&
    row.epitome !== true &&
    row.cue !== "epitome"
  ) {
    return true;
  }
  if (
    row.cue === "unabridged" &&
    row.epitome !== true &&
    row.summarizedThinkingForce !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isSummarizedThinkingForce(row) {
  return (
    row.event === "summarized-thinking-force" &&
    !isUnabridged(row) &&
    (row.summarizedThinkingForce === true ||
      row.emptyThinking === true ||
      row.epitome === true)
  );
}

function isEpitomeRow(row) {
  if (isUnabridged(row)) return false;
  if (isSummarizedThinkingForce(row) && row.cue !== "epitome") return false;
  if (row.cue === "epitome") return true;
  if (row.epitome === true) return true;
  if (row.summarizedThinkingForce === true && row.emptyThinking === true) {
    return true;
  }
  if (
    row.summarizedThinkingForce === true ||
    row.emptyThinking === true ||
    row.signatureOnly === true ||
    row.thinkingTokensNonzero === true ||
    row.showSummariesToggle === true ||
    row.omittedVsSummarized === true ||
    row.continuationFull === true ||
    row.desktopInject === true ||
    row.flag3531779070 === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one epitome pass against the desk.
 * unabridged: folio open; knife sheathed; press idle.
 * epitome: folio abridged; knife cuts; press compresses.
 * summarized-thinking-force: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSummarizedThinkingForce(row) ||
    (row.summarizedThinkingForce &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "summarized-thinking-force";
  } else if (isEpitomeRow(row)) {
    verdict = "epitome";
  } else if (isUnabridged(row)) {
    verdict = "unabridged";
  } else if (
    row.summarizedThinkingForce ||
    row.emptyThinking ||
    row.signatureOnly ||
    row.thinkingTokensNonzero ||
    row.showSummariesToggle ||
    row.omittedVsSummarized ||
    row.continuationFull ||
    row.desktopInject ||
    row.flag3531779070
  ) {
    verdict = "epitome";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const folio = inspectFolio(row);
  const knife = inspectKnife(row);
  const press = inspectPress(row);
  const signature = inspectSignature(row);
  const flag = inspectFlag(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    unabridged: verdict === "unabridged" || verdict === "hold",
    epitome: verdict === "epitome" || verdict === SEEDED_WORD,
    summarizedThinkingForce:
      row.summarizedThinkingForce === true ||
      verdict === "summarized-thinking-force" ||
      verdict === PATH_WORD,
    emptyThinking: row.emptyThinking,
    signatureOnly: row.signatureOnly,
    thinkingTokensNonzero: row.thinkingTokensNonzero,
    showSummariesToggle: row.showSummariesToggle,
    omittedVsSummarized: row.omittedVsSummarized,
    continuationFull: row.continuationFull,
    desktopInject: row.desktopInject,
    flag3531779070: row.flag3531779070,
    cue: hold
      ? "unabridged"
      : row.summarizedThinkingForce ||
          verdict === "summarized-thinking-force"
        ? "summarized-thinking-force"
        : "epitome",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit unabridged" : "score epitome",
    folioInspect: folio,
    knifeInspect: knife,
    pressInspect: press,
    signatureInspect: signature,
    flagInspect: flag,
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
      : EPITOME_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "epitome");
  const path = scored.filter(
    (row) => row.verdict === "summarized-thinking-force",
  );
  const unabridged = scored.filter((row) => row.verdict === "unabridged");
  const headline =
    scored.find((row) => row.event === "epitome") ||
    scored.find((row) => row.event === "summarized-thinking-force") ||
    scored.find((row) => row.event === "empty-thinking") ||
    charged[charged.length - 1];
  let verdict = "unabridged";
  if (charged.length) verdict = "epitome";
  else if (path.length && !unabridged.length) {
    verdict = "summarized-thinking-force";
  }
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
    epitomeCount: charged.length,
    pathCount: path.length,
    unabridgedCount: unabridged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit unabridged" : "score epitome",
    note: headline
      ? "Desktop/mobile hard-force empty thinking content; no opt-out to full chains. Cousins cite-only: #49268 #77460 #31326."
      : "published epitome walk scored against unabridged vs epitome",
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
    seeded !== "unabridged" &&
    seeded !== "epitome" &&
    seeded !== "summarized-thinking-force" &&
    ticket.unabridged == null &&
    ticket.epitome == null &&
    ticket.summarizedThinkingForce == null &&
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
    unabridged: scored.unabridged ?? false,
    epitome: scored.epitome ?? false,
    summarizedThinkingForce: scored.summarizedThinkingForce ?? false,
    emptyThinking: scored.emptyThinking ?? false,
    signatureOnly: scored.signatureOnly ?? false,
    thinkingTokensNonzero: scored.thinkingTokensNonzero ?? false,
    showSummariesToggle: scored.showSummariesToggle ?? false,
    omittedVsSummarized: scored.omittedVsSummarized ?? false,
    continuationFull: scored.continuationFull ?? false,
    desktopInject: scored.desktopInject ?? false,
    flag3531779070: scored.flag3531779070 ?? false,
  };
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.emptyThinking || result.epitome
      ? "kind=summarized-thinking-force"
      : "kind=open-folio",
    result.signatureOnly || result.epitome ? "ref=signature" : "ref=verbatim",
    result.summarizedThinkingForce ||
    result.verdict === "summarized-thinking-force"
      ? "path=summarized-thinking-force"
      : "path=unabridged",
    result.cue === "unabridged"
      ? "cue=unabridged"
      : result.cue === "summarized-thinking-force"
        ? "cue=summarized-thinking-force"
        : "cue=epitome",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    unabridged: result.unabridged,
    epitome: result.epitome,
    summarizedThinkingForce: result.summarizedThinkingForce,
    emptyThinking: result.emptyThinking,
    signatureOnly: result.signatureOnly,
    thinkingTokensNonzero: result.thinkingTokensNonzero,
    showSummariesToggle: result.showSummariesToggle,
    omittedVsSummarized: result.omittedVsSummarized,
    continuationFull: result.continuationFull,
    desktopInject: result.desktopInject,
    flag3531779070: result.flag3531779070,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    folio: inspectFolio({
      unabridged: result.unabridged,
      epitome: result.epitome,
      summarizedThinkingForce: result.summarizedThinkingForce,
    }),
    knife: inspectKnife({
      unabridged: result.unabridged,
      epitome: result.epitome,
      summarizedThinkingForce: result.summarizedThinkingForce,
    }),
    press: inspectPress({
      unabridged: result.unabridged,
      epitome: result.epitome,
      emptyThinking: result.emptyThinking,
    }),
    signature: inspectSignature({
      unabridged: result.unabridged,
      epitome: result.epitome,
      signatureOnly: result.signatureOnly,
      emptyThinking: result.emptyThinking,
    }),
    flag: inspectFlag({
      unabridged: result.unabridged,
      epitome: result.epitome,
      flag3531779070: result.flag3531779070,
      desktopInject: result.desktopInject,
      summarizedThinkingForce: result.summarizedThinkingForce,
    }),
    scope: mapDesk({
      unabridged: result.unabridged,
      epitome: result.epitome,
      summarizedThinkingForce: result.summarizedThinkingForce,
      emptyThinking: result.emptyThinking,
      signatureOnly: result.signatureOnly,
      thinkingTokensNonzero: result.thinkingTokensNonzero,
      showSummariesToggle: result.showSummariesToggle,
      omittedVsSummarized: result.omittedVsSummarized,
      continuationFull: result.continuationFull,
      desktopInject: result.desktopInject,
      flag3531779070: result.flag3531779070,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      epitome: result.epitome === true || result.verdict === "epitome",
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
      shapes: ABRIDGEMENT_SHAPES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: desktop/mobile hardcodes summarizedThinking so buildBaseExtraArgs always sets --thinking-display summarized; preference cannot request full; continuation CLI spawn bypasses injection. Invite verify against #94032 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
