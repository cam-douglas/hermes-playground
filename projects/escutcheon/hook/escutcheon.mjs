/**
 * Escutcheon — locksmith's keyhole
 * plate / door furniture desk for
 * a real Claude Code defect: on
 * Linux the sandbox mounts a
 * fresh empty tmpfs over
 * /run/user, so $XDG_RUNTIME_DIR
 * and the D-Bus session bus
 * socket vanish inside sandboxed
 * Bash. DBUS_SESSION_BUS_ADDRESS
 * stays exported and still points
 * at the now-missing path. Tools
 * that store credentials in the
 * system keyring (libsecret /
 * gnome-keyring over D-Bus)
 * fail; gh reports "The token in
 * default is invalid." and blames
 * the credential instead of the
 * sandbox. The only workaround
 * that works is
 * `gh auth login --insecure-storage`
 * (plaintext hosts.yml).
 *
 * An empty plate is not a keyhole.
 * Score the door or admit plated.
 *
 * Primary #90717: OPEN, filed
 * 2026-08-30. Title: Linux sandbox
 * replaces /run/user with an empty
 * tmpfs, so sandboxed commands
 * cannot reach the D-Bus session
 * bus or the system keyring.
 * Labels: bug / has-repro /
 * platform:linux / area:sandbox.
 * Version 2.1.236, Ubuntu 22.04.5,
 * bubblewrap 0.6.1, gh 2.96.0.
 *
 * Same-class (cite, macOS
 * counterpart):
 *   #87008 sandboxed commands
 *     can't reach the macOS
 *     keychain; tools blame the
 *     credential.
 *
 * Related (this door's inert
 * levers, not other products):
 *   #44180 allowUnixSockets not
 *     implemented on Linux.
 *   #89931 excludedCommands inert.
 *
 * Why this is not a clone:
 * NOT Slype — sandbox pwsh 126
 *     vs System32 powershell
 *     (#90676).
 * NOT Gasket — project allowlist
 *     discard (#90355).
 * NOT Clew — E2BIG deny-list
 *     (#90569).
 * NOT Fob — keychain litter
 *     (#90527).
 * NOT Chatelaine — mcpOAuth
 *     nested in Anthropic
 *     Keychain (#90647).
 * NOT Lacuna — task-store scrape.
 * NOT Ambo — unheard pulpit.
 * NOT Tally — birth-count hold.
 * Different layer: baseline empty
 * tmpfs mount mask over /run/user,
 * not path allowlist, not ARG_MAX,
 * not credential litter, not a
 * nested OAuth item.
 * Different UI: locksmith bench,
 * brushed brass escutcheon,
 * gunmetal screws, key blanks,
 * dark workshop, mount-table
 * readout, D-Bus socket ghost.
 * Different idle: plated.
 *
 * Verdicts: plated | blamed |
 *           masked | lying-address |
 *           sockets-inert |
 *           excluded-inert |
 *           still-masks |
 *           plaintext-forced |
 *           deny-breaks
 * Idle word is plated (honest
 * control: real $XDG_RUNTIME_DIR
 * bound, D-Bus socket present,
 * keyring reachable, gh valid).
 * NEVER use plated for a failure.
 */

export const VERDICTS = Object.freeze([
  "plated",
  "blamed",
  "masked",
  "lying-address",
  "sockets-inert",
  "excluded-inert",
  "still-masks",
  "plaintext-forced",
  "deny-breaks",
]);
export const IDLE_WORD = "plated";
export const ALARM_VERDICTS = Object.freeze([
  "blamed",
  "masked",
  "lying-address",
  "sockets-inert",
  "excluded-inert",
  "still-masks",
  "plaintext-forced",
  "deny-breaks",
]);
export const FEATURED_ISSUE = 90717;
export const SAME_CLASS_87008 = 87008;
export const RELATED_44180 = 44180;
export const RELATED_89931 = 89931;
export const RELATED_SLYPE = 90676;
export const RELATED_GASKET = 90355;
export const RELATED_CLEW = 90569;
export const RELATED_FOB = 90527;
export const RELATED_CHATELAINE = 90647;

export const DEMO_MOUNTINFO =
  "1174 1154 0:69 / /run/user rw,nosuid,nodev,relatime - tmpfs tmpfs rw,mode=755,uid=1000,gid=1000,inode64";
export const DEMO_DBUS = "unix:path=/run/user/1000/bus";
export const DEMO_XDG = "/run/user/1000";
export const DEMO_LS_MISS = "ls: cannot access '/run/user/1000': No such file or directory";
export const DEMO_GH_BLAME = `github.com
  X Failed to log in to github.com account  (default)
  - Active account: true
  - The token in default is invalid.`;
export const DEMO_GH_HOLD = `github.com
  ✓ Logged in to github.com account  (keyring)
  - Active account: true
  - Token scopes: 'gist', 'read:org', 'repo'`;
export const DEMO_VERSION = "2.1.236";
export const DEMO_GH_VERSION = "2.96.0";
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "escutcheon-plate";
export const DEMO_HOSTS_DENY =
  "warning: failed to load config: open /home//.config/gh/hosts.yml: permission denied";

const FORBIDDEN_IDLE = Object.freeze([
  "escutcheon",
  "keyhole",
  "keyring",
  "sandbox",
  "lacuna",
  "collated",
  "ambo",
  "unheard",
  "slype",
  "passed",
  "tally",
  "squared",
  "gasket",
  "tight",
  "clew",
  "rove",
  "fob",
  "hung",
  "chatelaine",
  "girt",
  "pale",
  "bound",
  "empty",
  "silent",
  "mute",
  "idle",
  "blamed",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    mountinfo: "",
    dbusAddress: "",
    xdgRuntimeDir: "",
    runtimeExists: null,
    busExists: null,
    ghStatus: "",
    allowUnixSockets: "",
    socketsTried: null,
    socketsHelped: null,
    excludedCommands: "",
    excludedTried: null,
    excludedHelped: null,
    dangerouslyDisableSandbox: null,
    disableHelped: null,
    insecureStorage: null,
    hostsYmlDeny: null,
    hostsYmlReadable: null,
    ghWorks: null,
    keyringReachable: null,
    version: "",
    nearby: "",
    nearbyBlamed: false,
    nearbyMasked: false,
    nearbyLyingAddress: false,
    nearbySocketsInert: false,
    nearbyExcludedInert: false,
    nearbyStillMasks: false,
    nearbyPlaintextForced: false,
    nearbyDenyBreaks: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.escutcheon && typeof src.escutcheon === "object") return src.escutcheon;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.plate && typeof src.plate === "object") return src.plate;
  return src;
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    mountinfo: asText(nested.mountinfo || src.mountinfo || ""),
    dbusAddress: asText(nested.dbusAddress || src.dbusAddress || ""),
    xdgRuntimeDir: asText(nested.xdgRuntimeDir || src.xdgRuntimeDir || ""),
    runtimeExists: asNullableBool(nested.runtimeExists ?? src.runtimeExists),
    busExists: asNullableBool(nested.busExists ?? src.busExists),
    ghStatus: asText(nested.ghStatus || src.ghStatus || ""),
    allowUnixSockets: asText(nested.allowUnixSockets || src.allowUnixSockets || ""),
    socketsTried: asNullableBool(nested.socketsTried ?? src.socketsTried),
    socketsHelped: asNullableBool(nested.socketsHelped ?? src.socketsHelped),
    excludedCommands: asText(nested.excludedCommands || src.excludedCommands || ""),
    excludedTried: asNullableBool(nested.excludedTried ?? src.excludedTried),
    excludedHelped: asNullableBool(nested.excludedHelped ?? src.excludedHelped),
    dangerouslyDisableSandbox: asNullableBool(
      nested.dangerouslyDisableSandbox ?? src.dangerouslyDisableSandbox,
    ),
    disableHelped: asNullableBool(nested.disableHelped ?? src.disableHelped),
    insecureStorage: asNullableBool(nested.insecureStorage ?? src.insecureStorage),
    hostsYmlDeny: asNullableBool(nested.hostsYmlDeny ?? src.hostsYmlDeny),
    hostsYmlReadable: asNullableBool(nested.hostsYmlReadable ?? src.hostsYmlReadable),
    ghWorks: asNullableBool(nested.ghWorks ?? src.ghWorks),
    keyringReachable: asNullableBool(nested.keyringReachable ?? src.keyringReachable),
    version: asText(nested.version || src.version || ""),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyBlamed: asBool(nested.nearbyBlamed ?? src.nearbyBlamed, false),
    nearbyMasked: asBool(nested.nearbyMasked ?? src.nearbyMasked, false),
    nearbyLyingAddress: asBool(nested.nearbyLyingAddress ?? src.nearbyLyingAddress, false),
    nearbySocketsInert: asBool(nested.nearbySocketsInert ?? src.nearbySocketsInert, false),
    nearbyExcludedInert: asBool(nested.nearbyExcludedInert ?? src.nearbyExcludedInert, false),
    nearbyStillMasks: asBool(nested.nearbyStillMasks ?? src.nearbyStillMasks, false),
    nearbyPlaintextForced: asBool(nested.nearbyPlaintextForced ?? src.nearbyPlaintextForced, false),
    nearbyDenyBreaks: asBool(nested.nearbyDenyBreaks ?? src.nearbyDenyBreaks, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

export function looksEmptyTmpfs(mountinfo) {
  const text = asText(mountinfo);
  // Mask is a tmpfs whose mount point is exactly /run/user.
  // A real $XDG_RUNTIME_DIR is also tmpfs, but at /run/user/UID.
  return / \/run\/user[\s,]/.test(text) && /tmpfs/.test(text);
}

export function looksTokenBlame(status) {
  return /token in default is invalid|token in keyring is invalid/i.test(asText(status));
}

export function looksKeyringHold(status) {
  return /logged in to github\.com account\s+\(keyring\)/i.test(asText(status));
}

export function looksDbusLie(address, runtimeExists, busExists) {
  const addr = asText(address);
  if (!addr) return false;
  const pointsAtRun = /unix:path=\/run\/user\//.test(addr);
  return pointsAtRun && (runtimeExists === false || busExists === false);
}

export function isOffEscutcheon(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "slype" ||
    nearby === "90676" ||
    nearby === "gasket" ||
    nearby === "90355" ||
    nearby === "clew" ||
    nearby === "90569" ||
    nearby === "fob" ||
    nearby === "90527" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "lacuna" ||
    nearby === "90709" ||
    nearby === "ambo" ||
    nearby === "90685" ||
    nearby === "tally" ||
    nearby === "90692"
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.mountinfo ||
    probe.dbusAddress ||
    probe.xdgRuntimeDir ||
    probe.runtimeExists != null ||
    probe.busExists != null ||
    probe.ghStatus ||
    probe.allowUnixSockets ||
    probe.socketsTried != null ||
    probe.socketsHelped != null ||
    probe.excludedCommands ||
    probe.excludedTried != null ||
    probe.excludedHelped != null ||
    probe.dangerouslyDisableSandbox != null ||
    probe.disableHelped != null ||
    probe.insecureStorage != null ||
    probe.hostsYmlDeny != null ||
    probe.hostsYmlReadable != null ||
    probe.ghWorks != null ||
    probe.keyringReachable != null ||
    probe.version ||
    probe.nearbyBlamed ||
    probe.nearbyMasked ||
    probe.nearbyLyingAddress ||
    probe.nearbySocketsInert ||
    probe.nearbyExcludedInert ||
    probe.nearbyStillMasks ||
    probe.nearbyPlaintextForced ||
    probe.nearbyDenyBreaks ||
    isOffEscutcheon(probe)
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyBlamed ||
      row.nearbyMasked ||
      row.nearbyLyingAddress ||
      row.nearbySocketsInert ||
      row.nearbyExcludedInert ||
      row.nearbyStillMasks ||
      row.nearbyPlaintextForced ||
      row.nearbyDenyBreaks ||
      isOffEscutcheon(row),
  );
}

function contrastLabel() {
  return "blamed";
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const uniqueNearby = uniqueNearbyOf(row);
  const emptyTmpfs = looksEmptyTmpfs(row.mountinfo);
  const tokenBlame = looksTokenBlame(row.ghStatus);
  const keyringHold = looksKeyringHold(row.ghStatus);
  const runtimeGone = row.runtimeExists === false;
  const busGone = row.busExists === false;
  const dbusLie = looksDbusLie(row.dbusAddress, row.runtimeExists, row.busExists);
  const triad = Boolean(
    emptyTmpfs && dbusLie && tokenBlame && !uniqueNearby,
  );
  const honest = Boolean(
    row.runtimeExists === true &&
      row.busExists === true &&
      row.keyringReachable === true &&
      (keyringHold || row.ghWorks === true) &&
      !emptyTmpfs &&
      !tokenBlame &&
      !uniqueNearby,
  );

  let eventClass = "idle";
  if (uniqueNearby && !triad) {
    if (row.nearbyDenyBreaks) eventClass = "deny-breaks";
    else if (row.nearbyPlaintextForced) eventClass = "plaintext-forced";
    else if (row.nearbyStillMasks) eventClass = "still-masks";
    else if (row.nearbyExcludedInert) eventClass = "excluded-inert";
    else if (row.nearbySocketsInert) eventClass = "sockets-inert";
    else if (row.nearbyLyingAddress) eventClass = "lying-address";
    else if (row.nearbyMasked) eventClass = "masked";
    else if (row.nearbyBlamed) eventClass = "blamed";
    else if (isOffEscutcheon(row)) eventClass = contrastLabel(row);
  } else if (triad) eventClass = "blamed";
  else if (row.hostsYmlDeny === true && row.hostsYmlReadable === false) {
    eventClass = "deny-breaks";
  } else if (row.insecureStorage === true && row.keyringReachable === false) {
    eventClass = "plaintext-forced";
  } else if (
    row.dangerouslyDisableSandbox === true &&
    emptyTmpfs &&
    row.disableHelped === false
  ) {
    eventClass = "still-masks";
  } else if (row.excludedTried === true && row.excludedHelped === false) {
    eventClass = "excluded-inert";
  } else if (row.socketsTried === true && row.socketsHelped === false) {
    eventClass = "sockets-inert";
  } else if (tokenBlame && (emptyTmpfs || runtimeGone || busGone)) {
    eventClass = "blamed";
  } else if (dbusLie) eventClass = "lying-address";
  else if (emptyTmpfs) eventClass = "masked";
  else if (honest || isIdle(row)) eventClass = "plated";
  else eventClass = "plated";

  return {
    uniqueNearby,
    emptyTmpfs,
    tokenBlame,
    keyringHold,
    runtimeGone,
    busGone,
    dbusLie,
    triad,
    honest,
    offEscutcheon: isOffEscutcheon(row),
    eventClass,
    mountinfo: row.mountinfo,
    dbusAddress: row.dbusAddress,
    xdgRuntimeDir: row.xdgRuntimeDir,
    ghStatus: row.ghStatus,
    version: row.version,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "plated";
  const facts = analyze(row);
  if (!facts.triad) {
    if (row.nearbyDenyBreaks) return "deny-breaks";
    if (row.nearbyPlaintextForced) return "plaintext-forced";
    if (row.nearbyStillMasks) return "still-masks";
    if (row.nearbyExcludedInert) return "excluded-inert";
    if (row.nearbySocketsInert) return "sockets-inert";
    if (row.nearbyLyingAddress) return "lying-address";
    if (row.nearbyMasked) return "masked";
    if (row.nearbyBlamed) return "blamed";
    if (facts.offEscutcheon) return contrastLabel(row);
  }
  if (facts.triad) return "blamed";
  if (row.hostsYmlDeny === true && row.hostsYmlReadable === false) return "deny-breaks";
  if (row.insecureStorage === true && row.keyringReachable === false) {
    return "plaintext-forced";
  }
  if (row.dangerouslyDisableSandbox === true && facts.emptyTmpfs && row.disableHelped === false) {
    return "still-masks";
  }
  if (row.excludedTried === true && row.excludedHelped === false) return "excluded-inert";
  if (row.socketsTried === true && row.socketsHelped === false) return "sockets-inert";
  if (facts.tokenBlame && (facts.emptyTmpfs || facts.runtimeGone || facts.busGone)) {
    return "blamed";
  }
  if (facts.dbusLie) return "lying-address";
  if (facts.emptyTmpfs) return "masked";
  if (facts.honest) return "plated";
  return "plated";
}

export function feedOf(kind) {
  if (kind === "blamed") {
    return "● Blamed · gh says The token in default is invalid · the credential is fine · the plate is empty · primary #90717";
  }
  if (kind === "masked") {
    return "● Masked · empty tmpfs mounted over /run/user · $XDG_RUNTIME_DIR and the D-Bus socket vanish";
  }
  if (kind === "lying-address") {
    return "● Lying-address · DBUS_SESSION_BUS_ADDRESS still points at unix:path=/run/user/1000/bus · the path is gone";
  }
  if (kind === "sockets-inert") {
    return "● Sockets-inert · sandbox.network.allowUnixSockets names the bus · Linux never implements it · #44180";
  }
  if (kind === "excluded-inert") {
    return "● Excluded-inert · sandbox.excludedCommands lists gh * · gh still runs sandboxed · #89931";
  }
  if (kind === "still-masks") {
    return "● Still-masks · dangerouslyDisableSandbox is true · the empty tmpfs over /run/user stays";
  }
  if (kind === "plaintext-forced") {
    return "● Plaintext-forced · only gh auth login --insecure-storage works · keyring traded for hosts.yml";
  }
  if (kind === "deny-breaks") {
    return "● Deny-breaks · Read(~/.config/gh/hosts.yml) in permissions.deny propagates into the sandbox and breaks gh itself";
  }
  return "● Plated · real $XDG_RUNTIME_DIR bound · D-Bus socket present · keyring reachable · idle word is plated";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "blamed" || facts.triad) {
    reasons.push(
      "#90717 Linux sandbox replaces /run/user with an empty tmpfs; gh blames the token",
    );
  }
  if (facts.emptyTmpfs) reasons.push("mountinfo shows tmpfs over /run/user");
  if (row.dbusAddress) reasons.push(`DBUS_SESSION_BUS_ADDRESS ${row.dbusAddress}`);
  if (facts.dbusLie) reasons.push("exported bus address points at a missing path");
  if (row.runtimeExists === false) reasons.push(DEMO_LS_MISS);
  if (facts.tokenBlame) reasons.push("gh: The token in default is invalid");
  if (facts.keyringHold) reasons.push("control gh talks to the keyring");
  if (row.socketsTried === true && row.socketsHelped === false) {
    reasons.push("allowUnixSockets inert on Linux (#44180) — connect() grant cannot unmask a path");
  }
  if (row.excludedTried === true && row.excludedHelped === false) {
    reasons.push("excludedCommands inert (#89931) — gh still sandboxed");
  }
  if (row.dangerouslyDisableSandbox === true && row.disableHelped === false) {
    reasons.push("dangerouslyDisableSandbox still leaves the filesystem masks");
  }
  if (row.insecureStorage === true) {
    reasons.push("gh auth login --insecure-storage writes plaintext ~/.config/gh/hosts.yml");
  }
  if (row.hostsYmlDeny === true && row.hostsYmlReadable === false) {
    reasons.push("permissions.deny Read(~/.config/gh/hosts.yml) breaks gh itself");
  }
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offEscutcheon) {
    reasons.push(
      "labeled contrast, not this defect: Slype #90676 / Gasket #90355 / Clew #90569 / Fob #90527 / Chatelaine #90647 / Lacuna / Ambo / Tally",
    );
  }
  if (kind === "plated") {
    reasons.push(
      "real runtime dir bound and keyring reachable, or the idle bench; idle word is plated",
    );
  }
  return reasons;
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offEscutcheon;
  const alarm = ALARM_VERDICTS.includes(kind) && !off;
  return {
    product: "escutcheon",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    plated: kind === "plated",
    blamed: kind === "blamed",
    masked: kind === "masked",
    "lying-address": kind === "lying-address",
    "sockets-inert": kind === "sockets-inert",
    "excluded-inert": kind === "excluded-inert",
    "still-masks": kind === "still-masks",
    "plaintext-forced": kind === "plaintext-forced",
    "deny-breaks": kind === "deny-breaks",
    alarm,
    thisBug: kind !== "plated" && !off,
    offEscutcheon: off,
    eventClass: facts.eventClass,
    facts: {
      mountinfo: facts.mountinfo,
      dbusAddress: facts.dbusAddress,
      xdgRuntimeDir: facts.xdgRuntimeDir,
      ghStatus: facts.ghStatus,
      version: facts.version,
      emptyTmpfs: facts.emptyTmpfs,
      tokenBlame: facts.tokenBlame,
      keyringHold: facts.keyringHold,
      dbusLie: facts.dbusLie,
      triad: facts.triad,
      honest: facts.honest,
      offEscutcheon: facts.offEscutcheon,
      runtimeExists: probe.runtimeExists,
      busExists: probe.busExists,
      keyringReachable: probe.keyringReachable,
      nearbyBlamed: probe.nearbyBlamed,
      nearbyMasked: probe.nearbyMasked,
      nearbyLyingAddress: probe.nearbyLyingAddress,
      nearbySocketsInert: probe.nearbySocketsInert,
      nearbyExcludedInert: probe.nearbyExcludedInert,
      nearbyStillMasks: probe.nearbyStillMasks,
      nearbyPlaintextForced: probe.nearbyPlaintextForced,
      nearbyDenyBreaks: probe.nearbyDenyBreaks,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_MARK,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  return boardResult(classify(row), row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function platedOf(probe = {}) {
  return classify(probe) === "plated";
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    escutcheon: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedPlated() {
  return baseSeed("plated-hold", FEATURED_ISSUE, {
    source: "honest control: real /run/user bound, D-Bus socket present, gh talks to the keyring",
    mountinfo: "1154 1153 0:26 / /run/user/1000 rw,nosuid,nodev,relatime - tmpfs tmpfs rw,mode=700,uid=1000,gid=1000",
    dbusAddress: DEMO_DBUS,
    xdgRuntimeDir: DEMO_XDG,
    runtimeExists: true,
    busExists: true,
    ghStatus: DEMO_GH_HOLD,
    keyringReachable: true,
    ghWorks: true,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedPlated();
}

export function seedReset() {
  return { action: "bail", escutcheon: emptyProbe() };
}

export function seedBlamed() {
  return baseSeed("90717-blamed", FEATURED_ISSUE, {
    source:
      "primary #90717 empty tmpfs over /run/user; DBUS address still exported; gh blames the token",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    xdgRuntimeDir: DEMO_XDG,
    runtimeExists: false,
    busExists: false,
    ghStatus: DEMO_GH_BLAME,
    keyringReachable: false,
    ghWorks: false,
    version: DEMO_VERSION,
  });
}

export function seed90717() {
  return seedBlamed();
}

export function seedMasked() {
  return baseSeed("90717-masked", FEATURED_ISSUE, {
    source: "empty tmpfs mounted over /run/user",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    xdgRuntimeDir: DEMO_XDG,
    runtimeExists: false,
    busExists: false,
    ghStatus: "",
    nearbyMasked: true,
    version: DEMO_VERSION,
  });
}

export function seedLyingAddress() {
  return baseSeed("90717-lying-address", FEATURED_ISSUE, {
    source: "DBUS_SESSION_BUS_ADDRESS still points at the missing bus socket",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    xdgRuntimeDir: DEMO_XDG,
    runtimeExists: false,
    busExists: false,
    nearbyLyingAddress: true,
    version: DEMO_VERSION,
  });
}

export function seedSocketsInert() {
  return baseSeed("44180-sockets-inert", RELATED_44180, {
    source: "allowUnixSockets names /run/user/1000/bus; Linux never implements it",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    runtimeExists: false,
    busExists: false,
    allowUnixSockets: "/run/user/1000/bus",
    socketsTried: true,
    socketsHelped: false,
    nearbySocketsInert: true,
    version: DEMO_VERSION,
  });
}

export function seedExcludedInert() {
  return baseSeed("89931-excluded-inert", RELATED_89931, {
    source: "excludedCommands lists gh *; gh still runs sandboxed",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    runtimeExists: false,
    busExists: false,
    excludedCommands: "gh *",
    excludedTried: true,
    excludedHelped: false,
    ghStatus: DEMO_GH_BLAME,
    nearbyExcludedInert: true,
    version: DEMO_VERSION,
  });
}

export function seedStillMasks() {
  return baseSeed("90717-still-masks", FEATURED_ISSUE, {
    source: "dangerouslyDisableSandbox true; empty tmpfs over /run/user stays",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    runtimeExists: false,
    busExists: false,
    dangerouslyDisableSandbox: true,
    disableHelped: false,
    nearbyStillMasks: true,
    version: DEMO_VERSION,
  });
}

export function seedPlaintextForced() {
  return baseSeed("90717-plaintext-forced", FEATURED_ISSUE, {
    source: "only gh auth login --insecure-storage works; keyring traded for hosts.yml",
    mountinfo: DEMO_MOUNTINFO,
    dbusAddress: DEMO_DBUS,
    runtimeExists: false,
    busExists: false,
    insecureStorage: true,
    keyringReachable: false,
    ghWorks: true,
    nearbyPlaintextForced: true,
    version: DEMO_VERSION,
  });
}

export function seedDenyBreaks() {
  return baseSeed("90717-deny-breaks", FEATURED_ISSUE, {
    source: "Read(~/.config/gh/hosts.yml) in permissions.deny breaks gh itself",
    mountinfo: DEMO_MOUNTINFO,
    insecureStorage: true,
    hostsYmlDeny: true,
    hostsYmlReadable: false,
    ghWorks: false,
    ghStatus: DEMO_HOSTS_DENY,
    nearbyDenyBreaks: true,
    version: DEMO_VERSION,
  });
}

export function seedContrastSlype() {
  return baseSeed("contrast-slype", RELATED_SLYPE, {
    source: "NOT this: #90676 sandbox pwsh 126 vs System32 powershell",
    nearby: "slype",
    version: DEMO_VERSION,
  });
}

const SEEDS = {
  plated: seedPlated,
  control: seedPlated,
  healthy: seedPlated,
  hold: seedPlated,
  blamed: seedBlamed,
  90717: seedBlamed,
  "90717": seedBlamed,
  masked: seedMasked,
  "lying-address": seedLyingAddress,
  lyingaddress: seedLyingAddress,
  "sockets-inert": seedSocketsInert,
  socketsinert: seedSocketsInert,
  44180: seedSocketsInert,
  "44180": seedSocketsInert,
  "excluded-inert": seedExcludedInert,
  excludedinert: seedExcludedInert,
  89931: seedExcludedInert,
  "89931": seedExcludedInert,
  "still-masks": seedStillMasks,
  stillmasks: seedStillMasks,
  "plaintext-forced": seedPlaintextForced,
  plaintextforced: seedPlaintextForced,
  "deny-breaks": seedDenyBreaks,
  denybreaks: seedDenyBreaks,
  slype: seedContrastSlype,
  90676: seedContrastSlype,
  "90676": seedContrastSlype,
  contrast: seedContrastSlype,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, escutcheon: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const escutcheon = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || escutcheon.session),
    issue: asIssue(src.issue ?? escutcheon.issue),
    source: asText(src.source || escutcheon.source),
    escutcheon,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.escutcheon);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("plated", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedPlated().escutcheon;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "incident" || verb === "90717" || verb === "blamed") {
    probe = seedBlamed().escutcheon;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "file") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "stamp" || verb === "file" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseTranscript(raw) {
  const text = asText(raw);
  if (!text.trim()) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return cloneProbe({ ...parsed, scored: true });
    }
  } catch {
    /* transcript, not JSON */
  }
  const probe = emptyProbe();
  const mount = text.match(/^[^\n]*\/run\/user[^\n]*tmpfs[^\n]*/m);
  if (mount) probe.mountinfo = mount[0];
  else if (/\/run\/user/.test(text) && /tmpfs/.test(text)) probe.mountinfo = DEMO_MOUNTINFO;
  const dbus = text.match(/unix:path=\/run\/user\/\d+\/bus/);
  if (dbus) probe.dbusAddress = dbus[0];
  const xdg = text.match(/\/run\/user\/\d+/);
  if (xdg) probe.xdgRuntimeDir = xdg[0];
  if (/cannot access ['"]?\/run\/user/i.test(text)) {
    probe.runtimeExists = false;
    probe.busExists = false;
  }
  if (looksTokenBlame(text)) {
    probe.ghStatus = DEMO_GH_BLAME;
    probe.ghWorks = false;
    probe.keyringReachable = false;
  } else if (looksKeyringHold(text)) {
    probe.ghStatus = DEMO_GH_HOLD;
    probe.ghWorks = true;
    probe.keyringReachable = true;
    probe.runtimeExists = probe.runtimeExists ?? true;
    probe.busExists = probe.busExists ?? true;
  }
  if (/allowunixsockets/i.test(text)) {
    probe.socketsTried = true;
    probe.socketsHelped = /no effect|still .*no such file|inert/i.test(text) ? false : null;
    probe.allowUnixSockets = "/run/user/1000/bus";
  }
  if (/excludedcommands/i.test(text)) {
    probe.excludedTried = true;
    probe.excludedHelped = /no effect|still runs sandboxed|inert/i.test(text) ? false : null;
    probe.excludedCommands = "gh *";
  }
  if (/dangerouslydisablesandbox/i.test(text)) {
    probe.dangerouslyDisableSandbox = true;
    probe.disableHelped = /does not remove|still|same empty tmpfs/i.test(text) ? false : null;
  }
  if (/insecure-storage/i.test(text)) {
    probe.insecureStorage = true;
    probe.keyringReachable = false;
  }
  if (/hosts\.yml/.test(text) && /permission denied/i.test(text)) {
    probe.hostsYmlDeny = true;
    probe.hostsYmlReadable = false;
    probe.ghStatus = probe.ghStatus || DEMO_HOSTS_DENY;
  }
  probe.scored = true;
  return cloneProbe(probe);
}

export function parseEscutcheonJson(raw) {
  if (raw && typeof raw === "object") {
    return cloneProbe({ ...raw, scored: true });
  }
  return parseTranscript(raw);
}

export function emptyAction(verb = "idle") {
  return { action: verb, escutcheon: emptyProbe() };
}
