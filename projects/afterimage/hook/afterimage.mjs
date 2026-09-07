/**
 * Afterimage — ophthalmology / CRT phosphor persistence bench.
 *
 * The retina (or phosphor) receives every photon (text deltas)
 * but the conscious field stays blank until the stimulus ends —
 * then the whole answer flashes as one afterimage.
 *
 * Encoded from anthropics/claude-code#92596 issue facts only.
 * Hypothesis (NON-BINDING): Windows text content_block_delta
 * paint path may be deferred until message_stop while thinking
 * path paints live — verify against issue text only; do not
 * claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "latent",
  "flushed",
  "thinking-paints",
  "text-zero-frames",
  "mega-frame-stop",
  "linux-progressive",
  "nonstreaming-fallback-ruled-out",
  "fine-grained-no-effect",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["flushed"]);

export const ALARM = new Set([
  "latent",
  "thinking-paints",
  "text-zero-frames",
  "mega-frame-stop",
  "linux-progressive",
  "nonstreaming-fallback-ruled-out",
  "fine-grained-no-effect",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "latent";
export const SEEDED_WORD = "flushed";

export const MEASURED = {
  issue: 92596,
  title:
    "Windows: assistant text deltas arrive but are not painted until message_stop (thinking streams fine) - v2.1.263",
  state: "open",
  labels: ["bug", "has repro", "platform:windows", "area:tui"],
  filed: "2026-09-07T05:29:53Z",
  updated: "2026-09-07T05:30:57Z",
  reporter: "skunpoj",
  comments: 0,
  os: "Windows 11 Enterprise (10.0.22631)",
  app: "Claude Code 2.1.263",
  cliVersion: "2.1.263",
  install: "native",
  terminals: ["Windows Terminal (ConPTY)", "mintty (Git Bash)"],
  terminalIndependent: true,
  pristineClaudeConfigDir: true,
  backend: "Anthropic-compatible gateway (vLLM behind custom ANTHROPIC_BASE_URL), GLM-5.3-Flash",
  statusLineLiveTokenCounts: true,
  deltasArriveAndParsed: true,
  messageAreaBlankUntilStop: true,
  longAnswersBlinkAtCompletion: true,
  sseTextDeltaIntervalMs: 100,
  sseDurationSeconds: 33,
  sseInputTokens: 45000,
  transportFine: true,
  thinkingPaintFrames: 200,
  thinkingDurationSeconds: 13,
  thinkingFps: 15,
  thinkingPatchesPerFrameMin: 3,
  thinkingPatchesPerFrameMax: 15,
  textPhasePaintFrames: 0,
  stopFramePatches: 2482,
  stopRepaintPatches: 2472,
  linuxProgressive: true,
  disableNonstreamingFallback: true,
  nonstreamingFallbackRuledOut: true,
  fineGrainedToolStreaming: true,
  fineGrainedNoEffectOnProse: true,
  thinkingContentBlockDeltaPaintsLive: true,
  textContentBlockDeferredUntilMessageStop: true,
  windowsOnly: true,
  expected: "Paint text deltas as they arrive, like the Linux build does.",
  actual:
    "Status line ticks live token counts; message area paints nothing until message_stop, then one mega-frame.",
  impact:
    "Long answers render as a single blink at completion. Thinking streams ~15fps; text stays latent."
};

export const COUSINS = [
  {
    id: 92616,
    state: "open",
    note: "Cite-only cousin. Queued pasted input merged into previous assistant message record on interrupt. Different surface (transcript merge vs Windows text paint deferral). Primary stays #92596. Do not auto-pick as primary."
  },
  {
    id: 92531,
    state: "open",
    note: "Cite-only cousin. Permission modal does not dismiss on Allow click (v2.1.261, macOS/iTerm2). Different surface (permission modal vs Windows text paint deferral). Primary stays #92596."
  },
  {
    id: 92493,
    state: "open",
    note: "Cite-only cousin. Stats image rendering has unknown glyphs. Different surface (stats image glyphs vs Windows text paint deferral). Primary stays #92596."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "limber",
    issue: 92590,
    note: "Limber/#92590: unexpanded $TMPDIR write-allowlist token. Different defect."
  },
  {
    slug: "chock",
    issue: 92582,
    note: "Chock/#92582: blockReadsOutsideWorkingDirectories ignores project/local additionalDirectories. Different defect."
  },
  {
    slug: "deadman",
    issue: 92593,
    note: "Deadman/#92593: timeout background + TaskStop shell-only + MSYS wipe. Different defect."
  },
  {
    slug: "eidolon",
    issue: 92601,
    note: "Eidolon/#92601: security-guidance ENOENT fake notice loop. Different defect."
  },
  {
    slug: "stroboscope",
    note: "Stroboscope: terminal panel flickers and steals the chat caret. Different defect (focus steal vs paint deferral)."
  },
  {
    slug: "diopter",
    issue: 92524,
    note: "Diopter/#92524: per-session scratchpad UUID defocuses the prompt cache. Different defect."
  },
  {
    slug: "scrim",
    note: "Scrim: prior catalog paradigm. Different defect."
  },
  {
    slug: "wraith",
    note: "Wraith: auto-updater live-image unlink afterimage desk. Different defect (deleted inode vs phosphor persistence)."
  }
];

export const PHOSPHOR_PHASES = [
  {
    id: "thinking",
    role: "thinking deltas",
    frames: 200,
    seconds: 13,
    fps: 15,
    paints: true
  },
  {
    id: "text",
    role: "text content blocks",
    frames: 0,
    seconds: 33,
    fps: 0,
    paints: false
  },
  {
    id: "stop",
    role: "message_stop mega-frame",
    frames: 1,
    patches: 2482,
    repaint: 2472,
    paints: true
  }
];

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function asText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(asText).join("\n");
  }
  return String(value);
}

export function extractText(probe = {}) {
  return asText(probe);
}

export function thinkingPaintsSignal(text = "") {
  return /thinking.*(paint|frame|15\s*fps|15 frames)|~200 paint frames|thinking deltas/i.test(
    String(text || "")
  );
}

export function textZeroFramesSignal(text = "") {
  return /zero paint frames|text phase.*zero|message area paints nothing|defers painting text/i.test(
    String(text || "")
  );
}

export function megaFrameStopSignal(text = "") {
  return /2,?482|mega-?frame|message_stop|2,?472-?patch/i.test(String(text || ""));
}

export function linuxProgressiveSignal(text = "") {
  return /linux.*(progressive|streams)|streams answer text progressively on Linux/i.test(
    String(text || "")
  );
}

export function nonstreamingFallbackSignal(text = "") {
  return /DISABLE_NONSTREAMING_FALLBACK|non-?streaming fallback is ruled out|nonstreaming-fallback-ruled-out/i.test(
    String(text || "")
  );
}

export function fineGrainedNoEffectSignal(text = "") {
  return /FINE_GRAINED_TOOL_STREAMING|fine-grained.*no effect|no effect on prose/i.test(
    String(text || "")
  );
}

export function latentSignal(text = "") {
  return /latent|paints nothing until|blank until|deferred until message_stop|single blink/i.test(
    String(text || "")
  );
}

export function flushedSignal(text = "") {
  return /flushed|text paints (live|per-delta)|windows text paints/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    thinkingPaints: thinkingPaintsSignal(blob),
    textZeroFrames: textZeroFramesSignal(blob),
    megaFrameStop: megaFrameStopSignal(blob),
    linuxProgressive: linuxProgressiveSignal(blob),
    nonstreamingFallbackRuledOut: nonstreamingFallbackSignal(blob),
    fineGrainedNoEffect: fineGrainedNoEffectSignal(blob),
    latent: latentSignal(blob),
    flushed: flushedSignal(blob)
  };
}

export function textPaintsLive(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.textPaintsLive) || boolish(t.windowsTextPaintsPerDelta)) return true;
  if (boolish(t.flushed) && !boolish(t.latent)) return true;
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const blob = extractText(t);
  const hits = signals(t);
  const thinking =
    boolish(t.thinkingPaints) ||
    boolish(t.thinkingContentBlockDeltaPaintsLive) ||
    hits.thinkingPaints;
  const textZero =
    boolish(t.textZeroFrames) ||
    t.textPhasePaintFrames === 0 ||
    boolish(t.messageAreaBlankUntilStop) ||
    hits.textZeroFrames;
  const mega =
    boolish(t.megaFrameStop) ||
    t.stopFramePatches === 2482 ||
    hits.megaFrameStop;
  const linux =
    boolish(t.linuxProgressive) ||
    hits.linuxProgressive;
  const fallback =
    boolish(t.nonstreamingFallbackRuledOut) ||
    boolish(t.disableNonstreamingFallback) ||
    hits.nonstreamingFallbackRuledOut;
  const fine =
    boolish(t.fineGrainedNoEffect) ||
    boolish(t.fineGrainedNoEffectOnProse) ||
    hits.fineGrainedNoEffect;
  const flushedClean =
    boolish(t.flushed) ||
    textPaintsLive(t);
  const latentHit =
    boolish(t.latent) ||
    (textZero && !boolish(t.flushed));
  return {
    thinking,
    textZero,
    mega,
    linux,
    fallback,
    fine,
    flushedClean,
    latentHit,
    paintsLive: textPaintsLive(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const latent =
    boolish(t.latent) ||
    (print.latentHit && !boolish(t.flushed));
  const flushed =
    boolish(t.flushed) ||
    (print.flushedClean && !boolish(t.latent));
  return {
    latent,
    flushed,
    thinkingPaints: boolish(t.thinkingPaints) || print.thinking,
    textZeroFrames: boolish(t.textZeroFrames) || print.textZero,
    megaFrameStop: boolish(t.megaFrameStop) || print.mega,
    linuxProgressive: boolish(t.linuxProgressive) || print.linux,
    nonstreamingFallbackRuledOut:
      boolish(t.nonstreamingFallbackRuledOut) || print.fallback,
    fineGrainedNoEffect: boolish(t.fineGrainedNoEffect) || print.fine,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    cliVersion: t.cliVersion || MEASURED.cliVersion,
    os: t.os || MEASURED.os
  };
}

export function seedLatent() {
  return {
    seed: "latent",
    issue: 92596,
    latent: true,
    flushed: false,
    thinkingPaints: true,
    textZeroFrames: true,
    megaFrameStop: true,
    linuxProgressive: true,
    nonstreamingFallbackRuledOut: true,
    fineGrainedNoEffect: true,
    thinkingContentBlockDeltaPaintsLive: true,
    messageAreaBlankUntilStop: true,
    textPhasePaintFrames: 0,
    stopFramePatches: 2482,
    reporter: MEASURED.reporter
  };
}

export function seedFlushed() {
  return {
    seed: "flushed",
    issue: 92596,
    latent: false,
    flushed: true,
    textPaintsLive: true,
    windowsTextPaintsPerDelta: true,
    thinkingPaints: true,
    textZeroFrames: false,
    megaFrameStop: false,
    textPhasePaintFrames: 200,
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    latent: seedLatent(),
    flushed: seedFlushed(),
    "thinking-paints": {
      seed: "thinking-paints",
      issue: 92596,
      thinkingPaints: true,
      thinkingPaintFrames: MEASURED.thinkingPaintFrames,
      thinkingFps: MEASURED.thinkingFps
    },
    "text-zero-frames": {
      seed: "text-zero-frames",
      issue: 92596,
      textZeroFrames: true,
      textPhasePaintFrames: 0,
      messageAreaBlankUntilStop: true
    },
    "mega-frame-stop": {
      seed: "mega-frame-stop",
      issue: 92596,
      megaFrameStop: true,
      stopFramePatches: MEASURED.stopFramePatches,
      stopRepaintPatches: MEASURED.stopRepaintPatches
    },
    "linux-progressive": {
      seed: "linux-progressive",
      issue: 92596,
      linuxProgressive: true
    },
    "nonstreaming-fallback-ruled-out": {
      seed: "nonstreaming-fallback-ruled-out",
      issue: 92596,
      nonstreamingFallbackRuledOut: true,
      disableNonstreamingFallback: true
    },
    "fine-grained-no-effect": {
      seed: "fine-grained-no-effect",
      issue: 92596,
      fineGrainedNoEffect: true,
      fineGrainedNoEffectOnProse: true
    },
    cousins: {
      seed: "cousins",
      issue: 92596,
      cousins: true,
      cousinsCiteOnly: [92616, 92531, 92493]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92596,
      hasClearRepro: true,
      labels: MEASURED.labels
    }
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function analyze(input = {}) {
  const classified = classify(input);
  const decided = decide(input);
  return {
    ...classified,
    verdict: decided.verdict,
    reasons: decided.reasons,
    chips: decided.chips
  };
}

export function score(input = {}) {
  return decide(input);
}

export function handle(input = {}) {
  const probe =
    typeof input === "string"
      ? (() => {
          try {
            return JSON.parse(input);
          } catch {
            return {};
          }
        })()
      : input;
  return decide(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const afterimage = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92616 queued paste merged on interrupt (different surface); #92531 permission modal dismiss (different surface); #92493 stats image glyphs (different surface). Not Limber/#92590 unexpanded $TMPDIR. Not Chock/#92582 settings-layer merge miss. Not Deadman/#92593 timeout leftover. Not Eidolon/#92601 ENOENT fake notice. Not Stroboscope flicker. Not Diopter/#92524 cache defocus. Not Scrim / Wraith paradigms. Primary stays #92596"
    );
    return {
      verdict: "cousins",
      reasons,
      latent: true,
      flushed: false,
      chips: ["cousins", "latent"],
      afterimage
    };
  }

  if (
    seed === "thinking-paints" ||
    (t.thinkingPaints === true && seed !== "latent" && seed !== "flushed")
  ) {
    reasons.push(
      "thinking-paints — thinking deltas: ~200 paint frames over 13 s at ~15 frames/s (3-15 patches each) — progressive rendering works"
    );
    return {
      verdict: "thinking-paints",
      reasons,
      latent: true,
      flushed: false,
      chips: ["thinking-paints", "latent"],
      afterimage
    };
  }

  if (
    seed === "text-zero-frames" ||
    (t.textZeroFrames === true && seed !== "latent" && seed !== "flushed")
  ) {
    reasons.push(
      "text-zero-frames — text phase: zero paint frames for the entire generation; message area paints nothing until message_stop"
    );
    return {
      verdict: "text-zero-frames",
      reasons,
      latent: true,
      flushed: false,
      chips: ["text-zero-frames", "latent"],
      afterimage
    };
  }

  if (
    seed === "mega-frame-stop" ||
    (t.megaFrameStop === true && seed !== "latent" && seed !== "flushed")
  ) {
    reasons.push(
      "mega-frame-stop — at completion: one frame with 2,482 patches (the whole answer), then a 2,472-patch repaint"
    );
    return {
      verdict: "mega-frame-stop",
      reasons,
      latent: true,
      flushed: false,
      chips: ["mega-frame-stop", "latent"],
      afterimage
    };
  }

  if (
    seed === "linux-progressive" ||
    (t.linuxProgressive === true && seed !== "latent" && seed !== "flushed")
  ) {
    reasons.push(
      "linux-progressive — same CLI + same gateway streams answer text progressively on Linux, yet only Windows defers the paint"
    );
    return {
      verdict: "linux-progressive",
      reasons,
      latent: true,
      flushed: false,
      chips: ["linux-progressive", "latent"],
      afterimage
    };
  }

  if (
    seed === "nonstreaming-fallback-ruled-out" ||
    (t.nonstreamingFallbackRuledOut === true && seed !== "latent" && seed !== "flushed")
  ) {
    reasons.push(
      "nonstreaming-fallback-ruled-out — CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK=1 is set, so the silent non-streaming fallback is ruled out (and the ticking token counter proves deltas are consumed live)"
    );
    return {
      verdict: "nonstreaming-fallback-ruled-out",
      reasons,
      latent: true,
      flushed: false,
      chips: ["nonstreaming-fallback-ruled-out", "latent"],
      afterimage
    };
  }

  if (
    seed === "fine-grained-no-effect" ||
    (t.fineGrainedNoEffect === true && seed !== "latent" && seed !== "flushed")
  ) {
    reasons.push(
      "fine-grained-no-effect — CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING=1 has no effect on prose rendering"
    );
    return {
      verdict: "fine-grained-no-effect",
      reasons,
      latent: true,
      flushed: false,
      chips: ["fine-grained-no-effect", "latent"],
      afterimage
    };
  }

  if (seed === "has-clear-repro" || (t.hasClearRepro === true && seed !== "latent" && seed !== "flushed")) {
    reasons.push(
      "has-clear-repro — #92596 is labeled has repro: Claude Code v2.1.263 Windows 11; reproduced in Windows Terminal (ConPTY) and mintty; CLAUDE_CODE_FRAME_TIMING_LOG shows thinking ~15fps and text zero frames until message_stop"
    );
    return {
      verdict: "has-clear-repro",
      reasons,
      latent: true,
      flushed: false,
      chips: ["has-clear-repro", "latent"],
      afterimage
    };
  }

  if (
    seed === "flushed" ||
    (t.flushed === true && t.latent !== true && seed !== "latent") ||
    (afterimage.flushed && !afterimage.latent && seed !== "latent")
  ) {
    reasons.push(
      "afterimage already flushed — Windows text content blocks paint per-delta the same way thinking already does. Seeded word is flushed"
    );
    return {
      verdict: "flushed",
      reasons,
      latent: false,
      flushed: true,
      chips: ["flushed"],
      afterimage
    };
  }

  if (t.latent === true || seed === "latent" || (afterimage.latent && !afterimage.flushed)) {
    reasons.push(
      "A CRT/ophthalmology afterimage bench that should paint Windows assistant text deltas live (token counter already ticks; thinking paints ~15fps) but the message field stays latent until message_stop then one mega-frame — is not flushed. Score latent or admit flushed"
    );
    const chips = ["latent"];
    if (t.thinkingPaints === true || afterimage.thinkingPaints) chips.push("thinking-paints");
    if (t.textZeroFrames === true || afterimage.textZeroFrames) chips.push("text-zero-frames");
    if (t.megaFrameStop === true || afterimage.megaFrameStop) chips.push("mega-frame-stop");
    if (t.linuxProgressive === true || afterimage.linuxProgressive) {
      chips.push("linux-progressive");
    }
    if (t.nonstreamingFallbackRuledOut === true || afterimage.nonstreamingFallbackRuledOut) {
      chips.push("nonstreaming-fallback-ruled-out");
    }
    if (t.fineGrainedNoEffect === true || afterimage.fineGrainedNoEffect) {
      chips.push("fine-grained-no-effect");
    }
    return {
      verdict: "latent",
      reasons,
      latent: true,
      flushed: false,
      chips: [...new Set(chips)],
      afterimage
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, latent: false, flushed: true, chips: [seed], afterimage };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      latent: true,
      flushed: false,
      chips: [seed],
      afterimage
    };
  }

  reasons.push(
    "empty probe; idle phosphor is latent — deltas held; message field blank until message_stop then one mega-frame"
  );
  return {
    verdict: "latent",
    reasons,
    latent: true,
    flushed: false,
    chips: ["latent"],
    afterimage
  };
}
