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
  VESTRY_WALK,
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
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_VESTRY_PROOF,
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
  inspectCensus,
  inspectInflight,
  inspectPlaceholders,
  inspectRail,
  mapSacristy,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedInflightZero,
  seedVestry,
  seedPegged,
  seedHold,
  seedMountRefcountRace,
  seedProduct,
  seedPlaceholderSet,
} from "./vestry.mjs";

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
  return fileURLToPath(new URL("./vestry.mjs", import.meta.url));
}

test("idle pegged is a hold; concurrent hangers respected", () => {
  const result = analyze(seedPegged());
  assert.equal(result.verdict, "pegged");
  assert.equal(result.idleWord, "pegged");
  assert.equal(IDLE_WORD, "pegged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pegged, true);
  assert.equal(result.phrase, "admit pegged");
  assert.equal(result.vestry, false);
  assert.equal(result.mountRefcountRace, false);
  assert.ok(HOLD_ALIASES.includes("pegged"));
  assert.ok(HOLD_ALIASES.includes("hung"));
  assert.ok(HOLD_ALIASES.includes("stowed"));
  assert.ok(HOLD_ALIASES.includes("refcounted"));
  assert.ok(HOLD_ALIASES.includes("co-tenant"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify pegged", () => {
  assert.equal(classify(emptyTicket()), "pegged");
  assert.equal(classify(""), "pegged");
  assert.equal(classify(null), "pegged");
  assert.equal(decide({}), "pegged");
});

test("#94008 seeded path scores vestry when the attendant clears all pegs", () => {
  const result = analyze(seedVestry());
  assert.equal(result.verdict, "vestry");
  assert.equal(result.seededWord, "vestry");
  assert.equal(SEEDED_WORD, "vestry");
  assert.equal(PRODUCT_WORD, "vestry");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.vestry, true);
  assert.equal(result.phrase, "score vestry");
  assert.equal(result.mountRefcountRace, true);
  assert.equal(result.placeholderSet, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark stripped rail and placeholder-set", () => {
  const rail = inspectRail({ vestry: true, mountRefcountRace: true });
  assert.equal(rail.stamp, "rail-stripped");
  assert.equal(rail.stripped, true);
  const placeholders = inspectPlaceholders({ vestry: true, placeholderSet: true });
  assert.equal(placeholders.stamp, "placeholder-set");
  assert.equal(placeholders.local, true);
  const inflight = inspectInflight({ vestry: true, inflightZero: true });
  assert.equal(inflight.stamp, "inflight-zero");
  const scored = scoreGate({
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
    inflightZero: true,
    cue: "vestry",
  });
  assert.equal(scored.verdict, "vestry");
  const open = inspectRail({ pegged: true, vestry: false });
  assert.equal(open.stamp, "rail-pegged");
});

test("path word is mount-refcount-race; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "mount-refcount-race");
  const result = analyze(seedMountRefcountRace());
  assert.equal(result.verdict, "mount-refcount-race");
  assert.equal(result.pathWord, "mount-refcount-race");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "mount-refcount-race", preferSeed: true, vestry: true }),
    "mount-refcount-race",
  );
  assert.equal(classify(seedPlaceholderSet()), "placeholder-set");
});

test("HOLD includes pegged / hold", () => {
  assert.ok(HOLD.includes("pegged"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: placeholder-set, inflight-zero, vestry", () => {
  assert.equal(classify(seedPlaceholderSet()), "placeholder-set");
  assert.equal(classify(seedInflightZero()), "inflight-zero");
  assert.equal(classify(seedProduct()), "vestry");
});

test("booth fixtures flip pegged vs vestry vs mount-refcount-race", () => {
  const idle = scoreGate(seedPegged());
  const seeded = scoreGate(seedVestry());
  const pegged = readData("pegged.json");
  const vestry = readData("vestry.json");
  const path = readData("mount-refcount-race.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "pegged");
  assert.equal(seeded.verdict, "vestry");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedPegged()), "pegged");
  assert.equal(score(seedVestry()), "vestry");
  assert.equal(pegged.mountRefcountRace, false);
  assert.equal(pegged.pegged, true);
  assert.equal(scoreGate(pegged).verdict, "pegged");
  assert.equal(vestry.mountRefcountRace, true);
  assert.equal(vestry.placeholderSet, true);
  assert.equal(vestry.inflightZero, true);
  assert.equal(classify(vestry), "vestry");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /pegged|hung|stowed|refcounted|co-tenant/i);
  assert.match(path.paths[1].result, /84|inFlight|placeholder|bwrap|retry/i);
  assert.equal(classify(path), "mount-refcount-race");
  assert.equal(vestry.hubCount, "VESTRY");
  assert.equal(vestry.issue, 94008);
  assert.equal(vestry.vestry, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("hung.json")), "hung");
  assert.equal(classify(readData("stowed.json")), "stowed");
  assert.equal(classify(readData("refcounted.json")), "refcounted");
  assert.equal(classify(readData("co-tenant.json")), "co-tenant");
  assert.equal(classify(readData("placeholder-set.json")), "placeholder-set");
  assert.equal(classify(readData("inflight-zero.json")), "inflight-zero");
  assert.equal(classify(readData("cross-process.json")), "cross-process");
  assert.equal(classify(readData("bash-retry.json")), "bash-retry");
  assert.equal(classify(readData("sessions-84.json")), "sessions-84");
  assert.equal(classify(readData("ro-bind-null.json")), "ro-bind-null");
  assert.equal(classify(readData("empty-tmpdir.json")), "empty-tmpdir");
  assert.equal(classify(readData("no-lock.json")), "no-lock");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("pegged"));
  assert.ok(CHIPS.includes("vestry"));
  assert.ok(CHIPS.includes("mount-refcount-race"));
  assert.ok(CHIPS.includes("placeholder-set"));
  assert.ok(CHIPS.includes("inflight-zero"));
  assert.ok(CHIPS.includes("hung"));
  assert.ok(CHIPS.includes("stowed"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("vestry"));
  assert.ok(ALARM.includes("mount-refcount-race"));
  assert.ok(ALARM.includes("placeholder-set"));
  assert.ok(ALARM.includes("inflight-zero"));
  assert.ok(ALARM.includes("cross-process"));
  assert.ok(ALARM.includes("bash-retry"));
  assert.ok(ALARM.includes("sessions-84"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published vestry walk scores vestry after the idle hold", () => {
  const booth = scoreWalk({ rows: VESTRY_WALK });
  assert.equal(booth.verdict, "vestry");
  assert.ok(booth.vestryCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-pegged");
  assert.equal(idle.pegged, true);
  assert.equal(idle.verdict, "pegged");
  const cut = booth.rows.find((row) => row.event === "mount-refcount-race");
  assert.equal(cut.mountRefcountRace, true);
  const path = booth.rows.find((row) => row.event === "mount-refcount-race" && row.t === "path");
  assert.equal(path.verdict, "mount-refcount-race");
});

test("VESTRY_WALK constant matches the issue sacristy walk", () => {
  assert.equal(VESTRY_WALK[0].event, "cue-pegged");
  const cut = VESTRY_WALK.find((row) => row.event === "mount-refcount-race");
  assert.equal(cut.mountRefcountRace || cut.inflightZero, true);
  const path = VESTRY_WALK.find((row) => row.t === "path");
  assert.equal(path.vestry, true);
  const scoreRow = VESTRY_WALK.find((row) => row.event === "vestry");
  assert.equal(scoreRow.vestry, true);
});

test("positive control pegged rail stays pegged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "pegged");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "pegged");
  const hold = walk.rows.find((row) => row.event === "cue-pegged");
  assert.equal(hold.pegged, true);
  assert.equal(hold.verdict, "pegged");
});

test("issue constants encode only #94008 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94008);
  assert.ok(ISSUE_URL.includes("94008"));
  assert.match(TITLE, /bwrap|refcount|placeholder|concurrent|Linux sandbox/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "linux");
  assert.match(HOST, /Bash sandbox/);
  assert.equal(BUILD, "2.1.270");
  assert.equal(SURFACE, "mount-refcount-race");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:linux", "area:sandbox"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Demesne|#93989/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Surfeit|#94012/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Phosphene|#94003/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Foundling|#93889/i.test(row)));
  assert.ok(EXPECTED.some((row) => /refcount|placeholder|inFlight|project root|Bash/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.270|84|inFlight|module-level Set|2026-07-07|2026-09-10/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("mount-refcount-race"));
  assert.ok(FINGERPRINT_LINES.includes("vestry"));
  assert.equal(PHRASE, "Score vestry or admit pegged.");
  assert.equal(SAMPLE_VESTRY_PROOF.mountRefcountRace, true);
});

test("has-repro fingerprints encode the published vestry proof", () => {
  const result = handle(seedVestry());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "mount-refcount-race");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedVestry()),
    /vestry\|kind=mount-refcount-race\|sessions=84\|path=mount-refcount-race\|cue=mount-refcount-race/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes tempered/quiescent/diplomatic/demesned and recent catalog words", () => {
  const required = [
    "tempered",
    "surfeit",
    "quota-spawn-cascade",
    "quiescent",
    "phosphene",
    "layer-tree-walk",
    "diplomatic",
    "parablepsis",
    "latin1-edit-wipe",
    "demesned",
    "demesne",
    "home-bind-overreach",
    "diagrammed",
    "cartouche",
    "section-poster",
    "unattainted",
    "attaint",
    "session-attainder",
    "reflowed",
    "oriel",
    "plan-no-reflow",
    "articulate",
    "anarthria",
    "dictation-paste-drop",
    "limber",
    "trismus",
    "notif-xpc-deadlock",
    "filiated",
    "foundling",
    "subagent-bash-outlive",
    "injective",
    "crased",
    "crasis",
    "unitary",
    "tessellated",
    "verbatim",
    "mojibaked",
    "afterimage",
    "scotoma",
    "followspot",
    "thrash",
    "solvent",
    "frugal",
    "circuit-held",
    "no-spawn",
    "vested",
    "plenary",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("pegged booth flips vestry back when the rail is pegged", () => {
  const tape = {
    pegged: true,
    vestry: false,
    mountRefcountRace: false,
    cue: "pegged",
  };
  assert.equal(scoreGate(tape).verdict, "pegged");
  tape.pegged = false;
  tape.vestry = true;
  tape.mountRefcountRace = true;
  tape.placeholderSet = true;
  tape.cue = "vestry";
  assert.equal(scoreGate(tape).verdict, "vestry");
  tape.pegged = true;
  tape.vestry = false;
  tape.mountRefcountRace = false;
  tape.placeholderSet = false;
  tape.cue = "pegged";
  assert.equal(scoreGate(tape).verdict, "pegged");
});

test("rail, placeholders, inflight, and readBooth mark the vestry proof", () => {
  const idle = inspectRail({
    pegged: true,
  });
  assert.equal(idle.stamp, "rail-pegged");
  const placeholders = inspectPlaceholders({ vestry: true, placeholderSet: true });
  assert.equal(placeholders.stamp, "placeholder-set");
  assert.equal(placeholders.local, true);
  const inflight = inspectInflight({ vestry: true, inflightZero: true });
  assert.equal(inflight.stamp, "inflight-zero");
  const booth = readBooth({
    vestry: true,
    mountRefcountRace: true,
    placeholderSet: true,
  });
  assert.equal(booth.vestry, true);
  assert.equal(booth.mark, "vestry");
  const open = readBooth({
    pegged: true,
    vestry: false,
    mountRefcountRace: false,
  });
  assert.equal(open.vestry, false);
  assert.equal(open.mark, "pegged");
});

test("mapSacristy encodes the published stripped rail", () => {
  const miss = mapSacristy({ vestry: true, mountRefcountRace: true });
  assert.equal(miss.stamp, "mount-refcount-race");
  assert.equal(miss.holdingLane, "stripped");
  assert.equal(miss.ribbon, "vestry");
  const clear = mapSacristy({ pegged: true, vestry: false });
  assert.equal(clear.stamp, "pegged-rail");
  assert.equal(clear.kindLane, "stowed");
  assert.equal(clear.holdingLane, "hung");
});

test("cousins cite #81602 #77271 #79248 #46165 #78072 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 81602);
  assert.equal(COUSINS[1].issue, 77271);
  assert.equal(COUSINS[2].issue, 79248);
  assert.equal(COUSINS[3].issue, 46165);
  assert.equal(COUSINS[4].issue, 78072);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("surfeit"));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("thrash"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93770);
  assert.equal(BACKUPS[7].issue, 93996);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94008));
  assert.ok(!BACKUPS.some((row) => row.issue === 81602));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/vestry.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const peggedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/pegged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(peggedFix.status, 0, peggedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const peggedOut = JSON.parse(peggedFix.stdout);
  assert.equal(idleOut.verdict, "pegged");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "vestry");
  assert.equal(seededOut.alarm, true);
  assert.equal(peggedOut.verdict, "pegged");
  assert.equal(peggedOut.hold, true);
  assert.match(peggedOut.phrase, /admit pegged/);
});

test("handle exposes published hypothesis and #94008 headline", () => {
  const result = handle(seedVestry());
  assert.equal(result.published.issue, 94008);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [81602, 77271, 79248, 46165, 78072]);
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93996));
  assert.ok(!result.published.backups.includes(94008));
  assert.match(result.published.hypothesis, /refcount|placeholder|process-local|NON-BINDING|#94008/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94008/);
  assert.equal(result.published.build, BUILD);
  assert.equal(inspectCensus({ vestry: true, sessions84: true }).sessions, 84);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a sacristy peg-rail booth, not banquet cellar or clinic or manor", () => {
  const page = readPage();
  assert.match(page, /family=Cormorant\+Upright|Cormorant Upright/);
  assert.match(page, /family=Karla|Karla/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(page, /vestry|pegged|mount-refcount-race|sacristy|peg-rail|stole/i);
  assert.match(page, /#C8C2B4|#2C3A6E|#F4F0E6|#B08D57|#6B6560|#1C1A17|#6E2432/i);
  assert.match(page, /\bpegged\b/);
  assert.match(page, /\bvestry\b/);
  assert.match(page, /mount-refcount-race/);
  assert.match(page, /Score vestry or admit pegged/i);
  assert.match(page, /#343/);
  assert.match(page, /#94008/);
  assert.match(page, /Admit pegged/);
  assert.match(page, /Score vestry/);
  assert.match(page, /Walk mount-refcount-race/);
  assert.match(page, /Compare pegged \/ vestry/);
  assert.match(page, /Pin idle pegged/);
  assert.match(page, /Pin seeded vestry/);
  assert.match(page, /Pin mount-refcount-race/);
  assert.match(page, /Hang the rail/);
  assert.match(page, /Score booth/);
  assert.match(page, /vestry-score/);
  assert.match(page, /84|inFlight|2\.1\.270|placeholder|--ro-bind|bwrap/i);
  assert.match(page, /sacristy|peg-rail|stole|acolyte|vestment|robe-rail/i);
  assert.doesNotMatch(page, /Fraunces|family=Fraunces/);
  assert.doesNotMatch(page, /Manrope|family=Manrope/);
  assert.doesNotMatch(page, /DM Mono|DM\+Mono/);
  assert.doesNotMatch(page, /Syne|family=Syne/);
  assert.doesNotMatch(page, /Sora|family=Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=UnifrakturMaguntia|UnifrakturMaguntia/);
  assert.doesNotMatch(page, /Epilogue/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Instrument Serif|Instrument\+Serif/);
  assert.doesNotMatch(page, /Plus Jakarta|Plus\+Jakarta/);
  assert.doesNotMatch(page, /#3B0F1A/);
  assert.doesNotMatch(page, /#E6B84D/);
  assert.doesNotMatch(page, /#12151C/);
  assert.doesNotMatch(page, /#8B7CFF/);
  assert.doesNotMatch(page, /#E8FF6A/);
  assert.doesNotMatch(page, /#1F6F6A/);
  assert.doesNotMatch(page, /#E2E6EC/);
  assert.doesNotMatch(page, /#1F2B4D/);
  assert.doesNotMatch(page, /#7C2434/);
  assert.doesNotMatch(page, /#B8944A/);
  assert.doesNotMatch(page, /#E4D5B5/);
  assert.doesNotMatch(page, /#1A4A36/);
  assert.doesNotMatch(page, /#4A3018/);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|lapis|limestone/i);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /entoptic|vitreous|isopter|sclera/i);
  assert.doesNotMatch(page, /banquet cellar|empty cask|quota-spawn/i);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /\bquiescent\b/);
  assert.doesNotMatch(page, /\bphosphene\b/);
  assert.doesNotMatch(page, /\btempered\b/);
  assert.doesNotMatch(page, /\bsurfeit\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /layer-tree-walk/);
  assert.doesNotMatch(page, /quota-spawn-cascade/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Surfeit/i);
  assert.match(page, /NOT Phosphene/i);
  assert.match(page, /NOT Parablepsis/i);
  assert.match(page, /NOT Demesne/i);
  assert.match(page, /NOT Cartouche/i);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Vestry/);
  assert.match(readme, /#94008/);
  assert.match(readme, /\bpegged\b/);
  assert.match(readme, /\bvestry\b/);
  assert.match(readme, /mount-refcount-race/);
  assert.match(readme, /Cormorant Upright/);
  assert.match(readme, /Karla/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /DM Mono/);
  assert.doesNotMatch(readme, /Syne/);
  assert.doesNotMatch(readme, /Sora/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /UnifrakturMaguntia/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /MOUNT-REFCOUNT RACE|MOUNT-REFCOUNT-RACE/i);
  assert.match(readme, /NOT Surfeit\/#94012/);
  assert.match(readme, /NOT Phosphene\/#94003/);
  assert.match(readme, /NOT Parablepsis\/#93954/);
  assert.match(readme, /NOT Demesne\/#93989/);
  assert.match(readme, /NOT Cartouche\/#93772/);
  assert.match(readme, /NOT Attaint\/#93821/);
  assert.match(readme, /NOT Oriel\/#93809/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /NOT Trismus\/#93823/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /#81602|#77271|#79248|#46165|#78072/);
  assert.match(readme, /84|inFlight|2\.1\.270|placeholder|bwrap/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/vestry/);
  assert.match(readme, /node --test projects\/vestry\/vestry\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /sacristy|peg-rail|vestry/i);
  assert.match(readme, /Score vestry or admit pegged/);
  assert.match(readme, /#93770|#93777|#93924|#93925|#93967|#93957|#93987|#93996/);
  assert.match(readme, /02:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Vestry/);
  assert.match(runLog, /02:50/);
});

test("catalog features Vestry only; Surfeit unfeatured; product count 343", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 343);
  assert.equal(hub.products.length, 343);
  assert.equal(catalog.products[0].name, "Vestry");
  assert.equal(catalog.products[0].slug, "vestry");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/vestry/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "02:50 vestry: a liturgical vestry / sacristy / peg-rail booth for #94008. Linux bwrap placeholder mount cleanup is per-process with no cross-process refcount — concurrent sessions on one project root delete each other's mount points. Idle pegged / seeded vestry / path mount-refcount-race. Score vestry or admit pegged.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bpegged\b/);
  assert.match(catalog.products[0].summary, /\bvestry\b/);
  assert.match(catalog.products[0].summary, /mount-refcount-race/);
  assert.match(catalog.products[0].summary, /Score vestry or admit pegged/);
  assert.equal(hub.products[0].slug, "vestry");
  assert.equal(hub.products[0].featured, true);
  const surfeit = catalog.products.find((row) => row.slug === "surfeit");
  assert.ok(surfeit);
  assert.equal(surfeit.featured, false);
  const phosphene = catalog.products.find((row) => row.slug === "phosphene");
  assert.ok(phosphene);
  assert.equal(phosphene.featured, false);
  const parablepsis = catalog.products.find((row) => row.slug === "parablepsis");
  assert.ok(parablepsis);
  assert.equal(parablepsis.featured, false);
  const demesne = catalog.products.find((row) => row.slug === "demesne");
  assert.ok(demesne);
  assert.equal(demesne.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "vestry").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94008") && row.slug !== "vestry"));
});

test("vercel rewrites vestry to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/vestry");
  assert.equal(vercel.rewrites[0].destination, "/projects/vestry");
  assert.equal(vercel.rewrites[1].source, "/vestry/");
  assert.equal(vercel.rewrites[1].destination, "/projects/vestry");
  assert.equal(vercel.rewrites[2].source, "/vestry/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/vestry/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
