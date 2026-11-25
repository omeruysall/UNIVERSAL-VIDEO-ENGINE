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
- [ ] GitHub Codespaces geliştirme ortamı ve bağımlılık doğrulaması
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


# Ürün Yol Haritası — Professional Hybrid Studio

Bu üst yol haritası mevcut MVP görevlerini silmez veya tamamlandı durumuna getirmez. MVP altyapısı korunur; aşağıdaki ürün fazları onun üzerine inşa edilir.

## Karar kaydı

- [x] Kapsam: Everything — tüm yaratıcı stüdyolar tek platformda.
- [x] Strateji: Professional — profesyonel iş akışları ve kalite hedefi; aşamalı teslimat.
- [x] Çalışma modeli: Hybrid — yerel üretim öncelikli, isteğe bağlı harici AI/bulut sağlayıcıları.
- [x] Kullanıcı onayı olmadan harici sağlayıcıya medya/proje içeriği gönderilmemesi.
- [x] Ortak proje, asset, görev ve render altyapısı.
- [x] Mobil, masaüstü ve web geliştirme ortamlarının birbirinden ayrılması.

## Faz 0 — Mevcut temeli doğrula

- [ ] Codespaces ortamında Node/Python bağımlılıklarını kurma
- [ ] Backend testlerini çalıştırma ve hataları düzeltme
- [ ] Frontend ve Shared Core build/test
- [ ] SQLite CRUD ve migration testleri
- [ ] Mevcut proje akışının tarayıcıda uçtan uca doğrulanması
- [ ] Kilit dosyası ve bağımlılıkların sürüm kontrolüne alınması
- [ ] Mevcut özelliklerin kod/test/cihaz doğrulama durumlarını ayıran durum tablosu

## Faz 1 — Ortak profesyonel çekirdek

- [ ] Sürümlü ana proje manifestini stüdyo belgelerini kapsayacak şekilde genişletme
- [ ] Manifest migration ve geriye dönük uyumluluk
- [ ] Studio document registry ve modül kayıt sistemi
- [ ] Ortak Asset Manager veri modeli
- [ ] Medya metadata, hash, proxy, thumbnail ve relink altyapısı
- [ ] Ortak görev kuyruğu: progress, cancel, retry, recovery
- [ ] Undo/redo ve non-destructive edit komut modeli
- [ ] Autosave, version history ve backup/restore
- [ ] Ortak render job ve export profile modeli
- [ ] Yerel depolama adaptör arayüzleri

## Faz 2 — Video Studio PRO

- [ ] Çok kanallı video/audio/text/graphics timeline
- [ ] Kesme, trim, split, ripple, slip, fade ve crossfade
- [ ] Storyboard ve sahne planlayıcı
- [ ] Geçişler, efektler, compositing ve overlay
- [ ] Renk düzeltme ve color grading
- [ ] Motion graphics ve keyframe otomasyonu
- [ ] Altyazı editörü ve çoklu dil varyantları
- [ ] Proxy media ve akıcı önizleme
- [ ] Yerel render engine ve render kuyruğu
- [ ] MP4/H.264/AAC başlangıç profili; sonra ek codec/profil desteği
- [ ] Render kalite kontrolü, iptal ve kurtarma

## Faz 3 — Audio Studio ve Music Studio PRO

- [ ] Platform ses motoru PoC ve gecikme/cihaz yeteneği ölçümü
- [ ] Müzik proje manifesti ve music session modeli
- [ ] BPM, tempo map, ölçü, ton, metronom ve transport
- [ ] Waveform ve çok kanallı audio timeline
- [ ] MIDI Piano Roll, step sequencer ve MIDI import/export
- [ ] Drum machine, sampler, synth ve sanal enstrüman temeli
- [ ] Mikrofon kaydı, take yönetimi ve Vocal Studio
- [ ] Mixer, routing, bus, automation ve built-in effects
- [ ] EQ, compression, reverb, delay, limiter ve analiz araçları
- [ ] Mastering ve WAV/MP3/AAC/FLAC dışa aktarma
- [ ] Stem export; uygun donanım/sağlayıcıyla isteğe bağlı stem separation
- [ ] Music Studio projesini Video Studio'ya aktarma
- [ ] Mobil ve masaüstü ses yetenekleri için ayrı kabul testleri

## Faz 4 — Image, Animation ve 3D Studio

- [ ] Katmanlı Image Studio belge modeli
- [ ] Crop, transform, mask, text, blend ve temel image effects
- [ ] Raster format içe/dışa aktarma
- [ ] Frame-based Animation Studio ve timeline
- [ ] GIF ve animated WebP export
- [ ] Keyframe, easing ve motion path
- [ ] 3D scene, camera, light, material ve object belge modeli
- [ ] 3D model import/export ve format yetenek matrisi
- [ ] 3D render PoC ve cihaz kapasite profilleri
- [ ] Bu modüller arasında ortak asset alışverişi

## Faz 5 — AI Studio ve Hybrid Provider Gateway

- [ ] Provider Gateway arayüzü ve sağlayıcı adaptör sözleşmesi
- [ ] Model capability discovery ve görev türü eşleştirme
- [ ] Yerel model runtime PoC (cihaz kapasitesi uygunsa)
- [ ] İsteğe bağlı harici metin/görsel/video/müzik/ses sağlayıcıları
- [ ] Her görev öncesi sağlayıcı, veri aktarımı, internet ve ücret/kota bildirimi
- [ ] Göreve özel açık kullanıcı onayı
- [ ] API anahtarlarını güvenli platform depolamasında saklama
- [ ] Kullanım/maliyet geçmişi ve kota uyarıları
- [ ] Prompt library, prompt versioning ve generation history
- [ ] AI çıktılarının kullanıcı onayıyla projeye alınması
- [ ] Sağlayıcı hatası, timeout, retry ve iptal yönetimi
- [ ] Kullanıcı verisini sağlayıcıya göndermeyen yerel fallback akışları

## Faz 6 — Voice, Subtitle ve Smart Production

- [ ] Voice Studio kayıt ve seslendirme iş akışı
- [ ] Metinden konuşma ve isteğe bağlı AI voice provider
- [ ] Subtitle Studio, zamanlama ve stil presetleri
- [ ] Transkripsiyon ve çeviri sağlayıcı adaptörleri
- [ ] Çoklu dil sürüm yönetimi
- [ ] Script-to-storyboard ve scene breakdown
- [ ] Shot list, kamera, ışık, sahne ve ses planı
- [ ] Üretilen varlıkların timeline'a kontrollü aktarımı

## Faz 7 — Template, Plugin ve genişletilebilirlik

- [ ] Template Library ve kullanıcı şablonları
- [ ] Preset, LUT, instrument preset ve sound pack yönetimi
- [ ] Plugin API ve izin/yetenek manifesti
- [ ] Desktop plugin hosting PoC (VST3/LV2/AU uygunluğu platforma göre)
- [ ] Mobilde yerleşik efekt/enstrüman eşdeğerleri
- [ ] Paket/eklenti imza ve güvenlik denetimi
- [ ] Lisans ve dağıtım hakkı kontrolü

## Faz 8 — Platform, performans ve dağıtım

- [ ] Android native packaging PoC
- [ ] iOS packaging PoC
- [ ] Windows/macOS/Linux desktop packaging PoC
- [ ] Platform dosya, ses, GPU, codec ve background-task adaptörleri
- [ ] Cihaz capability profile ve kalite kademeleri
- [ ] Orta sınıf Android cihaz performans/ısı/batarya testleri
- [ ] Desktop donanım hızlandırma testleri
- [ ] Proje aktarım ve uyumluluk test matrisi
- [ ] Erişilebilirlik, klavye/kısayol ve dokunmatik etkileşim testleri
- [ ] İmzalama, güncelleme, çökme raporu ve kurtarma akışları

## Faz 9 — Stabilizasyon ve profesyonel kalite

- [ ] Birim, entegrasyon, uçtan uca ve regresyon testleri
- [ ] Büyük proje ve uzun render stres testleri
- [ ] Veri kaybı, kesinti ve çökme kurtarma testleri
- [ ] Güvenlik ve gizlilik denetimi
- [ ] Codec, plugin, font, sample ve model lisans denetimi
- [ ] Performans profilleri ve kalite güvence raporları
- [ ] Kullanıcı dokümantasyonu ve sürüm notları
- [ ] Platform bazlı release checklist

## Yol haritası kuralları

1. Mevcut kodlanmış özellikler korunur; mimari değişiklikler geriye dönük uyumluluk gözetir.
2. Bir modülün kapsam belgesi, çalışan özellik olduğu anlamına gelmez.
3. Her iş maddesi tasarım, uygulama, otomatik test ve hedef platform doğrulama durumlarıyla izlenir.
4. Önce ortak altyapı, sonra stüdyo özellikleri; aynı altyapı tekrar tekrar yazılmaz.
5. Yerel işlevler çevrimdışı çalışmayı sürdürür. Harici AI/bulut yalnızca kullanıcı onayıyla devreye girer.
6. Donanım veya işletim sistemi desteklemiyorsa özellik açıkça sınırlandırılır; proje verisi kaybedilmez.
7. Her büyük faz öncesinde teknik PoC ve kullanıcı onayı alınır; mevcut repo/branch ve çalışan akışlar korunur.
