/**
 * Suture sinks. Slack tear alarm, GitHub suture ledger, Linear unrecovered-tear ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 * Slack and Linear skip when the tray is sealed, resumed, or discarded.
 */

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isQuiet(result) {
  const verdict = result.verdict || result.state;
  return verdict === "sealed" || verdict === "resumed" || verdict === "discarded";
}

export function slackTearAlarm(result, env = process.env) {
  const webhook =
    env.SUTURE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const quiet = isQuiet(result);

  const text = quiet
    ? `Suture: tray is ${result.verdict || "sealed"} on ${result.session || "session"}.`
    : `Suture ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: quiet ? `Suture · ${result.verdict}` : `Suture · ${result.verdict} alarm`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*source* ${result.source || "—"}`,
            `*checkpoint* ${result.checkpoint}`,
            `*incompleteTool* ${result.incompleteTool ? "true" : "false"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (quiet) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would skip Slack — tray is ${result.verdict || "sealed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: tear alarm — ${result.verdict} on the tray.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} tear alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSutureLedger(result, env = process.env) {
  const token = env.SUTURE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "suture",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    checkpoint: result.checkpoint,
    incompleteTool: result.incompleteTool,
    recovered: result.recovered,
    discarded: result.discarded,
    held: result.held,
    connection: result.connection,
    tear: result.tear,
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub suture ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub suture ledger row as a private gist.",
    tokenPresent: true,
    line,
  };
}

export function linearUnrecoveredTearTicket(result, env = process.env) {
  const key = env.SUTURE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const quiet = isQuiet(result);
  const title = `Unrecovered tear · Suture ${result.verdict} · ${result.source || "tray"}`.trim();
  const description = [
    "Suture blocked the session because a partial turn is not a hold.",
    "",
    headline(result),
    "",
    "Last complete tool boundary is the only safe suture point.",
    "Detect tears (idle timeout / mid-response close / stall with no message_stop).",
    "Snapshot events up to the last complete tool_use↔tool_result pair.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#46987 #47698 #54434 #33949 #47252 #70217 · openai/codex#3835.",
  ].join("\n");

  if (quiet) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — tray is ${result.verdict || "sealed"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear unrecovered-tear ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear unrecovered-tear ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackTearAlarm(result, env),
    githubSutureLedger(result, env),
    linearUnrecoveredTearTicket(result, env),
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
            ? `Posted ${result.verdict} tear alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SUTURE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Suture ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "suture-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist suture ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SUTURE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SUTURE_LINEAR_TEAM || "";
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
