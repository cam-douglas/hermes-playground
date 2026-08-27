import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

test("hook source documents env and PermissionRequest shape", () => {
  const src = readFileSync(join(here, "index.mjs"), "utf8");
  assert.match(src, /KNOCK_URL/);
  assert.match(src, /KNOCK_HOOK_SECRET/);
  assert.match(src, /permission-request/);
});

test("hook denies loud when Knock is unreachable", async () => {
  const child = spawn(process.execPath, [join(here, "index.mjs")], {
    env: { ...process.env, KNOCK_URL: "http://127.0.0.1:9" },
  });
  child.stdin.end(
    JSON.stringify({
      hook_event_name: "PermissionRequest",
      tool_name: "Bash",
      tool_input: { command: "true" },
      session_id: "run_test",
    }),
  );
  const out = await new Promise((resolve, reject) => {
    const chunks = [];
    child.stdout.on("data", (c) => chunks.push(c));
    child.on("exit", (code) => {
      if (code !== 0) reject(new Error(`exit ${code}`));
      else resolve(Buffer.concat(chunks).toString("utf8"));
    });
    child.on("error", reject);
  });
  const parsed = JSON.parse(out);
  assert.equal(parsed.permissionDecision, "deny");
  assert.equal(parsed.hookSpecificOutput.decision.behavior, "deny");
});
