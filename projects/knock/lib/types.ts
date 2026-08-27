export type KnockStatus = "pending" | "allowed" | "denied" | "timed_out";

export type AdapterName = "slack" | "github" | "linear" | "inbox" | "timeout" | "webhook" | "hook";

export type AdapterEvent = {
  at: number;
  adapter: AdapterName;
  mode: "live" | "demo";
  summary: string;
  url?: string;
  ok?: boolean;
};

export type Grant = {
  runId: string;
  toolName: string;
  argHash: string;
  scope: "this_run_only";
};

export type KnockRecord = {
  id: string;
  status: KnockStatus;
  toolName: string;
  toolInput: unknown;
  argHash: string;
  agentId: string;
  runId: string;
  reason: string;
  hookEvent: string;
  createdAt: number;
  expiresAt: number;
  ttlSeconds: number;
  decidedAt: number | null;
  decidedBy: string | null;
  decisionReason: string;
  grant: Grant | null;
  callbackUrl: string;
  slackTs: string | null;
  slackChannel: string | null;
  githubCheckRunId: string | null;
  githubCommentId: string | null;
  linearIssueId: string | null;
  linearIssueUrl: string | null;
  events: AdapterEvent[];
};

export type PublicKnock = {
  id: string;
  status: KnockStatus;
  toolName: string;
  argHash: string;
  agentId: string;
  runId: string;
  reason: string;
  hookEvent: string;
  createdAt: number;
  expiresAt: number;
  decidedAt: number | null;
  decidedBy: string | null;
  decisionReason: string;
  remainingMs: number;
  ttlSeconds: number;
  grant: Grant | null;
  slackTs: string | null;
  githubCheckRunId: string | null;
  githubCommentId: string | null;
  linearIssueId: string | null;
  linearIssueUrl: string | null;
  events: AdapterEvent[];
};
