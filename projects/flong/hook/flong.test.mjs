import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CHIPS,
  CLAUDE_VERSION,
  CODEX_CROSS,
  CODEX_URL,
  EXIT_CODE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  GIT_PATH,
  GIT_VERSION,
  HOLD_VERDICTS,
  HUB_LINE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  OLDER_BYTES,
  OLDER_VERSION,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  STRUCK_FLONG,
  TITLE,
  TORN_BYTES,
  TORN_FLONG,
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
  seedStruck,
  seedTorn,
  walkSnapshot,
} from "./flong.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./flong.mjs", import.meta.url));
}

test("idle struck is a small valid flong; proof clean", () => {
  const result = analyze(seedStruck());
  assert.equal(result.verdict, "struck");
  assert.equal(result.idleWord, "struck");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.torn, false);
  assert.ok(result.chips.includes("struck"));
  assert.ok(result.walk.pathHolds);
  assert.equal(result.walk.parseFail, false);
  assert.equal(result.walk.midToken, false);
  assert.equal(result.smash, null);
  assert.doesNotMatch(result.idleWord, /flong|foundry|chase|proof|mold|stereotype|snapshot|bash/i);
});

test("empty ticket and empty stdin classify struck", () => {
  assert.equal(classify(emptyTicket()), "struck");
  assert.equal(classify(""), "struck");
  assert.equal(classify(null), "struck");
  assert.equal(decideSeed("struck").verdict, "struck");
});

test("seeded torn #90916 is parse-fail / mid-token / dangling-comment / eval-replay", () => {
  const result = analyze(seedTorn());
  assert.equal(result.verdict, "torn");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("torn"));
  assert.ok(result.chips.includes("parse-fail"));
  assert.ok(result.chips.includes("exit-127"));
  assert.ok(result.chips.includes("git-complete"));
  assert.ok(result.chips.includes("eval-replay"));
  assert.ok(result.chips.includes("mid-token"));
  assert.ok(result.chips.includes("dangling-comment"));
  assert.ok(result.chips.includes("byte-identical"));
  assert.ok(result.chips.includes("builtins-dead"));
  assert.ok(result.chips.includes("interactive-ok"));
  assert.ok(result.chips.includes("source-killed"));
  assert.equal(result.walk.bisect.line, 2);
  assert.equal(result.walk.bisect.kind, "mid-token");
  assert.equal(result.walk.bashN.line, 9);
  assert.match(result.walk.bashN.message, /unexpected token '\('/);
  assert.equal(result.walk.pathHolds, true);
  assert.equal(result.walk.danglingComment, true);
  assert.equal(result.walk.evalReplay, true);
  assert.equal(result.contrast.claude, "source");
  assert.equal(result.contrast.codex, "discard");
  assert.equal(result.contrast.claudeExit, 127);
});

test("data fixtures classify struck vs torn", () => {
  assert.equal(classify(readData("struck.json")), "struck");
  assert.equal(classify(readData("torn.json")), "torn");
  assert.equal(classify(readData("90916.json")), "torn");
  assert.equal(classify(readData("parse-fail.json")), "torn");
  assert.equal(classify(readData("mid-token.json")), "torn");
  assert.equal(classify(readData("dangling-comment.json")), "torn");
  assert.equal(classify(readData("eval-replay.json")), "torn");
  assert.equal(classify(readData("git-complete.json")), "torn");
  assert.equal(classify(readData("exit-127.json")), "torn");
  assert.equal(classify(readData("byte-identical.json")), "torn");
  assert.equal(classify(readData("builtins-dead.json")), "torn");
  assert.equal(classify(readData("interactive-ok.json")), "torn");
  assert.equal(classify(readData("source-killed.json")), "torn");
});

test("mid-token fixture lights line 2; PATH on line 1 holds", () => {
  const walk = walkSnapshot(readData("mid-token.json").snapshot);
  assert.equal(walk.pathHolds, true);
  assert.equal(walk.midToken, true);
  assert.equal(walk.bisect.line, 2);
});

test("dangling-comment fixture keeps the Shadow pkill tail", () => {
  const result = analyze(readData("dangling-comment.json"));
  assert.equal(result.verdict, "torn");
  assert.ok(result.walk.danglingComment);
  assert.ok(result.chips.includes("dangling-comment"));
});

test("eval-replay fixture names git-complete plates", () => {
  const result = analyze(readData("eval-replay.json"));
  assert.ok(result.walk.evalReplay);
  assert.ok(result.chips.includes("eval-replay"));
  assert.ok(result.chips.includes("git-complete"));
});

test("struck flong bytes stay tiny; torn fixture is not 65284 of git-completion", () => {
  const struck = walkSnapshot(STRUCK_FLONG);
  const torn = walkSnapshot(TORN_FLONG);
  assert.ok(struck.bytes < 200);
  assert.ok(torn.bytes < 800);
  assert.notEqual(torn.bytes, TORN_BYTES);
  assert.equal(TORN_BYTES, 65284);
  assert.equal(OLDER_BYTES, 84178);
});

test("normalize seeds 90916 without a snapshot body", () => {
  const ticket = normalize({ issue: 90916 });
  assert.equal(ticket.snapshot, TORN_FLONG);
  assert.equal(classify(ticket), "torn");
});

test("score / decide / handle agree on torn vs struck", () => {
  assert.equal(score(seedTorn()).verdict, "torn");
  assert.equal(decide(seedStruck()).verdict, "struck");
  const fail = handle(seedTorn());
  const hold = handle(seedStruck());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90916/);
  assert.match(hold.hookSpecificOutput.additionalContext, /struck/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("torn").verdict, "torn");
  assert.equal(decideSeed(90916).verdict, "torn");
  assert.equal(decideSeed("90916").verdict, "torn");
  assert.equal(decideSeed("struck").verdict, "struck");
});

test("CLI scores data files", () => {
  const torn = spawnSync(process.execPath, [hookPath(), fileURLToPath(new URL("../data/torn.json", import.meta.url))], {
    encoding: "utf8",
  });
  assert.equal(torn.status, 0, torn.stderr);
  const tornJson = JSON.parse(torn.stdout);
  assert.equal(tornJson.verdict, "torn");

  const struck = spawnSync(process.execPath, [hookPath(), fileURLToPath(new URL("../data/struck.json", import.meta.url))], {
    encoding: "utf8",
  });
  assert.equal(struck.status, 0, struck.stderr);
  assert.equal(JSON.parse(struck.stdout).verdict, "struck");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90916);
  assert.deepEqual([...PRIMARY_ISSUES], [90916]);
  assert.deepEqual([...SAME_CLASS], [15128, 16377, 61293, 19053]);
  assert.deepEqual([...CODEX_CROSS], [36589]);
  assert.equal(REPORTER, "LefRT");
  assert.equal(FILED_AT, "2026-08-31T06:54:06Z");
  assert.equal(CLAUDE_VERSION, "2.1.251");
  assert.equal(OLDER_VERSION, "2.1.226");
  assert.equal(GIT_VERSION, "2.53");
  assert.equal(GIT_PATH, "D:\\Program Files\\Git");
  assert.equal(EXIT_CODE, 127);
  assert.equal(IDLE_WORD, "struck");
  assert.equal(SEEDED_WORD, "torn");
  assert.deepEqual([...HOLD_VERDICTS], ["struck"]);
  assert.ok(ALARM_VERDICTS.includes("torn"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:windows", "area:bash"]);
  assert.match(TITLE, /corrupted shell snapshot/);
  assert.match(ISSUE_URL, /90916/);
  assert.match(CODEX_URL, /36589/);
  assert.match(PHRASE, /torn flong is not a hold/i);
  assert.match(HUB_LINE, /16:50 flong/);
  assert.match(MARK, /16:50/);
  assert.match(MARK, /#90/);
  assert.match(MARK, /#90916/);
  assert.ok(NOT_PRODUCTS.includes("bulla"));
  assert.ok(NOT_PRODUCTS.includes("trompe"));
  assert.ok(NOT_PRODUCTS.includes("davy"));
  assert.ok(NOT_PRODUCTS.includes("slype"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "struck");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90916);
  assert.equal(fp.tornBytes, 65284);
  const contrast = readData("contrast.json");
  assert.equal(contrast.claude.policy, "source");
  assert.equal(contrast.codex.policy, "discard");
});

test("living page is a foundry desk, idle struck, seeded torn", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*struck/);
  assert.match(html, /struck/);
  assert.match(html, /torn/);
  assert.match(html, /parse-fail/);
  assert.match(html, /exit-127/);
  assert.match(html, /git-complete/);
  assert.match(html, /eval-replay/);
  assert.match(html, /mid-token/);
  assert.match(html, /dangling-comment/);
  assert.match(html, /byte-identical/);
  assert.match(html, /builtins-dead/);
  assert.match(html, /interactive-ok/);
  assert.match(html, /source-killed/);
  assert.match(html, /#90916/);
  assert.match(html, /#15128/);
  assert.match(html, /#16377/);
  assert.match(html, /#61293/);
  assert.match(html, /#19053/);
  assert.match(html, /36589/);
  assert.match(html, /16:50/);
  assert.match(html, /catalog #90/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /2\.1\.226/);
  assert.match(html, /LefRT/);
  assert.match(html, /65284/);
  assert.match(html, /84178/);
  assert.match(html, /Fraunces/);
  assert.match(html, /Barlow/);
  assert.match(html, /Spline/);
  assert.match(html, /Pull a proof/);
  assert.match(html, /Shadow pkill/);
  assert.match(html, /__git_/);
  assert.match(html, /discard/i);
  assert.match(html, /source/i);
  assert.doesNotMatch(html, /Idle word:\s*flong/i);
  assert.doesNotMatch(html, /Idle word:\s*sealed/);
  assert.doesNotMatch(html, /Idle word:\s*blown/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Special\+Elite/);
  assert.doesNotMatch(html, /papal/);
  assert.doesNotMatch(html, /gilt frame/);
  assert.doesNotMatch(html, /brass gauze/);
  assert.doesNotMatch(html, /cloister/);
  assert.doesNotMatch(html, /vk_swiftshader/);
});

test("chipsOf on a raw torn snapshot still marks builtins-dead", () => {
  const walk = walkSnapshot(TORN_FLONG);
  const chips = chipsOf({ interactiveOk: true, byteIdentical: false }, walk);
  assert.ok(chips.includes("torn"));
  assert.ok(chips.includes("builtins-dead"));
  assert.ok(!chips.includes("byte-identical"));
});
