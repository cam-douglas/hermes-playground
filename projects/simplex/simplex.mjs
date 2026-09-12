#!/usr/bin/env node
/**
 * Simplex — military / ham radio simplex / half-duplex uplink booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * With `claude remote-control`, messages typed/sent from the phone
 * (mobile web) never reach the CLI. Desktop→phone still works
 * (replies visible on the phone). Phone send: the message disappears
 * from the input with no error, no queued/pending state, nothing
 * arrives on the desktop.
 *
 *   node simplex.mjs data/simplexed.json
 *   echo '{"seed":"simplexed"}' | node simplex.mjs
 *
 * Idle word is duplex (HOLD: both legs of the radio stay open —
 * phone send reaches the CLI and desktop replies still light the
 * handset).
 * Seeded word is simplexed (#93801 mobile uplink silent).
 * Path word is mobile-uplink-silent.
 * Product score word is simplex (Score simplex or admit duplex.).
 *
 * Encoded from anthropics/claude-code#93801 issue text only.
 * Hypothesis (NON-BINDING): uplink/write path from the mobile web
 * session drops or never delivers while the downlink/read path still
 * streams; silent fail (no error UI). Verify against #93801 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "duplex",
  "simplexed",
  "simplex",
  "mobile-uplink-silent",
  "hold",
  "downlink-ok",
  "uplink-vanish",
  "silent-send",
  "dual-network",
  "cleared-app-data",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "duplex";
export const PATH_WORD = "mobile-uplink-silent";
export const SEEDED_WORD = "simplexed";
export const PRODUCT_WORD = "simplex";
export const HOLD = Object.freeze(["duplex", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "duplex",
  "two-way",
  "full-duplex",
  "both-ways",
]);
export const RECOVER = Object.freeze(["duplex", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "keyed",
  "deadkeyed",
  "deadkey",
  "esc-csi-dead",
  "gleaned",
  "orphaned",
  "gleaner",
  "unreaped-ampersand",
  "live",
  "schismed",
  "schism",
  "resume-while-live",
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "swept",
  "ashpanned",
  "ashpan",
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
  "blank",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "simplexed" && name !== "simplex"),
);

export const FEATURED_ISSUE = 93801;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93801";
export const TITLE =
  "[BUG] Remote Control: sending from mobile silently fails (message disappears), reading works fine";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:claude-code-web",
  "area:cli",
]);
export const PLATFORM = "windows";
export const CLAUDE_VERSION = "2.1.236";
export const GOOD_VERSION = "previous (worked previously; last working version not named)";
export const SURFACE =
  "Native Windows claude.exe at %USERPROFILE%\\.local\\bin (not npm); Windows Terminal; Anthropic API; restaurant wifi + carrier 5G";
export const HOST = "native Windows claude.exe";
export const INSTALL_PATH = "%USERPROFILE%\\.local\\bin";
export const COMMAND = "claude remote-control";
export const PHRASE = "Score simplex or admit duplex.";
export const DISTRIBUTION =
  "When using `claude remote-control`, messages typed and sent from the phone (mobile web session) never reach the CLI. Desktop → phone works fine (I can read Claude's replies live on the phone), but anything typed and sent from the phone just disappears: no error shown, no queued/pending state, nothing arrives on the desktop side. Cleared app data on the phone and started a brand new remote-control session, got the exact same failure both times. Also tested on two completely different networks (restaurant wifi and mobile carrier 5G data) with identical results, which rules out a local firewall/network issue like the one identified as the root cause in #62284 (antivirus blocking traffic). Repro: (1) desktop `claude remote-control` (2) scan QR (3) desktop message shows on phone (4) phone message vanishes, never on CLI. Regression: yes (worked previously). Version noted: 2.1.236. Native Windows claude.exe.";
export const RULED_OUT = Object.freeze([
  "local antivirus/firewall blocking traffic (#62284)",
  "local network path as in #34619 / #45946 (ruled out by restaurant wifi + carrier 5G)",
]);
export const EXPECTED = Object.freeze([
  "Messages sent from the phone during a Remote Control session should reach the CLI and appear in the conversation",
  "The same way messages typed on the desktop reach the phone",
  "A vanished phone send should not fail silently — error, queued, or pending state should appear",
]);

export const RADIO_STRIPS = Object.freeze([
  { id: "chassis", label: "night chassis", count: "field-set", note: "deep navy radio face — not a studio ON-AIR rack" },
  { id: "downlink", label: "RX downlink", count: "lit", note: "desktop → phone still streams; replies visible on the handset" },
  { id: "uplink", label: "TX uplink", count: "dead", note: "phone → desktop vanishes; no queued/pending lamp" },
  { id: "carrier", label: "amber carrier", count: "simplex", note: "one-way carrier: downlink lit, uplink dark" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "duplex-gate",
    survey: "watch both legs of the radio stay open — phone send reaches the CLI",
    kind: "duplex",
    note: "idle: full two-way; downlink and uplink both lit — the hold/good path",
  },
  {
    id: "downlink-ok",
    survey: "from the desktop, type a message; confirm it shows on the phone",
    kind: "simplexed",
    note: "seeded: read direction still works — desktop → phone is live",
  },
  {
    id: "uplink-vanish",
    survey: "from the phone, type any message and send it",
    kind: "simplexed",
    note: "seeded: message disappears from the phone input; never on the CLI",
  },
  {
    id: "silent-send",
    survey: "look for error, queued, or pending state after the phone send",
    kind: "simplexed",
    note: "seeded: no error shown, no queued/pending state — silent fail",
  },
  {
    id: "dual-network",
    survey: "repeat on restaurant wifi and carrier 5G",
    kind: "simplexed",
    note: "seeded: identical vanish on two networks — not #62284 antivirus",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mobile-uplink-silent",
  "simplexed",
  "downlink-ok",
  "uplink-vanish",
  "silent-send",
  "dual-network",
  "cleared-app-data",
]);

export const COUSINS = Object.freeze([
  {
    issue: 62284,
    title: "antivirus blocking traffic (local firewall)",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #62284 local antivirus/firewall blocking traffic. Distinct: this booth encodes a mobile-web uplink that vanishes after restaurant wifi + carrier 5G ruled the local path out. Do not rebuild",
  },
  {
    issue: 34619,
    title: "related Remote Control / network cousin",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #34619 similar symptoms, different confirmed root cause (local network). Distinct: #93801 ruled that out on two unrelated networks. Do not rebuild",
  },
  {
    issue: 45946,
    title: "related Remote Control / network cousin",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #45946 similar symptoms, different confirmed root cause (local network). Distinct: #93801 is a silent mobile send with downlink still lit. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93798, title: "backup #93798", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93786, title: "backup #93786", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93778, title: "backup #93778", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "aphonia",
  "muzzle",
  "deadair",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "oubliette",
  "ephemera",
  "followspot",
  "mondegreen",
  "parergon",
  "guillotine",
  "flashpan",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "eidolon",
  "calends",
  "weir",
  "monadnock",
  "rider",
  "irons",
  "cathead",
  "anachronism",
]);

export const SAMPLE_DUPLEX_RIG = Object.freeze({
  downlinkLit: true,
  uplinkOpen: true,
  silent: false,
  vanishCount: 0,
  version: GOOD_VERSION,
});

export const SAMPLE_SIMPLEXED_RIG = Object.freeze({
  downlinkLit: true,
  uplinkOpen: false,
  silent: true,
  vanishCount: 1,
  version: CLAUDE_VERSION,
});

export const SAMPLE_DOWNLINK = Object.freeze({
  desktopToPhone: true,
  repliesVisible: true,
  qrLinked: true,
});

export const SAMPLE_DUPLEX_DOWNLINK = Object.freeze({
  desktopToPhone: true,
  repliesVisible: true,
  qrLinked: true,
});

export const SAMPLE_UPLINK = Object.freeze({
  phoneToDesktop: false,
  arrivesOnCli: false,
  vanished: true,
});

export const SAMPLE_DUPLEX_UPLINK = Object.freeze({
  phoneToDesktop: true,
  arrivesOnCli: true,
  vanished: false,
});

export const SAMPLE_SILENT = Object.freeze({
  errorShown: false,
  queued: false,
  pending: false,
  silent: true,
});

export const SAMPLE_DUPLEX_SILENT = Object.freeze({
  errorShown: false,
  queued: false,
  pending: false,
  silent: false,
});

export const SAMPLE_NETWORKS = Object.freeze({
  restaurantWifi: true,
  carrier5g: true,
  identicalVanish: true,
  notAntivirus: true,
});

export const SAMPLE_DUPLEX_NETWORKS = Object.freeze({
  restaurantWifi: false,
  carrier5g: false,
  identicalVanish: false,
  notAntivirus: false,
});

export const SAMPLE_CLEARED = Object.freeze({
  clearedAppData: true,
  brandNewSession: true,
  sameFailure: true,
});

export const SAMPLE_DUPLEX_CLEARED = Object.freeze({
  clearedAppData: false,
  brandNewSession: false,
  sameFailure: false,
});

export const SAMPLE_QR = Object.freeze({
  desktopCommand: COMMAND,
  qrScanned: true,
  sessionLinked: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "rig holds duplex: both legs open; phone send reaches the CLI" },
  { t: "qr", line: "desktop `claude remote-control`; phone scans QR; session links" },
  { t: "downlink-ok", line: "desktop message shows on the phone — read direction works" },
  { t: "uplink-vanish", line: "phone message disappears from the input; never on the CLI" },
  { t: "silent-send", line: "no error, no queued/pending state — silent fail" },
  { t: "cleared-app-data", line: "cleared phone app data + brand-new session; same vanish" },
  { t: "dual-network", line: "restaurant wifi + carrier 5G — rules out #62284 antivirus" },
  { t: "path", line: "mobile-uplink-silent — write path from the handset never delivers" },
  { t: "score", line: "when the uplink stays dead the booth is simplex — Score simplex or admit duplex." },
]);

export function inspectDownlink(input = {}) {
  const rig =
    input.downlink && typeof input.downlink === "object"
      ? input.downlink
      : SAMPLE_DOWNLINK;
  const forced =
    input.downlinkOk === true ||
    input.event === "downlink-ok" ||
    input.event === "simplexed" ||
    input.event === "simplex" ||
    input.simplexed === true;
  const lit = forced ? true : rig.desktopToPhone === true || rig.repliesVisible === true;
  return {
    desktopToPhone: lit,
    repliesVisible: lit,
    qrLinked: lit,
    stamp: lit ? "downlink-ok" : "downlink-dark",
    note: lit
      ? "desktop → phone still streams; replies visible on the handset"
      : "downlink also dark — not the published #93801 shape",
  };
}

export function inspectUplink(input = {}) {
  const rig =
    input.uplink && typeof input.uplink === "object"
      ? input.uplink
      : input.duplex === true && input.simplexed !== true
        ? SAMPLE_DUPLEX_UPLINK
        : SAMPLE_UPLINK;
  const forcedDead =
    input.simplexed === true ||
    input.event === "simplexed" ||
    input.event === "simplex" ||
    input.event === "mobile-uplink-silent" ||
    input.event === "uplink-vanish" ||
    input.uplinkVanish === true;
  const open = forcedDead ? false : rig.phoneToDesktop === true && input.simplexed !== true;
  return {
    phoneToDesktop: open,
    arrivesOnCli: open,
    vanished: !open,
    stamp: open ? "uplink-open" : "uplink-vanish",
    note: open
      ? "phone send reaches the CLI — both legs of the radio stay open"
      : "phone message disappears from the input; never arrives on the desktop CLI",
  };
}

export function inspectSilentSend(input = {}) {
  const silent =
    input.silent && typeof input.silent === "object"
      ? input.silent
      : input.duplex === true && input.simplexed !== true
        ? SAMPLE_DUPLEX_SILENT
        : SAMPLE_SILENT;
  const forced =
    input.silentSend === true ||
    input.event === "silent-send" ||
    input.event === "simplexed" ||
    input.event === "simplex";
  const muted = forced ? true : silent.silent === true && input.duplex !== true;
  return {
    errorShown: !muted,
    queued: false,
    pending: false,
    silent: muted,
    stamp: muted ? "silent-send" : "acked-send",
    note: muted
      ? "no error shown, no queued/pending state — silent fail"
      : "send is acknowledged; the uplink does not vanish quietly",
  };
}

export function inspectDualNetwork(input = {}) {
  const nets =
    input.networks && typeof input.networks === "object"
      ? input.networks
      : input.duplex === true && input.simplexed !== true
        ? SAMPLE_DUPLEX_NETWORKS
        : SAMPLE_NETWORKS;
  const forced =
    input.dualNetwork === true ||
    input.event === "dual-network" ||
    input.event === "simplexed" ||
    input.event === "simplex";
  const dual = forced ? true : nets.identicalVanish === true && input.duplex !== true;
  return {
    restaurantWifi: dual,
    carrier5g: dual,
    identicalVanish: dual,
    notAntivirus: dual,
    stamp: dual ? "dual-network" : "single-path",
    note: dual
      ? "restaurant wifi + carrier 5G — identical vanish; rules out #62284 antivirus"
      : "no dual-network stamp on this pass",
  };
}

export function inspectClearedAppData(input = {}) {
  const wipe =
    input.cleared && typeof input.cleared === "object"
      ? input.cleared
      : input.duplex === true && input.simplexed !== true
        ? SAMPLE_DUPLEX_CLEARED
        : SAMPLE_CLEARED;
  const forced =
    input.clearedAppData === true ||
    input.event === "cleared-app-data" ||
    input.event === "simplexed" ||
    input.event === "simplex";
  const wiped = forced ? true : wipe.sameFailure === true && input.duplex !== true;
  return {
    clearedAppData: wiped,
    brandNewSession: wiped,
    sameFailure: wiped,
    stamp: wiped ? "cleared-app-data" : "first-session",
    note: wiped
      ? "cleared phone app data + brand-new session; same silent vanish"
      : "no cleared-app-data stamp on this pass",
  };
}

export function inspectQr(input = {}) {
  const hatch =
    input.qr && typeof input.qr === "object" ? input.qr : SAMPLE_QR;
  const linked = hatch.qrScanned !== false && hatch.sessionLinked !== false;
  return {
    desktopCommand: COMMAND,
    qrScanned: linked,
    sessionLinked: linked,
    stamp: linked ? "qr-linked" : "qr-dark",
    note: linked
      ? "desktop `claude remote-control`; phone scans QR; session links"
      : "QR hatch never closed",
  };
}

export function readBooth(input = {}) {
  const downlink = inspectDownlink(input);
  const uplink = inspectUplink(input);
  const silent = inspectSilentSend(input);
  const networks = inspectDualNetwork(input);
  const cleared = inspectClearedAppData(input);
  const qr = inspectQr(input);
  const simplexed =
    input.duplex !== true &&
    ((uplink.vanished && silent.silent && downlink.desktopToPhone) ||
      input.simplexed === true);
  const duplex =
    input.duplex === true && simplexed !== true && uplink.phoneToDesktop === true;
  const path =
    (input.event === "mobile-uplink-silent" || input.mobileUplinkSilent === true) &&
    (uplink.vanished || input.simplexed === true);
  return {
    downlink,
    uplink,
    silent,
    networks,
    cleared,
    qr,
    strips: RADIO_STRIPS,
    stations: BOOTH_STATIONS,
    simplexed: simplexed && !duplex && !path,
    duplex: duplex || (!simplexed && !path && input.simplexed !== true && input.mobileUplinkSilent !== true && uplink.phoneToDesktop),
    mobileUplinkSilent: path && !duplex,
    mark:
      path && !duplex
        ? "mobile-uplink-silent"
        : simplexed && !duplex
          ? "simplexed"
          : "duplex",
  };
}

/**
 * Published simplex walk from #93801 only. Facts from the issue text.
 * A duplex booth keeps both radio legs open.
 * A simplexed booth leaves the mobile uplink permanently dead.
 * A mobile-uplink-silent booth names the one-way carrier path.
 */
export const SIMPLEX_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-duplex",
    duplex: true,
    simplexed: false,
    cue: "duplex",
    note: "idle HOLD: both legs open; phone send reaches the CLI — the hold/good path",
  },
  {
    t: "downlink-ok",
    event: "downlink-ok",
    simplexed: true,
    downlinkOk: true,
    cue: "simplexed",
    note: "desktop message shows on the phone — read direction works",
  },
  {
    t: "uplink-vanish",
    event: "uplink-vanish",
    simplexed: true,
    uplinkVanish: true,
    cue: "simplexed",
    note: "phone message disappears from the input; never on the CLI",
  },
  {
    t: "silent-send",
    event: "silent-send",
    simplexed: true,
    silentSend: true,
    cue: "simplexed",
    note: "no error, no queued/pending state",
  },
  {
    t: "cleared-app-data",
    event: "cleared-app-data",
    simplexed: true,
    clearedAppData: true,
    cue: "simplexed",
    note: "cleared phone app data + brand-new session; same vanish",
  },
  {
    t: "dual-network",
    event: "dual-network",
    simplexed: true,
    dualNetwork: true,
    cue: "simplexed",
    note: "restaurant wifi + carrier 5G — not #62284",
  },
  {
    t: "path",
    event: "mobile-uplink-silent",
    simplexed: true,
    mobileUplinkSilent: true,
    uplinkVanish: true,
    silentSend: true,
    cue: "simplexed",
    note: "mobile-uplink-silent — write path from the handset never delivers",
  },
  {
    t: "score",
    event: "simplex",
    simplexed: true,
    mobileUplinkSilent: true,
    uplinkVanish: true,
    silentSend: true,
    downlinkOk: true,
    dualNetwork: true,
    clearedAppData: true,
    cue: "simplexed",
    note: "simplex — when the uplink stays dead the booth never stays duplex",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-duplex",
    duplex: true,
    simplexed: false,
    cue: "duplex",
    note: "positive control: both legs open; phone send reaches the CLI",
  },
  {
    t: "announce",
    event: "cue-duplex",
    duplex: true,
    cue: "duplex",
    note: "positive control: full two-way — downlink and uplink both lit",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    duplex: true,
    simplexed: false,
    mobileUplinkSilent: false,
    cue: "duplex",
  };
}

export function seedDuplex() {
  return { ...emptyTicket() };
}

export function seedSimplexed() {
  return {
    seed: SEEDED_WORD,
    duplex: false,
    simplexed: true,
    mobileUplinkSilent: true,
    uplinkVanish: true,
    silentSend: true,
    downlinkOk: true,
    dualNetwork: true,
    clearedAppData: true,
    cue: "simplexed",
    issue: FEATURED_ISSUE,
    uplink: SAMPLE_UPLINK,
    downlink: SAMPLE_DOWNLINK,
    silent: SAMPLE_SILENT,
    networks: SAMPLE_NETWORKS,
    cleared: SAMPLE_CLEARED,
    qr: SAMPLE_QR,
  };
}

export function seedSimplex() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    simplexed: true,
    mobileUplinkSilent: true,
    uplinkVanish: true,
    silentSend: true,
    downlinkOk: true,
    dualNetwork: true,
    clearedAppData: true,
    cue: "simplexed",
  };
}

export function seedMobileUplinkSilent() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    simplexed: true,
    mobileUplinkSilent: true,
    uplinkVanish: true,
    silentSend: true,
    event: "mobile-uplink-silent",
    cue: "simplexed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    duplex: true,
    cue: "duplex",
  };
}

export function seedDownlinkOk() {
  return {
    seed: "downlink-ok",
    preferSeed: true,
    downlinkOk: true,
    cue: "simplexed",
  };
}

export function seedUplinkVanish() {
  return {
    seed: "uplink-vanish",
    preferSeed: true,
    uplinkVanish: true,
    cue: "simplexed",
  };
}

export function seedSilentSend() {
  return {
    seed: "silent-send",
    preferSeed: true,
    silentSend: true,
    cue: "simplexed",
  };
}

export function seedDualNetwork() {
  return {
    seed: "dual-network",
    preferSeed: true,
    dualNetwork: true,
    cue: "simplexed",
  };
}

export function seedClearedAppData() {
  return {
    seed: "cleared-app-data",
    preferSeed: true,
    clearedAppData: true,
    cue: "simplexed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      duplex: false,
      simplexed: false,
      mobileUplinkSilent: false,
      downlinkOk: false,
      uplinkVanish: false,
      silentSend: false,
      dualNetwork: false,
      clearedAppData: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    duplex: raw.duplex === true,
    simplexed:
      raw.simplexed === true ||
      raw.event === "simplexed" ||
      raw.event === "simplex",
    mobileUplinkSilent:
      raw.mobileUplinkSilent === true || raw.event === "mobile-uplink-silent",
    downlinkOk: raw.downlinkOk === true || raw.event === "downlink-ok",
    uplinkVanish: raw.uplinkVanish === true || raw.event === "uplink-vanish",
    silentSend: raw.silentSend === true || raw.event === "silent-send",
    dualNetwork: raw.dualNetwork === true || raw.event === "dual-network",
    clearedAppData: raw.clearedAppData === true || raw.event === "cleared-app-data",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    uplink: raw.uplink,
    downlink: raw.downlink,
    silent: raw.silent,
    networks: raw.networks,
    cleared: raw.cleared,
    qr: raw.qr,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.duplex != null ||
        ticket.simplexed != null ||
        ticket.mobileUplinkSilent != null ||
        ticket.uplinkVanish != null ||
        ticket.silentSend != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.uplink ||
        ticket.silent ||
        ticket.networks),
  );
}

function isDuplex(row) {
  if (row.simplexed && row.cue !== "duplex") return false;
  if (
    row.cue === "simplexed" ||
    row.cue === "simplex" ||
    row.cue === "mobile-uplink-silent"
  ) {
    return false;
  }
  if (
    row.mobileUplinkSilent &&
    row.uplinkVanish &&
    row.cue !== "duplex" &&
    row.duplex !== true
  ) {
    return false;
  }
  if (
    row.mobileUplinkSilent &&
    row.silentSend &&
    row.cue !== "duplex" &&
    row.duplex !== true
  ) {
    return false;
  }
  if (row.duplex === true && row.simplexed !== true && row.cue !== "simplexed") {
    return true;
  }
  if (
    row.cue === "duplex" &&
    row.simplexed !== true &&
    row.mobileUplinkSilent !== true &&
    row.uplinkVanish !== true &&
    row.silentSend !== true
  ) {
    return true;
  }
  return false;
}

function isMobileUplinkSilentPath(row) {
  return (
    row.event === "mobile-uplink-silent" &&
    !isDuplex(row) &&
    (row.mobileUplinkSilent === true ||
      row.uplinkVanish === true ||
      row.silentSend === true)
  );
}

function isSimplexed(row) {
  if (isDuplex(row)) return false;
  if (isMobileUplinkSilentPath(row) && row.cue !== "simplexed") return false;
  if (row.cue === "simplexed" || row.cue === "simplex") return true;
  if (row.simplexed === true) return true;
  if (
    row.mobileUplinkSilent === true &&
    row.uplinkVanish === true &&
    row.silentSend === true
  ) {
    return true;
  }
  if (row.mobileUplinkSilent === true && row.uplinkVanish === true) {
    return true;
  }
  if (
    row.uplinkVanish === true ||
    row.silentSend === true ||
    row.downlinkOk === true ||
    row.dualNetwork === true ||
    row.clearedAppData === true ||
    (row.mobileUplinkSilent === true && row.silentSend === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one simplex pass against the radio chassis.
 * duplex: both legs open; phone send reaches the CLI.
 * simplexed / simplex: mobile uplink permanently dead while downlink still streams.
 * mobile-uplink-silent: write path from the handset never delivers.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMobileUplinkSilentPath(row) ||
    (row.mobileUplinkSilent && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mobile-uplink-silent";
  } else if (isSimplexed(row)) {
    verdict = "simplex";
  } else if (isDuplex(row)) {
    verdict = "duplex";
  } else if (
    row.mobileUplinkSilent ||
    row.uplinkVanish ||
    row.silentSend ||
    (row.dualNetwork && !row.duplex)
  ) {
    verdict = "simplex";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const downlink = inspectDownlink(row);
  const uplink = inspectUplink(row);
  const silent = inspectSilentSend(row);
  const networks = inspectDualNetwork(row);
  const cleared = inspectClearedAppData(row);
  const qr = inspectQr(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    duplex: verdict === "duplex" || verdict === "hold",
    simplexed:
      verdict === "simplexed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    mobileUplinkSilent:
      row.mobileUplinkSilent === true ||
      verdict === "mobile-uplink-silent" ||
      verdict === PATH_WORD,
    downlinkOk: row.downlinkOk,
    uplinkVanish: row.uplinkVanish,
    silentSend: row.silentSend,
    dualNetwork: row.dualNetwork,
    clearedAppData: row.clearedAppData,
    cue: hold
      ? "duplex"
      : row.mobileUplinkSilent || verdict === "mobile-uplink-silent"
        ? "mobile-uplink-silent"
        : "simplexed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit duplex" : "score simplex",
    downlinkInspect: downlink,
    uplinkInspect: uplink,
    silentInspect: silent,
    networkInspect: networks,
    clearedInspect: cleared,
    qrInspect: qr,
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
      : SIMPLEX_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "simplex" || row.verdict === "simplexed",
  );
  const path = scored.filter((row) => row.verdict === "mobile-uplink-silent");
  const duplex = scored.filter((row) => row.verdict === "duplex");
  const headline =
    scored.find((row) => row.event === "simplexed") ||
    scored.find((row) => row.event === "mobile-uplink-silent") ||
    scored.find((row) => row.event === "uplink-vanish") ||
    dead[dead.length - 1];
  let verdict = "duplex";
  if (dead.length) verdict = "simplex";
  else if (path.length && !duplex.length) verdict = "mobile-uplink-silent";
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
    simplexedCount: dead.length,
    pathCount: path.length,
    duplexCount: duplex.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit duplex" : "score simplex",
    note: headline
      ? "Mobile uplink silent on 2.1.236; downlink still streams; dual-network rules out #62284."
      : "published simplex walk scored against duplex vs simplexed",
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
    seeded !== "duplex" &&
    seeded !== "simplexed" &&
    seeded !== "mobile-uplink-silent" &&
    seeded !== "simplex" &&
    ticket.duplex == null &&
    ticket.simplexed == null &&
    ticket.mobileUplinkSilent == null &&
    ticket.uplinkVanish == null &&
    ticket.silentSend == null &&
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
    duplex: scored.duplex ?? false,
    simplexed: scored.simplexed ?? false,
    mobileUplinkSilent: scored.mobileUplinkSilent ?? false,
    downlinkOk: scored.downlinkOk ?? false,
    uplinkVanish: scored.uplinkVanish ?? false,
    silentSend: scored.silentSend ?? false,
    dualNetwork: scored.dualNetwork ?? false,
    clearedAppData: scored.clearedAppData ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.duplex && !result.simplexed ? "rx=lit" : "rx=lit",
    result.mobileUplinkSilent || result.simplexed ? "tx=simplexed" : "tx=duplex",
    result.downlinkOk || result.simplexed ? "down=ok" : "down=idle",
    result.silentSend || result.simplexed ? "fail=silent" : "fail=acked",
    result.mobileUplinkSilent || result.verdict === "mobile-uplink-silent"
      ? "path=mobile-uplink-silent"
      : "path=duplex",
    result.cue === "duplex"
      ? "cue=duplex"
      : result.cue === "mobile-uplink-silent"
        ? "cue=mobile-uplink-silent"
        : "cue=simplexed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    duplex: result.duplex,
    simplexed: result.simplexed,
    mobileUplinkSilent: result.mobileUplinkSilent,
    uplinkVanish: result.uplinkVanish,
    silentSend: result.silentSend,
    downlinkOk: result.downlinkOk,
    dualNetwork: result.dualNetwork,
    clearedAppData: result.clearedAppData,
    uplink: input && input.uplink,
    downlink: input && input.downlink,
    silent: input && input.silent,
    networks: input && input.networks,
    cleared: input && input.cleared,
    qr: input && input.qr,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    downlink: inspectDownlink({
      duplex: result.duplex,
      simplexed: result.simplexed,
      downlinkOk: result.downlinkOk,
      downlink: input && input.downlink,
    }),
    uplink: inspectUplink({
      duplex: result.duplex,
      simplexed: result.simplexed,
      uplinkVanish: result.uplinkVanish,
      uplink: input && input.uplink,
    }),
    silent: inspectSilentSend({
      duplex: result.duplex,
      simplexed: result.simplexed,
      silentSend: result.silentSend,
      silent: input && input.silent,
    }),
    networks: inspectDualNetwork({
      duplex: result.duplex,
      simplexed: result.simplexed,
      dualNetwork: result.dualNetwork,
      networks: input && input.networks,
    }),
    cleared: inspectClearedAppData({
      duplex: result.duplex,
      simplexed: result.simplexed,
      clearedAppData: result.clearedAppData,
      cleared: input && input.cleared,
    }),
    qr: inspectQr({
      qr: input && input.qr,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      simplexed:
        result.simplexed === true ||
        result.verdict === "simplexed" ||
        result.verdict === "simplex",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      installPath: INSTALL_PATH,
      command: COMMAND,
      strips: RADIO_STRIPS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: uplink/write path from the mobile web session drops or never delivers while the downlink/read path still streams; silent fail (no error UI). Invite verify against #93801 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
