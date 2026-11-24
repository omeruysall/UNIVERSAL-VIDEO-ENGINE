# UNIVERSAL VIDEO ENGINE

Yerel öncelikli, modüler video üretim ve düzenleme platformu.

**Ürün hedefi:** Android, iOS, Windows, macOS ve Linux üzerinde aynı temel özellikleri sunan; ortak proje formatı ve ortak üretim çekirdeği kullanan mobil + masaüstü uygulaması.

**Geliştirme ilkesi:** Temel işlevler kullanıcının kendi cihazında çalışır. Zorunlu bulut sunucusu, bulut veritabanı veya bulut medya depolama yoktur. GitHub yalnızca kaynak kodu, dokümantasyon ve sürüm yönetimi içindir.

## Proje durumu
- Aşama: V5.5 — Local Project Persistence
- Ortak arayüz: React + TypeScript
- Ortak proje modeli ve runtime guard: `packages/core`
- Yerel geliştirme API'si: Python + FastAPI
- Yerel veritabanı: SQLite
- Medya işleme hedefi: platform adaptörü üzerinden yerel FFmpeg

## Hedef platformlar
- Mobil: Android ve iOS
- Masaüstü: Windows, macOS ve Linux
- Geliştirme: yerel tarayıcı arayüzü

Mobil ve PC için ayrı ürün mantıkları oluşturulmayacak. Responsive arayüz, ortak proje şeması, ortak timeline modeli ve platform adaptörleri kullanılacak. Özellik eşitliği hedeflenir; donanım ve işletim sistemi farklılıkları nedeniyle performans aynı olmak zorunda değildir.

## Mevcut kod kapsamı
- Yerel API sağlık kontrolü
- SQLite proje kayıt tablosu
- Proje oluşturma, listeleme, tekil proje okuma, güncelleme ve silme API uçları
- Proje oluşturma arayüzü
- Konu veya hazır prompt girişi
- Hazır promptun kaynak metnini dönüştürmeden saklama
- MP4/MOV/WebM seçimi, yön, çözünürlük ve FPS ayarları
- Kayıtlı projeyi açma ve temel bilgilerini görüntüleme
- Ortak TypeScript proje manifesti ve runtime doğrulayıcısı

**Test durumu:** Kod GitHub'a kaydedildi. Henüz Android, iOS veya masaüstü cihazda derleme/çalıştırma ve kabul testleri tamamlanmadı. Bu nedenle bu özellikler yerel ortamda doğrulanmış sayılmaz.

## Yerel mimari
- Shared UI: React + TypeScript
- Shared Core: proje, prompt, timeline, dil, çıktı ve iş akışı kuralları
- Mobil kabuk: Capacitor PoC (teknik doğrulama gerekli)
- Masaüstü kabuk: Tauri PoC (teknik doğrulama gerekli)
- Platform adaptörleri: dosya sistemi, SQLite, medya seçici, arka plan işi ve render
- FastAPI: ilk geliştirme/yerel worker bileşeni; mobil uygulama Termux veya harici Python kurulumuna bağımlı olmayacak

## İlk MVP
1. Ortak proje şeması ve yerel uygulama iskeleti
2. Proje oluşturma, listeleme, kaydetme ve yeniden açma
3. Konu veya hazır prompt girişi (hazır prompt birebir korunur)
4. Video çıktı ayarları
5. Medyayı yerel depoya alma
6. Basit çok kanallı timeline
7. FFmpeg ile yerel MP4 dışa aktarma
8. İşlem durumu ve temel kalite kontrolü
9. Aynı proje dosyasını mobil ve PC arasında aktararak açma testi

## Geliştirme ilkeleri
- Önce yerel ve çevrimdışı temel işlevler.
- Harici AI sağlayıcıları zorunlu değildir; opsiyonel adaptörlerdir.
- Kullanıcı onayı olmadan ücretli servis veya dış ağa veri gönderimi yapılmaz.
- API anahtarları, kişisel medya ve veritabanı GitHub'a gönderilmez.
- Ağ erişimi gerektiren özellikler açıkça belirtilir ve varsayılan olarak kapalıdır.
- Büyük AI modelleri ve ağır 3D/render işlemleri cihaz kapasitesine göre sınırlandırılır.
- Her ortak özellik mobil ve masaüstünde aynı kabul senaryolarıyla test edilir.

## Dokümantasyon
- docs/architecture/overview.md
- docs/architecture/platform-parity.md
- docs/development/local-first.md
- docs/development/project-persistence.md
- docs/roadmap/mvp.md
- docs/security/local-security.md

Lisans henüz seçilmedi. Lisans kararı verilene kadar tüm haklar saklıdır.
