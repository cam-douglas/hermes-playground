import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ASSERTION,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DISPROOF,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FIRST_ATTEMPT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LISTING_ENDPOINT,
  NECROLOGY_FOLIOS,
  NECROLOGY_WALK,
  NOT_PRODUCTS,
  OLDER_OPTIONS,
  PATH_WORD,
  PHRASE,
  PIPELINE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RELEASE_LAG_DAYS,
  RESOLVE_PATH,
  RULED_OUT,
  SAMPLE_LISTING,
  SAMPLE_QUESTION,
  SAMPLE_REGISTER,
  SAMPLE_VISITATION,
  SAMPLE_CROSS,
  SEEDED_WORD,
  SESSION_KIND,
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
  inspectCross,
  inspectListing,
  inspectQuestion,
  inspectRegister,
  inspectVisitation,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAbsentNotDead,
  seedAttested,
  seedBlockingChoice,
  seedCrossCheck,
  seedDoesNotExist,
  seedHold,
  seedIncompleteListing,
  seedMalformedThenRetry,
  seedNecrologized,
  seedNecrology,
  seedNonJsonFirst,
  seedPerModelResolve,
  seedRecentRelease,
  seedScreenshotDisprove,
  seedThreeOlder,
} from "./necrology.mjs";

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
  return fileURLToPath(new URL("./necrology.mjs", import.meta.url));
}

test("idle attested is a hold; presence confirmed before any death claim", () => {
  const result = analyze(seedAttested());
  assert.equal(result.verdict, "attested");
  assert.equal(result.idleWord, "attested");
  assert.equal(IDLE_WORD, "attested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.attested, true);
  assert.equal(result.phrase, "admit attested");
  assert.equal(result.necrologized, false);
  assert.equal(result.incompleteListing, false);
  assert.equal(result.crossCheck, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify attested", () => {
  assert.equal(classify(emptyTicket()), "attested");
  assert.equal(classify(""), "attested");
  assert.equal(classify(null), "attested");
  assert.equal(decide({}), "attested");
});

test("#93774 seeded path scores necrology when the living are entered dead", () => {
  const result = analyze(seedNecrologized());
  assert.equal(result.verdict, "necrology");
  assert.equal(result.seededWord, "necrologized");
  assert.equal(SEEDED_WORD, "necrologized");
  assert.equal(PRODUCT_WORD, "necrology");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.necrologized, true);
  assert.equal(result.phrase, "score necrology");
  assert.equal(result.incompleteListing, true);
  assert.equal(result.malformedThenRetry, true);
  assert.equal(result.blockingChoice, true);
  assert.equal(result.doesNotExist, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("incomplete listing plus does-not-exist is the #93774 necrology", () => {
  const listing = inspectListing({ necrologized: true, incompleteListing: true });
  assert.equal(listing.stamp, "census-incomplete");
  assert.equal(listing.complete, false);
  const scored = scoreGate({
    necrologized: true,
    incompleteListing: true,
    malformedThenRetry: true,
    blockingChoice: true,
    threeOlder: true,
    recentRelease: true,
    screenshotDisprove: true,
    perModelResolve: true,
    crossCheck: true,
    absentNotDead: true,
    nonJsonFirst: true,
    doesNotExist: true,
    cue: "necrologized",
    listing: SAMPLE_LISTING,
    register: SAMPLE_REGISTER,
    question: SAMPLE_QUESTION,
  });
  assert.equal(scored.verdict, "necrology");
  assert.equal(scored.incompleteListing, true);
  const open = inspectListing({ attested: true, crossCheck: true });
  assert.equal(open.stamp, "census-complete");
});

test("path word is incomplete-listing; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "incomplete-listing");
  const result = analyze(seedIncompleteListing());
  assert.equal(result.verdict, "incomplete-listing");
  assert.equal(result.pathWord, "incomplete-listing");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "incomplete-listing", preferSeed: true, necrologized: true }),
    "incomplete-listing",
  );
  assert.equal(classify(seedBlockingChoice()), "blocking-choice");
});

test("HOLD includes attested / hold", () => {
  assert.ok(HOLD.includes("attested"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: malformed-then-retry, blocking-choice, per-model-resolve, cross-check", () => {
  assert.equal(classify(seedMalformedThenRetry()), "malformed-then-retry");
  assert.equal(classify(seedThreeOlder()), "three-older");
  assert.equal(classify(seedRecentRelease()), "recent-release");
  assert.equal(classify(seedBlockingChoice()), "blocking-choice");
  assert.equal(classify(seedScreenshotDisprove()), "screenshot-disprove");
  assert.equal(classify(seedPerModelResolve()), "per-model-resolve");
  assert.equal(classify(seedCrossCheck()), "cross-check");
  assert.equal(classify(seedAbsentNotDead()), "absent-not-dead");
  assert.equal(classify(seedNonJsonFirst()), "non-json-first");
  assert.equal(classify(seedDoesNotExist()), "does-not-exist");
  assert.equal(classify(seedNecrology()), "necrology");
});

test("booth fixtures flip attested vs necrologized vs incomplete-listing vs necrology", () => {
  const idle = scoreGate(seedAttested());
  const seeded = scoreGate(seedNecrologized());
  const attested = readData("attested.json");
  const necrologized = readData("necrologized.json");
  const path = readData("incomplete-listing.json");
  const product = readData("necrology.json");
  const malformed = readData("malformed-then-retry.json");
  const blocking = readData("blocking-choice.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "attested");
  assert.equal(seeded.verdict, "necrology");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAttested()), "attested");
  assert.equal(score(seedNecrologized()), "necrology");
  assert.equal(attested.crossCheck, true);
  assert.equal(attested.attested, true);
  assert.equal(scoreGate(attested).verdict, "attested");
  assert.equal(necrologized.incompleteListing, true);
  assert.equal(necrologized.malformedThenRetry, true);
  assert.equal(necrologized.blockingChoice, true);
  assert.equal(classify(necrologized), "necrologized");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /absent from one listing|not found via this endpoint/i);
  assert.match(path.paths[1].result, /does not exist|blocking/i);
  assert.equal(classify(path), "incomplete-listing");
  assert.equal(classify(product), "necrology");
  assert.equal(product.hubCount, "NECROLOGY");
  assert.equal(necrologized.issue, 93774);
  assert.equal(necrologized.necrologized, true);
  assert.equal(classify(malformed), "malformed-then-retry");
  assert.equal(classify(blocking), "blocking-choice");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("cross-check.json")), "cross-check");
  assert.equal(classify(readData("per-model-resolve.json")), "per-model-resolve");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("attested"));
  assert.ok(CHIPS.includes("necrologized"));
  assert.ok(CHIPS.includes("necrology"));
  assert.ok(CHIPS.includes("incomplete-listing"));
  assert.ok(CHIPS.includes("malformed-then-retry"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("necrologized"));
  assert.ok(ALARM.includes("incomplete-listing"));
  assert.ok(ALARM.includes("malformed-then-retry"));
  assert.ok(ALARM.includes("necrology"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published necrology walk scores necrology after the idle hold", () => {
  const booth = scoreWalk({ rows: NECROLOGY_WALK });
  assert.equal(booth.verdict, "necrology");
  assert.ok(booth.necrologizedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-attested");
  assert.equal(idle.attested, true);
  assert.equal(idle.verdict, "attested");
  const malformed = booth.rows.find((row) => row.event === "malformed-then-retry");
  assert.equal(malformed.malformedThenRetry, true);
  const path = booth.rows.find((row) => row.event === "incomplete-listing" && row.t === "path");
  assert.equal(path.verdict, "incomplete-listing");
});

test("NECROLOGY_WALK constant matches the issue death-register walk", () => {
  assert.equal(NECROLOGY_WALK[0].event, "cue-attested");
  const malformed = NECROLOGY_WALK.find((row) => row.event === "malformed-then-retry");
  assert.equal(malformed.malformedThenRetry, true);
  const path = NECROLOGY_WALK.find((row) => row.t === "path");
  assert.equal(path.necrologized, true);
  const scoreRow = NECROLOGY_WALK.find((row) => row.event === "necrology");
  assert.equal(scoreRow.necrologized, true);
});

test("positive control cross-check stays attested", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "attested");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "attested");
  const hold = walk.rows.find((row) => row.event === "cue-attested");
  assert.equal(hold.attested, true);
  assert.equal(hold.verdict, "attested");
});

test("issue constants encode only #93774 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93774);
  assert.ok(ISSUE_URL.includes("93774"));
  assert.match(TITLE, /does not exist/i);
  assert.match(TITLE, /incomplete API listing|cross-checking/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("area:model"));
  assert.ok(LABELS.includes("area:providers"));
  assert.equal(PLATFORM, "cli");
  assert.match(CLAUDE_VERSION, /claude-fable-5/);
  assert.match(SURFACE, /Claude Code CLI/);
  assert.equal(LISTING_ENDPOINT, "/models");
  assert.equal(FIRST_ATTEMPT, "non-JSON");
  assert.match(ASSERTION, /does not exist on this provider/);
  assert.equal(OLDER_OPTIONS, 3);
  assert.equal(RELEASE_LAG_DAYS, 3);
  assert.match(PIPELINE, /image-generation/);
  assert.match(DISPROOF, /screenshot/);
  assert.match(RESOLVE_PATH, /per-model/);
  assert.equal(NECROLOGY_FOLIOS.length, 4);
  assert.ok(RULED_OUT.some((row) => /91161|84159|88345/i.test(row)));
  assert.ok(EXPECTED.some((row) => /not found via this endpoint|cross-check/i.test(row)));
  assert.match(DISTRIBUTION, /non-JSON|does not exist|three older|per-model/);
  assert.match(SESSION_KIND, /claude-fable-5|\/models|blocking multiple-choice/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("incomplete-listing"));
  assert.ok(FINGERPRINT_LINES.includes("necrologized"));
  assert.equal(PHRASE, "Score necrology or admit attested.");
  assert.equal(SAMPLE_LISTING.complete, false);
  assert.equal(SAMPLE_REGISTER.entered, true);
  assert.equal(SAMPLE_QUESTION.blocking, true);
  assert.equal(SAMPLE_VISITATION.run, false);
  assert.equal(SAMPLE_CROSS.done, false);
});

test("has-repro fingerprints encode the published necrologized roll", () => {
  const result = handle(seedNecrologized());
  assert.equal(result.published.platform, "cli");
  assert.match(result.published.sessionKind, /\/models|claude-fable-5/);
  assert.equal(result.published.listingEndpoint, LISTING_ENDPOINT);
  assert.match(
    fingerprint(seedNecrologized()),
    /necrology\|register=entered\|census=incomplete\|first=non-json\|question=blocking\|path=incomplete-listing\|cue=incomplete-listing/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Innominate and Snuffer", () => {
  const required = [
    "named",
    "blank",
    "innominate",
    "icon-only",
    "lit",
    "snuffed",
    "snuffer",
    "ganged-or",
    "pledged",
    "swapped",
    "changeling",
    "remote-reattach",
    "distinct",
    "collided",
    "homograph",
    "lossy-slug",
    "dry",
    "billed",
    "galley",
    "stop-dirty",
    "intact",
    "scraped",
    "rescript",
    "snapshot-write",
    "fresh",
    "residual",
    "monadnock",
    "submodule-base",
    "plain",
    "ridden",
    "attachment-rider",
    "rider",
    "dark",
    "spawn-mcp-focus",
    "followspot",
    "due",
    "misfired",
    "catchup-dow",
    "calends",
    "flowing",
    "dammed",
    "egress-allowlist",
    "weir",
    "underway",
    "becalmed",
    "cron-websearch",
    "irons",
    "seated",
    "raced",
    "ptmx-race",
    "cathead",
    "tip",
    "stale",
    "prewarm-latch",
    "anachronism",
    "stamped",
    "emptied",
    "empty-expand",
    "nullarbor",
    "standing",
    "hoisted",
    "petard",
    "wrapper-argv",
    "raised",
    "furled",
    "aposiopesis",
    "git-cwd-mute",
    "seised",
    "disseised",
    "disseisin",
    "home-evaporated",
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "closed",
    "lingering",
    "unrung",
    "compline",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
    "primed",
    "flashed",
    "mirage",
    "lodged",
    "kindled",
    "flushed",
    "solitary",
    "hit",
    "dropped",
    "painted",
    "lagged",
    "twinlinked",
    "flattened",
    "held",
    "steered",
    "greenroomed",
    "palimpsest",
    "oubliette",
    "ephemera",
    "homonym",
    "quench",
    "stopcock",
    "hasp",
    "scuttle",
    "aphonia",
    "muzzle",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "knell",
    "wraith",
    "scrim",
    "knock",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("attested booth flips necrologized back when presence stays attested", () => {
  const tape = {
    attested: true,
    necrologized: false,
    crossCheck: true,
    cue: "attested",
  };
  assert.equal(scoreGate(tape).verdict, "attested");
  tape.attested = false;
  tape.necrologized = true;
  tape.incompleteListing = true;
  tape.doesNotExist = true;
  tape.malformedThenRetry = true;
  tape.cue = "necrologized";
  assert.equal(scoreGate(tape).verdict, "necrology");
  tape.attested = true;
  tape.necrologized = false;
  tape.incompleteListing = false;
  tape.doesNotExist = false;
  tape.malformedThenRetry = false;
  tape.cue = "attested";
  assert.equal(scoreGate(tape).verdict, "attested");
});

test("listing, register, question, visitation, cross, and readBooth mark the necrologized roll", () => {
  const idle = inspectListing({
    attested: true,
    crossCheck: true,
    listing: { endpoint: "/models", attempts: 1, firstAttempt: "json", retried: false, found: true, complete: true },
  });
  assert.equal(idle.stamp, "census-complete");
  const register = inspectRegister({ necrologized: true, register: SAMPLE_REGISTER });
  assert.equal(register.stamp, "register-entered");
  assert.equal(register.entered, true);
  const question = inspectQuestion({
    blockingChoice: true,
    question: SAMPLE_QUESTION,
  });
  assert.equal(question.stamp, "question-blocking");
  const visitation = inspectVisitation({ necrologized: true, perModelResolve: true });
  assert.equal(visitation.stamp, "visitation-unrun");
  const cross = inspectCross({ necrologized: true, crossCheck: true });
  assert.equal(cross.stamp, "cross-skipped");
  const booth = readBooth({
    necrologized: true,
    doesNotExist: true,
    listing: SAMPLE_LISTING,
    register: SAMPLE_REGISTER,
  });
  assert.equal(booth.necrologized, true);
  assert.equal(booth.mark, "necrologized");
  const open = readBooth({
    attested: true,
    necrologized: false,
    crossCheck: true,
  });
  assert.equal(open.necrologized, false);
  assert.equal(open.mark, "attested");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 91161);
  assert.equal(COUSINS[1].issue, 84159);
  assert.equal(COUSINS[2].issue, 88345);
  assert.equal(COUSINS[3].issue, 88659);
  assert.equal(COUSINS[4].issue, 90591);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /91161|\/v1\/models|rebuild/i);
  assert.match(COUSINS[1].why, /84159|discoverable|fallback/i);
  assert.match(COUSINS[2].why, /88345|capability|stale/i);
  assert.match(COUSINS[3].why, /88659|pricing|\/usage/i);
  assert.match(COUSINS[4].why, /90591|Invalid Model Name|Fable/i);
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("monadnock"));
  assert.ok(NOT_PRODUCTS.includes("rider"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  assert.ok(NOT_PRODUCTS.includes("lacuna"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("wraith"));
  assert.ok(NOT_PRODUCTS.includes("quench"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("hasp"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93766);
  assert.equal(BACKUPS[1].issue, 93764);
  assert.equal(BACKUPS[2].issue, 93754);
  assert.equal(BACKUPS[3].issue, 93751);
  assert.equal(BACKUPS[4].issue, 93744);
  assert.equal(BACKUPS[5].issue, 93772);
  assert.equal(BACKUPS[6].issue, 93770);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /OneDrive|musl|glibc/i);
  assert.match(BACKUPS[1].title, /DECSTBM/i);
  assert.match(BACKUPS[5].title, /diagram|poster/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/necrologized.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const attestedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/attested.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(attestedFix.status, 0, attestedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "attested");
  assert.equal(JSON.parse(seeded.stdout).verdict, "necrologized");
  assert.equal(JSON.parse(attestedFix.stdout).verdict, "attested");
});

test("handle exposes published hypothesis and #93774 headline", () => {
  const result = handle(seedNecrologized());
  assert.equal(result.published.issue, 93774);
  assert.equal(result.published.platform, "cli");
  assert.deepEqual(result.published.cousins, [91161, 84159, 88345, 88659, 90591]);
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(!result.published.backups.includes(93774));
  assert.ok(!result.published.backups.includes(93769));
  assert.match(result.published.hypothesis, /malformed|incomplete|per-model/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93774/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a parish necrology booth, not innominate or snuffer", () => {
  const page = readPage();
  assert.match(page, /Cardo/);
  assert.match(page, /Sora/);
  assert.match(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.match(page, /necrology|necrolog|sexton|death.register|parish/i);
  assert.match(page, /#EDE3C8|#1A1410|#3F6B55|#A02A38|#8D8576/i);
  assert.match(page, /\battested\b/);
  assert.match(page, /\bnecrologized\b/);
  assert.match(page, /incomplete-listing/);
  assert.match(page, /Score necrology or admit attested/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#309/);
  assert.match(page, /#93774/);
  assert.match(page, /Attest the living/);
  assert.match(page, /Score necrology/);
  assert.match(page, /Walk the incomplete listing/);
  assert.match(page, /Compare attested \/ necrologized/);
  assert.match(page, /Pin idle attested/);
  assert.match(page, /Pin seeded necrologized/);
  assert.match(page, /Pin incomplete-listing/);
  assert.match(page, /Hold the attested/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#12141A/);
  assert.doesNotMatch(page, /#D7DCE5/);
  assert.doesNotMatch(page, /#E8A317/);
  assert.doesNotMatch(page, /#0B0D12/);
  assert.doesNotMatch(page, /#2A9D8F/);
  assert.doesNotMatch(page, /#C1121F/);
  assert.doesNotMatch(page, /#F3E5C5/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#FFF8EC/);
  assert.doesNotMatch(page, /#5C4A7A/);
  assert.doesNotMatch(page, /#EFE6D2/);
  assert.doesNotMatch(page, /#1A2748/);
  assert.doesNotMatch(page, /#C94A32/);
  assert.doesNotMatch(page, /blank nameplate|UIA Name|sendIcon|WCAG 4\.1\.2/i);
  assert.doesNotMatch(page, /pledged heir|court ledger|cradle-swap|fairy-gold|swaddling/i);
  assert.doesNotMatch(page, /lemma slip|lexicographer|shelf mark|orphan quire/i);
  assert.doesNotMatch(page, /composing stick|wet-proof|wet proof|unbound-signature|pull press|type-rail|galley-bed/i);
  assert.doesNotMatch(page, /chancery|wax-seal|wax seal|scrolled-rescript|lectern/i);
  assert.doesNotMatch(page, /trig survey|trig cairn|residual peak|nested massif|fetch sill/i);
  assert.doesNotMatch(page, /clerk desk|bill-rider|parliamentary|staple-pin/i);
  assert.doesNotMatch(page, /prop belt|operator iris|prompt book/i);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
  assert.doesNotMatch(page, /artifact flame|scratchpad taper|brass snuffer|ganged-or bar/i);
  assert.doesNotMatch(page, /\bnamed\b/);
  assert.doesNotMatch(page, /\bblank\b/);
  assert.doesNotMatch(page, /icon-only/);
  assert.doesNotMatch(page, /\bpledged\b/);
  assert.doesNotMatch(page, /\bswapped\b/);
  assert.doesNotMatch(page, /remote-reattach/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bcollided\b/);
  assert.doesNotMatch(page, /lossy-slug/);
  assert.doesNotMatch(page, /\bdry\b/);
  assert.doesNotMatch(page, /\bbilled\b/);
  assert.doesNotMatch(page, /stop-dirty/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\bscraped\b/);
  assert.doesNotMatch(page, /snapshot-write/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bresidual\b/);
  assert.doesNotMatch(page, /submodule-base/);
  assert.doesNotMatch(page, /\bplain\b/);
  assert.doesNotMatch(page, /\bridden\b/);
  assert.doesNotMatch(page, /attachment-rider/);
  assert.doesNotMatch(page, /\bdark\b/);
  assert.doesNotMatch(page, /spawn-mcp-focus/);
  assert.doesNotMatch(page, /\bdue\b/);
  assert.doesNotMatch(page, /\bmisfired\b/);
  assert.doesNotMatch(page, /catchup-dow/);
  assert.doesNotMatch(page, /\bflowing\b/);
  assert.doesNotMatch(page, /\bdammed\b/);
  assert.doesNotMatch(page, /egress-allowlist/);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /greenroomed/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /ganged-or/);
  assert.match(page, /NOT Innominate/i);
  assert.match(page, /NOT Snuffer/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Homograph/i);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Rescript/i);
  assert.match(page, /NOT Monadnock/i);
  assert.match(page, /NOT Rider/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Quench/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Hasp/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Muzzle/i);
  assert.match(page, /NOT Escutcheon/i);
  assert.match(page, /NOT Lacuna/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Necrology/);
  assert.match(readme, /#93774/);
  assert.match(readme, /\battested\b/);
  assert.match(readme, /\bnecrologized\b/);
  assert.match(readme, /incomplete-listing/);
  assert.match(readme, /Cardo/);
  assert.match(readme, /Sora/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Innominate/i);
  assert.match(readme, /NOT Snuffer/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /NOT Rescript/i);
  assert.match(readme, /NOT Monadnock/i);
  assert.match(readme, /NOT Rider/i);
  assert.match(readme, /NOT Followspot/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Quench/i);
  assert.match(readme, /#91161/);
  assert.match(readme, /#84159/);
  assert.match(readme, /#88345/);
  assert.match(readme, /#88659/);
  assert.match(readme, /#90591/);
  assert.match(readme, /does not exist|incomplete|\/models|per-model|non-JSON/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/necrology/);
  assert.match(readme, /node --test projects\/necrology\/necrology\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /necrology|parish|death.register|sexton/i);
  assert.match(readme, /Score necrology or admit attested/);
  assert.match(readme, /#93766|#93764|#93754|#93751|#93744|#93772|#93770/);
  assert.match(readme, /15:50/);
});

test("catalog features Necrology only; Innominate unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 309);
  assert.equal(hub.products.length, 309);
  assert.equal(catalog.products[0].name, "Necrology");
  assert.equal(catalog.products[0].slug, "necrology");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/necrology/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /15:50 necrology|#93774|parish necrology|death-register/i);
  assert.match(catalog.products[0].summary, /\battested\b/);
  assert.match(catalog.products[0].summary, /\bnecrologized\b/);
  assert.match(catalog.products[0].summary, /incomplete-listing/);
  assert.match(catalog.products[0].summary, /Score necrology or admit attested/);
  assert.equal(hub.products[0].slug, "necrology");
  assert.equal(hub.products[0].featured, true);
  const innominate = catalog.products.find((row) => row.slug === "innominate");
  assert.ok(innominate);
  assert.equal(innominate.featured, false);
  const snuffer = catalog.products.find((row) => row.slug === "snuffer");
  assert.ok(snuffer);
  assert.equal(snuffer.featured, false);
  const changeling = catalog.products.find((row) => row.slug === "changeling");
  assert.ok(changeling);
  assert.equal(changeling.featured, false);
  const homograph = catalog.products.find((row) => row.slug === "homograph");
  assert.ok(homograph);
  assert.equal(homograph.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "necrology").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93774") && row.slug !== "necrology"));
});

test("vercel rewrites necrology to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/necrology");
  assert.equal(vercel.rewrites[0].destination, "/projects/necrology");
  assert.equal(vercel.rewrites[1].source, "/necrology/");
  assert.equal(vercel.rewrites[1].destination, "/projects/necrology");
  assert.equal(vercel.rewrites[2].source, "/necrology/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/necrology/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
