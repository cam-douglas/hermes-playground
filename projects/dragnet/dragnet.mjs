#!/usr/bin/env node
/**
 * Dragnet — night blotter / police-fishing dragnet booth.
 * A *dragnet* is an unscoped trawl that hauls every alley
 * instead of staying inside the open case folder. Desktop
 * Claude Code (com.anthropic.claude-code, 2.1.266) repeatedly
 * spawns child `/usr/bin/find` that walks from `/` (not the
 * open project / cwd). The walk descends into TCC-protected
 * locations and raises repeated "claude would like to access
 * data from other apps" prompts. Night blotter / asphalt /
 * caution-tape. NOT an enrollment desk (Matricula). NOT a
 * type-foundry (Allograph). NOT a neurology writing-desk
 * (Agraphia). NOT a gauntlet/lictor/lychgate/ouster/
 * proscription booth.
 *
 * Educational diagnostic model for a published Claude Code
 * desktop-app defect: a full-disk `find` rooted at `/`
 * triggers repeated macOS TCC consent prompts (~1.5–3 min)
 * while the app is open, with no user action required.
 * Shared app process is responsible. Evidence via
 * com.apple.TCC unified log (kTCCServiceSystemPolicyAppData)
 * and kernel sandbox denials proving traversal root is `/`.
 *
 * Encoded from anthropics/claude-code#94064 issue text only.
 * Hypothesis (NON-BINDING): the desktop shared process
 * repeatedly launches `/usr/bin/find` rooted at `/` rather
 * than the open project / working tree, so the walk enters
 * TCC-protected containers and raises repeated
 * access-data-from-other-apps prompts. Invite verify against
 * issue text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a Claude Code
 * fix. No network. No exploits. No live Claude.
 *
 *   node dragnet.mjs data/dragnet.json
 *   echo '{"seed":"dragnet"}' | node dragnet.mjs
 *
 * Idle word is scoped (HOLD: the scan would stay inside the
 * open project / working tree and never ask for other-apps
 * TCC). HOLD aliases: fenced, bounded, warranted,
 * project-rooted, cwd-scoped.
 * Seeded word is dragnet (#94064 path).
 * Path word is root-find.
 * Product score word is dragnet (Score dragnet or admit scoped.).
 *
 * NOT Matricula/#93987. NOT Allograph/#94256. NOT Agraphia/#94251.
 * NOT Gauntlet/#94029. NOT Lictor/#94053. NOT Lychgate/#94059.
 * NOT Ouster/#94221. NOT Proscription/#94202. NOT Frisket.
 * NOT Scant. No cousin issues are named in the #94064 text.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "scoped",
  "dragnet",
  "root-find",
  "hold",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "full-disk-find",
  "tcc-prompt",
  "other-apps",
  "sandbox-denial",
  "alley-trawl",
  "blotter-loop",
  "shared-process",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "scoped";
export const PATH_WORD = "root-find";
export const SEEDED_WORD = "dragnet";
export const PRODUCT_WORD = "dragnet";
export const HOLD = Object.freeze(["scoped", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
]);
export const RECOVER = Object.freeze(["scoped", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
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
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94064;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94064";
export const TITLE =
  'Desktop app spawns a full-disk `find` that triggers repeated "access data from other apps" (TCC) prompts';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "root-find";
export const HOST =
  "Claude Code desktop (com.anthropic.claude-code, 2.1.266)";
export const CHECKED_ON =
  "Desktop app open with no user action; com.apple.TCC unified log (kTCCServiceSystemPolicyAppData) and kernel sandbox denials";
export const BUILD = "Claude Code desktop 2.1.266 (com.anthropic.claude-code)";
export const SELECTED_MODEL = "n/a — filesystem walk, not a model defect";
export const OS =
  "macOS; TCC-protected locations (Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches) plus Contacts / Desktop / Full Disk Access surfaces";
export const PHRASE = "Score dragnet or admit scoped.";
export const DISTRIBUTION =
  "Claude Code desktop (com.anthropic.claude-code, 2.1.266) repeatedly spawns child /usr/bin/find that walks the filesystem starting at / (not scoped to the open project / cwd). The walk descends into TCC-protected locations and raises repeated macOS \"claude would like to access data from other apps\" consent prompts. Also touches Contacts / Desktop / Full Disk Access surfaces. Sandbox denials on Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches, etc. Recurs roughly every 1.5–3 minutes while the app is open; no user action required. Shared app process is responsible. Evidence via com.apple.TCC unified log (kTCCServiceSystemPolicyAppData) and kernel sandbox denials proving traversal root is /.";

export const ALLEY_NAMES = Object.freeze([
  {
    id: "open-case",
    lost: "Open case — find is not scoped to the open project / cwd; the net leaves the folder",
    control: "The walk would stay inside the open case folder",
    story: "the warrant named one folder; the net hauled the city",
  },
  {
    id: "net-cast",
    lost: "Net cast — child /usr/bin/find spawned by the shared app process",
    control: "A scoped scan never casts /usr/bin/find from /",
    story: "the blotter logs a full-disk find every few minutes",
  },
  {
    id: "alley-trawl",
    lost: "Alley trawl — walk hits Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches",
    control: "TCC-protected alleys stay outside the warrant",
    story: "every alley is hauled instead of the open case",
  },
  {
    id: "tcc-prompt",
    lost: 'TCC prompt — repeated "claude would like to access data from other apps"',
    control: "A project-rooted walk never asks for other-apps TCC",
    story: "the night desk keeps asking to search other houses",
  },
  {
    id: "blotter-loop",
    lost: "Blotter loop — recurs roughly every 1.5–3 minutes while the app is open",
    control: "Idle app does not re-trawl the city on a timer",
    story: "the same dragnet comes back around the block",
  },
  {
    id: "shared-process",
    lost: "Shared process — the shared app process is responsible; no user action required",
    control: "Only an explicit project scan would walk disk",
    story: "the precinct process casts the net by itself",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "open-case",
    survey: "night blotter; open case folder; scan should stay project-rooted",
    kind: "scoped",
    note: "idle/control: the warrant names the open project — the hold/good path",
  },
  {
    id: "net-cast",
    survey: "child /usr/bin/find spawned; traversal root is /",
    kind: "dragnet",
    note: "seeded: full-disk find, not cwd-scoped",
  },
  {
    id: "alley-trawl",
    survey: "Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches",
    kind: "dragnet",
    note: "seeded: TCC-protected alleys hauled",
  },
  {
    id: "tcc-prompt",
    survey: 'kTCCServiceSystemPolicyAppData — access data from other apps',
    kind: "dragnet",
    note: "seeded: repeated consent prompts",
  },
  {
    id: "blotter-loop",
    survey: "recurs ~1.5–3 min while the app is open; no user action",
    kind: "dragnet",
    note: "seeded: blotter loop",
  },
  {
    id: "shared-process",
    survey: "shared app process (com.anthropic.claude-code) is responsible",
    kind: "dragnet",
    note: "path: root-find names the unscoped trawl",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "full-disk-find",
    label: "full-disk find",
    count: "/usr/bin/find from /",
    note: "Child find walks the filesystem starting at /",
  },
  {
    id: "tcc-prompt",
    label: "TCC prompt",
    count: "other-apps consent",
    note: 'Repeated "claude would like to access data from other apps"',
  },
  {
    id: "sandbox-denial",
    label: "sandbox denial",
    count: "kernel denials",
    note: "Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches",
  },
  {
    id: "blotter-loop",
    label: "blotter loop",
    count: "1.5–3 min",
    note: "Recurs while the app is open; no user action required",
  },
  {
    id: "shared-process",
    label: "shared process",
    count: "com.anthropic.claude-code",
    note: "Shared app process is responsible",
  },
  {
    id: "root-find",
    label: "root-find",
    count: "traversal root is /",
    note: "Path: find is not scoped to the open project / cwd",
  },
]);

export const RULED_OUT = Object.freeze([
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
]);

export const EXPECTED = Object.freeze([
  "A desktop disk walk should stay inside the open project / working tree (cwd-scoped)",
  "Child /usr/bin/find must not start at / when a project folder is open",
  "The app should not raise repeated access-data-from-other-apps TCC prompts with no user action",
  "TCC-protected alleys (Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches) stay outside the warrant",
  "Contacts / Desktop / Full Disk Access surfaces should not be touched by an idle open app",
  "A scoped scan would never ask for other-apps TCC",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "root-find",
  "dragnet",
  "full-disk-find",
  "tcc-prompt",
  "other-apps",
  "sandbox-denial",
]);

export const COUSINS = Object.freeze([]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94277, title: "backup #94277", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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

export const FIND_BINARY = "/usr/bin/find";
export const TRAVERSAL_ROOT = "/";
export const LOOP_MIN_MINUTES = 1.5;
export const LOOP_MAX_MINUTES = 3;
export const BUNDLE_ID = "com.anthropic.claude-code";
export const TCC_SERVICE = "kTCCServiceSystemPolicyAppData";

export const SAMPLE_KIND_IDLE = "cwd-scoped";
export const SAMPLE_KIND_SEEDED = "root-find";
export const SAMPLE_HOLDING_IDLE = "fenced";
export const SAMPLE_HOLDING_SEEDED = "full-disk-find";

export const SAMPLE_SCOPED_PROOF = Object.freeze({
  scoped: true,
  dragnet: false,
  rootFind: false,
  fullDiskFind: false,
  tccPrompt: false,
  otherApps: false,
  sandboxDenial: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DRAGNET_PROOF = Object.freeze({
  scoped: false,
  dragnet: true,
  rootFind: true,
  fullDiskFind: true,
  tccPrompt: true,
  otherApps: true,
  sandboxDenial: true,
  kind: SAMPLE_KIND_SEEDED,
  names: ALLEY_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds scoped: the scan would stay inside the open project / working tree and never ask for other-apps TCC" },
  { t: "spawn", line: "shared app process spawns child /usr/bin/find" },
  { t: "root", line: "walk starts at / — not the open project / cwd" },
  { t: "path", line: "root-find — TCC-protected alleys hauled; access-data-from-other-apps prompts; sandbox denials prove traversal root is /" },
  { t: "score", line: "when the net leaves the open case the booth is dragnet — Score dragnet or admit scoped." },
]);

const FORCE_FLAGS = [
  "fullDiskFind",
  "tccPrompt",
  "otherApps",
  "sandboxDenial",
  "rootFind",
  "alleyTrawl",
  "blotterLoop",
  "sharedProcess",
];

const ISSUE_CUE_RE =
  /94064|usr\/bin\/find|ktccservicesystempolicyappdata|access data from other apps|access-data-from-other-apps|full.?disk|traversal root|callhistorydb|clouddocs|addressbook/i;

/**
 * Educational walk-root compare. Not a Claude Code patch.
 * Does not walk the live filesystem.
 */
export function scoreWalkRoot({ walkRoot, cwd } = {}) {
  const root = walkRoot == null ? "" : String(walkRoot);
  const project = cwd == null ? "" : String(cwd);
  const atVolumeRoot = root === "/" || root === "";
  const projectRooted =
    Boolean(project) &&
    project !== "/" &&
    (root === project || root.startsWith(project.endsWith("/") ? project : `${project}/`));
  return {
    walkRoot: root || null,
    cwd: project || null,
    findBinary: FIND_BINARY,
    scoped: projectRooted && !atVolumeRoot,
    dragnet: atVolumeRoot,
    rootFind: atVolumeRoot,
    phrase: atVolumeRoot ? "score dragnet" : projectRooted ? "admit scoped" : "score dragnet",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94064") return true;
  if (input.findBinary === FIND_BINARY) return true;
  if (input.walkRoot === "/" || input.traversalRoot === "/") return true;
  if (input.tccService === TCC_SERVICE) return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

/**
 * Net map: scoped case vs dragnet (unscoped full-disk trawl).
 */
export function mapNet(input = {}) {
  const dragnet = isDragnetInput(input);
  const scoped = input.scoped === true && !dragnet;
  return {
    stamp: dragnet ? "root-find" : "scoped-case",
    holdingLane: dragnet ? "full-disk-find" : "fenced",
    kindLane: dragnet ? "root-find" : "cwd-scoped",
    bindLane: dragnet ? "tcc-prompt" : "warranted",
    ribbon: dragnet ? "dragnet" : "scoped",
    scoped,
  };
}

export function inspectCase(input = {}) {
  const left =
    input.dragnet === true ||
    input.rootFind === true ||
    isDragnetInput(input);
  if (input.scoped === true && !left) {
    return { stamp: "case-scoped", left: false, note: "open case — walk stays inside the project folder" };
  }
  return {
    stamp: left ? "case-left" : "case-idle",
    left,
    note: left
      ? "open case — find is not scoped to the open project / cwd"
      : "",
  };
}

export function inspectFind(input = {}) {
  const cast =
    input.fullDiskFind === true ||
    input.findBinary === FIND_BINARY ||
    input.dragnet === true ||
    isDragnetInput(input);
  if (input.scoped === true && !cast) {
    return { stamp: "find-fenced", cast: false };
  }
  return {
    stamp: cast ? "net-cast" : "find-idle",
    cast,
    note: cast
      ? "net cast — child /usr/bin/find spawned; traversal root is /"
      : "",
  };
}

export function inspectAlleys(input = {}) {
  const hauled =
    input.alleyTrawl === true ||
    input.sandboxDenial === true ||
    input.dragnet === true ||
    isDragnetInput(input);
  if (input.scoped === true && !hauled) {
    return { stamp: "alleys-fenced", hauled: false };
  }
  return {
    stamp: hauled ? "alley-trawl" : "alleys-idle",
    hauled,
    note: hauled
      ? "alley trawl — Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches"
      : "",
  };
}

export function inspectTcc(input = {}) {
  const prompted =
    input.tccPrompt === true ||
    input.otherApps === true ||
    input.dragnet === true ||
    isDragnetInput(input);
  if (input.scoped === true && !prompted) {
    return { stamp: "tcc-quiet", prompted: false };
  }
  return {
    stamp: prompted ? "tcc-prompt" : "tcc-idle",
    prompted,
    note: prompted
      ? 'TCC prompt — repeated "claude would like to access data from other apps"'
      : "",
  };
}

export function inspectLoop(input = {}) {
  const looping =
    input.blotterLoop === true ||
    input.dragnet === true ||
    isDragnetInput(input);
  if (input.scoped === true && !looping) {
    return { stamp: "loop-idle", looping: false };
  }
  return {
    stamp: looping ? "blotter-loop" : "loop-idle",
    looping,
    note: looping
      ? "blotter loop — recurs roughly every 1.5–3 minutes while the app is open"
      : "",
  };
}

export function inspectProcess(input = {}) {
  const shared =
    input.sharedProcess === true ||
    input.dragnet === true ||
    isDragnetInput(input);
  if (input.scoped === true && !shared) {
    return { stamp: "process-idle", shared: false };
  }
  return {
    stamp: shared ? "shared-process" : "process-idle",
    shared,
    note: shared
      ? "shared process — com.anthropic.claude-code casts the net; no user action required"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "open-case": input.rootFind || input.fullDiskFind,
    "net-cast": input.fullDiskFind,
    "alley-trawl": input.alleyTrawl || input.sandboxDenial,
    "tcc-prompt": input.tccPrompt || input.otherApps,
    "blotter-loop": input.blotterLoop,
    "shared-process": input.sharedProcess || input.rootFind,
  };
  return (
    map[id] === true ||
    input.rootFind === true ||
    input.dragnet === true
  );
}

function isDragnetInput(input = {}) {
  return (
    input.dragnet === true ||
    input.rootFind === true ||
    input.fullDiskFind === true ||
    input.tccPrompt === true ||
    input.otherApps === true ||
    input.sandboxDenial === true ||
    input.alleyTrawl === true ||
    input.blotterLoop === true ||
    input.sharedProcess === true ||
    input.walkRoot === "/" ||
    input.traversalRoot === "/"
  );
}

export function readBooth(input = {}) {
  const dragnet = isDragnetInput(input);
  const scoped = input.scoped === true && !dragnet;
  return {
    mark: dragnet ? "dragnet" : "scoped",
    scoped,
    dragnet,
    rootFind: input.rootFind === true || dragnet,
    fullDiskFind: input.fullDiskFind === true,
    tccPrompt: input.tccPrompt === true,
    otherApps: input.otherApps === true,
    sandboxDenial: input.sandboxDenial === true,
    alleyTrawl: input.alleyTrawl === true,
    blotterLoop: input.blotterLoop === true,
    sharedProcess: input.sharedProcess === true,
    scope: mapNet(input),
    caseFile: inspectCase(input),
    find: inspectFind(input),
    alleys: inspectAlleys(input),
    tcc: inspectTcc(input),
    loop: inspectLoop(input),
    process: inspectProcess(input),
    names: ALLEY_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const DRAGNET_WALK = Object.freeze([
  {
    t: "idle",
    event: "case-scoped",
    scoped: true,
    dragnet: false,
    cue: "scoped",
    note: "idle HOLD: the scan would stay inside the open project / working tree and never ask for other-apps TCC",
  },
  {
    t: "spawn",
    event: "full-disk-find",
    dragnet: true,
    fullDiskFind: true,
    cue: "dragnet",
    note: "shared app process spawns child /usr/bin/find",
  },
  {
    t: "root",
    event: "root-find",
    dragnet: true,
    rootFind: true,
    fullDiskFind: true,
    cue: "dragnet",
    note: "walk starts at / — not the open project / cwd",
  },
  {
    t: "path",
    event: "root-find",
    dragnet: true,
    rootFind: true,
    tccPrompt: true,
    otherApps: true,
    sandboxDenial: true,
    alleyTrawl: true,
    cue: "dragnet",
    note: "root-find — TCC-protected alleys hauled; access-data-from-other-apps prompts",
  },
  {
    t: "score",
    event: "dragnet",
    dragnet: true,
    rootFind: true,
    fullDiskFind: true,
    tccPrompt: true,
    otherApps: true,
    sandboxDenial: true,
    alleyTrawl: true,
    blotterLoop: true,
    sharedProcess: true,
    cue: "dragnet",
    note: "dragnet — the net leaves the open case and hauls every alley",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "case-scoped",
    scoped: true,
    dragnet: false,
    cue: "scoped",
    note: "positive control: a project-rooted walk never asks for other-apps TCC",
  },
  {
    t: "admit",
    event: "case-scoped",
    scoped: true,
    cue: "scoped",
    note: "positive control: the blotter admits scoped",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    scoped: true,
    dragnet: false,
    rootFind: false,
    cue: "scoped",
  };
}

export function seedScoped() {
  return { ...emptyTicket() };
}

export function seedDragnet() {
  return {
    seed: SEEDED_WORD,
    scoped: false,
    dragnet: true,
    rootFind: true,
    fullDiskFind: true,
    tccPrompt: true,
    otherApps: true,
    sandboxDenial: true,
    alleyTrawl: true,
    blotterLoop: true,
    sharedProcess: true,
    cue: "dragnet",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DRAGNET_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    dragnet: true,
    rootFind: true,
    cue: "dragnet",
  };
}

export function seedRootFind() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    dragnet: true,
    rootFind: true,
    event: "root-find",
    cue: "dragnet",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    scoped: true,
    cue: "scoped",
  };
}

export function seedFenced() {
  return { seed: "fenced", preferSeed: true, scoped: true, cue: "scoped" };
}

export function seedBounded() {
  return { seed: "bounded", preferSeed: true, scoped: true, cue: "scoped" };
}

export function seedWarranted() {
  return { seed: "warranted", preferSeed: true, scoped: true, cue: "scoped" };
}

export function seedProjectRooted() {
  return { seed: "project-rooted", preferSeed: true, scoped: true, cue: "scoped" };
}

export function seedCwdScoped() {
  return { seed: "cwd-scoped", preferSeed: true, scoped: true, cue: "scoped" };
}

export function seedFullDiskFind() {
  return {
    seed: "full-disk-find",
    preferSeed: true,
    fullDiskFind: true,
    cue: "dragnet",
  };
}

export function seedTccPrompt() {
  return {
    seed: "tcc-prompt",
    preferSeed: true,
    tccPrompt: true,
    cue: "dragnet",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      scoped: false,
      dragnet: false,
      rootFind: false,
      fullDiskFind: false,
      tccPrompt: false,
      otherApps: false,
      sandboxDenial: false,
      alleyTrawl: false,
      blotterLoop: false,
      sharedProcess: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    scoped: raw.scoped === true,
    dragnet: raw.dragnet === true || raw.event === "dragnet",
    rootFind:
      raw.rootFind === true || raw.event === "root-find",
    fullDiskFind:
      raw.fullDiskFind === true || raw.event === "full-disk-find",
    tccPrompt: raw.tccPrompt === true || raw.event === "tcc-prompt",
    otherApps: raw.otherApps === true || raw.event === "other-apps",
    sandboxDenial:
      raw.sandboxDenial === true || raw.event === "sandbox-denial",
    alleyTrawl: raw.alleyTrawl === true || raw.event === "alley-trawl",
    blotterLoop: raw.blotterLoop === true || raw.event === "blotter-loop",
    sharedProcess:
      raw.sharedProcess === true || raw.event === "shared-process",
    walkRoot: raw.walkRoot,
    traversalRoot: raw.traversalRoot,
    findBinary: raw.findBinary,
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
      (ticket.scoped != null ||
        ticket.dragnet != null ||
        ticket.rootFind != null ||
        ticket.fullDiskFind != null ||
        ticket.tccPrompt != null ||
        ticket.otherApps != null ||
        ticket.sandboxDenial != null ||
        ticket.alleyTrawl != null ||
        ticket.blotterLoop != null ||
        ticket.sharedProcess != null ||
        ticket.walkRoot != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isScoped(row) {
  if (row.dragnet && row.cue !== "scoped") return false;
  if (row.cue === "dragnet" || row.cue === "root-find") return false;
  if (
    row.rootFind &&
    row.fullDiskFind &&
    row.cue !== "scoped" &&
    row.scoped !== true
  ) {
    return false;
  }
  if (
    row.scoped === true &&
    row.dragnet !== true &&
    row.cue !== "dragnet"
  ) {
    return true;
  }
  if (
    row.cue === "scoped" &&
    row.dragnet !== true &&
    row.rootFind !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isRootFind(row) {
  return (
    row.event === "root-find" &&
    !isScoped(row) &&
    (row.rootFind === true ||
      row.fullDiskFind === true ||
      row.dragnet === true)
  );
}

function isDragnetRow(row) {
  if (isScoped(row)) return false;
  if (isRootFind(row) && row.cue !== "dragnet") return false;
  if (row.cue === "dragnet") return true;
  if (row.dragnet === true) return true;
  if (row.rootFind === true && row.fullDiskFind === true) return true;
  if (
    row.rootFind === true ||
    row.fullDiskFind === true ||
    row.tccPrompt === true ||
    row.otherApps === true ||
    row.sandboxDenial === true ||
    row.alleyTrawl === true ||
    row.blotterLoop === true ||
    row.sharedProcess === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one dragnet pass against the night blotter.
 * scoped: scan would stay inside the open project / working tree.
 * dragnet: desktop find walks from / and raises other-apps TCC.
 * root-find: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isRootFind(row) ||
    (row.rootFind && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "root-find";
  } else if (isDragnetRow(row)) {
    verdict = "dragnet";
  } else if (isScoped(row)) {
    verdict = "scoped";
  } else if (
    row.rootFind ||
    row.fullDiskFind ||
    row.tccPrompt ||
    row.otherApps ||
    row.sandboxDenial ||
    row.alleyTrawl ||
    row.blotterLoop ||
    row.sharedProcess
  ) {
    verdict = "dragnet";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "dragnet";
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
    scoped: verdict === "scoped" || verdict === "hold",
    dragnet: verdict === "dragnet" || verdict === SEEDED_WORD,
    rootFind:
      row.rootFind === true ||
      verdict === "root-find" ||
      verdict === PATH_WORD,
    fullDiskFind: row.fullDiskFind,
    tccPrompt: row.tccPrompt,
    otherApps: row.otherApps,
    sandboxDenial: row.sandboxDenial,
    alleyTrawl: row.alleyTrawl,
    blotterLoop: row.blotterLoop,
    sharedProcess: row.sharedProcess,
    cue: hold
      ? "scoped"
      : row.rootFind || verdict === "root-find"
        ? "root-find"
        : "dragnet",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit scoped" : "score dragnet",
    caseInspect: inspectCase(row),
    findInspect: inspectFind(row),
    alleyInspect: inspectAlleys(row),
    tccInspect: inspectTcc(row),
    loopInspect: inspectLoop(row),
    processInspect: inspectProcess(row),
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
      : DRAGNET_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "dragnet");
  const path = scored.filter((row) => row.verdict === "root-find");
  const scoped = scored.filter((row) => row.verdict === "scoped");
  const headline =
    scored.find((row) => row.event === "dragnet") ||
    scored.find((row) => row.event === "root-find") ||
    scored.find((row) => row.event === "full-disk-find") ||
    charged[charged.length - 1];
  let verdict = "scoped";
  if (charged.length) verdict = "dragnet";
  else if (path.length && !scoped.length) {
    verdict = "root-find";
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
    dragnetCount: charged.length,
    pathCount: path.length,
    scopedCount: scoped.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit scoped" : "score dragnet",
    note: headline
      ? "Desktop app repeatedly spawns /usr/bin/find rooted at /; walk hits TCC-protected paths and raises repeated access-data-from-other-apps prompts. No cousins named in #94064 text — do not invent."
      : "published dragnet walk scored against scoped vs dragnet",
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
    seeded !== "scoped" &&
    seeded !== "dragnet" &&
    seeded !== "root-find" &&
    ticket.scoped == null &&
    ticket.dragnet == null &&
    ticket.rootFind == null &&
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
    scoped: scored.scoped ?? false,
    dragnet: scored.dragnet ?? false,
    rootFind: scored.rootFind ?? false,
    fullDiskFind: scored.fullDiskFind ?? false,
    tccPrompt: scored.tccPrompt ?? false,
    otherApps: scored.otherApps ?? false,
    sandboxDenial: scored.sandboxDenial ?? false,
    alleyTrawl: scored.alleyTrawl ?? false,
    blotterLoop: scored.blotterLoop ?? false,
    sharedProcess: scored.sharedProcess ?? false,
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
    result.fullDiskFind || result.dragnet
      ? "kind=root-find"
      : "kind=cwd-scoped",
    result.tccPrompt || result.dragnet
      ? "ref=tcc-prompt"
      : "ref=fenced",
    result.rootFind || result.verdict === "root-find"
      ? "path=root-find"
      : "path=scoped",
    result.cue === "scoped"
      ? "cue=scoped"
      : result.cue === "root-find"
        ? "cue=root-find"
        : "cue=dragnet",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    scoped: result.scoped,
    dragnet: result.dragnet,
    rootFind: result.rootFind,
    fullDiskFind: result.fullDiskFind,
    tccPrompt: result.tccPrompt,
    otherApps: result.otherApps,
    sandboxDenial: result.sandboxDenial,
    alleyTrawl: result.alleyTrawl,
    blotterLoop: result.blotterLoop,
    sharedProcess: result.sharedProcess,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    caseFile: inspectCase({
      scoped: result.scoped,
      dragnet: result.dragnet,
    }),
    find: inspectFind({
      scoped: result.scoped,
      dragnet: result.dragnet,
      fullDiskFind: result.fullDiskFind,
    }),
    alleys: inspectAlleys({
      scoped: result.scoped,
      dragnet: result.dragnet,
      alleyTrawl: result.alleyTrawl,
    }),
    tcc: inspectTcc({
      scoped: result.scoped,
      dragnet: result.dragnet,
      tccPrompt: result.tccPrompt,
    }),
    loop: inspectLoop({
      scoped: result.scoped,
      dragnet: result.dragnet,
      blotterLoop: result.blotterLoop,
    }),
    process: inspectProcess({
      scoped: result.scoped,
      dragnet: result.dragnet,
      sharedProcess: result.sharedProcess,
    }),
    scope: mapNet({
      scoped: result.scoped,
      dragnet: result.dragnet,
      rootFind: result.rootFind,
      fullDiskFind: result.fullDiskFind,
      tccPrompt: result.tccPrompt,
      otherApps: result.otherApps,
      sandboxDenial: result.sandboxDenial,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      dragnet: result.dragnet === true || result.verdict === "dragnet",
    })),
    walkRoot: scoreWalkRoot({
      walkRoot: result.rootFind || result.dragnet ? "/" : input && input.cwd,
      cwd: input && input.cwd,
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
      names: ALLEY_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the desktop shared process repeatedly launches /usr/bin/find rooted at / rather than the open project / working tree, so the walk enters TCC-protected containers and raises repeated access-data-from-other-apps prompts. Invite verify against #94064 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
