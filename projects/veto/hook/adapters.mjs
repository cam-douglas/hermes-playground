/**
 * Veto sinks. Slack alarm on vetoed / misattributed / deadlock,
 * GitHub ledger row on every scored probe, Linear silent-override
 * incident on vetoed / misattributed.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  const model = result.model || "model";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""} · ${model}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return verdict === "vetoed" || verdict === "misattributed" || verdict === "deadlock";
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "vetoed" || verdict === "misattributed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackVetoAlarm(result, env = process.env) {
  const webhook =
    env.VETO_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Veto ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Veto: palimpsest is ${result.verdict || "upheld"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Veto · ${result.verdict} overlay alarm` : `Veto · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*model* \`${result.model || "—"}\``,
            `*overlay* ${result.overlayPresent ? "down" : "absent"}`,
            `*ghost* ${result.namesGhostTool ? "AgentTool" : "none"}`,
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
      summary: `Would skip Slack — palimpsest is ${result.verdict || "upheld"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: overlay alarm — ${result.verdict} on the vellum.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} overlay alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubVetoLedger(result, env = process.env) {
  const token = env.VETO_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "veto",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    model: result.model,
    overlayPresent: result.overlayPresent,
    namesGhostTool: result.namesGhostTool,
    restored: result.restored,
    observedAgentDispatches: result.observedAgentDispatches,
    parentWriteBlocked: result.parentWriteBlocked,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub veto ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub veto ledger row as a private gist.",
    tokenPresent: true,
    line,
  };
}

export function linearSilentOverride(result, env = process.env) {
  const key = env.VETO_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Silent-override ${result.verdict} · Veto · ${result.source || "heron_brook"}`.trim();
  const description = [
    "Veto refused a session because a standing CLAUDE.md is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "misattributed"
      ? "The model blamed the user's CLAUDE.md for an Anthropic-authored heron_brook line."
      : "The injected AgentTool clamp outranked the user's mandated subagent. Zero Agent dispatches.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#80988 #88778 #82371 #87635 #80998 #82456 #81263 #84070 #82250 #88867 #80600 #81935.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — palimpsest is ${result.verdict || "upheld"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear silent-override incident: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear silent-override incident: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackVetoAlarm(result, env),
    githubVetoLedger(result, env),
    linearSilentOverride(result, env),
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
            ? `Posted ${result.verdict} overlay alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.VETO_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Veto ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "veto-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist veto ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.VETO_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.VETO_LINEAR_TEAM || "";
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
