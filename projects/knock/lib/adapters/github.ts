import { createSign } from "node:crypto";
import { githubLedgerBody } from "../core.mjs";
import type { AdapterEvent, KnockRecord } from "../types";

function configured() {
  return Boolean(
    (process.env.GITHUB_TOKEN || (process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY)) &&
      process.env.GITHUB_OWNER &&
      process.env.GITHUB_REPO,
  );
}

function appJwt() {
  const appId = process.env.GITHUB_APP_ID;
  const pem = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!appId || !pem) return null;
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iat: now - 30, exp: now + 540, iss: appId })).toString("base64url");
  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(pem, "base64url");
  return `${header}.${payload}.${sig}`;
}

async function installationToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const jwt = appJwt();
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  if (!jwt || !installationId) return null;
  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { token?: string };
  return data.token || null;
}

async function gh(path: string, init: RequestInit & { token: string }) {
  const { token, ...rest } = init;
  const response = await fetch(`https://api.github.com${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, json: json as Record<string, unknown> };
}

function repoPath() {
  return `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`;
}

export async function writeGithubLedger(knock: KnockRecord, phase: "open" | "resolve") {
  if (!configured()) {
    const event: AdapterEvent = {
      at: Date.now(),
      adapter: "github",
      mode: "demo",
      summary:
        phase === "open"
          ? `Simulated check-run opened for ${knock.toolName} on run ${knock.runId}.`
          : `Simulated ledger closed: ${knock.status} by ${knock.decidedBy}.`,
    };
    return {
      knock: {
        ...knock,
        githubCheckRunId: knock.githubCheckRunId || `demo-check-${knock.id}`,
        events: [...knock.events, event],
      },
      event,
    };
  }

  const token = await installationToken();
  if (!token) {
    const event: AdapterEvent = {
      at: Date.now(),
      adapter: "github",
      mode: "live",
      ok: false,
      summary: "GitHub credentials present but no usable token.",
    };
    return { knock: { ...knock, events: [...knock.events, event] }, event };
  }

  const headSha = process.env.GITHUB_HEAD_SHA || "";
  const output = {
    title:
      knock.status === "pending"
        ? `Waiting: ${knock.toolName}`
        : `${knock.status}: ${knock.toolName}`,
    summary: githubLedgerBody(knock),
  };

  let checkId = knock.githubCheckRunId;
  if (headSha && phase === "open" && !checkId) {
    const created = await gh(`${repoPath()}/check-runs`, {
      method: "POST",
      token,
      body: JSON.stringify({
        name: `Knock · ${knock.runId}`,
        head_sha: headSha,
        status: "in_progress",
        output,
      }),
    });
    if (created.ok && created.json.id) checkId = String(created.json.id);
  } else if (headSha && checkId && phase === "resolve") {
    await gh(`${repoPath()}/check-runs/${checkId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({
        status: "completed",
        conclusion: knock.status === "allowed" ? "success" : "failure",
        output,
      }),
    });
  }

  let commentId = knock.githubCommentId;
  const pr = process.env.GITHUB_PR_NUMBER;
  if (pr && phase === "open" && !commentId) {
    const created = await gh(`${repoPath()}/issues/${pr}/comments`, {
      method: "POST",
      token,
      body: JSON.stringify({ body: githubLedgerBody(knock) }),
    });
    if (created.ok && created.json.id) commentId = String(created.json.id);
  } else if (pr && commentId && phase === "resolve") {
    await gh(`${repoPath()}/issues/comments/${commentId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ body: githubLedgerBody(knock) }),
    });
  }

  const event: AdapterEvent = {
    at: Date.now(),
    adapter: "github",
    mode: "live",
    ok: true,
    summary:
      phase === "open"
        ? `Wrote grant ledger (check-run ${checkId || "skipped"} / PR comment ${commentId || "skipped"}).`
        : `Updated grant ledger to ${knock.status}.`,
  };
  return {
    knock: {
      ...knock,
      githubCheckRunId: checkId,
      githubCommentId: commentId,
      events: [...knock.events, event],
    },
    event,
  };
}
