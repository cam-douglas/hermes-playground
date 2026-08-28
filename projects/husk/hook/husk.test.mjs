import assert from "node:assert/strict";
import { test } from "node:test";
import { exitCode, handle, scoreRaw } from "./adapters.mjs";
import {
  FAIL_CLOSED,
  IDLE_WORD,
  VERDICTS,
  classify,
  collectSignals,
  isEmptyResult,
  isHollow,
  score,
  seed2197,
  seed80223,
  seed87159,
  seedContended,
  seedGhosted,
  seedHusked,
  seedKernel,
  seedOf,
  seedZeroed,
} from "./husk.mjs";
import { score as exportedScore } from "./index.mjs";

test("1 seed 87159 is aborted: preamble boom, success, num_turns=0", () => {
  const result = score(seed87159());
  assert.equal(result.verdict, "aborted");
  assert.equal(result.state, "aborted");
  assert.equal(result.decision, "aborted");
  assert.equal(result.idleWord, "kernel");
  assert.equal(result.alarm, true);
  assert.equal(result.failClosed, true);
  assert.equal(result.signals.numTurns, 0);
  assert.equal(result.signals.emptyResult, true);
  assert.equal(result.signals.subtypeSuccess, true);
  assert.equal(result.signals.preambleBoom, true);
  assert.equal(result.signals.durationApiZero, true);
  assert.ok(result.reasons.some((row) => /preamble|boom/i.test(row)));
  assert.equal(score(seedOf(87159)).verdict, "aborted");
  assert.equal(score(seedOf("#87159")).verdict, "aborted");
});

test("2 seed 80223 is denied: local-command-stderr, typed denials empty", () => {
  const result = score(seed80223());
  assert.equal(result.verdict, "denied");
  assert.equal(result.signals.localCommandStderr, true);
  assert.equal(result.signals.permissionDenialText, true);
  assert.equal(result.signals.emptyPermissionDenials, true);
  assert.equal(result.signals.numTurnsZero, true);
  assert.equal(result.signals.hasAssistant, false);
  assert.ok(result.reasons.some((row) => /local-command-stderr|typed denial/i.test(row)));
});

test("3 seed 2197 is nested: parent session + nested -p + CLAUDECODE", () => {
  const result = score(seed2197());
  assert.equal(result.verdict, "nested");
  assert.equal(result.signals.nestedP, true);
  assert.equal(result.signals.claudeCodeContext, true);
  assert.equal(result.signals.parentSession, true);
  assert.equal(result.signals.zeroUsage, true);
  assert.equal(result.signals.hollow, true);
  assert.ok(result.reasons.some((row) => /nested|single-flight|CLAUDECODE/i.test(row)));
});

test("4 kernel: num_turns>=1 with non-empty result and live usage", () => {
  const result = score(seedKernel());
  assert.equal(result.verdict, "kernel");
  assert.equal(result.alarm, false);
  assert.equal(result.signals.numTurnsGe1, true);
  assert.equal(result.signals.numTurns, 1);
  assert.equal(result.signals.emptyResult, false);
  assert.equal(result.signals.realUsage, true);
  assert.equal(result.signals.durationApiPositive, true);
  assert.ok(result.signals.durationApiMs > 0);
  assert.doesNotMatch(result.idleWord, /husk/i);
});

test("5 idle / empty / {} admits kernel, never the product name", () => {
  const empty = score({});
  assert.equal(empty.verdict, "kernel");
  assert.equal(empty.idleWord, "kernel");
  assert.equal(IDLE_WORD, "kernel");
  assert.doesNotMatch(empty.verdict, /husk/i);
  assert.doesNotMatch(empty.idleWord, /husk/i);
  assert.equal(score("").verdict, "kernel");
  assert.equal(score(null).verdict, "kernel");
});

test("6 husked: success + num_turns=0 + empty result, no side-channel", () => {
  const result = score(seedHusked());
  assert.equal(result.verdict, "husked");
  assert.equal(result.signals.hollow, true);
  assert.equal(result.signals.preambleBoom, false);
  assert.equal(result.signals.localCommandStderr, false);
  assert.ok(result.reasons.some((row) => /husk is not a hold/i.test(row)));
});

test("7 denied vs husked: typed denials empty is not enough without side-channel", () => {
  const husked = score({
    type: "result",
    subtype: "success",
    is_error: false,
    num_turns: 0,
    result: "",
    permission_denials: [],
  });
  assert.equal(husked.verdict, "husked");
  const denied = score({
    envelope: husked.envelope,
    stream: [
      {
        type: "user",
        message: { content: "<local-command-stderr>This command requires approval</local-command-stderr>" },
      },
    ],
  });
  assert.equal(denied.verdict, "denied");
});

test("8 contended / zeroed / ghosted variants of hollow success", () => {
  assert.equal(score(seedContended()).verdict, "contended");
  assert.equal(score(seedZeroed()).verdict, "zeroed");
  assert.equal(score(seedGhosted()).verdict, "ghosted");
  assert.equal(score(seedGhosted()).signals.hasUserEvent, false);
  assert.equal(score(seedZeroed()).signals.gha, true);
});

test("9 locked vocabulary and fail-closed set", () => {
  assert.deepEqual(
    [...VERDICTS],
    ["kernel", "husked", "aborted", "denied", "nested", "contended", "zeroed", "ghosted"],
  );
  assert.deepEqual(
    [...FAIL_CLOSED],
    ["husked", "aborted", "denied", "nested", "contended", "zeroed", "ghosted"],
  );
  assert.equal(FAIL_CLOSED.includes("kernel"), false);
  assert.equal(IDLE_WORD, "kernel");
});

test("10 CLI adapters: husked fails even when the envelope is success / exit 0", () => {
  const husked = handle(JSON.stringify(seedHusked().envelope));
  assert.equal(husked.verdict, "husked");
  assert.equal(exitCode(husked), 1);

  const kernel = handle(JSON.stringify(seedKernel().envelope));
  assert.equal(kernel.verdict, "kernel");
  assert.equal(exitCode(kernel), 0);

  const aborted = handle(seed87159());
  assert.equal(aborted.verdict, "aborted");
  assert.equal(exitCode(aborted), 1);
});

test("11 NDJSON stream-json: last result event + user boom → aborted", () => {
  const seed = seed87159();
  const ndjson = seed.stream.map((event) => JSON.stringify(event)).join("\n");
  const result = scoreRaw(ndjson);
  assert.equal(result.verdict, "aborted");
  assert.equal(result.signals.preambleBoom, true);
});

test("12 helpers: hollow / empty result / classify kernel", () => {
  assert.equal(isEmptyResult(""), true);
  assert.equal(isEmptyResult(null), true);
  assert.equal(isEmptyResult("seed"), false);
  assert.equal(
    isHollow({ subtype: "success", is_error: false, num_turns: 0, result: "" }),
    true,
  );
  assert.equal(
    isHollow({ subtype: "success", is_error: false, num_turns: 1, result: "ok" }),
    false,
  );
  const kernelSignals = collectSignals(seedKernel());
  assert.equal(classify(kernelSignals), "kernel");
  assert.equal(exportedScore(seedHusked()).verdict, "husked");
});
