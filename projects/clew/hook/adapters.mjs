/**
 * Clew sinks. Slack alarm on fouled / overcoiled /
 * choked / jammed / swollen / cached / globbed.
 * GitHub clew-ledger of scored coils on every score.
 * Linear ticket on fouled / choked / jammed. Missing
 * secrets stay honest: a demo row, never a fake live
 * 200.
 *
 * This is NOT Wicket / Scant / Sump / Cinch / Hasp /
 * Sounder. A working-size coil is not a hold.
 * Score the clew or admit rove.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./clew.mjs";

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

export function slackClewAlarm(result, env = process.env) {
  const webhook = env.CLEW_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Clew ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Clew: coil is ${result.verdict || "rove"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Clew · ${result.verdict} coil alarm` : `Clew · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*worktrees* ${result.worktreeCount ?? 0}`,
            `*worktree denies* ${result.worktreeDenyCount ?? 0}`,
            `*total denies* ${result.totalDenyCount ?? 0}`,
            `*largest arg* ${result.largestArgBytes ?? 0}B`,
            `*MAX_ARG_STRLEN* ${result.maxArgStrlen ?? 131072}B`,
            `*e2big* ${result.e2big ? "yes" : "no"}`,
            `*sleep failed* ${result.sleepFailed ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Clew is ${result.verdict || "rove"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} coil alarm on the clew.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} coil alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubClewLedger(result, env = process.env) {
  const token = env.CLEW_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "clew",
    session: result.session,
    verdict: result.verdict,
    worktreeCount: result.worktreeCount ?? 0,
    worktreeDenyCount: result.worktreeDenyCount ?? 0,
    baselineDenyCount: result.baselineDenyCount ?? 0,
    totalDenyCount: result.totalDenyCount ?? 0,
    largestArgBytes: result.largestArgBytes ?? 0,
    maxArgStrlen: result.maxArgStrlen ?? 131072,
    e2big: Boolean(result.e2big),
    spawnFailed: Boolean(result.spawnFailed),
    sleepFailed: Boolean(result.sleepFailed),
    echoFailed: Boolean(result.echoFailed),
    monitorFailed: Boolean(result.monitorFailed),
    profileCached: Boolean(result.profileCached),
    prunedButNotRestarted: Boolean(result.prunedButNotRestarted),
    globExpandedPerFile: Boolean(result.globExpandedPerFile),
    ancestorExpanded: Boolean(result.ancestorExpanded),
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
      summary: "Would open a GitHub clew-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub clew-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearClewTicket(result, env = process.env) {
  const key = env.CLEW_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `clew ${result.verdict} · Clew · ${result.source || "loft"}`.trim();
  const description = [
    "Clew scored a coil because a working-size coil is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `worktrees: ${result.worktreeCount ?? 0}`,
    `worktree denies: ${result.worktreeDenyCount ?? 0}`,
    `total denies: ${result.totalDenyCount ?? 0}`,
    `largest arg: ${result.largestArgBytes ?? 0}B`,
    `MAX_ARG_STRLEN: ${result.maxArgStrlen ?? 131072}B`,
    `e2big: ${result.e2big ? "yes" : "no"}`,
    `sleep failed: ${result.sleepFailed ? "yes" : "no"}`,
    "",
    loss
      ? "Fouled, choked, or jammed: the single bwrap argv crossed MAX_ARG_STRLEN and Bash spawn is dead."
      : "Not a fouled / choked / jammed clew. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90569. Same-class #73468 #73437 #82840 #74081 #82173 #78253 #51126 #46461 #74032. NOT Wicket / Scant / Sump / Cinch / Hasp / Sounder / leftover woodworking. openai/codex#33479 #37632 #34878 (same-class ARG_MAX / E2BIG).",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "rove"} is not fouled / choked / jammed.`,
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
    slackClewAlarm(result, env),
    githubClewLedger(result, env),
    linearClewTicket(result, env),
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
            ? `Posted ${result.verdict} coil alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CLEW_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Clew coil ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "clew-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist clew ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CLEW_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CLEW_LINEAR_TEAM || "";
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
