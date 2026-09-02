import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALLOW_CP,
  ALLOW_MV,
  ALLOW_RM,
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
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
  PERMISSION_MODE,
  PHRASE,
  POSIX_END_OF_OPTIONS,
  PRIMARY_ISSUES,
  RAN,
  REFUSED,
  RELATED_IN_ISSUE,
  REPORTER,
  RUN_LABEL,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isSnagged,
  isUnbolted,
  normalize,
  score,
  seedBareEndOfOptions,
  seedCousin,
  seedDeterministic,
  seedDontask,
  seedEqualBreadth,
  seedFlaglessRuns,
  seedForceFlagUnfollowable,
  seedHasClearRepro,
  seedHold,
  seedMatcherArtifact,
  seedNotPathClass,
  seedOptionToken,
  seedRmRfSlips,
  seedSnagged,
  seedUnbolted,
} from "./bolter.mjs";

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
  return fileURLToPath(new URL("./bolter.mjs", import.meta.url));
}

test("fair mesh + option tokens pass + no snag → unbolted", () => {
  const result = analyze({
    meshFair: true,
    flaggedAndFlaglessTogether: true,
    optionTokensPass: true,
    optionToken: false,
    matcherArtifact: false,
  });
  assert.equal(result.verdict, "unbolted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.snagged, false);
  assert.equal(result.unbolted, true);
  assert.equal(isUnbolted(result.ticket), true);
  assert.equal(isSnagged(result.ticket), false);
});

test("option token + flagless runs + rm -rf slips → snagged", () => {
  const result = analyze({
    optionToken: true,
    flaglessRuns: true,
    rmRfSlips: true,
    equalBreadth: true,
    matcherArtifact: true,
    dontAsk: true,
    hasClearRepro: true,
    meshFair: false,
    optionTokensPass: false,
  });
  assert.equal(result.verdict, "snagged");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.snagged, true);
  assert.equal(isSnagged(result.ticket), true);
  assert.ok(result.chips.includes("snagged"));
  assert.ok(result.chips.includes("option-token"));
  assert.ok(result.chips.includes("flagless-runs"));
  assert.ok(!result.chips.includes("unbolted"));
});

test("idle unbolted is a hold; flagged cp/mv including cp -- pass under dontAsk", () => {
  const result = analyze(seedUnbolted());
  assert.equal(result.verdict, "unbolted");
  assert.equal(result.idleWord, "unbolted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.snagged, false);
  assert.equal(result.unbolted, true);
  assert.ok(result.chips.includes("unbolted"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("snagged"));
  assert.equal(result.ticket.meshFair, true);
  assert.equal(result.ticket.optionTokensPass, true);
  assert.equal(result.ticket.optionToken, false);
  assert.match(result.contrast.case, /unbolted/i);
  assert.doesNotMatch(
    result.idleWord,
    /creased|bled|latched|vanished|sealed|rebound|dark|spurious|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed|reeved|fouled/i,
  );
});

test("empty ticket and empty stdin classify unbolted", () => {
  assert.equal(classify(emptyTicket()), "unbolted");
  assert.equal(classify(""), "unbolted");
  assert.equal(classify(null), "unbolted");
  assert.equal(decideSeed("unbolted").verdict, "unbolted");
  assert.equal(decideSeed("open").verdict, "unbolted");
});

test("seeded snagged #91422 is alarm with option tokens, rm -rf slip, matcher artifact", () => {
  const result = analyze(seedSnagged());
  assert.equal(result.verdict, "snagged");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.snagged, true);
  assert.ok(result.chips.includes("snagged"));
  assert.ok(result.chips.includes("dontask"));
  assert.ok(result.chips.includes("option-token"));
  assert.ok(result.chips.includes("bare-end-of-options"));
  assert.ok(result.chips.includes("flagless-runs"));
  assert.ok(result.chips.includes("rm-rf-slips"));
  assert.ok(result.chips.includes("equal-breadth"));
  assert.ok(result.chips.includes("matcher-artifact"));
  assert.ok(result.chips.includes("force-flag-unfollowable"));
  assert.ok(result.chips.includes("not-path-class"));
  assert.ok(result.chips.includes("deterministic"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("unbolted"));
  assert.match(result.contrast.case, /snagged/i);
  assert.equal(result.ticket.optionToken, true);
  assert.equal(result.ticket.bareEndOfOptions, true);
  assert.equal(result.ticket.rmRfSlips, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.permissionMode, PERMISSION_MODE);
});

test("data fixtures classify unbolted vs snagged vs named chips", () => {
  assert.equal(classify(readData("unbolted.json")), "unbolted");
  assert.equal(classify(readData("snagged.json")), "snagged");
  assert.equal(classify(readData("91422.json")), "snagged");
  assert.equal(classify(readData("dontask.json")), "dontask");
  assert.equal(classify(readData("cp-dash-f.json")), "option-token");
  assert.equal(classify(readData("cp-dash-dash.json")), "bare-end-of-options");
  assert.equal(classify(readData("mv-dash-v.json")), "option-token");
  assert.equal(classify(readData("bare-cp.json")), "flagless-runs");
  assert.equal(classify(readData("rm-rf.json")), "rm-rf-slips");
  assert.equal(classify(readData("equal-breadth.json")), "equal-breadth");
  assert.equal(classify(readData("matcher-artifact.json")), "matcher-artifact");
  assert.equal(classify(readData("force-flag-guidance.json")), "force-flag-unfollowable");
  assert.equal(classify(readData("relative-still-refused.json")), "not-path-class");
  assert.equal(classify(readData("deterministic.json")), "deterministic");
  assert.equal(classify(readData("end-of-options.json")), "bare-end-of-options");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("snagged seed is alarm; unbolted / hold are holds", () => {
  assert.equal(score(seedSnagged()).alarm, true);
  assert.equal(score(seedSnagged()).hold, false);
  assert.equal(score(seedUnbolted()).hold, true);
  assert.equal(score(seedUnbolted()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedOptionToken()).alarm, true);
  assert.equal(score(seedRmRfSlips()).alarm, true);
});

test("normalize seeds 91422 without ticket fields", () => {
  const ticket = normalize({ issue: 91422 });
  assert.equal(ticket.optionToken, true);
  assert.equal(ticket.flaglessRuns, true);
  assert.equal(ticket.rmRfSlips, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "snagged");
});

test("score / decide / handle agree on snagged vs unbolted", () => {
  assert.equal(score(seedSnagged()).verdict, "snagged");
  assert.equal(decide(seedUnbolted()).verdict, "unbolted");
  const fail = handle(seedSnagged());
  const hold = handle(seedUnbolted());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91422/);
  assert.match(fail.hookSpecificOutput.additionalContext, /dontAsk|option token|rm -rf/i);
  assert.match(hold.hookSpecificOutput.additionalContext, /unbolted/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("snagged").verdict, "snagged");
  assert.equal(decideSeed(91422).verdict, "snagged");
  assert.equal(decideSeed("91422").verdict, "snagged");
  assert.equal(decideSeed("unbolted").verdict, "unbolted");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("dontask").verdict, "dontask");
  assert.equal(decideSeed("option-token").verdict, "option-token");
  assert.equal(decideSeed("bare-end-of-options").verdict, "bare-end-of-options");
});

test("CLI scores data files", () => {
  const snagged = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91422.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(snagged.status, 0, snagged.stderr);
  assert.equal(JSON.parse(snagged.stdout).verdict, "snagged");
  assert.equal(JSON.parse(snagged.stdout).alarm, true);

  const unbolted = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/unbolted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(unbolted.status, 0, unbolted.stderr);
  assert.equal(JSON.parse(unbolted.stdout).verdict, "unbolted");
  assert.equal(JSON.parse(unbolted.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91422);
  assert.deepEqual([...PRIMARY_ISSUES], [91422]);
  assert.equal(COUSIN_ISSUE, 74567);
  assert.deepEqual([...COUSINS], [74567, 76867, 76490, 91479]);
  assert.deepEqual([...RELATED_IN_ISSUE], [16449, 30519]);
  assert.equal(FILED_AT, "2026-09-02T07:28:49Z");
  assert.equal(REPORTER, "alfalcon90");
  assert.equal(VERSION, "2.1.251");
  assert.equal(RUN_LABEL, "run E");
  assert.equal(PERMISSION_MODE, "--permission-mode dontAsk");
  assert.equal(ALLOW_CP, "Bash(cp:*)");
  assert.equal(ALLOW_MV, "Bash(mv:*)");
  assert.equal(ALLOW_RM, "Bash(rm:*)");
  assert.deepEqual([...REFUSED], ["cp -f", "cp -v", "cp --", "mv -v"]);
  assert.deepEqual([...RAN], ["cp", "mv", "rm -f", "rm -rf"]);
  assert.equal(POSIX_END_OF_OPTIONS, "cp --");
  assert.equal(IDLE_WORD, "unbolted");
  assert.equal(SEEDED_WORD, "snagged");
  assert.notEqual(IDLE_WORD, "snagged");
  assert.match(TITLE, /dontAsk/);
  assert.match(TITLE, /cp/);
  assert.match(TITLE, /mv/);
  assert.match(TITLE, /option token/);
  assert.match(TITLE, /rm/);
  assert.match(ISSUE_URL, /91422/);
  assert.match(PHRASE, /catches every option token/i);
  assert.match(PHRASE, /admit the allow-rule already lied/);
  assert.match(HUB_LINE, /21:50 bolter/);
  assert.match(HUB_LINE, /admit the allow-rule already lied/);
  assert.match(MARK, /21:50/);
  assert.match(MARK, /#122/);
  assert.match(MARK, /#91422/);
  assert.match(CONTRAST_NOTE, /DONTASK \+ EQUAL-BREADTH BASH\(CP:\*\)\/\(MV:\*\) REFUSE ANY OPTION TOKEN INCL BARE --/);
  assert.match(CONTRAST_NOTE, /dontAsk/);
  assert.match(CONTRAST_NOTE, /Bash\(cp:\*\)/);
  assert.match(CONTRAST_NOTE, /Bash\(mv:\*\)/);
  assert.match(CONTRAST_NOTE, /Bash\(rm:\*\)/);
  assert.match(CONTRAST_NOTE, /cp -f/);
  assert.match(CONTRAST_NOTE, /cp --/);
  assert.match(CONTRAST_NOTE, /rm -rf/);
  assert.match(CONTRAST_NOTE, /POSIX end-of-options/);
  assert.match(CONTRAST_NOTE, /matcher/i);
  assert.match(CONTRAST_NOTE, /equal breadth|same breadth/i);
  assert.match(CONTRAST_NOTE, /force flags/);
  assert.match(CONTRAST_NOTE, /alfalcon90/);
  assert.match(CONTRAST_NOTE, /2\.1\.251/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("deadeye"));
  assert.ok(NOT_PRODUCTS.includes("reglet"));
  assert.ok(NOT_PRODUCTS.includes("reliquary"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("caisson"));
  assert.ok(NOT_PRODUCTS.includes("spindle"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("berth"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(NOT_PRODUCTS.includes("reveille"));
  assert.ok(NOT_PRODUCTS.includes("toggle"));
  assert.ok(BANNED_NAMES.includes("Deadeye"));
  assert.ok(BANNED_NAMES.includes("Reglet"));
  assert.ok(BANNED_NAMES.includes("Reliquary"));
  assert.ok(BANNED_NAMES.includes("Annunciator"));
  assert.ok(BANNED_NAMES.includes("Caisson"));
  assert.ok(BANNED_NAMES.includes("Spindle"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Toggle"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
    assert.notEqual(SEEDED_WORD, word);
  }
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:bash"));
  assert.ok(LABELS.includes("area:permissions"));
  assert.ok(HOLD_VERDICTS.includes("unbolted"));
  assert.ok(ALARM_VERDICTS.includes("snagged"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "unbolted");
  assert.equal(chips.seededWord, "snagged");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91422);
  assert.equal(fp.cousin, 74567);
  assert.deepEqual(fp.cousins, [74567, 76867, 76490, 91479]);
  assert.equal(fp.reporter, "alfalcon90");
  assert.equal(fp.version, "2.1.251");
  assert.equal(fp.runLabel, "run E");
  assert.equal(fp.permissionMode, "--permission-mode dontAsk");
  assert.equal(fp.allowCp, "Bash(cp:*)");
  assert.equal(fp.allowMv, "Bash(mv:*)");
  assert.equal(fp.allowRm, "Bash(rm:*)");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "snagged");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.optionToken, true);
});

test("chipsOf on a raw option-token ticket still marks snagged", () => {
  const chips = chipsOf({
    optionToken: true,
    flaglessRuns: true,
    rmRfSlips: true,
    dontAsk: true,
    outputText:
      "snagged; #91422; --permission-mode dontAsk; Bash(cp:*); Bash(mv:*); Bash(rm:*); cp -f; cp --; rm -rf",
  });
  assert.ok(chips.includes("snagged"));
  assert.ok(chips.includes("option-token"));
  assert.ok(chips.includes("dontask"));
  assert.ok(!chips.includes("unbolted"));
});

test("cousin #74567 is not conflated with snagged primary", () => {
  assert.notEqual(classify(seedCousin()), "snagged");
  assert.notEqual(classify({ issue: 74567 }), "snagged");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /74567|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become snagged", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "snagged", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91422);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedDontask()).verdict, "dontask");
  assert.equal(analyze(seedOptionToken()).verdict, "option-token");
  assert.equal(analyze(seedBareEndOfOptions()).verdict, "bare-end-of-options");
  assert.equal(analyze(seedFlaglessRuns()).verdict, "flagless-runs");
  assert.equal(analyze(seedRmRfSlips()).verdict, "rm-rf-slips");
  assert.equal(analyze(seedEqualBreadth()).verdict, "equal-breadth");
  assert.equal(analyze(seedMatcherArtifact()).verdict, "matcher-artifact");
  assert.equal(analyze(seedForceFlagUnfollowable()).verdict, "force-flag-unfollowable");
  assert.equal(analyze(seedNotPathClass()).verdict, "not-path-class");
  assert.equal(analyze(seedDeterministic()).verdict, "deterministic");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.meshFair, true);
  assert.equal(isSnagged(seedUnbolted()), false);
  assert.equal(isSnagged(seedSnagged()), true);
});

test("living page is a Bolter atelier, idle unbolted, seeded snagged", () => {
  const html = readPage();
  assert.match(html, /<title>Bolter/);
  assert.match(html, /Idle word:\s*unbolted/);
  assert.match(html, /unbolted/);
  assert.match(html, /snagged/);
  assert.match(html, /dontask|dontAsk/);
  assert.match(html, /option-token/);
  assert.match(html, /bare-end-of-options|cp --/);
  assert.match(html, /flagless-runs|bare cp/);
  assert.match(html, /rm-rf-slips|rm -rf/);
  assert.match(html, /equal-breadth|Bash\(cp:\*\)/);
  assert.match(html, /matcher-artifact|matcher artifact/);
  assert.match(html, /force-flag-unfollowable|force flags/);
  assert.match(html, /not-path-class|relative paths still REFUSED/);
  assert.match(html, /deterministic/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91422/);
  assert.match(html, /#74567/);
  assert.match(html, /#76867/);
  assert.match(html, /#76490/);
  assert.match(html, /#91479/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /21:50/);
  assert.match(html, /catalog #122/);
  assert.match(html, /dontAsk/);
  assert.match(html, /Bash\(cp:\*\)/);
  assert.match(html, /Bash\(mv:\*\)/);
  assert.match(html, /Bash\(rm:\*\)/);
  assert.match(html, /cp -f/);
  assert.match(html, /cp --/);
  assert.match(html, /rm -rf/);
  assert.match(html, /POSIX/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /run E/);
  assert.match(html, /alfalcon90/);
  assert.match(html, /family=Piazzolla|Piazzolla/);
  assert.match(html, /family=Nunito|Nunito/);
  assert.match(html, /family=Roboto\+Mono|Roboto Mono/);
  assert.match(html, /Bolt the cloth/);
  assert.match(html, /Pin idle unbolted/);
  assert.match(html, /Pin seeded snagged/);
  assert.match(html, /Admit the allow-rule already lied/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to unbolted/);
  assert.match(html, /bolter|bolting-cloth|millstone|flour/i);
  assert.match(html, /DONTASK|option token|rm -rf/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF deadeye standing-rigging/);
  assert.match(html, /reglet letterpress/);
  assert.match(html, /reliquary vault-latch/);
  assert.match(html, /annunciator lamps/);
  assert.match(html, /caisson berth/);
  assert.match(html, /spindle chip-sweep/);
  assert.match(html, /knell mute-bell/);
  assert.match(html, /tumbler keyway/);
  assert.match(html, /escapement pallet/);
  assert.match(html, /carillon peal/);
  assert.match(html, /sluice millrace/);
  assert.match(html, /reveille muster/);
  assert.doesNotMatch(html, /Idle word:\s*snagged/i);
  assert.doesNotMatch(html, /Idle word:\s*reeved/i);
  assert.doesNotMatch(html, /Idle word:\s*fouled/i);
  assert.doesNotMatch(html, /Idle word:\s*creased/i);
  assert.doesNotMatch(html, /Idle word:\s*bled/i);
  assert.doesNotMatch(html, /Pin idle snagged/);
  assert.doesNotMatch(html, /Pin idle reeved/);
  assert.doesNotMatch(html, /Pin idle fouled/);
  assert.doesNotMatch(html, /Reeve the deadeye/);
  assert.doesNotMatch(html, /Score the reeve/);
  assert.doesNotMatch(html, /Score the strip/);
  assert.doesNotMatch(html, /Score the latch/);
  assert.doesNotMatch(html, /Score the seal/);
  assert.doesNotMatch(html, /Score the purge/);
  assert.doesNotMatch(html, /Score the mute/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /family=Literata|Literata/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Text|Red Hat Text/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono|Red Hat Mono/);
  assert.doesNotMatch(html, /family=EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(html, /family=Hanken\+Grotesk|Hanken Grotesk/);
  assert.doesNotMatch(html, /family=Noto\+Sans\+Mono|Noto Sans Mono/);
  assert.doesNotMatch(html, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(html, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(html, /family=Ubuntu\+Mono|Ubuntu Mono/);
  assert.doesNotMatch(html, /family=Chakra\+Petch|Chakra Petch/);
  assert.doesNotMatch(html, /family=Barlow|Barlow/);
  assert.doesNotMatch(html, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.doesNotMatch(html, /family=Zilla\+Slab|Zilla Slab/);
  assert.doesNotMatch(html, /family=Epilogue|Epilogue/);
  assert.doesNotMatch(html, /family=Overpass\+Mono|Overpass Mono/);
  assert.doesNotMatch(html, /family=Cardo|Cardo/);
  assert.doesNotMatch(html, /family=Hind|Hind/);
  assert.doesNotMatch(html, /family=Cousine|Cousine/);
  assert.doesNotMatch(html, /family=Bitter|Bitter/);
  assert.doesNotMatch(html, /family=Karla|Karla/);
  assert.doesNotMatch(html, /family=Inconsolata|Inconsolata/);
  assert.doesNotMatch(html, /family=Young\+Serif|Young Serif/);
  assert.doesNotMatch(html, /family=Figtree|Figtree/);
  assert.doesNotMatch(html, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(html, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(html, /family=Manrope|Manrope/);
  assert.doesNotMatch(html, /family=Azeret\+Mono|Azeret Mono/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Jost/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Bolter, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Bolter/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /DONTASK \+ EQUAL-BREADTH BASH\(CP:\*\)\/\(MV:\*\) REFUSE ANY OPTION TOKEN INCL BARE --/i,
  );
  assert.match(readme, /NOT \*\*Deadeye\*\*/);
  assert.match(readme, /NOT \*\*Reglet\*\*/);
  assert.match(readme, /NOT \*\*Reliquary\*\*/);
  assert.match(readme, /NOT \*\*Annunciator\*\*/);
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /Product name stays \*\*Bolter\*\*/);
  assert.match(readme, /Idle word: \*\*unbolted\*\*/);
  assert.match(readme, /#74567/);
  assert.match(readme, /#76867/);
  assert.match(readme, /#76490/);
  assert.match(readme, /#91479/);
  assert.match(readme, /dontAsk/);
  assert.match(readme, /Bash\(cp:\*\)/);
  assert.match(readme, /Bash\(mv:\*\)/);
  assert.match(readme, /Bash\(rm:\*\)/);
  assert.match(readme, /cp --/);
  assert.match(readme, /rm -rf/);
  assert.match(readme, /POSIX/);
  assert.match(readme, /alfalcon90/);
  assert.match(readme, /2\.1\.251/);
  assert.doesNotMatch(readme, /^# Deadeye/m);
  assert.doesNotMatch(readme, /^# Reglet/m);
  assert.doesNotMatch(readme, /^# Reliquary/m);
  assert.doesNotMatch(readme, /^# Annunciator/m);
  assert.doesNotMatch(readme, /^# Caisson/m);
  assert.doesNotMatch(readme, /^# Spindle/m);
  assert.doesNotMatch(readme, /^# Knell/m);
  assert.doesNotMatch(readme, /^# Tumbler/m);
  assert.doesNotMatch(readme, /^# Escapement/m);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
  assert.doesNotMatch(readme, /^# Berth/m);
  assert.doesNotMatch(readme, /^# Bollard/m);
  assert.doesNotMatch(readme, /^# Reveille/m);
  assert.doesNotMatch(readme, /^# Callboard/m);
  assert.doesNotMatch(readme, /^# Toggle/m);
});
