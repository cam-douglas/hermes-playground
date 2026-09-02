import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CHIPS,
  CHILD_CMDLINE,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DEMO_PASSWORD,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  MCP_SERVER,
  METACHARS,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  RECEIVED_CONSUMED,
  RECEIVED_EXTRA,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  WRAPPER,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isMangled,
  isVerbatim,
  normalize,
  score,
  seedCareted,
  seedHold,
  seedMangled,
  seedReparsed,
  seedVerbatim,
} from "./caret.mjs";

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
  return fileURLToPath(new URL("./caret.mjs", import.meta.url));
}

test("persist argv + matching passwords + no wrapper → verbatim", () => {
  const result = analyze({
    persistArgv: true,
    verbatim: true,
    mangled: false,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: DEMO_PASSWORD,
    cmdWrapped: false,
  });
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.mangled, false);
  assert.equal(result.verbatim, true);
  assert.equal(isVerbatim(result.ticket), true);
  assert.equal(isMangled(result.ticket), false);
});

test("cmd wrapper + diverging passwords → mangled", () => {
  const result = analyze({
    persistArgv: false,
    verbatim: false,
    mangled: true,
    configuredPassword: DEMO_PASSWORD,
    receivedPassword: RECEIVED_CONSUMED,
    cmdWrapped: true,
    reparsed: true,
    careted: true,
    npxShim: true,
    metachar: true,
    extraCaret: true,
    nodeBypass: true,
  });
  assert.equal(result.verdict, "mangled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.mangled, true);
  assert.equal(isMangled(result.ticket), true);
  assert.ok(result.chips.includes("mangled"));
  assert.ok(result.chips.includes("careted"));
  assert.ok(result.chips.includes("reparsed"));
  assert.ok(!result.chips.includes("verbatim"));
});

test("idle verbatim is a hold; the galley is a faithful handoff", () => {
  const result = analyze(seedVerbatim());
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.idleWord, "verbatim");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.mangled, false);
  assert.ok(result.chips.includes("verbatim"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("mangled"));
  assert.equal(result.ticket.persistArgv, true);
  assert.equal(result.ticket.configuredPassword, DEMO_PASSWORD);
  assert.equal(result.ticket.receivedPassword, DEMO_PASSWORD);
  assert.doesNotMatch(
    result.idleWord,
    /moored|aloft|resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify verbatim", () => {
  assert.equal(classify(emptyTicket()), "verbatim");
  assert.equal(classify(""), "verbatim");
  assert.equal(classify(null), "verbatim");
  assert.equal(decideSeed("verbatim").verdict, "verbatim");
  assert.equal(decideSeed("open").verdict, "verbatim");
});

test("seeded mangled #91526 is alarm with cmd.exe reparse", () => {
  const result = analyze(seedMangled());
  assert.equal(result.verdict, "mangled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("mangled"));
  assert.ok(result.chips.includes("careted"));
  assert.ok(result.chips.includes("reparsed"));
  assert.ok(result.chips.includes("cmd-wrapper"));
  assert.ok(result.chips.includes("npx-shim"));
  assert.ok(result.chips.includes("metachar"));
  assert.ok(result.chips.includes("extra-caret"));
  assert.ok(result.chips.includes("node-bypass"));
  assert.ok(!result.chips.includes("verbatim"));
  assert.equal(result.ticket.cmdWrapped, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.configuredPassword, DEMO_PASSWORD);
  assert.equal(result.ticket.receivedPassword, RECEIVED_CONSUMED);
  assert.equal(result.ticket.wrapper, WRAPPER);
  assert.equal(result.ticket.mcpServer, MCP_SERVER);
});

test("data fixtures classify verbatim vs mangled vs named chips", () => {
  assert.equal(classify(readData("verbatim.json")), "verbatim");
  assert.equal(classify(readData("mangled.json")), "mangled");
  assert.equal(classify(readData("careted.json")), "careted");
  assert.equal(classify(readData("reparsed.json")), "reparsed");
  assert.equal(classify(readData("91526.json")), "mangled");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("mangled seed is alarm; verbatim / hold are holds", () => {
  assert.equal(score(seedMangled()).alarm, true);
  assert.equal(score(seedMangled()).hold, false);
  assert.equal(score(seedVerbatim()).hold, true);
  assert.equal(score(seedVerbatim()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedCareted()).alarm, true);
  assert.equal(score(seedReparsed()).alarm, true);
});

test("normalize seeds 91526 without ticket fields", () => {
  const ticket = normalize({ issue: 91526 });
  assert.equal(ticket.cmdWrapped, true);
  assert.equal(ticket.mangled, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "mangled");
});

test("score / decide / handle agree on mangled vs verbatim", () => {
  assert.equal(score(seedMangled()).verdict, "mangled");
  assert.equal(decide(seedVerbatim()).verdict, "verbatim");
  const fail = handle(seedMangled());
  const hold = handle(seedVerbatim());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91526/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /cmd\.exe|password|npx/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /verbatim/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("mangled").verdict, "mangled");
  assert.equal(decideSeed(91526).verdict, "mangled");
  assert.equal(decideSeed("91526").verdict, "mangled");
  assert.equal(decideSeed("verbatim").verdict, "verbatim");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("careted").verdict, "careted");
  assert.equal(decideSeed("reparsed").verdict, "reparsed");
  assert.equal(decideSeed("cmd-wrapper").verdict, "cmd-wrapper");
  assert.equal(decideSeed("npx-shim").verdict, "npx-shim");
  assert.equal(decideSeed("metachar").verdict, "metachar");
  assert.equal(decideSeed("password-split").verdict, "password-split");
  assert.equal(decideSeed("extra-caret").verdict, "extra-caret");
  assert.equal(decideSeed("node-bypass").verdict, "node-bypass");
});

test("CLI scores fixture strings and data files", () => {
  const mangled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91526.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(mangled.status, 0, mangled.stderr);
  assert.equal(JSON.parse(mangled.stdout).verdict, "mangled");
  assert.equal(JSON.parse(mangled.stdout).alarm, true);

  const verbatim = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/verbatim.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(verbatim.status, 0, verbatim.stderr);
  assert.equal(JSON.parse(verbatim.stdout).verdict, "verbatim");
  assert.equal(JSON.parse(verbatim.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input: '{"configuredPassword":"P@ss^&w0rd","receivedPassword":"P@ss&w0rd"}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "mangled");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91526);
  assert.deepEqual([...PRIMARY_ISSUES], [91526]);
  assert.equal(COUSIN_ISSUE, 58510);
  assert.deepEqual([...COUSINS], [58510, 91581, 90495]);
  assert.equal(FILED_AT, "2026-09-02T14:33:51Z");
  assert.equal(REPORTER, "Maomaoxion");
  assert.equal(PLATFORM, "Windows 11 (native, not WSL)");
  assert.equal(WRAPPER, "cmd.exe /d /s /c");
  assert.equal(DEMO_PASSWORD, "P@ss^&w0rd");
  assert.equal(RECEIVED_CONSUMED, "P@ss&w0rd");
  assert.equal(RECEIVED_EXTRA, "P@ss^^&w0rd");
  assert.equal(MCP_SERVER, "universal-db-mcp");
  assert.deepEqual([...METACHARS], ["^", "&", "|", "<", ">", "%"]);
  assert.equal(IDLE_WORD, "verbatim");
  assert.equal(SEEDED_WORD, "mangled");
  assert.notEqual(IDLE_WORD, "mangled");
  assert.notEqual(IDLE_WORD, "moored");
  assert.notEqual(IDLE_WORD, "aloft");
  assert.notEqual(IDLE_WORD, "resolved");
  assert.notEqual(SEEDED_WORD, "literal");
  assert.notEqual(SEEDED_WORD, "sealed");
  assert.match(TITLE, /cmd\.exe/);
  assert.match(TITLE, /password arguments/);
  assert.match(ISSUE_URL, /91526/);
  assert.match(PHRASE, /Score the argv/);
  assert.match(PHRASE, /admit the wrapper already careted/);
  assert.match(HUB_LINE, /07:50 caret/);
  assert.match(MARK, /07:50/);
  assert.match(MARK, /#130/);
  assert.match(MARK, /#91526/);
  assert.match(CONTRAST_NOTE, /CMD\.EXE/);
  assert.match(CONTRAST_NOTE, /Maomaoxion/);
  assert.match(CONTRAST_NOTE, /P@ss\^&w0rd/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /cmd\.exe/);
  assert.match(CHILD_CMDLINE, /cmd\.exe \/d \/s \/c/);
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("has-repro"));
  assert.ok(NOT_PRODUCTS.includes("buoy"));
  assert.ok(NOT_PRODUCTS.includes("solecism"));
  assert.ok(NOT_PRODUCTS.includes("coffer"));
  assert.ok(BANNED_NAMES.includes("Buoy"));
  assert.ok(BANNED_NAMES.includes("Solecism"));
  assert.ok(FORBIDDEN_IDLE.includes("moored"));
  assert.ok(FORBIDDEN_IDLE.includes("aloft"));
  assert.ok(FORBIDDEN_IDLE.includes("resolved"));
  assert.deepEqual([...HOLD_VERDICTS], ["verbatim", "hold"]);
  assert.ok(CHIPS.includes("verbatim"));
  assert.ok(CHIPS.includes("mangled"));
  assert.ok(CHIPS.includes("careted"));
  assert.ok(CHIPS.includes("reparsed"));
  assert.ok(CHIPS.includes("cmd-wrapper"));
});

test("page is a proof desk, not a harbor-buoy or usage-desk clone", () => {
  const page = readPage();
  assert.match(page, /Playfair Display/);
  assert.match(page, /DM Sans/);
  assert.match(page, /Fragment Mono/);
  assert.match(page, /07:50 \/ hermes catalog #130 \/ #91526/);
  assert.match(page, /Score the argv/);
  assert.match(page, /Pin idle verbatim/);
  assert.match(page, /Pin seeded mangled/);
  assert.match(page, /admit the wrapper already careted/i);
  assert.match(page, /embed=1/);
  assert.match(page, /proof desk|galley|typesetter|composing/i);
  assert.doesNotMatch(page, /Petrona|Sora|Fira Code|Fira\+/);
  assert.doesNotMatch(page, /Source Serif 4|Work Sans|Inconsolata/);
  assert.doesNotMatch(page, /Spectral|Karla|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond|Figtree|Azeret Mono/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains Mono/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3/);
  assert.doesNotMatch(
    page,
    /Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage|Score the attestation/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Caret thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /CMD\.EXE/);
  assert.match(readme, /#91526/);
  assert.match(readme, /verbatim/);
  assert.match(readme, /mangled/);
  assert.match(readme, /Maomaoxion/);
  assert.match(readme, /NOT Buoy/);
  assert.match(readme, /NOT Solecism/);
  assert.match(readme, /NOT Coffer/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /Fragment Mono/);
  assert.match(readme, /catalog #130/);
  assert.match(readme, /Score the argv/);
  assert.doesNotMatch(readme, /FLOATING LEVEL \(LAYER=3\)/);
  assert.doesNotMatch(readme, /LITERAL --git-common-dir/);
  assert.doesNotMatch(readme, /WINDOWS OAUTH FILE-STORE/);
  assert.doesNotMatch(readme, /Idle word: \*\*moored\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*aloft\*\*/);
});

test("cousin isolation stays verbatim / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "verbatim");
  assert.equal(decideSeed(58510).verdict, "verbatim");
  assert.equal(decideSeed(91581).verdict, "verbatim");
  assert.equal(decideSeed(90495).verdict, "verbatim");
  assert.equal(classify({ issue: 58510 }), "verbatim");
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "91526.json",
    "verbatim.json",
    "mangled.json",
    "careted.json",
    "reparsed.json",
    "hold.json",
    "fixtures.json",
    "fingerprints.json",
  ];
  for (const name of files) {
    const raw = readFileSync(
      fileURLToPath(new URL(`../data/${name}`, import.meta.url)),
      "utf8",
    );
    assert.doesNotMatch(raw, /sk-ant-|ort01-|oat01-/);
    assert.match(raw, /FAKE|P@ss\^&w0rd|demo/i);
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
  assert.match(page, /P@ss\^&w0rd/);
});
