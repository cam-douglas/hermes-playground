#!/usr/bin/env node
/**
 * Frangible — wax-seal atelier / glass ampule / shear-pin booth.
 * A *frangible* is a deliberately breakable seal — wax, glass
 * ampule, or shear-pin — that snaps so the gate opens. Ironic
 * for an unintended fail-open: the deny-guard should stay
 * armed; instead the pin shears and the tool proceeds.
 * Deep indigo seal-ink / warm wax amber / cream parchment /
 * cracked-glass cyan. NOT a hotel door-plate (Nameplate).
 * NOT a lacquer nesting doll (Matryoshka). NOT a night
 * blotter (Dragnet). NOT an enrollment desk (Matricula).
 * NOT a type-foundry (Allograph). NOT a neurology
 * writing-desk (Agraphia). NOT a
 * gauntlet/lictor/lychgate/ouster/proscription booth.
 *
 * Educational diagnostic model for a published Claude Code
 * PreToolUse fail-open: a hook whose command file is not
 * executable (chmod 644) cannot be spawned. Claude Code
 * treats that as a non-blocking failure, so the tool call
 * proceeds — including when the hook's job is
 * permissionDecision: "deny". Guard is off. Only signal is
 * a two-line "Permission denied" warning once per tool call
 * forever (never names chmod +x). stream-json emits no
 * PreToolUse hook_started/hook_response. Same settings +
 * prompt with chmod 755 correctly denies.
 * Version noted: Claude Code 2.1.270; macOS 26.6.2.
 *
 * Encoded from anthropics/claude-code#94362 issue text only.
 * Hypothesis (NON-BINDING — issue text): A PreToolUse hook
 * whose command file is not executable cannot be spawned.
 * Claude Code reports that as a non-blocking failure, so the
 * tool call proceeds — including when the hook's entire job
 * is to return permissionDecision: "deny". The warning names
 * /bin/sh and Permission denied but never the cause
 * (chmod +x). A safety control that cannot be executed
 * should not fail open. Invite verify against issue text
 * only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a Claude Code fix.
 * No network. No exploits. No live Claude.
 *
 *   node frangible.mjs data/frangible.json
 *   echo '{"seed":"frangible"}' | node frangible.mjs
 *
 * Idle word is armed (HOLD: hook file is executable; deny
 * guard fires; tool does not proceed).
 * HOLD aliases: sealed, latched, guarded, executable,
 * bit-set, +x.
 * Seeded word is frangible (#94362 path).
 * Path word is chmod-failopen.
 * Product score word is frangible (Score frangible or admit armed.).
 *
 * NOT Nameplate/#94349. NOT Matryoshka/#94350. NOT Dragnet/#94064.
 * NOT Matricula/#93987. NOT Allograph/#94256. NOT Agraphia/#94251.
 * NOT Gauntlet/#94029. NOT Lictor/#94053. NOT Lychgate/#94059.
 * NOT Ouster/#94221. NOT Proscription/#94202. NOT Frisket. NOT Scant.
 * Cite-only related (same fail-open family, different trigger):
 * #67147 #65378 #76808 #88578. None of them covers a hook
 * file that exists and is readable but lacks +x.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "armed",
  "frangible",
  "chmod-failopen",
  "hold",
  "sealed",
  "latched",
  "guarded",
  "executable",
  "bit-set",
  "+x",
  "spawn-denied",
  "warning-only",
  "stream-silent",
  "fail-open",
  "chmod-644",
  "chmod-755",
  "permission-deny",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "armed";
export const PATH_WORD = "chmod-failopen";
export const SEEDED_WORD = "frangible";
export const PRODUCT_WORD = "frangible";
export const HOLD = Object.freeze(["armed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "sealed",
  "latched",
  "guarded",
  "executable",
  "bit-set",
  "+x",
]);
export const RECOVER = Object.freeze(["armed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "affixed",
  "engraved",
  "hung",
  "plated",
  "labeled",
  "titled",
  "unpacked",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "scoped",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "enrolled",
  "admitted",
  "rostered",
  "listed",
  "scanned",
  "freshened",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "nameplate",
  "matryoshka",
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
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "nameplate",
  "matryoshka",
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
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94362;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94362";
export const TITLE =
  "[BUG] PreToolUse hook without the executable bit fails open: deny guards silently stop guarding, one Permission denied warning per tool call";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:security",
  "area:hooks",
]);
export const PLATFORM = "macos";
export const SURFACE = "chmod-failopen";
export const HOST = "Claude Code 2.1.270";
export const CHECKED_ON =
  "Published repro: chmod 644 deny-everything PreToolUse guard.py; claude -p echo REPRO_MARKER with --settings and stream-json — command runs, deny never happens; same settings + prompt with chmod 755 returns DENIED BY GUARD";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL = "n/a — PreToolUse spawn / file-mode defect, not a model defect";
export const OS = "macOS 26.6.2 (Darwin 25.6.0), arm64, zsh; platform:macos / area:security / area:hooks";
export const PHRASE = "Score frangible or admit armed.";
export const DISTRIBUTION =
  "A PreToolUse hook whose command file is not executable (chmod 644) cannot be spawned. Claude Code reports that as a non-blocking failure, so the tool call proceeds — including when the hook's entire job is permissionDecision: \"deny\". Guard is off. Only signal is a two-line warning printed once per tool call, forever: PreToolUse:Bash hook error / Failed with non-blocking status code: /bin/sh: /path/to/guard.py: Permission denied. The message names /bin/sh and Permission denied but never the cause (chmod +x). stream-json emits hook_started/hook_response for SessionStart and none at all for PreToolUse. Same settings + prompt with chmod 755 correctly denies (DENIED BY GUARD). Losing +x is ordinary and silent: committed as 100644, cp from a template, editor rewrite, unzipped release, rsync without -p. A safety control that cannot be executed should not fail open.";

export const PERMISSION_DENIED =
  "PreToolUse:Bash hook error\nFailed with non-blocking status code: /bin/sh: /path/to/guard.py: Permission denied";
export const DENIED_BY_GUARD = "DENIED BY GUARD";
export const REPRO_MARKER = "REPRO_MARKER";
export const BUILD_VERSION = "2.1.270";
export const MODE_644 = "644";
export const MODE_755 = "755";

export const SEAL_NAMES = Object.freeze([
  {
    id: "wax-press",
    lost: "Wax press — deny-guard should stay stamped; +x holds the seal",
    control: "The wax press would keep the seal armed",
    story: "the atelier stamp holds when the bit is set",
  },
  {
    id: "glass-ampule",
    lost: "Glass ampule — chmod 644 snaps the neck; spawn cannot start",
    control: "A readable hook file would still be executable",
    story: "the ampule shears so the reagent never reaches the gate",
  },
  {
    id: "shear-pin",
    lost: "Shear-pin — spawn failure is non-blocking; the pin snaps and the gate opens",
    control: "A safety pin that cannot hold would fail closed",
    story: "the bench pin is frangible on purpose — here it is not supposed to be",
  },
  {
    id: "warning-slip",
    lost: "Warning slip — two-line Permission denied once per tool call forever; never names chmod +x",
    control: "The slip would name chmod +x and warn once per session",
    story: "the parchment reads like a sandbox problem, not a file mode",
  },
  {
    id: "stream-silent",
    lost: "Stream silent — stream-json emits no PreToolUse hook_started/hook_response",
    control: "Headless / SDK use would see the unrunnable hook",
    story: "the ampule breaks without a ledger row",
  },
  {
    id: "fail-open-gate",
    lost: "Fail-open gate — tool proceeds, including when the hook's job is permissionDecision: deny",
    control: "A deny-guard that cannot execute would not let the tool through",
    story: "REPRO_MARKER walks through the sheared pin",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "wax-press",
    survey: "chmod 755 / +x set; permissionDecision deny fires; tool does not proceed",
    kind: "armed",
    note: "idle/control: hook file is executable — the hold/good path",
  },
  {
    id: "glass-ampule",
    survey: "chmod 644; file exists and is readable but lacks +x; spawn Permission denied",
    kind: "frangible",
    note: "seeded: ampule snaps; guard never runs",
  },
  {
    id: "shear-pin",
    survey: "spawn failure treated as non-blocking; pin shears; gate opens",
    kind: "frangible",
    note: "seeded: fail-open on EACCES",
  },
  {
    id: "warning-slip",
    survey: "two-line Permission denied once per tool call forever; never names chmod +x",
    kind: "frangible",
    note: "seeded: warning misleads (sandbox/TCC, not file mode)",
  },
  {
    id: "stream-silent",
    survey: "stream-json: SessionStart events present; PreToolUse hook_started/hook_response absent",
    kind: "frangible",
    note: "seeded: headless / SDK use is completely invisible",
  },
  {
    id: "fail-open-gate",
    survey: "chmod-failopen — tool result is REPRO_MARKER; deny never happens",
    kind: "frangible",
    note: "path: chmod-failopen names the +x fail-open",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "spawn-denied",
    label: "spawn denied",
    count: "chmod 644",
    note: "Hook command cannot be spawned; /bin/sh Permission denied",
  },
  {
    id: "warning-only",
    label: "warning only",
    count: "two lines forever",
    note: "Non-blocking warning once per tool call; never names chmod +x",
  },
  {
    id: "stream-silent",
    label: "stream silent",
    count: "no PreToolUse events",
    note: "stream-json emits no hook_started/hook_response for PreToolUse",
  },
  {
    id: "fail-open",
    label: "fail open",
    count: "REPRO_MARKER",
    note: "Tool proceeds even when the hook's job is deny",
  },
  {
    id: "chmod-755",
    label: "chmod 755 control",
    count: "DENIED BY GUARD",
    note: "Same settings + prompt with +x correctly denies",
  },
  {
    id: "chmod-failopen",
    label: "chmod-failopen",
    count: "non-blocking spawn",
    note: "Path: safety control that cannot execute fails open",
  },
]);

export const RULED_OUT = Object.freeze([
  "Nameplate/#94349 header-rename — brass hotel door-plate / VS Code title snap-back; DIFFERENT",
  "Matryoshka/#94350 subst-nest — lacquer nesting-doll / Bash $(...) walker; DIFFERENT",
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
  "#67147 — fail-open when session cwd is deleted (posix_spawn ENOENT) — cite-only cousin, DIFFERENT trigger",
  "#65378 — same fail-open family, deleted-cwd / ENOENT — cite-only cousin, DIFFERENT trigger",
  "#76808 — same fail-open family, different trigger — cite-only cousin, DIFFERENT trigger",
  "#88578 — Windows backslash paths → hook never executes, silently — cite-only cousin, DIFFERENT trigger",
]);

export const EXPECTED = Object.freeze([
  "A PreToolUse hook that can return deny is a safety control; if it cannot be executed the tool must not proceed",
  "chmod 644 / missing +x must not fail open when the hook's job is permissionDecision: deny",
  "Same settings + prompt with chmod 755 is the published positive control — deny fires (DENIED BY GUARD)",
  "The warning must name the actual cause: hook command is not executable — chmod +x <path>",
  "Warn once per session per hook, not once per tool call forever",
  "stream-json must emit hook_started / hook_response for PreToolUse so headless / SDK use is not invisible",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "chmod-failopen",
  "frangible",
  "spawn-denied",
  "warning-only",
  "stream-silent",
  "fail-open",
]);

export const COUSINS = Object.freeze([
  {
    issue: 67147,
    title: "fail-open when session cwd is deleted (posix_spawn ENOENT)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — same fail-open family, different trigger (deleted session cwd). Do not rebuild. Do not conflate. Does not cover a hook file that exists and is readable but lacks +x.",
  },
  {
    issue: 65378,
    title: "same fail-open family, deleted-cwd / ENOENT trigger",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — same fail-open family, different trigger. Do not rebuild. Do not conflate.",
  },
  {
    issue: 76808,
    title: "same fail-open family, different trigger",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — same fail-open family, different trigger. Do not rebuild. Do not conflate.",
  },
  {
    issue: 88578,
    title: "Windows backslash paths → hook never executes, silently",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — same fail-open family, different trigger (path separators). Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "Remote Control slows local session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "Shift+PageUp Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94348, title: "Desktop Auto permission prompt never renders", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94349, title: "VS Code header rename reverts instantly", state: "OPEN", citeOnly: true, why: "Cite only — Nameplate/#94349 — do not rebuild. Do not auto-pick." },
]);

export const NOT_PRODUCTS = Object.freeze([
  "nameplate",
  "matryoshka",
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
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "executable";
export const SAMPLE_KIND_SEEDED = "chmod-failopen";
export const SAMPLE_HOLDING_IDLE = "sealed";
export const SAMPLE_HOLDING_SEEDED = "spawn-denied";

export const SAMPLE_ARMED_PROOF = Object.freeze({
  armed: true,
  frangible: false,
  chmodFailopen: false,
  spawnDenied: false,
  warningOnly: false,
  streamSilent: false,
  failOpen: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_FRANGIBLE_PROOF = Object.freeze({
  armed: false,
  frangible: true,
  chmodFailopen: true,
  spawnDenied: true,
  warningOnly: true,
  streamSilent: true,
  failOpen: true,
  chmod644: true,
  toolProceeds: true,
  kind: SAMPLE_KIND_SEEDED,
  names: SEAL_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds armed: hook file is executable; deny guard fires; tool does not proceed" },
  { t: "ampule", line: "chmod 644 — file exists and is readable but lacks +x; spawn Permission denied" },
  { t: "shear", line: "non-blocking status code; pin shears; warning never names chmod +x" },
  { t: "path", line: "chmod-failopen — tool proceeds with REPRO_MARKER; stream-json silent on PreToolUse" },
  { t: "score", line: "when the wax seal snaps so the deny-guard fails open the booth is frangible — Score frangible or admit armed." },
]);

const FORCE_FLAGS = [
  "spawnDenied",
  "warningOnly",
  "streamSilent",
  "failOpen",
  "chmodFailopen",
  "chmod644",
  "toolProceeds",
];

const ISSUE_CUE_RE =
  /94362|chmod.?644|chmod \+x|permissionDecision|Permission denied|fail.?open|PreToolUse|REPRO_MARKER|DENIED BY GUARD/i;

/**
 * Educational PreToolUse spawn compare. Not a Claude Code patch.
 * Encodes only the published #94362 shapes.
 * armed=true is the HOLD / chmod 755 deny-fires path.
 */
export function spawnGuard({
  executable = false,
  mode = null,
  armed = false,
} = {}) {
  const canExec =
    armed === true ||
    executable === true ||
    mode === 0o755 ||
    mode === "755" ||
    mode === 755;
  if (canExec) {
    return {
      spawned: true,
      blocking: true,
      toolProceeds: false,
      denied: true,
      reason: DENIED_BY_GUARD,
      marker: null,
      warning: null,
      namesChmod: false,
      streamPreToolUse: false,
      phrase: "admit armed",
    };
  }
  return {
    spawned: false,
    blocking: false,
    toolProceeds: true,
    denied: false,
    reason: null,
    marker: REPRO_MARKER,
    warning: PERMISSION_DENIED,
    namesChmod: false,
    streamPreToolUse: false,
    phrase: "score frangible",
  };
}

export function scoreChmodFailopen(input = {}) {
  const armedHold = input.armed === true && input.frangible !== true;
  const executable =
    input.executable === true ||
    input.mode === 0o755 ||
    input.mode === "755" ||
    input.mode === 755;
  const spawn = spawnGuard({
    executable: armedHold ? true : executable,
    mode: input.mode,
    armed: armedHold,
  });
  const frangible =
    !armedHold &&
    (spawn.spawned === false ||
      input.frangible === true ||
      input.chmodFailopen === true ||
      input.spawnDenied === true ||
      input.failOpen === true ||
      input.mode === 0o644 ||
      input.mode === "644" ||
      input.mode === 644);
  return {
    mode: input.mode || (frangible ? "644" : "755"),
    armed: !frangible,
    frangible,
    chmodFailopen: frangible,
    spawnDenied: spawn.spawned === false,
    warningOnly: spawn.warning != null,
    streamSilent: spawn.streamPreToolUse === false,
    failOpen: spawn.toolProceeds === true,
    toolProceeds: spawn.toolProceeds,
    namesChmod: spawn.namesChmod,
    spawn,
    warning: spawn.warning,
    phrase: frangible ? "score frangible" : "admit armed",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94362") return true;
  if (input.warning === PERMISSION_DENIED) return true;
  if (input.marker === REPRO_MARKER) return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapSeal(input = {}) {
  const frangible = isFrangibleInput(input);
  const armed = input.armed === true && !frangible;
  return {
    stamp: frangible ? "chmod-failopen" : "armed-seal",
    holdingLane: frangible ? "spawn-denied" : "sealed",
    kindLane: frangible ? "chmod-failopen" : "executable",
    bindLane: frangible ? "fail-open" : "latched",
    ribbon: frangible ? "frangible" : "armed",
    armed,
  };
}

export function inspectPress(input = {}) {
  const snapped =
    input.chmodFailopen === true ||
    input.frangible === true ||
    input.spawnDenied === true ||
    isFrangibleInput(input);
  if (input.armed === true && !snapped) {
    return { stamp: "seal-armed", snapped: false, note: "wax press keeps the deny-guard stamped" };
  }
  return {
    stamp: snapped ? "wax-press" : "press-idle",
    snapped,
    note: snapped
      ? "wax press — seal snaps; deny-guard never stamps"
      : "",
  };
}

export function inspectAmpule(input = {}) {
  const cracked =
    input.chmod644 === true ||
    input.spawnDenied === true ||
    input.frangible === true ||
    isFrangibleInput(input);
  if (input.armed === true && !cracked) {
    return { stamp: "ampule-idle", cracked: false };
  }
  return {
    stamp: cracked ? "glass-ampule" : "ampule-idle",
    cracked: cracked || input.armed === true,
    note: cracked
      ? "glass ampule — chmod 644 snaps the neck; spawn cannot start"
      : "",
  };
}

export function inspectPin(input = {}) {
  const sheared =
    input.failOpen === true ||
    input.chmodFailopen === true ||
    input.frangible === true ||
    isFrangibleInput(input);
  if (input.armed === true && !sheared) {
    return { stamp: "pin-idle", sheared: false };
  }
  return {
    stamp: sheared ? "shear-pin" : "pin-idle",
    sheared: sheared || input.armed === true,
    note: sheared
      ? "shear-pin — spawn failure is non-blocking; the gate opens"
      : "",
  };
}

export function inspectWarning(input = {}) {
  const slipped =
    input.warningOnly === true ||
    input.frangible === true ||
    isFrangibleInput(input);
  if (input.armed === true && !slipped) {
    return { stamp: "slip-quiet", slipped: false };
  }
  return {
    stamp: slipped ? "warning-slip" : "slip-idle",
    slipped,
    note: slipped
      ? "warning slip — two-line Permission denied; never names chmod +x"
      : "",
  };
}

export function inspectStream(input = {}) {
  const silent =
    input.streamSilent === true ||
    input.frangible === true ||
    isFrangibleInput(input);
  if (input.armed === true && !silent) {
    return { stamp: "stream-idle", silent: false };
  }
  return {
    stamp: silent ? "stream-silent" : "stream-idle",
    silent,
    note: silent
      ? "stream silent — no PreToolUse hook_started/hook_response"
      : "",
  };
}

export function inspectGate(input = {}) {
  const open =
    input.failOpen === true ||
    input.toolProceeds === true ||
    input.chmodFailopen === true ||
    input.frangible === true ||
    isFrangibleInput(input);
  if (input.armed === true && !open) {
    return { stamp: "gate-idle", open: false };
  }
  return {
    stamp: open ? "fail-open-gate" : "gate-idle",
    open,
    note: open
      ? "fail-open gate — tool proceeds; REPRO_MARKER walks through"
      : "",
  };
}

function sealOpen(input, id) {
  const map = {
    "wax-press": input.chmodFailopen || input.frangible,
    "glass-ampule": input.spawnDenied || input.chmod644,
    "shear-pin": input.failOpen || input.chmodFailopen,
    "warning-slip": input.warningOnly,
    "stream-silent": input.streamSilent,
    "fail-open-gate": input.failOpen || input.toolProceeds || input.chmodFailopen,
  };
  return (
    map[id] === true ||
    input.chmodFailopen === true ||
    input.frangible === true
  );
}

function isFrangibleInput(input = {}) {
  return (
    input.frangible === true ||
    input.chmodFailopen === true ||
    input.spawnDenied === true ||
    input.warningOnly === true ||
    input.failOpen === true ||
    input.chmod644 === true ||
    input.toolProceeds === true ||
    input.mode === 0o644 ||
    input.mode === "644" ||
    input.mode === 644 ||
    input.warning === PERMISSION_DENIED ||
    input.marker === REPRO_MARKER
  );
}

export function readBooth(input = {}) {
  const frangible = isFrangibleInput(input);
  const armed = input.armed === true && !frangible;
  return {
    mark: frangible ? "frangible" : "armed",
    armed,
    frangible,
    chmodFailopen: input.chmodFailopen === true || frangible,
    spawnDenied: input.spawnDenied === true,
    warningOnly: input.warningOnly === true,
    streamSilent: input.streamSilent === true,
    failOpen: input.failOpen === true,
    chmod644: input.chmod644 === true,
    toolProceeds: input.toolProceeds === true,
    seal: mapSeal(input),
    press: inspectPress(input),
    ampule: inspectAmpule(input),
    pin: inspectPin(input),
    warning: inspectWarning(input),
    stream: inspectStream(input),
    gate: inspectGate(input),
    names: SEAL_NAMES.filter((row) => sealOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const FRANGIBLE_WALK = Object.freeze([
  {
    t: "idle",
    event: "seal-armed",
    armed: true,
    frangible: false,
    cue: "armed",
    note: "idle HOLD: hook file is executable; deny guard fires; tool does not proceed",
  },
  {
    t: "ampule",
    event: "chmod-failopen",
    frangible: true,
    chmodFailopen: true,
    chmod644: true,
    spawnDenied: true,
    cue: "frangible",
    note: "chmod 644 — file exists and is readable but lacks +x; spawn Permission denied",
  },
  {
    t: "shear",
    event: "spawn-denied",
    frangible: true,
    spawnDenied: true,
    chmodFailopen: true,
    cue: "frangible",
    note: "non-blocking status code; pin shears; warning never names chmod +x",
  },
  {
    t: "path",
    event: "chmod-failopen",
    frangible: true,
    chmodFailopen: true,
    spawnDenied: true,
    warningOnly: true,
    streamSilent: true,
    failOpen: true,
    chmod644: true,
    toolProceeds: true,
    cue: "frangible",
    note: "chmod-failopen — tool proceeds with REPRO_MARKER; stream-json silent on PreToolUse",
  },
  {
    t: "score",
    event: "frangible",
    frangible: true,
    chmodFailopen: true,
    spawnDenied: true,
    warningOnly: true,
    streamSilent: true,
    failOpen: true,
    chmod644: true,
    toolProceeds: true,
    cue: "frangible",
    note: "frangible — the wax seal snaps so the deny-guard fails open",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "seal-armed",
    armed: true,
    frangible: false,
    cue: "armed",
    note: "positive control: chmod 755; deny fires; DENIED BY GUARD",
  },
  {
    t: "admit",
    event: "seal-armed",
    armed: true,
    cue: "armed",
    note: "positive control: the atelier admits armed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    armed: true,
    frangible: false,
    chmodFailopen: false,
    cue: "armed",
  };
}

export function seedArmed() {
  return { ...emptyTicket() };
}

export function seedFrangible() {
  return {
    seed: SEEDED_WORD,
    armed: false,
    frangible: true,
    chmodFailopen: true,
    spawnDenied: true,
    warningOnly: true,
    streamSilent: true,
    failOpen: true,
    chmod644: true,
    toolProceeds: true,
    cue: "frangible",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_FRANGIBLE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    frangible: true,
    chmodFailopen: true,
    cue: "frangible",
  };
}

export function seedChmodFailopen() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    frangible: true,
    chmodFailopen: true,
    event: "chmod-failopen",
    cue: "frangible",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    armed: true,
    cue: "armed",
  };
}

export function seedSealed() {
  return { seed: "sealed", preferSeed: true, armed: true, cue: "armed" };
}

export function seedLatched() {
  return { seed: "latched", preferSeed: true, armed: true, cue: "armed" };
}

export function seedGuarded() {
  return { seed: "guarded", preferSeed: true, armed: true, cue: "armed" };
}

export function seedExecutable() {
  return { seed: "executable", preferSeed: true, armed: true, cue: "armed" };
}

export function seedBitSet() {
  return { seed: "bit-set", preferSeed: true, armed: true, cue: "armed" };
}

export function seedPlusX() {
  return { seed: "+x", preferSeed: true, armed: true, cue: "armed" };
}

export function seedSpawnDenied() {
  return {
    seed: "spawn-denied",
    preferSeed: true,
    spawnDenied: true,
    cue: "frangible",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      armed: false,
      frangible: false,
      chmodFailopen: false,
      spawnDenied: false,
      warningOnly: false,
      streamSilent: false,
      failOpen: false,
      chmod644: false,
      toolProceeds: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    armed: raw.armed === true,
    frangible: raw.frangible === true || raw.event === "frangible",
    chmodFailopen:
      raw.chmodFailopen === true || raw.event === "chmod-failopen",
    spawnDenied:
      raw.spawnDenied === true || raw.event === "spawn-denied",
    warningOnly:
      raw.warningOnly === true || raw.event === "warning-only",
    streamSilent:
      raw.streamSilent === true || raw.event === "stream-silent",
    failOpen:
      raw.failOpen === true || raw.event === "fail-open",
    chmod644:
      raw.chmod644 === true || raw.event === "chmod-644",
    toolProceeds:
      raw.toolProceeds === true || raw.event === "fail-open-gate",
    mode: raw.mode,
    executable: raw.executable,
    warning: raw.warning,
    marker: raw.marker,
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
      (ticket.armed != null ||
        ticket.frangible != null ||
        ticket.chmodFailopen != null ||
        ticket.spawnDenied != null ||
        ticket.warningOnly != null ||
        ticket.streamSilent != null ||
        ticket.failOpen != null ||
        ticket.chmod644 != null ||
        ticket.toolProceeds != null ||
        ticket.mode != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isArmed(row) {
  if (row.frangible && row.cue !== "armed") return false;
  if (row.cue === "frangible" || row.cue === "chmod-failopen") return false;
  if (
    row.chmodFailopen &&
    row.spawnDenied &&
    row.cue !== "armed" &&
    row.armed !== true
  ) {
    return false;
  }
  if (
    row.armed === true &&
    row.frangible !== true &&
    row.cue !== "frangible"
  ) {
    return true;
  }
  if (
    row.cue === "armed" &&
    row.frangible !== true &&
    row.chmodFailopen !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isChmodFailopen(row) {
  return (
    row.event === "chmod-failopen" &&
    !isArmed(row) &&
    (row.chmodFailopen === true ||
      row.spawnDenied === true ||
      row.frangible === true)
  );
}

function isFrangibleRow(row) {
  if (isArmed(row)) return false;
  if (isChmodFailopen(row) && row.cue !== "frangible") return false;
  if (row.cue === "frangible") return true;
  if (row.frangible === true) return true;
  if (row.chmodFailopen === true && row.spawnDenied === true) return true;
  if (
    row.chmodFailopen === true ||
    row.spawnDenied === true ||
    row.warningOnly === true ||
    row.failOpen === true ||
    row.chmod644 === true ||
    row.toolProceeds === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one frangible pass against the wax-seal atelier.
 * armed: hook file is executable; deny guard fires.
 * frangible: chmod 644 snaps the seal; spawn fails open.
 * chmod-failopen: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isChmodFailopen(row) ||
    (row.chmodFailopen && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "chmod-failopen";
  } else if (isFrangibleRow(row)) {
    verdict = "frangible";
  } else if (isArmed(row)) {
    verdict = "armed";
  } else if (
    row.chmodFailopen ||
    row.spawnDenied ||
    row.warningOnly ||
    row.failOpen ||
    row.chmod644 ||
    row.toolProceeds
  ) {
    verdict = "frangible";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "frangible";
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
    armed: verdict === "armed" || verdict === "hold",
    frangible: verdict === "frangible" || verdict === SEEDED_WORD,
    chmodFailopen:
      row.chmodFailopen === true ||
      verdict === "chmod-failopen" ||
      verdict === PATH_WORD,
    spawnDenied: row.spawnDenied,
    warningOnly: row.warningOnly,
    streamSilent: row.streamSilent,
    failOpen: row.failOpen,
    chmod644: row.chmod644,
    toolProceeds: row.toolProceeds,
    cue: hold
      ? "armed"
      : row.chmodFailopen || verdict === "chmod-failopen"
        ? "chmod-failopen"
        : "frangible",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit armed" : "score frangible",
    pressInspect: inspectPress(row),
    ampuleInspect: inspectAmpule(row),
    pinInspect: inspectPin(row),
    warningInspect: inspectWarning(row),
    streamInspect: inspectStream(row),
    gateInspect: inspectGate(row),
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
      : FRANGIBLE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "frangible");
  const path = scored.filter((row) => row.verdict === "chmod-failopen");
  const armed = scored.filter((row) => row.verdict === "armed");
  const headline =
    scored.find((row) => row.event === "frangible") ||
    scored.find((row) => row.event === "chmod-failopen") ||
    scored.find((row) => row.event === "spawn-denied") ||
    charged[charged.length - 1];
  let verdict = "armed";
  if (charged.length) verdict = "frangible";
  else if (path.length && !armed.length) {
    verdict = "chmod-failopen";
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
    frangibleCount: charged.length,
    pathCount: path.length,
    armedCount: armed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit armed" : "score frangible",
    note: headline
      ? "PreToolUse deny-guard fails open when the hook file lacks +x (chmod 644); Claude Code treats spawn failure as non-blocking so the tool proceeds, including when the hook's job is permissionDecision: deny. Warning is a two-line Permission denied that never names chmod +x. stream-json emits no PreToolUse hook_started/hook_response. Same settings + prompt with chmod 755 correctly denies. Cite-only cousins #67147 #65378 #76808 #88578."
      : "published frangible walk scored against armed vs frangible",
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
    seeded !== "armed" &&
    seeded !== "frangible" &&
    seeded !== "chmod-failopen" &&
    ticket.armed == null &&
    ticket.frangible == null &&
    ticket.chmodFailopen == null &&
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
    armed: scored.armed ?? false,
    frangible: scored.frangible ?? false,
    chmodFailopen: scored.chmodFailopen ?? false,
    spawnDenied: scored.spawnDenied ?? false,
    warningOnly: scored.warningOnly ?? false,
    streamSilent: scored.streamSilent ?? false,
    failOpen: scored.failOpen ?? false,
    chmod644: scored.chmod644 ?? false,
    toolProceeds: scored.toolProceeds ?? false,
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
    result.spawnDenied || result.frangible
      ? "kind=chmod-failopen"
      : "kind=executable",
    result.failOpen || result.frangible
      ? "ref=fail-open"
      : "ref=sealed",
    result.chmodFailopen || result.verdict === "chmod-failopen"
      ? "path=chmod-failopen"
      : "path=armed",
    result.cue === "armed"
      ? "cue=armed"
      : result.cue === "chmod-failopen"
        ? "cue=chmod-failopen"
        : "cue=frangible",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    armed: result.armed,
    frangible: result.frangible,
    chmodFailopen: result.chmodFailopen,
    spawnDenied: result.spawnDenied,
    warningOnly: result.warningOnly,
    streamSilent: result.streamSilent,
    failOpen: result.failOpen,
    chmod644: result.chmod644,
    toolProceeds: result.toolProceeds,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    press: inspectPress({
      armed: result.armed,
      frangible: result.frangible,
    }),
    ampule: inspectAmpule({
      armed: result.armed,
      frangible: result.frangible,
      spawnDenied: result.spawnDenied,
      chmod644: result.chmod644,
    }),
    pin: inspectPin({
      armed: result.armed,
      frangible: result.frangible,
      failOpen: result.failOpen,
      chmodFailopen: result.chmodFailopen,
    }),
    warningSlip: inspectWarning({
      armed: result.armed,
      frangible: result.frangible,
      warningOnly: result.warningOnly,
    }),
    stream: inspectStream({
      armed: result.armed,
      frangible: result.frangible,
      streamSilent: result.streamSilent,
    }),
    gate: inspectGate({
      armed: result.armed,
      frangible: result.frangible,
      failOpen: result.failOpen,
      toolProceeds: result.toolProceeds,
    }),
    seal: mapSeal({
      armed: result.armed,
      frangible: result.frangible,
      chmodFailopen: result.chmodFailopen,
      spawnDenied: result.spawnDenied,
      failOpen: result.failOpen,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      frangible: result.frangible === true || result.verdict === "frangible",
    })),
    chmodPath: scoreChmodFailopen({
      armed: result.armed === true && !result.frangible,
      frangible: result.frangible,
      chmodFailopen: result.chmodFailopen,
      spawnDenied: result.spawnDenied,
      failOpen: result.failOpen,
      mode: result.armed === true && !result.frangible ? "755" : "644",
    }),
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
      names: SEAL_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): A PreToolUse hook whose command file is not executable cannot be spawned. Claude Code reports that as a non-blocking failure, so the tool call proceeds — including when the hook's entire job is permissionDecision: \"deny\". The warning names /bin/sh and Permission denied but never the cause (chmod +x). stream-json emits no PreToolUse hook_started/hook_response. Same settings + prompt with chmod 755 correctly denies. A safety control that cannot be executed should not fail open. Invite verify against #94362 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    if (trimmed === "+x" || lower === "+x") return { seed: "+x", preferSeed: true };
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
