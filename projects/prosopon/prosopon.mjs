#!/usr/bin/env node
/**
 * Prosopon — Greek theatre / prosopon / tragic-mask /
 * skene / orchestra booth.
 * A *prosopon* (πρόσωπον) is the Greek theatrical
 * face/mask/person — the role's face on stage. The
 * background-agent view should show the subagent's own
 * face (requested model). Instead the parent's advisor
 * attachment paints Fable on the mask while the actor
 * speaks Sonnet/Opus/Haiku lines.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: when a Fable 5.1 session spawns a subagent with
 * Agent tool `model` override, the background-agent /
 * task view labels the task as running on Fable. The
 * subagent actually runs on the requested model; the
 * transcript proves it. The wrong label appears to come
 * from the advisor_tool attachment the subagent carries
 * (attachment.type == advisor_tool, model = parent's
 * advisor model Fable), not from the subagent's own
 * assistant turns.
 *
 * Encoded from anthropics/claude-code#94575 issue text only.
 * Hypothesis (NON-BINDING — issue text): the
 * background-agent view appears to read
 * advisor_tool.attachment.model (parent's advisor) for
 * the badge instead of the subagent's own message.model
 * turns. Invite verify against #94575 text only. Do NOT
 * claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a Claude Code fix. No network.
 * No exploits. No live Claude.
 *
 *   node prosopon.mjs data/miscast.json
 *   echo '{"seed":"miscast"}' | node prosopon.mjs
 *
 * Idle word is ascribed (HOLD: badge shows the
 * subagent's requested / running model).
 * HOLD aliases: credited, named, billed.
 * Seeded word is miscast (#94575 path).
 * Path word is advisor-shadow.
 * Product score word is prosopon (Score prosopon or
 * admit ascribed.).
 *
 * NOT Slipway/#94458 (Windows Ethernet→Wi-Fi undock).
 * NOT Freshet/#94430 (init-flood). NOT Kintsugi/#94451
 * (heal-abort). NOT Cenotaph/#94452 (dead-install).
 * NOT Stratum/#94417 (layer-unsealed). NOT Tmesis/#86198
 * (mid-inject). NOT Vedette/#94392. NOT Orloj/#94393.
 * NOT Brisure/#94396 (herald college). NOT Diptych/#94397.
 * NOT Vizard/#94398 (Renaissance masque / background-reset).
 * NOT Treacle/Somnus/Cresset/Dictabelt.
 * Cousin cite-only: #76381 (closed docs — Advisor tool
 * is not inherited by background subagents). DIFFERENT
 * defect (docs inheritance claim vs UI label reading
 * advisor attachment).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "ascribed",
  "miscast",
  "advisor-shadow",
  "credited",
  "named",
  "billed",
  "parent-badge",
  "fable-paint",
  "sonnet-turn",
  "opus-turn",
  "haiku-turn",
  "advisor-attachment",
  "label-lie",
  "override-honoured",
  "94575",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "ascribed";
export const PATH_WORD = "advisor-shadow";
export const SEEDED_WORD = "miscast";
export const PRODUCT_WORD = "prosopon";
export const HOLD = Object.freeze(["ascribed"]);
export const HOLD_ALIASES = Object.freeze(["credited", "named", "billed"]);
export const RECOVER = Object.freeze(["ascribed"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "moored",
  "lashed",
  "warped",
  "fendered",
  "slipped",
  "iface-swap",
  "buoyed",
  "freshet",
  "init-flood",
  "mended",
  "kintsugi",
  "heal-abort",
  "homed",
  "cenotaph",
  "dead-install",
  "shared",
  "stratum",
  "layer-unsealed",
  "contiguous",
  "tmesis",
  "mid-inject",
  "stationed",
  "lasting",
  "enrolled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "released",
  "lit",
  "primed",
  "raised",
  "preserved",
  "tokenized",
  "blazoned",
  "tabard",
  "surfaced",
  "charted",
  "sounding",
  "cleared",
  "repointed",
  "relocated",
  "settled",
  "verbatim",
  "quiet",
  "intact",
  "stood",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "slipway",
  "slipped",
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "frangible",
  "nameplate",
  "matryoshka",
  "init-flood",
  "heal-abort",
  "dead-install",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
  "stereotype",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
  "hawser",
  "bollard",
  "gangway",
  "iface-swap",
]);

export const FEATURED_ISSUE = 94575;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94575";
export const TITLE =
  "Background-agent view shows the parent's advisor model (Fable) instead of the subagent's requested model";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:agent-view",
]);
export const PLATFORM = "macos";
export const SURFACE = "advisor-shadow";
export const HOST =
  "Claude Code 2.1.270, macOS (Darwin 25.6.0); parent model claude-fable-5-1; subagents via Agent tool with subagent_type general-purpose and model sonnet/opus/haiku";
export const CHECKED_ON =
  "Published report: Fable 5.1 session spawns a subagent with Agent tool model override; background-agent / task view labels the task as Fable; transcript proves own assistant turns run on requested sonnet/opus/haiku; only Fable entries are advisor_tool attachments";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL =
  "parent claude-fable-5-1 — failure is a badge reading advisor_tool.model, not a model-override miss";
export const OS = "macOS (Darwin 25.6.0)";
export const PHRASE = "Score prosopon or admit ascribed.";
export const DISTRIBUTION =
  "Claude Code 2.1.270. macOS (Darwin 25.6.0). Parent model claude-fable-5-1. Subagents via Agent tool, subagent_type general-purpose, model override sonnet/opus/haiku. Four published subagents in one session: sonnet own turns claude-sonnet-5 x83 vs advisor_tool.model claude-fable-5-1 x1; opus claude-opus-5 x86 vs Fable x3; haiku claude-haiku-4-5-20251001 x33 vs Fable x1; sonnet claude-sonnet-5 x27 vs Fable x1. Example lines: assistant turns are claude-sonnet-5; only Fable entries are advisor attachments. User concluded the model launched was not SONNET until shown transcript counts.";

export const CODE_BUILD = "2.1.270";
export const PARENT_MODEL = "claude-fable-5-1";
export const SONNET_MODEL = "claude-sonnet-5";
export const OPUS_MODEL = "claude-opus-5";
export const HAIKU_MODEL = "claude-haiku-4-5-20251001";
export const SUBAGENT_TYPE = "general-purpose";
export const ATTACHMENT_TYPE = "advisor_tool";
export const AGENT_TOOL = "Agent";
export const SUBAGENT_COUNT = 4;
export const SONNET_TURNS_A = 83;
export const SONNET_ADVISOR_A = 1;
export const OPUS_TURNS = 86;
export const OPUS_ADVISOR = 3;
export const HAIKU_TURNS = 33;
export const HAIKU_ADVISOR = 1;
export const SONNET_TURNS_B = 27;
export const SONNET_ADVISOR_B = 1;
export const USER_CONCLUSION = "the model launched was not SONNET";

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_ASCRIBED = Object.freeze({
  kind: "ascribed",
  badgeShowsOwnModel: true,
  advisorShadow: false,
  note: "badge shows the subagent's requested / running model",
  synthetic: true,
});
export const SYNTHETIC_MISCAST = Object.freeze({
  kind: "miscast",
  badgeShowsOwnModel: false,
  advisorShadow: true,
  note: "background-agent view paints parent's advisor model Fable",
  synthetic: true,
});
export const SYNTHETIC_ADVISOR_SHADOW = Object.freeze({
  kind: "advisor-shadow",
  rows: [
    { lane: "sonnet A", block: "claude-sonnet-5 x83", live: true, note: "own assistant turns" },
    { lane: "opus", block: "claude-opus-5 x86", live: true, note: "own assistant turns" },
    { lane: "haiku", block: "claude-haiku-4-5-20251001 x33", live: true, note: "own assistant turns" },
    { lane: "sonnet B", block: "claude-sonnet-5 x27", live: true, note: "own assistant turns" },
    { lane: "advisor paint", block: "claude-fable-5-1 on every advisor_tool attachment", live: false, note: "parent advisor model" },
    { lane: "badge", block: "background-agent view labels task Fable", live: false, note: "label-lie" },
  ],
  note: "four-row published counts plus advisor-shadow paint",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "sonnet A",
    requested: "sonnet",
    ownTurns: "claude-sonnet-5 x83",
    advisor: "claude-fable-5-1 x1",
    live: true,
    miscast: true,
  },
  {
    lane: "opus",
    requested: "opus",
    ownTurns: "claude-opus-5 x86",
    advisor: "claude-fable-5-1 x3",
    live: true,
    miscast: true,
  },
  {
    lane: "haiku",
    requested: "haiku",
    ownTurns: "claude-haiku-4-5-20251001 x33",
    advisor: "claude-fable-5-1 x1",
    live: true,
    miscast: true,
  },
  {
    lane: "sonnet B",
    requested: "sonnet",
    ownTurns: "claude-sonnet-5 x27",
    advisor: "claude-fable-5-1 x1",
    live: true,
    miscast: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "clay-mask",
    lost: "Clay mask — background-agent view paints Fable on the subagent's face",
    control: "An ascribed mask would show the actor's own requested model",
    story: "the role's face on stage is the parent's advisor, not the speaker",
  },
  {
    id: "olive-wreath",
    lost: "Olive wreath — advisor_tool attachment carries parent's advisor model Fable",
    control: "the wreath would credit the running model, not the chorus advisor",
    story: "attachment.type == advisor_tool; model = claude-fable-5-1",
  },
  {
    id: "torch",
    lost: "Torch — task view labels the task as running on Fable",
    control: "the torch would light the speaker, not the advisor off-stage",
    story: "user concluded the model launched was not SONNET",
  },
  {
    id: "marble-plinth",
    lost: "Marble plinth — transcript counts prove own turns honoured the override",
    control: "the plinth already records sonnet/opus/haiku lines",
    story: "assistant turns are the requested model; only Fable entries are advisor attachments",
  },
  {
    id: "skene",
    lost: "Skene — the stage house should label the actor, not the parent's advisor",
    control: "show the model the subagent runs on, or both with distinct labels",
    story: "the background-agent view reads the advisor attachment",
  },
  {
    id: "orchestra",
    lost: "Orchestra — four published subagents in one session; every badge miscast",
    control: "each dancer would wear their own requested face",
    story: "sonnet x83 / opus x86 / haiku x33 / sonnet x27 vs Fable attachments",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "clay-mask",
    survey: "ascribed HOLD: badge shows the subagent's requested / running model",
    kind: "ascribed",
    note: "idle/control: the actor's own face on the mask",
  },
  {
    id: "olive-wreath",
    survey: "advisor_tool attachment carries parent's advisor model claude-fable-5-1",
    kind: "miscast",
    note: "seeded: the wreath is the parent's advisor",
  },
  {
    id: "torch",
    survey: "background-agent / task view labels the task as Fable",
    kind: "miscast",
    note: "seeded: the torch lights the wrong face",
  },
  {
    id: "marble-plinth",
    survey: "own assistant turns run requested sonnet/opus/haiku; transcript proves it",
    kind: "miscast",
    note: "seeded: the actor already spoke the requested lines",
  },
  {
    id: "skene",
    survey: "stage house should show the actor, or both agent and advisor with distinct labels",
    kind: "miscast",
    note: "seeded: the skene paints the advisor",
  },
  {
    id: "orchestra",
    survey: "advisor-shadow — four subagents; every badge reads advisor_tool.model",
    kind: "miscast",
    note: "path: advisor-shadow names the painted mask",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "parent-badge",
    label: "parent-badge",
    count: "Fable",
    note: "background-agent view shows the parent's advisor model",
  },
  {
    id: "fable-paint",
    label: "fable-paint",
    count: "paint",
    note: "advisor attachment paints claude-fable-5-1 on the mask",
  },
  {
    id: "advisor-attachment",
    label: "advisor-attachment",
    count: "advisor_tool",
    note: "attachment.type == advisor_tool; model = parent's advisor",
  },
  {
    id: "label-lie",
    label: "label-lie",
    count: "lie",
    note: "badge says Fable while own turns run the requested model",
  },
  {
    id: "override-honoured",
    label: "override-honoured",
    count: "ran",
    note: "Agent model override actually ran; transcript counts prove it",
  },
  {
    id: "advisor-shadow",
    label: "advisor-shadow",
    count: "shadow",
    note: "path: badge appears to read advisor_tool.attachment.model",
  },
]);

export const RULED_OUT = Object.freeze([
  " #76381 — closed docs: Advisor tool is not inherited by background subagents, contradicting advisor docs — DIFFERENT; cite only",
  " #94458 — Windows Ethernet→Wi-Fi undock / iface-swap — DIFFERENT; cite only",
  " #94430 — desktop init-flood — DIFFERENT; cite only",
  " #93924 — RC local slowdown — DIFFERENT; cite only; backup next-focus",
  " #93770 — copy padding artifacts — DIFFERENT; enhancement; backup next-focus",
  " #93777 — Vercel MCP teamId — DIFFERENT; cite only; backup next-focus",
  " #94151 — Shift+PageUp Konsole — DIFFERENT; cite only; backup next-focus",
  " #94564 — backup next-focus — DIFFERENT; cite only",
  " #94546 — backup next-focus — DIFFERENT; cite only",
  " #94547 — backup next-focus — DIFFERENT; cite only",
  "Slipway/#94458 — dry-dock iface-swap — DIFFERENT",
  "Freshet/#94430 — river-stage init-flood — DIFFERENT",
  "Kintsugi/#94451 — gold never sets — DIFFERENT",
  "Cenotaph/#94452 — plaque polished, stone never moved — DIFFERENT",
  "Stratum/#94417 — project-context layer-unsealed — DIFFERENT",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — herald college — DIFFERENT",
  "Diptych/#94397 — wax-tablet brief-echo — DIFFERENT",
  "Vizard/#94398 — Renaissance masque / background-reset — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "Background-agent view shows the model the subagent runs on",
  "OR shows both agent model and advisor model with distinct labels",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Read the subagent's own message.model turns for the badge, not advisor_tool.attachment.model",
  "If the advisor attachment is shown, label it as advisor — not as the running agent model",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "advisor-shadow",
  "prosopon",
  "parent-badge",
  "fable-paint",
  "advisor-attachment",
  "label-lie",
]);

export const COUSINS = Object.freeze([
  {
    issue: 76381,
    title: "Advisor tool is not inherited by background subagents, contradicting advisor docs",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — #76381 is a closed docs inheritance claim. DIFFERENT defect (docs inheritance vs UI label reading advisor attachment). Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "backup next-focus — RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus — copy padding artifacts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus — Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus — Shift+PageUp Konsole", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94564, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94546, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94547, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "slipway",
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "stereotype",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
  "hawser",
  "bollard",
  "gangway",
]);

export const SAMPLE_KIND_IDLE = "clay-mask";
export const SAMPLE_KIND_SEEDED = "advisor-shadow";
export const SAMPLE_HOLDING_IDLE = "orchestra-pit";
export const SAMPLE_HOLDING_SEEDED = "fable-paint";

export const SAMPLE_ASCRIBED_PROOF = Object.freeze({
  ascribed: true,
  miscast: false,
  advisorShadow: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_MISCAST_PROOF = Object.freeze({
  ascribed: false,
  miscast: true,
  advisorShadow: true,
  parentBadge: true,
  fablePaint: true,
  sonnetTurn: true,
  opusTurn: true,
  haikuTurn: true,
  advisorAttachment: true,
  labelLie: true,
  overrideHonoured: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  ascribedWatch: { ...SYNTHETIC_ASCRIBED },
  miscastWatch: { ...SYNTHETIC_MISCAST },
  advisorShadowShape: { ...SYNTHETIC_ADVISOR_SHADOW },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds ascribed: badge shows the subagent's requested / running model" },
  { t: "advisor-shadow", line: "advisor_tool attachment carries parent's advisor model Fable" },
  { t: "path", line: "advisor-shadow — background-agent view paints Fable on the mask" },
  { t: "score", line: "when the parent's advisor paints the face the booth is miscast — Score prosopon or admit ascribed." },
]);

const FORCE_FLAGS = [
  "advisorShadow",
  "parentBadge",
  "fablePaint",
  "sonnetTurn",
  "opusTurn",
  "haikuTurn",
  "advisorAttachment",
  "labelLie",
  "overrideHonoured",
];

const ISSUE_CUE_RE =
  /94575|advisor_tool|advisor-shadow|Fable|claude-fable-5-1|background-agent|the model launched was not SONNET|message\.model/i;

/**
 * Educational advisor-shadow observer. Not a Claude Code patch.
 * Encodes only the published #94575 shapes.
 *
 * Badge appears to read advisor_tool.attachment.model.
 */
export function observeAdvisorShadow({
  advisorModel = PARENT_MODEL,
  ownModel = SONNET_MODEL,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      advisorModel,
      ownModel,
      shadowed: false,
      badge: ownModel,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const shadowed = advisorModel === PARENT_MODEL && ownModel !== PARENT_MODEL;
  return {
    advisorModel,
    ownModel,
    shadowed,
    badge: shadowed ? advisorModel : ownModel,
    phrase: shadowed ? "score prosopon" : "admit ascribed",
    note: shadowed
      ? "background-agent view paints parent's advisor model Fable"
      : "badge shows the running model",
    synthetic: true,
  };
}

/**
 * Educational parent-badge observer. Not a Claude Code patch.
 * Published: task view labels the task as Fable.
 */
export function inspectParentBadge({
  badge = PARENT_MODEL,
  requested = "sonnet",
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      badge: requested,
      requested,
      painted: false,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const painted = badge === PARENT_MODEL && requested !== "fable";
  return {
    badge,
    requested,
    painted,
    phrase: painted ? "score prosopon" : "admit ascribed",
    note: painted
      ? "parent-badge — background-agent view shows Fable"
      : "badge matches requested model",
    synthetic: true,
  };
}

/**
 * Educational fable-paint observer. Not a Claude Code patch.
 * Published: only Fable entries are advisor attachments.
 */
export function inspectFablePaint({
  attachmentModel = PARENT_MODEL,
  attachmentType = ATTACHMENT_TYPE,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      attachmentModel,
      attachmentType,
      painted: false,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const painted =
    attachmentModel === PARENT_MODEL && attachmentType === ATTACHMENT_TYPE;
  return {
    attachmentModel,
    attachmentType,
    painted,
    phrase: painted ? "score prosopon" : "admit ascribed",
    note: painted
      ? "fable-paint — advisor_tool.model is claude-fable-5-1"
      : "no Fable paint on the mask",
    synthetic: true,
  };
}

/**
 * Educational own-turn observers. Not a Claude Code patch.
 * Published transcript counts per requested model.
 */
export function inspectSonnetTurn({
  ownModel = SONNET_MODEL,
  count = SONNET_TURNS_A,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      ownModel,
      count,
      honoured: true,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const honoured = ownModel === SONNET_MODEL && count > 0;
  return {
    ownModel,
    count,
    honoured,
    phrase: honoured ? "score prosopon" : "admit ascribed",
    note: honoured
      ? "sonnet-turn — own assistant turns are claude-sonnet-5"
      : "no sonnet turns published",
    synthetic: true,
  };
}

export function inspectOpusTurn({
  ownModel = OPUS_MODEL,
  count = OPUS_TURNS,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      ownModel,
      count,
      honoured: true,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const honoured = ownModel === OPUS_MODEL && count > 0;
  return {
    ownModel,
    count,
    honoured,
    phrase: honoured ? "score prosopon" : "admit ascribed",
    note: honoured
      ? "opus-turn — own assistant turns are claude-opus-5"
      : "no opus turns published",
    synthetic: true,
  };
}

export function inspectHaikuTurn({
  ownModel = HAIKU_MODEL,
  count = HAIKU_TURNS,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      ownModel,
      count,
      honoured: true,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const honoured = ownModel === HAIKU_MODEL && count > 0;
  return {
    ownModel,
    count,
    honoured,
    phrase: honoured ? "score prosopon" : "admit ascribed",
    note: honoured
      ? "haiku-turn — own assistant turns are claude-haiku-4-5-20251001"
      : "no haiku turns published",
    synthetic: true,
  };
}

/**
 * Educational advisor-attachment observer. Not a Claude Code patch.
 * Published: attachment.type == advisor_tool.
 */
export function inspectAdvisorAttachment({
  type = ATTACHMENT_TYPE,
  model = PARENT_MODEL,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      type,
      model,
      attached: false,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const attached = type === ATTACHMENT_TYPE && model === PARENT_MODEL;
  return {
    type,
    model,
    attached,
    phrase: attached ? "score prosopon" : "admit ascribed",
    note: attached
      ? "advisor-attachment — attachment.type == advisor_tool; model = Fable"
      : "no advisor attachment on the subagent",
    synthetic: true,
  };
}

/**
 * Educational label-lie observer. Not a Claude Code patch.
 * Published: user concluded override was ignored until shown counts.
 */
export function inspectLabelLie({
  badge = PARENT_MODEL,
  ownTurns = SONNET_MODEL,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      badge: ownTurns,
      ownTurns,
      lie: false,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const lie = badge === PARENT_MODEL && ownTurns !== PARENT_MODEL;
  return {
    badge,
    ownTurns,
    lie,
    phrase: lie ? "score prosopon" : "admit ascribed",
    note: lie
      ? "label-lie — badge Fable while own turns honoured the override"
      : "badge matches own turns",
    synthetic: true,
  };
}

/**
 * Educational override-honoured observer. Not a Claude Code patch.
 * Published: the subagent actually runs on the requested model.
 */
export function inspectOverrideHonoured({
  requested = "sonnet",
  ran = SONNET_MODEL,
  ascribed = false,
} = {}) {
  if (ascribed === true) {
    return {
      requested,
      ran,
      honoured: true,
      phrase: "admit ascribed",
      synthetic: true,
    };
  }
  const honoured = requested === "sonnet" && ran === SONNET_MODEL;
  return {
    requested,
    ran,
    honoured,
    phrase: honoured ? "score prosopon" : "admit ascribed",
    note: honoured
      ? "override-honoured — transcript proves requested model ran"
      : "override not in the published counts",
    synthetic: true,
  };
}

export function scoreAdvisorShadow(input = {}) {
  const ascribedHold = input.ascribed === true && input.miscast !== true;
  const shadow = observeAdvisorShadow({
    advisorModel: ascribedHold ? SONNET_MODEL : PARENT_MODEL,
    ownModel: SONNET_MODEL,
    ascribed: ascribedHold,
  });
  const miscast =
    !ascribedHold &&
    (input.miscast === true ||
      input.advisorShadow === true ||
      input.parentBadge === true ||
      input.fablePaint === true ||
      input.advisorAttachment === true ||
      input.labelLie === true ||
      shadow.shadowed === true);
  return {
    ascribed: !miscast,
    miscast,
    advisorShadow: miscast,
    shadow,
    phrase: miscast ? "score prosopon" : "admit ascribed",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94575") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapProsopon(input = {}) {
  const miscast = isMiscastInput(input);
  const ascribed = input.ascribed === true && !miscast;
  return {
    stamp: miscast ? "advisor-shadow" : "orchestra-pit",
    holdingLane: miscast ? "fable-paint" : "orchestra-pit",
    kindLane: miscast ? "advisor-shadow" : "clay-mask",
    bindLane: miscast ? "label-lie" : "olive-wreath",
    ribbon: miscast ? "miscast" : "ascribed",
    ascribed,
  };
}

export function inspectParentBadgeMark(input = {}) {
  const flagged =
    input.parentBadge === true ||
    input.miscast === true ||
    isMiscastInput(input);
  if (input.ascribed === true && !flagged) {
    return { stamp: "credited", flagged: false, note: "badge still ascribed" };
  }
  return {
    stamp: flagged ? "parent-badge" : "mask-idle",
    flagged,
    note: flagged
      ? "parent-badge — background-agent view shows Fable"
      : "",
  };
}

export function inspectFablePaintMark(input = {}) {
  const missed =
    input.fablePaint === true ||
    input.miscast === true ||
    input.advisorShadow === true ||
    isMiscastInput(input);
  if (input.ascribed === true && !missed) {
    return { stamp: "named", missed: false };
  }
  return {
    stamp: missed ? "fable-paint" : "mask-idle",
    missed,
    note: missed
      ? "fable-paint — advisor attachment paints claude-fable-5-1"
      : "",
  };
}

export function inspectAdvisorAttachmentMark(input = {}) {
  const flagged =
    input.advisorAttachment === true ||
    input.miscast === true ||
    isMiscastInput(input);
  if (input.ascribed === true && !flagged) {
    return { stamp: "billed", flagged: false };
  }
  return {
    stamp: flagged ? "advisor-attachment" : "mask-idle",
    flagged,
    note: flagged
      ? "advisor-attachment — attachment.type == advisor_tool"
      : "",
  };
}

export function inspectLabelLieMark(input = {}) {
  const flagged =
    input.labelLie === true ||
    input.miscast === true ||
    isMiscastInput(input);
  if (input.ascribed === true && !flagged) {
    return { stamp: "clay-mask", flagged: false };
  }
  return {
    stamp: flagged ? "label-lie" : "mask-idle",
    flagged,
    note: flagged
      ? "label-lie — badge Fable while own turns honoured the override"
      : "",
  };
}

export function inspectOverrideMark(input = {}) {
  const flagged =
    input.overrideHonoured === true ||
    input.sonnetTurn === true ||
    input.opusTurn === true ||
    input.haikuTurn === true ||
    input.miscast === true ||
    isMiscastInput(input);
  if (input.ascribed === true && !flagged) {
    return { stamp: "credited", flagged: false };
  }
  return {
    stamp: flagged ? "override-honoured" : "mask-idle",
    flagged,
    note: flagged
      ? "override-honoured — transcript proves requested model ran"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "clay-mask": input.miscast || input.advisorShadow,
    "olive-wreath": input.miscast || input.advisorShadow || input.advisorAttachment,
    torch: input.fablePaint || input.parentBadge || input.miscast,
    "marble-plinth": input.overrideHonoured || input.miscast,
    skene: input.labelLie || input.miscast,
    orchestra: input.advisorShadow || input.miscast,
  };
  return (
    map[id] === true ||
    input.advisorShadow === true ||
    input.miscast === true
  );
}

function isMiscastInput(input = {}) {
  return (
    input.miscast === true ||
    input.advisorShadow === true ||
    input.parentBadge === true ||
    input.fablePaint === true ||
    input.sonnetTurn === true ||
    input.opusTurn === true ||
    input.haikuTurn === true ||
    input.advisorAttachment === true ||
    input.labelLie === true ||
    input.overrideHonoured === true
  );
}

export function readBooth(input = {}) {
  const miscast = isMiscastInput(input);
  const ascribed = input.ascribed === true && !miscast;
  return {
    mark: miscast ? "miscast" : "ascribed",
    ascribed,
    miscast,
    advisorShadow: input.advisorShadow === true || miscast,
    parentBadge: input.parentBadge === true,
    fablePaint: input.fablePaint === true,
    sonnetTurn: input.sonnetTurn === true,
    opusTurn: input.opusTurn === true,
    haikuTurn: input.haikuTurn === true,
    advisorAttachment: input.advisorAttachment === true,
    labelLie: input.labelLie === true,
    overrideHonoured: input.overrideHonoured === true,
    post: mapProsopon(input),
    badge: inspectParentBadgeMark(input),
    paint: inspectFablePaintMark(input),
    attachment: inspectAdvisorAttachmentMark(input),
    lie: inspectLabelLieMark(input),
    override: inspectOverrideMark(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const PROSOPON_WALK = Object.freeze([
  {
    t: "idle",
    event: "orchestra-pit",
    ascribed: true,
    miscast: false,
    cue: "ascribed",
    note: "idle HOLD: badge shows the subagent's requested / running model",
  },
  {
    t: "advisor-shadow",
    event: "advisor-shadow",
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
    advisorAttachment: true,
    cue: "miscast",
    note: "advisor_tool attachment carries parent's advisor model Fable",
  },
  {
    t: "path",
    event: "advisor-shadow",
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
    fablePaint: true,
    sonnetTurn: true,
    opusTurn: true,
    haikuTurn: true,
    advisorAttachment: true,
    labelLie: true,
    overrideHonoured: true,
    cue: "miscast",
    note: "advisor-shadow — background-agent view paints Fable on the mask",
  },
  {
    t: "score",
    event: "miscast",
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
    fablePaint: true,
    sonnetTurn: true,
    opusTurn: true,
    haikuTurn: true,
    advisorAttachment: true,
    labelLie: true,
    overrideHonoured: true,
    cue: "miscast",
    note: "miscast — parent's advisor painted the face; own turns honoured the override",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "orchestra-pit",
    ascribed: true,
    miscast: false,
    cue: "ascribed",
    note: "positive control: badge shows the subagent's requested / running model",
  },
  {
    t: "admit",
    event: "orchestra-pit",
    ascribed: true,
    cue: "ascribed",
    note: "positive control: the mask admits ascribed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    ascribed: true,
    miscast: false,
    advisorShadow: false,
    cue: "ascribed",
  };
}

export function seedAscribed() {
  return { ...emptyTicket() };
}

export function seedMiscast() {
  return {
    seed: SEEDED_WORD,
    ascribed: false,
    miscast: true,
    advisorShadow: true,
    parentBadge: true,
    fablePaint: true,
    sonnetTurn: true,
    opusTurn: true,
    haikuTurn: true,
    advisorAttachment: true,
    labelLie: true,
    overrideHonoured: true,
    cue: "miscast",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_MISCAST_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: "miscast",
    preferSeed: true,
    miscast: true,
    advisorShadow: true,
    cue: "miscast",
  };
}

export function seedAdvisorShadow() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    miscast: true,
    advisorShadow: true,
    event: "advisor-shadow",
    cue: "miscast",
  };
}

export function seedCredited() {
  return { seed: "credited", preferSeed: true, ascribed: true, cue: "ascribed" };
}

export function seedNamed() {
  return { seed: "named", preferSeed: true, ascribed: true, cue: "ascribed" };
}

export function seedBilled() {
  return { seed: "billed", preferSeed: true, ascribed: true, cue: "ascribed" };
}

export function seedParentBadge() {
  return {
    seed: "parent-badge",
    preferSeed: true,
    parentBadge: true,
    cue: "miscast",
  };
}

export function seedFablePaint() {
  return {
    seed: "fable-paint",
    preferSeed: true,
    fablePaint: true,
    cue: "miscast",
  };
}

export function seedAdvisorAttachment() {
  return {
    seed: "advisor-attachment",
    preferSeed: true,
    advisorAttachment: true,
    cue: "miscast",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      ascribed: false,
      miscast: false,
      advisorShadow: false,
      parentBadge: false,
      fablePaint: false,
      sonnetTurn: false,
      opusTurn: false,
      haikuTurn: false,
      advisorAttachment: false,
      labelLie: false,
      overrideHonoured: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    ascribed: raw.ascribed === true,
    miscast: raw.miscast === true || raw.event === "miscast",
    advisorShadow: raw.advisorShadow === true || raw.event === "advisor-shadow",
    parentBadge: raw.parentBadge === true || raw.event === "parent-badge",
    fablePaint: raw.fablePaint === true || raw.event === "fable-paint",
    sonnetTurn: raw.sonnetTurn === true || raw.event === "sonnet-turn",
    opusTurn: raw.opusTurn === true || raw.event === "opus-turn",
    haikuTurn: raw.haikuTurn === true || raw.event === "haiku-turn",
    advisorAttachment:
      raw.advisorAttachment === true || raw.event === "advisor-attachment",
    labelLie: raw.labelLie === true || raw.event === "label-lie",
    overrideHonoured:
      raw.overrideHonoured === true || raw.event === "override-honoured",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.ascribed != null ||
        ticket.miscast != null ||
        ticket.advisorShadow != null ||
        ticket.parentBadge != null ||
        ticket.fablePaint != null ||
        ticket.sonnetTurn != null ||
        ticket.opusTurn != null ||
        ticket.haikuTurn != null ||
        ticket.advisorAttachment != null ||
        ticket.labelLie != null ||
        ticket.overrideHonoured != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isAscribed(row) {
  if (row.miscast && row.cue !== "ascribed") return false;
  if (row.cue === "miscast" || row.cue === "advisor-shadow") return false;
  if (
    row.advisorShadow &&
    row.parentBadge &&
    row.cue !== "ascribed" &&
    row.ascribed !== true
  ) {
    return false;
  }
  if (
    row.ascribed === true &&
    row.miscast !== true &&
    row.cue !== "miscast"
  ) {
    return true;
  }
  if (
    row.cue === "ascribed" &&
    row.miscast !== true &&
    row.advisorShadow !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isAdvisorShadow(row) {
  return (
    row.event === "advisor-shadow" &&
    !isAscribed(row) &&
    (row.advisorShadow === true ||
      row.parentBadge === true ||
      row.miscast === true)
  );
}

function isMiscastRow(row) {
  if (isAscribed(row)) return false;
  if (isAdvisorShadow(row) && row.cue !== "miscast") return false;
  if (row.cue === "miscast") return true;
  if (row.miscast === true) return true;
  if (row.advisorShadow === true && row.parentBadge === true) return true;
  if (
    row.advisorShadow === true ||
    row.parentBadge === true ||
    row.fablePaint === true ||
    row.sonnetTurn === true ||
    row.opusTurn === true ||
    row.haikuTurn === true ||
    row.advisorAttachment === true ||
    row.labelLie === true ||
    row.overrideHonoured === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one prosopon pass against the mask.
 * ascribed: badge shows the subagent's requested / running model.
 * miscast: parent's advisor paints Fable on the mask.
 * advisor-shadow: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isAdvisorShadow(row) ||
    (row.advisorShadow && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "advisor-shadow";
  } else if (isMiscastRow(row)) {
    verdict = "miscast";
  } else if (isAscribed(row)) {
    verdict = "ascribed";
  } else if (
    row.advisorShadow ||
    row.parentBadge ||
    row.fablePaint ||
    row.sonnetTurn ||
    row.opusTurn ||
    row.haikuTurn ||
    row.advisorAttachment ||
    row.labelLie ||
    row.overrideHonoured
  ) {
    verdict = "miscast";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "miscast";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    ascribed: verdict === "ascribed",
    miscast: verdict === "miscast" || verdict === SEEDED_WORD,
    advisorShadow:
      row.advisorShadow === true ||
      verdict === "advisor-shadow" ||
      verdict === PATH_WORD,
    parentBadge: row.parentBadge,
    fablePaint: row.fablePaint,
    sonnetTurn: row.sonnetTurn,
    opusTurn: row.opusTurn,
    haikuTurn: row.haikuTurn,
    advisorAttachment: row.advisorAttachment,
    labelLie: row.labelLie,
    overrideHonoured: row.overrideHonoured,
    cue: hold
      ? "ascribed"
      : row.advisorShadow || verdict === "advisor-shadow"
        ? "advisor-shadow"
        : "miscast",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit ascribed" : "score prosopon",
    badgeInspect: inspectParentBadgeMark(row),
    paintInspect: inspectFablePaintMark(row),
    attachmentInspect: inspectAdvisorAttachmentMark(row),
    lieInspect: inspectLabelLieMark(row),
    overrideInspect: inspectOverrideMark(row),
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
      : PROSOPON_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "miscast");
  const path = scored.filter((row) => row.verdict === "advisor-shadow");
  const ascribed = scored.filter((row) => row.verdict === "ascribed");
  const headline =
    scored.find((row) => row.event === "miscast") ||
    scored.find((row) => row.event === "advisor-shadow") ||
    scored.find((row) => row.event === "fable-paint") ||
    charged[charged.length - 1];
  let verdict = "ascribed";
  if (charged.length) verdict = "miscast";
  else if (path.length && !ascribed.length) {
    verdict = "advisor-shadow";
  }
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
    miscastCount: charged.length,
    pathCount: path.length,
    ascribedCount: ascribed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit ascribed" : "score prosopon",
    note: headline
      ? "Background-agent view shows the parent's advisor model (Fable) instead of the subagent's requested model. Cite-only cousin #76381."
      : "published prosopon walk scored against ascribed vs miscast",
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
    seeded !== "ascribed" &&
    seeded !== "miscast" &&
    seeded !== "advisor-shadow" &&
    ticket.ascribed == null &&
    ticket.miscast == null &&
    ticket.advisorShadow == null &&
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
    ascribed: scored.ascribed ?? false,
    miscast: scored.miscast ?? false,
    advisorShadow: scored.advisorShadow ?? false,
    parentBadge: scored.parentBadge ?? false,
    fablePaint: scored.fablePaint ?? false,
    sonnetTurn: scored.sonnetTurn ?? false,
    opusTurn: scored.opusTurn ?? false,
    haikuTurn: scored.haikuTurn ?? false,
    advisorAttachment: scored.advisorAttachment ?? false,
    labelLie: scored.labelLie ?? false,
    overrideHonoured: scored.overrideHonoured ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD || verdict === SEEDED_WORD) return PRODUCT_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.advisorShadow || result.miscast
      ? "kind=advisor-shadow"
      : "kind=clay-mask",
    result.parentBadge || result.miscast
      ? "ref=parent-badge"
      : "ref=orchestra-pit",
    result.advisorShadow || result.verdict === "advisor-shadow"
      ? "path=advisor-shadow"
      : "path=ascribed",
    result.cue === "ascribed"
      ? "cue=ascribed"
      : result.cue === "advisor-shadow"
        ? "cue=advisor-shadow"
        : "cue=miscast",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    ascribed: result.ascribed,
    miscast: result.miscast,
    advisorShadow: result.advisorShadow,
    parentBadge: result.parentBadge,
    fablePaint: result.fablePaint,
    sonnetTurn: result.sonnetTurn,
    opusTurn: result.opusTurn,
    haikuTurn: result.haikuTurn,
    advisorAttachment: result.advisorAttachment,
    labelLie: result.labelLie,
    overrideHonoured: result.overrideHonoured,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    badge: inspectParentBadgeMark({
      ascribed: result.ascribed,
      miscast: result.miscast,
      parentBadge: result.parentBadge,
    }),
    paint: inspectFablePaintMark({
      ascribed: result.ascribed,
      miscast: result.miscast,
      fablePaint: result.fablePaint,
    }),
    attachment: inspectAdvisorAttachmentMark({
      ascribed: result.ascribed,
      miscast: result.miscast,
      advisorAttachment: result.advisorAttachment,
    }),
    lie: inspectLabelLieMark({
      ascribed: result.ascribed,
      miscast: result.miscast,
      labelLie: result.labelLie,
    }),
    override: inspectOverrideMark({
      ascribed: result.ascribed,
      miscast: result.miscast,
      overrideHonoured: result.overrideHonoured,
    }),
    post: mapProsopon({
      ascribed: result.ascribed,
      miscast: result.miscast,
      advisorShadow: result.advisorShadow,
      parentBadge: result.parentBadge,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      miscast: result.miscast === true || result.verdict === "miscast",
    })),
    leakPath: scoreAdvisorShadow({
      ascribed: result.ascribed === true && !result.miscast,
      miscast: result.miscast,
      advisorShadow: result.advisorShadow,
      parentBadge: result.parentBadge,
      fablePaint: result.fablePaint,
      advisorAttachment: result.advisorAttachment,
      labelLie: result.labelLie,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): the background-agent view appears to read advisor_tool.attachment.model (parent's advisor) for the badge instead of the subagent's own message.model turns. Invite verify against #94575 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
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
