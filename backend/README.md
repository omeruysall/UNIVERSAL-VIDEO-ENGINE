# Local API

Proje kökünden yerel sanal ortamı oluştur ve bağımlılıkları kur:

    python -m venv .venv
    source .venv/bin/activate
    pip install -r backend/requirements.txt
    uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000

Sağlık kontrolü: http://127.0.0.1:8000/api/v1/health

API yalnızca loopback üzerinde başlatılır. 0.0.0.0 ile dış ağa açma.