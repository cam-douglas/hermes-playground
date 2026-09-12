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
  CLAUDE_VERSION,
  COMMAND,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INSTALL_PATH,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RADIO_STRIPS,
  RULED_OUT,
  SAMPLE_CLEARED,
  SAMPLE_DOWNLINK,
  SAMPLE_NETWORKS,
  SAMPLE_SILENT,
  SAMPLE_SIMPLEXED_RIG,
  SAMPLE_UPLINK,
  SEEDED_WORD,
  SIMPLEX_WALK,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectClearedAppData,
  inspectDownlink,
  inspectDualNetwork,
  inspectQr,
  inspectSilentSend,
  inspectUplink,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedClearedAppData,
  seedDownlinkOk,
  seedDualNetwork,
  seedDuplex,
  seedHold,
  seedMobileUplinkSilent,
  seedSilentSend,
  seedSimplex,
  seedSimplexed,
  seedUplinkVanish,
} from "./simplex.mjs";

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
  return fileURLToPath(new URL("./simplex.mjs", import.meta.url));
}

test("idle duplex is a hold; both legs open; phone send reaches the CLI", () => {
  const result = analyze(seedDuplex());
  assert.equal(result.verdict, "duplex");
  assert.equal(result.idleWord, "duplex");
  assert.equal(IDLE_WORD, "duplex");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.duplex, true);
  assert.equal(result.phrase, "admit duplex");
  assert.equal(result.simplexed, false);
  assert.equal(result.mobileUplinkSilent, false);
  assert.ok(HOLD_ALIASES.includes("duplex"));
  assert.ok(HOLD_ALIASES.includes("two-way"));
  assert.ok(HOLD_ALIASES.includes("full-duplex"));
  assert.ok(HOLD_ALIASES.includes("both-ways"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify duplex", () => {
  assert.equal(classify(emptyTicket()), "duplex");
  assert.equal(classify(""), "duplex");
  assert.equal(classify(null), "duplex");
  assert.equal(decide({}), "duplex");
});

test("#93801 seeded path scores simplex when the mobile uplink never delivers", () => {
  const result = analyze(seedSimplexed());
  assert.equal(result.verdict, "simplex");
  assert.equal(result.seededWord, "simplexed");
  assert.equal(SEEDED_WORD, "simplexed");
  assert.equal(PRODUCT_WORD, "simplex");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.simplexed, true);
  assert.equal(result.phrase, "score simplex");
  assert.equal(result.mobileUplinkSilent, true);
  assert.equal(result.uplinkVanish, true);
  assert.equal(result.silentSend, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("uplink vanish plus silent send is the #93801 simplex", () => {
  const uplink = inspectUplink({ simplexed: true, uplinkVanish: true });
  assert.equal(uplink.stamp, "uplink-vanish");
  assert.equal(uplink.vanished, true);
  const scored = scoreGate({
    simplexed: true,
    mobileUplinkSilent: true,
    uplinkVanish: true,
    silentSend: true,
    downlinkOk: true,
    dualNetwork: true,
    clearedAppData: true,
    cue: "simplexed",
    uplink: SAMPLE_UPLINK,
    silent: SAMPLE_SILENT,
    networks: SAMPLE_NETWORKS,
  });
  assert.equal(scored.verdict, "simplex");
  assert.equal(scored.mobileUplinkSilent, true);
  const open = inspectUplink({ duplex: true, uplinkVanish: false });
  assert.equal(open.stamp, "uplink-open");
});

test("path word is mobile-uplink-silent; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "mobile-uplink-silent");
  const result = analyze(seedMobileUplinkSilent());
  assert.equal(result.verdict, "mobile-uplink-silent");
  assert.equal(result.pathWord, "mobile-uplink-silent");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "mobile-uplink-silent", preferSeed: true, simplexed: true }),
    "mobile-uplink-silent",
  );
  assert.equal(classify(seedUplinkVanish()), "uplink-vanish");
});

test("HOLD includes duplex / hold", () => {
  assert.ok(HOLD.includes("duplex"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: downlink-ok, uplink-vanish, silent-send, dual-network, cleared-app-data", () => {
  assert.equal(classify(seedDownlinkOk()), "downlink-ok");
  assert.equal(classify(seedUplinkVanish()), "uplink-vanish");
  assert.equal(classify(seedSilentSend()), "silent-send");
  assert.equal(classify(seedDualNetwork()), "dual-network");
  assert.equal(classify(seedClearedAppData()), "cleared-app-data");
  assert.equal(classify(seedSimplex()), "simplex");
});

test("booth fixtures flip duplex vs simplexed vs mobile-uplink-silent vs simplex", () => {
  const idle = scoreGate(seedDuplex());
  const seeded = scoreGate(seedSimplexed());
  const duplex = readData("duplex.json");
  const simplexed = readData("simplexed.json");
  const path = readData("mobile-uplink-silent.json");
  const product = readData("simplex.json");
  const vanish = readData("uplink-vanish.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "duplex");
  assert.equal(seeded.verdict, "simplex");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDuplex()), "duplex");
  assert.equal(score(seedSimplexed()), "simplex");
  assert.equal(duplex.uplinkVanish, false);
  assert.equal(duplex.duplex, true);
  assert.equal(scoreGate(duplex).verdict, "duplex");
  assert.equal(simplexed.mobileUplinkSilent, true);
  assert.equal(simplexed.uplinkVanish, true);
  assert.equal(simplexed.silentSend, true);
  assert.equal(classify(simplexed), "simplexed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /phone|CLI|desktop/i);
  assert.match(path.paths[1].result, /error|queued|pending|silent/i);
  assert.equal(classify(path), "mobile-uplink-silent");
  assert.equal(classify(product), "simplex");
  assert.equal(product.hubCount, "SIMPLEX");
  assert.equal(simplexed.issue, 93801);
  assert.equal(simplexed.simplexed, true);
  assert.equal(classify(vanish), "uplink-vanish");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("downlink-ok.json")), "downlink-ok");
  assert.equal(classify(readData("silent-send.json")), "silent-send");
  assert.equal(classify(readData("dual-network.json")), "dual-network");
  assert.equal(classify(readData("cleared-app-data.json")), "cleared-app-data");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("duplex"));
  assert.ok(CHIPS.includes("simplexed"));
  assert.ok(CHIPS.includes("simplex"));
  assert.ok(CHIPS.includes("mobile-uplink-silent"));
  assert.ok(CHIPS.includes("uplink-vanish"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("simplexed"));
  assert.ok(ALARM.includes("mobile-uplink-silent"));
  assert.ok(ALARM.includes("silent-send"));
  assert.ok(ALARM.includes("simplex"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published simplex walk scores simplex after the idle hold", () => {
  const booth = scoreWalk({ rows: SIMPLEX_WALK });
  assert.equal(booth.verdict, "simplex");
  assert.ok(booth.simplexedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-duplex");
  assert.equal(idle.duplex, true);
  assert.equal(idle.verdict, "duplex");
  const vanish = booth.rows.find((row) => row.event === "uplink-vanish");
  assert.equal(vanish.uplinkVanish, true);
  const path = booth.rows.find((row) => row.event === "mobile-uplink-silent" && row.t === "path");
  assert.equal(path.verdict, "mobile-uplink-silent");
});

test("SIMPLEX_WALK constant matches the issue radio walk", () => {
  assert.equal(SIMPLEX_WALK[0].event, "cue-duplex");
  const vanish = SIMPLEX_WALK.find((row) => row.event === "uplink-vanish");
  assert.equal(vanish.uplinkVanish, true);
  const path = SIMPLEX_WALK.find((row) => row.t === "path");
  assert.equal(path.simplexed, true);
  const scoreRow = SIMPLEX_WALK.find((row) => row.event === "simplex");
  assert.equal(scoreRow.simplexed, true);
});

test("positive control two-way stays duplex", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "duplex");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "duplex");
  const hold = walk.rows.find((row) => row.event === "cue-duplex");
  assert.equal(hold.duplex, true);
  assert.equal(hold.verdict, "duplex");
});

test("issue constants encode only #93801 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93801);
  assert.ok(ISSUE_URL.includes("93801"));
  assert.match(TITLE, /Remote Control|mobile|disappears|reading works/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(CLAUDE_VERSION, /2\.1\.236/);
  assert.match(GOOD_VERSION, /previous|worked previously/i);
  assert.match(SURFACE, /Windows|claude\.exe|5G|wifi/i);
  assert.match(HOST, /claude\.exe/);
  assert.match(INSTALL_PATH, /USERPROFILE|local\\bin/i);
  assert.equal(COMMAND, "claude remote-control");
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:windows",
    "area:claude-code-web",
    "area:cli",
  ]);
  assert.equal(RADIO_STRIPS.length, 4);
  assert.ok(RULED_OUT.some((row) => /62284/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /34619|45946/i.test(row)));
  assert.ok(EXPECTED.some((row) => /phone|CLI/i.test(row)));
  assert.match(DISTRIBUTION, /remote-control|disappears|restaurant wifi|5G|2\.1\.236|claude\.exe/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("mobile-uplink-silent"));
  assert.ok(FINGERPRINT_LINES.includes("simplexed"));
  assert.equal(PHRASE, "Score simplex or admit duplex.");
  assert.equal(SAMPLE_SIMPLEXED_RIG.uplinkOpen, false);
  assert.equal(SAMPLE_SILENT.silent, true);
  assert.equal(SAMPLE_DOWNLINK.desktopToPhone, true);
  assert.equal(SAMPLE_UPLINK.vanished, true);
  assert.equal(SAMPLE_NETWORKS.identicalVanish, true);
  assert.equal(SAMPLE_CLEARED.sameFailure, true);
});

test("has-repro fingerprints encode the published simplexed chassis", () => {
  const result = handle(seedSimplexed());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.surface, /2\.1\.236|claude\.exe|5G/);
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedSimplexed()),
    /simplex\|rx=lit\|tx=simplexed\|down=ok\|fail=silent\|path=mobile-uplink-silent\|cue=mobile-uplink-silent/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Deadkey, Gleaner, Schism, Rasure and Ashpan", () => {
  const required = [
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
    "changeling",
    "remote-reattach",
    "distinct",
    "collided",
    "homograph",
    "lossy-slug",
    "dry",
    "billed",
    "galley",
    "stop-dirty",
    "scraped",
    "rescript",
    "snapshot-write",
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
    "eidolon",
    "aphonia",
    "muzzle",
    "leaking",
    "excised",
    "carrier",
    "deadair",
    "squelch",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "oubliette",
    "ephemera",
    "mondegreen",
    "parergon",
    "guillotine",
    "flashpan",
    "clepsydra",
    "springe",
    "deadlight",
    "damper",
    "sounder",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("duplex booth flips simplexed back when both legs open", () => {
  const tape = {
    duplex: true,
    simplexed: false,
    uplinkVanish: false,
    cue: "duplex",
  };
  assert.equal(scoreGate(tape).verdict, "duplex");
  tape.duplex = false;
  tape.simplexed = true;
  tape.mobileUplinkSilent = true;
  tape.uplinkVanish = true;
  tape.silentSend = true;
  tape.cue = "simplexed";
  assert.equal(scoreGate(tape).verdict, "simplex");
  tape.duplex = true;
  tape.simplexed = false;
  tape.mobileUplinkSilent = false;
  tape.uplinkVanish = false;
  tape.silentSend = false;
  tape.cue = "duplex";
  assert.equal(scoreGate(tape).verdict, "duplex");
});

test("downlink, uplink, silent, dual-network, cleared, qr, and readBooth mark the simplexed chassis", () => {
  const idle = inspectUplink({
    duplex: true,
    uplink: { phoneToDesktop: true, arrivesOnCli: true, vanished: false },
  });
  assert.equal(idle.stamp, "uplink-open");
  const silent = inspectSilentSend({ simplexed: true, silent: SAMPLE_SILENT });
  assert.equal(silent.stamp, "silent-send");
  assert.equal(silent.silent, true);
  const down = inspectDownlink({
    downlinkOk: true,
    downlink: SAMPLE_DOWNLINK,
  });
  assert.equal(down.stamp, "downlink-ok");
  const nets = inspectDualNetwork({ simplexed: true, dualNetwork: true });
  assert.equal(nets.stamp, "dual-network");
  const wipe = inspectClearedAppData({ simplexed: true, clearedAppData: true });
  assert.equal(wipe.stamp, "cleared-app-data");
  const hatch = inspectQr({});
  assert.equal(hatch.stamp, "qr-linked");
  const booth = readBooth({
    simplexed: true,
    uplinkVanish: true,
    uplink: SAMPLE_UPLINK,
    silent: SAMPLE_SILENT,
  });
  assert.equal(booth.simplexed, true);
  assert.equal(booth.mark, "simplexed");
  const open = readBooth({
    duplex: true,
    simplexed: false,
    uplinkVanish: false,
  });
  assert.equal(open.simplexed, false);
  assert.equal(open.mark, "duplex");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 62284);
  assert.equal(COUSINS[1].issue, 34619);
  assert.equal(COUSINS[2].issue, 45946);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /62284|antivirus|rebuild/i);
  assert.match(COUSINS[1].why, /34619|rebuild/i);
  assert.match(COUSINS[2].why, /45946|rebuild/i);
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("necrology"));
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93798);
  assert.equal(BACKUPS[1].issue, 93786);
  assert.equal(BACKUPS[2].issue, 93778);
  assert.equal(BACKUPS[3].issue, 93766);
  assert.equal(BACKUPS[4].issue, 93764);
  assert.equal(BACKUPS[5].issue, 93754);
  assert.equal(BACKUPS[6].issue, 93751);
  assert.equal(BACKUPS[7].issue, 93744);
  assert.equal(BACKUPS[8].issue, 93772);
  assert.equal(BACKUPS[9].issue, 93770);
  assert.equal(BACKUPS[10].issue, 93777);
  assert.equal(BACKUPS[11].issue, 93782);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/simplexed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const duplexFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/duplex.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(duplexFix.status, 0, duplexFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "duplex");
  assert.equal(JSON.parse(seeded.stdout).verdict, "simplexed");
  assert.equal(JSON.parse(duplexFix.stdout).verdict, "duplex");
});

test("handle exposes published hypothesis and #93801 headline", () => {
  const result = handle(seedSimplexed());
  assert.equal(result.published.issue, 93801);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [62284, 34619, 45946]);
  assert.ok(result.published.backups.includes(93798));
  assert.ok(result.published.backups.includes(93786));
  assert.ok(result.published.backups.includes(93778));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(!result.published.backups.includes(93801));
  assert.ok(!result.published.backups.includes(62284));
  assert.match(result.published.hypothesis, /uplink|mobile|downlink|silent/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93801/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a military/ham radio simplex booth, not deadkey or deadair", () => {
  const page = readPage();
  assert.match(page, /Russo One|Russo\+One/);
  assert.match(page, /Sora/);
  assert.match(page, /Fira Code|Fira\+Code/);
  assert.match(page, /simplex|simplexed|mobile-uplink-silent|half-duplex|radio/i);
  assert.match(page, /#041018|#0B1A2E|#4CFF9A|#F5A623|#161A20|#071422|#2A3340/i);
  assert.match(page, /\bduplex\b/);
  assert.match(page, /\bsimplexed\b/);
  assert.match(page, /mobile-uplink-silent/);
  assert.match(page, /Score simplex or admit duplex/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#316/);
  assert.match(page, /#93801/);
  assert.match(page, /Admit duplex/);
  assert.match(page, /Score simplex/);
  assert.match(page, /Walk mobile-uplink-silent/);
  assert.match(page, /Compare duplex \/ simplexed/);
  assert.match(page, /Pin idle duplex/);
  assert.match(page, /Pin seeded simplexed/);
  assert.match(page, /Pin mobile-uplink-silent/);
  assert.match(page, /Hold the duplex/);
  assert.match(page, /claude remote-control|QR|restaurant wifi|5G|2\.1\.236|claude\.exe/i);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Bodoni Moda|Bodoni\+Moda/);
  assert.doesNotMatch(page, /Crimson Pro|Crimson\+Pro/);
  assert.doesNotMatch(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Share Tech Mono|Share\+Tech\+Mono/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /#0A0908/);
  assert.doesNotMatch(page, /#F5EFE3/);
  assert.doesNotMatch(page, /#9C2F2A/);
  assert.doesNotMatch(page, /#B8924A/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /#e8a317/);
  assert.doesNotMatch(page, /#6ee87a/);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /\bkeyed\b/);
  assert.doesNotMatch(page, /\bdeadkeyed\b/);
  assert.doesNotMatch(page, /esc-csi-dead/);
  assert.doesNotMatch(page, /\bgleaned\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /unreaped-ampersand/);
  assert.doesNotMatch(page, /\bschismed\b/);
  assert.doesNotMatch(page, /resume-while-live/);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Outrider/i);
  assert.match(page, /NOT Dead Air/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Simplex/);
  assert.match(readme, /#93801/);
  assert.match(readme, /\bduplex\b/);
  assert.match(readme, /\bsimplexed\b/);
  assert.match(readme, /mobile-uplink-silent/);
  assert.match(readme, /Russo One/);
  assert.match(readme, /Sora/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Outrider/i);
  assert.match(readme, /NOT Dead Air/i);
  assert.match(readme, /#62284|#34619|#45946/);
  assert.match(readme, /remote-control|QR|restaurant wifi|5G|2\.1\.236|claude\.exe/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/simplex/);
  assert.match(readme, /node --test projects\/simplex\/simplex\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /simplex|half-duplex|radio|uplink/i);
  assert.match(readme, /Score simplex or admit duplex/);
  assert.match(readme, /#93798|#93786|#93778|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782/);
  assert.match(readme, /22:50/);
});

test("catalog features Simplex only; Deadkey, Gleaner, Schism, Rasure and Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 316);
  assert.equal(hub.products.length, 316);
  assert.equal(catalog.products[0].name, "Simplex");
  assert.equal(catalog.products[0].slug, "simplex");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/simplex/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /22:50 simplex|#93801|radio simplex|half-duplex/i);
  assert.match(catalog.products[0].summary, /\bduplex\b/);
  assert.match(catalog.products[0].summary, /\bsimplexed\b/);
  assert.match(catalog.products[0].summary, /mobile-uplink-silent/);
  assert.match(catalog.products[0].summary, /Score simplex or admit duplex/);
  assert.equal(hub.products[0].slug, "simplex");
  assert.equal(hub.products[0].featured, true);
  const deadkey = catalog.products.find((row) => row.slug === "deadkey");
  assert.ok(deadkey);
  assert.equal(deadkey.featured, false);
  const gleaner = catalog.products.find((row) => row.slug === "gleaner");
  assert.ok(gleaner);
  assert.equal(gleaner.featured, false);
  const schism = catalog.products.find((row) => row.slug === "schism");
  assert.ok(schism);
  assert.equal(schism.featured, false);
  const rasure = catalog.products.find((row) => row.slug === "rasure");
  assert.ok(rasure);
  assert.equal(rasure.featured, false);
  const ashpan = catalog.products.find((row) => row.slug === "ashpan");
  assert.ok(ashpan);
  assert.equal(ashpan.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "simplex").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93801") && row.slug !== "simplex"));
});

test("vercel rewrites simplex to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/simplex");
  assert.equal(vercel.rewrites[0].destination, "/projects/simplex");
  assert.equal(vercel.rewrites[1].source, "/simplex/");
  assert.equal(vercel.rewrites[1].destination, "/projects/simplex");
  assert.equal(vercel.rewrites[2].source, "/simplex/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/simplex/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
