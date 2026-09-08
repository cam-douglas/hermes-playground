/**
 * Dinkus — compositor's hairline-rule bench.
 *
 * Plugin-settings scripts extract frontmatter with
 *   sed -n '/^---$/,/^---$/{ /^---$/d; p; }'
 * A sed address range reopens every time the start pattern matches
 * again, so a body horizontal rule starts a second chase. Body keys
 * bleed into frontmatter. The published repro returns true\nfalse for
 * enabled, the help-style ENABLED=$(...) compare against "true" fails,
 * and the plugin takes the disabled path with nothing printed.
 *
 * Encoded from anthropics/claude-code#92798 issue facts only.
 * Hypothesis (NON-BINDING): sed address ranges restart on every
 * /^---$/ match so body horizontal rules reopen frontmatter extraction.
 * Invite verify against issue text only — do not invent unread source.
 * Do NOT implement the Sagexd08 fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "bound",
  "leaked",
  "closed",
  "sed-range-reopen",
  "body-hr-bleed",
  "enabled-true-false-concat",
  "silent-disabled-path",
  "false-as-missing",
  "validate-hr-count",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["bound", "closed"]);

export const ALARM = new Set([
  "leaked",
  "sed-range-reopen",
  "body-hr-bleed",
  "enabled-true-false-concat",
  "silent-disabled-path",
  "false-as-missing",
  "validate-hr-count",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "bound";
export const SEEDED_WORD = "leaked";
export const ADMIT_WORD = "closed";

export const PUBLISHED_REPRO = `---
enabled: true
---

# My Plugin

---

## Config reference

enabled: false
`;

export const MEASURED = {
  issue: 92798,
  title:
    "[BUG] parse-frontmatter.sh returns body content as frontmatter when the markdown body contains ---",
  state: "open",
  labels: ["bug", "has repro", "area:plugins"],
  filed: "2026-09-08T07:25:28Z",
  reporter: "Sagexd08",
  repoAt: "main (ab9b2cf)",
  scripts:
    "plugins/plugin-dev/skills/plugin-settings/scripts/",
  sed: "sed -n '/^---$/,/^---$/{ /^---$/d; p; }'",
  surface:
    "plugin settings frontmatter parser treats every --- as a sed range delimiter so body horizontal rules leak into frontmatter and silently disable plugins",
  expected:
    "true. Frontmatter is the block between the first two --- markers, so the enabled: false in the config docs shouldn't be part of it.",
  actual:
    "two lines (true\\nfalse). ENABLED=$(...) compared against \"true\" fails; disabled path with nothing printed",
  helpCompare: 'ENABLED=$(./parse-frontmatter.sh .claude/my-plugin.local.md enabled); if [ "$ENABLED" = "true" ]; then',
  reproFile: ".claude/my-plugin.local.md",
  repro: PUBLISHED_REPRO,
  otherParse: [
    "enabled: false errors with Field 'enabled' not found; not-found check is [ -z \"$VALUE\" ]",
    "field name goes straight into a grep pattern, so a key like my.field will match a similarly-named key instead",
    "if the closing --- is missing, the range just runs to EOF and the whole file comes back as frontmatter; no error"
  ],
  otherValidate: [
    "Check 3 counts --- anywhere in the file and passes if there are 2+; a file with no frontmatter at all but two horizontal rules in the body validates fine",
    "Check 7 reads the leaked multi-line value, so a file with a plain enabled: true gets warned that it should be boolean (true/false)",
    "Check 8 skips every --- when finding the body, so horizontal rules get dropped and the body present (N lines) count comes out short"
  ],
  citedFix:
    "Branch Sagexd08/claude-code fix/parse-frontmatter-range requires the opening --- on line 1 and quits at the closing one. Catalog product only — do not implement that fix here in anthropics/claude-code.",
  hypothesis:
    "NON-BINDING: sed address ranges restart on every /^---$/ match so body horizontal rules reopen frontmatter extraction. Invite verify against issue text only."
};

export const CHASE_LEDGER = [
  {
    id: "folio",
    role: "opening chase / first --- pair",
    tally: "enabled: true",
    note: "frontmatter should stop at the first closing ---; the body hairline stays in the body"
  },
  {
    id: "dinkus",
    role: "body hairline / compositor's dinkus",
    tally: "--- in Config reference",
    note: "a sed range reopens every time the start pattern matches again; the body hairline starts a second chase"
  },
  {
    id: "closed",
    role: "closed folio / admit",
    tally: "line-1 open, quit at first close",
    note: "hypothetical: parser requires opening --- on line 1 and quits at first close; body rules cannot reopen"
  }
];

export const REPRO_TABLE = [
  { step: "frontmatter", mark: "enabled: true", note: "first chase" },
  { step: "body dinkus", mark: "---", note: "hairline in the docs section" },
  { step: "docs key", mark: "enabled: false", note: "should stay in the body" },
  { step: "parser out", mark: "true\\nfalse", note: "help-style compare against true fails" }
];

export const COUSINS = [
  {
    id: 52755,
    state: "closed",
    title: "Markdown horizontal rule (`---`) renders like a user interruption divider",
    note: "cite-only — TUI render of ---, different shape; not the plugin-settings sed range"
  },
  {
    id: 44901,
    state: "closed",
    title: "[DOCS] Plugin output styles docs omit `keep-coding-instructions` frontmatter support",
    note: "cite-only — plugin frontmatter docs, different shape; not parse-frontmatter.sh"
  },
  {
    id: 19377,
    state: "closed",
    title: "[DOCS] paths: frontmatter syntax in rules files is incorrect",
    note: "cite-only — rules frontmatter docs, different shape; primary stays #92798"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "homonym",
    issue: 92787,
    note: "Homonym/#92787 already shipped — Desktop UUID connector mounts. Do not touch."
  },
  {
    slug: "clepsydra",
    issue: 92776,
    note: "Clepsydra/#92776 already shipped — OTel mid-session meter. Do not touch."
  },
  {
    slug: "rushlight",
    issue: 92784,
    note: "Rushlight/#92784 already shipped — session-scoped TCC AppData. Do not touch."
  },
  {
    slug: "letoff",
    issue: 92771,
    note: "Letoff/#92771 already shipped — libuv Shift+Enter flatten. Do not touch."
  },
  {
    slug: "espagnolette",
    issue: 92694,
    note: "Espagnolette/#92694 already shipped — AskUserQuestion selection keys. Do not touch."
  },
  {
    slug: "cribble",
    issue: 92684,
    note: "Cribble/#92684 already shipped. Do not touch."
  },
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675 already shipped. Do not touch."
  }
];

export const BACKUPS = [
  { id: 92788, note: "AskUserQuestion free-text discard — README only; do not auto-pick" },
  { id: 92761, note: "worktree plugin row order — README only; do not auto-pick" },
  { id: 92801, note: "workspace trust not persisted — README only; do not auto-pick" }
];

const CHIP_REASONS = {
  bound:
    "HOLD: folio is bound — frontmatter stops at the first closing ---; body hairlines stay in the body. Score leaked or admit closed",
  leaked:
    "ALARM: sed range reopens on body ---; body keys bleed into frontmatter. Parser returns true\\nfalse; plugin takes the silent disabled path. Score leaked or admit closed",
  closed:
    "folio already closed — parser requires opening --- on line 1 and quits at first close; body rules cannot reopen. Admit word is closed",
  "sed-range-reopen":
    "sed-range-reopen — sed -n '/^---$/,/^---$/{ /^---$/d; p; }' reopens every time the start pattern matches again, so any --- further down the file starts a second range",
  "body-hr-bleed":
    "body-hr-bleed — a horizontal rule in the body of a settings file makes whatever follows it get treated as frontmatter",
  "enabled-true-false-concat":
    "enabled-true-false-concat — published repro: parse-frontmatter.sh .claude/my-plugin.local.md enabled returns true\\nfalse (frontmatter enabled: true plus body docs enabled: false)",
  "silent-disabled-path":
    "silent-disabled-path — help-style ENABLED=$(... enabled) compare against \"true\" fails on true\\nfalse; plugin takes the disabled path with nothing printed to tell you why",
  "false-as-missing":
    "false-as-missing — enabled: false errors with Field 'enabled' not found; the not-found check is [ -z \"$VALUE\" ], which cannot tell a missing key from one whose value is empty or false",
  "validate-hr-count":
    "validate-hr-count — validate-settings.sh Check 3 counts --- anywhere and passes if there are 2+ (no-frontmatter file with two body rules validates); Check 7 warns boolean on leaked multi-line; Check 8 drops body rules from the body line count",
  cousins:
    "cite-only neighbourhood — #52755 CLOSED TUI --- divider; #44901 CLOSED plugin frontmatter docs; #19377 CLOSED rules paths: frontmatter docs. Primary stays #92798",
  "has-clear-repro":
    "has-clear-repro — #92798 is labeled has repro: parse-frontmatter.sh returns body content as frontmatter when the markdown body contains ---; filed 2026-09-08T07:25:28Z; labels bug, has repro, area:plugins; repo at main (ab9b2cf)"
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

/**
 * Educational reconstruction of the published sed range (not an exploit):
 * sed -n '/^---$/,/^---$/{ /^---$/d; p; }'
 * A sed address range reopens whenever /^---$/ matches again.
 */
export function sedRangeExtract(markdown = "") {
  const lines = String(markdown).split(/\r?\n/);
  const out = [];
  let inRange = false;
  for (const line of lines) {
    if (line === "---") {
      inRange = !inRange;
      continue;
    }
    if (inRange) out.push(line);
  }
  return out.join("\n");
}

/**
 * Educational contrast for the cited admit path: opening --- on line 1,
 * quit at the first close. Body hairlines cannot reopen the chase.
 */
export function closedExtract(markdown = "") {
  const lines = String(markdown).split(/\r?\n/);
  if (lines[0] !== "---") return "";
  const out = [];
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === "---") break;
    out.push(lines[i]);
  }
  return out.join("\n");
}

export function lookupField(frontmatter = "", field = "enabled") {
  const values = [];
  const pattern = new RegExp(String(field));
  for (const line of String(frontmatter).split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (pattern.test(key) || pattern.test(line)) {
      values.push(line.slice(idx + 1).trim());
    }
  }
  return values.join("\n");
}

export function publishedReproOutput() {
  return lookupField(sedRangeExtract(PUBLISHED_REPRO), "enabled");
}

export function boundSignal(text = "") {
  return /idle folio is bound|pin idle bound|frontmatter stops at the first closing|body hairlines stay in the body/i.test(
    String(text || "")
  );
}

export function leakedSignal(text = "") {
  return /sed range reopens|body keys bleed|true\\nfalse|silent disabled path|body content as frontmatter/i.test(
    String(text || "")
  );
}

export function closedSignal(text = "") {
  return /already closed|opening --- on line 1|quits at first close|body rules cannot reopen/i.test(
    String(text || "")
  );
}

export function sedRangeReopenSignal(text = "") {
  return /sed-range-reopen|sed -n|\/\^---\$\/|start pattern matches again/i.test(
    String(text || "")
  );
}

export function bodyHrBleedSignal(text = "") {
  return /body-hr-bleed|horizontal rule in the body|whatever follows it get treated/i.test(
    String(text || "")
  );
}

export function enabledConcatSignal(text = "") {
  return /enabled-true-false-concat|true\\nfalse|true\nfalse|my-plugin\.local\.md enabled/i.test(
    String(text || "")
  );
}

export function silentDisabledSignal(text = "") {
  return /silent-disabled-path|compare against "true"|nothing printed|disabled path/i.test(
    String(text || "")
  );
}

export function falseAsMissingSignal(text = "") {
  return /false-as-missing|Field 'enabled' not found|\[ -z "\$VALUE" \]|value is empty or false/i.test(
    String(text || "")
  );
}

export function validateHrCountSignal(text = "") {
  return /validate-hr-count|Check 3|two horizontal rules|body present \(N lines\)/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    bound: boundSignal(blob),
    leaked: leakedSignal(blob),
    closed: closedSignal(blob),
    sedRangeReopen: sedRangeReopenSignal(blob),
    bodyHrBleed: bodyHrBleedSignal(blob),
    enabledConcat: enabledConcatSignal(blob),
    silentDisabled: silentDisabledSignal(blob),
    falseAsMissing: falseAsMissingSignal(blob),
    validateHrCount: validateHrCountSignal(blob)
  };
}

export function chaseWasLeaked(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.leaked) || boolish(t.chaseLeaked) || boolish(t.bodyBleed)) {
    return true;
  }
  return leakedSignal(extractText(t));
}

export function folioClosed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.folioClosed) || (boolish(t.closed) && !boolish(t.leaked))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const leakedHit =
    boolish(t.leaked) || (chaseWasLeaked(t) && !boolish(t.closed) && !boolish(t.bound));
  const closedClean = boolish(t.closed) || folioClosed(t);
  const boundHit = boolish(t.bound) || (hits.bound && !leakedHit && !closedClean);
  return {
    leakedHit,
    closedClean,
    boundHit,
    sedRangeReopen: boolish(t.sedRangeReopen) || hits.sedRangeReopen,
    bodyHrBleed: boolish(t.bodyHrBleed) || hits.bodyHrBleed,
    enabledConcat: boolish(t.enabledTrueFalseConcat) || hits.enabledConcat,
    silentDisabled: boolish(t.silentDisabledPath) || hits.silentDisabled,
    falseAsMissing: boolish(t.falseAsMissing) || hits.falseAsMissing,
    validateHrCount: boolish(t.validateHrCount) || hits.validateHrCount,
    folioClosed: folioClosed(t),
    chaseLeaked: leakedHit,
    chaseBound: closedClean && !leakedHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const leaked = boolish(t.leaked) || (print.leakedHit && !boolish(t.closed) && !boolish(t.bound));
  const closed = boolish(t.closed) || (print.closedClean && !boolish(t.leaked));
  const bound = boolish(t.bound) || (print.boundHit && !leaked && !closed);
  return {
    bound,
    leaked,
    closed,
    sedRangeReopen: boolish(t.sedRangeReopen) || print.sedRangeReopen,
    bodyHrBleed: boolish(t.bodyHrBleed) || print.bodyHrBleed,
    enabledTrueFalseConcat: boolish(t.enabledTrueFalseConcat) || print.enabledConcat,
    silentDisabledPath: boolish(t.silentDisabledPath) || print.silentDisabled,
    falseAsMissing: boolish(t.falseAsMissing) || print.falseAsMissing,
    validateHrCount: boolish(t.validateHrCount) || print.validateHrCount,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    scripts: t.scripts || MEASURED.scripts,
    sed: t.sed || MEASURED.sed
  };
}

export function seedBound() {
  return {
    seed: "bound",
    issue: 92798,
    bound: true,
    leaked: false,
    closed: false,
    outputText:
      "bound; idle folio — frontmatter stops at the first closing ---; body hairlines stay in the body"
  };
}

export function seedLeaked() {
  return {
    seed: "leaked",
    issue: 92798,
    bound: false,
    leaked: true,
    closed: false,
    chaseLeaked: true,
    bodyBleed: true,
    sedRangeReopen: true,
    bodyHrBleed: true,
    enabledTrueFalseConcat: true,
    silentDisabledPath: true,
    falseAsMissing: true,
    validateHrCount: true,
    hasClearRepro: true,
    outputText:
      "leaked; sed range reopens on body ---; body keys bleed into frontmatter; true\\nfalse; silent disabled path",
    scripts: MEASURED.scripts,
    sed: MEASURED.sed
  };
}

export function seedClosed() {
  return {
    seed: "closed",
    issue: 92798,
    bound: false,
    leaked: false,
    closed: true,
    folioClosed: true,
    lineOneOpen: true,
    scripts: MEASURED.scripts
  };
}

export function seeds() {
  return {
    bound: seedBound(),
    leaked: seedLeaked(),
    closed: seedClosed(),
    "sed-range-reopen": { seed: "sed-range-reopen", issue: 92798, sedRangeReopen: true },
    "body-hr-bleed": { seed: "body-hr-bleed", issue: 92798, bodyHrBleed: true },
    "enabled-true-false-concat": {
      seed: "enabled-true-false-concat",
      issue: 92798,
      enabledTrueFalseConcat: true
    },
    "silent-disabled-path": {
      seed: "silent-disabled-path",
      issue: 92798,
      silentDisabledPath: true
    },
    "false-as-missing": { seed: "false-as-missing", issue: 92798, falseAsMissing: true },
    "validate-hr-count": { seed: "validate-hr-count", issue: 92798, validateHrCount: true },
    cousins: { seed: "cousins", issue: 92798, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92798,
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
  "sed-range-reopen",
  "body-hr-bleed",
  "enabled-true-false-concat",
  "silent-disabled-path",
  "false-as-missing",
  "validate-hr-count",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "sed-range-reopen": (t, c) => boolish(t.sedRangeReopen) || c.sedRangeReopen,
  "body-hr-bleed": (t, c) => boolish(t.bodyHrBleed) || c.bodyHrBleed,
  "enabled-true-false-concat": (t, c) =>
    boolish(t.enabledTrueFalseConcat) || c.enabledTrueFalseConcat,
  "silent-disabled-path": (t, c) => boolish(t.silentDisabledPath) || c.silentDisabledPath,
  "false-as-missing": (t, c) => boolish(t.falseAsMissing) || c.falseAsMissing,
  "validate-hr-count": (t, c) => boolish(t.validateHrCount) || c.validateHrCount,
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
      bound: false,
      leaked: true,
      closed: false,
      chips: ["cousins", "leaked"],
      folio
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      bound: false,
      leaked: true,
      closed: false,
      chips: [seed, "leaked"],
      folio
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, folio) &&
      seed !== "leaked" &&
      seed !== "closed" &&
      seed !== "bound"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        bound: false,
        leaked: true,
        closed: false,
        chips: [name, "leaked"],
        folio
      };
    }
  }

  if (
    seed === "closed" ||
    (t.closed === true && t.leaked !== true && seed !== "leaked") ||
    (folio.closed && !folio.leaked && seed !== "leaked")
  ) {
    reasons.push(CHIP_REASONS.closed);
    return {
      verdict: "closed",
      reasons,
      bound: false,
      leaked: false,
      closed: true,
      chips: ["closed"],
      folio
    };
  }

  if (t.leaked === true || seed === "leaked" || (folio.leaked && !folio.closed && !folio.bound)) {
    reasons.push(CHIP_REASONS.leaked);
    const chips = ["leaked"];
    if (t.sedRangeReopen === true || folio.sedRangeReopen) chips.push("sed-range-reopen");
    if (t.bodyHrBleed === true || folio.bodyHrBleed) chips.push("body-hr-bleed");
    if (t.enabledTrueFalseConcat === true || folio.enabledTrueFalseConcat) {
      chips.push("enabled-true-false-concat");
    }
    if (t.silentDisabledPath === true || folio.silentDisabledPath) {
      chips.push("silent-disabled-path");
    }
    if (t.falseAsMissing === true || folio.falseAsMissing) chips.push("false-as-missing");
    if (t.validateHrCount === true || folio.validateHrCount) chips.push("validate-hr-count");
    if (t.hasClearRepro === true || folio.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "leaked",
      reasons,
      bound: false,
      leaked: true,
      closed: false,
      chips: [...new Set(chips)],
      folio
    };
  }

  if (HOLD.has(seed) || seed === "bound" || t.bound === true || folio.bound) {
    reasons.push(CHIP_REASONS.bound);
    return {
      verdict: "bound",
      reasons,
      bound: true,
      leaked: false,
      closed: false,
      chips: ["bound"],
      folio
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`alarm ${seed}`);
    return {
      verdict: seed,
      reasons,
      bound: false,
      leaked: true,
      closed: false,
      chips: [seed],
      folio
    };
  }

  reasons.push(
    "empty probe; idle folio is bound — HOLD: frontmatter stops at the first closing ---; body hairlines stay in the body"
  );
  return {
    verdict: "bound",
    reasons,
    bound: true,
    leaked: false,
    closed: false,
    chips: ["bound"],
    folio
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBound();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedBound();
  }
  return seedBound();
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
    product: "dinkus",
    issue: 92798,
    mark: "17:50 / hermes catalog #223 / #92798",
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
