/**
 * Sear sinks. Slack alarm on inert /
 * survived / nonfinal / phantom-ok /
 * continued / wiped / suppressed.
 * GitHub sear-ledger of scored probes
 * on every score. Linear ticket on
 * wiped / phantom-ok / inert. Missing
 * secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Spile / Grille / Scant /
 * Sounder / Leat / Clew / Cubby /
 * Bollard / leftover woodworking. A
 * fallen sear is not a hold. Score
 * the bench or admit caught.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./sear.mjs";

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

export function slackSearAlarm(result, env = process.env) {
  const webhook = env.SEAR_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Sear ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Sear: bench is ${result.verdict || "caught"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Sear · ${result.verdict} bench alarm` : `Sear · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*set -e* ${result.setEPresent ? "yes" : "no"}`,
            `*eval non-final &&* ${result.wrapperEvalNonFinalAnd ? "yes" : "no"}`,
            `*survived echo* ${result.falseThenEchoSurvived ? "yes" : "no"}`,
            `*phantom-ok* ${result.toolExitZeroDespiteMidFail ? "yes" : "no"}`,
            `*continued* ${result.continuedPastFail ? "yes" : "no"}`,
            `*wipe after cp* ${result.wipeAfterFailedCopy ? "yes" : "no"}`,
            `*chained workaround* ${result.chainedWorkaround ? "yes" : "no"}`,
            `*bash -ec* ${result.freshBashEc ? "yes" : "no"}`,
            `*subshell survived* ${result.subshellAlsoSurvived ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Sear is ${result.verdict || "caught"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} bench alarm on the sear.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} bench alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSearLedger(result, env = process.env) {
  const token = env.SEAR_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "sear",
    session: result.session,
    verdict: result.verdict,
    setEPresent: Boolean(result.setEPresent),
    wrapperEvalNonFinalAnd: Boolean(result.wrapperEvalNonFinalAnd),
    falseThenEchoSurvived: Boolean(result.falseThenEchoSurvived),
    toolExitZeroDespiteMidFail: Boolean(result.toolExitZeroDespiteMidFail),
    continuedPastFail: Boolean(result.continuedPastFail),
    wipeAfterFailedCopy: Boolean(result.wipeAfterFailedCopy),
    chainedWorkaround: Boolean(result.chainedWorkaround),
    freshBashEc: Boolean(result.freshBashEc),
    subshellAlsoSurvived: Boolean(result.subshellAlsoSurvived),
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
      summary: "Would open a GitHub sear-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub sear-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearSearTicket(result, env = process.env) {
  const key = env.SEAR_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `sear ${result.verdict} · Sear · ${result.source || "bench"}`.trim();
  const description = [
    "Sear scored a bench because a fallen sear is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `set -e: ${result.setEPresent ? "yes" : "no"}`,
    `eval non-final &&: ${result.wrapperEvalNonFinalAnd ? "yes" : "no"}`,
    `survived echo: ${result.falseThenEchoSurvived ? "yes" : "no"}`,
    `phantom-ok: ${result.toolExitZeroDespiteMidFail ? "yes" : "no"}`,
    `continued: ${result.continuedPastFail ? "yes" : "no"}`,
    `wipe after cp: ${result.wipeAfterFailedCopy ? "yes" : "no"}`,
    `bash -ec: ${result.freshBashEc ? "yes" : "no"}`,
    "",
    loss
      ? "Wiped, phantom-ok, or inert: set -e was structurally suppressed. A mid-script failure was invisible, or destructive cleanup ran after an earlier fail."
      : "Not a wiped / phantom-ok / inert bench. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90611. Nearby #90118 (Bash result channel lies/drops) #62297 (exit 144 misreported). NOT Spile / Grille / Scant / Sounder / Leat / Clew / Cubby / Bollard / leftover woodworking. openai/codex#34866 #41534.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "caught"} is not wiped / phantom-ok / inert.`,
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
    slackSearAlarm(result, env),
    githubSearLedger(result, env),
    linearSearTicket(result, env),
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
            ? `Posted ${result.verdict} bench alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SEAR_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Sear bench ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "sear-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist sear ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SEAR_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SEAR_LINEAR_TEAM || "";
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
