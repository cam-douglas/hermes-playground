/**
 * Pleat sinks. Slack pleat alarm on pleated / buried / swallowed /
 * ghosted, GitHub pleat-ledger of cloth events on every scored
 * probe, Linear ticket on buried / ghosted. Missing secrets stay
 * honest: a demo row, never a fake live 200.
 *
 * This is NOT Aside (preamble side-channel). NOT Coda (last-block
 * splice). NOT Chad (phantom AskUserQuestion selection). Desktop
 * fold hiding mid-turn answers only.
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
    verdict === "pleated" ||
    verdict === "buried" ||
    verdict === "swallowed" ||
    verdict === "ghosted"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "buried" || verdict === "ghosted";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackPleatAlarm(result, env = process.env) {
  const webhook =
    env.PLEAT_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Pleat ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Pleat: cloth is ${result.verdict || "flat"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Pleat · ${result.verdict} cloth alarm` : `Pleat · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*fold collapsed* ${result.foldCollapsed ? "yes" : "no"}`,
            `*mid-turn prose* ${result.midTurnProse ? "present" : "none"}`,
            `*Ran N chrome* ${result.ranNCommandsVisible ? "yes" : "no"}`,
            `*hint of hidden prose* ${result.noHintOfHiddenProse ? "none" : "n/a"}`,
            `*model believes answered* ${result.modelBelievesAnswered ? "yes" : "no"}`,
            `*user never saw* ${result.userNeverSaw ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Cloth is ${result.verdict || "flat"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} pleat alarm on the folded cloth.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} pleat alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubPleatLedger(result, env = process.env) {
  const token = env.PLEAT_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "pleat",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    midTurnProse: result.midTurnProse,
    foldCollapsed: result.foldCollapsed,
    requestedExplanation: result.requestedExplanation,
    explanationInTranscript: result.explanationInTranscript,
    explanationHiddenInFold: result.explanationHiddenInFold,
    toolChromeOnly: result.toolChromeOnly,
    finalFragmentOnly: result.finalFragmentOnly,
    numberedListStartsMid: result.numberedListStartsMid,
    proseBetweenToolUse: result.proseBetweenToolUse,
    ranNCommandsVisible: result.ranNCommandsVisible,
    noHintOfHiddenProse: result.noHintOfHiddenProse,
    trailingStatusOnly: result.trailingStatusOnly,
    modelBelievesAnswered: result.modelBelievesAnswered,
    userNeverSaw: result.userNeverSaw,
    foldExpanded: result.foldExpanded,
    proseRecovered: result.proseRecovered,
    midTurnProseVisible: result.midTurnProseVisible,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub pleat-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub pleat-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearPleatTicket(result, env = process.env) {
  const key = env.PLEAT_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `mid-turn-fold ${result.verdict} · Pleat · ${result.source || "board"}`.trim();
  const description = [
    "Pleat refused a cloth because a rendered fold is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "buried"
      ? "Requested explanation exists in the transcript but is hidden in the fold."
      : result.verdict === "ghosted"
        ? "Model believes it answered. User never saw it. Silent both sides."
        : "Cloth named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90425. Shape: #67071 #75500 #85061 #74184 #84065 #89318 #77007.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Cloth is ${result.verdict || "flat"}.`,
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
    slackPleatAlarm(result, env),
    githubPleatLedger(result, env),
    linearPleatTicket(result, env),
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
            ? `Posted ${result.verdict} pleat alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.PLEAT_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Pleat cloth ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "pleat-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist pleat ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.PLEAT_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.PLEAT_LINEAR_TEAM || "";
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
