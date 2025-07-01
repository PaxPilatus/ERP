const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

/**
 * Robuste Google Sheets API Authentifizierung (READ-ONLY)
 * Unterstützt Environment Variables für Render + Credentials-Datei für lokale Entwicklung
 */
function createAuth() {
  try {
    // Option 1: Umgebungsvariablen (für Cloud-Deployment wie Render)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      console.log('🔐 Verwende Umgebungsvariablen für Google Sheets Auth (READ-ONLY)');
      
      const credentials = {
        type: 'service_account',
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_id: process.env.GOOGLE_CLIENT_ID,
        project_id: process.env.GOOGLE_PROJECT_ID
      };
      
      return new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // ✅ READ-ONLY für Sicherheit
      });
    }
    
    // Option 2: Credentials-Datei (für lokale Entwicklung)
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './cred/sheets-key.json';
    const fullPath = path.resolve(credentialsPath);
    
    if (fs.existsSync(fullPath)) {
      console.log('🔐 Verwende Credentials-Datei für Google Sheets Auth (READ-ONLY):', credentialsPath);
      
      return new GoogleAuth({
        keyFile: fullPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // ✅ READ-ONLY für Sicherheit
      });
    }
    
    // Option 3: Fallback deaktiviert Google Sheets
    console.log('⚠️  Keine Google Sheets Credentials gefunden - deaktiviere Google Sheets');
    return null;
    
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Google Auth:', error);
    return null;
  }
}

const auth = createAuth();

/**
 * Lädt Produktdaten aus Google Sheets
 * @returns {Promise<string[]>} Array mit Produktnamen
 */
async function fetchProducts() {
  if (!auth) {
    console.log('⚠️  Google Sheets deaktiviert - verwende Fallback');
    throw new Error('Google Sheets nicht verfügbar');
  }

  try {
    console.log('📊 Lade Produkte aus Google Sheets...');
    
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    // Daten aus der Tabelle abrufen
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: process.env.PRODUCTS_RANGE || process.env.RANGE || 'Produkte!A2:A', // Flexibler Range Support
    });
    
    console.log('📋 Rohdaten von Google Sheets:', data.values);
    
    // Daten bereinigen und filtern
    const products = (data.values ?? [])
      .flat() // Verschachtelte Arrays flach machen
      .filter(Boolean) // Leere Werte entfernen
      .filter(product => typeof product === 'string' && product.trim()) // Nur strings mit Inhalt
      .map(product => product.trim()); // Whitespace entfernen
    
    console.log(`✅ ${products.length} Produkte erfolgreich geladen:`, products);
    
    return products;
    
  } catch (error) {
    console.error('❌ Google Sheets API Fehler:', error);
    
    // Detaillierte Fehlerbehandlung
    if (error.code === 404) {
      throw new Error('Google Sheets Dokument nicht gefunden. Prüfen Sie die SHEET_ID.');
    } else if (error.code === 403) {
      throw new Error('Keine Berechtigung für Google Sheets. Prüfen Sie die Service Account Berechtigung.');
    } else if (error.code === 400) {
      throw new Error('Ungültiger Bereich (RANGE). Prüfen Sie die RANGE-Einstellung.');
    } else if (error.message.includes('Could not load the default credentials')) {
      throw new Error('Google Sheets Authentifizierung fehlgeschlagen. Prüfen Sie die Credentials-Konfiguration.');
    } else {
      throw new Error(`Google Sheets Fehler: ${error.message}`);
    }
  }
}

/**
 * Test-Funktion für die Google Sheets Verbindung
 * @returns {Promise<boolean>} true wenn Verbindung erfolgreich
 */
async function testConnection() {
  try {
    await fetchProducts();
    return true;
  } catch (error) {
    console.error('❌ Google Sheets Verbindungstest fehlgeschlagen:', error.message);
    return false;
  }
}

module.exports = {
  fetchProducts,
  testConnection
};
