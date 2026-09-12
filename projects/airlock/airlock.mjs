#!/usr/bin/env node
/**
 * Airlock — submarine / spacecraft pressure-lock booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code 2.1.269 (native binary, latest); WSL2, NixOS 26.05,
 * kernel 6.18.40.1-microsoft-standard-WSL2; bubblewrap + socat from
 * nixpkgs. In the Linux/WSL2 Bash sandbox a command whose first
 * action is a network call fails with connection refused on the
 * proxy bridge. Later calls in the same command succeed. Cause: the
 * two socat bridges (TCP-LISTEN:3128 HTTP + TCP-LISTEN:1080 SOCKS)
 * start in the background and the user command runs at once, with
 * no wait for the listeners. Measured: inner shell ready ~3 ms;
 * port 3128 accepts ~15–30 ms later. Same symptom as closed-stale
 * #62743 — cite only, do not treat as the product.
 *
 *   node airlock.mjs data/blown.json
 *   echo '{"seed":"blown"}' | node airlock.mjs
 *
 * Idle word is equalized (HOLD: bridges listening before command;
 * hatch sealed until pressure equalizes).
 * Seeded word is blown (#93862 — first call races the bind).
 * Path word is socat-race.
 * Product score word is airlock (Score airlock or admit equalized.).
 *
 * Encoded from anthropics/claude-code#93862 issue text only.
 * Hypothesis (NON-BINDING): the bwrap sandbox script backgrounds
 * both socat listeners and immediately execs the user command, so
 * the first git/curl probe hits localhost:3128 / :1080 before
 * bind. Confirming the exact script in the 2.1.269 binary is the
 * issue's own reconstruction — offered as published evidence, not
 * a source-root-cause claim beyond that text. Verify against
 * #93862 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "equalized",
  "blown",
  "airlock",
  "socat-race",
  "hold",
  "bridges-ready",
  "listeners-bound",
  "hatch-sealed",
  "first-call-refused",
  "later-call-ok",
  "no-wait-bind",
  "listen-latency",
  "bridge-http",
  "bridge-socks",
  "inner-shell-ready",
  "pressure-delta",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "equalized";
export const PATH_WORD = "socat-race";
export const SEEDED_WORD = "blown";
export const PRODUCT_WORD = "airlock";
export const HOLD = Object.freeze(["equalized", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "equalized",
  "bridges-ready",
  "listeners-bound",
  "hatch-sealed",
]);
export const RECOVER = Object.freeze(["equalized", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "unreaped-ampersand",
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "blown" && name !== "airlock"),
);

export const FEATURED_ISSUE = 93862;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93862";
export const TITLE =
  "Linux/WSL2 sandbox: socat proxy bridge starts in the background, so the first network call in a command fails";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "platform:wsl",
  "area:sandbox",
]);
export const PLATFORM = "linux-wsl2";
export const CLAUDE_VERSION = "Claude Code 2.1.269";
export const GOOD_VERSION =
  "sandbox waits for HTTP:3128 and SOCKS:1080 listen sockets before the user command; first git/curl probe succeeds";
export const SURFACE = "bash-sandbox-socat";
export const HOST = "wsl2-nixos";
export const INSTALL_PATH = "bwrap sandbox script (2.1.269 binary)";
export const COMMAND =
  "git ls-remote https://github.com/<owner>/<repo>.git HEAD";
export const PHRASE = "Score airlock or admit equalized.";
export const HTTP_PORT = 3128;
export const SOCKS_PORT = 1080;
export const SHELL_READY_MS = 3;
export const LISTEN_MIN_MS = 15;
export const LISTEN_MAX_MS = 30;
export const PROBE_FAILS = 4;
export const DISTRIBUTION =
  "Claude Code 2.1.269 (native binary, latest channel); WSL2, NixOS 26.05, kernel 6.18.40.1-microsoft-standard-WSL2; bubblewrap and socat from nixpkgs. sandbox: { enabled: true, autoAllowBashIfSandboxed: true, allowUnsandboxedCommands: true, failIfUnavailable: true }, no network block. The bwrap command runs the shell with two background socat bridges — TCP-LISTEN:3128 HTTP to /tmp/claude-http-<hex>.sock and TCP-LISTEN:1080 SOCKS to /tmp/claude-socks-<hex>.sock — then a trap and the user command with no wait for listen sockets. Measured inside the sandbox with a /dev/tcp poll loop: port 3128 accepts 15–30 ms after the inner shell starts; the inner shell is ready in about 3 ms. Any immediate network call loses the race. 4 of 4 probes failed. ss -ltn as the first action shows no listener on 3128; the same command 100 ms later shows 0.0.0.0:3128 and 0.0.0.0:1080. Same symptom as closed-stale #62743 — this report adds the mechanism, measurements, and a suggested wait-for-bind. Related .gitmodules mask is a separate bind-mount cosmetic, not this booth.";
export const RULED_OUT = Object.freeze([
  "A missing sandbox network allow — sandbox is enabled with autoAllowBashIfSandboxed; later calls in the same command succeed once the listeners bind",
  "#62743 — same first-call connection-refused symptom, closed as stale; this booth is the 2.1.269 mechanism + measurements, not a re-ship of that ticket",
  "A permanent proxy outage — later git/curl probes in the same command succeed after ~15–30 ms",
  "A DNS or GitHub outage — the refuse is to localhost:3128 / the local HTTP proxy, after 0 ms",
  "The .gitmodules /dev/null bind-mount EACCES — related sandbox mask, different failure (libgit2 / cosmetic git warning), not the first-call race",
]);
export const EXPECTED = Object.freeze([
  "The sandbox should wait for the HTTP and SOCKS listeners to bind before running the user command",
  "A first-action git ls-remote or curl should succeed against the local proxy",
  "ss -ltn as the first action should already show 0.0.0.0:3128 and 0.0.0.0:1080",
  "A bounded /dev/tcp poll (or socat readiness signal) should close the 15–30 ms race",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "http-bridge", label: "HTTP:3128", count: "background", note: "socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:/tmp/claude-http-<hex>.sock started with &" },
  { id: "socks-bridge", label: "SOCKS:1080", count: "background", note: "socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:/tmp/claude-socks-<hex>.sock started with &" },
  { id: "no-wait", label: "no wait", count: "0 ms", note: "script runs <seccomp-apply> <shell> -c '<user command>' with no listen-socket poll" },
  { id: "race", label: "first call", count: "3 vs 15–30", note: "inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later — first git/curl is connection-refused" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "equalized-gate",
    survey: "bridges listening before command; hatch sealed until pressure equalizes",
    kind: "equalized",
    note: "idle: the outer hatch does not open until HTTP:3128 and SOCKS:1080 are bound — the hold/good path",
  },
  {
    id: "no-wait-bind",
    survey: "both socat bridges started in the background; user command runs at once",
    kind: "blown",
    note: "seeded: the script never polls /dev/tcp before exec",
  },
  {
    id: "listen-latency",
    survey: "inner shell ready ~3 ms; listeners accept ~15–30 ms later",
    kind: "blown",
    note: "seeded: the measured pressure delta that blows the lock",
  },
  {
    id: "first-call-refused",
    survey: "first git/curl probe fails connection-refused to localhost:3128",
    kind: "blown",
    note: "seeded: 4 of 4 first-action probes fail after 0 ms",
  },
  {
    id: "socat-race",
    survey: "later calls in the same command succeed once 0.0.0.0:3128 and :1080 exist",
    kind: "blown",
    note: "path: socat-race names the hatch opening before the chamber equalizes",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "socat-race",
  "blown",
  "no-wait-bind",
  "first-call-refused",
  "listen-latency",
]);

export const COUSINS = Object.freeze([
  {
    issue: 62743,
    title: "Linux/WSL2 sandbox: first network call in a command fails (stale)",
    state: "CLOSED",
    citeOnly: true,
    why: "cite only — same first-call connection-refused symptom, closed as stale; this booth is the 2.1.269 mechanism + measurements — do not treat as the product, do not re-ship",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93744, title: "backup #93744 (/goal Stop evaluator blind)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93859, title: "backup #93859 (desktop session fork)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93863, title: "backup #93863 (getcwd EPERM)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93889, title: "backup #93889 (orphan bash)", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "scotoma",
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "pontoon",
  "outrider",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "scapegoat",
  "sourdine",
  "sostenuto",
  "aphonia",
  "tabula",
  "rescript",
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
]);

export const SAMPLE_SOCAT_SCRIPT = Object.freeze({
  lines: [
    "socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:/tmp/claude-http-<hex>.sock >/dev/null 2>&1 &",
    "socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:/tmp/claude-socks-<hex>.sock >/dev/null 2>&1 &",
    'trap "kill %1 %2 2>/dev/null; exit" EXIT',
    "<seccomp-apply> <shell> -c '<user command>'",
  ],
  waitsForBind: false,
  background: true,
});

export const SAMPLE_EQUALIZED_LOCK = Object.freeze({
  httpListening: true,
  socksListening: true,
  waitsForBind: true,
  firstCallOk: true,
  laterCallOk: true,
  shellReadyMs: SHELL_READY_MS,
  listenMs: SHELL_READY_MS,
  version: GOOD_VERSION,
});

export const SAMPLE_BLOWN_LOCK = Object.freeze({
  httpListening: false,
  socksListening: false,
  waitsForBind: false,
  firstCallOk: false,
  laterCallOk: true,
  shellReadyMs: SHELL_READY_MS,
  listenMs: 22,
  version: CLAUDE_VERSION,
});

export const SAMPLE_HTTP_BRIDGE = Object.freeze({
  port: HTTP_PORT,
  proto: "HTTP",
  listen: "TCP-LISTEN:3128,fork,reuseaddr",
  unix: "/tmp/claude-http-<hex>.sock",
  background: true,
  boundAtT0: false,
});

export const SAMPLE_SOCKS_BRIDGE = Object.freeze({
  port: SOCKS_PORT,
  proto: "SOCKS",
  listen: "TCP-LISTEN:1080,fork,reuseaddr",
  unix: "/tmp/claude-socks-<hex>.sock",
  background: true,
  boundAtT0: false,
});

export const SAMPLE_READY_BRIDGES = Object.freeze({
  http: { ...SAMPLE_HTTP_BRIDGE, boundAtT0: true, background: false },
  socks: { ...SAMPLE_SOCKS_BRIDGE, boundAtT0: true, background: false },
  waitsForBind: true,
});

export const SAMPLE_NO_WAIT = Object.freeze({
  waitsForBind: false,
  poll: null,
  readinessSignal: false,
  commandStartsAt: "immediately",
});

export const SAMPLE_WAIT_BIND = Object.freeze({
  waitsForBind: true,
  poll: "for _ in $(seq 1 50); do (exec 3<>/dev/tcp/127.0.0.1/3128) 2>/dev/null && break; sleep 0.01; done",
  readinessSignal: true,
  commandStartsAt: "after-listen",
});

export const SAMPLE_FIRST_CALL_REFUSED = Object.freeze({
  command: COMMAND,
  curl: "curl -sS -o /dev/null -w '%{http_code}' https://github.com",
  error:
    "curl: (7) Failed to connect to localhost:3128 after 0 ms: Could not connect to server",
  gitError:
    "fatal: unable to access 'https://github.com/<owner>/<repo>.git/': Failed to connect to github.com:443 over proxy localhost after 0 ms: Could not connect to server",
  refused: true,
  afterMs: 0,
  probesFailed: PROBE_FAILS,
});

export const SAMPLE_FIRST_CALL_OK = Object.freeze({
  command: COMMAND,
  refused: false,
  afterMs: 0,
  probesFailed: 0,
});

export const SAMPLE_LATER_CALL_OK = Object.freeze({
  afterMs: 100,
  ss: "0.0.0.0:3128  0.0.0.0:1080",
  refused: false,
  sameCommand: true,
});

export const SAMPLE_LISTEN_LATENCY = Object.freeze({
  shellReadyMs: SHELL_READY_MS,
  listenMinMs: LISTEN_MIN_MS,
  listenMaxMs: LISTEN_MAX_MS,
  listenMs: 22,
  race: true,
});

export const SAMPLE_EQUALIZED_LATENCY = Object.freeze({
  shellReadyMs: SHELL_READY_MS,
  listenMinMs: 0,
  listenMaxMs: 0,
  listenMs: SHELL_READY_MS,
  race: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds equalized: bridges listening before command; hatch sealed until pressure equalizes" },
  { t: "no-wait-bind", line: "socat TCP-LISTEN:3128 and TCP-LISTEN:1080 started in the background; no /dev/tcp poll" },
  { t: "listen-latency", line: "inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later" },
  { t: "first-call-refused", line: "git ls-remote / curl fail connection-refused to localhost:3128 after 0 ms" },
  { t: "path", line: "socat-race — later calls in the same command succeed once 0.0.0.0:3128 and :1080 exist" },
  { t: "score", line: "when the outer hatch opens before the chamber equalizes the booth is airlock — Score airlock or admit equalized." },
]);

/**
 * Pressure map: hull vs chamber vs listener bind.
 * Idle/equalized: listeners bound at t=0; first call ok.
 * Seeded/blown: shell ready at 3 ms, bind at 15–30 ms; first call refused.
 */
export function mapPressure(input = {}) {
  const equalized = input.equalized === true && input.blown !== true;
  const listenMs = equalized
    ? Number(input.listenMs ?? SHELL_READY_MS)
    : Number(input.listenMs ?? 22);
  const shellMs = Number(input.shellReadyMs ?? SHELL_READY_MS);
  const raced = !equalized && listenMs > shellMs;
  return {
    hullPsi: equalized ? 14.7 : 14.7,
    chamberPsi: equalized ? 14.7 : 9.2,
    delta: equalized ? 0 : Number((14.7 - 9.2).toFixed(1)),
    shellReadyMs: shellMs,
    listenMs,
    httpBound: equalized,
    socksBound: equalized,
    hatch: raced ? "blown" : "sealed",
    stamp: raced ? "socat-race" : "hatch-sealed",
    note: raced
      ? "outer hatch opened before HTTP:3128 / SOCKS:1080 bound — pressure not equalized"
      : "listeners bound; chamber equalized; hatch may open",
  };
}

export function inspectBridges(input = {}) {
  const bridges =
    input.bridges && typeof input.bridges === "object"
      ? input.bridges
      : input.equalized === true && input.blown !== true
        ? SAMPLE_READY_BRIDGES
        : { http: SAMPLE_HTTP_BRIDGE, socks: SAMPLE_SOCKS_BRIDGE, waitsForBind: false };
  const forced =
    input.bridgeHttp === true ||
    input.bridgeSocks === true ||
    input.event === "bridge-http" ||
    input.event === "bridge-socks" ||
    input.event === "blown" ||
    input.event === "airlock" ||
    input.blown === true;
  const background = forced
    ? true
    : (bridges.http?.boundAtT0 === false || bridges.waitsForBind === false) &&
      input.equalized !== true;
  return {
    httpPort: HTTP_PORT,
    socksPort: SOCKS_PORT,
    httpBoundAtT0: !background,
    socksBoundAtT0: !background,
    background,
    stamp: background ? "bridge-http" : "bridges-ready",
    note: background
      ? "HTTP:3128 and SOCKS:1080 started with &; not bound when the command starts"
      : "both listeners bound before the user command",
  };
}

export function inspectBindWait(input = {}) {
  const wait =
    input.wait && typeof input.wait === "object"
      ? input.wait
      : input.equalized === true && input.blown !== true
        ? SAMPLE_WAIT_BIND
        : SAMPLE_NO_WAIT;
  const forced =
    input.noWaitBind === true ||
    input.event === "no-wait-bind" ||
    input.event === "blown" ||
    input.event === "airlock" ||
    input.blown === true;
  const none = forced ? true : wait.waitsForBind !== true && input.equalized !== true;
  return {
    waitsForBind: !none,
    poll: none ? null : wait.poll || SAMPLE_WAIT_BIND.poll,
    stamp: none ? "no-wait-bind" : "listeners-bound",
    note: none
      ? "script runs the user command with no listen-socket poll"
      : "bounded /dev/tcp poll (or socat readiness) holds the hatch",
  };
}

export function inspectFirstCall(input = {}) {
  const call =
    input.firstCall && typeof input.firstCall === "object"
      ? input.firstCall
      : input.equalized === true && input.blown !== true
        ? SAMPLE_FIRST_CALL_OK
        : SAMPLE_FIRST_CALL_REFUSED;
  const forced =
    input.firstCallRefused === true ||
    input.event === "first-call-refused" ||
    input.event === "blown" ||
    input.event === "airlock" ||
    input.blown === true;
  const refused = forced ? true : call.refused === true && input.equalized !== true;
  return {
    refused,
    afterMs: refused ? 0 : call.afterMs ?? 0,
    probesFailed: refused ? PROBE_FAILS : 0,
    error: refused ? SAMPLE_FIRST_CALL_REFUSED.error : null,
    stamp: refused ? "first-call-refused" : "first-call-ok",
    note: refused
      ? "first git/curl fails connection-refused to localhost:3128 after 0 ms"
      : "first network call succeeds against the local proxy",
  };
}

export function inspectLaterCall(input = {}) {
  const later =
    input.laterCall && typeof input.laterCall === "object"
      ? input.laterCall
      : SAMPLE_LATER_CALL_OK;
  const forced =
    input.laterCallOk === true ||
    input.event === "later-call-ok" ||
    input.event === "blown" ||
    input.event === "airlock" ||
    input.blown === true;
  const ok = forced || later.refused === false || input.equalized === true;
  return {
    ok,
    afterMs: later.afterMs || 100,
    ss: later.ss || SAMPLE_LATER_CALL_OK.ss,
    stamp: ok ? "later-call-ok" : "later-call-fail",
    note: ok
      ? "later calls in the same command succeed once 0.0.0.0:3128 and :1080 exist"
      : "later call also failed — not the published race (would be a permanent outage)",
  };
}

export function inspectLatency(input = {}) {
  const lat =
    input.latency && typeof input.latency === "object"
      ? input.latency
      : input.equalized === true && input.blown !== true
        ? SAMPLE_EQUALIZED_LATENCY
        : SAMPLE_LISTEN_LATENCY;
  const forced =
    input.listenLatency === true ||
    input.innerShellReady === true ||
    input.event === "listen-latency" ||
    input.event === "inner-shell-ready" ||
    input.event === "blown" ||
    input.event === "airlock" ||
    input.blown === true;
  const race = forced ? true : lat.race === true && input.equalized !== true;
  return {
    shellReadyMs: SHELL_READY_MS,
    listenMinMs: race ? LISTEN_MIN_MS : 0,
    listenMaxMs: race ? LISTEN_MAX_MS : 0,
    listenMs: race ? lat.listenMs || 22 : SHELL_READY_MS,
    race,
    stamp: race ? "listen-latency" : "equalized-latency",
    note: race
      ? "inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later"
      : "listen completes at or before the inner shell — no race",
  };
}

export function readBooth(input = {}) {
  const bridges = inspectBridges(input);
  const wait = inspectBindWait(input);
  const first = inspectFirstCall(input);
  const later = inspectLaterCall(input);
  const latency = inspectLatency(input);
  const blown =
    input.equalized !== true &&
    ((wait.waitsForBind === false && first.refused === true) ||
      input.blown === true);
  const equalized =
    input.equalized === true && blown !== true && wait.waitsForBind === true;
  const path =
    (input.event === "socat-race" || input.socatRace === true) &&
    (wait.waitsForBind === false || input.blown === true);
  return {
    bridges,
    wait,
    first,
    later,
    latency,
    pressure: mapPressure(input),
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    blown: blown && !equalized && !path,
    equalized:
      equalized ||
      (!blown &&
        !path &&
        input.blown !== true &&
        input.socatRace !== true &&
        wait.waitsForBind !== false),
    socatRace: path && !equalized,
    mark:
      path && !equalized
        ? "socat-race"
        : blown && !equalized
          ? "blown"
          : "equalized",
  };
}

/**
 * Published airlock walk from #93862 only. Facts from the issue text.
 * An equalized booth waits for listeners before the command.
 * A blown booth backgrounds socat and races the first call.
 * A socat-race booth names that path.
 */
export const AIRLOCK_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-equalized",
    equalized: true,
    blown: false,
    cue: "equalized",
    note: "idle HOLD: bridges listening before command; hatch sealed until pressure equalizes — the hold/good path",
  },
  {
    t: "no-wait-bind",
    event: "no-wait-bind",
    blown: true,
    noWaitBind: true,
    cue: "blown",
    note: "both socat bridges started in the background; user command runs at once",
  },
  {
    t: "listen-latency",
    event: "listen-latency",
    blown: true,
    listenLatency: true,
    cue: "blown",
    note: "inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later",
  },
  {
    t: "first-call-refused",
    event: "first-call-refused",
    blown: true,
    firstCallRefused: true,
    cue: "blown",
    note: "first git/curl probe fails connection-refused to localhost:3128",
  },
  {
    t: "path",
    event: "socat-race",
    blown: true,
    socatRace: true,
    noWaitBind: true,
    firstCallRefused: true,
    cue: "blown",
    note: "socat-race — later calls in the same command succeed once the listeners exist",
  },
  {
    t: "score",
    event: "airlock",
    blown: true,
    socatRace: true,
    noWaitBind: true,
    firstCallRefused: true,
    listenLatency: true,
    laterCallOk: true,
    cue: "blown",
    note: "airlock — when the outer hatch opens before the chamber equalizes the first call is blown",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-equalized",
    equalized: true,
    blown: false,
    cue: "equalized",
    note: "positive control: listeners bound before the user command; first call ok",
  },
  {
    t: "announce",
    event: "cue-equalized",
    equalized: true,
    cue: "equalized",
    note: "positive control: the lock stays equalized",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    equalized: true,
    blown: false,
    socatRace: false,
    cue: "equalized",
  };
}

export function seedEqualized() {
  return { ...emptyTicket() };
}

export function seedBlown() {
  return {
    seed: SEEDED_WORD,
    equalized: false,
    blown: true,
    socatRace: true,
    noWaitBind: true,
    firstCallRefused: true,
    laterCallOk: true,
    listenLatency: true,
    bridgeHttp: true,
    bridgeSocks: true,
    innerShellReady: true,
    pressureDelta: true,
    equalizedSurface: false,
    cue: "blown",
    issue: FEATURED_ISSUE,
    bridges: { http: SAMPLE_HTTP_BRIDGE, socks: SAMPLE_SOCKS_BRIDGE, waitsForBind: false },
    wait: SAMPLE_NO_WAIT,
    firstCall: SAMPLE_FIRST_CALL_REFUSED,
    laterCall: SAMPLE_LATER_CALL_OK,
    latency: SAMPLE_LISTEN_LATENCY,
  };
}

export function seedAirlock() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    blown: true,
    socatRace: true,
    noWaitBind: true,
    firstCallRefused: true,
    cue: "blown",
  };
}

export function seedSocatRace() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    blown: true,
    socatRace: true,
    noWaitBind: true,
    firstCallRefused: true,
    event: "socat-race",
    cue: "blown",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    equalized: true,
    cue: "equalized",
  };
}

export function seedNoWaitBind() {
  return {
    seed: "no-wait-bind",
    preferSeed: true,
    noWaitBind: true,
    cue: "blown",
  };
}

export function seedFirstCallRefused() {
  return {
    seed: "first-call-refused",
    preferSeed: true,
    firstCallRefused: true,
    cue: "blown",
  };
}

export function seedLaterCallOk() {
  return {
    seed: "later-call-ok",
    preferSeed: true,
    laterCallOk: true,
    cue: "blown",
  };
}

export function seedListenLatency() {
  return {
    seed: "listen-latency",
    preferSeed: true,
    listenLatency: true,
    cue: "blown",
  };
}

export function seedBridgeHttp() {
  return {
    seed: "bridge-http",
    preferSeed: true,
    bridgeHttp: true,
    cue: "blown",
  };
}

export function seedBridgeSocks() {
  return {
    seed: "bridge-socks",
    preferSeed: true,
    bridgeSocks: true,
    cue: "blown",
  };
}

export function seedInnerShellReady() {
  return {
    seed: "inner-shell-ready",
    preferSeed: true,
    innerShellReady: true,
    cue: "blown",
  };
}

export function seedPressureDelta() {
  return {
    seed: "pressure-delta",
    preferSeed: true,
    pressureDelta: true,
    cue: "blown",
  };
}

export function seedBridgesReady() {
  return {
    seed: "bridges-ready",
    preferSeed: true,
    equalized: true,
    cue: "equalized",
  };
}

export function seedListenersBound() {
  return {
    seed: "listeners-bound",
    preferSeed: true,
    equalized: true,
    cue: "equalized",
  };
}

export function seedHatchSealed() {
  return {
    seed: "hatch-sealed",
    preferSeed: true,
    equalized: true,
    cue: "equalized",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      equalized: false,
      blown: false,
      socatRace: false,
      noWaitBind: false,
      firstCallRefused: false,
      laterCallOk: false,
      listenLatency: false,
      bridgeHttp: false,
      bridgeSocks: false,
      innerShellReady: false,
      pressureDelta: false,
      equalizedSurface: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    equalized: raw.equalized === true,
    blown: raw.blown === true || raw.event === "blown" || raw.event === "airlock",
    socatRace: raw.socatRace === true || raw.event === "socat-race",
    noWaitBind: raw.noWaitBind === true || raw.event === "no-wait-bind",
    firstCallRefused:
      raw.firstCallRefused === true || raw.event === "first-call-refused",
    laterCallOk: raw.laterCallOk === true || raw.event === "later-call-ok",
    listenLatency: raw.listenLatency === true || raw.event === "listen-latency",
    bridgeHttp: raw.bridgeHttp === true || raw.event === "bridge-http",
    bridgeSocks: raw.bridgeSocks === true || raw.event === "bridge-socks",
    innerShellReady:
      raw.innerShellReady === true || raw.event === "inner-shell-ready",
    pressureDelta: raw.pressureDelta === true || raw.event === "pressure-delta",
    equalizedSurface:
      raw.equalizedSurface === true || raw.event === "bridges-ready",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    bridges: raw.bridges,
    wait: raw.wait,
    firstCall: raw.firstCall,
    laterCall: raw.laterCall,
    latency: raw.latency,
    lock: raw.lock,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.equalized != null ||
        ticket.blown != null ||
        ticket.socatRace != null ||
        ticket.noWaitBind != null ||
        ticket.firstCallRefused != null ||
        ticket.laterCallOk != null ||
        ticket.listenLatency != null ||
        ticket.bridgeHttp != null ||
        ticket.bridgeSocks != null ||
        ticket.innerShellReady != null ||
        ticket.pressureDelta != null ||
        ticket.equalizedSurface != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.bridges ||
        ticket.wait ||
        ticket.firstCall ||
        ticket.laterCall ||
        ticket.latency),
  );
}

function isEqualized(row) {
  if (row.blown && row.cue !== "equalized") return false;
  if (row.cue === "blown" || row.cue === "airlock" || row.cue === "socat-race") {
    return false;
  }
  if (
    row.socatRace &&
    row.noWaitBind &&
    row.cue !== "equalized" &&
    row.equalized !== true
  ) {
    return false;
  }
  if (
    row.socatRace &&
    row.firstCallRefused &&
    row.cue !== "equalized" &&
    row.equalized !== true
  ) {
    return false;
  }
  if (row.equalized === true && row.blown !== true && row.cue !== "blown") {
    return true;
  }
  if (
    row.cue === "equalized" &&
    row.blown !== true &&
    row.socatRace !== true &&
    row.noWaitBind !== true &&
    row.firstCallRefused !== true
  ) {
    return true;
  }
  return false;
}

function isSocatRacePath(row) {
  return (
    row.event === "socat-race" &&
    !isEqualized(row) &&
    (row.socatRace === true ||
      row.noWaitBind === true ||
      row.firstCallRefused === true)
  );
}

function isBlown(row) {
  if (isEqualized(row)) return false;
  if (isSocatRacePath(row) && row.cue !== "blown") return false;
  if (row.cue === "blown" || row.cue === "airlock") return true;
  if (row.blown === true) return true;
  if (
    row.socatRace === true &&
    row.noWaitBind === true &&
    row.firstCallRefused === true
  ) {
    return true;
  }
  if (row.socatRace === true && row.noWaitBind === true) {
    return true;
  }
  if (
    row.noWaitBind === true ||
    row.firstCallRefused === true ||
    row.listenLatency === true ||
    (row.socatRace === true && row.firstCallRefused === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one airlock pass against the pressure lock.
 * equalized: bridges listening before command; hatch sealed.
 * blown / airlock: first call races the bind.
 * socat-race: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSocatRacePath(row) ||
    (row.socatRace && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "socat-race";
  } else if (isBlown(row)) {
    verdict = "airlock";
  } else if (isEqualized(row)) {
    verdict = "equalized";
  } else if (
    row.socatRace ||
    row.noWaitBind ||
    row.firstCallRefused ||
    (row.listenLatency && !row.equalized)
  ) {
    verdict = "airlock";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const bridges = inspectBridges(row);
  const wait = inspectBindWait(row);
  const first = inspectFirstCall(row);
  const later = inspectLaterCall(row);
  const latency = inspectLatency(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    equalized: verdict === "equalized" || verdict === "hold",
    blown:
      verdict === "blown" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    socatRace:
      row.socatRace === true ||
      verdict === "socat-race" ||
      verdict === PATH_WORD,
    noWaitBind: row.noWaitBind,
    firstCallRefused: row.firstCallRefused,
    laterCallOk: row.laterCallOk,
    listenLatency: row.listenLatency,
    bridgeHttp: row.bridgeHttp,
    bridgeSocks: row.bridgeSocks,
    innerShellReady: row.innerShellReady,
    pressureDelta: row.pressureDelta,
    equalizedSurface: row.equalizedSurface,
    cue: hold
      ? "equalized"
      : row.socatRace || verdict === "socat-race"
        ? "socat-race"
        : "blown",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit equalized" : "score airlock",
    bridgesInspect: bridges,
    waitInspect: wait,
    firstInspect: first,
    laterInspect: later,
    latencyInspect: latency,
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
      : AIRLOCK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "airlock" || row.verdict === "blown",
  );
  const path = scored.filter((row) => row.verdict === "socat-race");
  const equalized = scored.filter((row) => row.verdict === "equalized");
  const headline =
    scored.find((row) => row.event === "blown") ||
    scored.find((row) => row.event === "socat-race") ||
    scored.find((row) => row.event === "no-wait-bind") ||
    dead[dead.length - 1];
  let verdict = "equalized";
  if (dead.length) verdict = "airlock";
  else if (path.length && !equalized.length) verdict = "socat-race";
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
    blownCount: dead.length,
    pathCount: path.length,
    equalizedCount: equalized.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit equalized" : "score airlock",
    note: headline
      ? "socat HTTP:3128 and SOCKS:1080 start in the background; no wait for bind; first git/curl is connection-refused; later calls succeed. Cousin #62743 is cite-only."
      : "published airlock walk scored against equalized vs blown",
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
    seeded !== "equalized" &&
    seeded !== "blown" &&
    seeded !== "socat-race" &&
    seeded !== "airlock" &&
    ticket.equalized == null &&
    ticket.blown == null &&
    ticket.socatRace == null &&
    ticket.noWaitBind == null &&
    ticket.firstCallRefused == null &&
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
    equalized: scored.equalized ?? false,
    blown: scored.blown ?? false,
    socatRace: scored.socatRace ?? false,
    noWaitBind: scored.noWaitBind ?? false,
    firstCallRefused: scored.firstCallRefused ?? false,
    laterCallOk: scored.laterCallOk ?? false,
    listenLatency: scored.listenLatency ?? false,
    bridgeHttp: scored.bridgeHttp ?? false,
    bridgeSocks: scored.bridgeSocks ?? false,
    innerShellReady: scored.innerShellReady ?? false,
    pressureDelta: scored.pressureDelta ?? false,
    equalizedSurface: scored.equalizedSurface ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.noWaitBind || result.blown ? "wait=none" : "wait=bound",
    result.firstCallRefused || result.blown ? "first=refused" : "first=ok",
    result.listenLatency || result.blown ? "listen=15-30ms" : "listen=ready",
    result.socatRace || result.verdict === "socat-race"
      ? "path=socat-race"
      : "path=equalized",
    result.cue === "equalized"
      ? "cue=equalized"
      : result.cue === "socat-race"
        ? "cue=socat-race"
        : "cue=blown",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    equalized: result.equalized,
    blown: result.blown,
    socatRace: result.socatRace,
    noWaitBind: result.noWaitBind,
    firstCallRefused: result.firstCallRefused,
    laterCallOk: result.laterCallOk,
    listenLatency: result.listenLatency,
    bridgeHttp: result.bridgeHttp,
    bridgeSocks: result.bridgeSocks,
    innerShellReady: result.innerShellReady,
    pressureDelta: result.pressureDelta,
    equalizedSurface: result.equalizedSurface,
    bridges: input && input.bridges,
    wait: input && input.wait,
    firstCall: input && input.firstCall,
    laterCall: input && input.laterCall,
    latency: input && input.latency,
    lock: input && input.lock,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    bridges: inspectBridges({
      equalized: result.equalized,
      blown: result.blown,
      bridgeHttp: result.bridgeHttp,
      bridgeSocks: result.bridgeSocks,
      bridges: input && input.bridges,
    }),
    wait: inspectBindWait({
      equalized: result.equalized,
      blown: result.blown,
      noWaitBind: result.noWaitBind,
      wait: input && input.wait,
    }),
    firstCall: inspectFirstCall({
      equalized: result.equalized,
      blown: result.blown,
      firstCallRefused: result.firstCallRefused,
      firstCall: input && input.firstCall,
    }),
    laterCall: inspectLaterCall({
      equalized: result.equalized,
      blown: result.blown,
      laterCallOk: result.laterCallOk,
      laterCall: input && input.laterCall,
    }),
    latency: inspectLatency({
      equalized: result.equalized,
      blown: result.blown,
      listenLatency: result.listenLatency,
      innerShellReady: result.innerShellReady,
      latency: input && input.latency,
    }),
    pressure: mapPressure({
      equalized: result.equalized,
      blown: result.blown,
      listenMs: result.listenLatency ? 22 : SHELL_READY_MS,
      shellReadyMs: SHELL_READY_MS,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      blown:
        result.blown === true ||
        result.verdict === "blown" ||
        result.verdict === "airlock",
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
      marks: FIELD_MARKS,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      script: SAMPLE_SOCAT_SCRIPT,
      hypothesis:
        "NON-BINDING: the bwrap sandbox script backgrounds both socat listeners (TCP-LISTEN:3128 HTTP and TCP-LISTEN:1080 SOCKS) and immediately execs the user command, so the first git/curl probe hits localhost before bind. Confirming the exact script in the 2.1.269 binary is the issue's own reconstruction — offered as published evidence, not a source-root-cause claim beyond that text. Invite verify against #93862 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
