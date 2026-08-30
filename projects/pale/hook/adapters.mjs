/**
 * Pale sinks. Slack chip + Linear
 * ticket on beyond / unhooked /
 * rootless / silent / above /
 * subdir / walkless / fail-open.
 * GitHub pale-ledger of scored
 * intakes on every score. Missing
 * secrets stay honest: a demo row,
 * never a fake live 200.
 *
 * This is NOT Chatelaine / Waif /
 * Berth / leftover woodworking.
 * A session beyond the pale is
 * not a hold. Score the fence or
 * admit bound.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./pale.mjs";

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

export function slackPaleAlarm(result, env = process.env) {
  const webhook = env.PALE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const facts = result.facts || {};
  const copy =
    result.slackCopy ||
    (alarm
      ? `Pale ${result.verdict} · hooks silently absent · fence never walked up`
      : `Pale: fence is ${result.verdict || "bound"} on ${result.session || "session"}.`);

  const body = {
    text: copy,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Pale · ${result.verdict} (fail, never a hold)` : `Pale · ${result.verdict}`,
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
            `*settings on disk* ${facts.settingsPresentOnDisk ? "yes" : "no"}`,
            `*roots match* ${facts.rootsMatch ? "yes" : "no"}`,
            `*hooks armed* ${facts.hooksRegisteredCount ?? "-"}`,
            `*warning* ${facts.warningEmitted ? "yes" : "no"}`,
            `*above* ${facts.startedAboveRepo ? "yes" : "no"}`,
            `*subdir* ${facts.startedInSubdir ? "yes" : "no"}`,
            `*walk-up* ${facts.walkUpAttempted ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Pale is ${result.verdict || "bound"}.`,
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
    summary: `Posting ${result.verdict} fence alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubPaleLedger(result, env = process.env) {
  const token = env.PALE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const facts = result.facts || {};
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "pale",
    session: result.session,
    verdict: result.verdict,
    eventClass: result.eventClass || "",
    settingsPresentOnDisk: Boolean(facts.settingsPresentOnDisk),
    rootsMatch: Boolean(facts.rootsMatch),
    hooksRegisteredCount: facts.hooksRegisteredCount ?? 0,
    warningEmitted: Boolean(facts.warningEmitted),
    startedAboveRepo: Boolean(facts.startedAboveRepo),
    startedInSubdir: Boolean(facts.startedInSubdir),
    walkUpAttempted: Boolean(facts.walkUpAttempted),
    toolProceededUnhooked: Boolean(facts.toolProceededUnhooked),
    bound: Boolean(result.bound),
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
      summary: "Would append a GitHub pale-ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub pale-ledger row.",
    tokenPresent: true,
    line,
  };
}

export function linearPaleTicket(result, env = process.env) {
  const key = env.PALE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `pale ${result.verdict} · Pale · ${result.source || "fence"}`.trim();
  const description = [
    "Pale scored a fence because a session beyond the pale is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `event class: ${result.eventClass || "-"}`,
    `settings on disk: ${result.facts?.settingsPresentOnDisk ? "yes" : "no"}`,
    `roots match: ${result.facts?.rootsMatch ? "yes" : "no"}`,
    `hooks armed: ${result.facts?.hooksRegisteredCount ?? "-"}`,
    `warning: ${result.facts?.warningEmitted ? "yes" : "no"}`,
    `above: ${result.facts?.startedAboveRepo ? "yes" : "no"}`,
    `subdir: ${result.facts?.startedInSubdir ? "yes" : "no"}`,
    "",
    loss
      ? "beyond / unhooked / rootless / silent / above / subdir / walkless / fail-open: project hooks were silently absent when the session project root was not the settings-bearing directory."
      : "Not a pale-fence alarm. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90683. Same-class nearby: #76441 #79111 #86187 #79480 #89215 #78505 #88871. Related, different: #90647 Chatelaine #90672 Waif #90668 Berth #90661 Carrel #90662 Byline #90638 Fascia. Cross-ecosystem: openai/codex#28903 #30789 #38065. NOT Chatelaine / Waif / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "bound"} is not a pale-fence alarm.`,
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
    slackPaleAlarm(result, env),
    githubPaleLedger(result, env),
    linearPaleTicket(result, env),
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
            ? `Posted ${result.verdict} fence alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.PALE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Pale fence ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "pale-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist pale ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.PALE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.PALE_LINEAR_TEAM || "";
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
