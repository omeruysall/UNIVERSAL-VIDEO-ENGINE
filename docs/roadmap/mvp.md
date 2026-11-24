# İlk MVP Yol Haritası

## MVP-0 — Foundation
- [x] GitHub deposu ve başlangıç dokümantasyonu
- [x] React + TypeScript arayüz iskeleti
- [x] FastAPI yerel API iskeleti
- [x] Mobil + PC özellik eşitliği mimari kararı
- [ ] SQLite bağlantısı ve migration yaklaşımı
- [ ] Yerel sağlık kontrolünün cihazda doğrulanması
- [ ] Android/Termux geliştirme ortamı doğrulaması
- [ ] Masaüstü geliştirme ortamında kurulum doğrulaması

## MVP-1 — Shared Core & Project
- [ ] Platformdan bağımsız TypeScript Shared Core
- [ ] Sürümlü ortak proje manifesti ve JSON şeması
- [ ] Proje oluşturma/listeleme/açma
- [ ] Konu ve hazır prompt modları
- [ ] Hazır prompt metninin birebir korunması
- [ ] Video çıktı türü, format, yön, çözünürlük ve FPS ayarları
- [ ] Proje manifestinin mobil ve masaüstünde aynı şekilde okunması

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
