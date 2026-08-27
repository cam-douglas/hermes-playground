/**
 * Coda sinks. Slack splice alarm, GitHub coda ledger, Linear recovery ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 * Slack and Linear skip on intact.
 */

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isIntact(result) {
  return result.verdict === "intact" || result.state === "intact";
}

export function slackSpliceAlarm(result, env = process.env) {
  const webhook =
    env.CODA_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const intact = isIntact(result);

  const text = intact
    ? `Coda: galley is intact on ${result.session || "session"}.`
    : `Coda ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: intact ? "Coda · intact" : `Coda · ${result.verdict} alarm`,
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
            `*completeness* ${result.completeness}`,
            `*lost* ${result.lost}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (intact) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: "Would skip Slack — galley is intact.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: splice alarm — ${result.verdict} on the galley.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} splice alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCodaLedger(result, env = process.env) {
  const token = env.CODA_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "coda",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    completeness: result.completeness,
    lost: result.lost,
    persisted: result.persisted,
    recovered: result.recovered,
    rawJsonl: result.rawJsonl,
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub coda ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub coda ledger row as a private gist.",
    tokenPresent: true,
    line,
  };
}

export function linearRecoveryTicket(result, env = process.env) {
  const key = env.CODA_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const intact = isIntact(result);
  const title = `Recover · Coda ${result.verdict} · ${result.source || "galley"}`.trim();
  const description = [
    "Coda blocked the session because a last text block is not a hold.",
    "",
    headline(result),
    "",
    "Concatenate every text block. Compare delivered vs whole.",
    "max_tokens is not a truncation marker. Swallowed mid-turn text was never persisted.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#81838 #58109 #20190 #74260 #17591 · openai/codex#24849.",
  ].join("\n");

  if (intact) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: "Would skip Linear — galley is intact.",
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
    slackSpliceAlarm(result, env),
    githubCodaLedger(result, env),
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
            ? `Posted ${result.verdict} splice alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CODA_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Coda splice ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "coda-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist coda ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CODA_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CODA_LINEAR_TEAM || "";
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
