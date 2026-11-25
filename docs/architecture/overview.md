# Mimari Genel Bakış

## Ürün kararı

UNIVERSAL VIDEO ENGINE; Android, iOS, Windows, macOS ve Linux hedeflerinde profesyonel yaratıcı üretim stüdyolarını tek bir platformda birleştirir.

**Kapsam:** Video Studio, Music Studio PRO, Audio Studio, Image Studio, Animation Studio, 3D Studio, AI Studio, Voice Studio, Subtitle Studio, Asset Manager, Template Library ve Render Center.

**Geliştirme stratejisi:** Professional. Hedef, yalnızca arayüz demosu değil; gerçek üretim iş akışları, güvenilir proje saklama, düzenleme, miksaj, render, test ve platform paketlemesidir. Geliştirme aşamalıdır; her modülün tamamlanma durumu ayrı izlenir.

**Çalışma modeli:** Hybrid. Proje yönetimi, medya düzenleme, timeline, temel ses işleme ve desteklenen render görevleri öncelikle yerel çalışır. Harici AI sağlayıcıları, bulut tabanlı üretim ve ağır çevrimiçi görevler isteğe bağlıdır. Kullanıcı açıkça onaylamadan içerik veya proje verisi harici sağlayıcıya gönderilmez.

## Mimari katmanlar

- **Shared UI:** React + TypeScript; telefon, tablet ve masaüstüne uyumlu.
- **Shared Core:** Platformdan bağımsız proje modeli, prompt kuralları, timeline, medya grafiği, dil/çıktı ayarları, doğrulama, görev durumları ve iş akışı.
- **Studio Modules:** Video, Music, Audio, Image, Animation, 3D, AI, Voice ve Subtitle stüdyoları. Modüller bağımsız kullanıcı iş akışlarına sahip olur; ortak proje, asset, görev ve render altyapısını paylaşır.
- **Platform Shell:** Mobilde Capacitor, masaüstünde Tauri hedeflenir; her ikisi de teknik PoC ile doğrulanacaktır.
- **Platform Adapters:** Dosya sistemi, SQLite, medya seçici/izinler, ses girişi/çıkışı, GPU/codec yetenekleri, bildirim, arka plan işi ve render yürütücüsü.
- **Local Engines:** Medya decode/encode, video render, gerçek zamanlı ses motoru, MIDI, waveform, thumbnail/proxy ve yerel AI runtime adaptörleri.
- **Provider Gateway:** İsteğe bağlı harici AI servisleri için tek sağlayıcı arayüzü; sağlayıcı seçimi, yetenek kontrolü, maliyet/limit bilgisi, gizlilik bildirimi, onay, hata ve görev durumu yönetimi.
- **Local API/Worker:** FastAPI mevcut geliştirme/yerel worker bileşeni olarak kullanılabilir. Nihai mobil uygulama Termux veya harici Python kurulumuna bağımlı olmayacaktır.
- **Database:** SQLite; proje, asset metaverisi, görev geçmişi, ayarlar ve yerel katalog.
- **Media storage:** Uygulama tarafından yönetilen yerel proje klasörleri. Bulut medya depolaması zorunlu değildir.

## Hybrid görev yönlendirme

Her üretim görevi çalıştırılmadan önce çalışma yolu belirlenir:
1. Yerel motor destekliyorsa ve cihaz yeterliyse yerel işlem.
2. Yerel motor uygun değilse, kullanıcı isterse bağlı harici sağlayıcı.
3. Kullanıcı harici sağlayıcıyı onaylamazsa görev yerel alternatif, daha düşük kalite/çözünürlük veya desteklenmiyor açıklamasıyla sunulur.

Harici AI görevleri için sağlayıcı adı, gönderilecek veri türleri, tahmini ücret veya ücretsiz kota bilgisi (sağlayıcı sunuyorsa), internet gereksinimi ve saklama koşulları işlem öncesi gösterilir. API anahtarları güvenli platform depolarında tutulur; GitHub'a yazılmaz.

## Veri akışı

1. Kullanıcı ortak arayüzden bir stüdyo projesi oluşturur.
2. Shared Core proje manifestini ve modül verisini doğrular.
3. Platform SQLite adaptörü proje metaverisini kaydeder.
4. Medya dosyaları doğrulanır ve yerel medya deposuna alınır.
5. Timeline ve stüdyo grafikleri mutlak dosya yolları yerine asset kimliklerine referans verir.
6. Görev yönlendiricisi yerel motor veya kullanıcının onayladığı sağlayıcıyı seçer.
7. Render/AI işleri kuyruk, ilerleme, iptal, hata ve kurtarma durumlarıyla izlenir.
8. Çıktılar varsayılan olarak yerel export alanına yazılır.

## Ortak proje ve modül sistemi

- Proje manifesti sürümlü ve platformdan bağımsızdır.
- Proje, bir veya daha fazla stüdyo belgesi içerebilir: video timeline, music session, audio session, image document, animation scene veya 3D scene.
- Modül belgeleri ortak asset kimlikleri, medya metaverisi, renk/ölçü birimleri, dil bilgisi ve render profilleriyle ilişkilendirilir.
- Bir stüdyoda üretilen asset başka stüdyoda kullanılabilir; kaynak proje tahrip edilmez.
- Medya, asset ID ve göreli yol ile ilişkilendirilir; mutlak yol kalıcı kimlik değildir.
- Proje paketi ve gerekli medya başka cihaza aktarılabilir; eksik medya için relink akışı sağlanır.
- Bulut senkronizasyonu zorunlu değildir. İsteğe bağlı senkronizasyon ayrı bir özellik ve açık kullanıcı tercihi olacaktır.

## Güven sınırları

- Yerel servisler varsayılan olarak yalnızca 127.0.0.1 üzerinde dinler.
- CORS yalnızca gerekli origin'lere izin verir.
- Dosya adı/uzantısı tek başına güvenilir kabul edilmez; MIME, imza, boyut ve süre doğrulanır.
- Dosya yolları proje kökü dışına çıkamayacak şekilde normalize edilir.
- Shell komutları kullanıcı girdisiyle birleştirilmez; medya motoru argümanları güvenli argüman dizisi olarak gönderilir.
- API anahtarları, kişisel medya ve kullanıcı proje verisi GitHub'a eklenmez.
- Harici sağlayıcıya veri gönderimi açık kullanıcı onayı gerektirir.

## Platformlar arası özellik ve performans

Ortak proje davranışı tüm hedef platformlarda aynı kabul testlerinden geçmelidir. Performans ve donanım kapasitesi eşit olmak zorunda değildir. Mobilde proxy/thumbnail, düşük çözünürlüklü önizleme, sınırlı eşzamanlı render ve ısı/depolama kontrolü uygulanabilir. Masaüstünde donanım hızlandırma ve daha yüksek render profilleri desteklenebilir.

## Mobil gerçekçilik

Orta sınıf cihazlarda CPU, RAM, depolama, ısı, batarya ve işletim sistemi arka plan kısıtları dikkate alınır. Büyük AI modelleri, yüksek çözünürlüklü render, ağır efektler ve çok kanallı gerçek zamanlı ses işlemleri için cihaz yetenek kontrolü ve kademeli kalite profilleri gerekir.

## Ayrıntılı kararlar

- Platform eşitliği: [platform-parity.md](platform-parity.md)
- Ortak proje manifesti v2 tasarımı: [project-manifest-v2-design.md](project-manifest-v2-design.md)
- Müzik stüdyosu: [../music-studio/professional-spec.md](../music-studio/professional-spec.md)
- Yerel ve hibrit geliştirme ilkeleri: [../development/local-first.md](../development/local-first.md)
