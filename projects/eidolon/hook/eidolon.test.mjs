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
  seedHaunted,
  seedStaged,
  fingerprint,
  enoentSignal,
  stagedPathSignal,
  syntheticNoticeSignal,
  idleTurnSignal,
  cacheIntactSignal,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  IDLE_WORD,
  SEEDED_WORD
} from "./eidolon.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92601 fixture scores haunted", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92601.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "haunted");
  assert.equal(out.haunted, true);
  assert.ok(out.chips.includes("haunted"));
});

test("empty / idle probe is haunted", () => {
  const out = decide({});
  assert.equal(out.verdict, "haunted");
  assert.equal(out.haunted, true);
  assert.equal(out.staged, false);
  assert.ok(ALARM.has("haunted"));
  assert.equal(IDLE_WORD, "haunted");
});

test("seeded haunted scores haunted", () => {
  const out = decide(seedHaunted());
  assert.equal(out.verdict, "haunted");
  assert.equal(out.haunted, true);
  assert.ok(out.chips.includes("haunted"));
  assert.ok(out.chips.includes("enoent-staging"));
  assert.ok(out.chips.includes("synthetic-security-notification"));
});

test("staged seed is a hold", () => {
  const out = decide(seedStaged());
  assert.equal(out.verdict, "staged");
  assert.equal(out.staged, true);
  assert.equal(out.haunted, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "staged");
});

test("enoent-staging chip", () => {
  const out = decide({ seed: "enoent-staging", enoentStaging: true });
  assert.equal(out.verdict, "enoent-staging");
  assert.equal(out.haunted, true);
  assert.match(out.reasons.join(" "), /ENOENT/);
  assert.match(out.reasons.join(" "), /security_reminder_hook\.py/);
  assert.match(out.reasons.join(" "), /plugin_01YBNfaNwQztYsnUydt8m47G/);
});

test("infinite-retry chip", () => {
  const out = decide({ seed: "infinite-retry", infiniteRetry: true });
  assert.equal(out.verdict, "infinite-retry");
  assert.ok(out.chips.includes("infinite-retry"));
  assert.match(out.reasons.join(" "), /45\+/);
  assert.match(out.reasons.join(" "), /Idle\./);
});

test("synthetic-security-notification chip", () => {
  const out = decide({
    seed: "synthetic-security-notification",
    syntheticSecurityNotification: true
  });
  assert.equal(out.verdict, "synthetic-security-notification");
  assert.match(out.reasons.join(" "), /Background security review found issues/);
  assert.match(out.reasons.join(" "), /task-notification/);
});

test("restart-uncleared chip", () => {
  const out = decide({ seed: "restart-uncleared", restartUncleared: true });
  assert.equal(out.verdict, "restart-uncleared");
  assert.match(out.reasons.join(" "), /three times/);
  assert.match(out.reasons.join(" "), /rpm/);
});

test("real-cache-intact chip", () => {
  const out = decide({ seed: "real-cache-intact", realCacheIntact: true });
  assert.equal(out.verdict, "real-cache-intact");
  assert.match(out.reasons.join(" "), /security-guidance\/2\.0\.7/);
  assert.match(out.reasons.join(" "), /well-formed/);
});

test("manifest-lists-plugin chip", () => {
  const out = decide({ seed: "manifest-lists-plugin", manifestListsPlugin: true });
  assert.equal(out.verdict, "manifest-lists-plugin");
  assert.match(out.reasons.join(" "), /manifest\.json/);
  assert.match(out.reasons.join(" "), /plugin_01YBNfaNwQztYsnUydt8m47G/);
});

test("disable-plugin-stops-loop chip", () => {
  const out = decide({ seed: "disable-plugin-stops-loop", disablePluginStopsLoop: true });
  assert.equal(out.verdict, "disable-plugin-stops-loop");
  assert.match(out.reasons.join(" "), /Settings/);
  assert.match(out.reasons.join(" "), /settings\.json/);
});

test("multi-session-flood chip", () => {
  const out = decide({ seed: "multi-session-flood", multiSessionFlood: true });
  assert.equal(out.verdict, "multi-session-flood");
  assert.match(out.reasons.join(" "), /45\+/);
  assert.match(out.reasons.join(" "), /concurrent/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92563, 90329, 74715] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#92563/);
  assert.match(out.reasons.join(" "), /#90329/);
  assert.match(out.reasons.join(" "), /#74715/);
  assert.match(out.reasons.join(" "), /Larum/);
  assert.match(out.reasons.join(" "), /Touchstone/);
});

test("has-clear-repro chip", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has repro/);
  assert.match(out.reasons.join(" "), /ENOENT/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "haunted");
  assert.equal(score(seedStaged()).verdict, "staged");
  assert.equal(handle('{"seed":"haunted","haunted":true}').verdict, "haunted");
  assert.equal(handle({ seed: "staged", staged: true }).verdict, "staged");
  const bag = seeds();
  assert.equal(decide(bag.haunted).verdict, "haunted");
  assert.equal(decide(bag.staged).verdict, "staged");
  assert.equal(scoreFields(seedHaunted()).haunted, true);
});

test("fingerprint detects ENOENT and synthetic notice", () => {
  assert.equal(enoentSignal("ENOENT [Errno 2] No such file or directory"), true);
  assert.equal(stagedPathSignal("local-agent-mode-sessions rpm plugin_01YBNfaNwQztYsnUydt8m47G"), true);
  assert.equal(syntheticNoticeSignal("Background security review found issues"), true);
  assert.equal(idleTurnSignal("Idle. (no change)"), true);
  assert.equal(
    cacheIntactSignal("~/.claude/plugins/cache/claude-plugins-official/security-guidance/2.0.7/hooks/"),
    true
  );
  const print = fingerprint(seedHaunted());
  assert.equal(print.enoent, true);
  assert.equal(print.syntheticNotice, true);
  assert.equal(print.hauntedHit, true);
});

test("fingerprint scores staged clean timeline", () => {
  const print = fingerprint(seedStaged());
  assert.equal(print.stagedClean, true);
  assert.equal(print.hauntedHit, false);
  const out = decide({ ...seedStaged(), seed: "staged" });
  assert.equal(out.staged, true);
  assert.equal(out.verdict, "staged");
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedHaunted());
  assert.equal(idle.haunted, true);
  const hold = classify(seedStaged());
  assert.equal(hold.staged, true);
});

test("measured facts from #92601", () => {
  assert.equal(MEASURED.issue, 92601);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:hooks",
    "area:plugins"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T06:15:18Z");
  assert.equal(MEASURED.updated, "2026-09-07T06:16:20Z");
  assert.equal(MEASURED.reporter, "Dennisgobuild360");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Windows 11 Home Single Language 10.0.26200");
  assert.equal(MEASURED.app, "Claude Code desktop");
  assert.equal(MEASURED.autoUpdatesChannel, "latest");
  assert.equal(MEASURED.plugin, "security-guidance@claude-plugins-official");
  assert.equal(MEASURED.pluginVersion, "2.0.7");
  assert.equal(MEASURED.pluginId, "plugin_01YBNfaNwQztYsnUydt8m47G");
  assert.equal(MEASURED.hookFile, "security_reminder_hook.py");
  assert.equal(MEASURED.notificationKind, "task-notification");
  assert.equal(MEASURED.notificationSummary, "Background security review found issues");
  assert.deepEqual(MEASURED.idleTurns, ["Idle.", "(no change)"]);
  assert.equal(MEASURED.realCacheIntact, true);
  assert.equal(MEASURED.manifestListsPlugin, true);
  assert.equal(MEASURED.restartDoesNotClear, true);
  assert.equal(MEASURED.restartsTried, 3);
  assert.equal(MEASURED.multiSession, true);
  assert.equal(MEASURED.someSessionsRepeats, "45+");
  assert.equal(MEASURED.disablePluginStopsLoop, true);
  assert.equal(MEASURED.otherPluginsInvolved, false);
  assert.equal(IDLE_WORD, "haunted");
  assert.equal(SEEDED_WORD, "staged");
});

test("HOLD is staged; ALARM is haunted family", () => {
  assert.ok(HOLD.has("staged"));
  assert.equal(ALARM.has("staged"), false);
  for (const chip of [
    "haunted",
    "enoent-staging",
    "infinite-retry",
    "synthetic-security-notification",
    "restart-uncleared",
    "real-cache-intact",
    "manifest-lists-plugin",
    "disable-plugin-stops-loop",
    "multi-session-flood",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "haunted",
    "staged",
    "enoent-staging",
    "infinite-retry",
    "synthetic-security-notification",
    "restart-uncleared",
    "real-cache-intact",
    "manifest-lists-plugin",
    "disable-plugin-stops-loop",
    "multi-session-flood",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only Larum / plugin-store / Always-allow", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [92563, 90329, 74715]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "haunted.json",
    "staged.json",
    "92601.json",
    "enoent-staging.json",
    "infinite-retry.json",
    "synthetic-security-notification.json",
    "restart-uncleared.json",
    "real-cache-intact.json",
    "manifest-lists-plugin.json",
    "disable-plugin-stops-loop.json",
    "multi-session-flood.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92601|eidolon|haunted|staged/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "haunted");
  assert.equal(index.narrativeNotFixture.seeded, "staged");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:hooks"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a glass-plate rpm bay, not a clone", () => {
  assert.match(page, /Playfair Display/);
  assert.match(page, /Work Sans/);
  assert.match(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Libre Caslon/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Martian Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains/);
  assert.match(page, /haunted/);
  assert.match(page, /staged/);
  assert.match(page, /#92601/);
  assert.match(page, /Eidolon/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /16:50 \/ hermes catalog #200 \/ #92601/);
  assert.match(page, /Score the eidolon/);
  assert.match(page, /Pin idle haunted/);
  assert.match(page, /Pin seeded staged/);
  assert.match(page, /Admit staged/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to staged/);
  assert.match(page, /glass-plate|wet-plate|rpm bay|phantom|camera lucida|double/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /92563/);
  assert.match(page, /90329/);
  assert.match(page, /74715/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /Lydian/i);
  assert.doesNotMatch(page, /mooring bitts/i);
  assert.doesNotMatch(page, /twin iron/i);
  assert.doesNotMatch(page, /oak wharf/i);
  assert.doesNotMatch(page, /hemp warps/i);
  assert.doesNotMatch(page, /stuffing-box/i);
  assert.doesNotMatch(page, /packing gland/i);
  assert.doesNotMatch(page, /wooden fid/i);
  assert.doesNotMatch(page, /spun yarn/i);
  assert.doesNotMatch(page, /watchtower/i);
  assert.doesNotMatch(page, /larum-bell/i);
  assert.doesNotMatch(page, /seizing loft/i);
  assert.doesNotMatch(page, /kerf-gauge|kerf gauge/i);
  assert.doesNotMatch(page, /scarph joint/i);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
});

test("README anti-clone encodes the phantom-staging thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /ENOENT/i);
  assert.match(readme, /local-agent-mode-sessions/);
  assert.match(readme, /security-guidance/);
  assert.match(readme, /Background security review found issues/);
  assert.match(readme, /Dennisgobuild360/);
  assert.match(readme, /has repro/);
  assert.match(readme, /#92563/);
  assert.match(readme, /#90329/);
  assert.match(readme, /#74715/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/eidolon\//);
  assert.match(readme, /Score haunted or admit staged/);
  assert.match(readme, /NON-BINDING/);
  assert.match(hookReadme, /haunted/);
  assert.match(hookReadme, /staged/);
  assert.match(dataReadme, /haunted/);
  assert.match(dataReadme, /staged/);
});
