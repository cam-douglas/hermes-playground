/**
 * Ordo — sacristan's missal / kalendar desk for a real Claude Code
 * failure class: plugin-provided slash commands fail to resolve in
 * headless `-p` mode on 2.1.251, returning Unknown command with
 * num_turns: 0. Built-ins still work. The process exits 0 with
 * is_error: false, so unattended wrappers treat it as success and
 * store the error string as the analysis result. Same plugins, same
 * config, same cwd work on 2.1.250. Bisect isolated the version.
 *
 * A written plugin command is not a hold. Score the missal or admit
 * appointed.
 *
 * Primary #90515: filed 2026-08-29. Every plugin slash command fails
 * in headless `-p` on 2.1.251. Built-ins (`/context`) still work.
 * Plugin state was verified healthy: enabled in settings.json,
 * installed_plugins.json entry, cache path with commands/*.md.
 * Node 20 and 24 both fail on 2.1.251 and both work on 2.1.250.
 *
 * Shape (cite as shape, not a new primary) — two-index / silent-unknown:
 *   #37862 — /reload-plugins rebuilds model-facing skills, not the
 *            `/` command parser index.
 *   #41842 — plugin skills/ not slash-registered; Skill tool works.
 *   #17271 — plugin skill missing from slash.
 *   #64669 — official plugin slash commands Unknown.
 *   #8430  — agent-sdk custom slash commands: is_error false, empty
 *            result, CLI works.
 * Cross-ecosystem:
 *   openai/codex#14459 — custom prompts on disk; desktop `/` popup
 *            only shows builtins.
 *   openai/codex#15980 — custom prompts "Not available in app-server
 *            TUI yet".
 *
 * Verdicts: appointed | unknown | silent | hollow | builtin
 *           | missing | loud | stale | resolved | cache-ok
 * Idle word is appointed (plugin command resolved and ran, or the
 * empty missal). NEVER use ordo / missal / office / rubric as idle.
 * NEVER reuse cinched, gauged, stamped, overrun, pratique, wound,
 * bound, stilled, stabled, drained, flat, fit, spoilt, laid,
 * unlinked, tight, banked, roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld, sterling, home, valid, dry,
 * sealed, quiet, seised.
 *
 * Slack alarm on silent / hollow / unknown.
 * Linear ticket on silent (unattended missal miss).
 * GitHub ordo-ledger of scored offices on every score.
 *
 * Why this is not a clone:
 * NOT Larder (plugin *store freeze* / installed_plugins.json vs empty
 *     cache). Ordo assumes the store and cache look healthy.
 * NOT Tappet (fired hook is not a seated injection).
 * NOT Reed (MCP connected vs registered).
 * NOT Assay (parsed call vs delivered arguments).
 * NOT Cinch (silent partial folder mounts).
 * NOT Sprag (boot-cached MCP failure).
 * NOT Visa (OAuth missing resource).
 * Different problem: the HEADLESS MISSAL — did `-p` actually resolve
 * the plugin office, and did the wrapper notice the failure (exit /
 * is_error), vs a written enabledPlugins + cache file that looks
 * healthy. Different UI: liturgical parchment. Cream page, red
 * rubrics, black appointed offices, kalendar of the day's hours.
 * Different idle: appointed.
 * Do NOT ship leftover woodworking, millimetre-sliders, or near-clones.
 */

export const VERDICTS = Object.freeze([
  "appointed",
  "unknown",
  "silent",
  "hollow",
  "builtin",
  "missing",
  "loud",
  "stale",
  "resolved",
  "cache-ok",
]);
export const IDLE_WORD = "appointed";
export const SLACK_VERDICTS = Object.freeze(["silent", "hollow", "unknown"]);
export const LINEAR_VERDICTS = Object.freeze(["silent"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "ordo",
  "missal",
  "office",
  "rubric",
  "kalendar",
  "cinch",
  "cinched",
  "mount",
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
  "tappet",
  "reed",
  "assay",
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

function asNum(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function isUnknownResult(result) {
  return /Unknown command\s*:/i.test(asText(result));
}

export function emptyOffice() {
  return {
    session: "",
    source: "",
    issue: null,
    scored: false,
    command: "",
    result: "",
    numTurns: null,
    isError: null,
    exitCode: null,
    enabled: null,
    installed: null,
    cached: null,
    commandFile: "",
    resolved: null,
    storedAsResult: false,
    isBuiltin: false,
    builtinWorks: false,
    version: "",
  };
}

export function emptyAction(session = "appointed-1") {
  return {
    action: "score",
    session,
    office: emptyOffice(),
  };
}

export function cloneOffice(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyOffice();
  const nested =
    (src.office && typeof src.office === "object" && src.office) ||
    (src.missal && typeof src.missal === "object" && src.missal) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.pack && typeof src.pack === "object" && src.pack) ||
    (src.trace && typeof src.trace === "object" && src.trace) ||
    src;
  const headless = nested.headless && typeof nested.headless === "object" ? nested.headless : {};
  const claim = nested.claim && typeof nested.claim === "object" ? nested.claim : {};
  return {
    ...emptyOffice(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    source: asText(nested.source ?? src.source),
    issue: asIssue(nested.issue ?? src.issue),
    scored: asBool(nested.scored ?? src.scored, false),
    command: asText(nested.command ?? src.command ?? nested.slash ?? headless.command),
    result: asText(nested.result ?? src.result ?? headless.result),
    numTurns: asNum(nested.numTurns ?? nested.num_turns ?? src.numTurns ?? src.num_turns ?? headless.num_turns ?? headless.numTurns),
    isError: asBool(nested.isError ?? nested.is_error ?? src.isError ?? src.is_error ?? headless.is_error ?? headless.isError, null),
    exitCode: asNum(nested.exitCode ?? nested.exit_code ?? src.exitCode ?? src.exit_code ?? headless.exitCode ?? headless.exit_code),
    enabled: asBool(nested.enabled ?? src.enabled ?? claim.enabled ?? nested.enabledPlugins, null),
    installed: asBool(nested.installed ?? src.installed ?? claim.installed, null),
    cached: asBool(nested.cached ?? src.cached ?? claim.cached, null),
    commandFile: asText(nested.commandFile ?? nested.command_file ?? src.commandFile ?? claim.commandFile ?? claim.path),
    resolved: asBool(nested.resolved ?? src.resolved ?? nested.parserHasOffice, null),
    storedAsResult: asBool(nested.storedAsResult ?? nested.stored_as_result ?? src.storedAsResult, false) === true,
    isBuiltin: asBool(nested.isBuiltin ?? nested.is_builtin ?? src.isBuiltin, false) === true,
    builtinWorks: asBool(nested.builtinWorks ?? nested.builtin_works ?? src.builtinWorks, false) === true,
    version: asText(nested.version ?? src.version ?? nested.cliVersion),
  };
}

export function analyze(office = {}) {
  const next = cloneOffice(office);
  const unknown = isUnknownResult(next.result);
  const numTurns = next.numTurns;
  const exit0 = next.exitCode === 0;
  const isErrorFalse = next.isError === false;
  const isErrorTrue = next.isError === true;
  const cacheHealthy = Boolean(
    (next.enabled === true || next.installed === true || next.cached === true || next.commandFile) &&
      (next.cached === true || next.commandFile),
  );
  const filesHealthy =
    next.enabled === true && next.installed === true && (next.cached === true || Boolean(next.commandFile));
  const pluginAbsent =
    Boolean(next.command) &&
    !next.isBuiltin &&
    next.enabled !== true &&
    next.installed !== true &&
    next.cached !== true &&
    !next.commandFile;
  const ran = typeof numTurns === "number" && numTurns > 0 && !unknown;
  return {
    unknown,
    numTurns,
    exit0,
    isErrorFalse,
    isErrorTrue,
    cacheHealthy,
    filesHealthy,
    pluginAbsent,
    ran,
    silentTrio: unknown && isErrorFalse && exit0,
    command: next.command,
    result: next.result,
    commandFile: next.commandFile,
    resolved: next.resolved,
    storedAsResult: next.storedAsResult,
    isBuiltin: next.isBuiltin,
    builtinWorks: next.builtinWorks,
    enabled: next.enabled,
    installed: next.installed,
    cached: next.cached,
    version: next.version,
    exitCode: next.exitCode,
    isError: next.isError,
  };
}

export function isIdle(office = {}) {
  const next = cloneOffice(office);
  return (
    !next.command &&
    !next.result &&
    next.numTurns == null &&
    next.isError == null &&
    next.exitCode == null &&
    next.enabled == null &&
    next.installed == null &&
    next.cached == null &&
    !next.commandFile &&
    next.resolved == null &&
    !next.storedAsResult &&
    !next.isBuiltin &&
    !next.builtinWorks &&
    !next.version
  );
}

/**
 * First match wins. Idle appointed is first. Classes stay distinguishable:
 * a written plugin command is not a hold. The #90515 silent trio
 * (Unknown command + is_error false + exit 0) is silent, not appointed,
 * even when enabledPlugins + cache look healthy. Admit does not lie.
 */
export function classify(office = {}) {
  const next = cloneOffice(office);
  if (isIdle(next)) return "appointed";
  const facts = analyze(next);

  if (facts.silentTrio && !next.storedAsResult) return "silent";
  if (next.storedAsResult && next.numTurns === 0) return "hollow";
  if (facts.unknown && facts.isErrorTrue) return "loud";
  if (facts.unknown) return "unknown";
  if (facts.pluginAbsent) return "missing";
  if ((next.cached === true || next.commandFile) && next.resolved === false && !facts.unknown) {
    return "stale";
  }
  if (next.isBuiltin && (facts.ran || next.builtinWorks)) return "builtin";
  if (facts.filesHealthy && next.resolved !== true && next.result === "" && next.numTurns == null) {
    return "cache-ok";
  }
  if (next.resolved === true && !facts.ran) return "resolved";
  if (facts.ran) return "appointed";
  return "appointed";
}

export function feedOf(office = {}, verdict = "") {
  const kind = verdict || classify(office);
  if (kind === "silent") {
    return "● Silent · Unknown command · is_error false · exit 0 · primary #90515";
  }
  if (kind === "hollow") {
    return "● Hollow · num_turns 0 · error string stored as the analysis result";
  }
  if (kind === "loud") {
    return "● Loud · Unknown command · is_error true · the honest fail";
  }
  if (kind === "unknown") {
    return "● Unknown · plugin office did not resolve in the headless missal";
  }
  if (kind === "missing") {
    return "● Missing · plugin not actually enabled or cached";
  }
  if (kind === "stale") {
    return "● Stale · cache file exists · headless resolver does not see the office";
  }
  if (kind === "builtin") {
    return "● Builtin · a built-in still works, proving -p is alive";
  }
  if (kind === "cache-ok") {
    return "● Cache-ok · files on disk look healthy · a written cache is not a hold";
  }
  if (kind === "resolved") {
    return "● Resolved · the parser has the office";
  }
  return "● Appointed · plugin command resolved and ran · idle word is appointed";
}

export function reasonsOf(office = {}, verdict = "") {
  const next = cloneOffice(office);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.command
      ? `office ${next.command} · num_turns ${facts.numTurns ?? "—"} · is_error ${facts.isError ?? "—"} · exit ${facts.exitCode ?? "—"}`
      : "no office on the missal",
  );
  if (facts.unknown) reasons.push(`result is Unknown command: ${next.result}`);
  if (facts.silentTrio) {
    reasons.push("silent trio: Unknown command + is_error false + exit 0 · wrappers treat this as success");
  }
  if (next.storedAsResult) {
    reasons.push("storedAsResult: unattended wrapper stored the error string as the analysis");
  }
  if (next.enabled === true) reasons.push("enabled in settings.json");
  if (next.installed === true) reasons.push("installed_plugins.json has an entry");
  if (next.cached === true || next.commandFile) {
    reasons.push(`cache/command file ${next.commandFile || "present"} · a written cache is not a hold`);
  }
  if (facts.pluginAbsent) reasons.push("plugin not enabled, not installed, not cached");
  if (next.resolved === true) reasons.push("parser has the office");
  if (next.resolved === false) reasons.push("headless resolver does not see the office");
  if (next.isBuiltin) reasons.push("built-in control office");
  if (next.version) reasons.push(`cli ${next.version}`);
  reasons.push("a written plugin command is not a hold");
  reasons.push(
    "NOT Larder (plugin-store freeze) / Tappet (hook injection) / Reed (MCP registry) / Assay (tool-arg furnace) / Cinch (silent partial mounts) / Sprag (boot-cached MCP) / Visa (OAuth resource) / leftover woodworking / millimetre-slider",
  );
  if (kind === "appointed") {
    reasons.push("plugin command resolved and ran; idle word is appointed");
  }
  if (kind === "silent") {
    reasons.push(
      "PRIMARY #90515: every plugin-provided slash command fails in headless -p on 2.1.251. Unknown command, num_turns 0, is_error false, exit 0. Built-ins still work. Plugin enabled + installed + cached. Same cwd works on 2.1.250. Node 20 and 24 both fail on 2.1.251.",
    );
  }
  if (kind === "hollow") {
    reasons.push(
      "num_turns 0 and the error string was stored as the analysis result. Unattended wrappers treat exit 0 as success.",
    );
  }
  if (kind === "loud") {
    reasons.push("Unknown command with is_error true. The honest fail. No silent success.");
  }
  if (kind === "unknown") {
    reasons.push("Unknown command without the silent-success envelope and without is_error true.");
  }
  if (kind === "missing") {
    reasons.push("Plugin is not actually enabled or cached. The written office was never in the missal.");
  }
  if (kind === "stale") {
    reasons.push(
      "Cache / command file exists but the headless resolver does not see it. Two-index family: #37862 / #41842 / #17271.",
    );
  }
  if (kind === "builtin") {
    reasons.push("A built-in still works, proving -p is alive. #90515: /context works on the same broken 2.1.251.");
  }
  if (kind === "cache-ok") {
    reasons.push("Files on disk look healthy. enabledPlugins + installed_plugins.json + commands/*.md is not a hold.");
  }
  if (kind === "resolved") {
    reasons.push("The `/` command parser has the office. Resolution is not the same as a completed run.");
  }
  return reasons;
}

export function verdictOf(office = {}) {
  return classify(office);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function appointedOf(office = {}, verdict = "") {
  return (verdict || classify(office)) === "appointed";
}

export function silentOf(office = {}, verdict = "") {
  return (verdict || classify(office)) === "silent";
}

export function hollowOf(office = {}, verdict = "") {
  return (verdict || classify(office)) === "hollow";
}

export function score(office = {}) {
  const next = cloneOffice(office);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    command: facts.command,
    result: facts.result,
    appointed: appointedOf(next, verdict),
    silent: silentOf(next, verdict),
    hollow: hollowOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    unknown: facts.unknown,
    numTurns: facts.numTurns,
    isError: facts.isError,
    exitCode: facts.exitCode,
    silentTrio: facts.silentTrio,
    filesHealthy: facts.filesHealthy,
    pluginAbsent: facts.pluginAbsent,
    storedAsResult: facts.storedAsResult,
    resolved: facts.resolved,
    isBuiltin: facts.isBuiltin,
    office: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const officeSrc =
    src.office || src.missal || src.probe || src.pack || payload.office || payload.missal || payload.probe;
  const office = cloneOffice(
    officeSrc && typeof officeSrc === "object" ? { ...officeSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !office.session) office.session = src.session;
  if (typeof payload.session === "string" && !office.session) office.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? office.session ?? ""),
    office,
    issue: src.issue ?? payload.issue ?? office.issue ?? null,
    source: src.source ?? payload.source ?? office.source ?? "",
  };
}

function officeResult(verdict, office, action, extras = {}) {
  const next = cloneOffice(office);
  const scored = score(next);
  return {
    ok: true,
    product: "ordo",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    appointed: scored.appointed,
    silent: scored.silent,
    hollow: scored.hollow,
    missalAppointed: verdict === "appointed",
    missalUnknown: verdict === "unknown",
    missalSilent: verdict === "silent",
    missalHollow: verdict === "hollow",
    missalBuiltin: verdict === "builtin",
    missalMissing: verdict === "missing",
    missalLoud: verdict === "loud",
    missalStale: verdict === "stale",
    missalResolved: verdict === "resolved",
    missalCacheOk: verdict === "cache-ok",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    command: scored.command,
    result: scored.result,
    unknown: scored.unknown,
    numTurns: scored.numTurns,
    isError: scored.isError,
    exitCode: scored.exitCode,
    silentTrio: scored.silentTrio,
    filesHealthy: scored.filesHealthy,
    pluginAbsent: scored.pluginAbsent,
    storedAsResult: scored.storedAsResult,
    resolved: scored.resolved,
    isBuiltin: scored.isBuiltin,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    office: next,
    ...extras,
  };
}

function seedOffice(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    office: {
      ...emptyOffice(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      command: asText(extras.command),
      result: asText(extras.result),
      numTurns: extras.numTurns !== undefined ? extras.numTurns : extras.num_turns !== undefined ? extras.num_turns : null,
      isError: extras.isError !== undefined ? extras.isError : extras.is_error !== undefined ? extras.is_error : null,
      exitCode: extras.exitCode !== undefined ? extras.exitCode : extras.exit_code !== undefined ? extras.exit_code : null,
      enabled: extras.enabled !== undefined ? extras.enabled : null,
      installed: extras.installed !== undefined ? extras.installed : null,
      cached: extras.cached !== undefined ? extras.cached : null,
      commandFile: asText(extras.commandFile),
      resolved: extras.resolved !== undefined ? extras.resolved : null,
      storedAsResult: Boolean(extras.storedAsResult),
      isBuiltin: Boolean(extras.isBuiltin),
      builtinWorks: Boolean(extras.builtinWorks),
      version: asText(extras.version),
    },
  };
}

const PLUGIN_CMD = "/ppp:analyze-incident";
const PLUGIN_UNKNOWN = "Unknown command: /ppp:analyze-incident";
const CACHE_PATH = "~/.claude/plugins/cache/sssss-plugins/ppp/0.13.0/commands/analyze-incident.md";
const OFFICIAL_CMD = "/pr-review-toolkit:review-pr";
const OFFICIAL_UNKNOWN = "Unknown command: /pr-review-toolkit:review-pr";

/** Idle / bail. Missal not scored as a live run. */
export function seedAppointed() {
  return seedOffice("appointed", "sacristy", {
    session: "appointed",
    issue: null,
    scored: true,
  });
}

/**
 * Control: same plugin command appointed on 2.1.250.
 * num_turns > 0, result is not Unknown command.
 */
export function seedControl() {
  return seedOffice("appointed", "interactive", {
    session: "90515-control",
    issue: null,
    command: PLUGIN_CMD,
    result: "Incident analysis complete. Timeline, causal graph, and next office.",
    numTurns: 4,
    isError: false,
    exitCode: 0,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
    resolved: true,
    version: "2.1.250",
  });
}

/**
 * #90515 silent-unknown: plugin command fails in -p on 2.1.251.
 * Unknown command, num_turns 0, is_error false, exit 0.
 * Plugin enabled + installed + cached. Built-ins still work.
 */
export function seedSilent() {
  return seedOffice(90515, "anthropics/claude-code#90515", {
    session: "90515-silent",
    command: PLUGIN_CMD,
    result: PLUGIN_UNKNOWN,
    numTurns: 0,
    isError: false,
    exitCode: 0,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
    resolved: false,
    version: "2.1.251",
    builtinWorks: true,
  });
}

/** Official marketplace plugin, same silent envelope. */
export function seedOfficial() {
  return seedOffice(90515, "anthropics/claude-code#90515", {
    session: "90515-official",
    command: OFFICIAL_CMD,
    result: OFFICIAL_UNKNOWN,
    numTurns: 0,
    isError: false,
    exitCode: 0,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: "~/.claude/plugins/cache/claude-plugins-official/pr-review-toolkit/commands/review-pr.md",
    resolved: false,
    version: "2.1.251",
  });
}

/** Wrapper stored the error string as the analysis result. */
export function seedHollow() {
  return seedOffice(90515, "anthropics/claude-code#90515", {
    session: "90515-hollow",
    command: PLUGIN_CMD,
    result: PLUGIN_UNKNOWN,
    numTurns: 0,
    isError: false,
    storedAsResult: true,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
    resolved: false,
    version: "2.1.251",
  });
}

/** Unknown command without the silent-success envelope. */
export function seedUnknown() {
  return seedOffice(64669, "anthropics/claude-code#64669", {
    session: "64669-unknown",
    command: OFFICIAL_CMD,
    result: OFFICIAL_UNKNOWN,
    numTurns: 0,
    enabled: true,
    installed: true,
    cached: true,
  });
}

/** Honest fail: unknown AND is_error true. */
export function seedLoud() {
  return seedOffice(90515, "anthropics/claude-code#90515", {
    session: "90515-loud",
    issue: null,
    command: PLUGIN_CMD,
    result: PLUGIN_UNKNOWN,
    numTurns: 0,
    isError: true,
    exitCode: 1,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
    resolved: false,
    version: "2.1.251",
  });
}

/** Plugin not actually enabled or cached. */
export function seedMissing() {
  return seedOffice(90515, "paste", {
    session: "90515-missing",
    issue: null,
    command: PLUGIN_CMD,
    enabled: false,
    installed: false,
    cached: false,
  });
}

/** Cache/command file exists; headless resolver does not see it. */
export function seedStale() {
  return seedOffice(37862, "anthropics/claude-code#37862", {
    session: "37862-stale",
    command: PLUGIN_CMD,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
    resolved: false,
  });
}

/** Built-in /context still works, proving -p is alive. */
export function seedBuiltin() {
  return seedOffice(90515, "anthropics/claude-code#90515", {
    session: "90515-builtin",
    issue: null,
    command: "/context",
    result: "Context window and loaded skills.",
    numTurns: 1,
    isError: false,
    exitCode: 0,
    isBuiltin: true,
    builtinWorks: true,
    version: "2.1.251",
  });
}

/** Parser has the office; a run is not yet scored. */
export function seedResolved() {
  return seedOffice(90515, "paste", {
    session: "90515-resolved",
    issue: null,
    command: PLUGIN_CMD,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
    resolved: true,
  });
}

/** Files on disk look healthy. A written cache is not a hold. */
export function seedCacheOk() {
  return seedOffice(90515, "paste", {
    session: "90515-cache-ok",
    issue: null,
    command: PLUGIN_CMD,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: CACHE_PATH,
  });
}

/** Full #90515 silent-unknown used as the restore-to-silent ticket. */
export function seed90515() {
  return seedSilent();
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyOffice();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return cloneOffice({ command: parsed[0] });
      if (parsed && typeof parsed === "object") {
        return cloneOffice(parsed);
      }
    } catch {
      /* fall through to prose */
    }
  }
  const silent =
    /Unknown command/i.test(text) &&
    (/is_error["'\s:]*false/i.test(text) || /is_error false/i.test(text)) &&
    (/exit(s| code)?\s*0/i.test(text) || /"exit(Code)?"\s*:\s*0/i.test(text) || /num_turns["'\s:]*0/i.test(text));
  const hollow = /stored (the )?(error|string) as (the )?(analysis )?result|recorded the step as successful/i.test(text);
  const loud = /is_error["'\s:]*true/i.test(text) && /Unknown command/i.test(text);
  const unknown = /Unknown command/i.test(text);
  const missing = /not actually enabled|not cached|plugin not/i.test(text);
  const stale = /resolver does not see|two-index|reload-plugins|not slash-registered/i.test(text);
  const builtin = /\/context still works|built-in still works|proving -p is alive/i.test(text);
  const cacheOk = /files on disk look healthy|cache-ok|commands\/\*\.md/i.test(text);
  const resolved = /parser has the office|slash-registered/i.test(text) && !stale;
  const appointed = /resolved and ran|2\.1\.250|num_turns["'\s:]*[1-9]/i.test(text) && !unknown;
  if (silent && !hollow) {
    return { ...seedSilent().office, session: "paste-silent", source: "anthropics/claude-code#90515", issue: 90515, scored: true };
  }
  if (hollow) {
    return { ...seedHollow().office, session: "paste-hollow", source: "anthropics/claude-code#90515", issue: 90515, scored: true };
  }
  if (loud) {
    return { ...seedLoud().office, session: "paste-loud", source: "paste", scored: true };
  }
  if (unknown) {
    return { ...seedUnknown().office, session: "paste-unknown", source: "paste", scored: true };
  }
  if (missing) {
    return { ...seedMissing().office, session: "paste-missing", source: "paste", scored: true };
  }
  if (stale) {
    return { ...seedStale().office, session: "paste-stale", source: "anthropics/claude-code#37862", issue: 37862, scored: true };
  }
  if (builtin) {
    return { ...seedBuiltin().office, session: "paste-builtin", source: "anthropics/claude-code#90515", scored: true };
  }
  if (cacheOk) {
    return { ...seedCacheOk().office, session: "paste-cache-ok", source: "paste", scored: true };
  }
  if (resolved) {
    return { ...seedResolved().office, session: "paste-resolved", source: "paste", scored: true };
  }
  if (appointed) {
    return { ...seedControl().office, session: "paste-appointed", source: "paste", scored: true };
  }
  return { ...emptyOffice(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  appointed: seedAppointed,
  control: seedControl,
  silent: seedSilent,
  90515: seed90515,
  "90515-silent": seedSilent,
  official: seedOfficial,
  hollow: seedHollow,
  unknown: seedUnknown,
  64669: seedUnknown,
  loud: seedLoud,
  missing: seedMissing,
  stale: seedStale,
  37862: seedStale,
  builtin: seedBuiltin,
  resolved: seedResolved,
  "cache-ok": seedCacheOk,
  cacheok: seedCacheOk,
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
  let office = cloneOffice(action.office);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "appointed" || verb === "still" || verb === "rest" || verb === "reset") {
    return officeResult("appointed", emptyOffice(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "interactive") {
    office = seedControl().office;
    return officeResult(classify(office), office, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "silent" || verb === "incident") {
    office = seedSilent().office;
    return officeResult(classify(office), office, { ...action, action: verb === "restore" ? "restore" : verb });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    office = { ...office, scored: true };
    return officeResult(classify(office), office, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "missal") {
    office = { ...office, scored: true };
    return officeResult(classify(office), office, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "missal" ? "score" : verb,
    });
  }

  office = { ...office, scored: true };
  return officeResult(classify(office), office, action);
}
