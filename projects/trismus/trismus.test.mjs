import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ADD_API,
  ADDON,
  ALARM,
  BACKUPS,
  BEACHBALL,
  BOOTH_STATIONS,
  CHIPS,
  CLOSE_API,
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
  ISSUE_URL,
  LABELS,
  NOT_BASH_DEADLOCK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REMOVE_PENDING,
  RULED_OUT,
  SAMPLE_TRISMUS_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  TRISMUS_WALK,
  VERDICTS,
  XPC_QUEUE,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAdd,
  inspectMain,
  inspectXpc,
  mapChair,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCodeTabTerminalDone,
  seedHold,
  seedLimber,
  seedMainBlocked,
  seedNotifXpcDeadlock,
  seedProduct,
  seedTrismus,
  seedXpcClose,
} from "./trismus.mjs";

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
  return fileURLToPath(new URL("./trismus.mjs", import.meta.url));
}

test("idle limber is a hold; main thread free; jaw opens", () => {
  const result = analyze(seedLimber());
  assert.equal(result.verdict, "limber");
  assert.equal(result.idleWord, "limber");
  assert.equal(IDLE_WORD, "limber");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.limber, true);
  assert.equal(result.phrase, "admit limber");
  assert.equal(result.trismus, false);
  assert.equal(result.notifXpcDeadlock, false);
  assert.ok(HOLD_ALIASES.includes("limber"));
  assert.ok(HOLD_ALIASES.includes("unlocked"));
  assert.ok(HOLD_ALIASES.includes("responsive"));
  assert.ok(HOLD_ALIASES.includes("async-notif"));
  assert.ok(HOLD_ALIASES.includes("free-main"));
  assert.ok(HOLD_ALIASES.includes("unclenched"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify limber", () => {
  assert.equal(classify(emptyTicket()), "limber");
  assert.equal(classify(""), "limber");
  assert.equal(classify(null), "limber");
  assert.equal(decide({}), "limber");
});

test("#93823 seeded path scores trismus when the jaw is clamped", () => {
  const result = analyze(seedTrismus());
  assert.equal(result.verdict, "trismus");
  assert.equal(result.seededWord, "trismus");
  assert.equal(SEEDED_WORD, "trismus");
  assert.equal(PRODUCT_WORD, "trismus");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.trismus, true);
  assert.equal(result.phrase, "score trismus");
  assert.equal(result.notifXpcDeadlock, true);
  assert.equal(result.mainBlocked, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("notif-xpc-deadlock plus main-blocked is the #93823 trismus", () => {
  const xpc = inspectXpc({ trismus: true, notifXpcDeadlock: true });
  assert.equal(xpc.stamp, "xpc-close");
  assert.match(xpc.queue, /UNUserNotificationServiceConnection/);
  const scored = scoreGate({
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
    xpcClose: true,
    addNotification: true,
    cue: "trismus",
  });
  assert.equal(scored.verdict, "trismus");
  assert.equal(scored.notifXpcDeadlock, true);
  const open = inspectMain({ limber: true, notifXpcDeadlock: false });
  assert.equal(open.stamp, "main-free");
});

test("path word is notif-xpc-deadlock; clinic seed holds the path", () => {
  assert.equal(PATH_WORD, "notif-xpc-deadlock");
  const result = analyze(seedNotifXpcDeadlock());
  assert.equal(result.verdict, "notif-xpc-deadlock");
  assert.equal(result.pathWord, "notif-xpc-deadlock");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "notif-xpc-deadlock", preferSeed: true, trismus: true }),
    "notif-xpc-deadlock",
  );
  assert.equal(classify(seedMainBlocked()), "main-blocked");
});

test("HOLD includes limber / hold", () => {
  assert.ok(HOLD.includes("limber"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: xpc-close, code-tab-terminal-done, trismus", () => {
  assert.equal(classify(seedXpcClose()), "xpc-close");
  assert.equal(classify(seedCodeTabTerminalDone()), "code-tab-terminal-done");
  assert.equal(classify(seedProduct()), "trismus");
});

test("booth fixtures flip limber vs trismus vs notif-xpc-deadlock", () => {
  const idle = scoreGate(seedLimber());
  const seeded = scoreGate(seedTrismus());
  const limber = readData("limber.json");
  const trismus = readData("trismus.json");
  const path = readData("notif-xpc-deadlock.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "limber");
  assert.equal(seeded.verdict, "trismus");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLimber()), "limber");
  assert.equal(score(seedTrismus()), "trismus");
  assert.equal(limber.notifXpcDeadlock, false);
  assert.equal(limber.limber, true);
  assert.equal(scoreGate(limber).verdict, "limber");
  assert.equal(trismus.notifXpcDeadlock, true);
  assert.equal(trismus.mainBlocked, true);
  assert.equal(trismus.addNotification, true);
  assert.equal(classify(trismus), "trismus");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /limber|main thread free|jaw opens|async/i);
  assert.match(path.paths[1].result, /addNotificationRequest|close|XPC|deadlock/i);
  assert.equal(classify(path), "notif-xpc-deadlock");
  assert.equal(trismus.hubCount, "TRISMUS");
  assert.equal(trismus.issue, 93823);
  assert.equal(trismus.trismus, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("unlocked.json")), "unlocked");
  assert.equal(classify(readData("responsive.json")), "responsive");
  assert.equal(classify(readData("async-notif.json")), "async-notif");
  assert.equal(classify(readData("free-main.json")), "free-main");
  assert.equal(classify(readData("unclenched.json")), "unclenched");
  assert.equal(classify(readData("main-blocked.json")), "main-blocked");
  assert.equal(classify(readData("xpc-close.json")), "xpc-close");
  assert.equal(classify(readData("add-notification.json")), "add-notification");
  assert.equal(classify(readData("force-quit-only.json")), "force-quit-only");
  assert.equal(classify(readData("code-tab-terminal-done.json")), "code-tab-terminal-done");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("limber"));
  assert.ok(CHIPS.includes("trismus"));
  assert.ok(CHIPS.includes("notif-xpc-deadlock"));
  assert.ok(CHIPS.includes("main-blocked"));
  assert.ok(CHIPS.includes("xpc-close"));
  assert.ok(CHIPS.includes("unlocked"));
  assert.ok(CHIPS.includes("unclenched"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("trismus"));
  assert.ok(ALARM.includes("notif-xpc-deadlock"));
  assert.ok(ALARM.includes("main-blocked"));
  assert.ok(ALARM.includes("xpc-close"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published trismus walk scores trismus after the idle hold", () => {
  const booth = scoreWalk({ rows: TRISMUS_WALK });
  assert.equal(booth.verdict, "trismus");
  assert.ok(booth.trismusCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-limber");
  assert.equal(idle.limber, true);
  assert.equal(idle.verdict, "limber");
  const cut = booth.rows.find((row) => row.event === "notif-xpc-deadlock");
  assert.equal(cut.notifXpcDeadlock, true);
  const path = booth.rows.find((row) => row.event === "notif-xpc-deadlock" && row.t === "path");
  assert.equal(path.verdict, "notif-xpc-deadlock");
});

test("TRISMUS_WALK constant matches the issue clinic walk", () => {
  assert.equal(TRISMUS_WALK[0].event, "cue-limber");
  const cut = TRISMUS_WALK.find((row) => row.event === "notif-xpc-deadlock");
  assert.equal(cut.notifXpcDeadlock, true);
  const path = TRISMUS_WALK.find((row) => row.t === "path");
  assert.equal(path.trismus, true);
  const scoreRow = TRISMUS_WALK.find((row) => row.event === "trismus");
  assert.equal(scoreRow.trismus, true);
});

test("positive control limber chair stays limber", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "limber");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "limber");
  const hold = walk.rows.find((row) => row.event === "cue-limber");
  assert.equal(hold.limber, true);
  assert.equal(hold.verdict, "limber");
});

test("issue constants encode only #93823 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93823);
  assert.ok(ISSUE_URL.includes("93823"));
  assert.match(TITLE, /UNUserNotification|swift_addon|main thread deadlock/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /macOS|Claude Desktop|Code tab/);
  assert.match(ADDON, /swift_addon\.node/);
  assert.match(ADD_API, /addNotificationRequest/);
  assert.match(CLOSE_API, /NotificationService\.close/);
  assert.match(XPC_QUEUE, /UNUserNotificationServiceConnection/);
  assert.match(REMOVE_PENDING, /removePendingNotificationRequestsWithIdentifiers/);
  assert.match(BEACHBALL, /no spinning beachball|stops processing events/i);
  assert.match(GOOD_VERSION, /never block|responsive|async/i);
  assert.equal(SURFACE, "macos-unusernotification-xpc");
  assert.deepEqual([...LABELS], [
    "bug",
    "platform:macos",
    "area:desktop",
  ]);
  assert.deepEqual([...NOT_BASH_DEADLOCK], [92410, 91648]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Foundling|#93889|subagent/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#92410|#91648|Bash/i.test(row)));
  assert.ok(EXPECTED.some((row) => /never block the main thread|async APIs|responsive/i.test(row)));
  assert.match(DISTRIBUTION, /swift_addon|addNotificationRequest|NotificationService\.close|#93495|#57706|#92410/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("notif-xpc-deadlock"));
  assert.ok(FINGERPRINT_LINES.includes("trismus"));
  assert.equal(PHRASE, "Score trismus or admit limber.");
  assert.equal(SAMPLE_TRISMUS_PROOF.notifXpcDeadlock, true);
});

test("has-repro fingerprints encode the published trismus proof", () => {
  const result = handle(seedTrismus());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "macos-unusernotification-xpc");
  assert.equal(result.published.addon, ADDON);
  assert.match(
    fingerprint(seedTrismus()),
    /trismus\|main=blocked\|add=sync\|close=held\|path=notif-xpc-deadlock\|cue=notif-xpc-deadlock/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes foundling/gleaner and recent catalog words", () => {
  const required = [
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

test("limber booth flips trismus back when the jaw stays open", () => {
  const tape = {
    limber: true,
    trismus: false,
    notifXpcDeadlock: false,
    cue: "limber",
  };
  assert.equal(scoreGate(tape).verdict, "limber");
  tape.limber = false;
  tape.trismus = true;
  tape.notifXpcDeadlock = true;
  tape.mainBlocked = true;
  tape.cue = "trismus";
  assert.equal(scoreGate(tape).verdict, "trismus");
  tape.limber = true;
  tape.trismus = false;
  tape.notifXpcDeadlock = false;
  tape.mainBlocked = false;
  tape.cue = "limber";
  assert.equal(scoreGate(tape).verdict, "limber");
});

test("main, xpc, add, and readBooth mark the trismus proof", () => {
  const idle = inspectMain({
    limber: true,
  });
  assert.equal(idle.stamp, "main-free");
  const add = inspectAdd({ trismus: true, addNotification: true });
  assert.equal(add.stamp, "add-notification");
  assert.equal(add.posting, true);
  const xpc = inspectXpc({ trismus: true, xpcClose: true });
  assert.equal(xpc.stamp, "xpc-close");
  const booth = readBooth({
    trismus: true,
    notifXpcDeadlock: true,
    mainBlocked: true,
  });
  assert.equal(booth.trismus, true);
  assert.equal(booth.mark, "trismus");
  const open = readBooth({
    limber: true,
    trismus: false,
    notifXpcDeadlock: false,
  });
  assert.equal(open.trismus, false);
  assert.equal(open.mark, "limber");
});

test("mapChair encodes the published jaw clamp", () => {
  const miss = mapChair({ trismus: true, notifXpcDeadlock: true });
  assert.equal(miss.stamp, "notif-xpc-deadlock");
  assert.equal(miss.jawLane, "clamped");
  assert.equal(miss.ribbon, "trismus");
  const clear = mapChair({ limber: true, trismus: false });
  assert.equal(clear.stamp, "limber-chair");
  assert.equal(clear.jawLane, "open");
  assert.equal(clear.mainLane, "free");
});

test("inspectXpc encodes the close-held XPC path", () => {
  const gap = inspectXpc({ trismus: true, xpcClose: true });
  assert.equal(gap.stamp, "xpc-close");
  assert.match(gap.close, /NotificationService\.close/i);
  assert.match(gap.queue, /UNUserNotificationServiceConnection/i);
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 93495);
  assert.equal(COUSINS[1].issue, 57706);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
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
  assert.equal(BACKUPS[11].issue, 93957);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93823));
  assert.ok(!BACKUPS.some((row) => row.issue === 93495));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/trismus.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const limberFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/limber.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(limberFix.status, 0, limberFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const limberOut = JSON.parse(limberFix.stdout);
  assert.equal(idleOut.verdict, "limber");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "trismus");
  assert.equal(seededOut.alarm, true);
  assert.equal(limberOut.verdict, "limber");
  assert.equal(limberOut.hold, true);
  assert.match(limberOut.phrase, /admit limber/);
});

test("handle exposes published hypothesis and #93823 headline", () => {
  const result = handle(seedTrismus());
  assert.equal(result.published.issue, 93823);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93495, 57706]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93967));
  assert.ok(result.published.backups.includes(93957));
  assert.ok(!result.published.backups.includes(93823));
  assert.match(result.published.hypothesis, /NotificationService\.close|addNotificationRequest|XPC|NON-BINDING|#93823/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93823/);
  assert.equal(result.published.addApi, ADD_API);
  assert.equal(result.published.closeApi, CLOSE_API);
  assert.deepEqual(result.published.notBashDeadlock, [92410, 91648]);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an oral-surgery / lockjaw clinic booth, not foundling or hysteresis", () => {
  const page = readPage();
  assert.match(page, /Archivo Black|Archivo\+Black/);
  assert.match(page, /Figtree/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /trismus|limber|notif-xpc-deadlock|jaw|forceps|enamel|trigeminal|clamp/i);
  assert.match(page, /#F4F1EA|#1A1F24|#B33A3A|#7A858F|#C4922A|#E8ECE8|#2F6F6A/i);
  assert.match(page, /\blimber\b/);
  assert.match(page, /\btrismus\b/);
  assert.match(page, /notif-xpc-deadlock/);
  assert.match(page, /Score trismus or admit limber/i);
  assert.match(page, /#93495|#57706|cousin/i);
  assert.match(page, /#334/);
  assert.match(page, /#93823/);
  assert.match(page, /Admit limber/);
  assert.match(page, /Score trismus/);
  assert.match(page, /Walk notif-xpc-deadlock/);
  assert.match(page, /Compare limber \/ trismus/);
  assert.match(page, /Pin idle limber/);
  assert.match(page, /Pin seeded trismus/);
  assert.match(page, /Pin notif-xpc-deadlock/);
  assert.match(page, /Unclamp the jaw/);
  assert.match(page, /swift_addon|addNotificationRequest|NotificationService\.close|UNUserNotification|force quit/i);
  assert.match(page, /jaw|forceps|enamel|trigeminal|clinic|clamp|chair|tile/i);
  assert.doesNotMatch(page, /Cormorant Garamond|Cormorant\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Yrsa/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
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
  assert.match(readme, /Trismus/);
  assert.match(readme, /#93823/);
  assert.match(readme, /\blimber\b/);
  assert.match(readme, /\btrismus\b/);
  assert.match(readme, /notif-xpc-deadlock/);
  assert.match(readme, /Archivo Black/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /swift_addon|addNotificationRequest|NotificationService\.close|UNUserNotification|force quit/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/trismus/);
  assert.match(readme, /node --test projects\/trismus\/trismus\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /jaw|forceps|enamel|trigeminal|clinic|clamp/i);
  assert.match(readme, /Score trismus or admit limber/);
  assert.match(readme, /#93495|#57706/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93821|#93811|#93809|#93924|#93925|#93954|#93967|#93957/);
  assert.match(readme, /17:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.match(readme, /#92410|#91648/);
});

test("catalog features Trismus only; Foundling unfeatured; product count 334", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 334);
  assert.equal(hub.products.length, 334);
  assert.equal(catalog.products[0].name, "Trismus");
  assert.equal(catalog.products[0].slug, "trismus");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/trismus/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /17:50 trismus|#93823|lockjaw|limber|notif-xpc-deadlock/i);
  assert.match(catalog.products[0].summary, /\blimber\b/);
  assert.match(catalog.products[0].summary, /\btrismus\b/);
  assert.match(catalog.products[0].summary, /notif-xpc-deadlock/);
  assert.match(catalog.products[0].summary, /Score trismus or admit limber/);
  assert.equal(hub.products[0].slug, "trismus");
  assert.equal(hub.products[0].featured, true);
  const foundling = catalog.products.find((row) => row.slug === "foundling");
  assert.ok(foundling);
  assert.equal(foundling.featured, false);
  const crasis = catalog.products.find((row) => row.slug === "crasis");
  assert.ok(crasis);
  assert.equal(crasis.featured, false);
  const tessera = catalog.products.find((row) => row.slug === "tessera");
  assert.ok(tessera);
  assert.equal(tessera.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "trismus").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93823") && row.slug !== "trismus"));
});

test("vercel rewrites trismus to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/trismus");
  assert.equal(vercel.rewrites[0].destination, "/projects/trismus");
  assert.equal(vercel.rewrites[1].source, "/trismus/");
  assert.equal(vercel.rewrites[1].destination, "/projects/trismus");
  assert.equal(vercel.rewrites[2].source, "/trismus/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/trismus/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
