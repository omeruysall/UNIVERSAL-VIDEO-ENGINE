import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


APP_VERSION = "0.2.0"
REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.environ.get("UVE_DATA_DIR", REPOSITORY_ROOT / "data")).expanduser()
DATABASE_PATH = DATA_DIR / "app.sqlite3"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


@contextmanager
def db_session():
    connection = get_connection()
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database() -> None:
    with db_session() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                applied_at TEXT NOT NULL
            )
            """
        )
        applied = {
            row["version"]
            for row in connection.execute("SELECT version FROM schema_migrations").fetchall()
        }

        # Migration 1: initial local project persistence.
        if 1 not in applied:
            connection.execute(
                """
                CREATE TABLE projects (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    manifest_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                "CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC)"
            )
            connection.execute(
                "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
                (1, "initial_project_storage", utc_now()),
            )


class ProjectWrite(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    title: str = Field(min_length=1, max_length=160)
    manifest: dict


def validate_project(payload: ProjectWrite) -> str:
    try:
        project_id = str(UUID(payload.id))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Project id must be a valid UUID") from exc

    if payload.manifest.get("schemaVersion") != 1:
        raise HTTPException(status_code=422, detail="Unsupported project schemaVersion")
    if payload.manifest.get("id") != project_id:
        raise HTTPException(status_code=422, detail="Manifest id must match project id")
    if payload.manifest.get("title") != payload.title:
        raise HTTPException(status_code=422, detail="Manifest title must match project title")

    required = ("languages", "output", "assets", "timeline", "createdAt", "updatedAt")
    missing = [key for key in required if key not in payload.manifest]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing manifest fields: {', '.join(missing)}")
    if not isinstance(payload.manifest["assets"], list):
        raise HTTPException(status_code=422, detail="assets must be an array")
    if not isinstance(payload.manifest["timeline"], dict):
        raise HTTPException(status_code=422, detail="timeline must be an object")

    languages = payload.manifest["languages"]
    language_arrays = ("voiceover", "subtitles", "onScreenText", "metadata")
    if not isinstance(languages, dict) or not isinstance(languages.get("video"), str) or not languages["video"].strip():
        raise HTTPException(status_code=422, detail="languages.video must be a string")
    if any(
        not isinstance(languages.get(key), list)
        or not all(isinstance(item, str) for item in languages[key])
        for key in language_arrays
    ):
        raise HTTPException(status_code=422, detail="Language selections must be string arrays")

    output = payload.manifest["output"]
    if not isinstance(output, dict) or not isinstance(output.get("format"), str):
        raise HTTPException(status_code=422, detail="output and output.format are required")
    output_kind = output.get("kind")
    if output_kind == "audio":
        if not isinstance(output.get("sampleRate"), int) or output["sampleRate"] <= 0:
            raise HTTPException(status_code=422, detail="Audio sampleRate must be a positive integer")
        if not isinstance(output.get("channels"), int) or output["channels"] <= 0:
            raise HTTPException(status_code=422, detail="Audio channels must be a positive integer")
    elif output_kind in ("video", "image", "animation"):
        if output.get("orientation") not in ("landscape", "portrait", "square", "custom"):
            raise HTTPException(status_code=422, detail="Invalid output orientation")
        for dimension in ("width", "height"):
            if not isinstance(output.get(dimension), int) or output[dimension] <= 0:
                raise HTTPException(status_code=422, detail=f"output.{dimension} must be a positive integer")
        if output_kind in ("video", "animation"):
            if not isinstance(output.get("fps"), (int, float)) or output["fps"] <= 0:
                raise HTTPException(status_code=422, detail="Video/animation fps must be positive")
    else:
        raise HTTPException(status_code=422, detail="Unsupported output kind")

    return project_id


app = FastAPI(
    title="UNIVERSAL VIDEO ENGINE Local API",
    version=APP_VERSION,
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.on_event("startup")
def startup() -> None:
    initialize_database()


@app.get("/api/v1/health")
def health() -> dict:
    initialize_database()
    with db_session() as connection:
        connection.execute("SELECT 1")
    with db_session() as connection:
        migration = connection.execute(
            "SELECT MAX(version) AS version FROM schema_migrations"
        ).fetchone()
    return {
        "status": "ok",
        "application": "universal-video-engine",
        "mode": "local",
        "database": "sqlite",
        "database_schema_version": migration["version"] or 0,
        "version": APP_VERSION,
    }


@app.get("/api/v1/projects")
def list_projects() -> list[dict]:
    initialize_database()
    with db_session() as connection:
        rows = connection.execute(
            """
            SELECT id, title, created_at, updated_at
            FROM projects
            ORDER BY updated_at DESC
            """
        ).fetchall()
    return [dict(row) for row in rows]


@app.post("/api/v1/projects", status_code=201)
def create_project(payload: ProjectWrite) -> dict:
    project_id = validate_project(payload)
    created_at = payload.manifest["createdAt"]
    updated_at = payload.manifest["updatedAt"]
    manifest_json = json.dumps(payload.manifest, ensure_ascii=False, separators=(",", ":"))

    try:
        with db_session() as connection:
            connection.execute(
                """
                INSERT INTO projects (id, title, manifest_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (project_id, payload.title, manifest_json, created_at, updated_at),
            )
    except sqlite3.IntegrityError as exc:
        raise HTTPException(status_code=409, detail="Project already exists") from exc

    return {
        "id": project_id,
        "title": payload.title,
        "created_at": created_at,
        "updated_at": updated_at,
        "manifest": payload.manifest,
    }


@app.get("/api/v1/projects/{project_id}")
def get_project(project_id: str) -> dict:
    try:
        normalized_id = str(UUID(project_id))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Invalid project id") from exc

    with db_session() as connection:
        row = connection.execute(
            "SELECT * FROM projects WHERE id = ?", (normalized_id,)
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "id": row["id"],
        "title": row["title"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "manifest": json.loads(row["manifest_json"]),
    }


@app.put("/api/v1/projects/{project_id}")
def update_project(project_id: str, payload: ProjectWrite) -> dict:
    try:
        normalized_id = str(UUID(project_id))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Invalid project id") from exc

    payload_id = validate_project(payload)
    if payload_id != normalized_id:
        raise HTTPException(status_code=422, detail="Path id must match project id")

    manifest_json = json.dumps(payload.manifest, ensure_ascii=False, separators=(",", ":"))
    updated_at = payload.manifest["updatedAt"]

    with db_session() as connection:
        cursor = connection.execute(
            """
            UPDATE projects
            SET title = ?, manifest_json = ?, updated_at = ?
            WHERE id = ?
            """,
            (payload.title, manifest_json, updated_at, normalized_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found")

    return {
        "id": normalized_id,
        "title": payload.title,
        "created_at": payload.manifest["createdAt"],
        "updated_at": updated_at,
        "manifest": payload.manifest,
    }


@app.delete("/api/v1/projects/{project_id}", status_code=204)
def delete_project(project_id: str) -> None:
    try:
        normalized_id = str(UUID(project_id))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Invalid project id") from exc

    with db_session() as connection:
        cursor = connection.execute("DELETE FROM projects WHERE id = ?", (normalized_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found")
    return None
