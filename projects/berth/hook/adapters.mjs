/**
 * Berth sinks. Slack alarm + Linear
 * ticket on cohabited / promised-fresh /
 * same-floor / branch-stolen /
 * interleaved / chip-lied /
 * primary-dock / cwd-ignored /
 * phantom-tree.
 * GitHub berth-ledger of scored
 * berths on every score. Missing
 * secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Carrel / Fascia /
 * Byline / Datum / leftover
 * woodworking.
 * A shared berth is not a hold.
 * Score the quay or admit alongside.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./berth.mjs";

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

export function slackBerthAlarm(result, env = process.env) {
  const webhook = env.BERTH_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};

  const text = alarm
    ? `Berth ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Berth: quay is ${result.verdict || "alongside"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Berth · ${result.verdict} quay alarm` : `Berth · ${result.verdict}`,
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
            `*parent cwd* \`${facts.parentCwd || "-"}\``,
            `*chip cwd* \`${facts.chipCwd || "-"}\``,
            `*cwd param* \`${facts.cwdParam || "-"}\``,
            `*worktree ok* ${facts.worktreeOk ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Berth is ${result.verdict || "alongside"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} quay alarm.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} quay alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubBerthLedger(result, env = process.env) {
  const token = env.BERTH_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "berth",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    parentCwd: facts.parentCwd || "",
    chipCwd: facts.chipCwd || "",
    cwdParam: facts.cwdParam || "",
    worktreeOk: Boolean(facts.worktreeOk),
    alongside: Boolean(result.alongside),
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
      summary: "Would open a GitHub berth-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub berth-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearBerthTicket(result, env = process.env) {
  const key = env.BERTH_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `berth ${result.verdict} · Berth · ${result.source || "quay"}`.trim();
  const description = [
    "Berth scored a quay because a shared berth is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `parent cwd: ${result.facts?.parentCwd || "-"}`,
    `chip cwd: ${result.facts?.chipCwd || "-"}`,
    `cwd param: ${result.facts?.cwdParam || "-"}`,
    `worktree ok: ${result.facts?.worktreeOk ? "yes" : "no"}`,
    "",
    loss
      ? "Cohabited, promised-fresh, same-floor, branch-stolen, interleaved, chip-lied, primary-dock, cwd-ignored, or phantom-tree: spawn_task chip docked in the parent's working tree despite promising a fresh worktree."
      : "Not a shared-tree quay. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90668. Same-class nearby: #77263 #79234. Related, different: #90638 Fascia #90661 Carrel #86691 #81213 #89940. Cross-ecosystem: openai/codex#31572 #33144 #18969. NOT Carrel / Fascia / Byline / Datum / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "alongside"} is not a shared-tree quay alarm.`,
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
    slackBerthAlarm(result, env),
    githubBerthLedger(result, env),
    linearBerthTicket(result, env),
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
            ? `Posted ${result.verdict} quay alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.BERTH_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Berth quay ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "berth-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist berth ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.BERTH_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.BERTH_LINEAR_TEAM || "";
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
