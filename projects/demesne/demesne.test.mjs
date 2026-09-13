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
  DEMESNE_WALK,
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
  SAMPLE_DEMESNE_PROOF,
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
  inspectBind,
  inspectHolding,
  inspectWrite,
  mapScope,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBareHomeWrite,
  seedDemesne,
  seedDemesned,
  seedHold,
  seedHomeBindOverreach,
  seedProduct,
  seedWholeHomeBind,
} from "./demesne.mjs";

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
  return fileURLToPath(new URL("./demesne.mjs", import.meta.url));
}

test("idle demesned is a hold; bind scoped to $HOME", () => {
  const result = analyze(seedDemesned());
  assert.equal(result.verdict, "demesned");
  assert.equal(result.idleWord, "demesned");
  assert.equal(IDLE_WORD, "demesned");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.demesned, true);
  assert.equal(result.phrase, "admit demesned");
  assert.equal(result.demesne, false);
  assert.equal(result.homeBindOverreach, false);
  assert.ok(HOLD_ALIASES.includes("demesned"));
  assert.ok(HOLD_ALIASES.includes("home-scoped"));
  assert.ok(HOLD_ALIASES.includes("private-holding"));
  assert.ok(HOLD_ALIASES.includes("bind-home"));
  assert.ok(HOLD_ALIASES.includes("user-home"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify demesned", () => {
  assert.equal(classify(emptyTicket()), "demesned");
  assert.equal(classify(""), "demesned");
  assert.equal(classify(null), "demesned");
  assert.equal(decide({}), "demesned");
});

test("#93989 seeded path scores demesne when /home is overbound", () => {
  const result = analyze(seedDemesne());
  assert.equal(result.verdict, "demesne");
  assert.equal(result.seededWord, "demesne");
  assert.equal(SEEDED_WORD, "demesne");
  assert.equal(PRODUCT_WORD, "demesne");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.demesne, true);
  assert.equal(result.phrase, "score demesne");
  assert.equal(result.homeBindOverreach, true);
  assert.equal(result.wholeHomeBind, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark overbound holding and whole-home bind", () => {
  const holding = inspectHolding({ demesne: true, homeBindOverreach: true });
  assert.equal(holding.stamp, "holding-overbound");
  assert.equal(holding.overbound, true);
  const bind = inspectBind({ demesne: true, wholeHomeBind: true });
  assert.equal(bind.stamp, "whole-home-bind");
  assert.equal(bind.target, "/home");
  const write = inspectWrite({ demesne: true, mcpDenied: true });
  assert.equal(write.stamp, "mcp-denied");
  const scored = scoreGate({
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
    bareHomeWrite: true,
    cue: "demesne",
  });
  assert.equal(scored.verdict, "demesne");
  const open = inspectHolding({ demesned: true, demesne: false });
  assert.equal(open.stamp, "holding-private");
});

test("path word is home-bind-overreach; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "home-bind-overreach");
  const result = analyze(seedHomeBindOverreach());
  assert.equal(result.verdict, "home-bind-overreach");
  assert.equal(result.pathWord, "home-bind-overreach");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "home-bind-overreach", preferSeed: true, demesne: true }),
    "home-bind-overreach",
  );
  assert.equal(classify(seedWholeHomeBind()), "whole-home-bind");
});

test("HOLD includes demesned / hold", () => {
  assert.ok(HOLD.includes("demesned"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: whole-home-bind, bare-home-write, demesne", () => {
  assert.equal(classify(seedWholeHomeBind()), "whole-home-bind");
  assert.equal(classify(seedBareHomeWrite()), "bare-home-write");
  assert.equal(classify(seedProduct()), "demesne");
});

test("booth fixtures flip demesned vs demesne vs home-bind-overreach", () => {
  const idle = scoreGate(seedDemesned());
  const seeded = scoreGate(seedDemesne());
  const demesned = readData("demesned.json");
  const demesne = readData("demesne.json");
  const path = readData("home-bind-overreach.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "demesned");
  assert.equal(seeded.verdict, "demesne");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDemesned()), "demesned");
  assert.equal(score(seedDemesne()), "demesne");
  assert.equal(demesned.homeBindOverreach, false);
  assert.equal(demesned.demesned, true);
  assert.equal(scoreGate(demesned).verdict, "demesned");
  assert.equal(demesne.homeBindOverreach, true);
  assert.equal(demesne.wholeHomeBind, true);
  assert.equal(demesne.bareHomeWrite, true);
  assert.equal(classify(demesne), "demesne");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /demesned|\$HOME|home-scoped|private/i);
  assert.match(path.paths[1].result, /\/home|Permission denied|overbound|mcp\.json/i);
  assert.equal(classify(path), "home-bind-overreach");
  assert.equal(demesne.hubCount, "DEMESNE");
  assert.equal(demesne.issue, 93989);
  assert.equal(demesne.demesne, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("home-scoped.json")), "home-scoped");
  assert.equal(classify(readData("private-holding.json")), "private-holding");
  assert.equal(classify(readData("bind-home.json")), "bind-home");
  assert.equal(classify(readData("user-home.json")), "user-home");
  assert.equal(classify(readData("whole-home-bind.json")), "whole-home-bind");
  assert.equal(classify(readData("bare-home-write.json")), "bare-home-write");
  assert.equal(classify(readData("mcp-denied.json")), "mcp-denied");
  assert.equal(classify(readData("root-owned-commons.json")), "root-owned-commons");
  assert.equal(classify(readData("env-scrub.json")), "env-scrub");
  assert.equal(classify(readData("safe-mode.json")), "safe-mode");
  assert.equal(classify(readData("overbound-manor.json")), "overbound-manor");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("demesned"));
  assert.ok(CHIPS.includes("demesne"));
  assert.ok(CHIPS.includes("home-bind-overreach"));
  assert.ok(CHIPS.includes("whole-home-bind"));
  assert.ok(CHIPS.includes("bare-home-write"));
  assert.ok(CHIPS.includes("home-scoped"));
  assert.ok(CHIPS.includes("bind-home"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("demesne"));
  assert.ok(ALARM.includes("home-bind-overreach"));
  assert.ok(ALARM.includes("whole-home-bind"));
  assert.ok(ALARM.includes("bare-home-write"));
  assert.ok(ALARM.includes("mcp-denied"));
  assert.ok(ALARM.includes("root-owned-commons"));
  assert.ok(ALARM.includes("env-scrub"));
  assert.ok(ALARM.includes("safe-mode"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published demesne walk scores demesne after the idle hold", () => {
  const booth = scoreWalk({ rows: DEMESNE_WALK });
  assert.equal(booth.verdict, "demesne");
  assert.ok(booth.demesneCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-demesned");
  assert.equal(idle.demesned, true);
  assert.equal(idle.verdict, "demesned");
  const cut = booth.rows.find((row) => row.event === "home-bind-overreach");
  assert.equal(cut.homeBindOverreach, true);
  const path = booth.rows.find((row) => row.event === "home-bind-overreach" && row.t === "path");
  assert.equal(path.verdict, "home-bind-overreach");
});

test("DEMESNE_WALK constant matches the issue manor-charter walk", () => {
  assert.equal(DEMESNE_WALK[0].event, "cue-demesned");
  const cut = DEMESNE_WALK.find((row) => row.event === "home-bind-overreach");
  assert.equal(cut.homeBindOverreach, true);
  const path = DEMESNE_WALK.find((row) => row.t === "path");
  assert.equal(path.demesne, true);
  const scoreRow = DEMESNE_WALK.find((row) => row.event === "demesne");
  assert.equal(scoreRow.demesne, true);
});

test("positive control demesned holding stays demesned", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "demesned");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "demesned");
  const hold = walk.rows.find((row) => row.event === "cue-demesned");
  assert.equal(hold.demesned, true);
  assert.equal(hold.verdict, "demesned");
});

test("issue constants encode only #93989 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93989);
  assert.ok(ISSUE_URL.includes("93989"));
  assert.match(TITLE, /bwrap|\/home|Permission denied|mcp\.json/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "linux");
  assert.match(HOST, /Claude Code CLI/);
  assert.equal(BUILD, "2.1.224");
  assert.equal(SURFACE, "home-bind-overreach");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:linux", "area:sandbox"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Airlock|#93862/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Feoffee|#93863/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Cartouche|#93772/i.test(row)));
  assert.ok(EXPECTED.some((row) => /\$HOME|bind.*HOME|do not bind the entire \/home/i.test(row)));
  assert.match(DISTRIBUTION, /bwrap|\/home|mcp\.json|ENV_SCRUB|safe-mode|--bind \/home \/home/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("home-bind-overreach"));
  assert.ok(FINGERPRINT_LINES.includes("demesne"));
  assert.equal(PHRASE, "Score demesne or admit demesned.");
  assert.equal(SAMPLE_DEMESNE_PROOF.homeBindOverreach, true);
});

test("has-repro fingerprints encode the published demesne proof", () => {
  const result = handle(seedDemesne());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "home-bind-overreach");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDemesne()),
    /demesne\|kind=home-bind-overreach\|write=denied\|path=home-bind-overreach\|cue=home-bind-overreach/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes cartouche/attaint/oriel and recent catalog words", () => {
  const required = [
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
    "plenary",
    "scisselled",
    "vested",
    "unseised",
    "feoffee",
    "singular",
    "apographed",
    "airlock",
    "equalized",
    "socat-race",
    "scotoma",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("demesned booth flips demesne back when the holding is private", () => {
  const tape = {
    demesned: true,
    demesne: false,
    homeBindOverreach: false,
    cue: "demesned",
  };
  assert.equal(scoreGate(tape).verdict, "demesned");
  tape.demesned = false;
  tape.demesne = true;
  tape.homeBindOverreach = true;
  tape.wholeHomeBind = true;
  tape.cue = "demesne";
  assert.equal(scoreGate(tape).verdict, "demesne");
  tape.demesned = true;
  tape.demesne = false;
  tape.homeBindOverreach = false;
  tape.wholeHomeBind = false;
  tape.cue = "demesned";
  assert.equal(scoreGate(tape).verdict, "demesned");
});

test("holding, bind, write, and readBooth mark the demesne proof", () => {
  const idle = inspectHolding({
    demesned: true,
  });
  assert.equal(idle.stamp, "holding-private");
  const bind = inspectBind({ demesne: true, wholeHomeBind: true });
  assert.equal(bind.stamp, "whole-home-bind");
  assert.equal(bind.target, "/home");
  const write = inspectWrite({ demesne: true, mcpDenied: true });
  assert.equal(write.stamp, "mcp-denied");
  const booth = readBooth({
    demesne: true,
    homeBindOverreach: true,
    wholeHomeBind: true,
  });
  assert.equal(booth.demesne, true);
  assert.equal(booth.mark, "demesne");
  const open = readBooth({
    demesned: true,
    demesne: false,
    homeBindOverreach: false,
  });
  assert.equal(open.demesne, false);
  assert.equal(open.mark, "demesned");
});

test("mapScope encodes the published overbound manor", () => {
  const miss = mapScope({ demesne: true, homeBindOverreach: true });
  assert.equal(miss.stamp, "home-bind-overreach");
  assert.equal(miss.holdingLane, "overbound");
  assert.equal(miss.ribbon, "demesne");
  const clear = mapScope({ demesned: true, demesne: false });
  assert.equal(clear.stamp, "demesned-holding");
  assert.equal(clear.kindLane, "home-scoped");
  assert.equal(clear.holdingLane, "private");
});

test("cousins cite #91122 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 91122);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("homestead"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 93770);
  assert.equal(BACKUPS[8].issue, 93987);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93989));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/demesne.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const demesnedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/demesned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(demesnedFix.status, 0, demesnedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const demesnedOut = JSON.parse(demesnedFix.stdout);
  assert.equal(idleOut.verdict, "demesned");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "demesne");
  assert.equal(seededOut.alarm, true);
  assert.equal(demesnedOut.verdict, "demesned");
  assert.equal(demesnedOut.hold, true);
  assert.match(demesnedOut.phrase, /admit demesned/);
});

test("handle exposes published hypothesis and #93989 headline", () => {
  const result = handle(seedDemesne());
  assert.equal(result.published.issue, 93989);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [91122]);
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93987));
  assert.ok(!result.published.backups.includes(93989));
  assert.match(result.published.hypothesis, /bind \/home \/home|\$HOME|NON-BINDING|#93989/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93989/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a manor-charter booth, not temple oval or court-roll", () => {
  const page = readPage();
  assert.match(page, /family=UnifrakturMaguntia|UnifrakturMaguntia/);
  assert.match(page, /Epilogue/);
  assert.match(page, /Inconsolata/);
  assert.match(page, /demesne|demesned|home-bind-overreach|manor|charter|commons/i);
  assert.match(page, /#E4D5B5|#1A4A36|#4A3018|#161410|#3A6848|#7A4030|#8B7340/i);
  assert.match(page, /\bdemesned\b/);
  assert.match(page, /\bdemesne\b/);
  assert.match(page, /home-bind-overreach/);
  assert.match(page, /Score demesne or admit demesned/i);
  assert.match(page, /#339/);
  assert.match(page, /#93989/);
  assert.match(page, /Admit demesned/);
  assert.match(page, /Score demesne/);
  assert.match(page, /Walk home-bind-overreach/);
  assert.match(page, /Compare demesned \/ demesne/);
  assert.match(page, /Pin idle demesned/);
  assert.match(page, /Pin seeded demesne/);
  assert.match(page, /Pin home-bind-overreach/);
  assert.match(page, /Open the holding/);
  assert.match(page, /Score booth/);
  assert.match(page, /demesne-score/);
  assert.match(page, /bwrap|\/home|mcp\.json|ENV_SCRUB|safe-mode/i);
  assert.match(page, /demesne|manor|charter|commons|holding/i);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Fragment Mono|Fragment\+Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /#E8DFC8/);
  assert.doesNotMatch(page, /#1B3A6B/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#7B1420/);
  assert.doesNotMatch(page, /#5C1A22/);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|lapis|limestone/i);
  assert.doesNotMatch(page, /laryngoscope|voice-strip|glottis|phonat/i);
  assert.doesNotMatch(page, /mullion|leaded|sash|bay-window|fenestrat/i);
  assert.doesNotMatch(page, /\bdiagrammed\b/);
  assert.doesNotMatch(page, /\bcartouche\b/);
  assert.doesNotMatch(page, /section-poster/);
  assert.doesNotMatch(page, /\bunattainted\b/);
  assert.doesNotMatch(page, /\battaint\b/);
  assert.doesNotMatch(page, /session-attainder/);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Cartouche/i);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Scotoma/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Demesne/);
  assert.match(readme, /#93989/);
  assert.match(readme, /\bdemesned\b/);
  assert.match(readme, /\bdemesne\b/);
  assert.match(readme, /home-bind-overreach/);
  assert.match(readme, /UnifrakturMaguntia/);
  assert.match(readme, /Epilogue/);
  assert.match(readme, /Inconsolata/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.doesNotMatch(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /HOME-BIND OVERREACH/i);
  assert.match(readme, /NOT Airlock\/#93862/);
  assert.match(readme, /NOT Feoffee\/#93863/);
  assert.match(readme, /NOT Cartouche\/#93772/);
  assert.match(readme, /NOT Attaint\/#93821/);
  assert.match(readme, /NOT Oriel\/#93809/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /NOT Trismus\/#93823/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /#91122/);
  assert.match(readme, /bwrap|\/home|mcp\.json|ENV_SCRUB|safe-mode/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/demesne/);
  assert.match(readme, /node --test projects\/demesne\/demesne\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /manor|charter|commons|holding|demesne/i);
  assert.match(readme, /Score demesne or admit demesned/);
  assert.match(readme, /#93770|#93777|#93811|#93924|#93925|#93954|#93967|#93957|#93987/);
  assert.match(readme, /22:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Demesne/);
  assert.match(runLog, /22:50/);
});

test("catalog features Demesne only; Cartouche unfeatured; product count 339", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 339);
  assert.equal(hub.products.length, 339);
  assert.equal(catalog.products[0].name, "Demesne");
  assert.equal(catalog.products[0].slug, "demesne");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/demesne/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "22:50 demesne: a medieval demesne / manor-charter booth for #93989. bwrap Bash sandbox binds entire /home instead of $HOME, so bare /home/.mcp.json writes Permission denied. Idle demesned / seeded demesne / path home-bind-overreach. Score demesne or admit demesned.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bdemesned\b/);
  assert.match(catalog.products[0].summary, /\bdemesne\b/);
  assert.match(catalog.products[0].summary, /home-bind-overreach/);
  assert.match(catalog.products[0].summary, /Score demesne or admit demesned/);
  assert.equal(hub.products[0].slug, "demesne");
  assert.equal(hub.products[0].featured, true);
  const cartouche = catalog.products.find((row) => row.slug === "cartouche");
  assert.ok(cartouche);
  assert.equal(cartouche.featured, false);
  const attaint = catalog.products.find((row) => row.slug === "attaint");
  assert.ok(attaint);
  assert.equal(attaint.featured, false);
  const oriel = catalog.products.find((row) => row.slug === "oriel");
  assert.ok(oriel);
  assert.equal(oriel.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "demesne").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93989") && row.slug !== "demesne"));
});

test("vercel rewrites demesne to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/demesne");
  assert.equal(vercel.rewrites[0].destination, "/projects/demesne");
  assert.equal(vercel.rewrites[1].source, "/demesne/");
  assert.equal(vercel.rewrites[1].destination, "/projects/demesne");
  assert.equal(vercel.rewrites[2].source, "/demesne/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/demesne/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
