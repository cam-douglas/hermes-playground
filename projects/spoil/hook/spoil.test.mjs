import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CCD,
  CHIPS,
  CONTRAST_NOTE,
  CROSS,
  DAMAGE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  GIT,
  HOLD_VERDICTS,
  HUB_LINE,
  IDLE_WORD,
  INCIDENTS,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  OS_NAME,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  SESSIONS,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedBanked,
  seedSpoiled,
} from "./spoil.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./spoil.mjs", import.meta.url));
}

test("idle banked is a hold; tip is properly banked", () => {
  const result = analyze(seedBanked());
  assert.equal(result.verdict, "banked");
  assert.equal(result.idleWord, "banked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.spoiled, false);
  assert.ok(result.chips.includes("banked"));
  assert.ok(!result.chips.includes("spoiled"));
  assert.ok(!result.chips.includes("stale-index"));
  assert.doesNotMatch(
    result.idleWord,
    /spoil|spoiled|stale|revert|delete|index|lag|concurrent|cotenant|banked-as-seed|trammel|hunting|traced|soundpost|flong|bulla|trompe|davy|moviola|clepsydra|dripping/i,
  );
});

test("empty ticket and empty stdin classify banked", () => {
  assert.equal(classify(emptyTicket()), "banked");
  assert.equal(classify(""), "banked");
  assert.equal(classify(null), "banked");
  assert.equal(decideSeed("banked").verdict, "banked");
});

test("seeded spoiled #90943 is alarm with the stale-index chips", () => {
  const result = analyze(seedSpoiled());
  assert.equal(result.verdict, "spoiled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("spoiled"));
  assert.ok(result.chips.includes("stale-index"));
  assert.ok(result.chips.includes("private-index"));
  assert.ok(result.chips.includes("cotenant"));
  assert.ok(result.chips.includes("delete-add"));
  assert.ok(result.chips.includes("revert-blob"));
  assert.ok(result.chips.includes("silent-ok"));
  assert.ok(result.chips.includes("no-conflict"));
  assert.ok(result.chips.includes("shared-head"));
  assert.ok(result.chips.includes("staged-deletion-exists"));
  assert.ok(!result.chips.includes("banked"));
  assert.ok(!result.chips.includes("worktree-immune"));
  assert.match(result.contrast.tip, /one repo one branch/);
  assert.match(result.contrast.tray, /GIT_INDEX_FILE/);
  assert.match(result.contrast.bank, /stale private index/);
});

test("data fixtures classify banked vs spoiled vs named chips", () => {
  assert.equal(classify(readData("banked.json")), "banked");
  assert.equal(classify(readData("spoiled.json")), "spoiled");
  assert.equal(classify(readData("90943.json")), "spoiled");
  assert.equal(classify(readData("stale-index.json")), "stale-index");
  assert.equal(classify(readData("private-index.json")), "private-index");
  assert.equal(classify(readData("cotenant.json")), "cotenant");
  assert.equal(classify(readData("delete-add.json")), "delete-add");
  assert.equal(classify(readData("revert-blob.json")), "revert-blob");
  assert.equal(classify(readData("silent-ok.json")), "silent-ok");
  assert.equal(classify(readData("no-conflict.json")), "no-conflict");
  assert.equal(classify(readData("shared-head.json")), "shared-head");
  assert.equal(classify(readData("worktree-immune.json")), "worktree-immune");
  assert.equal(classify(readData("staged-deletion-exists.json")), "staged-deletion-exists");
});

test("spoiled seed is alarm; banked seed is hold", () => {
  assert.equal(score(seedSpoiled()).alarm, true);
  assert.equal(score(seedSpoiled()).hold, false);
  assert.equal(score(seedBanked()).hold, true);
  assert.equal(score(seedBanked()).alarm, false);
});

test("normalize seeds 90943 without ticket fields", () => {
  const ticket = normalize({ issue: 90943 });
  assert.equal(ticket.privateIndex, true);
  assert.equal(ticket.staleIndex, true);
  assert.equal(ticket.cotenantSessions, true);
  assert.equal(ticket.otherAddedMissing, true);
  assert.equal(ticket.otherChangedStale, true);
  assert.equal(classify(ticket), "spoiled");
});

test("score / decide / handle agree on spoiled vs banked", () => {
  assert.equal(score(seedSpoiled()).verdict, "spoiled");
  assert.equal(decide(seedBanked()).verdict, "banked");
  const fail = handle(seedSpoiled());
  const hold = handle(seedBanked());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90943/);
  assert.match(hold.hookSpecificOutput.additionalContext, /banked/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("spoiled").verdict, "spoiled");
  assert.equal(decideSeed(90943).verdict, "spoiled");
  assert.equal(decideSeed("90943").verdict, "spoiled");
  assert.equal(decideSeed("banked").verdict, "banked");
});

test("CLI scores data files", () => {
  const spoiled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/spoiled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(spoiled.status, 0, spoiled.stderr);
  assert.equal(JSON.parse(spoiled.stdout).verdict, "spoiled");

  const banked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/banked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(banked.status, 0, banked.stderr);
  assert.equal(JSON.parse(banked.stdout).verdict, "banked");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90943);
  assert.deepEqual([...PRIMARY_ISSUES], [90943]);
  assert.deepEqual([...SAME_CLASS], [86304, 52051]);
  assert.deepEqual([...CROSS], ["openai/codex#28972"]);
  assert.equal(REPORTER, "capraCoder");
  assert.equal(FILED_AT, "2026-08-31T09:46:58Z");
  assert.equal(CCD, "2.1.251");
  assert.equal(OS_NAME, "Windows 11");
  assert.equal(GIT, "2.54.0");
  assert.equal(INCIDENTS, 5);
  assert.equal(SESSIONS, 11);
  assert.deepEqual([...DAMAGE.paths], ["D a.txt", "A b.txt", "M shared.txt"]);
  assert.equal(DAMAGE.shared, "v1");
  assert.equal(IDLE_WORD, "banked");
  assert.equal(SEEDED_WORD, "spoiled");
  assert.notEqual(IDLE_WORD, "spoiled");
  assert.notEqual(IDLE_WORD, "spoil");
  assert.deepEqual([...HOLD_VERDICTS], ["banked"]);
  assert.ok(ALARM_VERDICTS.includes("spoiled"));
  assert.ok(!ALARM_VERDICTS.includes("banked"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:core", "data-loss"],
  );
  assert.match(TITLE, /stale git index silently deletes and reverts/);
  assert.match(ISSUE_URL, /90943/);
  assert.match(PHRASE, /spoiled index is not a hold/i);
  assert.match(HUB_LINE, /19:50 spoil tip/);
  assert.match(MARK, /19:50/);
  assert.match(MARK, /#93/);
  assert.match(MARK, /#90943/);
  assert.match(CONTRAST_NOTE, /linked worktree has own HEAD\+index/);
  assert.ok(NOT_PRODUCTS.includes("trammel"));
  assert.ok(NOT_PRODUCTS.includes("soundpost"));
  assert.ok(NOT_PRODUCTS.includes("flong"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "banked");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90943);
  assert.equal(fp.ccd, "2.1.251");
  assert.equal(fp.git, "2.54.0");
  assert.deepEqual(fp.sameClass, [86304, 52051]);
  assert.deepEqual(fp.cross, ["openai/codex#28972"]);
  const contrast = readData("contrast.json");
  assert.match(contrast.workaround.result, /own HEAD/);
  assert.equal(contrast.sameClass.stashPop, 86304);
  assert.equal(contrast.sameClass.workingTreeCollisions, 52051);
});

test("chipsOf on a raw spoiled ticket still marks revert-blob", () => {
  const chips = chipsOf({
    privateIndex: true,
    staleIndex: true,
    cotenantSessions: true,
    sharedHead: true,
    otherAddedMissing: true,
    otherChangedStale: true,
    silentExit0: true,
    noConflict: true,
    worktree: false,
    stagedDeletionExists: true,
    indexMatchesHead: false,
  });
  assert.ok(chips.includes("spoiled"));
  assert.ok(chips.includes("revert-blob"));
  assert.ok(chips.includes("delete-add"));
  assert.ok(!chips.includes("banked"));
  assert.ok(!chips.includes("worktree-immune"));
});

test("linked worktree contrast does not spoil", () => {
  const result = analyze({
    privateIndex: true,
    staleIndex: true,
    cotenantSessions: true,
    sharedHead: false,
    otherAddedMissing: true,
    otherChangedStale: true,
    silentExit0: true,
    noConflict: true,
    worktree: true,
    indexMatchesHead: false,
  });
  assert.notEqual(result.verdict, "spoiled");
  assert.ok(result.reasons.some((row) => /linked worktree/i.test(row)));
  assert.ok(result.chips.includes("worktree-immune"));
});

test("living page is a spoil-tip assay shed, idle banked, seeded spoiled", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*banked/);
  assert.match(html, /banked/);
  assert.match(html, /spoiled/);
  assert.match(html, /stale-index/);
  assert.match(html, /private-index/);
  assert.match(html, /cotenant/);
  assert.match(html, /delete-add/);
  assert.match(html, /revert-blob/);
  assert.match(html, /silent-ok/);
  assert.match(html, /no-conflict/);
  assert.match(html, /shared-head/);
  assert.match(html, /worktree-immune/);
  assert.match(html, /staged-deletion-exists/);
  assert.match(html, /#90943/);
  assert.match(html, /#86304/);
  assert.match(html, /#52051/);
  assert.match(html, /codex#28972/);
  assert.match(html, /19:50/);
  assert.match(html, /catalog #93/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /capraCoder/);
  assert.match(html, /Instrument\+Serif|Instrument Serif/);
  assert.match(html, /Source\+Serif\+4|Source Serif 4/);
  assert.match(html, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(html, /Score the spoil/);
  assert.match(html, /Pin idle banked/);
  assert.match(html, /Pin seeded spoiled/);
  assert.match(html, /Bank the tip/);
  assert.match(html, /Assay the index/);
  assert.match(html, /spoil/i);
  assert.match(html, /assay/i);
  assert.match(html, /corrugated/i);
  assert.doesNotMatch(html, /Idle word:\s*spoiled/i);
  assert.doesNotMatch(html, /Idle word:\s*spoil\b/i);
  assert.doesNotMatch(html, /Idle word:\s*traced/);
  assert.doesNotMatch(html, /Idle word:\s*coupled/);
  assert.doesNotMatch(html, /Idle word:\s*struck/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /Pin idle traced/);
  assert.doesNotMatch(html, /Score the plates/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /family=Barlow/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /luthier cutaway/);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /hide-glue/);
  assert.doesNotMatch(html, /mahogany/);
  assert.doesNotMatch(html, /Prussian/);
});
