import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CALL_COUNT,
  CHANGELING_PLAQUES,
  CHANGELING_WALK,
  CHIPS,
  COUSINS,
  DETECTION_FIELD,
  DISTRIBUTION,
  EVENT_NAME,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GLOBAL_DEFAULT,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOOP_API,
  NOT_PRODUCTS,
  OS_LABEL,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PLEDGED_MODEL,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  RUN_HOURS,
  SAMPLE_CRADLE,
  SAMPLE_LATCH,
  SAMPLE_LEDGER,
  SAMPLE_SWADDLING,
  SAMPLE_TOKEN,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  SURFACE,
  SWAPPED_MODEL,
  TITLE,
  TRANSCRIPT_PATH,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCradle,
  inspectLatch,
  inspectLedger,
  inspectSwaddling,
  inspectToken,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedChangeling,
  seedFableDefault,
  seedHold,
  seedHostResume,
  seedIdentityToken,
  seedInvisibleReinject,
  seedKeepChosen,
  seedLedgerLie,
  seedNotifyReset,
  seedOpusPledged,
  seedPledged,
  seedRemoteLatch,
  seedRemoteReattach,
  seedSetSessionNoop,
  seedSwapped,
  seedTranscriptOnly,
} from "./changeling.mjs";

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
  return fileURLToPath(new URL("./changeling.mjs", import.meta.url));
}

test("idle pledged is a hold; session keeps explicit /model choice", () => {
  const result = analyze(seedPledged());
  assert.equal(result.verdict, "pledged");
  assert.equal(result.idleWord, "pledged");
  assert.equal(IDLE_WORD, "pledged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pledged, true);
  assert.equal(result.phrase, "admit pledged");
  assert.equal(result.swapped, false);
  assert.equal(result.remoteReattach, false);
  assert.equal(result.keepChosen, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify pledged", () => {
  assert.equal(classify(emptyTicket()), "pledged");
  assert.equal(classify(""), "pledged");
  assert.equal(classify(null), "pledged");
  assert.equal(decide({}), "pledged");
});

test("#93757 seeded path scores changeling when the heir is swapped", () => {
  const result = analyze(seedSwapped());
  assert.equal(result.verdict, "changeling");
  assert.equal(result.seededWord, "swapped");
  assert.equal(SEEDED_WORD, "swapped");
  assert.equal(PRODUCT_WORD, "changeling");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.swapped, true);
  assert.equal(result.phrase, "score changeling");
  assert.equal(result.remoteLatch, true);
  assert.equal(result.invisibleReinject, true);
  assert.equal(result.ledgerLie, true);
  assert.equal(result.remoteReattach, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("remote latch plus invisible reinject is the #93757 changeling", () => {
  const cradle = inspectCradle({ swapped: true, remoteReattach: true });
  assert.equal(cradle.stamp, "cradle-swapped");
  assert.equal(cradle.swapped, true);
  const scored = scoreGate({
    swapped: true,
    remoteLatch: true,
    invisibleReinject: true,
    hostResume: true,
    remoteReattach: true,
    ledgerLie: true,
    fableDefault: true,
    identityToken: true,
    cue: "swapped",
    cradle: SAMPLE_CRADLE,
    ledger: SAMPLE_LEDGER,
  });
  assert.equal(scored.verdict, "changeling");
  assert.equal(scored.remoteReattach, true);
  const open = inspectCradle({ pledged: true, keepChosen: true });
  assert.equal(open.stamp, "cradle-pledged");
});

test("path word is remote-reattach; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "remote-reattach");
  const result = analyze(seedRemoteReattach());
  assert.equal(result.verdict, "remote-reattach");
  assert.equal(result.pathWord, "remote-reattach");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "remote-reattach", preferSeed: true, swapped: true }),
    "remote-reattach",
  );
  assert.equal(classify(seedInvisibleReinject()), "invisible-reinject");
});

test("HOLD includes pledged / hold", () => {
  assert.ok(HOLD.includes("pledged"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: remote-latch, invisible-reinject, ledger-lie, fable-default", () => {
  assert.equal(classify(seedRemoteLatch()), "remote-latch");
  assert.equal(classify(seedOpusPledged()), "opus-pledged");
  assert.equal(classify(seedHostResume()), "host-resume");
  assert.equal(classify(seedInvisibleReinject()), "invisible-reinject");
  assert.equal(classify(seedLedgerLie()), "ledger-lie");
  assert.equal(classify(seedFableDefault()), "fable-default");
  assert.equal(classify(seedIdentityToken()), "identity-token");
  assert.equal(classify(seedKeepChosen()), "keep-chosen");
  assert.equal(classify(seedNotifyReset()), "notify-reset");
  assert.equal(classify(seedSetSessionNoop()), "set-session-noop");
  assert.equal(classify(seedTranscriptOnly()), "transcript-only");
  assert.equal(classify(seedChangeling()), "changeling");
});

test("booth fixtures flip pledged vs swapped vs remote-reattach vs changeling", () => {
  const idle = scoreGate(seedPledged());
  const seeded = scoreGate(seedSwapped());
  const pledged = readData("pledged.json");
  const swapped = readData("swapped.json");
  const path = readData("remote-reattach.json");
  const product = readData("changeling.json");
  const reinject = readData("invisible-reinject.json");
  const ledger = readData("ledger-lie.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "pledged");
  assert.equal(seeded.verdict, "changeling");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedPledged()), "pledged");
  assert.equal(score(seedSwapped()), "changeling");
  assert.equal(pledged.keepChosen, true);
  assert.equal(pledged.pledged, true);
  assert.equal(scoreGate(pledged).verdict, "pledged");
  assert.equal(swapped.remoteLatch, true);
  assert.equal(swapped.invisibleReinject, true);
  assert.equal(swapped.ledgerLie, true);
  assert.equal(classify(swapped), "swapped");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /keep|\/model|explicit/i);
  assert.match(path.paths[1].result, /notification|Opus|picker/i);
  assert.equal(classify(path), "remote-reattach");
  assert.equal(classify(product), "changeling");
  assert.equal(product.hubCount, "CHANGELING");
  assert.equal(swapped.issue, 93757);
  assert.equal(swapped.swapped, true);
  assert.equal(classify(reinject), "invisible-reinject");
  assert.equal(classify(ledger), "ledger-lie");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("pledged"));
  assert.ok(CHIPS.includes("swapped"));
  assert.ok(CHIPS.includes("changeling"));
  assert.ok(CHIPS.includes("remote-reattach"));
  assert.ok(CHIPS.includes("invisible-reinject"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("swapped"));
  assert.ok(ALARM.includes("remote-reattach"));
  assert.ok(ALARM.includes("invisible-reinject"));
  assert.ok(ALARM.includes("changeling"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published changeling walk scores changeling after the idle hold", () => {
  const booth = scoreWalk({ rows: CHANGELING_WALK });
  assert.equal(booth.verdict, "changeling");
  assert.ok(booth.swappedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-pledged");
  assert.equal(idle.pledged, true);
  assert.equal(idle.verdict, "pledged");
  const latch = booth.rows.find((row) => row.event === "remote-latch");
  assert.equal(latch.remoteLatch, true);
  const path = booth.rows.find((row) => row.event === "remote-reattach" && row.t === "path");
  assert.equal(path.verdict, "remote-reattach");
});

test("CHANGELING_WALK constant matches the issue cradle-swap walk", () => {
  assert.equal(CHANGELING_WALK[0].event, "cue-pledged");
  const latch = CHANGELING_WALK.find((row) => row.event === "remote-latch");
  assert.equal(latch.remoteLatch, true);
  const path = CHANGELING_WALK.find((row) => row.t === "path");
  assert.equal(path.swapped, true);
  const scoreRow = CHANGELING_WALK.find((row) => row.event === "changeling");
  assert.equal(scoreRow.swapped, true);
});

test("positive control keep-chosen stays pledged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "pledged");
  const ok = walk.rows.find((row) => row.event === "keep-chosen");
  assert.equal(ok.verdict, "pledged");
  const hold = walk.rows.find((row) => row.event === "cue-pledged");
  assert.equal(hold.pledged, true);
  assert.equal(hold.verdict, "pledged");
});

test("issue constants encode only #93757 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93757);
  assert.ok(ISSUE_URL.includes("93757"));
  assert.match(TITLE, /reconnect/i);
  assert.match(TITLE, /\/model/);
  assert.match(TITLE, /global default/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:cost"));
  assert.ok(LABELS.includes("area:model"));
  assert.equal(PLATFORM, "windows");
  assert.equal(PLEDGED_MODEL, "claude-opus-5");
  assert.equal(SWAPPED_MODEL, "claude-fable-5-1");
  assert.equal(GLOBAL_DEFAULT, "fable[1m]");
  assert.equal(CALL_COUNT, 293);
  assert.equal(RUN_HOURS, 16);
  assert.equal(EVENT_NAME, "remote_session_change");
  assert.equal(NOOP_API, "set_session_model");
  assert.equal(TRANSCRIPT_PATH, "~/.claude/projects/**/*.jsonl");
  assert.equal(DETECTION_FIELD, "message.model");
  assert.match(OS_LABEL, /Windows 11/);
  assert.match(SURFACE, /desktop|Code tab|1\.52386/);
  assert.equal(CHANGELING_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /picker|set_session_model|notification|metadata/i.test(row)));
  assert.ok(EXPECTED.some((row) => /keep|notify|remote_session_change/i.test(row)));
  assert.match(DISTRIBUTION, /293|claude-fable-5-1|claude-opus-5|remote_session_change/);
  assert.match(SESSION_KIND, /opus-5|fable|remote control/);
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("remote-reattach"));
  assert.ok(FINGERPRINT_LINES.includes("swapped"));
  assert.match(PHRASE, /Score changeling or admit pledged/);
  assert.equal(SAMPLE_CRADLE.swapped, true);
  assert.equal(SAMPLE_LEDGER.lies, true);
  assert.equal(SAMPLE_SWADDLING.lookalike, true);
  assert.equal(SAMPLE_LATCH.remoteAttach, true);
  assert.equal(SAMPLE_TOKEN.reinjected, true);
});

test("has-repro fingerprints encode the published swapped changeling", () => {
  const result = handle(seedSwapped());
  assert.equal(result.published.platform, "windows");
  assert.match(result.published.sessionKind, /opus-5|fable/);
  assert.equal(result.published.pledgedModel, PLEDGED_MODEL);
  assert.match(
    fingerprint(seedSwapped()),
    /changeling\|heir=swapped\|ledger=lie\|token=reinjected\|latch=remote\|path=remote-reattach\|cue=remote-reattach/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Homograph and Galley", () => {
  const required = [
    "distinct",
    "collided",
    "lossy-slug",
    "homograph",
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
    "lit",
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("pledged booth flips swapped back when the heir stays in the cradle", () => {
  const tape = {
    pledged: true,
    swapped: false,
    keepChosen: true,
    cue: "pledged",
  };
  assert.equal(scoreGate(tape).verdict, "pledged");
  tape.pledged = false;
  tape.swapped = true;
  tape.remoteLatch = true;
  tape.invisibleReinject = true;
  tape.ledgerLie = true;
  tape.cue = "swapped";
  assert.equal(scoreGate(tape).verdict, "changeling");
  tape.pledged = true;
  tape.swapped = false;
  tape.remoteLatch = false;
  tape.invisibleReinject = false;
  tape.ledgerLie = false;
  tape.cue = "pledged";
  assert.equal(scoreGate(tape).verdict, "pledged");
});

test("cradle, ledger, swaddling, latch, token, and readBooth mark the swapped changeling", () => {
  const idle = inspectCradle({
    pledged: true,
    keepChosen: true,
    cradle: { pledged: PLEDGED_MODEL, running: PLEDGED_MODEL, swapped: false },
  });
  assert.equal(idle.stamp, "cradle-pledged");
  const ledger = inspectLedger({ swapped: true, ledger: SAMPLE_LEDGER });
  assert.equal(ledger.stamp, "ledger-lies");
  assert.equal(ledger.lies, true);
  const cloth = inspectSwaddling({
    lookalike: true,
    swaddling: SAMPLE_SWADDLING,
  });
  assert.equal(cloth.stamp, "swaddling-swapped");
  const latch = inspectLatch({ swapped: true, remoteLatch: true });
  assert.equal(latch.stamp, "latch-thrown");
  const token = inspectToken({ swapped: true, invisibleReinject: true });
  assert.equal(token.stamp, "token-reinjected");
  const booth = readBooth({
    swapped: true,
    remoteLatch: true,
    invisibleReinject: true,
    cradle: SAMPLE_CRADLE,
    ledger: SAMPLE_LEDGER,
  });
  assert.equal(booth.swapped, true);
  assert.equal(booth.mark, "swapped");
  const open = readBooth({
    pledged: true,
    swapped: false,
    keepChosen: true,
  });
  assert.equal(open.swapped, false);
  assert.equal(open.mark, "pledged");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 82466);
  assert.equal(COUSINS[1].issue, 78654);
  assert.equal(COUSINS[2].issue, 87334);
  assert.equal(COUSINS[3].issue, 93154);
  assert.equal(COUSINS[4].issue, 92235);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /82466|settings\.json|\/model|rebuild/i);
  assert.match(COUSINS[1].why, /78654|session scope|persist/i);
  assert.match(COUSINS[2].why, /87334|1m|picker/i);
  assert.match(COUSINS[3].why, /93154|SSH|reconnect/i);
  assert.match(COUSINS[4].why, /92235|mobile|duplicate/i);
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
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("homonym"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93746);
  assert.equal(BACKUPS[1].issue, 93744);
  assert.equal(BACKUPS[2].issue, 93722);
  assert.equal(BACKUPS[3].issue, 93672);
  assert.equal(BACKUPS[4].issue, 93652);
  assert.equal(BACKUPS[5].issue, 93680);
  assert.equal(BACKUPS[6].issue, 93618);
  assert.equal(BACKUPS[7].issue, 93694);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /enableArtifact|scratchpad/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/swapped.json", import.meta.url))],
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
  assert.equal(JSON.parse(idle.stdout).verdict, "pledged");
  assert.equal(JSON.parse(seeded.stdout).verdict, "swapped");
  assert.equal(JSON.parse(pledgedFix.stdout).verdict, "pledged");
});

test("handle exposes published hypothesis and #93757 headline", () => {
  const result = handle(seedSwapped());
  assert.equal(result.published.issue, 93757);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [82466, 78654, 87334, 93154, 92235]);
  assert.ok(result.published.backups.includes(93746));
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93672));
  assert.ok(!result.published.backups.includes(93757));
  assert.match(result.published.hypothesis, /remote_session_change|\/model|notify/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93757/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a fairy-court cradle-swap booth, not homograph or galley", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Lexend/);
  assert.match(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.match(page, /changeling|cradle|fairy|pledged heir|court ledger/i);
  assert.match(page, /#1B2A24|#E8E2D4|#C6A15B|#5C4A7A|#2E2E2E/i);
  assert.match(page, /\bpledged\b/);
  assert.match(page, /\bswapped\b/);
  assert.match(page, /remote-reattach/);
  assert.match(page, /Score changeling or admit pledged/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#306/);
  assert.match(page, /#93757/);
  assert.match(page, /Keep the heir pledged/);
  assert.match(page, /Score changeling/);
  assert.match(page, /Walk the cradle-swap/);
  assert.match(page, /Compare pledged \/ swapped/);
  assert.match(page, /Pin idle pledged/);
  assert.match(page, /Pin seeded swapped/);
  assert.match(page, /Pin remote-reattach/);
  assert.match(page, /Hold the pledged/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#EFE6D2/);
  assert.doesNotMatch(page, /#1A2748/);
  assert.doesNotMatch(page, /#C94A32/);
  assert.doesNotMatch(page, /#DDD6C8/);
  assert.doesNotMatch(page, /#141210/);
  assert.doesNotMatch(page, /#C2301A/);
  assert.doesNotMatch(page, /#A67C3D/);
  assert.doesNotMatch(page, /#221F1B/);
  assert.doesNotMatch(page, /#3E4A42/);
  assert.doesNotMatch(page, /#F4EBD0/);
  assert.doesNotMatch(page, /#8B2E2E/);
  assert.doesNotMatch(page, /#F4EFE4/);
  assert.doesNotMatch(page, /#9B2D2D/);
  assert.doesNotMatch(page, /#2B2F36/);
  assert.doesNotMatch(page, /lemma slip|headword|lexicographer|shelf mark|orphan quire/i);
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
  assert.doesNotMatch(page, /\blit\b/);
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
  assert.match(page, /NOT Anachronism/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Changeling/);
  assert.match(readme, /#93757/);
  assert.match(readme, /\bpledged\b/);
  assert.match(readme, /\bswapped\b/);
  assert.match(readme, /remote-reattach/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Lexend/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /#82466/);
  assert.match(readme, /#78654/);
  assert.match(readme, /#87334/);
  assert.match(readme, /#93154/);
  assert.match(readme, /#92235/);
  assert.match(readme, /293|claude-fable-5-1|claude-opus-5|remote_session_change/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/changeling/);
  assert.match(readme, /node --test projects\/changeling\/changeling\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /fairy-court|cradle-swap|pledged heir|court ledger/i);
  assert.match(readme, /Score changeling or admit pledged/);
  assert.match(readme, /#93746|#93744|#93722|#93672|#93652|#93680|#93618|#93694/);
  assert.doesNotMatch(readme, /#93743/);
});

test("catalog features Changeling only; Homograph unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 306);
  assert.equal(hub.products.length, 306);
  assert.equal(catalog.products[0].name, "Changeling");
  assert.equal(catalog.products[0].slug, "changeling");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/changeling/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /changeling|#93757|fairy-court|cradle-swap/i);
  assert.match(catalog.products[0].summary, /\bpledged\b/);
  assert.match(catalog.products[0].summary, /\bswapped\b/);
  assert.match(catalog.products[0].summary, /remote-reattach/);
  assert.match(catalog.products[0].summary, /Score changeling or admit pledged/);
  assert.equal(hub.products[0].slug, "changeling");
  assert.equal(hub.products[0].featured, true);
  const homograph = catalog.products.find((row) => row.slug === "homograph");
  assert.ok(homograph);
  assert.equal(homograph.featured, false);
  const galley = catalog.products.find((row) => row.slug === "galley");
  assert.ok(galley);
  assert.equal(galley.featured, false);
  const rescript = catalog.products.find((row) => row.slug === "rescript");
  assert.ok(rescript);
  assert.equal(rescript.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "changeling").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93757") && row.slug !== "changeling"));
});

test("vercel rewrites changeling to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/changeling");
  assert.equal(vercel.rewrites[0].destination, "/projects/changeling");
  assert.equal(vercel.rewrites[1].source, "/changeling/");
  assert.equal(vercel.rewrites[1].destination, "/projects/changeling");
  assert.equal(vercel.rewrites[2].source, "/changeling/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/changeling/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
