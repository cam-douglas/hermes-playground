/**
 * Aside sinks. Slack preamble/muted/poisoned/toolish/inherited/ghost/
 * sticky/forked alarm, GitHub aside-ledger issue on every scored probe,
 * Linear ticket on preamble / poisoned. Missing secrets stay honest:
 * a demo row, never a fake live 200.
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
    verdict === "preamble" ||
    verdict === "muted" ||
    verdict === "poisoned" ||
    verdict === "toolish" ||
    verdict === "inherited" ||
    verdict === "ghost" ||
    verdict === "sticky" ||
    verdict === "forked"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "preamble" || verdict === "poisoned";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackAsideAlarm(result, env = process.env) {
  const webhook =
    env.ASIDE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Aside ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Aside: side channel is ${result.verdict || "heard"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Aside · ${result.verdict} wing alarm` : `Aside · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*channel* ${result.channel || "—"}`,
            `*preamble* ${result.preambleText || "—"}`,
            `*tools forbidden* ${result.toolsForbidden ? "yes" : "no"}`,
            `*inherited* ${result.inheritedToolFirst ? "yes" : "no"}`,
            `*notice* ${result.noticeShown ? "shown" : result.noticeSuppressed ? "suppressed" : "—"}`,
            `*transcript* ${result.inTranscript ? "written" : "ghost"}`,
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
      summary: `Would skip Slack — side channel is ${result.verdict || "heard"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} wing alarm on the side channel.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} wing alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubAsideLedger(result, env = process.env) {
  const token = env.ASIDE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "aside",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    channel: result.channel,
    toolsForbidden: result.toolsForbidden,
    inheritedToolFirst: result.inheritedToolFirst,
    toolAttempted: result.toolAttempted,
    noticeShown: result.noticeShown,
    noticeSuppressed: result.noticeSuppressed,
    skipTranscript: result.skipTranscript,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub aside-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub aside-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearAsideTicket(result, env = process.env) {
  const key = env.ASIDE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Side channel ${result.verdict} · Aside · ${result.source || "/btw"}`.trim();
  const description = [
    "Aside refused a hold because a preamble is not an answer.",
    "",
    headline(result),
    "",
    result.verdict === "preamble"
      ? "Short text then silent end. Notice gated on empty text. THE BUG from #90314."
      : result.verdict === "poisoned"
        ? "Prior truncation stuck in btwHistory; later /btw also fails."
        : "Side channel named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90314 #79593 #85674 #81736 #89294 #86108 #87156 #83292 #74959.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — side channel is ${result.verdict || "heard"}.`,
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
    slackAsideAlarm(result, env),
    githubAsideLedger(result, env),
    linearAsideTicket(result, env),
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
            ? `Posted ${result.verdict} wing alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.ASIDE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Aside wing ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "aside-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist aside ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.ASIDE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.ASIDE_LINEAR_TEAM || "";
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
