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
  seedSilted,
  seedDrained,
  fingerprint,
  literalTokenSignal,
  mktempReadonlySignal,
  nestedSocketEpermSignal,
  guidanceSaysWritableSignal,
  failIfUnavailableSignal,
  settingsRevertBlockedSignal,
  allowlistExpandsTmpdir,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  LIMBER_CHANNELS,
  IDLE_WORD,
  SEEDED_WORD
} from "./limber.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92590 fixture scores silted", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92590.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "silted");
  assert.equal(out.silted, true);
  assert.ok(out.chips.includes("silted"));
});

test("empty / idle probe is silted", () => {
  const out = decide({});
  assert.equal(out.verdict, "silted");
  assert.equal(out.silted, true);
  assert.equal(out.drained, false);
  assert.ok(ALARM.has("silted"));
  assert.equal(IDLE_WORD, "silted");
});

test("seeded silted scores silted", () => {
  const out = decide(seedSilted());
  assert.equal(out.verdict, "silted");
  assert.equal(out.silted, true);
  assert.ok(out.chips.includes("silted"));
  assert.ok(out.chips.includes("literal-token"));
  assert.ok(out.chips.includes("mktemp-readonly"));
});

test("drained seed is a hold", () => {
  const out = decide(seedDrained());
  assert.equal(out.verdict, "drained");
  assert.equal(out.drained, true);
  assert.equal(out.silted, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "drained");
});

test("literal-token chip", () => {
  const out = decide({ seed: "literal-token", literalToken: true });
  assert.equal(out.verdict, "literal-token");
  assert.equal(out.silted, true);
  assert.match(out.reasons.join(" "), /literal token/);
  assert.match(out.reasons.join(" "), /\$TMPDIR/);
});

test("mktemp-readonly chip", () => {
  const out = decide({ seed: "mktemp-readonly", mktempReadonly: true });
  assert.equal(out.verdict, "mktemp-readonly");
  assert.ok(out.chips.includes("mktemp-readonly"));
  assert.match(out.reasons.join(" "), /Read-only file system/);
  assert.match(out.reasons.join(" "), /mktemp -d/);
});

test("nested-socket-eperm chip", () => {
  const out = decide({ seed: "nested-socket-eperm", nestedSocketEperm: true });
  assert.equal(out.verdict, "nested-socket-eperm");
  assert.match(out.reasons.join(" "), /EPERM/);
  assert.match(out.reasons.join(" "), /srt-mux/);
});

test("guidance-says-writable chip", () => {
  const out = decide({ seed: "guidance-says-writable", guidanceSaysWritable: true });
  assert.equal(out.verdict, "guidance-says-writable");
  assert.match(out.reasons.join(" "), /sandbox-writable/);
  assert.match(out.reasons.join(" "), /\$TMPDIR/);
});

test("failIfUnavailable-refuses chip", () => {
  const out = decide({ seed: "failIfUnavailable-refuses", failIfUnavailableRefuses: true });
  assert.equal(out.verdict, "failIfUnavailable-refuses");
  assert.match(out.reasons.join(" "), /failIfUnavailable/);
  assert.match(out.reasons.join(" "), /unsandboxed/);
});

test("settings-revert-blocked chip", () => {
  const out = decide({ seed: "settings-revert-blocked", settingsRevertBlocked: true });
  assert.equal(out.verdict, "settings-revert-blocked");
  assert.match(out.reasons.join(" "), /~\/\.claude/);
  assert.match(out.reasons.join(" "), /outside Claude Code/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [91643, 91223, 15637] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#91643/);
  assert.match(out.reasons.join(" "), /#91223/);
  assert.match(out.reasons.join(" "), /#15637/);
  assert.match(out.reasons.join(" "), /Chock/);
  assert.match(out.reasons.join(" "), /Deadman/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "silted");
  assert.equal(score(seedDrained()).verdict, "drained");
  assert.equal(handle('{"seed":"silted","silted":true}').verdict, "silted");
  assert.equal(handle({ seed: "drained", drained: true }).verdict, "drained");
  const bag = seeds();
  assert.equal(decide(bag.silted).verdict, "silted");
  assert.equal(decide(bag.drained).verdict, "drained");
  assert.equal(scoreFields(seedSilted()).silted, true);
});

test("fingerprint detects literal token, mktemp, socket, guidance", () => {
  assert.equal(literalTokenSignal('literal token unexpanded "$TMPDIR" write allowlist keeps'), true);
  assert.equal(mktempReadonlySignal("mktemp -d Read-only file system tmp.XXXXXX"), true);
  assert.equal(nestedSocketEpermSignal("EPERM listen srt-mux nested claude"), true);
  assert.equal(guidanceSaysWritableSignal("sandbox-writable always use the $TMPDIR guidance"), true);
  assert.equal(failIfUnavailableSignal("failIfUnavailable refuses unsandboxed"), true);
  assert.equal(settingsRevertBlockedSignal("cannot be reverted writing the updated settings ~/.claude"), true);
  const print = fingerprint(seedSilted());
  assert.equal(print.literal, true);
  assert.equal(print.mktemp, true);
  assert.equal(print.siltedHit, true);
});

test("fingerprint scores drained clean allowlist", () => {
  const print = fingerprint(seedDrained());
  assert.equal(print.drainedClean, true);
  assert.equal(print.siltedHit, false);
  const out = decide({ ...seedDrained(), seed: "drained" });
  assert.equal(out.drained, true);
  assert.equal(out.verdict, "drained");
  assert.equal(allowlistExpandsTmpdir(seedDrained()), true);
  assert.equal(allowlistExpandsTmpdir(seedSilted()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedSilted());
  assert.equal(idle.silted, true);
  const hold = classify(seedDrained());
  assert.equal(hold.drained, true);
});

test("limber-channel stack is scratch / token / well", () => {
  assert.ok(LIMBER_CHANNELS.length === 3);
  assert.ok(LIMBER_CHANNELS.some((row) => row.id === "scratch" && row.drains === false));
  assert.ok(LIMBER_CHANNELS.some((row) => row.id === "token" && row.drains === false));
  assert.ok(LIMBER_CHANNELS.some((row) => row.id === "well" && row.drains === true));
});

test("measured facts from #92590", () => {
  assert.equal(MEASURED.issue, 92590);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:linux", "area:sandbox"]);
  assert.equal(MEASURED.filed, "2026-09-07T03:57:45Z");
  assert.equal(MEASURED.updated, "2026-09-07T03:58:45Z");
  assert.equal(MEASURED.reporter, "CameronBrooks11");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Linux (Debian trixie)");
  assert.equal(MEASURED.cliVersion, "2.1.263");
  assert.equal(MEASURED.bubblewrap, "0.12.0");
  assert.equal(MEASURED.sandboxEnabled, true);
  assert.equal(MEASURED.failIfUnavailable, true);
  assert.equal(MEASURED.claudeCodeTmpdir, "$HOME/.local/state/scratch");
  assert.equal(MEASURED.mktempError, "Read-only file system");
  assert.equal(MEASURED.writeAllowlistLiteralToken, "$TMPDIR");
  assert.equal(MEASURED.writeAllowlistIncludesLiteralTmpdir, true);
  assert.equal(MEASURED.nestedSocketEperm, true);
  assert.equal(MEASURED.failIfUnavailableCorrect, true);
  assert.equal(MEASURED.cannotRevertSettingsInsideSession, true);
  assert.equal(MEASURED.ghNotChased, true);
  assert.equal(IDLE_WORD, "silted");
  assert.equal(SEEDED_WORD, "drained");
});

test("HOLD is drained; ALARM is silted family", () => {
  assert.ok(HOLD.has("drained"));
  assert.equal(ALARM.has("drained"), false);
  for (const chip of [
    "silted",
    "literal-token",
    "mktemp-readonly",
    "nested-socket-eperm",
    "guidance-says-writable",
    "failIfUnavailable-refuses",
    "settings-revert-blocked",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "silted",
    "drained",
    "literal-token",
    "mktemp-readonly",
    "nested-socket-eperm",
    "guidance-says-writable",
    "failIfUnavailable-refuses",
    "settings-revert-blocked",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 91643 / 91223 / 15637", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [91643, 91223, 15637]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "silted.json",
    "drained.json",
    "92590.json",
    "literal-token.json",
    "mktemp-readonly.json",
    "nested-socket-eperm.json",
    "guidance-says-writable.json",
    "failIfUnavailable-refuses.json",
    "settings-revert-blocked.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92590|limber|silted|drained/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "silted");
  assert.equal(index.narrativeNotFixture.seeded, "drained");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:sandbox"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a bilge limber-hole bench, not a clone", () => {
  assert.match(page, /Fraunces/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Chakra Petch/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Figtree/);
  assert.match(page, /silted/);
  assert.match(page, /drained/);
  assert.match(page, /#92590/);
  assert.match(page, /Limber/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /19:50 \/ hermes catalog #203 \/ #92590/);
  assert.match(page, /Score the limbers/);
  assert.match(page, /Pin idle silted/);
  assert.match(page, /Pin seeded drained/);
  assert.match(page, /Admit drained/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to drained/);
  assert.match(page, /limber-hole|bilge well|drain channel|limber-board/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /91643/);
  assert.match(page, /91223/);
  assert.match(page, /15637/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /wheel-chock/i);
  assert.doesNotMatch(page, /oak wedge/i);
  assert.doesNotMatch(page, /chalk fence/i);
  assert.doesNotMatch(page, /settings-layer stack/i);
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /locomotive/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /wet-plate/i);
  assert.doesNotMatch(page, /Lydian/i);
  assert.doesNotMatch(page, /mooring bitts/i);
  assert.doesNotMatch(page, /oak wharf/i);
  assert.doesNotMatch(page, /hemp warps/i);
  assert.doesNotMatch(page, /stuffing-box/i);
  assert.doesNotMatch(page, /packing gland/i);
  assert.doesNotMatch(page, /wooden fid/i);
  assert.doesNotMatch(page, /spun yarn/i);
  assert.doesNotMatch(page, /watchtower/i);
  assert.doesNotMatch(page, /larum-bell/i);
  assert.doesNotMatch(page, /seizing loft/i);
  assert.doesNotMatch(page, /chock-rail/i);
  assert.doesNotMatch(page, /\bbarred\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bvoided\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
});

test("README anti-clone encodes the limber thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /CLAUDE_CODE_TMPDIR/);
  assert.match(readme, /\$TMPDIR/);
  assert.match(readme, /Read-only file system/);
  assert.match(readme, /CameronBrooks11/);
  assert.match(readme, /#91643/);
  assert.match(readme, /#91223/);
  assert.match(readme, /#15637/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/limber\//);
  assert.match(readme, /Score silted or admit drained/);
  assert.match(readme, /NON-BINDING/);
  assert.match(hookReadme, /silted/);
  assert.match(hookReadme, /drained/);
  assert.match(dataReadme, /silted/);
  assert.match(dataReadme, /drained/);
});
