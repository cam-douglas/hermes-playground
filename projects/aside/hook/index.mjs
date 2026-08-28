#!/usr/bin/env node
/**
 * Aside wing-ledger hook. A preamble is not an answer.
 * Score the side channel or admit heard.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9314
 *
 * Env:
 *   ASIDE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   ASIDE_GITHUB_TOKEN   Aside-ledger issue. Absent → demo ledger.
 *   ASIDE_LINEAR_KEY     Preamble/poisoned ticket. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90314Preamble } from "./aside.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90314Preamble());
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
  if (result.verdict === "preamble") {
    return "Aside preamble. Short text then silent end. A preamble is not an answer.";
  }
  if (result.verdict === "muted") {
    return "Aside muted. Any text suppressed the tool-notice.";
  }
  if (result.verdict === "poisoned") {
    return "Aside poisoned. Prior truncation stuck; later /btw also fails.";
  }
  if (result.verdict === "toolish") {
    return "Aside toolish. Model attempted a tool in the side channel.";
  }
  if (result.verdict === "inherited") {
    return "Aside inherited. Tool-first CLAUDE.md / SessionStart infected the wing.";
  }
  if (result.verdict === "ghost") {
    return "Aside ghost. /btw left no transcript artifact.";
  }
  if (result.verdict === "sticky") {
    return "Aside sticky. Session-wide all-or-nothing: every later /btw fails.";
  }
  if (result.verdict === "forked") {
    return "Aside forked. Fork on completed /btw re-submits the original.";
  }
  return "Aside refuse. A preamble is not an answer.";
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
          : "Aside heard. Real side answer landed. Idle word is heard.",
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

export function listen(port = 9314) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "aside",
        hook: "SessionStart",
        verbs: "heard|preamble|muted|poisoned|toolish|inherited|ghost|sticky|noticed|forked",
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
    process.stderr.write(`aside hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9314);
    listen(Number.isFinite(port) ? port : 9314);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
