# Yerel Güvenlik İlkeleri

- Yerel API yalnızca 127.0.0.1 üzerinde dinler.
- İlk sürümde kullanıcı hesabı veya uzaktan erişim açılmaz.
- Gizli bilgiler .env ve yerel güvenli yapılandırmada tutulur; Git'e eklenmez.
- .env.example yalnızca gizli olmayan örnek değişken adları içerebilir.
- Medya yüklemelerinde boyut, tür, imza ve dosya yolu kontrolleri uygulanır.
- FFmpeg süreçleri shell string yerine argüman listesiyle başlatılır.
- İşlem loglarına API anahtarı veya özel dosya içeriği yazılmaz.
- Harici sağlayıcıya veri gönderimi ayrı izin ve açık kullanıcı onayı gerektirir.
