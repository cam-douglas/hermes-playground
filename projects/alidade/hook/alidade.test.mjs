import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  BOLLARD_ISSUE,
  CHIPS,
  CLI_VERSION,
  CONTRAST_NOTE,
  COUSINS,
  DAMPER_ISSUE,
  DESKTOP_VERSION,
  FASCIA_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  KIST_ISSUE,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  SESSION_LABEL,
  SHARED_CWD,
  SHUNT_ISSUE,
  TAIN_ISSUE,
  TITLE,
  TITLE_LEAK_ISSUE,
  TOOL_HOST_SEEDED,
  VERDICTS,
  VIEWER_HOST_SEEDED,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedCousin,
  seedDisplaced,
  seedForeignHost,
  seedHostMatch,
  seedNoPlate,
  seedStationed,
} from "./alidade.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./alidade.mjs", import.meta.url));
}

test("idle stationed is a hold; viewer host matches tool host", () => {
  const result = analyze(seedStationed());
  assert.equal(result.verdict, "stationed");
  assert.equal(result.idleWord, "stationed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.displaced, false);
  assert.ok(result.chips.includes("stationed"));
  assert.ok(!result.chips.includes("displaced"));
  assert.ok(!result.chips.includes("foreign-host"));
  assert.ok(!result.chips.includes("no-plate"));
  assert.doesNotMatch(
    result.idleWord,
    /displaced|alidade|noria|pelorus|strowger|hung|marvered|unpinned|cocked|rinsed|vacant|reserved|fronted|silvered|defaulted|kisted|belayed|misrouted/i,
  );
});

test("empty ticket and empty stdin classify stationed", () => {
  assert.equal(classify(emptyTicket()), "stationed");
  assert.equal(classify(""), "stationed");
  assert.equal(classify(null), "stationed");
  assert.equal(decideSeed("stationed").verdict, "stationed");
});

test("seeded displaced #91055 is alarm with the foreign-station chips", () => {
  const result = analyze(seedDisplaced());
  assert.equal(result.verdict, "displaced");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("displaced"));
  assert.ok(result.chips.includes("foreign-host"));
  assert.ok(result.chips.includes("no-plate"));
  assert.ok(result.chips.includes("shared-path"));
  assert.ok(result.chips.includes("silent-uac"));
  assert.ok(result.chips.includes("account-list"));
  assert.ok(!result.chips.includes("stationed"));
  assert.ok(!result.chips.includes("host-match"));
  assert.match(result.contrast.vane, /foreign unmarked station/);
  assert.match(result.contrast.plate, /missing/);
  assert.match(result.contrast.compass, /DESKTOP-JNMKF1S/);
  assert.match(result.contrast.disk, /foreign disk/);
});

test("host-match is a hold; foreign-host is an alarm", () => {
  const match = analyze(seedHostMatch());
  assert.equal(match.verdict, "host-match");
  assert.equal(match.hold, true);
  assert.equal(match.alarm, false);
  assert.ok(match.chips.includes("host-match"));
  assert.ok(!match.chips.includes("foreign-host"));
  assert.ok(!match.chips.includes("displaced"));

  const foreign = analyze(seedForeignHost());
  assert.equal(foreign.verdict, "foreign-host");
  assert.equal(foreign.hold, false);
  assert.equal(foreign.alarm, true);
  assert.ok(foreign.chips.includes("foreign-host"));
  assert.ok(!foreign.chips.includes("host-match"));
  assert.notEqual(foreign.verdict, "displaced");
});

test("no-plate is alarm without becoming displaced when hosts match", () => {
  const result = analyze(seedNoPlate());
  assert.equal(result.verdict, "no-plate");
  assert.equal(result.alarm, true);
  assert.ok(result.chips.includes("no-plate"));
  assert.ok(!result.chips.includes("displaced"));
  assert.ok(!result.chips.includes("foreign-host"));
});

test("data fixtures classify stationed vs displaced vs named chips", () => {
  assert.equal(classify(readData("stationed.json")), "stationed");
  assert.equal(classify(readData("displaced.json")), "displaced");
  assert.equal(classify(readData("91055.json")), "displaced");
  assert.equal(classify(readData("host-match.json")), "host-match");
  assert.equal(classify(readData("foreign-host.json")), "foreign-host");
  assert.equal(classify(readData("no-plate.json")), "no-plate");
  assert.equal(classify(readData("plated.json")), "plated");
  assert.equal(classify(readData("local-scope.json")), "local-scope");
  assert.equal(classify(readData("shared-path.json")), "shared-path");
  assert.equal(classify(readData("silent-uac.json")), "silent-uac");
  assert.equal(classify(readData("account-list.json")), "account-list");
});

test("displaced seed is alarm; stationed and host-match seeds are hold", () => {
  assert.equal(score(seedDisplaced()).alarm, true);
  assert.equal(score(seedDisplaced()).hold, false);
  assert.equal(score(seedStationed()).hold, true);
  assert.equal(score(seedStationed()).alarm, false);
  assert.equal(score(seedHostMatch()).hold, true);
  assert.equal(score(seedHostMatch()).alarm, false);
});

test("normalize seeds 91055 without ticket fields", () => {
  const ticket = normalize({ issue: 91055 });
  assert.equal(ticket.toolHost, "DESKTOP-JNMKF1S");
  assert.equal(ticket.viewerHost, "HOME-DESK");
  assert.equal(ticket.platePresent, false);
  assert.equal(ticket.cwdShared, true);
  assert.equal(ticket.accountGlobalList, true);
  assert.equal(classify(ticket), "displaced");
});

test("score / decide / handle agree on displaced vs stationed", () => {
  assert.equal(score(seedDisplaced()).verdict, "displaced");
  assert.equal(decide(seedStationed()).verdict, "stationed");
  const fail = handle(seedDisplaced());
  const hold = handle(seedStationed());
  const match = handle(seedHostMatch());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91055/);
  assert.match(hold.hookSpecificOutput.additionalContext, /stationed/i);
  assert.match(match.hookSpecificOutput.additionalContext, /host-match/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("displaced").verdict, "displaced");
  assert.equal(decideSeed(91055).verdict, "displaced");
  assert.equal(decideSeed("91055").verdict, "displaced");
  assert.equal(decideSeed("stationed").verdict, "stationed");
  assert.equal(decideSeed("host-match").verdict, "host-match");
  assert.equal(decideSeed("foreign-host").verdict, "foreign-host");
  assert.equal(decideSeed("no-plate").verdict, "no-plate");
});

test("CLI scores data files", () => {
  const displaced = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/displaced.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(displaced.status, 0, displaced.stderr);
  assert.equal(JSON.parse(displaced.stdout).verdict, "displaced");
  assert.equal(JSON.parse(displaced.stdout).alarm, true);

  const stationed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/stationed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(stationed.status, 0, stationed.stderr);
  assert.equal(JSON.parse(stationed.stdout).verdict, "stationed");
  assert.equal(JSON.parse(stationed.stdout).hold, true);

  const match = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/host-match.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(match.status, 0, match.stderr);
  assert.equal(JSON.parse(match.stdout).verdict, "host-match");
  assert.equal(JSON.parse(match.stdout).hold, true);
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91055);
  assert.deepEqual([...PRIMARY_ISSUES], [91055]);
  assert.deepEqual([...SAME_CLASS], [90433]);
  assert.deepEqual(
    [...COUSINS],
    [90638, 90257, 90341, 90387, 90581, 90463, 90433],
  );
  assert.equal(TITLE_LEAK_ISSUE, 90433);
  assert.equal(FASCIA_ISSUE, 90638);
  assert.equal(TAIN_ISSUE, 90257);
  assert.equal(DAMPER_ISSUE, 90341);
  assert.equal(KIST_ISSUE, 90387);
  assert.equal(BOLLARD_ISSUE, 90581);
  assert.equal(SHUNT_ISSUE, 90463);
  assert.equal(FILED_AT, "2026-08-31T18:14:44Z");
  assert.equal(DESKTOP_VERSION, "1.40609.0.0");
  assert.equal(CLI_VERSION, "2.1.247");
  assert.equal(PLATFORM, "windows");
  assert.equal(REPORTER, "RingmasterSpain");
  assert.equal(TOOL_HOST_SEEDED, "DESKTOP-JNMKF1S");
  assert.equal(VIEWER_HOST_SEEDED, "HOME-DESK");
  assert.equal(SESSION_LABEL, "downloads-44 [4161f1]");
  assert.equal(SHARED_CWD, "C:\\Users\\…\\Downloads");
  assert.equal(IDLE_WORD, "stationed");
  assert.equal(SEEDED_WORD, "displaced");
  assert.notEqual(IDLE_WORD, "displaced");
  assert.notEqual(IDLE_WORD, "alidade");
  assert.deepEqual(
    [...HOLD_VERDICTS],
    ["stationed", "plated", "host-match", "local-scope"],
  );
  assert.ok(ALARM_VERDICTS.includes("displaced"));
  assert.ok(ALARM_VERDICTS.includes("foreign-host"));
  assert.ok(ALARM_VERDICTS.includes("no-plate"));
  assert.ok(!ALARM_VERDICTS.includes("stationed"));
  assert.ok(!ALARM_VERDICTS.includes("host-match"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 10);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:security", "area:desktop"],
  );
  assert.match(TITLE, /silently executes on that machine/);
  assert.match(ISSUE_URL, /91055/);
  assert.match(PHRASE, /foreign station with no plate/i);
  assert.match(HUB_LINE, /04:50 alidade/);
  assert.match(HUB_LINE, /admit stationed/);
  assert.match(MARK, /04:50/);
  assert.match(MARK, /#102/);
  assert.match(MARK, /#91055/);
  assert.match(CONTRAST_NOTE, /SESSION-HOST IDENTITY/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("fascia"));
  assert.ok(NOT_PRODUCTS.includes("tain"));
  assert.ok(NOT_PRODUCTS.includes("damper"));
  assert.ok(NOT_PRODUCTS.includes("parison"));
  assert.ok(NOT_PRODUCTS.includes("noria"));
  assert.ok(BANNED_NAMES.includes("Noria"));
  assert.ok(BANNED_NAMES.includes("Parison"));
  assert.ok(BANNED_NAMES.includes("Pelorus"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "stationed");
  assert.equal(chips.seededWord, "displaced");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91055);
  assert.equal(fp.toolHost, "DESKTOP-JNMKF1S");
  assert.equal(fp.desktopVersion, "1.40609.0.0");
  assert.equal(fp.cliVersion, "2.1.247");
  assert.equal(fp.sessionLabel, "downloads-44 [4161f1]");
  assert.deepEqual(fp.sameClass, [90433]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "displaced");
  assert.equal(fixtures.narrativeNotFixture.noSessionIdsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.toolHost, "DESKTOP-JNMKF1S");
});

test("chipsOf on a raw displaced ticket still marks foreign-host and no-plate", () => {
  const chips = chipsOf({
    viewerHost: "HOME-DESK",
    toolHost: "DESKTOP-JNMKF1S",
    platePresent: false,
    cwdShared: true,
    accountGlobalList: true,
    uacVisible: false,
    writesLandLocal: false,
    toolAttached: true,
    outputText:
      "foreign host attached; no station plate; shared profile path; UAC hangs unseen; account-global session list; displaced",
  });
  assert.ok(chips.includes("displaced"));
  assert.ok(chips.includes("foreign-host"));
  assert.ok(chips.includes("no-plate"));
  assert.ok(chips.includes("shared-path"));
  assert.ok(!chips.includes("stationed"));
});

test("cousins are not conflated with displaced", () => {
  assert.notEqual(classify(seedCousin("fascia")), "displaced");
  assert.notEqual(classify(seedCousin("tain")), "displaced");
  assert.notEqual(classify(seedCousin("damper")), "displaced");
  assert.notEqual(classify(seedCousin("kist")), "displaced");
  assert.notEqual(classify(seedCousin("bollard")), "displaced");
  assert.notEqual(classify(seedCousin("shunt")), "displaced");
  assert.notEqual(classify(seedCousin("title-leak")), "displaced");
  assert.equal(classify({ issue: 90638 }), "stationed");
  assert.equal(classify({ issue: 90433 }), "stationed");
  assert.equal(classify({ issue: 90257 }), "stationed");
  assert.equal(classify({ issue: 90341 }), "stationed");
  assert.equal(classify({ issue: 90387 }), "stationed");
  assert.equal(classify({ issue: 90581 }), "stationed");
  assert.equal(classify({ issue: 90463 }), "stationed");
  const fascia = analyze(seedCousin("fascia"));
  assert.ok(fascia.reasons.some((row) => /fascia|not Alidade|#90638/i.test(row)));
  const title = analyze(seedCousin("title-leak"));
  assert.ok(title.reasons.some((row) => /title-leak|#90433/i.test(row)));
});

test("foreign host + no plate → displaced; matching hosts + plate → stationed", () => {
  assert.equal(
    classify({
      viewerHost: "HOME-DESK",
      toolHost: "DESKTOP-JNMKF1S",
      platePresent: false,
      cwdShared: true,
      accountGlobalList: true,
      writesLandLocal: false,
      toolAttached: true,
      outputText: "foreign host attached; no station plate; displaced",
    }),
    "displaced",
  );
  assert.equal(
    classify({
      viewerHost: "HOME-DESK",
      toolHost: "HOME-DESK",
      platePresent: true,
      writesLandLocal: true,
      accountGlobalList: false,
      outputText: "stationed peg; viewer host matches tool host; station plate shown",
    }),
    "stationed",
  );
});

test("living page is a plane-table station desk, idle stationed, seeded displaced", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*stationed/);
  assert.match(html, /stationed/);
  assert.match(html, /displaced/);
  assert.match(html, /foreign-host/);
  assert.match(html, /no-plate/);
  assert.match(html, /shared-path/);
  assert.match(html, /silent-uac/);
  assert.match(html, /account-list/);
  assert.match(html, /host-match/);
  assert.match(html, /plated/);
  assert.match(html, /local-scope/);
  assert.match(html, /#91055/);
  assert.match(html, /#90433/);
  assert.match(html, /#90638/);
  assert.match(html, /Fascia/);
  assert.match(html, /Tain/);
  assert.match(html, /Damper/);
  assert.match(html, /Kist/);
  assert.match(html, /Bollard/);
  assert.match(html, /Shunt/);
  assert.match(html, /04:50/);
  assert.match(html, /catalog #102/);
  assert.match(html, /1\.40609\.0\.0/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /DESKTOP-JNMKF1S/);
  assert.match(html, /downloads-44/);
  assert.match(html, /Libre\+Caslon|Libre Caslon/);
  assert.match(html, /Public\+Sans|Public Sans/);
  assert.match(html, /Ubuntu\+Mono|Ubuntu Mono/);
  assert.match(html, /Score the peg/);
  assert.match(html, /Pin idle stationed/);
  assert.match(html, /Pin seeded displaced/);
  assert.match(html, /Admit stationed/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to stationed/);
  assert.match(html, /plane-table|plane table/i);
  assert.match(html, /alidade/i);
  assert.match(html, /station plate/i);
  assert.match(html, /station peg/i);
  assert.match(html, /sighting vane|sight vane/i);
  assert.doesNotMatch(html, /Idle word:\s*displaced/i);
  assert.doesNotMatch(html, /Idle word:\s*alidade/i);
  assert.doesNotMatch(html, /Idle word:\s*hung/i);
  assert.doesNotMatch(html, /Idle word:\s*marvered/i);
  assert.doesNotMatch(html, /Pin idle marvered/);
  assert.doesNotMatch(html, /Pin idle unpinned/);
  assert.doesNotMatch(html, /Score the gather/);
  assert.doesNotMatch(html, /Score the brim/);
  assert.doesNotMatch(html, /Score the vat/);
  assert.doesNotMatch(html, /family=EB\+Garamond/);
  assert.doesNotMatch(html, /family=Mulish/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Nunito/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Special\+Elite/);
  assert.doesNotMatch(html, /family=Barlow/);
  assert.doesNotMatch(html, /glory hole/i);
  assert.doesNotMatch(html, /hat-block/);
  assert.doesNotMatch(html, /silk cockade/);
  assert.doesNotMatch(html, /lye vat/);
  assert.doesNotMatch(html, /milliner/);
  assert.doesNotMatch(html, /punty/);
});
