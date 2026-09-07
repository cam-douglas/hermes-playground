/**
 * Imprimatur — censor's imprimatur / nihil-obstat stamp desk.
 *
 * Skip all approvals should waive the stamp on the built-in Artifact
 * tool like everything else. Instead the first publish of a new Artifact
 * refuses immediately, demanding an approval card that never renders.
 * Automatically approve on the same account/machine/build publishes
 * normally. Session also reported itself as non-interactive (OAuth
 * cannot run) while the user was typing.
 *
 * Encoded from anthropics/claude-code#92740 issue facts only.
 * Hypothesis (NON-BINDING): Artifact publish gate only recognises Auto
 * mode / a wired approval channel; Skip leaves no card responder so the
 * first-publish gate refuses immediately. Verify against issue text
 * only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "waived",
  "refused",
  "imprinted",
  "skip-refuses",
  "auto-succeeds",
  "no-card-rendered",
  "first-publish-gate",
  "noninteractive-self-report",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["waived", "imprinted"]);

export const ALARM = new Set([
  "refused",
  "skip-refuses",
  "auto-succeeds",
  "no-card-rendered",
  "first-publish-gate",
  "noninteractive-self-report",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "waived";
export const SEEDED_WORD = "refused";

export const MEASURED = {
  issue: 92740,
  title:
    "[BUG] Cowork Desktop (Windows): first Artifact publish fails in \"Skip all approvals\" mode because it still demands an approval card; \"Automatically approve\" works",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:cowork", "area:permissions"],
  filed: "2026-09-07T21:55:35Z",
  desktop: "Claude Desktop 1.46388.4 (Cowork, MSIX Claude_pzs8sxrjxfjjc)",
  os: "Windows 11 Pro build 26100 x64",
  platform: "windows",
  surface: "Cowork Desktop first Artifact publish under Skip all approvals",
  regression: true,
  regressionNote:
    "worked before 19 August 2026 live-artifacts migration; old mcp__cowork__update_artifact could be auto-approved",
  skipMode: "Skip all approvals",
  autoMode: "Automatically approve",
  errorText:
    "The first publish to an Artifact from this Cowork session needs the approval card, and no one can answer it in this session. Do not retry the publish in this session.",
  cardRendered: false,
  refusesAtOnce: true,
  doesNotWait: true,
  reproRate: "100% across sessions/artifacts",
  autoPublishesNormally: true,
  sameAccountMachineBuild: true,
  noninteractiveSelfReport: true,
  oauthCannotRun: true,
  userWasTyping: true,
  expected:
    "Skip all approvals covers the built-in Artifact tool like everything else (docs: Get started with Claude Cowork — nothing is checked; no carve-out). Or error should name remedy (switch to Automatically approve).",
  actual:
    "first publish of a new Artifact under Skip all approvals fails immediately demanding an approval card that is never rendered; Automatically approve publishes normally",
  impact:
    "COWORK DESKTOP FIRST-PUBLISH ARTIFACT GATE REFUSES UNDER SKIP ALL APPROVALS; NO CARD RENDERED; AUTO WORKS"
};

export const MODE_COLUMNS = [
  {
    id: "skip",
    role: "Skip all approvals / free-pass ticket",
    mode: "Skip all approvals",
    firstPublish: "refused",
    cardRendered: false,
    waits: false,
    note: "first publish of a new Artifact fails immediately; no approval card is ever rendered"
  },
  {
    id: "auto",
    role: "Automatically approve / classifier path",
    mode: "Automatically approve",
    firstPublish: "succeeds",
    cardRendered: false,
    waits: false,
    note: "same account/machine/build publishes normally"
  }
];

export const FIRST_PUBLISH_GATE = {
  trigger: "first publish of a new Artifact from this Cowork session",
  skip: "refuses at once; demands approval card; no card rendered; do not retry in this session",
  auto: "publishes normally",
  docs: "Get started with Claude Cowork — nothing is checked; no carve-out"
};

export const COUSINS = [
  {
    issue: 88997,
    note: "Cite-only cousin. Cloud routines Artifact permission gate family. Different surface (cloud routines). Primary stays #92740."
  },
  {
    issue: 89967,
    note: "Cite-only cousin. Cloud routines Artifact permission gate family. Different surface (cloud routines). Primary stays #92740."
  },
  {
    issue: 91883,
    note: "Cite-only cousin. Cloud routines Artifact permission gate family. Different surface (cloud routines). Primary stays #92740."
  }
];

export const NOT_THIS_BUG = [
  {
    issue: 88997,
    note: "Cloud routines Artifact permission gate family — cite-only, not Cowork Desktop Skip."
  },
  {
    issue: 89967,
    note: "Cloud routines Artifact permission gate family — cite-only, not Cowork Desktop Skip."
  },
  {
    issue: 91883,
    note: "Cloud routines Artifact permission gate family — cite-only, not Cowork Desktop Skip."
  },
  {
    slug: "byname",
    issue: 92738,
    note: "Byname/#92738 already shipped — Desktop slash false-negative on bare plugin-skill byname. Do not touch."
  },
  {
    slug: "crenel",
    issue: 92729,
    note: "Crenel/#92729 already shipped — empty-object resources capability treated as absent. Do not touch."
  }
];

const CHIP_REASONS = {
  waived:
    "HOLD: idle folio is waived — Skip all approvals would cover the built-in Artifact tool; no first-publish refusal. Score refused or admit imprinted",
  refused:
    "ALARM: folio refused; first publish of a new Artifact under Skip all approvals fails immediately — The first publish to an Artifact from this Cowork session needs the approval card, and no one can answer it in this session. Do not retry the publish in this session. No approval card is ever rendered. Automatically approve publishes normally. Score refused or admit imprinted",
  imprinted:
    "folio already imprinted — Skip is treated like Auto at the Artifact publish gate, or the gate is documented/routed (error names the Automatically approve remedy). Seeded admit word is imprinted",
  "skip-refuses":
    "skip-refuses — Skip all approvals; first publish of a new Artifact fails immediately. Same account/machine/build. 100% repro across sessions/artifacts",
  "auto-succeeds":
    "auto-succeeds — Automatically approve on the same account/machine/build publishes normally. Contrast path against Skip",
  "no-card-rendered":
    "no-card-rendered — no approval card is ever rendered. Tool refuses at once (does not wait)",
  "first-publish-gate":
    "first-publish-gate — The first publish to an Artifact from this Cowork session needs the approval card, and no one can answer it in this session. Do not retry the publish in this session. Regression: worked before 19 August 2026 live-artifacts migration; old mcp__cowork__update_artifact could be auto-approved",
  "noninteractive-self-report":
    "noninteractive-self-report — session reported itself as non-interactive (OAuth cannot run) while user was typing — suggests no approval channel under Skip",
  cousins:
    "cite-only NOT #88997 / #89967 / #91883 (cloud routines Artifact permission gate family). Different paradigm: COWORK DESKTOP FIRST-PUBLISH ARTIFACT GATE REFUSES UNDER SKIP ALL APPROVALS; NO CARD RENDERED; AUTO WORKS. Primary stays #92740",
  "has-clear-repro":
    "has-clear-repro — #92740 is labeled has repro: Claude Desktop 1.46388.4 (Cowork, MSIX Claude_pzs8sxrjxfjjc), Windows 11 Pro build 26100 x64; filed 2026-09-07T21:55:35Z; labels bug, has repro, platform:windows, area:cowork, area:permissions"
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

export function waivedSignal(text = "") {
  return /idle folio is waived|pin idle waived|skip would cover|no first-publish refusal/i.test(
    String(text || "")
  );
}

export function refusedSignal(text = "") {
  return /refused|needs the approval card|do not retry the publish/i.test(String(text || ""));
}

export function imprintedSignal(text = "") {
  return /imprinted|already imprinted|skip is treated like auto/i.test(String(text || ""));
}

export function skipRefusesSignal(text = "") {
  return /skip-refuses|skip all approvals.*fail|first publish.*skip/i.test(String(text || ""));
}

export function autoSucceedsSignal(text = "") {
  return /auto-succeeds|automatically approve.*publish|publishes normally/i.test(
    String(text || "")
  );
}

export function noCardRenderedSignal(text = "") {
  return /no-card-rendered|no approval card|card is never rendered|card never/i.test(
    String(text || "")
  );
}

export function firstPublishGateSignal(text = "") {
  return /first-publish-gate|first publish to an Artifact|mcp__cowork__update_artifact/i.test(
    String(text || "")
  );
}

export function noninteractiveSelfReportSignal(text = "") {
  return /noninteractive-self-report|non-interactive|oauth cannot run/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    waived: waivedSignal(blob),
    refused: refusedSignal(blob),
    imprinted: imprintedSignal(blob),
    skipRefuses: skipRefusesSignal(blob),
    autoSucceeds: autoSucceedsSignal(blob),
    noCardRendered: noCardRenderedSignal(blob),
    firstPublishGate: firstPublishGateSignal(blob),
    noninteractiveSelfReport: noninteractiveSelfReportSignal(blob)
  };
}

export function folioImprinted(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.folioImprinted) || (boolish(t.imprinted) && !boolish(t.refused))) {
    return true;
  }
  return false;
}

export function modeRefuses(columnId) {
  const row = MODE_COLUMNS.find((cell) => cell.id === columnId);
  if (!row) return null;
  return row.firstPublish === "refused";
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const skipRefuses =
    boolish(t.skipRefuses) || t.skipModeRefuses === true || hits.skipRefuses;
  const autoSucceeds =
    boolish(t.autoSucceeds) || t.autoPublishesNormally === true || hits.autoSucceeds;
  const noCardRendered =
    boolish(t.noCardRendered) || t.cardRendered === false || hits.noCardRendered;
  const firstPublishGate =
    boolish(t.firstPublishGate) || t.refusesAtOnce === true || hits.firstPublishGate;
  const noninteractiveSelfReport =
    boolish(t.noninteractiveSelfReport) ||
    t.noninteractiveSelfReport === true ||
    hits.noninteractiveSelfReport;
  const imprintedClean = boolish(t.imprinted) || folioImprinted(t);
  const refusedHit =
    boolish(t.refused) || (skipRefuses && !boolish(t.imprinted) && !boolish(t.waived));
  const waivedHit = boolish(t.waived) || (hits.waived && !refusedHit && !imprintedClean);
  return {
    skipRefuses,
    autoSucceeds,
    noCardRendered,
    firstPublishGate,
    noninteractiveSelfReport,
    imprintedClean,
    refusedHit,
    waivedHit,
    folioImprinted: folioImprinted(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const refused = boolish(t.refused) || (print.refusedHit && !boolish(t.imprinted) && !boolish(t.waived));
  const imprinted = boolish(t.imprinted) || (print.imprintedClean && !boolish(t.refused));
  const waived = boolish(t.waived) || (print.waivedHit && !refused && !imprinted);
  return {
    waived,
    refused,
    imprinted,
    skipRefuses: boolish(t.skipRefuses) || print.skipRefuses,
    autoSucceeds: boolish(t.autoSucceeds) || print.autoSucceeds,
    noCardRendered: boolish(t.noCardRendered) || print.noCardRendered,
    firstPublishGate: boolish(t.firstPublishGate) || print.firstPublishGate,
    noninteractiveSelfReport:
      boolish(t.noninteractiveSelfReport) || print.noninteractiveSelfReport,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    desktop: t.desktop || MEASURED.desktop,
    os: t.os || MEASURED.os
  };
}

export function seedWaived() {
  return {
    seed: "waived",
    issue: 92740,
    waived: true,
    refused: false,
    imprinted: false,
    outputText: "waived; idle folio — Skip all approvals would cover the built-in Artifact tool; no first-publish refusal"
  };
}

export function seedRefused() {
  return {
    seed: "refused",
    issue: 92740,
    waived: false,
    refused: true,
    imprinted: false,
    skipRefuses: true,
    autoSucceeds: true,
    noCardRendered: true,
    firstPublishGate: true,
    noninteractiveSelfReport: true,
    hasClearRepro: true,
    skipModeRefuses: true,
    autoPublishesNormally: true,
    cardRendered: false,
    refusesAtOnce: true,
    errorText: MEASURED.errorText,
    outputText:
      "refused; first publish under Skip all approvals needs the approval card and no one can answer it; card never rendered",
    desktop: MEASURED.desktop
  };
}

export function seedImprinted() {
  return {
    seed: "imprinted",
    issue: 92740,
    waived: false,
    refused: false,
    imprinted: true,
    folioImprinted: true,
    skipTreatedLikeAuto: true,
    gateDocumentedOrRouted: true,
    desktop: MEASURED.desktop
  };
}

export function seeds() {
  return {
    waived: seedWaived(),
    refused: seedRefused(),
    imprinted: seedImprinted(),
    "skip-refuses": {
      seed: "skip-refuses",
      issue: 92740,
      skipRefuses: true,
      skipModeRefuses: true,
      errorText: MEASURED.errorText
    },
    "auto-succeeds": {
      seed: "auto-succeeds",
      issue: 92740,
      autoSucceeds: true,
      autoPublishesNormally: true
    },
    "no-card-rendered": {
      seed: "no-card-rendered",
      issue: 92740,
      noCardRendered: true,
      cardRendered: false
    },
    "first-publish-gate": {
      seed: "first-publish-gate",
      issue: 92740,
      firstPublishGate: true,
      refusesAtOnce: true
    },
    "noninteractive-self-report": {
      seed: "noninteractive-self-report",
      issue: 92740,
      noninteractiveSelfReport: true,
      oauthCannotRun: true
    },
    cousins: {
      seed: "cousins",
      issue: 92740,
      cousins: true,
      cousinsCiteOnly: [88997, 89967, 91883]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92740,
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
  "skip-refuses",
  "auto-succeeds",
  "no-card-rendered",
  "first-publish-gate",
  "noninteractive-self-report",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "skip-refuses": (t, c) => boolish(t.skipRefuses) || c.skipRefuses,
  "auto-succeeds": (t, c) => boolish(t.autoSucceeds) || c.autoSucceeds,
  "no-card-rendered": (t, c) => boolish(t.noCardRendered) || c.noCardRendered,
  "first-publish-gate": (t, c) => boolish(t.firstPublishGate) || c.firstPublishGate,
  "noninteractive-self-report": (t, c) =>
    boolish(t.noninteractiveSelfReport) || c.noninteractiveSelfReport,
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
      waived: false,
      refused: true,
      imprinted: false,
      chips: ["cousins", "refused"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      waived: false,
      refused: true,
      imprinted: false,
      chips: [seed, "refused"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "refused" &&
      seed !== "imprinted" &&
      seed !== "waived"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        waived: false,
        refused: true,
        imprinted: false,
        chips: [name, "refused"],
        folio
      };
    }
  }

  if (
    seed === "imprinted" ||
    (t.imprinted === true && t.refused !== true && seed !== "refused") ||
    (folio.imprinted && !folio.refused && seed !== "refused")
  ) {
    reasons.push(CHIP_REASONS.imprinted);
    return {
      verdict: "imprinted",
      reasons,
      waived: false,
      refused: false,
      imprinted: true,
      chips: ["imprinted"],
      folio
    };
  }

  if (t.refused === true || seed === "refused" || (folio.refused && !folio.imprinted && !folio.waived)) {
    reasons.push(CHIP_REASONS.refused);
    const chips = ["refused"];
    if (t.skipRefuses === true || folio.skipRefuses) chips.push("skip-refuses");
    if (t.autoSucceeds === true || folio.autoSucceeds) chips.push("auto-succeeds");
    if (t.noCardRendered === true || folio.noCardRendered) chips.push("no-card-rendered");
    if (t.firstPublishGate === true || folio.firstPublishGate) chips.push("first-publish-gate");
    if (t.noninteractiveSelfReport === true || folio.noninteractiveSelfReport) {
      chips.push("noninteractive-self-report");
    }
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "refused",
      reasons,
      waived: false,
      refused: true,
      imprinted: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "waived" || t.waived === true || folio.waived) {
    reasons.push(CHIP_REASONS.waived);
    return {
      verdict: "waived",
      reasons,
      waived: true,
      refused: false,
      imprinted: false,
      chips: ["waived"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      waived: false,
      refused: true,
      imprinted: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle folio is waived — HOLD: Skip all approvals would cover the built-in Artifact tool; no first-publish refusal"
  );
  return {
    verdict: "waived",
    reasons,
    waived: true,
    refused: false,
    imprinted: false,
    chips: ["waived"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedWaived();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedWaived();
  }
  return seedWaived();
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
    product: "imprimatur",
    issue: 92740,
    mark: "08:50 / hermes catalog #214 / #92740",
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
