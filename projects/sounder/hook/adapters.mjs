/**
 * Sounder sinks. Slack alarm on muted / stalled / orphaned /
 * deaf / dropped / stranded / cut / armed. GitHub
 * sounder-ledger of scored circuits on every score.
 * Linear ticket on muted / stalled. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Leat / Fusee / Cotter / Reveille / Shunt /
 * Husk / Binnacle / Pirn. A completed waiter is not a hold.
 * Score the sounder or admit keyed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./sounder.mjs";

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return SLACK_VERDICTS.includes(verdict);
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return LINEAR_VERDICTS.includes(verdict);
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackSounderAlarm(result, env = process.env) {
  const webhook =
    env.SOUNDER_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const ids = Array.isArray(result.waiterIds) ? result.waiterIds.join(",") : "";

  const text = alarm
    ? `Sounder ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Sounder: circuit is ${result.verdict || "keyed"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Sounder · ${result.verdict} circuit alarm` : `Sounder · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*waiter completed* ${result.waiterCompleted ? "yes" : "no"}`,
            `*notification delivered* ${result.notificationDelivered ? "yes" : "no"}`,
            `*session reinvoked* ${result.sessionReinvoked ? "yes" : "no"}`,
            `*human input required* ${result.humanInputRequired ? "yes" : "no"}`,
            `*idle hours* ${result.idleHours ?? 0}`,
            `*waiter IDs* ${ids || "-"}`,
            `*source* ${result.source || "-"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (!alarm) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would skip Slack. Sounder is ${result.verdict || "keyed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} circuit alarm on the sounder.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} circuit alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSounderLedger(result, env = process.env) {
  const token = env.SOUNDER_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "sounder",
    session: result.session,
    verdict: result.verdict,
    waiterCompleted: Boolean(result.waiterCompleted),
    notificationDelivered: Boolean(result.notificationDelivered),
    sessionReinvoked: Boolean(result.sessionReinvoked),
    humanInputRequired: Boolean(result.humanInputRequired),
    idleHours: result.idleHours ?? 0,
    waiterIds: Array.isArray(result.waiterIds) ? result.waiterIds : [],
    resumeAutofire: Boolean(result.resumeAutofire),
    enqueuedNotDelivered: Boolean(result.enqueuedNotDelivered),
    teammateIdle: Boolean(result.teammateIdle),
    headlessKilledAtTurnEnd: Boolean(result.headlessKilledAtTurnEnd),
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub sounder-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub sounder-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearSounderTicket(result, env = process.env) {
  const key = env.SOUNDER_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `sounder ${result.verdict} · Sounder · ${result.source || "desk"}`.trim();
  const description = [
    "Sounder scored a circuit because a completed waiter is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `waiter completed: ${result.waiterCompleted ? "yes" : "no"}`,
    `notification delivered: ${result.notificationDelivered ? "yes" : "no"}`,
    `session reinvoked: ${result.sessionReinvoked ? "yes" : "no"}`,
    `human input required: ${result.humanInputRequired ? "yes" : "no"}`,
    `idle hours: ${result.idleHours ?? 0}`,
    `waiter IDs: ${Array.isArray(result.waiterIds) ? result.waiterIds.join(", ") : "-"}`,
    "",
    loss
      ? "Muted or stalled: the waiter exited and the session never woke until a human typed."
      : "Not a muted / stalled sounder. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90555. Same-class #90534 #87689 #89505 #88423 #85534 #77300 #85129 #76174 (nearby shape only). NOT Leat / Fusee / Cotter / Reveille / Shunt / Husk / Binnacle / Pirn / leftover woodworking. NOT #88702 (never-exiting background task). openai/codex#15723 (background subprocesses do not wake the calling agent on completion).",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "keyed"} is not muted / stalled.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackSounderAlarm(result, env),
    githubSounderLedger(result, env),
    linearSounderTicket(result, env),
  ];
  const events = [];

  for (const plan of planned) {
    if (plan.mode !== "live" || !fetchImpl) {
      events.push({ ...plan, at: Date.now(), ok: true });
      continue;
    }

    try {
      if (plan.adapter === "slack" && plan.endpoint) {
        const response = await fetchImpl(plan.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plan.body),
        });
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Posted ${result.verdict} circuit alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SOUNDER_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Sounder circuit ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "sounder-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist sounder ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SOUNDER_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SOUNDER_LINEAR_TEAM || "";
        const response = await fetchImpl("https://api.linear.app/graphql", {
          method: "POST",
          headers: { Authorization: key, "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier url } } }",
            variables: {
              input: {
                title: plan.title,
                description: plan.description,
                ...(teamId ? { teamId } : {}),
              },
            },
          }),
        });
        const data = await response.json().catch(() => ({}));
        const issue = data?.data?.issueCreate?.issue;
        events.push({
          ...plan,
          at: Date.now(),
          ok: Boolean(issue),
          summary: issue
            ? `Opened Linear ${issue.identifier} ${issue.url}`
            : `Linear issueCreate failed: ${JSON.stringify(data.errors || data)}`,
        });
        continue;
      }

      events.push({ ...plan, at: Date.now(), ok: true });
    } catch (error) {
      events.push({
        ...plan,
        at: Date.now(),
        ok: false,
        summary: `${plan.adapter} failed: ${error instanceof Error ? error.message : "unknown"}`,
      });
    }
  }

  return { events };
}
