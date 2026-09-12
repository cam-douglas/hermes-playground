#!/usr/bin/env node
/**
 * Snuffer — candle-snuffer / taper booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Setting "enableArtifact": false in ~/.claude/settings.json also
 * removes the Scratchpad directory: line from the system prompt /
 * environment block. Artifact publishing and the agent's session temp
 * (scratchpad) directory are unrelated features that became wrongly
 * coupled.
 *
 *   isScratchpadEnabled()    = P("tengu_scratch", false) || isArtifactToolEligible()
 *   isArtifactToolEligible() = !br() && vl()
 *   br() reflects enableArtifact / disableArtifact / CLAUDE_CODE_DISABLE_ARTIFACT
 *
 * The || isArtifactToolEligible() arm entered in 2.1.186. In 2.1.185
 * and earlier the expression was P("tengu_scratch", false) alone, so
 * the artifact setting could not affect the scratchpad. With
 * tengu_scratch off (its default), enableArtifact: false alone now
 * disables the scratchpad. There is no local opt-in for tengu_scratch
 * (getEnvironmentOverrides null; readConfigOverrides undefined;
 * cachedGrowthBookFeatures skipped when remoteEvalFeatureValues.size
 * > 0). Turning artifacts off is a one-way door for scratchpad.
 *
 *   node snuffer.mjs data/snuffed.json
 *   echo '{"seed":"snuffed"}' | node snuffer.mjs
 *
 * Idle word is lit (HOLD: scratchpad directory still announced).
 * Seeded word is snuffed (#93746 — enableArtifact false kills
 * scratchpad).
 * Path word is ganged-or.
 * Product score word is snuffer (Score snuffer or admit lit.).
 *
 * Encoded from anthropics/claude-code#93746 issue text only.
 * Hypothesis (NON-BINDING): restore scratchpad gate to tengu_scratch
 * (or a dedicated local setting) independent of isArtifactToolEligible.
 * Verify against #93746 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix. No
 * network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "hold",
  "decouple-gates",
  "tengu-scratch",
  "artifact-gate",
  "one-way-door",
  "environment-update",
  "scratchpad-line",
  "enable-artifact-false",
  "regression-186",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "lit";
export const PATH_WORD = "ganged-or";
export const SEEDED_WORD = "snuffed";
export const PRODUCT_WORD = "snuffer";
export const HOLD = Object.freeze(["lit", "hold"]);
export const RECOVER = Object.freeze(["lit", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "intact",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "snuffed" && name !== "snuffer"),
);

export const FEATURED_ISSUE = 93746;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93746";
export const TITLE =
  "[BUG] enableArtifact: false also disables the scratchpad directory";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "has repro", "area:core"]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "2.1.269";
export const LAST_WORKING = "2.1.185";
export const REGRESSION_BUILD = "2.1.186";
export const TENGU_FLAG = "tengu_scratch";
export const TENGU_DEFAULT = false;
export const ARTIFACT_KEY = "enableArtifact";
export const ARTIFACT_LEGACY = "disableArtifact";
export const ARTIFACT_ENV = "CLAUDE_CODE_DISABLE_ARTIFACT";
export const SETTINGS_PATH = "~/.claude/settings.json";
export const SCRATCHPAD_LINE = "Scratchpad directory:";
export const ENV_UPDATE =
  "The scratchpad directory announced earlier is no longer available";
export const COUPLING =
  'isScratchpadEnabled() = P("tengu_scratch", false) || isArtifactToolEligible()';
export const ARTIFACT_ELIGIBLE = "isArtifactToolEligible() = !br() && vl()";
export const ABSENT_BUILDS = Object.freeze([121, 161, 174, 179, 183, 185]);
export const PRESENT_BUILDS = Object.freeze([
  186, 187, 202, 224, 236, 238, 240, 241, 242, 258, 259, 267, 268, 269,
]);
export const OS_LABEL = "Windows";
export const SHELL_LABEL = "PowerShell";
export const SURFACE = "Anthropic API";
export const PHRASE = "Score snuffer or admit lit.";
export const DISTRIBUTION =
  'Setting "enableArtifact": false in ~/.claude/settings.json also removes the Scratchpad directory: line from the system prompt / environment block. Artifact publishing and the agent\'s session temp (scratchpad) directory are unrelated features that became wrongly coupled. Coupling: isScratchpadEnabled() = P("tengu_scratch", false) || isArtifactToolEligible(); isArtifactToolEligible() = !br() && vl() where br() reflects enableArtifact / disableArtifact / CLAUDE_CODE_DISABLE_ARTIFACT. The || isArtifactToolEligible() arm entered in 2.1.186. In 2.1.185 and earlier the expression was P("tengu_scratch", false) alone, so the artifact setting could not affect the scratchpad. With tengu_scratch off (its default), enableArtifact: false alone now disables the scratchpad. There is no local opt-in for tengu_scratch (getEnvironmentOverrides null; readConfigOverrides undefined; cachedGrowthBookFeatures skipped when remoteEvalFeatureValues.size > 0). Turning artifacts off is a one-way door for scratchpad. Coupling absent in 121, 161, 174, 179, 183, 185; present in 186+ through 269. Repro: interactive session shows Scratchpad directory → set enableArtifact false → Environment update says scratchpad no longer available → set true → line returns. Expected: scratchpad gated on its own setting, not on enableArtifact.';
export const SESSION_KIND =
  "Windows PowerShell interactive session on Claude Code 2.1.269 (Anthropic API). Scratchpad directory announced in the Environment block. enableArtifact: false in ~/.claude/settings.json. Environment update: scratchpad no longer available. Set true; the line returns. tengu_scratch off (default); no local opt-in.";
export const RULED_OUT = Object.freeze([
  "artifact publishing and the scratchpad being the same feature (the report treats them as unrelated)",
  "tengu_scratch having a local opt-in (getEnvironmentOverrides null; readConfigOverrides undefined; cachedGrowthBookFeatures skipped when remoteEvalFeatureValues.size > 0)",
  "this being the original design of enableArtifact (coupling absent through 2.1.185; disableArtifact already existed then)",
  "the scratchpad remaining announced when only artifacts are snuffed (the Environment update says it is no longer available)",
]);
export const EXPECTED = Object.freeze([
  "scratchpad gated on its own setting, not on enableArtifact",
  "restore the scratchpad gate to tengu_scratch (or a dedicated local setting) independent of isArtifactToolEligible",
  "turning artifacts off must not be a one-way door for the session temp directory",
]);

export const SNUFFER_PLAQUES = Object.freeze([
  { id: "artifact", label: "artifact flame", count: "snuffed", note: "enableArtifact false" },
  { id: "taper", label: "scratchpad taper", count: "gone", note: SCRATCHPAD_LINE },
  { id: "gang", label: "ganged OR", count: "186+", note: COUPLING },
  { id: "tengu", label: "tengu_scratch", count: "off", note: "default; no local opt-in" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "artifact-flame",
    survey: "light the artifact flame (enableArtifact default / true)",
    kind: "artifact-flame",
    note: "seeded: snuffing the artifact flame should leave the scratchpad taper burning",
  },
  {
    id: "scratchpad-taper",
    survey: "read the scratchpad taper (Scratchpad directory: still announced)",
    kind: "scratchpad-taper",
    note: "seeded: Environment update says the taper is no longer available",
  },
  {
    id: "brass-snuffer",
    survey: "lower the brass snuffer (enableArtifact: false in settings.json)",
    kind: "brass-snuffer",
    note: "seeded: one cup covers both wicks because they share a ganged OR",
  },
  {
    id: "ganged-bar",
    survey: "trace the ganged-or bar (|| isArtifactToolEligible since 2.1.186)",
    kind: "ganged-bar",
    note: "seeded: with tengu_scratch off, artifact eligibility is the only remaining wick",
  },
  {
    id: "one-way-door",
    survey: "try the local opt-in (tengu_scratch has none)",
    kind: "one-way-door",
    note: "seeded: getEnvironmentOverrides null; turning artifacts off is a one-way door",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "ganged-or",
  "snuffed",
  "tengu-scratch",
  "artifact-gate",
  "one-way-door",
  "environment-update",
  "scratchpad-line",
  "enable-artifact-false",
  "regression-186",
]);

export const COUSINS = Object.freeze([
  {
    issue: 87734,
    title: "artifact publish auto-arms Monitor; opt-out is CLAUDE_CODE_DISABLE_ARTIFACT",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #87734 Artifact publish auto-arms a Monitor; no opt-out short of CLAUDE_CODE_DISABLE_ARTIFACT. Related artifact setting, different surface. Do not rebuild",
  },
  {
    issue: 91395,
    title: "artifact tool schema loads with no opt-out except a deny rule",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91395 Artifact tool schema loads eagerly; no opt-out except a deny rule. Related artifact gate, not scratchpad coupling. Do not rebuild",
  },
  {
    issue: 92166,
    title: "scratchpad under /tmp erased on reboot",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #92166 Scratchpad directory under /tmp is erased on reboot. Same scratchpad directory, different volatility defect. Do not rebuild",
  },
  {
    issue: 78013,
    title: "export scratchpad path as CLAUDE_SCRATCHPAD",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #78013 Feature request: export the session scratchpad path as CLAUDE_SCRATCHPAD. Same directory, not the ganged-or gate. Do not rebuild",
  },
  {
    issue: 80606,
    title: "Artifact tool not loaded in claude -p even with enableArtifact true",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #80606 enableArtifact true still does not load Artifact in claude -p. Same setting key, opposite polarity, not scratchpad. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93744,
    title: "/goal stop evaluator blind",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93722,
    title: "worktree connector disable-list / umbilical",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93672,
    title: "idle_prompt while background subagents running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93680,
    title: "Bash mkdir via /proc/self/fd",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93694,
    title: "WSL Open-in paths",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93751,
    title: "phantom Chrome browser",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93761,
    title: "disable-model-invocation Skill tool",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palimpsest",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
]);

export const SAMPLE_TAPER = Object.freeze({
  announced: false,
  line: SCRATCHPAD_LINE,
  gone: true,
});

export const SAMPLE_LIT_TAPER = Object.freeze({
  announced: true,
  line: SCRATCHPAD_LINE,
  gone: false,
});

export const SAMPLE_FLAME = Object.freeze({
  enableArtifact: false,
  eligible: false,
  snuffed: true,
});

export const SAMPLE_LIT_FLAME = Object.freeze({
  enableArtifact: true,
  eligible: true,
  snuffed: false,
});

export const SAMPLE_GANG = Object.freeze({
  coupled: true,
  expression: COUPLING,
  since: REGRESSION_BUILD,
});

export const SAMPLE_LIT_GANG = Object.freeze({
  coupled: false,
  expression: 'P("tengu_scratch", false)',
  since: LAST_WORKING,
});

export const SAMPLE_TENGU = Object.freeze({
  flag: TENGU_FLAG,
  on: false,
  localOptIn: false,
});

export const SAMPLE_LIT_TENGU = Object.freeze({
  flag: TENGU_FLAG,
  on: false,
  localOptIn: true,
});

export const SAMPLE_DOOR = Object.freeze({
  oneWay: true,
  envOverrides: null,
  configOverrides: undefined,
  growthBookSkipped: true,
});

export const SAMPLE_LIT_DOOR = Object.freeze({
  oneWay: false,
  envOverrides: { tengu_scratch: true },
  configOverrides: { tengu_scratch: true },
  growthBookSkipped: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "scratchpad taper stays announced; artifact flame and taper are separate wicks" },
  { t: "enable-artifact-false", line: "settings.json sets enableArtifact false — brass snuffer covers the artifact flame" },
  { t: "tengu-scratch", line: "tengu_scratch is off (default); no local opt-in" },
  { t: "artifact-gate", line: "isArtifactToolEligible is false once br() reflects the snuffed flame" },
  { t: "ganged-or", line: "isScratchpadEnabled ORs tengu_scratch with artifact eligibility — both arms false" },
  { t: "environment-update", line: "Environment update: The scratchpad directory announced earlier is no longer available" },
  { t: "scratchpad-line", line: "Scratchpad directory: vanishes from the environment block" },
  { t: "one-way-door", line: "getEnvironmentOverrides null; turning artifacts off is a one-way door" },
  { t: "regression-186", line: "coupling absent through 2.1.185; present from 2.1.186 through 2.1.269" },
  { t: "path", line: "ganged-or — the || isArtifactToolEligible arm is the shared wick" },
  { t: "score", line: "when the snuffer cup covers both wicks the booth is a snuffer — Score snuffer or admit lit." },
]);

export function inspectTaper(input = {}) {
  const taper =
    input.taper && typeof input.taper === "object"
      ? input.taper
      : input.lit === true && input.snuffed !== true
        ? SAMPLE_LIT_TAPER
        : SAMPLE_TAPER;
  const forcedGone =
    input.snuffed === true ||
    input.gangedOr === true ||
    input.event === "snuffed" ||
    input.event === "snuffer" ||
    input.event === "ganged-or" ||
    input.event === "scratchpad-line";
  const gone = forcedGone ? true : taper.gone === true && input.lit !== true;
  return {
    announced: !gone,
    line: SCRATCHPAD_LINE,
    gone,
    stamp: gone ? "taper-gone" : "taper-announced",
    note: gone
      ? "scratchpad taper extinguished — Scratchpad directory: no longer available"
      : "scratchpad taper stays announced in the Environment block",
  };
}

export function inspectFlame(input = {}) {
  const flame =
    input.flame && typeof input.flame === "object"
      ? input.flame
      : input.lit === true && input.snuffed !== true
        ? SAMPLE_LIT_FLAME
        : SAMPLE_FLAME;
  const forcedSnuff =
    input.enableArtifactFalse === true ||
    input.event === "enable-artifact-false" ||
    input.event === "artifact-gate" ||
    (input.snuffed === true && input.lit !== true);
  const snuffed = forcedSnuff ? true : flame.snuffed === true;
  return {
    enableArtifact: !snuffed,
    eligible: !snuffed,
    snuffed,
    stamp: snuffed ? "flame-snuffed" : "flame-burning",
    note: snuffed
      ? "artifact flame snuffed — enableArtifact false / disableArtifact / CLAUDE_CODE_DISABLE_ARTIFACT"
      : "artifact flame stays eligible; defaultOn true",
  };
}

export function inspectGang(input = {}) {
  const gang =
    input.gang && typeof input.gang === "object"
      ? input.gang
      : input.lit === true && input.snuffed !== true
        ? SAMPLE_LIT_GANG
        : SAMPLE_GANG;
  const forcedCouple =
    input.gangedOr === true ||
    input.event === "ganged-or" ||
    input.event === "regression-186" ||
    (input.snuffed === true && input.lit !== true);
  const coupled = forcedCouple ? true : gang.coupled === true;
  return {
    coupled,
    expression: coupled ? COUPLING : 'P("tengu_scratch", false)',
    since: coupled ? REGRESSION_BUILD : LAST_WORKING,
    stamp: coupled ? "gang-coupled" : "gang-decoupled",
    note: coupled
      ? "ganged OR since 2.1.186 — artifact eligibility shares the scratchpad wick"
      : "scratchpad gated on tengu_scratch alone; artifact setting cannot reach the taper",
  };
}

export function inspectTengu(input = {}) {
  const tengu =
    input.tengu && typeof input.tengu === "object"
      ? input.tengu
      : input.lit === true && input.snuffed !== true
        ? SAMPLE_LIT_TENGU
        : SAMPLE_TENGU;
  const forcedOff =
    input.tenguScratch === true ||
    input.event === "tengu-scratch" ||
    input.gangedOr === true ||
    (input.snuffed === true && input.lit !== true);
  const on = forcedOff ? false : tengu.on === true;
  const localOptIn = forcedOff ? false : tengu.localOptIn === true;
  return {
    flag: TENGU_FLAG,
    on,
    localOptIn,
    stamp: localOptIn ? "tengu-opt-in" : "tengu-off",
    note: localOptIn
      ? "dedicated local setting can keep the taper independent of the artifact flame"
      : "tengu_scratch off (default); no local opt-in — getEnvironmentOverrides null",
  };
}

export function inspectDoor(input = {}) {
  const door =
    input.door && typeof input.door === "object"
      ? input.door
      : input.lit === true && input.snuffed !== true
        ? SAMPLE_LIT_DOOR
        : SAMPLE_DOOR;
  const forcedOneWay =
    input.oneWayDoor === true ||
    input.event === "one-way-door" ||
    input.gangedOr === true ||
    (input.snuffed === true && input.lit !== true);
  const oneWay = forcedOneWay ? true : door.oneWay === true;
  return {
    oneWay,
    envOverrides: oneWay ? null : door.envOverrides,
    configOverrides: oneWay ? undefined : door.configOverrides,
    growthBookSkipped: oneWay,
    stamp: oneWay ? "door-one-way" : "door-local",
    note: oneWay
      ? "turning artifacts off is a one-way door — cachedGrowthBookFeatures skipped"
      : "local opt-in can keep the taper after the artifact flame is snuffed",
  };
}

export function readBooth(input = {}) {
  const taper = inspectTaper(input);
  const flame = inspectFlame(input);
  const gang = inspectGang(input);
  const tengu = inspectTengu(input);
  const door = inspectDoor(input);
  const snuffed =
    input.lit !== true &&
    ((gang.coupled && taper.gone) ||
      (door.oneWay && flame.snuffed) ||
      input.snuffed === true);
  const lit = input.lit === true && snuffed !== true && !gang.coupled;
  const path =
    gang.coupled &&
    (input.event === "ganged-or" || input.gangedOr === true);
  return {
    taper,
    flame,
    gang,
    tengu,
    door,
    plaques: SNUFFER_PLAQUES,
    stations: BOOTH_STATIONS,
    snuffed: snuffed && !lit && !path,
    lit:
      lit ||
      (!gang.coupled &&
        !taper.gone &&
        input.snuffed !== true &&
        input.gangedOr !== true),
    gangedOr: path && !lit,
    mark:
      path && !lit
        ? "ganged-or"
        : snuffed && !lit
          ? "snuffed"
          : "lit",
  };
}

/**
 * Published snuffer walk from #93746 only. Facts from the issue text.
 * A lit booth keeps the scratchpad directory announced.
 * A snuffed booth extinguishes the taper after enableArtifact false.
 * A ganged-or booth names the shared-wick path.
 */
export const SNUFFER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-lit",
    lit: true,
    snuffed: false,
    cue: "lit",
    note: "idle HOLD: scratchpad directory still announced; two wicks stay separate",
  },
  {
    t: "enable-artifact-false",
    event: "enable-artifact-false",
    snuffed: true,
    enableArtifactFalse: true,
    cue: "snuffed",
    note: "settings.json sets enableArtifact false — brass snuffer covers the artifact flame",
  },
  {
    t: "tengu-scratch",
    event: "tengu-scratch",
    snuffed: true,
    tenguScratch: true,
    cue: "snuffed",
    note: "tengu_scratch is off (default); no local opt-in",
  },
  {
    t: "artifact-gate",
    event: "artifact-gate",
    snuffed: true,
    artifactGate: true,
    cue: "snuffed",
    note: "isArtifactToolEligible is false once br() reflects the snuffed flame",
  },
  {
    t: "path",
    event: "ganged-or",
    snuffed: true,
    gangedOr: true,
    tenguScratch: true,
    cue: "snuffed",
    note: "ganged-or — || isArtifactToolEligible shares the scratchpad wick",
  },
  {
    t: "environment-update",
    event: "environment-update",
    snuffed: true,
    environmentUpdate: true,
    cue: "snuffed",
    note: "Environment update: The scratchpad directory announced earlier is no longer available",
  },
  {
    t: "scratchpad-line",
    event: "scratchpad-line",
    snuffed: true,
    scratchpadLine: true,
    cue: "snuffed",
    note: "Scratchpad directory: vanishes from the environment block",
  },
  {
    t: "one-way-door",
    event: "one-way-door",
    snuffed: true,
    oneWayDoor: true,
    cue: "snuffed",
    note: "getEnvironmentOverrides null; turning artifacts off is a one-way door",
  },
  {
    t: "regression-186",
    event: "regression-186",
    snuffed: true,
    regression186: true,
    cue: "snuffed",
    note: "coupling absent through 2.1.185; present from 2.1.186 through 2.1.269",
  },
  {
    t: "path",
    event: "ganged-or",
    snuffed: true,
    gangedOr: true,
    tenguScratch: true,
    oneWayDoor: true,
    cue: "snuffed",
    note: "ganged-or — the || isArtifactToolEligible arm is the shared wick",
  },
  {
    t: "score",
    event: "snuffer",
    snuffed: true,
    gangedOr: true,
    tenguScratch: true,
    artifactGate: true,
    oneWayDoor: true,
    environmentUpdate: true,
    scratchpadLine: true,
    enableArtifactFalse: true,
    regression186: true,
    cue: "snuffed",
    note: "snuffer — when the brass cup covers both wicks the booth never stays lit",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "decouple-gates",
    lit: true,
    decoupleGates: true,
    cue: "lit",
    note: "positive control: scratchpad gate is tengu_scratch (or a dedicated local setting) independent of isArtifactToolEligible",
  },
  {
    t: "announce",
    event: "cue-lit",
    lit: true,
    cue: "lit",
    note: "positive control: snuffing artifacts leaves Scratchpad directory: announced",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    lit: true,
    snuffed: false,
    decoupleGates: true,
    cue: "lit",
  };
}

export function seedLit() {
  return { ...emptyTicket() };
}

export function seedSnuffed() {
  return {
    seed: SEEDED_WORD,
    lit: false,
    snuffed: true,
    tenguScratch: true,
    artifactGate: true,
    oneWayDoor: true,
    gangedOr: true,
    environmentUpdate: true,
    scratchpadLine: true,
    enableArtifactFalse: true,
    regression186: true,
    cue: "snuffed",
    issue: FEATURED_ISSUE,
    taper: SAMPLE_TAPER,
    flame: SAMPLE_FLAME,
    gang: SAMPLE_GANG,
    tengu: SAMPLE_TENGU,
    door: SAMPLE_DOOR,
  };
}

export function seedSnuffer() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    snuffed: true,
    tenguScratch: true,
    artifactGate: true,
    oneWayDoor: true,
    gangedOr: true,
    environmentUpdate: true,
    scratchpadLine: true,
    enableArtifactFalse: true,
    regression186: true,
    cue: "snuffed",
  };
}

export function seedGangedOr() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    snuffed: true,
    gangedOr: true,
    tenguScratch: true,
    oneWayDoor: true,
    event: "ganged-or",
    cue: "snuffed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    lit: true,
    cue: "lit",
  };
}

export function seedDecoupleGates() {
  return {
    seed: "decouple-gates",
    preferSeed: true,
    decoupleGates: true,
    cue: "lit",
  };
}

export function seedTenguScratch() {
  return {
    seed: "tengu-scratch",
    preferSeed: true,
    tenguScratch: true,
    cue: "snuffed",
  };
}

export function seedArtifactGate() {
  return {
    seed: "artifact-gate",
    preferSeed: true,
    artifactGate: true,
    cue: "snuffed",
  };
}

export function seedOneWayDoor() {
  return {
    seed: "one-way-door",
    preferSeed: true,
    oneWayDoor: true,
    cue: "snuffed",
  };
}

export function seedEnvironmentUpdate() {
  return {
    seed: "environment-update",
    preferSeed: true,
    environmentUpdate: true,
    cue: "snuffed",
  };
}

export function seedScratchpadLine() {
  return {
    seed: "scratchpad-line",
    preferSeed: true,
    scratchpadLine: true,
    cue: "snuffed",
  };
}

export function seedEnableArtifactFalse() {
  return {
    seed: "enable-artifact-false",
    preferSeed: true,
    enableArtifactFalse: true,
    cue: "snuffed",
  };
}

export function seedRegression186() {
  return {
    seed: "regression-186",
    preferSeed: true,
    regression186: true,
    cue: "snuffed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      lit: false,
      snuffed: false,
      gangedOr: false,
      decoupleGates: false,
      tenguScratch: false,
      artifactGate: false,
      oneWayDoor: false,
      environmentUpdate: false,
      scratchpadLine: false,
      enableArtifactFalse: false,
      regression186: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    lit: raw.lit === true,
    snuffed:
      raw.snuffed === true ||
      raw.event === "snuffed" ||
      raw.event === "snuffer",
    gangedOr: raw.gangedOr === true || raw.event === "ganged-or",
    decoupleGates: raw.decoupleGates === true || raw.event === "decouple-gates",
    tenguScratch: raw.tenguScratch === true || raw.event === "tengu-scratch",
    artifactGate: raw.artifactGate === true || raw.event === "artifact-gate",
    oneWayDoor: raw.oneWayDoor === true || raw.event === "one-way-door",
    environmentUpdate:
      raw.environmentUpdate === true || raw.event === "environment-update",
    scratchpadLine: raw.scratchpadLine === true || raw.event === "scratchpad-line",
    enableArtifactFalse:
      raw.enableArtifactFalse === true || raw.event === "enable-artifact-false",
    regression186: raw.regression186 === true || raw.event === "regression-186",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    taper: raw.taper,
    flame: raw.flame,
    gang: raw.gang,
    tengu: raw.tengu,
    door: raw.door,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.lit != null ||
        ticket.snuffed != null ||
        ticket.gangedOr != null ||
        ticket.tenguScratch != null ||
        ticket.oneWayDoor != null ||
        ticket.environmentUpdate != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.taper ||
        ticket.flame ||
        ticket.gang),
  );
}

function isLit(row) {
  if (row.snuffed && row.cue !== "lit") return false;
  if (
    row.cue === "snuffed" ||
    row.cue === "snuffer" ||
    row.cue === "ganged-or"
  ) {
    return false;
  }
  if (
    row.tenguScratch &&
    row.oneWayDoor &&
    row.cue !== "lit" &&
    row.lit !== true
  ) {
    return false;
  }
  if (
    row.gangedOr &&
    row.tenguScratch &&
    row.cue !== "lit" &&
    row.lit !== true
  ) {
    return false;
  }
  if (row.lit === true && row.snuffed !== true && row.cue !== "snuffed") {
    return true;
  }
  if (
    row.cue === "lit" &&
    row.snuffed !== true &&
    row.tenguScratch !== true &&
    row.gangedOr !== true
  ) {
    return true;
  }
  if (
    row.decoupleGates === true &&
    row.snuffed !== true &&
    row.tenguScratch !== true &&
    row.oneWayDoor !== true &&
    row.gangedOr !== true
  ) {
    return true;
  }
  return false;
}

function isGangedOrPath(row) {
  return (
    row.event === "ganged-or" &&
    !isLit(row) &&
    (row.gangedOr === true ||
      row.tenguScratch === true ||
      row.oneWayDoor === true)
  );
}

function isSnuffed(row) {
  if (isLit(row)) return false;
  if (isGangedOrPath(row) && row.cue !== "snuffed") return false;
  if (row.cue === "snuffed" || row.cue === "snuffer") return true;
  if (row.snuffed === true) return true;
  if (
    row.tenguScratch === true &&
    row.oneWayDoor === true &&
    row.environmentUpdate === true
  ) {
    return true;
  }
  if (row.tenguScratch === true && row.oneWayDoor === true) {
    return true;
  }
  if (
    row.environmentUpdate === true ||
    row.scratchpadLine === true ||
    row.enableArtifactFalse === true ||
    (row.gangedOr === true && row.oneWayDoor === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one snuffer pass against the taper bench.
 * lit: scratchpad directory still announced.
 * snuffed / snuffer: enableArtifact false kills scratchpad.
 * ganged-or: scratchpad eligibility ORs artifact eligibility.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isGangedOrPath(row) ||
    (row.gangedOr && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "ganged-or";
  } else if (isSnuffed(row)) {
    verdict = "snuffer";
  } else if (isLit(row)) {
    verdict = "lit";
  } else if (
    row.tenguScratch ||
    row.oneWayDoor ||
    row.environmentUpdate ||
    (row.gangedOr && !row.decoupleGates)
  ) {
    verdict = "snuffer";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const taper = inspectTaper(row);
  const flame = inspectFlame(row);
  const gang = inspectGang(row);
  const tengu = inspectTengu(row);
  const door = inspectDoor(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    lit: verdict === "lit" || verdict === "hold",
    snuffed:
      verdict === "snuffed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    gangedOr:
      row.gangedOr === true ||
      verdict === "ganged-or" ||
      verdict === PATH_WORD,
    decoupleGates: row.decoupleGates,
    tenguScratch: row.tenguScratch,
    artifactGate: row.artifactGate,
    oneWayDoor: row.oneWayDoor,
    environmentUpdate: row.environmentUpdate,
    scratchpadLine: row.scratchpadLine,
    enableArtifactFalse: row.enableArtifactFalse,
    regression186: row.regression186,
    cue: hold
      ? "lit"
      : row.gangedOr || verdict === "ganged-or"
        ? "ganged-or"
        : "snuffed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit lit" : "score snuffer",
    taperInspect: taper,
    flameInspect: flame,
    gangInspect: gang,
    tenguInspect: tengu,
    doorInspect: door,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk) &&
        ticket.walk.length &&
        typeof ticket.walk[0] === "object"
      ? ticket.walk
      : SNUFFER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const snuffed = scored.filter(
    (row) => row.verdict === "snuffer" || row.verdict === "snuffed",
  );
  const path = scored.filter((row) => row.verdict === "ganged-or");
  const lit = scored.filter((row) => row.verdict === "lit");
  const headline =
    scored.find((row) => row.event === "snuffed") ||
    scored.find((row) => row.event === "ganged-or") ||
    scored.find((row) => row.event === "enable-artifact-false") ||
    snuffed[snuffed.length - 1];
  let verdict = "lit";
  if (snuffed.length) verdict = "snuffer";
  else if (path.length && !lit.length) verdict = "ganged-or";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    snuffedCount: snuffed.length,
    pathCount: path.length,
    litCount: lit.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit lit" : "score snuffer",
    note: headline
      ? "enableArtifact false killed the scratchpad because eligibility ORs artifact eligibility after 2.1.186."
      : "published snuffer walk scored against lit vs snuffed",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "lit" &&
    seeded !== "snuffed" &&
    seeded !== "ganged-or" &&
    seeded !== "snuffer" &&
    ticket.lit == null &&
    ticket.snuffed == null &&
    ticket.tenguScratch == null &&
    ticket.gangedOr == null &&
    ticket.oneWayDoor == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object")
  ) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi =
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object");
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    backups: BACKUPS.map((row) => row.issue),
    lit: scored.lit ?? false,
    snuffed: scored.snuffed ?? false,
    gangedOr: scored.gangedOr ?? false,
    decoupleGates: scored.decoupleGates ?? false,
    tenguScratch: scored.tenguScratch ?? false,
    artifactGate: scored.artifactGate ?? false,
    oneWayDoor: scored.oneWayDoor ?? false,
    environmentUpdate: scored.environmentUpdate ?? false,
    scratchpadLine: scored.scratchpadLine ?? false,
    enableArtifactFalse: scored.enableArtifactFalse ?? false,
    regression186: scored.regression186 ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.lit && !result.snuffed ? "taper=announced" : "taper=gone",
    result.tenguScratch || result.snuffed ? "tengu=off" : "tengu=independent",
    result.oneWayDoor || result.snuffed ? "door=one-way" : "door=local",
    result.environmentUpdate || result.snuffed
      ? "env=withdrawn"
      : "env=announced",
    result.gangedOr || result.verdict === "ganged-or"
      ? "path=ganged-or"
      : "path=lit",
    result.cue === "lit"
      ? "cue=lit"
      : result.cue === "ganged-or"
        ? "cue=ganged-or"
        : "cue=snuffed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    lit: result.lit,
    snuffed: result.snuffed,
    gangedOr: result.gangedOr,
    decoupleGates: result.decoupleGates,
    tenguScratch: result.tenguScratch,
    artifactGate: result.artifactGate,
    oneWayDoor: result.oneWayDoor,
    environmentUpdate: result.environmentUpdate,
    scratchpadLine: result.scratchpadLine,
    enableArtifactFalse: result.enableArtifactFalse,
    regression186: result.regression186,
    taper: input && input.taper,
    flame: input && input.flame,
    gang: input && input.gang,
    tengu: input && input.tengu,
    door: input && input.door,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    taper: inspectTaper({
      lit: result.lit,
      snuffed: result.snuffed,
      gangedOr: result.gangedOr,
      taper: input && input.taper,
    }),
    flame: inspectFlame({
      lit: result.lit,
      snuffed: result.snuffed,
      enableArtifactFalse: result.enableArtifactFalse,
      flame: input && input.flame,
    }),
    gang: inspectGang({
      lit: result.lit,
      snuffed: result.snuffed,
      gangedOr: result.gangedOr,
      gang: input && input.gang,
    }),
    tengu: inspectTengu({
      lit: result.lit,
      snuffed: result.snuffed,
      tenguScratch: result.tenguScratch,
      gangedOr: result.gangedOr,
      tengu: input && input.tengu,
    }),
    door: inspectDoor({
      lit: result.lit,
      snuffed: result.snuffed,
      oneWayDoor: result.oneWayDoor,
      gangedOr: result.gangedOr,
      door: input && input.door,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      snuffed:
        result.snuffed === true ||
        result.verdict === "snuffed" ||
        result.verdict === "snuffer",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      lastWorking: LAST_WORKING,
      regressionBuild: REGRESSION_BUILD,
      tenguFlag: TENGU_FLAG,
      tenguDefault: TENGU_DEFAULT,
      artifactKey: ARTIFACT_KEY,
      artifactLegacy: ARTIFACT_LEGACY,
      artifactEnv: ARTIFACT_ENV,
      settingsPath: SETTINGS_PATH,
      scratchpadLine: SCRATCHPAD_LINE,
      envUpdate: ENV_UPDATE,
      coupling: COUPLING,
      artifactEligible: ARTIFACT_ELIGIBLE,
      absentBuilds: [...ABSENT_BUILDS],
      presentBuilds: [...PRESENT_BUILDS],
      osLabel: OS_LABEL,
      shellLabel: SHELL_LABEL,
      surface: SURFACE,
      plaques: SNUFFER_PLAQUES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: restore scratchpad gate to tengu_scratch (or a dedicated local setting) independent of isArtifactToolEligible. Invite verify against #93746 text only. Do not claim a root cause in Claude Code source you have not seen.",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
