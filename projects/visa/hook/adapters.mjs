/**
 * Visa sinks. Slack visa alarm on omitted / audless / clientid /
 * refused / slashy / mismatched, GitHub visa-ledger of border events
 * on every scored probe, Linear ticket on omitted / clientid /
 * refused. Missing secrets stay honest: a demo row, never a fake
 * live 200.
 *
 * This is NOT Sprag (boot-cached MCP attach). NOT Reed (connected
 * vs registered vs one served call). NOT Husk (hollow success).
 * A login without a destination is not a hold.
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
    verdict === "omitted" ||
    verdict === "audless" ||
    verdict === "clientid" ||
    verdict === "refused" ||
    verdict === "slashy" ||
    verdict === "mismatched"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "omitted" || verdict === "clientid" || verdict === "refused";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackVisaAlarm(result, env = process.env) {
  const webhook =
    env.VISA_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Visa ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Visa: border is ${result.verdict || "stamped"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Visa · ${result.verdict} border alarm` : `Visa · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*resourceSentAuthorize* ${result.resourceSentAuthorize ? "yes" : "no"}`,
            `*resourceSentToken* ${result.resourceSentToken ? "yes" : "no"}`,
            `*resourceValue* ${result.resourceValue || "-"}`,
            `*audClaim* ${result.audClaim || "-"}`,
            `*clientId* ${result.clientId || "-"}`,
            `*canonicalResourceUri* ${result.canonicalResourceUri || "-"}`,
            `*serverStrict* ${result.serverStrict ? "yes" : "no"}`,
            `*httpStatus* ${result.httpStatus || "-"}`,
            `*trailingSlashCorruption* ${result.trailingSlashCorruption ? "yes" : "no"}`,
            `*oauthCompleted* ${result.oauthCompleted ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Border is ${result.verdict || "stamped"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} visa alarm on the omitted resource.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} visa alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubVisaLedger(result, env = process.env) {
  const token = env.VISA_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "visa",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    resourceSentAuthorize: result.resourceSentAuthorize,
    resourceSentToken: result.resourceSentToken,
    resourceValue: result.resourceValue,
    audClaim: result.audClaim,
    clientId: result.clientId,
    canonicalResourceUri: result.canonicalResourceUri,
    serverStrict: result.serverStrict,
    httpStatus: result.httpStatus,
    trailingSlashCorruption: result.trailingSlashCorruption,
    oauthCompleted: result.oauthCompleted,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub visa-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub visa-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearVisaTicket(result, env = process.env) {
  const key = env.VISA_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `border ${result.verdict} · Visa · ${result.source || "desk"}`.trim();
  const description = [
    "Visa refused a border because a login without a destination is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "omitted"
      ? "resource absent from /authorize and/or /token. Token aud equals client_id. Strict MCP server 401s. Primary #90497."
      : result.verdict === "clientid"
        ? "aud equals the OAuth client_id (default audience) instead of the canonical MCP resource URI."
        : result.verdict === "refused"
          ? "Strict MCP server returned 401 on the token. The house that rejects a nameless visa."
          : "Border named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90497. Shape: #52871 #73460 #76096 #55495. Cross-ecosystem: openai/codex#13891 openai/codex#33403.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Border is ${result.verdict || "stamped"}.`,
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
    slackVisaAlarm(result, env),
    githubVisaLedger(result, env),
    linearVisaTicket(result, env),
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
            ? `Posted ${result.verdict} visa alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.VISA_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Visa border ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "visa-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist visa ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.VISA_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.VISA_LINEAR_TEAM || "";
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
