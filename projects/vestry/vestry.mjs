#!/usr/bin/env node
/**
 * Vestry — liturgical vestry / sacristy / peg-rail booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Linux sandbox bwrap mount-point cleanup is per-process with no
 * cross-process refcount. Placeholders for sandbox-denied paths
 * inside an allowed write root are tracked in a module-level Set;
 * an inFlight counter decrements after each sandboxed command; when
 * it hits zero that process unlinks every placeholder it knows.
 * Concurrent sessions on one project root delete each other's mounts.
 *
 *   node vestry.mjs data/vestry.json
 *   echo '{"seed":"vestry"}' | node vestry.mjs
 *
 * Idle word is pegged (HOLD: hung / stowed / refcounted / co-tenant).
 * Seeded word is vestry (#94008 — the mount-refcount race).
 * Path word is mount-refcount-race.
 * Product score word is vestry (Score vestry or admit pegged.).
 *
 * Encoded from anthropics/claude-code#94008 issue text only.
 * Hypothesis (NON-BINDING): placeholder mount lifecycle is
 * process-local with no cross-process refcount, so concurrent
 * cleanups race on shared project-root placeholders.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Demesne/#93989 (home-bind-overreach — `--bind /home /home`
 * vs `$HOME`). NOT Surfeit/#94012 (quota-spawn-cascade).
 * NOT Phosphene/#94003 (layer-tree-walk). NOT Parablepsis/#93954
 * (latin1-edit-wipe). NOT Foundling/#93889 (subagent-bash-outlive).
 * Cousins cite-only: #81602 (stray placeholders / closest neighbour,
 * no mechanism), #77271 (read-only parent shape), #79248 (git
 * config.lock vanish — same symptom string, different source),
 * #46165/#78072 (stray 0-byte placeholders, opposite lifecycle
 * direction), #89514 (WSL2+Docker unrelated shapes). Do not conflate.
 * Vestry is specifically the per-process placeholder Set + inFlight
 * zero cleanup with no cross-process refcount.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "pegged",
  "vestry",
  "mount-refcount-race",
  "hold",
  "hung",
  "stowed",
  "refcounted",
  "co-tenant",
  "placeholder-set",
  "inflight-zero",
  "cross-process",
  "bash-retry",
  "sessions-84",
  "ro-bind-null",
  "empty-tmpdir",
  "no-lock",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "pegged";
export const PATH_WORD = "mount-refcount-race";
export const SEEDED_WORD = "vestry";
export const PRODUCT_WORD = "vestry";
export const HOLD = Object.freeze(["pegged", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "pegged",
  "hung",
  "stowed",
  "refcounted",
  "co-tenant",
]);
export const RECOVER = Object.freeze(["pegged", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "tempered",
  "surfeit",
  "quota-spawn-cascade",
  "solvent",
  "frugal",
  "circuit-held",
  "no-spawn",
  "quiescent",
  "phosphene",
  "layer-tree-walk",
  "diplomatic",
  "parablepsis",
  "latin1-edit-wipe",
  "demesned",
  "demesne",
  "home-bind-overreach",
  "diagrammed",
  "cartouche",
  "section-poster",
  "unattainted",
  "attaint",
  "session-attainder",
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "latin1-edit-wipe",
  "home-bind-overreach",
  "latent",
  "afterimage",
  "legible",
  "scotomized",
  "scotoma",
  "command-args-blind",
  "followspot",
  "thrash",
  "scrim",
  "relict",
  "pentimento",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "gleaner",
  "unreaped",
  "vested",
  "plenary",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "vestry"),
);

export const FEATURED_ISSUE = 94008;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94008";
export const TITLE =
  "[BUG] Linux sandbox: bwrap mount-point cleanup is per-process with no cross-process refcount — concurrent sessions in one project root kill each other's Bash calls";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:linux",
  "area:sandbox",
]);
export const PLATFORM = "linux";
export const SURFACE = "mount-refcount-race";
export const HOST = "Claude Code Bash sandbox";
export const CHECKED_ON =
  "reproduced 2.1.245–2.1.270; mechanism from 2.1.270 binary; Linux 6.8 Ubuntu bubblewrap";
export const BUILD = "2.1.270";
export const SELECTED_MODEL = "unspecified";
export const OS = "linux 6.8 ubuntu";
export const PHRASE = "Score vestry or admit pegged.";
export const DISTRIBUTION =
  "Reproduced continuously on Claude Code 2.1.245 through 2.1.270; mechanism read out of the 2.1.270 binary. Linux 6.8, Ubuntu, distro bubblewrap. Built-in Bash sandbox enabled. For sandbox-denied paths inside an allowed write root that do not exist on disk, bwrap materialises placeholders (--ro-bind /dev/null <path>, or empty tmpdir for dirs). Placeholders are tracked in a module-level Set per process; an inFlight counter decrements after each sandboxed command; when it hits zero that process unlinks every placeholder it knows. No lock, no shared registry, no refcount across claude processes. Census: ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10.";

export const RULED_OUT = Object.freeze([
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`; different bwrap defect",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit, not mount cleanup",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash, not bwrap placeholders",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe, not sandbox mount race",
  "Foundling/#93889 subagent-bash-outlive — child Bash outlives subagent, not placeholder unlink",
  "Cartouche/#93772 section-poster — wrong diagram type, not mount refcount",
  "Attaint/#93821 session-attainder — cyber-safeguard stain, not bwrap Set",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout, not Linux sandbox",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not mount cleanup",
  "Trismus/#93823 UNUserNotification XPC lockjaw — freeze, not placeholder race",
  "Crasis/#93960 store-slug-collide — memory drawer, not bwrap",
  "Tessera/#93929 version-path-tcc — privacy-pane rows, not sandbox",
  "Mojibake/#93848 fffd-spall — encoding, not mount lifecycle",
  "Scissel / Feoffee / Apograph / Airlock — different catalog defects",
  "Afterimage — CRT phosphor residual, not sacristy peg-rail",
  "Thrash — different catalog thrash booth, not mount-refcount-race",
  "Gleaner — unreaped leftovers, not attendant clearing all pegs",
]);
export const EXPECTED = Object.freeze([
  "Placeholder mount lifetime should outlive every process that might bind it — a shared rail keeps others' mounts",
  "Cleanup must not unlink a mount point another claude process just put in its bwrap argv",
  "inFlight hitting zero in process A must not clear placeholders process B still needs",
  "Two sessions on one project root (interactive + cron, two terminals, session + claude -p) must not kill each other's Bash calls",
  "A Bash tool failure from a vanished placeholder should not be the user-visible result of a process-local Set",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "placeholder-set",
    label: "placeholder set",
    count: "module-level Set",
    note: "createdMountPoints is per-process; no shared registry across claude processes",
  },
  {
    id: "inflight-zero",
    label: "inFlight zero",
    count: "inFlight → 0",
    note: "counter decrements after each sandboxed command; at zero the process unlinks every placeholder it knows",
  },
  {
    id: "cross-process",
    label: "cross process",
    count: "2+ sessions",
    note: "interactive + cron, two terminals, session + claude -p — no lock, no refcount",
  },
  {
    id: "bash-retry",
    label: "bash retry",
    count: "fail then retry",
    note: "user sees Bash tool fail for no reason; identical command succeeds on retry",
  },
  {
    id: "sessions-84",
    label: "sessions 84",
    count: "≥84 sessions",
    note: "census floor: ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "pegged-rail",
    survey:
      "peg rail still pegged; concurrent hangers respected; shared rail keeps others' mounts",
    kind: "pegged",
    note: "idle: pegged — the hold/good path",
  },
  {
    id: "placeholder-set",
    survey:
      "bwrap materialises --ro-bind /dev/null <path> or empty tmpdir; path goes in a module-level Set",
    kind: "vestry",
    note: "seeded: placeholder-set of the process",
  },
  {
    id: "mount-refcount-race",
    survey:
      "process A cleanup deletes mount points process B just put in its bwrap argv — B dies at exec",
    kind: "vestry",
    note: "path: mount-refcount-race names the attendant clearing all pegs",
  },
  {
    id: "inflight-zero",
    survey:
      "inFlight decrements after each sandboxed command; at zero the process unlinks every placeholder it knows",
    kind: "vestry",
    note: "seeded: inflight-zero of the local counter",
  },
  {
    id: "vestry",
    survey:
      "the sacristy is vestry — concurrent acolytes; attendant clears ALL pegs; Bash fails, retry succeeds; ≥84 sessions",
    kind: "vestry",
    note: "seeded: vestry — Score vestry or admit pegged.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mount-refcount-race",
  "vestry",
  "placeholder-set",
  "inflight-zero",
  "cross-process",
  "sessions-84",
]);

export const COUSINS = Object.freeze([
  {
    issue: 81602,
    title: "Sandbox filesystem protection leaves stray placeholder files / bind mounts",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — stray placeholders / closest neighbour, no mechanism. Do not conflate with the per-process Set + inFlight-zero cleanup.",
  },
  {
    issue: 77271,
    title: "Can't create file at <cwd>/.claude/settings.json: Read-only file system",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — read-only parent shape. Distinct trigger (parent already read-only in the same session).",
  },
  {
    issue: 79248,
    title: "Can't get type of source .../config.lock from a shared .git",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — git config.lock vanish. Same symptom string, different source (git's own transient lockfile).",
  },
  {
    issue: 46165,
    title: "stray 0-byte placeholder files",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — stray 0-byte placeholders, opposite lifecycle direction (cleanup-didn't-run).",
  },
  {
    issue: 78072,
    title: "stray 0-byte placeholder files",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — stray 0-byte placeholders, opposite lifecycle direction. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925 desktop blackout", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967 OAuth profile scope Windows", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957 stuck after interrupt / No response requested", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93996, title: "backup #93996 orphaned Bash tsc/vitest after session stop", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "afterimage",
  "thrash",
  "gleaner",
]);

export const SAMPLE_KIND_IDLE = "stowed";
export const SAMPLE_KIND_SEEDED = "mount-refcount-race";
export const SAMPLE_HOLDING_IDLE = "hung";
export const SAMPLE_HOLDING_SEEDED = "stripped";

export const SAMPLE_PEGGED_PROOF = Object.freeze({
  pegged: true,
  vestry: false,
  mountRefcountRace: false,
  placeholderSet: false,
  inflightZero: false,
  crossProcess: false,
  bashRetry: false,
  sessions84: false,
  roBindNull: false,
  emptyTmpdir: false,
  noLock: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_VESTRY_PROOF = Object.freeze({
  pegged: false,
  vestry: true,
  mountRefcountRace: true,
  placeholderSet: true,
  inflightZero: true,
  crossProcess: true,
  bashRetry: true,
  sessions84: true,
  roBindNull: true,
  emptyTmpdir: true,
  noLock: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds pegged: concurrent hangers respected; shared rail keeps others' mounts" },
  { t: "placeholder-set", line: "bwrap materialises --ro-bind /dev/null <path>; path goes in a module-level Set" },
  { t: "inflight-zero", line: "inFlight hits zero; process A unlinks every placeholder it knows" },
  { t: "path", line: "mount-refcount-race — attendant clears ALL pegs; process B dies at exec" },
  { t: "score", line: "when concurrent cleanups race the booth is vestry — Score vestry or admit pegged." },
]);

/**
 * Sacristy map: pegged rail vs stripped pegs.
 * Idle/pegged: concurrent hangers respected; shared rail keeps others' mounts.
 * Seeded/vestry: attendant clears ALL pegs with no refcount.
 */
export function mapSacristy(input = {}) {
  const vestry =
    input.vestry === true ||
    input.mountRefcountRace === true ||
    input.placeholderSet === true ||
    input.inflightZero === true ||
    input.crossProcess === true ||
    input.bashRetry === true ||
    input.sessions84 === true ||
    input.roBindNull === true ||
    input.emptyTmpdir === true ||
    input.noLock === true;
  const pegged = input.pegged === true && !vestry;
  return {
    stamp: vestry ? "mount-refcount-race" : "pegged-rail",
    holdingLane: vestry ? "stripped" : "hung",
    kindLane: vestry ? "mount-refcount-race" : "stowed",
    bindLane: vestry ? "placeholder-set" : "refcounted",
    ribbon: vestry ? "vestry" : "pegged",
    pegged,
  };
}

export function inspectRail(input = {}) {
  const stripped =
    input.vestry === true ||
    input.mountRefcountRace === true ||
    input.inflightZero === true;
  if (input.pegged === true && !stripped) {
    return {
      stamp: "rail-pegged",
      stripped: false,
    };
  }
  return {
    stamp: stripped ? "rail-stripped" : "rail-idle",
    stripped,
    note: stripped
      ? "attendant clears ALL pegs with no refcount — process B's vestments fall mid-service"
      : "",
  };
}

export function inspectPlaceholders(input = {}) {
  const hit =
    input.placeholderSet === true ||
    input.roBindNull === true ||
    input.emptyTmpdir === true ||
    input.vestry === true;
  if (input.pegged === true && !hit) {
    return {
      stamp: "set-shared",
      local: false,
    };
  }
  return {
    stamp: hit ? "placeholder-set" : "set-idle",
    local: hit,
    note: hit
      ? "createdMountPoints is a module-level Set per process; --ro-bind /dev/null or empty tmpdir"
      : "",
  };
}

export function inspectInflight(input = {}) {
  const zeroed =
    input.inflightZero === true ||
    input.vestry === true;
  if (input.pegged === true && !zeroed) {
    return {
      stamp: "inflight-held",
      zero: false,
    };
  }
  return {
    stamp: zeroed ? "inflight-zero" : "inflight-idle",
    zero: zeroed,
    note: zeroed
      ? "inFlight decrements after each sandboxed command; at zero the process unlinks every placeholder it knows"
      : "",
  };
}

export function inspectTenant(input = {}) {
  const raced =
    input.crossProcess === true ||
    input.noLock === true ||
    input.vestry === true;
  if (input.pegged === true && !raced) {
    return {
      stamp: "co-tenant",
      raced: false,
    };
  }
  return {
    stamp: raced ? "cross-process" : "tenant-idle",
    raced,
    note: raced
      ? "no lock, no shared registry, no refcount across claude processes on the same project root"
      : "",
  };
}

export function inspectCensus(input = {}) {
  const counted =
    input.sessions84 === true ||
    input.bashRetry === true ||
    input.vestry === true;
  if (input.pegged === true && input.vestry !== true) {
    return {
      stamp: "census-idle",
      sessions: 0,
    };
  }
  return {
    stamp: counted ? "sessions-84" : "census-idle",
    sessions: counted && input.vestry === true ? 84 : counted ? 84 : 0,
    note: counted && input.vestry === true
      ? "≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10; Bash fails then retry succeeds"
      : "",
  };
}

export function readBooth(input = {}) {
  const vestry =
    input.vestry === true ||
    input.mountRefcountRace === true ||
    input.placeholderSet === true ||
    input.inflightZero === true ||
    input.crossProcess === true ||
    input.bashRetry === true ||
    input.sessions84 === true ||
    input.roBindNull === true ||
    input.emptyTmpdir === true ||
    input.noLock === true;
  const pegged = input.pegged === true && !vestry;
  return {
    mark: vestry ? "vestry" : pegged || !vestry ? "pegged" : "vestry",
    pegged,
    vestry,
    mountRefcountRace: input.mountRefcountRace === true || vestry,
    placeholderSet: input.placeholderSet === true,
    inflightZero: input.inflightZero === true,
    crossProcess: input.crossProcess === true,
    bashRetry: input.bashRetry === true,
    sessions84: input.sessions84 === true,
    roBindNull: input.roBindNull === true,
    emptyTmpdir: input.emptyTmpdir === true,
    noLock: input.noLock === true,
    scope: mapSacristy(input),
    rail: inspectRail(input),
    placeholders: inspectPlaceholders(input),
    inflight: inspectInflight(input),
    tenant: inspectTenant(input),
    census: inspectCensus(input),
    log: input.log || [],
  };
}

export const VESTRY_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-pegged",
    pegged: true,
    vestry: false,
    cue: "pegged",
    note: "idle HOLD: concurrent hangers respected; shared rail keeps others' mounts — the hold/good path",
  },
  {
    t: "placeholder-set",
    event: "placeholder-set",
    vestry: true,
    placeholderSet: true,
    cue: "vestry",
    note: "bwrap materialises --ro-bind /dev/null <path>; path goes in a module-level Set",
  },
  {
    t: "inflight-zero",
    event: "inflight-zero",
    vestry: true,
    inflightZero: true,
    sessions84: true,
    cue: "vestry",
    note: "inFlight hits zero; process A unlinks every placeholder it knows",
  },
  {
    t: "path",
    event: "mount-refcount-race",
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
    inflightZero: true,
    cue: "vestry",
    note: "mount-refcount-race — attendant clears ALL pegs; process B dies at exec",
  },
  {
    t: "score",
    event: "vestry",
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
    inflightZero: true,
    crossProcess: true,
    bashRetry: true,
    sessions84: true,
    roBindNull: true,
    emptyTmpdir: true,
    noLock: true,
    cue: "vestry",
    note: "vestry — when concurrent cleanups race the booth is vestry",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-pegged",
    pegged: true,
    vestry: false,
    cue: "pegged",
    note: "positive control: concurrent hangers respected; shared rail keeps others' mounts",
  },
  {
    t: "announce",
    event: "cue-pegged",
    pegged: true,
    cue: "pegged",
    note: "positive control: the sacristy stays pegged",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    pegged: true,
    vestry: false,
    mountRefcountRace: false,
    cue: "pegged",
  };
}

export function seedPegged() {
  return { ...emptyTicket() };
}

export function seedVestry() {
  return {
    seed: SEEDED_WORD,
    pegged: false,
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
    inflightZero: true,
    crossProcess: true,
    bashRetry: true,
    sessions84: true,
    roBindNull: true,
    emptyTmpdir: true,
    noLock: true,
    cue: "vestry",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_VESTRY_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
    cue: "vestry",
  };
}

export function seedMountRefcountRace() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
    event: "mount-refcount-race",
    cue: "vestry",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    pegged: true,
    cue: "pegged",
  };
}

export function seedPlaceholderSet() {
  return {
    seed: "placeholder-set",
    preferSeed: true,
    placeholderSet: true,
    cue: "vestry",
  };
}

export function seedInflightZero() {
  return {
    seed: "inflight-zero",
    preferSeed: true,
    inflightZero: true,
    cue: "vestry",
  };
}

export function seedCrossProcess() {
  return {
    seed: "cross-process",
    preferSeed: true,
    crossProcess: true,
    cue: "vestry",
  };
}

export function seedBashRetry() {
  return {
    seed: "bash-retry",
    preferSeed: true,
    bashRetry: true,
    cue: "vestry",
  };
}

export function seedSessions84() {
  return {
    seed: "sessions-84",
    preferSeed: true,
    sessions84: true,
    cue: "vestry",
  };
}

export function seedRoBindNull() {
  return {
    seed: "ro-bind-null",
    preferSeed: true,
    roBindNull: true,
    cue: "vestry",
  };
}

export function seedEmptyTmpdir() {
  return {
    seed: "empty-tmpdir",
    preferSeed: true,
    emptyTmpdir: true,
    cue: "vestry",
  };
}

export function seedNoLock() {
  return {
    seed: "no-lock",
    preferSeed: true,
    noLock: true,
    cue: "vestry",
  };
}

export function seedHung() {
  return {
    seed: "hung",
    preferSeed: true,
    pegged: true,
    cue: "pegged",
  };
}

export function seedStowed() {
  return {
    seed: "stowed",
    preferSeed: true,
    pegged: true,
    cue: "pegged",
  };
}

export function seedRefcounted() {
  return {
    seed: "refcounted",
    preferSeed: true,
    pegged: true,
    cue: "pegged",
  };
}

export function seedCoTenant() {
  return {
    seed: "co-tenant",
    preferSeed: true,
    pegged: true,
    cue: "pegged",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      pegged: false,
      vestry: false,
      mountRefcountRace: false,
      placeholderSet: false,
      inflightZero: false,
      crossProcess: false,
      bashRetry: false,
      sessions84: false,
      roBindNull: false,
      emptyTmpdir: false,
      noLock: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    pegged: raw.pegged === true,
    vestry: raw.vestry === true || raw.event === "vestry",
    mountRefcountRace:
      raw.mountRefcountRace === true || raw.event === "mount-refcount-race",
    placeholderSet:
      raw.placeholderSet === true || raw.event === "placeholder-set",
    inflightZero: raw.inflightZero === true || raw.event === "inflight-zero",
    crossProcess: raw.crossProcess === true || raw.event === "cross-process",
    bashRetry: raw.bashRetry === true || raw.event === "bash-retry",
    sessions84: raw.sessions84 === true || raw.event === "sessions-84",
    roBindNull: raw.roBindNull === true || raw.event === "ro-bind-null",
    emptyTmpdir: raw.emptyTmpdir === true || raw.event === "empty-tmpdir",
    noLock: raw.noLock === true || raw.event === "no-lock",
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
      (ticket.pegged != null ||
        ticket.vestry != null ||
        ticket.mountRefcountRace != null ||
        ticket.placeholderSet != null ||
        ticket.inflightZero != null ||
        ticket.crossProcess != null ||
        ticket.bashRetry != null ||
        ticket.sessions84 != null ||
        ticket.roBindNull != null ||
        ticket.emptyTmpdir != null ||
        ticket.noLock != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isPegged(row) {
  if (row.vestry && row.cue !== "pegged") return false;
  if (row.cue === "vestry" || row.cue === "mount-refcount-race") {
    return false;
  }
  if (
    row.mountRefcountRace &&
    row.placeholderSet &&
    row.cue !== "pegged" &&
    row.pegged !== true
  ) {
    return false;
  }
  if (row.pegged === true && row.vestry !== true && row.cue !== "vestry") {
    return true;
  }
  if (
    row.cue === "pegged" &&
    row.vestry !== true &&
    row.mountRefcountRace !== true &&
    row.placeholderSet !== true &&
    row.inflightZero !== true &&
    row.crossProcess !== true &&
    row.bashRetry !== true &&
    row.sessions84 !== true &&
    row.roBindNull !== true &&
    row.emptyTmpdir !== true &&
    row.noLock !== true
  ) {
    return true;
  }
  return false;
}

function isMountRefcountRace(row) {
  return (
    row.event === "mount-refcount-race" &&
    !isPegged(row) &&
    (row.mountRefcountRace === true ||
      row.placeholderSet === true ||
      row.inflightZero === true)
  );
}

function isVestryRow(row) {
  if (isPegged(row)) return false;
  if (isMountRefcountRace(row) && row.cue !== "vestry") return false;
  if (row.cue === "vestry") return true;
  if (row.vestry === true) return true;
  if (row.mountRefcountRace === true && row.placeholderSet === true) {
    return true;
  }
  if (
    row.mountRefcountRace === true ||
    row.placeholderSet === true ||
    row.inflightZero === true ||
    row.crossProcess === true ||
    row.bashRetry === true ||
    row.sessions84 === true ||
    row.roBindNull === true ||
    row.emptyTmpdir === true ||
    row.noLock === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one vestry pass against the sacristy peg-rail.
 * pegged: concurrent hangers respected; shared rail keeps others' mounts.
 * vestry: attendant clears ALL pegs with no cross-process refcount.
 * mount-refcount-race: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMountRefcountRace(row) ||
    (row.mountRefcountRace && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mount-refcount-race";
  } else if (isVestryRow(row)) {
    verdict = "vestry";
  } else if (isPegged(row)) {
    verdict = "pegged";
  } else if (
    row.mountRefcountRace ||
    row.placeholderSet ||
    row.inflightZero ||
    row.crossProcess ||
    row.bashRetry ||
    row.sessions84 ||
    row.roBindNull ||
    row.emptyTmpdir ||
    row.noLock
  ) {
    verdict = "vestry";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const rail = inspectRail(row);
  const placeholders = inspectPlaceholders(row);
  const inflight = inspectInflight(row);
  const tenant = inspectTenant(row);
  const census = inspectCensus(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    pegged: verdict === "pegged" || verdict === "hold",
    vestry: verdict === "vestry" || verdict === SEEDED_WORD,
    mountRefcountRace:
      row.mountRefcountRace === true ||
      verdict === "mount-refcount-race" ||
      verdict === PATH_WORD,
    placeholderSet: row.placeholderSet,
    inflightZero: row.inflightZero,
    crossProcess: row.crossProcess,
    bashRetry: row.bashRetry,
    sessions84: row.sessions84,
    roBindNull: row.roBindNull,
    emptyTmpdir: row.emptyTmpdir,
    noLock: row.noLock,
    cue: hold
      ? "pegged"
      : row.mountRefcountRace || verdict === "mount-refcount-race"
        ? "mount-refcount-race"
        : "vestry",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit pegged" : "score vestry",
    railInspect: rail,
    placeholderInspect: placeholders,
    inflightInspect: inflight,
    tenantInspect: tenant,
    censusInspect: census,
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
      : VESTRY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "vestry");
  const path = scored.filter((row) => row.verdict === "mount-refcount-race");
  const pegged = scored.filter((row) => row.verdict === "pegged");
  const headline =
    scored.find((row) => row.event === "vestry") ||
    scored.find((row) => row.event === "mount-refcount-race") ||
    scored.find((row) => row.event === "placeholder-set") ||
    dead[dead.length - 1];
  let verdict = "pegged";
  if (dead.length) verdict = "vestry";
  else if (path.length && !pegged.length) verdict = "mount-refcount-race";
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
    vestryCount: dead.length,
    pathCount: path.length,
    peggedCount: pegged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit pegged" : "score vestry",
    note: headline
      ? "Linux bwrap placeholder mount cleanup is per-process with no cross-process refcount — concurrent sessions on one project root delete each other's mount points. Cousins cite-only: #81602 #77271 #79248 #46165 #78072."
      : "published vestry walk scored against pegged vs vestry",
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
    seeded !== "pegged" &&
    seeded !== "vestry" &&
    seeded !== "mount-refcount-race" &&
    ticket.pegged == null &&
    ticket.vestry == null &&
    ticket.mountRefcountRace == null &&
    ticket.placeholderSet == null &&
    ticket.inflightZero == null &&
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
    pegged: scored.pegged ?? false,
    vestry: scored.vestry ?? false,
    mountRefcountRace: scored.mountRefcountRace ?? false,
    placeholderSet: scored.placeholderSet ?? false,
    inflightZero: scored.inflightZero ?? false,
    crossProcess: scored.crossProcess ?? false,
    bashRetry: scored.bashRetry ?? false,
    sessions84: scored.sessions84 ?? false,
    roBindNull: scored.roBindNull ?? false,
    emptyTmpdir: scored.emptyTmpdir ?? false,
    noLock: scored.noLock ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.placeholderSet || result.vestry ? "kind=mount-refcount-race" : "kind=stowed",
    result.sessions84 || result.vestry ? "sessions=84" : "sessions=none",
    result.mountRefcountRace || result.verdict === "mount-refcount-race"
      ? "path=mount-refcount-race"
      : "path=pegged",
    result.cue === "pegged"
      ? "cue=pegged"
      : result.cue === "mount-refcount-race"
        ? "cue=mount-refcount-race"
        : "cue=vestry",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    pegged: result.pegged,
    vestry: result.vestry,
    mountRefcountRace: result.mountRefcountRace,
    placeholderSet: result.placeholderSet,
    inflightZero: result.inflightZero,
    crossProcess: result.crossProcess,
    bashRetry: result.bashRetry,
    sessions84: result.sessions84,
    roBindNull: result.roBindNull,
    emptyTmpdir: result.emptyTmpdir,
    noLock: result.noLock,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    rail: inspectRail({
      pegged: result.pegged,
      vestry: result.vestry,
      mountRefcountRace: result.mountRefcountRace,
      inflightZero: result.inflightZero,
    }),
    placeholders: inspectPlaceholders({
      pegged: result.pegged,
      vestry: result.vestry,
      placeholderSet: result.placeholderSet,
      roBindNull: result.roBindNull,
      emptyTmpdir: result.emptyTmpdir,
    }),
    inflight: inspectInflight({
      pegged: result.pegged,
      vestry: result.vestry,
      inflightZero: result.inflightZero,
    }),
    tenant: inspectTenant({
      pegged: result.pegged,
      vestry: result.vestry,
      crossProcess: result.crossProcess,
      noLock: result.noLock,
    }),
    census: inspectCensus({
      pegged: result.pegged,
      vestry: result.vestry,
      sessions84: result.sessions84,
      bashRetry: result.bashRetry,
    }),
    scope: mapSacristy({
      pegged: result.pegged,
      vestry: result.vestry,
      mountRefcountRace: result.mountRefcountRace,
      placeholderSet: result.placeholderSet,
      inflightZero: result.inflightZero,
      crossProcess: result.crossProcess,
      bashRetry: result.bashRetry,
      sessions84: result.sessions84,
      roBindNull: result.roBindNull,
      emptyTmpdir: result.emptyTmpdir,
      noLock: result.noLock,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      vestry:
        result.vestry === true ||
        result.verdict === "vestry",
    })),
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: placeholder mount lifecycle is process-local with no cross-process refcount, so concurrent cleanups race on shared project-root placeholders. Invite verify against #94008 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
