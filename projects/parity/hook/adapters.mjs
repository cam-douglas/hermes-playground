/**
 * Parity sinks. Drift alarm, claim ledger, reality ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

function headline(result) {
  const claim = result.claim || {};
  const channels = result.channels || {};
  const parts = Object.entries(channels).map(([name, value]) => `${name}:${value}`);
  return `${claim.session || "session"} · ${result.verdict} · ${parts.join(" · ")}`;
}

export function slackDriftAlarm(result, env = process.env) {
  const webhook =
    env.PARITY_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const even = result.verdict === "even" || result.state === "even";
  const fabricated = result.verdict === "fabricated";
  const drift = result.verdict === "drift";

  const text = even
    ? `Parity: board is even on ${result.claim?.session || "session"}.`
    : fabricated
      ? `Parity FABRICATED · ${headline(result)}`
      : drift
        ? `Parity DRIFT · ${headline(result)}`
        : `Parity ${result.verdict} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: fabricated
            ? "Parity · fabricated claim"
            : drift
              ? "Parity · claim drifted"
              : "Parity · claim check",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.claim?.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*claim* ${String(result.claim?.text || "").slice(0, 280) || "empty"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (even) {
    return {
      adapter: "slack",
      mode: webhook ? "live" : "demo",
      ok: true,
      summary: "Would skip Slack — board is even.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: fabricated
        ? "Would post to Slack: fabricated alarm — cited artifacts do not exist."
        : drift
          ? "Would post to Slack: drift alarm — claim does not match reality."
          : "Would post to Slack: claim check — channels agree or stay unverified.",
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: fabricated
      ? "Posting fabricated alarm to Slack webhook."
      : drift
        ? "Posting drift alarm to Slack webhook."
        : "Posting claim check to Slack webhook.",
    endpoint: webhook,
    body,
  };
}

export function githubClaimLedger(result, env = process.env) {
  const token = env.PARITY_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repo = env.PARITY_GITHUB_REPO || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "parity",
    session: result.claim?.session,
    verdict: result.verdict,
    channels: result.channels,
    claim: result.claim?.text,
    parsed: result.claim?.parsed,
  });

  if (result.verdict === "even" || result.state === "even") {
    return {
      adapter: "github",
      mode: token ? "live" : "demo",
      ok: true,
      summary: "Would skip GitHub claim ledger — board is even.",
      line,
    };
  }

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would write a GitHub claim ledger (gist / issue comment). Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repo
      ? `Would append a claim ledger comment on ${repo} (gist fallback).`
      : "Would create a private gist for the claim ledger.",
    tokenPresent: true,
    repo: repo || null,
    line,
  };
}

export function linearRealityTicket(result, env = process.env) {
  const key = env.PARITY_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const dispute = result.verdict === "drift" || result.verdict === "fabricated";

  if (!dispute) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary:
        result.verdict === "even"
          ? "No reality ticket — board is even."
          : "No reality ticket — claim was not disputed.",
    };
  }

  const title = `${result.verdict === "fabricated" ? "Fabricated claim" : "Claim drift"} · Parity ${result.claim?.session || ""}`.trim();
  const description = [
    "Parity compared an agent claim against GitHub / Vercel / Linear / functional probes.",
    "",
    headline(result),
    "",
    result.claim?.text || "(empty claim)",
    "",
    "Evidence (do not invent more): anthropics/claude-code#40861 #56870 #43387 #74427 #67730 · openai/codex#19520.",
  ].join("\n");

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear reality ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear reality ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackDriftAlarm(result, env),
    githubClaimLedger(result, env),
    linearRealityTicket(result, env),
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
            ? plan.body.text.startsWith("Parity FABRICATED")
              ? "Posted fabricated alarm to Slack."
              : plan.body.text.startsWith("Parity DRIFT")
                ? "Posted drift alarm to Slack."
                : "Posted claim check to Slack."
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.PARITY_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Parity claim ledger ${result.claim?.session || ""}`.trim(),
            public: false,
            files: { "parity-claim.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist claim ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.PARITY_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.PARITY_LINEAR_TEAM || "";
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
