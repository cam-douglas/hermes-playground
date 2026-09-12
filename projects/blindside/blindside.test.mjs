import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BLINDSIDE_WALK,
  BOOTH_STATIONS,
  CHIPS,
  CLAUDE_VERSION,
  COMMAND,
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
  INSTALL_PATH,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_BLINDSIDED_FIELD,
  SAMPLE_COMMITS,
  SAMPLE_COMPARE,
  SAMPLE_PANE,
  SAMPLE_WORKTREE,
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
  inspectCommitsPresent,
  inspectCompareRef,
  inspectPaneEmpty,
  inspectWorktreeOwned,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBlindside,
  seedBlindsided,
  seedCommitsPresent,
  seedCompareRef,
  seedCompareRefUnreachable,
  seedHold,
  seedPaneEmpty,
  seedSighted,
  seedWorktreeOwned,
} from "./blindside.mjs";

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
  return fileURLToPath(new URL("./blindside.mjs", import.meta.url));
}

test("idle sighted is a hold; compare ref / owned worktrees stay reachable", () => {
  const result = analyze(seedSighted());
  assert.equal(result.verdict, "sighted");
  assert.equal(result.idleWord, "sighted");
  assert.equal(IDLE_WORD, "sighted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sighted, true);
  assert.equal(result.phrase, "admit sighted");
  assert.equal(result.blindsided, false);
  assert.equal(result.compareRefUnreachable, false);
  assert.ok(HOLD_ALIASES.includes("sighted"));
  assert.ok(HOLD_ALIASES.includes("compare-reachable"));
  assert.ok(HOLD_ALIASES.includes("worktree-listed"));
  assert.ok(HOLD_ALIASES.includes("pane-can-see"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify sighted", () => {
  assert.equal(classify(emptyTicket()), "sighted");
  assert.equal(classify(""), "sighted");
  assert.equal(classify(null), "sighted");
  assert.equal(decide({}), "sighted");
});

test("#93786 seeded path scores blindside when committed worktree work is invisible", () => {
  const result = analyze(seedBlindsided());
  assert.equal(result.verdict, "blindside");
  assert.equal(result.seededWord, "blindsided");
  assert.equal(SEEDED_WORD, "blindsided");
  assert.equal(PRODUCT_WORD, "blindside");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.blindsided, true);
  assert.equal(result.phrase, "score blindside");
  assert.equal(result.compareRefUnreachable, true);
  assert.equal(result.paneEmpty, true);
  assert.equal(result.commitsPresent, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("pane empty plus commits present is the #93786 blindside", () => {
  const pane = inspectPaneEmpty({ blindsided: true, paneEmpty: true });
  assert.equal(pane.stamp, "pane-empty");
  assert.equal(pane.reportsNoChanges, true);
  const scored = scoreGate({
    blindsided: true,
    compareRefUnreachable: true,
    paneEmpty: true,
    commitsPresent: true,
    worktreeOwned: true,
    cue: "blindsided",
    pane: SAMPLE_PANE,
    commits: SAMPLE_COMMITS,
    compare: SAMPLE_COMPARE,
  });
  assert.equal(scored.verdict, "blindside");
  assert.equal(scored.compareRefUnreachable, true);
  const open = inspectPaneEmpty({ sighted: true, paneEmpty: false });
  assert.equal(open.stamp, "pane-sees");
});

test("path word is compare-ref-unreachable; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "compare-ref-unreachable");
  const result = analyze(seedCompareRefUnreachable());
  assert.equal(result.verdict, "compare-ref-unreachable");
  assert.equal(result.pathWord, "compare-ref-unreachable");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "compare-ref-unreachable", preferSeed: true, blindsided: true }),
    "compare-ref-unreachable",
  );
  assert.equal(classify(seedWorktreeOwned()), "worktree-owned");
});

test("HOLD includes sighted / hold", () => {
  assert.ok(HOLD.includes("sighted"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: worktree-owned, pane-empty, commits-present, compare-ref", () => {
  assert.equal(classify(seedWorktreeOwned()), "worktree-owned");
  assert.equal(classify(seedPaneEmpty()), "pane-empty");
  assert.equal(classify(seedCommitsPresent()), "commits-present");
  assert.equal(classify(seedCompareRef()), "compare-ref");
  assert.equal(classify(seedBlindside()), "blindside");
});

test("booth fixtures flip sighted vs blindsided vs compare-ref-unreachable vs blindside", () => {
  const idle = scoreGate(seedSighted());
  const seeded = scoreGate(seedBlindsided());
  const sighted = readData("sighted.json");
  const blindsided = readData("blindsided.json");
  const path = readData("compare-ref-unreachable.json");
  const product = readData("blindside.json");
  const pane = readData("pane-empty.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "sighted");
  assert.equal(seeded.verdict, "blindside");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSighted()), "sighted");
  assert.equal(score(seedBlindsided()), "blindside");
  assert.equal(sighted.paneEmpty, false);
  assert.equal(sighted.sighted, true);
  assert.equal(scoreGate(sighted).verdict, "sighted");
  assert.equal(blindsided.compareRefUnreachable, true);
  assert.equal(blindsided.paneEmpty, true);
  assert.equal(blindsided.commitsPresent, true);
  assert.equal(classify(blindsided), "blindsided");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /worktree|compare|pane|diff/i);
  assert.match(path.paths[1].result, /commit|stat|slice-118|invisible/i);
  assert.equal(classify(path), "compare-ref-unreachable");
  assert.equal(classify(product), "blindside");
  assert.equal(product.hubCount, "BLINDSIDE");
  assert.equal(blindsided.issue, 93786);
  assert.equal(blindsided.blindsided, true);
  assert.equal(classify(pane), "pane-empty");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("worktree-owned.json")), "worktree-owned");
  assert.equal(classify(readData("commits-present.json")), "commits-present");
  assert.equal(classify(readData("compare-ref.json")), "compare-ref");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("sighted"));
  assert.ok(CHIPS.includes("blindsided"));
  assert.ok(CHIPS.includes("blindside"));
  assert.ok(CHIPS.includes("compare-ref-unreachable"));
  assert.ok(CHIPS.includes("worktree-owned"));
  assert.ok(CHIPS.includes("pane-empty"));
  assert.ok(CHIPS.includes("commits-present"));
  assert.ok(CHIPS.includes("compare-ref"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("blindsided"));
  assert.ok(ALARM.includes("compare-ref-unreachable"));
  assert.ok(ALARM.includes("pane-empty"));
  assert.ok(ALARM.includes("blindside"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published blindside walk scores blindside after the idle hold", () => {
  const booth = scoreWalk({ rows: BLINDSIDE_WALK });
  assert.equal(booth.verdict, "blindside");
  assert.ok(booth.blindsidedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-sighted");
  assert.equal(idle.sighted, true);
  assert.equal(idle.verdict, "sighted");
  const pane = booth.rows.find((row) => row.event === "pane-empty");
  assert.equal(pane.paneEmpty, true);
  const path = booth.rows.find((row) => row.event === "compare-ref-unreachable" && row.t === "path");
  assert.equal(path.verdict, "compare-ref-unreachable");
});

test("BLINDSIDE_WALK constant matches the issue sideline walk", () => {
  assert.equal(BLINDSIDE_WALK[0].event, "cue-sighted");
  const pane = BLINDSIDE_WALK.find((row) => row.event === "pane-empty");
  assert.equal(pane.paneEmpty, true);
  const path = BLINDSIDE_WALK.find((row) => row.t === "path");
  assert.equal(path.blindsided, true);
  const scoreRow = BLINDSIDE_WALK.find((row) => row.event === "blindside");
  assert.equal(scoreRow.blindsided, true);
});

test("positive control far-sideline-reachable stays sighted", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "sighted");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "sighted");
  const hold = walk.rows.find((row) => row.event === "cue-sighted");
  assert.equal(hold.sighted, true);
  assert.equal(hold.verdict, "sighted");
});

test("issue constants encode only #93786 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93786);
  assert.ok(ISSUE_URL.includes("93786"));
  assert.match(TITLE, /worktrees|diff pane|compare ref/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(CLAUDE_VERSION, /2\.1\.267/);
  assert.match(GOOD_VERSION, /worktrees|compare ref/i);
  assert.match(SURFACE, /Desktop|2\.1\.267/i);
  assert.match(HOST, /Desktop/);
  assert.match(INSTALL_PATH, /\.claude\/worktrees/i);
  assert.match(COMMAND, /slice-118-readout-elicitation-register/);
  assert.deepEqual([...LABELS], [
    "enhancement",
    "platform:macos",
    "area:agents",
    "area:desktop",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /65852/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /52179/i.test(row)));
  assert.ok(EXPECTED.some((row) => /worktrees|compare ref/i.test(row)));
  assert.match(DISTRIBUTION, /\.claude\/worktrees|no changes|slice-118|2\.1\.267|Desktop|1726/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("compare-ref-unreachable"));
  assert.ok(FINGERPRINT_LINES.includes("blindsided"));
  assert.equal(PHRASE, "Score blindside or admit sighted.");
  assert.equal(SAMPLE_BLINDSIDED_FIELD.paneSeesWorktree, false);
  assert.equal(SAMPLE_PANE.empty, true);
  assert.equal(SAMPLE_WORKTREE.ownedDir, ".claude/worktrees/");
  assert.equal(SAMPLE_COMMITS.filesChanged, 5);
  assert.equal(SAMPLE_COMPARE.compareSelectable, false);
});

test("has-repro fingerprints encode the published blindsided field", () => {
  const result = handle(seedBlindsided());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.surface, /Desktop|2\.1\.267/);
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedBlindsided()),
    /blindside\|worktree=owned\|pane=empty\|commits=present\|compare=unreachable\|path=compare-ref-unreachable\|cue=compare-ref-unreachable/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure and Ashpan", () => {
  const required = [
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
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
    "deadletter",
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

test("sighted booth flips blindsided back when the pane can see the far sideline", () => {
  const tape = {
    sighted: true,
    blindsided: false,
    paneEmpty: false,
    cue: "sighted",
  };
  assert.equal(scoreGate(tape).verdict, "sighted");
  tape.sighted = false;
  tape.blindsided = true;
  tape.compareRefUnreachable = true;
  tape.paneEmpty = true;
  tape.commitsPresent = true;
  tape.cue = "blindsided";
  assert.equal(scoreGate(tape).verdict, "blindside");
  tape.sighted = true;
  tape.blindsided = false;
  tape.compareRefUnreachable = false;
  tape.paneEmpty = false;
  tape.commitsPresent = false;
  tape.cue = "sighted";
  assert.equal(scoreGate(tape).verdict, "sighted");
});

test("worktree, pane, commits, compare, and readBooth mark the blindsided field", () => {
  const idle = inspectPaneEmpty({
    sighted: true,
    pane: { reportsNoChanges: false, watchesSessionCwd: true, empty: false },
  });
  assert.equal(idle.stamp, "pane-sees");
  const commits = inspectCommitsPresent({ blindsided: true, commits: SAMPLE_COMMITS });
  assert.equal(commits.stamp, "commits-present");
  assert.equal(commits.filesChanged, 5);
  const tree = inspectWorktreeOwned({
    worktreeOwned: true,
    worktree: SAMPLE_WORKTREE,
  });
  assert.equal(tree.stamp, "worktree-owned");
  const compare = inspectCompareRef({ blindsided: true, compareRefUnreachable: true });
  assert.equal(compare.stamp, "compare-ref-unreachable");
  const booth = readBooth({
    blindsided: true,
    paneEmpty: true,
    pane: SAMPLE_PANE,
    commits: SAMPLE_COMMITS,
    compare: SAMPLE_COMPARE,
  });
  assert.equal(booth.blindsided, true);
  assert.equal(booth.mark, "blindsided");
  const open = readBooth({
    sighted: true,
    blindsided: false,
    paneEmpty: false,
  });
  assert.equal(open.blindsided, false);
  assert.equal(open.mark, "sighted");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 65852);
  assert.equal(COUSINS[1].issue, 52179);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /65852|base|rebuild/i);
  assert.match(COUSINS[1].why, /52179|rebuild/i);
  assert.ok(NOT_PRODUCTS.includes("interdict"));
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
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("deadletter"));
  assert.equal(BACKUPS.length, 23);
  assert.equal(BACKUPS[0].issue, 93778);
  assert.equal(BACKUPS[1].issue, 93766);
  assert.equal(BACKUPS[2].issue, 93764);
  assert.equal(BACKUPS[3].issue, 93754);
  assert.equal(BACKUPS[4].issue, 93751);
  assert.equal(BACKUPS[5].issue, 93744);
  assert.equal(BACKUPS[6].issue, 93772);
  assert.equal(BACKUPS[7].issue, 93770);
  assert.equal(BACKUPS[8].issue, 93777);
  assert.equal(BACKUPS[9].issue, 93782);
  assert.equal(BACKUPS[10].issue, 93800);
  assert.equal(BACKUPS[11].issue, 93795);
  assert.equal(BACKUPS[12].issue, 93821);
  assert.equal(BACKUPS[13].issue, 93811);
  assert.equal(BACKUPS[14].issue, 93809);
  assert.equal(BACKUPS[15].issue, 93834);
  assert.equal(BACKUPS[16].issue, 93823);
  assert.equal(BACKUPS[17].issue, 93825);
  assert.equal(BACKUPS[18].issue, 93797);
  assert.equal(BACKUPS[19].issue, 93780);
  assert.equal(BACKUPS[20].issue, 93779);
  assert.equal(BACKUPS[21].issue, 93776);
  assert.equal(BACKUPS[22].issue, 93769);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93786));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/blindsided.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const sightedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sighted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(sightedFix.status, 0, sightedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "sighted");
  assert.equal(JSON.parse(seeded.stdout).verdict, "blindsided");
  assert.equal(JSON.parse(sightedFix.stdout).verdict, "sighted");
});

test("handle exposes published hypothesis and #93786 headline", () => {
  const result = handle(seedBlindsided());
  assert.equal(result.published.issue, 93786);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [65852, 52179]);
  assert.ok(result.published.backups.includes(93778));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93821));
  assert.ok(result.published.backups.includes(93834));
  assert.ok(result.published.backups.includes(93769));
  assert.ok(!result.published.backups.includes(93786));
  assert.ok(!result.published.backups.includes(65852));
  assert.match(result.published.hypothesis, /diff pane|compare-ref|worktrees|cwd/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93786/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a sideline-scout / blind-side-tackle booth, not interdict or simplex", () => {
  const page = readPage();
  assert.match(page, /Bebas Neue|Bebas\+Neue/);
  assert.match(page, /Source Sans 3|Source\+Sans\+3/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /blindside|blindsided|compare-ref-unreachable|sideline|scout|turf|flood/i);
  assert.match(page, /#0B1F14|#E8EDDF|#F0A202|#1C2420/i);
  assert.match(page, /\bsighted\b/);
  assert.match(page, /\bblindsided\b/);
  assert.match(page, /compare-ref-unreachable/);
  assert.match(page, /Score blindside or admit sighted/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#318/);
  assert.match(page, /#93786/);
  assert.match(page, /Admit sighted/);
  assert.match(page, /Score blindside/);
  assert.match(page, /Walk compare-ref-unreachable/);
  assert.match(page, /Compare sighted \/ blindsided/);
  assert.match(page, /Pin idle sighted/);
  assert.match(page, /Pin seeded blindsided/);
  assert.match(page, /Pin compare-ref-unreachable/);
  assert.match(page, /Hold the sighted/);
  assert.match(page, /\.claude\/worktrees|slice-118|no changes|compare ref|Desktop/i);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Russo One|Russo\+One/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Special Elite|Special\+Elite/);
  assert.doesNotMatch(page, /Archivo Black|Archivo\+Black/);
  assert.doesNotMatch(page, /Bodoni Moda|Bodoni\+Moda/);
  assert.doesNotMatch(page, /Crimson Pro|Crimson\+Pro/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Share Tech Mono|Share\+Tech\+Mono/);
  assert.doesNotMatch(page, /#1A0B18/);
  assert.doesNotMatch(page, /#3A1638/);
  assert.doesNotMatch(page, /#F3E2B8/);
  assert.doesNotMatch(page, /#8E1530/);
  assert.doesNotMatch(page, /#C9A227/);
  assert.doesNotMatch(page, /#041018/);
  assert.doesNotMatch(page, /#0B1A2E/);
  assert.doesNotMatch(page, /#4CFF9A/);
  assert.doesNotMatch(page, /papal-bull|wax seal|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /ON-AIR lamp|broadcast control-room|copper mic grille/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /industrial grate|ashpan tray|ember glow|foundry/i);
  assert.doesNotMatch(page, /parchment rasure|CreationTime|wholesale wipe/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /night chassis|RX downlink|TX uplink|PTT paddle/i);
  assert.doesNotMatch(page, /\bscoped\b/);
  assert.doesNotMatch(page, /\binterdicted\b/);
  assert.doesNotMatch(page, /chrome-prohibit-bleed/);
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
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Simplex/i);
  assert.match(page, /NOT Deadkey/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Rasure/i);
  assert.match(page, /NOT Ashpan/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Blindside/);
  assert.match(readme, /#93786/);
  assert.match(readme, /\bsighted\b/);
  assert.match(readme, /\bblindsided\b/);
  assert.match(readme, /compare-ref-unreachable/);
  assert.match(readme, /Bebas Neue/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Simplex/i);
  assert.match(readme, /NOT Deadkey/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Rasure/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /#65852|#52179/);
  assert.match(readme, /\.claude\/worktrees|slice-118|diff pane|compare ref/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/blindside/);
  assert.match(readme, /node --test projects\/blindside\/blindside\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /blindside|sideline|scout|turf|flood/i);
  assert.match(readme, /Score blindside or admit sighted/);
  assert.match(readme, /#93778|#93766|#93764|#93754|#93751|#93744|#93772|#93770|#93777|#93782|#93800|#93795/);
  assert.match(readme, /00:50/);
});

test("catalog features Blindside only; Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure and Ashpan unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 318);
  assert.equal(hub.products.length, 318);
  assert.equal(catalog.products[0].name, "Blindside");
  assert.equal(catalog.products[0].slug, "blindside");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/blindside/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /00:50 blindside|#93786|sideline-scout/i);
  assert.match(catalog.products[0].summary, /\bsighted\b/);
  assert.match(catalog.products[0].summary, /\bblindsided\b/);
  assert.match(catalog.products[0].summary, /compare-ref-unreachable/);
  assert.match(catalog.products[0].summary, /Score blindside or admit sighted/);
  assert.equal(hub.products[0].slug, "blindside");
  assert.equal(hub.products[0].featured, true);
  const interdict = catalog.products.find((row) => row.slug === "interdict");
  assert.ok(interdict);
  assert.equal(interdict.featured, false);
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
  assert.equal(catalog.products.filter((row) => row.slug === "blindside").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93786") && row.slug !== "blindside"));
});

test("vercel rewrites blindside to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/blindside");
  assert.equal(vercel.rewrites[0].destination, "/projects/blindside");
  assert.equal(vercel.rewrites[1].source, "/blindside/");
  assert.equal(vercel.rewrites[1].destination, "/projects/blindside");
  assert.equal(vercel.rewrites[2].source, "/blindside/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/blindside/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
