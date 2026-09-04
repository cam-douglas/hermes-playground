import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AFTER_REWRITE_READ,
  AFTER_REWRITE_WRITE,
  BANNED_NAMES,
  CHIPS,
  CLI_VERSION,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  FULL_REWRITE_READ_MAX,
  FULL_REWRITE_WRITE_MIN,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  MODEL,
  NOT_PRODUCTS,
  PARALLEL_AGENTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  REQUEST_IDS,
  REWRITE_COUNT,
  REWRITE_TOKENS,
  SEEDED_WORD,
  SYSTEM_PREFIX,
  TITLE,
  TTL_BUCKET,
  TTL_SECONDS,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isBanked,
  isRewritten,
  nearSystemPrefix,
  normalize,
  rewritePattern,
  score,
  seedBanked,
  seedHold,
  seedRewritten,
  seedSystemPrefix,
} from "./ephemera.mjs";

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
  return fileURLToPath(new URL("./ephemera.mjs", import.meta.url));
}

test("large cache_read + small ephemeral_5m → banked", () => {
  const result = analyze({
    persistHold: true,
    banked: true,
    rewritten: false,
    firstCall: false,
    call: 9,
    cache_read_input_tokens: 304655,
    cache_creation: { ephemeral_5m_input_tokens: 1595 },
  });
  assert.equal(result.verdict, "banked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rewritten, false);
  assert.equal(result.banked, true);
  assert.equal(isBanked(result.ticket), true);
  assert.equal(isRewritten(result.ticket), false);
});

test("huge ephemeral_5m + cache_read ≈ system prefix on a non-first call → rewritten", () => {
  const result = analyze({
    persistHold: false,
    banked: false,
    rewritten: true,
    firstCall: false,
    call: 8,
    cache_read_input_tokens: SYSTEM_PREFIX,
    cache_creation: { ephemeral_5m_input_tokens: 213484 },
    ttlBucket: "5m",
    model: "claude-fable-5-1",
  });
  assert.equal(result.verdict, "rewritten");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.rewritten, true);
  assert.equal(isRewritten(result.ticket), true);
  assert.ok(result.chips.includes("rewritten"));
  assert.ok(result.chips.includes("ephemeral-5m"));
  assert.ok(result.chips.includes("system-prefix"));
  assert.ok(!result.chips.includes("banked"));
});

test("usage-shaped payload without seed flags still scores rewritten", () => {
  const result = analyze({
    call: 14,
    firstCall: false,
    cache_read_input_tokens: 33578,
    cache_creation: { ephemeral_5m_input_tokens: 431885 },
  });
  assert.equal(result.verdict, "rewritten");
  assert.equal(rewritePattern(result.ticket), true);
  assert.equal(nearSystemPrefix(33578), true);
  assert.equal(nearSystemPrefix(0), true);
  assert.equal(nearSystemPrefix(304655), false);
});

test("idle banked is a hold; the wick banks", () => {
  const result = analyze(seedBanked());
  assert.equal(result.verdict, "banked");
  assert.equal(result.idleWord, "banked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rewritten, false);
  assert.ok(result.chips.includes("banked"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("rewritten"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.cache_read_input_tokens, AFTER_REWRITE_READ);
  assert.equal(result.ticket.cache_creation_input_tokens, AFTER_REWRITE_WRITE);
  assert.doesNotMatch(
    result.idleWord,
    /keyed|strayed|scrubbed|pulled|enacted|withheld|masked|bled|crossed|homed|slipped|fouled|mangled|verbatim|unbolted|snagged/i,
  );
});

test("empty ticket and empty stdin classify banked", () => {
  assert.equal(classify(emptyTicket()), "banked");
  assert.equal(classify(""), "banked");
  assert.equal(classify(null), "banked");
  assert.equal(decideSeed("banked").verdict, "banked");
  assert.equal(decideSeed("open").verdict, "banked");
});

test("seeded rewritten #92090 is alarm with wick and folio chips", () => {
  const result = analyze(seedRewritten());
  assert.equal(result.verdict, "rewritten");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("rewritten"));
  assert.ok(result.chips.includes("ephemeral-5m"));
  assert.ok(result.chips.includes("cache-creation"));
  assert.ok(result.chips.includes("cache-read"));
  assert.ok(result.chips.includes("fable-5-1"));
  assert.ok(result.chips.includes("parallel-eight"));
  assert.ok(!result.chips.includes("banked"));
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, CLI_VERSION);
  assert.equal(result.ticket.model, MODEL);
  assert.equal(result.ticket.requestId, REQUEST_IDS[0]);
});

test("data fixtures classify banked vs rewritten vs named chips", () => {
  assert.equal(classify(readData("banked.json")), "banked");
  assert.equal(classify(readData("rewritten.json")), "rewritten");
  assert.equal(classify(readData("92090.json")), "rewritten");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("ephemeral-5m.json")), "ephemeral-5m");
  assert.equal(classify(readData("system-prefix.json")), "system-prefix");
  assert.equal(classify(readData("cache-creation.json")), "cache-creation");
  assert.equal(classify(readData("cache-read.json")), "cache-read");
  assert.equal(classify(readData("fable-5-1.json")), "fable-5-1");
  assert.equal(classify(readData("parallel-eight.json")), "parallel-eight");
});

test("rewritten seed is alarm; banked / hold are holds", () => {
  assert.equal(score(seedRewritten()).alarm, true);
  assert.equal(score(seedRewritten()).hold, false);
  assert.equal(score(seedBanked()).hold, true);
  assert.equal(score(seedBanked()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedSystemPrefix()).alarm, true);
});

test("normalize seeds 92090 without ticket fields", () => {
  const ticket = normalize({ issue: 92090 });
  assert.equal(ticket.rewritten, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "rewritten");
});

test("score / decide / handle agree on rewritten vs banked", () => {
  assert.equal(score(seedRewritten()).verdict, "rewritten");
  assert.equal(decide(seedBanked()).verdict, "banked");
  const fail = handle(seedRewritten());
  const hold = handle(seedBanked());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92090/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /ephemeral_5m|five-minute|wick|folio/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /banked/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("rewritten").verdict, "rewritten");
  assert.equal(decideSeed(92090).verdict, "rewritten");
  assert.equal(decideSeed("92090").verdict, "rewritten");
  assert.equal(decideSeed("banked").verdict, "banked");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("ephemeral-5m").verdict, "ephemeral-5m");
  assert.equal(decideSeed("system-prefix").verdict, "system-prefix");
  assert.equal(decideSeed("cache-creation").verdict, "cache-creation");
  assert.equal(decideSeed("cache-read").verdict, "cache-read");
  assert.equal(decideSeed("fable-5-1").verdict, "fable-5-1");
  assert.equal(decideSeed("parallel-eight").verdict, "parallel-eight");
});

test("CLI scores fixture strings and data files", () => {
  const rewritten = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92090.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(rewritten.status, 0, rewritten.stderr);
  assert.equal(JSON.parse(rewritten.stdout).verdict, "rewritten");
  assert.equal(JSON.parse(rewritten.stdout).alarm, true);

  const banked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/banked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(banked.status, 0, banked.stderr);
  assert.equal(JSON.parse(banked.stdout).verdict, "banked");
  assert.equal(JSON.parse(banked.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input:
        '{"call":8,"firstCall":false,"cache_read_input_tokens":33578,"cache_creation":{"ephemeral_5m_input_tokens":213484}}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "rewritten");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92090);
  assert.deepEqual([...PRIMARY_ISSUES], [92090]);
  assert.equal(COUSIN_ISSUE, 84289);
  assert.deepEqual([...COUSINS], [84289, 87215, 89621, 91289]);
  assert.equal(FILED_AT, "2026-09-04T13:49:33Z");
  assert.equal(REPORTER, "lucascampolina");
  assert.equal(PLATFORM, "macOS 26 (Darwin 25.6.0)");
  assert.equal(CLI_VERSION, "2.1.258");
  assert.equal(MODEL, "claude-fable-5-1");
  assert.equal(SYSTEM_PREFIX, 33578);
  assert.equal(TTL_SECONDS, 300);
  assert.equal(TTL_BUCKET, "5m");
  assert.equal(FULL_REWRITE_WRITE_MIN, 150000);
  assert.equal(FULL_REWRITE_READ_MAX, 50000);
  assert.equal(REWRITE_COUNT, 10);
  assert.equal(REWRITE_TOKENS, 2884476);
  assert.equal(PARALLEL_AGENTS, 8);
  assert.equal(IDLE_WORD, "banked");
  assert.equal(SEEDED_WORD, "rewritten");
  assert.notEqual(IDLE_WORD, "rewritten");
  assert.notEqual(IDLE_WORD, "keyed");
  assert.notEqual(IDLE_WORD, "scrubbed");
  assert.notEqual(IDLE_WORD, "pulled");
  assert.match(TITLE, /Fable 5\.1/);
  assert.match(TITLE, /5-minute/);
  assert.match(ISSUE_URL, /92090/);
  assert.match(PHRASE, /Score the wick/);
  assert.match(PHRASE, /admit the folio already rewritten/);
  assert.match(HUB_LINE, /23:50 ephemera/);
  assert.match(HUB_LINE, /a ephemera that rewrites the whole folio/);
  assert.match(MARK, /23:50/);
  assert.match(MARK, /#137/);
  assert.match(MARK, /#92090/);
  assert.match(CONTRAST_NOTE, /2\.1\.258/);
  assert.match(CONTRAST_NOTE, /lucascampolina/);
  assert.match(CONTRAST_NOTE, /33,578/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /5-minute/);
  assert.ok(LABELS.includes("area:cost"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("commutator"));
  assert.ok(NOT_PRODUCTS.includes("hectograph"));
  assert.ok(NOT_PRODUCTS.includes("ullage"));
  assert.ok(NOT_PRODUCTS.includes("fusee"));
  assert.ok(BANNED_NAMES.includes("Commutator"));
  assert.ok(BANNED_NAMES.includes("Hectograph"));
  assert.ok(BANNED_NAMES.includes("Clepsydra"));
  assert.ok(FORBIDDEN_IDLE.includes("keyed"));
  assert.ok(FORBIDDEN_IDLE.includes("scrubbed"));
  assert.ok(FORBIDDEN_IDLE.includes("pulled"));
  assert.deepEqual([...HOLD_VERDICTS], ["banked", "hold"]);
  assert.ok(CHIPS.includes("banked"));
  assert.ok(CHIPS.includes("rewritten"));
  assert.ok(CHIPS.includes("ephemeral-5m"));
  assert.ok(CHIPS.includes("parallel-eight"));
  assert.equal(REQUEST_IDS.length, 10);
});

test("page is an archive / wick-lit folio atelier, not a leftover clone", () => {
  const page = readPage();
  assert.match(page, /Newsreader/);
  assert.match(page, /Figtree/);
  assert.match(page, /Source Code Pro/);
  assert.match(page, /23:50 \/ hermes catalog #137 \/ #92090/);
  assert.match(page, /Score the wick/);
  assert.match(page, /Pin idle banked/);
  assert.match(page, /Pin seeded rewritten/);
  assert.match(page, /admit the folio already rewritten/i);
  assert.match(page, /embed=1/);
  assert.match(page, /ephemera|wick|folio/i);
  assert.doesNotMatch(page, /Source Serif 4|Libre Franklin|JetBrains Mono/);
  assert.doesNotMatch(page, /Literata|Manrope|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant|Fraunces|Outfit|Fira Code/);
  assert.doesNotMatch(
    page,
    /Score the drum|Score the gelatin|Score the chamber|Score the mask|Key the drum/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Ephemera thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /#92090/);
  assert.match(readme, /banked/);
  assert.match(readme, /rewritten/);
  assert.match(readme, /lucascampolina/);
  assert.match(readme, /NOT Commutator/);
  assert.match(readme, /NOT Hectograph/);
  assert.match(readme, /NOT Ullage/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /catalog #137/);
  assert.match(readme, /Score the wick/);
  assert.doesNotMatch(readme, /Idle word: \*\*keyed\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*scrubbed\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*pulled\*\*/);
  assert.doesNotMatch(readme, /OTEL_LOG_TOOL_/);
  assert.doesNotMatch(readme, /sibling-slot stray/);
});

test("cousin isolation stays banked / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "banked");
  assert.equal(decideSeed(84289).verdict, "banked");
  assert.equal(classify({ issue: 84289 }), "banked");
  assert.equal(classify({ issue: 87215 }), "banked");
  assert.equal(classify({ issue: 89621 }), "banked");
  assert.equal(classify({ issue: 91289 }), "banked");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 92090);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [84289, 87215, 89621, 91289],
  );
});

test("usage-table and model-compare encode issue numbers only", () => {
  const table = readData("usage-table.json");
  assert.equal(table.rows.length, 10);
  assert.equal(table.rewriteTokens, 2884476);
  assert.equal(table.systemPrefix, 33578);
  assert.equal(table.rows[0].requestId, "req_011Cegkz4G6pcp4BEBcMx6rf");
  assert.equal(table.rows[2].cacheCreation, 431885);
  const compare = readData("model-compare.json");
  assert.equal(compare.rows[0].fullContextRewrites, 0);
  assert.equal(compare.rows[1].fullContextRewrites, 0);
  assert.equal(compare.rows[2].fullContextRewrites, 10);
  assert.equal(compare.rows[2].model, "claude-fable-5-1");
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials or exploit payloads in fixtures or page", () => {
  const files = [
    "92090.json",
    "banked.json",
    "rewritten.json",
    "ephemeral-5m.json",
    "system-prefix.json",
    "cache-creation.json",
    "cache-read.json",
    "fable-5-1.json",
    "parallel-eight.json",
    "hold.json",
    "usage-table.json",
    "model-compare.json",
    "fixtures.json",
    "fingerprints.json",
    "cousins.json",
  ];
  for (const name of files) {
    const raw = readFileSync(
      fileURLToPath(new URL(`../data/${name}`, import.meta.url)),
      "utf8",
    );
    assert.doesNotMatch(raw, /sk-ant-|ort01-|oat01-/);
    assert.doesNotMatch(raw, /rm -rf|curl .*\| *sh|BEGIN (RSA|OPENSSH) PRIVATE KEY/);
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
});
