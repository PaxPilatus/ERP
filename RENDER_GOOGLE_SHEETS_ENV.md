# 🚀 Render Deployment - Google Sheets Environment Variablen (READ-ONLY)

Diese Datei zeigt, welche Umgebungsvariablen Sie in Render für die Google Sheets Integration setzen müssen.

**🔍 READ-ONLY Setup**: Diese App lädt nur Produktdaten aus Google Sheets. Lagerbestand-Updates werden von n8n verwaltet.

## 🔐 Required Environment Variables für Render

### Google Sheets Authentifizierung (READ-ONLY)
```bash
# Google Service Account Daten (aus sheets-key.json)
GOOGLE_SERVICE_ACCOUNT_EMAIL=cbd-laden-produkt-connection@cbdladen-app-connection.iam.gserviceaccount.com
GOOGLE_PROJECT_ID=cbdladen-app-connection
GOOGLE_CLIENT_ID=114612891621517963744

# Private Key (WICHTIG: Zeilenumbrüche als \n)
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCHLQIeonm3JBuF\nDvkq4ILUylwKmCjgIqzRzO0JTySBLACxQhMpzdaUQOKDxKM9xvYuRZ/pofcr8LMV\nj5qV+ZRoT6RxOC3K+wNf0XglJvIUApcr+dVTt6T7QgB7sBLOCHVKezFf4B4tFTOt\nv7o1Zfr8qF+0/Ud8viqiV5FgCrHwwERJtuIAqX3ddfjb07KSeQCKVz1AsXiDu9pK\nLGw/n9mYaR+w1yecRt2oVIYeyRnu0PlvY3CwE8J7JpPVV+Zxd2OzOBP5Gpc5hIXN\nG2tje+9OP56U9WVp8/r9VsJFg4RMtGH5kMkq3brdoe7CETzXxbehA+6ZlfqYawjD\nBl2x29gXAgMBAAECggEACaAa1ojwlynrC75/3529CIn1o+DR3aPvymtdNZx9F6BF\nLFoYIzyVBa7ZHP4+NtfuumdwIPgiMZl3fGw4BcCP4MhLCATdaJFshsDTsqbjS1Qj\n5O2//bDF/rOPH+pEbIdi/WVoTqYW1VRSfxIioErIDysDevp4wgPd5VF2+Jp1BpTl\nHUMBbHWUDTwBiqKglTNwiLQD0QqS1J2bdYBIkSJ8+BQOXfe5N5RvaTiAstMhCOXo\nyVHyJsjAPzvHmwjiFoPGLhKBDR2gB1sCvwtuxiJn53N1UVmvZZwNlrzlYRGeZVwl\n/fvuQJztBEC3ajIhZLi+qhNT7+EmY9wEzsJalNYdgQKBgQC+c5pYPrZxlMd46QDR\nBT5rVOIwWkJrZ1b4d6QskZ9DbgW2N7zoDeZfl1YDS5LOaNedxntgN+/j2dMgLZfW\nOcf/zCHICr4CMd8DQ0N7fCCWqNfVYA0oRd7fvM4ZT0B+5eJXoyU6Hy+AayOLfY0w\nOg2xkmA+mCDhEOtUt7An9Jh+kwKBgQC1sySCeQHw66QIzNp1KdOTX1aFdGtT9Spd\nHfTmEzXwSHeJ1mQq0mHdR9smoPjvlM6M2qPZ3VtddfNn3wT5uPkByjs1bIhU+eAO\nIOkGo2pgATwT11bKMvXrHgU3Q2jKzA6QqDwTej6YlzCCREjmNLb1z6CUCRPqJoaK\nyR2GGDbu7QKBgHjWhIGlGMEsMvwGapw0hYw4SWOAgVAAO3BfCO22X6S69CjPaK6b\n0yWnsc1ZcAZDAzt6KeG83BpnpMtv4jzsYHdun6h7GF/wIJ3DWdfJxCuTaY5a6T46\nRtUSyHnKjRN27IvKWd5s1wjV8bGZsbF9xB58z1An2gSzZX1VJxHS4ca9AoGADN6t\nfVhY3Nmz+rOX3aiixdOA6179oyrAX2wZxpohve1EGk1HNwlDyUqnqSrJtx6RKsTp\nyiq1p/8MyJSxY4bIjGnom7YeSfaQ+i82kjPM+xPbT4R3L0dAx/COagWqTIL7nR9t\nceu8t04uL2vqxfOB6hNUymeCM5ma+gWYw8C/U1kCgYAa0rkQ17g+i+MA3xyCbdt6\n5HHR2a7EwVRdw9pxyld3W0bqUaHmTqCRGYSLmevIxVwx5nH0ni1p1CpzY4zMeurH\nr5ohygSsVw4+Wx9HyWpO8XCsw/Pji+r6Y1SnCANZXZoXuZlyF9xRBsSHMzu1FMbJ\nRcICHQO517oko4ijPhfnBQ==\n-----END PRIVATE KEY-----
```

### Google Sheets Dokument Configuration
```bash
# Ihre Google Sheets Dokument-ID (aus der URL)
SHEET_ID=1_example_sheets_id_hier_einfügen

# Bereiche in Ihrem Google Sheets Dokument (READ-ONLY)
PRODUCTS_RANGE=Produkte!A2:A           # Produkte zum Laden
# Optional: RANGE=Produkte!A2:A         # Fallback für ältere Konfigurationen

# n8n Integration (handhabt alle Updates)
N8N_TEST_URL=https://n8n.cbdladen.ch/webhook-test/ca7a41c7-56b3-4e63-9985-6b3e85b9a2f9
```

## 📋 Google Sheets Dokument Struktur

Ihr Google Sheets Dokument sollte diese Arbeitsblätter haben:

### 1. "Produkte" Arbeitsblatt (READ-ONLY für App)
```
A       | B
--------|--------
Produkt | Info
Candy Flip | ...
Sweed Lemon | ...
...
```

### 2. "Lagerbestand" Arbeitsblatt (Nur für n8n)
```
A            | B      | C
-------------|--------|------------------
Produkt      | Menge  | Letztes Update
Candy Flip   | 45     | Verwaltet von n8n
Sweed Lemon  | 23     | Verwaltet von n8n
...
```

**💡 Hinweis**: Die App liest nur die Produktliste. Alle Lagerbestand-Updates werden von n8n verwaltet.

## 🚀 Render Deployment Schritte

### 1. Environment Variables in Render setzen

1. **Render Dashboard** → Ihr Service → **Environment**
2. **Add Environment Variable** für jede Variable oben
3. **WICHTIG**: Bei `GOOGLE_PRIVATE_KEY`:
   - Die komplette Private Key mit `\n` für Zeilenumbrüche kopieren
   - Keine Anführungszeichen hinzufügen

### 2. Google Sheets Berechtigungen (READ-ONLY)

1. **Google Cloud Console** → **IAM & Admin** → **Service Accounts**
2. Finden Sie Ihren Service Account: `cbd-laden-produkt-connection@...`
3. **Google Sheets Dokument** → **Teilen**
4. Service Account Email hinzufügen mit **Viewer**-Berechtigung (nicht Editor!)

### 3. Testing

Nach dem Deployment testen Sie:

```javascript
// In der Browser-Konsole auf der Buy-Seite
fetch('/api/products')
  .then(r => r.json())
  .then(console.log);

// Test der READ-ONLY Verbindung
fetch('/api/test-sheets')
  .then(r => r.json())
  .then(console.log);
```

## 🛠️ Troubleshooting

### ❌ "Authentication failed"
- ✅ Private Key korrekt mit `\n` formatiert?
- ✅ Service Account hat Viewer-Zugriff auf das Sheets Dokument?

### ❌ "Spreadsheet not found" 
- ✅ `SHEET_ID` ist korrekt?
- ✅ Dokument ist mit Service Account geteilt?

### ❌ "Range not found"
- ✅ Arbeitsblatt "Produkte" existiert?
- ✅ `PRODUCTS_RANGE` ist korrekt geschrieben?

## 🎯 Architektur-Übersicht

```
📱 Web App (READ-ONLY)
├── 📊 Lädt Produktliste aus Google Sheets
├── 🛒 Sendet Käufe an n8n Webhook
└── 🔍 Test-Endpoint für Verbindung

🔄 n8n Workflow
├── 📝 Empfängt Kauf-Daten
├── 📊 Aktualisiert Lagerbestand in Google Sheets
└── 📋 Verwaltet alle Updates
```

## 📊 Features nach dem Setup

✅ **Dynamische Produktliste**: Button "Aktuelle Produkte laden"  
✅ **n8n Integration**: Alle Käufe werden an n8n gesendet  
✅ **Saubere Trennung**: App = Frontend, n8n = Backend Logic  
✅ **Robust Fallback**: App funktioniert auch ohne Google Sheets  
✅ **Minimale Berechtigungen**: Nur READ-ONLY Zugriff für höhere Sicherheit

## 🔐 Sicherheit

- ✅ **READ-ONLY**: App kann keine Daten ändern
- ✅ **Umgebungsvariablen**: Private Key wird sicher gespeichert
- ✅ **Minimale Berechtigungen**: Service Account hat nur Viewer-Zugriff
- ✅ **n8n handhabt Updates**: Alle Schreibvorgänge über n8n Workflow 