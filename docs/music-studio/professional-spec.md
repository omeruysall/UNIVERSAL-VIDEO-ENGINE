# Music Studio PRO — Product Specification

**Status:** Planned product module. This document defines scope; it does not claim that the features are implemented.

## 1. Product goal

Music Studio PRO is a standalone music-production workspace inside UNIVERSAL VIDEO ENGINE. It combines a DAW-style multitrack editor with optional AI-assisted songwriting, composition, sound design and audio generation. It must remain useful without an AI subscription: core recording, MIDI, editing, mixing and export are local-first.

The module shares the application's project library, asset manager, render center, language metadata and media interchange layer. It has its own music timeline, mixer, instrument rack and production workflow.

## 2. Project setup

A music project can define:
- Project name, artist/project metadata and target duration.
- Genre and subgenre tags, including custom genres and hybrid styles.
- Tempo in BPM, tempo map and tap-tempo input.
- Time signature and tempo subdivisions.
- Musical key, scale and optional mode.
- Mood, energy, intensity, era/influence descriptors and production references.
- Target use: full song, instrumental, soundtrack, podcast bed, game music, short-form/social cut or music video.
- Sample rate, bit depth, channel layout and loudness target.
- Language metadata, lyric language and vocal language independently.

All settings are editable after project creation. AI prompts and generated results must never silently overwrite user-authored material.

## 3. Songwriting and composition

- Lyric editor with sections, line/phrase grouping, rhyme and syllable assistance.
- Verse, pre-chorus, chorus, bridge, breakdown, intro, outro and custom sections.
- Chord progression editor, chord suggestions and harmonic analysis.
- Melody sketching, scale-aware note entry and phrase variations.
- Arrangement markers and section duplication.
- Optional AI lyric, chord, melody and arrangement suggestions.
- Version history and side-by-side comparison for generated alternatives.

AI output is a proposal until the user accepts it. Users retain manual editing control.

## 4. Beat and sound creation

- Step sequencer and drum pattern editor.
- Kick, snare, clap, hi-hat, percussion and acoustic drum lanes.
- 808, sub-bass and melodic bass sequencing.
- Piano roll for pitched instruments.
- Swing, groove templates, quantization and adjustable humanization.
- Sample and loop browser with tagging, preview, tempo/key metadata and favorites.
- Sampler with slicing, pitch, envelopes and playback modes.
- Synthesizer architecture for oscillators, filters, envelopes, LFOs and modulation.
- Instrument presets and user preset management.
- Built-in virtual instruments and sound packs, subject to licensing.

## 5. MIDI and arrangement

- Multitrack MIDI and audio timeline.
- Piano roll with note velocity, duration, pitch, expression and controller lanes.
- MIDI import/export and tempo-map handling.
- Audio clip trim, split, slip, duplicate, fade and crossfade.
- Grid, snap, loop regions, markers and selection tools.
- Tempo and time-signature changes over the song.
- Track groups, folders, colors, mute, solo, record-arm and automation.
- Undo/redo and non-destructive editing.
- Arrangement sections that can be reordered without flattening source material.

## 6. Vocal Studio

- Microphone recording, input monitoring and take management.
- Comping multiple takes into a selected performance.
- Punch-in/out, clip gain, timing alignment and pitch editing.
- Vocal layers, doubles, harmonies, backing vocals and ad-libs.
- Pitch correction and optional Auto-Tune-style workflows.
- Formant, vibrato, breath, expression and timing controls where supported.
- De-essing, noise reduction, gate, EQ, compression, saturation, reverb and delay.
- Optional synthetic vocals and text-to-singing providers.
- Vocal characteristics are configurable as broad descriptors (range, register, timbre, delivery and intensity).

Voice cloning or imitation of a real person requires explicit rights/consent and must not be used to impersonate or mislead. Provider terms and local law apply.

## 7. Mixing and effects

- Per-track volume, pan, polarity, mute, solo and routing.
- Inserts, sends, buses, subgroups and master bus.
- Parametric EQ, compressor, multiband dynamics, limiter, gate and de-esser.
- Reverb, delay, chorus, flanger, phaser, distortion and saturation.
- Sidechain routing and automation.
- Peak, RMS, LUFS, true-peak and stereo correlation meters.
- Reference-track A/B comparison.
- Plugin hosting is a capability target, not an assumption: VST3/LV2/AU support depends on the host platform, plugin licensing and sandbox constraints. Android/iOS parity may require built-in equivalents rather than desktop plugin binaries.

## 8. Mastering and delivery

- Mastering chain presets with editable parameters.
- Loudness and true-peak analysis.
- Clipping, phase and mono-compatibility checks.
- Reference comparison and export preview.
- WAV, MP3, AAC and FLAC export where supported by the platform codecs.
- Sample-rate and bit-depth selection.
- Stereo and mono output; multichannel export where supported.
- Instrumental, acapella and stem export.
- Stems can include vocals, drums, bass, music and user-defined groups.
- Export presets for streaming, video, social media, games and archival masters.
- Export metadata and cover-art association.

No mastering preset should be represented as a guaranteed commercial or platform-compliance certification.

## 9. Stem separation and audio utilities

- Optional source separation into vocal, drums, bass and other stems.
- Audio-to-MIDI and tempo/key detection as optional assisted tools.
- Noise reduction, silence detection, normalization and format conversion.
- Batch processing with progress, cancellation and recoverable jobs.
- Local processing where feasible; heavier AI models may require capable hardware or an explicitly selected external provider.

## 10. AI Music workspace

AI capabilities are optional provider adapters and may include:
- Text-to-music generation.
- Prompt-to-instrumental and prompt-to-song workflows.
- Lyric drafting and rewriting.
- Chord, melody, rhythm and arrangement suggestions.
- Vocal synthesis and singing generation.
- Stem separation and audio understanding.
- Style, mood, instrumentation, duration and structure controls.

The UI must identify whether a task runs locally or sends data to an external provider. External services may cost money, require accounts, impose generation limits or have usage restrictions. The app must not imply that every AI feature is free or offline.

## 11. Music video integration

A finished music project can be sent to Video Studio as:
- A music video timeline with the song placed as an audio master.
- Lyric video with timed lyrics.
- Audio-reactive visualizer.
- Short-form excerpts with user-selected sections.
- Cover-art animation and social-media variants.

The source music project remains editable and is not destructively flattened by video export.

## 12. Shared project model and portability

The music project must use a versioned, platform-independent manifest. It references audio/MIDI assets, track graphs, clips, automation, tempo maps, plugin/preset metadata and export settings. Media files remain in the user's local project storage unless the user explicitly exports or shares them.

Platform-specific audio engines are hidden behind adapters. The same project should open across supported platforms; unsupported plugins or unavailable instruments must be reported and handled with a safe fallback, not silently discarded.

## 13. Architecture principles

- Local-first recording, editing, MIDI, mixing and rendering.
- Shared project schema and UI logic across mobile and desktop.
- Native/platform audio backends behind a stable audio-engine interface.
- Non-destructive editing and undo/redo.
- Real-time audio work must use appropriate native/audio-thread code; do not run real-time DSP on the JavaScript UI thread.
- Background render and AI jobs must expose progress, cancellation and failure details.
- No secrets, API keys, private recordings or licensed sample packs in Git.
- Sample libraries, presets and bundled models require clear redistribution rights.

## 14. Delivery phases

### Music-0 — Specification
- [x] Product scope and architecture principles documented
- [ ] Music project manifest design
- [ ] Audio-engine and platform capability spike

### Music-1 — Local foundation
- [ ] Music project create/open/save
- [ ] Audio asset import and metadata
- [ ] Basic playback engine and transport
- [ ] Metronome, BPM and time signature
- [ ] Basic waveform and audio clip timeline

### Music-2 — MIDI and instruments
- [ ] Piano roll and MIDI editing
- [ ] Step sequencer
- [ ] Built-in drum machine and sampler
- [ ] Built-in synthesizer / virtual instrument foundation
- [ ] MIDI import/export

### Music-3 — Recording and mixing
- [ ] Audio recording and take management
- [ ] Multitrack mixer and routing
- [ ] Automation and built-in effects
- [ ] Vocal editing workflow

### Music-4 — Advanced production
- [ ] Advanced editing and arrangement
- [ ] Mastering analysis and export profiles
- [ ] Stem export and optional source separation
- [ ] Plugin-host capability evaluation per platform

### Music-5 — AI and video integration
- [ ] Provider adapter framework and privacy disclosures
- [ ] Optional AI songwriting/composition/generation
- [ ] Optional vocal synthesis
- [ ] Send music projects to Video Studio
- [ ] Lyric video and audio-reactive visualizer workflows

## 15. Definition of done

A feature is not complete merely because it appears in the interface or roadmap. It must have an implemented workflow, automated tests where practical, platform capability checks, documented limitations and acceptance testing on each supported target. Performance and available plugin formats may differ by hardware and operating system; project portability and safe fallback behavior remain required.
