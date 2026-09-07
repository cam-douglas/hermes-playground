import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedUnanswered,
  seedRoused,
  classify,
  fingerprint,
  isCompletedTaskNotification,
  isMetaContinue,
  isSyntheticNoResponse,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS,
  IDLE_WORD,
  SEEDED_WORD
} from "./larum.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

const notice = {
  type: "user",
  uuid: "notice-1",
  origin: { kind: "task-notification" },
  promptSource: "sdk",
  message: {
    content: "<task-notification>\n<status>completed</status>\nreviewer result\n</task-notification>"
  }
};

const rousedTimeline = [
  { type: "assistant", uuid: "a0", message: { content: "waiting for the last reviewer to finish" } },
  { type: "queue-operation", op: "enqueue" },
  { type: "queue-operation", op: "dequeue" },
  notice,
  { type: "assistant", uuid: "a1", message: { content: "reviewer finished, continuing" } }
];

const unansweredTimeline = [
  { type: "assistant", uuid: "a0", message: { content: "waiting for the last reviewer to finish" } },
  { type: "queue-operation", op: "enqueue" },
  { type: "queue-operation", op: "dequeue" },
  notice,
  { type: "user", uuid: "nudge", message: { content: "continue" } }
];

const repairTimeline = [
  ...unansweredTimeline.slice(0, 4),
  {
    type: "user",
    isMeta: true,
    uuid: "meta-1",
    message: { content: "Continue from where you left off." }
  },
  {
    type: "assistant",
    model: "<synthetic>",
    parentUuid: "notice-1",
    message: { content: "No response requested." }
  },
  { type: "user", uuid: "nudge", message: { content: "continue" } },
  { type: "assistant", uuid: "a2", message: { content: "using the already-delivered result" } }
];

test("empty / idle probe is unanswered", () => {
  const out = decide({});
  assert.equal(out.verdict, "unanswered");
  assert.equal(out.unanswered, true);
  assert.equal(out.roused, false);
  assert.ok(ALARM.has("unanswered"));
});

test("seeded unanswered scores unanswered", () => {
  const out = decide(seedUnanswered());
  assert.equal(out.verdict, "unanswered");
  assert.equal(out.unanswered, true);
  assert.ok(out.chips.includes("unanswered"));
  assert.ok(out.chips.includes("last-of-batch"));
});

test("roused seed is a hold", () => {
  const out = decide(seedRoused());
  assert.equal(out.verdict, "roused");
  assert.equal(out.roused, true);
  assert.equal(out.unanswered, false);
  assert.ok(HOLD.has(out.verdict));
});

test("delivered-and-roused chip", () => {
  const out = decide({ seed: "delivered-and-roused", deliveredAndRoused: true });
  assert.equal(out.verdict, "delivered-and-roused");
  assert.equal(out.roused, true);
  assert.ok(HOLD.has("delivered-and-roused"));
  assert.match(out.reasons.join(" "), /575|99|seconds/i);
});

test("last-of-batch chip", () => {
  const out = decide({ seed: "last-of-batch", lastOfBatch: true });
  assert.equal(out.verdict, "last-of-batch");
  assert.equal(out.unanswered, true);
  assert.match(out.reasons.join(" "), /last pending|parallel batch/i);
});

test("synthetic-repair chip", () => {
  const out = decide({ seed: "synthetic-repair", syntheticRepair: true });
  assert.equal(out.verdict, "synthetic-repair");
  assert.ok(out.chips.includes("synthetic-repair"));
  assert.match(out.reasons.join(" "), /Continue from where you left off/);
  assert.match(out.reasons.join(" "), /No response requested/);
  assert.match(out.reasons.join(" "), /<synthetic>/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [21165, 39632] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#21165/);
  assert.match(out.reasons.join(" "), /#88742/);
  assert.match(out.reasons.join(" "), /Oubliette/);
});

test("fingerprint detects completed task-notification", () => {
  assert.equal(isCompletedTaskNotification(notice), true);
  assert.equal(
    isCompletedTaskNotification({ type: "user", origin: { kind: "task-notification" }, content: "hello" }),
    false
  );
});

test("fingerprint scores delivered-and-roused timeline", () => {
  const print = fingerprint(rousedTimeline);
  assert.equal(print.total, 1);
  assert.equal(print.rousedCount, 1);
  assert.equal(print.unansweredCount, 0);
  const out = decide({ entries: rousedTimeline });
  assert.equal(out.roused, true);
  assert.equal(out.verdict, "roused");
});

test("fingerprint scores unanswered timeline", () => {
  const print = fingerprint(unansweredTimeline);
  assert.equal(print.unansweredCount, 1);
  assert.equal(print.rousedCount, 0);
  const out = decide({ entries: unansweredTimeline, unanswered: true });
  assert.equal(out.verdict, "unanswered");
});

test("fingerprint scores synthetic repair pair", () => {
  assert.equal(isMetaContinue(repairTimeline[4]), true);
  assert.equal(isSyntheticNoResponse(repairTimeline[5], "notice-1"), true);
  const print = fingerprint(repairTimeline);
  assert.equal(print.anyRepair, true);
  assert.equal(print.unansweredCount, 1);
  const out = decide({ entries: repairTimeline, seed: "synthetic-repair" });
  assert.equal(out.verdict, "synthetic-repair");
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedUnanswered());
  assert.equal(idle.unanswered, true);
  const hold = classify(seedRoused());
  assert.equal(hold.roused, true);
});

test("measured facts from #92563", () => {
  assert.equal(MEASURED.issue, 92563);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "area:core",
    "area:agents",
    "platform:wsl"
  ]);
  assert.equal(MEASURED.updated, "2026-09-06T23:06:39Z");
  assert.equal(MEASURED.drops, 7);
  assert.equal(MEASURED.delivered, 580);
  assert.equal(MEASURED.permissionMode, "bypassPermissions");
  assert.equal(MEASURED.repairUser, "Continue from where you left off.");
  assert.equal(IDLE_WORD, "unanswered");
  assert.equal(SEEDED_WORD, "roused");
});

test("HOLD is roused / delivered-and-roused", () => {
  assert.ok(HOLD.has("roused"));
  assert.ok(HOLD.has("delivered-and-roused"));
  assert.equal(ALARM.has("roused"), false);
  for (const chip of ["unanswered", "last-of-batch", "synthetic-repair", "cousins"]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "unanswered",
    "roused",
    "last-of-batch",
    "delivered-and-roused",
    "synthetic-repair",
    "cousins"
  ]);
});

test("cousins table is cite-only wake neighbourhood", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [21165, 39632, 75043, 23909, 67524, 88742, 90555, 45581, 20754]
  );
});

test("living page is a limestone watchtower, not a clone", () => {
  assert.match(page, /Fraunces/);
  assert.match(page, /Figtree/);
  assert.match(page, /JetBrains Mono/);
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
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Archivo Black/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Bebas/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /Anybody/);
  assert.doesNotMatch(page, /Eczar/);
  assert.doesNotMatch(page, /Schibsted/);
  assert.doesNotMatch(page, /Martian Mono/);
  assert.match(page, /unanswered/);
  assert.match(page, /roused/);
  assert.match(page, /#92563/);
  assert.match(page, /Larum/);
  assert.match(page, /embed/);
  assert.match(page, /watchtower|larum|chronograph|ledger|ashlar|merlon/i);
  assert.match(page, /Oubliette/);
  assert.match(page, /task-notification/);
});

test("page does not reuse prior idle or seeded words", () => {
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
  assert.doesNotMatch(page, /\btruncated\b/);
  assert.doesNotMatch(page, /\bcringle\b/i);
  assert.doesNotMatch(page, /\bkerf\b/i);
  assert.doesNotMatch(page, /demurrage/i);
  assert.doesNotMatch(page, /scarph/i);
  assert.doesNotMatch(page, /plimsoll/i);
});
