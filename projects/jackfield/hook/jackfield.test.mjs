import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DARWIN,
  EVIDENCE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HOSTNAME_OS,
  HOSTNAME_RESULT,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MACOS_SESSION,
  MACOS_TITLE,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  PULL_PHRASE,
  PULL_RESULT,
  RELATED_IN_ISSUE,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  WINDOWS_TITLE,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isCrossed,
  isHomed,
  normalize,
  score,
  seedCousin,
  seedCrossed,
  seedDualTitle,
  seedHasClearRepro,
  seedHold,
  seedHomed,
  seedHostnamePin,
  seedInvisibleHost,
  seedListSessionsAsymmetry,
  seedMacosExecutor,
  seedRemoteControl,
  seedSharedTranscript,
  seedWindowsInput,
} from "./jackfield.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./jackfield.mjs", import.meta.url));
}

test("session homed + Windows input on Windows + no Mac pin → homed", () => {
  const result = analyze({
    sessionHomed: true,
    windowsInputOnWindows: true,
    windowsInputOnMac: false,
    hostnameReturnsMac: false,
  });
  assert.equal(result.verdict, "homed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.crossed, false);
  assert.equal(result.homed, true);
  assert.equal(isHomed(result.ticket), true);
  assert.equal(isCrossed(result.ticket), false);
});

test("Windows input on Mac + hostname returns Mac + dual-title shared transcript → crossed", () => {
  const result = analyze({
    windowsInputOnMac: true,
    hostnameReturnsMac: true,
    dualTitle: true,
    sharedTranscript: true,
    macosExecutor: true,
    hostnamePin: true,
    listSessionsAsymmetry: true,
    hasClearRepro: true,
    sessionHomed: false,
    windowsInputOnWindows: false,
  });
  assert.equal(result.verdict, "crossed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.crossed, true);
  assert.equal(isCrossed(result.ticket), true);
  assert.ok(result.chips.includes("crossed"));
  assert.ok(result.chips.includes("hostname-pin"));
  assert.ok(result.chips.includes("macos-executor"));
  assert.ok(!result.chips.includes("homed"));
});

test("idle homed is a hold; a desktop session stays bound to its machine", () => {
  const result = analyze(seedHomed());
  assert.equal(result.verdict, "homed");
  assert.equal(result.idleWord, "homed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.crossed, false);
  assert.equal(result.homed, true);
  assert.ok(result.chips.includes("homed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("crossed"));
  assert.equal(result.ticket.sessionHomed, true);
  assert.equal(result.ticket.windowsInputOnWindows, true);
  assert.equal(result.ticket.windowsInputOnMac, false);
  assert.match(result.contrast.case, /homed/i);
  assert.doesNotMatch(
    result.idleWord,
    /armed|unheard|unbolted|snagged|reeved|fouled|creased|bled|latched|vanished|sealed|rebound|dark|spurious|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify homed", () => {
  assert.equal(classify(emptyTicket()), "homed");
  assert.equal(classify(""), "homed");
  assert.equal(classify(null), "homed");
  assert.equal(decideSeed("homed").verdict, "homed");
  assert.equal(decideSeed("open").verdict, "homed");
});

test("seeded crossed #91511 is alarm with hostname pin, dual title, shared transcript", () => {
  const result = analyze(seedCrossed());
  assert.equal(result.verdict, "crossed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.crossed, true);
  assert.ok(result.chips.includes("crossed"));
  assert.ok(result.chips.includes("windows-input"));
  assert.ok(result.chips.includes("macos-executor"));
  assert.ok(result.chips.includes("hostname-pin"));
  assert.ok(result.chips.includes("dual-title"));
  assert.ok(result.chips.includes("shared-transcript"));
  assert.ok(result.chips.includes("invisible-host"));
  assert.ok(result.chips.includes("remote-control"));
  assert.ok(result.chips.includes("list-sessions-asymmetry"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("homed"));
  assert.match(result.contrast.case, /crossed/i);
  assert.equal(result.ticket.windowsInputOnMac, true);
  assert.equal(result.ticket.hostnameReturnsMac, true);
  assert.equal(result.ticket.hostnamePin, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.windowsTitle, WINDOWS_TITLE);
  assert.equal(result.ticket.macosTitle, MACOS_TITLE);
});

test("data fixtures classify homed vs crossed vs named chips", () => {
  assert.equal(classify(readData("homed.json")), "homed");
  assert.equal(classify(readData("crossed.json")), "crossed");
  assert.equal(classify(readData("91511.json")), "crossed");
  assert.equal(classify(readData("windows.json")), "windows-input");
  assert.equal(classify(readData("macos.json")), "macos-executor");
  assert.equal(classify(readData("hostname.json")), "hostname-pin");
  assert.equal(classify(readData("dual-title.json")), "dual-title");
  assert.equal(classify(readData("shared-transcript.json")), "shared-transcript");
  assert.equal(classify(readData("invisible-host.json")), "invisible-host");
  assert.equal(classify(readData("remote-control.json")), "remote-control");
  assert.equal(classify(readData("list-sessions.json")), "list-sessions-asymmetry");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("windows-input.json")), "windows-input");
  assert.equal(classify(readData("macos-executor.json")), "macos-executor");
  assert.equal(classify(readData("pull-on-mac.json")), "macos-executor");
  assert.equal(classify(readData("area-security.json")), "has-clear-repro");
  assert.equal(classify(readData("area-desktop.json")), "has-clear-repro");
});

test("crossed seed is alarm; homed / hold are holds", () => {
  assert.equal(score(seedCrossed()).alarm, true);
  assert.equal(score(seedCrossed()).hold, false);
  assert.equal(score(seedHomed()).hold, true);
  assert.equal(score(seedHomed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedHostnamePin()).alarm, true);
  assert.equal(score(seedMacosExecutor()).alarm, true);
});

test("normalize seeds 91511 without ticket fields", () => {
  const ticket = normalize({ issue: 91511 });
  assert.equal(ticket.windowsInputOnMac, true);
  assert.equal(ticket.hostnameReturnsMac, true);
  assert.equal(ticket.hostnamePin, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "crossed");
});

test("score / decide / handle agree on crossed vs homed", () => {
  assert.equal(score(seedCrossed()).verdict, "crossed");
  assert.equal(decide(seedHomed()).verdict, "homed");
  const fail = handle(seedCrossed());
  const hold = handle(seedHomed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91511/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /hostname|Mac|Windows|transcript/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /homed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("crossed").verdict, "crossed");
  assert.equal(decideSeed(91511).verdict, "crossed");
  assert.equal(decideSeed("91511").verdict, "crossed");
  assert.equal(decideSeed("homed").verdict, "homed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("windows-input").verdict, "windows-input");
  assert.equal(decideSeed("macos-executor").verdict, "macos-executor");
  assert.equal(decideSeed("hostname-pin").verdict, "hostname-pin");
});

test("CLI scores data files", () => {
  const crossed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91511.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(crossed.status, 0, crossed.stderr);
  assert.equal(JSON.parse(crossed.stdout).verdict, "crossed");
  assert.equal(JSON.parse(crossed.stdout).alarm, true);

  const homed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/homed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(homed.status, 0, homed.stderr);
  assert.equal(JSON.parse(homed.stdout).verdict, "homed");
  assert.equal(JSON.parse(homed.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91511);
  assert.deepEqual([...PRIMARY_ISSUES], [91511]);
  assert.equal(COUSIN_ISSUE, 91055);
  assert.deepEqual([...COUSINS], [91055, 88501, 90433, 78776]);
  assert.deepEqual([...RELATED_IN_ISSUE], [91055, 88501, 90433, 78776]);
  assert.equal(FILED_AT, "2026-09-02T13:41:51Z");
  assert.equal(REPORTER, "barthaines");
  assert.equal(VERSION, "2.1.247");
  assert.equal(PLATFORM, "Windows + macOS desktop");
  assert.equal(DARWIN, "Darwin 25.6.0");
  assert.equal(HOSTNAME_RESULT, "Mac");
  assert.equal(HOSTNAME_OS, "Darwin");
  assert.equal(WINDOWS_TITLE, "Device test setup");
  assert.equal(MACOS_TITLE, "Phase 3B implementation");
  assert.equal(MACOS_SESSION, "local_fee0634c-6124-4544-b69b-b653bf4fc0e4");
  assert.equal(PULL_PHRASE, "Pull the latest from GitHub");
  assert.equal(PULL_RESULT, "Already up to date");
  assert.equal(EVIDENCE, "hostname-pin");
  assert.equal(IDLE_WORD, "homed");
  assert.equal(SEEDED_WORD, "crossed");
  assert.notEqual(IDLE_WORD, "crossed");
  assert.match(TITLE, /Windows session/);
  assert.match(TITLE, /macOS session/);
  assert.match(TITLE, /cross-machine/);
  assert.match(ISSUE_URL, /91511/);
  assert.match(PHRASE, /patches Windows keystrokes onto a Mac bus/i);
  assert.match(PHRASE, /admit the session already left its machine/);
  assert.match(HUB_LINE, /01:50 jackfield/);
  assert.match(HUB_LINE, /admit the session already left its machine/);
  assert.match(MARK, /01:50/);
  assert.match(MARK, /#124/);
  assert.match(MARK, /#91511/);
  assert.match(
    CONTRAST_NOTE,
    /DESKTOP CROSS-MACHINE SESSION MIX-UP — WINDOWS INPUT EXECUTES ON UNRELATED MACOS SESSION/,
  );
  assert.match(CONTRAST_NOTE, /hostname/);
  assert.match(CONTRAST_NOTE, /Mac \/ Darwin/);
  assert.match(CONTRAST_NOTE, /Device test setup/);
  assert.match(CONTRAST_NOTE, /Phase 3B implementation/);
  assert.match(CONTRAST_NOTE, /list_sessions/);
  assert.match(CONTRAST_NOTE, /Pull the latest from GitHub/);
  assert.match(CONTRAST_NOTE, /Already up to date/);
  assert.match(CONTRAST_NOTE, /barthaines/);
  assert.match(CONTRAST_NOTE, /2\.1\.247/);
  assert.match(CONTRAST_NOTE, /area:security/);
  assert.match(CONTRAST_NOTE, /area:desktop/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /Remote Control/);
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(NOT_PRODUCTS.includes("bolter"));
  assert.ok(NOT_PRODUCTS.includes("deadeye"));
  assert.ok(NOT_PRODUCTS.includes("reglet"));
  assert.ok(NOT_PRODUCTS.includes("reliquary"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("caisson"));
  assert.ok(NOT_PRODUCTS.includes("spindle"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("berth"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(NOT_PRODUCTS.includes("reveille"));
  assert.ok(NOT_PRODUCTS.includes("callboard"));
  assert.ok(BANNED_NAMES.includes("Tocsin"));
  assert.ok(BANNED_NAMES.includes("Bolter"));
  assert.ok(BANNED_NAMES.includes("Deadeye"));
  assert.ok(BANNED_NAMES.includes("Reglet"));
  assert.ok(BANNED_NAMES.includes("Reliquary"));
  assert.ok(BANNED_NAMES.includes("Annunciator"));
  assert.ok(BANNED_NAMES.includes("Caisson"));
  assert.ok(BANNED_NAMES.includes("Spindle"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
    assert.notEqual(SEEDED_WORD, word);
  }
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:security"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(HOLD_VERDICTS.includes("homed"));
  assert.ok(ALARM_VERDICTS.includes("crossed"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "homed");
  assert.equal(chips.seededWord, "crossed");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91511);
  assert.equal(fp.cousin, 91055);
  assert.deepEqual(fp.cousins, [91055, 88501, 90433, 78776]);
  assert.equal(fp.reporter, "barthaines");
  assert.equal(fp.version, "2.1.247");
  assert.equal(fp.platform, "Windows + macOS desktop");
  assert.equal(fp.darwin, "Darwin 25.6.0");
  assert.equal(fp.evidence, "hostname-pin");
  assert.equal(fp.hostnameResult, "Mac / Darwin");
  assert.equal(fp.windowsTitle, "Device test setup");
  assert.equal(fp.macosTitle, "Phase 3B implementation");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "crossed");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.hostnamePin, true);
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 91511);
  assert.ok(cousins.rows.some((row) => row.issue === 91055));
  assert.ok(cousins.rows.some((row) => row.issue === 88501));
});

test("chipsOf on a raw hostname-pin ticket still marks crossed", () => {
  const chips = chipsOf({
    windowsInputOnMac: true,
    hostnameReturnsMac: true,
    hostnamePin: true,
    macosExecutor: true,
    outputText:
      "crossed; #91511; hostname typed into Windows window returned Mac / Darwin; Windows input routed to macOS executor",
  });
  assert.ok(chips.includes("crossed"));
  assert.ok(chips.includes("hostname-pin"));
  assert.ok(chips.includes("macos-executor"));
  assert.ok(!chips.includes("homed"));
});

test("cousin #91055 is not conflated with crossed primary", () => {
  assert.notEqual(classify(seedCousin()), "crossed");
  assert.notEqual(classify({ issue: 91055 }), "crossed");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /91055|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become crossed", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "crossed", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91511);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedWindowsInput()).verdict, "windows-input");
  assert.equal(analyze(seedMacosExecutor()).verdict, "macos-executor");
  assert.equal(analyze(seedHostnamePin()).verdict, "hostname-pin");
  assert.equal(analyze(seedDualTitle()).verdict, "dual-title");
  assert.equal(analyze(seedSharedTranscript()).verdict, "shared-transcript");
  assert.equal(analyze(seedInvisibleHost()).verdict, "invisible-host");
  assert.equal(analyze(seedRemoteControl()).verdict, "remote-control");
  assert.equal(analyze(seedListSessionsAsymmetry()).verdict, "list-sessions-asymmetry");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.sessionHomed, true);
  assert.equal(isCrossed(seedHomed()), false);
  assert.equal(isCrossed(seedCrossed()), true);
});

test("living page is a Jackfield atelier, idle homed, seeded crossed", () => {
  const html = readPage();
  assert.match(html, /<title>Jackfield/);
  assert.match(html, /Idle word:\s*homed/);
  assert.match(html, /homed/);
  assert.match(html, /crossed/);
  assert.match(html, /windows-input|Windows/);
  assert.match(html, /macos-executor|macOS|Darwin/);
  assert.match(html, /hostname-pin|hostname/);
  assert.match(html, /dual-title|Device test setup|Phase 3B/);
  assert.match(html, /shared-transcript|transcript/);
  assert.match(html, /invisible-host|no host indication|invisible host/i);
  assert.match(html, /Remote Control|remote-control/);
  assert.match(html, /list_sessions|list-sessions/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91511/);
  assert.match(html, /#91055/);
  assert.match(html, /#88501/);
  assert.match(html, /#90433/);
  assert.match(html, /#78776/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /01:50/);
  assert.match(html, /catalog #124/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /Darwin 25\.6\.0/);
  assert.match(html, /barthaines/);
  assert.match(html, /area:security/);
  assert.match(html, /area:desktop/);
  assert.match(html, /family=Brygada\+1918|Brygada 1918/);
  assert.match(html, /family=Atkinson\+Hyperlegible|Atkinson Hyperlegible/);
  assert.match(html, /family=DM\+Mono|DM Mono/);
  assert.match(html, /Patch the jackfield/);
  assert.match(html, /Pin idle homed/);
  assert.match(html, /Pin seeded crossed/);
  assert.match(html, /Admit the session already left its machine/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to homed/);
  assert.match(html, /jackfield|channel-strip|channel strip/i);
  assert.match(html, /CROSS-MACHINE|hostname|Windows input/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF tocsin watchhouse/);
  assert.match(html, /bolter flour-mill/);
  assert.match(html, /deadeye standing-rigging/);
  assert.match(html, /reglet letterpress/);
  assert.match(html, /reliquary vault-latch/);
  assert.match(html, /annunciator lamps/);
  assert.match(html, /caisson berth/);
  assert.match(html, /spindle chip-sweep/);
  assert.match(html, /knell mute-bell/);
  assert.match(html, /tumbler keyway/);
  assert.match(html, /escapement pallet/);
  assert.match(html, /carillon peal/);
  assert.match(html, /sluice millrace/);
  assert.match(html, /reveille muster/);
  assert.match(html, /callboard roster/);
  assert.doesNotMatch(html, /Idle word:\s*crossed/i);
  assert.doesNotMatch(html, /Idle word:\s*armed/i);
  assert.doesNotMatch(html, /Idle word:\s*unheard/i);
  assert.doesNotMatch(html, /Idle word:\s*unbolted/i);
  assert.doesNotMatch(html, /Idle word:\s*snagged/i);
  assert.doesNotMatch(html, /Pin idle crossed/);
  assert.doesNotMatch(html, /Pin idle armed/);
  assert.doesNotMatch(html, /Pin idle unheard/);
  assert.doesNotMatch(html, /Sound the tocsin/);
  assert.doesNotMatch(html, /Bolt the cloth/);
  assert.doesNotMatch(html, /Reeve the deadeye/);
  assert.doesNotMatch(html, /Score the cloth/);
  assert.doesNotMatch(html, /Score the reeve/);
  assert.doesNotMatch(html, /Score the strip/);
  assert.doesNotMatch(html, /Score the latch/);
  assert.doesNotMatch(html, /Score the seal/);
  assert.doesNotMatch(html, /Score the purge/);
  assert.doesNotMatch(html, /Score the mute/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(html, /family=Piazzolla|Piazzolla/);
  assert.doesNotMatch(html, /family=Nunito|Nunito/);
  assert.doesNotMatch(html, /family=Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(html, /family=Literata|Literata/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Text|Red Hat Text/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono|Red Hat Mono/);
  assert.doesNotMatch(html, /family=EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(html, /family=Hanken\+Grotesk|Hanken Grotesk/);
  assert.doesNotMatch(html, /family=Noto\+Sans\+Mono|Noto Sans Mono/);
  assert.doesNotMatch(html, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(html, /family=Chakra\+Petch|Chakra Petch/);
  assert.doesNotMatch(html, /family=Barlow|Barlow/);
  assert.doesNotMatch(html, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.doesNotMatch(html, /family=Zilla\+Slab|Zilla Slab/);
  assert.doesNotMatch(html, /family=Epilogue|Epilogue/);
  assert.doesNotMatch(html, /family=Overpass\+Mono|Overpass Mono/);
  assert.doesNotMatch(html, /family=Cardo|Cardo/);
  assert.doesNotMatch(html, /family=Hind|Hind/);
  assert.doesNotMatch(html, /family=Cousine|Cousine/);
  assert.doesNotMatch(html, /family=Bitter|Bitter/);
  assert.doesNotMatch(html, /family=Karla|Karla/);
  assert.doesNotMatch(html, /family=Inconsolata|Inconsolata/);
  assert.doesNotMatch(html, /family=Young\+Serif|Young Serif/);
  assert.doesNotMatch(html, /family=Figtree|Figtree/);
  assert.doesNotMatch(html, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(html, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(html, /family=Manrope|Manrope/);
  assert.doesNotMatch(html, /family=Azeret\+Mono|Azeret Mono/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Jost/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Cinzel/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Jackfield, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Jackfield/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /DESKTOP CROSS-MACHINE SESSION MIX-UP — WINDOWS INPUT EXECUTES ON UNRELATED MACOS SESSION/i,
  );
  assert.match(readme, /NOT \*\*Tocsin\*\*/);
  assert.match(readme, /NOT \*\*Bolter\*\*/);
  assert.match(readme, /NOT \*\*Deadeye\*\*/);
  assert.match(readme, /NOT \*\*Reglet\*\*/);
  assert.match(readme, /NOT \*\*Reliquary\*\*/);
  assert.match(readme, /NOT \*\*Annunciator\*\*/);
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /Product name stays \*\*Jackfield\*\*/);
  assert.match(readme, /Idle word: \*\*homed\*\*/);
  assert.match(readme, /#91055/);
  assert.match(readme, /#88501/);
  assert.match(readme, /#90433/);
  assert.match(readme, /#78776/);
  assert.match(readme, /hostname/);
  assert.match(readme, /Mac \/ Darwin/);
  assert.match(readme, /list_sessions/);
  assert.match(readme, /Device test setup/);
  assert.match(readme, /Phase 3B implementation/);
  assert.match(readme, /barthaines/);
  assert.match(readme, /2\.1\.247/);
  assert.match(readme, /area:security/);
  assert.match(readme, /area:desktop/);
  assert.match(readme, /Remote Control/);
  assert.match(readme, /idle-wake/);
  assert.match(readme, /dontAsk/);
  assert.doesNotMatch(readme, /^# Tocsin/m);
  assert.doesNotMatch(readme, /^# Bolter/m);
  assert.doesNotMatch(readme, /^# Deadeye/m);
  assert.doesNotMatch(readme, /^# Reglet/m);
  assert.doesNotMatch(readme, /^# Reliquary/m);
  assert.doesNotMatch(readme, /^# Annunciator/m);
  assert.doesNotMatch(readme, /^# Caisson/m);
  assert.doesNotMatch(readme, /^# Spindle/m);
  assert.doesNotMatch(readme, /^# Knell/m);
  assert.doesNotMatch(readme, /^# Tumbler/m);
  assert.doesNotMatch(readme, /^# Escapement/m);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
  assert.doesNotMatch(readme, /^# Berth/m);
  assert.doesNotMatch(readme, /^# Bollard/m);
  assert.doesNotMatch(readme, /^# Reveille/m);
  assert.doesNotMatch(readme, /^# Callboard/m);
});
