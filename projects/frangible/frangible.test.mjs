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
  BUILD_VERSION,
  CHIPS,
  COUSINS,
  DENIED_BY_GUARD,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FRANGIBLE_WALK,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MODE_644,
  MODE_755,
  NOT_PRODUCTS,
  PATH_WORD,
  PERMISSION_DENIED,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REPRO_MARKER,
  RULED_OUT,
  SAMPLE_FRANGIBLE_PROOF,
  SEEDED_WORD,
  SEAL_NAMES,
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
  inspectAmpule,
  inspectGate,
  inspectPin,
  inspectPress,
  inspectStream,
  inspectWarning,
  mapSeal,
  readBooth,
  score,
  scoreChmodFailopen,
  scoreGate,
  scoreWalk,
  seedArmed,
  seedChmodFailopen,
  seedFrangible,
  seedHold,
  seedProduct,
  seedSpawnDenied,
  spawnGuard,
} from "./frangible.mjs";

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
  return fileURLToPath(new URL("./frangible.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "07:50 frangible: a wax-seal atelier / frangible glass ampule / shear-pin bench booth for #94362. PreToolUse deny-guard fails open when the hook file lacks +x (chmod 644); Claude Code treats spawn failure as non-blocking so the tool proceeds, including when the hook's job is permissionDecision: \"deny\"; warning is a two-line Permission denied that never names chmod +x; stream-json emits no PreToolUse hook_started/hook_response. Idle armed / seeded frangible / path chmod-failopen. Score frangible or admit armed.";

test("idle armed is a hold; hook file is executable; deny guard fires", () => {
  const result = analyze(seedArmed());
  assert.equal(result.verdict, "armed");
  assert.equal(result.idleWord, "armed");
  assert.equal(IDLE_WORD, "armed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.armed, true);
  assert.equal(result.phrase, "admit armed");
  assert.equal(result.frangible, false);
  assert.equal(result.chmodFailopen, false);
  assert.ok(HOLD_ALIASES.includes("sealed"));
  assert.ok(HOLD_ALIASES.includes("latched"));
  assert.ok(HOLD_ALIASES.includes("guarded"));
  assert.ok(HOLD_ALIASES.includes("executable"));
  assert.ok(HOLD_ALIASES.includes("bit-set"));
  assert.ok(HOLD_ALIASES.includes("+x"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "affixed");
  assert.notEqual(IDLE_WORD, "unpacked");
  assert.notEqual(IDLE_WORD, "scoped");
  assert.notEqual(IDLE_WORD, "enrolled");
});

test("empty ticket and empty stdin classify armed", () => {
  assert.equal(classify(emptyTicket()), "armed");
  assert.equal(classify(""), "armed");
  assert.equal(classify(null), "armed");
  assert.equal(decide({}), "armed");
});

test("#94362 seeded path scores frangible when the wax seal snaps", () => {
  const result = analyze(seedFrangible());
  assert.equal(result.verdict, "frangible");
  assert.equal(result.seededWord, "frangible");
  assert.equal(SEEDED_WORD, "frangible");
  assert.equal(PRODUCT_WORD, "frangible");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.frangible, true);
  assert.equal(result.phrase, "score frangible");
  assert.equal(result.chmodFailopen, true);
  assert.equal(result.spawnDenied, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "nameplate");
  assert.notEqual(SEEDED_WORD, "matryoshka");
  assert.notEqual(SEEDED_WORD, "dragnet");
});

test("educational spawn helper encodes published 644 vs 755 paths", () => {
  assert.match(PERMISSION_DENIED, /Permission denied/);
  assert.match(PERMISSION_DENIED, /non-blocking/);
  assert.equal(DENIED_BY_GUARD, "DENIED BY GUARD");
  assert.equal(REPRO_MARKER, "REPRO_MARKER");
  assert.equal(MODE_644, "644");
  assert.equal(MODE_755, "755");
  assert.equal(BUILD_VERSION, "2.1.270");
  const snapped = spawnGuard({ executable: false, mode: "644" });
  assert.equal(snapped.spawned, false);
  assert.equal(snapped.blocking, false);
  assert.equal(snapped.toolProceeds, true);
  assert.equal(snapped.marker, REPRO_MARKER);
  assert.equal(snapped.namesChmod, false);
  assert.equal(snapped.warning, PERMISSION_DENIED);
  const control = spawnGuard({ executable: true, mode: "755" });
  assert.equal(control.spawned, true);
  assert.equal(control.denied, true);
  assert.equal(control.reason, DENIED_BY_GUARD);
  assert.equal(control.toolProceeds, false);
  const hold = spawnGuard({
    executable: false,
    mode: "644",
    armed: true,
  });
  assert.equal(hold.spawned, true);
  assert.equal(hold.denied, true);
  const scored = scoreChmodFailopen({
    mode: "644",
    frangible: true,
    chmodFailopen: true,
  });
  assert.equal(scored.frangible, true);
  assert.equal(scored.spawnDenied, true);
  const armedPath = scoreChmodFailopen({ armed: true });
  assert.equal(armedPath.frangible, false);
  assert.equal(armedPath.armed, true);
});

test("inspectors mark spawn denied and fail-open gate", () => {
  const warning = inspectWarning({ frangible: true, warningOnly: true });
  assert.equal(warning.stamp, "warning-slip");
  assert.equal(warning.slipped, true);
  const gate = inspectGate({ frangible: true, failOpen: true });
  assert.equal(gate.stamp, "fail-open-gate");
  assert.equal(gate.open, true);
  const scored = scoreGate({
    frangible: true,
    chmodFailopen: true,
    spawnDenied: true,
    cue: "frangible",
  });
  assert.equal(scored.verdict, "frangible");
  const open = inspectPress({ armed: true, frangible: false });
  assert.equal(open.stamp, "seal-armed");
});

test("path word is chmod-failopen; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "chmod-failopen");
  const result = analyze(seedChmodFailopen());
  assert.equal(result.verdict, "chmod-failopen");
  assert.equal(result.pathWord, "chmod-failopen");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "chmod-failopen",
      preferSeed: true,
      frangible: true,
    }),
    "chmod-failopen",
  );
  assert.equal(classify({ seed: "spawn-denied", preferSeed: true }), "spawn-denied");
  assert.equal(score(seedChmodFailopen()), "frangible");
});

test("HOLD includes armed / hold", () => {
  assert.ok(HOLD.includes("armed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: spawn-denied, chmod-failopen, frangible", () => {
  assert.equal(classify({ seed: "spawn-denied", preferSeed: true }), "spawn-denied");
  assert.equal(classify(seedChmodFailopen()), "chmod-failopen");
  assert.equal(classify(seedProduct()), "frangible");
  assert.equal(classify(seedSpawnDenied()), "spawn-denied");
});

test("booth fixtures flip armed vs frangible vs chmod-failopen", () => {
  const idle = scoreGate(seedArmed());
  const seeded = scoreGate(seedFrangible());
  const armed = readData("armed.json");
  const frangible = readData("frangible.json");
  const issued = readData("94362.json");
  const path = readData("chmod-failopen.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "armed");
  assert.equal(seeded.verdict, "frangible");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedArmed()), "armed");
  assert.equal(score(seedFrangible()), "frangible");
  assert.equal(score({ seed: "chmod-failopen", preferSeed: true }), "frangible");
  assert.equal(armed.chmodFailopen, false);
  assert.equal(armed.armed, true);
  assert.equal(scoreGate(armed).verdict, "armed");
  assert.equal(frangible.chmodFailopen, true);
  assert.equal(frangible.spawnDenied, true);
  assert.equal(classify(frangible), "frangible");
  assert.equal(issued.issue, 94362);
  assert.equal(classify(issued), "frangible");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /armed|sealed|latched|guarded|executable|bit-set|\+x/i);
  assert.match(path.paths[1].result, /chmod-failopen|Permission denied|REPRO_MARKER/i);
  assert.equal(classify(path), "chmod-failopen");
  assert.equal(frangible.hubCount, "FRANGIBLE");
  assert.equal(frangible.issue, 94362);
  assert.equal(frangible.frangible, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("sealed.json")), "sealed");
  assert.equal(classify(readData("latched.json")), "latched");
  assert.equal(classify(readData("guarded.json")), "guarded");
  assert.equal(classify(readData("executable.json")), "executable");
  assert.equal(classify(readData("bit-set.json")), "bit-set");
  assert.equal(classify(readData("plus-x.json")), "+x");
  assert.equal(classify(readData("spawn-denied.json")), "spawn-denied");
  assert.equal(classify(readData("warning-only.json")), "warning-only");
  assert.equal(classify(readData("stream-silent.json")), "stream-silent");
  assert.equal(classify(readData("fail-open.json")), "fail-open");
  assert.equal(classify(readData("chmod-644.json")), "chmod-644");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [67147, 65378, 76808, 88578]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("armed"));
  assert.ok(CHIPS.includes("frangible"));
  assert.ok(CHIPS.includes("chmod-failopen"));
  assert.ok(CHIPS.includes("spawn-denied"));
  assert.ok(CHIPS.includes("fail-open"));
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("frangible"));
  assert.ok(ALARM.includes("chmod-failopen"));
  assert.ok(ALARM.includes("spawn-denied"));
  assert.ok(ALARM.includes("fail-open"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published frangible walk scores frangible after the idle hold", () => {
  const booth = scoreWalk({ rows: FRANGIBLE_WALK });
  assert.equal(booth.verdict, "frangible");
  assert.ok(booth.frangibleCount >= 1);
  const idle = booth.rows.find((row) => row.event === "seal-armed");
  assert.equal(idle.armed, true);
  assert.equal(idle.verdict, "armed");
  const cut = booth.rows.find((row) => row.event === "chmod-failopen");
  assert.equal(cut.chmodFailopen, true);
  const path = booth.rows.find(
    (row) => row.event === "chmod-failopen" && row.t === "path",
  );
  assert.equal(path.verdict, "chmod-failopen");
});

test("FRANGIBLE_WALK constant matches the issue atelier walk", () => {
  assert.equal(FRANGIBLE_WALK[0].event, "seal-armed");
  const cut = FRANGIBLE_WALK.find((row) => row.event === "chmod-failopen");
  assert.equal(cut.chmodFailopen || cut.spawnDenied, true);
  const path = FRANGIBLE_WALK.find((row) => row.t === "path");
  assert.equal(path.frangible, true);
  const scoreRow = FRANGIBLE_WALK.find((row) => row.event === "frangible");
  assert.equal(scoreRow.frangible, true);
  assert.equal(scoreRow.spawnDenied, true);
});

test("positive control armed seal stays armed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "armed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "armed");
  const hold = walk.rows.find((row) => row.event === "seal-armed");
  assert.equal(hold.armed, true);
  assert.equal(hold.verdict, "armed");
});

test("issue constants encode only #94362 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94362);
  assert.ok(ISSUE_URL.includes("94362"));
  assert.match(TITLE, /PreToolUse|executable bit|fails open|Permission denied/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.270|Claude Code/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "chmod-failopen");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:security", "area:hooks"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(SEAL_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Nameplate|#94349/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Matryoshka|#94350/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Dragnet|#94064/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#67147/i.test(row)));
  assert.ok(EXPECTED.some((row) => /deny|chmod|\+x|fail open|stream-json/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /chmod 644|permissionDecision|Permission denied|stream-json|chmod 755|fail open/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("chmod-failopen"));
  assert.ok(FINGERPRINT_LINES.includes("frangible"));
  assert.equal(PHRASE, "Score frangible or admit armed.");
  assert.equal(SAMPLE_FRANGIBLE_PROOF.chmodFailopen, true);
  assert.equal(SAMPLE_FRANGIBLE_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published frangible proof", () => {
  const result = handle(seedFrangible());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "chmod-failopen");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedFrangible()),
    /frangible\|kind=chmod-failopen\|ref=fail-open\|path=chmod-failopen\|cue=chmod-failopen/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and affixed/unpacked/scoped/enrolled", () => {
  const required = [
    "affixed",
    "unpacked",
    "descended",
    "recursed",
    "opened",
    "nested-ok",
    "walked-in",
    "scoped",
    "enrolled",
    "equated",
    "penned",
    "ungloved",
    "attested",
    "nameplate",
    "matryoshka",
    "dragnet",
    "matricula",
    "allograph",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "frisket",
    "scant",
    "header-rename",
    "subst-nest",
    "root-find",
    "reload-blind",
    "win-posix-mismatch",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("armed booth flips frangible back when the seal admits armed", () => {
  const tape = {
    armed: true,
    frangible: false,
    chmodFailopen: false,
    cue: "armed",
  };
  assert.equal(scoreGate(tape).verdict, "armed");
  tape.armed = false;
  tape.frangible = true;
  tape.chmodFailopen = true;
  tape.cue = "frangible";
  assert.equal(scoreGate(tape).verdict, "frangible");
  tape.armed = true;
  tape.frangible = false;
  tape.chmodFailopen = false;
  tape.cue = "armed";
  assert.equal(scoreGate(tape).verdict, "armed");
});

test("press, ampule, warning, and readBooth mark the frangible proof", () => {
  const press = inspectPress({ frangible: true });
  assert.equal(press.stamp, "wax-press");
  const warning = inspectWarning({ frangible: true, warningOnly: true });
  assert.equal(warning.stamp, "warning-slip");
  assert.equal(warning.slipped, true);
  const ampule = inspectAmpule({ frangible: true, spawnDenied: true });
  assert.equal(ampule.stamp, "glass-ampule");
  const booth = readBooth({
    frangible: true,
    chmodFailopen: true,
    spawnDenied: true,
  });
  assert.equal(booth.frangible, true);
  assert.equal(booth.mark, "frangible");
  const open = readBooth({
    armed: true,
    frangible: false,
    chmodFailopen: false,
  });
  assert.equal(open.frangible, false);
  assert.equal(open.mark, "armed");
  assert.equal(inspectPin({ frangible: true, failOpen: true }).stamp, "shear-pin");
  assert.equal(inspectStream({ frangible: true, streamSilent: true }).stamp, "stream-silent");
  assert.equal(inspectGate({ frangible: true, failOpen: true }).stamp, "fail-open-gate");
});

test("mapSeal encodes the published chmod fail-open", () => {
  const miss = mapSeal({ frangible: true, chmodFailopen: true });
  assert.equal(miss.stamp, "chmod-failopen");
  assert.equal(miss.holdingLane, "spawn-denied");
  assert.equal(miss.ribbon, "frangible");
  const clear = mapSeal({ armed: true, frangible: false });
  assert.equal(clear.stamp, "armed-seal");
  assert.equal(clear.kindLane, "executable");
  assert.equal(clear.holdingLane, "sealed");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.ok(NOT_PRODUCTS.includes("matryoshka"));
  assert.ok(NOT_PRODUCTS.includes("dragnet"));
  assert.ok(NOT_PRODUCTS.includes("matricula"));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("scant"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[4].issue, 94348);
  assert.equal(BACKUPS[5].issue, 94349);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94362));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/frangible.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const armedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/armed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(armedFix.status, 0, armedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const armedOut = JSON.parse(armedFix.stdout);
  assert.equal(idleOut.verdict, "armed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "frangible");
  assert.equal(seededOut.alarm, true);
  assert.equal(armedOut.verdict, "armed");
  assert.equal(armedOut.hold, true);
  assert.match(armedOut.phrase, /admit armed/);
});

test("handle exposes published hypothesis and #94362 headline", () => {
  const result = handle(seedFrangible());
  assert.equal(result.published.issue, 94362);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [67147, 65378, 76808, 88578]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94348));
  assert.ok(result.published.backups.includes(94349));
  assert.ok(!result.published.backups.includes(94362));
  assert.match(
    result.published.hypothesis,
    /chmod|Permission denied|permissionDecision|NON-BINDING|#94362/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94362/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the armed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("armed page is a wax-seal atelier, not nameplate hotel or matryoshka workshop", () => {
  const page = readPage();
  assert.match(page, /family=Cinzel|Cinzel/);
  assert.match(page, /family=Manrope|Manrope/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /frangible|armed|chmod-failopen|wax-press|glass-ampule|shear-pin|warning-slip|stream-silent|fail-open-gate/i,
  );
  assert.match(page, /#1E1740|#E09A3A|#F6EFD8|#3DD6D0|#120E28/i);
  assert.match(page, /\barmed\b/);
  assert.match(page, /\bfrangible\b/);
  assert.match(page, /chmod-failopen/);
  assert.match(page, /Score frangible or admit armed/i);
  assert.match(page, /#368/);
  assert.match(page, /#94362/);
  assert.match(page, /Admit armed/);
  assert.match(page, /Score frangible/);
  assert.match(page, /Walk chmod-failopen/);
  assert.match(page, /Compare armed \/ frangible/);
  assert.match(page, /Pin idle armed/);
  assert.match(page, /Pin seeded frangible/);
  assert.match(page, /Pin chmod-failopen/);
  assert.match(page, /Stamp spawn-denied/);
  assert.match(page, /Score booth/);
  assert.match(page, /frangible-score/);
  assert.match(
    page,
    /permissionDecision|chmod 644|chmod 755|Permission denied|stream-json|hook_started/i,
  );
  assert.match(page, /wax-press|glass-ampule|shear-pin|warning-slip|stream-silent|fail-open-gate/i);
  assert.match(
    page,
    /<svg[\s\S]*class="wax-seal"|class="glass-ampule"|class="shear-pin"|class="cracked-glass"|class="wax-ladle"|class="press-die"/i,
  );
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(page, /family=Yeseva\+One|Yeseva One/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Archivo\+Black|Archivo Black/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Bitter|Bitter/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /#B08D57|#F7F1E5|#3B1F14|#1A1A1A|#2F6F5E/);
  assert.doesNotMatch(page, /#C41E3A|#F4E8D8|#1B2838|#D4A017|#2A2A2A/);
  assert.doesNotMatch(page, /#12151A|#E8E4D9|#E6B422|#4A6FA5|#8B909A/);
  assert.doesNotMatch(page, /hotel door-plate|mahogany door|front-desk ledger|verdigris hinge/i);
  assert.doesNotMatch(page, /lacquer nesting-doll|birch-workshop|gold leaf|indigo cloth/i);
  assert.doesNotMatch(page, /night blotter|caution tape|city-grid|police-fishing/i);
  assert.doesNotMatch(page, /enrollment-desk|enrollment-floor|ivory blotter/i);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /admit affixed|Score nameplate|idle affixed/i);
  assert.doesNotMatch(page, /admit unpacked|Score matryoshka|idle unpacked/i);
  assert.doesNotMatch(page, /admit scoped|Score dragnet|idle scoped/i);
  assert.doesNotMatch(page, /admit enrolled|Score matricula|idle enrolled/i);
  assert.doesNotMatch(page, /\bnameplate\b/);
  assert.doesNotMatch(page, /\bmatryoshka\b/);
  assert.doesNotMatch(page, /\bdragnet\b/);
  assert.doesNotMatch(page, /\bmatricula\b/);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /header-rename/);
  assert.doesNotMatch(page, /subst-nest/);
  assert.doesNotMatch(page, /root-find/);
  assert.doesNotMatch(page, /reload-blind/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.match(page, /NOT Nameplate/i);
  assert.match(page, /NOT Matryoshka/i);
  assert.match(page, /NOT Dragnet/i);
  assert.match(page, /NOT Matricula/i);
  assert.match(page, /#67147/);
  assert.match(page, /#88578/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Frangible/);
  assert.match(readme, /#94362/);
  assert.match(readme, /\barmed\b/);
  assert.match(readme, /\bfrangible\b/);
  assert.match(readme, /chmod-failopen/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.doesNotMatch(readme, /Yeseva One/);
  assert.doesNotMatch(readme, /Archivo Black/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /chmod 644|permissionDecision|Permission denied|stream-json/i);
  assert.match(readme, /NOT Nameplate\/#94349/);
  assert.match(readme, /NOT Matryoshka\/#94350/);
  assert.match(readme, /NOT Dragnet\/#94064/);
  assert.match(readme, /NOT Matricula\/#93987/);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /#67147/);
  assert.match(readme, /#65378/);
  assert.match(readme, /#76808/);
  assert.match(readme, /#88578/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/frangible/);
  assert.match(readme, /node --test projects\/frangible\/frangible\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /wax-seal|ampule|shear-pin|atelier/i);
  assert.match(readme, /Score frangible or admit armed/);
  assert.match(readme, /#93924|#93770|#93777|#94151|#94348|#94349/);
  assert.doesNotMatch(readme, /backup #94362|#94362 as next/);
  assert.match(readme, /07:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bnameplate\b/);
  assert.doesNotMatch(readme, /\bmatryoshka\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Frangible/);
  assert.match(runLog, /07:50/);
});

test("catalog features Frangible only; Nameplate unfeatured; product count 368", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 368);
  assert.equal(hub.products.length, 368);
  assert.equal(catalog.products[0].name, "Frangible");
  assert.equal(catalog.products[0].slug, "frangible");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/frangible/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\barmed\b/);
  assert.match(catalog.products[0].summary, /\bfrangible\b/);
  assert.match(catalog.products[0].summary, /chmod-failopen/);
  assert.match(catalog.products[0].summary, /Score frangible or admit armed/);
  assert.match(catalog.products[0].summary, /#94362/);
  assert.equal(hub.products[0].slug, "frangible");
  assert.equal(hub.products[0].featured, true);
  const nameplate = catalog.products.find((row) => row.slug === "nameplate");
  assert.ok(nameplate);
  assert.equal(nameplate.featured, false);
  const matryoshka = catalog.products.find((row) => row.slug === "matryoshka");
  assert.ok(matryoshka);
  assert.equal(matryoshka.featured, false);
  const dragnet = catalog.products.find((row) => row.slug === "dragnet");
  assert.ok(dragnet);
  assert.equal(dragnet.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "frangible").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94362") && row.slug !== "frangible",
    ),
  );
});

test("vercel rewrites frangible to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/frangible");
  assert.equal(vercel.rewrites[0].destination, "/projects/frangible");
  assert.equal(vercel.rewrites[1].source, "/frangible/");
  assert.equal(vercel.rewrites[1].destination, "/projects/frangible");
  assert.equal(vercel.rewrites[2].source, "/frangible/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/frangible/:path*");
  assert.equal(vercel.rewrites[3].source, "/nameplate");
  assert.equal(vercel.rewrites[3].destination, "/projects/nameplate");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
