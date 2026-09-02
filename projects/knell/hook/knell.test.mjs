import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGENT_A,
  AGENT_B,
  AGENTS_DIR,
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  FOUR_OF_FOUR,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LIST_AGENTS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SEND_INBOX,
  SEND_MESSAGE,
  SPAWNED_OK,
  TASK_STOP,
  TITLE,
  TOOL_NAME,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isMute,
  isTolled,
  normalize,
  score,
  seedCousin,
  seedHasClearRepro,
  seedHold,
  seedListagentsGhost,
  seedMute,
  seedNoFailureSignal,
  seedNoTranscript,
  seedPsOnlyDiscovery,
  seedSendmessageQueued,
  seedSpawnedOkDead,
  seedTolled,
} from "./knell.mjs";

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
  return fileURLToPath(new URL("./knell.mjs", import.meta.url));
}

test("death surfaced + stderr persisted + parent notified → tolled", () => {
  const result = analyze({
    deathSurfaced: true,
    stderrPersisted: true,
    parentNotified: true,
    listAgentsGhost: false,
    spawnedSuccessfully: true,
    childDead: true,
  });
  assert.equal(result.verdict, "tolled");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.mute, false);
  assert.equal(result.tolled, true);
  assert.equal(isTolled(result.ticket), true);
  assert.equal(isMute(result.ticket), false);
});

test("Spawned successfully + child dead + no death surfaced → mute", () => {
  const result = analyze({
    toolName: "Agent",
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: true,
    noFailureSignal: true,
    listAgentsGhost: true,
    sendMessageQueued: true,
    psOnlyDiscovery: true,
    deathSurfaced: false,
    parentNotified: false,
  });
  assert.equal(result.verdict, "mute");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.mute, true);
  assert.equal(isMute(result.ticket), true);
  assert.ok(result.chips.includes("mute"));
  assert.ok(result.chips.includes("spawned-ok-dead"));
  assert.ok(result.chips.includes("listagents-ghost"));
  assert.ok(!result.chips.includes("tolled"));
});

test("idle tolled is a hold; child death surfaced", () => {
  const result = analyze(seedTolled());
  assert.equal(result.verdict, "tolled");
  assert.equal(result.idleWord, "tolled");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.mute, false);
  assert.equal(result.tolled, true);
  assert.ok(result.chips.includes("tolled"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("mute"));
  assert.equal(result.ticket.deathSurfaced, true);
  assert.equal(result.ticket.stderrPersisted, true);
  assert.equal(result.ticket.parentNotified, true);
  assert.match(result.contrast.case, /tolled/i);
  assert.doesNotMatch(
    result.idleWord,
    /honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked/i,
  );
});

test("empty ticket and empty stdin classify tolled", () => {
  assert.equal(classify(emptyTicket()), "tolled");
  assert.equal(classify(""), "tolled");
  assert.equal(classify(null), "tolled");
  assert.equal(decideSeed("tolled").verdict, "tolled");
  assert.equal(decideSeed("open").verdict, "tolled");
});

test("seeded mute #91298 is alarm with Spawned successfully and ListAgents ghost", () => {
  const result = analyze(seedMute());
  assert.equal(result.verdict, "mute");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.mute, true);
  assert.ok(result.chips.includes("mute"));
  assert.ok(result.chips.includes("spawned-ok-dead"));
  assert.ok(result.chips.includes("no-transcript"));
  assert.ok(result.chips.includes("listagents-ghost"));
  assert.ok(result.chips.includes("sendmessage-queued"));
  assert.ok(result.chips.includes("no-failure-signal"));
  assert.ok(result.chips.includes("ps-only-discovery"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("tolled"));
  assert.match(result.contrast.case, /mute/i);
  assert.equal(result.ticket.spawnedSuccessfully, true);
  assert.equal(result.ticket.childDead, true);
  assert.equal(result.ticket.noTranscript, true);
  assert.equal(result.ticket.listAgentsGhost, true);
  assert.equal(result.ticket.toolName, TOOL_NAME);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.reporter, REPORTER);
});

test("data fixtures classify tolled vs mute vs named chips", () => {
  assert.equal(classify(readData("tolled.json")), "tolled");
  assert.equal(classify(readData("mute.json")), "mute");
  assert.equal(classify(readData("91298.json")), "mute");
  assert.equal(classify(readData("spawned-ok-dead.json")), "spawned-ok-dead");
  assert.equal(classify(readData("no-transcript.json")), "no-transcript");
  assert.equal(classify(readData("listagents-ghost.json")), "listagents-ghost");
  assert.equal(classify(readData("sendmessage-queued.json")), "sendmessage-queued");
  assert.equal(classify(readData("no-failure-signal.json")), "no-failure-signal");
  assert.equal(classify(readData("ps-only-discovery.json")), "ps-only-discovery");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("custom-agent-type.json")), "mute");
});

test("mute seed is alarm; tolled / hold are holds", () => {
  assert.equal(score(seedMute()).alarm, true);
  assert.equal(score(seedMute()).hold, false);
  assert.equal(score(seedTolled()).hold, true);
  assert.equal(score(seedTolled()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedSpawnedOkDead()).alarm, true);
  assert.equal(score(seedListagentsGhost()).alarm, true);
});

test("normalize seeds 91298 without ticket fields", () => {
  const ticket = normalize({ issue: 91298 });
  assert.equal(ticket.spawnedSuccessfully, true);
  assert.equal(ticket.childDead, true);
  assert.equal(ticket.noTranscript, true);
  assert.equal(ticket.listAgentsGhost, true);
  assert.equal(ticket.toolName, TOOL_NAME);
  assert.equal(classify(ticket), "mute");
});

test("score / decide / handle agree on mute vs tolled", () => {
  assert.equal(score(seedMute()).verdict, "mute");
  assert.equal(decide(seedTolled()).verdict, "tolled");
  const fail = handle(seedMute());
  const hold = handle(seedTolled());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91298/);
  assert.match(fail.hookSpecificOutput.additionalContext, /Spawned successfully/);
  assert.match(hold.hookSpecificOutput.additionalContext, /tolled/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("mute").verdict, "mute");
  assert.equal(decideSeed(91298).verdict, "mute");
  assert.equal(decideSeed("91298").verdict, "mute");
  assert.equal(decideSeed("tolled").verdict, "tolled");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("spawned-ok-dead").verdict, "spawned-ok-dead");
  assert.equal(decideSeed("no-transcript").verdict, "no-transcript");
  assert.equal(decideSeed("listagents-ghost").verdict, "listagents-ghost");
  assert.equal(decideSeed("sendmessage-queued").verdict, "sendmessage-queued");
});

test("CLI scores data files", () => {
  const mute = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91298.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(mute.status, 0, mute.stderr);
  assert.equal(JSON.parse(mute.stdout).verdict, "mute");
  assert.equal(JSON.parse(mute.stdout).alarm, true);

  const tolled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/tolled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(tolled.status, 0, tolled.stderr);
  assert.equal(JSON.parse(tolled.stdout).verdict, "tolled");
  assert.equal(JSON.parse(tolled.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91298);
  assert.deepEqual([...PRIMARY_ISSUES], [91298]);
  assert.equal(COUSIN_ISSUE, 87203);
  assert.deepEqual([...COUSINS], [87203, 71723, 88849, 83366, 86129]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-01T19:18:18Z");
  assert.equal(TOOL_NAME, "Agent");
  assert.equal(SPAWNED_OK, "Spawned successfully");
  assert.equal(LIST_AGENTS, "ListAgents");
  assert.equal(SEND_MESSAGE, "SendMessage");
  assert.equal(SEND_INBOX, "Message sent to inbox");
  assert.equal(TASK_STOP, "TaskStop");
  assert.equal(AGENT_A, "beads-change-reviewer");
  assert.equal(AGENT_B, "write-safety-reviewer");
  assert.equal(AGENTS_DIR, ".claude/agents");
  assert.equal(VERSION, "2.1.246");
  assert.equal(PLATFORM, "Linux");
  assert.equal(FOUR_OF_FOUR, "4 out of 4");
  assert.equal(REPORTER, "cciordas");
  assert.equal(IDLE_WORD, "tolled");
  assert.equal(SEEDED_WORD, "mute");
  assert.notEqual(IDLE_WORD, "mute");
  assert.notEqual(IDLE_WORD, "honored");
  assert.notEqual(IDLE_WORD, "discarded");
  assert.notEqual(IDLE_WORD, "arrested");
  assert.notEqual(IDLE_WORD, "skipped");
  assert.notEqual(IDLE_WORD, "indexed");
  assert.notEqual(IDLE_WORD, "jumped");
  assert.notEqual(IDLE_WORD, "chocked");
  assert.notEqual(IDLE_WORD, "rolled");
  assert.notEqual(IDLE_WORD, "clasped");
  assert.notEqual(IDLE_WORD, "sprung");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "cased");
  assert.notEqual(IDLE_WORD, "aired");
  assert.notEqual(IDLE_WORD, "sifted");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.deepEqual([...HOLD_VERDICTS], ["tolled", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("mute"));
  assert.ok(ALARM_VERDICTS.includes("spawned-ok-dead"));
  assert.ok(ALARM_VERDICTS.includes("listagents-ghost"));
  assert.ok(!ALARM_VERDICTS.includes("tolled"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 10);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:agents"],
  );
  assert.match(TITLE, /Agent tool/);
  assert.match(TITLE, /no transcript/);
  assert.match(TITLE, /no error/);
  assert.match(ISSUE_URL, /91298/);
  assert.match(PHRASE, /never tolls/i);
  assert.match(PHRASE, /admit mute/);
  assert.match(HUB_LINE, /14:50 knell/);
  assert.match(HUB_LINE, /admit mute/);
  assert.match(MARK, /14:50/);
  assert.match(MARK, /#115/);
  assert.match(MARK, /#91298/);
  assert.match(CONTRAST_NOTE, /SPAWNED SUCCESSFULLY/);
  assert.match(CONTRAST_NOTE, /Agent tool/);
  assert.match(CONTRAST_NOTE, /\.claude\/agents/);
  assert.match(CONTRAST_NOTE, /ListAgents/);
  assert.match(CONTRAST_NOTE, /SendMessage/);
  assert.match(CONTRAST_NOTE, /2\.1\.246/);
  assert.match(CONTRAST_NOTE, /beads-change-reviewer/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("carillon"));
  assert.ok(NOT_PRODUCTS.includes("geneva-drive"));
  assert.ok(NOT_PRODUCTS.includes("maltese-cross"));
  assert.ok(NOT_PRODUCTS.includes("locksmith pin-tumbler"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Carillon"));
  assert.ok(BANNED_NAMES.includes("Escapement"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "tolled");
  assert.equal(chips.seededWord, "mute");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91298);
  assert.equal(fp.cousin, 87203);
  assert.deepEqual(fp.cousins, [87203, 71723, 88849, 83366, 86129]);
  assert.equal(fp.toolName, "Agent");
  assert.equal(fp.spawnedOk, "Spawned successfully");
  assert.equal(fp.listAgents, "ListAgents");
  assert.equal(fp.sendMessage, "SendMessage");
  assert.equal(fp.version, "2.1.246");
  assert.equal(fp.reporter, "cciordas");
  assert.equal(fp.agentA, "beads-change-reviewer");
  assert.equal(fp.agentB, "write-safety-reviewer");
  assert.equal(fp.fourOfFour, "4 out of 4");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "mute");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.spawnedSuccessfully, true);
});

test("chipsOf on a raw mute spawn ticket still marks mute", () => {
  const chips = chipsOf({
    toolName: "Agent",
    spawnedSuccessfully: true,
    childDead: true,
    noTranscript: true,
    noFailureSignal: true,
    listAgentsGhost: true,
    sendMessageQueued: true,
    outputText:
      "mute; #91298; Spawned successfully; child dead; no transcript; no failure signal; ListAgents ghost; SendMessage queued forever",
  });
  assert.ok(chips.includes("mute"));
  assert.ok(chips.includes("spawned-ok-dead"));
  assert.ok(chips.includes("listagents-ghost"));
  assert.ok(!chips.includes("tolled"));
});

test("cousin #87203 is not conflated with mute primary", () => {
  assert.notEqual(classify(seedCousin()), "mute");
  assert.notEqual(classify({ issue: 87203 }), "mute");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /87203|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become mute", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "mute", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91298);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedSpawnedOkDead()).verdict, "spawned-ok-dead");
  assert.equal(analyze(seedNoTranscript()).verdict, "no-transcript");
  assert.equal(analyze(seedListagentsGhost()).verdict, "listagents-ghost");
  assert.equal(analyze(seedSendmessageQueued()).verdict, "sendmessage-queued");
  assert.equal(analyze(seedNoFailureSignal()).verdict, "no-failure-signal");
  assert.equal(analyze(seedPsOnlyDiscovery()).verdict, "ps-only-discovery");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.deathSurfaced, true);
  assert.equal(isMute(seedTolled()), false);
  assert.equal(isMute(seedMute()), true);
});

test("living page is a Knell atelier, idle tolled, seeded mute", () => {
  const html = readPage();
  assert.match(html, /<title>Knell/);
  assert.match(html, /Idle word:\s*tolled/);
  assert.match(html, /tolled/);
  assert.match(html, /mute/);
  assert.match(html, /spawned-ok-dead/);
  assert.match(html, /no-transcript/);
  assert.match(html, /listagents-ghost/);
  assert.match(html, /sendmessage-queued/);
  assert.match(html, /no-failure-signal/);
  assert.match(html, /ps-only-discovery/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91298/);
  assert.match(html, /#87203/);
  assert.match(html, /#71723/);
  assert.match(html, /#88849/);
  assert.match(html, /#83366/);
  assert.match(html, /#86129/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /14:50/);
  assert.match(html, /catalog #115/);
  assert.match(html, /Spawned successfully/);
  assert.match(html, /Agent tool/);
  assert.match(html, /\.claude\/agents/);
  assert.match(html, /no transcript/);
  assert.match(html, /no failure signal/);
  assert.match(html, /ListAgents/);
  assert.match(html, /SendMessage/);
  assert.match(html, /TaskStop/);
  assert.match(html, /2\.1\.246/);
  assert.match(html, /beads-change-reviewer/);
  assert.match(html, /write-safety-reviewer/);
  assert.match(html, /4 out of 4/);
  assert.match(html, /cciordas/);
  assert.match(html, /\bps\b/);
  assert.match(html, /family=Bitter|Bitter/);
  assert.match(html, /family=Karla|Karla/);
  assert.match(html, /family=Inconsolata|Inconsolata/);
  assert.match(html, /Score the mute/);
  assert.match(html, /Pin idle tolled/);
  assert.match(html, /Pin seeded mute/);
  assert.match(html, /Admit mute/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to tolled/);
  assert.match(html, /death-knell|funeral-bell|bronze|clapper|untolled rope|empty chamber|toll ledger|mourning ribbon/i);
  assert.match(html, /SPAWNED SUCCESSFULLY|CHILD DIES SILENTLY|LISTAGENTS STILL LISTS/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*mute/i);
  assert.doesNotMatch(html, /Idle word:\s*honored/i);
  assert.doesNotMatch(html, /Idle word:\s*discarded/i);
  assert.doesNotMatch(html, /Idle word:\s*arrested/i);
  assert.doesNotMatch(html, /Idle word:\s*skipped/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Pin idle mute/);
  assert.doesNotMatch(html, /Pin idle honored/);
  assert.doesNotMatch(html, /Pin idle discarded/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /Score the cross/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
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
  assert.doesNotMatch(html, /family=Literata/);
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

test("README and page stay Knell, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Knell/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /AGENT TOOL RETURNS "SPAWNED SUCCESSFULLY"|CHILD DIES SILENTLY AT STARTUP|LISTAGENTS STILL LISTS THE DEAD/i,
  );
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Geneva\*\*/);
  assert.match(readme, /NOT \*\*Scotch\*\*/);
  assert.match(readme, /NOT \*\*Fibula\*\*/);
  assert.match(readme, /NOT \*\*Virgule\*\*/);
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /Product name stays \*\*Knell\*\*/);
  assert.match(readme, /Idle word: \*\*tolled\*\*/);
  assert.match(readme, /#87203/);
  assert.match(readme, /#71723/);
  assert.match(readme, /Spawned successfully/);
  assert.match(readme, /Agent tool/);
  assert.match(readme, /\.claude\/agents/);
  assert.match(readme, /no transcript/);
  assert.match(readme, /ListAgents/);
  assert.match(readme, /SendMessage/);
  assert.match(readme, /TaskStop/);
  assert.match(readme, /2\.1\.246/);
  assert.match(readme, /beads-change-reviewer/);
  assert.match(readme, /write-safety-reviewer/);
  assert.match(readme, /4 out of 4/);
  assert.match(readme, /cciordas/);
  assert.match(readme, /\bps\b/);
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
});
