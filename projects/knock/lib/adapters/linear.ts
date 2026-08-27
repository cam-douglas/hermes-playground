import { linearIssueDraft } from "../core.mjs";
import type { AdapterEvent, KnockRecord } from "../types";

function live() {
  return Boolean(process.env.LINEAR_API_KEY && process.env.LINEAR_TEAM_ID);
}

async function linearGql(query: string, variables: Record<string, unknown>) {
  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      Authorization: process.env.LINEAR_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  return (await response.json()) as {
    data?: Record<string, unknown>;
    errors?: Array<{ message: string }>;
  };
}

export async function openLinearBlockedIssue(knock: KnockRecord) {
  const draft = linearIssueDraft(knock);
  if (!live()) {
    const fakeId = `LIN-DEMO-${knock.id.slice(-4).toUpperCase()}`;
    const event: AdapterEvent = {
      at: Date.now(),
      adapter: "linear",
      mode: "demo",
      summary: `Opened blocked-agent issue ${fakeId} (simulated). Closes on decision.`,
    };
    return {
      knock: {
        ...knock,
        linearIssueId: fakeId,
        linearIssueUrl: `https://linear.app/demo/issue/${fakeId}`,
        events: [...knock.events, event],
      },
      event,
    };
  }

  const result = await linearGql(
    `mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier url }
      }
    }`,
    {
      input: {
        teamId: process.env.LINEAR_TEAM_ID,
        title: draft.title,
        description: draft.description,
      },
    },
  );
  const created = (result.data?.issueCreate || {}) as {
    success?: boolean;
    issue?: { id?: string; identifier?: string; url?: string };
  };
  const event: AdapterEvent = {
    at: Date.now(),
    adapter: "linear",
    mode: "live",
    ok: Boolean(created.success),
    url: created.issue?.url,
    summary: created.success
      ? `Opened blocked-agent issue ${created.issue?.identifier}.`
      : `Linear issueCreate failed: ${result.errors?.[0]?.message || "unknown"}`,
  };
  return {
    knock: {
      ...knock,
      linearIssueId: created.issue?.id || knock.linearIssueId,
      linearIssueUrl: created.issue?.url || knock.linearIssueUrl,
      events: [...knock.events, event],
    },
    event,
  };
}

export async function closeLinearBlockedIssue(knock: KnockRecord) {
  if (!knock.linearIssueId) return { knock, event: null as AdapterEvent | null };
  if (!live() || knock.linearIssueId.startsWith("LIN-DEMO")) {
    const event: AdapterEvent = {
      at: Date.now(),
      adapter: "linear",
      mode: live() ? "live" : "demo",
      summary: `Closed ${knock.linearIssueId} after ${knock.status}.`,
    };
    return { knock: { ...knock, events: [...knock.events, event] }, event };
  }

  const stateId = process.env.LINEAR_DONE_STATE_ID;
  const result = stateId
    ? await linearGql(
        `mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
          issueUpdate(id: $id, input: $input) { success }
        }`,
        { id: knock.linearIssueId, input: { stateId } },
      )
    : await linearGql(
        `mutation IssueArchive($id: String!) {
          issueArchive(id: $id) { success }
        }`,
        { id: knock.linearIssueId },
      );
  const event: AdapterEvent = {
    at: Date.now(),
    adapter: "linear",
    mode: "live",
    ok: !result.errors,
    summary: result.errors
      ? `Linear close failed: ${result.errors[0]?.message}`
      : `Closed blocked-agent issue after ${knock.status}.`,
  };
  return { knock: { ...knock, events: [...knock.events, event] }, event };
}
