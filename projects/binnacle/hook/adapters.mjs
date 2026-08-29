/**
 * Binnacle sinks. Slack alarm on swung / refused / fatal /
 * split / blind / boxed / demanded / stripped. GitHub
 * binnacle-ledger of scored headings on every score.
 * Linear ticket on refused / swung. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Visa / Husk / Sprag / Reed / Gasket / Tain.
 * A named heading is not a hold. Score the binnacle or
 * admit housed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./binnacle.mjs";

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

export function slackBinnacleAlarm(result, env = process.env) {
  const webhook =
    env.BINNACLE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Binnacle ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Binnacle: heading is ${result.verdict || "housed"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Binnacle · ${result.verdict} heading alarm` : `Binnacle · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*gyro* ${result.baseUrl || "unset"}`,
            `*MAG reachable* ${result.publicOriginReachable ? "yes" : "no"}`,
            `*TUI starts* ${result.interactiveTuiStarts ? "yes" : "no"}`,
            `*-p works* ${result.headlessPrintWorks ? "yes" : "no"}`,
            `*hello → gyro* ${result.helloToBaseUrl ? "yes" : "no"}`,
            `*oauth → MAG* ${result.oauthProfileToPublic ? "yes" : "no"}`,
            `*error names proxy* ${result.errorNamesProxy ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Binnacle is ${result.verdict || "housed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} heading alarm on the binnacle.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} heading alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubBinnacleLedger(result, env = process.env) {
  const token = env.BINNACLE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "binnacle",
    session: result.session,
    verdict: result.verdict,
    baseUrl: result.baseUrl || "",
    publicOriginReachable: Boolean(result.publicOriginReachable),
    interactiveTuiStarts: Boolean(result.interactiveTuiStarts),
    headlessPrintWorks: Boolean(result.headlessPrintWorks),
    helloToBaseUrl: Boolean(result.helloToBaseUrl),
    oauthProfileToPublic: Boolean(result.oauthProfileToPublic),
    errorNamesProxy: Boolean(result.errorNamesProxy),
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
      summary: "Would open a GitHub binnacle-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub binnacle-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearBinnacleTicket(result, env = process.env) {
  const key = env.BINNACLE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `binnacle ${result.verdict} · Binnacle · ${result.source || "chart"}`.trim();
  const description = [
    "Binnacle scored a heading because a named heading is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `gyro: ${result.baseUrl || "unset"}`,
    `TUI starts: ${result.interactiveTuiStarts ? "yes" : "no"}`,
    `-p works: ${result.headlessPrintWorks ? "yes" : "no"}`,
    `MAG reachable: ${result.publicOriginReachable ? "yes" : "no"}`,
    `error names proxy: ${result.errorNamesProxy ? "yes" : "no"}`,
    "",
    loss
      ? "Refused or swung: the interactive TUI still knocks api.anthropic.com after ANTHROPIC_BASE_URL is named, or will not start."
      : "Not a refused / swung binnacle. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90551. Same-class #89211 #88345 #89972 #89973 #88536 (nearby shape only). NOT Visa / Husk / Sprag / Reed / Gasket / Tain / Tocsin / Reveille / Leat / Fusee. openai/codex#36597 (inverse polarity). openai/codex#40435 (connection-refused unnamed custom base).",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "housed"} is not refused / swung.`,
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
    slackBinnacleAlarm(result, env),
    githubBinnacleLedger(result, env),
    linearBinnacleTicket(result, env),
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
            ? `Posted ${result.verdict} heading alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.BINNACLE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Binnacle heading ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "binnacle-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist binnacle ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.BINNACLE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.BINNACLE_LINEAR_TEAM || "";
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
