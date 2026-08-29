/**
 * Quoin sinks. Slack alarm on
 * shifted / collapsed / misattributed
 * / path-broke / regex-broke. GitHub
 * quoin-ledger of scored probes on
 * every score. Linear ticket on
 * shifted / misattributed. Missing
 * secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Scant / Sear / Grille /
 * Assay / Stencil / Gaff / Spile /
 * Sounder / Leat / leftover
 * woodworking. A shifted form is
 * not a hold. Score the chase or
 * admit locked.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./quoin.mjs";

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return SLACK_VERDICTS.includes(verdict);
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return LINEAR_VERDICTS.includes(verdict);
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackQuoinAlarm(result, env = process.env) {
  const webhook = env.QUOIN_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Quoin ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Quoin: chase is ${result.verdict || "locked"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Quoin · ${result.verdict} chase alarm` : `Quoin · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*quoted delimiter* ${result.delimiterQuoted ? "yes" : "no"}`,
            `*composed slashes* ${result.composedSlashes ?? "-"}`,
            `*received slashes* ${result.receivedSlashes ?? "-"}`,
            `*unescape pass* ${result.collapse || result.unescapeApplied ? "yes" : "no"}`,
            `*tool* ${result.tool || "-"}`,
            `*platform* ${result.platform || "-"}`,
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
      summary: `Would skip Slack. Quoin is ${result.verdict || "locked"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} chase alarm on the quoin.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} chase alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubQuoinLedger(result, env = process.env) {
  const token = env.QUOIN_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "quoin",
    session: result.session,
    verdict: result.verdict,
    delimiterQuoted: Boolean(result.delimiterQuoted),
    composedSlashes: result.composedSlashes ?? null,
    receivedSlashes: result.receivedSlashes ?? null,
    collapse: Boolean(result.collapse),
    unescapeApplied: Boolean(result.unescapeApplied),
    commandTextCollapse: Boolean(result.commandTextCollapse),
    windowsStrip: Boolean(result.windowsStrip),
    windowsHalve: Boolean(result.windowsHalve),
    regexChanged: Boolean(result.regexChanged),
    powershellHereString: Boolean(result.powershellHereString),
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub quoin-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub quoin-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearQuoinTicket(result, env = process.env) {
  const key = env.QUOIN_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `quoin ${result.verdict} · Quoin · ${result.source || "chase"}`.trim();
  const description = [
    "Quoin scored a chase because a shifted form is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `quoted delimiter: ${result.delimiterQuoted ? "yes" : "no"}`,
    `composed slashes: ${result.composedSlashes ?? "-"}`,
    `received slashes: ${result.receivedSlashes ?? "-"}`,
    `unescape pass: ${result.collapse || result.unescapeApplied ? "yes" : "no"}`,
    `tool: ${result.tool || "-"}`,
    `platform: ${result.platform || "-"}`,
    "",
    loss
      ? "Shifted or misattributed: a quoted heredoc body was unescaped before the shell, or a traceback pointed at a line the model never wrote."
      : "Not a shifted / misattributed chase. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90630. Same class #88561 #89392 #85856. Nearby #72957 (Write/Edit \\uXXXX, different tool) #90597 (platform heredoc prescription). NOT Scant / Sear / Grille / Assay / Stencil / Gaff / leftover woodworking. openai/codex#41534.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "locked"} is not shifted / misattributed.`,
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
    slackQuoinAlarm(result, env),
    githubQuoinLedger(result, env),
    linearQuoinTicket(result, env),
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
            ? `Posted ${result.verdict} chase alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.QUOIN_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Quoin chase ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "quoin-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist quoin ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.QUOIN_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.QUOIN_LINEAR_TEAM || "";
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
