#!/usr/bin/env node
/**
 * Weir — mill weir / millrace booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Cowork Desktop (macOS, Individual Pro) after a background ShipIt
 * auto-update on 2026-09-11 (~02:36 local): Claude desktop 1.52386.0,
 * Cowork VM 2.1.260 → 2.1.266. A custom remote MCP connector’s
 * file-upload flow still gets request_upload_url via the MCP proxy,
 * but the sandbox’s subsequent direct egress PUT --data-binary
 * to the returned custom-domain URL is rejected with 403 at the
 * egress proxy (host_not_allowed / blocked-by-allowlist). The
 * destination host is never contacted (no server-side log). Settings
 * → Capabilities → Allow network egress ON with the host under
 * Additional allowed domains, and even Domain allowlist = All domains,
 * do not help. Identical settings worked on VM 2.1.260 the day before.
 *
 *   node weir.mjs data/dammed.json
 *   echo '{"seed":"dammed"}' | node weir.mjs
 *
 * Idle word is flowing (HOLD: additional domains / All domains admit
 * the PUT; millrace open).
 * Seeded word is dammed (#93589 — 403 at egress; host never reached).
 * Path word is egress-allowlist.
 * Product score word is weir (Score weir or admit flowing.).
 *
 * Encoded from anthropics/claude-code#93589 issue text only.
 * Hypothesis (NON-BINDING): user-level additional-domains / All-domains
 * flags may no longer be written into the sandbox egress JWT/proxy
 * after the 2.1.266 VM cut. Verify against #93589 text only. Do NOT
 * claim a root cause in Claude Code source you have not seen. Do NOT
 * implement a fix. No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "flowing",
  "dammed",
  "weir",
  "egress-allowlist",
  "hold",
  "put-403",
  "host-never-reached",
  "all-domains-ignored",
  "additional-domains",
  "mcp-proxy-ok",
  "shipit-update",
  "vm-2.1.266",
  "regression",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "flowing";
export const PATH_WORD = "egress-allowlist";
export const SEEDED_WORD = "dammed";
export const PRODUCT_WORD = "weir";
export const HOLD = Object.freeze(["flowing", "hold"]);
export const RECOVER = Object.freeze(["flowing", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "dammed" && name !== "weir"),
);

export const FEATURED_ISSUE = 93589;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93589";
export const TITLE =
  'Cowork Desktop: local "Additional allowed domains" / "All domains" egress stopped being enforced after 2026-09-11 update (VM 2.1.260 worked, 2.1.266 blocks)';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:mcp",
  "area:cowork",
  "regression",
  "area:networking",
  "area:sandbox",
]);
export const PLATFORM = "macOS";
export const PLAN = "Individual Pro";
export const DESKTOP = "1.52386.0";
export const VM_BEFORE = "2.1.260";
export const VM_AFTER = "2.1.266";
export const SHIPIT = "2026-09-11 02:36:50";
export const VM_FOLDER = "2026-09-11 02:37";
export const UPLOAD_BYTES = 14641;
export const EGRESS_CODE = 403;
export const EGRESS_REASON = "host_not_allowed";
export const COMMENT_ISSUE = 93525;
export const PHRASE = "Score weir or admit flowing.";
export const DISTRIBUTION =
  "Cowork Desktop macOS Individual Pro. After a background ShipIt auto-update on 2026-09-11 (~02:36 local): Claude desktop 1.52386.0, Cowork VM 2.1.260 → 2.1.266. Custom remote MCP request_upload_url still succeeds via the MCP proxy. Sandbox direct egress PUT --data-binary to the returned custom-domain URL is rejected with 403 at the egress proxy (host_not_allowed / blocked-by-allowlist). Destination host is never contacted. Additional allowed domains and Domain allowlist = All domains do not help. Identical settings worked on VM 2.1.260 the day before (14,641-byte upload received).";
export const SESSION_KIND =
  "Cowork Desktop VM path. 2026-09-10 VM 2.1.260: Allow network egress ON, Package managers only + Additional allowed domains, PUT succeeded (14,641 bytes). 2026-09-11 ShipIt 02:36:50 / VM folder 02:37 cut to 2.1.266: request_upload_url still returns the allow-listed host; sandbox PUT 403 at egress; no server-side log. Commenter #93525: every host refused at CONNECT even with All domains; an old July conversation not moved to cloud still has network.";

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "crest",
    survey: "read the weir crest (should meter flow, not stay shut)",
    kind: "crest",
    note: "seeded: crest stays shut; millrace dry even when All domains is open",
  },
  {
    id: "race",
    survey: "watch the millrace (should carry water to the wheel)",
    kind: "race",
    note: "seeded: race is dry — PUT never leaves the sandbox",
  },
  {
    id: "gates",
    survey: "read the rust gates (operator opened All domains / additional domains)",
    kind: "gates",
    note: "seeded: gates stay rusted shut despite All domains and additional domains",
  },
  {
    id: "millstone",
    survey: "feel the MCP millstone (request_upload_url should still turn)",
    kind: "millstone",
    note: "seeded: millstone still turns — MCP proxy path is fine; only direct egress is blocked",
  },
  {
    id: "ledger",
    survey: "read the miller's ledger (host should log the PUT)",
    kind: "ledger",
    note: "seeded: destination never contacted — no server-side log line",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "egress-allowlist",
  "dammed",
  "put-403",
  "host-never-reached",
  "all-domains-ignored",
  "additional-domains",
  "mcp-proxy-ok",
  "vm-2.1.266",
]);

export const COUSINS = Object.freeze([
  {
    issue: 51400,
    title: "Cowork Desktop additional-domain not enforced under Package managers only",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — prior additional-domain miss. Do not rebuild",
  },
  {
    issue: 34690,
    title: "All domains setting not reflected in session proxy JWT",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — All domains vs JWT. Do not rebuild",
  },
  {
    issue: 93525,
    title: "same Sept 11 egress regression (commenter link)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same-day CONNECT refuse. Do not rebuild",
  },
  {
    issue: 38984,
    title: "prior networking/egress cousin as cited on #93589",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — networking/egress. Do not rebuild",
  },
  {
    issue: 30112,
    title: "prior networking/egress cousin as cited on #93589",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — networking/egress. Do not rebuild",
  },
  {
    issue: 63182,
    title: "prior networking/egress cousin as cited on #93589",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — networking/egress. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93570,
    title: "single-task shutdown kills all",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash ~8175 truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93622,
    title: "channel messages merge lose prompt cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity silent session substitution",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "irons",
  "cathead",
  "anachronism",
  "nullarbor",
  "petard",
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
  "sluice",
  "spillway",
  "leat",
  "portcullis",
  "postern",
  "embrasure",
  "wicket",
]);

export const SAMPLE_CREST = Object.freeze({
  shut: true,
  metering: false,
});

export const SAMPLE_FLOWING_CREST = Object.freeze({
  shut: false,
  metering: true,
});

export const SAMPLE_RACE = Object.freeze({
  dry: true,
  wet: false,
});

export const SAMPLE_FLOWING_RACE = Object.freeze({
  dry: false,
  wet: true,
});

export const SAMPLE_GATES = Object.freeze({
  rusted: true,
  lifted: false,
  allDomains: true,
  additionalDomains: true,
});

export const SAMPLE_FLOWING_GATES = Object.freeze({
  rusted: false,
  lifted: true,
  allDomains: true,
  additionalDomains: true,
});

export const SAMPLE_MILLSTONE = Object.freeze({
  proxyOk: true,
  putAdmitted: false,
});

export const SAMPLE_FLOWING_MILLSTONE = Object.freeze({
  proxyOk: true,
  putAdmitted: true,
});

export const SAMPLE_LEDGER = Object.freeze({
  hostReached: false,
  bytes: 0,
  status: 403,
});

export const SAMPLE_FLOWING_LEDGER = Object.freeze({
  hostReached: true,
  bytes: UPLOAD_BYTES,
  status: 200,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "additional domains / All domains admit the PUT; millrace open" },
  { t: "shipit", line: "background ShipIt 2026-09-11 02:36:50 · desktop 1.52386.0" },
  { t: "cut", line: "Cowork VM 2.1.260 → 2.1.266 · new folder 02:37" },
  { t: "proxy", line: "request_upload_url still returns the allow-listed host via MCP proxy" },
  { t: "put", line: "sandbox PUT --data-binary rejected 403 at egress" },
  { t: "host", line: "destination never contacted — no server-side log" },
  { t: "extra", line: "host still listed under Additional allowed domains" },
  { t: "all", line: "Domain allowlist = All domains still 403" },
  { t: "reg", line: "identical settings worked on VM 2.1.260 the day before (14,641 bytes)" },
  { t: "path", line: "egress-allowlist — user flags no longer admit the sandbox PUT" },
  { t: "score", line: "when the gates stay shut the millrace is dry — Score weir or admit flowing." },
]);

export function inspectCrest(input = {}) {
  const crest =
    input.crest && typeof input.crest === "object"
      ? input.crest
      : input.flowing === true && input.dammed !== true
        ? SAMPLE_FLOWING_CREST
        : SAMPLE_CREST;
  const forcedShut =
    input.dammed === true ||
    input.put403 === true ||
    input.event === "dammed" ||
    input.event === "weir" ||
    input.event === "put-403" ||
    input.egressAllowlist === true;
  const metering = forcedShut
    ? false
    : crest.metering === true ||
      input.flowing === true ||
      input.mcpProxyOk === true && input.put403 !== true && input.dammed !== true;
  return {
    metering,
    shut: !metering,
    stamp: metering ? "flowing" : "weir",
    note: metering
      ? "weir crest meters flow — additional domains admit the PUT; millrace open"
      : "weir crest stays shut — All domains open, millrace still dry",
  };
}

export function inspectRace(input = {}) {
  const race =
    input.race && typeof input.race === "object"
      ? input.race
      : input.flowing === true && input.dammed !== true
        ? SAMPLE_FLOWING_RACE
        : SAMPLE_RACE;
  const forcedDry =
    input.put403 === true ||
    input.event === "put-403" ||
    input.hostNeverReached === true ||
    (input.dammed === true && input.flowing !== true);
  const dry = forcedDry ? true : race.dry === true && race.wet !== true;
  return {
    dry,
    wet: !dry,
    stamp: dry ? "dry" : "wet",
    note: dry
      ? "millrace dry — sandbox PUT never leaves the weir"
      : "millrace wet — PUT bytes reach the custom-domain host",
  };
}

export function inspectGates(input = {}) {
  const gates =
    input.gates && typeof input.gates === "object"
      ? input.gates
      : input.flowing === true && input.dammed !== true
        ? SAMPLE_FLOWING_GATES
        : SAMPLE_GATES;
  const forcedRust =
    input.allDomainsIgnored === true ||
    input.event === "all-domains-ignored" ||
    input.additionalDomains === true ||
    (input.dammed === true && input.flowing !== true);
  const rusted = forcedRust ? true : gates.rusted === true && gates.lifted !== true;
  return {
    rusted,
    lifted: !rusted,
    allDomains: true,
    additionalDomains: true,
    stamp: rusted ? "rusted" : "lifted",
    note: rusted
      ? "rust gates stay shut — All domains and additional domains ignored"
      : "rust gates lifted — All domains / additional domains admit the PUT",
  };
}

export function inspectMillstone(input = {}) {
  const millstone =
    input.millstone && typeof input.millstone === "object"
      ? input.millstone
      : input.flowing === true && input.dammed !== true
        ? SAMPLE_FLOWING_MILLSTONE
        : SAMPLE_MILLSTONE;
  const forcedProxy =
    input.mcpProxyOk === true ||
    input.event === "mcp-proxy-ok" ||
    (input.dammed === true && input.flowing !== true);
  const proxyOk = forcedProxy || millstone.proxyOk !== false;
  const putAdmitted =
    input.flowing === true && input.dammed !== true
      ? true
      : millstone.putAdmitted === true && input.put403 !== true && input.dammed !== true;
  return {
    proxyOk,
    putAdmitted,
    stamp: putAdmitted ? "admitted" : "proxy-only",
    note: putAdmitted
      ? "MCP millstone turns and the PUT is admitted through the race"
      : "MCP millstone still turns — request_upload_url via proxy; PUT blocked at egress",
  };
}

export function inspectLedger(input = {}) {
  const ledger =
    input.ledger && typeof input.ledger === "object"
      ? input.ledger
      : input.flowing === true && input.dammed !== true
        ? SAMPLE_FLOWING_LEDGER
        : SAMPLE_LEDGER;
  const forcedMiss =
    input.hostNeverReached === true ||
    input.event === "host-never-reached" ||
    input.put403 === true ||
    (input.dammed === true && input.flowing !== true);
  const missed = forcedMiss ? true : ledger.hostReached !== true;
  return {
    hostReached: !missed,
    bytes: missed ? 0 : ledger.bytes || UPLOAD_BYTES,
    status: missed ? EGRESS_CODE : 200,
    stamp: missed ? "never-reached" : "arrived",
    note: missed
      ? "miller's ledger blank — destination host never contacted; 403 at egress"
      : "miller's ledger shows 14,641 bytes arrived on the custom-domain host",
  };
}

export function readBooth(input = {}) {
  const crest = inspectCrest(input);
  const race = inspectRace(input);
  const gates = inspectGates(input);
  const millstone = inspectMillstone(input);
  const ledger = inspectLedger(input);
  const dammed =
    input.flowing !== true &&
    ((race.dry && gates.rusted) ||
      (crest.shut && !ledger.hostReached) ||
      input.dammed === true);
  const flowing =
    input.flowing === true &&
    dammed !== true &&
    crest.metering;
  const path =
    (race.dry && millstone.proxyOk && !millstone.putAdmitted) &&
    (input.event === "egress-allowlist" || input.egressAllowlist === true);
  return {
    crest,
    race,
    gates,
    millstone,
    ledger,
    stations: BOOTH_STATIONS,
    dammed: dammed && !flowing && !path,
    flowing:
      flowing ||
      (crest.metering &&
        race.wet &&
        input.dammed !== true &&
        input.egressAllowlist !== true),
    egressAllowlist: path && !flowing,
    mark:
      path && !flowing
        ? "egress-allowlist"
        : dammed && !flowing
          ? "dammed"
          : "flowing",
  };
}

/**
 * Published weir walk from #93589 only. Facts from the issue text.
 * A flowing booth admits the sandbox PUT when All domains / additional
 * domains are open. A dammed booth 403s at egress with the host never
 * reached. An egress-allowlist booth names the ignored flags as the path.
 */
export const WEIR_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-flowing",
    flowing: true,
    dammed: false,
    mcpProxyOk: true,
    cue: "flowing",
    note: "idle HOLD: additional domains / All domains admit the PUT; millrace open",
  },
  {
    t: "shipit",
    event: "shipit-update",
    dammed: true,
    shipitUpdate: true,
    cue: "dammed",
    note: "background ShipIt 2026-09-11 02:36:50 · desktop 1.52386.0",
  },
  {
    t: "cut",
    event: "vm-2.1.266",
    dammed: true,
    vm266: true,
    cue: "dammed",
    note: "Cowork VM 2.1.260 → 2.1.266 · new folder 02:37",
  },
  {
    t: "proxy",
    event: "mcp-proxy-ok",
    dammed: true,
    mcpProxyOk: true,
    cue: "dammed",
    note: "request_upload_url still returns the allow-listed host via MCP proxy",
  },
  {
    t: "put",
    event: "put-403",
    dammed: true,
    put403: true,
    cue: "dammed",
    note: "sandbox PUT --data-binary rejected 403 at egress",
  },
  {
    t: "host",
    event: "host-never-reached",
    dammed: true,
    hostNeverReached: true,
    cue: "dammed",
    note: "destination never contacted — no server-side log",
  },
  {
    t: "extra",
    event: "additional-domains",
    dammed: true,
    additionalDomains: true,
    cue: "dammed",
    note: "host still listed under Additional allowed domains",
  },
  {
    t: "all",
    event: "all-domains-ignored",
    dammed: true,
    allDomainsIgnored: true,
    cue: "dammed",
    note: "Domain allowlist = All domains still 403",
  },
  {
    t: "reg",
    event: "regression",
    dammed: true,
    regression: true,
    cue: "dammed",
    note: "identical settings worked on VM 2.1.260 the day before (14,641 bytes)",
  },
  {
    t: "path",
    event: "egress-allowlist",
    dammed: true,
    egressAllowlist: true,
    put403: true,
    hostNeverReached: true,
    cue: "dammed",
    note: "egress-allowlist — user flags no longer admit the sandbox PUT",
  },
  {
    t: "score",
    event: "weir",
    dammed: true,
    put403: true,
    hostNeverReached: true,
    allDomainsIgnored: true,
    additionalDomains: true,
    mcpProxyOk: true,
    egressAllowlist: true,
    cue: "dammed",
    note: "weir — when the gates stay shut the millrace is dry",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "mcp-proxy-ok",
    flowing: true,
    mcpProxyOk: true,
    cue: "flowing",
    note: "positive control: request_upload_url still reaches the MCP server via the proxy",
  },
  {
    t: "direct",
    event: "cue-flowing",
    flowing: true,
    cue: "flowing",
    note: "positive control: VM 2.1.260 admitted the PUT with identical additional domains",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    flowing: true,
    dammed: false,
    mcpProxyOk: true,
    cue: "flowing",
  };
}

export function seedFlowing() {
  return { ...emptyTicket() };
}

export function seedDammed() {
  return {
    seed: SEEDED_WORD,
    flowing: false,
    dammed: true,
    put403: true,
    hostNeverReached: true,
    allDomainsIgnored: true,
    additionalDomains: true,
    mcpProxyOk: true,
    shipitUpdate: true,
    vm266: true,
    regression: true,
    egressAllowlist: true,
    cue: "dammed",
    issue: FEATURED_ISSUE,
    crest: SAMPLE_CREST,
    race: SAMPLE_RACE,
    gates: SAMPLE_GATES,
    millstone: SAMPLE_MILLSTONE,
    ledger: SAMPLE_LEDGER,
  };
}

export function seedWeir() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    dammed: true,
    put403: true,
    hostNeverReached: true,
    allDomainsIgnored: true,
    additionalDomains: true,
    mcpProxyOk: true,
    egressAllowlist: true,
    cue: "dammed",
  };
}

export function seedEgressAllowlist() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    dammed: true,
    egressAllowlist: true,
    put403: true,
    hostNeverReached: true,
    event: "egress-allowlist",
    cue: "dammed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    flowing: true,
    cue: "flowing",
  };
}

export function seedPut403() {
  return { seed: "put-403", preferSeed: true, put403: true, cue: "dammed" };
}

export function seedHostNeverReached() {
  return { seed: "host-never-reached", preferSeed: true, hostNeverReached: true, cue: "dammed" };
}

export function seedAllDomainsIgnored() {
  return { seed: "all-domains-ignored", preferSeed: true, allDomainsIgnored: true, cue: "dammed" };
}

export function seedAdditionalDomains() {
  return { seed: "additional-domains", preferSeed: true, additionalDomains: true, cue: "dammed" };
}

export function seedMcpProxyOk() {
  return { seed: "mcp-proxy-ok", preferSeed: true, mcpProxyOk: true, cue: "flowing" };
}

export function seedShipitUpdate() {
  return { seed: "shipit-update", preferSeed: true, shipitUpdate: true, cue: "dammed" };
}

export function seedVm266() {
  return { seed: "vm-2.1.266", preferSeed: true, vm266: true, cue: "dammed" };
}

export function seedRegression() {
  return { seed: "regression", preferSeed: true, regression: true, cue: "dammed" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      flowing: false,
      dammed: false,
      egressAllowlist: false,
      put403: false,
      hostNeverReached: false,
      allDomainsIgnored: false,
      additionalDomains: false,
      mcpProxyOk: false,
      shipitUpdate: false,
      vm266: false,
      regression: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    flowing: raw.flowing === true,
    dammed:
      raw.dammed === true ||
      raw.event === "dammed" ||
      raw.event === "weir",
    egressAllowlist: raw.egressAllowlist === true || raw.event === "egress-allowlist",
    put403: raw.put403 === true || raw.event === "put-403",
    hostNeverReached:
      raw.hostNeverReached === true || raw.event === "host-never-reached",
    allDomainsIgnored:
      raw.allDomainsIgnored === true || raw.event === "all-domains-ignored",
    additionalDomains:
      raw.additionalDomains === true || raw.event === "additional-domains",
    mcpProxyOk: raw.mcpProxyOk === true || raw.event === "mcp-proxy-ok",
    shipitUpdate: raw.shipitUpdate === true || raw.event === "shipit-update",
    vm266: raw.vm266 === true || raw.event === "vm-2.1.266",
    regression: raw.regression === true || raw.event === "regression",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    crest: raw.crest,
    race: raw.race,
    gates: raw.gates,
    millstone: raw.millstone,
    ledger: raw.ledger,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.flowing != null ||
        ticket.dammed != null ||
        ticket.egressAllowlist != null ||
        ticket.put403 != null ||
        ticket.hostNeverReached != null ||
        ticket.allDomainsIgnored != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.crest ||
        ticket.race ||
        ticket.gates),
  );
}

function isFlowing(row) {
  if (row.dammed && row.cue !== "flowing") return false;
  if (
    row.cue === "dammed" ||
    row.cue === "weir" ||
    row.cue === "egress-allowlist"
  ) {
    return false;
  }
  if (
    row.put403 &&
    row.hostNeverReached &&
    row.cue !== "flowing" &&
    row.flowing !== true
  ) {
    return false;
  }
  if (
    row.egressAllowlist &&
    row.put403 &&
    row.cue !== "flowing" &&
    row.flowing !== true
  ) {
    return false;
  }
  if (row.flowing === true && row.dammed !== true && row.cue !== "dammed") {
    return true;
  }
  if (
    row.cue === "flowing" &&
    row.dammed !== true &&
    row.put403 !== true &&
    row.egressAllowlist !== true
  ) {
    return true;
  }
  if (
    row.mcpProxyOk === true &&
    row.dammed !== true &&
    row.put403 !== true &&
    row.hostNeverReached !== true &&
    row.egressAllowlist !== true
  ) {
    return true;
  }
  return false;
}

function isEgressAllowlistPath(row) {
  return (
    row.event === "egress-allowlist" &&
    !isFlowing(row) &&
    (row.egressAllowlist === true || row.put403 === true || row.hostNeverReached === true)
  );
}

function isDammed(row) {
  if (isFlowing(row)) return false;
  if (isEgressAllowlistPath(row) && row.cue !== "dammed") return false;
  if (row.cue === "dammed" || row.cue === "weir") return true;
  if (row.dammed === true) return true;
  if (
    row.put403 === true &&
    row.hostNeverReached === true &&
    row.allDomainsIgnored === true
  ) {
    return true;
  }
  if (row.put403 === true && row.hostNeverReached === true) {
    return true;
  }
  if (
    row.put403 === true ||
    row.hostNeverReached === true ||
    row.allDomainsIgnored === true ||
    row.additionalDomains === true ||
    (row.egressAllowlist === true && row.mcpProxyOk === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one weir pass against the millrace booth.
 * flowing: additional domains / All domains admit the PUT; millrace open.
 * dammed / weir: 403 at egress; host never reached.
 * egress-allowlist: user flags no longer admit the sandbox PUT.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isEgressAllowlistPath(row) ||
    (row.egressAllowlist && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "egress-allowlist";
  } else if (isDammed(row)) {
    verdict = "weir";
  } else if (isFlowing(row)) {
    verdict = "flowing";
  } else if (
    row.put403 ||
    row.hostNeverReached ||
    row.allDomainsIgnored ||
    (row.egressAllowlist && !row.mcpProxyOk)
  ) {
    verdict = "weir";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const crest = inspectCrest(row);
  const race = inspectRace(row);
  const gates = inspectGates(row);
  const millstone = inspectMillstone(row);
  const ledger = inspectLedger(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    flowing: verdict === "flowing" || verdict === "hold",
    dammed:
      verdict === "dammed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    egressAllowlist:
      row.egressAllowlist === true ||
      verdict === "egress-allowlist" ||
      verdict === PATH_WORD,
    put403: row.put403,
    hostNeverReached: row.hostNeverReached,
    allDomainsIgnored: row.allDomainsIgnored,
    additionalDomains: row.additionalDomains,
    mcpProxyOk: row.mcpProxyOk,
    shipitUpdate: row.shipitUpdate,
    vm266: row.vm266,
    regression: row.regression,
    cue: hold
      ? "flowing"
      : row.egressAllowlist || verdict === "egress-allowlist"
        ? "egress-allowlist"
        : "dammed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit flowing" : "score weir",
    crestInspect: crest,
    raceInspect: race,
    gatesInspect: gates,
    millstoneInspect: millstone,
    ledgerInspect: ledger,
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
      : WEIR_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dammed = scored.filter(
    (row) => row.verdict === "weir" || row.verdict === "dammed",
  );
  const path = scored.filter((row) => row.verdict === "egress-allowlist");
  const flowing = scored.filter((row) => row.verdict === "flowing");
  const headline =
    scored.find((row) => row.event === "dammed") ||
    scored.find((row) => row.event === "egress-allowlist") ||
    scored.find((row) => row.event === "put-403") ||
    dammed[dammed.length - 1];
  let verdict = "flowing";
  if (dammed.length) verdict = "weir";
  else if (path.length && !flowing.length) verdict = "egress-allowlist";
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
    dammedCount: dammed.length,
    pathCount: path.length,
    flowingCount: flowing.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit flowing" : "score weir",
    note: headline
      ? "Cowork Desktop VM 2.1.266; sandbox PUT 403 at egress; host never reached; additional domains / All domains ignored; MCP proxy still returns request_upload_url."
      : "published weir walk scored against flowing vs dammed",
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
    seeded !== "flowing" &&
    seeded !== "dammed" &&
    seeded !== "egress-allowlist" &&
    seeded !== "weir" &&
    ticket.flowing == null &&
    ticket.dammed == null &&
    ticket.put403 == null &&
    ticket.egressAllowlist == null &&
    ticket.hostNeverReached == null &&
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
    flowing: scored.flowing ?? false,
    dammed: scored.dammed ?? false,
    egressAllowlist: scored.egressAllowlist ?? false,
    put403: scored.put403 ?? false,
    hostNeverReached: scored.hostNeverReached ?? false,
    allDomainsIgnored: scored.allDomainsIgnored ?? false,
    additionalDomains: scored.additionalDomains ?? false,
    mcpProxyOk: scored.mcpProxyOk ?? false,
    shipitUpdate: scored.shipitUpdate ?? false,
    vm266: scored.vm266 ?? false,
    regression: scored.regression ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.flowing && !result.dammed ? "crest=flowing" : "crest=weir",
    result.put403 || result.dammed ? "race=dry" : "race=wet",
    result.allDomainsIgnored || result.dammed ? "gates=rusted" : "gates=lifted",
    result.mcpProxyOk || result.dammed ? "millstone=proxy-ok" : "millstone=admitted",
    result.hostNeverReached || result.dammed ? "ledger=never-reached" : "ledger=arrived",
    result.egressAllowlist || result.verdict === "egress-allowlist"
      ? "path=egress-allowlist"
      : "path=flowing",
    result.cue === "flowing"
      ? "cue=flowing"
      : result.cue === "egress-allowlist"
        ? "cue=egress-allowlist"
        : "cue=dammed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    flowing: result.flowing,
    dammed: result.dammed,
    egressAllowlist: result.egressAllowlist,
    put403: result.put403,
    hostNeverReached: result.hostNeverReached,
    allDomainsIgnored: result.allDomainsIgnored,
    additionalDomains: result.additionalDomains,
    mcpProxyOk: result.mcpProxyOk,
    crest: input && input.crest,
    race: input && input.race,
    gates: input && input.gates,
    millstone: input && input.millstone,
    ledger: input && input.ledger,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    crest: inspectCrest({
      flowing: result.flowing,
      dammed: result.dammed,
      put403: result.put403,
      mcpProxyOk: result.mcpProxyOk,
      egressAllowlist: result.egressAllowlist,
      crest: input && input.crest,
    }),
    race: inspectRace({
      flowing: result.flowing,
      dammed: result.dammed,
      put403: result.put403,
      hostNeverReached: result.hostNeverReached,
      race: input && input.race,
    }),
    gates: inspectGates({
      flowing: result.flowing,
      dammed: result.dammed,
      allDomainsIgnored: result.allDomainsIgnored,
      additionalDomains: result.additionalDomains,
      gates: input && input.gates,
    }),
    millstone: inspectMillstone({
      flowing: result.flowing,
      dammed: result.dammed,
      mcpProxyOk: result.mcpProxyOk,
      put403: result.put403,
      millstone: input && input.millstone,
    }),
    ledger: inspectLedger({
      flowing: result.flowing,
      dammed: result.dammed,
      hostNeverReached: result.hostNeverReached,
      put403: result.put403,
      ledger: input && input.ledger,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      dammed:
        result.dammed === true ||
        result.verdict === "dammed" ||
        result.verdict === "weir",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      plan: PLAN,
      desktop: DESKTOP,
      vmBefore: VM_BEFORE,
      vmAfter: VM_AFTER,
      shipit: SHIPIT,
      vmFolder: VM_FOLDER,
      uploadBytes: UPLOAD_BYTES,
      egressCode: EGRESS_CODE,
      egressReason: EGRESS_REASON,
      commentIssue: COMMENT_ISSUE,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "With the host allow-listed (or Domain allowlist = All domains), the sandbox's outbound PUT should reach the custom-domain URL returned by request_upload_url, as it did on VM 2.1.260.",
      ],
      hypothesis:
        "NON-BINDING: user-level additional-domains / All-domains flags may no longer be written into the sandbox egress JWT/proxy after the 2.1.266 VM cut. Verify against #93589 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
