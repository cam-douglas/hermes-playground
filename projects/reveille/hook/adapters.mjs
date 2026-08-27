/**
 * Reveille sinks. Muster roll, hold ack, orphan ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

function ageMs(agent, now) {
  return Math.max(0, Number(now) - Number(agent.lastHeartbeat || now));
}

function roll(result) {
  const { snapshot } = result;
  return snapshot.roster
    .map((agent) => {
      const age = ageMs(agent, snapshot.now);
      return `• \`${agent.id}\` ${agent.role} \`${agent.artifact}\` · ${agent.status} · ${age}ms`;
    })
    .join("\n");
}

function headline(result) {
  const { snapshot, state, decision } = result;
  const live = snapshot.roster.filter((agent) => agent.status === "live").length;
  const missing = snapshot.roster.filter(
    (agent) => agent.status === "orphaned" || agent.status === "missing",
  ).length;
  return `${snapshot.session} · ${snapshot.roster.length} claimed · ${live} live · ${missing} missing · compact×${snapshot.compactionCount} · ${state} → ${decision}`;
}

export function slackMuster(result, env = process.env) {
  const webhook = env.REVEILLE_SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const quiet = result.state === "quiet";
  const hold = result.decision === "hold" || result.state === "held";
  const orphan = result.decision === "orphan" || result.state === "missing";

  const text = quiet
    ? `Reveille: muster is quiet on ${result.snapshot.session}.`
    : hold
      ? `Reveille HOLD · ${headline(result)}`
      : orphan
        ? `Reveille ORPHAN · ${headline(result)}`
        : `Reveille muster · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: hold
            ? "Reveille · duplicate dispatch held"
            : orphan
              ? "Reveille · missed heartbeat"
              : "Reveille · living muster",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.snapshot.session}\``,
            `*state* ${result.state} · *decision* ${result.decision}`,
            `*compactions* ${result.snapshot.compactionCount}`,
            roll(result) || "• empty roll",
          ].join("\n"),
        },
      },
    ],
  };

  if (quiet) {
    return {
      adapter: "slack",
      mode: webhook ? "live" : "demo",
      ok: true,
      summary: "Would skip Slack — muster is quiet.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: hold
        ? "Would post to Slack: muster hold — duplicate dispatch on a claimed artifact."
        : orphan
          ? "Would post to Slack: muster roll — missed heartbeat, agent orphaned."
          : "Would post to Slack: living muster — claims still on the board.",
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: hold
      ? "Posting muster hold to Slack webhook."
      : orphan
        ? "Posting orphan roll to Slack webhook."
        : "Posting living muster to Slack webhook.",
    endpoint: webhook,
    body,
  };
}

export function githubMusterLedger(result, env = process.env) {
  const token = env.REVEILLE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repo = env.REVEILLE_GITHUB_REPO || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "reveille",
    session: result.snapshot.session,
    state: result.state,
    decision: result.decision,
    compactionCount: result.snapshot.compactionCount,
    roster: result.snapshot.roster,
    collision: result.snapshot.collision,
  });

  if (result.state === "quiet") {
    return {
      adapter: "github",
      mode: token ? "live" : "demo",
      ok: true,
      summary: "Would skip GitHub muster ledger — board is quiet.",
      line,
    };
  }

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would write a GitHub muster ledger (gist / issue comment). Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repo
      ? `Would append a muster ledger comment on ${repo} (gist fallback).`
      : "Would create a private gist for the living muster ledger.",
    tokenPresent: true,
    repo: repo || null,
    line,
  };
}

export function linearOrphanTicket(result, env = process.env) {
  const key = env.REVEILLE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const orphan = result.decision === "orphan" || result.state === "missing";

  if (!orphan) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary:
        result.decision === "hold"
          ? "No orphan ticket — dispatch is held, claims are still known."
          : "No missed heartbeat — no orphan ticket.",
    };
  }

  const missing = (result.orphans || result.snapshot.roster.filter((agent) =>
    agent.status === "orphaned" || agent.status === "missing",
  )).map((agent) => agent.id);
  const title = `Orphaned handle · Reveille ${result.snapshot.session}`;
  const description = [
    "Reveille found a missed heartbeat after compaction. The handle is still claimed.",
    "",
    headline(result),
    "",
    `Orphaned: ${missing.join(", ") || "unknown"}`,
    "",
    ...result.snapshot.roster.map(
      (agent) =>
        `- ${agent.id} ${agent.role} \`${agent.artifact}\` ${agent.status} lastHeartbeat=${agent.lastHeartbeat}`,
    ),
    "",
    "Evidence (do not invent more): anthropics/claude-code#90036 #90034 #29193 #77730.",
  ].join("\n");

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear orphan ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear orphan ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackMuster(result, env),
    githubMusterLedger(result, env),
    linearOrphanTicket(result, env),
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
            ? plan.body.text.startsWith("Reveille HOLD")
              ? "Posted muster hold to Slack."
              : plan.body.text.startsWith("Reveille ORPHAN")
                ? "Posted orphan roll to Slack."
                : "Posted living muster to Slack."
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.REVEILLE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Reveille muster ledger ${result.snapshot.session}`,
            public: false,
            files: { "reveille-muster.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist muster ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.REVEILLE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.REVEILLE_LINEAR_TEAM || "";
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
