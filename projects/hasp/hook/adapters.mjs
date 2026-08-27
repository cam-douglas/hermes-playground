/**
 * Hasp sinks. Slack clobber alarm, GitHub lease ledger, Linear lost-work ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

function headline(result) {
  const path = result.path || "(no path)";
  const holder = result.holder || "none";
  const session = result.session || "session";
  return `${session} · ${result.verdict} · holder ${holder} · ${path}`;
}

export function slackClobberAlarm(result, env = process.env) {
  const webhook =
    env.HASP_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const loose = result.verdict === "loose" || result.state === "loose";

  const text = loose
    ? `Hasp: path is loose on ${result.session || "session"}.`
    : result.verdict === "clobber"
      ? `Hasp CLOBBER · ${headline(result)}`
      : `Hasp ${result.verdict} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: loose ? "Hasp · loose" : result.verdict === "clobber" ? "Hasp · clobber alarm" : `Hasp · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*holder* \`${result.holder || "none"}\``,
            `*path* \`${result.path || "(none)"}\``,
            `*verdict* ${result.verdict}`,
            `*hash* ${result.currentHash || "—"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (loose) {
    return {
      adapter: "slack",
      mode: webhook ? "live" : "demo",
      ok: true,
      summary: "Would skip Slack — path is loose.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary:
        result.verdict === "clobber"
          ? "Would post to Slack: clobber alarm — another session already holds this path."
          : `Would post to Slack: clobber alarm — ${result.verdict} on a live lease.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary:
      result.verdict === "clobber"
        ? "Posting clobber alarm to Slack webhook."
        : `Posting ${result.verdict} lease notice to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubLeaseLedger(result, env = process.env) {
  const token = env.HASP_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repo = env.HASP_GITHUB_REPO || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "hasp",
    session: result.session,
    holder: result.holder,
    path: result.path,
    verdict: result.verdict,
    currentHash: result.currentHash,
    nextHash: result.nextHash,
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub lease ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repo
      ? `Would append a GitHub lease ledger row on ${repo} (gist fallback).`
      : "Would append a GitHub lease ledger row as a private gist.",
    tokenPresent: true,
    repo: repo || null,
    line,
  };
}

export function linearLostWorkTicket(result, env = process.env) {
  const key = env.HASP_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const skip = result.verdict === "loose" || result.verdict === "seized";

  if (skip) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary:
        result.verdict === "loose"
          ? "Would skip Linear — path is loose."
          : "Would skip Linear — lease seized, no lost work.",
    };
  }

  const title = `Lost work · Hasp ${result.verdict} · ${result.path || "path"}`.trim();
  const description = [
    "Hasp blocked a Write because another session already holds the path.",
    "",
    headline(result),
    "",
    `currentHash ${result.currentHash || "—"} → nextHash ${result.nextHash || "—"}`,
    "",
    "Evidence (do not invent more): anthropics/claude-code#90146 #85597 · openai/codex#38541 #33741.",
  ].join("\n");

  if (result.verdict !== "clobber") {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary: `Would skip Linear — ${result.verdict} is not lost work.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear lost-work ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear lost-work ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackClobberAlarm(result, env),
    githubLeaseLedger(result, env),
    linearLostWorkTicket(result, env),
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
            ? plan.body.text.startsWith("Hasp CLOBBER")
              ? "Posted clobber alarm to Slack."
              : "Posted lease notice to Slack."
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.HASP_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Hasp lease ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "hasp-lease.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist lease ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.HASP_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.HASP_LINEAR_TEAM || "";
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
