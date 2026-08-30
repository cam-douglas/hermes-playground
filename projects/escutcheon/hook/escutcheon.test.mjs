import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  DEMO_DBUS,
  DEMO_GH_BLAME,
  DEMO_MOUNTINFO,
  FEATURED_ISSUE,
  IDLE_WORD,
  RELATED_44180,
  RELATED_89931,
  SAME_CLASS_87008,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffEscutcheon,
  looksEmptyTmpfs,
  looksTokenBlame,
  parseTranscript,
  platedOf,
  reasonsOf,
  score,
  seed90717,
  seedBlamed,
  seedContrastSlype,
  seedControl,
  seedDenyBreaks,
  seedExcludedInert,
  seedLyingAddress,
  seedMasked,
  seedPlated,
  seedPlaintextForced,
  seedReset,
  seedSocketsInert,
  seedStillMasks,
  verdictOf,
} from "./escutcheon.mjs";
import { handle } from "./index.mjs";

const PRIOR_IDLES =
  /empty|mute|idle|unheard|passed|squared|bound|girt|collated|hung|rove|tight|^escutcheon$|^keyhole$|^lacuna$|^ambo$|^slype$|^tally$|^gasket$|^clew$|^fob$|^chatelaine$/;

function assertIdleNeverEscutcheon(result) {
  assert.equal(result.idleWord, "plated");
  assert.equal(IDLE_WORD, "plated");
  assert.doesNotMatch(result.idleWord, /escutcheon/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90717 blamed is blamed, never plated", () => {
  const seed = seedBlamed();
  const result = decide(seed);
  assert.equal(result.verdict, "blamed");
  assert.equal(result.state, "blamed");
  assert.equal(classify(seed.escutcheon), "blamed");
  assert.equal(verdictOf(seed.escutcheon), "blamed");
  assert.notEqual(result.verdict, "plated");
  assert.equal(result.alarm, true);
  assert.equal(result.blamed, true);
  assert.equal(result.plated, false);
  assertIdleNeverEscutcheon(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.triad, true);
  assert.equal(result.facts.emptyTmpfs, true);
  assert.equal(result.facts.tokenBlame, true);
  assert.match(result.feed, /Blamed|token in default is invalid|#90717/i);
  assert.equal(decideSeed("blamed").verdict, "blamed");
  assert.equal(decideSeed("90717").verdict, "blamed");
  assert.equal(decide(seed90717()).verdict, "blamed");
});

test("2 idle/empty/{} is plated, never the product name, never empty", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.verdict, "plated");
  assert.equal(result.alarm, false);
  assert.equal(result.plated, true);
  assert.equal(classify({}), "plated");
  assert.equal(classify(emptyProbe()), "plated");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).plated, true);
  assertIdleNeverEscutcheon(result);
  assert.equal(decide({ action: "bail" }).verdict, "plated");
  assert.equal(decide({}).verdict, "plated");
});

test("3 honest plated hold: runtime bound, bus present, keyring reachable", () => {
  const result = decide(seedPlated());
  assert.equal(result.verdict, "plated");
  assert.equal(result.alarm, false);
  assert.equal(result.plated, true);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.runtimeExists, true);
  assert.equal(result.facts.busExists, true);
  assert.match(result.feed, /Plated|keyring reachable|idle word is plated/i);
  assert.equal(decideSeed("control").verdict, "plated");
  assert.equal(decide(seedControl()).plated, true);
  assert.equal(platedOf(seedPlated().escutcheon), true);
});

test("4 plated must not be confused with blamed or a lever fail", () => {
  const hold = decide(seedPlated());
  const blamed = decide(seedBlamed());
  const masked = decide(seedMasked());
  assert.equal(hold.verdict, "plated");
  assert.equal(blamed.verdict, "blamed");
  assert.equal(masked.verdict, "masked");
  assert.notEqual(hold.verdict, blamed.verdict);
  assert.equal(hold.plated, true);
  assert.equal(blamed.plated, false);
});

test("5 parseTranscript scores mountinfo + env + gh blame as blamed", () => {
  const transcript = [
    `$ echo "$DBUS_SESSION_BUS_ADDRESS"`,
    DEMO_DBUS,
    "$ ls -a /run/user/1000",
    "ls: cannot access '/run/user/1000': No such file or directory",
    "$ gh auth status",
    DEMO_GH_BLAME,
    "$ grep '/run/user ' /proc/self/mountinfo",
    DEMO_MOUNTINFO,
  ].join("\n");
  const probe = parseTranscript(transcript);
  assert.equal(looksEmptyTmpfs(probe.mountinfo), true);
  assert.equal(looksTokenBlame(probe.ghStatus), true);
  assert.equal(probe.dbusAddress, DEMO_DBUS);
  assert.equal(probe.runtimeExists, false);
  const result = score(probe);
  assert.equal(result.verdict, "blamed");
  assert.equal(result.plated, false);
  assert.equal(result.facts.triad, true);
});

test("6 nearby flags win their own seeds", () => {
  assert.equal(decide(seedMasked()).verdict, "masked");
  assert.equal(decide(seedLyingAddress()).verdict, "lying-address");
  assert.equal(decide(seedSocketsInert()).verdict, "sockets-inert");
  assert.equal(decide(seedSocketsInert()).issue, RELATED_44180);
  assert.equal(decide(seedExcludedInert()).verdict, "excluded-inert");
  assert.equal(decide(seedExcludedInert()).issue, RELATED_89931);
  assert.equal(decide(seedStillMasks()).verdict, "still-masks");
  assert.equal(decide(seedPlaintextForced()).verdict, "plaintext-forced");
  assert.equal(decide(seedDenyBreaks()).verdict, "deny-breaks");
  assert.match(feedOf("sockets-inert"), /#44180/);
  assert.match(feedOf("excluded-inert"), /#89931/);
});

test("7 slype contrast is off-escutcheon, not this door, no alarm", () => {
  const contrast = decide(seedContrastSlype());
  assert.equal(isOffEscutcheon(seedContrastSlype().escutcheon), true);
  assert.equal(contrast.offEscutcheon, true);
  assert.equal(contrast.alarm, false);
  assert.equal(contrast.plated, false);
  assert.equal(contrast.issue, 90676);
});

test("8 admit does not lie: blamed stays blamed; restore shows #90717", () => {
  const admitted = decide({ action: "admit", escutcheon: seedBlamed().escutcheon });
  assert.equal(admitted.verdict, "blamed");
  assert.equal(admitted.plated, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "blamed");
  assert.equal(restored.facts.triad, true);
  assert.equal(decide(seedReset()).verdict, "plated");
  assert.equal(decide({ action: "control" }).verdict, "plated");
});

test("9 handle deny on blamed, allow on plated", async () => {
  const deny = await handle(seedBlamed());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "blamed");
  const allow = await handle(seedPlated());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "plated");
});

test("10 verdicts locked; idle never a banned name; fail chips never plated", () => {
  assert.deepEqual(VERDICTS, [
    "plated",
    "blamed",
    "masked",
    "lying-address",
    "sockets-inert",
    "excluded-inert",
    "still-masks",
    "plaintext-forced",
    "deny-breaks",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("escutcheon"));
  assert.ok(banned.includes("lacuna"));
  assert.ok(banned.includes("slype"));
  assert.ok(banned.includes("fob"));
  assert.ok(banned.includes("chatelaine"));
  assert.ok(!banned.includes("plated"));
  assert.ok(ALARM_VERDICTS.includes("blamed"));
  for (const seed of [
    seedBlamed(),
    seedMasked(),
    seedLyingAddress(),
    seedSocketsInert(),
    seedExcludedInert(),
    seedStillMasks(),
    seedPlaintextForced(),
    seedDenyBreaks(),
  ]) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "plated");
    assert.equal(result.plated, false);
  }
});

test("11 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Slype/i);
  assert.match(readme, /NOT \**Gasket/i);
  assert.match(readme, /NOT \**Clew/i);
  assert.match(readme, /NOT \**Fob/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /plated/);
  assert.match(readme, /NEVER use plated for a failure/i);
  assert.match(readme, /#90717/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*plated\*\*/);
});

test("12 constants cite real issues only", () => {
  assert.equal(FEATURED_ISSUE, 90717);
  assert.equal(SAME_CLASS_87008, 87008);
  assert.equal(RELATED_44180, 44180);
  assert.equal(RELATED_89931, 89931);
  assert.match(reasonsOf(seedBlamed().escutcheon, "blamed").join("\n"), /#90717/);
  assert.equal(analyze(seedBlamed().escutcheon).triad, true);
});
