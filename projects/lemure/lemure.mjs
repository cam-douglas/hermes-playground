#!/usr/bin/env node
/**
 * Lemure — Roman restless dead / Lemuria festival / salt-bean rite /
 * lararium household-shrine booth.
 * In Roman household religion, *lemures* are the restless dead; the
 * Lemuria festival stilled them with a salt-bean rite at the lararium.
 * Metaphor: the ScheduledTasks dispatcher still ticks two deleted
 * task ids once a minute at a vanished legacy path, while the shrine
 * roster (Routines UI, MCP list, on-disk registry) does not list them
 * and will not let them be removed.
 * Ashlar stone / salt-white / bean-black / lararium bronze / midnight
 * indigo / ember-red tick. Memorial/rite aesthetic. NOT a flintlock
 * flashpan. NOT a desert mirage. NOT a binder folio. NOT a theater
 * tapestry. NOT Deadlight / Glowplug / Relict / Ashpan / Gleaner.
 * NOT Cancellans / Arras / Frangible / Nameplate / Matryoshka /
 * Dragnet / Matricula / Allograph / Agraphia / Gauntlet.
 *
 * Educational diagnostic model for a published Claude Code Desktop
 * ghost-scheduler: Desktop ScheduledTasks manager still dispatches
 * two deleted/legacy tasks once per minute (`ohayo-morning-report`,
 * `mercari-daily-sales-check`). Logs show task file not found /
 * ENOENT at legacy path `/Users/<user>/Claude/Scheduled/.../SKILL.md`.
 * Tasks are absent from Routines UI, `scheduled-tasks` MCP list,
 * on-disk `~/.claude/scheduled-tasks/`, and `scheduled-tasks.json`.
 * MCP delete says not found. Survives full app restart. ~1440
 * lines/day of log noise. Working tasks live under
 * `~/.claude/scheduled-tasks/`; legacy `~/Claude/Scheduled/` does
 * not exist. Suspected leftover after app update.
 *
 * Encoded from anthropics/claude-code#94410 issue text only.
 * Hypothesis (NON-BINDING — issue text): leftover registration
 * after an app update still feeds the ScheduledTasks dispatcher from
 * a source that is not the on-disk registry / UI / MCP list;
 * dispatcher ticks deleted ids at the legacy ~/Claude/Scheduled/
 * path. Invite verify against issue text only. Do NOT claim a root
 * cause in Claude Code source you have not seen. Do NOT implement
 * a Claude Code fix. No network. No exploits. No live Claude.
 *
 *   node lemure.mjs data/lemure.json
 *   echo '{"seed":"lemure"}' | node lemure.mjs
 *
 * Idle word is quiet (HOLD: no orphan minute-ticks; ghosts absent
 * from dispatcher OR listed AND deletable).
 * HOLD aliases: rostered, enrolled, lararium, stilled, listed,
 * removable.
 * Seeded word is lemure (#94410 path).
 * Path word is orphan-tick.
 * Product score word is lemure (Score lemure or admit quiet.).
 *
 * NOT Flashpan/#93015 (stamps lastRunAt, never births session).
 * NOT Mirage/#92920 (renderer ack without session).
 * NOT Deadlight/#92249 (blanked ListAgents on scheduled).
 * NOT Glowplug/#85050 (Windows preheat).
 * NOT Relict (stale MSIX path).
 * NOT Ashpan/#93780 / Gleaner/#93794 orphan metaphors.
 * NOT Cancellans/#94400. NOT Arras/#94348. NOT Frangible/#94362.
 * NOT Nameplate/#94349. NOT Matryoshka/#94350. NOT Dragnet/#94064.
 * NOT Matricula/#93987. NOT Allograph/#94256. NOT Agraphia/#94251.
 * NOT Gauntlet/#94029. Cite-only cousins: Flashpan #93015, Mirage
 * #92920, Deadlight #92249, and related schedule issues — do NOT
 * rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "quiet",
  "lemure",
  "orphan-tick",
  "hold",
  "rostered",
  "enrolled",
  "lararium",
  "stilled",
  "listed",
  "removable",
  "legacy-path",
  "enoent-skip",
  "mcp-absent",
  "ui-absent",
  "registry-miss",
  "restart-survives",
  "minute-tick",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "quiet";
export const PATH_WORD = "orphan-tick";
export const SEEDED_WORD = "lemure";
export const PRODUCT_WORD = "lemure";
export const HOLD = Object.freeze(["quiet", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "rostered",
  "enrolled",
  "lararium",
  "stilled",
  "listed",
  "removable",
]);
export const RECOVER = Object.freeze(["quiet", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "intact",
  "cleared",
  "armed",
  "sealed",
  "latched",
  "guarded",
  "affixed",
  "unpacked",
  "draped",
  "hung",
  "screened",
  "scoped",
  "executable",
  "bit-set",
  "+x",
  "engraved",
  "plated",
  "labeled",
  "titled",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "admitted",
  "scanned",
  "freshened",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "primed",
  "confirmed",
  "blanked",
  "lit",
  "swept",
  "gleaned",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
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
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "aphonia",
  "sourdine",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
  "deferred-delta",
  "lastRunAt",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "cancellans",
  "arras",
  "phantom-prompt",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
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
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
  "deferred-delta",
]);

export const FEATURED_ISSUE = 94410;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94410";
export const TITLE =
  "Desktop: ghost scheduled tasks fire every minute but are absent from UI, MCP list, and on-disk registry";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
  "area:routines",
]);
export const PLATFORM = "macos";
export const SURFACE = "orphan-tick";
export const HOST =
  "Claude Desktop 1.52386.6; Claude Code 2.1.270; macOS 26.6.2 Apple Silicon";
export const CHECKED_ON =
  "Published report: Desktop ScheduledTasks still dispatches ohayo-morning-report and mercari-daily-sales-check once per minute; ENOENT at legacy ~/Claude/Scheduled/.../SKILL.md; absent from Routines UI, scheduled-tasks MCP list, ~/.claude/scheduled-tasks/, and scheduled-tasks.json; MCP delete not found; survives full app restart";
export const BUILD = "Claude Desktop 1.52386.6; Claude Code 2.1.270; macOS 26.6.2";
export const SELECTED_MODEL =
  "desktop ScheduledTasks leftover — ghost dispatcher vs roster honesty, not a model defect";
export const OS =
  "macOS 26.6.2 Apple Silicon; platform:macos / area:desktop / area:routines";
export const PHRASE = "Score lemure or admit quiet.";
export const DISTRIBUTION =
  "Two scheduled tasks that no longer exist anywhere on disk are still being dispatched by the Desktop app's ScheduledTasks manager once per minute, logging a warning/error each time. They cannot be removed: they do not appear in the Routines UI, in the scheduled-tasks MCP listing, or in the on-disk registry, and they survive a full app restart. ~/Library/Logs/Claude/main.log receives [warn] Skipping scheduled task ohayo-morning-report: task file not found at /Users/<user>/Claude/Scheduled/ohayo-morning-report/SKILL.md and [error] Failed to read task file for mercari-daily-sales-check: path not symlink-free before open { code: 'ENOENT' }. Volume: 708 lines on 2026-09-09 (starts 12:12), then 1444 / 1442 / 1440 / 1444 / 1443 — about 1440 lines/day, exactly one per minute; ~8,400 lines over six days. The referenced path is a legacy location /Users/<user>/Claude/Scheduled/; that directory does not exist — ~/Claude/ itself does not exist. Working tasks live under ~/.claude/scheduled-tasks/. Verified: ~/Claude/Scheduled/ does not exist; ~/.claude/scheduled-tasks/ has no directory for either task id; scheduled-tasks MCP list_scheduled_tasks returns 33 tasks and neither ghost is among them; delete_scheduled_task with the exact id is rejected Scheduled task \"ohayo-morning-report\" not found; Routines UI searches for ohayo, おはよう, and メルカリ each return no matching routines; scheduled-tasks.json exists (28 KB) and parses but grep for either id returns 0 matches; IndexedDB / Local Storage / Session Storage / Partitions under Application Support/Claude have 0 matches; ~/.claude.json only match is an unrelated skillUsage counter; restarting the app does not clear it (main process 08:33:48, same warning at 08:38:54 and every minute after). First occurrence 2026-09-09 12:12 coincides with last modification of Application Support/Claude at 12:11 — suspected leftover after app update. Expected: either the stale registration is dropped when its task file is missing, or it is exposed somewhere the user can delete it. Actual: it fires forever, is invisible, and there is no supported way to remove it. Impact: log noise only; log rotation caps disk use; no effect on the 33 working routines.";

export const GHOST_IDS = Object.freeze([
  "ohayo-morning-report",
  "mercari-daily-sales-check",
]);
export const LEGACY_ROOT = "/Users/<user>/Claude/Scheduled/";
export const LEGACY_HOME = "~/Claude/Scheduled/";
export const WORKING_ROOT = "~/.claude/scheduled-tasks/";
export const SKILL_FILE = "SKILL.md";
export const MCP_LIST = "list_scheduled_tasks";
export const MCP_DELETE = "delete_scheduled_task";
export const MCP_WORKING_COUNT = 33;
export const LINES_PER_DAY = 1440;
export const DESKTOP_BUILD = "1.52386.6";
export const CODE_BUILD = "2.1.270";
export const OHAYO_WARN =
  "[warn] [ScheduledTasks] Skipping scheduled task ohayo-morning-report: task file not found at /Users/<user>/Claude/Scheduled/ohayo-morning-report/SKILL.md";
export const MERCARI_ERR =
  "[error] [ScheduledTasks] Failed to read task file for mercari-daily-sales-check: path not symlink-free before open { code: 'ENOENT' }";
export const DELETE_REJECT =
  'Scheduled task "ohayo-morning-report" not found.';

export const SHRINE_NAMES = Object.freeze([
  {
    id: "lararium-niche",
    lost: "Lararium niche — household roster should list every ticking id",
    control: "Working tasks stay under ~/.claude/scheduled-tasks/",
    story: "the shrine holds when every tick is rostered and removable",
  },
  {
    id: "ghost-ohayo",
    lost: "Ghost ohayo — ohayo-morning-report ticks at a vanished SKILL.md",
    control: "A missing file would drop the registration or surface it",
    story: "the morning-report lemure still walks the minute",
  },
  {
    id: "ghost-mercari",
    lost: "Ghost mercari — mercari-daily-sales-check ENOENT skip each minute",
    control: "ENOENT would still the ember, not skip-and-retry",
    story: "the sales-check lemure knocks the legacy lintel",
  },
  {
    id: "salt-circle",
    lost: "Salt circle — MCP list and Routines UI omit both ids",
    control: "list_scheduled_tasks and the Routines search would show them",
    story: "the salt does not bind names the dispatcher still calls",
  },
  {
    id: "bean-rite",
    lost: "Bean rite — delete_scheduled_task rejected as not found",
    control: "The rite would remove a listed ghost, or refuse a listed id",
    story: "black beans thrown, but the names are not on the tablet",
  },
  {
    id: "ember-tick",
    lost: "Ember tick — once-per-minute fire survives a full app restart",
    control: "A restart would re-read only the on-disk registry",
    story: "the coal rekindles after the house is closed and opened",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "lararium-niche",
    survey: "working roster under ~/.claude/scheduled-tasks/; 33 MCP tasks",
    kind: "quiet",
    note: "idle/control: no orphan minute-ticks — the hold/good path",
  },
  {
    id: "ghost-ohayo",
    survey: "ohayo-morning-report skipped: task file not found at legacy path",
    kind: "lemure",
    note: "seeded: morning-report lemure still walked",
  },
  {
    id: "ghost-mercari",
    survey: "mercari-daily-sales-check ENOENT before open; not symlink-free",
    kind: "lemure",
    note: "seeded: sales-check lemure still walked",
  },
  {
    id: "salt-circle",
    survey: "Routines UI and MCP list omit both ids; scheduled-tasks.json 0 matches",
    kind: "lemure",
    note: "seeded: shrine roster does not name the walkers",
  },
  {
    id: "bean-rite",
    survey: "delete_scheduled_task rejected as not found",
    kind: "lemure",
    note: "seeded: the rite cannot still an unlisted name",
  },
  {
    id: "ember-tick",
    survey: "orphan-tick — once per minute; restart does not clear",
    kind: "lemure",
    note: "path: orphan-tick names the leftover dispatcher coal",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "legacy-path",
    label: "legacy path",
    count: "~/Claude/Scheduled/",
    note: "Legacy location does not exist; working tasks live under ~/.claude/scheduled-tasks/",
  },
  {
    id: "enoent-skip",
    label: "ENOENT skip",
    count: "once / minute",
    note: "File not found / path not symlink-free before open; dispatcher skips and retries",
  },
  {
    id: "mcp-absent",
    label: "MCP absent",
    count: "33 listed",
    note: "list_scheduled_tasks returns 33 tasks; neither ghost is among them",
  },
  {
    id: "ui-absent",
    label: "UI absent",
    count: "no matching routines",
    note: "Routines UI searches ohayo / おはよう / メルカリ return empty",
  },
  {
    id: "registry-miss",
    label: "registry miss",
    count: "0 matches",
    note: "scheduled-tasks.json parses; grep for either id returns 0",
  },
  {
    id: "restart-survives",
    label: "restart survives",
    count: "08:33 → 08:38",
    note: "Full app restart re-reads the leftover source; same warning every minute",
  },
]);

export const RULED_OUT = Object.freeze([
  "Flashpan/#93015 lastRunAt stamp without a session birth — flintlock priming pan; DIFFERENT",
  "Mirage/#92920 renderer ack without a session — desert heat-haze; DIFFERENT",
  "Deadlight/#92249 ListAgents / SendMessage blanked on scheduled — shuttered porthole; DIFFERENT",
  "Glowplug/#85050 Windows preheat soak — diesel glow-plug bay; DIFFERENT",
  "Relict stale MSIX path — outcrop already orphaned; DIFFERENT",
  "Ashpan/#93780 orphan-jsonl grate — industrial ashpan; DIFFERENT metaphor",
  "Gleaner/#93794 unreaped-ampersand field — leftover harvest; DIFFERENT metaphor",
  "Cancellans/#94400 deferred-delta — binder folio / resume tools drop; DIFFERENT",
  "Arras/#94348 phantom-prompt — theater tapestry / Desktop Auto approval card; DIFFERENT",
  "Frangible/#94362 chmod-failopen — wax-seal atelier / PreToolUse +x fail-open; DIFFERENT",
  "Nameplate/#94349 header-rename — brass hotel door-plate; DIFFERENT",
  "Matryoshka/#94350 subst-nest — lacquer nesting-doll / Bash $(...) walker; DIFFERENT",
  "Dragnet/#94064 root-find — night blotter / full-disk find; DIFFERENT",
  "Matricula/#93987 reload-blind — enrollment desk; DIFFERENT",
  "Allograph/#94256 win-posix-mismatch — type-foundry; DIFFERENT",
  "Agraphia/#94251 pre-tool-omit — medical writing-desk; DIFFERENT",
  "Gauntlet/#94029 attach-mouse — tilting-yard glove; DIFFERENT",
  "#91527 — scheduler skips / reports success (lastRunAt) with no session — cite-only cousin, DIFFERENT",
  "#80671 — Cowork lastRunAt advances without session executing — cite-only cousin, DIFFERENT",
  "#92429 — marks completed without actually running — cite-only cousin, DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "Either the stale registration is dropped when its task file is missing",
  "Or the leftover id is exposed somewhere the user can delete it (Routines UI, or delete_scheduled_task accepting it)",
  "A restart should re-read only the on-disk registry — not rekindle vanished legacy ids",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "orphan-tick",
  "lemure",
  "legacy-path",
  "enoent-skip",
  "mcp-absent",
  "restart-survives",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93015,
    title: "Flashpan — scheduled tasks stamp lastRunAt but never launch a session",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — lastRunAt stamp without a session birth. Do not rebuild. Do not conflate. Different from a leftover dispatcher that still ticks deleted ids.",
  },
  {
    issue: 92920,
    title: "Mirage — renderer acknowledges dispatch but no session starts",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — renderer ack without a session. Do not rebuild. Do not conflate. Different from ghosts absent from UI/MCP/disk.",
  },
  {
    issue: 92249,
    title: "Deadlight — ListAgents / SendMessage missing on scheduled-task sessions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — blanked tool registry on scheduled sessions. Do not rebuild. Do not conflate. Different from orphan minute-ticks of deleted ids.",
  },
  {
    issue: 91527,
    title: "scheduler skips / reports success (lastRunAt) with no session",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — related schedule family. Do not rebuild. Do not conflate. Different trigger from leftover legacy-path ENOENT ticks.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "Remote Control slows local session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "Shift+PageUp Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
  "cancellans",
  "arras",
  "frangible",
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
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "aphonia",
  "sourdine",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
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

export const SAMPLE_KIND_IDLE = "lararium";
export const SAMPLE_KIND_SEEDED = "orphan-tick";
export const SAMPLE_HOLDING_IDLE = "rostered";
export const SAMPLE_HOLDING_SEEDED = "enoent-skip";

export const SAMPLE_QUIET_PROOF = Object.freeze({
  quiet: true,
  lemure: false,
  orphanTick: false,
  ghostDispatch: false,
  legacyMissing: false,
  mcpAbsent: false,
  uiAbsent: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_LEMURE_PROOF = Object.freeze({
  quiet: false,
  lemure: true,
  orphanTick: true,
  ghostDispatch: true,
  legacyMissing: true,
  enoentSkip: true,
  mcpAbsent: true,
  uiAbsent: true,
  registryMiss: true,
  restartSurvives: true,
  minuteTick: true,
  deleteRejected: true,
  kind: SAMPLE_KIND_SEEDED,
  names: SHRINE_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds quiet: no orphan minute-ticks; ghosts absent from dispatcher or listed and deletable" },
  { t: "tick", line: "ScheduledTasks still dispatches ohayo-morning-report and mercari-daily-sales-check once per minute" },
  { t: "skip", line: "ENOENT at legacy ~/Claude/Scheduled/.../SKILL.md; directory does not exist" },
  { t: "path", line: "orphan-tick — absent from Routines UI, MCP list, on-disk registry; delete not found; restart does not clear" },
  { t: "score", line: "when the dispatcher still walks unlisted names the booth is lemure — Score lemure or admit quiet." },
]);

const FORCE_FLAGS = [
  "orphanTick",
  "ghostDispatch",
  "legacyMissing",
  "enoentSkip",
  "mcpAbsent",
  "uiAbsent",
  "registryMiss",
  "restartSurvives",
  "minuteTick",
  "deleteRejected",
];

const ISSUE_CUE_RE =
  /94410|ohayo-morning-report|mercari-daily-sales-check|ScheduledTasks|Claude\/Scheduled|scheduled-tasks|ENOENT|list_scheduled_tasks|delete_scheduled_task|no matching routines/i;

/**
 * Educational roster compare. Not a Claude Code patch.
 * Encodes only the published #94410 shapes.
 * quiet=true is the HOLD / rostered path.
 *
 * Quiet/HOLD when: dispatcher has no orphan ids OR every ticking id
 * is present in UI + MCP list + on-disk registry and delete works.
 * Lemure / orphan-tick when: dispatcher still fires once/minute for
 * ids whose task files are missing at a legacy path, AND those ids
 * are absent from Routines UI, MCP list, and on-disk registry, AND
 * delete is rejected as not found, AND restart does not clear.
 */
export function rosterGhosts({
  quiet = false,
  tickingIds = [...GHOST_IDS],
  uiIds = [],
  mcpIds = [],
  diskIds = [],
  deleteAccepted = false,
  restartClears = false,
  legacyPathExists = false,
  fileFound = false,
} = {}) {
  const ticks = Array.isArray(tickingIds) ? tickingIds : [];
  if (quiet === true) {
    return {
      orphan: false,
      ghosts: [],
      rostered: true,
      deletable: true,
      ticking: [],
      phrase: "admit quiet",
    };
  }
  const orphans = ticks.filter(
    (id) => !uiIds.includes(id) && !mcpIds.includes(id) && !diskIds.includes(id),
  );
  const everyRostered =
    ticks.length > 0 &&
    ticks.every(
      (id) => uiIds.includes(id) && mcpIds.includes(id) && diskIds.includes(id),
    ) &&
    deleteAccepted === true;
  const ghost =
    orphans.length > 0 &&
    fileFound !== true &&
    legacyPathExists !== true &&
    deleteAccepted !== true &&
    restartClears !== true &&
    !everyRostered;
  const noneTicking = ticks.length === 0;
  if (noneTicking || everyRostered) {
    return {
      orphan: false,
      ghosts: [],
      rostered: true,
      deletable: deleteAccepted === true || noneTicking,
      ticking: ticks,
      phrase: "admit quiet",
    };
  }
  return {
    orphan: ghost,
    ghosts: ghost ? orphans : [],
    rostered: !ghost,
    deletable: deleteAccepted === true,
    ticking: ticks,
    phrase: ghost ? "score lemure" : "admit quiet",
  };
}

export function scoreOrphanTick(input = {}) {
  const quietHold = input.quiet === true && input.lemure !== true;
  const ticking = quietHold
    ? input.tickingIds || []
    : input.tickingIds || [...GHOST_IDS];
  const roster = rosterGhosts({
    quiet: quietHold,
    tickingIds: ticking,
    uiIds: quietHold ? ticking : input.uiIds || [],
    mcpIds: quietHold ? ticking : input.mcpIds || [],
    diskIds: quietHold ? ticking : input.diskIds || [],
    deleteAccepted: quietHold || input.deleteAccepted === true,
    restartClears: input.restartClears === true,
    legacyPathExists: input.legacyPathExists === true,
    fileFound: input.fileFound === true,
  });
  const lemure =
    !quietHold &&
    (roster.orphan === true ||
      input.lemure === true ||
      input.orphanTick === true ||
      input.ghostDispatch === true ||
      input.legacyMissing === true ||
      input.enoentSkip === true);
  return {
    quiet: !lemure,
    lemure,
    orphanTick: lemure,
    ghosts: roster.ghosts,
    roster,
    phrase: lemure ? "score lemure" : "admit quiet",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94410") return true;
  if (
    Array.isArray(input.tickingIds) &&
    input.tickingIds.some((id) => GHOST_IDS.includes(id))
  ) {
    return true;
  }
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapLemure(input = {}) {
  const lemure = isLemureInput(input);
  const quiet = input.quiet === true && !lemure;
  return {
    stamp: lemure ? "orphan-tick" : "rostered",
    holdingLane: lemure ? "enoent-skip" : "rostered",
    kindLane: lemure ? "orphan-tick" : "lararium",
    bindLane: lemure ? "legacy-path" : "removable",
    ribbon: lemure ? "lemure" : "quiet",
    quiet,
  };
}

export function inspectDispatcher(input = {}) {
  const ticking =
    input.ghostDispatch === true ||
    input.lemure === true ||
    input.minuteTick === true ||
    isLemureInput(input);
  if (input.quiet === true && !ticking) {
    return { stamp: "dispatcher-still", ticking: false, note: "no orphan ids on the minute" };
  }
  return {
    stamp: ticking ? "ghost-dispatch" : "dispatcher-idle",
    ticking,
    note: ticking
      ? "ghost dispatcher — ohayo-morning-report and mercari-daily-sales-check still walk"
      : "",
  };
}

export function inspectLegacyPath(input = {}) {
  const missing =
    input.legacyMissing === true ||
    input.lemure === true ||
    input.enoentSkip === true ||
    isLemureInput(input);
  if (input.quiet === true && !missing) {
    return { stamp: "path-working", missing: false };
  }
  return {
    stamp: missing ? "legacy-path" : "path-idle",
    missing,
    note: missing
      ? "legacy path — ~/Claude/Scheduled/ does not exist; SKILL.md ENOENT"
      : "",
  };
}

export function inspectMcp(input = {}) {
  const absent =
    input.mcpAbsent === true ||
    input.lemure === true ||
    input.deleteRejected === true ||
    isLemureInput(input);
  if (input.quiet === true && !absent) {
    return { stamp: "mcp-listed", absent: false };
  }
  return {
    stamp: absent ? "mcp-absent" : "mcp-idle",
    absent,
    note: absent
      ? "MCP absent — list returns 33; delete rejected as not found"
      : "",
  };
}

export function inspectUi(input = {}) {
  const absent =
    input.uiAbsent === true ||
    input.lemure === true ||
    isLemureInput(input);
  if (input.quiet === true && !absent) {
    return { stamp: "ui-listed", absent: false };
  }
  return {
    stamp: absent ? "ui-absent" : "ui-idle",
    absent,
    note: absent
      ? "UI absent — Routines search returns no matching routines"
      : "",
  };
}

export function inspectRegistry(input = {}) {
  const missed =
    input.registryMiss === true ||
    input.lemure === true ||
    isLemureInput(input);
  if (input.quiet === true && !missed) {
    return { stamp: "registry-hot", missed: false };
  }
  return {
    stamp: missed ? "registry-miss" : "registry-idle",
    missed,
    note: missed
      ? "registry miss — scheduled-tasks.json has 0 matches for either id"
      : "",
  };
}

export function inspectRestart(input = {}) {
  const survives =
    input.restartSurvives === true ||
    input.lemure === true ||
    isLemureInput(input);
  if (input.quiet === true && !survives) {
    return { stamp: "restart-clears", survives: false };
  }
  return {
    stamp: survives ? "restart-survives" : "restart-idle",
    survives,
    note: survives
      ? "restart survives — leftover source is re-read after a full app restart"
      : "",
  };
}

function shrineOpen(input, id) {
  const map = {
    "lararium-niche": input.lemure || input.orphanTick,
    "ghost-ohayo": input.ghostDispatch || input.lemure,
    "ghost-mercari": input.enoentSkip || input.lemure,
    "salt-circle": input.mcpAbsent || input.uiAbsent,
    "bean-rite": input.deleteRejected,
    "ember-tick": input.minuteTick || input.orphanTick || input.lemure,
  };
  return (
    map[id] === true ||
    input.orphanTick === true ||
    input.lemure === true
  );
}

function isLemureInput(input = {}) {
  return (
    input.lemure === true ||
    input.orphanTick === true ||
    input.ghostDispatch === true ||
    input.legacyMissing === true ||
    input.enoentSkip === true ||
    input.mcpAbsent === true ||
    input.uiAbsent === true ||
    input.registryMiss === true ||
    input.restartSurvives === true ||
    input.minuteTick === true ||
    input.deleteRejected === true
  );
}

export function readBooth(input = {}) {
  const lemure = isLemureInput(input);
  const quiet = input.quiet === true && !lemure;
  return {
    mark: lemure ? "lemure" : "quiet",
    quiet,
    lemure,
    orphanTick: input.orphanTick === true || lemure,
    ghostDispatch: input.ghostDispatch === true,
    legacyMissing: input.legacyMissing === true,
    enoentSkip: input.enoentSkip === true,
    mcpAbsent: input.mcpAbsent === true,
    uiAbsent: input.uiAbsent === true,
    registryMiss: input.registryMiss === true,
    restartSurvives: input.restartSurvives === true,
    minuteTick: input.minuteTick === true,
    deleteRejected: input.deleteRejected === true,
    shrine: mapLemure(input),
    dispatcher: inspectDispatcher(input),
    legacy: inspectLegacyPath(input),
    mcp: inspectMcp(input),
    ui: inspectUi(input),
    registry: inspectRegistry(input),
    restart: inspectRestart(input),
    names: SHRINE_NAMES.filter((row) => shrineOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const LEMURE_WALK = Object.freeze([
  {
    t: "idle",
    event: "rostered",
    quiet: true,
    lemure: false,
    cue: "quiet",
    note: "idle HOLD: no orphan minute-ticks; ghosts absent from dispatcher or listed and deletable",
  },
  {
    t: "tick",
    event: "orphan-tick",
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
    minuteTick: true,
    cue: "lemure",
    note: "ScheduledTasks still dispatches ohayo-morning-report and mercari-daily-sales-check once per minute",
  },
  {
    t: "skip",
    event: "enoent-skip",
    lemure: true,
    legacyMissing: true,
    enoentSkip: true,
    cue: "lemure",
    note: "ENOENT at legacy ~/Claude/Scheduled/.../SKILL.md; directory does not exist",
  },
  {
    t: "path",
    event: "orphan-tick",
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
    legacyMissing: true,
    enoentSkip: true,
    mcpAbsent: true,
    uiAbsent: true,
    registryMiss: true,
    restartSurvives: true,
    minuteTick: true,
    deleteRejected: true,
    cue: "lemure",
    note: "orphan-tick — absent from Routines UI, MCP list, on-disk registry; delete not found; restart does not clear",
  },
  {
    t: "score",
    event: "lemure",
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
    legacyMissing: true,
    enoentSkip: true,
    mcpAbsent: true,
    uiAbsent: true,
    registryMiss: true,
    restartSurvives: true,
    minuteTick: true,
    deleteRejected: true,
    cue: "lemure",
    note: "lemure — the dispatcher still walks unlisted names at a vanished legacy path",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "rostered",
    quiet: true,
    lemure: false,
    cue: "quiet",
    note: "positive control: no orphan ids; shrine rostered",
  },
  {
    t: "admit",
    event: "rostered",
    quiet: true,
    cue: "quiet",
    note: "positive control: the shrine admits quiet",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    quiet: true,
    lemure: false,
    orphanTick: false,
    cue: "quiet",
  };
}

export function seedQuiet() {
  return { ...emptyTicket() };
}

export function seedLemure() {
  return {
    seed: SEEDED_WORD,
    quiet: false,
    lemure: true,
    orphanTick: true,
    ghostDispatch: true,
    legacyMissing: true,
    enoentSkip: true,
    mcpAbsent: true,
    uiAbsent: true,
    registryMiss: true,
    restartSurvives: true,
    minuteTick: true,
    deleteRejected: true,
    cue: "lemure",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_LEMURE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    lemure: true,
    orphanTick: true,
    cue: "lemure",
  };
}

export function seedOrphanTick() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    lemure: true,
    orphanTick: true,
    event: "orphan-tick",
    cue: "lemure",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    quiet: true,
    cue: "quiet",
  };
}

export function seedRostered() {
  return { seed: "rostered", preferSeed: true, quiet: true, cue: "quiet" };
}

export function seedEnrolled() {
  return { seed: "enrolled", preferSeed: true, quiet: true, cue: "quiet" };
}

export function seedLararium() {
  return { seed: "lararium", preferSeed: true, quiet: true, cue: "quiet" };
}

export function seedStilled() {
  return { seed: "stilled", preferSeed: true, quiet: true, cue: "quiet" };
}

export function seedListed() {
  return { seed: "listed", preferSeed: true, quiet: true, cue: "quiet" };
}

export function seedRemovable() {
  return { seed: "removable", preferSeed: true, quiet: true, cue: "quiet" };
}

export function seedMinuteTick() {
  return {
    seed: "minute-tick",
    preferSeed: true,
    minuteTick: true,
    cue: "lemure",
  };
}

export function seedLegacyPath() {
  return {
    seed: "legacy-path",
    preferSeed: true,
    legacyMissing: true,
    cue: "lemure",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      quiet: false,
      lemure: false,
      orphanTick: false,
      ghostDispatch: false,
      legacyMissing: false,
      enoentSkip: false,
      mcpAbsent: false,
      uiAbsent: false,
      registryMiss: false,
      restartSurvives: false,
      minuteTick: false,
      deleteRejected: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    quiet: raw.quiet === true,
    lemure: raw.lemure === true || raw.event === "lemure",
    orphanTick:
      raw.orphanTick === true || raw.event === "orphan-tick",
    ghostDispatch:
      raw.ghostDispatch === true || raw.event === "ghost-dispatch",
    legacyMissing:
      raw.legacyMissing === true || raw.event === "legacy-path",
    enoentSkip:
      raw.enoentSkip === true || raw.event === "enoent-skip",
    mcpAbsent:
      raw.mcpAbsent === true || raw.event === "mcp-absent",
    uiAbsent:
      raw.uiAbsent === true || raw.event === "ui-absent",
    registryMiss:
      raw.registryMiss === true || raw.event === "registry-miss",
    restartSurvives:
      raw.restartSurvives === true || raw.event === "restart-survives",
    minuteTick:
      raw.minuteTick === true || raw.event === "minute-tick",
    deleteRejected:
      raw.deleteRejected === true || raw.event === "bean-rite",
    tickingIds: raw.tickingIds,
    uiIds: raw.uiIds,
    mcpIds: raw.mcpIds,
    diskIds: raw.diskIds,
    deleteAccepted: raw.deleteAccepted,
    restartClears: raw.restartClears,
    legacyPathExists: raw.legacyPathExists,
    fileFound: raw.fileFound,
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
      (ticket.quiet != null ||
        ticket.lemure != null ||
        ticket.orphanTick != null ||
        ticket.ghostDispatch != null ||
        ticket.legacyMissing != null ||
        ticket.enoentSkip != null ||
        ticket.mcpAbsent != null ||
        ticket.uiAbsent != null ||
        ticket.registryMiss != null ||
        ticket.restartSurvives != null ||
        ticket.minuteTick != null ||
        ticket.deleteRejected != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isQuiet(row) {
  if (row.lemure && row.cue !== "quiet") return false;
  if (row.cue === "lemure" || row.cue === "orphan-tick") return false;
  if (
    row.orphanTick &&
    row.ghostDispatch &&
    row.cue !== "quiet" &&
    row.quiet !== true
  ) {
    return false;
  }
  if (
    row.quiet === true &&
    row.lemure !== true &&
    row.cue !== "lemure"
  ) {
    return true;
  }
  if (
    row.cue === "quiet" &&
    row.lemure !== true &&
    row.orphanTick !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isOrphanTick(row) {
  return (
    row.event === "orphan-tick" &&
    !isQuiet(row) &&
    (row.orphanTick === true ||
      row.ghostDispatch === true ||
      row.lemure === true)
  );
}

function isLemureRow(row) {
  if (isQuiet(row)) return false;
  if (isOrphanTick(row) && row.cue !== "lemure") return false;
  if (row.cue === "lemure") return true;
  if (row.lemure === true) return true;
  if (row.orphanTick === true && row.ghostDispatch === true) return true;
  if (
    row.orphanTick === true ||
    row.ghostDispatch === true ||
    row.legacyMissing === true ||
    row.enoentSkip === true ||
    row.mcpAbsent === true ||
    row.uiAbsent === true ||
    row.registryMiss === true ||
    row.restartSurvives === true ||
    row.minuteTick === true ||
    row.deleteRejected === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one lemure pass against the household shrine.
 * quiet: no orphan minute-ticks; ghosts absent or listed and deletable.
 * lemure: dispatcher still walks unlisted names at a vanished path.
 * orphan-tick: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isOrphanTick(row) ||
    (row.orphanTick && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "orphan-tick";
  } else if (isLemureRow(row)) {
    verdict = "lemure";
  } else if (isQuiet(row)) {
    verdict = "quiet";
  } else if (
    row.orphanTick ||
    row.ghostDispatch ||
    row.legacyMissing ||
    row.enoentSkip ||
    row.mcpAbsent ||
    row.uiAbsent ||
    row.registryMiss ||
    row.restartSurvives ||
    row.minuteTick ||
    row.deleteRejected
  ) {
    verdict = "lemure";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "lemure";
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
    quiet: verdict === "quiet" || verdict === "hold",
    lemure: verdict === "lemure" || verdict === SEEDED_WORD,
    orphanTick:
      row.orphanTick === true ||
      verdict === "orphan-tick" ||
      verdict === PATH_WORD,
    ghostDispatch: row.ghostDispatch,
    legacyMissing: row.legacyMissing,
    enoentSkip: row.enoentSkip,
    mcpAbsent: row.mcpAbsent,
    uiAbsent: row.uiAbsent,
    registryMiss: row.registryMiss,
    restartSurvives: row.restartSurvives,
    minuteTick: row.minuteTick,
    deleteRejected: row.deleteRejected,
    cue: hold
      ? "quiet"
      : row.orphanTick || verdict === "orphan-tick"
        ? "orphan-tick"
        : "lemure",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit quiet" : "score lemure",
    dispatcherInspect: inspectDispatcher(row),
    legacyInspect: inspectLegacyPath(row),
    mcpInspect: inspectMcp(row),
    uiInspect: inspectUi(row),
    registryInspect: inspectRegistry(row),
    restartInspect: inspectRestart(row),
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
      : LEMURE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "lemure");
  const path = scored.filter((row) => row.verdict === "orphan-tick");
  const quiet = scored.filter((row) => row.verdict === "quiet");
  const headline =
    scored.find((row) => row.event === "lemure") ||
    scored.find((row) => row.event === "orphan-tick") ||
    scored.find((row) => row.event === "enoent-skip") ||
    charged[charged.length - 1];
  let verdict = "quiet";
  if (charged.length) verdict = "lemure";
  else if (path.length && !quiet.length) {
    verdict = "orphan-tick";
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
    lemureCount: charged.length,
    pathCount: path.length,
    quietCount: quiet.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit quiet" : "score lemure",
    note: headline
      ? "Desktop ScheduledTasks still dispatches two deleted/legacy tasks once per minute (ohayo-morning-report, mercari-daily-sales-check). ENOENT at legacy ~/Claude/Scheduled/.../SKILL.md. Absent from Routines UI, MCP list, and on-disk registry. MCP delete not found. Survives restart. Cite-only cousins #93015 #92920 #92249 #91527."
      : "published lemure walk scored against quiet vs lemure",
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
    seeded !== "quiet" &&
    seeded !== "lemure" &&
    seeded !== "orphan-tick" &&
    ticket.quiet == null &&
    ticket.lemure == null &&
    ticket.orphanTick == null &&
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
    quiet: scored.quiet ?? false,
    lemure: scored.lemure ?? false,
    orphanTick: scored.orphanTick ?? false,
    ghostDispatch: scored.ghostDispatch ?? false,
    legacyMissing: scored.legacyMissing ?? false,
    enoentSkip: scored.enoentSkip ?? false,
    mcpAbsent: scored.mcpAbsent ?? false,
    uiAbsent: scored.uiAbsent ?? false,
    registryMiss: scored.registryMiss ?? false,
    restartSurvives: scored.restartSurvives ?? false,
    minuteTick: scored.minuteTick ?? false,
    deleteRejected: scored.deleteRejected ?? false,
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
    result.orphanTick || result.lemure
      ? "kind=orphan-tick"
      : "kind=lararium",
    result.legacyMissing || result.lemure
      ? "ref=legacy-path"
      : "ref=rostered",
    result.orphanTick || result.verdict === "orphan-tick"
      ? "path=orphan-tick"
      : "path=quiet",
    result.cue === "quiet"
      ? "cue=quiet"
      : result.cue === "orphan-tick"
        ? "cue=orphan-tick"
        : "cue=lemure",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    quiet: result.quiet,
    lemure: result.lemure,
    orphanTick: result.orphanTick,
    ghostDispatch: result.ghostDispatch,
    legacyMissing: result.legacyMissing,
    enoentSkip: result.enoentSkip,
    mcpAbsent: result.mcpAbsent,
    uiAbsent: result.uiAbsent,
    registryMiss: result.registryMiss,
    restartSurvives: result.restartSurvives,
    minuteTick: result.minuteTick,
    deleteRejected: result.deleteRejected,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    dispatcher: inspectDispatcher({
      quiet: result.quiet,
      lemure: result.lemure,
      ghostDispatch: result.ghostDispatch,
    }),
    legacy: inspectLegacyPath({
      quiet: result.quiet,
      lemure: result.lemure,
      legacyMissing: result.legacyMissing,
    }),
    mcp: inspectMcp({
      quiet: result.quiet,
      lemure: result.lemure,
      mcpAbsent: result.mcpAbsent,
    }),
    ui: inspectUi({
      quiet: result.quiet,
      lemure: result.lemure,
      uiAbsent: result.uiAbsent,
    }),
    registry: inspectRegistry({
      quiet: result.quiet,
      lemure: result.lemure,
      registryMiss: result.registryMiss,
    }),
    restart: inspectRestart({
      quiet: result.quiet,
      lemure: result.lemure,
      restartSurvives: result.restartSurvives,
    }),
    shrine: mapLemure({
      quiet: result.quiet,
      lemure: result.lemure,
      orphanTick: result.orphanTick,
      ghostDispatch: result.ghostDispatch,
      legacyMissing: result.legacyMissing,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      lemure: result.lemure === true || result.verdict === "lemure",
    })),
    orphanPath: scoreOrphanTick({
      quiet: result.quiet === true && !result.lemure,
      lemure: result.lemure,
      orphanTick: result.orphanTick,
      ghostDispatch: result.ghostDispatch,
      legacyMissing: result.legacyMissing,
      enoentSkip: result.enoentSkip,
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
      names: SHRINE_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): leftover registration after an app update still feeds the ScheduledTasks dispatcher from a source that is not the on-disk registry / UI / MCP list; dispatcher ticks deleted ids at the legacy ~/Claude/Scheduled/ path. Invite verify against #94410 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
