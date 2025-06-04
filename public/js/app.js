// CBD Warenbestand App - Client-Side JavaScript

console.log('🌿 CBD Warenbestand App geladen');

// Global App Configuration
const CBDApp = {
    version: '1.0.0',
    debug: true,
    
    // Utility Functions
    log: function(message, type = 'info') {
        if (this.debug) {
            const timestamp = new Date().toLocaleTimeString();
            const emoji = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
            console.log(`${emoji} [${timestamp}] ${message}`);
        }
    },
    
    // Show loading state
    showLoading: function(element, text = 'Lädt...') {
        if (element) {
            element.disabled = true;
            element.innerHTML = `<span class="loading"></span> ${text}`;
        }
    },
    
    // Hide loading state
    hideLoading: function(element, originalText) {
        if (element) {
            element.disabled = false;
            element.innerHTML = originalText;
        }
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '90%';
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        this.log(`Notification: ${message}`, type);
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Validate form
    validateForm: function(formElement) {
        const requiredFields = formElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#f56565';
                isValid = false;
            } else {
                field.style.borderColor = '#e2e8f0';
            }
        });
        
        return isValid;
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    CBDApp.log('DOM geladen, initialisiere App...');
    
    // Initialize app features
    initializeFormValidation();
    initializeButtonEffects();
    initializeNetworkStatus();
    initializePWAFeatures();
    
    CBDApp.log('App erfolgreich initialisiert');
});

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#f56565';
                } else {
                    this.style.borderColor = '#e2e8f0';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(245, 101, 101)') {
                    this.style.borderColor = '#e2e8f0';
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            if (!CBDApp.validateForm(this)) {
                e.preventDefault();
                CBDApp.showNotification('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
                return false;
            }
        });
    });
    
    CBDApp.log('Formular-Validierung initialisiert');
}

// Button Effects
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Click effect
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    CBDApp.log('Button-Effekte initialisiert');
}

// Network Status
function initializeNetworkStatus() {
    function updateNetworkStatus() {
        if (navigator.onLine) {
            CBDApp.log('Online-Status: Verbunden');
        } else {
            CBDApp.log('Online-Status: Offline', 'error');
            CBDApp.showNotification('Keine Internetverbindung', 'error');
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Initial check
    updateNetworkStatus();
    
    CBDApp.log('Netzwerk-Status-Überwachung initialisiert');
}

// PWA Features
function initializePWAFeatures() {
    // Service Worker registration (if available)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                CBDApp.log('Service Worker registriert');
            })
            .catch(error => {
                CBDApp.log('Service Worker Registrierung fehlgeschlagen', 'error');
            });
    }
    
    // Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installButton = document.createElement('button');
        installButton.className = 'btn btn-primary';
        installButton.innerHTML = '📱 App installieren';
        installButton.style.position = 'fixed';
        installButton.style.bottom = '20px';
        installButton.style.right = '20px';
        installButton.style.zIndex = '9999';
        
        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    CBDApp.log('PWA Installation akzeptiert');
                } else {
                    CBDApp.log('PWA Installation abgelehnt');
                }
                deferredPrompt = null;
                installButton.remove();
            });
        });
        
        document.body.appendChild(installButton);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.remove();
            }
        }, 10000);
    });
    
    CBDApp.log('PWA-Features initialisiert');
}

// File Upload Helpers
window.CBDFileUpload = {
    validateFile: function(file, maxSize = 10 * 1024 * 1024) {
        if (!file) {
            CBDApp.showNotification('Keine Datei ausgewählt', 'error');
            return false;
        }
        
        if (!file.type.startsWith('image/')) {
            CBDApp.showNotification('Bitte wählen Sie eine Bilddatei aus', 'error');
            return false;
        }
        
        if (file.size > maxSize) {
            CBDApp.showNotification(`Datei zu groß. Maximum: ${CBDApp.formatFileSize(maxSize)}`, 'error');
            return false;
        }
        
        CBDApp.log(`Datei validiert: ${file.name} (${CBDApp.formatFileSize(file.size)})`);
        return true;
    },
    
    previewImage: function(file, previewElement) {
        if (!file || !previewElement) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
        
        CBDApp.log(`Bild-Vorschau erstellt für: ${file.name}`);
    }
};

// Form Helpers
window.CBDForm = {
    showLoading: function(formElement) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        if (submitBtn) {
            CBDApp.showLoading(submitBtn, 'Wird verarbeitet...');
        }
    },
    
    hideLoading: function(formElement, originalText = 'Absenden') {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        if (submitBtn) {
            CBDApp.hideLoading(submitBtn, originalText);
        }
    },
    
    reset: function(formElement) {
        formElement.reset();
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e2e8f0';
        });
        CBDApp.log('Formular zurückgesetzt');
    }
};

// Global error handler
window.addEventListener('error', function(e) {
    CBDApp.log(`JavaScript Fehler: ${e.message}`, 'error');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    CBDApp.log(`Unbehandelte Promise-Ablehnung: ${e.reason}`, 'error');
});

// Export for global access
window.CBDApp = CBDApp; 