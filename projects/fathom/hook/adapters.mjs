/**
 * Fathom sinks. Lost-rule alarm, sounding ledger, ack ticket.
 * Missing secrets stay honest: a demo row, never a fake live 200.
 */

function headline(result) {
  const pins = (result.pins || result.board?.pins || [])
    .map((pin) => pin.check || pin.id)
    .filter(Boolean)
    .join(", ");
  return `${result.session || "session"} · ${result.verdict} · ${pins || "no pins"}`;
}

function quiet(result) {
  return result.verdict === "still" || result.verdict === "bound" || result.state === "still" || result.state === "bound";
}

export function slackLostRuleAlarm(result, env = process.env) {
  const webhook = env.FATHOM_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const still = result.verdict === "still" || result.state === "still";
  const bound = result.verdict === "bound" || result.state === "bound";
  const ack = result.verdict === "ack";
  const lost = result.verdict === "lost";

  const text = still
    ? `Fathom: sounding is still on ${result.session || "session"}.`
    : bound
      ? `Fathom: pins are bound on ${result.session || "session"}.`
      : ack
        ? `Fathom ACK · acknowledgment is not a hold · ${headline(result)}`
        : lost
          ? `Fathom LOST · standing rules dropped · ${headline(result)}`
          : `Fathom DRIFT · bound rule failed · ${headline(result)}`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: still
            ? "Fathom · still"
            : bound
              ? "Fathom · bound"
              : ack
                ? "Fathom · acknowledgment failed"
                : lost
                  ? "Fathom · lost-rule alarm"
                  : "Fathom · drift alarm",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*draft* ${String(result.draft || "").slice(0, 280) || "empty"}`,
            headline(result),
          ].join("\n"),
        },
      },
    ],
  };

  if (still || bound) {
    return {
      adapter: "slack",
      mode: webhook ? "live" : "demo",
      ok: true,
      summary: still
        ? "Would skip Slack — sounding is still."
        : "Would skip Slack — pins are bound.",
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: ack
        ? "Would post to Slack: lost-rule alarm — acknowledgment is not a hold. #89733."
        : lost
          ? "Would post to Slack: lost-rule alarm — standing rules dropped after compact."
          : "Would post to Slack: lost-rule alarm — rule was bound and the draft still failed.",
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: ack
      ? "Posting lost-rule alarm to Slack webhook — acknowledgment is not a hold."
      : "Posting lost-rule alarm to Slack webhook.",
    endpoint: webhook,
    body,
  };
}

export function githubSoundingLedger(result, env = process.env) {
  const token = env.FATHOM_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "fathom",
    session: result.session,
    verdict: result.verdict,
    compacted: result.compacted,
    bound: result.bound,
    spawned: result.spawned,
    inherited: result.inherited,
    draft: result.draft,
    pins: (result.pins || []).map((pin) => ({
      id: pin.id,
      check: pin.check,
      acknowledged: pin.acknowledged,
      verdict: pin.verdict,
    })),
  });

  if (!token) {
    return {
      adapter: "github",
      mode: "demo",
      ok: true,
      summary: "Would append a GitHub sounding ledger row. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would append a GitHub sounding ledger row as a private gist fathom-sounding.jsonl.",
    tokenPresent: true,
    line,
  };
}

export function linearAckTicket(result, env = process.env) {
  const key = env.FATHOM_LINEAR_KEY || env.LINEAR_API_KEY || "";

  if (quiet(result)) {
    return {
      adapter: "linear",
      mode: key ? "live" : "demo",
      ok: true,
      summary:
        result.verdict === "still"
          ? "Would skip Linear — sounding is still."
          : "Would skip Linear — pins are bound.",
    };
  }

  const title = `${result.verdict === "ack" ? "Acknowledgment failed" : result.verdict === "lost" ? "Standing rule lost" : "Bound rule drifted"} · Fathom ${result.session || ""}`.trim();
  const description = [
    "Fathom scored a draft against pins held outside the context window.",
    "",
    headline(result),
    "",
    result.draft || "(empty draft)",
    "",
    "Evidence (do not invent more): anthropics/claude-code#89733 #82184 #59309 · openai/codex#25792 #25884.",
  ].join("\n");

  if (!key) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would open a Linear ack ticket: ${title}`,
      title,
      description,
    };
  }

  return {
    adapter: "linear",
    mode: "live",
    ok: null,
    summary: `Opening Linear ack ticket: ${title}`,
    title,
    description,
  };
}

export async function fire(result, env = process.env, fetchImpl = globalThis.fetch) {
  const planned = [
    slackLostRuleAlarm(result, env),
    githubSoundingLedger(result, env),
    linearAckTicket(result, env),
  ];
  const events = [];

  for (const plan of planned) {
    if (plan.mode !== "live" || !fetchImpl || (quiet(result) && plan.adapter !== "github")) {
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
            ? "Posted lost-rule alarm to Slack."
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.FATHOM_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Fathom sounding ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "fathom-sounding.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist sounding ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.FATHOM_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.FATHOM_LINEAR_TEAM || "";
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
