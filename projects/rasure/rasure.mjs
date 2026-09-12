#!/usr/bin/env node
/**
 * Rasure — parchment rasure / scriptorium scraping booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * ~/.claude is deleted and recreated wholesale (CreationTime of the
 * leaf flips). .claude.json regenerates blank; prompt history and
 * transcripts zero out; settings.json reverts to a stub missing most
 * hooks. Four incidents since late August; incident 4 also wiped
 * secrets/ (19 files). A ~/.claude/backups/ folder with
 * .claude.json.backup.<timestamp> appeared after one incident.
 *
 *   node rasure.mjs data/rasured.json
 *   echo '{"seed":"rasured"}' | node rasure.mjs
 *
 * Idle word is intact (HOLD: CreationTime stable; config survives).
 * Seeded word is rasured (#93791 — wholesale wipe+recreate).
 * Path word is creation-time-flip.
 * Product score word is rasure (Score rasure or admit intact.).
 *
 * Encoded from anthropics/claude-code#93791 issue text only.
 * Hypothesis (NON-BINDING): an internal cloud-sync/repair path may
 * clear ~/.claude instead of merging (matching the #41415 theory).
 * Verify against #93791 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "hold",
  "wholesale-wipe",
  "blank-claude-json",
  "stubs-settings",
  "secrets-lost",
  "backup-stamp",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "intact";
export const PATH_WORD = "creation-time-flip";
export const SEEDED_WORD = "rasured";
export const PRODUCT_WORD = "rasure";
export const HOLD = Object.freeze(["intact", "hold"]);
export const RECOVER = Object.freeze(["intact", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "swept",
  "ashpanned",
  "ashpan",
  "orphan-jsonl",
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
  FORBIDDEN_IDLE.filter((name) => name !== "rasured" && name !== "rasure"),
);

export const FEATURED_ISSUE = 93791;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93791";
export const TITLE =
  "~/.claude config directory silently wiped and recreated - 4 incidents, matches #41415/#34330 pattern";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
  "data-loss",
]);
export const PLATFORM = "windows";
export const OS_NAME = "Windows 11 Pro";
export const CLAUDE_VERSION = "2.1.269";
export const PREV_VERSION = "2.1.268";
export const INSTALL = "native (~/.local/bin/claude)";
export const UPDATE_CHANNEL = "auto-update";
export const LAST_UPDATE_RESULT = ".last-update-result.json";
export const SURFACE =
  "Windows 11 Pro; native install (~/.local/bin/claude); auto-update channel; Claude Code 2.1.269";
export const CONFIG_DIR = "~/.claude";
export const CLAUDE_JSON = ".claude.json";
export const SETTINGS_FILE = "settings.json";
export const SECRETS_DIR = "secrets/";
export const SECRETS_COUNT = 19;
export const BACKUP_DIR = "~/.claude/backups/";
export const BACKUP_PATTERN = ".claude.json.backup.<timestamp>";
export const INCIDENT_COUNT = 4;
export const INCIDENT_1 = Object.freeze({
  when: "~2026-08-25/26",
  scope: "~3,572 transcripts, skills, plugins, hooks",
  recovered: "A Windows shadow copy that happened to exist",
});
export const INCIDENT_2 = Object.freeze({
  when: "~2026-09-08",
  scope: "Entire folder",
  recovered: "Manual copy salvaged beforehand",
});
export const INCIDENT_3 = Object.freeze({
  when: "2026-09-12 07:29:35",
  scope: "7,462 transcripts, full config",
  recovered:
    "Shadow copy from the night before + a 30-minute incremental backup script written after incident #1",
});
export const INCIDENT_4 = Object.freeze({
  when: "2026-09-12 ~09:28 (within ~2h of incident 3's recovery finishing)",
  scope:
    "Entire folder again, including secrets/ (a subfolder of unrelated local API tokens, 19 files)",
  recovered:
    "Same incremental backup, plus a full-tree diff against the backup that caught the missing subfolder",
});
export const INCIDENT_3_AT = "2026-09-12 07:29:35";
export const INCIDENT_4_AT = "2026-09-12 ~09:28";
export const TRANSCRIPT_COUNT_3 = 7462;
export const TRANSCRIPT_COUNT_1 = 3572;
export const PHRASE = "Score rasure or admit intact.";
export const DISTRIBUTION =
  "~/.claude (native Windows install) has been deleted and recreated wholesale four times since late August, most recently twice within ~2 hours of each other. Each time: the folder's own CreationTime changes (full delete+recreate, not content edits), .claude.json gets regenerated blank, prompt history and transcripts zero out, and settings.json reverts to a stub missing most hooks. Incident 3 at 2026-09-12 07:29:35 wiped 7,462 transcripts + full config. Incident 4 at 2026-09-12 ~09:28 wiped the entire folder again including secrets/ (19 files of unrelated local API tokens). Chat vanished mid-session on a prior occurrence. A ~/.claude/backups/ folder containing .claude.json.backup.<timestamp> files appeared after one incident — looks written by Claude Code itself. Version 2.1.269 at most recent incidents (updated cleanly from 2.1.268 the evening before, per .last-update-result.json — no update ran at the actual incident times).";
export const RULED_OUT = Object.freeze([
  "scheduled task fired in the incident window (checked full task list, not just name-matching)",
  "antivirus/cloud-sync client (OneDrive, Google Drive File Stream) has ~/.claude in its sync scope",
  "suspicious startup entries",
  "Windows auto-update of Claude Code itself at the exact incident time (completed hours before)",
]);
export const EXPECTED = Object.freeze([
  "Confirmation of whether there's an internal cloud-sync/repair mechanism that can, under some condition, clear ~/.claude instead of merging into it (matching the #41415 theory)",
  "Any telemetry/logging Anthropic has server-side that could correlate with these timestamps if provided privately",
]);

export const RASURE_LEAVES = Object.freeze([
  {
    id: "leaf",
    label: "parchment leaf",
    count: "scraped",
    note: "CreationTime of ~/.claude flips after wholesale delete+recreate",
  },
  {
    id: "stub",
    label: "blank .claude.json",
    count: "blank",
    note: ".claude.json regenerates blank",
  },
  {
    id: "hooks",
    label: "settings stub",
    count: "missing-hooks",
    note: "settings.json reverts to a stub missing most hooks",
  },
  {
    id: "secrets",
    label: "secrets folder",
    count: "19",
    note: "incident 4 wiped secrets/ (19 files of unrelated local API tokens)",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "leaf-lane",
    survey: "watch CreationTime of the ~/.claude leaf",
    kind: "leaf",
    note: "seeded: folder CreationTime flips — full delete+recreate, not content edits",
  },
  {
    id: "json-lane",
    survey: "read the regenerated .claude.json stub",
    kind: "json",
    note: "seeded: .claude.json regenerates blank; prompt history and transcripts zero out",
  },
  {
    id: "settings-lane",
    survey: "compare settings.json against the prior hooks",
    kind: "settings",
    note: "seeded: settings.json reverts to a stub missing most hooks",
  },
  {
    id: "secrets-lane",
    survey: "badge the secrets/ folder lost on incident 4",
    kind: "secrets",
    note: "seeded: secrets/ (19 files of unrelated local API tokens) wiped",
  },
  {
    id: "backup-lane",
    survey: "stamp the internal .claude.json.backup.<timestamp>",
    kind: "backup",
    note: "seeded: ~/.claude/backups/ appeared after one incident — looks written by Claude Code itself",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "creation-time-flip",
  "rasured",
  "wholesale-wipe",
  "blank-claude-json",
  "stubs-settings",
  "secrets-lost",
  "backup-stamp",
]);

export const COUSINS = Object.freeze([
  {
    issue: 41415,
    title: "~/.claude/agents/ silently emptied twice by Claude Code's own background process",
    state: "closed not planned",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #41415 ~/.claude/agents/ silently emptied by Claude Code's own node process; theorized cloud-agent sync path that clears instead of merging. Closed not planned. Do not rebuild",
  },
  {
    issue: 34330,
    title: ".claude/skills/ deleted within ~300ms of creation",
    state: "closed duplicate",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #34330 .claude/skills/ actively watched and deleted by the CLI process within ~300ms of file creation (v2.1.76). Closed as duplicate. Do not rebuild",
  },
  {
    issue: 70052,
    title: "transcripts vanishing from .claude/projects/",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #70052 transcripts vanishing. Related data-loss surface, not this wholesale ~/.claude recreate. Do not rebuild",
  },
  {
    issue: 54092,
    title: "transcripts vanishing from .claude/projects/",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #54092 transcripts vanishing. Related data-loss surface, not this wholesale ~/.claude recreate. Do not rebuild",
  },
  {
    issue: 93742,
    title: "/model save-as-default scrapes settings.json",
    state: "OPEN",
    citeOnly: true,
    product: "rescript",
    why: "Cite-only cousin — #93742 settings snapshot rewrite booth (hooks reverted via /model save-as-default). Different mechanism: settings.json rewrite vs wholesale directory recreate. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93788, title: "ESC-sequence keys dead 2.1.269", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93766, title: "OneDrive musl/glibc false error", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93764, title: "DECSTBM blank rows", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93754, title: "remoteControlAtStartup toggle", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "ashpan",
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

export const SAMPLE_LEAF = Object.freeze({
  path: CONFIG_DIR,
  creationTimeFlipped: true,
  wholesale: true,
  contentEditOnly: false,
});

export const SAMPLE_INTACT_LEAF = Object.freeze({
  path: CONFIG_DIR,
  creationTimeFlipped: false,
  wholesale: false,
  contentEditOnly: false,
});

export const SAMPLE_JSON = Object.freeze({
  name: CLAUDE_JSON,
  blank: true,
  regenerated: true,
});

export const SAMPLE_INTACT_JSON = Object.freeze({
  name: CLAUDE_JSON,
  blank: false,
  regenerated: false,
});

export const SAMPLE_SETTINGS = Object.freeze({
  name: SETTINGS_FILE,
  stub: true,
  hooksMissing: true,
});

export const SAMPLE_INTACT_SETTINGS = Object.freeze({
  name: SETTINGS_FILE,
  stub: false,
  hooksMissing: false,
});

export const SAMPLE_SECRETS = Object.freeze({
  path: SECRETS_DIR,
  count: SECRETS_COUNT,
  lost: true,
});

export const SAMPLE_INTACT_SECRETS = Object.freeze({
  path: SECRETS_DIR,
  count: SECRETS_COUNT,
  lost: false,
});

export const SAMPLE_BACKUP = Object.freeze({
  dir: BACKUP_DIR,
  pattern: BACKUP_PATTERN,
  stamped: true,
  writer: "Claude Code itself (looks like internal config-repair/backup)",
});

export const SAMPLE_INTACT_BACKUP = Object.freeze({
  dir: BACKUP_DIR,
  pattern: BACKUP_PATTERN,
  stamped: false,
  writer: null,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "leaf holds: CreationTime of ~/.claude stays; config survives" },
  { t: "wholesale-wipe", line: "folder deleted and recreated wholesale — four incidents since late August" },
  { t: "blank-claude-json", line: ".claude.json regenerates blank; prompt history and transcripts zero out" },
  { t: "stubs-settings", line: "settings.json reverts to a stub missing most hooks" },
  { t: "secrets-lost", line: "incident 4 (~2026-09-12 ~09:28) wiped secrets/ (19 files)" },
  { t: "backup-stamp", line: "~/.claude/backups/.claude.json.backup.<timestamp> appeared after one incident" },
  { t: "creation-time-flip", line: "folder CreationTime flips — full delete+recreate, not content edits" },
  { t: "path", line: "creation-time-flip — the leaf is new parchment after the rasure" },
  { t: "score", line: "when CreationTime flips and the stub is blank the booth is rasure — Score rasure or admit intact." },
]);

export function inspectLeaf(input = {}) {
  const leaf =
    input.leaf && typeof input.leaf === "object"
      ? input.leaf
      : input.intact === true && input.rasured !== true
        ? SAMPLE_INTACT_LEAF
        : SAMPLE_LEAF;
  const forcedFlip =
    input.creationTimeFlip === true ||
    input.event === "creation-time-flip" ||
    input.event === "rasured" ||
    input.event === "rasure" ||
    input.event === "wholesale-wipe";
  const flipped = forcedFlip
    ? true
    : leaf.creationTimeFlipped === true && input.intact !== true;
  return {
    path: leaf.path || CONFIG_DIR,
    creationTimeFlipped: flipped,
    wholesale: flipped,
    contentEditOnly: !flipped,
    stamp: flipped ? "leaf-new" : "leaf-held",
    note: flipped
      ? "CreationTime of ~/.claude flipped — full delete+recreate, not content edits"
      : "CreationTime of ~/.claude stable — the leaf still holds the writing",
  };
}

export function inspectClaudeJson(input = {}) {
  const json =
    input.json && typeof input.json === "object"
      ? input.json
      : input.intact === true && input.rasured !== true
        ? SAMPLE_INTACT_JSON
        : SAMPLE_JSON;
  const forcedBlank =
    input.blankClaudeJson === true ||
    input.event === "blank-claude-json" ||
    input.event === "rasured" ||
    input.event === "rasure";
  const blank = forcedBlank ? true : json.blank === true && input.intact !== true;
  return {
    name: CLAUDE_JSON,
    blank,
    regenerated: blank,
    stamp: blank ? "json-blank" : "json-held",
    note: blank
      ? ".claude.json regenerates blank; prompt history and transcripts zero out"
      : ".claude.json still holds history — the leaf was not rasurized",
  };
}

export function inspectSettings(input = {}) {
  const settings =
    input.settings && typeof input.settings === "object"
      ? input.settings
      : input.intact === true && input.rasured !== true
        ? SAMPLE_INTACT_SETTINGS
        : SAMPLE_SETTINGS;
  const forcedStub =
    input.stubsSettings === true ||
    input.event === "stubs-settings" ||
    input.event === "rasured" ||
    input.event === "rasure";
  const stub = forcedStub
    ? true
    : settings.stub === true && input.intact !== true;
  return {
    name: SETTINGS_FILE,
    stub,
    hooksMissing: stub,
    stamp: stub ? "hooks-missing" : "hooks-held",
    note: stub
      ? "settings.json reverts to a stub missing most hooks"
      : "settings.json still carries the hooks",
  };
}

export function inspectSecrets(input = {}) {
  const secrets =
    input.secrets && typeof input.secrets === "object"
      ? input.secrets
      : input.intact === true && input.rasured !== true
        ? SAMPLE_INTACT_SECRETS
        : SAMPLE_SECRETS;
  const forcedLost =
    input.secretsLost === true ||
    input.event === "secrets-lost" ||
    input.event === "rasured" ||
    input.event === "rasure";
  const lost = forcedLost
    ? true
    : secrets.lost === true && input.intact !== true;
  return {
    path: SECRETS_DIR,
    count: SECRETS_COUNT,
    lost,
    stamp: lost ? "secrets-lost" : "secrets-held",
    note: lost
      ? "incident 4 wiped secrets/ (19 files of unrelated local API tokens)"
      : "secrets/ still present — 19 files not scraped",
  };
}

export function inspectBackup(input = {}) {
  const backup =
    input.backup && typeof input.backup === "object"
      ? input.backup
      : input.intact === true && input.rasured !== true
        ? SAMPLE_INTACT_BACKUP
        : SAMPLE_BACKUP;
  const forcedStamp =
    input.backupStamp === true ||
    input.event === "backup-stamp" ||
    input.event === "rasured" ||
    input.event === "rasure";
  const stamped = forcedStamp
    ? true
    : backup.stamped === true && input.intact !== true;
  return {
    dir: BACKUP_DIR,
    pattern: BACKUP_PATTERN,
    stamped,
    stamp: stamped ? "backup-stamp" : "backup-absent",
    note: stamped
      ? "~/.claude/backups/.claude.json.backup.<timestamp> appeared — looks written by Claude Code itself"
      : "no internal backup stamp on the desk",
  };
}

export function readBooth(input = {}) {
  const leaf = inspectLeaf(input);
  const json = inspectClaudeJson(input);
  const settings = inspectSettings(input);
  const secrets = inspectSecrets(input);
  const backup = inspectBackup(input);
  const rasured =
    input.intact !== true &&
    ((leaf.creationTimeFlipped && json.blank) ||
      (leaf.creationTimeFlipped && settings.stub) ||
      input.rasured === true);
  const intact =
    input.intact === true && rasured !== true && !leaf.creationTimeFlipped;
  const path =
    leaf.creationTimeFlipped &&
    (input.event === "creation-time-flip" || input.creationTimeFlip === true);
  return {
    leaf,
    json,
    settings,
    secrets,
    backup,
    leaves: RASURE_LEAVES,
    stations: BOOTH_STATIONS,
    rasured: rasured && !intact && !path,
    intact:
      intact ||
      (!leaf.creationTimeFlipped &&
        input.rasured !== true &&
        input.creationTimeFlip !== true),
    creationTimeFlip: path && !intact,
    mark:
      path && !intact
        ? "creation-time-flip"
        : rasured && !intact
          ? "rasured"
          : "intact",
  };
}

/**
 * Published rasure walk from #93791 only. Facts from the issue text.
 * An intact booth keeps CreationTime of ~/.claude and the config.
 * A rasured booth scrapes the leaf wholesale and writes a new one.
 * A creation-time-flip booth names the delete+recreate path.
 */
export const RASURE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-intact",
    intact: true,
    rasured: false,
    cue: "intact",
    note: "idle HOLD: CreationTime stable; config survives — the hold/good path",
  },
  {
    t: "wholesale-wipe",
    event: "wholesale-wipe",
    rasured: true,
    wholesaleWipe: true,
    cue: "rasured",
    note: "~/.claude deleted and recreated wholesale — four incidents since late August",
  },
  {
    t: "blank-claude-json",
    event: "blank-claude-json",
    rasured: true,
    blankClaudeJson: true,
    cue: "rasured",
    note: ".claude.json regenerates blank; prompt history and transcripts zero out",
  },
  {
    t: "stubs-settings",
    event: "stubs-settings",
    rasured: true,
    stubsSettings: true,
    cue: "rasured",
    note: "settings.json reverts to a stub missing most hooks",
  },
  {
    t: "secrets-lost",
    event: "secrets-lost",
    rasured: true,
    secretsLost: true,
    cue: "rasured",
    note: "incident 4 wiped secrets/ (19 files of unrelated local API tokens)",
  },
  {
    t: "backup-stamp",
    event: "backup-stamp",
    rasured: true,
    backupStamp: true,
    cue: "rasured",
    note: "~/.claude/backups/.claude.json.backup.<timestamp> appeared after one incident",
  },
  {
    t: "path",
    event: "creation-time-flip",
    rasured: true,
    creationTimeFlip: true,
    wholesaleWipe: true,
    blankClaudeJson: true,
    cue: "rasured",
    note: "creation-time-flip — the leaf is new parchment after the rasure",
  },
  {
    t: "score",
    event: "rasure",
    rasured: true,
    creationTimeFlip: true,
    wholesaleWipe: true,
    blankClaudeJson: true,
    stubsSettings: true,
    secretsLost: true,
    backupStamp: true,
    cue: "rasured",
    note: "rasure — when CreationTime flips and the stub is blank the booth never stays intact",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-intact",
    intact: true,
    creationTimeFlip: false,
    wholesaleWipe: false,
    cue: "intact",
    note: "positive control: CreationTime of ~/.claude stays; config survives",
  },
  {
    t: "announce",
    event: "cue-intact",
    intact: true,
    cue: "intact",
    note: "positive control: the leaf is not scraped",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    intact: true,
    rasured: false,
    creationTimeFlip: false,
    cue: "intact",
  };
}

export function seedIntact() {
  return { ...emptyTicket() };
}

export function seedRasured() {
  return {
    seed: SEEDED_WORD,
    intact: false,
    rasured: true,
    creationTimeFlip: true,
    wholesaleWipe: true,
    blankClaudeJson: true,
    stubsSettings: true,
    secretsLost: true,
    backupStamp: true,
    cue: "rasured",
    issue: FEATURED_ISSUE,
    leaf: SAMPLE_LEAF,
    json: SAMPLE_JSON,
    settings: SAMPLE_SETTINGS,
    secrets: SAMPLE_SECRETS,
    backup: SAMPLE_BACKUP,
  };
}

export function seedRasure() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    rasured: true,
    creationTimeFlip: true,
    wholesaleWipe: true,
    blankClaudeJson: true,
    stubsSettings: true,
    secretsLost: true,
    backupStamp: true,
    cue: "rasured",
  };
}

export function seedCreationTimeFlip() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    rasured: true,
    creationTimeFlip: true,
    wholesaleWipe: true,
    blankClaudeJson: true,
    event: "creation-time-flip",
    cue: "rasured",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    intact: true,
    cue: "intact",
  };
}

export function seedWholesaleWipe() {
  return {
    seed: "wholesale-wipe",
    preferSeed: true,
    wholesaleWipe: true,
    cue: "rasured",
  };
}

export function seedBlankClaudeJson() {
  return {
    seed: "blank-claude-json",
    preferSeed: true,
    blankClaudeJson: true,
    cue: "rasured",
  };
}

export function seedStubsSettings() {
  return {
    seed: "stubs-settings",
    preferSeed: true,
    stubsSettings: true,
    cue: "rasured",
  };
}

export function seedSecretsLost() {
  return {
    seed: "secrets-lost",
    preferSeed: true,
    secretsLost: true,
    cue: "rasured",
  };
}

export function seedBackupStamp() {
  return {
    seed: "backup-stamp",
    preferSeed: true,
    backupStamp: true,
    cue: "rasured",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      intact: false,
      rasured: false,
      creationTimeFlip: false,
      wholesaleWipe: false,
      blankClaudeJson: false,
      stubsSettings: false,
      secretsLost: false,
      backupStamp: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    intact: raw.intact === true,
    rasured:
      raw.rasured === true ||
      raw.event === "rasured" ||
      raw.event === "rasure",
    creationTimeFlip:
      raw.creationTimeFlip === true || raw.event === "creation-time-flip",
    wholesaleWipe: raw.wholesaleWipe === true || raw.event === "wholesale-wipe",
    blankClaudeJson:
      raw.blankClaudeJson === true || raw.event === "blank-claude-json",
    stubsSettings: raw.stubsSettings === true || raw.event === "stubs-settings",
    secretsLost: raw.secretsLost === true || raw.event === "secrets-lost",
    backupStamp: raw.backupStamp === true || raw.event === "backup-stamp",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    leaf: raw.leaf,
    json: raw.json,
    settings: raw.settings,
    secrets: raw.secrets,
    backup: raw.backup,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.intact != null ||
        ticket.rasured != null ||
        ticket.creationTimeFlip != null ||
        ticket.wholesaleWipe != null ||
        ticket.blankClaudeJson != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.leaf ||
        ticket.json ||
        ticket.settings),
  );
}

function isIntact(row) {
  if (row.rasured && row.cue !== "intact") return false;
  if (
    row.cue === "rasured" ||
    row.cue === "rasure" ||
    row.cue === "creation-time-flip"
  ) {
    return false;
  }
  if (
    row.creationTimeFlip &&
    row.wholesaleWipe &&
    row.cue !== "intact" &&
    row.intact !== true
  ) {
    return false;
  }
  if (
    row.creationTimeFlip &&
    row.blankClaudeJson &&
    row.cue !== "intact" &&
    row.intact !== true
  ) {
    return false;
  }
  if (row.intact === true && row.rasured !== true && row.cue !== "rasured") {
    return true;
  }
  if (
    row.cue === "intact" &&
    row.rasured !== true &&
    row.creationTimeFlip !== true &&
    row.wholesaleWipe !== true
  ) {
    return true;
  }
  return false;
}

function isCreationTimeFlipPath(row) {
  return (
    row.event === "creation-time-flip" &&
    !isIntact(row) &&
    (row.creationTimeFlip === true ||
      row.wholesaleWipe === true ||
      row.blankClaudeJson === true)
  );
}

function isRasured(row) {
  if (isIntact(row)) return false;
  if (isCreationTimeFlipPath(row) && row.cue !== "rasured") return false;
  if (row.cue === "rasured" || row.cue === "rasure") return true;
  if (row.rasured === true) return true;
  if (
    row.creationTimeFlip === true &&
    row.wholesaleWipe === true &&
    row.blankClaudeJson === true
  ) {
    return true;
  }
  if (row.creationTimeFlip === true && row.wholesaleWipe === true) {
    return true;
  }
  if (
    row.wholesaleWipe === true ||
    row.blankClaudeJson === true ||
    row.stubsSettings === true ||
    row.secretsLost === true ||
    (row.creationTimeFlip === true && row.backupStamp === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one rasure pass against the leaf.
 * intact: CreationTime stable; config survives.
 * rasured / rasure: wholesale wipe+recreate.
 * creation-time-flip: folder CreationTime of the leaf is new.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCreationTimeFlipPath(row) ||
    (row.creationTimeFlip && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "creation-time-flip";
  } else if (isRasured(row)) {
    verdict = "rasure";
  } else if (isIntact(row)) {
    verdict = "intact";
  } else if (
    row.creationTimeFlip ||
    row.wholesaleWipe ||
    row.blankClaudeJson ||
    (row.stubsSettings && !row.intact)
  ) {
    verdict = "rasure";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const leaf = inspectLeaf(row);
  const json = inspectClaudeJson(row);
  const settings = inspectSettings(row);
  const secrets = inspectSecrets(row);
  const backup = inspectBackup(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    intact: verdict === "intact" || verdict === "hold",
    rasured:
      verdict === "rasured" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    creationTimeFlip:
      row.creationTimeFlip === true ||
      verdict === "creation-time-flip" ||
      verdict === PATH_WORD,
    wholesaleWipe: row.wholesaleWipe,
    blankClaudeJson: row.blankClaudeJson,
    stubsSettings: row.stubsSettings,
    secretsLost: row.secretsLost,
    backupStamp: row.backupStamp,
    cue: hold
      ? "intact"
      : row.creationTimeFlip || verdict === "creation-time-flip"
        ? "creation-time-flip"
        : "rasured",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit intact" : "score rasure",
    leafInspect: leaf,
    jsonInspect: json,
    settingsInspect: settings,
    secretsInspect: secrets,
    backupInspect: backup,
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
      : RASURE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "rasure" || row.verdict === "rasured",
  );
  const path = scored.filter((row) => row.verdict === "creation-time-flip");
  const intact = scored.filter((row) => row.verdict === "intact");
  const headline =
    scored.find((row) => row.event === "rasured") ||
    scored.find((row) => row.event === "creation-time-flip") ||
    scored.find((row) => row.event === "wholesale-wipe") ||
    dead[dead.length - 1];
  let verdict = "intact";
  if (dead.length) verdict = "rasure";
  else if (path.length && !intact.length) verdict = "creation-time-flip";
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
    rasuredCount: dead.length,
    pathCount: path.length,
    intactCount: intact.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit intact" : "score rasure",
    note: headline
      ? "CreationTime flipped; .claude.json blank; settings stub; secrets/ lost on incident 4; internal backup stamp appeared."
      : "published rasure walk scored against intact vs rasured",
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
    seeded !== "intact" &&
    seeded !== "rasured" &&
    seeded !== "creation-time-flip" &&
    seeded !== "rasure" &&
    ticket.intact == null &&
    ticket.rasured == null &&
    ticket.creationTimeFlip == null &&
    ticket.wholesaleWipe == null &&
    ticket.blankClaudeJson == null &&
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
    intact: scored.intact ?? false,
    rasured: scored.rasured ?? false,
    creationTimeFlip: scored.creationTimeFlip ?? false,
    wholesaleWipe: scored.wholesaleWipe ?? false,
    blankClaudeJson: scored.blankClaudeJson ?? false,
    stubsSettings: scored.stubsSettings ?? false,
    secretsLost: scored.secretsLost ?? false,
    backupStamp: scored.backupStamp ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.intact && !result.rasured ? "leaf=held" : "leaf=new",
    result.creationTimeFlip || result.rasured ? "ctime=flipped" : "ctime=stable",
    result.blankClaudeJson || result.rasured ? "json=blank" : "json=held",
    result.stubsSettings || result.rasured ? "settings=stub" : "settings=hooks",
    result.creationTimeFlip || result.verdict === "creation-time-flip"
      ? "path=creation-time-flip"
      : "path=intact",
    result.cue === "intact"
      ? "cue=intact"
      : result.cue === "creation-time-flip"
        ? "cue=creation-time-flip"
        : "cue=rasured",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    intact: result.intact,
    rasured: result.rasured,
    creationTimeFlip: result.creationTimeFlip,
    wholesaleWipe: result.wholesaleWipe,
    blankClaudeJson: result.blankClaudeJson,
    stubsSettings: result.stubsSettings,
    secretsLost: result.secretsLost,
    backupStamp: result.backupStamp,
    leaf: input && input.leaf,
    json: input && input.json,
    settings: input && input.settings,
    secrets: input && input.secrets,
    backup: input && input.backup,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    leaf: inspectLeaf({
      intact: result.intact,
      rasured: result.rasured,
      creationTimeFlip: result.creationTimeFlip,
      leaf: input && input.leaf,
    }),
    json: inspectClaudeJson({
      intact: result.intact,
      rasured: result.rasured,
      blankClaudeJson: result.blankClaudeJson,
      json: input && input.json,
    }),
    settings: inspectSettings({
      intact: result.intact,
      rasured: result.rasured,
      stubsSettings: result.stubsSettings,
      settings: input && input.settings,
    }),
    secrets: inspectSecrets({
      intact: result.intact,
      rasured: result.rasured,
      secretsLost: result.secretsLost,
      secrets: input && input.secrets,
    }),
    backup: inspectBackup({
      intact: result.intact,
      rasured: result.rasured,
      backupStamp: result.backupStamp,
      backup: input && input.backup,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      rasured:
        result.rasured === true ||
        result.verdict === "rasured" ||
        result.verdict === "rasure",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      osName: OS_NAME,
      claudeVersion: CLAUDE_VERSION,
      prevVersion: PREV_VERSION,
      install: INSTALL,
      updateChannel: UPDATE_CHANNEL,
      lastUpdateResult: LAST_UPDATE_RESULT,
      surface: SURFACE,
      configDir: CONFIG_DIR,
      claudeJson: CLAUDE_JSON,
      settingsFile: SETTINGS_FILE,
      secretsDir: SECRETS_DIR,
      secretsCount: SECRETS_COUNT,
      backupDir: BACKUP_DIR,
      backupPattern: BACKUP_PATTERN,
      incidentCount: INCIDENT_COUNT,
      incident3At: INCIDENT_3_AT,
      incident4At: INCIDENT_4_AT,
      transcriptCount3: TRANSCRIPT_COUNT_3,
      transcriptCount1: TRANSCRIPT_COUNT_1,
      incidents: [INCIDENT_1, INCIDENT_2, INCIDENT_3, INCIDENT_4],
      leaves: RASURE_LEAVES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: an internal cloud-sync/repair path may clear ~/.claude instead of merging (matching the #41415 theory). Invite verify against #93791 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
