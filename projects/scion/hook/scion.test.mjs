import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CHILD_BYTES,
  CHILD_RECORDS,
  CHIPS,
  FEATURED_ISSUE,
  HEALTHY_BANNER,
  HOLD_VERDICTS,
  IDLE_WORD,
  LAST_SEQUENCE_NUM,
  PARENT_BYTES,
  PARENT_OFFSET_MS,
  PARENT_RECORDS,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  handle,
  score,
  seedHollow,
  seedLined,
  seedUnbridged,
} from "./index.mjs";

test("hollow seed is hollow/fail", () => {
  const seed = seedHollow();
  const result = score(seed);
  assert.equal(result.verdict, "hollow");
  assert.equal(result.hollow, true);
  assert.equal(result.alarm, true);
  assert.equal(result.taken, false);
  assert.equal(result.hold, false);
  assert.equal(result.fresh, false);
  assert.equal(result.idleWord, "hollow");
  assert.equal(IDLE_WORD, "hollow");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.lastSequenceNum, LAST_SEQUENCE_NUM);
  assert.equal(seed.bytes, CHILD_BYTES);
  assert.equal(seed.records, CHILD_RECORDS);
  assert.equal(seed.parentBytes, PARENT_BYTES);
  assert.equal(seed.parentRecords, PARENT_RECORDS);
  assert.equal(seed.forkedFromSessionId, null);
  assert.equal(seed.kind, "interactive");
  assert.equal(seed.banner, HEALTHY_BANNER);
  assert.equal(seed.parentOffsetMs, PARENT_OFFSET_MS);
  assert.equal(analyze(seed).hollow, true);
  assert.ok(result.chips.includes("empty-fork"));
  assert.ok(result.chips.includes("lastSequenceNum-0"));
  assert.ok(result.chips.includes("no-forkedFrom"));
  assert.ok(result.chips.includes("healthy-banner"));
  assert.ok(result.chips.includes("bridge-won"));
  assert.ok(result.chips.includes("silent-drop"));
  assert.ok(result.chips.includes("vscode-rc"));
  assert.ok(result.chips.includes("race"));
  assert.ok(result.chips.includes("seedless"));
  assert.ok(result.chips.includes("unlineaged"));
});

test("lined and unbridged-success seeds are taken/hold", () => {
  const lined = score(seedLined());
  assert.equal(lined.verdict, "lined");
  assert.equal(lined.taken, true);
  assert.equal(lined.hold, true);
  assert.equal(lined.fresh, true);
  assert.equal(lined.alarm, false);
  assert.equal(lined.hollow, false);
  assert.equal(analyze(seedLined()).bytesMatch, true);
  assert.equal(seedLined().bytes, PARENT_BYTES);
  assert.ok(seedLined().forkedFromSessionId);

  const taken = score(seedUnbridged());
  assert.equal(taken.verdict, "taken");
  assert.equal(taken.taken, true);
  assert.equal(taken.hold, true);
  assert.equal(taken.fresh, true);
  assert.equal(taken.alarm, false);
  assert.equal(taken.hollow, false);
  assert.equal(seedUnbridged().bytes, PARENT_BYTES);
  assert.equal(seedUnbridged().uuidSwap, true);
});

test("decideSeed chip switches", () => {
  assert.equal(decideSeed("hollow").verdict, "hollow");
  assert.equal(decideSeed("lined").verdict, "lined");
  assert.equal(decideSeed("unbridged-success").verdict, "taken");
  assert.equal(decide({ action: "90815" }).verdict, "hollow");
  assert.equal(decide({ action: "lined" }).verdict, "lined");
  assert.equal(decide({ action: "taken" }).verdict, "taken");
});

test("rule: lastSequenceNum 0 + no fork + healthy banner is hollow", () => {
  const ticket = {
    lastSequenceNum: 0,
    forkedFromSessionId: null,
    kind: "interactive",
    banner: HEALTHY_BANNER,
    bytes: CHILD_BYTES,
    records: CHILD_RECORDS,
    parentBytes: PARENT_BYTES,
    parentRecords: PARENT_RECORDS,
  };
  assert.equal(classify(ticket), "hollow");
  assert.equal(score(ticket).alarm, true);
});

test("rule: matching bytes + forkedFromSessionId is lined/taken hold", () => {
  const ticket = {
    lastSequenceNum: 3942,
    forkedFromSessionId: "cfde1c9b",
    bytes: PARENT_BYTES,
    records: PARENT_RECORDS,
    parentBytes: PARENT_BYTES,
    parentRecords: PARENT_RECORDS,
    kind: "interactive",
  };
  const result = score(ticket);
  assert.equal(result.taken, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(HOLD_VERDICTS.includes(result.verdict));
});

test("local fingerprint files keep issue numbers", () => {
  const parent = JSON.parse(
    readFileSync(fileURLToPath(new URL("../data/parent.json", import.meta.url)), "utf8"),
  );
  const child = JSON.parse(
    readFileSync(fileURLToPath(new URL("../data/child.json", import.meta.url)), "utf8"),
  );
  const hollow = JSON.parse(
    readFileSync(fileURLToPath(new URL("../data/hollow.json", import.meta.url)), "utf8"),
  );
  assert.equal(parent.bytes, 9363037);
  assert.equal(parent.records, 3942);
  assert.equal(child.bytes, 40676);
  assert.equal(child.records, 38);
  assert.equal(child.lastSequenceNum, 0);
  assert.equal(child.kind, "interactive");
  assert.equal(child.forkedFromSessionId, null);
  assert.equal(child.parentOffsetMs, 2000);
  assert.equal(score(hollow).verdict, "hollow");
});

test("child jsonl opens as bridge-session lastSequenceNum 0", () => {
  const raw = readFileSync(
    fileURLToPath(new URL("../data/child.jsonl", import.meta.url)),
    "utf8",
  );
  const first = JSON.parse(raw.trim().split("\n")[0]);
  assert.equal(first.type, "bridge-session");
  assert.equal(first.lastSequenceNum, 0);
});

test("handle alarms on hollow and allows taken", async () => {
  const fail = await handle(seedHollow());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90815/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedUnbridged());
  assert.equal(hold.taken, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /taken/i);
});

test("verdict and chip lists", () => {
  assert.deepEqual(VERDICTS, ["hollow", "lined", "taken"]);
  assert.deepEqual(CHIPS, [
    "empty-fork",
    "bridge-won",
    "unlineaged",
    "lastSequenceNum-0",
    "no-forkedFrom",
    "silent-drop",
    "vscode-rc",
    "race",
    "healthy-banner",
    "seedless",
  ]);
  assert.ok(chipsOf(seedHollow()).length >= 6);
});
