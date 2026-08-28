/**
 * Tappet sinks. Slack missed/slipped/folded/mute/oversize/misfiled/inert/wave
 * alarm, GitHub tappet-ledger issue on every scored probe, Linear ticket
 * on missed / slipped / inert. Missing secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Aside (wing desk /btw). NOT Chute (inbound secret).
 * NOT Tain (Chrome pairing). Hook-injection path only.
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
    verdict === "missed" ||
    verdict === "slipped" ||
    verdict === "folded" ||
    verdict === "mute" ||
    verdict === "oversize" ||
    verdict === "misfiled" ||
    verdict === "inert" ||
    verdict === "wave"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "missed" || verdict === "slipped" || verdict === "inert";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackTappetAlarm(result, env = process.env) {
  const webhook =
    env.TAPPET_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Tappet ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Tappet: valve train is ${result.verdict || "seated"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Tappet · ${result.verdict} valve alarm` : `Tappet · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*event* ${result.event || "—"}`,
            `*mid-turn* ${result.midTurn ? "yes" : "no"}`,
            `*hook spawned* ${result.hookSpawned ? "yes" : "no"}`,
            `*additionalContext in transcript* ${result.additionalContextInTranscript ? "yes" : "no"}`,
            `*telemetry* ${result.hookTelemetryPresent ? "present" : "none"}`,
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
      summary: `Would skip Slack — valve train is ${result.verdict || "seated"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} valve alarm on the train.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} valve alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubTappetLedger(result, env = process.env) {
  const token = env.TAPPET_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "tappet",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    event: result.event,
    midTurn: result.midTurn,
    hookSpawned: result.hookSpawned,
    additionalContextReturned: result.additionalContextReturned,
    additionalContextInTranscript: result.additionalContextInTranscript,
    hookTelemetryPresent: result.hookTelemetryPresent,
    loggedSucceeded: result.loggedSucceeded,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub tappet-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub tappet-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearTappetTicket(result, env = process.env) {
  const key = env.TAPPET_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Hook injection ${result.verdict} · Tappet · ${result.source || "UserPromptSubmit"}`.trim();
  const description = [
    "Tappet refused a valve because a fired hook is not a seated injection.",
    "",
    headline(result),
    "",
    result.verdict === "missed"
      ? "Mode A: mid-turn / queued message never spawned the hook process."
      : result.verdict === "slipped"
        ? "Mode B: hook ran (side-effect file exists) but additionalContext never reached the transcript."
        : result.verdict === "inert"
          ? "Hook logged as succeeded but never injected into model context."
          : "Valve train named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90296 #31114 #40647 #19643 #88086 #84021 #85917 #78266 #75378 #79616.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — valve train is ${result.verdict || "seated"}.`,
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
    slackTappetAlarm(result, env),
    githubTappetLedger(result, env),
    linearTappetTicket(result, env),
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
            ? `Posted ${result.verdict} valve alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.TAPPET_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Tappet valve ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "tappet-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist valve ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.TAPPET_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.TAPPET_LINEAR_TEAM || "";
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
