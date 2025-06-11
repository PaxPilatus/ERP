const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

// Google Sheets API Authentifizierung
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

/**
 * Lädt Produktdaten aus Google Sheets
 * @returns {Promise<string[]>} Array mit Produktnamen
 */
async function fetchProducts() {
  try {
    console.log('📊 Lade Produkte aus Google Sheets...');
    
    // Authentifizierung
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    // Daten aus der Tabelle abrufen
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: process.env.RANGE || 'Produkte!A2:A', // Standard-Range
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