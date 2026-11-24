import { useCallback, useEffect, useState } from "react";
import type { OutputKind, ProjectManifest, VideoOrientation } from "@uve/core";

const API = "http://127.0.0.1:8000/api/v1";

type ApiState = "checking" | "online" | "offline";
type PromptMode = "topic" | "ready_prompt";
type ProjectSummary = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};
type StoredProject = ProjectSummary & { manifest: ProjectManifest };

const now = () => new Date().toISOString();

function App() {
  const [apiState, setApiState] = useState<ApiState>("checking");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selected, setSelected] = useState<StoredProject | null>(null);
  const [title, setTitle] = useState("");
  const [promptMode, setPromptMode] = useState<PromptMode>("topic");
  const [promptText, setPromptText] = useState("");
  const [format, setFormat] = useState("mp4");
  const [orientation, setOrientation] = useState<VideoOrientation>("landscape");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [fps, setFps] = useState(30);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const refreshProjects = useCallback(async () => {
    const response = await fetch(`${API}/projects`);
    if (!response.ok) throw new Error("Projeler alınamadı");
    setProjects(await response.json() as ProjectSummary[]);
  }, []);

  const checkApi = useCallback(async () => {
    try {
      const response = await fetch(`${API}/health`);
      if (!response.ok) throw new Error("API unavailable");
      setApiState("online");
      await refreshProjects();
    } catch {
      setApiState("offline");
    }
  }, [refreshProjects]);

  useEffect(() => {
    void checkApi();
  }, [checkApi]);

  useEffect(() => {
    if (orientation === "portrait") {
      setWidth(1080);
      setHeight(1920);
    } else if (orientation === "square") {
      setWidth(1080);
      setHeight(1080);
    } else if (orientation === "landscape") {
      setWidth(1920);
      setHeight(1080);
    }
  }, [orientation]);

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setMessage("Proje adı gerekli.");
      return;
    }
    if (!promptText.trim()) {
      setMessage(promptMode === "topic" ? "Proje konusunu gir." : "Hazır promptu gir.");
      return;
    }
    setBusy(true);
    setMessage("");
    const timestamp = now();
    const id = crypto.randomUUID();
    const manifest: ProjectManifest = {
      schemaVersion: 1,
      id,
      title: title.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      languages: {
        video: "tr",
        voiceover: ["tr"],
        subtitles: ["en"],
        onScreenText: ["tr"],
        metadata: ["tr"],
      },
      prompt: promptMode === "topic"
        ? { mode: "topic", topic: promptText.trim() }
        : { mode: "ready_prompt", originalText: promptText },
      output: {
        kind: "video" as OutputKind,
        format,
        orientation,
        width,
        height,
        fps,
      },
      assets: [],
      timeline: { durationMs: 0, tracks: [] },
    };

    try {
      const response = await fetch(`${API}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: manifest.title, manifest }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail ?? "Proje kaydedilemedi");
      }
      const saved = await response.json() as StoredProject;
      setSelected(saved);
      setTitle("");
      setPromptText("");
      await refreshProjects();
      setMessage("Proje cihazındaki SQLite veritabanına kaydedildi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bilinmeyen hata");
    } finally {
      setBusy(false);
    }
  }

  async function openProject(id: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${API}/projects/${id}`);
      if (!response.ok) throw new Error("Proje açılamadı");
      setSelected(await response.json() as StoredProject);
      setMessage("Proje yerel veritabanından açıldı.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bilinmeyen hata");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(id: string) {
    if (!window.confirm("Bu projeyi yerel veritabanından silmek istiyor musun?")) return;
    setBusy(true);
    try {
      const response = await fetch(`${API}/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Proje silinemedi");
      if (selected?.id === id) setSelected(null);
      await refreshProjects();
      setMessage("Proje kaydı silindi. Medya dosyaları henüz yönetilmiyor.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bilinmeyen hata");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">UVE</div>
        <div><p className="eyebrow">LOCAL CREATIVE WORKSPACE</p><h1>UNIVERSAL VIDEO ENGINE</h1></div>
        <span className="local-badge">LOCAL FIRST</span>
      </header>

      <section className="hero">
        <p className="eyebrow">PROJECT WORKSPACE / V0.2</p>
        <h2>Fikirden videoya.<br /><span>Tek bir yerel stüdyo.</span></h2>
        <p className="intro">Projelerini kendi cihazında oluştur ve kaydet. Aynı proje formatı mobil ve masaüstü sürümlerinde kullanılmak üzere tasarlanıyor.</p>
        <div className="status-row">
          <span className={`status-dot ${apiState}`} />
          <span>Yerel API: {apiState === "checking" ? "Kontrol ediliyor" : apiState === "online" ? "Bağlı · SQLite hazır" : "Bağlantı yok"}</span>
          <span className="status-address">127.0.0.1:8000</span>
        </div>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div><p className="eyebrow">01 / PROJECT SETUP</p><h2>Yeni proje oluştur</h2></div>
          <span className="tag">LOCAL DATABASE</span>
        </div>
        <form className="project-form" onSubmit={createProject}>
          <label>Proje adı
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Örn. İlk video projem" maxLength={160} />
          </label>
          <fieldset>
            <legend>Girdi türü</legend>
            <div className="choice-row">
              <label className={promptMode === "topic" ? "choice active" : "choice"}>
                <input type="radio" checked={promptMode === "topic"} onChange={() => setPromptMode("topic")} />
                Konu gir
              </label>
              <label className={promptMode === "ready_prompt" ? "choice active" : "choice"}>
                <input type="radio" checked={promptMode === "ready_prompt"} onChange={() => setPromptMode("ready_prompt")} />
                Hazır prompt gir
              </label>
            </div>
          </fieldset>
          <label>{promptMode === "topic" ? "Video konusu" : "Hazır prompt"}
            <textarea value={promptText} onChange={(event) => setPromptText(event.target.value)} rows={5} placeholder={promptMode === "topic" ? "Videonun konusunu yaz..." : "Promptunu değiştirmeden buraya yapıştır..."} />
            {promptMode === "ready_prompt" && <small>Hazır prompt, girildiği metin olarak saklanır; otomatik olarak yeniden yazılmaz.</small>}
          </label>
          <div className="form-section-title">Çıktı ayarları</div>
          <div className="settings-grid">
            <label>Format
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="mp4">MP4</option><option value="mov">MOV</option><option value="webm">WebM</option>
              </select>
            </label>
            <label>Görüntü yönü
              <select value={orientation} onChange={(event) => setOrientation(event.target.value as VideoOrientation)}>
                <option value="landscape">Yatay 16:9</option><option value="portrait">Dikey 9:16</option><option value="square">Kare 1:1</option>
              </select>
            </label>
            <label>Genişlik
              <input type="number" min={256} max={7680} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
            </label>
            <label>Yükseklik
              <input type="number" min={256} max={7680} value={height} onChange={(event) => setHeight(Number(event.target.value))} />
            </label>
            <label>FPS
              <select value={fps} onChange={(event) => setFps(Number(event.target.value))}>
                <option value={24}>24</option><option value={25}>25</option><option value={30}>30</option><option value={50}>50</option><option value={60}>60</option>
              </select>
            </label>
          </div>
          <button className="primary-button" type="submit" disabled={busy || apiState !== "online"}>{busy ? "İşleniyor..." : "Projeyi oluştur ve kaydet"}</button>
        </form>
        {message && <p className="message" role="status">{message}</p>}
      </section>

      <section className="workspace">
        <div className="section-heading"><div><p className="eyebrow">02 / PROJECT LIBRARY</p><h2>Projelerim</h2></div><span className="tag">{projects.length} KAYIT</span></div>
        {projects.length === 0 ? <p className="empty-state">Henüz kayıtlı proje yok. İlk projen yukarıda görünecek.</p> : (
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.id}>
                <div><strong>{project.title}</strong><small>Son kayıt: {new Date(project.updated_at).toLocaleString()}</small></div>
                <div className="row-actions">
                  <button type="button" className="secondary-button" onClick={() => void openProject(project.id)} disabled={busy}>Aç</button>
                  <button type="button" className="quiet-button" onClick={() => void deleteProject(project.id)} disabled={busy}>Sil</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <section className="workspace selected-project">
          <div className="section-heading"><div><p className="eyebrow">03 / OPEN PROJECT</p><h2>{selected.title}</h2></div><button className="quiet-button" onClick={() => setSelected(null)}>Kapat</button></div>
          <div className="details-grid">
            <div><small>Proje kimliği</small><code>{selected.id}</code></div>
            <div><small>Çıktı</small><strong>{selected.manifest.output.format.toUpperCase()} · {selected.manifest.output.width}×{selected.manifest.output.height} · {selected.manifest.output.fps} FPS</strong></div>
            <div><small>Prompt modu</small><strong>{selected.manifest.prompt?.mode === "ready_prompt" ? "Hazır prompt" : "Konu"}</strong></div>
            <div><small>Medya / Timeline</small><strong>{selected.manifest.assets.length} medya · {selected.manifest.timeline.tracks.length} kanal</strong></div>
          </div>
          {selected.manifest.prompt && <div className="prompt-preview"><small>Kaydedilen girdi</small><p>{selected.manifest.prompt.mode === "ready_prompt" ? selected.manifest.prompt.originalText : selected.manifest.prompt.topic}</p></div>}
        </section>
      )}

      <footer><span>UNIVERSAL VIDEO ENGINE</span><span>Veriler cihazında kalır · GitHub yalnızca kaynak kodu içindir</span></footer>
    </main>
  );
}

export default App;
