# İlk MVP Yol Haritası

## MVP-0 — Foundation
- [x] GitHub deposu ve başlangıç dokümantasyonu
- [x] React + TypeScript arayüz iskeleti
- [x] FastAPI yerel API iskeleti
- [x] Mobil + PC özellik eşitliği mimari kararı
- [x] SQLite ile ilk proje kayıt tablosu ve CRUD altyapısı (kodlandı; cihaz testi bekliyor)
- [x] SQLite migration/version yönetimi (migration 1)
- [x] Yerel API için otomatik CRUD/validasyon testlerinin yazılması (çalıştırma bekliyor)
- [ ] Yerel sağlık kontrolünün cihazda doğrulanması
- [ ] Android/Termux geliştirme ortamı doğrulaması
- [ ] Masaüstü geliştirme ortamında kurulum doğrulaması

## MVP-1 — Shared Core & Project
- [x] Platformdan bağımsız TypeScript proje manifesti
- [x] Manifest için ilk runtime doğrulayıcı
- [x] Project Manifest v1 JSON Schema
- [ ] Manifest migration sistemi
- [x] Proje oluşturma/listeleme/açma API ve arayüzü (kodlandı; cihaz testi bekliyor)
- [x] Konu ve hazır prompt modları
- [x] Hazır prompt metnini dönüştürmeden saklama
- [x] Video/ses/görsel/animasyon çıktı türü ve türe uygun format/teknik ayarlar
- [x] Ana video, seslendirme, altyazı, ekran yazısı ve metadata için bağımsız çoklu dil alanları
- [ ] Proje manifestinin mobil ve masaüstünde aynı şekilde açılması ve kabul testi
- [ ] Proje güncelleme akışının arayüze eklenmesi

## MVP-2 — Local Assets & Timeline
- [ ] Platform dosya sistemi adaptörleri
- [ ] Yerel medya içe aktarma
- [ ] Dosya doğrulama ve metadata
- [ ] Asset Manager
- [ ] Basit çok kanallı timeline
- [ ] Klip yerleştirme, kesme ve sıralama
- [ ] Mobil ve PC için ortak timeline kabul testleri

## MVP-3 — Local Render
- [ ] FFmpeg capability kontrolü ve platform adaptörleri
- [ ] Yerel render kuyruğu
- [ ] MP4/H.264/AAC ilk export profili
- [ ] İlerleme, iptal ve hata kayıtları
- [ ] Temel çıktı kalite kontrolü
- [ ] Mobil ve PC render uyumluluk testleri

## MVP-4 — Stabilizasyon & Packaging
- [ ] Birim ve entegrasyon testleri
- [ ] Uygulama kapanması sonrası iş kurtarma
- [ ] Yedekleme ve geri yükleme testi
- [ ] Android performans ve ısı testleri
- [ ] Windows/macOS/Linux paketleme PoC
- [ ] Android/iOS paketleme PoC
- [ ] Platformlar arası proje aktarım testi

## Kabul ilkesi
Bir özellik yalnızca tasarımı yazıldı diye tamamlanmış sayılmaz. Kodlanması, test edilmesi ve hedef cihazlarda doğrulanması gerekir. Özellik eşitliği kabul kriteridir; donanım performansının eşit olması şart değildir.

## Music Studio PRO — Ayrı ürün modülü

Music Studio PRO, video MVP'sinden ayrı bir profesyonel müzik üretim ve düzenleme modülü olarak planlandı. Ayrıntılı kapsam: [professional-spec.md](../music-studio/professional-spec.md).

- [x] Ürün kapsamı ve mimari ilkeler dokümante edildi
- [ ] Müzik proje manifesti tasarımı
- [ ] Platform ses motoru teknik doğrulaması
- [ ] BPM, ölçü, ton ve transport
- [ ] Çok kanallı ses timeline'ı ve waveform
- [ ] MIDI Piano Roll ve step sequencer
- [ ] Drum machine, sampler ve sanal enstrümanlar
- [ ] Ses kaydı ve Vocal Studio
- [ ] Mixer, routing, otomasyon ve efektler
- [ ] Mastering analizi, WAV/MP3/FLAC dışa aktarma
- [ ] Stem export ve opsiyonel stem separation
- [ ] İsteğe bağlı AI songwriting, composition ve music generation
- [ ] Music Studio projesini Video Studio'ya aktarma

Bu maddeler planlanan kapsamdır; henüz uygulanmış özellikler olarak değerlendirilmemelidir.
