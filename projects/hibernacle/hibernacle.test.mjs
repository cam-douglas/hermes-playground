import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  COUSINS,
  CPU_MS,
  DEN_STATIONS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FREE_RAM_GB,
  HIBERNACLE_WALK,
  HOLD,
  IDLE_WORD,
  IDLE_SECONDS,
  ISSUE_URL,
  LABELS,
  MAJFLT,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  SEEDED_WORD,
  STALL_MS,
  STATE,
  TITLE,
  VERDICTS,
  WS_AFTER_MB,
  WS_BEFORE_MB,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectEnter,
  inspectWorkingSet,
  readDen,
  score,
  scoreGate,
  scoreWalk,
  seedDuplicateEnter,
  seedEventLoopStall,
  seedHibernacle,
  seedHold,
  seedMajflt,
  seedPagedOut,
  seedTuiFrozen,
  seedWarm,
  seedWorkingSetTrim,
  simulateStall,
} from "./hibernacle.mjs";

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

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./hibernacle.mjs", import.meta.url));
}

test("idle warm is a hold; working set stays resident", () => {
  const result = analyze(seedWarm());
  assert.equal(result.verdict, "warm");
  assert.equal(result.idleWord, "warm");
  assert.equal(IDLE_WORD, "warm");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.warm, true);
  assert.equal(result.phrase, "admit warm");
  assert.equal(result.workingSetHeld, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify warm", () => {
  assert.equal(classify(emptyTicket()), "warm");
  assert.equal(classify(""), "warm");
  assert.equal(classify(null), "warm");
  assert.equal(decide({}), "warm");
});

test("#93372 seeded path scores paged-out when majflt storms after idle trim", () => {
  const result = analyze(seedPagedOut());
  assert.equal(result.verdict, "paged-out");
  assert.equal(result.seededWord, "paged-out");
  assert.equal(SEEDED_WORD, "paged-out");
  assert.equal(PRODUCT_WORD, "hibernacle");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.pagedOut, true);
  assert.equal(result.phrase, "score hibernacle");
  assert.equal(result.workingSetTrim, true);
  assert.equal(result.majflt, 41105);
  assert.equal(result.stallMs, 4940);
  assert.equal(result.cpuMs, 77);
  assert.equal(result.tuiFrozen, true);
  assert.equal(result.secondEnter, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("simulateStall maps published majflt/cpu onto a ~5s event-loop block", () => {
  const storm = simulateStall({
    majflt: 41105,
    cpuMs: 77,
    workingSetTrim: true,
  });
  assert.equal(storm.stallMs, 4940);
  assert.equal(storm.majflt, 41105);
  assert.equal(storm.eventLoopBlocked, true);
  assert.equal(storm.cpuBound, false);
  assert.equal(storm.stamp, "paged-out");
  const held = simulateStall({ workingSetHeld: true, warm: true });
  assert.equal(held.stallMs, 0);
  assert.equal(held.majflt, 0);
  assert.equal(held.eventLoopBlocked, false);
  assert.equal(held.stamp, "warm");
  const sequential = simulateStall({
    majflt: 41105,
    sequentialFaultIn: true,
    workingSetTrim: true,
  });
  assert.ok(sequential.stallMs < storm.stallMs);
  assert.equal(sequential.scatterRatio, 10);
  assert.ok(sequential.stallMs <= 500);
});

test("path word is majflt; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "majflt");
  const result = analyze(seedMajflt());
  assert.equal(result.verdict, "majflt");
  assert.equal(result.pathWord, "majflt");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "majflt", preferSeed: true, pagedOut: true }),
    "majflt",
  );
  assert.equal(classify(seedWorkingSetTrim()), "working-set-trim");
});

test("HOLD includes warm / hold", () => {
  assert.ok(HOLD.includes("warm"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: trim, stall, tui, duplicate, product", () => {
  assert.equal(classify(seedWorkingSetTrim()), "working-set-trim");
  assert.equal(classify(seedEventLoopStall()), "event-loop-stall");
  assert.equal(classify(seedTuiFrozen()), "tui-frozen");
  assert.equal(classify(seedDuplicateEnter()), "duplicate-enter");
  assert.equal(classify(seedHibernacle()), "hibernacle");
});

test("fixtures flip warm vs paged-out vs majflt", () => {
  const idle = scoreGate(seedWarm());
  const seeded = scoreGate(readData("hibernacle.json"));
  const warm = readData("warm.json");
  const paged = readData("paged-out.json");
  const path = readData("majflt.json");
  assert.equal(idle.verdict, "warm");
  assert.equal(seeded.verdict, "paged-out");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedWarm()), "warm");
  assert.equal(score(readData("hibernacle.json")), "paged-out");
  assert.equal(warm.workingSetHeld, true);
  assert.equal(scoreGate(warm).verdict, "warm");
  assert.equal(paged.majflt, 41105);
  assert.equal(paged.stallMs, 4940);
  assert.equal(paged.secondEnter, true);
  assert.equal(classify(paged), "paged-out");
  assert.equal(path.majflt, 41105);
  assert.equal(classify(path), "majflt");
  const fixture = readData("hibernacle.json");
  assert.equal(fixture.workingSetTrim, true);
  assert.equal(fixture.tuiFrozen, true);
  assert.equal(fixture.issue, 93372);
  assert.equal(fixture.freeRamGb, 12.5);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("warm"));
  assert.ok(CHIPS.includes("paged-out"));
  assert.ok(CHIPS.includes("hibernacle"));
  assert.ok(CHIPS.includes("majflt"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("paged-out"));
  assert.ok(ALARM.includes("majflt"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published hibernacle walk scores paged-out after the idle hold", () => {
  const desk = scoreWalk({ rows: HIBERNACLE_WALK });
  assert.equal(desk.verdict, "paged-out");
  assert.ok(desk.pagedOutCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-warm");
  assert.equal(idle.warm, true);
  assert.equal(idle.verdict, "warm");
  const trim = desk.rows.find((row) => row.event === "working-set-trim");
  assert.equal(trim.workingSetTrim, true);
  const stall = desk.rows.find((row) => row.event === "event-loop-stall");
  assert.equal(stall.eventLoopStall, true);
  const faults = desk.rows.find((row) => row.event === "majflt-41105");
  assert.equal(faults.majflt, 41105);
  const tui = desk.rows.find((row) => row.event === "tui-frozen");
  assert.equal(tui.tuiFrozen, true);
  const again = desk.rows.find((row) => row.event === "second-enter");
  assert.equal(again.secondEnter, true);
  const dup = desk.rows.find((row) => row.event === "duplicate-submit");
  assert.equal(dup.duplicateEnter, true);
  const cut = desk.rows.find((row) => row.event === "paged-out");
  assert.equal(cut.pagedOut, true);
  const path = desk.rows.find((row) => row.event === "majflt");
  assert.equal(path.verdict, "majflt");
});

test("HIBERNACLE_WALK constant matches the issue den walk", () => {
  assert.equal(HIBERNACLE_WALK[0].event, "cue-warm");
  const faults = HIBERNACLE_WALK.find((row) => row.event === "majflt-41105");
  assert.equal(faults.majflt, 41105);
  const cut = HIBERNACLE_WALK.find((row) => row.event === "paged-out");
  assert.equal(cut.tuiFrozen, true);
  assert.equal(cut.secondEnter, true);
  const path = HIBERNACLE_WALK.find((row) => row.event === "majflt");
  assert.equal(path.pagedOut, true);
  const scoreRow = HIBERNACLE_WALK.find((row) => row.event === "hibernacle");
  assert.equal(scoreRow.pagedOut, true);
});

test("issue constants encode only #93372 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93372);
  assert.ok(ISSUE_URL.includes("93372"));
  assert.match(TITLE, /working-set trim/);
  assert.match(TITLE, /41k major page faults/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:tui"));
  assert.equal(AUTHOR, "ramgalv");
  assert.equal(FILED, "2026-09-10T15:04:30Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.261.355");
  assert.match(OS, /Windows 11/);
  assert.equal(FREE_RAM_GB, 12.5);
  assert.equal(IDLE_SECONDS, 145);
  assert.equal(STALL_MS, 4940);
  assert.equal(CPU_MS, 77);
  assert.equal(MAJFLT, 41105);
  assert.equal(WS_BEFORE_MB, 504);
  assert.equal(WS_AFTER_MB, 946);
  assert.equal(DEN_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("working-set-trim"));
  assert.ok(FINGERPRINT_LINES.includes("event-loop-stall"));
  assert.ok(FINGERPRINT_LINES.includes("duplicate-enter"));
  assert.match(PHRASE, /score hibernacle or admit warm/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "routed",
    "inherited",
    "cascade",
    "appanage",
    "afloat",
    "washed",
    "pontoon",
    "concordant",
    "concordat",
    "reaped",
    "revenant",
    "vernier",
    "slider",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("warm den flips paged-out back when RSS is held", () => {
  const tape = {
    warm: true,
    workingSetHeld: true,
    pagedOut: false,
    cue: "warm",
  };
  assert.equal(scoreGate(tape).verdict, "warm");
  tape.warm = false;
  tape.pagedOut = true;
  tape.workingSetTrim = true;
  tape.majflt = 41105;
  tape.cue = "paged-out";
  assert.equal(scoreGate(tape).verdict, "paged-out");
  tape.warm = true;
  tape.pagedOut = false;
  tape.workingSetTrim = false;
  tape.workingSetHeld = true;
  tape.majflt = 0;
  tape.cue = "warm";
  assert.equal(scoreGate(tape).verdict, "warm");
});

test("working set, enter, and den mark paged-out after majflt storm", () => {
  const idle = inspectWorkingSet({ workingSetHeld: true });
  assert.equal(idle.stamp, "warm");
  assert.equal(idle.workingSetTrim, false);
  const cut = inspectWorkingSet({
    workingSetTrim: true,
    freeRamGb: 12.5,
    wsBeforeMb: 504,
    wsAfterMb: 946,
    privateMb: 834,
  });
  assert.equal(cut.stamp, "paged-out");
  assert.equal(cut.abundantRam, true);
  assert.equal(cut.faultIn, true);
  const live = inspectEnter({ workingSetHeld: true, warm: true });
  assert.equal(live.stamp, "warm");
  const reject = inspectEnter({
    workingSetTrim: true,
    majflt: 41105,
    tuiFrozen: true,
    secondEnter: true,
  });
  assert.equal(reject.stamp, "paged-out");
  assert.equal(reject.duplicate, true);
  const desk = readDen({
    pagedOut: true,
    workingSetTrim: true,
    majflt: 41105,
  });
  assert.equal(desk.pagedOut, true);
  assert.equal(desk.cue, "paged-out");
  const calm = readDen({
    warm: true,
    workingSetHeld: true,
    pagedOut: false,
  });
  assert.equal(calm.pagedOut, false);
  assert.equal(calm.cue, "warm");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 88375);
  assert.equal(COUSINS[1].issue, 92005);
  assert.equal(COUSINS[3].issue, 75571);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("cartulary"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.ok(NOT_PRODUCTS.includes("appanage"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93348);
  assert.equal(BACKUPS[3].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/hibernacle.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "warm");
  assert.equal(JSON.parse(seeded.stdout).verdict, "paged-out");
});

test("handle exposes published hypothesis and #93372 headline", () => {
  const result = handle(readData("hibernacle.json"));
  assert.equal(result.published.issue, 93372);
  assert.equal(result.published.claudeCodeVersion, "2.1.261.355");
  assert.equal(result.published.author, "ramgalv");
  assert.equal(result.published.majflt, 41105);
  assert.equal(result.published.stallMs, 4940);
  assert.equal(result.published.freeRamGb, 12.5);
  assert.deepEqual(result.published.cousins, [88375, 92005, 87987, 75571]);
  assert.ok(result.published.backups.includes(93348));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /working-set trim/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedPagedOut()),
    /paged-out\|ws=trimmed\|majflt=storm\|tui=frozen\|enter=dup\|cue=paged-out/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a winter hibernacle den, not a desert scapegoat altar", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond/);
  assert.match(page, /Sora/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /hibernacle|winter den|frost linen|ember|moss/i);
  assert.match(page, /#0b1018|#dce3ea|#7eb8c9|#4a7c59|#e08a3c/);
  assert.match(page, /warm/);
  assert.match(page, /paged-out/);
  assert.match(page, /majflt/);
  assert.match(page, /score hibernacle or admit warm/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /01:50/);
  assert.match(page, /#273/);
  assert.match(page, /#93372/);
  assert.match(page, /ramgalv/);
  assert.match(page, /2\.1\.261/);
  assert.match(page, /41105/);
  assert.match(page, /12\.5/);
  assert.match(page, /Stir the den/);
  assert.match(page, /Score hibernacle/);
  assert.match(page, /Walk the frost/);
  assert.match(page, /Inspect the working set/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /#2a241c/);
  assert.doesNotMatch(page, /#c4a35a/);
  assert.doesNotMatch(page, /#8b3a2a/);
  assert.doesNotMatch(page, /#1a1410/);
  assert.doesNotMatch(page, /#0f0d0b/);
  assert.doesNotMatch(page, /#4a3420/);
  assert.doesNotMatch(page, /#5c3d22/);
  assert.doesNotMatch(page, /#e8dcc4/);
  assert.doesNotMatch(page, /#c4923a/);
  assert.doesNotMatch(page, /ash altar|goat-bell|bone linen|grant-table|rust-blood/i);
  assert.doesNotMatch(page, /oak lectern|bound quires|inkhorn|register index/i);
  assert.doesNotMatch(page, /wax press|issuer ribbon|signature paraph/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|letters patent|heraldic/i);
  assert.doesNotMatch(page, /\bscapegoat\b/);
  assert.doesNotMatch(page, /\bcartulary\b/);
  assert.doesNotMatch(page, /\bparaph\b/);
  assert.doesNotMatch(page, /\bappanage\b/);
  assert.doesNotMatch(page, /\bpontoon\b/);
  assert.doesNotMatch(page, /\brevenant\b/);
  assert.doesNotMatch(page, /\bhonest\b/);
  assert.doesNotMatch(page, /\bscapegoated\b/);
  assert.doesNotMatch(page, /\bungranted\b/);
  assert.doesNotMatch(page, /\bbound\b/);
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Cartulary/i);
  assert.match(page, /NOT Paraph/i);
  assert.match(page, /NOT Appanage/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Concordat/i);
  assert.match(page, /NOT Revenant/i);
  assert.match(page, /NOT Replevin/i);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Buoy/i);
  assert.match(page, /NOT Vernier/i);
  assert.match(page, /NOT Scion/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Hibernacle/);
  assert.match(readme, /#93372/);
  assert.match(readme, /warm/);
  assert.match(readme, /paged-out/);
  assert.match(readme, /majflt/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Sora/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Cartulary/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /NOT Appanage/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Concordat/i);
  assert.match(readme, /NOT Revenant/i);
  assert.match(readme, /NOT Vernier/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/hibernacle/);
  assert.match(readme, /node --test projects\/hibernacle\/hibernacle\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /working-set trim/);
  assert.match(readme, /#88375/);
  assert.match(readme, /#93348/);
  assert.match(readme, /#93219/);
});

test("catalog #273 features Hibernacle only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 273);
  assert.equal(catalog.products[0].name, "Hibernacle");
  assert.equal(catalog.products[0].slug, "hibernacle");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/hibernacle/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /01:50/);
  assert.match(catalog.products[0].summary, /hibernacle/);
  assert.match(catalog.products[0].summary, /#93372/);
  assert.match(catalog.products[0].summary, /warm/);
  assert.match(catalog.products[0].summary, /paged-out/);
  assert.match(catalog.products[0].summary, /majflt/);
  const scapegoat = catalog.products.find((row) => row.slug === "scapegoat");
  assert.ok(scapegoat);
  assert.equal(scapegoat.featured, false);
  const cartulary = catalog.products.find((row) => row.slug === "cartulary");
  assert.ok(cartulary);
  assert.equal(cartulary.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "hibernacle").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93372") && row.slug !== "hibernacle"));
});

test("vercel rewrites hibernacle to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/hibernacle");
  assert.equal(vercel.rewrites[0].destination, "/projects/hibernacle");
  assert.equal(vercel.rewrites[1].source, "/hibernacle/");
  assert.equal(vercel.rewrites[1].destination, "/projects/hibernacle");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
