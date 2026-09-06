import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedAccruing,
  seedCleared,
  classify,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS,
  PROCESSES,
  DAEMONS,
  FILING_CENSUS
} from "./demurrage.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

test("empty / idle probe is accruing", () => {
  const out = decide({});
  assert.equal(out.verdict, "accruing");
  assert.equal(out.accruing, true);
  assert.equal(out.cleared, false);
  assert.ok(ALARM.has("accruing"));
});

test("seeded accruing scores accruing with evidence chips", () => {
  const out = decide(seedAccruing());
  assert.equal(out.verdict, "accruing");
  assert.equal(out.accruing, true);
  assert.ok(out.chips.includes("accruing"));
  assert.ok(out.chips.includes("duplicate-resume"));
  assert.ok(out.chips.includes("deleted-binary"));
  assert.ok(out.chips.includes("no-lifecycle-flags"));
  assert.ok(out.chips.includes("daemon-orphan"));
});

test("cleared seed is a hold", () => {
  const out = decide(seedCleared());
  assert.equal(out.verdict, "cleared");
  assert.equal(out.cleared, true);
  assert.equal(out.accruing, false);
  assert.ok(HOLD.has(out.verdict));
});

test("released / reused fixture scores cleared", () => {
  const out = decide({
    seed: "cleared",
    cleared: true,
    released: true,
    reused: true
  });
  assert.equal(out.verdict, "cleared");
  assert.equal(out.cleared, true);
  assert.match(out.reasons.join(" "), /released|reused|cleared/i);
});

test("duplicate-resume chip", () => {
  const out = decide({
    seed: "duplicate-resume",
    duplicateResume: true,
    duplicateSameDaemon: true
  });
  assert.equal(out.verdict, "duplicate-resume");
  assert.equal(out.accruing, true);
  assert.ok(ALARM.has("duplicate-resume"));
  assert.match(out.reasons.join(" "), /2e283802/);
  assert.match(out.reasons.join(" "), /5b2efa6a/);
  assert.match(out.reasons.join(" "), /48h|48 h/);
});

test("daemon-orphan chip", () => {
  const out = decide({
    seed: "daemon-orphan",
    daemonOrphan: true
  });
  assert.equal(out.verdict, "daemon-orphan");
  assert.match(out.reasons.join(" "), /85fbdb5e/);
  assert.match(out.reasons.join(" "), /11 days/);
  assert.match(out.reasons.join(" "), /4 days/);
  assert.match(out.reasons.join(" "), /init/);
});

test("deleted-binary chip", () => {
  const out = decide({
    seed: "deleted-binary",
    deletedBinary: true
  });
  assert.equal(out.verdict, "deleted-binary");
  assert.match(out.reasons.join(" "), /2\.1\.247/);
  assert.match(out.reasons.join(" "), /cli-keep/);
  assert.match(out.reasons.join(" "), /397MB|397 MB/);
});

test("no-lifecycle-flags chip", () => {
  const out = decide({
    seed: "no-lifecycle-flags",
    noLifecycleFlags: true
  });
  assert.equal(out.verdict, "no-lifecycle-flags");
  assert.match(out.reasons.join(" "), /idle timeout/);
  assert.match(out.reasons.join(" "), /-stop/);
  assert.match(out.reasons.join(" "), /all-or-nothing/);
});

test("outage-census chip", () => {
  const out = decide({
    seed: "outage-census",
    outageCensus: true
  });
  assert.equal(out.verdict, "outage-census");
  assert.match(out.reasons.join(" "), /2026-08-31/);
  assert.match(out.reasons.join(" "), /8\.1/);
  assert.match(out.reasons.join(" "), /2026-09-01/);
  assert.match(out.reasons.join(" "), /15 GB/);
  assert.match(out.reasons.join(" "), /MQTT/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92059, 1935, 49790] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.accruing, true);
  assert.match(out.reasons.join(" "), /#92548/);
  assert.match(out.reasons.join(" "), /#92059/);
  assert.match(out.reasons.join(" "), /#1935/);
  assert.match(out.reasons.join(" "), /#49790/);
  assert.match(out.reasons.join(" "), /#92510/);
});

test("classify reads fixture objects", () => {
  const berth = classify({
    accruing: true,
    duplicateSameDaemon: true,
    rssMb: 300,
    idleDays: 4,
    deletedBinary: true,
    platform: "linux"
  });
  assert.equal(berth.rssMb, 300);
  assert.equal(berth.sameDaemonDup, true);
  assert.equal(berth.deletedBinary, true);
  assert.equal(berth.idleDays, 4);
  assert.equal(berth.linuxSelfHost, true);
});

test("measured table matches the issue", () => {
  assert.equal(MEASURED.rssPerChatMb, 300);
  assert.equal(MEASURED.rssLowMb, 250);
  assert.equal(MEASURED.rssHighMb, 420);
  assert.equal(MEASURED.hostRamGb, 15);
  assert.equal(MEASURED.swap, false);
  assert.equal(MEASURED.linux, "6.12.24");
  assert.equal(MEASURED.host, "Unraid");
  assert.equal(MEASURED.transport, "Tailscale SSH");
  assert.deepEqual(MEASURED.clients, ["desktop", "mobile"]);
  assert.equal(MEASURED.cliKeepDefault, 3);
  assert.equal(MEASURED.prunedStillRunning, "2.1.247");
  assert.deepEqual(MEASURED.onDisk, ["2.1.255", "2.1.258", "2.1.260"]);
  assert.equal(MEASURED.runningCounts["2.1.247"], 2);
  assert.equal(MEASURED.idleDaemonDays, 11);
  assert.equal(MEASURED.idleSinceClientDays, 4);
  assert.equal(MEASURED.outage1.date, "2026-08-31");
  assert.equal(MEASURED.outage1.load, 87);
  assert.equal(MEASURED.outage1.sessions, 23);
  assert.equal(MEASURED.outage1.heldGb, 8.1);
  assert.equal(MEASURED.outage2.date, "2026-09-01");
  assert.equal(MEASURED.outage2.load, 97);
  assert.equal(MEASURED.outage2.freeMb, 324);
  assert.equal(MEASURED.outage2.sessions, 59);
  assert.equal(MEASURED.outage2.heldGb, 15);
  assert.equal(MEASURED.stopRecoveredMb, 478);
  assert.equal(MEASURED.stopReleasedChats, 4);
  assert.ok(MEASURED.flagsMissing.includes("idle-timeout"));
  assert.ok(MEASURED.flagsMissing.includes("max-session"));
  assert.ok(MEASURED.flagsMissing.includes("eviction"));
  assert.ok(MEASURED.flagsPresent.includes("-stop"));
  assert.ok(!MEASURED.flagsPresent.includes("-idle"));
});

test("process table has the decisive same-daemon duplicate", () => {
  const dups = PROCESSES.filter((p) => p.conversation === "2e283802" && p.socket === "5b2efa6a");
  assert.equal(dups.length, 2);
  assert.ok(dups.some((p) => p.duplicateSameDaemon === true));
  assert.equal(PROCESSES.length, 9);
  assert.equal(DAEMONS.length, 4);
  assert.ok(DAEMONS.some((d) => d.socket === "85fbdb5e" && d.idleDays === 4 && d.upDays === 11));
  assert.equal(FILING_CENSUS.filter((r) => r.deleted).length, 2);
});

test("HOLD is cleared only", () => {
  assert.deepEqual([...HOLD], ["cleared"]);
  assert.equal(ALARM.has("cleared"), false);
  for (const chip of [
    "accruing",
    "duplicate-resume",
    "daemon-orphan",
    "deleted-binary",
    "no-lifecycle-flags",
    "outage-census",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "accruing",
    "cleared",
    "duplicate-resume",
    "daemon-orphan",
    "deleted-binary",
    "no-lifecycle-flags",
    "outage-census",
    "cousins"
  ]);
});

test("cousins table is cite-only lifecycle neighbourhood", () => {
  assert.deepEqual(COUSINS.map((c) => c.id), [92059, 1935, 49790]);
});

test("living page is a demurrage clerk ledger, not a clone", () => {
  assert.match(page, /Newsreader/);
  assert.match(page, /Public Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Archivo Black/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /Bebas/);
  assert.doesNotMatch(page, /Anybody/);
  assert.match(page, /accruing/);
  assert.match(page, /cleared/);
  assert.match(page, /#92548/);
  assert.match(page, /Demurrage/);
  assert.match(page, /embed/);
  assert.match(page, /BERTH 192|berth 192/i);
  assert.match(page, /laytime|overstay|hulk|berth|ledger|daemon/i);
});

test("page does not reuse prior idle or seeded words", () => {
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
  assert.doesNotMatch(page, /wastegate/i);
  assert.doesNotMatch(page, /bourdon-tube|bourdon tube/i);
  assert.doesNotMatch(page, /plimsoll/i);
  assert.doesNotMatch(page, /scarph/i);
});
