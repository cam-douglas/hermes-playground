import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CHIPS,
  CLI_VERSION,
  CONNECTOR,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INCIDENT_1_BATCH,
  INCIDENT_1_LANDED,
  INCIDENT_1_TIMEOUT,
  INCIDENT_2_BATCH,
  INCIDENT_2_LANDED,
  INCIDENT_2_TIMEOUT,
  INCIDENT_2_TOOLS,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SERVER,
  SERVER_CALLS,
  SERVER_CONFIGS,
  SESSION_HEADER,
  SSE_REPLY_FRAMES,
  TIMEOUT_PHRASE,
  TITLE,
  TRANSPORT,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isKeyed,
  isStrayed,
  normalize,
  score,
  seedClientTimeout,
  seedHold,
  seedKeyed,
  seedSiblingSlot,
  seedStrayed,
} from "./commutator.mjs";

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
  return fileURLToPath(new URL("./commutator.mjs", import.meta.url));
}

test("json-rpc id matched + no sibling slot → keyed", () => {
  const result = analyze({
    persistHold: true,
    keyed: true,
    strayed: false,
    jsonRpcIdMatched: true,
    siblingSlot: false,
    lateReply: false,
  });
  assert.equal(result.verdict, "keyed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.strayed, false);
  assert.equal(result.keyed, true);
  assert.equal(isKeyed(result.ticket), true);
  assert.equal(isStrayed(result.ticket), false);
});

test("timeout + payload in sibling slot → strayed", () => {
  const result = analyze({
    persistHold: false,
    keyed: false,
    strayed: true,
    timedOutTool: "get_tag_vocabulary",
    landedInTool: "get_park",
    siblingSlot: true,
    lateReply: true,
    transport: "streamable-http",
    platform: "macOS 26.5.2",
  });
  assert.equal(result.verdict, "strayed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.strayed, true);
  assert.equal(isStrayed(result.ticket), true);
  assert.ok(result.chips.includes("strayed"));
  assert.ok(result.chips.includes("sibling-slot"));
  assert.ok(result.chips.includes("late-reply"));
  assert.ok(!result.chips.includes("keyed"));
});

test("idle keyed is a hold; the drum keys", () => {
  const result = analyze(seedKeyed());
  assert.equal(result.verdict, "keyed");
  assert.equal(result.idleWord, "keyed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.strayed, false);
  assert.ok(result.chips.includes("keyed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("strayed"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.jsonRpcIdMatched, true);
  assert.equal(result.ticket.siblingSlot, false);
  assert.equal(result.ticket.lateReply, false);
  assert.doesNotMatch(
    result.idleWord,
    /scrubbed|pulled|enacted|withheld|masked|bled|crossed|homed|slipped|fouled|mangled|verbatim|unbolted|snagged/i,
  );
});

test("empty ticket and empty stdin classify keyed", () => {
  assert.equal(classify(emptyTicket()), "keyed");
  assert.equal(classify(""), "keyed");
  assert.equal(classify(null), "keyed");
  assert.equal(decideSeed("keyed").verdict, "keyed");
  assert.equal(decideSeed("open").verdict, "keyed");
});

test("seeded strayed #91958 is alarm with batch and slot chips", () => {
  const result = analyze(seedStrayed());
  assert.equal(result.verdict, "strayed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("strayed"));
  assert.ok(result.chips.includes("streamable-http"));
  assert.ok(result.chips.includes("mcp-session"));
  assert.ok(result.chips.includes("tools-call-batch"));
  assert.ok(result.chips.includes("json-rpc-id"));
  assert.ok(result.chips.includes("late-reply"));
  assert.ok(result.chips.includes("sibling-slot"));
  assert.ok(result.chips.includes("client-timeout"));
  assert.ok(result.chips.includes("server-exonerated"));
  assert.ok(result.chips.includes("sequential-clean"));
  assert.ok(result.chips.includes("well-formed-wrong"));
  assert.ok(!result.chips.includes("keyed"));
  assert.equal(result.ticket.timedOutTool, INCIDENT_1_TIMEOUT);
  assert.equal(result.ticket.landedInTool, INCIDENT_1_LANDED);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, CLI_VERSION);
  assert.match(result.ticket.timeoutMessage, /Tool call timed out waiting for server response/);
});

test("data fixtures classify keyed vs strayed vs named chips", () => {
  assert.equal(classify(readData("keyed.json")), "keyed");
  assert.equal(classify(readData("strayed.json")), "strayed");
  assert.equal(classify(readData("91958.json")), "strayed");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("batch12.json")), "tools-call-batch");
  assert.equal(classify(readData("batch3.json")), "tools-call-batch");
  assert.equal(classify(readData("timeout-tag-vocab.json")), "client-timeout");
  assert.equal(classify(readData("landed-get-park.json")), "sibling-slot");
  assert.equal(classify(readData("timeout-get-park.json")), "client-timeout");
  assert.equal(classify(readData("landed-compute-route.json")), "sibling-slot");
  assert.equal(classify(readData("sequential-clean.json")), "sequential-clean");
  assert.equal(classify(readData("server-exonerated.json")), "server-exonerated");
  assert.equal(classify(readData("streamable-http.json")), "streamable-http");
  assert.equal(classify(readData("mcp-session-id.json")), "mcp-session");
});

test("strayed seed is alarm; keyed / hold are holds", () => {
  assert.equal(score(seedStrayed()).alarm, true);
  assert.equal(score(seedStrayed()).hold, false);
  assert.equal(score(seedKeyed()).hold, true);
  assert.equal(score(seedKeyed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedSiblingSlot()).alarm, true);
  assert.equal(score(seedClientTimeout()).alarm, true);
});

test("normalize seeds 91958 without ticket fields", () => {
  const ticket = normalize({ issue: 91958 });
  assert.equal(ticket.siblingSlot, true);
  assert.equal(ticket.strayed, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "strayed");
});

test("score / decide / handle agree on strayed vs keyed", () => {
  assert.equal(score(seedStrayed()).verdict, "strayed");
  assert.equal(decide(seedKeyed()).verdict, "keyed");
  const fail = handle(seedStrayed());
  const hold = handle(seedKeyed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91958/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /sibling|late reply|Mcp-Session-Id|streamable-http/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /keyed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("strayed").verdict, "strayed");
  assert.equal(decideSeed(91958).verdict, "strayed");
  assert.equal(decideSeed("91958").verdict, "strayed");
  assert.equal(decideSeed("keyed").verdict, "keyed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("streamable-http").verdict, "streamable-http");
  assert.equal(decideSeed("mcp-session").verdict, "mcp-session");
  assert.equal(decideSeed("mcp-session-id").verdict, "mcp-session");
  assert.equal(decideSeed("tools-call-batch").verdict, "tools-call-batch");
  assert.equal(decideSeed("json-rpc-id").verdict, "json-rpc-id");
  assert.equal(decideSeed("late-reply").verdict, "late-reply");
  assert.equal(decideSeed("sibling-slot").verdict, "sibling-slot");
  assert.equal(decideSeed("client-timeout").verdict, "client-timeout");
  assert.equal(decideSeed("server-exonerated").verdict, "server-exonerated");
  assert.equal(decideSeed("sequential-clean").verdict, "sequential-clean");
  assert.equal(decideSeed("well-formed-wrong").verdict, "well-formed-wrong");
  assert.equal(decideSeed("has-clear-repro").verdict, "has-clear-repro");
  assert.equal(decideSeed("batch12").verdict, "tools-call-batch");
  assert.equal(decideSeed("batch3").verdict, "tools-call-batch");
});

test("CLI scores fixture strings and data files", () => {
  const strayed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91958.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(strayed.status, 0, strayed.stderr);
  assert.equal(JSON.parse(strayed.stdout).verdict, "strayed");
  assert.equal(JSON.parse(strayed.stdout).alarm, true);

  const keyed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/keyed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(keyed.status, 0, keyed.stderr);
  assert.equal(JSON.parse(keyed.stdout).verdict, "keyed");
  assert.equal(JSON.parse(keyed.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input:
        '{"timedOutTool":"get_tag_vocabulary","landedInTool":"get_park","siblingSlot":true,"lateReply":true}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "strayed");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91958);
  assert.deepEqual([...PRIMARY_ISSUES], [91958]);
  assert.equal(COUSIN_ISSUE, 91414);
  assert.deepEqual([...COUSINS], [91414, 92046, 92065]);
  assert.equal(FILED_AT, "2026-09-04T02:07:13Z");
  assert.equal(REPORTER, "keithkessleraz");
  assert.equal(PLATFORM, "macOS 26.5.2");
  assert.equal(CLI_VERSION, "2.1.185");
  assert.equal(SERVER, "FastMCP 3.2.4");
  assert.equal(CONNECTOR, "claude.ai connector");
  assert.equal(TRANSPORT, "streamable-http");
  assert.equal(SESSION_HEADER, "Mcp-Session-Id");
  assert.equal(TIMEOUT_PHRASE, "Tool call timed out waiting for server response");
  assert.equal(INCIDENT_1_BATCH, 12);
  assert.equal(INCIDENT_1_TIMEOUT, "get_tag_vocabulary");
  assert.equal(INCIDENT_1_LANDED, "get_park");
  assert.equal(INCIDENT_2_BATCH, 3);
  assert.equal(INCIDENT_2_TIMEOUT, "get_park");
  assert.equal(INCIDENT_2_LANDED, "compute_route");
  assert.deepEqual([...INCIDENT_2_TOOLS], ["get_park", "search_waypoints", "compute_route"]);
  assert.equal(SERVER_CONFIGS, 28);
  assert.equal(SERVER_CALLS, 1200);
  assert.equal(SSE_REPLY_FRAMES, 0);
  assert.equal(IDLE_WORD, "keyed");
  assert.equal(SEEDED_WORD, "strayed");
  assert.notEqual(IDLE_WORD, "strayed");
  assert.notEqual(IDLE_WORD, "scrubbed");
  assert.notEqual(IDLE_WORD, "pulled");
  assert.notEqual(IDLE_WORD, "enacted");
  assert.notEqual(IDLE_WORD, "withheld");
  assert.notEqual(SEEDED_WORD, "scrubbed");
  assert.match(TITLE, /streamable-http/);
  assert.match(TITLE, /sibling call's slot/);
  assert.match(ISSUE_URL, /91958/);
  assert.match(PHRASE, /Score the drum/);
  assert.match(PHRASE, /admit the batch already lied/);
  assert.match(HUB_LINE, /22:50 commutator/);
  assert.match(HUB_LINE, /a commutator that seats a late reply on a sibling segment is not a timeout/);
  assert.match(MARK, /22:50/);
  assert.match(MARK, /#136/);
  assert.match(MARK, /#91958/);
  assert.match(CONTRAST_NOTE, /2\.1\.185/);
  assert.match(CONTRAST_NOTE, /keithkessleraz/);
  assert.match(CONTRAST_NOTE, /26\.5\.2/);
  assert.match(CONTRAST_NOTE, /FastMCP 3\.2\.4/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /JSON-RPC id/);
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("hectograph"));
  assert.ok(NOT_PRODUCTS.includes("placet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(BANNED_NAMES.includes("Hectograph"));
  assert.ok(BANNED_NAMES.includes("Placet"));
  assert.ok(BANNED_NAMES.includes("Frisket"));
  assert.ok(FORBIDDEN_IDLE.includes("scrubbed"));
  assert.ok(FORBIDDEN_IDLE.includes("pulled"));
  assert.ok(FORBIDDEN_IDLE.includes("enacted"));
  assert.ok(FORBIDDEN_IDLE.includes("withheld"));
  assert.deepEqual([...HOLD_VERDICTS], ["keyed", "hold"]);
  assert.ok(CHIPS.includes("keyed"));
  assert.ok(CHIPS.includes("strayed"));
  assert.ok(CHIPS.includes("sibling-slot"));
  assert.ok(CHIPS.includes("late-reply"));
  assert.ok(CHIPS.includes("server-exonerated"));
});

test("page is a rotary brush-gear atelier, not a leftover clone", () => {
  const page = readPage();
  assert.match(page, /Source Serif 4/);
  assert.match(page, /Libre Franklin/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /22:50 \/ hermes catalog #136 \/ #91958/);
  assert.match(page, /Key the drum/);
  assert.match(page, /Pin idle keyed/);
  assert.match(page, /Pin seeded strayed/);
  assert.match(page, /admit the batch already lied/i);
  assert.match(page, /embed=1/);
  assert.match(page, /commutator|brush|drum|segment/i);
  assert.doesNotMatch(page, /Spectral|Figtree/);
  assert.doesNotMatch(page, /Fraunces|Outfit|Fira Code/);
  assert.doesNotMatch(page, /Libre Baskerville|Karla|IBM Plex Mono/);
  assert.doesNotMatch(page, /Instrument Serif|Albert Sans|Spline Sans Mono/);
  assert.doesNotMatch(page, /Playfair Display|DM Sans|Fragment Mono/);
  assert.doesNotMatch(page, /Petrona|Sora/);
  assert.doesNotMatch(
    page,
    /Score the gelatin|Score the chamber|Score the mask|Score the strike|Score the reap|Score the argv|Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Commutator thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /streamable-http/);
  assert.match(readme, /#91958/);
  assert.match(readme, /keyed/);
  assert.match(readme, /strayed/);
  assert.match(readme, /keithkessleraz/);
  assert.match(readme, /NOT Hectograph/);
  assert.match(readme, /NOT Placet/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /Source Serif 4/);
  assert.match(readme, /Libre Franklin/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /catalog #136/);
  assert.match(readme, /Score the drum/);
  assert.doesNotMatch(readme, /Idle word: \*\*scrubbed\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*pulled\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*withheld\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*enacted\*\*/);
  assert.doesNotMatch(readme, /You can now start coding/);
  assert.doesNotMatch(readme, /OTEL_LOG_TOOL_/);
  assert.doesNotMatch(readme, /Write\|Edit\|MultiEdit\|NotebookEdit/);
});

test("cousin isolation stays keyed / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "keyed");
  assert.equal(decideSeed(91414).verdict, "keyed");
  assert.equal(classify({ issue: 91414 }), "keyed");
  assert.equal(classify({ issue: 92046 }), "keyed");
  assert.equal(classify({ issue: 92065 }), "keyed");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 91958);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [91414, 92046, 92065],
  );
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials or exploit payloads in fixtures or page", () => {
  const files = [
    "91958.json",
    "keyed.json",
    "strayed.json",
    "batch12.json",
    "batch3.json",
    "timeout-tag-vocab.json",
    "landed-get-park.json",
    "timeout-get-park.json",
    "landed-compute-route.json",
    "sequential-clean.json",
    "server-exonerated.json",
    "streamable-http.json",
    "mcp-session-id.json",
    "hold.json",
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
