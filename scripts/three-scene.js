/* Space Club Recruitment Landing Page - Three.js 3D Scene */

class SpaceScene {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stars = [];
        this.geometricShapes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Check if WebGL is supported
        if (!this.canvas) {
            console.warn('Three.js canvas not found, falling back to CSS animations');
            return;
        }
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            console.log('Mobile device detected, disabling 3D scene for performance');
            this.canvas.style.display = 'none';
            return;
        }
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        
        // Renderer setup with mobile optimizations
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: !isMobile, // Disable antialiasing on mobile for performance
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Lighting
        this.setupLighting();
        
        // Create 3D elements (reduced complexity on mobile)
        this.createStarfield();
        if (!isMobile) {
            this.createGeometricShapes();
            this.createParticleSystem();
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x7aa2ff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Point lights for glow effects
        const pointLight1 = new THREE.PointLight(0x7aa2ff, 0.5, 100);
        pointLight1.position.set(-20, 10, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x9b7aff, 0.5, 100);
        pointLight2.position.set(20, -10, -20);
        this.scene.add(pointLight2);
    }
    
    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            const radius = 100 + Math.random() * 200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Random colors (white to blue)
            const color = new THREE.Color();
            color.setHSL(0.6, 0.8, 0.5 + Math.random() * 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Random sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + 0.3 * sin(time + position.x));
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    float alpha = 1.0 - distance * 2.0;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);
        this.stars.push(starField);
    }
    
    createGeometricShapes() {
        // Dodecahedron
        const dodecahedronGeometry = new THREE.DodecahedronGeometry(8, 0);
        const dodecahedronMaterial = new THREE.MeshPhongMaterial({
            color: 0x7aa2ff,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
        dodecahedron.position.set(-30, 20, -20);
        this.scene.add(dodecahedron);
        this.geometricShapes.push(dodecahedron);
        
        // Icosahedron
        const icosahedronGeometry = new THREE.IcosahedronGeometry(6, 0);
        const icosahedronMaterial = new THREE.MeshPhongMaterial({
            color: 0x9b7aff,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
        icosahedron.position.set(25, -15, 15);
        this.scene.add(icosahedron);
        this.geometricShapes.push(icosahedron);
        
        // Octahedron
        const octahedronGeometry = new THREE.OctahedronGeometry(5, 0);
        const octahedronMaterial = new THREE.MeshPhongMaterial({
            color: 0x62ffa7,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
        octahedron.position.set(0, 30, -30);
        this.scene.add(octahedron);
        this.geometricShapes.push(octahedron);
    }
    
    createParticleSystem() {
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions
            particlePositions[i3] = (Math.random() - 0.5) * 200;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 200;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 200;
            
            // Random colors
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6);
            particleColors[i3] = color.r;
            particleColors[i3 + 1] = color.g;
            particleColors[i3 + 2] = color.b;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particleSystem);
        this.stars.push(particleSystem);
    }
    
    setupEventListeners() {
        // Mouse movement for parallax effect
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Touch events for mobile
        document.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    animate() {
        if (!this.renderer) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Update starfield
        this.stars.forEach((starField, index) => {
            if (starField.material.uniforms && starField.material.uniforms.time) {
                starField.material.uniforms.time.value = time;
            }
            starField.rotation.y = time * 0.1 * (index + 1);
        });
        
        // Update geometric shapes
        this.geometricShapes.forEach((shape, index) => {
            shape.rotation.x = time * 0.5 * (index + 1);
            shape.rotation.y = time * 0.3 * (index + 1);
            shape.rotation.z = time * 0.2 * (index + 1);
            
            // Floating animation
            shape.position.y += Math.sin(time + index) * 0.02;
        });
        
        // Parallax camera movement
        if (this.camera) {
            this.camera.position.x += (this.mouseX * 5 - this.camera.position.x) * 0.05;
            this.camera.position.y += (this.mouseY * 5 - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.scene.position);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up event listeners
        window.removeEventListener('resize', () => this.onWindowResize());
    }
}

// Initialize the 3D scene when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        try {
            const spaceScene = new SpaceScene();
            
            // Hide loading screen after 3D scene is ready
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 1000);
            
            // Store reference for cleanup
            window.spaceScene = spaceScene;
        } catch (error) {
            console.warn('Failed to initialize 3D scene:', error);
            // Fallback: hide loading screen anyway
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 500);
        }
    } else {
        console.warn('Three.js not available, using CSS fallback');
        // Fallback: hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 500);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.spaceScene) {
        window.spaceScene.destroy();
    }
});


