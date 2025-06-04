const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguration
const SECRET_TOKEN = 'meinGeheimerToken123';
const SESSION_SECRET = 'cbd-warenbestand-secret-key-2024';
// n8n.cloud Test-URL für alle Webhook-POSTs
const N8N_TEST_URL = 'https://mundoschnauz420.app.n8n.cloud/webhook-test/ca7a41c7-56b3-4e63-9985-6b3e85b9a2f9';

// Im Speicher Order-Status speichern
const orderStatusMap = new Map();

console.log('🚀 CBD Warenbestand App wird gestartet...');
console.log(`📱 Server läuft auf Port: ${PORT}`);
console.log(`🔐 Login-Token: ${SECRET_TOKEN}`);
console.log(`🌐 n8n.cloud Test-URL: ${N8N_TEST_URL}`);

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session-Konfiguration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Auf true setzen für HTTPS in Produktion
    maxAge: 24 * 60 * 60 * 1000 // 24 Stunden
  }
}));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

// Multer für Datei-Upload konfigurieren
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB Limit
  }
});

// Middleware für Login-Überprüfung
function requireAuth(req, res, next) {
  console.log('🔍 Überprüfe Authentifizierung für Route:', req.path);
  
  if (req.session.authenticated) {
    console.log('✅ Benutzer ist authentifiziert');
    next();
  } else {
    console.log('❌ Benutzer nicht authentifiziert, Weiterleitung zu Login');
    res.redirect('/login');
  }
}

// Routen

// Startseite - Weiterleitung zu Login
app.get('/', (req, res) => {
  console.log('🏠 Startseite aufgerufen');
  
  if (req.session.authenticated) {
    console.log('✅ Benutzer bereits eingeloggt, Weiterleitung zur Auswahl');
    res.redirect('/dashboard');
  } else {
    console.log('🔐 Benutzer nicht eingeloggt, Weiterleitung zu Login');
    res.redirect('/login');
  }
});

// Login-Route
app.get('/login', (req, res) => {
  const token = req.query.token;
  
  console.log('🔐 Login-Versuch mit Token:', token ? 'Token vorhanden' : 'Kein Token');
  
  if (token === SECRET_TOKEN) {
    req.session.authenticated = true;
    console.log('✅ Login erfolgreich! Token korrekt:', token);
    console.log('🍪 Session erstellt, Weiterleitung zur Auswahl');
    res.redirect('/dashboard');
  } else if (token) {
    console.log('❌ Login fehlgeschlagen! Ungültiger Token:', token);
    res.render('login', { 
      error: 'Ungültiger Token!',
      title: 'Login Fehlgeschlagen'
    });
  } else {
    console.log('📝 Login-Seite angezeigt (kein Token)');
    res.render('login', { 
      error: null,
      title: 'Login'
    });
  }
});

// Dashboard - Auswahlseite nach Login
app.get('/dashboard', requireAuth, (req, res) => {
  console.log('📊 Dashboard aufgerufen - Benutzer authentifiziert');
  res.render('dashboard', { 
    title: 'CBD Warenbestand - Auswahl'
  });
});

// API-Endpoint für n8n (ohne Authentifizierung)
app.post('/api/buy', async (req, res) => {
  const { name, product, quantity, notes } = req.body;
  
  console.log('🤖 API-KAUF-AKTION VON N8N GESTARTET');
  console.log('📝 Empfangene req.body:', JSON.stringify(req.body, null, 2));
  console.log('📝 Empfangene Daten:');
  console.log(`   👤 Name: ${name}`);
  console.log(`   📦 Produkt: ${product}`);
  console.log(`   🔢 Stückzahl: ${quantity}`);
  console.log(`   📝 Notiz: ${notes || 'Keine Notiz'}`);
  
  // Validierung
  if (!name || !product || !quantity) {
    console.log('❌ API Validierungsfehler: Pflichtfelder fehlen');
    return res.status(400).json({ 
      success: false,
      error: 'Bitte füllen Sie alle Pflichtfelder aus (Name, Produkt, Stückzahl).'
    });
  }
  
  const orderId = uuidv4();
  
  try {
    // Daten für interne Verarbeitung vorbereiten
    const purchaseData = {
      action: 'kaufen',
      name: name,
      product: product,
      quantity: parseInt(quantity) || 0,
      notes: notes || null,
      timestamp: new Date().toISOString(),
      user_agent: req.get('User-Agent') || 'n8n API Client',
      orderId: orderId
    };
    
    console.log('💾 Verarbeite Kauf-Daten:');
    console.log('   📋 Payload:', JSON.stringify(purchaseData, null, 2));
    
    // Hier könntest du die Daten in einer Datenbank speichern
    // Für jetzt geben wir eine Erfolgsmeldung zurück
    
    console.log('✅ API-Kauf erfolgreich verarbeitet');
    
    // Erfolgsmeldung zurückgeben (ähnlich wie n8n es erwartet)
    res.json({ 
      success: true, 
      message: 'Erfolgreich gespeichert!',
      data: {
        Name: name,
        Produkt: product,
        Stückzahl: parseInt(quantity),
        Datum: new Date().toISOString(),
        Lagerbestand: Math.max(0, 100 - parseInt(quantity)) // Beispiel-Berechnung
      },
      orderId: orderId
    });
    
  } catch (error) {
    console.error('❌ FEHLER beim API-Kauf:');
    console.error(`   🚨 Error: ${error.message}`);
    
    res.status(500).json({ 
      success: false,
      error: 'Es gab einen Fehler beim Verarbeiten des Kaufs. Bitte versuchen Sie es erneut.'
    });
  }
});

// Kaufen-Route
app.get('/buy', requireAuth, (req, res) => {
  console.log('🛒 Kaufen-Seite aufgerufen');
  
  // Vordefinierte Optionen für das Formular
  const nameOptions = ['Manuel', 'Sarah', 'Thomas', 'Lisa', 'Michael'];
  const productOptions = [
    'CBD Öl 10%',
    'CBD Öl 20%',
    'CBD Kapseln',
    'CBD Blüten',
    'CBD Creme',
    'CBD Tee'
  ];
  
  res.render('buy', { 
    title: 'Produkt Kaufen',
    nameOptions,
    productOptions
  });
});

// Kaufen-Verarbeitung
app.post('/buy', requireAuth, async (req, res) => {
  const { name, product, quantity, notes } = req.body;
  
  console.log('🛒 KAUF-AKTION GESTARTET');
  console.log('📝 Empfangene req.body:', JSON.stringify(req.body, null, 2));
  console.log('📝 Empfangene Daten:');
  console.log(`   👤 Name: ${name}`);
  console.log(`   📦 Produkt: ${product}`);
  console.log(`   🔢 Stückzahl: ${quantity}`);
  console.log(`   📝 Notiz: ${notes || 'Keine Notiz'}`);
  
  // Validierung
  if (!name || !product || !quantity) {
    console.log('❌ Validierungsfehler: Pflichtfelder fehlen');
    return res.status(400).json({ 
      success: false,
      error: 'Bitte füllen Sie alle Pflichtfelder aus (Name, Produkt, Stückzahl).'
    });
  }
  
  const orderId = uuidv4();
  
  try {
    // Daten für n8n vorbereiten
    const purchaseData = {
      action: 'kaufen',
      name: name,
      product: product,
      quantity: parseInt(quantity) || 0,
      notes: notes || null,
      timestamp: new Date().toISOString(),
      user_agent: req.get('User-Agent'),
      orderId: orderId
    };
    
    console.log('📤 Sende Daten an n8n Webhook:');
    console.log(`   🌐 URL: ${N8N_TEST_URL}`);
    console.log('   📋 Payload:', JSON.stringify(purchaseData, null, 2));
    
    // POST Request an n8n
    const response = await axios.post(
      N8N_TEST_URL,
      purchaseData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 Sekunden Timeout
      }
    );
    
    console.log('✅ n8n Webhook erfolgreich aufgerufen');
    console.log(`   📊 Status: ${response.status}`);
    console.log(`   📝 Response: ${JSON.stringify(response.data)}`);
    
    // Erfolgsmeldung mit n8n-Daten zurückgeben
    res.json({ 
      success: true, 
      message: 'Erfolgreich gespeichert!',
      n8nResponse: response.data,
      orderDetails: {
        name: name,
        product: product,
        quantity: quantity,
        notes: notes
      }
    });
    
  } catch (error) {
    console.error('❌ FEHLER beim Senden an n8n:');
    console.error(`   🚨 Error: ${error.message}`);
    console.error(`   📊 Status: ${error.response?.status || 'Keine Response'}`);
    console.error(`   📝 Data: ${error.response?.data || 'Keine Daten'}`);
    
    res.status(500).json({ 
      success: false,
      error: 'Es gab einen Fehler beim Verarbeiten des Kaufs. Bitte versuchen Sie es erneut.'
    });
  }
});

// n8n Callback Endpoint
app.post('/n8n-callback', (req, res) => {
  const { orderId, data } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId fehlt' });
  orderStatusMap.set(orderId, { status: 'done', data });
  res.json({ success: true });
});

// Polling-Endpoint für den Status
app.get('/order-status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const status = orderStatusMap.get(orderId) || { status: 'waiting' };
  res.json(status);
});

// Warte-Seite für n8n Antwort
app.get('/wait-for-n8n', requireAuth, (req, res) => {
  const { orderId } = req.query;
  if (!orderId) {
    return res.status(400).render('error', {
      title: 'Fehler',
      message: 'Keine Order-ID gefunden.',
      backUrl: '/buy'
    });
  }
  res.render('wait-for-n8n', { orderId });
});

// Auffüllen-Route
app.get('/restock', requireAuth, (req, res) => {
  console.log('📦 Auffüllen-Seite aufgerufen');
  res.render('restock', { 
    title: 'Warenbestand Auffüllen'
  });
});

// Auffüllen-Verarbeitung
app.post('/restock', requireAuth, upload.single('photo'), async (req, res) => {
  console.log('📦 AUFFÜLLEN-AKTION GESTARTET');
  
  const uploadedFile = req.file;
  
  if (!uploadedFile) {
    console.log('❌ Keine Datei hochgeladen');
    return res.status(400).json({ 
      success: false,
      error: 'Bitte wählen Sie eine Datei zum Hochladen aus.'
    });
  }
  
  // Dateiname immer auf "rechnung" setzen (mit passender Endung)
  const ext = uploadedFile.originalname.split('.').pop();
  const rechnungFilename = `rechnung.${ext}`;

  console.log('📁 Datei-Upload Details:');
  console.log(`   📄 Dateiname: ${rechnungFilename}`);
  console.log(`   📏 Dateigröße: ${uploadedFile.size} Bytes`);
  console.log(`   🎭 MIME-Type: ${uploadedFile.mimetype}`);
  console.log(`   💾 Buffer-Größe: ${uploadedFile.buffer.length} Bytes`);
  
  try {
    // FormData für Datei-Upload erstellen
    const FormData = require('form-data');
    const formData = new FormData();
    
    formData.append('photo', uploadedFile.buffer, {
      filename: rechnungFilename,
      contentType: uploadedFile.mimetype
    });
    
    formData.append('action', 'auffuellen');
    formData.append('timestamp', new Date().toISOString());
    formData.append('filename', rechnungFilename);
    formData.append('filesize', uploadedFile.size.toString());
    
    console.log('📤 Sende Datei an n8n Webhook:');
    console.log(`   🌐 URL: ${N8N_TEST_URL}`);
    console.log(`   📁 Datei: ${rechnungFilename} (${uploadedFile.size} Bytes)`);
    
    // POST Request an n8n mit Datei
    const response = await axios.post(
      N8N_TEST_URL,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 30000, // 30 Sekunden für Datei-Upload
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    
    console.log('✅ n8n Webhook erfolgreich aufgerufen');
    console.log(`   📊 Status: ${response.status}`);
    console.log(`   📝 Response: ${JSON.stringify(response.data)}`);
    
    // JSON-Response für das Frontend zurückgeben
    res.json({ 
      success: true, 
      message: 'Auffüllen erfolgreich! Foto wurde hochgeladen und verarbeitet.',
      n8nResponse: response.data,
      uploadDetails: {
        filename: rechnungFilename,
        filesize: uploadedFile.size,
        mimetype: uploadedFile.mimetype
      }
    });
    
  } catch (error) {
    console.error('❌ FEHLER beim Senden an n8n:');
    console.error(`   🚨 Error: ${error.message}`);
    console.error(`   📊 Status: ${error.response?.status || 'Keine Response'}`);
    console.error(`   📝 Data: ${error.response?.data || 'Keine Daten'}`);
    
    res.status(500).json({ 
      success: false,
      error: 'Es gab einen Fehler beim Hochladen der Datei. Bitte versuchen Sie es erneut.'
    });
  }
});

// Logout-Route
app.get('/logout', (req, res) => {
  console.log('🚪 Logout durchgeführt');
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Fehler beim Logout:', err);
    }
    res.redirect('/login');
  });
});

// 404 Handler
app.use((req, res) => {
  console.log('❓ 404 - Seite nicht gefunden:', req.path);
  res.status(404).render('error', { 
    title: '404 - Seite nicht gefunden',
    message: 'Die angeforderte Seite wurde nicht gefunden.',
    backUrl: '/'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Unerwarteter Fehler:', err);
  res.status(500).render('error', { 
    title: 'Server Fehler',
    message: 'Es ist ein unerwarteter Fehler aufgetreten.',
    backUrl: '/'
  });
});

// Server starten
app.listen(PORT, () => {
  console.log('🎉 CBD Warenbestand App erfolgreich gestartet!');
  console.log(`🌐 Server läuft auf: http://localhost:${PORT}`);
  console.log(`🔗 Login-URL: http://localhost:${PORT}/login?token=${SECRET_TOKEN}`);
  console.log('📱 App ist bereit für mobile Nutzung!');
  
  // ========================================
  // PROTOTYPING: Auto-Browser-Öffnung (nur lokal)
  // ========================================
  if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
    try {
      const open = require('open');
      const loginUrl = `http://localhost:${PORT}/login?token=${SECRET_TOKEN}`;
      
      console.log('🚀 PROTOTYPING-MODUS: Öffne Browser automatisch...');
      
      // Kurze Verzögerung, damit der Server vollständig gestartet ist
      setTimeout(() => {
        open(loginUrl).then(() => {
          console.log('✅ Browser geöffnet mit Login-URL');
        }).catch((err) => {
          console.log('⚠️  Browser konnte nicht automatisch geöffnet werden:', err.message);
          console.log('💡 Öffnen Sie manuell:', loginUrl);
        });
      }, 1000);
    } catch (err) {
      console.log('⚠️  Open-Paket nicht verfügbar (Normal für Cloud-Hosting)');
    }
  }
  // ========================================
  // ENDE PROTOTYPING-BLOCK
  // ========================================
}); 