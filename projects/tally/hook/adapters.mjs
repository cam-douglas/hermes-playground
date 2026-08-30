/**
 * Tally sinks. Slack chip + Linear
 * ticket on false-loss / remount-grew
 * / merged-still-n / push-blind /
 * origin-zero / base-frozen /
 * chalked / birth-counted. GitHub
 * tally-ledger of scored intakes
 * on every score. Missing secrets
 * stay honest: a demo row, never a
 * fake live 200.
 *
 * This is NOT Wicket / Fascia /
 * Berth / Pale / leftover
 * woodworking. A birth-counted
 * tally is not a hold. Score the
 * board or admit squared.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./tally.mjs";

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

export function slackTallyAlarm(result, env = process.env) {
  const webhook = env.TALLY_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};
  const copy =
    result.slackCopy ||
    (alarm
      ? `Tally ${result.verdict} · birth ${facts.birthCount ?? "N"} · origin ${facts.originCount ?? "—"} · claims will be lost`
      : `Tally: board is ${result.verdict || "squared"} on ${result.session || "session"}.`);

  const body = {
    text: copy,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Tally · ${result.verdict} (fail, never a hold)` : `Tally · ${result.verdict}`,
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
            `*birth count* ${facts.birthCount ?? "-"}`,
            `*origin count* ${facts.originCount ?? "-"}`,
            `*dialog claims loss* ${facts.dialogClaimsLoss ? "yes" : "no"}`,
            `*pushed* ${facts.pushed ? "yes" : "no"}`,
            `*merged* ${facts.merged ? "yes" : "no"}`,
            `*remount grew* ${facts.remountGrew ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Tally is ${result.verdict || "squared"}.`,
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
    summary: `Posting ${result.verdict} board alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubTallyLedger(result, env = process.env) {
  const token = env.TALLY_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "tally",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    birthCount: facts.birthCount ?? 0,
    originCount: facts.originCount ?? 0,
    dialogClaimsLoss: Boolean(facts.dialogClaimsLoss),
    pushed: Boolean(facts.pushed),
    merged: Boolean(facts.merged),
    remountGrew: Boolean(facts.remountGrew),
    squared: Boolean(result.squared),
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
      summary: "Would append a GitHub tally-ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub tally-ledger row.",
    tokenPresent: true,
    line,
  };
}

export function linearTallyTicket(result, env = process.env) {
  const key = env.TALLY_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `tally ${result.verdict} · Tally · ${result.source || "board"}`.trim();
  const description = [
    "Tally scored a board because a birth-counted tally is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `birth count: ${result.facts?.birthCount ?? "-"}`,
    `origin count: ${result.facts?.originCount ?? "-"}`,
    `dialog claims loss: ${result.facts?.dialogClaimsLoss ? "yes" : "no"}`,
    `pushed: ${result.facts?.pushed ? "yes" : "no"}`,
    `merged: ${result.facts?.merged ? "yes" : "no"}`,
    `remount grew: ${result.facts?.remountGrew ? "yes" : "no"}`,
    "",
    loss
      ? "false-loss / remount-grew / merged-still-n / push-blind / origin-zero / base-frozen / chalked / birth-counted: the /exit dialog counted commits since worktree birth, not unmerged work."
      : "Not a tally-board alarm. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90692. Contrast (not this): #84856 #78355 #40137 #71135 squash-ancestry ExitWorktree tool. Cross-ecosystem: openai/codex#35383 #34352. NOT Wicket / Fascia / Berth / Pale.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "squared"} is not a tally-board alarm.`,
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
    slackTallyAlarm(result, env),
    githubTallyLedger(result, env),
    linearTallyTicket(result, env),
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
            ? `Posted ${result.verdict} board alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.TALLY_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Tally board ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "tally-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist tally ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.TALLY_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.TALLY_LINEAR_TEAM || "";
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
