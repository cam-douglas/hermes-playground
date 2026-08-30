/**
 * Chatelaine sinks. Slack chip +
 * Linear ticket on cut / spilled /
 * switched / nested / rebound /
 * unexpired / tokenless / blanked /
 * wiped. GitHub chatelaine-ledger
 * of scored intakes on every score.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Fob / Visa / Chute /
 * leftover woodworking.
 * A nested ring is not a hold.
 * Score the chain or admit girt.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./chatelaine.mjs";

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

export function slackChatelaineAlarm(result, env = process.env) {
  const webhook = env.CHATELAINE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};
  const copy =
    result.slackCopy ||
    (alarm
      ? `Chatelaine ${result.verdict} · MCP grants left with the wearer · /mcp ×${facts.consecutiveMcpAuths || 0}`
      : `Chatelaine: chain is ${result.verdict || "girt"} on ${result.session || "session"}.`);

  const body = {
    text: copy,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Chatelaine · ${result.verdict} (fail, never a hold)` : `Chatelaine · ${result.verdict}`,
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
            `*nested* ${facts.mcpNestedInAccountItem ? "yes" : "no"}`,
            `*logout* ${facts.accountLogoutFired ? "yes" : "no"}`,
            `*switched* ${facts.accountSwitched ? "yes" : "no"}`,
            `*unauthenticated* ${facts.unauthenticatedAfterEvent ?? "-"} / ${facts.httpMcpServerCount ?? "-"}`,
            `*/mcp auths* ${facts.consecutiveMcpAuths ?? "-"}`,
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
      summary: `Would skip Slack. Chatelaine is ${result.verdict || "girt"}.`,
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
    summary: `Posting ${result.verdict} chain alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubChatelaineLedger(result, env = process.env) {
  const token = env.CHATELAINE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "chatelaine",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    nested: Boolean(facts.mcpNestedInAccountItem),
    logout: Boolean(facts.accountLogoutFired),
    switched: Boolean(facts.accountSwitched),
    unauthenticatedAfterEvent: facts.unauthenticatedAfterEvent ?? 0,
    consecutiveMcpAuths: facts.consecutiveMcpAuths ?? 0,
    girt: Boolean(result.girt),
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
      summary: "Would append a GitHub chatelaine-ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub chatelaine-ledger row.",
    tokenPresent: true,
    line,
  };
}

export function linearChatelaineTicket(result, env = process.env) {
  const key = env.CHATELAINE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `chatelaine ${result.verdict} · Chatelaine · ${result.source || "chain"}`.trim();
  const description = [
    "Chatelaine scored a chain because a nested ring is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `nested: ${result.facts?.mcpNestedInAccountItem ? "yes" : "no"}`,
    `logout: ${result.facts?.accountLogoutFired ? "yes" : "no"}`,
    `switched: ${result.facts?.accountSwitched ? "yes" : "no"}`,
    `unauthenticated: ${result.facts?.unauthenticatedAfterEvent ?? "-"} / ${result.facts?.httpMcpServerCount ?? "-"}`,
    `/mcp auths: ${result.facts?.consecutiveMcpAuths ?? "-"}`,
    "",
    loss
      ? "cut / spilled / switched / nested / rebound / unexpired / tokenless / blanked / wiped: identity logout burned still-valid MCP grants, or a nearby Keychain wipe/stub did."
      : "Not a nested-ring alarm. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90647. Same-class nearby: #88487 #87405 #84331 #84274 #84614 #89671. Related, different: #90527 Fob #90497 Visa. Cross-ecosystem: openai/codex#27165 #38198 #28201. NOT Fob / Visa / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "girt"} is not a nested-ring alarm.`,
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
    slackChatelaineAlarm(result, env),
    githubChatelaineLedger(result, env),
    linearChatelaineTicket(result, env),
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
            ? `Posted ${result.verdict} chain alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CHATELAINE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Chatelaine chain ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "chatelaine-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist chatelaine ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CHATELAINE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CHATELAINE_LINEAR_TEAM || "";
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
