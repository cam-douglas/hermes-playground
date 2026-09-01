import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ARTIFACT_CHECKOUT,
  ARTIFACT_NEXT,
  ARTIFACT_NODE_MODULES,
  ARTIFACT_TOTAL,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CREATED_AT,
  DESKTOP_VERSION,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  POOLED_AT,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isAired,
  isStocked,
  normalize,
  score,
  seedAired,
  seedArchivedToPool,
  seedArtifactsKept,
  seedCleanupPeriodMisses,
  seedCousin,
  seedDocsSayRemove,
  seedGitWorktreeListed,
  seedHold,
  seedLeasedByNull,
  seedNoTtl,
  seedParallelMultiplies,
  seedPooledAtReuse,
  seedStillOnDisk,
  seedStocked,
  seedUntrackedDirGcOnly,
} from "./garner.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./garner.mjs", import.meta.url));
}

test("archive remove + disk gone → aired", () => {
  const result = analyze({
    archived: true,
    poolRelease: false,
    leasedBy: null,
    stillOnDisk: false,
    gitWorktreeListed: false,
    ttlPresent: true,
    docsSayRemove: true,
    cleanupPeriodDaysApplies: true,
  });
  assert.equal(result.verdict, "aired");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stocked, false);
  assert.equal(result.aired, true);
  assert.equal(isAired(result.ticket), true);
  assert.equal(isStocked(result.ticket), false);
});

test("archive + pool release + still on disk + no TTL → stocked", () => {
  const result = analyze({
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    docsSayRemove: true,
    artifactBytes: "6.3G",
    cleanupPeriodDaysApplies: false,
  });
  assert.equal(result.verdict, "stocked");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.stocked, true);
  assert.equal(isStocked(result.ticket), true);
  assert.ok(result.chips.includes("stocked"));
  assert.ok(result.chips.includes("archived-to-pool"));
  assert.ok(result.chips.includes("no-ttl"));
  assert.ok(result.chips.includes("still-on-disk"));
  assert.ok(!result.chips.includes("aired"));
});

test("idle aired is a hold; archive removes the worktree", () => {
  const result = analyze(seedAired());
  assert.equal(result.verdict, "aired");
  assert.equal(result.idleWord, "aired");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stocked, false);
  assert.equal(result.aired, true);
  assert.ok(result.chips.includes("aired"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("stocked"));
  assert.equal(result.ticket.poolRelease, false);
  assert.equal(result.ticket.stillOnDisk, false);
  assert.match(result.contrast.bin, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /stocked|pooled|drained|hinged|pealed|warded|first-wins|seized/i,
  );
});

test("empty ticket and empty stdin classify aired", () => {
  assert.equal(classify(emptyTicket()), "aired");
  assert.equal(classify(""), "aired");
  assert.equal(classify(null), "aired");
  assert.equal(decideSeed("aired").verdict, "aired");
  assert.equal(decideSeed("emptied").verdict, "aired");
});

test("seeded stocked #91246 is alarm with pool, no TTL, disk kept", () => {
  const result = analyze(seedStocked());
  assert.equal(result.verdict, "stocked");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.stocked, true);
  assert.ok(result.chips.includes("stocked"));
  assert.ok(result.chips.includes("archived-to-pool"));
  assert.ok(result.chips.includes("no-ttl"));
  assert.ok(result.chips.includes("still-on-disk"));
  assert.ok(result.chips.includes("git-worktree-listed"));
  assert.ok(result.chips.includes("leasedBy-null"));
  assert.ok(result.chips.includes("artifacts-kept"));
  assert.ok(result.chips.includes("docs-say-remove"));
  assert.ok(!result.chips.includes("aired"));
  assert.match(result.contrast.bin, /stocked/i);
  assert.equal(result.ticket.leasedBy, null);
  assert.equal(result.ticket.artifactBytes, ARTIFACT_TOTAL);
});

test("data fixtures classify aired vs stocked vs named chips", () => {
  assert.equal(classify(readData("aired.json")), "aired");
  assert.equal(classify(readData("stocked.json")), "stocked");
  assert.equal(classify(readData("91246.json")), "stocked");
  assert.equal(classify(readData("archived-to-pool.json")), "archived-to-pool");
  assert.equal(classify(readData("no-ttl.json")), "no-ttl");
  assert.equal(classify(readData("still-on-disk.json")), "still-on-disk");
  assert.equal(classify(readData("git-worktree-listed.json")), "git-worktree-listed");
  assert.equal(classify(readData("leasedBy-null.json")), "leasedBy-null");
  assert.equal(classify(readData("artifacts-kept.json")), "artifacts-kept");
  assert.equal(classify(readData("docs-say-remove.json")), "docs-say-remove");
  assert.equal(
    classify(readData("cleanupPeriodDays-misses-desktop.json")),
    "cleanupPeriodDays-misses-desktop",
  );
  assert.equal(classify(readData("untrackedDirGc-only.json")), "untrackedDirGc-only");
  assert.equal(
    classify(readData("pooledAt-for-reuse-not-evict.json")),
    "pooledAt-for-reuse-not-evict",
  );
  assert.equal(classify(readData("parallel-multiplies.json")), "parallel-multiplies");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("stocked seed is alarm; aired / hold are holds", () => {
  assert.equal(score(seedStocked()).alarm, true);
  assert.equal(score(seedStocked()).hold, false);
  assert.equal(score(seedAired()).hold, true);
  assert.equal(score(seedAired()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedArchivedToPool()).alarm, true);
  assert.equal(score(seedNoTtl()).alarm, true);
});

test("normalize seeds 91246 without ticket fields", () => {
  const ticket = normalize({ issue: 91246 });
  assert.equal(ticket.archived, true);
  assert.equal(ticket.poolRelease, true);
  assert.equal(ticket.stillOnDisk, true);
  assert.equal(ticket.ttlPresent, false);
  assert.equal(ticket.leasedBy, null);
  assert.equal(classify(ticket), "stocked");
});

test("score / decide / handle agree on stocked vs aired", () => {
  assert.equal(score(seedStocked()).verdict, "stocked");
  assert.equal(decide(seedAired()).verdict, "aired");
  const fail = handle(seedStocked());
  const hold = handle(seedAired());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91246/);
  assert.match(hold.hookSpecificOutput.additionalContext, /aired/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("stocked").verdict, "stocked");
  assert.equal(decideSeed(91246).verdict, "stocked");
  assert.equal(decideSeed("91246").verdict, "stocked");
  assert.equal(decideSeed("aired").verdict, "aired");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("archived-to-pool").verdict, "archived-to-pool");
  assert.equal(decideSeed("no-ttl").verdict, "no-ttl");
  assert.equal(decideSeed("artifacts-kept").verdict, "artifacts-kept");
});

test("CLI scores data files", () => {
  const stocked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91246.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(stocked.status, 0, stocked.stderr);
  assert.equal(JSON.parse(stocked.stdout).verdict, "stocked");
  assert.equal(JSON.parse(stocked.stdout).alarm, true);

  const aired = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/aired.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(aired.status, 0, aired.stderr);
  assert.equal(JSON.parse(aired.stdout).verdict, "aired");
  assert.equal(JSON.parse(aired.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91246);
  assert.deepEqual([...PRIMARY_ISSUES], [91246]);
  assert.equal(COUSIN_ISSUE, 88239);
  assert.deepEqual([...COUSINS], [88239, 83180, 76144, 75911, 88883, 87963, 84162]);
  assert.equal(FILED_AT, "2026-09-01T15:09:32Z");
  assert.equal(DESKTOP_VERSION, "1.40609.0");
  assert.equal(PLATFORM, "linux");
  assert.equal(REPORTER, "secondl1ght");
  assert.equal(ARTIFACT_TOTAL, "6.3G");
  assert.equal(ARTIFACT_NEXT, "5.0G");
  assert.equal(ARTIFACT_NODE_MODULES, "1.2G");
  assert.equal(ARTIFACT_CHECKOUT, "~120M");
  assert.equal(CREATED_AT, 1788230281178);
  assert.equal(POOLED_AT, 1788239112270);
  assert.equal(IDLE_WORD, "aired");
  assert.equal(SEEDED_WORD, "stocked");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "first-wins");
  assert.notEqual(IDLE_WORD, "seized");
  assert.deepEqual([...HOLD_VERDICTS], ["aired", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("stocked"));
  assert.ok(ALARM_VERDICTS.includes("no-ttl"));
  assert.ok(!ALARM_VERDICTS.includes("aired"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 14);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:desktop"],
  );
  assert.match(TITLE, /pooled session worktrees are never reclaimed/);
  assert.match(ISSUE_URL, /91246/);
  assert.match(PHRASE, /stocks the loft instead of airing/i);
  assert.match(HUB_LINE, /06:50 garner/);
  assert.match(HUB_LINE, /admit aired/);
  assert.match(MARK, /06:50/);
  assert.match(MARK, /#107/);
  assert.match(MARK, /#91246/);
  assert.match(CONTRAST_NOTE, /DESKTOP ARCHIVE RELEASES SESSION WORKTREE/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("sluice"));
  assert.ok(NOT_PRODUCTS.includes("pintle"));
  assert.ok(NOT_PRODUCTS.includes("carillon"));
  assert.ok(BANNED_NAMES.includes("Granary"));
  assert.ok(BANNED_NAMES.includes("Sluice"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "aired");
  assert.equal(chips.seededWord, "stocked");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91246);
  assert.equal(fp.cousin, 88239);
  assert.deepEqual(fp.cousins, [88239, 83180, 76144, 75911, 88883, 87963, 84162]);
  assert.equal(fp.desktopVersion, "1.40609.0");
  assert.equal(fp.artifactTotal, "6.3G");
  assert.equal(fp.artifactNext, "5.0G");
  assert.equal(fp.artifactNodeModules, "1.2G");
  assert.equal(fp.artifactCheckout, "~120M");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "stocked");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.archivePools, true);
});

test("chipsOf on a raw pooled archive ticket still marks stocked", () => {
  const chips = chipsOf({
    archived: true,
    poolRelease: true,
    leasedBy: null,
    stillOnDisk: true,
    gitWorktreeListed: true,
    ttlPresent: false,
    docsSayRemove: true,
    artifactBytes: "6.3G",
    outputText: "stocked; archive → pool; leasedBy null; still on disk",
  });
  assert.ok(chips.includes("stocked"));
  assert.ok(chips.includes("archived-to-pool"));
  assert.ok(chips.includes("leasedBy-null"));
  assert.ok(chips.includes("artifacts-kept"));
  assert.ok(!chips.includes("aired"));
});

test("cousin #88239 is not conflated with stocked primary", () => {
  assert.notEqual(classify(seedCousin()), "stocked");
  assert.notEqual(classify({ issue: 88239 }), "stocked");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /88239|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become stocked", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "stocked", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91246);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedArchivedToPool()).verdict, "archived-to-pool");
  assert.equal(analyze(seedNoTtl()).verdict, "no-ttl");
  assert.equal(analyze(seedStillOnDisk()).verdict, "still-on-disk");
  assert.equal(analyze(seedGitWorktreeListed()).verdict, "git-worktree-listed");
  assert.equal(analyze(seedLeasedByNull()).verdict, "leasedBy-null");
  assert.equal(analyze(seedArtifactsKept()).verdict, "artifacts-kept");
  assert.equal(analyze(seedDocsSayRemove()).verdict, "docs-say-remove");
  assert.equal(analyze(seedCleanupPeriodMisses()).verdict, "cleanupPeriodDays-misses-desktop");
  assert.equal(analyze(seedUntrackedDirGcOnly()).verdict, "untrackedDirGc-only");
  assert.equal(analyze(seedPooledAtReuse()).verdict, "pooledAt-for-reuse-not-evict");
  assert.equal(analyze(seedParallelMultiplies()).verdict, "parallel-multiplies");
  assert.equal(analyze(seedHold()).ticket.stillOnDisk, false);
  assert.equal(isStocked(seedAired()), false);
  assert.equal(isStocked(seedStocked()), true);
});

test("living page is a Garner loft, idle aired, seeded stocked", () => {
  const html = readPage();
  assert.match(html, /<title>Garner/);
  assert.match(html, /Idle word:\s*aired/);
  assert.match(html, /aired/);
  assert.match(html, /stocked/);
  assert.match(html, /archived-to-pool/);
  assert.match(html, /no-ttl/);
  assert.match(html, /still-on-disk/);
  assert.match(html, /git-worktree-listed/);
  assert.match(html, /leasedBy-null/);
  assert.match(html, /artifacts-kept/);
  assert.match(html, /docs-say-remove/);
  assert.match(html, /cleanupPeriodDays-misses-desktop/);
  assert.match(html, /#91246/);
  assert.match(html, /#88239/);
  assert.match(html, /#83180/);
  assert.match(html, /#76144/);
  assert.match(html, /#75911/);
  assert.match(html, /#88883/);
  assert.match(html, /#87963/);
  assert.match(html, /#84162/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /06:50/);
  assert.match(html, /catalog #107/);
  assert.match(html, /1\.40609\.0/);
  assert.match(html, /family=Literata/);
  assert.match(html, /family=Atkinson\+Hyperlegible|Atkinson Hyperlegible/);
  assert.match(html, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the loft/);
  assert.match(html, /Pin idle aired/);
  assert.match(html, /Pin seeded stocked/);
  assert.match(html, /Admit aired/);
  assert.match(html, /bin door|archive latch|airing hatch/i);
  assert.match(html, /DESKTOP ARCHIVE RELEASES SESSION WORKTREE/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*stocked/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*hinged/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*first-wins/i);
  assert.doesNotMatch(html, /Idle word:\s*seized/i);
  assert.doesNotMatch(html, /Pin idle stocked/);
  assert.doesNotMatch(html, /Pin idle hinged/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  assert.doesNotMatch(html, /family=JetBrains\+Mono/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(html, new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("README and page stay Garner, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Garner/m);
  assert.match(readme, /Why not a clone/);
  assert.match(readme, /DESKTOP ARCHIVE RELEASES SESSION WORKTREE TO A POOL WITH NO EXPIRY/);
  assert.match(readme, /NOT \*\*Sluice\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /Product name stays \*\*Garner\*\*/);
  assert.match(readme, /Idle word: \*\*aired\*\*/);
  assert.match(readme, /#88239/);
  assert.match(readme, /#83180/);
  assert.match(readme, /#76144/);
  assert.doesNotMatch(readme, /^# Sluice/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
});
