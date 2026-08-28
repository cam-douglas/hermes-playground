/**
 * Larder — stillroom scorer for silent plugin-store freeze.
 * A sync stamp is not a delivery. Score the shelf or admit stocked.
 *
 * Per-workspace Claude Desktop plugin stores report healthy sync on a
 * timer while downloading nothing. manifest.json lastUpdated advances;
 * plugin folders stand still; claude.ai Plugins page and auto-sync
 * indicators stay green; main.log is silent. Sessions (Desktop / Cowork)
 * load weeks-stale plugin content with no fault. A plugin off/on toggle
 * is a one-shot unstick (whole store re-downloads) then the store
 * re-freezes. Fault is per-store, not machine-wide: sibling workspaces
 * on the same machine take content normally.
 *
 * Verdicts: stocked | stamped | frozen | greened | toggled | drifted
 *           | lagged | aisled | aged | served
 * Idle word is stocked (content arrived on the shelf; hold is current).
 * NEVER use the product name larder as the idle/state word.
 * NEVER reuse idle words from other products: seated, heard, clear,
 * paired, kernel, latched, upheld, sterling, home, valid, dry, intact,
 * sealed, even, swept, filed, planed, stopped, taken, shaved, cleared,
 * sprung, flush, wiped, clean.
 *
 * Slack alarm on stamped / frozen / greened / drifted / aged / served.
 * Linear ticket on frozen / greened / served.
 * GitHub larder-ledger issue on every scored probe.
 *
 * Why this is not a clone:
 * NOT Husk (hollow headless SUCCESS envelopes from tools / kernel vs husk).
 * NOT Reed (MCP four contacts: connected vs registered vs served call).
 * NOT Parity (paste-in claim vs GitHub/Vercel/Linear/probe).
 * NOT Tappet (silent hook injection / valve train).
 * NOT Aside (/btw silent truncation).
 * NOT Chute (sanctioned secret handoff).
 * NOT Tain (Chrome pairing one-way glass).
 * NOT Snib (Trusted Devices fail-open).
 * NOT Veto (heron_brook palimpsest).
 * NOT Assay (tool-arg furnace).
 * NOT Wicket (worktree isolation gatehouse).
 * NOT Sigil (thinking-block signature).
 * NOT Stencil (plan-mode fence).
 * NOT Suture (stream tear).
 * NOT Blot (image-poison darkroom).
 * NOT Coda (silent text-block loss).
 * NOT Fathom (standing rules dropped by compact).
 * NOT Hasp, Reveille, Quench, Scrim, Knock.
 * NOT leftover woodworking (Nick, Gouge, Dent, Scuff, Creep, Stub,
 * Holiday, Shaving, Gap, etc.).
 * Different problem: plugin-store content clock vs sync stamp.
 * A healthy lastUpdated is not a hold. Content must arrive on the shelf.
 * Different UI: stillroom / cold larder. Zinc shelves, butcher-paper
 * labels, hanging spring-scale, slate content clock, ice-room light.
 * Different idle word: stocked.
 */

export const VERDICTS = Object.freeze([
  "stocked",
  "stamped",
  "frozen",
  "greened",
  "toggled",
  "drifted",
  "lagged",
  "aisled",
  "aged",
  "served",
]);
export const IDLE_WORD = "stocked";
export const SLACK_VERDICTS = Object.freeze([
  "stamped",
  "frozen",
  "greened",
  "drifted",
  "aged",
  "served",
]);
export const LINEAR_VERDICTS = Object.freeze(["frozen", "greened", "served"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const AGED_BEHIND = 10;
export const AGED_DAYS = 3;

const FORBIDDEN_IDLE = Object.freeze([
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
  "intact",
  "sealed",
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
  "larder",
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
  return Boolean(value);
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function emptyProbe() {
  return {
    autoSyncOn: false,
    lastUpdatedAdvanced: false,
    pluginFolderMoved: false,
    marketplaceVersion: "",
    localVersion: "",
    versionsBehind: 0,
    daysStale: 0,
    otherWorkspacesCurrent: false,
    logsPresent: false,
    indicatorsGreen: false,
    marketplacePageCurrent: false,
    toggleUnstick: false,
    reFroze: false,
    contentClockBehind: false,
    cliPinsBehind: false,
    autoUpdateOn: false,
    sessionsLoadFromStore: false,
    storePath: "",
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "stocked-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const nested = src.store && typeof src.store === "object" ? src.store : {};
  const shelf = src.shelf && typeof src.shelf === "object" ? src.shelf : {};
  const pick = (key) => src[key] ?? nested[key] ?? shelf[key];
  return {
    ...emptyProbe(),
    autoSyncOn: asBool(pick("autoSyncOn")),
    lastUpdatedAdvanced: asBool(pick("lastUpdatedAdvanced")),
    pluginFolderMoved: asBool(pick("pluginFolderMoved")),
    marketplaceVersion: asText(pick("marketplaceVersion")),
    localVersion: asText(pick("localVersion")),
    versionsBehind: asNumber(pick("versionsBehind"), 0),
    daysStale: asNumber(pick("daysStale"), 0),
    otherWorkspacesCurrent: asBool(pick("otherWorkspacesCurrent")),
    logsPresent: asBool(pick("logsPresent")),
    indicatorsGreen: asBool(pick("indicatorsGreen")),
    marketplacePageCurrent: asBool(pick("marketplacePageCurrent")),
    toggleUnstick: asBool(pick("toggleUnstick")),
    reFroze: asBool(pick("reFroze")),
    contentClockBehind: asBool(pick("contentClockBehind")),
    cliPinsBehind: asBool(pick("cliPinsBehind")),
    autoUpdateOn: asBool(pick("autoUpdateOn")),
    sessionsLoadFromStore: asBool(pick("sessionsLoadFromStore")),
    storePath: asText(pick("storePath")),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? nested.source),
    issue: asIssue(src.issue ?? nested.issue),
    scored: asBool(src.scored ?? nested.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.autoSyncOn &&
    !next.lastUpdatedAdvanced &&
    !next.pluginFolderMoved &&
    !next.marketplaceVersion &&
    !next.localVersion &&
    next.versionsBehind === 0 &&
    next.daysStale === 0 &&
    !next.otherWorkspacesCurrent &&
    !next.logsPresent &&
    !next.indicatorsGreen &&
    !next.marketplacePageCurrent &&
    !next.toggleUnstick &&
    !next.reFroze &&
    !next.contentClockBehind &&
    !next.cliPinsBehind &&
    !next.autoUpdateOn &&
    !next.sessionsLoadFromStore &&
    !next.storePath
  );
}

export function isAgedHold(probe = {}) {
  const next = cloneProbe(probe);
  return (
    (next.versionsBehind >= AGED_BEHIND || next.daysStale >= AGED_DAYS) &&
    !next.pluginFolderMoved
  );
}

/**
 * First match wins. Idle stocked is first. Healthy stocked is last.
 * Classes stay distinguishable: a healthy lastUpdated is not a hold.
 * Content must arrive on the shelf. This is the content clock vs the
 * sync stamp — NOT hook injection (Tappet), NOT hollow SUCCESS (Husk),
 * NOT MCP contacts (Reed), NOT /btw truncation (Aside).
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "stocked";
  if (next.toggleUnstick && next.pluginFolderMoved) return "toggled";
  if (next.sessionsLoadFromStore && next.versionsBehind > 0) return "served";
  if (isAgedHold(next)) return "aged";
  if (next.cliPinsBehind && next.autoUpdateOn && !next.lastUpdatedAdvanced) {
    return "drifted";
  }
  if (next.otherWorkspacesCurrent && !next.pluginFolderMoved && next.lastUpdatedAdvanced) {
    return "aisled";
  }
  if (next.reFroze && !next.pluginFolderMoved) return "frozen";
  if (next.lastUpdatedAdvanced && !next.pluginFolderMoved) return "stamped";
  if (
    !next.logsPresent &&
    next.indicatorsGreen &&
    next.versionsBehind > 0 &&
    !next.lastUpdatedAdvanced
  ) {
    return "greened";
  }
  if (next.contentClockBehind && !next.lastUpdatedAdvanced && !next.pluginFolderMoved) {
    return "lagged";
  }
  if (next.pluginFolderMoved && next.versionsBehind === 0) return "stocked";
  return "stocked";
}

export function feedOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  if (kind === "stamped") {
    return "● Stamped · sync stamp advanced · plugin folders stood still · a lastUpdated is not a delivery";
  }
  if (kind === "frozen") {
    return "● Frozen · toggle unstuck once · store re-froze · shelves still empty";
  }
  if (kind === "greened") {
    return "● Greened · every indicator green · main.log silent · versions behind with no stamp";
  }
  if (kind === "toggled") {
    return "● Toggled · one-shot unstick · whole store re-downloaded · looks like a fix";
  }
  if (kind === "drifted") {
    return "● Drifted · CLI pins behind · autoUpdate on · not a desktop store tick";
  }
  if (kind === "lagged") {
    return "● Lagged · two clocks · content arrival behind the sync stamp";
  }
  if (kind === "aisled") {
    return "● Aisled · sibling workspaces took content · this store did not · per-store, not machine-wide";
  }
  if (kind === "aged") {
    return "● Aged · hold weeks-stale · folders never moved · content clock vs sync stamp";
  }
  if (kind === "served") {
    return "● Served · Desktop / Cowork session loaded from THIS frozen store";
  }
  return "● Stocked · content arrived on the shelf · hold matches the marketplace";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(next.autoSyncOn ? "auto-sync reported on" : "auto-sync off or unset");
  reasons.push(
    next.lastUpdatedAdvanced
      ? "manifest lastUpdated advanced (sync stamp moved)"
      : "lastUpdated did not advance this tick",
  );
  reasons.push(
    next.pluginFolderMoved
      ? "plugin folders moved (content arrived on the shelf)"
      : "plugin folders stood still (no delivery)",
  );
  if (next.marketplaceVersion || next.localVersion) {
    reasons.push(
      `local ${next.localVersion || "—"} vs marketplace ${next.marketplaceVersion || "—"}`,
    );
  }
  if (next.versionsBehind) reasons.push(`${next.versionsBehind} versions behind`);
  if (next.daysStale) reasons.push(`${next.daysStale} days stale`);
  reasons.push(
    next.otherWorkspacesCurrent
      ? "sibling workspaces on this machine took content"
      : "no sibling-workspace currency claimed",
  );
  reasons.push(next.logsPresent ? "main.log has a trail" : "main.log silent / absent");
  reasons.push(
    next.indicatorsGreen
      ? "every indicator green (Plugins page, auto-sync, store health)"
      : "indicators not all green",
  );
  reasons.push(
    next.marketplacePageCurrent
      ? "claude.ai Plugins page shows current marketplace content"
      : "marketplace page not claimed current",
  );
  if (next.toggleUnstick) {
    reasons.push("this-tick off/on toggle caused a full store re-download");
  }
  if (next.reFroze) {
    reasons.push("store froze again after a prior toggle unstick");
  }
  if (next.contentClockBehind) {
    reasons.push("content clock behind sync stamp (historical clocks, not this-tick stamp)");
  }
  if (next.cliPinsBehind) {
    reasons.push("CLI plugin pins behind marketplace (pin drift, not a store tick)");
  }
  if (next.autoUpdateOn) reasons.push("CLI autoUpdate reported on");
  if (next.sessionsLoadFromStore) {
    reasons.push("Desktop / Cowork sessions load from THIS store");
  }
  if (next.storePath) reasons.push(`store ${next.storePath}`);
  reasons.push("content clock vs sync stamp: a healthy lastUpdated is not a hold");
  reasons.push(
    "NOT Husk / Reed / Parity / Tappet / Aside / Chute / Tain / Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Fathom / Hasp / Reveille / Quench / Scrim / Knock / leftover woodworking",
  );
  if (kind === "stocked") {
    reasons.push("content arrived on the shelf; hold is current; idle word is stocked");
  }
  if (kind === "stamped") {
    reasons.push("PRIMARY #90329: stamp moved, shelves did not");
  }
  if (kind === "frozen") {
    reasons.push("toggle unstuck once (26 Aug), then the store stayed frozen (28 Aug)");
  }
  if (kind === "greened") {
    reasons.push("every indicator green, no diagnostic trail, versions behind");
  }
  if (kind === "toggled") {
    reasons.push("one-shot unstick that looks like a fix; the store will re-freeze");
  }
  if (kind === "drifted") {
    reasons.push("CLI pins; not a desktop store tick (#90329 related observation)");
  }
  if (kind === "lagged") {
    reasons.push("two clocks exist; content arrival behind the sync stamp");
  }
  if (kind === "aisled") {
    reasons.push("per-store, not machine-wide: sibling aisles took the delivery");
  }
  if (kind === "aged") {
    reasons.push("real #90329 figures: 37 versions behind, 3 days stale (1.69.0 vs 1.106.1)");
  }
  if (kind === "served") {
    reasons.push("the session diagnosing the freeze is itself loaded from it");
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

/**
 * score(probe) → { verdict, reasons[], feed, slack, linear, github }
 * Deterministic. First match wins. Idle stocked first; healthy stocked last.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
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
    autoSyncOn: pick("autoSyncOn"),
    lastUpdatedAdvanced: pick("lastUpdatedAdvanced"),
    pluginFolderMoved: pick("pluginFolderMoved"),
    marketplaceVersion: pick("marketplaceVersion"),
    localVersion: pick("localVersion"),
    versionsBehind: pick("versionsBehind"),
    daysStale: pick("daysStale"),
    otherWorkspacesCurrent: pick("otherWorkspacesCurrent"),
    logsPresent: pick("logsPresent"),
    indicatorsGreen: pick("indicatorsGreen"),
    marketplacePageCurrent: pick("marketplacePageCurrent"),
    toggleUnstick: pick("toggleUnstick"),
    reFroze: pick("reFroze"),
    contentClockBehind: pick("contentClockBehind"),
    cliPinsBehind: pick("cliPinsBehind"),
    autoUpdateOn: pick("autoUpdateOn"),
    sessionsLoadFromStore: pick("sessionsLoadFromStore"),
    storePath: pick("storePath"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    store: fromFields.store,
    shelf: fromFields.shelf,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  return {
    action: String((nested ? nested.action : payload.action) || "score"),
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
    product: "larder",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    shelfStocked: verdict === "stocked",
    shelfStamped: verdict === "stamped",
    shelfFrozen: verdict === "frozen",
    shelfGreened: verdict === "greened",
    shelfToggled: verdict === "toggled",
    shelfDrifted: verdict === "drifted",
    shelfLagged: verdict === "lagged",
    shelfAisled: verdict === "aisled",
    shelfAged: verdict === "aged",
    shelfServed: verdict === "served",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    autoSyncOn: next.autoSyncOn,
    lastUpdatedAdvanced: next.lastUpdatedAdvanced,
    pluginFolderMoved: next.pluginFolderMoved,
    marketplaceVersion: next.marketplaceVersion,
    localVersion: next.localVersion,
    versionsBehind: next.versionsBehind,
    daysStale: next.daysStale,
    otherWorkspacesCurrent: next.otherWorkspacesCurrent,
    logsPresent: next.logsPresent,
    indicatorsGreen: next.indicatorsGreen,
    marketplacePageCurrent: next.marketplacePageCurrent,
    toggleUnstick: next.toggleUnstick,
    reFroze: next.reFroze,
    contentClockBehind: next.contentClockBehind,
    cliPinsBehind: next.cliPinsBehind,
    autoUpdateOn: next.autoUpdateOn,
    sessionsLoadFromStore: next.sessionsLoadFromStore,
    storePath: next.storePath,
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
      autoSyncOn: Boolean(extras.autoSyncOn),
      lastUpdatedAdvanced: Boolean(extras.lastUpdatedAdvanced),
      pluginFolderMoved: Boolean(extras.pluginFolderMoved),
      marketplaceVersion: extras.marketplaceVersion || "",
      localVersion: extras.localVersion || "",
      versionsBehind: extras.versionsBehind || 0,
      daysStale: extras.daysStale || 0,
      otherWorkspacesCurrent: Boolean(extras.otherWorkspacesCurrent),
      logsPresent: Boolean(extras.logsPresent),
      indicatorsGreen: Boolean(extras.indicatorsGreen),
      marketplacePageCurrent: Boolean(extras.marketplacePageCurrent),
      toggleUnstick: Boolean(extras.toggleUnstick),
      reFroze: Boolean(extras.reFroze),
      contentClockBehind: Boolean(extras.contentClockBehind),
      cliPinsBehind: Boolean(extras.cliPinsBehind),
      autoUpdateOn: Boolean(extras.autoUpdateOn),
      sessionsLoadFromStore: Boolean(extras.sessionsLoadFromStore),
      storePath: extras.storePath || "",
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Healthy strike. Folders moved AND versions match. Content arrived. */
export function seedStocked() {
  return seedProbe("stocked", "plugin-store", {
    session: "stocked",
    issue: null,
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: true,
    marketplaceVersion: "1.106.1",
    localVersion: "1.106.1",
    versionsBehind: 0,
    daysStale: 0,
    logsPresent: true,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/**
 * PRIMARY #90329 stamped.
 * lastUpdated advanced, plugin folders stood still, every indicator green.
 * Real report: local 1.69.0 vs marketplace 1.106.1, 37 behind, 3 days stale.
 * Those 37-behind / 3-day figures live on seedAged — aged would steal
 * this primary class (rule 4 before rule 8). Keep versionsBehind < 10
 * AND daysStale < 3 so stamped wins.
 */
export function seed90329Stamped() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-stamped",
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.69.0",
    versionsBehind: 3,
    daysStale: 0,
    otherWorkspacesCurrent: false,
    logsPresent: false,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/**
 * Aged: the real #90329 37-behind / 3-day figures (1.69.0 vs 1.106.1).
 * otherWorkspacesCurrent false so aged beats aisled.
 */
export function seedAged() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-aged",
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.69.0",
    versionsBehind: 37,
    daysStale: 3,
    otherWorkspacesCurrent: false,
    logsPresent: false,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/**
 * Frozen: toggle unstuck on 26 Aug; 28 Aug the store is still frozen.
 * versionsBehind 2 so aged does not steal. Sync still ticking.
 */
export function seedFrozen() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-frozen",
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.104.0",
    versionsBehind: 2,
    daysStale: 2,
    otherWorkspacesCurrent: false,
    logsPresent: false,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    reFroze: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/** Toggled: this-tick off/on caused a full re-download. Looks like a fix. */
export function seedToggled() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-toggled",
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: true,
    marketplaceVersion: "1.106.1",
    localVersion: "1.106.1",
    versionsBehind: 0,
    daysStale: 0,
    logsPresent: true,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    toggleUnstick: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/** Served: the diagnosing session is itself loaded from this frozen store. */
export function seedServed() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-served",
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.104.0",
    versionsBehind: 2,
    daysStale: 0,
    otherWorkspacesCurrent: false,
    logsPresent: false,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    sessionsLoadFromStore: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/**
 * Drifted: CLI pins behind with autoUpdate on. Not a desktop store tick.
 * versionsBehind 8 and daysStale 2 so aged (needs >=10 or >=3 days) does not steal.
 */
export function seedDrifted() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-drifted",
    autoSyncOn: false,
    lastUpdatedAdvanced: false,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.98.0",
    versionsBehind: 8,
    daysStale: 2,
    otherWorkspacesCurrent: false,
    logsPresent: true,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    cliPinsBehind: true,
    autoUpdateOn: true,
    storePath: "",
  });
}

/** Aisled: sibling workspaces current; this store stamp moved, folders did not. */
export function seedAisled() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-aisled",
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.104.0",
    versionsBehind: 2,
    daysStale: 0,
    otherWorkspacesCurrent: true,
    logsPresent: false,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/** Greened: every indicator green, no log trail, stamp did not move, versions behind. */
export function seedGreened() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-greened",
    autoSyncOn: true,
    lastUpdatedAdvanced: false,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.102.0",
    versionsBehind: 4,
    daysStale: 1,
    otherWorkspacesCurrent: false,
    logsPresent: false,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

/** Lagged: two clocks exist; content arrival behind the sync stamp. Not this-tick. */
export function seedLagged() {
  return seedProbe(90329, "anthropics/claude-code#90329", {
    session: "90329-lagged",
    autoSyncOn: true,
    lastUpdatedAdvanced: false,
    pluginFolderMoved: false,
    marketplaceVersion: "1.106.1",
    localVersion: "1.105.0",
    versionsBehind: 1,
    daysStale: 0,
    otherWorkspacesCurrent: false,
    logsPresent: true,
    indicatorsGreen: false,
    marketplacePageCurrent: false,
    contentClockBehind: true,
    storePath: "local-agent-mode-sessions\\\\rpm\\\\",
  });
}

const SEEDS = {
  stocked: seedStocked,
  stamped: seed90329Stamped,
  90329: seed90329Stamped,
  "90329-stamped": seed90329Stamped,
  aged: seedAged,
  "90329-aged": seedAged,
  frozen: seedFrozen,
  "90329-frozen": seedFrozen,
  toggled: seedToggled,
  "90329-toggled": seedToggled,
  served: seedServed,
  "90329-served": seedServed,
  drifted: seedDrifted,
  "90329-drifted": seedDrifted,
  aisled: seedAisled,
  "90329-aisled": seedAisled,
  greened: seedGreened,
  "90329-greened": seedGreened,
  lagged: seedLagged,
  "90329-lagged": seedLagged,
};

function healthyStrike(session) {
  return {
    ...emptyProbe(),
    autoSyncOn: true,
    lastUpdatedAdvanced: true,
    pluginFolderMoved: true,
    marketplaceVersion: "1.106.1",
    localVersion: "1.106.1",
    versionsBehind: 0,
    daysStale: 0,
    logsPresent: true,
    indicatorsGreen: true,
    marketplacePageCurrent: true,
    session: session || "stocked",
    source: "strike",
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

  if (verb === "clear") {
    return pack("stocked", emptyProbe(), { ...action, action: "clear" });
  }

  if (verb === "strike") {
    if (isIdle(probe)) {
      probe = healthyStrike(action.session || probe.session);
    } else {
      probe = { ...probe, scored: true };
    }
    return pack(classify(probe), probe, { ...action, action: "strike" });
  }

  if (verb === "admit" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
