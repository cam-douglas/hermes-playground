import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARCH,
  AUTHOR,
  BACKUPS,
  BENCH_STATIONS,
  BUNDLED_ALSO,
  BUNDLED_CODE,
  CACHE_PATH,
  CHANNEL_DIFF,
  CHIPS,
  CLI_INJECT,
  CLI_VERSION,
  COMPANION,
  COUSINS,
  DESKTOP_APP,
  DESKTOP_BUILT,
  DESKTOP_INJECT,
  ENTRYPOINT_CLI,
  ENTRYPOINT_DESKTOP,
  ENTRYPOINT_TABLE,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GETBBOX,
  HOLD,
  IDLE_WORD,
  IMAGE_HEIGHT,
  IMAGE_SIZE,
  IMAGE_WIDTH,
  ISSUE_URL,
  LABELS,
  LUCIDA_WALK,
  NOT_PRODUCTS,
  OS,
  OS_VERSION,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  SEEDED_WORD,
  SESSIONS,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCompanion,
  inspectEntrypoint,
  inspectImageCache,
  readPlate,
  score,
  scoreGate,
  scoreWalk,
  seedBytesIdentical,
  seedCliInject,
  seedCompanionMissing,
  seedContentBlock,
  seedDesktopOmit,
  seedHold,
  seedImageCache,
  seedLucida,
  seedNoCacheDir,
  seedPastedContents,
  seedPathless,
  seedTraced,
  seedTurnCompanion,
} from "./lucida.mjs";

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
  return fileURLToPath(new URL("./lucida.mjs", import.meta.url));
}

test("idle traced is a hold; CLI writes cache and injects companion", () => {
  const result = analyze(seedTraced());
  assert.equal(result.verdict, "traced");
  assert.equal(result.idleWord, "traced");
  assert.equal(IDLE_WORD, "traced");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.traced, true);
  assert.equal(result.phrase, "admit traced");
  assert.equal(result.cacheWritten, true);
  assert.equal(result.companionInjected, true);
  assert.equal(result.desktopOmit, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify traced", () => {
  assert.equal(classify(emptyTicket()), "traced");
  assert.equal(classify(""), "traced");
  assert.equal(classify(null), "traced");
  assert.equal(decide({}), "traced");
});

test("#93429 seeded path scores pathless when desktop omits companion and cache", () => {
  const result = analyze(seedPathless());
  assert.equal(result.verdict, "pathless");
  assert.equal(result.seededWord, "pathless");
  assert.equal(SEEDED_WORD, "pathless");
  assert.equal(PRODUCT_WORD, "lucida");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.pathless, true);
  assert.equal(result.phrase, "score lucida");
  assert.equal(result.desktopOmit, true);
  assert.equal(result.noCacheDir, true);
  assert.equal(result.companionOmitted, true);
  assert.equal(result.desktopInject, "0/4");
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("companion omitted plus no cache dir is the #93429 lucida", () => {
  const companion = inspectCompanion({
    companionOmitted: true,
    companionInjected: false,
  });
  assert.equal(companion.stamp, "pathless");
  assert.equal(companion.omitted, true);
  const scored = scoreGate({
    pathless: true,
    desktopOmit: true,
    companionOmitted: true,
    noCacheDir: true,
    desktopInject: "0/4",
    cue: "pathless",
  });
  assert.equal(scored.verdict, "pathless");
  assert.equal(scored.desktopOmit, true);
  const calm = inspectCompanion({ traced: true, companionInjected: true });
  assert.equal(calm.stamp, "traced");
});

test("path word is image-cache; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "image-cache");
  const result = analyze(seedImageCache());
  assert.equal(result.verdict, "image-cache");
  assert.equal(result.pathWord, "image-cache");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "image-cache", preferSeed: true, pathless: true }),
    "image-cache",
  );
  assert.equal(classify(seedNoCacheDir()), "no-cache-dir");
});

test("HOLD includes traced / hold", () => {
  assert.ok(HOLD.includes("traced"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: desktop-omit, companion-missing, no-cache-dir, content-block, bytes-identical", () => {
  assert.equal(classify(seedDesktopOmit()), "desktop-omit");
  assert.equal(classify(seedCompanionMissing()), "companion-missing");
  assert.equal(classify(seedNoCacheDir()), "no-cache-dir");
  assert.equal(classify(seedContentBlock()), "content-block");
  assert.equal(classify(seedBytesIdentical()), "bytes-identical");
  assert.equal(classify(seedLucida()), "lucida");
  assert.equal(classify(seedCliInject()), "cli-inject");
  assert.equal(classify(seedPastedContents()), "pasted-contents");
  assert.equal(classify(seedTurnCompanion()), "turn-companion");
});

test("bench fixtures flip traced vs pathless vs image-cache", () => {
  const idle = scoreGate(seedTraced());
  const seeded = scoreGate(readData("pathless.json"));
  const traced = readData("traced.json");
  const pathless = readData("pathless.json");
  const cache = readData("image-cache.json");
  const product = readData("lucida.json");
  const cousins = readData("cousins.json");
  const backups = readData("backups.json");
  assert.equal(idle.verdict, "traced");
  assert.equal(seeded.verdict, "pathless");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedTraced()), "traced");
  assert.equal(score(readData("pathless.json")), "pathless");
  assert.equal(traced.cacheWritten, true);
  assert.equal(traced.companionInjected, true);
  assert.equal(scoreGate(traced).verdict, "traced");
  assert.equal(pathless.desktopInject, "0/4");
  assert.equal(pathless.cliInjectCount, "4/4");
  assert.equal(pathless.noCacheDir, true);
  assert.equal(pathless.companionOmitted, true);
  assert.equal(classify(pathless), "pathless");
  assert.equal(cache.paths.length, 3);
  assert.equal(cache.paths[0].result, "written on cli 4/4");
  assert.equal(cache.paths[1].result, "absent on claude-desktop 0/4");
  assert.equal(classify(cache), "image-cache");
  assert.equal(classify(product), "lucida");
  assert.equal(classify(cousins), "cousins");
  assert.equal(classify(backups), "backups");
  assert.equal(pathless.issue, 93429);
  assert.equal(pathless.imageSize, "852x525");
  assert.equal(pathless.getbbox, "None");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("traced"));
  assert.ok(CHIPS.includes("pathless"));
  assert.ok(CHIPS.includes("lucida"));
  assert.ok(CHIPS.includes("image-cache"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("pathless"));
  assert.ok(ALARM.includes("image-cache"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published lucida walk scores pathless after the idle hold", () => {
  const desk = scoreWalk({ rows: LUCIDA_WALK });
  assert.equal(desk.verdict, "pathless");
  assert.ok(desk.pathlessCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-traced");
  assert.equal(idle.traced, true);
  assert.equal(idle.verdict, "traced");
  const cli = desk.rows.find((row) => row.event === "paste-cli");
  assert.equal(cli.entrypoint, "cli");
  const cache = desk.rows.find((row) => row.event === "write-cache");
  assert.equal(cache.cacheWritten, true);
  const companion = desk.rows.find((row) => row.event === "inject-companion");
  assert.equal(companion.turnCompanion, true);
  const desktop = desk.rows.find((row) => row.event === "paste-desktop");
  assert.equal(desktop.entrypoint, "claude-desktop");
  const branch = desk.rows.find((row) => row.event === "content-block");
  assert.equal(branch.contentBlock, true);
  const omit = desk.rows.find((row) => row.event === "omit-companion");
  assert.equal(omit.companionOmitted, true);
  const drawer = desk.rows.find((row) => row.event === "no-cache-dir");
  assert.equal(drawer.noCacheDir, true);
  const pixels = desk.rows.find((row) => row.event === "bytes-identical");
  assert.equal(pixels.imageSize, "852x525");
  const stain = desk.rows.find((row) => row.event === "pathless");
  assert.equal(stain.pathless, true);
  const path = desk.rows.find((row) => row.event === "image-cache");
  assert.equal(path.verdict, "image-cache");
});

test("LUCIDA_WALK constant matches the issue plate walk", () => {
  assert.equal(LUCIDA_WALK[0].event, "cue-traced");
  const omit = LUCIDA_WALK.find((row) => row.event === "omit-companion");
  assert.equal(omit.desktopOmit, true);
  const stain = LUCIDA_WALK.find((row) => row.event === "pathless");
  assert.equal(stain.desktopInject, "0/4");
  assert.equal(stain.cliInjectCount, "4/4");
  const path = LUCIDA_WALK.find((row) => row.event === "image-cache");
  assert.equal(path.pathless, true);
  const scoreRow = LUCIDA_WALK.find((row) => row.event === "lucida");
  assert.equal(scoreRow.pathless, true);
});

test("issue constants encode only #93429 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93429);
  assert.ok(ISSUE_URL.includes("93429"));
  assert.match(TITLE, /Desktop app \(Code tab\) drops the image source path/);
  assert.match(TITLE, /image-cache/);
  assert.match(TITLE, /\[Image: source: <path>\]/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(AUTHOR, "Lumidew");
  assert.equal(FILED, "2026-09-10T17:53:26Z");
  assert.equal(DESKTOP_APP, "1.49585.0");
  assert.equal(DESKTOP_BUILT, "2026-09-08");
  assert.equal(BUNDLED_CODE, "2.1.260");
  assert.equal(BUNDLED_ALSO, "2.1.258");
  assert.equal(CLI_VERSION, "2.1.266");
  assert.equal(OS, "macOS");
  assert.equal(OS_VERSION, "15.3.2");
  assert.equal(ARCH, "arm64");
  assert.equal(CACHE_PATH, "~/.claude/image-cache/<session-id>/N.png");
  assert.equal(COMPANION, "[Image: source: <path>]");
  assert.equal(ENTRYPOINT_CLI, "cli");
  assert.equal(ENTRYPOINT_DESKTOP, "claude-desktop");
  assert.equal(CLI_INJECT, "4/4");
  assert.equal(DESKTOP_INJECT, "0/4");
  assert.equal(SESSIONS, 8);
  assert.equal(IMAGE_WIDTH, 852);
  assert.equal(IMAGE_HEIGHT, 525);
  assert.equal(IMAGE_SIZE, "852x525");
  assert.equal(GETBBOX, "None");
  assert.equal(CHANNEL_DIFF, 0);
  assert.equal(ENTRYPOINT_TABLE.length, 2);
  assert.equal(ENTRYPOINT_TABLE[0].injected, "4/4");
  assert.equal(ENTRYPOINT_TABLE[1].injected, "0/4");
  assert.equal(BENCH_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("desktop-omit"));
  assert.ok(FINGERPRINT_LINES.includes("no-cache-dir"));
  assert.match(PHRASE, /score lucida or admit traced/);
});

test("has-repro fingerprints encode the published cli vs desktop window", () => {
  const result = handle(readData("pathless.json"));
  assert.equal(result.published.cliVersion, "2.1.266");
  assert.equal(result.published.author, "Lumidew");
  assert.equal(result.published.os, "macOS");
  assert.equal(result.published.osVersion, "15.3.2");
  assert.equal(result.published.cliInject, "4/4");
  assert.equal(result.published.desktopInject, "0/4");
  assert.equal(result.published.imageSize, "852x525");
  assert.equal(result.published.getbbox, "None");
  assert.match(
    fingerprint(seedPathless()),
    /pathless\|cache=missing\|companion=omitted\|entry=claude-desktop\|pixels=852x525\|cue=pathless/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Fomite and Afterimage", () => {
  const required = [
    "scrubbed",
    "contaminated",
    "fomite",
    "gitignore",
    "mounted",
    "fossed",
    "plan9",
    "fosse",
    "warm",
    "paged-out",
    "majflt",
    "hibernacle",
    "damped",
    "spinning",
    "mux",
    "snubber",
    "afterimage",
    "latent",
    "flushed",
    "diplopia",
    "diopter",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("traced plate flips pathless back when CLI writes cache and companion", () => {
  const tape = {
    traced: true,
    cacheWritten: true,
    companionInjected: true,
    pathless: false,
    cue: "traced",
  };
  assert.equal(scoreGate(tape).verdict, "traced");
  tape.traced = false;
  tape.pathless = true;
  tape.desktopOmit = true;
  tape.noCacheDir = true;
  tape.cue = "pathless";
  assert.equal(scoreGate(tape).verdict, "pathless");
  tape.traced = true;
  tape.pathless = false;
  tape.desktopOmit = false;
  tape.noCacheDir = false;
  tape.cacheWritten = true;
  tape.companionInjected = true;
  tape.cue = "traced";
  assert.equal(scoreGate(tape).verdict, "traced");
});

test("companion, cache, entrypoint, and plate mark lucida after desktop omit", () => {
  const idle = inspectCompanion({ companionInjected: true, traced: true });
  assert.equal(idle.stamp, "traced");
  const omit = inspectCompanion({
    companionOmitted: true,
    desktopOmit: true,
  });
  assert.equal(omit.stamp, "pathless");
  assert.equal(omit.omitted, true);
  const cache = inspectImageCache({
    noCacheDir: true,
    cacheWritten: false,
  });
  assert.equal(cache.stamp, "pathless");
  assert.equal(cache.missing, true);
  const entry = inspectEntrypoint({
    entrypoint: "claude-desktop",
    desktop: true,
  });
  assert.equal(entry.stamp, "pathless");
  assert.equal(entry.desktopInject, "0/4");
  const desk = readPlate({
    pathless: true,
    desktopOmit: true,
    noCacheDir: true,
  });
  assert.equal(desk.pathless, true);
  assert.equal(desk.mark, "pathless");
  const calm = readPlate({
    traced: true,
    cacheWritten: true,
    companionInjected: true,
    pathless: false,
  });
  assert.equal(calm.pathless, false);
  assert.equal(calm.mark, "traced");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 84251);
  assert.equal(COUSINS[1].issue, 89223);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("diopter"));
  assert.ok(NOT_PRODUCTS.includes("fomite"));
  assert.ok(NOT_PRODUCTS.includes("snubber"));
  assert.ok(NOT_PRODUCTS.includes("fosse"));
  assert.ok(NOT_PRODUCTS.includes("hibernacle"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("ward"));
  assert.ok(NOT_PRODUCTS.includes("latchkey"));
  assert.ok(NOT_PRODUCTS.includes("bitting"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93446);
  assert.equal(BACKUPS[1].issue, 93445);
  assert.equal(BACKUPS[2].issue, 93403);
  assert.equal(BACKUPS[3].issue, 93405);
  assert.equal(BACKUPS[4].issue, 93402);
  assert.equal(BACKUPS[5].issue, 93426);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/pathless.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "traced");
  assert.equal(JSON.parse(seeded.stdout).verdict, "pathless");
});

test("handle exposes published hypothesis and #93429 headline", () => {
  const result = handle(readData("pathless.json"));
  assert.equal(result.published.issue, 93429);
  assert.equal(result.published.cliVersion, "2.1.266");
  assert.equal(result.published.author, "Lumidew");
  assert.equal(result.published.osVersion, "15.3.2");
  assert.deepEqual(result.published.cousins, [84251, 89223]);
  assert.ok(result.published.backups.includes(93446));
  assert.ok(result.published.backups.includes(93445));
  assert.ok(result.published.backups.includes(93403));
  assert.match(result.published.hypothesis, /content-block branch/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a camera-lucida atelier, not afterimage CRT or diplopia acuity", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /lucida|camera-lucida|atelier|prism|tracing paper|drafting plate/i);
  assert.match(page, /#f7f0e4|#8b5a2b|#5c4d8a|#3d7a86|#9b2e2e/);
  assert.match(page, /traced/);
  assert.match(page, /pathless/);
  assert.match(page, /image-cache/);
  assert.match(page, /score lucida or admit traced/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /05:50/);
  assert.match(page, /#277/);
  assert.match(page, /#93429/);
  assert.match(page, /Lumidew/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /2\.1\.266/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /852x525/);
  assert.match(page, /0\/4/);
  assert.match(page, /4\/4/);
  assert.match(page, /Trace the plate/);
  assert.match(page, /Score lucida/);
  assert.match(page, /Lift the tissue/);
  assert.match(page, /Audit the cache/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /#f3f7f6/);
  assert.doesNotMatch(page, /#0d7377/);
  assert.doesNotMatch(page, /#c99212/);
  assert.doesNotMatch(page, /#b42318/);
  assert.doesNotMatch(page, /#2ec4ce/);
  assert.doesNotMatch(page, /#12100e/);
  assert.doesNotMatch(page, /#3d3429/);
  assert.doesNotMatch(page, /#d4cfc4/);
  assert.doesNotMatch(page, /wet clay|sod lip|chalk survey|iron spike|guest void/i);
  assert.doesNotMatch(page, /culture dish|glass slide|agar|pathogen|epidemiolog/i);
  assert.doesNotMatch(page, /pulse-damper|srt-mux|EPIPE/i);
  assert.doesNotMatch(page, /phosphor|mega-frame|message_stop/i);
  assert.doesNotMatch(page, /Snellen|phoropter|double-vision/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bfomite\b/);
  assert.doesNotMatch(page, /\bsnubber\b/);
  assert.doesNotMatch(page, /\bfosse\b/);
  assert.doesNotMatch(page, /\bafterimage\b/);
  assert.doesNotMatch(page, /\bdiplopia\b/);
  assert.doesNotMatch(page, /\bdiopter\b/);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Diplopia/i);
  assert.match(page, /NOT Diopter/i);
  assert.match(page, /NOT Fomite/i);
  assert.match(page, /NOT Snubber/i);
  assert.match(page, /NOT Fosse/i);
  assert.match(page, /NOT Vernier/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Lucida/);
  assert.match(readme, /#93429/);
  assert.match(readme, /traced/);
  assert.match(readme, /pathless/);
  assert.match(readme, /image-cache/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Afterimage/i);
  assert.match(readme, /NOT Diplopia/i);
  assert.match(readme, /NOT Diopter/i);
  assert.match(readme, /NOT Fomite/i);
  assert.match(readme, /NOT Snubber/i);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /1\.49585\.0/);
  assert.match(readme, /852x525/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/lucida/);
  assert.match(readme, /node --test projects\/lucida\/lucida\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /content-block branch/);
  assert.match(readme, /#84251/);
  assert.match(readme, /#89223/);
  assert.match(readme, /#93446/);
  assert.match(readme, /#93445/);
  assert.match(readme, /camera-lucida \/ optical-tracing/);
  assert.match(readme, /Code tab/);
});

test("catalog features Lucida only; Fomite and Snubber unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 277);
  assert.equal(catalog.products[0].name, "Lucida");
  assert.equal(catalog.products[0].slug, "lucida");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/lucida/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /05:50/);
  assert.match(catalog.products[0].summary, /lucida/);
  assert.match(catalog.products[0].summary, /#93429/);
  assert.match(catalog.products[0].summary, /traced/);
  assert.match(catalog.products[0].summary, /pathless/);
  assert.match(catalog.products[0].summary, /image-cache/);
  const fomite = catalog.products.find((row) => row.slug === "fomite");
  assert.ok(fomite);
  assert.equal(fomite.featured, false);
  const snubber = catalog.products.find((row) => row.slug === "snubber");
  assert.ok(snubber);
  assert.equal(snubber.featured, false);
  const fosse = catalog.products.find((row) => row.slug === "fosse");
  assert.ok(fosse);
  assert.equal(fosse.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "lucida").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93429") && row.slug !== "lucida"));
});

test("vercel rewrites lucida to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/lucida");
  assert.equal(vercel.rewrites[0].destination, "/projects/lucida");
  assert.equal(vercel.rewrites[1].source, "/lucida/");
  assert.equal(vercel.rewrites[1].destination, "/projects/lucida");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
