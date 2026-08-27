import assert from "node:assert/strict";
import { test } from "node:test";
import { handle } from "./index.mjs";
import {
  FAMILIES,
  SEED_SECRETS,
  TOKEN,
  forensicId as idOf,
  maskForDemo,
  redactString,
  scrub,
  seedPayload,
} from "./redact.mjs";

test("every listed family has a detector", () => {
  const ids = FAMILIES.map((row) => row.id);
  for (const need of [
    "anthropic",
    "openai",
    "openrouter",
    "stripe_live",
    "stripe_whsec",
    "github_pat",
    "github_oauth",
    "github_fine",
    "bearer",
    "azure",
    "gcp_sa",
  ]) {
    assert.ok(ids.includes(need), `missing family ${need}`);
  }
});

test("forensic id is sha256 hex [0:8] and stable", () => {
  const a = idOf(SEED_SECRETS.ghp);
  const b = idOf(SEED_SECRETS.ghp);
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{8}$/);
  assert.equal(a, idOf(SEED_SECRETS.ghp));
});

test("same secret matches across two sinks", () => {
  const seed = seedPayload();
  const result = scrub(seed);
  const ghp = result.findings.find((row) => row.family === "github_pat");
  assert.ok(ghp, "ghp_ should be found");
  assert.equal(ghp.id, idOf(SEED_SECRETS.ghp));
  assert.ok(ghp.sinks.includes("stdio"), ghp.sinks.join(","));
  assert.ok(
    ghp.sinks.includes("jsonl") || ghp.count >= 2,
    `expected two-sink match, got sinks=${ghp.sinks} count=${ghp.count}`,
  );
  const token = TOKEN("github_pat", ghp.id);
  const blob = JSON.stringify(result.redacted);
  assert.ok(blob.includes(token));
  assert.equal((blob.match(new RegExp(token, "g")) || []).length >= 2, true);
});

test("seed is synthetic and fully veiled", () => {
  const seed = seedPayload();
  const raw = JSON.stringify(seed);
  assert.match(raw, /DEMO/);
  assert.doesNotMatch(raw, /sk-ant-[A-Za-z0-9]{8,}(?!.*DEMO)/);
  for (const value of Object.values(SEED_SECRETS)) {
    assert.ok(/DEMO/i.test(value), value);
  }
  const result = scrub(seed);
  const veiled = JSON.stringify(result.redacted);
  for (const value of Object.values(SEED_SECRETS)) {
    assert.equal(veiled.includes(value), false, `raw secret escaped: ${value}`);
  }
  assert.ok(result.findings.length >= 8, `expected a full family sheet, got ${result.findings.length}`);
  assert.equal(result.clean, false);
  assert.equal(result.severity, "high");
});

test("clean frame stays clean — and is not named scrim", () => {
  const result = scrub({ tool_result: { content: "npm test\nall green\n" } });
  assert.equal(result.clean, true);
  assert.equal(result.findings.length, 0);
  assert.equal(result.severity, "clean");
  assert.equal(JSON.stringify(result.redacted).toLowerCase().includes("scrim"), false);
});

test("demo mask never echoes the full secret", () => {
  const raw = `token ${SEED_SECRETS.anthropic} done`;
  const masked = maskForDemo(raw);
  assert.equal(masked.includes(SEED_SECRETS.anthropic), false);
  assert.match(masked, /sk-ant-DEMO/);
});

test("hook handle returns redacted payload + demo sinks", async () => {
  const out = await handle(seedPayload(), {});
  assert.equal(out.ok, true);
  assert.equal(out.hook_event_name, "PostToolUse");
  assert.ok(out.sinks.some((row) => row.adapter === "slack" && row.mode === "demo"));
  assert.ok(out.sinks.some((row) => row.adapter === "github" && /would append/i.test(row.summary)));
  assert.ok(out.sinks.some((row) => row.adapter === "linear" && /would open/i.test(row.summary)));
  const blob = JSON.stringify(out.redacted);
  assert.equal(blob.includes(SEED_SECRETS.bearer), false);
});

test("redactString keeps azure label and hashes the key", () => {
  const findings = [];
  const out = redactString(`AZURE_OPENAI_API_KEY=${SEED_SECRETS.azure}`, findings);
  assert.match(out, /AZURE_OPENAI_API_KEY=\[REDACTED:azure:[0-9a-f]{8}\]/);
  assert.equal(findings[0].id, idOf(SEED_SECRETS.azure));
});
