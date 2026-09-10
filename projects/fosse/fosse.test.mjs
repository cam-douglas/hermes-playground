import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  BUILD,
  CHIPS,
  COUSINS,
  CUMULATIVE_KBS,
  DESKTOP_VERSION,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FOSSE_WALK,
  GUEST_ERROR,
  GUEST_MOUNTED,
  HOLD,
  HOST_HR,
  IDLE_MOUNTED,
  IDLE_WORD,
  ISSUE_URL,
  KB5124008,
  LABELS,
  LAST_GOOD,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  SANDBOX_HELPER,
  SEEDED_WORD,
  SHARE_ROOT,
  SHARE_TABLE,
  STATE,
  TITLE,
  TRENCH_STATIONS,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectGuestVoid,
  inspectHostBank,
  inspectSandboxCue,
  readTrench,
  score,
  scoreGate,
  scoreWalk,
  seedEinval,
  seedFosse,
  seedFossed,
  seedGuestVoid,
  seedHold,
  seedHostHonest,
  seedKb5124008Na,
  seedMounted,
  seedPlan9,
  seedSandboxHelper,
  seedSepCumulative,
  seedShareC,
  seedVmcompute,
} from "./fosse.mjs";

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

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./fosse.mjs", import.meta.url));
}

test("idle mounted is a hold; 4/4 Plan9 shares under the shared root", () => {
  const result = analyze(seedMounted());
  assert.equal(result.verdict, "mounted");
  assert.equal(result.idleWord, "mounted");
  assert.equal(IDLE_WORD, "mounted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.mounted, true);
  assert.equal(result.phrase, "admit mounted");
  assert.equal(result.hostHonest, true);
  assert.equal(result.guestOk, true);
  assert.equal(result.guestMounted, "4/4");
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify mounted", () => {
  assert.equal(classify(emptyTicket()), "mounted");
  assert.equal(classify(""), "mounted");
  assert.equal(classify(null), "mounted");
  assert.equal(decide({}), "mounted");
});

test("#93358 seeded path scores fossed when host hr=0x0 and guest 0/4 EINVAL", () => {
  const result = analyze(seedFossed());
  assert.equal(result.verdict, "fossed");
  assert.equal(result.seededWord, "fossed");
  assert.equal(SEEDED_WORD, "fossed");
  assert.equal(PRODUCT_WORD, "fosse");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.fossed, true);
  assert.equal(result.phrase, "score fosse");
  assert.equal(result.hostHr, "0x0");
  assert.equal(result.guestMounted, "0/4");
  assert.equal(result.einval, true);
  assert.equal(result.shareC, true);
  assert.equal(result.sandboxHelper, true);
  assert.equal(result.kb5124008Na, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("host-bank attach plus guest EINVAL is the #93358 fosse", () => {
  const host = inspectHostBank({
    hostHr: "0x0",
    hostHonest: true,
    hostShareCount: 4,
  });
  assert.equal(host.stamp, "host-bank");
  assert.equal(host.hostHonest, true);
  const scored = scoreGate({
    fossed: true,
    hostHonest: true,
    hostHr: "0x0",
    guestZero: true,
    guestMounted: "0/4",
    einval: true,
    shareC: true,
    cue: "fossed",
  });
  assert.equal(scored.verdict, "fossed");
  assert.equal(scored.einval, true);
  const calm = inspectGuestVoid({
    guestOk: true,
    guestMounted: "4/4",
    guestShareCount: 4,
  });
  assert.equal(calm.stamp, "mounted");
});

test("path word is plan9; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "plan9");
  const result = analyze(seedPlan9());
  assert.equal(result.verdict, "plan9");
  assert.equal(result.pathWord, "plan9");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "plan9", preferSeed: true, fossed: true }),
    "plan9",
  );
  assert.equal(classify(seedEinval()), "einval");
});

test("HOLD includes mounted / hold", () => {
  assert.ok(HOLD.includes("mounted"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: host-bank, guest-void, einval, share-c, sandbox-helper, sep, kb, vmcompute", () => {
  assert.equal(classify(seedHostHonest()), "host-bank");
  assert.equal(classify(seedGuestVoid()), "guest-void");
  assert.equal(classify(seedEinval()), "einval");
  assert.equal(classify(seedShareC()), "share-c");
  assert.equal(classify(seedSandboxHelper()), "sandbox-helper");
  assert.equal(classify(seedSepCumulative()), "sep-cumulative");
  assert.equal(classify(seedKb5124008Na()), "kb5124008-na");
  assert.equal(classify(seedVmcompute()), "vmcompute");
  assert.equal(classify(seedFosse()), "fosse");
});

test("mount fixtures flip mounted vs fossed vs plan9", () => {
  const idle = scoreGate(seedMounted());
  const seeded = scoreGate(readData("fossed.json"));
  const mounted = readData("mounted.json");
  const fossed = readData("fossed.json");
  const paths = readData("paths.json");
  const product = readData("fosse.json");
  assert.equal(idle.verdict, "mounted");
  assert.equal(seeded.verdict, "fossed");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedMounted()), "mounted");
  assert.equal(score(readData("fossed.json")), "fossed");
  assert.equal(mounted.guestMounted, "4/4");
  assert.equal(mounted.hostHr, "0x0");
  assert.equal(scoreGate(mounted).verdict, "mounted");
  assert.equal(fossed.guestMounted, "0/4");
  assert.equal(fossed.einval, true);
  assert.equal(fossed.shareC, true);
  assert.equal(classify(fossed), "fossed");
  assert.equal(paths.paths.length, 3);
  assert.equal(paths.paths[0].result, "hr=0x0");
  assert.equal(paths.paths[1].share, "c");
  assert.equal(paths.paths[1].result, "Plan9 mount failed: invalid argument");
  assert.equal(classify(paths), "plan9");
  assert.equal(classify(product), "fosse");
  assert.equal(fossed.issue, 93358);
  assert.match(fossed.guestError, /invalid argument/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("mounted"));
  assert.ok(CHIPS.includes("fossed"));
  assert.ok(CHIPS.includes("fosse"));
  assert.ok(CHIPS.includes("plan9"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("fossed"));
  assert.ok(ALARM.includes("plan9"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published fosse walk scores fossed after the idle hold", () => {
  const desk = scoreWalk({ rows: FOSSE_WALK });
  assert.equal(desk.verdict, "fossed");
  assert.ok(desk.fossedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-mounted");
  assert.equal(idle.mounted, true);
  assert.equal(idle.verdict, "mounted");
  const boots = desk.rows.find((row) => row.event === "nine-good-boots");
  assert.equal(boots.guestMounted, "4/4");
  const kb = desk.rows.find((row) => row.event === "sep-cumulative");
  assert.equal(kb.sepCumulative, true);
  const bins = desk.rows.find((row) => row.event === "vmcompute-rewrite");
  assert.equal(bins.vmcomputeRewrite, true);
  const host = desk.rows.find((row) => row.event === "host-attach-hr0");
  assert.equal(host.hostHr, "0x0");
  const shareC = desk.rows.find((row) => row.event === "guest-c-einval");
  assert.equal(shareC.shareC, true);
  const voidRow = desk.rows.find((row) => row.event === "guest-0-of-4");
  assert.equal(voidRow.guestMounted, "0/4");
  const helper = desk.rows.find((row) => row.event === "sandbox-helper-lie");
  assert.equal(helper.sandboxHelper, true);
  const na = desk.rows.find((row) => row.event === "kb5124008-na");
  assert.equal(na.kb5124008Na, true);
  const cut = desk.rows.find((row) => row.event === "fossed");
  assert.equal(cut.fossed, true);
  const path = desk.rows.find((row) => row.event === "plan9");
  assert.equal(path.verdict, "plan9");
});

test("FOSSE_WALK constant matches the issue trench walk", () => {
  assert.equal(FOSSE_WALK[0].event, "cue-mounted");
  const voidRow = FOSSE_WALK.find((row) => row.event === "guest-0-of-4");
  assert.equal(voidRow.guestMounted, "0/4");
  const cut = FOSSE_WALK.find((row) => row.event === "fossed");
  assert.equal(cut.hostHr, "0x0");
  assert.equal(cut.einval, true);
  const path = FOSSE_WALK.find((row) => row.event === "plan9");
  assert.equal(path.fossed, true);
  const scoreRow = FOSSE_WALK.find((row) => row.event === "fosse");
  assert.equal(scoreRow.fossed, true);
});

test("issue constants encode only #93358 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93358);
  assert.ok(ISSUE_URL.includes("93358"));
  assert.match(TITLE, /Plan9 mount failed: invalid argument/);
  assert.match(TITLE, /Windows 10 22H2/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.equal(AUTHOR, "djionut13");
  assert.equal(FILED, "2026-09-10T13:53:01Z");
  assert.equal(DESKTOP_VERSION, "1.49585.0.0");
  assert.equal(OS, "Windows 10 Pro 22H2");
  assert.equal(BUILD, "19045.7725");
  assert.equal(HOST_HR, "0x0");
  assert.equal(GUEST_MOUNTED, "0/4");
  assert.equal(IDLE_MOUNTED, "4/4");
  assert.equal(GUEST_ERROR, "Plan9 mount failed: invalid argument");
  assert.match(SANDBOX_HELPER, /no Plan9 drive shares/);
  assert.equal(SHARE_ROOT, "/mnt/.virtiofs-root/shared");
  assert.equal(LAST_GOOD, "2026/09/08 22:12:01");
  assert.deepEqual(CUMULATIVE_KBS, ["KB5122877", "KB5122878", "KB5126421"]);
  assert.match(KB5124008, /not installed/);
  assert.equal(SHARE_TABLE.length, 4);
  assert.equal(SHARE_TABLE[0].name, "c");
  assert.equal(SHARE_TABLE[0].port, 9902);
  assert.equal(TRENCH_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("host-bank"));
  assert.ok(FINGERPRINT_LINES.includes("guest-void"));
  assert.ok(FINGERPRINT_LINES.includes("einval"));
  assert.match(PHRASE, /score fosse or admit mounted/);
});

test("has-repro fingerprints encode the published Win10 22H2 window", () => {
  const result = handle(readData("fossed.json"));
  assert.equal(result.published.build, "19045.7725");
  assert.equal(result.published.desktopVersion, "1.49585.0.0");
  assert.equal(result.published.author, "djionut13");
  assert.equal(result.published.os, "Windows 10 Pro 22H2");
  assert.equal(result.published.cpu, "13th Gen Intel Core i5-1345U");
  assert.equal(result.published.hostHr, "0x0");
  assert.equal(result.published.guestMounted, "0/4");
  assert.equal(result.published.kb5124008, "not installed / not applicable");
  assert.ok(result.published.cumulativeKbs.includes("KB5122878"));
  assert.match(
    fingerprint(seedFossed()),
    /fossed\|host=hr0\|guest=0\/4\|mount=einval\|share=c\|cue=fossed/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Scapegoat", () => {
  const required = [
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "routed",
    "inherited",
    "cascade",
    "appanage",
    "afloat",
    "washed",
    "pontoon",
    "concordant",
    "concordat",
    "reaped",
    "revenant",
    "oubliette",
    "voided",
    "replevin",
    "cognate",
    "lemures",
    "escheat",
    "mortmain",
    "strowger",
    "mondegreen",
    "derby",
    "vizard",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("mounted trench flips fossed back when guest 4/4 and host hr=0x0", () => {
  const tape = {
    mounted: true,
    hostHonest: true,
    hostHr: "0x0",
    guestOk: true,
    guestMounted: "4/4",
    fossed: false,
    cue: "mounted",
  };
  assert.equal(scoreGate(tape).verdict, "mounted");
  tape.mounted = false;
  tape.fossed = true;
  tape.guestOk = false;
  tape.guestZero = true;
  tape.einval = true;
  tape.cue = "fossed";
  assert.equal(scoreGate(tape).verdict, "fossed");
  tape.mounted = true;
  tape.fossed = false;
  tape.guestZero = false;
  tape.einval = false;
  tape.guestOk = true;
  tape.cue = "mounted";
  assert.equal(scoreGate(tape).verdict, "mounted");
});

test("host bank, guest void, sandbox cue, and trench mark fosse after 0/4", () => {
  const idle = inspectHostBank({ hostHonest: true, hostHr: "0x0" });
  assert.equal(idle.stamp, "host-bank");
  const voided = inspectGuestVoid({
    guestZero: true,
    guestMounted: "0/4",
    einval: true,
    guestError: "Plan9 mount failed: invalid argument",
  });
  assert.equal(voided.stamp, "fossed");
  assert.equal(voided.einval, true);
  const helper = inspectSandboxCue({
    sandboxHelper: true,
    sandboxMessage: SANDBOX_HELPER,
  });
  assert.equal(helper.stamp, "fossed");
  const desk = readTrench({
    fossed: true,
    hostHonest: true,
    guestZero: true,
    einval: true,
  });
  assert.equal(desk.fossed, true);
  assert.equal(desk.mark, "fossed");
  const calm = readTrench({
    mounted: true,
    guestOk: true,
    fossed: false,
  });
  assert.equal(calm.fossed, false);
  assert.equal(calm.mark, "mounted");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 92984);
  assert.equal(COUSINS[1].issue, 92958);
  assert.equal(COUSINS[2].issue, 43290);
  assert.equal(COUSINS[4].issue, 44486);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("cartulary"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.ok(NOT_PRODUCTS.includes("appanage"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 93356);
  assert.equal(BACKUPS[1].issue, 93354);
  assert.equal(BACKUPS[5].issue, 93279);
  assert.equal(BACKUPS[11].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/fossed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "mounted");
  assert.equal(JSON.parse(seeded.stdout).verdict, "fossed");
});

test("handle exposes published hypothesis and #93358 headline", () => {
  const result = handle(readData("fossed.json"));
  assert.equal(result.published.issue, 93358);
  assert.equal(result.published.desktopVersion, "1.49585.0.0");
  assert.equal(result.published.author, "djionut13");
  assert.equal(result.published.build, "19045.7725");
  assert.deepEqual(result.published.cousins, [92984, 92958, 43290, 47570, 44486]);
  assert.ok(result.published.backups.includes(93356));
  assert.ok(result.published.backups.includes(93279));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /post-Sep vmcompute\/vmwp Plan9 option negotiation/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is an earthwork fosse, not a desert scapegoat altar", () => {
  const page = readPage();
  assert.match(page, /Source Serif 4/);
  assert.match(page, /Karla/);
  assert.match(page, /Roboto Mono/);
  assert.match(page, /fosse|earthwork|defensive-ditch|sod lip|chalk survey|iron spike|wet clay|guest void/i);
  assert.match(page, /#12100e|#3d3429|#d4cfc4|#6b6560|#2d4a3e/);
  assert.match(page, /mounted/);
  assert.match(page, /fossed/);
  assert.match(page, /plan9/);
  assert.match(page, /score fosse or admit mounted/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /00:50/);
  assert.match(page, /#273/);
  assert.match(page, /#93358/);
  assert.match(page, /djionut13/);
  assert.match(page, /19045\.7725/);
  assert.match(page, /1\.49585\.0\.0/);
  assert.match(page, /invalid argument/);
  assert.match(page, /hr=0x0|hr=0x0/);
  assert.match(page, /Cut the trench/);
  assert.match(page, /Score fosse/);
  assert.match(page, /Walk the bank/);
  assert.match(page, /Survey the shares/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /IBM Plex/);
  assert.doesNotMatch(page, /#2a241c/);
  assert.doesNotMatch(page, /#c4a35a/);
  assert.doesNotMatch(page, /#8b3a2a/);
  assert.doesNotMatch(page, /#1a1410/);
  assert.doesNotMatch(page, /ash altar|goat-bell|bone linen|grant-table|rust-blood/i);
  assert.doesNotMatch(page, /oak lectern|bound quires|inkhorn|register index/i);
  assert.doesNotMatch(page, /wax press|issuer ribbon|signature paraph|wax-seal crimson/i);
  assert.doesNotMatch(page, /séance|seance|process-tomb|graveyard|charcoal bone|cold violet/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|timber deck|salt fog|navigation lights/i);
  assert.doesNotMatch(page, /letters patent|heraldic|cadency|coronet/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bscapegoat\b/);
  assert.doesNotMatch(page, /\bcartulary\b/);
  assert.doesNotMatch(page, /\bparaph\b/);
  assert.doesNotMatch(page, /\bappanage\b/);
  assert.doesNotMatch(page, /\brouted\b/);
  assert.doesNotMatch(page, /\binherited\b/);
  assert.doesNotMatch(page, /\bcascade\b/);
  assert.doesNotMatch(page, /\bafloat\b/);
  assert.doesNotMatch(page, /\bwashed\b/);
  assert.doesNotMatch(page, /\bpontoon\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brevenant\b/);
  assert.doesNotMatch(page, /\bhonest\b/);
  assert.doesNotMatch(page, /\bscapegoated\b/);
  assert.doesNotMatch(page, /\bungranted\b/);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Cartulary/i);
  assert.match(page, /NOT Paraph/i);
  assert.match(page, /NOT Appanage/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Concordat/i);
  assert.match(page, /NOT Revenant/i);
  assert.match(page, /NOT Vernier/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Fosse/);
  assert.match(readme, /#93358/);
  assert.match(readme, /mounted/);
  assert.match(readme, /fossed/);
  assert.match(readme, /plan9/);
  assert.match(readme, /Source Serif 4/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Roboto Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Scapegoat/i);
  assert.match(readme, /NOT Cartulary/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /NOT Appanage/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Concordat/i);
  assert.match(readme, /NOT Revenant/i);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /KB5124008/);
  assert.match(readme, /19045\.7725/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/fosse/);
  assert.match(readme, /node --test projects\/fosse\/fosse\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /post-Sep vmcompute\/vmwp Plan9 option negotiation/);
  assert.match(readme, /#92984/);
  assert.match(readme, /#92958/);
  assert.match(readme, /#93356/);
  assert.match(readme, /earthwork \/ defensive-ditch/);
  assert.match(readme, /Win10 22H2 counterpart/);
});

test("catalog #273 features Fosse only; Scapegoat unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 273);
  assert.equal(catalog.products[0].name, "Fosse");
  assert.equal(catalog.products[0].slug, "fosse");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/fosse/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /00:50/);
  assert.match(catalog.products[0].summary, /fosse/);
  assert.match(catalog.products[0].summary, /#93358/);
  assert.match(catalog.products[0].summary, /mounted/);
  assert.match(catalog.products[0].summary, /fossed/);
  assert.match(catalog.products[0].summary, /plan9/);
  const scapegoat = catalog.products.find((row) => row.slug === "scapegoat");
  assert.ok(scapegoat);
  assert.equal(scapegoat.featured, false);
  const cartulary = catalog.products.find((row) => row.slug === "cartulary");
  assert.ok(cartulary);
  assert.equal(cartulary.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "fosse").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93358") && row.slug !== "fosse"));
});

test("vercel rewrites fosse to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/fosse");
  assert.equal(vercel.rewrites[0].destination, "/projects/fosse");
  assert.equal(vercel.rewrites[1].source, "/fosse/");
  assert.equal(vercel.rewrites[1].destination, "/projects/fosse");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
