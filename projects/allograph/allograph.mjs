#!/usr/bin/env node
/**
 * Allograph — type-foundry / punchcutter / dual-script ledger booth.
 * Typography *allograph*: variant glyph forms of the same grapheme.
 * `D:\proj\file` and `/d/proj/file` are allographs of one path; the
 * shared PreToolUse guard treats them as different letters and fails
 * closed. Scriptorium / type-foundry / punchcutter / dual-script
 * ledger. NOT medical agraphia. NOT medieval gate/gauntlet/lictor.
 *
 * Educational diagnostic model for a published Claude Code Windows
 * hook defect: a shared PreToolUse guard for Edit|Write|NotebookEdit
 * allows only `$PWD/*`, `$HOME/.claude/*`, `/tmp/claude-*`. Works on
 * Linux. On Windows+Git Bash, `tool_input.file_path` arrives as
 * Windows paths (`D:\Dropbox\project\doc.tex`, `C:\Users\...`) while
 * `$PWD`/`$HOME` in the hook shell are POSIX (`/d/Dropbox/project`,
 * `/c/Users/...`). String prefix match fails closed → every
 * in-project Edit/Write denied, including `.claude/settings.json`
 * (session cannot self-repair). Scratchpad also mismatches
 * (`C:\Users\USER~1\AppData\Local\Temp\claude\...` vs `/tmp/claude/...`).
 * Only feedback is the hook deny message.
 *
 * Encoded from anthropics/claude-code#94256 issue text only.
 * Hypothesis (NON-BINDING): the shared path-guard compares Windows
 * tool_input paths to POSIX $PWD/$HOME by string prefix and fails
 * closed. Invite verify against issue text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT
 * implement a Claude Code fix. No network. No exploits. No live Claude.
 *
 *   node allograph.mjs data/allograph.json
 *   echo '{"seed":"allograph"}' | node allograph.mjs
 *
 * Idle word is equated (HOLD: paths compared after script unification
 * would match). HOLD aliases: matched, congruent, aligned, normalized,
 * samepath. Seeded word is allograph (#94256 — the win-posix-mismatch
 * path). Path word is win-posix-mismatch.
 * Product score word is allograph (Score allograph or admit equated.).
 *
 * NOT Agraphia/#94251. NOT Gauntlet/#94029. NOT Lictor/#94053.
 * NOT Lychgate/#94059. NOT Ouster/#94221. NOT Proscription/#94202.
 * NOT Thimblerig/#94174. NOT Fetchling/#94065. NOT Rasure/#93791.
 * NOT Palilalia/#94041. NOT Sallyport/#94082. NOT Sepulchre.
 * NOT Anarthria/#93782. NOT Wicket. NOT Hasp. NOT Ward. NOT Veto.
 * NOT Interdict.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #89392 — Bash strips backslashes on Windows/Git Bash.
 * #88578 — hook commands with backslash paths never execute.
 * #90122 — commandWindows ignored, forces Git Bash.
 * #93356 — hooks fail when Windows username has space.
 * #79414 — plugin marketplace PATH POSIX-style.
 * Allograph is specifically the shared path-guard comparing Windows
 * tool_input paths to POSIX $PWD/$HOME and failing closed.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "equated",
  "allograph",
  "win-posix-mismatch",
  "hold",
  "matched",
  "congruent",
  "aligned",
  "normalized",
  "samepath",
  "settings-lockout",
  "scratchpad-temp",
  "deny-message-only",
  "prefix-fail",
  "fail-closed",
  "windows-path",
  "posix-shell",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "equated";
export const PATH_WORD = "win-posix-mismatch";
export const SEEDED_WORD = "allograph";
export const PRODUCT_WORD = "allograph";
export const HOLD = Object.freeze(["equated", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "matched",
  "congruent",
  "aligned",
  "normalized",
  "samepath",
]);
export const RECOVER = Object.freeze(["equated", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "penned",
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
  "inked",
  "recorded",
  "retained",
  "charted",
  "filed",
  "marked",
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
  "palilalia",
  "sallyport",
  "sepulchre",
  "anarthria",
  "wicket",
  "hasp",
  "ward",
  "veto",
  "interdict",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
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
  "palilalia",
  "sallyport",
  "sepulchre",
  "anarthria",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94256;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94256";
export const TITLE =
  "[BUG] Windows: path-guard hook shared with Linux denies every Edit/Write, even on its own settings file (tool_input.file_path is D:\\... but hook shell $PWD/$HOME are POSIX /d/...)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:hooks",
]);
export const PLATFORM = "windows";
export const SURFACE = "win-posix-mismatch";
export const HOST =
  "Claude Code 2.1.270, native Windows 10 Pro, hooks in Git Bash; same settings.json synced with Ubuntu where it works";
export const CHECKED_ON =
  "Claude Code 2.1.270 native Windows 10 Pro + Git Bash hooks; Ubuntu sync is the working control";
export const BUILD = "Claude Code 2.1.270 (native Windows 10 Pro, Git Bash hooks)";
export const SELECTED_MODEL = "n/a — hook path-guard, not a model defect";
export const OS = "native Windows 10 Pro; hook shell Git Bash";
export const PHRASE = "Score allograph or admit equated.";
export const DISTRIBUTION =
  "Shared PreToolUse guard for Edit|Write|NotebookEdit allows only $PWD/*, $HOME/.claude/*, /tmp/claude-*. Works on Linux. On Windows+Git Bash, tool_input.file_path arrives as Windows paths (D:\\Dropbox\\project\\doc.tex, C:\\Users\\...) while $PWD/$HOME in the hook shell are POSIX (/d/Dropbox/project, /c/Users/...). String prefix match fails closed → every in-project Edit/Write denied, including .claude/settings.json (session cannot self-repair). Scratchpad also mismatches (C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude\\... vs /tmp/claude/...). Only feedback is the hook deny message — looks like permissions, not path-script mismatch.";

export const PATH_PAIRS = Object.freeze([
  {
    id: "project-tex",
    windows: "D:\\Dropbox\\project\\doc.tex",
    posix: "/d/Dropbox/project",
    allow: "$PWD/*",
    naive: false,
    unified: true,
  },
  {
    id: "settings-lockout",
    windows: "D:\\Dropbox\\project\\.claude\\settings.json",
    posix: "/d/Dropbox/project",
    allow: "$PWD/*",
    naive: false,
    unified: true,
    lockout: true,
  },
  {
    id: "home-claude",
    windows: "C:\\Users\\Name\\.claude\\settings.json",
    posix: "/c/Users/Name/.claude",
    allow: "$HOME/.claude/*",
    naive: false,
    unified: true,
  },
  {
    id: "scratchpad-temp",
    windows: "C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude\\scratch.md",
    posix: "/tmp/claude",
    allow: "/tmp/claude-*",
    naive: false,
    unified: false,
    scratchpad: true,
  },
]);

export const RULED_OUT = Object.freeze([
  "Agraphia/#94251 pre-tool-omit — JSONL drops pre-tool text; medical writing-desk; DIFFERENT",
  "Gauntlet/#94029 attach-mouse — attach ignores DISABLE_MOUSE; DIFFERENT",
  "Lictor/#94053 picker-bypass — desktop model picker skips Pre/PostModelSwitch; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Rasure/#93791 creation-time-flip — ~/.claude wiped; parchment scrape, DIFFERENT",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text; DIFFERENT",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets; DIFFERENT",
  "Sepulchre — bash-nul-poison; different vault",
  "Anarthria/#93782 — Wispr Flow clipboard drop; ENT/voice clinic, DIFFERENT",
  "Wicket / Hasp / Ward / Veto / Interdict — gate/glove paradigms; stay off",
  "#89392 — Bash strips backslashes on Windows/Git Bash; cite-only cousin",
  "#88578 — hook commands with backslash paths never execute; cite-only cousin",
  "#90122 — commandWindows ignored, forces Git Bash; cite-only cousin",
  "#93356 — hooks fail when Windows username has space; cite-only cousin",
  "#79414 — plugin marketplace PATH POSIX-style; cite-only cousin",
]);

export const EXPECTED = Object.freeze([
  "A shared path-guard should treat D:\\proj\\file and /d/proj/file as one path after script unification",
  "In-project Edit/Write on Windows+Git Bash should be allowed when $PWD is the same directory in POSIX script",
  ".claude/settings.json in the project should remain writable so the session can self-repair",
  "Scratchpad under the Windows temp claude folder should be recognized as the /tmp/claude-* allow",
  "A deny should name the path-script mismatch, not look like a permissions failure",
  "Linux-only string prefix against $PWD/* / $HOME/.claude/* / /tmp/claude-* should not be the Windows compare",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "windows-path",
    label: "windows punch",
    count: "D:\\ and C:\\ arrive",
    note: "tool_input.file_path is a Windows path",
  },
  {
    id: "posix-shell",
    label: "posix matrix",
    count: "/d/ and /c/ in $PWD",
    note: "hook shell $PWD/$HOME are POSIX",
  },
  {
    id: "prefix-fail",
    label: "prefix fail",
    count: "string prefix closed",
    note: "naive startsWith of Windows against POSIX fails",
  },
  {
    id: "settings-lockout",
    label: "settings lockout",
    count: "cannot self-repair",
    note: "even .claude/settings.json is denied",
  },
  {
    id: "scratchpad-temp",
    label: "scratchpad temp",
    count: "USER~1 Temp vs /tmp",
    note: "Windows temp claude folder ≠ /tmp/claude-*",
  },
  {
    id: "win-posix-mismatch",
    label: "win-posix-mismatch",
    count: "dual-script fail-closed",
    note: "Path: shared guard compares Windows tool_input to POSIX $PWD/$HOME",
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "win-punch",
    lost: "Windows punch — tool_input.file_path is D:\\... / C:\\...",
    control: "Windows path and POSIX $PWD name the same grapheme",
    story: "the punch cuts D:\\ while the matrix is /d/",
  },
  {
    id: "posix-matrix",
    lost: "POSIX matrix — hook shell $PWD/$HOME are /d/... / /c/...",
    control: "allow prefixes live in the same script as tool_input",
    story: "the matrix is cut in POSIX while the punch is Windows",
  },
  {
    id: "prefix-fail",
    lost: "Prefix fail — string prefix match fails closed",
    control: "compare after unifying scripts so the grapheme matches",
    story: "two allographs scored as different letters",
  },
  {
    id: "settings-lockout",
    lost: "Settings lockout — even .claude/settings.json is denied",
    control: "the foundry can still stamp its own settings plate",
    story: "the session cannot self-repair the guard",
  },
  {
    id: "scratchpad-temp",
    lost: "Scratchpad temp — C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude vs /tmp/claude",
    control: "Windows temp claude folder counts as /tmp/claude-*",
    story: "the scratch slug is another unmatched allograph",
  },
  {
    id: "win-posix-mismatch",
    lost: "win-posix-mismatch — shared guard fails closed on dual-script paths",
    control: "Linux string prefix stays Linux; Windows unifies first",
    story: "the dual-script ledger scores allograph",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "win-punch",
    survey: "type-case punch; Windows tool_input.file_path D:\\Dropbox\\project\\doc.tex",
    kind: "allograph",
    note: "seeded: Windows punch arrives in a different script",
  },
  {
    id: "posix-matrix",
    survey: "copper matrix; Git Bash $PWD /d/Dropbox/project",
    kind: "allograph",
    note: "seeded: POSIX matrix is the allow prefix",
  },
  {
    id: "prefix-fail",
    survey: "string prefix of D:\\ against /d/ fails closed",
    kind: "allograph",
    note: "seeded: fail-closed looks like permissions",
  },
  {
    id: "settings-lockout",
    survey: "own .claude/settings.json denied — session cannot self-repair",
    kind: "allograph",
    note: "seeded: settings lockout",
  },
  {
    id: "scratchpad-temp",
    survey: "C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude vs /tmp/claude",
    kind: "allograph",
    note: "seeded: scratchpad-temp mismatch",
  },
  {
    id: "foundry-ledger",
    survey: "win-posix-mismatch — dual-script ledger on 2.1.270 Windows+Git Bash",
    kind: "allograph",
    note: "path: win-posix-mismatch names the unmatched allographs",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "win-posix-mismatch",
  "allograph",
  "prefix-fail",
  "settings-lockout",
  "scratchpad-temp",
  "deny-message-only",
]);

export const COUSINS = Object.freeze([
  {
    issue: 89392,
    title: "Bash strips backslashes on Windows/Git Bash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — Bash strips backslashes on Windows/Git Bash. This booth is the shared path-guard comparing Windows tool_input to POSIX $PWD/$HOME. Do not rebuild. Do not conflate.",
  },
  {
    issue: 88578,
    title: "hook commands with backslash paths never execute — bash eats backslashes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — hook commands with backslash paths never execute. This booth is prefix-match fail-closed on dual-script paths. Do not rebuild. Do not conflate.",
  },
  {
    issue: 90122,
    title: "commandWindows ignored, forces Git Bash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — commandWindows ignored, forces Git Bash. This booth is the path-guard compare, not the shell picker. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93356,
    title: "hooks fail when Windows username has space",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — hooks fail when Windows username has space. This booth is D:\\ vs /d/ script mismatch. Do not rebuild. Do not conflate.",
  },
  {
    issue: 79414,
    title: "plugin marketplace PATH POSIX-style",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — plugin marketplace PATH POSIX-style. This booth is the shared Edit/Write path-guard. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93987, title: "backup #93987", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "palilalia",
  "sallyport",
  "sepulchre",
  "anarthria",
  "wicket",
  "hasp",
  "ward",
  "veto",
  "interdict",
]);

export const SAMPLE_KIND_IDLE = "matched";
export const SAMPLE_KIND_SEEDED = "win-posix-mismatch";
export const SAMPLE_HOLDING_IDLE = "samepath";
export const SAMPLE_HOLDING_SEEDED = "prefix-fail";

export const SAMPLE_EQUATED_PROOF = Object.freeze({
  equated: true,
  allograph: false,
  winPosixMismatch: false,
  prefixFail: false,
  settingsLockout: false,
  scratchpadTemp: false,
  denyMessageOnly: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_ALLOGRAPH_PROOF = Object.freeze({
  equated: false,
  allograph: true,
  winPosixMismatch: true,
  prefixFail: true,
  settingsLockout: true,
  scratchpadTemp: true,
  denyMessageOnly: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds equated: paths compared after script unification would match" },
  { t: "punch", line: "tool_input.file_path arrives as D:\\Dropbox\\project\\doc.tex" },
  { t: "matrix", line: "hook shell $PWD is POSIX /d/Dropbox/project; $HOME is /c/Users/..." },
  { t: "path", line: "win-posix-mismatch — string prefix fails closed; settings.json lockout; scratchpad temp mismatch" },
  { t: "score", line: "when two allographs of one path are scored as different letters the booth is allograph — Score allograph or admit equated." },
]);

const FORCE_FLAGS = [
  "prefixFail",
  "settingsLockout",
  "scratchpadTemp",
  "denyMessageOnly",
  "winPosixMismatch",
  "failClosed",
];

/**
 * Unify a Windows or POSIX path into one slash-script for compare.
 * Educational model of the issue text — not a Claude Code patch.
 */
export function unifyScript(raw) {
  if (raw == null) return "";
  let path = String(raw).trim();
  if (!path) return "";
  path = path.replace(/^([A-Za-z]):[\\/]/, (_, drive) => `/${drive.toLowerCase()}/`);
  path = path.replace(/\\/g, "/");
  path = path.replace(/\/+/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

export function naivePrefixAllows(filePath, prefixes = []) {
  const file = String(filePath || "");
  return prefixes.some((prefix) => {
    const allow = String(prefix || "");
    if (!allow) return false;
    return file.startsWith(allow) || file.startsWith(allow.replace(/\/+$/, ""));
  });
}

export function scriptsWouldEquate(windowsPath, posixPath) {
  const punch = unifyScript(windowsPath).toLowerCase();
  const matrix = unifyScript(posixPath).toLowerCase();
  if (!punch || !matrix) return false;
  return (
    punch === matrix ||
    punch.startsWith(`${matrix}/`) ||
    matrix.startsWith(`${punch}/`)
  );
}

export function scorePair(pair = {}) {
  const windows = pair.windows || pair.filePath || pair.toolInput || "";
  const posix = pair.posix || pair.pwd || pair.home || pair.allow || "";
  const prefixes = Array.isArray(pair.prefixes)
    ? pair.prefixes
    : posix
      ? [posix, `${posix}/`, `${posix}/*`]
      : [];
  const naive = naivePrefixAllows(windows, prefixes);
  const unified = scriptsWouldEquate(windows, posix);
  return {
    windows,
    posix,
    naive,
    unified,
    equated: unified === true,
    allograph: naive === false && (Boolean(windows) || Boolean(posix)),
    mismatch: naive === false,
  };
}

/**
 * Foundry map: equated ledger vs allograph (two scripts, one grapheme).
 */
export function mapLedger(input = {}) {
  const allograph = isAllographInput(input);
  const equated = input.equated === true && !allograph;
  return {
    stamp: allograph ? "win-posix-mismatch" : "equated-ledger",
    holdingLane: allograph ? "prefix-fail" : "samepath",
    kindLane: allograph ? "win-posix-mismatch" : "matched",
    bindLane: allograph ? "settings-lockout" : "normalized",
    ribbon: allograph ? "allograph" : "equated",
    equated,
  };
}

export function inspectWindowsPath(input = {}) {
  const punched =
    Boolean(input.windowsPath) ||
    input.windowsPathPresent === true ||
    isAllographInput(input);
  return {
    stamp: punched ? "win-punch" : "win-idle",
    punched,
    note: punched
      ? "Windows punch — tool_input.file_path is D:\\... / C:\\..."
      : "",
  };
}

export function inspectPosixShell(input = {}) {
  const matrix =
    Boolean(input.posixPwd) ||
    input.posixShell === true ||
    isAllographInput(input);
  if (input.equated === true && !matrix) {
    return { stamp: "posix-idle", matrix: false };
  }
  return {
    stamp: matrix ? "posix-matrix" : "posix-idle",
    matrix,
    note: matrix
      ? "POSIX matrix — hook shell $PWD/$HOME are /d/... / /c/..."
      : "",
  };
}

export function inspectPrefix(input = {}) {
  const failed =
    input.prefixFail === true ||
    input.failClosed === true ||
    input.allograph === true ||
    isAllographInput(input);
  if (input.equated === true && !failed) {
    return { stamp: "prefix-equated", failed: false };
  }
  return {
    stamp: failed ? "prefix-fail" : "prefix-idle",
    failed,
    note: failed
      ? "string prefix of Windows path against POSIX $PWD fails closed"
      : "",
  };
}

export function inspectLockout(input = {}) {
  const locked =
    input.settingsLockout === true ||
    input.allograph === true ||
    isAllographInput(input);
  if (input.equated === true && !locked) {
    return { stamp: "settings-open", locked: false, edge: "normalized" };
  }
  return {
    stamp: locked ? "settings-lockout" : "settings-idle",
    locked,
    edge: locked ? "settings-lockout" : "normalized",
    note: locked
      ? "settings lockout — even .claude/settings.json is denied"
      : "",
  };
}

export function inspectScratchpad(input = {}) {
  const mismatched =
    input.scratchpadTemp === true ||
    input.allograph === true ||
    isAllographInput(input);
  if (input.equated === true && !mismatched) {
    return { stamp: "scratch-equated", mismatched: false };
  }
  return {
    stamp: mismatched ? "scratchpad-temp" : "scratch-idle",
    mismatched,
    note: mismatched
      ? "scratchpad temp — C:\\Users\\USER~1\\AppData\\Local\\Temp\\claude vs /tmp/claude"
      : "",
  };
}

export function inspectDeny(input = {}) {
  const only =
    input.denyMessageOnly === true ||
    input.allograph === true ||
    isAllographInput(input);
  if (input.equated === true && !only) {
    return { stamp: "deny-silent", only: false };
  }
  return {
    stamp: only ? "deny-message-only" : "deny-idle",
    only,
    note: only
      ? "only feedback is the hook deny message — looks like permissions"
      : "",
  };
}

export function inspectPath(input = {}) {
  const mismatched =
    input.winPosixMismatch === true ||
    input.allograph === true ||
    isAllographInput(input);
  if (input.equated === true && !mismatched) {
    return { stamp: "path-equated", mismatched: false };
  }
  return {
    stamp: mismatched ? "path-mismatch" : "path-idle",
    mismatched,
    note: mismatched
      ? "win-posix-mismatch — shared guard compares Windows tool_input to POSIX $PWD/$HOME"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "win-punch": input.windowsPathPresent || input.prefixFail,
    "posix-matrix": input.posixShell || input.winPosixMismatch,
    "prefix-fail": input.prefixFail,
    "settings-lockout": input.settingsLockout,
    "scratchpad-temp": input.scratchpadTemp,
    "win-posix-mismatch": input.winPosixMismatch,
  };
  return (
    map[id] === true ||
    input.winPosixMismatch === true ||
    input.allograph === true
  );
}

function isAllographInput(input = {}) {
  return (
    input.allograph === true ||
    input.winPosixMismatch === true ||
    input.prefixFail === true ||
    input.failClosed === true ||
    input.settingsLockout === true ||
    input.scratchpadTemp === true ||
    input.denyMessageOnly === true
  );
}

export function readBooth(input = {}) {
  const allograph = isAllographInput(input);
  const equated = input.equated === true && !allograph;
  return {
    mark: allograph ? "allograph" : "equated",
    equated,
    allograph,
    winPosixMismatch: input.winPosixMismatch === true || allograph,
    prefixFail: input.prefixFail === true,
    settingsLockout: input.settingsLockout === true,
    scratchpadTemp: input.scratchpadTemp === true,
    denyMessageOnly: input.denyMessageOnly === true,
    failClosed: input.failClosed === true,
    scope: mapLedger(input),
    windows: inspectWindowsPath(input),
    posix: inspectPosixShell(input),
    prefix: inspectPrefix(input),
    lockout: inspectLockout(input),
    scratchpad: inspectScratchpad(input),
    deny: inspectDeny(input),
    path: inspectPath(input),
    names: LEDGER_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const ALLOGRAPH_WALK = Object.freeze([
  {
    t: "idle",
    event: "ledger-equated",
    equated: true,
    allograph: false,
    cue: "equated",
    note: "idle HOLD: paths compared after script unification would match",
  },
  {
    t: "punch",
    event: "windows-path",
    allograph: true,
    prefixFail: true,
    cue: "allograph",
    note: "tool_input.file_path arrives as D:\\Dropbox\\project\\doc.tex",
  },
  {
    t: "matrix",
    event: "posix-shell",
    allograph: true,
    prefixFail: true,
    settingsLockout: true,
    cue: "allograph",
    note: "hook shell $PWD is /d/Dropbox/project; settings.json also denied",
  },
  {
    t: "path",
    event: "win-posix-mismatch",
    allograph: true,
    winPosixMismatch: true,
    prefixFail: true,
    settingsLockout: true,
    scratchpadTemp: true,
    cue: "allograph",
    note: "win-posix-mismatch — string prefix fails closed; scratchpad temp mismatches",
  },
  {
    t: "score",
    event: "allograph",
    allograph: true,
    winPosixMismatch: true,
    prefixFail: true,
    settingsLockout: true,
    scratchpadTemp: true,
    denyMessageOnly: true,
    failClosed: true,
    cue: "allograph",
    note: "allograph — two scripts of one path scored as different letters",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "ledger-equated",
    equated: true,
    allograph: false,
    cue: "equated",
    note: "positive control: after script unification the punch and matrix name the same grapheme",
  },
  {
    t: "admit",
    event: "ledger-equated",
    equated: true,
    cue: "equated",
    note: "positive control: the foundry admits equated",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    equated: true,
    allograph: false,
    winPosixMismatch: false,
    cue: "equated",
  };
}

export function seedEquated() {
  return { ...emptyTicket() };
}

export function seedAllograph() {
  return {
    seed: SEEDED_WORD,
    equated: false,
    allograph: true,
    winPosixMismatch: true,
    prefixFail: true,
    settingsLockout: true,
    scratchpadTemp: true,
    denyMessageOnly: true,
    failClosed: true,
    cue: "allograph",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ALLOGRAPH_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    allograph: true,
    winPosixMismatch: true,
    cue: "allograph",
  };
}

export function seedWinPosixMismatch() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    allograph: true,
    winPosixMismatch: true,
    event: "win-posix-mismatch",
    cue: "allograph",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    equated: true,
    cue: "equated",
  };
}

export function seedMatched() {
  return { seed: "matched", preferSeed: true, equated: true, cue: "equated" };
}

export function seedCongruent() {
  return { seed: "congruent", preferSeed: true, equated: true, cue: "equated" };
}

export function seedAligned() {
  return { seed: "aligned", preferSeed: true, equated: true, cue: "equated" };
}

export function seedNormalized() {
  return { seed: "normalized", preferSeed: true, equated: true, cue: "equated" };
}

export function seedSamepath() {
  return { seed: "samepath", preferSeed: true, equated: true, cue: "equated" };
}

export function seedSettingsLockout() {
  return {
    seed: "settings-lockout",
    preferSeed: true,
    settingsLockout: true,
    cue: "allograph",
  };
}

export function seedScratchpadTemp() {
  return {
    seed: "scratchpad-temp",
    preferSeed: true,
    scratchpadTemp: true,
    cue: "allograph",
  };
}

export function seedDenyMessageOnly() {
  return {
    seed: "deny-message-only",
    preferSeed: true,
    denyMessageOnly: true,
    cue: "allograph",
  };
}

export function seedPrefixFail() {
  return {
    seed: "prefix-fail",
    preferSeed: true,
    prefixFail: true,
    cue: "allograph",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      equated: false,
      allograph: false,
      winPosixMismatch: false,
      prefixFail: false,
      settingsLockout: false,
      scratchpadTemp: false,
      denyMessageOnly: false,
      failClosed: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    equated: raw.equated === true,
    allograph: raw.allograph === true || raw.event === "allograph",
    winPosixMismatch:
      raw.winPosixMismatch === true || raw.event === "win-posix-mismatch",
    prefixFail: raw.prefixFail === true || raw.event === "prefix-fail",
    settingsLockout:
      raw.settingsLockout === true || raw.event === "settings-lockout",
    scratchpadTemp:
      raw.scratchpadTemp === true || raw.event === "scratchpad-temp",
    denyMessageOnly:
      raw.denyMessageOnly === true || raw.event === "deny-message-only",
    failClosed: raw.failClosed === true || raw.event === "fail-closed",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
    windowsPath: raw.windowsPath,
    posixPwd: raw.posixPwd,
    windowsPathPresent: raw.windowsPathPresent === true,
    posixShell: raw.posixShell === true,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.equated != null ||
        ticket.allograph != null ||
        ticket.winPosixMismatch != null ||
        ticket.prefixFail != null ||
        ticket.settingsLockout != null ||
        ticket.scratchpadTemp != null ||
        ticket.denyMessageOnly != null ||
        ticket.failClosed != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isEquated(row) {
  if (row.allograph && row.cue !== "equated") return false;
  if (row.cue === "allograph" || row.cue === "win-posix-mismatch") return false;
  if (
    row.winPosixMismatch &&
    row.prefixFail &&
    row.cue !== "equated" &&
    row.equated !== true
  ) {
    return false;
  }
  if (
    row.equated === true &&
    row.allograph !== true &&
    row.cue !== "allograph"
  ) {
    return true;
  }
  if (
    row.cue === "equated" &&
    row.allograph !== true &&
    row.winPosixMismatch !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isWinPosixMismatch(row) {
  return (
    row.event === "win-posix-mismatch" &&
    !isEquated(row) &&
    (row.winPosixMismatch === true ||
      row.prefixFail === true ||
      row.allograph === true)
  );
}

function isAllographRow(row) {
  if (isEquated(row)) return false;
  if (isWinPosixMismatch(row) && row.cue !== "allograph") return false;
  if (row.cue === "allograph") return true;
  if (row.allograph === true) return true;
  if (row.winPosixMismatch === true && row.prefixFail === true) return true;
  if (
    row.winPosixMismatch === true ||
    row.prefixFail === true ||
    row.settingsLockout === true ||
    row.scratchpadTemp === true ||
    row.denyMessageOnly === true ||
    row.failClosed === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one allograph pass against the dual-script ledger.
 * equated: paths compared after script unification would match.
 * allograph: Windows tool_input vs POSIX $PWD treated as different letters.
 * win-posix-mismatch: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isWinPosixMismatch(row) ||
    (row.winPosixMismatch && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "win-posix-mismatch";
  } else if (isAllographRow(row)) {
    verdict = "allograph";
  } else if (isEquated(row)) {
    verdict = "equated";
  } else if (
    row.winPosixMismatch ||
    row.prefixFail ||
    row.settingsLockout ||
    row.scratchpadTemp ||
    row.denyMessageOnly ||
    row.failClosed
  ) {
    verdict = "allograph";
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
    equated: verdict === "equated" || verdict === "hold",
    allograph: verdict === "allograph" || verdict === SEEDED_WORD,
    winPosixMismatch:
      row.winPosixMismatch === true ||
      verdict === "win-posix-mismatch" ||
      verdict === PATH_WORD,
    prefixFail: row.prefixFail,
    settingsLockout: row.settingsLockout,
    scratchpadTemp: row.scratchpadTemp,
    denyMessageOnly: row.denyMessageOnly,
    failClosed: row.failClosed,
    cue: hold
      ? "equated"
      : row.winPosixMismatch || verdict === "win-posix-mismatch"
        ? "win-posix-mismatch"
        : "allograph",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit equated" : "score allograph",
    windowsInspect: inspectWindowsPath(row),
    posixInspect: inspectPosixShell(row),
    prefixInspect: inspectPrefix(row),
    lockoutInspect: inspectLockout(row),
    scratchpadInspect: inspectScratchpad(row),
    denyInspect: inspectDeny(row),
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
      : ALLOGRAPH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "allograph");
  const path = scored.filter((row) => row.verdict === "win-posix-mismatch");
  const equated = scored.filter((row) => row.verdict === "equated");
  const headline =
    scored.find((row) => row.event === "allograph") ||
    scored.find((row) => row.event === "win-posix-mismatch") ||
    scored.find((row) => row.event === "prefix-fail") ||
    charged[charged.length - 1];
  let verdict = "equated";
  if (charged.length) verdict = "allograph";
  else if (path.length && !equated.length) {
    verdict = "win-posix-mismatch";
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
    allographCount: charged.length,
    pathCount: path.length,
    equatedCount: equated.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit equated" : "score allograph",
    note: headline
      ? "Windows+Git Bash path-guard compares Windows tool_input to POSIX $PWD/$HOME. Cousins cite-only: #89392 #88578 #90122 #93356 #79414 — do not rebuild, do not conflate."
      : "published allograph walk scored against equated vs allograph",
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
    seeded !== "equated" &&
    seeded !== "allograph" &&
    seeded !== "win-posix-mismatch" &&
    ticket.equated == null &&
    ticket.allograph == null &&
    ticket.winPosixMismatch == null &&
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
    equated: scored.equated ?? false,
    allograph: scored.allograph ?? false,
    winPosixMismatch: scored.winPosixMismatch ?? false,
    prefixFail: scored.prefixFail ?? false,
    settingsLockout: scored.settingsLockout ?? false,
    scratchpadTemp: scored.scratchpadTemp ?? false,
    denyMessageOnly: scored.denyMessageOnly ?? false,
    failClosed: scored.failClosed ?? false,
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
    result.prefixFail || result.allograph
      ? "kind=win-posix-mismatch"
      : "kind=matched",
    result.settingsLockout || result.allograph
      ? "ref=prefix-fail"
      : "ref=samepath",
    result.winPosixMismatch || result.verdict === "win-posix-mismatch"
      ? "path=win-posix-mismatch"
      : "path=equated",
    result.cue === "equated"
      ? "cue=equated"
      : result.cue === "win-posix-mismatch"
        ? "cue=win-posix-mismatch"
        : "cue=allograph",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    equated: result.equated,
    allograph: result.allograph,
    winPosixMismatch: result.winPosixMismatch,
    prefixFail: result.prefixFail,
    settingsLockout: result.settingsLockout,
    scratchpadTemp: result.scratchpadTemp,
    denyMessageOnly: result.denyMessageOnly,
    failClosed: result.failClosed,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    windows: inspectWindowsPath({
      equated: result.equated,
      allograph: result.allograph,
      windowsPathPresent: true,
    }),
    posix: inspectPosixShell({
      equated: result.equated,
      allograph: result.allograph,
      posixShell: true,
    }),
    prefix: inspectPrefix({
      equated: result.equated,
      allograph: result.allograph,
      prefixFail: result.prefixFail,
    }),
    lockout: inspectLockout({
      equated: result.equated,
      allograph: result.allograph,
      settingsLockout: result.settingsLockout,
    }),
    scratchpad: inspectScratchpad({
      equated: result.equated,
      allograph: result.allograph,
      scratchpadTemp: result.scratchpadTemp,
    }),
    deny: inspectDeny({
      equated: result.equated,
      allograph: result.allograph,
      denyMessageOnly: result.denyMessageOnly,
    }),
    path: inspectPath({
      equated: result.equated,
      allograph: result.allograph,
      winPosixMismatch: result.winPosixMismatch,
    }),
    scope: mapLedger({
      equated: result.equated,
      allograph: result.allograph,
      winPosixMismatch: result.winPosixMismatch,
      prefixFail: result.prefixFail,
      settingsLockout: result.settingsLockout,
      scratchpadTemp: result.scratchpadTemp,
      denyMessageOnly: result.denyMessageOnly,
      failClosed: result.failClosed,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      allograph: result.allograph === true || result.verdict === "allograph",
    })),
    pairs: PATH_PAIRS.map((row) => ({ ...row, ...scorePair(row) })),
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
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      pairs: PATH_PAIRS,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the shared path-guard compares Windows tool_input.file_path to POSIX $PWD/$HOME by string prefix and fails closed. Invite verify against #94256 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
