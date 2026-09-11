import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  COMMENT_ISSUE,
  COUSINS,
  DESKTOP,
  DISTRIBUTION,
  EGRESS_CODE,
  EGRESS_REASON,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLAN,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  SAMPLE_CREST,
  SAMPLE_GATES,
  SAMPLE_LEDGER,
  SAMPLE_MILLSTONE,
  SAMPLE_RACE,
  SEEDED_WORD,
  SESSION_KIND,
  SHIPIT,
  STATE,
  TITLE,
  UPLOAD_BYTES,
  VERDICTS,
  VM_AFTER,
  VM_BEFORE,
  VM_FOLDER,
  WEIR_WALK,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCrest,
  inspectGates,
  inspectLedger,
  inspectMillstone,
  inspectRace,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAdditionalDomains,
  seedAllDomainsIgnored,
  seedDammed,
  seedEgressAllowlist,
  seedFlowing,
  seedHold,
  seedHostNeverReached,
  seedMcpProxyOk,
  seedPut403,
  seedRegression,
  seedShipitUpdate,
  seedVm266,
  seedWeir,
} from "./weir.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function readHubCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../hub/catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./weir.mjs", import.meta.url));
}

test("idle flowing is a hold; additional domains / All domains admit the PUT", () => {
  const result = analyze(seedFlowing());
  assert.equal(result.verdict, "flowing");
  assert.equal(result.idleWord, "flowing");
  assert.equal(IDLE_WORD, "flowing");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.flowing, true);
  assert.equal(result.phrase, "admit flowing");
  assert.equal(result.dammed, false);
  assert.equal(result.egressAllowlist, false);
  assert.equal(result.mcpProxyOk, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify flowing", () => {
  assert.equal(classify(emptyTicket()), "flowing");
  assert.equal(classify(""), "flowing");
  assert.equal(classify(null), "flowing");
  assert.equal(decide({}), "flowing");
});

test("#93589 seeded path scores weir when the millrace stays dry", () => {
  const result = analyze(seedDammed());
  assert.equal(result.verdict, "weir");
  assert.equal(result.seededWord, "dammed");
  assert.equal(SEEDED_WORD, "dammed");
  assert.equal(PRODUCT_WORD, "weir");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.dammed, true);
  assert.equal(result.phrase, "score weir");
  assert.equal(result.put403, true);
  assert.equal(result.hostNeverReached, true);
  assert.equal(result.allDomainsIgnored, true);
  assert.equal(result.egressAllowlist, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("PUT 403 plus host-never-reached is the #93589 weir", () => {
  const crest = inspectCrest({ dammed: true, put403: true });
  assert.equal(crest.stamp, "weir");
  assert.equal(crest.metering, false);
  const scored = scoreGate({
    dammed: true,
    put403: true,
    hostNeverReached: true,
    allDomainsIgnored: true,
    additionalDomains: true,
    mcpProxyOk: true,
    egressAllowlist: true,
    cue: "dammed",
    crest: SAMPLE_CREST,
    race: SAMPLE_RACE,
  });
  assert.equal(scored.verdict, "weir");
  assert.equal(scored.egressAllowlist, true);
  const open = inspectCrest({ flowing: true, mcpProxyOk: true });
  assert.equal(open.stamp, "flowing");
});

test("path word is egress-allowlist; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "egress-allowlist");
  const result = analyze(seedEgressAllowlist());
  assert.equal(result.verdict, "egress-allowlist");
  assert.equal(result.pathWord, "egress-allowlist");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "egress-allowlist", preferSeed: true, dammed: true }),
    "egress-allowlist",
  );
  assert.equal(classify(seedPut403()), "put-403");
});

test("HOLD includes flowing / hold", () => {
  assert.ok(HOLD.includes("flowing"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: put-403, host-never-reached, all-domains-ignored, additional-domains", () => {
  assert.equal(classify(seedPut403()), "put-403");
  assert.equal(classify(seedHostNeverReached()), "host-never-reached");
  assert.equal(classify(seedAllDomainsIgnored()), "all-domains-ignored");
  assert.equal(classify(seedAdditionalDomains()), "additional-domains");
  assert.equal(classify(seedMcpProxyOk()), "mcp-proxy-ok");
  assert.equal(classify(seedShipitUpdate()), "shipit-update");
  assert.equal(classify(seedVm266()), "vm-2.1.266");
  assert.equal(classify(seedRegression()), "regression");
  assert.equal(classify(seedWeir()), "weir");
});

test("booth fixtures flip flowing vs dammed vs egress-allowlist vs weir", () => {
  const idle = scoreGate(seedFlowing());
  const seeded = scoreGate(seedDammed());
  const flowing = readData("flowing.json");
  const dammed = readData("dammed.json");
  const path = readData("egress-allowlist.json");
  const product = readData("weir.json");
  const put = readData("put-403.json");
  const host = readData("host-never-reached.json");
  const all = readData("all-domains-ignored.json");
  const extra = readData("additional-domains.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "flowing");
  assert.equal(seeded.verdict, "weir");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedFlowing()), "flowing");
  assert.equal(score(seedDammed()), "weir");
  assert.equal(flowing.mcpProxyOk, true);
  assert.equal(flowing.flowing, true);
  assert.equal(scoreGate(flowing).verdict, "flowing");
  assert.equal(dammed.put403, true);
  assert.equal(dammed.hostNeverReached, true);
  assert.equal(dammed.allDomainsIgnored, true);
  assert.equal(classify(dammed), "dammed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /Additional allowed domains|All domains|egress/i);
  assert.match(path.paths[1].result, /403|host_not_allowed|never/i);
  assert.equal(classify(path), "egress-allowlist");
  assert.equal(classify(product), "weir");
  assert.equal(product.hubCount, "WEIR");
  assert.equal(dammed.issue, 93589);
  assert.equal(dammed.dammed, true);
  assert.equal(classify(put), "put-403");
  assert.equal(classify(host), "host-never-reached");
  assert.equal(classify(all), "all-domains-ignored");
  assert.equal(classify(extra), "additional-domains");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("flowing"));
  assert.ok(CHIPS.includes("dammed"));
  assert.ok(CHIPS.includes("weir"));
  assert.ok(CHIPS.includes("egress-allowlist"));
  assert.ok(CHIPS.includes("put-403"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("dammed"));
  assert.ok(ALARM.includes("egress-allowlist"));
  assert.ok(ALARM.includes("put-403"));
  assert.ok(ALARM.includes("weir"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published weir walk scores weir after the idle hold", () => {
  const booth = scoreWalk({ rows: WEIR_WALK });
  assert.equal(booth.verdict, "weir");
  assert.ok(booth.dammedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-flowing");
  assert.equal(idle.flowing, true);
  assert.equal(idle.verdict, "flowing");
  const put = booth.rows.find((row) => row.event === "put-403");
  assert.equal(put.put403, true);
  const path = booth.rows.find((row) => row.event === "egress-allowlist");
  assert.equal(path.verdict, "egress-allowlist");
});

test("WEIR_WALK constant matches the issue egress walk", () => {
  assert.equal(WEIR_WALK[0].event, "cue-flowing");
  const put = WEIR_WALK.find((row) => row.event === "put-403");
  assert.equal(put.put403, true);
  const path = WEIR_WALK.find((row) => row.event === "egress-allowlist");
  assert.equal(path.dammed, true);
  const scoreRow = WEIR_WALK.find((row) => row.event === "weir");
  assert.equal(scoreRow.dammed, true);
});

test("positive control mcp-proxy-ok stays flowing", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "flowing");
  const ok = walk.rows.find((row) => row.event === "mcp-proxy-ok");
  assert.equal(ok.verdict, "flowing");
  const hold = walk.rows.find((row) => row.event === "cue-flowing");
  assert.equal(hold.flowing, true);
  assert.equal(hold.verdict, "flowing");
});

test("issue constants encode only #93589 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93589);
  assert.ok(ISSUE_URL.includes("93589"));
  assert.match(TITLE, /Additional allowed domains/i);
  assert.match(TITLE, /All domains/);
  assert.match(TITLE, /2\.1\.266/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(LABELS.includes("area:networking"));
  assert.ok(LABELS.includes("area:sandbox"));
  assert.equal(PLATFORM, "macOS");
  assert.equal(PLAN, "Individual Pro");
  assert.equal(DESKTOP, "1.52386.0");
  assert.equal(VM_BEFORE, "2.1.260");
  assert.equal(VM_AFTER, "2.1.266");
  assert.match(SHIPIT, /2026-09-11 02:36:50/);
  assert.match(VM_FOLDER, /02:37/);
  assert.equal(UPLOAD_BYTES, 14641);
  assert.equal(EGRESS_CODE, 403);
  assert.equal(EGRESS_REASON, "host_not_allowed");
  assert.equal(COMMENT_ISSUE, 93525);
  assert.match(DISTRIBUTION, /host_not_allowed/);
  assert.match(SESSION_KIND, /2\.1\.260/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("egress-allowlist"));
  assert.ok(FINGERPRINT_LINES.includes("dammed"));
  assert.match(PHRASE, /Score weir or admit flowing/);
  assert.equal(SAMPLE_CREST.shut, true);
  assert.equal(SAMPLE_RACE.dry, true);
  assert.equal(SAMPLE_GATES.rusted, true);
  assert.equal(SAMPLE_MILLSTONE.proxyOk, true);
  assert.equal(SAMPLE_LEDGER.hostReached, false);
});

test("has-repro fingerprints encode the published egress 403", () => {
  const result = handle(seedDammed());
  assert.equal(result.published.egressCode, 403);
  assert.match(result.published.sessionKind, /2\.1\.266/);
  assert.match(result.published.desktop, /1\.52386\.0/);
  assert.match(
    fingerprint(seedDammed()),
    /weir\|crest=weir\|race=dry\|gates=rusted\|millstone=proxy-ok\|ledger=never-reached\|path=egress-allowlist\|cue=egress-allowlist/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Irons and Cathead", () => {
  const required = [
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
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
    "primed",
    "flashed",
    "mirage",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("flowing booth flips dammed back when the race admits the PUT", () => {
  const tape = {
    flowing: true,
    dammed: false,
    mcpProxyOk: true,
    cue: "flowing",
  };
  assert.equal(scoreGate(tape).verdict, "flowing");
  tape.flowing = false;
  tape.dammed = true;
  tape.put403 = true;
  tape.hostNeverReached = true;
  tape.allDomainsIgnored = true;
  tape.cue = "dammed";
  assert.equal(scoreGate(tape).verdict, "weir");
  tape.flowing = true;
  tape.dammed = false;
  tape.put403 = false;
  tape.hostNeverReached = false;
  tape.allDomainsIgnored = false;
  tape.cue = "flowing";
  assert.equal(scoreGate(tape).verdict, "flowing");
});

test("crest, race, gates, millstone, ledger, and readBooth mark the 403", () => {
  const idle = inspectCrest({
    flowing: true,
    mcpProxyOk: true,
    crest: { shut: false, metering: true },
  });
  assert.equal(idle.stamp, "flowing");
  const race = inspectRace({ dammed: true, race: SAMPLE_RACE });
  assert.equal(race.stamp, "dry");
  assert.equal(race.wet, false);
  const gates = inspectGates({
    allDomainsIgnored: true,
    gates: SAMPLE_GATES,
  });
  assert.equal(gates.stamp, "rusted");
  const millstone = inspectMillstone({ dammed: true, mcpProxyOk: true, millstone: SAMPLE_MILLSTONE });
  assert.equal(millstone.stamp, "proxy-only");
  assert.equal(millstone.proxyOk, true);
  const ledger = inspectLedger({ dammed: true, hostNeverReached: true });
  assert.equal(ledger.stamp, "never-reached");
  const booth = readBooth({
    dammed: true,
    put403: true,
    hostNeverReached: true,
    crest: SAMPLE_CREST,
    race: SAMPLE_RACE,
  });
  assert.equal(booth.dammed, true);
  assert.equal(booth.mark, "dammed");
  const open = readBooth({
    flowing: true,
    dammed: false,
    mcpProxyOk: true,
  });
  assert.equal(open.dammed, false);
  assert.equal(open.mark, "flowing");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 51400);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /51400|additional-domain/i);
  assert.equal(COUSINS[2].issue, 93525);
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("sluice"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("hangfire"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93570);
  assert.equal(BACKUPS[1].issue, 93618);
  assert.equal(BACKUPS[2].issue, 93622);
  assert.equal(BACKUPS[3].issue, 93652);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /shutdown/);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/dammed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "flowing");
  assert.equal(JSON.parse(seeded.stdout).verdict, "dammed");
});

test("handle exposes published hypothesis and #93589 headline", () => {
  const result = handle(seedDammed());
  assert.equal(result.published.issue, 93589);
  assert.equal(result.published.egressCode, 403);
  assert.deepEqual(result.published.cousins, [
    51400, 34690, 93525, 38984, 30112, 63182,
  ]);
  assert.ok(result.published.backups.includes(93570));
  assert.ok(result.published.backups.includes(93652));
  assert.match(result.published.hypothesis, /additional-domains|All-domains|JWT|proxy/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /2\.1\.266/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a mill weir / millrace booth, not irons or sluice", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Manrope/);
  assert.match(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.match(page, /weir crest|millrace|rust gates|millstone|miller/i);
  assert.match(page, /#2C2A26|#3A6B7A|#E7F0F2|#4F6F52|#8C4A3A|#C4922A|#F4F1EA/i);
  assert.match(page, /\bflowing\b/);
  assert.match(page, /\bdammed\b/);
  assert.match(page, /egress-allowlist/);
  assert.match(page, /Score weir or admit flowing/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /03:50/);
  assert.match(page, /#298/);
  assert.match(page, /#93589/);
  assert.match(page, /Open the race/);
  assert.match(page, /Score weir/);
  assert.match(page, /Lift the gates/);
  assert.match(page, /Compare flowing \/ dammed/);
  assert.match(page, /Pin idle flowing/);
  assert.match(page, /Pin seeded dammed/);
  assert.match(page, /Pin egress-allowlist/);
  assert.match(page, /Hold the flowing/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /\bHind\b/);
  assert.doesNotMatch(page, /Fira Mono|Fira\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /#0A1628/);
  assert.doesNotMatch(page, /#E8F1F8/);
  assert.doesNotMatch(page, /#E0A100/);
  assert.doesNotMatch(page, /#1F6F5B/);
  assert.doesNotMatch(page, /#8B3A2A/);
  assert.doesNotMatch(page, /#071828/);
  assert.doesNotMatch(page, /#9A6B3A/);
  assert.doesNotMatch(page, /#E23B3B/);
  assert.doesNotMatch(page, /#3BBFA0/);
  assert.doesNotMatch(page, /#D6B15A/);
  assert.doesNotMatch(page, /#12100E/);
  assert.doesNotMatch(page, /#1C1A17/);
  assert.doesNotMatch(page, /#E8E0D0/);
  assert.doesNotMatch(page, /#C4A35A/);
  assert.doesNotMatch(page, /#B83A3A/);
  assert.doesNotMatch(page, /#3A8F7A/);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /manuscript speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|flash without discharge/i);
  assert.doesNotMatch(page, /heat-haze|false oasis|dispatch acknowledged/i);
  assert.doesNotMatch(page, /castle sluice|portcullis grate|postern wicket/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /cron-websearch/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /ptmx-race/);
  assert.doesNotMatch(page, /\btip\b/);
  assert.doesNotMatch(page, /\bstale\b/);
  assert.doesNotMatch(page, /prewarm-latch/);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Sluice/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Hangfire/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Weir/);
  assert.match(readme, /#93589/);
  assert.match(readme, /\bflowing\b/);
  assert.match(readme, /\bdammed\b/);
  assert.match(readme, /egress-allowlist/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Sluice/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Mirage/i);
  assert.match(readme, /NOT Hangfire/i);
  assert.match(readme, /#51400|#34690|#93525/);
  assert.match(readme, /host_not_allowed|403|All domains/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/weir/);
  assert.match(readme, /node --test projects\/weir\/weir\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /weir crest|millrace|rust gates|millstone/i);
  assert.match(readme, /Score weir or admit flowing/);
  assert.match(readme, /#93570|#93618|#93622|#93652/);
});

test("catalog lists Weir unfeatured after Followspot", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 300);
  assert.equal(hub.products.length, 300);
  assert.equal(catalog.products[0].name, "Followspot");
  assert.equal(catalog.products[0].slug, "followspot");
  assert.equal(catalog.products[0].featured, true);
  const weir = catalog.products.find((row) => row.slug === "weir");
  assert.ok(weir);
  assert.equal(weir.featured, false);
  assert.equal(weir.href, "/weir/");
  assert.equal(weir.day, "2026-09-12");
  assert.match(weir.summary, /03:50/);
  assert.match(weir.summary, /weir/);
  assert.match(weir.summary, /#93589/);
  assert.match(weir.summary, /\bflowing\b/);
  assert.match(weir.summary, /\bdammed\b/);
  assert.match(weir.summary, /egress-allowlist/);
  const hubWeir = hub.products.find((row) => row.slug === "weir");
  assert.ok(hubWeir);
  assert.equal(hubWeir.featured, false);
  const irons = catalog.products.find((row) => row.slug === "irons");
  assert.ok(irons);
  assert.equal(irons.featured, false);
  const cathead = catalog.products.find((row) => row.slug === "cathead");
  assert.ok(cathead);
  assert.equal(cathead.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "weir").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93589") && row.slug !== "weir"));
});

test("vercel still rewrites weir to the project folder", () => {
  const vercel = readVercel();
  const sources = vercel.rewrites.filter((row) => String(row.source || "").startsWith("/weir"));
  assert.equal(sources[0].source, "/weir");
  assert.equal(sources[0].destination, "/projects/weir");
  assert.equal(sources[1].source, "/weir/");
  assert.equal(sources[1].destination, "/projects/weir");
  assert.equal(sources[2].source, "/weir/:path*");
  assert.equal(sources[2].destination, "/projects/weir/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
