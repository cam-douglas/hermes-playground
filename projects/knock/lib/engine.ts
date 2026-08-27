import { postSlackKnock, updateSlackKnock } from "./adapters/slack";
import { writeGithubLedger } from "./adapters/github";
import { closeLinearBlockedIssue, openLinearBlockedIssue } from "./adapters/linear";
import { publish } from "./bus";
import {
  adapterMode,
  applyDecision,
  clampTtl,
  DEFAULT_LINEAR_ESCALATE_SECONDS,
  DEFAULT_TTL_SECONDS,
  isDemoMode,
  newId,
  parseHookPayload,
  publicKnock,
  shouldEscalateLinear,
  shouldTimeout,
} from "./core.mjs";
import { getKnock, listKnocks, persistenceKind, replaceKnock, upsertKnock } from "./store";
import type { KnockRecord, PublicKnock } from "./types";

export function publicUrl() {
  return (process.env.KNOCK_PUBLIC_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "").replace(/\/$/, "");
}

export function statusPayload() {
  const adapters = adapterMode();
  return {
    name: "Knock",
    demo: isDemoMode(),
    persistence: persistenceKind(),
    adapters,
    ttlSeconds: clampTtl(process.env.KNOCK_TTL_SECONDS, DEFAULT_TTL_SECONDS),
    linearEscalateAfterSeconds: clampTtl(
      process.env.LINEAR_ESCALATE_AFTER_SECONDS,
      DEFAULT_LINEAR_ESCALATE_SECONDS,
    ),
    note: isDemoMode()
      ? "Missing Slack, GitHub, or Linear secrets. Live adapters that are unset are simulated in the inbox. Decisions still change grant state."
      : "Live Slack, GitHub, and Linear credentials are set.",
  };
}

function emit(type: string, knock: KnockRecord | null) {
  publish({
    type,
    at: Date.now(),
    knock: knock ? publicKnock(knock) : null,
    status: statusPayload(),
  });
}

async function notifyCallback(knock: KnockRecord) {
  if (!knock.callbackUrl) return knock;
  try {
    await fetch(knock.callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publicKnock(knock)),
    });
    return upsertKnock({
      ...knock,
      events: [
        ...knock.events,
        { at: Date.now(), adapter: "webhook", mode: "live", summary: "Posted decision webhook to the waiting hook." },
      ],
    });
  } catch (error) {
    return upsertKnock({
      ...knock,
      events: [
        ...knock.events,
        {
          at: Date.now(),
          adapter: "webhook",
          mode: "live",
          ok: false,
          summary: `Decision webhook failed: ${error instanceof Error ? error.message : "unknown"}`,
        },
      ],
    });
  }
}

export async function sweep() {
  const escalateAfter = clampTtl(
    process.env.LINEAR_ESCALATE_AFTER_SECONDS,
    DEFAULT_LINEAR_ESCALATE_SECONDS,
  );
  const now = Date.now();
  for (const knock of listKnocks()) {
    if (shouldTimeout(knock, now)) {
      await decideKnock(knock.id, "timeout", "timeout");
      continue;
    }
    if (shouldEscalateLinear(knock, escalateAfter, now)) {
      const opened = await openLinearBlockedIssue(knock);
      upsertKnock(opened.knock);
      emit("linear", opened.knock);
    }
  }
}

export async function createKnock(raw: unknown) {
  await sweep();
  const parsed = parseHookPayload(raw);
  if (!parsed.ok) return { ok: false as const, error: parsed.error, status: 400 };

  const existing = listKnocks().find(
    (item) =>
      item.status === "pending" &&
      item.runId === parsed.runId &&
      item.toolName === parsed.toolName &&
      item.argHash === parsed.argHash,
  );
  if (existing) {
    return { ok: true as const, knock: publicKnock(existing) as PublicKnock, reused: true };
  }

  const createdAt = Date.now();
  let record: KnockRecord = {
    id: newId("kn"),
    status: "pending",
    toolName: parsed.toolName,
    toolInput: parsed.toolInput,
    argHash: parsed.argHash,
    agentId: parsed.agentId,
    runId: parsed.runId,
    reason: parsed.reason,
    hookEvent: parsed.hookEvent,
    createdAt,
    expiresAt: createdAt + parsed.ttlSeconds * 1000,
    ttlSeconds: parsed.ttlSeconds,
    decidedAt: null,
    decidedBy: null,
    decisionReason: "",
    grant: null,
    callbackUrl: parsed.callbackUrl,
    slackTs: null,
    slackChannel: null,
    githubCheckRunId: null,
    githubCommentId: null,
    linearIssueId: null,
    linearIssueUrl: null,
    events: [
      {
        at: createdAt,
        adapter: "hook",
        mode: "live",
        summary: `${parsed.hookEvent} from ${parsed.agentId} on run ${parsed.runId}.`,
      },
    ],
  };

  record = (await postSlackKnock(record, publicUrl() || "http://localhost:3100")).knock;
  record = (await writeGithubLedger(record, "open")).knock;
  record = upsertKnock(record);
  emit("created", record);
  return { ok: true as const, knock: publicKnock(record) as PublicKnock, reused: false };
}

export async function decideKnock(id: string, decision: string, actor: string) {
  const current = getKnock(id);
  if (!current) return { ok: false as const, error: "knock not found", status: 404 };

  const applied = applyDecision(current, decision, actor);
  if (!applied.ok || !applied.knock) {
    return { ok: false as const, error: applied.error, status: 409, knock: publicKnock(current) };
  }

  let record = applied.knock as KnockRecord;
  record.events = [
    ...record.events,
    {
      at: record.decidedAt || Date.now(),
      adapter: record.status === "timed_out" ? "timeout" : "inbox",
      mode: "live",
      summary:
        record.status === "timed_out"
          ? "TTL elapsed. Denied loud so the run cannot hang."
          : `${record.decidedBy} ${record.status === "allowed" ? "allowed" : "denied"} ${record.toolName} for ${record.runId}.`,
    },
  ];
  record = upsertKnock(record);
  record = (await updateSlackKnock(record)).knock;
  record = (await writeGithubLedger(record, "resolve")).knock;
  record = (await closeLinearBlockedIssue(record)).knock;
  record = await notifyCallback(record);
  record = upsertKnock(record);
  emit("decided", record);
  return { ok: true as const, knock: publicKnock(record) as PublicKnock };
}

export async function listPublicKnocks() {
  await sweep();
  return listKnocks().map((item) => publicKnock(item));
}

export async function getPublicKnock(id: string) {
  await sweep();
  const found = getKnock(id);
  return found ? publicKnock(found) : null;
}

export function waitForDecision(id: string, timeoutMs = 25_000) {
  return new Promise<PublicKnock | null>((resolve) => {
    const started = Date.now();
    const tick = async () => {
      await sweep();
      const found = getKnock(id);
      if (!found) {
        resolve(null);
        return;
      }
      if (found.status !== "pending") {
        resolve(publicKnock(found));
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(publicKnock(found));
        return;
      }
      setTimeout(() => {
        void tick();
      }, 400);
    };
    void tick();
  });
}

export { replaceKnock };
