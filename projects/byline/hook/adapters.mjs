/**
 * Byline sinks. Slack alarm on
 * ghosted / split / borrowed /
 * unstopped (and stray / hanging /
 * nest-split / resume-split).
 * GitHub byline-ledger of scored
 * racks on every score. Linear
 * ticket on ghosted / split /
 * borrowed.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Shunt / Cote / Nixie /
 * Tappet / Sounder / Fascia /
 * Wicket / Datum / Calque / Quoin /
 * Gaff / leftover woodworking.
 * A ghost byline is not a hold.
 * Score the rack or admit credited.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./byline.mjs";

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

export function slackBylineAlarm(result, env = process.env) {
  const webhook = env.BYLINE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Byline ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Byline: rack is ${result.verdict || "credited"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Byline · ${result.verdict} rack alarm` : `Byline · ${result.verdict}`,
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
            `*hired* ${(result.hired || []).join(", ") || "-"}`,
            `*ghosts* ${(result.ghosts || []).join(", ") || "-"}`,
            `*stop-side* ${result.stopSideNearby ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Byline is ${result.verdict || "credited"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} rack alarm on the byline.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} rack alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubBylineLedger(result, env = process.env) {
  const token = env.BYLINE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "byline",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    hired: result.hired || [],
    ghosts: result.ghosts || [],
    credited: Boolean(result.credited),
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
      summary: "Would open a GitHub byline-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub byline-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearBylineTicket(result, env = process.env) {
  const key = env.BYLINE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `byline ${result.verdict} · Byline · ${result.source || "rack"}`.trim();
  const description = [
    "Byline scored a rack because a ghost byline is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `hired: ${(result.hired || []).join(", ") || "-"}`,
    `ghosts: ${(result.ghosts || []).join(", ") || "-"}`,
    "",
    loss
      ? "Ghosted, split, or borrowed: PreToolUse/PostToolUse landed on an id that was never hired, or consecutive copy split across two bylines, or a ghost later collected another reporter's copy."
      : "Not a ghosted / split / borrowed rack. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90662. Stop-side nearby (different event class): #89555 #87065 #59719 #88995. Cross-ecosystem: openai/codex#16226 #38142 #40802. NOT Shunt / Cote / Nixie / Tappet / Sounder / Fascia / Wicket / Datum / Calque / Quoin / Gaff / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "credited"} is not ghosted / split / borrowed.`,
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
    slackBylineAlarm(result, env),
    githubBylineLedger(result, env),
    linearBylineTicket(result, env),
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
            ? `Posted ${result.verdict} rack alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.BYLINE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Byline rack ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "byline-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist byline ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.BYLINE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.BYLINE_LINEAR_TEAM || "";
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
