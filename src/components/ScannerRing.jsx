export default function ScannerRing({ scanning, progress }) {
  return (
    <div className="scanner-container">
      <div className={`outer-ring ${scanning ? "spin-slow" : ""}`}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="ring-dot"
            style={{ transform: `rotate(${i * 30}deg) translateY(-52px)` }}
          />
        ))}
      </div>
      <div className={`mid-ring ${scanning ? "spin-reverse" : ""}`}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="ring-dash"
            style={{ transform: `rotate(${i * 45}deg) translateY(-38px)` }}
          />
        ))}
      </div>
      <div className="inner-circle">
        {scanning ? (
          <div className="scan-progress-text">
            <span className="scan-pct">{progress}%</span>
            <span className="scan-label">TARANIYOR</span>
          </div>
        ) : (
          <div className="scan-idle-text">
            <span className="scan-icon-big">🛡</span>
          </div>
        )}
      </div>
    </div>
  );
}
