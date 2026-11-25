# Local API

FastAPI + SQLite local service for UNIVERSAL VIDEO ENGINE.

## Run from repository root

Create and activate a virtual environment where supported:

```bash
python -m venv .venv
# Activate the virtual environment for your shell
python -m pip install -r backend/requirements.txt
python -m pip install -r backend/requirements-dev.txt
uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

The dependency set pins FastAPI to the 0.115 series and Pydantic to v1. Pydantic v1 does not require the Rust-based `pydantic-core` extension, which avoids a native Rust build on Android/Termux. Uvicorn is installed without its optional `standard` extras so Termux does not need to compile optional native file-watching packages. The same API and dependency set can be used on desktop Python.

## Android / Termux

Install Python and pip with Termux, then run:

```bash
pkg install python python-pip
python -m pip install -r backend/requirements.txt
python -m pip install -r backend/requirements-dev.txt
```

If a previous installation attempt left a partial environment, rerun the commands above after updating the repository. Do not install `uvicorn[standard]` on Termux.

The API binds to loopback only. The default SQLite database is created at `data/app.sqlite3`. Set `UVE_DATA_DIR` to choose another local data directory.

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/{project_id}`
- `PUT /api/v1/projects/{project_id}`
- `DELETE /api/v1/projects/{project_id}`

Project records use the versioned, platform-independent manifest contract from `packages/core`. No project or media data is uploaded to GitHub or a cloud service.

This is an initial local persistence layer. It does not yet manage imported media files, timeline editing, background jobs, migrations between manifest versions, or render operations.
