/**
 * Rushlight — iron sconce / rush-pith candle atelier.
 *
 * A rushlight should stay lit across sessions of the same Claude Code
 * version once the user Allows the macOS SystemPolicyAppData prompt.
 * Instead the desktop-bundled worker's TCC grant is stored
 * session-scoped — tccd logs "Session scoped auth is invalid for
 * client" — so the same version 2.1.258 re-prompts every new session.
 *
 * Encoded from anthropics/claude-code#92784 issue facts only.
 * Hypothesis (NON-BINDING): worker spawned as a child of the Electron
 * desktop via the disclaimer helper gets a session-scoped tccd grant
 * rather than a persistently-authorizable app identity; plus startup
 * enumeration of unrelated ~/Library folders raises
 * SystemPolicyAppData. Invite verify against issue text only — do not
 * invent unread source claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "lit",
  "snuffed",
  "tenured",
  "session-scoped-auth-invalid",
  "same-version-reprompt",
  "startup-appdata-enumeration",
  "fda-desktop-ineffective",
  "child-worker-identity",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["lit", "tenured"]);

export const ALARM = new Set([
  "snuffed",
  "session-scoped-auth-invalid",
  "same-version-reprompt",
  "startup-appdata-enumeration",
  "fda-desktop-ineffective",
  "child-worker-identity",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "lit";
export const SEEDED_WORD = "snuffed";
export const ADMIT_WORD = "tenured";

export const MEASURED = {
  issue: 92784,
  title:
    "macOS: \"access data from other apps\" (SystemPolicyAppData) prompt recurs every session on the SAME version — grant stored session-scoped (desktop-bundled worker)",
  state: "open",
  labels: ["bug", "has repro", "platform:macos", "area:packaging", "area:desktop"],
  filed: "2026-09-08T05:47:57Z",
  reporter: "PMWang",
  claude: "Claude Code 2.1.258 as desktop app's bundled worker (NOT native ~/.local, NOT npm)",
  os: "macOS 26.5.2 (build 25F84) Apple Silicon",
  bundleId: "com.anthropic.claude-code",
  responsiblePath:
    "~/Library/Application Support/Claude/claude-code/2.1.258/claude.app/Contents/MacOS/claude",
  signature: "Developer ID Application: Anthropic PBC (Q6L2SF6YDW), hardened runtime",
  tccService: "kTCCServiceSystemPolicyAppData",
  tccdInvalid: "Session scoped auth is invalid for client",
  tccdPrompting: "AUTHREQ_PROMPTING subject Sub:{com.anthropic.claude-code}",
  afterAllow: {
    authValue: 2,
    authReason: 2,
    event: "TCCDEvent type=Create Bundle ID com.anthropic.claude-code"
  },
  laterSameVersionMinutes: 18,
  version: "2.1.258",
  promptsObserved: 4,
  daysObserved: 2,
  kernelDenials: [
    "Mail",
    "Safari",
    "AddressBook",
    "CallHistoryDB",
    "MobileSync",
    "HomeKit",
    "Messages",
    "FaceTime",
    "Suggestions",
    "Weather",
    "Containers"
  ],
  fdaDesktopPath: "/Applications/Claude.app",
  fdaHelps: false,
  twoBugs: [
    "AppData grant stored session-scoped not persistent (child of Electron via disclaimer helper)",
    "worker enumerates unrelated ~/Library app-data at startup"
  ],
  suggestedFixes: [
    "stable persistently-authorizable identity",
    "stop startup enumeration",
    "escape hatch env/config per #58952"
  ],
  surface:
    "desktop-bundled worker TCC SystemPolicyAppData grant stored session-scoped; same version 2.1.258 re-prompts every session",
  expected:
    "A rushlight should stay lit across sessions of the same Claude Code version once the user Allows the macOS SystemPolicyAppData prompt",
  actual:
    "tccd stores the grant session-scoped; Session scoped auth is invalid for client; same version 2.1.258 re-prompts every new session",
  hypothesis:
    "NON-BINDING: worker spawned as child of Electron desktop via disclaimer helper gets session-scoped tccd grant rather than persistently-authorizable app identity; plus startup enumeration of unrelated Library folders raises SystemPolicyAppData. Invite verify against issue text only."
};

export const SCONCE_LEDGER = [
  {
    id: "wick",
    role: "rush pith / TCC AppData grant",
    tally: "session-scoped then invalid",
    note: "Allow writes AUTHREQ_RESULT authValue=2 authReason=2 and TCCDEvent type=Create, then the next session of 2.1.258 treats the grant as session-scoped and invalid"
  },
  {
    id: "sconce",
    role: "iron sconce / child worker identity",
    tally: "com.anthropic.claude-code under desktop Electron",
    note: "responsible path is the versioned bundled worker, not /Applications/Claude.app; Full Disk Access on the desktop app does not help"
  },
  {
    id: "tenured",
    role: "tenure / admit",
    tally: "grant durable across sessions of the same version",
    note: "hypothetical: once Allowed, the rush stays lit for later sessions of the same version 2.1.258"
  }
];

export const PROMPT_TABLE = [
  { when: "session start", version: "2.1.258", note: "AUTHREQ_CTX + Session scoped auth is invalid for client" },
  { when: "~18 minutes later", version: "2.1.258", note: "same version prompts again" },
  { when: "4 prompts / 2 days", version: "2.1.258", note: "proves not only version-path churn" }
];

export const COUSINS = [
  {
    id: 63130,
    state: "open",
    title: "TCC popup recurring v2.1.153",
    note: "cite-only — OPEN; this report adds same-version session-scoped evidence"
  },
  {
    id: 66216,
    state: "closed",
    title: "native installer recurring TCC; FDA on ClaudeCode.app no help",
    note: "cite-only — CLOSED; FDA on desktop app no help is consistent"
  },
  {
    id: 36832,
    state: "closed",
    title: "node TCC every launch",
    note: "cite-only — CLOSED; those reports attribute recurrence to version-path churn"
  },
  {
    id: 36675,
    state: "closed",
    title: "CLI binary version-named dialog",
    note: "cite-only — CLOSED"
  },
  {
    id: 41297,
    state: "closed",
    title: "TCC on every update + Apple Music",
    note: "cite-only — CLOSED"
  },
  {
    id: 59608,
    state: "closed",
    title: "version number in TCC dialog, re-prompts on update",
    note: "cite-only — CLOSED"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "clepsydra",
    issue: 92776,
    note: "Clepsydra/#92776 already shipped — OTel main-loop meter. Do not touch."
  },
  {
    slug: "letoff",
    issue: 92771,
    note: "Letoff/#92771 already shipped — libuv Shift+Enter flatten. Do not touch."
  },
  {
    slug: "ptybind",
    issue: 92757,
    note: "Ptybind/#92757 already shipped — Ctrl+G ConPTY mux editor keys. Do not touch."
  },
  {
    slug: "dunnage",
    issue: 92746,
    note: "Dunnage/#92746 already shipped — RemoteTrigger list cursor ignore. Do not touch."
  },
  {
    slug: "setoff",
    issue: 92750,
    note: "Setoff/#92750 already shipped — subagent MEMORY.md + skill_listing set-off. Do not touch."
  },
  {
    slug: "espagnolette",
    issue: 92694,
    note: "Espagnolette/#92694 already shipped. Do not touch."
  },
  {
    slug: "portage",
    issue: 92734,
    note: "Portage/#92734 backup only — teleport. Do not auto-pick."
  },
  {
    slug: "clevis",
    issue: 92769,
    note: "Clevis/#92769 backup only — disable-model-invocation. Do not auto-pick."
  },
  {
    slug: "cadet",
    issue: 92761,
    note: "Cadet/#92761 backup only — worktree plugin first-row. Do not auto-pick."
  }
];

const CHIP_REASONS = {
  lit: "HOLD: sconce is lit — TCC AppData grant persists across sessions of the same version. Score snuffed or admit tenured",
  snuffed:
    "ALARM: rush snuffed; session-scoped grant evaporates; tccd Session scoped auth is invalid for client; same version 2.1.258 re-prompts every session. Score snuffed or admit tenured",
  tenured:
    "sconce already tenured — grant durable across sessions of the same version once Allowed. Seeded admit word is tenured",
  "session-scoped-auth-invalid":
    "session-scoped-auth-invalid — tccd AUTHREQ_CTX service=kTCCServiceSystemPolicyAppData; Session scoped auth is invalid for client; AUTHREQ_PROMPTING subject Sub:{com.anthropic.claude-code}",
  "same-version-reprompt":
    "same-version-reprompt — after Allow, AUTHREQ_RESULT authValue=2 authReason=2 and TCCDEvent type=Create Bundle ID com.anthropic.claude-code; ~18 minutes later SAME version 2.1.258 prompts again; 4 prompts across 2 days, all on 2.1.258 (proves NOT only version-path churn)",
  "startup-appdata-enumeration":
    "startup-appdata-enumeration — kernel denials at startup: Mail, Safari, AddressBook, CallHistoryDB, MobileSync, HomeKit, Messages, FaceTime, Suggestions, Weather, Containers; worker enumerates unrelated ~/Library app-data",
  "fda-desktop-ineffective":
    "fda-desktop-ineffective — Full Disk Access on /Applications/Claude.app does NOT help; responsible process is child com.anthropic.claude-code worker (consistent with #66216)",
  "child-worker-identity":
    "child-worker-identity — desktop-bundled worker (NOT native ~/.local, NOT npm); path ~/Library/Application Support/Claude/claude-code/2.1.258/claude.app/Contents/MacOS/claude; bundle com.anthropic.claude-code; signed Developer ID Application: Anthropic PBC (Q6L2SF6YDW), hardened runtime; two independent bugs: session-scoped grant as child of Electron via disclaimer helper, plus startup enumeration",
  cousins:
    "cite-only neighbourhood — #63130 OPEN TCC popup recurring v2.1.153; #66216 CLOSED native installer recurring TCC; #36832 CLOSED node TCC every launch; #36675 CLOSED CLI binary version-named dialog; #41297 CLOSED TCC on every update + Apple Music; #59608 CLOSED version number in TCC dialog. This report adds same-version session-scoped evidence those attribute to version-path churn. Primary stays #92784",
  "has-clear-repro":
    "has-clear-repro — #92784 is labeled has repro: macOS 26.5.2 (build 25F84) Apple Silicon; Claude Code 2.1.258 desktop-bundled worker; filed 2026-09-08T05:47:57Z; labels bug, has repro, platform:macos, area:packaging, area:desktop"
};

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

export function litSignal(text = "") {
  return /idle sconce is lit|pin idle lit|TCC AppData grant persists|persists across sessions of the same version/i.test(
    String(text || "")
  );
}

export function snuffedSignal(text = "") {
  return /rush snuffed|session-scoped grant evaporates|Session scoped auth is invalid|re-prompts every session/i.test(
    String(text || "")
  );
}

export function tenuredSignal(text = "") {
  return /already tenured|grant durable across sessions|stay lit for later sessions/i.test(
    String(text || "")
  );
}

export function sessionScopedSignal(text = "") {
  return /session-scoped-auth-invalid|AUTHREQ_CTX|kTCCServiceSystemPolicyAppData|AUTHREQ_PROMPTING/i.test(
    String(text || "")
  );
}

export function sameVersionRepromptSignal(text = "") {
  return /same-version-reprompt|18 minutes later|4 prompts across 2 days|NOT only version-path churn/i.test(
    String(text || "")
  );
}

export function startupEnumerationSignal(text = "") {
  return /startup-appdata-enumeration|CallHistoryDB|enumerates unrelated|kernel denials at startup/i.test(
    String(text || "")
  );
}

export function fdaIneffectiveSignal(text = "") {
  return /fda-desktop-ineffective|Full Disk Access on \/Applications\/Claude\.app|does NOT help/i.test(
    String(text || "")
  );
}

export function childWorkerSignal(text = "") {
  return /child-worker-identity|disclaimer helper|NOT native ~\/\.local|Q6L2SF6YDW/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    lit: litSignal(blob),
    snuffed: snuffedSignal(blob),
    tenured: tenuredSignal(blob),
    sessionScoped: sessionScopedSignal(blob),
    sameVersionReprompt: sameVersionRepromptSignal(blob),
    startupEnumeration: startupEnumerationSignal(blob),
    fdaIneffective: fdaIneffectiveSignal(blob),
    childWorker: childWorkerSignal(blob)
  };
}

export function rushWasSnuffed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.snuffed) || boolish(t.rushSnuffed) || boolish(t.grantEvaporated)) {
    return true;
  }
  return snuffedSignal(extractText(t));
}

export function sessionScopedInvalid(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.sessionScopedAuthInvalid) || boolish(t.sessionScoped)) {
    return true;
  }
  return sessionScopedSignal(extractText(t));
}

export function sconceTenured(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.sconceTenured) || (boolish(t.tenured) && !boolish(t.snuffed))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const snuffedHit =
    boolish(t.snuffed) || (rushWasSnuffed(t) && !boolish(t.tenured) && !boolish(t.lit));
  const tenuredClean = boolish(t.tenured) || sconceTenured(t);
  const litHit = boolish(t.lit) || (hits.lit && !snuffedHit && !tenuredClean);
  return {
    snuffedHit,
    tenuredClean,
    litHit,
    sessionScoped: boolish(t.sessionScopedAuthInvalid) || hits.sessionScoped,
    sameVersionReprompt: boolish(t.sameVersionReprompt) || hits.sameVersionReprompt,
    startupEnumeration: boolish(t.startupAppdataEnumeration) || hits.startupEnumeration,
    fdaIneffective: boolish(t.fdaDesktopIneffective) || hits.fdaIneffective,
    childWorker: boolish(t.childWorkerIdentity) || hits.childWorker,
    sconceTenured: sconceTenured(t),
    rushSnuffed: snuffedHit,
    rushLit: tenuredClean && !snuffedHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const snuffed = boolish(t.snuffed) || (print.snuffedHit && !boolish(t.tenured) && !boolish(t.lit));
  const tenured = boolish(t.tenured) || (print.tenuredClean && !boolish(t.snuffed));
  const lit = boolish(t.lit) || (print.litHit && !snuffed && !tenured);
  return {
    lit,
    snuffed,
    tenured,
    sessionScopedAuthInvalid: boolish(t.sessionScopedAuthInvalid) || print.sessionScoped,
    sameVersionReprompt: boolish(t.sameVersionReprompt) || print.sameVersionReprompt,
    startupAppdataEnumeration: boolish(t.startupAppdataEnumeration) || print.startupEnumeration,
    fdaDesktopIneffective: boolish(t.fdaDesktopIneffective) || print.fdaIneffective,
    childWorkerIdentity: boolish(t.childWorkerIdentity) || print.childWorker,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    claude: t.claude || MEASURED.claude,
    os: t.os || MEASURED.os
  };
}

export function seedLit() {
  return {
    seed: "lit",
    issue: 92784,
    lit: true,
    snuffed: false,
    tenured: false,
    outputText: "lit; idle sconce — TCC AppData grant persists across sessions of the same version"
  };
}

export function seedSnuffed() {
  return {
    seed: "snuffed",
    issue: 92784,
    lit: false,
    snuffed: true,
    tenured: false,
    rushSnuffed: true,
    grantEvaporated: true,
    sessionScopedAuthInvalid: true,
    sameVersionReprompt: true,
    startupAppdataEnumeration: true,
    fdaDesktopIneffective: true,
    childWorkerIdentity: true,
    hasClearRepro: true,
    outputText:
      "snuffed; rush snuffed — session-scoped grant evaporates; Session scoped auth is invalid; re-prompts every session",
    claude: MEASURED.claude
  };
}

export function seedTenured() {
  return {
    seed: "tenured",
    issue: 92784,
    lit: false,
    snuffed: false,
    tenured: true,
    sconceTenured: true,
    grantDurable: true,
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    lit: seedLit(),
    snuffed: seedSnuffed(),
    tenured: seedTenured(),
    "session-scoped-auth-invalid": {
      seed: "session-scoped-auth-invalid",
      issue: 92784,
      sessionScopedAuthInvalid: true
    },
    "same-version-reprompt": {
      seed: "same-version-reprompt",
      issue: 92784,
      sameVersionReprompt: true
    },
    "startup-appdata-enumeration": {
      seed: "startup-appdata-enumeration",
      issue: 92784,
      startupAppdataEnumeration: true
    },
    "fda-desktop-ineffective": {
      seed: "fda-desktop-ineffective",
      issue: 92784,
      fdaDesktopIneffective: true
    },
    "child-worker-identity": {
      seed: "child-worker-identity",
      issue: 92784,
      childWorkerIdentity: true
    },
    cousins: { seed: "cousins", issue: 92784, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92784,
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

const SPECIFIC_SEEDS = [
  "cousins",
  "session-scoped-auth-invalid",
  "same-version-reprompt",
  "startup-appdata-enumeration",
  "fda-desktop-ineffective",
  "child-worker-identity",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "session-scoped-auth-invalid": (t, c) =>
    boolish(t.sessionScopedAuthInvalid) || c.sessionScopedAuthInvalid,
  "same-version-reprompt": (t, c) => boolish(t.sameVersionReprompt) || c.sameVersionReprompt,
  "startup-appdata-enumeration": (t, c) =>
    boolish(t.startupAppdataEnumeration) || c.startupAppdataEnumeration,
  "fda-desktop-ineffective": (t, c) => boolish(t.fdaDesktopIneffective) || c.fdaDesktopIneffective,
  "child-worker-identity": (t, c) => boolish(t.childWorkerIdentity) || c.childWorkerIdentity,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const folio = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      lit: false,
      snuffed: true,
      tenured: false,
      chips: ["cousins", "snuffed"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      lit: false,
      snuffed: true,
      tenured: false,
      chips: [seed, "snuffed"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "snuffed" &&
      seed !== "tenured" &&
      seed !== "lit"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        lit: false,
        snuffed: true,
        tenured: false,
        chips: [name, "snuffed"],
        folio
      };
    }
  }

  if (
    seed === "tenured" ||
    (t.tenured === true && t.snuffed !== true && seed !== "snuffed") ||
    (folio.tenured && !folio.snuffed && seed !== "snuffed")
  ) {
    reasons.push(CHIP_REASONS.tenured);
    return {
      verdict: "tenured",
      reasons,
      lit: false,
      snuffed: false,
      tenured: true,
      chips: ["tenured"],
      folio
    };
  }

  if (t.snuffed === true || seed === "snuffed" || (folio.snuffed && !folio.tenured && !folio.lit)) {
    reasons.push(CHIP_REASONS.snuffed);
    const chips = ["snuffed"];
    if (t.sessionScopedAuthInvalid === true || folio.sessionScopedAuthInvalid) {
      chips.push("session-scoped-auth-invalid");
    }
    if (t.sameVersionReprompt === true || folio.sameVersionReprompt) {
      chips.push("same-version-reprompt");
    }
    if (t.startupAppdataEnumeration === true || folio.startupAppdataEnumeration) {
      chips.push("startup-appdata-enumeration");
    }
    if (t.fdaDesktopIneffective === true || folio.fdaDesktopIneffective) {
      chips.push("fda-desktop-ineffective");
    }
    if (t.childWorkerIdentity === true || folio.childWorkerIdentity) {
      chips.push("child-worker-identity");
    }
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "snuffed",
      reasons,
      lit: false,
      snuffed: true,
      tenured: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "lit" || t.lit === true || folio.lit) {
    reasons.push(CHIP_REASONS.lit);
    return {
      verdict: "lit",
      reasons,
      lit: true,
      snuffed: false,
      tenured: false,
      chips: ["lit"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      lit: false,
      snuffed: true,
      tenured: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle sconce is lit — HOLD: TCC AppData grant persists across sessions of the same version"
  );
  return {
    verdict: "lit",
    reasons,
    lit: true,
    snuffed: false,
    tenured: false,
    chips: ["lit"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedLit();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedLit();
  }
  return seedLit();
}

export async function main(argv = process.argv.slice(2)) {
  const { readFileSync } = await import("node:fs");
  const { stdin } = await import("node:process");
  let raw = "";
  if (argv[0] && !argv[0].startsWith("-")) {
    raw = readFileSync(argv[0], "utf8");
  } else if (!stdin.isTTY) {
    raw = await new Promise((resolve, reject) => {
      const chunks = [];
      stdin.on("data", (chunk) => chunks.push(chunk));
      stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stdin.on("error", reject);
    });
  }
  const probe = parseProbe(raw);
  const result = decide(probe);
  const out = {
    product: "rushlight",
    issue: 92784,
    mark: "15:50 / hermes catalog #221 / #92784",
    alarm: ALARM.has(result.verdict),
    hold: HOLD.has(result.verdict),
    ...result
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return out;
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
