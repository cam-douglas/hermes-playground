/**
 * Tain sinks. Slack silvered/strayed alarm, GitHub pairing-ledger issue
 * on every scored probe, Linear stray-browser ticket on strayed.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return verdict === "silvered" || verdict === "strayed";
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "strayed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackTainAlarm(result, env = process.env) {
  const webhook =
    env.TAIN_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Tain ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Tain: pairing channel is ${result.verdict || "paired"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Tain · ${result.verdict} pairing alarm` : `Tain · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*live-renders* ${result.liveRendersSession ? "yes" : "no"}`,
            `*list* ${Array.isArray(result.browsers) ? result.browsers.length : 0}`,
            `*isLocal bind* ${result.boundMachine || "—"}`,
            `*this machine* ${result.thisMachine || "—"}`,
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
      summary: `Would skip Slack — pairing channel is ${result.verdict || "paired"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} pairing alarm on the glass.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} pairing alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubTainLedger(result, env = process.env) {
  const token = env.TAIN_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "tain",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    liveRendersSession: result.liveRendersSession,
    browsers: result.browsers,
    mcpConnected: result.mcpConnected,
    thisMachine: result.thisMachine,
    boundMachine: result.boundMachine,
    assignedName: result.assignedName,
    nativeHosts: result.nativeHosts,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub pairing-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub pairing-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearTainTicket(result, env = process.env) {
  const key = env.TAIN_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Stray browser ${result.verdict} · Tain · ${result.source || "Chrome pairing"}`.trim();
  const description = [
    "Tain refused a pairing because a silvered tain is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "strayed"
      ? "Cowork bound Chrome actions to a browser on another physical machine."
      : "Pairing channel named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90257 #83518 #78096 #86937 #74667 #89551 #74902 #90153 #89302 #82412.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — pairing channel is ${result.verdict || "paired"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear stray-browser ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear stray-browser ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackTainAlarm(result, env),
    githubTainLedger(result, env),
    linearTainTicket(result, env),
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
            ? `Posted ${result.verdict} pairing alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.TAIN_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Tain pairing ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "tain-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist pairing ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.TAIN_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.TAIN_LINEAR_TEAM || "";
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
