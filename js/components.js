// Reusable component templates

function createNavbar(activePage = '') {
    // Determine base path based on current location
    const isOnBlogDomain = window.location.hostname === 'blog.app4it.de';
    const homePath = isOnBlogDomain ? 'https://app4it.de/index.html' : 'index';
    const featuresPath = isOnBlogDomain ? 'https://app4it.de/features.html' : 'features';
    const aboutPath = isOnBlogDomain ? 'https://app4it.de/about-us.html' : 'about-us';
    const blogPath = isOnBlogDomain ? 'index.html' : 'https://blog.app4it.de/index.html';
    
    return `
    <div class="nav-container" role="navigation" aria-label="Primary">
      <a href="${homePath}" class="nav-link${activePage === 'home' ? ' active' : ''}" data-i18n="home"${activePage === 'home' ? ' aria-current="page"' : ''}>Home</a>
      <a href="${featuresPath}" class="nav-link${activePage === 'features' ? ' active' : ''}" data-i18n="features"${activePage === 'features' ? ' aria-current="page"' : ''}>Features</a>
      <a href="${aboutPath}" class="nav-link${activePage === 'about' ? ' active' : ''}" data-i18n="aboutUs"${activePage === 'about' ? ' aria-current="page"' : ''}>About Us</a>
      <a href="${blogPath}" class="nav-link${activePage === 'blog' ? ' active' : ''}" data-i18n="blog"${activePage === 'blog' ? ' aria-current="page"' : ''}>Blog</a>
    </div>
    `;
}

function createFooter() {
    return `
    <footer class="footer">
      <p>
        <span data-i18n="copyright">© 2025 App4it Project Team. All rights reserved.</span>
        <span class="footer-separator">|</span>
        <a href="impressum.html" class="footer-link" data-i18n="impressum">Impressum</a>
        <span class="footer-separator">|</span>
        <a href="https://x.com/AreYouApp4it" target="_blank" rel="noopener" class="footer-link" aria-label="Follow us on X">
          <i class="fab fa-x-twitter"></i>
          <span class="footer-text" data-i18n="connectWithUs">Connect with us!</span>
        </a>
      </p>
    </footer>
    `;
}

function createNavContainerMobile() {
    return `
    <div class="nav-container-mobile collapsible-container">
      <!-- Mobile Nav Trigger -->
      <button class="mobile-nav-trigger collapsible-trigger" aria-label="Open navigation" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-bars"></i>
      </button>
      
      <!-- Direct Dropdown (no popup) -->
      <div class="nav-mobile-dropdown" role="menu">
        <!-- Nav items will be populated dynamically -->
      </div>
    </div>
    `;
}

function createSettingsContainer() {
    return `
    <div class="settings-container collapsible-container">
      <!-- Desktop View -->
      <div class="toggle-container desktop-settings" role="group" aria-label="Settings">
        <button class="theme-toggle" aria-label="Toggle dark mode">
          <i class="fas fa-moon" aria-hidden="true"></i>
        </button>
        <div class="lang-toggle">
          <button class="lang-toggle-button" aria-label="Select language" aria-haspopup="true" aria-expanded="false">
            <span class="lang-current">
              <span class="fi fi-gb" id="current-flag"></span>
              <span id="current-lang">English</span>
            </span>
            <span class="lang-arrow">▼</span>
          </button>
          <div class="lang-dropdown" role="menu">
            <div class="lang-option" data-lang="en" role="menuitem">
              <span class="fi fi-gb"></span>
              <span>English</span>
            </div>
            <div class="lang-option" data-lang="de" role="menuitem">
              <span class="fi fi-de"></span>
              <span>Deutsch</span>
            </div>
            <div class="lang-option" data-lang="es" role="menuitem">
              <span class="fi fi-es"></span>
              <span>Español</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile View -->
      <button class="mobile-settings-trigger collapsible-trigger" aria-label="Open settings" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-cog"></i>
      </button>
    </div>
    
    <!-- Settings Popup (Mobile) -->
    <div class="settings-popup popup-overlay-container" role="dialog" aria-labelledby="settings-title" aria-modal="true">
      <div class="settings-popup-content popup-content">
        <h3 id="settings-title" class="settings-popup-title popup-title" data-i18n="settings">Settings</h3>
        
        <!-- Theme Toggle -->
        <div class="settings-section">
          <label class="settings-label" data-i18n="theme">Theme</label>
          <div class="theme-switch-container">
            <button class="theme-switch" role="switch" aria-checked="false" aria-label="Toggle theme">
              <span class="theme-switch-option theme-light" data-i18n="lightTheme">Light Theme</span>
              <span class="theme-switch-option theme-dark" data-i18n="darkTheme">Dark Theme</span>
              <span class="theme-switch-slider"></span>
            </button>
          </div>
        </div>
        
        <!-- Language Selector -->
        <div class="settings-section">
          <label class="settings-label" data-i18n="language">Language</label>
          <div class="lang-toggle mobile-lang-toggle">
            <button class="lang-toggle-button" aria-label="Select language" aria-haspopup="true" aria-expanded="false">
              <span class="lang-current">
                <span class="fi fi-gb" id="mobile-current-flag"></span>
                <span id="mobile-current-lang">English</span>
              </span>
              <span class="lang-arrow">▼</span>
            </button>
            <div class="lang-dropdown" role="menu">
              <div class="lang-option" data-lang="en" role="menuitem">
                <span class="fi fi-gb"></span>
                <span>English</span>
              </div>
              <div class="lang-option" data-lang="de" role="menuitem">
                <span class="fi fi-de"></span>
                <span>Deutsch</span>
              </div>
              <div class="lang-option" data-lang="es" role="menuitem">
                <span class="fi fi-es"></span>
                <span>Español</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-popup-overlay popup-overlay"></div>
    </div>
    `;
}

// Auto-inject components on page load
document.addEventListener('DOMContentLoaded', () => {
    // Inject navbar
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        const activePage = navPlaceholder.getAttribute('data-active') || '';
        navPlaceholder.outerHTML = createNavbar(activePage);
    }
    
    // Inject mobile nav container
    const navMobilePlaceholder = document.getElementById('nav-mobile-placeholder');
    if (navMobilePlaceholder) {
        const activePage = navMobilePlaceholder.getAttribute('data-active') || '';
        navMobilePlaceholder.outerHTML = createNavContainerMobile();
        
        // Populate nav dropdown after injection
        setTimeout(() => {
            populateNavDropdown(activePage);
        }, 0);
    }
    
    // Inject settings container
    const settingsPlaceholder = document.getElementById('settings-placeholder');
    if (settingsPlaceholder) {
        settingsPlaceholder.outerHTML = createSettingsContainer();
    }
    
    // Inject footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = createFooter();
    }
});

// Populate nav dropdown with links
function populateNavDropdown(activePage = '') {
    const isOnBlogDomain = window.location.hostname === 'blog.app4it.de';
    const navItems = [
        { key: 'home', path: isOnBlogDomain ? 'https://app4it.de/index.html' : 'index.html', label: 'Home' },
        { key: 'features', path: isOnBlogDomain ? 'https://app4it.de/features.html' : 'features.html', label: 'Features' },
        { key: 'about', path: isOnBlogDomain ? 'https://app4it.de/about-us.html' : 'about-us.html', label: 'About Us' },
        { key: 'blog', path: isOnBlogDomain ? 'index.html' : 'https://blog.app4it.de/index.html', label: 'Blog' }
    ];
    
    const dropdown = document.querySelector('.nav-mobile-dropdown');
    
    if (!dropdown) return;
    
    // Populate dropdown with nav items
    dropdown.innerHTML = navItems.map(item => `
        <a href="${item.path}" class="nav-mobile-item${item.key === activePage ? ' active' : ''}" data-i18n="${item.key}" role="menuitem"${item.key === activePage ? ' aria-current="page"' : ''}>
            ${item.label}
        </a>
    `).join('');
}
