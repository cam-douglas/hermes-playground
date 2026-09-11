import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  APOSIOPESIS_WALK,
  BACKUPS,
  BINARY_PATH,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  INSTALLER,
  ISSUE_URL,
  LABELS,
  LAUNCH,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PRIOR_VERSION,
  PRODUCT_WORD,
  SAMPLE_LEDGER,
  SAMPLE_LINE,
  SAMPLE_RAIL,
  SAMPLE_SEAL,
  SAMPLE_SESSIONS,
  SEEDED_WORD,
  SESSION_KIND,
  SETTINGS_PATH,
  SPAWN_LOG,
  SPEECH_STATIONS,
  STATE,
  STATUSLINE_COMMAND,
  STATUSLINE_TYPE,
  TERM,
  TITLE,
  TUI,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDebug,
  inspectLedger,
  inspectLine,
  inspectRail,
  inspectSeal,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAposiopesis,
  seedBlankRail,
  seedCloneBlank,
  seedConcurrent267,
  seedFullscreenInsufficient,
  seedFurled,
  seedGitCwd,
  seedGitCwdMute,
  seedHold,
  seedHomeRenders,
  seedNeverSpawned,
  seedNoDebugLine,
  seedNoError,
  seedNoStaleText,
  seedNotTrust,
  seedRaised,
  seedRegression268,
  seedRendered,
  seedScriptOkByHand,
  seedSettingsHooksConfound,
  seedSpawned,
  seedWorktreeBlank,
  seedZeroSpawns,
} from "./aposiopesis.mjs";

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
  return fileURLToPath(new URL("./aposiopesis.mjs", import.meta.url));
}

test("idle raised is a hold; statusLine spawned and rendered", () => {
  const result = analyze(seedRaised());
  assert.equal(result.verdict, "raised");
  assert.equal(result.idleWord, "raised");
  assert.equal(IDLE_WORD, "raised");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.raised, true);
  assert.equal(result.phrase, "admit raised");
  assert.equal(result.furled, false);
  assert.equal(result.gitCwdMute, false);
  assert.equal(result.spawned, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify raised", () => {
  assert.equal(classify(emptyTicket()), "raised");
  assert.equal(classify(""), "raised");
  assert.equal(classify(null), "raised");
  assert.equal(decide({}), "raised");
});

test("#93588 seeded path scores furled when git cwd never spawns", () => {
  const result = analyze(seedFurled());
  assert.equal(result.verdict, "furled");
  assert.equal(result.seededWord, "furled");
  assert.equal(SEEDED_WORD, "furled");
  assert.equal(PRODUCT_WORD, "aposiopesis");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.furled, true);
  assert.equal(result.phrase, "score aposiopesis");
  assert.equal(result.neverSpawned, true);
  assert.equal(result.blankRail, true);
  assert.equal(result.zeroSpawns, true);
  assert.equal(result.gitCwd, true);
  assert.equal(result.worktreeBlank, true);
  assert.equal(result.noDebugLine, true);
  assert.equal(result.gitCwdMute, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("never spawned plus blank rail is the #93588 aposiopesis", () => {
  const line = inspectLine({ furled: true, neverSpawned: true });
  assert.equal(line.stamp, "cut");
  assert.equal(line.spoken, false);
  const scored = scoreGate({
    furled: true,
    neverSpawned: true,
    blankRail: true,
    zeroSpawns: true,
    gitCwd: true,
    gitCwdMute: true,
    cue: "furled",
    ledger: SAMPLE_LEDGER,
    rail: SAMPLE_RAIL,
  });
  assert.equal(scored.verdict, "furled");
  assert.equal(scored.gitCwdMute, true);
  const calm = inspectLine({ raised: true, spawned: true });
  assert.equal(calm.stamp, "speaking");
});

test("path word is git-cwd-mute; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "git-cwd-mute");
  const result = analyze(seedGitCwdMute());
  assert.equal(result.verdict, "git-cwd-mute");
  assert.equal(result.pathWord, "git-cwd-mute");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "git-cwd-mute", preferSeed: true, furled: true }),
    "git-cwd-mute",
  );
  assert.equal(classify(seedZeroSpawns()), "zero-spawns");
});

test("HOLD includes raised / hold", () => {
  assert.ok(HOLD.includes("raised"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: zero-spawns, worktree-blank, no-debug-line, not-trust", () => {
  assert.equal(classify(seedSpawned()), "spawned");
  assert.equal(classify(seedRendered()), "rendered");
  assert.equal(classify(seedZeroSpawns()), "zero-spawns");
  assert.equal(classify(seedHomeRenders()), "home-renders");
  assert.equal(classify(seedWorktreeBlank()), "worktree-blank");
  assert.equal(classify(seedCloneBlank()), "clone-blank");
  assert.equal(classify(seedNoDebugLine()), "no-debug-line");
  assert.equal(classify(seedNotTrust()), "not-trust");
  assert.equal(classify(seedScriptOkByHand()), "script-ok-by-hand");
  assert.equal(classify(seedFullscreenInsufficient()), "fullscreen-insufficient");
  assert.equal(classify(seedConcurrent267()), "concurrent-267");
  assert.equal(classify(seedSettingsHooksConfound()), "settings-hooks-confound");
  assert.equal(classify(seedGitCwd()), "git-cwd");
  assert.equal(classify(seedNeverSpawned()), "never-spawned");
  assert.equal(classify(seedBlankRail()), "blank-rail");
  assert.equal(classify(seedNoError()), "no-error");
  assert.equal(classify(seedNoStaleText()), "no-stale-text");
  assert.equal(classify(seedRegression268()), "regression-268");
  assert.equal(classify(seedAposiopesis()), "aposiopesis");
});

test("booth fixtures flip raised vs furled vs git-cwd-mute vs aposiopesis", () => {
  const idle = scoreGate(seedRaised());
  const seeded = scoreGate(readData("furled.json"));
  const raised = readData("raised.json");
  const furled = readData("furled.json");
  const path = readData("git-cwd-mute.json");
  const product = readData("aposiopesis.json");
  const zero = readData("zero-spawns.json");
  const home = readData("home-renders.json");
  const worktree = readData("worktree-blank.json");
  const debug = readData("no-debug-line.json");
  const trust = readData("not-trust.json");
  const hand = readData("script-ok-by-hand.json");
  const tui = readData("fullscreen-insufficient.json");
  const confound = readData("settings-hooks-confound.json");
  assert.equal(idle.verdict, "raised");
  assert.equal(seeded.verdict, "furled");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedRaised()), "raised");
  assert.equal(score(readData("furled.json")), "furled");
  assert.equal(raised.spawned, true);
  assert.equal(raised.raised, true);
  assert.equal(scoreGate(raised).verdict, "raised");
  assert.equal(furled.neverSpawned, true);
  assert.equal(furled.blankRail, true);
  assert.equal(furled.gitCwd, true);
  assert.equal(classify(furled), "furled");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /git clone/);
  assert.match(path.paths[2].result, /renders/);
  assert.equal(classify(path), "git-cwd-mute");
  assert.equal(classify(product), "aposiopesis");
  assert.equal(product.hubCount, "APOSIOPESIS");
  assert.equal(furled.issue, 93588);
  assert.equal(furled.furled, true);
  assert.equal(classify(zero), "zero-spawns");
  assert.equal(classify(home), "home-renders");
  assert.equal(classify(worktree), "worktree-blank");
  assert.equal(classify(debug), "no-debug-line");
  assert.equal(classify(trust), "not-trust");
  assert.equal(classify(hand), "script-ok-by-hand");
  assert.equal(classify(tui), "fullscreen-insufficient");
  assert.equal(classify(confound), "settings-hooks-confound");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("raised"));
  assert.ok(CHIPS.includes("furled"));
  assert.ok(CHIPS.includes("aposiopesis"));
  assert.ok(CHIPS.includes("git-cwd-mute"));
  assert.ok(CHIPS.includes("zero-spawns"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("furled"));
  assert.ok(ALARM.includes("git-cwd-mute"));
  assert.ok(ALARM.includes("zero-spawns"));
  assert.ok(ALARM.includes("aposiopesis"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published aposiopesis walk scores furled after the idle hold", () => {
  const speech = scoreWalk({ rows: APOSIOPESIS_WALK });
  assert.equal(speech.verdict, "furled");
  assert.ok(speech.furledCount >= 1);
  const idle = speech.rows.find((row) => row.event === "cue-raised");
  assert.equal(idle.raised, true);
  assert.equal(idle.verdict, "raised");
  const mute = speech.rows.find((row) => row.event === "never-spawned");
  assert.equal(mute.neverSpawned, true);
  const path = speech.rows.find((row) => row.event === "git-cwd-mute");
  assert.equal(path.verdict, "git-cwd-mute");
});

test("APOSIOPESIS_WALK constant matches the issue speech-break walk", () => {
  assert.equal(APOSIOPESIS_WALK[0].event, "cue-raised");
  const mute = APOSIOPESIS_WALK.find((row) => row.event === "never-spawned");
  assert.equal(mute.neverSpawned, true);
  const path = APOSIOPESIS_WALK.find((row) => row.event === "git-cwd-mute");
  assert.equal(path.furled, true);
  const scoreRow = APOSIOPESIS_WALK.find((row) => row.event === "aposiopesis");
  assert.equal(scoreRow.furled, true);
});

test("positive control home-renders stays raised", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "raised");
  const home = walk.rows.find((row) => row.event === "home-renders");
  assert.equal(home.verdict, "raised");
  const spawned = walk.rows.find((row) => row.event === "spawned");
  assert.equal(spawned.spawned, true);
  assert.equal(spawned.verdict, "raised");
});

test("issue constants encode only #93588 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93588);
  assert.ok(ISSUE_URL.includes("93588"));
  assert.match(TITLE, /statusLine command is never invoked/);
  assert.match(TITLE, /git repo/);
  assert.match(TITLE, /2\.1\.268/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(LABELS.includes("area:statusline"));
  assert.equal(CLAUDE_CODE_VERSION, "2.1.268");
  assert.equal(PRIOR_VERSION, "2.1.267");
  assert.match(OS, /Darwin 25\.5\.0/);
  assert.match(CLIENT, /iTerm2 3\.6\.11/);
  assert.equal(TERM, "xterm-256color");
  assert.equal(INSTALLER, "native installer");
  assert.equal(BINARY_PATH, "~/.local/share/claude/versions/2.1.268");
  assert.equal(SETTINGS_PATH, "~/.claude/settings.json");
  assert.equal(STATUSLINE_TYPE, "command");
  assert.match(STATUSLINE_COMMAND, /statusline\.sh/);
  assert.equal(TUI, "fullscreen");
  assert.equal(LAUNCH, "claude --dangerously-skip-permissions");
  assert.equal(SPAWN_LOG, "/tmp/statusline-sessions.log");
  assert.match(DISTRIBUTION, /2\.1\.268/);
  assert.match(SESSION_KIND, /git worktree/);
  assert.equal(SPEECH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("git-cwd-mute"));
  assert.ok(FINGERPRINT_LINES.includes("furled"));
  assert.match(PHRASE, /Score aposiopesis or admit raised/);
  assert.equal(SAMPLE_LINE.cut, true);
  assert.equal(SAMPLE_RAIL.empty, true);
  assert.equal(SAMPLE_RAIL.error, false);
  assert.equal(SAMPLE_SEAL.git, true);
  assert.equal(SAMPLE_SESSIONS.length, 4);
  assert.equal(SAMPLE_SESSIONS[0].id, "A");
  assert.equal(SAMPLE_SESSIONS[1].spawned, false);
  assert.equal(SAMPLE_SESSIONS[2].worktree, true);
  assert.equal(SAMPLE_SESSIONS[3].version, "2.1.267");
  assert.equal(SAMPLE_LEDGER[1].spawns, 0);
});

test("has-repro fingerprints encode the published git-cwd silence", () => {
  const result = handle(readData("furled.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.match(result.published.sessionKind, /git clone/);
  assert.equal(result.published.statuslineType, "command");
  assert.match(
    fingerprint(seedFurled()),
    /furled\|line=cut\|rail=blank\|seal=git\|ledger=silent\|debug=absent\|path=git-cwd-mute\|cue=git-cwd-mute/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Disseisin and Analepsis", () => {
  const required = [
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
    "compline",
    "lingering",
    "unrung",
    "closed",
    "sealed",
    "blanked",
    "cipherlock",
    "untainted",
    "attainted",
    "attainder",
    "voiced",
    "muted",
    "sourdine",
    "lodged",
    "dropped",
    "forksink",
    "aphonia",
    "deadair",
    "lacuna",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("raised gathering flips furled back when the line is spoken", () => {
  const tape = {
    raised: true,
    furled: false,
    spawned: true,
    rendered: true,
    cue: "raised",
  };
  assert.equal(scoreGate(tape).verdict, "raised");
  tape.raised = false;
  tape.furled = true;
  tape.neverSpawned = true;
  tape.blankRail = true;
  tape.gitCwd = true;
  tape.cue = "furled";
  assert.equal(scoreGate(tape).verdict, "furled");
  tape.raised = true;
  tape.furled = false;
  tape.neverSpawned = false;
  tape.blankRail = false;
  tape.gitCwd = false;
  tape.cue = "raised";
  assert.equal(scoreGate(tape).verdict, "raised");
});

test("line, rail, seal, ledger, debug, and readBooth mark the speech-break", () => {
  const idle = inspectLine({ raised: true, spawned: true, line: { spoken: true, cut: false } });
  assert.equal(idle.stamp, "speaking");
  const rail = inspectRail({ furled: true, rail: SAMPLE_RAIL });
  assert.equal(rail.stamp, "blank");
  assert.equal(rail.empty, true);
  const seal = inspectSeal({ gitCwd: true, seal: SAMPLE_SEAL });
  assert.equal(seal.stamp, "sealed");
  const ledger = inspectLedger({ furled: true, zeroSpawns: true, ledger: SAMPLE_LEDGER });
  assert.equal(ledger.stamp, "silent");
  assert.equal(ledger.bZero, true);
  const debug = inspectDebug({ furled: true, noDebugLine: true });
  assert.equal(debug.stamp, "absent");
  const booth = readBooth({
    furled: true,
    neverSpawned: true,
    blankRail: true,
    gitCwd: true,
    ledger: SAMPLE_LEDGER,
    rail: SAMPLE_RAIL,
  });
  assert.equal(booth.furled, true);
  assert.equal(booth.mark, "furled");
  const calm = readBooth({
    raised: true,
    furled: false,
    spawned: true,
    rendered: true,
  });
  assert.equal(calm.furled, false);
  assert.equal(calm.mark, "raised");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 50679);
  assert.equal(COUSINS[1].issue, 18475);
  assert.equal(COUSINS[2].issue, 82885);
  assert.equal(COUSINS[3].issue, 58167);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /mid-task overwrite/);
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("analepsis"));
  assert.ok(NOT_PRODUCTS.includes("monstrance"));
  assert.ok(NOT_PRODUCTS.includes("compline"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("lacuna"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93576);
  assert.equal(BACKUPS[1].issue, 93553);
  assert.equal(BACKUPS[2].issue, 93595);
  assert.equal(BACKUPS[3].issue, 93589);
  assert.equal(BACKUPS[7].issue, 93570);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/furled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "raised");
  assert.equal(JSON.parse(seeded.stdout).verdict, "furled");
});

test("handle exposes published hypothesis and #93588 headline", () => {
  const result = handle(readData("furled.json"));
  assert.equal(result.published.issue, 93588);
  assert.equal(result.published.claudeCodeVersion, "2.1.268");
  assert.deepEqual(result.published.cousins, [50679, 18475, 82885, 58167]);
  assert.ok(result.published.backups.includes(93576));
  assert.ok(result.published.backups.includes(93595));
  assert.ok(result.published.backups.includes(93570));
  assert.match(result.published.hypothesis, /git-cwd/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /settings\/hooks/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a manuscript speech-break booth, not manor-court or flashback", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Sora/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /aposiopesis|em-dash|speech-break|status rail|git-root|silence ledger/i);
  assert.match(page, /#F7F1E6|#1C1917|#FFFEFA|#B45309|#0F766E|#78716C/i);
  assert.match(page, /\braised\b/);
  assert.match(page, /furled/);
  assert.match(page, /git-cwd-mute/);
  assert.match(page, /Score aposiopesis or admit raised/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /20:50/);
  assert.match(page, /#292/);
  assert.match(page, /#93588/);
  assert.match(page, /2\.1\.268/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /statusLine/);
  assert.match(page, /Speak the line/);
  assert.match(page, /Score aposiopesis/);
  assert.match(page, /Cut the dash/);
  assert.match(page, /Compare raised \/ furled/);
  assert.match(page, /Pin idle raised/);
  assert.match(page, /Pin seeded furled/);
  assert.match(page, /Pin git-cwd-mute/);
  assert.match(page, /Raise the rail/);
  assert.doesNotMatch(page, /Crimson Pro/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Ubuntu Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Gilda Display/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Anonymous Pro/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /#F7E8C8/);
  assert.doesNotMatch(page, /#2F2418/);
  assert.doesNotMatch(page, /#7A3A28/);
  assert.doesNotMatch(page, /#C48A3A/);
  assert.doesNotMatch(page, /#F3E6CE/);
  assert.doesNotMatch(page, /#2A1A14/);
  assert.doesNotMatch(page, /#C17A45/);
  assert.doesNotMatch(page, /#140E18/);
  assert.doesNotMatch(page, /#D4A84B/);
  assert.doesNotMatch(page, /#8C6A2F/);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /laryngoscope|broadcast booth|dead-air|carrier squelch/i);
  assert.doesNotMatch(page, /\bseised\b/);
  assert.doesNotMatch(page, /\bdisseised\b/);
  assert.doesNotMatch(page, /\bordered\b/);
  assert.doesNotMatch(page, /\bredelivered\b/);
  assert.doesNotMatch(page, /\bviewed\b/);
  assert.doesNotMatch(page, /\bwithheld\b/);
  assert.doesNotMatch(page, /\bvoiced\b/);
  assert.doesNotMatch(page, /\bmuted\b/);
  assert.match(page, /NOT Disseisin/i);
  assert.match(page, /NOT Analepsis/i);
  assert.match(page, /NOT Monstrance/i);
  assert.match(page, /NOT Compline/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Deadair/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Aposiopesis/);
  assert.match(readme, /#93588/);
  assert.match(readme, /\braised\b/);
  assert.match(readme, /furled/);
  assert.match(readme, /git-cwd-mute/);
  assert.match(readme, /Literata/);
  assert.match(readme, /Sora/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /NOT Analepsis/i);
  assert.match(readme, /NOT Monstrance/i);
  assert.match(readme, /NOT Compline/i);
  assert.match(readme, /NOT Sourdine/i);
  assert.match(readme, /NOT Aphonia/i);
  assert.match(readme, /NOT Deadair/i);
  assert.match(readme, /#50679/);
  assert.match(readme, /2\.1\.268/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/aposiopesis/);
  assert.match(readme, /node --test projects\/aposiopesis\/aposiopesis\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.match(readme, /statusLine/);
  assert.match(readme, /Score aposiopesis or admit raised/);
});

test("catalog features Aposiopesis only; Disseisin unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 292);
  assert.equal(hub.products.length, 292);
  assert.equal(catalog.products[0].name, "Aposiopesis");
  assert.equal(catalog.products[0].slug, "aposiopesis");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/aposiopesis/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /20:50/);
  assert.match(catalog.products[0].summary, /aposiopesis/);
  assert.match(catalog.products[0].summary, /#93588/);
  assert.match(catalog.products[0].summary, /\braised\b/);
  assert.match(catalog.products[0].summary, /furled/);
  assert.match(catalog.products[0].summary, /git-cwd-mute/);
  assert.equal(hub.products[0].slug, "aposiopesis");
  assert.equal(hub.products[0].featured, true);
  const disseisin = catalog.products.find((row) => row.slug === "disseisin");
  assert.ok(disseisin);
  assert.equal(disseisin.featured, false);
  const analepsis = catalog.products.find((row) => row.slug === "analepsis");
  assert.ok(analepsis);
  assert.equal(analepsis.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "aposiopesis").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93588") && row.slug !== "aposiopesis"));
});

test("vercel rewrites aposiopesis to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/aposiopesis");
  assert.equal(vercel.rewrites[0].destination, "/projects/aposiopesis");
  assert.equal(vercel.rewrites[1].source, "/aposiopesis/");
  assert.equal(vercel.rewrites[1].destination, "/projects/aposiopesis");
  assert.equal(vercel.rewrites[2].source, "/aposiopesis/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/aposiopesis/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
