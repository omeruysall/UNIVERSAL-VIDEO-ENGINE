# Project Manifest v2 — Tasarım Kararı

## Durum

Kademeli uygulama aşamasında. TypeScript v2 sözleşmesi, v1'den bellekte migration, v2 JSON Schema ve backend'in v1/v2 saklama desteği eklendi. Core migration/veri bütünlüğü testleri CI'ya bağlandı; son CI doğrulaması bekleniyor. UI'nin v2 üretmesi ve gerçek medya dosyası yönetimi henüz tamamlanmadı. Mevcut v1 manifestleri korunur.

## Mevcut durumun tespiti

- Shared Core içinde `ProjectManifest` yalnızca `schemaVersion: 1` kabul ediyor.
- v1 manifest; dil ayarları, tek çıktı profili, ortak asset listesi ve genel timeline içeriyor.
- Backend yazma doğrulaması da yalnızca schemaVersion 1'i kabul ediyor.
- JSON Schema v1 dosyası `packages/core/schema/project-manifest.v1.schema.json`.
- Studio modülleri için ortak bir belge kayıt alanı henüz yok.
- Backend manifest JSON'unu saklıyor; uygulama seviyesinde gerçek medya dosyası yönetimi henüz yok.

## v2 hedefleri

v2, mevcut proje kabuğunu koruyup bir projede birden fazla stüdyo belgesini tanımlayacaktır. Örnekler:

- `video`: video timeline, sahne/sekans ve kurgu ayarları
- `music`: tempo haritası, ölçü, ton, MIDI/audio track ve mixer oturumu
- `audio`: ses düzenleme oturumu, track ve efekt zinciri
- `image`: katmanlar, maskeler, metin ve kompozisyon
- `animation`: frame/clip timeline, keyframe ve easing
- `3d`: sahne, nesne, kamera, ışık, materyal ve render ayarları

Her stüdyo belgesi ortak bir zarf kullanır:

- benzersiz `id`
- `studioType`
- `documentVersion` (stüdyo belgesinin kendi sürümü)
- `title`
- `createdAt` ve `updatedAt`
- `data` (stüdyo tipine özgü, doğrulanan içerik)
- isteğe bağlı ortak asset ID referansları

Proje manifesti, stüdyo belgelerini bir dizi veya kimlikli kayıt olarak tutar. Her projede tek bir stüdyo belgesi bulunması zorunlu değildir. Aynı projede video ve music belgeleri birlikte bulunabilir; Music Studio'da oluşturulan mix, Video Studio'da bir asset olarak kullanılabilir.

## Uyumluluk ve migration politikası

1. v1 şeması değiştirilmeyecek; mevcut dosya tarihsel sözleşme olarak sabit kalacak.
2. v2 için ayrı TypeScript tipi, runtime validator ve `project-manifest.v2.schema.json` oluşturulacak.
3. Açma akışı v1'i tanıyacak ve açık, deterministik `migrateProjectV1ToV2` fonksiyonuyla v2 belleğe dönüştürecek.
4. Migration kaynak nesneyi değiştirmeyecek; prompt metnini, asset ID'lerini, relative path'leri, dilleri, timeline'ı, tarihleri ve çıktı ayarlarını aynen koruyacak.
5. v1 verisi kullanıcı açıkça kaydetmeden otomatik olarak v2 diye diske yazılmayacak. Böylece beklenmedik format dönüşümü ve veri kaybı önlenecek.
6. Backend geçiş sürecinde v1 ve v2'yi okuyup yazmayı destekleyecek; yeni UI projeleri v2 oluşturacak. Bu destek ancak migration testleri eklendikten sonra etkinleştirilecek.
7. Bilinmeyen `studioType` veya desteklenmeyen `documentVersion` sessizce silinmeyecek; proje korunarak anlaşılır uyumluluk hatası gösterilecek.
8. Her stüdyo belgesi kendi sürümünü taşıyacak. Ana proje sürümü ile belge sürümleri birbirinden bağımsız ilerleyebilecek.

## Veri bütünlüğü kuralları

- Kalıcı referanslar mutlak cihaz dosya yolu değil, asset ID ve proje içi göreli yol kullanır.
- Bir stüdyo belgesi başka bir belgenin verisini kopyalayıp kaynak belgeyi değiştiremez; ortak asset referansı kullanır.
- `ready_prompt.originalText` hiçbir migration veya normalizasyon sırasında trim/çeviri/yeniden yazıma uğramaz.
- Tarih ve süre alanları standart ISO-8601 ve açık birimlerle (ms, Hz, BPM vb.) tanımlanır.
- Belge kimlikleri proje içinde benzersiz olmalıdır.
- Bozuk veya desteklenmeyen belge, tüm projenin sessizce kısmi kaydedilmesine neden olmamalıdır.

## Uygulama sırası

1. [Tamamlandı] v2 TypeScript tipleri ve ortak studio document registry.
2. [Tamamlandı] v1/v2 runtime doğrulayıcıları ve saf migration fonksiyonu.
3. [Tamamlandı] v2 JSON Schema.
4. [CI doğrulaması bekleniyor] Migration ve veri bütünlüğü testleri.
5. [Tamamlandı] Backend'in v1/v2 kabulü ve saklama davranışı.
6. [Sıradaki] UI'nin yeni projelerde v2 üretmesi ve eski projeleri güvenli açması.
7. [Kısmen tamamlandı] CI'da backend, core test ve frontend build kontrollerinin zorunlu hale getirilmesi.

## Kapsam dışı

Bu aşama gerçek video/audio render, plugin hosting, medya dosyası içe aktarma veya AI üretimi eklemez. Önce bu özelliklerin üzerinde güvenle çalışacağı taşınabilir proje sözleşmesini kurar.
