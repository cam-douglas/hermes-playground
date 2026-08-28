#!/usr/bin/env node
/**
 * Chad ballot hook. A reported selection is not a hold.
 * Score the ballot or admit spoilt.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9050
 *
 * Env:
 *   CHAD_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   CHAD_GITHUB_TOKEN   Chad-ledger issue. Absent → demo ledger.
 *   CHAD_LINEAR_KEY     False-consent ticket. Absent → demo row.
 *
 * NOT Knock / Damper / Parity / Kist / Wraith / Gasket /
 * leftover woodworking. Phantom AskUserQuestion selection
 * treated as consent. Idle word is spoilt, never the product
 * name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90407Punched } from "./chad.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90407Punched());
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
  if (result.verdict === "punched") {
    return "Chad punched. AskUserQuestion reported an option the user never chose. A reported selection is not a hold.";
  }
  if (result.verdict === "carried") {
    return "Chad carried. Assistant acted on the reported option. Side effect landed.";
  }
  if (result.verdict === "miscast") {
    return "Chad miscast. Enter or focus-click submitted the highlighted Recommended option.";
  }
  if (result.verdict === "phantom") {
    return "Chad phantom. Result looks like a genuine human answer. Provenance is missing.";
  }
  if (result.verdict === "forced") {
    return "Chad forced. Mid-turn message auto-resolved the question to the highlighted option.";
  }
  return "Chad refuse. A reported selection is not a hold.";
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
          : "Chad spoilt. Spoilt ballot. Nothing scored. Idle word is spoilt.",
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

export function listen(port = 9050) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "chad",
        hook: "UserPromptSubmit",
        verbs: "spoilt|punched|blank|carried|miscast|phantom|rubbered|forced|defaulted|clear",
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
    process.stderr.write(`chad hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9050);
    listen(Number.isFinite(port) ? port : 9050);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
