import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedSaturating, seedVented, HOLD, ALARM, CONTROL } from "./bourdon.mjs";

test("empty / idle probe is saturating", () => {
  const out = decide({});
  assert.equal(out.verdict, "saturating");
  assert.equal(out.saturating, true);
  assert.equal(out.vented, false);
});

test("seeded saturating scores saturating", () => {
  const out = decide(seedSaturating());
  assert.equal(out.verdict, "saturating");
  assert.equal(out.saturating, true);
  assert.ok(out.chips.includes("saturating"));
  assert.ok(out.chips.includes("host-fd-409600"));
  assert.ok(out.chips.includes("guest-clean-512"));
  assert.ok(out.chips.includes("idle-12h-after-prompt"));
});

test("host fd climb scores saturating with chips", () => {
  const out = decide({ hostFd: 409600, guestFd: 512, idleHoursAfterPrompt: 12 });
  assert.equal(out.verdict, "saturating");
  assert.ok(out.chips.includes("host-fd-409600"));
  assert.ok(out.chips.includes("guest-clean-512"));
  assert.ok(out.chips.includes("idle-12h-after-prompt"));
});

test("vented seed is a hold", () => {
  const out = decide(seedVented());
  assert.equal(out.verdict, "vented");
  assert.equal(out.vented, true);
  assert.equal(out.saturating, false);
  assert.ok(HOLD.has(out.verdict));
});

test("Cmd+Q releases is vented", () => {
  const out = decide({
    seed: "vented",
    vented: true,
    cmdq: true,
    hostFd: 0
  });
  assert.equal(out.verdict, "vented");
  assert.match(out.reasons.join(" "), /Cmd\+Q/);
});

test("host-fd-409600 chip", () => {
  const out = decide({ seed: "host-fd-409600", hostFd: 409600 });
  assert.equal(out.verdict, "host-fd-409600");
  assert.equal(out.saturating, true);
  assert.ok(ALARM.has("host-fd-409600"));
  assert.match(out.reasons.join(" "), /409,600/);
  assert.match(out.reasons.join(" "), /71%/);
});

test("guest-clean-512 chip", () => {
  const out = decide({ seed: "guest-clean-512", guestFd: 512 });
  assert.equal(out.verdict, "guest-clean-512");
  assert.match(out.reasons.join(" "), /file-nr/);
  assert.match(out.reasons.join(" "), /512/);
});

test("idle-12h-after-prompt chip", () => {
  const out = decide({ seed: "idle-12h-after-prompt", idleHoursAfterPrompt: 12 });
  assert.equal(out.verdict, "idle-12h-after-prompt");
  assert.match(out.reasons.join(" "), /12 hours/);
});

test("virtiofs-suspect chip", () => {
  const out = decide({ seed: "virtiofs-suspect", virtiofsSuspect: true });
  assert.equal(out.verdict, "virtiofs-suspect");
  assert.match(out.reasons.join(" "), /virtiofs/);
  assert.match(out.reasons.join(" "), /NON-BINDING/);
});

test("cmdq-releases is a vent, not a saturate", () => {
  const out = decide({ seed: "cmdq-releases", cmdq: true });
  assert.equal(out.verdict, "cmdq-releases");
  assert.equal(out.saturating, false);
  assert.equal(out.vented, true);
  assert.match(out.reasons.join(" "), /Cmd\+Q/);
});

test("cli-no-vm-clean is a control, not a saturate", () => {
  const out = decide({ seed: "cli-no-vm-clean", cliNoVm: true });
  assert.equal(out.verdict, "cli-no-vm-clean");
  assert.equal(out.saturating, false);
  assert.equal(out.vented, true);
  assert.ok(CONTROL.has("cli-no-vm-clean"));
  assert.match(out.reasons.join(" "), /no VM/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [79920, 92069, 29573] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.saturating, true);
  assert.match(out.reasons.join(" "), /#92510/);
  assert.match(out.reasons.join(" "), /#79920/);
  assert.match(out.reasons.join(" "), /#92069/);
  assert.match(out.reasons.join(" "), /#26087/);
});
