#!/usr/bin/env node
/**
 * Fibula — Roman cloak-pin / fibula atelier classifier.
 * A fibula that clasps on a mute DISPLAY is not a hold.
 * Score the pin or admit sprung.
 *
 *   echo '{"display":":20","displaySet":true,"muteXSocket":true,"addonSync":true,"noTimeout":true,"osc52Emitted":false,"tuiResponsive":false,"escapeWorks":false,"eventLoopStuck":true,"dragSelect":true,"fullscreen":true,"killOnly":true}' | node fibula.mjs
 *   node fibula.mjs ticket.json
 *
 * Idle word is sprung (HOLD: clipboard path fails fast or uses OSC 52;
 * TUI stays responsive after drag-select; Escape works; no sync hang
 * on mute DISPLAY).
 * Seeded state is clasped / #91306 (drag-select → sync
 * setLinuxClipboardText hang on mute X DISPLAY socket; no timeout;
 * no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck
 * in poll).
 * NEVER idle as clasped, literal, jammed, sifted, stocked, aired,
 * drained, hinged, pealed, warded, first-wins, seized, pooled, cased.
 *
 * Primary #91306: In the fullscreen renderer, finishing a mouse
 * drag-select can block the entire Claude Code process. Selection
 * highlight stays on screen; keypresses ignored; Escape does nothing;
 * only recovery is killing the terminal. Cause: Linux native clipboard
 * path — when DISPLAY is set and neither xclip nor xsel is installed,
 * bundled clipboard-napi addon setLinuxClipboardText is called
 * synchronously with no timeout. If the X socket accepts the
 * connection but never completes the handshake, that call never
 * returns and the event loop sticks in poll (wchan do_sys_poll).
 *
 * Hypothesis only (NON-BINDING): fullscreen drag-select always takes
 * the native Linux clipboard path when DISPLAY is set, with no timeout
 * and no OSC 52 fallback when the X handshake stalls. Do not claim a
 * root cause in Claude Code source you have not seen. Verify against
 * the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the pin is sprung or clasped.
 *
 * NOT virgule / composing-stick / index-0 slash menu.
 * NOT riddle-sieve / foundry mesh / duplicate-ip firewall abort.
 * NOT grain loft / garner / bin / airing-hatch.
 * NOT millrace / sluice-gate / pool-gauge.
 * NOT peal-board / belfry / carillon.
 * NOT postern-gate / night bailey.
 * NOT plane-table / alidade.
 * NOT rudder pintle / gudgeon / tiller.
 * NOT leftover woodworking / mm-slider.
 * Product name stays Fibula. Do not rename to Clipboard / Display /
 * X11 / Socket / Hang / Freeze / Virgule / Riddle / Garner / Pintle.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sprung",
  "clasped",
  "display-hang",
  "clipboard-napi-sync",
  "no-timeout",
  "x-socket-mute",
  "drag-select-freeze",
  "no-osc52-fallback",
  "kill-only-escape",
  "event-loop-stuck",
  "has-repro",
  "hold",
]);
export const IDLE_WORD = "sprung";
export const SEEDED_WORD = "clasped";
export const HOLD_VERDICTS = Object.freeze(["sprung", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91306;
export const PRIMARY_ISSUES = Object.freeze([91306]);
export const COUSINS = Object.freeze([
  61936, 72173, 89097, 74214, 88898, 80330, 88779,
]);
export const COUSIN_ISSUE = 61936;
export const CROSS_ECOSYSTEM = Object.freeze(["openai/codex#33968"]);
export const NOT_PRODUCTS = Object.freeze([
  "virgule",
  "riddle",
  "garner",
  "pintle",
  "carillon",
  "postern",
  "sluice",
  "alidade",
  "cockade",
  "lye",
  "woodworking",
  "mm-slider",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91306";
export const TITLE =
  "[Bug] Fullscreen drag-select blocks TUI when DISPLAY points to unresponsive X socket";
export const FILED_AT = "2026-09-01T19:42:48Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:tui",
  "platform:vscode",
]);
export const REPORTER = "Legonois";
export const VERSION = "2.1.257";
export const VERSION_219 = "2.1.219";
export const VERSION_231 = "2.1.231";
export const BUILD_TIME = "2026-09-01T05:28:54Z";
export const GIT_SHA = "2c673eef";
export const PLATFORM = "linux";
export const ARCH = "x64";
export const VSCODE = "1.134.0";
export const TERM_PROGRAM = "vscode";
export const TUI_SETTING = "fullscreen";
export const DISPLAY_HANG = ":20";
export const DISPLAY_REFUSED = ":0";
export const WCHAN = "do_sys_poll";
export const ADDON = "setLinuxClipboardText";
export const ADDON_BUNDLE = "clipboard-napi";
export const COPY_PATH =
  "copySelectionNoClear -> setClipboard -> native Linux copy";
export const PROBE_ORDER = Object.freeze(["wl-copy", "xclip", "xsel", "addon"]);
export const DISPLAY_RE = "^(unix)?:";
export const X_SOCKET = "/tmp/.X11-unix/X";
export const WORKAROUNDS = Object.freeze([
  "unset DISPLAY",
  "CLAUDE_CODE_DISABLE_MOUSE=1",
  "/tui default",
]);
export const HUB_LINE =
  "09:50 fibula: a fibula that clasps on a mute DISPLAY is not a hold. Score the pin or admit sprung.";
export const MARK = "09:50 / hermes catalog #110 / #91306";
export const PHRASE =
  "A fibula that clasps on a mute DISPLAY is not a hold. Score the pin or admit sprung.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: fullscreen drag-select always takes the native Linux clipboard path when DISPLAY is set, with no timeout and no OSC 52 fallback when the X handshake stalls. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is FULLSCREEN DRAG-SELECT → SYNC clipboard-napi setLinuxClipboardText HANG WHEN DISPLAY POINTS AT A MUTE X SOCKET; NO TIMEOUT; NO OSC 52 FALLBACK; TUI EVENT LOOP STUCK (kill-only). In the fullscreen renderer, finishing a mouse drag-select can block the entire Claude Code process. Selection highlight stays on screen; keypresses ignored; Escape does nothing; only recovery is killing the terminal. When DISPLAY is set and neither xclip nor xsel is installed, bundled clipboard-napi addon setLinuxClipboardText is called synchronously with no timeout. If the X socket accepts the connection but never completes the handshake, that call never returns and the event loop sticks in poll (wchan do_sys_poll). Easy hit in VS Code Remote-SSH + Remote-Containers / Coder: Remote-Containers creates /tmp/.X11-unix/X<N> inside the container and sets DISPLAY=:<N> even when no real X server answers behind the forward. Environment: Claude Code 2.1.257 (BUILD_TIME 2026-09-01T05:28:54Z, GIT_SHA 2c673eef); same path present in 2.1.219 and 2.1.231; Linux x64 devcontainer; VS Code 1.134.0; TERM_PROGRAM=vscode; tui: fullscreen; DISPLAY=:20; no xclip/xsel/wl-copy. Evidence: DISPLAY=:20 hangs → no OSC 52, wchan do_sys_poll; DISPLAY unset → OSC 52 emitted, keeps responding; DISPLAY=:0 refused → OSC 52 emitted, keeps responding. NOT Virgule #91337 (slash/skills menu trigger bound to message index 0 / composing stick). NOT Riddle #91327 (devcontainer ipset duplicate + set -e firewall abort / mesh sieve). NOT Garner #91246 (Desktop archive-to-pool no TTL / loft). NOT Pintle #91226 (PreToolUse Bash relative-path cwd-drift deadlock). NOT Carillon #91250 (plugin SessionStart first-wins). NOT Postern #91223 (socket-dir squat). NOT Sluice #91265 (Cowork Toke/File/SeAt kernel pool leak / millrace). NOT Alidade #91055 (silent foreign host). NOT Cockade #91033 (ultracode badge / effort slider mismatch). NOT #89097 (WSL platform string misses xclip branch — copy fails; does not freeze TUI event loop). NOT #80330 (orphaned xclip selection grab freezes desktop — different surface). NOT leftover woodworking / mm-slider. Product name stays Fibula.";
export const FORBIDDEN_IDLE = Object.freeze([
  "clasped",
  "literal",
  "jammed",
  "sifted",
  "stocked",
  "aired",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "first-wins",
  "seized",
  "pooled",
  "cased",
]);
export const BANNED_NAMES = Object.freeze([
  "Clipboard",
  "Display",
  "X11",
  "Socket",
  "Hang",
  "Freeze",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "composing stick",
  "type-case",
  "lead sorts",
  "vermilion virgule",
  "wire mesh",
  "ore grit",
  "copper rivet",
  "coal strap",
  "grain loft",
  "airing hatch",
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "postern-gate",
  "night bailey",
  "plane-table",
  "rudder pintle",
  "gudgeon",
  "woodworking",
  "mm-slider",
]);

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    display: "",
    displaySet: null,
    muteXSocket: null,
    xclipInstalled: null,
    xselInstalled: null,
    wlCopyInstalled: null,
    addonSync: null,
    noTimeout: null,
    osc52Emitted: null,
    tuiResponsive: null,
    escapeWorks: null,
    eventLoopStuck: null,
    wchan: "",
    dragSelect: null,
    fullscreen: null,
    killOnly: null,
    version: "",
    buildTime: "",
    gitSha: "",
    vscode: "",
    termProgram: "",
    platform: "",
    tuiSetting: "",
    displayHang: null,
    clipboardNapiSync: null,
    xSocketMute: null,
    dragSelectFreeze: null,
    noOsc52Fallback: null,
    hasRepro: null,
    cousin: "",
    outputText: "",
  };
}

export function seedSprung() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    display: "",
    displaySet: false,
    muteXSocket: false,
    xclipInstalled: false,
    xselInstalled: false,
    wlCopyInstalled: false,
    addonSync: false,
    noTimeout: false,
    osc52Emitted: true,
    tuiResponsive: true,
    escapeWorks: true,
    eventLoopStuck: false,
    wchan: "",
    dragSelect: true,
    fullscreen: true,
    killOnly: false,
    version: VERSION,
    buildTime: BUILD_TIME,
    gitSha: GIT_SHA,
    vscode: VSCODE,
    termProgram: TERM_PROGRAM,
    platform: PLATFORM,
    tuiSetting: TUI_SETTING,
    displayHang: false,
    clipboardNapiSync: false,
    xSocketMute: false,
    dragSelectFreeze: false,
    noOsc52Fallback: false,
    hasRepro: false,
    cousin: "",
    outputText:
      "sprung; clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; no sync hang on mute DISPLAY; idle word sprung",
  };
}

export function seedClasped() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    xclipInstalled: false,
    xselInstalled: false,
    wlCopyInstalled: false,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    buildTime: BUILD_TIME,
    gitSha: GIT_SHA,
    vscode: VSCODE,
    termProgram: TERM_PROGRAM,
    platform: PLATFORM,
    tuiSetting: TUI_SETTING,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    cousin: "",
    outputText:
      "clasped; #91306; drag-select → sync setLinuxClipboardText hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll",
  };
}

export function seedDisplayHang() {
  return {
    seed: "display-hang",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "display-hang; DISPLAY=:20 hangs; no OSC 52; wchan do_sys_poll; Remote-Containers X socket accepts and never completes the handshake",
  };
}

export function seedClipboardNapiSync() {
  return {
    seed: "clipboard-napi-sync",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    xclipInstalled: false,
    xselInstalled: false,
    wlCopyInstalled: false,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "clipboard-napi-sync; bundled clipboard-napi addon setLinuxClipboardText called synchronously on the main thread; copy path copySelectionNoClear -> setClipboard -> native Linux copy",
  };
}

export function seedNoTimeout() {
  return {
    seed: "no-timeout",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "no-timeout; setLinuxClipboardText is called synchronously with no timeout; if the X socket accepts but never completes the handshake the call never returns",
  };
}

export function seedXSocketMute() {
  return {
    seed: "x-socket-mute",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "x-socket-mute; Remote-Containers creates /tmp/.X11-unix/X<N> inside the container and sets DISPLAY=:<N> even when no real X server answers behind the forward; DISPLAY=:20",
  };
}

export function seedDragSelectFreeze() {
  return {
    seed: "drag-select-freeze",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "drag-select-freeze; finishing a mouse drag-select in the fullscreen renderer blocks the entire Claude Code process; selection highlight stays on screen",
  };
}

export function seedNoOsc52Fallback() {
  return {
    seed: "no-osc52-fallback",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "no-osc52-fallback; after mouse release no OSC 52 emitted; expected: if native path cannot reach the display, fail fast and fall back to OSC 52",
  };
}

export function seedKillOnlyEscape() {
  return {
    seed: "kill-only-escape",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "kill-only-escape; keypresses ignored; Escape does nothing; only recovery is killing the terminal",
  };
}

export function seedEventLoopStuck() {
  return {
    seed: "event-loop-stuck",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "event-loop-stuck; process sits in poll; wchan do_sys_poll; stops reacting to keyboard and further mouse events; last rendered frame is the selection highlight",
  };
}

export function seedHasRepro() {
  return {
    seed: "has-repro",
    source: "atelier",
    display: DISPLAY_HANG,
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: WCHAN,
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    version: VERSION,
    displayHang: true,
    clipboardNapiSync: true,
    xSocketMute: true,
    dragSelectFreeze: true,
    noOsc52Fallback: true,
    hasRepro: true,
    outputText:
      "has-repro; create a Unix socket that accepts and never replies, point DISPLAY at it; run claude with fullscreen renderer; drag-select text and release; labels include has repro",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    display: "",
    displaySet: false,
    muteXSocket: false,
    addonSync: false,
    noTimeout: false,
    osc52Emitted: true,
    tuiResponsive: true,
    escapeWorks: true,
    eventLoopStuck: false,
    wchan: "",
    dragSelect: true,
    fullscreen: true,
    killOnly: false,
    version: VERSION,
    displayHang: false,
    clipboardNapiSync: false,
    xSocketMute: false,
    dragSelectFreeze: false,
    noOsc52Fallback: false,
    hasRepro: false,
    outputText:
      "hold; clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; the pin is sprung",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "61936",
    version: VERSION,
    outputText:
      "cousin-not-primary; #61936 same symptom attributed to mouse tracking — cite; mouse tracking only enables in-app selection; not the #91306 mute DISPLAY setLinuxClipboardText hang",
  };
}

export function emptyTicket() {
  return seedSprung();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.fibula && typeof src.fibula === "object" && src.fibula) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.pin && typeof src.pin === "object" && src.pin) ||
    src;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    source: firstText(nested.source, src.source),
    display: firstText(nested.display, src.display),
    displaySet: firstBool(nested.displaySet, nested.display_set, src.displaySet),
    muteXSocket: firstBool(
      nested.muteXSocket,
      nested.mute_x_socket,
      src.muteXSocket,
    ),
    xclipInstalled: firstBool(
      nested.xclipInstalled,
      nested.xclip_installed,
      src.xclipInstalled,
    ),
    xselInstalled: firstBool(
      nested.xselInstalled,
      nested.xsel_installed,
      src.xselInstalled,
    ),
    wlCopyInstalled: firstBool(
      nested.wlCopyInstalled,
      nested.wl_copy_installed,
      src.wlCopyInstalled,
    ),
    addonSync: firstBool(nested.addonSync, nested.addon_sync, src.addonSync),
    noTimeout: firstBool(nested.noTimeout, nested.no_timeout, src.noTimeout),
    osc52Emitted: firstBool(
      nested.osc52Emitted,
      nested.osc52_emitted,
      src.osc52Emitted,
    ),
    tuiResponsive: firstBool(
      nested.tuiResponsive,
      nested.tui_responsive,
      src.tuiResponsive,
    ),
    escapeWorks: firstBool(
      nested.escapeWorks,
      nested.escape_works,
      src.escapeWorks,
    ),
    eventLoopStuck: firstBool(
      nested.eventLoopStuck,
      nested.event_loop_stuck,
      src.eventLoopStuck,
    ),
    wchan: firstText(nested.wchan, src.wchan),
    dragSelect: firstBool(
      nested.dragSelect,
      nested.drag_select,
      src.dragSelect,
    ),
    fullscreen: firstBool(nested.fullscreen, src.fullscreen),
    killOnly: firstBool(nested.killOnly, nested.kill_only, src.killOnly),
    version: firstText(nested.version, src.version),
    buildTime: firstText(nested.buildTime, nested.build_time, src.buildTime),
    gitSha: firstText(nested.gitSha, nested.git_sha, src.gitSha),
    vscode: firstText(nested.vscode, src.vscode),
    termProgram: firstText(
      nested.termProgram,
      nested.term_program,
      src.termProgram,
    ),
    platform: firstText(nested.platform, src.platform),
    tuiSetting: firstText(
      nested.tuiSetting,
      nested.tui_setting,
      src.tuiSetting,
    ),
    displayHang: firstBool(
      nested.displayHang,
      nested.display_hang,
      src.displayHang,
    ),
    clipboardNapiSync: firstBool(
      nested.clipboardNapiSync,
      nested.clipboard_napi_sync,
      src.clipboardNapiSync,
    ),
    xSocketMute: firstBool(
      nested.xSocketMute,
      nested.x_socket_mute,
      src.xSocketMute,
    ),
    dragSelectFreeze: firstBool(
      nested.dragSelectFreeze,
      nested.drag_select_freeze,
      src.dragSelectFreeze,
    ),
    noOsc52Fallback: firstBool(
      nested.noOsc52Fallback,
      nested.no_osc52_fallback,
      src.noOsc52Fallback,
    ),
    hasRepro: firstBool(nested.hasRepro, nested.has_repro, src.hasRepro),
    cousin: firstText(nested.cousin, src.cousin),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (Array.isArray(value)) {
      if (value.length) out[key] = value;
      continue;
    }
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  return (
    row.displaySet == null &&
    row.muteXSocket == null &&
    row.addonSync == null &&
    row.noTimeout == null &&
    row.osc52Emitted == null &&
    row.tuiResponsive == null &&
    row.escapeWorks == null &&
    row.eventLoopStuck == null &&
    row.killOnly == null &&
    row.displayHang == null &&
    row.clipboardNapiSync == null &&
    row.xSocketMute == null &&
    row.dragSelectFreeze == null &&
    row.noOsc52Fallback == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSprung,
  [SEEDED_WORD]: seedClasped,
  "display-hang": seedDisplayHang,
  "clipboard-napi-sync": seedClipboardNapiSync,
  "no-timeout": seedNoTimeout,
  "x-socket-mute": seedXSocketMute,
  "drag-select-freeze": seedDragSelectFreeze,
  "no-osc52-fallback": seedNoOsc52Fallback,
  "kill-only-escape": seedKillOnlyEscape,
  "event-loop-stuck": seedEventLoopStuck,
  "has-repro": seedHasRepro,
  hold: seedHold,
  cousin: seedCousin,
  61936: seedCousin,
};

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedClasped(), ...cloned, ...raw };
  }
  if (COUSINS.includes(issue) && coreMissing) {
    return {
      ...seedCousin(),
      ...cloned,
      ...raw,
      issue,
      cousin: String(issue),
    };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.cousin, ticket.seed, ticket.display, ticket.wchan]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isSprung(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.osc52Emitted === true &&
    row.tuiResponsive === true &&
    row.eventLoopStuck === false
  ) {
    return true;
  }
  return false;
}

export function isClasped(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.addonSync === true &&
    row.osc52Emitted === false &&
    (row.muteXSocket === true ||
      row.eventLoopStuck === true ||
      row.noTimeout === true ||
      row.killOnly === true ||
      row.displayHang === true)
  ) {
    return true;
  }
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#61936|#72173|#89097|#74214|#88898|#80330|#88779|codex#33968/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const claspedNow = !cousinOnly && isClasped(row);
  const sprungNow = !claspedNow && isSprung(row);
  const displayHang =
    row.displayHang === true ||
    row.display === DISPLAY_HANG ||
    named === "display-hang" ||
    /display-hang|DISPLAY=:20|DISPLAY points/i.test(text);
  const clipboardNapi =
    row.clipboardNapiSync === true ||
    row.addonSync === true ||
    named === "clipboard-napi-sync" ||
    /clipboard-napi-sync|setLinuxClipboardText|clipboard-napi/i.test(text);
  const noTimeout =
    row.noTimeout === true ||
    named === "no-timeout" ||
    /no-timeout|no timeout|synchronously with no timeout/i.test(text);
  const xSocketMute =
    row.xSocketMute === true ||
    row.muteXSocket === true ||
    named === "x-socket-mute" ||
    /x-socket-mute|mute X|X socket|\/tmp\/\.X11-unix/i.test(text);
  const dragFreeze =
    row.dragSelectFreeze === true ||
    (row.dragSelect === true && row.tuiResponsive === false) ||
    named === "drag-select-freeze" ||
    /drag-select-freeze|drag-select|drag selection/i.test(text);
  const noOsc52 =
    row.noOsc52Fallback === true ||
    row.osc52Emitted === false ||
    named === "no-osc52-fallback" ||
    /no-osc52-fallback|no OSC 52|OSC 52 fallback/i.test(text);
  const killOnly =
    row.killOnly === true ||
    row.escapeWorks === false ||
    named === "kill-only-escape" ||
    /kill-only-escape|Escape does nothing|killing the terminal/i.test(text);
  const loopStuck =
    row.eventLoopStuck === true ||
    row.wchan === WCHAN ||
    named === "event-loop-stuck" ||
    /event-loop-stuck|do_sys_poll|sits in poll/i.test(text);
  const hasRepro =
    row.hasRepro === true ||
    named === "has-repro" ||
    /has-repro|has repro/i.test(text);
  const clasped =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (claspedNow || named === SEEDED_WORD || /clasped|#91306/i.test(text));
  const sprung =
    named === IDLE_WORD ||
    named === "hold" ||
    (sprungNow && !clasped);
  return {
    named,
    cousinOnly,
    claspedNow,
    sprungNow,
    displayHang,
    clipboardNapi,
    noTimeout,
    xSocketMute,
    dragFreeze,
    noOsc52,
    killOnly,
    loopStuck,
    hasRepro,
    clasped,
    sprung,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.sprung && !flags.clasped) chips.push("sprung");
  if (flags.clasped) chips.push("clasped");
  if (flags.displayHang && flags.clasped) chips.push("display-hang");
  if (flags.clipboardNapi && flags.clasped) chips.push("clipboard-napi-sync");
  if (flags.noTimeout && flags.clasped) chips.push("no-timeout");
  if (flags.xSocketMute && flags.clasped) chips.push("x-socket-mute");
  if (flags.dragFreeze && flags.clasped) chips.push("drag-select-freeze");
  if (flags.noOsc52 && flags.clasped) chips.push("no-osc52-fallback");
  if (flags.killOnly && flags.clasped) chips.push("kill-only-escape");
  if (flags.loopStuck && flags.clasped) chips.push("event-loop-stuck");
  if (flags.hasRepro && flags.clasped) chips.push("has-repro");
  if ((flags.sprung || flags.named === "hold") && !flags.clasped) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "sprung") {
    reasons.push(
      "sprung; clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; no sync hang on mute DISPLAY",
    );
    reasons.push("hold: the pin is sprung; score treats fail-fast clipboard");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; the pin is sprung",
    );
  }
  if (verdict === "clasped" || flags.clasped) {
    reasons.push(
      "clasped; #91306; drag-select → sync setLinuxClipboardText hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll",
    );
  }
  if (flags.displayHang || verdict === "display-hang") {
    reasons.push(
      "display-hang; DISPLAY=:20 hangs; no OSC 52; wchan do_sys_poll",
    );
  }
  if (flags.clipboardNapi || verdict === "clipboard-napi-sync") {
    reasons.push(
      `clipboard-napi-sync; bundled ${ADDON_BUNDLE} addon ${ADDON} called synchronously on the main thread; ${COPY_PATH}`,
    );
  }
  if (flags.noTimeout || verdict === "no-timeout") {
    reasons.push(
      "no-timeout; setLinuxClipboardText is called synchronously with no timeout",
    );
  }
  if (flags.xSocketMute || verdict === "x-socket-mute") {
    reasons.push(
      `x-socket-mute; Remote-Containers creates ${X_SOCKET}<N> and sets DISPLAY=:<N> even when no real X server answers; DISPLAY=${DISPLAY_HANG}`,
    );
  }
  if (flags.dragFreeze || verdict === "drag-select-freeze") {
    reasons.push(
      "drag-select-freeze; finishing a mouse drag-select in the fullscreen renderer blocks the entire Claude Code process",
    );
  }
  if (flags.noOsc52 || verdict === "no-osc52-fallback") {
    reasons.push(
      "no-osc52-fallback; after mouse release no OSC 52 emitted; expected fail-fast fallback to OSC 52",
    );
  }
  if (flags.killOnly || verdict === "kill-only-escape") {
    reasons.push(
      "kill-only-escape; keypresses ignored; Escape does nothing; only recovery is killing the terminal",
    );
  }
  if (flags.loopStuck || verdict === "event-loop-stuck") {
    reasons.push(
      `event-loop-stuck; process sits in poll; wchan ${WCHAN}; last rendered frame is the selection highlight`,
    );
  }
  if (flags.hasRepro || verdict === "has-repro") {
    reasons.push(
      "has-repro; Unix socket that accepts and never replies; DISPLAY pointed at it; fullscreen drag-select and release",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Fibula; cite-only clipboard / mouse-tracking / Wayland surface, not the mute DISPLAY setLinuxClipboardText hang",
    );
  }
  if (verdict === "clasped" || flags.clasped) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "sprung" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.sprung || !flags.clasped)) return "sprung";
  if (named === "hold" && !flags.clasped) return "hold";
  if (named === SEEDED_WORD) return "clasped";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "sprung";
  if (flags.clasped) return "clasped";
  if (flags.sprung) return "sprung";
  return "sprung";
}

function pinOf(flags, ticket, verdict) {
  if (verdict === "clasped" || flags.clasped) {
    return {
      case: "clasped — mute DISPLAY seizes the catch",
      pin: "bronze bow fibula shut; iron pin jammed in the catch-plate",
      catch: `DISPLAY=${ticket.display || DISPLAY_HANG} · mute X socket · no OSC 52`,
      cloak: "cloak fold clasped; scriptorium seized",
      mark: "terracotta catch seized on a mute socket",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "sprung — clipboard fails fast or uses OSC 52",
      pin: "bronze bow fibula open; iron pin sprung",
      catch: "catch-plate free · OSC 52 or native tool",
      cloak: "cloak fold loose; TUI responsive",
      mark: "terracotta catch open; the pin is sprung",
      note: "Hold: the pin is sprung.",
    };
  }
  return {
    case: "sprung — fail-fast clipboard; TUI stays free",
    pin: "bronze bow fibula open; Escape works",
    catch: "catch-plate free · no sync hang on mute DISPLAY",
    cloak: "cloak fold loose after drag-select",
    mark: "terracotta catch open; idle word sprung",
    note: "Sprung: the pin holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const clasped = verdict === "clasped" || flags.clasped;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    sprung: verdict === "sprung" || (flags.sprung && !clasped),
    clasped,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: pinOf(flags, ticket, verdict),
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 91306 || name === "91306") {
    return analyze(seedClasped());
  }
  if (name === "display-hang") return analyze(seedDisplayHang());
  if (name === "clipboard-napi-sync") return analyze(seedClipboardNapiSync());
  if (name === "no-timeout") return analyze(seedNoTimeout());
  if (name === "x-socket-mute") return analyze(seedXSocketMute());
  if (name === "drag-select-freeze") return analyze(seedDragSelectFreeze());
  if (name === "no-osc52-fallback") return analyze(seedNoOsc52Fallback());
  if (name === "kill-only-escape") return analyze(seedKillOnlyEscape());
  if (name === "event-loop-stuck") return analyze(seedEventLoopStuck());
  if (name === "has-repro") return analyze(seedHasRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "sprung" || name === "open") {
    return analyze(seedSprung());
  }
  if (name === 61936 || name === "61936" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSprung());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "clasped" || (result.clasped && result.alarm)
          ? `clasped fibula #${FEATURED_ISSUE}: fullscreen drag-select → sync ${ADDON} hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only; event loop stuck in poll (wchan ${WCHAN}). ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Clipboard path fails fast or uses OSC 52. Score the pin."
            : `sprung fibula. Idle word ${IDLE_WORD}. Clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
