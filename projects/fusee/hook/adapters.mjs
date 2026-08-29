/**
 * Fusee sinks. Slack fusee alarm on early / sprung / raced /
 * ahead / jumped / premature / voided, GitHub fusee-ledger of
 * dial events on every scored probe, Linear ticket on early /
 * sprung / raced / ahead / premature. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Iota (path-key identity). NOT Leat (until-loop).
 * NOT Shunt (nested SendMessage). Scheduler fire-time: a
 * written cron / fireAt is not a hold.
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
    verdict === "early" ||
    verdict === "sprung" ||
    verdict === "raced" ||
    verdict === "ahead" ||
    verdict === "jumped" ||
    verdict === "premature" ||
    verdict === "voided"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "early" ||
    verdict === "sprung" ||
    verdict === "raced" ||
    verdict === "ahead" ||
    verdict === "premature"
  );
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackFuseeAlarm(result, env = process.env) {
  const webhook =
    env.FUSEE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Fusee ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Fusee: dial is ${result.verdict || "wound"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Fusee · ${result.verdict} dial alarm` : `Fusee · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*kind* ${result.kind || "none"}`,
            `*configuredAt* ${result.configuredAt || "none"}`,
            `*dispatchedAt* ${result.dispatchedAt || "none"}`,
            `*earlyByMs* ${result.earlyByMs ?? 0}`,
            `*cron* ${result.cronExpression || "none"}`,
            `*fireAt* ${result.fireAt || "none"}`,
            `*guard* ${result.guardCaught ? "caught" : "none"}`,
            `*lastRunAt* ${result.lastRunAt || "none"}`,
            `*nextRunAt* ${result.nextRunAt || "none"}`,
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
      summary: `Would skip Slack. Dial is ${result.verdict || "wound"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} fusee alarm on the early dial.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} fusee alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubFuseeLedger(result, env = process.env) {
  const token = env.FUSEE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "fusee",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    configuredAt: result.configuredAt,
    dispatchedAt: result.dispatchedAt,
    kind: result.kind,
    cronExpression: result.cronExpression,
    fireAt: result.fireAt,
    earlyByMs: result.earlyByMs,
    guardCaught: result.guardCaught,
    lastRunAt: result.lastRunAt,
    nextRunAt: result.nextRunAt,
    reportedSuccess: result.reportedSuccess,
    workDone: result.workDone,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub fusee-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub fusee-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearFuseeTicket(result, env = process.env) {
  const key = env.FUSEE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `dial ${result.verdict} · Fusee · ${result.source || "arbor"}`.trim();
  const description = [
    "Fusee refused a dial because a written cron / fireAt is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "early"
      ? "Scheduled task dispatched ~95 days before the DST fleet rewrite slot. The scheduler has no early-dispatch guard."
      : result.verdict === "sprung"
        ? "Spring released before the enamel dial says so."
        : result.verdict === "raced"
          ? "Dispatch raced ahead of the configured slot by a large margin (days+)."
          : result.verdict === "ahead"
            ? "One-off fireAt ran before the ISO slot."
            : result.verdict === "premature"
              ? "Evaluation/decision task ran before its window."
              : "Dial named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90485. Shape: #77657 #89942 #89936 #89811 #85565.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Dial is ${result.verdict || "wound"}.`,
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
    slackFuseeAlarm(result, env),
    githubFuseeLedger(result, env),
    linearFuseeTicket(result, env),
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
            ? `Posted ${result.verdict} fusee alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.FUSEE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Fusee dial ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "fusee-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist fusee ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.FUSEE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.FUSEE_LINEAR_TEAM || "";
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
