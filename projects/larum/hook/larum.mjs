/**
 * Larum — limestone watchtower / larum-bell / wake chronograph.
 *
 * A completed background-task <task-notification> is enqueued,
 * dequeued, and appended to the session as a user-role message
 * (origin.kind task-notification, status completed) — then no
 * assistant turn ever starts. The notice is in the ledger. The
 * missing piece is the model invocation / turn schedule.
 *
 * Encoded from anthropics/claude-code#92563 issue facts only.
 * Hypothesis (NON-BINDING): after the harness writes the
 * completed task-notification into conversation history, the
 * turn scheduler sometimes fails to start an assistant pass —
 * worst on the last notification of a parallel batch, because
 * a later sibling would otherwise mask the miss. Verify nothing
 * in closed source; encode issue facts only.
 * No network. No exploits. No live Claude.
 */

export const CHIPS = [
  "unanswered",
  "roused",
  "last-of-batch",
  "delivered-and-roused",
  "synthetic-repair",
  "cousins"
];

export const HOLD = new Set(["roused", "delivered-and-roused"]);

export const ALARM = new Set([
  "unanswered",
  "last-of-batch",
  "synthetic-repair",
  "cousins"
]);

export const IDLE_WORD = "unanswered";
export const SEEDED_WORD = "roused";

export const MEASURED = {
  issue: 92563,
  title:
    "Completed background-task notification is appended to the session but never triggers an assistant turn; session idles until user input",
  state: "open",
  labels: ["bug", "has repro", "area:core", "area:agents", "platform:wsl"],
  filed: "2026-09-06T23:05:27Z",
  updated: "2026-09-06T23:06:39Z",
  reporter: "sergey-gusev94",
  versions: "2.1.250 through 2.1.259",
  entrypoint: "sdk-ts",
  permissionMode: "bypassPermissions",
  platform: "WSL2 (Linux 6.6.87.x-microsoft-standard-WSL2)",
  model: "claude-fable-5",
  drops: 7,
  delivered: 580,
  rate: "~1%",
  lastOfBatchBias: true,
  agentDrops: 6,
  bashDrops: 1,
  idleRange: "~4 minutes to ~85 minutes",
  representativeIdle: "T+3m36s",
  enqueueOffset: "T+8s",
  repairUser: "Continue from where you left off.",
  repairAssistant: "No response requested.",
  repairModel: "<synthetic>",
  ruledOut: [
    "model behavior",
    "permissions (bypassPermissions)",
    "API errors",
    "payload size",
    "compaction",
    "agent failure",
    "host suspend"
  ]
};

export const COUSINS = [
  {
    id: 21165,
    state: "closed",
    note: "CLOSED (duplicate). First-of-batch processed, rest queued until ESC. Notifications delivered to UI but unprocessed. Cite-only; primary stays #92563."
  },
  {
    id: 39632,
    state: "closed",
    note: "CLOSED (stale / not planned). stream-json race before enqueue in runAsyncAgentLifecycle. Item may sit undelivered. Cite-only."
  },
  {
    id: 75043,
    state: "open",
    note: "OPEN nested async. Children spawned by a subagent stay detached; completion never reaches the intermediate parent. Cite-only."
  },
  {
    id: 23909,
    state: "closed",
    note: "CLOSED. Main thread ends while subagents still run; human must poke for updates. Cite-only."
  },
  {
    id: 67524,
    state: "closed",
    note: "CLOSED (duplicate). Background subagents die silently on pause/resume; no failure notification. Cite-only."
  },
  {
    id: 88742,
    state: "open",
    note: "Related, different: enqueue succeeds but wake effect missed — item may sit undelivered. Larum's notice IS written into history. Cite-only."
  },
  {
    id: 90555,
    state: "open",
    note: "Related. Background Bash waiter completes but notification never re-invokes the session. Cite-only."
  },
  {
    id: 45581,
    state: "closed",
    note: "CLOSED. Notifications silently dropped when multiple agents complete within seconds — never arrive. Cite-only."
  },
  {
    id: 20754,
    state: "open",
    note: "Related. Parallel completions; some task-notifications never delivered. Cite-only."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "oubliette",
    issue: 92095,
    note: "Oubliette voids/forgets child notices against a cold parent — the queue never lands until an unrelated wake. Larum: the notice IS fully written into conversation history; the missing piece is specifically the model invocation / turn schedule after that append."
  },
  {
    slug: "tocsin",
    note: "Cousin wake/queue/delivery paradigm. Cite-only."
  },
  {
    slug: "alarum",
    note: "Cousin. Post-goodbye kill notification wakes an ended session — the opposite polarity (unwanted turn). Cite-only."
  },
  {
    slug: "knell",
    note: "Cousin wake/queue/delivery paradigm. Cite-only."
  },
  {
    slug: "hangfire",
    note: "Cousin. Queued /compact demoted to a plain prompt. Cite-only."
  },
  {
    slug: "heliostat",
    note: "Cousin. Terminal wake-bell / DECSET 2031. Cite-only."
  },
  {
    slug: "nixie",
    note: "Cousin. Send reports queued then settles undelivered. Cite-only."
  }
];

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

export function extractText(entry) {
  if (!entry || typeof entry !== "object") return "";
  const message = entry.message && typeof entry.message === "object" ? entry.message : entry;
  const content = message.content ?? entry.content ?? entry.text ?? "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (typeof block === "string") return block;
        if (block && typeof block === "object") {
          return String(block.text ?? block.content ?? "");
        }
        return "";
      })
      .join("\n");
  }
  return String(content || "");
}

export function isCompletedTaskNotification(entry) {
  if (!entry || entry.type !== "user") return false;
  const origin = entry.origin || {};
  if (origin.kind !== "task-notification") return false;
  return /<status>\s*completed\s*<\/status>/i.test(extractText(entry));
}

export function isAssistantEntry(entry) {
  return Boolean(entry && entry.type === "assistant");
}

export function isRealUserMessage(entry) {
  if (!entry || entry.type !== "user") return false;
  if (entry.isMeta === true) return false;
  const origin = entry.origin || {};
  if (origin.kind === "task-notification") return false;
  return true;
}

export function isMetaContinue(entry) {
  if (!entry || entry.type !== "user" || entry.isMeta !== true) return false;
  return /Continue from where you left off\./i.test(extractText(entry));
}

export function isSyntheticNoResponse(entry, parentUuid) {
  if (!entry || entry.type !== "assistant") return false;
  const model = entry.model ?? entry.message?.model;
  if (model !== "<synthetic>" && model !== "synthetic") return false;
  if (!/No response requested\./i.test(extractText(entry))) return false;
  if (parentUuid && entry.parentUuid && entry.parentUuid !== parentUuid) return false;
  return true;
}

export function parseEntries(probe = {}) {
  if (Array.isArray(probe)) return probe;
  if (Array.isArray(probe.entries)) return probe.entries;
  if (Array.isArray(probe.timeline)) return probe.timeline;
  if (typeof probe.jsonl === "string") {
    return probe.jsonl
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }
  return [];
}

export function fingerprint(entries = []) {
  const list = Array.isArray(entries) ? entries : [];
  const notices = [];
  for (let i = 0; i < list.length; i += 1) {
    const entry = list[i];
    if (!isCompletedTaskNotification(entry)) continue;
    let assistantBetween = 0;
    let nextRealUser = -1;
    let repair = false;
    for (let j = i + 1; j < list.length; j += 1) {
      const later = list[j];
      if (isAssistantEntry(later) && !isSyntheticNoResponse(later, entry.uuid)) {
        assistantBetween += 1;
      }
      if (isMetaContinue(later)) {
        const nxt = list[j + 1];
        if (isSyntheticNoResponse(nxt, entry.uuid)) repair = true;
      }
      if (isRealUserMessage(later)) {
        nextRealUser = j;
        break;
      }
    }
    const unanswered = assistantBetween === 0 && (nextRealUser !== -1 || repair || true);
    const roused = assistantBetween > 0 && !repair;
    notices.push({
      index: i,
      uuid: entry.uuid || "",
      originKind: entry.origin?.kind || "",
      completed: true,
      assistantBetween,
      nextRealUser,
      repair,
      unanswered: unanswered && !roused,
      roused
    });
  }
  const unansweredCount = notices.filter((n) => n.unanswered).length;
  const rousedCount = notices.filter((n) => n.roused).length;
  const lastUnanswered =
    notices.length > 0 && notices[notices.length - 1].unanswered && notices.length > 1;
  const anyRepair = notices.some((n) => n.repair);
  return {
    notices,
    unansweredCount,
    rousedCount,
    lastUnanswered,
    anyRepair,
    total: notices.length
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const entries = parseEntries(t);
  const print = entries.length ? fingerprint(entries) : null;
  const unanswered =
    boolish(t.unanswered) ||
    (print && print.unansweredCount > 0 && !boolish(t.roused));
  const roused =
    boolish(t.roused) ||
    (print && print.rousedCount > 0 && print.unansweredCount === 0 && !boolish(t.unanswered));
  return {
    unanswered,
    roused,
    lastOfBatch: boolish(t.lastOfBatch) || Boolean(print?.lastUnanswered),
    deliveredAndRoused: boolish(t.deliveredAndRoused),
    syntheticRepair: boolish(t.syntheticRepair) || Boolean(print?.anyRepair),
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    fingerprint: print,
    version: t.version || MEASURED.versions,
    platform: t.platform || "wsl",
    permissionMode: t.permissionMode || MEASURED.permissionMode
  };
}

export function seedUnanswered() {
  return {
    seed: "unanswered",
    issue: 92563,
    unanswered: true,
    roused: false,
    lastOfBatch: true,
    platform: "wsl",
    permissionMode: MEASURED.permissionMode
  };
}

export function seedRoused() {
  return {
    seed: "roused",
    issue: 92563,
    unanswered: false,
    roused: true,
    deliveredAndRoused: true,
    platform: "wsl",
    permissionMode: MEASURED.permissionMode
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const larum = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #21165 CLOSED first-of-batch processed rest queued until ESC; #39632 CLOSED race before enqueue; #75043 OPEN nested async; #23909 CLOSED main thread ends while subagents run; #67524 CLOSED silent death on pause; also related #88742 enqueued but wake effect missed (item may sit undelivered), #90555, #45581, #20754. Not Oubliette/#92095 (queue never lands). Primary stays #92563"
    );
    return {
      verdict: "cousins",
      reasons,
      unanswered: true,
      roused: false,
      chips: ["cousins", "unanswered"],
      larum
    };
  }

  if (
    seed === "unanswered" &&
    seed !== "last-of-batch" &&
    seed !== "synthetic-repair" &&
    seed !== "cousins"
  ) {
    reasons.push(
      "A larum is the watchtower bell that should start a turn the moment a completed background <task-notification> is written into the session. The notice is enqueued, dequeued, and appended as a user-role message — then no assistant turn ever starts. The ledger holds the result. The bell stays unanswered until a human nudge"
    );
    const chips = ["unanswered"];
    if (t.lastOfBatch === true || larum.lastOfBatch) chips.push("last-of-batch");
    if (t.syntheticRepair === true || larum.syntheticRepair) chips.push("synthetic-repair");
    return {
      verdict: "unanswered",
      reasons,
      unanswered: true,
      roused: false,
      chips: [...new Set(chips)],
      larum
    };
  }

  if (
    seed === "roused" ||
    (t.roused === true && t.unanswered !== true && seed !== "unanswered") ||
    (larum.roused && !larum.unanswered && seed !== "unanswered" && seed !== "last-of-batch")
  ) {
    reasons.push(
      "watch already roused — a completed task-notification is written into history and an assistant turn starts. Seeded word is roused. That is the ~99% path"
    );
    return {
      verdict: "roused",
      reasons,
      unanswered: false,
      roused: true,
      chips: t.deliveredAndRoused === true || seed === "delivered-and-roused"
        ? ["roused", "delivered-and-roused"]
        : ["roused"],
      larum
    };
  }

  if (seed === "delivered-and-roused" || t.deliveredAndRoused === true) {
    reasons.push(
      "delivered-and-roused — ~575 of ~580 notifications answered within seconds to two minutes. Enqueue, dequeue, user-role task-notification, then an assistant entry. Hold path"
    );
    return {
      verdict: "delivered-and-roused",
      reasons,
      unanswered: false,
      roused: true,
      chips: ["delivered-and-roused", "roused"],
      larum
    };
  }

  if (seed === "synthetic-repair" || t.syntheticRepair === true) {
    reasons.push(
      "at the next human nudge the harness inserts an isMeta user \"Continue from where you left off.\" plus a synthetic assistant \"No response requested.\" (model:\"<synthetic>\") whose parentUuid references the stalled notification — the harness itself records the notice as never answered"
    );
    return {
      verdict: "synthetic-repair",
      reasons,
      unanswered: true,
      roused: false,
      chips: ["synthetic-repair", "unanswered"],
      larum
    };
  }

  if (seed === "last-of-batch" || t.lastOfBatch === true) {
    reasons.push(
      "disproportionately the last pending notification of a parallel batch. A dropped wake on a non-final notice is masked when the next completion wakes the session; the final one leaves nothing else to trigger a turn. Six of seven incidents were dropped agent completions; one was a dropped background-Bash completion"
    );
    return {
      verdict: "last-of-batch",
      reasons,
      unanswered: true,
      roused: false,
      chips: ["last-of-batch", "unanswered"],
      larum
    };
  }

  if (
    t.unanswered === true ||
    seed === "unanswered" ||
    (larum.unanswered && !larum.roused)
  ) {
    reasons.push(
      "A larum is the watchtower bell that should start a turn the moment a completed background <task-notification> is written into the session. The notice is enqueued, dequeued, and appended as a user-role message — then no assistant turn ever starts. The ledger holds the result. The bell stays unanswered until a human nudge"
    );
    const chips = ["unanswered"];
    if (t.lastOfBatch === true || larum.lastOfBatch) chips.push("last-of-batch");
    if (t.syntheticRepair === true || larum.syntheticRepair) chips.push("synthetic-repair");
    return {
      verdict: "unanswered",
      reasons,
      unanswered: true,
      roused: false,
      chips: [...new Set(chips)],
      larum
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, unanswered: false, roused: true, chips: [seed], larum };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      unanswered: true,
      roused: false,
      chips: [seed],
      larum
    };
  }

  reasons.push(
    "empty probe; idle watchtower larum is unanswered — completed task-notification written into history, no assistant turn, session idles until a human nudge"
  );
  return {
    verdict: "unanswered",
    reasons,
    unanswered: true,
    roused: false,
    chips: ["unanswered"],
    larum
  };
}
