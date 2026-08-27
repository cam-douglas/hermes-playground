#!/usr/bin/env node
/**
 * Reed PreToolUse hook. Four contacts on every MCP. Connected is not registered.
 *
 *   echo '{"action":"probe","cabinet":{"reeds":[...]}}' | node index.mjs
 *   node index.mjs --listen 8794
 *
 * Env:
 *   REED_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   REED_GITHUB_TOKEN   Gist / comment reed ledger. Absent → demo ledger.
 *   REED_LINEAR_KEY     Reseat ticket on alarm. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed83838 } from "./reed.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed83838());
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
          ? result.verdict === "leak"
            ? "Reed leak. Respawned stdio did not re-register tools. Process may still be alive."
            : result.verdict === "chatter"
              ? "Reed chatter. One served call is not a hold. Tools are gone for the rest of the session."
              : result.verdict === "drop"
                ? "Reed drop. Remote connectors fell as a group. Local stdio is not a substitute."
                : "Reed stuck. Handshake without listed or callable. Connected is not registered."
          : result.verdict === "set"
            ? "Reed set. All four contacts hold."
            : "Reed open. Empty cabinet. Idle word is open.",
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

export function listen(port = 8794) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "reed",
        hook: "PreToolUse",
        verbs: "open|set|stuck|chatter|leak|drop",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a cabinet action { action, cabinet? }." });
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
    process.stderr.write(`reed hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8794);
    listen(Number.isFinite(port) ? port : 8794);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
