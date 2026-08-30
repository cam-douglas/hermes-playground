#!/usr/bin/env node
/**
 * Almanac — stationer's feast-page scorer.
 * A fired one-shot is not next year's Loop.
 * Score the feast page or admit dated.
 *
 *   echo '{"panelShowsLoop":true,"cronListEmpty":true,"cronDeleteNotFound":true}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Idle word is dated.
 * NEVER use dated for a failure.
 *
 * Primary #90804: Background Tasks panel
 * still lists a CronCreate one-shot
 * (cron 40 10 30 8 *, recurring:false)
 * as a recurring Loop with Next 364d 23h
 * after CronList is empty and CronDelete
 * on 1a6f1a3f / 92d0877f returns not-found.
 *
 * NOT Fusee (#90485 early schedule).
 * NOT Cotter (#90533 poison fireAt).
 * NOT Sounder (#90555 missed wakeup).
 * NOT Reveille (heartbeats / duplicate).
 * NOT Leat (#90475 sleep-block until).
 * NOT Voucher (#90807 nested fabricate).
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "dated",
  "looped",
  "annual",
  "fired",
  "emptied",
  "not-found",
  "next-364d",
  "ends-3d",
  "one-shot-lie",
  "gazetted",
]);
export const IDLE_WORD = "dated";
export const ALARM_VERDICTS = Object.freeze([
  "looped",
  "annual",
  "next-364d",
  "one-shot-lie",
  "gazetted",
]);
export const LINEAR_VERDICTS = Object.freeze(["looped", "annual", "one-shot-lie"]);
export const FEATURED_ISSUE = 90804;
export const CONTRAST_67293 = 67293;
export const CONTRAST_85838 = 85838;
export const CONTRAST_80679 = 80679;
export const CONTRAST_74736 = 74736;
export const CONTRAST_86015 = 86015;
export const CONTRAST_89248 = 89248;
export const CONTRAST_FUSEE = 90485;
export const CONTRAST_COTTER = 90533;
export const CONTRAST_VOUCHER = 90807;
export const JOB_IDS = Object.freeze(["1a6f1a3f", "92d0877f"]);
export const CRON_EXPR = "40 10 30 8 *";
export const NEXT_LABEL = "364d 23h";
export const ENDS_LABEL = "3d";
export const CREATED_LOCAL = "2026-08-30T10:38";
export const FIRED_LOCAL = "2026-08-30T10:40";
export const GHOST_NEXT = "2027-08-30T10:40";
export const DEMO_VERSION = "2.1.236";
export const FILED_AT = "2026-08-30T18:09:30Z";

const FORBIDDEN_IDLE = Object.freeze([
  "almanac",
  "backed",
  "voucher",
  "cued",
  "fresh",
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
  "receipted",
  "vouched",
  "kindling",
  "deadband",
  "pawl",
  "cenotaph",
  "fetch",
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

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    panelShowsLoop: null,
    panelLabel: "",
    cronExpression: "",
    next364d: null,
    nextLabel: "",
    ends3d: null,
    endsLabel: "",
    cronListEmpty: null,
    cronListText: "",
    cronDeleteNotFound: null,
    jobIds: [],
    oneShotFired: null,
    recurring: null,
    autoDeleted: null,
    twoJobs: null,
    panelReconciled: null,
    gazetted: null,
    createdLocal: "",
    firedLocal: "",
    nearbyAnnual: false,
    nearbyFired: false,
    nearbyEmptied: false,
    nearbyNotFound: false,
    nearbyNext364d: false,
    nearbyEnds3d: false,
    nearbyOneShotLie: false,
    nearbyGazetted: false,
    nearbyLooped: false,
  };
}

export function cloneProbe(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.almanac && typeof src.almanac === "object" && src.almanac) ||
    (src.feast && typeof src.feast === "object" && src.feast) ||
    src;
  const ids = Array.isArray(nested.jobIds)
    ? nested.jobIds.map((id) => String(id))
    : [];
  return {
    ...emptyProbe(),
    ...nested,
    panelShowsLoop: asNBool(nested.panelShowsLoop),
    next364d: asNBool(nested.next364d),
    ends3d: asNBool(nested.ends3d),
    cronListEmpty: asNBool(nested.cronListEmpty),
    cronDeleteNotFound: asNBool(nested.cronDeleteNotFound),
    oneShotFired: asNBool(nested.oneShotFired),
    recurring: asNBool(nested.recurring),
    autoDeleted: asNBool(nested.autoDeleted),
    twoJobs: asNBool(nested.twoJobs),
    panelReconciled: asNBool(nested.panelReconciled),
    gazetted: asNBool(nested.gazetted),
    jobIds: ids,
    panelLabel: asText(nested.panelLabel || ""),
    cronExpression: asText(nested.cronExpression || ""),
    nextLabel: asText(nested.nextLabel || ""),
    endsLabel: asText(nested.endsLabel || ""),
    cronListText: asText(nested.cronListText || ""),
    createdLocal: asText(nested.createdLocal || ""),
    firedLocal: asText(nested.firedLocal || ""),
    nearbyAnnual: Boolean(nested.nearbyAnnual),
    nearbyFired: Boolean(nested.nearbyFired),
    nearbyEmptied: Boolean(nested.nearbyEmptied),
    nearbyNotFound: Boolean(nested.nearbyNotFound),
    nearbyNext364d: Boolean(nested.nearbyNext364d),
    nearbyEnds3d: Boolean(nested.nearbyEnds3d),
    nearbyOneShotLie: Boolean(nested.nearbyOneShotLie),
    nearbyGazetted: Boolean(nested.nearbyGazetted),
    nearbyLooped: Boolean(nested.nearbyLooped),
  };
}

export function uniqueNearby(row) {
  return Boolean(
    row.nearbyAnnual ||
      row.nearbyFired ||
      row.nearbyEmptied ||
      row.nearbyNotFound ||
      row.nearbyNext364d ||
      row.nearbyEnds3d ||
      row.nearbyOneShotLie ||
      row.nearbyGazetted ||
      row.nearbyLooped,
  );
}

export function isIdle(input) {
  const row = cloneProbe(input);
  return !(
    row.panelShowsLoop != null ||
    row.panelLabel ||
    row.cronExpression ||
    row.next364d != null ||
    row.nextLabel ||
    row.ends3d != null ||
    row.endsLabel ||
    row.cronListEmpty != null ||
    row.cronListText ||
    row.cronDeleteNotFound != null ||
    row.jobIds.length ||
    row.oneShotFired != null ||
    row.recurring != null ||
    row.autoDeleted != null ||
    row.twoJobs != null ||
    row.panelReconciled != null ||
    row.gazetted != null ||
    row.createdLocal ||
    row.firedLocal ||
    row.session ||
    row.source ||
    uniqueNearby(row)
  );
}

export function analyze(input) {
  const row = cloneProbe(input);
  const loopLabel =
    row.panelShowsLoop === true || /^loop$/i.test(row.panelLabel);
  const nextYear =
    row.next364d === true || /364d/.test(row.nextLabel);
  const endsMismatch = row.ends3d === true || /^3d$/.test(row.endsLabel);
  const listEmpty =
    row.cronListEmpty === true ||
    /no scheduled jobs/i.test(row.cronListText);
  const deleteMiss = row.cronDeleteNotFound === true;
  const fired = row.oneShotFired === true;
  const oneShot = row.recurring === false;
  const gone = row.autoDeleted === true || (fired && listEmpty);
  const gazetted = row.gazetted === true || (loopLabel && !row.panelReconciled);
  const oneShotLie = oneShot && loopLabel;
  const reconciled =
    row.panelReconciled === true || (gone && !loopLabel && listEmpty);
  const honest = Boolean(reconciled && !loopLabel);
  const primaryTriad = Boolean(
    loopLabel &&
      listEmpty &&
      deleteMiss &&
      !uniqueNearby(row) &&
      !honest,
  );
  return {
    row,
    loopLabel,
    nextYear,
    endsMismatch,
    listEmpty,
    deleteMiss,
    fired,
    oneShot,
    gone,
    gazetted,
    oneShotLie,
    reconciled,
    honest,
    primaryTriad,
  };
}

export function classify(input) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "dated";
  if (!analyze(row).primaryTriad) {
    if (row.nearbyLooped) return "looped";
    if (row.nearbyGazetted) return "gazetted";
    if (row.nearbyOneShotLie) return "one-shot-lie";
    if (row.nearbyEnds3d) return "ends-3d";
    if (row.nearbyNext364d) return "next-364d";
    if (row.nearbyNotFound) return "not-found";
    if (row.nearbyEmptied) return "emptied";
    if (row.nearbyFired) return "fired";
    if (row.nearbyAnnual) return "annual";
  }
  const f = analyze(row);
  if (f.primaryTriad) return "looped";
  if (f.honest) return "dated";
  if (f.oneShotLie && !f.listEmpty) return "one-shot-lie";
  if (f.gazetted && !f.listEmpty && !f.deleteMiss) return "gazetted";
  if (f.nextYear && !f.listEmpty) return "next-364d";
  if (f.endsMismatch && !f.loopLabel) return "ends-3d";
  if (f.deleteMiss && !f.loopLabel && !f.listEmpty) return "not-found";
  if (f.listEmpty && !f.loopLabel && !f.fired) return "emptied";
  if (f.fired && !f.loopLabel && !f.listEmpty) return "fired";
  if (f.nextYear && f.loopLabel && !f.deleteMiss) return "annual";
  if (f.loopLabel && (f.listEmpty || f.deleteMiss)) return "looped";
  if (f.honest || f.reconciled) return "dated";
  return "dated";
}

export function feedOf(kind) {
  if (kind === "looped") {
    return "● Looped · panel still treats a fired one-shot as a live Loop · primary #90804";
  }
  if (kind === "annual") {
    return "● Annual · month/day with no year, after the match, projected as next year's feast";
  }
  if (kind === "fired") {
    return "● Fired · one-shot already ran at the next match (10:40) and should have auto-deleted";
  }
  if (kind === "emptied") {
    return "● Emptied · CronList reports No scheduled jobs — clerk's ledger is blank";
  }
  if (kind === "not-found") {
    return "● Not-found · CronDelete(id) lookup-by-id misses 1a6f1a3f and 92d0877f";
  }
  if (kind === "next-364d") {
    return "● Next-364d · panel Next 364d 23h — the ghost annual after the match passed";
  }
  if (kind === "ends-3d") {
    return "● Ends-3d · Ends 3d matches neither immediate one-shot delete nor 7-day recurring expiry";
  }
  if (kind === "one-shot-lie") {
    return "● One-shot-lie · CronCreate recurring:false still labeled Loop on the printed page";
  }
  if (kind === "gazetted") {
    return "● Gazetted · feast still printed on the annual after the clerk struck the manuscript";
  }
  return "● Dated · honest feast page · fired+gone; panel is a ghost annual, not a live Loop · idle word is dated";
}

export function reasonsOf(input, kind) {
  const f = analyze(input);
  const reasons = [`verdict ${kind}`];
  if (kind === "looped" || f.primaryTriad) {
    reasons.push(
      "#90804 Background Tasks panel shows a CronCreate one-shot as a recurring Loop after CronList confirms it's deleted",
    );
  }
  if (f.loopLabel) reasons.push("panel labeled Loop with cron 40 10 30 8 *");
  if (f.nextYear) reasons.push("Next 364d 23h — month/day with no year treated as next year's annual");
  if (f.endsMismatch) reasons.push("Ends 3d matches neither one-shot delete nor 7-day recurring expiry");
  if (f.fired) reasons.push("job fired at 10:40 local; output appeared in the conversation");
  if (f.listEmpty) reasons.push('CronList: "No scheduled jobs" — documented one-shot auto-delete');
  if (f.deleteMiss) {
    reasons.push(
      "CronDelete(id) not-found for 1a6f1a3f and 92d0877f — lookup-by-id, not a list enumeration",
    );
  }
  if (f.oneShot) reasons.push("CronCreate recurring:false — fire once at next match, then auto-delete");
  if (f.oneShotLie) reasons.push("one-shot printed as Loop — the page is lying about recurrence");
  if (f.gazetted) reasons.push("printed almanac still gazettes the feast after the clerk's ledger is empty");
  if (kind === "dated") {
    reasons.push(
      "fired+gone; panel is a ghost annual, not a live Loop; idle word is dated",
    );
  }
  return reasons;
}

export function verdictOf(input) {
  return classify(input);
}

export function datedOf(input) {
  return classify(input) === "dated";
}

export function freshOf(input) {
  return datedOf(input);
}

export function score(probe) {
  const row = cloneProbe(probe);
  const kind = classify(row);
  const f = analyze(row);
  const isDated = kind === "dated";
  return {
    verdict: kind,
    state: kind,
    dated: isDated,
    fresh: isDated,
    alarm: ALARM_VERDICTS.includes(kind),
    linear: LINEAR_VERDICTS.includes(kind),
    idleWord: IDLE_WORD,
    issue: FEATURED_ISSUE,
    facts: {
      primaryTriad: f.primaryTriad,
      honest: f.honest,
      loopLabel: f.loopLabel,
      nextYear: f.nextYear,
      endsMismatch: f.endsMismatch,
      listEmpty: f.listEmpty,
      deleteMiss: f.deleteMiss,
      fired: f.fired,
      oneShot: f.oneShot,
      gone: f.gone,
      gazetted: f.gazetted,
      oneShotLie: f.oneShotLie,
      reconciled: f.reconciled,
    },
    reasons: reasonsOf(row, kind),
    feed: feedOf(kind),
    probe: row,
  };
}

export function emptyAction(action = "idle") {
  return { action, almanac: emptyProbe() };
}

export function seed90804() {
  return seedLooped();
}

export function seedLooped() {
  return {
    action: "score",
    session: "90804-ghost-annual",
    issue: FEATURED_ISSUE,
    source:
      "primary #90804: one-shot CronCreate 40 10 30 8 * fired at 10:40; CronList empty; CronDelete 1a6f1a3f / 92d0877f not-found; panel still Loop Next 364d 23h Ends 3d",
    panelShowsLoop: true,
    panelLabel: "Loop",
    cronExpression: CRON_EXPR,
    next364d: true,
    nextLabel: NEXT_LABEL,
    ends3d: true,
    endsLabel: ENDS_LABEL,
    cronListEmpty: true,
    cronListText: "No scheduled jobs",
    cronDeleteNotFound: true,
    jobIds: JOB_IDS.slice(),
    oneShotFired: true,
    recurring: false,
    autoDeleted: true,
    twoJobs: true,
    panelReconciled: false,
    gazetted: true,
    createdLocal: CREATED_LOCAL,
    firedLocal: FIRED_LOCAL,
  };
}

export function seedDated() {
  return {
    action: "score",
    session: "dated-reconciled",
    issue: FEATURED_ISSUE,
    source:
      "honest control: one-shot fired and auto-deleted; panel struck; ledger empty; lookup not-found — ghost annual named, not treated as a live Loop",
    panelShowsLoop: false,
    panelLabel: "",
    cronExpression: CRON_EXPR,
    next364d: false,
    ends3d: false,
    cronListEmpty: true,
    cronListText: "No scheduled jobs",
    cronDeleteNotFound: true,
    jobIds: JOB_IDS.slice(),
    oneShotFired: true,
    recurring: false,
    autoDeleted: true,
    twoJobs: true,
    panelReconciled: true,
    gazetted: false,
    createdLocal: CREATED_LOCAL,
    firedLocal: FIRED_LOCAL,
  };
}

export function seedControl() {
  return seedDated();
}

export function seedReset() {
  return emptyAction("reset");
}

function nearbySeed(name, flag, extra = {}) {
  return {
    session: `90804-${name}`,
    issue: FEATURED_ISSUE,
    [flag]: true,
    createdLocal: CREATED_LOCAL,
    ...extra,
  };
}

export function seedAnnual() {
  return nearbySeed("annual", "nearbyAnnual", { next364d: true, nextLabel: NEXT_LABEL });
}
export function seedFired() {
  return nearbySeed("fired", "nearbyFired", { oneShotFired: true });
}
export function seedEmptied() {
  return nearbySeed("emptied", "nearbyEmptied", {
    cronListEmpty: true,
    cronListText: "No scheduled jobs",
  });
}
export function seedNotFound() {
  return nearbySeed("not-found", "nearbyNotFound", {
    cronDeleteNotFound: true,
    jobIds: JOB_IDS.slice(),
  });
}
export function seedNext364d() {
  return nearbySeed("next-364d", "nearbyNext364d", { next364d: true });
}
export function seedEnds3d() {
  return nearbySeed("ends-3d", "nearbyEnds3d", { ends3d: true });
}
export function seedOneShotLie() {
  return nearbySeed("one-shot-lie", "nearbyOneShotLie", {
    recurring: false,
    panelShowsLoop: true,
  });
}
export function seedGazetted() {
  return nearbySeed("gazetted", "nearbyGazetted", { gazetted: true });
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  if (key === "90804" || key === "looped" || key === "loop" || key === "ghost") {
    return decide(seedLooped());
  }
  if (key === "control" || key === "dated" || key === "honest" || key === "reconciled") {
    return decide(seedDated());
  }
  if (key === "annual") return decide(seedAnnual());
  if (key === "fired") return decide(seedFired());
  if (key === "emptied") return decide(seedEmptied());
  if (key === "not-found" || key === "notfound") return decide(seedNotFound());
  if (key === "next-364d" || key === "next364d") return decide(seedNext364d());
  if (key === "ends-3d" || key === "ends3d") return decide(seedEnds3d());
  if (key === "one-shot-lie" || key === "oneshot") return decide(seedOneShotLie());
  if (key === "gazetted") return decide(seedGazetted());
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
    /* transcript / jsonl */
  }
  const probe = emptyProbe();
  const lower = text.toLowerCase();
  if (/labeled?\s*\**loop\**|panel.*loop|recurring ['"]loop['"]/.test(lower)) {
    probe.panelShowsLoop = true;
    probe.panelLabel = "Loop";
  }
  if (/40 10 30 8 \*/.test(text)) probe.cronExpression = CRON_EXPR;
  if (/364d/.test(lower)) {
    probe.next364d = true;
    probe.nextLabel = NEXT_LABEL;
  }
  if (/ends 3d/.test(lower)) {
    probe.ends3d = true;
    probe.endsLabel = ENDS_LABEL;
  }
  if (/no scheduled jobs/.test(lower)) {
    probe.cronListEmpty = true;
    probe.cronListText = "No scheduled jobs";
  }
  if (/no scheduled job with id|not found|crondelete/.test(lower)) {
    probe.cronDeleteNotFound = true;
  }
  if (/1a6f1a3f/.test(lower)) probe.jobIds.push("1a6f1a3f");
  if (/92d0877f/.test(lower)) probe.jobIds.push("92d0877f");
  if (/fired correctly|fired at 10:40|output appeared/.test(lower)) {
    probe.oneShotFired = true;
    probe.firedLocal = FIRED_LOCAL;
  }
  if (/recurring:\s*false|one-shot|oneshot/.test(lower)) probe.recurring = false;
  if (/auto-delete|auto delete/.test(lower)) probe.autoDeleted = true;
  if (/two separate/.test(lower)) probe.twoJobs = true;
  if (/#?90804/.test(text)) probe.issue = FEATURED_ISSUE;
  return probe;
}

export function decide(payload = {}) {
  const action = asText(payload.action || payload.almanac?.action || "").toLowerCase();
  if (action === "restore" || action === "90804") return score(seedLooped());
  if (action === "reset" || action === "bail" || action === "idle") return score(emptyProbe());
  if (action === "control" || action === "dated") return score(seedDated());
  const probe =
    payload.probe ||
    payload.almanac ||
    payload.feast ||
    (payload.voucher || payload.kindling || payload.fusee || payload.cotter
      ? emptyProbe()
      : payload);
  return score(probe);
}

function denyMessage(result) {
  if (result.verdict === "looped") {
    return "Almanac looped. Printed page still lists a fired one-shot as next year's Loop. #90804.";
  }
  if (result.verdict === "annual") {
    return "Almanac annual. Month/day with no year projected as next year's feast.";
  }
  if (result.verdict === "one-shot-lie") {
    return "Almanac one-shot-lie. recurring:false labeled Loop on the printed page.";
  }
  if (result.verdict === "gazetted") {
    return "Almanac gazetted. Feast still printed after the clerk struck the ledger.";
  }
  return "Almanac refuse. A fired one-shot is not next year's Loop.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = Boolean(result.alarm);
  return {
    hook_event_name: "Stop",
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: deny
        ? denyMessage(result)
        : "Almanac dated. Fired+gone; the panel is a ghost annual, not a live Loop. Idle word is dated.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedLooped();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.almanac || parsed.probe || parsed.feast
        ? parsed
        : { action: "score", almanac: cloneProbe(parsed) };
    }
  } catch {
    return { action: "score", almanac: parseTranscript(text) };
  }
  return { action: "score", almanac: parseTranscript(text) };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedLooped());
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
