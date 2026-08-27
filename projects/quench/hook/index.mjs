#!/usr/bin/env node
/**
 * Quench usage hook. POST a burn snapshot, get continue | kill.
 *
 *   echo '{"sources":{"parent":1000}}' | node index.mjs
 *   node index.mjs --listen 8788
 *
 * Env:
 *   QUENCH_SLACK_WEBHOOK  Incoming webhook. Absent → demo "would post to Slack".
 *   QUENCH_GITHUB_TOKEN   Gist / comment spend ledger. Absent → demo ledger.
 *   QUENCH_LINEAR_KEY     Quota-blown ticket on trip. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seedRunaway } from "./fuse.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({ ...seedRunaway(), action: "snapshot" });
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

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  return {
    hook_event_name: "UsageSnapshot",
    permissionDecision: result.decision === "kill" ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "UsageSnapshot",
      decision: {
        behavior: result.decision === "kill" ? "deny" : "allow",
        message:
          result.decision === "kill"
            ? `Quench tripped. ${result.snapshot.tokens} tok / $${result.snapshot.usd}. In-flight work is cut.`
            : `Quench ${result.state}. Continue. ${result.snapshot.tokens} tok / $${result.snapshot.usd}.`,
        interrupt: result.decision === "kill",
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

export function listen(port = 8788) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, { ok: true, product: "quench", hook: "UsageSnapshot", verbs: "continue|kill" });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a usage snapshot { sources, threshold?, action? }." });
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
    process.stderr.write(`quench hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8788);
    listen(Number.isFinite(port) ? port : 8788);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
