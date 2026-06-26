import { useState } from "react";

export default function FindingCard({ finding, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`finding-card sev-${finding.severity}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="finding-header" onClick={() => setOpen(!open)}>
        <div className="finding-left">
          <span className={`sev-dot sev-${finding.severity}`} />
          <span className="finding-title">{finding.title}</span>
        </div>
        <div className="finding-right">
          <span className="finding-type">{finding.category}</span>
          <span className="chevron">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="finding-body">
          <p className="finding-desc">{finding.description}</p>
          {finding.matches && finding.matches.length > 0 && (
            <div className="match-list">
              {finding.matches.map((m, i) => (
                <span key={i} className="match-tag">
                  {m}
                </span>
              ))}
            </div>
          )}
          {finding.url && (
            <a
              href={finding.url}
              target="_blank"
              rel="noopener noreferrer"
              className="finding-link"
            >
              GitHub'da Görüntüle →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
