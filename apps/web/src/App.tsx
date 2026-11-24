import { useEffect, useState } from "react";

type ApiState = "checking" | "online" | "offline";

export default function App() {
  const [apiState, setApiState] = useState<ApiState>("checking");

  useEffect(() => {
    const controller = new AbortController();
    fetch("http://127.0.0.1:8000/api/v1/health", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then(() => setApiState("online"))
      .catch(() => {
        if (!controller.signal.aborted) setApiState("offline");
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">UVE</div>
        <div><p className="eyebrow">LOCAL CREATIVE WORKSPACE</p><h1>UNIVERSAL VIDEO ENGINE</h1></div>
        <span className="local-badge">LOCAL FIRST</span>
      </header>
      <section className="hero">
        <p className="eyebrow">CONTROL CENTER / V0.1</p>
        <h2>Fikirden videoya.<br /><span>Tek bir yerel stüdyo.</span></h2>
        <p className="intro">Projelerini, medyalarını ve render işlemlerini kendi cihazında yönet. Bu başlangıç sürümü yerel çalışma altyapısının temelini oluşturur.</p>
        <div className="status-row">
          <span className={`status-dot ${apiState}`} />
          <span>Yerel API: {apiState === "checking" ? "Kontrol ediliyor" : apiState === "online" ? "Bağlı" : "Henüz başlatılmadı"}</span>
          <span className="status-address">127.0.0.1:8000</span>
        </div>
      </section>
      <section className="grid">
        <article className="panel primary"><p className="eyebrow">01 / CREATE</p><h3>Yeni proje</h3><p>Proje sihirbazı, konu/prompt girişi ve video çıktı ayarları sıradaki geliştirme adımıdır.</p><span className="tag">PLANLANDI</span></article>
        <article className="panel"><p className="eyebrow">02 / LIBRARY</p><h3>Medya kütüphanesi</h3><p>Görsel, video, ses ve diğer varlıklar yerel depoda tutulacak.</p><span className="tag">PLANLANDI</span></article>
        <article className="panel"><p className="eyebrow">03 / EDIT</p><h3>Çok kanallı editör</h3><p>Timeline, sahneler, ses katmanları ve temel klip işlemleri.</p><span className="tag">PLANLANDI</span></article>
        <article className="panel"><p className="eyebrow">04 / EXPORT</p><h3>Yerel render</h3><p>FFmpeg ile cihaz üzerinde MP4 dışa aktarma.</p><span className="tag">PLANLANDI</span></article>
      </section>
      <footer><span>UNIVERSAL VIDEO ENGINE</span><span>Veriler cihazında kalır · GitHub yalnızca kaynak kodu içindir</span></footer>
    </main>
  );
}