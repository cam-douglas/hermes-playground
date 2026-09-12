import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BULL_STRIPS,
  CHIPS,
  CLAUDE_VERSION,
  COMMAND,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INSTALL_PATH,
  INTERDICT_WALK,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_AUTH,
  SAMPLE_BLEED,
  SAMPLE_CHROME,
  SAMPLE_DIOCESE,
  SAMPLE_INTERDICTED_BULL,
  SAMPLE_MCP,
  SAMPLE_PARISH,
  SAMPLE_REFUSE,
  SEEDED_WORD,
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
  inspectBashSshRefuse,
  inspectBleed,
  inspectChromeToggle,
  inspectDiocese,
  inspectExplicitAuth,
  inspectMcpInstructions,
  inspectParish,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBashSshRefuse,
  seedBleed,
  seedChromeOnVsOff,
  seedChromeProhibitBleed,
  seedDiocese,
  seedExplicitAuthIgnored,
  seedHold,
  seedInterdict,
  seedInterdicted,
  seedMcpInstructions,
  seedParish,
  seedScoped,
} from "./interdict.mjs";

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
  return fileURLToPath(new URL("./interdict.mjs", import.meta.url));
}

test("idle scoped is a hold; prohibitions stay limited to browser/chrome tools", () => {
  const result = analyze(seedScoped());
  assert.equal(result.verdict, "scoped");
  assert.equal(result.idleWord, "scoped");
  assert.equal(IDLE_WORD, "scoped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scoped, true);
  assert.equal(result.phrase, "admit scoped");
  assert.equal(result.interdicted, false);
  assert.equal(result.chromeProhibitBleed, false);
  assert.ok(HOLD_ALIASES.includes("scoped"));
  assert.ok(HOLD_ALIASES.includes("parish-only"));
  assert.ok(HOLD_ALIASES.includes("chapel-bound"));
  assert.ok(HOLD_ALIASES.includes("browser-only"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify scoped", () => {
  assert.equal(classify(emptyTicket()), "scoped");
  assert.equal(classify(""), "scoped");
  assert.equal(classify(null), "scoped");
  assert.equal(decide({}), "scoped");
});

test("#93798 seeded path scores interdict when the chapel bull covers Bash/SSH", () => {
  const result = analyze(seedInterdicted());
  assert.equal(result.verdict, "interdict");
  assert.equal(result.seededWord, "interdicted");
  assert.equal(SEEDED_WORD, "interdicted");
  assert.equal(PRODUCT_WORD, "interdict");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.interdicted, true);
  assert.equal(result.phrase, "score interdict");
  assert.equal(result.chromeProhibitBleed, true);
  assert.equal(result.bashSshRefuse, true);
  assert.equal(result.explicitAuthIgnored, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("bash/SSH refuse plus ignored authorization is the #93798 interdict", () => {
  const refuse = inspectBashSshRefuse({ interdicted: true, bashSshRefuse: true });
  assert.equal(refuse.stamp, "bash-ssh-refuse");
  assert.equal(refuse.refused, true);
  const scored = scoreGate({
    interdicted: true,
    chromeProhibitBleed: true,
    bashSshRefuse: true,
    explicitAuthIgnored: true,
    mcpInstructions: true,
    chromeOnVsOff: true,
    bleedOn: true,
    cue: "interdicted",
    refuse: SAMPLE_REFUSE,
    auth: SAMPLE_AUTH,
    mcp: SAMPLE_MCP,
  });
  assert.equal(scored.verdict, "interdict");
  assert.equal(scored.chromeProhibitBleed, true);
  const open = inspectBashSshRefuse({ scoped: true, bashSshRefuse: false });
  assert.equal(open.stamp, "bash-ssh-run");
});

test("path word is chrome-prohibit-bleed; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "chrome-prohibit-bleed");
  const result = analyze(seedChromeProhibitBleed());
  assert.equal(result.verdict, "chrome-prohibit-bleed");
  assert.equal(result.pathWord, "chrome-prohibit-bleed");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "chrome-prohibit-bleed", preferSeed: true, interdicted: true }),
    "chrome-prohibit-bleed",
  );
  assert.equal(classify(seedDiocese()), "diocese");
});

test("HOLD includes scoped / hold", () => {
  assert.ok(HOLD.includes("scoped"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: parish, diocese, bleed, mcp-instructions, bash-ssh-refuse, explicit-auth-ignored, chrome-on-vs-off", () => {
  assert.equal(classify(seedParish()), "parish");
  assert.equal(classify(seedDiocese()), "diocese");
  assert.equal(classify(seedBleed()), "bleed");
  assert.equal(classify(seedMcpInstructions()), "mcp-instructions");
  assert.equal(classify(seedBashSshRefuse()), "bash-ssh-refuse");
  assert.equal(classify(seedExplicitAuthIgnored()), "explicit-auth-ignored");
  assert.equal(classify(seedChromeOnVsOff()), "chrome-on-vs-off");
  assert.equal(classify(seedInterdict()), "interdict");
});

test("booth fixtures flip scoped vs interdicted vs chrome-prohibit-bleed vs interdict", () => {
  const idle = scoreGate(seedScoped());
  const seeded = scoreGate(seedInterdicted());
  const scoped = readData("scoped.json");
  const interdicted = readData("interdicted.json");
  const path = readData("chrome-prohibit-bleed.json");
  const product = readData("interdict.json");
  const refuse = readData("bash-ssh-refuse.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "scoped");
  assert.equal(seeded.verdict, "interdict");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedScoped()), "scoped");
  assert.equal(score(seedInterdicted()), "interdict");
  assert.equal(scoped.bashSshRefuse, false);
  assert.equal(scoped.scoped, true);
  assert.equal(scoreGate(scoped).verdict, "scoped");
  assert.equal(interdicted.chromeProhibitBleed, true);
  assert.equal(interdicted.bashSshRefuse, true);
  assert.equal(interdicted.explicitAuthIgnored, true);
  assert.equal(classify(interdicted), "interdicted");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /browser|chrome|Bash|SSH/i);
  assert.match(path.paths[1].result, /refuse|rm|SSH|authoriz/i);
  assert.equal(classify(path), "chrome-prohibit-bleed");
  assert.equal(classify(product), "interdict");
  assert.equal(product.hubCount, "INTERDICT");
  assert.equal(interdicted.issue, 93798);
  assert.equal(interdicted.interdicted, true);
  assert.equal(classify(refuse), "bash-ssh-refuse");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("parish.json")), "parish");
  assert.equal(classify(readData("diocese.json")), "diocese");
  assert.equal(classify(readData("bleed.json")), "bleed");
  assert.equal(classify(readData("mcp-instructions.json")), "mcp-instructions");
  assert.equal(classify(readData("explicit-auth-ignored.json")), "explicit-auth-ignored");
  assert.equal(classify(readData("chrome-on-vs-off.json")), "chrome-on-vs-off");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("scoped"));
  assert.ok(CHIPS.includes("interdicted"));
  assert.ok(CHIPS.includes("interdict"));
  assert.ok(CHIPS.includes("chrome-prohibit-bleed"));
  assert.ok(CHIPS.includes("parish"));
  assert.ok(CHIPS.includes("diocese"));
  assert.ok(CHIPS.includes("bleed"));
  assert.ok(CHIPS.includes("mcp-instructions"));
  assert.ok(CHIPS.includes("bash-ssh-refuse"));
  assert.ok(CHIPS.includes("explicit-auth-ignored"));
  assert.ok(CHIPS.includes("chrome-on-vs-off"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("interdicted"));
  assert.ok(ALARM.includes("chrome-prohibit-bleed"));
  assert.ok(ALARM.includes("bash-ssh-refuse"));
  assert.ok(ALARM.includes("interdict"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published interdict walk scores interdict after the idle hold", () => {
  const booth = scoreWalk({ rows: INTERDICT_WALK });
  assert.equal(booth.verdict, "interdict");
  assert.ok(booth.interdictedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-scoped");
  assert.equal(idle.scoped, true);
  assert.equal(idle.verdict, "scoped");
  const refuse = booth.rows.find((row) => row.event === "bash-ssh-refuse");
  assert.equal(refuse.bashSshRefuse, true);
  const path = booth.rows.find((row) => row.event === "chrome-prohibit-bleed" && row.t === "path");
  assert.equal(path.verdict, "chrome-prohibit-bleed");
});

test("INTERDICT_WALK constant matches the issue bull walk", () => {
  assert.equal(INTERDICT_WALK[0].event, "cue-scoped");
  const refuse = INTERDICT_WALK.find((row) => row.event === "bash-ssh-refuse");
  assert.equal(refuse.bashSshRefuse, true);
  const path = INTERDICT_WALK.find((row) => row.t === "path");
  assert.equal(path.interdicted, true);
  const scoreRow = INTERDICT_WALK.find((row) => row.event === "interdict");
  assert.equal(scoreRow.interdicted, true);
});

test("positive control chapel-bound stays scoped", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "scoped");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "scoped");
  const hold = walk.rows.find((row) => row.event === "cue-scoped");
  assert.equal(hold.scoped, true);
  assert.equal(hold.verdict, "scoped");
});

test("issue constants encode only #93798 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93798);
  assert.ok(ISSUE_URL.includes("93798"));
  assert.match(TITLE, /claude-in-chrome|Prohibited|Bash|SSH/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /Sonnet 5/i);
  assert.match(GOOD_VERSION, /chrome|toggled off|normally/i);
  assert.match(SURFACE, /Conductor|claude-in-chrome|Mac/i);
  assert.match(HOST, /Conductor/);
  assert.match(INSTALL_PATH, /claude-in-chrome|Conductor/i);
  assert.equal(COMMAND, "rm over SSH");
  assert.deepEqual([...LABELS], [
    "bug",
    "platform:macos",
    "area:mcp",
    "area:chrome",
  ]);
  assert.equal(BULL_STRIPS.length, 4);
  assert.ok(RULED_OUT.some((row) => /83702/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /43474|76372/i.test(row)));
  assert.ok(EXPECTED.some((row) => /browser|Bash|SSH/i.test(row)));
  assert.match(DISTRIBUTION, /claude-in-chrome|Prohibited|rm|SSH|Conductor|\/chrome|CLAUDE\.md|Sonnet 5/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("chrome-prohibit-bleed"));
  assert.ok(FINGERPRINT_LINES.includes("interdicted"));
  assert.equal(PHRASE, "Score interdict or admit scoped.");
  assert.equal(SAMPLE_INTERDICTED_BULL.bleed, true);
  assert.equal(SAMPLE_REFUSE.refused, true);
  assert.equal(SAMPLE_PARISH.chapel, "claude-in-chrome");
  assert.equal(SAMPLE_DIOCESE.bashSshCovered, true);
  assert.equal(SAMPLE_BLEED.noBrowserQualifier, true);
  assert.equal(SAMPLE_MCP.actionCategories, true);
  assert.equal(SAMPLE_AUTH.staysProhibited, true);
  assert.equal(SAMPLE_CHROME.chromeOffRuns, true);
});

test("has-repro fingerprints encode the published interdicted bull", () => {
  const result = handle(seedInterdicted());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.surface, /Conductor|claude-in-chrome/);
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedInterdicted()),
    /interdict\|parish=chapel\|diocese=bleed\|mcp=injected\|auth=ignored\|path=chrome-prohibit-bleed\|cue=chrome-prohibit-bleed/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Simplex, Deadkey, Gleaner, Schism, Rasure and Ashpan", () => {
  const required = [
    "duplex",
    "simplexed",
    "simplex",
    "mobile-uplink-silent",
    "keyed",
    "deadkeyed",
    "deadkey",
    "esc-csi-dead",
    "gleaned",
    "orphaned",
    "gleaner",
    "unreaped-ampersand",
    "live",
    "schismed",
    "schism",
    "resume-while-live",
    "intact",
    "rasured",
    "rasure",
    "creation-time-flip",
    "swept",
    "ashpanned",
    "ashpan",
    "orphan-jsonl",
    "credentialed",
    "outridden",
    "outrider",
    "early-connect",
    "attested",
    "necrologized",
    "necrology",
    "incomplete-listing",
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
    "eidolon",
    "aphonia",
    "muzzle",
    "leaking",
    "excised",
    "carrier",
    "deadair",
    "squelch",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "lazaret",
    "oubliette",
    "ephemera",
    "mondegreen",
    "parergon",
    "guillotine",
    "flashpan",
    "clepsydra",
    "springe",
    "deadlight",
    "damper",
    "sounder",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("scoped booth flips interdicted back when the bull stays in the chapel", () => {
  const tape = {
    scoped: true,
    interdicted: false,
    bashSshRefuse: false,
    cue: "scoped",
  };
  assert.equal(scoreGate(tape).verdict, "scoped");
  tape.scoped = false;
  tape.interdicted = true;
  tape.chromeProhibitBleed = true;
  tape.bashSshRefuse = true;
  tape.explicitAuthIgnored = true;
  tape.cue = "interdicted";
  assert.equal(scoreGate(tape).verdict, "interdict");
  tape.scoped = true;
  tape.interdicted = false;
  tape.chromeProhibitBleed = false;
  tape.bashSshRefuse = false;
  tape.explicitAuthIgnored = false;
  tape.cue = "scoped";
  assert.equal(scoreGate(tape).verdict, "scoped");
});

test("parish, diocese, bleed, mcp, refuse, auth, chrome, and readBooth mark the interdicted bull", () => {
  const idle = inspectBashSshRefuse({
    scoped: true,
    refuse: { rmOverSsh: false, refused: false, ownServer: false },
  });
  assert.equal(idle.stamp, "bash-ssh-run");
  const bleed = inspectBleed({ interdicted: true, bleed: SAMPLE_BLEED });
  assert.equal(bleed.stamp, "bleed");
  assert.equal(bleed.genericProhibit, true);
  const chapel = inspectParish({
    parishBleed: true,
    parish: SAMPLE_PARISH,
  });
  assert.equal(chapel.stamp, "parish-bleed");
  const see = inspectDiocese({ interdicted: true, dioceseWide: true });
  assert.equal(see.stamp, "diocese-interdict");
  const mcp = inspectMcpInstructions({ interdicted: true, mcpInstructions: true });
  assert.equal(mcp.stamp, "mcp-instructions");
  const auth = inspectExplicitAuth({ interdicted: true, explicitAuthIgnored: true });
  assert.equal(auth.stamp, "explicit-auth-ignored");
  const chrome = inspectChromeToggle({});
  assert.equal(chrome.stamp, "chrome-on-vs-off");
  const booth = readBooth({
    interdicted: true,
    bashSshRefuse: true,
    refuse: SAMPLE_REFUSE,
    auth: SAMPLE_AUTH,
    bleed: SAMPLE_BLEED,
  });
  assert.equal(booth.interdicted, true);
  assert.equal(booth.mark, "interdicted");
  const open = readBooth({
    scoped: true,
    interdicted: false,
    bashSshRefuse: false,
  });
  assert.equal(open.interdicted, false);
  assert.equal(open.mark, "scoped");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 83702);
  assert.equal(COUSINS[1].issue, 43474);
  assert.equal(COUSINS[2].issue, 76372);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /83702|token|rebuild/i);
  assert.match(COUSINS[1].why, /43474|rebuild/i);
  assert.match(COUSINS[2].why, /76372|rebuild/i);
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("outrider"));
  assert.ok(NOT_PRODUCTS.includes("necrology"));
  assert.ok(NOT_PRODUCTS.includes("innominate"));
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("lazaret"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 93786);
  assert.equal(BACKUPS[1].issue, 93778);
  assert.equal(BACKUPS[2].issue, 93766);
  assert.equal(BACKUPS[3].issue, 93764);
  assert.equal(BACKUPS[4].issue, 93754);
  assert.equal(BACKUPS[5].issue, 93751);
  assert.equal(BACKUPS[6].issue, 93744);
  assert.equal(BACKUPS[7].issue, 93772);
  assert.equal(BACKUPS[8].issue, 93770);
  assert.equal(BACKUPS[9].issue, 93777);
  assert.equal(BACKUPS[10].issue, 93782);
  assert.equal(BACKUPS[11].issue, 93800);
  assert.equal(BACKUPS[12].issue, 93795);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/interdicted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const scopedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scoped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(scopedFix.status, 0, scopedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "scoped");
  assert.equal(JSON.parse(seeded.stdout).verdict, "interdicted");
  assert.equal(JSON.parse(scopedFix.stdout).verdict, "scoped");
});

test("handle exposes published hypothesis and #93798 headline", () => {
  const result = handle(seedInterdicted());
  assert.equal(result.published.issue, 93798);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [83702, 43474, 76372]);
  assert.ok(result.published.backups.includes(93786));
  assert.ok(result.published.backups.includes(93778));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93751));
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(result.published.backups.includes(93782));
  assert.ok(result.published.backups.includes(93800));
  assert.ok(result.published.backups.includes(93795));
  assert.ok(!result.published.backups.includes(93798));
  assert.ok(!result.published.backups.includes(83702));
  assert.match(result.published.hypothesis, /MCP|instructions|Bash|SSH|Prohibited/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93798/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a papal-bull / diocese-seal booth, not simplex or deadkey", () => {
  const page = readPage();
  assert.match(page, /Cinzel/);
  assert.match(page, /Lora/);
  assert.match(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.match(page, /interdict|interdicted|chrome-prohibit-bleed|papal|diocese|vellum|wax seal/i);
  assert.match(page, /#1A0B18|#3A1638|#F3E2B8|#8E1530|#C9A227|#1C0E08|#6E1230/i);
  assert.match(page, /\bscoped\b/);
  assert.match(page, /\binterdicted\b/);
  assert.match(page, /chrome-prohibit-bleed/);
  assert.match(page, /Score interdict or admit scoped/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#317/);
  assert.match(page, /#93798/);
  assert.match(page, /Admit scoped/);
  assert.match(page, /Score interdict/);
  assert.match(page, /Walk chrome-prohibit-bleed/);
  assert.match(page, /Compare scoped \/ interdicted/);
  assert.match(page, /Pin idle scoped/);
  assert.match(page, /Pin seeded interdicted/);
  assert.match(page, /Pin chrome-prohibit-bleed/);
  assert.match(page, /Hold the scoped/);
  assert.match(page, /claude-in-chrome|Prohibited|SSH|rm|Conductor|CLAUDE\.md/i);
  assert.doesNotMatch(page, /Russo One|Russo\+One/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Bodoni Moda|Bodoni\+Moda/);
  assert.doesNotMatch(page, /Crimson Pro|Crimson\+Pro/);
  assert.doesNotMatch(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Share Tech Mono|Share\+Tech\+Mono/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /#041018/);
  assert.doesNotMatch(page, /#0B1A2E/);
  assert.doesNotMatch(page, /#4CFF9A/);
  assert.doesNotMatch(page, /#F5A623/);
  assert.doesNotMatch(page, /#0A0908/);
  assert.doesNotMatch(page, /#F5EFE3/);
  assert.doesNotMatch(page, /#9C2F2A/);
  assert.doesNotMatch(page, /#B8924A/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /#e8a317/);
  assert.doesNotMatch(page, /#6ee87a/);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /cavalry outrider|dispatch-rider|sealed dispatch pouch/i);
  assert.doesNotMatch(page, /parish necrology|death-register|sexton-desk/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /\bduplex\b/);
  assert.doesNotMatch(page, /\bsimplexed\b/);
  assert.doesNotMatch(page, /mobile-uplink-silent/);
  assert.doesNotMatch(page, /\bkeyed\b/);
  assert.doesNotMatch(page, /\bdeadkeyed\b/);
  assert.doesNotMatch(page, /esc-csi-dead/);
  assert.doesNotMatch(page, /\bgleaned\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /unreaped-ampersand/);
  assert.doesNotMatch(page, /\bschismed\b/);
  assert.doesNotMatch(page, /resume-while-live/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Interdict/);
  assert.match(readme, /#93798/);
  assert.match(readme, /\bscoped\b/);
  assert.match(readme, /\binterdicted\b/);
  assert.match(readme, /chrome-prohibit-bleed/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Lora/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /#83702|#43474|#76372/);
  assert.match(readme, /claude-in-chrome|Prohibited|SSH|rm|Conductor/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/interdict/);
  assert.match(readme, /node --test projects\/interdict\/interdict\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /interdict|papal|diocese|chapel/i);
  assert.match(readme, /Score interdict or admit scoped/);
  assert.match(readme, /#93786|#93778|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782|#93800|#93795/);
  assert.match(readme, /23:50/);
});

test("catalog features Interdict only; Simplex, Deadkey, Gleaner, Schism, Rasure and Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 317);
  assert.equal(hub.products.length, 317);
  assert.equal(catalog.products[0].name, "Interdict");
  assert.equal(catalog.products[0].slug, "interdict");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/interdict/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /23:50 interdict|#93798|ecclesiastical interdict|papal-bull/i);
  assert.match(catalog.products[0].summary, /\bscoped\b/);
  assert.match(catalog.products[0].summary, /\binterdicted\b/);
  assert.match(catalog.products[0].summary, /chrome-prohibit-bleed/);
  assert.match(catalog.products[0].summary, /Score interdict or admit scoped/);
  assert.equal(hub.products[0].slug, "interdict");
  assert.equal(hub.products[0].featured, true);
  const simplex = catalog.products.find((row) => row.slug === "simplex");
  assert.ok(simplex);
  assert.equal(simplex.featured, false);
  const deadkey = catalog.products.find((row) => row.slug === "deadkey");
  assert.ok(deadkey);
  assert.equal(deadkey.featured, false);
  const gleaner = catalog.products.find((row) => row.slug === "gleaner");
  assert.ok(gleaner);
  assert.equal(gleaner.featured, false);
  const schism = catalog.products.find((row) => row.slug === "schism");
  assert.ok(schism);
  assert.equal(schism.featured, false);
  const rasure = catalog.products.find((row) => row.slug === "rasure");
  assert.ok(rasure);
  assert.equal(rasure.featured, false);
  const ashpan = catalog.products.find((row) => row.slug === "ashpan");
  assert.ok(ashpan);
  assert.equal(ashpan.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "interdict").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93798") && row.slug !== "interdict"));
});

test("vercel rewrites interdict to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/interdict");
  assert.equal(vercel.rewrites[0].destination, "/projects/interdict");
  assert.equal(vercel.rewrites[1].source, "/interdict/");
  assert.equal(vercel.rewrites[1].destination, "/projects/interdict");
  assert.equal(vercel.rewrites[2].source, "/interdict/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/interdict/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
