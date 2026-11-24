# Mimari Genel Bakış

## Tasarım kararı
UNIVERSAL VIDEO ENGINE; Android, iOS, Windows, macOS ve Linux üzerinde ortak özellikler sunacak şekilde tasarlanır. Mobil ve masaüstü için ayrı iş mantıkları geliştirilmez. Responsive React arayüzü, platformdan bağımsız Shared Core ve platform adaptörleri kullanılır.

Uygulama local-first'tir. Kullanıcı projeleri, veritabanı, medya varlıkları, timeline ve render çıktıları varsayılan olarak cihazda tutulur.

## Mimari katmanlar
- Shared UI: React + TypeScript; telefon, tablet ve masaüstüne uyumlu.
- Shared Core: platformdan bağımsız proje modeli, prompt kuralları, timeline, dil/çıktı ayarları, doğrulama ve iş akışı.
- Platform Shell: mobilde Capacitor, masaüstünde Tauri hedeflenir; her ikisi de teknik PoC ile doğrulanacaktır.
- Platform Adapters: dosya sistemi, SQLite, medya seçici/izinler, bildirim, arka plan işi ve render yürütücüsü.
- Local API/Worker: FastAPI ilk geliştirme ve masaüstü yerel worker için kullanılabilir.
- Media Engine: FFmpeg tabanlı ortak render planı; platforma uygun yerel yürütücü.
- Database: SQLite; proje ve işlem metaverileri.
- Media storage: uygulama tarafından yönetilen yerel klasörler.

Mobil ürünün çalışması Termux veya harici Python kurulumuna bağımlı olmayacaktır. Mobilde ihtiyaç duyulan yerel işlemler uygulama içine paketlenen veya native platform adaptörleriyle sağlanacaktır.

## Veri akışı
1. Kullanıcı ortak arayüzden proje oluşturur.
2. Shared Core platformdan bağımsız proje modelini doğrular.
3. Platformun SQLite adaptörü proje metaverisini kaydeder.
4. Dosyalar doğrulanır ve yerel medya deposuna alınır.
5. Timeline klipleri mutlak dosya yolları yerine asset kimliklerine referans verir.
6. Ortak render planı cihaz yeteneklerine göre platform render adaptörüne iletilir.
7. Render işi yerel kuyruğa alınır; worker/adapter çıktıyı yerel export alanına yazar.

## Platformlar arası proje taşınabilirliği
- Proje manifesti sürümlü ve platformdan bağımsızdır.
- Medya, asset ID ve göreli yol ile ilişkilendirilir; mutlak yol kalıcı kimlik olarak kullanılmaz.
- Proje paketi ve gerekli medya başka cihaza aktarılabilir.
- Eksik medya için relink akışı sağlanır.
- Bulut senkronizasyonu zorunlu değildir.

## Güven sınırları
- Yerel servisler varsayılan olarak yalnızca 127.0.0.1 üzerinde dinler; 0.0.0.0 kullanılmaz.
- CORS yalnızca gerekli yerel arayüz origin'ine izin verir.
- Dosya adı ve uzantısı tek başına güvenilir kabul edilmez; MIME, imza, boyut ve süre doğrulanır.
- Dosya yolları proje kökü dışına çıkamayacak şekilde normalize edilir.
- Shell komutları kullanıcı girdisiyle birleştirilmez; FFmpeg argümanları güvenli argüman dizisi olarak gönderilir.
- API anahtarları ve kişisel medya GitHub'a eklenmez.

## Çevrimdışı sınırı
Proje yönetimi, medya kataloğu, timeline ve yerel FFmpeg işlemleri internet olmadan çalışacak şekilde hedeflenir. Harici AI modelleri veya platformlara yayın gibi özellikler internet gerektirebilir; bunlar temel yerel işlevlerden ayrıdır ve isteğe bağlıdır.

## Özellik eşitliği ve performans
Ortak temel özellikler bütün hedef platformlarda aynı kabul testlerinden geçmelidir. Ancak performans eşitliği garanti edilmez. Mobilde proxy/thumbnail, düşük çözünürlüklü önizleme, sınırlı eşzamanlı render ve depolama/ısı kontrolü uygulanabilir. Masaüstünde donanım hızlandırma ve daha yüksek render profilleri desteklenebilir; önce cihaz yetenekleri doğrulanır.

## Mobil gerçekçilik
Galaxy A53 gibi orta sınıf cihazlarda işlemci, RAM, depolama, ısı ve Android arka plan kısıtları dikkate alınır. Büyük çözünürlükte render, ağır efektler ve büyük AI modelleri için kaynak sınırları gerekir.

## Ayrıntılı karar
Mobil ve masaüstü eşitliği, paketleme yaklaşımı, ortak proje biçimi ve kabul testleri için docs/architecture/platform-parity.md dosyasına bakın.
