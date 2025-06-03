// Translations object
const translations = {
    en: {
        // Hero Section
        heroTitle: "Real Events. Real People.<br>Right Here.",
        heroSubtitle: "Every event is a chance to meet someone special. App4it helps you turn those in-person connections into lasting friendships through shared experiences.",
        requestAccess: "Request Early Access",
        submit: "SUBMIT",
        
        // Values Section
        ourValues: "Our Values",
        authenticity: "Authenticity First",
        authenticityDesc: "Genuine connections over perfect profiles. Be yourself, meet others who do the same.",
        community: "Community Driven",
        communityDesc: "Join a vibrant community of people who believe in the power of real-world connections.",
        spontaneous: "Spontaneous Joy",
        spontaneousDesc: "Discover unexpected moments and create memories that last a lifetime.",
        realConnections: "Real Connections",
        realConnectionsDesc: "Connect only with people you've met in person through our unique QR code system.",
        
        // Features Section
        ourFeatures: "Our Features",
        discoverEvents: "Discover & Create Events",
        discoverEventsDesc: "Find exciting local events or create your own gatherings. From parties to book clubs, there's something for everyone.",
        authenticConnections: "Authentic Connections",
        authenticConnectionsDesc: "Connect with new friends by scanning their QR code in person - ensuring all connections are true and meaningful.",
        shareMemories: "Share Memories",
        shareMemoriesDesc: "Capture and share moments from events, creating lasting memories with your new friends.",
        stayConnected: "Stay Connected",
        stayConnectedDesc: "Chat with your connections, comment on memories, and plan future meetups together.",
        
        // Experience Section
        experienceTitle: "Experience Real Connections",
        
        // Privacy and Form
        viewPrivacy: "View Privacy Details",
        privacyText: "We use Brevo as our marketing platform. By submitting this form you agree that the personal data you provided will be transferred to Brevo for processing in accordance with",
        privacyPolicy: "Brevo's Privacy Policy",
        agreeText: "I agree to receive news and updates provided by App4it and accept the data privacy statement.",
        unsubscribeText: "You may unsubscribe at any time using the link in our e-mail updates.",
        acceptPrivacy: "Please accept the privacy policy to continue.",
        
        // Footer
        copyright: "© 2025 App4it GmbH. All rights reserved.",
        
        // Success Page
        successTitle: "Woohoo! You're in! 🎉",
        successSubtitle: "High five! ✋ You're officially on the waitlist for the coolest way to meet new friends. Get ready for adventures that are way better than scrolling! Are you App4it?",
        backToHome: "Back to homepage"
    },
    de: {
        // Hero Section
        heroTitle: "Echte Events. Echte Menschen.<br>Genau Hier.",
        heroSubtitle: "Jedes Event ist eine Chance, jemand Besonderes kennenzulernen. App4it hilft dir, diese persönlichen Begegnungen durch gemeinsame Erlebnisse in dauerhafte Freundschaften zu verwandeln.",
        requestAccess: "Frühen Zugang Anfragen",
        submit: "ABSENDEN",
        
        // Values Section
        ourValues: "Unsere Werte",
        authenticity: "Authentizität Zuerst",
        authenticityDesc: "Echte Verbindungen statt perfekter Profile. Sei du selbst und triff andere, die das auch sind.",
        community: "Gemeinschaft im Fokus",
        communityDesc: "Werde Teil einer lebendigen Community, die an die Kraft echter Begegnungen glaubt.",
        spontaneous: "Spontane Freude",
        spontaneousDesc: "Entdecke unerwartete Momente und schaffe Erinnerungen, die ein Leben lang halten.",
        realConnections: "Echte Verbindungen",
        realConnectionsDesc: "Verbinde dich nur mit Menschen, die du persönlich durch unser einzigartiges QR-Code-System getroffen hast.",
        
        // Features Section
        ourFeatures: "Unsere Features",
        discoverEvents: "Entdecke & Erstelle Events",
        discoverEventsDesc: "Finde spannende lokale Events oder erstelle deine eigenen Treffen. Von Partys bis zu Buchclubs ist für jeden etwas dabei.",
        authenticConnections: "Authentische Verbindungen",
        authenticConnectionsDesc: "Verbinde dich mit neuen Freunden durch Scannen ihres QR-Codes vor Ort - so sind alle Verbindungen echt und bedeutungsvoll.",
        shareMemories: "Teile Erinnerungen",
        shareMemoriesDesc: "Halte Momente von Events fest und teile sie mit deinen neuen Freunden.",
        stayConnected: "Bleib in Verbindung",
        stayConnectedDesc: "Chatte mit deinen Kontakten, kommentiere Erinnerungen und plane zukünftige Treffen.",
        
        // Experience Section
        experienceTitle: "Erlebe Echte Verbindungen",
        
        // Privacy and Form
        viewPrivacy: "Datenschutzdetails Anzeigen",
        privacyText: "Wir nutzen Brevo als unsere Marketing-Plattform. Durch das Absenden dieses Formulars erklären Sie sich damit einverstanden, dass die von Ihnen angegebenen personenbezogenen Daten zur Verarbeitung an Brevo übermittelt werden gemäß",
        privacyPolicy: "Brevo's Datenschutzerklärung",
        agreeText: "Ich stimme zu, Neuigkeiten und Updates von App4it zu erhalten und akzeptiere die Datenschutzerklärung.",
        unsubscribeText: "Sie können sich jederzeit über den Link in unseren E-Mail-Updates abmelden.",
        acceptPrivacy: "Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.",
        
        // Footer
        copyright: "© 2025 App4it GmbH. Alle Rechte vorbehalten.",
        
        // Success Page
        successTitle: "Juhu! Du bist dabei! 🎉",
        successSubtitle: "High five! ✋ Du bist jetzt offiziell auf der Warteliste für die coolste Art, neue Freunde zu finden. Mach dich bereit für Abenteuer, die viel besser sind als Scrollen! Bist du App4it?",
        backToHome: "Zurück zur Startseite"
    }
};

// Function to detect browser language
function detectBrowserLanguage() {
    const browserLang = navigator.language.toLowerCase().split('-')[0];
    return browserLang === 'de' ? 'de' : 'en';
}

// Function to set the page language
function setPageLanguage(lang) {
    // Store the selected language
    localStorage.setItem('preferredLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update button text
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.textContent = lang === 'en' ? 'DE' : 'EN';
    }
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[lang][key];
            } else if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translations[lang][key];
            } else {
                // Special handling for privacy text that needs concatenation
                if (key === 'privacyText') {
                    const privacyLink = element.nextElementSibling;
                    if (privacyLink && privacyLink.hasAttribute('data-i18n')) {
                        element.innerHTML = translations[lang][key];
                        privacyLink.innerHTML = translations[lang][privacyLink.getAttribute('data-i18n')];
                    }
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        }
    });
}

// Initialize language settings
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored language preference
    const storedLang = localStorage.getItem('preferredLanguage');
    const initialLang = storedLang || detectBrowserLanguage();
    
    // Set initial language
    setPageLanguage(initialLang);
    
    // Add click handler to language toggle
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'en' ? 'de' : 'en';
            setPageLanguage(newLang);
        });
    }
}); 