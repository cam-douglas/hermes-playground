#!/usr/bin/env node
/**
 * Agraphia — clinical agraphia / neurology writing-desk booth.
 * Speech intact (UI still shows the words); writing hand fails
 * (JSONL drops pre-tool assistant text). Quill lifts before the
 * tool-seal. Chart clipboard. Aphasia-clinic adjacent but NOT
 * Palilalia (/goal Stop re-fire). NOT Rasure (parchment wipe).
 *
 * Educational diagnostic model for a published Claude Code
 * interactive-CLI defect: since 2.1.267 → 2.1.270, session
 * transcript JSONL omits most assistant `text` blocks written
 * before a `tool_use` in the same response. Terminal still shows
 * the text. `thinking` and `tool_use` rows still written.
 * Hooks that read transcript_path go blind; PreToolUse payload
 * carries no assistant text.
 *
 * Encoded from anthropics/claude-code#94251 issue text only.
 * Hypothesis (NON-BINDING): interactive CLI persistence of
 * assistant content blocks before tool_use regressed between
 * 2.1.267 and 2.1.270 so JSONL omits those text blocks while
 * UI still renders them; hooks reading transcript_path go blind.
 * Invite verify against issue text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT implement
 * a fix. No network. No exploits. No live Claude.
 *
 *   node agraphia.mjs data/agraphia.json
 *   echo '{"seed":"agraphia"}' | node agraphia.mjs
 *
 * Idle word is penned (HOLD: pre-tool assistant text blocks still
 * written into session JSONL; hooks can read the marker).
 * HOLD aliases: recorded, retained, charted, filed, marked.
 * Seeded word is agraphia (#94251 — the pre-tool-omit path).
 * Path word is pre-tool-omit.
 * Product score word is agraphia (Score agraphia or admit penned.).
 *
 * NOT Gauntlet/#94029. NOT Lictor/#94053. NOT Lychgate/#94059.
 * NOT Ouster/#94221. NOT Proscription/#94202. NOT Thimblerig/#94174.
 * NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032.
 * NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041.
 * NOT Sepulchre. NOT Rasure/#93791. NOT Anarthria/#93782.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #65051 — daemon sessions, 2.1.161 — same shape on other entrypoints.
 * #76668 — desktop app — same shape on other entrypoints.
 * Agraphia is specifically interactive CLI transcript omitting
 * pre-tool assistant text on 2.1.270.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "penned",
  "agraphia",
  "pre-tool-omit",
  "hold",
  "recorded",
  "retained",
  "charted",
  "filed",
  "marked",
  "text-omit",
  "hook-blind",
  "pretool-empty",
  "quote-only",
  "share-drop",
  "haiku-ok",
  "end-of-turn",
  "profile-a",
  "profile-b",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "penned";
export const PATH_WORD = "pre-tool-omit";
export const SEEDED_WORD = "agraphia";
export const PRODUCT_WORD = "agraphia";
export const HOLD = Object.freeze(["penned", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "recorded",
  "retained",
  "charted",
  "filed",
  "marked",
]);
export const RECOVER = Object.freeze(["penned", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "inked",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
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
  "articulate",
  "limber",
  "primed",
  "lit",
  "voiced",
  "mute",
  "rostered",
  "quieted",
  "unrung",
  "vested",
  "plenary",
  "equalized",
  "legible",
  "calibrated",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "sighted",
  "intact",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "rasure",
  "rasura",
  "attach-mouse",
  "picker-bypass",
  "bg-task-stale",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
  "reminder-secret-bypass",
  "cannot-show-not-git",
  "goal-stop-refire",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "rasura",
  "rasure",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "attach-mouse",
  "picker-bypass",
  "bg-task-stale",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
  "reminder-secret-bypass",
  "cannot-show-not-git",
  "goal-stop-refire",
]);

export const FEATURED_ISSUE = 94251;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94251";
export const TITLE =
  "[BUG] 2.1.270: session transcript JSONL omits most assistant text written before a tool call (interactive CLI)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
  "area:hooks",
  "regression",
]);
export const PLATFORM = "macos";
export const SURFACE = "pre-tool-omit";
export const HOST =
  "Claude Code 2.1.270, macOS 26.5 (Darwin 25.5.0), zsh, iTerm2; interactive CLI";
export const CHECKED_ON =
  "Claude Code 2.1.270 interactive CLI vs 2.1.267; two CLAUDE_CONFIG_DIR profiles; claude-opus-5.";
export const BUILD = "Claude Code 2.1.270 (macOS interactive CLI)";
export const SELECTED_MODEL = "claude-opus-5 (measurements); Haiku no-tool control";
export const OS = "macOS 26.5 (Darwin 25.5.0), zsh, iTerm2";
export const PHRASE = "Score agraphia or admit penned.";
export const DISTRIBUTION =
  "Since upgrading 2.1.267 → 2.1.270, session transcript projects/<project>/<session>.jsonl is missing most assistant text blocks that come before a tool_use in the same response. Text still shows in the terminal as normal. thinking and tool_use rows still written (tool_use with full input). End-of-turn text affected much less. A phrase from a UI reply appears only inside later tool inputs that quote it — not as its own text block. Share of assistant rows with a text block: profile A 26.4%→12.8%, profile B 27.6%→2.9%. Text rows with stop_reason tool_use as share of tool calls: 51.7%→13.6% (A) and 53.7%→1.9% (B). One session resumed across the upgrade went from 372 text blocks in 1,262 assistant rows (2.1.263) to 3 in 40 (2.1.270). Haiku sessions that never call tools still record text on every response on both versions. Hooks that read transcript_path to check what the model said before a tool call can no longer see it; PreToolUse payload carries no assistant text.";

export const MEASUREMENTS = Object.freeze([
  { version: "2.1.267", profile: "A", assistantRows: 6712, textRows: 1771, share: "26.4%" },
  { version: "2.1.267", profile: "B", assistantRows: 12427, textRows: 3427, share: "27.6%" },
  { version: "2.1.270", profile: "A", assistantRows: 1970, textRows: 253, share: "12.8%" },
  { version: "2.1.270", profile: "B", assistantRows: 2536, textRows: 74, share: "2.9%" },
]);

export const STOP_REASON_SHARES = Object.freeze([
  { profile: "A", from: "51.7%", to: "13.6%" },
  { profile: "B", from: "53.7%", to: "1.9%" },
]);

export const RULED_OUT = Object.freeze([
  "Gauntlet/#94029 attach-mouse — attach ignores DISABLE_MOUSE; DIFFERENT",
  "Lictor/#94053 picker-bypass — desktop model picker skips Pre/PostModelSwitch; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden / false-guilt",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text; speech clinic, different defect",
  "Sepulchre — bash-nul-poison; different vault",
  "Rasure/#93791 creation-time-flip — ~/.claude wiped and recreated; parchment scrape, DIFFERENT",
  "Anarthria/#93782 — Wispr Flow clipboard drop; ENT/voice clinic, DIFFERENT",
  "#65051 — daemon sessions 2.1.161; same shape on other entrypoints; cite-only cousin",
  "#76668 — desktop app; same shape on other entrypoints; cite-only cousin",
]);

export const EXPECTED = Object.freeze([
  "Assistant text blocks written before a tool_use in the same response should remain in the session JSONL",
  "Hooks that read transcript_path should still see what the model said before a tool call",
  "PreToolUse payload (or the transcript it points at) should expose the written marker",
  "A PreToolUse hook requiring a written marker before certain commands should remain satisfiable",
  "Haiku no-tool sessions already record text on every response — that control should stay penned",
  "UI already shows the text; the writing hand (JSONL) should match the spoken/UI speech",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "text-omit",
    label: "text omit",
    count: "pre-tool text gone",
    note: "Most assistant text blocks before tool_use missing from JSONL",
  },
  {
    id: "hook-blind",
    label: "hook blind",
    count: "transcript_path empty of speech",
    note: "Hooks that read transcript_path cannot see what the model said",
  },
  {
    id: "pretool-empty",
    label: "PreToolUse empty",
    count: "no assistant text",
    note: "PreToolUse payload carries no assistant text",
  },
  {
    id: "quote-only",
    label: "quote only",
    count: "phrase in later tool input",
    note: "UI phrase appears only inside later tool inputs that quote it",
  },
  {
    id: "share-drop",
    label: "share drop",
    count: "A 26.4%→12.8% · B 27.6%→2.9%",
    note: "Share of assistant rows with a text block dropped sharply",
  },
  {
    id: "pre-tool-omit",
    label: "pre-tool omit",
    count: "interactive CLI 2.1.270",
    note: "Path: interactive CLI transcript omits pre-tool assistant text",
  },
]);

export const DESK_NAMES = Object.freeze([
  {
    id: "speech-intact",
    lost: "Speech intact — terminal still shows the words",
    control: "UI speech and JSONL writing agree",
    story: "the clinic hears the spoken reply; the chart stays blank",
  },
  {
    id: "writing-hand",
    lost: "Writing hand fails — JSONL drops pre-tool text blocks",
    control: "Pre-tool assistant text stays penned in the transcript",
    story: "the quill lifts before the tool-seal",
  },
  {
    id: "chart-clipboard",
    lost: "Chart clipboard blind — transcript_path has no marker",
    control: "Hooks reading transcript_path still see the written line",
    story: "the clipboard holds a scraped chart",
  },
  {
    id: "quill-lift",
    lost: "Quill lift — text omitted before tool_use in the same response",
    control: "Text block written before the tool-seal",
    story: "agraphia — loss of written record while spoken/UI speech remains",
  },
  {
    id: "tool-seal",
    lost: "Tool-seal still stamped — thinking and tool_use rows written with full input",
    control: "Tool-seal accompanies the penned text, not a blank recto",
    story: "the seal lands on a missing recto",
  },
  {
    id: "pre-tool-omit",
    lost: "pre-tool-omit — interactive CLI 2.1.270 omits pre-tool assistant text",
    control: "2.1.267 still penned those blocks",
    story: "the writing desk scores agraphia",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "speech-intact",
    survey: "neurology desk; spoken reply still heard; UI shows the words",
    kind: "penned",
    note: "idle/control: speech intact — the hold/good path keeps writing too",
  },
  {
    id: "writing-hand",
    survey: "writing hand fails; JSONL drops pre-tool assistant text",
    kind: "agraphia",
    note: "seeded: writing hand cannot keep the chart",
  },
  {
    id: "chart-clipboard",
    survey: "chart clipboard — hooks read transcript_path and find no marker",
    kind: "agraphia",
    note: "seeded: PreToolUse hook requiring a written marker is impossible",
  },
  {
    id: "quill-lift",
    survey: "quill lifts before the tool-seal; text omitted in the same response",
    kind: "agraphia",
    note: "seeded: end-of-turn text affected much less",
  },
  {
    id: "tool-seal",
    survey: "tool-seal still stamped; thinking + tool_use with full input remain",
    kind: "agraphia",
    note: "seeded: the seal is not the missing ink",
  },
  {
    id: "clinic-desk",
    survey: "pre-tool-omit — interactive CLI 2.1.270 writing desk",
    kind: "agraphia",
    note: "path: pre-tool-omit names the omitted pre-tool text",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "pre-tool-omit",
  "agraphia",
  "text-omit",
  "hook-blind",
  "pretool-empty",
  "quote-only",
  "share-drop",
]);

export const COUSINS = Object.freeze([
  {
    issue: 65051,
    title:
      "[Bug] Background (daemon) sessions drop assistant text blocks from transcript when response mixes text with tool_use (regression 2.1.160 → 2.1.161)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — daemon sessions, 2.1.161; same shape on other entrypoints. This booth is interactive CLI 2.1.270. Do not rebuild. Do not conflate.",
  },
  {
    issue: 76668,
    title:
      "Desktop app: assistant text emitted before tool calls is never rendered, and may not be persisted to the session transcript",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — desktop app; same shape on other entrypoints. This booth is interactive CLI. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93987, title: "backup #93987", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94256, title: "backup #94256", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94277, title: "backup #94277", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94275, title: "backup #94275", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94274, title: "backup #94274", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94273, title: "backup #94273", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94267, title: "backup #94267", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "rasure",
  "rasura",
]);

export const SAMPLE_KIND_IDLE = "recorded";
export const SAMPLE_KIND_SEEDED = "pre-tool-omit";
export const SAMPLE_HOLDING_IDLE = "retained";
export const SAMPLE_HOLDING_SEEDED = "text-omit";

export const SAMPLE_PENNED_PROOF = Object.freeze({
  penned: true,
  agraphia: false,
  preToolOmit: false,
  textOmit: false,
  hookBlind: false,
  pretoolEmpty: false,
  quoteOnly: false,
  shareDrop: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_AGRAPHIA_PROOF = Object.freeze({
  penned: false,
  agraphia: true,
  preToolOmit: true,
  textOmit: true,
  hookBlind: true,
  pretoolEmpty: true,
  quoteOnly: true,
  shareDrop: true,
  kind: SAMPLE_KIND_SEEDED,
  names: DESK_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds penned: pre-tool assistant text still written into session JSONL; hooks can read the marker" },
  { t: "upgrade", line: "2.1.267 → 2.1.270 interactive CLI; terminal still shows the words" },
  { t: "omit", line: "JSONL missing most assistant text blocks before tool_use; thinking and tool_use still written" },
  { t: "path", line: "pre-tool-omit — hooks reading transcript_path go blind; PreToolUse carries no assistant text" },
  { t: "score", line: "when the writing hand fails while speech stays intact the booth is agraphia — Score agraphia or admit penned." },
]);

const FORCE_FLAGS = [
  "textOmit",
  "toolUseStop",
  "shareDrop",
  "hookBlind",
  "pretoolEmpty",
  "quoteOnly",
  "preToolOmit",
];

/**
 * Clinic map: penned chart vs agraphia (speech intact, writing gone).
 */
export function mapDesk(input = {}) {
  const agraphia = isAgraphiaInput(input);
  const penned = input.penned === true && !agraphia;
  return {
    stamp: agraphia ? "pre-tool-omit" : "penned-chart",
    holdingLane: agraphia ? "text-omit" : "retained",
    kindLane: agraphia ? "pre-tool-omit" : "recorded",
    bindLane: agraphia ? "hook-blind" : "marked",
    ribbon: agraphia ? "agraphia" : "penned",
    penned,
  };
}

export function inspectSpeech(input = {}) {
  const spoken =
    input.speechIntact === true ||
    input.penned === true ||
    isAgraphiaInput(input);
  return {
    stamp: spoken ? "speech-intact" : "speech-idle",
    spoken,
    note: spoken
      ? "speech intact — terminal still shows the words"
      : "",
  };
}

export function inspectHand(input = {}) {
  const failed = isAgraphiaInput(input);
  if (input.penned === true && !failed) {
    return { stamp: "hand-penned", failed: false };
  }
  return {
    stamp: failed ? "hand-failed" : "hand-idle",
    failed,
    note: failed
      ? "writing hand fails — JSONL drops pre-tool assistant text"
      : "",
  };
}

export function inspectChart(input = {}) {
  const blind =
    input.hookBlind === true ||
    input.pretoolEmpty === true ||
    isAgraphiaInput(input);
  if (input.penned === true && !blind) {
    return { stamp: "chart-marked", blind: false, edge: "retained" };
  }
  return {
    stamp: blind ? "chart-blind" : "chart-idle",
    blind,
    edge: blind ? "hook-blind" : "retained",
    note: blind
      ? "chart clipboard blind — transcript_path has no written marker"
      : "",
  };
}

export function inspectQuill(input = {}) {
  const lifted =
    input.textOmit === true ||
    input.preToolOmit === true ||
    input.agraphia === true ||
    isAgraphiaInput(input);
  if (input.penned === true && !lifted) {
    return { stamp: "quill-down", lifted: false };
  }
  return {
    stamp: lifted ? "quill-lift" : "quill-idle",
    lifted,
    note: lifted
      ? "quill lifts before the tool-seal — text omitted in the same response"
      : "",
  };
}

export function inspectSeal(input = {}) {
  const stamped =
    input.toolUseStop === true ||
    input.agraphia === true ||
    isAgraphiaInput(input);
  if (input.penned === true && !stamped) {
    return { stamp: "seal-with-text", stamped: false };
  }
  return {
    stamp: stamped ? "seal-on-blank" : "seal-idle",
    stamped,
    note: stamped
      ? "tool-seal still stamped — thinking and tool_use written; text recto missing"
      : "",
  };
}

export function inspectPath(input = {}) {
  const omitted =
    input.preToolOmit === true ||
    input.agraphia === true ||
    isAgraphiaInput(input);
  if (input.penned === true && !omitted) {
    return { stamp: "path-penned", omitted: false };
  }
  return {
    stamp: omitted ? "path-omit" : "path-idle",
    omitted,
    note: omitted
      ? "pre-tool-omit — interactive CLI 2.1.270 omits pre-tool assistant text"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "speech-intact": input.speechIntact,
    "writing-hand": input.textOmit,
    "chart-clipboard": input.hookBlind,
    "quill-lift": input.preToolOmit,
    "tool-seal": input.toolUseStop,
    "pre-tool-omit": input.preToolOmit,
  };
  return (
    map[id] === true ||
    input.preToolOmit === true ||
    input.agraphia === true
  );
}

function isAgraphiaInput(input = {}) {
  return (
    input.agraphia === true ||
    input.preToolOmit === true ||
    input.textOmit === true ||
    input.toolUseStop === true ||
    input.shareDrop === true ||
    input.hookBlind === true ||
    input.pretoolEmpty === true ||
    input.quoteOnly === true
  );
}

export function readBooth(input = {}) {
  const agraphia = isAgraphiaInput(input);
  const penned = input.penned === true && !agraphia;
  return {
    mark: agraphia ? "agraphia" : "penned",
    penned,
    agraphia,
    preToolOmit: input.preToolOmit === true || agraphia,
    textOmit: input.textOmit === true,
    hookBlind: input.hookBlind === true,
    pretoolEmpty: input.pretoolEmpty === true,
    quoteOnly: input.quoteOnly === true,
    shareDrop: input.shareDrop === true,
    toolUseStop: input.toolUseStop === true,
    scope: mapDesk(input),
    speech: inspectSpeech(input),
    hand: inspectHand(input),
    chart: inspectChart(input),
    quill: inspectQuill(input),
    seal: inspectSeal(input),
    path: inspectPath(input),
    names: DESK_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const AGRAPHIA_WALK = Object.freeze([
  {
    t: "idle",
    event: "chart-penned",
    penned: true,
    agraphia: false,
    cue: "penned",
    note: "idle HOLD: pre-tool assistant text still written into session JSONL; hooks can read the marker",
  },
  {
    t: "upgrade",
    event: "text-omit",
    agraphia: true,
    textOmit: true,
    shareDrop: true,
    cue: "agraphia",
    note: "2.1.267 → 2.1.270; share of assistant rows with a text block dropped sharply",
  },
  {
    t: "omit",
    event: "hook-blind",
    agraphia: true,
    textOmit: true,
    hookBlind: true,
    pretoolEmpty: true,
    cue: "agraphia",
    note: "hooks that read transcript_path go blind; PreToolUse carries no assistant text",
  },
  {
    t: "path",
    event: "pre-tool-omit",
    agraphia: true,
    preToolOmit: true,
    textOmit: true,
    hookBlind: true,
    quoteOnly: true,
    cue: "agraphia",
    note: "pre-tool-omit — phrase appears only inside later tool inputs that quote it",
  },
  {
    t: "score",
    event: "agraphia",
    agraphia: true,
    preToolOmit: true,
    textOmit: true,
    hookBlind: true,
    pretoolEmpty: true,
    quoteOnly: true,
    shareDrop: true,
    toolUseStop: true,
    cue: "agraphia",
    note: "agraphia — writing hand fails while spoken/UI speech remains",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "chart-penned",
    penned: true,
    agraphia: false,
    cue: "penned",
    note: "positive control: Haiku no-tool sessions record text on every response; the chart is penned",
  },
  {
    t: "admit",
    event: "chart-penned",
    penned: true,
    cue: "penned",
    note: "positive control: the desk admits penned",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    penned: true,
    agraphia: false,
    preToolOmit: false,
    cue: "penned",
  };
}

export function seedPenned() {
  return { ...emptyTicket() };
}

export function seedAgraphia() {
  return {
    seed: SEEDED_WORD,
    penned: false,
    agraphia: true,
    preToolOmit: true,
    textOmit: true,
    hookBlind: true,
    pretoolEmpty: true,
    quoteOnly: true,
    shareDrop: true,
    toolUseStop: true,
    cue: "agraphia",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_AGRAPHIA_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    agraphia: true,
    preToolOmit: true,
    cue: "agraphia",
  };
}

export function seedPreToolOmit() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    agraphia: true,
    preToolOmit: true,
    event: "pre-tool-omit",
    cue: "agraphia",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    penned: true,
    cue: "penned",
  };
}

export function seedRecorded() {
  return { seed: "recorded", preferSeed: true, penned: true, cue: "penned" };
}

export function seedRetained() {
  return { seed: "retained", preferSeed: true, penned: true, cue: "penned" };
}

export function seedCharted() {
  return { seed: "charted", preferSeed: true, penned: true, cue: "penned" };
}

export function seedFiled() {
  return { seed: "filed", preferSeed: true, penned: true, cue: "penned" };
}

export function seedMarked() {
  return { seed: "marked", preferSeed: true, penned: true, cue: "penned" };
}

export function seedTextOmit() {
  return { seed: "text-omit", preferSeed: true, textOmit: true, cue: "agraphia" };
}

export function seedHookBlind() {
  return { seed: "hook-blind", preferSeed: true, hookBlind: true, cue: "agraphia" };
}

export function seedPretoolEmpty() {
  return { seed: "pretool-empty", preferSeed: true, pretoolEmpty: true, cue: "agraphia" };
}

export function seedQuoteOnly() {
  return { seed: "quote-only", preferSeed: true, quoteOnly: true, cue: "agraphia" };
}

export function seedShareDrop() {
  return { seed: "share-drop", preferSeed: true, shareDrop: true, cue: "agraphia" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      penned: false,
      agraphia: false,
      preToolOmit: false,
      textOmit: false,
      hookBlind: false,
      pretoolEmpty: false,
      quoteOnly: false,
      shareDrop: false,
      toolUseStop: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    penned: raw.penned === true,
    agraphia: raw.agraphia === true || raw.event === "agraphia",
    preToolOmit:
      raw.preToolOmit === true || raw.event === "pre-tool-omit",
    textOmit: raw.textOmit === true || raw.event === "text-omit",
    hookBlind: raw.hookBlind === true || raw.event === "hook-blind",
    pretoolEmpty:
      raw.pretoolEmpty === true || raw.event === "pretool-empty",
    quoteOnly: raw.quoteOnly === true || raw.event === "quote-only",
    shareDrop: raw.shareDrop === true || raw.event === "share-drop",
    toolUseStop:
      raw.toolUseStop === true || raw.event === "tool-use-stop",
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
      (ticket.penned != null ||
        ticket.agraphia != null ||
        ticket.preToolOmit != null ||
        ticket.textOmit != null ||
        ticket.hookBlind != null ||
        ticket.pretoolEmpty != null ||
        ticket.quoteOnly != null ||
        ticket.shareDrop != null ||
        ticket.toolUseStop != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isPenned(row) {
  if (row.agraphia && row.cue !== "penned") return false;
  if (row.cue === "agraphia" || row.cue === "pre-tool-omit") return false;
  if (
    row.preToolOmit &&
    row.textOmit &&
    row.cue !== "penned" &&
    row.penned !== true
  ) {
    return false;
  }
  if (
    row.penned === true &&
    row.agraphia !== true &&
    row.cue !== "agraphia"
  ) {
    return true;
  }
  if (
    row.cue === "penned" &&
    row.agraphia !== true &&
    row.preToolOmit !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isPreToolOmit(row) {
  return (
    row.event === "pre-tool-omit" &&
    !isPenned(row) &&
    (row.preToolOmit === true ||
      row.textOmit === true ||
      row.agraphia === true)
  );
}

function isAgraphiaRow(row) {
  if (isPenned(row)) return false;
  if (isPreToolOmit(row) && row.cue !== "agraphia") return false;
  if (row.cue === "agraphia") return true;
  if (row.agraphia === true) return true;
  if (row.preToolOmit === true && row.textOmit === true) return true;
  if (
    row.preToolOmit === true ||
    row.textOmit === true ||
    row.hookBlind === true ||
    row.pretoolEmpty === true ||
    row.quoteOnly === true ||
    row.shareDrop === true ||
    row.toolUseStop === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one agraphia pass against the clinic desk.
 * penned: pre-tool assistant text retained in JSONL.
 * agraphia: JSONL omits those blocks while UI still shows them.
 * pre-tool-omit: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPreToolOmit(row) ||
    (row.preToolOmit && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "pre-tool-omit";
  } else if (isAgraphiaRow(row)) {
    verdict = "agraphia";
  } else if (isPenned(row)) {
    verdict = "penned";
  } else if (
    row.preToolOmit ||
    row.textOmit ||
    row.hookBlind ||
    row.pretoolEmpty ||
    row.quoteOnly ||
    row.shareDrop ||
    row.toolUseStop
  ) {
    verdict = "agraphia";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    penned: verdict === "penned" || verdict === "hold",
    agraphia: verdict === "agraphia" || verdict === SEEDED_WORD,
    preToolOmit:
      row.preToolOmit === true ||
      verdict === "pre-tool-omit" ||
      verdict === PATH_WORD,
    textOmit: row.textOmit,
    hookBlind: row.hookBlind,
    pretoolEmpty: row.pretoolEmpty,
    quoteOnly: row.quoteOnly,
    shareDrop: row.shareDrop,
    toolUseStop: row.toolUseStop,
    cue: hold
      ? "penned"
      : row.preToolOmit || verdict === "pre-tool-omit"
        ? "pre-tool-omit"
        : "agraphia",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit penned" : "score agraphia",
    speechInspect: inspectSpeech(row),
    handInspect: inspectHand(row),
    chartInspect: inspectChart(row),
    quillInspect: inspectQuill(row),
    sealInspect: inspectSeal(row),
    pathInspect: inspectPath(row),
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
      : AGRAPHIA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "agraphia");
  const path = scored.filter((row) => row.verdict === "pre-tool-omit");
  const penned = scored.filter((row) => row.verdict === "penned");
  const headline =
    scored.find((row) => row.event === "agraphia") ||
    scored.find((row) => row.event === "pre-tool-omit") ||
    scored.find((row) => row.event === "text-omit") ||
    charged[charged.length - 1];
  let verdict = "penned";
  if (charged.length) verdict = "agraphia";
  else if (path.length && !penned.length) {
    verdict = "pre-tool-omit";
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
    agraphiaCount: charged.length,
    pathCount: path.length,
    pennedCount: penned.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit penned" : "score agraphia",
    note: headline
      ? "Interactive CLI 2.1.270 omits pre-tool assistant text. Cousins cite-only: #65051 #76668 — do not rebuild, do not conflate."
      : "published agraphia walk scored against penned vs agraphia",
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
    seeded !== "penned" &&
    seeded !== "agraphia" &&
    seeded !== "pre-tool-omit" &&
    ticket.penned == null &&
    ticket.agraphia == null &&
    ticket.preToolOmit == null &&
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
    penned: scored.penned ?? false,
    agraphia: scored.agraphia ?? false,
    preToolOmit: scored.preToolOmit ?? false,
    textOmit: scored.textOmit ?? false,
    hookBlind: scored.hookBlind ?? false,
    pretoolEmpty: scored.pretoolEmpty ?? false,
    quoteOnly: scored.quoteOnly ?? false,
    shareDrop: scored.shareDrop ?? false,
    toolUseStop: scored.toolUseStop ?? false,
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
    result.hookBlind || result.agraphia
      ? "kind=pre-tool-omit"
      : "kind=recorded",
    result.textOmit || result.agraphia ? "ref=text-omit" : "ref=retained",
    result.preToolOmit || result.verdict === "pre-tool-omit"
      ? "path=pre-tool-omit"
      : "path=penned",
    result.cue === "penned"
      ? "cue=penned"
      : result.cue === "pre-tool-omit"
        ? "cue=pre-tool-omit"
        : "cue=agraphia",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    penned: result.penned,
    agraphia: result.agraphia,
    preToolOmit: result.preToolOmit,
    textOmit: result.textOmit,
    hookBlind: result.hookBlind,
    pretoolEmpty: result.pretoolEmpty,
    quoteOnly: result.quoteOnly,
    shareDrop: result.shareDrop,
    toolUseStop: result.toolUseStop,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    speech: inspectSpeech({
      penned: result.penned,
      agraphia: result.agraphia,
      speechIntact: true,
    }),
    hand: inspectHand({
      penned: result.penned,
      agraphia: result.agraphia,
      preToolOmit: result.preToolOmit,
      textOmit: result.textOmit,
    }),
    chart: inspectChart({
      penned: result.penned,
      agraphia: result.agraphia,
      hookBlind: result.hookBlind,
      pretoolEmpty: result.pretoolEmpty,
    }),
    quill: inspectQuill({
      penned: result.penned,
      agraphia: result.agraphia,
      preToolOmit: result.preToolOmit,
      textOmit: result.textOmit,
    }),
    seal: inspectSeal({
      penned: result.penned,
      agraphia: result.agraphia,
      toolUseStop: result.toolUseStop,
    }),
    path: inspectPath({
      penned: result.penned,
      agraphia: result.agraphia,
      preToolOmit: result.preToolOmit,
    }),
    scope: mapDesk({
      penned: result.penned,
      agraphia: result.agraphia,
      preToolOmit: result.preToolOmit,
      textOmit: result.textOmit,
      hookBlind: result.hookBlind,
      pretoolEmpty: result.pretoolEmpty,
      quoteOnly: result.quoteOnly,
      shareDrop: result.shareDrop,
      toolUseStop: result.toolUseStop,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      agraphia: result.agraphia === true || result.verdict === "agraphia",
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
      names: DESK_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      measurements: MEASUREMENTS,
      stopReasonShares: STOP_REASON_SHARES,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: interactive CLI persistence of assistant content blocks before tool_use regressed between 2.1.267 and 2.1.270 so JSONL omits those text blocks while UI still renders them; hooks reading transcript_path go blind. Invite verify against #94251 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
