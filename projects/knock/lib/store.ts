import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { seedKnocks } from "./core.mjs";
import type { KnockRecord } from "./types";

type StoreShape = {
  knocks: KnockRecord[];
};

const globalForStore = globalThis as typeof globalThis & {
  __knockMemory?: StoreShape;
};

function onVercel() {
  return Boolean(process.env.VERCEL);
}

function storePath() {
  return process.env.KNOCK_STORE_PATH || join(process.cwd(), "data", "knock-store.json");
}

function emptyStore(): StoreShape {
  return { knocks: [] };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readDisk(): StoreShape {
  const path = storePath();
  try {
    if (!existsSync(path)) return emptyStore();
    const parsed = JSON.parse(readFileSync(path, "utf8")) as StoreShape;
    return { knocks: Array.isArray(parsed.knocks) ? parsed.knocks : [] };
  } catch {
    return emptyStore();
  }
}

function writeDisk(data: StoreShape) {
  const path = storePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function memory() {
  if (!globalForStore.__knockMemory) {
    globalForStore.__knockMemory = { knocks: seedKnocks(Date.now()) as KnockRecord[] };
  }
  return globalForStore.__knockMemory;
}

export function persistenceKind() {
  if (process.env.DATABASE_URL) return "postgres-url-present-unused-fallback-memory";
  if (onVercel()) return "memory";
  return "json-file";
}

export function loadStore(): StoreShape {
  if (onVercel()) return memory();
  const disk = readDisk();
  if (disk.knocks.length === 0) {
    disk.knocks = seedKnocks(Date.now()) as KnockRecord[];
    writeDisk(disk);
  }
  return disk;
}

export function saveStore(data: StoreShape) {
  if (onVercel()) {
    globalForStore.__knockMemory = data;
    return;
  }
  writeDisk(data);
}

export function listKnocks(): KnockRecord[] {
  return clone(loadStore().knocks).sort((a, b) => b.createdAt - a.createdAt);
}

export function getKnock(id: string): KnockRecord | null {
  const found = loadStore().knocks.find((item) => item.id === id);
  return found ? clone(found) : null;
}

export function upsertKnock(record: KnockRecord): KnockRecord {
  const data = loadStore();
  const index = data.knocks.findIndex((item) => item.id === record.id);
  if (index === -1) data.knocks.unshift(record);
  else data.knocks[index] = record;
  saveStore(data);
  return clone(record);
}

export function replaceKnock(id: string, mutator: (current: KnockRecord) => KnockRecord | null) {
  const data = loadStore();
  const index = data.knocks.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const next = mutator(clone(data.knocks[index]));
  if (!next) return clone(data.knocks[index]);
  data.knocks[index] = next;
  saveStore(data);
  return clone(next);
}
