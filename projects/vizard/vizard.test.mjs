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
  CHANGELING_CITE,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DESKTOP_BUILD,
  DISTRIBUTION,
  EXPECTED,
  FALLBACK_MODEL,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  HOST_OS,
  IDLE_WORD,
  INTERMITTENT,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  MOBILE_SURFACE,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REPRO_DAY,
  RULED_OUT,
  SAMPLE_VIZARD_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  SYNTHETIC_BACKGROUND,
  SYNTHETIC_OPUS_FALLBACK,
  SYNTHETIC_PLEDGED,
  TITLE,
  VIZARD_WALK,
  VERDICTS,
  analyze,
  classify,
  decide,
  diagnose,
  emptyTicket,
  evaluateLifecycle,
  fingerprint,
  handle,
  inspectBackgroundForeground,
  inspectExistingSession,
  inspectExplicitChoice,
  inspectNoTurnInFlight,
  inspectOpusFallback,
  mapVizard,
  readBooth,
  score,
  scoreBackgroundReset,
  scoreGate,
  scoreWalk,
  seedBackgroundReset,
  seedExistingSession,
  seedOpusFallback,
  seedPledged,
  seedProduct,
  seedVizard,
} from "./vizard.mjs";

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
  return fileURLToPath(new URL("./vizard.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "06:50 vizard: an elizabethan vizard / half-mask / masque-ball / looking-glass booth for #94398. Remote Control (mobile): a model chosen on an existing session does not survive backgrounding — reopen and the indicator reads Opus 4.8 again (every time). Idle pledged / seeded vizard / path background-reset. Score vizard or admit pledged.";

test("idle pledged is a hold; session model choice survives lifecycle", () => {
  const result = analyze(seedPledged());
  assert.equal(result.verdict, "pledged");
  assert.equal(result.idleWord, "pledged");
  assert.equal(IDLE_WORD, "pledged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pledged, true);
  assert.equal(result.phrase, "admit pledged");
  assert.equal(result.vizard, false);
  assert.equal(result.backgroundReset, false);
  assert.ok(HOLD_ALIASES.includes("held"));
  assert.ok(HOLD_ALIASES.includes("chosen"));
  assert.ok(HOLD_ALIASES.includes("sticky-model"));
  assert.ok(HOLD_ALIASES.includes("retained"));
  assert.ok(HOLD_ALIASES.includes("masked-true"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "brisk");
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "released");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "unmasked");
});

test("empty ticket and empty stdin classify pledged", () => {
  assert.equal(classify(emptyTicket()), "pledged");
  assert.equal(classify(""), "pledged");
  assert.equal(classify(null), "pledged");
  assert.equal(decide({}), "pledged");
  assert.equal(diagnose("").verdict, "pledged");
});

test("#94398 seeded path scores vizard when the mask slips to Opus 4.8", () => {
  const result = analyze(seedVizard());
  assert.equal(result.verdict, "vizard");
  assert.equal(result.seededWord, "vizard");
  assert.equal(SEEDED_WORD, "vizard");
  assert.equal(PRODUCT_WORD, "vizard");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.vizard, true);
  assert.equal(result.phrase, "score vizard");
  assert.equal(result.backgroundReset, true);
  assert.equal(result.opusFallback, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "treacle");
  assert.notEqual(SEEDED_WORD, "somnus");
  assert.notEqual(SEEDED_WORD, "cresset");
  assert.notEqual(SEEDED_WORD, "dictabelt");
  assert.notEqual(SEEDED_WORD, "lemure");
  assert.notEqual(PATH_WORD, "streaming-stall");
  assert.notEqual(PATH_WORD, "device-absent");
  assert.notEqual(PATH_WORD, "hold-leak");
  assert.notEqual(PATH_WORD, "segment-drop");
  assert.notEqual(PATH_WORD, "orphan-tick");
});

test("educational lifecycle helper encodes published pledged vs background-reset paths", () => {
  assert.equal(CODE_BUILD, "2.1.266");
  assert.equal(DESKTOP_BUILD, "1.52386.6");
  assert.equal(HOST_OS, "macOS 26.6.2 (Mac17,9)");
  assert.equal(MOBILE_SURFACE, "Claude mobile app (iOS)");
  assert.equal(FALLBACK_MODEL, "Opus 4.8");
  assert.equal(REPRO_DAY, "2026-09-14");
  assert.equal(INTERMITTENT, false);
  assert.equal(SYNTHETIC_PLEDGED.survivesBackground, true);
  assert.equal(SYNTHETIC_BACKGROUND.turnInFlight, false);
  assert.equal(SYNTHETIC_OPUS_FALLBACK.indicator, "Opus 4.8");
  const slipped = evaluateLifecycle({ backgrounded: true });
  assert.equal(slipped.slipped, true);
  assert.equal(slipped.synthetic, true);
  const control = evaluateLifecycle({ pledged: true });
  assert.equal(control.slipped, false);
  const scored = scoreBackgroundReset({
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
  });
  assert.equal(scored.vizard, true);
  assert.equal(scored.backgroundReset, true);
  const quietPath = scoreBackgroundReset({ pledged: true });
  assert.equal(quietPath.vizard, false);
  assert.equal(quietPath.pledged, true);
});

test("inspectors mark opus-fallback and background-foreground", () => {
  const fallback = inspectOpusFallback({ vizard: true, opusFallback: true });
  assert.equal(fallback.stamp, "opus-fallback");
  assert.equal(fallback.slipped, true);
  const cycle = inspectBackgroundForeground({ vizard: true, backgroundForeground: true });
  assert.equal(cycle.stamp, "background-foreground");
  assert.equal(cycle.cycle, true);
  const scored = scoreGate({
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
    cue: "vizard",
  });
  assert.equal(scored.verdict, "vizard");
  const open = inspectOpusFallback({ pledged: true, vizard: false });
  assert.equal(open.stamp, "chosen-face");
});

test("path word is background-reset; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "background-reset");
  const result = analyze(seedBackgroundReset());
  assert.equal(result.verdict, "background-reset");
  assert.equal(result.pathWord, "background-reset");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "background-reset",
      preferSeed: true,
      vizard: true,
    }),
    "background-reset",
  );
  assert.equal(classify({ seed: "opus-fallback", preferSeed: true }), "opus-fallback");
  assert.equal(score(seedBackgroundReset()), "vizard");
});

test("HOLD includes pledged", () => {
  assert.ok(HOLD.includes("pledged"));
  assert.equal(HOLD.length, 1);
  assert.equal(classify({ seed: "held", preferSeed: true }), "held");
  assert.equal(classify({ seed: "chosen", preferSeed: true }), "chosen");
  assert.equal(classify({ seed: "sticky-model", preferSeed: true }), "sticky-model");
  assert.equal(classify({ seed: "retained", preferSeed: true }), "retained");
  assert.equal(classify({ seed: "masked-true", preferSeed: true }), "masked-true");
});

test("alarm chips: opus-fallback, background-reset, vizard", () => {
  assert.equal(classify({ seed: "opus-fallback", preferSeed: true }), "opus-fallback");
  assert.equal(classify(seedBackgroundReset()), "background-reset");
  assert.equal(classify(seedProduct()), "vizard");
  assert.equal(classify(seedOpusFallback()), "opus-fallback");
  assert.equal(classify(seedExistingSession()), "existing-session");
  assert.equal(classify({ seed: "explicit-choice", preferSeed: true }), "explicit-choice");
});

test("booth fixtures flip pledged vs vizard vs background-reset", () => {
  const idle = scoreGate(seedPledged());
  const seeded = scoreGate(seedVizard());
  const pledged = readData("pledged.json");
  const vizard = readData("vizard.json");
  const issued = readData("94398.json");
  const path = readData("background-reset.json");
  assert.equal(idle.verdict, "pledged");
  assert.equal(seeded.verdict, "vizard");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedPledged()), "pledged");
  assert.equal(score(seedVizard()), "vizard");
  assert.equal(score({ seed: "background-reset", preferSeed: true }), "vizard");
  assert.equal(pledged.backgroundReset, false);
  assert.equal(pledged.pledged, true);
  assert.equal(scoreGate(pledged).verdict, "pledged");
  assert.equal(vizard.backgroundReset, true);
  assert.equal(vizard.opusFallback, true);
  assert.equal(classify(vizard), "vizard");
  assert.equal(issued.issue, 94398);
  assert.equal(classify(issued), "vizard");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /pledged|held|chosen|sticky-model|retained|masked-true/i);
  assert.match(path.paths[1].result, /background-reset|opus-fallback|existing-session/i);
  assert.equal(classify(path), "background-reset");
  assert.equal(vizard.hubCount, "VIZARD");
  assert.equal(vizard.issue, 94398);
  assert.equal(vizard.vizard, true);
  assert.equal(classify(readData("held.json")), "held");
  assert.equal(classify(readData("chosen.json")), "chosen");
  assert.equal(classify(readData("sticky-model.json")), "sticky-model");
  assert.equal(classify(readData("retained.json")), "retained");
  assert.equal(classify(readData("masked-true.json")), "masked-true");
  assert.equal(classify(readData("opus-fallback.json")), "opus-fallback");
  assert.equal(classify(readData("existing-session.json")), "existing-session");
  assert.equal(classify(readData("explicit-choice.json")), "explicit-choice");
  assert.equal(classify(readData("no-turn-in-flight.json")), "no-turn-in-flight");
  assert.equal(classify(readData("background-foreground.json")), "background-foreground");
  assert.equal(classify(readData("every-time.json")), "every-time");
  assert.equal(classify(readData("desktop-too.json")), "desktop-too");
  assert.equal(classify(readData("ios-mobile.json")), "ios-mobile");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [89358, 90670]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("pledged"));
  assert.ok(CHIPS.includes("vizard"));
  assert.ok(CHIPS.includes("background-reset"));
  assert.ok(CHIPS.includes("opus-fallback"));
  assert.ok(CHIPS.includes("masked-true"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("vizard"));
  assert.ok(ALARM.includes("background-reset"));
  assert.ok(ALARM.includes("opus-fallback"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published vizard walk scores vizard after the idle hold", () => {
  const booth = scoreWalk({ rows: VIZARD_WALK });
  assert.equal(booth.verdict, "vizard");
  assert.ok(booth.vizardCount >= 1);
  const idle = booth.rows.find((row) => row.event === "masked-true");
  assert.equal(idle.pledged, true);
  assert.equal(idle.verdict, "pledged");
  const cut = booth.rows.find((row) => row.event === "background-reset");
  assert.equal(cut.backgroundReset, true);
  const path = booth.rows.find(
    (row) => row.event === "background-reset" && row.t === "path",
  );
  assert.equal(path.verdict, "background-reset");
});

test("VIZARD_WALK constant matches the issue dressing-table walk", () => {
  assert.equal(VIZARD_WALK[0].event, "masked-true");
  const cut = VIZARD_WALK.find((row) => row.event === "background-reset");
  assert.equal(cut.backgroundReset || cut.opusFallback, true);
  const path = VIZARD_WALK.find((row) => row.t === "path");
  assert.equal(path.vizard, true);
  const scoreRow = VIZARD_WALK.find((row) => row.event === "vizard");
  assert.equal(scoreRow.vizard, true);
  assert.equal(scoreRow.opusFallback, true);
});

test("positive control masked-true looking-glass stays pledged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "pledged");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "pledged");
  const hold = walk.rows.find((row) => row.event === "masked-true");
  assert.equal(hold.pledged, true);
  assert.equal(hold.verdict, "pledged");
});

test("issue constants encode only #94398 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94398);
  assert.ok(ISSUE_URL.includes("94398"));
  assert.match(TITLE, /Remote Control|Opus 4\.8|backgrounding/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /ios/i);
  assert.match(HOST, /1\.52386\.6|2\.1\.266|iOS|macOS 26\.6\.2/i);
  assert.match(BUILD, /2\.1\.266|1\.52386\.6/);
  assert.equal(SURFACE, "background-reset");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:model", "platform:ios"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#89358/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#90670/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#93757|Changeling/i.test(row)));
  assert.ok(EXPECTED.some((row) => /persists|lifecycle|Opus 4\.8/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /Opus 4\.8|backgrounding|2\.1\.266|2026-09-14|existing session/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("background-reset"));
  assert.ok(FINGERPRINT_LINES.includes("vizard"));
  assert.equal(PHRASE, "Score vizard or admit pledged.");
  assert.equal(SAMPLE_VIZARD_PROOF.backgroundReset, true);
  assert.equal(SAMPLE_VIZARD_PROOF.names.length, 6);
  assert.equal(SAMPLE_VIZARD_PROOF.synthetic, true);
});

test("has-repro fingerprints encode the published vizard proof", () => {
  const result = handle(seedVizard());
  assert.equal(result.published.platform, "ios");
  assert.equal(result.published.surface, "background-reset");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedVizard()),
    /vizard\|kind=background-reset\|ref=opus-fallback\|path=background-reset\|cue=background-reset/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words", () => {
  const required = [
    "brisk",
    "cadence",
    "released",
    "verbatim",
    "quiet",
    "intact",
    "unmasked",
    "treacle",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "frangible",
    "nameplate",
    "matryoshka",
    "dragnet",
    "hold-leak",
    "segment-drop",
    "orphan-tick",
    "device-absent",
    "streaming-stall",
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
    "swapped",
    "remote-reattach",
    "precedence",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("pledged booth flips vizard back when the looking-glass admits pledged", () => {
  const tape = {
    pledged: true,
    vizard: false,
    backgroundReset: false,
    cue: "pledged",
  };
  assert.equal(scoreGate(tape).verdict, "pledged");
  tape.pledged = false;
  tape.vizard = true;
  tape.backgroundReset = true;
  tape.cue = "vizard";
  assert.equal(scoreGate(tape).verdict, "vizard");
  tape.pledged = true;
  tape.vizard = false;
  tape.backgroundReset = false;
  tape.cue = "pledged";
  assert.equal(scoreGate(tape).verdict, "pledged");
});

test("opus-fallback, background-foreground, and readBooth mark the vizard proof", () => {
  const fallback = inspectOpusFallback({ vizard: true });
  assert.equal(fallback.stamp, "opus-fallback");
  const cycle = inspectBackgroundForeground({ vizard: true, backgroundForeground: true });
  assert.equal(cycle.stamp, "background-foreground");
  assert.equal(cycle.cycle, true);
  const booth = readBooth({
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
  });
  assert.equal(booth.vizard, true);
  assert.equal(booth.mark, "vizard");
  const open = readBooth({
    pledged: true,
    vizard: false,
    backgroundReset: false,
  });
  assert.equal(open.vizard, false);
  assert.equal(open.mark, "pledged");
  assert.equal(inspectExistingSession({ vizard: true, existingSession: true }).stamp, "existing-session");
  assert.equal(inspectExplicitChoice({ vizard: true, explicitChoice: true }).stamp, "explicit-choice");
  assert.equal(inspectNoTurnInFlight({ vizard: true, noTurnInFlight: true }).stamp, "no-turn-in-flight");
});

test("mapVizard encodes the published background-reset", () => {
  const miss = mapVizard({ vizard: true, backgroundReset: true });
  assert.equal(miss.stamp, "background-reset");
  assert.equal(miss.holdingLane, "looking-glass");
  assert.equal(miss.ribbon, "vizard");
  const clear = mapVizard({ pledged: true, vizard: false });
  assert.equal(clear.stamp, "masked-true");
  assert.equal(clear.kindLane, "gilt-edge-vizard");
  assert.equal(clear.holdingLane, "masked-true");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.deepEqual(COUSINS.map((row) => row.issue), [89358, 90670]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.equal(CHANGELING_CITE.issue, 93757);
  assert.equal(CHANGELING_CITE.citeOnly, true);
  assert.ok(NOT_PRODUCTS.includes("treacle"));
  assert.ok(NOT_PRODUCTS.includes("somnus"));
  assert.ok(NOT_PRODUCTS.includes("cresset"));
  assert.ok(NOT_PRODUCTS.includes("dictabelt"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94397);
  assert.equal(BACKUPS[9].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94398));
  assert.ok(!COUSINS.some((row) => row.issue === 94398));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/vizard.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const pledgedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/pledged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(pledgedFix.status, 0, pledgedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const pledgedOut = JSON.parse(pledgedFix.stdout);
  assert.equal(idleOut.verdict, "pledged");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "vizard");
  assert.equal(seededOut.alarm, true);
  assert.equal(pledgedOut.verdict, "pledged");
  assert.equal(pledgedOut.hold, true);
  assert.match(pledgedOut.phrase, /admit pledged/);
});

test("handle exposes published hypothesis and #94398 headline", () => {
  const result = handle(seedVizard());
  assert.equal(result.published.issue, 94398);
  assert.equal(result.published.platform, "ios");
  assert.deepEqual(result.published.cousins, [89358, 90670]);
  assert.ok(result.published.backups.includes(94397));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94398));
  assert.ok(!result.published.backups.includes(94336));
  assert.equal(result.published.changeling, 93757);
  assert.match(
    result.published.hypothesis,
    /rehydrat|Opus 4\.8|NON-BINDING|#94398/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94398/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the looking-glass can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("dressing-table is a vizard booth, not copper-kettle / moon-watch / iron-basket", () => {
  const page = readPage();
  assert.match(page, /family=Lora|Lora/);
  assert.match(page, /family=Public\+Sans|Public Sans/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /vizard|pledged|background-reset|gilt-edge-vizard|half-mask|masque-ball|velvet-ribbon|looking-glass|dressing-table/i,
  );
  assert.match(page, /#2A1830|#C9A227|#F4E8D0|#1A1220|#8B2942|#C5CBD3/i);
  assert.match(page, /\bpledged\b/);
  assert.match(page, /\bvizard\b/);
  assert.match(page, /background-reset/);
  assert.match(page, /Score vizard or admit pledged/i);
  assert.match(page, /#376/);
  assert.match(page, /#94398/);
  assert.match(page, /Admit pledged/);
  assert.match(page, /Score vizard/);
  assert.match(page, /Walk background-reset/);
  assert.match(page, /Compare pledged \/ vizard/);
  assert.match(page, /Pin idle pledged/);
  assert.match(page, /Pin seeded vizard/);
  assert.match(page, /Pin background-reset/);
  assert.match(page, /Stamp opus-fallback/);
  assert.match(page, /Score booth/);
  assert.match(page, /vizard-score/);
  assert.match(
    page,
    /1\.52386\.6|2\.1\.266|Opus 4\.8|Mac17,9|2026-09-14/i,
  );
  assert.match(page, /gilt-edge-vizard|half-mask|masque-ball|velvet-ribbon|looking-glass|dressing-table/i);
  assert.match(
    page,
    /<svg[\s\S]*class="gilt-edge-vizard"|class="half-mask"|class="looking-glass"|class="velvet-ribbon"|class="dressing-table"/i,
  );
  assert.doesNotMatch(page, /family=Cormorant\+Infant|Cormorant Infant/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /#4C1E0A|#C46A2B|#F8EBD4|#7A3514|#D4A84B/);
  assert.doesNotMatch(page, /#12162E|#F3EBDD|#C5CDD8|#8B6FCF|#2E9A96/);
  assert.doesNotMatch(page, /#E07020|#2A2E33|#E8E4DC|#0E1218|#F0C14A|#3D6F8C/);
  assert.doesNotMatch(page, /copper-kettle|treacle-well|sticky-ladle|wax-paper-twist|enamel-scale|molasses-pour/);
  assert.doesNotMatch(page, /moon-watch|nursery-desk|absent-chip|cadence-dial|sleep-ledger/);
  assert.doesNotMatch(page, /iron-basket|ember-snuff|gnome-dial|battlement|hold-ledger/);
  assert.doesNotMatch(page, /wax-belt|stenotype|steel-drum|gooseneck-mic|live-stylus/);
  assert.doesNotMatch(page, /admit brisk|Score treacle|idle brisk/i);
  assert.doesNotMatch(page, /admit cadence|Score somnus|idle cadence/i);
  assert.doesNotMatch(page, /admit released|Score cresset|idle released/i);
  assert.doesNotMatch(page, /admit verbatim|Score dictabelt|idle verbatim/i);
  assert.doesNotMatch(page, /\btreacle\b/);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /streaming-stall/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.match(page, /NOT Treacle/i);
  assert.match(page, /NOT Somnus/i);
  assert.match(page, /NOT Cresset/i);
  assert.match(page, /NOT Dictabelt/i);
  assert.match(page, /NOT Lemure/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /#89358/);
  assert.match(page, /#90670/);
  assert.match(page, /#93757/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Vizard/);
  assert.match(readme, /#94398/);
  assert.match(readme, /\bpledged\b/);
  assert.match(readme, /\bvizard\b/);
  assert.match(readme, /background-reset/);
  assert.match(readme, /Lora/);
  assert.match(readme, /Public Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Cormorant Infant/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Karla/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /1\.52386\.6|Opus 4\.8|2\.1\.266|2026-09-14/i);
  assert.match(readme, /NOT #89358/);
  assert.match(readme, /NOT #90670/);
  assert.match(readme, /NOT Changeling\/#93757/);
  assert.match(readme, /NOT Treacle\/#94344/);
  assert.match(readme, /NOT Somnus\/#94415/);
  assert.match(readme, /NOT Cresset\/#94420/);
  assert.match(readme, /NOT Dictabelt\/#94406/);
  assert.match(readme, /#89358/);
  assert.match(readme, /#90670/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/vizard/);
  assert.match(readme, /node --test projects\/vizard\/vizard\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /half-mask|masque-ball|looking-glass|gilt-edge|velvet ribbon/i);
  assert.match(readme, /Score vizard or admit pledged/);
  assert.match(readme, /#94397|#94396|#94151/);
  assert.match(readme, /06:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /copper kettle|treacle-well|sticky-ladle|night-nursery|moon-watch|iron fire-basket|wax-belt|stenotype/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Vizard/);
  assert.match(runLog, /06:50/);
});

test("catalog features Vizard only; Treacle unfeatured; product count 376", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 376);
  assert.equal(hub.products.length, 376);
  assert.equal(catalog.products[0].name, "Vizard");
  assert.equal(catalog.products[0].slug, "vizard");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/vizard/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bpledged\b/);
  assert.match(catalog.products[0].summary, /\bvizard\b/);
  assert.match(catalog.products[0].summary, /background-reset/);
  assert.match(catalog.products[0].summary, /Score vizard or admit pledged/);
  assert.match(catalog.products[0].summary, /#94398/);
  assert.match(catalog.products[0].summary, /06:50/);
  assert.equal(hub.products[0].slug, "vizard");
  assert.equal(hub.products[0].featured, true);
  const treacle = catalog.products.find((row) => row.slug === "treacle");
  assert.ok(treacle);
  assert.equal(treacle.featured, false);
  const somnus = catalog.products.find((row) => row.slug === "somnus");
  assert.ok(somnus);
  assert.equal(somnus.featured, false);
  const cresset = catalog.products.find((row) => row.slug === "cresset");
  assert.ok(cresset);
  assert.equal(cresset.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "vizard" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94398") && row.slug !== "vizard",
    ),
  );
});

test("vercel rewrites vizard to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/vizard");
  assert.equal(vercel.rewrites[0].destination, "/projects/vizard");
  assert.equal(vercel.rewrites[1].source, "/vizard/");
  assert.equal(vercel.rewrites[1].destination, "/projects/vizard");
  assert.equal(vercel.rewrites[2].source, "/vizard/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/vizard/:path*");
  assert.equal(vercel.rewrites[3].source, "/treacle");
  assert.equal(vercel.rewrites[3].destination, "/projects/treacle");
});

test("no leftover clone / copper-kettle / moon-watch content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|ember-snuff|wax-belt|stenotype/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
