/**
 * Sump sinks. Slack sump alarm on silted / clogged / fouled /
 * littered, GitHub sump-ledger of silt events on every scored
 * probe, Linear ticket on silted / clogged / fouled. Missing
 * secrets stay honest: a demo row, never a fake live 200.
 *
 * This is NOT Wicket (isolation pin). NOT Scant (PATH
 * truncation). NOT Pleat (mid-turn fold). Literal `dev/null/`
 * LFS hook litter during worktree provision only.
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
    verdict === "silted" ||
    verdict === "clogged" ||
    verdict === "fouled" ||
    verdict === "littered"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "silted" || verdict === "clogged" || verdict === "fouled";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackSumpAlarm(result, env = process.env) {
  const webhook =
    env.SUMP_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);
  const files = Array.isArray(result.hookFiles) ? result.hookFiles.join(", ") : "";

  const text = alarm
    ? `Sump ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Sump: pit is ${result.verdict || "drained"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Sump · ${result.verdict} silt alarm` : `Sump · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*literal pit* ${result.literalNullDir ? "dev/null/" : "none"}`,
            `*hooks in pit* ${files || "none"}`,
            `*claimed hookspath* ${result.hookspathClaimed || "none"}`,
            `*absolute* ${result.hookspathIsAbsolute ? "yes" : "no"}`,
            `*relative null* ${result.pathResolvedRelative || result.relativeNullWrite ? "yes" : "no"}`,
            `*untracked* ${result.gitStatusUntracked ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Pit is ${result.verdict || "drained"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} sump alarm on the silted pit.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} sump alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubSumpLedger(result, env = process.env) {
  const token = env.SUMP_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "sump",
    session: result.session,
    verdict: result.verdict,
    cluster: result.cluster || [],
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    literalNullDir: result.literalNullDir,
    hookFiles: result.hookFiles,
    emptyNullDir: result.emptyNullDir,
    fullyPopulated: result.fullyPopulated,
    hooksLandedInNull: result.hooksLandedInNull,
    hooksAreLfsShims: result.hooksAreLfsShims,
    gitStatusUntracked: result.gitStatusUntracked,
    pathResolvedRelative: result.pathResolvedRelative,
    hooksNeverFire: result.hooksNeverFire,
    hookspathClaimed: result.hookspathClaimed,
    hookspathIsAbsolute: result.hookspathIsAbsolute,
    relativeNullWrite: result.relativeNullWrite,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub sump-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub sump-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearSumpTicket(result, env = process.env) {
  const key = env.SUMP_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `silt ${result.verdict} · Sump · ${result.source || "pit"}`.trim();
  const description = [
    "Sump refused a pit because a null path is not a hold.",
    "",
    headline(result),
    "",
    result.verdict === "silted"
      ? "Worktree provisioning wrote Git LFS hooks to a literal dev/null/ directory. The silt is still on the grate."
      : result.verdict === "clogged"
        ? "Grate packed with all four LFS hook shims (post-checkout, post-commit, post-merge, pre-push)."
        : result.verdict === "fouled"
          ? "LFS shims contaminate the literal null pit."
          : "Pit named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90456. Shape: #69453 #74033 #79923 #81812. Related hooksPath confusion: #72714.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Pit is ${result.verdict || "drained"}.`,
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
    slackSumpAlarm(result, env),
    githubSumpLedger(result, env),
    linearSumpTicket(result, env),
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
            ? `Posted ${result.verdict} sump alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SUMP_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Sump silt ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "sump-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist sump ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SUMP_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SUMP_LINEAR_TEAM || "";
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
