#!/usr/bin/env node
/**
 * Tappet valve-train hook. A fired hook is not a seated injection.
 * Score the spawn or admit seated.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9296
 *
 * Env:
 *   TAPPET_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   TAPPET_GITHUB_TOKEN   Tappet-ledger issue. Absent → demo ledger.
 *   TAPPET_LINEAR_KEY     Missed/slipped/inert ticket. Absent → demo row.
 *
 * NOT Fathom / Reed / Coda / Aside / Suture / Knock / Husk / Chute / Scrim.
 * Hook-injection path: process spawn vs additionalContext seating vs
 * telemetry vs UI render. Idle word is seated, never the product name.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90296Missed } from "./tappet.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90296Missed());
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
  if (result.verdict === "missed") {
    return "Tappet missed. Mid-turn send never spawned the hook process.";
  }
  if (result.verdict === "slipped") {
    return "Tappet slipped. Hook ran; additionalContext never reached the transcript.";
  }
  if (result.verdict === "folded") {
    return "Tappet folded. Message merged into the still-running previous turn.";
  }
  if (result.verdict === "mute") {
    return "Tappet mute. Client log has zero hook-execution telemetry.";
  }
  if (result.verdict === "oversize") {
    return "Tappet oversize. Hook output over 10K silently dropped from context.";
  }
  if (result.verdict === "misfiled") {
    return "Tappet misfiled. SessionStart additionalContext redelivered as origin:human.";
  }
  if (result.verdict === "inert") {
    return "Tappet inert. Hook logged as succeeded but never injected.";
  }
  if (result.verdict === "wave") {
    return "Tappet wave. Contiguous multi-message loss window that then self-recovered.";
  }
  return "Tappet refuse. A fired hook is not a seated injection.";
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
          : "Tappet seated. Hook spawned and additionalContext landed in the transcript. Idle word is seated.",
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

export function listen(port = 9296) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "tappet",
        hook: "UserPromptSubmit",
        verbs: "seated|missed|slipped|folded|mute|oversize|misfiled|inert|blind|wave",
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
    process.stderr.write(`tappet hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9296);
    listen(Number.isFinite(port) ? port : 9296);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
