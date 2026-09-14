#!/usr/bin/env node
/**
 * Diabolica — inquisitorial / devil's-proof / parchment court /
 * iron balance-scale / sealed writ / candlelit chamber of
 * negative proof.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Worktree-isolated sessions still refuse Bash commands that never
 * run git (2.1.270). After 2.1.257/2.1.259 (loops now pass; quoted
 * argv substring "git" often allowed), the worktree-isolation Bash
 * verifier STILL refuses commands that contain no git operation.
 * On one machine: 181 refusals one night / 120 the next — largest
 * blocked-command class. The residual inverted burden of proof is
 * "cannot be shown not to be git" / "too complex to verify" for
 * shapes that never invoke git.
 *
 *   node diabolica.mjs data/diabolica.json
 *   echo '{"seed":"diabolica"}' | node diabolica.mjs
 *
 * Idle word is innocent (HOLD: quashed / discharged / unindicted /
 * writ-idle).
 * Seeded word is diabolica (#94040 — the cannot-show-not-git path).
 * Path word is cannot-show-not-git.
 * Product score word is diabolica (Score diabolica or admit innocent.).
 *
 * Encoded from anthropics/claude-code#94040 issue text only.
 * Hypothesis (NON-BINDING): the worktree Bash gate demands each
 * line prove it is NOT git / NOT escaping the worktree; when the
 * checker cannot finish that negative proof it refuses — even for
 * $PWD reads, quoted heredoc data, and wrapper arguments that never
 * become git. Invite verify against #94040 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 *
 * NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre/#94055.
 * NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045.
 * NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008.
 * NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Scotoma.
 * NOT Mondegreen/#93193 (substring "git" false-positive).
 * NOT Postern / Portcullis / Wicket / Embrasure.
 * Cousins cite-only: #90293, #90307, #93193.
 * Diabolica is specifically: residual inverted burden of proof —
 * "cannot be shown not to be git" for shapes that never invoke git.
 * Mondegreen misheard a word; Diabolica refuses the innocent for
 * lack of a completed negative proof.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "innocent",
  "diabolica",
  "cannot-show-not-git",
  "hold",
  "quashed",
  "discharged",
  "unindicted",
  "writ-idle",
  "pwd-unresolved",
  "option-may-stand",
  "heredoc-to-helper",
  "pipeline-too-complex",
  "wrapper-find-word",
  "computed-program-name",
  "six-refusals",
  "one-eighty-one",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "innocent";
export const PATH_WORD = "cannot-show-not-git";
export const SEEDED_WORD = "diabolica";
export const PRODUCT_WORD = "diabolica";
export const HOLD = Object.freeze(["innocent", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "innocent",
  "quashed",
  "discharged",
  "unindicted",
  "writ-idle",
]);
export const RECOVER = Object.freeze(["innocent", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "sealed",
  "silenced",
  "living",
  "cleared",
  "waved",
  "passable",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "tempered",
  "quiescent",
  "tokenized",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "scotoma",
  "mondegreen",
  "postern",
  "portcullis",
  "wicket",
  "embrasure",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "quota-spawn-cascade",
  "layer-tree-walk",
  "substring-scan",
  "legitimate-prose",
  "acknowledged",
  "stood-down",
  "met",
  "once",
  "unsealed",
  "breathing",
  "open-vault",
  "intact",
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
  "diplomatic",
  "redacted",
  "guarded",
  "hush",
  "gate-checked",
  "parablepsis",
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
  "fibula",
  "cockade",
  "hasp",
  "snib",
  "bulla",
  "livery",
  "diplopia",
  "fulcrum",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "diabolica"),
);

export const FEATURED_ISSUE = 94040;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94040";
export const TITLE =
  "Worktree-isolated sessions still refuse Bash commands that never run git (2.1.270)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
  "area:sandbox",
]);
export const PLATFORM = "macos";
export const SURFACE = "cannot-show-not-git";
export const HOST =
  "Claude Code worktree-isolation Bash verifier (2.1.270)";
export const CHECKED_ON =
  "Claude Code 2.1.270; macOS Darwin 24.6.0 (BSD userland); zsh; linked worktree";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL = "unspecified (issue does not pin a model)";
export const OS = "macos";
export const PHRASE = "Score diabolica or admit innocent.";
export const DISTRIBUTION =
  "When a Claude Code session runs inside a git worktree, Claude Code checks each Bash command and refuses any command it cannot prove stays inside that worktree. On 2.1.270 the check still refuses commands that contain no git operation. The 2.1.257 and 2.1.259 changelogs describe fixes for this class of refusal. Loops now pass; quoted argv substring \"git\" often allowed (printf '%s\\n' 'never run git branch -D' is allowed). Six other shapes are still refused, and each one has a control that shows the refused command is harmless. On one machine the refusal fired 181 times in one night across four sessions on 2.1.269, and 120 more times the next night across seven sessions — the largest class of blocked commands both nights. Refused shapes: (1) unrecognized helper --raw \"$PWD\" as too complex; spelled-out path / ls -d \"$PWD\" allowed. (2) sed -n 1p \"$PWD/CLAUDE.md\" refused (option-may-stand); spelled-out path allowed; suggested sed ... -- breaks BSD sed on macOS. (3) Heredoc mentioning git fed to unrecognized helper refused; same heredoc to cat, or no-git heredoc to helper, or printf quoted arg allowed. (4) strings \"$(command -v claude)\" | grep -c isolated refused as too complex; read-only pipeline. (5) /usr/bin/time -p python3 -c 'print(1)' find --name foo refused because word find appears; without time, or without find word, allowed. (6) /usr/bin/time -p echo --grep 'a.*b' refused as computed program name; without time allowed — single-quoted regex is literal. Expected: a command that cannot run git should run. Narrower rules: resolve $PWD with no preceding cd; treat double-quoted $PWD… as non-option; parse time/wrappers like the shell; only inspect heredoc text when receiver can execute it.";

export const RULED_OUT = Object.freeze([
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre/#94055 bash-nul-poison — Bash NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed",
  "Titulus/#94025 resume-stale-title — iOS rename vs desktop sidebar title",
  "Derelict/#93996 session-kill-orphan — Bash-tool subprocesses survive stop",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Scotoma — /goal lived only in command-args; different defect",
  "Mondegreen/#93193 substring-scan — lyric mishearing of substring git; cite-only cousin, not this booth",
  "Postern — night bailey / postern-gate; slug already used",
  "Portcullis / Wicket / Embrasure — different fortress-gate paradigms",
]);
export const EXPECTED = Object.freeze([
  "A command that cannot run git should run",
  "Resolve $PWD in a plain command with no preceding cd — it is the session working directory",
  "Treat a double-quoted word that starts with $PWD as a non-option — an absolute path cannot begin with -",
  "Parse wrappers such as time the way the shell does — first non-option word is the program; later words are arguments",
  "A single-quoted word is literal text, never a computed program name",
  "Only inspect heredoc text when the receiving program can execute it (sh, bash, zsh, python3, xargs), or list programs known not to run git",
  "Do not offer put -- before it for sed on macOS, where BSD sed treats -- as a filename after the script 1p",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "pwd-unresolved",
    label: "PWD unresolved",
    count: 'helper --raw "$PWD"',
    note: "Unrecognized helper with $PWD refused as too complex; spelled-out path / ls -d \"$PWD\" / wc -l \"$PWD/CLAUDE.md\" allowed",
  },
  {
    id: "option-may-stand",
    label: "option may stand",
    count: 'sed -n 1p "$PWD/CLAUDE.md"',
    note: "Double-quoted $PWD path treated as an option that may begin with -; spelled-out path allowed; sed … -- breaks BSD sed on macOS",
  },
  {
    id: "heredoc-to-helper",
    label: "heredoc to helper",
    count: "git words in quoted heredoc",
    note: "Heredoc mentioning git fed to unrecognized helper refused; same heredoc to cat, no-git heredoc to helper, or printf quoted arg allowed",
  },
  {
    id: "pipeline-too-complex",
    label: "pipeline too complex",
    count: "strings | grep -c",
    note: 'strings "$(command -v claude)" | grep -c isolated refused as too complex; strings and grep only read; substituted value is a file argument',
  },
  {
    id: "wrapper-find-word",
    label: "wrapper find word",
    count: "time … find --name",
    note: "/usr/bin/time -p python3 -c 'print(1)' find --name foo refused because word find appears; without time, or without find word, allowed",
  },
  {
    id: "computed-program-name",
    label: "computed program name",
    count: "time echo --grep 'a.*b'",
    note: "/usr/bin/time -p echo --grep 'a.*b' refused as computed program name; without time allowed — single-quoted regex is literal",
  },
]);

export const REFUSAL_SHAPES = Object.freeze([
  {
    id: "pwd-unresolved",
    refused: 'helper --raw "$PWD"',
    controls: [
      "helper --raw /abs/worktree",
      'ls -d "$PWD"',
      'wc -l "$PWD/CLAUDE.md"',
    ],
    story: "too complex to verify / cannot be shown not to be git",
  },
  {
    id: "option-may-stand",
    refused: 'sed -n 1p "$PWD/CLAUDE.md"',
    controls: ['sed -n 1p /abs/worktree/CLAUDE.md'],
    story: "option may stand; suggested -- breaks BSD sed on macOS",
  },
  {
    id: "heredoc-to-helper",
    refused:
      "helper --raw <<'EOF'\\na reminder that we must never run git branch -D on a shared branch\\nEOF",
    controls: [
      "same heredoc fed to cat",
      "no-git heredoc to helper",
      "printf quoted argument",
    ],
    story: "heredoc text naming git fed to unrecognized helper",
  },
  {
    id: "pipeline-too-complex",
    refused: 'strings "$(command -v claude)" | grep -c isolated',
    controls: ["strings and grep only read; substitution is a file argument"],
    story: "command substitution inside a read-only pipeline",
  },
  {
    id: "wrapper-find-word",
    refused: "/usr/bin/time -p python3 -c 'print(1)' find --name foo",
    controls: [
      "same command without /usr/bin/time",
      "same command with time but without the word find",
    ],
    story: "wrapper misparsed; find is an argument to python3",
  },
  {
    id: "computed-program-name",
    refused: "/usr/bin/time -p echo --grep 'a.*b'",
    controls: [
      "echo --grep 'a.*b' without time",
      "/usr/bin/time -p echo hello",
    ],
    story: "single-quoted regex treated as a computed program name",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "innocent-writ",
    survey:
      "chamber stays candlelit; writ stays sealed; scale balances toward innocent; six charges stay wax-shut",
    kind: "innocent",
    note: "idle: innocent — the hold/good path",
  },
  {
    id: "six-refusals",
    survey:
      "six refused shapes unseal; each has an allowed control that never runs git",
    kind: "diabolica",
    note: "seeded: the six charges",
  },
  {
    id: "cannot-show-not-git",
    survey:
      "the court demands a completed negative proof; when the checker cannot finish, it refuses",
    kind: "diabolica",
    note: "path: cannot-show-not-git names the inverted burden",
  },
  {
    id: "one-eighty-one",
    survey:
      "181 refusals one night / 120 the next — largest blocked-command class",
    kind: "diabolica",
    note: "seeded: published volume",
  },
  {
    id: "diabolica",
    survey:
      "the booth is diabolica — probatio diabolica: prove you are not git, or be refused",
    kind: "diabolica",
    note: "seeded: diabolica — Score diabolica or admit innocent.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "cannot-show-not-git",
  "diabolica",
  "pwd-unresolved",
  "option-may-stand",
  "heredoc-to-helper",
  "pipeline-too-complex",
  "wrapper-find-word",
  "computed-program-name",
  "six-refusals",
  "one-eighty-one",
]);

export const COUSINS = Object.freeze([
  {
    issue: 90293,
    title:
      'Worktree-isolated sessions: benign read-only command shapes refused as "too complex to verify"; suggested remediation cannot apply to loops',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — earlier 2.1.243 too-complex refusals including loops. Loops now pass after 2.1.259. Do not rebuild. Different vintage, same family.",
  },
  {
    issue: 90307,
    title:
      "Worktree-isolated background sessions: command shape verifier refuses safe read-only commands at scale",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — 2.1.243 verifier refuses safe read-only commands at scale. Adjacent family, not the six residual 2.1.270 shapes.",
  },
  {
    issue: 93193,
    title:
      'Bash sandbox for isolation:worktree dispatched agents false-blocks on the substring "git" anywhere in the command',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Mondegreen. Lyric mishearing of substring git. On 2.1.270 quoted argv often allowed. Diabolica is the residual inverted burden, not the substring ear.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94032, title: "backup #94032 summarizedThinking forced", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
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
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "scotoma",
  "mondegreen",
  "postern",
  "portcullis",
  "wicket",
  "embrasure",
  "parablepsis",
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
]);

export const SAMPLE_KIND_IDLE = "writ-idle";
export const SAMPLE_KIND_SEEDED = "cannot-show-not-git";
export const SAMPLE_HOLDING_IDLE = "quashed";
export const SAMPLE_HOLDING_SEEDED = "indicted";

export const SAMPLE_INNOCENT_PROOF = Object.freeze({
  innocent: true,
  diabolica: false,
  cannotShowNotGit: false,
  pwdUnresolved: false,
  optionMayStand: false,
  heredocToHelper: false,
  pipelineTooComplex: false,
  wrapperFindWord: false,
  computedProgramName: false,
  sixRefusals: false,
  oneEightyOne: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DIABOLICA_PROOF = Object.freeze({
  innocent: false,
  diabolica: true,
  cannotShowNotGit: true,
  pwdUnresolved: true,
  optionMayStand: true,
  heredocToHelper: true,
  pipelineTooComplex: true,
  wrapperFindWord: true,
  computedProgramName: true,
  sixRefusals: true,
  oneEightyOne: true,
  kind: SAMPLE_KIND_SEEDED,
  shapes: REFUSAL_SHAPES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds innocent: writ sealed; scale balances; six charges wax-shut" },
  { t: "pwd", line: "helper --raw \"$PWD\" refused as too complex; ls -d \"$PWD\" allowed" },
  { t: "sed", line: "sed -n 1p \"$PWD/CLAUDE.md\" refused (option-may-stand); -- breaks BSD sed" },
  { t: "path", line: "cannot-show-not-git — the court cannot finish the negative proof so it refuses" },
  { t: "score", line: "when the writ demands a devil's proof the booth is diabolica — Score diabolica or admit innocent." },
]);

const REFUSAL_FLAGS = [
  "cannotShowNotGit",
  "pwdUnresolved",
  "optionMayStand",
  "heredocToHelper",
  "pipelineTooComplex",
  "wrapperFindWord",
  "computedProgramName",
  "sixRefusals",
  "oneEightyOne",
];

/**
 * Court map: innocent sealed writ vs open diabolica indictment.
 * Idle/innocent: writ sealed; scale balances; charges wax-shut.
 * Seeded/diabolica: writ unseals; scale tips toward cannot-show-not-git.
 */
export function mapCourt(input = {}) {
  const diabolica = isDiabolicaInput(input);
  const innocent = input.innocent === true && !diabolica;
  return {
    stamp: diabolica ? "cannot-show-not-git" : "innocent-writ",
    holdingLane: diabolica ? "indicted" : "quashed",
    kindLane: diabolica ? "cannot-show-not-git" : "writ-idle",
    bindLane: diabolica ? "six-refusals" : "discharged",
    ribbon: diabolica ? "diabolica" : "innocent",
    innocent,
  };
}

export function inspectWrit(input = {}) {
  const unsealed = isDiabolicaInput(input);
  if (input.innocent === true && !unsealed) {
    return {
      stamp: "writ-sealed",
      unsealed: false,
      note: "the sealed writ stays shut — no indictment while the court admits innocent",
    };
  }
  return {
    stamp: unsealed ? "writ-unsealed" : "writ-idle",
    unsealed,
    note: unsealed
      ? "the sealed writ cracks — six charges of cannot-show-not-git"
      : "",
  };
}

export function inspectScale(input = {}) {
  const tipped = isDiabolicaInput(input);
  if (input.innocent === true && !tipped) {
    return {
      stamp: "scale-innocent",
      tipped: false,
      pan: "innocent",
    };
  }
  return {
    stamp: tipped ? "scale-diabolica" : "scale-idle",
    tipped,
    pan: tipped ? "cannot-show-not-git" : "balanced",
    note: tipped
      ? "iron scale tips toward cannot-show-not-git — the negative proof is unfinished"
      : "",
  };
}

export function inspectChamber(input = {}) {
  const candlelit = true;
  const charged = isDiabolicaInput(input);
  if (input.innocent === true && !charged) {
    return {
      stamp: "chamber-idle",
      charged: false,
      candlelit,
    };
  }
  return {
    stamp: charged ? "chamber-charged" : "chamber-idle",
    charged,
    candlelit,
    note: charged
      ? "candlelit chamber of negative proof — 181 / 120 refusals, none of them git"
      : "",
  };
}

export function inspectCharges(input = {}) {
  const open =
    input.sixRefusals === true ||
    input.diabolica === true ||
    countOpenCharges(input) >= 1;
  const ids = REFUSAL_SHAPES.filter((row) => chargeOpen(input, row.id)).map(
    (row) => row.id,
  );
  if (input.innocent === true && !open) {
    return {
      stamp: "charges-wax-shut",
      open: false,
      ids: [],
    };
  }
  return {
    stamp: open ? "charges-unsealed" : "charges-idle",
    open,
    ids: open && !ids.length ? REFUSAL_SHAPES.map((row) => row.id) : ids,
    note: open
      ? "six refused shapes vs allowed controls — none invoke git"
      : "",
  };
}

export function inspectProof(input = {}) {
  const unfinished =
    input.cannotShowNotGit === true ||
    input.diabolica === true ||
    isDiabolicaInput(input);
  if (input.innocent === true && !unfinished) {
    return {
      stamp: "proof-complete",
      unfinished: false,
    };
  }
  return {
    stamp: unfinished ? "proof-unfinished" : "proof-idle",
    unfinished,
    note: unfinished
      ? "probatio diabolica: cannot be shown not to be git, so the line is refused"
      : "",
  };
}

function chargeOpen(input, id) {
  const map = {
    "pwd-unresolved": input.pwdUnresolved,
    "option-may-stand": input.optionMayStand,
    "heredoc-to-helper": input.heredocToHelper,
    "pipeline-too-complex": input.pipelineTooComplex,
    "wrapper-find-word": input.wrapperFindWord,
    "computed-program-name": input.computedProgramName,
  };
  return map[id] === true || input.sixRefusals === true || input.diabolica === true;
}

function countOpenCharges(input = {}) {
  return [
    input.pwdUnresolved,
    input.optionMayStand,
    input.heredocToHelper,
    input.pipelineTooComplex,
    input.wrapperFindWord,
    input.computedProgramName,
  ].filter(Boolean).length;
}

function isDiabolicaInput(input = {}) {
  return (
    input.diabolica === true ||
    input.cannotShowNotGit === true ||
    input.pwdUnresolved === true ||
    input.optionMayStand === true ||
    input.heredocToHelper === true ||
    input.pipelineTooComplex === true ||
    input.wrapperFindWord === true ||
    input.computedProgramName === true ||
    input.sixRefusals === true ||
    input.oneEightyOne === true
  );
}

export function readBooth(input = {}) {
  const diabolica = isDiabolicaInput(input);
  const innocent = input.innocent === true && !diabolica;
  return {
    mark: diabolica ? "diabolica" : innocent || !diabolica ? "innocent" : "diabolica",
    innocent,
    diabolica,
    cannotShowNotGit: input.cannotShowNotGit === true || diabolica,
    pwdUnresolved: input.pwdUnresolved === true,
    optionMayStand: input.optionMayStand === true,
    heredocToHelper: input.heredocToHelper === true,
    pipelineTooComplex: input.pipelineTooComplex === true,
    wrapperFindWord: input.wrapperFindWord === true,
    computedProgramName: input.computedProgramName === true,
    sixRefusals: input.sixRefusals === true,
    oneEightyOne: input.oneEightyOne === true,
    scope: mapCourt(input),
    writ: inspectWrit(input),
    scale: inspectScale(input),
    chamber: inspectChamber(input),
    charges: inspectCharges(input),
    proof: inspectProof(input),
    log: input.log || [],
  };
}

export const DIABOLICA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-innocent",
    innocent: true,
    diabolica: false,
    cue: "innocent",
    note: "idle HOLD: writ sealed; scale balances; six charges wax-shut — the hold/good path",
  },
  {
    t: "pwd",
    event: "pwd-unresolved",
    diabolica: true,
    pwdUnresolved: true,
    cue: "diabolica",
    note: 'helper --raw "$PWD" refused as too complex; ls -d "$PWD" allowed',
  },
  {
    t: "sed",
    event: "option-may-stand",
    diabolica: true,
    optionMayStand: true,
    cue: "diabolica",
    note: 'sed -n 1p "$PWD/CLAUDE.md" refused; -- breaks BSD sed on macOS',
  },
  {
    t: "path",
    event: "cannot-show-not-git",
    diabolica: true,
    cannotShowNotGit: true,
    sixRefusals: true,
    cue: "diabolica",
    note: "cannot-show-not-git — the court cannot finish the negative proof so it refuses",
  },
  {
    t: "score",
    event: "diabolica",
    diabolica: true,
    cannotShowNotGit: true,
    pwdUnresolved: true,
    optionMayStand: true,
    heredocToHelper: true,
    pipelineTooComplex: true,
    wrapperFindWord: true,
    computedProgramName: true,
    sixRefusals: true,
    oneEightyOne: true,
    cue: "diabolica",
    note: "diabolica — when the writ demands a devil's proof the booth is diabolica",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-innocent",
    innocent: true,
    diabolica: false,
    cue: "innocent",
    note: "positive control: spelled-out path / cat heredoc / no wrapper — the line is innocent",
  },
  {
    t: "announce",
    event: "cue-innocent",
    innocent: true,
    cue: "innocent",
    note: "positive control: the court admits innocent",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    innocent: true,
    diabolica: false,
    cannotShowNotGit: false,
    cue: "innocent",
  };
}

export function seedInnocent() {
  return { ...emptyTicket() };
}

export function seedDiabolica() {
  return {
    seed: SEEDED_WORD,
    innocent: false,
    diabolica: true,
    cannotShowNotGit: true,
    pwdUnresolved: true,
    optionMayStand: true,
    heredocToHelper: true,
    pipelineTooComplex: true,
    wrapperFindWord: true,
    computedProgramName: true,
    sixRefusals: true,
    oneEightyOne: true,
    cue: "diabolica",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DIABOLICA_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    diabolica: true,
    cannotShowNotGit: true,
    sixRefusals: true,
    cue: "diabolica",
  };
}

export function seedCannotShowNotGit() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    diabolica: true,
    cannotShowNotGit: true,
    event: "cannot-show-not-git",
    cue: "diabolica",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    innocent: true,
    cue: "innocent",
  };
}

export function seedQuashed() {
  return {
    seed: "quashed",
    preferSeed: true,
    innocent: true,
    cue: "innocent",
  };
}

export function seedDischarged() {
  return {
    seed: "discharged",
    preferSeed: true,
    innocent: true,
    cue: "innocent",
  };
}

export function seedUnindicted() {
  return {
    seed: "unindicted",
    preferSeed: true,
    innocent: true,
    cue: "innocent",
  };
}

export function seedWritIdle() {
  return {
    seed: "writ-idle",
    preferSeed: true,
    innocent: true,
    cue: "innocent",
  };
}

export function seedPwdUnresolved() {
  return {
    seed: "pwd-unresolved",
    preferSeed: true,
    pwdUnresolved: true,
    cue: "diabolica",
  };
}

export function seedOptionMayStand() {
  return {
    seed: "option-may-stand",
    preferSeed: true,
    optionMayStand: true,
    cue: "diabolica",
  };
}

export function seedHeredocToHelper() {
  return {
    seed: "heredoc-to-helper",
    preferSeed: true,
    heredocToHelper: true,
    cue: "diabolica",
  };
}

export function seedPipelineTooComplex() {
  return {
    seed: "pipeline-too-complex",
    preferSeed: true,
    pipelineTooComplex: true,
    cue: "diabolica",
  };
}

export function seedWrapperFindWord() {
  return {
    seed: "wrapper-find-word",
    preferSeed: true,
    wrapperFindWord: true,
    cue: "diabolica",
  };
}

export function seedComputedProgramName() {
  return {
    seed: "computed-program-name",
    preferSeed: true,
    computedProgramName: true,
    cue: "diabolica",
  };
}

export function seedSixRefusals() {
  return {
    seed: "six-refusals",
    preferSeed: true,
    sixRefusals: true,
    cue: "diabolica",
  };
}

export function seedOneEightyOne() {
  return {
    seed: "one-eighty-one",
    preferSeed: true,
    oneEightyOne: true,
    cue: "diabolica",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      innocent: false,
      diabolica: false,
      cannotShowNotGit: false,
      pwdUnresolved: false,
      optionMayStand: false,
      heredocToHelper: false,
      pipelineTooComplex: false,
      wrapperFindWord: false,
      computedProgramName: false,
      sixRefusals: false,
      oneEightyOne: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    innocent: raw.innocent === true,
    diabolica: raw.diabolica === true || raw.event === "diabolica",
    cannotShowNotGit:
      raw.cannotShowNotGit === true || raw.event === "cannot-show-not-git",
    pwdUnresolved:
      raw.pwdUnresolved === true || raw.event === "pwd-unresolved",
    optionMayStand:
      raw.optionMayStand === true || raw.event === "option-may-stand",
    heredocToHelper:
      raw.heredocToHelper === true || raw.event === "heredoc-to-helper",
    pipelineTooComplex:
      raw.pipelineTooComplex === true || raw.event === "pipeline-too-complex",
    wrapperFindWord:
      raw.wrapperFindWord === true || raw.event === "wrapper-find-word",
    computedProgramName:
      raw.computedProgramName === true ||
      raw.event === "computed-program-name",
    sixRefusals: raw.sixRefusals === true || raw.event === "six-refusals",
    oneEightyOne: raw.oneEightyOne === true || raw.event === "one-eighty-one",
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
      (ticket.innocent != null ||
        ticket.diabolica != null ||
        ticket.cannotShowNotGit != null ||
        ticket.pwdUnresolved != null ||
        ticket.optionMayStand != null ||
        ticket.heredocToHelper != null ||
        ticket.pipelineTooComplex != null ||
        ticket.wrapperFindWord != null ||
        ticket.computedProgramName != null ||
        ticket.sixRefusals != null ||
        ticket.oneEightyOne != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isInnocent(row) {
  if (row.diabolica && row.cue !== "innocent") return false;
  if (row.cue === "diabolica" || row.cue === "cannot-show-not-git") {
    return false;
  }
  if (
    row.cannotShowNotGit &&
    row.sixRefusals &&
    row.cue !== "innocent" &&
    row.innocent !== true
  ) {
    return false;
  }
  if (row.innocent === true && row.diabolica !== true && row.cue !== "diabolica") {
    return true;
  }
  if (
    row.cue === "innocent" &&
    row.diabolica !== true &&
    row.cannotShowNotGit !== true &&
    REFUSAL_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isCannotShowNotGit(row) {
  return (
    row.event === "cannot-show-not-git" &&
    !isInnocent(row) &&
    (row.cannotShowNotGit === true ||
      row.sixRefusals === true ||
      row.diabolica === true)
  );
}

function isDiabolicaRow(row) {
  if (isInnocent(row)) return false;
  if (isCannotShowNotGit(row) && row.cue !== "diabolica") return false;
  if (row.cue === "diabolica") return true;
  if (row.diabolica === true) return true;
  if (row.cannotShowNotGit === true && row.sixRefusals === true) {
    return true;
  }
  if (
    row.cannotShowNotGit === true ||
    row.pwdUnresolved === true ||
    row.optionMayStand === true ||
    row.heredocToHelper === true ||
    row.pipelineTooComplex === true ||
    row.wrapperFindWord === true ||
    row.computedProgramName === true ||
    row.sixRefusals === true ||
    row.oneEightyOne === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one diabolica pass against the court.
 * innocent: writ sealed; scale balances; charges wax-shut.
 * diabolica: writ unseals; scale tips; six charges of unfinished negative proof.
 * cannot-show-not-git: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCannotShowNotGit(row) ||
    (row.cannotShowNotGit && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "cannot-show-not-git";
  } else if (isDiabolicaRow(row)) {
    verdict = "diabolica";
  } else if (isInnocent(row)) {
    verdict = "innocent";
  } else if (
    row.cannotShowNotGit ||
    row.pwdUnresolved ||
    row.optionMayStand ||
    row.heredocToHelper ||
    row.pipelineTooComplex ||
    row.wrapperFindWord ||
    row.computedProgramName ||
    row.sixRefusals ||
    row.oneEightyOne
  ) {
    verdict = "diabolica";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const writ = inspectWrit(row);
  const scale = inspectScale(row);
  const chamber = inspectChamber(row);
  const charges = inspectCharges(row);
  const proof = inspectProof(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    innocent: verdict === "innocent" || verdict === "hold",
    diabolica: verdict === "diabolica" || verdict === SEEDED_WORD,
    cannotShowNotGit:
      row.cannotShowNotGit === true ||
      verdict === "cannot-show-not-git" ||
      verdict === PATH_WORD,
    pwdUnresolved: row.pwdUnresolved,
    optionMayStand: row.optionMayStand,
    heredocToHelper: row.heredocToHelper,
    pipelineTooComplex: row.pipelineTooComplex,
    wrapperFindWord: row.wrapperFindWord,
    computedProgramName: row.computedProgramName,
    sixRefusals: row.sixRefusals,
    oneEightyOne: row.oneEightyOne,
    cue: hold
      ? "innocent"
      : row.cannotShowNotGit || verdict === "cannot-show-not-git"
        ? "cannot-show-not-git"
        : "diabolica",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit innocent" : "score diabolica",
    writInspect: writ,
    scaleInspect: scale,
    chamberInspect: chamber,
    chargesInspect: charges,
    proofInspect: proof,
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
      : DIABOLICA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "diabolica");
  const path = scored.filter((row) => row.verdict === "cannot-show-not-git");
  const innocent = scored.filter((row) => row.verdict === "innocent");
  const headline =
    scored.find((row) => row.event === "diabolica") ||
    scored.find((row) => row.event === "cannot-show-not-git") ||
    scored.find((row) => row.event === "pwd-unresolved") ||
    charged[charged.length - 1];
  let verdict = "innocent";
  if (charged.length) verdict = "diabolica";
  else if (path.length && !innocent.length) verdict = "cannot-show-not-git";
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
    diabolicaCount: charged.length,
    pathCount: path.length,
    innocentCount: innocent.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit innocent" : "score diabolica",
    note: headline
      ? "Worktree gate refuses lines that never run git when it cannot finish the negative proof. Cousins cite-only: #90293 #90307 #93193."
      : "published diabolica walk scored against innocent vs diabolica",
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
    seeded !== "innocent" &&
    seeded !== "diabolica" &&
    seeded !== "cannot-show-not-git" &&
    ticket.innocent == null &&
    ticket.diabolica == null &&
    ticket.cannotShowNotGit == null &&
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
    innocent: scored.innocent ?? false,
    diabolica: scored.diabolica ?? false,
    cannotShowNotGit: scored.cannotShowNotGit ?? false,
    pwdUnresolved: scored.pwdUnresolved ?? false,
    optionMayStand: scored.optionMayStand ?? false,
    heredocToHelper: scored.heredocToHelper ?? false,
    pipelineTooComplex: scored.pipelineTooComplex ?? false,
    wrapperFindWord: scored.wrapperFindWord ?? false,
    computedProgramName: scored.computedProgramName ?? false,
    sixRefusals: scored.sixRefusals ?? false,
    oneEightyOne: scored.oneEightyOne ?? false,
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
    result.sixRefusals || result.diabolica
      ? "kind=cannot-show-not-git"
      : "kind=writ-idle",
    result.pwdUnresolved || result.diabolica ? "ref=pwd" : "ref=quashed",
    result.cannotShowNotGit || result.verdict === "cannot-show-not-git"
      ? "path=cannot-show-not-git"
      : "path=innocent",
    result.cue === "innocent"
      ? "cue=innocent"
      : result.cue === "cannot-show-not-git"
        ? "cue=cannot-show-not-git"
        : "cue=diabolica",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    innocent: result.innocent,
    diabolica: result.diabolica,
    cannotShowNotGit: result.cannotShowNotGit,
    pwdUnresolved: result.pwdUnresolved,
    optionMayStand: result.optionMayStand,
    heredocToHelper: result.heredocToHelper,
    pipelineTooComplex: result.pipelineTooComplex,
    wrapperFindWord: result.wrapperFindWord,
    computedProgramName: result.computedProgramName,
    sixRefusals: result.sixRefusals,
    oneEightyOne: result.oneEightyOne,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    writ: inspectWrit({
      innocent: result.innocent,
      diabolica: result.diabolica,
      cannotShowNotGit: result.cannotShowNotGit,
    }),
    scale: inspectScale({
      innocent: result.innocent,
      diabolica: result.diabolica,
      cannotShowNotGit: result.cannotShowNotGit,
    }),
    chamber: inspectChamber({
      innocent: result.innocent,
      diabolica: result.diabolica,
      oneEightyOne: result.oneEightyOne,
    }),
    charges: inspectCharges({
      innocent: result.innocent,
      diabolica: result.diabolica,
      sixRefusals: result.sixRefusals,
      pwdUnresolved: result.pwdUnresolved,
      optionMayStand: result.optionMayStand,
      heredocToHelper: result.heredocToHelper,
      pipelineTooComplex: result.pipelineTooComplex,
      wrapperFindWord: result.wrapperFindWord,
      computedProgramName: result.computedProgramName,
    }),
    proof: inspectProof({
      innocent: result.innocent,
      diabolica: result.diabolica,
      cannotShowNotGit: result.cannotShowNotGit,
    }),
    scope: mapCourt({
      innocent: result.innocent,
      diabolica: result.diabolica,
      cannotShowNotGit: result.cannotShowNotGit,
      pwdUnresolved: result.pwdUnresolved,
      optionMayStand: result.optionMayStand,
      heredocToHelper: result.heredocToHelper,
      pipelineTooComplex: result.pipelineTooComplex,
      wrapperFindWord: result.wrapperFindWord,
      computedProgramName: result.computedProgramName,
      sixRefusals: result.sixRefusals,
      oneEightyOne: result.oneEightyOne,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      diabolica: result.diabolica === true || result.verdict === "diabolica",
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
      shapes: REFUSAL_SHAPES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the worktree Bash gate demands each line prove it is NOT git / NOT escaping the worktree; when the checker cannot finish that negative proof it refuses — even for $PWD reads, quoted heredoc data, and wrapper arguments that never become git. Invite verify against #94040 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
