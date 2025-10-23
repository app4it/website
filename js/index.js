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
});
