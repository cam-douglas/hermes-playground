import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubCoteLedger,
  linearCoteTicket,
  slackCoteAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CONTROL_ROUND_TRIP_S,
  IDLE_WORD,
  LINEAR_VERDICTS,
  PLACEHOLDER_ID,
  RESUMED_ID,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  idsMatch,
  isHold,
  isIdle,
  isStray,
  parseProbe,
  reasonsOf,
  score,
  seed90332Drained,
  seedBanded,
  seedConsumed,
  seedCrossed,
  seedFlown,
  seedLate,
  seedLofted,
  seedParked,
  seedRoosted,
  seedStray,
  verdictOf,
} from "./cote.mjs";
import { handle, listen } from "./index.mjs";

const ROOT = fileURLToPath(new URL("../../..", import.meta.url));

function assertIdleNeverCote(result) {
  assert.equal(result.idleWord, "roosted");
  assert.equal(IDLE_WORD, "roosted");
  assert.doesNotMatch(result.idleWord, /cote/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(result.state, /cote/i);
  assert.doesNotMatch(IDLE_WORD, /cote/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90332 drained is drained, slack, linear, idleWord roosted", () => {
  const seed = seed90332Drained();
  const result = decide(seed);
  assert.equal(result.verdict, "drained");
  assert.equal(result.state, "drained");
  assert.equal(result.decision, "drained");
  assert.equal(classify(seed.probe), "drained");
  assert.equal(verdictOf(seed.probe), "drained");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.loftDrained, true);
  assert.equal(result.loftRoosted, false);
  assertIdleNeverCote(result);
  assert.equal(result.session, "90332-drained");
  assert.equal(result.issue, 90332);
  assert.equal(result.placeholderId, PLACEHOLDER_ID);
  assert.equal(result.resumedId, RESUMED_ID);
  assert.equal(result.leadSessionId, PLACEHOLDER_ID);
  assert.equal(result.parentSessionId, RESUMED_ID);
  assert.equal(result.teamName, "session-PPPPPPPP");
  assert.equal(result.sendSuccess, true);
  assert.equal(result.inboxEmptied, true);
  assert.equal(result.msgIdInParent, false);
  assert.equal(result.parentGrepCount, 0);
  assert.equal(result.parentMidTurn, true);
  assert.equal(result.agentIdle, true);
  assert.equal(result.teamCreatedBeforeResume, true);
  assert.equal(result.placeholderTranscriptExists, false);
  assert.match(result.feed, /success receipt is not a roost/);
  assert.ok(result.reasons.some((line) => /ZERO times/.test(line)));
  assert.ok(result.reasons.some((line) => /PRIMARY #90332/.test(line)));
  assert.equal(decideSeed(90332).verdict, "drained");
  assert.equal(decideSeed("drained").verdict, "drained");
  assert.equal(decideSeed("90332-drained").verdict, "drained");
});

test("2 idle/empty/{} is roosted, never the product name, never empty", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "roosted");
  assert.equal(result.verdict, "roosted");
  assert.equal(result.decision, "roosted");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(classify({}), "roosted");
  assert.equal(classify(emptyProbe()), "roosted");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverCote(result);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "roosted");
  assert.equal(cleared.idleWord, "roosted");
  assert.equal(cleared.sendSuccess, false);
  assert.equal(cleared.inboxEmptied, false);
  assert.doesNotMatch(cleared.state, /cote/i);
  const empty = decide({});
  assert.equal(empty.verdict, "roosted");
  assert.equal(empty.idleWord, "roosted");
});

test("3 healthy roosted: ids match and parent actually received the message", () => {
  const result = decide(seedRoosted());
  assert.equal(result.verdict, "roosted");
  assert.equal(result.leadSessionId, RESUMED_ID);
  assert.equal(result.resumedId, RESUMED_ID);
  assert.equal(result.sendSuccess, true);
  assert.equal(result.msgIdInParent, true);
  assert.equal(result.parentGrepCount, 1);
  assert.equal(result.roundTripSeconds, CONTROL_ROUND_TRIP_S);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.loftRoosted, true);
  assert.equal(result.hold, true);
  assert.equal(idsMatch(seedRoosted().probe), true);
  assert.equal(isHold(seedRoosted().probe), true);
  assert.match(result.feed, /Roosted/);
  assert.equal(decideSeed("roosted").verdict, "roosted");
});

test("4 admit roosted does not lie on a drained probe", () => {
  const admitted = decide({ ...seed90332Drained(), action: "admit" });
  assert.equal(admitted.verdict, "drained");
  assert.equal(admitted.action, "admit");
  assert.equal(admitted.hold, false);
  assert.notEqual(admitted.verdict, "roosted");
});

test("5 band on idle loft produces a roosted hold", () => {
  const result = decide({ action: "band", probe: emptyProbe() });
  assert.equal(result.verdict, "roosted");
  assert.equal(result.msgIdInParent, true);
  assert.equal(result.sendSuccess, true);
  assert.equal(idsMatch(result.probe), true);
  assert.equal(result.hold, true);
});

test("6 band on a drained probe does not invent a hold", () => {
  const result = decide({ ...seed90332Drained(), action: "band" });
  assert.equal(result.verdict, "drained");
  assert.equal(result.hold, false);
});

test("7 lofted: cote exists, not yet a hold", () => {
  const result = decide(seedLofted());
  assert.equal(result.verdict, "lofted");
  assert.equal(result.teamHubExists, true);
  assert.equal(result.sendSuccess, false);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /not yet a hold/);
  assert.equal(decideSeed("lofted").verdict, "lofted");
});

test("8 flown: success:true is a receipt, not a roost", () => {
  const result = decide(seedFlown());
  assert.equal(result.verdict, "flown");
  assert.equal(result.sendSuccess, true);
  assert.equal(result.inboxEmptied, false);
  assert.equal(result.msgIdInParent, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /the bird left/);
  assert.equal(decideSeed("flown").verdict, "flown");
});

test("9 parked: named agent idle after consumed-but-undelivered, ids match", () => {
  const result = decide(seedParked());
  assert.equal(result.verdict, "parked");
  assert.equal(result.agentIdle, true);
  assert.equal(result.inboxEmptied, true);
  assert.equal(result.msgIdInParent, false);
  assert.equal(idsMatch(seedParked().probe), true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /stays alive and idle/);
  assert.equal(decideSeed("parked").verdict, "parked");
});

test("10 stray: placeholder lead, resumed parent, inbox not emptied", () => {
  const result = decide(seedStray());
  assert.equal(result.verdict, "stray");
  assert.equal(isStray(seedStray().probe), true);
  assert.equal(result.inboxEmptied, false);
  assert.equal(result.sendSuccess, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /placeholder/);
  assert.equal(decideSeed("stray").verdict, "stray");
});

test("11 banded: bird band does not match the hole", () => {
  const result = decide(seedBanded());
  assert.equal(result.verdict, "banded");
  assert.equal(result.bandMismatch, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /does not match the hole/);
  assert.equal(decideSeed("banded").verdict, "banded");
});

test("12 crossed: completion routed to the wrong parent", () => {
  const result = decide(seedCrossed());
  assert.equal(result.verdict, "crossed");
  assert.equal(result.wrongParent, true);
  assert.equal(result.issue, 83599);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /wrong parent/);
  assert.equal(decideSeed("crossed").verdict, "crossed");
  assert.equal(decideSeed(83599).verdict, "crossed");
  assert.equal(decideSeed(81438).verdict, "crossed");
});

test("13 consumed: watcher took the inbox, parent never saw it, ids match", () => {
  const result = decide(seedConsumed());
  assert.equal(result.verdict, "consumed");
  assert.equal(result.inboxEmptied, true);
  assert.equal(result.msgIdInParent, false);
  assert.equal(result.agentIdle, false);
  assert.equal(idsMatch(seedConsumed().probe), true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /parent never saw it/);
  assert.equal(decideSeed("consumed").verdict, "consumed");
});

test("14 late: team stamped before resume finished, no send yet", () => {
  const result = decide(seedLate());
  assert.equal(result.verdict, "late");
  assert.equal(result.teamCreatedBeforeResume, true);
  assert.equal(result.sendSuccess, false);
  assert.equal(result.inboxEmptied, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /before resume finished/);
  assert.equal(decideSeed("late").verdict, "late");
});

test("15 first-match: idle roosted beats every later class", () => {
  assert.equal(classify({}), "roosted");
  assert.equal(classify(emptyProbe()), "roosted");
});

test("16 first-match: crossed beats drained when routed to the wrong parent", () => {
  assert.equal(
    classify({
      ...seed90332Drained().probe,
      wrongParent: true,
    }),
    "crossed",
  );
});

test("17 first-match: banded beats drained when the band misses the hole", () => {
  assert.equal(
    classify({
      ...seed90332Drained().probe,
      bandMismatch: true,
      scoredAgainst: RESUMED_ID,
    }),
    "banded",
  );
});

test("18 first-match: drained beats parked / stray / late on #90332", () => {
  const probe = seed90332Drained().probe;
  assert.equal(probe.agentIdle, true);
  assert.equal(isStray(probe), true);
  assert.equal(probe.teamCreatedBeforeResume, true);
  assert.equal(classify(probe), "drained");
});

test("19 first-match: parked beats consumed when the named agent stays idle", () => {
  assert.equal(
    classify({
      resumedId: RESUMED_ID,
      liveSessionId: RESUMED_ID,
      leadSessionId: RESUMED_ID,
      sendSuccess: true,
      inboxEmptied: true,
      msgIdInParent: false,
      agentIdle: true,
    }),
    "parked",
  );
});

test("20 roosted requires ids match AND parent received the message", () => {
  assert.equal(
    classify({
      resumedId: RESUMED_ID,
      liveSessionId: RESUMED_ID,
      leadSessionId: RESUMED_ID,
      sendSuccess: true,
      inboxEmptied: true,
      msgIdInParent: false,
    }),
    "consumed",
  );
  assert.equal(
    classify({
      resumedId: RESUMED_ID,
      liveSessionId: RESUMED_ID,
      leadSessionId: PLACEHOLDER_ID,
      placeholderId: PLACEHOLDER_ID,
      sendSuccess: true,
      inboxEmptied: false,
      msgIdInParent: true,
    }),
    "stray",
  );
  assert.equal(isHold(seed90332Drained().probe), false);
  assert.equal(decide(seed90332Drained()).hold, false);
});

test("21 success:true alone is flown, not roosted", () => {
  assert.equal(
    classify({
      resumedId: RESUMED_ID,
      liveSessionId: RESUMED_ID,
      leadSessionId: RESUMED_ID,
      sendSuccess: true,
      msgIdInParent: false,
    }),
    "flown",
  );
});

test("22 emptied inbox alone is not a hold", () => {
  assert.equal(
    classify({
      resumedId: RESUMED_ID,
      liveSessionId: RESUMED_ID,
      leadSessionId: RESUMED_ID,
      sendSuccess: true,
      inboxEmptied: true,
      msgIdInParent: false,
    }),
    "consumed",
  );
});

test("23 every verdict is uniquely first-match on its seed", () => {
  const map = {
    roosted: seedRoosted,
    lofted: seedLofted,
    flown: seedFlown,
    drained: seed90332Drained,
    parked: seedParked,
    stray: seedStray,
    banded: seedBanded,
    crossed: seedCrossed,
    consumed: seedConsumed,
    late: seedLate,
  };
  const seen = new Set();
  for (const [word, seed] of Object.entries(map)) {
    const got = classify(seed().probe);
    assert.equal(got, word, word);
    assert.equal(seen.has(got), false, word);
    seen.add(got);
  }
  assert.equal(seen.size, 10);
  assert.deepEqual(VERDICTS.slice().sort(), Object.keys(map).sort());
});

test("24 slack alarm list is drained parked stray crossed consumed late", () => {
  assert.deepEqual(SLACK_VERDICTS, [
    "drained",
    "parked",
    "stray",
    "crossed",
    "consumed",
    "late",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["drained", "parked", "consumed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(SLACK_VERDICTS.includes("roosted"), false);
  assert.equal(SLACK_VERDICTS.includes("lofted"), false);
  assert.equal(SLACK_VERDICTS.includes("flown"), false);
  assert.equal(SLACK_VERDICTS.includes("banded"), false);
  assert.equal(LINEAR_VERDICTS.includes("roosted"), false);
  assert.equal(LINEAR_VERDICTS.includes("stray"), false);
});

test("25 flagsOf matches slack / linear / github contract", () => {
  assert.deepEqual(flagsOf("drained"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("roosted"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("flown"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("stray"), { slack: true, linear: false, github: true, alarm: true });
});

test("26 slack demo skips roosted and posts drained", () => {
  const roosted = slackCoteAlarm(decide(seedRoosted()), {});
  assert.equal(roosted.mode, "demo");
  assert.match(roosted.summary, /Would skip Slack/);
  const drained = slackCoteAlarm(decide(seed90332Drained()), {});
  assert.equal(drained.mode, "demo");
  assert.match(drained.summary, /drained loft alarm/);
});

test("27 linear demo skips roosted and opens drained / parked / consumed", () => {
  const roosted = linearCoteTicket(decide(seedRoosted()), {});
  assert.match(roosted.summary, /Would skip Linear/);
  const drained = linearCoteTicket(decide(seed90332Drained()), {});
  assert.match(drained.summary, /Would open a Linear ticket/);
  const parked = linearCoteTicket(decide(seedParked()), {});
  assert.match(parked.summary, /Linear/);
  const consumed = linearCoteTicket(decide(seedConsumed()), {});
  assert.match(consumed.summary, /Linear/);
});

test("28 GitHub cote-ledger fires on every scored probe", () => {
  const seeds = [
    seedRoosted(),
    seed90332Drained(),
    seedLofted(),
    seedFlown(),
    seedParked(),
    seedStray(),
    seedBanded(),
    seedCrossed(),
    seedConsumed(),
    seedLate(),
  ];
  for (const seed of seeds) {
    const result = decide(seed);
    assert.equal(result.github, true, result.verdict);
    const row = githubCoteLedger(result, {});
    assert.match(row.summary, /cote-ledger/, result.verdict);
    assert.equal(row.adapter, "github");
  }
});

test("29 GitHub ledger fires on idle/clear scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.github, true);
});

test("30 slack live plan uses webhook; demo stays honest without it", () => {
  const drained = decide(seed90332Drained());
  const live = slackCoteAlarm(drained, { COTE_SLACK_WEBHOOK: "https://hooks.example/x" });
  assert.equal(live.mode, "live");
  const alias = slackCoteAlarm(drained, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(alias.mode, "live");
  const github = githubCoteLedger(drained, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
});

test("31 fire fetch throw stays honest", async () => {
  const drained = decide(seed90332Drained());
  const fired = await fire(
    drained,
    { COTE_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => {
      throw new Error("network down");
    },
  );
  assert.equal(fired.events[0].ok, false);
  assert.match(fired.events[0].summary, /network down/);
});

test("32 handle drained denies; roosted allows", async () => {
  const drained = await handle(seed90332Drained(), {});
  assert.equal(drained.permissionDecision, "deny");
  assert.match(drained.hookSpecificOutput.decision.message, /drained/i);
  const roosted = await handle(seedRoosted(), {});
  assert.equal(roosted.permissionDecision, "allow");
  assert.match(roosted.hookSpecificOutput.decision.message, /roosted/);
});

test("33 handle parked / stray / crossed / consumed / late deny", async () => {
  assert.equal((await handle(seedParked(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedStray(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedCrossed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedConsumed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedLate(), {})).permissionDecision, "deny");
});

test("34 listen POST empty body scores default idle-or-empty as roosted", async () => {
  const server = listen(19332);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19332/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "roosted");
  assert.equal(body.idleWord, "roosted");
  await new Promise((resolve) => server.close(resolve));
});

test("35 listen GET health names the ten verbs", async () => {
  const server = listen(19333);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19333/health");
  const body = await res.json();
  assert.equal(body.product, "cote");
  assert.match(body.verbs, /drained/);
  assert.match(body.verbs, /roosted/);
  await new Promise((resolve) => server.close(resolve));
});

test("36 parseProbe reads a JSON SendMessage + inbox dump", () => {
  const probe = parseProbe({
    placeholderId: PLACEHOLDER_ID,
    resumedId: RESUMED_ID,
    leadSessionId: PLACEHOLDER_ID,
    parentSessionId: RESUMED_ID,
    teamName: "session-PPPPPPPP",
    sendMessage: { success: true, message: "Message sent to team-lead's inbox", msg_id: "band-1" },
    inbox: "[]",
    parentGrepCount: 0,
    teamCreatedBeforeResume: true,
  });
  assert.equal(probe.sendSuccess, true);
  assert.equal(probe.msgId, "band-1");
  assert.equal(probe.inboxEmptied, true);
  assert.equal(classify(probe), "drained");
});

test("37 parseProbe reads loose #90332 text", () => {
  const probe = parseProbe(`
    Placeholder id PPPPPPPP-… minted at process start.
    leadSessionId: PPPPPPPP-…
    --parent-session-id RRRRRRRR-…
    --team-name session-PPPPPPPP
    SendMessage returned success:true Message sent to team-lead's inbox msg_id: band-x
    inbox emptied to [] while parent mid-turn
    msg_id appears ZERO times in the parent transcript
    team created one second after launch, before resume
    ~/.claude/teams/session-PPPPPPPP/
  `);
  assert.equal(probe.sendSuccess, true);
  assert.equal(probe.inboxEmptied, true);
  assert.equal(probe.parentGrepCount, 0);
  assert.equal(classify(probe), "drained");
});

test("38 score reasons always include identity and receipt lines", () => {
  const roosted = score(seedRoosted().probe);
  assert.ok(roosted.reasons.some((line) => /live session id == team leadSessionId/.test(line)));
  assert.ok(roosted.reasons.some((line) => /idle word is roosted/.test(line)));
  const drained = score(seed90332Drained().probe);
  assert.ok(drained.reasons.some((line) => /inbox file emptied to \[\]/.test(line)));
  assert.ok(drained.reasons.some((line) => /success receipt is not a roost/.test(line)));
});

test("39 feed and reasons never use cote or empty as the idle word", () => {
  const roosted = score(emptyProbe());
  assert.equal(roosted.idleWord, "roosted");
  assert.doesNotMatch(roosted.feed, /idle word is cote/i);
  assert.doesNotMatch(roosted.feed, /idle word is empty/i);
  assert.ok(roosted.reasons.every((line) => !/idle word is cote/i.test(line)));
  assert.ok(forbiddenIdleWords().includes("cote"));
  assert.ok(forbiddenIdleWords().includes("empty"));
  assert.ok(forbiddenIdleWords().includes("stocked"));
  assert.ok(forbiddenIdleWords().includes("seated"));
});

test("40 cloneProbe accepts nested team / loft / sendMessage", () => {
  const next = cloneProbe({
    team: { leadSessionId: PLACEHOLDER_ID, teamName: "session-PPPPPPPP" },
    loft: { resumedId: RESUMED_ID },
    sendMessage: { success: true, msg_id: "x" },
    inboxJson: "[]",
    parentGrepCount: 0,
    placeholderId: PLACEHOLDER_ID,
  });
  assert.equal(next.leadSessionId, PLACEHOLDER_ID);
  assert.equal(next.resumedId, RESUMED_ID);
  assert.equal(next.sendSuccess, true);
  assert.equal(next.inboxEmptied, true);
});

test("41 decide accepts a pasted string", () => {
  const result = decide(`leadSessionId: PPPPPPPP-… --parent-session-id RRRRRRRR-… success:true inbox emptied to [] ZERO times before resume teams/session-PPPPPPPP`);
  assert.equal(result.verdict, "drained");
});

test("42 score shape is stable", () => {
  const result = score(seed90332Drained().probe);
  assertScoreShape(result);
  assert.equal(result.idleWord, "roosted");
  assert.equal(feedOf(seed90332Drained().probe, "drained").startsWith("● Drained"), true);
  assert.ok(reasonsOf(seed90332Drained().probe).length > 4);
});

test("43 control 1.3 s is only on the roosted hold, never invented on #90332 drain", () => {
  assert.equal(seedRoosted().probe.roundTripSeconds, 1.3);
  assert.equal(seed90332Drained().probe.roundTripSeconds, 0);
  assert.equal(CONTROL_ROUND_TRIP_S, 1.3);
});

test("44 catalog wires Cote featured first, 24 products, Larder unfeatured", () => {
  const catalog = JSON.parse(readFileSync(`${ROOT}/catalog.json`, "utf8"));
  assert.equal(catalog.products.length, 24);
  assert.equal(catalog.products[0].name, "Cote");
  assert.equal(catalog.products[0].slug, "cote");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cote/");
  assert.equal(catalog.products[0].day, "2026-08-28");
  assert.equal(catalog.products[0].subdomain, "https://hermes-playground-green.vercel.app/cote/");
  assert.match(catalog.products[0].summary, /Score the loft or admit roosted/);
  const featured = catalog.products.filter((item) => item.featured);
  assert.equal(featured.length, 1);
  const slugs = catalog.products.map((item) => item.slug);
  for (const slug of [
    "cote",
    "larder",
    "tappet",
    "aside",
    "chute",
    "tain",
    "husk",
    "snib",
    "veto",
    "assay",
    "wicket",
    "sigil",
    "stencil",
    "suture",
    "blot",
    "coda",
    "reed",
    "fathom",
    "hasp",
    "parity",
    "reveille",
    "quench",
    "scrim",
    "knock",
  ]) {
    assert.ok(slugs.includes(slug), slug);
  }
  const larder = catalog.products.find((item) => item.slug === "larder");
  assert.equal(larder.featured, false);
});

test("45 vercel.json rewrites /cote before /larder and the slug catch-alls", () => {
  const vercel = JSON.parse(readFileSync(`${ROOT}/vercel.json`, "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.ok(sources.includes("/cote"));
  assert.ok(sources.includes("/cote/"));
  assert.ok(sources.indexOf("/cote") < sources.indexOf("/larder"));
  assert.ok(sources.indexOf("/cote/") < sources.indexOf("/:slug"));
});

test("46 hours.json prepends the 22:50 Australia/Sydney Cote ship", () => {
  const hours = JSON.parse(readFileSync(`${ROOT}/runs/hours.json`, "utf8"));
  assert.equal(hours[0].title, "Cote");
  assert.equal(hours[0].stem, "2026-08-28-cote");
  assert.equal(hours[0].time, "22:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].date, "2026-08-28");
});

test("47 desk HTML sanity: idle word roosted, seeded drained, never cote-as-state", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /roosted/);
  assert.match(html, /Admit roosted/);
  assert.match(html, /drained/);
  assert.match(html, /90332/);
  assert.match(html, /seedOf\("drained"\)|probe = seedOf\("drained"\)/);
  assert.doesNotMatch(html, /Admit cote/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cote"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.match(html, /const IDLE_WORD = "roosted"/);
  assert.doesNotMatch(html, /zinc shelf|butcher-paper|ice-room|cam-lobe|valve train|theatre wing|mail chute|one-way glass/);
  assert.match(html, /dove-cote|pigeon loft|nest holes|hopper|whitewash/i);
  assert.match(html, /Score the loft or admit roosted/);
  assert.match(html, /NOT Reveille/);
  assert.match(html, /NOT Larder/);
  assert.match(html, /NOT Husk/);
});

test("48 README and run log speak the catalog voice", () => {
  const readme = readFileSync(`${ROOT}/README.md`, "utf8");
  assert.match(readme, /Featured: \[Cote\]/);
  assert.match(readme, /Listed: \[Larder\]/);
  assert.match(readme, /24 products/);
  assert.match(readme, /Score the loft or admit roosted/);
  const run = readFileSync(`${ROOT}/runs/2026-08-28-cote.md`, "utf8");
  assert.match(run, /Twenty-fourth/);
  assert.match(run, /22:50/);
  assert.match(run, /#90332/);
  assert.match(run, /roosted/);
  assert.doesNotMatch(run, /idle word is cote/i);
});
