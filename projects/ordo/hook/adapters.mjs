/**
 * Ordo sinks. Slack alarm on silent / hollow / unknown. GitHub
 * ordo-ledger of scored offices on every score. Linear ticket on
 * silent (unattended missal miss). Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Larder / Tappet / Reed / Assay / Cinch / Sprag / Visa.
 * A written plugin command is not a hold. Score the missal or
 * admit appointed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./ordo.mjs";

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

export function slackOrdoAlarm(result, env = process.env) {
  const webhook =
    env.ORDO_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Ordo ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Ordo: missal is ${result.verdict || "appointed"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Ordo · ${result.verdict} missal alarm` : `Ordo · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*office* \`${result.command || "—"}\``,
            `*num_turns* ${result.numTurns ?? "—"}`,
            `*is_error* ${result.isError ?? "—"}`,
            `*exit* ${result.exitCode ?? "—"}`,
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
      summary: `Would skip Slack. Missal is ${result.verdict || "appointed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} missal alarm on the silent office.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} missal alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubOrdoLedger(result, env = process.env) {
  const token = env.ORDO_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "ordo",
    session: result.session,
    verdict: result.verdict,
    command: result.command || "",
    numTurns: result.numTurns,
    isError: result.isError,
    exitCode: result.exitCode,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    storedAsResult: Boolean(result.storedAsResult),
    resolved: result.resolved,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub ordo-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub ordo-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearMissalTicket(result, env = process.env) {
  const key = env.ORDO_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `missal ${result.verdict} · Ordo · ${result.source || "desk"}`.trim();
  const description = [
    "Ordo scored a missal because a written plugin command is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `office: ${result.command || "—"}`,
    `num_turns: ${result.numTurns ?? "—"}`,
    `is_error: ${result.isError ?? "—"}`,
    `exit: ${result.exitCode ?? "—"}`,
    "",
    loss
      ? "Silent: Unknown command with is_error false and exit 0. Unattended wrappers treat this as success."
      : "Not a silent missal miss. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90515. Shape: #37862 #41842 #17271 #64669 #8430. openai/codex#14459 #15980.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "appointed"} is not silent.`,
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
    slackOrdoAlarm(result, env),
    githubOrdoLedger(result, env),
    linearMissalTicket(result, env),
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
            ? `Posted ${result.verdict} missal alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.ORDO_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Ordo missal ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "ordo-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist ordo ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.ORDO_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.ORDO_LINEAR_TEAM || "";
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
