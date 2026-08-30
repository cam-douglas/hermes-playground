import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubChatelaineLedger,
  linearChatelaineTicket,
  slackChatelaineAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_EXPIRED_BEARER,
  CODEX_REFRESH_DISABLE,
  CODEX_WIN_KEYRING,
  DEMO_FIGMA_REMAINING_H,
  DEMO_HTTP_SERVERS,
  DEMO_MCP_AUTHS,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  NEARBY_84331,
  NEARBY_87405,
  NEARBY_88487,
  RELATED_FOB,
  RELATED_VISA,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  girtOf,
  isFobLitter,
  isIdle,
  maskSecret,
  parseChatelaineJson,
  reasonsOf,
  score,
  seed90647,
  seedBlanked,
  seedControl,
  seedCut,
  seedFobLitter,
  seedGirt,
  seedNested,
  seedRebound,
  seedReset,
  seedSpilled,
  seedSwitched,
  seedTokenless,
  seedUnexpired,
  seedWiped,
  verdictOf,
} from "./chatelaine.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored|claimed|worn|^nested$|^cut$|^switched$|^spilled$/;

function assertIdleNeverChatelaine(result) {
  assert.equal(result.idleWord, "girt");
  assert.equal(IDLE_WORD, "girt");
  assert.doesNotMatch(result.idleWord, /chatelaine/i);
  assert.doesNotMatch(IDLE_WORD, /^chatelaine$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.girt, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90647 cut is cut, slack, linear, idleWord girt, never girt", () => {
  const seed = seedCut();
  const result = decide(seed);
  assert.equal(result.verdict, "cut");
  assert.equal(result.state, "cut");
  assert.equal(result.decision, "cut");
  assert.equal(classify(seed.chatelaine), "cut");
  assert.equal(verdictOf(seed.chatelaine), "cut");
  assert.notEqual(result.verdict, "girt");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.cut, true);
  assert.equal(result.girt, false);
  assertIdleNeverChatelaine(result);
  assert.equal(result.session, "90647-cut");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.mcpNestedInAccountItem, true);
  assert.equal(result.facts.accountLogoutFired, true);
  assert.equal(result.facts.triad, true);
  assert.equal(result.facts.consecutiveMcpAuths, DEMO_MCP_AUTHS);
  assert.match(result.feed, /Cut|discarded|primary #90647/i);
  assert.match(result.slackCopy, /Chatelaine cut · MCP grants left with the wearer · \/mcp ×7/);
  assert.equal(decideSeed("cut").verdict, "cut");
  assert.equal(decideSeed("90647").verdict, "cut");
  assert.equal(decideSeed(90647).verdict, "cut");
  assert.equal(decide(seed90647()).verdict, "cut");
});

test("2 idle/empty/{} is girt, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "girt");
  assert.equal(result.verdict, "girt");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.girt, true);
  assert.equal(classify({}), "girt");
  assert.equal(classify(emptyProbe()), "girt");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).girt, true);
  assertIdleNeverChatelaine(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "girt");
  assert.equal(bailed.idleWord, "girt");
  const empty = decide({});
  assert.equal(empty.verdict, "girt");
  assert.match(empty.feed, /Girt/);
});

test("3 honest girt hold: separate store, logout leaves MCP grants", () => {
  const result = decide(seedGirt());
  assert.equal(result.verdict, "girt");
  assert.equal(result.alarm, false);
  assert.equal(result.girt, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.separateMcpStore, true);
  assert.equal(result.facts.mcpNestedInAccountItem, false);
  assert.equal(result.facts.accountLogoutFired, true);
  assert.equal(result.facts.unauthenticatedAfterEvent, 0);
  assert.match(result.feed, /Girt|own ring|idle word is girt/i);
  assert.equal(decideSeed("control").verdict, "girt");
  assert.equal(decideSeed("healthy").verdict, "girt");
  assert.equal(decide(seedControl()).girt, true);
  assert.equal(girtOf(seedGirt().chatelaine), true);
});

test("4 girt must not be confused with cut, nested, or spilled", () => {
  const hold = decide(seedGirt());
  const cut = decide(seedCut());
  const nested = decide(seedNested());
  const spilled = decide(seedSpilled());
  assert.equal(hold.verdict, "girt");
  assert.equal(cut.verdict, "cut");
  assert.equal(nested.verdict, "nested");
  assert.equal(spilled.verdict, "spilled");
  assert.notEqual(hold.verdict, cut.verdict);
  assert.notEqual(hold.verdict, nested.verdict);
  assert.equal(hold.girt, true);
  assert.equal(cut.girt, false);
  assert.equal(nested.girt, false);
  assert.equal(spilled.girt, false);
});

test("5 nested-without-logout is nested, not cut, girt false", () => {
  const result = decide(seedNested());
  assert.equal(result.verdict, "nested");
  assert.equal(result.nested, true);
  assert.equal(result.girt, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.accountLogoutFired, false);
  assert.equal(result.facts.mcpNestedInAccountItem, true);
  assert.equal(analyze(seedNested().chatelaine).triad, false);
  assert.match(result.feed, /Nested|same Keychain item/i);
});

test("6 switched: per-account items lack mcpOAuth", () => {
  const result = decide(seedSwitched());
  assert.equal(result.verdict, "switched");
  assert.equal(result.switched, true);
  assert.equal(result.girt, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.accountSwitched, true);
  assert.equal(result.facts.perAccountItemsLackMcpOAuth, true);
  assert.notEqual(result.verdict, "cut");
  assert.match(result.feed, /Switched|per-account|8hex/i);
});

test("7 spilled: every HTTP MCP server unauthenticated after identity event", () => {
  const result = decide(seedSpilled());
  assert.equal(result.verdict, "spilled");
  assert.equal(result.spilled, true);
  assert.equal(result.girt, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.httpMcpServerCount, DEMO_HTTP_SERVERS);
  assert.equal(result.facts.unauthenticatedAfterEvent, DEMO_HTTP_SERVERS);
  assert.equal(analyze(seedSpilled().chatelaine).triad, false);
  assert.match(result.feed, /Spilled|unauthenticated/i);
});

test("8 unexpired: measured tokens still valid at forced re-auth", () => {
  const result = decide(seedUnexpired());
  assert.equal(result.verdict, "unexpired");
  assert.equal(result.unexpired, true);
  assert.equal(result.girt, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.grantsUnexpired, true);
  assert.equal(result.facts.refreshTokensPresent, true);
  assert.equal(result.probe.figmaRemainingH, DEMO_FIGMA_REMAINING_H);
  assert.equal(analyze(seedUnexpired().chatelaine).triad, false);
  assert.match(result.feed, /Unexpired|still valid/i);
});

test("9 rebound: seven consecutive /mcp browser auths", () => {
  const result = decide(seedRebound());
  assert.equal(result.verdict, "rebound");
  assert.equal(result.rebound, true);
  assert.equal(result.girt, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.consecutiveMcpAuths, DEMO_MCP_AUTHS);
  assert.equal(analyze(seedRebound().chatelaine).triad, false);
  assert.match(result.feed, /Rebound|consecutive \/mcp/i);
});

test("10 tokenless / blanked / wiped nearby flags win their own seeds", () => {
  const tokenless = decide(seedTokenless());
  assert.equal(tokenless.verdict, "tokenless");
  assert.equal(tokenless.tokenless, true);
  assert.equal(tokenless.girt, false);
  assert.equal(tokenless.issue, NEARBY_87405);
  assert.equal(analyze(seedTokenless().chatelaine).triad, false);

  const blanked = decide(seedBlanked());
  assert.equal(blanked.verdict, "blanked");
  assert.equal(blanked.blanked, true);
  assert.equal(blanked.girt, false);
  assert.equal(blanked.issue, NEARBY_84331);
  assert.equal(analyze(seedBlanked().chatelaine).triad, false);

  const wiped = decide(seedWiped());
  assert.equal(wiped.verdict, "wiped");
  assert.equal(wiped.wiped, true);
  assert.equal(wiped.girt, false);
  assert.equal(wiped.issue, NEARBY_88487);
  assert.equal(analyze(seedWiped().chatelaine).triad, false);
});

test("11 Fob-shaped litter is labeled, not cut", () => {
  const result = decide(seedFobLitter());
  assert.notEqual(result.verdict, "cut");
  assert.equal(result.verdict, "girt");
  assert.equal(result.girt, true);
  assert.equal(isFobLitter(seedFobLitter().chatelaine), true);
  assert.equal(result.fobLitter, true);
  assert.equal(result.issue, RELATED_FOB);
  assert.ok(result.reasons.some((row) => /Fob-shaped litter|NOT this desk|#90527/i.test(row)));
  assert.equal(analyze(seedFobLitter().chatelaine).triad, false);
});

test("12 family verdicts are distinct", () => {
  const map = {
    girt: decide(seedGirt()).verdict,
    nested: decide(seedNested()).verdict,
    cut: decide(seedCut()).verdict,
    switched: decide(seedSwitched()).verdict,
    spilled: decide(seedSpilled()).verdict,
    unexpired: decide(seedUnexpired()).verdict,
    rebound: decide(seedRebound()).verdict,
    tokenless: decide(seedTokenless()).verdict,
    blanked: decide(seedBlanked()).verdict,
    wiped: decide(seedWiped()).verdict,
  };
  const unique = new Set(Object.values(map));
  assert.equal(unique.size, 10);
  for (const [name, verdict] of Object.entries(map)) {
    assert.equal(verdict, name);
  }
});

test("13 forbidden idle list includes chatelaine, prior idles, not girt", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("chatelaine"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("sheltered"));
  assert.ok(words.includes("hung"));
  assert.ok(words.includes("stamped"));
  assert.ok(words.includes("worn"));
  assert.ok(words.includes("nested"));
  assert.ok(words.includes("cut"));
  assert.ok(words.includes("fob"));
  assert.ok(!words.includes("girt"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("14 demo sinks: Slack+Linear on fail family; GitHub always; never fake live 200", async () => {
  const cut = decide(seedCut());
  const slack = slackChatelaineAlarm(cut, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubChatelaineLedger(cut, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would append a GitHub chatelaine-ledger/);
  const linear = linearChatelaineTicket(cut, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);

  for (const seed of [
    seedCut,
    seedNested,
    seedSwitched,
    seedSpilled,
    seedUnexpired,
    seedRebound,
    seedTokenless,
    seedBlanked,
    seedWiped,
  ]) {
    const result = decide(seed());
    assert.equal(result.slack, true, result.verdict);
    assert.equal(result.linear, true, result.verdict);
    assert.match(slackChatelaineAlarm(result, {}).summary, /Would post to Slack/);
    assert.match(linearChatelaineTicket(result, {}).summary, /Would open a Linear ticket/);
  }
  const hold = decide(seedGirt());
  assert.match(slackChatelaineAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearChatelaineTicket(hold, {}).summary, /Would skip Linear/);
  const fired = await fire(cut, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("15 handle deny on cut, allow on girt", async () => {
  const deny = await handle(seedCut(), {});
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "cut");
  assert.match(deny.hookSpecificOutput.decision.message, /discarded|nested/i);
  const allow = await handle(seedGirt(), {});
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "girt");
  assert.match(allow.hookSpecificOutput.decision.message, /idle word is girt/i);
});

test("16 restore / 90647 / incident produce the cut seed", () => {
  assert.equal(decide({ action: "restore" }).verdict, "cut");
  assert.equal(decide({ action: "90647" }).verdict, "cut");
  assert.equal(decide({ action: "incident" }).verdict, "cut");
  assert.equal(decide({ action: "cut" }).verdict, "cut");
});

test("17 admit scores honestly: cut stays cut", () => {
  const admitted = decide({ action: "admit", ...seedCut() });
  assert.equal(admitted.verdict, "cut");
  assert.equal(admitted.girt, false);
});

test("18 parse chatelaine payload + mask tokens", () => {
  const probe = parseChatelaineJson({
    mcpNestedInAccountItem: true,
    accountLogoutFired: true,
    grantsUnexpired: true,
    refreshTokensPresent: true,
    consecutiveMcpAuths: 7,
    unauthenticatedAfterEvent: 7,
    httpMcpServerCount: 7,
    separateMcpStore: false,
  });
  assert.equal(classify(probe), "cut");
  assert.equal(maskSecret("super-secret-token"), "••••");
  const dumped = cloneProbe({
    keychainItems: [
      { service: "Claude Code-credentials", accessToken: "abc", refreshToken: "def", keys: ["claudeAiOauth", "mcpOAuth"] },
    ],
  });
  assert.equal(dumped.keychainItems[0].accessToken, "••••");
  assert.equal(dumped.keychainItems[0].refreshToken, "••••");
});

test("19 constants name the #90647 repro and nearby issue numbers", () => {
  assert.equal(FEATURED_ISSUE, 90647);
  assert.equal(NEARBY_88487, 88487);
  assert.equal(NEARBY_87405, 87405);
  assert.equal(NEARBY_84331, 84331);
  assert.equal(RELATED_FOB, 90527);
  assert.equal(RELATED_VISA, 90497);
  assert.equal(CODEX_EXPIRED_BEARER, 27165);
  assert.equal(CODEX_REFRESH_DISABLE, 38198);
  assert.equal(CODEX_WIN_KEYRING, 28201);
});

test("20 feed and reasons cite #90647 on cut", () => {
  assert.match(feedOf("girt"), /idle word is girt/);
  assert.match(feedOf("cut"), /#90647/);
  const reasons = reasonsOf(seedCut().chatelaine, "cut");
  assert.ok(reasons.some((row) => /#90647/.test(row)));
  const facts = analyze(seedCut().chatelaine);
  assert.equal(facts.triad, true);
  assert.equal(facts.eventClass, "cut");
});

test("21 folio HTML sanity: idle word girt, seeded cut, not fob/visa/waif", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /girt/);
  assert.match(html, /Score/);
  assert.match(html, /cut/);
  assert.match(html, /90647/);
  assert.match(html, /const IDLE_WORD = "girt"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "chatelaine"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "hung"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sheltered"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stamped"/);
  assert.match(html, /stillroom-apron|waist-girdle|oxidized-brass-plate|jet-bead-strand|linen-nap/i);
  assert.match(html, /14:50 Sydney · chatelaine/);
  assert.match(html, /a nested ring is not a hold/i);
  assert.doesNotMatch(html, /class="harbour-quay"|class="tide-board"|class="berth-chalkboard"/);
  assert.doesNotMatch(html, /class="hotel-rack"|class="key-rack"|class="numbered-hooks"/);
  assert.doesNotMatch(html, /class="passport-desk"|class="visa-stamp"|class="border-booth"/);
  assert.doesNotMatch(html, /class="foundling-home"|class="parish-ward"|class="intake-board"/);
  assert.doesNotMatch(html, /Oswald|Newsreader|Italiana/);
  assert.doesNotMatch(html, /Bebas Neue|Lora|Space Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Cutive Mono|Fraunces/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Chatelaine/);
  assert.match(html, /Cormorant Garamond|IBM Plex Mono|Great Vibes|Pinyon Script/);
  assert.match(html, /Admit girt/);
  assert.match(html, /Restore · #90647|restore to cut/i);
});

test("22 HTML why-not names Fob, Visa, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Fob/);
  assert.match(html, /NOT Visa/);
  assert.match(html, /NOT Chute/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Sprag/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("23 README names contrasts and girt idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Fob\*\*|NOT Fob/);
  assert.match(readme, /NOT \*\*Visa\*\*|NOT Visa/);
  assert.match(readme, /NOT \*\*Chute\*\*|NOT Chute/);
  assert.match(readme, /\*\*girt\*\*/);
  assert.match(readme, /#90647/);
  assert.match(readme, /#88487/);
  assert.match(readme, /#87405/);
  assert.match(readme, /#90527/);
  assert.match(readme, /\/chatelaine\//);
  assert.doesNotMatch(readme, /idle word is chatelaine/i);
  assert.doesNotMatch(readme, /idle word is hung/i);
  assert.doesNotMatch(readme, /idle word is sheltered/i);
});

test("24 README and desk cite #90647 plus nearby and cross-ecosystem", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90647/);
  assert.match(readme, /27165/);
  assert.match(readme, /38198/);
  assert.match(readme, /28201/);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /90647/);
  assert.match(html, /88487/);
  assert.match(html, /87405/);
  assert.match(html, /90527/);
  assert.match(html, /27165/);
  assert.match(html, /Claude Code-credentials/);
  assert.match(html, /github.com\/anthropics\/claude-code\/issues\/90647/);
});

test("25 Slack skip on girt / control / Fob litter; cut chip is a fail never a hold", () => {
  for (const seed of [seedReset, seedControl, seedGirt, seedFobLitter]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackChatelaineAlarm(result, {}).summary, /Would skip Slack/);
  }
  const cut = decide(seedCut());
  assert.equal(cut.slack, true);
  assert.match(cut.slackCopy, /cut/);
  assert.doesNotMatch(cut.slackCopy, /hold|girt/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /fail, never a hold|never a hold/);
});

test("26 cut beats spilled/rebound/unexpired on the #90647 triad", () => {
  const facts = analyze(seedCut().chatelaine);
  assert.equal(facts.triad, true);
  assert.equal(facts.allSpilled, true);
  assert.equal(classify(seedCut().chatelaine), "cut");
  assert.equal(seedCut().chatelaine.consecutiveMcpAuths, DEMO_MCP_AUTHS);
});

test("27 HTML parse prefers JSON so a pasted probe scores the chain", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score(seedCut().chatelaine);
  assert.equal(probe.verdict, "cut");
  assert.equal(probe.girt, false);
});

test("28 listen health names chatelaine verbs", async () => {
  const server = listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  assert.equal(body.product, "chatelaine");
  assert.match(body.verbs, /cut/);
  assert.match(body.verbs, /girt/);
  server.close();
});

test("29 assertScoreShape on every family verdict", () => {
  for (const seed of [
    seedGirt,
    seedCut,
    seedNested,
    seedSwitched,
    seedSpilled,
    seedUnexpired,
    seedRebound,
    seedTokenless,
    seedBlanked,
    seedWiped,
    seedFobLitter,
  ]) {
    const result = decide(seed());
    assertScoreShape(result);
    assertIdleNeverChatelaine(result);
    assert.ok(VERDICTS.includes(result.verdict), result.verdict);
  }
  assert.ok(ALARM_VERDICTS.includes("cut"));
  assert.ok(LINEAR_VERDICTS.includes("cut"));
  assert.ok(SLACK_VERDICTS.includes("nested"));
});

test("30 catalog indexes Pale featured, 64 products, Chatelaine unfeatured", () => {
  const catalog = JSON.parse(
    readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"),
  );
  assert.equal(catalog.products.length, 64);
  assert.equal(catalog.products[0].slug, "pale");
  assert.equal(catalog.products[0].featured, true);
  const chatelaine = catalog.products.find((row) => row.slug === "chatelaine");
  assert.ok(chatelaine);
  assert.equal(chatelaine.featured, false);
  assert.equal(
    chatelaine.summary,
    "14:50 chatelaine: a nested ring is not a hold. Score the chain or admit girt.",
  );
  const waif = catalog.products.find((row) => row.slug === "waif");
  const berth = catalog.products.find((row) => row.slug === "berth");
  const carrel = catalog.products.find((row) => row.slug === "carrel");
  assert.ok(waif);
  assert.equal(waif.featured, false);
  assert.ok(berth);
  assert.ok(carrel);
});

test("31 Keychain dump masks tokens; file-store compare is nesting not litter", () => {
  const result = decide(seedCut());
  assert.ok(result.keychain.length >= 1);
  assert.equal(result.keychain[0].service, "Claude Code-credentials");
  assert.ok(result.keychain[0].keys.includes("claudeAiOauth"));
  assert.ok(result.keychain[0].keys.includes("mcpOAuth"));
  assert.equal(result.keychain[0].accessToken, "••••");
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /file-store|credentials\.json|nesting inside identity/i);
});
