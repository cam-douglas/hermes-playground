import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  analyze,
  classify,
  score,
  scoreFields,
  handle,
  seeds,
  seedBound,
  seedLeaked,
  seedClosed,
  fingerprint,
  signals,
  boundSignal,
  leakedSignal,
  closedSignal,
  sedRangeReopenSignal,
  bodyHrBleedSignal,
  enabledConcatSignal,
  silentDisabledSignal,
  falseAsMissingSignal,
  validateHrCountSignal,
  folioClosed,
  chaseWasLeaked,
  sedRangeExtract,
  closedExtract,
  lookupField,
  publishedReproOutput,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  CHASE_LEDGER,
  REPRO_TABLE,
  PUBLISHED_REPRO,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./dinkus.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92798 fixture scores leaked", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92798.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "leaked");
  assert.equal(out.leaked, true);
  assert.ok(out.chips.includes("leaked"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is bound", () => {
  const out = decide({});
  assert.equal(out.verdict, "bound");
  assert.equal(out.bound, true);
  assert.equal(out.leaked, false);
  assert.ok(HOLD.has("bound"));
  assert.equal(IDLE_WORD, "bound");
});

test("bound fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "bound.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "bound");
  assert.equal(out.bound, true);
  assert.ok(HOLD.has(out.verdict));
});

test("leaked fixture scores leaked", () => {
  const out = decide(seedLeaked());
  assert.equal(out.verdict, "leaked");
  assert.equal(out.leaked, true);
  assert.ok(out.chips.includes("leaked"));
  assert.ok(out.chips.includes("sed-range-reopen"));
  assert.ok(ALARM.has(out.verdict));
});

test("closed seed is a hold", () => {
  const out = decide(seedClosed());
  assert.equal(out.verdict, "closed");
  assert.equal(out.closed, true);
  assert.equal(out.leaked, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "leaked");
  assert.equal(ADMIT_WORD, "closed");
});

test("bound seed is idle hold", () => {
  const out = decide(seedBound());
  assert.equal(out.verdict, "bound");
  assert.equal(out.bound, true);
  assert.ok(HOLD.has("bound"));
});

test("sed-range-reopen chip", () => {
  const out = decide({ seed: "sed-range-reopen", sedRangeReopen: true });
  assert.equal(out.verdict, "sed-range-reopen");
  assert.equal(out.leaked, true);
  assert.match(out.reasons.join(" "), /start pattern matches again/);
  assert.match(out.reasons.join(" "), /sed -n/);
});

test("body-hr-bleed chip", () => {
  const out = decide({ seed: "body-hr-bleed", bodyHrBleed: true });
  assert.equal(out.verdict, "body-hr-bleed");
  assert.match(out.reasons.join(" "), /horizontal rule in the body/);
});

test("enabled-true-false-concat chip", () => {
  const out = decide({ seed: "enabled-true-false-concat", enabledTrueFalseConcat: true });
  assert.equal(out.verdict, "enabled-true-false-concat");
  assert.match(out.reasons.join(" "), /true/);
  assert.match(out.reasons.join(" "), /false/);
});

test("silent-disabled-path chip", () => {
  const out = decide({ seed: "silent-disabled-path", silentDisabledPath: true });
  assert.equal(out.verdict, "silent-disabled-path");
  assert.match(out.reasons.join(" "), /nothing printed/);
  assert.match(out.reasons.join(" "), /disabled path/);
});

test("false-as-missing chip", () => {
  const out = decide({ seed: "false-as-missing", falseAsMissing: true });
  assert.equal(out.verdict, "false-as-missing");
  assert.match(out.reasons.join(" "), /Field 'enabled' not found/);
  assert.match(out.reasons.join(" "), /-z/);
});

test("validate-hr-count chip", () => {
  const out = decide({ seed: "validate-hr-count", validateHrCount: true });
  assert.equal(out.verdict, "validate-hr-count");
  assert.match(out.reasons.join(" "), /Check 3/);
  assert.match(out.reasons.join(" "), /Check 7/);
  assert.match(out.reasons.join(" "), /Check 8/);
});

test("cousins cite-only --- / frontmatter neighbourhood", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /52755/);
  assert.match(out.reasons.join(" "), /92798/);
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[0].id, 52755);
  assert.equal(COUSINS[1].id, 44901);
  assert.equal(COUSINS[2].id, 19377);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "bound");
  assert.equal(score(seedClosed()).verdict, "closed");
  assert.equal(handle('{"seed":"leaked","leaked":true}').verdict, "leaked");
  assert.equal(handle({ seed: "closed", closed: true }).verdict, "closed");
  const bag = seeds();
  assert.equal(decide(bag.bound).verdict, "bound");
  assert.equal(decide(bag.leaked).verdict, "leaked");
  assert.equal(decide(bag.closed).verdict, "closed");
  assert.equal(scoreFields(seedLeaked()).leaked, true);
});

test("fingerprint and signals detect dinkus facts", () => {
  assert.equal(
    boundSignal("idle folio is bound; pin idle bound; frontmatter stops at the first closing; body hairlines stay in the body"),
    true
  );
  assert.equal(
    leakedSignal("sed range reopens; body keys bleed; true\\nfalse; silent disabled path"),
    true
  );
  assert.equal(closedSignal("already closed; opening --- on line 1; quits at first close"), true);
  assert.equal(sedRangeReopenSignal("sed-range-reopen sed -n start pattern matches again"), true);
  assert.equal(bodyHrBleedSignal("body-hr-bleed horizontal rule in the body"), true);
  assert.equal(enabledConcatSignal("enabled-true-false-concat true\\nfalse"), true);
  assert.equal(silentDisabledSignal("silent-disabled-path compare against \"true\" nothing printed"), true);
  assert.equal(falseAsMissingSignal("false-as-missing Field 'enabled' not found [ -z \"$VALUE\" ]"), true);
  assert.equal(validateHrCountSignal("validate-hr-count Check 3 two horizontal rules"), true);
  const hits = signals(seedLeaked());
  assert.equal(hits.leaked || hits.sedRangeReopen || hits.enabledConcat, true);
  const print = fingerprint(seedLeaked());
  assert.equal(print.leakedHit, true);
  assert.equal(print.chaseLeaked, true);
});

test("fingerprint scores closed folio path", () => {
  const print = fingerprint(seedClosed());
  assert.equal(print.closedClean, true);
  assert.equal(print.leakedHit, false);
  const out = decide({ ...seedClosed(), seed: "closed" });
  assert.equal(out.closed, true);
  assert.equal(out.verdict, "closed");
  assert.equal(folioClosed(seedClosed()), true);
  assert.equal(folioClosed(seedLeaked()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedLeaked());
  assert.equal(alarm.leaked, true);
  const hold = classify(seedClosed());
  assert.equal(hold.closed, true);
  const idle = classify(seedBound());
  assert.equal(idle.bound, true);
});

test("helpers encode chase leak + closed extract", () => {
  assert.equal(chaseWasLeaked(seedLeaked()), true);
  assert.equal(chaseWasLeaked(seedBound()), false);
  assert.equal(chaseWasLeaked({ leaked: true }), true);
  const leakedFm = sedRangeExtract(PUBLISHED_REPRO);
  assert.match(leakedFm, /enabled: true/);
  assert.match(leakedFm, /enabled: false/);
  assert.match(leakedFm, /Config reference/);
  const closedFm = closedExtract(PUBLISHED_REPRO);
  assert.match(closedFm, /enabled: true/);
  assert.doesNotMatch(closedFm, /enabled: false/);
  assert.doesNotMatch(closedFm, /Config reference/);
  assert.equal(publishedReproOutput(), "true\nfalse");
  assert.equal(lookupField(closedFm, "enabled"), "true");
});

test("chase ledger encodes the issue split", () => {
  assert.ok(CHASE_LEDGER.some((row) => row.id === "folio" && /enabled: true/i.test(row.tally)));
  assert.ok(CHASE_LEDGER.some((row) => row.id === "dinkus" && /hairline/i.test(row.note)));
  assert.ok(CHASE_LEDGER.some((row) => row.id === "closed" && /line-1/i.test(row.tally)));
  assert.ok(CHASE_LEDGER.length === 3);
  assert.equal(REPRO_TABLE.length, 4);
  assert.equal(REPRO_TABLE[0].mark, "enabled: true");
  assert.equal(REPRO_TABLE[3].mark, "true\\nfalse");
});

test("measured facts from #92798", () => {
  assert.equal(MEASURED.issue, 92798);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "area:plugins"]);
  assert.equal(MEASURED.filed, "2026-09-08T07:25:28Z");
  assert.equal(MEASURED.reporter, "Sagexd08");
  assert.match(MEASURED.scripts, /plugin-settings\/scripts/);
  assert.match(MEASURED.sed, /sed -n/);
  assert.match(MEASURED.sed, /\^---\$/);
  assert.equal(MEASURED.reproFile, ".claude/my-plugin.local.md");
  assert.match(MEASURED.repoAt, /ab9b2cf/);
  assert.equal(IDLE_WORD, "bound");
  assert.equal(SEEDED_WORD, "leaked");
  assert.equal(ADMIT_WORD, "closed");
});

test("HOLD is bound/closed; ALARM is leaked family", () => {
  assert.ok(HOLD.has("bound"));
  assert.ok(HOLD.has("closed"));
  assert.equal(ALARM.has("bound"), false);
  assert.equal(ALARM.has("closed"), false);
  for (const chip of [
    "leaked",
    "sed-range-reopen",
    "body-hr-bleed",
    "enabled-true-false-concat",
    "silent-disabled-path",
    "false-as-missing",
    "validate-hr-count",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "bound",
    "leaked",
    "closed",
    "sed-range-reopen",
    "body-hr-bleed",
    "enabled-true-false-concat",
    "silent-disabled-path",
    "false-as-missing",
    "validate-hr-count",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites --- / frontmatter neighbourhood only", () => {
  assert.equal(COUSINS.length, 3);
  assert.ok(COUSINS.some((c) => c.id === 52755 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 44901 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 19377 && c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "bound.json",
    "leaked.json",
    "closed.json",
    "92798.json",
    "sed-range-reopen.json",
    "body-hr-bleed.json",
    "enabled-true-false-concat.json",
    "silent-disabled-path.json",
    "false-as-missing.json",
    "validate-hr-count.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92798|dinkus|bound|leaked|closed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "bound");
  assert.equal(index.narrativeNotFixture.seeded, "leaked");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:plugins"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a compositor hairline-rule bench, not a clone", () => {
  assert.match(page, /Zilla Slab/);
  assert.match(page, /Atkinson Hyperlegible/);
  assert.match(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.match(page, /leaked/);
  assert.match(page, /closed/);
  assert.match(page, /\bbound\b/);
  assert.match(page, /#92798/);
  assert.match(page, /Dinkus/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /17:50 \/ hermes catalog #223 \/ #92798/);
  assert.match(page, /Score leaked/);
  assert.match(page, /Admit closed/);
  assert.match(page, /Pin idle bound/);
  assert.match(page, /Reset to bound/);
  assert.match(page, /parse-frontmatter/);
  assert.match(page, /plugin-settings/);
  assert.match(page, /vermilion/);
  assert.match(page, /zinc/);
  assert.match(page, /galley/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /twin-nameplate/i);
  assert.doesNotMatch(page, /lexicographer/i);
  assert.doesNotMatch(page, /iron-gall/i);
  assert.doesNotMatch(page, /marble cistern/i);
  assert.doesNotMatch(page, /water-clock/i);
  assert.doesNotMatch(page, /iron sconce/i);
  assert.doesNotMatch(page, /rush-pith/i);
  assert.doesNotMatch(page, /ivory-and-ebony/i);
  assert.doesNotMatch(page, /stevedore's dunnage/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /piano cream/i);
  assert.doesNotMatch(page, /CRT phosphor/i);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /\bkeyed\b/);
  assert.doesNotMatch(page, /\bdripping\b/);
  assert.doesNotMatch(page, /\barrested\b/);
  assert.doesNotMatch(page, /\bcredited\b/);
  assert.doesNotMatch(page, /\bchorded\b/);
  assert.doesNotMatch(page, /\bflattened\b/);
  assert.doesNotMatch(page, /\bmeshed\b/);
  assert.doesNotMatch(page, /\bpiped\b/);
  assert.doesNotMatch(page, /\bswallowed\b/);
  assert.doesNotMatch(page, /\bunbound\b/);
  assert.doesNotMatch(page, /\bberthed\b/);
  assert.doesNotMatch(page, /\blean\b/);
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bwaived\b/);
  assert.doesNotMatch(page, /\bbricked\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.doesNotMatch(page, /\bechoed\b/);
  assert.doesNotMatch(page, /\bladen\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bshed\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\brefused\b/);
  assert.doesNotMatch(page, /\bimprinted\b/);
  assert.doesNotMatch(page, /\bscored\b/);
  assert.doesNotMatch(page, /\bvoided\b/);
  assert.doesNotMatch(page, /\bbanked\b/);
  assert.doesNotMatch(page, /\brewritten\b/);
  assert.doesNotMatch(page, /\bcold\b/);
  assert.doesNotMatch(page, /\bseeded\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /\btenured\b/);
});

test("README anti-clone encodes the dinkus thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /parse-frontmatter/);
  assert.match(readme, /plugin-settings/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/dinkus\//);
  assert.match(readme, /Score leaked or admit closed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Homonym/);
  assert.match(readme, /NOT Clepsydra/);
  assert.match(readme, /NOT Rushlight/);
  assert.match(readme, /NOT Letoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(readme, /#92788/);
  assert.match(readme, /#92761/);
  assert.match(readme, /#92801/);
  assert.match(hookReadme, /bound/);
  assert.match(hookReadme, /leaked/);
  assert.match(hookReadme, /closed/);
  assert.match(dataReadme, /bound/);
  assert.match(dataReadme, /leaked/);
  assert.match(dataReadme, /closed/);
});
