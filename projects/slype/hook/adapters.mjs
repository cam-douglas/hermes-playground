/**
 * Slype sinks. Slack chip + Linear
 * ticket on 126 / programfiles-denied
 * / sandbox / pwsh-dead /
 * path-blocked / allowlist-miss /
 * system32-ok / powershell-ok.
 * GitHub slype-ledger of scored
 * intakes on every score. Missing
 * secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Tally / Pale /
 * Chatelaine / Waif / Cotter /
 * leftover woodworking. A garrison
 * on the roster is not a visiting
 * friar. Score the passage or
 * admit passed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./slype.mjs";

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

export function slackSlypeAlarm(result, env = process.env) {
  const webhook = env.SLYPE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};
  const copy =
    result.slackCopy ||
    (alarm
      ? `Slype ${result.verdict} · pwsh ${facts.pwshExit ?? "—"} · powershell ${facts.powershellExit ?? "—"} · sandbox session`
      : `Slype: passage is ${result.verdict || "passed"} on ${result.session || "session"}.`);

  const body = {
    text: copy,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Slype · ${result.verdict} (fail, never a hold)` : `Slype · ${result.verdict}`,
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
            `*pwsh path* ${facts.pwshPath || "-"}`,
            `*powershell path* ${facts.powershellPath || "-"}`,
            `*pwsh exit* ${facts.pwshExit ?? "-"}`,
            `*powershell exit* ${facts.powershellExit ?? "-"}`,
            `*sandbox* ${facts.sandbox ? "yes" : "no"}`,
            `*outside ok* ${facts.outsideOk ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Slype is ${result.verdict || "passed"}.`,
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
    summary: `Posting ${result.verdict} passage alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSlypeLedger(result, env = process.env) {
  const token = env.SLYPE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "slype",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    pwshPath: facts.pwshPath || "",
    powershellPath: facts.powershellPath || "",
    pwshExit: facts.pwshExit ?? null,
    powershellExit: facts.powershellExit ?? null,
    sandbox: Boolean(facts.sandbox),
    outsideOk: Boolean(facts.outsideOk),
    passed: Boolean(result.passed),
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
      summary: "Would append a GitHub slype-ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub slype-ledger row.",
    tokenPresent: true,
    line,
  };
}

export function linearSlypeTicket(result, env = process.env) {
  const key = env.SLYPE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `slype ${result.verdict} · Slype · ${result.source || "passage"}`.trim();
  const description = [
    "Slype scored a passage because a garrison on the roster is not a visiting friar.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `pwsh path: ${result.facts?.pwshPath || "-"}`,
    `powershell path: ${result.facts?.powershellPath || "-"}`,
    `pwsh exit: ${result.facts?.pwshExit ?? "-"}`,
    `powershell exit: ${result.facts?.powershellExit ?? "-"}`,
    `sandbox: ${result.facts?.sandbox ? "yes" : "no"}`,
    `outside ok: ${result.facts?.outsideOk ? "yes" : "no"}`,
    "",
    loss
      ? "126 / programfiles-denied / sandbox / pwsh-dead / path-blocked / allowlist-miss / system32-ok / powershell-ok: the sandbox allow-lists System32 powershell.exe and 126-denies Program Files pwsh.exe."
      : "Not a slype-passage alarm. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90676. Contrast (not this): #90077 #89884 #85475 #78596 #77470 #86551. Cross-ecosystem: openai/codex#38222 #35871 #37592. NOT Calque / Sear / Clew / Grille / Waif / Pale / Chatelaine / Tally / Cotter.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "passed"} is not a slype-passage alarm.`,
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
    slackSlypeAlarm(result, env),
    githubSlypeLedger(result, env),
    linearSlypeTicket(result, env),
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
            ? `Posted ${result.verdict} passage alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SLYPE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Slype passage ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "slype-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist slype ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SLYPE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SLYPE_LINEAR_TEAM || "";
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
