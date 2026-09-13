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
  TITULUS_WALK,
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
  SAMPLE_TITULUS_PROOF,
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
  inspectPhone,
  inspectPlaque,
  inspectResume,
  inspectSessions,
  inspectSidebar,
  mapPlaque,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCustomTitleClobber,
  seedTitulus,
  seedInscribed,
  seedHold,
  seedResumeStaleTitle,
  seedProduct,
  seedSidebarStale,
  seedIosRename,
} from "./titulus.mjs";

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
  return fileURLToPath(new URL("./titulus.mjs", import.meta.url));
}

test("idle inscribed is a hold; latest rename wins", () => {
  const result = analyze(seedInscribed());
  assert.equal(result.verdict, "inscribed");
  assert.equal(result.idleWord, "inscribed");
  assert.equal(IDLE_WORD, "inscribed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.inscribed, true);
  assert.equal(result.phrase, "admit inscribed");
  assert.equal(result.titulus, false);
  assert.equal(result.resumeStaleTitle, false);
  assert.ok(HOLD_ALIASES.includes("inscribed"));
  assert.ok(HOLD_ALIASES.includes("current"));
  assert.ok(HOLD_ALIASES.includes("plaque"));
  assert.ok(HOLD_ALIASES.includes("latest-wins"));
  assert.ok(HOLD_ALIASES.includes("synced"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify inscribed", () => {
  assert.equal(classify(emptyTicket()), "inscribed");
  assert.equal(classify(""), "inscribed");
  assert.equal(classify(null), "inscribed");
  assert.equal(decide({}), "inscribed");
});

test("#94025 seeded path scores titulus when stale desktop letters overwrite the phone name", () => {
  const result = analyze(seedTitulus());
  assert.equal(result.verdict, "titulus");
  assert.equal(result.seededWord, "titulus");
  assert.equal(SEEDED_WORD, "titulus");
  assert.equal(PRODUCT_WORD, "titulus");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.titulus, true);
  assert.equal(result.phrase, "score titulus");
  assert.equal(result.resumeStaleTitle, true);
  assert.equal(result.sidebarStale, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark clobbered plaque and sidebar-stale", () => {
  const plaque = inspectPlaque({ titulus: true, resumeStaleTitle: true });
  assert.equal(plaque.stamp, "plaque-clobbered");
  assert.equal(plaque.clobbered, true);
  const sidebar = inspectSidebar({ titulus: true, sidebarStale: true });
  assert.equal(sidebar.stamp, "sidebar-stale");
  assert.equal(sidebar.stale, true);
  const resume = inspectResume({ titulus: true, resumeStaleTitle: true });
  assert.equal(resume.stamp, "resume-stale-title");
  const scored = scoreGate({
    titulus: true,
    resumeStaleTitle: true,
    sidebarStale: true,
    customTitleClobber: true,
    cue: "titulus",
  });
  assert.equal(scored.verdict, "titulus");
  const open = inspectPlaque({ inscribed: true, titulus: false });
  assert.equal(open.stamp, "plaque-inscribed");
});

test("path word is resume-stale-title; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "resume-stale-title");
  const result = analyze(seedResumeStaleTitle());
  assert.equal(result.verdict, "resume-stale-title");
  assert.equal(result.pathWord, "resume-stale-title");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "resume-stale-title", preferSeed: true, titulus: true }),
    "resume-stale-title",
  );
  assert.equal(classify(seedSidebarStale()), "sidebar-stale");
});

test("HOLD includes inscribed / hold", () => {
  assert.ok(HOLD.includes("inscribed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: sidebar-stale, custom-title-clobber, titulus", () => {
  assert.equal(classify(seedSidebarStale()), "sidebar-stale");
  assert.equal(classify(seedCustomTitleClobber()), "custom-title-clobber");
  assert.equal(classify(seedIosRename()), "ios-rename");
  assert.equal(classify(seedProduct()), "titulus");
});

test("booth fixtures flip inscribed vs titulus vs resume-stale-title", () => {
  const idle = scoreGate(seedInscribed());
  const seeded = scoreGate(seedTitulus());
  const inscribed = readData("inscribed.json");
  const titulus = readData("titulus.json");
  const path = readData("resume-stale-title.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "inscribed");
  assert.equal(seeded.verdict, "titulus");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedInscribed()), "inscribed");
  assert.equal(score(seedTitulus()), "titulus");
  assert.equal(inscribed.resumeStaleTitle, false);
  assert.equal(inscribed.inscribed, true);
  assert.equal(scoreGate(inscribed).verdict, "inscribed");
  assert.equal(titulus.resumeStaleTitle, true);
  assert.equal(titulus.sidebarStale, true);
  assert.equal(titulus.customTitleClobber, true);
  assert.equal(classify(titulus), "titulus");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /inscribed|current|plaque|latest-wins|synced/i);
  assert.match(path.paths[1].result, /custom-title|sidebar|resume|clobber|Title B|Title A/i);
  assert.equal(classify(path), "resume-stale-title");
  assert.equal(titulus.hubCount, "TITULUS");
  assert.equal(titulus.issue, 94025);
  assert.equal(titulus.titulus, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("current.json")), "current");
  assert.equal(classify(readData("plaque.json")), "plaque");
  assert.equal(classify(readData("latest-wins.json")), "latest-wins");
  assert.equal(classify(readData("synced.json")), "synced");
  assert.equal(classify(readData("sidebar-stale.json")), "sidebar-stale");
  assert.equal(classify(readData("custom-title-clobber.json")), "custom-title-clobber");
  assert.equal(classify(readData("ios-rename.json")), "ios-rename");
  assert.equal(classify(readData("list-sessions-stale.json")), "list-sessions-stale");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("inscribed"));
  assert.ok(CHIPS.includes("titulus"));
  assert.ok(CHIPS.includes("resume-stale-title"));
  assert.ok(CHIPS.includes("sidebar-stale"));
  assert.ok(CHIPS.includes("custom-title-clobber"));
  assert.ok(CHIPS.includes("current"));
  assert.ok(CHIPS.includes("plaque"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("titulus"));
  assert.ok(ALARM.includes("resume-stale-title"));
  assert.ok(ALARM.includes("sidebar-stale"));
  assert.ok(ALARM.includes("custom-title-clobber"));
  assert.ok(ALARM.includes("ios-rename"));
  assert.ok(ALARM.includes("list-sessions-stale"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published titulus walk scores titulus after the idle hold", () => {
  const booth = scoreWalk({ rows: TITULUS_WALK });
  assert.equal(booth.verdict, "titulus");
  assert.ok(booth.titulusCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-inscribed");
  assert.equal(idle.inscribed, true);
  assert.equal(idle.verdict, "inscribed");
  const cut = booth.rows.find((row) => row.event === "resume-stale-title");
  assert.equal(cut.resumeStaleTitle, true);
  const path = booth.rows.find((row) => row.event === "resume-stale-title" && row.t === "path");
  assert.equal(path.verdict, "resume-stale-title");
});

test("TITULUS_WALK constant matches the issue plaque walk", () => {
  assert.equal(TITULUS_WALK[0].event, "cue-inscribed");
  const cut = TITULUS_WALK.find((row) => row.event === "resume-stale-title");
  assert.equal(cut.resumeStaleTitle || cut.customTitleClobber, true);
  const path = TITULUS_WALK.find((row) => row.t === "path");
  assert.equal(path.titulus, true);
  const scoreRow = TITULUS_WALK.find((row) => row.event === "titulus");
  assert.equal(scoreRow.titulus, true);
});

test("positive control inscribed plaque stays inscribed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "inscribed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "inscribed");
  const hold = walk.rows.find((row) => row.event === "cue-inscribed");
  assert.equal(hold.inscribed, true);
  assert.equal(hold.verdict, "inscribed");
});

test("issue constants encode only #94025 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94025);
  assert.ok(ISSUE_URL.includes("94025"));
  assert.match(TITLE, /Desktop|Windows|sidebar|resume|iOS|title/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(HOST, /Windows|iOS/);
  assert.equal(BUILD, "2.1.266");
  assert.equal(SURFACE, "resume-stale-title");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:windows", "area:desktop"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Vestry|#94008/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Surfeit|#94012/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Phosphene|#94003/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Foundling|#93889/i.test(row)));
  assert.ok(EXPECTED.some((row) => /latest|rename|sidebar|resume|list_sessions|phone/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.266|custom-title|sidebar|iOS|claude-desktop|ccd_session_mgmt|19045/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("resume-stale-title"));
  assert.ok(FINGERPRINT_LINES.includes("titulus"));
  assert.equal(PHRASE, "Score titulus or admit inscribed.");
  assert.equal(SAMPLE_TITULUS_PROOF.resumeStaleTitle, true);
});

test("has-repro fingerprints encode the published titulus proof", () => {
  const result = handle(seedTitulus());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "resume-stale-title");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedTitulus()),
    /titulus\|kind=resume-stale-title\|sessions=stale\|path=resume-stale-title\|cue=resume-stale-title/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes pegged/tempered/quiescent/diplomatic/demesned and recent catalog words", () => {
  const required = [
    "pegged",
    "vestry",
    "mount-refcount-race",
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
    "berthed",
    "derelict",
    "session-kill-orphan",
    "berthed",
    "gleaner",
    "apograph",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("inscribed booth flips titulus back when the plaque is inscribed", () => {
  const tape = {
    inscribed: true,
    titulus: false,
    resumeStaleTitle: false,
    cue: "inscribed",
  };
  assert.equal(scoreGate(tape).verdict, "inscribed");
  tape.inscribed = false;
  tape.titulus = true;
  tape.resumeStaleTitle = true;
  tape.sidebarStale = true;
  tape.cue = "titulus";
  assert.equal(scoreGate(tape).verdict, "titulus");
  tape.inscribed = true;
  tape.titulus = false;
  tape.resumeStaleTitle = false;
  tape.sidebarStale = false;
  tape.cue = "inscribed";
  assert.equal(scoreGate(tape).verdict, "inscribed");
});

test("plaque, sidebar, resume, and readBooth mark the titulus proof", () => {
  const idle = inspectPlaque({
    inscribed: true,
  });
  assert.equal(idle.stamp, "plaque-inscribed");
  const sidebar = inspectSidebar({ titulus: true, sidebarStale: true });
  assert.equal(sidebar.stamp, "sidebar-stale");
  assert.equal(sidebar.stale, true);
  const resume = inspectResume({ titulus: true, resumeStaleTitle: true });
  assert.equal(resume.stamp, "resume-stale-title");
  const booth = readBooth({
    titulus: true,
    resumeStaleTitle: true,
    sidebarStale: true,
  });
  assert.equal(booth.titulus, true);
  assert.equal(booth.mark, "titulus");
  const open = readBooth({
    inscribed: true,
    titulus: false,
    resumeStaleTitle: false,
  });
  assert.equal(open.titulus, false);
  assert.equal(open.mark, "inscribed");
  assert.equal(inspectSessions({ titulus: true, listSessionsStale: true }).stamp, "list-sessions-stale");
  assert.equal(inspectPhone({ titulus: true, iosRename: true }).stamp, "ios-rename");
});

test("mapPlaque encodes the published clobbered plaque", () => {
  const miss = mapPlaque({ titulus: true, resumeStaleTitle: true });
  assert.equal(miss.stamp, "resume-stale-title");
  assert.equal(miss.holdingLane, "clobbered");
  assert.equal(miss.ribbon, "titulus");
  const clear = mapPlaque({ inscribed: true, titulus: false });
  assert.equal(clear.stamp, "inscribed-plaque");
  assert.equal(clear.kindLane, "plaque");
  assert.equal(clear.holdingLane, "current");
});

test("cousins cite diplopia #93012 and fulcrum #92377 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 93012);
  assert.equal(COUSINS[0].slug, "diplopia");
  assert.equal(COUSINS[1].issue, 92377);
  assert.equal(COUSINS[1].slug, "fulcrum");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("vestry"));
  assert.ok(NOT_PRODUCTS.includes("surfeit"));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("derelict"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93987);
  assert.equal(BACKUPS[1].issue, 93924);
  assert.equal(BACKUPS[2].issue, 94032);
  assert.equal(BACKUPS[3].issue, 94029);
  assert.equal(BACKUPS[4].issue, 94031);
  assert.equal(BACKUPS[5].issue, 93770);
  assert.equal(BACKUPS[6].issue, 93777);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94025));
  assert.ok(!BACKUPS.some((row) => row.issue === 93012));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/titulus.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const inscribedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/inscribed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(inscribedFix.status, 0, inscribedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const inscribedOut = JSON.parse(inscribedFix.stdout);
  assert.equal(idleOut.verdict, "inscribed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "titulus");
  assert.equal(seededOut.alarm, true);
  assert.equal(inscribedOut.verdict, "inscribed");
  assert.equal(inscribedOut.hold, true);
  assert.match(inscribedOut.phrase, /admit inscribed/);
});

test("handle exposes published hypothesis and #94025 headline", () => {
  const result = handle(seedTitulus());
  assert.equal(result.published.issue, 94025);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [93012, 92377]);
  assert.ok(result.published.backups.includes(93987));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(!result.published.backups.includes(94025));
  assert.match(result.published.hypothesis, /session-mgmt|custom-title|NON-BINDING|#94025|latest-rename/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94025/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a Roman marble plaque booth, not sacristy or banquet or clinic", () => {
  const page = readPage();
  assert.match(page, /family=Forum|Forum/);
  assert.match(page, /family=Outfit|Outfit/);
  assert.match(page, /Space\+Mono|Space Mono/);
  assert.match(page, /titulus|inscribed|resume-stale-title|plaque|marble|bronze/i);
  assert.match(page, /#F4EFE6|#8C6A3F|#A34B3A|#1F3A5F|#1A1714|#FBF8F2|#6E4E36|#12100E/i);
  assert.match(page, /\binscribed\b/);
  assert.match(page, /\btitulus\b/);
  assert.match(page, /resume-stale-title/);
  assert.match(page, /Score titulus or admit inscribed/i);
  assert.match(page, /#345/);
  assert.match(page, /#94025/);
  assert.match(page, /Admit inscribed/);
  assert.match(page, /Score titulus/);
  assert.match(page, /Walk resume-stale-title/);
  assert.match(page, /Compare inscribed \/ titulus/);
  assert.match(page, /Pin idle inscribed/);
  assert.match(page, /Pin seeded titulus/);
  assert.match(page, /Pin resume-stale-title/);
  assert.match(page, /Stamp the letters/);
  assert.match(page, /Score booth/);
  assert.match(page, /titulus-score/);
  assert.match(page, /custom-title|ccd_session_mgmt|2\.1\.266|Title B|claude-desktop|sidebar/i);
  assert.match(page, /marble|plaque|titulus|bronze|inscription|lettering/i);
  assert.doesNotMatch(page, /family=Spectral/);
  assert.doesNotMatch(page, /Nunito|family=Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Mono|family=Fira/);
  assert.doesNotMatch(page, /family=Cormorant\+Upright|Cormorant Upright/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(page, /Fraunces|family=Fraunces/);
  assert.doesNotMatch(page, /Manrope|family=Manrope/);
  assert.doesNotMatch(page, /DM Mono|DM\+Mono/);
  assert.doesNotMatch(page, /Syne|family=Syne/);
  assert.doesNotMatch(page, /Sora|family=Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /#C8C2B4/);
  assert.doesNotMatch(page, /#2C3A6E/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#6E2432/);
  assert.doesNotMatch(page, /sacristy|peg-rail|stole|acolyte|vestment|robe-rail/i);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|limestone/i);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /entoptic|vitreous|isopter|sclera/i);
  assert.doesNotMatch(page, /banquet cellar|empty cask|quota-spawn/i);
  assert.doesNotMatch(page, /foundling-hospital|parish-ward/i);
  assert.doesNotMatch(page, /hawser|bosun|keel|berthed|maritime/i);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /\bquiescent\b/);
  assert.doesNotMatch(page, /\bphosphene\b/);
  assert.doesNotMatch(page, /\btempered\b/);
  assert.doesNotMatch(page, /\bsurfeit\b/);
  assert.doesNotMatch(page, /\bpegged\b/);
  assert.doesNotMatch(page, /\bvestry\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /layer-tree-walk/);
  assert.doesNotMatch(page, /quota-spawn-cascade/);
  assert.doesNotMatch(page, /mount-refcount-race/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Derelict/i);
  assert.match(page, /NOT Vestry/i);
  assert.match(page, /NOT Surfeit/i);
  assert.match(page, /NOT Phosphene/i);
  assert.match(page, /NOT Parablepsis/i);
  assert.match(page, /NOT Demesne/i);
  assert.match(page, /NOT Cartouche/i);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Apograph/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Titulus/);
  assert.match(readme, /#94025/);
  assert.match(readme, /\binscribed\b/);
  assert.match(readme, /\btitulus\b/);
  assert.match(readme, /resume-stale-title/);
  assert.match(readme, /Forum/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /Space Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Nunito/);
  assert.doesNotMatch(readme, /Fira/);
  assert.doesNotMatch(readme, /Cormorant Upright/);
  assert.doesNotMatch(readme, /Karla/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /EB Garamond/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /RESUME-STALE TITLE|RESUME-STALE-TITLE/i);
  assert.match(readme, /NOT Derelict\/#93996/);
  assert.match(readme, /NOT Vestry\/#94008/);
  assert.match(readme, /NOT Surfeit\/#94012/);
  assert.match(readme, /NOT Phosphene\/#94003/);
  assert.match(readme, /NOT Parablepsis/);
  assert.match(readme, /NOT Demesne\/#93989/);
  assert.match(readme, /NOT Cartouche/);
  assert.match(readme, /NOT Attaint/);
  assert.match(readme, /NOT Oriel/);
  assert.match(readme, /NOT Anarthria/);
  assert.match(readme, /NOT Trismus/);
  assert.match(readme, /NOT Gleaner\/#93794/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Apograph\/#93859/);
  assert.match(readme, /diplopia|#93012/);
  assert.match(readme, /fulcrum|#92377/);
  assert.match(readme, /2\.1\.266|custom-title|sidebar|ccd_session_mgmt/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/titulus/);
  assert.match(readme, /node --test projects\/titulus\/titulus\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /marble|plaque|titulus|inscription/i);
  assert.match(readme, /Score titulus or admit inscribed/);
  assert.match(readme, /#93987|#93924|#94032|#94029|#94031|#93770|#93777/);
  assert.match(readme, /04:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Titulus/);
  assert.match(runLog, /04:50/);
});

test("catalog features Titulus only; Derelict unfeatured; product count 345", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 345);
  assert.equal(hub.products.length, 345);
  assert.equal(catalog.products[0].name, "Titulus");
  assert.equal(catalog.products[0].slug, "titulus");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/titulus/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "04:50 titulus: a Roman inscription / marble name-plaque / funerary-titulus booth for #94025. Desktop Windows Code sidebar keeps the auto-generated title after an iOS rename; resume appends a stale custom-title and clobbers the phone name. Idle inscribed / seeded titulus / path resume-stale-title. Score titulus or admit inscribed.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\binscribed\b/);
  assert.match(catalog.products[0].summary, /\btitulus\b/);
  assert.match(catalog.products[0].summary, /resume-stale-title/);
  assert.match(catalog.products[0].summary, /Score titulus or admit inscribed/);
  assert.equal(hub.products[0].slug, "titulus");
  assert.equal(hub.products[0].featured, true);
  const derelict = catalog.products.find((row) => row.slug === "derelict");
  assert.ok(derelict);
  assert.equal(derelict.featured, false);
  const vestry = catalog.products.find((row) => row.slug === "vestry");
  assert.ok(vestry);
  assert.equal(vestry.featured, false);
  const surfeit = catalog.products.find((row) => row.slug === "surfeit");
  assert.ok(surfeit);
  assert.equal(surfeit.featured, false);
  const phosphene = catalog.products.find((row) => row.slug === "phosphene");
  assert.ok(phosphene);
  assert.equal(phosphene.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "titulus").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94025") && row.slug !== "titulus"));
});

test("vercel rewrites titulus to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/titulus");
  assert.equal(vercel.rewrites[0].destination, "/projects/titulus");
  assert.equal(vercel.rewrites[1].source, "/titulus/");
  assert.equal(vercel.rewrites[1].destination, "/projects/titulus");
  assert.equal(vercel.rewrites[2].source, "/titulus/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/titulus/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
