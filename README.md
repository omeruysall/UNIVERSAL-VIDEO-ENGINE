# UNIVERSAL VIDEO ENGINE

Yerel öncelikli, modüler video üretim ve düzenleme platformu.

**Geliştirme ilkesi:** Temel işlevler kullanıcının kendi cihazında çalışır. Zorunlu bulut sunucusu, bulut veritabanı veya bulut medya depolama yoktur. GitHub yalnızca kaynak kodu, dokümantasyon ve sürüm yönetimi içindir.

## Proje durumu
- Aşama: V5.3 — Repository Initialization & Project Foundation
- Hedef cihaz: Android 16 / Samsung Galaxy A53 5G
- İlk ortam: Termux + Python + Node.js + FFmpeg
- Arayüz: React + TypeScript
- Yerel API: Python + FastAPI
- Veritabanı: SQLite
- Medya işleme: Yerel FFmpeg

## Yerel mimari
Android cihaz
- Termux: FastAPI, worker, FFmpeg ve yerel medya deposu
- Tarayıcı: localhost üzerinde React arayüzü
- SQLite: proje ve işlem metaverileri

Servisler varsayılan olarak yalnızca 127.0.0.1 üzerinde dinler. Harici erişim varsayılan olarak kapalıdır.

## İlk MVP
1. Yerel uygulama iskeleti ve sağlık kontrolü
2. Proje oluşturma, listeleme, kaydetme ve yeniden açma
3. Konu veya hazır prompt girişi (hazır prompt birebir korunur)
4. Video çıktı ayarları
5. Medyayı yerel depoya alma
6. Basit çok kanallı timeline
7. FFmpeg ile yerel MP4 dışa aktarma
8. İşlem durumu ve temel kalite kontrolü

## Geliştirme ilkeleri
- Önce yerel ve çevrimdışı temel işlevler.
- Harici AI sağlayıcıları zorunlu değildir; opsiyonel adaptörlerdir.
- Kullanıcı onayı olmadan ücretli servis veya dış ağa veri gönderimi yapılmaz.
- API anahtarları, kişisel medya ve veritabanı GitHub'a gönderilmez.
- Ağ erişimi gerektiren özellikler açıkça belirtilir ve varsayılan olarak kapalıdır.
- Büyük AI modelleri ve ağır 3D/render işlemleri cihaz kapasitesine göre sınırlandırılır.

## Dokümantasyon
- docs/architecture/overview.md
- docs/development/local-first.md
- docs/roadmap/mvp.md
- docs/security/local-security.md

Lisans henüz seçilmedi. Lisans kararı verilene kadar tüm haklar saklıdır.
