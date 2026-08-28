/**
 * Damper sinks. Slack defaulted/drawn/forced/disclosed alarm,
 * GitHub damper-ledger issue on every scored probe, Linear
 * incident on defaulted / disclosed. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Snib (Trusted Devices fail-open). NOT Cote / Nixie.
 * NOT Knock. Remote Control auto-enable without opt-in only.
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
    verdict === "defaulted" ||
    verdict === "drawn" ||
    verdict === "forced" ||
    verdict === "disclosed"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "defaulted" || verdict === "disclosed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackDamperAlarm(result, env = process.env) {
  const webhook =
    env.DAMPER_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Damper ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Damper: flue is ${result.verdict || "banked"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Damper · ${result.verdict} flue alarm` : `Damper · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*RC active* ${result.rcActive ? "yes" : "no"}`,
            `*never invoked /rc* ${result.neverInvokedRc ? "yes" : "no"}`,
            `*live remote URL* ${result.liveRemoteUrl ? "yes" : "no"}`,
            `*tool results crossing* ${result.toolResultsCrossing ? "yes" : "no"}`,
            `*file contents exposed* ${result.fileContentsExposed ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Flue is ${result.verdict || "banked"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} flue alarm on the chimney plate.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} flue alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubDamperLedger(result, env = process.env) {
  const token = env.DAMPER_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "damper",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    neverInvokedRc: result.neverInvokedRc,
    rcActive: result.rcActive,
    liveRemoteUrl: result.liveRemoteUrl,
    toolResultsCrossing: result.toolResultsCrossing,
    fileContentsExposed: result.fileContentsExposed,
    seenAutoOnNotification: result.seenAutoOnNotification,
    vscodeNewTab: result.vscodeNewTab,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub damper-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub damper-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearDamperTicket(result, env = process.env) {
  const key = env.DAMPER_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Remote Control ${result.verdict} · Damper · ${result.source || "flue"}`.trim();
  const description = [
    "Damper refused a plate because a settings toggle that reads off is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "defaulted"
      ? "New session. Never ran /rc. disableClaudeAiConnectors true ignored. RC already on."
      : result.verdict === "disclosed"
        ? "Tool results crossed the bridge without consent."
        : "Chimney plate named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90341 #89568 #89146 #77517. Related #87118.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Flue is ${result.verdict || "banked"}.`,
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
    slackDamperAlarm(result, env),
    githubDamperLedger(result, env),
    linearDamperTicket(result, env),
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
            ? `Posted ${result.verdict} flue alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.DAMPER_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Damper chimney ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "damper-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist chimney ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.DAMPER_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.DAMPER_LINEAR_TEAM || "";
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
