#!/usr/bin/env node
/**
 * Matricula — university registrar / enrollment-desk booth.
 * A *matricula* is the roll of persons admitted to a college,
 * guild, or parish. Desktop `/reload-skills` should re-scan and
 * write a mid-session arrival onto that roll. Instead it stamps
 * `(no changes)` while a fresh process lists the new enrollee.
 * Oak counter / ivory blotter / brass stamp / ink roll.
 * NOT a cadastral survey (Cadastre). NOT a type-foundry
 * (Allograph). NOT a neurology writing-desk (Agraphia).
 *
 * Educational diagnostic model for a published Claude Code
 * desktop-app defect: `/reload-skills` reports
 * `Reloaded skills: 72 skills available (no changes)` after a
 * skill directory is created on disk mid-session. A separate
 * process started at the same moment lists `reload-probe`.
 * commands.md says the command should re-scan and report how
 * many were added or removed. `(no changes)` reads as a
 * verified negative, so the next step is debugging a file
 * that was never broken.
 *
 * Encoded from anthropics/claude-code#93987 issue text only.
 * Hypothesis (NON-BINDING): the desktop in-session re-scan
 * does not pick up skill directories created on disk during
 * the session and reports `(no changes)` as if the census
 * were complete; a fresh process sees the same disk set.
 * Invite verify against issue text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT
 * implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node matricula.mjs data/matricula.json
 *   echo '{"seed":"matricula"}' | node matricula.mjs
 *
 * Idle word is enrolled (HOLD: the live roll would pick up a
 * mid-session arrival and report it added). HOLD aliases:
 * admitted, rostered, listed, scanned, freshened.
 * Seeded word is matricula (#93987 — the reload-blind path).
 * Path word is reload-blind.
 * Product score word is matricula (Score matricula or admit enrolled.).
 *
 * NOT Allograph/#94256. NOT Agraphia/#94251. NOT Gauntlet/#94029.
 * NOT Lictor/#94053. NOT Lychgate/#94059. NOT Ouster/#94221.
 * NOT Proscription/#94202. NOT Thimblerig/#94174.
 * NOT Fetchling/#94065. NOT Rasure/#93791. NOT Cadastre/#92908.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #88164 — /skills prints No changes; there /reload-skills works.
 * #74990 — compaction drops Available-skills; /reload-skills
 * recovers it while reporting no changes.
 * #72631 (closed) — IDE palette missed newly-added symlinked
 * skills until reload.
 * Matricula is specifically desktop /reload-skills itself
 * missing a mid-session add and stamping (no changes).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "enrolled",
  "matricula",
  "reload-blind",
  "hold",
  "admitted",
  "rostered",
  "listed",
  "scanned",
  "freshened",
  "no-changes",
  "mid-session-add",
  "fresh-process-sees",
  "skill-doctor",
  "reload-probe",
  "count-stuck",
  "junction-ok",
  "verified-negative",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "enrolled";
export const PATH_WORD = "reload-blind";
export const SEEDED_WORD = "matricula";
export const PRODUCT_WORD = "matricula";
export const HOLD = Object.freeze(["enrolled", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "admitted",
  "rostered",
  "listed",
  "scanned",
  "freshened",
]);
export const RECOVER = Object.freeze(["enrolled", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FORBIDDEN_SEED = Object.freeze([
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
  "escheated",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 93987;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93987";
export const TITLE =
  '/reload-skills reports "no changes" for a skill added to disk mid-session (Desktop app); a fresh process sees it';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:skills",
  "area:desktop",
]);
export const PLATFORM = "windows";
export const SURFACE = "reload-blind";
export const HOST =
  "Claude Code desktop app 2.1.266 (Code tab), Windows 10; CLI 2.1.263 control process; personal-scope skills at ~/.claude/skills via directory junction";
export const CHECKED_ON =
  "Desktop app 2.1.266 Code tab vs CLI 2.1.263 `claude -p '/skill-doctor'` in a new process while the session stayed open";
export const BUILD =
  "Claude Code desktop 2.1.266 (Code tab, Windows 10); CLI 2.1.263 control";
export const SELECTED_MODEL = "n/a — skill re-scan, not a model defect";
export const OS =
  "Windows 10; ~/.claude/skills is a directory junction to a folder on another drive";
export const PHRASE = "Score matricula or admit enrolled.";
export const DISTRIBUTION =
  "commands.md documents /reload-skills as: re-scan skill and command directories so skills added or changed on disk during the session become available without restarting; reports how many skills are available and how many were added or removed. In the Claude Code desktop app, the re-scan does not pick up a skill directory created on disk during the session. The command returns a count with (no changes) every time, while a separate process started at the same moment lists the new skill. Session running in the desktop app (Code tab), personal-scope skills at ~/.claude/skills/<name>/SKILL.md (Windows directory junction). 1) /reload-skills → Reloaded skills: 72 skills available (no changes). 2) Create ~/.claude/skills/reload-probe/SKILL.md (valid frontmatter: name, description). 3) /reload-skills → Reloaded skills: 72 skills available (no changes); count did not move; probe not listed. 4) Edit the probe so it is user-invocable. 5) /reload-skills → Reloaded skills: 72 skills available (no changes) a third time. 6) Control, run while that session is still open: claude -p '/skill-doctor' in a new process → reload-probe   userSettings   -   -   0x  never. File, frontmatter and junction are fine. Expected: either (1 added) or an honest cannot-re-scan; (no changes) reads as a verified negative.";

export const CENSUS_PASSES = Object.freeze([
  {
    id: "baseline",
    command: "/reload-skills",
    report: "Reloaded skills: 72 skills available (no changes)",
    count: 72,
    added: 0,
    noChanges: true,
    diskHasProbe: false,
    sessionListsProbe: false,
    expected: "nothing had changed yet",
  },
  {
    id: "after-create",
    command: "/reload-skills",
    report: "Reloaded skills: 72 skills available (no changes)",
    count: 72,
    added: 0,
    noChanges: true,
    diskHasProbe: true,
    sessionListsProbe: false,
    expected: "(1 added)",
  },
  {
    id: "after-edit",
    command: "/reload-skills",
    report: "Reloaded skills: 72 skills available (no changes)",
    count: 72,
    added: 0,
    noChanges: true,
    diskHasProbe: true,
    userInvocable: true,
    sessionListsProbe: false,
    expected: "(1 added)",
  },
  {
    id: "fresh-control",
    command: "claude -p '/skill-doctor'",
    report: "reload-probe   userSettings   -   -   0x  never",
    count: null,
    added: 1,
    noChanges: false,
    diskHasProbe: true,
    sessionListsProbe: true,
    freshProcess: true,
    expected: "fresh process lists reload-probe",
  },
]);

export const RULED_OUT = Object.freeze([
  "Allograph/#94256 win-posix-mismatch — Windows punch vs POSIX matrix; type-foundry; DIFFERENT",
  "Agraphia/#94251 pre-tool-omit — JSONL drops pre-tool text; medical writing-desk; DIFFERENT",
  "Gauntlet/#94029 attach-mouse — attach ignores DISABLE_MOUSE; DIFFERENT",
  "Lictor/#94053 picker-bypass — desktop model picker skips Pre/PostModelSwitch; DIFFERENT",
  "Lychgate/#94059 bg-task-stale — moved-to-background stays Running; DIFFERENT",
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Rasure/#93791 creation-time-flip — ~/.claude wiped; parchment scrape, DIFFERENT",
  "Cadastre/#92908 — cadastral ~/.claude.json RMW lock / escheat; DIFFERENT roll",
  "#88164 — /skills prints No changes; there /reload-skills works (2 added); cite-only cousin",
  "#74990 — compaction drops Available-skills reminder; /reload-skills recovers it while reporting no changes; cite-only cousin",
  "#72631 — closed; IDE palette missed newly-added symlinked skills until reload; cite-only cousin",
]);

export const EXPECTED = Object.freeze([
  "/reload-skills should pick up directories added during the session, as commands.md says, and report (1 added)",
  "If the desktop app cannot re-scan in place, the command should say so instead of reporting (no changes)",
  "(no changes) must not read as a verified negative when the disk set grew",
  "A skill created at ~/.claude/skills/reload-probe/SKILL.md with valid name/description frontmatter should appear on the live roll",
  "Editing the probe so it is user-invocable should still be visible to the in-session re-scan",
  "A fresh process listing reload-probe via /skill-doctor proves the file, frontmatter and junction are fine",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "no-changes",
    label: "no changes stamp",
    count: "72 (no changes) ×3",
    note: "/reload-skills returns Reloaded skills: 72 skills available (no changes)",
  },
  {
    id: "mid-session-add",
    label: "mid-session add",
    count: "reload-probe on disk",
    note: "SKILL.md created while the desktop session stayed running",
  },
  {
    id: "fresh-process-sees",
    label: "fresh census",
    count: "skill-doctor lists it",
    note: "claude -p '/skill-doctor' in a new process lists reload-probe",
  },
  {
    id: "reload-probe",
    label: "reload-probe",
    count: "userSettings · 0x never",
    note: "Control row: reload-probe   userSettings   -   -   0x  never",
  },
  {
    id: "count-stuck",
    label: "count stuck",
    count: "72 did not move",
    note: "Count stayed at 72 after create and after making it user-invocable",
  },
  {
    id: "reload-blind",
    label: "reload-blind",
    count: "live roll misses the arrival",
    note: "Path: desktop /reload-skills is blind to a mid-session add",
  },
]);

export const DESK_NAMES = Object.freeze([
  {
    id: "blotter-roll",
    lost: "Blotter roll — live /reload-skills stamps (no changes) after the arrival",
    control: "The blotter would write the new name and report (1 added)",
    story: "the registrar stamps NO CHANGES on a roll that grew",
  },
  {
    id: "no-changes-stamp",
    lost: "No-changes stamp — Reloaded skills: 72 skills available (no changes) three times",
    control: "A genuine empty scan says so; a grown disk set reports added",
    story: "the brass stamp reads as a verified negative",
  },
  {
    id: "reload-probe",
    lost: "reload-probe — ~/.claude/skills/reload-probe/SKILL.md never appears on the live roll",
    control: "Valid frontmatter name + description enrolls on the next scan",
    story: "the new enrollee is on disk and absent from the session list",
  },
  {
    id: "fresh-census",
    lost: "Fresh census — a new process lists reload-probe via /skill-doctor",
    control: "Live roll and fresh census should name the same disk set",
    story: "the night clerk sees the name the day desk denies",
  },
  {
    id: "junction-path",
    lost: "Junction path — ~/.claude/skills is a directory junction; every other skill loads",
    control: "Junction is fine; the probe loads in a new session",
    story: "the path was never broken; the re-scan did not walk it",
  },
  {
    id: "reload-blind",
    lost: "reload-blind — desktop in-session re-scan misses a mid-session add",
    control: "commands.md: skills added on disk become available without restarting",
    story: "the enrollment desk scores matricula",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "blotter-roll",
    survey: "oak enrollment desk; ivory blotter; live roll should freshen",
    kind: "enrolled",
    note: "idle/control: the blotter writes arrivals — the hold/good path",
  },
  {
    id: "no-changes-stamp",
    survey: "brass stamp: Reloaded skills: 72 skills available (no changes)",
    kind: "matricula",
    note: "seeded: three stamps after the disk grew",
  },
  {
    id: "reload-probe",
    survey: "~/.claude/skills/reload-probe/SKILL.md created mid-session",
    kind: "matricula",
    note: "seeded: valid frontmatter; not listed in-session",
  },
  {
    id: "fresh-census",
    survey: "claude -p '/skill-doctor' lists reload-probe userSettings",
    kind: "matricula",
    note: "seeded: fresh process sees the same disk set",
  },
  {
    id: "junction-path",
    survey: "directory junction to another drive; other skills load",
    kind: "matricula",
    note: "seeded: junction-ok — the file was never broken",
  },
  {
    id: "enrollment-desk",
    survey: "reload-blind — desktop /reload-skills misses a mid-session add",
    kind: "matricula",
    note: "path: reload-blind names the blind live roll",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "reload-blind",
  "matricula",
  "no-changes",
  "mid-session-add",
  "fresh-process-sees",
  "reload-probe",
]);

export const COUSINS = Object.freeze([
  {
    issue: 88164,
    title:
      "/skills prints No changes instead of the list and misses skills added mid-session",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — adjacent but different: in that report /reload-skills works (19 skills available (2 added)); here /reload-skills itself misses them. Do not rebuild. Do not conflate.",
  },
  {
    issue: 74990,
    title:
      "compaction drops the Available-skills reminder; /reload-skills recovers it while reporting no changes",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — compaction reminder drop; /reload-skills recovers the reminder while reporting no changes. This booth is /reload-skills missing a mid-session add. Do not rebuild. Do not conflate.",
  },
  {
    issue: 72631,
    title:
      "IDE palette did not index newly-added symlinked skills until reload",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — closed IDE palette / symlink index. This booth is desktop /reload-skills (no changes) on a junction. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94277, title: "backup #94277", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
]);

export const SAMPLE_KIND_IDLE = "listed";
export const SAMPLE_KIND_SEEDED = "reload-blind";
export const SAMPLE_HOLDING_IDLE = "freshened";
export const SAMPLE_HOLDING_SEEDED = "no-changes";
export const PROBE_NAME = "reload-probe";
export const STUCK_COUNT = 72;

export const SAMPLE_ENROLLED_PROOF = Object.freeze({
  enrolled: true,
  matricula: false,
  reloadBlind: false,
  noChanges: false,
  midSessionAdd: false,
  freshProcessSees: false,
  countStuck: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_MATRICULA_PROOF = Object.freeze({
  enrolled: false,
  matricula: true,
  reloadBlind: true,
  noChanges: true,
  midSessionAdd: true,
  freshProcessSees: true,
  countStuck: true,
  kind: SAMPLE_KIND_SEEDED,
  names: DESK_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds enrolled: the live roll would pick up a mid-session arrival and report it added" },
  { t: "create", line: "create ~/.claude/skills/reload-probe/SKILL.md while the desktop session stays running" },
  { t: "stamp", line: "Reloaded skills: 72 skills available (no changes) — count did not move; probe not listed" },
  { t: "path", line: "reload-blind — fresh process /skill-doctor lists reload-probe; live roll stamps a verified negative" },
  { t: "score", line: "when the live roll misses an arrival a fresh census can see the booth is matricula — Score matricula or admit enrolled." },
]);

const FORCE_FLAGS = [
  "noChanges",
  "midSessionAdd",
  "freshProcessSees",
  "countStuck",
  "reloadBlind",
  "verifiedNegative",
];

/**
 * Educational census: what /reload-skills should report
 * when the disk set grows. Not a Claude Code patch.
 */
export function reloadReport({ beforeCount, afterCount } = {}) {
  const before = Number(beforeCount);
  const after = Number(afterCount);
  if (!Number.isFinite(before) || !Number.isFinite(after)) {
    return { text: "", added: 0, noChanges: true, count: afterCount ?? null };
  }
  const added = after - before;
  if (added === 0) {
    return {
      text: `Reloaded skills: ${after} skills available (no changes)`,
      added: 0,
      noChanges: true,
      count: after,
    };
  }
  const word = added > 0 ? "added" : "removed";
  const magnitude = Math.abs(added);
  return {
    text: `Reloaded skills: ${after} skills available (${magnitude} ${word})`,
    added,
    noChanges: false,
    count: after,
  };
}

export function diskHasProbe(diskSkills = []) {
  return Array.isArray(diskSkills) && diskSkills.includes(PROBE_NAME);
}

export function sessionListsProbe(sessionSkills = []) {
  return Array.isArray(sessionSkills) && sessionSkills.includes(PROBE_NAME);
}

export function freshProcessSees(freshSkills = []) {
  return sessionListsProbe(freshSkills);
}

export function scoreCensus(pass = {}) {
  const disk = pass.diskSkills || (pass.diskHasProbe ? [PROBE_NAME] : []);
  const session = pass.sessionSkills || (pass.sessionListsProbe ? [PROBE_NAME] : []);
  const fresh = pass.freshSkills || (pass.freshProcess ? [PROBE_NAME] : []);
  const before = pass.beforeCount ?? STUCK_COUNT;
  const after = pass.afterCount ?? pass.count ?? STUCK_COUNT;
  const honest = reloadReport({ beforeCount: before, afterCount: disk.length || after });
  const published = pass.report || reloadReport({ beforeCount: before, afterCount: after }).text;
  const onDisk = diskHasProbe(disk) || pass.diskHasProbe === true;
  const listed = sessionListsProbe(session) || pass.sessionListsProbe === true;
  const freshSees = freshProcessSees(fresh) || pass.freshProcess === true;
  const noChanges = /no changes/i.test(published) || pass.noChanges === true;
  const blind = onDisk && !listed && noChanges;
  return {
    command: pass.command || "/reload-skills",
    published,
    honest: honest.text,
    onDisk,
    listed,
    freshSees,
    noChanges,
    countStuck: after === STUCK_COUNT && onDisk && !listed,
    reloadBlind: blind,
    enrolled: onDisk && listed,
    matricula: blind || (onDisk && freshSees && !listed),
  };
}

/**
 * Desk map: enrolled roll vs matricula (live stamp misses the arrival).
 */
export function mapDesk(input = {}) {
  const matricula = isMatriculaInput(input);
  const enrolled = input.enrolled === true && !matricula;
  return {
    stamp: matricula ? "reload-blind" : "enrolled-roll",
    holdingLane: matricula ? "no-changes" : "freshened",
    kindLane: matricula ? "reload-blind" : "listed",
    bindLane: matricula ? "count-stuck" : "scanned",
    ribbon: matricula ? "matricula" : "enrolled",
    enrolled,
  };
}

export function inspectRoll(input = {}) {
  const written =
    input.enrolled === true ||
    isMatriculaInput(input);
  return {
    stamp: written ? (isMatriculaInput(input) ? "roll-blind" : "blotter-roll") : "roll-idle",
    written,
    note: isMatriculaInput(input)
      ? "blotter roll — live /reload-skills misses the mid-session arrival"
      : written
        ? "blotter roll — live scan would write the new name"
        : "",
  };
}

export function inspectStamp(input = {}) {
  const stamped =
    input.noChanges === true ||
    input.verifiedNegative === true ||
    input.matricula === true ||
    isMatriculaInput(input);
  if (input.enrolled === true && !stamped) {
    return { stamp: "stamp-freshened", stamped: false };
  }
  return {
    stamp: stamped ? "no-changes-stamp" : "stamp-idle",
    stamped,
    note: stamped
      ? "no-changes stamp — Reloaded skills: 72 skills available (no changes)"
      : "",
  };
}

export function inspectProbe(input = {}) {
  const missing =
    input.midSessionAdd === true ||
    input.reloadProbe === true ||
    input.matricula === true ||
    isMatriculaInput(input);
  if (input.enrolled === true && !missing) {
    return { stamp: "probe-listed", missing: false };
  }
  return {
    stamp: missing ? "reload-probe" : "probe-idle",
    missing,
    note: missing
      ? "reload-probe — SKILL.md on disk, absent from the live roll"
      : "",
  };
}

export function inspectCensus(input = {}) {
  const sees =
    input.freshProcessSees === true ||
    input.skillDoctor === true ||
    input.matricula === true ||
    isMatriculaInput(input);
  if (input.enrolled === true && !sees) {
    return { stamp: "census-enrolled", sees: false, edge: "listed" };
  }
  return {
    stamp: sees ? "fresh-census" : "census-idle",
    sees,
    edge: sees ? "fresh-process-sees" : "listed",
    note: sees
      ? "fresh census — claude -p '/skill-doctor' lists reload-probe"
      : "",
  };
}

export function inspectJunction(input = {}) {
  const ok =
    input.junctionOk === true ||
    input.matricula === true ||
    isMatriculaInput(input);
  if (input.enrolled === true && !ok) {
    return { stamp: "junction-idle", ok: false };
  }
  return {
    stamp: ok ? "junction-ok" : "junction-idle",
    ok,
    note: ok
      ? "junction-ok — ~/.claude/skills junction loads every other skill; probe loads in a new session"
      : "",
  };
}

export function inspectPath(input = {}) {
  const blind =
    input.reloadBlind === true ||
    input.matricula === true ||
    isMatriculaInput(input);
  if (input.enrolled === true && !blind) {
    return { stamp: "path-enrolled", blind: false };
  }
  return {
    stamp: blind ? "path-blind" : "path-idle",
    blind,
    note: blind
      ? "reload-blind — desktop /reload-skills misses a mid-session add"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "blotter-roll": input.noChanges || input.reloadBlind,
    "no-changes-stamp": input.noChanges,
    "reload-probe": input.midSessionAdd || input.reloadProbe,
    "fresh-census": input.freshProcessSees,
    "junction-path": input.junctionOk,
    "reload-blind": input.reloadBlind,
  };
  return (
    map[id] === true ||
    input.reloadBlind === true ||
    input.matricula === true
  );
}

function isMatriculaInput(input = {}) {
  return (
    input.matricula === true ||
    input.reloadBlind === true ||
    input.noChanges === true ||
    input.midSessionAdd === true ||
    input.freshProcessSees === true ||
    input.countStuck === true ||
    input.verifiedNegative === true ||
    input.reloadProbe === true ||
    input.skillDoctor === true
  );
}

export function readBooth(input = {}) {
  const matricula = isMatriculaInput(input);
  const enrolled = input.enrolled === true && !matricula;
  return {
    mark: matricula ? "matricula" : "enrolled",
    enrolled,
    matricula,
    reloadBlind: input.reloadBlind === true || matricula,
    noChanges: input.noChanges === true,
    midSessionAdd: input.midSessionAdd === true,
    freshProcessSees: input.freshProcessSees === true,
    countStuck: input.countStuck === true,
    verifiedNegative: input.verifiedNegative === true,
    scope: mapDesk(input),
    roll: inspectRoll(input),
    stamp: inspectStamp(input),
    probe: inspectProbe(input),
    census: inspectCensus(input),
    junction: inspectJunction(input),
    path: inspectPath(input),
    names: DESK_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const MATRICULA_WALK = Object.freeze([
  {
    t: "idle",
    event: "roll-enrolled",
    enrolled: true,
    matricula: false,
    cue: "enrolled",
    note: "idle HOLD: the live roll would pick up a mid-session arrival and report it added",
  },
  {
    t: "create",
    event: "mid-session-add",
    matricula: true,
    midSessionAdd: true,
    cue: "matricula",
    note: "create ~/.claude/skills/reload-probe/SKILL.md; session stays running",
  },
  {
    t: "stamp",
    event: "no-changes",
    matricula: true,
    noChanges: true,
    countStuck: true,
    cue: "matricula",
    note: "Reloaded skills: 72 skills available (no changes); count did not move",
  },
  {
    t: "path",
    event: "reload-blind",
    matricula: true,
    reloadBlind: true,
    noChanges: true,
    midSessionAdd: true,
    freshProcessSees: true,
    cue: "matricula",
    note: "reload-blind — fresh /skill-doctor lists reload-probe; live roll stamps a verified negative",
  },
  {
    t: "score",
    event: "matricula",
    matricula: true,
    reloadBlind: true,
    noChanges: true,
    midSessionAdd: true,
    freshProcessSees: true,
    countStuck: true,
    verifiedNegative: true,
    cue: "matricula",
    note: "matricula — the live roll misses an arrival a fresh census can see",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "roll-enrolled",
    enrolled: true,
    matricula: false,
    cue: "enrolled",
    note: "positive control: a live re-scan that reports (1 added) keeps the roll enrolled",
  },
  {
    t: "admit",
    event: "roll-enrolled",
    enrolled: true,
    cue: "enrolled",
    note: "positive control: the desk admits enrolled",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    enrolled: true,
    matricula: false,
    reloadBlind: false,
    cue: "enrolled",
  };
}

export function seedEnrolled() {
  return { ...emptyTicket() };
}

export function seedMatricula() {
  return {
    seed: SEEDED_WORD,
    enrolled: false,
    matricula: true,
    reloadBlind: true,
    noChanges: true,
    midSessionAdd: true,
    freshProcessSees: true,
    countStuck: true,
    verifiedNegative: true,
    cue: "matricula",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_MATRICULA_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    matricula: true,
    reloadBlind: true,
    cue: "matricula",
  };
}

export function seedReloadBlind() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    matricula: true,
    reloadBlind: true,
    event: "reload-blind",
    cue: "matricula",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    enrolled: true,
    cue: "enrolled",
  };
}

export function seedAdmitted() {
  return { seed: "admitted", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedRostered() {
  return { seed: "rostered", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedListed() {
  return { seed: "listed", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedScanned() {
  return { seed: "scanned", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedFreshened() {
  return { seed: "freshened", preferSeed: true, enrolled: true, cue: "enrolled" };
}

export function seedNoChanges() {
  return {
    seed: "no-changes",
    preferSeed: true,
    noChanges: true,
    cue: "matricula",
  };
}

export function seedMidSessionAdd() {
  return {
    seed: "mid-session-add",
    preferSeed: true,
    midSessionAdd: true,
    cue: "matricula",
  };
}

export function seedFreshProcessSees() {
  return {
    seed: "fresh-process-sees",
    preferSeed: true,
    freshProcessSees: true,
    cue: "matricula",
  };
}

export function seedReloadProbe() {
  return {
    seed: "reload-probe",
    preferSeed: true,
    reloadProbe: true,
    cue: "matricula",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      enrolled: false,
      matricula: false,
      reloadBlind: false,
      noChanges: false,
      midSessionAdd: false,
      freshProcessSees: false,
      countStuck: false,
      verifiedNegative: false,
      reloadProbe: false,
      skillDoctor: false,
      junctionOk: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    enrolled: raw.enrolled === true,
    matricula: raw.matricula === true || raw.event === "matricula",
    reloadBlind:
      raw.reloadBlind === true || raw.event === "reload-blind",
    noChanges: raw.noChanges === true || raw.event === "no-changes",
    midSessionAdd:
      raw.midSessionAdd === true || raw.event === "mid-session-add",
    freshProcessSees:
      raw.freshProcessSees === true || raw.event === "fresh-process-sees",
    countStuck: raw.countStuck === true || raw.event === "count-stuck",
    verifiedNegative:
      raw.verifiedNegative === true || raw.event === "verified-negative",
    reloadProbe: raw.reloadProbe === true || raw.event === "reload-probe",
    skillDoctor: raw.skillDoctor === true || raw.event === "skill-doctor",
    junctionOk: raw.junctionOk === true || raw.event === "junction-ok",
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
      (ticket.enrolled != null ||
        ticket.matricula != null ||
        ticket.reloadBlind != null ||
        ticket.noChanges != null ||
        ticket.midSessionAdd != null ||
        ticket.freshProcessSees != null ||
        ticket.countStuck != null ||
        ticket.verifiedNegative != null ||
        ticket.reloadProbe != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isEnrolled(row) {
  if (row.matricula && row.cue !== "enrolled") return false;
  if (row.cue === "matricula" || row.cue === "reload-blind") return false;
  if (
    row.reloadBlind &&
    row.noChanges &&
    row.cue !== "enrolled" &&
    row.enrolled !== true
  ) {
    return false;
  }
  if (
    row.enrolled === true &&
    row.matricula !== true &&
    row.cue !== "matricula"
  ) {
    return true;
  }
  if (
    row.cue === "enrolled" &&
    row.matricula !== true &&
    row.reloadBlind !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isReloadBlind(row) {
  return (
    row.event === "reload-blind" &&
    !isEnrolled(row) &&
    (row.reloadBlind === true ||
      row.noChanges === true ||
      row.matricula === true)
  );
}

function isMatriculaRow(row) {
  if (isEnrolled(row)) return false;
  if (isReloadBlind(row) && row.cue !== "matricula") return false;
  if (row.cue === "matricula") return true;
  if (row.matricula === true) return true;
  if (row.reloadBlind === true && row.noChanges === true) return true;
  if (
    row.reloadBlind === true ||
    row.noChanges === true ||
    row.midSessionAdd === true ||
    row.freshProcessSees === true ||
    row.countStuck === true ||
    row.verifiedNegative === true ||
    row.reloadProbe === true ||
    row.skillDoctor === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one matricula pass against the enrollment desk.
 * enrolled: live roll would pick up a mid-session arrival.
 * matricula: desktop /reload-skills stamps (no changes) while a
 * fresh process lists the new skill.
 * reload-blind: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isReloadBlind(row) ||
    (row.reloadBlind && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "reload-blind";
  } else if (isMatriculaRow(row)) {
    verdict = "matricula";
  } else if (isEnrolled(row)) {
    verdict = "enrolled";
  } else if (
    row.reloadBlind ||
    row.noChanges ||
    row.midSessionAdd ||
    row.freshProcessSees ||
    row.countStuck ||
    row.verifiedNegative
  ) {
    verdict = "matricula";
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
    enrolled: verdict === "enrolled" || verdict === "hold",
    matricula: verdict === "matricula" || verdict === SEEDED_WORD,
    reloadBlind:
      row.reloadBlind === true ||
      verdict === "reload-blind" ||
      verdict === PATH_WORD,
    noChanges: row.noChanges,
    midSessionAdd: row.midSessionAdd,
    freshProcessSees: row.freshProcessSees,
    countStuck: row.countStuck,
    verifiedNegative: row.verifiedNegative,
    cue: hold
      ? "enrolled"
      : row.reloadBlind || verdict === "reload-blind"
        ? "reload-blind"
        : "matricula",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit enrolled" : "score matricula",
    rollInspect: inspectRoll(row),
    stampInspect: inspectStamp(row),
    probeInspect: inspectProbe(row),
    censusInspect: inspectCensus(row),
    junctionInspect: inspectJunction(row),
    pathInspect: inspectPath(row),
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
      : MATRICULA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "matricula");
  const path = scored.filter((row) => row.verdict === "reload-blind");
  const enrolled = scored.filter((row) => row.verdict === "enrolled");
  const headline =
    scored.find((row) => row.event === "matricula") ||
    scored.find((row) => row.event === "reload-blind") ||
    scored.find((row) => row.event === "no-changes") ||
    charged[charged.length - 1];
  let verdict = "enrolled";
  if (charged.length) verdict = "matricula";
  else if (path.length && !enrolled.length) {
    verdict = "reload-blind";
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
    matriculaCount: charged.length,
    pathCount: path.length,
    enrolledCount: enrolled.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit enrolled" : "score matricula",
    note: headline
      ? "Desktop /reload-skills stamps (no changes) after a mid-session add; a fresh process sees reload-probe. Cousins cite-only: #88164 #74990 #72631 — do not rebuild, do not conflate."
      : "published matricula walk scored against enrolled vs matricula",
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
    seeded !== "enrolled" &&
    seeded !== "matricula" &&
    seeded !== "reload-blind" &&
    ticket.enrolled == null &&
    ticket.matricula == null &&
    ticket.reloadBlind == null &&
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
    enrolled: scored.enrolled ?? false,
    matricula: scored.matricula ?? false,
    reloadBlind: scored.reloadBlind ?? false,
    noChanges: scored.noChanges ?? false,
    midSessionAdd: scored.midSessionAdd ?? false,
    freshProcessSees: scored.freshProcessSees ?? false,
    countStuck: scored.countStuck ?? false,
    verifiedNegative: scored.verifiedNegative ?? false,
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
    result.noChanges || result.matricula
      ? "kind=reload-blind"
      : "kind=listed",
    result.midSessionAdd || result.matricula
      ? "ref=no-changes"
      : "ref=freshened",
    result.reloadBlind || result.verdict === "reload-blind"
      ? "path=reload-blind"
      : "path=enrolled",
    result.cue === "enrolled"
      ? "cue=enrolled"
      : result.cue === "reload-blind"
        ? "cue=reload-blind"
        : "cue=matricula",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    enrolled: result.enrolled,
    matricula: result.matricula,
    reloadBlind: result.reloadBlind,
    noChanges: result.noChanges,
    midSessionAdd: result.midSessionAdd,
    freshProcessSees: result.freshProcessSees,
    countStuck: result.countStuck,
    verifiedNegative: result.verifiedNegative,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    roll: inspectRoll({
      enrolled: result.enrolled,
      matricula: result.matricula,
    }),
    stamp: inspectStamp({
      enrolled: result.enrolled,
      matricula: result.matricula,
      noChanges: result.noChanges,
    }),
    probe: inspectProbe({
      enrolled: result.enrolled,
      matricula: result.matricula,
      midSessionAdd: result.midSessionAdd,
    }),
    census: inspectCensus({
      enrolled: result.enrolled,
      matricula: result.matricula,
      freshProcessSees: result.freshProcessSees,
    }),
    junction: inspectJunction({
      enrolled: result.enrolled,
      matricula: result.matricula,
      junctionOk: true,
    }),
    path: inspectPath({
      enrolled: result.enrolled,
      matricula: result.matricula,
      reloadBlind: result.reloadBlind,
    }),
    scope: mapDesk({
      enrolled: result.enrolled,
      matricula: result.matricula,
      reloadBlind: result.reloadBlind,
      noChanges: result.noChanges,
      midSessionAdd: result.midSessionAdd,
      freshProcessSees: result.freshProcessSees,
      countStuck: result.countStuck,
      verifiedNegative: result.verifiedNegative,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      matricula: result.matricula === true || result.verdict === "matricula",
    })),
    passes: CENSUS_PASSES.map((row) => ({ ...row, ...scoreCensus(row) })),
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
      names: DESK_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      passes: CENSUS_PASSES,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the desktop in-session re-scan does not pick up skill directories created on disk during the session and reports (no changes) as if the census were complete; a fresh process sees the same disk set. Invite verify against #93987 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
