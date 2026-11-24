# Yerel Proje Kaydı

## Amaç
İlk proje yönetimi akışı, kullanıcı projesini yerel SQLite veritabanında saklar. Bu API geliştirme aşamasında localhost üzerinden kullanılır. Üretim mobil uygulaması daha sonra aynı veri sözleşmesini native SQLite adaptörüyle uygulayacaktır; Termux/Python mobil dağıtımın zorunlu parçası değildir.

## Veri konumu
Varsayılan: repository root içindeki `data/app.sqlite3`.

Özel yerel konum için `UVE_DATA_DIR` ortam değişkeni kullanılabilir. `data/` Git'e eklenmez.

## HTTP API
- `GET /api/v1/health`: API ve SQLite kontrolü
- `GET /api/v1/projects`: proje özetleri
- `POST /api/v1/projects`: yeni proje kaydı
- `GET /api/v1/projects/{id}`: manifest dahil proje kaydı
- `PUT /api/v1/projects/{id}`: proje manifestini güncelle
- `DELETE /api/v1/projects/{id}`: proje kaydını sil

Yazma uçları manifestin şema sürümünü, kimliğini ve zorunlu üst düzey alanlarını kontrol eder. Shared Core tarafında `isProjectManifest` runtime guard bulunur. Taşınabilir manifest sözleşmesinin JSON Schema karşılığı `packages/core/schema/project-manifest.v1.schema.json` dosyasındadır.

## Bağımsız çoklu dil alanları
Proje manifesti; ana video dili, seslendirme dilleri, altyazı dilleri, ekrandaki metin dilleri ve başlık/açıklama (metadata) dillerini ayrı saklar. Arayüzde birden fazla dil virgülle ayrılarak girilebilir; alanlar birbirinden bağımsızdır. Bu aşamada dil seçimi ve kaydı vardır; çeviri, dublaj, ses üretimi ve altyazı üretim motorları henüz eklenmemiştir.

## Hazır prompt bütünlüğü
`ready_prompt` modunda girilen metin `prompt.originalText` alanına aktarılır. Bu alan trim, otomatik düzeltme, çeviri veya prompt yeniden yazımı işlemine sokulmaz. Konu modunda konu metni ayrı `prompt.topic` alanında tutulur. Smart Prompt Engine daha sonra ayrı bir `generatedPrompt` alanı üretebilir; kaynak konu ve hazır prompt alanı üzerine yazmamalıdır.

## Çıktı profilleri
- Video: MP4, MOV veya WebM; yön, çözünürlük ve FPS.
- Ses: MP3, WAV, AAC veya FLAC; örnekleme hızı ve kanal sayısı.
- Görsel: PNG, JPG veya WebP; yön ve çözünürlük.
- Animasyon: GIF veya animasyonlu WebP; yön, çözünürlük ve FPS.

Bu seçimler proje manifestine kaydedilir. Henüz bu profillerden gerçek medya dosyası üreten render motoru eklenmemiştir.

## Şimdiki sınırlar
- İlk SQLite tablosu otomatik oluşturulur; sürümlü migration altyapısı henüz yoktur.
- Proje güncelleme API'si mevcut; arayüzde düzenleme/kaydetme akışı henüz yoktur.
- Medya dosyaları henüz kopyalanmıyor veya yönetilmiyor.
- Silme işlemi yalnızca proje veritabanı kaydını siler; medya dosyası temizliği henüz uygulanmadı.
- Proje paketini dışa aktarma/içe aktarma ve platformlar arası taşıma henüz yoktur.
- API ve UI kodu henüz gerçek cihazda çalıştırılıp test edilmedi.
