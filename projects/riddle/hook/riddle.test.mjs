import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ALLOWLIST_DOMAINS,
  BANNED_NAMES,
  CHERRY_PICK,
  CHERRY_PICK_BRANCH,
  CHERRY_PICK_REF,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  DEVCONTAINERS_CLI,
  DOMAIN_BLOB,
  DOMAIN_MARKETPLACE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INIT_FIREWALL,
  IPSET_ADD,
  IPSET_ADD_EXIST,
  IPSET_ERROR,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  NPM_REGISTRY,
  PHRASE,
  PLATFORM,
  POSTSTART_EXIT,
  POSTSTART_LINE,
  POSTSTART_OK,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SET_EUO,
  SHARED_IP,
  SUDO_IPTABLES,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isJammed,
  isSifted,
  normalize,
  score,
  seedAllowlistCdnDomains,
  seedCousin,
  seedDuplicateIp,
  seedFirewallUnfinished,
  seedHold,
  seedIpsetWithoutExist,
  seedJammed,
  seedPoststartExit1,
  seedSetEAbort,
  seedSharedCdnIp,
  seedSifted,
} from "./riddle.mjs";

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
  return fileURLToPath(new URL("./riddle.mjs", import.meta.url));
}

test("ipset add -exist + postStart 0 + firewall finished → sifted", () => {
  const result = analyze({
    ipsetAddExist: true,
    duplicateIp: true,
    setEAbort: false,
    postStartExit: 0,
    firewallFinished: true,
    defaultDenyHolds: true,
    npmReachable: true,
    sudoIptablesDenied: true,
  });
  assert.equal(result.verdict, "sifted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.jammed, false);
  assert.equal(result.sifted, true);
  assert.equal(isSifted(result.ticket), true);
  assert.equal(isJammed(result.ticket), false);
});

test("two domains one IP + ipset without -exist + set -e + exit 1 → jammed", () => {
  const result = analyze({
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: 1,
    firewallFinished: false,
    ipsetWithoutExist: true,
    resolvedIp: "150.171.74.16",
    ipsetError: "ipset v7.17: Element cannot be added to the set: it's already added",
  });
  assert.equal(result.verdict, "jammed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.jammed, true);
  assert.equal(isJammed(result.ticket), true);
  assert.ok(result.chips.includes("jammed"));
  assert.ok(result.chips.includes("duplicate-ip"));
  assert.ok(result.chips.includes("set-e-abort"));
  assert.ok(result.chips.includes("poststart-exit-1"));
  assert.ok(!result.chips.includes("sifted"));
});

test("idle sifted is a hold; ipset add -exist accepts the duplicate", () => {
  const result = analyze(seedSifted());
  assert.equal(result.verdict, "sifted");
  assert.equal(result.idleWord, "sifted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.jammed, false);
  assert.equal(result.sifted, true);
  assert.ok(result.chips.includes("sifted"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("jammed"));
  assert.equal(result.ticket.ipsetAddExist, true);
  assert.equal(result.ticket.postStartExit, 0);
  assert.equal(result.ticket.firewallFinished, true);
  assert.match(result.contrast.frame, /clear/i);
  assert.doesNotMatch(
    result.idleWord,
    /jammed|stocked|aired|drained|hinged|pealed|warded|first-wins|seized|pooled/i,
  );
});

test("empty ticket and empty stdin classify sifted", () => {
  assert.equal(classify(emptyTicket()), "sifted");
  assert.equal(classify(""), "sifted");
  assert.equal(classify(null), "sifted");
  assert.equal(decideSeed("sifted").verdict, "sifted");
  assert.equal(decideSeed("cleared").verdict, "sifted");
});

test("seeded jammed #91327 is alarm with duplicate IP, set -e, exit 1", () => {
  const result = analyze(seedJammed());
  assert.equal(result.verdict, "jammed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.jammed, true);
  assert.ok(result.chips.includes("jammed"));
  assert.ok(result.chips.includes("duplicate-ip"));
  assert.ok(result.chips.includes("set-e-abort"));
  assert.ok(result.chips.includes("poststart-exit-1"));
  assert.ok(result.chips.includes("firewall-unfinished"));
  assert.ok(result.chips.includes("ipset-without-exist"));
  assert.ok(result.chips.includes("shared-cdn-ip"));
  assert.ok(result.chips.includes("allowlist-cdn-domains"));
  assert.ok(!result.chips.includes("sifted"));
  assert.match(result.contrast.frame, /jammed/i);
  assert.equal(result.ticket.resolvedIp, SHARED_IP);
  assert.equal(result.ticket.postStartExit, POSTSTART_EXIT);
  assert.equal(result.ticket.ipsetError, IPSET_ERROR);
});

test("data fixtures classify sifted vs jammed vs named chips", () => {
  assert.equal(classify(readData("sifted.json")), "sifted");
  assert.equal(classify(readData("jammed.json")), "jammed");
  assert.equal(classify(readData("91327.json")), "jammed");
  assert.equal(classify(readData("duplicate-ip.json")), "duplicate-ip");
  assert.equal(classify(readData("set-e-abort.json")), "set-e-abort");
  assert.equal(classify(readData("poststart-exit-1.json")), "poststart-exit-1");
  assert.equal(classify(readData("firewall-unfinished.json")), "firewall-unfinished");
  assert.equal(classify(readData("ipset-without-exist.json")), "ipset-without-exist");
  assert.equal(classify(readData("shared-cdn-ip.json")), "shared-cdn-ip");
  assert.equal(classify(readData("allowlist-cdn-domains.json")), "allowlist-cdn-domains");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("jammed seed is alarm; sifted / hold are holds", () => {
  assert.equal(score(seedJammed()).alarm, true);
  assert.equal(score(seedJammed()).hold, false);
  assert.equal(score(seedSifted()).hold, true);
  assert.equal(score(seedSifted()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedDuplicateIp()).alarm, true);
  assert.equal(score(seedSetEAbort()).alarm, true);
});

test("normalize seeds 91327 without ticket fields", () => {
  const ticket = normalize({ issue: 91327 });
  assert.equal(ticket.ipsetAddExist, false);
  assert.equal(ticket.duplicateIp, true);
  assert.equal(ticket.setEAbort, true);
  assert.equal(ticket.postStartExit, 1);
  assert.equal(ticket.firewallFinished, false);
  assert.equal(ticket.resolvedIp, SHARED_IP);
  assert.equal(classify(ticket), "jammed");
});

test("score / decide / handle agree on jammed vs sifted", () => {
  assert.equal(score(seedJammed()).verdict, "jammed");
  assert.equal(decide(seedSifted()).verdict, "sifted");
  const fail = handle(seedJammed());
  const hold = handle(seedSifted());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91327/);
  assert.match(hold.hookSpecificOutput.additionalContext, /sifted/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("jammed").verdict, "jammed");
  assert.equal(decideSeed(91327).verdict, "jammed");
  assert.equal(decideSeed("91327").verdict, "jammed");
  assert.equal(decideSeed("sifted").verdict, "sifted");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("duplicate-ip").verdict, "duplicate-ip");
  assert.equal(decideSeed("set-e-abort").verdict, "set-e-abort");
  assert.equal(decideSeed("ipset-without-exist").verdict, "ipset-without-exist");
});

test("CLI scores data files", () => {
  const jammed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91327.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(jammed.status, 0, jammed.stderr);
  assert.equal(JSON.parse(jammed.stdout).verdict, "jammed");
  assert.equal(JSON.parse(jammed.stdout).alarm, true);

  const sifted = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/sifted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sifted.status, 0, sifted.stderr);
  assert.equal(JSON.parse(sifted.stdout).verdict, "sifted");
  assert.equal(JSON.parse(sifted.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91327);
  assert.deepEqual([...PRIMARY_ISSUES], [91327]);
  assert.equal(COUSIN_ISSUE, 35197);
  assert.deepEqual([...COUSINS], [35197, 15611, 67130]);
  assert.equal(CROSS_ECOSYSTEM, "openai/codex#22471");
  assert.equal(FILED_AT, "2026-09-01T21:44:23Z");
  assert.equal(PLATFORM, "Windows 11");
  assert.equal(DEVCONTAINERS_CLI, "@devcontainers/cli");
  assert.equal(REPORTER, "pedro-silva-hub");
  assert.equal(SHARED_IP, "150.171.74.16");
  assert.equal(DOMAIN_MARKETPLACE, "marketplace.visualstudio.com");
  assert.equal(DOMAIN_BLOB, "vscode.blob.core.windows.net");
  assert.deepEqual([...ALLOWLIST_DOMAINS], [
    "marketplace.visualstudio.com",
    "vscode.blob.core.windows.net",
  ]);
  assert.equal(
    IPSET_ERROR,
    "ipset v7.17: Element cannot be added to the set: it's already added",
  );
  assert.equal(IPSET_ADD, 'ipset add allowed-domains "$ip"');
  assert.equal(IPSET_ADD_EXIST, 'ipset add -exist allowed-domains "$ip"');
  assert.equal(SET_EUO, "set -euo pipefail");
  assert.equal(POSTSTART_EXIT, 1);
  assert.equal(POSTSTART_OK, 0);
  assert.equal(
    POSTSTART_LINE,
    "postStartCommand from devcontainer.json failed with exit code 1.",
  );
  assert.equal(INIT_FIREWALL, "/usr/local/bin/init-firewall.sh");
  assert.equal(CHERRY_PICK, "001c048d6eba062d8bbf7f7e2d538f00e833e28b");
  assert.equal(
    CHERRY_PICK_REF,
    "pedro-silva-hub/claude-code@001c048d6eba062d8bbf7f7e2d538f00e833e28b",
  );
  assert.equal(CHERRY_PICK_BRANCH, "fix/devcontainer-ipset-exist");
  assert.equal(NPM_REGISTRY, "registry.npmjs.org");
  assert.equal(SUDO_IPTABLES, "sudo -n iptables");
  assert.equal(IDLE_WORD, "sifted");
  assert.equal(SEEDED_WORD, "jammed");
  assert.notEqual(IDLE_WORD, "jammed");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.notEqual(IDLE_WORD, "aired");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "first-wins");
  assert.notEqual(IDLE_WORD, "seized");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.deepEqual([...HOLD_VERDICTS], ["sifted", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("jammed"));
  assert.ok(ALARM_VERDICTS.includes("duplicate-ip"));
  assert.ok(!ALARM_VERDICTS.includes("sifted"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 10);
  assert.deepEqual([...LABELS], ["bug", "has repro", "area:sandbox"]);
  assert.match(TITLE, /init-firewall\.sh aborts on boot/);
  assert.match(ISSUE_URL, /91327/);
  assert.match(PHRASE, /jams on a duplicate pour/i);
  assert.match(HUB_LINE, /07:50 riddle/);
  assert.match(HUB_LINE, /admit sifted/);
  assert.match(MARK, /07:50/);
  assert.match(MARK, /#108/);
  assert.match(MARK, /#91327/);
  assert.match(CONTRAST_NOTE, /DEVCONTAINER FIREWALL INIT ABORTS/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("garner"));
  assert.ok(NOT_PRODUCTS.includes("pintle"));
  assert.ok(NOT_PRODUCTS.includes("carillon"));
  assert.ok(BANNED_NAMES.includes("Sieve"));
  assert.ok(BANNED_NAMES.includes("Garner"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "sifted");
  assert.equal(chips.seededWord, "jammed");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91327);
  assert.equal(fp.cousin, 35197);
  assert.deepEqual(fp.cousins, [35197, 15611, 67130]);
  assert.equal(fp.sharedIp, "150.171.74.16");
  assert.equal(fp.domainMarketplace, "marketplace.visualstudio.com");
  assert.equal(fp.domainBlob, "vscode.blob.core.windows.net");
  assert.equal(
    fp.ipsetError,
    "ipset v7.17: Element cannot be added to the set: it's already added",
  );
  assert.equal(fp.postStartExit, 1);
  assert.equal(fp.reporter, "pedro-silva-hub");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "jammed");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.duplicateIpsetAbort, true);
});

test("chipsOf on a raw duplicate-ip ticket still marks jammed", () => {
  const chips = chipsOf({
    ipsetAddExist: false,
    duplicateIp: true,
    setEAbort: true,
    postStartExit: 1,
    firewallFinished: false,
    ipsetWithoutExist: true,
    resolvedIp: "150.171.74.16",
    outputText:
      "jammed; two domains → one IP; ipset add without -exist; set -e abort",
  });
  assert.ok(chips.includes("jammed"));
  assert.ok(chips.includes("duplicate-ip"));
  assert.ok(chips.includes("set-e-abort"));
  assert.ok(chips.includes("ipset-without-exist"));
  assert.ok(!chips.includes("sifted"));
});

test("cousin #35197 is not conflated with jammed primary", () => {
  assert.notEqual(classify(seedCousin()), "jammed");
  assert.notEqual(classify({ issue: 35197 }), "jammed");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /35197|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become jammed", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "jammed", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91327);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedDuplicateIp()).verdict, "duplicate-ip");
  assert.equal(analyze(seedSetEAbort()).verdict, "set-e-abort");
  assert.equal(analyze(seedPoststartExit1()).verdict, "poststart-exit-1");
  assert.equal(analyze(seedFirewallUnfinished()).verdict, "firewall-unfinished");
  assert.equal(analyze(seedIpsetWithoutExist()).verdict, "ipset-without-exist");
  assert.equal(analyze(seedSharedCdnIp()).verdict, "shared-cdn-ip");
  assert.equal(analyze(seedAllowlistCdnDomains()).verdict, "allowlist-cdn-domains");
  assert.equal(analyze(seedHold()).ticket.postStartExit, 0);
  assert.equal(isJammed(seedSifted()), false);
  assert.equal(isJammed(seedJammed()), true);
});

test("living page is a Riddle mesh, idle sifted, seeded jammed", () => {
  const html = readPage();
  assert.match(html, /<title>Riddle/);
  assert.match(html, /Idle word:\s*sifted/);
  assert.match(html, /sifted/);
  assert.match(html, /jammed/);
  assert.match(html, /duplicate-ip/);
  assert.match(html, /set-e-abort/);
  assert.match(html, /poststart-exit-1/);
  assert.match(html, /firewall-unfinished/);
  assert.match(html, /ipset-without-exist/);
  assert.match(html, /shared-cdn-ip/);
  assert.match(html, /allowlist-cdn-domains/);
  assert.match(html, /#91327/);
  assert.match(html, /#35197/);
  assert.match(html, /#15611/);
  assert.match(html, /#67130/);
  assert.match(html, /22471/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /07:50/);
  assert.match(html, /catalog #108/);
  assert.match(html, /150\.171\.74\.16/);
  assert.match(html, /marketplace\.visualstudio\.com/);
  assert.match(html, /vscode\.blob\.core\.windows\.net/);
  assert.match(html, /family=Newsreader/);
  assert.match(html, /family=Public\+Sans|Public Sans/);
  assert.match(html, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.match(html, /Score the mesh/);
  assert.match(html, /Pin idle sifted/);
  assert.match(html, /Pin seeded jammed/);
  assert.match(html, /Admit sifted/);
  assert.match(html, /oak frame|copper rivet|coal strap|wire mesh|ore grit/i);
  assert.match(html, /DEVCONTAINER FIREWALL INIT ABORTS/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /Docker Desktop/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*jammed/i);
  assert.doesNotMatch(html, /Idle word:\s*stocked/i);
  assert.doesNotMatch(html, /Idle word:\s*aired/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*hinged/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*first-wins/i);
  assert.doesNotMatch(html, /Idle word:\s*seized/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Pin idle jammed/);
  assert.doesNotMatch(html, /Pin idle stocked/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Riddle, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Riddle/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /DEVCONTAINER FIREWALL INIT ABORTS WHEN TWO ALLOWLISTED DOMAINS SHARE ONE IP/,
  );
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /Product name stays \*\*Riddle\*\*/);
  assert.match(readme, /Idle word: \*\*sifted\*\*/);
  assert.match(readme, /#35197/);
  assert.match(readme, /#15611/);
  assert.match(readme, /#67130/);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
});
