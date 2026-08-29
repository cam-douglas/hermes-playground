/**
 * Iota — typesetter's upper/lower type-case desk for Claude Code
 * Windows project-path identity. Two JSON keys that differ only
 * in case (or slash direction) for the same directory. A second
 * casing is not a plot. Score the keys or admit bound.
 *
 * Primary #90438: On Windows, ~/.claude.json accumulates project
 * keys that differ only in case for the same directory. Exact
 * keys from the follow-up comment:
 *   C:/Users//.claude/projects/Project1
 *   C:/Users//.Claude/projects/Project1
 * PowerShell ConvertFrom-Json throws DuplicateKeysInJsonString.
 * `claude mcp add -s local` keys by the launching shell's cwd
 * string (cmd wrote Project1; the session read project1) and the
 * MCP server is silently absent. Five keys for two real
 * directories. Version 2.1.251. Filed 2026-08-28, open.
 *
 * Corroboration (cite as shape, not a new primary):
 *   #75855 — drive-letter case not canonicalized (C: vs c:).
 *            doe() folds separators but not drive case.
 *   #90041 — headersHelper looks up forward-slash; trust dialog
 *            writes backslash. Helper never runs.
 *   #85344 — D:\repos\qoreai\jupyter vs D:\repos\QoreAI\jupyter.
 *   #88418 — one directory stored under up to three spellings.
 *   #76994 — CLI and VS Code see different config for one folder.
 *   #80264 — case-insensitive filesystems create duplicate entries.
 *   #84354 — Past Conversations empty from case-sensitive hashing.
 *
 * Verdicts: bound | split | twinned | hidden | unparseable
 *           | dropped | mixed | open | aliased | true
 * Idle word is bound (one sort, one drawer; no second casing).
 * NEVER use iota / type-case / casing / fold / folded / empty
 * as idle. NEVER reuse stilled, drained, flat, fit, spoilt,
 * laid, unlinked, tight, banked, roosted, stocked, seated,
 * heard, clear, paired, kernel, latched, upheld, sterling,
 * home, valid, dry, sealed, quiet, seised, stabled.
 *
 * Slack iota alarm on split / twinned / hidden / unparseable /
 * dropped / mixed / aliased. Linear ticket on split / twinned /
 * unparseable / dropped. GitHub iota-ledger of identity events
 * on every scored probe.
 *
 * Why this is not a clone:
 * NOT Reed (MCP Connected vs registered tools / four contacts).
 * NOT Gasket (sandbox.network.strictAllowlist silently discarded).
 * NOT Larder (plugin-store content-clock freeze).
 * NOT Leat (sleep-block unbounded until-loop).
 * NOT Husk (hollow headless success envelope).
 * NOT Shunt / Sump / Pleat / Scant / Chad / Kist / Wraith /
 * Damper / Cote / Tappet / Aside / Chute / Tain / Snib / Veto /
 * Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda /
 * Fathom / Hasp / Parity / Reveille / Quench / Scrim / Knock.
 * Different problem: one physical directory, many case/slash
 * spellings used as case-sensitive JSON keys.
 * Different UI: typesetter's upper/lower type-case desk.
 * Two drawers for one sort. Ink, lead, oak, proof sheet.
 * Different idle: bound.
 * Do NOT ship leftover woodworking, millimetre-sliders, or
 * near-clones. Do NOT name it Jot, Tittle, Canon, Galley,
 * Chase, Sort, Quad, Case, Casing, Homograph, Allograph,
 * Doppel, Twin, Alias, Glyph, Register, Ledger, Indenture,
 * Diptych, Cadastre, Folio, Shift.
 * Product name is Iota only.
 */

export const VERDICTS = Object.freeze([
  "bound",
  "split",
  "twinned",
  "hidden",
  "unparseable",
  "dropped",
  "mixed",
  "open",
  "aliased",
  "true",
]);
export const IDLE_WORD = "bound";
export const SLACK_VERDICTS = Object.freeze([
  "split",
  "twinned",
  "hidden",
  "unparseable",
  "dropped",
  "mixed",
  "aliased",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "split",
  "twinned",
  "unparseable",
  "dropped",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

export const KEYS_90438 = Object.freeze([
  "C:/Users//.claude/projects/Project1",
  "C:/Users//.Claude/projects/Project1",
  "C:/Users//.claude/projects/project1",
  "C:/Users//projects/project1",
  "C:/Users//projects/Project1",
]);

const FORBIDDEN_IDLE = Object.freeze([
  "iota",
  "type-case",
  "typecase",
  "casing",
  "fold",
  "folded",
  "empty",
  "stilled",
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
  "stabled",
  "jot",
  "tittle",
  "canon",
  "galley",
  "chase",
  "sort",
  "quad",
  "case",
  "homograph",
  "allograph",
  "doppel",
  "twin",
  "alias",
  "glyph",
  "register",
  "ledger",
  "indenture",
  "diptych",
  "cadastre",
  "folio",
  "shift",
  "leat",
  "shunt",
  "sump",
  "reed",
  "gasket",
  "larder",
  "husk",
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

function asNumber(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => asText(item)).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

/** doe() folds separators but not drive case. */
export function foldSeparators(key) {
  return asText(key).replace(/\\/g, "/");
}

/** Windows physical identity: separators and case. */
export function foldIdentity(key) {
  return foldSeparators(key).toLowerCase();
}

export function driveLetter(key) {
  const match = asText(key).match(/^([A-Za-z]):/);
  return match ? match[1] : "";
}

export function slashStyle(key) {
  const text = asText(key);
  const back = text.includes("\\");
  const forward = text.includes("/");
  if (back && forward) return "mixed";
  if (back) return "backslash";
  if (forward) return "forward";
  return "none";
}

export function caseOnlyPair(left, right) {
  return (
    asText(left) !== asText(right) &&
    foldIdentity(left) === foldIdentity(right) &&
    foldSeparators(left) !== foldSeparators(right)
  );
}

export function slashOnlyPair(left, right) {
  return asText(left) !== asText(right) && foldSeparators(left) === foldSeparators(right);
}

export function powerShellDuplicate(keys = []) {
  const seen = new Map();
  for (const key of keys) {
    const folded = asText(key).toLowerCase();
    if (seen.has(folded) && seen.get(folded) !== key) return true;
    seen.set(folded, key);
  }
  return false;
}

export function clusterKeys(keys = []) {
  const groups = new Map();
  for (const key of keys) {
    const id = foldIdentity(key);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(key);
  }
  return [...groups.values()];
}

export function emptyProbe() {
  return {
    keys: [],
    mcpWriteKey: "",
    sessionReadKey: "",
    mcpAbsent: false,
    trustWriteKey: "",
    trustLookupKey: "",
    helperRan: false,
    permissionsAllow: 0,
    permissionsHonored: 0,
    pluginsKeys: [],
    parseError: "",
    filesystemCaseInsensitive: false,
    doeFoldsSeparators: false,
    doeFoldsDriveCase: false,
    conversationsEmpty: false,
    mergedResplit: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "bound-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const drawer = src.drawer && typeof src.drawer === "object" ? src.drawer : {};
  const typecase = src.typecase && typeof src.typecase === "object" ? src.typecase : {};
  const proof = src.proof && typeof src.proof === "object" ? src.proof : {};
  const identity = src.identity && typeof src.identity === "object" ? src.identity : {};
  const pick = (key) => src[key] ?? drawer[key] ?? typecase[key] ?? proof[key] ?? identity[key];
  return {
    ...emptyProbe(),
    keys: asList(pick("keys")),
    mcpWriteKey: asText(pick("mcpWriteKey")),
    sessionReadKey: asText(pick("sessionReadKey")),
    mcpAbsent: asBool(pick("mcpAbsent")),
    trustWriteKey: asText(pick("trustWriteKey")),
    trustLookupKey: asText(pick("trustLookupKey")),
    helperRan: asBool(pick("helperRan")),
    permissionsAllow: asNumber(pick("permissionsAllow"), 0),
    permissionsHonored: asNumber(pick("permissionsHonored"), 0),
    pluginsKeys: asList(pick("pluginsKeys")),
    parseError: asText(pick("parseError")),
    filesystemCaseInsensitive: asBool(pick("filesystemCaseInsensitive")),
    doeFoldsSeparators: asBool(pick("doeFoldsSeparators")),
    doeFoldsDriveCase: asBool(pick("doeFoldsDriveCase")),
    conversationsEmpty: asBool(pick("conversationsEmpty")),
    mergedResplit: asBool(pick("mergedResplit")),
    observed: asBool(src.observed ?? drawer.observed ?? typecase.observed ?? proof.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? drawer.source ?? typecase.source ?? proof.source),
    issue: asIssue(src.issue ?? drawer.issue ?? typecase.issue ?? proof.issue),
    scored: asBool(src.scored ?? drawer.scored ?? typecase.scored ?? proof.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    next.keys.length === 0 &&
    !next.mcpWriteKey &&
    !next.sessionReadKey &&
    !next.mcpAbsent &&
    !next.trustWriteKey &&
    !next.trustLookupKey &&
    !next.helperRan &&
    next.permissionsAllow <= 0 &&
    next.permissionsHonored <= 0 &&
    next.pluginsKeys.length === 0 &&
    !next.parseError &&
    !next.conversationsEmpty &&
    !next.mergedResplit &&
    !next.observed
  );
}

export function analyze(probe = {}) {
  const next = cloneProbe(probe);
  const keys = next.keys;
  const groups = clusterKeys(keys);
  let hasCaseCollision = false;
  let hasSlashCollision = false;
  let multiSpelling = false;
  let threePlus = false;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      if (caseOnlyPair(keys[i], keys[j])) hasCaseCollision = true;
      if (slashOnlyPair(keys[i], keys[j])) hasSlashCollision = true;
    }
  }
  for (const group of groups) {
    if (group.length >= 2) multiSpelling = true;
    if (group.length >= 3) threePlus = true;
  }
  const parseCollision = /DuplicateKeysInJsonString/i.test(next.parseError);
  const mcpMiss =
    Boolean(next.mcpWriteKey) &&
    Boolean(next.sessionReadKey) &&
    next.mcpWriteKey !== next.sessionReadKey &&
    foldIdentity(next.mcpWriteKey) === foldIdentity(next.sessionReadKey);
  const trustDiffer =
    Boolean(next.trustWriteKey) &&
    Boolean(next.trustLookupKey) &&
    next.trustWriteKey !== next.trustLookupKey &&
    foldIdentity(next.trustWriteKey) === foldIdentity(next.trustLookupKey);
  const trustCaseMiss = trustDiffer && caseOnlyPair(next.trustWriteKey, next.trustLookupKey);
  const slashTrustMiss = trustDiffer && slashOnlyPair(next.trustWriteKey, next.trustLookupKey);
  const permissionsDropped =
    next.permissionsAllow > 0 && next.permissionsHonored < next.permissionsAllow;
  const pluginsMixed = powerShellDuplicate(next.pluginsKeys);
  const driveMismatch = Boolean(
    next.mcpWriteKey &&
      next.sessionReadKey &&
      driveLetter(next.mcpWriteKey) &&
      driveLetter(next.sessionReadKey) &&
      driveLetter(next.mcpWriteKey) !== driveLetter(next.sessionReadKey) &&
      driveLetter(next.mcpWriteKey).toLowerCase() ===
        driveLetter(next.sessionReadKey).toLowerCase(),
  );
  const canonical =
    keys.length === 1 &&
    !parseCollision &&
    !mcpMiss &&
    !trustDiffer &&
    !permissionsDropped &&
    !pluginsMixed &&
    (!next.mcpWriteKey || next.mcpWriteKey === next.sessionReadKey || !next.sessionReadKey);
  return {
    keys,
    groups,
    hasCaseCollision,
    hasSlashCollision,
    multiSpelling,
    threePlus,
    parseCollision,
    mcpMiss,
    trustDiffer,
    trustCaseMiss,
    slashTrustMiss,
    permissionsDropped,
    pluginsMixed,
    driveMismatch,
    canonical,
    realDirectories: groups.length,
  };
}

export function identityFault(probe = {}) {
  const facts = analyze(probe);
  return facts.hasCaseCollision && facts.parseCollision && facts.mcpMiss;
}

/**
 * First match wins. Idle bound is first. Classes stay
 * distinguishable: a second casing is not a plot. This is
 * project-path identity — one directory, many spellings.
 * NOT Reed (MCP contacts). NOT Gasket (allowlist discard).
 * NOT Larder (plugin-store freeze). NOT Leat (until-loop).
 * NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "bound";

  const facts = analyze(next);

  if (facts.hasCaseCollision && facts.parseCollision && facts.mcpMiss) return "split";

  if (facts.parseCollision) return "unparseable";

  if (facts.permissionsDropped) return "dropped";

  if (facts.mcpMiss || next.conversationsEmpty) return "hidden";

  if (facts.trustCaseMiss || facts.driveMismatch) return "dropped";

  if (facts.slashTrustMiss && !next.helperRan) return "open";

  if (facts.hasSlashCollision) return "aliased";

  if (facts.pluginsMixed) return "mixed";

  if (facts.multiSpelling || next.mergedResplit) return "twinned";

  if (facts.canonical) return "true";

  return "bound";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (facts.hasCaseCollision && facts.parseCollision && facts.mcpMiss) add("split");
  if (facts.parseCollision) add("unparseable");
  if (facts.mcpMiss || next.conversationsEmpty) add("hidden");
  if (facts.permissionsDropped || facts.trustCaseMiss || facts.driveMismatch) add("dropped");
  if (facts.slashTrustMiss && !next.helperRan) add("open");
  if (facts.hasSlashCollision) add("aliased");
  if (facts.pluginsMixed) add("mixed");
  if (facts.multiSpelling || next.mergedResplit) add("twinned");
  if (facts.canonical) add("true");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "split") {
    return "● Split · .claude vs .Claude · DuplicateKeysInJsonString · mcp add landed on Project1 while the session read project1";
  }
  if (kind === "twinned") {
    return "● Twinned · two or more spellings of one directory sit in the case";
  }
  if (kind === "hidden") {
    return "● Hidden · mcp add wrote one casing; the session read the other; the server is silently absent";
  }
  if (kind === "unparseable") {
    return "● Unparseable · PowerShell ConvertFrom-Json throws DuplicateKeysInJsonString";
  }
  if (kind === "dropped") {
    return "● Dropped · trust or permissions.allow ignored because the drive letter or casing was not canonicalized";
  }
  if (kind === "mixed") {
    return "● Mixed · installed_plugins.json holds mixed-case duplicates of one path";
  }
  if (kind === "open") {
    return "● Open · headersHelper looks up a forward-slash key; the trust dialog wrote a backslash; the helper never runs";
  }
  if (kind === "aliased") {
    return "● Aliased · same path, only slash direction changes the gate";
  }
  if (kind === "true") {
    return "● True · one directory, one key, write matches read · identity holds";
  }
  return "● Bound · one sort, one drawer · no second casing · idle word is bound";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.keys.length
      ? `${next.keys.length} project key(s) scored; ${facts.realDirectories} identity cluster(s)`
      : "no project keys scored",
  );
  if (facts.hasCaseCollision) {
    reasons.push("two keys differ only in case for the same directory");
  }
  if (facts.hasSlashCollision) {
    reasons.push("two keys differ only in slash direction for the same path");
  }
  if (facts.threePlus) {
    reasons.push("one directory stored under three or more spellings (shape #88418)");
  }
  reasons.push(
    facts.parseCollision
      ? "PowerShell ConvertFrom-Json throws DuplicateKeysInJsonString"
      : "file was not scored as unparseable",
  );
  reasons.push(
    facts.mcpMiss
      ? `mcp add wrote ${next.mcpWriteKey}; session read ${next.sessionReadKey}`
      : "mcp write and session read were not scored as a miss",
  );
  if (next.mcpAbsent) {
    reasons.push("MCP server is silently absent at runtime");
  }
  if (facts.slashTrustMiss) {
    reasons.push(
      "trust dialog wrote a backslash key; headersHelper looked up a forward-slash key (shape #90041)",
    );
  }
  if (next.helperRan) {
    reasons.push("headersHelper ran");
  } else if (next.trustWriteKey || next.trustLookupKey) {
    reasons.push("headersHelper never ran");
  }
  if (facts.permissionsDropped) {
    reasons.push(
      `${next.permissionsAllow} permissions.allow entries; ${next.permissionsHonored} honored (shape #75855)`,
    );
  }
  if (facts.driveMismatch) {
    reasons.push("drive-letter case not canonicalized; doe() folds separators but not drive case");
  }
  if (facts.pluginsMixed) {
    reasons.push("installed_plugins.json mixed-case duplicates");
  }
  if (next.conversationsEmpty) {
    reasons.push("Past Conversations appears empty from case-sensitive project-path hashing (shape #84354)");
  }
  if (next.mergedResplit) {
    reasons.push("merged entries re-split on shutdown from the non-canonical casing (shape #85344)");
  }
  if (next.filesystemCaseInsensitive) {
    reasons.push("filesystem is case-insensitive; keys are case-sensitive");
  }
  if (next.observed) {
    reasons.push("Case sounded: keys, parse, mcp write vs session read");
  }
  reasons.push("a second casing is not a plot");
  reasons.push(
    "NOT Reed (MCP contacts) / Gasket (strictAllowlist discard) / Larder (plugin-store freeze) / Leat (until-loop) / Husk (hollow success) / leftover woodworking / millimetre-slider",
  );
  if (kind === "bound") {
    reasons.push("one sort in one drawer, or desk idle; idle word is bound");
  }
  if (kind === "split") {
    reasons.push(
      "PRIMARY #90438: Windows ~/.claude.json accumulates project keys that differ only in case. Filed 2026-08-28, open. Version 2.1.251. Exact keys: C:/Users//.claude/projects/Project1 vs C:/Users//.Claude/projects/Project1. DuplicateKeysInJsonString. mcp add landed on Project1 while the session read project1. Five keys for two real directories",
    );
  }
  if (kind === "unparseable") {
    reasons.push(
      "PRIMARY #90438 parse fault: ConvertFrom-Json throws DuplicateKeysInJsonString so the file will not parse",
    );
  }
  if (kind === "hidden") {
    reasons.push(
      "PRIMARY #90438 / shape #76994: claude mcp add -s local keys by the launching shell's cwd string; the session reads the other casing and the server is silently absent",
    );
  }
  if (kind === "dropped") {
    reasons.push(
      "Shape #75855: drive-letter case not canonicalized (C: vs c: from VS Code fsPath vs git-bash/PowerShell). Trust silently dropped",
    );
  }
  if (kind === "open") {
    reasons.push(
      "Shape #90041: headersHelper trust gate looks up a forward-slash key; trust dialog writes a backslash. Helper never runs; MCP never connects",
    );
  }
  if (kind === "aliased") {
    reasons.push("Shape #90041 A/B: same path, only slash direction changes the gate");
  }
  if (kind === "mixed") {
    reasons.push("Shape #75855: installed_plugins.json mixed-case duplicates");
  }
  if (kind === "twinned") {
    reasons.push(
      "Shape #85344 / #88418 / #80264: one directory stored under two or more path spellings, splitting trust, MCP servers, and worktree state",
    );
  }
  if (kind === "true") {
    reasons.push("one physical directory maps to one key; write matches read");
  }
  const cluster = clusterOf(next, kind);
  if (cluster.length) {
    reasons.push(`supporting cluster: ${cluster.join(", ")}`);
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function boundOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "bound";
}

export function splitOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "split";
}

export function twinnedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "twinned";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], bound, split, twinned }
 * Deterministic. First match wins. Idle bound first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  const cluster = clusterOf(next, verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    cluster,
    bound: boundOf(next, verdict),
    split: splitOf(next, verdict),
    twinned: twinnedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    keys: pick("keys"),
    mcpWriteKey: pick("mcpWriteKey"),
    sessionReadKey: pick("sessionReadKey"),
    mcpAbsent: pick("mcpAbsent"),
    trustWriteKey: pick("trustWriteKey"),
    trustLookupKey: pick("trustLookupKey"),
    helperRan: pick("helperRan"),
    permissionsAllow: pick("permissionsAllow"),
    permissionsHonored: pick("permissionsHonored"),
    pluginsKeys: pick("pluginsKeys"),
    parseError: pick("parseError"),
    filesystemCaseInsensitive: pick("filesystemCaseInsensitive"),
    doeFoldsSeparators: pick("doeFoldsSeparators"),
    doeFoldsDriveCase: pick("doeFoldsDriveCase"),
    conversationsEmpty: pick("conversationsEmpty"),
    mergedResplit: pick("mergedResplit"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    drawer: fromFields.drawer,
    typecase: fromFields.typecase,
    proof: fromFields.proof,
    identity: fromFields.identity,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  const scored = score(next);
  return {
    ok: true,
    product: "iota",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    bound: scored.bound,
    split: scored.split,
    twinned: scored.twinned,
    cluster: scored.cluster,
    caseBound: verdict === "bound",
    caseSplit: verdict === "split",
    caseTwinned: verdict === "twinned",
    caseHidden: verdict === "hidden",
    caseUnparseable: verdict === "unparseable",
    caseDropped: verdict === "dropped",
    caseMixed: verdict === "mixed",
    caseOpen: verdict === "open",
    caseAliased: verdict === "aliased",
    caseTrue: verdict === "true",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    keys: next.keys,
    mcpWriteKey: next.mcpWriteKey,
    sessionReadKey: next.sessionReadKey,
    mcpAbsent: next.mcpAbsent,
    trustWriteKey: next.trustWriteKey,
    trustLookupKey: next.trustLookupKey,
    helperRan: next.helperRan,
    permissionsAllow: next.permissionsAllow,
    permissionsHonored: next.permissionsHonored,
    pluginsKeys: next.pluginsKeys,
    parseError: next.parseError,
    filesystemCaseInsensitive: next.filesystemCaseInsensitive,
    doeFoldsSeparators: next.doeFoldsSeparators,
    doeFoldsDriveCase: next.doeFoldsDriveCase,
    conversationsEmpty: next.conversationsEmpty,
    mergedResplit: next.mergedResplit,
    observed: next.observed,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    probe: {
      ...emptyProbe(),
      session,
      source,
      issue: issueId,
      keys: extras.keys ? extras.keys.slice() : [],
      mcpWriteKey: extras.mcpWriteKey || "",
      sessionReadKey: extras.sessionReadKey || "",
      mcpAbsent: Boolean(extras.mcpAbsent),
      trustWriteKey: extras.trustWriteKey || "",
      trustLookupKey: extras.trustLookupKey || "",
      helperRan: Boolean(extras.helperRan),
      permissionsAllow: extras.permissionsAllow != null ? Number(extras.permissionsAllow) : 0,
      permissionsHonored: extras.permissionsHonored != null ? Number(extras.permissionsHonored) : 0,
      pluginsKeys: extras.pluginsKeys ? extras.pluginsKeys.slice() : [],
      parseError: extras.parseError || "",
      filesystemCaseInsensitive: Boolean(extras.filesystemCaseInsensitive),
      doeFoldsSeparators: Boolean(extras.doeFoldsSeparators),
      doeFoldsDriveCase: Boolean(extras.doeFoldsDriveCase),
      conversationsEmpty: Boolean(extras.conversationsEmpty),
      mergedResplit: Boolean(extras.mergedResplit),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / bail. One sort, one drawer. Nothing scored. */
export function seedBound() {
  return seedProbe("bound", "case", {
    session: "bound",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90438 split.
 * .claude vs .Claude. DuplicateKeysInJsonString.
 * mcp add landed on Project1; session read project1.
 * Five keys for two real directories.
 */
export function seed90438Split() {
  return seedProbe(90438, "anthropics/claude-code#90438", {
    session: "90438-split",
    keys: KEYS_90438.slice(),
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "C:/Users//projects/project1",
    mcpAbsent: true,
    parseError: "DuplicateKeysInJsonString",
    filesystemCaseInsensitive: true,
  });
}

/** Two or more spellings of one directory, no parse fault, no mcp miss. */
export function seedTwinned() {
  return seedProbe(85344, "anthropics/claude-code#85344", {
    session: "85344-twinned",
    keys: ["D:\\repos\\qoreai\\jupyter", "D:\\repos\\QoreAI\\jupyter"],
    filesystemCaseInsensitive: true,
    mergedResplit: true,
  });
}

/** MCP write vs session read miss, no parse fault. */
export function seedHidden() {
  return seedProbe(90438, "anthropics/claude-code#90438", {
    session: "90438-hidden",
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "C:/Users//projects/project1",
    mcpAbsent: true,
  });
}

/** Parse fault only: DuplicateKeysInJsonString, no mcp miss. */
export function seedUnparseable() {
  return seedProbe(90438, "anthropics/claude-code#90438", {
    session: "90438-unparseable",
    keys: [
      "C:/Users//.claude/projects/Project1",
      "C:/Users//.Claude/projects/Project1",
    ],
    parseError: "DuplicateKeysInJsonString",
  });
}

/** Trust / permissions dropped on drive-letter case. */
export function seedDropped() {
  return seedProbe(75855, "anthropics/claude-code#75855", {
    session: "75855-dropped",
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "c:/Users//projects/Project1",
    permissionsAllow: 32,
    permissionsHonored: 0,
    doeFoldsSeparators: true,
    doeFoldsDriveCase: false,
    filesystemCaseInsensitive: true,
  });
}

/** installed_plugins.json mixed-case duplicates. */
export function seedMixed() {
  return seedProbe(75855, "anthropics/claude-code#75855", {
    session: "75855-mixed",
    pluginsKeys: [
      "C:/Users//projects/Project1",
      "C:/Users//projects/project1",
    ],
    filesystemCaseInsensitive: true,
  });
}

/** headersHelper never runs: forward-slash lookup, backslash write. */
export function seedOpen() {
  return seedProbe(90041, "anthropics/claude-code#90041", {
    session: "90041-open",
    trustWriteKey: "C:\\Users\\\\projects\\Project1",
    trustLookupKey: "C:/Users//projects/Project1",
    helperRan: false,
  });
}

/** Same path, only slash direction differs. Helper did run. */
export function seedAliased() {
  return seedProbe(90041, "anthropics/claude-code#90041", {
    session: "90041-aliased",
    keys: ["C:/Users//projects/Project1", "C:\\Users\\\\projects\\Project1"],
    helperRan: true,
  });
}

/** One directory, one key, write matches read. */
export function seedTrue() {
  return seedProbe("true", "case", {
    session: "true",
    issue: null,
    keys: ["C:/Users//projects/Project1"],
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "C:/Users//projects/Project1",
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw);
  const keys = [];
  const keyRe = /[A-Za-z]:[\\/][^\s"'`]+/g;
  let match;
  while ((match = keyRe.exec(text))) {
    const cleaned = match[0].replace(/[.,;:]+$/, "");
    if (!keys.includes(cleaned)) keys.push(cleaned);
  }
  const parseError = /DuplicateKeysInJsonString/i.test(text) ? "DuplicateKeysInJsonString" : "";
  const mcpWrite = /cmd wrote\s+(\S+)|landed on\s+(\S+)/i.exec(text);
  const sessionRead = /session read\s+(\S+)/i.exec(text);
  const mcpWriteKey = mcpWrite ? mcpWrite[1] || mcpWrite[2] || "" : "";
  const sessionReadKey = sessionRead ? sessionRead[1] : "";
  return {
    keys,
    mcpWriteKey,
    sessionReadKey,
    mcpAbsent: /silently absent|server was absent|MCP server/i.test(text),
    trustWriteKey: /trust dialog writes?\s+(backslash|\S+)/i.test(text)
      ? "C:\\Users\\\\projects\\Project1"
      : "",
    trustLookupKey: /looks? up\s+(forward-slash|\S+)/i.test(text)
      ? "C:/Users//projects/Project1"
      : "",
    helperRan: /helper (ran|runs)\b/i.test(text) && !/helper never runs/i.test(text),
    permissionsAllow: /32 permissions\.allow/i.test(text) ? 32 : 0,
    permissionsHonored: /ignored|dropped/i.test(text) && /permissions/i.test(text) ? 0 : 0,
    pluginsKeys: /installed_plugins/i.test(text)
      ? ["C:/Users//projects/Project1", "C:/Users//projects/project1"]
      : [],
    parseError,
    filesystemCaseInsensitive: /case-insensitive/i.test(text) || /Windows/i.test(text),
    doeFoldsSeparators: /doe\(\) folds separators/i.test(text),
    doeFoldsDriveCase: /doe\(\) folds separators but not drive case/i.test(text) ? false : false,
    conversationsEmpty: /Past Conversations appears empty/i.test(text),
    mergedResplit: /re-split on shutdown/i.test(text),
  };
}

const SEEDS = {
  bound: seedBound,
  split: seed90438Split,
  90438: seed90438Split,
  "90438-split": seed90438Split,
  twinned: seedTwinned,
  85344: seedTwinned,
  "85344-twinned": seedTwinned,
  hidden: seedHidden,
  "90438-hidden": seedHidden,
  unparseable: seedUnparseable,
  "90438-unparseable": seedUnparseable,
  dropped: seedDropped,
  75855: seedDropped,
  "75855-dropped": seedDropped,
  mixed: seedMixed,
  "75855-mixed": seedMixed,
  open: seedOpen,
  90041: seedOpen,
  "90041-open": seedOpen,
  aliased: seedAliased,
  "90041-aliased": seedAliased,
  true: seedTrue,
};

function splitStrike(session) {
  return {
    ...emptyProbe(),
    keys: KEYS_90438.slice(),
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "C:/Users//projects/project1",
    mcpAbsent: true,
    parseError: "DuplicateKeysInJsonString",
    filesystemCaseInsensitive: true,
    session: session || "split",
    source: "case",
    issue: 90438,
    scored: true,
  };
}

function boundHold(session) {
  return {
    ...emptyProbe(),
    session: session || "bound",
    source: "hold",
    scored: true,
  };
}

function trueHold(session) {
  return {
    ...emptyProbe(),
    keys: ["C:/Users//projects/Project1"],
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "C:/Users//projects/Project1",
    session: session || "true",
    source: "proof",
    scored: true,
  };
}

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
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "bound" || verb === "still") {
    return pack("bound", emptyProbe(), { ...action, action: verb === "still" ? "bail" : verb });
  }

  if (verb === "true" || verb === "proof" || verb === "bind") {
    probe = trueHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: verb === "proof" || verb === "bind" ? "true" : verb });
  }

  if (verb === "case" || verb === "drawer" || verb === "type") {
    probe = splitStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "case" });
  }

  if (verb === "bound-out" || verb === "close-case" || verb === "one-drawer") {
    probe = boundHold(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "bail" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "throw") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" || verb === "throw" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
