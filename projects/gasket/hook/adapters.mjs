/**
 * Gasket sinks. Slack dropped/blown/nested/open/sheared alarm,
 * GitHub gasket-ledger issue on every scored probe, Linear
 * incident on dropped / blown / open. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Damper (RC auto-enable). NOT Tappet (hooks).
 * NOT Snib. NOT Knock. Project-scoped strictAllowlist discard only.
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
    verdict === "dropped" ||
    verdict === "blown" ||
    verdict === "nested" ||
    verdict === "open" ||
    verdict === "sheared"
  );
}

function isLinear(result) {
  const verdict = result.verdict || result.state;
  return verdict === "dropped" || verdict === "blown" || verdict === "open";
}

export function memoryLedger() {
  return ledger.slice();
}

export function slackGasketAlarm(result, env = process.env) {
  const webhook =
    env.GASKET_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Gasket ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Gasket: joint is ${result.verdict || "tight"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Gasket · ${result.verdict} flange alarm` : `Gasket · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*project strictAllowlist* ${result.projectSettingsHasStrictAllowlist ? "yes" : "no"}`,
            `*right scope* ${result.userOrManagedOrCliScope ? "yes" : "no"}`,
            `*sandbox enabled* ${result.sandboxEnabled ? "yes" : "no"}`,
            `*Bash blocked* ${result.bashEgressBlocked ? "yes" : "no"}`,
            `*host reached* ${result.nonAllowlistedHostReached ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Joint is ${result.verdict || "tight"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} flange alarm on the steam joint.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} flange alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubGasketLedger(result, env = process.env) {
  const token = env.GASKET_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "gasket",
    session: result.session,
    verdict: result.verdict,
    alarm: result.alarm,
    source: result.source,
    issue: result.issue ?? null,
    action: result.action,
    projectSettingsHasStrictAllowlist: result.projectSettingsHasStrictAllowlist,
    userOrManagedOrCliScope: result.userOrManagedOrCliScope,
    sandboxEnabled: result.sandboxEnabled,
    bashEgressBlocked: result.bashEgressBlocked,
    webfetchEgressBlocked: result.webfetchEgressBlocked,
    writeGated: result.writeGated,
    nestedProjectReplacedParent: result.nestedProjectReplacedParent,
    nonAllowlistedHostReached: result.nonAllowlistedHostReached,
    schemaSaysUndocumented: result.schemaSaysUndocumented,
    reasons: result.reasons,
  });

  ledger.push(line);

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would open a GitHub gasket-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub gasket-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearGasketTicket(result, env = process.env) {
  const key = env.GASKET_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `sandbox.network.strictAllowlist ${result.verdict} · Gasket · ${result.source || "flange"}`.trim();
  const description = [
    "Gasket refused a joint because a written project key is not a seal.",
    "",
    headline(result),
    "",
    result.verdict === "dropped"
      ? "Project settings carry strictAllowlist. Resolution drops the key. Startup, debug, status, sandbox, and doctor stay silent."
      : result.verdict === "blown"
        ? "Sandbox looks on. Allowlist present. Non-allowlisted host still reached. Fail-open."
        : result.verdict === "open"
          ? "Allowlist theater. No sandbox runtime. Network keys sitting in a file. Traffic unrestricted."
          : "Flange named a class.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90355 #89762 #87545 #87296 #34044 #83035. Related #87163. Contrast #30112.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Joint is ${result.verdict || "tight"}.`,
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
    slackGasketAlarm(result, env),
    githubGasketLedger(result, env),
    linearGasketTicket(result, env),
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
            ? `Posted ${result.verdict} flange alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.GASKET_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Gasket flange ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "gasket-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist flange ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.GASKET_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.GASKET_LINEAR_TEAM || "";
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
