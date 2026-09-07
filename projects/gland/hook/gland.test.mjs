import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedStripped,
  seedPacked,
  classify,
  fingerprint,
  isBashToolCallHook,
  isSessionStartHook,
  lostError,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS,
  IDLE_WORD,
  SEEDED_WORD
} from "./gland.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

const bashPassthroughHook = {
  event: "tool.call",
  tool: "Bash",
  passthrough: true,
  body: "next(e)"
};

const sessionStartHook = {
  event: "session.start",
  passthrough: true,
  body: "next(e)"
};

const refusedPwd = {
  command: "pwd",
  refused: true,
  retries: 6,
  error:
    "The working-directory isolation context for this agent was lost, so this command would run in the parent session's directory instead of this agent's worktree (<repo>/.claude/worktrees/agent-a0bafd2e8cb4295b0). Refusing to run it."
};

const packedPwd = {
  command: "pwd",
  refused: false,
  output: "/tmp/repro/repo/.claude/worktrees/agent-a0bafd2e8cb4295b0"
};

const strippedProbe = {
  seed: "stripped",
  functionHooks: true,
  isolation: "worktree",
  hooks: [bashPassthroughHook],
  bashCalls: [refusedPwd],
  stripped: true
};

const packedProbe = {
  seed: "packed",
  isolation: "worktree",
  hooks: [sessionStartHook],
  bashCalls: [packedPwd],
  packed: true
};

test("empty / idle probe is stripped", () => {
  const out = decide({});
  assert.equal(out.verdict, "stripped");
  assert.equal(out.stripped, true);
  assert.equal(out.packed, false);
  assert.ok(ALARM.has("stripped"));
});

test("seeded stripped scores stripped", () => {
  const out = decide(seedStripped());
  assert.equal(out.verdict, "stripped");
  assert.equal(out.stripped, true);
  assert.ok(out.chips.includes("stripped"));
  assert.ok(out.chips.includes("context-lost"));
});

test("packed seed is a hold", () => {
  const out = decide(seedPacked());
  assert.equal(out.verdict, "packed");
  assert.equal(out.packed, true);
  assert.equal(out.stripped, false);
  assert.ok(HOLD.has(out.verdict));
});

test("passthrough-ok chip", () => {
  const out = decide({ seed: "passthrough-ok", passthroughOk: true });
  assert.equal(out.verdict, "passthrough-ok");
  assert.equal(out.packed, true);
  assert.ok(HOLD.has("passthrough-ok"));
  assert.match(out.reasons.join(" "), /session\.start|function hooks env off|worktree path/i);
});

test("session-start-ok aliases passthrough-ok", () => {
  const out = decide({ seed: "session-start-ok", sessionStartOk: true });
  assert.equal(out.verdict, "passthrough-ok");
  assert.equal(out.packed, true);
});

test("context-lost chip", () => {
  const out = decide({ seed: "context-lost", contextLost: true });
  assert.equal(out.verdict, "context-lost");
  assert.equal(out.stripped, true);
  assert.match(out.reasons.join(" "), /isolation context for this agent was lost/);
  assert.match(out.reasons.join(" "), /tengu_agent_worktree_cwd_escape_blocked/);
});

test("parent-switched chip", () => {
  const out = decide({ seed: "parent-switched", parentSwitched: true });
  assert.equal(out.verdict, "parent-switched");
  assert.ok(out.chips.includes("parent-switched"));
  assert.match(out.reasons.join(" "), /EnterWorktree/);
  assert.match(out.reasons.join(" "), /parent session/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92112, 89102] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#92112/);
  assert.match(out.reasons.join(" "), /#89102/);
  assert.match(out.reasons.join(" "), /Holdfast/);
  assert.match(out.reasons.join(" "), /Oubliette/);
  assert.match(out.reasons.join(" "), /Larum/);
});

test("fingerprint detects Bash tool.call passthrough hook", () => {
  assert.equal(isBashToolCallHook(bashPassthroughHook), true);
  assert.equal(isSessionStartHook(sessionStartHook), true);
  assert.equal(isBashToolCallHook(sessionStartHook), false);
  const print = fingerprint(strippedProbe);
  assert.equal(print.bashToolCallHook, true);
  assert.equal(print.refused, true);
  assert.equal(print.isolationWorktree, true);
});

test("fingerprint scores packed session.start timeline", () => {
  const print = fingerprint(packedProbe);
  assert.equal(print.sessionStartOnly, true);
  assert.equal(print.pwdPrintsWorktree, true);
  assert.equal(print.refused, false);
  const out = decide(packedProbe);
  assert.equal(out.packed, true);
  assert.equal(out.verdict, "packed");
});

test("fingerprint scores stripped bash-hook timeline", () => {
  assert.equal(lostError(refusedPwd.error), true);
  const print = fingerprint(strippedProbe);
  assert.equal(print.refused, true);
  const out = decide({ ...strippedProbe, seed: "stripped" });
  assert.equal(out.verdict, "stripped");
});

test("function-hooks-off bisection is hold", () => {
  const out = decide({
    seed: "passthrough-ok",
    functionHooks: false,
    isolation: "worktree",
    bashCalls: [packedPwd],
    passthroughOk: true
  });
  assert.equal(out.verdict, "passthrough-ok");
  assert.equal(out.packed, true);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedStripped());
  assert.equal(idle.stripped, true);
  const hold = classify(seedPacked());
  assert.equal(hold.packed, true);
});

test("measured facts from #92533", () => {
  assert.equal(MEASURED.issue, 92533);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:bash",
    "area:hooks",
    "area:agents"
  ]);
  assert.equal(MEASURED.updated, "2026-09-06T18:57:22Z");
  assert.equal(MEASURED.version, "2.1.263");
  assert.equal(MEASURED.reporter, "navidemad");
  assert.equal(MEASURED.retriesObserved, 6);
  assert.equal(MEASURED.isolation, "worktree");
  assert.ok(MEASURED.telemetry.includes("context_lost"));
  assert.equal(IDLE_WORD, "stripped");
  assert.equal(SEEDED_WORD, "packed");
});

test("HOLD is packed / passthrough-ok", () => {
  assert.ok(HOLD.has("packed"));
  assert.ok(HOLD.has("passthrough-ok"));
  assert.equal(ALARM.has("packed"), false);
  for (const chip of ["stripped", "context-lost", "parent-switched", "cousins"]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "stripped",
    "packed",
    "context-lost",
    "parent-switched",
    "passthrough-ok",
    "cousins"
  ]);
});

test("cousins table is cite-only isolation neighbourhood", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [92112, 89102, 91932, 86340, 84704, 87953, 88950, 90432, 87643, 87959]
  );
});

test("living page is a stuffing-box packing gland, not a clone", () => {
  assert.match(page, /Lora/);
  assert.match(page, /Plus Jakarta Sans/);
  assert.match(page, /Martian Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.match(page, /stripped/);
  assert.match(page, /packed/);
  assert.match(page, /#92533/);
  assert.match(page, /Gland/);
  assert.match(page, /embed/);
  assert.match(page, /stuffing-box|packing gland|gland nut|lantern-ring|shaft-seal|graphite/i);
  assert.match(page, /Holdfast/);
  assert.match(page, /tool\.call/);
});

test("page does not reuse prior idle or seeded words", () => {
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\briven\b/);
  assert.doesNotMatch(page, /\bargbound\b/);
  assert.doesNotMatch(page, /\baccruing\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bsheared\b/);
  assert.doesNotMatch(page, /\bfayed\b/);
  assert.doesNotMatch(page, /\boverladen\b/);
  assert.doesNotMatch(page, /\btrimmed\b/);
  assert.doesNotMatch(page, /\bdefocused\b/);
  assert.doesNotMatch(page, /\bskimmed\b/);
  assert.doesNotMatch(page, /\bhangfired\b/);
  assert.doesNotMatch(page, /\bpreheating\b/);
  assert.doesNotMatch(page, /\bsaturating\b/);
  assert.doesNotMatch(page, /\bmislabeled\b/);
  assert.doesNotMatch(page, /\bcringle\b/i);
  assert.doesNotMatch(page, /\bkerf\b/i);
  assert.doesNotMatch(page, /demurrage/i);
  assert.doesNotMatch(page, /scarph/i);
  assert.doesNotMatch(page, /plimsoll/i);
});
