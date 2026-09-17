import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  CODE_BUILD_OK,
  CODE_BUILD_STILL,
  COMMAND,
  COUSINS,
  EFFACE_WALK,
  DISTRIBUTION,
  EVIDENCE_ROWS,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  ROW_KINDS,
  RULED_OUT,
  SAMPLE_ABSENT_PROOF,
  SEEDED_WORD,
  SETTINGS_KEY,
  STATE,
  SURFACE,
  TERM,
  TERMINAL,
  TITLE,
  TUI_MODE,
  VERDICTS,
  WORKAROUND,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAbsent,
  inspectInjectHostsMark,
  inspectDenyReadMark,
  inspectDenyRead,
  inspectCredentialsFiles,
  inspectCredentialsFilesMark,
  inspectHostsYml,
  inspectHostsYmlMark,
  inspectTlsTerminate,
  inspectGhAuth,
  inspectGhAuthMark,
  inspectEnoent,
  mapEfface,
  observeMaskVoid,
  readBooth,
  score,
  scoreGate,
  scoreMaskVoid,
  scoreWalk,
  seedAbsent,
  seedInjectHosts,
  seedMasked,
  seedCredentialsFiles,
  seedHostsYml,
  seedPresent,
  seedMaskVoid,
  seedSentinel,
  seedProduct,
  seedHoused,
} from "./efface.mjs";

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
  return fileURLToPath(new URL("./efface.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "06:50 efface: a credential-vault / redaction / mask-credential-files booth for #95135. Sandbox credentials.files mask should leave a sentinel ~/.config/gh/hosts.yml (oauth_token scrubbed) but the file is effaced entirely — ENOENT inside sandbox; gh auth status not logged in. Idle sentinel / seeded absent / path mask-void. Score efface or admit sentinel.";

test("idle sentinel is a hold; click seats in the efface and the session opens", () => {
  const result = analyze(seedSentinel());
  assert.equal(result.verdict, "sentinel");
  assert.equal(result.idleWord, "sentinel");
  assert.equal(IDLE_WORD, "sentinel");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sentinel, true);
  assert.equal(result.phrase, "admit sentinel");
  assert.equal(result.absent, false);
  assert.equal(result.maskVoid, false);
  assert.ok(HOLD_ALIASES.includes("masked"));
  assert.ok(HOLD_ALIASES.includes("present"));
  assert.ok(HOLD_ALIASES.includes("housed"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "seated");
  assert.notEqual(IDLE_WORD, "ascribed");
  assert.notEqual(IDLE_WORD, "moored");
  assert.notEqual(IDLE_WORD, "buoyed");
  assert.notEqual(IDLE_WORD, "mended");
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "pledged");
});

test("empty ticket and empty stdin classify sentinel", () => {
  assert.equal(classify(emptyTicket()), "sentinel");
  assert.equal(classify(""), "sentinel");
  assert.equal(classify(null), "sentinel");
  assert.equal(decide({}), "sentinel");
});

test("#95135 seeded path scores absent when the pin never seats", () => {
  const result = analyze(seedAbsent());
  assert.equal(result.verdict, "absent");
  assert.equal(result.seededWord, "absent");
  assert.equal(SEEDED_WORD, "absent");
  assert.equal(PRODUCT_WORD, "efface");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.absent, true);
  assert.equal(result.phrase, "score efface");
  assert.equal(result.maskVoid, true);
  assert.equal(result.credentialsFiles, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "miscast");
  assert.notEqual(SEEDED_WORD, "slipped");
  assert.notEqual(SEEDED_WORD, "freshet");
  assert.notEqual(PATH_WORD, "advisor-shadow");
  assert.notEqual(PATH_WORD, "iface-swap");
  assert.notEqual(PATH_WORD, "ptmx-race");
});

test("educational mask-void helpers encode published sentinel vs absent paths", () => {
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(CODE_BUILD_OK, "2.1.270");
  assert.equal(CODE_BUILD_STILL, "2.1.270");
  assert.equal(TERMINAL, "Linux remote/EC2");
  assert.equal(TERM, "gh-2.100.0");
  assert.equal(TUI_MODE, "native-sandbox");
  assert.equal(SETTINGS_KEY, "credentials.files");
  assert.equal(COMMAND, "read ~/.config/gh/hosts.yml");
  assert.equal(WORKAROUND, "escalate gh/git over unsandboxed path");
  assert.deepEqual([...ROW_KINDS], [
    "credentials.files mask rule",
    "~/.config/gh/hosts.yml path",
    "expected sentinel copy",
    "actual ENOENT in sandbox",
  ]);
  const wet = observeMaskVoid({ clickLanded: true, selectionOpened: false });
  assert.equal(wet.dead, true);
  const shut = observeMaskVoid({ sentinel: true });
  assert.equal(shut.dead, false);
  const hit = inspectCredentialsFiles({});
  assert.equal(hit.missed, true);
  const held = inspectCredentialsFiles({ sentinel: true });
  assert.equal(held.missed, false);
  const hover = inspectHostsYml({});
  assert.equal(hover.missed, true);
  const clean = inspectHostsYml({ sentinel: true });
  assert.equal(clean.missed, false);
  const deaf = inspectAbsent({});
  assert.equal(deaf.deaf, true);
  const keys = inspectTlsTerminate({});
  assert.equal(keys.stillWorks, true);
  const full = inspectDenyRead({});
  assert.equal(full.flagged, true);
  const row = inspectGhAuth({});
  assert.equal(row.flagged, true);
  const dispatch = inspectEnoent({});
  assert.equal(dispatch.flagged, true);
  const scored = scoreMaskVoid({
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
  });
  assert.equal(scored.absent, true);
  assert.equal(scored.maskVoid, true);
  const intactPath = scoreMaskVoid({ sentinel: true });
  assert.equal(intactPath.absent, false);
  assert.equal(intactPath.sentinel, true);
});

test("inspectors mark credentials-files and hosts-yml", () => {
  const hit = inspectCredentialsFilesMark({ absent: true, credentialsFiles: true });
  assert.equal(hit.stamp, "credentials-files");
  assert.equal(hit.flagged, true);
  const hover = inspectHostsYmlMark({ absent: true, hostsYml: true });
  assert.equal(hover.stamp, "hosts-yml");
  assert.equal(hover.missed, true);
  const scored = scoreGate({
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
    cue: "absent",
  });
  assert.equal(scored.verdict, "absent");
  const open = inspectCredentialsFilesMark({ sentinel: true, absent: false });
  assert.equal(open.stamp, "masked");
});

test("path word is mask-void; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "mask-void");
  const result = analyze(seedMaskVoid());
  assert.equal(result.verdict, "mask-void");
  assert.equal(result.pathWord, "mask-void");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "mask-void",
      preferSeed: true,
      absent: true,
    }),
    "mask-void",
  );
  assert.equal(classify({ seed: "credentials-files", preferSeed: true }), "credentials-files");
  assert.equal(score(seedMaskVoid()), "efface");
});

test("HOLD includes sentinel; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("sentinel"));
  const graftedSkill = analyze(seedMasked());
  assert.equal(graftedSkill.verdict, "masked");
  assert.equal(classify({ seed: "present", preferSeed: true }), "present");
  assert.equal(classify({ seed: "housed", preferSeed: true }), "housed");
});

test("alarm chips: credentials-files, hosts-yml, absent", () => {
  assert.equal(classify({ seed: "credentials-files", preferSeed: true }), "credentials-files");
  assert.equal(classify(seedMaskVoid()), "mask-void");
  assert.equal(classify(seedProduct()), "absent");
  assert.equal(classify(seedHostsYml()), "hosts-yml");
  assert.equal(classify({ seed: "inject-hosts", preferSeed: true }), "inject-hosts");
});

test("booth fixtures flip sentinel vs absent vs mask-void", () => {
  const idle = scoreGate(seedSentinel());
  const seeded = scoreGate(seedAbsent());
  const sentinel = readData("sentinel.json");
  const deaf = readData("absent.json");
  const issued = readData("95135.json");
  const path = readData("mask-void.json");
  assert.equal(idle.verdict, "sentinel");
  assert.equal(seeded.verdict, "absent");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSentinel()), "sentinel");
  assert.equal(score(seedAbsent()), "efface");
  assert.equal(score({ seed: "mask-void", preferSeed: true }), "efface");
  assert.equal(sentinel.maskVoid, false);
  assert.equal(sentinel.sentinel, true);
  assert.equal(scoreGate(sentinel).verdict, "sentinel");
  assert.equal(deaf.maskVoid, true);
  assert.equal(deaf.credentialsFiles, true);
  assert.equal(classify(deaf), "absent");
  assert.equal(issued.issue, 95135);
  assert.equal(classify(issued), "absent");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /sentinel|masked|present|housed/i);
  assert.match(path.paths[1].result, /mask-void|credentials-files|hosts-yml|inject-hosts|absent/i);
  assert.equal(classify(path), "mask-void");
  assert.equal(deaf.hubCount, "ABSENT");
  assert.equal(deaf.issue, 95135);
  assert.equal(deaf.absent, true);
  assert.equal(classify(readData("masked.json")), "masked");
  assert.equal(classify(readData("present.json")), "present");
  assert.equal(classify(readData("housed.json")), "housed");
  assert.equal(classify(readData("credentials-files.json")), "credentials-files");
  assert.equal(classify(readData("hosts-yml.json")), "hosts-yml");
  assert.equal(classify(readData("inject-hosts.json")), "inject-hosts");
  assert.equal(classify(readData("deny-read.json")), "deny-read");
  assert.equal(classify(readData("gh-auth.json")), "gh-auth");
  assert.equal(classify(readData("tls-terminate.json")), "tls-terminate");
  assert.equal(classify(readData("enoent.json")), "enoent");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, []);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("subagent-spawn.json")), "credentials-files");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("sentinel"));
  assert.ok(CHIPS.includes("absent"));
  assert.ok(CHIPS.includes("mask-void"));
  assert.ok(CHIPS.includes("credentials-files"));
  assert.ok(CHIPS.includes("hosts-yml"));
  assert.ok(CHIPS.includes("inject-hosts"));
  assert.ok(CHIPS.includes("housed"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("absent"));
  assert.ok(ALARM.includes("mask-void"));
  assert.ok(ALARM.includes("credentials-files"));
  assert.ok(ALARM.includes("hosts-yml"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published efface walk scores absent after the sentinel hold", () => {
  const booth = scoreWalk({ rows: EFFACE_WALK });
  assert.equal(booth.verdict, "absent");
  assert.ok(booth.absentCount >= 1);
  const idle = booth.rows.find((row) => row.event === "atelier-bench");
  assert.equal(idle.sentinel, true);
  assert.equal(idle.verdict, "sentinel");
  const cut = booth.rows.find((row) => row.event === "mask-void");
  assert.equal(cut.maskVoid, true);
  const path = booth.rows.find(
    (row) => row.event === "mask-void" && row.t === "path",
  );
  assert.equal(path.verdict, "mask-void");
});

test("EFFACE_WALK constant matches the issue core walk", () => {
  assert.equal(EFFACE_WALK[0].event, "atelier-bench");
  const cut = EFFACE_WALK.find((row) => row.event === "mask-void");
  assert.equal(cut.maskVoid || cut.credentialsFiles, true);
  const path = EFFACE_WALK.find((row) => row.t === "path");
  assert.equal(path.absent, true);
  const scoreRow = EFFACE_WALK.find((row) => row.event === "absent");
  assert.equal(scoreRow.absent, true);
  assert.equal(scoreRow.credentialsFiles, true);
});

test("positive control atelier-bench stays sentinel", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "sentinel");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "sentinel");
  const hold = walk.rows.find((row) => row.event === "atelier-bench");
  assert.equal(hold.sentinel, true);
  assert.equal(hold.verdict, "sentinel");
});

test("issue constants encode only #95135 published facts", () => {
  assert.equal(FEATURED_ISSUE, 95135);
  assert.ok(ISSUE_URL.includes("95135"));
  assert.match(TITLE, /credentials|hosts\.yml|mask|ENOENT/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.270|EC2|gh 2\.100/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "mask-void");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:sandbox"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(EVIDENCE_ROWS[0].lane, "credentials.files mask rule");
  assert.equal(EVIDENCE_ROWS[1].lane, "~/.config/gh/hosts.yml path");
  assert.equal(EVIDENCE_ROWS[2].lane, "expected sentinel copy");
  assert.equal(EVIDENCE_ROWS[3].lane, "actual ENOENT in sandbox");
  assert.ok(RULED_OUT.some((row) => /Apocope|#95127/i.test(row)) || RULED_OUT.some((row) => /Precis|#94564/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Dictabelt|verbatim/i.test(row)));
  assert.ok(EXPECTED.some((row) => /sentinel|hosts\.yml|mask/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /2\.1\.270|credentials\.files|hosts\.yml|ENOENT|oauth_token|api\.github\.com/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("mask-void"));
  assert.ok(FINGERPRINT_LINES.includes("efface"));
  assert.equal(PHRASE, "Score efface or admit sentinel.");
  assert.equal(SAMPLE_ABSENT_PROOF.maskVoid, true);
  assert.equal(SAMPLE_ABSENT_PROOF.names.length, 6);
  assert.equal(seedHoused().seed, "housed");
  assert.equal(seedPresent().seed, "present");
  assert.equal(seedCredentialsFiles().seed, "credentials-files");
  assert.equal(seedHostsYml().seed, "hosts-yml");
  assert.equal(seedInjectHosts().seed, "inject-hosts");
});

test("has-repro fingerprints encode the published efface proof", () => {
  const result = handle(seedAbsent());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "mask-void");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedAbsent()),
    /absent\|kind=mask-void\|ref=credentials-files\|path=mask-void\|cue=mask-void/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and seated/ascribed/moored", () => {
  const required = [
    "ascribed",
    "seated",
    "moored",
    "lashed",
    "warped",
    "fendered",
    "slipped",
    "iface-swap",
    "buoyed",
    "mended",
    "homed",
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "single",
    "pledged",
    "brisk",
    "cadence",
    "released",
    "lit",
    "primed",
    "raised",
    "preserved",
    "tokenized",
    "blazoned",
    "tabard",
    "freshet",
    "kintsugi",
    "cenotaph",
    "stratum",
    "tmesis",
    "vedette",
    "orloj",
    "brisure",
    "diptych",
    "vizard",
    "treacle",
    "init-flood",
    "heal-abort",
    "dead-install",
    "layer-unsealed",
    "mid-inject",
    "idle-exit",
    "half-life",
    "fork-resume",
    "brief-echo",
    "background-reset",
    "advisor-shadow",
    "ptmx-race",
    "ungloved",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("sentinel booth flips absent back when the ratchet admits sentinel", () => {
  const tape = {
    sentinel: true,
    absent: false,
    maskVoid: false,
    cue: "sentinel",
  };
  assert.equal(scoreGate(tape).verdict, "sentinel");
  tape.sentinel = false;
  tape.absent = true;
  tape.maskVoid = true;
  tape.cue = "absent";
  assert.equal(scoreGate(tape).verdict, "absent");
  tape.sentinel = true;
  tape.absent = false;
  tape.maskVoid = false;
  tape.cue = "sentinel";
  assert.equal(scoreGate(tape).verdict, "sentinel");
});

test("inspectors and readBooth mark the absent proof", () => {
  const hit = inspectCredentialsFilesMark({ absent: true });
  assert.equal(hit.stamp, "credentials-files");
  const hover = inspectHostsYmlMark({ absent: true, hostsYml: true });
  assert.equal(hover.stamp, "hosts-yml");
  assert.equal(hover.missed, true);
  const booth = readBooth({
    absent: true,
    maskVoid: true,
    credentialsFiles: true,
  });
  assert.equal(booth.absent, true);
  assert.equal(booth.mark, "absent");
  const open = readBooth({
    sentinel: true,
    absent: false,
    maskVoid: false,
  });
  assert.equal(open.absent, false);
  assert.equal(open.mark, "sentinel");
  assert.equal(inspectInjectHostsMark({ absent: true, injectHosts: true }).stamp, "inject-hosts");
  assert.equal(inspectDenyReadMark({ absent: true, denyRead: true }).stamp, "deny-read");
  assert.equal(inspectGhAuthMark({ absent: true, ghAuth: true }).stamp, "gh-auth");
});

test("mapEfface encodes the published mask-void", () => {
  const miss = mapEfface({ absent: true, maskVoid: true });
  assert.equal(miss.stamp, "mask-void");
  assert.equal(miss.holdingLane, "absent");
  assert.equal(miss.ribbon, "absent");
  const clear = mapEfface({ sentinel: true, absent: false });
  assert.equal(clear.stamp, "atelier-bench");
  assert.equal(clear.kindLane, "ratchet-wheel");
  assert.equal(clear.holdingLane, "atelier-bench");
});

test("cousins stay empty; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(NOT_PRODUCTS.includes("prosopon"));
  assert.ok(NOT_PRODUCTS.includes("slipway"));
  assert.ok(NOT_PRODUCTS.includes("freshet"));
  assert.ok(NOT_PRODUCTS.includes("kintsugi"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 94553);
  assert.equal(BACKUPS[5].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 95135));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/absent.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const reknitFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sentinel.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(reknitFix.status, 0, reknitFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const reknitOut = JSON.parse(reknitFix.stdout);
  assert.equal(idleOut.verdict, "sentinel");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "absent");
  assert.equal(seededOut.alarm, true);
  assert.equal(reknitOut.verdict, "sentinel");
  assert.equal(reknitOut.hold, true);
  assert.match(reknitOut.phrase, /admit sentinel/);
});

test("handle exposes published hypothesis and #95135 headline", () => {
  const result = handle(seedAbsent());
  assert.equal(result.published.issue, 95135);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(94553));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(95135));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /credentials|hosts\.yml|mask|ENOENT|NON-BINDING|#95135/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#95135/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 4);
});

test("model has no static node: imports so the sentinel page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("sentinel page is a credential vault redaction booth, not precis or apocope", () => {
  const page = readPage();
  assert.match(page, /Libre\+Baskerville|Libre Baskerville/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /efface|sentinel|absent|mask-void|vault-drawer|redaction-slit|sentinel-shelf|mask-void-gap/i,
  );
  assert.match(page, /#2a2d32|#e8e2d6|#a34b32|#2a6b6b|#f5efe3|#1c1f24/i);
  assert.match(page, /\bsentinel\b/);
  assert.match(page, /absent/);
  assert.match(page, /mask-void/);
  assert.match(page, /Score efface or admit sentinel/i);
  assert.match(page, /#391/);
  assert.match(page, /#95135/);
  assert.match(page, /Admit sentinel/);
  assert.match(page, /Score efface/);
  assert.match(page, /Walk mask-void/);
  assert.match(page, /Compare sentinel \/ absent/);
  assert.match(page, /Pin idle sentinel/);
  assert.match(page, /Pin seeded absent/);
  assert.match(page, /Pin mask-void/);
  assert.match(page, /Stamp credentials-files/);
  assert.match(page, /Score booth/);
  assert.match(page, /efface-score/);
  assert.match(
    page,
    /credentials\.files|hosts\.yml|ENOENT|oauth_token|gh auth|api\.github\.com/i,
  );
  assert.match(page, /vault-drawer|redaction-slit|sentinel-shelf|mask-void-gap/i);
  assert.match(
    page,
    /<svg[\s\S]*class="vault-drawer"|class="redaction-slit"|class="sentinel-shelf"|class="mask-void-gap"/i,
  );
  assert.match(page, /body\.sentinel|body\.absent|body\.mask-void/);
  assert.match(page, /evidence-table|credentials\.files mask|hosts\.yml path|ENOENT in sandbox/i);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Plus Jakarta|Plus\+Jakarta/);
  assert.match(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.match(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#0B0A0F|#C4A574|#3F5E3A|#E2B457|#6B1E2A|#E8E0D4/);
  assert.doesNotMatch(page, /#06141F|#A34428|#EFA31A|#B7C2CC|#1E5346|#0C1C22/);
  assert.doesNotMatch(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/);
  assert.doesNotMatch(page, /#1F2328|#8A9199|#8B1E2D|#E8E0D0|#B8953A|#2C3138/);
  assert.doesNotMatch(page, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque/i);
  assert.doesNotMatch(page, /urushi|gold seam|cracked bowl|kiln-mouth|repair bench/i);
  assert.doesNotMatch(page, /vacant sarcophagus|Portland-stone|memorial yard/i);
  assert.doesNotMatch(page, /keel-cradle|sodium-lamp|eth-dock|wifi-fairway|undock-cut|bg-idle-hull/i);
  assert.doesNotMatch(page, /clay-mask|olive-wreath|marble-plinth|night amphitheatre/i);
  assert.doesNotMatch(page, /admit ascribed|Score prosopon|idle ascribed/i);
  assert.doesNotMatch(page, /admit moored|Score slipway|idle moored/i);
  assert.doesNotMatch(page, /admit seated|Score cathead|idle seated/i);
  assert.doesNotMatch(page, /\bprosopon\b/);
  assert.doesNotMatch(page, /\bslipway\b/);
  assert.doesNotMatch(page, /\bfreshet\b/);
  assert.doesNotMatch(page, /\bkintsugi\b/);
  assert.doesNotMatch(page, /\bcenotaph\b/);
  assert.doesNotMatch(page, /\bstratum\b/);
  assert.doesNotMatch(page, /\btmesis\b/);
  assert.doesNotMatch(page, /\bvedette\b/);
  assert.doesNotMatch(page, /\borloj\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\bbrisure\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\bcathead\b/);
  assert.doesNotMatch(page, /advisor-shadow/);
  assert.doesNotMatch(page, /iface-swap/);
  assert.doesNotMatch(page, /init-flood/);
  assert.doesNotMatch(page, /heal-abort/);
  assert.doesNotMatch(page, /ptmx-race/);
  assert.doesNotMatch(page, /tabard|blazon|herald/i);
  assert.match(page, /NOT Apocope/i);
  assert.match(page, /NOT Precis/i);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Efface/);
  assert.match(readme, /#95135/);
  assert.match(readme, /\bsentinel\b/);
  assert.match(readme, /absent/);
  assert.match(readme, /mask-void/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Cormorant/);
  assert.doesNotMatch(readme, /Plus Jakarta/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /credentials\.files|hosts\.yml|ENOENT|mask-void/i);
  assert.match(readme, /NOT Apocope/);
  assert.match(readme, /NOT Precis/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/efface/);
  assert.match(readme, /node --test projects\/efface\/efface\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /credential-vault|redaction|mask-credential-files/i);
  assert.match(readme, /Score efface or admit sentinel/);
  assert.match(readme, /#94553|#94151|#94560/);
  assert.doesNotMatch(readme, /backup #95135 as next/i);
  assert.match(readme, /06:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-18 — Efface/);
  assert.match(runLog, /06:50/);
});

test("catalog features Efface only; Apocope and Precis unfeatured; product count 391", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 391);
  assert.equal(hub.products.length, 391);
  assert.equal(catalog.products[0].name, "Efface");
  assert.equal(catalog.products[0].slug, "efface");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/efface/");
  assert.equal(catalog.products[0].day, "2026-09-18");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bsentinel\b/);
  assert.match(catalog.products[0].summary, /absent/);
  assert.match(catalog.products[0].summary, /mask-void/);
  assert.match(catalog.products[0].summary, /Score efface or admit sentinel/);
  assert.match(catalog.products[0].summary, /#95135/);
  assert.match(catalog.products[0].summary, /06:50/);
  assert.equal(hub.products[0].slug, "efface");
  assert.equal(hub.products[0].featured, true);
  const apocope = catalog.products.find((row) => row.slug === "apocope");
  if (apocope) assert.equal(apocope.featured, false);
  const precis = catalog.products.find((row) => row.slug === "precis");
  assert.ok(precis);
  assert.equal(precis.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "efface" && row.featured).length,
    1,
  );
  const prosopon = catalog.products.find((row) => row.slug === "prosopon");
  assert.ok(prosopon);
  assert.equal(prosopon.featured, false);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("95135") && row.slug !== "efface",
    ),
  );
});

test("vercel rewrites efface to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/efface");
  assert.equal(vercel.rewrites[0].destination, "/projects/efface");
  assert.equal(vercel.rewrites[1].source, "/efface/");
  assert.equal(vercel.rewrites[1].destination, "/projects/efface");
  assert.equal(vercel.rewrites[2].source, "/efface/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/efface/:path*");
  const prosopon = vercel.rewrites.find((row) => row.source === "/prosopon");
  assert.ok(prosopon);
  assert.equal(prosopon.destination, "/projects/prosopon");
});

test("no leftover clone / theatre / dry-dock / masque content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque|copper-kettle|treacle-well|vacant sarcophagus|cracked-bowl|urushi-pot|kiln-mouth|gold-seam|hemp-rope winch|bollard-post|gangway-plank|keel-cradle|sodium-lamp|clay-mask|olive-wreath|marble-plinth/i);
  }
  assert.doesNotMatch(source, /staff gauge overtopped|floodplain plaque|urushi pot|cracked bowl|vacant sarcophagus|keel cradle|clay mask/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
