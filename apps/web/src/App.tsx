import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { isProjectManifest } from "@uve/core";
import type { OutputKind, OutputSettings, ProjectManifest, VideoOrientation } from "@uve/core";

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
const parseLanguageList = (value: string) =>
  value.split(",").map((language) => language.trim()).filter(Boolean);

function App() {
  const [apiState, setApiState] = useState<ApiState>("checking");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selected, setSelected] = useState<StoredProject | null>(null);
  const [title, setTitle] = useState("");
  const [promptMode, setPromptMode] = useState<PromptMode>("topic");
  const [promptText, setPromptText] = useState("");
  const [outputKind, setOutputKind] = useState<OutputKind>("video");
  const [format, setFormat] = useState("mp4");
  const [orientation, setOrientation] = useState<VideoOrientation>("landscape");
  const [sampleRate, setSampleRate] = useState(48000);
  const [channels, setChannels] = useState(2);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [fps, setFps] = useState(30);
  const [videoLanguage, setVideoLanguage] = useState("tr");
  const [voiceoverLanguages, setVoiceoverLanguages] = useState("tr");
  const [subtitleLanguages, setSubtitleLanguages] = useState("en");
  const [onScreenLanguages, setOnScreenLanguages] = useState("tr");
  const [metadataLanguages, setMetadataLanguages] = useState("tr");
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

  async function createProject(event: FormEvent<HTMLFormElement>) {
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
    const output: OutputSettings = outputKind === "audio"
      ? { kind: "audio", format, sampleRate, channels }
      : outputKind === "image"
        ? { kind: "image", format, orientation, width, height }
        : { kind: outputKind, format, orientation, width, height, fps };
    const manifest: ProjectManifest = {
      schemaVersion: 1,
      id,
      title: title.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      languages: {
        video: videoLanguage.trim(),
        voiceover: parseLanguageList(voiceoverLanguages),
        subtitles: parseLanguageList(subtitleLanguages),
        onScreenText: parseLanguageList(onScreenLanguages),
        metadata: parseLanguageList(metadataLanguages),
      },
      prompt: promptMode === "topic"
        ? { mode: "topic", topic: promptText.trim() }
        : { mode: "ready_prompt", originalText: promptText },
      output,
      assets: [],
      timeline: { durationMs: 0, tracks: [] },
    };

    try {
      if (!isProjectManifest(manifest)) {
        throw new Error("Proje verisi ortak proje şemasından geçemedi.");
      }
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
            <label>Çıktı türü
              <select value={outputKind} onChange={(event) => {
                const next = event.target.value as OutputKind;
                setOutputKind(next);
                setFormat(next === "video" ? "mp4" : next === "audio" ? "mp3" : next === "image" ? "png" : "gif");
              }}>
                <option value="video">Video</option><option value="audio">Ses</option><option value="image">Görsel</option><option value="animation">Animasyon</option>
              </select>
            </label>
            <label>Format
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                {outputKind === "video" && <><option value="mp4">MP4</option><option value="mov">MOV</option><option value="webm">WebM</option></>}
                {outputKind === "audio" && <><option value="mp3">MP3</option><option value="wav">WAV</option><option value="aac">AAC</option><option value="flac">FLAC</option></>}
                {outputKind === "image" && <><option value="png">PNG</option><option value="jpg">JPG</option><option value="webp">WebP</option></>}
                {outputKind === "animation" && <><option value="gif">GIF</option><option value="webp">Animated WebP</option></>}
              </select>
            </label>
            {outputKind !== "audio" && <>
              <label>Görüntü yönü
                <select value={orientation} onChange={(event) => setOrientation(event.target.value as VideoOrientation)}>
                  <option value="landscape">Yatay 16:9</option><option value="portrait">Dikey 9:16</option><option value="square">Kare 1:1</option>
                </select>
              </label>
              <label>Genişlik
                <input type="number" min={1} max={7680} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
              </label>
              <label>Yükseklik
                <input type="number" min={1} max={7680} value={height} onChange={(event) => setHeight(Number(event.target.value))} />
              </label>
            </>}
            {(outputKind === "video" || outputKind === "animation") && <label>FPS
              <select value={fps} onChange={(event) => setFps(Number(event.target.value))}>
                <option value={12}>12</option><option value={24}>24</option><option value={25}>25</option><option value={30}>30</option><option value={50}>50</option><option value={60}>60</option>
              </select>
            </label>}
            {outputKind === "audio" && <>
              <label>Örnekleme hızı
                <select value={sampleRate} onChange={(event) => setSampleRate(Number(event.target.value))}>
                  <option value={44100}>44.1 kHz</option><option value={48000}>48 kHz</option><option value={96000}>96 kHz</option>
                </select>
              </label>
              <label>Kanal
                <select value={channels} onChange={(event) => setChannels(Number(event.target.value))}>
                  <option value={1}>Mono</option><option value={2}>Stereo</option>
                </select>
              </label>
            </>}
          </div>
          <div className="form-section-title">Dil ayarları</div>
          <div className="language-grid">
            <label>Ana video dili
              <input value={videoLanguage} onChange={(event) => setVideoLanguage(event.target.value)} placeholder="tr" />
            </label>
            <label>Seslendirme dilleri
              <input value={voiceoverLanguages} onChange={(event) => setVoiceoverLanguages(event.target.value)} placeholder="tr, en, de" />
              <small>Birden fazla dil için virgülle ayır.</small>
            </label>
            <label>Altyazı dilleri
              <input value={subtitleLanguages} onChange={(event) => setSubtitleLanguages(event.target.value)} placeholder="en, tr, es" />
            </label>
            <label>Ekran yazısı dilleri
              <input value={onScreenLanguages} onChange={(event) => setOnScreenLanguages(event.target.value)} placeholder="tr, en" />
            </label>
            <label>Başlık ve açıklama dilleri
              <input value={metadataLanguages} onChange={(event) => setMetadataLanguages(event.target.value)} placeholder="tr, en" />
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
            <div><small>Çıktı</small><strong>{selected.manifest.output.kind.toUpperCase()} · {selected.manifest.output.format.toUpperCase()}{selected.manifest.output.kind === "audio" ? ` · ${selected.manifest.output.sampleRate} Hz · ${selected.manifest.output.channels} kanal` : ` · ${selected.manifest.output.width}×${selected.manifest.output.height}`}{(selected.manifest.output.kind === "video" || selected.manifest.output.kind === "animation") ? ` · ${selected.manifest.output.fps} FPS` : ""}</strong></div>
            <div><small>Prompt modu</small><strong>{selected.manifest.prompt?.mode === "ready_prompt" ? "Hazır prompt" : "Konu"}</strong></div>
            <div><small>Medya / Timeline</small><strong>{selected.manifest.assets.length} medya · {selected.manifest.timeline.tracks.length} kanal</strong></div>
          </div>
          <div className="prompt-preview"><small>Dil yapılandırması</small><p>Ana video: {selected.manifest.languages.video} · Seslendirme: {selected.manifest.languages.voiceover.join(", ") || "Yok"} · Altyazı: {selected.manifest.languages.subtitles.join(", ") || "Yok"} · Ekran yazısı: {selected.manifest.languages.onScreenText.join(", ") || "Yok"} · Metadata: {selected.manifest.languages.metadata.join(", ") || "Yok"}</p></div>
          {selected.manifest.prompt && <div className="prompt-preview"><small>Kaydedilen girdi</small><p>{selected.manifest.prompt.mode === "ready_prompt" ? selected.manifest.prompt.originalText : selected.manifest.prompt.topic}</p></div>}
        </section>
      )}

      <footer><span>UNIVERSAL VIDEO ENGINE</span><span>Veriler cihazında kalır · GitHub yalnızca kaynak kodu içindir</span></footer>
    </main>
  );
}

export default App;
