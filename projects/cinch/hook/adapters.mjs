/**
 * Cinch sinks. Slack alarm on slipped / dropped / omitted / delivered /
 * phantom / loose. GitHub cinch-ledger of scored packs on every score.
 * Linear ticket when omitted or delivered. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Fusee / Wicket / Larder / Hasp / Sprag / Ullage / Visa.
 * A written Trusted-folders list is not a hold. Score the girth or
 * admit cinched.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./cinch.mjs";

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

export function slackCinchAlarm(result, env = process.env) {
  const webhook =
    env.CINCH_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Cinch ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Cinch: pack is ${result.verdict || "cinched"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Cinch · ${result.verdict} pack alarm` : `Cinch · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*missing* ${(result.missing || []).join(", ") || "none"}`,
            `*extra* ${(result.extra || []).join(", ") || "none"}`,
            `*leafProceed* ${result.leafProceed ? "yes" : "no"}`,
            `*shipped* ${result.shipped ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Pack is ${result.verdict || "cinched"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} pack alarm on the slipped cinch.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} pack alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCinchLedger(result, env = process.env) {
  const token = env.CINCH_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "cinch",
    session: result.session,
    verdict: result.verdict,
    missing: result.missing || [],
    extra: result.extra || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    leafProceed: Boolean(result.leafProceed),
    shipped: Boolean(result.shipped),
    halted: Boolean(result.halted),
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub cinch-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub cinch-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearPackTicket(result, env = process.env) {
  const key = env.CINCH_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `pack ${result.verdict} · Cinch · ${result.source || "desk"}`.trim();
  const description = [
    "Cinch scored a pack because a written Trusted-folders list is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `missing: ${(result.missing || []).join(", ") || "none"}`,
    `extra: ${(result.extra || []).join(", ") || "none"}`,
    `leafProceed: ${result.leafProceed ? "yes" : "no"}`,
    `shipped: ${result.shipped ? "yes" : "no"}`,
    "",
    loss
      ? "Omitted or delivered: incomplete content left the tack room as if the girth held."
      : "Not an omitted / delivered pack. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90506. Shape: #47180 #59302 #89813 #85577 #38993 #71307. openai/codex#35134 #22827.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "cinched"} is not omitted / delivered.`,
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
    slackCinchAlarm(result, env),
    githubCinchLedger(result, env),
    linearPackTicket(result, env),
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
            ? `Posted ${result.verdict} pack alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CINCH_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Cinch pack ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "cinch-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist cinch ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CINCH_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CINCH_LINEAR_TEAM || "";
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
