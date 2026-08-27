/**
 * Quench sinks. Burn alarm, kill ack, spend ledger, quota ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

function money(usd) {
  return `$${Number(usd).toFixed(2)}`;
}

function tok(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(Math.round(n));
}

function headline(result) {
  const { snapshot, threshold, state, decision } = result;
  return `${tok(snapshot.tokens)} tok · ${money(snapshot.usd)} · ${Math.round(result.ratio * 100)}% of ${tok(threshold.tokens)} / ${money(threshold.usd)} · ${state} → ${decision}`;
}

export function slackAlarm(result, env = process.env) {
  const webhook = env.QUENCH_SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const kill = result.decision === "kill" || result.action === "kill";
  const cool = result.state === "cool";

  const text = cool
    ? `Quench: fuse is cool on ${result.snapshot.session}.`
    : kill
      ? `Quench KILL · ${result.snapshot.session} · ${headline(result)}`
      : `Quench burn alarm · ${result.snapshot.session} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: kill ? "Quench · breaker thrown" : "Quench · burn alarm" },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.snapshot.session}\``,
            `*state* ${result.state} · *decision* ${result.decision}`,
            `*burn* ${tok(result.snapshot.tokens)} · ${money(result.snapshot.usd)}`,
            `*fuse* ${tok(result.threshold.tokens)} · ${money(result.threshold.usd)}`,
            `*sources* parent ${tok(result.snapshot.sources.parent)} · subagents ${tok(result.snapshot.sources.subagents)} · hooks ${tok(result.snapshot.sources.hooks)} · workflows ${tok(result.snapshot.sources.workflows)}`,
          ].join("\n"),
        },
      },
    ],
  };

  if (cool) {
    return {
      adapter: "slack",
      mode: webhook ? "live" : "demo",
      ok: true,
      summary: "Would skip Slack — fuse is cool.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: kill
        ? "Would post to Slack: kill ack — breaker thrown, in-flight work cut."
        : "Would post to Slack: burn alarm — fuse in warning, work still live.",
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: kill ? "Posting kill ack to Slack webhook." : "Posting burn alarm to Slack webhook.",
    endpoint: webhook,
    body,
  };
}

export function githubSpendLedger(result, env = process.env) {
  const token = env.QUENCH_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repo = env.QUENCH_GITHUB_REPO || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "quench",
    session: result.snapshot.session,
    state: result.state,
    decision: result.decision,
    tokens: result.snapshot.tokens,
    usd: result.snapshot.usd,
    threshold: result.threshold,
    sources: result.snapshot.sources,
    agents: result.snapshot.agents,
  });

  if (result.state === "cool") {
    return {
      adapter: "github",
      mode: token ? "live" : "demo",
      ok: true,
      summary: "Would skip GitHub spend ledger — fuse is cool.",
      line,
    };
  }

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would write a GitHub session spend ledger (gist / issue comment). Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repo
      ? `Would append a spend ledger comment on ${repo} (gist fallback).`
      : "Would create a private gist for the session spend ledger.",
    tokenPresent: true,
    repo: repo || null,
    line,
  };
}

export function linearQuotaTicket(result, env = process.env) {
  const key = env.QUENCH_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const tripped = result.state === "tripped" || result.decision === "kill";

  if (!tripped) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary: "No trip — no quota-blown ticket.",
    };
  }

  const title = `Quota blown · Quench ${result.snapshot.session}`;
  const description = [
    "Quench threw the breaker on a runaway agent session.",
    "",
    headline(result),
    "",
    `Agents in the fan-out: ${result.snapshot.agents || "unknown"}`,
    `parent ${result.snapshot.sources.parent}`,
    `subagents ${result.snapshot.sources.subagents}`,
    `hooks ${result.snapshot.sources.hooks}`,
    `workflows ${result.snapshot.sources.workflows}`,
    "",
    "Evidence (do not invent more): anthropics/claude-code#85422 #68619 #72566 #77582 #83025.",
  ].join("\n");

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear quota-blown ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear quota-blown ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [slackAlarm(result, env), githubSpendLedger(result, env), linearQuotaTicket(result, env)];
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
            ? plan.body.text.startsWith("Quench KILL")
              ? "Posted kill ack to Slack."
              : "Posted burn alarm to Slack."
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.QUENCH_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Quench spend ledger ${result.snapshot.session}`,
            public: false,
            files: { "quench-spend.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist spend ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.QUENCH_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.QUENCH_LINEAR_TEAM || "";
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
