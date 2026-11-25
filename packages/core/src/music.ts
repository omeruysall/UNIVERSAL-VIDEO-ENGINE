import type { StudioDocument } from "./studio";

export const MUSIC_DOCUMENT_VERSION = 1 as const;

export const MUSIC_SECTION_TYPES = [
  "intro", "verse", "pre_chorus", "chorus", "post_chorus",
  "bridge", "breakdown", "interlude", "solo", "outro", "custom",
] as const;
export type MusicSectionType = (typeof MUSIC_SECTION_TYPES)[number];

export const MUSIC_TRACK_TYPES = ["audio", "midi", "instrument", "bus"] as const;
export type MusicTrackType = (typeof MUSIC_TRACK_TYPES)[number];

export type MusicalMode =
  | "major" | "minor" | "dorian" | "phrygian" | "lydian"
  | "mixolydian" | "locrian" | "harmonic_minor" | "melodic_minor";

export interface TimeSignature {
  numerator: number;
  denominator: 2 | 4 | 8 | 16;
}

export interface TempoPoint {
  id: string;
  bar: number;
  bpm: number;
  curve: "step" | "linear";
}

export interface MusicSection {
  id: string;
  type: MusicSectionType;
  label: string;
  startBar: number;
  bars: number;
  lyrics?: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  type: MusicTrackType;
  muted: boolean;
  solo: boolean;
  gainDb: number;
  pan: number;
}

export interface MusicStudioData {
  metadata: {
    artist: string;
    album: string;
    genre: string;
    subgenres: string[];
    mood: string[];
    targetDurationMs: number;
  };
  musical: {
    bpm: number;
    timeSignature: TimeSignature;
    key: string;
    mode: MusicalMode;
    tempoMap: TempoPoint[];
  };
  arrangement: {
    sections: MusicSection[];
    tracks: MusicTrack[];
  };
  audio: {
    sampleRate: 44100 | 48000 | 88200 | 96000 | 192000;
    bitDepth: 16 | 24 | 32;
    channels: 1 | 2;
    loudnessTargetLufs: number;
    truePeakLimitDbtp: number;
  };
}

export type MusicStudioDocument = StudioDocument<MusicStudioData>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function isUniqueIds(items: unknown[]): boolean {
  const ids = items.map((item) => isRecord(item) ? item.id : undefined);
  return ids.every((id) => isNonEmptyString(id)) && new Set(ids).size === ids.length;
}

export function isMusicStudioData(value: unknown): value is MusicStudioData {
  if (!isRecord(value)) return false;
  const metadata = value.metadata;
  const musical = value.musical;
  const arrangement = value.arrangement;
  const audio = value.audio;
  if (![metadata, musical, arrangement, audio].every(isRecord)) return false;

  if (
    typeof metadata.artist !== "string" ||
    typeof metadata.album !== "string" ||
    !isNonEmptyString(metadata.genre) ||
    !Array.isArray(metadata.subgenres) || !metadata.subgenres.every(isNonEmptyString) ||
    !Array.isArray(metadata.mood) || !metadata.mood.every(isNonEmptyString) ||
    !isFiniteNumber(metadata.targetDurationMs) || metadata.targetDurationMs <= 0
  ) return false;

  const time = musical.timeSignature;
  if (!isRecord(time)) return false;
  if (
    !isFiniteNumber(musical.bpm) || musical.bpm < 20 || musical.bpm > 300 ||
    !isNonEmptyString(musical.key) ||
    !["major", "minor", "dorian", "phrygian", "lydian", "mixolydian", "locrian", "harmonic_minor", "melodic_minor"].includes(String(musical.mode)) ||
    !Number.isInteger(time.numerator) || (time.numerator as number) < 1 || (time.numerator as number) > 32 ||
    ![2, 4, 8, 16].includes(Number(time.denominator)) ||
    !Array.isArray(musical.tempoMap) || !isUniqueIds(musical.tempoMap)
  ) return false;

  for (const point of musical.tempoMap) {
    if (!isRecord(point) || !Number.isInteger(point.bar) || (point.bar as number) < 1 ||
        !isFiniteNumber(point.bpm) || point.bpm < 20 || point.bpm > 300 ||
        !["step", "linear"].includes(String(point.curve))) return false;
  }

  if (!Array.isArray(arrangement.sections) || !isUniqueIds(arrangement.sections) ||
      !Array.isArray(arrangement.tracks) || !isUniqueIds(arrangement.tracks)) return false;

  const sectionTypes = MUSIC_SECTION_TYPES as readonly string[];
  for (const section of arrangement.sections) {
    if (!isRecord(section) || !sectionTypes.includes(String(section.type)) ||
        !isNonEmptyString(section.label) ||
        !Number.isInteger(section.startBar) || (section.startBar as number) < 1 ||
        !Number.isInteger(section.bars) || (section.bars as number) < 1 ||
        (section.lyrics !== undefined && typeof section.lyrics !== "string")) return false;
  }

  const trackTypes = MUSIC_TRACK_TYPES as readonly string[];
  for (const track of arrangement.tracks) {
    if (!isRecord(track) || !isNonEmptyString(track.name) ||
        !trackTypes.includes(String(track.type)) ||
        typeof track.muted !== "boolean" || typeof track.solo !== "boolean" ||
        !isFiniteNumber(track.gainDb) || track.gainDb < -120 || track.gainDb > 24 ||
        !isFiniteNumber(track.pan) || track.pan < -1 || track.pan > 1) return false;
  }

  if (
    ![44100, 48000, 88200, 96000, 192000].includes(Number(audio.sampleRate)) ||
    ![16, 24, 32].includes(Number(audio.bitDepth)) ||
    ![1, 2].includes(Number(audio.channels)) ||
    !isFiniteNumber(audio.loudnessTargetLufs) || audio.loudnessTargetLufs < -36 || audio.loudnessTargetLufs > 0 ||
    !isFiniteNumber(audio.truePeakLimitDbtp) || audio.truePeakLimitDbtp < -12 || audio.truePeakLimitDbtp > 0
  ) return false;

  return true;
}

export function createDefaultMusicStudioData(): MusicStudioData {
  return {
    metadata: {
      artist: "",
      album: "",
      genre: "Unspecified",
      subgenres: [],
      mood: [],
      targetDurationMs: 180_000,
    },
    musical: {
      bpm: 120,
      timeSignature: { numerator: 4, denominator: 4 },
      key: "C",
      mode: "major",
      tempoMap: [{ id: "tempo-main", bar: 1, bpm: 120, curve: "step" }],
    },
    arrangement: {
      sections: [
        { id: "section-intro", type: "intro", label: "Intro", startBar: 1, bars: 4 },
        { id: "section-verse-1", type: "verse", label: "Verse 1", startBar: 5, bars: 16 },
        { id: "section-chorus-1", type: "chorus", label: "Chorus 1", startBar: 21, bars: 8 },
        { id: "section-verse-2", type: "verse", label: "Verse 2", startBar: 29, bars: 16 },
        { id: "section-chorus-2", type: "chorus", label: "Chorus 2", startBar: 45, bars: 8 },
        { id: "section-bridge", type: "bridge", label: "Bridge", startBar: 53, bars: 8 },
        { id: "section-outro", type: "outro", label: "Outro", startBar: 61, bars: 4 },
      ],
      tracks: [
        { id: "track-drums", name: "Drums", type: "instrument", muted: false, solo: false, gainDb: 0, pan: 0 },
        { id: "track-bass", name: "Bass", type: "instrument", muted: false, solo: false, gainDb: 0, pan: 0 },
        { id: "track-harmony", name: "Harmony", type: "midi", muted: false, solo: false, gainDb: 0, pan: 0 },
        { id: "track-lead-vocal", name: "Lead Vocal", type: "audio", muted: false, solo: false, gainDb: 0, pan: 0 },
      ],
    },
    audio: {
      sampleRate: 48000,
      bitDepth: 24,
      channels: 2,
      loudnessTargetLufs: -14,
      truePeakLimitDbtp: -1,
    },
  };
}

export function createMusicStudioDocument(
  id: string,
  title: string,
  timestamp: string,
): MusicStudioDocument {
  return {
    id,
    studioType: "music",
    documentVersion: MUSIC_DOCUMENT_VERSION,
    title,
    createdAt: timestamp,
    updatedAt: timestamp,
    assetIds: [],
    data: createDefaultMusicStudioData(),
  };
}
