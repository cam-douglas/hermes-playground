import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HORIZON_AT,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOGIN_AT,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  STORE_PATH,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isBlanked,
  isSealed,
  normalize,
  score,
  seedBlanked,
  seedEmptyTokenRewrite,
  seedHold,
  seedRestamped,
  seedSealed,
  seedStaleRefreshHorizon,
  seedVoided,
} from "./coffer.mjs";

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
  return fileURLToPath(new URL("./coffer.mjs", import.meta.url));
}

test("persist refresh + restamped + no blank → sealed", () => {
  const result = analyze({
    persistRefresh: true,
    restamped: true,
    blanked: false,
    staleHorizon: false,
    emptyTokenRewrite: false,
  });
  assert.equal(result.verdict, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.blanked, false);
  assert.equal(result.sealed, true);
  assert.equal(isSealed(result.ticket), true);
  assert.equal(isBlanked(result.ticket), false);
});

test("stale horizon + empty-token rewrite + lockout → blanked", () => {
  const result = analyze({
    persistRefresh: false,
    staleHorizon: true,
    emptyTokenRewrite: true,
    blanked: true,
    lockoutAllFresh: true,
    voided: true,
    liveSessionOkMemory: true,
    headlessScheduledPrint: true,
    windowsFileStore: true,
    noKeychain: true,
    hasClearRepro: true,
  });
  assert.equal(result.verdict, "blanked");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.blanked, true);
  assert.equal(isBlanked(result.ticket), true);
  assert.ok(result.chips.includes("blanked"));
  assert.ok(result.chips.includes("stale-refresh-horizon"));
  assert.ok(result.chips.includes("empty-token-rewrite"));
  assert.ok(result.chips.includes("lockout-all-fresh"));
  assert.ok(!result.chips.includes("sealed"));
});

test("idle sealed is a hold; the coffer is a sealed vault", () => {
  const result = analyze(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.blanked, false);
  assert.ok(result.chips.includes("sealed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(result.chips.includes("restamped"));
  assert.ok(!result.chips.includes("blanked"));
  assert.equal(result.ticket.persistRefresh, true);
  assert.equal(result.ticket.restamped, true);
  assert.doesNotMatch(
    result.idleWord,
    /attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify sealed", () => {
  assert.equal(classify(emptyTicket()), "sealed");
  assert.equal(classify(""), "sealed");
  assert.equal(classify(null), "sealed");
  assert.equal(decideSeed("sealed").verdict, "sealed");
  assert.equal(decideSeed("open").verdict, "sealed");
});

test("seeded blanked #91571 is alarm with stale horizon and empty rewrite", () => {
  const result = analyze(seedBlanked());
  assert.equal(result.verdict, "blanked");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("blanked"));
  assert.ok(result.chips.includes("voided"));
  assert.ok(result.chips.includes("stale-refresh-horizon"));
  assert.ok(result.chips.includes("empty-token-rewrite"));
  assert.ok(result.chips.includes("lockout-all-fresh"));
  assert.ok(result.chips.includes("live-session-ok-memory"));
  assert.ok(result.chips.includes("headless-scheduled-print"));
  assert.ok(result.chips.includes("windows-file-store"));
  assert.ok(result.chips.includes("no-keychain"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("sealed"));
  assert.equal(result.ticket.emptyTokenRewrite, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.refreshTokenExpiresAt, HORIZON_AT);
  assert.equal(result.ticket.loginAt, LOGIN_AT);
});

test("data fixtures classify sealed vs blanked vs named chips", () => {
  assert.equal(classify(readData("sealed.json")), "sealed");
  assert.equal(classify(readData("restamped.json")), "restamped");
  assert.equal(classify(readData("blanked.json")), "blanked");
  assert.equal(classify(readData("voided.json")), "voided");
  assert.equal(classify(readData("91571.json")), "blanked");
});

test("blanked seed is alarm; sealed / restamped / hold are holds", () => {
  assert.equal(score(seedBlanked()).alarm, true);
  assert.equal(score(seedBlanked()).hold, false);
  assert.equal(score(seedSealed()).hold, true);
  assert.equal(score(seedSealed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedRestamped()).hold, true);
  assert.equal(score(seedRestamped()).verdict, "restamped");
  assert.equal(score(seedVoided()).alarm, true);
  assert.equal(score(seedStaleRefreshHorizon()).alarm, true);
  assert.equal(score(seedEmptyTokenRewrite()).alarm, true);
});

test("normalize seeds 91571 without ticket fields", () => {
  const ticket = normalize({ issue: 91571 });
  assert.equal(ticket.emptyTokenRewrite, true);
  assert.equal(ticket.blanked, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "blanked");
});

test("score / decide / handle agree on blanked vs sealed", () => {
  assert.equal(score(seedBlanked()).verdict, "blanked");
  assert.equal(decide(seedSealed()).verdict, "sealed");
  const fail = handle(seedBlanked());
  const hold = handle(seedSealed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91571/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /file-store|restamped|blank/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /sealed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("blanked").verdict, "blanked");
  assert.equal(decideSeed(91571).verdict, "blanked");
  assert.equal(decideSeed("91571").verdict, "blanked");
  assert.equal(decideSeed("sealed").verdict, "sealed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("restamped").verdict, "restamped");
  assert.equal(decideSeed("voided").verdict, "voided");
  assert.equal(decideSeed("stale-refresh-horizon").verdict, "stale-refresh-horizon");
  assert.equal(decideSeed("empty-token-rewrite").verdict, "empty-token-rewrite");
  assert.equal(decideSeed("lockout-all-fresh").verdict, "lockout-all-fresh");
  assert.equal(decideSeed("live-session-ok-memory").verdict, "live-session-ok-memory");
  assert.equal(
    decideSeed("headless-scheduled-print").verdict,
    "headless-scheduled-print",
  );
  assert.equal(decideSeed("windows-file-store").verdict, "windows-file-store");
  assert.equal(decideSeed("no-keychain").verdict, "no-keychain");
});

test("CLI scores fixture strings and data files", () => {
  const blanked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91571.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(blanked.status, 0, blanked.stderr);
  assert.equal(JSON.parse(blanked.stdout).verdict, "blanked");
  assert.equal(JSON.parse(blanked.stdout).alarm, true);

  const sealed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/sealed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sealed.status, 0, sealed.stderr);
  assert.equal(JSON.parse(sealed.stdout).verdict, "sealed");
  assert.equal(JSON.parse(sealed.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"staleHorizon":true,"blanked":true}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "blanked");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91571);
  assert.deepEqual([...PRIMARY_ISSUES], [91571]);
  assert.equal(COUSIN_ISSUE, 83464);
  assert.deepEqual(
    [...COUSINS],
    [83464, 68398, 88054, 91158, 90010, 88124, 91436, 88583, 90688, 89490, 43392, 90860],
  );
  assert.ok(!COUSINS.includes(91469));
  assert.equal(FILED_AT, "2026-09-02T18:31:43Z");
  assert.equal(REPORTER, "peterzirkle-cmyk");
  assert.equal(VERSION, "2.1.220");
  assert.equal(PLATFORM, "Windows 11 Pro");
  assert.equal(STORE_PATH, "%USERPROFILE%\\.claude\\.credentials.json");
  assert.equal(IDLE_WORD, "sealed");
  assert.equal(SEEDED_WORD, "blanked");
  assert.notEqual(IDLE_WORD, "blanked");
  assert.notEqual(IDLE_WORD, "attested");
  assert.notEqual(IDLE_WORD, "swaged");
  assert.notEqual(SEEDED_WORD, "usurped");
  assert.notEqual(SEEDED_WORD, "torn");
  assert.match(TITLE, /refresh-token rotation not persisted/);
  assert.match(TITLE, /\.credentials\.json/);
  assert.match(ISSUE_URL, /91571/);
  assert.match(PHRASE, /never restamped into the ledger/);
  assert.match(PHRASE, /admit the store already voided/);
  assert.match(HUB_LINE, /04:50 coffer/);
  assert.match(MARK, /04:50/);
  assert.match(MARK, /#127/);
  assert.match(MARK, /#91571/);
  assert.match(CONTRAST_NOTE, /WINDOWS OAUTH FILE-STORE/);
  assert.match(CONTRAST_NOTE, /refreshTokenExpiresAt/);
  assert.match(CONTRAST_NOTE, /peterzirkle-cmyk/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /never blank the store/);
  assert.ok(LABELS.includes("area:auth"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(NOT_PRODUCTS.includes("codicil"));
  assert.ok(NOT_PRODUCTS.includes("crimp"));
  assert.ok(NOT_PRODUCTS.includes("jackfield"));
  assert.ok(BANNED_NAMES.includes("Codicil"));
  assert.ok(BANNED_NAMES.includes("Crimp"));
  assert.ok(FORBIDDEN_IDLE.includes("attested"));
  assert.ok(FORBIDDEN_IDLE.includes("usurped"));
  assert.ok(FORBIDDEN_IDLE.includes("swaged"));
  assert.ok(FORBIDDEN_IDLE.includes("torn"));
  assert.ok(FORBIDDEN_IDLE.includes("homed"));
  assert.ok(FORBIDDEN_IDLE.includes("crossed"));
  assert.ok(FORBIDDEN_IDLE.includes("armed"));
  assert.ok(FORBIDDEN_IDLE.includes("unheard"));
  assert.deepEqual([...HOLD_VERDICTS], ["sealed", "restamped", "hold"]);
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("blanked"));
  assert.ok(CHIPS.includes("stale-refresh-horizon"));
  assert.ok(CHIPS.includes("empty-token-rewrite"));
  assert.ok(CHIPS.includes("lockout-all-fresh"));
});

test("page is a vault night-safe, not a probate or crimp clone", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /04:50 \/ hermes catalog #127 \/ #91571/);
  assert.match(page, /Score the seal/);
  assert.match(page, /Pin idle sealed/);
  assert.match(page, /Pin seeded blanked/);
  assert.match(page, /admit the store already voided/i);
  assert.match(page, /embed=1/);
  assert.match(page, /#83464/);
  assert.match(page, /#68398/);
  assert.match(page, /#88054/);
  assert.match(page, /#91158/);
  assert.match(page, /#90010/);
  assert.match(page, /#88124/);
  assert.match(page, /#91436/);
  assert.match(page, /skip #91469 SOLVED/i);
  assert.doesNotMatch(page, /issues\/91469/);
  assert.doesNotMatch(page, /Cormorant Garamond|Figtree|Azeret Mono/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains Mono|Public Sans/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3/);
  assert.doesNotMatch(
    page,
    /Attest the deed|Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage|Score the attestation/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Coffer thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /WINDOWS OAUTH FILE-STORE/);
  assert.match(readme, /#91571/);
  assert.match(readme, /sealed/);
  assert.match(readme, /blanked/);
  assert.match(readme, /refreshTokenExpiresAt/);
  assert.match(readme, /peterzirkle-cmyk/);
  assert.match(readme, /NOT Codicil/);
  assert.match(readme, /NOT Crimp/);
  assert.match(readme, /NOT Jackfield/);
  assert.match(readme, /NOT Tocsin/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Karla/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /catalog #127/);
  assert.match(readme, /Score the seal/);
  assert.doesNotMatch(readme, /SHARED MULTI-AGENT WORKTREE/);
  assert.doesNotMatch(readme, /SETTINGS.JSON UNLOCKED NON-ATOMIC RMW/);
  assert.doesNotMatch(readme, /Idle word: \*\*attested\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*swaged\*\*/);
});

test("cousin isolation stays sealed / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "sealed");
  assert.equal(decideSeed(83464).verdict, "sealed");
  assert.equal(decideSeed(68398).verdict, "sealed");
  assert.equal(decideSeed(88054).verdict, "sealed");
  assert.equal(classify({ issue: 91158 }), "sealed");
  assert.equal(classify({ issue: 90010 }), "sealed");
  assert.equal(classify({ issue: 88124 }), "sealed");
  assert.equal(classify({ issue: 91436 }), "sealed");
  assert.equal(classify({ issue: 88583 }), "sealed");
  assert.equal(classify({ issue: 90688 }), "sealed");
});

test("README and cousins.json cite executor-confirmed URLs; skip 91469", () => {
  const readme = readReadme();
  const cousins = readData("cousins.json");
  for (const issue of [83464, 68398, 88054, 91158, 90010, 88124, 91436]) {
    assert.match(readme, new RegExp(`#${issue}`));
    assert.ok(cousins.rows.some((row) => row.issue === issue));
  }
  assert.match(readme, /Skip.*#91469.*SOLVED/i);
  assert.equal(cousins.primary, 91571);
  assert.ok(!cousins.rows.some((row) => row.issue === 91469));
  assert.ok(cousins.skipped.some((row) => row.issue === 91469));
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "91571.json",
    "sealed.json",
    "restamped.json",
    "blanked.json",
    "voided.json",
    "fixtures.json",
    "fingerprints.json",
  ];
  for (const name of files) {
    const raw = readFileSync(
      fileURLToPath(new URL(`../data/${name}`, import.meta.url)),
      "utf8",
    );
    assert.doesNotMatch(raw, /sk-ant-|ort01-|oat01-/);
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
});
