/**
 * Snib sinks. Slack fail-closed alarm on dismissed / revoked / unobserved,
 * GitHub ledger row on every scored probe, Linear incident on dismissed / revoked.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  const plan = result.plan || "plan";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""} · ${plan}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return verdict === "dismissed" || verdict === "revoked" || verdict === "unobserved";
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "dismissed" || verdict === "revoked";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackSnibAlarm(result, env = process.env) {
  const webhook =
    env.SNIB_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Snib ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Snib: night-latch is ${result.verdict || "latched"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Snib · ${result.verdict} fail-open alarm` : `Snib · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*plan* \`${result.plan || "—"}\``,
            `*enrolled* ${result.enrolledCount ?? 0}`,
            `*live* ${result.liveSessionStillAttached ? "attached" : "dropped"}`,
            `*modal* ${result.modalChoice || (result.modalShown ? "shown" : "none")}`,
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
      summary: `Would skip Slack — night-latch is ${result.verdict || "latched"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: fail-open alarm — ${result.verdict} on the snib.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} fail-open alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSnibLedger(result, env = process.env) {
  const token = env.SNIB_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "snib",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    plan: result.plan,
    enrolledCount: result.enrolledCount,
    revokedAll: result.revokedAll,
    liveSessionStillAttached: result.liveSessionStillAttached,
    modalShown: result.modalShown,
    modalChoice: result.modalChoice,
    hostLogMentionsVerify: result.hostLogMentionsVerify,
    cookieOnly: result.cookieOnly,
    restored: result.restored,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub snib ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub snib ledger row as a private gist.",
    tokenPresent: true,
    line,
  };
}

export function linearSnibIncident(result, env = process.env) {
  const key = env.SNIB_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Trusted-device fail-open ${result.verdict} · Snib · ${result.source || "Remote Control"}`.trim();
  const description = [
    "Snib refused a session because a turned snib is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "dismissed"
      ? 'Not now dismissed "Sign in again to verify your device"; the Remote Control session stayed attached and steerable.'
      : "Revoking every Trusted Device did not force re-verification on the already-active session.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90265 #90266 #87863 #55196 #82095 #81550 #83122.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — night-latch is ${result.verdict || "latched"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear Trusted-device incident: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear Trusted-device incident: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackSnibAlarm(result, env),
    githubSnibLedger(result, env),
    linearSnibIncident(result, env),
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
            ? `Posted ${result.verdict} fail-open alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SNIB_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Snib ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "snib-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist snib ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SNIB_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SNIB_LINEAR_TEAM || "";
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
