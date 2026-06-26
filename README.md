# 🛡 Hile Kontrol — Silvera Network

Minecraft oyuncularının GitHub geçmişini tarayarak hile kullanıp kullanmadığını analiz eden web uygulaması.

## Özellikler

- GitHub kullanıcı adı ile repo & commit geçmişi tarama
- Minecraft IGN ile profil arama
- Mod/plugin repo URL analizi
- 40+ hile terimi ve 13 bilinen hile istemcisi veri tabanı
- Risk skoru (0–100) ve TEMİZ / ŞÜPHELİ / HİLECİ verdict

## Kurulum

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

`main` branch'e push yapıldığında GitHub Actions otomatik olarak GitHub Pages'e deploy eder.

### GitHub Pages Ayarları

1. Repo → Settings → Pages
2. Source: **GitHub Actions** seç
3. `vite.config.js` içindeki `base` değerini repo adınla değiştir:
   ```js
   base: "/hile-kontrol/",
   ```

## Dosya Yapısı

```
src/
├── components/
│   ├── ScannerRing.jsx   — Dönen tarama animasyonu
│   ├── ResultBadge.jsx   — TEMİZ / ŞÜPHELİ / HİLECİ rozeti
│   └── FindingCard.jsx   — Açılıp kapanabilen bulgu kartı
├── utils/
│   ├── fetchGitHubData.js — GitHub API istekleri
│   └── analyzeData.js     — Hile analiz motoru
├── constants/
│   └── cheatList.js       — Hile terimleri & repo listesi
├── App.jsx
├── main.jsx
└── index.css
.github/
└── workflows/
    └── deploy.yml         — GitHub Actions otomatik deploy
```
