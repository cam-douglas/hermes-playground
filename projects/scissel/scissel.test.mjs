import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BASH_C_LIMIT,
  BASH_N_PASS,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  CREATEPROCESS_DOC,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GIT_BASH,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MSYS_RUNTIME,
  NOT_PRODUCTS,
  NOGLOB_LIMIT,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PROCESS_CHAIN,
  PRODUCT_WORD,
  QUOTE_EXPAND,
  RULED_OUT,
  SAMPLE_SCISSELLED_BLANK,
  SAMPLE_SLASH,
  SAMPLE_STACK,
  SAMPLE_TRUNC,
  SAMPLE_WRAPPER,
  SCISSEL_WALK,
  SEEDED_WORD,
  SLASH_COLLAPSE_BYTES,
  STACK_BUFFER,
  STATE,
  STDIN_CONTROL_BYTES,
  SURFACE,
  SYNTAX_ERROR,
  TITLE,
  VERDICTS,
  WINERROR_206,
  WRAPPER_OVERHEAD,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectSlash,
  inspectStdin,
  inspectTrunc,
  mapPress,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedArgvTrunc,
  seedHold,
  seedPlenary,
  seedScissel,
  seedScisselled,
  seedSlashCollapse,
  seedStack8192,
  seedTrunc8203,
} from "./scissel.mjs";

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
  return fileURLToPath(new URL("./scissel.mjs", import.meta.url));
}

test("idle plenary is a hold; full command arrives via stdin", () => {
  const result = analyze(seedPlenary());
  assert.equal(result.verdict, "plenary");
  assert.equal(result.idleWord, "plenary");
  assert.equal(IDLE_WORD, "plenary");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.plenary, true);
  assert.equal(result.phrase, "admit plenary");
  assert.equal(result.scisselled, false);
  assert.equal(result.argvTrunc, false);
  assert.ok(HOLD_ALIASES.includes("plenary"));
  assert.ok(HOLD_ALIASES.includes("bash-s"));
  assert.ok(HOLD_ALIASES.includes("stdin-full"));
  assert.ok(HOLD_ALIASES.includes("slash-kept"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify plenary", () => {
  assert.equal(classify(emptyTicket()), "plenary");
  assert.equal(classify(""), "plenary");
  assert.equal(classify(null), "plenary");
  assert.equal(decide({}), "plenary");
});

test("#93915 seeded path scores scissel when the planchet is scisselled", () => {
  const result = analyze(seedScisselled());
  assert.equal(result.verdict, "scissel");
  assert.equal(result.seededWord, "scisselled");
  assert.equal(SEEDED_WORD, "scisselled");
  assert.equal(PRODUCT_WORD, "scissel");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.scisselled, true);
  assert.equal(result.phrase, "score scissel");
  assert.equal(result.argvTrunc, true);
  assert.equal(result.trunc8203, true);
  assert.equal(result.slashCollapse, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("trunc 8203 plus slash collapse is the #93915 scissel", () => {
  const cut = inspectTrunc({ scisselled: true, trunc8203: true });
  assert.equal(cut.stamp, "trunc-8203");
  assert.equal(cut.truncated, true);
  const scored = scoreGate({
    scisselled: true,
    argvTrunc: true,
    trunc8203: true,
    slashCollapse: true,
    cue: "scisselled",
    trunc: SAMPLE_TRUNC,
    slash: SAMPLE_SLASH,
    stack: SAMPLE_STACK,
  });
  assert.equal(scored.verdict, "scissel");
  assert.equal(scored.argvTrunc, true);
  const open = inspectTrunc({ plenary: true, trunc8203: false });
  assert.equal(open.stamp, "trunc-ok");
});

test("path word is argv-trunc; argv path seed holds the path", () => {
  assert.equal(PATH_WORD, "argv-trunc");
  const result = analyze(seedArgvTrunc());
  assert.equal(result.verdict, "argv-trunc");
  assert.equal(result.pathWord, "argv-trunc");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "argv-trunc", preferSeed: true, scisselled: true }),
    "argv-trunc",
  );
  assert.equal(classify(seedTrunc8203()), "trunc-8203");
});

test("HOLD includes plenary / hold", () => {
  assert.ok(HOLD.includes("plenary"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: trunc-8203, stack-8192, slash-collapse", () => {
  assert.equal(classify(seedTrunc8203()), "trunc-8203");
  assert.equal(classify(seedStack8192()), "stack-8192");
  assert.equal(classify(seedSlashCollapse()), "slash-collapse");
  assert.equal(classify(seedScissel()), "scissel");
});

test("booth fixtures flip plenary vs scisselled vs argv-trunc vs scissel", () => {
  const idle = scoreGate(seedPlenary());
  const seeded = scoreGate(seedScisselled());
  const plenary = readData("plenary.json");
  const scisselled = readData("scisselled.json");
  const path = readData("argv-trunc.json");
  const product = readData("scissel.json");
  const trunc = readData("trunc-8203.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "plenary");
  assert.equal(seeded.verdict, "scissel");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedPlenary()), "plenary");
  assert.equal(score(seedScisselled()), "scissel");
  assert.equal(plenary.trunc8203, false);
  assert.equal(plenary.plenary, true);
  assert.equal(scoreGate(plenary).verdict, "plenary");
  assert.equal(scisselled.argvTrunc, true);
  assert.equal(scisselled.trunc8203, true);
  assert.equal(scisselled.slashCollapse, true);
  assert.equal(classify(scisselled), "scisselled");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /8203|argv|-c|trunc/i);
  assert.match(path.paths[1].result, /8192|glob|stack|msys2/i);
  assert.equal(classify(path), "argv-trunc");
  assert.equal(classify(product), "scissel");
  assert.equal(product.hubCount, "SCISSEL");
  assert.equal(scisselled.issue, 93915);
  assert.equal(scisselled.scisselled, true);
  assert.equal(classify(trunc), "trunc-8203");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("stack-8192.json")), "stack-8192");
  assert.equal(classify(readData("slash-collapse.json")), "slash-collapse");
  assert.equal(classify(readData("winerror-206.json")), "winerror-206");
  assert.equal(classify(readData("eval-wrapper.json")), "eval-wrapper");
  assert.equal(classify(readData("quote-expand.json")), "quote-expand");
  assert.equal(classify(readData("bash-c.json")), "bash-c");
  assert.equal(classify(readData("msys-glob.json")), "msys-glob");
  assert.equal(classify(readData("bash-s.json")), "bash-s");
  assert.equal(classify(readData("stdin-full.json")), "stdin-full");
  assert.equal(classify(readData("slash-kept.json")), "slash-kept");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("plenary"));
  assert.ok(CHIPS.includes("scisselled"));
  assert.ok(CHIPS.includes("scissel"));
  assert.ok(CHIPS.includes("argv-trunc"));
  assert.ok(CHIPS.includes("trunc-8203"));
  assert.ok(CHIPS.includes("stack-8192"));
  assert.ok(CHIPS.includes("slash-collapse"));
  assert.ok(CHIPS.includes("winerror-206"));
  assert.ok(CHIPS.includes("bash-s"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("scisselled"));
  assert.ok(ALARM.includes("argv-trunc"));
  assert.ok(ALARM.includes("trunc-8203"));
  assert.ok(ALARM.includes("scissel"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published scissel walk scores scissel after the idle hold", () => {
  const booth = scoreWalk({ rows: SCISSEL_WALK });
  assert.equal(booth.verdict, "scissel");
  assert.ok(booth.scisselledCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-plenary");
  assert.equal(idle.plenary, true);
  assert.equal(idle.verdict, "plenary");
  const cut = booth.rows.find((row) => row.event === "trunc-8203");
  assert.equal(cut.trunc8203, true);
  const path = booth.rows.find((row) => row.event === "argv-trunc" && row.t === "path");
  assert.equal(path.verdict, "argv-trunc");
});

test("SCISSEL_WALK constant matches the issue mint walk", () => {
  assert.equal(SCISSEL_WALK[0].event, "cue-plenary");
  const cut = SCISSEL_WALK.find((row) => row.event === "trunc-8203");
  assert.equal(cut.trunc8203, true);
  const path = SCISSEL_WALK.find((row) => row.t === "path");
  assert.equal(path.scisselled, true);
  const scoreRow = SCISSEL_WALK.find((row) => row.event === "scissel");
  assert.equal(scoreRow.scisselled, true);
});

test("positive control plenary bash -s stays plenary", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "plenary");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "plenary");
  const hold = walk.rows.find((row) => row.event === "cue-plenary");
  assert.equal(hold.plenary, true);
  assert.equal(hold.verdict, "plenary");
});

test("issue constants encode only #93915 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93915);
  assert.ok(ISSUE_URL.includes("93915"));
  assert.match(TITLE, /Windows|8KB|truncated|backslash|argv|MSYS2/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(HOST, /Windows 11 Pro 10\.0\.26200/);
  assert.equal(GIT_BASH, "5.3.15(1)-release");
  assert.match(MSYS_RUNTIME, /MINGW64_NT-10\.0-26200 3\.6\.9/);
  assert.equal(PROCESS_CHAIN, "claude.exe → bash.exe");
  assert.equal(BASH_C_LIMIT, 8203);
  assert.equal(STACK_BUFFER, 8192);
  assert.equal(SLASH_COLLAPSE_BYTES, 295);
  assert.equal(STDIN_CONTROL_BYTES, 259000);
  assert.equal(WINERROR_206, 206);
  assert.equal(WRAPPER_OVERHEAD, 1024);
  assert.equal(QUOTE_EXPAND, 5);
  assert.equal(NOGLOB_LIMIT, 32731);
  assert.equal(CREATEPROCESS_DOC, 32767);
  assert.equal(BASH_N_PASS, "30/31");
  assert.match(SYNTAX_ERROR, /unexpected EOF/);
  assert.match(CLAUDE_VERSION, /Bash|Windows|MSYS2/i);
  assert.match(GOOD_VERSION, /bash -s|stdin|259/i);
  assert.equal(SURFACE, "bash-c-argv");
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:windows",
    "area:bash",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /cmd\.exe|8191/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /bash -n|30\/31/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /noglob|32731/i.test(row)));
  assert.ok(EXPECTED.some((row) => /bash -s|stdin/i.test(row)));
  assert.match(DISTRIBUTION, /8203|8192|295|WinError 206|bash -s|eval|#15003|#178/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("argv-trunc"));
  assert.ok(FINGERPRINT_LINES.includes("scisselled"));
  assert.equal(PHRASE, "Score scissel or admit plenary.");
  assert.equal(SAMPLE_SCISSELLED_BLANK.truncated, true);
  assert.equal(SAMPLE_TRUNC.limit, 8203);
  assert.equal(SAMPLE_STACK.buffer, 8192);
  assert.equal(SAMPLE_SLASH.bytes, 295);
  assert.equal(SAMPLE_WRAPPER.quoteExpand, 5);
});

test("has-repro fingerprints encode the published scisselled blank", () => {
  const result = handle(seedScisselled());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "bash-c-argv");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedScisselled()),
    /scissel\|trunc=8203\|stack=8192\|slash=295\|winerror=206\|path=argv-trunc\|cue=argv-trunc/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Feoffee, Apograph, Airlock, Scotoma, Aneroid, Canard", () => {
  const required = [
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
    "calibrated",
    "aneroided",
    "wrong-window-ring",
    "simulacrum",
    "tethered",
    "hollow",
    "phantom-navigate",
    "solenoid",
    "engaged",
    "inert",
    "warm-before-message",
    "armed",
    "coil-pulled",
    "scotia",
    "scotiated",
    "decstbm-undershoot",
    "flush",
    "canard",
    "candid",
    "canarded",
    "onedrive-cwd",
    "stetted",
    "rewound",
    "stet",
    "mic-resume-wipe",
    "sighted",
    "blindsided",
    "blindside",
    "compare-ref-unreachable",
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
    "gleaned",
    "orphaned",
    "inherited",
    "gleaner",
    "live",
    "schismed",
    "schism",
    "swept",
    "ashpanned",
    "ashpan",
    "seised",
    "disseised",
    "disseisin",
    "intact",
    "rasure",
    "keyed",
    "voiced",
    "muted",
    "sourdine",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
    "scapegoat",
    "galley",
    "stop-dirty",
    "primed",
    "warm",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("plenary booth flips scisselled back when stdin hopper is used", () => {
  const tape = {
    plenary: true,
    scisselled: false,
    trunc8203: false,
    cue: "plenary",
  };
  assert.equal(scoreGate(tape).verdict, "plenary");
  tape.plenary = false;
  tape.scisselled = true;
  tape.argvTrunc = true;
  tape.trunc8203 = true;
  tape.slashCollapse = true;
  tape.cue = "scisselled";
  assert.equal(scoreGate(tape).verdict, "scissel");
  tape.plenary = true;
  tape.scisselled = false;
  tape.argvTrunc = false;
  tape.trunc8203 = false;
  tape.slashCollapse = false;
  tape.cue = "plenary";
  assert.equal(scoreGate(tape).verdict, "plenary");
});

test("trunc, slash, stdin, and readBooth mark the scisselled blank", () => {
  const idle = inspectTrunc({
    plenary: true,
    trunc: { truncated: false },
  });
  assert.equal(idle.stamp, "trunc-ok");
  const slash = inspectSlash({ scisselled: true, slash: SAMPLE_SLASH });
  assert.equal(slash.stamp, "slash-collapse");
  assert.equal(slash.bytes, 295);
  const stdin = inspectStdin({ plenary: true, bashS: true });
  assert.equal(stdin.stamp, "bash-s");
  const booth = readBooth({
    scisselled: true,
    trunc8203: true,
    trunc: SAMPLE_TRUNC,
    slash: SAMPLE_SLASH,
  });
  assert.equal(booth.scisselled, true);
  assert.equal(booth.mark, "scisselled");
  const open = readBooth({
    plenary: true,
    scisselled: false,
    trunc8203: false,
  });
  assert.equal(open.scisselled, false);
  assert.equal(open.mark, "plenary");
});

test("mapPress encodes the published argv punch", () => {
  const miss = mapPress({ scisselled: true, trunc8203: true });
  assert.equal(miss.stamp, "argv-trunc");
  assert.equal(miss.dieLane, "punched");
  assert.equal(miss.seal, "scisselled");
  const clear = mapPress({ plenary: true, scisselled: false });
  assert.equal(clear.stamp, "plenary-hopper");
  assert.equal(clear.hopperLane, "open");
  assert.equal(clear.scrap, "none");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 15003);
  assert.equal(COUSINS[0].repo, "openai/codex");
  assert.equal(COUSINS[1].issue, 178);
  assert.equal(COUSINS[1].repo, "msys2/msys2-runtime");
  assert.equal(COUSINS[2].repo, "zetaloop/msys2-argv-fix");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("waif"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[1].issue, 93770);
  assert.equal(BACKUPS[2].issue, 93777);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93889);
  assert.equal(BACKUPS[5].issue, 93821);
  assert.equal(BACKUPS[6].issue, 93811);
  assert.equal(BACKUPS[7].issue, 93809);
  assert.equal(BACKUPS[8].issue, 93823);
  assert.equal(BACKUPS[9].issue, 93929);
  assert.equal(BACKUPS[10].issue, 93848);
  assert.equal(BACKUPS[11].issue, 93924);
  assert.equal(BACKUPS[12].issue, 93925);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93915));
  assert.ok(!BACKUPS.some((row) => row.issue === 15003));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scisselled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const plenaryFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/plenary.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(plenaryFix.status, 0, plenaryFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const plenaryOut = JSON.parse(plenaryFix.stdout);
  assert.equal(idleOut.verdict, "plenary");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "scisselled");
  assert.equal(seededOut.alarm, true);
  assert.equal(plenaryOut.verdict, "plenary");
  assert.equal(plenaryOut.hold, true);
});

test("handle exposes published hypothesis and #93915 headline", () => {
  const result = handle(seedScisselled());
  assert.equal(result.published.issue, 93915);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [15003, 178, "msys2-argv-fix"]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93929));
  assert.ok(result.published.backups.includes(93925));
  assert.ok(!result.published.backups.includes(93915));
  assert.match(result.published.hypothesis, /8192|build_argv|glob|msys2-runtime#178/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93915/);
  assert.equal(result.published.bashCLimit, 8203);
  assert.equal(result.published.slashCollapseBytes, 295);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a mint / coin-press / punch-and-scissel booth, not feoffee or apograph", () => {
  const page = readPage();
  assert.match(page, /Oswald/);
  assert.match(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /scissel|plenary|scisselled|argv-trunc|mint|planchet|die punch/i);
  assert.match(page, /#121417|#C8CED6|#B87333|#E8F0FF|#D4A017|#8B3A2F/i);
  assert.match(page, /\bplenary\b/);
  assert.match(page, /\bscisselled\b/);
  assert.match(page, /argv-trunc/);
  assert.match(page, /Score scissel or admit plenary/i);
  assert.match(page, /#15003|#178|cousin/i);
  assert.match(page, /#329/);
  assert.match(page, /#93915/);
  assert.match(page, /Admit plenary/);
  assert.match(page, /Score scissel/);
  assert.match(page, /Walk argv-trunc/);
  assert.match(page, /Compare plenary \/ scisselled/);
  assert.match(page, /Pin idle plenary/);
  assert.match(page, /Pin seeded scisselled/);
  assert.match(page, /Pin argv-trunc/);
  assert.match(page, /Strike the die/);
  assert.match(page, /8203|8192|295|WinError 206|bash -s|eval/i);
  assert.match(page, /planchet|scissel|die|hopper|press/i);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /#2C2118/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#7A1F1F/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#3F5D4A/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|galley-proof|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /limestone|scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
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
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Waif/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Disseisin/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Scissel/);
  assert.match(readme, /#93915/);
  assert.match(readme, /\bplenary\b/);
  assert.match(readme, /\bscisselled\b/);
  assert.match(readme, /argv-trunc/);
  assert.match(readme, /Oswald/);
  assert.match(readme, /IBM Plex Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
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
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Waif/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /8203|8192|295|bash -s|WinError 206/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/scissel/);
  assert.match(readme, /node --test projects\/scissel\/scissel\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /scissel|mint|coin-press|planchet|die punch/i);
  assert.match(readme, /Score scissel or admit plenary/);
  assert.match(readme, /#15003|#178|msys2-argv-fix/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93889|#93821|#93811|#93809|#93823|#93929|#93848|#93924|#93925/);
  assert.match(readme, /11:50/);
});

test("catalog features Mojibake; Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Canard unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 330);
  assert.equal(hub.products.length, 330);
  assert.equal(catalog.products[0].name, "Mojibake");
  assert.equal(catalog.products[0].slug, "mojibake");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/mojibake/");
  const scissel = catalog.products.find((row) => row.slug === "scissel");
  assert.ok(scissel);
  assert.equal(scissel.featured, false);
  assert.equal(scissel.href, "/scissel/");
  assert.equal(scissel.day, "2026-09-13");
  assert.match(scissel.summary, /11:50 scissel|#93915|mint|coin-press|punch-and-scissel/i);
  assert.match(scissel.summary, /\bplenary\b/);
  assert.match(scissel.summary, /\bscisselled\b/);
  assert.match(scissel.summary, /argv-trunc/);
  assert.match(scissel.summary, /Score scissel or admit plenary/);
  assert.equal(hub.products[0].slug, "mojibake");
  assert.equal(hub.products[0].featured, true);
  const feoffee = catalog.products.find((row) => row.slug === "feoffee");
  assert.ok(feoffee);
  assert.equal(feoffee.featured, false);
  const apograph = catalog.products.find((row) => row.slug === "apograph");
  assert.ok(apograph);
  assert.equal(apograph.featured, false);
  const airlock = catalog.products.find((row) => row.slug === "airlock");
  assert.ok(airlock);
  assert.equal(airlock.featured, false);
  const scotoma = catalog.products.find((row) => row.slug === "scotoma");
  assert.ok(scotoma);
  assert.equal(scotoma.featured, false);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "scissel").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93915") && row.slug !== "scissel"));
});

test("vercel rewrites scissel after mojibake at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/mojibake");
  assert.equal(vercel.rewrites[3].source, "/scissel");
  assert.equal(vercel.rewrites[3].destination, "/projects/scissel");
  assert.equal(vercel.rewrites[4].source, "/scissel/");
  assert.equal(vercel.rewrites[4].destination, "/projects/scissel");
  assert.equal(vercel.rewrites[5].source, "/scissel/:path*");
  assert.equal(vercel.rewrites[5].destination, "/projects/scissel/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
