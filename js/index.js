// index.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Function to update favicons based on theme
    function updateFavicons(theme) {
        const faviconSelectors = [
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="mask-icon"]'
        ];
        
        faviconSelectors.forEach(selector => {
            const favicon = document.querySelector(selector);
            if (favicon) {
                const path = window.location.pathname.includes('/success/') ? '../' : './';
                favicon.href = `${path}assets/icons/favicon_${theme}.png`;
            }
        });
    }

    // Function to update theme
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        updateFavicons(theme);
        localStorage.setItem('theme', theme);
    }

    // Check for system theme preference
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Set initial theme
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);

    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Mobile nav dropdown functionality
    const mobileNavTrigger = document.querySelector('.mobile-nav-trigger');
    const navContainerMobile = document.querySelector('.nav-container-mobile');

    // Toggle mobile nav dropdown
    if (mobileNavTrigger && navContainerMobile) {
        mobileNavTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navContainerMobile.classList.contains('open');
            navContainerMobile.classList.toggle('open');
            mobileNavTrigger.setAttribute('aria-expanded', !isOpen);
        });
    }

    // Close nav dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (navContainerMobile && !navContainerMobile.contains(e.target)) {
            navContainerMobile.classList.remove('open');
            if (mobileNavTrigger) {
                mobileNavTrigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Mobile settings popup functionality
    const mobileSettingsTrigger = document.querySelector('.mobile-settings-trigger');
    const settingsPopup = document.querySelector('.settings-popup');
    const settingsOverlay = document.querySelector('.settings-popup-overlay');
    const themeSwitch = document.querySelector('.theme-switch');

    // Function to update theme switch state
    function updateThemeSwitch(theme) {
        if (themeSwitch) {
            themeSwitch.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
        }
    }

    // Initialize theme switch state
    updateThemeSwitch(initialTheme);

    // Open mobile settings popup
    if (mobileSettingsTrigger) {
        mobileSettingsTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPopup.classList.add('active');
            mobileSettingsTrigger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close popup when clicking overlay
    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', () => {
            settingsPopup.classList.remove('active');
            mobileSettingsTrigger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    }

    // Theme switch toggle
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            updateThemeSwitch(newTheme);
        });
    }

    // Close dropdowns and popups on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close nav dropdown
            if (navContainerMobile && navContainerMobile.classList.contains('open')) {
                navContainerMobile.classList.remove('open');
                if (mobileNavTrigger) {
                    mobileNavTrigger.setAttribute('aria-expanded', 'false');
                }
            }
            // Close settings popup
            if (settingsPopup && settingsPopup.classList.contains('active')) {
                settingsPopup.classList.remove('active');
                if (mobileSettingsTrigger) {
                    mobileSettingsTrigger.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            }
        }
    });

    // Initialize animation observers
    const animateElements = document.querySelectorAll('.animate-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Form validation and submission
    window.validateForm = function() {
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailInput.classList.add('error');
            alert('Please enter a valid email address');
            return false;
        }

        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        
        // Clear form
        emailInput.value = '';
        emailInput.classList.remove('error');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        return true;
    };

    // Lazy load images
    const lazyImages = document.querySelectorAll('.event-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // This will trigger the actual image load
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Countdown functionality
    const countdownRoot = document.getElementById('beta-countdown');
    if (countdownRoot) {
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');

        const releaseUtc = countdownRoot.getAttribute('data-release-utc');
        const releaseTimeMs = releaseUtc ? Date.parse(releaseUtc) : NaN;

        const pad2 = (n) => String(Math.max(0, n)).padStart(2, '0');

        const render = (days, hours, minutes, seconds) => {
            if (daysEl) daysEl.textContent = String(days);
            if (hoursEl) hoursEl.textContent = pad2(hours);
            if (minutesEl) minutesEl.textContent = pad2(minutes);
            if (secondsEl) secondsEl.textContent = pad2(seconds);
        };

        const tick = () => {
            if (!Number.isFinite(releaseTimeMs)) return;

            const nowMs = Date.now();
            const diffMs = releaseTimeMs - nowMs;

            if (diffMs <= 0) {
                render(0, 0, 0, 0);
                countdownRoot.setAttribute('data-released', 'true');
                return;
            }

            const totalSeconds = Math.floor(diffMs / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            render(days, hours, minutes, seconds);
        };

        tick();
        setInterval(tick, 1000);
    }

    // Scroll-to-top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        const toggleScrollTop = () => {
            const y = window.scrollY || document.documentElement.scrollTop || 0;
            if (y > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', toggleScrollTop, { passive: true });
        toggleScrollTop();

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
