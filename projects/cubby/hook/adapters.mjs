/**
 * Cubby sinks. Slack alarm on misfiled /
 * ancestor / stale / invisible /
 * walked-up / ghosted / mirrored-fail.
 * GitHub cubby-ledger of scored probes
 * on every score. Linear ticket on
 * invisible / ancestor / walked-up /
 * ghosted. Missing secrets stay honest:
 * a demo row, never a fake live 200.
 *
 * This is NOT Ullage / Iota / Fob /
 * Cinch / Wicket / Grille / Spile /
 * Bollard / Clew / Hasp / leftover
 * woodworking. A stuffed cubby is not
 * a hold. Score the wall or admit
 * stowed.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./cubby.mjs";

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

export function slackCubbyAlarm(result, env = process.env) {
  const webhook = env.CUBBY_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Cubby ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Cubby: wall is ${result.verdict || "stowed"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Cubby · ${result.verdict} wall alarm` : `Cubby · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*cwd* ${result.cwd || "—"}`,
            `*git-root* ${result.gitRoot || "—"}`,
            `*expected cache* ${result.expectedCachePath || "—"}`,
            `*injected cache* ${result.injectedCachePath || "—"}`,
            `*ancestor walk* ${result.ancestorWalkUp ? "yes" : "no"}`,
            `*cwd vs git-root* ${result.cwdVsGitRootSplit ? "yes" : "no"}`,
            `*missing files* ${result.injectedMissingFileCount ?? 0}`,
            `*safety rule only* ${result.safetyRuleInAuthoritativeOnly ? "yes" : "no"}`,
            `*path surfaced* ${result.cachePathSurfaced ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Cubby is ${result.verdict || "stowed"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} wall alarm on the cubby.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} wall alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubCubbyLedger(result, env = process.env) {
  const token = env.CUBBY_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "cubby",
    session: result.session,
    verdict: result.verdict,
    cwd: result.cwd || "",
    gitRoot: result.gitRoot || "",
    expectedCachePath: result.expectedCachePath || "",
    injectedCachePath: result.injectedCachePath || "",
    ancestorWalkUp: Boolean(result.ancestorWalkUp),
    cwdVsGitRootSplit: Boolean(result.cwdVsGitRootSplit),
    authoritativeMemoryPath: result.authoritativeMemoryPath || "",
    injectedMissingFileCount: result.injectedMissingFileCount ?? 0,
    safetyRuleInAuthoritativeOnly: Boolean(result.safetyRuleInAuthoritativeOnly),
    cachePathSurfaced: Boolean(result.cachePathSurfaced),
    nonAsciiSlugCorrupt: Boolean(result.nonAsciiSlugCorrupt),
    wrongProjectHash: Boolean(result.wrongProjectHash),
    pathScopedUnreachable: Boolean(result.pathScopedUnreachable),
    readReturnedWrongScope: Boolean(result.readReturnedWrongScope),
    restoredDiagnostic: Boolean(result.restoredDiagnostic),
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
      summary: "Would open a GitHub cubby-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub cubby-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearCubbyTicket(result, env = process.env) {
  const key = env.CUBBY_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `cubby ${result.verdict} · Cubby · ${result.source || "wall"}`.trim();
  const description = [
    "Cubby scored a wall because a stuffed cubby is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `cwd: ${result.cwd || "—"}`,
    `git-root: ${result.gitRoot || "—"}`,
    `expected cache: ${result.expectedCachePath || "—"}`,
    `injected cache: ${result.injectedCachePath || "—"}`,
    `ancestor walk: ${result.ancestorWalkUp ? "yes" : "no"}`,
    `cwd vs git-root: ${result.cwdVsGitRootSplit ? "yes" : "no"}`,
    `missing files: ${result.injectedMissingFileCount ?? 0}`,
    `safety rule only: ${result.safetyRuleInAuthoritativeOnly ? "yes" : "no"}`,
    "",
    loss
      ? "Invisible, ancestor, walked-up, or ghosted: auto-memory resolved to the wrong cubby. A safety rule in authoritative memory never reached the session, or continuity broke."
      : "Not an invisible / ancestor / walked-up / ghosted wall. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90604. Same-class #52772 (CWD vs git-root) #53734 (ancestor walk) #89915 (wrong project hash) #90046 (transcript vs index) #85591 (Read wrong scope) #88945 (path-scoped unreachable) #76617 (Non-ASCII slug). NOT Ullage / Iota / Fob / Cinch / Wicket / Grille / Spile / Bollard / Clew / Hasp / leftover woodworking. openai/codex#16799 #37950.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "stowed"} is not invisible / ancestor / walked-up / ghosted.`,
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
    slackCubbyAlarm(result, env),
    githubCubbyLedger(result, env),
    linearCubbyTicket(result, env),
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
            ? `Posted ${result.verdict} wall alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.CUBBY_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Cubby wall ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "cubby-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist cubby ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.CUBBY_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.CUBBY_LINEAR_TEAM || "";
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
