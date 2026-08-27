import { createHash, randomBytes } from "node:crypto";

export const DEFAULT_TTL_SECONDS = 120;
export const DEFAULT_LINEAR_ESCALATE_SECONDS = 20;
export const MIN_TTL_SECONDS = 8;
export const MAX_TTL_SECONDS = 600;

export const STATUSES = Object.freeze({
  pending: "pending",
  allowed: "allowed",
  denied: "denied",
  timed_out: "timed_out",
});

export function clampTtl(value, fallback = DEFAULT_TTL_SECONDS) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_TTL_SECONDS, Math.max(MIN_TTL_SECONDS, Math.round(n)));
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export function hashArgs(toolInput) {
  return createHash("sha256").update(stableStringify(toolInput ?? {})).digest("hex").slice(0, 16);
}

export function newId(prefix = "kn") {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

export function nowIso(at = Date.now()) {
  return new Date(at).toISOString();
}

export function parseHookPayload(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const hookEvent = body.hook_event_name || body.hookEventName || body.event || "";
  const toolName =
    body.tool_name ||
    body.toolName ||
    body.tool ||
    (body.permission_request && body.permission_request.tool_name) ||
    "";
  const toolInput =
    body.tool_input ??
    body.toolInput ??
    body.arguments ??
    body.args ??
    (body.permission_request && body.permission_request.tool_input) ??
    {};
  const runId = body.run_id || body.runId || body.session_id || body.sessionId || "";
  const agentId =
    body.agent_id ||
    body.agentId ||
    body.subagent_id ||
    body.subagentId ||
    body.agent_type ||
    "parent";
  const reason =
    body.reason ||
    body.message ||
    (typeof body.permission_suggestions === "string" ? body.permission_suggestions : "") ||
    "Classifier or allowlist blocked this tool call.";
  const ttlSeconds = clampTtl(body.ttl_seconds || body.ttlSeconds || body.ttl);
  const callbackUrl = body.callback_url || body.callbackUrl || body.decision_webhook || "";
  const argHash = body.arg_hash || body.argHash || hashArgs(toolInput);

  if (!toolName) {
    return { ok: false, error: "tool_name is required" };
  }

  return {
    ok: true,
    hookEvent: hookEvent || "PermissionRequest",
    toolName: String(toolName),
    toolInput,
    argHash,
    agentId: String(agentId),
    runId: String(runId || newId("run")),
    reason: String(reason).slice(0, 800),
    ttlSeconds,
    callbackUrl: String(callbackUrl),
    sessionId: body.session_id || body.sessionId || "",
    cwd: body.cwd || "",
    permissionMode: body.permission_mode || body.permissionMode || "",
  };
}

export function expiresAtFrom(createdAtMs, ttlSeconds) {
  return createdAtMs + ttlSeconds * 1000;
}

export function remainingMs(knock, now = Date.now()) {
  if (!knock || knock.status !== STATUSES.pending) return 0;
  return Math.max(0, knock.expiresAt - now);
}

export function shouldTimeout(knock, now = Date.now()) {
  return Boolean(knock) && knock.status === STATUSES.pending && now >= knock.expiresAt;
}

export function shouldEscalateLinear(knock, escalateAfterSeconds, now = Date.now()) {
  if (!knock || knock.status !== STATUSES.pending) return false;
  if (knock.linearIssueId) return false;
  return now - knock.createdAt >= escalateAfterSeconds * 1000;
}

export function applyDecision(knock, decision, actor, now = Date.now()) {
  if (!knock) return { ok: false, error: "knock not found" };
  if (knock.status !== STATUSES.pending) {
    return { ok: false, error: `already ${knock.status}`, knock };
  }
  const allowed = decision === "allow" || decision === "allowed" || decision === STATUSES.allowed;
  const timedOut = decision === "timeout" || decision === STATUSES.timed_out;
  const status = timedOut ? STATUSES.timed_out : allowed ? STATUSES.allowed : STATUSES.denied;
  const next = {
    ...knock,
    status,
    decidedAt: now,
    decidedBy: actor || (timedOut ? "timeout" : "human"),
    decisionReason: timedOut
      ? "Nobody answered. Fail-loud deny so the run never hangs."
      : allowed
        ? "Scoped allow for this run only."
        : "Gate kept shut.",
    grant: allowed
      ? {
          runId: knock.runId,
          toolName: knock.toolName,
          argHash: knock.argHash,
          scope: "this_run_only",
        }
      : null,
  };
  return { ok: true, knock: next };
}

export function hookDecisionPayload(knock) {
  const allow = knock.status === STATUSES.allowed;
  const behavior = allow ? "allow" : "deny";
  const reason =
    knock.status === STATUSES.timed_out
      ? "Knock timeout: nobody answered. Denied so the run cannot stall."
      : allow
        ? "Knock grant: scoped to this run only."
        : "Knock deny.";
  return {
    permissionDecision: behavior,
    decision: behavior,
    reason,
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      decision: {
        behavior,
        message: reason,
        interrupt: !allow,
      },
    },
    grant: knock.grant,
    knockId: knock.id,
    status: knock.status,
    decidedBy: knock.decidedBy,
  };
}

export function slackApprovalBlocks(knock, publicUrl) {
  const inbox = publicUrl ? `${publicUrl.replace(/\/$/, "")}/#${knock.id}` : "";
  const ttlSec = Math.max(1, Math.round((knock.expiresAt - knock.createdAt) / 1000));
  return {
    text: `Knock: ${knock.toolName} needs a grant for run ${knock.runId}`,
    blocks: [
      {
        type: "header",
        block_id: `knock_header_${knock.id}`,
        text: { type: "plain_text", text: "Knock — grant requested", emoji: false },
      },
      {
        type: "section",
        block_id: `knock_body_${knock.id}`,
        text: {
          type: "mrkdwn",
          text: [
            `*${knock.toolName}* is waiting at the harness gate.`,
            `Agent \`${knock.agentId}\` · run \`${knock.runId}\``,
            `Arg hash \`${knock.argHash}\``,
            knock.reason ? `_ ${knock.reason} _` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        },
        fields: [
          { type: "mrkdwn", text: `*TTL*\n${ttlSec}s then deny` },
          { type: "mrkdwn", text: `*Scope*\nthis run only` },
        ],
      },
      { type: "divider", block_id: `knock_div_${knock.id}` },
      {
        type: "actions",
        block_id: `knock_actions_${knock.id}`,
        elements: [
          {
            type: "button",
            action_id: "knock_approve_btn",
            text: { type: "plain_text", text: "Allow this run", emoji: false },
            style: "primary",
            value: knock.id,
          },
          {
            type: "button",
            action_id: "knock_deny_btn",
            text: { type: "plain_text", text: "Deny", emoji: false },
            style: "danger",
            value: knock.id,
          },
        ],
      },
      {
        type: "context",
        block_id: `knock_ctx_${knock.id}`,
        elements: [
          {
            type: "mrkdwn",
            text: inbox
              ? `Fails loud if nobody answers. Inbox: ${inbox}`
              : "Fails loud if nobody answers. Grant is scoped to this run.",
          },
        ],
      },
    ],
  };
}

export function slackResolvedBlocks(knock) {
  const verb =
    knock.status === STATUSES.allowed
      ? "Allowed"
      : knock.status === STATUSES.timed_out
        ? "Timed out — denied"
        : "Denied";
  return {
    text: `Knock ${verb}: ${knock.toolName} for run ${knock.runId}`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `Knock — ${verb}`, emoji: false },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${knock.toolName}* · \`${knock.agentId}\` · run \`${knock.runId}\`\nDecided by *${knock.decidedBy}*. ${knock.decisionReason}`,
        },
      },
    ],
  };
}

export function githubLedgerBody(knock) {
  const state = knock.status.toUpperCase();
  return [
    `### Knock grant ledger`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| Status | ${state} |`,
    `| Tool | \`${knock.toolName}\` |`,
    `| Arg hash | \`${knock.argHash}\` |`,
    `| Agent | \`${knock.agentId}\` |`,
    `| Run | \`${knock.runId}\` |`,
    `| Decided by | ${knock.decidedBy || "—"} |`,
    ``,
    knock.grant
      ? `Grant is scoped to **this run only**. It is not a standing allowlist entry.`
      : `No grant issued.`,
  ].join("\n");
}

export function linearIssueDraft(knock) {
  return {
    title: `Blocked agent: ${knock.toolName} · ${knock.runId}`,
    description: [
      `A parent/subagent is dead-waiting on a harness permission gate.`,
      ``,
      `**Tool:** \`${knock.toolName}\``,
      `**Arg hash:** \`${knock.argHash}\``,
      `**Agent:** \`${knock.agentId}\``,
      `**Run:** \`${knock.runId}\``,
      `**Reason:** ${knock.reason}`,
      `**Expires:** ${new Date(knock.expiresAt).toISOString()}`,
      ``,
      `If nobody answers, Knock will deny so the run cannot hang for 55 minutes.`,
    ].join("\n"),
  };
}

export function adapterMode(env = process.env) {
  return {
    slack: Boolean(env.SLACK_BOT_TOKEN && env.SLACK_CHANNEL_ID),
    github: Boolean(
      (env.GITHUB_TOKEN || (env.GITHUB_APP_ID && env.GITHUB_APP_PRIVATE_KEY)) &&
        env.GITHUB_OWNER &&
        env.GITHUB_REPO,
    ),
    linear: Boolean(env.LINEAR_API_KEY && env.LINEAR_TEAM_ID),
  };
}

export function isDemoMode(env = process.env) {
  const mode = adapterMode(env);
  return !mode.slack || !mode.github || !mode.linear;
}

export function seedKnocks(now = Date.now()) {
  const mk = (partial) => ({
    events: [],
    callbackUrl: "",
    slackTs: null,
    slackChannel: null,
    githubCheckRunId: null,
    githubCommentId: null,
    linearIssueId: null,
    linearIssueUrl: null,
    grant: null,
    decidedAt: null,
    decidedBy: null,
    decisionReason: "",
    ...partial,
  });

  const pending = mk({
    id: "kn_demo_pending",
    status: STATUSES.pending,
    toolName: "mcp__github__create_or_update_file",
    toolInput: { path: "secrets.env", content: "redacted" },
    argHash: hashArgs({ path: "secrets.env", content: "redacted" }),
    agentId: "subagent-review",
    runId: "run_86126",
    reason: "Classifier denied MCP write. No per-run grant surface.",
    hookEvent: "PermissionRequest",
    createdAt: now - 18_000,
    expiresAt: now + 102_000,
    ttlSeconds: 120,
    events: [
      {
        at: now - 18_000,
        adapter: "slack",
        mode: "demo",
        summary: "Posted approve/deny card to #agent-gates (simulated).",
      },
      {
        at: now - 17_500,
        adapter: "github",
        mode: "demo",
        summary: "Opened in-progress check-run on the grant ledger (simulated).",
      },
    ],
  });

  const allowed = mk({
    id: "kn_demo_allowed",
    status: STATUSES.allowed,
    toolName: "Bash",
    toolInput: { command: "npm test" },
    argHash: hashArgs({ command: "npm test" }),
    agentId: "parent",
    runId: "run_69482",
    reason: "Remote permission prompt was invisible to the human not staring at the TUI.",
    hookEvent: "PreToolUse",
    createdAt: now - 9 * 60_000,
    expiresAt: now - 7 * 60_000,
    decidedAt: now - 8 * 60_000,
    decidedBy: "ada@ops",
    decisionReason: "Scoped allow for this run only.",
    ttlSeconds: 120,
    grant: {
      runId: "run_69482",
      toolName: "Bash",
      argHash: hashArgs({ command: "npm test" }),
      scope: "this_run_only",
    },
    events: [
      { at: now - 9 * 60_000, adapter: "slack", mode: "demo", summary: "Card posted (simulated)." },
      { at: now - 8 * 60_000, adapter: "inbox", mode: "demo", summary: "ada@ops allowed this run." },
      { at: now - 8 * 60_000, adapter: "github", mode: "demo", summary: "Check-run completed: ALLOW (simulated)." },
    ],
  });

  const denied = mk({
    id: "kn_demo_denied",
    status: STATUSES.denied,
    toolName: "Read",
    toolInput: { path: "/etc/shadow" },
    argHash: hashArgs({ path: "/etc/shadow" }),
    agentId: "subagent-recon",
    runId: "run_78487",
    reason: "Tool is outside the run allowlist.",
    hookEvent: "PermissionRequest",
    createdAt: now - 40 * 60_000,
    expiresAt: now - 38 * 60_000,
    decidedAt: now - 39 * 60_000,
    decidedBy: "sam@sec",
    decisionReason: "Gate kept shut.",
    ttlSeconds: 120,
    events: [
      { at: now - 39 * 60_000, adapter: "inbox", mode: "demo", summary: "sam@sec denied the grant." },
      { at: now - 39 * 60_000, adapter: "linear", mode: "demo", summary: "Closed blocked-agent issue (simulated)." },
    ],
  });

  const timedOut = mk({
    id: "kn_demo_timeout",
    status: STATUSES.timed_out,
    toolName: "mcp__linear__create_issue",
    toolInput: { title: "follow up" },
    argHash: hashArgs({ title: "follow up" }),
    agentId: "unattended-nightly",
    runId: "run_silent_55",
    reason: "Nobody was in the TUI. Documented silent stalls run 19–58 minutes.",
    hookEvent: "PermissionRequest",
    createdAt: now - 3 * 60_000,
    expiresAt: now - 60_000,
    decidedAt: now - 60_000,
    decidedBy: "timeout",
    decisionReason: "Nobody answered. Fail-loud deny so the run never hangs.",
    ttlSeconds: 120,
    events: [
      { at: now - 60_000, adapter: "timeout", mode: "demo", summary: "TTL elapsed. Denied loud." },
    ],
  });

  return [pending, allowed, denied, timedOut];
}

export function publicKnock(knock, now = Date.now()) {
  if (!knock) return null;
  return {
    id: knock.id,
    status: knock.status,
    toolName: knock.toolName,
    argHash: knock.argHash,
    agentId: knock.agentId,
    runId: knock.runId,
    reason: knock.reason,
    hookEvent: knock.hookEvent,
    createdAt: knock.createdAt,
    expiresAt: knock.expiresAt,
    decidedAt: knock.decidedAt,
    decidedBy: knock.decidedBy,
    decisionReason: knock.decisionReason,
    remainingMs: remainingMs(knock, now),
    ttlSeconds: knock.ttlSeconds,
    grant: knock.grant,
    slackTs: knock.slackTs,
    githubCheckRunId: knock.githubCheckRunId,
    githubCommentId: knock.githubCommentId,
    linearIssueId: knock.linearIssueId,
    linearIssueUrl: knock.linearIssueUrl,
    events: knock.events || [],
  };
}
