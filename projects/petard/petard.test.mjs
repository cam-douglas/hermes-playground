import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  COUSINS,
  DISTRIBUTION,
  EXIT_CODE,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GUARD_VERSION,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PATTERN,
  PETARD_WALK,
  PHRASE,
  PKILL_CMD,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  SAMPLE_ARGV,
  SAMPLE_CALLS,
  SAMPLE_FUSE,
  SAMPLE_LEDGER,
  SAMPLE_WRAPPER,
  SEEDED_WORD,
  SESSION_KIND,
  START_CMD,
  STATE,
  STILL_ALIVE,
  TITLE,
  TOOL,
  TRENCH_STATIONS,
  VERDICTS,
  WRAPPER,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectArgv,
  inspectFuse,
  inspectGuard,
  inspectLedger,
  inspectWrapper,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedArgvLeak,
  seedBracketPartial,
  seedBusyboxMatch,
  seedChangingPid,
  seedCliGuardOnly,
  seedEvalInArgv,
  seedExit144,
  seedFromFileOk,
  seedHeadlessRepeat,
  seedHold,
  seedHoisted,
  seedIsError,
  seedLinuxProcps,
  seedMacosAncestorsOk,
  seedPetard,
  seedPgrepUnwrapped,
  seedPhantomPid,
  seedSameCallDies,
  seedStanding,
  seedStillAlive,
  seedWrapperArgv,
  seedWrapperUnchecked,
} from "./petard.mjs";

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
  return fileURLToPath(new URL("./petard.mjs", import.meta.url));
}

test("idle standing is a hold; wrapper still alive; still alive prints", () => {
  const result = analyze(seedStanding());
  assert.equal(result.verdict, "standing");
  assert.equal(result.idleWord, "standing");
  assert.equal(IDLE_WORD, "standing");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.standing, true);
  assert.equal(result.phrase, "admit standing");
  assert.equal(result.hoisted, false);
  assert.equal(result.wrapperArgv, false);
  assert.equal(result.wrapperAlive, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify standing", () => {
  assert.equal(classify(emptyTicket()), "standing");
  assert.equal(classify(""), "standing");
  assert.equal(classify(null), "standing");
  assert.equal(decide({}), "standing");
});

test("#93607 seeded path scores hoisted when pkill -f kills the wrapper", () => {
  const result = analyze(seedHoisted());
  assert.equal(result.verdict, "hoisted");
  assert.equal(result.seededWord, "hoisted");
  assert.equal(SEEDED_WORD, "hoisted");
  assert.equal(PRODUCT_WORD, "petard");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.hoisted, true);
  assert.equal(result.phrase, "score petard");
  assert.equal(result.wrapperKilled, true);
  assert.equal(result.exit144, true);
  assert.equal(result.stillAliveMissing, true);
  assert.equal(result.argvLeak, true);
  assert.equal(result.wrapperArgv, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("wrapper killed plus exit 144 is the #93607 petard", () => {
  const fuse = inspectFuse({ hoisted: true, wrapperKilled: true });
  assert.equal(fuse.stamp, "blown");
  assert.equal(fuse.stillAlivePrinted, false);
  const scored = scoreGate({
    hoisted: true,
    wrapperKilled: true,
    exit144: true,
    stillAliveMissing: true,
    argvLeak: true,
    wrapperArgv: true,
    cue: "hoisted",
    ledger: SAMPLE_LEDGER,
    fuse: SAMPLE_FUSE,
  });
  assert.equal(scored.verdict, "hoisted");
  assert.equal(scored.wrapperArgv, true);
  const calm = inspectFuse({ standing: true, stillAlive: true });
  assert.equal(calm.stamp, "standing");
});

test("path word is wrapper-argv; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "wrapper-argv");
  const result = analyze(seedWrapperArgv());
  assert.equal(result.verdict, "wrapper-argv");
  assert.equal(result.pathWord, "wrapper-argv");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "wrapper-argv", preferSeed: true, hoisted: true }),
    "wrapper-argv",
  );
  assert.equal(classify(seedExit144()), "exit-144");
});

test("HOLD includes standing / hold", () => {
  assert.ok(HOLD.includes("standing"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: exit-144, phantom-pid, cli-guard-only, same-call-dies", () => {
  assert.equal(classify(seedStillAlive()), "still-alive");
  assert.equal(classify(seedExit144()), "exit-144");
  assert.equal(classify(seedIsError()), "is-error");
  assert.equal(classify(seedPhantomPid()), "phantom-pid");
  assert.equal(classify(seedChangingPid()), "changing-pid");
  assert.equal(classify(seedCliGuardOnly()), "cli-guard-only");
  assert.equal(classify(seedWrapperUnchecked()), "wrapper-unchecked");
  assert.equal(classify(seedPgrepUnwrapped()), "pgrep-unwrapped");
  assert.equal(classify(seedArgvLeak()), "argv-leak");
  assert.equal(classify(seedEvalInArgv()), "eval-in-argv");
  assert.equal(classify(seedLinuxProcps()), "linux-procps");
  assert.equal(classify(seedBusyboxMatch()), "busybox-match");
  assert.equal(classify(seedMacosAncestorsOk()), "macos-ancestors-ok");
  assert.equal(classify(seedBracketPartial()), "bracket-partial");
  assert.equal(classify(seedSameCallDies()), "same-call-dies");
  assert.equal(classify(seedFromFileOk()), "from-file-ok");
  assert.equal(classify(seedHeadlessRepeat()), "headless-repeat");
  assert.equal(classify(seedPetard()), "petard");
});

test("booth fixtures flip standing vs hoisted vs wrapper-argv vs petard", () => {
  const idle = scoreGate(seedStanding());
  const seeded = scoreGate(readData("hoisted.json"));
  const standing = readData("standing.json");
  const hoisted = readData("hoisted.json");
  const path = readData("wrapper-argv.json");
  const product = readData("petard.json");
  const exit = readData("exit-144.json");
  const phantom = readData("phantom-pid.json");
  const missing = readData("still-alive-missing.json");
  const guard = readData("cli-guard-only.json");
  const macos = readData("macos-ancestors-ok.json");
  const bracket = readData("bracket-idiom-partial.json");
  const same = readData("same-call-dies.json");
  const procps = readData("procps-match.json");
  const busybox = readData("busybox-match.json");
  const pgrep = readData("pgrep-unwrapped.json");
  const leak = readData("argv-leak.json");
  assert.equal(idle.verdict, "standing");
  assert.equal(seeded.verdict, "hoisted");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedStanding()), "standing");
  assert.equal(score(readData("hoisted.json")), "hoisted");
  assert.equal(standing.wrapperAlive, true);
  assert.equal(standing.standing, true);
  assert.equal(scoreGate(standing).verdict, "standing");
  assert.equal(hoisted.wrapperKilled, true);
  assert.equal(hoisted.exit144, true);
  assert.equal(hoisted.stillAliveMissing, true);
  assert.equal(classify(hoisted), "hoisted");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /argv/);
  assert.match(path.paths[2].result, /ancestors/);
  assert.equal(classify(path), "wrapper-argv");
  assert.equal(classify(product), "petard");
  assert.equal(product.hubCount, "PETARD");
  assert.equal(hoisted.issue, 93607);
  assert.equal(hoisted.hoisted, true);
  assert.equal(classify(exit), "exit-144");
  assert.equal(classify(phantom), "phantom-pid");
  assert.equal(classify(missing), "still-alive-missing");
  assert.equal(classify(guard), "cli-guard-only");
  assert.equal(classify(macos), "macos-ancestors-ok");
  assert.equal(classify(bracket), "bracket-partial");
  assert.equal(classify(same), "same-call-dies");
  assert.equal(classify(procps), "linux-procps");
  assert.equal(classify(busybox), "busybox-match");
  assert.equal(classify(pgrep), "pgrep-unwrapped");
  assert.equal(classify(leak), "argv-leak");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("standing"));
  assert.ok(CHIPS.includes("hoisted"));
  assert.ok(CHIPS.includes("petard"));
  assert.ok(CHIPS.includes("wrapper-argv"));
  assert.ok(CHIPS.includes("exit-144"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("hoisted"));
  assert.ok(ALARM.includes("wrapper-argv"));
  assert.ok(ALARM.includes("exit-144"));
  assert.ok(ALARM.includes("petard"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published petard walk scores hoisted after the idle hold", () => {
  const trench = scoreWalk({ rows: PETARD_WALK });
  assert.equal(trench.verdict, "hoisted");
  assert.ok(trench.hoistedCount >= 1);
  const idle = trench.rows.find((row) => row.event === "cue-standing");
  assert.equal(idle.standing, true);
  assert.equal(idle.verdict, "standing");
  const blast = trench.rows.find((row) => row.event === "exit-144");
  assert.equal(blast.exit144, true);
  const path = trench.rows.find((row) => row.event === "wrapper-argv");
  assert.equal(path.verdict, "wrapper-argv");
});

test("PETARD_WALK constant matches the issue powder-charge walk", () => {
  assert.equal(PETARD_WALK[0].event, "cue-standing");
  const blast = PETARD_WALK.find((row) => row.event === "exit-144");
  assert.equal(blast.exit144, true);
  const path = PETARD_WALK.find((row) => row.event === "wrapper-argv");
  assert.equal(path.hoisted, true);
  const scoreRow = PETARD_WALK.find((row) => row.event === "petard");
  assert.equal(scoreRow.hoisted, true);
});

test("positive control still-alive stays standing", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "standing");
  const alive = walk.rows.find((row) => row.event === "still-alive");
  assert.equal(alive.verdict, "standing");
  const hold = walk.rows.find((row) => row.event === "cue-standing");
  assert.equal(hold.wrapperAlive, true);
  assert.equal(hold.verdict, "standing");
});

test("issue constants encode only #93607 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93607);
  assert.ok(ISSUE_URL.includes("93607"));
  assert.match(TITLE, /pkill -f/);
  assert.match(TITLE, /pgrep -f/);
  assert.match(TITLE, /2\.1\.214/);
  assert.match(TITLE, /exit 144/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:bash"));
  assert.equal(CLAUDE_CODE_VERSION, "2.1.214");
  assert.equal(GUARD_VERSION, "2.1.214");
  assert.equal(OS, "Linux");
  assert.equal(TOOL, "Bash");
  assert.match(WRAPPER, /bash -c/);
  assert.match(WRAPPER, /eval/);
  assert.equal(PATTERN, "sleep 3979");
  assert.match(START_CMD, /nohup sleep 3979/);
  assert.match(PKILL_CMD, /pkill -f/);
  assert.equal(EXIT_CODE, 144);
  assert.equal(STILL_ALIVE, "still alive");
  assert.match(DISTRIBUTION, /2\.1\.214/);
  assert.match(SESSION_KIND, /sleep 3979/);
  assert.equal(TRENCH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("wrapper-argv"));
  assert.ok(FINGERPRINT_LINES.includes("hoisted"));
  assert.match(PHRASE, /Score petard or admit standing/);
  assert.equal(SAMPLE_FUSE.blown, true);
  assert.equal(SAMPLE_ARGV.leaked, true);
  assert.equal(SAMPLE_WRAPPER.killed, true);
  assert.equal(SAMPLE_CALLS.length, 3);
  assert.equal(SAMPLE_CALLS[0].id, "1");
  assert.equal(SAMPLE_CALLS[1].isError, true);
  assert.equal(SAMPLE_CALLS[2].phantomPid, true);
  assert.equal(SAMPLE_LEDGER[1].exit, 144);
});

test("has-repro fingerprints encode the published wrapper hoist", () => {
  const result = handle(readData("hoisted.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.214");
  assert.match(result.published.sessionKind, /pkill -f/);
  assert.equal(result.published.exitCode, 144);
  assert.match(
    fingerprint(seedHoisted()),
    /hoisted\|fuse=blown\|argv=leaked\|wrapper=blown-back\|ledger=blast\|guard=cli-only\|path=wrapper-argv\|cue=wrapper-argv/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Aposiopesis and Disseisin", () => {
  const required = [
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
    "untainted",
    "attainted",
    "attainder",
    "retire-parked",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
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

test("standing trench flips hoisted back when the wrapper holds", () => {
  const tape = {
    standing: true,
    hoisted: false,
    wrapperAlive: true,
    stillAlive: true,
    cue: "standing",
  };
  assert.equal(scoreGate(tape).verdict, "standing");
  tape.standing = false;
  tape.hoisted = true;
  tape.wrapperKilled = true;
  tape.exit144 = true;
  tape.stillAliveMissing = true;
  tape.cue = "hoisted";
  assert.equal(scoreGate(tape).verdict, "hoisted");
  tape.standing = true;
  tape.hoisted = false;
  tape.wrapperKilled = false;
  tape.exit144 = false;
  tape.stillAliveMissing = false;
  tape.cue = "standing";
  assert.equal(scoreGate(tape).verdict, "standing");
});

test("fuse, argv, wrapper, ledger, guard, and readBooth mark the hoist", () => {
  const idle = inspectFuse({ standing: true, stillAlive: true, fuse: { lit: true, blown: false, stillAlivePrinted: true } });
  assert.equal(idle.stamp, "standing");
  const argv = inspectArgv({ hoisted: true, argv: SAMPLE_ARGV });
  assert.equal(argv.stamp, "mirrored");
  assert.equal(argv.leaked, true);
  const wrapper = inspectWrapper({ wrapperKilled: true, wrapper: SAMPLE_WRAPPER });
  assert.equal(wrapper.stamp, "blown-back");
  const ledger = inspectLedger({ hoisted: true, exit144: true, ledger: SAMPLE_LEDGER });
  assert.equal(ledger.stamp, "blast");
  assert.equal(ledger.exit144, true);
  const guard = inspectGuard({ hoisted: true, cliGuardOnly: true });
  assert.equal(guard.stamp, "cli-only");
  const booth = readBooth({
    hoisted: true,
    wrapperKilled: true,
    exit144: true,
    stillAliveMissing: true,
    argvLeak: true,
    ledger: SAMPLE_LEDGER,
    fuse: SAMPLE_FUSE,
  });
  assert.equal(booth.hoisted, true);
  assert.equal(booth.mark, "hoisted");
  const calm = readBooth({
    standing: true,
    hoisted: false,
    wrapperAlive: true,
    stillAlive: true,
  });
  assert.equal(calm.hoisted, false);
  assert.equal(calm.mark, "standing");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 62297);
  assert.equal(COUSINS[1].issue, 72153);
  assert.equal(COUSINS[2].issue, 90070);
  assert.equal(COUSINS[3].issue, 89496);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /exit 144/);
  assert.ok(NOT_PRODUCTS.includes("aposiopesis"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("seizing"));
  assert.ok(NOT_PRODUCTS.includes("hangfire"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("frizzen"));
  assert.equal(BACKUPS.length, 3);
  assert.equal(BACKUPS[0].issue, 93595);
  assert.equal(BACKUPS[1].issue, 93585);
  assert.equal(BACKUPS[2].issue, 93570);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/hoisted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "standing");
  assert.equal(JSON.parse(seeded.stdout).verdict, "hoisted");
});

test("handle exposes published hypothesis and #93607 headline", () => {
  const result = handle(readData("hoisted.json"));
  assert.equal(result.published.issue, 93607);
  assert.equal(result.published.claudeCodeVersion, "2.1.214");
  assert.deepEqual(result.published.cousins, [62297, 72153, 90070, 89496]);
  assert.ok(result.published.backups.includes(93595));
  assert.ok(result.published.backups.includes(93585));
  assert.ok(result.published.backups.includes(93570));
  assert.match(result.published.hypothesis, /wrapper \$\$/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /argv/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a siege petard booth, not speech-break or manor-court", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Exo 2|Exo\+2/);
  assert.match(page, /Fira Code|Fira\+Code/);
  assert.match(page, /petard|powder-charge|sapper trench|fuse rail|argv mirror|wrapper/i);
  assert.match(page, /#0B0F14|#C4B8A8|#E85D04|#C9A227|#5B6B7A|#F5F0E8|#9B1D20/i);
  assert.match(page, /\bstanding\b/);
  assert.match(page, /hoisted/);
  assert.match(page, /wrapper-argv/);
  assert.match(page, /Score petard or admit standing/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /21:50/);
  assert.match(page, /#293/);
  assert.match(page, /#93607/);
  assert.match(page, /2\.1\.214/);
  assert.match(page, /pkill/);
  assert.match(page, /Light the fuse/);
  assert.match(page, /Score petard/);
  assert.match(page, /Blow the charge/);
  assert.match(page, /Compare standing \/ hoisted/);
  assert.match(page, /Pin idle standing/);
  assert.match(page, /Pin seeded hoisted/);
  assert.match(page, /Pin wrapper-argv/);
  assert.match(page, /Hold the wrapper/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /#F7F1E6/);
  assert.doesNotMatch(page, /#1C1917/);
  assert.doesNotMatch(page, /#F7E8C8/);
  assert.doesNotMatch(page, /#2F2418/);
  assert.doesNotMatch(page, /#140E18/);
  assert.doesNotMatch(page, /#D4A84B/);
  assert.doesNotMatch(page, /manuscript speech-break|em-dash|status rail|git-root|silence ledger/i);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /manuscript flashback|quire|verso folio|recto gathering/i);
  assert.doesNotMatch(page, /court-of-novel-disseisin|manor-roll|freehold|tenement|writ of novel/i);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfurled\b/);
  assert.doesNotMatch(page, /\bseised\b/);
  assert.doesNotMatch(page, /\bdisseised\b/);
  assert.doesNotMatch(page, /\bordered\b/);
  assert.doesNotMatch(page, /\bredelivered\b/);
  assert.match(page, /NOT Aposiopesis/i);
  assert.match(page, /NOT Disseisin/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Seizing/i);
  assert.match(page, /NOT Hangfire/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Frizzen/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Petard/);
  assert.match(readme, /#93607/);
  assert.match(readme, /\bstanding\b/);
  assert.match(readme, /hoisted/);
  assert.match(readme, /wrapper-argv/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Exo 2/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Aposiopesis/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Seizing/i);
  assert.match(readme, /NOT Hangfire/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Frizzen/i);
  assert.match(readme, /#62297/);
  assert.match(readme, /2\.1\.214/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/petard/);
  assert.match(readme, /node --test projects\/petard\/petard\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.match(readme, /pkill/);
  assert.match(readme, /Score petard or admit standing/);
});

test("catalog features Petard only; Aposiopesis unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 293);
  assert.equal(hub.products.length, 293);
  assert.equal(catalog.products[0].name, "Petard");
  assert.equal(catalog.products[0].slug, "petard");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/petard/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /21:50/);
  assert.match(catalog.products[0].summary, /petard/);
  assert.match(catalog.products[0].summary, /#93607/);
  assert.match(catalog.products[0].summary, /\bstanding\b/);
  assert.match(catalog.products[0].summary, /hoisted/);
  assert.match(catalog.products[0].summary, /wrapper-argv/);
  assert.equal(hub.products[0].slug, "petard");
  assert.equal(hub.products[0].featured, true);
  const aposiopesis = catalog.products.find((row) => row.slug === "aposiopesis");
  assert.ok(aposiopesis);
  assert.equal(aposiopesis.featured, false);
  const disseisin = catalog.products.find((row) => row.slug === "disseisin");
  assert.ok(disseisin);
  assert.equal(disseisin.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "petard").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93607") && row.slug !== "petard"));
});

test("vercel rewrites petard to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/petard");
  assert.equal(vercel.rewrites[0].destination, "/projects/petard");
  assert.equal(vercel.rewrites[1].source, "/petard/");
  assert.equal(vercel.rewrites[1].destination, "/projects/petard");
  assert.equal(vercel.rewrites[2].source, "/petard/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/petard/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
