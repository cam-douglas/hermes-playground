import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  BASH_SHAPE,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  EVIDENCE,
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
  PRIMARY_ISSUES,
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
  isArmed,
  isUnheard,
  normalize,
  score,
  seedArmed,
  seedCousin,
  seedHangUntilTurn,
  seedHasClearRepro,
  seedHold,
  seedHumanNudge,
  seedMainWakes,
  seedNoIdleWake,
  seedQueueOperation,
  seedQueuedNotLost,
  seedRunInBackground,
  seedSubagent,
  seedUnheard,
} from "./tocsin.mjs";

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
  return fileURLToPath(new URL("./tocsin.mjs", import.meta.url));
}

test("fair wake + idle consumer + no miss → armed", () => {
  const result = analyze({
    wakeFair: true,
    subagentWakesOnIdle: true,
    idleWakeConsumer: true,
    noIdleWake: false,
  });
  assert.equal(result.verdict, "armed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unheard, false);
  assert.equal(result.armed, true);
  assert.equal(isArmed(result.ticket), true);
  assert.equal(isUnheard(result.ticket), false);
});

test("no idle-wake + notification queued + hang until nudge → unheard", () => {
  const result = analyze({
    noIdleWake: true,
    notificationQueued: true,
    hangUntilTurn: true,
    humanNudge: true,
    queuedNotLost: true,
    idleWakeConsumer: false,
    subagent: true,
    mainWakes: true,
    hasClearRepro: true,
    wakeFair: false,
    subagentWakesOnIdle: false,
  });
  assert.equal(result.verdict, "unheard");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.unheard, true);
  assert.equal(isUnheard(result.ticket), true);
  assert.ok(result.chips.includes("unheard"));
  assert.ok(result.chips.includes("no-idle-wake"));
  assert.ok(result.chips.includes("queued-not-lost"));
  assert.ok(!result.chips.includes("armed"));
});

test("idle armed is a hold; background-task completion wakes an idle subagent", () => {
  const result = analyze(seedArmed());
  assert.equal(result.verdict, "armed");
  assert.equal(result.idleWord, "armed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unheard, false);
  assert.equal(result.armed, true);
  assert.ok(result.chips.includes("armed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("unheard"));
  assert.equal(result.ticket.wakeFair, true);
  assert.equal(result.ticket.subagentWakesOnIdle, true);
  assert.equal(result.ticket.idleWakeConsumer, true);
  assert.match(result.contrast.case, /armed/i);
  assert.doesNotMatch(
    result.idleWord,
    /unbolted|snagged|reeved|fouled|creased|bled|latched|vanished|sealed|rebound|dark|spurious|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify armed", () => {
  assert.equal(classify(emptyTicket()), "armed");
  assert.equal(classify(""), "armed");
  assert.equal(classify(null), "armed");
  assert.equal(decideSeed("armed").verdict, "armed");
  assert.equal(decideSeed("open").verdict, "armed");
});

test("seeded unheard #91503 is alarm with queued notification, no idle-wake, human nudge", () => {
  const result = analyze(seedUnheard());
  assert.equal(result.verdict, "unheard");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.unheard, true);
  assert.ok(result.chips.includes("unheard"));
  assert.ok(result.chips.includes("subagent"));
  assert.ok(result.chips.includes("main-wakes"));
  assert.ok(result.chips.includes("queued-not-lost"));
  assert.ok(result.chips.includes("no-idle-wake"));
  assert.ok(result.chips.includes("human-nudge"));
  assert.ok(result.chips.includes("run-in-background"));
  assert.ok(result.chips.includes("queue-operation"));
  assert.ok(result.chips.includes("hang-until-turn"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("armed"));
  assert.match(result.contrast.case, /unheard/i);
  assert.equal(result.ticket.noIdleWake, true);
  assert.equal(result.ticket.notificationQueued, true);
  assert.equal(result.ticket.humanNudge, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.bashShape, BASH_SHAPE);
});

test("data fixtures classify armed vs unheard vs named chips", () => {
  assert.equal(classify(readData("armed.json")), "armed");
  assert.equal(classify(readData("unheard.json")), "unheard");
  assert.equal(classify(readData("91503.json")), "unheard");
  assert.equal(classify(readData("subagent.json")), "subagent");
  assert.equal(classify(readData("main-session.json")), "main-wakes");
  assert.equal(classify(readData("run-in-background.json")), "run-in-background");
  assert.equal(classify(readData("queue-operation.json")), "queue-operation");
  assert.equal(classify(readData("idle-wake-missing.json")), "no-idle-wake");
  assert.equal(classify(readData("human-nudge.json")), "human-nudge");
  assert.equal(classify(readData("notification-queued.json")), "queued-not-lost");
  assert.equal(classify(readData("hang-until-turn.json")), "hang-until-turn");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("unheard seed is alarm; armed / hold are holds", () => {
  assert.equal(score(seedUnheard()).alarm, true);
  assert.equal(score(seedUnheard()).hold, false);
  assert.equal(score(seedArmed()).hold, true);
  assert.equal(score(seedArmed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedNoIdleWake()).alarm, true);
  assert.equal(score(seedHangUntilTurn()).alarm, true);
});

test("normalize seeds 91503 without ticket fields", () => {
  const ticket = normalize({ issue: 91503 });
  assert.equal(ticket.noIdleWake, true);
  assert.equal(ticket.notificationQueued, true);
  assert.equal(ticket.humanNudge, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "unheard");
});

test("score / decide / handle agree on unheard vs armed", () => {
  assert.equal(score(seedUnheard()).verdict, "unheard");
  assert.equal(decide(seedArmed()).verdict, "armed");
  const fail = handle(seedUnheard());
  const hold = handle(seedArmed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91503/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /idle-wake|queued|human nudge|subagent/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /armed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("unheard").verdict, "unheard");
  assert.equal(decideSeed(91503).verdict, "unheard");
  assert.equal(decideSeed("91503").verdict, "unheard");
  assert.equal(decideSeed("armed").verdict, "armed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("subagent").verdict, "subagent");
  assert.equal(decideSeed("main-wakes").verdict, "main-wakes");
  assert.equal(decideSeed("no-idle-wake").verdict, "no-idle-wake");
});

test("CLI scores data files", () => {
  const unheard = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91503.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(unheard.status, 0, unheard.stderr);
  assert.equal(JSON.parse(unheard.stdout).verdict, "unheard");
  assert.equal(JSON.parse(unheard.stdout).alarm, true);

  const armed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/armed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(armed.status, 0, armed.stderr);
  assert.equal(JSON.parse(armed.stdout).verdict, "armed");
  assert.equal(JSON.parse(armed.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91503);
  assert.deepEqual([...PRIMARY_ISSUES], [91503]);
  assert.equal(COUSIN_ISSUE, 78338);
  assert.deepEqual([...COUSINS], [78338, 21048, 29163]);
  assert.deepEqual([...RELATED_IN_ISSUE], [75043, 29271, 24108, 47930, 85047]);
  assert.equal(FILED_AT, "2026-09-02T13:15:54Z");
  assert.equal(REPORTER, "ManufactoryOfCode");
  assert.equal(VERSION, "2.1.258");
  assert.equal(PLATFORM, "Windows 11");
  assert.equal(RUN_LABEL, "three instrumented runs");
  assert.equal(EVIDENCE, "queue-operation");
  assert.equal(BASH_SHAPE, "Bash(run_in_background: true)");
  assert.equal(IDLE_WORD, "armed");
  assert.equal(SEEDED_WORD, "unheard");
  assert.notEqual(IDLE_WORD, "unheard");
  assert.match(TITLE, /subagent/);
  assert.match(TITLE, /idle-wake consumer/);
  assert.match(TITLE, /Windows/);
  assert.match(TITLE, /#78338/);
  assert.match(ISSUE_URL, /91503/);
  assert.match(PHRASE, /only rings into ears already on duty/i);
  assert.match(PHRASE, /admit the subagent already slept through the all-clear/);
  assert.match(HUB_LINE, /23:50 tocsin/);
  assert.match(HUB_LINE, /admit the subagent already slept through the all-clear/);
  assert.match(MARK, /23:50/);
  assert.match(MARK, /#123/);
  assert.match(MARK, /#91503/);
  assert.match(
    CONTRAST_NOTE,
    /SUBAGENT BASH\(RUN_IN_BACKGROUND:TRUE\) COMPLETION NOTIFICATION QUEUED WITH NO IDLE-WAKE CONSUMER/,
  );
  assert.match(CONTRAST_NOTE, /run_in_background/);
  assert.match(CONTRAST_NOTE, /idle-wake consumer/);
  assert.match(CONTRAST_NOTE, /milliseconds/);
  assert.match(CONTRAST_NOTE, /human nudge/);
  assert.match(CONTRAST_NOTE, /queue-operation/);
  assert.match(CONTRAST_NOTE, /ManufactoryOfCode/);
  assert.match(CONTRAST_NOTE, /2\.1\.258/);
  assert.match(CONTRAST_NOTE, /Windows 11/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("bolter"));
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
  assert.ok(BANNED_NAMES.includes("Bolter"));
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
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(HOLD_VERDICTS.includes("armed"));
  assert.ok(ALARM_VERDICTS.includes("unheard"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "armed");
  assert.equal(chips.seededWord, "unheard");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91503);
  assert.equal(fp.cousin, 78338);
  assert.deepEqual(fp.cousins, [78338, 21048, 29163]);
  assert.equal(fp.reporter, "ManufactoryOfCode");
  assert.equal(fp.version, "2.1.258");
  assert.equal(fp.platform, "Windows 11");
  assert.equal(fp.runLabel, "three instrumented runs");
  assert.equal(fp.evidence, "queue-operation");
  assert.equal(fp.bashShape, "Bash(run_in_background: true)");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "unheard");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.noIdleWake, true);
});

test("chipsOf on a raw no-idle-wake ticket still marks unheard", () => {
  const chips = chipsOf({
    noIdleWake: true,
    notificationQueued: true,
    hangUntilTurn: true,
    humanNudge: true,
    subagent: true,
    outputText:
      "unheard; #91503; Bash(run_in_background: true); completion notification queued; no idle-wake consumer; human nudge",
  });
  assert.ok(chips.includes("unheard"));
  assert.ok(chips.includes("no-idle-wake"));
  assert.ok(chips.includes("subagent"));
  assert.ok(!chips.includes("armed"));
});

test("cousin #78338 is not conflated with unheard primary", () => {
  assert.notEqual(classify(seedCousin()), "unheard");
  assert.notEqual(classify({ issue: 78338 }), "unheard");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /78338|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become unheard", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "unheard", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91503);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedSubagent()).verdict, "subagent");
  assert.equal(analyze(seedMainWakes()).verdict, "main-wakes");
  assert.equal(analyze(seedQueuedNotLost()).verdict, "queued-not-lost");
  assert.equal(analyze(seedNoIdleWake()).verdict, "no-idle-wake");
  assert.equal(analyze(seedHumanNudge()).verdict, "human-nudge");
  assert.equal(analyze(seedRunInBackground()).verdict, "run-in-background");
  assert.equal(analyze(seedQueueOperation()).verdict, "queue-operation");
  assert.equal(analyze(seedHangUntilTurn()).verdict, "hang-until-turn");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.wakeFair, true);
  assert.equal(isUnheard(seedArmed()), false);
  assert.equal(isUnheard(seedUnheard()), true);
});

test("living page is a Tocsin atelier, idle armed, seeded unheard", () => {
  const html = readPage();
  assert.match(html, /<title>Tocsin/);
  assert.match(html, /Idle word:\s*armed/);
  assert.match(html, /armed/);
  assert.match(html, /unheard/);
  assert.match(html, /subagent/);
  assert.match(html, /main-wakes|main session/);
  assert.match(html, /queued-not-lost|notification queued/);
  assert.match(html, /no-idle-wake|idle-wake consumer/);
  assert.match(html, /human-nudge|human nudge/);
  assert.match(html, /run-in-background|run_in_background/);
  assert.match(html, /queue-operation/);
  assert.match(html, /hang-until-turn|hangs until/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91503/);
  assert.match(html, /#78338/);
  assert.match(html, /#21048/);
  assert.match(html, /#29163/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /23:50/);
  assert.match(html, /catalog #123/);
  assert.match(html, /run_in_background/);
  assert.match(html, /idle-wake/);
  assert.match(html, /queue-operation/);
  assert.match(html, /2\.1\.258/);
  assert.match(html, /Windows 11/);
  assert.match(html, /ManufactoryOfCode/);
  assert.match(html, /family=Fraunces|Fraunces/);
  assert.match(html, /family=Source\+Sans\+3|Source Sans 3/);
  assert.match(html, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Sound the tocsin/);
  assert.match(html, /Pin idle armed/);
  assert.match(html, /Pin seeded unheard/);
  assert.match(html, /Admit the subagent already slept through the all-clear/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to armed/);
  assert.match(html, /tocsin|watchhouse|fire-bell/i);
  assert.match(html, /SUBAGENT|idle-wake|run_in_background/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF bolter flour-mill/);
  assert.match(html, /deadeye standing-rigging/);
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
  assert.doesNotMatch(html, /Idle word:\s*unheard/i);
  assert.doesNotMatch(html, /Idle word:\s*unbolted/i);
  assert.doesNotMatch(html, /Idle word:\s*snagged/i);
  assert.doesNotMatch(html, /Idle word:\s*reeved/i);
  assert.doesNotMatch(html, /Idle word:\s*fouled/i);
  assert.doesNotMatch(html, /Pin idle unheard/);
  assert.doesNotMatch(html, /Pin idle unbolted/);
  assert.doesNotMatch(html, /Pin idle snagged/);
  assert.doesNotMatch(html, /Bolt the cloth/);
  assert.doesNotMatch(html, /Reeve the deadeye/);
  assert.doesNotMatch(html, /Score the cloth/);
  assert.doesNotMatch(html, /Score the reeve/);
  assert.doesNotMatch(html, /Score the strip/);
  assert.doesNotMatch(html, /Score the latch/);
  assert.doesNotMatch(html, /Score the seal/);
  assert.doesNotMatch(html, /Score the purge/);
  assert.doesNotMatch(html, /Score the mute/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /family=Piazzolla|Piazzolla/);
  assert.doesNotMatch(html, /family=Nunito|Nunito/);
  assert.doesNotMatch(html, /family=Roboto\+Mono|Roboto Mono/);
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

test("README and page stay Tocsin, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Tocsin/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /SUBAGENT BASH\(RUN_IN_BACKGROUND:TRUE\) COMPLETION NOTIFICATION QUEUED WITH NO IDLE-WAKE CONSUMER/i,
  );
  assert.match(readme, /NOT \*\*Bolter\*\*/);
  assert.match(readme, /NOT \*\*Deadeye\*\*/);
  assert.match(readme, /NOT \*\*Reglet\*\*/);
  assert.match(readme, /NOT \*\*Reliquary\*\*/);
  assert.match(readme, /NOT \*\*Annunciator\*\*/);
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /Product name stays \*\*Tocsin\*\*/);
  assert.match(readme, /Idle word: \*\*armed\*\*/);
  assert.match(readme, /#78338/);
  assert.match(readme, /#21048/);
  assert.match(readme, /#29163/);
  assert.match(readme, /run_in_background/);
  assert.match(readme, /idle-wake/);
  assert.match(readme, /queue-operation/);
  assert.match(readme, /human nudge/);
  assert.match(readme, /ManufactoryOfCode/);
  assert.match(readme, /2\.1\.258/);
  assert.doesNotMatch(readme, /^# Bolter/m);
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
