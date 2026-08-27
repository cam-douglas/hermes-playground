#!/usr/bin/env node
/**
 * Coda PostToolUse hook. A last text block is not a hold. Concatenate every block.
 *
 *   echo '{"action":"mark","galley":{...}}' | node index.mjs
 *   node index.mjs --listen 8795
 *
 * Env:
 *   CODA_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   CODA_GITHUB_TOKEN   Private gist coda-ledger.jsonl. Absent → demo ledger.
 *   CODA_LINEAR_KEY     Recovery ticket on alarm. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed81838 } from "./coda.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed81838());
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
  if (result.verdict === "split") {
    return "Coda split. max_tokens cut the turn. Only the last text block reached the parent.";
  }
  if (result.verdict === "snip") {
    return "Coda snip. Delivered is not the whole. A last text block is not a hold.";
  }
  if (result.verdict === "void") {
    return "Coda void. Terminal tool_use. All text lost.";
  }
  if (result.verdict === "swallow") {
    return "Coda swallow. Mid-turn text was never persisted. Cannot splice from JSONL.";
  }
  if (result.verdict === "raw") {
    return "Coda raw. TaskOutput returned JSONL instead of the summary.";
  }
  return "Coda alarm. Delivered is not the whole.";
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
          : "Coda intact. Delivered matches the whole. Idle word is intact.",
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

export function listen(port = 8795) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "coda",
        hook: "PostToolUse",
        verbs: "intact|snip|split|void|swallow|raw",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a galley action { action, galley? }." });
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
    process.stderr.write(`coda hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8795);
    listen(Number.isFinite(port) ? port : 8795);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
