/* Space Club Recruitment Landing Page - Animation Utilities */

// Animation utility class for managing complex animations
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    // Create a smooth animation with easing
    animate(element, properties, duration = 1000, easing = 'ease-out') {
        if (this.isReducedMotion) {
            // Apply final state immediately for reduced motion
            Object.assign(element.style, properties);
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            const startTime = performance.now();
            const startValues = {};
            const endValues = {};
            
            // Parse start and end values
            Object.keys(properties).forEach(prop => {
                startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
                endValues[prop] = parseFloat(properties[prop]) || 0;
            });
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.ease(easing, progress);
                
                // Apply interpolated values
                Object.keys(properties).forEach(prop => {
                    const start = startValues[prop];
                    const end = endValues[prop];
                    const current = start + (end - start) * easedProgress;
                    element.style[prop] = current + (prop.includes('color') ? '' : 'px');
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    // Easing functions
    ease(type, t) {
        switch (type) {
            case 'ease-in':
                return t * t;
            case 'ease-out':
                return 1 - (1 - t) * (1 - t);
            case 'ease-in-out':
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 'bounce':
                return this.bounceEase(t);
            case 'elastic':
                return this.elasticEase(t);
            default:
                return t;
        }
    }
    
    bounceEase(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
    
    elasticEase(t) {
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
    }
    
    // Stagger animations for multiple elements
    stagger(elements, animationFn, delay = 100) {
        const promises = [];
        elements.forEach((element, index) => {
            const promise = new Promise(resolve => {
                setTimeout(() => {
                    animationFn(element, index).then(resolve);
                }, index * delay);
            });
            promises.push(promise);
        });
        return Promise.all(promises);
    }
    
    // Parallax effect
    createParallax(element, speed = 0.5) {
        if (this.isReducedMotion) return;
        
        let ticking = false;
        const updatePosition = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * speed;
            element.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updatePosition);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
        
        // Return cleanup function
        return () => window.removeEventListener('scroll', requestTick);
    }
    
    // Typing effect
    typeWriter(element, text, speed = 50) {
        if (this.isReducedMotion) {
            element.textContent = text;
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            element.textContent = '';
            let i = 0;
            
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            
            type();
        });
    }
    
    // Pulse animation
    pulse(element, duration = 1000) {
        if (this.isReducedMotion) return;
        
        const originalScale = element.style.transform;
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = originalScale + ' scale(1.1)';
        
        setTimeout(() => {
            element.style.transform = originalScale;
        }, duration);
    }
    
    // Shake animation
    shake(element, intensity = 10, duration = 500) {
        if (this.isReducedMotion) return;
        
        const originalTransform = element.style.transform;
        const shakes = 10;
        const shakeDuration = duration / shakes;
        
        for (let i = 0; i < shakes; i++) {
            setTimeout(() => {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                element.style.transform = originalTransform + ` translate(${x}px, ${y}px)`;
            }, i * shakeDuration);
        }
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, duration);
    }
    
    // Fade in animation
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
    
    // Slide in animation
    slideIn(element, direction = 'up', duration = 500) {
        const directions = {
            up: 'translateY(50px)',
            down: 'translateY(-50px)',
            left: 'translateX(50px)',
            right: 'translateX(-50px)'
        };
        
        element.style.opacity = '0';
        element.style.transform = directions[direction] || directions.up;
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
    }
}

// Particle system for background effects
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            size: options.size || 2,
            speed: options.speed || 1,
            color: options.color || '#7aa2ff',
            opacity: options.opacity || 0.6,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }
        
        this.animate();
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${this.options.size}px;
            height: ${this.options.size}px;
            background: ${this.options.color};
            border-radius: 50%;
            opacity: ${this.options.opacity};
            pointer-events: none;
            z-index: 0;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation properties
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 10;
        
        particle.style.animation = `particleFloat ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
    
    animate() {
        // Animation is handled by CSS
    }
    
    destroy() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }
}

// Mouse trail effect
class MouseTrail {
    constructor(options = {}) {
        this.options = {
            length: options.length || 20,
            color: options.color || '#7aa2ff',
            size: options.size || 3,
            ...options
        };
        
        this.points = [];
        this.trail = [];
        this.init();
    }
    
    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        // Create trail elements
        for (let i = 0; i < this.options.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'mouse-trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${this.options.size}px;
                height: ${this.options.size}px;
                background: ${this.options.color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / this.options.length};
                transform: scale(${1 - i / this.options.length});
            `;
            document.body.appendChild(dot);
            this.trail.push(dot);
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.points.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            // Keep only recent points
            if (this.points.length > this.options.length) {
                this.points.shift();
            }
            
            this.updateTrail();
        });
    }
    
    updateTrail() {
        this.trail.forEach((dot, index) => {
            const point = this.points[this.points.length - 1 - index];
            if (point) {
                dot.style.left = point.x + 'px';
                dot.style.top = point.y + 'px';
            }
        });
    }
    
    destroy() {
        this.trail.forEach(dot => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        });
        this.trail = [];
        this.points = [];
    }
}

// Initialize animation utilities
const animationManager = new AnimationManager();

// Export for global use
window.AnimationManager = AnimationManager;
window.ParticleSystem = ParticleSystem;
window.MouseTrail = MouseTrail;
window.animationManager = animationManager;

// Add CSS for particle animations
const particleStyles = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
    }
    
    .particle {
        will-change: transform, opacity;
    }
    
    .mouse-trail-dot {
        will-change: transform, left, top;
        transition: all 0.1s ease-out;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);


