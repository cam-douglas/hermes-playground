import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  AGENTS_AFFECTED,
  FEATURED_ISSUE,
  IDLE_WORD,
  INCORRECT_ITEMS,
  LINEAR_VERDICTS,
  SESSION_DATE,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  freshOf,
  backedOf,
  handle,
  isIdle,
  parseTranscript,
  score,
  seed90807,
  seedBacked,
  seedCitationTheatre,
  seedControl,
  seedCorrectionListOnly,
  seedFabricated,
  seedNestedEmpty,
  seedNeverReturned,
  seedParentBlind,
  seedPhantomCite,
  seedReset,
  seedSelfDisclosed,
  seedWithheld,
  seedWriteTurnLeak,
  verdictOf,
} from "./index.mjs";

const PRIOR_IDLES =
  /cued|fresh|engaged|stood|muted|liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|kernel|valid|sealed|dry|intact|open|still|loose|even|quiet|cool|latched|upheld|sterling|home|receipted|vouched|^voucher$|^kindling$|^deadband$|^pawl$|^cenotaph$|^fetch$|^sigil$|^blot$|^byline$|^husk$|^parity$|^assay$/;

function assertIdleNeverFailure(result) {
  assert.equal(result.idleWord, "backed");
  assert.equal(IDLE_WORD, "backed");
  assert.doesNotMatch(result.idleWord, /voucher/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
  if (result.alarm || result.verdict !== "backed") {
    assert.notEqual(result.verdict, "backed");
    assert.equal(result.backed, false);
    assert.equal(result.fresh, false);
  }
}

test("1 seed 90807 nested fan-out is fabricated-verified, never backed", () => {
  const seed = seedFabricated();
  const result = decide(seed);
  assert.equal(result.verdict, "fabricated-verified");
  assert.equal(result.state, "fabricated-verified");
  assert.equal(classify(seed), "fabricated-verified");
  assert.equal(verdictOf(seed), "fabricated-verified");
  assert.notEqual(result.verdict, "backed");
  assert.equal(result.alarm, true);
  assert.equal(result.backed, false);
  assert.equal(result.fresh, false);
  assert.equal(result.linear, true);
  assertIdleNeverFailure(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.primaryTriad, true);
  assert.equal(result.facts.neverReturned, true);
  assert.equal(result.facts.presented, true);
  assert.equal(result.facts.phantomCite, true);
  assert.equal(seed90807().incorrectItems, INCORRECT_ITEMS);
  assert.equal(seed.agentsAffected, AGENTS_AFFECTED);
  assert.equal(seed.sessionDate, SESSION_DATE);
  assert.equal(seed.childrenReturned, false);
});

test("2 idle probe is backed", () => {
  const result = score(emptyProbe());
  assert.equal(result.verdict, "backed");
  assert.equal(result.backed, true);
  assert.equal(result.fresh, true);
  assert.equal(result.alarm, false);
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(backedOf(emptyProbe()), true);
  assert.equal(freshOf(emptyProbe()), true);
  assertIdleNeverFailure(result);
});

test("3 honest returned payload and withheld survive as backed", () => {
  const hold = decide(seedBacked());
  assert.equal(hold.verdict, "backed");
  assert.equal(hold.backed, true);
  assert.equal(hold.fresh, true);
  assert.equal(hold.alarm, false);
  assert.equal(hold.facts.honest, true);
  assert.equal(hold.facts.primaryTriad, false);
  assert.equal(seedControl().childPayloadReturned, true);
  assert.match(feedOf("backed"), /idle word is backed/);

  const withheld = decide(seedWithheld());
  assert.equal(withheld.verdict, "backed");
  assert.equal(withheld.backed, true);
  assert.equal(withheld.facts.withheld, true);
  assert.equal(seedWithheld().withheldUnreturned, true);
  assert.notEqual(withheld.verdict, "fabricated-verified");
});

test("4 unique nearby seeds win their own class", () => {
  assert.equal(classify(seedNestedEmpty()), "nested-empty");
  assert.equal(classify(seedPhantomCite()), "phantom-cite");
  assert.equal(classify(seedSelfDisclosed()), "self-disclosed");
  assert.equal(classify(seedNeverReturned()), "never-returned");
  assert.equal(classify(seedCorrectionListOnly()), "correction-list-only");
  assert.equal(classify(seedCitationTheatre()), "citation-theatre");
  assert.equal(classify(seedParentBlind()), "parent-blind");
  assert.equal(classify(seedWriteTurnLeak()), "write-turn-leak");
  assert.notEqual(classify(seedNestedEmpty()), "fabricated-verified");
  assert.notEqual(classify(seedPhantomCite()), "backed");
});

test("5 decideSeed and restore land on 90807", () => {
  assert.equal(decideSeed("90807").verdict, "fabricated-verified");
  assert.equal(decideSeed("fabricated-verified").verdict, "fabricated-verified");
  assert.equal(decide({ action: "restore" }).verdict, "fabricated-verified");
  assert.equal(decide({ action: "backed" }).verdict, "backed");
  assert.equal(decide(seedReset()).verdict, "backed");
  assert.equal(decide(emptyAction("idle")).verdict, "backed");
  assert.equal(decideSeed("withheld").verdict, "backed");
  assert.equal(decideSeed("write-turn-leak").verdict, "write-turn-leak");
});

test("6 parseTranscript reads 90807 nested fabrication", () => {
  const raw = readFileSync(
    fileURLToPath(new URL("../data/90807.jsonl", import.meta.url)),
    "utf8",
  );
  const probe = parseTranscript(raw);
  const result = score(probe);
  assert.equal(probe.nestedFanOut, true);
  assert.equal(probe.neverReturned, true);
  assert.equal(probe.presentedAsVerified, true);
  assert.equal(probe.phantomCitations, true);
  assert.equal(result.verdict, "fabricated-verified");
  assert.equal(result.backed, false);
  assert.equal(result.fresh, false);
  assert.equal(result.alarm, true);
});

test("7 handle alarm on fabricated-verified; allow on backed", async () => {
  const jammed = await handle(seedFabricated());
  assert.equal(jammed.hook_event_name, "Stop");
  assert.match(jammed.hookSpecificOutput.additionalContext, /#90807/);
  assert.equal(jammed.alarm, true);
  assert.equal(jammed.hookSpecificOutput.additionalContext.startsWith("Voucher backed"), false);
  const hold = await handle(seedBacked());
  assert.match(hold.hookSpecificOutput.additionalContext, /backed/i);
  assert.equal(hold.backed, true);
  assert.equal(hold.fresh, true);
});

test("8 verdict list, idle word, and forbidden priors", () => {
  assert.deepEqual(VERDICTS, [
    "backed",
    "nested-empty",
    "phantom-cite",
    "self-disclosed",
    "fabricated-verified",
    "never-returned",
    "correction-list-only",
    "citation-theatre",
    "parent-blind",
    "write-turn-leak",
  ]);
  assert.ok(ALARM_VERDICTS.includes("fabricated-verified"));
  assert.ok(ALARM_VERDICTS.includes("nested-empty"));
  assert.ok(LINEAR_VERDICTS.includes("fabricated-verified"));
  assert.ok(!ALARM_VERDICTS.includes("backed"));
  const forbidden = forbiddenIdleWords();
  assert.ok(forbidden.includes("cued"));
  assert.ok(forbidden.includes("fresh"));
  assert.ok(forbidden.includes("voucher"));
  assert.ok(forbidden.includes("kindling"));
  assert.ok(!forbidden.includes("backed"));
  assert.equal(analyze(seedFabricated()).primaryTriad, true);
});
