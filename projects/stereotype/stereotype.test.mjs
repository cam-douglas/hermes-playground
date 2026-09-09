import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALREADY_LATEST,
  AUTO_UPDATE_FILE,
  CACHE_MONTHS_BEHIND,
  CACHE_OBSERVED,
  CHIPS,
  COUSINS,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HEAD_DATE,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARKETPLACE,
  MARKETPLACE_HEAD,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PINNED_EXAMPLES,
  PLUGIN,
  PLUGIN_VERSION,
  SEEDED_WORD,
  SKILL_REWRITTEN,
  SKILLS_COMMITS,
  STATE,
  STEREOTYPE_WALK,
  TITLE,
  VERDICTS,
  VERSION_SINCE,
  WORKAROUND,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedAutoUpdateTrue,
  seedFresh,
  seedMarketplaceHead,
  seedPinnedSha,
  seedStamped,
  seedStereotype,
  seedUninstallReinstall,
  seedVersionOnly,
} from "./stereotype.mjs";

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
  return fileURLToPath(new URL("./stereotype.mjs", import.meta.url));
}

test("idle fresh is a hold; aligned to marketplace HEAD", () => {
  const result = analyze(seedFresh());
  assert.equal(result.verdict, "fresh");
  assert.equal(result.idleWord, "fresh");
  assert.equal(IDLE_WORD, "fresh");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fresh, true);
  assert.equal(result.phrase, "admit fresh");
  assert.equal(result.contentAligned, true);
  assert.equal(result.cacheStale, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify fresh", () => {
  assert.equal(classify(emptyTicket()), "fresh");
  assert.equal(classify(""), "fresh");
  assert.equal(classify(null), "fresh");
  assert.equal(decide({}), "fresh");
});

test("#93108 seeded path scores stamped when version matches and content stays", () => {
  const result = analyze(seedStamped());
  assert.equal(result.verdict, "stamped");
  assert.equal(result.seededWord, "stamped");
  assert.equal(SEEDED_WORD, "stamped");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.stamped, true);
  assert.equal(result.phrase, "score stamped");
  assert.equal(result.compareVersionOnly, true);
  assert.equal(result.marketplaceHeadMoved, true);
  assert.equal(result.cacheStale, true);
  assert.equal(result.reportsAlreadyLatest, true);
  assert.equal(result.marketplaceHead, "e8f4120");
  assert.equal(result.cacheMonthsBehind, 4);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is stereotype; named stereotype seed holds the path", () => {
  assert.equal(PATH_WORD, "stereotype");
  const result = analyze(seedStereotype());
  assert.equal(result.verdict, "stereotype");
  assert.equal(result.pathWord, "stereotype");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("stereotype.json")), "stereotype");
});

test("freshness chips: version-only, marketplace-head, auto-update-true, uninstall-reinstall, pinned-sha", () => {
  const version = analyze(seedVersionOnly());
  assert.equal(version.compareVersionOnly, true);
  assert.equal(version.pluginVersion, PLUGIN_VERSION);
  assert.equal(classify(readData("version-only.json")), "version-only");
  const head = analyze(seedMarketplaceHead());
  assert.equal(head.marketplaceHead, MARKETPLACE_HEAD);
  assert.equal(head.skillsCommits, 5);
  assert.equal(classify(readData("marketplace-head.json")), "marketplace-head");
  const auto = analyze(seedAutoUpdateTrue());
  assert.equal(auto.autoUpdateTrue, true);
  assert.equal(auto.autoUpdatePulled, false);
  assert.equal(classify(readData("auto-update-true.json")), "auto-update-true");
  const work = analyze(seedUninstallReinstall());
  assert.equal(work.uninstallReinstallOnly, true);
  assert.equal(classify(readData("uninstall-reinstall.json")), "uninstall-reinstall");
  const pin = analyze(seedPinnedSha());
  assert.equal(pin.pinnedShaMoved, true);
  assert.equal(pin.independentlyVerified, false);
  assert.equal(classify(readData("pinned-sha.json")), "pinned-sha");
});

test("fixture toggle flips fresh vs stamped", () => {
  const fresh = scoreGate(readData("fresh.json"));
  const stamped = scoreGate(readData("stamped.json"));
  assert.equal(fresh.verdict, "fresh");
  assert.equal(stamped.verdict, "stamped");
  assert.notEqual(fresh.verdict, stamped.verdict);
  assert.equal(score(readData("fresh.json")), "fresh");
  assert.equal(score(readData("stamped.json")), "stamped");
  assert.equal(score(readData("93108.json")), "stamped");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("version-only.json")), "version-only");
  assert.equal(classify(readData("marketplace-head.json")), "marketplace-head");
  assert.equal(classify(readData("auto-update-true.json")), "auto-update-true");
  assert.equal(classify(readData("uninstall-reinstall.json")), "uninstall-reinstall");
  assert.equal(classify(readData("pinned-sha.json")), "pinned-sha");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published stereotype walk scores stamped after the plate is cast", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "stamped");
  assert.ok(night.stampedCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-fresh");
  assert.equal(idle.contentAligned, true);
  assert.equal(idle.verdict, "fresh");
  const version = night.rows.find((row) => row.event === "version-only");
  assert.equal(version.verdict, "stamped");
  assert.equal(version.compareVersionOnly, true);
  const head = night.rows.find((row) => row.event === "marketplace-head");
  assert.equal(head.marketplaceHead, "e8f4120");
  const stamp = night.rows.find((row) => row.event === "stamped");
  assert.equal(stamp.cacheMonthsBehind, 4);
  assert.equal(stamp.reportsAlreadyLatest, true);
  const path = night.rows.find((row) => row.event === "stereotype");
  assert.equal(path.verdict, "stereotype");
});

test("STEREOTYPE_WALK constant matches the issue version-string walk", () => {
  assert.equal(STEREOTYPE_WALK[0].event, "cue-fresh");
  const version = STEREOTYPE_WALK.find((row) => row.event === "version-only");
  assert.equal(version.compareVersionOnly, true);
  const head = STEREOTYPE_WALK.find((row) => row.event === "marketplace-head");
  assert.equal(head.marketplaceHead, "e8f4120");
  assert.equal(head.skillsCommits, 5);
  const auto = STEREOTYPE_WALK.find((row) => row.event === "auto-update-true");
  assert.equal(auto.autoUpdateTrue, true);
  assert.equal(auto.autoUpdatePulled, false);
  const stamp = STEREOTYPE_WALK.find((row) => row.event === "stamped");
  assert.equal(stamp.cacheStale, true);
  assert.equal(stamp.cacheMonthsBehind, 4);
  const pin = STEREOTYPE_WALK.find((row) => row.event === "pinned-sha");
  assert.equal(pin.independentlyVerified, false);
  const work = STEREOTYPE_WALK.find((row) => row.event === "uninstall-reinstall");
  assert.equal(work.uninstallReinstallOnly, true);
});

test("issue constants encode only #93108 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93108);
  assert.ok(ISSUE_URL.includes("93108"));
  assert.match(TITLE, /version string/);
  assert.match(TITLE, /never refresh/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:plugins"));
  assert.equal(PLUGIN, "langsmith-skills@langsmith-skills");
  assert.equal(MARKETPLACE, "langchain-ai/langsmith-skills");
  assert.equal(PLUGIN_VERSION, "0.1.0");
  assert.equal(VERSION_SINCE, "2026-03-10");
  assert.equal(SKILLS_COMMITS, 5);
  assert.equal(MARKETPLACE_HEAD, "e8f4120");
  assert.equal(HEAD_DATE, "2026-08-17");
  assert.equal(SKILL_REWRITTEN, "langsmith-evaluator");
  assert.equal(CACHE_OBSERVED, "2026-08-24");
  assert.equal(CACHE_MONTHS_BEHIND, 4);
  assert.match(ALREADY_LATEST, /already at the latest version \(0\.1\.0\)/);
  assert.equal(AUTO_UPDATE_FILE, "known_marketplaces.json");
  assert.equal(WORKAROUND, "uninstall then install");
  assert.deepEqual([...PINNED_EXAMPLES], ["superpowers", "firecrawl"]);
  assert.ok(FINGERPRINT_LINES.includes("already at the latest version (0.1.0)"));
  assert.match(PHRASE, /not fresh — it is a stereotype/);
  assert.ok(HOLD.includes("fresh"));
  assert.ok(ALARM.includes("stamped"));
  assert.ok(ALARM.includes("stereotype"));
  assert.ok(CHIPS.includes("version-only"));
  assert.ok(VERDICTS.includes("marketplace-head"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "cleared",
    "distinct",
    "held",
    "raised",
    "sterling",
    "primed",
    "lodged",
    "mounded",
    "conflated",
    "steered",
    "fallen",
    "debased",
    "flashed",
    "bypassed",
    "greenroomed",
    "scaffold",
    "diplopic",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring a resolved-source compare flips stamped to fresh", () => {
  const tape = {
    versionMatch: true,
    contentAligned: true,
    compareVersionOnly: false,
    marketplaceHeadMoved: false,
    cacheStale: false,
    reportsAlreadyLatest: false,
    cue: "fresh",
  };
  assert.equal(scoreGate(tape).verdict, "fresh");
  tape.compareVersionOnly = true;
  tape.marketplaceHeadMoved = true;
  tape.contentAligned = false;
  tape.cacheStale = true;
  tape.reportsAlreadyLatest = true;
  tape.cue = "stamped";
  assert.equal(scoreGate(tape).verdict, "stamped");
  tape.compareVersionOnly = false;
  tape.marketplaceHeadMoved = false;
  tape.contentAligned = true;
  tape.cacheStale = false;
  tape.reportsAlreadyLatest = false;
  tape.cue = "fresh";
  assert.equal(scoreGate(tape).verdict, "fresh");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [86194, 91271, 86139],
  );
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 86194);
  assert.equal(COUSINS[2].issue, 86139);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published macos plugins walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /langsmith-skills/);
  assert.match(repro.note, /0\.1\.0/);
  assert.match(repro.note, /e8f4120/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const fresh = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/fresh.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const stamped = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/stamped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(fresh.status, 0, fresh.stderr);
  assert.equal(stamped.status, 0, stamped.stderr);
  assert.equal(JSON.parse(fresh.stdout).verdict, "fresh");
  assert.equal(JSON.parse(stamped.stdout).verdict, "stamped");
});

test("handle exposes published hypothesis and #93108 headline", () => {
  const result = handle(readData("93108.json"));
  assert.equal(result.published.issue, 93108);
  assert.equal(result.published.plugin, "langsmith-skills@langsmith-skills");
  assert.equal(result.published.pluginVersion, "0.1.0");
  assert.equal(result.published.marketplaceHead, "e8f4120");
  assert.equal(result.published.cacheMonthsBehind, 4);
  assert.deepEqual(result.published.cousins, [86194, 91271, 86139]);
  assert.match(result.published.hypothesis, /version string/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedStamped()),
    /stamped\|compare=version-only\|head=moved\|cache=stale/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a letterpress stereotype foundry booth, not a midden pit", () => {
  const page = readPage();
  assert.match(page, /Alegreya/);
  assert.match(page, /Karla/);
  assert.match(page, /Noto Sans Mono/);
  assert.match(page, /letterpress|stereotype|foundry|chase|forme/i);
  assert.match(page, /#6e7276/);
  assert.match(page, /#12110f/);
  assert.match(page, /#efe6d0/);
  assert.match(page, /#c4a35a/);
  assert.match(page, /#c41e3a/);
  assert.match(page, /fresh/);
  assert.match(page, /stamped/);
  assert.match(page, /stereotype/);
  assert.match(page, /score stamped or admit fresh/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /00:50/);
  assert.match(page, /#250/);
  assert.match(page, /#93108/);
  assert.match(page, /langsmith-skills/);
  assert.match(page, /0\.1\.0/);
  assert.match(page, /e8f4120/);
  assert.match(page, /already at the latest version/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair Display|Outfit|Space Mono/);
  assert.doesNotMatch(page, /Lato|Fira Code/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology|double-vision|acuity booth/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /mezzanine|brass rail|cream plaster/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /velvet|tungsten|call sheet|cue light/i);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bmounded\b/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bconflated\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\bgreenroomed\b/);
  assert.doesNotMatch(page, /\bdiplopic\b/);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Diplopia/i);
  assert.match(page, /NOT Greenroom/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Entresol/i);
  assert.match(page, /NOT Hallmark/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
  assert.match(page, /NOT Interlock/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Stereotype/);
  assert.match(readme, /#93108/);
  assert.match(readme, /fresh/);
  assert.match(readme, /stamped/);
  assert.match(readme, /stereotype/);
  assert.match(readme, /Alegreya/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Noto Sans Mono/);
  assert.match(readme, /Do NOT reuse Fraunces/);
  assert.match(readme, /Do NOT reuse Cormorant/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Diplopia/i);
  assert.match(readme, /NOT Greenroom/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/stereotype/);
  assert.match(readme, /node --test projects\/stereotype\/stereotype\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #250 features Stereotype; Midden stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 250);
  assert.equal(catalog.products[0].name, "Stereotype");
  assert.equal(catalog.products[0].slug, "stereotype");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/stereotype/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /00:50 stereotype/);
  const midden = catalog.products.find((row) => row.slug === "midden");
  assert.ok(midden);
  assert.equal(midden.featured, false);
  const diplopia = catalog.products.find((row) => row.slug === "diplopia");
  assert.ok(diplopia);
  assert.equal(diplopia.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites stereotype to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/stereotype");
  assert.equal(vercel.rewrites[0].destination, "/projects/stereotype");
  assert.equal(vercel.rewrites[1].source, "/stereotype/");
  assert.equal(vercel.rewrites[1].destination, "/projects/stereotype");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
