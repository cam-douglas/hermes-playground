/**
 * Ullage sinks. Slack thrash alarm on thrashed / frozen / ullaged /
 * leaked / silent. GitHub ullage-ledger of cellar events on every
 * scored cask. Linear waste ticket when wasted weighted tokens exceed
 * the threshold. Missing secrets stay honest: a demo row, never a
 * fake live 200.
 *
 * This is NOT Fathom / Quench / Coda / Visa / Sprag. A missing
 * compaction ticket is not a hold. Score the cask or admit gauged.
 */

import { LINEAR_WASTE_THRESHOLD, SLACK_VERDICTS } from "./ullage.mjs";

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
  return Number(result.waste || 0) >= LINEAR_WASTE_THRESHOLD;
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackThrashAlarm(result, env = process.env) {
  const webhook =
    env.ULLAGE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Ullage ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Ullage: cask is ${result.verdict || "gauged"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Ullage · ${result.verdict} thrash alarm` : `Ullage · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*cluster length* ${result.freezeCount || 0}`,
            `*prefix freeze* ${result.prefixHint || "-"}`,
            `*drop size* ${result.dropSize || 0}`,
            `*waste (weighted)* ${result.waste || 0}`,
            `*tickets* ${result.ticketsPresent ? "present" : "absent"}`,
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
      summary: `Would skip Slack. Cask is ${result.verdict || "gauged"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} thrash alarm on the weeping bung.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} thrash alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubUllageLedger(result, env = process.env) {
  const token = env.ULLAGE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "ullage",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    dropSize: result.dropSize || 0,
    freezeCount: result.freezeCount || 0,
    waste: result.waste || 0,
    ticketsPresent: Boolean(result.ticketsPresent),
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub ullage-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub ullage-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearWasteTicket(result, env = process.env) {
  const key = env.ULLAGE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `cellar ${result.verdict} · Ullage · ${result.source || "desk"}`.trim();
  const description = [
    "Ullage scored a cask because a missing compaction ticket is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `drop size: ${result.dropSize || 0}`,
    `rewrite / freeze count: ${result.freezeCount || 0}`,
    `wasted weighted tokens: ${result.waste || 0}`,
    `compact tickets: ${result.ticketsPresent ? "present" : "absent"}`,
    "",
    Number(result.waste || 0) >= LINEAR_WASTE_THRESHOLD
      ? `Waste exceeds the ${LINEAR_WASTE_THRESHOLD} weighted-token threshold (input×1 + cache_read×0.1 + cache_creation×2 + output×5).`
      : "Waste is under the Linear threshold.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90509. Shape: #87966 #89621 #87215 #90144 #83913.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Waste ${result.waste || 0} is under threshold.`,
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
    slackThrashAlarm(result, env),
    githubUllageLedger(result, env),
    linearWasteTicket(result, env),
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
            ? `Posted ${result.verdict} thrash alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.ULLAGE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Ullage cellar ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "ullage-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist ullage ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.ULLAGE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.ULLAGE_LINEAR_TEAM || "";
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
