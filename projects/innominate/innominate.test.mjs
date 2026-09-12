import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARIA_ROLE,
  BACKUPS,
  BOOTH_STATIONS,
  BUTTON_TYPE,
  CHECKED_BUILDS,
  CHECKED_RANGE,
  CHIPS,
  CLAUDE_VERSION,
  CONTROL_CLASS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  INNOMINATE_PLAQUES,
  INNOMINATE_WALK,
  ISSUE_URL,
  LABELED_COUNT,
  LABELS,
  LIVE_ANNOUNCEMENTS,
  NOT_PRODUCTS,
  OS_LABEL,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_BUTTON,
  SAMPLE_LIVE,
  SAMPLE_PLATE,
  SAMPLE_SIBLING,
  SAMPLE_UIA,
  SCREEN_READER_SHIP,
  SEEDED_WORD,
  SESSION_KIND,
  SIBLING_LABEL,
  STATE,
  SUGGESTED_LABEL,
  SURFACE,
  TITLE,
  UIA_NAME,
  VERDICTS,
  WCAG_LEVEL,
  WCAG_SC,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectButton,
  inspectLive,
  inspectPlate,
  inspectSibling,
  inspectUia,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBlank,
  seedDocsGap,
  seedEmptyUiaName,
  seedHold,
  seedIconOnly,
  seedInnominate,
  seedLabelButton,
  seedLiveRegionOnly,
  seedLongStanding,
  seedNamed,
  seedNoAriaLabel,
  seedSendStop,
  seedSiblingLabeled,
  seedVoiceControl,
  seedWcag412,
} from "./innominate.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function readHubCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../hub/catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./innominate.mjs", import.meta.url));
}

test("idle named is a hold; button has a state-aware accessible name", () => {
  const result = analyze(seedNamed());
  assert.equal(result.verdict, "named");
  assert.equal(result.idleWord, "named");
  assert.equal(IDLE_WORD, "named");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.named, true);
  assert.equal(result.phrase, "admit named");
  assert.equal(result.blank, false);
  assert.equal(result.iconOnly, false);
  assert.equal(result.labelButton, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify named", () => {
  assert.equal(classify(emptyTicket()), "named");
  assert.equal(classify(""), "named");
  assert.equal(classify(null), "named");
  assert.equal(decide({}), "named");
});

test("#93769 seeded path scores innominate when the plate is blank", () => {
  const result = analyze(seedBlank());
  assert.equal(result.verdict, "innominate");
  assert.equal(result.seededWord, "blank");
  assert.equal(SEEDED_WORD, "blank");
  assert.equal(PRODUCT_WORD, "innominate");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.blank, true);
  assert.equal(result.phrase, "score innominate");
  assert.equal(result.emptyUiaName, true);
  assert.equal(result.noAriaLabel, true);
  assert.equal(result.liveRegionOnly, true);
  assert.equal(result.iconOnly, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty-uia-name plus no-aria-label is the #93769 innominate", () => {
  const plate = inspectPlate({ blank: true, iconOnly: true });
  assert.equal(plate.stamp, "plate-blank");
  assert.equal(plate.blank, true);
  const scored = scoreGate({
    blank: true,
    emptyUiaName: true,
    noAriaLabel: true,
    liveRegionOnly: true,
    siblingLabeled: true,
    wcag412: true,
    sendStop: true,
    iconOnly: true,
    voiceControl: true,
    docsGap: true,
    longStanding: true,
    cue: "blank",
    plate: SAMPLE_PLATE,
    button: SAMPLE_BUTTON,
  });
  assert.equal(scored.verdict, "innominate");
  assert.equal(scored.iconOnly, true);
  const open = inspectPlate({ named: true, labelButton: true });
  assert.equal(open.stamp, "plate-named");
});

test("path word is icon-only; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "icon-only");
  const result = analyze(seedIconOnly());
  assert.equal(result.verdict, "icon-only");
  assert.equal(result.pathWord, "icon-only");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "icon-only", preferSeed: true, blank: true }),
    "icon-only",
  );
  assert.equal(classify(seedNoAriaLabel()), "no-aria-label");
});

test("HOLD includes named / hold", () => {
  assert.ok(HOLD.includes("named"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: empty-uia-name, no-aria-label, live-region-only, wcag-412", () => {
  assert.equal(classify(seedEmptyUiaName()), "empty-uia-name");
  assert.equal(classify(seedSendStop()), "send-stop");
  assert.equal(classify(seedLongStanding()), "long-standing");
  assert.equal(classify(seedNoAriaLabel()), "no-aria-label");
  assert.equal(classify(seedLiveRegionOnly()), "live-region-only");
  assert.equal(classify(seedSiblingLabeled()), "sibling-labeled");
  assert.equal(classify(seedWcag412()), "wcag-412");
  assert.equal(classify(seedVoiceControl()), "voice-control");
  assert.equal(classify(seedDocsGap()), "docs-gap");
  assert.equal(classify(seedLabelButton()), "label-button");
  assert.equal(classify(seedInnominate()), "innominate");
});

test("booth fixtures flip named vs blank vs icon-only vs innominate", () => {
  const idle = scoreGate(seedNamed());
  const seeded = scoreGate(seedBlank());
  const named = readData("named.json");
  const blank = readData("blank.json");
  const path = readData("icon-only.json");
  const product = readData("innominate.json");
  const uia = readData("empty-uia-name.json");
  const aria = readData("no-aria-label.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "named");
  assert.equal(seeded.verdict, "innominate");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedNamed()), "named");
  assert.equal(score(seedBlank()), "innominate");
  assert.equal(named.labelButton, true);
  assert.equal(named.named, true);
  assert.equal(scoreGate(named).verdict, "named");
  assert.equal(blank.emptyUiaName, true);
  assert.equal(blank.noAriaLabel, true);
  assert.equal(blank.liveRegionOnly, true);
  assert.equal(classify(blank), "blank");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /accessible name|aria-label|Send\/Stop/i);
  assert.match(path.paths[1].result, /icon-only|UIA Name|empty/i);
  assert.equal(classify(path), "icon-only");
  assert.equal(classify(product), "innominate");
  assert.equal(product.hubCount, "INNOMINATE");
  assert.equal(blank.issue, 93769);
  assert.equal(blank.blank, true);
  assert.equal(classify(uia), "empty-uia-name");
  assert.equal(classify(aria), "no-aria-label");
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("live-region-only.json")), "live-region-only");
  assert.equal(classify(readData("sibling-labeled.json")), "sibling-labeled");
  assert.equal(classify(readData("wcag-412.json")), "wcag-412");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("named"));
  assert.ok(CHIPS.includes("blank"));
  assert.ok(CHIPS.includes("innominate"));
  assert.ok(CHIPS.includes("icon-only"));
  assert.ok(CHIPS.includes("empty-uia-name"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("blank"));
  assert.ok(ALARM.includes("icon-only"));
  assert.ok(ALARM.includes("empty-uia-name"));
  assert.ok(ALARM.includes("innominate"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published innominate walk scores innominate after the idle hold", () => {
  const booth = scoreWalk({ rows: INNOMINATE_WALK });
  assert.equal(booth.verdict, "innominate");
  assert.ok(booth.blankCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-named");
  assert.equal(idle.named, true);
  assert.equal(idle.verdict, "named");
  const sendStop = booth.rows.find((row) => row.event === "send-stop");
  assert.equal(sendStop.sendStop, true);
  const path = booth.rows.find((row) => row.event === "icon-only" && row.t === "path");
  assert.equal(path.verdict, "icon-only");
});

test("INNOMINATE_WALK constant matches the issue nameplate walk", () => {
  assert.equal(INNOMINATE_WALK[0].event, "cue-named");
  const sendStop = INNOMINATE_WALK.find((row) => row.event === "send-stop");
  assert.equal(sendStop.sendStop, true);
  const path = INNOMINATE_WALK.find((row) => row.t === "path");
  assert.equal(path.blank, true);
  const scoreRow = INNOMINATE_WALK.find((row) => row.event === "innominate");
  assert.equal(scoreRow.blank, true);
});

test("positive control label-button stays named", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "named");
  const ok = walk.rows.find((row) => row.event === "label-button");
  assert.equal(ok.verdict, "named");
  const hold = walk.rows.find((row) => row.event === "cue-named");
  assert.equal(hold.named, true);
  assert.equal(hold.verdict, "named");
});

test("issue constants encode only #93769 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93769);
  assert.ok(ISSUE_URL.includes("93769"));
  assert.match(TITLE, /Send\/Stop/i);
  assert.match(TITLE, /accessible name/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:a11y"));
  assert.ok(LABELS.includes("platform:vscode"));
  assert.equal(PLATFORM, "vscode");
  assert.match(CLAUDE_VERSION, /2\.1\.268/);
  assert.match(CHECKED_RANGE, /2\.1\.209/);
  assert.equal(SCREEN_READER_SHIP, "2.1.236");
  assert.equal(UIA_NAME, "");
  assert.equal(ARIA_ROLE, "button");
  assert.equal(BUTTON_TYPE, "submit");
  assert.equal(CONTROL_CLASS, "sendButton_gGYT1w");
  assert.equal(SIBLING_LABEL, "Send side question");
  assert.equal(LABELED_COUNT, 23);
  assert.match(WCAG_SC, /4\.1\.2/);
  assert.equal(WCAG_LEVEL, "A");
  assert.match(SUGGESTED_LABEL, /Stop response|Send message/);
  assert.ok(LIVE_ANNOUNCEMENTS.includes("Claude is working."));
  assert.ok(CHECKED_BUILDS.includes("2.1.209"));
  assert.ok(CHECKED_BUILDS.includes("2.1.269"));
  assert.match(OS_LABEL, /Windows 10/);
  assert.match(SURFACE, /VS Code/);
  assert.equal(INNOMINATE_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /86874|91606|live region/i.test(row)));
  assert.ok(EXPECTED.some((row) => /aria-label|Stop response|interrupt/i.test(row)));
  assert.match(DISTRIBUTION, /UIA Name|icon-only|Send side question|4\.1\.2/);
  assert.match(SESSION_KIND, /2\.1\.268|Windows 10|Send\/Stop/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("icon-only"));
  assert.ok(FINGERPRINT_LINES.includes("blank"));
  assert.equal(PHRASE, "Score innominate or admit named.");
  assert.equal(SAMPLE_PLATE.blank, true);
  assert.equal(SAMPLE_BUTTON.iconOnly, true);
  assert.equal(SAMPLE_UIA.empty, true);
  assert.equal(SAMPLE_LIVE.labelsButton, false);
  assert.equal(SAMPLE_SIBLING.labeled, true);
});

test("has-repro fingerprints encode the published blank innominate", () => {
  const result = handle(seedBlank());
  assert.equal(result.published.platform, "vscode");
  assert.match(result.published.sessionKind, /Send\/Stop|2\.1\.268/);
  assert.equal(result.published.uiaName, UIA_NAME);
  assert.match(
    fingerprint(seedBlank()),
    /innominate\|plate=blank\|uia=empty\|aria=none\|live=talks\|path=icon-only\|cue=icon-only/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Snuffer and Changeling", () => {
  const required = [
    "lit",
    "snuffed",
    "snuffer",
    "ganged-or",
    "pledged",
    "swapped",
    "changeling",
    "remote-reattach",
    "distinct",
    "collided",
    "homograph",
    "lossy-slug",
    "dry",
    "billed",
    "galley",
    "stop-dirty",
    "intact",
    "scraped",
    "rescript",
    "snapshot-write",
    "fresh",
    "residual",
    "monadnock",
    "submodule-base",
    "plain",
    "ridden",
    "attachment-rider",
    "rider",
    "dark",
    "spawn-mcp-focus",
    "followspot",
    "due",
    "misfired",
    "catchup-dow",
    "calends",
    "flowing",
    "dammed",
    "egress-allowlist",
    "weir",
    "underway",
    "becalmed",
    "cron-websearch",
    "irons",
    "seated",
    "raced",
    "ptmx-race",
    "cathead",
    "tip",
    "stale",
    "prewarm-latch",
    "anachronism",
    "stamped",
    "emptied",
    "empty-expand",
    "nullarbor",
    "standing",
    "hoisted",
    "petard",
    "wrapper-argv",
    "raised",
    "furled",
    "aposiopesis",
    "git-cwd-mute",
    "seised",
    "disseised",
    "disseisin",
    "home-evaporated",
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "closed",
    "lingering",
    "unrung",
    "compline",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
    "primed",
    "flashed",
    "mirage",
    "lodged",
    "kindled",
    "flushed",
    "solitary",
    "hit",
    "dropped",
    "painted",
    "lagged",
    "twinlinked",
    "flattened",
    "held",
    "steered",
    "greenroomed",
    "palimpsest",
    "oubliette",
    "ephemera",
    "homonym",
    "quench",
    "stopcock",
    "hasp",
    "scuttle",
    "aphonia",
    "muzzle",
    "escutcheon",
    "lacuna",
    "annunciator",
    "tocsin",
    "knell",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("named booth flips blank back when the plate stays named", () => {
  const tape = {
    named: true,
    blank: false,
    labelButton: true,
    cue: "named",
  };
  assert.equal(scoreGate(tape).verdict, "named");
  tape.named = false;
  tape.blank = true;
  tape.emptyUiaName = true;
  tape.noAriaLabel = true;
  tape.liveRegionOnly = true;
  tape.cue = "blank";
  assert.equal(scoreGate(tape).verdict, "innominate");
  tape.named = true;
  tape.blank = false;
  tape.emptyUiaName = false;
  tape.noAriaLabel = false;
  tape.liveRegionOnly = false;
  tape.cue = "named";
  assert.equal(scoreGate(tape).verdict, "named");
});

test("plate, button, uia, live, sibling, and readBooth mark the blank innominate", () => {
  const idle = inspectPlate({
    named: true,
    labelButton: true,
    plate: { named: true, text: "Send message", blank: false },
  });
  assert.equal(idle.stamp, "plate-named");
  const button = inspectButton({ blank: true, button: SAMPLE_BUTTON });
  assert.equal(button.stamp, "button-icon-only");
  assert.equal(button.iconOnly, true);
  const uia = inspectUia({
    emptyUiaName: true,
    uia: SAMPLE_UIA,
  });
  assert.equal(uia.stamp, "uia-empty");
  const live = inspectLive({ blank: true, liveRegionOnly: true });
  assert.equal(live.stamp, "live-talks");
  const sibling = inspectSibling({ blank: true, siblingLabeled: true });
  assert.equal(sibling.stamp, "sibling-only");
  const booth = readBooth({
    blank: true,
    emptyUiaName: true,
    noAriaLabel: true,
    plate: SAMPLE_PLATE,
    button: SAMPLE_BUTTON,
  });
  assert.equal(booth.blank, true);
  assert.equal(booth.mark, "blank");
  const open = readBooth({
    named: true,
    blank: false,
    labelButton: true,
  });
  assert.equal(open.blank, false);
  assert.equal(open.mark, "named");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 9);
  assert.equal(COUSINS[0].issue, 86874);
  assert.equal(COUSINS[1].issue, 91606);
  assert.equal(COUSINS[2].issue, 89002);
  assert.equal(COUSINS[3].issue, 88221);
  assert.equal(COUSINS[4].issue, 87123);
  assert.equal(COUSINS[5].issue, 88839);
  assert.equal(COUSINS[6].issue, 91058);
  assert.equal(COUSINS[7].issue, 70425);
  assert.equal(COUSINS[8].issue, 74694);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /86874|transcript|rebuild/i);
  assert.match(COUSINS[1].why, /91606|tray|tooltip/i);
  assert.match(COUSINS[2].why, /89002|AX/i);
  assert.match(COUSINS[5].why, /88839|AskUserQuestion|NVDA/i);
  assert.match(COUSINS[6].why, /91058|VoiceOver/i);
  assert.ok(NOT_PRODUCTS.includes("snuffer"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.ok(NOT_PRODUCTS.includes("homograph"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("rescript"));
  assert.ok(NOT_PRODUCTS.includes("monadnock"));
  assert.ok(NOT_PRODUCTS.includes("rider"));
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("aphonia"));
  assert.ok(NOT_PRODUCTS.includes("muzzle"));
  assert.ok(NOT_PRODUCTS.includes("escutcheon"));
  assert.ok(NOT_PRODUCTS.includes("lacuna"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("quench"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
  assert.ok(NOT_PRODUCTS.includes("hasp"));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93744);
  assert.equal(BACKUPS[1].issue, 93766);
  assert.equal(BACKUPS[2].issue, 93764);
  assert.equal(BACKUPS[3].issue, 93754);
  assert.equal(BACKUPS[4].issue, 93751);
  assert.equal(BACKUPS[5].issue, 93722);
  assert.equal(BACKUPS[6].issue, 93672);
  assert.equal(BACKUPS[7].issue, 93652);
  assert.equal(BACKUPS[8].issue, 93680);
  assert.equal(BACKUPS[9].issue, 93618);
  assert.equal(BACKUPS[10].issue, 93694);
  assert.equal(BACKUPS[11].issue, 93761);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /goal|evaluator/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/blank.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const namedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/named.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(namedFix.status, 0, namedFix.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "named");
  assert.equal(JSON.parse(seeded.stdout).verdict, "blank");
  assert.equal(JSON.parse(namedFix.stdout).verdict, "named");
});

test("handle exposes published hypothesis and #93769 headline", () => {
  const result = handle(seedBlank());
  assert.equal(result.published.issue, 93769);
  assert.equal(result.published.platform, "vscode");
  assert.deepEqual(result.published.cousins, [
    86874, 91606, 89002, 88221, 87123, 88839, 91058, 70425, 74694,
  ]);
  assert.ok(result.published.backups.includes(93744));
  assert.ok(result.published.backups.includes(93766));
  assert.ok(result.published.backups.includes(93764));
  assert.ok(result.published.backups.includes(93754));
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93761));
  assert.ok(!result.published.backups.includes(93769));
  assert.ok(!result.published.backups.includes(93746));
  assert.match(result.published.hypothesis, /aria-label|Stop response|Send message/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93769/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an innominate nameplate booth, not snuffer or changeling", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Atkinson Hyperlegible|Atkinson\+Hyperlegible/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /innominate|nameplate|escutcheon|plate/i);
  assert.match(page, /#12141A|#D7DCE5|#E8A317|#0B0D12|#2A9D8F|#C1121F/i);
  assert.match(page, /\bnamed\b/);
  assert.match(page, /\bblank\b/);
  assert.match(page, /icon-only/);
  assert.match(page, /Score innominate or admit named/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#308/);
  assert.match(page, /#93769/);
  assert.match(page, /Name the plate/);
  assert.match(page, /Score innominate/);
  assert.match(page, /Walk the footer/);
  assert.match(page, /Compare named \/ blank/);
  assert.match(page, /Pin idle named/);
  assert.match(page, /Pin seeded blank/);
  assert.match(page, /Pin icon-only/);
  assert.match(page, /Hold the named/);
  assert.doesNotMatch(page, /Playfair Display|Playfair\+Display/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Nunito Sans|Nunito\+Sans/);
  assert.doesNotMatch(page, /Young Serif|Young\+Serif/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Azeret Mono|Azeret\+Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Staatliches/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /#F3E5C5/);
  assert.doesNotMatch(page, /#1A1510/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#C45C26/);
  assert.doesNotMatch(page, /#FFF8EC/);
  assert.doesNotMatch(page, /#5C4A7A/);
  assert.doesNotMatch(page, /#EFE6D2/);
  assert.doesNotMatch(page, /#1A2748/);
  assert.doesNotMatch(page, /#C94A32/);
  assert.doesNotMatch(page, /pledged heir|court ledger|cradle-swap|fairy-gold|swaddling/i);
  assert.doesNotMatch(page, /lemma slip|lexicographer|shelf mark|orphan quire/i);
  assert.doesNotMatch(page, /composing stick|wet-proof|wet proof|unbound-signature|pull press|type-rail|galley-bed/i);
  assert.doesNotMatch(page, /chancery|wax-seal|wax seal|scrolled-rescript|lectern/i);
  assert.doesNotMatch(page, /trig survey|trig cairn|residual peak|nested massif|fetch sill/i);
  assert.doesNotMatch(page, /clerk desk|bill-rider|parliamentary|staple-pin/i);
  assert.doesNotMatch(page, /prop belt|operator iris|prompt book/i);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
  assert.doesNotMatch(page, /artifact flame|scratchpad taper|brass snuffer|ganged-or bar/i);
  assert.doesNotMatch(page, /\bpledged\b/);
  assert.doesNotMatch(page, /\bswapped\b/);
  assert.doesNotMatch(page, /remote-reattach/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bcollided\b/);
  assert.doesNotMatch(page, /lossy-slug/);
  assert.doesNotMatch(page, /\bdry\b/);
  assert.doesNotMatch(page, /\bbilled\b/);
  assert.doesNotMatch(page, /stop-dirty/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\bscraped\b/);
  assert.doesNotMatch(page, /snapshot-write/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bresidual\b/);
  assert.doesNotMatch(page, /submodule-base/);
  assert.doesNotMatch(page, /\bplain\b/);
  assert.doesNotMatch(page, /\bridden\b/);
  assert.doesNotMatch(page, /attachment-rider/);
  assert.doesNotMatch(page, /\bdark\b/);
  assert.doesNotMatch(page, /spawn-mcp-focus/);
  assert.doesNotMatch(page, /\bdue\b/);
  assert.doesNotMatch(page, /\bmisfired\b/);
  assert.doesNotMatch(page, /catchup-dow/);
  assert.doesNotMatch(page, /\bflowing\b/);
  assert.doesNotMatch(page, /\bdammed\b/);
  assert.doesNotMatch(page, /egress-allowlist/);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /greenroomed/);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /ganged-or/);
  assert.match(page, /NOT Snuffer/i);
  assert.match(page, /NOT Changeling/i);
  assert.match(page, /NOT Homograph/i);
  assert.match(page, /NOT Galley/i);
  assert.match(page, /NOT Rescript/i);
  assert.match(page, /NOT Monadnock/i);
  assert.match(page, /NOT Rider/i);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Quench/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Hasp/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Aphonia/i);
  assert.match(page, /NOT Muzzle/i);
  assert.match(page, /NOT Escutcheon/i);
  assert.match(page, /NOT Lacuna/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Innominate/);
  assert.match(readme, /#93769/);
  assert.match(readme, /\bnamed\b/);
  assert.match(readme, /\bblank\b/);
  assert.match(readme, /icon-only/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Atkinson Hyperlegible/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Snuffer/i);
  assert.match(readme, /NOT Changeling/i);
  assert.match(readme, /NOT Homograph/i);
  assert.match(readme, /NOT Galley/i);
  assert.match(readme, /NOT Rescript/i);
  assert.match(readme, /NOT Monadnock/i);
  assert.match(readme, /NOT Rider/i);
  assert.match(readme, /NOT Followspot/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Quench/i);
  assert.match(readme, /#86874/);
  assert.match(readme, /#91606/);
  assert.match(readme, /#89002/);
  assert.match(readme, /#88839/);
  assert.match(readme, /#91058/);
  assert.match(readme, /UIA Name|aria-label|Send\/Stop|4\.1\.2/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/innominate/);
  assert.match(readme, /node --test projects\/innominate\/innominate\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /innominate|nameplate|blank-escutcheon|escutcheon/i);
  assert.match(readme, /Score innominate or admit named/);
  assert.match(readme, /#93744|#93766|#93764|#93754|#93751|#93722|#93672|#93652|#93680|#93618|#93694|#93761/);
  assert.match(readme, /#93746/);
});

test("catalog features Innominate only; Snuffer unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 308);
  assert.equal(hub.products.length, 308);
  assert.equal(catalog.products[0].name, "Innominate");
  assert.equal(catalog.products[0].slug, "innominate");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/innominate/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /innominate|#93769|nameplate|blank-escutcheon/i);
  assert.match(catalog.products[0].summary, /\bnamed\b/);
  assert.match(catalog.products[0].summary, /\bblank\b/);
  assert.match(catalog.products[0].summary, /icon-only/);
  assert.match(catalog.products[0].summary, /Score innominate or admit named/);
  assert.equal(hub.products[0].slug, "innominate");
  assert.equal(hub.products[0].featured, true);
  const snuffer = catalog.products.find((row) => row.slug === "snuffer");
  assert.ok(snuffer);
  assert.equal(snuffer.featured, false);
  const changeling = catalog.products.find((row) => row.slug === "changeling");
  assert.ok(changeling);
  assert.equal(changeling.featured, false);
  const homograph = catalog.products.find((row) => row.slug === "homograph");
  assert.ok(homograph);
  assert.equal(homograph.featured, false);
  const galley = catalog.products.find((row) => row.slug === "galley");
  assert.ok(galley);
  assert.equal(galley.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "innominate").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93769") && row.slug !== "innominate"));
});

test("vercel rewrites innominate to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/innominate");
  assert.equal(vercel.rewrites[0].destination, "/projects/innominate");
  assert.equal(vercel.rewrites[1].source, "/innominate/");
  assert.equal(vercel.rewrites[1].destination, "/projects/innominate");
  assert.equal(vercel.rewrites[2].source, "/innominate/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/innominate/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
