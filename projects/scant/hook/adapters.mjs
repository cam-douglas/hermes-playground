/**
 * Scant sinks. Slack scant/clipped/poisoned/bloated alarm,
 * GitHub scant-ledger of board events on every scored probe,
 * Linear scantling ticket on poisoned / clipped. Missing
 * secrets stay honest: a demo row, never a fake live 200.
 *
 * This is NOT Larder (sync stamp). NOT Reed (MCP contacts).
 * NOT Assay (tool-arg impurity). NOT Quench (spend fuse).
 * NOT Wraith (live-image unlink). Snapshot writer clipping
 * PATH at the Windows cmdline wall only.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "scant" ||
    verdict === "clipped" ||
    verdict === "poisoned" ||
    verdict === "bloated"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "poisoned" || verdict === "clipped";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackScantAlarm(result, env = process.env) {
  const webhook =
    env.SCANT_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Scant ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Scant: board is ${result.verdict || "fit"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Scant · ${result.verdict} scantling alarm` : `Scant · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*bytes* ${result.bytes ?? 0}`,
            `*wall* 7187–7195 / cmdline 8191`,
            `*PATH quote* ${result.unclosedPathQuote ? "open" : "closed"}`,
            `*mid-PATH* ${result.truncatedMidPath ? "yes" : "no"}`,
            `*plugins* ${result.pluginCount || 0}`,
            `*source* ${result.source || "-"}`,
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
      summary: `Would skip Slack. Board is ${result.verdict || "fit"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} scant alarm on the cut board.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} scant alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubScantLedger(result, env = process.env) {
  const token = env.SCANT_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "scant",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    bytes: result.bytes,
    measuredFullLength: result.measuredFullLength,
    pluginCount: result.pluginCount,
    unclosedPathQuote: result.unclosedPathQuote,
    truncatedMidPath: result.truncatedMidPath,
    hitWall: result.hitWall,
    pluginPathBloat: result.pluginPathBloat,
    snapshotDeleted: result.snapshotDeleted,
    silentNoOpBash: result.silentNoOpBash,
    onDiskRepairAttempted: result.onDiskRepairAttempted,
    sessionStillDead: result.sessionStillDead,
    bashUnexpectedEof: result.bashUnexpectedEof,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub scant-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub scant-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearScantTicket(result, env = process.env) {
  const key = env.SCANT_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `scantling ${result.verdict} · Scant · ${result.source || "yard"}`.trim();
  const description = [
    "Scant refused a board because a written shell snapshot is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "poisoned"
      ? "Every Bash call fails unexpected EOF while looking for matching quote. The session is poisoned for its life."
      : result.verdict === "clipped"
        ? "Snapshot hit the ~8191 / ~7.2KB wall. Truncation size + wrapper ≈ Windows cmd.exe command-line limit."
        : "Board named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90421. Shape: #88311 #85111 #83243 #81732.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Board is ${result.verdict || "fit"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackScantAlarm(result, env),
    githubScantLedger(result, env),
    linearScantTicket(result, env),
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
            ? `Posted ${result.verdict} scant alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SCANT_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Scant scantling ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "scant-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist scant ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SCANT_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SCANT_LINEAR_TEAM || "";
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
