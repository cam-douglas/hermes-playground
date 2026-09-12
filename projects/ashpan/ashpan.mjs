#!/usr/bin/env node
/**
 * Ashpan — industrial grate / ashpan / foundry booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * delete_session (MCP or UI) removes a spawned/child task session from
 * the app session index, but the underlying transcript .jsonl named by
 * the mapped CLI UUID stays on disk fully intact and readable. The
 * documented unrecoverable guarantee (transcript, record, worktree)
 * fails for this session type.
 *
 *   node ashpan.mjs data/ashpanned.json
 *   echo '{"seed":"ashpanned"}' | node ashpan.mjs
 *
 * Idle word is swept (HOLD: transcript gone with the index).
 * Seeded word is ashpanned (#93780 — index cleared; orphan jsonl remains).
 * Path word is orphan-jsonl.
 * Product score word is ashpan (Score ashpan or admit swept.).
 *
 * Encoded from anthropics/claude-code#93780 issue text only.
 * Hypothesis (NON-BINDING): delete_session may key file removal on the
 * internal local_<uuid> path while the on-disk transcript is named by
 * the mapped CLI UUID; spawned-child sessions may skip the file-unlink
 * branch that top-level deletes take. Verify against #93780 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "swept",
  "ashpanned",
  "ashpan",
  "orphan-jsonl",
  "hold",
  "spawned-child",
  "index-gone",
  "cli-uuid-split",
  "file-lingers",
  "list-blank",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "swept";
export const PATH_WORD = "orphan-jsonl";
export const SEEDED_WORD = "ashpanned";
export const PRODUCT_WORD = "ashpan";
export const HOLD = Object.freeze(["swept", "hold"]);
export const RECOVER = Object.freeze(["swept", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "blank",
  "innominate",
  "icon-only",
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "intact",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "ashpanned" && name !== "ashpan"),
);

export const FEATURED_ISSUE = 93780;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93780";
export const TITLE =
  "delete_session leaves the transcript .jsonl on disk for spawned/child task sessions";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:security",
  "area:agents",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.266";
export const SURFACE = "Claude Code desktop 2.1.266, macOS";
export const SESSION_KIND =
  "spawned background/scheduled child (spawn_task / scheduled-task-launched), not a top-level interactive session. Claude Code desktop 2.1.266, macOS.";
export const INTERNAL_ID = "local_14e76123-1f6e-45a2-9fc9-4c57b0880187";
export const CLI_UUID = "98d5ed86-0690-45e2-bcb9-4e6eeaeffbab";
export const TRANSCRIPT_NAME = "98d5ed86-0690-45e2-bcb9-4e6eeaeffbab.jsonl";
export const TRANSCRIPT_PATH =
  "~/.claude/projects/<project>/98d5ed86-0690-45e2-bcb9-4e6eeaeffbab.jsonl";
export const TRANSCRIPT_SIZE = "~2.9MB";
export const DELETE_LOG = "LocalSessions.delete / Archived / Deleted";
export const GET_SESSION = "not found";
export const PHRASE = "Score ashpan or admit swept.";
export const DISTRIBUTION =
  "Deleting via delete_session MCP (or UI) removes the session from the app session index. For a spawned child task session, the underlying transcript .jsonl under ~/.claude/projects/<project>/<sessionId>.jsonl is left behind fully intact and readable. This contradicts delete_session's documented behaviour: transcript, record and worktree (with branch) are removed and cannot be recovered. Logs show LocalSessions.delete / Archived / Deleted completing normally for internal id local_14e76123-1f6e-45a2-9fc9-4c57b0880187. get_session on that internal id returns not found (index genuinely gone). Transcript file's internal sessionId field is a different UUID (CLI session 98d5ed86-0690-45e2-bcb9-4e6eeaeffbab); mapping logged separately. File at .../98d5ed86-0690-45e2-bcb9-4e6eeaeffbab.jsonl still exists after deletion at full size (~2.9MB observed), still parseable. list_sessions and search_session_transcripts show no trace (consistent with index deletion). Raw file remains readable from disk by any process with filesystem access. Separate related gap: list_sessions may not enumerate spawned child task sessions at all. Expected: transcript unrecoverable after deletion; at minimum delete the raw .jsonl with the index record. Privacy/content-removal users rely on the documented unrecoverable guarantee; for this session type it fails.";
export const RULED_OUT = Object.freeze([
  "transcript JSONL corruption / unsynchronized writers (#81843)",
  "auto-assign spawned/child sessions to parent sidebar group (#82788)",
  "parent observe spawned children / spawnedBy lineage in list_sessions (#71773)",
  "fabricated user turn / system-reminder (#79293)",
]);
export const EXPECTED = Object.freeze([
  "transcript unrecoverable after deletion",
  "at minimum delete the raw .jsonl with the index record",
]);

export const ASHPAN_TRAYS = Object.freeze([
  { id: "grate", label: "cast-iron grate", count: "burned", note: "index ledger entry gone" },
  { id: "pan", label: "ashpan tray", count: "ash", note: "orphan jsonl sits under the grate" },
  { id: "ledger", label: "delete stamp", count: "archived", note: "LocalSessions.delete completed" },
  { id: "mapping", label: "UUID split", count: "mapped", note: "internal local_ vs CLI uuid" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "index-lane",
    survey: "watch delete_session burn the ledger entry",
    kind: "index",
    note: "seeded: LocalSessions.delete / Archived / Deleted for local_14e76123-1f6e-45a2-9fc9-4c57b0880187; get_session not found",
  },
  {
    id: "file-pan",
    survey: "look under the grate for leftover ash",
    kind: "file",
    note: "seeded: .../98d5ed86-0690-45e2-bcb9-4e6eeaeffbab.jsonl still exists at ~2.9MB, parseable",
  },
  {
    id: "uuid-split",
    survey: "read the internal-id vs CLI-uuid mapping chips",
    kind: "uuid",
    note: "seeded: internal local_14e76123-1f6e-45a2-9fc9-4c57b0880187 maps to CLI 98d5ed86-0690-45e2-bcb9-4e6eeaeffbab",
  },
  {
    id: "spawn-lane",
    survey: "badge the spawned/scheduled child, not a top-level session",
    kind: "spawn",
    note: "seeded: spawn_task / scheduled-task-launched child, not a top-level interactive session",
  },
  {
    id: "list-lane",
    survey: "check list_sessions and search_session_transcripts",
    kind: "list",
    note: "seeded: list_sessions and search_session_transcripts show no trace",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "orphan-jsonl",
  "ashpanned",
  "spawned-child",
  "index-gone",
  "cli-uuid-split",
  "file-lingers",
  "list-blank",
]);

export const COUSINS = Object.freeze([
  {
    issue: 81843,
    title: "Transcript JSONL corruption; unsynchronized writers",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #81843 Transcript JSONL corruption; unsynchronized writers. Related jsonl surface, not this delete-orphan gap. Do not rebuild",
  },
  {
    issue: 82788,
    title: "Auto-assign spawned/child sessions to parent sidebar group",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #82788 Auto-assign spawned/child sessions to parent sidebar group. Related spawned-child grouping, not delete leftover ash. Do not rebuild",
  },
  {
    issue: 71773,
    title: "Parent observe spawned children / spawnedBy lineage in list_sessions",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #71773 Parent observe spawned children / spawnedBy lineage in list_sessions. Related list_sessions gap for children, not the orphan jsonl after delete. Do not rebuild",
  },
  {
    issue: 79293,
    title: "Fabricated user turn / system-reminder",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #79293 Fabricated user turn / system-reminder. Different defect; cite only. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93778, title: "backup #93778", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93750, title: "backup #93750", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93733, title: "backup #93733", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93779, title: "backup #93779", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "reliquary",
  "cenotaph",
  "wraith",
  "afterimage",
  "midden",
  "oubliette",
  "quench",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "scrim",
  "knock",
  "palimpsest",
  "ephemera",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
  "disseisin",
  "analepsis",
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
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "homonym",
]);

export const SAMPLE_INDEX = Object.freeze({
  internalId: INTERNAL_ID,
  deleted: true,
  archived: true,
  getSession: GET_SESSION,
  gone: true,
});

export const SAMPLE_SWEPT_INDEX = Object.freeze({
  internalId: INTERNAL_ID,
  deleted: true,
  archived: true,
  getSession: GET_SESSION,
  gone: true,
});

export const SAMPLE_FILE = Object.freeze({
  cliUuid: CLI_UUID,
  name: TRANSCRIPT_NAME,
  path: TRANSCRIPT_PATH,
  size: TRANSCRIPT_SIZE,
  parseable: true,
  lingers: true,
});

export const SAMPLE_SWEPT_FILE = Object.freeze({
  cliUuid: CLI_UUID,
  name: TRANSCRIPT_NAME,
  path: TRANSCRIPT_PATH,
  size: "0",
  parseable: false,
  lingers: false,
});

export const SAMPLE_UUID = Object.freeze({
  internalId: INTERNAL_ID,
  cliUuid: CLI_UUID,
  split: true,
  mapped: true,
});

export const SAMPLE_SWEPT_UUID = Object.freeze({
  internalId: INTERNAL_ID,
  cliUuid: CLI_UUID,
  split: false,
  mapped: true,
});

export const SAMPLE_LIST = Object.freeze({
  listSessions: false,
  searchTranscripts: false,
  blank: true,
});

export const SAMPLE_SWEPT_LIST = Object.freeze({
  listSessions: false,
  searchTranscripts: false,
  blank: true,
});

export const SAMPLE_SPAWN = Object.freeze({
  spawned: true,
  kind: "spawn_task / scheduled-task-launched",
  topLevel: false,
});

export const SAMPLE_SWEPT_SPAWN = Object.freeze({
  spawned: true,
  kind: "spawn_task / scheduled-task-launched",
  topLevel: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "grate holds: delete_session removes index and the raw .jsonl — transcript unrecoverable" },
  { t: "spawned-child", line: "affected session is a spawned background/scheduled child, not a top-level interactive session" },
  { t: "index-gone", line: "LocalSessions.delete / Archived / Deleted for local_14e76123-1f6e-45a2-9fc9-4c57b0880187; get_session not found" },
  { t: "cli-uuid-split", line: "transcript sessionId is CLI uuid 98d5ed86-0690-45e2-bcb9-4e6eeaeffbab — mapping logged separately" },
  { t: "file-lingers", line: ".../98d5ed86-0690-45e2-bcb9-4e6eeaeffbab.jsonl still exists at ~2.9MB, still parseable" },
  { t: "list-blank", line: "list_sessions and search_session_transcripts show no trace" },
  { t: "orphan-jsonl", line: "raw file remains readable from disk by any process with filesystem access" },
  { t: "path", line: "orphan-jsonl — the ash sits in the pan under the grate" },
  { t: "score", line: "when the index burns but the jsonl remains the booth is ashpan — Score ashpan or admit swept." },
]);

export function inspectIndex(input = {}) {
  const index =
    input.index && typeof input.index === "object"
      ? input.index
      : SAMPLE_INDEX;
  const forcedGone =
    input.indexGone === true ||
    input.event === "index-gone" ||
    input.event === "ashpanned" ||
    input.event === "ashpan" ||
    input.event === "orphan-jsonl";
  const gone = forcedGone ? true : index.gone === true;
  return {
    internalId: index.internalId || INTERNAL_ID,
    deleted: gone,
    archived: gone,
    getSession: gone ? GET_SESSION : "found",
    gone,
    stamp: gone ? "ledger-burned" : "ledger-held",
    note: gone
      ? "index genuinely gone — get_session returns not found after LocalSessions.delete"
      : "index still lists the session — delete has not burned the ledger",
  };
}

export function inspectFile(input = {}) {
  const file =
    input.file && typeof input.file === "object"
      ? input.file
      : input.swept === true && input.ashpanned !== true
        ? SAMPLE_SWEPT_FILE
        : SAMPLE_FILE;
  const forcedLinger =
    input.fileLingers === true ||
    input.event === "file-lingers" ||
    input.event === "orphan-jsonl" ||
    input.event === "ashpanned" ||
    input.event === "ashpan";
  const lingers = forcedLinger
    ? true
    : file.lingers === true && input.swept !== true;
  return {
    cliUuid: file.cliUuid || CLI_UUID,
    name: file.name || TRANSCRIPT_NAME,
    path: file.path || TRANSCRIPT_PATH,
    size: lingers ? TRANSCRIPT_SIZE : "0",
    parseable: lingers,
    lingers,
    stamp: lingers ? "ash-in-pan" : "pan-swept",
    note: lingers
      ? "CLI-uuid jsonl still exists at full size (~2.9MB), still parseable"
      : "raw .jsonl gone with the index — pan swept",
  };
}

export function inspectUuid(input = {}) {
  const uuid =
    input.uuid && typeof input.uuid === "object"
      ? input.uuid
      : input.swept === true && input.ashpanned !== true
        ? SAMPLE_SWEPT_UUID
        : SAMPLE_UUID;
  const forcedSplit =
    input.cliUuidSplit === true ||
    input.event === "cli-uuid-split" ||
    input.event === "ashpanned" ||
    input.event === "ashpan" ||
    input.event === "orphan-jsonl";
  const split = forcedSplit ? true : uuid.split === true;
  return {
    internalId: INTERNAL_ID,
    cliUuid: CLI_UUID,
    split,
    mapped: true,
    stamp: split ? "uuid-split" : "uuid-bound",
    note: split
      ? "internal local_14e76123-1f6e-45a2-9fc9-4c57b0880187 maps to a different CLI uuid"
      : "delete keyed the same id the file is named by",
  };
}

export function inspectList(input = {}) {
  const list =
    input.list && typeof input.list === "object"
      ? input.list
      : SAMPLE_LIST;
  const forcedBlank =
    input.listBlank === true ||
    input.event === "list-blank" ||
    input.event === "ashpanned" ||
    input.event === "ashpan";
  const blank = forcedBlank ? true : list.blank === true;
  return {
    listSessions: false,
    searchTranscripts: false,
    blank,
    stamp: blank ? "list-blank" : "list-shows",
    note: blank
      ? "list_sessions and search_session_transcripts show no trace"
      : "list still enumerates the session",
  };
}

export function inspectSpawn(input = {}) {
  const spawn =
    input.spawn && typeof input.spawn === "object"
      ? input.spawn
      : SAMPLE_SPAWN;
  const forcedSpawn =
    input.spawnedChild === true ||
    input.event === "spawned-child" ||
    input.event === "ashpanned" ||
    input.event === "ashpan" ||
    input.event === "orphan-jsonl";
  const spawned = forcedSpawn ? true : spawn.spawned === true;
  return {
    spawned,
    kind: "spawn_task / scheduled-task-launched",
    topLevel: !spawned,
    stamp: spawned ? "spawned-child" : "top-level",
    note: spawned
      ? "spawned background/scheduled child — not a top-level interactive session"
      : "top-level interactive session",
  };
}

export function readBooth(input = {}) {
  const index = inspectIndex(input);
  const file = inspectFile(input);
  const uuid = inspectUuid(input);
  const list = inspectList(input);
  const spawn = inspectSpawn(input);
  const ashpanned =
    input.swept !== true &&
    ((index.gone && file.lingers) ||
      (file.lingers && spawn.spawned) ||
      input.ashpanned === true);
  const swept =
    input.swept === true && ashpanned !== true && !file.lingers;
  const path =
    file.lingers &&
    (input.event === "orphan-jsonl" || input.orphanJsonl === true);
  return {
    index,
    file,
    uuid,
    list,
    spawn,
    trays: ASHPAN_TRAYS,
    stations: BOOTH_STATIONS,
    ashpanned: ashpanned && !swept && !path,
    swept:
      swept ||
      (!file.lingers &&
        input.ashpanned !== true &&
        input.orphanJsonl !== true),
    orphanJsonl: path && !swept,
    mark:
      path && !swept
        ? "orphan-jsonl"
        : ashpanned && !swept
          ? "ashpanned"
          : "swept",
  };
}

/**
 * Published ashpan walk from #93780 only. Facts from the issue text.
 * A swept booth deletes the raw .jsonl with the index record.
 * An ashpanned booth burns the ledger and leaves the CLI-uuid jsonl.
 * An orphan-jsonl booth names the leftover-file path.
 */
export const ASHPAN_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-swept",
    swept: true,
    ashpanned: false,
    cue: "swept",
    note: "idle HOLD: transcript gone with the index — the hold/good path",
  },
  {
    t: "spawned-child",
    event: "spawned-child",
    ashpanned: true,
    spawnedChild: true,
    cue: "ashpanned",
    note: "spawned background/scheduled child (spawn_task / scheduled-task-launched)",
  },
  {
    t: "index-gone",
    event: "index-gone",
    ashpanned: true,
    indexGone: true,
    cue: "ashpanned",
    note: "LocalSessions.delete / Archived / Deleted; get_session not found",
  },
  {
    t: "cli-uuid-split",
    event: "cli-uuid-split",
    ashpanned: true,
    cliUuidSplit: true,
    cue: "ashpanned",
    note: "internal local_ id maps to a different CLI uuid on disk",
  },
  {
    t: "file-lingers",
    event: "file-lingers",
    ashpanned: true,
    fileLingers: true,
    cue: "ashpanned",
    note: "CLI-uuid jsonl still exists at ~2.9MB, still parseable",
  },
  {
    t: "list-blank",
    event: "list-blank",
    ashpanned: true,
    listBlank: true,
    cue: "ashpanned",
    note: "list_sessions and search_session_transcripts show no trace",
  },
  {
    t: "path",
    event: "orphan-jsonl",
    ashpanned: true,
    orphanJsonl: true,
    fileLingers: true,
    spawnedChild: true,
    cue: "ashpanned",
    note: "orphan-jsonl — the ash sits in the pan under the grate",
  },
  {
    t: "score",
    event: "ashpan",
    ashpanned: true,
    orphanJsonl: true,
    spawnedChild: true,
    indexGone: true,
    cliUuidSplit: true,
    fileLingers: true,
    listBlank: true,
    cue: "ashpanned",
    note: "ashpan — when the index burns but the jsonl remains the booth never stays swept",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "index-gone",
    swept: true,
    indexGone: true,
    fileLingers: false,
    cue: "swept",
    note: "positive control: delete the raw .jsonl with the index record",
  },
  {
    t: "announce",
    event: "cue-swept",
    swept: true,
    cue: "swept",
    note: "positive control: transcript unrecoverable after deletion",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    swept: true,
    ashpanned: false,
    fileLingers: false,
    cue: "swept",
  };
}

export function seedSwept() {
  return { ...emptyTicket() };
}

export function seedAshpanned() {
  return {
    seed: SEEDED_WORD,
    swept: false,
    ashpanned: true,
    orphanJsonl: true,
    spawnedChild: true,
    indexGone: true,
    cliUuidSplit: true,
    fileLingers: true,
    listBlank: true,
    cue: "ashpanned",
    issue: FEATURED_ISSUE,
    index: SAMPLE_INDEX,
    file: SAMPLE_FILE,
    uuid: SAMPLE_UUID,
    list: SAMPLE_LIST,
    spawn: SAMPLE_SPAWN,
  };
}

export function seedAshpan() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    ashpanned: true,
    orphanJsonl: true,
    spawnedChild: true,
    indexGone: true,
    cliUuidSplit: true,
    fileLingers: true,
    listBlank: true,
    cue: "ashpanned",
  };
}

export function seedOrphanJsonl() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    ashpanned: true,
    orphanJsonl: true,
    fileLingers: true,
    spawnedChild: true,
    event: "orphan-jsonl",
    cue: "ashpanned",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    swept: true,
    cue: "swept",
  };
}

export function seedSpawnedChild() {
  return {
    seed: "spawned-child",
    preferSeed: true,
    spawnedChild: true,
    cue: "ashpanned",
  };
}

export function seedIndexGone() {
  return {
    seed: "index-gone",
    preferSeed: true,
    indexGone: true,
    cue: "ashpanned",
  };
}

export function seedCliUuidSplit() {
  return {
    seed: "cli-uuid-split",
    preferSeed: true,
    cliUuidSplit: true,
    cue: "ashpanned",
  };
}

export function seedFileLingers() {
  return {
    seed: "file-lingers",
    preferSeed: true,
    fileLingers: true,
    cue: "ashpanned",
  };
}

export function seedListBlank() {
  return {
    seed: "list-blank",
    preferSeed: true,
    listBlank: true,
    cue: "ashpanned",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      swept: false,
      ashpanned: false,
      orphanJsonl: false,
      spawnedChild: false,
      indexGone: false,
      cliUuidSplit: false,
      fileLingers: false,
      listBlank: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    swept: raw.swept === true,
    ashpanned:
      raw.ashpanned === true ||
      raw.event === "ashpanned" ||
      raw.event === "ashpan",
    orphanJsonl: raw.orphanJsonl === true || raw.event === "orphan-jsonl",
    spawnedChild: raw.spawnedChild === true || raw.event === "spawned-child",
    indexGone: raw.indexGone === true || raw.event === "index-gone",
    cliUuidSplit: raw.cliUuidSplit === true || raw.event === "cli-uuid-split",
    fileLingers: raw.fileLingers === true || raw.event === "file-lingers",
    listBlank: raw.listBlank === true || raw.event === "list-blank",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    index: raw.index,
    file: raw.file,
    uuid: raw.uuid,
    list: raw.list,
    spawn: raw.spawn,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.swept != null ||
        ticket.ashpanned != null ||
        ticket.orphanJsonl != null ||
        ticket.spawnedChild != null ||
        ticket.fileLingers != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.index ||
        ticket.file ||
        ticket.uuid),
  );
}

function isSwept(row) {
  if (row.ashpanned && row.cue !== "swept") return false;
  if (
    row.cue === "ashpanned" ||
    row.cue === "ashpan" ||
    row.cue === "orphan-jsonl"
  ) {
    return false;
  }
  if (
    row.orphanJsonl &&
    row.fileLingers &&
    row.cue !== "swept" &&
    row.swept !== true
  ) {
    return false;
  }
  if (
    row.orphanJsonl &&
    row.spawnedChild &&
    row.cue !== "swept" &&
    row.swept !== true
  ) {
    return false;
  }
  if (row.swept === true && row.ashpanned !== true && row.cue !== "ashpanned") {
    return true;
  }
  if (
    row.cue === "swept" &&
    row.ashpanned !== true &&
    row.orphanJsonl !== true &&
    row.fileLingers !== true
  ) {
    return true;
  }
  return false;
}

function isOrphanJsonlPath(row) {
  return (
    row.event === "orphan-jsonl" &&
    !isSwept(row) &&
    (row.orphanJsonl === true ||
      row.fileLingers === true ||
      row.spawnedChild === true)
  );
}

function isAshpanned(row) {
  if (isSwept(row)) return false;
  if (isOrphanJsonlPath(row) && row.cue !== "ashpanned") return false;
  if (row.cue === "ashpanned" || row.cue === "ashpan") return true;
  if (row.ashpanned === true) return true;
  if (
    row.orphanJsonl === true &&
    row.fileLingers === true &&
    row.indexGone === true
  ) {
    return true;
  }
  if (row.orphanJsonl === true && row.fileLingers === true) {
    return true;
  }
  if (
    row.spawnedChild === true ||
    row.fileLingers === true ||
    row.indexGone === true ||
    (row.orphanJsonl === true && row.cliUuidSplit === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one ashpan pass against the grate.
 * swept: transcript gone with the index.
 * ashpanned / ashpan: index cleared; orphan jsonl remains.
 * orphan-jsonl: leftover CLI-uuid file under the grate.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isOrphanJsonlPath(row) ||
    (row.orphanJsonl && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "orphan-jsonl";
  } else if (isAshpanned(row)) {
    verdict = "ashpan";
  } else if (isSwept(row)) {
    verdict = "swept";
  } else if (
    row.orphanJsonl ||
    row.spawnedChild ||
    row.fileLingers ||
    (row.indexGone && !row.swept)
  ) {
    verdict = "ashpan";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const index = inspectIndex(row);
  const file = inspectFile(row);
  const uuid = inspectUuid(row);
  const list = inspectList(row);
  const spawn = inspectSpawn(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    swept: verdict === "swept" || verdict === "hold",
    ashpanned:
      verdict === "ashpanned" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    orphanJsonl:
      row.orphanJsonl === true ||
      verdict === "orphan-jsonl" ||
      verdict === PATH_WORD,
    spawnedChild: row.spawnedChild,
    indexGone: row.indexGone,
    cliUuidSplit: row.cliUuidSplit,
    fileLingers: row.fileLingers,
    listBlank: row.listBlank,
    cue: hold
      ? "swept"
      : row.orphanJsonl || verdict === "orphan-jsonl"
        ? "orphan-jsonl"
        : "ashpanned",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit swept" : "score ashpan",
    indexInspect: index,
    fileInspect: file,
    uuidInspect: uuid,
    listInspect: list,
    spawnInspect: spawn,
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
      : ASHPAN_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "ashpan" || row.verdict === "ashpanned",
  );
  const path = scored.filter((row) => row.verdict === "orphan-jsonl");
  const swept = scored.filter((row) => row.verdict === "swept");
  const headline =
    scored.find((row) => row.event === "ashpanned") ||
    scored.find((row) => row.event === "orphan-jsonl") ||
    scored.find((row) => row.event === "file-lingers") ||
    dead[dead.length - 1];
  let verdict = "swept";
  if (dead.length) verdict = "ashpan";
  else if (path.length && !swept.length) verdict = "orphan-jsonl";
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
    ashpannedCount: dead.length,
    pathCount: path.length,
    sweptCount: swept.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit swept" : "score ashpan",
    note: headline
      ? "Index burned; spawned-child CLI-uuid jsonl left on disk at full size; list and search show no trace."
      : "published ashpan walk scored against swept vs ashpanned",
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
    seeded !== "swept" &&
    seeded !== "ashpanned" &&
    seeded !== "orphan-jsonl" &&
    seeded !== "ashpan" &&
    ticket.swept == null &&
    ticket.ashpanned == null &&
    ticket.orphanJsonl == null &&
    ticket.fileLingers == null &&
    ticket.spawnedChild == null &&
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
    swept: scored.swept ?? false,
    ashpanned: scored.ashpanned ?? false,
    orphanJsonl: scored.orphanJsonl ?? false,
    spawnedChild: scored.spawnedChild ?? false,
    indexGone: scored.indexGone ?? false,
    cliUuidSplit: scored.cliUuidSplit ?? false,
    fileLingers: scored.fileLingers ?? false,
    listBlank: scored.listBlank ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.swept && !result.ashpanned ? "index=cleared-with-file" : "index=burned",
    result.orphanJsonl || result.ashpanned ? "file=lingers" : "file=swept",
    result.spawnedChild || result.ashpanned ? "session=spawned-child" : "session=top-level",
    result.indexGone || result.ashpanned ? "get=not-found" : "get=listed",
    result.orphanJsonl || result.verdict === "orphan-jsonl"
      ? "path=orphan-jsonl"
      : "path=swept",
    result.cue === "swept"
      ? "cue=swept"
      : result.cue === "orphan-jsonl"
        ? "cue=orphan-jsonl"
        : "cue=ashpanned",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    swept: result.swept,
    ashpanned: result.ashpanned,
    orphanJsonl: result.orphanJsonl,
    spawnedChild: result.spawnedChild,
    indexGone: result.indexGone,
    cliUuidSplit: result.cliUuidSplit,
    fileLingers: result.fileLingers,
    listBlank: result.listBlank,
    index: input && input.index,
    file: input && input.file,
    uuid: input && input.uuid,
    list: input && input.list,
    spawn: input && input.spawn,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    index: inspectIndex({
      swept: result.swept,
      ashpanned: result.ashpanned,
      indexGone: result.indexGone,
      index: input && input.index,
    }),
    file: inspectFile({
      swept: result.swept,
      ashpanned: result.ashpanned,
      orphanJsonl: result.orphanJsonl,
      fileLingers: result.fileLingers,
      file: input && input.file,
    }),
    uuid: inspectUuid({
      swept: result.swept,
      ashpanned: result.ashpanned,
      cliUuidSplit: result.cliUuidSplit,
      uuid: input && input.uuid,
    }),
    list: inspectList({
      swept: result.swept,
      ashpanned: result.ashpanned,
      listBlank: result.listBlank,
      list: input && input.list,
    }),
    spawn: inspectSpawn({
      swept: result.swept,
      ashpanned: result.ashpanned,
      spawnedChild: result.spawnedChild,
      spawn: input && input.spawn,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      ashpanned:
        result.ashpanned === true ||
        result.verdict === "ashpanned" ||
        result.verdict === "ashpan",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      surface: SURFACE,
      sessionKind: SESSION_KIND,
      internalId: INTERNAL_ID,
      cliUuid: CLI_UUID,
      transcriptName: TRANSCRIPT_NAME,
      transcriptPath: TRANSCRIPT_PATH,
      transcriptSize: TRANSCRIPT_SIZE,
      deleteLog: DELETE_LOG,
      getSession: GET_SESSION,
      trays: ASHPAN_TRAYS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: delete_session may key file removal on the internal local_<uuid> path while the on-disk transcript is named by the mapped CLI UUID; spawned-child sessions may skip the file-unlink branch that top-level deletes take. Invite verify against #93780 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
