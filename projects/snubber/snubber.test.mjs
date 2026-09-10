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
  BUILD,
  CHIPS,
  COUSINS,
  EPIPE_ERRNO,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_FDS,
  IDLE_WORD,
  INT32_MAX,
  ISSUE_URL,
  LABELS,
  LEAKED_FDS,
  LSOF_CMD,
  MUX_EXAMPLE,
  MUX_SOCK,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  REPRO_CMD,
  REPRO_HOST,
  SEEDED_WORD,
  SNUBBER_WALK,
  STATE,
  SUPERSEDES,
  TITLE,
  ACCUMULATOR_STATIONS,
  VERSION_FIRST,
  VERSION_STILL,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectEpipeSpin,
  inspectLeakedPeer,
  inspectMuxListener,
  readSnubber,
  score,
  scoreGate,
  scoreWalk,
  seedDamped,
  seedEpipe,
  seedFourSessions,
  seedHold,
  seedInt32Max,
  seedKevent64,
  seedKill9,
  seedLeakedFd,
  seedListenerOnly,
  seedMux,
  seedSendto,
  seedSnubber,
  seedSocks5,
  seedSpinning,
  seedSrtMux,
} from "./snubber.mjs";

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
  return fileURLToPath(new URL("./snubber.mjs", import.meta.url));
}

test("idle damped is a hold; mux listener only; no EPIPE spin", () => {
  const result = analyze(seedDamped());
  assert.equal(result.verdict, "damped");
  assert.equal(result.idleWord, "damped");
  assert.equal(IDLE_WORD, "damped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.damped, true);
  assert.equal(result.phrase, "admit damped");
  assert.equal(result.listenerOnly, true);
  assert.equal(result.peerClosed, true);
  assert.equal(result.fds, 1);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify damped", () => {
  assert.equal(classify(emptyTicket()), "damped");
  assert.equal(classify(""), "damped");
  assert.equal(classify(null), "damped");
  assert.equal(decide({}), "damped");
});

test("#93398 seeded path scores spinning when kill -9 leaks accepted fd", () => {
  const result = analyze(seedSpinning());
  assert.equal(result.verdict, "spinning");
  assert.equal(result.seededWord, "spinning");
  assert.equal(SEEDED_WORD, "spinning");
  assert.equal(PRODUCT_WORD, "snubber");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.spinning, true);
  assert.equal(result.phrase, "score snubber");
  assert.equal(result.fds, 6);
  assert.equal(result.epipe, true);
  assert.equal(result.kill9, true);
  assert.equal(result.leakedFd, true);
  assert.equal(result.keventSpin, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("listener plus leaked peer plus EPIPE is the #93398 snubber", () => {
  const listener = inspectMuxListener({
    fds: 1,
    listenerOnly: true,
  });
  assert.equal(listener.stamp, "listener-only");
  const scored = scoreGate({
    spinning: true,
    kill9: true,
    leakedFd: true,
    peerGone: true,
    epipe: true,
    fds: 6,
    cue: "spinning",
  });
  assert.equal(scored.verdict, "spinning");
  assert.equal(scored.epipe, true);
  const calm = inspectLeakedPeer({
    peerClosed: true,
    fds: 1,
  });
  assert.equal(calm.stamp, "damped");
});

test("path word is mux; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "mux");
  const result = analyze(seedMux());
  assert.equal(result.verdict, "mux");
  assert.equal(result.pathWord, "mux");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "mux", preferSeed: true, spinning: true }),
    "mux",
  );
  assert.equal(classify(seedEpipe()), "epipe");
});

test("HOLD includes damped / hold", () => {
  assert.ok(HOLD.includes("damped"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: leaked-fd, epipe, kill-9, socks5, srt-mux, kevent64, sendto", () => {
  assert.equal(classify(seedListenerOnly()), "listener-only");
  assert.equal(classify(seedLeakedFd()), "leaked-fd");
  assert.equal(classify(seedEpipe()), "epipe");
  assert.equal(classify(seedKill9()), "kill-9");
  assert.equal(classify(seedSocks5()), "socks5");
  assert.equal(classify(seedSrtMux()), "srt-mux");
  assert.equal(classify(seedKevent64()), "kevent64");
  assert.equal(classify(seedSendto()), "sendto");
  assert.equal(classify(seedInt32Max()), "int32-max");
  assert.equal(classify(seedFourSessions()), "four-sessions");
  assert.equal(classify(seedSnubber()), "snubber");
});

test("accumulator fixtures flip damped vs spinning vs mux", () => {
  const idle = scoreGate(seedDamped());
  const seeded = scoreGate(readData("spinning.json"));
  const damped = readData("damped.json");
  const spinning = readData("spinning.json");
  const paths = readData("paths.json");
  const product = readData("snubber.json");
  assert.equal(idle.verdict, "damped");
  assert.equal(seeded.verdict, "spinning");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedDamped()), "damped");
  assert.equal(score(readData("spinning.json")), "spinning");
  assert.equal(damped.fds, 1);
  assert.equal(damped.listenerOnly, true);
  assert.equal(scoreGate(damped).verdict, "damped");
  assert.equal(spinning.fds, 6);
  assert.equal(spinning.epipe, true);
  assert.equal(spinning.kill9, true);
  assert.equal(classify(spinning), "spinning");
  assert.equal(paths.paths.length, 3);
  assert.equal(paths.paths[0].role.includes("SOCKS5"), true);
  assert.match(paths.paths[1].sock, /srt-mux-37591-0\.sock/);
  assert.equal(classify(paths), "mux");
  assert.equal(classify(product), "snubber");
  assert.equal(spinning.issue, 93398);
  assert.match(spinning.sendto, /EPIPE/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("damped"));
  assert.ok(CHIPS.includes("spinning"));
  assert.ok(CHIPS.includes("snubber"));
  assert.ok(CHIPS.includes("mux"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("spinning"));
  assert.ok(ALARM.includes("mux"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published snubber walk scores spinning after the idle hold", () => {
  const desk = scoreWalk({ rows: SNUBBER_WALK });
  assert.equal(desk.verdict, "spinning");
  assert.ok(desk.spinningCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-damped");
  assert.equal(idle.damped, true);
  assert.equal(idle.verdict, "damped");
  const clean = desk.rows.find((row) => row.event === "clean-exits");
  assert.equal(clean.fds, 1);
  const kill = desk.rows.find((row) => row.event === "kill-9");
  assert.equal(kill.kill9, true);
  const leak = desk.rows.find((row) => row.event === "leaked-fd");
  assert.equal(leak.fds, 6);
  const cpu = desk.rows.find((row) => row.event === "cpu-jump");
  assert.equal(cpu.cpuAfter, "128%");
  const epipe = desk.rows.find((row) => row.event === "epipe-spin");
  assert.equal(epipe.epipe, true);
  const kevent = desk.rows.find((row) => row.event === "kevent64-spin");
  assert.equal(kevent.keventSpin, true);
  const hours = desk.rows.find((row) => row.event === "int32-max");
  assert.equal(hours.int32Max, true);
  const cut = desk.rows.find((row) => row.event === "spinning");
  assert.equal(cut.spinning, true);
  const path = desk.rows.find((row) => row.event === "mux");
  assert.equal(path.verdict, "mux");
});

test("SNUBBER_WALK constant matches the issue accumulator walk", () => {
  assert.equal(SNUBBER_WALK[0].event, "cue-damped");
  const leak = SNUBBER_WALK.find((row) => row.event === "leaked-fd");
  assert.equal(leak.fds, 6);
  const cut = SNUBBER_WALK.find((row) => row.event === "spinning");
  assert.equal(cut.kill9, true);
  assert.equal(cut.epipe, true);
  const path = SNUBBER_WALK.find((row) => row.event === "mux");
  assert.equal(path.spinning, true);
  const scoreRow = SNUBBER_WALK.find((row) => row.event === "snubber");
  assert.equal(scoreRow.spinning, true);
});

test("issue constants encode only #93398 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93398);
  assert.ok(ISSUE_URL.includes("93398"));
  assert.match(TITLE, /SOCKS socket/);
  assert.match(TITLE, /EPIPE/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:bash"));
  assert.ok(LABELS.includes("perf:cpu"));
  assert.ok(LABELS.includes("area:sandbox"));
  assert.equal(AUTHOR, "STRML");
  assert.equal(FILED, "2026-09-10T16:32:30Z");
  assert.equal(VERSION_FIRST, "2.1.226");
  assert.equal(VERSION_STILL, "2.1.267");
  assert.equal(OS, "macOS 26.6.1");
  assert.equal(BUILD, "25G76");
  assert.equal(ARCH, "arm64");
  assert.equal(SUPERSEDES, 85666);
  assert.equal(MUX_SOCK, "srt-mux-<pid>-<n>.sock");
  assert.equal(MUX_EXAMPLE, "srt-mux-37591-0.sock");
  assert.equal(IDLE_FDS, 1);
  assert.equal(LEAKED_FDS, 6);
  assert.equal(EPIPE_ERRNO, 32);
  assert.equal(INT32_MAX, 2147483647);
  assert.match(LSOF_CMD, /srt-mux/);
  assert.match(REPRO_CMD, /kill -9/);
  assert.match(REPRO_HOST, /models\.dev/);
  assert.equal(ACCUMULATOR_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("listener-only"));
  assert.ok(FINGERPRINT_LINES.includes("leaked-fd"));
  assert.ok(FINGERPRINT_LINES.includes("epipe"));
  assert.match(PHRASE, /score snubber or admit damped/);
});

test("has-repro fingerprints encode the published macOS sandbox window", () => {
  const result = handle(readData("spinning.json"));
  assert.equal(result.published.versionFirst, "2.1.226");
  assert.equal(result.published.versionStill, "2.1.267");
  assert.equal(result.published.author, "STRML");
  assert.equal(result.published.os, "macOS 26.6.1");
  assert.equal(result.published.build, "25G76");
  assert.equal(result.published.arch, "arm64");
  assert.equal(result.published.supersedes, 85666);
  assert.equal(result.published.leakedFds, 6);
  assert.equal(result.published.epipeErrno, 32);
  assert.match(
    fingerprint(seedSpinning()),
    /spinning\|mux=leaked\|fd=leaked\|write=epipe\|peer=kill-9\|cue=spinning/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Fosse", () => {
  const required = [
    "fosse",
    "fossed",
    "mounted",
    "plan9",
    "hibernacle",
    "warm",
    "paged-out",
    "majflt",
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "routed",
    "inherited",
    "cascade",
    "appanage",
    "afloat",
    "washed",
    "pontoon",
    "concordant",
    "concordat",
    "reaped",
    "revenant",
    "oubliette",
    "voided",
    "replevin",
    "cognate",
    "lemures",
    "escheat",
    "mortmain",
    "strowger",
    "mondegreen",
    "derby",
    "vizard",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("damped canister flips spinning back when peer closes clean", () => {
  const tape = {
    damped: true,
    listenerOnly: true,
    fds: 1,
    peerClosed: true,
    spinning: false,
    cue: "damped",
  };
  assert.equal(scoreGate(tape).verdict, "damped");
  tape.damped = false;
  tape.spinning = true;
  tape.peerClosed = false;
  tape.kill9 = true;
  tape.epipe = true;
  tape.cue = "spinning";
  assert.equal(scoreGate(tape).verdict, "spinning");
  tape.damped = true;
  tape.spinning = false;
  tape.kill9 = false;
  tape.epipe = false;
  tape.peerClosed = true;
  tape.cue = "damped";
  assert.equal(scoreGate(tape).verdict, "damped");
});

test("listener, leak, EPIPE gauge, and snubber mark spinning after kill -9", () => {
  const idle = inspectMuxListener({ listenerOnly: true, fds: 1 });
  assert.equal(idle.stamp, "listener-only");
  const leak = inspectLeakedPeer({
    leakedFd: true,
    peerGone: true,
    kill9: true,
    fds: 6,
  });
  assert.equal(leak.stamp, "spinning");
  assert.equal(leak.leaked, true);
  const gauge = inspectEpipeSpin({
    epipe: true,
    sendto: "EPIPE",
    errno: 32,
  });
  assert.equal(gauge.stamp, "spinning");
  const desk = readSnubber({
    spinning: true,
    kill9: true,
    leakedFd: true,
    epipe: true,
  });
  assert.equal(desk.spinning, true);
  assert.equal(desk.mark, "spinning");
  const calm = readSnubber({
    damped: true,
    listenerOnly: true,
    spinning: false,
  });
  assert.equal(calm.spinning, false);
  assert.equal(calm.mark, "damped");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 85666);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("fosse"));
  assert.ok(NOT_PRODUCTS.includes("hibernacle"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("cartulary"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.ok(NOT_PRODUCTS.includes("appanage"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.ok(NOT_PRODUCTS.includes("damper"));
  assert.ok(NOT_PRODUCTS.includes("snub"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93368);
  assert.equal(BACKUPS[1].issue, 93392);
  assert.equal(BACKUPS[2].issue, 93382);
  assert.equal(BACKUPS[3].issue, 93385);
  assert.equal(BACKUPS[4].issue, 93356);
  assert.equal(BACKUPS[5].issue, 93345);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/spinning.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "damped");
  assert.equal(JSON.parse(seeded.stdout).verdict, "spinning");
});

test("handle exposes published hypothesis and #93398 headline", () => {
  const result = handle(readData("spinning.json"));
  assert.equal(result.published.issue, 93398);
  assert.equal(result.published.versionFirst, "2.1.226");
  assert.equal(result.published.versionStill, "2.1.267");
  assert.equal(result.published.author, "STRML");
  assert.equal(result.published.build, "25G76");
  assert.deepEqual(result.published.cousins, [85666]);
  assert.ok(result.published.backups.includes(93368));
  assert.ok(result.published.backups.includes(93392));
  assert.ok(result.published.backups.includes(93356));
  assert.match(result.published.hypothesis, /SOCKS mux relay fails to tear down/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a hydraulic snubber, not an earthwork fosse", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /snubber|pulse-damper|accumulator|hydraulic|pneumatic|EPIPE|mux/i);
  assert.match(page, /#16191d|#e09a14|#b56a3a|#d4352a|#c5d4dc/);
  assert.match(page, /damped/);
  assert.match(page, /spinning/);
  assert.match(page, /mux/);
  assert.match(page, /score snubber or admit damped/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /02:50/);
  assert.match(page, /#275/);
  assert.match(page, /#93398/);
  assert.match(page, /STRML/);
  assert.match(page, /2\.1\.226/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /macOS 26\.6\.1/);
  assert.match(page, /EPIPE/);
  assert.match(page, /srt-mux/);
  assert.match(page, /Charge the accumulator/);
  assert.match(page, /Score snubber/);
  assert.match(page, /Bleed the line/);
  assert.match(page, /Count the mux peers/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /#12100e/);
  assert.doesNotMatch(page, /#3d3429/);
  assert.doesNotMatch(page, /#2d4a3e/);
  assert.doesNotMatch(page, /#0b1018/);
  assert.doesNotMatch(page, /ash altar|goat-bell|bone linen|grant-table|rust-blood/i);
  assert.doesNotMatch(page, /oak lectern|bound quires|inkhorn|register index/i);
  assert.doesNotMatch(page, /wax press|issuer ribbon|signature paraph|wax-seal crimson/i);
  assert.doesNotMatch(page, /séance|seance|process-tomb|graveyard|charcoal bone|cold violet/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|timber deck|salt fog|navigation lights/i);
  assert.doesNotMatch(page, /letters patent|heraldic|cadency|coronet/i);
  assert.doesNotMatch(page, /wet clay|sod lip|iron spike|guest void/i);
  assert.doesNotMatch(page, /winter den|frost linen|majflt|paged-out/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bfosse\b/);
  assert.doesNotMatch(page, /\bfossed\b/);
  assert.doesNotMatch(page, /\bmounted\b/);
  assert.doesNotMatch(page, /\bplan9\b/);
  assert.doesNotMatch(page, /\bscapegoat\b/);
  assert.doesNotMatch(page, /\bcartulary\b/);
  assert.doesNotMatch(page, /\bparaph\b/);
  assert.doesNotMatch(page, /\bappanage\b/);
  assert.doesNotMatch(page, /\brouted\b/);
  assert.doesNotMatch(page, /\binherited\b/);
  assert.doesNotMatch(page, /\bcascade\b/);
  assert.doesNotMatch(page, /\bafloat\b/);
  assert.doesNotMatch(page, /\bwashed\b/);
  assert.doesNotMatch(page, /\bpontoon\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brevenant\b/);
  assert.doesNotMatch(page, /\bhonest\b/);
  assert.doesNotMatch(page, /\bscapegoated\b/);
  assert.doesNotMatch(page, /\bungranted\b/);
  assert.doesNotMatch(page, /\bhibernacle\b/);
  assert.match(page, /NOT Fosse/i);
  assert.match(page, /NOT Hibernacle/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Cartulary/i);
  assert.match(page, /NOT Paraph/i);
  assert.match(page, /NOT Appanage/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Concordat/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Snubber/);
  assert.match(readme, /#93398/);
  assert.match(readme, /damped/);
  assert.match(readme, /spinning/);
  assert.match(readme, /mux/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Fosse/i);
  assert.match(readme, /NOT Hibernacle/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Cartulary/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /NOT Appanage/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Concordat/i);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /2\.1\.226/);
  assert.match(readme, /2\.1\.267/);
  assert.match(readme, /macOS 26\.6\.1/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/snubber/);
  assert.match(readme, /node --test projects\/snubber\/snubber\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /SOCKS mux relay fails to tear down/);
  assert.match(readme, /#85666/);
  assert.match(readme, /#93368/);
  assert.match(readme, /hydraulic \/ pneumatic/);
  assert.match(readme, /EPIPE/);
});

test("catalog features Snubber only; Fosse and Hibernacle unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 275);
  assert.equal(catalog.products[0].name, "Snubber");
  assert.equal(catalog.products[0].slug, "snubber");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/snubber/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /02:50/);
  assert.match(catalog.products[0].summary, /snubber/);
  assert.match(catalog.products[0].summary, /#93398/);
  assert.match(catalog.products[0].summary, /damped/);
  assert.match(catalog.products[0].summary, /spinning/);
  assert.match(catalog.products[0].summary, /mux/);
  const fosse = catalog.products.find((row) => row.slug === "fosse");
  assert.ok(fosse);
  assert.equal(fosse.featured, false);
  const hibernacle = catalog.products.find((row) => row.slug === "hibernacle");
  assert.ok(hibernacle);
  assert.equal(hibernacle.featured, false);
  const scapegoat = catalog.products.find((row) => row.slug === "scapegoat");
  assert.ok(scapegoat);
  assert.equal(scapegoat.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "snubber").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93398") && row.slug !== "snubber"));
});

test("vercel rewrites snubber to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/snubber");
  assert.equal(vercel.rewrites[0].destination, "/projects/snubber");
  assert.equal(vercel.rewrites[1].source, "/snubber/");
  assert.equal(vercel.rewrites[1].destination, "/projects/snubber");
});

test("no live network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
