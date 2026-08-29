/**
 * Spile sinks. Slack alarm on wedge / hours-held /
 * timeout-ignored / open-pipe / no-eof /
 * script-alive / parent-blind / unretracted.
 * GitHub spile-ledger of scored taps on
 * every score. Linear ticket on wedge /
 * hours-held / timeout-ignored / open-pipe.
 * Missing secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Sounder / Tappet / Quench /
 * Leat / Ullage / Bollard / Clew /
 * Binnacle / leftover woodworking. An
 * open spile is not a hold. Score the
 * tap or admit bunged.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./spile.mjs";

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

export function slackSpileAlarm(result, env = process.env) {
  const webhook = env.SPILE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Spile ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Spile: tap is ${result.verdict || "bunged"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Spile · ${result.verdict} tap alarm` : `Spile · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*pipe open* ${result.pipeOpen ? "yes" : "no"}`,
            `*eof* ${result.eofDelivered ? "yes" : "no"}`,
            `*declared timeout* ${result.declaredTimeoutSec ?? 0}s`,
            `*observed block* ${result.observedBlockSec ?? 0}s`,
            `*hook alive* ${result.hookStillAlive ? "yes" : "no"}`,
            `*parent enforced* ${result.parentEnforcedTimeout ? "yes" : "no"}`,
            `*status stuck* ${result.statusMessageStuck ? "yes" : "no"}`,
            `*notifications held* ${result.notificationsHeld ? "yes" : "no"}`,
            `*self-timeout* ${result.selfTimeoutWrapped ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Spile is ${result.verdict || "bunged"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} tap alarm on the spile.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} tap alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSpileLedger(result, env = process.env) {
  const token = env.SPILE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "spile",
    session: result.session,
    verdict: result.verdict,
    pipeOpen: Boolean(result.pipeOpen),
    eofDelivered: Boolean(result.eofDelivered),
    declaredTimeoutSec: result.declaredTimeoutSec ?? 0,
    observedBlockSec: result.observedBlockSec ?? 0,
    hookStillAlive: Boolean(result.hookStillAlive),
    parentEnforcedTimeout: result.parentEnforcedTimeout !== false,
    statusMessageStuck: Boolean(result.statusMessageStuck),
    notificationsHeld: Boolean(result.notificationsHeld),
    selfTimeoutWrapped: Boolean(result.selfTimeoutWrapped),
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
      summary: "Would open a GitHub spile-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub spile-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearSpileTicket(result, env = process.env) {
  const key = env.SPILE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `spile ${result.verdict} · Spile · ${result.source || "tap"}`.trim();
  const description = [
    "Spile scored a tap because an open spile is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `pipe open: ${result.pipeOpen ? "yes" : "no"}`,
    `eof: ${result.eofDelivered ? "yes" : "no"}`,
    `declared timeout: ${result.declaredTimeoutSec ?? 0}s`,
    `observed block: ${result.observedBlockSec ?? 0}s`,
    `hook alive: ${result.hookStillAlive ? "yes" : "no"}`,
    `parent enforced: ${result.parentEnforcedTimeout ? "yes" : "no"}`,
    "",
    loss
      ? "Wedge, hours-held, timeout-ignored, or open-pipe: the stdin pipe stayed open without EOF and the declared timeout was not a parent-side kill."
      : "Not a wedge / hours-held / timeout-ignored / open-pipe tap. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90585. Same-class #87289 (declared timeout does not apply while blocked on stdin) #85250 (timeout not enforced parent-side) #78756 (Windows client never closes hook stdin). Nearby shape only: #48009 (empty stdin) #38162 (macOS async empty stdin). NOT Sounder (missed background wakeup) / Tappet (silent hook injection) / Quench (circuit breaker) / Leat (sleep blocked unbounded) / Ullage (gauging desk) / Bollard / Clew / leftover woodworking. openai/codex#27550.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "bunged"} is not wedge / hours-held / timeout-ignored / open-pipe.`,
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
    slackSpileAlarm(result, env),
    githubSpileLedger(result, env),
    linearSpileTicket(result, env),
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
            ? `Posted ${result.verdict} tap alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SPILE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Spile tap ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "spile-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist spile ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SPILE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SPILE_LINEAR_TEAM || "";
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
