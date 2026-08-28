/**
 * Kist sinks. Slack kist alarm when a live RC session is kisted /
 * hollow / stuck / lost / sealed, GitHub kist-ledger of
 * archive/unarchive asymmetry on every scored probe, Linear
 * session-lost ticket on kisted / lost / sealed. Missing secrets
 * stay honest: a demo row, never a fake live 200.
 *
 * This is NOT Wraith (live-image unlink / afterimage).
 * NOT Damper (RC auto-enable). NOT leftover woodworking.
 * Teardown-archive that never unarchives only.
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
    verdict === "kisted" ||
    verdict === "hollow" ||
    verdict === "stuck" ||
    verdict === "lost" ||
    verdict === "sealed"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "kisted" || verdict === "lost" || verdict === "sealed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackKistAlarm(result, env = process.env) {
  const webhook =
    env.KIST_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Kist ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Kist: lid is ${result.verdict || "laid"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Kist · ${result.verdict} funeral alarm` : `Kist · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*teardown* ${result.teardownCause || "none"}`,
            `*CCR archive* ${result.ccrArchiveRequested ? `yes (${result.ccrArchiveCount || 0})` : "no"}`,
            `*CCR unarchive* ${result.ccrUnarchiveRequested ? "yes" : "no (0)"}`,
            `*local unarchive* ${result.localUnarchiveRan ? `yes (${result.localUnarchiveCount || 0})` : "no"}`,
            `*default list* ${result.onMobileDefaultList ? "present" : "absent"}`,
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
      summary: `Would skip Slack. Lid is ${result.verdict || "laid"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} kist alarm on the live RC session.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} kist alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubKistLedger(result, env = process.env) {
  const token = env.KIST_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "kist",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    teardownCause: result.teardownCause,
    ccrArchiveRequested: result.ccrArchiveRequested,
    ccrUnarchiveRequested: result.ccrUnarchiveRequested,
    localUnarchiveRan: result.localUnarchiveRan,
    reopenedLocally: result.reopenedLocally,
    onMobileDefaultList: result.onMobileDefaultList,
    vanishedFromDefault: result.vanishedFromDefault,
    archivedFilterOnly: result.archivedFilterOnly,
    cloudStillArchived: result.cloudStillArchived,
    localSessionActive: result.localSessionActive,
    reattachedBridgeId: result.reattachedBridgeId,
    ccrArchiveCount: result.ccrArchiveCount,
    ccrUnarchiveCount: result.ccrUnarchiveCount,
    localUnarchiveCount: result.localUnarchiveCount,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub kist-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub kist-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearKistTicket(result, env = process.env) {
  const key = env.KIST_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `session-lost ${result.verdict} · Kist · ${result.source || "lid"}`.trim();
  const description = [
    "Kist refused a funeral because a session still on the default list is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "kisted"
      ? "Archived on teardown with no user archive action. Auto-update / ShipIt / app quit killed the session process. CCR archive propagated. CCR unarchive never did."
      : result.verdict === "lost"
        ? "Gone from the mobile / claude.ai/code default list. Appears only under Archived."
        : result.verdict === "sealed"
          ? "No desktop-side action restores the cloud session. Workaround: unarchive from mobile/web only."
          : "Funeral named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90387. Shape: #87335 #65838. Contrast: #71873 #39178.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Lid is ${result.verdict || "laid"}.`,
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
    slackKistAlarm(result, env),
    githubKistLedger(result, env),
    linearKistTicket(result, env),
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
            ? `Posted ${result.verdict} kist alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.KIST_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Kist funeral ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "kist-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist kist ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.KIST_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.KIST_LINEAR_TEAM || "";
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
