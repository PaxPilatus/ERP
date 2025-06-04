# 🌿 CBD Warenbestand Management System

Ein Node.js-basiertes Warenbestand-Management-System für CBD-Produkte mit n8n-Integration und ngrok-Support für externe Zugriffe.

## 📋 Features

- 🛒 **Kauf-Management**: Produkte kaufen mit automatischer Bestandsverringerung
- 📦 **Auffüllen-System**: Rechnung-Upload mit automatischer Bestandserhöhung
- 🔐 **Token-basierte Authentifizierung**: Sicherer Zugang über QR-Code oder Token
- 🌐 **n8n Integration**: Automatische Datenverarbeitung über Webhooks
- 📱 **Mobile-Optimiert**: Responsive Design für Smartphone-Nutzung
- 🔗 **ngrok Support**: Öffentlicher Zugang über Tunnel
- 🎨 **Modern UI**: Schönes, benutzerfreundliches Interface

## 🛠️ Technologie-Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS Templates, Vanilla JavaScript
- **File Upload**: Multer
- **HTTP Client**: Axios
- **Session Management**: express-session
- **Tunnel**: ngrok
- **Automation**: n8n.io

## 📦 Installation

### Voraussetzungen

- **Node.js** (Version 16.x oder höher)
- **npm** (wird mit Node.js installiert)
- **ngrok Account** (kostenlos auf [ngrok.com](https://ngrok.com))
- **n8n Account** (kostenlos auf [n8n.cloud](https://n8n.cloud))

### 1. Projekt Setup

```bash
# In den Projektordner wechseln
cd CBD-Warenbestand

# Dependencies installieren
npm install

# App starten
npm start
```

### 2. ngrok Setup (für öffentlichen Zugang)

1. **Account erstellen**: Registrierung auf [ngrok.com](https://ngrok.com/signup)
2. **Authtoken holen**: Dashboard → "Your Authtoken"
3. **ngrok konfigurieren**:
   ```bash
   # Windows
   .\ngrok.exe config add-authtoken YOUR_AUTHTOKEN_HERE
   
   # macOS/Linux
   ./ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```
4. **Tunnel starten**:
   ```bash
   # Windows
   .\ngrok.exe http 3000
   
   # macOS/Linux  
   ./ngrok http 3000
   ```

### 3. n8n Setup

1. **Account erstellen**: Registrierung auf [n8n.cloud](https://n8n.cloud)
2. **Workflow erstellen** mit HTTP Request Node
3. **Webhook-URLs konfigurieren**:
   - Test-URL: Für die App → n8n
   - API-URL: Für n8n → App

## ⚙️ Konfiguration

### App-Konfiguration (`app.js`)

```javascript
// Login-Token ändern
const SECRET_TOKEN = 'IHR_GEHEIMER_TOKEN';

// n8n Webhook-URL aktualisieren
const N8N_TEST_URL = 'https://IHRE-N8N-INSTANCE.app.n8n.cloud/webhook/...';
```

### n8n Workflow Konfiguration

#### Für Käufe (HTTP Request Node):
```
URL: https://IHRE-NGROK-URL.ngrok-free.app/api/buy
Method: POST
Headers: Content-Type: application/json
Body: {
  "name": "{{ $json.name }}",
  "product": "{{ $json.product }}",
  "quantity": "{{ $json.quantity }}",
  "notes": "{{ $json.notes }}"
}
```

#### Für Uploads (Webhook Node):
```
URL: https://IHRE-N8N-INSTANCE.app.n8n.cloud/webhook/upload
Method: POST
Accept file uploads: enabled
```

## 🚀 Nutzung

### 1. App starten

```bash
npm start
```

Die App läuft standardmäßig auf `http://localhost:3000`

### 2. Login

- **Browser**: `http://localhost:3000/login?token=IHR_TOKEN`
- **QR-Code**: Wird automatisch generiert
- **Mobile**: QR-Code scannen

### 3. Funktionen

#### Kauf tätigen:
1. "Kaufen" wählen
2. Name, Produkt, Stückzahl eingeben
3. "Kauf bestätigen" → Popup wartet auf n8n-Response
4. Erfolgsmeldung mit Details anzeigen

#### Bestand auffüllen:
1. "Auffüllen" wählen  
2. Rechnung-Foto hochladen
3. "Warenbestand auffüllen" → Popup wartet auf n8n-Response
4. Erfolgsmeldung mit Upload-Details anzeigen

## 📡 API-Endpoints

### Für n8n Integration:

```http
POST /api/buy
Content-Type: application/json

{
  "name": "Kundenname",
  "product": "CBD Öl 10%", 
  "quantity": "2",
  "notes": "Optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Erfolgreich gespeichert!",
  "data": {
    "Name": "Kundenname",
    "Produkt": "CBD Öl 10%",
    "Stückzahl": 2,
    "Datum": "2025-06-02T...",
    "Lagerbestand": 98
  },
  "orderId": "uuid"
}
```

## 🔧 Troubleshooting

### Port bereits in Verwendung
```bash
# Windows
taskkill /f /im node.exe

# macOS/Linux
pkill node

# Dann neu starten
npm start
```

### ngrok Verbindungsprobleme
```bash
# ngrok neu starten
# Windows
.\ngrok.exe http 3000

# URL in n8n aktualisieren
```

### n8n Webhook Fehler
- ✅ Webhook-URL korrekt in `app.js`
- ✅ n8n Workflow aktiv
- ✅ Content-Type: application/json
- ✅ ngrok Tunnel läuft

## 📁 Projektstruktur

```
CBD-Warenbestand/
├── app.js                 # Haupt-Server-Datei
├── package.json           # Dependencies
├── README.md             # Diese Datei
├── views/                # EJS Templates
│   ├── login.ejs         # Login-Seite
│   ├── dashboard.ejs     # Hauptmenü
│   ├── buy.ejs           # Kauf-Formular
│   ├── restock.ejs       # Upload-Formular
│   └── ...
├── public/               # Statische Dateien
│   ├── css/
│   │   └── style.css     # Haupt-Stylesheet
│   └── manifest.json     # PWA Manifest
└── node_modules/         # Dependencies (nicht übertragen)
```

## 🔐 Sicherheit

- **Token-Authentifizierung**: Alle Routen geschützt
- **Session-Management**: Sichere Cookie-basierte Sessions
- **File Upload Limits**: Max. 10MB pro Datei
- **Input Validation**: Alle Eingaben werden validiert

## 🌐 Deployment

### Lokaler Betrieb
```bash
npm start
# + ngrok für öffentlichen Zugang
```

### Cloud Deployment (z.B. Heroku)
1. `Procfile` erstellen: `web: node app.js`
2. Environment Variables setzen
3. ngrok durch Cloud-URL ersetzen

## 📞 Support

Bei Problemen:
1. Logs in der Konsole prüfen
2. ngrok Status überprüfen
3. n8n Workflow-Logs ansehen
4. Browser Developer Tools nutzen

## 📄 Lizenz

Dieses Projekt ist für interne Nutzung bestimmt.

---

**🌿 CBD Warenbestand Management System v1.0**  
*Entwickelt für effizientes Bestandsmanagement* 