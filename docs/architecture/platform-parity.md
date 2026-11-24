# Mobil + PC Platform Eşitliği

## Ürün kararı
UNIVERSAL VIDEO ENGINE; Android, iOS, Windows, macOS ve Linux hedeflerinde aynı temel ürün özelliklerini sunacak. Mobil ve masaüstü için birbirinden bağımsız iki uygulama geliştirilmeyecek. Ortak arayüz, ortak proje modeli ve ortak üretim iş akışları kullanılacak.

"Özellik eşitliği" hedefi, her cihazda aynı performans veya aynı donanım kapasitesi anlamına gelmez. İşletim sistemi izinleri, codec desteği, RAM, CPU/GPU, depolama ve termal sınırlar nedeniyle bazı işlemlerin hızı, maksimum çözünürlüğü veya eşzamanlı iş sayısı değişebilir. Bir özellik cihazda desteklenmiyorsa arayüz bunu açıkça bildirmeli; sessizce farklı sonuç üretmemelidir.

## Hedef platformlar
- Mobil: Android ve iOS
- Masaüstü: Windows, macOS ve Linux
- Geliştirme/önizleme: tarayıcı üzerinden yerel web arayüzü

## Katmanlar
1. **Shared UI:** React + TypeScript. Responsive layout; telefon, tablet ve masaüstü ekranları.
2. **Shared Core:** platformdan bağımsız TypeScript paketleri. Proje modeli, prompt kuralları, timeline modeli, dil/çıktı ayarları, iş akışı, doğrulama ve durum makineleri burada yaşar.
3. **Platform Shell:** mobilde Capacitor tabanlı paketleme; masaüstünde Tauri tabanlı paketleme. Bu seçimler teknik PoC ile doğrulanmadan kararlı sürüm kabul edilmez.
4. **Platform Adapters:** dosya sistemi, SQLite, medya seçici/izinler, bildirim, arka plan işi, donanım/codec yetenekleri ve render yürütücüsü için platforma özel adaptörler.
5. **Media Engine:** ortak render planı ve FFmpeg tabanlı iş tanımı; her platformda uygun yerel binary/library entegrasyonu. Lisanslar, codec patent/paketleme koşulları ve mağaza kuralları ayrıca denetlenir.
6. **Optional Local Services:** mevcut FastAPI servisi ilk geliştirme ve masaüstü yerel worker senaryolarında kullanılabilir. Mobil ürünün çalışması Termux veya harici Python kurulmasına bağımlı olmayacak; mobilde gerekli işlemler uygulama içine paketlenen/native adaptörlerle sağlanacak.

## Ortak proje biçimi
- Sürüm numarası ve şema sürümü taşıyan, belgelenmiş bir proje manifesti.
- Timeline, klip, track, efekt, geçiş, ses, altyazı, dil varyantı, render profili ve medya referansları platformdan bağımsız kimliklerle saklanır.
- Medya dosyaları varsayılan olarak cihazın yerel uygulama alanında tutulur.
- Proje manifesti ve gerekli medya dosyaları dışa aktarılıp başka cihaza aktarılabilir.
- Mutlak dosya yolları proje verisinin kalıcı kimliği olamaz; göreli yollar ve asset ID kullanılır.
- Eksik medya için relink akışı bulunur.
- Senkronizasyon zorunlu değildir. Kullanıcı dosya aktarımıyla çevrimdışı çalışabilir; isteğe bağlı senkronizasyon daha sonraki ayrı bir özellik olacaktır.

## Özellik eşitliği kabul ölçütleri
Her ortak özellik için aynı davranışı doğrulayan platformlar arası kabul testleri yazılır:
- Proje oluşturma, kaydetme, kapatma, yeniden açma
- Konu girdisinden prompt üretim akışı ve hazır promptun birebir korunması
- Çoklu dil/altyazı/seslendirme ayarları
- Medya içe aktarma, metadata ve eksik medya bağlantısını düzeltme
- Çok kanallı timeline temel işlemleri
- Ses, efekt, geçiş ve metin düzenleme
- Render kuyruğu, iptal, hata ve ilerleme durumu
- Aynı proje manifestinin desteklenen platformlarda açılması
- Çıktı profilinin cihaz yeteneklerine göre doğrulanması

## Performans uyarlaması
- Mobilde proxy/thumbnail, düşük çözünürlüklü önizleme, sınırlı eşzamanlı render ve depolama kontrolü.
- Masaüstünde donanım hızlandırma ve daha yüksek render profilleri, yalnızca donanım/codec kontrolünden sonra.
- Aynı proje düzeni korunur; performans profili proje içeriğini değiştirmez.
- Arka plan çalışması işletim sistemi limitlerine uymalı; uzun render için duraklatma/devam veya güvenli kurtarma tasarlanır.

## Güvenlik ve yerellik
- Temel proje, timeline, medya yönetimi ve render iş akışları yerel çalışacak şekilde tasarlanır.
- Zorunlu bulut backend'i, bulut veritabanı veya bulut medya depolaması yoktur.
- Harici AI sağlayıcıları ve çevrimiçi yayın entegrasyonları isteğe bağlıdır; açık kullanıcı onayı gerektirir.
- GitHub yalnızca kaynak kodu ve dokümantasyon içindir; kullanıcı medyası, proje verisi ve sırlar depoya gönderilmez.

## Uygulama sırası
1. Ortak proje şeması ve Shared Core.
2. Responsive web arayüzü ve mevcut yerel API geliştirme ortamı.
3. Dosya/SQLite/render adaptör arayüzleri.
4. Masaüstü Tauri PoC ve Android Capacitor PoC.
5. Her iki hedefte aynı proje ve timeline senaryolarının doğrulanması.
6. iOS PoC ve platform kabul testleri.
7. Performans profilleri, paketleme ve dağıtım.
