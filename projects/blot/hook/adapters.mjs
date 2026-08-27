/**
 * Blot sinks. Slack blot alarm, GitHub blot ledger, Linear recovery ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 * Slack and Linear skip on clear.
 */

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isClear(result) {
  return result.verdict === "clear" || result.state === "clear";
}

export function slackBlotAlarm(result, env = process.env) {
  const webhook =
    env.BLOT_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const clear = isClear(result);

  const text = clear
    ? `Blot: tray is clear on ${result.session || "session"}.`
    : `Blot ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: clear ? "Blot · clear" : `Blot · ${result.verdict} alarm`,
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
            `*poison* ${Array.isArray(result.poison) ? result.poison.length : 0}`,
            `*recovered* ${result.recovered ? "true" : "false"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (clear) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: "Would skip Slack — tray is clear.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: blot alarm — ${result.verdict} on the tray.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} blot alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubBlotLedger(result, env = process.env) {
  const token = env.BLOT_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "blot",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    poison: Array.isArray(result.poison) ? result.poison.length : 0,
    recovered: result.recovered,
    abandoned: result.abandoned,
    looping: result.looping,
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub blot ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub blot ledger row as a private gist.",
    tokenPresent: true,
    line,
  };
}

export function linearRecoveryTicket(result, env = process.env) {
  const key = env.BLOT_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const clear = isClear(result);
  const title = `Recover · Blot ${result.verdict} · ${result.source || "tray"}`.trim();
  const description = [
    "Blot blocked the session because a bad frame is not a hold.",
    "",
    headline(result),
    "",
    "Inspect every image frame. Score it. Strip the blot.",
    "Replace the poison block with a text placeholder so the session can continue.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#24387 #16169 #32764 #47391 #50708 · openai/codex#10833 #7214.",
  ].join("\n");

  if (clear) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: "Would skip Linear — tray is clear.",
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear recovery ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear recovery ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackBlotAlarm(result, env),
    githubBlotLedger(result, env),
    linearRecoveryTicket(result, env),
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
            ? `Posted ${result.verdict} blot alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.BLOT_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Blot ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "blot-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist blot ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.BLOT_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.BLOT_LINEAR_TEAM || "";
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
