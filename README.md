# 🔐 SecurePass Lite

A lightweight, secure, and dual-mode password manager that works as both a **Web App** and a **Browser Extension**.

> **Note:** Data is stored locally in your browser (LocalStorage). No data is sent to the cloud.

## ✨ Features

- **Dual Mode UI:** Automatically adapts layout for Full-screen Web or Compact Extension popup.
- **Smart Generation:** Customizable rules (Length, Symbols, Numbers).
- **QR Code Sharing:** Transfer passwords to mobile easily via QR code.
- **Local Storage:** Securely save your accounts locally.
- **Data Backup:** Import/Export your password vault as JSON.
- **One-Click Copy:** Fast and efficient workflow.

## 🚀 How to Use

### 🌐 Web Mode

Simply open `index.html` in any browser.

### 🧩 Extension Mode (Chrome / Edge)

1. Download the code or the latest release.
2. Open Chrome/Edge and go to `Extensions` > `Manage Extensions`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select this project folder.
5. Enjoy!

## 📁 Project Structure

- `index.html` / `favicon.svg`: Web Mode entry (open directly in a browser).
- `securepass-lite/`: Web Mode app code (JS modules + styles).
- `securepass-lite/index.html`: Optional alternative Web entry (kept for convenience).
- `manifest.json` / `popup.html` / `script.js` / `style.css`: Extension popup (Load Unpacked from repo root).
- `qrcode.min.js`: Local QRCode library used by both modes.

## 🛠️ Tech Stack

- HTML5 / CSS3 (Modern Flexbox & Glassmorphism UI)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- QRCode.js

## 📄 License

MIT License
