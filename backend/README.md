# Local API

FastAPI + SQLite local service for UNIVERSAL VIDEO ENGINE.

## Run from repository root

```bash
python -m venv .venv
# Activate the virtual environment for your shell
pip install -r backend/requirements.txt
uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

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
