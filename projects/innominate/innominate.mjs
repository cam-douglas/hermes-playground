#!/usr/bin/env node
/**
 * Innominate — innominate nameplate / blank-escutcheon booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * the main chat footer Send/Stop button is one type:submit control
 * that flips Send↔Stop; children are icon-only. Windows UI Automation
 * Name is empty "" in BOTH states. No aria-label / aria-labelledby /
 * title. Screen readers hear only "button"; voice control cannot
 * invoke it. WCAG 2.2 SC 4.1.2 Name Role Value Level A. A live
 * region announces conversation state but does not name the button.
 * The same bundle labels 23 other controls including sibling
 * "Send side question".
 *
 *   node innominate.mjs data/blank.json
 *   echo '{"seed":"blank"}' | node innominate.mjs
 *
 * Idle word is named (HOLD: button has a state-aware accessible name).
 * Seeded word is blank (#93769 — empty UIA Name / no aria-label).
 * Path word is icon-only.
 * Product score word is innominate (Score innominate or admit named.).
 *
 * Encoded from anthropics/claude-code#93769 issue text only.
 * Hypothesis (NON-BINDING): aria-label={busy ? "Stop response" : "Send message"}
 * plus docs for interrupt. Verify against #93769 text only. Do NOT
 * claim a root cause in Claude Code source you have not seen. Do NOT
 * implement a fix. No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "named",
  "blank",
  "innominate",
  "icon-only",
  "hold",
  "label-button",
  "empty-uia-name",
  "no-aria-label",
  "live-region-only",
  "sibling-labeled",
  "wcag-412",
  "send-stop",
  "voice-control",
  "docs-gap",
  "long-standing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "named";
export const PATH_WORD = "icon-only";
export const SEEDED_WORD = "blank";
export const PRODUCT_WORD = "innominate";
export const HOLD = Object.freeze(["named", "hold"]);
export const RECOVER = Object.freeze(["named", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
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
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "blank" && name !== "innominate"),
);

export const FEATURED_ISSUE = 93769;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93769";
export const TITLE =
  "Chat panel: Send/Stop button has no accessible name — breaks screen readers and voice control (WCAG 4.1.2), plus no documented way to stop an agent";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:a11y",
  "platform:vscode",
]);
export const PLATFORM = "vscode";
export const CLAUDE_VERSION = "2.1.268 / 2.1.269";
export const CHECKED_RANGE = "2.1.209 → 2.1.269";
export const SCREEN_READER_SHIP = "2.1.236";
export const UIA_NAME = "";
export const ARIA_ROLE = "button";
export const BUTTON_TYPE = "submit";
export const CONTROL_CLASS = "sendButton_gGYT1w";
export const SIBLING_LABEL = "Send side question";
export const LABELED_COUNT = 23;
export const WCAG_SC = "4.1.2 Name, Role, Value";
export const WCAG_LEVEL = "A";
export const SUGGESTED_LABEL =
  'aria-label={busy ? "Stop response" : "Send message"}';
export const LIVE_ANNOUNCEMENTS = Object.freeze([
  "Claude is working.",
  "Ready for your input.",
  "Claude is asking you a question.",
  "Claude has finished a plan and is waiting for your review.",
]);
export const CHECKED_BUILDS = Object.freeze([
  "2.1.209",
  "2.1.236",
  "2.1.259",
  "2.1.268",
  "2.1.269",
]);
export const OS_LABEL = "Windows 10";
export const SURFACE = "Claude Code for VS Code";
export const PHRASE = "Score innominate or admit named.";
export const DISTRIBUTION =
  "The main chat footer Send/Stop button is one type:submit control that flips Send↔Stop; children are icon-only. Measured with Windows UI Automation: UIA Name is empty \"\" in BOTH states; no aria-label / aria-labelledby / title; AriaRole=button unlabeled. Screen readers hear only \"button\" (send vs stop indistinguishable); voice control cannot invoke it (needs accessible name). WCAG 2.2 SC 4.1.2 Name Role Value Level A failure on the control that can discard in-progress work. Live region announces \"Claude is working.\" / \"Ready for your input.\" etc. but does NOT give the button a name; mitigates event-stream users only. Same bundle correctly labels 23 other controls including sibling \"Send side question\". Button has been unlabeled across 2.1.209, 2.1.236 (when screen-reader support shipped), 2.1.259, 2.1.268/269 — not a recent regression. Docs advertise screen-reader support but document no way to STOP/interrupt; Enter sends; stop undocumented. Meta: a11y scoped as blind+hands-capable; motor-impaired voice users who see fine are also blocked by the same missing name.";
export const SESSION_KIND =
  "Claude Code for VS Code 2.1.268 / 2.1.269 on Windows 10; also checked 2.1.209 → 2.1.269. Main chat footer Send/Stop is one type:submit control. UIA Name empty in both Send and Stop states. Live region talks; plate stays blank.";
export const RULED_OUT = Object.freeze([
  "transcript coalescing into an unnavigable block (#86874)",
  "desktop tray unlabeled icon / empty tooltip (#91606)",
  "voice mode / AX screen-reader flag issues (#89002 #88221 #87123)",
  "AskUserQuestion NVDA (#88839)",
  "VoiceOver box-drawing (#91058)",
  "the live region itself being a name for the Send/Stop control (it announces state, not the button)",
]);
export const EXPECTED = Object.freeze([
  "state-aware accessible name on the Send/Stop control",
  'aria-label={busy ? "Stop response" : "Send message"} (and/or a matching title)',
  "document how to interrupt in the Use a screen reader section",
]);

export const INNOMINATE_PLAQUES = Object.freeze([
  { id: "plate", label: "nameplate", count: "blank", note: "UIA Name empty" },
  { id: "button", label: "Send/Stop", count: "icon-only", note: "type:submit flip" },
  { id: "live", label: "live region", count: "talks", note: "does not name the plate" },
  { id: "wcag", label: "WCAG 4.1.2", count: "fail", note: "Name Role Value Level A" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "nameplate",
    survey: "read the innominate plate (accessible name on Send/Stop)",
    kind: "nameplate",
    note: "seeded: the plate that should carry the name is blank",
  },
  {
    id: "send-stop",
    survey: "press the dual-state Send/Stop submit control",
    kind: "send-stop",
    note: "seeded: one type:submit flips Send↔Stop; children are icon-only",
  },
  {
    id: "uia-meter",
    survey: "read the UIA Name meter in both states",
    kind: "uia-meter",
    note: "seeded: Name is empty \"\" for Send and for Stop",
  },
  {
    id: "live-ticker",
    survey: "listen to the polite live region",
    kind: "live-ticker",
    note: "seeded: announces Claude is working / Ready for your input — does not label the plate",
  },
  {
    id: "wcag-plaque",
    survey: "check the WCAG 4.1.2 plaque",
    kind: "wcag-plaque",
    note: "seeded: Name Role Value Level A failure on the control that can discard in-progress work",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "icon-only",
  "blank",
  "empty-uia-name",
  "no-aria-label",
  "live-region-only",
  "sibling-labeled",
  "wcag-412",
  "send-stop",
  "voice-control",
  "docs-gap",
  "long-standing",
]);

export const COUSINS = Object.freeze([
  {
    issue: 86874,
    title: "transcript unnavigable block",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #86874 transcript coalescing into an unnavigable block. Related a11y, different surface. Do not rebuild",
  },
  {
    issue: 91606,
    title: "desktop tray empty tooltip",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91606 desktop tray unlabeled icon / empty tooltip. Related missing name, not the chat Send/Stop. Do not rebuild",
  },
  {
    issue: 89002,
    title: "AX screen-reader mode",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #89002 AX screen-reader mode. Voice / AX flag, not the unlabeled Send/Stop. Do not rebuild",
  },
  {
    issue: 88221,
    title: "AX screen-reader mode",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #88221 AX screen-reader mode. Voice / AX flag, not the unlabeled Send/Stop. Do not rebuild",
  },
  {
    issue: 87123,
    title: "AX screen-reader mode",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #87123 AX screen-reader mode. Voice / AX flag, not the unlabeled Send/Stop. Do not rebuild",
  },
  {
    issue: 88839,
    title: "AskUserQuestion NVDA",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #88839 AskUserQuestion NVDA. Related a11y, not the footer Send/Stop name. Do not rebuild",
  },
  {
    issue: 91058,
    title: "VoiceOver box-drawing",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #91058 VoiceOver box-drawing. Related a11y, not the unlabeled Send/Stop. Do not rebuild",
  },
  {
    issue: 70425,
    title: "broader a11y",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #70425 broader a11y. Do not rebuild",
  },
  {
    issue: 74694,
    title: "broader a11y",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #74694 broader a11y. Do not rebuild",
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
    issue: 93766,
    title: "next-focus backup",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93764,
    title: "next-focus backup",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93754,
    title: "next-focus backup",
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
    issue: 93761,
    title: "disable-model-invocation Skill tool",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "snuffer",
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
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "escutcheon",
  "lacuna",
  "palimpsest",
  "oubliette",
  "ephemera",
  "annunciator",
  "tocsin",
  "knell",
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
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "homonym",
]);

export const SAMPLE_PLATE = Object.freeze({
  named: false,
  text: "",
  blank: true,
});

export const SAMPLE_NAMED_PLATE = Object.freeze({
  named: true,
  text: "Send message",
  blank: false,
});

export const SAMPLE_BUTTON = Object.freeze({
  type: BUTTON_TYPE,
  iconOnly: true,
  busy: false,
  labeled: false,
});

export const SAMPLE_NAMED_BUTTON = Object.freeze({
  type: BUTTON_TYPE,
  iconOnly: false,
  busy: false,
  labeled: true,
});

export const SAMPLE_UIA = Object.freeze({
  name: UIA_NAME,
  empty: true,
  role: ARIA_ROLE,
});

export const SAMPLE_NAMED_UIA = Object.freeze({
  name: "Send message",
  empty: false,
  role: ARIA_ROLE,
});

export const SAMPLE_LIVE = Object.freeze({
  talks: true,
  labelsButton: false,
  announcements: LIVE_ANNOUNCEMENTS,
});

export const SAMPLE_NAMED_LIVE = Object.freeze({
  talks: true,
  labelsButton: true,
  announcements: LIVE_ANNOUNCEMENTS,
});

export const SAMPLE_SIBLING = Object.freeze({
  label: SIBLING_LABEL,
  labeled: true,
  mainLabeled: false,
});

export const SAMPLE_NAMED_SIBLING = Object.freeze({
  label: SIBLING_LABEL,
  labeled: true,
  mainLabeled: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "nameplate carries a state-aware accessible name; Send and Stop are distinguishable" },
  { t: "send-stop", line: "one type:submit control flips Send↔Stop; children are icon-only" },
  { t: "empty-uia-name", line: "Windows UIA Name is empty \"\" in BOTH states" },
  { t: "no-aria-label", line: "no aria-label / aria-labelledby / title on the footer button" },
  { t: "icon-only", line: "icon-only children — visual sendIcon / stopIcon swap is not a name" },
  { t: "live-region-only", line: "live region announces Claude is working / Ready for your input — does not name the plate" },
  { t: "sibling-labeled", line: "same bundle labels 23 other controls including Send side question" },
  { t: "wcag-412", line: "WCAG 2.2 SC 4.1.2 Name Role Value Level A on the control that can discard in-progress work" },
  { t: "voice-control", line: "voice control cannot invoke a nameless button; screen readers hear only button" },
  { t: "docs-gap", line: "docs advertise screen-reader support; Enter sends; stop / interrupt undocumented" },
  { t: "long-standing", line: "unlabeled across 2.1.209, 2.1.236, 2.1.259, 2.1.268/269 — not a recent regression" },
  { t: "path", line: "icon-only — the plate over the dual-state control stays innominate" },
  { t: "score", line: "when the plate is blank the booth is innominate — Score innominate or admit named." },
]);

export function inspectPlate(input = {}) {
  const plate =
    input.plate && typeof input.plate === "object"
      ? input.plate
      : input.named === true && input.blank !== true
        ? SAMPLE_NAMED_PLATE
        : SAMPLE_PLATE;
  const forcedBlank =
    input.blank === true ||
    input.iconOnly === true ||
    input.event === "blank" ||
    input.event === "innominate" ||
    input.event === "icon-only" ||
    input.event === "empty-uia-name";
  const blank = forcedBlank ? true : plate.blank === true && input.named !== true;
  return {
    named: !blank,
    text: blank ? "" : plate.text || "Send message",
    blank,
    stamp: blank ? "plate-blank" : "plate-named",
    note: blank
      ? "innominate plate — UIA Name empty; no aria-label on Send/Stop"
      : "nameplate carries a state-aware accessible name",
  };
}

export function inspectButton(input = {}) {
  const button =
    input.button && typeof input.button === "object"
      ? input.button
      : input.named === true && input.blank !== true
        ? SAMPLE_NAMED_BUTTON
        : SAMPLE_BUTTON;
  const forcedIcon =
    input.sendStop === true ||
    input.event === "send-stop" ||
    input.event === "icon-only" ||
    (input.blank === true && input.named !== true);
  const iconOnly = forcedIcon ? true : button.iconOnly === true;
  return {
    type: BUTTON_TYPE,
    iconOnly,
    busy: button.busy === true,
    labeled: !iconOnly,
    stamp: iconOnly ? "button-icon-only" : "button-named",
    note: iconOnly
      ? "type:submit flips Send↔Stop; children are icon-only"
      : "Send/Stop exposes a state-aware accessible name",
  };
}

export function inspectUia(input = {}) {
  const uia =
    input.uia && typeof input.uia === "object"
      ? input.uia
      : input.named === true && input.blank !== true
        ? SAMPLE_NAMED_UIA
        : SAMPLE_UIA;
  const forcedEmpty =
    input.emptyUiaName === true ||
    input.event === "empty-uia-name" ||
    input.event === "no-aria-label" ||
    (input.blank === true && input.named !== true);
  const empty = forcedEmpty ? true : uia.empty === true;
  return {
    name: empty ? "" : uia.name || "Send message",
    empty,
    role: ARIA_ROLE,
    stamp: empty ? "uia-empty" : "uia-named",
    note: empty
      ? "UIA Name is empty \"\" in both Send and Stop states"
      : "UIA Name is state-aware (Send message / Stop response)",
  };
}

export function inspectLive(input = {}) {
  const live =
    input.live && typeof input.live === "object"
      ? input.live
      : input.named === true && input.blank !== true
        ? SAMPLE_NAMED_LIVE
        : SAMPLE_LIVE;
  const forcedTalks =
    input.liveRegionOnly === true ||
    input.event === "live-region-only" ||
    input.iconOnly === true ||
    (input.blank === true && input.named !== true);
  const labelsButton = forcedTalks ? false : live.labelsButton === true;
  return {
    talks: true,
    labelsButton,
    announcements: LIVE_ANNOUNCEMENTS,
    stamp: labelsButton ? "live-labels" : "live-talks",
    note: labelsButton
      ? "live region and the plate agree on Send vs Stop"
      : "live region talks but does not give the button a name",
  };
}

export function inspectSibling(input = {}) {
  const sibling =
    input.sibling && typeof input.sibling === "object"
      ? input.sibling
      : input.named === true && input.blank !== true
        ? SAMPLE_NAMED_SIBLING
        : SAMPLE_SIBLING;
  const forcedGap =
    input.siblingLabeled === true ||
    input.event === "sibling-labeled" ||
    input.iconOnly === true ||
    (input.blank === true && input.named !== true);
  const mainLabeled = forcedGap ? false : sibling.mainLabeled === true;
  return {
    label: SIBLING_LABEL,
    labeled: true,
    mainLabeled,
    stamp: mainLabeled ? "sibling-and-main" : "sibling-only",
    note: mainLabeled
      ? "main Send/Stop is labeled like its sibling"
      : "sibling Send side question is labeled; the main plate is not",
  };
}

export function readBooth(input = {}) {
  const plate = inspectPlate(input);
  const button = inspectButton(input);
  const uia = inspectUia(input);
  const live = inspectLive(input);
  const sibling = inspectSibling(input);
  const blank =
    input.named !== true &&
    ((button.iconOnly && plate.blank) ||
      (uia.empty && !live.labelsButton) ||
      input.blank === true);
  const named = input.named === true && blank !== true && !button.iconOnly;
  const path =
    button.iconOnly &&
    (input.event === "icon-only" || input.iconOnly === true);
  return {
    plate,
    button,
    uia,
    live,
    sibling,
    plaques: INNOMINATE_PLAQUES,
    stations: BOOTH_STATIONS,
    blank: blank && !named && !path,
    named:
      named ||
      (!button.iconOnly &&
        !plate.blank &&
        input.blank !== true &&
        input.iconOnly !== true),
    iconOnly: path && !named,
    mark:
      path && !named
        ? "icon-only"
        : blank && !named
          ? "blank"
          : "named",
  };
}

/**
 * Published innominate walk from #93769 only. Facts from the issue text.
 * A named booth keeps a state-aware accessible name on Send/Stop.
 * A blank booth leaves the plate empty in both states.
 * An icon-only booth names the icon-only children path.
 */
export const INNOMINATE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-named",
    named: true,
    blank: false,
    cue: "named",
    note: "idle HOLD: button has a state-aware accessible name",
  },
  {
    t: "send-stop",
    event: "send-stop",
    blank: true,
    sendStop: true,
    cue: "blank",
    note: "one type:submit control flips Send↔Stop; children are icon-only",
  },
  {
    t: "empty-uia-name",
    event: "empty-uia-name",
    blank: true,
    emptyUiaName: true,
    cue: "blank",
    note: "Windows UIA Name is empty \"\" in BOTH states",
  },
  {
    t: "no-aria-label",
    event: "no-aria-label",
    blank: true,
    noAriaLabel: true,
    cue: "blank",
    note: "no aria-label / aria-labelledby / title on the footer button",
  },
  {
    t: "path",
    event: "icon-only",
    blank: true,
    iconOnly: true,
    emptyUiaName: true,
    cue: "blank",
    note: "icon-only — visual sendIcon / stopIcon swap is not a name",
  },
  {
    t: "live-region-only",
    event: "live-region-only",
    blank: true,
    liveRegionOnly: true,
    cue: "blank",
    note: "live region announces state; it does not name the plate",
  },
  {
    t: "sibling-labeled",
    event: "sibling-labeled",
    blank: true,
    siblingLabeled: true,
    cue: "blank",
    note: "same bundle labels 23 other controls including Send side question",
  },
  {
    t: "wcag-412",
    event: "wcag-412",
    blank: true,
    wcag412: true,
    cue: "blank",
    note: "WCAG 2.2 SC 4.1.2 Name Role Value Level A",
  },
  {
    t: "voice-control",
    event: "voice-control",
    blank: true,
    voiceControl: true,
    cue: "blank",
    note: "voice control cannot invoke a nameless button",
  },
  {
    t: "docs-gap",
    event: "docs-gap",
    blank: true,
    docsGap: true,
    cue: "blank",
    note: "docs advertise screen-reader support; stop / interrupt undocumented",
  },
  {
    t: "long-standing",
    event: "long-standing",
    blank: true,
    longStanding: true,
    cue: "blank",
    note: "unlabeled across 2.1.209 through 2.1.269 — not a recent regression",
  },
  {
    t: "path",
    event: "icon-only",
    blank: true,
    iconOnly: true,
    emptyUiaName: true,
    noAriaLabel: true,
    cue: "blank",
    note: "icon-only — the plate over the dual-state control stays innominate",
  },
  {
    t: "score",
    event: "innominate",
    blank: true,
    iconOnly: true,
    emptyUiaName: true,
    noAriaLabel: true,
    liveRegionOnly: true,
    siblingLabeled: true,
    wcag412: true,
    sendStop: true,
    voiceControl: true,
    docsGap: true,
    longStanding: true,
    cue: "blank",
    note: "innominate — when the plate is blank the booth never stays named",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "label-button",
    named: true,
    labelButton: true,
    cue: "named",
    note: "positive control: aria-label={busy ? \"Stop response\" : \"Send message\"}",
  },
  {
    t: "announce",
    event: "cue-named",
    named: true,
    cue: "named",
    note: "positive control: screen readers and voice control can distinguish Send from Stop",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    named: true,
    blank: false,
    labelButton: true,
    cue: "named",
  };
}

export function seedNamed() {
  return { ...emptyTicket() };
}

export function seedBlank() {
  return {
    seed: SEEDED_WORD,
    named: false,
    blank: true,
    emptyUiaName: true,
    noAriaLabel: true,
    liveRegionOnly: true,
    siblingLabeled: true,
    wcag412: true,
    sendStop: true,
    iconOnly: true,
    voiceControl: true,
    docsGap: true,
    longStanding: true,
    cue: "blank",
    issue: FEATURED_ISSUE,
    plate: SAMPLE_PLATE,
    button: SAMPLE_BUTTON,
    uia: SAMPLE_UIA,
    live: SAMPLE_LIVE,
    sibling: SAMPLE_SIBLING,
  };
}

export function seedInnominate() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    blank: true,
    emptyUiaName: true,
    noAriaLabel: true,
    liveRegionOnly: true,
    siblingLabeled: true,
    wcag412: true,
    sendStop: true,
    iconOnly: true,
    voiceControl: true,
    docsGap: true,
    longStanding: true,
    cue: "blank",
  };
}

export function seedIconOnly() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    blank: true,
    iconOnly: true,
    emptyUiaName: true,
    noAriaLabel: true,
    event: "icon-only",
    cue: "blank",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    named: true,
    cue: "named",
  };
}

export function seedLabelButton() {
  return {
    seed: "label-button",
    preferSeed: true,
    labelButton: true,
    cue: "named",
  };
}

export function seedEmptyUiaName() {
  return {
    seed: "empty-uia-name",
    preferSeed: true,
    emptyUiaName: true,
    cue: "blank",
  };
}

export function seedNoAriaLabel() {
  return {
    seed: "no-aria-label",
    preferSeed: true,
    noAriaLabel: true,
    cue: "blank",
  };
}

export function seedLiveRegionOnly() {
  return {
    seed: "live-region-only",
    preferSeed: true,
    liveRegionOnly: true,
    cue: "blank",
  };
}

export function seedSiblingLabeled() {
  return {
    seed: "sibling-labeled",
    preferSeed: true,
    siblingLabeled: true,
    cue: "blank",
  };
}

export function seedWcag412() {
  return {
    seed: "wcag-412",
    preferSeed: true,
    wcag412: true,
    cue: "blank",
  };
}

export function seedSendStop() {
  return {
    seed: "send-stop",
    preferSeed: true,
    sendStop: true,
    cue: "blank",
  };
}

export function seedVoiceControl() {
  return {
    seed: "voice-control",
    preferSeed: true,
    voiceControl: true,
    cue: "blank",
  };
}

export function seedDocsGap() {
  return {
    seed: "docs-gap",
    preferSeed: true,
    docsGap: true,
    cue: "blank",
  };
}

export function seedLongStanding() {
  return {
    seed: "long-standing",
    preferSeed: true,
    longStanding: true,
    cue: "blank",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      named: false,
      blank: false,
      iconOnly: false,
      labelButton: false,
      emptyUiaName: false,
      noAriaLabel: false,
      liveRegionOnly: false,
      siblingLabeled: false,
      wcag412: false,
      sendStop: false,
      voiceControl: false,
      docsGap: false,
      longStanding: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    named: raw.named === true,
    blank:
      raw.blank === true ||
      raw.event === "blank" ||
      raw.event === "innominate",
    iconOnly: raw.iconOnly === true || raw.event === "icon-only",
    labelButton: raw.labelButton === true || raw.event === "label-button",
    emptyUiaName: raw.emptyUiaName === true || raw.event === "empty-uia-name",
    noAriaLabel: raw.noAriaLabel === true || raw.event === "no-aria-label",
    liveRegionOnly:
      raw.liveRegionOnly === true || raw.event === "live-region-only",
    siblingLabeled:
      raw.siblingLabeled === true || raw.event === "sibling-labeled",
    wcag412: raw.wcag412 === true || raw.event === "wcag-412",
    sendStop: raw.sendStop === true || raw.event === "send-stop",
    voiceControl: raw.voiceControl === true || raw.event === "voice-control",
    docsGap: raw.docsGap === true || raw.event === "docs-gap",
    longStanding: raw.longStanding === true || raw.event === "long-standing",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    plate: raw.plate,
    button: raw.button,
    uia: raw.uia,
    live: raw.live,
    sibling: raw.sibling,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.named != null ||
        ticket.blank != null ||
        ticket.iconOnly != null ||
        ticket.emptyUiaName != null ||
        ticket.noAriaLabel != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.plate ||
        ticket.button ||
        ticket.uia),
  );
}

function isNamed(row) {
  if (row.blank && row.cue !== "named") return false;
  if (
    row.cue === "blank" ||
    row.cue === "innominate" ||
    row.cue === "icon-only"
  ) {
    return false;
  }
  if (
    row.emptyUiaName &&
    row.noAriaLabel &&
    row.cue !== "named" &&
    row.named !== true
  ) {
    return false;
  }
  if (
    row.iconOnly &&
    row.emptyUiaName &&
    row.cue !== "named" &&
    row.named !== true
  ) {
    return false;
  }
  if (row.named === true && row.blank !== true && row.cue !== "blank") {
    return true;
  }
  if (
    row.cue === "named" &&
    row.blank !== true &&
    row.emptyUiaName !== true &&
    row.iconOnly !== true
  ) {
    return true;
  }
  if (
    row.labelButton === true &&
    row.blank !== true &&
    row.emptyUiaName !== true &&
    row.noAriaLabel !== true &&
    row.iconOnly !== true
  ) {
    return true;
  }
  return false;
}

function isIconOnlyPath(row) {
  return (
    row.event === "icon-only" &&
    !isNamed(row) &&
    (row.iconOnly === true ||
      row.emptyUiaName === true ||
      row.noAriaLabel === true)
  );
}

function isBlank(row) {
  if (isNamed(row)) return false;
  if (isIconOnlyPath(row) && row.cue !== "blank") return false;
  if (row.cue === "blank" || row.cue === "innominate") return true;
  if (row.blank === true) return true;
  if (
    row.emptyUiaName === true &&
    row.noAriaLabel === true &&
    row.liveRegionOnly === true
  ) {
    return true;
  }
  if (row.emptyUiaName === true && row.noAriaLabel === true) {
    return true;
  }
  if (
    row.liveRegionOnly === true ||
    row.siblingLabeled === true ||
    row.sendStop === true ||
    (row.iconOnly === true && row.noAriaLabel === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one innominate pass against the nameplate bench.
 * named: button has a state-aware accessible name.
 * blank / innominate: empty UIA Name / no aria-label.
 * icon-only: children are icon-only; visual swap is not a name.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isIconOnlyPath(row) ||
    (row.iconOnly && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "icon-only";
  } else if (isBlank(row)) {
    verdict = "innominate";
  } else if (isNamed(row)) {
    verdict = "named";
  } else if (
    row.emptyUiaName ||
    row.noAriaLabel ||
    row.liveRegionOnly ||
    (row.iconOnly && !row.labelButton)
  ) {
    verdict = "innominate";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const plate = inspectPlate(row);
  const button = inspectButton(row);
  const uia = inspectUia(row);
  const live = inspectLive(row);
  const sibling = inspectSibling(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    named: verdict === "named" || verdict === "hold",
    blank:
      verdict === "blank" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    iconOnly:
      row.iconOnly === true ||
      verdict === "icon-only" ||
      verdict === PATH_WORD,
    labelButton: row.labelButton,
    emptyUiaName: row.emptyUiaName,
    noAriaLabel: row.noAriaLabel,
    liveRegionOnly: row.liveRegionOnly,
    siblingLabeled: row.siblingLabeled,
    wcag412: row.wcag412,
    sendStop: row.sendStop,
    voiceControl: row.voiceControl,
    docsGap: row.docsGap,
    longStanding: row.longStanding,
    cue: hold
      ? "named"
      : row.iconOnly || verdict === "icon-only"
        ? "icon-only"
        : "blank",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit named" : "score innominate",
    plateInspect: plate,
    buttonInspect: button,
    uiaInspect: uia,
    liveInspect: live,
    siblingInspect: sibling,
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
      : INNOMINATE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const blank = scored.filter(
    (row) => row.verdict === "innominate" || row.verdict === "blank",
  );
  const path = scored.filter((row) => row.verdict === "icon-only");
  const named = scored.filter((row) => row.verdict === "named");
  const headline =
    scored.find((row) => row.event === "blank") ||
    scored.find((row) => row.event === "icon-only") ||
    scored.find((row) => row.event === "send-stop") ||
    blank[blank.length - 1];
  let verdict = "named";
  if (blank.length) verdict = "innominate";
  else if (path.length && !named.length) verdict = "icon-only";
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
    blankCount: blank.length,
    pathCount: path.length,
    namedCount: named.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit named" : "score innominate",
    note: headline
      ? "Send/Stop ships with empty UIA Name because children are icon-only and no aria-label is set."
      : "published innominate walk scored against named vs blank",
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
    seeded !== "named" &&
    seeded !== "blank" &&
    seeded !== "icon-only" &&
    seeded !== "innominate" &&
    ticket.named == null &&
    ticket.blank == null &&
    ticket.emptyUiaName == null &&
    ticket.iconOnly == null &&
    ticket.noAriaLabel == null &&
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
    named: scored.named ?? false,
    blank: scored.blank ?? false,
    iconOnly: scored.iconOnly ?? false,
    labelButton: scored.labelButton ?? false,
    emptyUiaName: scored.emptyUiaName ?? false,
    noAriaLabel: scored.noAriaLabel ?? false,
    liveRegionOnly: scored.liveRegionOnly ?? false,
    siblingLabeled: scored.siblingLabeled ?? false,
    wcag412: scored.wcag412 ?? false,
    sendStop: scored.sendStop ?? false,
    voiceControl: scored.voiceControl ?? false,
    docsGap: scored.docsGap ?? false,
    longStanding: scored.longStanding ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.named && !result.blank ? "plate=named" : "plate=blank",
    result.emptyUiaName || result.blank ? "uia=empty" : "uia=named",
    result.noAriaLabel || result.blank ? "aria=none" : "aria=label",
    result.liveRegionOnly || result.blank ? "live=talks" : "live=labels",
    result.iconOnly || result.verdict === "icon-only"
      ? "path=icon-only"
      : "path=named",
    result.cue === "named"
      ? "cue=named"
      : result.cue === "icon-only"
        ? "cue=icon-only"
        : "cue=blank",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    named: result.named,
    blank: result.blank,
    iconOnly: result.iconOnly,
    labelButton: result.labelButton,
    emptyUiaName: result.emptyUiaName,
    noAriaLabel: result.noAriaLabel,
    liveRegionOnly: result.liveRegionOnly,
    siblingLabeled: result.siblingLabeled,
    wcag412: result.wcag412,
    sendStop: result.sendStop,
    voiceControl: result.voiceControl,
    docsGap: result.docsGap,
    longStanding: result.longStanding,
    plate: input && input.plate,
    button: input && input.button,
    uia: input && input.uia,
    live: input && input.live,
    sibling: input && input.sibling,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    plate: inspectPlate({
      named: result.named,
      blank: result.blank,
      iconOnly: result.iconOnly,
      plate: input && input.plate,
    }),
    button: inspectButton({
      named: result.named,
      blank: result.blank,
      sendStop: result.sendStop,
      button: input && input.button,
    }),
    uia: inspectUia({
      named: result.named,
      blank: result.blank,
      emptyUiaName: result.emptyUiaName,
      uia: input && input.uia,
    }),
    live: inspectLive({
      named: result.named,
      blank: result.blank,
      liveRegionOnly: result.liveRegionOnly,
      iconOnly: result.iconOnly,
      live: input && input.live,
    }),
    sibling: inspectSibling({
      named: result.named,
      blank: result.blank,
      siblingLabeled: result.siblingLabeled,
      iconOnly: result.iconOnly,
      sibling: input && input.sibling,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      blank:
        result.blank === true ||
        result.verdict === "blank" ||
        result.verdict === "innominate",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      checkedRange: CHECKED_RANGE,
      screenReaderShip: SCREEN_READER_SHIP,
      uiaName: UIA_NAME,
      ariaRole: ARIA_ROLE,
      buttonType: BUTTON_TYPE,
      controlClass: CONTROL_CLASS,
      siblingLabel: SIBLING_LABEL,
      labeledCount: LABELED_COUNT,
      wcagSc: WCAG_SC,
      wcagLevel: WCAG_LEVEL,
      suggestedLabel: SUGGESTED_LABEL,
      liveAnnouncements: [...LIVE_ANNOUNCEMENTS],
      checkedBuilds: [...CHECKED_BUILDS],
      osLabel: OS_LABEL,
      surface: SURFACE,
      plaques: INNOMINATE_PLAQUES,
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
        "NON-BINDING: aria-label={busy ? \"Stop response\" : \"Send message\"} plus docs for interrupt. Invite verify against #93769 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
