/**
 * Wicket sinks. Slack isolation alarm, GitHub isolation ledger,
 * Linear data-loss incident on escape that mutated main or reset --hard.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 * Slack fires on escape / latch / reap.
 */

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  const path = result.filePath || result.cwd || result.pin || "gate";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""} · ${path}`;
}

function isQuiet(result) {
  const verdict = result.verdict || result.state;
  return !["escape", "latch", "reap", "hijack", "split"].includes(verdict);
}

function isDataLoss(result) {
  return Boolean(result.dataLoss);
}

export function slackIsolationAlarm(result, env = process.env) {
  const webhook =
    env.WICKET_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const quiet = isQuiet(result);

  const text = quiet
    ? `Wicket: gate is ${result.verdict || "home"} on ${result.session || "session"}.`
    : `Wicket ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: quiet ? `Wicket · ${result.verdict}` : `Wicket · ${result.verdict} isolation alarm`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*pin* \`${result.pin || "—"}\``,
            `*path* \`${result.filePath || "—"}\``,
            `*cwd* \`${result.cwd || "—"}\``,
            `*source* ${result.source || "—"}`,
            `*dataLoss* ${result.dataLoss ? "true" : "false"}`,
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
      summary: `Would skip Slack — gate is ${result.verdict || "home"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: isolation alarm — ${result.verdict} at the gate.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} isolation alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubIsolationLedger(result, env = process.env) {
  const token = env.WICKET_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "wicket",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    pin: result.pin,
    main: result.main,
    filePath: result.filePath,
    cwd: result.cwd,
    tool: result.tool,
    contained: result.contained,
    dataLoss: result.dataLoss,
    prefixFalseFriend: result.prefixFalseFriend,
    rebound: result.rebound,
    refused: result.refused,
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub isolation ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub isolation ledger row as a private gist.",
    tokenPresent: true,
    line,
  };
}

export function linearDataLossIncident(result, env = process.env) {
  const key = env.WICKET_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isDataLoss(result);
  const title = `Data-loss escape · Wicket ${result.verdict} · ${result.source || "gate"}`.trim();
  const description = [
    "Wicket blocked a write because isolation is a pin, not a promise.",
    "",
    headline(result),
    "",
    result.resetHard
      ? "git reset --hard ran one directory up from the pinned worktree. Guard silent."
      : "Edit/Write absolute path landed in the main checkout.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#74726 #81333 #86584 #89102 #85448 #59628 #56137 #64322.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — gate is ${result.verdict || "home"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear data-loss incident: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear data-loss incident: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackIsolationAlarm(result, env),
    githubIsolationLedger(result, env),
    linearDataLossIncident(result, env),
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
            ? `Posted ${result.verdict} isolation alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.WICKET_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Wicket ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "wicket-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist wicket ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.WICKET_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.WICKET_LINEAR_TEAM || "";
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
