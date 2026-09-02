import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CHILDREN_END,
  CHILDREN_START,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  GPU_EXIT,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_TIMEOUT_S,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOG_IDLE_DISCONNECT,
  MARK,
  MCP_COUNT,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  RSS_END_GB,
  RSS_START_MB,
  SEEDED_WORD,
  TELEMETRY,
  TITLE,
  TOOL_COUNT,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isFouled,
  isSlipped,
  normalize,
  score,
  seedFouled,
  seedHold,
  seedSlipped,
  seedUnreaped,
  seedGpuCrash,
} from "./hawser.mjs";

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
  return fileURLToPath(new URL("./hawser.mjs", import.meta.url));
}

test("persist reap + children 1 + reaped → slipped", () => {
  const result = analyze({
    persistReap: true,
    slipped: true,
    fouled: false,
    children: 1,
    childrenAfterIdle: 1,
    reaped: true,
  });
  assert.equal(result.verdict, "slipped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fouled, false);
  assert.equal(result.slipped, true);
  assert.equal(isSlipped(result.ticket), true);
  assert.equal(isFouled(result.ticket), false);
});

test("1182 children + unreaped after idle disconnect → fouled", () => {
  const result = analyze({
    persistReap: false,
    slipped: false,
    fouled: true,
    children: 1182,
    childrenAfterIdle: 1182,
    reaped: false,
    idleDisconnect: true,
    unreaped: true,
    idleTimeout: true,
    warmlifecycle: true,
    processTree: true,
    rssClimb: true,
    gpuCrash: true,
    monotonic: true,
    perSessionCost: true,
  });
  assert.equal(result.verdict, "fouled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.fouled, true);
  assert.equal(isFouled(result.ticket), true);
  assert.ok(result.chips.includes("fouled"));
  assert.ok(result.chips.includes("unreaped"));
  assert.ok(result.chips.includes("monotonic"));
  assert.ok(!result.chips.includes("slipped"));
});

test("idle slipped is a hold; the bitts are a clean release", () => {
  const result = analyze(seedSlipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.idleWord, "slipped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fouled, false);
  assert.ok(result.chips.includes("slipped"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("fouled"));
  assert.equal(result.ticket.persistReap, true);
  assert.equal(result.ticket.children, CHILDREN_START);
  assert.doesNotMatch(
    result.idleWord,
    /verbatim|mangled|moored|aloft|resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify slipped", () => {
  assert.equal(classify(emptyTicket()), "slipped");
  assert.equal(classify(""), "slipped");
  assert.equal(classify(null), "slipped");
  assert.equal(decideSeed("slipped").verdict, "slipped");
  assert.equal(decideSeed("open").verdict, "slipped");
});

test("seeded fouled #91578 is alarm with unreaped tree", () => {
  const result = analyze(seedFouled());
  assert.equal(result.verdict, "fouled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("fouled"));
  assert.ok(result.chips.includes("unreaped"));
  assert.ok(result.chips.includes("idle-timeout"));
  assert.ok(result.chips.includes("warmlifecycle"));
  assert.ok(result.chips.includes("process-tree"));
  assert.ok(result.chips.includes("rss-climb"));
  assert.ok(result.chips.includes("gpu-crash"));
  assert.ok(result.chips.includes("monotonic"));
  assert.ok(result.chips.includes("per-session-cost"));
  assert.ok(!result.chips.includes("slipped"));
  assert.equal(result.ticket.reaped, false);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.appVersion, VERSION);
  assert.equal(result.ticket.children, CHILDREN_END);
  assert.equal(result.ticket.childrenRssGb, RSS_END_GB);
  assert.equal(result.ticket.gpuExit, GPU_EXIT);
});

test("data fixtures classify slipped vs fouled vs named chips", () => {
  assert.equal(classify(readData("slipped.json")), "slipped");
  assert.equal(classify(readData("fouled.json")), "fouled");
  assert.equal(classify(readData("unreaped.json")), "unreaped");
  assert.equal(classify(readData("idle-timeout.json")), "idle-timeout");
  assert.equal(classify(readData("91578.json")), "fouled");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("fouled seed is alarm; slipped / hold are holds", () => {
  assert.equal(score(seedFouled()).alarm, true);
  assert.equal(score(seedFouled()).hold, false);
  assert.equal(score(seedSlipped()).hold, true);
  assert.equal(score(seedSlipped()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedUnreaped()).alarm, true);
  assert.equal(score(seedGpuCrash()).alarm, true);
});

test("normalize seeds 91578 without ticket fields", () => {
  const ticket = normalize({ issue: 91578 });
  assert.equal(ticket.reaped, false);
  assert.equal(ticket.fouled, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "fouled");
});

test("score / decide / handle agree on fouled vs slipped", () => {
  assert.equal(score(seedFouled()).verdict, "fouled");
  assert.equal(decide(seedSlipped()).verdict, "slipped");
  const fail = handle(seedFouled());
  const hold = handle(seedSlipped());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91578/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /1182|MCP child|WarmLifecycle/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /slipped/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("fouled").verdict, "fouled");
  assert.equal(decideSeed(91578).verdict, "fouled");
  assert.equal(decideSeed("91578").verdict, "fouled");
  assert.equal(decideSeed("slipped").verdict, "slipped");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("unreaped").verdict, "unreaped");
  assert.equal(decideSeed("idle-timeout").verdict, "idle-timeout");
  assert.equal(decideSeed("warmlifecycle").verdict, "warmlifecycle");
  assert.equal(decideSeed("process-tree").verdict, "process-tree");
  assert.equal(decideSeed("rss-climb").verdict, "rss-climb");
  assert.equal(decideSeed("gpu-crash").verdict, "gpu-crash");
  assert.equal(decideSeed("monotonic").verdict, "monotonic");
  assert.equal(decideSeed("per-session-cost").verdict, "per-session-cost");
});

test("CLI scores fixture strings and data files", () => {
  const fouled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91578.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(fouled.status, 0, fouled.stderr);
  assert.equal(JSON.parse(fouled.stdout).verdict, "fouled");
  assert.equal(JSON.parse(fouled.stdout).alarm, true);

  const slipped = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/slipped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(slipped.status, 0, slipped.stderr);
  assert.equal(JSON.parse(slipped.stdout).verdict, "slipped");
  assert.equal(JSON.parse(slipped.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"children":1182,"reaped":false}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "fouled");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91578);
  assert.deepEqual([...PRIMARY_ISSUES], [91578]);
  assert.equal(COUSIN_ISSUE, 77593);
  assert.deepEqual([...COUSINS], [77593]);
  assert.equal(FILED_AT, "2026-09-02T19:08:38Z");
  assert.equal(REPORTER, "megzieberr");
  assert.equal(VERSION, "1.40609.1");
  assert.equal(PLATFORM, "Windows 11 Pro, build 10.0.26200, x64, 28 GB RAM");
  assert.equal(CHILDREN_START, 1);
  assert.equal(CHILDREN_END, 1182);
  assert.equal(RSS_START_MB, 38);
  assert.equal(RSS_END_GB, 32.9);
  assert.equal(IDLE_TIMEOUT_S, 900);
  assert.equal(GPU_EXIT, 101457950);
  assert.equal(MCP_COUNT, 10);
  assert.equal(TOOL_COUNT, 92);
  assert.equal(IDLE_WORD, "slipped");
  assert.equal(SEEDED_WORD, "fouled");
  assert.notEqual(IDLE_WORD, "fouled");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "mangled");
  assert.notEqual(IDLE_WORD, "moored");
  assert.notEqual(IDLE_WORD, "aloft");
  assert.notEqual(SEEDED_WORD, "resolved");
  assert.notEqual(SEEDED_WORD, "literal");
  assert.match(TITLE, /1,182 children/);
  assert.match(TITLE, /GPU process crash/);
  assert.match(ISSUE_URL, /91578/);
  assert.match(PHRASE, /Score the reap/);
  assert.match(PHRASE, /admit the warm children already fouled/);
  assert.match(HUB_LINE, /08:50 hawser/);
  assert.match(MARK, /08:50/);
  assert.match(MARK, /#131/);
  assert.match(MARK, /#91578/);
  assert.match(CONTRAST_NOTE, /1,182 CHILDREN/);
  assert.match(CONTRAST_NOTE, /megzieberr/);
  assert.match(CONTRAST_NOTE, /WarmLifecycle/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /Job Object/);
  assert.match(LOG_IDLE_DISCONNECT, /Idle timeout reached, disconnecting/);
  assert.equal(TELEMETRY[0].children, 1);
  assert.equal(TELEMETRY[TELEMETRY.length - 1].children, 1182);
  assert.equal(TELEMETRY[TELEMETRY.length - 1].rss, "32.9 GB");
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("has-repro"));
  assert.ok(NOT_PRODUCTS.includes("caret"));
  assert.ok(NOT_PRODUCTS.includes("buoy"));
  assert.ok(NOT_PRODUCTS.includes("solecism"));
  assert.ok(BANNED_NAMES.includes("Caret"));
  assert.ok(BANNED_NAMES.includes("Buoy"));
  assert.ok(FORBIDDEN_IDLE.includes("verbatim"));
  assert.ok(FORBIDDEN_IDLE.includes("moored"));
  assert.ok(FORBIDDEN_IDLE.includes("aloft"));
  assert.deepEqual([...HOLD_VERDICTS], ["slipped", "hold"]);
  assert.ok(CHIPS.includes("slipped"));
  assert.ok(CHIPS.includes("fouled"));
  assert.ok(CHIPS.includes("unreaped"));
  assert.ok(CHIPS.includes("warmlifecycle"));
  assert.ok(CHIPS.includes("process-tree"));
});

test("page is a dockyard hawser bench, not a proof-desk or harbor-buoy clone", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /08:50 \/ hermes catalog #131 \/ #91578/);
  assert.match(page, /Score the reap/);
  assert.match(page, /Pin idle slipped/);
  assert.match(page, /Pin seeded fouled/);
  assert.match(page, /admit the warm children already fouled/i);
  assert.match(page, /embed=1/);
  assert.match(page, /hawser|bitts|bollard|coil|reap/i);
  assert.doesNotMatch(page, /Playfair Display|DM Sans|Fragment Mono/);
  assert.doesNotMatch(page, /Petrona|Sora|Fira Code|Fira\+/);
  assert.doesNotMatch(page, /Source Serif 4|Work Sans|Inconsolata/);
  assert.doesNotMatch(page, /Spectral|Karla/);
  assert.doesNotMatch(page, /Cormorant Garamond|Figtree|Azeret Mono/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains Mono/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(
    page,
    /Score the argv|Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage|Score the attestation/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Hawser thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /1,182 CHILDREN|1182/);
  assert.match(readme, /#91578/);
  assert.match(readme, /slipped/);
  assert.match(readme, /fouled/);
  assert.match(readme, /megzieberr/);
  assert.match(readme, /NOT Caret/);
  assert.match(readme, /NOT Buoy/);
  assert.match(readme, /NOT Solecism/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /catalog #131/);
  assert.match(readme, /Score the reap/);
  assert.doesNotMatch(readme, /CMD\.EXE \/D \/S \/C/);
  assert.doesNotMatch(readme, /FLOATING LEVEL \(LAYER=3\)/);
  assert.doesNotMatch(readme, /LITERAL --git-common-dir/);
  assert.doesNotMatch(readme, /Idle word: \*\*verbatim\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*moored\*\*/);
});

test("cousin isolation stays slipped / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "slipped");
  assert.equal(decideSeed(77593).verdict, "slipped");
  assert.equal(classify({ issue: 77593 }), "slipped");
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "91578.json",
    "slipped.json",
    "fouled.json",
    "unreaped.json",
    "idle-timeout.json",
    "hold.json",
    "fixtures.json",
    "fingerprints.json",
    "telemetry.json",
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
