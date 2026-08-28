/**
 * Larder sinks. Slack stamped/frozen/greened/drifted/aged/served
 * alarm, GitHub larder-ledger issue on every scored probe, Linear
 * ticket on frozen / greened / served. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Tappet (valve train / hook injection). NOT Aside
 * (wing desk /btw). NOT Husk (hollow SUCCESS). Plugin-store content
 * clock vs sync stamp only.
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
    verdict === "stamped" ||
    verdict === "frozen" ||
    verdict === "greened" ||
    verdict === "drifted" ||
    verdict === "aged" ||
    verdict === "served"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "frozen" || verdict === "greened" || verdict === "served";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackLarderAlarm(result, env = process.env) {
  const webhook =
    env.LARDER_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Larder ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Larder: stillroom is ${result.verdict || "stocked"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Larder · ${result.verdict} shelf alarm` : `Larder · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*lastUpdated advanced* ${result.lastUpdatedAdvanced ? "yes" : "no"}`,
            `*plugin folders moved* ${result.pluginFolderMoved ? "yes" : "no"}`,
            `*versions behind* ${result.versionsBehind ?? 0}`,
            `*indicators green* ${result.indicatorsGreen ? "yes" : "no"}`,
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
      summary: `Would skip Slack — stillroom is ${result.verdict || "stocked"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} shelf alarm in the stillroom.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} shelf alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubLarderLedger(result, env = process.env) {
  const token = env.LARDER_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "larder",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    lastUpdatedAdvanced: result.lastUpdatedAdvanced,
    pluginFolderMoved: result.pluginFolderMoved,
    versionsBehind: result.versionsBehind,
    daysStale: result.daysStale,
    reFroze: result.reFroze,
    sessionsLoadFromStore: result.sessionsLoadFromStore,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub larder-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub larder-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearLarderTicket(result, env = process.env) {
  const key = env.LARDER_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Plugin store ${result.verdict} · Larder · ${result.source || "plugin-store"}`.trim();
  const description = [
    "Larder refused a shelf because a sync stamp is not a delivery.",
    "",
    headline(result),
    "",
    result.verdict === "frozen"
      ? "Toggle unstuck once, then the store stayed frozen."
      : result.verdict === "greened"
        ? "Every indicator green, no diagnostic trail, versions behind."
        : result.verdict === "served"
          ? "Desktop / Cowork session loaded from this frozen store."
          : "Stillroom named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90329 #84401 #86139 #73673 #36700 #69020 #88005 #74609 #14061 #83987 #59385.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — stillroom is ${result.verdict || "stocked"}.`,
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
    slackLarderAlarm(result, env),
    githubLarderLedger(result, env),
    linearLarderTicket(result, env),
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
            ? `Posted ${result.verdict} shelf alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.LARDER_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Larder stillroom ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "larder-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist stillroom ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.LARDER_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.LARDER_LINEAR_TEAM || "";
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
