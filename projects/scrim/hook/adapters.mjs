/**
 * Scrim sinks. Alert + ledger after the veil drops.
 * Missing secrets stay honest: a demo ledger row, never a fake 200.
 */
import { highestSeverity } from "./redact.mjs";

function snippet(redacted) {
  const text = typeof redacted === "string" ? redacted : JSON.stringify(redacted, null, 2);
  const cut = text.length > 480 ? `${text.slice(0, 480)}…` : text;
  return cut;
}

export function slackAlert(result, env = process.env) {
  const webhook = env.SCRIM_SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const text = result.clean
    ? "Scrim: frame is clean. No key-shaped tokens."
    : `Scrim leak · ${result.findings.length} token${result.findings.length === 1 ? "" : "s"} · severity ${result.severity}`;
  const body = {
    text,
    blocks: [
      { type: "header", text: { type: "plain_text", text: "Scrim · veil dropped" } },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: result.clean
            ? "Nothing to rotate. Stream is clean."
            : result.findings
                .map((row) => `• \`${row.family}\` \`${row.id}\` · ${row.severity} · ${row.sinks.join("+") || "payload"}`)
                .join("\n"),
        },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: "```" + snippet(result.redacted) + "```" },
      },
    ],
  };

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: result.clean
        ? "Would skip Slack — frame is clean."
        : "Would post to Slack: leak alert with redacted snippet.",
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: "Posting leak alert to Slack webhook.",
    endpoint: webhook,
    body,
  };
}

export function githubLedger(result, env = process.env) {
  const token = env.SCRIM_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const repo = env.SCRIM_GITHUB_REPO || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "scrim",
    severity: result.severity,
    findings: result.findings,
    redacted_snippet: snippet(result.redacted),
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: result.clean
        ? "Would skip GitHub ledger — frame is clean."
        : "Would append a private gist / check-run row to the redaction ledger.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: repo
      ? `Would append ledger to ${repo} (gist fallback if no issue).`
      : "Would create an append-only private gist for the redaction ledger.",
    tokenPresent: true,
    repo: repo || null,
    line,
  };
}

export function linearTicket(result, env = process.env) {
  const key = env.SCRIM_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const high = result.findings.filter((row) => row.severity === "high");
  if (!high.length) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary: "No high-severity family — no rotate ticket.",
    };
  }
  const families = [...new Set(high.map((row) => row.family))];
  const title = `Rotate leaked ${families.join(", ")} · Scrim ${high[0].id}`;
  const description = [
    "Scrim caught a high-severity family at the agent I/O boundary.",
    "",
    ...high.map((row) => `- ${row.family} \`${row.id}\` ×${row.count} sinks=${row.sinks.join(",")}`),
    "",
    "Playbook: rotate the live secret, then keep the forensic id in the ledger.",
    "Evidence shape (public): openai/codex#40378, github/gh-aw#25103, anthropics/claude-code#63593.",
  ].join("\n");

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear rotate ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear rotate ticket: ${title}`,
    title,
    description,
  };
}

export async function dispatch(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [slackAlert(result, env), githubLedger(result, env), linearTicket(result, env)];
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
            ? "Posted leak alert to Slack (redacted snippet)."
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.SCRIM_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: "Scrim redaction ledger",
            public: false,
            files: { "scrim-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Appended private gist ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.SCRIM_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.SCRIM_LINEAR_TEAM || "";
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

  return { severity: highestSeverity(result.findings), events };
}
