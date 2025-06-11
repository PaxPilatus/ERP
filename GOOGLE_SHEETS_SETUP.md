# 📊 Google Sheets Integration - Setup Guide

Diese Anleitung führt Sie durch die Einrichtung der Google Sheets Integration für dynamische Produktauswahl.

## 🎯 Übersicht

Mit dieser Integration können Sie:
- **📊 Produkte dynamisch laden**: Button "Aktuelle Produkte laden" holt Daten aus Google Sheets
- **⚡ Schnelle Performance**: 5-Minuten Cache für optimale Ladezeiten
- **🔄 Automatische Updates**: Produkte sind immer aktuell ohne App-Neustart
- **🛡️ Fallback-System**: Bei Fehlern werden statische Produkte verwendet

---

## 📋 Schritt 1: Google Cloud Setup

### 1.1 Google Cloud Projekt erstellen
1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com)
2. Klicken Sie auf **"Projekt erstellen"**
3. Geben Sie einen Projektnamen ein: `CBD-Warenbestand-Sheets`
4. Klicken Sie auf **"Erstellen"**

### 1.2 Google Sheets API aktivieren
1. Im Google Cloud Console → **"APIs & Dienste"** → **"Bibliothek"**
2. Suchen Sie nach **"Google Sheets API"**
3. Klicken Sie auf **"Google Sheets API"** 
4. Klicken Sie auf **"Aktivieren"**

### 1.3 Service Account erstellen
1. **"APIs & Dienste"** → **"Anmeldedaten"**
2. **"Anmeldedaten erstellen"** → **"Service-Konto"**
3. **Name**: `cbd-sheets-reader`
4. **Beschreibung**: `Service Account für CBD App Google Sheets Zugriff`
5. Klicken Sie auf **"Erstellen und fortfahren"**
6. **Rolle**: `Betrachter` (oder keine Rolle)
7. Klicken Sie auf **"Weiter"** und **"Fertig"**

### 1.4 Service Account Schlüssel herunterladen
1. Klicken Sie auf das erstellte Service-Konto
2. **"Schlüssel"**-Tab → **"Schlüssel hinzufügen"** → **"Neuen Schlüssel erstellen"**
3. **Typ**: `JSON`
4. Klicken Sie auf **"Erstellen"**
5. **💾 JSON-Datei wird heruntergeladen** → Speichern Sie sie als `sheets-key.json`

---

## 📋 Schritt 2: Google Sheets vorbereiten

### 2.1 Google Sheets Dokument erstellen
1. Gehen Sie zu [Google Sheets](https://sheets.google.com)
2. Erstellen Sie ein neues Dokument
3. Benennen Sie es: **"CBD Produkte"**

### 2.2 Tabellenstruktur einrichten
```
    A              B              C
1   Produktname    Preis          Lagerbestand
2   Candy Flip     25.90          50
3   Super Silver   22.50          30
4   Harlequin      28.00          25
5   ...
```

**Wichtig**: 
- **Spalte A**: Produktnamen (diese werden geladen)
- **Zeile 1**: Überschriften (werden übersprungen)
- **Ab Zeile 2**: Ihre Produktdaten

### 2.3 Service Account Berechtigung erteilen
1. Kopieren Sie die **E-Mail-Adresse** Ihres Service Accounts
   - Format: `cbd-sheets-reader@ihr-projekt-123456.iam.gserviceaccount.com`
2. In Ihrem Google Sheets → **"Teilen"**-Button (oben rechts)
3. Fügen Sie die Service Account E-Mail hinzu
4. **Berechtigung**: `Betrachter` (oder `Bearbeiter` falls Sie später auch schreiben möchten)
5. **"Senden"** klicken

### 2.4 Sheet ID extrahieren
Aus der URL: `https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKl_MnOpQrStUvWxYz123/edit`

Die **Sheet ID** ist: `1AbCdEfGhIjKl_MnOpQrStUvWxYz123`

---

## 📋 Schritt 3: App-Konfiguration

### 3.1 Dependencies installieren
```bash
npm install cors dotenv google-auth-library googleapis
```

### 3.2 Verzeichnisstruktur erstellen
```bash
mkdir cred
```

### 3.3 Service Account Schlüssel platzieren
1. Kopieren Sie die heruntergeladene `sheets-key.json` nach `cred/sheets-key.json`
2. Prüfen Sie den Pfad:
```
CBD-Warenbestand/
├── cred/
│   └── sheets-key.json    ← Hier
├── lib/
│   └── sheets.js
└── ...
```

### 3.4 .env Datei erstellen
1. Kopieren Sie `config.env.example` zu `.env`
2. Passen Sie die Werte an:

```env
# Google Sheets Integration
GOOGLE_APPLICATION_CREDENTIALS=./cred/sheets-key.json
SHEET_ID=1AbCdEfGhIjKl_MnOpQrStUvWxYz123
RANGE=A2:A
CACHE_MS=300000

# Bestehende Konfiguration...
SECRET_TOKEN=420
SESSION_SECRET=cbd-warenbestand-secret-key-2024
N8N_TEST_URL=https://paxpilatus.app.n8n.cloud/webhook-test/...
```

**Parameter-Erklärung**:
- `SHEET_ID`: Ihre Google Sheets Dokument-ID
- `RANGE`: `A2:A` = Spalte A ab Zeile 2 (überspringt Überschrift)
- `CACHE_MS`: `300000` = 5 Minuten Cache-Zeit

### 3.5 Erweiterte Range-Optionen
```env
# Nur Spalte A (Produktnamen)
RANGE=A2:A

# Mit Tabellenblatt-Name
RANGE=Produkte!A2:A

# Mehrere Spalten (falls Sie später erweitern)
RANGE=A2:C        # Spalten A, B, C

# Spezifische Zeilen
RANGE=A2:A50      # Zeilen 2-50
```

---

## 📋 Schritt 4: Testen & Troubleshooting

### 4.1 App starten
```bash
npm start
```

### 4.2 Google Sheets Test (Development)
```bash
# Nur im Development verfügbar
curl http://localhost:3000/api/test-sheets
```

**Erwartete Antwort**:
```json
{
  "success": true,
  "connected": true,
  "config": {
    "hasCredentials": true,
    "hasSheetId": true,
    "hasRange": true,
    "range": "A2:A",
    "cacheMs": "300000"
  }
}
```

### 4.3 Produkte laden testen
1. Öffnen Sie die Kaufen-Seite
2. Klicken Sie **"📊 Aktuelle Produkte laden"**
3. **Erwartetes Verhalten**:
   - Button zeigt "Lade..."
   - Produktliste wird aktualisiert
   - Erfolgsmeldung: "✅ X Produkte aus Google Sheets geladen"

### 4.4 Häufige Probleme

#### Problem: "Google Sheets Modul nicht verfügbar"
```bash
# Lösung: Dependencies installieren
npm install google-auth-library googleapis
```

#### Problem: "Keine Berechtigung für Google Sheets"
- ✅ Service Account E-Mail in Google Sheets geteilt?
- ✅ Mindestens "Betrachter"-Berechtigung vergeben?
- ✅ Service Account aktiv?

#### Problem: "Google Sheets Dokument nicht gefunden"
- ✅ `SHEET_ID` korrekt in `.env`?
- ✅ Google Sheets Dokument öffentlich oder geteilt?

#### Problem: "Ungültiger Bereich (RANGE)"
```env
# Korrekte Formate:
RANGE=A2:A          # Spalte A ab Zeile 2
RANGE=Produkte!A2:A # Mit Tabellenblatt-Name
RANGE=A:A           # Ganze Spalte A
```

#### Problem: "Authentifizierung fehlgeschlagen"
- ✅ `cred/sheets-key.json` vorhanden?
- ✅ `GOOGLE_APPLICATION_CREDENTIALS` Pfad korrekt?
- ✅ JSON-Datei nicht beschädigt?

---

## 🚀 Performance-Optimierung

### Cache-Einstellungen
```env
# Sehr schnell (1 Minute) - für häufige Änderungen
CACHE_MS=60000

# Standard (5 Minuten) - guter Kompromiss
CACHE_MS=300000

# Langsam (15 Minuten) - für seltene Änderungen
CACHE_MS=900000
```

### Stale-While-Revalidate Pattern
Die App verwendet automatisch:
- **Cache-Hit**: < 5ms Response-Zeit
- **Cache-Miss**: 80-200ms (Google API Aufruf)
- **Fehler-Fallback**: Alte Cache-Daten oder statische Liste

---

## 📊 Monitoring & Logs

### Console-Logs beobachten
```bash
# App starten und Logs verfolgen
npm start

# Relevante Log-Meldungen:
# ✅ "Google Sheets Modul erfolgreich geladen"
# 📊 "Lade Produkte aus Google Sheets..."
# ✅ "X Produkte erfolgreich geladen"
# ❌ "Google Sheets API Fehler:"
```

### API-Status prüfen
```javascript
// Im Browser-Console (F12):
fetch('/api/products')
  .then(r => r.json())
  .then(console.log);
```

---

## 🔄 Updates & Wartung

### Google Sheets Änderungen
- **Neue Produkte hinzufügen**: Einfach in Google Sheets eintragen
- **Cache-Refresh**: Automatisch nach 5 Minuten oder manuell via Button
- **Spalten erweitern**: `RANGE` in `.env` anpassen

### Service Account Management
- **Schlüssel rotieren**: Neuen JSON-Key erstellen, alten ersetzen
- **Berechtigungen prüfen**: Regelmäßig Service Account Zugriffe überprüfen

---

## ✅ Checkliste: Vollständige Einrichtung

- [ ] **Google Cloud Projekt** erstellt
- [ ] **Google Sheets API** aktiviert  
- [ ] **Service Account** erstellt
- [ ] **JSON-Schlüssel** heruntergeladen
- [ ] **Google Sheets Dokument** erstellt und strukturiert
- [ ] **Service Account Berechtigung** in Google Sheets erteilt
- [ ] **Dependencies** installiert (`npm install`)
- [ ] **cred/sheets-key.json** platziert
- [ ] **.env Datei** konfiguriert
- [ ] **App startet** ohne Fehler
- [ ] **"Aktuelle Produkte laden"** Button funktioniert
- [ ] **Produkte werden** korrekt angezeigt

---

**🎉 Integration erfolgreich eingerichtet!**

Ihr "Kaufen"-Button kann jetzt dynamisch die neuesten Produkte aus Google Sheets laden - genau wie in Ihrem ursprünglichen Plan beschrieben! 