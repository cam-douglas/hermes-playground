/**
 * Clepsydra — marble cistern / bronze-spout water-clock meter.
 *
 * Part-way through a long-lived session, Claude Code stops recording
 * the developer's own main-loop turns to claude_code.token.usage,
 * claude_code.cost.usage and claude_code.active_time.total. Usage is
 * lost and unrecoverable. Exporter, transport and auth stay healthy
 * (15 samples / 15m). Other instruments on the same session keep
 * advancing (lines_of_code.count, code_edit_tool.decision, commit.count).
 * An affected developer is indistinguishable from an idle one.
 *
 * Encoded from anthropics/claude-code#92776 issue facts only.
 * Hypothesis (NON-BINDING): something tied to process age or
 * cumulative turn count; possibly a per-turn guard (ty = "credited")
 * persisting across turns or the usage object staying null. Invite
 * verify against issue text only — do not invent unread source claims.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "dripping",
  "arrested",
  "credited",
  "partial-credit",
  "exporter-healthy",
  "other-instruments-advance",
  "onset-sharp",
  "process-age-guess",
  "ruled-out-matrix",
  "transcript-ground-truth",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["dripping", "credited"]);

export const ALARM = new Set([
  "arrested",
  "partial-credit",
  "exporter-healthy",
  "other-instruments-advance",
  "onset-sharp",
  "process-age-guess",
  "ruled-out-matrix",
  "transcript-ground-truth",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "dripping";
export const SEEDED_WORD = "arrested";
export const ADMIT_WORD = "credited";

export const MEASURED = {
  issue: 92776,
  title:
    "[BUG] OTel token.usage / cost.usage silently stop recording main-loop turns mid-session (3% of actual captured)",
  state: "open",
  labels: ["bug", "has repro", "platform:macos", "area:core", "platform:aws-bedrock"],
  filed: "2026-09-08T04:33:31Z",
  reporter: "stevec-dubber",
  claude:
    "Claude Code 2.1.263 (macOS arm64, BUILD_TIME 2026-09-06T01:08:56Z, GIT_SHA 37ae3f38d765199d54a6913cd61c6c9ad8576cc6)",
  os: "macOS",
  terminal: "iTerm2",
  platform: "AWS Bedrock",
  model: "Opus",
  session: "53dd124d",
  surface:
    "OTel token.usage / cost.usage / active_time.total silently stop recording main-loop turns mid-session while exporter stays healthy and other instruments keep advancing",
  expected:
    "Every API request's usage should be recorded to token.usage and cost.usage for the life of the session, as it is during the first ~30 minutes",
  actual:
    "Part-way through a long-lived session the meter stops; usage is lost and unrecoverable; an affected developer is indistinguishable from an idle one",
  runs: [
    { day: "4 Sep", consumed: 22994009, recorded: 5797429, captured: "25%" },
    { day: "7 Sep", consumed: 1508313, recorded: 1508313, captured: "100%" },
    { day: "8 Sep", consumed: 21861971, recorded: 0, captured: "0%", note: "0 (main)" }
  ],
  cost8Sep: { recorded: 2.62, incurred: 25.98 },
  validation7Sep: {
    input: 22,
    output: 9595,
    cacheRead: 956931,
    cacheCreation: 541765,
    costComputed: 4.1042,
    costRecorded: 4.1045
  },
  onset: [
    { at: "02:38:30", cumulative: 3637625, metricMain: 3637625 },
    { at: "02:39:32", cumulative: 4436272, metricMain: 4436272 },
    { at: "02:39:59", cumulative: 4717604, metricMain: 4717604 },
    {
      at: "next 5 requests (755,887 tokens)",
      cumulative: 5473491,
      metricMain: 4877909,
      note: "only 160,305, one request's worth"
    }
  ],
  afterOnsetCredits: [160305, 78446, "120125+136854", 91792, 83368],
  afterOnsetWindow: "2.5h",
  creditedInFull: 50,
  droppedEntirely: 157,
  totalRequests: 207,
  activeTimePinned: 197.968,
  activeTimePinnedFor: "24h+",
  exporterSamplesPer15m: 15,
  otherInstruments: {
    linesOfCodeCount: 1021,
    codeEditToolDecision: 13,
    commitCount: 2,
    window: "4 hours in which main-loop token growth was 0"
  },
  ruledOut: [
    {
      cause: "Process restart / counter reset",
      by: "No reset; session_id and service_version unchanged across the stall"
    },
    {
      cause: "Sleep / resume",
      by: "Machine continuously awake from 3 Sep 23:48:45Z to 7 Sep 07:29:15Z per pmset -g log; the onset is mid-stretch"
    },
    {
      cause: "Idle duration",
      by: "The 100%-capture run contains idle gaps of 880 s, 781 s and 759 s — longer than the 862 s gap at the onset"
    },
    {
      cause: "Compaction",
      by: "First isCompactSummary was 16 minutes after onset"
    },
    {
      cause: "Auto-update",
      by: "No version change in the window"
    },
    {
      cause: "Auth / transport",
      by: "15 samples per 15m throughout; no denials from this host"
    },
    {
      cause: "Query-source relabelling",
      by: "Volume: 21.9M consumed against 730k in auxiliary"
    }
  ],
  processAgeGuess: {
    binding: "NON-BINDING",
    text: "something tied to process age or cumulative turn count; possibly a per-turn guard (ty = \"credited\") persisting across turns or the usage object staying null",
    examples: [
      "one process was exact for 50 requests / ~30 min then degraded",
      "another was exact for 11 requests / ~51 min, then idled ~23 h and credited nothing thereafter"
    ]
  },
  hypothesis:
    "NON-BINDING: something tied to process age or cumulative turn count; possibly a per-turn guard (ty = \"credited\") persisting across turns or the usage object staying null. Invite verify against issue text only."
};

export const CISTERN_LEDGER = [
  {
    id: "spout",
    role: "bronze spout / token.usage + cost.usage",
    tally: "tracks then arrests",
    note: "main-loop meter matches the transcript request-for-request, then stops; usage is lost"
  },
  {
    id: "basin",
    role: "marble basin / other instruments",
    tally: "LOC +1021 · edits +13 · commits +2",
    note: "same session, same 4h window: lines_of_code, code_edit_tool.decision and commit.count keep advancing"
  },
  {
    id: "credited",
    role: "credit / admit",
    tally: "every turn credited for the life of the session",
    note: "hypothetical: token.usage and cost.usage keep dripping for the whole session, as during the first ~30 minutes"
  }
];

export const CAPTURE_TABLE = [
  { day: "4 Sep", consumed: 22994009, recorded: 5797429, captured: "25%" },
  { day: "7 Sep", consumed: 1508313, recorded: 1508313, captured: "100%" },
  { day: "8 Sep", consumed: 21861971, recorded: 0, captured: "0%" }
];

export const COUSINS = [
  {
    id: 33904,
    state: "closed",
    title: "Session Recording Failure & Massive Token Usage Surge",
    note: "cite-only — Windows/VS Code, needs-repro, different shape; not primary"
  }
];

export const NOT_THIS_BUG = [
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
    note: "Espagnolette/#92694 already shipped — AskUserQuestion selection keys. Do not touch."
  },
  {
    slug: "imprimatur",
    issue: 92740,
    note: "Imprimatur/#92740 already shipped. Do not touch."
  },
  {
    slug: "byname",
    issue: 92738,
    note: "Byname/#92738 already shipped. Do not touch."
  },
  {
    slug: "portage",
    issue: 92734,
    note: "Portage/#92734 backup only — teleport history+project-key. Do not auto-pick."
  },
  {
    slug: "clevis",
    issue: 92769,
    note: "Clevis/#92769 backup only — disable-model-invocation hides skills. Do not auto-pick."
  },
  {
    slug: "scuttle",
    issue: 92700,
    note: "Scuttle/#92700 backup only — colored emoji TUI. Do not auto-pick."
  }
];

const CHIP_REASONS = {
  dripping:
    "HOLD: cistern is dripping — token and cost drips credited for the whole session. Score arrested or admit credited",
  arrested:
    "ALARM: OTel spout arrested mid-session; token.usage / cost.usage / active_time.total silently stop recording main-loop turns while other instruments keep advancing. Score arrested or admit credited",
  credited:
    "cistern already credited — every API request's usage recorded to token.usage and cost.usage for the life of the session. Seeded admit word is credited",
  "partial-credit":
    "partial-credit — after onset only five further credits in 2.5h each matching exactly one request; 50 of 207 requests credited in full, 157 dropped entirely",
  "exporter-healthy":
    "exporter-healthy — exporter, transport and auth stay healthy; 15 samples per 15 minutes throughout; this is not export, transport, auth or temporality",
  "other-instruments-advance":
    "other-instruments-advance — over 4 hours in which main-loop token growth was 0, lines_of_code.count +1,021, code_edit_tool.decision +13, commit.count +2; only one recording path dies, not the meter",
  "onset-sharp":
    "onset-sharp — the counter tracks the transcript to the unit, request for request, then stops; next 5 requests (755,887 tokens) credit only 160,305, one request's worth",
  "process-age-guess":
    "process-age-guess — NON-BINDING hypothesis: something tied to process age or cumulative turn count; possibly a per-turn guard (ty = \"credited\") persisting across turns or the usage object staying null. Invite verify against issue text only",
  "ruled-out-matrix":
    "ruled-out-matrix — process restart/counter reset, sleep/resume, idle duration, compaction (first isCompactSummary 16m after onset), auto-update, auth/transport, and query-source relabelling are eliminated with evidence",
  "transcript-ground-truth":
    "transcript-ground-truth — session 53dd124d vs transcript (message.usage deduped by message.id): 4 Sep 25%, 7 Sep 100% (method validates), 8 Sep 0% main; cost $2.62 recorded vs ~$25.98 incurred",
  cousins:
    "cite-only neighbourhood — #33904 CLOSED Session Recording Failure & Massive Token Usage Surge (Windows/VS Code, needs-repro, different shape). Primary stays #92776",
  "has-clear-repro":
    "has-clear-repro — #92776 is labeled has repro: Claude Code 2.1.263 (macOS arm64, BUILD_TIME 2026-09-06T01:08:56Z, GIT_SHA 37ae3f38d765199d54a6913cd61c6c9ad8576cc6), AWS Bedrock, iTerm2, Opus; filed 2026-09-08T04:33:31Z; labels bug, has repro, platform:macos, area:core, platform:aws-bedrock"
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

export function drippingSignal(text = "") {
  return /idle cistern is dripping|pin idle dripping|token and cost drips credited|credited for the whole session/i.test(
    String(text || "")
  );
}

export function arrestedSignal(text = "") {
  return /OTel spout arrested|silently stop recording|stop recording main-loop|usage is lost|indistinguishable from an idle/i.test(
    String(text || "")
  );
}

export function creditedSignal(text = "") {
  return /already credited|every API request's usage recorded|keep dripping for the whole session/i.test(
    String(text || "")
  );
}

export function partialCreditSignal(text = "") {
  return /partial-credit|five further credits|50 of 207|157 dropped/i.test(String(text || ""));
}

export function exporterHealthySignal(text = "") {
  return /exporter-healthy|15 samples|exporter, transport and auth stay healthy/i.test(
    String(text || "")
  );
}

export function otherInstrumentsSignal(text = "") {
  return /other-instruments-advance|lines_of_code\.count|code_edit_tool\.decision|commit\.count/i.test(
    String(text || "")
  );
}

export function onsetSharpSignal(text = "") {
  return /onset-sharp|tracks the transcript|request for request|one request's worth/i.test(
    String(text || "")
  );
}

export function processAgeGuessSignal(text = "") {
  return /process-age-guess|process age or cumulative turn|ty = "credited"|usage object staying null/i.test(
    String(text || "")
  );
}

export function ruledOutMatrixSignal(text = "") {
  return /ruled-out-matrix|isCompactSummary|pmset -g log|query-source relabelling/i.test(
    String(text || "")
  );
}

export function transcriptGroundTruthSignal(text = "") {
  return /transcript-ground-truth|53dd124d|message\.usage|deduped by message\.id/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    dripping: drippingSignal(blob),
    arrested: arrestedSignal(blob),
    credited: creditedSignal(blob),
    partialCredit: partialCreditSignal(blob),
    exporterHealthy: exporterHealthySignal(blob),
    otherInstruments: otherInstrumentsSignal(blob),
    onsetSharp: onsetSharpSignal(blob),
    processAgeGuess: processAgeGuessSignal(blob),
    ruledOutMatrix: ruledOutMatrixSignal(blob),
    transcriptGroundTruth: transcriptGroundTruthSignal(blob)
  };
}

export function spoutWasArrested(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.arrested) || boolish(t.spoutArrested) || boolish(t.usageLost)) {
    return true;
  }
  return arrestedSignal(extractText(t));
}

export function exporterStillHealthy(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.exporterHealthy) || boolish(t.exporterOk)) {
    return true;
  }
  return exporterHealthySignal(extractText(t));
}

export function cisternCredited(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.cisternCredited) || (boolish(t.credited) && !boolish(t.arrested))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const arrestedHit =
    boolish(t.arrested) || (spoutWasArrested(t) && !boolish(t.credited) && !boolish(t.dripping));
  const creditedClean = boolish(t.credited) || cisternCredited(t);
  const drippingHit = boolish(t.dripping) || (hits.dripping && !arrestedHit && !creditedClean);
  return {
    arrestedHit,
    creditedClean,
    drippingHit,
    partialCredit: boolish(t.partialCredit) || hits.partialCredit,
    exporterHealthy: boolish(t.exporterHealthy) || hits.exporterHealthy,
    otherInstruments: boolish(t.otherInstrumentsAdvance) || hits.otherInstruments,
    onsetSharp: boolish(t.onsetSharp) || hits.onsetSharp,
    processAgeGuess: boolish(t.processAgeGuess) || hits.processAgeGuess,
    ruledOutMatrix: boolish(t.ruledOutMatrix) || hits.ruledOutMatrix,
    transcriptGroundTruth: boolish(t.transcriptGroundTruth) || hits.transcriptGroundTruth,
    cisternCredited: cisternCredited(t),
    spoutArrested: arrestedHit,
    spoutDripping: creditedClean && !arrestedHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const arrested = boolish(t.arrested) || (print.arrestedHit && !boolish(t.credited) && !boolish(t.dripping));
  const credited = boolish(t.credited) || (print.creditedClean && !boolish(t.arrested));
  const dripping = boolish(t.dripping) || (print.drippingHit && !arrested && !credited);
  return {
    dripping,
    arrested,
    credited,
    partialCredit: boolish(t.partialCredit) || print.partialCredit,
    exporterHealthy: boolish(t.exporterHealthy) || print.exporterHealthy,
    otherInstrumentsAdvance: boolish(t.otherInstrumentsAdvance) || print.otherInstruments,
    onsetSharp: boolish(t.onsetSharp) || print.onsetSharp,
    processAgeGuess: boolish(t.processAgeGuess) || print.processAgeGuess,
    ruledOutMatrix: boolish(t.ruledOutMatrix) || print.ruledOutMatrix,
    transcriptGroundTruth: boolish(t.transcriptGroundTruth) || print.transcriptGroundTruth,
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

export function seedDripping() {
  return {
    seed: "dripping",
    issue: 92776,
    dripping: true,
    arrested: false,
    credited: false,
    outputText:
      "dripping; idle cistern — token and cost drips credited for the whole session"
  };
}

export function seedArrested() {
  return {
    seed: "arrested",
    issue: 92776,
    dripping: false,
    arrested: true,
    credited: false,
    spoutArrested: true,
    usageLost: true,
    partialCredit: true,
    exporterHealthy: true,
    otherInstrumentsAdvance: true,
    onsetSharp: true,
    processAgeGuess: true,
    ruledOutMatrix: true,
    transcriptGroundTruth: true,
    hasClearRepro: true,
    outputText:
      "arrested; OTel spout arrested mid-session — silently stop recording main-loop turns; usage is lost",
    claude: MEASURED.claude
  };
}

export function seedCredited() {
  return {
    seed: "credited",
    issue: 92776,
    dripping: false,
    arrested: false,
    credited: true,
    cisternCredited: true,
    everyTurnCredited: true,
    claude: MEASURED.claude
  };
}

export function seeds() {
  return {
    dripping: seedDripping(),
    arrested: seedArrested(),
    credited: seedCredited(),
    "partial-credit": { seed: "partial-credit", issue: 92776, partialCredit: true },
    "exporter-healthy": { seed: "exporter-healthy", issue: 92776, exporterHealthy: true },
    "other-instruments-advance": {
      seed: "other-instruments-advance",
      issue: 92776,
      otherInstrumentsAdvance: true
    },
    "onset-sharp": { seed: "onset-sharp", issue: 92776, onsetSharp: true },
    "process-age-guess": { seed: "process-age-guess", issue: 92776, processAgeGuess: true },
    "ruled-out-matrix": { seed: "ruled-out-matrix", issue: 92776, ruledOutMatrix: true },
    "transcript-ground-truth": {
      seed: "transcript-ground-truth",
      issue: 92776,
      transcriptGroundTruth: true
    },
    cousins: { seed: "cousins", issue: 92776, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92776,
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
  "partial-credit",
  "exporter-healthy",
  "other-instruments-advance",
  "onset-sharp",
  "process-age-guess",
  "ruled-out-matrix",
  "transcript-ground-truth",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "partial-credit": (t, c) => boolish(t.partialCredit) || c.partialCredit,
  "exporter-healthy": (t, c) => boolish(t.exporterHealthy) || c.exporterHealthy,
  "other-instruments-advance": (t, c) =>
    boolish(t.otherInstrumentsAdvance) || c.otherInstrumentsAdvance,
  "onset-sharp": (t, c) => boolish(t.onsetSharp) || c.onsetSharp,
  "process-age-guess": (t, c) => boolish(t.processAgeGuess) || c.processAgeGuess,
  "ruled-out-matrix": (t, c) => boolish(t.ruledOutMatrix) || c.ruledOutMatrix,
  "transcript-ground-truth": (t, c) =>
    boolish(t.transcriptGroundTruth) || c.transcriptGroundTruth,
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
      dripping: false,
      arrested: true,
      credited: false,
      chips: ["cousins", "arrested"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      dripping: false,
      arrested: true,
      credited: false,
      chips: [seed, "arrested"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "arrested" &&
      seed !== "credited" &&
      seed !== "dripping"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        dripping: false,
        arrested: true,
        credited: false,
        chips: [name, "arrested"],
        folio
      };
    }
  }

  if (
    seed === "credited" ||
    (t.credited === true && t.arrested !== true && seed !== "arrested") ||
    (folio.credited && !folio.arrested && seed !== "arrested")
  ) {
    reasons.push(CHIP_REASONS.credited);
    return {
      verdict: "credited",
      reasons,
      dripping: false,
      arrested: false,
      credited: true,
      chips: ["credited"],
      folio
    };
  }

  if (t.arrested === true || seed === "arrested" || (folio.arrested && !folio.credited && !folio.dripping)) {
    reasons.push(CHIP_REASONS.arrested);
    const chips = ["arrested"];
    if (t.partialCredit === true || folio.partialCredit) chips.push("partial-credit");
    if (t.exporterHealthy === true || folio.exporterHealthy) chips.push("exporter-healthy");
    if (t.otherInstrumentsAdvance === true || folio.otherInstrumentsAdvance) {
      chips.push("other-instruments-advance");
    }
    if (t.onsetSharp === true || folio.onsetSharp) chips.push("onset-sharp");
    if (t.processAgeGuess === true || folio.processAgeGuess) chips.push("process-age-guess");
    if (t.ruledOutMatrix === true || folio.ruledOutMatrix) chips.push("ruled-out-matrix");
    if (t.transcriptGroundTruth === true || folio.transcriptGroundTruth) {
      chips.push("transcript-ground-truth");
    }
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "arrested",
      reasons,
      dripping: false,
      arrested: true,
      credited: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "dripping" || t.dripping === true || folio.dripping) {
    reasons.push(CHIP_REASONS.dripping);
    return {
      verdict: "dripping",
      reasons,
      dripping: true,
      arrested: false,
      credited: false,
      chips: ["dripping"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      dripping: false,
      arrested: true,
      credited: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle cistern is dripping — HOLD: token and cost drips credited for the whole session"
  );
  return {
    verdict: "dripping",
    reasons,
    dripping: true,
    arrested: false,
    credited: false,
    chips: ["dripping"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedDripping();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedDripping();
  }
  return seedDripping();
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
    product: "clepsydra",
    issue: 92776,
    mark: "14:50 / hermes catalog #220 / #92776",
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
