/**
 * Ambo sinks. Slack chip + Linear
 * ticket on logged-success /
 * plan-card / silent-surface /
 * tui-blank / vscode-blank /
 * decision-free /
 * terminal-sequence-ok /
 * docs-all-hooks / deferred-path
 * when this bug (not a labeled
 * contrast). GitHub ambo-ledger of
 * scored intakes on every score.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Slype / Tally / Pale
 * / Chatelaine / Waif / Berth /
 * Carrel / Cotter / leftover
 * woodworking. The pulpit spoke;
 * the nave never heard. Score the
 * card or admit unheard.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./ambo.mjs";

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return Boolean(result.slack ?? (SLACK_VERDICTS.includes(verdict) && !result.offAmbo));
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return Boolean(result.linear ?? (LINEAR_VERDICTS.includes(verdict) && !result.offAmbo));
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackAmboAlarm(result, env = process.env) {
  const webhook = env.AMBO_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};
  const copy =
    result.slackCopy ||
    (alarm
      ? `Ambo ${result.verdict} · ${facts.hookEvent || "PermissionRequest"} · ${facts.tool || "ExitPlanMode"} · card blank`
      : `Ambo: card is ${result.verdict || "unheard"} on ${result.session || "session"}.`);

  const body = {
    text: copy,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Ambo · ${result.verdict} (fail, never a hold)` : `Ambo · ${result.verdict}`,
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
            `*hook event* ${facts.hookEvent || "-"}`,
            `*tool* ${facts.tool || "-"}`,
            `*systemMessage* ${facts.systemMessage || "-"}`,
            `*hook log success* ${facts.hookLogSuccess ? "yes" : "no"}`,
            `*parsed validated* ${facts.parsedValidated ? "yes" : "no"}`,
            `*rendered* ${facts.rendered ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Ambo is ${result.verdict || "unheard"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${copy}`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} card alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubAmboLedger(result, env = process.env) {
  const token = env.AMBO_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "ambo",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    hookEvent: facts.hookEvent || "",
    tool: facts.tool || "",
    systemMessage: facts.systemMessage || "",
    hookLogSuccess: Boolean(facts.hookLogSuccess),
    parsedValidated: Boolean(facts.parsedValidated),
    rendered: Boolean(facts.rendered),
    unheard: Boolean(result.unheard),
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
      summary: "Would append a GitHub ambo-ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub ambo-ledger row.",
    tokenPresent: true,
    line,
  };
}

export function linearAmboTicket(result, env = process.env) {
  const key = env.AMBO_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `ambo ${result.verdict} · Ambo · ${result.source || "card"}`.trim();
  const description = [
    "Ambo scored a card because the pulpit spoke and the nave never heard.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `hook event: ${result.facts?.hookEvent || "-"}`,
    `tool: ${result.facts?.tool || "-"}`,
    `systemMessage: ${result.facts?.systemMessage || "-"}`,
    `hook log success: ${result.facts?.hookLogSuccess ? "yes" : "no"}`,
    `parsed validated: ${result.facts?.parsedValidated ? "yes" : "no"}`,
    `rendered: ${result.facts?.rendered ? "yes" : "no"}`,
    "",
    loss
      ? "logged-success / plan-card / silent-surface / tui-blank / vscode-blank / decision-free / terminal-sequence-ok / docs-all-hooks / deferred-path: PermissionRequest systemMessage is accepted and logged as success but never rendered at the ExitPlanMode approval prompt."
      : "Not an ambo-card alarm. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90685. Contrast (not this): #80693 #78266 #86168 #80882 #76736. Cross-ecosystem: openai/codex#17745 #35906 #33020. NOT Slype / Tally / Pale / Chatelaine / Waif / Berth / Carrel / Cotter.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "unheard"} is not an ambo-card alarm.`,
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
    slackAmboAlarm(result, env),
    githubAmboLedger(result, env),
    linearAmboTicket(result, env),
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
            ? `Posted ${result.verdict} card alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.AMBO_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Ambo card ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "ambo-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist ambo ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.AMBO_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.AMBO_LINEAR_TEAM || "";
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
