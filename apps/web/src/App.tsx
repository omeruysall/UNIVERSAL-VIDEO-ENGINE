import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createMusicStudioDocument, isMusicStudioData, isProjectManifest, isProjectManifestV2, migrateProjectV1ToV2 } from "@uve/core";
import type { OutputKind, OutputSettings, ProjectManifest, ProjectManifestV2, StudioType, VideoOrientation } from "@uve/core";

const API = "/api/v1";

type ApiState = "checking" | "online" | "offline";
type PromptMode = "topic" | "ready_prompt";
type ProjectSummary = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};
type StoredProject = ProjectSummary & { manifest: ProjectManifest | ProjectManifestV2 };

const STUDIO_LABELS: Record<StudioType, string> = {
  video: "Video Studio",
  music: "Music Studio",
  audio: "Audio Studio",
  image: "Image Studio",
  animation: "Animation Studio",
  "3d": "3D Studio",
};

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
    const legacyManifest: ProjectManifest = {
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
      if (!isProjectManifest(legacyManifest)) {
        throw new Error("Proje verisi ortak proje şemasından geçemedi.");
      }
      const manifest = migrateProjectV1ToV2(legacyManifest);
      if (!manifest || !isProjectManifestV2(manifest)) {
        throw new Error("Proje v2 veri sözleşmesine dönüştürülemedi.");
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

  async function saveManifest(manifest: ProjectManifest | ProjectManifestV2) {
    if (!selected) return;
    setBusy(true);
    setMessage("");
    try {
      const updated = { ...manifest, updatedAt: now() };
      const response = await fetch(`${API}/projects/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, title: updated.title, manifest: updated }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail ?? "Proje güncellenemedi");
      }
      const saved = await response.json() as StoredProject;
      setSelected(saved);
      await refreshProjects();
      setMessage("Proje güncellendi ve yerel veritabanına kaydedildi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bilinmeyen hata");
    } finally {
      setBusy(false);
    }
  }

  async function upgradeSelectedProject() {
    if (!selected || selected.manifest.schemaVersion !== 1) return;
    const migrated = migrateProjectV1ToV2(selected.manifest);
    if (!migrated || !isProjectManifestV2(migrated)) {
      setMessage("Bu proje güvenli şekilde v2'ye dönüştürülemedi. Orijinal kayıt korunuyor.");
      return;
    }
    await saveManifest(migrated);
  }

  async function addStudio(studioType: StudioType) {
    if (!selected || selected.manifest.schemaVersion !== 2) return;
    const timestamp = now();
    const title = `${STUDIO_LABELS[studioType]} ${selected.manifest.studios.filter((studio) => studio.studioType === studioType).length + 1}`;
    const document = studioType === "music"
      ? createMusicStudioDocument(crypto.randomUUID(), title, timestamp)
      : {
          id: crypto.randomUUID(),
          studioType,
          documentVersion: 1,
          title,
          createdAt: timestamp,
          updatedAt: timestamp,
          assetIds: [],
          data: {},
        };
    await saveManifest({
      ...selected.manifest,
      studios: [...selected.manifest.studios, document],
    });
  }

  async function saveMusicSettings(event: FormEvent<HTMLFormElement>, studioId: string) {
    event.preventDefault();
    if (!selected || selected.manifest.schemaVersion !== 2) return;
    const formData = new FormData(event.currentTarget);
    const current = selected.manifest.studios.find((studio) => studio.id === studioId);
    if (!current || current.studioType !== "music" || !isMusicStudioData(current.data)) {
      setMessage("Müzik stüdyosu verisi doğrulanamadı.");
      return;
    }
    const nextData = {
      ...current.data,
      metadata: { ...current.data.metadata, genre: String(formData.get("genre") ?? "") },
      musical: {
        ...current.data.musical,
        bpm: Number(formData.get("bpm")),
        key: String(formData.get("key") ?? ""),
        mode: String(formData.get("mode") ?? "") as typeof current.data.musical.mode,
        timeSignature: {
          numerator: Number(formData.get("numerator")),
          denominator: Number(formData.get("denominator")) as 2 | 4 | 8 | 16,
        },
      },
      audio: {
        ...current.data.audio,
        sampleRate: Number(formData.get("sampleRate")) as typeof current.data.audio.sampleRate,
        bitDepth: Number(formData.get("bitDepth")) as typeof current.data.audio.bitDepth,
        loudnessTargetLufs: Number(formData.get("loudness")),
        truePeakLimitDbtp: Number(formData.get("truePeak")),
      },
    };
    if (!isMusicStudioData(nextData)) {
      setMessage("Müzik ayarları geçersiz. BPM, ölçü ve ses hedeflerini kontrol et.");
      return;
    }
    await saveManifest({
      ...selected.manifest,
      studios: selected.manifest.studios.map((studio) =>
        studio.id === studioId ? { ...studio, updatedAt: now(), data: nextData } : studio
      ),
    });
  }

  async function saveMusicArrangement(event: FormEvent<HTMLFormElement>, studioId: string) {
    event.preventDefault();
    if (!selected || selected.manifest.schemaVersion !== 2) return;
    const current = selected.manifest.studios.find((studio) => studio.id === studioId);
    if (!current || current.studioType !== "music" || !isMusicStudioData(current.data)) {
      setMessage("Müzik düzenlemesi doğrulanamadı.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const sections = current.data.arrangement.sections.map((section) => ({
      ...section,
      label: String(formData.get(`label:${section.id}`) ?? section.label).trim(),
      startBar: Number(formData.get(`startBar:${section.id}`)),
      bars: Number(formData.get(`bars:${section.id}`)),
      lyrics: String(formData.get(`lyrics:${section.id}`) ?? ""),
    }));
    const nextData = {
      ...current.data,
      arrangement: { ...current.data.arrangement, sections },
    };
    if (!isMusicStudioData(nextData)) {
      setMessage("Şarkı düzeni geçersiz. Bölüm adlarını ve ölçü aralıklarını kontrol et.");
      return;
    }
    await saveManifest({
      ...selected.manifest,
      studios: selected.manifest.studios.map((studio) =>
        studio.id === studioId ? { ...studio, updatedAt: now(), data: nextData } : studio
      ),
    });
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
          <div className="studio-area">
            <div className="studio-area-heading">
              <div><small>PROJECT STUDIO REGISTRY</small><h3>Proje stüdyoları</h3></div>
              <span className="tag">MANIFEST V{selected.manifest.schemaVersion}</span>
            </div>
            {selected.manifest.schemaVersion === 1 ? (
              <div className="upgrade-panel">
                <p>Bu proje eski v1 biçiminde. İçeriği değiştirmeden v2'ye yükselterek bağımsız stüdyo belgeleri ekleyebilirsin. Dönüşüm yalnızca bu düğmeye bastığında kaydedilir.</p>
                <button className="primary-button" type="button" onClick={() => void upgradeSelectedProject()} disabled={busy}>Projeyi v2'ye yükselt</button>
              </div>
            ) : (
              <>
                <div className="studio-grid">
                  {selected.manifest.studios.length === 0 ? <p className="empty-state">Bu projede henüz stüdyo belgesi yok. Aşağıdan bir stüdyo oluştur.</p> : selected.manifest.studios.map((studio) => (
                    <article className={studio.studioType === "music" ? "studio-card music-studio-card" : "studio-card"} key={studio.id}>
                      <div><small>{STUDIO_LABELS[studio.studioType]}</small><strong>{studio.title}</strong><span>{Object.keys(studio.data).length} veri alanı · Sürüm {studio.documentVersion}</span></div>
                      <span className="studio-state">BELGE OLUŞTURULDU</span>
                      {studio.studioType === "music" && isMusicStudioData(studio.data) && (
                        <form className="music-settings-form" onSubmit={(event) => void saveMusicSettings(event, studio.id)}>
                          <div className="music-form-heading"><strong>Music Studio · Session Setup</strong><span>Temel müzik oturumu ayarları</span></div>
                          <div className="music-settings-grid">
                            <label>BPM<input name="bpm" type="number" min="20" max="300" step="0.1" defaultValue={studio.data.musical.bpm} /></label>
                            <label>Ton<select name="key" defaultValue={studio.data.musical.key}>{["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
                            <label>Gam / Mod<select name="mode" defaultValue={studio.data.musical.mode}><option value="major">Majör</option><option value="minor">Minör</option><option value="dorian">Dorian</option><option value="phrygian">Phrygian</option><option value="lydian">Lydian</option><option value="mixolydian">Mixolydian</option><option value="locrian">Locrian</option><option value="harmonic_minor">Harmonic Minor</option><option value="melodic_minor">Melodic Minor</option></select></label>
                            <label>Ölçü payı<select name="numerator" defaultValue={studio.data.musical.timeSignature.numerator}>{[2,3,4,5,6,7,8,9,12].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
                            <label>Ölçü birimi<select name="denominator" defaultValue={studio.data.musical.timeSignature.denominator}>{[2,4,8,16].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
                            <label>Müzik türü<input name="genre" defaultValue={studio.data.metadata.genre} maxLength={80} /></label>
                            <label>Örnekleme hızı<select name="sampleRate" defaultValue={studio.data.audio.sampleRate}>{[44100,48000,88200,96000,192000].map((value) => <option key={value} value={value}>{(value/1000).toFixed(value%1000===0?0:1)} kHz</option>)}</select></label>
                            <label>Bit derinliği<select name="bitDepth" defaultValue={studio.data.audio.bitDepth}>{[16,24,32].map((value) => <option key={value} value={value}>{value}-bit</option>)}</select></label>
                            <label>Hedef loudness (LUFS)<input name="loudness" type="number" min="-36" max="0" step="0.1" defaultValue={studio.data.audio.loudnessTargetLufs} /></label>
                            <label>True Peak sınırı (dBTP)<input name="truePeak" type="number" min="-12" max="0" step="0.1" defaultValue={studio.data.audio.truePeakLimitDbtp} /></label>
                          </div>
                          <div className="music-session-summary">
                            <span>{studio.data.arrangement.sections.length} şarkı bölümü</span>
                            <span>{studio.data.arrangement.tracks.length} başlangıç kanalı</span>
                            <span>{studio.data.musical.tempoMap.length} tempo noktası</span>
                          </div>
                          <button type="submit" className="primary-button" disabled={busy}>Müzik ayarlarını kaydet</button>
                        </form>
                        <form className="music-arrangement-form" onSubmit={(event) => void saveMusicArrangement(event, studio.id)}>
                          <div className="music-form-heading">
                            <strong>Song Arrangement & Lyrics</strong>
                            <span>Bölüm sırası, ölçü uzunluğu ve özgün sözler</span>
                          </div>
                          <div className="arrangement-section-list">
                            {studio.data.arrangement.sections.map((section, index) => (
                              <fieldset className="arrangement-section" key={section.id}>
                                <legend>{index + 1}. {section.type.replaceAll("_", " ").toUpperCase()}</legend>
                                <div className="arrangement-section-fields">
                                  <label>Bölüm adı<input name={`label:${section.id}`} defaultValue={section.label} maxLength={80} required /></label>
                                  <label>Başlangıç ölçüsü<input name={`startBar:${section.id}`} type="number" min="1" max="10000" defaultValue={section.startBar} required /></label>
                                  <label>Uzunluk (ölçü)<input name={`bars:${section.id}`} type="number" min="1" max="512" defaultValue={section.bars} required /></label>
                                </div>
                                <label>Sözler / notlar<textarea name={`lyrics:${section.id}`} defaultValue={section.lyrics ?? ""} rows={3} placeholder="Bu bölüme ait sözleri yaz..." /></label>
                              </fieldset>
                            ))}
                          </div>
                          <div className="music-session-summary">
                            <span>{studio.data.arrangement.sections.length} bölüm</span>
                            <span>{studio.data.arrangement.sections.reduce((max, section) => Math.max(max, section.startBar + section.bars - 1), 0)} toplam ölçü sınırı</span>
                            <span>{studio.data.arrangement.sections.filter((section) => section.lyrics?.trim()).length} söz girilmiş bölüm</span>
                          </div>
                          <button type="submit" className="primary-button" disabled={busy}>Şarkı düzenini ve sözleri kaydet</button>
                        </form>
                      )}
                    </article>
                  ))}
                </div>
                <div className="studio-create">
                  <p>Yeni stüdyo belgesi oluştur</p>
                  <div className="studio-create-buttons">
                    {(Object.keys(STUDIO_LABELS) as StudioType[]).map((studioType) => (
                      <button key={studioType} type="button" className="secondary-button" disabled={busy} onClick={() => void addStudio(studioType)}>+ {STUDIO_LABELS[studioType]}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <footer><span>UNIVERSAL VIDEO ENGINE</span><span>Veriler cihazında kalır · GitHub yalnızca kaynak kodu içindir</span></footer>
    </main>
  );
}

export default App;
