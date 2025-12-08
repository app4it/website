// Features page specific JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const themeSwitch = document.querySelector('.theme-switch');
    
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
                favicon.href = `./assets/icons/favicon_${theme}.png`;
            }
        });
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // Function to update theme switch state
    function updateThemeSwitch(theme) {
        if (themeSwitch) {
            themeSwitch.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
        }
    }

    // Function to update theme
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        updateFavicons(theme);
        updateThemeSwitch(theme);
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

    // Desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // Theme switch toggle
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
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

    // Toggle settings popup
    if (mobileSettingsTrigger && settingsPopup) {
        mobileSettingsTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = settingsPopup.classList.contains('active');
            settingsPopup.classList.toggle('active');
            mobileSettingsTrigger.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when popup is open
            if (!isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close popup when clicking overlay
    if (settingsPopup) {
        const overlay = settingsPopup.querySelector('.settings-popup-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                settingsPopup.classList.remove('active');
                if (mobileSettingsTrigger) {
                    mobileSettingsTrigger.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            });
        }
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

    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    
    if (track && slides.length && nextButton && prevButton) {
        let currentIndex = 0;
        const slideWidth = 100; // percentage
        const totalSlides = slides.length;
        
        // Determine how many slides to show at once based on screen width
        function getSlidesPerView() {
            return window.innerWidth >= 992 ? 2 : 1;
        }
        
        let slidesPerView = getSlidesPerView();
        
        // Update slidesPerView on window resize
        window.addEventListener('resize', () => {
            slidesPerView = getSlidesPerView();
            updateCarousel();
        });
        
        // Set initial position
        updateCarousel();
        
        // Next slide
        nextButton.addEventListener('click', () => {
            if (currentIndex < totalSlides - slidesPerView) {
                currentIndex++;
                updateCarousel();
            } else {
                // Loop back to the beginning with animation
                animateCarouselReset('next');
            }
        });
        
        // Previous slide
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            } else {
                // Loop to the end with animation
                animateCarouselReset('prev');
            }
        });
        
        // Update carousel position
        function updateCarousel() {
            const offset = -currentIndex * (slideWidth / slidesPerView);
            track.style.transform = `translateX(${offset}%)`;
        }
        
        // Animate carousel reset when reaching the end/beginning
        function animateCarouselReset(direction) {
            // First, determine the positions
            const startPos = direction === 'next' ? 
                -(totalSlides - slidesPerView) * (slideWidth / slidesPerView) : 
                0;
            const endPos = direction === 'next' ? 
                0 : 
                -(totalSlides - slidesPerView) * (slideWidth / slidesPerView);
            
            // Use a smoother transition
            track.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
            
            if (direction === 'next') {
            // Going from last to first
            currentIndex = 0;
            } else {
            // Going from first to last
            currentIndex = totalSlides - slidesPerView;
            }
            
            // Apply the new position directly
            updateCarousel();
        }
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left, go to next slide
                nextButton.click();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right, go to previous slide
                prevButton.click();
            }
        }
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
