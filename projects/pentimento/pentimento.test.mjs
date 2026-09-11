import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ATELIER_STATIONS,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_DESKTOP_VERSION,
  COMMIT_API,
  COUSINS,
  ELECTRON,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MODEL,
  NODE_VERSION,
  NOT_PRODUCTS,
  OS,
  OS_BUILD,
  PATH_WORD,
  PENTIMENTO_WALK,
  PHRASE,
  PLATFORM,
  PRODUCT_WORD,
  REPRO_FOLDER,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  SUCCESS_SHAPE,
  TITLE,
  VERDICTS,
  VERSION_A,
  VERSION_A_BYTES,
  VERSION_B,
  VERSION_B_BYTES,
  VERSION_C,
  VERSION_C_BYTES,
  WAIT_SECONDS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCommit,
  inspectCreate,
  inspectDisk,
  inspectLag,
  inspectMtime,
  readEasel,
  score,
  scoreGate,
  scoreWalk,
  seedCreateOk,
  seedFlushed,
  seedFreshMtime,
  seedHold,
  seedLagged,
  seedNotForce,
  seedNotOnedrive,
  seedNotReadCache,
  seedOneBehind,
  seedOverwrite,
  seedPentimento,
  seedRejectedEmpty,
  seedSecondCommit,
  seedStaleBytes,
  seedVersionA,
  seedVersionB,
  seedVersionC,
  seedWait45s,
  seedWorkaround,
  seedWriteEditClean,
  seedWrittenSuccess,
} from "./pentimento.mjs";

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
  return fileURLToPath(new URL("./pentimento.mjs", import.meta.url));
}

test("idle flushed is a hold; overwrite landed; disk bytes == committed payload; mtime honest", () => {
  const result = analyze(seedFlushed());
  assert.equal(result.verdict, "flushed");
  assert.equal(result.idleWord, "flushed");
  assert.equal(IDLE_WORD, "flushed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.flushed, true);
  assert.equal(result.phrase, "admit flushed");
  assert.equal(result.staleBytes, false);
  assert.equal(result.oneBehind, false);
  assert.equal(result.freshMtime, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify flushed", () => {
  assert.equal(classify(emptyTicket()), "flushed");
  assert.equal(classify(""), "flushed");
  assert.equal(classify(null), "flushed");
  assert.equal(decide({}), "flushed");
});

test("#93482 seeded path scores lagged when overwrite reports written with a fresh mtime and disk stays prior", () => {
  const result = analyze(seedLagged());
  assert.equal(result.verdict, "lagged");
  assert.equal(result.seededWord, "lagged");
  assert.equal(SEEDED_WORD, "lagged");
  assert.equal(PRODUCT_WORD, "pentimento");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lagged, true);
  assert.equal(result.phrase, "score pentimento");
  assert.equal(result.overwrite, true);
  assert.equal(result.staleBytes, true);
  assert.equal(result.freshMtime, true);
  assert.equal(result.written, true);
  assert.equal(result.oneBehind, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("overwrite plus stale bytes plus fresh mtime is the #93482 pentimento", () => {
  const disk = inspectDisk({
    overwrite: true,
    staleBytes: true,
    lagged: true,
    diskPayload: VERSION_A,
    diskBytes: VERSION_A_BYTES,
  });
  assert.equal(disk.stamp, "lagged");
  assert.equal(disk.prior, true);
  const scored = scoreGate({
    lagged: true,
    overwrite: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    oneBehind: true,
    cue: "lagged",
  });
  assert.equal(scored.verdict, "lagged");
  assert.equal(scored.oneBehind, true);
  const calm = inspectDisk({ flushed: true, diskCommitted: true });
  assert.equal(calm.stamp, "flushed");
});

test("path word is one-behind; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "one-behind");
  const result = analyze(seedOneBehind());
  assert.equal(result.verdict, "one-behind");
  assert.equal(result.pathWord, "one-behind");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "one-behind", preferSeed: true, lagged: true }),
    "one-behind",
  );
  assert.equal(classify(seedOverwrite()), "overwrite");
});

test("HOLD includes flushed / hold", () => {
  assert.ok(HOLD.includes("flushed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: overwrite, written-success, fresh-mtime, stale-bytes, version-b, wait-45s", () => {
  assert.equal(classify(seedOverwrite()), "overwrite");
  assert.equal(classify(seedCreateOk()), "create-ok");
  assert.equal(classify(seedWrittenSuccess()), "written-success");
  assert.equal(classify(seedRejectedEmpty()), "rejected-empty");
  assert.equal(classify(seedFreshMtime()), "fresh-mtime");
  assert.equal(classify(seedStaleBytes()), "stale-bytes");
  assert.equal(classify(seedVersionA()), "version-a");
  assert.equal(classify(seedVersionB()), "version-b");
  assert.equal(classify(seedVersionC()), "version-c");
  assert.equal(classify(seedSecondCommit()), "second-commit");
  assert.equal(classify(seedWait45s()), "wait-45s");
  assert.equal(classify(seedNotOnedrive()), "not-onedrive");
  assert.equal(classify(seedNotReadCache()), "not-read-cache");
  assert.equal(classify(seedNotForce()), "not-force");
  assert.equal(classify(seedWorkaround()), "workaround");
  assert.equal(classify(seedWriteEditClean()), "write-edit-clean");
  assert.equal(classify(seedPentimento()), "pentimento");
});

test("booth fixtures flip flushed vs lagged vs one-behind", () => {
  const idle = scoreGate(seedFlushed());
  const seeded = scoreGate(readData("lagged.json"));
  const flushed = readData("flushed.json");
  const lagged = readData("lagged.json");
  const path = readData("one-behind.json");
  const product = readData("pentimento.json");
  assert.equal(idle.verdict, "flushed");
  assert.equal(seeded.verdict, "lagged");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedFlushed()), "flushed");
  assert.equal(score(readData("lagged.json")), "lagged");
  assert.equal(flushed.diskCommitted, true);
  assert.equal(flushed.flushed, true);
  assert.equal(scoreGate(flushed).verdict, "flushed");
  assert.equal(lagged.diskBytes, VERSION_A_BYTES);
  assert.equal(lagged.committedBytes, VERSION_B_BYTES);
  assert.equal(lagged.overwrite, true);
  assert.equal(lagged.staleBytes, true);
  assert.equal(classify(lagged), "lagged");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /new file/);
  assert.match(path.paths[2].result, /one-behind/);
  assert.equal(classify(path), "one-behind");
  assert.equal(classify(product), "pentimento");
  assert.equal(lagged.issue, 93482);
  assert.equal(lagged.diskBytes, 43);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("flushed"));
  assert.ok(CHIPS.includes("lagged"));
  assert.ok(CHIPS.includes("pentimento"));
  assert.ok(CHIPS.includes("one-behind"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lagged"));
  assert.ok(ALARM.includes("one-behind"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published pentimento walk scores lagged after the idle hold", () => {
  const easel = scoreWalk({ rows: PENTIMENTO_WALK });
  assert.equal(easel.verdict, "lagged");
  assert.ok(easel.laggedCount >= 1);
  const idle = easel.rows.find((row) => row.event === "cue-flushed");
  assert.equal(idle.flushed, true);
  assert.equal(idle.verdict, "flushed");
  const create = easel.rows.find((row) => row.event === "create-ok");
  assert.equal(create.createOk, true);
  const overB = easel.rows.find((row) => row.event === "overwrite-b");
  assert.equal(overB.overwrite, true);
  assert.equal(overB.diskBytes, 43);
  assert.equal(overB.committedBytes, 82);
  const second = easel.rows.find((row) => row.event === "second-commit");
  assert.equal(second.secondCommit, true);
  const overC = easel.rows.find((row) => row.event === "overwrite-c");
  assert.equal(overC.diskBytes, 82);
  assert.equal(overC.committedBytes, 89);
  const wait = easel.rows.find((row) => row.event === "wait-45s");
  assert.equal(wait.wait45s, true);
  const path = easel.rows.find((row) => row.event === "one-behind");
  assert.equal(path.verdict, "one-behind");
});

test("PENTIMENTO_WALK constant matches the issue atelier walk", () => {
  assert.equal(PENTIMENTO_WALK[0].event, "cue-flushed");
  const overB = PENTIMENTO_WALK.find((row) => row.event === "overwrite-b");
  assert.equal(overB.staleBytes, true);
  const wait = PENTIMENTO_WALK.find((row) => row.event === "wait-45s");
  assert.equal(wait.wait45s, true);
  const path = PENTIMENTO_WALK.find((row) => row.event === "one-behind");
  assert.equal(path.lagged, true);
  const scoreRow = PENTIMENTO_WALK.find((row) => row.event === "pentimento");
  assert.equal(scoreRow.lagged, true);
});

test("issue constants encode only #93482 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93482);
  assert.ok(ISSUE_URL.includes("93482"));
  assert.match(TITLE, /lags exactly one commit behind/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.ok(LABELS.includes("data-loss"));
  assert.equal(AUTHOR, "GBalunis");
  assert.equal(FILED, "2026-09-10T22:02:35Z");
  assert.equal(CLAUDE_DESKTOP_VERSION, "1.49585.0");
  assert.equal(PLATFORM, "win32 x64");
  assert.equal(ELECTRON, "44.2.0");
  assert.equal(NODE_VERSION, "24.20.0");
  assert.equal(OS, "Windows 11 25H2");
  assert.equal(OS_BUILD, "26200.9445");
  assert.equal(SESSION_KIND, "Cowork cloud session linked to a desktop device");
  assert.equal(MODEL, "claude-opus-5");
  assert.equal(COMMIT_API, "device_commit_files");
  assert.match(SUCCESS_SHAPE, /written/);
  assert.equal(VERSION_A, "VERSION-A");
  assert.equal(VERSION_B, "VERSION-B");
  assert.equal(VERSION_C, "VERSION-C");
  assert.equal(VERSION_A_BYTES, 43);
  assert.equal(VERSION_B_BYTES, 82);
  assert.equal(VERSION_C_BYTES, 89);
  assert.equal(WAIT_SECONDS, 45);
  assert.match(REPRO_FOLDER, /Downloads/);
  assert.equal(ATELIER_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("one-behind"));
  assert.ok(FINGERPRINT_LINES.includes("lagged"));
  assert.match(PHRASE, /score pentimento or admit flushed/);
});

test("has-repro fingerprints encode the published overwrite lag window", () => {
  const result = handle(readData("lagged.json"));
  assert.equal(result.published.claudeDesktopVersion, "1.49585.0");
  assert.equal(result.published.author, "GBalunis");
  assert.equal(result.published.sessionKind, "Cowork cloud session linked to a desktop device");
  assert.equal(result.published.versionABytes, 43);
  assert.match(
    fingerprint(seedLagged()),
    /lagged\|op=overwrite\|written=yes\|mtime=fresh\|disk=prior\|lag=one-behind\|cue=lagged/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Vinculum and Cachet", () => {
  const required = [
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
    "matched",
    "skewed",
    "headers-hash",
    "counterfoil",
    "traced",
    "pathless",
    "image-cache",
    "lucida",
    "scrubbed",
    "contaminated",
    "fomite",
    "damped",
    "spinning",
    "mux",
    "snubber",
    "mounted",
    "fossed",
    "plan9",
    "fosse",
    "warm",
    "paged-out",
    "majflt",
    "hibernacle",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "sterling",
    "debased",
    "hallmark",
    "remanent",
    "collimated",
    "diopter",
    "hysteresis",
    "banked",
    "ephemera",
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "oubliette",
    "vernier",
    "procrustes",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("flushed easel flips lagged back when the overwrite lands", () => {
  const tape = {
    flushed: true,
    lagged: false,
    overwrite: true,
    diskCommitted: true,
    mtimeHonest: true,
    staleBytes: false,
    oneBehind: false,
    cue: "flushed",
  };
  assert.equal(scoreGate(tape).verdict, "flushed");
  tape.flushed = false;
  tape.lagged = true;
  tape.staleBytes = true;
  tape.freshMtime = true;
  tape.oneBehind = true;
  tape.cue = "lagged";
  assert.equal(scoreGate(tape).verdict, "lagged");
  tape.flushed = true;
  tape.lagged = false;
  tape.staleBytes = false;
  tape.freshMtime = false;
  tape.oneBehind = false;
  tape.diskCommitted = true;
  tape.cue = "flushed";
  assert.equal(scoreGate(tape).verdict, "flushed");
});

test("commit, disk, mtime, lag, and easel mark lagged after overwrite", () => {
  const idle = inspectCommit({ flushed: true, written: true, rejectedEmpty: true });
  assert.equal(idle.stamp, "flushed");
  assert.equal(idle.written, true);
  const commit = inspectCommit({
    overwrite: true,
    lagged: true,
    written: true,
    rejectedEmpty: true,
    staleBytes: true,
  });
  assert.equal(commit.stamp, "lagged");
  assert.equal(commit.written, true);
  const disk = inspectDisk({
    overwrite: true,
    staleBytes: true,
    lagged: true,
    diskBytes: 43,
  });
  assert.equal(disk.stamp, "lagged");
  assert.equal(disk.prior, true);
  const mtime = inspectMtime({
    overwrite: true,
    freshMtime: true,
    lagged: true,
    staleBytes: true,
  });
  assert.equal(mtime.stamp, "lagged");
  assert.equal(mtime.fresh, true);
  const lag = inspectLag({
    overwrite: true,
    oneBehind: true,
    lagged: true,
    staleBytes: true,
  });
  assert.equal(lag.stamp, "lagged");
  assert.equal(lag.oneBehind, true);
  const create = inspectCreate({
    createOk: true,
    create: true,
  });
  assert.equal(create.stamp, "flushed");
  assert.equal(create.create, true);
  const easel = readEasel({
    lagged: true,
    overwrite: true,
    staleBytes: true,
    freshMtime: true,
    written: true,
    oneBehind: true,
  });
  assert.equal(easel.lagged, true);
  assert.equal(easel.mark, "lagged");
  const calm = readEasel({
    flushed: true,
    lagged: false,
    diskCommitted: true,
    mtimeHonest: true,
    written: true,
  });
  assert.equal(calm.lagged, false);
  assert.equal(calm.mark, "flushed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 83354);
  assert.equal(COUSINS[1].issue, 79354);
  assert.equal(COUSINS[2].issue, 38993);
  assert.equal(COUSINS[3].issue, 40175);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("strobe"));
  assert.ok(NOT_PRODUCTS.includes("counterfoil"));
  assert.ok(NOT_PRODUCTS.includes("lucida"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("procrustes"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93458);
  assert.equal(BACKUPS[1].issue, 93475);
  assert.equal(BACKUPS[2].issue, 93439);
  assert.equal(BACKUPS[3].issue, 93438);
  assert.equal(BACKUPS[4].issue, 93466);
  assert.equal(BACKUPS[5].issue, 93495);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lagged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "flushed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "lagged");
});

test("handle exposes published hypothesis and #93482 headline", () => {
  const result = handle(readData("lagged.json"));
  assert.equal(result.published.issue, 93482);
  assert.equal(result.published.claudeDesktopVersion, "1.49585.0");
  assert.equal(result.published.author, "GBalunis");
  assert.deepEqual(result.published.cousins, [83354, 79354, 38993, 40175]);
  assert.ok(result.published.backups.includes(93458));
  assert.ok(result.published.backups.includes(93495));
  assert.ok(result.published.backups.includes(93466));
  assert.match(result.published.hypothesis, /buffer\/stage/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an art-conservation atelier, not a chain-forge or wax-cachet blotter", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /pentimento|underpaint|varnish|stretcher|atelier/i);
  assert.match(page, /#eadfcb|#6e4a28|#1e4d8c|#c9841a|#2a241c/);
  assert.match(page, /\bflushed\b/);
  assert.match(page, /lagged/);
  assert.match(page, /one-behind/);
  assert.match(page, /score pentimento or admit flushed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /10:50/);
  assert.match(page, /#282/);
  assert.match(page, /#93482/);
  assert.match(page, /GBalunis/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /device_commit_files/);
  assert.match(page, /VERSION-A/);
  assert.match(page, /VERSION-B/);
  assert.match(page, /mtime/);
  assert.match(page, /Lift the varnish/);
  assert.match(page, /Score pentimento/);
  assert.match(page, /Rake the underpaint/);
  assert.match(page, /Compare mtime \/ pigment/);
  assert.match(page, /Pin idle flushed/);
  assert.match(page, /Pin seeded lagged/);
  assert.match(page, /Pin one-behind/);
  assert.match(page, /Clear the easel/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Cormorant Infant/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Red Hat Mono/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Libre Franklin/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /#1a1f2a/);
  assert.doesNotMatch(page, /#b8956c/);
  assert.doesNotMatch(page, /#e8dfd0/);
  assert.doesNotMatch(page, /#5c0a1a/);
  assert.doesNotMatch(page, /#f3e6c8/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#0b1220/);
  assert.doesNotMatch(page, /#3de0ff/);
  assert.doesNotMatch(page, /#7c5cff/);
  assert.doesNotMatch(page, /#0d3b2e/);
  assert.doesNotMatch(page, /#f4efe6/);
  assert.doesNotMatch(page, /#f7f0e4/);
  assert.doesNotMatch(page, /#5c4d8a/);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge/i);
  assert.doesNotMatch(page, /\bsolitary\b/);
  assert.doesNotMatch(page, /\btwinlinked\b/);
  assert.doesNotMatch(page, /\bbridge-refuse\b/);
  assert.doesNotMatch(page, /\bflattened\b/);
  assert.doesNotMatch(page, /\bstring-carrier\b/);
  assert.doesNotMatch(page, /\bsteady\b/);
  assert.doesNotMatch(page, /\bstrobing\b/);
  assert.doesNotMatch(page, /\boff-label\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\bskewed\b/);
  assert.doesNotMatch(page, /\btraced\b/);
  assert.doesNotMatch(page, /\bpathless\b/);
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT Strobe/i);
  assert.match(page, /NOT Counterfoil/i);
  assert.match(page, /NOT Lucida/i);
  assert.match(page, /NOT Fomite/i);
  assert.match(page, /NOT Snubber/i);
  assert.match(page, /NOT Fosse/i);
  assert.match(page, /NOT Hibernacle/i);
  assert.match(page, /NOT Paraph/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Pentimento/);
  assert.match(readme, /#93482/);
  assert.match(readme, /\bflushed\b/);
  assert.match(readme, /lagged/);
  assert.match(readme, /one-behind/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Vinculum/i);
  assert.match(readme, /NOT Cachet/i);
  assert.match(readme, /NOT Strobe/i);
  assert.match(readme, /NOT Counterfoil/i);
  assert.match(readme, /NOT Lucida/i);
  assert.match(readme, /NOT Fomite/i);
  assert.match(readme, /NOT Snubber/i);
  assert.match(readme, /NOT Fosse/i);
  assert.match(readme, /NOT Hibernacle/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /1\.49585\.0/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/pentimento/);
  assert.match(readme, /node --test projects\/pentimento\/pentimento\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /buffer\/stage|underpainting/);
  assert.match(readme, /#83354/);
  assert.match(readme, /#79354/);
  assert.match(readme, /#38993/);
  assert.match(readme, /#40175/);
  assert.match(readme, /atelier|varnish|underpaint/i);
  assert.match(readme, /device_commit_files/);
});

test("catalog features Pentimento only; Vinculum and Cachet unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 282);
  assert.equal(hub.products.length, 282);
  assert.equal(catalog.products[0].name, "Pentimento");
  assert.equal(catalog.products[0].slug, "pentimento");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/pentimento/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /10:50/);
  assert.match(catalog.products[0].summary, /pentimento/);
  assert.match(catalog.products[0].summary, /#93482/);
  assert.match(catalog.products[0].summary, /\bflushed\b/);
  assert.match(catalog.products[0].summary, /lagged/);
  assert.match(catalog.products[0].summary, /one-behind/);
  assert.equal(hub.products[0].slug, "pentimento");
  assert.equal(hub.products[0].featured, true);
  const vinculum = catalog.products.find((row) => row.slug === "vinculum");
  assert.ok(vinculum);
  assert.equal(vinculum.featured, false);
  const cachet = catalog.products.find((row) => row.slug === "cachet");
  assert.ok(cachet);
  assert.equal(cachet.featured, false);
  const strobe = catalog.products.find((row) => row.slug === "strobe");
  assert.ok(strobe);
  assert.equal(strobe.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "pentimento").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93482") && row.slug !== "pentimento"));
});

test("vercel rewrites pentimento to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/pentimento");
  assert.equal(vercel.rewrites[0].destination, "/projects/pentimento");
  assert.equal(vercel.rewrites[1].source, "/pentimento/");
  assert.equal(vercel.rewrites[1].destination, "/projects/pentimento");
  assert.equal(vercel.rewrites[2].source, "/pentimento/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/pentimento/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
