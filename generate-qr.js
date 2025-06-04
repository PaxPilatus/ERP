// QR-Code Generator für CBD Warenbestand App
// Dieses Script erstellt einen QR-Code für den Login-Link

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Konfiguration - ANPASSEN FÜR IHRE DEPLOYMENT-URL
const APP_URL = 'https://ihre-app.onrender.com'; // Ihre finale Render-URL hier eintragen
const SECRET_TOKEN = 'meinGeheimerToken123'; // Muss mit app.js übereinstimmen
const LOGIN_URL = `${APP_URL}/login?token=${SECRET_TOKEN}`;

console.log('🌿 CBD Warenbestand QR-Code Generator');
console.log('=====================================');
console.log(`🔗 Login-URL: ${LOGIN_URL}`);
console.log(`🔐 Token: ${SECRET_TOKEN}`);
console.log('');

// QR-Code Optionen
const qrOptions = {
  width: 400,
  margin: 3,
  color: {
    dark: '#667eea',  // App-Farbe
    light: '#ffffff'  // Weißer Hintergrund
  },
  errorCorrectionLevel: 'M'
};

// QR-Code als PNG-Datei erstellen
QRCode.toFile('qr-code-login.png', LOGIN_URL, qrOptions, function (err) {
  if (err) {
    console.error('❌ Fehler beim Erstellen des QR-Codes:', err);
    process.exit(1);
  }
  
  console.log('✅ QR-Code erfolgreich erstellt!');
  console.log('📁 Datei: qr-code-login.png');
  console.log('📏 Größe: 400x400 Pixel');
  console.log('');
  console.log('📱 Verwendung:');
  console.log('1. QR-Code ausdrucken oder auf Bildschirm anzeigen');
  console.log('2. Mit Smartphone-Kamera scannen');
  console.log('3. Automatische Weiterleitung zur App');
  console.log('4. Sofortiger Login ohne Token-Eingabe');
  console.log('');
  console.log('🎯 Der QR-Code ist bereit für den Einsatz!');
});

// Zusätzlich: QR-Code als SVG erstellen (vektorbasiert, skalierbar)
QRCode.toString(LOGIN_URL, {
  type: 'svg',
  width: 400,
  margin: 3,
  color: {
    dark: '#667eea',
    light: '#ffffff'
  }
}, function (err, svg) {
  if (err) {
    console.error('❌ Fehler beim Erstellen des SVG QR-Codes:', err);
    return;
  }
  
  // SVG in Datei speichern
  fs.writeFileSync('qr-code-login.svg', svg);
  console.log('✅ SVG QR-Code erstellt: qr-code-login.svg');
});

// QR-Code als Data URL für HTML/CSS (optional)
QRCode.toDataURL(LOGIN_URL, qrOptions, function (err, url) {
  if (err) {
    console.error('❌ Fehler beim Erstellen der Data URL:', err);
    return;
  }
  
  // HTML-Datei mit eingebettetem QR-Code erstellen
  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBD Warenbestand - QR-Code</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            color: #333;
            max-width: 500px;
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .qr-code {
            margin: 30px 0;
            border: 3px solid #667eea;
            border-radius: 15px;
            display: inline-block;
            padding: 10px;
            background: white;
        }
        .instructions {
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            text-align: left;
        }
        .instructions h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .instructions ol {
            margin: 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .url {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px;
            font-family: monospace;
            font-size: 0.9rem;
            word-break: break-all;
            margin: 15px 0;
        }
        @media print {
            body {
                background: white;
                color: black;
            }
            .container {
                box-shadow: none;
                border: 2px solid #667eea;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌿</div>
        <h1>CBD Warenbestand</h1>
        <p>Scannen Sie den QR-Code für den direkten Zugang</p>
        
        <div class="qr-code">
            <img src="${url}" alt="QR-Code für CBD Warenbestand Login" />
        </div>
        
        <div class="url">
            <strong>Login-URL:</strong><br>
            ${LOGIN_URL}
        </div>
        
        <div class="instructions">
            <h3>📱 Anleitung:</h3>
            <ol>
                <li>Öffnen Sie die Kamera-App auf Ihrem Smartphone</li>
                <li>Richten Sie die Kamera auf den QR-Code</li>
                <li>Tippen Sie auf die Benachrichtigung oder den Link</li>
                <li>Sie werden automatisch zur App weitergeleitet</li>
                <li>Der Login erfolgt automatisch</li>
            </ol>
        </div>
        
        <p style="margin-top: 30px; color: #718096; font-size: 0.9rem;">
            Erstellt am: ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE')}
        </p>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync('qr-code-login.html', htmlContent);
  console.log('✅ HTML-Seite erstellt: qr-code-login.html');
  console.log('🌐 Öffnen Sie die HTML-Datei im Browser zum Anzeigen/Drucken');
});

// Informationen ausgeben
console.log('');
console.log('📋 Erstellte Dateien:');
console.log('- qr-code-login.png (Bild für Druck/Digital)');
console.log('- qr-code-login.svg (Vektorgrafik, skalierbar)');
console.log('- qr-code-login.html (Webseite zum Anzeigen/Drucken)');
console.log('');
console.log('💡 Tipps:');
console.log('- PNG für Druck und digitale Verwendung');
console.log('- SVG für Websites und skalierbare Anwendungen');
console.log('- HTML für einfache Anzeige und Druck');
console.log('');
console.log('⚠️  Wichtig:');
console.log('- Passen Sie APP_URL an Ihre finale Render-URL an');
console.log('- Stellen Sie sicher, dass SECRET_TOKEN mit app.js übereinstimmt');
console.log('- Testen Sie den QR-Code nach dem Deployment');
console.log('');
console.log('🚀 Bereit für den Einsatz!'); 