/**
 * Lacuna sinks. Slack chip + Linear
 * ticket on scraped / gapped /
 * watermarked / resumed-past /
 * vanished / counterfeit-empty /
 * skipped / delayed-wipe when this
 * bug (not a labeled contrast).
 * GitHub lacuna-ledger of scored
 * intakes on every score.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Ambo / Slype / Tally
 * / Pale / Chatelaine / Byline /
 * Cubby / Ullage / Veto / Husk /
 * Quoin / leftover woodworking.
 * A watermark is not a gathering.
 * Score the desk or admit collated.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./lacuna.mjs";

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return Boolean(result.slack ?? (SLACK_VERDICTS.includes(verdict) && !result.offLacuna));
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return Boolean(result.linear ?? (LINEAR_VERDICTS.includes(verdict) && !result.offLacuna));
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackLacunaAlarm(result, env = process.env) {
  const webhook = env.LACUNA_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};
  const copy =
    result.slackCopy ||
    (alarm
      ? `Lacuna ${result.verdict} · hwm ${facts.highwatermark ?? "-"} · TaskList ${facts.taskList || "empty"}`
      : `Lacuna: desk is ${result.verdict || "collated"} on ${result.session || "session"}.`);

  const body = {
    text: copy,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Lacuna · ${result.verdict} (fail, never a hold)` : `Lacuna · ${result.verdict}`,
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
            `*files* ${(facts.files || []).join(",") || "none"}`,
            `*highwatermark* ${facts.highwatermark == null ? "absent" : facts.highwatermark}`,
            `*TaskList* ${facts.taskList || "-"}`,
            `*next create* ${facts.nextCreateId == null ? "-" : facts.nextCreateId}`,
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
      summary: `Would skip Slack. Lacuna is ${result.verdict || "collated"}.`,
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
    summary: `Posting ${result.verdict} desk alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubLacunaLedger(result, env = process.env) {
  const token = env.LACUNA_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "lacuna",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    files: facts.files || [],
    highwatermark: facts.highwatermark,
    taskList: facts.taskList || "",
    nextCreateId: facts.nextCreateId,
    collated: Boolean(result.collated),
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
      summary: "Would append a GitHub lacuna-ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub lacuna-ledger row.",
    tokenPresent: true,
    line,
  };
}

export function linearLacunaTicket(result, env = process.env) {
  const key = env.LACUNA_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `lacuna ${result.verdict} · Lacuna · ${result.source || "desk"}`.trim();
  const description = [
    "Lacuna scored a desk because a watermark is not a gathering.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `files: ${(result.facts?.files || []).join(",") || "none"}`,
    `highwatermark: ${result.facts?.highwatermark == null ? "absent" : result.facts.highwatermark}`,
    `TaskList: ${result.facts?.taskList || "-"}`,
    `next create: ${result.facts?.nextCreateId == null ? "-" : result.facts.nextCreateId}`,
    "",
    loss
      ? "scraped / gapped / watermarked / resumed-past / vanished / counterfeit-empty / skipped / delayed-wipe: task store silently cleared mid-session; new ids resume past the gap."
      : "Not a lacuna-desk alarm. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90709. Same-class: #88346. Contrast (not this): #84284. Cross-ecosystem: openai/codex#32697 #40674 #35784. NOT Ambo / Slype / Tally / Pale / Chatelaine / Byline / Cubby / Ullage / Veto / Husk / Quoin.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "collated"} is not a lacuna-desk alarm.`,
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
    slackLacunaAlarm(result, env),
    githubLacunaLedger(result, env),
    linearLacunaTicket(result, env),
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
            ? `Posted ${result.verdict} desk alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.LACUNA_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Lacuna desk ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "lacuna-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist lacuna ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.LACUNA_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.LACUNA_LINEAR_TEAM || "";
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
