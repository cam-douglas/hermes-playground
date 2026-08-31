import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ARCH,
  AUTO_DISABLED_AT,
  CANARY_SINCE,
  CHIPS,
  CLI,
  CONCURRENT_MAX,
  CONCURRENT_MIN,
  CONCURRENT_REPRO,
  DARWIN,
  FEATURED_ISSUE,
  FILED_AT,
  HOLD_VERDICTS,
  IDLE_WORD,
  LABELS,
  MARK,
  NEARBY_BOUNDARY,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SETTLE_SECONDS,
  STRIKE_THRESHOLD,
  STRIKES_BANKED,
  TITLE,
  ISSUE_URL,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  cloneTicket,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isEnvOn,
  isLitHold,
  isSnuffedSignature,
  parseClaudeJson,
  score,
  seedBurst,
  seedClassic,
  seedEnvOn,
  seedLit,
  seedLostUpdate,
  seedOrphaned,
  seedPidKeyed,
  seedRatcheted,
  seedReused,
  seedSnuffed,
  seedStruck,
  seedWithdrawn,
  simulateBurst,
} from "./davy.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./davy.mjs", import.meta.url));
}

test("90886 seed is snuffed/alarm — working fullscreen auto-disabled by false canary", () => {
  const seed = seedSnuffed();
  const result = score(seed);
  assert.equal(result.verdict, "snuffed");
  assert.equal(result.snuffed, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.idleWord, "lit");
  assert.equal(IDLE_WORD, "lit");
  assert.doesNotMatch(result.idleWord, /davy|^lamp$|^canary$|^flame$|^pit$|^gauze$|^strike$|^fullscreen$|^tui$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.strikes, STRIKES_BANKED);
  assert.equal(seed.strikeThreshold, STRIKE_THRESHOLD);
  assert.equal(seed.autoDisabled, true);
  assert.equal(seed.fullscreenWorks, true);
  assert.equal(seed.concurrentSessions, CONCURRENT_REPRO);
  assert.equal(seed.settleSeconds, SETTLE_SECONDS);
  assert.equal(seed.cli, CLI);
  assert.equal(analyze(seed).featured, true);
  assert.equal(isSnuffedSignature(seed), true);
  assert.ok(result.chips.includes("snuffed"));
  assert.ok(result.chips.includes("struck"));
  assert.ok(!result.chips.includes("lit"));
});

test("lit seed is lit/hold — tui fullscreen, no auto-disable, no orphans", () => {
  const seed = seedLit();
  const result = score(seed);
  assert.equal(result.verdict, "lit");
  assert.equal(result.lit, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "lit");
  assert.equal(seed.tuiSetting, "fullscreen");
  assert.equal(seed.autoDisabled, false);
  assert.equal(seed.strikes, 0);
  assert.equal(seed.pendingOrphans, 0);
  assert.equal(isLitHold(seed), true);
  assert.ok(result.chips.includes("lit"));
});

test("empty / healthy ticket lands on lit; emptyTicket is the seeded snuffed", () => {
  assert.equal(score({}).verdict, "lit");
  assert.equal(
    score({
      tuiSetting: "fullscreen",
      autoDisabled: false,
      strikes: 0,
      pendingOrphans: 0,
      fullscreenWorks: true,
    }).verdict,
    "lit",
  );
  assert.equal(emptyTicket().seed, "snuffed");
  assert.equal(score(emptyTicket()).verdict, "snuffed");
  assert.equal(
    cloneTicket({ auto_disabled: true, fullscreen_works: true, strikes: 4, tui: "fullscreen" }).autoDisabled,
    true,
  );
});

test("decideSeed covers every named verdict and 90886 alias", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "lit");
    assert.doesNotMatch(result.idleWord, /davy|^lamp$|^canary$|^flame$|^pit$/i);
  }
  assert.equal(decide({ action: "90886" }).verdict, "snuffed");
  assert.equal(decide({ action: "snuffed" }).verdict, "snuffed");
  assert.equal(decide({ action: "lit" }).verdict, "lit");
});

test("rule: autoDisabled && fullscreenWorks && strikes>=2 is snuffed; envNoFlicker is env-on", () => {
  const primary = {
    autoDisabled: true,
    fullscreenWorks: true,
    strikes: 4,
    strikeThreshold: 2,
    tuiSetting: "fullscreen",
  };
  const result = score(primary);
  assert.equal(result.verdict, "snuffed");
  assert.equal(result.alarm, true);
  assert.equal(isSnuffedSignature(primary), true);

  const env = {
    envNoFlicker: true,
    autoDisabled: true,
    fullscreenWorks: true,
    strikes: 4,
  };
  assert.equal(classify(env), "env-on");
  assert.equal(isEnvOn(env), true);

  const aliases = {
    auto_disabled: true,
    fullscreen_works: true,
    strikes: 4,
    tui: "fullscreen",
  };
  assert.equal(score(aliases).verdict, "snuffed");
});

test("specific alarm classes from the issue facts", () => {
  assert.equal(score(seedStruck()).verdict, "struck");
  assert.equal(score(seedOrphaned()).verdict, "orphaned");
  assert.equal(score(seedReused()).verdict, "reused");
  assert.equal(score(seedWithdrawn()).verdict, "withdrawn");
  assert.equal(score(seedRatcheted()).verdict, "ratcheted");
  assert.equal(score(seedBurst()).verdict, "burst");
  assert.equal(score(seedLostUpdate()).verdict, "lost-update");
  assert.equal(score(seedClassic()).verdict, "classic");
  assert.equal(score(seedPidKeyed()).verdict, "pid-keyed");
  assert.equal(score(seedEnvOn()).verdict, "env-on");
  assert.ok(chipsOf(seedStruck()).includes("struck"));
  assert.ok(chipsOf(seedOrphaned()).includes("orphaned"));
  assert.ok(chipsOf(seedBurst()).includes("burst"));
  assert.ok(chipsOf(seedEnvOn()).includes("env-on"));
  assert.equal(isLitHold(seedSnuffed()), false);
});

test("local fingerprint files keep issue numbers and #90886 facts only", () => {
  const primary = readData("90886.json");
  const hold = readData("lit.json");
  const snuffed = readData("snuffed.json");
  const struck = readData("struck.json");
  const orphaned = readData("orphaned.json");
  const reused = readData("reused.json");
  const withdrawn = readData("withdrawn.json");
  const ratcheted = readData("ratcheted.json");
  const burst = readData("burst.json");
  const lost = readData("lost-update.json");
  const classic = readData("classic.json");
  const pidKeyed = readData("pid-keyed.json");
  const envOn = readData("env-on.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90886);
  assert.equal(primary.strikes, STRIKES_BANKED);
  assert.equal(primary.strikeThreshold, STRIKE_THRESHOLD);
  assert.equal(primary.autoDisabled, true);
  assert.equal(primary.fullscreenWorks, true);
  assert.equal(score(primary).verdict, "snuffed");
  assert.equal(hold.issue, 90886);
  assert.equal(score(hold).verdict, "lit");
  assert.equal(score(snuffed).verdict, "snuffed");
  assert.equal(score(struck).verdict, "struck");
  assert.equal(score(orphaned).verdict, "orphaned");
  assert.equal(score(reused).verdict, "reused");
  assert.equal(score(withdrawn).verdict, "withdrawn");
  assert.equal(score(ratcheted).verdict, "ratcheted");
  assert.equal(score(burst).verdict, "burst");
  assert.equal(score(lost).verdict, "lost-update");
  assert.equal(score(classic).verdict, "classic");
  assert.equal(score(pidKeyed).verdict, "pid-keyed");
  assert.equal(score(envOn).verdict, "env-on");
  assert.equal(chips.idleWord, "lit");
  assert.equal(FILED_AT, "2026-08-31T03:26:28Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:macos", "area:tui"]);
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on snuffed and allows lit", async () => {
  const fail = await handle(seedSnuffed());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90886/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedLit());
  assert.equal(hold.lit, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /lit/i);
});

test("CLI stdin JSON and file argument", () => {
  const lit = JSON.stringify({
    seed: "lit",
    tuiSetting: "fullscreen",
    autoDisabled: false,
    strikes: 0,
    pendingOrphans: 0,
    fullscreenWorks: true,
  });
  const piped = spawnSync(process.execPath, [hookPath()], {
    input: lit,
    encoding: "utf8",
  });
  assert.equal(piped.status, 0, piped.stderr);
  const fromStdin = JSON.parse(piped.stdout);
  assert.equal(fromStdin.verdict, "lit");
  assert.equal(fromStdin.hold, true);

  const snuffedFile = fileURLToPath(new URL("../data/90886.json", import.meta.url));
  const filed = spawnSync(process.execPath, [hookPath(), snuffedFile], { encoding: "utf8" });
  assert.equal(filed.status, 0, filed.stderr);
  const fromFile = JSON.parse(filed.stdout);
  assert.equal(fromFile.verdict, "snuffed");
  assert.equal(fromFile.alarm, true);
});

test("~/.claude.json canary parser and burst simulator", () => {
  const snippet = JSON.stringify({
    fullscreenAutoDisabled: { version: "2.1.251", at: 1788146545484, strikes: 4 },
    fullscreenBootPending: {
      18421: { startedAt: 1788146530000 },
      18488: { startedAt: 1788146530400 },
    },
  });
  const parsed = parseClaudeJson(snippet);
  assert.equal(parsed.ticket.strikes, 4);
  assert.equal(parsed.ticket.pendingOrphans, 2);
  assert.equal(parsed.auto.version, "2.1.251");
  assert.equal(score(parsed.ticket).verdict, "snuffed");

  const burst = simulateBurst(15);
  assert.equal(burst.sessions, 15);
  assert.ok(burst.lostUpdate);
  assert.ok(burst.leftover > 0);
  assert.equal(burst.ticket.pidKeyed, true);
});

test("verdict and chip lists; idle is never davy / lamp / canary / flame / pit", () => {
  assert.deepEqual([...VERDICTS], [
    "lit",
    "snuffed",
    "struck",
    "orphaned",
    "reused",
    "withdrawn",
    "ratcheted",
    "burst",
    "lost-update",
    "classic",
    "pid-keyed",
    "env-on",
  ]);
  assert.ok(CHIPS.includes("snuffed"));
  assert.ok(HOLD_VERDICTS.includes("lit"));
  assert.ok(!HOLD_VERDICTS.includes("davy"));
  assert.doesNotMatch(IDLE_WORD, /davy|^lamp$|^canary$|^flame$|^pit$|^gauze$|^strike$|^fullscreen$|^tui$/i);
  assert.equal(CLI, "2.1.251");
  assert.equal(CANARY_SINCE, "2.1.236");
  assert.equal(STRIKES_BANKED, 4);
  assert.equal(STRIKE_THRESHOLD, 2);
  assert.equal(CONCURRENT_REPRO, 15);
  assert.equal(CONCURRENT_MIN, 10);
  assert.equal(CONCURRENT_MAX, 20);
  assert.equal(SETTLE_SECONDS, 10);
  assert.equal(AUTO_DISABLED_AT, 1788146545484);
  assert.equal(REPORTER, "evertjr");
  assert.equal(DARWIN, "25.6.0");
  assert.equal(ARCH, "arm64");
  assert.deepEqual([...PRIMARY_ISSUES], [90886]);
  assert.deepEqual([...SAME_CLASS], [85583, 90789, 90661]);
  assert.ok(NEARBY_BOUNDARY.includes(88372));
  assert.ok(NEARBY_BOUNDARY.includes(84940));
  assert.ok(NEARBY_BOUNDARY.includes(78693));
  assert.match(PHRASE, /false canary is not a hold/i);
  assert.match(MARK, /13:50/);
  assert.match(MARK, /#87/);
  assert.match(MARK, /#90886/);
  assert.match(ISSUE_URL, /90886/);
});

test("living page seeds snuffed and names lit idle", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*lit/);
  assert.match(html, /lit/);
  assert.match(html, /snuffed/);
  assert.match(html, /struck/);
  assert.match(html, /orphaned/);
  assert.match(html, /reused/);
  assert.match(html, /withdrawn/);
  assert.match(html, /ratcheted/);
  assert.match(html, /burst/);
  assert.match(html, /lost-update/);
  assert.match(html, /classic/);
  assert.match(html, /pid-keyed/);
  assert.match(html, /env-on/);
  assert.match(html, /#90886/);
  assert.match(html, /#85583/);
  assert.match(html, /#90789/);
  assert.match(html, /#90661/);
  assert.match(html, /24224/);
  assert.match(html, /13:50/);
  assert.match(html, /catalog #87/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /2\.1\.236/);
  assert.match(html, /evertjr/);
  assert.match(html, /Cinzel/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /gauze/i);
  assert.match(html, /CLAUDE_CODE_NO_FLICKER/);
  assert.doesNotMatch(html, /Idle word:\s*davy/i);
  assert.doesNotMatch(html, /Idle word:\s*lamp/i);
  assert.doesNotMatch(html, /Idle word:\s*canary/i);
  assert.doesNotMatch(html, /Idle word:\s*flame/i);
  assert.doesNotMatch(html, /family=Special\+Elite/);
  assert.doesNotMatch(html, /family=Share\+Tech\+Mono/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /oak cabinet/);
  assert.doesNotMatch(html, /bakery maple/);
  assert.doesNotMatch(html, /marble hydra/);
  assert.doesNotMatch(html, /stage-door/);
  assert.doesNotMatch(html, /tide-pool/);
  assert.doesNotMatch(html, /REPRINT/);
  assert.doesNotMatch(html, /trim bin/i);
  assert.doesNotMatch(html, /Ground glass/);
});
