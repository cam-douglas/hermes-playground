/**
 * Iota sinks. Slack iota alarm on split / twinned /
 * hidden / unparseable / dropped / mixed / aliased,
 * GitHub iota-ledger of identity events on every scored
 * probe, Linear ticket on split / twinned / unparseable /
 * dropped. Missing secrets stay honest: a demo row, never
 * a fake live 200.
 *
 * This is NOT Reed (MCP contacts). NOT Gasket (allowlist
 * discard). NOT Larder (plugin-store freeze). NOT Leat
 * (until-loop). NOT Husk (hollow success). Project-path
 * identity: one directory, many case/slash spellings.
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
    verdict === "split" ||
    verdict === "twinned" ||
    verdict === "hidden" ||
    verdict === "unparseable" ||
    verdict === "dropped" ||
    verdict === "mixed" ||
    verdict === "aliased"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "split" ||
    verdict === "twinned" ||
    verdict === "unparseable" ||
    verdict === "dropped"
  );
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackIotaAlarm(result, env = process.env) {
  const webhook =
    env.IOTA_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Iota ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Iota: case is ${result.verdict || "bound"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Iota · ${result.verdict} case alarm` : `Iota · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*keys* ${(result.keys && result.keys.length) || 0}`,
            `*mcp write* ${result.mcpWriteKey || "none"}`,
            `*session read* ${result.sessionReadKey || "none"}`,
            `*mcp absent* ${result.mcpAbsent ? "yes" : "no"}`,
            `*parse* ${result.parseError || "none"}`,
            `*permissions.allow* ${result.permissionsAllow ?? 0}`,
            `*permissions honored* ${result.permissionsHonored ?? 0}`,
            `*helper ran* ${result.helperRan ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Case is ${result.verdict || "bound"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} iota alarm on the split case.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} iota alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubIotaLedger(result, env = process.env) {
  const token = env.IOTA_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "iota",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    keys: result.keys,
    mcpWriteKey: result.mcpWriteKey,
    sessionReadKey: result.sessionReadKey,
    mcpAbsent: result.mcpAbsent,
    trustWriteKey: result.trustWriteKey,
    trustLookupKey: result.trustLookupKey,
    helperRan: result.helperRan,
    permissionsAllow: result.permissionsAllow,
    permissionsHonored: result.permissionsHonored,
    pluginsKeys: result.pluginsKeys,
    parseError: result.parseError,
    filesystemCaseInsensitive: result.filesystemCaseInsensitive,
    doeFoldsSeparators: result.doeFoldsSeparators,
    doeFoldsDriveCase: result.doeFoldsDriveCase,
    conversationsEmpty: result.conversationsEmpty,
    mergedResplit: result.mergedResplit,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub iota-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub iota-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearIotaTicket(result, env = process.env) {
  const key = env.IOTA_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `case ${result.verdict} · Iota · ${result.source || "drawer"}`.trim();
  const description = [
    "Iota refused a case because a second casing is not a plot.",
    "",
    headline(result),
    "",
    result.verdict === "split"
      ? "Two JSON keys differ only in case for the same directory. .claude vs .Claude. ConvertFrom-Json throws DuplicateKeysInJsonString. mcp add landed on Project1 while the session read project1."
      : result.verdict === "twinned"
        ? "One directory stored under two or more path spellings, splitting trust, MCP servers, and worktree state."
        : result.verdict === "unparseable"
          ? "PowerShell ConvertFrom-Json throws DuplicateKeysInJsonString so the file will not parse."
          : result.verdict === "dropped"
            ? "Trust or permissions.allow ignored because the drive letter or casing was not canonicalized."
            : "Case named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90438. Shape: #75855 #90041 #85344 #88418 #76994 #80264 #84354.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Case is ${result.verdict || "bound"}.`,
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
    slackIotaAlarm(result, env),
    githubIotaLedger(result, env),
    linearIotaTicket(result, env),
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
            ? `Posted ${result.verdict} iota alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.IOTA_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Iota identity ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "iota-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist iota ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.IOTA_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.IOTA_LINEAR_TEAM || "";
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
