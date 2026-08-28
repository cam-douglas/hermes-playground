/**
 * Gasket — steam-fitter's flange / packing-ring desk for Claude Code
 * sandbox.network.strictAllowlist that is silently discarded from
 * project settings. A written project key is not a seal.
 * Score the joint or admit tight.
 *
 * The operator puts sandbox.enabled: true and
 * sandbox.network.strictAllowlist: true in .claude/settings.json or
 * .claude/settings.local.json. The key is accepted. Schema validation
 * flags nothing. Startup, --debug, /status, /sandbox, and claude doctor
 * stay silent. The restriction is only honored from user, managed/policy,
 * or CLI --settings scope — project files are dropped at resolution.
 * Every other signal says the config took. The network seal is open.
 *
 * This is a fail-open security boundary, not a consent/auto-enable bug.
 *
 * Verdicts: tight | dropped | blown | nested | skipped | open
 *           | dry | warned | sheared | made
 * Idle word is tight (joint made, packing compressed, no leak).
 * NEVER use the product name gasket as the idle/state word.
 * NEVER use empty.
 *
 * Slack alarm on dropped / blown / nested / open / sheared.
 * Linear incident on dropped / blown / open.
 * GitHub gasket-ledger issue on every scored probe.
 *
 * Why this is not a clone:
 * NOT Damper (Remote Control auto-enable without consent; a settings
 * toggle that reads off is not a hold; chimney/flue). Gasket is a
 * written project security key discarded at resolution while every
 * other signal stays green. Fail-open of a network seal, not
 * unauthorized opening of a remote bridge.
 * NOT Tappet (silent hook injection / valve train / engine bay).
 * Gasket is not hooks, not UserPromptSubmit, not an engine bay.
 * Steam-fitter / boiler-flange / packing-ring, never tappets, cams,
 * valves, oil-black bays.
 * NOT Snib (Trusted Devices fail-open on an already-attached session).
 * NOT Knock (permission-grant stalls).
 * NOT Reed (MCP tool-registry death / four contacts).
 * NOT Husk / Assay / Cote / Nixie / Larder / Stencil.
 * NOT leftover woodworking / millimeter-slider clones.
 * Different problem: project-scoped strictAllowlist silently discarded.
 * A written key is not a seal.
 * Different UI: steam-fitter's bench. Linen lagging, brass union,
 * red-lead paste, graphite packing ring, bourdon-tube pressure gauge,
 * hand pump, hessian.
 * Different idle word: tight.
 */

export const VERDICTS = Object.freeze([
  "tight",
  "dropped",
  "blown",
  "nested",
  "skipped",
  "open",
  "dry",
  "warned",
  "sheared",
  "made",
]);
export const IDLE_WORD = "tight";
export const SLACK_VERDICTS = Object.freeze([
  "dropped",
  "blown",
  "nested",
  "open",
  "sheared",
]);
export const LINEAR_VERDICTS = Object.freeze(["dropped", "blown", "open"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "gasket",
  "empty",
  "banked",
  "seated",
  "latched",
  "stocked",
  "roosted",
  "heard",
  "clear",
  "paired",
  "kernel",
  "upheld",
  "sterling",
  "home",
  "valid",
  "intact",
  "even",
  "swept",
  "filed",
  "planed",
  "stopped",
  "taken",
  "shaved",
  "cleared",
  "sprung",
  "flush",
  "wiped",
  "clean",
  "damper",
  "tappet",
  "snib",
  "larder",
  "cote",
  "nixie",
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

export function emptyProbe() {
  return {
    projectSettingsHasStrictAllowlist: false,
    userOrManagedOrCliScope: false,
    sandboxEnabled: false,
    startupWarning: false,
    debugMentionsDiscard: false,
    statusMentionsDiscard: false,
    sandboxPanelMentionsDiscard: false,
    doctorMentionsDiscard: false,
    schemaMarksScope: false,
    schemaSaysUndocumented: false,
    bashEgressBlocked: false,
    webfetchEgressBlocked: false,
    writeGated: false,
    nestedProjectReplacedParent: false,
    socatOrBwrapMissing: false,
    warningFired: false,
    nonAllowlistedHostReached: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "tight-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.flange && typeof src.flange === "object" ? src.flange : {};
  const ring = src.ring && typeof src.ring === "object" ? src.ring : {};
  const joint = src.joint && typeof src.joint === "object" ? src.joint : {};
  const pick = (key) => src[key] ?? nested[key] ?? ring[key] ?? joint[key];
  return {
    ...emptyProbe(),
    projectSettingsHasStrictAllowlist: asBool(pick("projectSettingsHasStrictAllowlist")),
    userOrManagedOrCliScope: asBool(pick("userOrManagedOrCliScope")),
    sandboxEnabled: asBool(pick("sandboxEnabled")),
    startupWarning: asBool(pick("startupWarning")),
    debugMentionsDiscard: asBool(pick("debugMentionsDiscard")),
    statusMentionsDiscard: asBool(pick("statusMentionsDiscard")),
    sandboxPanelMentionsDiscard: asBool(pick("sandboxPanelMentionsDiscard")),
    doctorMentionsDiscard: asBool(pick("doctorMentionsDiscard")),
    schemaMarksScope: asBool(pick("schemaMarksScope")),
    schemaSaysUndocumented: asBool(pick("schemaSaysUndocumented")),
    bashEgressBlocked: asBool(pick("bashEgressBlocked")),
    webfetchEgressBlocked: asBool(pick("webfetchEgressBlocked")),
    writeGated: asBool(pick("writeGated")),
    nestedProjectReplacedParent: asBool(pick("nestedProjectReplacedParent")),
    socatOrBwrapMissing: asBool(pick("socatOrBwrapMissing")),
    warningFired: asBool(pick("warningFired")),
    nonAllowlistedHostReached: asBool(pick("nonAllowlistedHostReached")),
    observed: asBool(src.observed ?? nested.observed ?? ring.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? nested.source ?? ring.source),
    issue: asIssue(src.issue ?? nested.issue ?? ring.issue),
    scored: asBool(src.scored ?? nested.scored ?? ring.scored),
  };
}

function silentRuntime(next) {
  return (
    !next.startupWarning &&
    !next.debugMentionsDiscard &&
    !next.statusMentionsDiscard &&
    !next.sandboxPanelMentionsDiscard &&
    !next.doctorMentionsDiscard
  );
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.projectSettingsHasStrictAllowlist &&
    !next.userOrManagedOrCliScope &&
    !next.sandboxEnabled &&
    !next.startupWarning &&
    !next.debugMentionsDiscard &&
    !next.statusMentionsDiscard &&
    !next.sandboxPanelMentionsDiscard &&
    !next.doctorMentionsDiscard &&
    !next.schemaMarksScope &&
    !next.schemaSaysUndocumented &&
    !next.bashEgressBlocked &&
    !next.webfetchEgressBlocked &&
    !next.writeGated &&
    !next.nestedProjectReplacedParent &&
    !next.socatOrBwrapMissing &&
    !next.warningFired &&
    !next.nonAllowlistedHostReached &&
    !next.observed
  );
}

/**
 * First match wins. Idle tight is first. Classes stay distinguishable:
 * a written project key is not a seal. This is fail-open discard of
 * project-scoped strictAllowlist. NOT Damper (RC auto-enable).
 * NOT Tappet (hooks). NOT Snib. NOT Knock.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "tight";
  if (
    next.userOrManagedOrCliScope &&
    next.sandboxEnabled &&
    next.bashEgressBlocked &&
    !next.nonAllowlistedHostReached &&
    !next.nestedProjectReplacedParent
  ) {
    return "made";
  }
  if (next.nestedProjectReplacedParent) return "nested";
  if (
    next.bashEgressBlocked &&
    (!next.webfetchEgressBlocked || !next.writeGated) &&
    !next.userOrManagedOrCliScope
  ) {
    return "skipped";
  }
  if (
    next.sandboxEnabled &&
    next.projectSettingsHasStrictAllowlist &&
    next.nonAllowlistedHostReached &&
    !next.bashEgressBlocked
  ) {
    return "blown";
  }
  if (
    !next.sandboxEnabled &&
    next.projectSettingsHasStrictAllowlist &&
    next.nonAllowlistedHostReached &&
    !next.socatOrBwrapMissing
  ) {
    return "open";
  }
  if (
    !next.sandboxEnabled &&
    next.projectSettingsHasStrictAllowlist &&
    !next.nonAllowlistedHostReached &&
    !next.socatOrBwrapMissing &&
    !next.schemaSaysUndocumented
  ) {
    return "dry";
  }
  if (next.socatOrBwrapMissing && next.warningFired) return "warned";
  if (
    next.projectSettingsHasStrictAllowlist &&
    !next.userOrManagedOrCliScope &&
    silentRuntime(next) &&
    !next.schemaSaysUndocumented &&
    !next.schemaMarksScope &&
    !next.socatOrBwrapMissing
  ) {
    return "dropped";
  }
  if (next.schemaSaysUndocumented && !next.schemaMarksScope) return "sheared";
  return "tight";
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "dropped") {
    return "● Dropped · project key written · discarded at resolution · startup / debug / status / sandbox / doctor stay silent";
  }
  if (kind === "blown") {
    return "● Blown · sandbox looks on · allowlist present · non-allowlisted host still reached · fail-open";
  }
  if (kind === "nested") {
    return "● Nested · parent workspace sandbox replaced by a nested project's settings · the key is gone";
  }
  if (kind === "skipped") {
    return "● Skipped · Bash/curl gated · WebFetch or Write still walks the joint · in-process path not sealed";
  }
  if (kind === "open") {
    return "● Open · allowlist theater · no sandbox runtime · network keys sitting in a file · traffic unrestricted";
  }
  if (kind === "dry") {
    return "● Dry · network keys set · sandbox.enabled false or absent · dispatcher never invokes the sandbox";
  }
  if (kind === "warned") {
    return "● Warned · socat/bwrap missing · a warning actually fired · the path #34044 failed to take";
  }
  if (kind === "sheared") {
    return "● Sheared · schema copy UNDOCUMENTED · no scope note · validation flags nothing · runtime drops the key";
  }
  if (kind === "made") {
    return "● Made · user / managed / CLI --settings scope · sandbox enabled · Bash denied · a real hold from the right rack";
  }
  return "● Tight · joint made · packing compressed · no leak";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.projectSettingsHasStrictAllowlist
      ? "project .claude/settings.json or settings.local.json has sandbox.network.strictAllowlist"
      : "project settings do not carry strictAllowlist",
  );
  reasons.push(
    next.userOrManagedOrCliScope
      ? "user / managed / CLI --settings scope holds the key"
      : "not user, managed, or CLI --settings scope",
  );
  reasons.push(
    next.sandboxEnabled
      ? "sandbox.enabled is true"
      : "sandbox.enabled is false or absent",
  );
  reasons.push(
    silentRuntime(next)
      ? "startup, --debug, /status, /sandbox, and doctor stay silent"
      : [
          next.startupWarning ? "startup warned" : null,
          next.debugMentionsDiscard ? "--debug mentions discard" : null,
          next.statusMentionsDiscard ? "/status mentions discard" : null,
          next.sandboxPanelMentionsDiscard ? "/sandbox mentions discard" : null,
          next.doctorMentionsDiscard ? "doctor mentions discard" : null,
        ]
          .filter(Boolean)
          .join(" · "),
  );
  reasons.push(
    next.schemaMarksScope
      ? "schema marks the key as scope-restricted"
      : next.schemaSaysUndocumented
        ? "schema/editor copy says UNDOCUMENTED with no scope note"
        : "schema does not mark scope",
  );
  reasons.push(
    next.bashEgressBlocked ? "Bash egress blocked" : "Bash egress not blocked",
  );
  reasons.push(
    next.webfetchEgressBlocked
      ? "WebFetch egress blocked"
      : "WebFetch egress not gated",
  );
  reasons.push(next.writeGated ? "Write is gated" : "Write is not gated");
  if (next.nestedProjectReplacedParent) {
    reasons.push("nested project settings replaced the parent workspace sandbox");
  }
  if (next.socatOrBwrapMissing) {
    reasons.push(
      next.warningFired
        ? "socat/bwrap missing and a warning fired"
        : "socat/bwrap missing and no warning fired",
    );
  }
  reasons.push(
    next.nonAllowlistedHostReached
      ? "non-allowlisted host was reached"
      : "no non-allowlisted host claimed reached",
  );
  if (next.observed) {
    reasons.push("Observe checked schema, doctor, and /status on the flange");
  }
  reasons.push("a written project key is not a seal");
  reasons.push(
    "NOT Damper (RC auto-enable / chimney) / Tappet (valve train) / Snib / Knock / Reed / Husk / Assay / Cote / Nixie / Larder / Stencil / leftover woodworking / millimeter-slider",
  );
  if (kind === "tight") {
    reasons.push("joint made, packing compressed, no leak; idle word is tight");
  }
  if (kind === "dropped") {
    reasons.push(
      "PRIMARY #90355: project-scoped strictAllowlist silently discarded at resolution",
    );
  }
  if (kind === "blown") {
    reasons.push("sandbox looks on and the UI is green; egress still succeeds; fail-open");
  }
  if (kind === "nested") {
    reasons.push("PRIMARY contrast #83035: nested project file replaced parent sandbox");
  }
  if (kind === "skipped") {
    reasons.push("PRIMARY contrast #89762: Bash/curl gated; WebFetch or Write not gated");
  }
  if (kind === "open") {
    reasons.push("allowlist theater: keys in a file, no sandbox runtime, traffic unrestricted");
  }
  if (kind === "dry") {
    reasons.push("RELATED #87163 class: network keys set, sandbox.enabled false or absent");
  }
  if (kind === "warned") {
    reasons.push("missing runtime dep, but a warning fired — the path #34044 failed to take");
  }
  if (kind === "sheared") {
    reasons.push(
      "PRIMARY #90355 schema + #87545 class: UNDOCUMENTED copy, no scope note, runtime drops the key",
    );
  }
  if (kind === "made") {
    reasons.push("right-scope hold: user / managed / CLI --settings, sandbox on, Bash denied");
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

export function sealedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "tight" || kind === "made";
}

export function leakOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  return (
    next.nonAllowlistedHostReached ||
    kind === "blown" ||
    kind === "open" ||
    kind === "skipped" ||
    kind === "nested"
  );
}

export function discardedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "dropped" || kind === "sheared";
}

export function skippedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "skipped";
}

/**
 * score(probe) → { verdict, reasons[], sealed, leak, discarded, skipped }
 * Deterministic. First match wins. Idle tight first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    sealed: sealedOf(next, verdict),
    leak: leakOf(next, verdict),
    discarded: discardedOf(next, verdict),
    skipped: skippedOf(next, verdict),
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
  const nested =
    payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    projectSettingsHasStrictAllowlist: pick("projectSettingsHasStrictAllowlist"),
    userOrManagedOrCliScope: pick("userOrManagedOrCliScope"),
    sandboxEnabled: pick("sandboxEnabled"),
    startupWarning: pick("startupWarning"),
    debugMentionsDiscard: pick("debugMentionsDiscard"),
    statusMentionsDiscard: pick("statusMentionsDiscard"),
    sandboxPanelMentionsDiscard: pick("sandboxPanelMentionsDiscard"),
    doctorMentionsDiscard: pick("doctorMentionsDiscard"),
    schemaMarksScope: pick("schemaMarksScope"),
    schemaSaysUndocumented: pick("schemaSaysUndocumented"),
    bashEgressBlocked: pick("bashEgressBlocked"),
    webfetchEgressBlocked: pick("webfetchEgressBlocked"),
    writeGated: pick("writeGated"),
    nestedProjectReplacedParent: pick("nestedProjectReplacedParent"),
    socatOrBwrapMissing: pick("socatOrBwrapMissing"),
    warningFired: pick("warningFired"),
    nonAllowlistedHostReached: pick("nonAllowlistedHostReached"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    flange: fromFields.flange,
    ring: fromFields.ring,
    joint: fromFields.joint,
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
    product: "gasket",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    sealed: scored.sealed,
    leak: scored.leak,
    discarded: scored.discarded,
    skipped: scored.skipped,
    jointTight: verdict === "tight",
    jointDropped: verdict === "dropped",
    jointBlown: verdict === "blown",
    jointNested: verdict === "nested",
    jointSkipped: verdict === "skipped",
    jointOpen: verdict === "open",
    jointDry: verdict === "dry",
    jointWarned: verdict === "warned",
    jointSheared: verdict === "sheared",
    jointMade: verdict === "made",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    projectSettingsHasStrictAllowlist: next.projectSettingsHasStrictAllowlist,
    userOrManagedOrCliScope: next.userOrManagedOrCliScope,
    sandboxEnabled: next.sandboxEnabled,
    startupWarning: next.startupWarning,
    debugMentionsDiscard: next.debugMentionsDiscard,
    statusMentionsDiscard: next.statusMentionsDiscard,
    sandboxPanelMentionsDiscard: next.sandboxPanelMentionsDiscard,
    doctorMentionsDiscard: next.doctorMentionsDiscard,
    schemaMarksScope: next.schemaMarksScope,
    schemaSaysUndocumented: next.schemaSaysUndocumented,
    bashEgressBlocked: next.bashEgressBlocked,
    webfetchEgressBlocked: next.webfetchEgressBlocked,
    writeGated: next.writeGated,
    nestedProjectReplacedParent: next.nestedProjectReplacedParent,
    socatOrBwrapMissing: next.socatOrBwrapMissing,
    warningFired: next.warningFired,
    nonAllowlistedHostReached: next.nonAllowlistedHostReached,
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
      projectSettingsHasStrictAllowlist: Boolean(extras.projectSettingsHasStrictAllowlist),
      userOrManagedOrCliScope: Boolean(extras.userOrManagedOrCliScope),
      sandboxEnabled: Boolean(extras.sandboxEnabled),
      startupWarning: Boolean(extras.startupWarning),
      debugMentionsDiscard: Boolean(extras.debugMentionsDiscard),
      statusMentionsDiscard: Boolean(extras.statusMentionsDiscard),
      sandboxPanelMentionsDiscard: Boolean(extras.sandboxPanelMentionsDiscard),
      doctorMentionsDiscard: Boolean(extras.doctorMentionsDiscard),
      schemaMarksScope: Boolean(extras.schemaMarksScope),
      schemaSaysUndocumented: Boolean(extras.schemaSaysUndocumented),
      bashEgressBlocked: Boolean(extras.bashEgressBlocked),
      webfetchEgressBlocked: Boolean(extras.webfetchEgressBlocked),
      writeGated: Boolean(extras.writeGated),
      nestedProjectReplacedParent: Boolean(extras.nestedProjectReplacedParent),
      socatOrBwrapMissing: Boolean(extras.socatOrBwrapMissing),
      warningFired: Boolean(extras.warningFired),
      nonAllowlistedHostReached: Boolean(extras.nonAllowlistedHostReached),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / clear. Joint made. Packing compressed. No leak. */
export function seedTight() {
  return seedProbe("tight", "flange", {
    session: "tight",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90355 dropped.
 * Key in project .claude/settings.json, discarded at resolution,
 * no warning at startup / debug / status / sandbox / doctor.
 */
export function seed90355Dropped() {
  return seedProbe(90355, "anthropics/claude-code#90355", {
    session: "90355-dropped",
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: true,
  });
}

/** Blown: sandbox looks on, allowlist present, non-allowlisted host reached. */
export function seedBlown() {
  return seedProbe(90355, "anthropics/claude-code#90355", {
    session: "90355-blown",
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: true,
    nonAllowlistedHostReached: true,
  });
}

/** #83035 nested: parent workspace sandbox replaced by a nested project's file. */
export function seed83035Nested() {
  return seedProbe(83035, "anthropics/claude-code#83035", {
    session: "83035-nested",
    nestedProjectReplacedParent: true,
    sandboxEnabled: true,
  });
}

/** #89762 skipped: Bash/curl gated, WebFetch or Write not gated. */
export function seed89762Skipped() {
  return seedProbe(89762, "anthropics/claude-code#89762", {
    session: "89762-skipped",
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: true,
    bashEgressBlocked: true,
    webfetchEgressBlocked: false,
    writeGated: false,
  });
}

/** Open: allowlist theater. No sandbox runtime. Keys in a file. Traffic unrestricted. */
export function seedOpen() {
  return seedProbe(90355, "anthropics/claude-code#90355", {
    session: "90355-open",
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: false,
    nonAllowlistedHostReached: true,
  });
}

/** #87163 class dry: network keys set, sandbox.enabled false or absent. */
export function seed87163Dry() {
  return seedProbe(87163, "anthropics/claude-code#87163", {
    session: "87163-dry",
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: false,
  });
}

/** Warned: socat/bwrap missing, but a warning fired (the path #34044 failed to take). */
export function seedWarned() {
  return seedProbe(34044, "anthropics/claude-code#34044", {
    session: "34044-warned",
    socatOrBwrapMissing: true,
    warningFired: true,
    sandboxEnabled: true,
  });
}

/** Sheared: schema UNDOCUMENTED, no scope note, runtime drops the key. */
export function seedSheared() {
  return seedProbe(90355, "anthropics/claude-code#90355", {
    session: "90355-sheared",
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: true,
    schemaSaysUndocumented: true,
    schemaMarksScope: false,
  });
}

/** Made: user / managed / CLI --settings scope, sandbox on, Bash denied. */
export function seedMade() {
  return seedProbe("made", "scope", {
    session: "made",
    issue: null,
    userOrManagedOrCliScope: true,
    sandboxEnabled: true,
    bashEgressBlocked: true,
    webfetchEgressBlocked: true,
    writeGated: true,
  });
}

const SEEDS = {
  tight: seedTight,
  dropped: seed90355Dropped,
  90355: seed90355Dropped,
  "90355-dropped": seed90355Dropped,
  blown: seedBlown,
  "90355-blown": seedBlown,
  nested: seed83035Nested,
  83035: seed83035Nested,
  "83035-nested": seed83035Nested,
  skipped: seed89762Skipped,
  89762: seed89762Skipped,
  "89762-skipped": seed89762Skipped,
  open: seedOpen,
  "90355-open": seedOpen,
  dry: seed87163Dry,
  87163: seed87163Dry,
  "87163-dry": seed87163Dry,
  warned: seedWarned,
  34044: seedWarned,
  "34044-warned": seedWarned,
  sheared: seedSheared,
  "90355-sheared": seedSheared,
  made: seedMade,
};

function blownStrike(session) {
  return {
    ...emptyProbe(),
    projectSettingsHasStrictAllowlist: true,
    sandboxEnabled: true,
    nonAllowlistedHostReached: true,
    session: session || "blown",
    source: "cut",
    scored: true,
  };
}

function madeStrike(session) {
  return {
    ...emptyProbe(),
    userOrManagedOrCliScope: true,
    sandboxEnabled: true,
    bashEgressBlocked: true,
    webfetchEgressBlocked: true,
    writeGated: true,
    session: session || "made",
    source: "make",
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

  if (verb === "clear" || verb === "seat") {
    return pack("tight", emptyProbe(), { ...action, action: verb === "clear" ? "seat" : verb });
  }

  if (verb === "cut") {
    if (isIdle(probe)) {
      probe = blownStrike(action.session || probe.session);
    } else {
      probe = {
        ...probe,
        nonAllowlistedHostReached: true,
        bashEgressBlocked: false,
        scored: true,
      };
    }
    return pack(classify(probe), probe, { ...action, action: "cut" });
  }

  if (verb === "observe") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: "observe" });
  }

  if (verb === "make") {
    probe = madeStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "make" });
  }

  if (verb === "press" || verb === "admit" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" ? "press" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
