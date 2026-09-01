#!/usr/bin/env node
/**
 * Riddle — foundry / mining riddle-sieve classifier.
 * A riddle that jams on a duplicate pour is not a hold.
 * Score the mesh or admit sifted.
 *
 *   echo '{"ipsetAddExist":false,"duplicateIp":true,"setEAbort":true,"postStartExit":1,"firewallFinished":false}' | node riddle.mjs
 *   node riddle.mjs ticket.json
 *
 * Idle word is sifted (HOLD: ipset add -exist; duplicate IPs accepted;
 * firewall init finishes; postStartCommand 0).
 * Seeded state is jammed / #91327 (two domains → one IP; ipset add
 * without -exist; set -e abort; postStartCommand exit 1; firewall unfinished).
 * NEVER idle as jammed, stocked, aired, drained, hinged, pealed, warded,
 * first-wins, seized, pooled.
 *
 * Primary #91327: Official stock .devcontainer / init-firewall.sh runs
 * under set -euo pipefail. Per-domain resolution loop does
 * `ipset add allowed-domains "$ip"`. When two allowlisted domains resolve
 * to the same IP, second add errors:
 * `ipset v7.17: Element cannot be added to the set: it's already added`.
 * set -e aborts the script; postStartCommand exits 1; container comes up
 * without completing firewall initialization. Observed live 2026-09-01:
 * Docker Desktop on Windows 11 + @devcontainers/cli;
 * marketplace.visualstudio.com and vscode.blob.core.windows.net both
 * resolved to 150.171.74.16. Minimal fix proposed:
 * `ipset add -exist allowed-domains "$ip"`. Cherry-pick ready at
 * pedro-silva-hub/claude-code@001c048d6eba062d8bbf7f7e2d538f00e833e28b
 * (branch fix/devcontainer-ipset-exist) — cite only; do not claim merged
 * upstream. After the fix (reporter): container boots clean; default-deny
 * still holds; non-allowlisted blocked; registry.npmjs.org reachable;
 * sudo -n iptables denied for node user.
 *
 * Hypothesis only (NON-BINDING): treat missing `ipset add -exist` (or
 * dedupe before add) under `set -e` as the defect; CDN-fronted allowlist
 * domains sharing an IP is expected; aborting firewall init on a
 * duplicate is unhealthy. Do not claim a root cause in Claude Code source
 * you have not seen. Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the mesh is sifted or jammed.
 *
 * NOT grain loft / garner / bin / airing-hatch.
 * NOT millrace / sluice-gate / pool-gauge.
 * NOT peal-board / belfry / carillon.
 * NOT postern-gate / night bailey.
 * NOT plane-table / alidade.
 * NOT rudder pintle / gudgeon / tiller.
 * NOT leftover woodworking / mm-slider.
 * Product name stays Riddle. Do not rename to Sieve / Mesh / Screen /
 * Grate / Filter / Hopper / Garner / Pintle / Carillon / Postern / Sluice.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sifted",
  "jammed",
  "duplicate-ip",
  "set-e-abort",
  "poststart-exit-1",
  "firewall-unfinished",
  "ipset-without-exist",
  "shared-cdn-ip",
  "allowlist-cdn-domains",
  "hold",
]);
export const IDLE_WORD = "sifted";
export const SEEDED_WORD = "jammed";
export const HOLD_VERDICTS = Object.freeze(["sifted", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91327;
export const PRIMARY_ISSUES = Object.freeze([91327]);
export const COUSINS = Object.freeze([35197, 15611, 67130]);
export const COUSIN_ISSUE = 35197;
export const CROSS_ECOSYSTEM = "openai/codex#22471";
export const CROSS_ECOSYSTEM_URL =
  "https://github.com/openai/codex/issues/22471";
export const NOT_PRODUCTS = Object.freeze([
  "garner",
  "pintle",
  "carillon",
  "postern",
  "sluice",
  "alidade",
  "slype",
  "gasket",
  "wicket",
  "woodworking",
  "mm-slider",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91327";
export const TITLE =
  "Devcontainer: init-firewall.sh aborts on boot when two allowlisted domains resolve to the same IP (ipset duplicate + set -e)";
export const FILED_AT = "2026-09-01T21:44:23Z";
export const LABELS = Object.freeze(["bug", "has repro", "area:sandbox"]);
export const REPORTER = "pedro-silva-hub";
export const PLATFORM = "Windows 11";
export const DOCKER_DESKTOP = "Docker Desktop";
export const DEVCONTAINERS_CLI = "@devcontainers/cli";
export const SHARED_IP = "150.171.74.16";
export const DOMAIN_MARKETPLACE = "marketplace.visualstudio.com";
export const DOMAIN_BLOB = "vscode.blob.core.windows.net";
export const ALLOWLIST_DOMAINS = Object.freeze([
  DOMAIN_MARKETPLACE,
  DOMAIN_BLOB,
]);
export const IPSET_ERROR =
  "ipset v7.17: Element cannot be added to the set: it's already added";
export const IPSET_ADD = 'ipset add allowed-domains "$ip"';
export const IPSET_ADD_EXIST = 'ipset add -exist allowed-domains "$ip"';
export const SET_EUO = "set -euo pipefail";
export const POSTSTART_EXIT = 1;
export const POSTSTART_OK = 0;
export const POSTSTART_LINE =
  "postStartCommand from devcontainer.json failed with exit code 1.";
export const INIT_FIREWALL = "/usr/local/bin/init-firewall.sh";
export const CHERRY_PICK =
  "001c048d6eba062d8bbf7f7e2d538f00e833e28b";
export const CHERRY_PICK_REF =
  "pedro-silva-hub/claude-code@001c048d6eba062d8bbf7f7e2d538f00e833e28b";
export const CHERRY_PICK_BRANCH = "fix/devcontainer-ipset-exist";
export const NPM_REGISTRY = "registry.npmjs.org";
export const SUDO_IPTABLES = "sudo -n iptables";
export const NODE_USER = "node";
export const HUB_LINE =
  "07:50 riddle: a riddle that jams on a duplicate pour is not a hold. Score the mesh or admit sifted.";
export const MARK = "07:50 / hermes catalog #108 / #91327";
export const PHRASE =
  "A riddle that jams on a duplicate pour is not a hold. Score the mesh or admit sifted.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat missing `ipset add -exist` (or dedupe before add) under `set -e` as the defect; CDN-fronted allowlist domains sharing an IP is expected; aborting firewall init on a duplicate is unhealthy. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DEVCONTAINER FIREWALL INIT ABORTS WHEN TWO ALLOWLISTED DOMAINS SHARE ONE IP (ipset duplicate + set -e). Official stock .devcontainer / init-firewall.sh runs under set -euo pipefail. Per-domain resolution loop does ipset add allowed-domains \"$ip\". When two allowlisted domains resolve to the same IP, second add errors: ipset v7.17: Element cannot be added to the set: it's already added. set -e aborts; postStartCommand exits 1; firewall unfinished. Observed live 2026-09-01: Docker Desktop on Windows 11 + @devcontainers/cli; marketplace.visualstudio.com and vscode.blob.core.windows.net both resolved to 150.171.74.16. Minimal fix proposed: ipset add -exist. Cherry-pick ready at pedro-silva-hub/claude-code@001c048d6eba062d8bbf7f7e2d538f00e833e28b (branch fix/devcontainer-ipset-exist) — cite only; do not claim merged upstream. NOT Garner #91246 Desktop archive-to-pool no TTL / loft. NOT Pintle #91226 PreToolUse Bash relative-path cwd-drift deadlock. NOT Carillon #91250 plugin SessionStart first-wins. NOT Postern #91223 socket-dir squat. NOT Sluice #91265 Cowork Toke/File/SeAt kernel pool leak / millrace. NOT Alidade #91055 silent foreign host. NOT Slype #90676 sandbox System32 powershell vs Program Files pwsh 126. NOT Gasket (sandbox project key seal). NOT Wicket (isolation pin / gatehouse). NOT leftover woodworking / mm-slider. Product name stays Riddle.";
export const FORBIDDEN_IDLE = Object.freeze([
  "jammed",
  "stocked",
  "aired",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "first-wins",
  "seized",
  "pooled",
]);
export const BANNED_NAMES = Object.freeze([
  "Sieve",
  "Mesh",
  "Screen",
  "Grate",
  "Filter",
  "Hopper",
  "Garner",
  "Pintle",
  "Carillon",
  "Postern",
  "Sluice",
]);
export const FORBIDDEN_UI = Object.freeze([
  "grain loft",
  "airing hatch",
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "carillon",
  "postern-gate",
  "night bailey",
  "plane-table",
  "alidade",
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
    ipsetAddExist: null,
    duplicateIp: null,
    setEAbort: null,
    postStartExit: null,
    firewallFinished: null,
    ipsetWithoutExist: null,
    sharedCdnIp: null,
    allowlistCdn: null,
    domains: [],
    resolvedIp: "",
    ipsetError: "",
    defaultDenyHolds: null,
    npmReachable: null,
    sudoIptablesDenied: null,
    platform: "",
    dockerDesktop: "",
    cli: "",
    cherryPick: "",
    cousin: "",
    outputText: "",
  };
}

export function seedSifted() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "devcontainer",
    ipsetAddExist: true,
    duplicateIp: true,
    setEAbort: false,
    postStartExit: POSTSTART_OK,
    firewallFinished: true,
    ipsetWithoutExist: false,
    sharedCdnIp: true,
    allowlistCdn: true,
    domains: [...ALLOWLIST_DOMAINS],
    resolvedIp: SHARED_IP,
    ipsetError: "",
    defaultDenyHolds: true,
    npmReachable: true,
    sudoIptablesDenied: true,
    platform: PLATFORM,
    dockerDesktop: DOCKER_DESKTOP,
    cli: DEVCONTAINERS_CLI,
    cherryPick: "",
    cousin: "",
    outputText:
      "sifted; ipset add -exist; duplicate IPs accepted; firewall init finishes; postStartCommand 0; idle word sifted",
  };
}

export function seedJammed() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    sharedCdnIp: true,
    allowlistCdn: true,
    domains: [...ALLOWLIST_DOMAINS],
    resolvedIp: SHARED_IP,
    ipsetError: IPSET_ERROR,
    defaultDenyHolds: null,
    npmReachable: null,
    sudoIptablesDenied: null,
    platform: PLATFORM,
    dockerDesktop: DOCKER_DESKTOP,
    cli: DEVCONTAINERS_CLI,
    cherryPick: CHERRY_PICK,
    cousin: "",
    outputText:
      "jammed; #91327; two domains → one IP; ipset add without -exist; set -e abort; postStartCommand exit 1; firewall unfinished; marketplace.visualstudio.com and vscode.blob.core.windows.net both resolved to 150.171.74.16; ipset v7.17: Element cannot be added to the set: it's already added; Docker Desktop on Windows 11 + @devcontainers/cli",
  };
}

export function seedDuplicateIp() {
  return {
    seed: "duplicate-ip",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    sharedCdnIp: true,
    domains: [...ALLOWLIST_DOMAINS],
    resolvedIp: SHARED_IP,
    ipsetError: IPSET_ERROR,
    platform: PLATFORM,
    dockerDesktop: DOCKER_DESKTOP,
    cli: DEVCONTAINERS_CLI,
    outputText:
      "duplicate-ip; marketplace.visualstudio.com and vscode.blob.core.windows.net both resolved to 150.171.74.16",
  };
}

export function seedSetEAbort() {
  return {
    seed: "set-e-abort",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    platform: PLATFORM,
    outputText:
      "set-e-abort; init-firewall.sh runs under set -euo pipefail; second ipset add errors; set -e aborts the script",
  };
}

export function seedPoststartExit1() {
  return {
    seed: "poststart-exit-1",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    platform: PLATFORM,
    outputText:
      "poststart-exit-1; postStartCommand from devcontainer.json failed with exit code 1; Command failed: /bin/sh -c sudo /usr/local/bin/init-firewall.sh",
  };
}

export function seedFirewallUnfinished() {
  return {
    seed: "firewall-unfinished",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    platform: PLATFORM,
    outputText:
      "firewall-unfinished; container comes up without completing firewall initialization",
  };
}

export function seedIpsetWithoutExist() {
  return {
    seed: "ipset-without-exist",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    platform: PLATFORM,
    outputText:
      'ipset-without-exist; per-domain loop does ipset add allowed-domains "$ip" without -exist',
  };
}

export function seedSharedCdnIp() {
  return {
    seed: "shared-cdn-ip",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    sharedCdnIp: true,
    domains: [...ALLOWLIST_DOMAINS],
    resolvedIp: SHARED_IP,
    platform: PLATFORM,
    outputText:
      "shared-cdn-ip; CDN-fronted allowlist domains sharing 150.171.74.16; marketplace.visualstudio.com and vscode.blob.core.windows.net",
  };
}

export function seedAllowlistCdnDomains() {
  return {
    seed: "allowlist-cdn-domains",
    source: "devcontainer",
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: POSTSTART_EXIT,
    firewallFinished: false,
    ipsetWithoutExist: true,
    allowlistCdn: true,
    domains: [...ALLOWLIST_DOMAINS],
    resolvedIp: SHARED_IP,
    platform: PLATFORM,
    outputText:
      "allowlist-cdn-domains; marketplace.visualstudio.com and vscode.blob.core.windows.net on the stock allowlist; both resolved to 150.171.74.16",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "devcontainer",
    ipsetAddExist: true,
    duplicateIp: true,
    setEAbort: false,
    postStartExit: POSTSTART_OK,
    firewallFinished: true,
    ipsetWithoutExist: false,
    defaultDenyHolds: true,
    npmReachable: true,
    sudoIptablesDenied: true,
    platform: PLATFORM,
    dockerDesktop: DOCKER_DESKTOP,
    cli: DEVCONTAINERS_CLI,
    outputText:
      "hold; ipset add -exist; duplicate IPs accepted; firewall init finishes; postStartCommand 0; default-deny still holds",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "devcontainer",
    cousin: "35197",
    platform: PLATFORM,
    outputText:
      "cousin-not-primary; #35197 closed stale — same class: init-firewall fails on duplicate IPs from DNS; not the 2026-09-01 live #91327 observation",
  };
}

export function emptyTicket() {
  return seedSifted();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.riddle && typeof src.riddle === "object" && src.riddle) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.mesh && typeof src.mesh === "object" && src.mesh) ||
    src;
  const domains = Array.isArray(nested.domains)
    ? nested.domains
    : Array.isArray(src.domains)
      ? src.domains
      : [];
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
    ipsetAddExist: firstBool(
      nested.ipsetAddExist,
      nested.ipset_add_exist,
      src.ipsetAddExist,
    ),
    duplicateIp: firstBool(
      nested.duplicateIp,
      nested.duplicate_ip,
      src.duplicateIp,
    ),
    setEAbort: firstBool(nested.setEAbort, nested.set_e_abort, src.setEAbort),
    postStartExit: firstNum(
      nested.postStartExit,
      nested.post_start_exit,
      src.postStartExit,
    ),
    firewallFinished: firstBool(
      nested.firewallFinished,
      nested.firewall_finished,
      src.firewallFinished,
    ),
    ipsetWithoutExist: firstBool(
      nested.ipsetWithoutExist,
      nested.ipset_without_exist,
      src.ipsetWithoutExist,
    ),
    sharedCdnIp: firstBool(
      nested.sharedCdnIp,
      nested.shared_cdn_ip,
      src.sharedCdnIp,
    ),
    allowlistCdn: firstBool(
      nested.allowlistCdn,
      nested.allowlist_cdn,
      src.allowlistCdn,
    ),
    domains,
    resolvedIp: firstText(
      nested.resolvedIp,
      nested.resolved_ip,
      src.resolvedIp,
    ),
    ipsetError: firstText(nested.ipsetError, nested.ipset_error, src.ipsetError),
    defaultDenyHolds: firstBool(
      nested.defaultDenyHolds,
      nested.default_deny_holds,
      src.defaultDenyHolds,
    ),
    npmReachable: firstBool(
      nested.npmReachable,
      nested.npm_reachable,
      src.npmReachable,
    ),
    sudoIptablesDenied: firstBool(
      nested.sudoIptablesDenied,
      nested.sudo_iptables_denied,
      src.sudoIptablesDenied,
    ),
    platform: firstText(nested.platform, src.platform),
    dockerDesktop: firstText(
      nested.dockerDesktop,
      nested.docker_desktop,
      src.dockerDesktop,
    ),
    cli: firstText(nested.cli, src.cli),
    cherryPick: firstText(
      nested.cherryPick,
      nested.cherry_pick,
      src.cherryPick,
    ),
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
    row.ipsetAddExist == null &&
    row.duplicateIp == null &&
    row.setEAbort == null &&
    row.postStartExit == null &&
    row.firewallFinished == null &&
    row.ipsetWithoutExist == null &&
    !row.resolvedIp &&
    !row.ipsetError
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSifted,
  [SEEDED_WORD]: seedJammed,
  "duplicate-ip": seedDuplicateIp,
  "set-e-abort": seedSetEAbort,
  "poststart-exit-1": seedPoststartExit1,
  "firewall-unfinished": seedFirewallUnfinished,
  "ipset-without-exist": seedIpsetWithoutExist,
  "shared-cdn-ip": seedSharedCdnIp,
  "allowlist-cdn-domains": seedAllowlistCdnDomains,
  hold: seedHold,
  cousin: seedCousin,
  35197: seedCousin,
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
    return { ...seedJammed(), ...cloned, ...raw };
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
  return [ticket.outputText, ticket.title, ticket.cousin, ticket.seed, ticket.ipsetError]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isSifted(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.ipsetAddExist === true &&
    row.postStartExit === POSTSTART_OK &&
    row.firewallFinished === true
  ) {
    return true;
  }
  return false;
}

export function isJammed(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.ipsetAddExist === false &&
    row.duplicateIp === true &&
    row.setEAbort === true &&
    row.postStartExit === POSTSTART_EXIT
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
      /cousin-not-primary|#35197|#15611|#67130|codex#22471|#22471/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const jammedNow = !cousinOnly && isJammed(row);
  const siftedNow = !jammedNow && isSifted(row);
  const duplicateIp =
    row.duplicateIp === true ||
    named === "duplicate-ip" ||
    /duplicate-ip|both resolved to|same IP/i.test(text);
  const setEAbort =
    row.setEAbort === true ||
    named === "set-e-abort" ||
    /set-e-abort|set -e abort|set -euo pipefail/i.test(text);
  const poststartExit1 =
    row.postStartExit === POSTSTART_EXIT ||
    named === "poststart-exit-1" ||
    /poststart-exit-1|exit code 1|postStartCommand.*exit/i.test(text);
  const firewallUnfinished =
    row.firewallFinished === false ||
    named === "firewall-unfinished" ||
    /firewall-unfinished|without completing firewall|firewall unfinished/i.test(
      text,
    );
  const ipsetWithoutExist =
    row.ipsetWithoutExist === true ||
    row.ipsetAddExist === false ||
    named === "ipset-without-exist" ||
    /ipset-without-exist|without -exist|ipset add allowed-domains/i.test(text);
  const sharedCdn =
    row.sharedCdnIp === true ||
    row.resolvedIp === SHARED_IP ||
    named === "shared-cdn-ip" ||
    /shared-cdn-ip|150\.171\.74\.16/i.test(text);
  const allowlistCdn =
    row.allowlistCdn === true ||
    named === "allowlist-cdn-domains" ||
    /allowlist-cdn-domains|marketplace\.visualstudio\.com|vscode\.blob\.core\.windows\.net/i.test(
      text,
    );
  const jammed =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (jammedNow || named === SEEDED_WORD || /jammed|#91327/i.test(text));
  const sifted =
    named === IDLE_WORD ||
    named === "hold" ||
    (siftedNow && !jammed);
  return {
    named,
    cousinOnly,
    jammedNow,
    siftedNow,
    duplicateIp,
    setEAbort,
    poststartExit1,
    firewallUnfinished,
    ipsetWithoutExist,
    sharedCdn,
    allowlistCdn,
    jammed,
    sifted,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.sifted && !flags.jammed) chips.push("sifted");
  if (flags.jammed) chips.push("jammed");
  if (flags.duplicateIp && flags.jammed) chips.push("duplicate-ip");
  if (flags.setEAbort && flags.jammed) chips.push("set-e-abort");
  if (flags.poststartExit1 && flags.jammed) chips.push("poststart-exit-1");
  if (flags.firewallUnfinished && flags.jammed) chips.push("firewall-unfinished");
  if (flags.ipsetWithoutExist && flags.jammed) chips.push("ipset-without-exist");
  if (flags.sharedCdn && flags.jammed) chips.push("shared-cdn-ip");
  if (flags.allowlistCdn && flags.jammed) chips.push("allowlist-cdn-domains");
  if ((flags.sifted || flags.named === "hold") && !flags.jammed) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "sifted") {
    reasons.push(
      "sifted; ipset add -exist; duplicate IPs accepted; firewall init finishes; postStartCommand 0",
    );
    reasons.push("hold: the mesh is sifted; score treats -exist on duplicate pour");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; ipset add -exist; duplicate IPs accepted; firewall init finishes; postStartCommand 0; default-deny still holds",
    );
  }
  if (verdict === "jammed" || flags.jammed) {
    reasons.push(
      "jammed; #91327; two domains → one IP; ipset add without -exist; set -e abort; postStartCommand exit 1; firewall unfinished",
    );
  }
  if (flags.duplicateIp || verdict === "duplicate-ip") {
    reasons.push(
      `duplicate-ip; ${DOMAIN_MARKETPLACE} and ${DOMAIN_BLOB} both resolved to ${SHARED_IP}`,
    );
  }
  if (flags.setEAbort || verdict === "set-e-abort") {
    reasons.push(
      `set-e-abort; ${SET_EUO}; second ${IPSET_ADD} errors; set -e aborts the script`,
    );
  }
  if (flags.poststartExit1 || verdict === "poststart-exit-1") {
    reasons.push(`poststart-exit-1; ${POSTSTART_LINE}`);
  }
  if (flags.firewallUnfinished || verdict === "firewall-unfinished") {
    reasons.push(
      "firewall-unfinished; container comes up without completing firewall initialization",
    );
  }
  if (flags.ipsetWithoutExist || verdict === "ipset-without-exist") {
    reasons.push(`ipset-without-exist; ${IPSET_ADD}; error: ${IPSET_ERROR}`);
  }
  if (flags.sharedCdn || verdict === "shared-cdn-ip") {
    reasons.push(
      `shared-cdn-ip; CDN-fronted allowlist domains sharing ${SHARED_IP}`,
    );
  }
  if (flags.allowlistCdn || verdict === "allowlist-cdn-domains") {
    reasons.push(
      `allowlist-cdn-domains; ${DOMAIN_MARKETPLACE} and ${DOMAIN_BLOB} on the stock allowlist`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Riddle; cite-only same-class init-firewall duplicate-IP surface, not the 2026-09-01 live #91327 observation",
    );
  }
  if (verdict === "jammed" || flags.jammed) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "sifted" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.sifted || !flags.jammed)) return "sifted";
  if (named === "hold" && !flags.jammed) return "hold";
  if (named === SEEDED_WORD) return "jammed";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "sifted";
  if (flags.jammed) return "jammed";
  if (flags.sifted) return "sifted";
  return "sifted";
}

function meshOf(flags, ticket, verdict) {
  if (verdict === "jammed" || flags.jammed) {
    return {
      frame: "jammed — duplicate pour stuck on the mesh",
      mesh: "wire mesh refused the second add; ore grit sits",
      strap: "coal-iron strap held; ipset add without -exist",
      chalk: `150.171.74.16 · postStartCommand 1 · ${IPSET_ERROR}`,
      rivet: "copper rivets mark the two domains on one IP",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      frame: "clear — -exist accepted the duplicate pour",
      mesh: "wire mesh held; grit passed",
      strap: "coal-iron strap idle; firewall finished",
      chalk: "hold · mesh sifted · postStartCommand 0",
      rivet: "copper rivets quiet",
      note: "Hold: the mesh is sifted.",
    };
  }
  return {
    frame: "clear — ipset add -exist accepted the duplicate",
    mesh: "wire mesh open; grit sifted through",
    strap: "coal-iron strap idle; firewall init finished",
    chalk: "sifted · idle word sifted",
    rivet: "copper rivets quiet",
    note: "Sifted: the mesh is clear.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const jammed = verdict === "jammed" || flags.jammed;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    sifted: verdict === "sifted" || (flags.sifted && !jammed),
    jammed,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: meshOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91327 || name === "91327") {
    return analyze(seedJammed());
  }
  if (name === "duplicate-ip") return analyze(seedDuplicateIp());
  if (name === "set-e-abort") return analyze(seedSetEAbort());
  if (name === "poststart-exit-1") return analyze(seedPoststartExit1());
  if (name === "firewall-unfinished") return analyze(seedFirewallUnfinished());
  if (name === "ipset-without-exist") return analyze(seedIpsetWithoutExist());
  if (name === "shared-cdn-ip") return analyze(seedSharedCdnIp());
  if (name === "allowlist-cdn-domains") return analyze(seedAllowlistCdnDomains());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "sifted" || name === "cleared") {
    return analyze(seedSifted());
  }
  if (name === 35197 || name === "35197" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSifted());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "jammed" || (result.jammed && result.alarm)
          ? `jammed riddle #${FEATURED_ISSUE}: two allowlisted domains resolved to ${SHARED_IP}; ipset add without -exist; set -e abort; postStartCommand exit 1; firewall unfinished. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. ipset add -exist accepts the duplicate pour. Score the mesh."
            : `sifted riddle. Idle word ${IDLE_WORD}. ipset add -exist; duplicate IPs accepted; firewall init finishes; postStartCommand 0.`,
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
