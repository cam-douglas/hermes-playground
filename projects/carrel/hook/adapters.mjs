/**
 * Carrel sinks. Slack alarm on
 * borrowed / misfiled / contended /
 * overwritten / sibling-served /
 * lane-blind / nested-miss /
 * main-spawn.
 * GitHub carrel-ledger of scored
 * rooms on every score. Linear
 * ticket on borrowed / misfiled /
 * sibling-served / contended.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Wicket / Fascia /
 * Hasp / Iota / Cinch / Cubby /
 * Byline / Datum / leftover
 * woodworking.
 * A borrowed carrel is not a hold.
 * Score the reading room or admit seated.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./carrel.mjs";

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

export function slackCarrelAlarm(result, env = process.env) {
  const webhook = env.CARREL_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};

  const text = alarm
    ? `Carrel ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Carrel: reading room is ${result.verdict || "seated"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Carrel · ${result.verdict} room alarm` : `Carrel · ${result.verdict}`,
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
            `*session cwd* \`${facts.sessionCwd || "-"}\``,
            `*caller cwd* \`${facts.callerCwd || "-"}\``,
            `*launch.json used* \`${facts.launchJsonPathUsed || "-"}\``,
            `*requested name* ${facts.requestedName || "-"}`,
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
      summary: `Would skip Slack. Carrel is ${result.verdict || "seated"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} reading-room alarm.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} reading-room alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCarrelLedger(result, env = process.env) {
  const token = env.CARREL_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "carrel",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    sessionCwd: facts.sessionCwd || "",
    callerCwd: facts.callerCwd || "",
    launchJsonPathUsed: facts.launchJsonPathUsed || "",
    requestedName: facts.requestedName || "",
    seated: Boolean(result.seated),
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
      summary: "Would open a GitHub carrel-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub carrel-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearCarrelTicket(result, env = process.env) {
  const key = env.CARREL_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `carrel ${result.verdict} · Carrel · ${result.source || "reading-room"}`.trim();
  const description = [
    "Carrel scored a reading room because a borrowed carrel is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `session cwd: ${result.facts?.sessionCwd || "-"}`,
    `caller cwd: ${result.facts?.callerCwd || "-"}`,
    `launch.json used: ${result.facts?.launchJsonPathUsed || "-"}`,
    `requested name: ${result.facts?.requestedName || "-"}`,
    "",
    loss
      ? "Borrowed, misfiled, sibling-served, or contended: preview_start discovered the session catalog instead of the calling agent's, or lanes raced one shared file."
      : "Not a borrowed / misfiled / sibling-served / contended room. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90661. Same-class nearby: #63008 #76496. Related, different: #86039 #85319. Cross-ecosystem: openai/codex#18969 #23095 #30570. Downstream: narduk-enterprises/agent-infrastructure#845. NOT Wicket / Fascia / Hasp / Iota / Cinch / Cubby / Byline / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "seated"} is not borrowed / misfiled / sibling-served / contended.`,
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
    slackCarrelAlarm(result, env),
    githubCarrelLedger(result, env),
    linearCarrelTicket(result, env),
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
            ? `Posted ${result.verdict} reading-room alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CARREL_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Carrel reading-room ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "carrel-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist carrel ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CARREL_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CARREL_LINEAR_TEAM || "";
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
