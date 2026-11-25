# UNIVERSAL VIDEO ENGINE

Yerel öncelikli ve hibrit çalışan, profesyonel yaratıcı üretim stüdyoları platformu.

**Ürün hedefi:** Android, iOS, Windows, macOS ve Linux üzerinde ortak proje formatı ve ortak üretim çekirdeğiyle video, müzik, ses, görsel, animasyon, 3D ve AI destekli üretim iş akışları sunmak.

**Ürün kapsamı:** Video Studio, Music Studio PRO, Audio Studio, Image Studio, Animation Studio, 3D Studio, AI Studio, Voice Studio, Subtitle Studio, Asset Manager, Template Library ve Render Center.

**Çalışma modeli:** Temel proje yönetimi, medya düzenleme ve desteklenen üretim işlemleri yerel çalışır. Harici AI ve bulut servisleri isteğe bağlıdır; kullanıcı onayı, sağlayıcı ve veri aktarımı açıklaması gerektirir. Bulut hesabı temel uygulama kullanımı için zorunlu değildir.

**Geliştirme stratejisi:** Professional; modüller aşamalı geliştirilir ve yalnızca kodlanıp test edilip hedef platformlarda doğrulandıklarında tamamlandı sayılır.

GitHub yalnızca kaynak kodu, dokümantasyon ve sürüm yönetimi içindir; kullanıcı medyası, proje verileri ve API anahtarları depoya gönderilmez.

## Proje durumu

- Aşama: V5.6 — Local Persistence, Migrations & API Test Foundation
- Ortak arayüz: React + TypeScript
- Ortak proje modeli: `packages/core`
- Yerel geliştirme API'si: Python + FastAPI
- Yerel veritabanı: SQLite
- Medya işleme hedefi: platform adaptörleri üzerinden yerel medya motorları
- Music Studio PRO ve diğer stüdyolar: ürün kapsamı/yol haritası; henüz tamamlanmış özellikler değildir

## Hedef platformlar

- Mobil: Android ve iOS
- Masaüstü: Windows, macOS ve Linux
- Geliştirme: Codespaces veya yerel geliştirme ortamı

Ortak UI, proje şeması, asset sistemi ve modül iş akışları kullanılacak. Özellik eşitliği hedeflenir; performans donanım ve işletim sistemine göre değişebilir.

## Mevcut kod kapsamı

- Yerel API sağlık kontrolü
- Sürümlü SQLite migration altyapısı (ilk migration)
- SQLite proje kayıt tablosu
- Proje oluşturma, listeleme, tekil proje okuma, güncelleme ve silme API uçları
- Proje oluşturma arayüzü
- Konu veya hazır prompt girişi
- Hazır promptun kaynak metnini dönüştürmeden saklama
- Video, ses, görsel ve animasyon çıktı türleri için temel ayarlar
- Ana video, seslendirme, altyazı, ekran yazısı ve metadata için bağımsız çoklu dil ayarları
- Ortak TypeScript proje manifesti ve runtime doğrulayıcısı

**Test durumu:** Kodlanmış özellikler, hedef mobil ve masaüstü cihazlarda doğrulanmış ürün özellikleri olarak değerlendirilmemelidir. Test ve kabul aşamaları yol haritasında ayrıca izlenir.

## Ana dokümantasyon

- `docs/architecture/overview.md`
- `docs/architecture/platform-parity.md`
- `docs/development/local-first.md`
- `docs/development/project-persistence.md`
- `docs/roadmap/mvp.md`
- `docs/music-studio/professional-spec.md`
- `docs/security/local-security.md`

Lisans henüz seçilmedi. Lisans kararı verilene kadar tüm haklar saklıdır.
