#!/usr/bin/env node
/**
 * Vinculum — chain-forge / binder's vinculum bench.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Cowork local agent mode hardlinks workspace files into its session
 * upload cache, and the cloud file bridge then refuses to read them
 * (nlink > 1).
 *
 *   node vinculum.mjs data/twinlinked.json
 *   echo '{"seed":"twinlinked"}' | node vinculum.mjs
 *
 * Idle word is solitary (HOLD: nlink=1, no Claude-owned alias,
 * cloud bridge accepts).
 * Seeded word is twinlinked (#93485: local agent mode hardlinked
 * into upload cache, nlink>1).
 * Path word is bridge-refuse.
 * Product score word is vinculum (score vinculum or admit solitary).
 *
 * Encoded from anthropics/claude-code#93485 issue text only.
 * Hypothesis (NON-BINDING): local agent mode may call fs.link into
 * the session upload cache instead of copying; cloud bridge then
 * refuses nlink>1. Verify against #93485 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT
 * implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "solitary",
  "twinlinked",
  "vinculum",
  "bridge-refuse",
  "hold",
  "nlink-one",
  "nlink-rise",
  "hardlink",
  "alias",
  "upload-cache",
  "local-mode",
  "cloud-bridge",
  "accumulate",
  "session-end",
  "write-through",
  "workaround",
  "fsutil",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "solitary";
export const PATH_WORD = "bridge-refuse";
export const SEEDED_WORD = "twinlinked";
export const PRODUCT_WORD = "vinculum";
export const HOLD = Object.freeze(["solitary", "hold"]);
export const RECOVER = Object.freeze(["solitary", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "flushed",
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
    (name) => name !== "twinlinked" && name !== "vinculum",
  ),
);

export const FEATURED_ISSUE = 93485;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93485";
export const TITLE =
  "[BUG] Cowork: local agent mode hardlinks workspace files into its session upload cache, and the cloud file bridge then refuses to read them (nlink > 1)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cowork",
]);
export const AUTHOR = "GBalunis";
export const FILED = "2026-09-10T22:20:28Z";
export const CLAUDE_DESKTOP_VERSION = "1.49585.0";
export const PLATFORM = "win32 x64";
export const OS = "Windows 11 25H2";
export const OS_BUILD = "26200.9445";
export const SESSION_KIND = "Cowork cloud session linked to a desktop device";
export const WORKSPACE_FILES = 4195;
export const AFFECTED_FILES = 20;
export const ALIAS_ENTRIES = 52;
export const SKILL_LINKS = 26;
export const OTHER_LINK_COUNTS = Object.freeze([8, 3]);
export const INTERACTIVE_LINKS = 2;
export const NLINK_REFUSE_THRESHOLD = 1;
export const UPLOAD_CACHE =
  "%APPDATA%\\Claude\\local-agent-mode-sessions\\...\\uploads\\";
export const REPRESENTATIVE = "context\\stack.md";
export const BRIDGE_ERROR =
  "file is hardlinked (nlink > 1) — refused to avoid reading through a link alias; copy the file to break the link and retry";
export const PHRASE =
  "when local agent mode hardlinks a workspace file into the session upload cache and the cloud file bridge refuses nlink > 1, score vinculum or admit solitary.";

export const FORGE_STATIONS = Object.freeze([
  {
    id: "anvil",
    survey: "seat the workspace file on the anvil",
    kind: "nlink",
    note: "idle: nlink=1, solitary inode, no Claude-owned alias",
  },
  {
    id: "tongs",
    survey: "bind the hardlink into the upload cache",
    kind: "hardlink",
    note: "local agent mode: hard link into local-agent-mode-sessions/.../uploads/",
  },
  {
    id: "gauge",
    survey: "read the brass nlink gauge",
    kind: "alias",
    note: "seeded: nlink>1; aliases accumulate and are never cleaned up",
  },
  {
    id: "bridge",
    survey: "watch the cloud file bridge",
    kind: "bridge",
    note: "cloud bridge refuses any file with nlink > 1",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "bridge-refuse",
  "twinlinked",
  "nlink-rise",
  "hardlink",
  "upload-cache",
  "local-mode",
  "cloud-bridge",
  "accumulate",
]);

export const COUSINS = Object.freeze([
  {
    issue: 50268,
    title:
      "Cowork uploads use hard links (fs.link), locking source files even after app is closed",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — related mechanism (fs.link into session uploads), different symptom (locking vs cloud refuse); do not rebuild",
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
    issue: 93482,
    title: "device_commit_files one-commit lag with fresh mtime (data-loss)",
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
]);

export const NOT_PRODUCTS = Object.freeze([
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

export function inspectNlink(input = {}) {
  const raw = Number(input.nlink);
  const nlink = Number.isFinite(raw) && raw > 0 ? raw : input.nlinkOne === true || input.solitary === true
    ? 1
    : input.nlinkRise === true ||
        input.twinlinked === true ||
        input.hardlink === true ||
        input.alias === true
      ? 2
      : 1;
  const risen = nlink > NLINK_REFUSE_THRESHOLD;
  const twinlinked =
    risen &&
    input.solitary !== true &&
    (input.twinlinked === true ||
      input.hardlink === true ||
      input.alias === true ||
      input.nlinkRise === true ||
      input.localMode === true);
  return {
    nlink: twinlinked || risen ? nlink : 1,
    one: !risen || input.solitary === true,
    risen: risen && input.solitary !== true,
    stamp: risen && input.solitary !== true ? "twinlinked" : "solitary",
    note:
      risen && input.solitary !== true
        ? `nlink=${nlink} — twinlinked; cloud bridge refuses nlink > 1`
        : "nlink=1 — solitary inode; cloud bridge accepts",
  };
}

export function inspectAlias(input = {}) {
  const present =
    input.alias === true ||
    input.claudeOwnedAlias === true ||
    input.uploadCache === true ||
    (input.hardlink === true && input.solitary !== true) ||
    (input.twinlinked === true && input.solitary !== true);
  const missing = !present || input.solitary === true;
  return {
    present: present && input.solitary !== true,
    missing,
    path: present && input.solitary !== true ? UPLOAD_CACHE : null,
    stamp: present && input.solitary !== true ? "twinlinked" : "solitary",
    note:
      present && input.solitary !== true
        ? "every alias pointed into local-agent-mode-sessions/.../uploads/"
        : "no Claude-owned alias; workspace file is solitary",
  };
}

export function inspectBridge(input = {}) {
  const refused =
    input.bridgeRefuse === true ||
    input.cloudRefuse === true ||
    ((input.nlink > NLINK_REFUSE_THRESHOLD ||
      input.nlinkRise === true ||
      input.twinlinked === true ||
      input.hardlink === true) &&
      input.solitary !== true &&
      input.cloud === true);
  const accept =
    input.solitary === true ||
    input.nlinkOne === true ||
    (!refused && input.twinlinked !== true && input.bridgeRefuse !== true);
  return {
    accepts: accept && !refused,
    refuses: refused && input.solitary !== true,
    stamp: refused && input.solitary !== true ? "twinlinked" : "solitary",
    error: refused && input.solitary !== true ? BRIDGE_ERROR : null,
    note:
      refused && input.solitary !== true
        ? BRIDGE_ERROR
        : "cloud file bridge accepts nlink=1 with no Claude-owned alias",
  };
}

export function inspectMode(input = {}) {
  const local =
    input.localMode === true ||
    input.local === true ||
    input.mode === "local" ||
    (input.hardlink === true && input.cloud !== true);
  const cloud =
    input.cloud === true ||
    input.cloudDefault === true ||
    input.mode === "cloud" ||
    input.bridgeRefuse === true;
  const manufactured =
    local &&
    input.solitary !== true &&
    (input.hardlink === true ||
      input.twinlinked === true ||
      input.nlinkRise === true);
  return {
    local: local && !cloud ? true : local,
    cloud,
    manufactured: manufactured && input.solitary !== true,
    stamp: manufactured && input.solitary !== true ? "twinlinked" : "solitary",
    note:
      manufactured && input.solitary !== true
        ? "local mode manufactures exactly the nlink > 1 condition cloud mode is designed to reject"
        : "local or idle: no manufactured Claude-owned hardlink",
  };
}

export function inspectAccumulation(input = {}) {
  const piled =
    input.accumulate === true ||
    input.unbounded === true ||
    (input.nlink >= SKILL_LINKS && input.solitary !== true) ||
    (input.twinlinked === true && input.sessionEnd === true);
  const cleaned = input.workaround === true && input.solitary === true;
  return {
    piled: piled && input.solitary !== true,
    cleaned,
    affected: piled && input.solitary !== true ? AFFECTED_FILES : 0,
    aliases: piled && input.solitary !== true ? ALIAS_ENTRIES : 0,
    stamp: piled && input.solitary !== true ? "twinlinked" : "solitary",
    note:
      piled && input.solitary !== true
        ? "20 workspace files carrying 52 alias entries; skill file reached 26 links, one per run; never cleaned up when sessions end"
        : "no accumulated Claude-owned aliases",
  };
}

export function readBench(input = {}) {
  const nlink = inspectNlink(input);
  const alias = inspectAlias(input);
  const bridge = inspectBridge(input);
  const mode = inspectMode(input);
  const accumulation = inspectAccumulation(input);
  const twinlinked =
    nlink.stamp === "twinlinked" ||
    alias.stamp === "twinlinked" ||
    bridge.stamp === "twinlinked" ||
    mode.stamp === "twinlinked" ||
    accumulation.stamp === "twinlinked" ||
    input.twinlinked === true;
  const solitary =
    input.solitary === true &&
    twinlinked !== true &&
    nlink.stamp === "solitary";
  return {
    nlink,
    alias,
    bridge,
    mode,
    accumulation,
    stations: FORGE_STATIONS,
    twinlinked: twinlinked && !solitary,
    solitary:
      solitary ||
      (nlink.stamp === "solitary" &&
        alias.stamp === "solitary" &&
        bridge.stamp === "solitary" &&
        mode.stamp === "solitary" &&
        accumulation.stamp === "solitary" &&
        input.twinlinked !== true),
    mark: twinlinked && !solitary ? "twinlinked" : "solitary",
  };
}

/**
 * Published vinculum walk from #93485 only. Facts from the issue text.
 * A solitary booth keeps nlink=1 with no Claude-owned alias so the
 * cloud file bridge accepts. A twinlinked booth is local agent mode
 * hardlinking into the session upload cache.
 */
export const VINCULUM_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-solitary",
    solitary: true,
    twinlinked: false,
    nlink: 1,
    nlinkOne: true,
    alias: false,
    hardlink: false,
    cue: "solitary",
    note: "idle HOLD: nlink=1, no Claude-owned alias, cloud bridge accepts",
  },
  {
    t: "local",
    event: "local-session",
    localMode: true,
    local: true,
    twinlinked: true,
    hardlink: true,
    cue: "twinlinked",
    note: "Windows local agent mode Cowork session with a connected folder pulls a file into session context",
  },
  {
    t: "link",
    event: "hardlink",
    localMode: true,
    hardlink: true,
    uploadCache: true,
    alias: true,
    twinlinked: true,
    nlink: 2,
    cue: "twinlinked",
    note: "does not copy; creates a hard link into %APPDATA%\\Claude\\local-agent-mode-sessions\\...\\uploads\\",
  },
  {
    t: "rise",
    event: "nlink-rise",
    nlinkRise: true,
    nlink: 2,
    hardlink: true,
    alias: true,
    twinlinked: true,
    cue: "twinlinked",
    note: "fsutil hardlink list now reports 2 links; second inside local-agent-mode-sessions/.../uploads/",
  },
  {
    t: "pile",
    event: "accumulate",
    accumulate: true,
    unbounded: true,
    nlink: 26,
    twinlinked: true,
    hardlink: true,
    alias: true,
    cue: "twinlinked",
    note: "links never removed when the session ends; recurring local scheduled task reached 26 links, one per run",
  },
  {
    t: "cloud",
    event: "cloud-default",
    cloud: true,
    cloudDefault: true,
    twinlinked: true,
    nlink: 2,
    hardlink: true,
    cue: "twinlinked",
    note: "Cowork sessions now default to the cloud; previously-fine files become unreadable with no user action",
  },
  {
    t: "refuse",
    event: "bridge-refuse",
    cloud: true,
    bridgeRefuse: true,
    nlink: 2,
    twinlinked: true,
    hardlink: true,
    alias: true,
    cue: "twinlinked",
    note: "cloud file bridge refuses any file with nlink > 1 — copy the file to break the link and retry",
  },
  {
    t: "sib",
    event: "sibling-ok",
    solitary: true,
    nlink: 1,
    nlinkOne: true,
    cue: "solitary",
    note: "sibling files in the same directory that no local session pulled in stayed at 1 link and read normally",
  },
  {
    t: "path",
    event: "bridge-refuse",
    cloud: true,
    bridgeRefuse: true,
    twinlinked: true,
    nlink: 2,
    hardlink: true,
    alias: true,
    cue: "twinlinked",
    note: "bridge-refuse — local mode manufactured the exact condition cloud mode is designed to reject",
  },
  {
    t: "score",
    event: "vinculum",
    twinlinked: true,
    hardlink: true,
    alias: true,
    nlink: 2,
    cue: "twinlinked",
    note: "vinculum — score the bond that local mode forged into the upload cache",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    solitary: true,
    twinlinked: false,
    nlink: 1,
    nlinkOne: true,
    alias: false,
    hardlink: false,
    cue: "solitary",
  };
}

export function seedSolitary() {
  return { ...emptyTicket() };
}

export function seedTwinlinked() {
  return {
    seed: SEEDED_WORD,
    solitary: false,
    twinlinked: true,
    localMode: true,
    hardlink: true,
    alias: true,
    uploadCache: true,
    nlink: 2,
    nlinkRise: true,
    cloud: true,
    bridgeRefuse: true,
    cue: "twinlinked",
    issue: FEATURED_ISSUE,
  };
}

export function seedVinculum() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    twinlinked: true,
    hardlink: true,
    alias: true,
    cue: "twinlinked",
  };
}

export function seedBridgeRefuse() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    twinlinked: true,
    hardlink: true,
    alias: true,
    cloud: true,
    bridgeRefuse: true,
    nlink: 2,
    cue: "twinlinked",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    solitary: true,
    cue: "solitary",
  };
}

export function seedNlinkOne() {
  return {
    seed: "nlink-one",
    preferSeed: true,
    nlinkOne: true,
    cue: "solitary",
  };
}

export function seedNlinkRise() {
  return {
    seed: "nlink-rise",
    preferSeed: true,
    nlinkRise: true,
    cue: "twinlinked",
  };
}

export function seedHardlink() {
  return {
    seed: "hardlink",
    preferSeed: true,
    hardlink: true,
    cue: "twinlinked",
  };
}

export function seedAlias() {
  return {
    seed: "alias",
    preferSeed: true,
    alias: true,
    cue: "twinlinked",
  };
}

export function seedUploadCache() {
  return {
    seed: "upload-cache",
    preferSeed: true,
    uploadCache: true,
    cue: "twinlinked",
  };
}

export function seedLocalMode() {
  return {
    seed: "local-mode",
    preferSeed: true,
    localMode: true,
    cue: "twinlinked",
  };
}

export function seedCloudBridge() {
  return {
    seed: "cloud-bridge",
    preferSeed: true,
    cloud: true,
    cue: "twinlinked",
  };
}

export function seedAccumulate() {
  return {
    seed: "accumulate",
    preferSeed: true,
    accumulate: true,
    cue: "twinlinked",
  };
}

export function seedSessionEnd() {
  return {
    seed: "session-end",
    preferSeed: true,
    sessionEnd: true,
    cue: "twinlinked",
  };
}

export function seedWriteThrough() {
  return {
    seed: "write-through",
    preferSeed: true,
    writeThrough: true,
    cue: "twinlinked",
  };
}

export function seedWorkaround() {
  return {
    seed: "workaround",
    preferSeed: true,
    workaround: true,
    cue: "twinlinked",
  };
}

export function seedFsutil() {
  return {
    seed: "fsutil",
    preferSeed: true,
    fsutil: true,
    cue: "twinlinked",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      solitary: false,
      twinlinked: false,
      nlink: null,
      nlinkOne: false,
      nlinkRise: false,
      hardlink: false,
      alias: false,
      uploadCache: false,
      localMode: false,
      cloud: false,
      bridgeRefuse: false,
      accumulate: false,
      sessionEnd: false,
      writeThrough: false,
      workaround: false,
      fsutil: false,
      unbounded: false,
      claudeOwnedAlias: false,
      cloudDefault: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  const nlinkRaw = Number(raw.nlink);
  return {
    solitary: raw.solitary === true,
    twinlinked: raw.twinlinked === true,
    nlink: Number.isFinite(nlinkRaw) && nlinkRaw > 0 ? nlinkRaw : null,
    nlinkOne: raw.nlinkOne === true || raw.nlink === 1,
    nlinkRise:
      raw.nlinkRise === true ||
      (Number.isFinite(nlinkRaw) && nlinkRaw > NLINK_REFUSE_THRESHOLD),
    hardlink: raw.hardlink === true || raw.event === "hardlink",
    alias: raw.alias === true || raw.claudeOwnedAlias === true,
    uploadCache:
      raw.uploadCache === true || raw.event === "hardlink" || raw.event === "upload-cache",
    localMode:
      raw.localMode === true || raw.local === true || raw.mode === "local",
    cloud:
      raw.cloud === true ||
      raw.cloudDefault === true ||
      raw.mode === "cloud" ||
      raw.bridgeRefuse === true,
    bridgeRefuse:
      raw.bridgeRefuse === true ||
      raw.cloudRefuse === true ||
      raw.event === "bridge-refuse",
    accumulate: raw.accumulate === true || raw.unbounded === true,
    sessionEnd: raw.sessionEnd === true,
    writeThrough: raw.writeThrough === true,
    workaround: raw.workaround === true,
    fsutil: raw.fsutil === true,
    unbounded: raw.unbounded === true,
    claudeOwnedAlias: raw.claudeOwnedAlias === true || raw.alias === true,
    cloudDefault: raw.cloudDefault === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.solitary != null ||
        ticket.twinlinked != null ||
        ticket.nlink != null ||
        ticket.nlinkOne != null ||
        ticket.nlinkRise != null ||
        ticket.hardlink != null ||
        ticket.alias != null ||
        ticket.uploadCache != null ||
        ticket.localMode != null ||
        ticket.cloud != null ||
        ticket.bridgeRefuse != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isSolitary(row) {
  if (row.twinlinked && row.cue !== "solitary") return false;
  if (
    row.cue === "twinlinked" ||
    row.cue === "vinculum" ||
    row.cue === "bridge-refuse"
  ) {
    return false;
  }
  if (row.hardlink && row.cue !== "solitary" && row.solitary !== true) return false;
  if (row.alias && row.cue !== "solitary" && row.solitary !== true) return false;
  if (row.bridgeRefuse && row.cue !== "solitary" && row.solitary !== true) {
    return false;
  }
  if (
    row.solitary === true &&
    row.twinlinked !== true &&
    row.cue !== "twinlinked"
  ) {
    return true;
  }
  if (
    row.cue === "solitary" &&
    row.twinlinked !== true &&
    row.hardlink !== true &&
    row.alias !== true &&
    row.bridgeRefuse !== true
  ) {
    return true;
  }
  if (
    (row.nlinkOne === true || row.nlink === 1) &&
    row.twinlinked !== true &&
    row.hardlink !== true &&
    row.alias !== true
  ) {
    return true;
  }
  return false;
}

function isTwinlinked(row) {
  if (isSolitary(row)) return false;
  if (row.cue === "twinlinked" || row.cue === "vinculum") return true;
  if (row.twinlinked === true) return true;
  if (
    row.hardlink === true ||
    row.alias === true ||
    row.nlinkRise === true ||
    (row.localMode === true && row.nlink > NLINK_REFUSE_THRESHOLD)
  ) {
    return true;
  }
  if (
    row.localMode &&
    (row.uploadCache || row.bridgeRefuse || row.accumulate || row.nlinkRise)
  ) {
    return true;
  }
  return false;
}

function isBridgeRefusePath(row) {
  return (
    row.event === "bridge-refuse" &&
    !isSolitary(row) &&
    (row.twinlinked === true ||
      row.hardlink === true ||
      row.bridgeRefuse === true)
  );
}

/**
 * Score one forge-bench pass against the vinculum booth.
 * solitary: nlink=1, no Claude-owned alias, cloud bridge accepts.
 * twinlinked: local agent mode hardlinked into upload cache, nlink>1.
 * bridge-refuse: named path — cloud bridge refuses nlink > 1.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isBridgeRefusePath(row) ||
    (row.bridgeRefuse && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "bridge-refuse";
  } else if (isTwinlinked(row)) {
    verdict = "twinlinked";
  } else if (isSolitary(row)) {
    verdict = "solitary";
  } else if (
    row.hardlink ||
    row.alias ||
    row.nlinkRise ||
    row.bridgeRefuse ||
    (row.localMode && row.uploadCache)
  ) {
    verdict = "twinlinked";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const nlink = inspectNlink(row);
  const alias = inspectAlias(row);
  const bridge = inspectBridge(row);
  const mode = inspectMode(row);
  const accumulation = inspectAccumulation(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    solitary: verdict === "solitary" || verdict === "hold",
    twinlinked:
      verdict === "twinlinked" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    bridgeRefuse:
      row.bridgeRefuse === true ||
      verdict === "bridge-refuse" ||
      verdict === PATH_WORD,
    nlink: row.nlink,
    nlinkOne: row.nlinkOne,
    nlinkRise: row.nlinkRise,
    hardlink: row.hardlink,
    alias: row.alias,
    uploadCache: row.uploadCache,
    localMode: row.localMode,
    cloud: row.cloud,
    accumulate: row.accumulate,
    sessionEnd: row.sessionEnd,
    writeThrough: row.writeThrough,
    workaround: row.workaround,
    fsutil: row.fsutil,
    unbounded: row.unbounded,
    claudeOwnedAlias: row.claudeOwnedAlias,
    cloudDefault: row.cloudDefault,
    cue: hold ? "solitary" : "twinlinked",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit solitary" : "score vinculum",
    nlinkInspect: nlink,
    aliasInspect: alias,
    bridgeInspect: bridge,
    modeInspect: mode,
    accumulationInspect: accumulation,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : VINCULUM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const twinlinked = scored.filter((row) => row.verdict === "twinlinked");
  const path = scored.filter((row) => row.verdict === "bridge-refuse");
  const solitary = scored.filter((row) => row.verdict === "solitary");
  const headline =
    scored.find((row) => row.event === "hardlink") ||
    scored.find((row) => row.event === "nlink-rise") ||
    scored.find((row) => row.event === "bridge-refuse") ||
    twinlinked[twinlinked.length - 1];
  let verdict = "solitary";
  if (twinlinked.length) verdict = "twinlinked";
  else if (path.length && !solitary.length) verdict = "bridge-refuse";
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
    twinlinkedCount: twinlinked.length,
    pathCount: path.length,
    solitaryCount: solitary.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit solitary" : "score vinculum",
    note: headline
      ? "Claude Desktop 1.49585.0 Windows 11; local agent mode hardlinks workspace files into local-agent-mode-sessions/.../uploads/; cloud file bridge refuses nlink > 1; 20 files / 52 aliases; skill file reached 26 links."
      : "published vinculum walk scored against solitary vs twinlinked",
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
    seeded !== "solitary" &&
    seeded !== "twinlinked" &&
    seeded !== "bridge-refuse" &&
    seeded !== "vinculum" &&
    ticket.solitary == null &&
    ticket.twinlinked == null &&
    ticket.hardlink == null &&
    ticket.alias == null &&
    ticket.nlink == null &&
    ticket.bridgeRefuse == null &&
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
    solitary: scored.solitary ?? false,
    twinlinked: scored.twinlinked ?? false,
    bridgeRefuse: scored.bridgeRefuse ?? false,
    nlink: scored.nlink ?? null,
    nlinkOne: scored.nlinkOne ?? false,
    nlinkRise: scored.nlinkRise ?? false,
    hardlink: scored.hardlink ?? false,
    alias: scored.alias ?? false,
    uploadCache: scored.uploadCache ?? false,
    localMode: scored.localMode ?? false,
    cloud: scored.cloud ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.localMode ? "mode=local" : result.cloud ? "mode=cloud" : "mode=idle",
    result.hardlink || result.alias ? "link=hardlink" : "link=solitary",
    result.nlinkRise || (result.nlink && result.nlink > 1)
      ? "nlink=rise"
      : "nlink=one",
    result.bridgeRefuse ? "bridge=refuse" : "bridge=accept",
    result.alias || result.uploadCache ? "alias=claude" : "alias=none",
    result.cue === "solitary" ? "cue=solitary" : "cue=twinlinked",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const bench = readBench({
    solitary: result.solitary,
    twinlinked: result.twinlinked,
    nlink: result.nlink,
    nlinkOne: result.nlinkOne,
    nlinkRise: result.nlinkRise,
    hardlink: result.hardlink,
    alias: result.alias,
    uploadCache: result.uploadCache,
    localMode: result.localMode,
    cloud: result.cloud,
    bridgeRefuse: result.bridgeRefuse,
    accumulate: result.accumulate,
    sessionEnd: result.sessionEnd,
    workaround: result.workaround,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    bench,
    nlink: inspectNlink({
      solitary: result.solitary,
      twinlinked: result.twinlinked,
      nlink: result.nlink,
      nlinkOne: result.nlinkOne,
      nlinkRise: result.nlinkRise,
      hardlink: result.hardlink,
      alias: result.alias,
      localMode: result.localMode,
    }),
    alias: inspectAlias({
      solitary: result.solitary,
      twinlinked: result.twinlinked,
      alias: result.alias,
      hardlink: result.hardlink,
      uploadCache: result.uploadCache,
    }),
    bridge: inspectBridge({
      solitary: result.solitary,
      twinlinked: result.twinlinked,
      nlink: result.nlink,
      nlinkRise: result.nlinkRise,
      hardlink: result.hardlink,
      cloud: result.cloud,
      bridgeRefuse: result.bridgeRefuse,
    }),
    mode: inspectMode({
      solitary: result.solitary,
      twinlinked: result.twinlinked,
      localMode: result.localMode,
      cloud: result.cloud,
      hardlink: result.hardlink,
      nlinkRise: result.nlinkRise,
      bridgeRefuse: result.bridgeRefuse,
    }),
    accumulation: inspectAccumulation({
      solitary: result.solitary,
      twinlinked: result.twinlinked,
      accumulate: result.accumulate,
      nlink: result.nlink,
      sessionEnd: result.sessionEnd,
      workaround: result.workaround,
    }),
    stations: FORGE_STATIONS.map((row) => ({
      ...row,
      twinlinked: result.twinlinked === true || result.verdict === "twinlinked",
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
      os: OS,
      osBuild: OS_BUILD,
      sessionKind: SESSION_KIND,
      workspaceFiles: WORKSPACE_FILES,
      affectedFiles: AFFECTED_FILES,
      aliasEntries: ALIAS_ENTRIES,
      skillLinks: SKILL_LINKS,
      otherLinkCounts: [...OTHER_LINK_COUNTS],
      interactiveLinks: INTERACTIVE_LINKS,
      nlinkRefuseThreshold: NLINK_REFUSE_THRESHOLD,
      uploadCache: UPLOAD_CACHE,
      representative: REPRESENTATIVE,
      bridgeError: BRIDGE_ERROR,
      stations: FORGE_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "copy rather than hard link into the session upload cache (also removes the write-through hazard)",
        "clean up the session upload cache when a session ends, so links do not accumulate indefinitely",
        "let the bridge resolve the case where every link lives in a Claude-owned location",
        "nlink=1 workspace files stay readable after Cowork sessions default to the cloud",
      ],
      hypothesis:
        "NON-BINDING: local agent mode may call fs.link into the session upload cache instead of copying; cloud bridge then refuses nlink>1. Verify against #93485 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
