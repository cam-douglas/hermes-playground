/**
 * Leat sinks. Slack leat alarm on racing / unbounded /
 * promoted / lingering / flooded / live, GitHub leat-ledger
 * of race events on every scored probe, Linear ticket on
 * racing / unbounded / promoted / lingering. Missing secrets
 * stay honest: a demo row, never a fake live 200.
 *
 * This is NOT Shunt (nested SendMessage). NOT Sump (dev/null
 * litter). NOT Quench (spend kill). Sleep-block → unbounded
 * until guidance → background promotion → multi-day zombie
 * wait only.
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
    verdict === "racing" ||
    verdict === "unbounded" ||
    verdict === "promoted" ||
    verdict === "lingering" ||
    verdict === "flooded" ||
    verdict === "live"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return (
    verdict === "racing" ||
    verdict === "unbounded" ||
    verdict === "promoted" ||
    verdict === "lingering"
  );
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackLeatAlarm(result, env = process.env) {
  const webhook =
    env.LEAT_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Leat ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Leat: race is ${result.verdict || "stilled"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Leat · ${result.verdict} race alarm` : `Leat · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*sleep blocked* ${result.sleepBlocked ? "yes" : "no"}`,
            `*recommended until* ${result.recommendedUntil ? "yes" : "no"}`,
            `*iteration cap* ${result.hasIterationCap ? "yes" : "no"}`,
            `*deadline* ${result.hasDeadline ? "yes" : "no"}`,
            `*wrote until-loop* ${result.wroteUntilLoop ? "yes" : "no"}`,
            `*promoted* ${result.promotedToBackground ? "yes" : "no"}`,
            `*still live* ${result.backgroundStillLive ? "yes" : "no"}`,
            `*days alive* ${result.daysAlive ?? 0}`,
            `*restart blocked* ${result.restartBlocked ? "yes" : "no"}`,
            `*task count* ${result.taskCount ?? 0}`,
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
      summary: `Would skip Slack. Race is ${result.verdict || "stilled"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} leat alarm on the racing channel.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} leat alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubLeatLedger(result, env = process.env) {
  const token = env.LEAT_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "leat",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    sleepBlocked: result.sleepBlocked,
    recommendedUntil: result.recommendedUntil,
    hasIterationCap: result.hasIterationCap,
    hasDeadline: result.hasDeadline,
    foregroundTimeoutMs: result.foregroundTimeoutMs,
    promotedToBackground: result.promotedToBackground,
    backgroundStillLive: result.backgroundStillLive,
    daysAlive: result.daysAlive,
    restartBlocked: result.restartBlocked,
    taskCount: result.taskCount,
    ppidOne: result.ppidOne,
    outputUnlinked: result.outputUnlinked,
    wroteUntilLoop: result.wroteUntilLoop,
    spunCpu: result.spunCpu,
    taskStopped: result.taskStopped,
    outputMtimeLive: result.outputMtimeLive,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub leat-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub leat-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearLeatTicket(result, env = process.env) {
  const key = env.LEAT_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `race ${result.verdict} · Leat · ${result.source || "channel"}`.trim();
  const description = [
    "Leat refused a race because a blocked sleep is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "racing"
      ? "Agent followed the Bash-tool block message and wrote an unbounded until-loop. No iteration cap. No deadline. The loop is live."
      : result.verdict === "unbounded"
        ? "Block message recommended `until <check>; do sleep 2; done` with no iteration cap or deadline."
        : result.verdict === "promoted"
          ? "Foreground timeout moved the loop to background and discarded the bound (see #88702)."
          : result.verdict === "lingering"
            ? "Background loop still live across a session boundary / days later."
            : "Race named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90475. Shape: #88702 #89625.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Race is ${result.verdict || "stilled"}.`,
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
    slackLeatAlarm(result, env),
    githubLeatLedger(result, env),
    linearLeatTicket(result, env),
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
            ? `Posted ${result.verdict} leat alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.LEAT_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Leat race ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "leat-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist leat ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.LEAT_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.LEAT_LINEAR_TEAM || "";
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
