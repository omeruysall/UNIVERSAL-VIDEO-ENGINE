import test from "node:test";
import assert from "node:assert/strict";
import {
  isProjectManifestV2,
  isStudioDocument,
  migrateProjectV1ToV2,
} from "../src/studio";
import type { ProjectManifest } from "../src/project";

const timestamp = "2026-11-24T12:00:00.000Z";

function makeV1(): ProjectManifest {
  return {
    schemaVersion: 1,
    id: "project-001",
    title: "Migration fixture",
    createdAt: timestamp,
    updatedAt: timestamp,
    languages: {
      video: "tr",
      voiceover: ["tr", "en"],
      subtitles: ["en"],
      onScreenText: ["tr"],
      metadata: ["tr", "en"],
    },
    prompt: { mode: "ready_prompt", originalText: "  preserve this prompt exactly  " },
    output: {
      kind: "video",
      format: "mp4",
      orientation: "landscape",
      width: 1920,
      height: 1080,
      fps: 30,
    },
    assets: [{
      id: "asset-a",
      kind: "audio",
      fileName: "voice.wav",
      relativePath: "media/voice.wav",
    }],
    timeline: {
      durationMs: 1000,
      tracks: [{
        id: "track-a",
        name: "Voice",
        kind: "audio",
        clips: [{
          id: "clip-a",
          assetId: "asset-a",
          startMs: 0,
          sourceInMs: 0,
          sourceOutMs: 1000,
        }],
      }],
    },
  };
}

function studioDocument(overrides: Record<string, unknown> = {}) {
  return {
    id: "music-main",
    studioType: "music",
    documentVersion: 1,
    title: "Music Draft",
    createdAt: timestamp,
    updatedAt: timestamp,
    assetIds: ["asset-a"],
    data: { bpm: 92, key: "A minor" },
    ...overrides,
  };
}

test("v1 migration preserves all existing project data without mutating input", () => {
  const source = makeV1();
  const before = structuredClone(source);
  const migrated = migrateProjectV1ToV2(source);

  assert.ok(migrated);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.studios, []);
  const { studios: _studios, ...migratedProjectFields } = migrated;
  assert.deepEqual({ ...migratedProjectFields, schemaVersion: 1 }, source);
  assert.deepEqual(source, before);
  assert.equal(migrated.prompt?.mode === "ready_prompt" ? migrated.prompt.originalText : "", "  preserve this prompt exactly  ");
});

test("migration rejects invalid v1 input", () => {
  const invalid = { ...makeV1(), schemaVersion: 9 };
  assert.equal(migrateProjectV1ToV2(invalid), null);
});

test("studio document validates required fields and timestamp", () => {
  assert.equal(isStudioDocument(studioDocument()), true);
  assert.equal(isStudioDocument(studioDocument({ documentVersion: 0 })), false);
  assert.equal(isStudioDocument(studioDocument({ studioType: "unknown" })), false);
  assert.equal(isStudioDocument(studioDocument({ title: "  " })), false);
  assert.equal(isStudioDocument(studioDocument({ createdAt: "not-a-date" })), false);
});

test("v2 rejects duplicate studio IDs", () => {
  const v2 = { ...migrateProjectV1ToV2(makeV1())!, studios: [studioDocument(), studioDocument()] };
  assert.equal(isProjectManifestV2(v2), false);
});

test("v2 rejects studio references to missing project assets", () => {
  const v2 = {
    ...migrateProjectV1ToV2(makeV1())!,
    studios: [studioDocument({ assetIds: ["missing-asset"] })],
  };
  assert.equal(isProjectManifestV2(v2), false);
});

test("v2 accepts valid studio documents linked to shared assets", () => {
  const v2 = { ...migrateProjectV1ToV2(makeV1())!, studios: [studioDocument()] };
  assert.equal(isProjectManifestV2(v2), true);
});

test("v2 rejects duplicate shared asset IDs", () => {
  const base = makeV1();
  const v2 = {
    ...migrateProjectV1ToV2(base)!,
    assets: [base.assets[0], base.assets[0]],
    studios: [],
  };
  assert.equal(isProjectManifestV2(v2), false);
});
