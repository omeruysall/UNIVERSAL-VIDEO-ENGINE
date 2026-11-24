# Yerel Geliştirme Ortamı

## Hedef
Birincil geliştirme cihazı Android 16 çalışan Samsung Galaxy A53 5G'dir. Geliştirme bilgisayar olmadan, Termux ve mobil kod editörüyle yürütülecek.

## Planlanan araçlar
- Termux: terminal, Git, Python, Node.js ve FFmpeg
- Acode veya benzeri editör: kaynak kodu düzenleme
- GitHub: kod deposu, issue ve sürüm takibi
- Chrome: localhost arayüz testi

## Yerel servis adresleri
- UI geliştirme sunucusu: http://127.0.0.1:5173
- API: http://127.0.0.1:8000
- API şeması: http://127.0.0.1:8000/docs

Bu adresler hedef yapılandırmadır; henüz çalışan servis oldukları anlamına gelmez.

## Kurulum yaklaşımı
Kurulum adım adım yapılacaktır. Önce Termux kaynağı doğrulanır, ardından Git/Python/Node.js/FFmpeg sürümleri kontrol edilir. Android ARM64 uyumluluğu doğrulanmadan paket veya sürüm zorlanmaz.

## Yerel veri dizini
data/
  app.sqlite3
  projects/
    project-id/
      project.json
      media/
      proxies/
      timeline/
      renders/
      exports/
      backups/

Bu klasör Git'e eklenmez.
