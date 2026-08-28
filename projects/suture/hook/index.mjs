#!/usr/bin/env node
/**
 * Suture PostToolUse hook. A partial turn is not a hold. Stitch at the last complete tool boundary.
 *
 *   echo '{"action":"mark","tray":{...}}' | node index.mjs
 *   node index.mjs --listen 8950
 *
 * Env:
 *   SUTURE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SUTURE_GITHUB_TOKEN   Private gist suture-ledger.jsonl. Absent → demo ledger.
 *   SUTURE_LINEAR_KEY     Unrecovered-tear ticket on alarm. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed46987 } from "./suture.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed46987());
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
  if (result.verdict === "partial") {
    return "Suture partial. Idle timeout or incomplete tool_result. A partial turn is not a hold.";
  }
  if (result.verdict === "stalled") {
    return "Suture stalled. Events stopped with no message_stop. The connection is still open.";
  }
  if (result.verdict === "torn") {
    return "Suture torn. Connection closed mid-response. The last complete tool boundary is the only safe suture point.";
  }
  return "Suture alarm. Tear at the stream. Stitch at the last complete tool boundary.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PostToolUse",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Suture sealed. No unrecovered tear. Idle word is sealed.",
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

export function listen(port = 8950) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "suture",
        hook: "PostToolUse",
        verbs: "sealed|torn|stalled|partial|resumed|discarded",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a tray action { action, tray? }." });
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
    process.stderr.write(`suture hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8950);
    listen(Number.isFinite(port) ? port : 8950);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
