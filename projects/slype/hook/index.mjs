#!/usr/bin/env node
/**
 * Slype passage hook. A garrison
 * on the roster is not a visiting
 * friar. Score the passage or
 * admit passed.
 *
 *   echo '{"pwshExit":126,"powershellExit":0}' | node index.mjs
 *   node index.mjs slype.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   SLYPE_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   SLYPE_GITHUB_TOKEN  Slype-ledger. Absent → demo ledger.
 *   SLYPE_LINEAR_KEY    Passage ticket. Absent → demo row.
 *
 * NOT Tally / Pale / Chatelaine /
 * Waif / Cotter / leftover
 * woodworking. Idle word is passed,
 * never the product name, never
 * empty, never squared / bound /
 * girt / sheltered / alongside.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSlypeJson, seed126 } from "./slype.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed126());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seed126();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.slype ||
        parsed.probe ||
        parsed.intake ||
        parsed.passage ||
        parsed.pwshPath ||
        parsed.powershellPath ||
        parsed.pwshExit != null ||
        parsed.powershellExit != null)
    ) {
      return parsed.action || parsed.slype || parsed.probe || parsed.intake || parsed.passage
        ? parsed
        : { action: "score", slype: parseSlypeJson(parsed) };
    }
  } catch {
    const slype = parseSlypeJson(text);
    if (slype.pwshExit != null || slype.powershellExit != null) {
      return { action: "score", slype };
    }
    return { error: "unparseable", raw: text };
  }
  const slype = parseSlypeJson(text);
  return { action: "score", slype };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "126") {
    return "Slype 126. Program Files pwsh.exe exits 126 Permission denied. System32 powershell.exe succeeds in the same session.";
  }
  if (result.verdict === "programfiles-denied") {
    return "Slype programfiles-denied. Visiting-friar door 126s. Program Files PowerShell 7 pwsh.exe is the denied path.";
  }
  if (result.verdict === "sandbox") {
    return "Slype sandbox. The block is the sandboxed session, not the OS install.";
  }
  if (result.verdict === "pwsh-dead") {
    return "Slype pwsh-dead. The PowerShell tool targets pwsh 7 and is dead.";
  }
  if (result.verdict === "path-blocked") {
    return "Slype path-blocked. Sandbox restricts subprocesses to system-path binaries. pwsh.exe is not allow-listed.";
  }
  if (result.verdict === "allowlist-miss") {
    return "Slype allowlist-miss. pwsh is missing from the sandbox allow-list / system-path roster.";
  }
  if (result.verdict === "system32-ok") {
    return "Slype system32-ok. Garrison door opens. System32 powershell.exe is not proof pwsh is allowed.";
  }
  if (result.verdict === "powershell-ok") {
    return "Slype powershell-ok. Bash plus powershell.exe works. Contrast, not a hold.";
  }
  return "Slype refuse. A garrison on the roster is not a visiting friar.";
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
          : "Slype passed. pwsh.exe is actually executable in the session. Idle word is passed.",
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
        product: "slype",
        hook: "UserPromptSubmit",
        verbs: "passed|126|system32-ok|programfiles-denied|sandbox|pwsh-dead|powershell-ok|path-blocked|allowlist-miss|msix-store",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a slype action { action, slype? }." });
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
    process.stderr.write(`slype hook listening on http://127.0.0.1:${port}\n`);
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
