#!/usr/bin/env node
/**
 * Reveille muster hook. POST a roster snapshot, get clear | hold | orphan.
 *
 *   echo '{"session":"compact-90036"}' | node index.mjs
 *   node index.mjs --listen 8790
 *
 * Env:
 *   REVEILLE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   REVEILLE_GITHUB_TOKEN   Gist / comment muster ledger. Absent → demo ledger.
 *   REVEILLE_LINEAR_KEY     Orphan ticket on missed heartbeat. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seedCollision } from "./muster.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({ ...seedCollision(), action: "snapshot" });
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
  return result.decision === "hold" || result.decision === "orphan";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "MusterCheck",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "MusterCheck",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? result.decision === "hold"
            ? `Reveille hold. Duplicate dispatch on ${result.snapshot.collision?.existing?.artifact || "claimed artifact"}. Roster still live.`
            : `Reveille orphan. Missed heartbeat on ${result.orphans.map((row) => row.id).join(", ") || "unknown"}. Do not re-dispatch.`
          : `Reveille ${result.state}. Clear. ${result.snapshot.roster.length} claimed, compact×${result.snapshot.compactionCount}.`,
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

export function listen(port = 8790) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "reveille",
        hook: "MusterCheck",
        verbs: "clear|hold|orphan",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a muster snapshot { roster, action? }." });
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
    process.stderr.write(`reveille hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8790);
    listen(Number.isFinite(port) ? port : 8790);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
