#!/usr/bin/env node
/**
 * Binnacle chart hook. A named heading is not a hold.
 * Score the binnacle or admit housed.
 *
 *   echo '{"interactiveTuiStarts":false,"baseUrl":"https://gw"}' | node index.mjs
 *   node index.mjs binnacle.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   BINNACLE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   BINNACLE_GITHUB_TOKEN   Binnacle-ledger issue. Absent → demo ledger.
 *   BINNACLE_LINEAR_KEY     Refused / swung ticket. Absent → demo row.
 *
 * NOT Visa / Husk / Sprag / Reed / Gasket / Tain /
 * leftover woodworking. Idle word is housed, never the
 * product name, never empty, never magnetic / gyro / origin.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedRefused } from "./binnacle.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedRefused());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedRefused();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.binnacle ||
        parsed.probe ||
        parsed.baseUrl != null ||
        parsed.interactiveTuiStarts != null ||
        parsed.headlessPrintWorks != null ||
        parsed.helloToPublic != null)
    ) {
      return parsed.action || parsed.binnacle || parsed.probe
        ? parsed
        : { action: "score", binnacle: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", binnacle: { session: "stdin", scored: true } };
    }
  } catch {
    const binnacle = parseSessionTrace(text);
    if (binnacle.baseUrl || binnacle.interactiveTuiStarts || binnacle.headlessPrintWorks) {
      return { action: "score", binnacle };
    }
    return { error: "unparseable", raw: text };
  }
  const binnacle = parseSessionTrace(text);
  return { action: "score", binnacle };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "refused") {
    return "Binnacle refused. Interactive TUI will not start after ANTHROPIC_BASE_URL is named. A named heading is not a hold.";
  }
  if (result.verdict === "swung") {
    return "Binnacle swung. TUI still probes api.anthropic.com despite a named gyro heading.";
  }
  if (result.verdict === "fatal") {
    return "Binnacle fatal. Same check is fatal in TUI and only advisory in claude -p.";
  }
  if (result.verdict === "split") {
    return "Binnacle split. /api/hello honors BASE_URL; oauth/profile and event_logging do not.";
  }
  if (result.verdict === "blind") {
    return "Binnacle blind. Error names the proxy, never the configured base URL.";
  }
  if (result.verdict === "boxed") {
    return "Binnacle boxed. Deny-by-default sandbox; only legal route is the named gateway.";
  }
  if (result.verdict === "demanded") {
    return "Binnacle demanded. Startup requires a full trusted-TLS HTTP response from the public origin.";
  }
  if (result.verdict === "stripped") {
    return "Binnacle stripped. Injected gateway origin has the path component stripped.";
  }
  return "Binnacle refuse. A named heading is not a hold.";
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
          : "Binnacle housed. Named gyro heading. TUI starts on that origin. Idle word is housed.",
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
        product: "binnacle",
        hook: "UserPromptSubmit",
        verbs: "housed|swung|refused|printed|split|fatal|demanded|blind|boxed|stripped",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a binnacle action { action, binnacle? }." });
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
    process.stderr.write(`binnacle hook listening on http://127.0.0.1:${port}\n`);
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
