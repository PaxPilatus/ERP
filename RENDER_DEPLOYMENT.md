# 🚀 Render Deployment Anleitung

## GitHub Repository Setup

1. **Repository erstellen:**
   - Gehen Sie zu [GitHub](https://github.com) und erstellen Sie ein neues Repository
   - Name: `cbd-warenbestand-app` (oder wie gewünscht)
   - Stellen Sie sicher, dass es **Public** ist (oder Private mit entsprechendem Plan)

2. **Code hochladen:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CBD Warenbestand App"
   git branch -M main
   git remote add origin https://github.com/IHR-USERNAME/cbd-warenbestand-app.git
   git push -u origin main
   ```

## Render Deployment

### 1. Render Account erstellen
- Gehen Sie zu [render.com](https://render.com)
- Registrieren Sie sich (kostenlos)
- Verbinden Sie Ihr GitHub-Account

### 2. Web Service erstellen
1. **Dashboard → "New +"**
2. **"Web Service" auswählen**
3. **GitHub Repository verbinden:**
   - Repository auswählen: `ihr-username/cbd-warenbestand-app`
   - Branch: `main`

### 3. Konfiguration
```
Name: cbd-warenbestand-app
Environment: Node
Region: Frankfurt (EU Central) [empfohlen für Deutschland]
Branch: main
Build Command: npm install
Start Command: npm start
```

### 4. Umgebungsvariablen setzen
Im Render Dashboard unter "Environment":

```
NODE_ENV=production
SECRET_TOKEN=420
SESSION_SECRET=cbd-warenbestand-secret-key-2024
N8N_TEST_URL=https://paxpilatus.app.n8n.cloud/webhook-test/ca7a41c7-56b3-4e63-9985-6b3e85b9a2f9
```

**⚠️ WICHTIG für Session-Cookies:**
Diese Einstellungen beheben das Login-Problem auf HTTPS (Render):
- `NODE_ENV=production` aktiviert HTTPS-Sessions
- `SECRET_TOKEN=420` setzt den korrekten Login-Token
- Trust Proxy ist in der App konfiguriert

### 5. Deploy starten
- **"Create Web Service"** klicken
- Render wird automatisch deployen
- Erste Deployment dauert 2-3 Minuten

## Nach dem Deployment

### Ihre App-URL
- Render gibt Ihnen eine URL wie: `https://cbd-warenbestand-app-XXXX.onrender.com`
- Diese URL ist öffentlich erreichbar

### Login-URL
```
https://cbd-warenbestand-app-XXXX.onrender.com/login?token=IhrGeheimerToken123
```

### QR-Code generieren
```bash
# Lokal ausführen um QR-Code für die Live-URL zu generieren:
node generate-qr.js
# Dann die Render-URL eingeben
```

## n8n Konfiguration anpassen

### 1. Webhook-URLs aktualisieren
In Ihrem n8n Workflow:
- **Alte URL:** `http://localhost:3000/api/buy`
- **Neue URL:** `https://cbd-warenbestand-app-XXXX.onrender.com/api/buy`

### 2. Callback-URL (falls verwendet)
- **Neue URL:** `https://cbd-warenbestand-app-XXXX.onrender.com/n8n-callback`

## Wichtige Hinweise

### ✅ Vorteile von Render:
- **Kostenlos:** 750 Stunden/Monat gratis
- **Automatische HTTPS:** SSL-Zertifikat inklusive
- **Auto-Deploy:** Bei GitHub-Push automatisch deployen
- **Zuverlässig:** 99.9% Uptime

### ⚠️ Limitierungen (Free Plan):
- **Sleep-Modus:** App schläft nach 15 Min Inaktivität
- **Startup:** 30-60 Sekunden beim ersten Aufruf nach Sleep
- **Bandbreite:** 100GB/Monat
- **Build-Zeit:** 500 Stunden/Monat

### 🚀 Upgrade zu Paid Plan:
- **Kein Sleep-Modus:** App läuft 24/7
- **Schnellerer Start:** Sofortige Response
- **Mehr Ressourcen:** RAM und CPU
- **Custom Domains:** Eigene Domain verwenden

## Troubleshooting

### App startet nicht:
1. **Logs prüfen:** Render Dashboard → "Logs"
2. **Dependencies:** `package.json` vollständig?
3. **Start Command:** `npm start` korrekt?

### n8n Verbindung fehlgeschlagen:
1. **URL prüfen:** Render-URL in n8n eingetragen?
2. **HTTPS:** Nur HTTPS-URLs verwenden
3. **Timeouts:** n8n Timeout auf 30s+ setzen

## Monitoring

### Logs anschauen:
- **Render Dashboard → Ihr Service → "Logs"**
- **Real-time Logs:** Errors und Requests sichtbar

### Metriken:
- **CPU Usage:** Überwachung der Auslastung
- **Memory Usage:** RAM-Verbrauch
- **Response Times:** Performance-Monitoring

## Updates deployen

### Automatisch (empfohlen):
```bash
# Änderungen machen, dann:
git add .
git commit -m "Update: Beschreibung der Änderung"
git push
# Render deployed automatisch!
```

### Manuell:
- **Render Dashboard → "Manual Deploy"**

## Support

### Render Support:
- **Dokumentation:** [render.com/docs](https://render.com/docs)
- **Community:** Discord & Forum
- **Email:** Für bezahlte Pläne

### App-spezifische Probleme:
- **Logs prüfen:** Console-Ausgaben in Render
- **n8n testen:** Webhook-URLs einzeln aufrufen
- **Browser DevTools:** Frontend-Fehler analysieren 