/**
 * Datum — surveyor's datum desk for a
 * real Claude Code defect: the built-in
 * code-review skill (via /code-review
 * and the Skill tool) diffs against the
 * wrong base branch (e.g. local master
 * / origin/master) instead of the PR's
 * actual merge base, so review findings
 * cite files and lines that are not
 * part of the PR's real diff (scope
 * bleed from already-merged history).
 *
 * A wrong base is not a hold.
 * Score the plate or admit level.
 *
 * Primary #90620: OPEN, filed
 * 2026-08-29, labels bug / has repro /
 * area:skills. Title: code-review
 * skill diffs against wrong base
 * branch, pulls in unrelated files
 * as findings.
 * Repro: PR whose base is develop
 * (not master); /code-review on the
 * PR URL returns findings for files
 * absent from gh pr diff.
 * Run 1 admitted "PR's actual base
 * is develop… Diffing against local
 * master pulled in ~50 unrelated
 * commits" yet still reported
 * findings from that history
 * (SendEmailCommandHandler.cs:83).
 * Run 2: 7 findings, only 2 in the
 * real PR diff. Off-diff files:
 *   GovernanceWorkflowMappingProfile.cs
 *   ProcessEmailArchivalCommandHandler.cs
 *   LibraryServiceClient.cs
 *   SendEmailCommandHandler.cs
 *   GovernanceWorkflowPayloadConverter.cs
 *
 * Hypothesis (from #90620 body, not
 * independently verified beyond that
 * report): the skill uses local
 * master instead of the PR's
 * baseRefName / merge base.
 *
 * Same-class nearby (complementary,
 * not identical — cite as priors,
 * not as the product problem):
 *   #82397 project skill named
 *     code-review silently shadows
 *     built-in /code-review
 *   #78257 /code-review ignores
 *     effort argument
 *   #69232 two first-party
 *     /code-review commands collide
 *
 * Verdicts: level | wrong-base |
 *           scope-bleed | unrelated |
 *           master-lie | develop-base |
 *           findings-bleed |
 *           merge-missed | skill-review
 * Idle word is level (true merge-base;
 * findings only from the PR's actual
 * diff; hold is quiet). NEVER use
 * datum / empty / silent / mute /
 * idle / dead / sealed / fronted /
 * locked / yanked / caught / stowed /
 * posted / bunged / belayed / rove /
 * keyed / housed / beamed / snug /
 * hung / appointed / cinched /
 * gauged / stamped / overrun /
 * pratique / wound / bound /
 * stilled / stabled / drained /
 * flat / fit / spoilt / laid /
 * unlinked / tight / banked /
 * roosted / stocked / seated /
 * heard / clear / paired / kernel /
 * latched / upheld / sterling /
 * home / valid / dry / quiet /
 * seised / rung / moored /
 * verbatim / calqued as the idle
 * word.
 *
 * Slack alarm on wrong-base /
 * master-lie / scope-bleed /
 * findings-bleed / unrelated /
 * merge-missed.
 * Linear ticket on wrong-base /
 * master-lie / findings-bleed.
 * GitHub datum-ledger of scored
 * probes on every score.
 *
 * Priority when multiple match:
 *   wrong-base > master-lie >
 *   scope-bleed > findings-bleed >
 *   unrelated > merge-missed >
 *   skill-review > develop-base >
 *   level
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90620 wrong-base triad
 * (measured ≠ PR base + off-diff
 * findings + code-review skill).
 *
 * level is true ONLY when the
 * verdict is level (idle, or honest
 * control: findings scoped only to
 * files in the PR's true merge-base
 * diff). A wrong-base plate is
 * never level. Seeded #90620 must
 * produce wrong-base / master-lie /
 * scope-bleed (never level).
 *
 * Why this is not a clone:
 * NOT Calque — PowerShell Spanish
 *     del false alias #90645.
 * NOT Fascia — trust-path consent
 *     lie #90638.
 * NOT Quoin — quoted-heredoc
 *     unescape #90630.
 * NOT Gaff — timeout-kill false
 *     complete #90616.
 * NOT Sear — inert set -e #90611.
 * NOT Cubby / Grille / Spile /
 *     Bollard / Clew / Sounder /
 *     Binnacle / Pirn / Cotter.
 * NOT Fob (keychain split) / Visa
 *     (RFC 8707) / Snib / Knock /
 *     Veto (auth).
 * NOT Iota / Wicket (path-key /
 *     worktree trust).
 * NOT Parity (claim vs reality
 *     paste-check) — Datum is
 *     specifically review-scope /
 *     merge-base, not generic
 *     claim-vs-reality.
 * NOT leftover woodworking /
 *     millimetre-slider clones.
 * Different problem: code-review
 * skill measures findings from the
 * wrong datum (local master)
 * instead of the PR merge base →
 * scope bleed. Different UI:
 * surveyor's field desk / brass
 * leveling plate. Different idle:
 * level.
 */

export const VERDICTS = Object.freeze([
  "level",
  "wrong-base",
  "scope-bleed",
  "unrelated",
  "master-lie",
  "develop-base",
  "findings-bleed",
  "merge-missed",
  "skill-review",
]);
export const IDLE_WORD = "level";
export const SLACK_VERDICTS = Object.freeze([
  "wrong-base",
  "master-lie",
  "scope-bleed",
  "findings-bleed",
  "unrelated",
  "merge-missed",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "wrong-base",
  "master-lie",
  "findings-bleed",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90620;
export const PRIOR_SHADOW_82397 = 82397;
export const PRIOR_EFFORT_78257 = 78257;
export const PRIOR_COLLIDE_69232 = 69232;

export const DEMO_PR_URL =
  "https://github.com/seismic/email-background-worker/pull/254";
export const DEMO_PR_BASE = "develop";
export const DEMO_MEASURED_BASE = "master";
export const DEMO_MEASURED_ORIGIN = "origin/master";
export const DEMO_FINDINGS_TOTAL = 7;
export const DEMO_FINDINGS_IN_DIFF = 2;
export const DEMO_FINDINGS_OFF_DIFF = 5;
export const DEMO_OFF_DIFF_FILES = Object.freeze([
  "GovernanceWorkflowMappingProfile.cs",
  "ProcessEmailArchivalCommandHandler.cs",
  "LibraryServiceClient.cs",
  "SendEmailCommandHandler.cs",
  "GovernanceWorkflowPayloadConverter.cs",
]);
export const DEMO_UNRELATED_LINE = "SendEmailCommandHandler.cs:83";
export const DEMO_SKILL = "code-review";
export const DEMO_CONTROL_PR_BASE = "main";
export const DEMO_CONTROL_MEASURED = "main";
export const DEMO_CONTROL_TOTAL = 2;
export const DEMO_CONTROL_IN_DIFF = 2;

const FORBIDDEN_IDLE = Object.freeze([
  "datum",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "sealed",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
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
  "bound",
  "stilled",
  "stabled",
  "drained",
  "flat",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "seated",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "quiet",
  "seised",
  "rung",
  "moored",
  "verbatim",
  "calqued",
  "bench",
  "trammel",
  "offset",
  "kerf",
  "fiducial",
  "staff",
  "gage",
  "plumb",
  "azimuth",
  "bearing",
  "transit",
  "sextant",
  "chain",
  "benchmark",
  "base",
  "scope",
  "bleed",
  "mergebase",
  "reviewbase",
  "calque",
  "fascia",
  "quoin",
  "gaff",
  "sear",
  "cubby",
  "grille",
  "spile",
  "bollard",
  "clew",
  "sounder",
  "binnacle",
  "pirn",
  "cotter",
  "fob",
  "visa",
  "snib",
  "knock",
  "veto",
  "iota",
  "wicket",
  "parity",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = undefined) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
    return Boolean(s);
  }
  return Boolean(value);
}

function asCount(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asList(value) {
  if (Array.isArray(value)) return value.map((row) => asText(row)).filter(Boolean);
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((row) => asText(row)).filter(Boolean);
        }
      } catch {
        /* fall through */
      }
    }
    return trimmed
      .split(/\n|,/)
      .map((row) => row.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeRef(value = "") {
  return asText(value)
    .trim()
    .toLowerCase()
    .replace(/^refs\/heads\//, "")
    .replace(/^origin\//, "")
    .replace(/^upstream\//, "");
}

export function isMasterRef(value = "") {
  const n = normalizeRef(value);
  return n === "master";
}

export function isDevelopRef(value = "") {
  const n = normalizeRef(value);
  return n === "develop";
}

export function basesMatch(left = "", right = "") {
  const a = normalizeRef(left);
  const b = normalizeRef(right);
  if (!a || !b) return false;
  return a === b;
}

export function isSkillReview(value = "") {
  return /code-review|\/code-review|skill\s*tool/i.test(asText(value));
}

export function emptyDatum() {
  return {
    session: "",
    issue: null,
    source: "",
    prUrl: "",
    prBase: "",
    measuredBase: "",
    findingsTotal: 0,
    findingsInDiff: 0,
    findingsOffDiff: 0,
    offDiffFiles: [],
    skill: "",
    scored: false,
  };
}

export function emptyAction(session = "level-1") {
  return {
    action: "score",
    session,
    datum: emptyDatum(),
  };
}

export function cloneDatum(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyDatum();
  const nested =
    (src.datum && typeof src.datum === "object" && src.datum) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.plate && typeof src.plate === "object" && src.plate) ||
    src;
  const offDiffFiles = asList(nested.offDiffFiles ?? src.offDiffFiles);
  const findingsOffDiff = asCount(
    nested.findingsOffDiff ?? src.findingsOffDiff,
    offDiffFiles.length,
  );
  const findingsInDiff = asCount(nested.findingsInDiff ?? src.findingsInDiff, 0);
  const findingsTotal = asCount(
    nested.findingsTotal ?? src.findingsTotal,
    findingsInDiff + findingsOffDiff,
  );
  return {
    ...emptyDatum(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    prUrl: asText(nested.prUrl ?? src.prUrl ?? src.url),
    prBase: asText(nested.prBase ?? src.prBase ?? src.baseRefName),
    measuredBase: asText(nested.measuredBase ?? src.measuredBase ?? src.diffBase),
    findingsTotal,
    findingsInDiff,
    findingsOffDiff,
    offDiffFiles,
    skill: asText(nested.skill ?? src.skill),
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(datum = {}) {
  const next = cloneDatum(datum);
  const prBase = next.prBase;
  const measuredBase = next.measuredBase;
  const skill = next.skill;
  const skillReview = isSkillReview(skill);
  const masterMeasured = isMasterRef(measuredBase);
  const developPr = isDevelopRef(prBase);
  const nonMasterPr = Boolean(normalizeRef(prBase)) && !isMasterRef(prBase);
  const matched = basesMatch(prBase, measuredBase);
  const basesDiffer =
    Boolean(normalizeRef(prBase)) &&
    Boolean(normalizeRef(measuredBase)) &&
    !matched;
  const namedOff = next.offDiffFiles.slice();
  const findingsOffDiff = Math.max(next.findingsOffDiff, namedOff.length);
  const findingsInDiff = next.findingsInDiff;
  const findingsTotal = Math.max(next.findingsTotal, findingsInDiff + findingsOffDiff);
  const hasOffDiff = findingsOffDiff > 0 || namedOff.length > 0;
  const majorityOff =
    findingsTotal > 0 && findingsOffDiff > findingsInDiff && findingsOffDiff > 0;
  const mergeAvailable = Boolean(normalizeRef(prBase));
  const mergeUnused = mergeAvailable && !normalizeRef(measuredBase);

  const wrongBaseShape = basesDiffer && hasOffDiff && skillReview;
  const masterLieShape = !wrongBaseShape && masterMeasured && nonMasterPr;
  const scopeBleedShape =
    !wrongBaseShape && !masterLieShape && namedOff.length > 0 && !majorityOff;
  const findingsBleedShape =
    !wrongBaseShape && !masterLieShape && !scopeBleedShape && majorityOff;
  const unrelatedShape =
    !wrongBaseShape &&
    !masterLieShape &&
    !scopeBleedShape &&
    !findingsBleedShape &&
    findingsOffDiff > 0 &&
    findingsInDiff === 0;
  const mergeMissedShape =
    !wrongBaseShape &&
    !masterLieShape &&
    !scopeBleedShape &&
    !findingsBleedShape &&
    !unrelatedShape &&
    mergeUnused;
  const skillReviewShape =
    !wrongBaseShape &&
    !masterLieShape &&
    !scopeBleedShape &&
    !findingsBleedShape &&
    !unrelatedShape &&
    !mergeMissedShape &&
    skillReview;
  const developBaseShape =
    !wrongBaseShape &&
    !masterLieShape &&
    !scopeBleedShape &&
    !findingsBleedShape &&
    !unrelatedShape &&
    !mergeMissedShape &&
    !skillReviewShape &&
    developPr &&
    findingsTotal === 0 &&
    !hasOffDiff;
  const levelHold =
    !hasOffDiff &&
    !basesDiffer &&
    !mergeUnused &&
    (findingsOffDiff === 0) &&
    (findingsTotal === 0 || findingsInDiff === findingsTotal);

  return {
    prUrl: next.prUrl,
    prBase,
    measuredBase,
    findingsTotal,
    findingsInDiff,
    findingsOffDiff,
    offDiffFiles: namedOff,
    skill,
    skillReview,
    masterMeasured,
    developPr,
    nonMasterPr,
    matched,
    basesDiffer,
    hasOffDiff,
    majorityOff,
    mergeAvailable,
    mergeUnused,
    wrongBaseShape,
    masterLieShape,
    scopeBleedShape,
    findingsBleedShape,
    unrelatedShape,
    mergeMissedShape,
    skillReviewShape,
    developBaseShape,
    levelHold,
  };
}

export function isIdle(datum = {}) {
  const next = cloneDatum(datum);
  return (
    !next.prUrl &&
    !next.prBase &&
    !next.measuredBase &&
    next.findingsTotal === 0 &&
    next.findingsInDiff === 0 &&
    next.findingsOffDiff === 0 &&
    next.offDiffFiles.length === 0 &&
    !next.skill
  );
}

/**
 * First match wins by documented
 * priority: wrong-base > master-lie >
 * scope-bleed > findings-bleed >
 * unrelated > merge-missed >
 * skill-review > develop-base >
 * level. Idle level is first.
 * Seeded #90620 numbers must produce
 * wrong-base, never level.
 */
export function classify(datum = {}) {
  const next = cloneDatum(datum);
  if (isIdle(next)) return "level";
  const facts = analyze(next);

  if (facts.wrongBaseShape) return "wrong-base";
  if (facts.masterLieShape) return "master-lie";
  if (facts.scopeBleedShape) return "scope-bleed";
  if (facts.findingsBleedShape) return "findings-bleed";
  if (facts.unrelatedShape) return "unrelated";
  if (facts.mergeMissedShape) return "merge-missed";
  if (facts.skillReviewShape) return "skill-review";
  if (facts.developBaseShape) return "develop-base";
  if (facts.levelHold) return "level";
  return "level";
}

export function feedOf(datum = {}, verdict = "") {
  const kind = verdict || classify(datum);
  if (kind === "wrong-base") {
    return "● Wrong-base · skill/diff used local master (or other non-PR base) instead of the PR's declared base · primary #90620";
  }
  if (kind === "master-lie") {
    return "● Master-lie · review measured against master while the PR base is develop (or another named non-master base)";
  }
  if (kind === "scope-bleed") {
    return "● Scope-bleed · findings cite files/lines absent from gh pr diff / the PR's actual changed files";
  }
  if (kind === "findings-bleed") {
    return "● Findings-bleed · majority of returned findings are off-diff (e.g. 5 of 7)";
  }
  if (kind === "unrelated") {
    return "● Unrelated · findings come from already-merged history on the branch, not this PR";
  }
  if (kind === "merge-missed") {
    return "● Merge-missed · PR merge base / gh pr view --json baseRefName was available but unused";
  }
  if (kind === "skill-review") {
    return "● Skill-review · invoked via built-in code-review skill / /code-review / Skill tool";
  }
  if (kind === "develop-base") {
    return "● Develop-base · PR's actual base is develop · control fact · not itself a failure unless paired with wrong measurement";
  }
  return "● Level · findings scoped only to files in the PR's true merge-base diff · hold is quiet · idle word is level";
}

export function reasonsOf(datum = {}, verdict = "") {
  const next = cloneDatum(datum);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.prUrl || next.prBase || next.measuredBase
      ? `PR base ${next.prBase || "unset"} · measured ${next.measuredBase || "unset"} · skill ${next.skill || "unset"} · ${facts.findingsInDiff}/${facts.findingsTotal} in diff · ${facts.findingsOffDiff} off-diff`
      : "true merge-base; findings only from the PR's actual diff · hold is quiet · idle word is level",
  );
  if (facts.developPr) {
    reasons.push("PR's actual base is develop (gh pr view --json baseRefName)");
  }
  if (facts.masterMeasured) {
    reasons.push(`measured base is ${next.measuredBase || "master"} · local master / origin/master`);
  }
  if (facts.basesDiffer) {
    reasons.push(
      `measured ${next.measuredBase} is not the PR base ${next.prBase} · wrong datum`,
    );
  }
  if (facts.hasOffDiff) {
    reasons.push(
      facts.offDiffFiles.length
        ? `off-diff files ${facts.offDiffFiles.join(", ")} · absent from gh pr diff`
        : `${facts.findingsOffDiff} findings off the PR's actual diff`,
    );
  }
  if (facts.majorityOff) {
    reasons.push(
      `majority off-diff · ${facts.findingsOffDiff} of ${facts.findingsTotal} · e.g. 5 of 7`,
    );
  }
  if (facts.skillReview) {
    reasons.push(`invoked via ${next.skill || "code-review"} · built-in /code-review / Skill tool`);
  }
  if (facts.mergeUnused) {
    reasons.push(
      "PR merge base / gh pr view --json baseRefName was available but unused",
    );
  }
  if (facts.levelHold) {
    reasons.push(
      "honest plate: findings scoped only to files in the PR's true merge-base diff",
    );
  }
  reasons.push("a wrong base is not a hold");
  reasons.push(
    "NOT Calque (#90645 PowerShell Spanish del) / Fascia (#90638 trust-path) / Quoin (#90630 quoted-heredoc) / Gaff (#90616 timeout-kill) / Sear (#90611 inert set -e) / Cubby / Grille / Spile / Bollard / Clew / Sounder / Binnacle / Pirn / Cotter / Fob / Visa / Snib / Knock / Veto / Iota / Wicket / Parity (generic claim-vs-reality) / leftover woodworking / millimetre-slider.",
  );
  if (kind === "level") {
    reasons.push(
      "findings scoped only to files in the PR's true merge-base diff; idle word is level",
    );
  }
  if (kind === "wrong-base") {
    reasons.push(
      "PRIMARY #90620: code-review skill diffs against wrong base branch, pulls in unrelated files as findings. The wrong-base plate is wrong-base, never level. Hypothesis (from #90620 body): the skill uses local master instead of the PR's baseRefName / merge base.",
    );
  }
  if (kind === "master-lie") {
    reasons.push(
      "review measured against master while the PR base is develop (or another named non-master base).",
    );
  }
  if (kind === "scope-bleed") {
    reasons.push(
      "findings cite files/lines absent from gh pr diff / the PR's actual changed files.",
    );
  }
  if (kind === "findings-bleed") {
    reasons.push("majority of returned findings are off-diff (e.g. 5 of 7).");
  }
  if (kind === "unrelated") {
    reasons.push("findings come from already-merged history on the branch, not this PR.");
  }
  if (kind === "merge-missed") {
    reasons.push("PR merge base / gh pr view --json baseRefName was available but unused.");
  }
  if (kind === "skill-review") {
    reasons.push("invoked via built-in code-review skill / /code-review / Skill tool.");
  }
  if (kind === "develop-base") {
    reasons.push(
      "PR's actual base is develop. Control fact; not itself a failure unless paired with wrong measurement.",
    );
  }
  return reasons;
}

export function verdictOf(datum = {}) {
  return classify(datum);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function levelOf(datum = {}, verdict = "") {
  const kind = verdict || classify(datum);
  if (kind !== "level") return false;
  if (SLACK_VERDICTS.includes(kind)) return false;
  if (isIdle(datum)) return true;
  const facts = analyze(datum);
  return facts.levelHold === true;
}

export function wrongBaseOf(datum = {}, verdict = "") {
  return (verdict || classify(datum)) === "wrong-base";
}

export function summaryOf(datum = {}) {
  const next = cloneDatum(datum);
  const facts = analyze(next);
  return {
    prUrl: next.prUrl,
    prBase: next.prBase,
    measuredBase: next.measuredBase,
    findingsTotal: facts.findingsTotal,
    findingsInDiff: facts.findingsInDiff,
    findingsOffDiff: facts.findingsOffDiff,
    offDiffFiles: facts.offDiffFiles,
    skill: next.skill,
    skillReview: facts.skillReview,
    masterMeasured: facts.masterMeasured,
    developPr: facts.developPr,
    basesDiffer: facts.basesDiffer,
    hasOffDiff: facts.hasOffDiff,
    majorityOff: facts.majorityOff,
    mergeUnused: facts.mergeUnused,
    levelHold: facts.levelHold,
  };
}

export function score(datum = {}) {
  const next = cloneDatum(datum);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    level: levelOf(next, verdict),
    wrongBase: wrongBaseOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    prUrl: next.prUrl,
    prBase: next.prBase,
    measuredBase: next.measuredBase,
    findingsTotal: facts.findingsTotal,
    findingsInDiff: facts.findingsInDiff,
    findingsOffDiff: facts.findingsOffDiff,
    offDiffFiles: facts.offDiffFiles,
    skill: next.skill,
    skillReview: facts.skillReview,
    masterMeasured: facts.masterMeasured,
    developPr: facts.developPr,
    basesDiffer: facts.basesDiffer,
    hasOffDiff: facts.hasOffDiff,
    majorityOff: facts.majorityOff,
    mergeUnused: facts.mergeUnused,
    honestPlate: facts.levelHold,
    summary: summaryOf(next),
    datum: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const datumSrc =
    src.datum ||
    src.probe ||
    src.payload ||
    src.plate ||
    payload.datum ||
    payload.probe ||
    payload.plate;
  const datum = cloneDatum(
    datumSrc && typeof datumSrc === "object" ? { ...datumSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !datum.session) datum.session = src.session;
  if (typeof payload.session === "string" && !datum.session) datum.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? datum.session ?? ""),
    datum,
    issue: src.issue ?? payload.issue ?? datum.issue ?? null,
    source: src.source ?? payload.source ?? datum.source ?? "",
  };
}

function datumResult(verdict, datum, action, extras = {}) {
  const next = cloneDatum(datum);
  const scored = score(next);
  return {
    ok: true,
    product: "datum",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    level: scored.level,
    wrongBase: scored.wrongBase,
    datumLevel: verdict === "level",
    datumWrongBase: verdict === "wrong-base",
    datumScopeBleed: verdict === "scope-bleed",
    datumUnrelated: verdict === "unrelated",
    datumMasterLie: verdict === "master-lie",
    datumDevelopBase: verdict === "develop-base",
    datumFindingsBleed: verdict === "findings-bleed",
    datumMergeMissed: verdict === "merge-missed",
    datumSkillReview: verdict === "skill-review",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    prUrl: scored.prUrl,
    prBase: scored.prBase,
    measuredBase: scored.measuredBase,
    findingsTotal: scored.findingsTotal,
    findingsInDiff: scored.findingsInDiff,
    findingsOffDiff: scored.findingsOffDiff,
    offDiffFiles: scored.offDiffFiles,
    skill: scored.skill,
    skillReview: scored.skillReview,
    masterMeasured: scored.masterMeasured,
    developPr: scored.developPr,
    basesDiffer: scored.basesDiffer,
    hasOffDiff: scored.hasOffDiff,
    majorityOff: scored.majorityOff,
    mergeUnused: scored.mergeUnused,
    honestPlate: scored.honestPlate,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    datum: next,
    ...extras,
  };
}

function seedDatum(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    datum: {
      ...emptyDatum(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      prUrl: extras.prUrl || "",
      prBase: extras.prBase || "",
      measuredBase: extras.measuredBase || "",
      findingsTotal: extras.findingsTotal || 0,
      findingsInDiff: extras.findingsInDiff || 0,
      findingsOffDiff: extras.findingsOffDiff || 0,
      offDiffFiles: extras.offDiffFiles || [],
      skill: extras.skill || "",
    },
  };
}

/** Idle reset. Findings stay on the true merge-base. */
export function seedLevel() {
  return seedDatum("level", "survey-desk", {
    session: "level",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedLevel();
}

/**
 * Control / proof: findings scoped
 * only to files in the PR's true
 * merge-base diff. Classifies as
 * level; level true.
 */
export function seedControl() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-control",
    issue: null,
    prUrl: DEMO_PR_URL,
    prBase: DEMO_CONTROL_PR_BASE,
    measuredBase: DEMO_CONTROL_MEASURED,
    findingsTotal: DEMO_CONTROL_TOTAL,
    findingsInDiff: DEMO_CONTROL_IN_DIFF,
    findingsOffDiff: 0,
    offDiffFiles: [],
    skill: "",
  });
}

/**
 * #90620 wrong-base: PR base develop,
 * measured local master, 7 findings
 * with 5 off-diff, code-review skill.
 * Never level.
 */
export function seedWrongBase() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-wrong-base",
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_BASE,
    findingsTotal: DEMO_FINDINGS_TOTAL,
    findingsInDiff: DEMO_FINDINGS_IN_DIFF,
    findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
    offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
    skill: DEMO_SKILL,
  });
}

export function seed90620() {
  return seedWrongBase();
}

/**
 * Review measured against master
 * while the PR base is develop.
 * No off-diff triad.
 */
export function seedMasterLie() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-master-lie",
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_ORIGIN,
    findingsTotal: 0,
    findingsInDiff: 0,
    findingsOffDiff: 0,
    offDiffFiles: [],
    skill: "",
  });
}

/**
 * Findings cite named files absent
 * from gh pr diff. Bases match.
 * Not a majority bleed.
 */
export function seedScopeBleed() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-scope-bleed",
    prUrl: DEMO_PR_URL,
    prBase: "main",
    measuredBase: "main",
    findingsTotal: 6,
    findingsInDiff: 4,
    findingsOffDiff: 2,
    offDiffFiles: ["LibraryServiceClient.cs", "SendEmailCommandHandler.cs"],
    skill: "",
  });
}

/**
 * Majority of returned findings are
 * off-diff (5 of 7). Bases match.
 * No named files (scope-bleed would
 * otherwise win only when not majority).
 */
export function seedFindingsBleed() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-findings-bleed",
    prUrl: DEMO_PR_URL,
    prBase: "main",
    measuredBase: "main",
    findingsTotal: 7,
    findingsInDiff: 2,
    findingsOffDiff: 5,
    offDiffFiles: [],
    skill: "",
  });
}

/**
 * Findings come from already-merged
 * history. None in this PR's diff.
 */
export function seedUnrelated() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-unrelated",
    prUrl: DEMO_PR_URL,
    prBase: "main",
    measuredBase: "main",
    findingsTotal: 3,
    findingsInDiff: 0,
    findingsOffDiff: 3,
    offDiffFiles: [],
    skill: "",
  });
}

/**
 * PR merge base was available
 * (baseRefName set) but unused.
 */
export function seedMergeMissed() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-merge-missed",
    prUrl: DEMO_PR_URL,
    prBase: "main",
    measuredBase: "",
    findingsTotal: 0,
    findingsInDiff: 0,
    findingsOffDiff: 0,
    offDiffFiles: [],
    skill: "",
  });
}

/**
 * Invoked via built-in code-review
 * skill. Bases match. No findings.
 */
export function seedSkillReview() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-skill-review",
    prUrl: DEMO_PR_URL,
    prBase: "main",
    measuredBase: "main",
    findingsTotal: 0,
    findingsInDiff: 0,
    findingsOffDiff: 0,
    offDiffFiles: [],
    skill: DEMO_SKILL,
  });
}

/**
 * PR's actual base is develop.
 * Control fact. Measured correctly.
 * No findings.
 */
export function seedDevelopBase() {
  return seedDatum(FEATURED_ISSUE, "anthropics/claude-code#90620", {
    session: "90620-develop-base",
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_PR_BASE,
    findingsTotal: 0,
    findingsInDiff: 0,
    findingsOffDiff: 0,
    offDiffFiles: [],
    skill: "",
  });
}

/**
 * Parse a review-skill transcript
 * (the #90620 repro) plus optional
 * measured-base note. JSON objects
 * are preferred when the paste
 * starts with { — never let prose
 * win over a structured probe.
 */
export function parseReviewProbe(note = "", extra = "") {
  const text = asText(note);
  const more = asText(extra);
  const blob = [text, more].filter(Boolean).join("\n");
  if (!blob.trim()) return emptyDatum();

  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return cloneDatum({
          ...parsed,
          scored: true,
        });
      }
    } catch {
      /* fall through */
    }
  }

  const looksWrongBase =
    /#90620|email-background-worker\/pull\/254|SendEmailCommandHandler/i.test(blob) &&
    /develop|local master|origin\/master|7 findings|unrelated commits/i.test(blob);
  if (looksWrongBase && !/honest|control|true merge-base/i.test(blob)) {
    return {
      ...seedWrongBase().datum,
      session: "paste-wrong-base",
      scored: true,
    };
  }
  if (/honest control|true merge-base|findings scoped only/i.test(blob)) {
    return {
      ...seedControl().datum,
      session: "paste-control",
      scored: true,
    };
  }

  const prUrl =
    (blob.match(/https?:\/\/github\.com\/[^\s]+\/pull\/\d+/) || [])[0] || "";
  const prBase =
    (blob.match(/base(?:RefName)?[:\s]+`?([A-Za-z0-9._/-]+)`?/i) || [])[1] ||
    (/actual base is `?develop`?/i.test(blob) ? "develop" : "");
  const measuredBase =
    (blob.match(/diff(?:ing)? against[^`\n]*`?((?:origin\/)?master)`?/i) || [])[1] ||
    (/local master/i.test(blob) ? "master" : "");
  const offFiles = DEMO_OFF_DIFF_FILES.filter((name) => blob.includes(name));
  const sevenTwo = /7 findings[\s\S]*only 2|only 2[\s\S]*real PR diff/i.test(blob);

  return cloneDatum({
    session: "paste",
    source: "paste",
    prUrl,
    prBase,
    measuredBase,
    findingsTotal: sevenTwo ? 7 : offFiles.length ? offFiles.length : 0,
    findingsInDiff: sevenTwo ? 2 : 0,
    findingsOffDiff: sevenTwo ? 5 : offFiles.length,
    offDiffFiles: offFiles,
    skill: /code-review|\/code-review|Skill tool/i.test(blob) ? DEMO_SKILL : "",
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyDatum();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneDatum({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneDatum({
          ...parsed,
          prUrl: parsed.prUrl || parsed.url || "",
          prBase: parsed.prBase || parsed.baseRefName || "",
          measuredBase: parsed.measuredBase || parsed.diffBase || "",
          scored: true,
        });
      }
    } catch {
      /* fall through to prose */
    }
  }
  return parseReviewProbe(text, "");
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  level: seedLevel,
  control: seedControl,
  "wrong-base": seedWrongBase,
  wrongbase: seedWrongBase,
  90620: seed90620,
  "90620-wrong-base": seedWrongBase,
  "master-lie": seedMasterLie,
  masterlie: seedMasterLie,
  "scope-bleed": seedScopeBleed,
  scopebleed: seedScopeBleed,
  unrelated: seedUnrelated,
  "findings-bleed": seedFindingsBleed,
  findingsbleed: seedFindingsBleed,
  "merge-missed": seedMergeMissed,
  mergemissed: seedMergeMissed,
  "skill-review": seedSkillReview,
  skillreview: seedSkillReview,
  "develop-base": seedDevelopBase,
  developbase: seedDevelopBase,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  plate: seedControl,
  desk: seedControl,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let datum = cloneDatum(action.datum);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "level" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return datumResult("level", emptyDatum(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "plate" || verb === "desk") {
    datum = seedControl().datum;
    return datumResult(classify(datum), datum, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "wrong-base" || verb === "incident" || verb === "90620") {
    datum = seedWrongBase().datum;
    return datumResult(classify(datum), datum, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-plate") {
    datum = { ...datum, scored: true };
    return datumResult(classify(datum), datum, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    datum = { ...datum, scored: true };
    return datumResult(classify(datum), datum, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  datum = { ...datum, scored: true };
  return datumResult(classify(datum), datum, action);
}
