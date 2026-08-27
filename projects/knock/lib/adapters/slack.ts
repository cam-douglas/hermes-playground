import { slackApprovalBlocks, slackResolvedBlocks } from "../core.mjs";
import type { AdapterEvent, KnockRecord } from "../types";

function live() {
  return Boolean(process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID);
}

async function slackApi(method: string, body: Record<string, unknown>) {
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  return (await response.json()) as { ok: boolean; error?: string; ts?: string; channel?: string };
}

export async function postSlackKnock(knock: KnockRecord, publicUrl: string) {
  const payload = slackApprovalBlocks(knock, publicUrl);
  if (!live()) {
    const event: AdapterEvent = {
      at: Date.now(),
      adapter: "slack",
      mode: "demo",
      summary: `Simulated Block Kit card for ${knock.toolName}. Approve/deny live in this inbox.`,
    };
    return {
      knock: { ...knock, slackTs: `demo.${knock.id}`, slackChannel: "demo-inbox", events: [...knock.events, event] },
      event,
    };
  }

  const result = await slackApi("chat.postMessage", {
    channel: process.env.SLACK_CHANNEL_ID,
    text: payload.text,
    blocks: payload.blocks,
  });
  const event: AdapterEvent = {
    at: Date.now(),
    adapter: "slack",
    mode: "live",
    ok: result.ok,
    summary: result.ok
      ? `Posted approve/deny card to ${result.channel || process.env.SLACK_CHANNEL_ID}.`
      : `Slack chat.postMessage failed: ${result.error || "unknown"}`,
  };
  return {
    knock: {
      ...knock,
      slackTs: result.ts || null,
      slackChannel: result.channel || process.env.SLACK_CHANNEL_ID || null,
      events: [...knock.events, event],
    },
    event,
  };
}

export async function updateSlackKnock(knock: KnockRecord) {
  const payload = slackResolvedBlocks(knock);
  if (!live() || !knock.slackTs || !knock.slackChannel || knock.slackTs.startsWith("demo.")) {
    const event: AdapterEvent = {
      at: Date.now(),
      adapter: "slack",
      mode: live() ? "live" : "demo",
      summary: `Slack card resolved: ${knock.status}.`,
    };
    return { knock: { ...knock, events: [...knock.events, event] }, event };
  }
  const result = await slackApi("chat.update", {
    channel: knock.slackChannel,
    ts: knock.slackTs,
    text: payload.text,
    blocks: payload.blocks,
  });
  const event: AdapterEvent = {
    at: Date.now(),
    adapter: "slack",
    mode: "live",
    ok: result.ok,
    summary: result.ok ? `Updated Slack card to ${knock.status}.` : `Slack chat.update failed: ${result.error}`,
  };
  return { knock: { ...knock, events: [...knock.events, event] }, event };
}

export function parseSlackInteraction(body: string) {
  const params = new URLSearchParams(body);
  const payloadRaw = params.get("payload");
  if (!payloadRaw) return null;
  const payload = JSON.parse(payloadRaw) as {
    type?: string;
    user?: { username?: string; name?: string; id?: string };
    actions?: Array<{ action_id?: string; value?: string }>;
  };
  const action = payload.actions?.[0];
  if (!action?.value) return null;
  const allow = action.action_id === "knock_approve_btn";
  return {
    knockId: action.value,
    decision: allow ? "allow" : "deny",
    actor: payload.user?.username || payload.user?.name || payload.user?.id || "slack",
  };
}
