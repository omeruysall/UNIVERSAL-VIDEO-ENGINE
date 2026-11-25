import { isProjectManifest } from "./project";
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

function isIsoDateTime(value: string): boolean {
  return /^\\d{4}-\\d{2}-\\d{2}T/.test(value) &&
    Number.isFinite(Date.parse(value));
}

export function isStudioDocument(value: unknown): value is StudioDocument {
  if (!isRecord(value)) return false;
  if (
    typeof value.id !== "string" || value.id.trim().length === 0 ||
    !isStudioType(value.studioType) ||
    !Number.isInteger(value.documentVersion) || (value.documentVersion as number) < 1 ||
    typeof value.title !== "string" || value.title.trim().length === 0 ||
    typeof value.createdAt !== "string" || !isIsoDateTime(value.createdAt) ||
    typeof value.updatedAt !== "string" || !isIsoDateTime(value.updatedAt) ||
    !isRecord(value.data)
  ) return false;

  if (
    value.assetIds !== undefined &&
    (!Array.isArray(value.assetIds) ||
      !value.assetIds.every((assetId) => typeof assetId === "string" && assetId.trim().length > 0))
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
  if (!isProjectManifest(legacyShape)) return false;

  const studios = value.studios;
  if (!studios.every(isStudioDocument)) return false;

  const studioIds = studios.map((studio) => (studio as StudioDocument).id);
  if (new Set(studioIds).size !== studioIds.length) return false;

  // A studio may only reference assets registered in the shared project manifest.
  const assets = value.assets;
  if (!Array.isArray(assets)) return false;
  const assetIds = new Set<string>();
  for (const asset of assets) {
    if (!isRecord(asset) || typeof asset.id !== "string" || asset.id.trim().length === 0) {
      return false;
    }
    if (assetIds.has(asset.id)) return false;
    assetIds.add(asset.id);
  }

  return studios.every((studio) =>
    ((studio as StudioDocument).assetIds ?? []).every((assetId) => assetIds.has(assetId))
  );
}

/**
 * Deterministically upgrades a valid v1 manifest in memory.
 * The input is never mutated and all v1 project fields are retained unchanged.
 */
export function migrateProjectV1ToV2(value: unknown): ProjectManifestV2 | null {
  if (!isProjectManifest(value)) return null;

  const migrated: ProjectManifestV2 = {
    ...value,
    schemaVersion: 2,
    studios: [],
  };

  return migrated;
}

