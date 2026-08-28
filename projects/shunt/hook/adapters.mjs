/**
 * Shunt sinks. Slack shunt alarm on misrouted / orphaned /
 * rootbound / typecast, GitHub shunt-ledger of road events
 * on every scored probe, Linear ticket on misrouted /
 * orphaned / rootbound. Missing secrets stay honest: a demo
 * row, never a fake live 200.
 *
 * This is NOT Cote (resume hub split). NOT Tappet (hook
 * injection). NOT Reveille (duplicate dispatch). Nested
 * SendMessage follow-up misroute to root + unresolvable
 * from=type only.
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
    verdict === "misrouted" ||
    verdict === "orphaned" ||
    verdict === "rootbound" ||
    verdict === "typecast"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "misrouted" || verdict === "orphaned" || verdict === "rootbound";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackShuntAlarm(result, env = process.env) {
  const webhook =
    env.SHUNT_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const fromLabel = result.childFromLabel || (result.fromIsAgentType ? "general-purpose" : "");

  const text = alarm
    ? `Shunt ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Shunt: road is ${result.verdict || "stabled"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Shunt · ${result.verdict} road alarm` : `Shunt · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*first to parent* ${result.firstAnswerToParent ? "yes" : "no"}`,
            `*follow-up to root* ${result.followUpToRoot || result.notificationQueuedToRoot ? "yes" : "no"}`,
            `*parent received follow-up* ${result.parentReceivedFollowUp ? "yes" : "no"}`,
            `*from* ${fromLabel || "none"}`,
            `*from resolves* ${result.fromResolves ? "yes" : "no"}`,
            `*parent parked* ${result.parentParkedWaiting ? "yes" : "no"}`,
            `*keepalive cleared* ${result.keepaliveClearedAfterFirst ? "yes" : "no"}`,
            `*nested depth* ${result.nestedDepth ?? 0}`,
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
      summary: `Would skip Slack. Road is ${result.verdict || "stabled"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} shunt alarm on the misrouted road.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} shunt alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubShuntLedger(result, env = process.env) {
  const token = env.SHUNT_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "shunt",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    firstAnswerToParent: result.firstAnswerToParent,
    followUpToRoot: result.followUpToRoot,
    parentReceivedFollowUp: result.parentReceivedFollowUp,
    childProducedFollowUp: result.childProducedFollowUp,
    fromIsAgentType: result.fromIsAgentType,
    fromResolves: result.fromResolves,
    parentParkedWaiting: result.parentParkedWaiting,
    keepaliveClearedAfterFirst: result.keepaliveClearedAfterFirst,
    parentRunning: result.parentRunning,
    parentCompleted: result.parentCompleted,
    parentHoldsKeepalive: result.parentHoldsKeepalive,
    replyAddressedByRequester: result.replyAddressedByRequester,
    notificationQueuedToRoot: result.notificationQueuedToRoot,
    nestedDepth: result.nestedDepth,
    childFromLabel: result.childFromLabel,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub shunt-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub shunt-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearShuntTicket(result, env = process.env) {
  const key = env.SHUNT_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `road ${result.verdict} · Shunt · ${result.source || "yard"}`.trim();
  const description = [
    "Shunt refused a road because a first delivery is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "misrouted"
      ? "Nested SendMessage follow-up delivered to the root session instead of the requesting parent. First answer went to the parent. The parent is parked waiting."
      : result.verdict === "orphaned"
        ? "Child produced a follow-up after the parent completed; keepalive was already gone. The wagon is orphaned off the road."
        : result.verdict === "rootbound"
          ? "Follow-up or notification queued to the root session."
          : "Road named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90463. Shape: #77950 #75043 #76681 #78338.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Road is ${result.verdict || "stabled"}.`,
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
    slackShuntAlarm(result, env),
    githubShuntLedger(result, env),
    linearShuntTicket(result, env),
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
            ? `Posted ${result.verdict} shunt alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SHUNT_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Shunt road ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "shunt-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist shunt ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SHUNT_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SHUNT_LINEAR_TEAM || "";
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
