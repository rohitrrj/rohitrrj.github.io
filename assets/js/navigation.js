document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownLinks = document.querySelectorAll('.nav-link.has-dropdown');
    const body = document.body;

    // Track touch start position for swipe detection
    let touchStartX = 0;
    let touchEndX = 0;

    // Focus trap elements
    const focusableElements = navMenu.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Mobile menu toggle with animation timing
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
        });
    }

    // Handle menu toggle
    function toggleMenu(open) {
        mobileMenuButton.setAttribute('aria-expanded', open);
        navMenu.classList.toggle('active', open);

        if (open) {
            // Lock body scroll
            body.style.overflow = 'hidden';

            // Announce menu state to screen readers
            announceToScreenReader('Navigation menu opened');

            // Reset dropdowns
            dropdownLinks.forEach(link => {
                link.setAttribute('aria-expanded', 'false');
                const dropdown = link.nextElementSibling;
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });

            // Set focus trap
            document.addEventListener('keydown', handleFocusTrap);
        } else {
            // Restore body scroll
            body.style.overflow = '';

            // Announce menu state to screen readers
            announceToScreenReader('Navigation menu closed');

            // Remove focus trap
            document.removeEventListener('keydown', handleFocusTrap);
        }
    }

    // Handle dropdowns with improved touch support
    dropdownLinks.forEach(link => {
        const dropdown = link.nextElementSibling;

        if (dropdown) {
            // Touch handling
            link.addEventListener('touchstart', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';

                    // Close other dropdowns
                    dropdownLinks.forEach(otherLink => {
                        if (otherLink !== link) {
                            otherLink.setAttribute('aria-expanded', 'false');
                            const otherDropdown = otherLink.nextElementSibling;
                            if (otherDropdown) {
                                otherDropdown.style.display = 'none';
                            }
                        }
                    });

                    // Toggle current dropdown
                    this.setAttribute('aria-expanded', !isExpanded);
                    dropdown.style.display = isExpanded ? 'none' : 'block';

                    // Announce dropdown state
                    announceToScreenReader(
                        `${link.textContent} dropdown menu ${isExpanded ? 'closed' : 'opened'}`
                    );
                }
            });

            // Mouse handling for desktop
            link.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) {
                    this.setAttribute('aria-expanded', 'true');
                    dropdown.style.display = 'block';
                }
            });

            link.parentElement.addEventListener('mouseleave', function() {
                if (window.innerWidth > 768) {
                    link.setAttribute('aria-expanded', 'false');
                    dropdown.style.display = 'none';
                }
            });
        }
    });

    // Swipe to close menu
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0 && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        }
    }

    // Focus trap handling
    function handleFocusTrap(e) {
        const isTabPressed = e.key === 'Tab';

        if (!isTabPressed) return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }

    // Screen reader announcements
    function announceToScreenReader(message) {
        let announce = document.createElement('div');
        announce.setAttribute('aria-live', 'polite');
        announce.setAttribute('aria-atomic', 'true');
        announce.classList.add('sr-only');
        announce.textContent = message;
        document.body.appendChild(announce);

        setTimeout(() => {
            document.body.removeChild(announce);
        }, 1000);
    }

    // Close menu on click outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !e.target.closest('.nav-container')) {
            toggleMenu(false);
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                body.style.overflow = '';
                navMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');

                dropdownLinks.forEach(link => {
                    link.setAttribute('aria-expanded', 'false');
                    const dropdown = link.nextElementSibling;
                    if (dropdown) {
                        dropdown.style.display = '';
                    }
                });
            }
        }, 250);
    });
});
