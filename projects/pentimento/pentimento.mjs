#!/usr/bin/env node
/**
 * Pentimento — art-conservation / underpainting atelier booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * When a cloud Cowork session overwrites an existing file on the
 * linked device, device_commit_files reports written with no
 * rejections and the file mtime advances, but on-disk content is
 * the payload from the previous commit. Creating a new file is
 * correct. Only overwrites lag exactly one commit.
 *
 *   node pentimento.mjs data/lagged.json
 *   echo '{"seed":"lagged"}' | node pentimento.mjs
 *
 * Idle word is flushed (HOLD: overwrite landed; disk bytes ==
 * committed payload; mtime honest).
 * Seeded word is lagged (#93482: overwrite reported written +
 * fresh mtime but disk still previous commit).
 * Path word is one-behind.
 * Product score word is pentimento (score pentimento or admit
 * flushed).
 *
 * Encoded from anthropics/claude-code#93482 issue text only.
 * Hypothesis (NON-BINDING): commit path may buffer/stage and swap
 * the previous payload on overwrite; metadata vs content may come
 * from different sources. Verify against #93482 text only. Do NOT
 * claim a root cause in Claude Code source you have not seen. Do
 * NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "flushed",
  "lagged",
  "pentimento",
  "one-behind",
  "hold",
  "overwrite",
  "create-ok",
  "written-success",
  "rejected-empty",
  "fresh-mtime",
  "stale-bytes",
  "version-a",
  "version-b",
  "version-c",
  "second-commit",
  "wait-45s",
  "not-onedrive",
  "not-read-cache",
  "not-force",
  "workaround",
  "write-edit-clean",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "flushed";
export const PATH_WORD = "one-behind";
export const SEEDED_WORD = "lagged";
export const PRODUCT_WORD = "pentimento";
export const HOLD = Object.freeze(["flushed", "hold"]);
export const RECOVER = Object.freeze(["flushed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "solitary",
  "twinlinked",
  "bridge-refuse",
  "vinculum",
  "hit",
  "flattened",
  "string-carrier",
  "cachet",
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
  "sealed",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "lagged" && name !== "pentimento",
  ),
);

export const FEATURED_ISSUE = 93482;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93482";
export const TITLE =
  "[BUG] Cowork: device_commit_files reports success on overwrites but the on-disk content lags exactly one commit behind (silent stale write, fresh mtime)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cowork",
  "data-loss",
]);
export const AUTHOR = "GBalunis";
export const FILED = "2026-09-10T22:02:35Z";
export const CLAUDE_DESKTOP_VERSION = "1.49585.0";
export const PLATFORM = "win32 x64";
export const ELECTRON = "44.2.0";
export const NODE_VERSION = "24.20.0";
export const OS = "Windows 11 25H2";
export const OS_BUILD = "26200.9445";
export const SESSION_KIND = "Cowork cloud session linked to a desktop device";
export const MODEL = "claude-opus-5";
export const COMMIT_API = "device_commit_files";
export const SUCCESS_SHAPE = '{"written":[path],"rejected":[]}';
export const VERSION_A = "VERSION-A";
export const VERSION_B = "VERSION-B";
export const VERSION_C = "VERSION-C";
export const VERSION_A_BYTES = 43;
export const VERSION_B_BYTES = 82;
export const VERSION_C_BYTES = 89;
export const WAIT_SECONDS = 45;
export const REPRO_FOLDER = "C:\\Users\\<USER>\\Downloads";
export const PHRASE =
  "when device_commit_files reports overwrite success with a fresh mtime while on-disk content lags exactly one commit, score pentimento or admit flushed.";

export const ATELIER_STATIONS = Object.freeze([
  {
    id: "stretcher",
    survey: "seat the canvas on the stretcher bars",
    kind: "commit",
    note: "idle: overwrite landed; disk bytes == committed payload; mtime honest",
  },
  {
    id: "varnish",
    survey: "brush the fresh varnish (mtime)",
    kind: "mtime",
    note: "seeded: mtime advances to the call moment while pigment stays prior",
  },
  {
    id: "underpaint",
    survey: "rake the underpainting (on-disk bytes)",
    kind: "disk",
    note: "seeded: on-disk content is the payload from the previous commit",
  },
  {
    id: "tray",
    survey: "read the varnish tray / commit result",
    kind: "response",
    note: "device_commit_files returns written with no rejections",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "one-behind",
  "lagged",
  "fresh-mtime",
  "stale-bytes",
  "overwrite",
  "written-success",
  "rejected-empty",
  "wait-45s",
]);

export const COUSINS = Object.freeze([
  {
    issue: 83354,
    title:
      "device_stage_files silently skips copy when destination exists, reports success",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — related silent success, different API; do not rebuild",
  },
  {
    issue: 79354,
    title:
      "background shell completes after agent moves on, silently overwrites with stale content",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — stale overwrite, different surface; do not rebuild",
  },
  {
    issue: 38993,
    title: "virtiofs serves truncated/stale files",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — stale bytes, different mount path; do not rebuild",
  },
  {
    issue: 40175,
    title: "Cowork global instructions silently revert to older version",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — silent revert, different surface; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93458,
    title: "SessionStart hook additionalContext silently dropped when source=fork",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93475,
    title:
      "[BUG] Effort selector (Alt+P / plan mode) requires very tall terminal to display; unusable at standard terminal heights",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93439,
    title:
      "Read tool never triggers PreToolUse hooks for binary files (Desktop App, \"Code\" tab)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93438,
    title:
      '[Bug] Agent dispatch with isolation:"worktree" causes cwd state bleed into parent session',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93466,
    title:
      "[BUG] Desktop Directory → Plugins: duplicate cards, cards shown under the wrong marketplace, and no working uninstall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93495,
    title:
      "Claude Desktop 1.49585.0 freezes: main thread deadlocks on synchronous UNUserNotificationCenter XPC call (macOS, regression of #57706)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export function inspectCommit(input = {}) {
  const written =
    input.written === true ||
    input.writtenSuccess === true ||
    input.commitResult === "written" ||
    (Array.isArray(input.writtenPaths) && input.writtenPaths.length > 0) ||
    (input.overwrite === true && input.rejected !== true);
  const rejected =
    input.rejected === true ||
    (Array.isArray(input.rejectedPaths) && input.rejectedPaths.length > 0);
  const emptyRejected =
    input.rejectedEmpty === true ||
    input.rejected === false ||
    (!rejected && written);
  const success = written && emptyRejected && !rejected;
  const lagged =
    success &&
    input.flushed !== true &&
    (input.lagged === true ||
      input.staleBytes === true ||
      input.oneBehind === true ||
      input.overwrite === true);
  return {
    written: success,
    rejected: rejected && !success,
    rejectedEmpty: emptyRejected && !rejected,
    stamp: lagged ? "lagged" : "flushed",
    shape: SUCCESS_SHAPE,
    note: lagged
      ? "device_commit_files returns {written:[path], rejected:[]} — success indistinguishable from a real write"
      : "commit reports written with no rejections and disk matches the committed payload",
  };
}

export function inspectDisk(input = {}) {
  const prior =
    input.staleBytes === true ||
    input.diskPrior === true ||
    input.oneBehind === true ||
    (input.overwrite === true &&
      input.flushed !== true &&
      input.diskCommitted !== true);
  const committed =
    input.diskCommitted === true ||
    input.flushed === true ||
    (!prior && input.createOk === true);
  const lagged = prior && input.flushed !== true;
  return {
    prior: lagged,
    committed: committed && !lagged,
    stamp: lagged ? "lagged" : "flushed",
    payload: lagged
      ? input.diskPayload || input.priorPayload || VERSION_A
      : input.committedPayload || input.diskPayload || VERSION_A,
    bytes: lagged
      ? input.diskBytes || VERSION_A_BYTES
      : input.committedBytes || input.diskBytes || VERSION_A_BYTES,
    note: lagged
      ? "on-disk content is the payload from the previous commit"
      : "disk bytes == committed payload",
  };
}

export function inspectMtime(input = {}) {
  const fresh =
    input.freshMtime === true ||
    input.mtimeAdvanced === true ||
    (input.overwrite === true && input.mtimeHonest !== true);
  const honest =
    input.mtimeHonest === true ||
    input.flushed === true ||
    (!fresh && input.lagged !== true);
  const lying = fresh && input.flushed !== true && input.lagged === true
    ? true
    : fresh &&
      input.flushed !== true &&
      (input.staleBytes === true ||
        input.oneBehind === true ||
        input.overwrite === true);
  return {
    fresh: lying || (fresh && input.flushed !== true && input.mtimeHonest !== true),
    honest: honest && !lying,
    stamp: lying || (fresh && input.flushed !== true && input.staleBytes === true)
      ? "lagged"
      : "flushed",
    note:
      lying || (fresh && input.flushed !== true && (input.staleBytes === true || input.overwrite === true))
        ? "mtime advances to the call moment while the bytes are stale"
        : "mtime is honest — timestamp and pigment agree",
  };
}

export function inspectLag(input = {}) {
  const behind =
    input.oneBehind === true ||
    input.lagExactlyOne === true ||
    input.event === "one-behind" ||
    (input.overwrite === true &&
      input.flushed !== true &&
      (input.lagged === true || input.staleBytes === true));
  return {
    oneBehind: behind && input.flushed !== true,
    none: !behind || input.flushed === true,
    stamp: behind && input.flushed !== true ? "lagged" : "flushed",
    note:
      behind && input.flushed !== true
        ? "exactly one commit behind on overwrite"
        : "no lag — overwrite landed on the first commit",
  };
}

export function inspectCreate(input = {}) {
  const create =
    input.createOk === true ||
    input.create === true ||
    input.event === "create-ok" ||
    input.versionA === true;
  const overwrite =
    input.overwrite === true ||
    input.event === "overwrite" ||
    input.event === "overwrite-b" ||
    input.event === "overwrite-c";
  const ok = create && input.lagged !== true;
  return {
    create: ok || (create && !overwrite),
    overwrite: overwrite && input.flushed !== true,
    stamp:
      overwrite && input.flushed !== true && input.createOk !== true
        ? "lagged"
        : "flushed",
    note: create && !overwrite
      ? "creating a new file is unaffected and correct every time"
      : overwrite && input.flushed !== true
        ? "only overwrites lag — new-file create is clean"
        : "create and overwrite both land the committed payload",
  };
}

export function readEasel(input = {}) {
  const commit = inspectCommit(input);
  const disk = inspectDisk(input);
  const mtime = inspectMtime(input);
  const lag = inspectLag(input);
  const create = inspectCreate(input);
  const lagged =
    commit.stamp === "lagged" ||
    disk.stamp === "lagged" ||
    mtime.stamp === "lagged" ||
    lag.stamp === "lagged" ||
    create.stamp === "lagged" ||
    input.lagged === true;
  const flushed =
    input.flushed === true &&
    lagged !== true &&
    commit.stamp === "flushed";
  return {
    commit,
    disk,
    mtime,
    lag,
    create,
    stations: ATELIER_STATIONS,
    lagged: lagged && !flushed,
    flushed:
      flushed ||
      (commit.stamp === "flushed" &&
        disk.stamp === "flushed" &&
        mtime.stamp === "flushed" &&
        lag.stamp === "flushed" &&
        create.stamp === "flushed" &&
        input.lagged !== true),
    mark: lagged && !flushed ? "lagged" : "flushed",
  };
}

/**
 * Published pentimento walk from #93482 only. Facts from the issue text.
 * A flushed booth lands the overwrite: disk bytes == committed payload
 * and mtime is honest. A lagged booth is device_commit_files reporting
 * written + fresh mtime while disk stays the previous commit.
 */
export const PENTIMENTO_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-flushed",
    flushed: true,
    lagged: false,
    overwrite: true,
    diskCommitted: true,
    mtimeHonest: true,
    written: true,
    rejectedEmpty: true,
    cue: "flushed",
    note: "idle HOLD: overwrite landed; disk bytes == committed payload; mtime honest",
  },
  {
    t: "create",
    event: "create-ok",
    createOk: true,
    create: true,
    flushed: true,
    versionA: true,
    committedPayload: VERSION_A,
    committedBytes: VERSION_A_BYTES,
    diskBytes: VERSION_A_BYTES,
    written: true,
    rejectedEmpty: true,
    cue: "flushed",
    note: "device_commit_files (new file) VERSION-A… (43 bytes) → written, no rejections → 43 bytes, VERSION-A",
  },
  {
    t: "over-b",
    event: "overwrite-b",
    overwrite: true,
    lagged: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    rejectedEmpty: true,
    committedPayload: VERSION_B,
    committedBytes: VERSION_B_BYTES,
    diskPayload: VERSION_A,
    diskBytes: VERSION_A_BYTES,
    oneBehind: true,
    cue: "lagged",
    note: "overwrite VERSION-B… (82 bytes) → written, no rejections → 43 bytes, VERSION-A (mtime advanced)",
  },
  {
    t: "second",
    event: "second-commit",
    secondCommit: true,
    flushed: true,
    overwrite: true,
    diskCommitted: true,
    mtimeHonest: true,
    written: true,
    rejectedEmpty: true,
    committedPayload: VERSION_B,
    committedBytes: VERSION_B_BYTES,
    diskBytes: VERSION_B_BYTES,
    cue: "flushed",
    note: "same payload again VERSION-B… (82 bytes) → written, no rejections → 82 bytes, VERSION-B",
  },
  {
    t: "over-c",
    event: "overwrite-c",
    overwrite: true,
    lagged: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    rejectedEmpty: true,
    committedPayload: VERSION_C,
    committedBytes: VERSION_C_BYTES,
    diskPayload: VERSION_B,
    diskBytes: VERSION_B_BYTES,
    oneBehind: true,
    cue: "lagged",
    note: "overwrite VERSION-C… (89 bytes) → written, no rejections → 82 bytes, VERSION-B (mtime advanced)",
  },
  {
    t: "wait",
    event: "wait-45s",
    wait45s: true,
    lagged: true,
    staleBytes: true,
    overwrite: true,
    oneBehind: true,
    diskPayload: VERSION_B,
    diskBytes: VERSION_B_BYTES,
    cue: "lagged",
    note: "wait 45 s, re-read, no intervening commit — still 82 bytes, VERSION-B",
  },
  {
    t: "path",
    event: "one-behind",
    oneBehind: true,
    lagged: true,
    overwrite: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    cue: "lagged",
    note: "one-behind — exactly one commit behind on overwrite",
  },
  {
    t: "score",
    event: "pentimento",
    lagged: true,
    overwrite: true,
    staleBytes: true,
    freshMtime: true,
    oneBehind: true,
    cue: "lagged",
    note: "pentimento — underpainting (stale bytes) shows through fresh varnish (mtime)",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    flushed: true,
    lagged: false,
    overwrite: true,
    diskCommitted: true,
    mtimeHonest: true,
    written: true,
    rejectedEmpty: true,
    cue: "flushed",
  };
}

export function seedFlushed() {
  return { ...emptyTicket() };
}

export function seedLagged() {
  return {
    seed: SEEDED_WORD,
    flushed: false,
    lagged: true,
    overwrite: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    rejectedEmpty: true,
    oneBehind: true,
    committedPayload: VERSION_B,
    committedBytes: VERSION_B_BYTES,
    diskPayload: VERSION_A,
    diskBytes: VERSION_A_BYTES,
    cue: "lagged",
    issue: FEATURED_ISSUE,
  };
}

export function seedPentimento() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    lagged: true,
    overwrite: true,
    staleBytes: true,
    cue: "lagged",
  };
}

export function seedOneBehind() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    lagged: true,
    overwrite: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    oneBehind: true,
    cue: "lagged",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    flushed: true,
    cue: "flushed",
  };
}

export function seedOverwrite() {
  return {
    seed: "overwrite",
    preferSeed: true,
    overwrite: true,
    cue: "lagged",
  };
}

export function seedCreateOk() {
  return {
    seed: "create-ok",
    preferSeed: true,
    createOk: true,
    cue: "flushed",
  };
}

export function seedWrittenSuccess() {
  return {
    seed: "written-success",
    preferSeed: true,
    written: true,
    cue: "lagged",
  };
}

export function seedRejectedEmpty() {
  return {
    seed: "rejected-empty",
    preferSeed: true,
    rejectedEmpty: true,
    cue: "lagged",
  };
}

export function seedFreshMtime() {
  return {
    seed: "fresh-mtime",
    preferSeed: true,
    freshMtime: true,
    cue: "lagged",
  };
}

export function seedStaleBytes() {
  return {
    seed: "stale-bytes",
    preferSeed: true,
    staleBytes: true,
    cue: "lagged",
  };
}

export function seedVersionA() {
  return {
    seed: "version-a",
    preferSeed: true,
    versionA: true,
    cue: "flushed",
  };
}

export function seedVersionB() {
  return {
    seed: "version-b",
    preferSeed: true,
    versionB: true,
    cue: "lagged",
  };
}

export function seedVersionC() {
  return {
    seed: "version-c",
    preferSeed: true,
    versionC: true,
    cue: "lagged",
  };
}

export function seedSecondCommit() {
  return {
    seed: "second-commit",
    preferSeed: true,
    secondCommit: true,
    cue: "flushed",
  };
}

export function seedWait45s() {
  return {
    seed: "wait-45s",
    preferSeed: true,
    wait45s: true,
    cue: "lagged",
  };
}

export function seedNotOnedrive() {
  return {
    seed: "not-onedrive",
    preferSeed: true,
    notOnedrive: true,
    cue: "lagged",
  };
}

export function seedNotReadCache() {
  return {
    seed: "not-read-cache",
    preferSeed: true,
    notReadCache: true,
    cue: "lagged",
  };
}

export function seedNotForce() {
  return {
    seed: "not-force",
    preferSeed: true,
    notForce: true,
    cue: "lagged",
  };
}

export function seedWorkaround() {
  return {
    seed: "workaround",
    preferSeed: true,
    workaround: true,
    cue: "lagged",
  };
}

export function seedWriteEditClean() {
  return {
    seed: "write-edit-clean",
    preferSeed: true,
    writeEditClean: true,
    cue: "flushed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      flushed: false,
      lagged: false,
      overwrite: false,
      createOk: false,
      create: false,
      written: false,
      rejectedEmpty: false,
      rejected: false,
      freshMtime: false,
      mtimeHonest: false,
      staleBytes: false,
      diskCommitted: false,
      oneBehind: false,
      secondCommit: false,
      wait45s: false,
      versionA: false,
      versionB: false,
      versionC: false,
      notOnedrive: false,
      notReadCache: false,
      notForce: false,
      workaround: false,
      writeEditClean: false,
      committedPayload: null,
      committedBytes: null,
      diskPayload: null,
      diskBytes: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    flushed: raw.flushed === true,
    lagged: raw.lagged === true,
    overwrite:
      raw.overwrite === true ||
      raw.event === "overwrite" ||
      raw.event === "overwrite-b" ||
      raw.event === "overwrite-c",
    createOk: raw.createOk === true || raw.event === "create-ok",
    create: raw.create === true || raw.createOk === true,
    written:
      raw.written === true ||
      raw.writtenSuccess === true ||
      raw.commitResult === "written",
    rejectedEmpty: raw.rejectedEmpty === true || raw.rejected === false,
    rejected: raw.rejected === true,
    freshMtime: raw.freshMtime === true || raw.mtimeAdvanced === true,
    mtimeHonest: raw.mtimeHonest === true,
    staleBytes: raw.staleBytes === true || raw.diskPrior === true,
    diskCommitted: raw.diskCommitted === true,
    oneBehind:
      raw.oneBehind === true ||
      raw.lagExactlyOne === true ||
      raw.event === "one-behind",
    secondCommit: raw.secondCommit === true || raw.event === "second-commit",
    wait45s: raw.wait45s === true || raw.event === "wait-45s",
    versionA: raw.versionA === true,
    versionB: raw.versionB === true,
    versionC: raw.versionC === true,
    notOnedrive: raw.notOnedrive === true,
    notReadCache: raw.notReadCache === true,
    notForce: raw.notForce === true,
    workaround: raw.workaround === true,
    writeEditClean: raw.writeEditClean === true,
    committedPayload: raw.committedPayload == null ? null : raw.committedPayload,
    committedBytes: raw.committedBytes == null ? null : raw.committedBytes,
    diskPayload: raw.diskPayload == null ? null : raw.diskPayload,
    diskBytes: raw.diskBytes == null ? null : raw.diskBytes,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.flushed != null ||
        ticket.lagged != null ||
        ticket.overwrite != null ||
        ticket.createOk != null ||
        ticket.written != null ||
        ticket.freshMtime != null ||
        ticket.staleBytes != null ||
        ticket.oneBehind != null ||
        ticket.mtimeHonest != null ||
        ticket.diskCommitted != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isFlushed(row) {
  if (row.lagged && row.cue !== "flushed") return false;
  if (
    row.cue === "lagged" ||
    row.cue === "pentimento" ||
    row.cue === "one-behind"
  ) {
    return false;
  }
  if (row.staleBytes && row.cue !== "flushed" && row.flushed !== true) {
    return false;
  }
  if (row.oneBehind && row.cue !== "flushed" && row.flushed !== true) {
    return false;
  }
  if (
    row.overwrite &&
    row.freshMtime &&
    row.staleBytes &&
    row.cue !== "flushed" &&
    row.flushed !== true
  ) {
    return false;
  }
  if (
    row.flushed === true &&
    row.lagged !== true &&
    row.cue !== "lagged"
  ) {
    return true;
  }
  if (
    row.cue === "flushed" &&
    row.lagged !== true &&
    row.staleBytes !== true &&
    row.oneBehind !== true
  ) {
    return true;
  }
  if (
    row.diskCommitted === true &&
    row.mtimeHonest === true &&
    row.lagged !== true &&
    row.staleBytes !== true
  ) {
    return true;
  }
  if (
    (row.createOk === true || row.secondCommit === true || row.writeEditClean === true) &&
    row.lagged !== true &&
    row.staleBytes !== true
  ) {
    return true;
  }
  return false;
}

function isLagged(row) {
  if (isFlushed(row)) return false;
  if (row.cue === "lagged" || row.cue === "pentimento") return true;
  if (row.lagged === true) return true;
  if (
    row.staleBytes === true ||
    row.oneBehind === true ||
    row.freshMtime === true ||
    (row.overwrite === true && row.flushed !== true && row.diskCommitted !== true)
  ) {
    return true;
  }
  if (
    row.overwrite &&
    (row.written || row.rejectedEmpty || row.wait45s) &&
    row.flushed !== true
  ) {
    return true;
  }
  return false;
}

function isOneBehindPath(row) {
  return (
    row.event === "one-behind" &&
    !isFlushed(row) &&
    (row.lagged === true ||
      row.oneBehind === true ||
      row.staleBytes === true)
  );
}

/**
 * Score one atelier pass against the pentimento booth.
 * flushed: overwrite landed; disk bytes == committed payload; mtime honest.
 * lagged: overwrite reported written + fresh mtime but disk still previous commit.
 * one-behind: named path — exactly one commit behind on overwrite.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isOneBehindPath(row) ||
    (row.oneBehind && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "one-behind";
  } else if (isLagged(row)) {
    verdict = "lagged";
  } else if (isFlushed(row)) {
    verdict = "flushed";
  } else if (
    row.staleBytes ||
    row.oneBehind ||
    row.freshMtime ||
    (row.overwrite && !row.diskCommitted)
  ) {
    verdict = "lagged";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const commit = inspectCommit(row);
  const disk = inspectDisk(row);
  const mtime = inspectMtime(row);
  const lag = inspectLag(row);
  const create = inspectCreate(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    flushed: verdict === "flushed" || verdict === "hold",
    lagged:
      verdict === "lagged" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    oneBehind:
      row.oneBehind === true ||
      verdict === "one-behind" ||
      verdict === PATH_WORD,
    overwrite: row.overwrite,
    createOk: row.createOk,
    create: row.create,
    written: row.written,
    rejectedEmpty: row.rejectedEmpty,
    rejected: row.rejected,
    freshMtime: row.freshMtime,
    mtimeHonest: row.mtimeHonest,
    staleBytes: row.staleBytes,
    diskCommitted: row.diskCommitted,
    secondCommit: row.secondCommit,
    wait45s: row.wait45s,
    versionA: row.versionA,
    versionB: row.versionB,
    versionC: row.versionC,
    notOnedrive: row.notOnedrive,
    notReadCache: row.notReadCache,
    notForce: row.notForce,
    workaround: row.workaround,
    writeEditClean: row.writeEditClean,
    committedPayload: row.committedPayload,
    committedBytes: row.committedBytes,
    diskPayload: row.diskPayload,
    diskBytes: row.diskBytes,
    cue: hold ? "flushed" : "lagged",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit flushed" : "score pentimento",
    commitInspect: commit,
    diskInspect: disk,
    mtimeInspect: mtime,
    lagInspect: lag,
    createInspect: create,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : PENTIMENTO_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const lagged = scored.filter((row) => row.verdict === "lagged");
  const path = scored.filter((row) => row.verdict === "one-behind");
  const flushed = scored.filter((row) => row.verdict === "flushed");
  const headline =
    scored.find((row) => row.event === "overwrite-b") ||
    scored.find((row) => row.event === "overwrite-c") ||
    scored.find((row) => row.event === "one-behind") ||
    lagged[lagged.length - 1];
  let verdict = "flushed";
  if (lagged.length) verdict = "lagged";
  else if (path.length && !flushed.length) verdict = "one-behind";
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
    laggedCount: lagged.length,
    pathCount: path.length,
    flushedCount: flushed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit flushed" : "score pentimento",
    note: headline
      ? "Claude Desktop 1.49585.0 Windows 11; Cowork cloud session; device_commit_files overwrite reports written with a fresh mtime while on-disk content lags exactly one commit; create is clean; second identical commit lands."
      : "published pentimento walk scored against flushed vs lagged",
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
    seeded !== "flushed" &&
    seeded !== "lagged" &&
    seeded !== "one-behind" &&
    seeded !== "pentimento" &&
    ticket.flushed == null &&
    ticket.lagged == null &&
    ticket.overwrite == null &&
    ticket.staleBytes == null &&
    ticket.oneBehind == null &&
    ticket.freshMtime == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
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
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
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
    flushed: scored.flushed ?? false,
    lagged: scored.lagged ?? false,
    oneBehind: scored.oneBehind ?? false,
    overwrite: scored.overwrite ?? false,
    createOk: scored.createOk ?? false,
    written: scored.written ?? false,
    freshMtime: scored.freshMtime ?? false,
    staleBytes: scored.staleBytes ?? false,
    diskCommitted: scored.diskCommitted ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.overwrite ? "op=overwrite" : result.createOk ? "op=create" : "op=idle",
    result.written || result.rejectedEmpty ? "written=yes" : "written=no",
    result.freshMtime && !result.flushed
      ? "mtime=fresh"
      : "mtime=honest",
    result.staleBytes || result.oneBehind
      ? "disk=prior"
      : "disk=committed",
    result.oneBehind || result.verdict === "one-behind"
      ? "lag=one-behind"
      : "lag=none",
    result.cue === "flushed" ? "cue=flushed" : "cue=lagged",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const easel = readEasel({
    flushed: result.flushed,
    lagged: result.lagged,
    overwrite: result.overwrite,
    createOk: result.createOk,
    written: result.written,
    rejectedEmpty: result.rejectedEmpty,
    freshMtime: result.freshMtime,
    mtimeHonest: result.mtimeHonest,
    staleBytes: result.staleBytes,
    diskCommitted: result.diskCommitted,
    oneBehind: result.oneBehind,
    committedPayload: result.committedPayload,
    committedBytes: result.committedBytes,
    diskPayload: result.diskPayload,
    diskBytes: result.diskBytes,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    easel,
    commit: inspectCommit({
      flushed: result.flushed,
      lagged: result.lagged,
      overwrite: result.overwrite,
      written: result.written,
      rejectedEmpty: result.rejectedEmpty,
      staleBytes: result.staleBytes,
      oneBehind: result.oneBehind,
    }),
    disk: inspectDisk({
      flushed: result.flushed,
      lagged: result.lagged,
      overwrite: result.overwrite,
      staleBytes: result.staleBytes,
      diskCommitted: result.diskCommitted,
      oneBehind: result.oneBehind,
      createOk: result.createOk,
      diskPayload: result.diskPayload,
      diskBytes: result.diskBytes,
      committedPayload: result.committedPayload,
      committedBytes: result.committedBytes,
    }),
    mtime: inspectMtime({
      flushed: result.flushed,
      lagged: result.lagged,
      overwrite: result.overwrite,
      freshMtime: result.freshMtime,
      mtimeHonest: result.mtimeHonest,
      staleBytes: result.staleBytes,
      oneBehind: result.oneBehind,
    }),
    lag: inspectLag({
      flushed: result.flushed,
      lagged: result.lagged,
      overwrite: result.overwrite,
      oneBehind: result.oneBehind,
      staleBytes: result.staleBytes,
    }),
    create: inspectCreate({
      flushed: result.flushed,
      lagged: result.lagged,
      overwrite: result.overwrite,
      createOk: result.createOk,
      create: result.create,
      versionA: result.versionA,
    }),
    stations: ATELIER_STATIONS.map((row) => ({
      ...row,
      lagged: result.lagged === true || result.verdict === "lagged",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeDesktopVersion: CLAUDE_DESKTOP_VERSION,
      platform: PLATFORM,
      electron: ELECTRON,
      nodeVersion: NODE_VERSION,
      os: OS,
      osBuild: OS_BUILD,
      sessionKind: SESSION_KIND,
      model: MODEL,
      commitApi: COMMIT_API,
      successShape: SUCCESS_SHAPE,
      versionA: VERSION_A,
      versionB: VERSION_B,
      versionC: VERSION_C,
      versionABytes: VERSION_A_BYTES,
      versionBBytes: VERSION_B_BYTES,
      versionCBytes: VERSION_C_BYTES,
      waitSeconds: WAIT_SECONDS,
      reproFolder: REPRO_FOLDER,
      stations: ATELIER_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "after device_commit_files returns written with no rejections, the file on disk contains the committed payload",
        "if the write cannot be completed, the call reports the path in rejected rather than returning success",
        "mtime and on-disk bytes agree — a fresh timestamp is not a substitute for the committed pigment",
        "overwrite and create are both exact on the first commit; no one-behind lag",
      ],
      hypothesis:
        "NON-BINDING: commit path may buffer/stage and swap the previous payload on overwrite; metadata vs content may come from different sources. The off-by-one shape and the create case staying correct invite that reading. Verify against #93482 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
