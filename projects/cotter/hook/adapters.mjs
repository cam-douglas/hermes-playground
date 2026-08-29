/**
 * Cotter sinks. Slack alarm on poison / wipe / hollow / vanish /
 * mute-mcp. GitHub cotter-ledger of scored trays on every score.
 * Linear ticket on poison / wipe. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Fusee / Cinch / Reveille / Fob / Ordo / Ullage /
 * Visa / Sprag / Larder / Hasp / Wicket / Tappet. A written
 * fireAt is not a hold. Score the pin or admit snug.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./cotter.mjs";

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

export function slackCotterAlarm(result, env = process.env) {
  const webhook =
    env.COTTER_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const dark = result.dispatcherDark
    ? `dispatcher dark ${result.darkHours || 0}h`
    : "";

  const text = alarm
    ? `Cotter ${String(result.verdict || "").toUpperCase()} · ${headline(result)}${dark ? ` · ${dark}` : ""}`
    : `Cotter: tray is ${result.verdict || "snug"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Cotter · ${result.verdict} pin alarm` : `Cotter · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*pins* ${result.taskCount ?? 0}`,
            `*string fireAt* ${result.stringPins ?? 0}`,
            `*zodRejected* ${result.zodRejected ? "yes · fail-closed" : "no"}`,
            `*proxiesGreen* ${result.proxiesGreen ? "yes · lying" : "no"}`,
            `*dispatcherDark* ${result.dispatcherDark ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Tray is ${result.verdict || "snug"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} pin alarm on the cotter bench.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} pin alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCotterLedger(result, env = process.env) {
  const token = env.COTTER_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "cotter",
    session: result.session,
    verdict: result.verdict,
    taskCount: result.taskCount ?? 0,
    stringPins: result.stringPins ?? 0,
    zodRejected: Boolean(result.zodRejected),
    proxiesGreen: Boolean(result.proxiesGreen),
    dispatcherDark: Boolean(result.dispatcherDark),
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
      summary: "Would open a GitHub cotter-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub cotter-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearPinTicket(result, env = process.env) {
  const key = env.COTTER_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `pin ${result.verdict} · Cotter · ${result.source || "bench"}`.trim();
  const description = [
    "Cotter scored a pin tray because a written fireAt is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `pins: ${result.taskCount ?? 0}`,
    `string fireAt: ${result.stringPins ?? 0}`,
    `zodRejected: ${result.zodRejected ? "yes" : "no"}`,
    `dispatcherDark: ${result.dispatcherDark ? "yes" : "no"}`,
    "",
    loss
      ? "Poison or wipe: one bad pin fail-closed the tray, or the registry was emptied."
      : "Not a poison / wipe tray. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90533. Same-class #85565 #83600 #89811 #88308. NOT Fusee #90485 / Cinch #90506 / Reveille. openai/codex#28444 (cron silent-fail; heartbeat stays green). openai/codex#37973 is NOT this.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "snug"} is not poison / wipe.`,
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
    slackCotterAlarm(result, env),
    githubCotterLedger(result, env),
    linearPinTicket(result, env),
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
            ? `Posted ${result.verdict} pin alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.COTTER_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Cotter pin ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "cotter-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist cotter ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.COTTER_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.COTTER_LINEAR_TEAM || "";
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
