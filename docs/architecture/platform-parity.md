# Mobil + PC Platform Eşitliği

## Ürün kararı

UNIVERSAL VIDEO ENGINE; Android, iOS, Windows, macOS ve Linux üzerinde ortak proje formatı ve ortak temel iş akışlarıyla çalışan profesyonel yaratıcı stüdyo platformudur. Video, Music, Audio, Image, Animation, 3D ve AI stüdyoları aynı platformun modülleridir.

Mobil ve masaüstü için birbirinden bağımsız iki ürün mantığı geliştirilmeyecek. Responsive ortak arayüz, Shared Core ve platform adaptörleri kullanılacak.

**Hybrid çalışma modeli:** Temel proje yönetimi, dosya yönetimi, düzenleme ve desteklenen render/işleme görevleri yerel çalışır. Harici AI ve bulut üretim servisleri isteğe bağlıdır ve açık kullanıcı onayı gerektirir.

## Hedef platformlar

- Mobil: Android ve iOS
- Masaüstü: Windows, macOS ve Linux
- Geliştirme/önizleme: tarayıcı üzerinden yerel veya Codespaces geliştirme ortamı

## Katmanlar

1. **Shared UI:** React + TypeScript; responsive tasarım.
2. **Shared Core:** Proje şeması, stüdyo belge modelleri, timeline, medya grafiği, dil/çıktı ayarları, görev durumları ve doğrulama.
3. **Studio Modules:** Video, Music, Audio, Image, Animation, 3D, AI, Voice ve Subtitle.
4. **Platform Shell:** Mobilde Capacitor, masaüstünde Tauri hedeflenir; teknik PoC ile doğrulanır.
5. **Platform Adapters:** Dosya sistemi, SQLite, medya seçici/izinler, ses cihazları, GPU/codec yetenekleri, arka plan işi ve render.
6. **Local Engines:** Yerel medya işleme, gerçek zamanlı ses, MIDI, render ve mümkün olan yerel AI çalışma zamanları.
7. **Provider Gateway:** Harici AI sağlayıcılarına ortak, güvenli ve kullanıcı onaylı bağlantı.
8. **Local API/Worker:** FastAPI mevcut geliştirme/worker bileşenidir. Nihai mobil paket harici Python veya Termux gerektirmez.

## Özellik eşitliği

Özellik eşitliği, her platformda aynı performans veya aynı donanım kapasitesi demek değildir. Codec, RAM, CPU/GPU, depolama, ses cihazı ve işletim sistemi kısıtları nedeniyle kalite, çözünürlük, kanal sayısı veya işlem süresi değişebilir.

Desteklenmeyen bir özellik açıkça bildirilmelidir. Sessizce farklı sonuç üretmek veya projedeki veriyi kaybetmek kabul edilmez.

## Ortak proje biçimi

- Sürümlü ve belgelenmiş platformdan bağımsız manifest.
- Bir projede birden fazla stüdyo belgesi bulunabilir.
- Video/audio timeline, music session, image document, animation ve 3D scene ortak asset kimlikleri kullanır.
- Medya dosyaları varsayılan olarak yerel uygulama alanında tutulur.
- Manifest ve gerekli medya dosyaları paketlenip başka cihaza aktarılabilir.
- Mutlak dosya yolu yerine asset ID ve göreli yol kullanılır.
- Eksik medya için relink ve doğrulama akışı bulunur.
- Bulut senkronizasyonu zorunlu değildir; isteğe bağlı senkronizasyon ayrı izin ve ayar gerektirir.

## Hybrid AI ve bulut sağlayıcıları

- Yerel motor kullanılabiliyorsa varsayılan olarak yerel işlem tercih edilir.
- Harici sağlayıcılar ayrı Provider Gateway üzerinden bağlanır.
- Kullanıcıya sağlayıcı, gönderilecek veri, internet gereksinimi, ücret/kota bilgisi ve bilinen veri saklama koşulları gösterilir.
- Harici gönderim her görev için kullanıcı onayı gerektirir; genel bir bağlantı izni tek başına içerik gönderme izni değildir.
- Sağlayıcı yoksa veya kullanıcı onaylamazsa yerel alternatif ya da açık desteklenmiyor durumu sunulur.
- Sağlayıcı anahtarları işletim sisteminin güvenli depolamasında tutulur; kaynak koduna, proje manifestine veya GitHub'a yazılmaz.

## Kabul ölçütleri

- Proje oluşturma, kaydetme, kapatma ve yeniden açma.
- Stüdyo belgelerini ortak proje içinde açma ve koruma.
- Hazır promptun birebir korunması.
- Çoklu dil/altyazı/seslendirme ayarları.
- Medya içe aktarma, metadata ve eksik medya relink.
- Timeline, MIDI ve medya düzenleme temel işlemleri.
- Render kuyruğu, iptal, hata ve ilerleme.
- Harici AI gönderimi öncesi onay ve sağlayıcı bilgisinin gösterilmesi.
- Aynı proje manifestinin desteklenen platformlarda açılması.

## Performans uyarlaması

- Mobilde proxy, thumbnail, düşük çözünürlüklü önizleme, sınırlı eşzamanlı render ve termal yönetim.
- Masaüstünde donanım hızlandırma ve daha yüksek render profilleri; yetenek kontrolünden sonra.
- Gerçek zamanlı ses DSP işlemleri UI thread dışında, platformun uygun ses iş parçacığında yürütülür.
- Aynı proje düzeni korunur; performans profili proje içeriğini değiştirmez.
- Uzun işler için güvenli kurtarma, iptal ve destekleniyorsa duraklat/devam tasarlanır.

## Uygulama sırası

1. Ortak proje manifesti ve Shared Core genişletmesi.
2. Asset, dosya, görev ve render adaptör arayüzleri.
3. Video timeline ve yerel render temeli.
4. Audio/Music ses motoru ve proje modeli.
5. Image/Animation/3D belge modelleri ve motor PoC'leri.
6. Provider Gateway ve kontrollü harici AI.
7. Mobil/masaüstü/iOS PoC, platform kabul testleri ve paketleme.
