/**
 * Datum sinks. Slack alarm on
 * wrong-base / master-lie /
 * scope-bleed / findings-bleed /
 * unrelated / merge-missed.
 * GitHub datum-ledger of scored
 * probes on every score. Linear
 * ticket on wrong-base /
 * master-lie / findings-bleed.
 * Missing secrets stay honest: a
 * demo row, never a fake live 200.
 *
 * This is NOT Calque / Fascia /
 * Quoin / Gaff / Sear / Cubby /
 * Grille / Spile / Bollard / Clew /
 * Sounder / Binnacle / Pirn /
 * Cotter / Fob / Visa / Snib /
 * Knock / Veto / Iota / Wicket /
 * Parity / leftover woodworking.
 * A wrong base is not a hold.
 * Score the plate or admit level.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./datum.mjs";

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

export function slackDatumAlarm(result, env = process.env) {
  const webhook = env.DATUM_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Datum ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Datum: plate is ${result.verdict || "level"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Datum · ${result.verdict} plate alarm` : `Datum · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*PR* ${result.prUrl || "-"}`,
            `*PR base* ${result.prBase || "-"}`,
            `*measured* ${result.measuredBase || "-"}`,
            `*findings* ${result.findingsInDiff ?? 0}/${result.findingsTotal ?? 0} in diff · ${result.findingsOffDiff ?? 0} off-diff`,
            `*off-diff files* ${(result.offDiffFiles || []).join(", ") || "-"}`,
            `*skill* ${result.skill || "-"}`,
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
      summary: `Would skip Slack. Datum is ${result.verdict || "level"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} plate alarm on the datum.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} plate alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubDatumLedger(result, env = process.env) {
  const token = env.DATUM_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "datum",
    session: result.session,
    verdict: result.verdict,
    prUrl: result.prUrl || "",
    prBase: result.prBase || "",
    measuredBase: result.measuredBase || "",
    findingsTotal: result.findingsTotal ?? 0,
    findingsInDiff: result.findingsInDiff ?? 0,
    findingsOffDiff: result.findingsOffDiff ?? 0,
    offDiffFiles: result.offDiffFiles || [],
    skill: result.skill || "",
    level: Boolean(result.level),
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
      summary: "Would open a GitHub datum-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub datum-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearDatumTicket(result, env = process.env) {
  const key = env.DATUM_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `datum ${result.verdict} · Datum · ${result.source || "plate"}`.trim();
  const description = [
    "Datum scored a plate because a wrong base is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `PR: ${result.prUrl || "-"}`,
    `PR base: ${result.prBase || "-"}`,
    `measured: ${result.measuredBase || "-"}`,
    `findings: ${result.findingsInDiff ?? 0}/${result.findingsTotal ?? 0} in diff · ${result.findingsOffDiff ?? 0} off-diff`,
    `off-diff files: ${(result.offDiffFiles || []).join(", ") || "-"}`,
    `skill: ${result.skill || "-"}`,
    "",
    loss
      ? "Wrong-base, master-lie, or findings-bleed: the code-review skill measured from the wrong datum (local master) instead of the PR merge base, or a majority of findings were off-diff."
      : "Not a wrong-base / master-lie / findings-bleed plate. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90620. Related (not identical) #82397 #78257 #69232. NOT Calque / Fascia / Quoin / Gaff / Sear / Cubby / Grille / Spile / Bollard / Clew / Sounder / Binnacle / Pirn / Cotter / Fob / Visa / Snib / Knock / Veto / Iota / Wicket / Parity / leftover woodworking.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "level"} is not wrong-base / master-lie / findings-bleed.`,
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
    slackDatumAlarm(result, env),
    githubDatumLedger(result, env),
    linearDatumTicket(result, env),
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
            ? `Posted ${result.verdict} plate alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.DATUM_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Datum plate ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "datum-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist datum ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.DATUM_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.DATUM_LINEAR_TEAM || "";
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
