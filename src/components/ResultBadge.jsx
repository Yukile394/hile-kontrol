export default function ResultBadge({ type }) {
  if (type === "clean")
    return (
      <div className="result-badge clean">
        <span className="badge-icon">✓</span>
        <span>TEMİZ</span>
      </div>
    );
  if (type === "suspicious")
    return (
      <div className="result-badge suspicious">
        <span className="badge-icon">⚠</span>
        <span>ŞÜPHELİ</span>
      </div>
    );
  if (type === "cheater")
    return (
      <div className="result-badge cheater">
        <span className="badge-icon">✗</span>
        <span>HİLECİ</span>
      </div>
    );
  return null;
}
