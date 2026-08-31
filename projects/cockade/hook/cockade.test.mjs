import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BADGE_SEEDED,
  CHANGELOG_243,
  CHIPS,
  CLI_VERSION,
  CONTRAST_NOTE,
  FABLE_DEFAULT_EFFORT,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HEADER_SEEDED,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  MODEL_FABLE,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  SLIDER_LABEL,
  SLIDER_SEEDED,
  STATUSLINE_DOC,
  TITLE,
  ULTRACODE_DEFAULT,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedCocked,
  seedDocumentedDefault,
  seedUnpinned,
} from "./cockade.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./cockade.mjs", import.meta.url));
}

test("idle unpinned is a hold; ultracode off; header honest", () => {
  const result = analyze(seedUnpinned());
  assert.equal(result.verdict, "unpinned");
  assert.equal(result.idleWord, "unpinned");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.cocked, false);
  assert.ok(result.chips.includes("unpinned"));
  assert.ok(!result.chips.includes("cocked"));
  assert.ok(!result.chips.includes("header-lie"));
  assert.ok(!result.chips.includes("silent-noop"));
  assert.doesNotMatch(
    result.idleWord,
    /cocked|armed|ultracode|cockade|rinsed|scrubbed|stripped|lye|vacant|reserved|advowson|smutch|plain|seated|bound|hallmarked|pointed|collapsed|spoiled|banked/i,
  );
});

test("empty ticket and empty stdin classify unpinned", () => {
  assert.equal(classify(emptyTicket()), "unpinned");
  assert.equal(classify(""), "unpinned");
  assert.equal(classify(null), "unpinned");
  assert.equal(decideSeed("unpinned").verdict, "unpinned");
});

test("seeded cocked #91033 is alarm with the milliner chips", () => {
  const result = analyze(seedCocked());
  assert.equal(result.verdict, "cocked");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("cocked"));
  assert.ok(result.chips.includes("mislabeled"));
  assert.ok(result.chips.includes("silent-noop"));
  assert.ok(result.chips.includes("xhigh-mask"));
  assert.ok(result.chips.includes("no-opt-in"));
  assert.ok(result.chips.includes("slider-ultracode"));
  assert.ok(result.chips.includes("header-lie"));
  assert.ok(result.chips.includes("effort-xhigh"));
  assert.ok(result.chips.includes("workflows-armed"));
  assert.ok(result.chips.includes("settings-absent"));
  assert.ok(result.chips.includes("env-unset"));
  assert.ok(result.chips.includes("persist-miss"));
  assert.ok(result.chips.includes("badge-true"));
  assert.ok(result.chips.includes("fable-default"));
  assert.ok(result.chips.includes("undocumented"));
  assert.ok(!result.chips.includes("unpinned"));
  assert.match(result.contrast.brim, /xhigh/);
  assert.match(result.contrast.cockade, /ultracode/);
  assert.match(result.contrast.book, /no order in the book/);
  assert.match(result.contrast.persist, /silent no-op|writes nothing/);
});

test("documented-default / high-hold is a hold", () => {
  const result = analyze(seedDocumentedDefault());
  assert.equal(result.verdict, "documented-default");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("documented-default"));
  assert.ok(!result.chips.includes("cocked"));
});

test("data fixtures classify unpinned vs cocked vs named chips", () => {
  assert.equal(classify(readData("unpinned.json")), "unpinned");
  assert.equal(classify(readData("cocked.json")), "cocked");
  assert.equal(classify(readData("91033.json")), "cocked");
  assert.equal(classify(readData("mislabeled.json")), "mislabeled");
  assert.equal(classify(readData("silent-noop.json")), "silent-noop");
  assert.equal(classify(readData("xhigh-mask.json")), "xhigh-mask");
  assert.equal(classify(readData("no-opt-in.json")), "no-opt-in");
  assert.equal(classify(readData("slider-ultracode.json")), "slider-ultracode");
  assert.equal(classify(readData("header-lie.json")), "header-lie");
  assert.equal(classify(readData("effort-xhigh.json")), "effort-xhigh");
  assert.equal(classify(readData("workflows-armed.json")), "workflows-armed");
  assert.equal(classify(readData("settings-absent.json")), "settings-absent");
  assert.equal(classify(readData("env-unset.json")), "env-unset");
  assert.equal(classify(readData("persist-miss.json")), "persist-miss");
  assert.equal(classify(readData("badge-true.json")), "badge-true");
  assert.equal(classify(readData("fable-default.json")), "fable-default");
  assert.equal(classify(readData("undocumented.json")), "undocumented");
  assert.equal(classify(readData("documented-default.json")), "documented-default");
});

test("silent-noop /effort xhigh does not persist when ultracode is seated", () => {
  const result = analyze({
    slider: "ultracode",
    header: "Fable 5 with xhigh effort",
    badge: "ultracode",
    ultracodeKeyPresent: false,
    effortXhighWrote: false,
    envEffort: null,
    managedSettingsPresent: false,
    launchFlags: false,
    unpinnedHold: false,
    outputText:
      "/effort xhigh is a silent no-op — no modelSettings entry is written; ultracode reports as xhigh",
  });
  assert.ok(result.chips.includes("silent-noop"));
  assert.ok(result.chips.includes("effort-xhigh"));
  assert.ok(result.chips.includes("persist-miss"));
  assert.equal(result.hold, false);
});

test("header-lie: badge truthful, header still reads xhigh", () => {
  const result = analyze({
    slider: "ultracode",
    header: "Fable 5 with xhigh effort",
    badge: "ultracode",
    ultracodeKeyPresent: false,
    envEffort: null,
    managedSettingsPresent: false,
    launchFlags: false,
    unpinnedHold: false,
    outputText:
      "header-lie: the badge was truthful; the HEADER is the element mislabeling the state; header hides ultracode as with xhigh effort",
  });
  assert.ok(result.chips.includes("header-lie"));
  assert.ok(result.chips.includes("mislabeled"));
  assert.ok(result.chips.includes("badge-true"));
  assert.ok(result.chips.includes("xhigh-mask"));
});

test("no-opt-in and settings-absent when no ultracode key anywhere", () => {
  const result = analyze({
    slider: "ultracode",
    header: "Fable 5 with xhigh effort",
    badge: "ultracode",
    ultracodeKeyPresent: false,
    fableEffortSetting: null,
    envEffort: null,
    managedSettingsPresent: false,
    projectSettingsHaveKeys: false,
    claudeJsonHasEffort: false,
    launchFlags: false,
    unpinnedHold: false,
    outputText:
      "no-opt-in: no ultracode key anywhere; settings-absent; CLAUDE_CODE_EFFORT_LEVEL unset; no --effort/--settings launch flags",
  });
  assert.ok(result.chips.includes("no-opt-in"));
  assert.ok(result.chips.includes("settings-absent"));
  assert.ok(result.chips.includes("env-unset"));
});

test("badge-true is not a hold by itself when slider is ultracode", () => {
  const result = analyze({
    seed: "badge-true",
    slider: "ultracode",
    badge: "ultracode",
    header: "Fable 5 with xhigh effort",
    ultracodeKeyPresent: false,
    unpinnedHold: false,
    outputText: "badge-true: footer badge ultracode is truthful",
  });
  assert.equal(result.verdict, "badge-true");
  assert.equal(result.alarm, true);
  assert.ok(result.chips.includes("badge-true"));
});

test("cocked seed is alarm; unpinned and documented-default seeds are hold", () => {
  assert.equal(score(seedCocked()).alarm, true);
  assert.equal(score(seedCocked()).hold, false);
  assert.equal(score(seedUnpinned()).hold, true);
  assert.equal(score(seedUnpinned()).alarm, false);
  assert.equal(score(seedDocumentedDefault()).hold, true);
  assert.equal(score(seedDocumentedDefault()).alarm, false);
});

test("normalize seeds 91033 without ticket fields", () => {
  const ticket = normalize({ issue: 91033 });
  assert.equal(ticket.slider, "ultracode");
  assert.equal(ticket.header, "Fable 5 with xhigh effort");
  assert.equal(ticket.badge, "ultracode");
  assert.equal(ticket.ultracodeKeyPresent, false);
  assert.equal(ticket.effortXhighWrote, false);
  assert.equal(classify(ticket), "cocked");
});

test("score / decide / handle agree on cocked vs unpinned", () => {
  assert.equal(score(seedCocked()).verdict, "cocked");
  assert.equal(decide(seedUnpinned()).verdict, "unpinned");
  const fail = handle(seedCocked());
  const hold = handle(seedUnpinned());
  const documented = handle(seedDocumentedDefault());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91033/);
  assert.match(hold.hookSpecificOutput.additionalContext, /unpinned/i);
  assert.match(documented.hookSpecificOutput.additionalContext, /documented-default|high/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("cocked").verdict, "cocked");
  assert.equal(decideSeed(91033).verdict, "cocked");
  assert.equal(decideSeed("91033").verdict, "cocked");
  assert.equal(decideSeed("unpinned").verdict, "unpinned");
  assert.equal(decideSeed("documented-default").verdict, "documented-default");
  assert.equal(decideSeed("high-hold").verdict, "documented-default");
});

test("CLI scores data files", () => {
  const cocked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/cocked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(cocked.status, 0, cocked.stderr);
  assert.equal(JSON.parse(cocked.stdout).verdict, "cocked");

  const unpinned = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/unpinned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(unpinned.status, 0, unpinned.stderr);
  assert.equal(JSON.parse(unpinned.stdout).verdict, "unpinned");

  const silent = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/silent-noop.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(silent.status, 0, silent.stderr);
  assert.equal(JSON.parse(silent.stdout).verdict, "silent-noop");
  assert.equal(JSON.parse(silent.stdout).hold, false);
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91033);
  assert.deepEqual([...PRIMARY_ISSUES], [91033]);
  assert.deepEqual([...SAME_CLASS], []);
  assert.equal(REPORTER, "kenflorian");
  assert.equal(FILED_AT, "2026-08-31T16:46:22Z");
  assert.equal(CLI_VERSION, "2.1.251");
  assert.equal(PLATFORM, "Windows 11 Pro");
  assert.equal(MODEL_FABLE, "Fable 5");
  assert.equal(HEADER_SEEDED, "Fable 5 with xhigh effort");
  assert.equal(SLIDER_SEEDED, "ultracode");
  assert.equal(SLIDER_LABEL, "xhigh + workflows");
  assert.equal(BADGE_SEEDED, "ultracode");
  assert.equal(FABLE_DEFAULT_EFFORT, "high");
  assert.equal(ULTRACODE_DEFAULT, "unset, so ultracode is off");
  assert.match(STATUSLINE_DOC, /reports as `xhigh`/);
  assert.match(CHANGELOG_243, /\/model`? picker|Ultracode selection/);
  assert.equal(IDLE_WORD, "unpinned");
  assert.equal(SEEDED_WORD, "cocked");
  assert.notEqual(IDLE_WORD, "cocked");
  assert.notEqual(IDLE_WORD, "ultracode");
  assert.notEqual(IDLE_WORD, "cockade");
  assert.ok(HOLD_VERDICTS.includes("unpinned"));
  assert.ok(HOLD_VERDICTS.includes("documented-default"));
  assert.ok(ALARM_VERDICTS.includes("cocked"));
  assert.ok(ALARM_VERDICTS.includes("silent-noop"));
  assert.ok(ALARM_VERDICTS.includes("header-lie"));
  assert.ok(!ALARM_VERDICTS.includes("unpinned"));
  assert.ok(!ALARM_VERDICTS.includes("documented-default"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 17);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:tui", "area:statusline"],
  );
  assert.match(TITLE, /Ultracode arms with no ultracode setting/);
  assert.match(ISSUE_URL, /91033/);
  assert.match(PHRASE, /cockade seated on ultracode with no opt-in/i);
  assert.match(HUB_LINE, /02:50 cockade/);
  assert.match(HUB_LINE, /admit unpinned/);
  assert.match(MARK, /02:50/);
  assert.match(MARK, /#100/);
  assert.match(MARK, /#91033/);
  assert.match(CONTRAST_NOTE, /UNDOCUMENTED ULTRACODE ARM/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("lye"));
  assert.ok(NOT_PRODUCTS.includes("advowson"));
  assert.ok(NOT_PRODUCTS.includes("smutch"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("idle is never a forbidden word", () => {
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
  assert.equal(IDLE_WORD, "unpinned");
  const html = readPage();
  assert.match(html, /Idle word:\s*unpinned/);
  assert.doesNotMatch(html, /Idle word:\s*cocked/i);
  assert.doesNotMatch(html, /Idle word:\s*ultracode/i);
  assert.doesNotMatch(html, /Idle word:\s*rinsed/i);
  assert.doesNotMatch(html, /Idle word:\s*vacant/i);
  assert.doesNotMatch(html, /Idle word:\s*reserved/i);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "unpinned");
  assert.equal(chips.seededWord, "cocked");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91033);
  assert.equal(fp.header, "Fable 5 with xhigh effort");
  assert.equal(fp.slider, "ultracode");
  assert.equal(fp.badge, "ultracode");
  assert.equal(fp.cliVersion, "2.1.251");
  assert.equal(fp.fableDefaultEffort, "high");
  assert.deepEqual(fp.sameClass, []);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].slider, "ultracode");
  assert.equal(fixtures.rows[1].header, "Fable 5 with xhigh effort");
  assert.equal(fixtures.narrativeNotFixture.noSessionIds, true);
});

test("chipsOf on a raw cocked ticket still marks header-lie and silent-noop", () => {
  const chips = chipsOf({
    slider: "ultracode",
    header: "Fable 5 with xhigh effort",
    badge: "ultracode",
    ultracodeKeyPresent: false,
    fableEffortSetting: null,
    envEffort: null,
    effortXhighWrote: false,
    managedSettingsPresent: false,
    projectSettingsHaveKeys: false,
    launchFlags: false,
    unpinnedHold: false,
    model: "fable-5",
    outputText:
      "slider marker sitting ON the ultracode position (xhigh + workflows); header Fable 5 with xhigh effort; footer badge: ultracode; no ultracode key anywhere; /effort xhigh is a silent no-op; no modelSettings entry is written; header hides ultracode",
  });
  assert.ok(chips.includes("cocked"));
  assert.ok(chips.includes("header-lie"));
  assert.ok(chips.includes("silent-noop"));
  assert.ok(chips.includes("no-opt-in"));
  assert.ok(chips.includes("badge-true"));
  assert.ok(!chips.includes("unpinned"));
});

test("slider ultracode + no opt-in + header xhigh → cocked; slider high → unpinned", () => {
  assert.equal(
    classify({
      slider: "ultracode",
      header: "Fable 5 with xhigh effort",
      badge: "ultracode",
      ultracodeKeyPresent: false,
      envEffort: null,
      managedSettingsPresent: false,
      launchFlags: false,
      unpinnedHold: false,
      outputText: "no ultracode opt-in; slider on ultracode; header with xhigh effort",
    }),
    "cocked",
  );
  assert.equal(
    classify({
      slider: "high",
      header: "Fable 5 with high effort",
      badge: null,
      ultracodeKeyPresent: false,
      unpinnedHold: true,
      documentedDefault: true,
      outputText: "unpinned; ultracode off; header honest; slider on documented default high; no cockade on the hat",
    }),
    "unpinned",
  );
});

test("living page is a milliner bench, idle unpinned, seeded cocked", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*unpinned/);
  assert.match(html, /unpinned/);
  assert.match(html, /cocked/);
  assert.match(html, /mislabeled/);
  assert.match(html, /silent-noop/);
  assert.match(html, /xhigh-mask/);
  assert.match(html, /no-opt-in/);
  assert.match(html, /slider-ultracode/);
  assert.match(html, /header-lie/);
  assert.match(html, /effort-xhigh/);
  assert.match(html, /workflows-armed/);
  assert.match(html, /settings-absent/);
  assert.match(html, /env-unset/);
  assert.match(html, /persist-miss/);
  assert.match(html, /badge-true/);
  assert.match(html, /fable-default/);
  assert.match(html, /undocumented/);
  assert.match(html, /#91033/);
  assert.match(html, /02:50/);
  assert.match(html, /catalog #100/);
  assert.match(html, /kenflorian/);
  assert.match(html, /xhigh \+ workflows/);
  assert.match(html, /Fable 5 with xhigh effort/);
  assert.match(html, /Playfair/);
  assert.match(html, /Nunito/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the brim/);
  assert.match(html, /Pin idle unpinned/);
  assert.match(html, /Pin seeded cocked/);
  assert.match(html, /Admit unpinned/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to unpinned/);
  assert.match(html, /Admit documented-default/);
  assert.match(html, /cockade/i);
  assert.match(html, /milliner/i);
  assert.match(html, /hat-block|hat block/i);
  assert.match(html, /brim/i);
  assert.match(html, /silk/i);
  assert.match(html, /brass/i);
  assert.match(html, /ivory/i);
  assert.match(html, /walnut/i);
  assert.doesNotMatch(html, /Idle word:\s*cocked/i);
  assert.doesNotMatch(html, /Idle word:\s*rinsed/i);
  assert.doesNotMatch(html, /Idle word:\s*vacant/i);
  assert.doesNotMatch(html, /Idle word:\s*reserved/i);
  assert.doesNotMatch(html, /Idle word:\s*plain/);
  assert.doesNotMatch(html, /Pin idle rinsed/);
  assert.doesNotMatch(html, /Pin idle vacant/);
  assert.doesNotMatch(html, /Pin seeded reserved/);
  assert.doesNotMatch(html, /Pin seeded scrubbed/);
  assert.doesNotMatch(html, /Score the vat/);
  assert.doesNotMatch(html, /Score the presentation/);
  assert.doesNotMatch(html, /Score the smutch/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Libre\+Bodoni/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=Karla/);
  assert.doesNotMatch(html, /millimeter-slider/);
  assert.doesNotMatch(html, /cabinetmaker/);
  assert.doesNotMatch(html, /fuller's/);
  assert.doesNotMatch(html, /diocesan/);
  assert.doesNotMatch(html, /wet-stone|ash-green/);
  assert.doesNotMatch(html, /parchment folio/);
  assert.doesNotMatch(html, /felt-green/);
});
