/**
 * Byname — herald's byname / epithet registration desk.
 *
 * Autocomplete offers a plugin skill's bare name as a secondary label
 * (`orclab:orc-version (orc-version)`), but submitting that bare
 * `/orc-version` after dismissing autocomplete stamps an orange false
 * warning that it "isn't a recognized command here" / "only work in the
 * Claude Code terminal" — then the command resolves and runs anyway.
 * Accepting autocomplete (namespaced `/orclab:orc-version`) runs clean
 * with no warning. The client checks exact `name`/`aliases` before
 * resolution; plugin skill entries carry only the namespaced `name`,
 * so bare submission fails the check even though later resolution succeeds.
 *
 * Encoded from anthropics/claude-code#92738 issue facts only.
 * Hypothesis (NON-BINDING): Desktop slash registry validates against
 * plugin entry `name`/`aliases` before the skill resolver that accepts
 * bare skill names; autocomplete rewrite is the only path that inserts
 * the namespaced name the registry knows. Verify against issue text
 * only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "clear",
  "ambered",
  "bynamed",
  "bare-submit-warns",
  "namespaced-clean",
  "resolves-anyway",
  "autocomplete-offers-bare",
  "alias-missing",
  "misleading-terminal-copy",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["clear", "bynamed"]);

export const ALARM = new Set([
  "ambered",
  "bare-submit-warns",
  "namespaced-clean",
  "resolves-anyway",
  "autocomplete-offers-bare",
  "alias-missing",
  "misleading-terminal-copy",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "clear";
export const SEEDED_WORD = "ambered";

export const MEASURED = {
  issue: 92738,
  title:
    "plugin skill invoked by its bare name shows a false \"isn't a recognized command here\" warning",
  state: "open",
  labels: ["bug", "has repro", "platform:linux", "area:plugins", "area:desktop"],
  filed: "2026-09-07T21:33:00Z",
  updated: "2026-09-07T21:44:51Z",
  reporter: "artificialorctelligence",
  comments: 0,
  commentsCount: 0,
  desktop: "Claude Desktop 1.46388.2 (deb)",
  os: "Linux Mint 22.3",
  platform: "linux",
  claudeCode: "2.1.241",
  pluginSource: "local-path marketplace",
  surface: "Claude Desktop Code tab plugin skill slash recognition",
  model: "Opus",
  regression: false,
  neverWorked: true,
  pluginName: "orclab",
  skillName: "orc-version",
  namespacedForm: "/orclab:orc-version",
  bareForm: "/orc-version",
  autocompleteLabel: "orclab:orc-version (orc-version)",
  warningText:
    "/orc-version isn't a recognized command here. Some commands only work in the Claude Code terminal.",
  i18nId: "+9dhXtDFu6",
  clientSideOnly: true,
  nothingInLogs: true,
  checkParaphrase:
    "exact lowercase name/alias match; warning on !p(name)",
  pluginSkillEntriesCarryOnlyNamespacedName: true,
  bareSubmitAfterDismiss: true,
  namespacedAcceptClean: true,
  resolvesAndRunsAnyway: true,
  expected: "no warning for a command that resolves and runs",
  asks: [
    "put unambiguous bare form in aliases",
    "suppress warning when resolution succeeds",
    "fix misleading Claude Code terminal copy"
  ],
  actual:
    "bare /orc-version after dismissing autocomplete stamps an orange false warning then resolves and runs; accepting autocomplete rewrite to /orclab:orc-version runs clean with no warning",
  impact:
    "DESKTOP SLASH false-negative recognition on bare plugin-skill byname vs namespaced form, warning-then-success"
};

export const NAME_COLUMNS = [
  {
    id: "primary",
    role: "namespaced primary",
    form: "/orclab:orc-version",
    warning: false,
    runs: true,
    note: "accepting autocomplete rewrite — no warning, same success"
  },
  {
    id: "byname",
    role: "bare epithet / byname",
    form: "/orc-version",
    warning: true,
    runs: true,
    note: "Escape dismiss autocomplete then Enter — orange warning, then successful run"
  }
];

export const AUTOCOMPLETE = {
  offered: "orclab:orc-version (orc-version)",
  primary: "orclab:orc-version",
  secondaryBare: "orc-version",
  rewriteOnAccept: "/orclab:orc-version",
  remainsBareOnDismiss: "/orc-version"
};

export const COUSINS = [
  {
    slug: "advowson",
    issue: 91005,
    note: "Cite-only cousin. Advowson/#91005: Workflow name silently collates built-in; local workflows ignored. Different paradigm. Primary stays #92738."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Cite-only cousin. Springe/#92675: plugin PreToolUse hooks not enforced interactively. Different paradigm. Primary stays #92738."
  },
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Cite-only cousin. Speakpipe/#92646: Desktop blocks SendMessage entirely. Different paradigm. Primary stays #92738."
  },
  {
    slug: "muzzle",
    issue: 92459,
    note: "Cite-only cousin. Muzzle/#92459: safe-mode mutes skill log but leaks attachments. Different paradigm. Primary stays #92738."
  },
  {
    slug: "hangfire",
    note: "Cite-only cousin. Hangfire: queued /compact demoted to plain prompt. Different paradigm. Primary stays #92738."
  },
  {
    slug: "aphonia",
    note: "Cite-only cousin. Aphonia: roster shows names without speaking reed. Different paradigm. Primary stays #92738."
  },
  {
    slug: "catachresis",
    issue: 92518,
    note: "Cite-only cousin. Catachresis/#92518: MCP insufficient_scope mislabeled expired. Different paradigm. Primary stays #92738."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "advowson",
    issue: 91005,
    note: "Advowson/#91005: Workflow name silently collates built-in; local workflows ignored."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675: plugin PreToolUse hooks not enforced interactively."
  },
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Speakpipe/#92646: Desktop blocks SendMessage entirely."
  },
  {
    slug: "muzzle",
    issue: 92459,
    note: "Muzzle/#92459: safe-mode mutes skill log but leaks attachments."
  },
  {
    slug: "hangfire",
    note: "Hangfire: queued /compact demoted to plain prompt."
  },
  {
    slug: "aphonia",
    note: "Aphonia: roster shows names without speaking reed."
  },
  {
    slug: "catachresis",
    issue: 92518,
    note: "Catachresis/#92518: MCP insufficient_scope mislabeled expired."
  },
  {
    slug: "crenel",
    issue: 92729,
    note: "Crenel/#92729 already shipped — empty-object resources capability treated as absent. Do not touch."
  }
];

const CHIP_REASONS = {
  clear:
    "HOLD: idle folio is clear — no false warning; namespaced path or no bare submit. Score ambered or admit bynamed",
  ambered:
    "ALARM: folio ambered; bare /orc-version after dismissing autocomplete stamps orange wax — isn't a recognized command here / only work in the Claude Code terminal — then the command resolves and runs anyway. Score ambered or admit bynamed",
  bynamed:
    "folio already bynamed — bare epithet registered as an alias, or the warning is suppressed when resolution succeeds. Seeded admit word is bynamed",
  "bare-submit-warns":
    "bare-submit-warns — install plugin skill; Code tab; type bare /orc-version; Escape dismiss autocomplete; Enter → orange warning then successful run. Warning: /orc-version isn't a recognized command here. Some commands only work in the Claude Code terminal.",
  "namespaced-clean":
    "namespaced-clean — accepting autocomplete rewrite to /orclab:orc-version → no warning, same success. Contrast path against the bare byname",
  "resolves-anyway":
    "resolves-anyway — the warning is false; the command then resolves and runs correctly. Client-side only; nothing in logs",
  "autocomplete-offers-bare":
    "autocomplete-offers-bare — the menu itself displays the bare form as a secondary label: orclab:orc-version (orc-version). The UI offers the byname, then rejects it when submitted without the menu's rewrite",
  "alias-missing":
    "alias-missing — apparent check (reporter paraphrase of minified bundle): exact lowercase name/alias match; warning on !p(name). Plugin skill entries carry only the namespaced name, so bare submission fails the check. Ask: put unambiguous bare form in aliases",
  "misleading-terminal-copy":
    "misleading-terminal-copy — i18n id +9dhXtDFu6. Copy says some commands only work in the Claude Code terminal, sending users to a different surface when the command works in Desktop. Ask: fix the misleading terminal copy",
  cousins:
    "cite-only NOT Advowson/#91005 (Workflow name silently collates built-in; local workflows ignored). NOT Springe/#92675 (plugin PreToolUse hooks not enforced interactively). NOT Speakpipe/#92646 (Desktop blocks SendMessage entirely). NOT Muzzle/#92459 (safe-mode mutes skill log but leaks attachments). NOT Hangfire (queued /compact demoted to plain prompt). NOT Aphonia (roster shows names without speaking reed). NOT Catachresis/#92518 (MCP insufficient_scope mislabeled expired). NOT Crenel/#92729 (already shipped). Different paradigm: DESKTOP SLASH false-negative recognition on bare plugin-skill byname vs namespaced form, warning-then-success. Primary stays #92738",
  "has-clear-repro":
    "has-clear-repro — #92738 is labeled has repro: Claude Desktop 1.46388.2 (deb), Linux Mint 22.3, claude-code 2.1.241, local-path marketplace plugin; reporter artificialorctelligence; Code tab bare /orc-version Escape then Enter"
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

export function clearSignal(text = "") {
  return /idle folio is clear|pin idle clear|no false warning|namespaced path or no bare submit/i.test(
    String(text || "")
  );
}

export function amberedSignal(text = "") {
  return /ambered|amber wax|isn't a recognized command|false warning/i.test(String(text || ""));
}

export function bynamedSignal(text = "") {
  return /bynamed|bare epithet registered|already bynamed/i.test(String(text || ""));
}

export function bareSubmitWarnsSignal(text = "") {
  return /bare-submit-warns|Escape dismiss|bare \/orc-version/i.test(String(text || ""));
}

export function namespacedCleanSignal(text = "") {
  return /namespaced-clean|\/orclab:orc-version|accepting autocomplete/i.test(String(text || ""));
}

export function resolvesAnywaySignal(text = "") {
  return /resolves-anyway|resolves and runs|runs anyway/i.test(String(text || ""));
}

export function autocompleteOffersBareSignal(text = "") {
  return /autocomplete-offers-bare|orclab:orc-version \(orc-version\)|secondary label/i.test(
    String(text || "")
  );
}

export function aliasMissingSignal(text = "") {
  return /alias-missing|!p\(name\)|exact lowercase name\/alias|aliases/i.test(String(text || ""));
}

export function misleadingTerminalCopySignal(text = "") {
  return /misleading-terminal-copy|\+9dhXtDFu6|Claude Code terminal/i.test(String(text || ""));
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    clear: clearSignal(blob),
    ambered: amberedSignal(blob),
    bynamed: bynamedSignal(blob),
    bareSubmitWarns: bareSubmitWarnsSignal(blob),
    namespacedClean: namespacedCleanSignal(blob),
    resolvesAnyway: resolvesAnywaySignal(blob),
    autocompleteOffersBare: autocompleteOffersBareSignal(blob),
    aliasMissing: aliasMissingSignal(blob),
    misleadingTerminalCopy: misleadingTerminalCopySignal(blob)
  };
}

export function folioBynamed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.folioBynamed) || (boolish(t.bynamed) && !boolish(t.ambered))) {
    return true;
  }
  return false;
}

export function columnWarns(columnId) {
  const row = NAME_COLUMNS.find((cell) => cell.id === columnId);
  if (!row) return null;
  return row.warning;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const bareSubmitWarns =
    boolish(t.bareSubmitWarns) || t.bareSubmitAfterDismiss === true || hits.bareSubmitWarns;
  const namespacedClean =
    boolish(t.namespacedClean) || t.namespacedAcceptClean === true || hits.namespacedClean;
  const resolvesAnyway =
    boolish(t.resolvesAnyway) || t.resolvesAndRunsAnyway === true || hits.resolvesAnyway;
  const autocompleteOffersBare =
    boolish(t.autocompleteOffersBare) ||
    t.autocompleteLabel === "orclab:orc-version (orc-version)" ||
    hits.autocompleteOffersBare;
  const aliasMissing =
    boolish(t.aliasMissing) ||
    t.pluginSkillEntriesCarryOnlyNamespacedName === true ||
    hits.aliasMissing;
  const misleadingTerminalCopy =
    boolish(t.misleadingTerminalCopy) || t.i18nId === "+9dhXtDFu6" || hits.misleadingTerminalCopy;
  const bynamedClean = boolish(t.bynamed) || folioBynamed(t);
  const amberedHit =
    boolish(t.ambered) || (bareSubmitWarns && !boolish(t.bynamed) && !boolish(t.clear));
  const clearHit = boolish(t.clear) || (hits.clear && !amberedHit && !bynamedClean);
  return {
    bareSubmitWarns,
    namespacedClean,
    resolvesAnyway,
    autocompleteOffersBare,
    aliasMissing,
    misleadingTerminalCopy,
    bynamedClean,
    amberedHit,
    clearHit,
    folioBynamed: folioBynamed(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const ambered = boolish(t.ambered) || (print.amberedHit && !boolish(t.bynamed) && !boolish(t.clear));
  const bynamed = boolish(t.bynamed) || (print.bynamedClean && !boolish(t.ambered));
  const clear = boolish(t.clear) || (print.clearHit && !ambered && !bynamed);
  return {
    clear,
    ambered,
    bynamed,
    bareSubmitWarns: boolish(t.bareSubmitWarns) || print.bareSubmitWarns,
    namespacedClean: boolish(t.namespacedClean) || print.namespacedClean,
    resolvesAnyway: boolish(t.resolvesAnyway) || print.resolvesAnyway,
    autocompleteOffersBare: boolish(t.autocompleteOffersBare) || print.autocompleteOffersBare,
    aliasMissing: boolish(t.aliasMissing) || print.aliasMissing,
    misleadingTerminalCopy: boolish(t.misleadingTerminalCopy) || print.misleadingTerminalCopy,
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

export function seedClear() {
  return {
    seed: "clear",
    issue: 92738,
    clear: true,
    ambered: false,
    bynamed: false,
    reporter: MEASURED.reporter,
    outputText: "clear; idle folio — no false warning; namespaced path or no bare submit"
  };
}

export function seedAmbered() {
  return {
    seed: "ambered",
    issue: 92738,
    clear: false,
    ambered: true,
    bynamed: false,
    bareSubmitWarns: true,
    namespacedClean: true,
    resolvesAnyway: true,
    autocompleteOffersBare: true,
    aliasMissing: true,
    misleadingTerminalCopy: true,
    hasClearRepro: true,
    bareSubmitAfterDismiss: true,
    namespacedAcceptClean: true,
    resolvesAndRunsAnyway: true,
    pluginSkillEntriesCarryOnlyNamespacedName: true,
    autocompleteLabel: "orclab:orc-version (orc-version)",
    warningText: MEASURED.warningText,
    i18nId: "+9dhXtDFu6",
    outputText:
      "ambered; bare /orc-version after dismissing autocomplete stamps orange wax then resolves and runs anyway",
    reporter: MEASURED.reporter
  };
}

export function seedBynamed() {
  return {
    seed: "bynamed",
    issue: 92738,
    clear: false,
    ambered: false,
    bynamed: true,
    folioBynamed: true,
    aliasSeated: true,
    warningSuppressedOnResolve: true,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    clear: seedClear(),
    ambered: seedAmbered(),
    bynamed: seedBynamed(),
    "bare-submit-warns": {
      seed: "bare-submit-warns",
      issue: 92738,
      bareSubmitWarns: true,
      bareSubmitAfterDismiss: true,
      warningText: MEASURED.warningText
    },
    "namespaced-clean": {
      seed: "namespaced-clean",
      issue: 92738,
      namespacedClean: true,
      namespacedAcceptClean: true
    },
    "resolves-anyway": {
      seed: "resolves-anyway",
      issue: 92738,
      resolvesAnyway: true,
      resolvesAndRunsAnyway: true
    },
    "autocomplete-offers-bare": {
      seed: "autocomplete-offers-bare",
      issue: 92738,
      autocompleteOffersBare: true,
      autocompleteLabel: "orclab:orc-version (orc-version)"
    },
    "alias-missing": {
      seed: "alias-missing",
      issue: 92738,
      aliasMissing: true,
      pluginSkillEntriesCarryOnlyNamespacedName: true
    },
    "misleading-terminal-copy": {
      seed: "misleading-terminal-copy",
      issue: 92738,
      misleadingTerminalCopy: true,
      i18nId: "+9dhXtDFu6"
    },
    cousins: {
      seed: "cousins",
      issue: 92738,
      cousins: true,
      cousinsCiteOnly: [91005, 92675, 92646, 92459, 92518]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92738,
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
  "bare-submit-warns",
  "namespaced-clean",
  "resolves-anyway",
  "autocomplete-offers-bare",
  "alias-missing",
  "misleading-terminal-copy",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "bare-submit-warns": (t, c) => boolish(t.bareSubmitWarns) || c.bareSubmitWarns,
  "namespaced-clean": (t, c) => boolish(t.namespacedClean) || c.namespacedClean,
  "resolves-anyway": (t, c) => boolish(t.resolvesAnyway) || c.resolvesAnyway,
  "autocomplete-offers-bare": (t, c) => boolish(t.autocompleteOffersBare) || c.autocompleteOffersBare,
  "alias-missing": (t, c) => boolish(t.aliasMissing) || c.aliasMissing,
  "misleading-terminal-copy": (t, c) =>
    boolish(t.misleadingTerminalCopy) || c.misleadingTerminalCopy,
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
      clear: false,
      ambered: true,
      bynamed: false,
      chips: ["cousins", "ambered"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      clear: false,
      ambered: true,
      bynamed: false,
      chips: [seed, "ambered"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "ambered" &&
      seed !== "bynamed" &&
      seed !== "clear"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        clear: false,
        ambered: true,
        bynamed: false,
        chips: [name, "ambered"],
        folio
      };
    }
  }

  if (
    seed === "bynamed" ||
    (t.bynamed === true && t.ambered !== true && seed !== "ambered") ||
    (folio.bynamed && !folio.ambered && seed !== "ambered")
  ) {
    reasons.push(CHIP_REASONS.bynamed);
    return {
      verdict: "bynamed",
      reasons,
      clear: false,
      ambered: false,
      bynamed: true,
      chips: ["bynamed"],
      folio
    };
  }

  if (t.ambered === true || seed === "ambered" || (folio.ambered && !folio.bynamed && !folio.clear)) {
    reasons.push(CHIP_REASONS.ambered);
    const chips = ["ambered"];
    if (t.bareSubmitWarns === true || folio.bareSubmitWarns) chips.push("bare-submit-warns");
    if (t.namespacedClean === true || folio.namespacedClean) chips.push("namespaced-clean");
    if (t.resolvesAnyway === true || folio.resolvesAnyway) chips.push("resolves-anyway");
    if (t.autocompleteOffersBare === true || folio.autocompleteOffersBare) {
      chips.push("autocomplete-offers-bare");
    }
    if (t.aliasMissing === true || folio.aliasMissing) chips.push("alias-missing");
    if (t.misleadingTerminalCopy === true || folio.misleadingTerminalCopy) {
      chips.push("misleading-terminal-copy");
    }
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "ambered",
      reasons,
      clear: false,
      ambered: true,
      bynamed: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "clear" || t.clear === true || folio.clear) {
    reasons.push(CHIP_REASONS.clear);
    return {
      verdict: "clear",
      reasons,
      clear: true,
      ambered: false,
      bynamed: false,
      chips: ["clear"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      clear: false,
      ambered: true,
      bynamed: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle folio is clear — HOLD: no false warning; namespaced path or no bare submit"
  );
  return {
    verdict: "clear",
    reasons,
    clear: true,
    ambered: false,
    bynamed: false,
    chips: ["clear"],
    folio
  };
}
