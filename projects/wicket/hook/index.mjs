#!/usr/bin/env node
/**
 * Wicket PreToolUse hook. Isolation is a pin, not a promise.
 * Score the probe against the pinned worktree. Admit (home) or name the class.
 *
 *   echo '{"action":"score","gate":{...}}' | node index.mjs
 *   node index.mjs --listen 9060
 *
 * Env:
 *   WICKET_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   WICKET_GITHUB_TOKEN   Private gist wicket-ledger.jsonl. Absent → demo ledger.
 *   WICKET_LINEAR_KEY     Data-loss incident. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed74726 } from "./wicket.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed74726());
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({ error: "unparseable", raw });
      }
    });
    stdin.on("error", reject);
  });
}

function shouldDeny(result) {
  return Boolean(result.alarm) || Boolean(result.refused && result.verdict !== "home");
}

function denyMessage(result) {
  if (result.verdict === "escape") {
    return "Wicket escape. Absolute path or git mutation resolved outside the pinned worktree.";
  }
  if (result.verdict === "latch") {
    return "Wicket latch. EnterWorktree flipped a session-wide isolation latch. Even pwd is refused.";
  }
  if (result.verdict === "reap") {
    return "Wicket reap. Idle parent reaped a live child's unchanged worktree.";
  }
  if (result.verdict === "swap") {
    return "Wicket swap. Sibling session cwd leaked onto this pin.";
  }
  if (result.verdict === "misbind") {
    return "Wicket misbind. Isolation bound the worktree to the caller's Bash cwd, not the target repo.";
  }
  if (result.verdict === "hijack") {
    return "Wicket hijack. Logical cwd, shell cwd, and guard claim disagree. EnterWorktree last-writer-wins stole this agent's identity.";
  }
  if (result.verdict === "split") {
    return "Wicket split. EnterWorktree reported success but Bash and the guard still pin the parent worktree.";
  }
  return "Wicket refuse. Probe is not home.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PreToolUse",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Wicket home. Path is component-contained in the pinned worktree. Idle word is home.",
        interrupt: deny,
      },
    },
    ...result,
    sinks: sinks.events,
  };
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
  });
  res.end(json);
}

export function listen(port = 9060) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "wicket",
        hook: "PreToolUse",
        verbs: "home|escape|latch|reap|swap|misbind|hijack|split",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a gate action { action, gate? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`wicket hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9060);
    listen(Number.isFinite(port) ? port : 9060);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
