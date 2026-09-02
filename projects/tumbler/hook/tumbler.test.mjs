import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ACCEPT_EDITS,
  ALARM_VERDICTS,
  ALSO_BROKEN,
  BANNED_NAMES,
  CHIPS,
  CHOOSER_PROMPT,
  CONFIRMED_VERSION,
  CONFIRMER,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  DECISION_ALLOW,
  FEATURED_ISSUE,
  FILED_AT,
  FIRST_BROKEN,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HELLO_TXT,
  HOLD_VERDICTS,
  HOOK_EVENT,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_GOOD,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLAN_MODE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SET_MODE,
  STAFF,
  STAFF_VERSION,
  TITLE,
  TOOL_NAME,
  UPDATED_INPUT,
  UPDATED_PERMISSIONS,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isDiscarded,
  isHonored,
  normalize,
  score,
  seedAllowIgnored,
  seedChooserBlocks,
  seedCousin,
  seedDenyStillWorks,
  seedDiscarded,
  seedDocsGap,
  seedHasClearRepro,
  seedHold,
  seedHonored,
  seedUpdatedinputWorkaround,
  seedUpdatedpermissionsDropped,
} from "./tumbler.mjs";

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
  return fileURLToPath(new URL("./tumbler.mjs", import.meta.url));
}

test("allow applied + chooser skipped + plan implements → honored", () => {
  const result = analyze({
    allowApplied: true,
    chooserSkipped: true,
    planImplemented: true,
    decisionDiscarded: false,
    chooserBlocks: false,
    updatedPermissionsDropped: false,
  });
  assert.equal(result.verdict, "honored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.discarded, false);
  assert.equal(result.honored, true);
  assert.equal(isHonored(result.ticket), true);
  assert.equal(isDiscarded(result.ticket), false);
});

test("hook allow + decision discarded + chooser blocks → discarded", () => {
  const result = analyze({
    hookEvent: "PermissionRequest",
    toolName: "ExitPlanMode",
    decisionBehavior: "allow",
    decisionDiscarded: true,
    chooserBlocks: true,
    allowApplied: false,
    updatedPermissionsDropped: true,
    chooserSkipped: false,
    planImplemented: false,
  });
  assert.equal(result.verdict, "discarded");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.discarded, true);
  assert.equal(isDiscarded(result.ticket), true);
  assert.ok(result.chips.includes("discarded"));
  assert.ok(result.chips.includes("chooser-blocks"));
  assert.ok(result.chips.includes("updatedpermissions-dropped"));
  assert.ok(!result.chips.includes("honored"));
});

test("idle honored is a hold; PermissionRequest allow applied", () => {
  const result = analyze(seedHonored());
  assert.equal(result.verdict, "honored");
  assert.equal(result.idleWord, "honored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.discarded, false);
  assert.equal(result.honored, true);
  assert.ok(result.chips.includes("honored"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("discarded"));
  assert.equal(result.ticket.allowApplied, true);
  assert.equal(result.ticket.chooserSkipped, true);
  assert.equal(result.ticket.planImplemented, true);
  assert.match(result.contrast.case, /honored/i);
  assert.doesNotMatch(
    result.idleWord,
    /jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|indexed|arrested|skipped/i,
  );
});

test("empty ticket and empty stdin classify honored", () => {
  assert.equal(classify(emptyTicket()), "honored");
  assert.equal(classify(""), "honored");
  assert.equal(classify(null), "honored");
  assert.equal(decideSeed("honored").verdict, "honored");
  assert.equal(decideSeed("open").verdict, "honored");
});

test("seeded discarded #74256 is alarm with chooser blocking and updatedPermissions dropped", () => {
  const result = analyze(seedDiscarded());
  assert.equal(result.verdict, "discarded");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.discarded, true);
  assert.ok(result.chips.includes("discarded"));
  assert.ok(result.chips.includes("chooser-blocks"));
  assert.ok(result.chips.includes("allow-ignored"));
  assert.ok(result.chips.includes("deny-still-works"));
  assert.ok(result.chips.includes("updatedpermissions-dropped"));
  assert.ok(result.chips.includes("docs-gap"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("honored"));
  assert.match(result.contrast.case, /discarded/i);
  assert.equal(result.ticket.decisionDiscarded, true);
  assert.equal(result.ticket.chooserBlocks, true);
  assert.equal(result.ticket.updatedPermissionsDropped, true);
  assert.equal(result.ticket.hookEvent, HOOK_EVENT);
  assert.equal(result.ticket.toolName, TOOL_NAME);
  assert.equal(result.ticket.lastGood, LAST_GOOD);
  assert.equal(result.ticket.firstBroken, FIRST_BROKEN);
});

test("data fixtures classify honored vs discarded vs named chips", () => {
  assert.equal(classify(readData("honored.json")), "honored");
  assert.equal(classify(readData("discarded.json")), "discarded");
  assert.equal(classify(readData("74256.json")), "discarded");
  assert.equal(classify(readData("chooser-blocks.json")), "chooser-blocks");
  assert.equal(classify(readData("allow-ignored.json")), "allow-ignored");
  assert.equal(classify(readData("deny-still-works.json")), "deny-still-works");
  assert.equal(classify(readData("updatedinput-workaround.json")), "updatedinput-workaround");
  assert.equal(classify(readData("updatedpermissions-dropped.json")), "updatedpermissions-dropped");
  assert.equal(classify(readData("docs-gap.json")), "docs-gap");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("version-bracket.json")), "discarded");
  assert.equal(classify(readData("exitplanmode.json")), "discarded");
});

test("discarded seed is alarm; honored / hold are holds", () => {
  assert.equal(score(seedDiscarded()).alarm, true);
  assert.equal(score(seedDiscarded()).hold, false);
  assert.equal(score(seedHonored()).hold, true);
  assert.equal(score(seedHonored()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedChooserBlocks()).alarm, true);
  assert.equal(score(seedUpdatedpermissionsDropped()).alarm, true);
});

test("normalize seeds 74256 without ticket fields", () => {
  const ticket = normalize({ issue: 74256 });
  assert.equal(ticket.decisionDiscarded, true);
  assert.equal(ticket.chooserBlocks, true);
  assert.equal(ticket.updatedPermissionsDropped, true);
  assert.equal(ticket.hookEvent, HOOK_EVENT);
  assert.equal(ticket.toolName, TOOL_NAME);
  assert.equal(classify(ticket), "discarded");
});

test("score / decide / handle agree on discarded vs honored", () => {
  assert.equal(score(seedDiscarded()).verdict, "discarded");
  assert.equal(decide(seedHonored()).verdict, "honored");
  const fail = handle(seedDiscarded());
  const hold = handle(seedHonored());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#74256/);
  assert.match(fail.hookSpecificOutput.additionalContext, /PermissionRequest/);
  assert.match(hold.hookSpecificOutput.additionalContext, /honored/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("discarded").verdict, "discarded");
  assert.equal(decideSeed(74256).verdict, "discarded");
  assert.equal(decideSeed("74256").verdict, "discarded");
  assert.equal(decideSeed("honored").verdict, "honored");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("chooser-blocks").verdict, "chooser-blocks");
  assert.equal(decideSeed("allow-ignored").verdict, "allow-ignored");
  assert.equal(decideSeed("deny-still-works").verdict, "deny-still-works");
  assert.equal(decideSeed("updatedinput-workaround").verdict, "updatedinput-workaround");
});

test("CLI scores data files", () => {
  const discarded = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/74256.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(discarded.status, 0, discarded.stderr);
  assert.equal(JSON.parse(discarded.stdout).verdict, "discarded");
  assert.equal(JSON.parse(discarded.stdout).alarm, true);

  const honored = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/honored.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(honored.status, 0, honored.stderr);
  assert.equal(JSON.parse(honored.stdout).verdict, "honored");
  assert.equal(JSON.parse(honored.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 74256);
  assert.deepEqual([...PRIMARY_ISSUES], [74256]);
  assert.equal(COUSIN_ISSUE, 90685);
  assert.deepEqual([...COUSINS], [90685, 71061, 50660, 84098, 89251]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-07-04T18:49:46Z");
  assert.equal(HOOK_EVENT, "PermissionRequest");
  assert.equal(TOOL_NAME, "ExitPlanMode");
  assert.equal(DECISION_ALLOW, "allow");
  assert.equal(CHOOSER_PROMPT, "Would you like to proceed?");
  assert.equal(SET_MODE, "setMode");
  assert.equal(ACCEPT_EDITS, "acceptEdits");
  assert.equal(UPDATED_PERMISSIONS, "updatedPermissions");
  assert.equal(UPDATED_INPUT, "updatedInput");
  assert.equal(HELLO_TXT, "hello.txt");
  assert.equal(LAST_GOOD, "2.1.198");
  assert.equal(FIRST_BROKEN, "2.1.199");
  assert.equal(ALSO_BROKEN, "2.1.201");
  assert.equal(STAFF_VERSION, "2.1.233");
  assert.equal(CONFIRMED_VERSION, "2.1.258");
  assert.equal(PLAN_MODE, "plan");
  assert.equal(PLATFORM, "macOS");
  assert.equal(REPORTER, "blimmer");
  assert.equal(STAFF, "bcherny");
  assert.equal(CONFIRMER, "jbeno");
  assert.equal(IDLE_WORD, "honored");
  assert.equal(SEEDED_WORD, "discarded");
  assert.notEqual(IDLE_WORD, "discarded");
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
  assert.notEqual(IDLE_WORD, "indexed");
  assert.notEqual(IDLE_WORD, "arrested");
  assert.notEqual(IDLE_WORD, "skipped");
  assert.deepEqual([...HOLD_VERDICTS], ["honored", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("discarded"));
  assert.ok(ALARM_VERDICTS.includes("chooser-blocks"));
  assert.ok(ALARM_VERDICTS.includes("updatedpermissions-dropped"));
  assert.ok(!ALARM_VERDICTS.includes("honored"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 10);
  assert.deepEqual(
    [...LABELS],
    [
      "bug",
      "documentation",
      "has repro",
      "platform:macos",
      "area:core",
      "area:hooks",
      "regression",
      "reproduced",
    ],
  );
  assert.match(TITLE, /PermissionRequest/);
  assert.match(TITLE, /ExitPlanMode/);
  assert.match(TITLE, /2\.1\.199/);
  assert.match(ISSUE_URL, /74256/);
  assert.match(PHRASE, /discards an allow/i);
  assert.match(PHRASE, /admit discarded/);
  assert.match(HUB_LINE, /13:50 tumbler/);
  assert.match(HUB_LINE, /admit discarded/);
  assert.match(MARK, /13:50/);
  assert.match(MARK, /#114/);
  assert.match(MARK, /#74256/);
  assert.match(CONTRAST_NOTE, /PermissionRequest/);
  assert.match(CONTRAST_NOTE, /ExitPlanMode/);
  assert.match(CONTRAST_NOTE, /decision\.behavior: "allow"/);
  assert.match(CONTRAST_NOTE, /Would you like to proceed/);
  assert.match(CONTRAST_NOTE, /2\.1\.198/);
  assert.match(CONTRAST_NOTE, /2\.1\.199/);
  assert.match(CONTRAST_NOTE, /2\.1\.258/);
  assert.match(CONTRAST_NOTE, /updatedPermissions/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("geneva"));
  assert.ok(NOT_PRODUCTS.includes("scotch"));
  assert.ok(NOT_PRODUCTS.includes("fibula"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("geneva-drive"));
  assert.ok(NOT_PRODUCTS.includes("maltese-cross"));
  assert.ok(BANNED_NAMES.includes("Geneva"));
  assert.ok(BANNED_NAMES.includes("Scotch"));
  assert.ok(BANNED_NAMES.includes("Escapement"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "honored");
  assert.equal(chips.seededWord, "discarded");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 74256);
  assert.equal(fp.cousin, 90685);
  assert.deepEqual(fp.cousins, [90685, 71061, 50660, 84098, 89251]);
  assert.equal(fp.hookEvent, "PermissionRequest");
  assert.equal(fp.toolName, "ExitPlanMode");
  assert.equal(fp.decisionAllow, "allow");
  assert.equal(fp.chooserPrompt, "Would you like to proceed?");
  assert.equal(fp.lastGood, "2.1.198");
  assert.equal(fp.firstBroken, "2.1.199");
  assert.equal(fp.confirmedVersion, "2.1.258");
  assert.equal(fp.staffVersion, "2.1.233");
  assert.equal(fp.reporter, "blimmer");
  assert.equal(fp.staff, "bcherny");
  assert.equal(fp.helloTxt, "hello.txt");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "discarded");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.decisionDiscarded, true);
});

test("chipsOf on a raw discarded allow ticket still marks discarded", () => {
  const chips = chipsOf({
    hookEvent: "PermissionRequest",
    toolName: "ExitPlanMode",
    decisionBehavior: "allow",
    decisionDiscarded: true,
    chooserBlocks: true,
    updatedPermissionsDropped: true,
    outputText:
      "discarded; #74256; PermissionRequest allow for ExitPlanMode silently discarded; chooser still blocks; Would you like to proceed?",
  });
  assert.ok(chips.includes("discarded"));
  assert.ok(chips.includes("chooser-blocks"));
  assert.ok(chips.includes("updatedpermissions-dropped"));
  assert.ok(!chips.includes("honored"));
});

test("cousin #90685 is not conflated with discarded primary", () => {
  assert.notEqual(classify(seedCousin()), "discarded");
  assert.notEqual(classify({ issue: 90685 }), "discarded");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /90685|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become discarded", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "discarded", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 74256);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedChooserBlocks()).verdict, "chooser-blocks");
  assert.equal(analyze(seedAllowIgnored()).verdict, "allow-ignored");
  assert.equal(analyze(seedDenyStillWorks()).verdict, "deny-still-works");
  assert.equal(analyze(seedUpdatedinputWorkaround()).verdict, "updatedinput-workaround");
  assert.equal(analyze(seedUpdatedpermissionsDropped()).verdict, "updatedpermissions-dropped");
  assert.equal(analyze(seedDocsGap()).verdict, "docs-gap");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.allowApplied, true);
  assert.equal(isDiscarded(seedHonored()), false);
  assert.equal(isDiscarded(seedDiscarded()), true);
});

test("living page is a Tumbler atelier, idle honored, seeded discarded", () => {
  const html = readPage();
  assert.match(html, /<title>Tumbler/);
  assert.match(html, /Idle word:\s*honored/);
  assert.match(html, /honored/);
  assert.match(html, /discarded/);
  assert.match(html, /chooser-blocks/);
  assert.match(html, /allow-ignored/);
  assert.match(html, /deny-still-works/);
  assert.match(html, /updatedinput-workaround/);
  assert.match(html, /updatedpermissions-dropped/);
  assert.match(html, /docs-gap/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#74256/);
  assert.match(html, /#90685/);
  assert.match(html, /#71061/);
  assert.match(html, /#50660/);
  assert.match(html, /#84098/);
  assert.match(html, /#89251/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /13:50/);
  assert.match(html, /catalog #114/);
  assert.match(html, /PermissionRequest/);
  assert.match(html, /ExitPlanMode/);
  assert.match(html, /decision\.behavior: "allow"/);
  assert.match(html, /Would you like to proceed/);
  assert.match(html, /2\.1\.198/);
  assert.match(html, /2\.1\.199/);
  assert.match(html, /2\.1\.233/);
  assert.match(html, /2\.1\.258/);
  assert.match(html, /updatedPermissions/);
  assert.match(html, /setMode/);
  assert.match(html, /acceptEdits/);
  assert.match(html, /updatedInput/);
  assert.match(html, /blimmer/);
  assert.match(html, /bcherny/);
  assert.match(html, /hello\.txt/);
  assert.match(html, /plan mode/i);
  assert.match(html, /family=Young\+Serif|Young Serif/);
  assert.match(html, /family=Figtree|Figtree/);
  assert.match(html, /family=Fragment\+Mono|Fragment Mono/);
  assert.match(html, /Score the keyway/);
  assert.match(html, /Pin idle honored/);
  assert.match(html, /Pin seeded discarded/);
  assert.match(html, /Admit discarded/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to honored/);
  assert.match(html, /pin-tumbler|keyway|shear line|strike plate|pin stacks|ward cuts/i);
  assert.match(html, /PERMISSIONREQUEST HOOK|SILENTLY DISCARDED|CHOOSER STILL BLOCKS/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*discarded/i);
  assert.doesNotMatch(html, /Idle word:\s*jumped/i);
  assert.doesNotMatch(html, /Idle word:\s*chocked/i);
  assert.doesNotMatch(html, /Idle word:\s*indexed/i);
  assert.doesNotMatch(html, /Idle word:\s*arrested/i);
  assert.doesNotMatch(html, /Idle word:\s*skipped/i);
  assert.doesNotMatch(html, /Pin idle discarded/);
  assert.doesNotMatch(html, /Pin idle jumped/);
  assert.doesNotMatch(html, /Pin idle indexed/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /Score the cross/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
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
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Tumbler, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Tumbler/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /PERMISSIONREQUEST HOOK RETURNS `allow` FOR `ExitPlanMode` BUT THE DECISION IS SILENTLY DISCARDED|CHOOSER STILL BLOCKS/i,
  );
  assert.match(readme, /NOT \*\*Geneva\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /NOT \*\*Scotch\*\*/);
  assert.match(readme, /NOT \*\*Fibula\*\*/);
  assert.match(readme, /NOT \*\*Virgule\*\*/);
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /Product name stays \*\*Tumbler\*\*/);
  assert.match(readme, /Idle word: \*\*honored\*\*/);
  assert.match(readme, /#90685/);
  assert.match(readme, /#71061/);
  assert.match(readme, /PermissionRequest/);
  assert.match(readme, /ExitPlanMode/);
  assert.match(readme, /decision\.behavior: "allow"/);
  assert.match(readme, /Would you like to proceed/);
  assert.match(readme, /2\.1\.198/);
  assert.match(readme, /2\.1\.199/);
  assert.match(readme, /2\.1\.258/);
  assert.match(readme, /updatedPermissions/);
  assert.match(readme, /updatedInput/);
  assert.match(readme, /blimmer/);
  assert.match(readme, /bcherny/);
  assert.match(readme, /hello\.txt/);
  assert.doesNotMatch(readme, /^# Escapement/m);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
});
