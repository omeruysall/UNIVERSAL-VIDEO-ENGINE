/**
 * Platform-independent project contract.
 * Keep device-specific absolute paths and runtime handles out of this document.
 */

export type OutputKind = "video" | "audio" | "image" | "animation";

export type VideoOrientation =
  | "landscape"
  | "portrait"
  | "square"
  | "custom";

export type OutputSettings =
  | {
      kind: "video";
      format: string;
      orientation: VideoOrientation;
      width: number;
      height: number;
      fps: number;
    }
  | {
      kind: "animation";
      format: string;
      orientation: VideoOrientation;
      width: number;
      height: number;
      fps: number;
    }
  | {
      kind: "image";
      format: string;
      orientation: VideoOrientation;
      width: number;
      height: number;
    }
  | {
      kind: "audio";
      format: string;
      sampleRate: number;
      channels: number;
    };

export interface ProjectLanguages {
  /** Main language of the project/video. */
  video: string;
  /** Multiple voice-over languages can be selected. */
  voiceover: string[];
  /** Multiple subtitle languages can be selected. */
  subtitles: string[];
  /** Languages used for visible on-screen text. */
  onScreenText: string[];
  /** Languages used for titles and descriptions. */
  metadata: string[];
}

export type PromptInput =
  | {
      mode: "topic";
      topic: string;
      generatedPrompt?: string;
    }
  | {
      mode: "ready_prompt";
      /** Must be persisted exactly as entered; never normalize or rewrite. */
      originalText: string;
    };

export type AssetKind = "video" | "audio" | "image" | "text" | "3d";

export interface ProjectAsset {
  id: string;
  kind: AssetKind;
  fileName: string;
  /** Relative to the project package's media directory. */
  relativePath: string;
  mimeType?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
}

export interface TimelineClip {
  id: string;
  assetId: string;
  /** Timeline position in milliseconds. */
  startMs: number;
  /** Source in-point in milliseconds. */
  sourceInMs: number;
  /** Source out-point in milliseconds. */
  sourceOutMs: number;
}

export interface TimelineTrack {
  id: string;
  name: string;
  kind: "video" | "audio" | "text" | "overlay";
  clips: TimelineClip[];
}

export interface ProjectTimeline {
  durationMs: number;
  tracks: TimelineTrack[];
}

/**
 * Portable manifest shared by mobile and desktop builds.
 * Increment schemaVersion only with an explicit migration strategy.
 */
export interface ProjectManifest {
  schemaVersion: 1;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  languages: ProjectLanguages;
  prompt?: PromptInput;
  output: OutputSettings;
  assets: ProjectAsset[];
  timeline: ProjectTimeline;
}


function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/** Runtime guard shared by every platform before a manifest is persisted or opened. */
export function isProjectManifest(value: unknown): value is ProjectManifest {
  if (!isRecord(value) || value.schemaVersion !== 1) return false;
  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string"
  ) return false;

  const languages = value.languages;
  if (!isRecord(languages)) return false;
  if (
    typeof languages.video !== "string" || languages.video.trim().length === 0 ||
    !isStringArray(languages.voiceover) ||
    !isStringArray(languages.subtitles) ||
    !isStringArray(languages.onScreenText) ||
    !isStringArray(languages.metadata)
  ) return false;

  const output = value.output;
  if (!isRecord(output) || typeof output.format !== "string") return false;
  if (output.kind === "audio") {
    if (
      typeof output.sampleRate !== "number" || output.sampleRate <= 0 ||
      typeof output.channels !== "number" || output.channels <= 0
    ) return false;
  } else if (output.kind === "video" || output.kind === "animation" || output.kind === "image") {
    if (
      !["landscape", "portrait", "square", "custom"].includes(String(output.orientation)) ||
      typeof output.width !== "number" || !Number.isFinite(output.width) || output.width <= 0 ||
      typeof output.height !== "number" || !Number.isFinite(output.height) || output.height <= 0
    ) return false;
    if (
      (output.kind === "video" || output.kind === "animation") &&
      (typeof output.fps !== "number" || !Number.isFinite(output.fps) || output.fps <= 0)
    ) return false;
  } else {
    return false;
  }

  if (!Array.isArray(value.assets)) return false;
  const timeline = value.timeline;
  if (!isRecord(timeline) || typeof timeline.durationMs !== "number" || !Array.isArray(timeline.tracks)) {
    return false;
  }

  const prompt = value.prompt;
  if (prompt !== undefined) {
    if (!isRecord(prompt)) return false;
    if (prompt.mode === "topic") {
      if (typeof prompt.topic !== "string") return false;
      if (prompt.generatedPrompt !== undefined && typeof prompt.generatedPrompt !== "string") return false;
    } else if (prompt.mode === "ready_prompt") {
      if (typeof prompt.originalText !== "string") return false;
    } else {
      return false;
    }
  }

  return true;
}
