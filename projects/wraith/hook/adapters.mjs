/**
 * Wraith sinks. Slack pruned/ghosted/voided/orphaned/severed alarm,
 * GitHub wraith-ledger issue on every scored probe, Linear
 * incident on pruned / orphaned / severed. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Gasket (settings-key drop). NOT Damper (RC auto-enable).
 * NOT Livery (disclaimer-spawn / seisin). Live-image unlink only.
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
    verdict === "pruned" ||
    verdict === "ghosted" ||
    verdict === "voided" ||
    verdict === "orphaned" ||
    verdict === "severed"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "pruned" || verdict === "orphaned" || verdict === "severed";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackWraithAlarm(result, env = process.env) {
  const webhook =
    env.WRAITH_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Wraith ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Wraith: image is ${result.verdict || "unlinked"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Wraith · ${result.verdict} afterimage alarm` : `Wraith · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*image deleted* ${result.imageDeleted ? "yes" : "no"}`,
            `*updater pruned* ${result.updaterPrunedRunningVersion ? "yes" : "no"}`,
            `*lsof (deleted)* ${result.lsofOrProcExeDeleted ? "yes" : "no"}`,
            `*grants still ON* ${result.grantsStillOn ? "yes" : "no"}`,
            `*Read EPERM* ${result.readEperm ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Image is ${result.verdict || "unlinked"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} afterimage alarm on the deleted image.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} afterimage alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubWraithLedger(result, env = process.env) {
  const token = env.WRAITH_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "wraith",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    imageDeleted: result.imageDeleted,
    updaterPrunedRunningVersion: result.updaterPrunedRunningVersion,
    lsofOrProcExeDeleted: result.lsofOrProcExeDeleted,
    grantsStillOn: result.grantsStillOn,
    inAppGrantSuccessNoOp: result.inAppGrantSuccessNoOp,
    bashEperm: result.bashEperm,
    readEperm: result.readEperm,
    postUpdateSessionReadsOk: result.postUpdateSessionReadsOk,
    spawnSuccessEnoent: result.spawnSuccessEnoent,
    remoteControlGreenButEperm: result.remoteControlGreenButEperm,
    restartRestores: result.restartRestores,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub wraith-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub wraith-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearWraithTicket(result, env = process.env) {
  const key = env.WRAITH_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `live-image unlink ${result.verdict} · Wraith · ${result.source || "pane"}`.trim();
  const description = [
    "Wraith refused an image because a grant that is still ON is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "pruned"
      ? "Updater deleted the running image under a live session. TCC fails against the deleted signature. Grants stay ON."
      : result.verdict === "orphaned"
        ? "Agent/teammate spawn reported Spawned successfully. Child ENOENT because the version dir was pruned."
        : result.verdict === "severed"
          ? "Remote-control still shows connected/green. Every new session EPERM. Restart restores."
          : "Afterimage named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90373 #86129 #75355 #70071 #80941 #26981 #64685. Adjacent #88726.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Image is ${result.verdict || "unlinked"}.`,
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
    slackWraithAlarm(result, env),
    githubWraithLedger(result, env),
    linearWraithTicket(result, env),
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
            ? `Posted ${result.verdict} afterimage alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.WRAITH_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Wraith afterimage ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "wraith-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist afterimage ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.WRAITH_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.WRAITH_LINEAR_TEAM || "";
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
