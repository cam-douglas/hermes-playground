#!/usr/bin/env node
/**
 * Trismus — oral-surgery / lockjaw / trigeminal clinic booth.
 *
 * Educational diagnostic model for a published Claude Desktop defect:
 * After a Code-tab integrated terminal command finishes, Claude Desktop
 * on macOS locks up completely at the moment it would post the "done"
 * notification. The window cannot be moved or force-redrawn; there is
 * no spinning beachball. Force quit is the only way out.
 *
 * A `sample` of the hung process shows the main thread blocked
 * synchronously inside `swift_addon.node` on
 * `-[UNUserNotificationCenter addNotificationRequest:withCompletionHandler:]`,
 * waiting on `com.apple.usernotifications.UNUserNotificationServiceConnection`.
 * That queue is itself blocked inside `swift_addon.node`
 * `NotificationService.close(id:)` doing a synchronous XPC round trip for
 * `removePendingNotificationRequestsWithIdentifiers:`. A third thread is
 * also blocked in `NotificationService.close(id:)` on
 * `removeDeliveredNotificationsWithIdentifiers:`.
 *
 * Lock-order deadlock: posting a new notification vs closing old ones,
 * with the main thread caught in the middle.
 *
 *   node trismus.mjs data/trismus.json
 *   echo '{"seed":"trismus"}' | node trismus.mjs
 *
 * Idle word is limber (HOLD: main thread free; notification post/close
 * never blocks UI; jaw opens).
 * Seeded word is trismus (#93823 — Code-tab terminal done chime
 * deadlocks main thread inside swift_addon.node UNUserNotification XPC).
 * Path word is notif-xpc-deadlock.
 * Product score word is trismus (Score trismus or admit limber.).
 *
 * Encoded from anthropics/claude-code#93823 issue text only.
 * Hypothesis (NON-BINDING): NotificationService.close and
 * addNotificationRequest take XPC locks in opposite order on the main
 * thread / sync bridge. Do NOT claim a root cause in Claude Code source
 * you have not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude. No secrets.
 *
 * NOT Foundling/#93889 (subagent Bash orphaning).
 * NOT Gleaner/#93794 (unreaped `&`).
 * NOT Schism/#93797 (dual-writer).
 * NOT Bash/subagent deadlocks (#92410, #91648) — different defects.
 * Trismus is specifically macOS UNUserNotification / XPC lock-order
 * main-thread deadlock on the terminal-done chime.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "hold",
  "unlocked",
  "responsive",
  "async-notif",
  "free-main",
  "unclenched",
  "main-blocked",
  "xpc-close",
  "add-notification",
  "force-quit-only",
  "code-tab-terminal-done",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "limber";
export const PATH_WORD = "notif-xpc-deadlock";
export const SEEDED_WORD = "trismus";
export const PRODUCT_WORD = "trismus";
export const HOLD = Object.freeze(["limber", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "limber",
  "unlocked",
  "responsive",
  "async-notif",
  "free-main",
  "unclenched",
]);
export const RECOVER = Object.freeze(["limber", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "vested",
  "unseised",
  "preview-eperm",
  "feoffee",
  "letters-patent",
  "demesne-open",
  "getcwd-eperm",
  "singular",
  "apographed",
  "apograph",
  "reopen-fork",
  "airlock",
  "equalized",
  "blown",
  "socat-race",
  "scotoma",
  "legible",
  "scotomized",
  "command-args-blind",
  "aneroid",
  "calibrated",
  "aneroided",
  "wrong-window-ring",
  "simulacrum",
  "tethered",
  "hollow",
  "phantom-navigate",
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "armed",
  "coil-pulled",
  "toggle-fidelity",
  "first-message-arm",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "onedrive-cwd",
  "onedrive-cwd-mislabel",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "sighted",
  "blindsided",
  "compare-ref-unreachable",
  "interdict",
  "scoped",
  "interdicted",
  "chrome-prohibit-bleed",
  "pontoon",
  "washed",
  "afloat",
  "bridge-loss",
  "simplex",
  "duplex",
  "simplexed",
  "mobile-uplink-silent",
  "deadkey",
  "keyed",
  "deadkeyed",
  "esc-csi-dead",
  "gleaner",
  "gleaned",
  "orphaned",
  "inherited",
  "unreaped-ampersand",
  "ppid-one",
  "yes-wall",
  "schism",
  "live",
  "schismed",
  "resume-while-live",
  "rasure",
  "intact",
  "rasured",
  "creation-time-flip",
  "ashpan",
  "swept",
  "ashpanned",
  "orphan-jsonl",
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "innominate",
  "icon-only",
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
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
  "released",
  "frozen",
  "sostenuto",
  "tabula",
  "ukase",
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
  "warm",
  "sheltered",
  "waif",
  "jetsam",
  "bonded",
  "registered",
  "warded",
  "parented",
  "silted",
  "drained",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "trismus"),
);

export const FEATURED_ISSUE = 93823;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93823";
export const TITLE =
  "[BUG] Claude Desktop (macOS) main thread deadlocks in swift_addon.node posting a UNUserNotification; whole app locks when a Code tab terminal command finishes";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "platform:macos",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "macos-unusernotification-xpc";
export const HOST = "macOS, Claude Desktop Code tab";
export const CHECKED_ON = "Claude Desktop on macOS, Code tab integrated terminal";
export const BUILD = "Claude Desktop (macOS)";
export const GOOD_VERSION =
  "notification post/close never blocks the main thread; app stays responsive after a terminal command completes";
export const ADDON = "swift_addon.node";
export const ADD_API =
  "-[UNUserNotificationCenter addNotificationRequest:withCompletionHandler:]";
export const CLOSE_API = "NotificationService.close(id:)";
export const XPC_QUEUE =
  "com.apple.usernotifications.UNUserNotificationServiceConnection";
export const REMOVE_PENDING =
  "removePendingNotificationRequestsWithIdentifiers:";
export const REMOVE_DELIVERED =
  "removeDeliveredNotificationsWithIdentifiers:";
export const EXIT_PATH = "force quit";
export const BEACHBALL = "none — app stops processing events entirely";
export const CACHE_CLEAR = "cleared caches / reinstall / renamed Application Support + Caches — no change";
export const MID_RESPONSE =
  "same day also froze mid-response in Code tab without terminal use (may be same notification-on-completion path)";
export const NOT_BASH_DEADLOCK = Object.freeze([92410, 91648]);
export const PHRASE = "Score trismus or admit limber.";
export const DISTRIBUTION =
  "Claude Desktop on macOS locks up completely after a Code-tab integrated terminal command finishes — at the moment it would post the \"done\" notification. Window cannot be moved or force-redrawn; no spinning beachball (app stops processing events entirely). Force quit is the only way out. sample of hung process: main thread blocked synchronously inside swift_addon.node on -[UNUserNotificationCenter addNotificationRequest:withCompletionHandler:], waiting on com.apple.usernotifications.UNUserNotificationServiceConnection. That queue is itself blocked inside swift_addon.node NotificationService.close(id:) doing a synchronous XPC round trip for removePendingNotificationRequestsWithIdentifiers:. A third thread also blocked in NotificationService.close(id:) on removeDeliveredNotificationsWithIdentifiers:. Lock-order deadlock between posting a new notification and closing old ones, with the main thread caught in the middle. Cleared caches / reinstall / renamed Application Support + Caches — no change (native notification path, not app state). Same day also froze mid-response in Code tab without terminal use (may be same notification-on-completion path). NOT Bash/subagent deadlocks (#92410, #91648). Cousins cite-only: #93495 (same class, slightly older build path; regression of #57706), #57706 (closed/stale prior: Cowork freezes on session switch — synchronous XPC notification deadlock).";

export const RULED_OUT = Object.freeze([
  "Foundling/#93889 subagent Bash orphaning — that is a child-agent lifecycle hatch; Trismus is a macOS UNUserNotification / XPC lock-order freeze on the terminal-done chime",
  "Gleaner/#93794 unreaped `&` jobs reparented to PID 1 — leftover harvest at Bash-call end, not a notification XPC deadlock",
  "Schism/#93797 dual-writer resume — two writers on one transcript, not a main-thread UNUserNotification freeze",
  "Bash/subagent deadlocks #92410 / #91648 — different defects; do not confuse with this notification XPC lock-order",
  "App-state corruption that a cache clear or reinstall would fix — cleared caches / reinstall / renamed Application Support + Caches changed nothing (native notification path)",
  "A spinning beachball that still processes some events — the window cannot be moved or force-redrawn; the app stops processing events entirely",
]);
export const EXPECTED = Object.freeze([
  "Posting or clearing a macOS notification must never block the main thread",
  "App stays responsive after a terminal command completes",
  "Notification post/close use async APIs / consistent lock order so XPC cannot deadlock UI",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "main-blocked",
    label: "main blocked",
    count: "sync add",
    note: "main thread blocked synchronously inside swift_addon.node on addNotificationRequest",
  },
  {
    id: "xpc-close",
    label: "XPC close",
    count: "close(id:)",
    note: "NotificationService.close holds the XPC path for removePendingNotificationRequestsWithIdentifiers:",
  },
  {
    id: "add-notification",
    label: "add notification",
    count: "done chime",
    note: "posting the terminal-done UNUserNotification while close still holds the queue",
  },
  {
    id: "force-quit-only",
    label: "force quit only",
    count: "no beachball",
    note: "window cannot be moved or force-redrawn; force quit is the only way out",
  },
  {
    id: "code-tab-terminal-done",
    label: "Code tab done",
    count: "chime",
    note: "Code-tab integrated terminal command finishes; freeze at the done notification",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "limber-chair",
    survey:
      "main thread free; notification post/close never blocks UI; jaw opens",
    kind: "limber",
    note: "idle: enamel chair unlocked — the hold/good path",
  },
  {
    id: "code-tab-terminal-done",
    survey:
      "Code-tab integrated terminal command finishes; the done chime is about to post",
    kind: "trismus",
    note: "seeded: clamp closes on the completion chime",
  },
  {
    id: "add-notification",
    survey:
      "main thread posts addNotificationRequest while close still holds the XPC path",
    kind: "trismus",
    note: "seeded: forceps lock on the add vs close crossing",
  },
  {
    id: "notif-xpc-deadlock",
    survey:
      "lock-order deadlock between posting a new notification and closing old ones; main thread in the middle",
    kind: "trismus",
    note: "path: notif-xpc-deadlock names the clamped jaw vs a limber bite",
  },
  {
    id: "trismus",
    survey:
      "whole Desktop UI freezes; no beachball; force quit only",
    kind: "trismus",
    note: "seeded: lockjaw — the completion chime clamped the trigeminal",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "notif-xpc-deadlock",
  "trismus",
  "main-blocked",
  "xpc-close",
  "add-notification",
  "code-tab-terminal-done",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93495,
    title:
      "Claude Desktop freezes: main thread deadlocks on synchronous UNUserNotificationCenter XPC call (macOS, regression of #57706)",
    state: "OPEN",
    citeOnly: true,
    why: "cite only — same class, slightly older build path; do not rebuild as a separate booth",
  },
  {
    issue: 57706,
    title:
      "Cowork freezes on session switch — synchronous XPC notification deadlock",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — closed/stale prior of the same notification XPC lock-order class; do not rebuild as a separate booth",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "schism",
  "gleaner",
  "waif",
  "jetsam",
  "ashpan",
  "snatch",
  "disseisin",
  "rescript",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "rasure",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "cachet",
  "ukase",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "mondegreen",
  "deadletter",
  "flashpan",
  "guillotine",
  "parergon",
  "followspot",
  "calends",
  "alidade",
  "diopter",
  "sluice",
  "hysteresis",
]);

export const SAMPLE_ADD = ADD_API;
export const SAMPLE_CLOSE = CLOSE_API;
export const SAMPLE_MAIN_IDLE = "free";
export const SAMPLE_MAIN_SEEDED = "blocked";

export const SAMPLE_LIMBER_PROOF = Object.freeze({
  limber: true,
  trismus: false,
  notifXpcDeadlock: false,
  mainBlocked: false,
  xpcClose: false,
  addNotification: false,
  forceQuitOnly: false,
  codeTabTerminalDone: false,
  version: GOOD_VERSION,
});

export const SAMPLE_TRISMUS_PROOF = Object.freeze({
  limber: false,
  trismus: true,
  notifXpcDeadlock: true,
  mainBlocked: true,
  xpcClose: true,
  addNotification: true,
  forceQuitOnly: true,
  codeTabTerminalDone: true,
  version: BUILD,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds limber: main thread free; notification post/close never blocks UI; jaw opens" },
  { t: "code-tab-terminal-done", line: "Code-tab integrated terminal command finishes; done chime is about to post" },
  { t: "add-notification", line: "main thread enters addNotificationRequest while close holds the XPC path" },
  { t: "path", line: "notif-xpc-deadlock — lock-order deadlock; main thread clamped in the middle" },
  { t: "score", line: "when the completion chime posts against a held close the booth is trismus — Score trismus or admit limber." },
]);

/**
 * Clinic map: unlocked enamel chair vs clamped jaw on the completion chime.
 * Idle/limber: main thread free; forceps tray idle; bite opens.
 * Seeded/trismus: add vs close lock-order; jaw clamped; force quit only.
 */
export function mapChair(input = {}) {
  const trismus =
    input.trismus === true ||
    input.notifXpcDeadlock === true ||
    input.mainBlocked === true ||
    input.addNotification === true ||
    input.codeTabTerminalDone === true;
  const limber = input.limber === true && !trismus;
  return {
    stamp: trismus ? "notif-xpc-deadlock" : "limber-chair",
    jawLane: trismus ? "clamped" : "open",
    mainLane: trismus ? "blocked" : "free",
    xpcLane: trismus ? "held-close" : "async",
    ribbon: trismus ? "trismus" : "limber",
    limber,
  };
}

export function inspectMain(input = {}) {
  const hit =
    input.notifXpcDeadlock === true ||
    input.trismus === true ||
    input.mainBlocked === true;
  if (input.limber === true && !hit) {
    return {
      stamp: "main-free",
      thread: SAMPLE_MAIN_IDLE,
      listed: true,
    };
  }
  if (hit) {
    return {
      stamp: "main-blocked",
      thread: SAMPLE_MAIN_SEEDED,
      listed: false,
      addon: ADDON,
      api: ADD_API,
    };
  }
  return {
    stamp: "main-idle",
    listed: true,
  };
}

export function inspectXpc(input = {}) {
  const hit =
    input.trismus === true ||
    input.notifXpcDeadlock === true ||
    input.xpcClose === true;
  if (input.limber === true && input.trismus !== true) {
    return {
      stamp: "xpc-async",
      close: "async",
      queue: "",
    };
  }
  return {
    stamp: hit ? "xpc-close" : "xpc-idle",
    close: hit ? CLOSE_API : "async",
    queue: hit ? XPC_QUEUE : "",
    pending: hit ? REMOVE_PENDING : "",
  };
}

export function inspectAdd(input = {}) {
  const posting =
    input.addNotification === true ||
    input.trismus === true ||
    input.notifXpcDeadlock === true;
  if (input.limber === true && input.addNotification !== true) {
    return {
      stamp: "add-held",
      posting: false,
      api: ADD_API,
    };
  }
  return {
    stamp: posting ? "add-notification" : "add-idle",
    posting,
    api: ADD_API,
  };
}

export function inspectForceQuit(input = {}) {
  const only =
    input.forceQuitOnly === true ||
    input.trismus === true ||
    input.notifXpcDeadlock === true;
  if (input.limber === true && input.forceQuitOnly !== true) {
    return {
      stamp: "quit-held",
      only: false,
      beachball: "n/a — UI still processes events",
    };
  }
  return {
    stamp: only ? "force-quit-only" : "quit-idle",
    only,
    exit: EXIT_PATH,
    beachball: only ? BEACHBALL : "",
  };
}

export function inspectCodeTab(input = {}) {
  const done =
    input.codeTabTerminalDone === true ||
    input.trismus === true;
  return {
    stamp: done ? "code-tab-terminal-done" : "code-tab-idle",
    done,
    chime: done ? "terminal-done" : "silent",
    midResponse: MID_RESPONSE,
  };
}

export function inspectClose(input = {}) {
  const held =
    input.xpcClose === true ||
    input.trismus === true;
  if (input.limber === true && input.xpcClose !== true) {
    return {
      stamp: "close-async",
      held: false,
    };
  }
  return {
    stamp: held ? "xpc-close" : "close-idle",
    held,
    pending: held ? REMOVE_PENDING : "",
    delivered: held ? REMOVE_DELIVERED : "",
  };
}

export function readBooth(input = {}) {
  const trismus =
    input.trismus === true ||
    input.notifXpcDeadlock === true ||
    input.mainBlocked === true ||
    input.addNotification === true ||
    input.codeTabTerminalDone === true;
  const limber = input.limber === true && !trismus;
  return {
    mark: trismus ? "trismus" : limber || !trismus ? "limber" : "trismus",
    limber,
    trismus,
    notifXpcDeadlock: input.notifXpcDeadlock === true || trismus,
    mainBlocked: input.mainBlocked === true,
    xpcClose: input.xpcClose === true,
    addNotification: input.addNotification === true,
    forceQuitOnly: input.forceQuitOnly === true,
    codeTabTerminalDone: input.codeTabTerminalDone === true,
    chair: mapChair(input),
    main: inspectMain(input),
    xpc: inspectXpc(input),
    add: inspectAdd(input),
    forceQuit: inspectForceQuit(input),
    codeTab: inspectCodeTab(input),
    close: inspectClose(input),
    log: input.log || [],
  };
}

export const TRISMUS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-limber",
    limber: true,
    trismus: false,
    cue: "limber",
    note: "idle HOLD: main thread free; notification post/close never blocks UI; jaw opens — the hold/good path",
  },
  {
    t: "code-tab-terminal-done",
    event: "code-tab-terminal-done",
    trismus: true,
    codeTabTerminalDone: true,
    cue: "trismus",
    note: "Code-tab integrated terminal command finishes; done chime is about to post",
  },
  {
    t: "add-notification",
    event: "add-notification",
    trismus: true,
    addNotification: true,
    cue: "trismus",
    note: "main thread enters addNotificationRequest while close holds the XPC path",
  },
  {
    t: "path",
    event: "notif-xpc-deadlock",
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
    cue: "trismus",
    note: "notif-xpc-deadlock — lock-order deadlock; main thread clamped in the middle",
  },
  {
    t: "score",
    event: "trismus",
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
    xpcClose: true,
    addNotification: true,
    cue: "trismus",
    note: "trismus — when the completion chime posts against a held close the booth is trismus",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-limber",
    limber: true,
    trismus: false,
    cue: "limber",
    note: "positive control: main thread free; jaw opens",
  },
  {
    t: "announce",
    event: "cue-limber",
    limber: true,
    cue: "limber",
    note: "positive control: the chair stays limber",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    limber: true,
    trismus: false,
    notifXpcDeadlock: false,
    cue: "limber",
  };
}

export function seedLimber() {
  return { ...emptyTicket() };
}

export function seedTrismus() {
  return {
    seed: SEEDED_WORD,
    limber: false,
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
    xpcClose: true,
    addNotification: true,
    forceQuitOnly: true,
    codeTabTerminalDone: true,
    cue: "trismus",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_TRISMUS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
    cue: "trismus",
  };
}

export function seedNotifXpcDeadlock() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
    event: "notif-xpc-deadlock",
    cue: "trismus",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    limber: true,
    cue: "limber",
  };
}

export function seedMainBlocked() {
  return {
    seed: "main-blocked",
    preferSeed: true,
    mainBlocked: true,
    cue: "trismus",
  };
}

export function seedXpcClose() {
  return {
    seed: "xpc-close",
    preferSeed: true,
    xpcClose: true,
    cue: "trismus",
  };
}

export function seedAddNotification() {
  return {
    seed: "add-notification",
    preferSeed: true,
    addNotification: true,
    cue: "trismus",
  };
}

export function seedForceQuitOnly() {
  return {
    seed: "force-quit-only",
    preferSeed: true,
    forceQuitOnly: true,
    cue: "trismus",
  };
}

export function seedCodeTabTerminalDone() {
  return {
    seed: "code-tab-terminal-done",
    preferSeed: true,
    codeTabTerminalDone: true,
    cue: "trismus",
  };
}

export function seedUnlocked() {
  return {
    seed: "unlocked",
    preferSeed: true,
    limber: true,
    cue: "limber",
  };
}

export function seedResponsive() {
  return {
    seed: "responsive",
    preferSeed: true,
    limber: true,
    cue: "limber",
  };
}

export function seedAsyncNotif() {
  return {
    seed: "async-notif",
    preferSeed: true,
    limber: true,
    cue: "limber",
  };
}

export function seedFreeMain() {
  return {
    seed: "free-main",
    preferSeed: true,
    limber: true,
    cue: "limber",
  };
}

export function seedUnclenched() {
  return {
    seed: "unclenched",
    preferSeed: true,
    limber: true,
    cue: "limber",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      limber: false,
      trismus: false,
      notifXpcDeadlock: false,
      mainBlocked: false,
      xpcClose: false,
      addNotification: false,
      forceQuitOnly: false,
      codeTabTerminalDone: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    limber: raw.limber === true,
    trismus:
      raw.trismus === true ||
      raw.event === "trismus",
    notifXpcDeadlock:
      raw.notifXpcDeadlock === true || raw.event === "notif-xpc-deadlock",
    mainBlocked: raw.mainBlocked === true || raw.event === "main-blocked",
    xpcClose: raw.xpcClose === true || raw.event === "xpc-close",
    addNotification:
      raw.addNotification === true || raw.event === "add-notification",
    forceQuitOnly:
      raw.forceQuitOnly === true || raw.event === "force-quit-only",
    codeTabTerminalDone:
      raw.codeTabTerminalDone === true || raw.event === "code-tab-terminal-done",
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
      (ticket.limber != null ||
        ticket.trismus != null ||
        ticket.notifXpcDeadlock != null ||
        ticket.mainBlocked != null ||
        ticket.xpcClose != null ||
        ticket.addNotification != null ||
        ticket.forceQuitOnly != null ||
        ticket.codeTabTerminalDone != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isLimber(row) {
  if (row.trismus && row.cue !== "limber") return false;
  if (
    row.cue === "trismus" ||
    row.cue === "notif-xpc-deadlock"
  ) {
    return false;
  }
  if (
    row.notifXpcDeadlock &&
    row.mainBlocked &&
    row.cue !== "limber" &&
    row.limber !== true
  ) {
    return false;
  }
  if (row.limber === true && row.trismus !== true && row.cue !== "trismus") {
    return true;
  }
  if (
    row.cue === "limber" &&
    row.trismus !== true &&
    row.notifXpcDeadlock !== true &&
    row.mainBlocked !== true &&
    row.addNotification !== true &&
    row.codeTabTerminalDone !== true
  ) {
    return true;
  }
  return false;
}

function isNotifXpcDeadlock(row) {
  return (
    row.event === "notif-xpc-deadlock" &&
    !isLimber(row) &&
    (row.notifXpcDeadlock === true ||
      row.mainBlocked === true ||
      row.addNotification === true)
  );
}

function isTrismusRow(row) {
  if (isLimber(row)) return false;
  if (isNotifXpcDeadlock(row) && row.cue !== "trismus") return false;
  if (row.cue === "trismus") return true;
  if (row.trismus === true) return true;
  if (row.notifXpcDeadlock === true && row.mainBlocked === true) {
    return true;
  }
  if (
    row.notifXpcDeadlock === true ||
    row.mainBlocked === true ||
    row.addNotification === true ||
    row.xpcClose === true ||
    row.forceQuitOnly === true ||
    row.codeTabTerminalDone === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one trismus pass against the enamel chair.
 * limber: main thread free; notification post/close never blocks UI.
 * trismus: Code-tab terminal done chime deadlocks main thread on XPC.
 * notif-xpc-deadlock: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isNotifXpcDeadlock(row) ||
    (row.notifXpcDeadlock && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "notif-xpc-deadlock";
  } else if (isTrismusRow(row)) {
    verdict = "trismus";
  } else if (isLimber(row)) {
    verdict = "limber";
  } else if (
    row.notifXpcDeadlock ||
    row.mainBlocked ||
    row.addNotification ||
    row.xpcClose ||
    row.forceQuitOnly ||
    row.codeTabTerminalDone
  ) {
    verdict = "trismus";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const main = inspectMain(row);
  const xpc = inspectXpc(row);
  const add = inspectAdd(row);
  const forceQuit = inspectForceQuit(row);
  const codeTab = inspectCodeTab(row);
  const close = inspectClose(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    limber: verdict === "limber" || verdict === "hold",
    trismus: verdict === "trismus" || verdict === SEEDED_WORD,
    notifXpcDeadlock:
      row.notifXpcDeadlock === true ||
      verdict === "notif-xpc-deadlock" ||
      verdict === PATH_WORD,
    mainBlocked: row.mainBlocked,
    xpcClose: row.xpcClose,
    addNotification: row.addNotification,
    forceQuitOnly: row.forceQuitOnly,
    codeTabTerminalDone: row.codeTabTerminalDone,
    cue: hold
      ? "limber"
      : row.notifXpcDeadlock || verdict === "notif-xpc-deadlock"
        ? "notif-xpc-deadlock"
        : "trismus",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit limber" : "score trismus",
    mainInspect: main,
    xpcInspect: xpc,
    addInspect: add,
    forceQuitInspect: forceQuit,
    codeTabInspect: codeTab,
    closeInspect: close,
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
      : TRISMUS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "trismus");
  const path = scored.filter((row) => row.verdict === "notif-xpc-deadlock");
  const limber = scored.filter((row) => row.verdict === "limber");
  const headline =
    scored.find((row) => row.event === "trismus") ||
    scored.find((row) => row.event === "notif-xpc-deadlock") ||
    scored.find((row) => row.event === "code-tab-terminal-done") ||
    dead[dead.length - 1];
  let verdict = "limber";
  if (dead.length) verdict = "trismus";
  else if (path.length && !limber.length) verdict = "notif-xpc-deadlock";
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
    trismusCount: dead.length,
    pathCount: path.length,
    limberCount: limber.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit limber" : "score trismus",
    note: headline
      ? "Code-tab terminal done chime deadlocks main thread inside swift_addon.node UNUserNotification XPC; cousins #93495 and #57706 are cite-only. Not Bash/subagent deadlocks #92410 / #91648."
      : "published trismus walk scored against limber vs trismus",
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
    seeded !== "limber" &&
    seeded !== "trismus" &&
    seeded !== "notif-xpc-deadlock" &&
    ticket.limber == null &&
    ticket.trismus == null &&
    ticket.notifXpcDeadlock == null &&
    ticket.mainBlocked == null &&
    ticket.addNotification == null &&
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
    limber: scored.limber ?? false,
    trismus: scored.trismus ?? false,
    notifXpcDeadlock: scored.notifXpcDeadlock ?? false,
    mainBlocked: scored.mainBlocked ?? false,
    xpcClose: scored.xpcClose ?? false,
    addNotification: scored.addNotification ?? false,
    forceQuitOnly: scored.forceQuitOnly ?? false,
    codeTabTerminalDone: scored.codeTabTerminalDone ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.mainBlocked || result.trismus ? "main=blocked" : "main=free",
    result.addNotification || result.trismus ? "add=sync" : "add=async",
    result.xpcClose || result.trismus ? "close=held" : "close=async",
    result.notifXpcDeadlock || result.verdict === "notif-xpc-deadlock"
      ? "path=notif-xpc-deadlock"
      : "path=limber",
    result.cue === "limber"
      ? "cue=limber"
      : result.cue === "notif-xpc-deadlock"
        ? "cue=notif-xpc-deadlock"
        : "cue=trismus",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    limber: result.limber,
    trismus: result.trismus,
    notifXpcDeadlock: result.notifXpcDeadlock,
    mainBlocked: result.mainBlocked,
    xpcClose: result.xpcClose,
    addNotification: result.addNotification,
    forceQuitOnly: result.forceQuitOnly,
    codeTabTerminalDone: result.codeTabTerminalDone,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    main: inspectMain({
      limber: result.limber,
      trismus: result.trismus,
      notifXpcDeadlock: result.notifXpcDeadlock,
      mainBlocked: result.mainBlocked,
    }),
    xpc: inspectXpc({
      limber: result.limber,
      trismus: result.trismus,
      notifXpcDeadlock: result.notifXpcDeadlock,
      xpcClose: result.xpcClose,
    }),
    add: inspectAdd({
      limber: result.limber,
      trismus: result.trismus,
      notifXpcDeadlock: result.notifXpcDeadlock,
      addNotification: result.addNotification,
    }),
    forceQuit: inspectForceQuit({
      limber: result.limber,
      trismus: result.trismus,
      notifXpcDeadlock: result.notifXpcDeadlock,
      forceQuitOnly: result.forceQuitOnly,
    }),
    codeTab: inspectCodeTab({
      limber: result.limber,
      trismus: result.trismus,
      codeTabTerminalDone: result.codeTabTerminalDone,
    }),
    close: inspectClose({
      limber: result.limber,
      trismus: result.trismus,
      xpcClose: result.xpcClose,
    }),
    chair: mapChair({
      limber: result.limber,
      trismus: result.trismus,
      notifXpcDeadlock: result.notifXpcDeadlock,
      mainBlocked: result.mainBlocked,
      addNotification: result.addNotification,
      codeTabTerminalDone: result.codeTabTerminalDone,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      trismus:
        result.trismus === true ||
        result.verdict === "trismus",
    })),
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
      goodVersion: GOOD_VERSION,
      addon: ADDON,
      addApi: ADD_API,
      closeApi: CLOSE_API,
      xpcQueue: XPC_QUEUE,
      removePending: REMOVE_PENDING,
      removeDelivered: REMOVE_DELIVERED,
      exitPath: EXIT_PATH,
      beachball: BEACHBALL,
      cacheClear: CACHE_CLEAR,
      midResponse: MID_RESPONSE,
      notBashDeadlock: [...NOT_BASH_DEADLOCK],
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: NotificationService.close and addNotificationRequest take XPC locks in opposite order on the main thread / sync bridge. Invite verify against #93823 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
