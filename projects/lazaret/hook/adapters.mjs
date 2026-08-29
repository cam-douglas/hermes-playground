/**
 * Lazaret sinks. Slack lazaret alarm on refused / lost / stranded /
 * cordoned / yellow / false / timed, GitHub lazaret-ledger of
 * bill events on every scored probe, Linear ticket on refused /
 * lost / stranded / false. Missing secrets stay honest: a demo
 * row, never a fake live 200.
 *
 * This is NOT Fusee (early schedule). NOT Iota (path-key identity).
 * NOT Leat (until-loop). NOT Knock (permission grant). NOT Scrim
 * (DLP redaction). Safety-reminder false positive: a written
 * reminder is not a hold.
 */

const ledger = [];

function headline(result) {
  const session = result.session || "session";
  const issue = result.issue != null ? `#${result.issue}` : "";
  return `${session} · ${result.verdict}${issue ? ` · ${issue}` : ""}`;
}

function isSlackAlarm(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "refused" ||
    verdict === "lost" ||
    verdict === "stranded" ||
    verdict === "cordoned" ||
    verdict === "yellow" ||
    verdict === "false" ||
    verdict === "timed"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "refused" ||
    verdict === "lost" ||
    verdict === "stranded" ||
    verdict === "false"
  );
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackLazaretAlarm(result, env = process.env) {
  const webhook =
    env.LAZARET_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Lazaret ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Lazaret: bill is ${result.verdict || "pratique"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Lazaret · ${result.verdict} bill alarm` : `Lazaret · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*fileKind* ${result.fileKind || result.probe?.fileKind || "none"}`,
            `*reminderFired* ${result.reminderFired ? "yes" : "no"}`,
            `*refused* ${result.probe?.refused ? "yes" : "no"}`,
            `*humanPresent* ${result.humanPresent ? "yes" : "no"}`,
            `*confirmationRequested* ${result.confirmationRequested ? "yes" : "no"}`,
            `*confirmationReceived* ${result.confirmationReceived ? "yes" : "no"}`,
            `*timedOut* ${result.timedOut ? "yes" : "no"}`,
            `*workDone* ${result.workDone ? "yes" : "no"}`,
            `*budgetMs* ${result.budgetMs ?? 0}`,
            `*stalledMs* ${result.stalledMs ?? 0}`,
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
      summary: `Would skip Slack. Bill is ${result.verdict || "pratique"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} lazaret alarm on the false cordon.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} lazaret alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubLazaretLedger(result, env = process.env) {
  const token = env.LAZARET_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "lazaret",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    reminderFired: result.reminderFired,
    fileKind: result.fileKind,
    refused: result.probe?.refused,
    humanPresent: result.humanPresent,
    confirmationRequested: result.confirmationRequested,
    confirmationReceived: result.confirmationReceived,
    budgetMs: result.budgetMs,
    stalledMs: result.stalledMs,
    timedOut: result.timedOut,
    workDone: result.workDone,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub lazaret-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub lazaret-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearLazaretTicket(result, env = process.env) {
  const key = env.LAZARET_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `bill ${result.verdict} · Lazaret · ${result.source || "quay"}`.trim();
  const description = [
    "Lazaret refused a bill because a written reminder is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "lost"
      ? "Unattended cloud seat refused a legitimate module, asked for confirm, 15-minute budget died, no files written. Nobody was in the session to grant pratique."
      : result.verdict === "refused"
        ? "Interactive subagent refused a legitimate module per the system reminder."
        : result.verdict === "stranded"
          ? "Confirmation asked, nobody in the session."
          : result.verdict === "false"
            ? "Classified false-positive. The reminder fired on a legitimate file."
            : "Bill named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90326. Shape: #52272 #49363 #47027 #49484 #50760.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Bill is ${result.verdict || "pratique"}.`,
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
    slackLazaretAlarm(result, env),
    githubLazaretLedger(result, env),
    linearLazaretTicket(result, env),
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
            ? `Posted ${result.verdict} lazaret alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.LAZARET_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Lazaret bill ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "lazaret-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist lazaret ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.LAZARET_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.LAZARET_LINEAR_TEAM || "";
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
