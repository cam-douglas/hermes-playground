/**
 * Waif sinks. Slack alarm + Linear
 * ticket on abandoned / orphaned /
 * tree-alive / parent-dead /
 * timeout-seen / group-unkilled /
 * job-missing / taskkill-skipped /
 * defender-load.
 * GitHub waif-ledger of scored
 * intakes on every score. Missing
 * secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Gaff / Berth /
 * Carrel / leftover woodworking.
 * An abandoned child is not a hold.
 * Score the ward or admit sheltered.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./waif.mjs";

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

export function slackWaifAlarm(result, env = process.env) {
  const webhook = env.WAIF_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};

  const text = alarm
    ? `Waif ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Waif: ward is ${result.verdict || "sheltered"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Waif · ${result.verdict} ward alarm` : `Waif · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*event class* ${result.eventClass || "-"}`,
            `*timed out* ${facts.timedOut ? "yes" : "no"}`,
            `*parent alive* ${facts.parentAlive == null ? "-" : facts.parentAlive}`,
            `*child count* ${facts.childCount ?? "-"}`,
            `*children with dead parent* ${facts.childrenWithDeadParent ?? "-"}`,
            `*model saw* ${facts.modelSaw || "-"}`,
            `*platform* ${facts.platform || "-"}`,
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
      summary: `Would skip Slack. Waif is ${result.verdict || "sheltered"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} ward alarm.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} ward alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubWaifLedger(result, env = process.env) {
  const token = env.WAIF_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "waif",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    timedOut: Boolean(facts.timedOut),
    parentAlive: facts.parentAlive,
    childCount: facts.childCount ?? 0,
    childrenWithDeadParent: facts.childrenWithDeadParent ?? 0,
    modelSaw: facts.modelSaw || "",
    platform: facts.platform || "",
    sheltered: Boolean(result.sheltered),
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
      summary: "Would open a GitHub waif-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub waif-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearWaifTicket(result, env = process.env) {
  const key = env.WAIF_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `waif ${result.verdict} · Waif · ${result.source || "ward"}`.trim();
  const description = [
    "Waif scored a ward because an abandoned child is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `timed out: ${result.facts?.timedOut ? "yes" : "no"}`,
    `parent alive: ${result.facts?.parentAlive == null ? "-" : result.facts.parentAlive}`,
    `child count: ${result.facts?.childCount ?? "-"}`,
    `children with dead parent: ${result.facts?.childrenWithDeadParent ?? "-"}`,
    `model saw: ${result.facts?.modelSaw || "-"}`,
    `platform: ${result.facts?.platform || "-"}`,
    "",
    loss
      ? "Abandoned, orphaned, tree-alive, parent-dead, timeout-seen, group-unkilled, job-missing, taskkill-skipped, or defender-load: Bash timeout returned an error to the model but the child process tree was never killed."
      : "Not an abandoned-tree ward. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90672. Same-class nearby: #78030 #76353 #85200 #84464 #82433 #76056 #84647 #79727. Related, different: #90616 Gaff #90668 Berth #90661 Carrel #90662 Byline. Cross-ecosystem: openai/codex#35393 #30802 #37770 #25388. NOT Gaff / Berth / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "sheltered"} is not an abandoned-tree ward alarm.`,
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
    slackWaifAlarm(result, env),
    githubWaifLedger(result, env),
    linearWaifTicket(result, env),
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
            ? `Posted ${result.verdict} ward alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.WAIF_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Waif ward ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "waif-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist waif ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.WAIF_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.WAIF_LINEAR_TEAM || "";
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
