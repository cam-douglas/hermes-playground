/**
 * Sprag sinks. Slack sprag alarm on locked / mixed / late / refused /
 * cached / stale, GitHub sprag-ledger of race events on every scored
 * probe, Linear ticket on locked / mixed. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Reed (connected vs registered vs one served call).
 * NOT Lazaret (malware-reminder refusal). NOT Fusee (early schedule).
 * NOT Larder (plugin-store freeze). NOT Tappet (silent hook injection).
 * First failed attach locks the race for the process lifetime.
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
    verdict === "locked" ||
    verdict === "mixed" ||
    verdict === "late" ||
    verdict === "refused" ||
    verdict === "cached" ||
    verdict === "stale"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "locked" || verdict === "mixed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackSpragAlarm(result, env = process.env) {
  const webhook =
    env.SPRAG_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Sprag ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Sprag: race is ${result.verdict || "overrun"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Sprag · ${result.verdict} race alarm` : `Sprag · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*serverRunningAtBoot* ${result.serverRunningAtBoot ? "yes" : "no"}`,
            `*serverRunningNow* ${result.serverRunningNow ? "yes" : "no"}`,
            `*attachFailed* ${result.attachFailed ? "yes" : "no"}`,
            `*retried* ${result.retried ? "yes" : "no"}`,
            `*reconnectAttempted* ${result.reconnectAttempted ? "yes" : "no"}`,
            `*reconnectError* ${result.reconnectError || "-"}`,
            `*transportPinnedAtBoot* ${result.transportPinnedAtBoot || "-"}`,
            `*transportNow* ${result.transportNow || "-"}`,
            `*tokenDataFound* ${result.tokenDataFound ? "yes" : "no"}`,
            `*processRestarted* ${result.processRestarted ? "yes" : "no"}`,
            `*toolsAvailable* ${result.toolsAvailable ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Race is ${result.verdict || "overrun"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} sprag alarm on the locked race.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} sprag alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSpragLedger(result, env = process.env) {
  const token = env.SPRAG_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "sprag",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    serverRunningAtBoot: result.serverRunningAtBoot,
    serverRunningNow: result.serverRunningNow,
    attachFailed: result.attachFailed,
    retried: result.retried,
    reconnectAttempted: result.reconnectAttempted,
    reconnectError: result.reconnectError,
    transportPinnedAtBoot: result.transportPinnedAtBoot,
    transportNow: result.transportNow,
    tokenDataFound: result.tokenDataFound,
    processRestarted: result.processRestarted,
    toolsAvailable: result.toolsAvailable,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub sprag-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub sprag-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearSpragTicket(result, env = process.env) {
  const key = env.SPRAG_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `race ${result.verdict} · Sprag · ${result.source || "bench"}`.trim();
  const description = [
    "Sprag refused a race because a failed attach at boot is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "locked"
      ? "First attach failed; server later reachable; still failed for the process lifetime. /clear still failed. Full quit+relaunch connects instantly."
      : result.verdict === "mixed"
        ? "Reconnect used boot-pinned transport + current credentials → No token data found."
        : "Race named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90494. Shape: #84778 #81042 #85766 #83044.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Race is ${result.verdict || "overrun"}.`,
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
    slackSpragAlarm(result, env),
    githubSpragLedger(result, env),
    linearSpragTicket(result, env),
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
            ? `Posted ${result.verdict} sprag alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SPRAG_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Sprag race ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "sprag-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist sprag ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SPRAG_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SPRAG_LINEAR_TEAM || "";
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
