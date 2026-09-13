import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ANARTHRIA_WALK,
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
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INSERT_PATH,
  INTERSECTION,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_ANARTHRIA_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  WISPR,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectClipboard,
  inspectPaste,
  inspectPrompt,
  mapScope,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAnarthria,
  seedArticulate,
  seedDictationPasteDrop,
  seedHold,
  seedProduct,
  seedSilentDrop,
  seedVscodeWsl,
  seedWisprCtrlV,
} from "./anarthria.mjs";

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
  return fileURLToPath(new URL("./anarthria.mjs", import.meta.url));
}

test("idle articulate is a hold; paste lands; prompt receives dictation", () => {
  const result = analyze(seedArticulate());
  assert.equal(result.verdict, "articulate");
  assert.equal(result.idleWord, "articulate");
  assert.equal(IDLE_WORD, "articulate");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.articulate, true);
  assert.equal(result.phrase, "admit articulate");
  assert.equal(result.anarthria, false);
  assert.equal(result.dictationPasteDrop, false);
  assert.ok(HOLD_ALIASES.includes("articulate"));
  assert.ok(HOLD_ALIASES.includes("phonated"));
  assert.ok(HOLD_ALIASES.includes("received"));
  assert.ok(HOLD_ALIASES.includes("landing"));
  assert.ok(HOLD_ALIASES.includes("larynx-open"));
  assert.ok(HOLD_ALIASES.includes("clipboard-heard"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify articulate", () => {
  assert.equal(classify(emptyTicket()), "articulate");
  assert.equal(classify(""), "articulate");
  assert.equal(classify(null), "articulate");
  assert.equal(decide({}), "articulate");
});

test("#93782 seeded path scores anarthria when the paste is swallowed", () => {
  const result = analyze(seedAnarthria());
  assert.equal(result.verdict, "anarthria");
  assert.equal(result.seededWord, "anarthria");
  assert.equal(SEEDED_WORD, "anarthria");
  assert.equal(PRODUCT_WORD, "anarthria");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.anarthria, true);
  assert.equal(result.phrase, "score anarthria");
  assert.equal(result.dictationPasteDrop, true);
  assert.equal(result.silentDrop, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("dictation-paste-drop plus silent-drop is the #93782 anarthria", () => {
  const paste = inspectPaste({ anarthria: true, dictationPasteDrop: true });
  assert.equal(paste.stamp, "paste-dropped");
  assert.match(paste.path, /clipboard|Ctrl\+V/i);
  const scored = scoreGate({
    anarthria: true,
    dictationPasteDrop: true,
    silentDrop: true,
    wisprCtrlV: true,
    cue: "anarthria",
  });
  assert.equal(scored.verdict, "anarthria");
  assert.equal(scored.dictationPasteDrop, true);
  const open = inspectClipboard({ articulate: true, dictationPasteDrop: false });
  assert.equal(open.stamp, "clipboard-ready");
});

test("path word is dictation-paste-drop; clinic seed holds the path", () => {
  assert.equal(PATH_WORD, "dictation-paste-drop");
  const result = analyze(seedDictationPasteDrop());
  assert.equal(result.verdict, "dictation-paste-drop");
  assert.equal(result.pathWord, "dictation-paste-drop");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "dictation-paste-drop", preferSeed: true, anarthria: true }),
    "dictation-paste-drop",
  );
  assert.equal(classify(seedWisprCtrlV()), "wispr-ctrlv");
});

test("HOLD includes articulate / hold", () => {
  assert.ok(HOLD.includes("articulate"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: vscode-wsl, silent-drop, anarthria", () => {
  assert.equal(classify(seedVscodeWsl()), "vscode-wsl");
  assert.equal(classify(seedSilentDrop()), "silent-drop");
  assert.equal(classify(seedProduct()), "anarthria");
});

test("booth fixtures flip articulate vs anarthria vs dictation-paste-drop", () => {
  const idle = scoreGate(seedArticulate());
  const seeded = scoreGate(seedAnarthria());
  const articulate = readData("articulate.json");
  const anarthria = readData("anarthria.json");
  const path = readData("dictation-paste-drop.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "articulate");
  assert.equal(seeded.verdict, "anarthria");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedArticulate()), "articulate");
  assert.equal(score(seedAnarthria()), "anarthria");
  assert.equal(articulate.dictationPasteDrop, false);
  assert.equal(articulate.articulate, true);
  assert.equal(scoreGate(articulate).verdict, "articulate");
  assert.equal(anarthria.dictationPasteDrop, true);
  assert.equal(anarthria.silentDrop, true);
  assert.equal(anarthria.wisprCtrlV, true);
  assert.equal(classify(anarthria), "anarthria");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /articulate|paste lands|prompt receives|larynx/i);
  assert.match(path.paths[1].result, /Ctrl\+V|clipboard|silently dropped|swallowed/i);
  assert.equal(classify(path), "dictation-paste-drop");
  assert.equal(anarthria.hubCount, "ANARTHRIA");
  assert.equal(anarthria.issue, 93782);
  assert.equal(anarthria.anarthria, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("phonated.json")), "phonated");
  assert.equal(classify(readData("received.json")), "received");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("larynx-open.json")), "larynx-open");
  assert.equal(classify(readData("clipboard-heard.json")), "clipboard-heard");
  assert.equal(classify(readData("wispr-ctrlv.json")), "wispr-ctrlv");
  assert.equal(classify(readData("vscode-wsl.json")), "vscode-wsl");
  assert.equal(classify(readData("regression-21269.json")), "regression-21269");
  assert.equal(classify(readData("windows-terminal-ok.json")), "windows-terminal-ok");
  assert.equal(classify(readData("plain-bash-ok.json")), "plain-bash-ok");
  assert.equal(classify(readData("silent-drop.json")), "silent-drop");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("articulate"));
  assert.ok(CHIPS.includes("anarthria"));
  assert.ok(CHIPS.includes("dictation-paste-drop"));
  assert.ok(CHIPS.includes("wispr-ctrlv"));
  assert.ok(CHIPS.includes("vscode-wsl"));
  assert.ok(CHIPS.includes("phonated"));
  assert.ok(CHIPS.includes("silent-drop"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("anarthria"));
  assert.ok(ALARM.includes("dictation-paste-drop"));
  assert.ok(ALARM.includes("wispr-ctrlv"));
  assert.ok(ALARM.includes("silent-drop"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published anarthria walk scores anarthria after the idle hold", () => {
  const booth = scoreWalk({ rows: ANARTHRIA_WALK });
  assert.equal(booth.verdict, "anarthria");
  assert.ok(booth.anarthriaCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-articulate");
  assert.equal(idle.articulate, true);
  assert.equal(idle.verdict, "articulate");
  const cut = booth.rows.find((row) => row.event === "dictation-paste-drop");
  assert.equal(cut.dictationPasteDrop, true);
  const path = booth.rows.find((row) => row.event === "dictation-paste-drop" && row.t === "path");
  assert.equal(path.verdict, "dictation-paste-drop");
});

test("ANARTHRIA_WALK constant matches the issue clinic walk", () => {
  assert.equal(ANARTHRIA_WALK[0].event, "cue-articulate");
  const cut = ANARTHRIA_WALK.find((row) => row.event === "dictation-paste-drop");
  assert.equal(cut.dictationPasteDrop, true);
  const path = ANARTHRIA_WALK.find((row) => row.t === "path");
  assert.equal(path.anarthria, true);
  const scoreRow = ANARTHRIA_WALK.find((row) => row.event === "anarthria");
  assert.equal(scoreRow.anarthria, true);
});

test("positive control articulate glottis stays articulate", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "articulate");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "articulate");
  const hold = walk.rows.find((row) => row.event === "cue-articulate");
  assert.equal(hold.articulate, true);
  assert.equal(hold.verdict, "articulate");
});

test("issue constants encode only #93782 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93782);
  assert.ok(ISSUE_URL.includes("93782"));
  assert.match(TITLE, /2\.1\.269|dictation|Ctrl\+V|VS Code/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "wsl");
  assert.match(HOST, /VS Code|Remote-WSL|integrated terminal/);
  assert.match(WISPR, /Wispr Flow/);
  assert.match(INSERT_PATH, /clipboard|Ctrl\+V/);
  assert.equal(BUILD, "2.1.269");
  assert.equal(GOOD_VERSION, "2.1.268");
  assert.match(INTERSECTION, /2\.1\.269.*VS Code/);
  assert.equal(SURFACE, "vscode-wsl-dictation-paste");
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "area:tui",
    "area:ide",
    "platform:vscode",
    "regression",
    "platform:wsl",
  ]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /screen-reader|accessibilitySupport|#282290/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Trismus|#93823/i.test(row)));
  assert.ok(EXPECTED.some((row) => /must insert|clipboard|Ctrl\+V|2\.1\.268/i.test(row)));
  assert.match(DISTRIBUTION, /Wispr Flow|2\.1\.269|2\.1\.268|Windows Terminal|plain bash|#282290/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("dictation-paste-drop"));
  assert.ok(FINGERPRINT_LINES.includes("anarthria"));
  assert.equal(PHRASE, "Score anarthria or admit articulate.");
  assert.equal(SAMPLE_ANARTHRIA_PROOF.dictationPasteDrop, true);
});

test("has-repro fingerprints encode the published anarthria proof", () => {
  const result = handle(seedAnarthria());
  assert.equal(result.published.platform, "wsl");
  assert.equal(result.published.surface, "vscode-wsl-dictation-paste");
  assert.equal(result.published.wispr, WISPR);
  assert.match(
    fingerprint(seedAnarthria()),
    /anarthria\|clip=heard\|paste=dropped\|term=vscode-wsl\|path=dictation-paste-drop\|cue=dictation-paste-drop/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes trismus/foundling/gleaner and recent catalog words", () => {
  const required = [
    "limber",
    "trismus",
    "notif-xpc-deadlock",
    "filiated",
    "foundling",
    "subagent-bash-outlive",
    "gleaned",
    "orphaned",
    "unreaped-ampersand",
    "gleaner",
    "injective",
    "crased",
    "crasis",
    "store-slug-collide",
    "unitary",
    "tessellated",
    "tessera",
    "version-path-tcc",
    "verbatim",
    "mojibaked",
    "mojibake",
    "fffd-spall",
    "plenary",
    "scisselled",
    "scissel",
    "argv-trunc",
    "vested",
    "unseised",
    "preview-eperm",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "aneroid",
    "simulacrum",
    "solenoid",
    "scotia",
    "canard",
    "stet",
    "blindside",
    "schism",
    "intact",
    "rasured",
    "creation-time-flip",
    "bonded",
    "registered",
    "warded",
    "parented",
    "silted",
    "drained",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("articulate booth flips anarthria back when the paste lands", () => {
  const tape = {
    articulate: true,
    anarthria: false,
    dictationPasteDrop: false,
    cue: "articulate",
  };
  assert.equal(scoreGate(tape).verdict, "articulate");
  tape.articulate = false;
  tape.anarthria = true;
  tape.dictationPasteDrop = true;
  tape.silentDrop = true;
  tape.cue = "anarthria";
  assert.equal(scoreGate(tape).verdict, "anarthria");
  tape.articulate = true;
  tape.anarthria = false;
  tape.dictationPasteDrop = false;
  tape.silentDrop = false;
  tape.cue = "articulate";
  assert.equal(scoreGate(tape).verdict, "articulate");
});

test("clipboard, paste, prompt, and readBooth mark the anarthria proof", () => {
  const idle = inspectClipboard({
    articulate: true,
  });
  assert.equal(idle.stamp, "clipboard-ready");
  const paste = inspectPaste({ anarthria: true, wisprCtrlV: true });
  assert.equal(paste.stamp, "paste-dropped");
  assert.equal(paste.dropped, true);
  const prompt = inspectPrompt({ anarthria: true, silentDrop: true });
  assert.equal(prompt.stamp, "prompt-silent");
  const booth = readBooth({
    anarthria: true,
    dictationPasteDrop: true,
    silentDrop: true,
  });
  assert.equal(booth.anarthria, true);
  assert.equal(booth.mark, "anarthria");
  const open = readBooth({
    articulate: true,
    anarthria: false,
    dictationPasteDrop: false,
  });
  assert.equal(open.anarthria, false);
  assert.equal(open.mark, "articulate");
});

test("mapScope encodes the published mute larynx", () => {
  const miss = mapScope({ anarthria: true, dictationPasteDrop: true });
  assert.equal(miss.stamp, "dictation-paste-drop");
  assert.equal(miss.larynxLane, "mute");
  assert.equal(miss.ribbon, "anarthria");
  const clear = mapScope({ articulate: true, anarthria: false });
  assert.equal(clear.stamp, "articulate-glottis");
  assert.equal(clear.larynxLane, "open");
  assert.equal(clear.promptLane, "receives");
});

test("inspectPrompt encodes the silent prompt path", () => {
  const gap = inspectPrompt({ anarthria: true, silentDrop: true });
  assert.equal(gap.stamp, "prompt-silent");
  assert.equal(gap.silent, true);
  assert.match(gap.text, /silent/i);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 282290);
  assert.equal(COUSINS[0].repo, "microsoft/vscode");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("hysteresis"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[11].issue, 93823);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93782));
  assert.ok(!BACKUPS.some((row) => row.issue === 282290));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/anarthria.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const articulateFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/articulate.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(articulateFix.status, 0, articulateFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const articulateOut = JSON.parse(articulateFix.stdout);
  assert.equal(idleOut.verdict, "articulate");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "anarthria");
  assert.equal(seededOut.alarm, true);
  assert.equal(articulateOut.verdict, "articulate");
  assert.equal(articulateOut.hold, true);
  assert.match(articulateOut.phrase, /admit articulate/);
});

test("handle exposes published hypothesis and #93782 headline", () => {
  const result = handle(seedAnarthria());
  assert.equal(result.published.issue, 93782);
  assert.equal(result.published.platform, "wsl");
  assert.deepEqual(result.published.cousins, [282290]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93967));
  assert.ok(result.published.backups.includes(93823));
  assert.ok(!result.published.backups.includes(93782));
  assert.match(result.published.hypothesis, /xterm\.js|keyboard-input|NON-BINDING|#93782/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93782/);
  assert.equal(result.published.insertPath, INSERT_PATH);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.goodVersion, GOOD_VERSION);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an ENT / laryngology / voice-clinic booth, not lockjaw or foundling", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Karla/);
  assert.match(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.match(page, /anarthria|articulate|dictation-paste-drop|larynx|glottis|laryngoscope|voice-strip/i);
  assert.match(page, /#2A6F6A|#F7F3EB|#1C1A17|#C47A2C|#A84B5B/i);
  assert.match(page, /\barticulate\b/);
  assert.match(page, /\banarthria\b/);
  assert.match(page, /dictation-paste-drop/);
  assert.match(page, /Score anarthria or admit articulate/i);
  assert.match(page, /#282290|cousin/i);
  assert.match(page, /#335/);
  assert.match(page, /#93782/);
  assert.match(page, /Admit articulate/);
  assert.match(page, /Score anarthria/);
  assert.match(page, /Walk dictation-paste-drop/);
  assert.match(page, /Compare articulate \/ anarthria/);
  assert.match(page, /Pin idle articulate/);
  assert.match(page, /Pin seeded anarthria/);
  assert.match(page, /Pin dictation-paste-drop/);
  assert.match(page, /Unmute the larynx/);
  assert.match(page, /Wispr|Ctrl\+V|2\.1\.269|2\.1\.268|Remote-WSL|xterm\.js/i);
  assert.match(page, /larynx|glottis|laryngoscope|voice-strip|scope|phonat/i);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /#F4F1EA/);
  assert.doesNotMatch(page, /#1A1F24/);
  assert.doesNotMatch(page, /#B33A3A/);
  assert.doesNotMatch(page, /#7A858F/);
  assert.doesNotMatch(page, /#C4922A/);
  assert.doesNotMatch(page, /#E8ECE8/);
  assert.doesNotMatch(page, /#F3EDE3/);
  assert.doesNotMatch(page, /#1E1A17/);
  assert.doesNotMatch(page, /#A84B5C/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#3E6B5A/);
  assert.doesNotMatch(page, /#FAF7F1/);
  assert.doesNotMatch(page, /#1A1520/);
  assert.doesNotMatch(page, /#F4ECDF/);
  assert.doesNotMatch(page, /#B83A2E/);
  assert.doesNotMatch(page, /#2F6F5E/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field|gleaner.s field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
  assert.doesNotMatch(page, /planchet|die punch|slag floor/i);
  assert.doesNotMatch(page, /compositor|foul-proof|geta-tofu|type case|rice-paper/i);
  assert.doesNotMatch(page, /privacy pane|limestone|mica grout|tesserae/i);
  assert.doesNotMatch(page, /fused ligature|manuscript crasis|store drawer/i);
  assert.doesNotMatch(page, /cavalry|dispatch-rider|headersHelper|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parchment scrape|rasure|CreationTime/i);
  assert.doesNotMatch(page, /intake board|foundling-home intake/i);
  assert.doesNotMatch(page, /foundling-hospital|parish-ward|foundling wheel|brass name-token/i);
  assert.doesNotMatch(page, /B-H curve|remanence|ferrite charcoal/i);
  assert.doesNotMatch(page, /limber-hole|bilge drain|oak floor timbers/i);
  assert.doesNotMatch(page, /millimeter|woodworking|dovetail|mortise/i);
  assert.doesNotMatch(page, /enamel chair|forceps tray|trigeminal|lockjaw|jaw clamp/i);
  assert.doesNotMatch(page, /swift_addon|addNotificationRequest|UNUserNotification/i);
  assert.doesNotMatch(page, /\blimber\b/);
  assert.doesNotMatch(page, /\btrismus\b/);
  assert.doesNotMatch(page, /notif-xpc-deadlock/);
  assert.doesNotMatch(page, /\bplenary\b/);
  assert.doesNotMatch(page, /\bscisselled\b/);
  assert.doesNotMatch(page, /argv-trunc/);
  assert.doesNotMatch(page, /\bverbatim\b/);
  assert.doesNotMatch(page, /\bmojibaked\b/);
  assert.doesNotMatch(page, /fffd-spall/);
  assert.doesNotMatch(page, /\bsingular\b/);
  assert.doesNotMatch(page, /\bapographed\b/);
  assert.doesNotMatch(page, /reopen-fork/);
  assert.doesNotMatch(page, /\bequalized\b/);
  assert.doesNotMatch(page, /\bblown\b/);
  assert.doesNotMatch(page, /socat-race/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd/);
  assert.doesNotMatch(page, /\bvested\b/);
  assert.doesNotMatch(page, /\bunseised\b/);
  assert.doesNotMatch(page, /preview-eperm/);
  assert.doesNotMatch(page, /\bunitary\b/);
  assert.doesNotMatch(page, /\btessellated\b/);
  assert.doesNotMatch(page, /version-path-tcc/);
  assert.doesNotMatch(page, /\binjective\b/);
  assert.doesNotMatch(page, /\bcrased\b/);
  assert.doesNotMatch(page, /store-slug-collide/);
  assert.doesNotMatch(page, /\bgleaned\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /unreaped-ampersand/);
  assert.doesNotMatch(page, /\bfiliated\b/);
  assert.doesNotMatch(page, /\bfoundling\b/);
  assert.doesNotMatch(page, /subagent-bash-outlive/);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Deadkey/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Anarthria/);
  assert.match(readme, /#93782/);
  assert.match(readme, /\barticulate\b/);
  assert.match(readme, /\banarthria\b/);
  assert.match(readme, /dictation-paste-drop/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Karla/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Trismus/i);
  assert.match(readme, /NOT Foundling/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /Wispr|Ctrl\+V|2\.1\.269|2\.1\.268|Remote-WSL/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/anarthria/);
  assert.match(readme, /node --test projects\/anarthria\/anarthria\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /larynx|glottis|laryngoscope|voice-strip|ENT/i);
  assert.match(readme, /Score anarthria or admit articulate/);
  assert.match(readme, /#282290/);
  assert.match(readme, /#93772|#93770|#93777|#93821|#93811|#93809|#93924|#93925|#93954|#93967|#93957|#93823/);
  assert.match(readme, /18:50/);
  assert.match(readme, /Do NOT implement a fix/i);
});

test("catalog features Anarthria only; Trismus unfeatured; product count 335", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 335);
  assert.equal(hub.products.length, 335);
  assert.equal(catalog.products[0].name, "Anarthria");
  assert.equal(catalog.products[0].slug, "anarthria");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/anarthria/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /18:50 anarthria|#93782|voice-clinic|articulate|dictation-paste-drop/i);
  assert.match(catalog.products[0].summary, /\barticulate\b/);
  assert.match(catalog.products[0].summary, /\banarthria\b/);
  assert.match(catalog.products[0].summary, /dictation-paste-drop/);
  assert.match(catalog.products[0].summary, /Score anarthria or admit articulate/);
  assert.equal(hub.products[0].slug, "anarthria");
  assert.equal(hub.products[0].featured, true);
  const trismus = catalog.products.find((row) => row.slug === "trismus");
  assert.ok(trismus);
  assert.equal(trismus.featured, false);
  const foundling = catalog.products.find((row) => row.slug === "foundling");
  assert.ok(foundling);
  assert.equal(foundling.featured, false);
  const crasis = catalog.products.find((row) => row.slug === "crasis");
  assert.ok(crasis);
  assert.equal(crasis.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "anarthria").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93782") && row.slug !== "anarthria"));
});

test("vercel rewrites anarthria to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/anarthria");
  assert.equal(vercel.rewrites[0].destination, "/projects/anarthria");
  assert.equal(vercel.rewrites[1].source, "/anarthria/");
  assert.equal(vercel.rewrites[1].destination, "/projects/anarthria");
  assert.equal(vercel.rewrites[2].source, "/anarthria/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/anarthria/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
