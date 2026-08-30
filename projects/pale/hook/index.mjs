#!/usr/bin/env node
/**
 * Pale jurisdiction-fence hook. A
 * session beyond the pale is not
 * a hold. Score the fence or
 * admit bound.
 *
 *   echo '{"startedAboveRepo":true}' | node index.mjs
 *   node index.mjs pale.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   PALE_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   PALE_GITHUB_TOKEN  Pale-ledger. Absent → demo ledger.
 *   PALE_LINEAR_KEY    Fence ticket. Absent → demo row.
 *
 * NOT Chatelaine / Waif / Berth /
 * leftover woodworking.
 * Idle word is bound, never the
 * product name, never empty, never
 * girt / sheltered / alongside.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parsePaleJson, seedBeyond } from "./pale.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedBeyond());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBeyond();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.pale ||
        parsed.probe ||
        parsed.intake ||
        parsed.fence ||
        parsed.settingsPresentOnDisk != null ||
        parsed.sessionProjectRoot != null ||
        parsed.rootsMatch != null)
    ) {
      return parsed.action || parsed.pale || parsed.probe || parsed.intake || parsed.fence
        ? parsed
        : { action: "score", pale: parsePaleJson(parsed) };
    }
  } catch {
    const pale = parsePaleJson(text);
    if (pale.settingsPresentOnDisk != null || pale.startedAboveRepo != null) {
      return { action: "score", pale };
    }
    return { error: "unparseable", raw: text };
  }
  const pale = parsePaleJson(text);
  return { action: "score", pale };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "beyond") {
    return "Pale beyond. Started outside the repo that holds .claude/settings.json. Hooks silently absent.";
  }
  if (result.verdict === "unhooked") {
    return "Pale unhooked. Settings file present on disk. Zero hooks armed in the session.";
  }
  if (result.verdict === "rootless") {
    return "Pale rootless. Project root resolution missed the settings-bearing directory.";
  }
  if (result.verdict === "silent") {
    return "Pale silent. No misconfiguration warning at session start.";
  }
  if (result.verdict === "above") {
    return "Pale above. Session started in a parent of the repo that holds settings.";
  }
  if (result.verdict === "subdir") {
    return "Pale subdir. Launched from a package subdirectory. Zero project hooks.";
  }
  if (result.verdict === "walkless") {
    return "Pale walkless. Loader never walks up to find .claude/settings.json.";
  }
  if (result.verdict === "fail-open") {
    return "Pale fail-open. A write proceeded without the hook that should have blocked it.";
  }
  return "Pale refuse. A session beyond the pale is not a hold.";
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
          : "Pale bound. Session project root matches the settings dir. Hooks armed. Idle word is bound.",
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
        product: "pale",
        hook: "UserPromptSubmit",
        verbs: "bound|beyond|unhooked|rootless|silent|above|subdir|walkless|fail-open|off-pale",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a pale action { action, pale? }." });
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
    process.stderr.write(`pale hook listening on http://127.0.0.1:${port}\n`);
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
