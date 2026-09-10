import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BUTTON_LABEL,
  CHAMBER_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DEBUG_REJECT,
  DEFAULT_MODE,
  DISABLE_AUTO_SETTING,
  EXIT_TOOL,
  FALLBACK_MODE,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRE_PLAN_MODE,
  PREPARE_CONTEXT,
  REPLEVIN_WALK,
  SEEDED_WORD,
  SET_MODE,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  compareSurfaces,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readChamber,
  restoreWrit,
  score,
  scoreGate,
  scoreWalk,
  sealBond,
  seedAndroidCorrect,
  seedBridgeOverride,
  seedBypassDisplaced,
  seedCliCorrect,
  seedDefaulted,
  seedDisableAutomode,
  seedHold,
  seedIosSurface,
  seedNoIndicator,
  seedPreplan,
  seedRejectFallback,
  seedReplevin,
  seedRestored,
  seedSetModeAuto,
} from "./replevin.mjs";

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
  return fileURLToPath(new URL("./replevin.mjs", import.meta.url));
}

test("idle restored is a hold; ExitPlanMode restores prePlanMode", () => {
  const result = analyze(seedRestored());
  assert.equal(result.verdict, "restored");
  assert.equal(result.idleWord, "restored");
  assert.equal(IDLE_WORD, "restored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.restored, true);
  assert.equal(result.phrase, "admit restored");
  assert.equal(result.setModeAuto, false);
  assert.equal(result.rejectFallback, false);
  assert.equal(result.bypassDisplaced, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify restored", () => {
  assert.equal(classify(emptyTicket()), "restored");
  assert.equal(classify(""), "restored");
  assert.equal(classify(null), "restored");
  assert.equal(decide({}), "restored");
});

test("#93207 seeded path scores replevin when iOS setMode auto displaces prePlanMode", () => {
  const result = analyze(seedReplevin());
  assert.equal(result.verdict, "replevin");
  assert.equal(result.seededWord, "replevin");
  assert.equal(SEEDED_WORD, "replevin");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.replevin, true);
  assert.equal(result.phrase, "score replevin");
  assert.equal(result.prePlanRecorded, true);
  assert.equal(result.enteredPlan, true);
  assert.equal(result.iosApprove, true);
  assert.equal(result.setModeAuto, true);
  assert.equal(result.bridgeOverride, true);
  assert.equal(result.disableAutoMode, true);
  assert.equal(result.rejectFallback, true);
  assert.equal(result.fallbackDefault, true);
  assert.equal(result.bypassDisplaced, true);
  assert.equal(result.promptsEveryTool, true);
  assert.equal(result.noIndicator, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is defaulted; named defaulted seed holds the path", () => {
  assert.equal(PATH_WORD, "defaulted");
  const result = analyze(seedDefaulted());
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.pathWord, "defaulted");
  assert.equal(result.hold, false);
  assert.equal(classify({ seed: "defaulted", preferSeed: true, defaulted: true }), "defaulted");
});

test("HOLD includes restored / hold", () => {
  assert.ok(HOLD.includes("restored"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: preplan, setmode-auto, bridge-override, reject-fallback, bypass, surfaces", () => {
  assert.equal(analyze(seedPreplan()).prePlanRecorded, true);
  assert.equal(classify(seedPreplan()), "preplan");
  assert.equal(analyze(seedSetModeAuto()).setModeAuto, true);
  assert.equal(classify(seedSetModeAuto()), "setmode-auto");
  assert.equal(analyze(seedBridgeOverride()).bridgeOverride, true);
  assert.equal(classify(seedBridgeOverride()), "bridge-override");
  assert.equal(analyze(seedRejectFallback()).rejectFallback, true);
  assert.equal(classify(seedRejectFallback()), "reject-fallback");
  assert.equal(analyze(seedBypassDisplaced()).bypassDisplaced, true);
  assert.equal(classify(seedBypassDisplaced()), "bypass-displaced");
  assert.equal(classify(seedIosSurface()), "ios-surface");
  assert.equal(classify(seedAndroidCorrect()), "android-correct");
  assert.equal(classify(seedCliCorrect()), "cli-correct");
  assert.equal(analyze(seedDisableAutomode()).disableAutoMode, true);
  assert.equal(classify(seedDisableAutomode()), "disable-automode");
  assert.equal(analyze(seedNoIndicator()).noIndicator, true);
  assert.equal(classify(seedNoIndicator()), "no-indicator");
});

test("fixture toggle flips restored vs replevin", () => {
  const restored = scoreGate(seedRestored());
  const replevin = scoreGate(readData("replevin.json"));
  assert.equal(restored.verdict, "restored");
  assert.equal(replevin.verdict, "replevin");
  assert.notEqual(restored.verdict, replevin.verdict);
  assert.equal(score(seedRestored()), "restored");
  assert.equal(score(readData("replevin.json")), "replevin");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("restored"));
  assert.ok(CHIPS.includes("replevin"));
  assert.ok(CHIPS.includes("defaulted"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("replevin"));
  assert.ok(ALARM.includes("defaulted"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published replevin walk scores replevin after the hold floods", () => {
  const chamber = scoreWalk({ rows: REPLEVIN_WALK });
  assert.equal(chamber.verdict, "replevin");
  assert.ok(chamber.replevinCount >= 1);
  const idle = chamber.rows.find((row) => row.event === "cue-restored");
  assert.equal(idle.restored, true);
  assert.equal(idle.verdict, "restored");
  const preplan = chamber.rows.find((row) => row.event === "preplan");
  assert.equal(preplan.prePlanRecorded, true);
  const plan = chamber.rows.find((row) => row.event === "enter-plan");
  assert.equal(plan.enteredPlan, true);
  const ios = chamber.rows.find((row) => row.event === "ios-approve");
  assert.equal(ios.iosApprove, true);
  const setmode = chamber.rows.find((row) => row.event === "setmode-auto");
  assert.equal(setmode.setModeAuto, true);
  const gate = chamber.rows.find((row) => row.event === "disable-automode");
  assert.equal(gate.disableAutoMode, true);
  const reject = chamber.rows.find((row) => row.event === "reject-fallback");
  assert.equal(reject.rejectFallback, true);
  const land = chamber.rows.find((row) => row.event === "bypass-displaced");
  assert.equal(land.bypassDisplaced, true);
  const hear = chamber.rows.find((row) => row.event === "replevin");
  assert.equal(hear.setModeAuto, true);
  const path = chamber.rows.find((row) => row.event === "defaulted");
  assert.equal(path.verdict, "defaulted");
});

test("REPLEVIN_WALK constant matches the issue chamber walk", () => {
  assert.equal(REPLEVIN_WALK[0].event, "cue-restored");
  const preplan = REPLEVIN_WALK.find((row) => row.event === "preplan");
  assert.equal(preplan.prePlanMode, "bypassPermissions");
  const ios = REPLEVIN_WALK.find((row) => row.event === "ios-approve");
  assert.equal(ios.buttonLabel, "Exit and auto mode");
  const hear = REPLEVIN_WALK.find((row) => row.event === "replevin");
  assert.equal(hear.fallbackDefault, true);
  const path = REPLEVIN_WALK.find((row) => row.event === "defaulted");
  assert.equal(path.defaulted, true);
});

test("issue constants encode only #93207 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93207);
  assert.ok(ISSUE_URL.includes("93207"));
  assert.match(TITLE, /setMode 'auto'/);
  assert.match(TITLE, /prePlanMode/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("platform:ios"));
  assert.ok(LABELS.includes("area:permissions"));
  assert.equal(AUTHOR, "miridius");
  assert.equal(FILED, "2026-09-09T22:02:05Z");
  assert.equal(CLAUDE_VERSION, "2.1.267");
  assert.match(OS, /macOS 15/);
  assert.equal(DEFAULT_MODE, "bypassPermissions");
  assert.equal(DISABLE_AUTO_SETTING, "disable");
  assert.equal(BUTTON_LABEL, "Exit and auto mode");
  assert.equal(PRE_PLAN_MODE, "bypassPermissions");
  assert.equal(SET_MODE, "auto");
  assert.equal(FALLBACK_MODE, "default");
  assert.equal(PREPARE_CONTEXT, "prepareContextForPlanMode");
  assert.equal(EXIT_TOOL, "ExitPlanModeV2Tool");
  assert.match(DEBUG_REJECT, /falling back to 'default'/);
  assert.equal(CHAMBER_STATIONS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("prepareContextForPlanMode"));
  assert.ok(FINGERPRINT_LINES.includes("setMode auto"));
  assert.match(PHRASE, /iOS plan approval displaces prePlanMode/);
  assert.match(PHRASE, /score replevin or admit restored/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "expanded",
    "cognate",
    "literal",
    "laid",
    "lemures",
    "remanent",
    "released",
    "escheat",
    "stale",
    "freehold",
    "mortmain",
    "phantom",
    "trunked",
    "strowger",
    "exchanged",
    "tokenized",
    "mondegreen",
    "parsed",
    "locked",
    "scratched",
    "derby",
    "unmasked",
    "vizard",
    "precedence",
    "carrier",
    "moored",
    "scuttled",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "cleared",
    "mounded",
    "distinct",
    "held",
    "raised",
    "fallen",
    "primed",
    "flashed",
    "greenroomed",
    "scaffold",
    "stereotype",
    "parergon",
    "lacuna",
    "hangfire",
    "afterimage",
    "remora",
    "quieted",
    "unrung",
    "latent",
    "flushed",
    "collated",
    "stereotyped",
    "deadair",
    "squelch",
    "scuttle",
    "fresh",
    "stamped",
    "conflated",
    "steered",
    "vernier",
    "slider",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring a writ flips replevin to restored", () => {
  const tape = {
    restored: true,
    setModeAuto: false,
    iosApprove: false,
    rejectFallback: false,
    cue: "restored",
  };
  assert.equal(scoreGate(tape).verdict, "restored");
  tape.restored = false;
  tape.setModeAuto = true;
  tape.iosApprove = true;
  tape.rejectFallback = true;
  tape.cue = "replevin";
  assert.equal(scoreGate(tape).verdict, "replevin");
  tape.restored = true;
  tape.setModeAuto = false;
  tape.iosApprove = false;
  tape.rejectFallback = false;
  tape.cue = "restored";
  assert.equal(scoreGate(tape).verdict, "restored");
});

test("writ, bond, and benches mark displacement after iOS setMode auto", () => {
  const idleWrit = restoreWrit({ restored: true, setModeAuto: false });
  assert.equal(idleWrit.rite, "restored");
  assert.equal(idleWrit.mode, "bypassPermissions");
  const cutWrit = restoreWrit({ restored: false, setModeAuto: true, disableAutoMode: true });
  assert.equal(cutWrit.rite, "replevin");
  assert.equal(cutWrit.mode, "default");
  const live = sealBond({
    setModeAuto: false,
    iosApprove: false,
    rejectFallback: false,
  });
  assert.equal(live.sealed, false);
  assert.equal(live.stamp, "restored");
  const cut = sealBond({
    setModeAuto: true,
    iosApprove: true,
    rejectFallback: true,
    disableAutoMode: true,
    bypassDisplaced: true,
  });
  assert.equal(cut.stamp, "replevin");
  assert.equal(cut.fallbackDefault, true);
  const chamber = readChamber({
    setModeAuto: true,
    iosApprove: true,
    rejectFallback: true,
    disableAutoMode: true,
    bypassDisplaced: true,
  });
  assert.equal(chamber.displaced, true);
  assert.equal(chamber.cue, "replevin");
  const calm = readChamber({ restored: true, setModeAuto: false });
  assert.equal(calm.displaced, false);
  assert.equal(calm.cue, "restored");
  const benches = compareSurfaces({ iosApprove: true, disableAutoMode: true });
  assert.equal(benches.cli, "bypassPermissions");
  assert.equal(benches.android, "bypassPermissions");
  assert.equal(benches.ios, "default");
  assert.equal(benches.cliCorrect, true);
  assert.equal(benches.androidCorrect, true);
  assert.equal(benches.iosCorrect, false);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 79990);
  assert.equal(COUSINS[1].issue, 80812);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cognate"));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("calque"));
  assert.ok(NOT_PRODUCTS.includes("sigil"));
  assert.ok(NOT_PRODUCTS.includes("caret"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93219);
  assert.equal(BACKUPS[1].issue, 93239);
  assert.equal(BACKUPS[2].issue, 93259);
  assert.equal(BACKUPS[3].issue, 93257);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const restored = spawnSync(
    process.execPath,
    [modelPath()],
    { encoding: "utf8" },
  );
  const replevin = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/replevin.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(restored.status, 0, restored.stderr);
  assert.equal(replevin.status, 0, replevin.stderr);
  assert.equal(JSON.parse(restored.stdout).verdict, "restored");
  assert.equal(JSON.parse(replevin.stdout).verdict, "replevin");
});

test("handle exposes published hypothesis and #93207 headline", () => {
  const result = handle(readData("replevin.json"));
  assert.equal(result.published.issue, 93207);
  assert.equal(result.published.claudeVersion, "2.1.267");
  assert.equal(result.published.author, "miridius");
  assert.equal(result.published.buttonLabel, "Exit and auto mode");
  assert.equal(result.published.setMode, "auto");
  assert.equal(result.published.fallbackMode, "default");
  assert.deepEqual(result.published.cousins, [79990, 80812]);
  assert.deepEqual(result.published.backups, [93219, 93239, 93259, 93257]);
  assert.match(result.published.hypothesis, /setMode auto/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedReplevin()),
    /replevin\|pre=bypass\|ios=yes\|set=auto\|reject=default\|bypass=displaced\|cue=replevin/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a legal replevin chamber, not a cognate desk or courtyard", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Sora/);
  assert.match(page, /Roboto Mono/);
  assert.match(page, /replevin|writ desk|bond parchment|bronze seal|court green/i);
  assert.match(page, /#e6d5b8|#1b4d3e|#a86b32|#0f0d0b/);
  assert.match(page, /restored/);
  assert.match(page, /replevin/);
  assert.match(page, /defaulted/);
  assert.match(page, /score replevin or admit restored/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /15:50/);
  assert.match(page, /#263/);
  assert.match(page, /#93207/);
  assert.match(page, /prePlanMode/);
  assert.match(page, /bypassPermissions/);
  assert.match(page, /setMode/);
  assert.match(page, /disableAutoMode/);
  assert.match(page, /Exit and auto mode/);
  assert.match(page, /prepareContextForPlanMode/);
  assert.match(page, /miridius/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /Restore the writ/);
  assert.match(page, /Score replevin/);
  assert.match(page, /Seal the bond/);
  assert.match(page, /Compare surfaces/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#f4ead6/);
  assert.doesNotMatch(page, /#1c2744/);
  assert.doesNotMatch(page, /#c47a2c/);
  assert.doesNotMatch(page, /#f0d9a0/);
  assert.doesNotMatch(page, /#0a0e1c/);
  assert.doesNotMatch(page, /#12151f/);
  assert.doesNotMatch(page, /#c3924a/);
  assert.doesNotMatch(page, /#efe6d4/);
  assert.doesNotMatch(page, /night courtyard|black beans|bronze cymbals|chalk circles|bone-white masks/i);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID|iron coffer/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /philology|ochre gloss|cognate desk/i);
  assert.doesNotMatch(page, /\blaid\b/);
  assert.doesNotMatch(page, /\blemures\b/);
  assert.doesNotMatch(page, /\bremanent\b/);
  assert.doesNotMatch(page, /\bfreehold\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\btrunked\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bexpanded\b/);
  assert.doesNotMatch(page, /\bcognate\b/);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Ephemera/i);
  assert.match(page, /NOT Palimpsest/i);
  assert.match(page, /NOT Recension/i);
  assert.match(page, /NOT Quietus/i);
  assert.match(page, /NOT Calque/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Replevin/);
  assert.match(readme, /#93207/);
  assert.match(readme, /restored/);
  assert.match(readme, /replevin/);
  assert.match(readme, /defaulted/);
  assert.match(readme, /Literata/);
  assert.match(readme, /Sora/);
  assert.match(readme, /Roboto Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Cognate/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/replevin/);
  assert.match(readme, /node --test projects\/replevin\/replevin\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /prePlanMode/);
  assert.match(readme, /setMode/);
  assert.match(readme, /disableAutoMode/);
});

test("catalog #263 features Replevin; Cognate stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 263);
  assert.equal(catalog.products[0].name, "Replevin");
  assert.equal(catalog.products[0].slug, "replevin");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/replevin/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /15:50/);
  assert.match(catalog.products[0].summary, /replevin/);
  assert.match(catalog.products[0].summary, /#93207/);
  assert.match(catalog.products[0].summary, /restored/);
  const cognate = catalog.products.find((row) => row.slug === "cognate");
  assert.ok(cognate);
  assert.equal(cognate.featured, false);
  const lemures = catalog.products.find((row) => row.slug === "lemures");
  assert.ok(lemures);
  assert.equal(lemures.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "replevin").length, 1);
});

test("vercel rewrites replevin to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/replevin");
  assert.equal(vercel.rewrites[0].destination, "/projects/replevin");
  assert.equal(vercel.rewrites[1].source, "/replevin/");
  assert.equal(vercel.rewrites[1].destination, "/projects/replevin");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
