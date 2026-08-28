#!/usr/bin/env node
/**
 * Sigil PostToolUse hook. Hollow or unsigned thinking is not a hold. Strip the seal.
 *
 *   echo '{"action":"mark","desk":{...}}' | node index.mjs
 *   node index.mjs --listen 9050
 *
 * Env:
 *   SIGIL_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SIGIL_GITHUB_TOKEN   Private gist sigil-ledger.jsonl. Absent → demo ledger.
 *   SIGIL_LINEAR_KEY     Wedged-session incident. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed63147 } from "./sigil.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed63147());
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
  if (result.verdict === "hollow") {
    return "Sigil hollow. Empty thinking text with a retained signature. Replay will 400 cannot-be-modified.";
  }
  if (result.verdict === "unsigned") {
    return "Sigil unsigned. Empty thinking with no signature. Replay will 400 thinking.signature Field required.";
  }
  if (result.verdict === "wedged") {
    return "Sigil wedged. Session already looping 400 cannot-be-modified / signature Field required.";
  }
  return "Sigil alarm. Hollow or unsigned thinking bricks resume. Strip or quarantine.";
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
          : "Sigil valid. Thinking blocks absent or text+signature consistent. Idle word is valid.",
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

export function listen(port = 9050) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "sigil",
        hook: "PostToolUse",
        verbs: "valid|hollow|unsigned|wedged|stripped|resume-safe",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a desk action { action, desk? }." });
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
    process.stderr.write(`sigil hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9050);
    listen(Number.isFinite(port) ? port : 9050);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
