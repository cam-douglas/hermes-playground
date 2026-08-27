/**
 * Blot — darkroom tray for image-poisoned sessions.
 * A bad frame is not a hold. One unreadable image kills every later turn.
 * Inspect every image frame. Score it. Strip the blot.
 * Replace the poison block with a text placeholder so the session can continue.
 * Verdicts: clear | heic | lfs | spoof | rot | replay. Idle word is clear.
 * Not Coda. Not Reed. Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock.
 */

export const VERDICTS = Object.freeze(["clear", "heic", "lfs", "spoof", "rot", "replay"]);
export const IDLE_WORD = "clear";
export const ALARM_VERDICTS = Object.freeze(["heic", "lfs", "spoof", "rot", "replay"]);
export const PLACEHOLDER = "[image removed to fix conversation]";
export const LFS_PREFIX = "version https://git-lfs.github.com/spec/v1";
const REAL_MAGIC = new Set(["png", "jpeg", "jpg", "webp", "gif"]);
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|heic|heif|bmp|tiff?)$/i;

export function emptyTray() {
  return {
    session: "",
    frames: [],
    recovered: false,
    abandoned: false,
    source: "",
    issue: null,
  };
}

export function emptyAction(session = "clear-1") {
  return {
    action: "mark",
    session,
    tray: emptyTray(),
  };
}

function asText(value) {
  return value != null ? String(value) : "";
}

export function cloneFrame(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    path: asText(src.path),
    claimedType: asText(src.claimedType),
    magic: asText(src.magic),
    bytes: Number(src.bytes) || 0,
    preview: asText(src.preview),
    apiStatus: src.apiStatus != null ? Number(src.apiStatus) : 0,
    baked: Boolean(src.baked),
    looping: Boolean(src.looping),
    decodeFail: Boolean(src.decodeFail),
    type: src.type != null ? String(src.type) : "",
    text: src.text != null ? String(src.text) : "",
  };
}

export function cloneTray(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyTray();
  const base = emptyTray();
  return {
    ...base,
    ...src,
    session: asText(src.session),
    frames: Array.isArray(src.frames) ? src.frames.map(cloneFrame) : [],
    recovered: Boolean(src.recovered),
    abandoned: Boolean(src.abandoned),
    source: asText(src.source),
    issue: src.issue ?? null,
  };
}

function claimedImage(frame) {
  const claimed = frame.claimedType.toLowerCase();
  return claimed.startsWith("image/") || IMAGE_EXT.test(frame.path);
}

export function isPlaceholder(frame) {
  return Boolean(frame && frame.type === "text" && frame.text);
}

export function isHeic(frame) {
  if (!frame || isPlaceholder(frame)) return false;
  const claimed = frame.claimedType.toLowerCase();
  const path = frame.path.toLowerCase();
  const magic = frame.magic.toLowerCase();
  return (
    claimed.includes("heic") ||
    claimed.includes("heif") ||
    magic === "heic" ||
    magic === "heif" ||
    path.endsWith(".heic") ||
    path.endsWith(".heif")
  );
}

export function isLfs(frame) {
  if (!frame || isPlaceholder(frame)) return false;
  return frame.magic.toLowerCase() === "lfs" || frame.preview.startsWith(LFS_PREFIX);
}

export function isSpoof(frame) {
  if (!frame || isPlaceholder(frame) || isHeic(frame) || isLfs(frame)) return false;
  const magic = frame.magic.toLowerCase();
  return claimedImage(frame) && (magic === "text" || magic === "html" || magic === "none" || magic === "");
}

export function isRot(frame) {
  if (!frame || isPlaceholder(frame) || isHeic(frame) || isLfs(frame) || isSpoof(frame)) return false;
  if (frame.decodeFail) return true;
  const real = REAL_MAGIC.has(frame.magic.toLowerCase());
  return real && frame.apiStatus === 400 && !frame.looping && !frame.baked;
}

export function isReplay(frame) {
  if (!frame || isPlaceholder(frame)) return false;
  if (frame.looping) return true;
  return Boolean(frame.baked && frame.apiStatus === 400 && !isHeic(frame) && !isLfs(frame) && !isSpoof(frame));
}

export function isValidImage(frame) {
  if (!frame || isPlaceholder(frame)) return false;
  const magic = frame.magic.toLowerCase();
  return REAL_MAGIC.has(magic) && frame.apiStatus !== 400 && !frame.looping && !frame.decodeFail;
}

export function isPoison(frame) {
  if (!frame || isPlaceholder(frame)) return false;
  return Boolean(
    frame.looping ||
      isHeic(frame) ||
      isLfs(frame) ||
      isSpoof(frame) ||
      isRot(frame) ||
      isReplay(frame),
  );
}

export function frameKind(frame) {
  if (!frame || isPlaceholder(frame)) return "clear";
  if (frame.looping) return "replay";
  if (isHeic(frame)) return "heic";
  if (isLfs(frame)) return "lfs";
  if (isSpoof(frame)) return "spoof";
  if (isRot(frame)) return "rot";
  if (isReplay(frame)) return "replay";
  return "clear";
}

export function verdictOf(tray = {}) {
  const next = cloneTray(tray);
  const frames = next.frames;
  if (frames.some((frame) => frame.looping)) return "replay";
  if (frames.some(isHeic)) return "heic";
  if (frames.some(isLfs)) return "lfs";
  if (frames.some(isSpoof)) return "spoof";
  if (frames.some(isRot)) return "rot";
  if (frames.some((frame) => frame.baked && frame.apiStatus === 400 && !isHeic(frame) && !isLfs(frame) && !isSpoof(frame))) {
    return "replay";
  }
  return "clear";
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const traySrc = src.tray && typeof src.tray === "object" ? src.tray : payload.tray;
  const fromFields = traySrc && typeof traySrc === "object" ? traySrc : src;
  const tray = cloneTray({
    session: fromFields.session ?? src.session ?? payload.session,
    frames: fromFields.frames ?? src.frames ?? payload.frames,
    recovered: fromFields.recovered ?? src.recovered ?? payload.recovered,
    abandoned: fromFields.abandoned ?? src.abandoned ?? payload.abandoned,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
  });
  return {
    action: String((nested ? nested.action : payload.action) || "mark"),
    session: String(src.session ?? payload.session ?? tray.session ?? ""),
    tray,
    issue: src.issue ?? payload.issue ?? tray.issue ?? null,
    source: src.source ?? payload.source ?? tray.source ?? "",
  };
}

function pack(verdict, tray, action, extras = {}) {
  const next = cloneTray(tray);
  const poison = next.frames.filter(isPoison);
  const abandoned = extras.abandoned != null ? Boolean(extras.abandoned) : Boolean(next.abandoned);
  const recovered = extras.recovered != null ? Boolean(extras.recovered) : Boolean(next.recovered);
  const looping = next.frames.some((frame) => frame.looping);
  return {
    ok: true,
    product: "blot",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    frames: next.frames,
    poison,
    recovered,
    abandoned,
    abandon: extras.abandon === true || abandoned,
    sessionDeleted: extras.sessionDeleted === true,
    looping,
    placeholder: extras.placeholder || (next.frames.some((frame) => frame.text === PLACEHOLDER) ? PLACEHOLDER : ""),
    tray: { ...next, recovered, abandoned },
  };
}

function seedTray(issue, source, extras = {}) {
  const frames = Array.isArray(extras.frames) ? extras.frames.map(cloneFrame) : [];
  const session = extras.session != null ? String(extras.session) : String(issue);
  return {
    action: extras.action || "mark",
    session,
    issue,
    source,
    tray: {
      session,
      frames,
      recovered: Boolean(extras.recovered),
      abandoned: Boolean(extras.abandoned),
      source,
      issue,
    },
  };
}

/** OSStatus error written as screenshot.png; 173-byte text spoof. claude-code#24387. */
export function seed24387() {
  return seedTray(24387, "anthropics/claude-code#24387", {
    session: "24387",
    frames: [
      {
        path: "/tmp/screenshot.png",
        claimedType: "image/png",
        magic: "text",
        bytes: 173,
        preview: "OSStatus error -2700",
        apiStatus: 400,
        baked: true,
        looping: false,
      },
    ],
  });
}

/** HEIC permanently destroys the session. claude-code#16169. */
export function seed16169() {
  return seedTray(16169, "anthropics/claude-code#16169", {
    frames: [
      {
        path: "~/Pictures/IMG_1042.HEIC",
        claimedType: "image/heic",
        magic: "heic",
        bytes: 482000,
        preview: "",
        apiStatus: 400,
        baked: true,
        looping: false,
      },
    ],
  });
}

/** Git LFS pointer Read as icon.png. claude-code#32764. */
export function seed32764() {
  return seedTray(32764, "anthropics/claude-code#32764", {
    frames: [
      {
        path: "/tmp/test.png",
        claimedType: "image/png",
        magic: "lfs",
        bytes: 131,
        preview:
          "version https://git-lfs.github.com/spec/v1\noid sha256:796e62f8e6d70b18cbe2fcda3debc29ffce327eaa12bbdc3650fef6d6189bba4\nsize 914901",
        apiStatus: 400,
        baked: true,
        looping: false,
      },
    ],
  });
}

/** Tool-returned PNG baked in; later turns 400; looping. claude-code#47391. */
export function seed47391() {
  return seedTray(47391, "anthropics/claude-code#47391", {
    frames: [
      {
        path: "/sdcard/screenshot.png",
        claimedType: "image/png",
        magic: "png",
        bytes: 140000,
        preview: "",
        apiStatus: 400,
        baked: true,
        looping: true,
      },
    ],
  });
}

/** Codex HEIC upload; thread already stuck. openai/codex#10833. Looping wins: replay. */
export function seed10833() {
  return seedTray(10833, "openai/codex#10833", {
    frames: [
      {
        path: "upload.heic",
        claimedType: "image/heic",
        magic: "heic",
        bytes: 2200000,
        preview: "",
        apiStatus: 400,
        baked: true,
        looping: true,
      },
    ],
  });
}

const SEEDS = {
  24387: seed24387,
  16169: seed16169,
  32764: seed32764,
  47391: seed47391,
  10833: seed10833,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let tray = cloneTray(action.tray);

  if (action.action === "clear") {
    return pack("clear", emptyTray(), { ...action, action: "clear" });
  }

  if (action.action === "abandon") {
    const verdict = verdictOf(tray);
    return pack(verdict, { ...tray, recovered: false, abandoned: true }, action, {
      abandoned: true,
      recovered: false,
      abandon: true,
      sessionDeleted: true,
    });
  }

  if (action.action === "strip") {
    const nextFrames = tray.frames.map((frame) =>
      isPoison(frame) ? { type: "text", text: PLACEHOLDER } : frame,
    );
    tray = {
      ...tray,
      frames: nextFrames.map(cloneFrame),
      recovered: true,
      abandoned: false,
    };
    return pack(verdictOf(tray), tray, action, {
      recovered: true,
      abandoned: false,
      placeholder: PLACEHOLDER,
    });
  }

  return pack(verdictOf(tray), tray, action);
}
