/**
 * Fascia sinks. Slack alarm on
 * misnamed / diverted / approved-blind /
 * trust-lie / worktree-elsewhere.
 * GitHub fascia-ledger of scored
 * probes on every score. Linear
 * ticket on misnamed / trust-lie.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Wicket / Snib / Iota /
 * Damper / Hasp / Cubby / Quoin /
 * Gaff / Sear / leftover woodworking.
 * A misnamed fascia is not a hold.
 * Score the shopfront or admit fronted.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./fascia.mjs";

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

export function slackFasciaAlarm(result, env = process.env) {
  const webhook = env.FASCIA_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Fascia ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Fascia: shopfront is ${result.verdict || "fronted"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Fascia · ${result.verdict} shopfront alarm` : `Fascia · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*dialog* ${result.dialogNamedPath || "-"}`,
            `*actual* ${result.actualRunPath || "-"}`,
            `*spawn cwd* ${result.spawnTaskCwd || "-"}`,
            `*button* ${result.button || "-"}`,
            `*config* ${result.configDir || "-"}`,
            `*trust active* ${result.trustPresentInActiveConfig ? "yes" : "no"}`,
            `*trust other* ${result.trustPresentInOtherAccount ? "yes" : "no"}`,
            `*approved* ${result.approved ? "yes" : "no"}`,
            `*named never ran* ${result.namedPathNeverRan ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Fascia is ${result.verdict || "fronted"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} shopfront alarm on the fascia.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} shopfront alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubFasciaLedger(result, env = process.env) {
  const token = env.FASCIA_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "fascia",
    session: result.session,
    verdict: result.verdict,
    dialogNamedPath: result.dialogNamedPath || "",
    actualRunPath: result.actualRunPath || "",
    spawnTaskCwd: result.spawnTaskCwd || "",
    button: result.button || "",
    configDir: result.configDir || "",
    trustPresentInActiveConfig: Boolean(result.trustPresentInActiveConfig),
    trustPresentInOtherAccount: Boolean(result.trustPresentInOtherAccount),
    approved: Boolean(result.approved),
    namedPathNeverRan: Boolean(result.namedPathNeverRan),
    fronted: Boolean(result.fronted),
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
      summary: "Would open a GitHub fascia-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub fascia-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearFasciaTicket(result, env = process.env) {
  const key = env.FASCIA_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `fascia ${result.verdict} · Fascia · ${result.source || "shopfront"}`.trim();
  const description = [
    "Fascia scored a shopfront because a misnamed fascia is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `dialog: ${result.dialogNamedPath || "-"}`,
    `actual: ${result.actualRunPath || "-"}`,
    `spawn cwd: ${result.spawnTaskCwd || "-"}`,
    `button: ${result.button || "-"}`,
    `trust active: ${result.trustPresentInActiveConfig ? "yes" : "no"}`,
    `trust other: ${result.trustPresentInOtherAccount ? "yes" : "no"}`,
    "",
    loss
      ? "Misnamed or trust-lie: the trust dialog named spawn_task cwd while the session ran in a different .claude/worktrees path, or a trust entry was written for a directory no session used."
      : "Not a misnamed / trust-lie shopfront. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90638. Related (not identical) #54628 #87325 #67319 #90041 #74794. NOT Wicket #74726 #81333 #86584 #85448. NOT Snib / Iota / Damper / Hasp / Cubby / Quoin / Gaff / leftover woodworking. openai/codex#16525.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "fronted"} is not misnamed / trust-lie.`,
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
    slackFasciaAlarm(result, env),
    githubFasciaLedger(result, env),
    linearFasciaTicket(result, env),
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
            ? `Posted ${result.verdict} shopfront alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.FASCIA_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Fascia shopfront ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "fascia-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist fascia ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.FASCIA_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.FASCIA_LINEAR_TEAM || "";
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
