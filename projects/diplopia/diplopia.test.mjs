import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BRIDGE_FIELDS,
  BRIDGE_HAS_NAME,
  BRIDGE_PATH,
  CHIPS,
  COLLISION_TABLE,
  COUSINS,
  DIPLOPIA_WALK,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MAX_SESSIONS,
  MOBILE_OR_PEER_SESSIONS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  REPORTER,
  SEEDED_WORD,
  STATE,
  TITLE,
  VERDICTS,
  VERSION,
  WEB_SESSIONS,
  WORKER_TYPE,
  analyze,
  basenameFromDirectory,
  basenameFromGitRepoUrl,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedConflated,
  seedDiplopic,
  seedDistinct,
  seedMobileFromDirectory,
  seedWebFromGitRepoUrl,
} from "./diplopia.mjs";

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
  return fileURLToPath(new URL("./diplopia.mjs", import.meta.url));
}

test("idle distinct is a hold; web and mobile labels stay distinguishable", () => {
  const result = analyze(seedDistinct());
  assert.equal(result.verdict, "distinct");
  assert.equal(result.idleWord, "distinct");
  assert.equal(IDLE_WORD, "distinct");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.distinct, true);
  assert.equal(result.phrase, "admit distinct");
  assert.equal(result.webLabelFrom, "directory");
  assert.equal(result.mobileLabelFrom, "directory");
  assert.equal(result.subdirectoryCollision, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify distinct", () => {
  assert.equal(classify(emptyTicket()), "distinct");
  assert.equal(classify(""), "distinct");
  assert.equal(classify(null), "distinct");
  assert.equal(decide({}), "distinct");
});

test("#93012 seeded path scores conflated when web paints two live rooms as monorepo", () => {
  const result = analyze(seedConflated());
  assert.equal(result.verdict, "conflated");
  assert.equal(result.seededWord, "conflated");
  assert.equal(SEEDED_WORD, "conflated");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.conflated, true);
  assert.equal(result.phrase, "score conflated");
  assert.equal(result.webLabelFrom, "git_repo_url");
  assert.equal(result.mobileLabelFrom, "directory");
  assert.equal(result.subdirectoryCollision, true);
  assert.equal(result.webShows, "monorepo");
  assert.equal(result.mobileShows, "subproject");
  assert.equal(result.liveNotStale, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is diplopic; named diplopic seed holds the path", () => {
  assert.equal(PATH_WORD, "diplopic");
  const result = analyze(seedDiplopic());
  assert.equal(result.verdict, "diplopic");
  assert.equal(result.pathWord, "diplopic");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("diplopic.json")), "diplopic");
});

test("payload field split: web from git_repo_url, mobile from directory", () => {
  const web = analyze(seedWebFromGitRepoUrl());
  assert.equal(web.webLabelFrom, "git_repo_url");
  assert.equal(web.gitRepoUrlBasename, "monorepo");
  assert.equal(classify(readData("web-from-git-repo-url.json")), "web-from-git-repo-url");
  const mobile = analyze(seedMobileFromDirectory());
  assert.equal(mobile.mobileLabelFrom, "directory");
  assert.equal(mobile.directoryBasename, "subproject");
  assert.equal(classify(readData("mobile-from-directory.json")), "mobile-from-directory");
  assert.equal(basenameFromGitRepoUrl("https://github.com/owner/monorepo"), "monorepo");
  assert.equal(basenameFromDirectory("/home/user/projects/monorepo/subproject"), "subproject");
});

test("subdirectory collision table: roots agree; subproject web shows monorepo", () => {
  assert.equal(COLLISION_TABLE.length, 4);
  const roots = COLLISION_TABLE.filter((row) => row.agree);
  assert.equal(roots.length, 3);
  for (const row of roots) {
    assert.equal(row.directoryBasename, row.gitRepoUrlBasename);
    assert.equal(row.webShows, row.mobileShows);
  }
  const sub = COLLISION_TABLE.find((row) => row.cwd === "projects/monorepo/subproject");
  assert.equal(sub.directoryBasename, "subproject");
  assert.equal(sub.gitRepoUrlBasename, "monorepo");
  assert.equal(sub.webShows, "monorepo");
  assert.equal(sub.mobileShows, "subproject");
  assert.equal(sub.agree, false);
  assert.equal(sub.webWrong, true);
  assert.equal(sub.mobileOk, true);
  assert.equal(classify(readData("subdirectory-collision.json")), "subdirectory-collision");
});

test("fixture toggle flips distinct vs conflated", () => {
  const distinct = scoreGate(readData("distinct.json"));
  const conflated = scoreGate(readData("conflated.json"));
  assert.equal(distinct.verdict, "distinct");
  assert.equal(conflated.verdict, "conflated");
  assert.notEqual(distinct.verdict, conflated.verdict);
  assert.equal(score(readData("distinct.json")), "distinct");
  assert.equal(score(readData("conflated.json")), "conflated");
  assert.equal(score(readData("93012.json")), "conflated");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("web-from-git-repo-url.json")), "web-from-git-repo-url");
  assert.equal(classify(readData("mobile-from-directory.json")), "mobile-from-directory");
  assert.equal(classify(readData("subdirectory-collision.json")), "subdirectory-collision");
  assert.equal(classify(readData("no-name-field.json")), "no-name-field");
  assert.equal(classify(readData("name-flag-session-only.json")), "name-flag-session-only");
  assert.equal(classify(readData("live-not-stale.json")), "live-not-stale");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published diplopia walk scores conflated after the rooms collide", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "conflated");
  assert.ok(night.conflatedCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-distinct");
  assert.equal(idle.webLabelFrom, "directory");
  assert.equal(idle.verdict, "distinct");
  const web = night.rows.find((row) => row.event === "web-from-git-repo-url");
  assert.equal(web.verdict, "conflated");
  assert.equal(web.webLabelFrom, "git_repo_url");
  const collision = night.rows.find((row) => row.event === "subdirectory-collision");
  assert.equal(collision.subdirectoryCollision, true);
  assert.equal(collision.webShows, "monorepo");
  const path = night.rows.find((row) => row.event === "diplopic");
  assert.equal(path.verdict, "diplopic");
});

test("DIPLOPIA_WALK constant matches the issue picker walk", () => {
  assert.equal(DIPLOPIA_WALK[0].event, "cue-distinct");
  const web = DIPLOPIA_WALK.find((row) => row.event === "web-from-git-repo-url");
  assert.equal(web.webLabelFrom, "git_repo_url");
  const mobile = DIPLOPIA_WALK.find((row) => row.event === "mobile-from-directory");
  assert.equal(mobile.mobileLabelFrom, "directory");
  const collision = DIPLOPIA_WALK.find((row) => row.event === "subdirectory-collision");
  assert.equal(collision.cwd, "projects/monorepo/subproject");
  const bridge = DIPLOPIA_WALK.find((row) => row.event === "no-name-field");
  assert.equal(bridge.noNameField, true);
  const name = DIPLOPIA_WALK.find((row) => row.event === "name-flag-session-only");
  assert.equal(name.nameSetsEnvironmentLabel, false);
  const live = DIPLOPIA_WALK.find((row) => row.event === "live-not-stale");
  assert.deepEqual(live.sessions, ["3/32", "1/32"]);
});

test("issue constants encode only #93012 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93012);
  assert.ok(ISSUE_URL.includes("93012"));
  assert.match(TITLE, /Remote Control/);
  assert.match(TITLE, /environment label/);
  assert.match(TITLE, /subdirectory environments/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:claude-code-web"));
  assert.equal(REPORTER, "michaelcopeland");
  assert.equal(FILED_AT, "2026-09-09T06:23:15Z");
  assert.equal(VERSION, "2.1.266");
  assert.equal(PLATFORM, "linux");
  assert.equal(BRIDGE_PATH, "/v1/environments/bridge");
  assert.equal(BRIDGE_HAS_NAME, false);
  assert.ok(BRIDGE_FIELDS.includes("machine_name"));
  assert.ok(BRIDGE_FIELDS.includes("directory"));
  assert.ok(BRIDGE_FIELDS.includes("git_repo_url"));
  assert.ok(!BRIDGE_FIELDS.includes("name"));
  assert.equal(WORKER_TYPE, "claude_code");
  assert.equal(MAX_SESSIONS, 32);
  assert.equal(WEB_SESSIONS, "3/32");
  assert.equal(MOBILE_OR_PEER_SESSIONS, "1/32");
  assert.match(PHRASE, /conflated double vision/);
  assert.ok(HOLD.includes("distinct"));
  assert.ok(ALARM.includes("conflated"));
  assert.ok(ALARM.includes("diplopic"));
  assert.ok(CHIPS.includes("subdirectory-collision"));
  assert.ok(VERDICTS.includes("web-from-git-repo-url"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "held",
    "raised",
    "fallen",
    "scaffold",
    "lodged",
    "bypassed",
    "cutaway",
    "sterling",
    "debased",
    "rubbed",
    "primed",
    "flashed",
    "flashpanned",
    "greenroomed",
    "steered",
    "unshorn",
    "sheared",
    "secateured",
    "emended",
    "unretracted",
    "palinoded",
    "ferruled",
    "interlocked",
    "passable",
    "admitted",
    "deeded",
    "parked",
    "shibbolethed",
    "countersigned",
    "homesteaded",
    "staked",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring directory labels flips conflated to distinct", () => {
  const tape = {
    webLabelFrom: "directory",
    mobileLabelFrom: "directory",
    subdirectoryCollision: false,
    webLabelsUnique: true,
  };
  assert.equal(scoreGate(tape).verdict, "distinct");
  tape.webLabelFrom = "git_repo_url";
  tape.subdirectoryCollision = true;
  tape.webLabel = "monorepo";
  tape.mobileLabel = "subproject";
  tape.cue = "conflated";
  assert.equal(scoreGate(tape).verdict, "conflated");
  tape.webLabelFrom = "directory";
  tape.subdirectoryCollision = false;
  tape.webLabelsUnique = true;
  tape.cue = "distinct";
  delete tape.webLabel;
  delete tape.mobileLabel;
  assert.equal(scoreGate(tape).verdict, "distinct");
});

test("live-not-stale and --name session-only fixtures", () => {
  const live = readData("live-not-stale.json");
  assert.equal(live.liveNotStale, true);
  assert.deepEqual(live.sessions, ["3/32", "1/32"]);
  assert.equal(classify(live), "live-not-stale");
  const name = readData("name-flag-session-only.json");
  assert.equal(name.nameSetsSessionTitle, true);
  assert.equal(name.nameSetsEnvironmentLabel, false);
  assert.equal(classify(name), "name-flag-session-only");
  const bridge = readData("no-name-field.json");
  assert.equal(bridge.noNameField, true);
  assert.equal(bridge.bridgeHasName, false);
  assert.equal(classify(bridge), "no-name-field");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [77372, 88939],
  );
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 77372);
  assert.equal(COUSINS[1].issue, 88939);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published linux remote-control walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /remote-control/);
  assert.match(repro.note, /subdirectory/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const distinct = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/distinct.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const conflated = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/conflated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(distinct.status, 0, distinct.stderr);
  assert.equal(conflated.status, 0, conflated.stderr);
  assert.equal(JSON.parse(distinct.stdout).verdict, "distinct");
  assert.equal(JSON.parse(conflated.stdout).verdict, "conflated");
});

test("handle exposes published hypothesis and #93012 headline", () => {
  const result = handle(readData("93012.json"));
  assert.equal(result.published.issue, 93012);
  assert.equal(result.published.version, "2.1.266");
  assert.equal(result.published.reporter, "michaelcopeland");
  assert.equal(result.published.bridgeHasName, false);
  assert.deepEqual(result.published.cousins, [77372, 88939]);
  assert.match(result.published.hypothesis, /git_repo_url basename/);
  assert.match(result.published.hypothesis, /NON-BINDING|directory basename|omits an explicit environment name/);
  assert.match(
    fingerprint(seedConflated()),
    /conflated\|web=git_repo_url\|mobile=directory\|collision=subdirectory/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an ophthalmology acuity booth, not greenroom theater velvet", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond/);
  assert.match(page, /Atkinson Hyperlegible/);
  assert.match(page, /Source Code Pro/);
  assert.match(page, /diplopia|double-vision|acuity|phoropter|Snellen/i);
  assert.match(page, /#f4f7fb/);
  assert.match(page, /#0b1c3a/);
  assert.match(page, /#4ec8d6/);
  assert.match(page, /#d4a017/);
  assert.match(page, /distinct/);
  assert.match(page, /conflated/);
  assert.match(page, /diplopic/);
  assert.match(page, /score conflated or admit distinct/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /21:50/);
  assert.match(page, /#248/);
  assert.match(page, /#93012/);
  assert.match(page, /git_repo_url/);
  assert.match(page, /claude\.ai\/code/);
  assert.match(page, /remote-control/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair Display|Outfit|Space Mono/);
  assert.doesNotMatch(page, /Lato|Fira Code/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /EB Garamond|Barlow/);
  assert.doesNotMatch(page, /Bodoni Moda|Libre Caslon|Literata/);
  assert.doesNotMatch(page, /Chakra Petch|Hind/);
  assert.doesNotMatch(page, /drop-zone|dropzone|drop zone/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /mezzanine|brass rail|cream plaster/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /velvet|tungsten|call sheet|cue light/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /\bgreenroomed\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
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
  assert.match(readme, /Diplopia/);
  assert.match(readme, /#93012/);
  assert.match(readme, /distinct/);
  assert.match(readme, /conflated/);
  assert.match(readme, /diplopic/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Atkinson Hyperlegible/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /Do NOT reuse Fraunces/);
  assert.match(readme, /Do NOT reuse Spectral/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Greenroom/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/diplopia/);
  assert.match(readme, /node --test projects\/diplopia\/diplopia\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #248 features Diplopia; Greenroom stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 248);
  assert.equal(catalog.products[0].name, "Diplopia");
  assert.equal(catalog.products[0].slug, "diplopia");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/diplopia/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  assert.match(catalog.products[0].summary, /21:50 diplopia/);
  const greenroom = catalog.products.find((row) => row.slug === "greenroom");
  assert.ok(greenroom);
  assert.equal(greenroom.featured, false);
  const guillotine = catalog.products.find((row) => row.slug === "guillotine");
  assert.ok(guillotine);
  assert.equal(guillotine.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites diplopia to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/diplopia");
  assert.equal(vercel.rewrites[0].destination, "/projects/diplopia");
  assert.equal(vercel.rewrites[1].source, "/diplopia/");
  assert.equal(vercel.rewrites[1].destination, "/projects/diplopia");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
