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
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  PROSCRIPTION_WALK,
  RULED_OUT,
  SAMPLE_PROSCRIPTION_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TABLET_NAMES,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectChamber,
  inspectForum,
  inspectLintel,
  inspectRoster,
  inspectStylus,
  inspectTablet,
  mapForum,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBashStillLoaded,
  seedHold,
  seedProduct,
  seedDenyListHollow,
  seedProscription,
  seedBarred,
} from "./proscription.mjs";

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
  return fileURLToPath(new URL("./proscription.mjs", import.meta.url));
}

test("idle barred is a hold; deny list actually strips tools", () => {
  const result = analyze(seedBarred());
  assert.equal(result.verdict, "barred");
  assert.equal(result.idleWord, "barred");
  assert.equal(IDLE_WORD, "barred");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.barred, true);
  assert.equal(result.phrase, "admit barred");
  assert.equal(result.proscription, false);
  assert.equal(result.denyListHollow, false);
  assert.ok(HOLD_ALIASES.includes("barred"));
  assert.ok(HOLD_ALIASES.includes("denied"));
  assert.ok(HOLD_ALIASES.includes("struck"));
  assert.ok(HOLD_ALIASES.includes("excised"));
  assert.ok(HOLD_ALIASES.includes("absent"));
  assert.ok(HOLD_ALIASES.includes("stripped"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify barred", () => {
  assert.equal(classify(emptyTicket()), "barred");
  assert.equal(classify(""), "barred");
  assert.equal(classify(null), "barred");
  assert.equal(decide({}), "barred");
});

test("#94202 seeded path scores proscription when chalked names still walk", () => {
  const result = analyze(seedProscription());
  assert.equal(result.verdict, "proscription");
  assert.equal(result.seededWord, "proscription");
  assert.equal(SEEDED_WORD, "proscription");
  assert.equal(PRODUCT_WORD, "proscription");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.proscription, true);
  assert.equal(result.phrase, "score proscription");
  assert.equal(result.denyListHollow, true);
  assert.equal(result.bashStillLoaded, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark hollow tablet and walking forum", () => {
  const tablet = inspectTablet({ proscription: true, denyListHollow: true });
  assert.equal(tablet.stamp, "tablet-hollow");
  assert.equal(tablet.hollow, true);
  const forum = inspectForum({ proscription: true, denyListHollow: true });
  assert.equal(forum.stamp, "forum-walking");
  assert.equal(forum.walking, true);
  const scored = scoreGate({
    proscription: true,
    denyListHollow: true,
    bashStillLoaded: true,
    cue: "proscription",
  });
  assert.equal(scored.verdict, "proscription");
  const open = inspectTablet({ barred: true, proscription: false });
  assert.equal(open.stamp, "tablet-struck");
});

test("path word is deny-list-hollow; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "deny-list-hollow");
  const result = analyze(seedDenyListHollow());
  assert.equal(result.verdict, "deny-list-hollow");
  assert.equal(result.pathWord, "deny-list-hollow");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "deny-list-hollow",
      preferSeed: true,
      proscription: true,
    }),
    "deny-list-hollow",
  );
  assert.equal(classify(seedBashStillLoaded()), "bash-still-loaded");
  assert.equal(score(seedDenyListHollow()), "proscription");
});

test("HOLD includes barred / hold", () => {
  assert.ok(HOLD.includes("barred"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: bash-still-loaded, deny-list-hollow, proscription", () => {
  assert.equal(classify(seedBashStillLoaded()), "bash-still-loaded");
  assert.equal(classify(seedDenyListHollow()), "deny-list-hollow");
  assert.equal(classify(seedProduct()), "proscription");
});

test("booth fixtures flip barred vs proscription vs deny-list-hollow", () => {
  const idle = scoreGate(seedBarred());
  const seeded = scoreGate(seedProscription());
  const barred = readData("barred.json");
  const proscription = readData("proscription.json");
  const path = readData("deny-list-hollow.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "barred");
  assert.equal(seeded.verdict, "proscription");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedBarred()), "barred");
  assert.equal(score(seedProscription()), "proscription");
  assert.equal(
    score({ seed: "deny-list-hollow", preferSeed: true }),
    "proscription",
  );
  assert.equal(barred.denyListHollow, false);
  assert.equal(barred.barred, true);
  assert.equal(scoreGate(barred).verdict, "barred");
  assert.equal(proscription.denyListHollow, true);
  assert.equal(proscription.bashStillLoaded, true);
  assert.equal(proscription.websearchExecutes, true);
  assert.equal(classify(proscription), "proscription");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /barred|denied|struck|excised|absent|stripped/i,
  );
  assert.match(
    path.paths[1].result,
    /deny-list-hollow|Bash still loaded|WebSearch executes/i,
  );
  assert.equal(classify(path), "deny-list-hollow");
  assert.equal(proscription.hubCount, "PROSCRIPTION");
  assert.equal(proscription.issue, 94202);
  assert.equal(proscription.proscription, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("denied.json")), "denied");
  assert.equal(classify(readData("struck.json")), "struck");
  assert.equal(classify(readData("excised.json")), "excised");
  assert.equal(classify(readData("absent.json")), "absent");
  assert.equal(classify(readData("stripped.json")), "stripped");
  assert.equal(classify(readData("bash-still-loaded.json")), "bash-still-loaded");
  assert.equal(classify(readData("websearch-executes.json")), "websearch-executes");
  assert.equal(classify(readData("mcp-full-name-executes.json")), "mcp-full-name-executes");
  assert.equal(classify(readData("classifier-only-denial.json")), "classifier-only-denial");
  assert.equal(classify(readData("four-spawns.json")), "four-spawns");
  assert.equal(classify(readData("template-read-at-spawn.json")), "template-read-at-spawn");
  assert.equal(classify(readData("prefix-glob-no-effect.json")), "prefix-glob-no-effect");
  assert.equal(classify(readData("deny-probe.json")), "deny-probe");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [78063]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("barred"));
  assert.ok(CHIPS.includes("proscription"));
  assert.ok(CHIPS.includes("deny-list-hollow"));
  assert.ok(CHIPS.includes("bash-still-loaded"));
  assert.ok(CHIPS.includes("classifier-only-denial"));
  assert.ok(CHIPS.includes("denied"));
  assert.ok(CHIPS.includes("absent"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("proscription"));
  assert.ok(ALARM.includes("deny-list-hollow"));
  assert.ok(ALARM.includes("bash-still-loaded"));
  assert.ok(ALARM.includes("websearch-executes"));
  assert.ok(ALARM.includes("mcp-full-name-executes"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published proscription walk scores proscription after the idle hold", () => {
  const booth = scoreWalk({ rows: PROSCRIPTION_WALK });
  assert.equal(booth.verdict, "proscription");
  assert.ok(booth.proscriptionCount >= 1);
  const idle = booth.rows.find((row) => row.event === "tablet-barred");
  assert.equal(idle.barred, true);
  assert.equal(idle.verdict, "barred");
  const cut = booth.rows.find((row) => row.event === "deny-list-hollow");
  assert.equal(cut.denyListHollow, true);
  const path = booth.rows.find(
    (row) => row.event === "deny-list-hollow" && row.t === "path",
  );
  assert.equal(path.verdict, "deny-list-hollow");
});

test("PROSCRIPTION_WALK constant matches the issue tablet walk", () => {
  assert.equal(PROSCRIPTION_WALK[0].event, "tablet-barred");
  const cut = PROSCRIPTION_WALK.find((row) => row.event === "deny-list-hollow");
  assert.equal(cut.denyListHollow || cut.bashStillLoaded, true);
  const path = PROSCRIPTION_WALK.find((row) => row.t === "path");
  assert.equal(path.proscription, true);
  const scoreRow = PROSCRIPTION_WALK.find((row) => row.event === "proscription");
  assert.equal(scoreRow.proscription, true);
});

test("positive control barred tablet stays barred", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "barred");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "barred");
  const hold = walk.rows.find((row) => row.event === "tablet-barred");
  assert.equal(hold.barred, true);
  assert.equal(hold.verdict, "barred");
});

test("issue constants encode only #94202 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94202);
  assert.ok(ISSUE_URL.includes("94202"));
  assert.match(TITLE, /disallowedTools|Bash|WebSearch|MCP/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /subagent|disallowedTools/i);
  assert.equal(BUILD, "Claude Code 2.1.268 (macOS)");
  assert.equal(SURFACE, "deny-list-hollow");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:tools", "area:agents", "area:permissions"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(TABLET_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Thimblerig|#94174/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Fetchling|#94065/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Souffleur|#94031/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Epitome|#94032/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Diabolica|#94040/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sallyport|#94082/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /disallowedTools|removed from the subagent|deny list/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /Bash|WebSearch|mcp__ai-team-os__ecosystem_deep_review_list|Irreversible Deletion|four independent|deny-probe|2\.1\.268/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("deny-list-hollow"));
  assert.ok(FINGERPRINT_LINES.includes("proscription"));
  assert.equal(PHRASE, "Score proscription or admit barred.");
  assert.equal(SAMPLE_PROSCRIPTION_PROOF.denyListHollow, true);
  assert.equal(SAMPLE_PROSCRIPTION_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published proscription proof", () => {
  const result = handle(seedProscription());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "deny-list-hollow");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedProscription()),
    /proscription\|kind=deny-list-hollow\|ref=still-loaded\|path=deny-list-hollow\|cue=deny-list-hollow/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and thimblerig/fetchling", () => {
  const required = [
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
    "thimblerig",
    "fetchling",
    "souffleur",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "skill-row-carve",
    "skill-dollar-swap",
    "app-switch-echo-loss",
    "summarized-thinking-force",
    "cannot-show-not-git",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("barred booth flips proscription back when the tablet admits barred", () => {
  const tape = {
    barred: true,
    proscription: false,
    denyListHollow: false,
    cue: "barred",
  };
  assert.equal(scoreGate(tape).verdict, "barred");
  tape.barred = false;
  tape.proscription = true;
  tape.denyListHollow = true;
  tape.cue = "proscription";
  assert.equal(scoreGate(tape).verdict, "proscription");
  tape.barred = true;
  tape.proscription = false;
  tape.denyListHollow = false;
  tape.cue = "barred";
  assert.equal(scoreGate(tape).verdict, "barred");
});

test("tablet, forum, stylus, lintel, and readBooth mark the proscription proof", () => {
  const idle = inspectTablet({ barred: true });
  assert.equal(idle.stamp, "tablet-struck");
  const forum = inspectForum({ proscription: true, denyListHollow: true });
  assert.equal(forum.stamp, "forum-walking");
  assert.equal(forum.walking, true);
  const stylus = inspectStylus({ proscription: true, denyListHollow: true });
  assert.equal(stylus.stamp, "stylus-idle-hollow");
  const booth = readBooth({
    proscription: true,
    denyListHollow: true,
    bashStillLoaded: true,
  });
  assert.equal(booth.proscription, true);
  assert.equal(booth.mark, "proscription");
  const open = readBooth({
    barred: true,
    proscription: false,
    denyListHollow: false,
  });
  assert.equal(open.proscription, false);
  assert.equal(open.mark, "barred");
  assert.equal(
    inspectLintel({ proscription: true, denyListHollow: true }).stamp,
    "lintel-hollow",
  );
  assert.equal(inspectForum({ barred: true }).stamp, "forum-absent");
  assert.equal(
    inspectChamber({ proscription: true }).stamp,
    "chamber-walking",
  );
  assert.equal(
    inspectRoster({ proscription: true, bashStillLoaded: true }).stamp,
    "roster-loaded",
  );
});

test("mapForum encodes the published open hollow", () => {
  const miss = mapForum({ proscription: true, denyListHollow: true });
  assert.equal(miss.stamp, "deny-list-hollow");
  assert.equal(miss.holdingLane, "still-loaded");
  assert.equal(miss.ribbon, "proscription");
  const clear = mapForum({ barred: true, proscription: false });
  assert.equal(clear.stamp, "barred-tablet");
  assert.equal(clear.kindLane, "absent");
  assert.equal(clear.holdingLane, "struck");
});

test("cousins cite #78063 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 78063);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("thimblerig"));
  assert.ok(NOT_PRODUCTS.includes("fetchling"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[8].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94202));
  assert.ok(!BACKUPS.some((row) => row.issue === 94174));
  assert.ok(!BACKUPS.some((row) => row.issue === 78063));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/proscription.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const barredFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/barred.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(barredFix.status, 0, barredFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const barredOut = JSON.parse(barredFix.stdout);
  assert.equal(idleOut.verdict, "barred");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "proscription");
  assert.equal(seededOut.alarm, true);
  assert.equal(barredOut.verdict, "barred");
  assert.equal(barredOut.hold, true);
  assert.match(barredOut.phrase, /admit barred/);
});

test("handle exposes published hypothesis and #94202 headline", () => {
  const result = handle(seedProscription());
  assert.equal(result.published.issue, 94202);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [78063]);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94202));
  assert.match(
    result.published.hypothesis,
    /disallowedTools|tool set|ToolSearch|classifier|NON-BINDING|#94202/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94202/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the barred page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("barred page is a Roman wax-tablet senate, not a carnival tent", () => {
  const page = readPage();
  assert.match(page, /family=Cinzel|Cinzel/);
  assert.match(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /proscription|barred|deny-list-hollow|tablet|stylus|lintel|forum|senate|torch/i,
  );
  assert.match(page, /#E8E4DC|#2A2418|#5C6670|#9B1D1D|#D4A017|#12151C|#F7F3EA/i);
  assert.match(page, /\bbarred\b/);
  assert.match(page, /\bproscription\b/);
  assert.match(page, /deny-list-hollow/);
  assert.match(page, /Score proscription or admit barred/i);
  assert.match(page, /#357/);
  assert.match(page, /#94202/);
  assert.match(page, /Admit barred/);
  assert.match(page, /Score proscription/);
  assert.match(page, /Walk deny-list-hollow/);
  assert.match(page, /Compare barred \/ proscription/);
  assert.match(page, /Pin idle barred/);
  assert.match(page, /Pin seeded proscription/);
  assert.match(page, /Pin deny-list-hollow/);
  assert.match(page, /Strike the tablet/);
  assert.match(page, /Score booth/);
  assert.match(page, /proscription-score/);
  assert.match(
    page,
    /Bash|WebSearch|mcp__ai-team-os__ecosystem_deep_review_list|Irreversible Deletion|deny-probe|2\.1\.268/i,
  );
  assert.match(page, /tablet|stylus|lintel|forum|senate|torch|wax/i);
  assert.match(page, /<svg[\s\S]*class="tablet-wax"|class="iron-stylus"|class="marble-lintel"|class="torch-flame"|class="forum-walker"/i);
  assert.doesNotMatch(page, /family=Rye|Rye/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code|Fira\+Mono/);
  assert.doesNotMatch(page, /family=Oswald|Oswald/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(page, /carnival|cups-and-pea|fairground/i);
  assert.doesNotMatch(page, /coin-ledger|mint tray|twilight glass|fae-twilight/i);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /gatehouse|iron-grille|sealed-strongroom/i);
  assert.doesNotMatch(page, /admit additive|Score thimblerig|idle additive/i);
  assert.doesNotMatch(page, /admit literal|Score fetchling|idle literal/i);
  assert.doesNotMatch(page, /admit echoing|Score souffleur/i);
  assert.doesNotMatch(page, /admit unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /admit sealed|Score sallyport/i);
  assert.doesNotMatch(page, /\bthimblerig\b/);
  assert.doesNotMatch(page, /\bfetchling\b/);
  assert.doesNotMatch(page, /skill-row-carve/);
  assert.doesNotMatch(page, /skill-dollar-swap/);
  assert.doesNotMatch(page, /app-switch-echo-loss/);
  assert.doesNotMatch(page, /summarized-thinking-force/);
  assert.match(page, /NOT Thimblerig/i);
  assert.match(page, /NOT Fetchling/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /#78063/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Proscription/);
  assert.match(readme, /#94202/);
  assert.match(readme, /\bbarred\b/);
  assert.match(readme, /\bproscription\b/);
  assert.match(readme, /deny-list-hollow/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Rye/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Lora/);
  assert.doesNotMatch(readme, /Plus Jakarta Sans/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /DENY-LIST-HOLLOW|disallowedTools|Bash still|WebSearch|Irreversible Deletion/i,
  );
  assert.match(readme, /NOT Thimblerig\/#94174/);
  assert.match(readme, /NOT Fetchling\/#94065/);
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Diabolica\/#94040/);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /#78063/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/proscription/);
  assert.match(readme, /node --test projects\/proscription\/proscription\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /tablet|stylus|lintel|forum|senate|torch/i);
  assert.match(readme, /Score proscription or admit barred/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94059|#94053|#94151|#94064/,
  );
  assert.match(readme, /17:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Proscription/);
  assert.match(runLog, /17:50/);
});

test("catalog features Proscription only; Thimblerig unfeatured; product count 357", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 357);
  assert.equal(hub.products.length, 357);
  assert.equal(catalog.products[0].name, "Proscription");
  assert.equal(catalog.products[0].slug, "proscription");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/proscription/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "17:50 proscription: a Roman outlaw-list / wax-tablet forum / iron-stylus / marble-lintel / torch-lit senate booth for #94202. A custom subagent's own frontmatter disallowedTools does not strip tools: Bash stays in loaded functions and executes; WebSearch is ToolSearch-found and runs with real results; MCP full name mcp__ai-team-os__ecosystem_deep_review_list runs with a real API response; only mcp__ai-team-os__project_delete is denied, and that by the auto mode classifier (Irreversible Deletion), not the deny list. Four independent spawns. Idle barred / seeded proscription / path deny-list-hollow. Score proscription or admit barred.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bbarred\b/);
  assert.match(catalog.products[0].summary, /\bproscription\b/);
  assert.match(catalog.products[0].summary, /deny-list-hollow/);
  assert.match(catalog.products[0].summary, /Score proscription or admit barred/);
  assert.match(catalog.products[0].summary, /#94202/);
  assert.equal(hub.products[0].slug, "proscription");
  assert.equal(hub.products[0].featured, true);
  const thimblerig = catalog.products.find((row) => row.slug === "thimblerig");
  assert.ok(thimblerig);
  assert.equal(thimblerig.featured, false);
  const fetchling = catalog.products.find((row) => row.slug === "fetchling");
  assert.ok(fetchling);
  assert.equal(fetchling.featured, false);
  const souffleur = catalog.products.find((row) => row.slug === "souffleur");
  assert.ok(souffleur);
  assert.equal(souffleur.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "proscription").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94202") && row.slug !== "proscription",
    ),
  );
});

test("vercel rewrites proscription to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/proscription");
  assert.equal(vercel.rewrites[0].destination, "/projects/proscription");
  assert.equal(vercel.rewrites[1].source, "/proscription/");
  assert.equal(vercel.rewrites[1].destination, "/projects/proscription");
  assert.equal(vercel.rewrites[2].source, "/proscription/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/proscription/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
