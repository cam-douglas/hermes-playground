#!/usr/bin/env node
/**
 * Blot PostToolUse hook. A bad frame is not a hold. Strip the blot.
 *
 *   echo '{"action":"mark","tray":{...}}' | node index.mjs
 *   node index.mjs --listen 8850
 *
 * Env:
 *   BLOT_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   BLOT_GITHUB_TOKEN   Private gist blot-ledger.jsonl. Absent → demo ledger.
 *   BLOT_LINEAR_KEY     Recovery ticket on alarm. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed24387 } from "./blot.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed24387());
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
  if (result.verdict === "spoof") {
    return "Blot spoof. Claimed image, not an image. Extension-as-image or error text is already baked.";
  }
  if (result.verdict === "heic") {
    return "Blot heic. Unsupported format. HEIC/HEIF kills the session if it stays in history.";
  }
  if (result.verdict === "lfs") {
    return "Blot lfs. Git LFS pointer was Read as an image. The pointer is not pixels.";
  }
  if (result.verdict === "rot") {
    return "Blot rot. Header looks like an image. The API rejected the pixels.";
  }
  if (result.verdict === "replay") {
    return "Blot replay. The poison frame is already in history. Every later turn dies.";
  }
  return "Blot alarm. A bad frame is not a hold.";
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
          : "Blot clear. No poison frames. Idle word is clear.",
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

export function listen(port = 8850) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "blot",
        hook: "PostToolUse",
        verbs: "clear|heic|lfs|spoof|rot|replay",
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
    process.stderr.write(`blot hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8850);
    listen(Number.isFinite(port) ? port : 8850);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
