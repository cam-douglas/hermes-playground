import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decide,
  seedMislabeled,
  seedScoped,
  parseWwwAuthenticate,
  classifyChallenge,
  HOLD,
  ALARM
} from "./catachresis.mjs";

test("empty / idle probe is mislabeled", () => {
  const out = decide({});
  assert.equal(out.verdict, "mislabeled");
  assert.equal(out.mislabeled, true);
  assert.equal(out.scoped, false);
});

test("seeded mislabeled scores mislabeled with evidence chips", () => {
  const out = decide(seedMislabeled());
  assert.equal(out.verdict, "mislabeled");
  assert.equal(out.mislabeled, true);
  assert.ok(out.chips.includes("mislabeled"));
  assert.ok(out.chips.includes("no-401"));
  assert.ok(out.chips.includes("no-refresh"));
  assert.ok(out.chips.includes("token-still-valid"));
  assert.ok(out.chips.includes("insufficient-scope-challenge"));
  assert.ok(out.chips.includes("events-write-missing"));
});

test("403 insufficient_scope plus expired line scores mislabeled", () => {
  const out = decide({
    status: 403,
    challengeError: "insufficient_scope",
    challengeScope: "events:write",
    clientMessage: 'MCP server "events" requires re-authorization (token expired)',
    http401: false,
    refreshAttempted: false,
    tokenRemainingMin: 55
  });
  assert.equal(out.verdict, "mislabeled");
  assert.ok(out.chips.includes("token-still-valid"));
  assert.ok(out.chips.includes("insufficient-scope-challenge"));
});

test("scoped seed is a hold", () => {
  const out = decide(seedScoped());
  assert.equal(out.verdict, "scoped");
  assert.equal(out.scoped, true);
  assert.equal(out.mislabeled, false);
  assert.ok(HOLD.has(out.verdict));
});

test("naming the missing scope is scoped", () => {
  const out = decide({
    seed: "scoped",
    scoped: true,
    namesMissingScope: true,
    challengeError: "insufficient_scope",
    missingScope: "events:write"
  });
  assert.equal(out.verdict, "scoped");
  assert.match(out.reasons.join(" "), /events:write/);
});

test("no-401 chip", () => {
  const out = decide({ seed: "no-401", http401: false });
  assert.equal(out.verdict, "no-401");
  assert.equal(out.mislabeled, true);
  assert.ok(ALARM.has("no-401"));
  assert.match(out.reasons.join(" "), /no 401/);
  assert.match(out.reasons.join(" "), /two 403s/);
});

test("no-refresh chip", () => {
  const out = decide({ seed: "no-refresh", refreshAttempted: false });
  assert.equal(out.verdict, "no-refresh");
  assert.match(out.reasons.join(" "), /refresh_token/);
});

test("token-still-valid chip", () => {
  const out = decide({ seed: "token-still-valid", tokenRemainingMin: 55 });
  assert.equal(out.verdict, "token-still-valid");
  assert.match(out.reasons.join(" "), /55 minutes/);
  assert.match(out.reasons.join(" "), /3600s/);
});

test("insufficient-scope-challenge chip", () => {
  const out = decide({ seed: "insufficient-scope-challenge", challengeError: "insufficient_scope" });
  assert.equal(out.verdict, "insufficient-scope-challenge");
  assert.match(out.reasons.join(" "), /insufficient_scope/);
  assert.match(out.reasons.join(" "), /events:write/);
});

test("events-write-missing chip", () => {
  const out = decide({ seed: "events-write-missing", challengeScope: "events:write" });
  assert.equal(out.verdict, "events-write-missing");
  assert.match(out.reasons.join(" "), /events_delete/);
  assert.match(out.reasons.join(" "), /events_list/);
});

test("scope-events-write alias scores events-write-missing", () => {
  const out = decide({ seed: "scope-events-write", challengeScope: "events:write" });
  assert.equal(out.verdict, "events-write-missing");
});

test("reauth-widened-scopes is evidence, not a hold", () => {
  const out = decide({ seed: "reauth-widened-scopes", reauthWidened: true });
  assert.equal(out.verdict, "reauth-widened-scopes");
  assert.equal(out.mislabeled, true);
  assert.equal(out.scoped, false);
  assert.match(out.reasons.join(" "), /events:read events:write/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [19066, 28258, 44652] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.mislabeled, true);
  assert.match(out.reasons.join(" "), /#92518/);
  assert.match(out.reasons.join(" "), /#19066/);
  assert.match(out.reasons.join(" "), /#28258/);
  assert.match(out.reasons.join(" "), /#44652/);
  assert.match(out.reasons.join(" "), /2\.1\.258/);
});

test("parseWwwAuthenticate reads RFC 6750 challenge fields", () => {
  const parsed = parseWwwAuthenticate(
    'Bearer error="insufficient_scope", scope="events:write", resource_metadata="https://example.com/.well-known/oauth-protected-resource/api/mcp"'
  );
  assert.equal(parsed.scheme, "Bearer");
  assert.equal(parsed.error, "insufficient_scope");
  assert.equal(parsed.scope, "events:write");
  assert.match(parsed.resource_metadata, /oauth-protected-resource/);
});

test("classifyChallenge flags expired-over-scope as not shouldNameScope", () => {
  const c = classifyChallenge({
    status: 403,
    wwwAuthenticate: 'Bearer error="insufficient_scope", scope="events:write"',
    clientMessage: 'MCP server "x" requires re-authorization (token expired)'
  });
  assert.equal(c.insufficient, true);
  assert.equal(c.saysExpired, true);
  assert.equal(c.shouldNameScope, false);
  assert.equal(c.missingScope, "events:write");
  assert.equal(c.status, 403);
});
