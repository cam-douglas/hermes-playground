import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  APP_VERSION,
  CHIPS,
  CONTRAST_NOTE,
  DATA_FORK_BYTES,
  ENGINE,
  FEATURED_ISSUE,
  FILED_AT,
  FINDERINFO_BYTES,
  FORBIDDEN_IDLE,
  GET_PR_CHECKS,
  GIT_ERROR,
  HISTORY_BURSTS,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  ICNS_OFFSET,
  ICON_NAME,
  IDLE_WORD,
  ISSUE_URL,
  KHAS_BYTE,
  KHAS_CUSTOM_ICON,
  LABELS,
  LOCAL_SESSIONS,
  MARK,
  NOT_PRODUCTS,
  PDF_ERROR,
  PHRASE,
  PRIMARY_ISSUES,
  PROVENANCE_KEY,
  REPORTER,
  RESOURCE_FORK_BYTES,
  SAME_CLASS,
  SEEDED_WORD,
  STAMP_COUNT,
  STAMP_END,
  STAMP_START,
  TITLE,
  UPDATE_DAY,
  VENV_FILES,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedPlain,
  seedSmutched,
} from "./smutch.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./smutch.mjs", import.meta.url));
}

test("idle plain is a hold; folder unmarked", () => {
  const result = analyze(seedPlain());
  assert.equal(result.verdict, "plain");
  assert.equal(result.idleWord, "plain");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.smutched, false);
  assert.ok(result.chips.includes("plain"));
  assert.ok(!result.chips.includes("smutched"));
  assert.ok(!result.chips.includes("icon-r"));
  assert.doesNotMatch(
    result.idleWord,
    /smutch|smutched|icon|stamp|provenance|crawl|bitting|seated|bound|hallmarked|pointed|collapsed|spoiled|banked|misstruck|hunting|traced/i,
  );
});

test("empty ticket and empty stdin classify plain", () => {
  assert.equal(classify(emptyTicket()), "plain");
  assert.equal(classify(""), "plain");
  assert.equal(classify(null), "plain");
  assert.equal(decideSeed("plain").verdict, "plain");
});

test("seeded smutched #90993 is alarm with the blotter chips", () => {
  const result = analyze(seedSmutched());
  assert.equal(result.verdict, "smutched");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("smutched"));
  assert.ok(result.chips.includes("icon-r"));
  assert.ok(result.chips.includes("zero-byte"));
  assert.ok(result.chips.includes("resource-fork"));
  assert.ok(result.chips.includes("finderinfo"));
  assert.ok(result.chips.includes("khas-custom-icon"));
  assert.ok(result.chips.includes("home-icon"));
  assert.ok(result.chips.includes("provenance-key"));
  assert.ok(result.chips.includes("git-refs-poison"));
  assert.ok(result.chips.includes("venv-poison"));
  assert.ok(result.chips.includes("local-sessions-crawl"));
  assert.ok(result.chips.includes("icns-identical"));
  assert.ok(result.chips.includes("continuous-crawl"));
  assert.ok(!result.chips.includes("plain"));
  assert.match(result.contrast.blotter, /home-folder stain/);
  assert.match(result.contrast.specimen, /163,057/);
  assert.match(result.contrast.poison, /refs\/Icon/);
  assert.match(result.contrast.crawl, /20,000/);
});

test("data fixtures classify plain vs smutched vs named chips", () => {
  assert.equal(classify(readData("plain.json")), "plain");
  assert.equal(classify(readData("smutched.json")), "smutched");
  assert.equal(classify(readData("90993.json")), "smutched");
  assert.equal(classify(readData("icon-r.json")), "icon-r");
  assert.equal(classify(readData("zero-byte.json")), "zero-byte");
  assert.equal(classify(readData("resource-fork.json")), "resource-fork");
  assert.equal(classify(readData("finderinfo.json")), "finderinfo");
  assert.equal(classify(readData("khas-custom-icon.json")), "khas-custom-icon");
  assert.equal(classify(readData("home-icon.json")), "home-icon");
  assert.equal(classify(readData("provenance-key.json")), "provenance-key");
  assert.equal(classify(readData("git-refs-poison.json")), "git-refs-poison");
  assert.equal(classify(readData("venv-poison.json")), "venv-poison");
  assert.equal(classify(readData("local-sessions-crawl.json")), "local-sessions-crawl");
  assert.equal(classify(readData("icns-identical.json")), "icns-identical");
  assert.equal(classify(readData("continuous-crawl.json")), "continuous-crawl");
});

test("smutched seed is alarm; plain seed is hold", () => {
  assert.equal(score(seedSmutched()).alarm, true);
  assert.equal(score(seedSmutched()).hold, false);
  assert.equal(score(seedPlain()).hold, true);
  assert.equal(score(seedPlain()).alarm, false);
});

test("normalize seeds 90993 without ticket fields", () => {
  const ticket = normalize({ issue: 90993 });
  assert.equal(ticket.iconR, true);
  assert.equal(ticket.resourceFork, true);
  assert.equal(ticket.homeIcon, true);
  assert.equal(ticket.provenanceKey, true);
  assert.equal(ticket.gitRefsPoison, true);
  assert.equal(classify(ticket), "smutched");
});

test("score / decide / handle agree on smutched vs plain", () => {
  assert.equal(score(seedSmutched()).verdict, "smutched");
  assert.equal(decide(seedPlain()).verdict, "plain");
  const fail = handle(seedSmutched());
  const hold = handle(seedPlain());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90993/);
  assert.match(hold.hookSpecificOutput.additionalContext, /plain/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("smutched").verdict, "smutched");
  assert.equal(decideSeed(90993).verdict, "smutched");
  assert.equal(decideSeed("90993").verdict, "smutched");
  assert.equal(decideSeed("plain").verdict, "plain");
});

test("CLI scores data files", () => {
  const smutched = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/smutched.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(smutched.status, 0, smutched.stderr);
  assert.equal(JSON.parse(smutched.stdout).verdict, "smutched");

  const plain = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/plain.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(plain.status, 0, plain.stderr);
  assert.equal(JSON.parse(plain.stdout).verdict, "plain");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90993);
  assert.deepEqual([...PRIMARY_ISSUES], [90993]);
  assert.deepEqual([...SAME_CLASS], [90996]);
  assert.deepEqual([...HISTORY_BURSTS], ["2026-05-11", "2026-07-27"]);
  assert.equal(REPORTER, "gme1204");
  assert.equal(FILED_AT, "2026-08-31T13:40:42Z");
  assert.equal(APP_VERSION, "1.40609.0");
  assert.equal(ENGINE, "2.1.247");
  assert.equal(UPDATE_DAY, "2026-08-27");
  assert.equal(ICON_NAME, "Icon\\r");
  assert.equal(DATA_FORK_BYTES, 0);
  assert.equal(FINDERINFO_BYTES, 32);
  assert.equal(RESOURCE_FORK_BYTES, 163057);
  assert.equal(ICNS_OFFSET, 260);
  assert.equal(KHAS_CUSTOM_ICON, 0x04);
  assert.equal(KHAS_BYTE, 8);
  assert.equal(STAMP_COUNT, 20000);
  assert.equal(STAMP_START, "2026-08-28 15:44");
  assert.equal(STAMP_END, "2026-08-31 09:35");
  assert.equal(PROVENANCE_KEY, "01 02 00 52 3B A0 18 62 9D 1B 4C");
  assert.equal(GIT_ERROR, "fatal: bad object refs/Icon");
  assert.equal(VENV_FILES, 3689);
  assert.equal(PDF_ERROR, "no FontName found ... /fonts//standard/Icon");
  assert.equal(LOCAL_SESSIONS, "LocalSessions");
  assert.equal(GET_PR_CHECKS, "getPrChecks");
  assert.equal(IDLE_WORD, "plain");
  assert.equal(SEEDED_WORD, "smutched");
  assert.notEqual(IDLE_WORD, "smutched");
  assert.notEqual(IDLE_WORD, "smutch");
  assert.notEqual(IDLE_WORD, "icon");
  assert.deepEqual([...HOLD_VERDICTS], ["plain"]);
  assert.ok(ALARM_VERDICTS.includes("smutched"));
  assert.ok(!ALARM_VERDICTS.includes("plain"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 14);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:macos", "area:desktop"],
  );
  assert.match(TITLE, /0-byte Icon/);
  assert.match(ISSUE_URL, /90993/);
  assert.match(PHRASE, /home-folder Icon\\r on every crate is not a hold/i);
  assert.match(HUB_LINE, /23:50 smutch/);
  assert.match(HUB_LINE, /admit plain/);
  assert.match(MARK, /23:50/);
  assert.match(MARK, /#97/);
  assert.match(MARK, /#90993/);
  assert.match(CONTRAST_NOTE, /RESOURCE-FORK STAMP/);
  assert.match(HYPOTHESIS_NOTE, /dirty mark or stain/);
  assert.ok(NOT_PRODUCTS.includes("bitting"));
  assert.ok(NOT_PRODUCTS.includes("puncheon"));
  assert.ok(NOT_PRODUCTS.includes("gnomon"));
  assert.ok(NOT_PRODUCTS.includes("spoil"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "plain");
  assert.equal(chips.seededWord, "smutched");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90993);
  assert.equal(fp.resourceForkBytes, 163057);
  assert.equal(fp.stampCount, 20000);
  assert.equal(fp.venvFiles, 3689);
  assert.equal(fp.provenance, "01 02 00 52 3B A0 18 62 9D 1B 4C");
  assert.equal(fp.gitError, "fatal: bad object refs/Icon");
  assert.deepEqual(fp.sameClass, [90996]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 4);
  assert.equal(fixtures.rows[0].path, ".git/refs/");
  assert.equal(fixtures.rows[1].error, "fatal: bad object refs/Icon");
  assert.equal(fixtures.rows[2].venvFiles, 3689);
  assert.equal(fixtures.narrativeNotFixture.stampCount, 20000);
});

test("chipsOf on a raw smutched ticket still marks git-refs-poison", () => {
  const chips = chipsOf({
    iconR: true,
    zeroByte: true,
    resourceFork: true,
    finderInfo: true,
    kHasCustomIcon: true,
    homeIcon: true,
    provenanceKey: true,
    gitRefsPoison: true,
    venvPoison: true,
    localSessionsCrawl: true,
    icnsIdentical: true,
    continuousCrawl: true,
    plainHold: false,
    outputText:
      "0-byte Icon\\r; ResourceFork 163057; fatal: bad object refs/Icon; 3689 files in venvs; LocalSessions refresh / getPrChecks; crawling day and night; icns at offset 260",
  });
  assert.ok(chips.includes("smutched"));
  assert.ok(chips.includes("git-refs-poison"));
  assert.ok(chips.includes("venv-poison"));
  assert.ok(chips.includes("resource-fork"));
  assert.ok(!chips.includes("plain"));
});

test("named git-refs-poison is not a full smutched crawl", () => {
  const result = analyze({
    seed: "git-refs-poison",
    gitRefsPoison: true,
    iconR: false,
    resourceFork: false,
    homeIcon: false,
    provenanceKey: false,
    plainHold: false,
    outputText: "fatal: bad object refs/Icon",
  });
  assert.notEqual(result.verdict, "smutched");
  assert.equal(result.verdict, "git-refs-poison");
  assert.ok(result.reasons.some((row) => /refs\/Icon/i.test(row)));
});

test("living page is a binder smutch bench, idle plain, seeded smutched", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*plain/);
  assert.match(html, /plain/);
  assert.match(html, /smutched/);
  assert.match(html, /icon-r/);
  assert.match(html, /zero-byte/);
  assert.match(html, /resource-fork/);
  assert.match(html, /finderinfo/);
  assert.match(html, /khas-custom-icon/);
  assert.match(html, /home-icon/);
  assert.match(html, /provenance-key/);
  assert.match(html, /git-refs-poison/);
  assert.match(html, /venv-poison/);
  assert.match(html, /local-sessions-crawl/);
  assert.match(html, /icns-identical/);
  assert.match(html, /continuous-crawl/);
  assert.match(html, /#90993/);
  assert.match(html, /#90996/);
  assert.match(html, /23:50/);
  assert.match(html, /catalog #97/);
  assert.match(html, /gme1204/);
  assert.match(html, /163,?057/);
  assert.match(html, /20,?000/);
  assert.match(html, /01 02 00 52 3B A0 18 62 9D 1B 4C/);
  assert.match(html, /fatal: bad object refs\/Icon/);
  assert.match(html, /3689|3,689/);
  assert.match(html, /Fraunces/);
  assert.match(html, /DM\+Sans|DM Sans/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the smutch/);
  assert.match(html, /Pin idle plain/);
  assert.match(html, /Pin seeded smutched/);
  assert.match(html, /Admit plain/);
  assert.match(html, /smutch/i);
  assert.match(html, /blotter/i);
  assert.match(html, /binder/i);
  assert.match(html, /Icon\\r|Icon\\\\r/);
  assert.match(html, /kHasCustomIcon/);
  assert.match(html, /LocalSessions/);
  assert.doesNotMatch(html, /Idle word:\s*smutched/i);
  assert.doesNotMatch(html, /Idle word:\s*smutch(?!e)/i);
  assert.doesNotMatch(html, /Idle word:\s*seated/);
  assert.doesNotMatch(html, /Idle word:\s*bound/);
  assert.doesNotMatch(html, /Idle word:\s*hallmarked/);
  assert.doesNotMatch(html, /Idle word:\s*pointed/);
  assert.doesNotMatch(html, /Idle word:\s*collapsed/);
  assert.doesNotMatch(html, /Idle word:\s*banked/);
  assert.doesNotMatch(html, /Pin idle seated/);
  assert.doesNotMatch(html, /Pin seeded bound/);
  assert.doesNotMatch(html, /Score the bitting/);
  assert.doesNotMatch(html, /Score the gold/);
  assert.doesNotMatch(html, /Score the gnomon/);
  assert.doesNotMatch(html, /Score the spoil/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /family=Libre\+Bodoni/);
  assert.doesNotMatch(html, /family=Figtree/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Sans/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Instrument/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /goldsmith/);
  assert.doesNotMatch(html, /observatory/i);
  assert.doesNotMatch(html, /sundial/i);
  assert.doesNotMatch(html, /spoil tip/i);
  assert.doesNotMatch(html, /drafting trammel/i);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /felt-green/);
  assert.doesNotMatch(html, /pin-tumbler/);
});
