#!/usr/bin/env node
/**
 * Fosse — earthwork / defensive-ditch booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Cowork on Windows 10 Pro 22H2 (build 19045.7725) after the
 * September 2026 cumulative. Host-side Plan9 share attach reports
 * complete success (HcsModifyComputeSystem hr=0x0 for all four
 * shares) while the guest mounts 0/4 with
 * `Plan9 mount failed: invalid argument`, including share `c`
 * (plain local NTFS). The workspace is a fosse: host bank held,
 * guest-void. User-facing copy reads
 * `sandbox-helper: no Plan9 drive shares mounted under
 * /mnt/.virtiofs-root/shared` — a sandbox problem, not a mount
 * failure. KB5124008 is NOT installed and not applicable — this
 * is the Win10 22H2 counterpart of Win11 #92984, not a clone of it.
 *
 *   node fosse.mjs data/fosse.json
 *   echo '{"seed":"fossed"}' | node fosse.mjs
 *
 * Idle word is mounted (HOLD: 4/4 Plan9 shares under
 * /mnt/.virtiofs-root/shared; sandbox usable; host hr=0x0 AND
 * guest mounts succeed).
 * Seeded word is fossed (#93358: after Sep cumulative → guest
 * 0/4 EINVAL while host still reports hr=0x0).
 * Path word is plan9.
 * Product score word is fosse (score fosse or admit mounted).
 *
 * Encoded from anthropics/claude-code#93358 issue body only.
 * Hypothesis (NON-BINDING): post-Sep vmcompute/vmwp Plan9 option
 * negotiation rejects guest mount args with EINVAL while host HCS
 * modify still returns success. Verify against #93358 text only.
 * Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "mounted",
  "fossed",
  "fosse",
  "plan9",
  "hold",
  "host-bank",
  "guest-void",
  "einval",
  "share-c",
  "sandbox-helper",
  "sep-cumulative",
  "kb5124008-na",
  "vmcompute",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "mounted";
export const PATH_WORD = "plan9";
export const SEEDED_WORD = "fossed";
export const PRODUCT_WORD = "fosse";
export const HOLD = Object.freeze(["mounted", "hold"]);
export const RECOVER = Object.freeze(["mounted", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "voided",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "exchanged",
  "parsed",
  "precedence",
  "carrier",
  "moored",
  "primed",
  "raised",
  "preserved",
  "banked",
  "flashed",
  "fallen",
  "scaffold",
  "wedged",
  "bridge-loss",
  "mismatched-header",
  "header-mismatch",
  "vernier",
  "slider",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "fossed" && name !== "fosse"),
);

export const FEATURED_ISSUE = 93358;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93358";
export const TITLE =
  "[BUG] Cowork (Windows 10 22H2): all Plan9 shares fail with \"Plan9 mount failed: invalid argument\" after September 2026 cumulative — 4/4 → 0/4, host reports hr=0x0";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cowork",
]);
export const AUTHOR = "djionut13";
export const FILED = "2026-09-10T13:53:01Z";
export const DESKTOP_VERSION = "1.49585.0.0";
export const OS = "Windows 10 Pro 22H2";
export const BUILD = "19045.7725";
export const ARCH = "x64";
export const CPU = "13th Gen Intel Core i5-1345U";
export const COWORK_VM_SERVICE = "Running (Automatic)";
export const VMCOMPUTE_SERVICE = "Running (Manual)";
export const VIRTUAL_MACHINE_PLATFORM = "Enabled";
export const HYPERVISOR_PLATFORM = "not present";
export const HYPER_V_ALL = "Disabled";
export const HOST_HR = "0x0";
export const GUEST_MOUNTED = "0/4";
export const IDLE_MOUNTED = "4/4";
export const GUEST_ERROR = "Plan9 mount failed: invalid argument";
export const SANDBOX_HELPER =
  "sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared";
export const SHARE_ROOT = "/mnt/.virtiofs-root/shared";
export const LAST_GOOD = "2026/09/08 22:12:01";
export const FIRST_BAD = "2026/09/10 13:15:31";
export const CUMULATIVE_KBS = Object.freeze([
  "KB5122877",
  "KB5122878",
  "KB5126421",
]);
export const KB5124008 = "not installed / not applicable";
export const FLAGS = "0x10";
export const HAS_TOKEN = true;
export const VMCOMPUTE_EXE = "vmcompute.exe 10.0.19041.1";
export const VMWP_EXE = "vmwp.exe 10.0.19041.1";
export const PHRASE =
  "when host Plan9 attach returns hr=0x0 but the guest mounts 0/4 with invalid argument after the Win10 Sep cumulative, score fosse or admit mounted.";

export const TRENCH_STATIONS = Object.freeze([
  {
    id: "host-bank",
    survey: "read the host bank",
    kind: "host",
    note: "HcsModifyComputeSystem hr=0x0 for all four shares — host bank",
  },
  {
    id: "sod-lip",
    survey: "walk the sod lip",
    kind: "platform",
    note: "VirtualMachinePlatform Enabled; VM Running; RPC connected; API reachable",
  },
  {
    id: "chalk-mark",
    survey: "chalk the survey marks",
    kind: "window",
    note: "nine consecutive 4/4 boots 28 Jul–8 Sep; first 0/4 after Sep cumulative",
  },
  {
    id: "guest-void",
    survey: "sound the guest void",
    kind: "guest",
    note: "Plan9 mount failed: invalid argument — 0/4 including share c",
  },
]);

export const SHARE_TABLE = Object.freeze([
  {
    name: "c",
    path: "C:\\",
    port: 9902,
    kind: "plain local NTFS",
    hostHr: "0x0",
    guest: "Plan9 mount failed: invalid argument",
  },
  {
    name: "x",
    path: "<network>",
    port: 9923,
    kind: "mapped network drive",
    hostHr: "0x0",
    guest: "Plan9 mount failed: invalid argument",
  },
  {
    name: "y",
    path: "<network>",
    port: 9924,
    kind: "mapped network drive",
    hostHr: "0x0",
    guest: "Plan9 mount failed: invalid argument",
  },
  {
    name: "z",
    path: "<network>",
    port: 9925,
    kind: "mapped network drive",
    hostHr: "0x0",
    guest: "Plan9 mount failed: invalid argument",
  },
]);

export const GOOD_BOOTS = Object.freeze([
  "2026/07/28 16:29:41",
  "2026/07/30 10:48:32",
  "2026/08/02 20:36:17",
  "2026/08/05 08:44:00",
  "2026/08/07 14:41:06",
  "2026/08/14 08:29:07",
  "2026/09/03 09:07:32",
  "2026/09/07 07:29:15",
  "2026/09/08 22:12:01",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "host-bank",
  "guest-void",
  "einval",
  "share-c",
  "sandbox-helper",
  "sep-cumulative",
  "kb5124008-na",
  "vmcompute",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92984,
    title:
      "identical error string, Windows 11 26200, KB5124008 (uninstall restores)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — Win11 + KB5124008; do not rebuild as this product",
  },
  {
    issue: 92958,
    title:
      "ARM64/x64 Sep cumulative breaks Plan9 attach; add_plan9_shares reports success but attaches nothing",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — do not rebuild",
  },
  {
    issue: 43290,
    title: "Win10 22H2 Plan9 share access denied after update",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed; do not rebuild",
  },
  {
    issue: 47570,
    title: "mounts nonexistent drive letter",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed; do not rebuild",
  },
  {
    issue: 44486,
    title: "service crashes when a drive cannot mount",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite-only cousin — closed; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93356,
    title: "hooks fail on Windows username with space",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93354,
    title: "Wayland Bone layout physical key code",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93345,
    title: "RC worktrees deleted before archive",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93341,
    title: "/code-review stale local main in worktrees",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93338,
    title: "Desktop OTEL_RESOURCE_ATTRIBUTES never emitted",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93279,
    title: "HTTP MCP ~25s stall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93270,
    title: "Workflow kill leaks agents blocking archive",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93269,
    title: "cite-only backup — do not auto-pick",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93265,
    title: "cite-only backup — do not auto-pick",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93280,
    title: "cite-only backup — do not auto-pick",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93257,
    title: "cite-only backup — do not auto-pick",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93219,
    title: "Vernier millimeter-slider leftover — do not ship",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — leftover woodworking; forbidden as primary",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "scapegoat",
  "cartulary",
  "paraph",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "flashpan",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Read the host bank — HcsModifyComputeSystem hr for Plan9 attach.
 */
export function inspectHostBank(input = {}) {
  const hostHr = String(input.hostHr || input.hr || "");
  const hostHonest =
    input.hostHonest === true ||
    hostHr === HOST_HR ||
    hostHr === "0x0" ||
    input.hostAttachOk === true;
  const fourShares =
    Number(input.hostShareCount) === 4 ||
    input.hostFourShares === true ||
    (Array.isArray(input.shares) && input.shares.length === 4);
  return {
    hostHr: hostHr || (hostHonest ? HOST_HR : ""),
    hostHonest,
    fourShares: fourShares || hostHonest,
    stamp: hostHonest ? "host-bank" : "mounted",
  };
}

/**
 * Sound the guest void — 4/4 mounted vs 0/4 EINVAL.
 */
export function inspectGuestVoid(input = {}) {
  const guestMounted = String(input.guestMounted || input.mountedRatio || "");
  const einval =
    input.einval === true ||
    input.invalidArgument === true ||
    Boolean(
      input.guestError &&
        String(input.guestError).includes("invalid argument"),
    );
  const zeroOfFour =
    guestMounted === GUEST_MOUNTED ||
    guestMounted === "0/4" ||
    input.guestZero === true ||
    Number(input.guestShareCount) === 0;
  const shareC =
    input.shareC === true ||
    input.shareCFailed === true ||
    (einval && (input.share === "c" || input.includeShareC !== false));
  const voided = (zeroOfFour || einval) && input.guestOk !== true;
  return {
    guestMounted: guestMounted || (voided ? GUEST_MOUNTED : IDLE_MOUNTED),
    einval: einval && voided,
    zeroOfFour: zeroOfFour && voided,
    shareC: shareC && voided,
    stamp: voided ? "fossed" : "mounted",
  };
}

/**
 * Read the user-facing sandbox-helper cue.
 */
export function inspectSandboxCue(input = {}) {
  const helperLie =
    input.sandboxHelper === true ||
    input.sandboxHelperLie === true ||
    Boolean(
      input.sandboxMessage &&
        String(input.sandboxMessage).includes("no Plan9 drive shares"),
    );
  return {
    helperLie,
    message: helperLie ? SANDBOX_HELPER : "",
    stamp: helperLie ? "fossed" : "mounted",
  };
}

export function readTrench(input = {}) {
  const host = inspectHostBank(input);
  const guest = inspectGuestVoid(input);
  const cue = inspectSandboxCue(input);
  const fossed =
    guest.stamp === "fossed" ||
    cue.stamp === "fossed" ||
    input.fossed === true;
  const mounted =
    input.mounted === true &&
    fossed !== true &&
    guest.stamp === "mounted";
  return {
    host,
    guest,
    cue,
    stations: TRENCH_STATIONS,
    fossed: fossed && !mounted,
    mounted: mounted || (guest.stamp === "mounted" && !fossed && input.fossed !== true),
    mark: fossed && !mounted ? "fossed" : "mounted",
  };
}

/**
 * Published fosse walk from #93358 only. Facts from the issue body.
 * A mounted trench keeps host hr=0x0 AND guest 4/4 under
 * /mnt/.virtiofs-root/shared. A fossed trench keeps the host bank
 * honest while the guest void reads 0/4 EINVAL after the Win10
 * Sep cumulative.
 */
export const FOSSE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-mounted",
    mounted: true,
    hostHonest: true,
    hostHr: HOST_HR,
    guestOk: true,
    guestMounted: IDLE_MOUNTED,
    guestShareCount: 4,
    fossed: false,
    einval: false,
    cue: "mounted",
    note: "idle HOLD: 4/4 Plan9 shares under /mnt/.virtiofs-root/shared; sandbox usable; host hr=0x0 AND guest mounts succeed",
  },
  {
    t: "boots",
    event: "nine-good-boots",
    mounted: true,
    hostHonest: true,
    guestOk: true,
    guestMounted: IDLE_MOUNTED,
    goodBoots: 9,
    lastGood: LAST_GOOD,
    cue: "mounted",
    note: "nine consecutive boots 28 Jul–8 Sep 2026 mounted 4/4 successfully",
  },
  {
    t: "kb",
    event: "sep-cumulative",
    fossed: true,
    sepCumulative: true,
    kbs: CUMULATIVE_KBS,
    cue: "fossed",
    note: "September 2026 cumulative KB5122878 / KB5122877 / KB5126421 — only change in the window",
  },
  {
    t: "bins",
    event: "vmcompute-rewrite",
    fossed: true,
    vmcomputeRewrite: true,
    cue: "fossed",
    note: "cumulative rewrote vmcompute.exe and vmwp.exe (10.0.19041.1, LastWriteTime 09/09/2026)",
  },
  {
    t: "host",
    event: "host-attach-hr0",
    hostHonest: true,
    hostHr: HOST_HR,
    hostFourShares: true,
    hostShareCount: 4,
    fossed: true,
    cue: "fossed",
    note: "all four HcsModifyComputeSystem return hr=0x0 — failure only visible in guest console",
  },
  {
    t: "share-c",
    event: "guest-c-einval",
    fossed: true,
    einval: true,
    shareC: true,
    share: "c",
    guestError: GUEST_ERROR,
    cue: "fossed",
    note: "Plan9 mount failed: invalid argument including share c (plain local NTFS)",
  },
  {
    t: "shares",
    event: "guest-xyz-einval",
    fossed: true,
    einval: true,
    guestError: GUEST_ERROR,
    cue: "fossed",
    note: "shares x / y / z fail identically via vsock 9923 / 9924 / 9925",
  },
  {
    t: "void",
    event: "guest-0-of-4",
    fossed: true,
    guestZero: true,
    guestMounted: GUEST_MOUNTED,
    guestShareCount: 0,
    einval: true,
    cue: "fossed",
    note: "guest log: mounted 0/4 Plan9 shares",
  },
  {
    t: "ui",
    event: "sandbox-helper-lie",
    fossed: true,
    sandboxHelper: true,
    sandboxHelperLie: true,
    sandboxMessage: SANDBOX_HELPER,
    cue: "fossed",
    note: "sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared — reads as workspace/sandbox problem",
  },
  {
    t: "na",
    event: "kb5124008-na",
    fossed: true,
    kb5124008Na: true,
    cue: "fossed",
    note: "KB5124008 is not installed and not applicable — Win10 22H2 counterpart of #92984, not a clone",
  },
  {
    t: "kin",
    event: "win10-counterpart",
    fossed: true,
    win10Counterpart: true,
    cue: "fossed",
    note: "explicitly the Windows 10 22H2 counterpart of #92984 (Win11 26200 + KB5124008)",
  },
  {
    t: "cut",
    event: "fossed",
    mounted: false,
    fossed: true,
    hostHonest: true,
    hostHr: HOST_HR,
    guestZero: true,
    guestMounted: GUEST_MOUNTED,
    einval: true,
    shareC: true,
    sandboxHelper: true,
    sepCumulative: true,
    kb5124008Na: true,
    vmcomputeRewrite: true,
    cue: "fossed",
    note: "#93358: after Sep cumulative → guest 0/4 EINVAL while host still reports hr=0x0",
  },
  {
    t: "path",
    event: "plan9",
    fossed: true,
    plan9: true,
    einval: true,
    cue: "fossed",
    note: "plan9 — host attach vs guest mount path after Win10 22H2 Sep cumulative",
  },
  {
    t: "score",
    event: "fosse",
    fossed: true,
    plan9: true,
    cue: "fossed",
    note: "fosse — score the trench that kept the host bank honest and the guest void empty",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    mounted: true,
    hostHonest: true,
    hostHr: HOST_HR,
    guestOk: true,
    guestMounted: IDLE_MOUNTED,
    guestShareCount: 4,
    fossed: false,
    einval: false,
    cue: "mounted",
  };
}

export function seedMounted() {
  return { ...emptyTicket() };
}

export function seedFossed() {
  return {
    seed: SEEDED_WORD,
    mounted: false,
    fossed: true,
    hostHonest: true,
    hostHr: HOST_HR,
    hostFourShares: true,
    hostShareCount: 4,
    hostAttachOk: true,
    guestZero: true,
    guestMounted: GUEST_MOUNTED,
    guestShareCount: 0,
    guestError: GUEST_ERROR,
    einval: true,
    invalidArgument: true,
    shareC: true,
    share: "c",
    sandboxHelper: true,
    sandboxHelperLie: true,
    sandboxMessage: SANDBOX_HELPER,
    sepCumulative: true,
    kb5124008Na: true,
    vmcomputeRewrite: true,
    win10Counterpart: true,
    flags: FLAGS,
    hasToken: HAS_TOKEN,
    cue: "fossed",
    issue: FEATURED_ISSUE,
  };
}

export function seedFosse() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    fossed: true,
    plan9: true,
    cue: "fossed",
  };
}

export function seedPlan9() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    fossed: true,
    plan9: true,
    einval: true,
    cue: "fossed",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    mounted: true,
    cue: "mounted",
  };
}

export function seedHostHonest() {
  return {
    seed: "host-bank",
    preferSeed: true,
    hostHonest: true,
    cue: "fossed",
  };
}

export function seedGuestVoid() {
  return {
    seed: "guest-void",
    preferSeed: true,
    guestZero: true,
    cue: "fossed",
  };
}

export function seedEinval() {
  return {
    seed: "einval",
    preferSeed: true,
    einval: true,
    cue: "fossed",
  };
}

export function seedShareC() {
  return {
    seed: "share-c",
    preferSeed: true,
    shareC: true,
    cue: "fossed",
  };
}

export function seedSandboxHelper() {
  return {
    seed: "sandbox-helper",
    preferSeed: true,
    sandboxHelper: true,
    cue: "fossed",
  };
}

export function seedSepCumulative() {
  return {
    seed: "sep-cumulative",
    preferSeed: true,
    sepCumulative: true,
    cue: "fossed",
  };
}

export function seedKb5124008Na() {
  return {
    seed: "kb5124008-na",
    preferSeed: true,
    kb5124008Na: true,
    cue: "fossed",
  };
}

export function seedVmcompute() {
  return {
    seed: "vmcompute",
    preferSeed: true,
    vmcomputeRewrite: true,
    cue: "fossed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      mounted: false,
      fossed: false,
      plan9: false,
      hostHonest: false,
      hostAttachOk: false,
      hostFourShares: false,
      guestOk: false,
      guestZero: false,
      einval: false,
      invalidArgument: false,
      shareC: false,
      sandboxHelper: false,
      sandboxHelperLie: false,
      sepCumulative: false,
      kb5124008Na: false,
      vmcomputeRewrite: false,
      win10Counterpart: false,
      hasToken: false,
      hostHr: null,
      guestMounted: null,
      guestShareCount: null,
      hostShareCount: null,
      guestError: null,
      sandboxMessage: null,
      share: null,
      flags: null,
      goodBoots: null,
      lastGood: null,
      kbs: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    mounted: raw.mounted === true,
    fossed: raw.fossed === true,
    plan9: raw.plan9 === true,
    hostHonest: raw.hostHonest === true,
    hostAttachOk: raw.hostAttachOk === true,
    hostFourShares: raw.hostFourShares === true,
    guestOk: raw.guestOk === true,
    guestZero: raw.guestZero === true,
    einval: raw.einval === true,
    invalidArgument: raw.invalidArgument === true,
    shareC: raw.shareC === true,
    sandboxHelper: raw.sandboxHelper === true,
    sandboxHelperLie: raw.sandboxHelperLie === true,
    sepCumulative: raw.sepCumulative === true,
    kb5124008Na: raw.kb5124008Na === true,
    vmcomputeRewrite: raw.vmcomputeRewrite === true,
    win10Counterpart: raw.win10Counterpart === true,
    hasToken: raw.hasToken === true,
    hostHr: raw.hostHr == null ? null : raw.hostHr,
    guestMounted: raw.guestMounted == null ? null : raw.guestMounted,
    guestShareCount:
      raw.guestShareCount == null ? null : Number(raw.guestShareCount),
    hostShareCount:
      raw.hostShareCount == null ? null : Number(raw.hostShareCount),
    guestError: raw.guestError == null ? null : raw.guestError,
    sandboxMessage: raw.sandboxMessage == null ? null : raw.sandboxMessage,
    share: raw.share == null ? null : raw.share,
    flags: raw.flags == null ? null : raw.flags,
    goodBoots: raw.goodBoots == null ? null : Number(raw.goodBoots),
    lastGood: raw.lastGood == null ? null : raw.lastGood,
    kbs: raw.kbs == null ? null : raw.kbs,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.mounted != null ||
        ticket.fossed != null ||
        ticket.plan9 != null ||
        ticket.hostHonest != null ||
        ticket.guestZero != null ||
        ticket.einval != null ||
        ticket.shareC != null ||
        ticket.sandboxHelper != null ||
        ticket.sepCumulative != null ||
        ticket.kb5124008Na != null ||
        ticket.vmcomputeRewrite != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isMounted(row) {
  if (row.fossed && row.cue !== "mounted") return false;
  if (
    row.cue === "fossed" ||
    row.cue === "fosse" ||
    row.cue === "plan9"
  ) {
    return false;
  }
  if (row.einval && row.cue !== "mounted") return false;
  if (row.guestZero && row.cue !== "mounted") return false;
  if (
    row.mounted === true &&
    row.fossed !== true &&
    row.cue !== "fossed"
  ) {
    return true;
  }
  if (
    row.cue === "mounted" &&
    row.fossed !== true &&
    row.einval !== true &&
    row.guestZero !== true
  ) {
    return true;
  }
  if (
    row.guestOk === true &&
    row.hostHonest === true &&
    row.fossed !== true &&
    row.einval !== true &&
    row.guestZero !== true
  ) {
    return true;
  }
  return false;
}

function isFossed(row) {
  if (isMounted(row)) return false;
  if (row.cue === "fossed" || row.cue === "fosse") return true;
  if (row.fossed === true) return true;
  if (
    row.einval === true ||
    row.guestZero === true ||
    row.guestMounted === GUEST_MOUNTED
  ) {
    return true;
  }
  if (
    row.hostHonest &&
    (row.sandboxHelper || row.sepCumulative) &&
    row.guestOk !== true
  ) {
    return true;
  }
  return false;
}

function isPlan9Path(row) {
  return (
    row.event === "plan9" &&
    !isMounted(row) &&
    (row.fossed === true || row.plan9 === true || row.einval === true)
  );
}

/**
 * Score one trench pass against the fosse booth.
 * mounted: host hr=0x0 AND guest 4/4; sandbox usable.
 * fossed: host still hr=0x0; guest 0/4 EINVAL after Sep cumulative.
 * plan9: named path — host attach vs guest mount.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPlan9Path(row) ||
    (row.plan9 && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "plan9";
  } else if (isFossed(row)) {
    verdict = "fossed";
  } else if (isMounted(row)) {
    verdict = "mounted";
  } else if (
    row.einval ||
    row.guestZero ||
    row.shareC ||
    row.sandboxHelper ||
    row.sepCumulative ||
    row.kb5124008Na ||
    row.vmcomputeRewrite
  ) {
    verdict = "fossed";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const host = inspectHostBank(row);
  const guest = inspectGuestVoid(row);
  const sandbox = inspectSandboxCue(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    mounted: verdict === "mounted" || verdict === "hold",
    fossed:
      verdict === "fossed" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    plan9:
      row.plan9 === true ||
      verdict === "plan9" ||
      verdict === PATH_WORD,
    hostHonest: row.hostHonest,
    hostAttachOk: row.hostAttachOk,
    hostFourShares: row.hostFourShares,
    guestOk: row.guestOk,
    guestZero: row.guestZero,
    einval: row.einval,
    invalidArgument: row.invalidArgument,
    shareC: row.shareC,
    sandboxHelper: row.sandboxHelper,
    sandboxHelperLie: row.sandboxHelperLie,
    sepCumulative: row.sepCumulative,
    kb5124008Na: row.kb5124008Na,
    vmcomputeRewrite: row.vmcomputeRewrite,
    win10Counterpart: row.win10Counterpart,
    hasToken: row.hasToken,
    hostHr: row.hostHr,
    guestMounted: row.guestMounted,
    guestShareCount: row.guestShareCount,
    hostShareCount: row.hostShareCount,
    guestError: row.guestError,
    sandboxMessage: row.sandboxMessage,
    share: row.share,
    flags: row.flags,
    goodBoots: row.goodBoots,
    lastGood: row.lastGood,
    kbs: row.kbs,
    cue: hold ? "mounted" : "fossed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit mounted" : "score fosse",
    host,
    guest,
    sandbox,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : FOSSE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const fossed = scored.filter((row) => row.verdict === "fossed");
  const path = scored.filter((row) => row.verdict === "plan9");
  const mounted = scored.filter((row) => row.verdict === "mounted");
  const headline =
    scored.find((row) => row.event === "fossed") ||
    scored.find((row) => row.event === "guest-0-of-4") ||
    scored.find((row) => row.event === "plan9") ||
    fossed[fossed.length - 1];
  let verdict = "mounted";
  if (fossed.length) verdict = "fossed";
  else if (path.length && !mounted.length) verdict = "plan9";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    fossedCount: fossed.length,
    pathCount: path.length,
    mountedCount: mounted.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit mounted" : "score fosse",
    note: headline
      ? "Win10 22H2 19045.7725; Sep cumulative; host HcsModifyComputeSystem hr=0x0; guest 0/4 EINVAL including share c; KB5124008 not applicable."
      : "published fosse walk scored against mounted vs fossed",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "mounted" &&
    seeded !== "fossed" &&
    seeded !== "plan9" &&
    seeded !== "fosse" &&
    ticket.mounted == null &&
    ticket.fossed == null &&
    ticket.plan9 == null &&
    ticket.einval == null &&
    ticket.guestZero == null &&
    ticket.hostHonest == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    backups: BACKUPS.map((row) => row.issue),
    mounted: scored.mounted ?? false,
    fossed: scored.fossed ?? false,
    plan9: scored.plan9 ?? false,
    hostHonest: scored.hostHonest ?? false,
    guestZero: scored.guestZero ?? false,
    einval: scored.einval ?? false,
    shareC: scored.shareC ?? false,
    sandboxHelper: scored.sandboxHelper ?? false,
    sepCumulative: scored.sepCumulative ?? false,
    kb5124008Na: scored.kb5124008Na ?? false,
    vmcomputeRewrite: scored.vmcomputeRewrite ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.hostHonest || result.hostHr === HOST_HR ? "host=hr0" : "host=unknown",
    result.guestZero || result.guestMounted === GUEST_MOUNTED
      ? "guest=0/4"
      : "guest=4/4",
    result.einval ? "mount=einval" : "mount=ok",
    result.shareC ? "share=c" : "share=set",
    result.cue === "mounted" ? "cue=mounted" : "cue=fossed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const trench = readTrench({
    mounted: result.mounted,
    fossed: result.fossed,
    hostHonest: result.hostHonest,
    hostHr: result.hostHr,
    hostAttachOk: result.hostAttachOk,
    hostFourShares: result.hostFourShares,
    hostShareCount: result.hostShareCount,
    guestOk: result.guestOk,
    guestZero: result.guestZero,
    guestMounted: result.guestMounted,
    guestShareCount: result.guestShareCount,
    guestError: result.guestError,
    einval: result.einval,
    invalidArgument: result.invalidArgument,
    shareC: result.shareC,
    share: result.share,
    sandboxHelper: result.sandboxHelper,
    sandboxHelperLie: result.sandboxHelperLie,
    sandboxMessage: result.sandboxMessage,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    trench,
    host: inspectHostBank({
      hostHr: result.hostHr,
      hostHonest: result.hostHonest,
      hostAttachOk: result.hostAttachOk,
      hostFourShares: result.hostFourShares,
      hostShareCount: result.hostShareCount,
    }),
    guest: inspectGuestVoid({
      guestMounted: result.guestMounted,
      guestZero: result.guestZero,
      guestShareCount: result.guestShareCount,
      guestError: result.guestError,
      einval: result.einval,
      invalidArgument: result.invalidArgument,
      shareC: result.shareC,
      share: result.share,
      guestOk: result.guestOk,
    }),
    sandbox: inspectSandboxCue({
      sandboxHelper: result.sandboxHelper,
      sandboxHelperLie: result.sandboxHelperLie,
      sandboxMessage: result.sandboxMessage,
    }),
    stations: TRENCH_STATIONS.map((row) => ({
      ...row,
      fossed: result.fossed === true || result.verdict === "fossed",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      desktopVersion: DESKTOP_VERSION,
      os: OS,
      build: BUILD,
      arch: ARCH,
      cpu: CPU,
      coworkVmService: COWORK_VM_SERVICE,
      vmcomputeService: VMCOMPUTE_SERVICE,
      virtualMachinePlatform: VIRTUAL_MACHINE_PLATFORM,
      hypervisorPlatform: HYPERVISOR_PLATFORM,
      hyperVAll: HYPER_V_ALL,
      hostHr: HOST_HR,
      guestMounted: GUEST_MOUNTED,
      idleMounted: IDLE_MOUNTED,
      guestError: GUEST_ERROR,
      sandboxHelper: SANDBOX_HELPER,
      shareRoot: SHARE_ROOT,
      lastGood: LAST_GOOD,
      firstBad: FIRST_BAD,
      cumulativeKbs: [...CUMULATIVE_KBS],
      kb5124008: KB5124008,
      flags: FLAGS,
      hasToken: HAS_TOKEN,
      vmcomputeExe: VMCOMPUTE_EXE,
      vmwpExe: VMWP_EXE,
      shareTable: SHARE_TABLE,
      goodBoots: GOOD_BOOTS,
      stations: TRENCH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "surface guest mount EINVAL to the user (not just sandbox down)",
        "log 9p mount args on EINVAL",
        "consider flags=0x10 hasToken=true negotiation vs post-Sep Plan9 server on 19041 servicing branch",
        "make individual share failures non-fatal (c alone often enough)",
      ],
      hypothesis:
        "NON-BINDING: post-Sep vmcompute/vmwp Plan9 option negotiation rejects guest mount args with EINVAL while host HCS modify still returns success. Verify against #93358 text only. Do not claim a root cause in Claude Code source you have not seen.",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
  ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
