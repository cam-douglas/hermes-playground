/**
 * Touchstone — black Lydian slab / gold-copper purity rub.
 *
 * Permission-validation should prove a script Write/Edit the same way
 * the main loop authenticates. Instead it fouls script-like and
 * extension-less targets with a permission-rule 401 "API key is
 * invalid.", also disabling Auto mode. Content-type extensions pass.
 * Desktop child session fails; headless `claude -p` writes .mjs.
 *
 * Encoded from anthropics/claude-code#92599 issue facts only.
 * Hypothesis (NON-BINDING): validation may put the OAuth access token
 * into x-api-key instead of Authorization: Bearer. Do not claim a
 * root cause in Claude Code source you have not seen.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 */

export const VERDICTS = [
  "fouled",
  "proved",
  "extension-gate",
  "false-401",
  "auto-disabled",
  "precedes-pretooluse",
  "desktop-session-only",
  "bypass-permissions",
  "auth-shape",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["proved"]);

export const ALARM = new Set([
  "fouled",
  "extension-gate",
  "false-401",
  "auto-disabled",
  "precedes-pretooluse",
  "desktop-session-only",
  "bypass-permissions",
  "auth-shape",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "fouled";
export const SEEDED_WORD = "proved";

export const FAIL_EXTENSIONS = [
  ".mjs",
  ".cjs",
  ".js",
  ".ts",
  ".py",
  ".ps1",
  ".sh",
  ".bat",
  ".jsonl",
  "extension-less",
  ".gitignore"
];

export const PASS_EXTENSIONS = [".md", ".txt", ".json", ".html", ".yaml"];

export const MEASURED = {
  issue: 92599,
  title:
    "Write/Edit denied by permission-validation with 401 \"API key is invalid\" — gated purely by file extension, and it also disables Auto mode (2.1.258)",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:auth", "area:permissions"],
  filed: "2026-09-07T05:40:11Z",
  updated: "2026-09-07T05:41:22Z",
  reporter: "gsegol11-ship-it",
  comments: 0,
  version: "2.1.258",
  desktop: "1.44121.4.0 (MSIX)",
  os: "Windows 11 Pro 26200",
  auth: "Claude Max OAuth",
  noApiKeyScopes: ["Process", "User", "Machine"],
  childSession: true,
  childSessionEnv: "CLAUDE_CODE_CHILD_SESSION=1",
  entrypoint: "claude-desktop",
  firstReportedOn: "2.1.219",
  firstReportedMessage: "OAuth access token has been revoked.",
  error:
    "Error during validation: Failed to authenticate. API Error: 401 {\"type\":\"error\",\"error\":{\"type\":\"authentication_error\",\"message\":\"API key is invalid.\"},\"request_id\":null}",
  denialKind: "permission-rule",
  requestId: null,
  failExtensions: FAIL_EXTENSIONS,
  passExtensions: PASS_EXTENSIONS,
  jsonPassesJsonlFails: true,
  gitignoreFails: true,
  notExecutableGate: true,
  authShapes: [
    {
      sent: "non-empty invalid x-api-key",
      response: "API key is invalid.",
      matchesFailingWrite: true
    },
    {
      sent: "missing/empty/whitespace x-api-key or empty authorization",
      response: "x-api-key header is required"
    },
    {
      sent: "Authorization: Bearer <invalid> or Bearer empty",
      response: "Invalid bearer token"
    }
  ],
  bypassPermissions: true,
  precedesPreToolUse: true,
  autoDisabled: true,
  errorStringAbsentFromCli: true,
  errorStringAbsentFromAsar: true,
  toolDenialKindHitsInBinary: 38,
  permissionRuleHitsInBinary: 21,
  headlessWriteMjsSucceeds: true,
  discriminator: "Desktop session",
  denials: 36,
  sessions: 16,
  hours: 36,
  contentTypeDenials: 0,
  classifierEnv: [
    "CLAUDE_PREVIEW_CLASSIFIER_FLOOR=1",
    "CLAUDE_CODE_CLASSIFIER_SUMMARY=0"
  ],
  classifierConfig: "tengu_bg_classifier_config",
  expected:
    "Either the validation call authenticates the way the main loop does, or a 401 there routes to re-authentication rather than surfacing as a per-tool permission denial.",
  actual:
    "Write/Edit denied by permission-validation with 401 API key is invalid, gated purely by file extension. Auto mode disabled. Fires under bypassPermissions. Precedes PreToolUse. Desktop child session only.",
  secondSeparableDefect:
    "Failed OAuth refresh wipes still-valid credentials when ANTHROPIC_BASE_URL is non-canonical. Cite in README, not the primary idle path."
};

export const COUSINS = [
  {
    id: 92518,
    state: "open",
    note: "Cite-only cousin. Catachresis: MCP insufficient_scope mislabeled as token expired. Same auth-wording neighbourhood, different defect. Primary stays #92599."
  },
  {
    id: 92582,
    state: "open",
    note: "Cite-only cousin. Chock: blockReadsOutsideWorkingDirectories ignores project/local additionalDirectories. Different defect. Primary stays #92599."
  }
];

export const NOT_THIS_BUG = [
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
  },
  {
    slug: "larum",
    issue: 92563,
    note: "Larum/#92563: task-notification with no assistant turn. Different defect."
  },
  {
    slug: "cringle",
    issue: 92542,
    note: "Cringle/#92542: deny unwrap 8-item wrapper bypass. Different defect."
  },
  {
    slug: "kerf",
    issue: 92539,
    note: "Kerf/#92539: Remove-Item spaced-path false positive. Different defect."
  },
  {
    slug: "demurrage",
    issue: 92548,
    note: "Demurrage/#92548: daemon chat process leak. Different defect."
  },
  {
    slug: "scarph",
    issue: 92543,
    note: "Scarph/#92543: Windows Bash -c shear. Different defect."
  },
  {
    slug: "plimsoll",
    issue: 92434,
    note: "Plimsoll/#92434: auto-compact load-line. Different defect."
  },
  {
    slug: "diopter",
    issue: 92524,
    note: "Diopter/#92524: per-session scratchpad defocus. Different defect."
  },
  {
    slug: "decant",
    issue: 92515,
    note: "Decant/#92515: login-shell env skim. Different defect."
  },
  {
    slug: "catachresis",
    issue: 92518,
    note: "Catachresis/#92518: cite-only cousin — MCP insufficient_scope mislabeled as token expired. Not the extension-gated Write/Edit 401."
  },
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: cite-only cousin — blockReadsOutsideWorkingDirectories ignores additionalDirectories."
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

export function scriptExtensionSignal(text = "") {
  return /\.mjs|\.cjs|\.js|\.ts|\.py|\.ps1|\.sh|\.bat|\.jsonl|extension-less|\.gitignore/i.test(
    String(text || "")
  );
}

export function contentExtensionSignal(text = "") {
  return /\.md|\.txt|\.json\b|\.html|\.yaml/i.test(String(text || ""));
}

export function false401Signal(text = "") {
  return /API key is invalid|Error during validation|authentication_error|permission-rule/i.test(
    String(text || "")
  );
}

export function invalidXApiKeyClass(text = "") {
  return /API key is invalid/i.test(String(text || ""));
}

export function missingXApiKeyClass(text = "") {
  return /x-api-key header is required/i.test(String(text || ""));
}

export function invalidBearerClass(text = "") {
  return /Invalid bearer token/i.test(String(text || ""));
}

export function desktopChildSignal(text = "") {
  return /CLAUDE_CODE_CHILD_SESSION|claude-desktop|Desktop child|Desktop session/i.test(
    String(text || "")
  );
}

export function headlessOkSignal(text = "") {
  return /claude -p|headless/i.test(String(text || ""));
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const failList = Array.isArray(t.failExtensions) ? t.failExtensions : MEASURED.failExtensions;
  const passList = Array.isArray(t.passExtensions) ? t.passExtensions : MEASURED.passExtensions;
  const scriptFail =
    boolish(t.scriptFail) ||
    boolish(t.extensionGate) ||
    (Array.isArray(t.failExtensions) && t.failExtensions.length > 0) ||
    scriptExtensionSignal(blob);
  const contentPass =
    boolish(t.contentPass) ||
    (Array.isArray(t.passExtensions) && t.passExtensions.length > 0) ||
    contentExtensionSignal(blob);
  const jsonVsJsonl =
    boolish(t.jsonPassesJsonlFails) ||
    (passList.includes(".json") && failList.includes(".jsonl"));
  const false401 =
    boolish(t.false401) ||
    t.denialKind === "permission-rule" ||
    t.toolDenialKind === "permission-rule" ||
    t.requestId === null ||
    t.request_id === null ||
    false401Signal(blob) ||
    invalidXApiKeyClass(t.error || t.message || "");
  const xApiKeyInvalid =
    boolish(t.xApiKeyInvalid) ||
    invalidXApiKeyClass(blob) ||
    invalidXApiKeyClass(t.error || t.message || t.authResponse || "");
  const autoOff =
    boolish(t.autoDisabled) ||
    boolish(t.autoModeDead) ||
    /Auto mode|auto mode/i.test(blob);
  const preHook =
    boolish(t.precedesPreToolUse) ||
    boolish(t.preHook) ||
    /PreToolUse|precedes PreToolUse|hook never ran/i.test(blob);
  const desktopOnly =
    boolish(t.desktopSessionOnly) ||
    boolish(t.desktopOnly) ||
    (desktopChildSignal(blob) && (boolish(t.headlessWriteMjsSucceeds) || headlessOkSignal(blob)));
  const bypass =
    boolish(t.bypassPermissions) ||
    /bypassPermissions/i.test(blob);
  const authShape =
    boolish(t.authShape) ||
    xApiKeyInvalid ||
    (Array.isArray(t.authShapes) && t.authShapes.length > 0);
  const provedClean =
    boolish(t.proved) ||
    boolish(t.authenticatesCorrectly) ||
    boolish(t.autoModeWorks);
  const fouledHit =
    boolish(t.fouled) ||
    (scriptFail && false401 && !boolish(t.proved));
  return {
    scriptFail,
    contentPass,
    jsonVsJsonl,
    false401,
    xApiKeyInvalid,
    autoOff,
    preHook,
    desktopOnly,
    bypass,
    authShape,
    provedClean,
    fouledHit,
    childSession: boolish(t.childSession) || desktopChildSignal(blob) || MEASURED.childSession
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const fouled =
    boolish(t.fouled) ||
    (print.fouledHit && !boolish(t.proved));
  const proved =
    boolish(t.proved) ||
    (print.provedClean && !boolish(t.fouled));
  return {
    fouled,
    proved,
    extensionGate: boolish(t.extensionGate) || (print.scriptFail && print.contentPass),
    false401: boolish(t.false401) || print.false401,
    autoDisabled: boolish(t.autoDisabled) || print.autoOff,
    precedesPretooluse: boolish(t.precedesPreToolUse) || boolish(t.precedesPretooluse) || print.preHook,
    desktopSessionOnly: boolish(t.desktopSessionOnly) || print.desktopOnly,
    bypassPermissions: boolish(t.bypassPermissions) || print.bypass,
    authShape: boolish(t.authShape) || print.authShape,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) && t.labels.includes("has repro")),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    version: t.version || MEASURED.version
  };
}

export function seedFouled() {
  return {
    seed: "fouled",
    issue: 92599,
    fouled: true,
    proved: false,
    extensionGate: true,
    false401: true,
    autoDisabled: true,
    precedesPreToolUse: true,
    desktopSessionOnly: true,
    bypassPermissions: true,
    authShape: true,
    failExtensions: FAIL_EXTENSIONS,
    passExtensions: PASS_EXTENSIONS,
    denialKind: "permission-rule",
    requestId: null,
    error: MEASURED.error,
    version: MEASURED.version,
    reporter: MEASURED.reporter
  };
}

export function seedProved() {
  return {
    seed: "proved",
    issue: 92599,
    fouled: false,
    proved: true,
    authenticatesCorrectly: true,
    autoModeWorks: true,
    scriptFail: false,
    false401: false,
    autoDisabled: false,
    version: MEASURED.version,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    fouled: seedFouled(),
    proved: seedProved(),
    "extension-gate": {
      seed: "extension-gate",
      issue: 92599,
      extensionGate: true,
      failExtensions: FAIL_EXTENSIONS,
      passExtensions: PASS_EXTENSIONS,
      jsonPassesJsonlFails: true
    },
    "false-401": {
      seed: "false-401",
      issue: 92599,
      false401: true,
      denialKind: "permission-rule",
      requestId: null,
      error: MEASURED.error
    },
    "auto-disabled": {
      seed: "auto-disabled",
      issue: 92599,
      autoDisabled: true
    },
    "precedes-pretooluse": {
      seed: "precedes-pretooluse",
      issue: 92599,
      precedesPreToolUse: true
    },
    "desktop-session-only": {
      seed: "desktop-session-only",
      issue: 92599,
      desktopSessionOnly: true,
      childSession: true,
      headlessWriteMjsSucceeds: true
    },
    "bypass-permissions": {
      seed: "bypass-permissions",
      issue: 92599,
      bypassPermissions: true
    },
    "auth-shape": {
      seed: "auth-shape",
      issue: 92599,
      authShape: true,
      xApiKeyInvalid: true,
      authShapes: MEASURED.authShapes
    },
    cousins: {
      seed: "cousins",
      issue: 92599,
      cousins: true,
      cousinsCiteOnly: [92518, 92582]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92599,
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
  const touchstone = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92518 Catachresis MCP insufficient_scope mislabeled as token expired; #92582 Chock blockReadsOutsideWorkingDirectories ignores project/local additionalDirectories. Not Bitts/#92573 worktree pool slot recycle. Not Seizing/#92586 EDR nlink SIGKILL. Not Gland/#92533. Not Larum/#92563. Not Cringle/#92542. Not Kerf/#92539. Not Demurrage/#92548. Not Scarph/#92543. Not Plimsoll/#92434. Not Diopter/#92524. Not Decant/#92515. Primary stays #92599"
    );
    return {
      verdict: "cousins",
      reasons,
      fouled: true,
      proved: false,
      chips: ["cousins", "fouled"],
      touchstone
    };
  }

  if (seed === "extension-gate" || (t.extensionGate === true && seed !== "fouled" && seed !== "proved")) {
    reasons.push(
      "extension-gate — identical body, scratchpad dir: FAIL every time .mjs .cjs .js .ts .py .ps1 .sh .bat .jsonl, extension-less; PASS .md .txt .json .html .yaml. .json passes while .jsonl fails; .gitignore fails — not is-executable, behaves like an allowlist of known-safe extensions"
    );
    return {
      verdict: "extension-gate",
      reasons,
      fouled: true,
      proved: false,
      chips: ["extension-gate", "fouled"],
      touchstone
    };
  }

  if (seed === "false-401" || (t.false401 === true && seed !== "fouled" && seed !== "proved")) {
    reasons.push(
      "false-401 — Error during validation: Failed to authenticate. API Error: 401 API key is invalid. Transcript toolDenialKind: permission-rule, request_id: null. Message matches the non-empty invalid x-api-key class"
    );
    return {
      verdict: "false-401",
      reasons,
      fouled: true,
      proved: false,
      chips: ["false-401", "fouled"],
      touchstone
    };
  }

  if (seed === "auto-disabled" || (t.autoDisabled === true && seed !== "fouled" && seed !== "proved")) {
    reasons.push(
      "auto-disabled — Auto cannot approve anything in these sessions because the approval path depends on the same failing validation call. One bug, two visible surfaces"
    );
    return {
      verdict: "auto-disabled",
      reasons,
      fouled: true,
      proved: false,
      chips: ["auto-disabled", "fouled"],
      touchstone
    };
  }

  if (
    seed === "precedes-pretooluse" ||
    ((t.precedesPreToolUse === true || t.precedesPretooluse === true) &&
      seed !== "fouled" &&
      seed !== "proved")
  ) {
    reasons.push(
      "precedes-pretooluse — targets that passed validation were then stopped by a local PreToolUse hook; script targets returned 401 and the hook never ran. Failure is above the hook layer"
    );
    return {
      verdict: "precedes-pretooluse",
      reasons,
      fouled: true,
      proved: false,
      chips: ["precedes-pretooluse", "fouled"],
      touchstone
    };
  }

  if (
    seed === "desktop-session-only" ||
    (t.desktopSessionOnly === true && seed !== "fouled" && seed !== "proved")
  ) {
    reasons.push(
      "desktop-session-only — delegated child session CLAUDE_CODE_CHILD_SESSION=1, CLAUDE_CODE_ENTRYPOINT=claude-desktop fails Write/Edit on script extensions; same account+binary succeeds via headless claude -p writing .mjs. Discriminator is Desktop session, not account/version/extension"
    );
    return {
      verdict: "desktop-session-only",
      reasons,
      fouled: true,
      proved: false,
      chips: ["desktop-session-only", "fouled"],
      touchstone
    };
  }

  if (
    seed === "bypass-permissions" ||
    (t.bypassPermissions === true && seed !== "fouled" && seed !== "proved")
  ) {
    reasons.push(
      "bypass-permissions — fires under bypassPermissions. Independently reproduced in a second session. Permission mode is not a factor"
    );
    return {
      verdict: "bypass-permissions",
      reasons,
      fouled: true,
      proved: false,
      chips: ["bypass-permissions", "fouled"],
      touchstone
    };
  }

  if (seed === "auth-shape" || (t.authShape === true && seed !== "fouled" && seed !== "proved")) {
    reasons.push(
      "auth-shape — seven /v1/messages shapes: non-empty invalid x-api-key → exactly API key is invalid. (matches failing write); missing/empty x-api-key → x-api-key header is required; Bearer invalid/empty → Invalid bearer token. Leading hypothesis (unproven, non-binding): validation puts OAuth access token into x-api-key instead of Authorization: Bearer"
    );
    return {
      verdict: "auth-shape",
      reasons,
      fouled: true,
      proved: false,
      chips: ["auth-shape", "fouled"],
      touchstone
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "fouled" && seed !== "proved")) {
    reasons.push(
      "has-clear-repro — #92599 labeled has repro + platform:windows + area:auth + area:permissions; 14 targets one turn identical body; 36 denials / 16 sessions / 36 hours; 0 landed on content-type targets"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      fouled: true,
      proved: false,
      chips: ["has-clear-repro", "fouled"],
      touchstone
    };
  }

  if (
    seed === "proved" ||
    (t.proved === true && t.fouled !== true && seed !== "fouled") ||
    (touchstone.proved && !touchstone.fouled && seed !== "fouled")
  ) {
    reasons.push(
      "touchstone already proved — validation authenticates correctly for script extensions; Auto mode works; PreToolUse can run. Seeded word is proved"
    );
    return {
      verdict: "proved",
      reasons,
      fouled: false,
      proved: true,
      chips: ["proved"],
      touchstone
    };
  }

  if (t.fouled === true || seed === "fouled" || (touchstone.fouled && !touchstone.proved)) {
    reasons.push(
      "A touchstone that fouls script Write/Edit streaks with a permission-rule 401 API key is invalid is not proved. Score fouled or admit proved. Gated by extension; Auto mode dead; Desktop child session; fires under bypassPermissions; precedes PreToolUse"
    );
    const chips = ["fouled"];
    if (t.extensionGate === true || touchstone.extensionGate) chips.push("extension-gate");
    if (t.false401 === true || touchstone.false401) chips.push("false-401");
    if (t.autoDisabled === true || touchstone.autoDisabled) chips.push("auto-disabled");
    if (t.precedesPreToolUse === true || touchstone.precedesPretooluse) chips.push("precedes-pretooluse");
    if (t.desktopSessionOnly === true || touchstone.desktopSessionOnly) chips.push("desktop-session-only");
    if (t.bypassPermissions === true || touchstone.bypassPermissions) chips.push("bypass-permissions");
    if (t.authShape === true || touchstone.authShape) chips.push("auth-shape");
    return {
      verdict: "fouled",
      reasons,
      fouled: true,
      proved: false,
      chips: [...new Set(chips)],
      touchstone
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, fouled: false, proved: true, chips: [seed], touchstone };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      fouled: true,
      proved: false,
      chips: [seed],
      touchstone
    };
  }

  reasons.push(
    "empty probe; idle touchstone bench is fouled — permission-validation denies script/extension-less Write/Edit with permission-rule 401 API key is invalid; Auto mode dead; Desktop child session"
  );
  return {
    verdict: "fouled",
    reasons,
    fouled: true,
    proved: false,
    chips: ["fouled"],
    touchstone
  };
}
