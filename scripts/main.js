/* Space Club Recruitment Landing Page - Main JavaScript */

class SpaceClubLanding {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupAccessibility();
    }
    
    initializeElements() {
        // Get DOM elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContent = document.getElementById('main-content');
        this.microsoftBtn = document.querySelector('.btn-microsoft');
        this.formBtn = document.querySelector('.btn-form');
        this.steps = document.querySelectorAll('.step');
        this.buttons = document.querySelectorAll('.btn');
        
        // Initialize state
        this.isLoading = true;
        this.hasInteracted = false;
    }
    
    setupEventListeners() {
        // Button click handlers
        if (this.microsoftBtn) {
            this.microsoftBtn.addEventListener('click', (e) => this.handleMicrosoftClick(e));
        }
        
        if (this.formBtn) {
            this.formBtn.addEventListener('click', (e) => this.handleFormClick(e));
        }
        
        // Check if device supports hover
        const hasHover = window.matchMedia('(hover: hover)').matches;
        
        if (hasHover) {
            // Desktop hover effects
            this.buttons.forEach(btn => {
                btn.addEventListener('mouseenter', () => this.handleButtonHover(btn));
                btn.addEventListener('mouseleave', () => this.handleButtonLeave(btn));
            });
            
            this.steps.forEach(step => {
                step.addEventListener('mouseenter', () => this.handleStepHover(step));
                step.addEventListener('mouseleave', () => this.handleStepLeave(step));
            });
        } else {
            // Mobile touch effects
            this.buttons.forEach(btn => {
                btn.addEventListener('touchstart', () => this.handleButtonTouchStart(btn));
                btn.addEventListener('touchend', () => this.handleButtonTouchEnd(btn));
            });
        }
        
        // Universal event listeners
        this.buttons.forEach(btn => {
            btn.addEventListener('focus', () => this.handleButtonFocus(btn));
            btn.addEventListener('blur', () => this.handleButtonBlur(btn));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Mobile-specific optimizations
        this.setupMobileOptimizations();
    }
    
    initializeAnimations() {
        // Add entrance animations
        this.addEntranceAnimations();
        
        // Initialize particle effects
        this.initializeParticleEffects();
        
        // Setup smooth scrolling
        this.setupSmoothScrolling();
    }
    
    addEntranceAnimations() {
        // Staggered animation for steps
        this.steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
        
        // Button entrance animations
        this.buttons.forEach((btn, index) => {
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }, 600 + (index * 150));
        });
    }
    
    initializeParticleEffects() {
        // Create floating particles around buttons
        this.buttons.forEach(btn => {
            this.createButtonParticles(btn);
        });
    }
    
    createButtonParticles(button) {
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'button-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                animation: particleFloat 3s ease-in-out infinite;
                animation-delay: ${i * 0.6}s;
            `;
            
            button.style.position = 'relative';
            button.appendChild(particle);
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation triggers
        const animateElements = document.querySelectorAll('.step, .btn, .content-card');
        animateElements.forEach(el => observer.observe(el));
    }
    
    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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
    }
    
    handleMicrosoftClick(e) {
        e.preventDefault();
        
        // Add click animation
        this.addClickAnimation(this.microsoftBtn);
        
        // Track interaction
        this.trackInteraction('microsoft_button_click');
        
        // Open Microsoft account page
        setTimeout(() => {
            window.open('https://account.microsoft.com/account', '_blank', 'noopener,noreferrer');
        }, 300);
    }
    
    handleFormClick(e) {
        // Don't prevent default - let the link work normally
        // Add click animation
        this.addClickAnimation(this.formBtn);
        
        // Track interaction
        this.trackInteraction('form_button_click');
        
        // The link will open in new tab automatically due to target="_blank"
    }
    
    showFormPlaceholder() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Recruitment Form</h3>
                <p>Please ensure you have created your Microsoft account first, then return here to access the recruitment form.</p>
                <button class="notification-close">Got it!</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-primary);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: var(--spacing-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Handle close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    handleButtonHover(button) {
        button.style.transform = 'translateY(-3px) scale(1.02)';
        button.style.boxShadow = '0 8px 25px rgba(122, 162, 255, 0.4)';
    }
    
    handleButtonLeave(button) {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '';
    }
    
    handleButtonFocus(button) {
        button.style.outline = '2px solid var(--accent-primary)';
        button.style.outlineOffset = '2px';
    }
    
    handleButtonBlur(button) {
        button.style.outline = '';
        button.style.outlineOffset = '';
    }
    
    handleStepHover(step) {
        const number = step.querySelector('.step-number');
        if (number) {
            number.style.transform = 'scale(1.1) rotate(5deg)';
        }
    }
    
    handleStepLeave(step) {
        const number = step.querySelector('.step-number');
        if (number) {
            number.style.transform = 'scale(1) rotate(0deg)';
        }
    }
    
    addClickAnimation(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    // Mobile touch handlers
    handleButtonTouchStart(button) {
        button.style.transform = 'scale(0.98)';
        button.style.opacity = '0.8';
    }
    
    handleButtonTouchEnd(button) {
        button.style.transform = 'scale(1)';
        button.style.opacity = '1';
    }
    
    setupMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Optimize for mobile performance
        if (window.innerWidth <= 768) {
            // Disable heavy animations on mobile
            this.disableHeavyAnimations();
            
            // Fix title visibility on mobile
            this.fixMobileTitleVisibility();
            
            // Optimize scroll performance
            document.addEventListener('scroll', () => {
                // Throttle scroll events
                if (!this.scrollTimeout) {
                    this.scrollTimeout = setTimeout(() => {
                        this.scrollTimeout = null;
                    }, 16); // ~60fps
                }
            }, { passive: true });
        }
        
        // Handle orientation changes
        this.setupOrientationHandling();
    }
    
    fixMobileTitleVisibility() {
        const mainTitle = document.querySelector('.main-title');
        const titleLines = document.querySelectorAll('.title-line');
        
        if (mainTitle) {
            // Force title visibility on mobile with image-matching style
            mainTitle.style.background = 'none';
            mainTitle.style.webkitBackgroundClip = 'unset';
            mainTitle.style.webkitTextFillColor = 'unset';
            mainTitle.style.backgroundClip = 'unset';
            mainTitle.style.color = '#7aa2ff'; // Match the image color
            mainTitle.style.textShadow = '0 0 20px rgba(122, 162, 255, 0.8), 0 0 40px rgba(122, 162, 255, 0.6), 0 0 60px rgba(122, 162, 255, 0.4)';
            mainTitle.style.display = 'block';
            mainTitle.style.visibility = 'visible';
            mainTitle.style.opacity = '1';
            mainTitle.style.position = 'relative';
            mainTitle.style.zIndex = '10';
            mainTitle.style.fontFamily = "'Orbitron', monospace";
            mainTitle.style.fontWeight = '900';
            mainTitle.style.textTransform = 'uppercase';
            mainTitle.style.letterSpacing = '2px';
        }
        
        titleLines.forEach(line => {
            line.style.background = 'none';
            line.style.webkitBackgroundClip = 'unset';
            line.style.webkitTextFillColor = 'unset';
            line.style.backgroundClip = 'unset';
            line.style.color = '#7aa2ff'; // Match the image color
            line.style.textShadow = '0 0 20px rgba(122, 162, 255, 0.8), 0 0 40px rgba(122, 162, 255, 0.6), 0 0 60px rgba(122, 162, 255, 0.4)';
            line.style.visibility = 'visible';
            line.style.opacity = '1';
            line.style.fontFamily = "'Orbitron', monospace";
            line.style.fontWeight = '900';
            line.style.textTransform = 'uppercase';
            line.style.letterSpacing = '2px';
        });
    }
    
    setupOrientationHandling() {
        let orientationChangeTimeout;
        let currentOrientation = this.getOrientation();
        
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            // Clear any existing timeout
            if (orientationChangeTimeout) {
                clearTimeout(orientationChangeTimeout);
            }
            
            // Add orientation change class for animations
            document.body.classList.add('orientation-changing');
            
            // Handle the orientation change after a short delay
            orientationChangeTimeout = setTimeout(() => {
                const newOrientation = this.getOrientation();
                
                if (newOrientation !== currentOrientation) {
                    currentOrientation = newOrientation;
                    this.handleOrientationChange(newOrientation);
                }
                
                // Remove the changing class after animation
                setTimeout(() => {
                    document.body.classList.remove('orientation-changing');
                }, 300);
            }, 100);
        });
        
        // Also listen for resize events (for devices that don't fire orientationchange)
        window.addEventListener('resize', () => {
            if (orientationChangeTimeout) {
                clearTimeout(orientationChangeTimeout);
            }
            
            orientationChangeTimeout = setTimeout(() => {
                const newOrientation = this.getOrientation();
                if (newOrientation !== currentOrientation) {
                    currentOrientation = newOrientation;
                    this.handleOrientationChange(newOrientation);
                }
            }, 250);
        });
    }
    
    getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
    
    handleOrientationChange(orientation) {
        console.log(`Orientation changed to: ${orientation}`);
        
        // Update body class for CSS targeting
        document.body.classList.remove('orientation-portrait', 'orientation-landscape');
        document.body.classList.add(`orientation-${orientation}`);
        
        // Show orientation change indicator
        this.showOrientationIndicator(orientation);
        
        // Adjust layout based on orientation
        if (orientation === 'landscape') {
            this.optimizeForLandscape();
        } else {
            this.optimizeForPortrait();
        }
        
        // Recalculate positions and sizes
        this.recalculateLayout();
        
        // Track orientation change
        this.trackInteraction(`orientation_change_${orientation}`);
    }
    
    showOrientationIndicator(orientation) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.orientation-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create orientation indicator
        const indicator = document.createElement('div');
        indicator.className = 'orientation-indicator';
        indicator.innerHTML = `
            <div class="indicator-content">
                <span class="indicator-icon">📱</span>
                <span class="indicator-text">${orientation === 'landscape' ? 'Landscape' : 'Portrait'} Mode</span>
            </div>
        `;
        
        // Style the indicator
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-primary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            padding: 8px 12px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-size: 0.8rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        
        document.body.appendChild(indicator);
        
        // Animate in
        setTimeout(() => {
            indicator.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            indicator.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 2000);
    }
    
    optimizeForLandscape() {
        // Optimize for landscape orientation
        const contentCard = document.querySelector('.content-card');
        const actionButtons = document.querySelector('.action-buttons');
        const headerSection = document.querySelector('.header-section');
        const mainTitle = document.querySelector('.main-title');
        const mainSubtitle = document.querySelector('.main-subtitle');
        
        if (contentCard) {
            contentCard.style.maxHeight = '85vh';
            contentCard.style.overflowY = 'auto';
        }
        
        if (actionButtons) {
            // Ensure buttons are side by side in landscape
            actionButtons.style.flexDirection = 'row';
        }
        
        if (headerSection) {
            // Ensure header is visible and properly positioned
            headerSection.style.padding = 'var(--spacing-sm) 0';
            headerSection.style.minHeight = 'auto';
            headerSection.style.display = 'flex';
            headerSection.style.alignItems = 'center';
            headerSection.style.justifyContent = 'center';
            headerSection.style.visibility = 'visible';
            headerSection.style.opacity = '1';
            headerSection.style.position = 'relative';
            headerSection.style.zIndex = '10';
        }
        
        if (mainTitle) {
            // Ensure title is visible and properly sized
            mainTitle.style.fontSize = 'clamp(1.2rem, 4vw, 1.8rem)';
            mainTitle.style.lineHeight = '1.1';
            mainTitle.style.marginBottom = 'var(--spacing-xs)';
            mainTitle.style.display = 'block';
            mainTitle.style.visibility = 'visible';
            mainTitle.style.opacity = '1';
            mainTitle.style.position = 'relative';
            mainTitle.style.zIndex = '10';
        }
        
        if (mainSubtitle) {
            // Ensure subtitle is visible
            mainSubtitle.style.fontSize = 'clamp(0.8rem, 2.5vw, 1rem)';
            mainSubtitle.style.lineHeight = '1.2';
            mainSubtitle.style.display = 'block';
            mainSubtitle.style.visibility = 'visible';
            mainSubtitle.style.opacity = '1';
        }
    }
    
    optimizeForPortrait() {
        // Optimize for portrait orientation
        const contentCard = document.querySelector('.content-card');
        const actionButtons = document.querySelector('.action-buttons');
        
        if (contentCard) {
            contentCard.style.maxHeight = 'none';
            contentCard.style.overflowY = 'visible';
        }
        
        if (actionButtons) {
            // Stack buttons vertically in portrait
            actionButtons.style.flexDirection = 'column';
        }
    }
    
    recalculateLayout() {
        // Force a reflow to ensure proper layout
        document.body.offsetHeight;
        
        // Recalculate any dynamic positioning
        if (window.spaceScene && window.spaceScene.onWindowResize) {
            window.spaceScene.onWindowResize();
        }
        
        // Update any intersection observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.setupIntersectionObserver();
        }
    }
    
    disableHeavyAnimations() {
        // Disable 3D elements on mobile
        const threeCanvas = document.getElementById('three-canvas');
        if (threeCanvas) {
            threeCanvas.style.display = 'none';
        }
        
        // Reduce animation complexity
        const floatingElements = document.querySelector('.floating-elements');
        if (floatingElements) {
            floatingElements.style.display = 'none';
        }
    }
    
    handleKeyboardNavigation(e) {
        // Handle keyboard shortcuts
        switch(e.key) {
            case 'Enter':
            case ' ':
                if (document.activeElement.classList.contains('btn')) {
                    e.preventDefault();
                    document.activeElement.click();
                }
                break;
            case 'Escape':
                // Close any open modals or notifications
                const notifications = document.querySelectorAll('.form-notification');
                notifications.forEach(notification => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                        }
                    }, 300);
                });
                break;
        }
    }
    
    setupAccessibility() {
        // Add ARIA labels and roles
        this.buttons.forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                const text = btn.querySelector('.btn-text')?.textContent || btn.textContent;
                btn.setAttribute('aria-label', text);
            }
        });
        
        // Add focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track performance metrics
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Performance metrics:', {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalTime: perfData.loadEventEnd - perfData.fetchStart
                    });
                }
            }
        });
    }
    
    trackInteraction(action) {
        // Track user interactions (replace with your analytics)
        console.log(`User interaction: ${action}`);
        
        // Example: Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                'event_category': 'engagement',
                'event_label': action
            });
        }
    }
    
    // Public methods for external use
    showLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }
    
    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }
    
    refreshAnimations() {
        // Reinitialize animations if needed
        this.addEntranceAnimations();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.spaceClubLanding = new SpaceClubLanding();
    
    // Hide loading screen after a short delay (if not already hidden by Three.js)
    setTimeout(() => {
        if (window.spaceClubLanding && window.spaceClubLanding.loadingScreen) {
            window.spaceClubLanding.hideLoading();
        }
    }, 2000);
});

// Add CSS for additional animations
const additionalStyles = `
    @keyframes particleFloat {
        0%, 100% {
            opacity: 0;
            transform: translateY(0) translateX(0);
        }
        50% {
            opacity: 0.6;
            transform: translateY(-10px) translateX(5px);
        }
    }
    
    .keyboard-navigation .btn:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


