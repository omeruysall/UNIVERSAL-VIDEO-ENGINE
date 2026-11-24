# Yerel doğrulama

Bu proje için ilk otomatik API testleri `backend/tests/test_projects.py` içinde bulunur.

## Android / Termux veya PC

Repository kök dizininde:

```bash
python -m venv .venv
```

Termux / Linux / macOS:
```bash
source .venv/bin/activate
pip install -r backend/requirements-dev.txt
PYTHONPATH=backend pytest -q backend/tests
```

Windows PowerShell:
```powershell
.venv\Scripts\Activate.ps1
pip install -r backend/requirements-dev.txt
$env:PYTHONPATH = "backend"
pytest -q backend/tests
```

Testler geçmeden API'nin doğrulandığı kabul edilmez. Testler geçtikten sonra yerel API ve web arayüzü ayrıca birlikte çalıştırılmalıdır.
