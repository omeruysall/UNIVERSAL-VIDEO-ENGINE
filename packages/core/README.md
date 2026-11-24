# @uve/core

Platform-independent TypeScript contracts shared by mobile and desktop clients.

Initial scope:
- Portable project manifest
- Independent project, voice-over, subtitle, on-screen text and metadata languages
- Topic vs. ready-made prompt input modes
- Asset references based on IDs and project-relative paths
- Basic multi-track timeline model

A ready-made prompt's `originalText` is source data and must be preserved byte-for-byte at the application string level. Any derived scene, camera, sound or effects plan belongs in separate fields; it must not overwrite the original prompt.

This package currently defines contracts only. Runtime validation, migrations, persistence adapters and cross-platform tests are not implemented yet.


## Portable schema

The JSON Schema for manifest version 1 is stored at `schema/project-manifest.v1.schema.json`. Keep the TypeScript contract, runtime guard and JSON Schema aligned. A schema-version migration plan is still required before introducing version 2.
