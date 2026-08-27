#!/usr/bin/env node
/**
 * Hasp PreToolUse hook. Seize a path before Write.
 *
 *   echo '{"action":"write","session":"session-b","path":"src/wip.ts"}' | node index.mjs
 *   node index.mjs --listen 8792
 *
 * Env:
 *   HASP_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   HASP_GITHUB_TOKEN   Gist / comment lease ledger. Absent → demo ledger.
 *   HASP_LINEAR_KEY     Lost-work ticket on clobber. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90146 } from "./hasp.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90146());
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
  return result.verdict === "clobber" || result.verdict === "yield" || result.verdict === "stale";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  const path = result.path || "path";
  return {
    hook_event_name: "PreToolUse",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? result.verdict === "clobber"
            ? `Hasp clobber. Another session holds ${path}. Write denied.`
            : result.verdict === "stale"
              ? `Hasp stale. expectedHash drifted on ${path}. Hash unchanged.`
              : `Hasp yield. Live lease on ${path} held by ${result.holder || "another session"}.`
          : result.verdict === "seized"
            ? `Hasp seized. ${result.session || "session"} holds ${path}.`
            : `Hasp loose. Path is free.`,
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

export function listen(port = 8792) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "hasp",
        hook: "PreToolUse",
        verbs: "loose|seized|yield|stale|clobber",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a lease action { action, session, path, expectedHash?, nextHash?, board? }." });
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
    process.stderr.write(`hasp hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8792);
    listen(Number.isFinite(port) ? port : 8792);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
