/**
 * Pirn sinks. Slack alarm on cropped / thrice / tagged / looped /
 * midcut. GitHub pirn-ledger of scored pirns on every score.
 * Linear ticket on cropped / thrice. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Shunt / Cote / Husk / Coda / Aside / Suture /
 * Cotter. A first delivery is not a hold. Score the pirn or
 * admit beamed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./pirn.mjs";

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

export function slackPirnAlarm(result, env = process.env) {
  const webhook =
    env.PIRN_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const runs = result.runs != null ? `runs ${result.runs}` : "";

  const text = alarm
    ? `Pirn ${String(result.verdict || "").toUpperCase()} · ${headline(result)}${runs ? ` · ${runs}` : ""}`
    : `Pirn: pirn is ${result.verdict || "beamed"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Pirn · ${result.verdict} yarn alarm` : `Pirn · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*chars* ${result.charCount ?? 0} / ${result.capChars ?? 2500}`,
            `*runs* ${result.runs ?? 0}`,
            `*reRun* ${result.reRun ? "yes · full transcript resume" : "no"}`,
            `*instructionShaped* ${result.instructionShaped ? "yes · settings-json" : "no"}`,
            `*truncated* ${result.truncated ? "yes" : "no"}`,
            `*agentIdleGreen* ${result.agentIdleGreen ? "yes · lying" : "no"}`,
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
      summary: `Would skip Slack. Pirn is ${result.verdict || "beamed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} yarn alarm on the pirn bench.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} yarn alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubPirnLedger(result, env = process.env) {
  const token = env.PIRN_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "pirn",
    session: result.session,
    verdict: result.verdict,
    charCount: result.charCount ?? 0,
    capChars: result.capChars ?? 2500,
    runs: result.runs ?? 0,
    reRun: Boolean(result.reRun),
    truncated: Boolean(result.truncated),
    instructionShaped: Boolean(result.instructionShaped),
    harnessTag: result.harnessTag || "",
    agentIdleGreen: Boolean(result.agentIdleGreen),
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
      summary: "Would open a GitHub pirn-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub pirn-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearPirnTicket(result, env = process.env) {
  const key = env.PIRN_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `pirn ${result.verdict} · Pirn · ${result.source || "bench"}`.trim();
  const description = [
    "Pirn scored a yarn package because a first delivery is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `chars: ${result.charCount ?? 0} / ${result.capChars ?? 2500}`,
    `runs: ${result.runs ?? 0}`,
    `reRun: ${result.reRun ? "yes" : "no"}`,
    `instructionShaped: ${result.instructionShaped ? "yes" : "no"}`,
    `truncated: ${result.truncated ? "yes" : "no"}`,
    "",
    loss
      ? "Cropped or thrice: the harness tagged instruction-shaped and cut the report, or three full runs paid for the same tail."
      : "Not a cropped / thrice pirn. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90544. Same-class #74113 #86471 #77112 #75298 (nearby shape only). NOT Shunt #90463 / Cote / Husk / Coda / Aside / Suture / Cotter. openai/codex#34468 (cost-multiplier parent). openai/codex#37822 (dropped followup payload).",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "beamed"} is not cropped / thrice.`,
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
    slackPirnAlarm(result, env),
    githubPirnLedger(result, env),
    linearPirnTicket(result, env),
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
            ? `Posted ${result.verdict} yarn alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.PIRN_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Pirn yarn ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "pirn-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist pirn ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.PIRN_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.PIRN_LINEAR_TEAM || "";
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
