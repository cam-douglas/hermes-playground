#!/usr/bin/env node
/**
 * Ambo card hook. The pulpit spoke;
 * the nave never heard. Score the
 * card or admit unheard.
 *
 *   echo '{"hookEvent":"PermissionRequest","tool":"ExitPlanMode"}' | node index.mjs
 *   node index.mjs ambo.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   AMBO_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   AMBO_GITHUB_TOKEN  Ambo-ledger. Absent → demo ledger.
 *   AMBO_LINEAR_KEY    Card ticket. Absent → demo row.
 *
 * NOT Slype / Tally / Pale /
 * Chatelaine / Waif / Berth /
 * Carrel / Cotter / leftover
 * woodworking. Idle word is unheard,
 * never the product name, never
 * empty, never passed / squared /
 * bound / girt / sheltered.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseAmboJson, seedLoggedSuccess } from "./ambo.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedLoggedSuccess());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedLoggedSuccess();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.ambo ||
        parsed.probe ||
        parsed.intake ||
        parsed.card ||
        parsed.hookEvent ||
        parsed.systemMessage ||
        parsed.tool ||
        parsed.rendered != null ||
        parsed.hookLogSuccess != null)
    ) {
      return parsed.action || parsed.ambo || parsed.probe || parsed.intake || parsed.card
        ? parsed
        : { action: "score", ambo: parseAmboJson(parsed) };
    }
  } catch {
    const ambo = parseAmboJson(text);
    if (ambo.hookEvent || ambo.systemMessage || ambo.rendered != null) {
      return { action: "score", ambo };
    }
    return { error: "unparseable", raw: text };
  }
  const ambo = parseAmboJson(text);
  return { action: "score", ambo };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "logged-success") {
    return "Ambo logged-success. PermissionRequest systemMessage accepted and logged as success. ExitPlanMode Ready-to-code card stays blank.";
  }
  if (result.verdict === "plan-card") {
    return "Ambo plan-card. ExitPlanMode Ready-to-code approval card never shows the pulpit.";
  }
  if (result.verdict === "silent-surface") {
    return "Ambo silent-surface. No surface (TUI and VS Code) renders the systemMessage.";
  }
  if (result.verdict === "tui-blank") {
    return "Ambo tui-blank. Terminal TUI approval card stays blank.";
  }
  if (result.verdict === "vscode-blank") {
    return "Ambo vscode-blank. VS Code approval card stays blank.";
  }
  if (result.verdict === "decision-free") {
    return "Ambo decision-free. Inform-only systemMessage with no allow/deny decision.";
  }
  if (result.verdict === "terminal-sequence-ok") {
    return "Ambo terminal-sequence-ok. OSC/BEL reaches the user. Display path missing.";
  }
  if (result.verdict === "docs-all-hooks") {
    return "Ambo docs-all-hooks. Docs claim all hooks display systemMessage.";
  }
  if (result.verdict === "deferred-path") {
    return "Ambo deferred-path. Result never reaches the renderer other hook events use.";
  }
  return "Ambo refuse. The pulpit spoke; the nave never heard.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PermissionRequest",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Ambo unheard. systemMessage actually rendered on the approval card. Idle word is unheard.",
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
        product: "ambo",
        hook: "PermissionRequest",
        verbs:
          "unheard|logged-success|plan-card|silent-surface|tui-blank|vscode-blank|decision-free|terminal-sequence-ok|docs-all-hooks|deferred-path",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST an ambo action { action, ambo? }." });
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
    process.stderr.write(`ambo hook listening on http://127.0.0.1:${port}\n`);
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
