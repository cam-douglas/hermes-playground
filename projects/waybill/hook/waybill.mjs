/**
 * Waybill — freight waybill / cargo consignment ticket bench.
 *
 * A waybill that should stamp THIS session's berth on the
 * named-agent team-file lookup so the mailbox lands in the
 * right hold. Instead the stamp misroutes under a foreign
 * session id (0/21 match). Without `name:` the parcel goes
 * through; with `name:` the stamp is wrong and the team
 * file is "not found".
 *
 * Encoded from anthropics/claude-code#92624 issue facts only.
 * Hypothesis (NON-BINDING): named-spawn team-file key may be
 * resolving against a stale/foreign session id rather than
 * the current transcript sessionId (wrong lookup key);
 * initializing/looking up under the current session would
 * address the waybill. Verify against issue text only; do
 * not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "misrouted",
  "addressed",
  "foreign-session-id",
  "zero-of-twenty-one",
  "regression-2-1-247",
  "team-dir-never-created",
  "not-permissions",
  "not-only-concurrency",
  "name-param-path",
  "unnamed-spawn-ok",
  "mailbox-addressing-lost",
  "second-string-cite-only",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["addressed"]);

export const ALARM = new Set([
  "misrouted",
  "foreign-session-id",
  "zero-of-twenty-one",
  "regression-2-1-247",
  "team-dir-never-created",
  "not-permissions",
  "not-only-concurrency",
  "name-param-path",
  "unnamed-spawn-ok",
  "mailbox-addressing-lost",
  "second-string-cite-only",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "misrouted";
export const SEEDED_WORD = "addressed";

export const MEASURED = {
  issue: 92624,
  title:
    "[BUG] Named agent spawn resolves the team file under a foreign session id (0/21 match) - Windows, 2.1.247 onward",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:agents"],
  filed: "2026-09-07T09:10:56Z",
  updated: "2026-09-07T09:12:01Z",
  reporter: "yongseek-choi",
  comments: 0,
  os: "Windows 11 Enterprise 26200",
  shell: "git-bash",
  surface: "Claude Code named agent spawn / team-file lookup",
  claudeCodeLive: "2.1.263",
  regressionFrom: "2.1.247",
  lastKnownGood: "2.1.241",
  unobservedGap: "2.1.242–246",
  okBefore: 14,
  errBefore: 0,
  okAfter: 9,
  errAfter: 39,
  currentSessionId: "1b331b27",
  foreignSessionId: "7470f9d6",
  foreignSessionEndedHoursAgo: 4,
  matchRate: "0/21",
  matchCount: 0,
  mismatchCount: 21,
  failRateOneSession: 0.52,
  failRateTwoSessions: 0.77,
  unnamedWorks: 73,
  unnamedWorksOf: 73,
  bgNotifications: 244,
  bgNotificationsOf: 245,
  secondStringCount: 18,
  notFoundCount: 21,
  teamsDir: "~/.claude/teams/",
  teamsDirOwnedByUser: true,
  permissionsOk: true,
  failingTeamDirCreated: false,
  successfulNamedSpawnDirs: 2,
  errorNamedIds: 6,
  errorString:
    'Internal error: team file for "session-<id>" not found. The session team should have been initialized at startup.',
  secondErrorString: "Team config file unreadable (lock acquired, read failed)",
  secondStringCousin: 82627,
  expected: "named spawn initializes/looks up team file for CURRENT session id",
  actual:
    "named spawn looks up team file under a foreign session id; team file not found",
  impact:
    "named addressing / SendMessage({to:name}) unavailable; spawn without name: works 73/73"
};

export const COUSINS = [
  {
    id: 82627,
    state: "open",
    note: "Cite-only cousin. macOS com.apple.provenance team config unreadable. DIFFERENT error string + platform: Team config file unreadable (lock acquired, read failed). Primary stays #92624. Do not auto-pick as primary."
  },
  {
    id: 82493,
    state: "open",
    note: "Cite-only cousin. Named Agent tool spawns accepted but never executed. DIFFERENT: spawn accepted, never runs. Primary stays #92624."
  },
  {
    id: 83366,
    state: "open",
    note: "Cite-only cousin. Named/teammate spawns silently never start when tmux pane creation fails (Windows). DIFFERENT: tmux pane path, not foreign-id team-file lookup. Primary stays #92624."
  },
  {
    id: 81852,
    state: "open",
    note: "Cite-only cousin. tools: allowlist dropped for named agents/teammates. DIFFERENT surface. Primary stays #92624."
  },
  {
    id: 85949,
    state: "open",
    note: "Cite-only cousin. teammate inbox orphan / SendMessage to team-lead false-succeeds. DIFFERENT: inbox orphan, not foreign session id on spawn. Primary stays #92624."
  }
];

export const BACKUPS_DO_NOT_AUTO_PICK = [
  {
    id: 92662,
    note: "Chrome relaunch bridge. Do not auto-pick."
  },
  {
    id: 92675,
    note: "plugin PreToolUse hooks. Do not auto-pick."
  },
  {
    id: 92678,
    note: "TUI scroll while streaming. Do not auto-pick."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "snatch",
    issue: 92583,
    note: "Snatch/#92583: session-end never reaps auto-backgrounded Bash orphans. Different defect."
  },
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Speakpipe/#92646: Desktop overbroad SendMessage ban corks continuation. Different defect."
  },
  {
    slug: "afterimage",
    issue: 92596,
    note: "Afterimage/#92596: Windows text paint deferred until message_stop. Different defect."
  },
  {
    slug: "limber",
    issue: 92590,
    note: "Limber/#92590: unexpanded $TMPDIR write-allowlist. Different defect."
  },
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: blockReadsOutsideWorkingDirectories ignores additionalDirectories. Different defect."
  },
  {
    slug: "deadman",
    issue: 92593,
    note: "Deadman/#92593: timeout promote + TaskStop leftover. Different defect."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: security-guidance ENOENT staging loop. Different defect."
  },
  {
    slug: "touchstone",
    issue: 92599,
    note: "Touchstone/#92599: extension-gated Write/Edit. Different defect."
  },
  {
    slug: "bitts",
    note: "Bitts: prior catalog paradigm. Different defect."
  },
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette/#92095: prior catalog paradigm. Different defect."
  },
  { slug: "sounder", note: "Sounder: prior catalog paradigm. Different defect." },
  { slug: "callboard", note: "Callboard: prior catalog paradigm. Different defect." },
  { slug: "knock", note: "Knock: prior catalog paradigm. Different defect." },
  { slug: "annunciator", note: "Annunciator: prior catalog paradigm. Different defect." }
];

export const STAMPS = [
  {
    id: "consignor",
    role: "consignor / current session berth",
    hail: "1b331b27 · this berth",
    stamped: true
  },
  {
    id: "waybill",
    role: "waybill / name: spawn lookup",
    hail: "stamps 7470f9d6 · foreign id",
    stamped: false
  },
  {
    id: "hold",
    role: "hold / ~/.claude/teams/",
    hail: "dir never created for failing id",
    stamped: false
  }
];

const CHIP_REASONS = {
  misrouted:
    "ALARM: waybill misrouted; named-agent team-file lookup stamps a foreign session id. Score misrouted or admit addressed",
  addressed:
    "waybill already addressed — named spawn initializes/looks up the team file for THIS session's berth. Seeded word is addressed",
  "foreign-session-id":
    "foreign-session-id — error names session-7470f9d6 while the live transcript is 1b331b27-...; the <id> is NEVER the current session id; foreign session ended ~4h earlier",
  "zero-of-twenty-one":
    "zero-of-twenty-one — 0/21 match; 21/21 mismatches; the error session id is never the current session id",
  "regression-2-1-247":
    "regression-2-1-247 — ≤2.1.241 = 14 OK / 0 ERR; ≥2.1.247 = 9 OK / 39 ERR; live 2.1.263; gap 2.1.242–246 unobserved; Windows 11 Enterprise 26200",
  "team-dir-never-created":
    "team-dir-never-created — failing session's team directory never created before or after failed spawn; only successful named-spawn sessions have dirs (2 of 6 error-named ids)",
  "not-permissions":
    "not-permissions — ~/.claude/teams/ owned by user; read/create/delete OK; error is not found, foreign id — not a permission miss",
  "not-only-concurrency":
    "not-only-concurrency — 52% fail with 1 live session; worse with 2 (77%). Concurrency worsens it but is not required",
  "name-param-path":
    "name-param-path — only the team/mailbox registration path is broken; spawn with name: fails; same spawn without name: succeeds",
  "unnamed-spawn-ok":
    "unnamed-spawn-ok — workaround spawn without name: works 73/73; bg notifications 244/245; unnamed parcel goes through",
  "mailbox-addressing-lost":
    "mailbox-addressing-lost — named addressing / SendMessage({to:name}) unavailable while the waybill stamps a foreign hold",
  "second-string-cite-only":
    "second-string-cite-only — second error string on machine (18×): Team config file unreadable (lock acquired, read failed) — that is #82627 (macOS provenance); this product covers ONLY the foreign-id not found message (21×)",
  cousins:
    "cite-only #82627 macOS com.apple.provenance unreadable (DIFFERENT error string + platform); #82493 named spawn accepted never executed; #83366 tmux pane fail silent start (Windows); #81852 tools allowlist dropped; #85949 teammate inbox orphan. Backups do not auto-pick: #92662 Chrome relaunch, #92675 plugin PreToolUse, #92678 TUI scroll. Not Snatch/#92583. Not Speakpipe/#92646. Not Afterimage/#92596. Not Limber/#92590. Not Chock/#92582. Not Deadman/#92593. Not Eidolon/#92601. Not Touchstone/#92599. Not Oubliette/#92095. Not Bitts / Sounder / Callboard / Knock / Annunciator. Primary stays #92624",
  "has-clear-repro":
    "has-clear-repro — #92624 is labeled has repro: Windows 11 Enterprise 26200; git-bash; Claude Code 2.1.263; named spawn name: fails with foreign session id 0/21 match"
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

export function misroutedSignal(text = "") {
  return /misrouted|foreign session id|team file .* not found|0\/21/i.test(
    String(text || "")
  );
}

export function addressedSignal(text = "") {
  return /addressed|stamp this session|current session id|THIS session/i.test(
    String(text || "")
  );
}

export function foreignSessionSignal(text = "") {
  return /foreign-session-id|7470f9d6|1b331b27|session-<id>/i.test(
    String(text || "")
  );
}

export function zeroOfTwentyOneSignal(text = "") {
  return /zero-of-twenty-one|0\/21|21\/21 mismatch/i.test(String(text || ""));
}

export function regressionSignal(text = "") {
  return /regression-2-1-247|2\.1\.247|2\.1\.241|2\.1\.263/i.test(String(text || ""));
}

export function teamDirSignal(text = "") {
  return /team-dir-never-created|team directory never created|2 of 6/i.test(
    String(text || "")
  );
}

export function permissionsSignal(text = "") {
  return /not-permissions|owned by user|read\/create\/delete|not a permission/i.test(
    String(text || "")
  );
}

export function concurrencySignal(text = "") {
  return /not-only-concurrency|52%|77%|1 live session/i.test(String(text || ""));
}

export function nameParamSignal(text = "") {
  return /name-param-path|name:|without `name:`|team\/mailbox/i.test(
    String(text || "")
  );
}

export function unnamedOkSignal(text = "") {
  return /unnamed-spawn-ok|73\/73|without name:|unnamed parcel/i.test(
    String(text || "")
  );
}

export function mailboxSignal(text = "") {
  return /mailbox-addressing-lost|SendMessage\(\{to:name\}\)|named addressing/i.test(
    String(text || "")
  );
}

export function secondStringSignal(text = "") {
  return /second-string-cite-only|#82627|unreadable \(lock acquired, read failed\)/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    misrouted: misroutedSignal(blob),
    addressed: addressedSignal(blob),
    foreignSession: foreignSessionSignal(blob),
    zeroOfTwentyOne: zeroOfTwentyOneSignal(blob),
    regression: regressionSignal(blob),
    teamDir: teamDirSignal(blob),
    permissions: permissionsSignal(blob),
    concurrency: concurrencySignal(blob),
    nameParam: nameParamSignal(blob),
    unnamedOk: unnamedOkSignal(blob),
    mailbox: mailboxSignal(blob),
    secondString: secondStringSignal(blob)
  };
}

export function waybillAddressed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.waybillAddressed) || (boolish(t.addressed) && !boolish(t.misrouted))) {
    return boolish(t.waybillAddressed) || (boolish(t.addressed) && !boolish(t.misrouted));
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const foreign =
    boolish(t.foreignSessionId) ||
    t.errorSessionId === MEASURED.foreignSessionId ||
    t.foreignSessionId === MEASURED.foreignSessionId ||
    hits.foreignSession;
  const zero =
    boolish(t.zeroOfTwentyOne) ||
    t.matchRate === MEASURED.matchRate ||
    t.matchCount === 0 && t.mismatchCount === 21 ||
    hits.zeroOfTwentyOne;
  const regression =
    boolish(t.regression21247) ||
    t.regressionFrom === MEASURED.regressionFrom ||
    hits.regression;
  const teamDir =
    boolish(t.teamDirNeverCreated) ||
    (Object.hasOwn(t, "failingTeamDirCreated") && t.failingTeamDirCreated === false) ||
    hits.teamDir;
  const permissions =
    boolish(t.notPermissions) ||
    boolish(t.permissionsOk) ||
    hits.permissions;
  const concurrency =
    boolish(t.notOnlyConcurrency) ||
    t.failRateOneSession === MEASURED.failRateOneSession ||
    hits.concurrency;
  const nameParam =
    boolish(t.nameParamPath) ||
    hits.nameParam;
  const unnamedOk =
    boolish(t.unnamedSpawnOk) ||
    t.unnamedWorks === MEASURED.unnamedWorks ||
    hits.unnamedOk;
  const mailbox =
    boolish(t.mailboxAddressingLost) ||
    hits.mailbox;
  const secondString =
    boolish(t.secondStringCiteOnly) ||
    hits.secondString;
  const addressedClean = boolish(t.addressed) || waybillAddressed(t);
  const misroutedHit = boolish(t.misrouted) || (foreign && !boolish(t.addressed));
  return {
    foreign,
    zero,
    regression,
    teamDir,
    permissions,
    concurrency,
    nameParam,
    unnamedOk,
    mailbox,
    secondString,
    addressedClean,
    misroutedHit,
    berthStamped: waybillAddressed(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const misrouted = boolish(t.misrouted) || (print.misroutedHit && !boolish(t.addressed));
  const addressed = boolish(t.addressed) || (print.addressedClean && !boolish(t.misrouted));
  return {
    misrouted,
    addressed,
    foreignSessionId: boolish(t.foreignSessionId) || print.foreign,
    zeroOfTwentyOne: boolish(t.zeroOfTwentyOne) || print.zero,
    regression21247: boolish(t.regression21247) || print.regression,
    teamDirNeverCreated: boolish(t.teamDirNeverCreated) || print.teamDir,
    notPermissions: boolish(t.notPermissions) || print.permissions,
    notOnlyConcurrency: boolish(t.notOnlyConcurrency) || print.concurrency,
    nameParamPath: boolish(t.nameParamPath) || print.nameParam,
    unnamedSpawnOk: boolish(t.unnamedSpawnOk) || print.unnamedOk,
    mailboxAddressingLost: boolish(t.mailboxAddressingLost) || print.mailbox,
    secondStringCiteOnly: boolish(t.secondStringCiteOnly) || print.secondString,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    os: t.os || MEASURED.os
  };
}

export function seedMisrouted() {
  return {
    seed: "misrouted",
    issue: 92624,
    misrouted: true,
    addressed: false,
    foreignSessionId: true,
    zeroOfTwentyOne: true,
    regression21247: true,
    teamDirNeverCreated: true,
    notPermissions: true,
    notOnlyConcurrency: true,
    nameParamPath: true,
    unnamedSpawnOk: true,
    mailboxAddressingLost: true,
    secondStringCiteOnly: true,
    failingTeamDirCreated: false,
    permissionsOk: true,
    matchRate: MEASURED.matchRate,
    matchCount: 0,
    mismatchCount: 21,
    errorSessionId: MEASURED.foreignSessionId,
    currentSessionId: MEASURED.currentSessionId,
    outputText:
      "misrouted; foreign-session-id; 0/21; team file for session-7470f9d6 not found; 1b331b27 current",
    reporter: MEASURED.reporter
  };
}

export function seedAddressed() {
  return {
    seed: "addressed",
    issue: 92624,
    misrouted: false,
    addressed: true,
    waybillAddressed: true,
    foreignSessionId: false,
    failingTeamDirCreated: true,
    matchRate: "21/21",
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    misrouted: seedMisrouted(),
    addressed: seedAddressed(),
    "foreign-session-id": {
      seed: "foreign-session-id",
      issue: 92624,
      foreignSessionId: true,
      errorSessionId: MEASURED.foreignSessionId
    },
    "zero-of-twenty-one": {
      seed: "zero-of-twenty-one",
      issue: 92624,
      zeroOfTwentyOne: true,
      matchRate: MEASURED.matchRate
    },
    "regression-2-1-247": {
      seed: "regression-2-1-247",
      issue: 92624,
      regression21247: true,
      regressionFrom: MEASURED.regressionFrom
    },
    "team-dir-never-created": {
      seed: "team-dir-never-created",
      issue: 92624,
      teamDirNeverCreated: true,
      failingTeamDirCreated: false
    },
    "not-permissions": {
      seed: "not-permissions",
      issue: 92624,
      notPermissions: true,
      permissionsOk: true
    },
    "not-only-concurrency": {
      seed: "not-only-concurrency",
      issue: 92624,
      notOnlyConcurrency: true,
      failRateOneSession: MEASURED.failRateOneSession
    },
    "name-param-path": {
      seed: "name-param-path",
      issue: 92624,
      nameParamPath: true
    },
    "unnamed-spawn-ok": {
      seed: "unnamed-spawn-ok",
      issue: 92624,
      unnamedSpawnOk: true,
      unnamedWorks: MEASURED.unnamedWorks
    },
    "mailbox-addressing-lost": {
      seed: "mailbox-addressing-lost",
      issue: 92624,
      mailboxAddressingLost: true
    },
    "second-string-cite-only": {
      seed: "second-string-cite-only",
      issue: 92624,
      secondStringCiteOnly: true
    },
    cousins: {
      seed: "cousins",
      issue: 92624,
      cousins: true,
      cousinsCiteOnly: [82627, 82493, 83366, 81852, 85949]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92624,
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
  "foreign-session-id",
  "zero-of-twenty-one",
  "regression-2-1-247",
  "team-dir-never-created",
  "not-permissions",
  "not-only-concurrency",
  "name-param-path",
  "unnamed-spawn-ok",
  "mailbox-addressing-lost",
  "second-string-cite-only",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "foreign-session-id": (t, c) => boolish(t.foreignSessionId) || c.foreignSessionId,
  "zero-of-twenty-one": (t, c) => boolish(t.zeroOfTwentyOne) || c.zeroOfTwentyOne,
  "regression-2-1-247": (t, c) => boolish(t.regression21247) || c.regression21247,
  "team-dir-never-created": (t, c) => boolish(t.teamDirNeverCreated) || c.teamDirNeverCreated,
  "not-permissions": (t, c) => boolish(t.notPermissions) || c.notPermissions,
  "not-only-concurrency": (t, c) => boolish(t.notOnlyConcurrency) || c.notOnlyConcurrency,
  "name-param-path": (t, c) => boolish(t.nameParamPath) || c.nameParamPath,
  "unnamed-spawn-ok": (t, c) => boolish(t.unnamedSpawnOk) || c.unnamedSpawnOk,
  "mailbox-addressing-lost": (t, c) =>
    boolish(t.mailboxAddressingLost) || c.mailboxAddressingLost,
  "second-string-cite-only": (t, c) =>
    boolish(t.secondStringCiteOnly) || c.secondStringCiteOnly,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const waybill = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      misrouted: true,
      addressed: false,
      chips: ["cousins", "misrouted"],
      waybill
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      misrouted: true,
      addressed: false,
      chips: [seed, "misrouted"],
      waybill
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, waybill) && seed !== "misrouted" && seed !== "addressed") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        misrouted: true,
        addressed: false,
        chips: [name, "misrouted"],
        waybill
      };
    }
  }

  if (
    seed === "addressed" ||
    (t.addressed === true && t.misrouted !== true && seed !== "misrouted") ||
    (waybill.addressed && !waybill.misrouted && seed !== "misrouted")
  ) {
    reasons.push(CHIP_REASONS.addressed);
    return {
      verdict: "addressed",
      reasons,
      misrouted: false,
      addressed: true,
      chips: ["addressed"],
      waybill
    };
  }

  if (t.misrouted === true || seed === "misrouted" || (waybill.misrouted && !waybill.addressed)) {
    reasons.push(CHIP_REASONS.misrouted);
    const chips = ["misrouted"];
    if (t.foreignSessionId === true || waybill.foreignSessionId) {
      chips.push("foreign-session-id");
    }
    if (t.zeroOfTwentyOne === true || waybill.zeroOfTwentyOne) {
      chips.push("zero-of-twenty-one");
    }
    if (t.regression21247 === true || waybill.regression21247) {
      chips.push("regression-2-1-247");
    }
    if (t.teamDirNeverCreated === true || waybill.teamDirNeverCreated) {
      chips.push("team-dir-never-created");
    }
    if (t.notPermissions === true || waybill.notPermissions) {
      chips.push("not-permissions");
    }
    if (t.notOnlyConcurrency === true || waybill.notOnlyConcurrency) {
      chips.push("not-only-concurrency");
    }
    if (t.nameParamPath === true || waybill.nameParamPath) {
      chips.push("name-param-path");
    }
    if (t.unnamedSpawnOk === true || waybill.unnamedSpawnOk) {
      chips.push("unnamed-spawn-ok");
    }
    if (t.mailboxAddressingLost === true || waybill.mailboxAddressingLost) {
      chips.push("mailbox-addressing-lost");
    }
    if (t.secondStringCiteOnly === true || waybill.secondStringCiteOnly) {
      chips.push("second-string-cite-only");
    }
    return {
      verdict: "misrouted",
      reasons,
      misrouted: true,
      addressed: false,
      chips: [...new Set(chips)],
      waybill
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, misrouted: false, addressed: true, chips: [seed], waybill };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      misrouted: true,
      addressed: false,
      chips: [seed],
      waybill
    };
  }

  reasons.push(
    "empty probe; idle waybill is misrouted — ALARM: named-agent team-file lookup stamps a foreign session id"
  );
  return {
    verdict: "misrouted",
    reasons,
    misrouted: true,
    addressed: false,
    chips: ["misrouted"],
    waybill
  };
}
