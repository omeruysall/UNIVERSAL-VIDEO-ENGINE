# Mimari Genel Bakış

## Tasarım kararı
UNIVERSAL VIDEO ENGINE local-first tasarlanır. Kullanıcı projeleri, veritabanı, medya varlıkları, timeline ve render çıktıları varsayılan olarak cihazda tutulur.

## Çalışma bileşenleri
- Web UI: React + TypeScript; Android tarayıcısında localhost üzerinden açılır.
- Local API: FastAPI; yalnızca 127.0.0.1 üzerinde çalışır.
- Database: SQLite; proje ve işlem metaverileri.
- Media storage: uygulama tarafından yönetilen yerel klasörler.
- Media engine: yerel FFmpeg komut satırı.
- Worker: uzun süren işlemleri API isteklerinden ayrı yürütür.

## Veri akışı
1. Kullanıcı arayüzden proje oluşturur.
2. API proje metaverisini SQLite'a kaydeder.
3. Dosyalar doğrulanır ve yerel medya deposuna kopyalanır.
4. Timeline klipleri varlık kimliklerine referans verir.
5. Render işi yerel kuyruğa alınır.
6. Worker FFmpeg'i çalıştırır ve sonucu yerel export klasörüne yazar.

## Güven sınırları
- Varsayılan bind adresi 127.0.0.1 olmalıdır; 0.0.0.0 kullanılmaz.
- CORS yalnızca yerel arayüz origin'ine izin verir.
- Dosya adı ve uzantısı tek başına güvenilir kabul edilmez; MIME, imza, boyut ve süre doğrulanır.
- Dosya yolları proje kökü dışına çıkamayacak şekilde normalize edilir.
- Shell komutları kullanıcı girdisiyle birleştirilmez; FFmpeg argümanları güvenli argüman dizisi olarak gönderilir.
- API anahtarları ve kişisel medya GitHub'a eklenmez.

## Çevrimdışı sınırı
Proje yönetimi, medya kataloğu, timeline ve yerel FFmpeg işlemleri internet olmadan çalışacak şekilde hedeflenir. Harici AI modelleri veya platformlara yayın gibi özellikler internet gerektirebilir; bunlar temel yerel işlevlerden ayrıdır ve isteğe bağlıdır.

## Mobil gerçekçilik
Galaxy A53 üzerinde işlemci, RAM, depolama, ısı ve Android arka plan kısıtları dikkate alınır. Büyük çözünürlükte render, ağır efektler ve büyük AI modelleri için kaynak sınırları, proxy ve düşük çözünürlüklü önizleme stratejileri gerekir.
