#!/usr/bin/env node
/**
 * Deadband — control-room instrumentation scorer.
 * A five-second blind ignore zone is not
 * a hold. Score the suppress window or
 * admit fresh.
 *
 *   echo '{"phase":3,"timeOnlySuppress":true,"externalEditDeltaMs":2500,"suppressed":true,"nextSaveClobber":true}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Idle word is fresh.
 * NEVER use fresh for a failure.
 *
 * Primary #90789: Silent ~/.claude/settings.json
 * data loss. Time-only 5000 ms echo suppress
 * (no content compare) plus per-process cache
 * full-file stringify. Phase 3 edit ~2–3s
 * after own write is dropped on next save.
 *
 * NOT Palimpsest (updatedInput whole-replace).
 * NOT Ullage (silent context drop).
 * NOT Damper (Remote Control auto-enable).
 * NOT Quench (hard kill fuse).
 * NOT Hasp (file lease).
 * NOT Larder (plugin store freeze).
 * NOT Pawl (#90784 UserPromptSubmit stall).
 * NOT Cenotaph / Fetch / Livery / Pinfold.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "fresh",
  "time-blind",
  "content-aware",
  "window-5s",
  "cache-stale",
  "foreign-dropped",
  "key-resurrected",
  "debounce-merge",
  "full-stringify",
  "atomic-rename",
]);
export const IDLE_WORD = "fresh";
export const ALARM_VERDICTS = Object.freeze([
  "time-blind",
  "cache-stale",
  "foreign-dropped",
  "key-resurrected",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "time-blind",
  "cache-stale",
  "foreign-dropped",
]);
export const FEATURED_ISSUE = 90789;
export const CONTRAST_78321 = 78321;
export const CONTRAST_84867 = 84867;
export const CONTRAST_88113 = 88113;
export const CONTRAST_80770 = 80770;
export const CONTRAST_86935 = 86935;
export const CONTRAST_CODEX_36465 = 36465;
export const CONTRAST_CODEX_24515 = 24515;
export const CONTRAST_PAWL = 90784;
export const ECHO_WINDOW_MS = 5000;
export const PHASE3_DELTA_MS = 2500;
export const PHASE2_DELTA_MS = 20000;
export const DEMO_SPECIMENS = 3;
export const DEMO_VERSION = "2.1.240";
export const DEMO_DESKTOP = "2.1.247";
export const DEMO_ENTRYPOINT = "claude-cli";
export const FOREIGN_KEYS = Object.freeze([
  "outputStyle",
  "minimumVersion",
  "editorMode",
  "inputNeededNotifEnabled",
]);

const FORBIDDEN_IDLE = Object.freeze([
  "deadband",
  "engaged",
  "stood",
  "muted",
  "liveried",
  "penned",
  "underwrit",
  "plated",
  "collated",
  "unheard",
  "passed",
  "squared",
  "bound",
  "girt",
  "sheltered",
  "alongside",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "heard",
  "clear",
  "paired",
  "empty",
  "mute",
  "idle",
  "silent",
  "flat",
  "kernel",
  "valid",
  "sealed",
  "dry",
  "intact",
  "open",
  "still",
  "loose",
  "even",
  "quiet",
  "cool",
  "latched",
  "upheld",
  "sterling",
  "home",
  "pawl",
  "cenotaph",
  "fetch",
  "livery",
  "pinfold",
  "palimpsest",
  "pale",
  "ambo",
  "cotter",
  "ullage",
  "damper",
  "quench",
  "hasp",
  "larder",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(v) {
  return v == null ? "" : String(v);
}
function asNBool(v) {
  if (v === true || v === false) return v;
  return null;
}
function asNNum(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    phase: null,
    timeOnlySuppress: null,
    contentCompare: null,
    echoWindowMs: null,
    externalEditDeltaMs: null,
    suppressed: null,
    reloaded: null,
    nextSaveClobber: null,
    cacheFresh: null,
    cacheStale: null,
    foreignKeysDropped: null,
    deletedKeysResurrected: null,
    fullStringify: null,
    atomicRename: null,
    debounceCoalesce: null,
    probeKeyPreserved: null,
    modelReverted: null,
    ownWrite: null,
    specimens: null,
    version: "",
    entrypoint: "",
    nearby: "",
    nearbyTimeBlind: false,
    nearbyContentAware: false,
    nearbyWindow5s: false,
    nearbyCacheStale: false,
    nearbyForeignDropped: false,
    nearbyKeyResurrected: false,
    nearbyDebounceMerge: false,
    nearbyFullStringify: false,
    nearbyAtomicRename: false,
    nearbyRmwRace: false,
    nearbyPawlStall: false,
  };
}

export function cloneProbe(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.deadband && typeof src.deadband === "object" && src.deadband) ||
    (src.scope && typeof src.scope === "object" && src.scope) ||
    src;
  return {
    ...emptyProbe(),
    ...nested,
    phase: asNNum(nested.phase),
    timeOnlySuppress: asNBool(nested.timeOnlySuppress),
    contentCompare: asNBool(nested.contentCompare),
    echoWindowMs: asNNum(nested.echoWindowMs),
    externalEditDeltaMs: asNNum(nested.externalEditDeltaMs),
    suppressed: asNBool(nested.suppressed),
    reloaded: asNBool(nested.reloaded),
    nextSaveClobber: asNBool(nested.nextSaveClobber),
    cacheFresh: asNBool(nested.cacheFresh),
    cacheStale: asNBool(nested.cacheStale),
    foreignKeysDropped: asNBool(nested.foreignKeysDropped),
    deletedKeysResurrected: asNBool(nested.deletedKeysResurrected),
    fullStringify: asNBool(nested.fullStringify),
    atomicRename: asNBool(nested.atomicRename),
    debounceCoalesce: asNBool(nested.debounceCoalesce),
    probeKeyPreserved: asNBool(nested.probeKeyPreserved),
    modelReverted: asNBool(nested.modelReverted),
    ownWrite: asNBool(nested.ownWrite),
    specimens: asNNum(nested.specimens),
    version: asText(nested.version || ""),
    entrypoint: asText(nested.entrypoint || ""),
    nearby: asText(nested.nearby || ""),
    nearbyTimeBlind: Boolean(nested.nearbyTimeBlind),
    nearbyContentAware: Boolean(nested.nearbyContentAware),
    nearbyWindow5s: Boolean(nested.nearbyWindow5s),
    nearbyCacheStale: Boolean(nested.nearbyCacheStale),
    nearbyForeignDropped: Boolean(nested.nearbyForeignDropped),
    nearbyKeyResurrected: Boolean(nested.nearbyKeyResurrected),
    nearbyDebounceMerge: Boolean(nested.nearbyDebounceMerge),
    nearbyFullStringify: Boolean(nested.nearbyFullStringify),
    nearbyAtomicRename: Boolean(nested.nearbyAtomicRename),
    nearbyRmwRace: Boolean(nested.nearbyRmwRace),
    nearbyPawlStall: Boolean(nested.nearbyPawlStall),
  };
}

export function uniqueNearby(row) {
  return Boolean(
    row.nearbyTimeBlind ||
      row.nearbyContentAware ||
      row.nearbyWindow5s ||
      row.nearbyCacheStale ||
      row.nearbyForeignDropped ||
      row.nearbyKeyResurrected ||
      row.nearbyDebounceMerge ||
      row.nearbyFullStringify ||
      row.nearbyAtomicRename ||
      row.nearbyRmwRace ||
      row.nearbyPawlStall,
  );
}

export function isIdle(input) {
  const row = cloneProbe(input);
  return !(
    row.phase != null ||
    row.timeOnlySuppress != null ||
    row.contentCompare != null ||
    row.echoWindowMs != null ||
    row.externalEditDeltaMs != null ||
    row.suppressed != null ||
    row.reloaded != null ||
    row.nextSaveClobber != null ||
    row.cacheFresh != null ||
    row.cacheStale != null ||
    row.foreignKeysDropped != null ||
    row.deletedKeysResurrected != null ||
    row.fullStringify != null ||
    row.atomicRename != null ||
    row.debounceCoalesce != null ||
    row.probeKeyPreserved != null ||
    row.modelReverted != null ||
    row.ownWrite != null ||
    row.specimens != null ||
    row.version ||
    row.session ||
    row.source ||
    row.entrypoint ||
    uniqueNearby(row)
  );
}

function insideWindow(row) {
  const windowMs = row.echoWindowMs != null ? row.echoWindowMs : ECHO_WINDOW_MS;
  const delta = row.externalEditDeltaMs;
  if (delta == null) return null;
  return delta >= 0 && delta < windowMs;
}

export function analyze(input) {
  const row = cloneProbe(input);
  const windowMs = row.echoWindowMs != null ? row.echoWindowMs : ECHO_WINDOW_MS;
  const inWindow = insideWindow(row);
  const timeBlind = row.timeOnlySuppress === true || row.contentCompare === false;
  const contentAware = row.contentCompare === true && row.timeOnlySuppress !== true;
  const phase3 = row.phase === 3;
  const phase2 = row.phase === 2;
  const phase1 = row.phase === 1;
  const clobber = row.nextSaveClobber === true;
  const dropped = row.foreignKeysDropped === true;
  const resurrected = row.deletedKeysResurrected === true;
  const stale = row.cacheStale === true;
  const suppressed = row.suppressed === true;
  const survived =
    row.probeKeyPreserved === true &&
    row.nextSaveClobber !== true &&
    row.foreignKeysDropped !== true;
  const primaryTriad = Boolean(
    (phase3 || (timeBlind && inWindow === true && suppressed && clobber)) &&
      timeBlind &&
      inWindow === true &&
      suppressed &&
      clobber &&
      !uniqueNearby(row) &&
      !contentAware,
  );
  const honest = Boolean(
    (phase1 && survived && row.cacheFresh === true) ||
      (phase2 && survived && inWindow === false) ||
      (contentAware && row.reloaded === true && !clobber) ||
      (row.cacheFresh === true && survived && !timeBlind && !phase3),
  );
  return {
    row,
    windowMs,
    inWindow,
    timeBlind,
    contentAware,
    phase1,
    phase2,
    phase3,
    clobber,
    dropped,
    resurrected,
    stale,
    suppressed,
    survived,
    primaryTriad,
    honest,
  };
}

export function classify(input) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "fresh";
  if (!analyze(row).primaryTriad) {
    if (row.nearbyPawlStall) return "time-blind";
    if (row.nearbyAtomicRename) return "atomic-rename";
    if (row.nearbyFullStringify) return "full-stringify";
    if (row.nearbyDebounceMerge) return "debounce-merge";
    if (row.nearbyKeyResurrected) return "key-resurrected";
    if (row.nearbyForeignDropped) return "foreign-dropped";
    if (row.nearbyCacheStale) return "cache-stale";
    if (row.nearbyWindow5s) return "window-5s";
    if (row.nearbyContentAware) return "content-aware";
    if (row.nearbyTimeBlind) return "time-blind";
    if (row.nearbyRmwRace) return "cache-stale";
  }
  const f = analyze(row);
  if (f.primaryTriad) return "time-blind";
  if (f.honest) return "fresh";
  if (f.contentAware && !f.clobber) return "content-aware";
  if (f.resurrected && f.stale) return "key-resurrected";
  if (f.dropped && f.clobber) return "foreign-dropped";
  if (f.stale && !f.primaryTriad) return "cache-stale";
  if (row.debounceCoalesce === true && f.suppressed) return "debounce-merge";
  if (row.fullStringify === true && f.clobber) return "full-stringify";
  if (row.atomicRename === true && f.suppressed && !f.clobber) return "atomic-rename";
  if (row.echoWindowMs === ECHO_WINDOW_MS && f.timeBlind && f.inWindow !== true) {
    return "window-5s";
  }
  if (f.timeBlind && f.inWindow === true && f.suppressed) return "time-blind";
  if (f.phase1 || f.phase2) return "fresh";
  return "fresh";
}

export function feedOf(kind) {
  if (kind === "time-blind") {
    return "● Time-blind · watcher discards any change within 5000 ms of own write by timestamp only, no content compare · primary #90789";
  }
  if (kind === "content-aware") {
    return "● Content-aware · hash the bytes just written; a different payload is not an echo";
  }
  if (kind === "window-5s") {
    return "● Window-5s · echo suppression is a five-second ignore zone on the time axis";
  }
  if (kind === "cache-stale") {
    return "● Cache-stale · per-process settings cache diverges from disk for the rest of a long-lived session";
  }
  if (kind === "foreign-dropped") {
    return "● Foreign-dropped · next /model or /effort save clobbers disk from the stale cache and drops foreign keys";
  }
  if (kind === "key-resurrected") {
    return "● Key-resurrected · a later older cache rewrites the file and restores deleted keys / reverts /model";
  }
  if (kind === "debounce-merge") {
    return "● Debounce-merge · multiple change events coalesce into a single (suppressed) event";
  }
  if (kind === "full-stringify") {
    return "● Full-stringify · save merges into the cached object and writes JSON.stringify(obj, null, 2)";
  }
  if (kind === "atomic-rename") {
    return "● Atomic-rename · external writer used write-temp + rename; still masked inside the window";
  }
  return "● Fresh · honest scope · Phase 1 cache preserves; Phase 2 edit 20s before write survives · idle word is fresh";
}

export function reasonsOf(input, kind) {
  const f = analyze(input);
  const reasons = [`verdict ${kind}`];
  if (kind === "time-blind" || f.primaryTriad) {
    reasons.push(
      "#90789 silent ~/.claude/settings.json data loss: time-only echo suppress plus stale per-process cache clobber",
    );
  }
  if (f.phase3) reasons.push("Phase 3: identical external edit ~2–3s after Claude write is dropped on next save");
  if (f.phase2) reasons.push("Phase 2: external edit 20s before write survives — watcher works outside the window");
  if (f.phase1) reasons.push("Phase 1: fresh cache preserves unknown probe keys and unmanaged fields");
  if (f.timeBlind) {
    reasons.push(
      `time-only echo suppress: discard any change within ${f.windowMs} ms of own write; no content comparison`,
    );
  }
  if (f.inWindow === true) {
    reasons.push(
      `external edit Δ ${f.row.externalEditDeltaMs ?? PHASE3_DELTA_MS} ms is inside the ${f.windowMs} ms deadband`,
    );
  }
  if (f.inWindow === false && f.row.externalEditDeltaMs != null) {
    reasons.push(`external edit Δ ${f.row.externalEditDeltaMs} ms is outside the ${f.windowMs} ms window`);
  }
  if (f.suppressed) reasons.push("change event suppressed as an echo");
  if (f.row.reloaded === true) reasons.push("watcher reloaded cache from disk");
  if (f.clobber) reasons.push("next settings save rewrote the file from the stale cache");
  if (f.dropped) reasons.push(`foreign keys dropped: ${FOREIGN_KEYS.join(", ")}`);
  if (f.resurrected) reasons.push("later older cache resurrected deleted keys and reverted /model");
  if (f.stale) reasons.push("cache diverged from disk for the rest of a long-lived TUI/desktop session");
  if (f.row.fullStringify === true) reasons.push("full-file JSON.stringify from the per-process cache");
  if (f.row.atomicRename === true) reasons.push("external writer used atomic rename (temp + rename)");
  if (f.row.debounceCoalesce === true) reasons.push("debouncer coalesced multiple change events");
  if (f.row.modelReverted === true) reasons.push("user /model selection silently reverted");
  if (f.row.specimens != null) reasons.push(`${f.row.specimens} specimens`);
  if (kind === "fresh") {
    reasons.push(
      "Phase 1 fresh cache preserves; Phase 2 edit outside the window survives; idle word is fresh",
    );
  }
  return reasons;
}

export function verdictOf(input) {
  return classify(input);
}

export function freshOf(input) {
  return classify(input) === "fresh";
}

export function score(probe) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  const f = analyze(row);
  return {
    verdict: kind,
    state: kind,
    fresh: kind === "fresh",
    alarm: ALARM_VERDICTS.includes(kind),
    linear: LINEAR_VERDICTS.includes(kind),
    idleWord: IDLE_WORD,
    issue: FEATURED_ISSUE,
    facts: {
      primaryTriad: f.primaryTriad,
      honest: f.honest,
      timeBlind: f.timeBlind,
      contentAware: f.contentAware,
      inWindow: f.inWindow,
      windowMs: f.windowMs,
      phase1: f.phase1,
      phase2: f.phase2,
      phase3: f.phase3,
      clobber: f.clobber,
      dropped: f.dropped,
      resurrected: f.resurrected,
      stale: f.stale,
      suppressed: f.suppressed,
      survived: f.survived,
    },
    reasons: reasonsOf(row, kind),
    feed: feedOf(kind),
    probe: row,
  };
}

export function emptyAction(action = "idle") {
  return { action, deadband: emptyProbe() };
}

export function seed90789() {
  return seedTimeBlind();
}

export function seedTimeBlind() {
  return {
    action: "score",
    session: "90789-phase3-time-blind",
    issue: FEATURED_ISSUE,
    source:
      "primary #90789 Phase 3: identical atomic-rename edit ~2–3s after Claude write; time-only 5000 ms suppress; next save drops the key",
    phase: 3,
    timeOnlySuppress: true,
    contentCompare: false,
    echoWindowMs: ECHO_WINDOW_MS,
    externalEditDeltaMs: PHASE3_DELTA_MS,
    suppressed: true,
    reloaded: false,
    nextSaveClobber: true,
    cacheFresh: false,
    cacheStale: true,
    foreignKeysDropped: true,
    deletedKeysResurrected: false,
    fullStringify: true,
    atomicRename: true,
    debounceCoalesce: true,
    probeKeyPreserved: false,
    modelReverted: false,
    ownWrite: true,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedFresh() {
  return {
    action: "score",
    session: "fresh-phase1",
    issue: FEATURED_ISSUE,
    source:
      "honest control Phase 1: fresh cache; /effort save preserves unknown probe key and unmanaged fields",
    phase: 1,
    timeOnlySuppress: false,
    contentCompare: true,
    echoWindowMs: ECHO_WINDOW_MS,
    externalEditDeltaMs: null,
    suppressed: false,
    reloaded: false,
    nextSaveClobber: false,
    cacheFresh: true,
    cacheStale: false,
    foreignKeysDropped: false,
    deletedKeysResurrected: false,
    fullStringify: true,
    atomicRename: false,
    debounceCoalesce: false,
    probeKeyPreserved: true,
    modelReverted: false,
    ownWrite: true,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedPhase2Survive() {
  return {
    action: "score",
    session: "90789-phase2-survive",
    issue: FEATURED_ISSUE,
    source:
      "Phase 2: atomic-rename add 20s before Claude write; watcher reloads; key survives",
    phase: 2,
    timeOnlySuppress: true,
    contentCompare: false,
    echoWindowMs: ECHO_WINDOW_MS,
    externalEditDeltaMs: PHASE2_DELTA_MS,
    suppressed: false,
    reloaded: true,
    nextSaveClobber: false,
    cacheFresh: false,
    cacheStale: false,
    foreignKeysDropped: false,
    deletedKeysResurrected: false,
    fullStringify: true,
    atomicRename: true,
    debounceCoalesce: false,
    probeKeyPreserved: true,
    modelReverted: false,
    ownWrite: true,
    specimens: DEMO_SPECIMENS,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
  };
}

export function seedControl() {
  return seedFresh();
}

export function seedReset() {
  return emptyAction("reset");
}

function nearbySeed(name, flag, extra = {}) {
  return {
    session: `90789-${name}`,
    issue: FEATURED_ISSUE,
    [flag]: true,
    version: DEMO_VERSION,
    entrypoint: DEMO_ENTRYPOINT,
    ...extra,
  };
}

export function seedContentAware() {
  return nearbySeed("content-aware", "nearbyContentAware", {
    contentCompare: true,
    timeOnlySuppress: false,
    reloaded: true,
    nextSaveClobber: false,
    probeKeyPreserved: true,
  });
}
export function seedWindow5s() {
  return nearbySeed("window-5s", "nearbyWindow5s", { echoWindowMs: ECHO_WINDOW_MS });
}
export function seedCacheStale() {
  return nearbySeed("cache-stale", "nearbyCacheStale", { cacheStale: true });
}
export function seedForeignDropped() {
  return nearbySeed("foreign-dropped", "nearbyForeignDropped", {
    foreignKeysDropped: true,
    nextSaveClobber: true,
  });
}
export function seedKeyResurrected() {
  return nearbySeed("key-resurrected", "nearbyKeyResurrected", {
    deletedKeysResurrected: true,
    cacheStale: true,
    modelReverted: true,
  });
}
export function seedDebounceMerge() {
  return nearbySeed("debounce-merge", "nearbyDebounceMerge", {
    debounceCoalesce: true,
    suppressed: true,
  });
}
export function seedFullStringify() {
  return nearbySeed("full-stringify", "nearbyFullStringify", { fullStringify: true });
}
export function seedAtomicRename() {
  return nearbySeed("atomic-rename", "nearbyAtomicRename", { atomicRename: true });
}
export function seedMultiWriter() {
  return {
    session: "90789-multi-writer",
    issue: FEATURED_ISSUE,
    source:
      "real-world: long-lived TUI + desktop 2.1.247 + hook registrar; /model from stale cache drops four keys; later older cache resurrects them and reverts /model",
    phase: 3,
    timeOnlySuppress: true,
    contentCompare: false,
    echoWindowMs: ECHO_WINDOW_MS,
    cacheStale: true,
    foreignKeysDropped: true,
    deletedKeysResurrected: true,
    modelReverted: true,
    nextSaveClobber: true,
    fullStringify: true,
    atomicRename: true,
    nearbyKeyResurrected: true,
    specimens: DEMO_SPECIMENS,
    version: DEMO_DESKTOP,
    entrypoint: "claude-desktop",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  if (key === "90789" || key === "time-blind" || key === "phase3" || key === "phase-3") {
    return decide(seedTimeBlind());
  }
  if (key === "control" || key === "fresh" || key === "honest" || key === "phase1" || key === "phase-1") {
    return decide(seedFresh());
  }
  if (key === "phase2" || key === "phase-2" || key === "survive") return decide(seedPhase2Survive());
  if (key === "content-aware") return decide(seedContentAware());
  if (key === "window-5s" || key === "window") return decide(seedWindow5s());
  if (key === "cache-stale") return decide(seedCacheStale());
  if (key === "foreign-dropped") return decide(seedForeignDropped());
  if (key === "key-resurrected" || key === "multi-writer") return decide(seedKeyResurrected());
  if (key === "debounce-merge") return decide(seedDebounceMerge());
  if (key === "full-stringify") return decide(seedFullStringify());
  if (key === "atomic-rename") return decide(seedAtomicRename());
  return decide(emptyAction("idle"));
}

export function parseTranscript(raw) {
  const text = asText(raw);
  if (!text) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return cloneProbe(parsed);
    }
  } catch {
    /* transcript prose / jsonl */
  }
  const probe = emptyProbe();
  const lower = text.toLowerCase();
  if (/phase\s*3|inside the window|~2–3|2-3 seconds|2500/.test(lower)) {
    probe.phase = 3;
    probe.externalEditDeltaMs = PHASE3_DELTA_MS;
    probe.suppressed = true;
    probe.nextSaveClobber = true;
    probe.timeOnlySuppress = true;
    probe.contentCompare = false;
    probe.foreignKeysDropped = true;
  }
  if (/phase\s*2|20 seconds before|outside the window/.test(lower) && probe.phase == null) {
    probe.phase = 2;
    probe.externalEditDeltaMs = PHASE2_DELTA_MS;
    probe.reloaded = true;
    probe.probeKeyPreserved = true;
    probe.nextSaveClobber = false;
  }
  if (/phase\s*1|fresh cache|control/.test(lower) && probe.phase == null) {
    probe.phase = 1;
    probe.cacheFresh = true;
    probe.probeKeyPreserved = true;
  }
  if (/5000|5s|5-second|five-second|five second/.test(lower)) {
    probe.echoWindowMs = ECHO_WINDOW_MS;
    probe.timeOnlySuppress = true;
  }
  if (/no content|timestamp only|time-only|time only/.test(lower)) {
    probe.timeOnlySuppress = true;
    probe.contentCompare = false;
  }
  if (/json\.stringify|full-file|full file/.test(lower)) probe.fullStringify = true;
  if (/atomic rename|atomic_rename|temp.*rename/.test(lower)) probe.atomicRename = true;
  if (/debounce|coalesc/.test(lower)) probe.debounceCoalesce = true;
  if (/cache.*stale|stale cache|diverg/.test(lower)) probe.cacheStale = true;
  if (/drop(ped|s)? (the )?key|foreign key|outputstyle/.test(lower)) {
    probe.foreignKeysDropped = true;
    probe.nextSaveClobber = true;
  }
  if (/resurrect|reverted the user|reverted.*\/model/.test(lower)) {
    probe.deletedKeysResurrected = true;
    probe.modelReverted = true;
  }
  if (/2\.1\.240/.test(text)) probe.version = DEMO_VERSION;
  if (/2\.1\.247/.test(text)) probe.version = DEMO_DESKTOP;
  if (/#?90789/.test(text)) probe.issue = FEATURED_ISSUE;
  if (/claude-cli|cli binary/.test(lower)) probe.entrypoint = DEMO_ENTRYPOINT;
  return probe;
}

export function decide(payload = {}) {
  const action = asText(payload.action || payload.deadband?.action || "").toLowerCase();
  if (action === "restore" || action === "90789") return score(seedTimeBlind());
  if (action === "reset" || action === "bail" || action === "idle") return score(emptyProbe());
  if (action === "control" || action === "fresh") return score(seedFresh());
  if (action === "phase2" || action === "phase-2") return score(seedPhase2Survive());
  const probe =
    payload.probe ||
    payload.deadband ||
    payload.scope ||
    (payload.pawl || payload.cenotaph || payload.fetch ? emptyProbe() : payload);
  return score(probe);
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "time-blind") {
    return "Deadband time-blind. 5000 ms time-only echo suppress masked an atomic rename; next save clobbered disk. #90789.";
  }
  if (result.verdict === "cache-stale") {
    return "Deadband cache-stale. Per-process settings cache diverged from disk for the rest of the session.";
  }
  if (result.verdict === "foreign-dropped") {
    return "Deadband foreign-dropped. Next /model or /effort save dropped foreign keys from the stale cache.";
  }
  if (result.verdict === "key-resurrected") {
    return "Deadband key-resurrected. A later older cache restored deleted keys and reverted /model.";
  }
  return "Deadband refuse. A five-second blind ignore zone is not a hold.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: deny
        ? denyMessage(result)
        : "Deadband fresh. Phase 1 cache preserves; Phase 2 edit outside the window survives. Idle word is fresh.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedTimeBlind();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.deadband || parsed.probe || parsed.scope
        ? parsed
        : { action: "score", deadband: cloneProbe(parsed) };
    }
  } catch {
    return { action: "score", deadband: parseTranscript(text) };
  }
  return { action: "score", deadband: parseTranscript(text) };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedTimeBlind());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
