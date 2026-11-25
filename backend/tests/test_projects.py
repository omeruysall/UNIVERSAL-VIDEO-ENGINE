import uuid

import pytest
from fastapi.testclient import TestClient

from app import main


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(main, "DATA_DIR", tmp_path)
    monkeypatch.setattr(main, "DATABASE_PATH", tmp_path / "test.sqlite3")
    with TestClient(main.app) as test_client:
        yield test_client


def project_payload():
    project_id = str(uuid.uuid4())
    timestamp = "2026-11-24T12:00:00+00:00"
    manifest = {
        "schemaVersion": 1,
        "id": project_id,
        "title": "Test Project",
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "languages": {
            "video": "tr",
            "voiceover": ["tr", "en"],
            "subtitles": ["en"],
            "onScreenText": ["tr"],
            "metadata": ["tr", "en"],
        },
        "prompt": {"mode": "ready_prompt", "originalText": "  exact prompt  "},
        "output": {
            "kind": "video",
            "format": "mp4",
            "orientation": "landscape",
            "width": 1920,
            "height": 1080,
            "fps": 30,
        },
        "assets": [],
        "timeline": {"durationMs": 0, "tracks": []},
    }
    return {"id": project_id, "title": "Test Project", "manifest": manifest}


def test_health_reports_local_sqlite(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["mode"] == "local"
    assert response.json()["database"] == "sqlite"
    assert response.json()["database_schema_version"] == 1


def test_project_create_read_update_delete(client):
    payload = project_payload()

    created = client.post("/api/v1/projects", json=payload)
    assert created.status_code == 201
    assert created.json()["manifest"]["prompt"]["originalText"] == "  exact prompt  "

    project_id = payload["id"]
    listed = client.get("/api/v1/projects")
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    opened = client.get(f"/api/v1/projects/{project_id}")
    assert opened.status_code == 200
    assert opened.json()["manifest"] == payload["manifest"]

    updated_payload = project_payload()
    updated_payload["id"] = project_id
    updated_payload["manifest"]["id"] = project_id
    updated_payload["title"] = "Updated Project"
    updated_payload["manifest"]["title"] = "Updated Project"
    updated = client.put(f"/api/v1/projects/{project_id}", json=updated_payload)
    assert updated.status_code == 200
    assert updated.json()["title"] == "Updated Project"

    deleted = client.delete(f"/api/v1/projects/{project_id}")
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/projects/{project_id}").status_code == 404


def test_rejects_invalid_output_profile(client):
    payload = project_payload()
    payload["manifest"]["output"] = {
        "kind": "audio",
        "format": "wav",
        "sampleRate": 0,
        "channels": 2,
    }
    response = client.post("/api/v1/projects", json=payload)
    assert response.status_code == 422


def test_rejects_duplicate_project_id(client):
    payload = project_payload()
    assert client.post("/api/v1/projects", json=payload).status_code == 201
    assert client.post("/api/v1/projects", json=payload).status_code == 409



def test_v2_project_create_read_preserves_studio_documents(client):
    payload = project_payload()
    payload["manifest"]["schemaVersion"] = 2
    payload["manifest"]["studios"] = [
        {
            "id": "music-main",
            "studioType": "music",
            "documentVersion": 1,
            "title": "Music Draft",
            "createdAt": "2026-11-24T12:00:00+00:00",
            "updatedAt": "2026-11-24T12:00:00+00:00",
            "assetIds": [],
            "data": {"bpm": 92, "genre": "melodic-rap"},
        }
    ]

    created = client.post("/api/v1/projects", json=payload)
    assert created.status_code == 201
    assert created.json()["manifest"] == payload["manifest"]

    opened = client.get(f"/api/v1/projects/{payload['id']}")
    assert opened.status_code == 200
    assert opened.json()["manifest"] == payload["manifest"]
    assert opened.json()["manifest"]["studios"][0]["data"]["bpm"] == 92


def test_v2_rejects_duplicate_studio_document_ids(client):
    payload = project_payload()
    payload["manifest"]["schemaVersion"] = 2
    studio = {
        "id": "duplicate",
        "studioType": "video",
        "documentVersion": 1,
        "title": "Video Draft",
        "createdAt": "2026-11-24T12:00:00+00:00",
        "updatedAt": "2026-11-24T12:00:00+00:00",
        "data": {},
    }
    payload["manifest"]["studios"] = [studio, dict(studio)]
    response = client.post("/api/v1/projects", json=payload)
    assert response.status_code == 422


def test_v2_rejects_invalid_studio_document(client):
    payload = project_payload()
    payload["manifest"]["schemaVersion"] = 2
    payload["manifest"]["studios"] = [{
        "id": "bad-studio",
        "studioType": "unknown",
        "documentVersion": 0,
        "title": "Broken",
        "createdAt": "2026-11-24T12:00:00+00:00",
        "updatedAt": "2026-11-24T12:00:00+00:00",
        "data": {},
    }]
    response = client.post("/api/v1/projects", json=payload)
    assert response.status_code == 422


def test_v1_project_storage_remains_backward_compatible(client):
    payload = project_payload()
    created = client.post("/api/v1/projects", json=payload)
    assert created.status_code == 201
    opened = client.get(f"/api/v1/projects/{payload['id']}")
    assert opened.status_code == 200
    assert opened.json()["manifest"] == payload["manifest"]
