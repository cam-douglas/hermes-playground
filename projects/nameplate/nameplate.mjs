#!/usr/bin/env node
/**
 * Nameplate — brass nameplate / hotel door-plate booth.
 * A *nameplate* is the engraved brass plate on a hotel door.
 * The guest writes a new name; the plate shows it for one
 * frame, then snaps back to the old engraving. The front-desk
 * ledger already recorded the new name — reload the window
 * and the plate is correct. List-rename (the corridor
 * directory) works. Only the header plate rolls back.
 * Mahogany door / brass plate / plate cream / verdigris
 * hinge. NOT a lacquer nesting doll (Matryoshka). NOT a
 * night blotter (Dragnet). NOT an enrollment desk
 * (Matricula). NOT a type-foundry (Allograph). NOT a
 * neurology writing-desk (Agraphia). NOT a
 * gauntlet/lictor/lychgate/ouster/proscription booth.
 *
 * Educational diagnostic model for a published Claude Code
 * VS Code header-rename defect: renaming a session from the
 * Claude view chat header shows the new name for one frame,
 * then reverts. Renaming from the activity-bar session list
 * works. The title IS persisted — reload the window and the
 * new name is there. Only the header view rolls back.
 * Version noted: VS Code extension 2.1.270 (CLI 2.1.238);
 * last working 2.1.267. Regression.
 *
 * Encoded from anthropics/claude-code#94349 issue text only.
 * Hypothesis (NON-BINDING — reporter hypothesis / issue text):
 * Comm.renameSessionOnCli calls query.renameSession(Q,$) but
 * renameSession does not exist on the SDK query class. The
 * call throws a synchronous TypeError, so .catch(X) never
 * attaches — the throw escapes Comm.renameSession,
 * handleRequest returns {type:"error"}, and the webview
 * store's renameBaseline rollback restores the old title.
 * Header rename originates from the comm that owns the
 * session's live CLI channel (throws). List rename originates
 * from a comm with no channel; fan-out echo adopts the title
 * before the throwing call; adoptPersistedTitle early-returns
 * when summary already equals the new title, so echo cannot
 * repair the header path. Invite verify against issue text
 * only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a Claude Code fix.
 * No network. No exploits. No live Claude.
 *
 *   node nameplate.mjs data/nameplate.json
 *   echo '{"seed":"nameplate"}' | node nameplate.mjs
 *
 * Idle word is affixed (HOLD: header rename sticks; plate
 * keeps the new engraving; no TypeError rollback).
 * HOLD aliases: engraved, hung, plated, labeled, titled.
 * Seeded word is nameplate (#94349 path).
 * Path word is header-rename.
 * Product score word is nameplate (Score nameplate or admit affixed.).
 *
 * NOT Matryoshka/#94350. NOT Dragnet/#94064. NOT Matricula/#93987.
 * NOT Allograph/#94256. NOT Agraphia/#94251. NOT Gauntlet/#94029.
 * NOT Lictor/#94053. NOT Lychgate/#94059. NOT Ouster/#94221.
 * NOT Proscription/#94202. NOT Frisket. NOT Scant. NOT Titulus.
 * NOT Palinode. NOT Epitaph. NOT Escutcheon. NOT #94336.
 * No close cousins named in the #94349 issue text.
 * Cite-only related rename/session-title issues (search, not
 * named in #94349): #94017 #94257 #94285 #88992. Closed
 * backups from those texts: #40787 #46587 #65010.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "affixed",
  "nameplate",
  "header-rename",
  "hold",
  "engraved",
  "hung",
  "plated",
  "labeled",
  "titled",
  "typeerror-escape",
  "rename-baseline-rollback",
  "list-rename-ok",
  "persisted-on-reload",
  "header-one-frame",
  "live-channel",
  "adopt-persisted",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "affixed";
export const PATH_WORD = "header-rename";
export const SEEDED_WORD = "nameplate";
export const PRODUCT_WORD = "nameplate";
export const HOLD = Object.freeze(["affixed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "engraved",
  "hung",
  "plated",
  "labeled",
  "titled",
]);
export const RECOVER = Object.freeze(["affixed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "equated",
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
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
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
  "escheated",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94349;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94349";
export const TITLE =
  "[BUG] [VS Code] Renaming a session from the chat header reverts instantly (2.1.270 regression)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:ide",
  "platform:vscode",
  "regression",
]);
export const PLATFORM = "windows";
export const SURFACE = "header-rename";
export const HOST = "VS Code extension 2.1.270 (CLI: 2.1.238)";
export const CHECKED_ON =
  "Published repro: open a session in the Claude sidebar view and send one message so a CLI process is attached; click the session title in the view header, type a new name, press Enter — header reverts immediately; activity-bar list rename keeps the new name; reload the window and the persisted name is there";
export const BUILD = "VS Code extension 2.1.270 (CLI: 2.1.238)";
export const SELECTED_MODEL = "n/a — session-title rename, not a model defect";
export const OS = "Windows; platform:windows / platform:vscode / area:ide";
export const PHRASE = "Score nameplate or admit affixed.";
export const DISTRIBUTION =
  "Renaming a session from the title in the Claude view header shows the new name for one frame, then reverts. Renaming the same session from the activity-bar session list works. The title is persisted — reload the window and the new name is there. Only the header view rolls back. Reporter hypothesis (issue text, NON-BINDING): Comm.renameSessionOnCli calls query.renameSession(Q,$) but renameSession does not exist on the SDK query class. The call throws a synchronous TypeError, so .catch(X) never attaches — the throw escapes Comm.renameSession, handleRequest returns {type:\"error\"}, and the webview store's renameBaseline rollback restores the old title. Header rename originates from the comm that owns the session's live CLI channel (throws). List rename originates from a comm with no channel; fan-out echo adopts the title before the throwing call; adoptPersistedTitle early-returns when summary already equals the new title, so echo cannot repair the header path. Last working 2.1.267: renameSessionOnCli appears 0 times; renameSession occurrences in extension.js go from 6 (2.1.267) to 13 (2.1.270). Output channel: TypeError: J.query.renameSession is not a function; trailing update_session_state carries the OLD title.";

export const MISSING_RENAME =
  "TypeError: J.query.renameSession is not a function";
export const HANDLE_ERROR = Object.freeze({ type: "error" });
export const LAST_WORKING = "2.1.267";
export const BUILD_VERSION = "2.1.270";
export const CLI_VERSION = "2.1.238";

export const PLATE_NAMES = Object.freeze([
  {
    id: "header-plate",
    lost: "Header plate — Claude view header shows the new engraving for one frame, then snaps back",
    control: "The header plate would keep the new engraving",
    story: "the brass door-plate flickers the new name then restores the old cut",
  },
  {
    id: "front-desk",
    lost: "Front-desk ledger — the title IS persisted; reload the window and the new name is there",
    control: "Ledger and plate would agree without a reload",
    story: "the night clerk already wrote the new name in the book",
  },
  {
    id: "activity-list",
    lost: "Corridor directory — renaming from the activity-bar session list works",
    control: "List and header would both keep the new name",
    story: "the hanging room directory accepts the new card",
  },
  {
    id: "typeerror-escape",
    lost: "TypeError escape — query.renameSession is missing; sync throw escapes before .catch",
    control: "A missing method would not throw past the catch",
    story: "the plate screws shear before the catch-hook can hang",
  },
  {
    id: "rename-baseline",
    lost: "renameBaseline rollback — handleRequest returns {type:\"error\"}; store restores the old title",
    control: "A persisted rename would not roll the header back",
    story: "the old engraving is pressed back onto the brass",
  },
  {
    id: "live-channel",
    lost: "Live-channel comm — header rename originates from the comm that owns the session CLI channel",
    control: "The channel-owning comm would not throw on its own rename",
    story: "the door that owns the key is the one that snaps the plate",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "header-plate",
    survey: "Claude view header title; one-frame new name then revert",
    kind: "affixed",
    note: "idle/control: header rename sticks — the hold/good path",
  },
  {
    id: "front-desk",
    survey: "title is persisted; reload the window and the new name is there",
    kind: "nameplate",
    note: "seeded: ledger already wrote the new name",
  },
  {
    id: "activity-list",
    survey: "activity-bar session list rename keeps the new name",
    kind: "nameplate",
    note: "seeded: list path works; no live channel",
  },
  {
    id: "typeerror-escape",
    survey: "TypeError: J.query.renameSession is not a function — sync; .catch never attaches",
    kind: "nameplate",
    note: "seeded: missing renameSession on the SDK query class",
  },
  {
    id: "rename-baseline",
    survey: "handleRequest {type:\"error\"}; renameBaseline restores the old title",
    kind: "nameplate",
    note: "seeded: header-only rollback",
  },
  {
    id: "live-channel",
    survey: "header-rename — comm that owns the live CLI channel throws; list comm has no channel",
    kind: "nameplate",
    note: "path: header-rename names the header-only snap-back",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "header-one-frame",
    label: "header one frame",
    count: "new name then revert",
    note: "Header shows the new title for one frame, then rolls back",
  },
  {
    id: "typeerror-escape",
    label: "TypeError escape",
    count: "renameSession missing",
    note: "Sync TypeError escapes before .catch attaches",
  },
  {
    id: "rename-baseline-rollback",
    label: "renameBaseline rollback",
    count: '{type:"error"}',
    note: "Webview store restores the old title",
  },
  {
    id: "list-rename-ok",
    label: "list rename ok",
    count: "activity-bar works",
    note: "List rename keeps the new name",
  },
  {
    id: "persisted-on-reload",
    label: "persisted on reload",
    count: "ledger already wrote",
    note: "Reload the window and the new name is there",
  },
  {
    id: "header-rename",
    label: "header-rename",
    count: "live-channel comm throws",
    note: "Path: only the header view rolls back",
  },
]);

export const RULED_OUT = Object.freeze([
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
  "Titulus / Palinode / Epitaph / Escutcheon — different catalog paradigms; NOT this booth",
  "#94336 — between-tool text mistyped as thinking; Agraphia cousin — cite-only; do not ship",
  "#94017 — renamed sessions revert to the auto-generated title (ai-title rewritten) — cite-only cousin, DIFFERENT mechanism",
  "#94257 — renaming a session tab reverts to old name on Enter — cite-only cousin, less detail",
  "#94285 — live session tabs ignore the saved custom title and show the AI title — cite-only cousin, DIFFERENT",
  "#88992 — sidebar pencil rename doesn't sync with /rename — cite-only cousin, DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "The header shows the new title, matching what was persisted and what the activity-bar session list shows",
  "A header rename must not roll back after one frame when the title is already persisted",
  "query.renameSession missing on the SDK query class must not throw a synchronous TypeError past .catch",
  "handleRequest must not return {type:\"error\"} for a rename that already wrote the ledger",
  "renameBaseline must not restore the old title when the new name is persisted",
  "List rename remaining working is the published positive control — not this defect",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "header-rename",
  "nameplate",
  "typeerror-escape",
  "rename-baseline-rollback",
  "header-one-frame",
  "list-rename-ok",
]);

export const COUSINS = Object.freeze([
  {
    issue: 94017,
    title: "VS Code extension: renamed sessions revert to the auto-generated title",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — not named in #94349. ai-title rewritten after custom-title. DIFFERENT mechanism. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94257,
    title: "VS Code extension: renaming a session tab reverts to old name on Enter",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — not named in #94349. Similar snap-back symptom, no TypeError / renameSession analysis. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94285,
    title: "live session tabs ignore the saved custom title and show the AI title",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — not named in #94349. Live tab shows AI title while custom-title is on disk. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 88992,
    title: "sidebar pencil rename doesn't sync with /rename / cross-session messaging name",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — not named in #94349. Sync mismatch, not header TypeError rollback. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "Remote Control slows local session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "Shift+PageUp Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94348, title: "Desktop Auto permission prompt never renders", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94336, title: "between-tool text mistyped as thinking", state: "OPEN", citeOnly: true, why: "Cite only — Agraphia cousin — do not ship. Do not auto-pick." },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export const SAMPLE_KIND_IDLE = "titled";
export const SAMPLE_KIND_SEEDED = "header-rename";
export const SAMPLE_HOLDING_IDLE = "engraved";
export const SAMPLE_HOLDING_SEEDED = "typeerror-escape";

export const SAMPLE_AFFIXED_PROOF = Object.freeze({
  affixed: true,
  nameplate: false,
  headerRename: false,
  typeErrorEscape: false,
  renameBaselineRollback: false,
  headerOneFrame: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_NAMEPLATE_PROOF = Object.freeze({
  affixed: false,
  nameplate: true,
  headerRename: true,
  typeErrorEscape: true,
  renameBaselineRollback: true,
  headerOneFrame: true,
  listRenameOk: true,
  persistedOnReload: true,
  liveChannel: true,
  kind: SAMPLE_KIND_SEEDED,
  names: PLATE_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds affixed: header rename sticks; plate keeps the new engraving; no TypeError rollback" },
  { t: "header", line: "header rename from the comm that owns the live CLI channel" },
  { t: "throw", line: "query.renameSession is not a function — sync TypeError; .catch never attaches" },
  { t: "path", line: "header-rename — handleRequest {type:\"error\"}; renameBaseline restores the old title; ledger already persisted" },
  { t: "score", line: "when the brass plate snaps back while the front desk already wrote the new name the booth is nameplate — Score nameplate or admit affixed." },
]);

const FORCE_FLAGS = [
  "typeErrorEscape",
  "renameBaselineRollback",
  "headerOneFrame",
  "headerRename",
  "liveChannel",
  "listRenameOk",
  "persistedOnReload",
];

const ISSUE_CUE_RE =
  /94349|renameSession|renameBaseline|header.?rename|one frame|TypeError|activity-bar|2\.1\.270/i;

/**
 * Educational header-rename compare. Not a Claude Code patch.
 * Encodes only the published #94349 shapes.
 * affixed=true is the HOLD / plate-sticks path.
 */
export function renameSessionOnCli({
  channelOnSession = false,
  renameSessionExists = false,
  affixed = false,
} = {}) {
  if (affixed === true) {
    return {
      threw: false,
      caught: false,
      persisted: true,
      rollback: false,
      headerSticks: true,
      error: null,
      handleRequest: { type: "ok" },
      phrase: "admit affixed",
    };
  }
  if (channelOnSession && !renameSessionExists) {
    return {
      threw: true,
      caught: false,
      persisted: true,
      rollback: true,
      headerSticks: false,
      headerOneFrame: true,
      error: MISSING_RENAME,
      handleRequest: { ...HANDLE_ERROR },
      phrase: "score nameplate",
    };
  }
  return {
    threw: false,
    caught: false,
    persisted: true,
    rollback: false,
    headerSticks: true,
    listRenameOk: true,
    error: null,
    handleRequest: { type: "ok" },
    phrase: "admit affixed",
  };
}

export function adoptPersistedTitle({ summary, newTitle } = {}) {
  const same =
    summary != null &&
    newTitle != null &&
    String(summary) === String(newTitle);
  return {
    earlyReturn: same,
    adopted: !same,
    summary: same ? summary : newTitle,
  };
}

export function scoreHeaderRename(input = {}) {
  const origin =
    input.origin ||
    (input.headerRename || input.headerOneFrame ? "header" : null) ||
    (input.listRename || input.listRenameOk && input.nameplate !== true && input.headerRename !== true
      ? "list"
      : null);
  const affixedHold = input.affixed === true && input.nameplate !== true;
  const hasChannel =
    input.hasLiveChannel === true ||
    input.liveChannel === true ||
    origin === "header";
  const exists = input.renameSessionExists === true;
  const cli = renameSessionOnCli({
    channelOnSession: hasChannel && origin !== "list" && !affixedHold,
    renameSessionExists: exists,
    affixed: affixedHold,
  });
  const echo = adoptPersistedTitle({
    summary: input.summary,
    newTitle: input.newTitle,
  });
  const nameplate =
    !affixedHold &&
    (cli.threw === true ||
      input.nameplate === true ||
      input.headerRename === true ||
      input.typeErrorEscape === true ||
      origin === "header");
  return {
    origin: origin || (nameplate ? "header" : "idle"),
    affixed: !nameplate,
    nameplate,
    headerRename: nameplate,
    typeErrorEscape: cli.threw === true,
    renameBaselineRollback: cli.rollback === true,
    headerOneFrame: cli.headerOneFrame === true || (nameplate && origin === "header"),
    listRenameOk: origin === "list" || input.listRenameOk === true || !nameplate,
    persistedOnReload: cli.persisted === true,
    liveChannel: hasChannel && origin !== "list",
    adoptPersisted: echo,
    cli,
    error: cli.error,
    phrase: nameplate ? "score nameplate" : "admit affixed",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94349") return true;
  if (input.error === MISSING_RENAME) return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapPlate(input = {}) {
  const nameplate = isNameplateInput(input);
  const affixed = input.affixed === true && !nameplate;
  return {
    stamp: nameplate ? "header-rename" : "affixed-plate",
    holdingLane: nameplate ? "typeerror-escape" : "engraved",
    kindLane: nameplate ? "header-rename" : "titled",
    bindLane: nameplate ? "rename-baseline-rollback" : "plated",
    ribbon: nameplate ? "nameplate" : "affixed",
    affixed,
  };
}

export function inspectHeader(input = {}) {
  const snapped =
    input.headerOneFrame === true ||
    input.headerRename === true ||
    input.nameplate === true ||
    isNameplateInput(input);
  if (input.affixed === true && !snapped) {
    return { stamp: "plate-affixed", snapped: false, note: "header plate keeps the new engraving" };
  }
  return {
    stamp: snapped ? "header-plate" : "header-idle",
    snapped,
    note: snapped
      ? "header plate — new engraving for one frame, then snaps back"
      : "",
  };
}

export function inspectLedger(input = {}) {
  const persisted =
    input.persistedOnReload === true ||
    input.nameplate === true ||
    isNameplateInput(input);
  if (input.affixed === true && !persisted) {
    return { stamp: "ledger-idle", persisted: false };
  }
  return {
    stamp: persisted ? "front-desk" : "ledger-idle",
    persisted: persisted || input.affixed === true,
    note: persisted
      ? "front-desk ledger — title is persisted; reload shows the new name"
      : "",
  };
}

export function inspectList(input = {}) {
  const ok =
    input.listRenameOk === true ||
    input.nameplate === true ||
    isNameplateInput(input);
  if (input.affixed === true && !ok) {
    return { stamp: "list-idle", ok: false };
  }
  return {
    stamp: ok ? "activity-list" : "list-idle",
    ok: ok || input.affixed === true,
    note: ok
      ? "activity-list — list rename keeps the new name"
      : "",
  };
}

export function inspectThrow(input = {}) {
  const escaped =
    input.typeErrorEscape === true ||
    input.nameplate === true ||
    isNameplateInput(input);
  if (input.affixed === true && !escaped) {
    return { stamp: "throw-quiet", escaped: false };
  }
  return {
    stamp: escaped ? "typeerror-escape" : "throw-idle",
    escaped,
    note: escaped
      ? "TypeError escape — query.renameSession is not a function; .catch never attaches"
      : "",
  };
}

export function inspectRollback(input = {}) {
  const rolled =
    input.renameBaselineRollback === true ||
    input.nameplate === true ||
    isNameplateInput(input);
  if (input.affixed === true && !rolled) {
    return { stamp: "baseline-idle", rolled: false };
  }
  return {
    stamp: rolled ? "rename-baseline" : "baseline-idle",
    rolled,
    note: rolled
      ? "renameBaseline rollback — handleRequest {type:\"error\"}; old title restored"
      : "",
  };
}

export function inspectChannel(input = {}) {
  const live =
    input.liveChannel === true ||
    input.headerRename === true ||
    input.nameplate === true ||
    isNameplateInput(input);
  if (input.affixed === true && !live) {
    return { stamp: "channel-idle", live: false };
  }
  return {
    stamp: live ? "live-channel" : "channel-idle",
    live,
    note: live
      ? "live-channel — header rename originates from the comm that owns the CLI channel"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "header-plate": input.headerOneFrame || input.headerRename,
    "front-desk": input.persistedOnReload,
    "activity-list": input.listRenameOk,
    "typeerror-escape": input.typeErrorEscape,
    "rename-baseline": input.renameBaselineRollback,
    "live-channel": input.liveChannel || input.headerRename,
  };
  return (
    map[id] === true ||
    input.headerRename === true ||
    input.nameplate === true
  );
}

function isNameplateInput(input = {}) {
  return (
    input.nameplate === true ||
    input.headerRename === true ||
    input.typeErrorEscape === true ||
    input.renameBaselineRollback === true ||
    input.headerOneFrame === true ||
    input.liveChannel === true ||
    input.origin === "header" ||
    input.error === MISSING_RENAME
  );
}

export function readBooth(input = {}) {
  const nameplate = isNameplateInput(input);
  const affixed = input.affixed === true && !nameplate;
  return {
    mark: nameplate ? "nameplate" : "affixed",
    affixed,
    nameplate,
    headerRename: input.headerRename === true || nameplate,
    typeErrorEscape: input.typeErrorEscape === true,
    renameBaselineRollback: input.renameBaselineRollback === true,
    headerOneFrame: input.headerOneFrame === true,
    listRenameOk: input.listRenameOk === true,
    persistedOnReload: input.persistedOnReload === true,
    liveChannel: input.liveChannel === true,
    plate: mapPlate(input),
    header: inspectHeader(input),
    ledger: inspectLedger(input),
    list: inspectList(input),
    thrown: inspectThrow(input),
    rollback: inspectRollback(input),
    channel: inspectChannel(input),
    names: PLATE_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const NAMEPLATE_WALK = Object.freeze([
  {
    t: "idle",
    event: "plate-affixed",
    affixed: true,
    nameplate: false,
    cue: "affixed",
    note: "idle HOLD: header rename sticks; plate keeps the new engraving; no TypeError rollback",
  },
  {
    t: "header",
    event: "header-rename",
    nameplate: true,
    headerRename: true,
    liveChannel: true,
    cue: "nameplate",
    note: "header rename from the comm that owns the live CLI channel",
  },
  {
    t: "throw",
    event: "typeerror-escape",
    nameplate: true,
    typeErrorEscape: true,
    headerRename: true,
    cue: "nameplate",
    note: "query.renameSession is not a function — sync TypeError; .catch never attaches",
  },
  {
    t: "path",
    event: "header-rename",
    nameplate: true,
    headerRename: true,
    typeErrorEscape: true,
    renameBaselineRollback: true,
    headerOneFrame: true,
    persistedOnReload: true,
    cue: "nameplate",
    note: "header-rename — handleRequest {type:\"error\"}; renameBaseline restores the old title",
  },
  {
    t: "score",
    event: "nameplate",
    nameplate: true,
    headerRename: true,
    typeErrorEscape: true,
    renameBaselineRollback: true,
    headerOneFrame: true,
    listRenameOk: true,
    persistedOnReload: true,
    liveChannel: true,
    cue: "nameplate",
    note: "nameplate — the brass plate snaps back while the front desk already wrote the new name",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "plate-affixed",
    affixed: true,
    nameplate: false,
    cue: "affixed",
    note: "positive control: header rename sticks; plate keeps the new engraving",
  },
  {
    t: "admit",
    event: "plate-affixed",
    affixed: true,
    cue: "affixed",
    note: "positive control: the corridor admits affixed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    affixed: true,
    nameplate: false,
    headerRename: false,
    cue: "affixed",
  };
}

export function seedAffixed() {
  return { ...emptyTicket() };
}

export function seedNameplate() {
  return {
    seed: SEEDED_WORD,
    affixed: false,
    nameplate: true,
    headerRename: true,
    typeErrorEscape: true,
    renameBaselineRollback: true,
    headerOneFrame: true,
    listRenameOk: true,
    persistedOnReload: true,
    liveChannel: true,
    cue: "nameplate",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_NAMEPLATE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    nameplate: true,
    headerRename: true,
    cue: "nameplate",
  };
}

export function seedHeaderRename() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    nameplate: true,
    headerRename: true,
    event: "header-rename",
    cue: "nameplate",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    affixed: true,
    cue: "affixed",
  };
}

export function seedEngraved() {
  return { seed: "engraved", preferSeed: true, affixed: true, cue: "affixed" };
}

export function seedHung() {
  return { seed: "hung", preferSeed: true, affixed: true, cue: "affixed" };
}

export function seedPlated() {
  return { seed: "plated", preferSeed: true, affixed: true, cue: "affixed" };
}

export function seedLabeled() {
  return { seed: "labeled", preferSeed: true, affixed: true, cue: "affixed" };
}

export function seedTitled() {
  return { seed: "titled", preferSeed: true, affixed: true, cue: "affixed" };
}

export function seedTypeerrorEscape() {
  return {
    seed: "typeerror-escape",
    preferSeed: true,
    typeErrorEscape: true,
    cue: "nameplate",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      affixed: false,
      nameplate: false,
      headerRename: false,
      typeErrorEscape: false,
      renameBaselineRollback: false,
      headerOneFrame: false,
      listRenameOk: false,
      persistedOnReload: false,
      liveChannel: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    affixed: raw.affixed === true,
    nameplate: raw.nameplate === true || raw.event === "nameplate",
    headerRename:
      raw.headerRename === true || raw.event === "header-rename",
    typeErrorEscape:
      raw.typeErrorEscape === true || raw.event === "typeerror-escape",
    renameBaselineRollback:
      raw.renameBaselineRollback === true ||
      raw.event === "rename-baseline-rollback",
    headerOneFrame:
      raw.headerOneFrame === true || raw.event === "header-one-frame",
    listRenameOk:
      raw.listRenameOk === true || raw.event === "list-rename-ok",
    persistedOnReload:
      raw.persistedOnReload === true || raw.event === "persisted-on-reload",
    liveChannel:
      raw.liveChannel === true || raw.event === "live-channel",
    origin: raw.origin,
    error: raw.error,
    summary: raw.summary,
    newTitle: raw.newTitle,
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
      (ticket.affixed != null ||
        ticket.nameplate != null ||
        ticket.headerRename != null ||
        ticket.typeErrorEscape != null ||
        ticket.renameBaselineRollback != null ||
        ticket.headerOneFrame != null ||
        ticket.listRenameOk != null ||
        ticket.persistedOnReload != null ||
        ticket.liveChannel != null ||
        ticket.origin != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isAffixed(row) {
  if (row.nameplate && row.cue !== "affixed") return false;
  if (row.cue === "nameplate" || row.cue === "header-rename") return false;
  if (
    row.headerRename &&
    row.typeErrorEscape &&
    row.cue !== "affixed" &&
    row.affixed !== true
  ) {
    return false;
  }
  if (
    row.affixed === true &&
    row.nameplate !== true &&
    row.cue !== "nameplate"
  ) {
    return true;
  }
  if (
    row.cue === "affixed" &&
    row.nameplate !== true &&
    row.headerRename !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isHeaderRename(row) {
  return (
    row.event === "header-rename" &&
    !isAffixed(row) &&
    (row.headerRename === true ||
      row.typeErrorEscape === true ||
      row.nameplate === true)
  );
}

function isNameplateRow(row) {
  if (isAffixed(row)) return false;
  if (isHeaderRename(row) && row.cue !== "nameplate") return false;
  if (row.cue === "nameplate") return true;
  if (row.nameplate === true) return true;
  if (row.headerRename === true && row.typeErrorEscape === true) return true;
  if (
    row.headerRename === true ||
    row.typeErrorEscape === true ||
    row.renameBaselineRollback === true ||
    row.headerOneFrame === true ||
    row.liveChannel === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one nameplate pass against the hotel door-plate.
 * affixed: header rename sticks; plate keeps the new engraving.
 * nameplate: header snaps back after one frame; TypeError escapes.
 * header-rename: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHeaderRename(row) ||
    (row.headerRename && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "header-rename";
  } else if (isNameplateRow(row)) {
    verdict = "nameplate";
  } else if (isAffixed(row)) {
    verdict = "affixed";
  } else if (
    row.headerRename ||
    row.typeErrorEscape ||
    row.renameBaselineRollback ||
    row.headerOneFrame ||
    row.liveChannel
  ) {
    verdict = "nameplate";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "nameplate";
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
    affixed: verdict === "affixed" || verdict === "hold",
    nameplate: verdict === "nameplate" || verdict === SEEDED_WORD,
    headerRename:
      row.headerRename === true ||
      verdict === "header-rename" ||
      verdict === PATH_WORD,
    typeErrorEscape: row.typeErrorEscape,
    renameBaselineRollback: row.renameBaselineRollback,
    headerOneFrame: row.headerOneFrame,
    listRenameOk: row.listRenameOk,
    persistedOnReload: row.persistedOnReload,
    liveChannel: row.liveChannel,
    cue: hold
      ? "affixed"
      : row.headerRename || verdict === "header-rename"
        ? "header-rename"
        : "nameplate",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit affixed" : "score nameplate",
    headerInspect: inspectHeader(row),
    ledgerInspect: inspectLedger(row),
    listInspect: inspectList(row),
    throwInspect: inspectThrow(row),
    rollbackInspect: inspectRollback(row),
    channelInspect: inspectChannel(row),
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
      : NAMEPLATE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "nameplate");
  const path = scored.filter((row) => row.verdict === "header-rename");
  const affixed = scored.filter((row) => row.verdict === "affixed");
  const headline =
    scored.find((row) => row.event === "nameplate") ||
    scored.find((row) => row.event === "header-rename") ||
    scored.find((row) => row.event === "typeerror-escape") ||
    charged[charged.length - 1];
  let verdict = "affixed";
  if (charged.length) verdict = "nameplate";
  else if (path.length && !affixed.length) {
    verdict = "header-rename";
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
    nameplateCount: charged.length,
    pathCount: path.length,
    affixedCount: affixed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit affixed" : "score nameplate",
    note: headline
      ? "VS Code header rename shows the new session title for one frame then reverts because query.renameSession is missing on the SDK query class (sync TypeError escapes before .catch; renameBaseline rolls back) while the title is already persisted and list-rename works. No close cousins named in #94349."
      : "published nameplate walk scored against affixed vs nameplate",
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
    seeded !== "affixed" &&
    seeded !== "nameplate" &&
    seeded !== "header-rename" &&
    ticket.affixed == null &&
    ticket.nameplate == null &&
    ticket.headerRename == null &&
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
    affixed: scored.affixed ?? false,
    nameplate: scored.nameplate ?? false,
    headerRename: scored.headerRename ?? false,
    typeErrorEscape: scored.typeErrorEscape ?? false,
    renameBaselineRollback: scored.renameBaselineRollback ?? false,
    headerOneFrame: scored.headerOneFrame ?? false,
    listRenameOk: scored.listRenameOk ?? false,
    persistedOnReload: scored.persistedOnReload ?? false,
    liveChannel: scored.liveChannel ?? false,
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
    result.typeErrorEscape || result.nameplate
      ? "kind=header-rename"
      : "kind=titled",
    result.renameBaselineRollback || result.nameplate
      ? "ref=rename-baseline-rollback"
      : "ref=engraved",
    result.headerRename || result.verdict === "header-rename"
      ? "path=header-rename"
      : "path=affixed",
    result.cue === "affixed"
      ? "cue=affixed"
      : result.cue === "header-rename"
        ? "cue=header-rename"
        : "cue=nameplate",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    affixed: result.affixed,
    nameplate: result.nameplate,
    headerRename: result.headerRename,
    typeErrorEscape: result.typeErrorEscape,
    renameBaselineRollback: result.renameBaselineRollback,
    headerOneFrame: result.headerOneFrame,
    listRenameOk: result.listRenameOk,
    persistedOnReload: result.persistedOnReload,
    liveChannel: result.liveChannel,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    header: inspectHeader({
      affixed: result.affixed,
      nameplate: result.nameplate,
    }),
    ledger: inspectLedger({
      affixed: result.affixed,
      nameplate: result.nameplate,
      persistedOnReload: result.persistedOnReload,
    }),
    list: inspectList({
      affixed: result.affixed,
      nameplate: result.nameplate,
      listRenameOk: result.listRenameOk,
    }),
    thrown: inspectThrow({
      affixed: result.affixed,
      nameplate: result.nameplate,
      typeErrorEscape: result.typeErrorEscape,
    }),
    rollback: inspectRollback({
      affixed: result.affixed,
      nameplate: result.nameplate,
      renameBaselineRollback: result.renameBaselineRollback,
    }),
    channel: inspectChannel({
      affixed: result.affixed,
      nameplate: result.nameplate,
      liveChannel: result.liveChannel,
    }),
    plate: mapPlate({
      affixed: result.affixed,
      nameplate: result.nameplate,
      headerRename: result.headerRename,
      typeErrorEscape: result.typeErrorEscape,
      renameBaselineRollback: result.renameBaselineRollback,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      nameplate: result.nameplate === true || result.verdict === "nameplate",
    })),
    headerPath: scoreHeaderRename({
      origin: result.headerRename || result.nameplate ? "header" : "idle",
      hasLiveChannel: result.liveChannel || result.nameplate,
      renameSessionExists: result.affixed === true && !result.nameplate,
      affixed: result.affixed === true && !result.nameplate,
      listRenameOk: result.listRenameOk,
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
      names: PLATE_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (reporter hypothesis / issue text): Comm.renameSessionOnCli calls query.renameSession(Q,$) but renameSession does not exist on the SDK query class. The call throws a synchronous TypeError, so .catch(X) never attaches — the throw escapes Comm.renameSession, handleRequest returns {type:\"error\"}, and the webview store's renameBaseline rollback restores the old title. Header rename originates from the comm that owns the session's live CLI channel (throws). List rename originates from a comm with no channel; fan-out echo adopts the title before the throwing call; adoptPersistedTitle early-returns when summary already equals the new title. Invite verify against #94349 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
