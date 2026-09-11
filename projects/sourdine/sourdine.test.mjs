import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BLOCK_KIND,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  DISPLAY_LABEL,
  ENV_FLAG,
  FEATURED_ISSUE,
  FEEDBACK_ID,
  FILED,
  FINGERPRINT_LINES,
  FIRST_BROKEN_AT,
  FIRST_TEXT,
  FIRST_TEXT_AT,
  FINAL_TEXT_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HALL_STATIONS,
  HOLD,
  HOOK_URL,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_WORKING_VERSION,
  MODEL,
  NARRATION_ROWS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  SEEDED_WORD,
  SESSION_KIND,
  SHELL,
  SOURDINE_WALK,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAttack,
  inspectCadence,
  inspectHall,
  inspectMute,
  inspectPhrase,
  readHall,
  score,
  scoreGate,
  scoreWalk,
  seedBlockKind,
  seedEnvNoEffect,
  seedFinalFires,
  seedFirstFires,
  seedHold,
  seedHookSilent,
  seedHttpHook,
  seedMidNarration,
  seedMidSummarized,
  seedMultiStep,
  seedMuted,
  seedNarration,
  seedRedactionMiss,
  seedSourdine,
  seedSummarized,
  seedTrivialNoRepro,
  seedTtsSilent,
  seedVoiced,
} from "./sourdine.mjs";

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
  return fileURLToPath(new URL("./sourdine.mjs", import.meta.url));
}

test("idle voiced is a hold; MessageDisplay fires for opening text + final answer", () => {
  const result = analyze(seedVoiced());
  assert.equal(result.verdict, "voiced");
  assert.equal(result.idleWord, "voiced");
  assert.equal(IDLE_WORD, "voiced");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.voiced, true);
  assert.equal(result.phrase, "admit voiced");
  assert.equal(result.muted, false);
  assert.equal(result.midNarration, false);
  assert.equal(result.firstFired, true);
  assert.equal(result.finalFired, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify voiced", () => {
  assert.equal(classify(emptyTicket()), "voiced");
  assert.equal(classify(""), "voiced");
  assert.equal(classify(null), "voiced");
  assert.equal(decide({}), "voiced");
});

test("#93531 seeded path scores muted when narration blocks skip MessageDisplay", () => {
  const result = analyze(seedMuted());
  assert.equal(result.verdict, "muted");
  assert.equal(result.seededWord, "muted");
  assert.equal(SEEDED_WORD, "muted");
  assert.equal(PRODUCT_WORD, "sourdine");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.muted, true);
  assert.equal(result.phrase, "score sourdine");
  assert.equal(result.firstFired, true);
  assert.equal(result.finalFired, true);
  assert.equal(result.hookSilent, true);
  assert.equal(result.narrationShown, true);
  assert.equal(result.blockKindNarration, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("first+final voiced plus mid-phrase mute is the #93531 sourdine", () => {
  const attack = inspectAttack({
    voiced: true,
    firstFired: true,
  });
  assert.equal(attack.stamp, "voiced");
  assert.equal(attack.fired, true);
  const scored = scoreGate({
    muted: true,
    firstFired: true,
    finalFired: true,
    hookSilent: true,
    narrationShown: true,
    blockKindNarration: true,
    cue: "muted",
  });
  assert.equal(scored.verdict, "muted");
  assert.equal(scored.midNarration, true);
  const calm = inspectMute({ voiced: true });
  assert.equal(calm.stamp, "open");
});

test("path word is mid-narration; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "mid-narration");
  const result = analyze(seedMidNarration());
  assert.equal(result.verdict, "mid-narration");
  assert.equal(result.pathWord, "mid-narration");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "mid-narration", preferSeed: true, muted: true }),
    "mid-narration",
  );
  assert.equal(classify(seedHookSilent()), "hook-silent");
});

test("HOLD includes voiced / hold", () => {
  assert.ok(HOLD.includes("voiced"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: mid-summarized, hook-silent, narration, env-no-effect, mid-narration", () => {
  assert.equal(classify(seedFirstFires()), "first-fires");
  assert.equal(classify(seedMidSummarized()), "mid-summarized");
  assert.equal(classify(seedHookSilent()), "hook-silent");
  assert.equal(classify(seedFinalFires()), "final-fires");
  assert.equal(classify(seedNarration()), "narration");
  assert.equal(classify(seedSummarized()), "summarized");
  assert.equal(classify(seedBlockKind()), "block-kind");
  assert.equal(classify(seedTtsSilent()), "tts-silent");
  assert.equal(classify(seedRedactionMiss()), "redaction-miss");
  assert.equal(classify(seedEnvNoEffect()), "env-no-effect");
  assert.equal(classify(seedTrivialNoRepro()), "trivial-no-repro");
  assert.equal(classify(seedMultiStep()), "multi-step");
  assert.equal(classify(seedHttpHook()), "http-hook");
  assert.equal(classify(seedSourdine()), "sourdine");
});

test("booth fixtures flip voiced vs muted vs mid-narration vs sourdine", () => {
  const idle = scoreGate(seedVoiced());
  const seeded = scoreGate(readData("muted.json"));
  const voiced = readData("voiced.json");
  const muted = readData("muted.json");
  const path = readData("mid-narration.json");
  const product = readData("sourdine.json");
  assert.equal(idle.verdict, "voiced");
  assert.equal(seeded.verdict, "muted");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedVoiced()), "voiced");
  assert.equal(score(readData("muted.json")), "muted");
  assert.equal(voiced.firstFired, true);
  assert.equal(voiced.voiced, true);
  assert.equal(scoreGate(voiced).verdict, "voiced");
  assert.equal(muted.hookSilent, true);
  assert.equal(muted.narrationShown, true);
  assert.equal(muted.blockKindNarration, true);
  assert.equal(classify(muted), "muted");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /first message/);
  assert.match(path.paths[2].result, /cadence/);
  assert.equal(classify(path), "mid-narration");
  assert.equal(classify(product), "sourdine");
  assert.equal(product.hubCount, "SOURDINE");
  assert.equal(muted.issue, 93531);
  assert.equal(muted.muted, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("voiced"));
  assert.ok(CHIPS.includes("muted"));
  assert.ok(CHIPS.includes("sourdine"));
  assert.ok(CHIPS.includes("mid-narration"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("muted"));
  assert.ok(ALARM.includes("mid-narration"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published sourdine walk scores muted after the idle hold", () => {
  const hall = scoreWalk({ rows: SOURDINE_WALK });
  assert.equal(hall.verdict, "muted");
  assert.ok(hall.mutedCount >= 1);
  const idle = hall.rows.find((row) => row.event === "cue-voiced");
  assert.equal(idle.voiced, true);
  assert.equal(idle.verdict, "voiced");
  const first = hall.rows.find((row) => row.event === "first-fires");
  assert.equal(first.firstFired, true);
  const mid = hall.rows.find((row) => row.event === "mid-summarized");
  assert.equal(mid.muted, true);
  const silent = hall.rows.find((row) => row.event === "hook-silent");
  assert.equal(silent.hookSilent, true);
  const final = hall.rows.find((row) => row.event === "final-fires");
  assert.equal(final.finalFired, true);
  const path = hall.rows.find((row) => row.event === "mid-narration");
  assert.equal(path.verdict, "mid-narration");
});

test("SOURDINE_WALK constant matches the issue hall walk", () => {
  assert.equal(SOURDINE_WALK[0].event, "cue-voiced");
  const first = SOURDINE_WALK.find((row) => row.event === "first-fires");
  assert.equal(first.firstFired, true);
  const path = SOURDINE_WALK.find((row) => row.event === "mid-narration");
  assert.equal(path.muted, true);
  const scoreRow = SOURDINE_WALK.find((row) => row.event === "sourdine");
  assert.equal(scoreRow.muted, true);
});

test("positive control first+final stays voiced", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "voiced");
  const first = walk.rows.find((row) => row.event === "first-fires");
  assert.equal(first.verdict, "voiced");
  const final = walk.rows.find((row) => row.event === "final-fires");
  assert.equal(final.finalFired, true);
  assert.equal(final.verdict, "voiced");
});

test("issue constants encode only #93531 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93531);
  assert.ok(ISSUE_URL.includes("93531"));
  assert.match(TITLE, /MessageDisplay no longer fires for text between tool calls/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("platform:vscode"));
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("regression"));
  assert.equal(AUTHOR, "Liv3wir3d");
  assert.equal(FILED, "2026-09-11T03:51:12Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.267");
  assert.equal(LAST_WORKING_VERSION, "2.1.266");
  assert.equal(OS, "Windows");
  assert.equal(CLIENT, "Claude Code VS Code extension");
  assert.equal(SHELL, "VS Code integrated terminal");
  assert.equal(MODEL, "Opus (claude-opus-5)");
  assert.equal(PLATFORM, "Anthropic API");
  assert.equal(
    SESSION_KIND,
    "VS Code extension; http MessageDisplay hook; multi-step turn with prose between tool calls",
  );
  assert.equal(FEEDBACK_ID, "043a59d5-4228-4590-a7cc-c6903546840f");
  assert.equal(FIRST_BROKEN_AT, "2026-09-10 22:49 UTC");
  assert.equal(HOOK_URL, "http://localhost:8765/hooks/message");
  assert.equal(ENV_FLAG, "CLAUDE_CODE_ENABLE_NARRATION=0");
  assert.equal(BLOCK_KIND, "narration");
  assert.equal(DISPLAY_LABEL, "(summarized)");
  assert.equal(FIRST_TEXT_AT, "03:14:03");
  assert.equal(FIRST_TEXT, "I'll start by locating the folder…");
  assert.equal(FINAL_TEXT_AT, "03:14:35");
  assert.equal(NARRATION_ROWS.length, 4);
  assert.equal(HALL_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("mid-narration"));
  assert.ok(FINGERPRINT_LINES.includes("muted"));
  assert.match(PHRASE, /score sourdine or admit voiced/);
});

test("has-repro fingerprints encode the published narration mute", () => {
  const result = handle(readData("muted.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "Liv3wir3d");
  assert.equal(
    result.published.sessionKind,
    "VS Code extension; http MessageDisplay hook; multi-step turn with prose between tool calls",
  );
  assert.equal(result.published.blockKind, "narration");
  assert.match(
    fingerprint(seedMuted()),
    /muted\|attack=voiced\|phrase=muted\|cadence=voiced\|hall=on-stage\|mute=in\|path=mid-narration\|cue=muted/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Forksink and Foxfire", () => {
  const required = [
    "lodged",
    "dropped",
    "forksink",
    "source-fork",
    "kindled",
    "painted",
    "foxfire",
    "never-turns",
    "flushed",
    "lagged",
    "one-behind",
    "pentimento",
    "solitary",
    "twinlinked",
    "bridge-refuse",
    "vinculum",
    "hit",
    "flattened",
    "string-carrier",
    "cachet",
    "steady",
    "strobing",
    "off-label",
    "strobe",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("voiced stand flips muted back when the hook hears the mid-phrase", () => {
  const tape = {
    voiced: true,
    muted: false,
    firstFired: true,
    finalFired: true,
    hookSilent: false,
    narrationShown: false,
    cue: "voiced",
  };
  assert.equal(scoreGate(tape).verdict, "voiced");
  tape.voiced = false;
  tape.muted = true;
  tape.hookSilent = true;
  tape.narrationShown = true;
  tape.blockKindNarration = true;
  tape.cue = "muted";
  assert.equal(scoreGate(tape).verdict, "muted");
  tape.voiced = true;
  tape.muted = false;
  tape.hookSilent = false;
  tape.narrationShown = false;
  tape.blockKindNarration = false;
  tape.cue = "voiced";
  assert.equal(scoreGate(tape).verdict, "voiced");
});

test("attack, phrase, cadence, hall, mute, and readHall mark muted after narration", () => {
  const idle = inspectAttack({ voiced: true, firstFired: true });
  assert.equal(idle.stamp, "voiced");
  assert.equal(idle.fired, true);
  const phrase = inspectPhrase({
    muted: true,
    hookSilent: true,
    narrationShown: true,
  });
  assert.equal(phrase.stamp, "muted");
  assert.equal(phrase.muted, true);
  const cadence = inspectCadence({
    muted: true,
    finalFired: true,
  });
  assert.equal(cadence.stamp, "voiced");
  const hall = inspectHall({
    muted: true,
    narrationShown: true,
    blockKindNarration: true,
  });
  assert.equal(hall.stamp, "on-stage");
  assert.equal(hall.heard, true);
  const mute = inspectMute({
    muted: true,
    hookSilent: true,
    ttsSilent: true,
  });
  assert.equal(mute.stamp, "muted");
  assert.equal(mute.engaged, true);
  const basin = readHall({
    muted: true,
    hookSilent: true,
    narrationShown: true,
    blockKindNarration: true,
  });
  assert.equal(basin.muted, true);
  assert.equal(basin.mark, "muted");
  const calm = readHall({
    voiced: true,
    muted: false,
    firstFired: true,
    finalFired: true,
  });
  assert.equal(calm.muted, false);
  assert.equal(calm.mark, "voiced");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 88646);
  assert.equal(COUSINS[1].issue, 82001);
  assert.equal(COUSINS[2].issue, 85773);
  assert.equal(COUSINS[3].issue, 88338);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("strobe"));
  assert.ok(NOT_PRODUCTS.includes("sump"));
  assert.ok(NOT_PRODUCTS.includes("spillway"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93475);
  assert.equal(BACKUPS[1].issue, 93439);
  assert.equal(BACKUPS[2].issue, 93438);
  assert.equal(BACKUPS[3].issue, 93466);
  assert.equal(BACKUPS[4].issue, 93495);
  assert.equal(BACKUPS[5].issue, 93529);
  assert.equal(BACKUPS[6].issue, 93508);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/muted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "voiced");
  assert.equal(JSON.parse(seeded.stdout).verdict, "muted");
});

test("handle exposes published hypothesis and #93531 headline", () => {
  const result = handle(readData("muted.json"));
  assert.equal(result.published.issue, 93531);
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "Liv3wir3d");
  assert.deepEqual(result.published.cousins, [88646, 82001, 85773, 88338]);
  assert.ok(result.published.backups.includes(93475));
  assert.ok(result.published.backups.includes(93529));
  assert.ok(result.published.backups.includes(93508));
  assert.match(result.published.hypothesis, /bypass the MessageDisplay hook pipeline/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a concert-hall practice-mute booth, not a storm-drain or marsh lantern", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond/);
  assert.match(page, /Outfit/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /sourdine|practice mute|brass mute|velvet|stage lamp/i);
  assert.match(page, /#1a1218|#C9A227|#F2C14E|#6B2D3C|#EDE6D9|#120e12/i);
  assert.match(page, /\bvoiced\b/);
  assert.match(page, /muted/);
  assert.match(page, /mid-narration/);
  assert.match(page, /score sourdine or admit voiced/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /13:50/);
  assert.match(page, /#285/);
  assert.match(page, /#93531/);
  assert.match(page, /Liv3wir3d/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /MessageDisplay/);
  assert.match(page, /block_kind/);
  assert.match(page, /narration/);
  assert.match(page, /Seat the hall/);
  assert.match(page, /Score sourdine/);
  assert.match(page, /Sound the mute/);
  assert.match(page, /Compare hall \/ hook/);
  assert.match(page, /Pin idle voiced/);
  assert.match(page, /Pin seeded muted/);
  assert.match(page, /Pin mid-narration/);
  assert.match(page, /Clear the stand/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Eczar/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /#12151a/);
  assert.doesNotMatch(page, /#FFB020/);
  assert.doesNotMatch(page, /#3ECFBF/);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines/i);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bdropped\b/);
  assert.doesNotMatch(page, /\bsource-fork\b/);
  assert.doesNotMatch(page, /\bkindled\b/);
  assert.doesNotMatch(page, /\bpainted\b/);
  assert.doesNotMatch(page, /\bnever-turns\b/);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Foxfire/i);
  assert.match(page, /NOT Pentimento/i);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT Strobe/i);
  assert.match(page, /NOT Sump/i);
  assert.match(page, /NOT Spillway/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Sourdine/);
  assert.match(readme, /#93531/);
  assert.match(readme, /\bvoiced\b/);
  assert.match(readme, /muted/);
  assert.match(readme, /mid-narration/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Forksink/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /NOT Pentimento/i);
  assert.match(readme, /NOT Vinculum/i);
  assert.match(readme, /NOT Cachet/i);
  assert.match(readme, /2\.1\.267/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/sourdine/);
  assert.match(readme, /node --test projects\/sourdine\/sourdine\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /practice-mute|brass mute|velvet|concert-hall/i);
  assert.match(readme, /#88646/);
  assert.match(readme, /#82001/);
  assert.match(readme, /#85773/);
  assert.match(readme, /#88338/);
  assert.match(readme, /MessageDisplay/);
  assert.match(readme, /narration/);
});

test("catalog features Sourdine only; Forksink unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 285);
  assert.equal(hub.products.length, 285);
  assert.equal(catalog.products[0].name, "Sourdine");
  assert.equal(catalog.products[0].slug, "sourdine");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/sourdine/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /13:50/);
  assert.match(catalog.products[0].summary, /sourdine/);
  assert.match(catalog.products[0].summary, /#93531/);
  assert.match(catalog.products[0].summary, /\bvoiced\b/);
  assert.match(catalog.products[0].summary, /muted/);
  assert.match(catalog.products[0].summary, /mid-narration/);
  assert.equal(hub.products[0].slug, "sourdine");
  assert.equal(hub.products[0].featured, true);
  const forksink = catalog.products.find((row) => row.slug === "forksink");
  assert.ok(forksink);
  assert.equal(forksink.featured, false);
  const foxfire = catalog.products.find((row) => row.slug === "foxfire");
  assert.ok(foxfire);
  assert.equal(foxfire.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "sourdine").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93531") && row.slug !== "sourdine"));
});

test("vercel rewrites sourdine to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/sourdine");
  assert.equal(vercel.rewrites[0].destination, "/projects/sourdine");
  assert.equal(vercel.rewrites[1].source, "/sourdine/");
  assert.equal(vercel.rewrites[1].destination, "/projects/sourdine");
  assert.equal(vercel.rewrites[2].source, "/sourdine/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/sourdine/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
