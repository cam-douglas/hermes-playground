/**
 * Wraith — afterimage / deleted-inode desk for Claude Code
 * auto-updater that replaces the running version's on-disk binary
 * while a session is still live. The process keeps executing the
 * deleted image. On macOS, TCC validates against the running
 * binary's code signature; once the image is gone, every access
 * to a TCC-protected folder returns EPERM mid-session, with no
 * warning, while System Settings still shows the folder grants
 * toggled ON. A grant that is still ON is not a hold.
 * Score the image or admit unlinked.
 *
 * The updater unlinks the binary under a live agent session.
 * The process becomes a ghost of a deleted image. Grants stay
 * lit. Spawns and remote-control still look healthy. Reads and
 * child execs silently die. The only reliable fix is restart.
 *
 * Verdicts: unlinked | pruned | ghosted | voided | orphaned
 *           | severed | stale | resurfaced | ejected | held
 * Idle word is unlinked (image seated, or the desk is idle).
 * NEVER use the product name wraith as the idle/state word.
 * NEVER use empty.
 * NEVER reuse Gasket tight, Damper banked, Cote roosted,
 * Larder stocked, Tappet seated, Aside heard, Chute clear,
 * Tain paired, Husk kernel, Snib latched, Veto upheld,
 * Assay sterling, Wicket home, Sigil valid, Stencil dry,
 * Suture sealed, Livery seised. Livery must not ship.
 *
 * Slack alarm on pruned / ghosted / voided / orphaned / severed.
 * Linear incident on pruned / orphaned / severed.
 * GitHub wraith-ledger issue on every scored probe.
 *
 * Why this is not a clone:
 * NOT Gasket (project-scoped sandbox.network.strictAllowlist
 * silently discarded). Grants exist and stay enabled.
 * NOT Damper (Remote Control auto-enable without consent).
 * #70071 is post-update capability death while still "connected".
 * NOT Cote / Nixie (--resume team-hub identity split).
 * NOT Snib (Trusted Devices fail-open). This is fail-closed
 * mid-session with grants still true.
 * NOT Knock (permission-grant stalls). No prompt can fire.
 * NOT Hasp (file-lease contention).
 * NOT Husk (hollow API success envelopes). Hollow process
 * image after unlink.
 * NOT Parity (claim-vs-reality of a single tool result).
 * Systemic post-update ghost state.
 * NOT Tain (Chrome path pin #88726 is adjacent corroboration).
 * NOT Livery / disclaimer-spawn / seisin: that was the first
 * read of #90373. The reporter corrected it to live-image unlink.
 * Do not ship Livery.
 * Different problem: updater deletes the running image under a
 * live session. A grant that is still ON is not a hold.
 * Different UI: cold glass, afterimage, deleted-inode ledger,
 * version tombstone.
 * Different idle word: unlinked.
 */

export const VERDICTS = Object.freeze([
  "unlinked",
  "pruned",
  "ghosted",
  "voided",
  "orphaned",
  "severed",
  "stale",
  "resurfaced",
  "ejected",
  "held",
]);
export const IDLE_WORD = "unlinked";
export const SLACK_VERDICTS = Object.freeze([
  "pruned",
  "ghosted",
  "voided",
  "orphaned",
  "severed",
]);
export const LINEAR_VERDICTS = Object.freeze(["pruned", "orphaned", "severed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

const FORBIDDEN_IDLE = Object.freeze([
  "wraith",
  "empty",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "seated",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "sealed",
  "seised",
  "livery",
  "gasket",
  "damper",
  "cote",
  "nixie",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

export function emptyProbe() {
  return {
    imageDeleted: false,
    updaterPrunedRunningVersion: false,
    lsofOrProcExeDeleted: false,
    grantsStillOn: false,
    inAppGrantSuccessNoOp: false,
    bashEperm: false,
    readEperm: false,
    postUpdateSessionReadsOk: false,
    spawnSuccessEnoent: false,
    remoteControlGreenButEperm: false,
    restartRestores: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "unlinked-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const pane = src.pane && typeof src.pane === "object" ? src.pane : {};
  const image = src.image && typeof src.image === "object" ? src.image : {};
  const inode = src.inode && typeof src.inode === "object" ? src.inode : {};
  const tombstone = src.tombstone && typeof src.tombstone === "object" ? src.tombstone : {};
  const pick = (key) => src[key] ?? pane[key] ?? image[key] ?? inode[key] ?? tombstone[key];
  return {
    ...emptyProbe(),
    imageDeleted: asBool(pick("imageDeleted")),
    updaterPrunedRunningVersion: asBool(pick("updaterPrunedRunningVersion")),
    lsofOrProcExeDeleted: asBool(pick("lsofOrProcExeDeleted")),
    grantsStillOn: asBool(pick("grantsStillOn")),
    inAppGrantSuccessNoOp: asBool(pick("inAppGrantSuccessNoOp")),
    bashEperm: asBool(pick("bashEperm")),
    readEperm: asBool(pick("readEperm")),
    postUpdateSessionReadsOk: asBool(pick("postUpdateSessionReadsOk")),
    spawnSuccessEnoent: asBool(pick("spawnSuccessEnoent")),
    remoteControlGreenButEperm: asBool(pick("remoteControlGreenButEperm")),
    restartRestores: asBool(pick("restartRestores")),
    observed: asBool(src.observed ?? pane.observed ?? image.observed ?? inode.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? pane.source ?? image.source ?? inode.source),
    issue: asIssue(src.issue ?? pane.issue ?? image.issue ?? inode.issue),
    scored: asBool(src.scored ?? pane.scored ?? image.scored ?? inode.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.imageDeleted &&
    !next.updaterPrunedRunningVersion &&
    !next.lsofOrProcExeDeleted &&
    !next.grantsStillOn &&
    !next.inAppGrantSuccessNoOp &&
    !next.bashEperm &&
    !next.readEperm &&
    !next.postUpdateSessionReadsOk &&
    !next.spawnSuccessEnoent &&
    !next.remoteControlGreenButEperm &&
    !next.restartRestores &&
    !next.observed
  );
}

/**
 * First match wins. Idle unlinked is first. Classes stay distinguishable:
 * a grant that is still ON is not a hold. This is live-image unlink.
 * NOT Gasket (settings-key drop). NOT Damper (RC auto-enable).
 * NOT Livery (disclaimer-spawn / seisin).
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "unlinked";
  if (next.spawnSuccessEnoent) return "orphaned";
  if (next.remoteControlGreenButEperm) return "severed";
  if (
    next.postUpdateSessionReadsOk &&
    !next.updaterPrunedRunningVersion &&
    !next.imageDeleted &&
    !next.bashEperm &&
    !next.readEperm
  ) {
    return "resurfaced";
  }
  if (next.updaterPrunedRunningVersion) return "pruned";
  if (next.lsofOrProcExeDeleted) return "stale";
  if (
    next.grantsStillOn &&
    next.inAppGrantSuccessNoOp &&
    (next.bashEperm || next.readEperm)
  ) {
    return "ghosted";
  }
  if (next.bashEperm || next.readEperm) return "voided";
  if (next.restartRestores) return "ejected";
  if (
    next.grantsStillOn &&
    !next.imageDeleted &&
    !next.lsofOrProcExeDeleted &&
    !next.updaterPrunedRunningVersion &&
    !next.bashEperm &&
    !next.readEperm
  ) {
    return "held";
  }
  return "unlinked";
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "pruned") {
    return "● Pruned · updater removed the running version from disk while the session was live · the image is a ghost";
  }
  if (kind === "ghosted") {
    return "● Ghosted · grants still ON · in-app grant reports success · reads still EPERM · FDA cannot help";
  }
  if (kind === "voided") {
    return "● Voided · TCC-protected path EPERM mid-session · no warning · the grant looks lit";
  }
  if (kind === "orphaned") {
    return "● Orphaned · Agent spawn reports Spawned successfully · child ENOENT · version dir was pruned";
  }
  if (kind === "severed") {
    return "● Severed · remote-control still connected / green · every new session EPERM";
  }
  if (kind === "stale") {
    return "● Stale · lsof /proc/exe shows (deleted) · a newer version is the only image on disk";
  }
  if (kind === "resurfaced") {
    return "● Resurfaced · a concurrent session started after the update reads the same file · the grant still exists";
  }
  if (kind === "ejected") {
    return "● Ejected · only restart restores capability · the deleted image cannot be reseated";
  }
  if (kind === "held") {
    return "● Held · current-image session · path readable · grants match reality";
  }
  return "● Unlinked · image seated · inode present · idle word is unlinked";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.imageDeleted
      ? "on-disk binary for the running version is deleted"
      : "on-disk image is still present",
  );
  reasons.push(
    next.updaterPrunedRunningVersion
      ? "updater pruned the running version while the session was live"
      : "updater did not prune the running version under this probe",
  );
  reasons.push(
    next.lsofOrProcExeDeleted
      ? "lsof txt or /proc/exe shows (deleted)"
      : "lsof / proc exe does not show (deleted)",
  );
  reasons.push(
    next.grantsStillOn
      ? "System Settings folder grants still toggled ON"
      : "folder grants are not claimed still ON",
  );
  reasons.push(
    next.inAppGrantSuccessNoOp
      ? "in-app Folder access granted reported success and changed nothing"
      : "in-app directory-grant was not a no-op success",
  );
  reasons.push(next.bashEperm ? "Bash returned EPERM" : "Bash did not return EPERM");
  reasons.push(next.readEperm ? "Read returned EPERM" : "Read did not return EPERM");
  if (next.postUpdateSessionReadsOk) {
    reasons.push("a concurrent session started after the update reads the same file");
  }
  if (next.spawnSuccessEnoent) {
    reasons.push("Agent/teammate spawn returned Spawned successfully then child ENOENT");
  }
  if (next.remoteControlGreenButEperm) {
    reasons.push("remote-control still shows connected/green; new sessions EPERM");
  }
  if (next.restartRestores) {
    reasons.push("only a restart restores capability");
  }
  if (next.observed) {
    reasons.push("Trace checked lsof /proc/exe and the version tombstone");
  }
  reasons.push("a grant that is still ON is not a hold");
  reasons.push(
    "NOT Gasket (settings-key drop) / Damper (RC auto-enable) / Cote / Nixie / Snib / Knock / Hasp / Husk / Parity / Tain / Livery (disclaimer-spawn / seisin) / leftover woodworking / millimeter-slider",
  );
  if (kind === "unlinked") {
    reasons.push("image seated or desk idle; idle word is unlinked");
  }
  if (kind === "pruned") {
    reasons.push(
      "PRIMARY #90373: updater deletes the running image under a live session; TCC fails against the deleted signature; grants stay ON",
    );
  }
  if (kind === "ghosted") {
    reasons.push("grants stay lit; in-app grant is a no-op; reads still EPERM; FDA is irrelevant");
  }
  if (kind === "voided") {
    reasons.push("TCC-protected path EPERM mid-session with no warning");
  }
  if (kind === "orphaned") {
    reasons.push("PRIMARY contrast #86129: spawn success envelope; child ENOENT because the version dir was pruned");
  }
  if (kind === "severed") {
    reasons.push("PRIMARY contrast #70071: remote-control still connected/green; every new session EPERM");
  }
  if (kind === "stale") {
    reasons.push("PRIMARY contrast #75355: /proc/exe or lsof txt shows (deleted); prune ignores process liveness");
  }
  if (kind === "resurfaced") {
    reasons.push("control: a post-update session reads the same file; the grant still exists");
  }
  if (kind === "ejected") {
    reasons.push("only restart restores capability; the deleted image cannot be reseated");
  }
  if (kind === "held") {
    reasons.push("clean current-image session; path readable; grants match reality");
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function unlinkedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "unlinked";
}

export function ghostedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "ghosted";
}

export function prunedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  return kind === "pruned";
}

/**
 * score(probe) → { verdict, reasons[], unlinked, ghosted, pruned }
 * Deterministic. First match wins. Idle unlinked first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    unlinked: unlinkedOf(next, verdict),
    ghosted: ghostedOf(next, verdict),
    pruned: prunedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested =
    payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    imageDeleted: pick("imageDeleted"),
    updaterPrunedRunningVersion: pick("updaterPrunedRunningVersion"),
    lsofOrProcExeDeleted: pick("lsofOrProcExeDeleted"),
    grantsStillOn: pick("grantsStillOn"),
    inAppGrantSuccessNoOp: pick("inAppGrantSuccessNoOp"),
    bashEperm: pick("bashEperm"),
    readEperm: pick("readEperm"),
    postUpdateSessionReadsOk: pick("postUpdateSessionReadsOk"),
    spawnSuccessEnoent: pick("spawnSuccessEnoent"),
    remoteControlGreenButEperm: pick("remoteControlGreenButEperm"),
    restartRestores: pick("restartRestores"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    pane: fromFields.pane,
    image: fromFields.image,
    inode: fromFields.inode,
    tombstone: fromFields.tombstone,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  const scored = score(next);
  return {
    ok: true,
    product: "wraith",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    unlinked: scored.unlinked,
    ghosted: scored.ghosted,
    pruned: scored.pruned,
    imageUnlinked: verdict === "unlinked",
    imagePruned: verdict === "pruned",
    imageGhosted: verdict === "ghosted",
    imageVoided: verdict === "voided",
    imageOrphaned: verdict === "orphaned",
    imageSevered: verdict === "severed",
    imageStale: verdict === "stale",
    imageResurfaced: verdict === "resurfaced",
    imageEjected: verdict === "ejected",
    imageHeld: verdict === "held",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    imageDeleted: next.imageDeleted,
    updaterPrunedRunningVersion: next.updaterPrunedRunningVersion,
    lsofOrProcExeDeleted: next.lsofOrProcExeDeleted,
    grantsStillOn: next.grantsStillOn,
    inAppGrantSuccessNoOp: next.inAppGrantSuccessNoOp,
    bashEperm: next.bashEperm,
    readEperm: next.readEperm,
    postUpdateSessionReadsOk: next.postUpdateSessionReadsOk,
    spawnSuccessEnoent: next.spawnSuccessEnoent,
    remoteControlGreenButEperm: next.remoteControlGreenButEperm,
    restartRestores: next.restartRestores,
    observed: next.observed,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    probe: {
      ...emptyProbe(),
      session,
      source,
      issue: issueId,
      imageDeleted: Boolean(extras.imageDeleted),
      updaterPrunedRunningVersion: Boolean(extras.updaterPrunedRunningVersion),
      lsofOrProcExeDeleted: Boolean(extras.lsofOrProcExeDeleted),
      grantsStillOn: Boolean(extras.grantsStillOn),
      inAppGrantSuccessNoOp: Boolean(extras.inAppGrantSuccessNoOp),
      bashEperm: Boolean(extras.bashEperm),
      readEperm: Boolean(extras.readEperm),
      postUpdateSessionReadsOk: Boolean(extras.postUpdateSessionReadsOk),
      spawnSuccessEnoent: Boolean(extras.spawnSuccessEnoent),
      remoteControlGreenButEperm: Boolean(extras.remoteControlGreenButEperm),
      restartRestores: Boolean(extras.restartRestores),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / clear. Image seated. Inode present. */
export function seedUnlinked() {
  return seedProbe("unlinked", "pane", {
    session: "unlinked",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90373 pruned.
 * Updater deleted the running image under a live session.
 * Grants stay ON. Reads EPERM mid-session with no warning.
 */
export function seed90373Pruned() {
  return seedProbe(90373, "anthropics/claude-code#90373", {
    session: "90373-pruned",
    imageDeleted: true,
    updaterPrunedRunningVersion: true,
    lsofOrProcExeDeleted: true,
    grantsStillOn: true,
    bashEperm: true,
    readEperm: true,
  });
}

/** Ghosted: grants ON, in-app grant no-op, reads still EPERM. */
export function seedGhosted() {
  return seedProbe(90373, "anthropics/claude-code#90373", {
    session: "90373-ghosted",
    grantsStillOn: true,
    inAppGrantSuccessNoOp: true,
    bashEperm: true,
    readEperm: true,
  });
}

/** Voided: TCC-protected path EPERM mid-session, no warning. */
export function seedVoided() {
  return seedProbe(80941, "anthropics/claude-code#80941", {
    session: "80941-voided",
    bashEperm: true,
    readEperm: true,
  });
}

/** #86129 orphaned: spawn success + child ENOENT. */
export function seed86129Orphaned() {
  return seedProbe(86129, "anthropics/claude-code#86129", {
    session: "86129-orphaned",
    spawnSuccessEnoent: true,
    updaterPrunedRunningVersion: true,
    imageDeleted: true,
  });
}

/** #70071 severed: remote-control green, new sessions EPERM. */
export function seed70071Severed() {
  return seedProbe(70071, "anthropics/claude-code#70071", {
    session: "70071-severed",
    remoteControlGreenButEperm: true,
  });
}

/** #75355 stale: /proc/exe or lsof txt shows (deleted). */
export function seed75355Stale() {
  return seedProbe(75355, "anthropics/claude-code#75355", {
    session: "75355-stale",
    lsofOrProcExeDeleted: true,
    imageDeleted: true,
  });
}

/** Resurfaced: concurrent post-update session reads the same file. */
export function seedResurfaced() {
  return seedProbe(90373, "anthropics/claude-code#90373", {
    session: "90373-resurfaced",
    postUpdateSessionReadsOk: true,
    grantsStillOn: true,
  });
}

/** Ejected: only restart restores capability. */
export function seedEjected() {
  return seedProbe(90373, "anthropics/claude-code#90373", {
    session: "90373-ejected",
    restartRestores: true,
  });
}

/** Held: clean current-image session, path readable, grants match. */
export function seedHeld() {
  return seedProbe("held", "image", {
    session: "held",
    issue: null,
    grantsStillOn: true,
  });
}

const SEEDS = {
  unlinked: seedUnlinked,
  pruned: seed90373Pruned,
  90373: seed90373Pruned,
  "90373-pruned": seed90373Pruned,
  ghosted: seedGhosted,
  "90373-ghosted": seedGhosted,
  voided: seedVoided,
  80941: seedVoided,
  "80941-voided": seedVoided,
  orphaned: seed86129Orphaned,
  86129: seed86129Orphaned,
  "86129-orphaned": seed86129Orphaned,
  severed: seed70071Severed,
  70071: seed70071Severed,
  "70071-severed": seed70071Severed,
  stale: seed75355Stale,
  75355: seed75355Stale,
  "75355-stale": seed75355Stale,
  resurfaced: seedResurfaced,
  "90373-resurfaced": seedResurfaced,
  ejected: seedEjected,
  "90373-ejected": seedEjected,
  held: seedHeld,
};

function prunedStrike(session) {
  return {
    ...emptyProbe(),
    imageDeleted: true,
    updaterPrunedRunningVersion: true,
    lsofOrProcExeDeleted: true,
    grantsStillOn: true,
    bashEperm: true,
    readEperm: true,
    session: session || "pruned",
    source: "unlink",
    scored: true,
  };
}

function heldStrike(session) {
  return {
    ...emptyProbe(),
    grantsStillOn: true,
    session: session || "held",
    source: "hold",
    scored: true,
  };
}

function ejectedStrike(session) {
  return {
    ...emptyProbe(),
    restartRestores: true,
    session: session || "ejected",
    source: "restart",
    scored: true,
  };
}

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "clear" || verb === "seat") {
    return pack("unlinked", emptyProbe(), { ...action, action: verb === "clear" ? "seat" : verb });
  }

  if (verb === "unlink") {
    probe = prunedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "unlink" });
  }

  if (verb === "observe" || verb === "trace") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "trace" : verb });
  }

  if (verb === "hold") {
    probe = heldStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "hold" });
  }

  if (verb === "restart") {
    probe = ejectedStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "restart" });
  }

  if (verb === "press" || verb === "admit" || verb === "score") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" ? "press" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
