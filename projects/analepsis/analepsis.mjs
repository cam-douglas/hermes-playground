#!/usr/bin/env node
/**
 * Analepsis — manuscript flashback / collation-desk booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop session UI ends on a reply from hours earlier because a
 * synthetic `background_tasks_redelivered` marker splices an older
 * stretch AFTER the present. Transcript on disk stays complete and
 * chronological. The page has all the data, only in the wrong order.
 * Feed anchored at bottom therefore lands in the past; because the
 * list ends on a task notification rather than a result, the working
 * marker sticks.
 *
 *   node analepsis.mjs data/redelivered.json
 *   echo '{"seed":"redelivered"}' | node analepsis.mjs
 *
 * Idle word is ordered (HOLD: disk, tree, and feed agree on chronology).
 * Seeded word is redelivered (#93569 flashback after the marker).
 * Path word is marker-misorder.
 * Product score word is analepsis (Score analepsis or admit ordered.).
 *
 * Encoded from anthropics/claude-code#93569 issue text only.
 * Hypothesis (NON-BINDING): treat the synthetic
 * background_tasks_redelivered marker as the splice point that
 * reorders the feed. Main process builds it from a
 * background_tasks_changed event whose source_uuid pointed at the
 * last such event before compaction. Verify against #93569 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "hold",
  "disk-intact",
  "tree-spliced",
  "feed-bottom-early",
  "working-stuck",
  "moved-not-copied",
  "no-uuid-dup",
  "marker-no-stamp",
  "source-pre-compact",
  "main-process-built",
  "not-cli",
  "reload-fixes",
  "popout-inherited",
  "ipc-only",
  "compact-then-idle",
  "mid-turn-unfocus",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "ordered";
export const PATH_WORD = "marker-misorder";
export const SEEDED_WORD = "redelivered";
export const PRODUCT_WORD = "analepsis";
export const HOLD = Object.freeze(["ordered", "hold"]);
export const RECOVER = Object.freeze(["ordered", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "compline",
  "lingering",
  "unrung",
  "closed",
  "cipherlock",
  "sealed",
  "blanked",
  "concurrent-write",
  "attainder",
  "untainted",
  "attainted",
  "retire-parked",
  "sourdine",
  "voiced",
  "muted",
  "mid-narration",
  "forksink",
  "lodged",
  "dropped",
  "source-fork",
  "foxfire",
  "kindled",
  "painted",
  "never-turns",
  "pentimento",
  "flushed",
  "lagged",
  "one-behind",
  "vinculum",
  "solitary",
  "twinlinked",
  "bridge-refuse",
  "cachet",
  "imprimatur",
  "ukase",
  "understudy",
  "fetch",
  "hit",
  "flattened",
  "string-carrier",
  "steady",
  "strobing",
  "off-label",
  "strobe",
  "matched",
  "skewed",
  "headers-hash",
  "counterfoil",
  "traced",
  "pathless",
  "image-cache",
  "lucida",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "damped",
  "spinning",
  "mux",
  "snubber",
  "mounted",
  "fossed",
  "plan9",
  "fosse",
  "warm",
  "paged-out",
  "majflt",
  "hibernacle",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "mismatched",
  "issuer",
  "paraph",
  "sterling",
  "debased",
  "hallmark",
  "remanent",
  "collimated",
  "diopter",
  "hysteresis",
  "banked",
  "ephemera",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "slipped",
  "sprung",
  "springe",
  "afloat",
  "washed",
  "pontoon",
  "concordant",
  "concordat",
  "reaped",
  "revenant",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "voided",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "defaulted",
  "literal",
  "stale",
  "phantom",
  "vernier",
  "slider",
  "latent",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
  "culled",
  "intact",
  "procrustes",
  "drained",
  "gated",
  "sump",
  "spillway",
  "quietus",
  "rubric",
  "recension",
  "priory",
  "waived",
  "refused",
  "imprinted",
  "ukased",
  "miscast",
  "ghosted",
  "scraped",
  "fabricated",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "redelivered" && name !== "analepsis",
  ),
);

export const FEATURED_ISSUE = 93569;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93569";
export const TITLE =
  "[BUG] Desktop: older turns get re-delivered behind a `background_tasks_redelivered` marker and rendered last, so the feed ends on a turn from hours earlier";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const CLAUDE_CODE_VERSION = "2.1.260";
export const OS = "macOS";
export const CLIENT = "Desktop Code tab";
export const DESKTOP_BUILD = "Claude desktop 1.49585.0 (2.1.266 arrived the morning after)";
export const MODEL = "Opus";
export const PLATFORM = "Anthropic API";
export const SESSION_ID = "local_09ef21f1";
export const STREAM_ROWS = 4438;
export const MOVED_ROWS = 477;
export const RENDERED_ENTRIES = 161;
export const FLASHBACK_ENTRY_START = 145;
export const FLASHBACK_ENTRY_END = 160;
export const PRESENT_END = "22:30:16";
export const FLASHBACK_START = "18:32:26";
export const FLASHBACK_END = "19:24:37";
export const MARKER_SUBTYPE = "background_tasks_redelivered";
export const MARKER_TYPE = "system";
export const SOURCE_EVENT = "background_tasks_changed";
export const SOURCE_TIME = "17:01:26";
export const COMPACT_SENT = "17:10:15";
export const COMPACT_LANDS = "17:12:32";
export const TRANSCRIPT_PAGE_START = "19:24:37.438";
export const REDELIVERED_BLOCK_END = "19:24:37.435";
export const LISTENER_WARN = 11;
export const MARKER_STRING = "background_tasks_redelivered";
export const PHRASE = "Score analepsis or admit ordered.";
export const DISTRIBUTION =
  "Claude Code 2.1.260 bundled in Claude desktop 1.49585.0 — Code tab, macOS 26.5.1 (25F80). Opus. Anthropic API. Not the CLI binary.";
export const SESSION_KIND =
  "Long Desktop session (~7,600 transcript rows, 30 MB) after /compact, WarmLifecycle idle disconnect, mid-turn unfocus, then a synthetic background_tasks_redelivered splice";

export const QUIRE_STATIONS = Object.freeze([
  {
    id: "disk",
    survey: "read the verso folio (transcript on disk should stay chronological)",
    kind: "disk",
    note: "seeded: disk folio stays ordered — 7,600 rows, complete, no missing turns",
  },
  {
    id: "tree",
    survey: "read the recto gathering (React tree of the stuck page)",
    kind: "tree",
    note: "seeded: 4,438 stream rows run to 22:30:16, then the marker, then 477 moved rows from 18:32–19:24",
  },
  {
    id: "gutter",
    survey: "open the splice gutter (synthetic marker without uuid or timestamp)",
    kind: "gutter",
    note: "seeded: {type:system, subtype:background_tasks_redelivered, tasks:[], source_uuid, session_id}",
  },
  {
    id: "feed",
    survey: "look at the feed bottom (anchored list should end on the latest result)",
    kind: "feed",
    note: "seeded: 161 rendered entries; 145–160 are the eight flashback exchanges; bottom is 19:24",
  },
  {
    id: "quill",
    survey: "watch the working quill (should lift after a result, not a task notification)",
    kind: "quill",
    note: "seeded: list ends on a task notification rather than a result, so the working marker sticks",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "marker-misorder",
  "redelivered",
  "tree-spliced",
  "feed-bottom-early",
  "working-stuck",
  "moved-not-copied",
  "marker-no-stamp",
  "source-pre-compact",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92197,
    title:
      "Desktop app renders an older branch of the session transcript, hiding the most recent days (data intact on disk)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — older branch after compaction, content missing rather than reordered; survives restarts. Do not rebuild",
  },
  {
    issue: 92089,
    title: "same shape after a second /compact",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — reporter's earlier compact-branch miss; do not rebuild",
  },
  {
    issue: 88428,
    title: "conversation reopened after a restart shows no transcript at all",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — empty reopen, data retained; do not rebuild",
  },
  {
    issue: 84858,
    title: "conversation reopened after a restart shows no transcript at all",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — empty reopen cousin; do not rebuild",
  },
  {
    issue: 83247,
    title: "returning to a session leaves the scroll where it was",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — scroll position; here the view was at the bottom and the bottom was wrong",
  },
  {
    issue: 92610,
    title: "WarmLifecycle:preview subsystem tearing down a different surface",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same WarmLifecycle:preview family, different surface; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93574, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93576, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93556, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93553, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93546, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93530, title: "Esc kills an unrelated background subagent irrecoverably", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93570, title: "cite-only backup — do not auto-pick", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "scapegoat",
  "cartulary",
  "paraph",
  "hallmark",
  "diopter",
  "hysteresis",
  "ephemera",
  "flashpan",
  "mirage",
  "glowplug",
  "deadlight",
  "ukase",
  "almanac",
  "stroboscope",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "graft",
  "springe",
  "afterimage",
  "diplopia",
  "espagnolette",
  "trompe",
  "shibboleth",
  "ward",
  "latchkey",
  "bitting",
  "escutcheon",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
  "procrustes",
  "sump",
  "spillway",
  "quietus",
  "rubric",
  "recension",
  "priory",
  "imprimatur",
  "understudy",
  "fetch",
]);

export const SAMPLE_DISK = Object.freeze([
  { uuid: "c0", ts: "17:10:15", role: "system", kind: "compact", text: "/compact sent" },
  { uuid: "c1", ts: "17:12:32", role: "system", kind: "compact", text: "compaction lands" },
  { uuid: "a0", ts: "18:32:26", role: "user", kind: "prompt", text: "first of eight after warmup" },
  { uuid: "a1", ts: "19:24:37.435", role: "system", kind: "task_notification", text: "background task ends the stretch" },
  { uuid: "p0", ts: "19:24:37.438", role: "user", kind: "prompt", text: "transcript page begins" },
  { uuid: "p1", ts: "19:26:24", role: "user", kind: "prompt", text: "refocused; fifteen turns begin" },
  { uuid: "p2", ts: "22:13:56", role: "user", kind: "prompt", text: "switched away mid-turn" },
  { uuid: "p3", ts: "22:30:16", role: "assistant", kind: "result", text: "last completed turn" },
]);

export const SAMPLE_TREE = Object.freeze([
  { uuid: "p0", ts: "19:24:37.438", role: "user", kind: "prompt", text: "transcript page begins" },
  { uuid: "p1", ts: "19:26:24", role: "user", kind: "prompt", text: "refocused; fifteen turns begin" },
  { uuid: "p2", ts: "22:13:56", role: "user", kind: "prompt", text: "switched away mid-turn" },
  { uuid: "p3", ts: "22:30:16", role: "assistant", kind: "result", text: "last completed turn" },
  {
    type: "system",
    subtype: "background_tasks_redelivered",
    tasks: [],
    source_uuid: "src-170126",
    session_id: SESSION_ID,
  },
  { uuid: "a0", ts: "18:32:26", role: "user", kind: "prompt", text: "first of eight after warmup" },
  { uuid: "a1", ts: "19:24:37.435", role: "system", kind: "task_notification", text: "background task ends the stretch" },
]);

export const SAMPLE_FEED = Object.freeze([
  { n: 144, ts: "22:30:16", kind: "result", text: "last completed turn" },
  { n: 145, ts: "18:32:26", kind: "prompt", text: "flashback exchange 1" },
  { n: 160, ts: "19:24:37", kind: "task_notification", text: "block's last row" },
]);

export const ORDERED_FEED = Object.freeze([
  { n: 1, ts: "19:26:24", kind: "prompt", text: "later turns begin" },
  { n: 2, ts: "22:30:16", kind: "result", text: "last completed turn" },
]);

export const SAMPLE_LOG = Object.freeze([
  { t: "17:10:15", line: "LocalSessions.sendMessage (that was /compact)" },
  { t: "17:12:32", line: "the compaction lands" },
  { t: "17:42:32", line: "[WarmLifecycle:preview] Idle timeout reached, disconnecting" },
  { t: "18:30:28", line: "[WarmLifecycle:preview] Warming up session" },
  { t: "18:32-19:09", line: "eight messages sent, seven turns — the block that later moved" },
  { t: "19:24:37", line: "a background task's task_notification, the block's last row" },
  { t: "19:24:44", line: "[WarmLifecycle:preview] Starting idle timeout" },
  { t: "19:25:53", line: "[Stop hook] Query completed" },
  { t: "19:26:24", line: "refocused, then fifteen turns of mine through 22:16" },
  { t: "22:13:56", line: "switched away again, mid-turn" },
  { t: "22:25:09", line: "another session's message started one more turn" },
  { t: "22:30:15", line: "[Stop hook] Query completed, preview idle timer restarted" },
  { t: "22:58:48", line: "[WarmLifecycle:preview] Warming up session — feed already as described" },
]);

export const SAMPLE_MARKER = Object.freeze({
  type: MARKER_TYPE,
  subtype: MARKER_SUBTYPE,
  tasks: [],
  source_uuid: "src-170126",
  session_id: SESSION_ID,
  builtBy: "main-process",
  sourceEvent: SOURCE_EVENT,
  sourceTime: SOURCE_TIME,
  sourceBeforeCompact: true,
  inCliBinary: false,
});

function tsKey(value) {
  if (!value) return null;
  const text = String(value);
  const match = text.match(/(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);
  const frac = Number((match[4] || "0").padEnd(3, "0").slice(0, 3));
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + frac;
}

function isMarker(row) {
  if (!row || typeof row !== "object") return false;
  return (
    row.subtype === MARKER_SUBTYPE ||
    row.kind === "marker" ||
    row.event === "marker-splice" ||
    row.event === MARKER_SUBTYPE
  );
}

function findMarkerIndex(rows) {
  if (!Array.isArray(rows)) return -1;
  return rows.findIndex((row) => isMarker(row));
}

function uuidDupes(rows) {
  const seen = new Map();
  const dupes = [];
  for (const row of rows || []) {
    if (!row || !row.uuid) continue;
    seen.set(row.uuid, (seen.get(row.uuid) || 0) + 1);
    if (seen.get(row.uuid) === 2) dupes.push(row.uuid);
  }
  return dupes;
}

function maxTs(rows) {
  let best = null;
  let bestKey = -1;
  for (const row of rows || []) {
    const key = tsKey(row && (row.ts || row.timestamp));
    if (key != null && key >= bestKey) {
      bestKey = key;
      best = row.ts || row.timestamp;
    }
  }
  return best;
}

function minTs(rows) {
  let best = null;
  let bestKey = Infinity;
  for (const row of rows || []) {
    const key = tsKey(row && (row.ts || row.timestamp));
    if (key != null && key < bestKey) {
      bestKey = key;
      best = row.ts || row.timestamp;
    }
  }
  return best;
}

export function inspectDisk(input = {}) {
  const rows = Array.isArray(input.disk)
    ? input.disk
    : Array.isArray(input.rows)
      ? input.rows
      : SAMPLE_DISK;
  const stamped = rows.filter((row) => tsKey(row.ts || row.timestamp) != null);
  const chronological = stamped.every((row, index) => {
    if (index === 0) return true;
    return tsKey(row.ts || row.timestamp) >= tsKey(stamped[index - 1].ts || stamped[index - 1].timestamp);
  });
  const complete =
    input.diskIntact === true ||
    input.event === "disk-intact" ||
    chronological;
  const forcedBroken = input.diskIntact === false && input.ordered !== true;
  const intact = forcedBroken ? false : complete && chronological;
  return {
    intact,
    chronological,
    stamp: intact ? "chronological" : "shuffled",
    rowCount: rows.length,
    lastTs: maxTs(stamped) || PRESENT_END,
    note: intact
      ? "verso folio chronological — transcript on disk complete and in order"
      : "verso folio shuffled — disk no longer matches the published intact transcript",
  };
}

export function inspectTree(input = {}) {
  const rows = Array.isArray(input.tree)
    ? input.tree
    : Array.isArray(input.reactTree)
      ? input.reactTree
      : input.treeSpliced === false && input.redelivered !== true
        ? SAMPLE_DISK
        : SAMPLE_TREE;
  const markerAt = findMarkerIndex(rows);
  const before = markerAt >= 0 ? rows.slice(0, markerAt) : rows;
  const after = markerAt >= 0 ? rows.slice(markerAt + 1) : [];
  const lastBefore = maxTs(before);
  const firstAfter = minTs(after);
  const lastBeforeKey = tsKey(lastBefore);
  const firstAfterKey = tsKey(firstAfter);
  const moved =
    input.treeSpliced === true ||
    input.event === "tree-spliced" ||
    (markerAt >= 0 &&
      after.length > 0 &&
      firstAfterKey != null &&
      lastBeforeKey != null &&
      firstAfterKey < lastBeforeKey);
  const dupes = uuidDupes(rows);
  return {
    spliced: moved,
    markerAt,
    stamp: moved ? "flashback" : "contiguous",
    movedNotCopied: moved && dupes.length === 0,
    afterCount: after.length,
    lastBefore,
    firstAfter,
    note: moved
      ? "recto gathering spliced — older stretch moved after the present behind the marker"
      : "recto gathering contiguous — React tree matches disk order",
  };
}

export function inspectFeed(input = {}) {
  const entries = Array.isArray(input.feed)
    ? input.feed
    : Array.isArray(input.rendered)
      ? input.rendered
      : input.feedBottomEarly === true ||
          input.redelivered === true ||
          input.treeSpliced === true ||
          input.workingStuck === true
        ? SAMPLE_FEED
        : ORDERED_FEED;
  const last = entries[entries.length - 1] || null;
  const latest = maxTs(entries);
  const lastKey = last ? tsKey(last.ts || last.timestamp) : null;
  const latestKey = tsKey(latest);
  const bottomEarly =
    input.feedBottomEarly === true ||
    input.event === "feed-bottom-early" ||
    (lastKey != null && latestKey != null && lastKey < latestKey) ||
    (last && String(last.ts || "").startsWith("19:24"));
  const workingStuck =
    input.workingStuck === true ||
    input.event === "working-stuck" ||
    (last &&
      last.kind !== "result" &&
      (last.kind === "task_notification" || last.kind === "system"));
  return {
    bottomEarly,
    workingStuck,
    lastTs: last ? last.ts || last.timestamp : null,
    lastKind: last ? last.kind : null,
    entryCount: entries.length,
    stamp: bottomEarly ? "past" : "present",
    note: bottomEarly
      ? "feed bottom lands in the past — anchored list ends on the 19:24 flashback"
      : "feed bottom is the latest result — reader stays in the present",
  };
}

export function inspectLog(input = {}) {
  const events = Array.isArray(input.log)
    ? input.log
    : Array.isArray(input.mainLog)
      ? input.mainLog
      : SAMPLE_LOG;
  const compact = events.some((row) => /compact/i.test(row.line || row.text || ""));
  const idleDisconnect = events.some((row) => /Idle timeout reached, disconnecting/i.test(row.line || row.text || ""));
  const midUnfocus = events.some((row) => /Starting idle timeout|switched away/i.test(row.line || row.text || ""));
  const lateWarm = events.some((row) => /22:58/.test(row.t || "") && /Warming up/i.test(row.line || row.text || ""));
  return {
    compact,
    idleDisconnect,
    midUnfocus,
    lateWarm,
    events,
    stamp: lateWarm ? "already-wrong" : "quiet",
    note: lateWarm
      ? "dusk horizon — refocus at 22:58 found the feed already ending on 19:24; no disconnect after 22:30"
      : "dusk horizon quiet — main.log has not yet shown the post-22:30 warmup",
  };
}

export function inspectMarker(input = {}) {
  const marker =
    input.marker && typeof input.marker === "object"
      ? input.marker
      : SAMPLE_MARKER;
  const present =
    input.markerPresent === true ||
    isMarker(marker) ||
    marker.subtype === MARKER_SUBTYPE;
  const missingUuid = present && !marker.uuid;
  const missingTimestamp = present && !marker.timestamp && !marker.ts;
  const emptyTasks = Array.isArray(marker.tasks) && marker.tasks.length === 0;
  const sourcePreCompact =
    marker.sourceBeforeCompact === true ||
    marker.sourceTime === SOURCE_TIME ||
    input.sourcePreCompact === true;
  const notCli =
    marker.inCliBinary === false ||
    marker.builtBy === "main-process" ||
    input.notCli === true ||
    input.mainProcessBuilt === true;
  return {
    present,
    subtype: present ? MARKER_SUBTYPE : null,
    missingUuid,
    missingTimestamp,
    emptyTasks,
    sourcePreCompact,
    notCli,
    stamp: present ? "splice" : "absent",
    note: present
      ? "gutter slip — synthetic background_tasks_redelivered with no uuid or timestamp; main process, not CLI"
      : "no gutter slip — tree has no background_tasks_redelivered marker",
  };
}

export function collateQuires(input = {}) {
  const disk = inspectDisk(input);
  const tree = inspectTree(input);
  const feed = inspectFeed(input);
  const log = inspectLog(input);
  const marker = inspectMarker(input);
  const redelivered =
    tree.spliced ||
    feed.bottomEarly ||
    input.redelivered === true;
  const ordered =
    input.ordered === true &&
    redelivered !== true &&
    disk.intact &&
    !tree.spliced &&
    !feed.bottomEarly;
  const path =
    marker.present &&
    tree.spliced &&
    (input.event === "marker-misorder" || input.markerMisorder === true);
  return {
    disk,
    tree,
    feed,
    log,
    marker,
    stations: QUIRE_STATIONS,
    redelivered: redelivered && !ordered,
    ordered:
      ordered ||
      (disk.intact &&
        !tree.spliced &&
        !feed.bottomEarly &&
        input.redelivered !== true &&
        input.markerMisorder !== true),
    markerMisorder: path && !ordered,
    mark:
      path && !ordered
        ? "marker-misorder"
        : redelivered && !ordered
          ? "redelivered"
          : "ordered",
  };
}

/**
 * Published analepsis walk from #93569 only. Facts from the issue text.
 * An ordered booth keeps disk, tree, and feed chronological.
 * A redelivered booth moves the 18:32–19:24 stretch after 22:30.
 * A marker-misorder booth names the synthetic splice as the cut.
 */
export const ANALEPSIS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-ordered",
    ordered: true,
    redelivered: false,
    diskIntact: true,
    cue: "ordered",
    note: "idle HOLD: disk, React tree, and feed agree — reader stays in the present",
  },
  {
    t: "compact",
    event: "compact-then-idle",
    ordered: true,
    compactThenIdle: true,
    cue: "ordered",
    note: "17:10:15 /compact; 17:12:32 compaction lands; 17:42 idle timeout disconnects",
  },
  {
    t: "warmup",
    event: "mid-turn-unfocus",
    redelivered: false,
    midTurnUnfocus: true,
    cue: "ordered",
    note: "18:30 warmup; eight turns 18:32–19:09; switched away mid-turn at 19:24:44",
  },
  {
    t: "later",
    event: "disk-intact",
    ordered: true,
    diskIntact: true,
    cue: "ordered",
    note: "19:26–22:16 fifteen turns; 22:30 last result; disk stays complete and ordered",
  },
  {
    t: "splice",
    event: "marker-splice",
    redelivered: true,
    markerPresent: true,
    treeSpliced: true,
    cue: "redelivered",
    note: "synthetic background_tasks_redelivered lands after 22:30:16 with no uuid or timestamp",
  },
  {
    t: "move",
    event: "tree-spliced",
    redelivered: true,
    treeSpliced: true,
    movedNotCopied: true,
    cue: "redelivered",
    note: "477 rows from 18:32:26 to 19:24:37 move after the marker; no uuid appears twice",
  },
  {
    t: "bottom",
    event: "feed-bottom-early",
    redelivered: true,
    feedBottomEarly: true,
    cue: "redelivered",
    note: "161 rendered entries; 145–160 are the eight flashback exchanges; bottom is 19:24",
  },
  {
    t: "quill",
    event: "working-stuck",
    redelivered: true,
    workingStuck: true,
    cue: "redelivered",
    note: "list ends on a task notification rather than a result, so the working marker sticks",
  },
  {
    t: "source",
    event: "source-pre-compact",
    redelivered: true,
    sourcePreCompact: true,
    cue: "redelivered",
    note: "source_uuid pointed at background_tasks_changed of 17:01:26, last before compaction",
  },
  {
    t: "path",
    event: "marker-misorder",
    redelivered: true,
    markerMisorder: true,
    markerPresent: true,
    treeSpliced: true,
    cue: "redelivered",
    note: "marker-misorder — the splice, not a missing transcript, puts the past after the present",
  },
  {
    t: "score",
    event: "analepsis",
    redelivered: true,
    treeSpliced: true,
    feedBottomEarly: true,
    workingStuck: true,
    markerPresent: true,
    cue: "redelivered",
    note: "analepsis — an earlier narrative stretch is re-inserted after the present",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "reload",
    event: "reload-fixes",
    ordered: true,
    reloadFixes: true,
    cue: "ordered",
    note: "positive control: Cmd+R rebuilds the page; everything comes back in order",
  },
  {
    t: "disk",
    event: "disk-intact",
    ordered: true,
    diskIntact: true,
    cue: "ordered",
    note: "positive control: transcript on disk was complete and in order the whole time",
  },
  {
    t: "merge",
    event: "cue-ordered",
    ordered: true,
    cue: "ordered",
    note: "desired: a re-delivered batch merges by uuid at its original position, or replaces the list wholesale",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    ordered: true,
    redelivered: false,
    diskIntact: true,
    cue: "ordered",
  };
}

export function seedOrdered() {
  return { ...emptyTicket() };
}

export function seedRedelivered() {
  return {
    seed: SEEDED_WORD,
    ordered: false,
    redelivered: true,
    diskIntact: true,
    treeSpliced: true,
    feedBottomEarly: true,
    workingStuck: true,
    movedNotCopied: true,
    markerPresent: true,
    markerMisorder: true,
    sourcePreCompact: true,
    cue: "redelivered",
    issue: FEATURED_ISSUE,
    tree: SAMPLE_TREE,
    feed: SAMPLE_FEED,
    marker: SAMPLE_MARKER,
  };
}

export function seedAnalepsis() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    redelivered: true,
    treeSpliced: true,
    feedBottomEarly: true,
    workingStuck: true,
    markerPresent: true,
    cue: "redelivered",
  };
}

export function seedMarkerMisorder() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    redelivered: true,
    markerMisorder: true,
    markerPresent: true,
    treeSpliced: true,
    event: "marker-misorder",
    cue: "redelivered",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    ordered: true,
    cue: "ordered",
  };
}

export function seedDiskIntact() {
  return {
    seed: "disk-intact",
    preferSeed: true,
    diskIntact: true,
    cue: "ordered",
  };
}

export function seedTreeSpliced() {
  return {
    seed: "tree-spliced",
    preferSeed: true,
    treeSpliced: true,
    cue: "redelivered",
  };
}

export function seedFeedBottomEarly() {
  return {
    seed: "feed-bottom-early",
    preferSeed: true,
    feedBottomEarly: true,
    cue: "redelivered",
  };
}

export function seedWorkingStuck() {
  return {
    seed: "working-stuck",
    preferSeed: true,
    workingStuck: true,
    cue: "redelivered",
  };
}

export function seedMovedNotCopied() {
  return {
    seed: "moved-not-copied",
    preferSeed: true,
    movedNotCopied: true,
    cue: "redelivered",
  };
}

export function seedNoUuidDup() {
  return {
    seed: "no-uuid-dup",
    preferSeed: true,
    noUuidDup: true,
    cue: "redelivered",
  };
}

export function seedMarkerNoStamp() {
  return {
    seed: "marker-no-stamp",
    preferSeed: true,
    markerNoStamp: true,
    cue: "redelivered",
  };
}

export function seedSourcePreCompact() {
  return {
    seed: "source-pre-compact",
    preferSeed: true,
    sourcePreCompact: true,
    cue: "redelivered",
  };
}

export function seedMainProcessBuilt() {
  return {
    seed: "main-process-built",
    preferSeed: true,
    mainProcessBuilt: true,
    cue: "redelivered",
  };
}

export function seedNotCli() {
  return {
    seed: "not-cli",
    preferSeed: true,
    notCli: true,
    cue: "redelivered",
  };
}

export function seedReloadFixes() {
  return {
    seed: "reload-fixes",
    preferSeed: true,
    reloadFixes: true,
    cue: "ordered",
  };
}

export function seedPopoutInherited() {
  return {
    seed: "popout-inherited",
    preferSeed: true,
    popoutInherited: true,
    cue: "redelivered",
  };
}

export function seedIpcOnly() {
  return {
    seed: "ipc-only",
    preferSeed: true,
    ipcOnly: true,
    cue: "redelivered",
  };
}

export function seedCompactThenIdle() {
  return {
    seed: "compact-then-idle",
    preferSeed: true,
    compactThenIdle: true,
    cue: "ordered",
  };
}

export function seedMidTurnUnfocus() {
  return {
    seed: "mid-turn-unfocus",
    preferSeed: true,
    midTurnUnfocus: true,
    cue: "ordered",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      ordered: false,
      redelivered: false,
      markerMisorder: false,
      diskIntact: false,
      treeSpliced: false,
      feedBottomEarly: false,
      workingStuck: false,
      movedNotCopied: false,
      noUuidDup: false,
      markerPresent: false,
      markerNoStamp: false,
      sourcePreCompact: false,
      mainProcessBuilt: false,
      notCli: false,
      reloadFixes: false,
      popoutInherited: false,
      ipcOnly: false,
      compactThenIdle: false,
      midTurnUnfocus: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    ordered: raw.ordered === true,
    redelivered:
      raw.redelivered === true ||
      raw.event === "redelivered" ||
      raw.event === "analepsis",
    markerMisorder:
      raw.markerMisorder === true ||
      raw.event === "marker-misorder",
    diskIntact: raw.diskIntact === true || raw.event === "disk-intact",
    treeSpliced:
      raw.treeSpliced === true ||
      raw.event === "tree-spliced" ||
      raw.event === "marker-splice",
    feedBottomEarly:
      raw.feedBottomEarly === true || raw.event === "feed-bottom-early",
    workingStuck: raw.workingStuck === true || raw.event === "working-stuck",
    movedNotCopied:
      raw.movedNotCopied === true || raw.event === "moved-not-copied",
    noUuidDup: raw.noUuidDup === true || raw.event === "no-uuid-dup",
    markerPresent:
      raw.markerPresent === true ||
      raw.event === "marker-splice" ||
      Boolean(raw.marker && raw.marker.subtype === MARKER_SUBTYPE),
    markerNoStamp:
      raw.markerNoStamp === true || raw.event === "marker-no-stamp",
    sourcePreCompact:
      raw.sourcePreCompact === true || raw.event === "source-pre-compact",
    mainProcessBuilt:
      raw.mainProcessBuilt === true || raw.event === "main-process-built",
    notCli: raw.notCli === true || raw.event === "not-cli",
    reloadFixes: raw.reloadFixes === true || raw.event === "reload-fixes",
    popoutInherited:
      raw.popoutInherited === true || raw.event === "popout-inherited",
    ipcOnly: raw.ipcOnly === true || raw.event === "ipc-only",
    compactThenIdle:
      raw.compactThenIdle === true || raw.event === "compact-then-idle",
    midTurnUnfocus:
      raw.midTurnUnfocus === true || raw.event === "mid-turn-unfocus",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    disk: raw.disk,
    tree: raw.tree || raw.reactTree,
    feed: raw.feed || raw.rendered,
    log: raw.log || raw.mainLog,
    marker: raw.marker,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.ordered != null ||
        ticket.redelivered != null ||
        ticket.markerMisorder != null ||
        ticket.diskIntact != null ||
        ticket.treeSpliced != null ||
        ticket.feedBottomEarly != null ||
        ticket.workingStuck != null ||
        ticket.movedNotCopied != null ||
        ticket.markerPresent != null ||
        ticket.markerNoStamp != null ||
        ticket.sourcePreCompact != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.tree ||
        ticket.feed ||
        ticket.marker),
  );
}

function isOrdered(row) {
  if (row.redelivered && row.cue !== "ordered") return false;
  if (
    row.cue === "redelivered" ||
    row.cue === "analepsis" ||
    row.cue === "marker-misorder"
  ) {
    return false;
  }
  if (
    row.treeSpliced &&
    row.feedBottomEarly &&
    row.cue !== "ordered" &&
    row.ordered !== true
  ) {
    return false;
  }
  if (
    row.markerMisorder &&
    row.markerPresent &&
    row.cue !== "ordered" &&
    row.ordered !== true
  ) {
    return false;
  }
  if (
    row.ordered === true &&
    row.redelivered !== true &&
    row.cue !== "redelivered"
  ) {
    return true;
  }
  if (
    row.cue === "ordered" &&
    row.redelivered !== true &&
    row.treeSpliced !== true &&
    row.markerMisorder !== true
  ) {
    return true;
  }
  if (
    (row.diskIntact === true ||
      row.reloadFixes === true ||
      row.compactThenIdle === true) &&
    row.redelivered !== true &&
    row.treeSpliced !== true &&
    row.feedBottomEarly !== true &&
    row.markerMisorder !== true
  ) {
    return true;
  }
  return false;
}

function isMarkerMisorderPath(row) {
  return (
    row.event === "marker-misorder" &&
    !isOrdered(row) &&
    (row.markerMisorder === true ||
      row.markerPresent === true ||
      row.treeSpliced === true)
  );
}

function isRedelivered(row) {
  if (isOrdered(row)) return false;
  if (isMarkerMisorderPath(row) && row.cue !== "redelivered") return false;
  if (row.cue === "redelivered" || row.cue === "analepsis") return true;
  if (row.redelivered === true) return true;
  if (row.treeSpliced === true && row.feedBottomEarly === true && row.workingStuck === true) {
    return true;
  }
  if (row.markerPresent === true && row.treeSpliced === true) {
    return true;
  }
  if (
    row.feedBottomEarly === true ||
    row.workingStuck === true ||
    row.movedNotCopied === true ||
    (row.markerPresent === true && row.sourcePreCompact === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one collation pass against the analepsis booth.
 * ordered: disk, tree, and feed agree on chronology.
 * redelivered: older stretch moved after present behind the marker.
 * marker-misorder: the synthetic splice is the cut that reorders the feed.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMarkerMisorderPath(row) ||
    (row.markerMisorder && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "marker-misorder";
  } else if (isRedelivered(row)) {
    verdict = "redelivered";
  } else if (isOrdered(row)) {
    verdict = "ordered";
  } else if (
    row.treeSpliced ||
    row.feedBottomEarly ||
    row.workingStuck ||
    (row.markerPresent && !row.reloadFixes)
  ) {
    verdict = "redelivered";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const disk = inspectDisk(row);
  const tree = inspectTree(row);
  const feed = inspectFeed(row);
  const log = inspectLog(row);
  const marker = inspectMarker(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    ordered: verdict === "ordered" || verdict === "hold",
    redelivered:
      verdict === "redelivered" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    markerMisorder:
      row.markerMisorder === true ||
      verdict === "marker-misorder" ||
      verdict === PATH_WORD,
    diskIntact: row.diskIntact,
    treeSpliced: row.treeSpliced,
    feedBottomEarly: row.feedBottomEarly,
    workingStuck: row.workingStuck,
    movedNotCopied: row.movedNotCopied,
    noUuidDup: row.noUuidDup,
    markerPresent: row.markerPresent,
    markerNoStamp: row.markerNoStamp,
    sourcePreCompact: row.sourcePreCompact,
    mainProcessBuilt: row.mainProcessBuilt,
    notCli: row.notCli,
    reloadFixes: row.reloadFixes,
    popoutInherited: row.popoutInherited,
    ipcOnly: row.ipcOnly,
    compactThenIdle: row.compactThenIdle,
    midTurnUnfocus: row.midTurnUnfocus,
    cue: hold
      ? "ordered"
      : row.markerMisorder || verdict === "marker-misorder"
        ? "marker-misorder"
        : "redelivered",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit ordered" : "score analepsis",
    diskInspect: disk,
    treeInspect: tree,
    feedInspect: feed,
    logInspect: log,
    markerInspect: marker,
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
      : ANALEPSIS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const redelivered = scored.filter((row) => row.verdict === "redelivered");
  const path = scored.filter((row) => row.verdict === "marker-misorder");
  const ordered = scored.filter((row) => row.verdict === "ordered");
  const headline =
    scored.find((row) => row.event === "redelivered") ||
    scored.find((row) => row.event === "marker-misorder") ||
    scored.find((row) => row.event === "tree-spliced") ||
    redelivered[redelivered.length - 1];
  let verdict = "ordered";
  if (redelivered.length) verdict = "redelivered";
  else if (path.length && !ordered.length) verdict = "marker-misorder";
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
    redeliveredCount: redelivered.length,
    pathCount: path.length,
    orderedCount: ordered.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit ordered" : "score analepsis",
    note: headline
      ? "Claude Code 2.1.260 / desktop 1.49585.0; disk intact; React tree spliced at background_tasks_redelivered; 477 rows moved; feed ends on 19:24; working marker stuck."
      : "published analepsis walk scored against ordered vs redelivered",
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
    seeded !== "ordered" &&
    seeded !== "redelivered" &&
    seeded !== "marker-misorder" &&
    seeded !== "analepsis" &&
    ticket.ordered == null &&
    ticket.redelivered == null &&
    ticket.treeSpliced == null &&
    ticket.markerMisorder == null &&
    ticket.feedBottomEarly == null &&
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
    ordered: scored.ordered ?? false,
    redelivered: scored.redelivered ?? false,
    markerMisorder: scored.markerMisorder ?? false,
    diskIntact: scored.diskIntact ?? false,
    treeSpliced: scored.treeSpliced ?? false,
    feedBottomEarly: scored.feedBottomEarly ?? false,
    workingStuck: scored.workingStuck ?? false,
    movedNotCopied: scored.movedNotCopied ?? false,
    markerPresent: scored.markerPresent ?? false,
    sourcePreCompact: scored.sourcePreCompact ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.diskIntact || result.ordered
      ? "disk=chronological"
      : "disk=shuffled",
    result.treeSpliced || result.redelivered
      ? "tree=flashback"
      : "tree=contiguous",
    result.feedBottomEarly || result.redelivered
      ? "feed=past"
      : "feed=present",
    result.workingStuck || result.redelivered
      ? "quill=stuck"
      : "quill=lifted",
    result.markerPresent || result.verdict === "marker-misorder"
      ? "gutter=splice"
      : "gutter=absent",
    result.markerMisorder || result.verdict === "marker-misorder"
      ? "path=marker-misorder"
      : "path=ordered",
    result.cue === "ordered"
      ? "cue=ordered"
      : result.cue === "marker-misorder"
        ? "cue=marker-misorder"
        : "cue=redelivered",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const quires = collateQuires({
    ordered: result.ordered,
    redelivered: result.redelivered,
    markerMisorder: result.markerMisorder,
    diskIntact: result.diskIntact,
    treeSpliced: result.treeSpliced,
    feedBottomEarly: result.feedBottomEarly,
    workingStuck: result.workingStuck,
    movedNotCopied: result.movedNotCopied,
    markerPresent: result.markerPresent,
    sourcePreCompact: result.sourcePreCompact,
    tree: input && input.tree,
    feed: input && input.feed,
    marker: input && input.marker,
    disk: input && input.disk,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    quires,
    disk: inspectDisk({
      ordered: result.ordered,
      diskIntact: result.diskIntact,
      disk: input && input.disk,
    }),
    tree: inspectTree({
      ordered: result.ordered,
      redelivered: result.redelivered,
      treeSpliced: result.treeSpliced,
      tree: input && input.tree,
    }),
    feed: inspectFeed({
      feedBottomEarly: result.feedBottomEarly,
      workingStuck: result.workingStuck,
      feed: input && input.feed,
    }),
    log: inspectLog({
      log: input && input.log,
    }),
    marker: inspectMarker({
      markerPresent: result.markerPresent,
      sourcePreCompact: result.sourcePreCompact,
      mainProcessBuilt: result.mainProcessBuilt,
      notCli: result.notCli,
      marker: input && input.marker,
    }),
    stations: QUIRE_STATIONS.map((row) => ({
      ...row,
      redelivered: result.redelivered === true || result.verdict === "redelivered",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      os: OS,
      client: CLIENT,
      desktopBuild: DESKTOP_BUILD,
      model: MODEL,
      platform: PLATFORM,
      sessionId: SESSION_ID,
      streamRows: STREAM_ROWS,
      movedRows: MOVED_ROWS,
      renderedEntries: RENDERED_ENTRIES,
      flashbackEntryStart: FLASHBACK_ENTRY_START,
      flashbackEntryEnd: FLASHBACK_ENTRY_END,
      presentEnd: PRESENT_END,
      flashbackStart: FLASHBACK_START,
      flashbackEnd: FLASHBACK_END,
      markerSubtype: MARKER_SUBTYPE,
      markerType: MARKER_TYPE,
      sourceEvent: SOURCE_EVENT,
      sourceTime: SOURCE_TIME,
      compactSent: COMPACT_SENT,
      compactLands: COMPACT_LANDS,
      transcriptPageStart: TRANSCRIPT_PAGE_START,
      redeliveredBlockEnd: REDELIVERED_BLOCK_END,
      listenerWarn: LISTENER_WARN,
      markerString: MARKER_STRING,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: QUIRE_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "A re-delivered batch merges into the list by uuid at its original position, or replaces the list wholesale",
        "It never lands after newer messages",
        "The feed bottom should be the latest result, not an hours-earlier task notification",
      ],
      hypothesis:
        "NON-BINDING: treat the synthetic background_tasks_redelivered marker as the splice point that reorders the feed. Main process builds it from a background_tasks_changed event (source_uuid pointed at the last such event before compaction). Verify against #93569 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
