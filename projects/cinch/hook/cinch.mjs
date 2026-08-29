/**
 * Cinch — saddler's / packer's cinch desk for a real Claude Code
 * failure class: Cowork scheduled / unattended tasks intermittently
 * fail to mount folders that are already connected and reliable in
 * interactive sessions. A different subset drops every run. Adding
 * folders to Trusted Cowork folders does not stop it. The worst case
 * treated a surviving leaf path as "proceed" and delivered a VP-level
 * report with two entire sections silently omitted — no error, no
 * placeholder, presented as complete.
 *
 * A written Trusted-folders list is not a hold. Score the girth or
 * admit cinched.
 *
 * Primary #90506: filed 2026-08-29. Six incidents, six different
 * folder combinations, 2026-08-19 to 2026-08-29. Incident 3: engines
 * + Outputs root missing, one leaf under Outputs stayed reachable;
 * guard treated the leaf as proceed; VP report shipped with two
 * sections silently omitted. Trusted Cowork folders change after
 * incident 1 did not stop incidents 2 and 3. Author points at the
 * same class as #47180 and #59302 but manifesting as silent partial
 * mounts rather than re-prompts.
 *
 * Shape (cite as shape, not a new primary):
 *   #47180 — scheduled tasks ignore Always-allow; prompts reappear
 *            every run.
 *   #59302 — Allow-for-all-scheduled-runs folder permission not
 *            persisting (cited by #90506).
 *   #89813 — Cowork mounted a folder into a project session that
 *            was never attached.
 *   #85577 — git add silently stages nothing in a connected folder
 *            (mount denies unlink).
 *   #38993 — virtiofs FUSE mount serves truncated/stale files.
 *   #71307 — reserved-path overlap blocks mounting scheduled folders.
 *   openai/codex#35134 — Windows Desktop scheduled automations fail
 *            to attach the same workspace interactive sessions have
 *            (malformed cwd).
 *   openai/codex#22827 — background automations cannot see the
 *            user-scoped WSL distro that interactive chat can.
 *
 * Verdicts: cinched | slipped | dropped | phantom | omitted
 *           | partial | trusted | loose | delivered | halted
 * Idle word is cinched (every expected folder is mounted and reachable).
 * NEVER use cinch / mount / folder / slip / pack / girth as idle.
 * NEVER reuse gauged, stamped, overrun, pratique, wound, bound,
 * stilled, stabled, drained, flat, fit, spoilt, laid, unlinked,
 * tight, banked, roosted, stocked, seated, heard, clear, paired,
 * kernel, latched, upheld, sterling, home, valid, dry, sealed,
 * quiet, seised.
 *
 * Slack alarm on slipped / dropped / omitted / delivered / phantom / loose.
 * Linear ticket when omitted or delivered.
 * GitHub cinch-ledger of scored packs on every score.
 *
 * Why this is not a clone:
 * NOT Fusee (early schedule *dispatch* — cron fires ahead of fireAt).
 *     Cinch is an unstable *mount set* on an otherwise-fired run.
 * NOT Wicket (worktree *isolation* / wrong worktree).
 * NOT Larder (plugin-*store freeze*: sync stamp advances, on-disk
 *     plugin folders stand still).
 * NOT Hasp (file *lease* / last-writer-wins).
 * NOT Sprag (boot-cached *MCP* attach failure).
 * NOT Ullage, Visa, or any other catalog desk.
 * Different problem: silent partial mounts. A surviving leaf is not
 * a hold. The scoring kernel treats leaf-proceed + missing root as
 * omitted / delivered, not cinched, even when some paths exist.
 * Different UI: night saddlery / tack room. Leather cinch and brass
 * buckle on a pack saddle, strap holes, oil-lamp amber, bridle hooks.
 * Different idle: cinched.
 * Do NOT ship leftover woodworking, millimetre-sliders, or near-clones.
 * Do NOT ship Girth, Pack, Saddle, Mount, Tack, Pannier, or Crupper
 * as alternate names. Product name is Cinch only. Idle word is cinched.
 */

export const VERDICTS = Object.freeze([
  "cinched",
  "slipped",
  "dropped",
  "phantom",
  "omitted",
  "partial",
  "trusted",
  "loose",
  "delivered",
  "halted",
]);
export const IDLE_WORD = "cinched";
export const SLACK_VERDICTS = Object.freeze([
  "slipped",
  "dropped",
  "omitted",
  "delivered",
  "phantom",
  "loose",
]);
export const LINEAR_VERDICTS = Object.freeze(["omitted", "delivered"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "cinch",
  "mount",
  "folder",
  "slip",
  "pack",
  "girth",
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
  "sealed",
  "quiet",
  "seised",
  "ullage",
  "visa",
  "sprag",
  "fusee",
  "wicket",
  "larder",
  "hasp",
  "saddle",
  "tack",
  "pannier",
  "crupper",
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

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

function asList(value) {
  if (Array.isArray(value)) return value.map((row) => asText(row).trim()).filter(Boolean);
  if (value == null || value === "") return [];
  return [asText(value).trim()].filter(Boolean);
}

export function normPath(value) {
  return asText(value).trim().replace(/\\/g, "/").replace(/\/+$/, "");
}

export function isExactPath(a, b) {
  const left = normPath(a);
  const right = normPath(b);
  return Boolean(left) && left === right;
}

export function isLeafOf(child, parent) {
  const c = normPath(child);
  const p = normPath(parent);
  return Boolean(c && p && c !== p && (c.startsWith(`${p}/`) || c.startsWith(`${p}\\`)));
}

export function rootPresent(expectedPath, mounted = []) {
  return asList(mounted).some((row) => isExactPath(row, expectedPath));
}

export function hasReachableLeaf(expectedPath, mounted = []) {
  return asList(mounted).some((row) => isLeafOf(row, expectedPath));
}

export function emptyPack() {
  return {
    session: "",
    source: "",
    issue: null,
    scored: false,
    expected: [],
    mounted: [],
    trusted: [],
    listed: [],
    unreachable: [],
    leafProceed: false,
    shipped: false,
    halted: false,
    uiGreen: false,
  };
}

export function emptyAction(session = "cinched-1") {
  return {
    action: "score",
    session,
    pack: emptyPack(),
  };
}

export function clonePack(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyPack();
  const nested =
    (src.pack && typeof src.pack === "object" && src.pack) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.girth && typeof src.girth === "object" && src.girth) ||
    (src.trace && typeof src.trace === "object" && src.trace) ||
    src;
  return {
    ...emptyPack(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    source: asText(nested.source ?? src.source),
    issue: asIssue(nested.issue ?? src.issue),
    scored: asBool(nested.scored ?? src.scored),
    expected: asList(nested.expected ?? src.expected),
    mounted: asList(nested.mounted ?? src.mounted),
    trusted: asList(nested.trusted ?? src.trusted),
    listed: asList(nested.listed ?? src.listed),
    unreachable: asList(nested.unreachable ?? src.unreachable),
    leafProceed: asBool(nested.leafProceed ?? src.leafProceed ?? nested.leaf_proceed),
    shipped: asBool(nested.shipped ?? src.shipped),
    halted: asBool(nested.halted ?? src.halted),
    uiGreen: asBool(nested.uiGreen ?? src.uiGreen ?? nested.ui_green ?? nested.ledgerGreen),
  };
}

export function analyze(pack = {}) {
  const next = clonePack(pack);
  const missing = next.expected.filter((path) => !rootPresent(path, next.mounted));
  const extra = next.mounted.filter((path) => {
    return !next.expected.some((expected) => isExactPath(path, expected) || isLeafOf(path, expected));
  });
  const missingRoots = missing.slice();
  const leafOfMissing = missing.filter((path) => hasReachableLeaf(path, next.mounted));
  const trustedMiss = missing.filter((path) => next.trusted.some((row) => isExactPath(row, path)));
  const listedMiss = missing.filter((path) => next.listed.some((row) => isExactPath(row, path)));
  const unreachable = next.unreachable.filter(Boolean);
  const mountedReachable = next.mounted.filter((path) => {
    return next.expected.some((expected) => isExactPath(path, expected) || isLeafOf(path, expected));
  });
  const allRootsPresent = next.expected.length > 0 && missing.length === 0;
  return {
    expected: next.expected.slice(),
    mounted: next.mounted.slice(),
    trusted: next.trusted.slice(),
    listed: next.listed.slice(),
    missing,
    extra,
    missingRoots,
    missingRoot: missing.length > 0,
    leafOfMissing,
    hasSurvivingLeaf: leafOfMissing.length > 0,
    trustedMiss,
    listedMiss,
    unreachable,
    mountedReachable,
    allRootsPresent,
    leafProceed: next.leafProceed,
    shipped: next.shipped,
    halted: next.halted,
    uiGreen: next.uiGreen,
  };
}

export function isIdle(pack = {}) {
  const next = clonePack(pack);
  return (
    next.expected.length === 0 &&
    next.mounted.length === 0 &&
    next.trusted.length === 0 &&
    next.listed.length === 0 &&
    next.unreachable.length === 0 &&
    !next.leafProceed &&
    !next.shipped &&
    !next.halted &&
    !next.uiGreen
  );
}

/**
 * First match wins. Idle cinched is first. Classes stay distinguishable:
 * a written Trusted-folders list is not a hold. Leaf-proceed + missing
 * root is omitted, not cinched, even when a surviving leaf exists.
 * Admit does not lie.
 */
export function classify(pack = {}) {
  const next = clonePack(pack);
  if (isIdle(next)) return "cinched";
  const facts = analyze(next);

  if (next.leafProceed && facts.missingRoot) return "omitted";
  if (next.shipped && facts.missingRoot) return "delivered";
  if (next.halted && facts.missingRoot) return "halted";
  if (facts.unreachable.length > 0) return "phantom";
  if (next.uiGreen && facts.missingRoot) return "loose";
  if (facts.trustedMiss.length >= 1 && facts.missing.length >= 2) return "trusted";
  if (facts.missing.length >= 2) return "dropped";
  if (facts.missing.length === 1 && facts.trustedMiss.length === 1) return "slipped";
  if (facts.mountedReachable.length > 0 && facts.missing.length > 0) return "partial";
  return "cinched";
}

export function feedOf(pack = {}, verdict = "") {
  const kind = verdict || classify(pack);
  if (kind === "omitted") {
    return "● Omitted · surviving leaf treated as proceed · two sections missing · primary #90506";
  }
  if (kind === "delivered") {
    return "● Delivered · incomplete pack presented as complete to recipients";
  }
  if (kind === "dropped") {
    return "● Dropped · two or more expected folders missing this run";
  }
  if (kind === "slipped") {
    return "● Slipped · one trusted folder missing this run";
  }
  if (kind === "phantom") {
    return "● Phantom · listed / trusted / connected but unreachable at the session mount";
  }
  if (kind === "trusted") {
    return "● Trusted · Always-allow / Trusted Cowork folders did not prevent the drop";
  }
  if (kind === "loose") {
    return "● Loose · cinch reads tight in the UI while the pack has shifted";
  }
  if (kind === "partial") {
    return "● Partial · a subset of the expected mount set is present";
  }
  if (kind === "halted") {
    return "● Halted · guard treated a missing root as a hard stop · the honest path";
  }
  return "● Cinched · every expected folder is mounted and reachable · idle word is cinched";
}

export function reasonsOf(pack = {}, verdict = "") {
  const next = clonePack(pack);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.expected.length
      ? `${facts.expected.length} expected · ${facts.mounted.length} mounted · ${facts.missing.length} missing roots`
      : "no expected folders on the slate",
  );
  if (facts.missing.length) reasons.push(`missing roots: ${facts.missing.join(", ")}`);
  if (facts.extra.length) reasons.push(`extra mounts: ${facts.extra.join(", ")}`);
  if (facts.hasSurvivingLeaf) {
    reasons.push(
      `surviving leaf under missing root: ${facts.leafOfMissing.join(", ")} · a leaf is not a hold`,
    );
  }
  if (facts.trustedMiss.length) {
    reasons.push(`trusted folders among the missing: ${facts.trustedMiss.join(", ")}`);
  }
  if (facts.unreachable.length) {
    reasons.push(`unreachable at session mount: ${facts.unreachable.join(", ")}`);
  }
  if (next.leafProceed) reasons.push("leafProceed: surviving leaf treated as proceed");
  if (next.shipped) reasons.push("shipped: incomplete output presented as complete");
  if (next.halted) reasons.push("halted: guard treated a missing root as a hard stop");
  if (next.uiGreen) reasons.push("uiGreen: ledger / Always-allow reads tight");
  reasons.push("a written Trusted-folders list is not a hold");
  reasons.push(
    "NOT Fusee (early schedule dispatch) / Wicket (worktree isolation) / Larder (plugin-store freeze) / Hasp (file lease) / Sprag (boot-cached MCP) / Ullage / Visa / leftover woodworking / millimetre-slider",
  );
  if (kind === "cinched") {
    reasons.push("every expected folder is mounted and reachable; idle word is cinched");
  }
  if (kind === "omitted") {
    reasons.push(
      "PRIMARY #90506 incident 3: engines + Outputs root missing, one leaf under Outputs stayed reachable; guard treated the leaf as proceed; VP report shipped with two sections silently omitted. No error. No placeholder. Presented as complete.",
    );
  }
  if (kind === "delivered") {
    reasons.push("Incomplete output was presented as complete to recipients. One monthly deliverable then failed for an entire month.");
  }
  if (kind === "dropped") {
    reasons.push("Two or more expected folders missing this run. A different subset drops every run.");
  }
  if (kind === "slipped") {
    reasons.push("One trusted folder missing this run. Interactive sessions still hold it.");
  }
  if (kind === "phantom") {
    reasons.push("Folder listed / trusted / connected but unreachable at the session mount. Shape #89813 / #85577 / #38993.");
  }
  if (kind === "trusted") {
    reasons.push(
      "Always-allow / Trusted Cowork folders did not prevent the drop. #90506: Trusted Cowork folders change after incident 1 did not stop incidents 2 and 3. Shape #47180 / #59302.",
    );
  }
  if (kind === "loose") {
    reasons.push("The cinch reads tight (UI / ledger green) while the pack has shifted.");
  }
  if (kind === "partial") {
    reasons.push("A subset of the expected mount set is present. The rest never attached.");
  }
  if (kind === "halted") {
    reasons.push("Guard treated a missing root as a hard stop. The honest path. Not a proceed.");
  }
  return reasons;
}

export function verdictOf(pack = {}) {
  return classify(pack);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function cinchedOf(pack = {}, verdict = "") {
  return (verdict || classify(pack)) === "cinched";
}

export function omittedOf(pack = {}, verdict = "") {
  return (verdict || classify(pack)) === "omitted";
}

export function deliveredOf(pack = {}, verdict = "") {
  return (verdict || classify(pack)) === "delivered";
}

export function score(pack = {}) {
  const next = clonePack(pack);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    missing: facts.missing,
    extra: facts.extra,
    cinched: cinchedOf(next, verdict),
    omitted: omittedOf(next, verdict),
    delivered: deliveredOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    missingRoot: facts.missingRoot,
    hasSurvivingLeaf: facts.hasSurvivingLeaf,
    trustedMiss: facts.trustedMiss,
    unreachable: facts.unreachable,
    leafProceed: facts.leafProceed,
    shipped: facts.shipped,
    halted: facts.halted,
    uiGreen: facts.uiGreen,
    pack: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const packSrc = src.pack || src.probe || src.girth || src.trace || payload.pack || payload.probe;
  const pack = clonePack(packSrc && typeof packSrc === "object" ? { ...packSrc, ...src, ...payload } : payload);
  if (typeof src.session === "string" && !pack.session) pack.session = src.session;
  if (typeof payload.session === "string" && !pack.session) pack.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? pack.session ?? ""),
    pack,
    issue: src.issue ?? payload.issue ?? pack.issue ?? null,
    source: src.source ?? payload.source ?? pack.source ?? "",
  };
}

function packResult(verdict, pack, action, extras = {}) {
  const next = clonePack(pack);
  const scored = score(next);
  return {
    ok: true,
    product: "cinch",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    cinched: scored.cinched,
    omitted: scored.omitted,
    delivered: scored.delivered,
    tackCinched: verdict === "cinched",
    tackSlipped: verdict === "slipped",
    tackDropped: verdict === "dropped",
    tackPhantom: verdict === "phantom",
    tackOmitted: verdict === "omitted",
    tackPartial: verdict === "partial",
    tackTrusted: verdict === "trusted",
    tackLoose: verdict === "loose",
    tackDelivered: verdict === "delivered",
    tackHalted: verdict === "halted",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    missing: scored.missing,
    extra: scored.extra,
    missingRoot: scored.missingRoot,
    hasSurvivingLeaf: scored.hasSurvivingLeaf,
    trustedMiss: scored.trustedMiss,
    unreachable: scored.unreachable,
    leafProceed: scored.leafProceed,
    shipped: scored.shipped,
    halted: scored.halted,
    uiGreen: scored.uiGreen,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    pack: next,
    ...extras,
  };
}

function seedPack(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    pack: {
      ...emptyPack(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      expected: asList(extras.expected),
      mounted: asList(extras.mounted),
      trusted: asList(extras.trusted),
      listed: asList(extras.listed),
      unreachable: asList(extras.unreachable),
      leafProceed: asBool(extras.leafProceed),
      shipped: asBool(extras.shipped),
      halted: asBool(extras.halted),
      uiGreen: asBool(extras.uiGreen),
    },
  };
}

const ENGINES = "engines";
const OUTPUTS = "Outputs";
const OUTPUTS_LEAF = "Outputs/leaf";
const BRIEF = "brief";

/** Idle / bail. Pack not scored as a live run. */
export function seedCinched() {
  return seedPack("cinched", "tack", {
    session: "cinched",
    issue: null,
    scored: true,
  });
}

/** Control interactive session that stays cinched. */
export function seedControl() {
  return seedPack("cinched", "interactive", {
    session: "90506-control",
    issue: null,
    expected: [ENGINES, OUTPUTS, BRIEF],
    mounted: [ENGINES, OUTPUTS, BRIEF],
    trusted: [ENGINES, OUTPUTS, BRIEF],
    listed: [ENGINES, OUTPUTS, BRIEF],
  });
}

/**
 * #90506 incident 3: engines + Outputs root missing, one leaf under
 * Outputs stayed reachable; guard treated the leaf as proceed; VP
 * report shipped with two sections silently omitted.
 */
export function seedOmitted() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-omitted",
    expected: [ENGINES, OUTPUTS],
    mounted: [OUTPUTS_LEAF],
    trusted: [ENGINES, OUTPUTS],
    listed: [ENGINES, OUTPUTS],
    leafProceed: true,
    shipped: true,
  });
}

/** Incomplete output presented as complete, without leaf-proceed. */
export function seedDelivered() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-delivered",
    expected: [ENGINES, OUTPUTS],
    mounted: [BRIEF],
    trusted: [],
    listed: [],
    shipped: true,
  });
}

/** Guard treated a missing root as a hard stop. */
export function seedHalted() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-halted",
    issue: null,
    expected: [ENGINES, OUTPUTS],
    mounted: [],
    trusted: [ENGINES, OUTPUTS],
    listed: [ENGINES, OUTPUTS],
    halted: true,
  });
}

/** Listed / trusted / connected but unreachable at the session mount. */
export function seedPhantom() {
  return seedPack(89813, "anthropics/claude-code#89813", {
    session: "89813-phantom",
    expected: [OUTPUTS],
    mounted: [],
    trusted: [OUTPUTS],
    listed: [OUTPUTS],
    unreachable: [OUTPUTS],
  });
}

/** UI / ledger green while the pack has shifted. */
export function seedLoose() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-loose",
    issue: null,
    expected: [ENGINES, OUTPUTS],
    mounted: [OUTPUTS],
    trusted: [],
    listed: [ENGINES, OUTPUTS],
    uiGreen: true,
  });
}

/** Trusted Cowork folders did not prevent a two-folder drop. */
export function seedTrusted() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-trusted",
    expected: [ENGINES, OUTPUTS, BRIEF],
    mounted: [BRIEF],
    trusted: [ENGINES, OUTPUTS, BRIEF],
    listed: [ENGINES, OUTPUTS, BRIEF],
  });
}

/** Two or more expected folders missing; none were on the trusted list. */
export function seedDropped() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-dropped",
    expected: [ENGINES, OUTPUTS, BRIEF],
    mounted: [BRIEF],
    trusted: [],
    listed: [],
  });
}

/** One trusted folder missing this run. */
export function seedSlipped() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-slipped",
    expected: [ENGINES, OUTPUTS, BRIEF],
    mounted: [ENGINES, OUTPUTS],
    trusted: [BRIEF],
    listed: [BRIEF],
  });
}

/** A subset of the expected mount set is present. */
export function seedPartial() {
  return seedPack(90506, "anthropics/claude-code#90506", {
    session: "90506-partial",
    issue: null,
    expected: [ENGINES, OUTPUTS],
    mounted: [ENGINES],
    trusted: [],
    listed: [ENGINES, OUTPUTS],
  });
}

/** Full #90506 incident 3 used as the restore-to-omitted ticket. */
export function seed90506() {
  return seedOmitted();
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyPack();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return clonePack({ expected: parsed });
      if (parsed && typeof parsed === "object") {
        if (
          Array.isArray(parsed.expected) ||
          Array.isArray(parsed.mounted) ||
          parsed.pack ||
          parsed.probe
        ) {
          return clonePack(parsed);
        }
        return clonePack(parsed);
      }
    } catch {
      /* fall through to prose */
    }
  }
  const omitted =
    /incident 3|leaf (treated as )?proceed|silently omitted|two sections/i.test(text) ||
    (/engines/i.test(text) && /Outputs/i.test(text) && /leaf/i.test(text));
  const delivered = /presented as complete|VP report shipped|monthly deliverable/i.test(text);
  const phantom = /unreachable at the session mount|never attached|listed\/trusted\/connected/i.test(text);
  const trusted = /Trusted Cowork folders (change|did not)|Always-allow/i.test(text) && /did not stop/i.test(text);
  const dropped = /two or more|six different folder combinations/i.test(text) && !omitted;
  const slipped = /one trusted folder missing/i.test(text);
  const halted = /hard stop|honest path/i.test(text);
  const loose = /reads tight|ledger green|pack has shifted/i.test(text);
  const partial = /subset of the expected mount set/i.test(text);
  if (omitted) return { ...seedOmitted().pack, session: "paste-omitted", source: "anthropics/claude-code#90506", issue: 90506, scored: true };
  if (delivered) return { ...seedDelivered().pack, session: "paste-delivered", source: "anthropics/claude-code#90506", issue: 90506, scored: true };
  if (halted) return { ...seedHalted().pack, session: "paste-halted", source: "paste", scored: true };
  if (phantom) return { ...seedPhantom().pack, session: "paste-phantom", source: "anthropics/claude-code#89813", issue: 89813, scored: true };
  if (trusted) return { ...seedTrusted().pack, session: "paste-trusted", source: "anthropics/claude-code#90506", issue: 90506, scored: true };
  if (loose) return { ...seedLoose().pack, session: "paste-loose", source: "paste", scored: true };
  if (dropped) return { ...seedDropped().pack, session: "paste-dropped", source: "anthropics/claude-code#90506", issue: 90506, scored: true };
  if (slipped) return { ...seedSlipped().pack, session: "paste-slipped", source: "paste", scored: true };
  if (partial) return { ...seedPartial().pack, session: "paste-partial", source: "paste", scored: true };
  return { ...emptyPack(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  cinched: seedCinched,
  control: seedControl,
  omitted: seedOmitted,
  90506: seed90506,
  "90506-omitted": seedOmitted,
  delivered: seedDelivered,
  halted: seedHalted,
  phantom: seedPhantom,
  89813: seedPhantom,
  loose: seedLoose,
  trusted: seedTrusted,
  dropped: seedDropped,
  slipped: seedSlipped,
  partial: seedPartial,
  healthy: seedControl,
  interactive: seedControl,
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
  let pack = clonePack(action.pack);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "cinched" || verb === "still" || verb === "rest" || verb === "reset") {
    return packResult("cinched", emptyPack(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "interactive") {
    pack = seedControl().pack;
    return packResult(classify(pack), pack, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "omitted" || verb === "incident") {
    pack = seedOmitted().pack;
    return packResult(classify(pack), pack, { ...action, action: verb === "restore" ? "restore" : verb });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    pack = { ...pack, scored: true };
    return packResult(classify(pack), pack, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "girth") {
    pack = { ...pack, scored: true };
    return packResult(classify(pack), pack, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "girth" ? "score" : verb,
    });
  }

  pack = { ...pack, scored: true };
  return packResult(classify(pack), pack, action);
}
