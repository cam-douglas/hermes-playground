/**
 * Eidolon — glass-plate double / rpm staging bay.
 *
 * The real security-guidance hook exists in the plugin cache.
 * The per-session staged copy under local-agent-mode-sessions/.../rpm/
 * intermittently vanishes (ENOENT). The runtime keeps summoning the
 * phantom on every turn as a fake "Background security review found issues".
 *
 * Encoded from anthropics/claude-code#92601 issue facts only.
 * Hypothesis (NON-BINDING): hook invocation may race per-session rpm
 * staging, then frame infrastructure ENOENT as a security finding.
 * Do not claim a root cause in Claude Code source you have not seen.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 */

export const VERDICTS = [
  "haunted",
  "staged",
  "enoent-staging",
  "infinite-retry",
  "synthetic-security-notification",
  "restart-uncleared",
  "real-cache-intact",
  "manifest-lists-plugin",
  "disable-plugin-stops-loop",
  "multi-session-flood",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["staged"]);

export const ALARM = new Set([
  "haunted",
  "enoent-staging",
  "infinite-retry",
  "synthetic-security-notification",
  "restart-uncleared",
  "real-cache-intact",
  "manifest-lists-plugin",
  "disable-plugin-stops-loop",
  "multi-session-flood",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "haunted";
export const SEEDED_WORD = "staged";

export const MEASURED = {
  issue: 92601,
  title:
    "security-guidance plugin hook fails with ENOENT in local-agent-mode-sessions staging, causing infinite retry/notification loop",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:hooks", "area:plugins"],
  filed: "2026-09-07T06:15:18Z",
  updated: "2026-09-07T06:16:20Z",
  reporter: "Dennisgobuild360",
  comments: 0,
  os: "Windows 11 Home Single Language 10.0.26200",
  app: "Claude Code desktop",
  autoUpdatesChannel: "latest",
  plugin: "security-guidance@claude-plugins-official",
  marketplace: "claude-plugins-official",
  pluginVersion: "2.0.7",
  pluginId: "plugin_01YBNfaNwQztYsnUydt8m47G",
  hookFile: "security_reminder_hook.py",
  error:
    "C:\\Users\\<user>\\AppData\\Local\\Python\\pythoncore-3.14-64\\python.exe: can't open file 'C:\\Users\\<user>\\AppData\\Roaming\\Claude\\local-agent-mode-sessions\\<session-id>\\<subsession-id>\\rpm\\plugin_01YBNfaNwQztYsnUydt8m47G\\hooks\\security_reminder_hook.py': [Errno 2] No such file or directory",
  stagedPath:
    "...\\local-agent-mode-sessions\\<session-id>\\<subsession-id>\\rpm\\plugin_01YBNfaNwQztYsnUydt8m47G\\hooks\\security_reminder_hook.py",
  cachePath:
    "~/.claude/plugins/cache/claude-plugins-official/security-guidance/2.0.7/hooks/security_reminder_hook.py",
  manifestPath: ".../rpm/manifest.json",
  notificationKind: "task-notification",
  notificationSummary: "Background security review found issues",
  idleTurns: ["Idle.", "(no change)"],
  realCacheIntact: true,
  manifestListsPlugin: true,
  stagedCopySometimesExisted: true,
  raceIntermittent: true,
  restartDoesNotClear: true,
  restartsTried: 3,
  rpmRegeneratedOnRestart: true,
  multiSession: true,
  someSessionsRepeats: "45+",
  disablePluginStopsLoop: true,
  otherPluginsInvolved: false,
  expected:
    "Per-session rpm staging stays complete; the hook runs once from a real path; infrastructure ENOENT is not framed as a security finding.",
  actual:
    "Staged hook path ENOENT; infinite background task-notification loop; restart does not clear; only disabling/uninstalling the plugin stops it."
};

export const COUSINS = [
  {
    id: 92563,
    state: "open",
    note: "Cite-only cousin. Larum: completed background <task-notification> never schedules a turn. Different: notice lands but no turn; Eidolon's notice floods turns. Primary stays #92601."
  },
  {
    id: 90329,
    state: "open",
    note: "Cite-only cousin. Desktop plugin store syncs but never downloads. Plugins surface cousin. Different defect. Primary stays #92601."
  },
  {
    id: 74715,
    state: "open",
    note: "Cite-only cousin. Chrome Always-allow persisted as once. Different surface. Primary stays #92601."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: task-notification with no assistant turn. Different: notice lands but no turn; Eidolon floods turns."
  },
  {
    slug: "touchstone",
    issue: 92599,
    note: "Touchstone/#92599: extension-gated permission-validation 401. Different defect."
  },
  {
    slug: "bitts",
    issue: 92573,
    note: "Bitts/#92573: worktree pool slot recycle mid-session data-loss. Different defect."
  },
  {
    slug: "seizing",
    issue: 92586,
    note: "Seizing/#92586: EDR nlink hard-link false-trigger Bash kill. Different defect."
  },
  {
    slug: "gland",
    issue: 92533,
    note: "Gland/#92533: Bash function-hook strips worktree isolation. Different defect."
  }
];

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function asText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(asText).join("\n");
  }
  return String(value);
}

export function extractText(probe = {}) {
  return asText(probe);
}

export function enoentSignal(text = "") {
  return /ENOENT|No such file or directory|can't open file|Errno 2/i.test(String(text || ""));
}

export function stagedPathSignal(text = "") {
  return /local-agent-mode-sessions|security_reminder_hook\.py|plugin_01YBNfaNwQztYsnUydt8m47G|\\rpm\\/i.test(
    String(text || "")
  );
}

export function syntheticNoticeSignal(text = "") {
  return /Background security review found issues|task-notification/i.test(String(text || ""));
}

export function idleTurnSignal(text = "") {
  return /Idle\.|\(no change\)/i.test(String(text || ""));
}

export function cacheIntactSignal(text = "") {
  return /plugins\/cache\/claude-plugins-official\/security-guidance\/2\.0\.7|real install is intact/i.test(
    String(text || "")
  );
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const enoent =
    boolish(t.enoent) ||
    boolish(t.enoentStaging) ||
    enoentSignal(blob) ||
    enoentSignal(t.error || t.message || "");
  const stagedMissing =
    boolish(t.stagedMissing) ||
    boolish(t.phantom) ||
    (stagedPathSignal(blob) && enoent);
  const infiniteRetry =
    boolish(t.infiniteRetry) ||
    boolish(t.loop) ||
    /infinite|retries indefinitely|repeat pattern|45\+/i.test(blob);
  const syntheticNotice =
    boolish(t.syntheticSecurityNotification) ||
    boolish(t.syntheticNotice) ||
    syntheticNoticeSignal(blob) ||
    t.notificationSummary === MEASURED.notificationSummary;
  const restartUncleared =
    boolish(t.restartUncleared) ||
    boolish(t.restartDoesNotClear) ||
    /Restarting the Claude Code|restart.*not|does not clear/i.test(blob);
  const cacheIntact =
    boolish(t.realCacheIntact) ||
    boolish(t.cacheIntact) ||
    cacheIntactSignal(blob);
  const manifestOk =
    boolish(t.manifestListsPlugin) ||
    boolish(t.manifestOk) ||
    /manifest\.json|correctly lists/i.test(blob);
  const disableStops =
    boolish(t.disablePluginStopsLoop) ||
    boolish(t.disableStops) ||
    /Disabling \/ removing|settings\.json/i.test(blob);
  const multiFlood =
    boolish(t.multiSessionFlood) ||
    boolish(t.multiSession) ||
    /multiple concurrent session/i.test(blob);
  const stagedClean =
    boolish(t.staged) ||
    boolish(t.stagingComplete) ||
    boolish(t.hookRunsOnce);
  const hauntedHit =
    boolish(t.haunted) ||
    (enoent && syntheticNotice && !boolish(t.staged));
  return {
    enoent,
    stagedMissing,
    infiniteRetry,
    syntheticNotice,
    restartUncleared,
    cacheIntact,
    manifestOk,
    disableStops,
    multiFlood,
    stagedClean,
    hauntedHit,
    idleTurns: idleTurnSignal(blob)
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const haunted =
    boolish(t.haunted) ||
    (print.hauntedHit && !boolish(t.staged));
  const staged =
    boolish(t.staged) ||
    (print.stagedClean && !boolish(t.haunted));
  return {
    haunted,
    staged,
    enoentStaging: boolish(t.enoentStaging) || print.enoent,
    infiniteRetry: boolish(t.infiniteRetry) || print.infiniteRetry,
    syntheticSecurityNotification:
      boolish(t.syntheticSecurityNotification) || print.syntheticNotice,
    restartUncleared: boolish(t.restartUncleared) || print.restartUncleared,
    realCacheIntact: boolish(t.realCacheIntact) || print.cacheIntact,
    manifestListsPlugin: boolish(t.manifestListsPlugin) || print.manifestOk,
    disablePluginStopsLoop: boolish(t.disablePluginStopsLoop) || print.disableStops,
    multiSessionFlood: boolish(t.multiSessionFlood) || print.multiFlood,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) && t.labels.includes("has repro")),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    pluginVersion: t.pluginVersion || MEASURED.pluginVersion
  };
}

export function seedHaunted() {
  return {
    seed: "haunted",
    issue: 92601,
    haunted: true,
    staged: false,
    enoentStaging: true,
    infiniteRetry: true,
    syntheticSecurityNotification: true,
    restartUncleared: true,
    realCacheIntact: true,
    manifestListsPlugin: true,
    disablePluginStopsLoop: true,
    multiSessionFlood: true,
    error: MEASURED.error,
    notificationSummary: MEASURED.notificationSummary,
    plugin: MEASURED.plugin,
    pluginVersion: MEASURED.pluginVersion,
    pluginId: MEASURED.pluginId,
    reporter: MEASURED.reporter
  };
}

export function seedStaged() {
  return {
    seed: "staged",
    issue: 92601,
    haunted: false,
    staged: true,
    stagingComplete: true,
    hookRunsOnce: true,
    enoent: false,
    syntheticSecurityNotification: false,
    infiniteRetry: false,
    plugin: MEASURED.plugin,
    pluginVersion: MEASURED.pluginVersion,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    haunted: seedHaunted(),
    staged: seedStaged(),
    "enoent-staging": {
      seed: "enoent-staging",
      issue: 92601,
      enoentStaging: true,
      error: MEASURED.error,
      stagedPath: MEASURED.stagedPath
    },
    "infinite-retry": {
      seed: "infinite-retry",
      issue: 92601,
      infiniteRetry: true,
      someSessionsRepeats: MEASURED.someSessionsRepeats
    },
    "synthetic-security-notification": {
      seed: "synthetic-security-notification",
      issue: 92601,
      syntheticSecurityNotification: true,
      notificationKind: MEASURED.notificationKind,
      notificationSummary: MEASURED.notificationSummary
    },
    "restart-uncleared": {
      seed: "restart-uncleared",
      issue: 92601,
      restartUncleared: true,
      restartsTried: MEASURED.restartsTried
    },
    "real-cache-intact": {
      seed: "real-cache-intact",
      issue: 92601,
      realCacheIntact: true,
      cachePath: MEASURED.cachePath
    },
    "manifest-lists-plugin": {
      seed: "manifest-lists-plugin",
      issue: 92601,
      manifestListsPlugin: true,
      pluginId: MEASURED.pluginId
    },
    "disable-plugin-stops-loop": {
      seed: "disable-plugin-stops-loop",
      issue: 92601,
      disablePluginStopsLoop: true
    },
    "multi-session-flood": {
      seed: "multi-session-flood",
      issue: 92601,
      multiSessionFlood: true,
      someSessionsRepeats: MEASURED.someSessionsRepeats
    },
    cousins: {
      seed: "cousins",
      issue: 92601,
      cousins: true,
      cousinsCiteOnly: [92563, 90329, 74715]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92601,
      hasClearRepro: true,
      labels: MEASURED.labels
    }
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function analyze(input = {}) {
  const classified = classify(input);
  const decided = decide(input);
  return {
    ...classified,
    verdict: decided.verdict,
    reasons: decided.reasons,
    chips: decided.chips
  };
}

export function score(input = {}) {
  return decide(input);
}

export function handle(input = {}) {
  const probe =
    typeof input === "string"
      ? (() => {
          try {
            return JSON.parse(input);
          } catch {
            return {};
          }
        })()
      : input;
  return decide(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const eidolon = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92563 Larum task-notification never schedules a turn (notice lands but no turn; Eidolon floods turns); #90329 Desktop plugin store syncs but never downloads; #74715 Chrome Always-allow persisted as once. Not Touchstone/#92599 extension-gated 401. Not Bitts/#92573 pool recycle. Not Seizing/#92586 EDR nlink SIGKILL. Not Gland/#92533. Primary stays #92601"
    );
    return {
      verdict: "cousins",
      reasons,
      haunted: true,
      staged: false,
      chips: ["cousins", "haunted"],
      eidolon
    };
  }

  if (seed === "enoent-staging" || (t.enoentStaging === true && seed !== "haunted" && seed !== "staged")) {
    reasons.push(
      "enoent-staging — python can't open staged path ...\\local-agent-mode-sessions\\<session>\\<subsession>\\rpm\\plugin_01YBNfaNwQztYsnUydt8m47G\\hooks\\security_reminder_hook.py ENOENT [Errno 2] No such file or directory"
    );
    return {
      verdict: "enoent-staging",
      reasons,
      haunted: true,
      staged: false,
      chips: ["enoent-staging", "haunted"],
      eidolon
    };
  }

  if (seed === "infinite-retry" || (t.infiniteRetry === true && seed !== "haunted" && seed !== "staged")) {
    reasons.push(
      "infinite-retry — failure retries indefinitely rather than surfacing once; Idle. / (no change) turns; some concurrent sessions reaching 45+ repeats"
    );
    return {
      verdict: "infinite-retry",
      reasons,
      haunted: true,
      staged: false,
      chips: ["infinite-retry", "haunted"],
      eidolon
    };
  }

  if (
    seed === "synthetic-security-notification" ||
    (t.syntheticSecurityNotification === true && seed !== "haunted" && seed !== "staged")
  ) {
    reasons.push(
      "synthetic-security-notification — delivered repeatedly as background <task-notification> with summary \"Background security review found issues\"; infrastructure ENOENT framed as a security finding"
    );
    return {
      verdict: "synthetic-security-notification",
      reasons,
      haunted: true,
      staged: false,
      chips: ["synthetic-security-notification", "haunted"],
      eidolon
    };
  }

  if (
    seed === "restart-uncleared" ||
    (t.restartUncleared === true && seed !== "haunted" && seed !== "staged")
  ) {
    reasons.push(
      "restart-uncleared — Restarting the Claude Code app three times did not stop the loop; rpm/ staging folder regenerated fresh each time, same failure reproduced immediately"
    );
    return {
      verdict: "restart-uncleared",
      reasons,
      haunted: true,
      staged: false,
      chips: ["restart-uncleared", "haunted"],
      eidolon
    };
  }

  if (
    seed === "real-cache-intact" ||
    (t.realCacheIntact === true && seed !== "haunted" && seed !== "staged")
  ) {
    reasons.push(
      "real-cache-intact — real install intact at ~/.claude/plugins/cache/claude-plugins-official/security-guidance/2.0.7/hooks/security_reminder_hook.py; exists and is well-formed"
    );
    return {
      verdict: "real-cache-intact",
      reasons,
      haunted: true,
      staged: false,
      chips: ["real-cache-intact", "haunted"],
      eidolon
    };
  }

  if (
    seed === "manifest-lists-plugin" ||
    (t.manifestListsPlugin === true && seed !== "haunted" && seed !== "staged")
  ) {
    reasons.push(
      "manifest-lists-plugin — per-session staged manifest (.../rpm/manifest.json) correctly lists plugin_01YBNfaNwQztYsnUydt8m47G as security-guidance; staged copy sometimes existed when checked (race/intermittent)"
    );
    return {
      verdict: "manifest-lists-plugin",
      reasons,
      haunted: true,
      staged: false,
      chips: ["manifest-lists-plugin", "haunted"],
      eidolon
    };
  }

  if (
    seed === "disable-plugin-stops-loop" ||
    (t.disablePluginStopsLoop === true && seed !== "haunted" && seed !== "staged")
  ) {
    reasons.push(
      "disable-plugin-stops-loop — Disabling / removing security-guidance (Settings → Plugins, or \"security-guidance@claude-plugins-official\": false in ~/.claude/settings.json) followed by an app restart stopped the loop; no other plugin was involved"
    );
    return {
      verdict: "disable-plugin-stops-loop",
      reasons,
      haunted: true,
      staged: false,
      chips: ["disable-plugin-stops-loop", "haunted"],
      eidolon
    };
  }

  if (
    seed === "multi-session-flood" ||
    (t.multiSessionFlood === true && seed !== "haunted" && seed !== "staged")
  ) {
    reasons.push(
      "multi-session-flood — multiple concurrent session windows on the same project independently stuck in the same repeat pattern (some reaching 45+ repeats); each showing a stop control but no way to prevent the loop from resuming"
    );
    return {
      verdict: "multi-session-flood",
      reasons,
      haunted: true,
      staged: false,
      chips: ["multi-session-flood", "haunted"],
      eidolon
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "haunted" && seed !== "staged")) {
    reasons.push(
      "has-clear-repro — #92601 labeled has repro + platform:windows + area:hooks + area:plugins; exact ENOENT path; Idle. / (no change); task-notification flood; disable plugin stops it"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      haunted: true,
      staged: false,
      chips: ["has-clear-repro", "haunted"],
      eidolon
    };
  }

  if (
    seed === "staged" ||
    (t.staged === true && t.haunted !== true && seed !== "haunted") ||
    (eidolon.staged && !eidolon.haunted && seed !== "haunted")
  ) {
    reasons.push(
      "eidolon already staged — per-session rpm staging complete and stable; hook runs once from real path; no synthetic security-finding flood. Seeded word is staged"
    );
    return {
      verdict: "staged",
      reasons,
      haunted: false,
      staged: true,
      chips: ["staged"],
      eidolon
    };
  }

  if (t.haunted === true || seed === "haunted" || (eidolon.haunted && !eidolon.staged)) {
    reasons.push(
      "An eidolon that vanishes the staged hook path (ENOENT) so every turn summons a fake Background security review found issues loop is not staged. Score haunted or admit staged. Restart does not clear; only disabling the plugin stops it"
    );
    const chips = ["haunted"];
    if (t.enoentStaging === true || eidolon.enoentStaging) chips.push("enoent-staging");
    if (t.infiniteRetry === true || eidolon.infiniteRetry) chips.push("infinite-retry");
    if (t.syntheticSecurityNotification === true || eidolon.syntheticSecurityNotification) {
      chips.push("synthetic-security-notification");
    }
    if (t.restartUncleared === true || eidolon.restartUncleared) chips.push("restart-uncleared");
    if (t.realCacheIntact === true || eidolon.realCacheIntact) chips.push("real-cache-intact");
    if (t.manifestListsPlugin === true || eidolon.manifestListsPlugin) chips.push("manifest-lists-plugin");
    if (t.disablePluginStopsLoop === true || eidolon.disablePluginStopsLoop) {
      chips.push("disable-plugin-stops-loop");
    }
    if (t.multiSessionFlood === true || eidolon.multiSessionFlood) chips.push("multi-session-flood");
    return {
      verdict: "haunted",
      reasons,
      haunted: true,
      staged: false,
      chips: [...new Set(chips)],
      eidolon
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, haunted: false, staged: true, chips: [seed], eidolon };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      haunted: true,
      staged: false,
      chips: [seed],
      eidolon
    };
  }

  reasons.push(
    "empty probe; idle eidolon bay is haunted — staged hook path ENOENT; infinite background task-notification loop; restart does not clear"
  );
  return {
    verdict: "haunted",
    reasons,
    haunted: true,
    staged: false,
    chips: ["haunted"],
    eidolon
  };
}
