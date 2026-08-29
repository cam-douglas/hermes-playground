/**
 * Gaff sinks. Slack alarm on billed /
 * truncated / empty-ok / hours-lost /
 * sigkilled. GitHub gaff-ledger of
 * scored playbills on every score.
 * Linear ticket on billed /
 * hours-lost. Missing secrets stay
 * honest: a demo row, never a fake
 * live 200.
 *
 * This is NOT Spile / Sounder / Sear /
 * Leat / Quench / Knock / Reveille /
 * leftover woodworking. A billed
 * full house is not a hold. Score
 * the crook or admit yanked.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./gaff.mjs";

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

export function slackGaffAlarm(result, env = process.env) {
  const webhook = env.GAFF_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Gaff ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Gaff: playbill is ${result.verdict || "yanked"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Gaff · ${result.verdict} house alarm` : `Gaff · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*status* ${result.reportedStatus || "-"}`,
            `*exit* ${result.exitCode == null ? "-" : result.exitCode}`,
            `*timeout-kill* ${result.timeoutKilled ? "yes" : "no"}`,
            `*truncated* ${result.outputTruncated ? "yes" : "no"}`,
            `*midloop* ${result.midloopPrefix ? "yes" : "no"}`,
            `*sigkill* ${result.trapsNeverFired ? "yes" : "no"}`,
            `*group-reaped* ${result.processGroupReaped ? "yes" : "no"}`,
            `*turn-killed* ${result.turnBoundary ? "yes" : "no"}`,
            `*empty-ok* ${result.emptyOutput ? "yes" : "no"}`,
            `*hours-lost* ${result.remainingUnits != null ? result.remainingUnits : "-"}`,
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
      summary: `Would skip Slack. Gaff is ${result.verdict || "yanked"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} house alarm on the gaff.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} house alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubGaffLedger(result, env = process.env) {
  const token = env.GAFF_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "gaff",
    session: result.session,
    verdict: result.verdict,
    reportedStatus: result.reportedStatus || "",
    exitCode: result.exitCode,
    timeoutKilled: Boolean(result.timeoutKilled),
    outputTruncated: Boolean(result.outputTruncated),
    midloopPrefix: Boolean(result.midloopPrefix),
    trapsNeverFired: Boolean(result.trapsNeverFired),
    processGroupReaped: Boolean(result.processGroupReaped),
    turnBoundary: Boolean(result.turnBoundary),
    emptyOutput: Boolean(result.emptyOutput),
    remainingUnits: result.remainingUnits,
    userToldSuccess: Boolean(result.userToldSuccess),
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
      summary: "Would open a GitHub gaff-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub gaff-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearGaffTicket(result, env = process.env) {
  const key = env.GAFF_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `gaff ${result.verdict} · Gaff · ${result.source || "stage"}`.trim();
  const description = [
    "Gaff scored a playbill because a billed full house is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `status: ${result.reportedStatus || "-"}`,
    `exit: ${result.exitCode == null ? "-" : result.exitCode}`,
    `timeout-kill: ${result.timeoutKilled ? "yes" : "no"}`,
    `truncated: ${result.outputTruncated ? "yes" : "no"}`,
    `sigkill: ${result.trapsNeverFired ? "yes" : "no"}`,
    `remaining units: ${result.remainingUnits != null ? result.remainingUnits : "-"}`,
    "",
    loss
      ? "Billed or hours-lost: the harness killed a background Bash command and the receipt said completed exit 0. Remaining work was reported as a full house."
      : "Not a billed / hours-lost playbill. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90616. Same class #87055 (SIGKILL / traps never fire) #88754 (turn-boundary status mismatch). Nearby silence, not this: #84625 #90490. NOT Spile / Sounder / Sear / Leat / Quench / Knock / Reveille / leftover woodworking. openai/codex#19309.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "yanked"} is not billed / hours-lost.`,
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
    slackGaffAlarm(result, env),
    githubGaffLedger(result, env),
    linearGaffTicket(result, env),
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
            ? `Posted ${result.verdict} house alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.GAFF_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Gaff playbill ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "gaff-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist gaff ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.GAFF_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.GAFF_LINEAR_TEAM || "";
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
