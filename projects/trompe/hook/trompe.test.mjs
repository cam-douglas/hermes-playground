import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CANARY_TOKEN,
  CHIPS,
  CLI,
  CLI_SINCE,
  CLEAR_TAG,
  CODEX_SAME,
  DESKTOP,
  DESKTOP_SINCE,
  FEATURED_ISSUE,
  FILED_AT,
  HOLD_VERDICTS,
  IDLE_WORD,
  ISSUE_CANARY,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  OS_VERSION,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  cloneTicket,
  contentHasClearTag,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isIntactHold,
  isPhantomSignature,
  parseJsonl,
  score,
  seedCanaryKept,
  seedChipLied,
  seedCleared,
  seedCollapsed,
  seedEnvelopeMiss,
  seedFalseBanner,
  seedIntact,
  seedNoTruncate,
  seedPhantom,
  seedQuotedTag,
  seedRenderOnly,
  seedScrollbackHid,
  seedSubstring,
  simulateQuotedClear,
} from "./trompe.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./trompe.mjs", import.meta.url));
}

test("90881 seed is phantom/alarm — quoted tag painted a clear that never ran", () => {
  const seed = seedPhantom();
  const result = score(seed);
  assert.equal(result.verdict, "phantom");
  assert.equal(result.phantom, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.idleWord, "intact");
  assert.equal(IDLE_WORD, "intact");
  assert.doesNotMatch(result.idleWord, /trompe|^gallery$|^gilt$|^clear$|^chip$|^banner$|^pane$|^desktop$|^scrollback$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.quotedTag, true);
  assert.equal(seed.leadingSlash, false);
  assert.equal(seed.hasEnvelope, false);
  assert.equal(seed.chipPainted, true);
  assert.equal(seed.bannerShown, true);
  assert.equal(seed.scrollbackCollapsed, true);
  assert.equal(seed.jsonlContinuous, true);
  assert.equal(seed.canaryRecalled, true);
  assert.equal(seed.actualClear, false);
  assert.equal(seed.canaryToken, CANARY_TOKEN);
  assert.equal(seed.cli, CLI);
  assert.equal(analyze(seed).featured, true);
  assert.equal(isPhantomSignature(seed), true);
  assert.ok(result.chips.includes("phantom"));
  assert.ok(result.chips.includes("chip-lied"));
  assert.ok(!result.chips.includes("intact"));
});

test("intact seed is intact/hold — no painted chip, scrollback visible", () => {
  const seed = seedIntact();
  const result = score(seed);
  assert.equal(result.verdict, "intact");
  assert.equal(result.intact, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "intact");
  assert.equal(seed.chipPainted, false);
  assert.equal(seed.bannerShown, false);
  assert.equal(seed.scrollbackCollapsed, false);
  assert.equal(seed.jsonlContinuous, true);
  assert.equal(isIntactHold(seed), true);
  assert.ok(result.chips.includes("intact"));
});

test("empty / honest ticket lands on intact; emptyTicket is the seeded phantom", () => {
  assert.equal(score({}).verdict, "intact");
  assert.equal(
    score({
      quotedTag: false,
      chipPainted: false,
      bannerShown: false,
      scrollbackCollapsed: false,
      jsonlContinuous: true,
    }).verdict,
    "intact",
  );
  assert.equal(emptyTicket().seed, "phantom");
  assert.equal(score(emptyTicket()).verdict, "phantom");
  assert.equal(
    cloneTicket({ quoted_tag: true, chip_painted: true, banner_shown: true, scrollback_collapsed: true, jsonl_continuous: true, canary_recalled: true, actual_clear: false }).quotedTag,
    true,
  );
});

test("decideSeed covers every named verdict and 90881 alias", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "intact");
    assert.doesNotMatch(result.idleWord, /trompe|^gallery$|^gilt$|^clear$/i);
  }
  assert.equal(decide({ action: "90881" }).verdict, "phantom");
  assert.equal(decide({ action: "phantom" }).verdict, "phantom");
  assert.equal(decide({ action: "intact" }).verdict, "intact");
});

test("rule: quoted tag + painted chip + hid scrollback + canary kept is phantom", () => {
  const primary = {
    quotedTag: true,
    leadingSlash: false,
    hasEnvelope: false,
    chipPainted: true,
    bannerShown: true,
    noOutputShown: true,
    scrollbackCollapsed: true,
    jsonlContinuous: true,
    canaryRecalled: true,
    actualClear: false,
  };
  const result = score(primary);
  assert.equal(result.verdict, "phantom");
  assert.equal(result.alarm, true);
  assert.equal(isPhantomSignature(primary), true);

  const aliases = {
    quoted_tag: true,
    chip_painted: true,
    banner_shown: true,
    scrollback_collapsed: true,
    jsonl_continuous: true,
    canary_recalled: true,
    actual_clear: false,
  };
  assert.equal(score(aliases).verdict, "phantom");
});

test("specific alarm classes from the issue facts", () => {
  assert.equal(score(seedCleared()).verdict, "cleared");
  assert.equal(score(seedCollapsed()).verdict, "collapsed");
  assert.equal(score(seedSubstring()).verdict, "substring");
  assert.equal(score(seedChipLied()).verdict, "chip-lied");
  assert.equal(score(seedScrollbackHid()).verdict, "scrollback-hid");
  assert.equal(score(seedCanaryKept()).verdict, "canary-kept");
  assert.equal(score(seedQuotedTag()).verdict, "quoted-tag");
  assert.equal(score(seedFalseBanner()).verdict, "false-banner");
  assert.equal(score(seedRenderOnly()).verdict, "render-only");
  assert.equal(score(seedNoTruncate()).verdict, "no-truncate");
  assert.equal(score(seedEnvelopeMiss()).verdict, "envelope-miss");
  assert.ok(chipsOf(seedChipLied()).includes("chip-lied"));
  assert.ok(chipsOf(seedFalseBanner()).includes("false-banner"));
  assert.ok(chipsOf(seedCanaryKept()).includes("canary-kept"));
  assert.equal(isIntactHold(seedPhantom()), false);
});

test("local fingerprint files keep issue numbers and #90881 facts only", () => {
  const primary = readData("90881.json");
  const hold = readData("intact.json");
  const phantom = readData("phantom.json");
  const cleared = readData("cleared.json");
  const collapsed = readData("collapsed.json");
  const substring = readData("substring.json");
  const chipLied = readData("chip-lied.json");
  const hid = readData("scrollback-hid.json");
  const canary = readData("canary-kept.json");
  const quoted = readData("quoted-tag.json");
  const banner = readData("false-banner.json");
  const render = readData("render-only.json");
  const noTruncate = readData("no-truncate.json");
  const envelope = readData("envelope-miss.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90881);
  assert.equal(primary.quotedTag, true);
  assert.equal(primary.chipPainted, true);
  assert.equal(primary.actualClear, false);
  assert.equal(primary.canaryToken, CANARY_TOKEN);
  assert.equal(score(primary).verdict, "phantom");
  assert.equal(hold.issue, 90881);
  assert.equal(score(hold).verdict, "intact");
  assert.equal(score(phantom).verdict, "phantom");
  assert.equal(score(cleared).verdict, "cleared");
  assert.equal(score(collapsed).verdict, "collapsed");
  assert.equal(score(substring).verdict, "substring");
  assert.equal(score(chipLied).verdict, "chip-lied");
  assert.equal(score(hid).verdict, "scrollback-hid");
  assert.equal(score(canary).verdict, "canary-kept");
  assert.equal(score(quoted).verdict, "quoted-tag");
  assert.equal(score(banner).verdict, "false-banner");
  assert.equal(score(render).verdict, "render-only");
  assert.equal(score(noTruncate).verdict, "no-truncate");
  assert.equal(score(envelope).verdict, "envelope-miss");
  assert.equal(chips.idleWord, "intact");
  assert.equal(FILED_AT, "2026-08-31T02:51:00Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual([...LABELS], ["bug", "platform:macos", "area:ui", "area:desktop"]);
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on phantom and allows intact", async () => {
  const fail = await handle(seedPhantom());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90881/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedIntact());
  assert.equal(hold.intact, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /intact/i);
});

test("CLI stdin JSON and file argument", () => {
  const intact = JSON.stringify({
    seed: "intact",
    quotedTag: false,
    chipPainted: false,
    bannerShown: false,
    scrollbackCollapsed: false,
    jsonlContinuous: true,
  });
  const piped = spawnSync(process.execPath, [hookPath()], {
    input: intact,
    encoding: "utf8",
  });
  assert.equal(piped.status, 0, piped.stderr);
  const fromStdin = JSON.parse(piped.stdout);
  assert.equal(fromStdin.verdict, "intact");
  assert.equal(fromStdin.hold, true);

  const phantomFile = fileURLToPath(new URL("../data/90881.json", import.meta.url));
  const filed = spawnSync(process.execPath, [hookPath(), phantomFile], { encoding: "utf8" });
  assert.equal(filed.status, 0, filed.stderr);
  const fromFile = JSON.parse(filed.stdout);
  assert.equal(fromFile.verdict, "phantom");
  assert.equal(fromFile.alarm, true);
});

test("JSONL parser and quoted-tag substring simulator", () => {
  const jsonl = [
    JSON.stringify({ type: "user", content: `Remember this canary: ${CANARY_TOKEN}` }),
    JSON.stringify({ type: "assistant", content: "Canary stored." }),
    JSON.stringify({ type: "user", content: `echo verbatim: ${CLEAR_TAG}` }),
    JSON.stringify({ type: "assistant", content: `echo: ${CLEAR_TAG}` }),
  ].join("\n");
  const parsed = parseJsonl(jsonl);
  assert.equal(parsed.records.length, 4);
  assert.equal(parsed.hasTag, true);
  assert.equal(parsed.canary, true);
  assert.equal(parsed.continuous, true);
  assert.equal(score(parsed.ticket).facts.quotedTag, true);

  const hit = simulateQuotedClear(`docs: the tag is ${CLEAR_TAG}`);
  assert.equal(hit.substringHit, true);
  assert.equal(hit.paintsChip, true);
  assert.equal(score(hit.ticket).verdict, "phantom");

  const miss = simulateQuotedClear("please summarize the last turn");
  assert.equal(miss.substringHit, false);
  assert.equal(contentHasClearTag("no tag here"), false);
  assert.equal(contentHasClearTag(CLEAR_TAG), true);
});

test("verdict and chip lists; idle is never trompe / gallery / gilt / clear", () => {
  assert.deepEqual([...VERDICTS], [
    "intact",
    "phantom",
    "cleared",
    "collapsed",
    "substring",
    "chip-lied",
    "scrollback-hid",
    "canary-kept",
    "quoted-tag",
    "false-banner",
    "render-only",
    "no-truncate",
    "envelope-miss",
  ]);
  assert.ok(CHIPS.includes("phantom"));
  assert.ok(HOLD_VERDICTS.includes("intact"));
  assert.ok(!HOLD_VERDICTS.includes("trompe"));
  assert.doesNotMatch(IDLE_WORD, /trompe|^gallery$|^gilt$|^clear$|^chip$|^banner$|^pane$|^desktop$|^scrollback$/i);
  assert.equal(CLI, "2.1.251");
  assert.equal(CLI_SINCE, "2.1.183");
  assert.equal(DESKTOP, "1.40609.0");
  assert.equal(DESKTOP_SINCE, "1.14271.0");
  assert.equal(CANARY_TOKEN, "CANARY-TROMPE-88");
  assert.equal(ISSUE_CANARY, "PATINA-7731-OBSIDIAN");
  assert.equal(REPORTER, "dnorth123");
  assert.equal(OS_VERSION, "15.7.3");
  assert.deepEqual([...PRIMARY_ISSUES], [90881]);
  assert.deepEqual([...SAME_CLASS], [53715, 88367]);
  assert.deepEqual([...CODEX_SAME], [41758, 41748]);
  assert.ok(NOT_PRODUCTS.includes("ambo"));
  assert.ok(NOT_PRODUCTS.includes("davy"));
  assert.ok(NOT_PRODUCTS.includes("chad"));
  assert.match(PHRASE, /painted clear is not a hold/i);
  assert.match(MARK, /14:50/);
  assert.match(MARK, /#88/);
  assert.match(MARK, /#90881/);
  assert.match(ISSUE_URL, /90881/);
  assert.match(CLEAR_TAG, /command-name/);
});

test("living page seeds phantom and names intact idle", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*intact/);
  assert.match(html, /intact/);
  assert.match(html, /phantom/);
  assert.match(html, /cleared/);
  assert.match(html, /collapsed/);
  assert.match(html, /substring/);
  assert.match(html, /chip-lied/);
  assert.match(html, /scrollback-hid/);
  assert.match(html, /canary-kept/);
  assert.match(html, /quoted-tag/);
  assert.match(html, /false-banner/);
  assert.match(html, /render-only/);
  assert.match(html, /no-truncate/);
  assert.match(html, /envelope-miss/);
  assert.match(html, /#90881/);
  assert.match(html, /#53715/);
  assert.match(html, /#88367/);
  assert.match(html, /41758/);
  assert.match(html, /41748/);
  assert.match(html, /14:50/);
  assert.match(html, /catalog #88/);
  assert.match(html, /1\.40609\.0/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /2\.1\.183/);
  assert.match(html, /1\.14271\.0/);
  assert.match(html, /dnorth123/);
  assert.match(html, /CANARY-TROMPE-88/);
  assert.match(html, /Playfair/);
  assert.match(html, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(html, /command-name/);
  assert.match(html, /Context cleared/);
  assert.match(html, /\(no output\)/);
  assert.doesNotMatch(html, /Idle word:\s*trompe/i);
  assert.doesNotMatch(html, /Idle word:\s*gallery/i);
  assert.doesNotMatch(html, /Idle word:\s*gilt/i);
  assert.doesNotMatch(html, /Idle word:\s*clear/i);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Special\+Elite/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /oak cabinet/);
  assert.doesNotMatch(html, /bakery maple/);
  assert.doesNotMatch(html, /marble hydra/);
  assert.doesNotMatch(html, /stage-door/);
  assert.doesNotMatch(html, /tide-pool/);
  assert.doesNotMatch(html, /pit-black/);
  assert.doesNotMatch(html, /trim bin/i);
  assert.doesNotMatch(html, /Ground glass/);
});
