import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AIRLOCK_WALK,
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
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  HTTP_PORT,
  IDLE_WORD,
  INSTALL_PATH,
  ISSUE_URL,
  LABELS,
  LISTEN_MAX_MS,
  LISTEN_MIN_MS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PROBE_FAILS,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_BLOWN_LOCK,
  SAMPLE_FIRST_CALL_REFUSED,
  SAMPLE_HTTP_BRIDGE,
  SAMPLE_NO_WAIT,
  SAMPLE_SOCAT_SCRIPT,
  SAMPLE_SOCKS_BRIDGE,
  SEEDED_WORD,
  SHELL_READY_MS,
  SOCKS_PORT,
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
  inspectBindWait,
  inspectBridges,
  inspectFirstCall,
  mapPressure,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBlown,
  seedEqualized,
  seedFirstCallRefused,
  seedHold,
  seedAirlock,
  seedNoWaitBind,
  seedSocatRace,
} from "./airlock.mjs";

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
  return fileURLToPath(new URL("./airlock.mjs", import.meta.url));
}

test("idle equalized is a hold; bridges listening before command", () => {
  const result = analyze(seedEqualized());
  assert.equal(result.verdict, "equalized");
  assert.equal(result.idleWord, "equalized");
  assert.equal(IDLE_WORD, "equalized");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.equalized, true);
  assert.equal(result.phrase, "admit equalized");
  assert.equal(result.blown, false);
  assert.equal(result.socatRace, false);
  assert.ok(HOLD_ALIASES.includes("equalized"));
  assert.ok(HOLD_ALIASES.includes("bridges-ready"));
  assert.ok(HOLD_ALIASES.includes("listeners-bound"));
  assert.ok(HOLD_ALIASES.includes("hatch-sealed"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify equalized", () => {
  assert.equal(classify(emptyTicket()), "equalized");
  assert.equal(classify(""), "equalized");
  assert.equal(classify(null), "equalized");
  assert.equal(decide({}), "equalized");
});

test("#93862 seeded path scores airlock when the lock is blown", () => {
  const result = analyze(seedBlown());
  assert.equal(result.verdict, "airlock");
  assert.equal(result.seededWord, "blown");
  assert.equal(SEEDED_WORD, "blown");
  assert.equal(PRODUCT_WORD, "airlock");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.blown, true);
  assert.equal(result.phrase, "score airlock");
  assert.equal(result.socatRace, true);
  assert.equal(result.noWaitBind, true);
  assert.equal(result.firstCallRefused, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("no-wait-bind plus first-call refuse is the #93862 airlock", () => {
  const wait = inspectBindWait({ blown: true, noWaitBind: true });
  assert.equal(wait.stamp, "no-wait-bind");
  assert.equal(wait.waitsForBind, false);
  const scored = scoreGate({
    blown: true,
    socatRace: true,
    noWaitBind: true,
    firstCallRefused: true,
    listenLatency: true,
    cue: "blown",
    wait: SAMPLE_NO_WAIT,
    firstCall: SAMPLE_FIRST_CALL_REFUSED,
  });
  assert.equal(scored.verdict, "airlock");
  assert.equal(scored.socatRace, true);
  const open = inspectBindWait({ equalized: true, noWaitBind: false });
  assert.equal(open.stamp, "listeners-bound");
});

test("path word is socat-race; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "socat-race");
  const result = analyze(seedSocatRace());
  assert.equal(result.verdict, "socat-race");
  assert.equal(result.pathWord, "socat-race");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "socat-race", preferSeed: true, blown: true }),
    "socat-race",
  );
  assert.equal(classify(seedNoWaitBind()), "no-wait-bind");
});

test("HOLD includes equalized / hold", () => {
  assert.ok(HOLD.includes("equalized"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: no-wait-bind, first-call-refused, later-call-ok", () => {
  assert.equal(classify(seedNoWaitBind()), "no-wait-bind");
  assert.equal(classify(seedFirstCallRefused()), "first-call-refused");
  assert.equal(classify(seedAirlock()), "airlock");
});

test("booth fixtures flip equalized vs blown vs socat-race vs airlock", () => {
  const idle = scoreGate(seedEqualized());
  const seeded = scoreGate(seedBlown());
  const equalized = readData("equalized.json");
  const blown = readData("blown.json");
  const path = readData("socat-race.json");
  const product = readData("airlock.json");
  const noWait = readData("no-wait-bind.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "equalized");
  assert.equal(seeded.verdict, "airlock");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedEqualized()), "equalized");
  assert.equal(score(seedBlown()), "airlock");
  assert.equal(equalized.noWaitBind, false);
  assert.equal(equalized.equalized, true);
  assert.equal(scoreGate(equalized).verdict, "equalized");
  assert.equal(blown.socatRace, true);
  assert.equal(blown.noWaitBind, true);
  assert.equal(blown.firstCallRefused, true);
  assert.equal(classify(blown), "blown");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /socat|listen|3128|wait|bind/i);
  assert.match(path.paths[1].result, /refused|3128|first|0 ms/i);
  assert.equal(classify(path), "socat-race");
  assert.equal(classify(product), "airlock");
  assert.equal(product.hubCount, "AIRLOCK");
  assert.equal(blown.issue, 93862);
  assert.equal(blown.blown, true);
  assert.equal(classify(noWait), "no-wait-bind");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("first-call-refused.json")), "first-call-refused");
  assert.equal(classify(readData("later-call-ok.json")), "later-call-ok");
  assert.equal(classify(readData("listen-latency.json")), "listen-latency");
  assert.equal(classify(readData("bridge-http.json")), "bridge-http");
  assert.equal(classify(readData("bridge-socks.json")), "bridge-socks");
  assert.equal(classify(readData("bridges-ready.json")), "bridges-ready");
  assert.equal(classify(readData("listeners-bound.json")), "listeners-bound");
  assert.equal(classify(readData("hatch-sealed.json")), "hatch-sealed");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  const http = readData("bridge-http.json");
  assert.equal(http.bridgeHttp, true);
  const socks = readData("bridge-socks.json");
  assert.equal(socks.bridgeSocks, true);
  const latency = readData("listen-latency.json");
  assert.equal(latency.listenLatency, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("equalized"));
  assert.ok(CHIPS.includes("blown"));
  assert.ok(CHIPS.includes("airlock"));
  assert.ok(CHIPS.includes("socat-race"));
  assert.ok(CHIPS.includes("no-wait-bind"));
  assert.ok(CHIPS.includes("first-call-refused"));
  assert.ok(CHIPS.includes("later-call-ok"));
  assert.ok(CHIPS.includes("listen-latency"));
  assert.ok(CHIPS.includes("bridge-http"));
  assert.ok(CHIPS.includes("bridge-socks"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("blown"));
  assert.ok(ALARM.includes("socat-race"));
  assert.ok(ALARM.includes("no-wait-bind"));
  assert.ok(ALARM.includes("airlock"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published airlock walk scores airlock after the idle hold", () => {
  const booth = scoreWalk({ rows: AIRLOCK_WALK });
  assert.equal(booth.verdict, "airlock");
  assert.ok(booth.blownCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-equalized");
  assert.equal(idle.equalized, true);
  assert.equal(idle.verdict, "equalized");
  const lie = booth.rows.find((row) => row.event === "no-wait-bind");
  assert.equal(lie.noWaitBind, true);
  const path = booth.rows.find((row) => row.event === "socat-race" && row.t === "path");
  assert.equal(path.verdict, "socat-race");
});

test("AIRLOCK_WALK constant matches the issue lock walk", () => {
  assert.equal(AIRLOCK_WALK[0].event, "cue-equalized");
  const lie = AIRLOCK_WALK.find((row) => row.event === "no-wait-bind");
  assert.equal(lie.noWaitBind, true);
  const path = AIRLOCK_WALK.find((row) => row.t === "path");
  assert.equal(path.blown, true);
  const scoreRow = AIRLOCK_WALK.find((row) => row.event === "airlock");
  assert.equal(scoreRow.blown, true);
});

test("positive control ready bridges stay equalized", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "equalized");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "equalized");
  const hold = walk.rows.find((row) => row.event === "cue-equalized");
  assert.equal(hold.equalized, true);
  assert.equal(hold.verdict, "equalized");
});

test("issue constants encode only #93862 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93862);
  assert.ok(ISSUE_URL.includes("93862"));
  assert.match(TITLE, /socat|sandbox|first network|WSL2|Linux/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "linux-wsl2");
  assert.match(CLAUDE_VERSION, /2\.1\.269/);
  assert.match(GOOD_VERSION, /3128|1080|wait|listen|git|curl/i);
  assert.equal(SURFACE, "bash-sandbox-socat");
  assert.equal(HOST, "wsl2-nixos");
  assert.match(INSTALL_PATH, /bwrap|sandbox|2\.1\.269/i);
  assert.match(COMMAND, /git ls-remote|github/i);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:linux",
    "platform:wsl",
    "area:sandbox",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /62743|stale/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /later|succeed|15–30|15-30/i.test(row)));
  assert.ok(EXPECTED.some((row) => /wait|listen|3128|1080|poll/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.269|WSL2|NixOS|socat|3128|1080|15–30|3 ms|#62743/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("socat-race"));
  assert.ok(FINGERPRINT_LINES.includes("blown"));
  assert.equal(PHRASE, "Score airlock or admit equalized.");
  assert.equal(SAMPLE_BLOWN_LOCK.waitsForBind, false);
  assert.equal(SAMPLE_HTTP_BRIDGE.port, 3128);
  assert.equal(SAMPLE_SOCKS_BRIDGE.port, 1080);
  assert.equal(SAMPLE_NO_WAIT.waitsForBind, false);
  assert.equal(SAMPLE_FIRST_CALL_REFUSED.refused, true);
  assert.equal(SAMPLE_SOCAT_SCRIPT.waitsForBind, false);
  assert.ok(SAMPLE_SOCAT_SCRIPT.lines[0].includes("TCP-LISTEN:3128"));
  assert.ok(SAMPLE_SOCAT_SCRIPT.lines[1].includes("TCP-LISTEN:1080"));
  assert.equal(HTTP_PORT, 3128);
  assert.equal(SOCKS_PORT, 1080);
  assert.equal(SHELL_READY_MS, 3);
  assert.equal(LISTEN_MIN_MS, 15);
  assert.equal(LISTEN_MAX_MS, 30);
  assert.equal(PROBE_FAILS, 4);
});

test("has-repro fingerprints encode the published blown lock", () => {
  const result = handle(seedBlown());
  assert.equal(result.published.platform, "linux-wsl2");
  assert.equal(result.published.surface, "bash-sandbox-socat");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedBlown()),
    /airlock\|wait=none\|first=refused\|listen=15-30ms\|path=socat-race\|cue=socat-race/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside", () => {
  const required = [
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
    "scotia",
    "scotiated",
    "decstbm-undershoot",
    "flush",
    "canard",
    "candid",
    "canarded",
    "onedrive-cwd-mislabel",
    "stetted",
    "rewound",
    "stet",
    "mic-resume-wipe",
    "sighted",
    "blindsided",
    "blindside",
    "compare-ref-unreachable",
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
    "pontoon",
    "washed",
    "outrider",
    "credentialed",
    "early-connect",
    "duplex",
    "simplexed",
    "simplex",
    "mobile-uplink-silent",
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
    "attested",
    "necrology",
    "named",
    "innominate",
    "lit",
    "snuffer",
    "pledged",
    "changeling",
    "distinct",
    "homograph",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
    "scapegoat",
    "galley",
    "stop-dirty",
    "primed",
    "warm",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("equalized booth flips blown back when listeners bind first", () => {
  const tape = {
    equalized: true,
    blown: false,
    noWaitBind: false,
    cue: "equalized",
  };
  assert.equal(scoreGate(tape).verdict, "equalized");
  tape.equalized = false;
  tape.blown = true;
  tape.socatRace = true;
  tape.noWaitBind = true;
  tape.firstCallRefused = true;
  tape.cue = "blown";
  assert.equal(scoreGate(tape).verdict, "airlock");
  tape.equalized = true;
  tape.blown = false;
  tape.socatRace = false;
  tape.noWaitBind = false;
  tape.firstCallRefused = false;
  tape.cue = "equalized";
  assert.equal(scoreGate(tape).verdict, "equalized");
});

test("bridges, wait, first call, and readBooth mark the blown lock", () => {
  const idle = inspectBridges({
    equalized: true,
    bridges: { http: { boundAtT0: true }, socks: { boundAtT0: true }, waitsForBind: true },
  });
  assert.equal(idle.stamp, "bridges-ready");
  const first = inspectFirstCall({ blown: true, firstCall: SAMPLE_FIRST_CALL_REFUSED });
  assert.equal(first.stamp, "first-call-refused");
  assert.equal(first.refused, true);
  const wait = inspectBindWait({ noWaitBind: true });
  assert.equal(wait.stamp, "no-wait-bind");
  const booth = readBooth({
    blown: true,
    noWaitBind: true,
    wait: SAMPLE_NO_WAIT,
    firstCall: SAMPLE_FIRST_CALL_REFUSED,
  });
  assert.equal(booth.blown, true);
  assert.equal(booth.mark, "blown");
  const open = readBooth({
    equalized: true,
    blown: false,
    noWaitBind: false,
  });
  assert.equal(open.blown, false);
  assert.equal(open.mark, "equalized");
});

test("mapPressure encodes the published first-call race", () => {
  const miss = mapPressure({ blown: true, listenMs: 22 });
  assert.equal(miss.stamp, "socat-race");
  assert.equal(miss.hatch, "blown");
  assert.equal(miss.httpBound, false);
  assert.ok(miss.delta > 0);
  const clear = mapPressure({ equalized: true, blown: false });
  assert.equal(clear.stamp, "hatch-sealed");
  assert.equal(clear.httpBound, true);
  assert.ok(clear.chamberPsi > miss.chamberPsi);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 62743);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("simulacrum"));
  assert.ok(NOT_PRODUCTS.includes("solenoid"));
  assert.ok(NOT_PRODUCTS.includes("scotia"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93744);
  assert.equal(BACKUPS[1].issue, 93772);
  assert.equal(BACKUPS[2].issue, 93770);
  assert.equal(BACKUPS[3].issue, 93777);
  assert.equal(BACKUPS[4].issue, 93782);
  assert.equal(BACKUPS[5].issue, 93859);
  assert.equal(BACKUPS[6].issue, 93863);
  assert.equal(BACKUPS[7].issue, 93889);
  assert.equal(BACKUPS[8].issue, 93821);
  assert.equal(BACKUPS[9].issue, 93811);
  assert.equal(BACKUPS[10].issue, 93809);
  assert.equal(BACKUPS[11].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93862));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/blown.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const equalizedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/equalized.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(equalizedFix.status, 0, equalizedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const equalizedOut = JSON.parse(equalizedFix.stdout);
  assert.equal(idleOut.verdict, "equalized");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "blown");
  assert.equal(seededOut.alarm, true);
  assert.equal(equalizedOut.verdict, "equalized");
  assert.equal(equalizedOut.hold, true);
});

test("handle exposes published hypothesis and #93862 headline", () => {
  const result = handle(seedBlown());
  assert.equal(result.published.issue, 93862);
  assert.equal(result.published.platform, "linux-wsl2");
  assert.deepEqual(result.published.cousins, [62743]);
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93862));
  assert.match(result.published.hypothesis, /socat|3128|1080|background|bind|git|curl/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93862/);
  assert.ok(result.published.script.lines[0].includes("TCP-LISTEN:3128"));
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a submarine / spacecraft airlock booth, not scotoma or aneroid", () => {
  const page = readPage();
  assert.match(page, /Quantico/);
  assert.match(page, /Rajdhani/);
  assert.match(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.match(page, /airlock|equalized|blown|socat-race|hatch|pressure|3128|1080/i);
  assert.match(page, /#081525|#102033|#4FD4E8|#E89B1A|#C4162A/i);
  assert.match(page, /\bequalized\b/);
  assert.match(page, /\bblown\b/);
  assert.match(page, /socat-race/);
  assert.match(page, /Score airlock or admit equalized/i);
  assert.match(page, /#62743|cousin/i);
  assert.match(page, /#326/);
  assert.match(page, /#93862/);
  assert.match(page, /Admit equalized/);
  assert.match(page, /Score airlock/);
  assert.match(page, /Walk socat-race/);
  assert.match(page, /Compare equalized \/ blown/);
  assert.match(page, /Pin idle equalized/);
  assert.match(page, /Pin seeded blown/);
  assert.match(page, /Pin socat-race/);
  assert.match(page, /Cycle the hatch/);
  assert.match(page, /socat|bwrap|3128|1080|git ls-remote|2\.1\.269|WSL2|NixOS/i);
  assert.match(page, /HTTP:3128|SOCKS:1080|listener/i);
  assert.match(page, /3 ms|15–30|15-30/i);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Orbitron/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /#0C1418/);
  assert.doesNotMatch(page, /#1E2C32/);
  assert.doesNotMatch(page, /#F3EBDA/);
  assert.doesNotMatch(page, /#D4A017/);
  assert.doesNotMatch(page, /#B81D45/);
  assert.doesNotMatch(page, /#2A8A7A/);
  assert.doesNotMatch(page, /#1A1C1F/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F0A202/);
  assert.doesNotMatch(page, /#3EE8E0/);
  assert.doesNotMatch(page, /#1B6B6B/);
  assert.doesNotMatch(page, /#0D2A2C/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|onQuitCleanup/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|headersHelper/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /remoteControlAtStartup|WarmLifecycle/);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /list_connected_browsers|Navigated to/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bwarm\b/);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Sprag/i);
  assert.match(page, /NOT Leat/i);
  assert.match(page, /NOT Pontoon/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Airlock/);
  assert.match(readme, /#93862/);
  assert.match(readme, /\bequalized\b/);
  assert.match(readme, /\bblown\b/);
  assert.match(readme, /socat-race/);
  assert.match(readme, /Quantico/);
  assert.match(readme, /Rajdhani/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /socat|3128|1080|2\.1\.269|WSL2|bwrap/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/airlock/);
  assert.match(readme, /node --test projects\/airlock\/airlock\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /airlock|pressure-lock|hatch|submarine|spacecraft/i);
  assert.match(readme, /Score airlock or admit equalized/);
  assert.match(readme, /#62743/);
  assert.match(readme, /#93744|#93772|#93770|#93777|#93782|#93859|#93863|#93889|#93821|#93811|#93809|#93823/);
  assert.match(readme, /08:50/);
});

test("catalog features Airlock only; Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 326);
  assert.equal(hub.products.length, 326);
  assert.equal(catalog.products[0].name, "Airlock");
  assert.equal(catalog.products[0].slug, "airlock");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/airlock/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /08:50 airlock|#93862|submarine|spacecraft|pressure-lock/i);
  assert.match(catalog.products[0].summary, /\bequalized\b/);
  assert.match(catalog.products[0].summary, /\bblown\b/);
  assert.match(catalog.products[0].summary, /socat-race/);
  assert.match(catalog.products[0].summary, /Score airlock or admit equalized/);
  assert.equal(hub.products[0].slug, "airlock");
  assert.equal(hub.products[0].featured, true);
  const scotoma = catalog.products.find((row) => row.slug === "scotoma");
  assert.ok(scotoma);
  assert.equal(scotoma.featured, false);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const simulacrum = catalog.products.find((row) => row.slug === "simulacrum");
  assert.ok(simulacrum);
  assert.equal(simulacrum.featured, false);
  const solenoid = catalog.products.find((row) => row.slug === "solenoid");
  assert.ok(solenoid);
  assert.equal(solenoid.featured, false);
  const scotia = catalog.products.find((row) => row.slug === "scotia");
  assert.ok(scotia);
  assert.equal(scotia.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  const stet = catalog.products.find((row) => row.slug === "stet");
  assert.ok(stet);
  assert.equal(stet.featured, false);
  const blindside = catalog.products.find((row) => row.slug === "blindside");
  assert.ok(blindside);
  assert.equal(blindside.featured, false);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "airlock").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93862") && row.slug !== "airlock"));
});

test("vercel rewrites airlock to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/airlock");
  assert.equal(vercel.rewrites[0].destination, "/projects/airlock");
  assert.equal(vercel.rewrites[1].source, "/airlock/");
  assert.equal(vercel.rewrites[1].destination, "/projects/airlock");
  assert.equal(vercel.rewrites[2].source, "/airlock/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/airlock/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
