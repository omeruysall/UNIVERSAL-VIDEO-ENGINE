# Yerel Öncelikli ve Hibrit Geliştirme Modeli

## Ürün çalışma modeli

UNIVERSAL VIDEO ENGINE hibrit çalışır; ancak yerel işlevler temel alınır.

**Yerel çalışması hedeflenen işlevler:**
- Proje oluşturma, açma, kaydetme, sürümleme ve yedekleme.
- Medya içe aktarma, asset kataloglama ve dosya yönetimi.
- Timeline, kesme, birleştirme, temel efektler ve önizleme.
- Desteklenen cihazlarda video/ses render ve dışa aktarma.
- MIDI, kayıt, ses düzenleme, miksaj ve yerel enstrümanlar.
- Görsel, animasyon ve 3D düzenlemenin cihazın desteklediği bölümü.

**İsteğe bağlı çevrimiçi işlevler:**
- Harici AI metin, görsel, video, müzik ve ses üretim servisleri.
- Ağ tabanlı model indirme/güncelleme.
- Kullanıcının ayrıca etkinleştirdiği senkronizasyon, paylaşım veya yayın servisleri.

Uygulamanın temel proje açma ve düzenleme akışları zorunlu bir bulut hesabına bağlı olmayacaktır.

## Harici sağlayıcı onayı

Harici AI veya bulut görevi başlamadan önce:
- Sağlayıcı ve kullanılacak model belirtilir.
- Hangi metin, görsel, ses, video veya proje verisinin gönderileceği açıklanır.
- İnternet gereksinimi ve sağlayıcı tarafından bildirilen ücret/kota bilgisi gösterilir.
- Bilinen veri saklama ve kullanım koşullarına bağlantı verilir.
- Kullanıcı ilgili görev için açık onay verir.

API anahtarları güvenli platform depolamasında tutulur; GitHub'a veya düz metin proje dosyasına yazılmaz. Kullanıcı onaylamazsa görev gönderilmez.

## Geliştirme ortamı

Geliştirme için GitHub Codespaces veya yerel masaüstü ortamı kullanılabilir. Codespaces geliştirme/test ortamıdır; nihai uygulamanın bulutta çalışacağı anlamına gelmez. Android'de Termux zorunlu geliştirme veya çalışma bağımlılığı olmayacaktır.

Mevcut web arayüzü ve FastAPI geliştirme servisi, geliştirme aşamasında kullanılabilir. Nihai mobil uygulama gerekli yerel işlevleri native/platform adaptörleri veya uygulamaya paketlenmiş motorlarla sağlamalıdır.

## Yerel veri dizini

Örnek proje depolama yapısı:

```text
data/
  app.sqlite3
  projects/
    project-id/
      project.json
      media/
      proxies/
      thumbnails/
      timelines/
      music/
      images/
      animation/
      scenes-3d/
      renders/
      exports/
      backups/
  cache/
  logs/
```

Bu dizin ve kullanıcı medyası Git'e eklenmez. Uygulama her platformda güvenli uygulama depolama alanını ve kullanıcı tarafından seçilen dışa aktarma konumlarını kullanır.

## Yerel servis güvenliği

- Geliştirme API'si varsayılan olarak loopback üzerinde çalışır.
- Codespaces portları özel erişimle sınırlandırılır; herkese açık port açılmaz.
- Üretim mobil paketinde harici Python servisi zorunlu değildir.
- Dosya ve render işleri doğrulanmış asset kimlikleriyle yürütülür.
- Kullanıcı verisi ve sağlayıcı sırları loglara veya Git'e yazılmaz.
