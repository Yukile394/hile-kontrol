import { useState, useRef } from "react";
import ScannerRing from "./components/ScannerRing";
import ResultBadge from "./components/ResultBadge";
import FindingCard from "./components/FindingCard";
import { fetchGitHubData } from "./utils/fetchGitHubData";
import { analyzeData } from "./utils/analyzeData";
import "./index.css";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const progressRef = useRef(null);

  function selectMode(m) {
    setMode(m);
    setScreen("input");
    setInput("");
    setError(null);
  }

  function simulateProgress() {
    const steps = [
      { pct: 10, text: "GitHub bağlantısı kuruluyor..." },
      { pct: 22, text: "Kullanıcı profili alınıyor..." },
      { pct: 38, text: "Repolar taranıyor..." },
      { pct: 54, text: "Fork geçmişi analiz ediliyor..." },
      { pct: 68, text: "Commit mesajları inceleniyor..." },
      { pct: 82, text: "Hile veri tabanıyla karşılaştırılıyor..." },
      { pct: 95, text: "Rapor oluşturuluyor..." },
    ];
    let i = 0;
    return new Promise((resolve) => {
      progressRef.current = setInterval(() => {
        if (i < steps.length) {
          setProgress(steps[i].pct);
          setStatusText(steps[i].text);
          i++;
        } else {
          clearInterval(progressRef.current);
          resolve();
        }
      }, 420);
    });
  }

  async function startScan() {
    if (!input.trim()) return;
    setError(null);
    setScreen("scanning");
    setScanning(true);
    setProgress(0);

    const progressPromise = simulateProgress();

    try {
      const username = input
        .trim()
        .replace("https://github.com/", "")
        .replace(/\/$/, "")
        .split("/")[0];

      const { repos, events } = await fetchGitHubData(username);
      await progressPromise;
      clearInterval(progressRef.current);
      setProgress(100);
      setStatusText("Tamamlandı!");
      await new Promise((r) => setTimeout(r, 600));

      const analysis = analyzeData(repos, events, username);
      setResult({ username, ...analysis });
      setScanning(false);
      setScreen("result");
    } catch (e) {
      clearInterval(progressRef.current);
      setScanning(false);
      setError(e.message || "Bilinmeyen hata");
      setScreen("input");
    }
  }

  function reset() {
    setScreen("menu");
    setMode(null);
    setInput("");
    setResult(null);
    setError(null);
    setProgress(0);
    setStatusText("");
  }

  return (
    <div className="app">
      {screen !== "scanning" && (
        <div className="logo-area">
          <div className="logo-badge">
            <span className="logo-icon">🛡</span>
            <span className="logo-name">Silvera Network</span>
          </div>
          <div className="logo-title">Hile Kontrol</div>
          <div className="logo-sub">GitHub geçmişini tara · Minecraft hile tespiti</div>
        </div>
      )}

      {screen === "menu" && (
        <div className="menu-card">
          <div className="menu-label">Tarama Yöntemi Seç</div>

          <button className="mode-btn" onClick={() => selectMode("github")}>
            <div className="mode-icon-wrap blue">🐙</div>
            <div className="mode-text">
              <strong>GitHub Kullanıcısı</strong>
              <span>Kullanıcı adı ile repo & commit geçmişi tara</span>
            </div>
            <span className="mode-arrow">›</span>
          </button>

          <button className="mode-btn" onClick={() => selectMode("username")}>
            <div className="mode-icon-wrap purple">👤</div>
            <div className="mode-text">
              <strong>Oyuncu Adı</strong>
              <span>Minecraft IGN ile GitHub profili bul ve tara</span>
            </div>
            <span className="mode-arrow">›</span>
          </button>

          <button className="mode-btn" onClick={() => selectMode("mod")}>
            <div className="mode-icon-wrap green">🧩</div>
            <div className="mode-text">
              <strong>Mod / Proje Tara</strong>
              <span>GitHub repo URL ile modun içeriğini analiz et</span>
            </div>
            <span className="mode-arrow">›</span>
          </button>

          <hr className="divider" />
          <div className="scan-cta-wrap">
            <span className="scan-cta-text">
              Gerçek zamanlı GitHub API analizi · Ücretsiz · Kayıt gerektirmez
            </span>
          </div>
        </div>
      )}

      {screen === "input" && (
        <div className="input-card">
          <button className="back-btn" onClick={reset}>
            ← Geri
          </button>

          <div className="input-label">
            {mode === "github" && "GitHub Tarama"}
            {mode === "username" && "Oyuncu Tarama"}
            {mode === "mod" && "Mod Tarama"}
          </div>
          <div className="input-title">
            {mode === "github" && "Kullanıcı adı gir"}
            {mode === "username" && "Minecraft kullanıcı adı"}
            {mode === "mod" && "GitHub repo URL gir"}
          </div>
          <div className="input-desc">
            {mode === "github" && "GitHub kullanıcı adını veya profil URL'sini gir. Repolar, forklar ve commit geçmişi analiz edilecek."}
            {mode === "username" && "Oyuncunun IGN'ini gir. GitHub'da aynı isimli profil aranacak ve analiz edilecek."}
            {mode === "mod" && "Mod veya plugin repo URL'si gir. Projenin sahibi ve geçmişi analiz edilecek."}
          </div>

          <div className="input-field-wrap">
            <span className="input-icon">
              {mode === "github" && "🐙"}
              {mode === "username" && "👤"}
              {mode === "mod" && "🧩"}
            </span>
            <input
              className="input-field"
              placeholder={
                mode === "github" ? "örn: Yukile394" :
                mode === "username" ? "örn: Steve2024" :
                "github.com/kullanici/repo"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startScan()}
              autoFocus
            />
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <button className="scan-btn" onClick={startScan} disabled={!input.trim()}>
            🔍 TARAMI BAŞLAT
          </button>
        </div>
      )}

      {screen === "scanning" && (
        <div className="scan-screen">
          <div className="logo-area" style={{ marginBottom: 0 }}>
            <div className="logo-badge">
              <span className="logo-icon">🛡</span>
              <span className="logo-name">Hile Kontrol</span>
            </div>
          </div>
          <div className="scan-card">
            <ScannerRing scanning={scanning} progress={progress} />
            <div className="scan-username">@{input.trim().split("/").pop()}</div>
            <div className="scan-status">{statusText}</div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {screen === "result" && result && (
        <div className="result-screen">
          <div className="result-header">
            <div className="result-top">
              <div className="result-user">
                <span>Analiz Sonucu</span>
                @{result.username}
              </div>
              <ResultBadge type={result.verdict} />
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <span className={`stat-val ${result.riskScore >= 60 ? "danger" : result.riskScore >= 20 ? "warn" : "good"}`}>
                  {result.riskScore}
                </span>
                <span className="stat-label">Risk Puanı</span>
              </div>
              <div className="stat-box">
                <span className={`stat-val ${result.findings.length > 0 ? "danger" : "good"}`}>
                  {result.findings.length}
                </span>
                <span className="stat-label">Bulgu</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{result.repoCount}</span>
                <span className="stat-label">Repo</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{result.mcCount}</span>
                <span className="stat-label">MC Repo</span>
              </div>
            </div>

            <div className="risk-bar-wrap">
              <div className="risk-bar-label">
                <span>Risk Seviyesi</span>
                <span>{result.riskScore >= 60 ? "YÜKSEK" : result.riskScore >= 20 ? "ORTA" : "DÜŞÜK"}</span>
              </div>
              <div className="risk-bar-outer">
                <div
                  className={`risk-bar-inner ${result.riskScore >= 60 ? "high" : result.riskScore >= 20 ? "mid" : "low"}`}
                  style={{ width: `${result.riskScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="findings-section">
            {result.findings.length === 0 ? (
              <div className="clean-notice">
                <div className="ci">✅</div>
                <strong>Temiz Profil</strong>
                <div style={{ fontSize: 13, marginTop: 4, color: "#22c55e" }}>
                  Hile ile ilgili herhangi bir bulgu tespit edilmedi.
                </div>
              </div>
            ) : (
              <>
                <div className="findings-title">
                  {result.findings.length} Bulgu Tespit Edildi
                </div>
                {result.findings.map((f, i) => (
                  <FindingCard key={i} finding={f} index={i} />
                ))}
              </>
            )}
          </div>

          <button className="new-scan-btn" onClick={reset}>
            ← Yeni Tarama Başlat
          </button>
        </div>
      )}
    </div>
  );
}
