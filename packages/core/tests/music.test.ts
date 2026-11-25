import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultMusicStudioData,
  createMusicStudioDocument,
  isMusicStudioData,
} from "../src/music";

test("default music studio data is a valid professional session foundation", () => {
  const data = createDefaultMusicStudioData();
  assert.equal(isMusicStudioData(data), true);
  assert.equal(data.musical.bpm, 120);
  assert.deepEqual(data.musical.timeSignature, { numerator: 4, denominator: 4 });
  assert.equal(data.audio.sampleRate, 48000);
  assert.equal(data.audio.bitDepth, 24);
  assert.ok(data.arrangement.sections.length >= 5);
  assert.ok(data.arrangement.tracks.some((track) => track.name === "Lead Vocal"));
});

test("music document factory creates a versioned music studio document", () => {
  const document = createMusicStudioDocument("music-1", "Music Draft", "2026-11-25T12:00:00.000Z");
  assert.equal(document.studioType, "music");
  assert.equal(document.documentVersion, 1);
  assert.equal(isMusicStudioData(document.data), true);
});

test("music data rejects out-of-range tempo and invalid meter", () => {
  const data = createDefaultMusicStudioData();
  assert.equal(isMusicStudioData({ ...data, musical: { ...data.musical, bpm: 500 } }), false);
  assert.equal(isMusicStudioData({ ...data, musical: { ...data.musical, timeSignature: { numerator: 4, denominator: 3 } } }), false);
});

test("music data rejects duplicate arrangement IDs and invalid mixer values", () => {
  const data = createDefaultMusicStudioData();
  const duplicateSections = [data.arrangement.sections[0], data.arrangement.sections[0]];
  assert.equal(isMusicStudioData({ ...data, arrangement: { ...data.arrangement, sections: duplicateSections } }), false);
  const invalidTracks = data.arrangement.tracks.map((track, index) => index === 0 ? { ...track, pan: 2 } : track);
  assert.equal(isMusicStudioData({ ...data, arrangement: { ...data.arrangement, tracks: invalidTracks } }), false);
});

test("music data accepts custom tempo map and lyrics", () => {
  const data = createDefaultMusicStudioData();
  const custom = {
    ...data,
    musical: {
      ...data.musical,
      tempoMap: [...data.musical.tempoMap, { id: "tempo-change", bar: 17, bpm: 96, curve: "linear" as const }],
    },
    arrangement: {
      ...data.arrangement,
      sections: data.arrangement.sections.map((section, index) =>
        index === 1 ? { ...section, lyrics: "Original lyrics stay editable." } : section
      ),
    },
  };
  assert.equal(isMusicStudioData(custom), true);
});
