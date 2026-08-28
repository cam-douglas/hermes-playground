#!/usr/bin/env node
/**
 * Chute inbound-ledger hook. A typed secret is not a handoff.
 * Drop it through the chute. Name the class or admit clear.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9030
 *
 * Env:
 *   CHUTE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   CHUTE_GITHUB_TOKEN   Chute-ledger issue. Absent → demo ledger.
 *   CHUTE_LINEAR_KEY     Burned/echoed ticket. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90301Gap } from "./chute.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90301Gap());
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
  if (result.verdict === "typed") {
    return "Chute typed. Secret pasted into the chat prompt. A typed secret is not a handoff.";
  }
  if (result.verdict === "burned") {
    return "Chute burned. Live credential already written into transcript/history/paste-cache.";
  }
  if (result.verdict === "echoed") {
    return "Chute echoed. Model printed the secret despite never-print-secrets.";
  }
  if (result.verdict === "retained") {
    return "Chute retained. Secret would reach /bug or feedback five-year retention.";
  }
  if (result.verdict === "leaked") {
    return "Chute leaked. .env / credential file read straight into transcript.";
  }
  if (result.verdict === "gap") {
    return "Chute gap. No AskUserSecret tool. Only the prompt box exists.";
  }
  return "Chute refuse. A typed secret is not a handoff.";
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
          : "Chute clear. No secret on the leaky prompt path. Idle word is clear.",
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

export function listen(port = 9030) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "chute",
        hook: "SessionStart",
        verbs: "clear|typed|masked|burned|echoed|retained|brokered|vaulted|leaked|gap",
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
    process.stderr.write(`chute hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9030);
    listen(Number.isFinite(port) ? port : 9030);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
