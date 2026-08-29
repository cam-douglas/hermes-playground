/**
 * Calque sinks. Slack alarm on
 * calqued / aliased / quote-blind /
 * frag-quote / commit-blocked /
 * path-lie / spanish-del.
 * GitHub calque-ledger of scored
 * probes on every score. Linear
 * ticket on calqued / spanish-del /
 * commit-blocked.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Visa / Fob / Snib /
 * Knock / Veto / Quoin / Sear /
 * Gaff / Grille / Spile / Fascia /
 * Wicket / Iota / leftover
 * woodworking.
 * Quoted string content is not a
 * command. Score the folio or
 * admit verbatim.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./calque.mjs";

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

export function slackCalqueAlarm(result, env = process.env) {
  const webhook = env.CALQUE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Calque ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Calque: folio is ${result.verdict || "verbatim"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Calque · ${result.verdict} folio alarm` : `Calque · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*tool* ${result.tool || "-"}`,
            `*command* ${result.command || "-"}`,
            `*message* ${result.messageText || "-"}`,
            `*extracted* ${result.extractedPath || "-"}`,
            `*blocked* ${result.blocked ? "yes" : "no"}`,
            `*block* ${result.blockMessage || "-"}`,
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
      summary: `Would skip Slack. Calque is ${result.verdict || "verbatim"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} folio alarm on the calque.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} folio alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCalqueLedger(result, env = process.env) {
  const token = env.CALQUE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "calque",
    session: result.session,
    verdict: result.verdict,
    command: result.command || "",
    tool: result.tool || "",
    messageText: result.messageText || "",
    quotedPaths: result.quotedPaths || [],
    extractedPath: result.extractedPath || "",
    blocked: Boolean(result.blocked),
    blockMessage: result.blockMessage || "",
    verbatim: Boolean(result.verbatim),
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
      summary: "Would open a GitHub calque-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub calque-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearCalqueTicket(result, env = process.env) {
  const key = env.CALQUE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `calque ${result.verdict} · Calque · ${result.source || "folio"}`.trim();
  const description = [
    "Calque scored a folio because quoted string content is not a command.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `tool: ${result.tool || "-"}`,
    `command: ${result.command || "-"}`,
    `message: ${result.messageText || "-"}`,
    `extracted: ${result.extractedPath || "-"}`,
    `blocked: ${result.blocked ? "yes" : "no"}`,
    "",
    loss
      ? "Calqued, spanish-del, or commit-blocked: the PowerShell guard calqued English del onto Spanish del inside quotes, or a plain git commit was denied before execution."
      : "Not a calqued / spanish-del / commit-blocked folio. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90645. Related (not identical) #69461 #73524 #73882. NOT Visa / Fob / Snib / Knock / Veto / Quoin / Sear / Gaff / Grille / Spile / Fascia / Wicket / Iota / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "verbatim"} is not calqued / spanish-del / commit-blocked.`,
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
    slackCalqueAlarm(result, env),
    githubCalqueLedger(result, env),
    linearCalqueTicket(result, env),
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
            ? `Posted ${result.verdict} folio alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CALQUE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Calque folio ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "calque-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist calque ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CALQUE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CALQUE_LINEAR_TEAM || "";
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
