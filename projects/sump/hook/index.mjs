#!/usr/bin/env node
/**
 * Sump pit hook. A null path is not a hold.
 * Score the silt or admit drained.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9070
 *
 * Env:
 *   SUMP_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SUMP_GITHUB_TOKEN   Sump-ledger issue. Absent → demo ledger.
 *   SUMP_LINEAR_KEY     Silt ticket. Absent → demo row.
 *
 * NOT Wicket / Scant / Pleat / leftover woodworking. Literal
 * `dev/null/` LFS hook litter during worktree provision.
 * Idle word is drained, never the product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90456Silted } from "./sump.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90456Silted());
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
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "silted") {
    return "Sump silted. Worktree provisioning wrote Git LFS hooks to a literal dev/null/ directory. A null path is not a hold.";
  }
  if (result.verdict === "clogged") {
    return "Sump clogged. Grate packed with all four LFS hook shims.";
  }
  if (result.verdict === "fouled") {
    return "Sump fouled. LFS shims contaminate the literal null pit.";
  }
  if (result.verdict === "littered") {
    return "Sump littered. git status shows untracked dev/null/ clutter.";
  }
  return "Sump refuse. A null path is not a hold.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Sump drained. Sump emptied. No literal dev/null/ litter. Idle word is drained.",
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

export function listen(port = 9070) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "sump",
        hook: "UserPromptSubmit",
        verbs: "drained|silted|clogged|fouled|pooled|diverted|littered|phantom|absolute|hooked",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a probe action { action, probe? }." });
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
    process.stderr.write(`sump hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9070);
    listen(Number.isFinite(port) ? port : 9070);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
