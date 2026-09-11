import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ANACHRONISM_WALK,
  BACKUPS,
  BOOTH_STATIONS,
  BRANCH_NAME,
  CHIPS,
  CHECKOUT_CMD,
  COUSINS,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORCE_B_CMD,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NEW_TIP,
  NOT_PRODUCTS,
  OLD_TIP,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PREWARM_CLOCK,
  PRODUCT_WORD,
  REFLOG_GAP_MINUTES,
  RESET_HARD_CMD,
  SAMPLE_CHECKOUT,
  SAMPLE_CHRONOMETER,
  SAMPLE_REFLOG,
  SAMPLE_REMOTE,
  SAMPLE_SLATE,
  SEEDED_WORD,
  SESSION_CLOCK,
  SESSION_KIND,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCheckout,
  inspectChronometer,
  inspectReflog,
  inspectRemote,
  inspectSlate,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAnachronism,
  seedCheckoutLocal,
  seedDetachedFetch,
  seedFetchTip,
  seedForceB,
  seedHold,
  seedHookMiss,
  seedNeverRewrite,
  seedNewTip,
  seedOldTip,
  seedOneBehind,
  seedPrewarmBranch,
  seedPrewarmLatch,
  seedReflogGap,
  seedRemoteRewrite,
  seedResetHard,
  seedSessionstartStale,
  seedSilentDrop,
  seedStale,
  seedStatusLie,
  seedTip,
  seedWebSession,
} from "./anachronism.mjs";

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
  return fileURLToPath(new URL("./anachronism.mjs", import.meta.url));
}

test("idle tip is a hold; HEAD at remote tip; checkout -B onto FETCH_HEAD", () => {
  const result = analyze(seedTip());
  assert.equal(result.verdict, "tip");
  assert.equal(result.idleWord, "tip");
  assert.equal(IDLE_WORD, "tip");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.tip, true);
  assert.equal(result.phrase, "admit tip");
  assert.equal(result.stale, false);
  assert.equal(result.prewarmLatch, false);
  assert.equal(result.forceB, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify tip", () => {
  assert.equal(classify(emptyTicket()), "tip");
  assert.equal(classify(""), "tip");
  assert.equal(classify(null), "tip");
  assert.equal(decide({}), "tip");
});

test("#93585 seeded path scores stale when pre-warm local wins after fetch", () => {
  const result = analyze(seedStale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.seededWord, "stale");
  assert.equal(SEEDED_WORD, "stale");
  assert.equal(PRODUCT_WORD, "anachronism");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.stale, true);
  assert.equal(result.phrase, "score anachronism");
  assert.equal(result.checkoutLocal, true);
  assert.equal(result.remoteRewrite, true);
  assert.equal(result.sessionStartStale, true);
  assert.equal(result.prewarmLatch, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("checkout local plus remote rewrite is the #93585 anachronism", () => {
  const slate = inspectSlate({ stale: true, checkoutLocal: true });
  assert.equal(slate.stamp, "wrong-take");
  assert.equal(slate.honest, false);
  const scored = scoreGate({
    stale: true,
    checkoutLocal: true,
    remoteRewrite: true,
    sessionStartStale: true,
    prewarmLatch: true,
    cue: "stale",
    slate: SAMPLE_SLATE,
    checkout: SAMPLE_CHECKOUT,
  });
  assert.equal(scored.verdict, "stale");
  assert.equal(scored.prewarmLatch, true);
  const calm = inspectSlate({ tip: true, forceB: true });
  assert.equal(calm.stamp, "tip");
});

test("path word is prewarm-latch; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "prewarm-latch");
  const result = analyze(seedPrewarmLatch());
  assert.equal(result.verdict, "prewarm-latch");
  assert.equal(result.pathWord, "prewarm-latch");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "prewarm-latch", preferSeed: true, stale: true }),
    "prewarm-latch",
  );
  assert.equal(classify(seedCheckoutLocal()), "checkout-local");
});

test("HOLD includes tip / hold", () => {
  assert.ok(HOLD.includes("tip"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: fetch-tip, checkout-local, remote-rewrite, sessionstart-stale", () => {
  assert.equal(classify(seedFetchTip()), "fetch-tip");
  assert.equal(classify(seedCheckoutLocal()), "checkout-local");
  assert.equal(classify(seedRemoteRewrite()), "remote-rewrite");
  assert.equal(classify(seedSessionstartStale()), "sessionstart-stale");
  assert.equal(classify(seedReflogGap()), "reflog-gap");
  assert.equal(classify(seedStatusLie()), "status-lie");
  assert.equal(classify(seedForceB()), "force-B");
  assert.equal(classify(seedDetachedFetch()), "detached-fetch");
  assert.equal(classify(seedPrewarmBranch()), "prewarm-branch");
  assert.equal(classify(seedOldTip()), "old-tip");
  assert.equal(classify(seedNewTip()), "new-tip");
  assert.equal(classify(seedHookMiss()), "hook-miss");
  assert.equal(classify(seedSilentDrop()), "silent-drop");
  assert.equal(classify(seedResetHard()), "reset-hard");
  assert.equal(classify(seedNeverRewrite()), "never-rewrite");
  assert.equal(classify(seedOneBehind()), "one-behind");
  assert.equal(classify(seedWebSession()), "web-session");
  assert.equal(classify(seedAnachronism()), "anachronism");
});

test("booth fixtures flip tip vs stale vs prewarm-latch vs anachronism", () => {
  const idle = scoreGate(seedTip());
  const seeded = scoreGate(readData("stale.json"));
  const tip = readData("tip.json");
  const stale = readData("stale.json");
  const path = readData("prewarm-latch.json");
  const product = readData("anachronism.json");
  const fetch = readData("fetch-tip.json");
  const checkout = readData("checkout-local.json");
  const rewrite = readData("remote-rewrite.json");
  const hooks = readData("sessionstart-stale.json");
  const gap = readData("reflog-gap.json");
  const lie = readData("status-lie.json");
  const force = readData("force-B.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "tip");
  assert.equal(seeded.verdict, "stale");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedTip()), "tip");
  assert.equal(score(readData("stale.json")), "stale");
  assert.equal(tip.forceB, true);
  assert.equal(tip.tip, true);
  assert.equal(scoreGate(tip).verdict, "tip");
  assert.equal(stale.checkoutLocal, true);
  assert.equal(stale.remoteRewrite, true);
  assert.equal(stale.sessionStartStale, true);
  assert.equal(classify(stale), "stale");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /pre-warm/);
  assert.match(path.paths[1].result, /old sha|rewritten/i);
  assert.equal(classify(path), "prewarm-latch");
  assert.equal(classify(product), "anachronism");
  assert.equal(product.hubCount, "ANACHRONISM");
  assert.equal(stale.issue, 93585);
  assert.equal(stale.stale, true);
  assert.equal(classify(fetch), "fetch-tip");
  assert.equal(classify(checkout), "checkout-local");
  assert.equal(classify(rewrite), "remote-rewrite");
  assert.equal(classify(hooks), "sessionstart-stale");
  assert.equal(classify(gap), "reflog-gap");
  assert.equal(classify(lie), "status-lie");
  assert.equal(classify(force), "force-B");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("tip"));
  assert.ok(CHIPS.includes("stale"));
  assert.ok(CHIPS.includes("anachronism"));
  assert.ok(CHIPS.includes("prewarm-latch"));
  assert.ok(CHIPS.includes("checkout-local"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("stale"));
  assert.ok(ALARM.includes("prewarm-latch"));
  assert.ok(ALARM.includes("checkout-local"));
  assert.ok(ALARM.includes("anachronism"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published anachronism walk scores stale after the idle hold", () => {
  const booth = scoreWalk({ rows: ANACHRONISM_WALK });
  assert.equal(booth.verdict, "stale");
  assert.ok(booth.staleCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-tip");
  assert.equal(idle.tip, true);
  assert.equal(idle.verdict, "tip");
  const checkout = booth.rows.find((row) => row.event === "checkout-local");
  assert.equal(checkout.checkoutLocal, true);
  const path = booth.rows.find((row) => row.event === "prewarm-latch");
  assert.equal(path.verdict, "prewarm-latch");
});

test("ANACHRONISM_WALK constant matches the issue continuity walk", () => {
  assert.equal(ANACHRONISM_WALK[0].event, "cue-tip");
  const checkout = ANACHRONISM_WALK.find((row) => row.event === "checkout-local");
  assert.equal(checkout.checkoutLocal, true);
  const path = ANACHRONISM_WALK.find((row) => row.event === "prewarm-latch");
  assert.equal(path.stale, true);
  const scoreRow = ANACHRONISM_WALK.find((row) => row.event === "anachronism");
  assert.equal(scoreRow.stale, true);
});

test("positive control force-B stays tip", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "tip");
  const force = walk.rows.find((row) => row.event === "force-B");
  assert.equal(force.verdict, "tip");
  const hold = walk.rows.find((row) => row.event === "cue-tip");
  assert.equal(hold.neverRewrite, true);
  assert.equal(hold.verdict, "tip");
});

test("issue constants encode only #93585 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93585);
  assert.ok(ISSUE_URL.includes("93585"));
  assert.match(TITLE, /stale local branch/i);
  assert.match(TITLE, /pre-warm/);
  assert.match(TITLE, /session start/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:claude-code-web"));
  assert.ok(LABELS.includes("platform:web"));
  assert.equal(PREWARM_CLOCK, "09:03");
  assert.equal(SESSION_CLOCK, "09:12");
  assert.equal(REFLOG_GAP_MINUTES, 9);
  assert.equal(OLD_TIP, "9a03c01d");
  assert.equal(NEW_TIP, "0912f37c");
  assert.equal(BRANCH_NAME, "named-branch");
  assert.match(CHECKOUT_CMD, /git checkout named-branch/);
  assert.match(FORCE_B_CMD, /checkout -B/);
  assert.match(RESET_HARD_CMD, /reset --hard/);
  assert.match(DISTRIBUTION, /pre-warm/);
  assert.match(SESSION_KIND, /09:03/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("prewarm-latch"));
  assert.ok(FINGERPRINT_LINES.includes("stale"));
  assert.match(PHRASE, /Score anachronism or admit tip/);
  assert.equal(SAMPLE_SLATE.honest, false);
  assert.equal(SAMPLE_CHRONOMETER.gapMinutes, 9);
  assert.equal(SAMPLE_CHECKOUT.resolvedLocal, true);
  assert.equal(SAMPLE_REMOTE.rewritten, true);
  assert.equal(SAMPLE_REFLOG.length, 4);
  assert.equal(SAMPLE_REFLOG[0].clock, "09:03");
  assert.equal(SAMPLE_REFLOG[1].sha, NEW_TIP);
  assert.equal(SAMPLE_REFLOG[2].sha, OLD_TIP);
});

test("has-repro fingerprints encode the published pre-warm latch", () => {
  const result = handle(readData("stale.json"));
  assert.equal(result.published.prewarmClock, "09:03");
  assert.match(result.published.sessionKind, /detached/);
  assert.equal(result.published.reflogGapMinutes, 9);
  assert.match(
    fingerprint(seedStale()),
    /stale\|slate=wrong-take\|chrono=gap\|checkout=local\|remote=rewritten\|hooks=stale\|path=prewarm-latch\|cue=prewarm-latch/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Nullarbor and Petard", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("tip booth flips stale back when checkout -B holds", () => {
  const tape = {
    tip: true,
    stale: false,
    forceB: true,
    neverRewrite: true,
    cue: "tip",
  };
  assert.equal(scoreGate(tape).verdict, "tip");
  tape.tip = false;
  tape.stale = true;
  tape.checkoutLocal = true;
  tape.remoteRewrite = true;
  tape.sessionStartStale = true;
  tape.cue = "stale";
  assert.equal(scoreGate(tape).verdict, "stale");
  tape.tip = true;
  tape.stale = false;
  tape.checkoutLocal = false;
  tape.remoteRewrite = false;
  tape.sessionStartStale = false;
  tape.cue = "tip";
  assert.equal(scoreGate(tape).verdict, "tip");
});

test("slate, chronometer, checkout, remote, reflog, and readBooth mark the latch", () => {
  const idle = inspectSlate({ tip: true, forceB: true, slate: { fetched: true, clapped: "fetched-tip", rolled: "fetched-tip", honest: true } });
  assert.equal(idle.stamp, "tip");
  const chrono = inspectChronometer({ stale: true, chronometer: SAMPLE_CHRONOMETER });
  assert.equal(chrono.stamp, "gap");
  assert.equal(chrono.gapMinutes, 9);
  const checkout = inspectCheckout({ checkoutLocal: true, checkout: SAMPLE_CHECKOUT });
  assert.equal(checkout.stamp, "local");
  const remote = inspectRemote({ stale: true, remoteRewrite: true, remote: SAMPLE_REMOTE });
  assert.equal(remote.stamp, "rewritten");
  assert.equal(remote.statusLie, true);
  const reflog = inspectReflog({ stale: true, reflogGap: true });
  assert.equal(reflog.stamp, "gap");
  const booth = readBooth({
    stale: true,
    checkoutLocal: true,
    remoteRewrite: true,
    sessionStartStale: true,
    slate: SAMPLE_SLATE,
    checkout: SAMPLE_CHECKOUT,
  });
  assert.equal(booth.stale, true);
  assert.equal(booth.mark, "stale");
  const calm = readBooth({
    tip: true,
    stale: false,
    forceB: true,
    neverRewrite: true,
  });
  assert.equal(calm.stale, false);
  assert.equal(calm.mark, "tip");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 82364);
  assert.equal(COUSINS[1].issue, 53025);
  assert.equal(COUSINS[2].issue, 70843);
  assert.equal(COUSINS[3].issue, 73725);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /EnterWorktree/);
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("aposiopesis"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("analepsis"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93624);
  assert.equal(BACKUPS[1].issue, 93615);
  assert.equal(BACKUPS[2].issue, 93570);
  assert.equal(BACKUPS[3].issue, 93589);
  assert.equal(BACKUPS[4].issue, 93618);
  assert.equal(BACKUPS[5].issue, 93622);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /Timeslip/);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/stale.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "tip");
  assert.equal(JSON.parse(seeded.stdout).verdict, "stale");
});

test("handle exposes published hypothesis and #93585 headline", () => {
  const result = handle(readData("stale.json"));
  assert.equal(result.published.issue, 93585);
  assert.equal(result.published.prewarmClock, "09:03");
  assert.deepEqual(result.published.cousins, [82364, 53025, 70843, 73725]);
  assert.ok(result.published.backups.includes(93624));
  assert.ok(result.published.backups.includes(93570));
  assert.ok(result.published.backups.includes(93622));
  assert.match(result.published.hypothesis, /checkout -B/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /FETCH_HEAD/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a continuity slate / chronometer booth, not saltbush or siege", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Figtree/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /anachronism|continuity slate|chronometer|sprocket|reflog strip|pre-warm/i);
  assert.match(page, /#12100E|#1C1A17|#E8E0D0|#C4A35A|#B83A3A|#3A8F7A|#6B6560|#E0A040/i);
  assert.match(page, /\btip\b/);
  assert.match(page, /\bstale\b/);
  assert.match(page, /prewarm-latch/);
  assert.match(page, /Score anachronism or admit tip/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /00:50/);
  assert.match(page, /#295/);
  assert.match(page, /#93585/);
  assert.match(page, /09:03/);
  assert.match(page, /09:12/);
  assert.match(page, /Mark the slate/);
  assert.match(page, /Score anachronism/);
  assert.match(page, /Roll the pre-warm take/);
  assert.match(page, /Compare tip \/ stale/);
  assert.match(page, /Pin idle tip/);
  assert.match(page, /Pin seeded stale/);
  assert.match(page, /Pin prewarm-latch/);
  assert.match(page, /Hold the tip/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /\bHind\b/);
  assert.doesNotMatch(page, /Fira Mono|Fira\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Exo 2|Exo\+2/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /#1A1F18/);
  assert.doesNotMatch(page, /#C4A574/);
  assert.doesNotMatch(page, /#E8E4D9/);
  assert.doesNotMatch(page, /#2C3E50/);
  assert.doesNotMatch(page, /#0B0F14/);
  assert.doesNotMatch(page, /#E85D04/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#9B1D20/);
  assert.doesNotMatch(page, /#F7F1E6/);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /manuscript speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /\bstamped\b/);
  assert.doesNotMatch(page, /\bemptied\b/);
  assert.doesNotMatch(page, /empty-expand/);
  assert.doesNotMatch(page, /\bstanding\b/);
  assert.doesNotMatch(page, /\bhoisted\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfurled\b/);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Aposiopesis/i);
  assert.match(page, /NOT Disseisin/i);
  assert.match(page, /NOT Analepsis/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Anachronism/);
  assert.match(readme, /#93585/);
  assert.match(readme, /\btip\b/);
  assert.match(readme, /\bstale\b/);
  assert.match(readme, /prewarm-latch/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Aposiopesis/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /NOT Analepsis/i);
  assert.match(readme, /#82364/);
  assert.match(readme, /09:03/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/anachronism/);
  assert.match(readme, /node --test projects\/anachronism\/anachronism\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /continuity slate|chronometer|sprocket|reflog strip|pre-warm/i);
  assert.match(readme, /FETCH_HEAD/);
  assert.match(readme, /Score anachronism or admit tip/);
});

test("catalog features Anachronism only; Nullarbor unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 295);
  assert.equal(hub.products.length, 295);
  assert.equal(catalog.products[0].name, "Anachronism");
  assert.equal(catalog.products[0].slug, "anachronism");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/anachronism/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /00:50/);
  assert.match(catalog.products[0].summary, /anachronism/);
  assert.match(catalog.products[0].summary, /#93585/);
  assert.match(catalog.products[0].summary, /\btip\b/);
  assert.match(catalog.products[0].summary, /\bstale\b/);
  assert.match(catalog.products[0].summary, /prewarm-latch/);
  assert.equal(hub.products[0].slug, "anachronism");
  assert.equal(hub.products[0].featured, true);
  const nullarbor = catalog.products.find((row) => row.slug === "nullarbor");
  assert.ok(nullarbor);
  assert.equal(nullarbor.featured, false);
  const petard = catalog.products.find((row) => row.slug === "petard");
  assert.ok(petard);
  assert.equal(petard.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "anachronism").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93585") && row.slug !== "anachronism"));
});

test("vercel rewrites anachronism to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/anachronism");
  assert.equal(vercel.rewrites[0].destination, "/projects/anachronism");
  assert.equal(vercel.rewrites[1].source, "/anachronism/");
  assert.equal(vercel.rewrites[1].destination, "/projects/anachronism");
  assert.equal(vercel.rewrites[2].source, "/anachronism/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/anachronism/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
