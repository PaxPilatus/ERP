# 📋 System Requirements

## 🖥️ Hardware-Anforderungen

### Minimum:
- **CPU**: 1 GHz Dual-Core
- **RAM**: 2 GB
- **Storage**: 500 MB freier Speicherplatz
- **Internet**: Breitband-Verbindung für n8n/ngrok

### Empfohlen:
- **CPU**: 2+ GHz Quad-Core
- **RAM**: 4+ GB
- **Storage**: 1+ GB freier Speicherplatz
- **Internet**: Stabile Breitband-Verbindung

## 💻 Betriebssystem-Support

### ✅ Vollständig unterstützt:
- **Windows**: 10, 11 (64-bit)
- **macOS**: 10.15+ (Catalina und neuer)
- **Linux**: Ubuntu 18.04+, Debian 10+, CentOS 8+

### ⚠️ Eingeschränkt unterstützt:
- **Windows**: 7, 8, 8.1 (mit Node.js 16.x)
- **macOS**: 10.14 und älter

## 🛠️ Software-Anforderungen

### Erforderlich:

#### Node.js & npm
- **Node.js**: Version 16.x, 18.x, oder 20.x (LTS empfohlen)
- **npm**: Version 6.x oder höher (wird mit Node.js installiert)

**Installation:**
```bash
# Windows (über offizielle Website)
# https://nodejs.org/de/download/

# macOS (Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

**Version prüfen:**
```bash
node --version    # v18.17.0 oder höher
npm --version     # 9.6.7 oder höher
```

### Optional (für erweiterte Features):

#### ngrok
- **Version**: 3.x (neueste empfohlen)
- **Account**: Kostenloser ngrok-Account
- **Zweck**: Öffentlicher Zugang zur lokalen App

#### Git (für Versionskontrolle)
- **Version**: 2.x oder höher
- **Zweck**: Code-Updates und Deployment

## 🌐 Externe Services

### n8n.cloud
- **Account**: Kostenloser oder kostenpflichtiger Account
- **API**: Webhook-Unterstützung erforderlich
- **Limits**: Kostenlos = 5.000 Workflow-Ausführungen/Monat

### ngrok
- **Account**: Kostenloser Account ausreichend
- **Limits**: 
  - Kostenlos: 1 aktiver Tunnel, 40 Verbindungen/Minute
  - Kostenpflichtig: Unbegrenzte Tunnel, Custom Domains

## 📦 Node.js Dependencies

### Production Dependencies:
```json
{
  "axios": "^1.6.0",          // HTTP Client für n8n
  "body-parser": "^1.20.2",   // Request Body Parsing
  "cookie-parser": "^1.4.6",  // Cookie Management
  "ejs": "^3.1.9",           // Template Engine
  "express": "^4.18.2",      // Web Framework
  "express-session": "^1.17.3", // Session Management
  "form-data": "^4.0.0",     // Multipart Forms
  "multer": "^1.4.5-lts.1",  // File Upload
  "open": "^9.1.0",          // Auto-Browser-Open
  "uuid": "^9.0.1"           // UUID Generation
}
```

### Development Dependencies:
```json
{
  "nodemon": "^3.0.2"        // Auto-Restart beim Development
}
```

**Automatische Installation:**
```bash
npm install  # Installiert alle Dependencies aus package.json
```

## 🚦 Netzwerk-Anforderungen

### Ports:
- **3000**: App-Server (HTTP)
- **4040**: ngrok Web Interface (lokal)
- **80/443**: ngrok Tunnel (extern)

### Firewall:
```bash
# Windows Firewall
# Regel für Port 3000 eingehend erstellen

# Linux iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# macOS (standardmäßig offen)
```

### Internet-Verbindungen:
- **Ausgehend HTTPS (443)**:
  - `api.ngrok.com` (ngrok API)
  - `*.ngrok-free.app` (ngrok Tunnel)
  - `*.app.n8n.cloud` (n8n Webhooks)
  - `registry.npmjs.org` (npm packages)

## 📱 Browser-Kompatibilität

### ✅ Vollständig unterstützt:
- **Chrome**: 90+ (Desktop & Mobile)
- **Firefox**: 88+ (Desktop & Mobile)
- **Safari**: 14+ (Desktop & Mobile)
- **Edge**: 90+ (Desktop & Mobile)

### ⚠️ Eingeschränkt unterstützt:
- **Internet Explorer**: Nicht unterstützt
- **Opera**: 76+ (grundlegende Funktionen)

### Erforderliche Browser-Features:
- ES6+ JavaScript Support
- Fetch API
- FormData API
- File API (für Upload)
- Local Storage
- Session Storage

## 🔧 Development Tools (Optional)

### Code Editor:
- **Visual Studio Code** (empfohlen)
- **WebStorm**
- **Sublime Text**
- **Atom**

### Nützliche VS Code Extensions:
- **ES6 Snippets**
- **Prettier** (Code Formatting)
- **ESLint** (Code Linting)
- **Thunder Client** (API Testing)

### Debugging Tools:
- **Chrome DevTools**
- **Postman** (API Testing)
- **ngrok Inspector** (http://localhost:4040)

## 📊 Performance-Benchmarks

### Minimale Performance:
- **Startup Zeit**: < 3 Sekunden
- **Response Zeit**: < 500ms (lokal)
- **File Upload**: 10MB in < 30 Sekunden

### Optimale Performance:
- **Startup Zeit**: < 1 Sekunde
- **Response Zeit**: < 100ms (lokal)
- **File Upload**: 10MB in < 10 Sekunden

## 🚨 Bekannte Probleme

### Windows:
- **Problem**: `EADDRINUSE` Fehler beim Start
- **Lösung**: `taskkill /f /im node.exe` ausführen

### macOS:
- **Problem**: Permission Denied bei ngrok
- **Lösung**: `chmod +x ngrok` ausführen

### Linux:
- **Problem**: Port 3000 bereits belegt
- **Lösung**: `sudo lsof -i :3000` und Prozess beenden

## 🔄 Update-Pfad

### Node.js Updates:
```bash
# Version prüfen
node --version

# Bei älteren Versionen: Neuinstallation erforderlich
# Download von https://nodejs.org
```

### App Updates:
```bash
# Dependencies aktualisieren
npm update

# Sicherheitsupdates
npm audit fix
```

## ✅ Installation Verification

### System Check:
```bash
# Node.js
node --version
npm --version

# Git (optional)
git --version

# Verfügbarer Speicher
df -h  # Linux/macOS
dir    # Windows
```

### App Check:
```bash
# Dependencies installiert?
npm list --depth=0

# App startet?
npm start

# Port verfügbar?
netstat -an | grep 3000  # Linux/macOS
netstat -an | findstr 3000  # Windows
```

---

**📋 Requirements-Check abgeschlossen!**  
*Alle Anforderungen erfüllt? → [Installation starten](README.md)* 