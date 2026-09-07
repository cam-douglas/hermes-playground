import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  analyze,
  classify,
  score,
  scoreFields,
  handle,
  seeds,
  seedCorked,
  seedRelayed,
  fingerprint,
  signals,
  corkedSignal,
  relayedSignal,
  dualPurposeSignal,
  overbroadSignal,
  preToolUseSignal,
  mcpGapSignal,
  footerSignal,
  toolSearchSignal,
  listAgentsSignal,
  cliFlagSignal,
  desktopBanSignal,
  timelineSignal,
  continuationRelayed,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  DECKS,
  IDLE_WORD,
  SEEDED_WORD
} from "./speakpipe.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92646 fixture scores corked", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92646.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "corked");
  assert.equal(out.corked, true);
  assert.ok(out.chips.includes("corked"));
});

test("empty / idle probe is corked", () => {
  const out = decide({});
  assert.equal(out.verdict, "corked");
  assert.equal(out.corked, true);
  assert.equal(out.relayed, false);
  assert.ok(ALARM.has("corked"));
  assert.equal(IDLE_WORD, "corked");
});

test("seeded corked scores corked", () => {
  const out = decide(seedCorked());
  assert.equal(out.verdict, "corked");
  assert.equal(out.corked, true);
  assert.ok(out.chips.includes("corked"));
  assert.ok(out.chips.includes("overbroad-disallow"));
  assert.ok(out.chips.includes("footer-still-advertises"));
});

test("relayed seed is a hold", () => {
  const out = decide(seedRelayed());
  assert.equal(out.verdict, "relayed");
  assert.equal(out.relayed, true);
  assert.equal(out.corked, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "relayed");
});

test("dual-purpose-tool chip", () => {
  const out = decide({ seed: "dual-purpose-tool", dualPurposeTool: true });
  assert.equal(out.verdict, "dual-purpose-tool");
  assert.equal(out.corked, true);
  assert.match(out.reasons.join(" "), /two unrelated jobs/);
  assert.match(out.reasons.join(" "), /context intact/);
});

test("overbroad-disallow chip", () => {
  const out = decide({ seed: "overbroad-disallow", overbroadDisallow: true });
  assert.equal(out.verdict, "overbroad-disallow");
  assert.ok(out.chips.includes("overbroad-disallow"));
  assert.match(out.reasons.join(" "), /disallowedTools SendMessage/);
});

test("pretooluse-auto-deny chip", () => {
  const out = decide({ seed: "pretooluse-auto-deny", preToolUseAutoDeny: true });
  assert.equal(out.verdict, "pretooluse-auto-deny");
  assert.match(out.reasons.join(" "), /desktop_ccd_permission_auto_denied/);
  assert.match(out.reasons.join(" "), /cli_native_send_message/);
});

test("mcp-replacement-gap chip", () => {
  const out = decide({ seed: "mcp-replacement-gap", mcpReplacementGap: true });
  assert.equal(out.verdict, "mcp-replacement-gap");
  assert.match(out.reasons.join(" "), /mcp__ccd_session_mgmt__send_message/);
  assert.match(out.reasons.join(" "), /does not cover/);
});

test("footer-still-advertises chip", () => {
  const out = decide({ seed: "footer-still-advertises", footerStillAdvertises: true });
  assert.equal(out.verdict, "footer-still-advertises");
  assert.match(out.reasons.join(" "), /use SendMessage with to:/);
});

test("toolsearch-empty chip", () => {
  const out = decide({ seed: "toolsearch-empty", toolSearchEmpty: true });
  assert.equal(out.verdict, "toolsearch-empty");
  assert.match(out.reasons.join(" "), /No matching deferred tools found/);
});

test("listagents-dead-instruction chip", () => {
  const out = decide({ seed: "listagents-dead-instruction", listAgentsDeadInstruction: true });
  assert.equal(out.verdict, "listagents-dead-instruction");
  assert.match(out.reasons.join(" "), /29 reachable peers/);
  assert.match(out.reasons.join(" "), /ListAgents/);
});

test("cli-flag-honoured chip", () => {
  const out = decide({ seed: "cli-flag-honoured", cliFlagHonoured: true });
  assert.equal(out.verdict, "cli-flag-honoured");
  assert.match(out.reasons.join(" "), /CLI version is not the variable/);
});

test("desktop-app-ban chip", () => {
  const out = decide({ seed: "desktop-app-ban", desktopAppBan: true });
  assert.equal(out.verdict, "desktop-app-ban");
  assert.match(out.reasons.join(" "), /1\.46388\.4/);
});

test("timeline-zero-after-1.46388.4 chip", () => {
  const out = decide({ seed: "timeline-zero-after-1.46388.4", timelineZeroAfter: true });
  assert.equal(out.verdict, "timeline-zero-after-1.46388.4");
  assert.match(out.reasons.join(" "), /2026-09-06/);
  assert.match(out.reasons.join(" "), /zero/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [89543, 92583, 92624] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#89543/);
  assert.match(out.reasons.join(" "), /#92583/);
  assert.match(out.reasons.join(" "), /#92624/);
  assert.match(out.reasons.join(" "), /Afterimage/);
  assert.match(out.reasons.join(" "), /Limber/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "corked");
  assert.equal(score(seedRelayed()).verdict, "relayed");
  assert.equal(handle('{"seed":"corked","corked":true}').verdict, "corked");
  assert.equal(handle({ seed: "relayed", relayed: true }).verdict, "relayed");
  const bag = seeds();
  assert.equal(decide(bag.corked).verdict, "corked");
  assert.equal(decide(bag.relayed).verdict, "relayed");
  assert.equal(scoreFields(seedCorked()).corked, true);
});

test("fingerprint and signals detect speakpipe facts", () => {
  assert.equal(corkedSignal("ALARM: pipe corked; --disallowedTools SendMessage"), true);
  assert.equal(relayedSignal("continuation hail can pass; uncork the speakpipe"), true);
  assert.equal(dualPurposeSignal("two unrelated jobs; continuing a previously spawned"), true);
  assert.equal(overbroadSignal("overbroad --disallowedTools SendMessage whole tool"), true);
  assert.equal(
    preToolUseSignal("desktop_ccd_permission_auto_denied reason cli_native_send_message PreToolUse"),
    true
  );
  assert.equal(
    mcpGapSignal("mcp__ccd_session_mgmt__send_message replacement does not cover"),
    true
  );
  assert.equal(footerSignal("use SendMessage with to: '<id>' to continue this agent"), true);
  assert.equal(toolSearchSignal("select:SendMessage No matching deferred tools found"), true);
  assert.equal(listAgentsSignal("ListAgents lists 29 reachable peers"), true);
  assert.equal(cliFlagSignal("cli-flag-honoured; CLI version is not the variable"), true);
  assert.equal(desktopBanSignal("Desktop 1.46388.4 desktop-app-ban"), true);
  assert.equal(timelineSignal("timeline-zero-after-1.46388.4 last real; 2026-09-06 zero calls"), true);
  const hits = signals(seedCorked());
  assert.equal(hits.overbroad || hits.footer || hits.toolSearch, true);
  const print = fingerprint(seedCorked());
  assert.equal(print.overbroad, true);
  assert.equal(print.corkedHit, true);
});

test("fingerprint scores relayed clean continuation path", () => {
  const print = fingerprint(seedRelayed());
  assert.equal(print.relayedClean, true);
  assert.equal(print.corkedHit, false);
  const out = decide({ ...seedRelayed(), seed: "relayed" });
  assert.equal(out.relayed, true);
  assert.equal(out.verdict, "relayed");
  assert.equal(continuationRelayed(seedRelayed()), true);
  assert.equal(continuationRelayed(seedCorked()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedCorked());
  assert.equal(idle.corked, true);
  const hold = classify(seedRelayed());
  assert.equal(hold.relayed, true);
});

test("decks are bridge / cork / crew", () => {
  assert.ok(DECKS.length === 3);
  assert.ok(DECKS.some((row) => row.id === "bridge" && row.open === true));
  assert.ok(DECKS.some((row) => row.id === "cork" && row.open === false));
  assert.ok(DECKS.some((row) => row.id === "crew" && row.open === false));
});

test("measured facts from #92646", () => {
  assert.equal(MEASURED.issue, 92646);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:agents",
    "area:desktop"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T11:03:56Z");
  assert.equal(MEASURED.updated, "2026-09-07T11:05:00Z");
  assert.equal(MEASURED.reporter, "Had01");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Windows 11 Pro 26200");
  assert.equal(MEASURED.desktop, "1.46388.4");
  assert.equal(MEASURED.bundledCli, "2.1.260");
  assert.equal(MEASURED.pathCli, "2.1.263");
  assert.equal(MEASURED.disallowedTools, "SendMessage");
  assert.equal(MEASURED.preToolUseHook, "desktop_ccd_permission_auto_denied");
  assert.equal(MEASURED.preToolUseReason, "cli_native_send_message");
  assert.equal(MEASURED.mcpReplacement, "mcp__ccd_session_mgmt__send_message");
  assert.equal(MEASURED.toolSearchResult, "No matching deferred tools found");
  assert.equal(MEASURED.listAgentsPeerCount, 29);
  assert.equal(MEASURED.sendMessageCallsByVersion["2.1.258"].calls, 84);
  assert.equal(MEASURED.sendMessageCallsByVersion["2.1.260"].calls, 0);
  assert.equal(MEASURED.cliHonoursFlag, true);
  assert.equal(IDLE_WORD, "corked");
  assert.equal(SEEDED_WORD, "relayed");
});

test("HOLD is relayed; ALARM is corked family", () => {
  assert.ok(HOLD.has("relayed"));
  assert.equal(ALARM.has("relayed"), false);
  for (const chip of [
    "corked",
    "dual-purpose-tool",
    "overbroad-disallow",
    "pretooluse-auto-deny",
    "mcp-replacement-gap",
    "footer-still-advertises",
    "toolsearch-empty",
    "listagents-dead-instruction",
    "cli-flag-honoured",
    "desktop-app-ban",
    "timeline-zero-after-1.46388.4",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "corked",
    "relayed",
    "dual-purpose-tool",
    "overbroad-disallow",
    "pretooluse-auto-deny",
    "mcp-replacement-gap",
    "footer-still-advertises",
    "toolsearch-empty",
    "listagents-dead-instruction",
    "cli-flag-honoured",
    "desktop-app-ban",
    "timeline-zero-after-1.46388.4",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 89543 / 92583 / 92624", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [89543, 92583, 92624]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "corked.json",
    "relayed.json",
    "92646.json",
    "dual-purpose-tool.json",
    "overbroad-disallow.json",
    "pretooluse-auto-deny.json",
    "mcp-replacement-gap.json",
    "footer-still-advertises.json",
    "toolsearch-empty.json",
    "listagents-dead-instruction.json",
    "cli-flag-honoured.json",
    "desktop-app-ban.json",
    "timeline-zero-after-1.46388.4.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92646|speakpipe|corked|relayed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "corked");
  assert.equal(index.narrativeNotFixture.seeded, "relayed");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:desktop"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a brass speakpipe bench, not a clone", () => {
  assert.match(page, /Petrona/);
  assert.match(page, /Lexend/);
  assert.match(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Chakra Petch/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.match(page, /corked/);
  assert.match(page, /relayed/);
  assert.match(page, /#92646/);
  assert.match(page, /Speakpipe/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /21:50 \/ hermes catalog #205 \/ #92646/);
  assert.match(page, /Score the speakpipe/);
  assert.match(page, /Pin idle corked/);
  assert.match(page, /Pin seeded relayed/);
  assert.match(page, /Admit relayed/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to relayed/);
  assert.match(page, /speakpipe|voicepipe|speaking.tube|below-decks/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /89543/);
  assert.match(page, /92583/);
  assert.match(page, /92624/);
  assert.match(page, /mcp__ccd_session_mgmt__send_message/);
  assert.match(page, /--disallowedTools/);
  assert.match(page, /desktop_ccd_permission_auto_denied/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /phosphor persistence/i);
  assert.doesNotMatch(page, /afterimage test card/i);
  assert.doesNotMatch(page, /limber-hole/i);
  assert.doesNotMatch(page, /bilge well/i);
  assert.doesNotMatch(page, /wheel-chock/i);
  assert.doesNotMatch(page, /oak wedge/i);
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /locomotive/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /wet-plate/i);
  assert.doesNotMatch(page, /\blatent\b/);
  assert.doesNotMatch(page, /\bflushed\b/);
  assert.doesNotMatch(page, /\bsilted\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\bbarred\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
});

test("README anti-clone encodes the speakpipe thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /SendMessage/);
  assert.match(readme, /1\.46388\.4/);
  assert.match(readme, /Had01/);
  assert.match(readme, /#89543/);
  assert.match(readme, /#92583/);
  assert.match(readme, /#92624/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/speakpipe\//);
  assert.match(readme, /Score corked or admit relayed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(hookReadme, /corked/);
  assert.match(hookReadme, /relayed/);
  assert.match(dataReadme, /corked/);
  assert.match(dataReadme, /relayed/);
});
