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
  LICTOR_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PROCESSION_NAMES,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_LICTOR_PROOF,
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
  inspectAisle,
  inspectChair,
  inspectFasces,
  inspectLedger,
  inspectProcession,
  inspectRods,
  mapForum,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedDesktopPicker,
  seedHold,
  seedLictor,
  seedPickerBypass,
  seedProduct,
  seedAttested,
  seedSilentBypass,
  seedZeroRows,
} from "./lictor.mjs";

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
  return fileURLToPath(new URL("./lictor.mjs", import.meta.url));
}

test("idle attested is a hold; hooks fired in order; Pre then Post; policy gate held", () => {
  const result = analyze(seedAttested());
  assert.equal(result.verdict, "attested");
  assert.equal(result.idleWord, "attested");
  assert.equal(IDLE_WORD, "attested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.attested, true);
  assert.equal(result.phrase, "admit attested");
  assert.equal(result.lictor, false);
  assert.equal(result.pickerBypass, false);
  assert.ok(HOLD_ALIASES.includes("heralded"));
  assert.ok(HOLD_ALIASES.includes("preceded"));
  assert.ok(HOLD_ALIASES.includes("dispatched"));
  assert.ok(HOLD_ALIASES.includes("logged"));
  assert.ok(HOLD_ALIASES.includes("bound"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify attested", () => {
  assert.equal(classify(emptyTicket()), "attested");
  assert.equal(classify(""), "attested");
  assert.equal(classify(null), "attested");
  assert.equal(decide({}), "attested");
});

test("#94053 seeded path scores lictor when desktop picker bypasses Pre/PostModelSwitch", () => {
  const result = analyze(seedLictor());
  assert.equal(result.verdict, "lictor");
  assert.equal(result.seededWord, "lictor");
  assert.equal(SEEDED_WORD, "lictor");
  assert.equal(PRODUCT_WORD, "lictor");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lictor, true);
  assert.equal(result.phrase, "score lictor");
  assert.equal(result.pickerBypass, true);
  assert.equal(result.desktopPicker, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark unraised fasces and blank tablet", () => {
  const fasces = inspectFasces({ lictor: true, pickerBypass: true });
  assert.equal(fasces.stamp, "fasces-unraised");
  assert.equal(fasces.bypassed, true);
  const chair = inspectChair({ lictor: true, pickerBypass: true });
  assert.equal(chair.stamp, "chair-taken");
  assert.equal(chair.taken, true);
  const scored = scoreGate({
    lictor: true,
    pickerBypass: true,
    desktopPicker: true,
    cue: "lictor",
  });
  assert.equal(scored.verdict, "lictor");
  const open = inspectFasces({ attested: true, lictor: false });
  assert.equal(open.stamp, "fasces-raised");
});

test("path word is picker-bypass; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "picker-bypass");
  const result = analyze(seedPickerBypass());
  assert.equal(result.verdict, "picker-bypass");
  assert.equal(result.pathWord, "picker-bypass");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "picker-bypass",
      preferSeed: true,
      lictor: true,
    }),
    "picker-bypass",
  );
  assert.equal(classify(seedZeroRows()), "zero-rows");
  assert.equal(score(seedPickerBypass()), "lictor");
});

test("HOLD includes attested / hold", () => {
  assert.ok(HOLD.includes("attested"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: desktop-picker, picker-bypass, lictor, silent-bypass", () => {
  assert.equal(classify(seedZeroRows()), "zero-rows");
  assert.equal(classify(seedPickerBypass()), "picker-bypass");
  assert.equal(classify(seedProduct()), "lictor");
  assert.equal(classify(seedSilentBypass()), "silent-bypass");
  assert.equal(classify(seedDesktopPicker()), "desktop-picker");
});

test("booth fixtures flip attested vs lictor vs picker-bypass", () => {
  const idle = scoreGate(seedAttested());
  const seeded = scoreGate(seedLictor());
  const attested = readData("attested.json");
  const lictor = readData("lictor.json");
  const path = readData("picker-bypass.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "attested");
  assert.equal(seeded.verdict, "lictor");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAttested()), "attested");
  assert.equal(score(seedLictor()), "lictor");
  assert.equal(
    score({ seed: "picker-bypass", preferSeed: true }),
    "lictor",
  );
  assert.equal(attested.pickerBypass, false);
  assert.equal(attested.attested, true);
  assert.equal(scoreGate(attested).verdict, "attested");
  assert.equal(lictor.pickerBypass, true);
  assert.equal(lictor.desktopPicker, true);
  assert.equal(lictor.zeroRows, true);
  assert.equal(classify(lictor), "lictor");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /attested|heralded|preceded|dispatched|logged|bound/i,
  );
  assert.match(
    path.paths[1].result,
    /picker-bypass|desktop-picker|zero rows|PreModelSwitch/i,
  );
  assert.equal(classify(path), "picker-bypass");
  assert.equal(lictor.hubCount, "LICTOR");
  assert.equal(lictor.issue, 94053);
  assert.equal(lictor.lictor, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("heralded.json")), "heralded");
  assert.equal(classify(readData("preceded.json")), "preceded");
  assert.equal(classify(readData("dispatched.json")), "dispatched");
  assert.equal(classify(readData("logged.json")), "logged");
  assert.equal(classify(readData("bound.json")), "bound");
  assert.equal(classify(readData("pre-model-switch.json")), "pre-model-switch");
  assert.equal(classify(readData("post-model-switch.json")), "post-model-switch");
  assert.equal(classify(readData("desktop-picker.json")), "desktop-picker");
  assert.equal(classify(readData("cli-model.json")), "cli-model");
  assert.equal(classify(readData("zero-rows.json")), "zero-rows");
  assert.equal(classify(readData("silent-bypass.json")), "silent-bypass");
  assert.equal(classify(readData("policy-gate.json")), "policy-gate");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [93742, 93757, 90817, 93919, 91767]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("attested"));
  assert.ok(CHIPS.includes("lictor"));
  assert.ok(CHIPS.includes("picker-bypass"));
  assert.ok(CHIPS.includes("desktop-picker"));
  assert.ok(CHIPS.includes("silent-bypass"));
  assert.ok(CHIPS.includes("heralded"));
  assert.ok(CHIPS.includes("bound"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lictor"));
  assert.ok(ALARM.includes("picker-bypass"));
  assert.ok(ALARM.includes("desktop-picker"));
  assert.ok(ALARM.includes("silent-bypass"));
  assert.ok(ALARM.includes("zero-rows"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published lictor walk scores lictor after the idle hold", () => {
  const booth = scoreWalk({ rows: LICTOR_WALK });
  assert.equal(booth.verdict, "lictor");
  assert.ok(booth.lictorCount >= 1);
  const idle = booth.rows.find((row) => row.event === "forum-attested");
  assert.equal(idle.attested, true);
  assert.equal(idle.verdict, "attested");
  const cut = booth.rows.find((row) => row.event === "picker-bypass");
  assert.equal(cut.pickerBypass, true);
  const path = booth.rows.find(
    (row) => row.event === "picker-bypass" && row.t === "path",
  );
  assert.equal(path.verdict, "picker-bypass");
});

test("LICTOR_WALK constant matches the issue aisle walk", () => {
  assert.equal(LICTOR_WALK[0].event, "forum-attested");
  const cut = LICTOR_WALK.find((row) => row.event === "picker-bypass");
  assert.equal(cut.pickerBypass || cut.silentBypass, true);
  const path = LICTOR_WALK.find((row) => row.t === "path");
  assert.equal(path.lictor, true);
  const scoreRow = LICTOR_WALK.find((row) => row.event === "lictor");
  assert.equal(scoreRow.lictor, true);
  assert.equal(scoreRow.zeroRows, true);
});

test("positive control attested aisle stays attested", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "attested");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "attested");
  const hold = walk.rows.find((row) => row.event === "forum-attested");
  assert.equal(hold.attested, true);
  assert.equal(hold.verdict, "attested");
});

test("issue constants encode only #94053 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94053);
  assert.ok(ISSUE_URL.includes("94053"));
  assert.match(TITLE, /Desktop app model picker|PreModelSwitch|PostModelSwitch|CLI \/model/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.266|1\.52386\.3|Darwin 25\.4\.0|2\.1\.258/i);
  assert.equal(
    BUILD,
    "Desktop Claude.app 1.52386.3 / bundled Claude Code 2.1.266 / CLI 2.1.258 (macOS Darwin 25.4.0 arm64)",
  );
  assert.equal(SURFACE, "picker-bypass");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:hooks", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(PROCESSION_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Proscription|#94202/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Rescript|#93742/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Changeling|#93757/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Lychgate|#94059/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Ouster|#94221/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Thimblerig/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Fetchling/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Souffleur/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Epitome/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Diabolica/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sallyport/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /PreModelSwitch|PostModelSwitch|block|CLI \/model|dispatch/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /model picker|PreModelSwitch|PostModelSwitch|\/model|Running PreModelSwitch hooks|zero rows|2\.1\.266|1\.52386\.3|2\.1\.258|2\.1\.251|SessionStart|UserPromptSubmit|PreToolUse|SubagentStart/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("picker-bypass"));
  assert.ok(FINGERPRINT_LINES.includes("lictor"));
  assert.equal(PHRASE, "Score lictor or admit attested.");
  assert.equal(SAMPLE_LICTOR_PROOF.pickerBypass, true);
  assert.equal(SAMPLE_LICTOR_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published lictor proof", () => {
  const result = handle(seedLictor());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "picker-bypass");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedLictor()),
    /lictor\|kind=picker-bypass\|ref=desktop-picker\|path=picker-bypass\|cue=picker-bypass/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and lychgate/ouster/proscription", () => {
  const required = [
    "reaped",
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
    "lychgate",
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
    "bg-task-stale",
    "inherited-worktree-yank",
    "skill-row-carve",
    "skill-dollar-swap",
    "deny-list-hollow",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("attested booth flips lictor back when the aisle admits attested", () => {
  const tape = {
    attested: true,
    lictor: false,
    pickerBypass: false,
    cue: "attested",
  };
  assert.equal(scoreGate(tape).verdict, "attested");
  tape.attested = false;
  tape.lictor = true;
  tape.pickerBypass = true;
  tape.cue = "lictor";
  assert.equal(scoreGate(tape).verdict, "lictor");
  tape.attested = true;
  tape.lictor = false;
  tape.pickerBypass = false;
  tape.cue = "attested";
  assert.equal(scoreGate(tape).verdict, "attested");
});

test("fasces, chair, ledger, aisle, rods, and readBooth mark the lictor proof", () => {
  const idle = inspectFasces({ attested: true });
  assert.equal(idle.stamp, "fasces-raised");
  const chair = inspectChair({ lictor: true, pickerBypass: true });
  assert.equal(chair.stamp, "chair-taken");
  assert.equal(chair.taken, true);
  const aisle = inspectAisle({ lictor: true, desktopPicker: true });
  assert.equal(aisle.stamp, "aisle-skipped");
  const booth = readBooth({
    lictor: true,
    pickerBypass: true,
    desktopPicker: true,
  });
  assert.equal(booth.lictor, true);
  assert.equal(booth.mark, "lictor");
  const open = readBooth({
    attested: true,
    lictor: false,
    pickerBypass: false,
  });
  assert.equal(open.lictor, false);
  assert.equal(open.mark, "attested");
  assert.equal(
    inspectRods({ silentBypass: true, policyGate: true }).stamp,
    "rods-open",
  );
  assert.equal(inspectChair({ attested: true }).stamp, "chair-attested");
  assert.equal(
    inspectLedger({ lictor: true, zeroRows: true }).stamp,
    "tablet-blank",
  );
  assert.equal(
    inspectProcession({ lictor: true, pickerBypass: true }).stamp,
    "procession-bypassed",
  );
});

test("mapForum encodes the published skipped aisle", () => {
  const miss = mapForum({ lictor: true, pickerBypass: true });
  assert.equal(miss.stamp, "picker-bypass");
  assert.equal(miss.holdingLane, "desktop-picker");
  assert.equal(miss.ribbon, "lictor");
  const clear = mapForum({ attested: true, lictor: false });
  assert.equal(clear.stamp, "attested-aisle");
  assert.equal(clear.kindLane, "heralded");
  assert.equal(clear.holdingLane, "dispatched");
});

test("cousins cite #93742 #93757 #90817 #93919 #91767 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 93742);
  assert.equal(COUSINS[1].issue, 93757);
  assert.equal(COUSINS[2].issue, 90817);
  assert.equal(COUSINS[3].issue, 93919);
  assert.equal(COUSINS[4].issue, 91767);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("lychgate"));
  assert.ok(NOT_PRODUCTS.includes("ouster"));
  assert.ok(NOT_PRODUCTS.includes("proscription"));
  assert.ok(NOT_PRODUCTS.includes("thimblerig"));
  assert.ok(NOT_PRODUCTS.includes("fetchling"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.ok(NOT_PRODUCTS.includes("sepulchre"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[7].issue, 94174);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94053));
  assert.ok(!BACKUPS.some((row) => row.issue === 94059));
  assert.ok(!BACKUPS.some((row) => row.issue === 93742));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lictor.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const attestedFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/attested.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(attestedFix.status, 0, attestedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const attestedOut = JSON.parse(attestedFix.stdout);
  assert.equal(idleOut.verdict, "attested");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "lictor");
  assert.equal(seededOut.alarm, true);
  assert.equal(attestedOut.verdict, "attested");
  assert.equal(attestedOut.hold, true);
  assert.match(attestedOut.phrase, /admit attested/);
});

test("handle exposes published hypothesis and #94053 headline", () => {
  const result = handle(seedLictor());
  assert.equal(result.published.issue, 94053);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93742, 93757, 90817, 93919, 91767]);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94174));
  assert.ok(!result.published.backups.includes(94053));
  assert.match(
    result.published.hypothesis,
    /desktop|picker|dispatch|CLI \/model|NON-BINDING|#94053/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94053/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the attested page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("attested page is a Roman lictor forum aisle, not a parish porch or bailiff desk", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /lictor|attested|picker-bypass|fasces|curule|wax.tablet|forum aisle|iron.rod|procession/i,
  );
  assert.match(page, /#2B1B3D|#C4A35A|#F3EDE0|#1C1C1C|#F7F4EE|#E07A3D/i);
  assert.match(page, /\battested\b/);
  assert.match(page, /\blictor\b/);
  assert.match(page, /picker-bypass/);
  assert.match(page, /Score lictor or admit attested/i);
  assert.match(page, /#360/);
  assert.match(page, /#94053/);
  assert.match(page, /Admit attested/);
  assert.match(page, /Score lictor/);
  assert.match(page, /Walk picker-bypass/);
  assert.match(page, /Compare attested \/ lictor/);
  assert.match(page, /Pin idle attested/);
  assert.match(page, /Pin seeded lictor/);
  assert.match(page, /Pin picker-bypass/);
  assert.match(page, /Raise the fasces/);
  assert.match(page, /Score booth/);
  assert.match(page, /lictor-score/);
  assert.match(
    page,
    /PreModelSwitch|PostModelSwitch|Running PreModelSwitch hooks|model picker|2\.1\.266|1\.52386\.3|2\.1\.258|zero rows/i,
  );
  assert.match(page, /fasces|curule chair|wax tablet|forum aisle|iron rod|procession/i);
  assert.match(page, /<svg[\s\S]*class="fasces-bundle"|class="curule-chair"|class="wax-tablet"|class="forum-aisle"|class="iron-rods"|class="procession-path"/i);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Rye|Rye/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Playfair|Playfair Display/);
  assert.doesNotMatch(page, /family=Literata|Literata/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code|Fira\+Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(page, /carnival|cups-and-pea|fairground/i);
  assert.doesNotMatch(page, /coin-ledger|mint tray|twilight glass|fae-twilight/i);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /gatehouse|iron-grille|sealed-strongroom/i);
  assert.doesNotMatch(page, /marble lintel|iron stylus|torch-lit senate/i);
  assert.doesNotMatch(page, /bailiff|tenancy roll|street door|wax-seal|lodger/i);
  assert.doesNotMatch(page, /ossuary|limestone lintel|extinguished-lamp/i);
  assert.doesNotMatch(page, /lychgate porch|coffin rest|parish roll|burial path/i);
  assert.doesNotMatch(page, /admit tenanted|Score ouster|idle tenanted/i);
  assert.doesNotMatch(page, /admit barred|Score proscription|idle barred/i);
  assert.doesNotMatch(page, /admit reaped|Score lychgate|idle reaped/i);
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
  assert.doesNotMatch(page, /\blychgate\b/);
  assert.doesNotMatch(page, /skill-row-carve/);
  assert.doesNotMatch(page, /skill-dollar-swap/);
  assert.doesNotMatch(page, /inherited-worktree-yank/);
  assert.doesNotMatch(page, /deny-list-hollow/);
  assert.doesNotMatch(page, /bg-task-stale/);
  assert.match(page, /NOT Lychgate/i);
  assert.match(page, /NOT Ouster/i);
  assert.match(page, /NOT Proscription/i);
  assert.match(page, /NOT Rescript/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Thimblerig/i);
  assert.match(page, /NOT Fetchling/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /#93742/);
  assert.match(page, /#93757/);
  assert.match(page, /#90817/);
  assert.match(page, /#93919/);
  assert.match(page, /#91767/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Lictor/);
  assert.match(readme, /#94053/);
  assert.match(readme, /\battested\b/);
  assert.match(readme, /\blictor\b/);
  assert.match(readme, /picker-bypass/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Instrument Serif/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /Fragment Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /PICKER-BYPASS|PreModelSwitch|PostModelSwitch|model picker|Running PreModelSwitch hooks/i,
  );
  assert.match(readme, /NOT Lychgate\/#94059/);
  assert.match(readme, /NOT Ouster\/#94221/);
  assert.match(readme, /NOT Proscription\/#94202/);
  assert.match(readme, /NOT Rescript\/#93742/);
  assert.match(readme, /NOT Changeling\/#93757/);
  assert.match(readme, /NOT Thimblerig/);
  assert.match(readme, /NOT Fetchling/);
  assert.match(readme, /NOT Souffleur/);
  assert.match(readme, /NOT Epitome/);
  assert.match(readme, /NOT Diabolica/);
  assert.match(readme, /NOT Sallyport/);
  assert.match(readme, /#93742/);
  assert.match(readme, /#93757/);
  assert.match(readme, /#90817/);
  assert.match(readme, /#93919/);
  assert.match(readme, /#91767/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/lictor/);
  assert.match(readme, /node --test projects\/lictor\/lictor\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /fasces|curule|wax tablet|forum aisle|iron.rod|procession/i);
  assert.match(readme, /Score lictor or admit attested/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94151|#94064|#94174/,
  );
  assert.doesNotMatch(readme, /backup #94053|#94053 as next/);
  assert.match(readme, /21:20/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Lictor/);
  assert.match(runLog, /21:20/);
});

test("catalog features Lictor only; Lychgate unfeatured; product count 360", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 360);
  assert.equal(hub.products.length, 360);
  assert.equal(catalog.products[0].name, "Lictor");
  assert.equal(catalog.products[0].slug, "lictor");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/lictor/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "21:20 lictor: a Roman lictor / fasces / magistrate-procession / wax-tablet ledger / iron-rod bundle / curule-chair / torch-lit forum aisle booth for #94053. Desktop Code-tab model picker does not dispatch PreModelSwitch or PostModelSwitch; CLI /model does, same hooks, same machine. Desktop binary has the symbols and `Running PreModelSwitch hooks…` but the picker never enters that path. Other hooks fire. Silent policy bypass. macOS Darwin 25.4.0; Claude.app 1.52386.3; bundled 2.1.266; CLI 2.1.258. Idle attested / seeded lictor / path picker-bypass. Score lictor or admit attested.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\battested\b/);
  assert.match(catalog.products[0].summary, /\blictor\b/);
  assert.match(catalog.products[0].summary, /picker-bypass/);
  assert.match(catalog.products[0].summary, /Score lictor or admit attested/);
  assert.match(catalog.products[0].summary, /#94053/);
  assert.equal(hub.products[0].slug, "lictor");
  assert.equal(hub.products[0].featured, true);
  const lychgate = catalog.products.find((row) => row.slug === "lychgate");
  assert.ok(lychgate);
  assert.equal(lychgate.featured, false);
  const ouster = catalog.products.find((row) => row.slug === "ouster");
  assert.ok(ouster);
  assert.equal(ouster.featured, false);
  const proscription = catalog.products.find((row) => row.slug === "proscription");
  assert.ok(proscription);
  assert.equal(proscription.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "lictor").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94053") && row.slug !== "lictor",
    ),
  );
});

test("vercel rewrites lictor to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/lictor");
  assert.equal(vercel.rewrites[0].destination, "/projects/lictor");
  assert.equal(vercel.rewrites[1].source, "/lictor/");
  assert.equal(vercel.rewrites[1].destination, "/projects/lictor");
  assert.equal(vercel.rewrites[2].source, "/lictor/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/lictor/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
