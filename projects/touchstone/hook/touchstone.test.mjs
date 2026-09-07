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
  seedFouled,
  seedProved,
  fingerprint,
  scriptExtensionSignal,
  contentExtensionSignal,
  false401Signal,
  invalidXApiKeyClass,
  missingXApiKeyClass,
  invalidBearerClass,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  IDLE_WORD,
  SEEDED_WORD,
  FAIL_EXTENSIONS,
  PASS_EXTENSIONS
} from "./touchstone.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92599 fixture scores fouled", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92599.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "fouled");
  assert.equal(out.fouled, true);
  assert.ok(out.chips.includes("fouled"));
});

test("empty / idle probe is fouled", () => {
  const out = decide({});
  assert.equal(out.verdict, "fouled");
  assert.equal(out.fouled, true);
  assert.equal(out.proved, false);
  assert.ok(ALARM.has("fouled"));
  assert.equal(IDLE_WORD, "fouled");
});

test("seeded fouled scores fouled", () => {
  const out = decide(seedFouled());
  assert.equal(out.verdict, "fouled");
  assert.equal(out.fouled, true);
  assert.ok(out.chips.includes("fouled"));
  assert.ok(out.chips.includes("extension-gate"));
  assert.ok(out.chips.includes("false-401"));
});

test("proved seed is a hold", () => {
  const out = decide(seedProved());
  assert.equal(out.verdict, "proved");
  assert.equal(out.proved, true);
  assert.equal(out.fouled, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "proved");
});

test("extension-gate chip", () => {
  const out = decide({ seed: "extension-gate", extensionGate: true });
  assert.equal(out.verdict, "extension-gate");
  assert.equal(out.fouled, true);
  assert.match(out.reasons.join(" "), /\.mjs/);
  assert.match(out.reasons.join(" "), /\.jsonl/);
  assert.match(out.reasons.join(" "), /\.json/);
  assert.match(out.reasons.join(" "), /allowlist/i);
});

test("false-401 chip", () => {
  const out = decide({ seed: "false-401", false401: true });
  assert.equal(out.verdict, "false-401");
  assert.ok(out.chips.includes("false-401"));
  assert.match(out.reasons.join(" "), /API key is invalid/);
  assert.match(out.reasons.join(" "), /permission-rule/);
  assert.match(out.reasons.join(" "), /request_id/);
});

test("auto-disabled chip", () => {
  const out = decide({ seed: "auto-disabled", autoDisabled: true });
  assert.equal(out.verdict, "auto-disabled");
  assert.match(out.reasons.join(" "), /Auto cannot approve|approval path/i);
});

test("precedes-pretooluse chip", () => {
  const out = decide({ seed: "precedes-pretooluse", precedesPreToolUse: true });
  assert.equal(out.verdict, "precedes-pretooluse");
  assert.match(out.reasons.join(" "), /PreToolUse/);
  assert.match(out.reasons.join(" "), /hook never ran/i);
});

test("desktop-session-only chip", () => {
  const out = decide({ seed: "desktop-session-only", desktopSessionOnly: true });
  assert.equal(out.verdict, "desktop-session-only");
  assert.match(out.reasons.join(" "), /CLAUDE_CODE_CHILD_SESSION/);
  assert.match(out.reasons.join(" "), /claude -p/);
  assert.match(out.reasons.join(" "), /\.mjs/);
});

test("bypass-permissions chip", () => {
  const out = decide({ seed: "bypass-permissions", bypassPermissions: true });
  assert.equal(out.verdict, "bypass-permissions");
  assert.match(out.reasons.join(" "), /bypassPermissions/);
});

test("auth-shape chip", () => {
  const out = decide({ seed: "auth-shape", authShape: true });
  assert.equal(out.verdict, "auth-shape");
  assert.match(out.reasons.join(" "), /x-api-key/);
  assert.match(out.reasons.join(" "), /Bearer/);
  assert.match(out.reasons.join(" "), /NON-BINDING|non-binding|unproven/i);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92518, 92582] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#92518/);
  assert.match(out.reasons.join(" "), /#92582/);
  assert.match(out.reasons.join(" "), /Catachresis/);
  assert.match(out.reasons.join(" "), /Chock/);
  assert.match(out.reasons.join(" "), /Bitts/);
  assert.match(out.reasons.join(" "), /Seizing/);
});

test("has-clear-repro chip", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has repro/);
  assert.match(out.reasons.join(" "), /36 denials/);
  assert.match(out.reasons.join(" "), /16 sessions/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "fouled");
  assert.equal(score(seedProved()).verdict, "proved");
  assert.equal(handle('{"seed":"fouled","fouled":true}').verdict, "fouled");
  assert.equal(handle({ seed: "proved", proved: true }).verdict, "proved");
  const bag = seeds();
  assert.equal(decide(bag.fouled).verdict, "fouled");
  assert.equal(decide(bag.proved).verdict, "proved");
  assert.equal(scoreFields(seedFouled()).fouled, true);
});

test("fingerprint detects extension gate and false 401", () => {
  assert.equal(scriptExtensionSignal(".mjs .jsonl extension-less"), true);
  assert.equal(contentExtensionSignal(".md .json .yaml"), true);
  assert.equal(false401Signal("API key is invalid. permission-rule"), true);
  assert.equal(invalidXApiKeyClass("API key is invalid."), true);
  assert.equal(missingXApiKeyClass("x-api-key header is required"), true);
  assert.equal(invalidBearerClass("Invalid bearer token"), true);
  const print = fingerprint(seedFouled());
  assert.equal(print.scriptFail, true);
  assert.equal(print.false401, true);
  assert.equal(print.xApiKeyInvalid, true);
});

test("fingerprint scores proved clean timeline", () => {
  const print = fingerprint(seedProved());
  assert.equal(print.provedClean, true);
  assert.equal(print.fouledHit, false);
  const out = decide({ ...seedProved(), seed: "proved" });
  assert.equal(out.proved, true);
  assert.equal(out.verdict, "proved");
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedFouled());
  assert.equal(idle.fouled, true);
  const hold = classify(seedProved());
  assert.equal(hold.proved, true);
});

test("measured facts from #92599", () => {
  assert.equal(MEASURED.issue, 92599);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:auth",
    "area:permissions"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T05:40:11Z");
  assert.equal(MEASURED.updated, "2026-09-07T05:41:22Z");
  assert.equal(MEASURED.reporter, "gsegol11-ship-it");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.version, "2.1.258");
  assert.equal(MEASURED.desktop, "1.44121.4.0 (MSIX)");
  assert.equal(MEASURED.os, "Windows 11 Pro 26200");
  assert.equal(MEASURED.childSession, true);
  assert.equal(MEASURED.childSessionEnv, "CLAUDE_CODE_CHILD_SESSION=1");
  assert.equal(MEASURED.entrypoint, "claude-desktop");
  assert.equal(MEASURED.denialKind, "permission-rule");
  assert.equal(MEASURED.requestId, null);
  assert.equal(MEASURED.bypassPermissions, true);
  assert.equal(MEASURED.precedesPreToolUse, true);
  assert.equal(MEASURED.autoDisabled, true);
  assert.equal(MEASURED.headlessWriteMjsSucceeds, true);
  assert.equal(MEASURED.denials, 36);
  assert.equal(MEASURED.sessions, 16);
  assert.equal(MEASURED.hours, 36);
  assert.equal(MEASURED.contentTypeDenials, 0);
  assert.ok(MEASURED.failExtensions.includes(".mjs"));
  assert.ok(MEASURED.failExtensions.includes(".jsonl"));
  assert.ok(MEASURED.passExtensions.includes(".json"));
  assert.ok(MEASURED.passExtensions.includes(".md"));
  assert.equal(IDLE_WORD, "fouled");
  assert.equal(SEEDED_WORD, "proved");
  assert.deepEqual(FAIL_EXTENSIONS, MEASURED.failExtensions);
  assert.deepEqual(PASS_EXTENSIONS, MEASURED.passExtensions);
});

test("HOLD is proved; ALARM is fouled family", () => {
  assert.ok(HOLD.has("proved"));
  assert.equal(ALARM.has("proved"), false);
  for (const chip of [
    "fouled",
    "extension-gate",
    "false-401",
    "auto-disabled",
    "precedes-pretooluse",
    "desktop-session-only",
    "bypass-permissions",
    "auth-shape",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "fouled",
    "proved",
    "extension-gate",
    "false-401",
    "auto-disabled",
    "precedes-pretooluse",
    "desktop-session-only",
    "bypass-permissions",
    "auth-shape",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only Catachresis / Chock", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [92518, 92582]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "fouled.json",
    "proved.json",
    "92599.json",
    "extension-gate.json",
    "false-401.json",
    "auto-disabled.json",
    "precedes-pretooluse.json",
    "desktop-session-only.json",
    "bypass-permissions.json",
    "auth-shape.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92599|touchstone|fouled|proved/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "fouled");
  assert.equal(index.narrativeNotFixture.seeded, "proved");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:auth"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a Lydian slab touchstone bench, not a clone", () => {
  assert.match(page, /Cinzel/);
  assert.match(page, /Plus Jakarta Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Libre Caslon/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Martian Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.match(page, /fouled/);
  assert.match(page, /proved/);
  assert.match(page, /#92599/);
  assert.match(page, /Touchstone/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /15:50 \/ hermes catalog #199 \/ #92599/);
  assert.match(page, /Score the touchstone/);
  assert.match(page, /Pin idle fouled/);
  assert.match(page, /Pin seeded proved/);
  assert.match(page, /Admit proved/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to proved/);
  assert.match(page, /Lydian|black slab|gold|copper|extension chip|auth-header/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /92518/);
  assert.match(page, /92582/);
});

test("page stays off neighboring UIs and prior idle words", () => {
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
  assert.doesNotMatch(page, /kerf-gauge|kerf gauge/i);
  assert.doesNotMatch(page, /scarph joint/i);
  assert.doesNotMatch(page, /wine cellar/i);
  assert.doesNotMatch(page, /lexicographer/i);
  assert.doesNotMatch(page, /cupel/i);
  assert.doesNotMatch(page, /stencil desk/i);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bsole\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bstreaked\b/);
  assert.doesNotMatch(page, /\bveined\b/);
  assert.doesNotMatch(page, /\btarnished\b/);
  assert.doesNotMatch(page, /\boverdraft\b/);
  assert.doesNotMatch(page, /\bvoided\b/);
  assert.doesNotMatch(page, /\bbanked\b/);
  assert.doesNotMatch(page, /\brewritten\b/);
  assert.doesNotMatch(page, /\bthrashing\b/);
  assert.doesNotMatch(page, /\bresponsive\b/);
  assert.doesNotMatch(page, /\bsealed\b/);
  assert.doesNotMatch(page, /\brebound\b/);
  assert.doesNotMatch(page, /\bfenced\b/);
  assert.doesNotMatch(page, /\bswept\b/);
  assert.doesNotMatch(page, /\barmed\b/);
  assert.doesNotMatch(page, /\bunheard\b/);
  assert.doesNotMatch(page, /\bunbolted\b/);
  assert.doesNotMatch(page, /\bsnagged\b/);
  assert.doesNotMatch(page, /\btolled\b/);
  assert.doesNotMatch(page, /\bmute\b/);
  assert.doesNotMatch(page, /\bhonored\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
});

test("README anti-clone encodes the permission-validation thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /WRITE\/EDIT DENIED BY PERMISSION-VALIDATION/i);
  assert.match(readme, /API KEY IS INVALID/i);
  assert.match(readme, /GATED PURELY BY FILE EXTENSION/i);
  assert.match(readme, /DISABLES AUTO MODE/i);
  assert.match(readme, /bypassPermissions/);
  assert.match(readme, /PreToolUse/);
  assert.match(readme, /claude -p/);
  assert.match(readme, /x-api-key/);
  assert.match(readme, /gsegol11-ship-it/);
  assert.match(readme, /has repro/);
  assert.match(readme, /#92573/);
  assert.match(readme, /#92586/);
  assert.match(readme, /#92518/);
  assert.match(readme, /#92582/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/touchstone\//);
  assert.match(readme, /Score fouled or admit proved/);
  assert.match(hookReadme, /fouled/);
  assert.match(hookReadme, /proved/);
  assert.match(dataReadme, /fouled/);
  assert.match(dataReadme, /proved/);
});
