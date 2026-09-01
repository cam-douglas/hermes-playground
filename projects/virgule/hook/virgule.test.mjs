import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ARCH,
  BANNED_NAMES,
  CHANGELOG_247,
  CHANGELOG_250,
  CHIPS,
  CLI_VERSION,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DESKTOP_APP,
  DESKTOP_EMBEDDED,
  FEATURED_ISSUE,
  FILED_AT,
  FIRST_BAD,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INDEX_ZERO,
  INSTALL_246,
  INSTALL_247,
  INSTALL_255,
  ISSUE_URL,
  LABELS,
  LAST_GOOD,
  MARK,
  MID_MESSAGE_CARET,
  NOT_PRODUCTS,
  OS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SHELL,
  SKILLS_PATH,
  SURFACES,
  TITLE,
  TOKEN_SILENT,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isCased,
  isLiteral,
  normalize,
  score,
  seedCased,
  seedCousin,
  seedDiscoveryDead,
  seedHold,
  seedIndexZeroOnly,
  seedInvocationStillWorks,
  seedLineStartBroken,
  seedLiteral,
  seedMenuHealthyAtZero,
  seedMidMessageLiteral,
  seedRegression247,
  seedWordBoundaryExpected,
} from "./virgule.mjs";

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
  return fileURLToPath(new URL("./virgule.mjs", import.meta.url));
}

test("word-boundary menu open + no literal slash → cased", () => {
  const result = analyze({
    caretIndex: 0,
    menuOpens: true,
    slashLiteral: false,
    wordBoundary: true,
    lineStartBroken: false,
    menuHealthyAtZero: true,
    discoveryDead: false,
    invocationWorks: true,
    tokenSilent: true,
  });
  assert.equal(result.verdict, "cased");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.literal, false);
  assert.equal(result.cased, true);
  assert.equal(isCased(result.ticket), true);
  assert.equal(isLiteral(result.ticket), false);
});

test("mid-message literal slash + menu closed + index-zero-only → literal", () => {
  const result = analyze({
    caretIndex: 12,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: "2.1.246",
    firstBad: "2.1.247",
  });
  assert.equal(result.verdict, "literal");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.literal, true);
  assert.equal(isLiteral(result.ticket), true);
  assert.ok(result.chips.includes("literal"));
  assert.ok(result.chips.includes("index-zero-only"));
  assert.ok(result.chips.includes("mid-message-literal"));
  assert.ok(!result.chips.includes("cased"));
});

test("idle cased is a hold; word-boundary virgule opens the menu", () => {
  const result = analyze(seedCased());
  assert.equal(result.verdict, "cased");
  assert.equal(result.idleWord, "cased");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.literal, false);
  assert.equal(result.cased, true);
  assert.ok(result.chips.includes("cased"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("literal"));
  assert.equal(result.ticket.menuOpens, true);
  assert.equal(result.ticket.slashLiteral, false);
  assert.equal(result.ticket.discoveryDead, false);
  assert.match(result.contrast.case, /cased/i);
  assert.doesNotMatch(
    result.idleWord,
    /literal|jammed|sifted|stocked|aired|drained|hinged|pealed|warded|first-wins|seized|pooled/i,
  );
});

test("empty ticket and empty stdin classify cased", () => {
  assert.equal(classify(emptyTicket()), "cased");
  assert.equal(classify(""), "cased");
  assert.equal(classify(null), "cased");
  assert.equal(decideSeed("cased").verdict, "cased");
  assert.equal(decideSeed("seated").verdict, "cased");
});

test("seeded literal #91337 is alarm with index 0, mid-message, regression", () => {
  const result = analyze(seedLiteral());
  assert.equal(result.verdict, "literal");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.literal, true);
  assert.ok(result.chips.includes("literal"));
  assert.ok(result.chips.includes("index-zero-only"));
  assert.ok(result.chips.includes("mid-message-literal"));
  assert.ok(result.chips.includes("line-start-broken"));
  assert.ok(result.chips.includes("menu-healthy-at-zero"));
  assert.ok(result.chips.includes("discovery-dead"));
  assert.ok(result.chips.includes("invocation-still-works"));
  assert.ok(result.chips.includes("regression-2-1-247"));
  assert.ok(result.chips.includes("word-boundary-expected"));
  assert.ok(!result.chips.includes("cased"));
  assert.match(result.contrast.case, /literal/i);
  assert.equal(result.ticket.caretIndex, MID_MESSAGE_CARET);
  assert.equal(result.ticket.lastGood, LAST_GOOD);
  assert.equal(result.ticket.firstBad, FIRST_BAD);
  assert.equal(result.ticket.cliVersion, CLI_VERSION);
  assert.equal(result.ticket.desktopVersion, DESKTOP_EMBEDDED);
});

test("data fixtures classify cased vs literal vs named chips", () => {
  assert.equal(classify(readData("cased.json")), "cased");
  assert.equal(classify(readData("literal.json")), "literal");
  assert.equal(classify(readData("91337.json")), "literal");
  assert.equal(classify(readData("index-zero-only.json")), "index-zero-only");
  assert.equal(classify(readData("mid-message-literal.json")), "mid-message-literal");
  assert.equal(classify(readData("line-start-broken.json")), "line-start-broken");
  assert.equal(classify(readData("menu-healthy-at-zero.json")), "menu-healthy-at-zero");
  assert.equal(classify(readData("discovery-dead.json")), "discovery-dead");
  assert.equal(
    classify(readData("invocation-still-works.json")),
    "invocation-still-works",
  );
  assert.equal(classify(readData("regression-2-1-247.json")), "regression-2-1-247");
  assert.equal(
    classify(readData("word-boundary-expected.json")),
    "word-boundary-expected",
  );
  assert.equal(classify(readData("hold.json")), "hold");
});

test("literal seed is alarm; cased / hold are holds", () => {
  assert.equal(score(seedLiteral()).alarm, true);
  assert.equal(score(seedLiteral()).hold, false);
  assert.equal(score(seedCased()).hold, true);
  assert.equal(score(seedCased()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedIndexZeroOnly()).alarm, true);
  assert.equal(score(seedMidMessageLiteral()).alarm, true);
});

test("normalize seeds 91337 without ticket fields", () => {
  const ticket = normalize({ issue: 91337 });
  assert.equal(ticket.menuOpens, false);
  assert.equal(ticket.slashLiteral, true);
  assert.equal(ticket.indexZeroOnly, true);
  assert.equal(ticket.discoveryDead, true);
  assert.equal(ticket.invocationWorks, true);
  assert.equal(ticket.lastGood, LAST_GOOD);
  assert.equal(ticket.firstBad, FIRST_BAD);
  assert.equal(classify(ticket), "literal");
});

test("score / decide / handle agree on literal vs cased", () => {
  assert.equal(score(seedLiteral()).verdict, "literal");
  assert.equal(decide(seedCased()).verdict, "cased");
  const fail = handle(seedLiteral());
  const hold = handle(seedCased());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91337/);
  assert.match(hold.hookSpecificOutput.additionalContext, /cased/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("literal").verdict, "literal");
  assert.equal(decideSeed(91337).verdict, "literal");
  assert.equal(decideSeed("91337").verdict, "literal");
  assert.equal(decideSeed("cased").verdict, "cased");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("index-zero-only").verdict, "index-zero-only");
  assert.equal(decideSeed("mid-message-literal").verdict, "mid-message-literal");
  assert.equal(decideSeed("regression-2-1-247").verdict, "regression-2-1-247");
});

test("CLI scores data files", () => {
  const literal = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91337.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(literal.status, 0, literal.stderr);
  assert.equal(JSON.parse(literal.stdout).verdict, "literal");
  assert.equal(JSON.parse(literal.stdout).alarm, true);

  const cased = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/cased.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(cased.status, 0, cased.stderr);
  assert.equal(JSON.parse(cased.stdout).verdict, "cased");
  assert.equal(JSON.parse(cased.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91337);
  assert.deepEqual([...PRIMARY_ISSUES], [91337]);
  assert.equal(COUSIN_ISSUE, 48963);
  assert.deepEqual(
    [...COUSINS],
    [48963, 49148, 55173, 44488, 40413, 29752, 13073],
  );
  assert.equal(FILED_AT, "2026-09-01T22:31:58Z");
  assert.equal(LAST_GOOD, "2.1.246");
  assert.equal(FIRST_BAD, "2.1.247");
  assert.equal(CLI_VERSION, "2.1.257");
  assert.equal(DESKTOP_EMBEDDED, "2.1.255");
  assert.equal(DESKTOP_APP, "1.40609.1");
  assert.equal(PLATFORM, "macos");
  assert.equal(OS, "macOS 26.4");
  assert.equal(ARCH, "arm64");
  assert.equal(SHELL, "Terminal.app zsh");
  assert.equal(REPORTER, "MaksimCher");
  assert.equal(INDEX_ZERO, 0);
  assert.equal(MID_MESSAGE_CARET, 12);
  assert.deepEqual([...SURFACES], ["desktop", "cli"]);
  assert.deepEqual([...TOKEN_SILENT], ["src/utils", "and/or", "http://"]);
  assert.equal(SKILLS_PATH, "~/.claude/skills/");
  assert.equal(INSTALL_246, "2026-08-26");
  assert.equal(INSTALL_247, "2026-08-28");
  assert.equal(INSTALL_255, "2026-09-01");
  assert.match(CHANGELOG_247, /Fixed prompts beginning with `\/--`/);
  assert.match(CHANGELOG_250, /filterable Slash commands dialog/);
  assert.equal(IDLE_WORD, "cased");
  assert.equal(SEEDED_WORD, "literal");
  assert.notEqual(IDLE_WORD, "literal");
  assert.notEqual(IDLE_WORD, "jammed");
  assert.notEqual(IDLE_WORD, "sifted");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.notEqual(IDLE_WORD, "aired");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "first-wins");
  assert.notEqual(IDLE_WORD, "seized");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.deepEqual([...HOLD_VERDICTS], ["cased", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("literal"));
  assert.ok(ALARM_VERDICTS.includes("index-zero-only"));
  assert.ok(!ALARM_VERDICTS.includes("cased"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 11);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:tui", "regression", "area:skills"],
  );
  assert.match(TITLE, /no longer opens the slash-command menu mid-message/);
  assert.match(ISSUE_URL, /91337/);
  assert.match(PHRASE, /only strikes at index zero/i);
  assert.match(HUB_LINE, /08:50 virgule/);
  assert.match(HUB_LINE, /admit cased/);
  assert.match(MARK, /08:50/);
  assert.match(MARK, /#109/);
  assert.match(MARK, /#91337/);
  assert.match(CONTRAST_NOTE, /SLASH \/ SKILLS MENU TRIGGER BOUND TO MESSAGE INDEX 0 ONLY/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("riddle"));
  assert.ok(NOT_PRODUCTS.includes("garner"));
  assert.ok(NOT_PRODUCTS.includes("pintle"));
  assert.ok(BANNED_NAMES.includes("Slash"));
  assert.ok(BANNED_NAMES.includes("Riddle"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "cased");
  assert.equal(chips.seededWord, "literal");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91337);
  assert.equal(fp.cousin, 48963);
  assert.deepEqual(fp.cousins, [48963, 49148, 55173, 44488, 40413, 29752, 13073]);
  assert.equal(fp.lastGood, "2.1.246");
  assert.equal(fp.firstBad, "2.1.247");
  assert.equal(fp.cliVersion, "2.1.257");
  assert.equal(fp.desktopEmbedded, "2.1.255");
  assert.equal(fp.indexZero, 0);
  assert.deepEqual(fp.surfaces, ["desktop", "cli"]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "literal");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.indexZeroOnly, true);
});

test("chipsOf on a raw mid-message ticket still marks literal", () => {
  const chips = chipsOf({
    caretIndex: 12,
    menuOpens: false,
    slashLiteral: true,
    wordBoundary: true,
    lineStartBroken: true,
    menuHealthyAtZero: true,
    discoveryDead: true,
    invocationWorks: true,
    indexZeroOnly: true,
    midMessageLiteral: true,
    lastGood: "2.1.246",
    firstBad: "2.1.247",
    outputText:
      "literal; #91337; / mid-message inserts literal slash; menu only at index 0",
  });
  assert.ok(chips.includes("literal"));
  assert.ok(chips.includes("index-zero-only"));
  assert.ok(chips.includes("mid-message-literal"));
  assert.ok(chips.includes("discovery-dead"));
  assert.ok(!chips.includes("cased"));
});

test("cousin #48963 is not conflated with literal primary", () => {
  assert.notEqual(classify(seedCousin()), "literal");
  assert.notEqual(classify({ issue: 48963 }), "literal");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /48963|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become literal", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "literal", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91337);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedIndexZeroOnly()).verdict, "index-zero-only");
  assert.equal(analyze(seedMidMessageLiteral()).verdict, "mid-message-literal");
  assert.equal(analyze(seedLineStartBroken()).verdict, "line-start-broken");
  assert.equal(analyze(seedMenuHealthyAtZero()).verdict, "menu-healthy-at-zero");
  assert.equal(analyze(seedDiscoveryDead()).verdict, "discovery-dead");
  assert.equal(analyze(seedInvocationStillWorks()).verdict, "invocation-still-works");
  assert.equal(analyze(seedRegression247()).verdict, "regression-2-1-247");
  assert.equal(analyze(seedWordBoundaryExpected()).verdict, "word-boundary-expected");
  assert.equal(analyze(seedHold()).ticket.menuOpens, true);
  assert.equal(isLiteral(seedCased()), false);
  assert.equal(isLiteral(seedLiteral()), true);
});

test("living page is a Virgule stick, idle cased, seeded literal", () => {
  const html = readPage();
  assert.match(html, /<title>Virgule/);
  assert.match(html, /Idle word:\s*cased/);
  assert.match(html, /cased/);
  assert.match(html, /literal/);
  assert.match(html, /index-zero-only/);
  assert.match(html, /mid-message-literal/);
  assert.match(html, /line-start-broken/);
  assert.match(html, /menu-healthy-at-zero/);
  assert.match(html, /discovery-dead/);
  assert.match(html, /invocation-still-works/);
  assert.match(html, /regression-2-1-247/);
  assert.match(html, /word-boundary-expected/);
  assert.match(html, /#91337/);
  assert.match(html, /#48963/);
  assert.match(html, /#49148/);
  assert.match(html, /#55173/);
  assert.match(html, /#44488/);
  assert.match(html, /#40413/);
  assert.match(html, /#29752/);
  assert.match(html, /#13073/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /08:50/);
  assert.match(html, /catalog #109/);
  assert.match(html, /2\.1\.246/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /2\.1\.255/);
  assert.match(html, /2\.1\.257/);
  assert.match(html, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.match(html, /family=Work\+Sans|Work Sans/);
  assert.match(html, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.match(html, /Score the stick/);
  assert.match(html, /Pin idle cased/);
  assert.match(html, /Pin seeded literal/);
  assert.match(html, /Admit cased/);
  assert.match(html, /composing stick|type-case|lead sorts|vermilion/i);
  assert.match(html, /SLASH \/ SKILLS MENU TRIGGER BOUND TO MESSAGE INDEX 0 ONLY/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /word boundary/i);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*literal/i);
  assert.doesNotMatch(html, /Idle word:\s*jammed/i);
  assert.doesNotMatch(html, /Idle word:\s*sifted/i);
  assert.doesNotMatch(html, /Idle word:\s*stocked/i);
  assert.doesNotMatch(html, /Idle word:\s*aired/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*hinged/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*first-wins/i);
  assert.doesNotMatch(html, /Idle word:\s*seized/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Pin idle literal/);
  assert.doesNotMatch(html, /Pin idle jammed/);
  assert.doesNotMatch(html, /Pin idle sifted/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
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

test("README and page stay Virgule, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Virgule/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /SLASH \/ SKILLS MENU TRIGGER BOUND TO MESSAGE INDEX 0 ONLY/,
  );
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /Product name stays \*\*Virgule\*\*/);
  assert.match(readme, /Idle word: \*\*cased\*\*/);
  assert.match(readme, /#48963/);
  assert.match(readme, /#49148/);
  assert.match(readme, /#55173/);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
});
