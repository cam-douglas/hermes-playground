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
  ECHO_SHAPES,
  RULED_OUT,
  SOUFFLEUR_WALK,
  SAMPLE_SOUFFLEUR_PROOF,
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
  inspectCurtain,
  inspectCue,
  inspectFocusReturn,
  inspectFootlights,
  inspectPrompt,
  inspectWings,
  mapHouse,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAppSwitchEchoLoss,
  seedElectronCousin,
  seedHold,
  seedProduct,
  seedSouffleur,
  seedEchoing,
  seedTypingEchoLost,
} from "./souffleur.mjs";

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
  return fileURLToPath(new URL("./souffleur.mjs", import.meta.url));
}

test("idle echoing is a hold; prompt-corner whispers and wings stay open", () => {
  const result = analyze(seedEchoing());
  assert.equal(result.verdict, "echoing");
  assert.equal(result.idleWord, "echoing");
  assert.equal(IDLE_WORD, "echoing");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.echoing, true);
  assert.equal(result.phrase, "admit echoing");
  assert.equal(result.souffleur, false);
  assert.equal(result.appSwitchEchoLoss, false);
  assert.ok(HOLD_ALIASES.includes("echoing"));
  assert.ok(HOLD_ALIASES.includes("voiced-echo"));
  assert.ok(HOLD_ALIASES.includes("cued"));
  assert.ok(HOLD_ALIASES.includes("announced"));
  assert.ok(HOLD_ALIASES.includes("prompt-heard"));
  assert.ok(HOLD_ALIASES.includes("wings-open"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify echoing", () => {
  assert.equal(classify(emptyTicket()), "echoing");
  assert.equal(classify(""), "echoing");
  assert.equal(classify(null), "echoing");
  assert.equal(decide({}), "echoing");
});

test("#94031 seeded path scores souffleur when typing echo is lost after app switch", () => {
  const result = analyze(seedSouffleur());
  assert.equal(result.verdict, "souffleur");
  assert.equal(result.seededWord, "souffleur");
  assert.equal(SEEDED_WORD, "souffleur");
  assert.equal(PRODUCT_WORD, "souffleur");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.souffleur, true);
  assert.equal(result.phrase, "score souffleur");
  assert.equal(result.appSwitchEchoLoss, true);
  assert.equal(result.typingEchoLost, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark silent prompt-corner and dimmed footlights", () => {
  const wings = inspectWings({ souffleur: true, appSwitchEchoLoss: true });
  assert.equal(wings.stamp, "wings-exited");
  assert.equal(wings.departed, true);
  const prompt = inspectPrompt({ souffleur: true, appSwitchEchoLoss: true });
  assert.equal(prompt.stamp, "prompt-hushed");
  assert.equal(prompt.silent, true);
  const cue = inspectCue({ souffleur: true, typingEchoLost: true });
  assert.equal(cue.stamp, "cue-lost");
  const scored = scoreGate({
    souffleur: true,
    appSwitchEchoLoss: true,
    typingEchoLost: true,
    cue: "souffleur",
  });
  assert.equal(scored.verdict, "souffleur");
  const open = inspectWings({ echoing: true, souffleur: false });
  assert.equal(open.stamp, "wings-open");
});

test("path word is app-switch-echo-loss; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "app-switch-echo-loss");
  const result = analyze(seedAppSwitchEchoLoss());
  assert.equal(result.verdict, "app-switch-echo-loss");
  assert.equal(result.pathWord, "app-switch-echo-loss");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "app-switch-echo-loss",
      preferSeed: true,
      souffleur: true,
    }),
    "app-switch-echo-loss",
  );
  assert.equal(classify(seedTypingEchoLost()), "typing-echo-lost");
  assert.equal(score(seedAppSwitchEchoLoss()), "souffleur");
});

test("HOLD includes echoing / hold", () => {
  assert.ok(HOLD.includes("echoing"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: typing-echo-lost, electron-cousin, souffleur", () => {
  assert.equal(classify(seedTypingEchoLost()), "typing-echo-lost");
  assert.equal(classify(seedElectronCousin()), "electron-cousin");
  assert.equal(classify(seedProduct()), "souffleur");
});

test("booth fixtures flip echoing vs souffleur vs app-switch-echo-loss", () => {
  const idle = scoreGate(seedEchoing());
  const seeded = scoreGate(seedSouffleur());
  const echoing = readData("echoing.json");
  const souffleur = readData("souffleur.json");
  const path = readData("app-switch-echo-loss.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "echoing");
  assert.equal(seeded.verdict, "souffleur");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedEchoing()), "echoing");
  assert.equal(score(seedSouffleur()), "souffleur");
  assert.equal(
    score({ seed: "app-switch-echo-loss", preferSeed: true }),
    "souffleur",
  );
  assert.equal(echoing.appSwitchEchoLoss, false);
  assert.equal(echoing.echoing, true);
  assert.equal(scoreGate(echoing).verdict, "echoing");
  assert.equal(souffleur.appSwitchEchoLoss, true);
  assert.equal(souffleur.typingEchoLost, true);
  assert.equal(souffleur.focusReturnMute, true);
  assert.equal(classify(souffleur), "souffleur");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /echoing|voiced-echo|cued|announced|prompt-heard|wings-open/i,
  );
  assert.match(
    path.paths[1].result,
    /app-switch-echo-loss|typing-echo|focus-return|1\.52386\.3/i,
  );
  assert.equal(classify(path), "app-switch-echo-loss");
  assert.equal(souffleur.hubCount, "SOUFFLEUR");
  assert.equal(souffleur.issue, 94031);
  assert.equal(souffleur.souffleur, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("voiced-echo.json")), "voiced-echo");
  assert.equal(classify(readData("cued.json")), "cued");
  assert.equal(classify(readData("announced.json")), "announced");
  assert.equal(classify(readData("prompt-heard.json")), "prompt-heard");
  assert.equal(classify(readData("wings-open.json")), "wings-open");
  assert.equal(classify(readData("typing-echo-lost.json")), "typing-echo-lost");
  assert.equal(classify(readData("focus-return-mute.json")), "focus-return-mute");
  assert.equal(classify(readData("quit-relaunch-only.json")), "quit-relaunch-only");
  assert.equal(classify(readData("vo-nav-still-works.json")), "vo-nav-still-works");
  assert.equal(classify(readData("electron-cousin.json")), "electron-cousin");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("echoing"));
  assert.ok(CHIPS.includes("souffleur"));
  assert.ok(CHIPS.includes("app-switch-echo-loss"));
  assert.ok(CHIPS.includes("typing-echo-lost"));
  assert.ok(CHIPS.includes("focus-return-mute"));
  assert.ok(CHIPS.includes("voiced-echo"));
  assert.ok(CHIPS.includes("wings-open"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("souffleur"));
  assert.ok(ALARM.includes("app-switch-echo-loss"));
  assert.ok(ALARM.includes("typing-echo-lost"));
  assert.ok(ALARM.includes("focus-return-mute"));
  assert.ok(ALARM.includes("quit-relaunch-only"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published souffleur walk scores souffleur after the idle hold", () => {
  const booth = scoreWalk({ rows: SOUFFLEUR_WALK });
  assert.equal(booth.verdict, "souffleur");
  assert.ok(booth.souffleurCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-echoing");
  assert.equal(idle.echoing, true);
  assert.equal(idle.verdict, "echoing");
  const cut = booth.rows.find((row) => row.event === "app-switch-echo-loss");
  assert.equal(cut.appSwitchEchoLoss, true);
  const path = booth.rows.find(
    (row) => row.event === "app-switch-echo-loss" && row.t === "path",
  );
  assert.equal(path.verdict, "app-switch-echo-loss");
});

test("SOUFFLEUR_WALK constant matches the issue house walk", () => {
  assert.equal(SOUFFLEUR_WALK[0].event, "cue-echoing");
  const cut = SOUFFLEUR_WALK.find(
    (row) => row.event === "app-switch-echo-loss",
  );
  assert.equal(cut.appSwitchEchoLoss || cut.typingEchoLost, true);
  const path = SOUFFLEUR_WALK.find((row) => row.t === "path");
  assert.equal(path.souffleur, true);
  const scoreRow = SOUFFLEUR_WALK.find((row) => row.event === "souffleur");
  assert.equal(scoreRow.souffleur, true);
});

test("positive control echoing house stays echoing", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "echoing");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "echoing");
  const hold = walk.rows.find((row) => row.event === "cue-echoing");
  assert.equal(hold.echoing, true);
  assert.equal(hold.verdict, "echoing");
});

test("issue constants encode only #94031 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94031);
  assert.ok(ISSUE_URL.includes("94031"));
  assert.match(TITLE, /VoiceOver|typed characters|switching to another app/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /desktop|1\.52386\.3|Electron 44\.2\.0/i);
  assert.equal(BUILD, "1.52386.3");
  assert.equal(SURFACE, "app-switch-echo-loss");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:a11y", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(ECHO_SHAPES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Epitome|#94032/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Aphonia|#92409/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sourdine|#93531/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Anarthria|#93782/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Followspot/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /announce each typed character|app switch|1\.52386\.3/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /1\.52386\.3|Electron 44\.2\.0|11 September 2026|VoiceOver|Cmd F5|25F84|electron\/electron#13203|#87977/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("app-switch-echo-loss"));
  assert.ok(FINGERPRINT_LINES.includes("souffleur"));
  assert.equal(PHRASE, "Score souffleur or admit echoing.");
  assert.equal(SAMPLE_SOUFFLEUR_PROOF.appSwitchEchoLoss, true);
  assert.equal(SAMPLE_SOUFFLEUR_PROOF.shapes.length, 6);
});

test("has-repro fingerprints encode the published souffleur proof", () => {
  const result = handle(seedSouffleur());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "app-switch-echo-loss");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSouffleur()),
    /souffleur\|kind=app-switch-echo-loss\|ref=lost-echo\|path=app-switch-echo-loss\|cue=app-switch-echo-loss/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and voiced/mute", () => {
  const required = [
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
    "latent",
    "flushed",
    "articulate",
    "limber",
    "primed",
    "lit",
    "voiced",
    "mute",
    "rostered",
    "quieted",
    "unrung",
    "demesned",
    "diagrammed",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "sneck",
    "drawbridge",
    "chirograph",
    "titulus",
    "derelict",
    "vestry",
    "mondegreen",
    "afterimage",
    "phosphene",
    "scotoma",
    "scrim",
    "aphonia",
    "sourdine",
    "anarthria",
    "summarized-thinking-force",
    "cannot-show-not-git",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
    "dictation-paste-drop",
    "mid-narration",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("echoing booth flips souffleur back when the house admits echoing", () => {
  const tape = {
    echoing: true,
    souffleur: false,
    appSwitchEchoLoss: false,
    cue: "echoing",
  };
  assert.equal(scoreGate(tape).verdict, "echoing");
  tape.echoing = false;
  tape.souffleur = true;
  tape.appSwitchEchoLoss = true;
  tape.cue = "souffleur";
  assert.equal(scoreGate(tape).verdict, "souffleur");
  tape.echoing = true;
  tape.souffleur = false;
  tape.appSwitchEchoLoss = false;
  tape.cue = "echoing";
  assert.equal(scoreGate(tape).verdict, "echoing");
});

test("wings, prompt, curtain, and readBooth mark the souffleur proof", () => {
  const idle = inspectWings({
    echoing: true,
  });
  assert.equal(idle.stamp, "wings-open");
  const prompt = inspectPrompt({ souffleur: true, appSwitchEchoLoss: true });
  assert.equal(prompt.stamp, "prompt-hushed");
  assert.equal(prompt.silent, true);
  const cue = inspectCue({ souffleur: true, typingEchoLost: true });
  assert.equal(cue.stamp, "cue-lost");
  const booth = readBooth({
    souffleur: true,
    appSwitchEchoLoss: true,
    typingEchoLost: true,
  });
  assert.equal(booth.souffleur, true);
  assert.equal(booth.mark, "souffleur");
  const open = readBooth({
    echoing: true,
    souffleur: false,
    appSwitchEchoLoss: false,
  });
  assert.equal(open.souffleur, false);
  assert.equal(open.mark, "echoing");
  assert.equal(
    inspectFocusReturn({ souffleur: true, focusReturnMute: true }).stamp,
    "focus-return-mute",
  );
  assert.equal(inspectPrompt({ echoing: true }).stamp, "prompt-heard");
  assert.equal(
    inspectCurtain({ souffleur: true, quitRelaunchOnly: true }).stamp,
    "curtain-dropped",
  );
  assert.equal(
    inspectFootlights({ souffleur: true, focusReturnMute: true }).stamp,
    "footlights-dim",
  );
});

test("mapHouse encodes the published open hush", () => {
  const miss = mapHouse({ souffleur: true, appSwitchEchoLoss: true });
  assert.equal(miss.stamp, "app-switch-echo-loss");
  assert.equal(miss.holdingLane, "hushed");
  assert.equal(miss.ribbon, "souffleur");
  const clear = mapHouse({ echoing: true, souffleur: false });
  assert.equal(clear.stamp, "echoing-house");
  assert.equal(clear.kindLane, "wings-open");
  assert.equal(clear.holdingLane, "announced");
});

test("cousins cite #87977 #87978 #91058 #86697 electron#13203 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 87977);
  assert.equal(COUSINS[1].issue, 87978);
  assert.equal(COUSINS[2].issue, 91058);
  assert.equal(COUSINS[3].issue, 86697);
  assert.equal(COUSINS[4].issue, 13203);
  assert.equal(COUSINS[4].repo, "electron/electron");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[10].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94031));
  assert.ok(!BACKUPS.some((row) => row.issue === 87977));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/souffleur.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const echoingFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/echoing.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(echoingFix.status, 0, echoingFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const echoingOut = JSON.parse(echoingFix.stdout);
  assert.equal(idleOut.verdict, "echoing");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "souffleur");
  assert.equal(seededOut.alarm, true);
  assert.equal(echoingOut.verdict, "echoing");
  assert.equal(echoingOut.hold, true);
  assert.match(echoingOut.phrase, /admit echoing/);
});

test("handle exposes published hypothesis and #94031 headline", () => {
  const result = handle(seedSouffleur());
  assert.equal(result.published.issue, 94031);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [87977, 87978, 91058, 86697, 13203]);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94031));
  assert.match(
    result.published.hypothesis,
    /Electron|Chromium|focus restore|44\.2\.0|NON-BINDING|#94031/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94031/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the echoing page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("echoing page is a theatre prompt-corner, not a scriptorium desk or ENT roster", () => {
  const page = readPage();
  assert.match(page, /family=Playfair\+Display|Playfair Display/);
  assert.match(page, /family=Literata|Literata/);
  assert.match(page, /DM\+Mono|DM Mono/);
  assert.match(
    page,
    /souffleur|echoing|app-switch-echo-loss|prompt-corner|cue-script|footlights|wings|curtain/i,
  );
  assert.match(page, /#0D0B0F|#F5EFE0|#E8B84A|#7A1F2B|#2A2428|#6E7A86|#C45B6A/i);
  assert.match(page, /\bechoing\b/);
  assert.match(page, /\bsouffleur\b/);
  assert.match(page, /app-switch-echo-loss/);
  assert.match(page, /Score souffleur or admit echoing/i);
  assert.match(page, /#354/);
  assert.match(page, /#94031/);
  assert.match(page, /Admit echoing/);
  assert.match(page, /Score souffleur/);
  assert.match(page, /Walk app-switch-echo-loss/);
  assert.match(page, /Compare echoing \/ souffleur/);
  assert.match(page, /Pin idle echoing/);
  assert.match(page, /Pin seeded souffleur/);
  assert.match(page, /Pin app-switch-echo-loss/);
  assert.match(page, /Open the wings/);
  assert.match(page, /Score booth/);
  assert.match(page, /souffleur-score/);
  assert.match(
    page,
    /1\.52386\.3|Electron 44\.2\.0|VoiceOver|11 September 2026|25F84/i,
  );
  assert.match(page, /wings|prompt-corner|cue-script|footlights|curtain/i);
  assert.match(page, /<svg[\s\S]*class="prompt-box"|class="curtain-drop"|class="footlight"/i);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /phosphor|\bCRT\b/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /folio-leaf|press-beam/);
  assert.doesNotMatch(page, /ENT roster|laryngology|concert mute/i);
  assert.doesNotMatch(page, /admit unabridged|idle unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /\bunabridged\b/);
  assert.doesNotMatch(page, /\bepitome\b/);
  assert.doesNotMatch(page, /summarized-thinking-force/);
  assert.doesNotMatch(page, /Score aphonia|admit rostered|idle articulate/i);
  assert.doesNotMatch(page, /Score sourdine|mid-narration mute booth/i);
  assert.doesNotMatch(page, /Score anarthria|dictation paste drop booth/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Anarthria/i);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Souffleur/);
  assert.match(readme, /#94031/);
  assert.match(readme, /\bechoing\b/);
  assert.match(readme, /\bsouffleur\b/);
  assert.match(readme, /app-switch-echo-loss/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /Literata/);
  assert.match(readme, /DM Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /APP-SWITCH-ECHO-LOSS|typing echo|VoiceOver|1\.52386\.3/i,
  );
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Aphonia\/#92409/);
  assert.match(readme, /NOT Sourdine\/#93531/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /#87977|#87978|#91058|#86697|electron\/electron#13203/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/souffleur/);
  assert.match(readme, /node --test projects\/souffleur\/souffleur\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /wings|prompt-corner|cue-script|footlights|curtain/i);
  assert.match(readme, /Score souffleur or admit echoing/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94059|#94053|#94174|#94151|#94065|#94064/,
  );
  assert.match(readme, /13:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Souffleur/);
  assert.match(runLog, /13:50/);
});

test("catalog features Souffleur only; Epitome unfeatured; product count 354", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 354);
  assert.equal(hub.products.length, 354);
  assert.equal(catalog.products[0].name, "Souffleur");
  assert.equal(catalog.products[0].slug, "souffleur");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/souffleur/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "13:50 souffleur: a theatre-wings / prompt-corner / cue-script / footlights / curtain booth for #94031. After an app-switch exit to the wings and return, VoiceOver typing echo dies in the prompt box while VO nav, headings, and Claude replies still speak; quit+relaunch restores until the next switch. Idle echoing / seeded souffleur / path app-switch-echo-loss. Score souffleur or admit echoing.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bechoing\b/);
  assert.match(catalog.products[0].summary, /\bsouffleur\b/);
  assert.match(catalog.products[0].summary, /app-switch-echo-loss/);
  assert.match(catalog.products[0].summary, /Score souffleur or admit echoing/);
  assert.match(catalog.products[0].summary, /#94031/);
  assert.equal(hub.products[0].slug, "souffleur");
  assert.equal(hub.products[0].featured, true);
  const epitome = catalog.products.find((row) => row.slug === "epitome");
  assert.ok(epitome);
  assert.equal(epitome.featured, false);
  const diabolica = catalog.products.find((row) => row.slug === "diabolica");
  assert.ok(diabolica);
  assert.equal(diabolica.featured, false);
  const aphonia = catalog.products.find((row) => row.slug === "aphonia");
  assert.ok(aphonia);
  assert.equal(aphonia.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "souffleur").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94031") && row.slug !== "souffleur",
    ),
  );
});

test("vercel rewrites souffleur to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/souffleur");
  assert.equal(vercel.rewrites[0].destination, "/projects/souffleur");
  assert.equal(vercel.rewrites[1].source, "/souffleur/");
  assert.equal(vercel.rewrites[1].destination, "/projects/souffleur");
  assert.equal(vercel.rewrites[2].source, "/souffleur/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/souffleur/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
