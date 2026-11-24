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

export interface OutputSettings {
  kind: OutputKind;
  format: string;
  orientation: VideoOrientation;
  width: number;
  height: number;
  fps: number;
}

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
