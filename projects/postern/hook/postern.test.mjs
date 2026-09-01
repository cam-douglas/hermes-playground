import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CLAUDE_VERSION,
  CONTRAST_NOTE,
  CLAUDE_COUSINS,
  CODEX_COUSINS,
  COUSINS,
  COUSIN_CHROOT,
  COUSIN_ISSUE,
  COUSIN_ONEWAY,
  COUSIN_URL,
  COUSIN_WSLG,
  DIR_MODE,
  FALLBACK_DIR_PREFIX,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MACOS_BUILD,
  MARK,
  NOT_PRODUCTS,
  OTHER_UID,
  PHRASE,
  PLATFORM,
  PRIMARY_DIR,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SESSION_UID,
  SETTINGS_BLOCK_VERSION,
  SYMPTOM_FIX_VERSION,
  TITLE,
  UDS_BUDGET_BYTES,
  UID_SUFFIX_BYTES,
  VERDICTS,
  WORKAROUND_PATH_BYTES,
  WORKAROUND_XDG,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedBootOrder,
  seedCousin,
  seedDosOnly,
  seedFallbackIgnoresXdg,
  seedFirstCome,
  seedNoThirdDoor,
  seedPeerPathOk,
  seedPosternRefused,
  seedPredictableUid,
  seedSquatted,
  seedStatusSilent,
  seedWarded,
  seedWorkaroundXdg,
} from "./postern.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./postern.mjs", import.meta.url));
}

test("idle warded is a hold; session uid owns the sockets dir", () => {
  const result = analyze(seedWarded());
  assert.equal(result.verdict, "warded");
  assert.equal(result.idleWord, "warded");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.squatted, false);
  assert.equal(result.warded, true);
  assert.ok(result.chips.includes("warded"));
  assert.ok(!result.chips.includes("squatted"));
  assert.doesNotMatch(
    result.idleWord,
    /squatted|postern|sluice|drained|pooled|stationed|displaced|hung|marvered|unpinned|shed|sealed|rinsed|vacant/i,
  );
});

test("empty ticket and empty stdin classify warded", () => {
  assert.equal(classify(emptyTicket()), "warded");
  assert.equal(classify(""), "warded");
  assert.equal(classify(null), "warded");
  assert.equal(decideSeed("warded").verdict, "warded");
});

test("seeded squatted #91223 is alarm with both leaves barred", () => {
  const result = analyze(seedSquatted());
  assert.equal(result.verdict, "squatted");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.squatted, true);
  assert.ok(result.chips.includes("squatted"));
  assert.ok(result.chips.includes("postern-refused"));
  assert.ok(result.chips.includes("no-third-door"));
  assert.ok(result.chips.includes("predictable-uid"));
  assert.ok(result.chips.includes("dos-only"));
  assert.ok(result.chips.includes("status-silent"));
  assert.ok(!result.chips.includes("warded"));
  assert.match(result.contrast.greatGate, /barred/i);
  assert.match(result.contrast.postern, /barred/i);
  assert.match(result.contrast.rushlight, /gutter/i);
});

test("first-come is alarm without becoming squatted when the postern opens", () => {
  const result = analyze(seedFirstCome());
  assert.equal(result.verdict, "first-come");
  assert.equal(result.alarm, true);
  assert.ok(result.chips.includes("first-come"));
  assert.ok(result.chips.includes("peer-path-ok"));
  assert.ok(!result.chips.includes("squatted"));
  assert.ok(!result.chips.includes("warded"));
});

test("data fixtures classify warded vs squatted vs named chips", () => {
  assert.equal(classify(readData("warded.json")), "warded");
  assert.equal(classify(readData("squatted.json")), "squatted");
  assert.equal(classify(readData("91223.json")), "squatted");
  assert.equal(classify(readData("first-come.json")), "first-come");
  assert.equal(classify(readData("boot-order.json")), "boot-order");
  assert.equal(classify(readData("postern-refused.json")), "postern-refused");
  assert.equal(classify(readData("no-third-door.json")), "no-third-door");
  assert.equal(classify(readData("predictable-uid.json")), "predictable-uid");
  assert.equal(classify(readData("workaround-xdg.json")), "workaround-xdg");
  assert.equal(classify(readData("fallback-ignores-xdg.json")), "fallback-ignores-xdg");
  assert.equal(classify(readData("dos-only.json")), "dos-only");
  assert.equal(classify(readData("peer-path-ok.json")), "peer-path-ok");
  assert.equal(classify(readData("status-silent.json")), "status-silent");
});

test("squatted seed is alarm; warded seed is hold; dos-only is not a hold", () => {
  assert.equal(score(seedSquatted()).alarm, true);
  assert.equal(score(seedSquatted()).hold, false);
  assert.equal(score(seedWarded()).hold, true);
  assert.equal(score(seedWarded()).alarm, false);
  assert.equal(score(seedDosOnly()).hold, false);
  assert.equal(score(seedDosOnly()).alarm, true);
  assert.equal(score(seedWorkaroundXdg()).verdict, "workaround-xdg");
  assert.equal(score(seedWorkaroundXdg()).alarm, true);
});

test("normalize seeds 91223 without ticket fields", () => {
  const ticket = normalize({ issue: 91223 });
  assert.equal(ticket.sessionUid, 501);
  assert.equal(ticket.primaryDirOwnerUid, 502);
  assert.equal(ticket.fallbackDirOwnerUid, 502);
  assert.equal(ticket.messagingOn, false);
  assert.equal(ticket.peerTokenHolds, true);
  assert.equal(ticket.homeFallbackAttempted, false);
  assert.equal(classify(ticket), "squatted");
});

test("score / decide / handle agree on squatted vs warded", () => {
  assert.equal(score(seedSquatted()).verdict, "squatted");
  assert.equal(decide(seedWarded()).verdict, "warded");
  const fail = handle(seedSquatted());
  const hold = handle(seedWarded());
  const first = handle(seedFirstCome());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91223/);
  assert.match(hold.hookSpecificOutput.additionalContext, /warded/i);
  assert.match(first.hookSpecificOutput.additionalContext, /first-come/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("squatted").verdict, "squatted");
  assert.equal(decideSeed(91223).verdict, "squatted");
  assert.equal(decideSeed("91223").verdict, "squatted");
  assert.equal(decideSeed("warded").verdict, "warded");
  assert.equal(decideSeed("first-come").verdict, "first-come");
  assert.equal(decideSeed("boot-order").verdict, "boot-order");
  assert.equal(decideSeed("workaround-xdg").verdict, "workaround-xdg");
  assert.equal(decideSeed("dos-only").verdict, "dos-only");
  assert.equal(decideSeed("status-silent").verdict, "status-silent");
});

test("CLI scores data files", () => {
  const squatted = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91223.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(squatted.status, 0, squatted.stderr);
  assert.equal(JSON.parse(squatted.stdout).verdict, "squatted");
  assert.equal(JSON.parse(squatted.stdout).alarm, true);

  const warded = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/warded.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(warded.status, 0, warded.stderr);
  assert.equal(JSON.parse(warded.stdout).verdict, "warded");
  assert.equal(JSON.parse(warded.stdout).hold, true);

  const first = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/first-come.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(first.status, 0, first.stderr);
  assert.equal(JSON.parse(first.stdout).verdict, "first-come");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91223);
  assert.deepEqual([...PRIMARY_ISSUES], [91223]);
  assert.equal(COUSIN_ISSUE, 89401);
  assert.equal(COUSIN_WSLG, 89563);
  assert.equal(COUSIN_CHROOT, 86567);
  assert.equal(COUSIN_ONEWAY, 84945);
  assert.deepEqual([...CLAUDE_COUSINS], [89401, 89563, 86567, 84945]);
  assert.deepEqual([...CODEX_COUSINS], [26761, 17765, 15435]);
  assert.deepEqual([...COUSINS], [89401, 89563, 86567, 84945, 26761, 17765, 15435]);
  assert.equal(FILED_AT, "2026-09-01T13:34:37Z");
  assert.equal(CLAUDE_VERSION, "2.1.252");
  assert.equal(SYMPTOM_FIX_VERSION, "2.1.248");
  assert.equal(SETTINGS_BLOCK_VERSION, "2.1.251");
  assert.equal(PLATFORM, "macos");
  assert.equal(MACOS_BUILD, "25.6.0 arm64");
  assert.equal(REPORTER, "allixsenos");
  assert.equal(SESSION_UID, 501);
  assert.equal(OTHER_UID, 502);
  assert.equal(PRIMARY_DIR, "/tmp/cc-socks");
  assert.equal(FALLBACK_DIR_PREFIX, "/tmp/cc-socks-");
  assert.equal(DIR_MODE, "0700");
  assert.equal(UDS_BUDGET_BYTES, 103);
  assert.equal(UID_SUFFIX_BYTES, 4);
  assert.equal(WORKAROUND_PATH_BYTES, 35);
  assert.equal(WORKAROUND_XDG, "/tmp/claude-501");
  assert.equal(IDLE_WORD, "warded");
  assert.equal(SEEDED_WORD, "squatted");
  assert.notEqual(IDLE_WORD, "squatted");
  assert.notEqual(IDLE_WORD, "postern");
  assert.deepEqual([...HOLD_VERDICTS], ["warded"]);
  assert.ok(ALARM_VERDICTS.includes("squatted"));
  assert.ok(ALARM_VERDICTS.includes("first-come"));
  assert.ok(ALARM_VERDICTS.includes("dos-only"));
  assert.ok(!ALARM_VERDICTS.includes("warded"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:core", "area:security"],
  );
  assert.match(TITLE, /first-come/);
  assert.match(TITLE, /\/tmp\/cc-socks/);
  assert.match(ISSUE_URL, /91223/);
  assert.match(COUSIN_URL, /89401/);
  assert.match(PHRASE, /bailey can bar/i);
  assert.match(HUB_LINE, /03:50 postern/);
  assert.match(HUB_LINE, /admit warded/);
  assert.match(MARK, /03:50/);
  assert.match(MARK, /#104/);
  assert.match(MARK, /#91223/);
  assert.match(CONTRAST_NOTE, /UDS MESSAGING DIRECTORY TENANCY/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("sluice"));
  assert.ok(NOT_PRODUCTS.includes("alidade"));
  assert.ok(NOT_PRODUCTS.includes("cubby"));
  assert.ok(BANNED_NAMES.includes("Wicket"));
  assert.ok(BANNED_NAMES.includes("Bailey"));
  assert.ok(BANNED_NAMES.includes("Sluice"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "warded");
  assert.equal(chips.seededWord, "squatted");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91223);
  assert.equal(fp.cousin, 89401);
  assert.deepEqual(fp.cousins, [89401, 89563, 86567, 84945, 26761, 17765, 15435]);
  assert.deepEqual(fp.claudeCousins, [89401, 89563, 86567, 84945]);
  assert.deepEqual(fp.codexCousins, [26761, 17765, 15435]);
  assert.equal(fp.claudeVersion, "2.1.252");
  assert.equal(fp.sessionUid, 501);
  assert.equal(fp.otherUid, 502);
  assert.equal(fp.workaroundPathBytes, 35);
  assert.equal(fp.udsBudgetBytes, 103);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "squatted");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.sessionUid, 501);
  assert.equal(fixtures.narrativeNotFixture.otherUid, 502);
});

test("chipsOf on a raw squatted ticket still marks both names taken", () => {
  const chips = chipsOf({
    sessionUid: 501,
    primaryDirOwnerUid: 502,
    fallbackDirOwnerUid: 502,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    homeFallbackAttempted: false,
    peerTokenHolds: true,
    statusReportsRefusal: false,
    outputText:
      "squatted; another uid owns primary AND per-uid fallback; messaging off; peerToken holds; no $HOME third door",
  });
  assert.ok(chips.includes("squatted"));
  assert.ok(chips.includes("postern-refused"));
  assert.ok(chips.includes("dos-only"));
  assert.ok(!chips.includes("warded"));
});

test("cousin #89401 is not conflated with squatted", () => {
  assert.notEqual(classify(seedCousin()), "squatted");
  assert.notEqual(classify({ issue: 89401 }), "squatted");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /89401|cousin/i.test(row)));
  assert.equal(cousin.verdict, "first-come");
});

test("cite-only cousins are not primaries and do not become squatted", () => {
  for (const issue of [89401, 89563, 86567, 84945, 26761, 17765, 15435]) {
    assert.notEqual(classify({ issue }), "squatted", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91223);
});

test("both dirs owned by other + messaging off → squatted; session owns + messaging on → warded", () => {
  assert.equal(
    classify({
      sessionUid: 501,
      primaryDirOwnerUid: 502,
      fallbackDirOwnerUid: 502,
      primaryDirExists: true,
      fallbackDirExists: true,
      messagingOn: false,
      peerTokenHolds: true,
      homeFallbackAttempted: false,
      outputText: "squatted; another uid owns primary AND per-uid fallback; messaging off",
    }),
    "squatted",
  );
  assert.equal(
    classify({
      sessionUid: 501,
      primaryDirOwnerUid: 501,
      fallbackDirOwnerUid: 501,
      messagingOn: true,
      outputText: "warded postern; session uid 501 owns the sockets dir it uses; messaging on",
    }),
    "warded",
  );
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedBootOrder()).verdict, "boot-order");
  assert.equal(analyze(seedPosternRefused()).verdict, "postern-refused");
  assert.equal(analyze(seedNoThirdDoor()).verdict, "no-third-door");
  assert.equal(analyze(seedPredictableUid()).verdict, "predictable-uid");
  assert.equal(analyze(seedFallbackIgnoresXdg()).verdict, "fallback-ignores-xdg");
  assert.equal(analyze(seedPeerPathOk()).verdict, "peer-path-ok");
  assert.equal(analyze(seedStatusSilent()).verdict, "status-silent");
  assert.equal(analyze(seedWorkaroundXdg()).ticket.socketPathBytes, 35);
  assert.equal(analyze(seedFallbackIgnoresXdg()).flags.xdgIgnored, true);
  assert.equal(analyze(seedDosOnly()).flags.peerTokenHolds, true);
});

test("living page is a night bailey postern desk, idle warded, seeded squatted", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*warded/);
  assert.match(html, /warded/);
  assert.match(html, /squatted/);
  assert.match(html, /first-come/);
  assert.match(html, /boot-order/);
  assert.match(html, /postern-refused/);
  assert.match(html, /no-third-door/);
  assert.match(html, /predictable-uid/);
  assert.match(html, /workaround-xdg/);
  assert.match(html, /fallback-ignores-xdg/);
  assert.match(html, /dos-only/);
  assert.match(html, /peer-path-ok/);
  assert.match(html, /status-silent/);
  assert.match(html, /#91223/);
  assert.match(html, /#89401/);
  assert.match(html, /#89563/);
  assert.match(html, /#86567/);
  assert.match(html, /#84945/);
  assert.match(html, /26761/);
  assert.match(html, /17765/);
  assert.match(html, /15435/);
  assert.match(html, /codex-ipc/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /03:50/);
  assert.match(html, /catalog #104/);
  assert.match(html, /2\.1\.252/);
  assert.match(html, /2\.1\.248/);
  assert.match(html, /25\.6\.0/);
  assert.match(html, /\/tmp\/cc-socks/);
  assert.match(html, /peerToken/);
  assert.match(html, /Cinzel/);
  assert.match(html, /Literata/);
  assert.match(html, /Inconsolata/);
  assert.match(html, /Score the postern/);
  assert.match(html, /Pin idle warded/);
  assert.match(html, /Pin seeded squatted/);
  assert.match(html, /Admit warded/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to warded/);
  assert.match(html, /night bailey|night-ward|postern-gate/i);
  assert.match(html, /UDS MESSAGING DIRECTORY TENANCY/);
  assert.match(html, /DoS ONLY|DoS only/i);
  assert.match(html, /embed/);
  assert.match(html, /#161410|#0a0b0e|#e4b86a/);
  assert.doesNotMatch(html, /Idle word:\s*squatted/i);
  assert.doesNotMatch(html, /Idle word:\s*postern/i);
  assert.doesNotMatch(html, /Idle word:\s*sluice/i);
  assert.doesNotMatch(html, /Pin idle drained/);
  assert.doesNotMatch(html, /Pin idle stationed/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the gather/);
  assert.doesNotMatch(html, /Score the brim/);
  assert.doesNotMatch(html, /Score the vat/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=EB\+Garamond/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /mkdir -m 700/);
  assert.doesNotMatch(html, /millrace/);
  assert.doesNotMatch(html, /plane-table/);
  assert.doesNotMatch(html, /glory hole/i);
  assert.doesNotMatch(html, /hat-block/);
  assert.doesNotMatch(html, /lye vat/);
  assert.doesNotMatch(html, /millimeter-slider|mm-slider/);
});
