/**
 * Sigil sinks. Slack brick alarm, GitHub repair ledger, Linear wedged incident.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 * Slack fires on hollow / unsigned / wedged. GitHub writes a ledger row on repair.
 * Linear is optional and only on wedged.
 */

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isQuiet(result) {
  const verdict = result.verdict || result.state;
  return verdict === "valid" || verdict === "stripped" || verdict === "resume-safe";
}

function isRepair(result) {
  return result.action === "strip" || result.action === "quarantine" || result.verdict === "stripped" || result.verdict === "resume-safe";
}

function isWedged(result) {
  return (result.verdict || result.state) === "wedged";
}

export function slackBrickAlarm(result, env = process.env) {
  const webhook =
    env.SIGIL_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const quiet = isQuiet(result);

  const text = quiet
    ? `Sigil: desk is ${result.verdict || "valid"} on ${result.session || "session"}.`
    : `Sigil ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: quiet ? `Sigil · ${result.verdict}` : `Sigil · ${result.verdict} brick alarm`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*source* ${result.source || "—"}`,
            `*poison* ${(result.poison || []).length}`,
            `*resumeSafe* ${result.resumeSafe ? "true" : "false"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (quiet) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would skip Slack — desk is ${result.verdict || "valid"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: brick alarm — ${result.verdict} on the desk.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} brick alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubRepairLedger(result, env = process.env) {
  const token = env.SIGIL_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repair = isRepair(result);
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "sigil",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    poison: (result.poison || []).map((row) => row.kind),
    dropped: (result.dropped || []).map((row) => row.kind),
    recovered: result.recovered,
    stripped: result.stripped,
    quarantined: result.quarantined,
    resumeSafe: result.resumeSafe,
    repair,
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: repair
        ? "Would append a GitHub repair ledger row. Demo: no token."
        : "Would append a GitHub repair ledger row on the next strip. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repair
      ? "Would append a GitHub repair ledger row as a private gist."
      : "Would append a GitHub repair ledger row as a private gist after strip.",
    tokenPresent: true,
    line,
  };
}

export function linearWedgedIncident(result, env = process.env) {
  const key = env.SIGIL_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const wedged = isWedged(result);
  const title = `Wedged session · Sigil ${result.verdict} · ${result.source || "desk"}`.trim();
  const description = [
    "Sigil blocked the session because hollow or unsigned thinking bricks resume.",
    "",
    headline(result),
    "",
    "Strip thinking / redacted_thinking that are hollow or unsigned.",
    "Never invent signatures. Preserve text / tool_use / tool_result.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#63147 #63463 #63335 #68768 #10199 · openai/codex#25290 #36551.",
  ].join("\n");

  if (!wedged) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — desk is ${result.verdict || "valid"}.`,
      title,
      description,
    };
  }

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear wedged-session incident: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear wedged-session incident: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackBrickAlarm(result, env),
    githubRepairLedger(result, env),
    linearWedgedIncident(result, env),
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
            ? `Posted ${result.verdict} brick alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SIGIL_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Sigil ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "sigil-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist sigil ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SIGIL_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SIGIL_LINEAR_TEAM || "";
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
