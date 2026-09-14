#!/usr/bin/env node
/**
 * Fetchling — fae twilight / shadow-double / coin-ledger desk /
 * mirror-swap booth.
 *
 * Educational diagnostic model for a published Claude Code
 * Skill-tool defect: literal `$` + 1–2 digit sequences (`$5`,
 * `$19`) in skill Markdown do not reach the model as written;
 * they are replaced with unrelated conversation fragments.
 * Disk file unmodified; silent corruption. Roughly `$1`–`$19`
 * substituted; `$20+` intact. Observed sub: `$3 $5 $10 $13
 * $15 $19`. Intact: `$20 $25 $49.99 $125 $175`. Same line can
 * mix (`$19` gone, `$25` survives). Replacement text from
 * surrounding conversation (sometimes exact user phrase).
 * Localisation: CLAUDE.md `$10` intact; Skill-tool `$10`
 * becomes `the` — Skill path only. Minimal repro: Rules A `$5`
 * B `$19.99` C `$25` D `$13,961` — A/B/D corrupt, C intact.
 * Environment: Windows 11; project skill
 * `.claude/skills/.../SKILL.md` via Skill tool.
 *
 *   node fetchling.mjs data/fetchling.json
 *   echo '{"seed":"fetchling"}' | node fetchling.mjs
 *
 * Idle word is literal (HOLD: as-written / face-value /
 * mint-true / dollar-intact / skill-verbatim / ledger-true).
 * Seeded word is fetchling (#94065 — the skill-dollar-swap path).
 * Path word is skill-dollar-swap.
 * Product score word is fetchling (Score fetchling or admit literal.).
 *
 * Encoded from anthropics/claude-code#94065 issue text only.
 * Hypothesis (NON-BINDING): skill content used as regex
 * replacement string so `$nn` expands as capture backrefs
 * (JS String.replace); escape `$$` or use a replacer function.
 * Invite verify against #94065 text only.
 * Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude.
 *
 * NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040.
 * NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre/#94055.
 * NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045.
 * NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen.
 * NOT Afterimage/#92596. NOT Phosphene. NOT Scotoma. NOT Scrim.
 * NOT Aphonia/#92409. NOT Sourdine/#93531. NOT Anarthria/#93782.
 * NOT Trismus. NOT Quietus. NOT Followspot. NOT Greenroom.
 * NOT Aside. NOT Ambo.
 * Cousins cite-only (args/Bash surfaces — do NOT rebuild / do NOT
 * conflate with #94065 Skill-load path): #79859, #82175, #89978,
 * #91957, #92457.
 * Fetchling is specifically: `$N` tokens silently swapped for
 * conversation fragments on the Skill path while CLAUDE.md
 * keeps face value. A fetchling is a shadow / doppelganger-
 * adjacent double.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "literal",
  "fetchling",
  "skill-dollar-swap",
  "hold",
  "as-written",
  "face-value",
  "mint-true",
  "dollar-intact",
  "skill-verbatim",
  "ledger-true",
  "claude-md-intact",
  "skill-path-corrupt",
  "sub-1-19",
  "intact-20-plus",
  "same-line-mix",
  "conversation-fragment",
  "silent-corruption",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "landing",
]);

export const IDLE_WORD = "literal";
export const PATH_WORD = "skill-dollar-swap";
export const SEEDED_WORD = "fetchling";
export const PRODUCT_WORD = "fetchling";
export const HOLD = Object.freeze(["literal", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "literal",
  "as-written",
  "face-value",
  "mint-true",
  "dollar-intact",
  "skill-verbatim",
  "ledger-true",
]);
export const RECOVER = Object.freeze(["literal", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "demesned",
  "diagrammed",
  "waved",
  "passable",
  "tokenized",
  "souffleur",
  "epitome",
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
  "aphonia",
  "sourdine",
  "anarthria",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "dictation-paste-drop",
  "mid-narration",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "layer-tree-walk",
  "substring-scan",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "souffleur",
  "epitome",
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
  "aphonia",
  "sourdine",
  "anarthria",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "dictation-paste-drop",
  "mid-narration",
]);

export const FEATURED_ISSUE = 94065;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94065";
export const TITLE =
  "Skill loading: $1-$19 in a skill file are replaced with unrelated conversation text (CLAUDE.md is unaffected)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:skills",
]);
export const PLATFORM = "windows";
export const SURFACE = "skill-dollar-swap";
export const HOST =
  "Claude Code Skill tool; project skill .claude/skills/.../SKILL.md";
export const CHECKED_ON =
  "Windows 11; Skill tool load of project SKILL.md; CLAUDE.md $10 control intact";
export const BUILD = "Skill tool (Windows 11)";
export const SELECTED_MODEL = "None";
export const OS = "Windows 11";
export const PHRASE = "Score fetchling or admit literal.";
export const DISTRIBUTION =
  "Skill tool load: literal `$` + 1–2 digit sequences (`$5`, `$19`) in skill Markdown do not reach the model as written; replaced with unrelated conversation fragments. Disk file unmodified; silent corruption. Roughly `$1`–`$19` substituted; `$20+` intact. Observed sub: `$3 $5 $10 $13 $15 $19`. Intact: `$20 $25 $49.99 $125 $175`. Same line can mix (`$19` gone, `$25` survives). Replacement text from surrounding conversation (sometimes exact user phrase). Localisation: CLAUDE.md `$10` intact; Skill-tool `$10` becomes `the` — Skill path only. Minimal repro Rules A `$5` B `$19.99` C `$25` D `$13,961` — A/B/D corrupt, C intact. Environment: Windows 11; project skill `.claude/skills/.../SKILL.md` via Skill tool.";

export const RULED_OUT = Object.freeze([
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
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
  "Aphonia/#92409 — missing SendMessage; ENT roster",
  "Sourdine/#93531 — mid-narration mute; concert mute",
  "Anarthria/#93782 — dictation paste drop; laryngology",
  "Trismus — different jaw lock",
  "Quietus — different extinguishing",
  "Followspot — different stage light",
  "Greenroom — different backstage wait",
  "Aside — different whispered aside",
  "Ambo — different pulpit",
]);
export const EXPECTED = Object.freeze([
  "Literal `$` + 1–2 digit sequences in skill Markdown should reach the model as written",
  "`$5`, `$19`, and `$13,961` should not be replaced with conversation fragments",
  "Disk file and model-visible text should match — no silent corruption",
  "CLAUDE.md `$10` already stays intact; Skill-tool `$10` should keep the same face value",
  "A mixed line should not drop `$19` while `$25` survives",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "sub-1-19",
    label: "sub 1–19",
    count: "$1–$19 gone",
    note: "Literal `$` + 1–2 digit sequences do not reach the model as written",
  },
  {
    id: "intact-20-plus",
    label: "intact 20+",
    count: "$20+ mint",
    note: "`$20 $25 $49.99 $125 $175` stay face-value on the same load",
  },
  {
    id: "same-line-mix",
    label: "same-line mix",
    count: "$19 gone / $25 lives",
    note: "One ledger line can mix a swapped `$19` with an intact `$25`",
  },
  {
    id: "conversation-fragment",
    label: "conversation fragment",
    count: "unrelated phrase",
    note: "Replacement text comes from surrounding conversation (sometimes exact user phrase)",
  },
  {
    id: "silent-corruption",
    label: "silent corruption",
    count: "disk unmodified",
    note: "SKILL.md on disk is unchanged; only the Skill-tool load is swapped",
  },
  {
    id: "skill-dollar-swap",
    label: "skill dollar swap",
    count: "Skill path only",
    note: "CLAUDE.md `$10` intact; Skill-tool `$10` becomes `the`",
  },
]);

export const SWAP_SHAPES = Object.freeze([
  {
    id: "sub-1-19",
    lost: "$3 $5 $10 $13 $15 $19 become conversation fragments",
    control: "$1–$19 reach the model as written",
    story: "the fetchling takes the small coins",
  },
  {
    id: "intact-20-plus",
    lost: "$20+ stay mint while the small coins swap",
    control: "every dollar token stays face-value",
    story: "the larger coins keep their faces",
  },
  {
    id: "same-line-mix",
    lost: "$19 gone, $25 survives on one line",
    control: "a mixed line stays fully literal",
    story: "one ledger row shows both faces",
  },
  {
    id: "conversation-fragment",
    lost: "unrelated conversation text lands in the skill load",
    control: "skill Markdown stays verbatim",
    story: "the double speaks a nearby phrase",
  },
  {
    id: "silent-corruption",
    lost: "disk file unmodified; model sees a different ledger",
    control: "disk and load match",
    story: "the mint tray still holds the true coins",
  },
  {
    id: "skill-dollar-swap",
    lost: "Skill path `$10` → `the`; CLAUDE.md `$10` intact",
    control: "both paths keep face value",
    story: "only the skill-path glass is the fetchling",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "literal-desk",
    survey:
      "twilight desk; mint tray face-value; ledger true; mirror shows the same coins",
    kind: "literal",
    note: "idle: literal — the hold/good path",
  },
  {
    id: "sub-1-19",
    survey:
      "Skill-tool load swaps `$1`–`$19` for conversation fragments",
    kind: "fetchling",
    note: "seeded: fetchling takes the small coins",
  },
  {
    id: "skill-dollar-swap",
    survey:
      "CLAUDE.md `$10` intact; Skill-tool `$10` becomes `the`; disk unmodified",
    kind: "fetchling",
    note: "path: skill-dollar-swap names the silent swap",
  },
  {
    id: "same-line-mix",
    survey:
      "`$19` gone and `$25` intact on one line; `$20+` mint-true",
    kind: "fetchling",
    note: "seeded: mixed ledger row",
  },
  {
    id: "fetchling",
    survey:
      "the booth is fetchling — the shadow-double swaps `$N` for conversation text",
    kind: "fetchling",
    note: "seeded: fetchling — Score fetchling or admit literal.",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "skill-dollar-swap",
  "fetchling",
  "sub-1-19",
  "intact-20-plus",
  "same-line-mix",
  "conversation-fragment",
  "silent-corruption",
  "claude-md-intact",
  "skill-path-corrupt",
]);

export const COUSINS = Object.freeze([
  {
    issue: 79859,
    title: "Skill tool args bash-style $N against SKILL.md prose",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Skill tool args surface, not the #94065 Skill-load content path. Do not rebuild. Do not conflate.",
  },
  {
    issue: 82175,
    title: "Skill tool args corrupts $1/$2 in code examples",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Skill tool args surface, not the #94065 Skill-load content path. Do not rebuild. Do not conflate.",
  },
  {
    issue: 89978,
    title: "Bash tool strips dollar amounts from message content",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Bash tool surface, not the #94065 Skill-load content path. Do not rebuild. Do not conflate.",
  },
  {
    issue: 91957,
    title: "Skill args silently rewrites literal dollar figures in SKILL.md",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Skill args surface, not the #94065 Skill-load content path. Do not rebuild. Do not conflate.",
  },
  {
    issue: 92457,
    title: "Skill/command argument substitution off-by-one / limited to $0/$1",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Skill/command argument substitution, not the #94065 Skill-load content path. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059 bg tasks stale Running / ssh stdin hang", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94174, title: "backup #94174", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "souffleur",
  "epitome",
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
  "aphonia",
  "sourdine",
  "anarthria",
  "trismus",
  "quietus",
  "followspot",
  "greenroom",
  "aside",
  "ambo",
]);

export const SAMPLE_KIND_IDLE = "ledger-true";
export const SAMPLE_KIND_SEEDED = "skill-dollar-swap";
export const SAMPLE_HOLDING_IDLE = "face-value";
export const SAMPLE_HOLDING_SEEDED = "swapped";

export const SAMPLE_LITERAL_PROOF = Object.freeze({
  literal: true,
  fetchling: false,
  skillDollarSwap: false,
  sub119: false,
  intact20Plus: false,
  sameLineMix: false,
  conversationFragment: false,
  silentCorruption: false,
  claudeMdIntact: false,
  skillPathCorrupt: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_FETCHLING_PROOF = Object.freeze({
  literal: false,
  fetchling: true,
  skillDollarSwap: true,
  sub119: true,
  intact20Plus: true,
  sameLineMix: true,
  conversationFragment: true,
  silentCorruption: true,
  claudeMdIntact: true,
  skillPathCorrupt: true,
  kind: SAMPLE_KIND_SEEDED,
  shapes: SWAP_SHAPES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds literal: mint tray face-value; ledger true; twilight glass shows the same coins" },
  { t: "load", line: "Skill tool loads .claude/skills/.../SKILL.md" },
  { t: "swap", line: "$1–$19 become conversation fragments; $20+ stay mint; disk unmodified" },
  { t: "path", line: "skill-dollar-swap — CLAUDE.md $10 intact; Skill-tool $10 becomes the" },
  { t: "score", line: "when the fetchling swaps $N for conversation text the booth is fetchling — Score fetchling or admit literal." },
]);

const FORCE_FLAGS = [
  "skillDollarSwap",
  "sub119",
  "intact20Plus",
  "sameLineMix",
  "conversationFragment",
  "silentCorruption",
  "claudeMdIntact",
  "skillPathCorrupt",
];

/**
 * Desk map: literal mint tray vs fetchling glass.
 * Idle/literal: coins face-value; ledger true; mirror shows the same.
 * Seeded/fetchling: Skill path swaps $1–$19; CLAUDE.md keeps face value.
 */
export function mapDesk(input = {}) {
  const fetchling = isFetchlingInput(input);
  const literal = input.literal === true && !fetchling;
  return {
    stamp: fetchling ? "skill-dollar-swap" : "literal-desk",
    holdingLane: fetchling ? "swapped" : "face-value",
    kindLane: fetchling ? "skill-dollar-swap" : "ledger-true",
    bindLane: fetchling ? "sub-1-19" : "dollar-intact",
    ribbon: fetchling ? "fetchling" : "literal",
    literal,
  };
}

export function inspectMint(input = {}) {
  const swapped = isFetchlingInput(input);
  if (input.literal === true && !swapped) {
    return {
      stamp: "mint-true",
      swapped: false,
      note: "mint tray stays face-value — the house holds literal",
    };
  }
  return {
    stamp: swapped ? "mint-split" : "mint-idle",
    swapped,
    note: swapped
      ? "mint tray on disk is still true; the Skill-tool load is the fetchling"
      : "",
  };
}

export function inspectLedger(input = {}) {
  const swapped = isFetchlingInput(input);
  if (input.literal === true && !swapped) {
    return {
      stamp: "ledger-true",
      swapped: false,
      edge: "face-value",
    };
  }
  return {
    stamp: swapped ? "ledger-swapped" : "ledger-idle",
    swapped,
    edge: swapped ? "sub-1-19" : "face-value",
    note: swapped
      ? "skill ledger $1–$19 become conversation fragments; $20+ stay mint"
      : "",
  };
}

export function inspectMirror(input = {}) {
  const doubled = isFetchlingInput(input);
  if (input.literal === true && !doubled) {
    return {
      stamp: "mirror-same",
      doubled: false,
    };
  }
  return {
    stamp: doubled ? "mirror-double" : "mirror-idle",
    doubled,
    note: doubled
      ? "twilight glass shows a fetchling — conversation fragments where $N should be"
      : "",
  };
}

export function inspectDouble(input = {}) {
  const present =
    input.conversationFragment === true ||
    input.fetchling === true ||
    isFetchlingInput(input);
  if (input.literal === true && !present) {
    return {
      stamp: "double-absent",
      present: false,
    };
  }
  return {
    stamp: present ? "double-present" : "double-idle",
    present,
    note: present
      ? "the shadow-double speaks a nearby conversation phrase"
      : "",
  };
}

export function inspectSkillPath(input = {}) {
  const corrupt =
    input.skillPathCorrupt === true ||
    input.skillDollarSwap === true ||
    input.fetchling === true ||
    isFetchlingInput(input);
  if (input.literal === true && !corrupt) {
    return {
      stamp: "skill-verbatim",
      corrupt: false,
    };
  }
  return {
    stamp: corrupt ? "skill-path-corrupt" : "skill-idle",
    corrupt,
    note: corrupt
      ? "Skill-tool $10 becomes the — Skill path only"
      : "",
  };
}

export function inspectClaudeMd(input = {}) {
  const intact =
    input.claudeMdIntact === true ||
    input.skillDollarSwap === true ||
    input.fetchling === true ||
    isFetchlingInput(input);
  if (input.literal === true && !intact) {
    return {
      stamp: "claude-md-idle",
      intact: false,
    };
  }
  return {
    stamp: intact ? "claude-md-intact" : "claude-md-idle",
    intact,
    note: intact
      ? "CLAUDE.md $10 stays face-value — localisation control"
      : "",
  };
}

function shapeOpen(input, id) {
  const map = {
    "sub-1-19": input.sub119,
    "intact-20-plus": input.intact20Plus,
    "same-line-mix": input.sameLineMix,
    "conversation-fragment": input.conversationFragment,
    "silent-corruption": input.silentCorruption,
    "skill-dollar-swap": input.skillDollarSwap,
  };
  return (
    map[id] === true ||
    input.skillDollarSwap === true ||
    input.fetchling === true
  );
}

function isFetchlingInput(input = {}) {
  return (
    input.fetchling === true ||
    input.skillDollarSwap === true ||
    input.sub119 === true ||
    input.intact20Plus === true ||
    input.sameLineMix === true ||
    input.conversationFragment === true ||
    input.silentCorruption === true ||
    input.claudeMdIntact === true ||
    input.skillPathCorrupt === true
  );
}

export function readBooth(input = {}) {
  const fetchling = isFetchlingInput(input);
  const literal = input.literal === true && !fetchling;
  return {
    mark: fetchling ? "fetchling" : "literal",
    literal,
    fetchling,
    skillDollarSwap: input.skillDollarSwap === true || fetchling,
    sub119: input.sub119 === true,
    intact20Plus: input.intact20Plus === true,
    sameLineMix: input.sameLineMix === true,
    conversationFragment: input.conversationFragment === true,
    silentCorruption: input.silentCorruption === true,
    claudeMdIntact: input.claudeMdIntact === true,
    skillPathCorrupt: input.skillPathCorrupt === true,
    scope: mapDesk(input),
    mint: inspectMint(input),
    ledger: inspectLedger(input),
    mirror: inspectMirror(input),
    double: inspectDouble(input),
    skillPath: inspectSkillPath(input),
    claudeMd: inspectClaudeMd(input),
    shapes: SWAP_SHAPES.filter((row) => shapeOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const FETCHLING_WALK = Object.freeze([
  {
    t: "idle",
    event: "ledger-literal",
    literal: true,
    fetchling: false,
    cue: "literal",
    note: "idle HOLD: mint tray face-value; ledger true; twilight glass shows the same coins — the hold/good path",
  },
  {
    t: "load",
    event: "skill-tool-load",
    fetchling: true,
    skillDollarSwap: true,
    cue: "fetchling",
    note: "Skill tool loads .claude/skills/.../SKILL.md",
  },
  {
    t: "swap",
    event: "sub-1-19",
    fetchling: true,
    sub119: true,
    conversationFragment: true,
    silentCorruption: true,
    cue: "fetchling",
    note: "$1–$19 become conversation fragments; disk unmodified",
  },
  {
    t: "path",
    event: "skill-dollar-swap",
    fetchling: true,
    skillDollarSwap: true,
    claudeMdIntact: true,
    skillPathCorrupt: true,
    cue: "fetchling",
    note: "skill-dollar-swap — CLAUDE.md $10 intact; Skill-tool $10 becomes the",
  },
  {
    t: "score",
    event: "fetchling",
    fetchling: true,
    skillDollarSwap: true,
    sub119: true,
    intact20Plus: true,
    sameLineMix: true,
    conversationFragment: true,
    silentCorruption: true,
    claudeMdIntact: true,
    skillPathCorrupt: true,
    cue: "fetchling",
    note: "fetchling — when the shadow-double swaps $N for conversation text the booth is fetchling",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "ledger-literal",
    literal: true,
    fetchling: false,
    cue: "literal",
    note: "positive control: CLAUDE.md $10 and Skill-tool $10 both stay face-value — the desk is literal",
  },
  {
    t: "admit",
    event: "ledger-literal",
    literal: true,
    cue: "literal",
    note: "positive control: the desk admits literal",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    literal: true,
    fetchling: false,
    skillDollarSwap: false,
    cue: "literal",
  };
}

export function seedLiteral() {
  return { ...emptyTicket() };
}

export function seedFetchling() {
  return {
    seed: SEEDED_WORD,
    literal: false,
    fetchling: true,
    skillDollarSwap: true,
    sub119: true,
    intact20Plus: true,
    sameLineMix: true,
    conversationFragment: true,
    silentCorruption: true,
    claudeMdIntact: true,
    skillPathCorrupt: true,
    cue: "fetchling",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_FETCHLING_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    fetchling: true,
    skillDollarSwap: true,
    sub119: true,
    cue: "fetchling",
  };
}

export function seedSkillDollarSwap() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    fetchling: true,
    skillDollarSwap: true,
    event: "skill-dollar-swap",
    cue: "fetchling",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedAsWritten() {
  return {
    seed: "as-written",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedFaceValue() {
  return {
    seed: "face-value",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedMintTrue() {
  return {
    seed: "mint-true",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedDollarIntact() {
  return {
    seed: "dollar-intact",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedSkillVerbatim() {
  return {
    seed: "skill-verbatim",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedLedgerTrue() {
  return {
    seed: "ledger-true",
    preferSeed: true,
    literal: true,
    cue: "literal",
  };
}

export function seedClaudeMdIntact() {
  return {
    seed: "claude-md-intact",
    preferSeed: true,
    claudeMdIntact: true,
    cue: "fetchling",
  };
}

export function seedSkillPathCorrupt() {
  return {
    seed: "skill-path-corrupt",
    preferSeed: true,
    skillPathCorrupt: true,
    cue: "fetchling",
  };
}

export function seedSub119() {
  return {
    seed: "sub-1-19",
    preferSeed: true,
    sub119: true,
    cue: "fetchling",
  };
}

export function seedIntact20Plus() {
  return {
    seed: "intact-20-plus",
    preferSeed: true,
    intact20Plus: true,
    cue: "fetchling",
  };
}

export function seedSameLineMix() {
  return {
    seed: "same-line-mix",
    preferSeed: true,
    sameLineMix: true,
    cue: "fetchling",
  };
}

export function seedConversationFragment() {
  return {
    seed: "conversation-fragment",
    preferSeed: true,
    conversationFragment: true,
    cue: "fetchling",
  };
}

export function seedSilentCorruption() {
  return {
    seed: "silent-corruption",
    preferSeed: true,
    silentCorruption: true,
    cue: "fetchling",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      literal: false,
      fetchling: false,
      skillDollarSwap: false,
      sub119: false,
      intact20Plus: false,
      sameLineMix: false,
      conversationFragment: false,
      silentCorruption: false,
      claudeMdIntact: false,
      skillPathCorrupt: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    literal: raw.literal === true,
    fetchling: raw.fetchling === true || raw.event === "fetchling",
    skillDollarSwap:
      raw.skillDollarSwap === true ||
      raw.event === "skill-dollar-swap",
    sub119: raw.sub119 === true || raw.event === "sub-1-19",
    intact20Plus:
      raw.intact20Plus === true || raw.event === "intact-20-plus",
    sameLineMix:
      raw.sameLineMix === true || raw.event === "same-line-mix",
    conversationFragment:
      raw.conversationFragment === true ||
      raw.event === "conversation-fragment",
    silentCorruption:
      raw.silentCorruption === true || raw.event === "silent-corruption",
    claudeMdIntact:
      raw.claudeMdIntact === true || raw.event === "claude-md-intact",
    skillPathCorrupt:
      raw.skillPathCorrupt === true || raw.event === "skill-path-corrupt",
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
      (ticket.literal != null ||
        ticket.fetchling != null ||
        ticket.skillDollarSwap != null ||
        ticket.sub119 != null ||
        ticket.intact20Plus != null ||
        ticket.sameLineMix != null ||
        ticket.conversationFragment != null ||
        ticket.silentCorruption != null ||
        ticket.claudeMdIntact != null ||
        ticket.skillPathCorrupt != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isLiteral(row) {
  if (row.fetchling && row.cue !== "literal") return false;
  if (row.cue === "fetchling" || row.cue === "skill-dollar-swap") {
    return false;
  }
  if (
    row.skillDollarSwap &&
    row.sub119 &&
    row.cue !== "literal" &&
    row.literal !== true
  ) {
    return false;
  }
  if (
    row.literal === true &&
    row.fetchling !== true &&
    row.cue !== "fetchling"
  ) {
    return true;
  }
  if (
    row.cue === "literal" &&
    row.fetchling !== true &&
    row.skillDollarSwap !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isSkillDollarSwap(row) {
  return (
    row.event === "skill-dollar-swap" &&
    !isLiteral(row) &&
    (row.skillDollarSwap === true ||
      row.sub119 === true ||
      row.fetchling === true)
  );
}

function isFetchlingRow(row) {
  if (isLiteral(row)) return false;
  if (isSkillDollarSwap(row) && row.cue !== "fetchling") return false;
  if (row.cue === "fetchling") return true;
  if (row.fetchling === true) return true;
  if (row.skillDollarSwap === true && row.sub119 === true) {
    return true;
  }
  if (
    row.skillDollarSwap === true ||
    row.sub119 === true ||
    row.intact20Plus === true ||
    row.sameLineMix === true ||
    row.conversationFragment === true ||
    row.silentCorruption === true ||
    row.claudeMdIntact === true ||
    row.skillPathCorrupt === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one fetchling pass against the desk.
 * literal: mint tray face-value; ledger true; mirror same.
 * fetchling: $1–$19 swapped after Skill-tool load.
 * skill-dollar-swap: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSkillDollarSwap(row) ||
    (row.skillDollarSwap &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "skill-dollar-swap";
  } else if (isFetchlingRow(row)) {
    verdict = "fetchling";
  } else if (isLiteral(row)) {
    verdict = "literal";
  } else if (
    row.skillDollarSwap ||
    row.sub119 ||
    row.intact20Plus ||
    row.sameLineMix ||
    row.conversationFragment ||
    row.silentCorruption ||
    row.claudeMdIntact ||
    row.skillPathCorrupt
  ) {
    verdict = "fetchling";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const mint = inspectMint(row);
  const ledger = inspectLedger(row);
  const mirror = inspectMirror(row);
  const double = inspectDouble(row);
  const skillPath = inspectSkillPath(row);
  const claudeMd = inspectClaudeMd(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    literal: verdict === "literal" || verdict === "hold",
    fetchling: verdict === "fetchling" || verdict === SEEDED_WORD,
    skillDollarSwap:
      row.skillDollarSwap === true ||
      verdict === "skill-dollar-swap" ||
      verdict === PATH_WORD,
    sub119: row.sub119,
    intact20Plus: row.intact20Plus,
    sameLineMix: row.sameLineMix,
    conversationFragment: row.conversationFragment,
    silentCorruption: row.silentCorruption,
    claudeMdIntact: row.claudeMdIntact,
    skillPathCorrupt: row.skillPathCorrupt,
    cue: hold
      ? "literal"
      : row.skillDollarSwap ||
          verdict === "skill-dollar-swap"
        ? "skill-dollar-swap"
        : "fetchling",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit literal" : "score fetchling",
    mintInspect: mint,
    ledgerInspect: ledger,
    mirrorInspect: mirror,
    doubleInspect: double,
    skillPathInspect: skillPath,
    claudeMdInspect: claudeMd,
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
      : FETCHLING_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "fetchling");
  const path = scored.filter(
    (row) => row.verdict === "skill-dollar-swap",
  );
  const literal = scored.filter((row) => row.verdict === "literal");
  const headline =
    scored.find((row) => row.event === "fetchling") ||
    scored.find((row) => row.event === "skill-dollar-swap") ||
    scored.find((row) => row.event === "sub-1-19") ||
    charged[charged.length - 1];
  let verdict = "literal";
  if (charged.length) verdict = "fetchling";
  else if (path.length && !literal.length) {
    verdict = "skill-dollar-swap";
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
    fetchlingCount: charged.length,
    pathCount: path.length,
    literalCount: literal.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit literal" : "score fetchling",
    note: headline
      ? "Skill-tool load swaps $1–$19 for conversation fragments; $20+ intact; CLAUDE.md $10 intact. Cousins cite-only (args/Bash surfaces): #79859 #82175 #89978 #91957 #92457 — do not rebuild, do not conflate."
      : "published fetchling walk scored against literal vs fetchling",
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
    seeded !== "literal" &&
    seeded !== "fetchling" &&
    seeded !== "skill-dollar-swap" &&
    ticket.literal == null &&
    ticket.fetchling == null &&
    ticket.skillDollarSwap == null &&
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
    literal: scored.literal ?? false,
    fetchling: scored.fetchling ?? false,
    skillDollarSwap: scored.skillDollarSwap ?? false,
    sub119: scored.sub119 ?? false,
    intact20Plus: scored.intact20Plus ?? false,
    sameLineMix: scored.sameLineMix ?? false,
    conversationFragment: scored.conversationFragment ?? false,
    silentCorruption: scored.silentCorruption ?? false,
    claudeMdIntact: scored.claudeMdIntact ?? false,
    skillPathCorrupt: scored.skillPathCorrupt ?? false,
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
    result.sub119 || result.fetchling
      ? "kind=skill-dollar-swap"
      : "kind=ledger-true",
    result.conversationFragment || result.fetchling
      ? "ref=swapped"
      : "ref=face-value",
    result.skillDollarSwap ||
    result.verdict === "skill-dollar-swap"
      ? "path=skill-dollar-swap"
      : "path=literal",
    result.cue === "literal"
      ? "cue=literal"
      : result.cue === "skill-dollar-swap"
        ? "cue=skill-dollar-swap"
        : "cue=fetchling",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    literal: result.literal,
    fetchling: result.fetchling,
    skillDollarSwap: result.skillDollarSwap,
    sub119: result.sub119,
    intact20Plus: result.intact20Plus,
    sameLineMix: result.sameLineMix,
    conversationFragment: result.conversationFragment,
    silentCorruption: result.silentCorruption,
    claudeMdIntact: result.claudeMdIntact,
    skillPathCorrupt: result.skillPathCorrupt,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    mint: inspectMint({
      literal: result.literal,
      fetchling: result.fetchling,
      skillDollarSwap: result.skillDollarSwap,
    }),
    ledger: inspectLedger({
      literal: result.literal,
      fetchling: result.fetchling,
      skillDollarSwap: result.skillDollarSwap,
    }),
    mirror: inspectMirror({
      literal: result.literal,
      fetchling: result.fetchling,
      skillDollarSwap: result.skillDollarSwap,
    }),
    double: inspectDouble({
      literal: result.literal,
      fetchling: result.fetchling,
      conversationFragment: result.conversationFragment,
    }),
    skillPath: inspectSkillPath({
      literal: result.literal,
      fetchling: result.fetchling,
      skillPathCorrupt: result.skillPathCorrupt,
      skillDollarSwap: result.skillDollarSwap,
    }),
    claudeMd: inspectClaudeMd({
      literal: result.literal,
      fetchling: result.fetchling,
      claudeMdIntact: result.claudeMdIntact,
      skillDollarSwap: result.skillDollarSwap,
    }),
    scope: mapDesk({
      literal: result.literal,
      fetchling: result.fetchling,
      skillDollarSwap: result.skillDollarSwap,
      sub119: result.sub119,
      intact20Plus: result.intact20Plus,
      sameLineMix: result.sameLineMix,
      conversationFragment: result.conversationFragment,
      silentCorruption: result.silentCorruption,
      claudeMdIntact: result.claudeMdIntact,
      skillPathCorrupt: result.skillPathCorrupt,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      fetchling: result.fetchling === true || result.verdict === "fetchling",
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
      shapes: SWAP_SHAPES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: skill content used as regex replacement string so $nn expands as capture backrefs (JS String.replace); escape $$ or use a replacer function. Invite verify against #94065 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
