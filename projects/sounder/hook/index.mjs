#!/usr/bin/env node
/**
 * Sounder desk hook. A completed waiter is not a hold.
 * Score the sounder or admit keyed.
 *
 *   echo '{"waiterCompleted":true,"sessionReinvoked":false}' | node index.mjs
 *   node index.mjs sounder.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   SOUNDER_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SOUNDER_GITHUB_TOKEN   Sounder-ledger issue. Absent → demo ledger.
 *   SOUNDER_LINEAR_KEY     Muted / stalled ticket. Absent → demo row.
 *
 * NOT Leat / Fusee / Cotter / Reveille / Shunt / Husk /
 * Binnacle / Pirn / leftover woodworking. Idle word is
 * keyed, never the product name, never empty, never
 * silent / mute / idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedMuted } from "./sounder.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedMuted());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedMuted();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.sounder ||
        parsed.probe ||
        parsed.waiterCompleted != null ||
        parsed.notificationDelivered != null ||
        parsed.sessionReinvoked != null ||
        parsed.waiterIds != null)
    ) {
      return parsed.action || parsed.sounder || parsed.probe
        ? parsed
        : { action: "score", sounder: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", sounder: { session: "stdin", scored: true } };
    }
  } catch {
    const sounder = parseSessionTrace(text);
    if (sounder.waiterCompleted || sounder.sessionReinvoked || sounder.waiterIds?.length) {
      return { action: "score", sounder };
    }
    return { error: "unparseable", raw: text };
  }
  const sounder = parseSessionTrace(text);
  return { action: "score", sounder };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "muted") {
    return "Sounder muted. Waiter completed; notification never re-invoked the session. A completed waiter is not a hold.";
  }
  if (result.verdict === "stalled") {
    return "Sounder stalled. Session sat idle for hours after waiter exit until human input.";
  }
  if (result.verdict === "orphaned") {
    return "Sounder orphaned. Waiter IDs exist; no wake attached.";
  }
  if (result.verdict === "deaf") {
    return "Sounder deaf. Session still present but never heard the click.";
  }
  if (result.verdict === "dropped") {
    return "Sounder dropped. Notification enqueued but never delivered.";
  }
  if (result.verdict === "stranded") {
    return "Sounder stranded. Idle teammate never woken by Monitor/background-task notifications.";
  }
  if (result.verdict === "cut") {
    return "Sounder cut. Headless (-p) kills run_in_background at turn end; no notification loop.";
  }
  if (result.verdict === "armed") {
    return "Sounder armed. Resume auto-fires armed background work before any input.";
  }
  return "Sounder refuse. A completed waiter is not a hold.";
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
          : "Sounder keyed. Waiter armed. Notification path live. Idle word is keyed.",
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
        product: "sounder",
        hook: "UserPromptSubmit",
        verbs: "keyed|muted|stalled|orphaned|relayed|deaf|armed|dropped|stranded|cut",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a sounder action { action, sounder? }." });
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
    process.stderr.write(`sounder hook listening on http://127.0.0.1:${port}\n`);
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
