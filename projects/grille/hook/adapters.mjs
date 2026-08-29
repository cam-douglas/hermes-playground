/**
 * Grille sinks. Slack alarm on slotted /
 * steered / unreceipted / unhooked /
 * killed / allowlisted. GitHub grille-
 * ledger of scored probes on every
 * score. Linear ticket on slotted /
 * steered / unhooked / killed. Missing
 * secrets stay honest: a demo row, never
 * a fake live 200.
 *
 * This is NOT Stencil / Hasp / Coda /
 * Veto / Tappet / Assay / Spile / Scant /
 * Knock / Gasket / Iota / Blot / Wicket /
 * leftover woodworking. A night drop
 * through the slot is not a hold. Score
 * the grille or admit posted.
 */

import { LINEAR_VERDICTS, SLACK_VERDICTS } from "./grille.mjs";

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

export function slackGrilleAlarm(result, env = process.env) {
  const webhook = env.GRILLE_SLACK_WEBHOOK || env.SLACK_WEBHOOK || env.SLACK_WEBHOOK_URL || "";
  const alarm = isSlackAlarm(result);

  const text = alarm
    ? `Grille ${String(result.verdict || "").toUpperCase()} · ${headline(result)}`
    : `Grille: desk is ${result.verdict || "posted"} on ${result.session || "session"}.`;

  const body = {
    text,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: alarm ? `Grille · ${result.verdict} desk alarm` : `Grille · ${result.verdict}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*session* \`${result.session || "session"}\``,
            `*verdict* ${result.verdict}`,
            `*mode* ${result.permissionMode || "—"}`,
            `*tool* ${result.toolUsed || "—"}`,
            `*bypass directive* ${result.bypassDirectivePresent ? "yes" : "no"}`,
            `*bash write* ${result.bashWriteCapable ? "yes" : "no"}`,
            `*edit/write* ${result.editWriteUsed ? "yes" : "no"}`,
            `*diff would render* ${result.diffWouldRender ? "yes" : "no"}`,
            `*Write|Edit hooks* ${result.preToolUseEditWriteWouldFire ? "yes" : "no"}`,
            `*windows* ${result.windowsPlatform ? "yes" : "no"}`,
            `*heredoc prescribed* ${result.heredocPrescribed ? "yes" : "no"}`,
            `*truncated* ${result.writeFailedOrTruncated ? "yes" : "no"}`,
            `*allowlist* ${result.allowlistBashWrite ? "yes" : "no"}`,
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
      summary: `Would skip Slack. Grille is ${result.verdict || "posted"}.`,
      body,
    };
  }

  if (!webhook) {
    return {
      adapter: "slack",
      mode: "demo",
      ok: true,
      summary: `Would post to Slack: ${result.verdict} desk alarm on the grille.`,
      body,
    };
  }

  return {
    adapter: "slack",
    mode: "live",
    ok: null,
    summary: `Posting ${result.verdict} desk alarm to Slack webhook.`,
    endpoint: webhook,
    body,
  };
}

export function githubGrilleLedger(result, env = process.env) {
  const token = env.GRILLE_GITHUB_TOKEN || env.GITHUB_TOKEN || "";
  const line = JSON.stringify({
    at: new Date().toISOString(),
    product: "grille",
    session: result.session,
    verdict: result.verdict,
    permissionMode: result.permissionMode || "",
    bypassDirectivePresent: Boolean(result.bypassDirectivePresent),
    toolUsed: result.toolUsed || "",
    bashWriteCapable: Boolean(result.bashWriteCapable),
    editWriteUsed: Boolean(result.editWriteUsed),
    diffWouldRender: Boolean(result.diffWouldRender),
    preToolUseEditWriteWouldFire: Boolean(result.preToolUseEditWriteWouldFire),
    windowsPlatform: Boolean(result.windowsPlatform),
    heredocPrescribed: Boolean(result.heredocPrescribed),
    writeFailedOrTruncated: Boolean(result.writeFailedOrTruncated),
    allowlistBashWrite: Boolean(result.allowlistBashWrite),
    claudeMdOverrideOnly: Boolean(result.claudeMdOverrideOnly),
    noSettingToggle: Boolean(result.noSettingToggle),
    acceptEditsRestored: Boolean(result.acceptEditsRestored),
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
      summary: "Would open a GitHub grille-ledger issue. Demo: no token.",
      line,
    };
  }

  return {
    adapter: "github",
    mode: "live",
    ok: null,
    summary: "Would open a GitHub grille-ledger issue.",
    tokenPresent: true,
    line,
  };
}

export function linearGrilleTicket(result, env = process.env) {
  const key = env.GRILLE_LINEAR_KEY || env.LINEAR_API_KEY || "";
  const loss = isLinear(result);
  const title = `grille ${result.verdict} · Grille · ${result.source || "desk"}`.trim();
  const description = [
    "Grille scored a desk because a night drop through the slot is not a hold.",
    "",
    headline(result),
    "",
    `session: ${result.session || "-"}`,
    `mode: ${result.permissionMode || "—"}`,
    `tool: ${result.toolUsed || "—"}`,
    `bypass directive: ${result.bypassDirectivePresent ? "yes" : "no"}`,
    `bash write: ${result.bashWriteCapable ? "yes" : "no"}`,
    `edit/write: ${result.editWriteUsed ? "yes" : "no"}`,
    `diff would render: ${result.diffWouldRender ? "yes" : "no"}`,
    `Write|Edit hooks: ${result.preToolUseEditWriteWouldFire ? "yes" : "no"}`,
    "",
    loss
      ? "Slotted, steered, unhooked, or killed: file mutation left the audited Edit/Write path. Diffs, hooks, and deny rules went blind, or a Windows heredoc write died."
      : "Not a slotted / steered / unhooked / killed desk. Linear stays quiet.",
    "",
    "Evidence (do not invent more): anthropics/claude-code#90599. Same-class #90597 (Windows ungated heredoc) #89251 (PreToolUse Write|Edit never called; #63786 predecessor; #87575 rewind; referenced by #89716) #85511 (Bash python/sed allowlist) #29709 (Edit blocked then Bash python) #31292 (disallowedTools Write/Edit bypassed). NOT Stencil / Hasp / Coda / Veto / Tappet / Assay / Spile / Scant / Knock / Gasket / Iota / Blot / Wicket / leftover woodworking. openai/codex#10330 #16397 #17899.",
  ].join("\n");

  if (!loss) {
    return {
      adapter: "linear",
      mode: "demo",
      ok: true,
      summary: `Would skip Linear. Verdict ${result.verdict || "posted"} is not slotted / steered / unhooked / killed.`,
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
    slackGrilleAlarm(result, env),
    githubGrilleLedger(result, env),
    linearGrilleTicket(result, env),
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
            ? `Posted ${result.verdict} desk alarm to Slack.`
            : `Slack webhook failed: HTTP ${response.status}`,
        });
        continue;
      }

      if (plan.adapter === "github") {
        const token = env.GRILLE_GITHUB_TOKEN || env.GITHUB_TOKEN;
        const response = await fetchImpl("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: `Grille desk ledger ${result.session || ""}`.trim(),
            public: false,
            files: { "grille-ledger.jsonl": { content: `${plan.line}\n` } },
          }),
        });
        const data = await response.json().catch(() => ({}));
        events.push({
          ...plan,
          at: Date.now(),
          ok: response.ok,
          summary: response.ok
            ? `Wrote private gist grille ledger ${data.id || ""}`.trim()
            : `GitHub gist failed: ${data.message || response.status}`,
        });
        continue;
      }

      if (plan.adapter === "linear") {
        const key = env.GRILLE_LINEAR_KEY || env.LINEAR_API_KEY;
        const teamId = env.GRILLE_LINEAR_TEAM || "";
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
