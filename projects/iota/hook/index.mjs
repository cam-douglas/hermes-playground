#!/usr/bin/env node
/**
 * Iota identity hook. A second casing is not a plot.
 * Score the keys or admit bound.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9090
 *
 * Env:
 *   IOTA_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   IOTA_GITHUB_TOKEN   Iota-ledger issue. Absent → demo ledger.
 *   IOTA_LINEAR_KEY     Identity ticket. Absent → demo row.
 *
 * NOT Reed / Gasket / Larder / Leat / Husk / leftover
 * woodworking. One physical directory, many case/slash
 * spellings used as case-sensitive JSON keys. Idle word
 * is bound, never the product name, never empty, never
 * iota / type-case / casing / fold / folded.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90438Split } from "./iota.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90438Split());
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
  if (result.verdict === "split") {
    return "Iota split. Two keys differ only in case for the same directory. A second casing is not a plot.";
  }
  if (result.verdict === "twinned") {
    return "Iota twinned. One directory stored under two or more path spellings.";
  }
  if (result.verdict === "hidden") {
    return "Iota hidden. mcp add wrote one casing; the session read the other; the server is silently absent.";
  }
  if (result.verdict === "unparseable") {
    return "Iota unparseable. ConvertFrom-Json throws DuplicateKeysInJsonString.";
  }
  if (result.verdict === "dropped") {
    return "Iota dropped. Trust or permissions.allow ignored because the casing was not canonicalized.";
  }
  if (result.verdict === "mixed") {
    return "Iota mixed. installed_plugins.json holds mixed-case duplicates.";
  }
  if (result.verdict === "aliased") {
    return "Iota aliased. Same path; only slash direction changes the gate.";
  }
  return "Iota refuse. A second casing is not a plot.";
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
          : "Iota bound. One sort, one drawer. No second casing. Idle word is bound.",
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
        product: "iota",
        hook: "UserPromptSubmit",
        verbs: "bound|split|twinned|hidden|unparseable|dropped|mixed|open|aliased|true",
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
    process.stderr.write(`iota hook listening on http://127.0.0.1:${port}\n`);
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
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
