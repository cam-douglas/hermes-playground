/**
 * Cote sinks. Slack drained/parked/stray/crossed/consumed/late
 * alarm, GitHub cote-ledger issue on every scored probe, Linear
 * ticket on drained / parked / consumed. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Larder (stillroom / plugin-store). NOT Tappet (valve
 * train / hook injection). NOT Aside (/btw). NOT Husk (hollow
 * SUCCESS). Resume hub identity + inbox routing only.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "drained" ||
    verdict === "parked" ||
    verdict === "stray" ||
    verdict === "crossed" ||
    verdict === "consumed" ||
    verdict === "late"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "drained" || verdict === "parked" || verdict === "consumed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackCoteAlarm(result, env = process.env) {
  const webhook =
    env.COTE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Cote ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Cote: loft is ${result.verdict || "roosted"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Cote · ${result.verdict} loft alarm` : `Cote · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*leadSessionId* ${result.leadSessionId || "—"}`,
            `*live / resumed* ${result.resumedId || result.liveSessionId || "—"}`,
            `*SendMessage success* ${result.sendSuccess ? "true" : "false"}`,
            `*inbox emptied* ${result.inboxEmptied ? "[]" : "no"}`,
            `*msg_id in parent* ${result.msgIdInParent ? "yes" : "no"}`,
            `*source* ${result.source || "—"}`,
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
      summary: `Would skip Slack — loft is ${result.verdict || "roosted"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} loft alarm in the dove-cote.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} loft alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCoteLedger(result, env = process.env) {
  const token = env.COTE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "cote",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    leadSessionId: result.leadSessionId,
    resumedId: result.resumedId,
    sendSuccess: result.sendSuccess,
    inboxEmptied: result.inboxEmptied,
    msgIdInParent: result.msgIdInParent,
    agentIdle: result.agentIdle,
    teamCreatedBeforeResume: result.teamCreatedBeforeResume,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub cote-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub cote-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearCoteTicket(result, env = process.env) {
  const key = env.COTE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Resume hub ${result.verdict} · Cote · ${result.source || "agent-teams"}`.trim();
  const description = [
    "Cote refused a roost because a success receipt is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "drained"
      ? "Inbox emptied to []; msg_id absent from the parent transcript."
      : result.verdict === "parked"
        ? "Named agent stays alive and idle after a consumed-but-undelivered SendMessage."
        : result.verdict === "consumed"
          ? "Watcher took the inbox item; the parent never saw it."
          : "Loft named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90332. Shape, not the same bug: #76844 #80315 #83599 #81438 #84819 #85047 #90247 #90338.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — loft is ${result.verdict || "roosted"}.`,
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
    slackCoteAlarm(result, env),
    githubCoteLedger(result, env),
    linearCoteTicket(result, env),
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
            ? `Posted ${result.verdict} loft alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.COTE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Cote loft ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "cote-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist loft ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.COTE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.COTE_LINEAR_TEAM || "";
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
