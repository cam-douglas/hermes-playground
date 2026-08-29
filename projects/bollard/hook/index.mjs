#!/usr/bin/env node
/**
 * Bollard pier hook. A slack hawser is not a hold.
 * Score the bollard or admit belayed.
 *
 *   echo '{"supervisorGapSec":10.5,"envDeleted":true}' | node index.mjs
 *   node index.mjs bollard.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   BOLLARD_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   BOLLARD_GITHUB_TOKEN   Bollard-ledger issue. Absent → demo ledger.
 *   BOLLARD_LINEAR_KEY     Orphaned / gap-fatal / sessions-dead / poll-401 ticket. Absent → demo row.
 *
 * NOT Clew / Sounder / Reveille / Cote /
 * Binnacle / Hasp / Wicket / Parity / leftover
 * woodworking. Idle word is belayed, never the
 * product name, never empty, never silent / mute /
 * idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedOrphaned } from "./bollard.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedOrphaned());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedOrphaned();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.bollard ||
        parsed.probe ||
        parsed.supervisorGapSec != null ||
        parsed.envDeleted != null ||
        parsed.poll401 != null ||
        parsed.sessionsUnresumable != null)
    ) {
      return parsed.action || parsed.bollard || parsed.probe
        ? parsed
        : { action: "score", bollard: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", bollard: { session: "stdin", scored: true } };
    }
  } catch {
    const bollard = parseSessionTrace(text);
    if (
      bollard.supervisorGapSec ||
      bollard.envDeleted ||
      bollard.poll401 ||
      bollard.sessionsUnresumable
    ) {
      return { action: "score", bollard };
    }
    return { error: "unparseable", raw: text };
  }
  const bollard = parseSessionTrace(text);
  return { action: "score", bollard };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "orphaned") {
    return "Bollard orphaned. ~10–11s gap; environment cleaned up; 14 sessions unresumable; mobile environment deleted. A slack hawser is not a hold.";
  }
  if (result.verdict === "gap-fatal") {
    return "Bollard gap-fatal. Supervisor absence ≥~10s. Server GC'd the environment.";
  }
  if (result.verdict === "sessions-dead") {
    return "Bollard sessions-dead. Shutting down N active sessions on supervisor exit.";
  }
  if (result.verdict === "poll-401") {
    return "Bollard poll-401. Authentication failed 401 on poll. Supervisor tore down all sessions. Same credentials worked after restart.";
  }
  if (result.verdict === "offline-lie") {
    return "Bollard offline-lie. Server said the machine was offline while the supervisor was alive and journaling.";
  }
  if (result.verdict === "mem-thrash") {
    return "Bollard mem-thrash. 24.2 GiB RSS + 2.4 GiB swap. Still logging. Missed poll deadlines.";
  }
  if (result.verdict === "cred-stale") {
    return "Bollard cred-stale. Running process held an expired token. On-disk credentials were fine.";
  }
  if (result.verdict === "reattach-denied") {
    return "Bollard reattach-denied. Restart told to start a fresh environment. Cannot re-attach by environment ID.";
  }
  return "Bollard refuse. A slack hawser is not a hold.";
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
          : "Bollard belayed. Made fast to the bollard. Environment retained. Idle word is belayed.",
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

export function listen(port = 9090) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "bollard",
        hook: "UserPromptSubmit",
        verbs: "belayed|gap-short|gap-fatal|poll-401|orphaned|sessions-dead|cred-stale|mem-thrash|offline-lie|reattach-denied",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a bollard action { action, bollard? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`bollard hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9090);
    listen(Number.isFinite(port) ? port : 9090);
  } else {
    const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
    let payload;
    if (fileArg) {
      payload = parsePayload(readFileSync(fileArg, "utf8"));
    } else {
      payload = await readStdin();
    }
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
