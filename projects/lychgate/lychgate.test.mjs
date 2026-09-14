import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LYCHGATE_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PORCH_NAMES,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_LYCHGATE_PROOF,
  SEEDED_WORD,
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
  inspectBier,
  inspectLatch,
  inspectLantern,
  inspectPath,
  inspectPorch,
  inspectRoll,
  mapParish,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBgTaskStale,
  seedHold,
  seedLychgate,
  seedProduct,
  seedPsEmpty,
  seedReaped,
  seedStdinHang,
} from "./lychgate.mjs";

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
  return fileURLToPath(new URL("./lychgate.mjs", import.meta.url));
}

test("idle reaped is a hold; process exit observed → panel finished + notification", () => {
  const result = analyze(seedReaped());
  assert.equal(result.verdict, "reaped");
  assert.equal(result.idleWord, "reaped");
  assert.equal(IDLE_WORD, "reaped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.reaped, true);
  assert.equal(result.phrase, "admit reaped");
  assert.equal(result.lychgate, false);
  assert.equal(result.bgTaskStale, false);
  assert.ok(HOLD_ALIASES.includes("buried"));
  assert.ok(HOLD_ALIASES.includes("closed"));
  assert.ok(HOLD_ALIASES.includes("finished"));
  assert.ok(HOLD_ALIASES.includes("drained"));
  assert.ok(HOLD_ALIASES.includes("exited"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify reaped", () => {
  assert.equal(classify(emptyTicket()), "reaped");
  assert.equal(classify(""), "reaped");
  assert.equal(classify(null), "reaped");
  assert.equal(decide({}), "reaped");
});

test("#94059 seeded path scores lychgate when moved-to-background stays Running after exit", () => {
  const result = analyze(seedLychgate());
  assert.equal(result.verdict, "lychgate");
  assert.equal(result.seededWord, "lychgate");
  assert.equal(SEEDED_WORD, "lychgate");
  assert.equal(PRODUCT_WORD, "lychgate");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lychgate, true);
  assert.equal(result.phrase, "score lychgate");
  assert.equal(result.bgTaskStale, true);
  assert.equal(result.staleRunning, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark stale porch and ajar latch", () => {
  const porch = inspectPorch({ lychgate: true, bgTaskStale: true });
  assert.equal(porch.stamp, "porch-stale");
  assert.equal(porch.stale, true);
  const roll = inspectRoll({ lychgate: true, bgTaskStale: true });
  assert.equal(roll.stamp, "roll-running");
  assert.equal(roll.stale, true);
  const scored = scoreGate({
    lychgate: true,
    bgTaskStale: true,
    staleRunning: true,
    cue: "lychgate",
  });
  assert.equal(scored.verdict, "lychgate");
  const open = inspectPorch({ reaped: true, lychgate: false });
  assert.equal(open.stamp, "porch-reaped");
});

test("path word is bg-task-stale; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "bg-task-stale");
  const result = analyze(seedBgTaskStale());
  assert.equal(result.verdict, "bg-task-stale");
  assert.equal(result.pathWord, "bg-task-stale");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "bg-task-stale",
      preferSeed: true,
      lychgate: true,
    }),
    "bg-task-stale",
  );
  assert.equal(classify(seedPsEmpty()), "ps-empty");
  assert.equal(score(seedBgTaskStale()), "lychgate");
});

test("HOLD includes reaped / hold", () => {
  assert.ok(HOLD.includes("reaped"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: stale-running, bg-task-stale, lychgate, stdin-hang", () => {
  assert.equal(classify(seedPsEmpty()), "ps-empty");
  assert.equal(classify(seedBgTaskStale()), "bg-task-stale");
  assert.equal(classify(seedProduct()), "lychgate");
  assert.equal(classify(seedStdinHang()), "stdin-hang");
});

test("booth fixtures flip reaped vs lychgate vs bg-task-stale", () => {
  const idle = scoreGate(seedReaped());
  const seeded = scoreGate(seedLychgate());
  const reaped = readData("reaped.json");
  const lychgate = readData("lychgate.json");
  const path = readData("bg-task-stale.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "reaped");
  assert.equal(seeded.verdict, "lychgate");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedReaped()), "reaped");
  assert.equal(score(seedLychgate()), "lychgate");
  assert.equal(
    score({ seed: "bg-task-stale", preferSeed: true }),
    "lychgate",
  );
  assert.equal(reaped.bgTaskStale, false);
  assert.equal(reaped.reaped, true);
  assert.equal(scoreGate(reaped).verdict, "reaped");
  assert.equal(lychgate.bgTaskStale, true);
  assert.equal(lychgate.staleRunning, true);
  assert.equal(lychgate.psEmpty, true);
  assert.equal(classify(lychgate), "lychgate");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /reaped|buried|closed|finished|drained|exited/i,
  );
  assert.match(
    path.paths[1].result,
    /bg-task-stale|stale-running|ps empty|Running/i,
  );
  assert.equal(classify(path), "bg-task-stale");
  assert.equal(lychgate.hubCount, "LYCHGATE");
  assert.equal(lychgate.issue, 94059);
  assert.equal(lychgate.lychgate, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("buried.json")), "buried");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("finished.json")), "finished");
  assert.equal(classify(readData("drained.json")), "drained");
  assert.equal(classify(readData("exited.json")), "exited");
  assert.equal(classify(readData("moved-to-background.json")), "moved-to-background");
  assert.equal(classify(readData("stale-running.json")), "stale-running");
  assert.equal(classify(readData("ps-empty.json")), "ps-empty");
  assert.equal(classify(readData("taskstop-stale.json")), "taskstop-stale");
  assert.equal(classify(readData("stdin-hang.json")), "stdin-hang");
  assert.equal(classify(readData("remote-ssh.json")), "remote-ssh");
  assert.equal(classify(readData("five-to-seven-hours.json")), "five-to-seven-hours");
  assert.equal(classify(readData("nine-hours-fifty-six.json")), "nine-hours-fifty-six");
  assert.equal(classify(readData("task-notification.json")), "task-notification");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [75085, 93948, 82151, 75314, 89766]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("reaped"));
  assert.ok(CHIPS.includes("lychgate"));
  assert.ok(CHIPS.includes("bg-task-stale"));
  assert.ok(CHIPS.includes("stale-running"));
  assert.ok(CHIPS.includes("stdin-hang"));
  assert.ok(CHIPS.includes("buried"));
  assert.ok(CHIPS.includes("exited"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lychgate"));
  assert.ok(ALARM.includes("bg-task-stale"));
  assert.ok(ALARM.includes("stale-running"));
  assert.ok(ALARM.includes("stdin-hang"));
  assert.ok(ALARM.includes("ps-empty"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published lychgate walk scores lychgate after the idle hold", () => {
  const booth = scoreWalk({ rows: LYCHGATE_WALK });
  assert.equal(booth.verdict, "lychgate");
  assert.ok(booth.lychgateCount >= 1);
  const idle = booth.rows.find((row) => row.event === "parish-reaped");
  assert.equal(idle.reaped, true);
  assert.equal(idle.verdict, "reaped");
  const cut = booth.rows.find((row) => row.event === "bg-task-stale");
  assert.equal(cut.bgTaskStale, true);
  const path = booth.rows.find(
    (row) => row.event === "bg-task-stale" && row.t === "path",
  );
  assert.equal(path.verdict, "bg-task-stale");
});

test("LYCHGATE_WALK constant matches the issue porch walk", () => {
  assert.equal(LYCHGATE_WALK[0].event, "parish-reaped");
  const cut = LYCHGATE_WALK.find((row) => row.event === "bg-task-stale");
  assert.equal(cut.bgTaskStale || cut.staleRunning, true);
  const path = LYCHGATE_WALK.find((row) => row.t === "path");
  assert.equal(path.lychgate, true);
  const scoreRow = LYCHGATE_WALK.find((row) => row.event === "lychgate");
  assert.equal(scoreRow.lychgate, true);
  assert.equal(scoreRow.psEmpty, true);
});

test("positive control reaped porch stays reaped", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "reaped");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "reaped");
  const hold = walk.rows.find((row) => row.event === "parish-reaped");
  assert.equal(hold.reaped, true);
  assert.equal(hold.verdict, "reaped");
});

test("issue constants encode only #94059 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94059);
  assert.ok(ISSUE_URL.includes("94059"));
  assert.match(TITLE, /Background tasks|moved-to-background|open stdin/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.240|Code tab|536/i);
  assert.equal(BUILD, "Claude Code 2.1.240 (macOS desktop, Code tab)");
  assert.equal(SURFACE, "bg-task-stale");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:bash", "area:agent-view"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(PORCH_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Ouster|#94221/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Proscription|#94202/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Thimblerig|#94174/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Fetchling|#94065/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Souffleur|#94031/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Epitome|#94032/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Diabolica|#94040/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sallyport|#94082/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /finished|task-notification|stdin|\/dev\/null|blocked-on-stdin/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /600 s timeout|moved to the background|5–7 hours|ps showed no matching process|TaskStop|9 h 56 min|md5sum|2\.1\.240|536 finished/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("bg-task-stale"));
  assert.ok(FINGERPRINT_LINES.includes("lychgate"));
  assert.equal(PHRASE, "Score lychgate or admit reaped.");
  assert.equal(SAMPLE_LYCHGATE_PROOF.bgTaskStale, true);
  assert.equal(SAMPLE_LYCHGATE_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published lychgate proof", () => {
  const result = handle(seedLychgate());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "bg-task-stale");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedLychgate()),
    /lychgate\|kind=bg-task-stale\|ref=stale-running\|path=bg-task-stale\|cue=bg-task-stale/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and ouster/proscription", () => {
  const required = [
    "tenanted",
    "barred",
    "additive",
    "literal",
    "echoing",
    "unabridged",
    "innocent",
    "sealed",
    "silenced",
    "living",
    "cleared",
    "spanned",
    "matched",
    "inscribed",
    "berthed",
    "pegged",
    "vested",
    "plenary",
    "equalized",
    "legible",
    "calibrated",
    "engaged",
    "flush",
    "candid",
    "stetted",
    "sighted",
    "ouster",
    "thimblerig",
    "fetchling",
    "souffleur",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "proscription",
    "inherited-worktree-yank",
    "skill-row-carve",
    "skill-dollar-swap",
    "deny-list-hollow",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("reaped booth flips lychgate back when the porch admits reaped", () => {
  const tape = {
    reaped: true,
    lychgate: false,
    bgTaskStale: false,
    cue: "reaped",
  };
  assert.equal(scoreGate(tape).verdict, "reaped");
  tape.reaped = false;
  tape.lychgate = true;
  tape.bgTaskStale = true;
  tape.cue = "lychgate";
  assert.equal(scoreGate(tape).verdict, "lychgate");
  tape.reaped = true;
  tape.lychgate = false;
  tape.bgTaskStale = false;
  tape.cue = "reaped";
  assert.equal(scoreGate(tape).verdict, "reaped");
});

test("porch, roll, bier, lantern, latch, and readBooth mark the lychgate proof", () => {
  const idle = inspectPorch({ reaped: true });
  assert.equal(idle.stamp, "porch-reaped");
  const roll = inspectRoll({ lychgate: true, bgTaskStale: true });
  assert.equal(roll.stamp, "roll-running");
  assert.equal(roll.stale, true);
  const lantern = inspectLantern({ lychgate: true, staleRunning: true });
  assert.equal(lantern.stamp, "lantern-hung");
  const booth = readBooth({
    lychgate: true,
    bgTaskStale: true,
    staleRunning: true,
  });
  assert.equal(booth.lychgate, true);
  assert.equal(booth.mark, "lychgate");
  const open = readBooth({
    reaped: true,
    lychgate: false,
    bgTaskStale: false,
  });
  assert.equal(open.lychgate, false);
  assert.equal(open.mark, "reaped");
  assert.equal(
    inspectLatch({ stdinHang: true, remoteSsh: true }).stamp,
    "latch-ajar",
  );
  assert.equal(inspectRoll({ reaped: true }).stamp, "roll-reaped");
  assert.equal(
    inspectBier({ lychgate: true, psEmpty: true }).stamp,
    "bier-empty",
  );
  assert.equal(
    inspectPath({ lychgate: true, bgTaskStale: true }).stamp,
    "path-stale",
  );
});

test("mapParish encodes the published stale porch", () => {
  const miss = mapParish({ lychgate: true, bgTaskStale: true });
  assert.equal(miss.stamp, "bg-task-stale");
  assert.equal(miss.holdingLane, "stale-running");
  assert.equal(miss.ribbon, "lychgate");
  const clear = mapParish({ reaped: true, lychgate: false });
  assert.equal(clear.stamp, "reaped-porch");
  assert.equal(clear.kindLane, "buried");
  assert.equal(clear.holdingLane, "finished");
});

test("cousins cite #75085 #93948 #82151 #75314 #89766 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 75085);
  assert.equal(COUSINS[1].issue, 93948);
  assert.equal(COUSINS[2].issue, 82151);
  assert.equal(COUSINS[3].issue, 75314);
  assert.equal(COUSINS[4].issue, 89766);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("ouster"));
  assert.ok(NOT_PRODUCTS.includes("proscription"));
  assert.ok(NOT_PRODUCTS.includes("thimblerig"));
  assert.ok(NOT_PRODUCTS.includes("fetchling"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.ok(NOT_PRODUCTS.includes("sepulchre"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[7].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94059));
  assert.ok(!BACKUPS.some((row) => row.issue === 94221));
  assert.ok(!BACKUPS.some((row) => row.issue === 75085));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lychgate.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const reapedFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/reaped.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(reapedFix.status, 0, reapedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const reapedOut = JSON.parse(reapedFix.stdout);
  assert.equal(idleOut.verdict, "reaped");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "lychgate");
  assert.equal(seededOut.alarm, true);
  assert.equal(reapedOut.verdict, "reaped");
  assert.equal(reapedOut.hold, true);
  assert.match(reapedOut.phrase, /admit reaped/);
});

test("handle exposes published hypothesis and #94059 headline", () => {
  const result = handle(seedLychgate());
  assert.equal(result.published.issue, 94059);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [75085, 93948, 82151, 75314, 89766]);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94059));
  assert.match(
    result.published.hypothesis,
    /moved-to-background|ps empty|open stdin|NON-BINDING|#94059/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94059/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the reaped page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("reaped page is a parish lychgate porch, not a bailiff desk or vault", () => {
  const page = readPage();
  assert.match(page, /family=Spectral|Spectral/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /lychgate|reaped|bg-task-stale|porch|coffin rest|parish roll|lantern|iron latch|burial path/i,
  );
  assert.match(page, /#2C3338|#6B8F71|#C9A227|#5C4033|#E8E4DA|#1A1A1A|#3D4F3F/i);
  assert.match(page, /\breaped\b/);
  assert.match(page, /\blychgate\b/);
  assert.match(page, /bg-task-stale/);
  assert.match(page, /Score lychgate or admit reaped/i);
  assert.match(page, /#359/);
  assert.match(page, /#94059/);
  assert.match(page, /Admit reaped/);
  assert.match(page, /Score lychgate/);
  assert.match(page, /Walk bg-task-stale/);
  assert.match(page, /Compare reaped \/ lychgate/);
  assert.match(page, /Pin idle reaped/);
  assert.match(page, /Pin seeded lychgate/);
  assert.match(page, /Pin bg-task-stale/);
  assert.match(page, /Unlatch the iron/);
  assert.match(page, /Score booth/);
  assert.match(page, /lychgate-score/);
  assert.match(
    page,
    /moved to the background|ps empty|TaskStop|9h 56m|md5sum|2\.1\.240|536/i,
  );
  assert.match(page, /porch|coffin rest|parish roll|lantern|iron latch|burial path/i);
  assert.match(page, /<svg[\s\S]*class="lychgate-porch"|class="coffin-rest"|class="parish-roll"|class="hanging-lantern"|class="iron-latch"|class="burial-path"/i);
  assert.doesNotMatch(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Rye|Rye/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Playfair|Playfair Display/);
  assert.doesNotMatch(page, /family=Literata|Literata/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code|Fira\+Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /Libre\+Caslon|Libre Caslon/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(page, /carnival|cups-and-pea|fairground/i);
  assert.doesNotMatch(page, /coin-ledger|mint tray|twilight glass|fae-twilight/i);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /gatehouse|iron-grille|sealed-strongroom/i);
  assert.doesNotMatch(page, /marble lintel|wax tablet|iron stylus|torch-lit senate/i);
  assert.doesNotMatch(page, /bailiff|tenancy roll|street door|wax-seal|lodger/i);
  assert.doesNotMatch(page, /ossuary|limestone lintel|extinguished-lamp/i);
  assert.doesNotMatch(page, /admit tenanted|Score ouster|idle tenanted/i);
  assert.doesNotMatch(page, /admit barred|Score proscription|idle barred/i);
  assert.doesNotMatch(page, /admit additive|Score thimblerig|idle additive/i);
  assert.doesNotMatch(page, /admit literal|Score fetchling|idle literal/i);
  assert.doesNotMatch(page, /admit echoing|Score souffleur/i);
  assert.doesNotMatch(page, /admit unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /admit sealed|Score sallyport/i);
  assert.doesNotMatch(page, /\bthimblerig\b/);
  assert.doesNotMatch(page, /\bfetchling\b/);
  assert.doesNotMatch(page, /\bproscription\b/);
  assert.doesNotMatch(page, /\bouster\b/);
  assert.doesNotMatch(page, /skill-row-carve/);
  assert.doesNotMatch(page, /skill-dollar-swap/);
  assert.doesNotMatch(page, /inherited-worktree-yank/);
  assert.doesNotMatch(page, /deny-list-hollow/);
  assert.doesNotMatch(page, /cannot-show-not-git/);
  assert.match(page, /NOT Ouster/i);
  assert.match(page, /NOT Proscription/i);
  assert.match(page, /NOT Thimblerig/i);
  assert.match(page, /NOT Fetchling/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /NOT Sepulchre/i);
  assert.match(page, /#75085/);
  assert.match(page, /#93948/);
  assert.match(page, /#82151/);
  assert.match(page, /#75314/);
  assert.match(page, /#89766/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Lychgate/);
  assert.match(readme, /#94059/);
  assert.match(readme, /\breaped\b/);
  assert.match(readme, /\blychgate\b/);
  assert.match(readme, /bg-task-stale/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Instrument Serif/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /Fragment Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /BG-TASK-STALE|moved to the background|ps empty|TaskStop|9h 56m|md5sum/i,
  );
  assert.match(readme, /NOT Ouster\/#94221/);
  assert.match(readme, /NOT Proscription\/#94202/);
  assert.match(readme, /NOT Thimblerig\/#94174/);
  assert.match(readme, /NOT Fetchling\/#94065/);
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Diabolica\/#94040/);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /#75085/);
  assert.match(readme, /#93948/);
  assert.match(readme, /#82151/);
  assert.match(readme, /#75314/);
  assert.match(readme, /#89766/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/lychgate/);
  assert.match(readme, /node --test projects\/lychgate\/lychgate\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /porch|coffin rest|parish roll|lantern|iron latch|burial path/i);
  assert.match(readme, /Score lychgate or admit reaped/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94053|#94151|#94064/,
  );
  assert.doesNotMatch(readme, /backup #94059|#94059 as next/);
  assert.match(readme, /19:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Lychgate/);
  assert.match(runLog, /19:50/);
});

test("catalog features Lychgate only; Ouster unfeatured; product count 359", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 359);
  assert.equal(hub.products.length, 359);
  assert.equal(catalog.products[0].name, "Lychgate");
  assert.equal(catalog.products[0].slug, "lychgate");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/lychgate/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "19:50 lychgate: a parish lychgate / coffin-rest / churchyard-porch / lantern / iron-latch / parish-roll booth for #94059. Moved-to-background Bash stays Running after process exits (ps empty, 5–7h); run_in_background remote ssh hangs on open stdin (~9h56m). Claude Code desktop 2.1.240 macOS Code tab. Idle reaped / seeded lychgate / path bg-task-stale. Score lychgate or admit reaped.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\breaped\b/);
  assert.match(catalog.products[0].summary, /\blychgate\b/);
  assert.match(catalog.products[0].summary, /bg-task-stale/);
  assert.match(catalog.products[0].summary, /Score lychgate or admit reaped/);
  assert.match(catalog.products[0].summary, /#94059/);
  assert.equal(hub.products[0].slug, "lychgate");
  assert.equal(hub.products[0].featured, true);
  const ouster = catalog.products.find((row) => row.slug === "ouster");
  assert.ok(ouster);
  assert.equal(ouster.featured, false);
  const proscription = catalog.products.find((row) => row.slug === "proscription");
  assert.ok(proscription);
  assert.equal(proscription.featured, false);
  const thimblerig = catalog.products.find((row) => row.slug === "thimblerig");
  assert.ok(thimblerig);
  assert.equal(thimblerig.featured, false);
  const fetchling = catalog.products.find((row) => row.slug === "fetchling");
  assert.ok(fetchling);
  assert.equal(fetchling.featured, false);
  const diabolica = catalog.products.find((row) => row.slug === "diabolica");
  assert.ok(diabolica);
  assert.equal(diabolica.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "lychgate").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94059") && row.slug !== "lychgate",
    ),
  );
});

test("vercel rewrites lychgate to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/lychgate");
  assert.equal(vercel.rewrites[0].destination, "/projects/lychgate");
  assert.equal(vercel.rewrites[1].source, "/lychgate/");
  assert.equal(vercel.rewrites[1].destination, "/projects/lychgate");
  assert.equal(vercel.rewrites[2].source, "/lychgate/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/lychgate/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
