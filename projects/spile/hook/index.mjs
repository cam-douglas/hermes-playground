#!/usr/bin/env node
/**
 * Spile tap hook. An open spile is not a hold.
 * Score the tap or admit bunged.
 *
 *   echo '{"pipeOpen":true,"eofDelivered":false}' | node index.mjs
 *   node index.mjs spile.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   SPILE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SPILE_GITHUB_TOKEN   Spile-ledger issue. Absent → demo ledger.
 *   SPILE_LINEAR_KEY     Wedge / hours-held / timeout-ignored / open-pipe ticket. Absent → demo row.
 *
 * NOT Sounder / Tappet / Quench / Leat /
 * Ullage / Bollard / Clew / leftover
 * woodworking. Idle word is bunged, never
 * the product name, never empty, never
 * silent / mute / idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedWedge } from "./spile.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedWedge());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedWedge();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.spile ||
        parsed.probe ||
        parsed.pipeOpen != null ||
        parsed.eofDelivered != null ||
        parsed.observedBlockSec != null ||
        parsed.declaredTimeoutSec != null)
    ) {
      return parsed.action || parsed.spile || parsed.probe
        ? parsed
        : { action: "score", spile: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", spile: { session: "stdin", scored: true } };
    }
  } catch {
    const spile = parseSessionTrace(text);
    if (
      spile.pipeOpen ||
      spile.observedBlockSec ||
      spile.statusMessageStuck ||
      spile.selfTimeoutWrapped
    ) {
      return { action: "score", spile };
    }
    return { error: "unparseable", raw: text };
  }
  const spile = parseSessionTrace(text);
  return { action: "score", spile };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "wedge") {
    return "Spile wedge. Pipe open no EOF for hours; declared timeout 5s ignored; session frozen on hook statusMessage; notifications held. An open spile is not a hold.";
  }
  if (result.verdict === "hours-held") {
    return "Spile hours-held. ~8h first freeze / ~1.5h second. Pipe stayed open without EOF.";
  }
  if (result.verdict === "timeout-ignored") {
    return "Spile timeout-ignored. settings.json declares timeout 5. Hook lives >> 5s. Parent did not kill.";
  }
  if (result.verdict === "open-pipe") {
    return "Spile open-pipe. Stdin pipe kept open. No EOF yet.";
  }
  if (result.verdict === "no-eof") {
    return "Spile no-eof. Measured probe blocks exactly as long as the pipe stays open.";
  }
  if (result.verdict === "script-alive") {
    return "Spile script-alive. Hook process not terminated by parent.";
  }
  if (result.verdict === "parent-blind") {
    return "Spile parent-blind. Parent does not enforce timeout while blocked on stdin.";
  }
  if (result.verdict === "unretracted") {
    return "Spile unretracted. statusMessage of hook stuck in spinner. Notifications queued behind the wedge.";
  }
  return "Spile refuse. An open spile is not a hold.";
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
          : "Spile bunged. Spile seated. Payload delivered with EOF. Declared timeout armed. Idle word is bunged.",
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
        product: "spile",
        hook: "UserPromptSubmit",
        verbs: "bunged|open-pipe|no-eof|timeout-ignored|wedge|hours-held|script-alive|parent-blind|self-timeout|unretracted",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a spile action { action, spile? }." });
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
    process.stderr.write(`spile hook listening on http://127.0.0.1:${port}\n`);
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
