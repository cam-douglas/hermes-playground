/**
 * Bollard sinks. Slack alarm on orphaned / gap-fatal /
 * sessions-dead / poll-401 / offline-lie / mem-thrash /
 * cred-stale / reattach-denied. GitHub bollard-ledger
 * of scored piers on every score. Linear ticket on
 * orphaned / gap-fatal / sessions-dead / poll-401.
 * Missing secrets stay honest: a demo row, never a
 * fake live 200.
 *
 * This is NOT Clew / Sounder / Reveille / Cote /
 * Binnacle / Hasp / Wicket / Parity. A slack hawser
 * is not a hold. Score the bollard or admit belayed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./bollard.mjs";

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

export function slackBollardAlarm(result, env = process.env) {
  const webhook = env.BOLLARD_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Bollard ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Bollard: pier is ${result.verdict || "belayed"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Bollard · ${result.verdict} pier alarm` : `Bollard · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*gap* ${result.supervisorGapSec ?? 0}s`,
            `*env preserved* ${result.envPreserved ? "yes" : "no"}`,
            `*env deleted* ${result.envDeleted ? "yes" : "no"}`,
            `*new env id* ${result.newEnvId ? "yes" : "no"}`,
            `*sessions shut down* ${result.sessionsShutDown ?? 0}`,
            `*sessions unresumable* ${result.sessionsUnresumable ?? 0}`,
            `*poll401* ${result.poll401 ? "yes" : "no"}`,
            `*rss* ${result.rssGiB ?? 0} GiB`,
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
      summary: `Would skip Slack. Bollard is ${result.verdict || "belayed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} pier alarm on the bollard.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} pier alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubBollardLedger(result, env = process.env) {
  const token = env.BOLLARD_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "bollard",
    session: result.session,
    verdict: result.verdict,
    supervisorGapSec: result.supervisorGapSec ?? 0,
    envPreserved: Boolean(result.envPreserved),
    envDeleted: Boolean(result.envDeleted),
    newEnvId: Boolean(result.newEnvId),
    sessionsShutDown: result.sessionsShutDown ?? 0,
    sessionsUnresumable: result.sessionsUnresumable ?? 0,
    poll401: Boolean(result.poll401),
    credsWorkedAfterRestart: Boolean(result.credsWorkedAfterRestart),
    rssGiB: result.rssGiB ?? 0,
    swapGiB: result.swapGiB ?? 0,
    stillLogging: Boolean(result.stillLogging),
    serverSaidOffline: Boolean(result.serverSaidOffline),
    reattachAllowed: result.reattachAllowed !== false,
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
      summary: "Would open a GitHub bollard-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub bollard-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearBollardTicket(result, env = process.env) {
  const key = env.BOLLARD_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `bollard ${result.verdict} · Bollard · ${result.source || "pier"}`.trim();
  const description = [
    "Bollard scored a pier because a slack hawser is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `gap: ${result.supervisorGapSec ?? 0}s`,
    `env preserved: ${result.envPreserved ? "yes" : "no"}`,
    `env deleted: ${result.envDeleted ? "yes" : "no"}`,
    `new env id: ${result.newEnvId ? "yes" : "no"}`,
    `sessions shut down: ${result.sessionsShutDown ?? 0}`,
    `sessions unresumable: ${result.sessionsUnresumable ?? 0}`,
    `poll401: ${result.poll401 ? "yes" : "no"}`,
    `rss: ${result.rssGiB ?? 0} GiB`,
    "",
    loss
      ? "Orphaned, gap-fatal, sessions-dead, or poll-401: the server GC'd the environment or the supervisor tore down every session."
      : "Not an orphaned / gap-fatal / sessions-dead / poll-401 bollard. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90581. Same-class #87213 (resume replays dead RC binding) #33041 (RC disconnects frequently) #78597 (remote credentials fetch failed in long-lived session) #78607 (RC connection failures) #90577 (Connected status flickers) #78778 (RC doesn't reap finished --print children) #85639 (headless supervisor never reaps children → OOM). NOT Clew (ARG_MAX / deny-list E2BIG) / Sounder (missed background wakeup) / Reveille (living muster) / Cote (--resume hub identity) / Binnacle (TUI origin split) / Hasp / Wicket / Parity / leftover woodworking. openai/codex#35217 #39863 #36189.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "belayed"} is not orphaned / gap-fatal / sessions-dead / poll-401.`,
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
    slackBollardAlarm(result, env),
    githubBollardLedger(result, env),
    linearBollardTicket(result, env),
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
            ? `Posted ${result.verdict} pier alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.BOLLARD_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Bollard pier ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "bollard-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist bollard ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.BOLLARD_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.BOLLARD_LINEAR_TEAM || "";
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
