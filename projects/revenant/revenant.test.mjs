import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_VERSION,
  COMMIT_MB,
  COUSINS,
  CRASH_CODE,
  ENUM_COST_MS,
  FALLBACK_CMD,
  FEATURED_ISSUE,
  FFI_PATH,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS,
  PARLOR_STATIONS,
  PATH_WORD,
  PHRASE,
  REVENANT_WALK,
  SEEDED_WORD,
  SESSION_KEY,
  STATE,
  TIMEOUT_MS,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  readParlor,
  reapPeers,
  score,
  scoreGate,
  scoreWalk,
  seedCommitCrash,
  seedEnumAll,
  seedFfiDead,
  seedHold,
  seedMidRpc,
  seedOrphanCommit,
  seedReaped,
  seedRebootOnly,
  seedRevenant,
  seedSelfAccel,
  seedStaleKey,
  seedTimeoutKill,
  seedWedged,
  seedWmiFallback,
  soundTomb,
  tallyGraves,
} from "./revenant.mjs";

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
  return fileURLToPath(new URL("./revenant.mjs", import.meta.url));
}

test("idle reaped is a hold; FFI or O(1) keeps probes under budget", () => {
  const result = analyze(seedReaped());
  assert.equal(result.verdict, "reaped");
  assert.equal(result.idleWord, "reaped");
  assert.equal(IDLE_WORD, "reaped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.reaped, true);
  assert.equal(result.phrase, "admit reaped");
  assert.equal(result.timeoutKill, false);
  assert.equal(result.orphanCommit, false);
  assert.equal(result.wmiFallback, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify reaped", () => {
  assert.equal(classify(emptyTicket()), "reaped");
  assert.equal(classify(""), "reaped");
  assert.equal(classify(null), "reaped");
  assert.equal(decide({}), "reaped");
});

test("#93274 seeded path scores revenant when WMI timeout-kill leaves orphans", () => {
  const result = analyze(seedRevenant());
  assert.equal(result.verdict, "revenant");
  assert.equal(result.seededWord, "revenant");
  assert.equal(SEEDED_WORD, "revenant");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.revenant, true);
  assert.equal(result.phrase, "score revenant");
  assert.equal(result.ffiAvailable, false);
  assert.equal(result.wmiFallback, true);
  assert.equal(result.enumAll, true);
  assert.equal(result.timeoutKill, true);
  assert.equal(result.midRpc, true);
  assert.equal(result.orphanCommit, true);
  assert.equal(result.selfAccel, true);
  assert.equal(result.staleKey, true);
  assert.equal(result.rebootOnly, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is wedged; named wedged seed holds the path", () => {
  assert.equal(PATH_WORD, "wedged");
  const result = analyze(seedWedged());
  assert.equal(result.verdict, "wedged");
  assert.equal(result.pathWord, "wedged");
  assert.equal(result.hold, false);
  assert.equal(classify({ seed: "wedged", preferSeed: true, wedged: true }), "wedged");
});

test("HOLD includes reaped / hold", () => {
  assert.ok(HOLD.includes("reaped"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: ffi-dead, wmi-fallback, enum-all, timeout-kill, mid-rpc, orphan", () => {
  assert.equal(analyze(seedFfiDead()).ffiAvailable, false);
  assert.equal(classify(seedFfiDead()), "ffi-dead");
  assert.equal(analyze(seedWmiFallback()).wmiFallback, true);
  assert.equal(classify(seedWmiFallback()), "wmi-fallback");
  assert.equal(analyze(seedEnumAll()).enumAll, true);
  assert.equal(classify(seedEnumAll()), "enum-all");
  assert.equal(analyze(seedTimeoutKill()).timeoutKill, true);
  assert.equal(classify(seedTimeoutKill()), "timeout-kill");
  assert.equal(analyze(seedMidRpc()).midRpc, true);
  assert.equal(classify(seedMidRpc()), "mid-rpc");
  assert.equal(analyze(seedOrphanCommit()).orphanCommit, true);
  assert.equal(classify(seedOrphanCommit()), "orphan-commit");
  assert.equal(classify(seedSelfAccel()), "self-accel");
  assert.equal(classify(seedStaleKey()), "stale-key");
  assert.equal(classify(seedRebootOnly()), "reboot-only");
  assert.equal(classify(seedCommitCrash()), "commit-crash");
});

test("fixture toggle flips reaped vs revenant", () => {
  const reaped = scoreGate(seedReaped());
  const revenant = scoreGate(readData("revenant.json"));
  assert.equal(reaped.verdict, "reaped");
  assert.equal(revenant.verdict, "revenant");
  assert.notEqual(reaped.verdict, revenant.verdict);
  assert.equal(score(seedReaped()), "reaped");
  assert.equal(score(readData("revenant.json")), "revenant");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("reaped"));
  assert.ok(CHIPS.includes("revenant"));
  assert.ok(CHIPS.includes("wedged"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("revenant"));
  assert.ok(ALARM.includes("wedged"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published revenant walk scores revenant after the hold floods", () => {
  const parlor = scoreWalk({ rows: REVENANT_WALK });
  assert.equal(parlor.verdict, "revenant");
  assert.ok(parlor.revenantCount >= 1);
  const idle = parlor.rows.find((row) => row.event === "cue-reaped");
  assert.equal(idle.reaped, true);
  assert.equal(idle.verdict, "reaped");
  const ffi = parlor.rows.find((row) => row.event === "ffi-dead");
  assert.equal(ffi.ffiAvailable, false);
  const wmi = parlor.rows.find((row) => row.event === "wmi-fallback");
  assert.equal(wmi.wmiFallback, true);
  const enumerated = parlor.rows.find((row) => row.event === "enum-all");
  assert.equal(enumerated.enumAll, true);
  const timeout = parlor.rows.find((row) => row.event === "timeout-kill");
  assert.equal(timeout.timeoutKill, true);
  const rpc = parlor.rows.find((row) => row.event === "mid-rpc");
  assert.equal(rpc.midRpc, true);
  const orphan = parlor.rows.find((row) => row.event === "orphan-commit");
  assert.equal(orphan.orphanCommit, true);
  const spiral = parlor.rows.find((row) => row.event === "self-accel");
  assert.equal(spiral.selfAccel, true);
  const hear = parlor.rows.find((row) => row.event === "revenant");
  assert.equal(hear.timeoutKill, true);
  const path = parlor.rows.find((row) => row.event === "wedged");
  assert.equal(path.verdict, "wedged");
});

test("REVENANT_WALK constant matches the issue parlor walk", () => {
  assert.equal(REVENANT_WALK[0].event, "cue-reaped");
  const ffi = REVENANT_WALK.find((row) => row.event === "ffi-dead");
  assert.equal(ffi.ffiAvailable, false);
  const wmi = REVENANT_WALK.find((row) => row.event === "wmi-fallback");
  assert.equal(wmi.wmiFallback, true);
  const hear = REVENANT_WALK.find((row) => row.event === "revenant");
  assert.equal(hear.orphanCommit, true);
  const path = REVENANT_WALK.find((row) => row.event === "wedged");
  assert.equal(path.wedged, true);
});

test("issue constants encode only #93274 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93274);
  assert.ok(ISSUE_URL.includes("93274"));
  assert.match(TITLE, /Get-CimInstance Win32_Process/);
  assert.match(TITLE, /0xC0000409/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(AUTHOR, "goldencircle1109");
  assert.equal(FILED, "2026-09-10T06:13:55Z");
  assert.equal(CLAUDE_VERSION, "2.1.263/266/267");
  assert.match(OS, /Windows 11/);
  assert.match(SESSION_KEY, /\.claude\\sessions/);
  assert.match(FFI_PATH, /OpenProcess/);
  assert.match(FALLBACK_CMD, /Get-CimInstance Win32_Process/);
  assert.equal(TIMEOUT_MS, 1000);
  assert.equal(ENUM_COST_MS, 1.45);
  assert.equal(COMMIT_MB, 43);
  assert.equal(CRASH_CODE, "0xC0000409");
  assert.equal(PARLOR_STATIONS.length, 3);
  assert.ok(FINGERPRINT_LINES.includes("Get-CimInstance Win32_Process"));
  assert.ok(FINGERPRINT_LINES.includes("timeout: 1000"));
  assert.match(PHRASE, /timeout-killed mid-RPC/);
  assert.match(PHRASE, /score revenant or admit reaped/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "restored",
    "replevin",
    "defaulted",
    "expanded",
    "cognate",
    "literal",
    "laid",
    "lemures",
    "remanent",
    "released",
    "escheat",
    "stale",
    "freehold",
    "mortmain",
    "phantom",
    "trunked",
    "strowger",
    "exchanged",
    "tokenized",
    "mondegreen",
    "parsed",
    "locked",
    "scratched",
    "derby",
    "unmasked",
    "vizard",
    "precedence",
    "carrier",
    "moored",
    "scuttled",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "cleared",
    "mounded",
    "distinct",
    "held",
    "raised",
    "fallen",
    "primed",
    "flashed",
    "greenroomed",
    "scaffold",
    "stereotype",
    "parergon",
    "lacuna",
    "hangfire",
    "afterimage",
    "remora",
    "quieted",
    "unrung",
    "latent",
    "flushed",
    "collated",
    "stereotyped",
    "deadair",
    "squelch",
    "scuttle",
    "fresh",
    "stamped",
    "conflated",
    "steered",
    "vernier",
    "slider",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("reaping peers flips revenant to reaped", () => {
  const tape = {
    reaped: true,
    timeoutKill: false,
    wmiFallback: false,
    orphanCommit: false,
    cue: "reaped",
  };
  assert.equal(scoreGate(tape).verdict, "reaped");
  tape.reaped = false;
  tape.timeoutKill = true;
  tape.wmiFallback = true;
  tape.orphanCommit = true;
  tape.cue = "revenant";
  assert.equal(scoreGate(tape).verdict, "revenant");
  tape.reaped = true;
  tape.timeoutKill = false;
  tape.wmiFallback = false;
  tape.orphanCommit = false;
  tape.cue = "reaped";
  assert.equal(scoreGate(tape).verdict, "reaped");
});

test("peers, tomb, and graves mark rise after WMI timeout-kill", () => {
  const idlePeers = reapPeers({ reaped: true, ffiAvailable: true });
  assert.equal(idlePeers.rite, "reaped");
  assert.equal(idlePeers.path, "ffi-or-o1");
  const cutPeers = reapPeers({ reaped: false, ffiAvailable: false, timeoutKill: true });
  assert.equal(cutPeers.rite, "revenant");
  assert.equal(cutPeers.path, "wmi-spawn");
  const live = soundTomb({
    timeoutKill: false,
    midRpc: false,
    wmiFallback: false,
  });
  assert.equal(live.sounded, false);
  assert.equal(live.stamp, "reaped");
  const cut = soundTomb({
    timeoutKill: true,
    midRpc: true,
    wmiFallback: true,
    orphanCommit: true,
    rebootOnly: true,
  });
  assert.equal(cut.stamp, "revenant");
  assert.equal(cut.commitMb, 43);
  const parlor = readParlor({
    timeoutKill: true,
    midRpc: true,
    wmiFallback: true,
    orphanCommit: true,
  });
  assert.equal(parlor.risen, true);
  assert.equal(parlor.cue, "revenant");
  const calm = readParlor({ reaped: true, ffiAvailable: true, timeoutKill: false });
  assert.equal(calm.risen, false);
  assert.equal(calm.cue, "reaped");
  const graves = tallyGraves({ timeoutKill: true, orphanCommit: true, selfAccel: true });
  assert.equal(graves.commitMb, 43);
  assert.equal(graves.crash, "0xC0000409");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 84675);
  assert.equal(COUSINS[1].issue, 86551);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("replevin"));
  assert.ok(NOT_PRODUCTS.includes("cognate"));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("strowger"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("seizing"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93279);
  assert.equal(BACKUPS[7].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const reaped = spawnSync(
    process.execPath,
    [modelPath()],
    { encoding: "utf8" },
  );
  const revenant = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/revenant.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(reaped.status, 0, reaped.stderr);
  assert.equal(revenant.status, 0, revenant.stderr);
  assert.equal(JSON.parse(reaped.stdout).verdict, "reaped");
  assert.equal(JSON.parse(revenant.stdout).verdict, "revenant");
});

test("handle exposes published hypothesis and #93274 headline", () => {
  const result = handle(readData("revenant.json"));
  assert.equal(result.published.issue, 93274);
  assert.equal(result.published.claudeVersion, "2.1.263/266/267");
  assert.equal(result.published.author, "goldencircle1109");
  assert.equal(result.published.timeoutMs, 1000);
  assert.equal(result.published.commitMb, 43);
  assert.equal(result.published.crashCode, "0xC0000409");
  assert.deepEqual(result.published.cousins, [84675, 86551]);
  assert.deepEqual(result.published.backups, [93279, 93265, 93270, 93269, 93257, 93259, 93239, 93219]);
  assert.match(result.published.hypothesis, /WMI fallback/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedRevenant()),
    /revenant\|ffi=dead\|wmi=yes\|kill=yes\|commit=43\|cue=revenant/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a séance parlor, not a writ desk or courtyard", () => {
  const page = readPage();
  assert.match(page, /Young Serif/);
  assert.match(page, /Mulish/);
  assert.match(page, /DM Mono/);
  assert.match(page, /revenant|séance|seance|process-tomb|graveyard|charcoal bone|cold violet|candle soot/i);
  assert.match(page, /#0c0a0d|#cfc6b8|#6e5a9a|#b34728/);
  assert.match(page, /reaped/);
  assert.match(page, /revenant/);
  assert.match(page, /wedged/);
  assert.match(page, /score revenant or admit reaped/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /16:50/);
  assert.match(page, /#264/);
  assert.match(page, /#93274/);
  assert.match(page, /Get-CimInstance/);
  assert.match(page, /Win32_Process/);
  assert.match(page, /OpenProcess/);
  assert.match(page, /0xC0000409/);
  assert.match(page, /goldencircle1109/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /Reap the peers/);
  assert.match(page, /Score revenant/);
  assert.match(page, /Sound the tomb/);
  assert.match(page, /Tally the graves/);
  assert.doesNotMatch(page, /Young Serif/.test("x") ? /Literata/ : /Literata/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#e6d5b8/);
  assert.doesNotMatch(page, /#1b4d3e/);
  assert.doesNotMatch(page, /#a86b32/);
  assert.doesNotMatch(page, /#f4ead6/);
  assert.doesNotMatch(page, /#1c2744/);
  assert.doesNotMatch(page, /#c47a2c/);
  assert.doesNotMatch(page, /#f0d9a0/);
  assert.doesNotMatch(page, /#0a0e1c/);
  assert.doesNotMatch(page, /#12151f/);
  assert.doesNotMatch(page, /#c3924a/);
  assert.doesNotMatch(page, /#efe6d4/);
  assert.doesNotMatch(page, /night courtyard|black beans|bronze cymbals|chalk circles|bone-white masks/i);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID|iron coffer/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /philology|ochre gloss|cognate desk/i);
  assert.doesNotMatch(page, /writ desk|bond parchment|court green|bronze seal/i);
  assert.doesNotMatch(page, /flintlock|flash-pan|priming-pan/i);
  assert.doesNotMatch(page, /water.clock|clepsydra/i);
  assert.doesNotMatch(page, /\blaid\b/);
  assert.doesNotMatch(page, /\blemures\b/);
  assert.doesNotMatch(page, /\bremanent\b/);
  assert.doesNotMatch(page, /\bfreehold\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\btrunked\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bexpanded\b/);
  assert.doesNotMatch(page, /\bcognate\b/);
  assert.doesNotMatch(page, /\breplevin\b/);
  assert.doesNotMatch(page, /\brestored\b/);
  assert.doesNotMatch(page, /\bdefaulted\b/);
  assert.match(page, /NOT Replevin/i);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Seizing/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Ephemera/i);
  assert.match(page, /NOT Palimpsest/i);
  assert.match(page, /NOT Recension/i);
  assert.match(page, /NOT Quietus/i);
  assert.match(page, /NOT Calque/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Revenant/);
  assert.match(readme, /#93274/);
  assert.match(readme, /reaped/);
  assert.match(readme, /revenant/);
  assert.match(readme, /wedged/);
  assert.match(readme, /Young Serif/);
  assert.match(readme, /Mulish/);
  assert.match(readme, /DM Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Replevin/i);
  assert.match(readme, /NOT Cognate/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Seizing/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/revenant/);
  assert.match(readme, /node --test projects\/revenant\/revenant\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /Get-CimInstance/);
  assert.match(readme, /Win32_Process/);
  assert.match(readme, /0xC0000409/);
});

test("catalog #264 features Revenant; Replevin stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 264);
  assert.equal(catalog.products[0].name, "Revenant");
  assert.equal(catalog.products[0].slug, "revenant");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/revenant/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /16:50/);
  assert.match(catalog.products[0].summary, /revenant/);
  assert.match(catalog.products[0].summary, /#93274/);
  assert.match(catalog.products[0].summary, /reaped/);
  const replevin = catalog.products.find((row) => row.slug === "replevin");
  assert.ok(replevin);
  assert.equal(replevin.featured, false);
  const cognate = catalog.products.find((row) => row.slug === "cognate");
  assert.ok(cognate);
  assert.equal(cognate.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "revenant").length, 1);
});

test("vercel rewrites revenant to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/revenant");
  assert.equal(vercel.rewrites[0].destination, "/projects/revenant");
  assert.equal(vercel.rewrites[1].source, "/revenant/");
  assert.equal(vercel.rewrites[1].destination, "/projects/revenant");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
