#!/usr/bin/env node
/**
 * Tain pairing-ledger hook. A silvered tain is not a hold.
 * Face the glass. Name the class or admit paired.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9025
 *
 * Env:
 *   TAIN_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   TAIN_GITHUB_TOKEN   Pairing-ledger issue. Absent → demo ledger.
 *   TAIN_LINEAR_KEY     Stray-browser ticket. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90257Silvered } from "./tain.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90257Silvered());
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
  return Boolean(result.alarm) || result.verdict === "ghost" || result.verdict === "split";
}

function denyMessage(result) {
  if (result.verdict === "silvered") {
    return "Tain silvered. Extension live-renders this session; list_connected_browsers is [].";
  }
  if (result.verdict === "strayed") {
    return "Tain strayed. Actions bind to a browser on another physical machine.";
  }
  if (result.verdict === "ghost") {
    return "Tain ghost. Extension installed, enabled, signed in; MCP tools say not connected.";
  }
  if (result.verdict === "split") {
    return "Tain split. Two native-host manifests claim the same Chrome extension id.";
  }
  return "Tain refuse. A silvered tain is not a hold.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "SessionStart",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Tain paired. Extension claim and agent list name the same live device. Idle word is paired.",
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

export function listen(port = 9025) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "tain",
        hook: "SessionStart",
        verbs: "paired|silvered|ghost|strayed|claimed|nameless|stale|split|dark",
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
    process.stderr.write(`tain hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9025);
    listen(Number.isFinite(port) ? port : 9025);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
