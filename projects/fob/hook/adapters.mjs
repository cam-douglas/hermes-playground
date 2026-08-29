/**
 * Fob sinks. Slack alarm on minted / hoard / split / false-cut /
 * scope-key. GitHub fob-ledger of scored racks on every score.
 * Linear ticket on minted / hoard / split. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Visa / Snib / Chute / Wraith / Iota / Ordo / Cinch /
 * Ullage. A new login is not a hold. Score the rack or admit hung.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./fob.mjs";

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

export function slackFobAlarm(result, env = process.env) {
  const webhook =
    env.FOB_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const expired = result.loginExpired
    ? "Login expired · Please run /login"
    : "";

  const text = alarm
    ? `Fob ${String(result.verdict || "").toUpperCase()} · ${headline(result)}${expired ? ` · ${expired}` : ""}`
    : `Fob: rack is ${result.verdict || "hung"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Fob · ${result.verdict} rack alarm` : `Fob · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*items* ${result.itemCount ?? 0}`,
            `*live* ${result.liveService || "—"}`,
            `*loginExpired* ${result.loginExpired ? "yes · fail" : "no"}`,
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
      summary: `Would skip Slack. Rack is ${result.verdict || "hung"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} rack alarm on the key board.`,
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

export function githubFobLedger(result, env = process.env) {
  const token = env.FOB_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "fob",
    session: result.session,
    verdict: result.verdict,
    itemCount: result.itemCount ?? 0,
    liveService: result.liveService || "",
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    loginExpired: Boolean(result.loginExpired),
    storesSplit: Boolean(result.storesSplit),
    scopesDiverge: Boolean(result.scopesDiverge),
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub fob-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub fob-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearRackTicket(result, env = process.env) {
  const key = env.FOB_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `rack ${result.verdict} · Fob · ${result.source || "desk"}`.trim();
  const description = [
    "Fob scored a rack because a new login is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `items: ${result.itemCount ?? 0}`,
    `live: ${result.liveService || "—"}`,
    `loginExpired: ${result.loginExpired ? "yes" : "no"}`,
    "",
    loss
      ? "Minted, hoard, or split: the live fob was not reused, or the stores diverged."
      : "Not a minted / hoard / split rack. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90527. Same-class #84275. Shape: #78020 #89801 #79407 #83345. openai/codex#33540 #38691 #24204.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "hung"} is not minted / hoard / split.`,
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
    slackFobAlarm(result, env),
    githubFobLedger(result, env),
    linearRackTicket(result, env),
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
        const token = env.FOB_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Fob rack ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "fob-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist fob ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.FOB_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.FOB_LINEAR_TEAM || "";
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
