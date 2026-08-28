/**
 * Chute sinks. Slack typed/burned/echoed/retained/leaked/gap alarm,
 * GitHub chute-ledger issue on every scored probe, Linear ticket on
 * burned / echoed. Missing secrets stay honest: a demo row, never a
 * fake live 200. Never include a secret value — names, lengths, fps only.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  const fp = result.fingerprint ? ` · fp ${result.fingerprint}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}${fp}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "typed" ||
    verdict === "burned" ||
    verdict === "echoed" ||
    verdict === "retained" ||
    verdict === "leaked" ||
    verdict === "gap"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "burned" || verdict === "echoed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackChuteAlarm(result, env = process.env) {
  const webhook =
    env.CHUTE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Chute ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Chute: inbound channel is ${result.verdict || "clear"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Chute · ${result.verdict} inbound alarm` : `Chute · ${result.verdict}`,
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
            `*name* ${result.secretName || "—"}`,
            `*length* ${result.secretLength || 0}`,
            `*fp* ${result.fingerprint || "—"}`,
            `*AskUserSecret* ${result.askUserSecretAvailable ? "yes" : "no"}`,
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
      summary: `Would skip Slack — inbound channel is ${result.verdict || "clear"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} inbound alarm on the chute.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} inbound alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubChuteLedger(result, env = process.env) {
  const token = env.CHUTE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "chute",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    channel: result.channel,
    askUserSecretAvailable: result.askUserSecretAvailable,
    secretName: result.secretName,
    secretLength: result.secretLength,
    fingerprint: result.fingerprint,
    sessionMemory: result.sessionMemory,
    agentCanUse: result.agentCanUse,
    agentCanRead: result.agentCanRead,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub chute-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub chute-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearChuteTicket(result, env = process.env) {
  const key = env.CHUTE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `Secret ${result.verdict} · Chute · ${result.source || "inbound channel"}`.trim();
  const description = [
    "Chute refused a handoff because a typed secret is not a handoff.",
    "",
    headline(result),
    "",
    result.verdict === "burned"
      ? "Live credential already written into transcript/history/paste-cache."
      : result.verdict === "echoed"
        ? "Model printed the secret despite never-print-secrets."
        : "Inbound channel named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90301 #77084 #88165 #88380 #38797 #44158 #71654 #82796 #78344 #44868 #58043 #59094.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear — inbound channel is ${result.verdict || "clear"}.`,
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
    slackChuteAlarm(result, env),
    githubChuteLedger(result, env),
    linearChuteTicket(result, env),
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
            ? `Posted ${result.verdict} inbound alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CHUTE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Chute inbound ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "chute-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist chute ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CHUTE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CHUTE_LINEAR_TEAM || "";
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
