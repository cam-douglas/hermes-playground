/**
 * Reed sinks. Slack registry alarm, GitHub reed ledger, Linear reseat ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

function headline(result) {
  const reeds = result.reeds || result.cabinet?.reeds || [];
  const names = reeds.map((reed) => reed.id || reed.name).filter(Boolean).join(", ");
  return `${result.session || "session"} · ${result.verdict} · ${names || "empty cabinet"}`;
}

function quiet(result) {
  return result.verdict === "open" || result.verdict === "set" || result.state === "open" || result.state === "set";
}

export function slackRegistryAlarm(result, env = process.env) {
  const webhook =
    env.REED_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const isOpen = result.verdict === "open" || result.state === "open";
  const isSet = result.verdict === "set" || result.state === "set";

  const text = isOpen
    ? `Reed: cabinet is open on ${result.session || "session"}.`
    : isSet
      ? `Reed: contacts are set on ${result.session || "session"}.`
      : `Reed ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: isOpen
            ? "Reed · open"
            : isSet
              ? "Reed · set"
              : `Reed · ${result.verdict} alarm`,
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
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (isOpen || isSet) {
    return {
      adapter: "slack",
      mode: webhook ? "live" : "demo",
      ok: true,
      summary: isOpen
        ? "Would skip Slack — cabinet is open."
        : "Would skip Slack — contacts are set.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: registry alarm — ${result.verdict} on the cabinet.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} registry alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubReedLedger(result, env = process.env) {
  const token = env.REED_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repo = env.REED_GITHUB_REPO || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "reed",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    reeds: (result.reeds || []).map((reed) => ({
      id: reed.id,
      transport: reed.transport,
      alive: reed.alive,
      handshake: reed.handshake,
      listed: reed.listed,
      callable: reed.callable,
      verdict: reed.verdict,
    })),
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub reed ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repo
      ? `Would append a GitHub reed ledger row on ${repo} (gist fallback).`
      : "Would append a GitHub reed ledger row as a private gist.",
    tokenPresent: true,
    repo: repo || null,
    line,
  };
}

export function linearReseatTicket(result, env = process.env) {
  const key = env.REED_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const skip = quiet(result);
  const title = `Reseat · Reed ${result.verdict} · ${result.source || "cabinet"}`.trim();
  const description = [
    "Reed blocked the session because MCP contacts are not a hold.",
    "",
    headline(result),
    "",
    "Four contacts: alive, handshake, listed, callable.",
    "Connected is not registered. One served call is not a hold.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#83838 #74329 #82746 #86080 · openai/codex#35298 #37417 #11489.",
  ].join("\n");

  if (skip) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary:
        result.verdict === "open"
          ? "Would skip Linear — cabinet is open."
          : "Would skip Linear — contacts are set.",
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear reseat ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear reseat ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackRegistryAlarm(result, env),
    githubReedLedger(result, env),
    linearReseatTicket(result, env),
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
            ? `Posted ${result.verdict} registry alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.REED_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Reed registry ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "reed-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist reed ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.REED_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.REED_LINEAR_TEAM || "";
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
