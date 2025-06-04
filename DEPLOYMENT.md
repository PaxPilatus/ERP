# 🚀 Deployment Guide

## 📦 Dateien für Übertragung

### ✅ SENDEN (Erforderliche Dateien):

```
CBD-Warenbestand/
├── app.js                 # Haupt-Server-Datei
├── package.json           # Dependencies-Definition
├── package-lock.json      # Exakte Dependency-Versionen
├── README.md             # Dokumentation
├── REQUIREMENTS.md       # System-Anforderungen
├── DEPLOYMENT.md         # Diese Datei
├── views/                # EJS Templates
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── buy.ejs
│   ├── restock.ejs
│   ├── wait-for-n8n.ejs
│   ├── error.ejs
│   ├── success.ejs
│   └── layout.ejs
├── public/               # Statische Dateien
│   ├── css/
│   │   └── style.css
│   ├── js/              (falls vorhanden)
│   └── manifest.json
└── generate-qr.js       # QR-Code Generator (optional)
```

### ❌ NICHT SENDEN (Werden neu erstellt):

```
CBD-Warenbestand/
├── node_modules/         # NPM Dependencies (sehr groß!)
├── ngrok.exe            # Plattform-spezifisch
├── ngrok.zip            # Nicht benötigt
├── test.js              # Temporäre Testdateien
└── *.log                # Log-Dateien
```

## 📋 Schritt-für-Schritt Deployment

### 1. Dateien vorbereiten (Sender-Computer)

```bash
# 1. Ordner erstellen für Übertragung
mkdir CBD-Warenbestand-Transfer

# 2. Erforderliche Dateien kopieren
# Windows PowerShell:
Copy-Item -Path "app.js","package.json","package-lock.json","README.md","REQUIREMENTS.md","DEPLOYMENT.md" -Destination "CBD-Warenbestand-Transfer\"
Copy-Item -Path "views","public" -Destination "CBD-Warenbestand-Transfer\" -Recurse

# Linux/macOS:
cp app.js package.json package-lock.json README.md REQUIREMENTS.md DEPLOYMENT.md CBD-Warenbestand-Transfer/
cp -r views public CBD-Warenbestand-Transfer/

# 3. Archiv erstellen
# Windows: Rechtsklick → "Senden an" → "ZIP-komprimierter Ordner"
# Linux/macOS:
tar -czf CBD-Warenbestand.tar.gz CBD-Warenbestand-Transfer/
```

### 2. Übertragungsmethoden

#### Option A: USB-Stick / Externe Festplatte
- ZIP-Datei auf USB-Stick kopieren
- Physisch an anderen Computer übertragen

#### Option B: Cloud-Storage
```bash
# Upload zu Google Drive, Dropbox, OneDrive, etc.
# Link mit anderem Computer teilen
```

#### Option C: Git Repository
```bash
# Repository erstellen (GitHub, GitLab, etc.)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/cbd-warenbestand.git
git push -u origin main

# Auf anderem Computer:
git clone https://github.com/username/cbd-warenbestand.git
```

### 3. Installation auf Ziel-Computer

#### Schritt 1: Voraussetzungen prüfen
```bash
# Node.js installiert?
node --version    # Sollte v16.x+ zeigen
npm --version     # Sollte v6.x+ zeigen

# Falls nicht installiert:
# Windows: https://nodejs.org/de/download/
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
```

#### Schritt 2: Projekt entpacken
```bash
# ZIP entpacken oder Git Repository klonen
cd CBD-Warenbestand

# Verzeichnisinhalt prüfen
ls -la          # Linux/macOS
dir             # Windows
```

#### Schritt 3: Dependencies installieren
```bash
# NPM Dependencies installieren
npm install

# Erfolg prüfen
npm list --depth=0
```

#### Schritt 4: Konfiguration anpassen
```javascript
// app.js bearbeiten:

// Token anpassen (falls gewünscht)
const SECRET_TOKEN = 'IHR_NEUER_TOKEN';

// n8n URL anpassen (falls andere Instanz)
const N8N_TEST_URL = 'https://IHRE-N8N-INSTANZ.app.n8n.cloud/webhook/...';
```

#### Schritt 5: Test-Start
```bash
# App testweise starten
npm start

# Browser öffnen
# http://localhost:3000/login?token=IHR_TOKEN
```

### 4. ngrok Setup (für öffentlichen Zugang)

#### ngrok herunterladen
```bash
# Windows:
# https://ngrok.com/download → Windows 64-bit herunterladen

# macOS:
brew install ngrok/ngrok/ngrok

# Linux:
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

#### ngrok konfigurieren
```bash
# Authtoken von ngrok.com Dashboard holen
# Windows:
.\ngrok.exe config add-authtoken YOUR_AUTHTOKEN

# macOS/Linux:
ngrok config add-authtoken YOUR_AUTHTOKEN

# Tunnel starten
# Windows:
.\ngrok.exe http 3000

# macOS/Linux:
ngrok http 3000
```

## 🔧 Automatisiertes Deployment-Script

### deploy.sh (Linux/macOS)
```bash
#!/bin/bash
echo "🚀 CBD Warenbestand Deployment gestartet..."

# 1. Dependencies installieren
echo "📦 Installiere Dependencies..."
npm install

# 2. Konfiguration prüfen
echo "⚙️ Prüfe Konfiguration..."
if ! grep -q "SECRET_TOKEN" app.js; then
    echo "❌ Konfiguration fehlt in app.js"
    exit 1
fi

# 3. App starten
echo "🌟 Starte App..."
npm start
```

### deploy.bat (Windows)
```batch
@echo off
echo 🚀 CBD Warenbestand Deployment gestartet...

echo 📦 Installiere Dependencies...
npm install

echo ⚙️ Prüfe Konfiguration...
findstr "SECRET_TOKEN" app.js >nul
if errorlevel 1 (
    echo ❌ Konfiguration fehlt in app.js
    pause
    exit /b 1
)

echo 🌟 Starte App...
npm start
```

## 📊 Deployment-Checkliste

### Vor der Übertragung:
- [ ] Alle erforderlichen Dateien vorhanden
- [ ] node_modules/ NICHT inkludiert
- [ ] Sensible Daten entfernt/anonymisiert
- [ ] README.md und REQUIREMENTS.md aktuell

### Nach der Installation:
- [ ] Node.js korrekte Version installiert
- [ ] `npm install` erfolgreich
- [ ] App startet ohne Fehler (`npm start`)
- [ ] Login mit Token funktioniert
- [ ] Kauf-Formular lädt
- [ ] Upload-Formular lädt

### Für öffentlichen Zugang:
- [ ] ngrok installiert und konfiguriert
- [ ] Tunnel läuft (`ngrok http 3000`)
- [ ] Öffentliche URL erreichbar
- [ ] n8n URLs in app.js aktualisiert

## 🚨 Häufige Probleme

### Problem: "Cannot find module"
```bash
# Lösung: Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Port 3000 already in use"
```bash
# Windows:
taskkill /f /im node.exe

# Linux/macOS:
pkill node

# Dann neu starten:
npm start
```

### Problem: "Permission denied" (Linux/macOS)
```bash
# ngrok ausführbar machen:
chmod +x ngrok

# Node.js Berechtigung:
sudo chown -R $(whoami) ~/.npm
```

### Problem: "Module version mismatch"
```bash
# Node.js Version prüfen:
node --version

# Dependencies für korrekte Node-Version neu kompilieren:
npm rebuild
```

## 📁 Backup-Strategie

### Vor großen Änderungen:
```bash
# Komplettes Projekt sichern
cp -r CBD-Warenbestand CBD-Warenbestand-backup-$(date +%Y%m%d)

# Oder Git verwenden:
git add .
git commit -m "Backup vor Änderungen"
```

### Regelmäßige Backups:
- **Code**: Git Repository (GitHub, GitLab)
- **Konfiguration**: Separate Datei für Tokens/URLs
- **Logs**: Wichtige Logs archivieren

## 🔄 Update-Prozess

### Code-Updates:
```bash
# 1. Neue Dateien erhalten
# 2. Backup erstellen
# 3. Dateien ersetzen (außer node_modules)
# 4. Dependencies aktualisieren:
npm update
# 5. App neu starten
```

### Dependency-Updates:
```bash
# Sicherheitsupdates:
npm audit fix

# Alle Updates:
npm update

# Große Updates prüfen:
npm outdated
```

---

**🚀 Deployment abgeschlossen!**  
*App läuft? → [Nutzung starten](README.md#-nutzung)* 