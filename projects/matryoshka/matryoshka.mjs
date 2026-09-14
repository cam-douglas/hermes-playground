#!/usr/bin/env node
/**
 * Matryoshka — lacquer nesting-doll / birch-workshop booth.
 * A *matryoshka* is a Russian nesting doll: the outer `$(...)`
 * doll wraps inner `;` / `|` joints. The Bash permission
 * walker opens the outer doll but cannot recurse into those
 * nested joints, even though the same joints work at top
 * level and every leaf command is allow-listed. Lacquer-red
 * workshop / birch wood / gold leaf / indigo cloth. NOT a
 * night blotter (Dragnet). NOT an enrollment desk
 * (Matricula). NOT a type-foundry (Allograph). NOT a
 * neurology writing-desk (Agraphia). NOT a
 * gauntlet/lictor/lychgate/ouster/proscription booth.
 *
 * Educational diagnostic model for a published Claude Code
 * Bash-permission defect: control-operator nodes (`;` /
 * "list", `|` / "pipeline") nested inside a `$(...)`
 * command substitution force unnecessary manual approval
 * on a command whose every component is individually
 * allow-listed. The semicolon case leaks the walker's
 * internal fallback string `Unhandled node type: ;` into
 * the permission prompt. Version noted: 2.1.126
 * (WSL/Ubuntu).
 *
 * Encoded from anthropics/claude-code#94350 issue text only.
 * Hypothesis (NON-BINDING): the AST permission walker does
 * not recurse into command-substitution bodies for
 * list/pipeline nodes, so nested `;`/`|` hit the
 * unhandled-node fallback (prompt + error leak) even when
 * every leaf command is allow-listed and top-level
 * compounds are fine. Invite verify against issue text
 * only. Do NOT claim a root cause in Claude Code source
 * you have not seen. Do NOT implement a Claude Code fix.
 * No network. No exploits. No live Claude.
 *
 *   node matryoshka.mjs data/matryoshka.json
 *   echo '{"seed":"matryoshka"}' | node matryoshka.mjs
 *
 * Idle word is unpacked (HOLD: walker recurses into `$(...)`
 * and treats nested list/pipeline nodes like top-level —
 * no prompt, no raw error leak). HOLD aliases: descended,
 * recursed, opened, nested-ok, walked-in.
 * Seeded word is matryoshka (#94350 path).
 * Path word is subst-nest.
 * Product score word is matryoshka (Score matryoshka or admit unpacked.).
 *
 * NOT Dragnet/#94064. NOT Matricula/#93987. NOT Allograph/#94256.
 * NOT Agraphia/#94251. NOT Gauntlet/#94029. NOT Lictor/#94053.
 * NOT Lychgate/#94059. NOT Ouster/#94221. NOT Proscription/#94202.
 * NOT Frisket. NOT Scant.
 * Cousins cite-only (CLOSED — do NOT rebuild / do NOT conflate):
 * #55170 — parenthesized subshell `(cmd1; cmd2)` → Unhandled node type: ;
 * #47752 / #56019 — heredoc+pipe → Unhandled node type: pipeline
 * #47701 / #47706 — redirects → Unhandled node type: file_redirect
 * #46868 — feature request auto-allow compound when every component allowed
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "unpacked",
  "matryoshka",
  "subst-nest",
  "hold",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "unhandled-node",
  "error-leak",
  "nested-pipe",
  "nested-semicolon",
  "top-level-ok",
  "allowlisted-parts",
  "subst-body",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "unpacked";
export const PATH_WORD = "subst-nest";
export const SEEDED_WORD = "matryoshka";
export const PRODUCT_WORD = "matryoshka";
export const HOLD = Object.freeze(["unpacked", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
]);
export const RECOVER = Object.freeze(["unpacked", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
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
  "inked",
  "recorded",
  "retained",
  "charted",
  "filed",
  "marked",
  "matched",
  "congruent",
  "aligned",
  "normalized",
  "samepath",
  "escheated",
  "regranted",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "escheated",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94350;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94350";
export const TITLE =
  '[BUG] Bash permission walker: "Unhandled node type" forces prompts on pipes/semicolons nested inside $(...) command substitution';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:bash",
  "platform:wsl",
  "area:permissions",
]);
export const PLATFORM = "linux";
export const SURFACE = "subst-nest";
export const HOST = "Claude Code 2.1.126 (WSL/Ubuntu)";
export const CHECKED_ON =
  "Published repro: simple $(pwd) and $(cat … 2>/dev/null) stay clean; $(cat file.txt | wc -l) prompts; $(echo a; echo b) prompts and leaks Unhandled node type: ;";
export const BUILD = "Claude Code 2.1.126 (WSL/Ubuntu)";
export const SELECTED_MODEL = "n/a — Bash permission walker, not a model defect";
export const OS = "WSL/Ubuntu; platform:linux / platform:wsl";
export const PHRASE = "Score matryoshka or admit unpacked.";
export const DISTRIBUTION =
  "Bash permission walker's tree-sitter AST dispatcher fails to handle control-operator nodes (; / \"list\", | / \"pipeline\") when they occur nested inside a $(...) command substitution, even though the same operators are handled fine at the top level. Forces unnecessary manual approval on a command whose every component is individually allow-listed. In the semicolon case, leaks the walker's internal fallback error string Unhandled node type: ; into the permission prompt shown to the user. Published repro: echo \"x: $(pwd)\" → clean (single simple command inside $(...)); echo \"x: $(cat file.txt 2>/dev/null)\" → clean (single command + redirect inside $(...)); echo \"x: $(cat file.txt | wc -l)\" → PROMPTS (pipe nested inside $(...)); echo \"x: $(echo a; echo b)\" → PROMPTS + shows literal Unhandled node type: ;. Every inner command (cat, wc, echo, pwd) independently auto-allowed; top-level ; and | outside substitution handled correctly — failure is specific to control-operator node inside $(...) subtree.";

export const ALLOWLISTED_PARTS = Object.freeze(["cat", "wc", "echo", "pwd"]);
export const UNHANDLED_SEMI = "Unhandled node type: ;";
export const UNHANDLED_LIST = "list";
export const UNHANDLED_PIPELINE = "pipeline";

export const PUBLISHED_REPROS = Object.freeze([
  {
    id: "simple-subst",
    command: 'echo "x: $(pwd)"',
    prompts: false,
    errorLeak: false,
    note: "single simple command inside $(...)",
  },
  {
    id: "redirect-subst",
    command: 'echo "x: $(cat file.txt 2>/dev/null)"',
    prompts: false,
    errorLeak: false,
    note: "single command + redirect inside $(...)",
  },
  {
    id: "nested-pipe",
    command: 'echo "x: $(cat file.txt | wc -l)"',
    prompts: true,
    errorLeak: false,
    note: "pipe nested inside $(...)",
  },
  {
    id: "nested-semicolon",
    command: 'echo "x: $(echo a; echo b)"',
    prompts: true,
    errorLeak: true,
    leak: UNHANDLED_SEMI,
    note: "semicolon nested inside $(...)",
  },
]);

export const DOLL_NAMES = Object.freeze([
  {
    id: "outer-doll",
    lost: "Outer doll — walker opens $(...) but does not recurse into nested joints",
    control: "The walker would unpack the outer doll and walk the body like top-level",
    story: "the lacquer shell opens; the inner joints stay shut",
  },
  {
    id: "inner-joint-pipe",
    lost: "Inner pipe joint — | / pipeline nested inside $(...) forces a prompt",
    control: "A nested pipeline would be walked like a top-level pipeline",
    story: "the gold hinge is a pipeline the walker cannot name",
  },
  {
    id: "inner-joint-semi",
    lost: "Inner semicolon joint — ; / list nested inside $(...) forces a prompt",
    control: "A nested list would be walked like a top-level list",
    story: "the birch seam is a list the walker cannot name",
  },
  {
    id: "error-leak",
    lost: "Error leak — Unhandled node type: ; appears in the permission prompt",
    control: "Unhandled-node fallback would show a generic approval, not a raw internal string",
    story: "the workshop stamp prints the walker's private fallback on the slip",
  },
  {
    id: "allowlisted-parts",
    lost: "Allow-listed parts — cat, wc, echo, pwd each auto-allowed alone",
    control: "Every leaf is already on the allow list; the compound should not prompt",
    story: "every piece is lacquered; the nest still asks for a hand stamp",
  },
  {
    id: "subst-nest",
    lost: "subst-nest — control-operator node inside the $(...) subtree is the failure",
    control: "Top-level ; and | outside substitution stay handled",
    story: "the nest, not the joint, is what the walker cannot open",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "outer-doll",
    survey: "lacquer $(...) shell; walker opens the outer doll",
    kind: "unpacked",
    note: "idle/control: recurse into the subst body — the hold/good path",
  },
  {
    id: "inner-joint-pipe",
    survey: 'echo "x: $(cat file.txt | wc -l)" → PROMPTS',
    kind: "matryoshka",
    note: "seeded: pipe nested inside $(...)",
  },
  {
    id: "inner-joint-semi",
    survey: 'echo "x: $(echo a; echo b)" → PROMPTS + Unhandled node type: ;',
    kind: "matryoshka",
    note: "seeded: semicolon nested inside $(...)",
  },
  {
    id: "error-leak",
    survey: "internal fallback string leaks into the permission prompt",
    kind: "matryoshka",
    note: "seeded: Unhandled node type: ;",
  },
  {
    id: "allowlisted-parts",
    survey: "cat, wc, echo, pwd independently auto-allowed",
    kind: "matryoshka",
    note: "seeded: every leaf is already allow-listed",
  },
  {
    id: "workshop-bench",
    survey: "subst-nest — control-operator inside $(...) subtree; top-level compounds fine",
    kind: "matryoshka",
    note: "path: subst-nest names the nested-joint miss",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "nested-pipe",
    label: "nested pipe",
    count: "$(cat file.txt | wc -l)",
    note: "Pipe nested inside $(...) prompts",
  },
  {
    id: "nested-semicolon",
    label: "nested semicolon",
    count: "$(echo a; echo b)",
    note: "Semicolon nested inside $(...) prompts",
  },
  {
    id: "error-leak",
    label: "error leak",
    count: "Unhandled node type: ;",
    note: "Walker fallback string shown in the permission prompt",
  },
  {
    id: "allowlisted-parts",
    label: "allow-listed parts",
    count: "cat · wc · echo · pwd",
    note: "Every inner command independently auto-allowed",
  },
  {
    id: "top-level-ok",
    label: "top-level ok",
    count: "; and | outside subst",
    note: "Same operators handled correctly at top level",
  },
  {
    id: "subst-nest",
    label: "subst-nest",
    count: "control-operator inside $(...)",
    note: "Path: failure is specific to the $(...) subtree",
  },
]);

export const RULED_OUT = Object.freeze([
  "Dragnet/#94064 root-find — night blotter / full-disk find; DIFFERENT",
  "Matricula/#93987 reload-blind — enrollment desk; desktop /reload-skills (no changes); DIFFERENT",
  "Allograph/#94256 win-posix-mismatch — Windows punch vs POSIX matrix; type-foundry; DIFFERENT",
  "Agraphia/#94251 pre-tool-omit — JSONL drops pre-tool text; medical writing-desk; DIFFERENT",
  "Gauntlet/#94029 attach-mouse — attach ignores DISABLE_MOUSE; DIFFERENT",
  "Lictor/#94053 picker-bypass — desktop model picker skips Pre/PostModelSwitch; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Frisket — different catalog paradigm; NOT this booth",
  "Scant — different catalog paradigm; NOT this booth",
  "#55170 — parenthesized subshell (cmd1; cmd2) → Unhandled node type: ; — cite-only cousin, CLOSED",
  "#47752 / #56019 — heredoc+pipe → Unhandled node type: pipeline — cite-only cousins, CLOSED",
  "#47701 / #47706 — redirects → Unhandled node type: file_redirect — cite-only cousins, CLOSED",
  "#46868 — feature request auto-allow compound when every component allowed — cite-only cousin, CLOSED",
]);

export const EXPECTED = Object.freeze([
  "Walker should recurse into $(...) / backtick bodies like top-level list/pipeline",
  "Nested | inside $(...) should not force a prompt when every leaf is allow-listed",
  "Nested ; inside $(...) should not force a prompt when every leaf is allow-listed",
  "Unhandled-node fallback must not leak Unhandled node type: ; into the permission prompt",
  "Top-level ; and | outside substitution remain handled (already published as working)",
  "echo \"x: $(pwd)\" and echo \"x: $(cat file.txt 2>/dev/null)\" stay clean (already published as working)",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "subst-nest",
  "matryoshka",
  "unhandled-node",
  "error-leak",
  "nested-pipe",
  "nested-semicolon",
]);

export const COUSINS = Object.freeze([
  {
    issue: 55170,
    title: "parenthesized subshell (cmd1; cmd2) → Unhandled node type: ;",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — CLOSED. Parenthesized subshell, not $(...) command substitution. Do not rebuild. Do not conflate.",
  },
  {
    issue: 47752,
    title: "heredoc+pipe → Unhandled node type: pipeline",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — CLOSED. Heredoc+pipe, not nested pipe inside $(...). Do not rebuild. Do not conflate.",
  },
  {
    issue: 56019,
    title: "heredoc+pipe → Unhandled node type: pipeline",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — CLOSED. Same heredoc+pipe family as #47752. Do not rebuild. Do not conflate.",
  },
  {
    issue: 47701,
    title: "redirects → Unhandled node type: file_redirect",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — CLOSED. Redirect node, not list/pipeline inside $(...). This booth's redirect-inside-$(...) repro is clean. Do not rebuild. Do not conflate.",
  },
  {
    issue: 47706,
    title: "redirects → Unhandled node type: file_redirect",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — CLOSED. Same redirect family as #47701. Do not rebuild. Do not conflate.",
  },
  {
    issue: 46868,
    title: "feature request: auto-allow compound when every component allowed",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — CLOSED. Feature request for compound auto-allow; this booth is the $(...) AST miss. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94277, title: "backup #94277", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
]);

export const SAMPLE_KIND_IDLE = "nested-ok";
export const SAMPLE_KIND_SEEDED = "subst-nest";
export const SAMPLE_HOLDING_IDLE = "descended";
export const SAMPLE_HOLDING_SEEDED = "unhandled-node";

export const SAMPLE_UNPACKED_PROOF = Object.freeze({
  unpacked: true,
  matryoshka: false,
  substNest: false,
  nestedPipe: false,
  nestedSemicolon: false,
  errorLeak: false,
  unhandledNode: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_MATRYOSHKA_PROOF = Object.freeze({
  unpacked: false,
  matryoshka: true,
  substNest: true,
  nestedPipe: true,
  nestedSemicolon: true,
  errorLeak: true,
  unhandledNode: true,
  allowlistedParts: true,
  topLevelOk: true,
  kind: SAMPLE_KIND_SEEDED,
  names: DOLL_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds unpacked: walker recurses into $(...) and treats nested list/pipeline like top-level — no prompt, no raw error leak" },
  { t: "pipe", line: "echo \"x: $(cat file.txt | wc -l)\" → PROMPTS (pipe nested inside $(...))" },
  { t: "semi", line: "echo \"x: $(echo a; echo b)\" → PROMPTS + Unhandled node type: ;" },
  { t: "path", line: "subst-nest — control-operator node inside $(...) subtree; top-level ; and | stay handled; every leaf allow-listed" },
  { t: "score", line: "when the outer doll will not unpack the inner joints the booth is matryoshka — Score matryoshka or admit unpacked." },
]);

const FORCE_FLAGS = [
  "nestedPipe",
  "nestedSemicolon",
  "errorLeak",
  "unhandledNode",
  "substNest",
  "allowlistedParts",
  "topLevelOk",
  "substBody",
];

const ISSUE_CUE_RE =
  /94350|unhandled node type|command substitution|\$\(|nested.?pipe|nested.?semicolon|subst-nest|2\.1\.126/i;

/**
 * Educational subst-body walk. Not a Claude Code patch.
 * Encodes only the published #94350 repro shapes.
 * recurseSubst=true is the HOLD / unpacked path.
 */
export function extractSubstBody(command = "") {
  const text = String(command || "");
  const match = text.match(/\$\((.*)\)/s);
  return match ? match[1] : "";
}

export function hasNestedPipe(command = "") {
  return /\|/.test(extractSubstBody(command));
}

export function hasNestedSemicolon(command = "") {
  return /;/.test(extractSubstBody(command));
}

export function isTopLevelCompound(command = "") {
  const text = String(command || "");
  return !/\$\(/.test(text) && (/\|/.test(text) || /;/.test(text));
}

export function walkPermission(command = "", { unpacked = false } = {}) {
  const body = extractSubstBody(command);
  const nestedPipe = /\|/.test(body);
  const nestedSemicolon = /;/.test(body);
  const topLevelOk = isTopLevelCompound(command);
  const simpleOrRedirect = Boolean(body) && !nestedPipe && !nestedSemicolon;
  if (unpacked || simpleOrRedirect || (topLevelOk && !body)) {
    return {
      command,
      body,
      prompts: false,
      errorLeak: null,
      nestedPipe,
      nestedSemicolon,
      unpacked: true,
      matryoshka: false,
      substNest: false,
      topLevelOk,
      allowlistedParts: true,
    };
  }
  if (nestedPipe || nestedSemicolon) {
    return {
      command,
      body,
      prompts: true,
      errorLeak: nestedSemicolon ? UNHANDLED_SEMI : null,
      nestedPipe,
      nestedSemicolon,
      unpacked: false,
      matryoshka: true,
      substNest: true,
      topLevelOk: true,
      allowlistedParts: true,
    };
  }
  return {
    command,
    body,
    prompts: false,
    errorLeak: null,
    nestedPipe: false,
    nestedSemicolon: false,
    unpacked: true,
    matryoshka: false,
    substNest: false,
    topLevelOk,
    allowlistedParts: true,
  };
}

export function scoreRepro(pass = {}) {
  const command = pass.command || "";
  const walked = walkPermission(command, { unpacked: pass.unpacked === true });
  return {
    ...walked,
    id: pass.id || null,
    publishedPrompts: pass.prompts === true,
    publishedLeak: pass.errorLeak === true || Boolean(pass.leak),
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94350") return true;
  if (input.errorText === UNHANDLED_SEMI || input.leak === UNHANDLED_SEMI) return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

/**
 * Doll map: unpacked nest vs matryoshka (outer doll will not open inner joints).
 */
export function mapDoll(input = {}) {
  const matryoshka = isMatryoshkaInput(input);
  const unpacked = input.unpacked === true && !matryoshka;
  return {
    stamp: matryoshka ? "subst-nest" : "unpacked-doll",
    holdingLane: matryoshka ? "unhandled-node" : "descended",
    kindLane: matryoshka ? "subst-nest" : "nested-ok",
    bindLane: matryoshka ? "error-leak" : "walked-in",
    ribbon: matryoshka ? "matryoshka" : "unpacked",
    unpacked,
  };
}

export function inspectOuter(input = {}) {
  const shut =
    input.matryoshka === true ||
    input.substNest === true ||
    isMatryoshkaInput(input);
  if (input.unpacked === true && !shut) {
    return { stamp: "outer-unpacked", shut: false, note: "outer doll — walker recurses into the $(...) body" };
  }
  return {
    stamp: shut ? "outer-shut" : "outer-idle",
    shut,
    note: shut
      ? "outer doll — walker opens $(...) but does not recurse into nested joints"
      : "",
  };
}

export function inspectPipe(input = {}) {
  const nested =
    input.nestedPipe === true ||
    input.matryoshka === true ||
    isMatryoshkaInput(input);
  if (input.unpacked === true && !nested) {
    return { stamp: "pipe-walked", nested: false };
  }
  return {
    stamp: nested ? "inner-joint-pipe" : "pipe-idle",
    nested,
    note: nested
      ? "inner pipe joint — | / pipeline nested inside $(...) forces a prompt"
      : "",
  };
}

export function inspectSemi(input = {}) {
  const nested =
    input.nestedSemicolon === true ||
    input.matryoshka === true ||
    isMatryoshkaInput(input);
  if (input.unpacked === true && !nested) {
    return { stamp: "semi-walked", nested: false };
  }
  return {
    stamp: nested ? "inner-joint-semi" : "semi-idle",
    nested,
    note: nested
      ? "inner semicolon joint — ; / list nested inside $(...) forces a prompt"
      : "",
  };
}

export function inspectLeak(input = {}) {
  const leaked =
    input.errorLeak === true ||
    input.unhandledNode === true ||
    input.matryoshka === true ||
    isMatryoshkaInput(input);
  if (input.unpacked === true && !leaked) {
    return { stamp: "leak-quiet", leaked: false };
  }
  return {
    stamp: leaked ? "error-leak" : "leak-idle",
    leaked,
    note: leaked
      ? "error leak — Unhandled node type: ; appears in the permission prompt"
      : "",
  };
}

export function inspectParts(input = {}) {
  const listed =
    input.allowlistedParts === true ||
    input.matryoshka === true ||
    isMatryoshkaInput(input);
  if (input.unpacked === true && !listed) {
    return { stamp: "parts-idle", listed: false };
  }
  return {
    stamp: listed ? "allowlisted-parts" : "parts-idle",
    listed,
    note: listed
      ? "allow-listed parts — cat, wc, echo, pwd each auto-allowed alone"
      : "",
  };
}

export function inspectPath(input = {}) {
  const nested =
    input.substNest === true ||
    input.matryoshka === true ||
    isMatryoshkaInput(input);
  if (input.unpacked === true && !nested) {
    return { stamp: "path-unpacked", nested: false };
  }
  return {
    stamp: nested ? "path-nest" : "path-idle",
    nested,
    note: nested
      ? "subst-nest — control-operator node inside the $(...) subtree is the failure"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "outer-doll": input.substNest || input.nestedPipe || input.nestedSemicolon,
    "inner-joint-pipe": input.nestedPipe,
    "inner-joint-semi": input.nestedSemicolon,
    "error-leak": input.errorLeak || input.unhandledNode,
    "allowlisted-parts": input.allowlistedParts,
    "subst-nest": input.substNest,
  };
  return (
    map[id] === true ||
    input.substNest === true ||
    input.matryoshka === true
  );
}

function isMatryoshkaInput(input = {}) {
  return (
    input.matryoshka === true ||
    input.substNest === true ||
    input.nestedPipe === true ||
    input.nestedSemicolon === true ||
    input.errorLeak === true ||
    input.unhandledNode === true ||
    input.allowlistedParts === true ||
    input.topLevelOk === true ||
    input.substBody === true
  );
}

export function readBooth(input = {}) {
  const matryoshka = isMatryoshkaInput(input);
  const unpacked = input.unpacked === true && !matryoshka;
  return {
    mark: matryoshka ? "matryoshka" : "unpacked",
    unpacked,
    matryoshka,
    substNest: input.substNest === true || matryoshka,
    nestedPipe: input.nestedPipe === true,
    nestedSemicolon: input.nestedSemicolon === true,
    errorLeak: input.errorLeak === true,
    unhandledNode: input.unhandledNode === true,
    allowlistedParts: input.allowlistedParts === true,
    topLevelOk: input.topLevelOk === true,
    substBody: input.substBody === true,
    scope: mapDoll(input),
    outer: inspectOuter(input),
    pipe: inspectPipe(input),
    semi: inspectSemi(input),
    leak: inspectLeak(input),
    parts: inspectParts(input),
    path: inspectPath(input),
    names: DOLL_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const MATRYOSHKA_WALK = Object.freeze([
  {
    t: "idle",
    event: "doll-unpacked",
    unpacked: true,
    matryoshka: false,
    cue: "unpacked",
    note: "idle HOLD: walker recurses into $(...) and treats nested list/pipeline like top-level — no prompt, no raw error leak",
  },
  {
    t: "pipe",
    event: "nested-pipe",
    matryoshka: true,
    nestedPipe: true,
    cue: "matryoshka",
    note: 'echo "x: $(cat file.txt | wc -l)" → PROMPTS',
  },
  {
    t: "semi",
    event: "nested-semicolon",
    matryoshka: true,
    nestedSemicolon: true,
    errorLeak: true,
    unhandledNode: true,
    cue: "matryoshka",
    note: 'echo "x: $(echo a; echo b)" → PROMPTS + Unhandled node type: ;',
  },
  {
    t: "path",
    event: "subst-nest",
    matryoshka: true,
    substNest: true,
    nestedPipe: true,
    nestedSemicolon: true,
    errorLeak: true,
    cue: "matryoshka",
    note: "subst-nest — control-operator inside $(...); top-level ; and | stay handled",
  },
  {
    t: "score",
    event: "matryoshka",
    matryoshka: true,
    substNest: true,
    nestedPipe: true,
    nestedSemicolon: true,
    errorLeak: true,
    unhandledNode: true,
    allowlistedParts: true,
    topLevelOk: true,
    cue: "matryoshka",
    note: "matryoshka — the outer doll will not unpack the inner joints",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "doll-unpacked",
    unpacked: true,
    matryoshka: false,
    cue: "unpacked",
    note: "positive control: walker recurses into $(...) like top-level list/pipeline",
  },
  {
    t: "admit",
    event: "doll-unpacked",
    unpacked: true,
    cue: "unpacked",
    note: "positive control: the workshop admits unpacked",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    unpacked: true,
    matryoshka: false,
    substNest: false,
    cue: "unpacked",
  };
}

export function seedUnpacked() {
  return { ...emptyTicket() };
}

export function seedMatryoshka() {
  return {
    seed: SEEDED_WORD,
    unpacked: false,
    matryoshka: true,
    substNest: true,
    nestedPipe: true,
    nestedSemicolon: true,
    errorLeak: true,
    unhandledNode: true,
    allowlistedParts: true,
    topLevelOk: true,
    cue: "matryoshka",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_MATRYOSHKA_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    matryoshka: true,
    substNest: true,
    cue: "matryoshka",
  };
}

export function seedSubstNest() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    matryoshka: true,
    substNest: true,
    event: "subst-nest",
    cue: "matryoshka",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    unpacked: true,
    cue: "unpacked",
  };
}

export function seedDescended() {
  return { seed: "descended", preferSeed: true, unpacked: true, cue: "unpacked" };
}

export function seedRecursed() {
  return { seed: "recursed", preferSeed: true, unpacked: true, cue: "unpacked" };
}

export function seedOpened() {
  return { seed: "opened", preferSeed: true, unpacked: true, cue: "unpacked" };
}

export function seedNestedOk() {
  return { seed: "nested-ok", preferSeed: true, unpacked: true, cue: "unpacked" };
}

export function seedWalkedIn() {
  return { seed: "walked-in", preferSeed: true, unpacked: true, cue: "unpacked" };
}

export function seedUnhandledNode() {
  return {
    seed: "unhandled-node",
    preferSeed: true,
    unhandledNode: true,
    cue: "matryoshka",
  };
}

export function seedErrorLeak() {
  return {
    seed: "error-leak",
    preferSeed: true,
    errorLeak: true,
    cue: "matryoshka",
  };
}

export function seedNestedPipe() {
  return {
    seed: "nested-pipe",
    preferSeed: true,
    nestedPipe: true,
    cue: "matryoshka",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      unpacked: false,
      matryoshka: false,
      substNest: false,
      nestedPipe: false,
      nestedSemicolon: false,
      errorLeak: false,
      unhandledNode: false,
      allowlistedParts: false,
      topLevelOk: false,
      substBody: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    unpacked: raw.unpacked === true,
    matryoshka: raw.matryoshka === true || raw.event === "matryoshka",
    substNest: raw.substNest === true || raw.event === "subst-nest",
    nestedPipe: raw.nestedPipe === true || raw.event === "nested-pipe",
    nestedSemicolon:
      raw.nestedSemicolon === true || raw.event === "nested-semicolon",
    errorLeak: raw.errorLeak === true || raw.event === "error-leak",
    unhandledNode:
      raw.unhandledNode === true || raw.event === "unhandled-node",
    allowlistedParts:
      raw.allowlistedParts === true || raw.event === "allowlisted-parts",
    topLevelOk: raw.topLevelOk === true || raw.event === "top-level-ok",
    substBody: raw.substBody === true || raw.event === "subst-body",
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
      (ticket.unpacked != null ||
        ticket.matryoshka != null ||
        ticket.substNest != null ||
        ticket.nestedPipe != null ||
        ticket.nestedSemicolon != null ||
        ticket.errorLeak != null ||
        ticket.unhandledNode != null ||
        ticket.allowlistedParts != null ||
        ticket.topLevelOk != null ||
        ticket.substBody != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isUnpacked(row) {
  if (row.matryoshka && row.cue !== "unpacked") return false;
  if (row.cue === "matryoshka" || row.cue === "subst-nest") return false;
  if (
    row.substNest &&
    (row.nestedPipe || row.nestedSemicolon) &&
    row.cue !== "unpacked" &&
    row.unpacked !== true
  ) {
    return false;
  }
  if (
    row.unpacked === true &&
    row.matryoshka !== true &&
    row.cue !== "matryoshka"
  ) {
    return true;
  }
  if (
    row.cue === "unpacked" &&
    row.matryoshka !== true &&
    row.substNest !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isSubstNest(row) {
  return (
    row.event === "subst-nest" &&
    !isUnpacked(row) &&
    (row.substNest === true ||
      row.nestedPipe === true ||
      row.nestedSemicolon === true ||
      row.matryoshka === true)
  );
}

function isMatryoshkaRow(row) {
  if (isUnpacked(row)) return false;
  if (isSubstNest(row) && row.cue !== "matryoshka") return false;
  if (row.cue === "matryoshka") return true;
  if (row.matryoshka === true) return true;
  if (row.substNest === true && (row.nestedPipe === true || row.nestedSemicolon === true)) {
    return true;
  }
  if (
    row.substNest === true ||
    row.nestedPipe === true ||
    row.nestedSemicolon === true ||
    row.errorLeak === true ||
    row.unhandledNode === true ||
    row.allowlistedParts === true ||
    row.topLevelOk === true ||
    row.substBody === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one matryoshka pass against the nesting-doll workshop.
 * unpacked: walker recurses into $(...) like top-level list/pipeline.
 * matryoshka: nested ; / | inside $(...) prompt (semicolon leaks).
 * subst-nest: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSubstNest(row) ||
    (row.substNest && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "subst-nest";
  } else if (isMatryoshkaRow(row)) {
    verdict = "matryoshka";
  } else if (isUnpacked(row)) {
    verdict = "unpacked";
  } else if (
    row.substNest ||
    row.nestedPipe ||
    row.nestedSemicolon ||
    row.errorLeak ||
    row.unhandledNode ||
    row.allowlistedParts ||
    row.topLevelOk ||
    row.substBody
  ) {
    verdict = "matryoshka";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "matryoshka";
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
    unpacked: verdict === "unpacked" || verdict === "hold",
    matryoshka: verdict === "matryoshka" || verdict === SEEDED_WORD,
    substNest:
      row.substNest === true ||
      verdict === "subst-nest" ||
      verdict === PATH_WORD,
    nestedPipe: row.nestedPipe,
    nestedSemicolon: row.nestedSemicolon,
    errorLeak: row.errorLeak,
    unhandledNode: row.unhandledNode,
    allowlistedParts: row.allowlistedParts,
    topLevelOk: row.topLevelOk,
    substBody: row.substBody,
    cue: hold
      ? "unpacked"
      : row.substNest || verdict === "subst-nest"
        ? "subst-nest"
        : "matryoshka",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit unpacked" : "score matryoshka",
    outerInspect: inspectOuter(row),
    pipeInspect: inspectPipe(row),
    semiInspect: inspectSemi(row),
    leakInspect: inspectLeak(row),
    partsInspect: inspectParts(row),
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
      : MATRYOSHKA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "matryoshka");
  const path = scored.filter((row) => row.verdict === "subst-nest");
  const unpacked = scored.filter((row) => row.verdict === "unpacked");
  const headline =
    scored.find((row) => row.event === "matryoshka") ||
    scored.find((row) => row.event === "subst-nest") ||
    scored.find((row) => row.event === "nested-pipe") ||
    charged[charged.length - 1];
  let verdict = "unpacked";
  if (charged.length) verdict = "matryoshka";
  else if (path.length && !unpacked.length) {
    verdict = "subst-nest";
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
    matryoshkaCount: charged.length,
    pathCount: path.length,
    unpackedCount: unpacked.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit unpacked" : "score matryoshka",
    note: headline
      ? "Bash permission walker prompts on pipes/semicolons nested inside $(...) even when every component is allow-listed; semicolon case leaks Unhandled node type: ;. Cousins cite-only: #55170 #47752 #56019 #47701 #47706 #46868 — do not rebuild, do not conflate."
      : "published matryoshka walk scored against unpacked vs matryoshka",
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
    seeded !== "unpacked" &&
    seeded !== "matryoshka" &&
    seeded !== "subst-nest" &&
    ticket.unpacked == null &&
    ticket.matryoshka == null &&
    ticket.substNest == null &&
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
    unpacked: scored.unpacked ?? false,
    matryoshka: scored.matryoshka ?? false,
    substNest: scored.substNest ?? false,
    nestedPipe: scored.nestedPipe ?? false,
    nestedSemicolon: scored.nestedSemicolon ?? false,
    errorLeak: scored.errorLeak ?? false,
    unhandledNode: scored.unhandledNode ?? false,
    allowlistedParts: scored.allowlistedParts ?? false,
    topLevelOk: scored.topLevelOk ?? false,
    substBody: scored.substBody ?? false,
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
    result.nestedPipe || result.matryoshka
      ? "kind=subst-nest"
      : "kind=nested-ok",
    result.errorLeak || result.matryoshka
      ? "ref=unhandled-node"
      : "ref=descended",
    result.substNest || result.verdict === "subst-nest"
      ? "path=subst-nest"
      : "path=unpacked",
    result.cue === "unpacked"
      ? "cue=unpacked"
      : result.cue === "subst-nest"
        ? "cue=subst-nest"
        : "cue=matryoshka",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    unpacked: result.unpacked,
    matryoshka: result.matryoshka,
    substNest: result.substNest,
    nestedPipe: result.nestedPipe,
    nestedSemicolon: result.nestedSemicolon,
    errorLeak: result.errorLeak,
    unhandledNode: result.unhandledNode,
    allowlistedParts: result.allowlistedParts,
    topLevelOk: result.topLevelOk,
    substBody: result.substBody,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    outer: inspectOuter({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
    }),
    pipe: inspectPipe({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
      nestedPipe: result.nestedPipe,
    }),
    semi: inspectSemi({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
      nestedSemicolon: result.nestedSemicolon,
    }),
    leak: inspectLeak({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
      errorLeak: result.errorLeak,
    }),
    parts: inspectParts({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
      allowlistedParts: result.allowlistedParts,
    }),
    path: inspectPath({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
      substNest: result.substNest,
    }),
    scope: mapDoll({
      unpacked: result.unpacked,
      matryoshka: result.matryoshka,
      substNest: result.substNest,
      nestedPipe: result.nestedPipe,
      nestedSemicolon: result.nestedSemicolon,
      errorLeak: result.errorLeak,
      unhandledNode: result.unhandledNode,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      matryoshka: result.matryoshka === true || result.verdict === "matryoshka",
    })),
    repros: PUBLISHED_REPROS.map((row) => ({ ...row, ...scoreRepro(row) })),
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
      names: DOLL_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      repros: PUBLISHED_REPROS,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the AST permission walker does not recurse into command-substitution bodies for list/pipeline nodes, so nested ;/| hit the unhandled-node fallback (prompt + error leak) even when every leaf command is allow-listed and top-level compounds are fine. Invite verify against #94350 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
