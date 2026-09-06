/**
 * Decant gravity-pour cellar-rack scorer.
 * A carboy should receive the whole
 * login-shell environment. Claude Desktop
 * already ran that shell in disclaimer
 * and then skimmed only PATH into the
 * session glass — credentials and paths
 * stay as lees.
 *
 * Encoded from #92515 issue facts only.
 * No network. No exploits. No real secrets.
 * Do not invent source-code claims.
 * Verify nothing.
 */

export const CHIPS = [
  "skimmed",
  "intact",
  "path-only",
  "marker-unset",
  "probed-0-of-8",
  "disclaimer-path-merge",
  "spawn-inherits",
  "cousins"
];

export const HOLD = new Set(["intact"]);

export const ALARM = new Set([
  "skimmed",
  "path-only",
  "marker-unset",
  "probed-0-of-8",
  "disclaimer-path-merge",
  "spawn-inherits",
  "cousins"
]);

export const INTACT_ROUTES = new Set(["terminal", "vscode", "rider", "zed"]);

const DEFAULT_PROBED = [
  "probe-1",
  "probe-2",
  "probe-3",
  "probe-4",
  "probe-5",
  "probe-6",
  "probe-7",
  "probe-8"
];

export function normalizeMarker(value) {
  if (value === 1 || value === true) return "set";
  if (value === 0 || value === false) return "unset";
  if (value == null) return "";
  const text = String(value).trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  if (lower === "unset" || lower === "missing" || lower === "dropped") return "unset";
  if (lower === "set" || lower === "1" || lower === "true") return "set";
  return "set";
}

export function normalizePathKind(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (
    text === "full" ||
    text === "full-login" ||
    text === "login" ||
    text === "login-shell" ||
    text === "full-login-path"
  ) {
    return "full-login";
  }
  if (
    text === "default-4" ||
    text === "default" ||
    text === "4-directory" ||
    text === "4-dir" ||
    text === "launchd-default"
  ) {
    return "default-4";
  }
  return text;
}

export function classifyPour(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const varCountRaw = t.varCount ?? t.variables ?? t.variableCount;
  const varCount = typeof varCountRaw === "number" ? varCountRaw : Number.NaN;
  const pathKind = normalizePathKind(t.pathKind || t.path || t.pathShape);
  const probedRaw = t.probedHitCount ?? t.probed ?? t.probedHits;
  const probedHitCount = typeof probedRaw === "number" ? probedRaw : Number.NaN;
  const marker = normalizeMarker(t.marker ?? t.markerFromZprofile ?? t.MARKER_FROM_ZPROFILE);
  const route = String(t.route || "").trim().toLowerCase();

  const fullPath = pathKind === "full-login";
  const defaultPath = pathKind === "default-4";
  const desktopSkim =
    route === "desktop" && fullPath && probedHitCount === 0 && marker !== "set";
  const intactRoute =
    INTACT_ROUTES.has(route) &&
    (probedHitCount === 8 || marker === "set") &&
    fullPath;
  const disclaimerMerge =
    route === "disclaimer" ||
    (t.disclaimerPathMerge === true) ||
    (Number.isFinite(varCount) &&
      varCount === 45 &&
      fullPath &&
      probedHitCount === 0 &&
      route !== "desktop" &&
      route !== "terminal");
  const mainControl = route === "main" && varCount === 14 && defaultPath && probedHitCount === 0;

  return {
    varCount: Number.isFinite(varCount) ? varCount : null,
    pathKind,
    probedHitCount: Number.isFinite(probedHitCount) ? probedHitCount : null,
    marker,
    route,
    fullPath,
    defaultPath,
    desktopSkim,
    intactRoute,
    disclaimerMerge,
    mainControl,
    spawnInherits: t.spawnInherits === true || route === "spawn"
  };
}

export function seedSkimmed() {
  return {
    seed: "skimmed",
    issue: 92515,
    skimmed: true,
    intact: false,
    route: "desktop",
    varCount: 45,
    pathKind: "full-login",
    probedHitCount: 0,
    marker: "unset",
    process: "claude",
    tree: ["claude", "disclaimer", "Claude", "launchd"],
    version: "Claude Desktop bundled CLI 2.1.258",
    compared: "Claude Code 2.1.260 terminal / VS Code ext 2.1.260 / Rider ACP / Zed external",
    platform: "macos",
    arch: "arm64",
    os: "macOS 26.6.2"
  };
}

export function seedIntact(route = "terminal") {
  const counts = { terminal: 67, vscode: 72, rider: 94, zed: 58 };
  const chosen = INTACT_ROUTES.has(route) ? route : "terminal";
  return {
    seed: "intact",
    issue: 92515,
    skimmed: false,
    intact: true,
    route: chosen,
    varCount: counts[chosen],
    pathKind: "full-login",
    probedHitCount: 8,
    marker: "set",
    process: "claude",
    version: chosen === "vscode" ? "VS Code extension 2.1.260" : "Claude Code 2.1.260",
    platform: "macos"
  };
}

export function scoreFields(probe = {}) {
  return classifyPour(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const pour = classifyPour(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #90074 Windows desktop stdio MCP ~16-var sanitized allowlist (missing ProgramData breaks ssh; missing COMPUTERNAME breaks Get-VM); #82890 Linux Desktop MCP subprocesses spawned without DISPLAY/XAUTHORITY, breaking OAuth browser login. Same class (desktop env handed to children) across platforms. This product is the macOS PATH-only decant. Primary stays #92515"
    );
    return {
      verdict: "cousins",
      reasons,
      skimmed: true,
      intact: false,
      chips: ["cousins", "skimmed"],
      pour
    };
  }

  if (
    seed === "intact" ||
    (t.intact === true && t.skimmed !== true) ||
    pour.intactRoute
  ) {
    const via = pour.route || "terminal";
    reasons.push(
      `Entire login-shell environment poured intact — ${via} route carries full PATH and ${pour.probedHitCount ?? 8}/8 probed credential/path vars (marker ${pour.marker || "set"}). Same starting launchd glass as Desktop; different pour. Seeded word is intact`
    );
    return {
      verdict: "intact",
      reasons,
      skimmed: false,
      intact: true,
      chips: ["intact"],
      pour
    };
  }

  if (seed === "path-only" || (t.pathOnly === true && seed === "path-only")) {
    reasons.push(
      "Desktop session has a fully repaired PATH but NONE of the other login-shell env vars. Tools resolve; credentials/paths they need are unset. Failures surface far from the cause (package restore 401, KeyError, wrong-scope query)"
    );
    return {
      verdict: "path-only",
      reasons,
      skimmed: true,
      intact: false,
      chips: ["path-only", "skimmed"],
      pour
    };
  }

  if (
    seed === "marker-unset" ||
    (pour.marker === "unset" && seed === "marker-unset")
  ) {
    reasons.push(
      "Repro: export MARKER_FROM_ZPROFILE=1 in ~/.zprofile (not ~/.zshrc). Desktop session: echo shows UNSET; PATH still contains zprofile-only dirs. Terminal-launched claude: marker set"
    );
    return {
      verdict: "marker-unset",
      reasons,
      skimmed: true,
      intact: false,
      chips: ["marker-unset", "skimmed"],
      pour
    };
  }

  if (
    seed === "probed-0-of-8" ||
    (pour.probedHitCount === 0 && seed === "probed-0-of-8")
  ) {
    reasons.push(
      "Variable counts (names only) + 8 probed credential/path vars from ~/.zprofile: Claude.app main 14 / 0/8; disclaimer 45 / 0/8; claude session (Desktop) 45 / 0/8; Terminal-launched claude 67 / 8/8. Desktop glass is probed-0-of-8"
    );
    return {
      verdict: "probed-0-of-8",
      reasons,
      skimmed: true,
      intact: false,
      chips: ["probed-0-of-8", "skimmed"],
      pour
    };
  }

  if (
    seed === "disclaimer-path-merge" ||
    t.disclaimerPathMerge === true ||
    (pour.disclaimerMerge && seed === "disclaimer-path-merge")
  ) {
    reasons.push(
      "Jump 14→45 at disclaimer is PATH merge only — nothing else from the login shell is kept. App already runs a login shell via the disclaimer helper; only PATH survives from it"
    );
    return {
      verdict: "disclaimer-path-merge",
      reasons,
      skimmed: true,
      intact: false,
      chips: ["disclaimer-path-merge", "skimmed"],
      pour
    };
  }

  if (seed === "spawn-inherits" || pour.spawnInherits) {
    reasons.push(
      "Anything the session spawns inherits the same stripped environment — hooks and stdio MCP servers included, since claude spawns those directly"
    );
    return {
      verdict: "spawn-inherits",
      reasons,
      skimmed: true,
      intact: false,
      chips: ["spawn-inherits", "skimmed"],
      pour
    };
  }

  if (
    t.skimmed === true ||
    seed === "skimmed" ||
    pour.desktopSkim ||
    (pour.route === "desktop" && pour.fullPath && pour.probedHitCount === 0)
  ) {
    reasons.push(
      "Claude Desktop passes only PATH from the login shell to Claude Code sessions; every other variable is dropped. Process tree: claude <- disclaimer <- Claude <- launchd. Suggested fix from the issue: in disclaimer, pass on the entire environment returned by the login shell it already runs, not PATH alone"
    );
    const chips = ["skimmed"];
    if (pour.fullPath && pour.probedHitCount === 0) chips.push("path-only");
    if (pour.marker === "unset") chips.push("marker-unset");
    if (pour.probedHitCount === 0) chips.push("probed-0-of-8");
    if (t.disclaimerPathMerge === true || pour.varCount === 45) chips.push("disclaimer-path-merge");
    if (t.spawnInherits === true) chips.push("spawn-inherits");
    return {
      verdict: "skimmed",
      reasons,
      skimmed: true,
      intact: false,
      chips: [...new Set(chips)],
      pour
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, skimmed: false, intact: true, chips: [seed], pour };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, skimmed: true, intact: false, chips: [seed], pour };
  }

  reasons.push("empty probe; idle cellar rack is skimmed — only PATH poured, lees left behind");
  return {
    verdict: "skimmed",
    reasons,
    skimmed: true,
    intact: false,
    chips: ["skimmed"],
    pour
  };
}

export const PROBED_SLOTS = DEFAULT_PROBED;
