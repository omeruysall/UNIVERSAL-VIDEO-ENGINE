import type { ProjectManifest } from "./project";

export const STUDIO_TYPES = [
  "video",
  "music",
  "audio",
  "image",
  "animation",
  "3d",
] as const;

export type StudioType = (typeof STUDIO_TYPES)[number];

export interface StudioDocument<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  studioType: StudioType;
  /** Version of this studio document's own data contract. */
  documentVersion: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  /** Shared project asset IDs referenced by this document. */
  assetIds?: string[];
  /** Studio-specific data. Its validator is owned by the studio module. */
  data: TData;
}

export type ProjectManifestV2 = Omit<ProjectManifest, "schemaVersion"> & {
  schemaVersion: 2;
  studios: StudioDocument[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStudioType(value: unknown): value is StudioType {
  return typeof value === "string" &&
    (STUDIO_TYPES as readonly string[]).includes(value);
}

export function isStudioDocument(value: unknown): value is StudioDocument {
  if (!isRecord(value)) return false;
  if (
    typeof value.id !== "string" || value.id.trim().length === 0 ||
    !isStudioType(value.studioType) ||
    !Number.isInteger(value.documentVersion) || (value.documentVersion as number) < 1 ||
    typeof value.title !== "string" ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string" ||
    !isRecord(value.data)
  ) return false;

  if (
    value.assetIds !== undefined &&
    (!Array.isArray(value.assetIds) ||
      !value.assetIds.every((assetId) => typeof assetId === "string" && assetId.length > 0))
  ) return false;

  return true;
}

/** Validates the v2 envelope while delegating studio payload validation to each module. */
export function isProjectManifestV2(value: unknown): value is ProjectManifestV2 {
  if (!isRecord(value) || value.schemaVersion !== 2 || !Array.isArray(value.studios)) {
    return false;
  }

  const legacyShape = { ...value, schemaVersion: 1 };
  // The v1 guard validates all shared project fields; v2 adds only the studio registry.
  const { isProjectManifest } = requireProjectValidator();
  if (!isProjectManifest(legacyShape)) return false;

  const studios = value.studios;
  if (!studios.every(isStudioDocument)) return false;

  const ids = studios.map((studio) => (studio as StudioDocument).id);
  return new Set(ids).size === ids.length;
}

/**
 * Deterministically upgrades a valid v1 manifest in memory.
 * The input is never mutated and all v1 project fields are retained unchanged.
 */
export function migrateProjectV1ToV2(value: unknown): ProjectManifestV2 | null {
  const { isProjectManifest } = requireProjectValidator();
  if (!isProjectManifest(value)) return null;

  const migrated: ProjectManifestV2 = {
    ...value,
    schemaVersion: 2,
    studios: [],
  };

  return migrated;
}

// Kept as a static import boundary to avoid a project.ts -> studio.ts cycle.
function requireProjectValidator(): typeof import("./project") {
  return projectValidator;
}

import * as projectValidator from "./project";
